<div align="center">

# SwasthyaGrid AI

### *An AI District Health Operations Center*

**Predictive · Prescriptive · Explainable · Human-Governed**

Built by **Harsh Kawatra** & **Dayita Arora** for GDG BuildWithAI

**▶ Live: [swasthyagrid.vercel.app](https://swasthyagrid.vercel.app)** &nbsp;·&nbsp; deployed end-to-end on Google Cloud

[![Live](https://img.shields.io/badge/●_live-swasthyagrid.vercel.app-3f6b4a?style=flat-square)](https://swasthyagrid.vercel.app)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%20on%20Vercel-4a433a?style=flat-square)](frontend)
[![Backend](https://img.shields.io/badge/backend-FastAPI%20on%20Cloud%20Run-4a433a?style=flat-square)](backend)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-b5502e?style=flat-square)](docs/05-ai-engine.md)
[![Cloud](https://img.shields.io/badge/cloud-Cloud%20Run%20·%20Firestore%20·%20Secret%20Manager-8a6d3b?style=flat-square)](docs/09-gcp-deployment.md)

</div>

---

## ▶ Live & Deployed on Google Cloud

This is a **running product**, not a mockup — click through it right now:

| | |
|---|---|
| **Live app** | **https://swasthyagrid.vercel.app** |
| **Frontend** | Next.js on **Vercel** — auto-deploys from `main` |
| **Backend API** | FastAPI on **Google Cloud Run** (`asia-south1`, scale-to-zero) — `https://swasthyagrid-api-616415200021.asia-south1.run.app` |
| **Data** | **Firestore** (Native) · **Secret Manager** for the Gemini key · **Cloud Build** for container builds |
| **AI** | **Gemini 2.5 Flash** — explains forecasts & recommendations, never invents the numbers |

The browser talks to Vercel, which calls the Cloud Run API, which reads Firestore and pulls the Gemini key from Secret Manager. Every dashboard view on the live site fetches real data from the Cloud Run backend — verified end-to-end. See [`docs/09-gcp-deployment.md`](docs/09-gcp-deployment.md) for the exact `gcloud` commands and the scale path (**BigQuery · Vertex AI · Pub/Sub · Cloud Scheduler**).

📊 **Pitch deck:** open [`pitch-deck.html`](pitch-deck.html) in a browser → *Save as PDF*.

## The Problem

PHCs and CHCs across India face recurring operational gaps — medicine stock-outs, unmanaged patient footfall, bed unavailability, unpredictable doctor attendance — tracked manually, with no real-time visibility. The result: shortages, overloaded staff, and under-resourced facilities that nobody at the district level sees coming.

## The Idea

**Think of it as Google Maps for district healthcare operations.** Instead of routing cars, SwasthyaGrid routes medicine, doctors, beds, and testing kits across an entire district — before a shortage happens, not after.

Legacy systems tell you *what happened*. SwasthyaGrid tells you:

| | |
|---|---|
| 🔮 **What will happen** | Forecasted stock-outs, footfall spikes, bed occupancy, doctor absence risk |
| 🧭 **Why** | Every prediction ships with its contributing factors and a confidence score |
| ✅ **What to do** | A concrete, ranked resource-redistribution recommendation |

## The Core Principle: AI Proposes, Humans Decide

SwasthyaGrid never executes an action on its own. Every recommendation surfaces as:

```
┌─────────────────────────────────────────────┐
│  Stock Transfer · PHC Sector-12 → Rural-14   │
│                                               │
│  Paracetamol · 250 strips           96% ●●●● │
│                                    CONFIDENCE │
│                                               │
│  — Projected stock depletion in 3.4 days     │
│  — Rain forecast increasing fever cases      │
│  — Recent dengue trend nearby                │
│  — PHC Sector-12 holds surplus, 6 km away    │
│                                               │
│  [ Approve ]   [ Modify ]   [ Reject ]       │
└─────────────────────────────────────────────┘
```

A district administrator always has the final word. This is what makes SwasthyaGrid a **decision-support system**, not an autonomous agent — the framing real public health administrators actually need.

## What's Inside

A real dashboard application — persistent sidebar + topbar shell, 10 routed views, not a scroll page:

| Route | What it shows |
|---|---|
| **Overview** | Command-center KPIs, mini district map, live risk donut, top alerts & pending recommendations |
| **Recommendations** | The human-in-the-loop workspace — filterable, confidence-scored, Approve/Reject/Modify |
| **Inventory** | Medicine stock-out forecasts + stock-transfer recommendations |
| **Footfall** | 7-day patient footfall forecast + demographic breakdown |
| **Beds** | Occupancy forecasts (today/tomorrow/next week) + bed-redirect recommendations |
| **Doctors** | Attendance risk, absence patterns, patient-delay impact + staff-transfer recommendations |
| **Diagnostics** | Test/equipment availability + redirect suggestions |
| **District Map** | Every PHC/CHC as a node, colored by risk (🟢🟡🟠🔴), click for facility detail |
| **Facilities** | Sortable directory with a detail drawer per facility |
| **Analytics** | Causal "why" chains, AI timeline, performance scorecards |

Plus a **role switcher** (District Administrator / PHC Staff / State Health Officer — gates who can approve), a **⌘K command palette**, and a persistent **Ask SwasthyaGrid** panel (Gemini 2.5 Flash — explains the data, never invents it). Approving a recommendation live-updates its status everywhere, drops the affected facility's risk level on the map, and lands in the Resource Transfers log — no page refresh.

## Design

No generic blue-purple SaaS gradients. SwasthyaGrid is styled as an **editorial, agency-grade operations console** — warm beige/parchment surfaces, a serif display face paired with a clean grotesk sans, and color reserved exclusively for risk signaling. See [`docs/08-design-system.md`](docs/08-design-system.md).

## Architecture

```
 Browser ──▶ Next.js (Vercel) ──REST──▶ FastAPI (Cloud Run · asia-south1)
                                             │
                        ┌────────────────────┼───────────────────────┐
                        ▼                     ▼                        ▼
                 Forecast Engine     Recommendation Engine     Gemini 2.5 Flash
                 (deterministic)     (haversine search/         (explanation only,
                                      rank/propose)              never prediction)
                        │                     │
                        └─────── Firestore · Secret Manager ──────────┘
```

Every forecast and recommendation carries `{ value, confidence, factors[] }` as a first-class API contract — not an afterthought. Full detail in [`docs/01-architecture.md`](docs/01-architecture.md).

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, Leaflet |
| Backend | FastAPI, Python 3.12, Pydantic Settings, clean-architecture layering |
| AI | Gemini 2.5 Flash (AI Studio) — tool-calling agent for explanation |
| Forecasting | Deterministic mock engine now; XGBoost/LightGBM designed for production (`docs/06-forecasting.md`) |
| Cloud (**live**) | **Cloud Run** (backend) · **Firestore** · **Secret Manager** · **Cloud Build** · Vercel + GitHub CI |
| Cloud (scale path) | BigQuery · Vertex AI · Pub/Sub · Cloud Scheduler (`docs/09-gcp-deployment.md`) |

## Documentation-First

Every decision, contract, and flow is documented **before** code, and kept current in [`docs/`](docs) and [`memory/`](memory) so the repository — not this conversation — is the source of truth:

- [`docs/00-vision.md`](docs/00-vision.md) — product vision & philosophy
- [`docs/01-architecture.md`](docs/01-architecture.md) — system architecture
- [`docs/02-data-model.md`](docs/02-data-model.md) — domain entities
- [`docs/03-api-contract.md`](docs/03-api-contract.md) — REST API contract
- [`docs/04-ui-flows.md`](docs/04-ui-flows.md) — dashboard layout & flows
- [`docs/05-ai-engine.md`](docs/05-ai-engine.md) — prediction vs. explanation split
- [`docs/06-forecasting.md`](docs/06-forecasting.md) — forecasting approach
- [`docs/07-recommendation-engine.md`](docs/07-recommendation-engine.md) — redistribution algorithm
- [`docs/08-design-system.md`](docs/08-design-system.md) — visual language
- [`docs/09-gcp-deployment.md`](docs/09-gcp-deployment.md) — cloud deployment plan
- [`docs/10-demo-script.md`](docs/10-demo-script.md) — the demo narrative

[`memory/`](memory) tracks live project state (`current-task.md`, `decision-log.md`, `handoff.md`, ...) so anyone can pick this up mid-flight.

## Running Locally

```bash
# Backend — FastAPI, mock data, no GCP required
cd backend
python -m venv .venv && source .venv/Scripts/activate  # or .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env   # optionally add GEMINI_API_KEY for the live Ask feature
uvicorn app.main:app --reload --port 8080

# Frontend — Next.js dashboard
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The dashboard works fully on mock data; the Ask panel activates automatically once `GEMINI_API_KEY` is set in `backend/.env`.

---

<div align="center">

*SwasthyaGrid AI — because a district health system should know about a stock-out three days before it happens, not three days after.*

</div>
