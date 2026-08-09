# SwasthyaGrid — Research Dossier
### Ascendant Agents, Track 07 (Open Innovation) — argument engineering before slide 1

---

## 1. Track fit & judging rubric decode

Track 07 is judged on **originality, feasibility, real-world impact**, plus the bonus: *"extra
credit for tackling a genuinely novel problem space."* Mapped to slides:

| Criterion | Where it's won |
|---|---|
| Originality | Slide 3 (Solution) — the contrarian thesis: the agent that refuses to act alone |
| Feasibility | Slide 5 (Technology) — real stack, real formulas, already running |
| Real-world impact | Slide 2 (Problem) + Slide 7 (Utility/Scalability) — sourced India numbers, measurable outcomes |
| Novel problem space | Slide 4 (Architecture) — three-agent loop applied to *district operations*, not diagnosis or triage (the two crowded corners of health-AI) |

Judges at an agent-focused hackathon have almost certainly seen a wave of "AI agent that fully
automates X." Our differentiation is not a bigger agent — it's a **narrower, audited one**.

---

## 2. The contrarian recommendation (the deck's spine)

**Draft position:** *the winning agentic system for public health is the one that deliberately
refuses to act autonomously.*

Every other Track 07 entry will pitch maximum autonomy as the selling point. In a domain where a
wrong medicine transfer or bed redirect has a human cost, autonomy is the liability, not the
feature. SwasthyaGrid's apparent weakness — "the agents don't execute anything, a human always
has to click Approve" — is reframed as the thesis: **the approval gate is not a missing feature,
it is the product.** This turns the single most predictable judge objection ("so it's not really
autonomous?") into the opening line of the pitch.

This is not a rhetorical stance bolted onto a plain dashboard — the codebase already enforces it
structurally: `RecommendationService.resolve()` is the *only* function that can move a
recommendation out of `pending`, and the module docstring says so explicitly: *"the engine only
ever proposes."* The safety property is load-bearing code, not a marketing claim.

---

## 3. Problem research, India-first

### The framing (carried from the SwasthyaGrid ideation doc)
> "The district was rarely short on medicine. It was short on visibility."

District health systems fail less often from scarcity than from **coordination lag** — a shortage
that was predictable three days earlier, a crowded PHC when a nearby CHC had capacity, updates
that never connect to weather, disease trend, or footfall.

### Sourced anchors

| Figure | Value | Source |
|---|---|---|
| India AI-in-healthcare market | US$758.8M (2023) → US$8,728.0M (2030 est.), **41.8% CAGR** (2024–2030) | Grand View Research, India AI in Healthcare Market Outlook |
| Rural health infrastructure (national) | 31,882 PHCs, 6,359 CHCs (as of 31 Mar 2023) | MoHFW, *Health Dynamics of India (Infrastructure & Human Resources) 2022–23* |
| PHC/CHC coverage of population | Serve ~64% of India's population | rural health service-delivery literature (PMC review, 2023) |
| Districts in India | ~800 (count varies by state reorganisation; commonly cited 787–806 in 2024) | ECI/state gazetteer aggregation, cross-checked multiple sources |
| Specialist shortfall at CHCs | ~80% shortfall — 4,413 available against 21,964 sanctioned posts (Mar 2023) | MoHFW report via PRS/health-ministry press coverage |
| PHC doctor vacancy rate | 24% (vs. 5% for ANMs) | Rural Health Statistics-derived reporting |

**How this reads on the slide:** not "AI will fix healthcare" — a specific, bounded claim: ~800
districts run PHC/CHC networks with a documented specialist and doctor shortfall, and the
coordination layer connecting facility-level signals to district-level action is largely manual
(phone calls, WhatsApp groups, paper registers) even where the underlying data already exists at
each facility.

### Problem in one sentence (from the ideation doc, reused)
> District health administrators lack a unified, predictive, and explainable operating system for
> managing facility risk, resource redistribution, and citizen emergency guidance across PHCs and
> CHCs.

---

## 4. The three-agent architecture, mapped to real code

This table is the single most important artefact in this dossier — it is what makes the
architecture slide *true* rather than illustrative. Every cell is a real file, function, or
formula in `ascend-agents/backend/`.

| Node | Owns | Real implementation |
|---|---|---|
| **MONITOR** | Facilities, medicines, beds, doctors, diagnostics | `forecast_service.py`: `days_remaining = units_remaining / avg_daily_consumption`; risk tiers `<3d high, <6d medium, else low`; cascading `facility_risk_level()` → `critical / stress / monitor / healthy`; alerts derived from risk in `alert_service`. Data pulled from `DistrictRepository` (Firestore, 20s refresh TTL, JSON seed fallback). |
| **REASON** | Risk engine, forecasts, causes, constraints | `recommendation_service.py`: for each high-risk medicine, scans every other facility for `surplus = units_remaining − (avg_daily_consumption × 5)`; ranks candidates `(distance_km asc, surplus desc)` via an inline haversine; computes `quantity = min(deficit_to_safety, surplus)`; scores confidence (formula below); assembles a human-readable `reasons[]` trace. |
| **ACT** | Recommendations, transfers, redirects, escalations | 4 typed proposals — `stock_transfer`, `staff_transfer`, `bed_redirect`, `diagnostic_redirect`. Module docstring: *"The engine only ever proposes."* Nothing in this layer can change system state. |
| **HUMAN APPROVAL → ACTION** | Gate | `RecommendationService.resolve()` — the single function that transitions `pending → approved / rejected / modified`. `roleContext.tsx` grants `canApprove: true` only to `district_admin`. Approving live-downgrades the target facility's risk on the map (`downgradeRisk`, `frontend/src/lib/store.tsx`). |

**The confidence formula** (verbatim, `recommendation_service.py`):
```
factor_score        = min(len(factors) * 10, 30)
logistics_score      = max(0, 20 − distance_km)
safety_margin_score  = 10 if (surplus − quantity) > 0 else 5
confidence = min(round(forecast_confidence × 0.4 + factor_score + logistics_score + safety_margin_score), 99)
```
Distance and safety margin actively *penalise* a far-away or thin-margin transfer — the score
cannot be gamed by picking any surplus facility; geography and safety stock discipline it.

**Two Gemini agents sit above this, doing explanation only — never prediction or execution:**
`health_agent.py` (`HealthAgent`, 7 tool-bound functions from `district_tools.py`,
`MAX_TOOL_ITERATIONS = 5`, returns `{answer, tool_calls[], confidence}`) and `public_agent.py`
(citizen-facing, emergency rule engine + Google Places). The system prompt states the contract
directly: *"You are read-only: you explain data and reasoning, you never claim to have executed a
transfer, approval, or any other action."*

---

## 5. Why this is agentic, not a dashboard

A dashboard shows state. An agent perceives, reasons, and proposes action toward a goal. The
distinguishing structure here:

1. **Perceive** — Monitor continuously derives risk from raw facility data, not a static report.
2. **Reason** — Reason searches a solution space (every other facility, ranked by two independent
   criteria) and produces a scored, explained candidate — not a lookup, a search.
3. **Propose** — Act emits a typed, quantified, reasoned recommendation object.
4. **Govern** — nothing executes without `resolve()`. This is the deliberate boundary that keeps
   the system agentic *and* safe: multi-step autonomous reasoning, zero autonomous execution.
5. **Explain on demand** — the Gemini layer adds natural-language, tool-grounded explanation for
   a human asking "why," strictly bounded to already-computed data (never invents a number).
6. **Separation of concern boundary** — admin agent and citizen agent have disjoint toolsets
   (`district_tools.py` vs `emergency_tool.py` + `maps_tool.py`), enforcing that operational
   authority and public guidance never cross-contaminate.

---

## 6. The moneyshot — worked example, re-verified against the running code

**Important correction:** an earlier reference deck for this project used illustrative numbers
(4 km distance, confidence 92) for this same example. Those numbers were re-derived from the
*current* seed data and codebase and do **not** match — the reference figures appear to have
been carried over from a different data snapshot or conflated with the diagnostics-redirect
example (which does use `distance_km: 4`, for an unrelated X-ray machine failure). Per this
project's content-integrity rule, the corrected numbers below are the ones used from this point
forward.

**PHC Phagi, Anti-Snake Venom (ASV):**
- `units_remaining = 4`, `avg_daily_consumption = 2` → `days_remaining = 4 / 2 = 2.0` → **high risk** (< 3 days)
- No entry in `demand_factors` for this facility → falls back to the single default factor
  `"Historical consumption trend"`, forecast confidence = 80

**Search for surplus** — ASV is stocked at exactly one other facility in the district, CHC North:
- `units_remaining = 80`, `avg_daily_consumption = 3` → **26.7 days of cover**
- `surplus = 80 − (3 × 5) = 65` units above its own 5-day safety stock
- `distance_km` (haversine, PHC Phagi 26.70,75.50 → CHC North 27.01,75.83) ≈ **47.5 km**

**Recommendation:**
- `deficit_to_safety = (2 × 5) − 4 = 6` units
- `quantity = min(6, 65) = 6` units
- `factor_score = min(1×10, 30) = 10`
- `logistics_score = max(0, 20 − 47.5) = 0` — the transfer is penalised for real distance
- `safety_margin_score = 10` (surplus of 59 remains after the transfer)
- `confidence = round(80×0.4 + 10 + 0 + 10) = 52`

**The honest story this tells:** a 6-unit ASV transfer across a real 47.5 km supply line, flagged
at **moderate confidence (52)** — not because the system is unsure the shortage is real (that part
is arithmetic, not a guess), but because logistics realistically discounts a long-distance
transfer. This is a *better* slide than an inflated 92: it demonstrates the confidence score is
load-bearing, not decorative — it visibly moves when the underlying facts (distance) are
unfavourable, which is exactly what "explainable, not overconfident AI" should look like on stage.
This is currently the **only** stock-transfer recommendation the engine's real seed data actually
generates (every other multi-facility medicine — Paracetamol, ORS — has no facility below the
high-risk threshold), so it is also the honest, singular worked example, not a cherry-pick.

---

## 7. Competitive / alternative landscape

Positioned on **predictive depth × human accountability**:

| | Low accountability | High accountability |
|---|---|---|
| **High predictive depth** | Fully-autonomous agent startups (execute transfers/orders without review) | **SwasthyaGrid** |
| **Low predictive depth** | Status quo: phone calls, WhatsApp groups, paper registers | Generic BI dashboards on HMIS data (Power BI/Tableau — descriptive only, no recommendation layer, no approval workflow) |

Status quo has zero prediction and zero structured accountability — it works entirely on informal
trust. Generic dashboards add visibility but no action layer. Autonomous-agent competitors add
action but strip out the review step that public health specifically cannot skip. SwasthyaGrid is
the only quadrant that pairs a real recommendation engine with a hard-coded human gate.

---

## 8. Feasibility & tech justification

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 16.2.10 / React 19, Tailwind v4 | App Router + server components for a data-dense 12-screen console; ships with graceful degradation (`safeFetch` 3s timeout → local mock data) so the demo never breaks live |
| Backend | FastAPI, Python 3.12 | Typed, fast to iterate, natural home for the deterministic forecast/recommendation services and Gemini tool-calling |
| Data | Firestore, JSON-seed fallback | Serverless, low-ops for a pilot-scale district; the same repository class transparently falls back to seed data with zero Firestore |
| AI | `google-genai` (Gemini), 7 grounded tools | Explanation layer only — deliberately never the source of a number, which removes hallucination risk from the highest-stakes outputs (forecasts, quantities) |
| Forecasting | Deterministic heuristics, not ML | Honest for the data scale available today (8 facilities, weeks of history); the service interface (`{value, confidence, factors[]}`) is designed so an XGBoost/LightGBM model can slot in later without changing callers |
| Deploy | Vercel (frontend), Cloud Run (backend) | Both scale-to-zero — a single-district pilot costs near nothing to run |

**Cost of running one district today:** effectively the Gemini API call volume only (both chat
surfaces degrade gracefully with a fallback message when no key is set) — Vercel and Cloud Run
free tiers cover a pilot's traffic.

---

## 9. Impact model — measurable, not fabricated

| Metric | Measured by |
|---|---|
| Stock-outs averted | Forecasted vs. actual `days_remaining` before/after pilot rollout |
| Bed utilisation | Occupancy vs. capacity across facilities, tracked weekly |
| Districtwide preparedness | Share of high-risk facilities with a resolved recommendation within 24 hours |
| Lower patient wait time | Footfall-to-service gap during peak forecast windows |
| Faster diagnostic redirects | Time from a machine-failure flag to an alternative-facility referral |
| Accountable AI adoption | Share of AI-surfaced recommendations with a recorded human decision — **target 100%** (this is the one metric the architecture makes structurally guaranteed, not aspirational) |

No ROI, cost-savings, or adoption-rate figures are asserted — none exist yet at pilot scale, and
inventing them would violate this project's no-fabrication rule.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Facility data-entry quality (garbage in, garbage out) | Dedicated CRM intake app with per-facility login, PATCH-based edits, `updated_by` audit field |
| Alert fatigue at district level | Severity-filtered alerts (`info/warning/critical`), confidence-ranked recommendations rather than a flat list |
| Over-trust in confidence scores | Confidence is decomposed and shown with its `reasons[]`, not presented as a bare number — worked example (§6) demonstrates it visibly discounts weak evidence |
| Rural connectivity gaps at intake | Repository pattern already tolerates Firestore being unreachable (falls back to last-known seed); CRM is the one component that currently requires connectivity — flagged as a Phase 2 offline-queue item |
| Autonomy creep under pressure to "just automate it" | Structural, not policy-level: `resolve()` is the only state-transition path in the codebase; there is no code path today that can approve a recommendation without a human role check |

---

## 11. Roadmap

- **Phase 1 (today):** prototype — 3-agent loop, human approval gate, 1 district / 8 facilities, deterministic forecasting, Gemini explanation layer, CRM intake.
- **Phase 2 (pilot district):** scheduler for autonomous Monitor runs (currently pull-on-read only), persisted Firestore audit trail for every approval (currently in-memory), offline-tolerant CRM intake.
- **Phase 3 (real integration):** HMIS/IDSP data ingestion in place of manual intake, multilingual citizen agent, replace heuristic forecasts with a trained model behind the same service interface.
- **Phase 4 (state scale):** multi-district rollout — India's ~800-district structure is the natural unit of replication; each district instance is independently cheap to run (§8).

---

## 12. Slide-by-slide content spec

Exact content for Figma build — transcription, not authoring, at build time.

**Slide 1 — Cover.** Template exact. Fields to fill: TEAM NAME, TEAM MEMBERS (confirm roster before build — reference deck lists Harsh Kawatra, Anuj Gambhir, Gursimran Kaur, Dayita Arora).

**Slide 2 — PROBLEM STATEMENT.**
Headline: *"The district was rarely short on medicine. It was short on visibility."*
- Issue tree: Scarcity (rare) vs. Coordination lag (common) as the two failure modes, MECE-split.
- 3 KPI numerals: **41.8%** (India AI-health CAGR 2024–30) · **~800** (districts) · **31,882 / 6,359** (PHCs / CHCs, MoHFW 2022–23).
- Contrast panel: "What a dashboard answers" (what happened) vs. "What an operator needs" (what's likely next, why, what to do).
- Source line: MoHFW Health Dynamics of India 2022–23 · Grand View Research.

**Slide 3 — SOLUTION.**
Headline: *"The agent that refuses to act alone."* (contrarian thesis, stated directly)
- Moneyshot chain (§6): 4 units → 2.0 days → HIGH RISK → CHC North, 47.5 km, 65 surplus → transfer 6 units → **confidence 52 · PENDING APPROVAL**.
- Giant numeral: **52** (confidence), captioned "moderate — because distance is real, not decorative."

**Slide 4 — ARCHITECTURE.**
Headline: *"Three agents, one loop, one human decision."*
- Hub-and-spoke: SWASTHYAGRID → MONITOR / REASON / ACT → converging on HUMAN APPROVAL → ACTION (user's original diagram, drawn natively).
- Each spoke annotated with its real file + formula (§4 table, condensed).
- Below: 7-step flow — Facility intake → Firestore repo (20s refresh) → Forecast service → Recommendation engine → Gemini explains → Human decides → Log + citizen agent.

**Slide 5 — TECHNOLOGY USED.**
Headline: *"Every layer chosen so the agent can be audited, not just run."*
- 3-column stack table: Frontend (Next.js 16.2.10, React 19, Tailwind v4, Recharts, Leaflet) · Backend + Agents (FastAPI, Python 3.12, google-genai, 7 tools) · Cloud + Data (Firestore, Cloud Run, Vercel).
- Formula callout: the confidence formula (§4), tinted box.
- Rail panel: "AI explains, never predicts" contract, quoted from the system prompt.

**Slide 6 — WORKING PROTOTYPE.**
Headline: *"12 screens, 8 facilities, and a gate nothing gets past."*
- Video link slot (template's mandated placeholder).
- 4-shot screenshot strip: `/agents` console · agent-badged recommendation reasoning · the approval gate · map healing post-approval.
- Repo link: `github.com/harshkawatra11/ascend-agents`.

**Slide 7 — UTILITY/SCALABILITY.**
Headline: *"The 4-kilometre gap is the pattern"* — **note:** re-check this line against §6's corrected 47.5 km distance before finalizing; either update to *"the 47-kilometre gap"* or repoint the line to the diagnostics-redirect example (X-ray machine failure at PHC Chaksu, alternative at CHC North, `distance_km: 4`, which does independently check out) so the headline number and the worked example on the same deck are never in tension.
- Impact grid (§9): People / Facilities / System columns.
- Roadmap: 4 phases (§11), with an explicit "built today vs. next" divider line.
- Scale path: 1 district → ~800 districts.

**Slide 8 — THANK YOU (new).**
Cover chrome reused exactly. "THANK YOU," team names, repo link, demo video link.

---

## Sources

- Grand View Research — [India AI in Healthcare Market Outlook, 2023–2030](https://www.grandviewresearch.com/horizon/outlook/ai-in-healthcare-market/india)
- Ministry of Health & Family Welfare — *Health Dynamics of India (Infrastructure and Human Resources) 2022–23* (PIB release), [pib.gov.in](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2053070)
- MoHFW specialist-shortfall report via [ThePrint](https://theprint.in/health/rural-india-has-an-80-shortfall-of-specialist-doctors-mp-gujarat-tamil-nadu-worst-off/2259874/) and [Medical Dialogues](https://medicaldialogues.in/news/health/80-shortfall-of-specialist-doctors-in-chcs-health-ministry-report-105783)
- PHC/CHC population coverage — [PMC, Rural healthcare service in India: challenges and the way forward, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10305874)
- District count (~800, 2024) — cross-referenced multiple current listings; exact figure fluctuates with state reorganisation
- Codebase ground truth — `ascend-agents/backend/app/services/forecast_service.py`, `recommendation_service.py`, `backend/data/seed_district.json`, `backend/app/agents/`, `backend/app/prompts/system_prompt.py` (all re-derived and verified 2026-08-09, not carried over from any prior deck)
