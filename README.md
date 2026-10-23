# PantryPlan

**Diploma project:** Design and Development of an Intelligent Food Recommendation System Using Machine Learning.

PantryPlan connects recipe discovery, editable meal plans, pantry quantities and a consolidated grocery list. This repository contains the selected V3 web prototype and its JavaScript/Python reference logic.

## Problem, users and expected outcomes

Home cooks need to choose meals, account for household preferences and available ingredients, adjust servings, and decide what to buy. PantryPlan investigates whether one understandable workflow can support these decisions while respecting explicit ingredient and time constraints.

The initial proposal targeted students who cook for themselves. Four anonymous questionnaire submissions now inform household-oriented requirements; student status was not measured. Adult home cooks and households are a **provisional** broader target, pending team/supervisor agreement. The sample does not establish population demand or measured time/money savings.

**Aim:** design, implement and evaluate personalized recipe selection, editable meal planning and pantry-aware grocery calculation.

Expected outcomes include a documented application, requirements and architecture, a catalog with consistent ingredient identifiers, a reproducible baseline comparison, verification results and a defensible evaluation report. Research questions remain open: does content-based ranking improve relevance over a cooking-time baseline, are grocery calculations correct after plan edits, and can intended users complete the workflow?

## Team and responsibilities

| Team member | Responsibility | YouTrack account |
|---|---|---|
| Yerassyl Alimbek | Interface, navigation and interactions; user evidence; presentation | `admin` |
| Yerkebulan Abdissattar | Catalog, recommendation engine, Python reference and architecture | `potterinobabe2107` |
| Ginayat Yerassyl | Application state, persistence, tests, configuration and delivery coordination | `yerasylginayat` |

**Supervisor:** Praveen Kumar. Responsibilities identify ownership; they do not substitute for individual contributions or actual review records. The students must be able to explain their submitted work. Supervisor approval is not claimed by this README.

## Scope and current status

Implemented prototype scope:

- Recipe browsing, search, preferences, ingredient/allergen exclusions and cooking-time filters.
- Content-based ingredient TF-IDF ranking and a cooking-time baseline.
- Editable weekly meal plans, serving quantities and feedback.
- Generic grocery products, pantry amounts, aggregated shopping quantities and checklist/export interactions.
- Browser-local persistence, JavaScript state/domain tests and a Python reference ranker.

**Restaurant dishes are excluded.** Accounts, a production database, cross-device/household synchronization, checkout/delivery, live retailer prices, medical meal planning and automatic ingredient substitutions are outside the delivered prototype. New whole-item purchase-rounding criteria are documented proposals, not claimed implemented features.

The catalog has **18 illustrative recipes and 30 generic products**. Dietary/allergen labels are sample metadata, not clinically validated safety guarantees. Grocery output is calculated from meals and pantry stock; it is not a separately trained product-prediction model. Ranking improvement and user benefit have not yet been established by real-user evaluation.

## Submission version and verification

