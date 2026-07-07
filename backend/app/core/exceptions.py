class SwasthyaGridError(Exception):
    """Base domain exception."""


class FacilityNotFoundError(SwasthyaGridError):
    def __init__(self, facility_id: str):
        super().__init__(f"Facility '{facility_id}' not found")
        self.facility_id = facility_id


class RecommendationNotFoundError(SwasthyaGridError):
    def __init__(self, recommendation_id: str):
        super().__init__(f"Recommendation '{recommendation_id}' not found")
        self.recommendation_id = recommendation_id


class MapsAPIException(SwasthyaGridError):
    def __init__(self, message: str):
        super().__init__(f"Maps API Error: {message}")
