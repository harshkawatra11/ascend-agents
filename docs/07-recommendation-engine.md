# 07 — Recommendation Engine

## Goal
Turn a forecasted risk (e.g. "Paracetamol stock-out in 3.4 days at PHC-18") into a **concrete, explainable, human-approvable action**.

## Algorithm (Prototype Heuristic)
1. **Detect risk**: `ForecastService` flags any medicine with `days_remaining < reorder_threshold_days` (default 5) as high risk.
2. **Search for surplus**: `RecommendationService` scans sibling facilities within a configurable radius (default 15 km, haversine distance from lat/lng) for the same medicine with `units_remaining` above their own safety stock.
3. **Rank candidates**: sort by `distance_km` ascending, then by surplus size descending.
4. **Compute transfer quantity**: `min(deficit_to_reach_safety_stock, source_surplus_above_its_own_safety_stock)`.
5. **Compute confidence** (0–100), weighted sum of:
   - Forecast confidence of the depletion prediction (40%)
   - Corroborating demand-signal factors present, e.g. weather + outbreak trend agreeing (30%)
   - Logistics feasibility: closer distance → higher score (20%)
   - Source facility's own forecasted safety margin after transfer (10%)
6. **Emit recommendation** with `type: "stock_transfer"`, `reasons[]` populated from steps 1–5 (e.g. "Projected stock depletion in 3.4 days", "Rain forecast", "Recent dengue trend", "Nearby PHC has surplus").

The same shape of algorithm (detect → search → rank → recommend) applies to:
- **Bed redirection**: detect >90% predicted occupancy, search sibling facilities/departments with capacity.
- **Doctor/staff transfer**: detect high absence-risk pattern, recommend temporary transfer from a facility with attendance slack.
- **Diagnostic redirect**: detect equipment failure/unavailability, recommend nearest facility with the test available.

## Human-in-the-Loop Contract
The engine's output status is always `"pending"`. State only changes via `POST /recommendations/{id}/approve|reject|modify` (see [03-api-contract.md](03-api-contract.md)) — the engine **proposes**, it never executes a transfer, staffing change, or redirect on its own.

## District-Wide View — Smart Redistribution
All pending + approved transfer recommendations across the district are aggregated into a redistribution graph (facility nodes, transfer edges) that powers the District Map and Resource Transfers panel — this is the "AI continuously balances inventory" view called out in the product brief, and it's the module most teams skip.

## Risk Level Aggregation (for Map/Heatmap)
Each facility's overall `risk_level` = worst of:
- any medicine at "high" risk → 🔴 critical
- any medicine at "medium" risk, or bed occupancy forecast > 90% → 🟠 stress
- doctor absence risk "high" or diagnostic unavailable with no nearby alternative → 🟡 monitor
- otherwise → 🟢 healthy