- [First preliminary-defense release: `pre-defense-1`](https://github.com/Yerasylll/PantryPlan-food-recommendation/releases/tag/pre-defense-1)
- Frozen source commit: [`e213081f9507cf1468a8392db877d8abaa5b9a28`](https://github.com/Yerasylll/PantryPlan-food-recommendation/commit/e213081f9507cf1468a8392db877d8abaa5b9a28)
- On **23 October 2026**, the assistant ran `node --test tests/*.test.mjs` against files from that exact commit: **24 passed, 0 failed**. Checks include catalog references, hard constraints, serving/grocery arithmetic, state validation, week movement and Python/JavaScript ranking agreement.
- These are automated prototype checks, not completed usability studies or evidence of recommendation superiority. Final hosted/mobile/keyboard acceptance and real teammate review are separate tasks.

This README update follows publication of the tag and therefore is **not part of the frozen `pre-defense-1` snapshot**. Documentation PRs #1 and #2 were also unmerged when that tag was published. Do not move an already submitted tag to include later changes; keep later work in the same repository and identify the next submission separately.

## Technologies and architecture

| Component | Current implementation | Role |
|---|---|---|
| Interface | HTML, CSS, browser JavaScript ES modules | Responsive views and interactions |
| State | `model.js` and browser `localStorage` | Weekly records, validation, preferences and persistence |
| Recommendation/planning | `engine.js`, ingredient TF-IDF and deterministic constraints | Ranking, baseline, plan generation and grocery arithmetic |
| Data | `catalog.json` | Canonical product references and illustrative recipe quantities |
| Reference implementation | Python 3.10+, standard library | Independent ranking implementation and local experiment endpoints |
| Verification | Node.js 20+ `node:test`, Python | Automated domain/state checks and reference agreement |
| Delivery | GitHub, YouTrack; static frontend hosting supported | Source history, assigned tasks and prototype delivery |

The browser reads `catalog.json` and executes JavaScript logic locally. UI events call `model.js`/`engine.js`; state is stored in the current browser. The frontend **does not call** the Python recommendation API. `scripts/serve.py` is a loopback development server, not a deployed production backend. FastAPI/SQLite and other backend alternatives discussed in research are proposed options, not installed components.

## Setup and execution

Prerequisites: **Python 3.10+** for local serving; **Node.js 20+** and Python for tests. No API keys, npm dependencies or package installation are required.

```sh
git clone https://github.com/Yerasylll/PantryPlan-food-recommendation.git
cd PantryPlan-food-recommendation
python3 scripts/serve.py
```

Open **http://127.0.0.1:8091/**. Do not open `index.html` directly: ES modules and catalog loading need HTTP. To choose another port:

```sh
PORT=8092 python3 scripts/serve.py
```

For a checkout of the frozen submission, run `git switch --detach pre-defense-1` after cloning. Create a branch before developing from that checkout.

Optional local experiment endpoints are `GET /api/catalog` and `POST /api/recommend`. The prototype also works on a static host that serves its source files; Python endpoints are unavailable on static hosting. An optional Google Fonts stylesheet has a system-font fallback. The public prototype is hosted at [PantryPlan on GitHub Pages](https://yerasylll.github.io/PantryPlan-food-recommendation/). On 23 October 2026, core recipe/plan/pantry/grocery flows, export, reload persistence and mobile navigation were checked; broader accessibility and cross-browser evaluation remain pending. See PP-26 and PP-28.

## Testing

From the repository root:

```sh
npm test
```

Equivalent command:

```sh
node --test tests/*.test.mjs
```

The parity tests invoke `python3`. If a different executable is needed, set it explicitly, for example:

```sh
PANTRYPLAN_PYTHON=python3.11 npm test
```

Record the tested commit, environment and actual outcomes. Automated checks do not replace manual browser checks, intended-user discussions, held-out ranking evaluation or peer review.

## Repository structure

```text
index.html                  Interface structure
styles.css                  Responsive styles
app.js                      Views and event handling
model.js                    State, persistence and week operations
engine.js                   Ranking, constraints, planning and groceries
catalog.json                Illustrative recipes and generic products
scripts/recommender.py       Python reference ranker
scripts/serve.py             Loopback server and experiment endpoints
tests/engine.test.mjs        Domain and cross-language verification
tests/state.test.mjs         State validation and week operations
package.json                Start/test commands
.gitignore                  Local/generated-file exclusions
README.md                   Project and submission entry point
```

Documentation and diagrams must also be versioned. They are **not yet all present in the tagged source tree**; the links/status below distinguish available review artifacts from missing submission evidence.

## Project documentation and criteria

- [YouTrack project](https://pantryplan-team.youtrack.cloud/projects/PP)
- [Delivery guide, responsibilities, milestones, risks and dependencies](https://pantryplan-team.youtrack.cloud/articles/PP-A-1/PantryPlan-delivery-and-review-guide)
- [Proposal, comparisons, provenance, architecture and hosted verification PR #4](https://github.com/Yerasylll/PantryPlan-food-recommendation/pull/4)
- [Complete design/evidence report and editable/exported diagrams](https://github.com/Yerasylll/PantryPlan-food-recommendation/tree/pp-12-design-evidence/docs/pre-defense) (review branch; not merged).
- [Research and requirements review PR #2](https://github.com/Yerasylll/PantryPlan-food-recommendation/pull/2)
- [Complete research document on its review branch](https://github.com/Yerasylll/PantryPlan-food-recommendation/blob/pp-8-research-findings/docs/research/README.md): critical literature review, downloadable full-text links, four-submission findings, scope update, testable requirements, evaluation scenarios and discussion protocol. This is a branch artifact, not merged documentation.

| Assessment component | Available evidence / remaining action |
|---|---|
| Proposal | Problem, aim, objectives and scope summarized here; research PR contains the target-group/proposal update. The full updated proposal is available in PR #4; final team/supervisor agreement remains pending. PP-1. |
| User relevance | Four questionnaire submissions analyzed; findings mapped to requirements. Actual 3–5 discussion records or the permitted substantive client agreement still require evidence. PP-6–PP-8. |
| Literature | Critical analysis of eight scientific works and four official technical references, with source locators/download links, in PR #2. Team review pending; retain the stated foundational-source exception. PP-9–PP-11. |
| Existing systems | Four systems compared across ten criteria using dated official sources in PR #4; documented capabilities and hands-on testing are distinguished. Team review pending. PP-12. |
| Technology decisions | Five decisions with alternatives and requirement-based rationale are recorded in PR #4; proposed backend choices remain subject to review. PP-13. |
| Requirements | Priorities and acceptance criteria prepared in PR #2; distinguish implemented behavior from proposed refinements. PP-34. |
| Architecture | Context, UML use-case and component diagrams have editable Mermaid/PlantUML sources and visually checked SVG exports in PR #4; human review pending. PP-15–PP-17. |
| Prototype | V3 source and frozen release available; core hosted/browser smoke evidence recorded; broader QA remains pending. PP-18–PP-26, PP-28. |
| Evaluation | Ten research-informed scenarios and baseline/measurement plan prepared; real-user quality/usability results remain future work. PP-27. |
| Project management | Assigned YouTrack tasks, priorities, milestone, risk register and dependency links available. Complete authentic review/contribution/access audit. PP-2–PP-5, PP-32. |
| Supervisor feedback | Obtain actual substantive comments and link the resulting decisions/revisions. PP-29–PP-30. |
| Defense submission | Tag published. Finish materials, rehearsal, access checks and remaining evidence; publication alone does not establish full assessment readiness. PP-31–PP-33. |

## Contribution and review process

Use an actual matching task ID in branch names, commits and PRs, for example `pp-25-submission-readme` and `PP-25: Document project and submission criteria`. Describe the change, evidence and remaining limitations. Another teammate must review before merging. A reviewer assignment or assistant-prepared document is not evidence that a student has read or approved it. Existing `ACTUAL-ID` commit prefixes do not automatically identify real issues; link those actual commits manually in YouTrack without rewriting history or timestamps.

Keep `main` as the reviewed baseline going forward. Never commit passwords, access tokens, participant identities or raw research responses. Public research artifacts contain aggregate counts and anonymized paraphrases only. Preserve existing submission tags and list outstanding tasks honestly.
