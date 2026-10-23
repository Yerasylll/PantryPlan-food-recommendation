# PantryPlan research evidence and requirements

Prepared October 23, 2026. Draft for teammate review. This document connects four questionnaire submissions and eight scientific publications plus four supporting sources to requirements, scope and evaluation. Only aggregate counts and anonymized paraphrases are included; raw responses, identities, exact timestamps and original publisher PDFs are excluded.

YouTrack: PP-8 findings, PP-34 requirements, PP-27 evaluation, PP-1 scope; PP-9–PP-11 literature review. The studies and planned checks below must not be reported as completed live interviews, implementation changes, reproduced experiments or completed human reviews.

## PantryPlan: findings from four questionnaire submissions

Analyzed 23 October 2026. This is an exploratory requirements study, not a representative survey, observed usability test or completed set of live interviews.

### Evidence and method

The owner view displayed four submissions and four answers to each of the thirteen questions. Consent was selected in all four submissions. Closed-question chart tables were transcribed and checked: single-choice totals equal four, and each checkbox count is between zero and four. Three groups of open answers were read and paraphrased; no direct quotes, names, emails or exact timestamps are reproduced. IDs such as Q13-A identify an answer within a question, not a person. No cross-question respondent linkage is inferred from the summary display order.

Four submissions do not independently verify four distinct individuals or the recruitment method. All observations are participant self-report or stated preference. The form did not establish student status, time saved, reduced waste, application task success or recommendation quality. Coding below is assistant-prepared; actual team peer review remains pending.

Source: the private Google Forms owner response view. Keep that view and any raw export private. A redacted aggregate JSON accompanies this report.

### Key counts

- Cooking: three submissions selected 3–4 days in the past week; one selected 5–7 days.
- Household servings: one selected two people, two selected 3–4 people, one selected five or more.
- Biggest difficulty: pantry stock two; serving quantities one; coordination across days one.
- Planning horizon: same day two, 1–2 days one, 3–7 days one.
- Proposed app priority: planning, consolidated shopping, pantry accounting and serving scaling each received one selection. Recipe discovery received none as the single top priority; this does not show that recipe recommendations are unwanted.
- Most useful recipe information: ingredients/quantities two, time one, preference match one.
- Cost, time and dietary/ingredient preferences each received three checkbox selections. These counts are not exclusive and do not establish willingness to pay or medical needs.

### Findings and traceability

| ID | Finding | Evidence | Design response | Literature | Requirements / tasks |
|---|---|---|---|---|---|
| F01 | Pantry visibility and low-effort entry | Q8: pantry stock 2/4; Q4-A–D describe stock checking; Q9-B/D report duplicate purchases; Q13-B requests low-effort input. | Prioritize visible pantry amounts and easy catalog-based edits. Recalculate missing quantities rather than treating pantry data as a separate note. | S2, S6 | FR09, FR10; PP-8, PP-23, PP-28 |
| F02 | Reliable serving quantities | Q8: serving quantities 1/4; Q3: all four cook for at least two people; Q9-A describes scaling trouble; Q13-A raises whole-item handling. | Make the serving basis explicit per recipe/plan entry. Keep exact recipe arithmetic separate from any whole-item purchase rounding. | S2, S7; NFR01 is an engineering constraint | FR05, FR08, new FR18; PP-8, PP-24, PP-34 |
| F03 | Flexible partial planning | Q6: same-day 2/4, 1–2 days 1/4, 3–7 days 1/4; Q8: multi-day coordination 1/4; Q9-C and Q13-B/C describe changing plans. | A week is a container, not a requirement to fill all 21 slots. Keep generation optional; allow meal moves, removals and replacement. | S2, S6 | FR06, FR07, FR09; PP-19, PP-23, PP-28 |
| F04 | Consolidated, current shopping lists | Q12: combined list 1/4; Q13-D explicitly requests consolidated quantities; Q13-B/C request consistent updates after plan edits. | Aggregate by canonical product ID and unit, subtract pantry once, and regenerate on each relevant edit without reload. | S6; canonical arithmetic is a project design rule | FR09, FR11, NFR01; PP-21, PP-24, PP-28 |
| F05 | Practical recipe information first | Q11: ingredients/quantities 2/4, cooking time 1/4, match to preferences 1/4. | Show amounts, serving basis and time prominently; retain truthful simple match explanations. This question does not measure trust or explanation comprehension. | S3 | FR04, FR05; PP-18, PP-28 |
| F06 | Household sharing is a requested extension | Q13-C requests synchronized shopping; Q7 methods are split across paper, notes/messages, a dedicated app and another person, one each. | Record shared lists as later backend work. Current localStorage and text export do not provide live synchronization. | S2, S6 | FR15 (future); PP-5, PP-17 |
| F07 | Constraints and cost matter, but do not justify unsupported features | Q10: time 3/4, cost 3/4, dietary/ingredient preferences 3/4; Q13-A requests substitutions. | Retain hard exclusions and time limits. Price optimization needs price data; automatic substitution needs ingredient–instruction consistency. Defer both claims. | S5, S7 | FR01, FR02, FR16; PP-13, PP-14 |
| F08 | The sample does not validate a student-only target group | Q3: no one selected a single-person serving context; the form did not collect student status, recruitment source or demographics. | Describe this as a small household/home-cook sample. Either broaden the provisional target to adult home cooks or recruit actual student users before asserting student-specific needs. | S2 | Proposal target users; PP-1, PP-6 |

### What changes now

Give the first demonstration a clear pantry → meal/servings → consolidated groceries path. Test same-week meal moves and partial plans explicitly. Present quantities and cooking time before more elaborate recommendation explanations. Keep the existing recipe–plan–grocery scope and TF-IDF baseline comparison; the sample is too small to justify abandoning recommendation research or expanding into every requested feature.

Shared editing is a future requirement; safe automatic substitutions and price optimization remain outside the first prototype. A single request is worth tracking but does not establish broad demand. Existing implemented functions require acceptance checks on the completed team repository before being called verified.

### What remains for the relevance-evidence criterion

The requirement document asks for 3–5 discussions with user representatives or a substantive actual-client agreement. These four self-administered forms are useful evidence, but are not automatically four discussions. If genuine conversations already happened, add their actual consent-aware session notes and distinguish them from form submissions. Otherwise use the prepared discussion guide for short follow-ups. Do not invent dialogue or change a questionnaire record into an interview record.

### Suggested defense statement

“We analyzed four anonymous-to-the-team questionnaire submissions. The exploratory findings highlighted pantry visibility, serving quantities and flexible planning. We used them to refine acceptance criteria and test scenarios, while deferring shared synchronization and automatic substitutions. The small self-selected sample and self-report method limit generalization; observed usability and ranking quality remain to be evaluated.”

### Literature connection

