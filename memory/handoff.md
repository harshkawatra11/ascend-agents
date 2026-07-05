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
- GitHub: public repo `harshkawatra11/SwasthyaGrid-gdg-buildwithai`, commit at each checkpoint listed in `memory/current-task.md`.

## State as of end of Session 2
The frontend is now a real multi-page dashboard app (not a single scroll page): `(dashboard)` route group, sidebar+topbar shell, 10 routed pages, role switcher, API-client-with-mock-fallback, lifted recommendation state, live risk-downgrade on approval, ⌘K palette, toasts, drawers. Verified end-to-end in-browser against the live FastAPI backend. Backend and docs/memory structure otherwise unchanged from Session 1.

## State as of end of Session 1 (superseded above for frontend)
Full vertical slice built and pushed: docs, memory, frontend dashboard (Next.js, mock data, verified in-browser), backend (FastAPI, verified via curl/pytest), Gemini Ask feature (coded, fallback verified, no live key set), deployment scaffolding (Docker/scripts committed; CI/CD workflow file NOT yet pushed — see below).

## Two things to do next, in order
1. Run `gh auth refresh -h github.com -s workflow` (device-code flow), then `git add .github/workflows/ci-cd.yml && git commit -m "ci: add workflow" && git push` — the workflow file exists locally but isn't committed because the push was rejected without this scope.
2. Add `GEMINI_API_KEY` to `backend/.env` to make "Ask SwasthyaGrid" live end-to-end; everything else already works without it.

See `memory/next-tasks.md` for the fuller backlog.
