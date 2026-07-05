import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import get_settings
from app.core.exceptions import FacilityNotFoundError


class DistrictRepository:
    """Abstracts the district data store.

    Backed by the seeded mock JSON today; swapping to Firestore later only
    requires changing this class's internals, not its interface.
    """

    def __init__(self, seed_path: Path):
        with open(seed_path, encoding="utf-8") as f:
            self._data: dict[str, Any] = json.load(f)

    @property
    def district(self) -> dict[str, Any]:
        return self._data["district"]

    @property
    def facilities(self) -> list[dict[str, Any]]:
        return self._data["facilities"]

    def facility(self, facility_id: str) -> dict[str, Any]:
        for f in self.facilities:
            if f["id"] == facility_id:
                return f
        raise FacilityNotFoundError(facility_id)

    @property
    def medicine_stock(self) -> list[dict[str, Any]]:
        return self._data["medicine_stock"]

    def medicine_stock_for(self, facility_id: str) -> list[dict[str, Any]]:
        return [m for m in self.medicine_stock if m["facility_id"] == facility_id]

    @property
    def beds(self) -> list[dict[str, Any]]:
        return self._data["beds"]

    @property
    def doctors(self) -> list[dict[str, Any]]:
        return self._data["doctors"]

    @property
    def diagnostics(self) -> list[dict[str, Any]]:
        return self._data["diagnostics"]

    @property
    def footfall_forecast(self) -> list[dict[str, Any]]:
        return self._data["footfall_forecast"]

    @property
    def footfall_breakdown_tomorrow(self) -> dict[str, Any]:
        return self._data["footfall_breakdown_tomorrow"]

    @property
    def causal_chain(self) -> dict[str, Any]:
        return self._data["causal_chain"]

    def demand_factors_for(self, facility_id: str) -> list[str]:
        return self._data.get("demand_factors", {}).get(facility_id, [])


@lru_cache
def get_district_repository() -> DistrictRepository:
    return DistrictRepository(get_settings().seed_data_path)
