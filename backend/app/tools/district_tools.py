"""Gemini-callable tool functions.

Each function wraps the same services/ layer used by the REST API, so Gemini's
tool calls apply the identical business rules as a human hitting the endpoints
directly (see docs/01-architecture.md — agents/tools never bypass services).
"""

from app.services.district_service import DistrictService
from app.services.forecast_service import ForecastService
from app.services.recommendation_service import RecommendationService


def build_tools(
    district: DistrictService,
    forecast: ForecastService,
    recommendation: RecommendationService,
) -> list:
    def get_district_overview() -> dict:
        """Return the district-wide summary: all facilities and their risk levels."""
        return district.district_summary()

    def get_facility_detail(facility_id: str) -> dict:
        """Return full detail for one facility: stock, beds, doctors, diagnostics.

        Args:
            facility_id: the facility id, e.g. "phc_18".
        """
        return district.facility_detail(facility_id)

    def get_medicine_stock() -> dict:
        """Return medicine stock levels and stock-out risk across every facility in the district."""
        return {"medicines": forecast.all_medicine_forecasts()}

    def get_footfall_forecast() -> dict:
        """Return the district's 7-day patient footfall forecast and tomorrow's demographic breakdown."""
        return forecast.footfall_forecast()

    def get_recommendations() -> dict:
        """Return current pending AI recommendations (resource transfers, staffing, bed redirects)."""
        return {"recommendations": recommendation.list(status="pending")}

    def get_causal_chain(facility_id: str) -> dict:
        """Return the causal 'why' chain explaining a demand spike at a facility.

        Args:
            facility_id: the facility id, e.g. "phc_18".
        """
        return district.causal_chain(facility_id)

    def get_performance_scores() -> dict:
        """Return performance scorecards (overall + sub-scores) for every facility."""
        return {"performance": district.performance_scores()}

    return [
        get_district_overview,
        get_facility_detail,
        get_medicine_stock,
        get_footfall_forecast,
        get_recommendations,
        get_causal_chain,
        get_performance_scores,
    ]
