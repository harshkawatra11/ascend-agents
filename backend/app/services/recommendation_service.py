"""Recommendation engine: detect risk -> search surplus -> rank -> recommend.

Implements the heuristic in docs/07-recommendation-engine.md. The engine only
ever proposes: state transitions to approved/rejected/modified happen exclusively
through RecommendationService.resolve(), mirroring the human-in-the-loop contract.
"""

from __future__ import annotations

import logging
import math
from datetime import UTC, datetime
from itertools import count

from app.core.exceptions import RecommendationNotFoundError
from app.repositories.district_repository import DistrictRepository
from app.services.forecast_service import ForecastService

logger = logging.getLogger("swasthyagrid")

_id_counter = count(1)


def _haversine_km(lat1, lng1, lat2, lng2) -> float:
    r = 6371
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


class RecommendationService:
    """Holds in-memory recommendation state for the prototype session."""

    def __init__(self, repo: DistrictRepository, forecast: ForecastService):
        self.repo = repo
        self.forecast = forecast
        self._recommendations: dict[str, dict] = {}
        self._audit_log: list[dict] = []
        self._generate_stock_transfer_recommendations()
        self._seed_extra_recommendations()

    def _generate_stock_transfer_recommendations(self) -> None:
        safety_stock_days = 5

        for facility in self.repo.facilities:
            for med in self.forecast.medicine_forecast(facility["id"]):
                if med["risk"] != "high":
                    continue

                candidates = []
                for other in self.repo.facilities:
                    if other["id"] == facility["id"]:
                        continue
                    other_stock = next(
                        (
                            m
                            for m in self.repo.medicine_stock_for(other["id"])
                            if m["medicine_name"] == med["medicine_name"]
                        ),
                        None,
                    )
                    if not other_stock:
                        continue
                    surplus = other_stock["units_remaining"] - (
                        other_stock["avg_daily_consumption"] * safety_stock_days
                    )
                    if surplus <= 0:
                        continue
                    distance = _haversine_km(
                        facility["lat"], facility["lng"], other["lat"], other["lng"]
                    )
                    candidates.append((distance, surplus, other))

                if not candidates:
                    continue

                candidates.sort(key=lambda c: (c[0], -c[1]))
                distance, surplus, source = candidates[0]

                target_stock = next(
                    m
                    for m in self.repo.medicine_stock_for(facility["id"])
                    if m["medicine_name"] == med["medicine_name"]
                )
                deficit_to_safety = (
                    target_stock["avg_daily_consumption"] * safety_stock_days
                    - target_stock["units_remaining"]
                )
                quantity = int(min(deficit_to_safety, surplus))
                if quantity <= 0:
                    continue

                forecast_conf = med["confidence"]
                factor_score = min(len(med["factors"]) * 10, 30)
                logistics_score = max(0, 20 - distance)
                safety_margin_score = 10 if surplus - quantity > 0 else 5
                confidence = round(
                    forecast_conf * 0.4
                    + factor_score
                    + logistics_score * (20 / 20)
                    + safety_margin_score,
                )
                confidence = min(confidence, 99)

                reasons = [
                    f"Projected stock depletion in {med['days_remaining']} days",
                    *med["factors"],
                    f"{source['name']} has surplus, {round(distance)} km away",
                ]

                rec_id = f"rec_{next(_id_counter):03d}"
                self._recommendations[rec_id] = {
                    "id": rec_id,
                    "type": "stock_transfer",
                    "source_facility_id": source["id"],
                    "target_facility_id": facility["id"],
                    "subject": med["medicine_name"],
                    "quantity_or_detail": f"{quantity} units",
                    "confidence": confidence,
                    "reasons": reasons,
                    "status": "pending",
                }

    def _seed_extra_recommendations(self) -> None:
        """Bed-redirect and staff-transfer recommendations (heuristic, illustrative)."""
        for bed in self.repo.beds:
            if bed["predicted_occupancy_next_week_pct"] > 90:
                candidates = [
                    f
                    for f in self.repo.facilities
                    if f["id"] != bed["facility_id"] and f["type"] == "CHC"
                ]
                if not candidates:
                    continue
                target = candidates[0]
                rec_id = f"rec_{next(_id_counter):03d}"
                self._recommendations[rec_id] = {
                    "id": rec_id,
                    "type": "bed_redirect",
                    "source_facility_id": bed["facility_id"],
                    "target_facility_id": target["id"],
                    "subject": "Maternity Cases",
                    "quantity_or_detail": "Redirect new admissions",
                    "confidence": 88,
                    "reasons": [
                        f"Bed occupancy forecast: "
                        f"{bed['predicted_occupancy_next_week_pct']}% next week",
                        f"{target['name']} has available maternity capacity",
                    ],
                    "status": "pending",
                }

        for doctor in self.repo.doctors:
            if doctor["risk_level"] == "high":
                candidates = [
                    f for f in self.repo.facilities if f["id"] != doctor["facility_id"]
                ]
                if not candidates:
                    continue
                source = candidates[0]
                rec_id = f"rec_{next(_id_counter):03d}"
                self._recommendations[rec_id] = {
                    "id": rec_id,
                    "type": "staff_transfer",
                    "source_facility_id": source["id"],
                    "target_facility_id": doctor["facility_id"],
                    "subject": f"{doctor['doctor_name']} ({doctor['specialty']})",
                    "quantity_or_detail": "Temporary 2-week transfer",
                    "confidence": 81,
                    "reasons": [
                        f"Doctor absent {doctor['absence_pattern']}",
                        f"Projected patient delay of {doctor['patient_delay_pct']}% if unresolved",
                        f"{source['name']} has attendance slack this cycle",
                    ],
                    "status": "pending",
                }

    def list(self, status: str | None = None) -> list[dict]:
        values = list(self._recommendations.values())
        if status:
            values = [r for r in values if r["status"] == status]
        return sorted(values, key=lambda r: -r["confidence"])

    def resolve(
        self,
        rec_id: str,
        status: str,
        quantity_override: str | None = None,
        resolved_by: str | None = None,
    ) -> dict:
        if rec_id not in self._recommendations:
            raise RecommendationNotFoundError(rec_id)
        rec = self._recommendations[rec_id]
        previous_status = rec["status"]
        rec["status"] = status
        if quantity_override:
            rec["quantity_or_detail"] = quantity_override
        self._log_resolution(rec, previous_status, status, quantity_override, resolved_by)
        return rec

    def _log_resolution(
        self,
        rec: dict,
        previous_status: str,
        new_status: str,
        quantity_override: str | None,
        resolved_by: str | None,
    ) -> None:
        """Append every human decision to an audit trail. Best-effort persists to
        Firestore (falls back silently to the in-memory list, mirroring the read
        path's own Firestore-or-seed pattern) so 'every AI-surfaced recommendation
        has a recorded human decision' is demonstrable, not just asserted."""
        entry = {
            "rec_id": rec["id"],
            "type": rec["type"],
            "subject": rec["subject"],
            "previous_status": previous_status,
            "new_status": new_status,
            "quantity_override": quantity_override,
            "confidence": rec["confidence"],
            "resolved_by": resolved_by or "district_admin",
            "resolved_at": datetime.now(UTC).isoformat(),
        }
        self._audit_log.append(entry)

        try:
            client = self.repo.get_firestore_client()
            if client is not None:
                client.collection("approval_log").add(entry)
        except Exception:
            logger.warning("Failed to persist approval to Firestore audit log.", exc_info=True)

    def audit_log(self) -> list[dict]:
        return sorted(self._audit_log, key=lambda e: e["resolved_at"], reverse=True)