S2 motivates treating food choice and planning as contextual tasks; S3 motivates evaluating explanation comprehension separately; S6 motivates explicit user involvement and distinguishes grocery prediction from our quantity calculation. S5 and S7 motivate checking constraints and instruction consistency before generative features. These are design inferences from the reviewed works, not evidence that PantryPlan already improves outcomes. Source details and full-text page locators are retained in the literature review.

---

## Requirements after user-evidence analysis

Revision: 23 October 2026. This review copy supersedes older “no user evidence” wording for analysis purposes; it does not mark implementation or student review complete. Must items define the intended first-iteration behavior. Proposed refinements are testable targets, not claims that the prototype meets them.

### Functional requirements

| ID | Priority | Requirement | Acceptance criterion | Evidence | Current status |
|---|---|---|---|---|---|
| FR01 | Must | Edit preferences | Set diet, maximum time and ingredient exclusions through explicit controls; show active settings. | F07; existing scope | Local prototype implemented; complete repository/browser acceptance pending. |
| FR02 | Must | Filter before ranking | All returned recipes meet declared catalog constraints; impossible queries return no candidates rather than silently relaxing constraints. | F07; S5 | Domain tests passed in local handoff; not an allergy/medical safety claim. |
| FR03 | Must | Rank eligible recipes | TF-IDF and quickest-first operate on the same eligible candidate set with deterministic tie breaking. | Literature/method requirement; F05 does not reject recommendations | Local implementation; preference-quality evaluation pending. |
| FR04 | Must | Explain actual selection factors | Show truthful cooking time and matched preferences where present. Never present score as a probability or clinical suitability. | F05; S3 | Implemented locally; comprehension untested. |
| FR05 | Must | Expose recipe basis and instructions | Recipe details show ingredients, units, recipe servings, preparation time and steps; any planned-serving change clearly identifies its basis. | F02, F05 | Details exist locally; verify scaling presentation. |
| FR06 | Must | Edit a partial week | Users may keep slots empty, add/remove/replace meals, and move a meal to another compatible day. A full generated week must not be mandatory. Moving within the same week preserves grocery totals. | F03 | Edit/move logic exists locally; explicit empty-plan entry needs acceptance review. |
| FR07 | Must | Generate a plan only when requested | Generation respects meal types and constraints, prefers unused recipes, reports missing slots, and does not run as an unavoidable step in manual planning. | F03; S2 | Local generator exists; first-run suggested plan behavior should be reviewed. |
| FR08 | Must | Scale per planned meal | For a recipe with base b servings and quantity q, planned s servings require q*s/b. Preserve individual planned serving counts and recalculate the combined list. | F02 | Local arithmetic tests exist; inspect recipe-detail versus planned quantities. |
| FR09 | Must | Derive current groceries | Aggregate by product ID/canonical unit, apply all planned serving counts, subtract each pantry amount once, clamp purchases at zero, and refresh after any relevant edit without page reload. | F01, F03, F04 | Local engine implemented; integrated browser acceptance pending. |
| FR10 | Must | Maintain pantry with low effort | Choose an existing catalog product and edit its quantity without typing a product identifier. Zero removes stock; negative/nonfinite values are rejected; grocery quantities update immediately. | F01 | Catalog/input implementation exists locally; user effort remains unmeasured. |
| FR11 | Must | Use and export shopping lists | Mark items purchased and export current consolidated quantities with units and completion state. Explain that an export is a snapshot, not live synchronization. | F04, F06 | Local export implementation; manual acceptance pending. |
| FR12 | Must | Record recipe feedback | Like/unlike adjusts content-profile features; hidden recipes are excluded and saved state is reconciled. | Existing research scope; S2 | Local model/engine exists; repository still lacks state module. |
| FR13 | Must | Compare a baseline | Freeze candidate/profile rules and report per-case ranker outputs and prespecified relevance metrics; fixture diagnostics are not real-user outcome evidence. | S1, S4, S8; evaluation requirement | Plan prepared; real relevance judgments pending. |
| FR14 | Must | Reconcile constraints across saved plans | New preferences remove incompatible saved meals/manual products with feedback to the user; compatible meals preserve servings. | F07 | Local domain tests exist. |
| FR15 | Should / future backend | Share user-owned data safely | For an implemented future shared list, two authorized users see changes after synchronization and unauthorized users cannot access it; conflicts/retries have defined behavior. | F06 | Not implemented; current localStorage/export does not satisfy this. |
| FR16 | Should / research data | Use documented research data | Record permitted dataset use, provenance, stable IDs, coverage, unit handling and preprocessing before training/evaluation. | S1, S4, S8 | Illustrative catalog only; dataset ingestion not implemented. |
| FR17 | Later | Native mobile client | If developed, use the same backend contracts and pass core scenario checks. | No new evidence justifying a separate client | Deferred. |
| FR18 | Should / new design refinement | Separate purchase rounding from recipe arithmetic | For whole-item products, show exact calculated demand separately from any rounded-up buy quantity. Label rounding; never silently alter recipe quantities or instructions. For 1.25 each net demand, a proposed whole-item purchase is 2 each. | F02; new candidate requirement | Not implemented or accepted; confirm intended UX in follow-up discussions. |

### Nonfunctional refinements

- **NFR01 — arithmetic (Must):** fixed reference cases match within 0.01 canonical units. Do not infer mass-to-volume conversion. For proposed whole-item purchasing, round only after net aggregation/pantry subtraction and retain exact need separately.
- **NFR02 — repeatability (Must):** identical catalog/profile/mode yields identical order; record tokenization, IDF, normalization and tie rules. Maintain Python/JS agreement fixtures.
- **NFR03 — reproducibility (Must):** a complete checkout can start and test from the README with documented Node/Python prerequisites and no secrets.
- **NFR04 — truthful limitations (Must):** identify illustrative data, local storage, no live sharing/prices and no validated medical/allergen guarantees. Four questionnaire submissions are not four observed usability sessions.
- **NFR05 — privacy (Must):** keep raw form responses and recruitment records outside public Git history; publish aggregates/paraphrases only. Retain the form’s consent and deletion commitments.
- **NFR06 — accessible core flow (Must, proposed promotion):** recipe/serving/pantry/list actions work at 390px and 1440px and by keyboard. A dialog/day selector must provide an alternative to drag-and-drop. Record actual acceptance results; do not infer accessibility from screenshots.
- **NFR07 — performance (Should):** the previous p95 under one second at 10,000 recipes remains a proposed benchmark, not a measured result or a finding from four responses.
- **NFR08 — traceability (Must):** map each change from F01–F08 and/or S1–S8 to a requirement, actual task, reviewed PR and verification result.
- **NFR09 — future backend validation (Should):** authorization, input bounds and controlled failures are required before shared accounts/lists are delivered.

### Decisions kept outside the first iteration

