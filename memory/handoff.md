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

## State as of end of Session 4 (current)
Fully live, full-stack: frontend on Vercel (`swasthyagrid.vercel.app`), backend on Cloud Run (`https://swasthyagrid-api-616415200021.asia-south1.run.app`, project `swasthyagrid-ai-54886`), Firestore + Secret Manager provisioned. Verified via live network-request inspection that the production dashboard fetches real backend data, not mock fallback. No mentor-repo references anywhere. `pitch-deck.html` exists at the repo root.

## What's still pending
1. **Add the real Gemini key** in two places once you have it:
   - Cloud Run backend: `printf '%s' 'KEY' | gcloud secrets versions add gemini-api-key --data-file=- --project=swasthyagrid-ai-54886` (no redeploy needed).
   - Vercel's `/api/ask` route: `cd frontend && vercel env add GEMINI_API_KEY production`, then `vercel deploy --prod`.
2. See `memory/next-tasks.md` for the fuller backlog (PHC Staff data-entry UI, real ML models, live Firestore wiring behind `DistrictRepository`, i18n, etc).

## GCP project reference
Project `swasthyagrid-ai-54886`, region `asia-south1`, billing account `010FBB-4DDDDA-4656C5`. To tear down if no longer needed: `gcloud projects delete swasthyagrid-ai-54886` (stops all billing for it).
