"""Deterministic mock forecast generators.

Every prediction returns {value, confidence, factors[]} — never a bare
number — per the explainability contract in docs/05-ai-engine.md. Real
XGBoost/LightGBM models are designed to slot in here later (docs/06-forecasting.md)
without changing this service's public interface.
"""

from app.repositories.district_repository import DistrictRepository


def _risk_from_days(days_remaining: float) -> str:
    if days_remaining < 3:
        return "high"
    if days_remaining < 6:
        return "medium"
    return "low"


class ForecastService:
    def __init__(self, repo: DistrictRepository):
        self.repo = repo

    def medicine_forecast(self, facility_id: str) -> list[dict]:
        results = []
        factors = self.repo.demand_factors_for(facility_id)
        for stock in self.repo.medicine_stock_for(facility_id):
            days_remaining = round(
                stock["units_remaining"] / stock["avg_daily_consumption"], 1
            )
            risk = _risk_from_days(days_remaining)
            confidence = 90 if factors else 80
            results.append(
                {
                    "facility_id": facility_id,
                    "medicine_name": stock["medicine_name"],
                    "units_remaining": stock["units_remaining"],
                    "days_remaining": days_remaining,
                    "risk": risk,
                    "confidence": confidence,
                    "factors": factors or ["Historical consumption trend"],
                }
            )
        return results

    def all_medicine_forecasts(self) -> list[dict]:
        out = []
        for facility in self.repo.facilities:
            out.extend(self.medicine_forecast(facility["id"]))
        return out

    def footfall_forecast(self) -> dict:
        return {
            "series": self.repo.footfall_forecast,
            "tomorrow_breakdown": self.repo.footfall_breakdown_tomorrow,
            "confidence": 91,
            "factors": [
                "Seasonality",
                "Historical footfall trend",
                "Nearby disease cluster signals",
                "Weather forecast",
            ],
        }

    def bed_forecast(self, facility_id: str) -> dict:
        for b in self.repo.beds:
            if b["facility_id"] == facility_id:
                total = self.repo.facility(facility_id)["beds_total"]
                return {
                    "facility_id": facility_id,
                    "occupied": b["occupied"],
                    "occupancy_pct": round(b["occupied"] / total * 100),
                    "predicted_tomorrow_pct": b["predicted_occupancy_tomorrow_pct"],
                    "predicted_next_week_pct": b["predicted_occupancy_next_week_pct"],
                    "confidence": 89,
                    "factors": ["Footfall forecast correlation", "Seasonal admission trend"],
                }
        return {}

    def doctor_attendance_risk(self) -> list[dict]:
        return [
            {
                "facility_id": d["facility_id"],
                "doctor_name": d["doctor_name"],
                "specialty": d["specialty"],
                "absence_pattern": d["absence_pattern"],
                "risk_level": d["risk_level"],
                "patient_delay_pct": d["patient_delay_pct"],
            }
            for d in self.repo.doctors
        ]

    def facility_risk_level(self, facility_id: str) -> str:
        med = self.medicine_forecast(facility_id)
        if any(m["risk"] == "high" for m in med):
            return "critical"
        bed = self.bed_forecast(facility_id)
        if any(m["risk"] == "medium" for m in med) or (
            bed and bed.get("predicted_next_week_pct", 0) > 90
        ):
            return "stress"
        doctors = [d for d in self.repo.doctors if d["facility_id"] == facility_id]
        if any(d["risk_level"] == "high" for d in doctors):
            return "monitor"
        diagnostics = [d for d in self.repo.diagnostics if d["facility_id"] == facility_id]
        if any(d["status"] != "available" for d in diagnostics):
            return "monitor"
        return "healthy"