- Automatic substitutions: offer a different eligible recipe or an explicit exclusion instead. A future substitution feature needs consistent ingredient quantities, cooking steps and constraints; changing a shopping label is insufficient.
- Cost optimization: document the request, but do not display savings or budgets without current, sourced price data.
- Live household sync: retain as a future backend item; text export is an interim snapshot only.
- Food-expiry optimization and medical diet prescriptions: not established requirements from this small study and not implemented.

### Review needed

Confirm FR18’s purchase-versus-recipe display with users. Agree whether to broaden the provisional audience from student-only to adult household cooks or recruit the original student audience. Have the assigned peer review these changes before adopting them as the team baseline.

---

## Proposal and scope update after research

### Problem statement for the report

Adult home cooks coordinate meal choices, household quantities, existing ingredients and shopping. Four exploratory questionnaire submissions described difficulties with pantry visibility, serving calculations and changing plans. These accounts justify examining an integrated workflow; they do not establish population prevalence, financial loss or that the proposed app solves those difficulties.

### Target users and sampling correction

The original proposal assumed students cooking for themselves. The form did not ask student status, and all four submissions described cooking for at least two people. The evidence therefore supports a provisional adult home-cook/household context, not a validated student-only user group. Proposed target wording: “Adults who cook at home and coordinate ingredients and meals for themselves or a household.” The team should ratify this focus with the supervisor; if student-specific scope is retained, recruit that group explicitly. Do not invent ages, occupations or demographics.

### Aim — retained

Design, implement and evaluate a system that recommends recipes under explicit preferences and constraints, supports editable meal plans, and derives consolidated grocery needs from planned servings and pantry quantities.

### First-iteration priorities

1. Make pantry quantities visible and easy to update.
2. Make serving bases and ingredient quantities understandable.
3. Support partial, editable plans and predictable grocery recalculation.
4. Keep recipe discovery and truthful preference/time explanations.
5. Compare the recipe ranker with a reproducible baseline and evaluate the integrated user task separately.

### Scope boundaries

Recipes, generic products and meal plans remain in scope; restaurant dishes remain excluded. Household live sharing is proposed future work. Automatic substitutions, retailer prices/checkout and health prescriptions remain outside V3. A request for a feature is not permission to claim it already exists.

### Claims supported now

- Four self-administered questionnaire submissions and their descriptive counts.
- Eight coded design findings traceable to responses and literature.
- A local V3 prototype and its previously recorded 24 passing domain tests/browser smoke checks.

### Claims not supported now

- Four live interviews or observed usability sessions.
- Student-specific demand, broad market need or representative prevalence.
- Reduced food waste, saved money/time, improved health or increased recommendation relevance.
- A completed deployed app while the team repository still lacks model.js and test/configuration files.

### Defense narrative — proposed slide text

“Exploratory questionnaire: n=4 submissions. Main reported difficulty: pantry visibility (2), serving quantities (1), multi-day coordination (1). Design response: reliable stock accounting, explicit serving quantities and flexible partial plans. Literature review informs constraints, evaluation and limits. Shared synchronization and automatic substitutions remain future work.”

Use counts instead of strong percentage claims; state self-report and sample limitations on the same slide.

---

## Evaluation plan refined by the questionnaire and literature

Revision: 23 October 2026. The four questionnaire submissions inform scenarios; they are not observed task outcomes or a new ranking benchmark. The following expected results are targets. None of these scenarios is newly reported as passed by writing this document.

### Engineering and formative checks

| ID | Trace | Scenario | Setup/action | Expected result | Evidence to collect |
|---|---|---|---|---|---|
| E01 | F01, F04 / FR09, FR10 | Stock accounting and duplicate prevention | Three plan entries require the same product: 100g, 200g and 150g; pantry is 120g. | One grocery row: exact need 450g, pantry 120g, buy 330g. Updating pantry to 500g makes buy zero. No double subtraction. | Deterministic reference case; run on final commit. |
| E02 | F02 / FR05, FR08 | Serving scaling | A recipe serves 4 and uses 400ml liquid. Plan it for 5 servings. | Demand is 500ml; basis and target servings are visible. Other plan entries keep their own serving counts. | Reference arithmetic + browser flow; do not infer culinary quality. |
| E03 | F03, F04 / FR06, FR09 | Change days without changing demand | Move a meal Tuesday → Thursday within the same week. | Exactly one meal entry changes day; no duplicate is created; grocery quantities stay identical. Keyboard/dialog alternative works. | Browser scenario; record assistance/errors. |
| E04 | F03, F04 / FR06, FR09 | Replace/remove a meal | Replace one meal, then remove it. | List reflects only current plan entries, pantry and manual extras; no stale ingredients or unnecessary reload. | Deterministic fixtures + observed browser check. |
| E05 | F03 / FR06, FR07 | Short planning horizon | Start a manual plan with only one or two chosen slots. | No forced full-week generation; empty slots remain usable; list covers selected meals only. | Check first-run suggested-plan behavior separately. |
| E06 | F01 / FR10, NFR06 | Low-effort pantry entry | Select a catalog product, set stock and later clear it. | No typing a product ID; clear units, validation and updated list; record actual actions/time rather than claiming ease. | Formative observation, not a questionnaire rating. |
| E07 | F05 / FR04, FR05 | Information and explanation comprehension | Inspect a recipe and explain its servings/time and why it appeared. | Observer records whether the participant names a true factor unprompted and distinguishes recipe servings from plan servings. | No success assumed from Q11 preferences. |
| E08 | F07 / FR02, FR14 | Hard exclusion | Exclude a product, then inspect recommendations and saved-plan reconciliation. | No result violates declared catalog labels; impossible requests stay empty. Do not market as clinical allergy protection. | Automated + browser verification. |
| E09 | F02 / candidate FR18 | Whole-item purchase display | Recipe needs 1.75 each and pantry is 0.5 each. | Proposed exact net need is 1.25 each; proposed purchase quantity is 2 each and visibly marked as rounded. Recipe amount stays 1.75. | Design walkthrough only until implemented; do not report pass now. |
| E10 | F06 / future FR15 | Sharing limitations | Explain how a shopping list reaches another household member today. | Current text export is described as a snapshot; no false real-time sync claim. Future shared-list conflict/auth checks remain separate. | Documentation/demo check; no backend implementation claim. |

### Usability sessions

Conduct 3–5 actual discussions with consent-aware anonymized notes. If the prototype is working, use E02, E03, E04, E06 and E07 as observed tasks. Record each task as unassisted, assisted, failed or not attempted; state which view/version was used. Do not silently count assisted tasks as unassisted success. Report counts by task and by session; repeated tasks within one person are not independent participants. Do not call a screenshot walkthrough a working-app test.

A short usability/discussion session can include both discovery questions and observed tasks, provided the record distinguishes them. It cannot retrospectively convert an anonymous form response into a live interview. Keep recruitment information outside the public evidence pack.

### Ranking experiment — retained, not claimed complete

