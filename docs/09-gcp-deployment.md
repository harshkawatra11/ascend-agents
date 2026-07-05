# 09 — GCP Deployment

## Status
**Designed now, executed later.** We have a Gemini API key (AI Studio) and Google Cloud credits, but no GCP project has been provisioned/authenticated in this session yet. Deployment scaffolding (Dockerfile, docker-compose, CI/CD, scripts) is committed so deployment is a checklist away, not a redesign.

## ⚠️ Credits Discipline
Before running **any** command that provisions or deploys billable GCP resources:
1. Run `gcloud auth list` to confirm the intended account.
2. Run `gcloud billing accounts list` and `gcloud billing projects describe <PROJECT_ID>` to confirm the credits-backed billing account is attached.
3. Prefer **Cloud Run** (scale-to-zero, pay-per-request) over always-on compute to conserve credits.
4. Never enable BigQuery/Vertex AI training jobs or reserved capacity without an explicit human decision — these can burn credits fast.
5. If any step requires a paid subscription **other than** GCP credits or the Gemini 2.5 Flash free/AI-Studio tier, **stop and flag it** rather than proceeding.

## Target Architecture (Mirrors Mentor Repo Patterns)
| GCP Service | Purpose |
|---|---|
| Cloud Run | Hosts the FastAPI backend (serverless, scale-to-zero) |
| Cloud Run (or Vercel) | Hosts the Next.js frontend |
| Firestore | Production data store (replaces mock JSON via the repository abstraction) |
| Secret Manager | Stores `GEMINI_API_KEY`, Maps key, etc. |
| Cloud Storage | Static assets, exported reports |
| BigQuery | Analytics warehouse for district-wide historical trends |
| Vertex AI | Future home for trained XGBoost/LightGBM forecasting models |
| Cloud Scheduler + Cloud Functions | Periodic forecast recomputation batch jobs |
| Pub/Sub | Event bus for facility data-update events (future real-time ingestion) |

## Local Development (works today, no GCP required)
```bash
# Backend
cd backend
uv sync                     # or pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080

# Frontend
cd frontend
npm install
npm run dev
```
`.env` (backend) supports `USE_VERTEX_AI=false` and `USE_SECRET_MANAGER=false` so the app runs entirely on a local `GEMINI_API_KEY` and mock JSON data, with zero GCP dependency for the prototype demo.

## Deployment Steps (When Ready to Execute)
1. `gcloud auth login` and `gcloud config set project <PROJECT_ID>` — confirm billing per the checklist above.
2. `bash backend/scripts/setup_secrets.sh` — enables required APIs, creates a service account, stores `GEMINI_API_KEY` in Secret Manager.
3. `python backend/scripts/setup_firestore.py` — seeds the district data into Firestore.
4. `bash backend/scripts/deploy.sh` — builds the Docker image and deploys to Cloud Run.
5. Deploy frontend (Cloud Run static container, or Vercel free tier as a zero-cost alternative — flagged for a human decision since it's outside GCP credits).

## CI/CD
`.github/workflows/ci-cd.yml`: on push to `main` → lint (Ruff) → test (Pytest) → build Docker image → (manual-approval gated) deploy to Cloud Run. Requires GitHub secrets `GCP_PROJECT_ID` and `GCP_SA_KEY`, which are **not** set until the human explicitly provisions the GCP project.
