# Next Tasks

## Immediate / small
- [ ] Push `.github/workflows/ci-cd.yml` — currently untracked because the `gh` OAuth token lacks the `workflow` scope. Run `gh auth refresh -h github.com -s workflow`, complete the device-code flow, then `git add .github/workflows/ci-cd.yml && git commit && git push`. The file exists at that path locally but is git-untracked/uncommitted.
- [ ] Add `GEMINI_API_KEY` to `backend/.env` (gitignored) to activate the live "Ask SwasthyaGrid" feature — code is complete and falls back gracefully without it (see [[decision-log]]).

## Next milestones
- [ ] Provision a GCP project and confirm the credits-backed billing account (checklist in `docs/09-gcp-deployment.md`) before running `backend/scripts/setup_secrets.sh` / `deploy.sh`.
- [ ] Wire `RecommendationsPanel` and `ResourceTransfers` frontend components to real backend state (currently separate local `useState`, not lifted/shared — approve action doesn't yet appear in the Resource Transfers log live; acceptable for this prototype demo but worth fixing for a polished walkthrough).
- [ ] Replace mock forecast generators with real XGBoost/LightGBM per `docs/06-forecasting.md`, once historical data exists.
- [ ] Live Firestore wiring behind `DistrictRepository` (interface is already designed for this swap).
- [ ] Multilingual i18n, auth/roles — out of scope so far.

## Deferred (explicitly out of scope this session)
- Real trained XGBoost/LightGBM models
- Live Firestore/BigQuery wiring
- Actual `gcloud` deploy execution (needs project auth + explicit human go-ahead, and credits discipline per `docs/09-gcp-deployment.md`)
- Multilingual i18n, auth/roles
