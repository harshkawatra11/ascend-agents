# Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-05 | Project named **SwasthyaGrid AI**, authors Harsh Kawatra & Dayita Arora | Sounds like infrastructure, not another chatbot |
| 2026-07-05 | Repo: public, `harshkawatra11/SwasthyaGrid-gdg-buildwithai`, pushed via `gh` CLI | Judges need frictionless read access |
| 2026-07-05 | Documentation-first workflow: `docs/` written before any code | Repository is single source of truth; enables handoff without conversation history |
| 2026-07-05 | Monorepo: `frontend/` (Next.js) + `backend/` (FastAPI) | Matches mentor repo's backend shape while keeping one repo for judges to browse |
| 2026-07-05 | Mentor repo (`shivkumarsah/GDG-BuildWithAI_smart-health-ai-platform`) fetched via WebFetch, not cloned | Extract architecture/deployment patterns without depending on or copying their code |
| 2026-07-05 | Gemini used only for explanation, never prediction | Keeps forecasts auditable/deterministic; avoids hallucinated numbers |
| 2026-07-05 | Core AI principle: AI proposes, human approves/rejects/modifies — enforced at API layer (recommendations always start `pending`) | This is the hackathon's stated winning angle; must be structurally true, not just a UI label |
| 2026-07-05 | Design system: beige/warm-neutral editorial palette, serif+sans pairing, risk colors reserved for signal only | Explicit user mandate: no blue-purple SaaS look, must feel agency-grade |
| 2026-07-05 | Mock-data-first: deterministic mock forecast/recommendation generators instead of trained ML models | This is a prototyping round; judged on concept/UX of the human-AI loop, not model accuracy. Real XGBoost/LightGBM deferred, designed in [[docs/06-forecasting]] |
| 2026-07-05 | GCP deployment scaffolded but not executed this session | No GCP project authenticated yet; Gemini AI Studio key available now. User directive: only spend GCP credits / Gemini 2.5 Flash free tier — stop and flag anything else needing payment |