Compare quickest-first B0 with TF-IDF M1 under identical eligibility, catalog and frozen preference profiles. Separate recipe ranking from planner diversity. Define relevance labels and candidate policy before viewing outputs; report no-positive/no-candidate cases and cold-start separately. For later interaction data use a documented temporal split and training-only histories; sampled-candidate results cannot be interpreted as full-catalog results. Use Precision@5/Recall@5/NDCG@5 with stated zero-positive and tie handling. No questionnaire response here directly labels individual recipes, so these four forms cannot support a ranking-quality score.

### Metrics and reporting conditions

- Arithmetic: reference quantities and absolute error within 0.01 canonical units; zero known label-based constraint violations.
- Plan behavior: correct slot/entry count, no duplicates after moves, stable quantities after same-week moves, correct deltas after replacement/removal.
- Usability: unassisted/assisted/failed/not-attempted counts, actual time and concrete confusion; no population-level success claim from 3–5 sessions.
- Explanation: true factor named without prompting; separate from declared preferred information in the form.
- Performance: retain the proposed warmed-run benchmark and record actual hardware/catalog size. It is not measured by form completion time.
- Record final commit SHA, catalog hash, runtimes, browser, viewport, evaluator, date, expected/actual outcome and defect links.

### Blank result record

Scenario / actual version / evaluator / date / expected / observed / pass-fail-not-run / assistance / defect or evidence link.

Existing evidence remains the local V3 handoff’s 24 passing automated tests and smoke checks. Run the combined final repository after missing files are uploaded; those earlier results do not automatically verify later team changes. Do not implement or claim a new feature simply to make a test pass before scope and acceptance are reviewed.

---

## What remains before the first preliminary defense

Audit: 23 October 2026. A complete production application is not required by the assessment; completed analysis/design/planning/supervision and a traceable repository are required.

### Newly completed analysis artifacts

- Four questionnaire submissions analyzed as self-report evidence, with descriptive counts and anonymized answer paraphrases.
- Findings F01–F08 mapped to requirements, literature and existing tasks.
- Revised proposal/user-group statement, functional/nonfunctional acceptance criteria and scope decisions.
- Evaluation scenarios E01–E10 and a distinction between executed local tests and planned user/ranking evaluation.

### Still needed

| Item | Next action | Owner / existing task |
|---|---|---|
| Discussion evidence | Confirm whether actual conversations happened; record them honestly or conduct 3–5 short follow-ups. Keep the four form submissions as questionnaire evidence. | Yerassyl / PP-6, PP-7, PP-8 |
| Team review of analysis | Review important source locators, counts, F01–F08 and the new acceptance criteria; record substantive comments and resulting changes. | Assigned literature owners/reviewers / PP-9–PP-11, PP-34 |
| Target group | Agree adult home-cook/household wording or recruit the originally proposed students; the current form did not verify student status. | Yerassyl + team / PP-1 |
| Existing-system and technology comparison | Finish evidence checks, justify at least three technology decisions with alternatives, and compare the same 6–10 criteria across 3–5 systems. | Assigned owners / PP-12, PP-13 |
| Architecture alignment | Review context/use-case/component diagrams against current local browser behavior and explicitly proposed backend. Sharing remains future work. | Assigned owners / PP-15–PP-17 |
| Complete repository | Add missing runtime/state/tests/configuration files and merge the README only after real teammate review. Upload reviewed research/design documents; no raw participant data. | Ginayat + team / PP-2, PP-23–PP-25 |
| Final prototype check | Run tests on the final combined commit and complete the key browser flow on its actual demo URL. | Ginayat + Yerassyl / PP-24, PP-28 |
| Supervisor review | Obtain actual feedback on deliverables, record it, and link meaningful revisions. | Team / PP-29, PP-30 |
| Defense and submission | Finish slides/report, use cautious evidence claims, rehearse, audit links, and tag the reviewed submission commit pre-defense-1. | Team / PP-31–PP-33 |

### Current public repository snapshot

Repository: https://github.com/Yerasylll/PantryPlan-food-recommendation

Files present in main: app.js, catalog.json, engine.js, index.html, scripts/recommender.py, scripts/serve.py, styles.css.

Still missing from main: model.js, tests/engine.test.mjs, tests/state.test.mjs, package.json, .gitignore, README.md. The README exists only in the open, unmerged documentation PR at the time of this audit. No submission tags were listed. The missing model.js is imported by the app, so the main-branch application is not yet a complete runnable V3 checkout.

The repository now includes catalog/engine/Python files, which is progress from the earlier three-file snapshot. Do not replace newer team work with an older full-folder upload. Add only missing reviewed files and relevant documentation through task-linked branches.

---

## Review checklist for the research follow-up

This is a blank review record, not evidence that a teammate has reviewed the work.

- Reviewer, author, actual date and reviewed commit/file:
- Counts match the Google Forms response summary (each denominator stated):
- No individual profiles were inferred by matching answer order across questions:
- Observations and interpretations are separated:
- Contradictory/limiting evidence remains visible:
- No student demographics, dialogue, observed task results or improvement claims were invented:
- Relevant scientific source locators checked:
- FR06 partial planning and FR09 recalculation criteria agreed:
- FR18 exact recipe need versus purchase rounding discussed with a user:
- Live household sync/substitution/price optimization scope accurately described:
- Raw responses and identifiers absent from public files:
- Review comments and resulting revisions:
- Accepted / changes requested, with reason:

---

## PantryPlan: critical literature review

Prepared 23 October 2026 for the first preliminary defense. Scope: recipe recommendations, weekly meal plans and generic grocery products; restaurant dishes are excluded.

### Review method and boundaries

The assessment asks for at least 12 meaningfully used sources, including at least 8 scientific publications. This focused review uses eight scientific works (including a peer-reviewed handbook chapter) and four official technical references. Seven scientific works are from 2022–2025. S8 (2019) is an explicit foundational exception for recipe-interaction data and chronological evaluation.

This is a targeted critical review, not a new systematic review or meta-analysis. Sources were selected for direct relevance to methods, explanations, grocery workflows, evaluation or scope boundaries. Official publisher/proceedings records and university repositories were preferred. All eight full-text PDFs were successfully downloaded and inspected for relevant methods, results and limitations. Page/section locators below allow the team to check the analysis. No experiments were reproduced, code executed from papers, or statistical results independently re-estimated. This assistant-prepared analysis is not a record of student reading or peer review.

“Free full text” means you can retrieve and read the whole work without payment at the listed public source. It does not imply that every article, image, dataset or codebase has the same reuse licence. The source register records that distinction. Original PDFs are supplied for team reading; link to the official copies in the public repository unless redistribution rights have been confirmed.

### Publication analysis overview

