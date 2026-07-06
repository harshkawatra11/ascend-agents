<div align="center">

<img src="https://www.gstatic.com/devrel-devsite/prod/vc857b6f63f52da701c40a5a3a4dd88e14bceafb7593c7d6e469d7aeb9be135dc/developers/images/favicon.png" width="48" height="48" alt="Google Developers"/>

# SwasthyaGrid AI

### *An Intelligent District Health Operations Center*

**Predictive · Prescriptive · Explainable · Human-Governed**

Built for **GDG BuildWithAI** by **Harsh Kawatra, Dayita Arora & Gursimran Kaur**

---

**▶ Live Deployment: [swasthyagrid.vercel.app](https://swasthyagrid.vercel.app)** 

[![Live Application](https://img.shields.io/badge/Live_App-swasthyagrid.vercel.app-3f6b4a?style=for-the-badge)](https://swasthyagrid.vercel.app)
[![Google Cloud](https://img.shields.io/badge/Powered_by-Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](#powered-by-google-technologies)
[![Gemini AI](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-b5502e?style=for-the-badge)](#the-ai-engine-gemini)

</div>

<br/>

## 🌐 Live Architecture & Deployment

This isn't a mockup. SwasthyaGrid AI is a fully functional, production-ready prototype deployed end-to-end utilizing modern cloud infrastructure. 

| Component | Technology | Live URL / Status |
| :--- | :--- | :--- |
| **Frontend UI** | **Next.js** on Vercel | [swasthyagrid.vercel.app](https://swasthyagrid.vercel.app) |
| **Backend API** | **FastAPI** on Google Cloud Run | `swasthyagrid-api-616415200021.asia-south1.run.app` (Live) |
| **AI Intelligence** | **Gemini 2.5 Flash** | Integrated via `@google/genai` SDK |
| **Cloud State** | **Google Cloud Platform** | Firestore, Secret Manager, Cloud Build |

> **Note to Judges:** The browser talks to Vercel, which securely communicates with our Cloud Run API, reads live district data, and utilizes Gemini via Secret Manager. Every dashboard view fetches real data from the Cloud Run backend.

---

## ⚡ Powered by Google Technologies

SwasthyaGrid AI was engineered from day one to natively leverage the Google Cloud and AI ecosystem to solve complex healthcare logistics at a district scale.

### 🧠 1. Gemini 2.5 Flash (Agentic Decision Support)
We utilize Gemini 2.5 Flash not for generic text generation, but as a highly contextual, structured reasoning engine. The **"Ask SwasthyaGrid"** feature acts as an autonomous data analyst. By feeding Gemini live contextual JSON data about the district (stock levels, performance metrics, risk scores), it provides instant, hallucination-free operational intelligence to district officers.

### ☁️ 2. Google Cloud Run (Serverless Backend)
Our Python FastAPI backend is deployed on Google Cloud Run (`asia-south1`). This provides a scalable, secure, and pay-per-request infrastructure that perfectly handles the bursty traffic typical of a health operations dashboard. 

### 🔐 3. Google Secret Manager & Cloud Build
Zero hardcoded secrets. The Gemini API keys and production configurations are injected at runtime via GCP Secret Manager into our Cloud Run containers, which are built and pushed seamlessly via Cloud Build.

### 🔥 4. Firestore (Operational Database)
The system's state is architected around Firestore (Native Mode), allowing for real-time synchronization of medical inventory across distributed Primary Health Centres (PHCs).

### 🚀 5. The Google Cloud Scale Path (Phase 2)
The architecture is designed to scale into **Vertex AI** for training XGBoost/LightGBM forecasting models, **BigQuery** for historical trend analysis, and **Pub/Sub** for real-time event streaming across the state.

---

## 🛑 The Problem

Primary Health Centres (PHCs) and Community Health Centres (CHCs) operate in isolation. Medicine stock-outs, unmanaged patient footfall, and bed shortages are tracked manually. By the time a district medical officer hears about a crisis, **it has already happened**. 

Current legacy systems tell you *what happened yesterday*.

## 💡 The Solution

**Think of SwasthyaGrid as Google Maps for district healthcare operations.** 
Instead of routing traffic, we route medicine, doctors, beds, and testing kits across an entire district — **before** a shortage happens.

| Feature | How it works |
| :--- | :--- |
| 🔮 **Predictive** | Forecasts stock-outs, footfall spikes, and bed occupancy days in advance. |
| 🧭 **Explainable** | Every prediction ships with contributing factors and a **Confidence Score**. |
| ✅ **Prescriptive** | Provides concrete, ranked resource-redistribution recommendations. |

---

## 🛡️ Core Principle: AI Proposes, Humans Decide

In public healthcare, autonomous AI is a liability. SwasthyaGrid acts strictly as an **Agentic Decision Support System**. 

The AI analyzes millions of data points and proposes solutions, but a human administrator always has the final word.

```text
┌─────────────────────────────────────────────────────────────┐
│ 🚨 STOCK TRANSFER RECOMMENDATION · PHC Sector-12 → Rural-14 │
│                                                             │
│ 💊 Paracetamol · Transfer 250 strips              96% ●●●●  │
│                                                  CONFIDENCE │
│                                                             │
│ REASONING:                                                  │
│ — Projected stock depletion at Rural-14 in 3.4 days         │
│ — Impending monsoon rain forecast increasing fever cases    │
│ — PHC Sector-12 currently holds a surplus (6 km away)       │
│                                                             │
│      [ Approve Transfer ]   [ Modify ]   [ Reject ]         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ A Premium, Editorial Dashboard

No generic templates or basic SaaS aesthetics. SwasthyaGrid is designed as a premium, agency-grade operations console. We use warm parchment surfaces, an elegant serif display face paired with a clean sans, and reserve color strictly for risk signaling.

### Dashboard Capabilities
- 📍 **District Map:** A live, spatial view of all PHCs colored by risk level (🟢🟡🟠🔴).
- 📊 **Overview Console:** Command-center KPIs, pending alerts, and a live AI timeline.
- 📦 **Inventory & Beds:** Predictive forecasting charts and AI redistribution tools.
- 👨‍⚕️ **Doctors & Diagnostics:** Staff attendance risk tracking and equipment availability.
- 🧠 **Causal Analytics:** "Why" chains explaining the root causes behind health trends.

---

## 🏗️ Technical Architecture

```text
  [ District Officer Browser ]
             │
             ▼
  [ Next.js Frontend (Vercel) ] ──(REST API)──▶ [ FastAPI Backend (Cloud Run) ]
                                                            │
                            ┌───────────────────────────────┼────────────────────────┐
                            ▼                               ▼                        ▼
                   [ Forecast Engine ]            [ Recommendation Engine ]   [ Gemini 2.5 Flash ]
                    (Deterministic)                (Spatial / Haversine)       (Contextual Analyst)
                            │                               │                        │
                            └───────────────────────────────┴────────────────────────┘
                                            ▼
                               [ GCP Firestore & Secret Manager ]
```

---

## 🛠️ Running the Project Locally

Want to run the codebase on your own machine? It takes less than 2 minutes.

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # or .venv/bin/activate on macOS/Linux
pip install -r requirements.txt

# Add your Gemini API Key for the live AI Chat functionality
echo 'GEMINI_API_KEY="your-api-key-here"' > .env

uvicorn app.main:app --reload --port 8080
```

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. The dashboard works fully on mock data, and the Ask panel activates automatically via your Gemini API key!

---

## 📚 Documentation-First Engineering

Every architectural decision, API contract, and UI flow was meticulously documented **before** a single line of code was written. We invite the judges to review our engineering rigor in the `docs/` folder:

- [`00-vision.md`](docs/00-vision.md) — Product philosophy & human-in-the-loop design.
- [`01-architecture.md`](docs/01-architecture.md) — System architecture and GCP integration.
- [`03-api-contract.md`](docs/03-api-contract.md) — Comprehensive REST API documentation.
- [`05-ai-engine.md`](docs/05-ai-engine.md) — How we leverage Gemini safely in healthcare.
- [`09-gcp-deployment.md`](docs/09-gcp-deployment.md) — Our live Cloud Run deployment and future Vertex AI scaling plan.
- *And much more...*

---

<div align="center">

*SwasthyaGrid AI — Because a district health system should know about a stock-out three days before it happens, not three days after.*

</div>
