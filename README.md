# PantryPlan

Standalone source for the selected kitchen design. All application dependencies are included in this folder. No earlier designs, version gallery, hosting credentials, or parent-project files are required.

## Run

Python 3.10+ is required. From this folder:

```sh
python3 scripts/serve.py
```
             
Open http://127.0.0.1:8091/. The port defaults to 8091 so it can run alongside the existing prototype. Set PORT to choose another port. Do not open index.html directly because the application uses JavaScript modules and fetches catalog.json over HTTP.

No installation or API keys are needed. The optional Google Fonts stylesheet has a system-font fallback.

## Source files

- index.html — interface structure
- styles.css — responsive layout and palette
- app.js — UI events, views and interaction handling
- model.js — saved application state and weekly plan operations
- engine.js — filtering, TF-IDF recipe ranking, meal generation and grocery calculations
- catalog.json — 18 illustrative recipes and 30 generic products
- scripts/serve.py — local development server and experiment API
- scripts/recommender.py — separate Python reference ranker
- tests/ — domain, state and Python/JavaScript agreement tests

The frontend currently runs its recommendation logic in JavaScript. It does not call the optional Python recommendation API. Preferences and plans use browser localStorage. Sample recipes and labels are illustrative; there are no accounts, production database, or validated recommendation-quality claims.

## Tests

With Node.js 20+ and Python installed:

```sh
npm test
```

No npm install is necessary. To select a Python executable other than python3, set PANTRYPLAN_PYTHON for the test command.

## Copy into your repository

Copy the contents of this folder into your chosen repository, keeping the relative structure. Hidden .gitignore should be included. Do not copy this folder into the old project or copy another checkout's .git directory. Review the code and record substantive team changes through real tasks and teammate-reviewed pull requests.
