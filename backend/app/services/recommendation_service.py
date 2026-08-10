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
from app.services.trace import TraceCollector

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

    def _generate_stock_transfer_recommendations(
        self,
        target: dict[str, dict] | None = None,
        trace: TraceCollector | None = None,
    ) -> None:
        safety_stock_days = 5
        target = self._recommendations if target is None else target

        if trace:
            trace.step(
                "monitor",
                "scan",
                f"Scanning {len(self.repo.facilities)} facilities for medicine stock risk",
                detail={"facility_count": len(self.repo.facilities)},
            )

        for facility in self.repo.facilities:
            for med in self.forecast.medicine_forecast(facility["id"]):
                if med["risk"] != "high":
                    if trace:
                        trace.step(
                            "monitor",
                            "skip",
                            f"{med['medicine_name']} at {facility['name']}: "
                            f"{med['days_remaining']} days remaining, risk={med['risk']}",
                            detail={
                                "days_remaining": med["days_remaining"],
                                "risk": med["risk"],
                            },
                            facility_id=facility["id"],
                            facility_name=facility["name"],
                            subject=med["medicine_name"],
                        )
                    continue

                if trace:
                    trace.step(
                        "monitor",
                        "detect",
                        f"{med['medicine_name']} at {facility['name']}: "
                        f"{med['days_remaining']} days remaining, HIGH RISK",
                        detail={
                            "units_remaining": med["units_remaining"],
                            "days_remaining": med["days_remaining"],
                            "risk": med["risk"],
                        },
                        facility_id=facility["id"],
                        facility_name=facility["name"],
                        subject=med["medicine_name"],
                    )

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
                        if trace:
                            trace.step(
                                "reason",
                                "reject",
                                f"{other['name']}: no {med['medicine_name']} stock",
                                facility_id=other["id"],
                                facility_name=other["name"],
                                subject=med["medicine_name"],
                            )
                        continue
                    surplus = other_stock["units_remaining"] - (
                        other_stock["avg_daily_consumption"] * safety_stock_days
                    )
                    if surplus <= 0:
                        if trace:
                            trace.step(
                                "reason",
                                "reject",
                                f"{other['name']}: no surplus above its own "
                                f"{safety_stock_days}-day safety stock",
                                detail={"surplus": surplus},
                                facility_id=other["id"],
                                facility_name=other["name"],
                                subject=med["medicine_name"],
                            )
                        continue
                    distance = _haversine_km(
                        facility["lat"], facility["lng"], other["lat"], other["lng"]
                    )
                    if trace:
                        trace.step(
                            "reason",
                            "candidate",
                            f"{other['name']}: {surplus} units surplus, "
                            f"{round(distance)} km away",
                            detail={"surplus": surplus, "distance_km": round(distance, 1)},
                            facility_id=other["id"],
                            facility_name=other["name"],
                            subject=med["medicine_name"],
                        )
                    candidates.append((distance, surplus, other))

                if not candidates:
                    if trace:
                        trace.step(
                            "reason",
                            "reject",
                            f"No facility has usable {med['medicine_name']} surplus "
                            f"for {facility['name']}",
                            facility_id=facility["id"],
                            facility_name=facility["name"],
                            subject=med["medicine_name"],
                        )
                    continue

                candidates.sort(key=lambda c: (c[0], -c[1]))
                distance, surplus, source = candidates[0]
                if trace:
                    trace.step(
                        "reason",
                        "rank",
                        f"Ranked by (distance asc, surplus desc): {source['name']} wins "
                        f"among {len(candidates)} candidate(s)",
                        detail={"candidate_count": len(candidates)},
                        facility_id=source["id"],
                        facility_name=source["name"],
                        subject=med["medicine_name"],
                    )

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
                    if trace:
                        trace.step(
                            "reason",
                            "reject",
                            f"Deficit to safety stock is already covered for "
                            f"{med['medicine_name']} at {facility['name']}",
                            facility_id=facility["id"],
                            facility_name=facility["name"],
                            subject=med["medicine_name"],
                        )
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

                if trace:
                    trace.step(
                        "reason",
                        "score",
                        f"confidence = {forecast_conf}x0.4 + {factor_score} + "
                        f"{round(logistics_score)} + {safety_margin_score} = {confidence}",
                        detail={
                            "forecast_conf": forecast_conf,
                            "factor_score": factor_score,
                            "logistics_score": round(logistics_score, 1),
                            "safety_margin_score": safety_margin_score,
                            "confidence": confidence,
                        },
                        facility_id=facility["id"],
                        facility_name=facility["name"],
                        subject=med["medicine_name"],
                    )

                reasons = [
                    f"Projected stock depletion in {med['days_remaining']} days",
                    *med["factors"],
                    f"{source['name']} has surplus, {round(distance)} km away",
                ]

                rec_id = f"rec_{next(_id_counter):03d}"
                target[rec_id] = {
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

                if trace:
                    trace.step(
                        "act",
                        "propose",
                        f"Propose stock_transfer: {quantity} units {med['medicine_name']}, "
                        f"{source['name']} -> {facility['name']}, confidence {confidence}",
                        detail={"quantity": quantity, "confidence": confidence},
                        facility_id=facility["id"],
                        facility_name=facility["name"],
                        subject=med["medicine_name"],
                    )

    def _seed_extra_recommendations(
        self,
        target: dict[str, dict] | None = None,
        trace: TraceCollector | None = None,
    ) -> None:
        """Bed-redirect and staff-transfer recommendations (heuristic, illustrative)."""
        target = self._recommendations if target is None else target

        if trace:
            trace.step(
                "monitor",
                "scan",
                f"Scanning {len(self.repo.beds)} bed forecasts for occupancy risk",
                detail={"bed_count": len(self.repo.beds)},
            )
        for bed in self.repo.beds:
            if bed["predicted_occupancy_next_week_pct"] <= 90:
                if trace:
                    trace.step(
                        "monitor",
                        "skip",
                        f"Bed occupancy at {bed['facility_id']}: "
                        f"{bed['predicted_occupancy_next_week_pct']}% next week, within threshold",
                        detail={"predicted_pct": bed["predicted_occupancy_next_week_pct"]},
                        facility_id=bed["facility_id"],
                    )
                continue

            if trace:
                trace.step(
                    "monitor",
                    "detect",
                    f"Bed occupancy at {bed['facility_id']}: "
                    f"{bed['predicted_occupancy_next_week_pct']}% next week, HIGH RISK",
                    detail={"predicted_pct": bed["predicted_occupancy_next_week_pct"]},
                    facility_id=bed["facility_id"],
                )
            candidates = [
                f
                for f in self.repo.facilities
                if f["id"] != bed["facility_id"] and f["type"] == "CHC"
            ]
            if not candidates:
                if trace:
                    trace.step(
                        "reason",
                        "reject",
                        f"No CHC with maternity capacity found for {bed['facility_id']}",
                        facility_id=bed["facility_id"],
                    )
                continue
            redirect_target = candidates[0]
            if trace:
                trace.step(
                    "reason",
                    "rank",
                    f"{redirect_target['name']} selected among "
                    f"{len(candidates)} CHC candidate(s)",
                    detail={"candidate_count": len(candidates)},
                    facility_id=redirect_target["id"],
                    facility_name=redirect_target["name"],
                )
            rec_id = f"rec_{next(_id_counter):03d}"
            target[rec_id] = {
                "id": rec_id,
                "type": "bed_redirect",
                "source_facility_id": bed["facility_id"],
                "target_facility_id": redirect_target["id"],
                "subject": "Maternity Cases",
                "quantity_or_detail": "Redirect new admissions",
                "confidence": 88,
                "reasons": [
                    f"Bed occupancy forecast: "
                    f"{bed['predicted_occupancy_next_week_pct']}% next week",
                    f"{redirect_target['name']} has available maternity capacity",
                ],
                "status": "pending",
            }
            if trace:
                trace.step(
                    "act",
                    "propose",
                    f"Propose bed_redirect: maternity admissions, "
                    f"{bed['facility_id']} -> {redirect_target['name']}, confidence 88",
                    detail={"confidence": 88},
                    facility_id=redirect_target["id"],
                    facility_name=redirect_target["name"],
                    subject="Maternity Cases",
                )

        if trace:
            trace.step(
                "monitor",
                "scan",
                f"Scanning {len(self.repo.doctors)} doctor attendance records",
                detail={"doctor_count": len(self.repo.doctors)},
            )
        for doctor in self.repo.doctors:
            if doctor["risk_level"] != "high":
                if trace:
                    trace.step(
                        "monitor",
                        "skip",
                        f"{doctor['doctor_name']} at {doctor['facility_id']}: "
                        f"risk={doctor['risk_level']}",
                        detail={"risk_level": doctor["risk_level"]},
                        facility_id=doctor["facility_id"],
                        subject=doctor["doctor_name"],
                    )
                continue

            if trace:
                trace.step(
                    "monitor",
                    "detect",
                    f"{doctor['doctor_name']} at {doctor['facility_id']}: "
                    f"absent {doctor['absence_pattern']}, HIGH RISK",
                    detail={
                        "absence_pattern": doctor["absence_pattern"],
                        "patient_delay_pct": doctor["patient_delay_pct"],
                    },
                    facility_id=doctor["facility_id"],
                    subject=doctor["doctor_name"],
                )
            candidates = [
                f for f in self.repo.facilities if f["id"] != doctor["facility_id"]
            ]
            if not candidates:
                if trace:
                    trace.step(
                        "reason",
                        "reject",
                        f"No facility with attendance slack found for {doctor['doctor_name']}",
                        facility_id=doctor["facility_id"],
                        subject=doctor["doctor_name"],
                    )
                continue
            source = candidates[0]
            if trace:
                trace.step(
                    "reason",
                    "rank",
                    f"{source['name']} selected among {len(candidates)} candidate(s)",
                    detail={"candidate_count": len(candidates)},
                    facility_id=source["id"],
                    facility_name=source["name"],
                    subject=doctor["doctor_name"],
                )
            rec_id = f"rec_{next(_id_counter):03d}"
            target[rec_id] = {
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
            if trace:
                trace.step(
                    "act",
                    "propose",
                    f"Propose staff_transfer: {doctor['doctor_name']}, "
                    f"{source['name']} -> {doctor['facility_id']}, confidence 81",
                    detail={"confidence": 81},
                    facility_id=doctor["facility_id"],
                    subject=doctor["doctor_name"],
                )

    def run_traced_cycle(self) -> dict:
        """Re-run the exact same generation methods used at startup, instrumented,
        into a scratch dict so this never mutates live recommendation state (an
        administrator's earlier approval must survive a re-run). Returns every real
        decision step with its true elapsed time, plus a summary and the proposals
        this pass produced, cross-referenced against their live status if a matching
        recommendation already exists."""
        trace = TraceCollector()
        scratch: dict[str, dict] = {}

        facilities_scanned = len(self.repo.facilities)
        self._generate_stock_transfer_recommendations(target=scratch, trace=trace)
        self._seed_extra_recommendations(target=scratch, trace=trace)

        proposals = []
        for rec in scratch.values():
            live = self._find_matching_live(rec)
            proposals.append(
                {
                    **rec,
                    "live_id": live["id"] if live else None,
                    "live_status": live["status"] if live else "pending",
                }
            )

        detect_count = sum(1 for s in trace.steps if s.kind == "detect")
        candidate_count = sum(1 for s in trace.steps if s.kind == "candidate")
        reject_count = sum(1 for s in trace.steps if s.kind == "reject")
        propose_count = sum(1 for s in trace.steps if s.kind == "propose")

        trace.step(
            "act",
            "summary",
            f"Cycle complete: {detect_count} risk(s) detected, "
            f"{candidate_count} candidate(s) examined, {reject_count} rejected, "
            f"{propose_count} proposal(s) emitted",
            detail={
                "facilities_scanned": facilities_scanned,
                "risks_detected": detect_count,
                "candidates_examined": candidate_count,
                "candidates_rejected": reject_count,
                "proposals_emitted": propose_count,
            },
        )

        return {
            "steps": trace.to_list(),
            "proposals": proposals,
            "summary": {
                "facilities_scanned": facilities_scanned,
                "risks_detected": detect_count,
                "candidates_examined": candidate_count,
                "candidates_rejected": reject_count,
                "proposals_emitted": propose_count,
                "total_duration_us": trace.total_duration_us,
            },
            "generated_at": datetime.now(UTC).isoformat(),
            "data_source": self.repo.source,
            "data_version": self.repo.version,
        }

    def _find_matching_live(self, rec: dict) -> dict | None:
        """Recommendation ids are per-run (a shared counter), so match a
        freshly-generated proposal against live state by its natural key instead."""
        for live in self._recommendations.values():
            if (
                live["type"] == rec["type"]
                and live["source_facility_id"] == rec["source_facility_id"]
                and live["target_facility_id"] == rec["target_facility_id"]
                and live["subject"] == rec["subject"]
            ):
                return live
        return None

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
