# 06 — Forecasting

## Current Implementation (Prototype)
Deterministic mock generators in `services/forecast_service.py` that simulate realistic forecasting output without requiring trained models or historical data pipelines:

- **Medicine days-remaining**: `units_remaining / avg_daily_consumption`, adjusted by a demand-multiplier derived from simulated weather/outbreak factors in the seed data.
- **Footfall forecast**: base daily average per facility × seasonal/event multiplier (e.g. "dengue cluster", "school reopening") with a breakdown split (children/women/elderly/emergency/general) proportional to historical seed ratios.
- **Bed occupancy forecast**: current occupancy trended forward using footfall forecast correlation.
- **Doctor absence risk**: pattern-detection over the seeded attendance log (e.g. flags "N consecutive Mondays absent").

Each generator returns `{ value, confidence, factors[] }` — never a bare number — satisfying the explainability contract in [05-ai-engine.md](05-ai-engine.md).

## Planned Production Approach (Post-Prototype)
- **XGBoost / LightGBM** gradient-boosted models trained per-facility (or district-pooled with facility embeddings) on:
  - historical consumption/footfall/bed time series
  - weather data (rainfall, temperature, heatwave flags)
  - disease surveillance signals (dengue/flu cluster reports)
  - calendar effects (school terms, festivals, market days)
- Retraining cadence: weekly batch job (Cloud Scheduler → Cloud Function → BigQuery ML pipeline).
- Model registry + versioning via Vertex AI; confidence scores derived from prediction interval width, not just a fixed heuristic.

## Why Mock-First Is the Right Call for This Round
This is a **prototyping round** judged on the operational concept and UX of prediction → explanation → human decision, not on ML model accuracy. The service interface (`ForecastService`) is designed so swapping the mock generator for a real XGBoost model later changes only the internals of one file, not the API contract or the frontend.