| ID | Scientific work | Evidence / critique / use |
|---|---|---|
| S1 | A systematic review on food recommender systems (2024) | Review of 67 studies; offline evaluation dominates. Limited coverage period and heterogeneous evidence; motivates reproducible comparisons. |
| S2 | Food Recommender Systems (2022) | Synthesizes algorithms, context, interfaces and evaluation. Not an experiment; supports separate ranking, planning and usability criteria. |
| S3 | “Tell Me Why”: using natural language justifications in a recipe recommender system to support healthier food choices (2024) | Two user studies of explanations. Meal ordering and context limit generalization; motivates honest reasons and a separate comprehension check. |
| S4 | RecipeRec: A Heterogeneous Graph Learning Model for Recipe Recommendation (2022) | Graph learning with 14 baselines; sampled negatives restrict interpretation. Candidate model for later interaction data, not evidence that our TF-IDF is competitive. |
| S5 | KERL: Knowledge-Enhanced Personalized Recipe Recommendation using Large Language Models (2025) | KG-augmented LLMs with generated QA benchmark. Template/context dependence limits transfer; supports constraint checks and deferring generated dietary advice. |
| S6 | Online grocery shopping recommender systems: Common approaches and practices (2024) | 50 grocery studies mapped across delivery stages. Retail prediction differs from our list calculator; motivates explicit user evidence and end-to-end evaluation. |
| S7 | Counterfactual Recipe Generation: Exploring Compositional Generalization in a Realistic Scenario (2022) | Counterfactual generation benchmark separates ingredient edits from cooking-action correctness. Adjacent scope evidence, not a ranking baseline. |
| S8 | Generating Personalized Recipes from Historical User Preferences (2019) | Historical-user generation study and temporal evaluation. Foundational data/split reference; not evidence for V3 ranking quality. |

### Structured publication analysis

#### S1 — A systematic review on food recommender systems (2024)

**Evidence and method.** Systematic review: 67 studies selected from 2,738 candidates; covers January 2017–October 2022.

**Finding.** Content-based/ML methods and offline accuracy evaluation are common; reproducibility and user attributes vary.

**Critical assessment.** The time window omits later LLM work; search/selection bias and no backward snowballing are acknowledged. Review frequency does not establish method superiority.

**PantryPlan implication (our inference).** Use a reproducible baseline and user-facing evaluation; treat our illustrative catalog as fixtures, not evidence of effectiveness.

