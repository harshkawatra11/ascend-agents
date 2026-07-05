# 04 — UI Flows

## Dashboard Layout (single-page District Ops Center)
Top to bottom, per the product brief:

1. **District Overview** — KPI strip: Today's Risk, Footfall, Beds, Doctors, Medicine.
2. **District Map** — Leaflet map, every facility a pin colored by risk level.
3. **Risk Heatmap** — grid/list view of all facilities, color-coded 🟢🟡🟠🔴.
4. **Alerts** — critical/warning intelligence cards (not raw notifications).
5. **AI Recommendations** — cards with confidence, reasons, Approve/Reject/Modify.
6. **Resource Transfers** — log of approved transfers, in-flight and completed.
7. **Forecast** — footfall/bed/stock forecast charts (Recharts).
8. **Performance Score** — per-facility scorecards (overall + 5 sub-scores).

A persistent **"Ask SwasthyaGrid"** panel (bottom-right, collapsible) provides the Gemini-backed Q&A.

## Primary User Flow — Approve a Recommendation
1. Admin lands on dashboard → sees a 🔴 critical facility on the map/heatmap.
2. Clicks facility → detail drawer shows stock, beds, doctors, diagnostics for that PHC.
3. Scrolls to AI Recommendations → sees the stock-transfer card with confidence 96% and 4 reasons.
4. Clicks **Modify** to adjust quantity, or **Approve** directly.
5. On approve: toast confirmation → map risk color updates → Resource Transfers log gets a new entry → Performance Score for that facility recalculates.

## Secondary Flow — Ask a Question
1. Admin opens "Ask SwasthyaGrid" panel.
2. Types: "Which PHCs are at risk of an ORS stock-out this week?"
3. Gemini (via backend `/ask`, tool-calling into the same services) returns a grounded natural-language answer with a confidence indicator.

## Interaction Principles
- **Nothing executes silently.** Every AI-suggested action requires an explicit click.
- **Every number has a "why."** Hovering/expanding any prediction reveals its factors.
- **Color is signal, not decoration** — reserved for risk states (see [08-design-system.md](08-design-system.md)); the rest of the UI stays in warm neutrals.
- **Motion is restrained** — Framer Motion used for state transitions (card approve/dismiss, risk color shifts), not decorative animation.

## Responsive Behavior
Desktop-first (this is an ops console used by administrators at a desk), but the layout reflows to a single column below 768px with the map collapsing to a toggleable view.
