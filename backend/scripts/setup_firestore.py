"""Seed production Firestore with the district dataset.

Not required for the prototype (mock JSON via DistrictRepository is the
current data source — see docs/06-forecasting.md and docs/09-gcp-deployment.md).
Run this only after Firestore is provisioned and USE_FIRESTORE is wired into
DistrictRepository as a real backing store.
"""

import json
from pathlib import Path

SEED_PATH = Path(__file__).resolve().parents[1] / "data" / "seed_district.json"


def main() -> None:
    from google.cloud import firestore  # deferred import: only needed here

    with open(SEED_PATH, encoding="utf-8") as f:
        data = json.load(f)

    db = firestore.Client()
    db.collection("districts").document(data["district"]["id"]).set(data["district"])

    for facility in data["facilities"]:
        db.collection("facilities").document(facility["id"]).set(facility)

    print(f"Seeded {len(data['facilities'])} facilities into Firestore.")


if __name__ == "__main__":
    main()
