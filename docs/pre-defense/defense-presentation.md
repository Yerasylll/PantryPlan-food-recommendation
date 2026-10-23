# PantryPlan first preliminary defense

Prepared 23 October 2026. Twelve editable slides are available in the associated Codex presentation. This text preserves slide content and speaker notes for team handoff. Rehearsal and actual delivery remain pending.

## 1. PantryPlan

Design and Development of an Intelligent Food

Recommendation System Using Machine Learning

First preliminary defense · 24 October 2026

Yerassyl Alimbek · Yerkebulan Abdissattar · Ginayat Yerassyl

### Speaker notes and sources

Supervisor: Praveen Kumar. Present this as an early prototype and research plan. Current ranking is deterministic TF-IDF with rules. No trained model quality or user benefit is claimed.

## 2. Problem and intended users

Adult home cooks must coordinate meals with available ingredients.

Our initial study points to pantry visibility and serving quantities.

PantryPlan connects recipe selection to partial weekly plans

and a consolidated grocery list.

### Speaker notes and sources

Provisional target: adult home cooks. The four anonymous submissions do not establish student status. Proposal: https://github.com/Yerasylll/PantryPlan-food-recommendation/pull/4 . Explain target-group assumptions rather than presenting them as validated demographics.

## 3. Scope of the first prototype

Recipe recommendations apply dietary exclusions and time limits.

Meal entries store their day, meal type and serving count.

Groceries aggregate ingredients and subtract pantry stock.

Restaurant dishes, shared accounts and live prices are outside scope.

### Speaker notes and sources

Current source: https://github.com/Yerasylll/PantryPlan-food-recommendation . Generic products support grocery calculations. Shared synchronization and price optimization remain future work.

## 4. Four questionnaire submissions

2 of 4 identified pantry stock as their biggest difficulty.

All four reported cooking for at least two people.

Same-day planning appeared in 2 of 4 submissions.

These exploratory self-reports guide requirements.

### Speaker notes and sources

Source: private Google Forms owner response summary, transcribed and analyzed on 23 October 2026. https://github.com/Yerasylll/PantryPlan-food-recommendation/pull/2 . Keep respondent-level records private. Four submissions do not independently verify four people, live interviews, observed task success or population preferences.

## 5. Literature and research direction

Eight scientific works cover food and grocery recommendation.

Topics include explanations, constraints and personalized recipes.

Seven works date from 2022–2025. One 2019 work is foundational.

The evaluation plan compares TF-IDF with a simple baseline.

### Speaker notes and sources

Full bibliography, download rights and page locators: docs/research/README.md on pp-8-research-findings. Eight scientific works include one handbook chapter. Key sources: Bondevik et al. 2024 review, Elsweiler et al. 2022 handbook chapter, Starke et al. 2024 explanations, RecipeRec 2022, KERL 2025, grocery recommendation review 2024, counterfactual recipe generation 2022, Majumder et al. 2019. Open full-text copies and verified links are retained in the literature package. Do not claim ranking experiments have already run.

## 6. Existing systems

Mealime, Paprika, Samsung Food and Eat This Much

form a comparison across ten consistent criteria.

Planning, pantry handling, grocery lists and personalization

inform the design. Feature evidence depends on product and tier.

### Speaker notes and sources

Full four-system, ten-criterion table: https://github.com/Yerasylll/PantryPlan-food-recommendation/pull/4 . Official sources checked 23 October: https://support.mealime.com/article/151-getting-started-guide ; https://www.paprikaapp.com/help/iphone/ ; https://samsungfood.com/meal-planner/ ; https://www.eatthismuch.com/ . NE in the report means not established by the cited evidence, not absent. No claim of market superiority.

## 7. Technology decisions

Current interface: HTML, CSS and browser JavaScript.

Current storage: localStorage with JSON catalog data.

Current hosting: GitHub Pages. Python is a local reference tool.

Five decisions compare alternatives and separate future API work.

### Speaker notes and sources

Decision record: PR4 docs/pre-defense/README.md. Alternatives include frontend approaches, FastAPI/Django/Express, SQLite/PostgreSQL/MongoDB, TF-IDF/collaborative filtering/embeddings, and static versus service hosting. Current application has no deployed backend, account service or trained neural model. Official technical references are linked in the decision record.

## 8. Current application architecture

app.js renders views, handles actions and writes browser storage.

engine.js filters and ranks recipes and computes groceries.

model.js manages weeks, slots and state validation.

catalog.json supplies the sample recipes and products.

### Speaker notes and sources

Editable context, use-case and component diagram sources plus SVG exports: PR4 docs/pre-defense/. scripts/recommender.py is an optional reference ranker. It is not called by the static hosted application. Current app state remains within this browser.

## 9. Live demonstration

1. Search for chickpea and inspect the recipe.

2. Add a meal for two servings to Tuesday lunch.

3. Enter 200 g of pantry stock against 800 g required.

4. Show 600 g to buy, then reload the purchased checklist.

### Speaker notes and sources

Live demo: https://yerasylll.github.io/PantryPlan-food-recommendation/ . These steps follow the actual hosted smoke check on 23 October. A fresh browser may need the same planning setup. Keep local startup available as a fallback. Do not present this arithmetic scenario as proof of recommendation quality.

## 10. Verification results

Latest source: 24 tests passed, 0 failed on 23 October.

Hosted checks covered search, planning and grocery arithmetic.

Checks also covered reload persistence and weekly separation.

The mobile layout fit a 390-pixel viewport.

### Speaker notes and sources

Latest source main c286d697485dcdfbc04536789b43785a7d0ce85f. Tests run after the new formatting/catalog commits. Earlier browser checks used frozen e213081 plus bounded hosted verification. Detailed execution record in PR4. No screen-reader certification, physical-phone test, exhaustive focus/drag coverage or real-user evaluation is claimed.

## 11. Recommendation evaluation plan

Compare TF-IDF ranking with a cooking-time baseline.

Hold dietary constraints constant across both methods.

Measure relevance with explicit judgments and ranking metrics.

Evaluate task completion and explanation clarity separately.

### Speaker notes and sources

See PR2 evaluation plan with E1–E10 scenarios and acceptance criteria. Use a documented held-out split and predeclared metrics appropriate to available judgments. Report cold-start and sparse-feedback limitations. No numerical recommendation performance or time/waste savings has been measured yet.

## 12. Delivery status and next work

Live prototype, research analysis and design documents exist.

The pre-defense-1 release preserves the original source snapshot.

Documentation PRs still need integration into the submitted snapshot.

Next: user discussions, evaluation execution and final submission.

### Speaker notes and sources

Repository https://github.com/Yerasylll/PantryPlan-food-recommendation ; release /releases/tag/pre-defense-1 ; YouTrack https://pantryplan-team.youtrack.cloud/projects/PP . Do not move the existing tag. Draft PR2 contains research, PR3 README, PR4 design/evidence. Human reviews are separate from deliverable availability. Rehearsal and actual submission receipt remain team actions. Explain the existing TF-IDF prototype and planned ML work candidly.
