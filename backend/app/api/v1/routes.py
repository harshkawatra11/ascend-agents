from fastapi import APIRouter, Depends

from app.api.deps import (
    get_district_service,
    get_forecast_service,
    get_recommendation_service,
)
from app.schemas.recommendation import RecommendationResolveRequest
from app.services.district_service import DistrictService
from app.services.forecast_service import ForecastService
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/api/v1", tags=["district"])


@router.get("/district")
def district_summary(svc: DistrictService = Depends(get_district_service)):
    return svc.district_summary()


@router.get("/facilities")
def list_facilities(svc: DistrictService = Depends(get_district_service)):
    return {"facilities": svc.facilities_overview()}


@router.get("/facilities/{facility_id}")
def facility_detail(
    facility_id: str, svc: DistrictService = Depends(get_district_service)
):
    return svc.facility_detail(facility_id)


@router.get("/medicines")
def medicine_forecasts(fc: ForecastService = Depends(get_forecast_service)):
    return {"medicines": fc.all_medicine_forecasts()}


@router.get("/footfall/forecast")
def footfall_forecast(fc: ForecastService = Depends(get_forecast_service)):
    return fc.footfall_forecast()


@router.get("/beds/forecast")
def beds_forecast(
    facility_id: str | None = None, fc: ForecastService = Depends(get_forecast_service)
):
    if facility_id:
        return fc.bed_forecast(facility_id)
    return {"beds": [fc.bed_forecast(f["id"]) for f in fc.repo.facilities]}


@router.get("/doctors/attendance")
def doctor_attendance(fc: ForecastService = Depends(get_forecast_service)):
    return {"doctors": fc.doctor_attendance_risk()}


@router.get("/diagnostics")
def diagnostics(fc: ForecastService = Depends(get_forecast_service)):
    return {"diagnostics": fc.repo.diagnostics}


@router.get("/recommendations")
def list_recommendations(
    status: str | None = None,
    rec_svc: RecommendationService = Depends(get_recommendation_service),
):
    return {"recommendations": rec_svc.list(status=status)}


@router.post("/recommendations/{rec_id}/approve")
def approve_recommendation(
    rec_id: str,
    body: RecommendationResolveRequest | None = None,
    rec_svc: RecommendationService = Depends(get_recommendation_service),
):
    qty = body.quantity_override if body else None
    resolved_by = body.resolved_by if body else None
    return rec_svc.resolve(rec_id, "approved", quantity_override=qty, resolved_by=resolved_by)


@router.post("/recommendations/{rec_id}/reject")
def reject_recommendation(
    rec_id: str,
    body: RecommendationResolveRequest | None = None,
    rec_svc: RecommendationService = Depends(get_recommendation_service),
):
    resolved_by = body.resolved_by if body else None
    return rec_svc.resolve(rec_id, "rejected", resolved_by=resolved_by)


@router.post("/recommendations/{rec_id}/modify")
def modify_recommendation(
    rec_id: str,
    body: RecommendationResolveRequest,
    rec_svc: RecommendationService = Depends(get_recommendation_service),
):
    return rec_svc.resolve(
        rec_id, "modified", quantity_override=body.quantity_override, resolved_by=body.resolved_by
    )


@router.get("/audit-log")
def audit_log(rec_svc: RecommendationService = Depends(get_recommendation_service)):
    return {"entries": rec_svc.audit_log()}


@router.get("/agents/trace")
def agents_trace(rec_svc: RecommendationService = Depends(get_recommendation_service)):
    """Re-runs the real recommendation engine, instrumented, and returns every
    decision step it actually took with true elapsed timing. Does not mutate
    live recommendation state."""
    return rec_svc.run_traced_cycle()


@router.get("/alerts")
def alerts(
    severity: str | None = None,
    fc: ForecastService = Depends(get_forecast_service),
):
    generated = []
    for f in fc.repo.facilities:
        risk = fc.facility_risk_level(f["id"])
        if risk in ("critical", "stress"):
            generated.append(
                {
                    "id": f"alert_{f['id']}",
                    "facility_id": f["id"],
                    "severity": "critical" if risk == "critical" else "warning",
                    "title": f"{f['name']} flagged {risk}",
                }
            )
    if severity:
        generated = [a for a in generated if a["severity"] == severity]
    return {"alerts": generated}


@router.get("/analytics/causal-chain/{facility_id}")
def causal_chain(
    facility_id: str, svc: DistrictService = Depends(get_district_service)
):
    return svc.causal_chain(facility_id)


@router.get("/performance")
def performance(svc: DistrictService = Depends(get_district_service)):
    return {"performance": svc.performance_scores()}
