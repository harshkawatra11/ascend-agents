# Next Tasks

## Immediate / small
- [ ] Push `.github/workflows/ci-cd.yml` — currently untracked because the `gh` OAuth token lacks the `workflow` scope. Run `gh auth refresh -h github.com -s workflow`, complete the device-code flow, then `git add .github/workflows/ci-cd.yml && git commit && git push`. The file exists at that path locally but is git-untracked/uncommitted.
- [ ] Add `GEMINI_API_KEY` to `backend/.env` (gitignored) to activate the live "Ask SwasthyaGrid" feature — code is complete and falls back gracefully without it (see [[decision-log]]).

## Next milestones
- [ ] Provision a GCP project and confirm the credits-backed billing account (checklist in `docs/09-gcp-deployment.md`) before running `backend/scripts/setup_secrets.sh` / `deploy.sh`.
- [x] ~~Wire `RecommendationsPanel` and `ResourceTransfers` frontend components to real backend state~~ — done in Session 2 via `lib/store.tsx`'s `RecommendationsProvider`.
- [ ] PHC Staff role is gated (read-only on recommendations) but has no actual inventory/OPD/bed/attendance data-entry UI yet — currently just a framing note in `docs/04-ui-flows.md`. Build it out if the demo needs to show the multi-user story end-to-end.
- [ ] Facility drawer's live medicine/bed/doctor detail only populates when the FastAPI backend is reachable (`getFacilityDetail` in `lib/api.ts`); consider richer mock fallback data if demoing offline.
- [ ] Replace mock forecast generators with real XGBoost/LightGBM per `docs/06-forecasting.md`, once historical data exists.
- [ ] Live Firestore wiring behind `DistrictRepository` (interface is already designed for this swap).
- [ ] Multilingual i18n, auth/roles — out of scope so far.

## Deferred (explicitly out of scope this session)
- Real trained XGBoost/LightGBM models
- Live Firestore/BigQuery wiring
- Actual `gcloud` deploy execution (needs project auth + explicit human go-ahead, and credits discipline per `docs/09-gcp-deployment.md`)
- Multilingual i18n, auth/roles
