# 03 — API Contract

Base path: `/api/v1`. All responses JSON. Errors use `{ "error": { "code", "message" } }`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness probe |
| GET | `/ready` | Readiness probe |
| GET | `/metrics` | Basic app metrics |
| GET | `/district` | District summary (KPIs, facility list with risk levels) |
| GET | `/facilities` | List all PHCs/CHCs |
| GET | `/facilities/{id}` | Facility detail (stock, beds, doctors, diagnostics, score) |
| GET | `/medicines` | Medicine stock across district, filterable by facility/risk |
| GET | `/footfall/forecast` | Predicted footfall (district or per-facility, tomorrow) |
| GET | `/beds/forecast` | Predicted bed occupancy (tomorrow / next week) |
| GET | `/doctors/attendance` | Doctor attendance + absence-pattern risk |
| GET | `/diagnostics` | Diagnostic/test availability per facility |
| GET | `/recommendations` | List AI recommendations (default: pending) |
| POST | `/recommendations/{id}/approve` | Approve, optional `{ quantity_override }` |
| POST | `/recommendations/{id}/reject` | Reject, optional `{ reason }` |
| POST | `/recommendations/{id}/modify` | Modify + approve with new params |
| GET | `/alerts` | Active alerts, filterable by severity |
| GET | `/analytics/causal-chain/{facility_id}` | "Why" narrative chain |
| GET | `/performance` | Per-facility performance scorecards |
| POST | `/ask` | `{ "message": string }` → Gemini tool-calling response |

## Example: `GET /recommendations`
```json
{
  "recommendations": [
    {
      "id": "rec_001",
      "type": "stock_transfer",
      "source_facility_id": "phc_12",
      "target_facility_id": "phc_18",
      "subject": "Paracetamol",
      "quantity_or_detail": "250 strips",
      "confidence": 96,
      "reasons": [
        "Projected stock depletion in 3.4 days",
        "Rain forecast increasing fever cases",
        "Recent dengue trend in the area",
        "PHC-12 has 650 strips in surplus, 6 km away"
      ],
      "status": "pending",
      "created_at": "2026-07-05T08:00:00Z"
    }
  ]
}
```

## Example: `POST /ask`
Request:
```json
{ "message": "Which PHCs are at risk of an ORS stock-out this week?" }
```
Response:
```json
{
  "answer": "Rural-14 is critical with 2 days of ORS remaining, driven by a projected heatwave (+72% demand). Recommend transferring stock today.",
  "tool_calls": ["get_medicine_stock", "get_forecast"],
  "confidence": 94
}
```

## Contract Principles
- Every prediction field is paired with `confidence` and `reasons`/`factors` — never a bare number.
- Mutating endpoints (`approve`/`reject`/`modify`) are the **only** way state changes; nothing auto-executes.
- `/ask` never mutates state — it is read-only, explanation-oriented, matching the Core AI Principle.
