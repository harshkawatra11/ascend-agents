from functools import lru_cache

from app.agents.health_agent import HealthAgent
from app.core.config import get_settings
from app.repositories.district_repository import get_district_repository
from app.services.district_service import DistrictService
from app.services.forecast_service import ForecastService
from app.services.recommendation_service import RecommendationService


@lru_cache
def get_forecast_service() -> ForecastService:
    return ForecastService(get_district_repository())


@lru_cache
def get_district_service() -> DistrictService:
    return DistrictService(get_district_repository(), get_forecast_service())


@lru_cache
def get_recommendation_service() -> RecommendationService:
    return RecommendationService(get_district_repository(), get_forecast_service())


@lru_cache
def get_health_agent() -> HealthAgent:
    return HealthAgent(
        get_settings(),
        get_district_service(),
        get_forecast_service(),
        get_recommendation_service(),
    )
