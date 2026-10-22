# PantryPlan

PantryPlan is a diploma-project prototype for recipe recommendations, weekly meal planning, and grocery lists. Restaurant dishes are outside the scope.

## Repository completion

The October 23, 2026 audit found only `index.html`, `styles.css`, and `app.js` in this repository. The team must add the remaining selected V3 files before the complete app can run: `engine.js`, `model.js`, `catalog.json`, `scripts/recommender.py`, `scripts/serve.py`, `tests/engine.test.mjs`, `tests/state.test.mjs`, `package.json`, and `.gitignore`.

## Run after the remaining files are added

Requirements: Python 3.10+ and Node.js 20+ for tests. No package installation or API key is required.

```sh
python3 scripts/serve.py
```

Open http://127.0.0.1:8091/. Opening `index.html` directly will not work reliably because the app uses JavaScript modules and loads JSON over HTTP.

```sh
npm test
```

The selected V3 local handoff passed 24 automated tests; rerun them on the combined repository after upload. This is local prototype verification, not evidence of recommendation quality or completed teammate review.

## Current implementation and limits

The browser runs the JavaScript TF-IDF ranker and stores preferences and plans in localStorage. The Python ranker is a separate reference implementation; the frontend does not call its optional API. The illustrative catalog contains 18 recipes and 30 generic products. Accounts, a central database, cross-device sync and validated nutrition/allergen data are not implemented.

## Team workflow

Use the actual YouTrack task ID in meaningful commit messages and pull requests, such as `PP-25: Add prototype setup documentation`. Request a teammate review before marking a task complete.

- [YouTrack board](https://pantryplan-team.youtrack.cloud/agiles/204-1/218-1)
- [PP-25: setup documentation](https://pantryplan-team.youtrack.cloud/issue/PP-25)
- [Delivery and review guide](https://pantryplan-team.youtrack.cloud/articles/PP-A-1/PantryPlan-delivery-and-review-guide)
