# 01 — Architecture

## System Overview

```
                       ┌─────────────────────────────┐
                       │   Next.js Frontend           │
                       │   (District Ops Dashboard)   │
                       └──────────────┬───────────────┘
                                      │ REST (JSON)
                       ┌──────────────▼───────────────┐
                       │   FastAPI Backend             │
                       │                                │
                       │  api/v1/*  →  services/*       │
                       │       ↓            ↓           │
                       │  repositories/*  agents/*       │
                       │       ↓            ↓           │
                       │  data store    Gemini 2.5 Flash │
                       │  (mock JSON /   (tool-calling    │
                       │   Firestore)     explanations)   │
                       └────────────────────────────────┘
```

## District AI Engine Pipeline
Every data point (inventory update, footfall log, bed status, doctor check-in) flows through:

```
Ingested Data
    ↓
Forecast Engine        → predicts stock depletion, footfall, bed occupancy, doctor risk
    ↓
Optimization Engine    → finds nearby surplus, computes transfer distance/cost
    ↓
Recommendation Engine  → produces {action, confidence, reasons[]}
    ↓
District Dashboard     → human reviews, approves/rejects/modifies
```

Gemini 2.5 Flash sits **beside** this pipeline, not inside the prediction path — it takes the structured forecast/recommendation output and produces a natural-language explanation and answers free-form questions ("Ask SwasthyaGrid") via tool calls back into the same services.

## Backend Layering (Clean Architecture)
Mirrors the mentor reference repo's proven layout, adapted for our domain:

```
backend/app/
├── api/v1/            # FastAPI routers — hospitals, medicines, beds, doctors,
│                        forecasts, recommendations, performance, ask, health
├── agents/            # health_agent.py — Gemini tool-calling orchestration
├── core/              # config.py (Pydantic Settings), logging.py, exceptions.py
├── tools/             # Gemini-callable tool functions (wrap services)
├── services/          # business logic: ForecastService, RecommendationService...
├── repositories/      # data access abstraction (JSON mock now, Firestore later)
├── models/            # domain dataclasses (Hospital, Medicine, Bed, Doctor, ...)
├── schemas/           # Pydantic request/response DTOs
├── prompts/           # Gemini system prompts
└── middleware/        # request-id, logging, rate limiting
```

Dependency direction: `api` → `services` → `repositories`. `agents`/`tools` call into `services`, never directly into `repositories`, so the same business rules apply whether triggered by a human via REST or by Gemini via tool call.

## Frontend Structure
```
frontend/src/
├── app/                  # Next.js App Router pages
├── components/           # dashboard widgets (KPI cards, map, recommendation card, ...)
├── lib/                  # api client, formatting utils
├── data/                 # mock district JSON (dev fallback if backend not running)
└── styles/               # design tokens, globals
```

## Data Flow for the Core Demo Scenario
1. PHC staff (simulated) uploads daily inventory/attendance → seed data represents this.
2. `ForecastService` computes days-remaining for each medicine per PHC using consumption rate + trend factors (weather, disease clusters, footfall).
3. `RecommendationService` detects a PHC below threshold, searches sibling PHCs for surplus within distance radius, and proposes a transfer with a computed confidence score.
4. Dashboard renders the recommendation card; admin clicks Approve/Reject/Modify.
5. On Approve, the mock "transfer" updates in-memory/mock state; the map and performance score reflect reduced risk.
6. Analytics panel narrates the causal chain (e.g. rainfall → dengue cluster → footfall spike → medicine demand).

## Why Mock-Data-First
For a prototyping round, the priority is a **working, demoable, explainable system**. Real ML training (XGBoost/LightGBM) and live Firestore/BigQuery integration are designed (see [06-forecasting.md](06-forecasting.md), [09-gcp-deployment.md](09-gcp-deployment.md)) but not required to prove the product concept. The repository abstraction means swapping mock JSON for Firestore later requires no changes above the `repositories/` layer.