**Check in full text:** Sections 3–5.8 and 6; PDF pp. 5–19 and 21 (university cover adds one page). **Trace:** FR02, FR03, FR13; PP-9, PP-27. [Publication](https://www.sciencedirect.com/science/article/pii/S0957417423026684) · [Download PDF](https://pure.tue.nl/ws/portalfiles/portal/314135978/1-s2.0-S0957417423026684-main.pdf).

#### S2 — Food Recommender Systems (2022)

**Evidence and method.** Scholarly synthesis of food-choice context, algorithms, interfaces, evaluation and research resources.

**Finding.** Food decisions have multiple contextual goals; meal-plan quality and offline prediction are different evaluation targets.

**Critical assessment.** This is a broad chapter, not a controlled comparison or a single benchmark. Incompatible datasets and protocols prevent universal algorithm rankings.

**PantryPlan implication (our inference).** Separate recipe ranking, plan construction and grocery calculation. Ask users about context and measure task completion separately from ranking metrics.

**Check in full text:** Sections 3–7; printed pp. 890, 896, 903–904 and 912; PDF pp. 21, 27, 34–35 and 43. **Trace:** FR06–FR09; PP-9, PP-16, PP-27. [Publication](https://research-portal.uu.nl/en/publications/food-recommender-systems/) · [Download PDF](https://dspace.library.uu.nl/bitstream/handle/1874/425599/978_1_0716_2197_4_23.pdf?sequence=1).

#### S3 — “Tell Me Why”: using natural language justifications in a recipe recommender system to support healthier food choices (2024)

**Evidence and method.** Two crowdsourcing studies, N=502 and N=504, comparing recipe choices with different justification styles/strategies.

**Finding.** Comparative explanations can influence healthier choices; effects differ by meal type and user motivation.

**Critical assessment.** US crowdsourcing and Mediterranean-style recipes limit transfer. Fixed meal ordering and repeated choices create order/carry-over concerns; choices do not demonstrate long-term behavior change.

**PantryPlan implication (our inference).** Explain actual preference matches and cooking time. Test comprehension rather than transferring health effects to our nonclinical prototype.

**Check in full text:** Sections 3.3, 4, 5.1.3 and 6; printed pp. 417–419, 427 and 433; PDF pp. 11–13, 21 and 27. **Trace:** FR04; PP-10, PP-28; questionnaire Q11. [Publication](https://link.springer.com/article/10.1007/s11257-023-09377-8) · [Download PDF](https://link.springer.com/content/pdf/10.1007/s11257-023-09377-8.pdf).

#### S4 — RecipeRec: A Heterogeneous Graph Learning Model for Recipe Recommendation (2022)

**Evidence and method.** Heterogeneous user–recipe–ingredient graph, attention, ingredient set transformer and contrastive learning; compared with 14 baselines.

**Finding.** Reports strongest results among tested methods on its graph and sampled-candidate evaluation.

**Critical assessment.** Leave-one-out testing samples 100 negative recipes per user; this is not full-catalog ranking. Warm historical interactions and one data setting do not establish cold-start or real-world benefit.

**PantryPlan implication (our inference).** Preserve canonical recipe/product IDs; defer graph training until licensed interactions exist. Report candidate-set construction and test cold-start separately.

**Check in full text:** Section 2 and Sections 4.1–4.5; printed pp. 3467, 3469–3470; PDF pp. 2, 4–5. **Trace:** FR03, FR16; PP-9, PP-27. [Publication](https://www.ijcai.org/proceedings/2022/481) · [Download PDF](https://www.ijcai.org/proceedings/2022/0481.pdf).

#### S5 — KERL: Knowledge-Enhanced Personalized Recipe Recommendation using Large Language Models (2025)

**Evidence and method.** FoodKG retrieval plus task-specific LoRA adapters for recommendations, recipe text and nutrients; 77,900 template-derived QA examples split 80/10/10.

**Finding.** Reports stronger constrained-answer performance than its tested LLM baselines; code and benchmark are linked.

**Critical assessment.** Template-derived QA is not a field study of meal planning. Knowledge-graph correctness bounds retrieval; authors note context errors and inaccurate nutrient extremes.

**PantryPlan implication (our inference).** Keep hard constraints explicit and generation outside the first release. Add impossible-query cases; never infer medical suitability or validated nutrients from generated output.

**Check in full text:** Sections 4.1–5.2, Table 2 and Section 7; printed pp. 19129–19133; PDF pp. 5–9. **Trace:** FR02, FR16, NFR04; PP-10, PP-14. [Publication](https://aclanthology.org/2025.acl-long.938/) · [Download PDF](https://aclanthology.org/2025.acl-long.938.pdf).

#### S6 — Online grocery shopping recommender systems: Common approaches and practices (2024)

**Evidence and method.** Systematic review of 50 papers from 2018–March 2023, organized around goal, consumer data, computation, evaluation and presentation.

**Finding.** Consumer involvement and interface reporting are limited; reviewed work focuses on next-item/basket predictions and implicit data.

**Critical assessment.** A bounded grocery-shopping review cannot establish our integrated workflow as novel. Retail purchasing differs from deterministic missing-ingredient calculation; review selection bias is acknowledged.

**PantryPlan implication (our inference).** Collect voluntary explicit user input, evaluate interface usefulness, and describe grocery arithmetic separately from learned recommendation. Do not equate survey interest with demonstrated benefit.

**Check in full text:** Sections 3–5, especially 4.6 and discussion; printed/PDF pp. 5–7 and 11–13. **Trace:** FR09, FR10; PP-11, PP-7, PP-27; Q4, Q7–Q9. [Publication](https://www.sciencedirect.com/science/article/pii/S0747563224002048) · [Download PDF](https://edepot.wur.nl/670104).

#### S7 — Counterfactual Recipe Generation: Exploring Compositional Generalization in a Realistic Scenario (2022)

**Evidence and method.** Chinese recipe corpus; 50 dish-pair evaluation tasks change a principal ingredient. Tests ingredient coverage, preservation, cooking actions and human judgments.

**Finding.** Surface ingredient replacement can succeed while required cooking actions remain wrong; expert recipes outperform tested models.

**Critical assessment.** Cuisine/language scope and surface-form ambiguity limit generalization. The work benchmarks generation rather than ranking and does not validate substitutions for dietary safety.

**PantryPlan implication (our inference).** Exclude automatic substitutions from V3. Preserve ingredient–instruction consistency and document canonical product mapping.

**Check in full text:** Sections 4, 6–8, Limitations and Ethics Statement; printed pp. 7356–7362; PDF pp. 3–9. **Trace:** FR05, NFR01; PP-10, PP-14. [Publication](https://aclanthology.org/2022.emnlp-main.497/) · [Download PDF](https://aclanthology.org/2022.emnlp-main.497.pdf).

#### S8 — Generating Personalized Recipes from Historical User Preferences (2019)

**Evidence and method.** Personalized recipe generation with attention over user histories; filtered Food.com recipe/review data, chronological per-user validation/test holdouts and human comparisons.

**Finding.** Personalization improves several reported plausibility/personalization measures, with metric trade-offs rather than uniform gains.

**Critical assessment.** Generation differs from top-N retrieval. Users require prior reviews, so results do not establish cold-start quality. Historical English-language activity may not represent our target users.

**PantryPlan implication (our inference).** Retain this older paper for dataset provenance and temporal-split design. Separate generation/ranking metrics and investigate licensing before importing data.

**Check in full text:** Sections 4–5 and Tables 1–2; printed pp. 5978–5980; PDF pp. 3–5. **Trace:** FR13, FR16; PP-11, PP-14, PP-27. [Publication](https://aclanthology.org/D19-1613/) · [Download PDF](https://aclanthology.org/D19-1613.pdf).

### Cross-source synthesis and resulting decisions

1. **Define the task before choosing the model.** Ranking a recipe, composing a week and calculating quantities are different problems. We will evaluate the selected recipe’s suitability, plan coverage/variety and grocery arithmetic separately (S2, S6). The integrated workflow is an engineering focus, not an established worldwide research gap.
2. **Keep constraints outside the ranking score.** Exclusions and declared time/diet constraints must determine eligibility first. An impossible query should remain empty rather than relaxing a constraint silently. TF-IDF is an inspectable starting representation, not a claimed state-of-the-art result (S1, S5, T1).
3. **Compare fairly.** Use the same eligible candidates for quickest-first and TF-IDF. Define relevance judgments, cutoff, tie rules and profile construction before examining test outcomes. With interaction data, fit user history on training data only and keep future interactions out of it. Sampled-negative and full-catalog metrics must not be compared as equivalent (S4, S8, T2).
4. **Measure more than offline ranking.** Add hard-constraint violation counts, unfilled plan slots, arithmetic correctness and observed completion of recipe → plan → groceries. Ask whether users understand why a recipe appeared; do not infer trust, health improvement or saved time from a screenshot or a questionnaire preference (S1–S3, S6).
5. **Defer unsupported complexity.** Graph learning needs suitable interaction data. LLM retrieval/generation needs trustworthy knowledge and separate output checks; ingredient replacement may require different cooking actions. V3 therefore retrieves fixed illustrative recipes and performs deterministic grocery calculations (S4, S5, S7).
6. **Keep architecture claims accurate.** Current ranking is browser JavaScript with localStorage and a sample catalog. A FastAPI/PostgreSQL service and user accounts are proposed future work, not completed infrastructure (T3, T4).

### Supporting references and substantive use

**T1 — [scikit-learn: Text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction).** Defines TF-IDF, normalization and sparse feature representations. Inspect our implementation separately: presence-based canonical ingredient tokens differ from a general word-frequency text pipeline. Record formula and tokenization before reproducing comparisons. **Trace:** FR03, NFR02; engine.js and scripts/recommender.py. Access checked 23 October 2026.

**T2 — [scikit-learn: ndcg_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ndcg_score.html).** Defines rank-sensitive discounted gain and normalization. Predefine relevance labels, cutoff, tie handling and zero-relevance behavior; document differences if implementing DCG directly. NDCG measures ranking agreement, not cooking feasibility or usability. **Trace:** FR13; PP-27 evaluation plan. Access checked 23 October 2026.

**T3 — [SQLite: Appropriate Uses For SQLite](https://www.sqlite.org/whentouse.html).** Supports the embedded/local versus shared client/server storage comparison. Local simplicity does not establish suitability for a central concurrent multi-user service. Browser localStorage is the current implementation; neither SQLite nor PostgreSQL has been implemented. **Trace:** PP-13 technology comparison; proposed FR15. Access checked 23 October 2026.

**T4 — [FastAPI: Features](https://fastapi.tiangolo.com/features/).** Supports the proposed Python API decision through schema validation and API documentation capabilities. Framework features are not measured PantryPlan performance. The existing standard-library Python experiment server is not a FastAPI backend. **Trace:** PP-13, PP-17; proposed NFR09. Access checked 23 October 2026.

### What this review does not establish

It does not prove that PantryPlan improves diet, reduces waste, saves shopping time, outperforms another model, or solves a unique research gap. Two generation papers are deliberately adjacent work used to justify boundaries and evaluation precautions; they are not recipe-ranking baselines. User needs remain hypotheses until genuine user evidence is collected. The team should check important locators, agree decisions, and record actual review comments before submitting.

### Bibliography

**S1.** Jon Nicolas Bondevik, Kwabena Ebo Bennin, Önder Babur, Carsten Ersch (2024). *A systematic review on food recommender systems*. Expert Systems with Applications, 238, 122166. https://doi.org/10.1016/j.eswa.2023.122166

**S2.** David Elsweiler, Hanna Hauptmann, Christoph Trattner (2022). *Food Recommender Systems*. Recommender Systems Handbook, 3rd edition, pp. 871–925. https://doi.org/10.1007/978-1-0716-2197-4_23

**S3.** Alain D. Starke, Cataldo Musto, Amon Rapp, Giovanni Semeraro, Christoph Trattner (2024). *“Tell Me Why”: using natural language justifications in a recipe recommender system to support healthier food choices*. User Modeling and User-Adapted Interaction, 34, pp. 407–440. https://doi.org/10.1007/s11257-023-09377-8

**S4.** Yijun Tian, Chuxu Zhang, Zhichun Guo, Chao Huang, Ronald Metoyer, Nitesh V. Chawla (2022). *RecipeRec: A Heterogeneous Graph Learning Model for Recipe Recommendation*. IJCAI-22, pp. 3466–3472. https://doi.org/10.24963/ijcai.2022/481

**S5.** Fnu Mohbat, Mohammed J. Zaki (2025). *KERL: Knowledge-Enhanced Personalized Recipe Recommendation using Large Language Models*. ACL 2025, Volume 1: Long Papers, pp. 19125–19141. https://doi.org/10.18653/v1/2025.acl-long.938

**S6.** Laura Z. H. Jansen, Kwabena E. Bennin, Ellen van Kleef, Ellen J. Van Loo (2024). *Online grocery shopping recommender systems: Common approaches and practices*. Computers in Human Behavior, 159, 108336. https://doi.org/10.1016/j.chb.2024.108336

**S7.** Xiao Liu, Yansong Feng, Jizhi Tang, Chengang Hu, Dongyan Zhao (2022). *Counterfactual Recipe Generation: Exploring Compositional Generalization in a Realistic Scenario*. EMNLP 2022, pp. 7354–7370. https://doi.org/10.18653/v1/2022.emnlp-main.497

**S8.** Bodhisattwa Prasad Majumder, Shuyang Li, Jianmo Ni, Julian McAuley (2019). *Generating Personalized Recipes from Historical User Preferences*. EMNLP-IJCNLP 2019, pp. 5976–5982. https://doi.org/10.18653/v1/D19-1613


---

## Scientific full-text download register

All eight PDFs downloaded successfully on 23 October 2026. Local files use stable S1–S8 IDs matching the review.

- **S1: A systematic review on food recommender systems (2024)** — [publication](https://www.sciencedirect.com/science/article/pii/S0957417423026684), [full PDF](https://pure.tue.nl/ws/portalfiles/portal/314135978/1-s2.0-S0957417423026684-main.pdf); local `papers/S1.pdf`. CC BY 4.0, stated on article first page

- **S2: Food Recommender Systems (2022)** — [publication](https://research-portal.uu.nl/en/publications/food-recommender-systems/), [full PDF](https://dspace.library.uu.nl/bitstream/handle/1874/425599/978_1_0716_2197_4_23.pdf?sequence=1); local `papers/S2.pdf`. Free university-repository full text; publisher copyright retained. Repository reuse conditions apply; no blanket open licence asserted.

- **S3: “Tell Me Why”: using natural language justifications in a recipe recommender system to support healthier food choices (2024)** — [publication](https://link.springer.com/article/10.1007/s11257-023-09377-8), [full PDF](https://link.springer.com/content/pdf/10.1007/s11257-023-09377-8.pdf); local `papers/S3.pdf`. CC BY 4.0, stated in article Open Access notice

- **S4: RecipeRec: A Heterogeneous Graph Learning Model for Recipe Recommendation (2022)** — [publication](https://www.ijcai.org/proceedings/2022/481), [full PDF](https://www.ijcai.org/proceedings/2022/0481.pdf); local `papers/S4.pdf`. Free full PDF from official proceedings. Reuse licence not verified; retain publisher/author attribution.

- **S5: KERL: Knowledge-Enhanced Personalized Recipe Recommendation using Large Language Models (2025)** — [publication](https://aclanthology.org/2025.acl-long.938/), [full PDF](https://aclanthology.org/2025.acl-long.938.pdf); local `papers/S5.pdf`. Free full PDF from ACL Anthology. Reuse terms should be checked at the official publication; no dataset/code licence inferred.

- **S6: Online grocery shopping recommender systems: Common approaches and practices (2024)** — [publication](https://www.sciencedirect.com/science/article/pii/S0747563224002048), [full PDF](https://edepot.wur.nl/670104); local `papers/S6.pdf`. CC BY 4.0, stated on article first page

- **S7: Counterfactual Recipe Generation: Exploring Compositional Generalization in a Realistic Scenario (2022)** — [publication](https://aclanthology.org/2022.emnlp-main.497/), [full PDF](https://aclanthology.org/2022.emnlp-main.497.pdf); local `papers/S7.pdf`. Free full PDF from ACL Anthology. Paper access does not establish unrestricted rights to the underlying website recipes.

- **S8: Generating Personalized Recipes from Historical User Preferences (2019)** — [publication](https://aclanthology.org/D19-1613/), [full PDF](https://aclanthology.org/D19-1613.pdf); local `papers/S8.pdf`. Free full PDF from ACL Anthology. Check dataset rights separately; paper access does not license Food.com content.


---

## PantryPlan: questionnaire and user-discussion protocol

Prepared 23 October 2026. Protocol prepared before collection. Four questionnaire submissions are now analyzed in 01-user-findings.md; genuine discussion records are still pending.

- [Respondent link](https://docs.google.com/forms/d/e/1FAIpQLSdV8L9dkuocUe_tfGnxNj1avBZDzBHbsOkLlZi_utrm20W7tA/viewform) — share this link with participants.

### What the questionnaire can establish

This is a 5–7 minute exploratory questionnaire about cooking, meal planning and grocery-shopping habits. It supports requirements discovery, not causal claims or a representative survey. The assessment explicitly asks for 3–5 discussions with user representatives or a substantive actual-client agreement. Therefore, use the questionnaire as supplementary evidence and conduct 3–5 brief live discussions; do not relabel form submissions as completed conversations.

### Google Forms configuration

The published form has 13 questions: one required adult-consent question and 12 optional research questions, including three open-answer questions. Email collection is **Do not collect**; one-response sign-in restriction is **off**; response editing is **off**; public results summaries are **off**; autosave is **disabled**; quiz mode is **off**. Respondent access is **anyone with the link**. Publishing sent no notifications. No names, email, contact details, university, medical histories, file uploads or participant IDs are requested.

Anonymity is limited to information the team collects: Google hosts the form and may process technical data. Free-text respondents are instructed not to identify themselves. Exact timestamps can also make individuals more recognizable in a small group; omit or coarsen them in shared exports. Do not publish raw answers. The participant notice specifies deletion of raw responses within 30 days after the final diploma assessment. Withdrawal before submission is possible; after an anonymous submission the team may be unable to locate a specific answer.

No sign-in plus no direct identifiers is preferred here over enforcing one response per account. Duplicate submissions remain possible; ask people to submit once and report that limitation rather than collecting identities to deduplicate.

### Questionnaire inventory and traceability

| Q | Content | Type | Why it is asked / candidate requirement |
|---|---|---|---|
| 1 | Adult eligibility and voluntary informed consent | Required single choice | Research participation; close the form to decline |
| 2 | Days cooking in the past week | Optional single choice | Experience/context; avoid assuming every participant cooks daily |
| 3 | Usual number of servings | Optional single choice | FR08 serving scaling |
| 4 | Most recent meal: deciding, checking stock and shopping | Optional paragraph | Observe the current workflow; FR06, FR09, FR10 |
| 5 | Sources of meal ideas | Optional checkboxes | Existing alternatives and discovery habits; FR03, FR05 |
| 6 | Planning horizon | Optional single choice | FR06 weekly planning; may challenge the weekly-plan assumption |
| 7 | Current shopping-list method | Optional single choice | FR09, FR11; document current alternatives |
| 8 | Greatest recent difficulty, including none | Optional single choice | Prioritization; do not assume a problem exists |
| 9 | Concrete difficulty, response and outcome | Optional paragraph | Context and evidence behind a difficulty; FR06–FR11 |
| 10 | Meal-choice factors | Optional checkboxes | FR01–FR03; distinguish soft preferences from constraints |
| 11 | Most useful recipe information, including none | Optional single choice | FR04/FR05 explanation and comprehension |
| 12 | Most useful part of a proposed tool, including preferring current practice | Optional single choice | Scope/prioritization; stated interest is not demonstrated adoption |
| 13 | Missing needs, objections and reasons to avoid the tool | Optional paragraph | Counter-evidence, privacy/usability concerns; NFR04/NFR06 |

Mappings above are hypotheses for analysis, not validated requirements. Preserve both agreement and disagreement.

### Conduct 3–5 real discussions: 12–15 minutes each

Recruit adults who cook or help with shopping, with different cooking frequencies and household sizes. A small convenience sample is suitable for initial discovery, not population estimates. Contact people yourselves through channels you normally use; the assistant has not sent invitations. Do not require form completion to join a discussion or try to identify anonymous form answers.

1. **Opening and consent, 1 minute.** Explain the diploma purpose, voluntary participation, optional questions and anonymized notes. Ask permission to take notes. Do not record audio/video by default. If the person declines, stop.
2. **Current behavior, 4 minutes.** Ask: “Walk me through the last time you decided what to cook and bought ingredients.” Follow with “What did you check first?”, “How did you know what you already had?”, and “What happened next?” Ask for a concrete example rather than agreement with the app idea.
3. **Difficulties and workarounds, 3 minutes.** Ask “What, if anything, was difficult?”, “How did you handle that?”, “Which tools did you use?”, and “What worked well about your current method?” Include cases where no difficulty occurred.
4. **Preferences and quantities, 2 minutes.** Ask which constraints a recipe must respect, what can be traded off, and how they calculate quantities. Do not ask for diagnoses or sensitive health details. Discuss interface behavior generically if a participant volunteers sensitive details; omit those details from notes.
5. **Optional prototype task, 3 minutes.** Only if the working V3 prototype is available, ask the participant to choose a recipe, place it in a plan, and find groceries for two servings. Observe before helping. Record where assistance was required. If the prototype is unavailable, use a screenshot walkthrough and label it as such; do not claim task completion.
6. **Explanation and closing, 2 minutes.** Ask “Why do you think this recipe was suggested?”, “What would you change first?”, and “What would make you continue with your current method?” Thank them without promising a finished product.

A live interviewer may know who the participant is. Describe these as discussions with anonymized notes, not guaranteed anonymous interactions. Use U01–U05 only in the notes; keep any recruitment/contact record separate and private. Do not connect a participant’s name to their form response.

### Blank discussion record — copy once per actual session

- Participant code: U__
- Actual date, duration and interviewer:
- Note-taking consent obtained: Yes / No (stop if No)
- Cooking/shopping context, described broadly:
- Recent process described by the participant:
- Concrete difficulty or evidence of no difficulty:
- Existing tools and workaround:
- Observation versus participant self-report:
- Prototype task used: None / screenshot / working app
- Task outcome and assistance, if actually observed:
- Explanation understood or misunderstood, with evidence:
- Interpretation by the team (separate from observation):
- Candidate requirement and priority change:
- Contradictory evidence / alternative interpretation:
- Reviewer and follow-up:

### Analyze after real data arrives

Export responses privately. Inspect and redact accidental identifiers before sharing even anonymized notes. Assign R01… in the analysis copy; do not encode identities. Keep exact timestamps and raw text out of the public Git repository. Have two teammates independently read open responses and agree a small coding scheme: discovery, time, pantry visibility, quantity, planning, shopping omissions, explanation, privacy, no unmet need, and emerging themes. Allow multiple codes and record disagreement.

For each closed question report counts and the number who answered that question. Checkbox totals can exceed the number of participants. Missing answers are not disagreement; do not infer prevalence from a convenience sample. With 3–5 discussions, prefer “3 of 5 participants described…” to precise percentages. Do not force agreement, discard negative feedback, or use statistical significance claims.

Use a findings table with columns **Finding ID / source R or U / anonymized observation / interpretation / candidate requirement / action / owner / reviewer**. Keep it blank until real evidence exists. Revise requirements only after reviewing the evidence. Make the limitations visible in the defense: small self-selected sample, recall effects, interviewer influence, possible duplicate form entries, and English-language participation.

### Ready-to-share invitation — not sent

“We are researching everyday meal planning and grocery shopping for our diploma project. If you are 18 or over and cook or help with shopping, you may complete this voluntary anonymous-to-the-team questionnaire (about 5–7 minutes): https://docs.google.com/forms/d/e/1FAIpQLSdV8L9dkuocUe_tfGnxNj1avBZDzBHbsOkLlZi_utrm20W7tA/viewform . We do not ask for names or emails. Please do not include identifying or medical details, and submit only once. We welcome accounts of what already works as well as difficulties.”

### Method and settings references

The questions use the project’s requirements as hypotheses, not findings. Explanation and context questions follow the design implications recorded under S2/S3/S6 in the literature review. Google’s official documentation describes [publication access and sign-in restrictions](https://support.google.com/docs/answer/2839588?hl=en) and [email-collection settings](https://support.google.com/docs/answer/139706?hl=en). Live settings and the respondent view were checked on 23 October 2026.
