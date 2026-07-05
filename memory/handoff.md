# Handoff

If you're picking this up fresh, read in this order:
1. `docs/00-vision.md` — what we're building and why
2. `memory/decision-log.md` — locked decisions, don't relitigate these
3. `memory/next-tasks.md` — what's queued
4. `docs/01-architecture.md` through `docs/07-recommendation-engine.md` — technical contracts before touching code
5. `docs/08-design-system.md` — non-negotiable: no blue-purple, editorial beige palette

## Key constraints to respect
- AI never auto-executes; recommendations always start `pending` (see `docs/07-recommendation-engine.md`).
- Gemini (`gemini-2.5-flash`) explains, never predicts numbers.
- No spending beyond GCP credits + Gemini free/AI-Studio tier — flag anything else before proceeding.
- GitHub: public repo `harshkawatra11/SwasthyaGrid-gdg-buildwithai`, CI/CD is green.
- Live site: **https://swasthyagrid.vercel.app** (Vercel project `swasthyagrid`, team `harsh-s-vercel-team`), git-connected for auto-deploy on push to `master`. Monorepo build config lives in the root `vercel.json` (builds `frontend/`) since the project's dashboard Root Directory setting couldn't be changed via CLI/MCP tooling.
- Never extract or use stored CLI/tool auth tokens directly against an API — if a needed action has no proper CLI/MCP path, find a config-file-based workaround (as done for the Vercel monorepo root) or ask the user to do the one dashboard click.

## State as of end of Session 3 (current)
Submission-ready: no mentor-repo references anywhere (verified via grep), a Next.js `/api/ask` serverless route makes the Ask feature work standalone in production (Gemini 2.5 Flash, grounded via inlined mock data, graceful fallback), the frontend is live and auto-deploying on `swasthyagrid.vercel.app`, and `pitch-deck.html` (12 on-brand, 16:9, print-to-PDF slides) exists at the repo root.

## What's still pending
1. **Add the real Gemini key** in two places once you have it:
   - `backend/.env` → `GEMINI_API_KEY=...` (activates the FastAPI backend's own Ask agent for local dev).
   - Vercel env: `cd frontend && vercel env add GEMINI_API_KEY production`, then redeploy — activates the live site's `/api/ask` route.
2. Provision a GCP project + deploy the FastAPI backend to Cloud Run when ready (`docs/09-gcp-deployment.md` has the credits-discipline checklist and scripts).
3. See `memory/next-tasks.md` for the fuller backlog (PHC Staff data-entry UI, real ML models, Firestore, i18n, etc).
