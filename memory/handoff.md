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

## State as of end of Session 1
Docs + memory scaffolding committed. Frontend/backend code not yet written — see `memory/next-tasks.md`.
