# 05 — AI Engine

## Separation of Concerns
- **Prediction** (numbers) → Forecast Engine (statistical/ML, see [06-forecasting.md](06-forecasting.md)). Deterministic, auditable.
- **Optimization** (what to move where) → Optimization/Recommendation Engine (see [07-recommendation-engine.md](07-recommendation-engine.md)). Rule + heuristic based.
- **Explanation** (why, in plain language) → Gemini 2.5 Flash. **Gemini never generates the prediction numbers** — it explains numbers already computed deterministically, which keeps the system auditable and avoids hallucinated statistics.

## Gemini Integration — "Ask SwasthyaGrid"
Modeled on the mentor repo's tool-calling agent loop (`app/agents/health_agent.py`):

- Model: `gemini-2.5-flash` via Google AI Studio API key (`GEMINI_API_KEY` env var).
- Agent loop: user message → Gemini decides which tool(s) to call (`get_medicine_stock`, `get_forecast`, `get_recommendations`, `get_facility_detail`, `get_causal_chain`, ...) → tools execute against the same `services/` layer used by REST endpoints → results fed back to Gemini → final natural-language answer.
- Max 5 tool-call iterations, graceful fallback message if the loop doesn't converge or the API key/quota is unavailable.
- System prompt (in `app/prompts/`) constrains Gemini to: only reference data returned by tools (no fabrication), always mention confidence when citing a forecast, and defer to "an administrator should review this" language rather than issuing directives.

## Confidence Scoring
Every forecast/recommendation confidence score is a deterministic function of:
- Historical data volume/recency (more days of data → higher confidence)
- Forecast horizon (tomorrow > next week > next month)
- Number of corroborating factors (weather + trend + nearby outbreak agreeing → higher confidence)
- Distance/logistics feasibility for redistribution recommendations

This is computed in `services/`, not by Gemini — see [07-recommendation-engine.md](07-recommendation-engine.md) for the formula.

## Explainability Contract
Any UI element showing a predicted number or recommended action must render, at minimum:
1. The number/action itself
2. A confidence percentage
3. A short list of contributing factors (2–5 bullets)

This contract is enforced at the API layer (`03-api-contract.md`) so the frontend cannot render a prediction without its explanation.
