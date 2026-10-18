import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import {
  recommend,
  makePlan,
  groceryList,
  eligible,
  sanitizePlan,
  fit,
  validateProfile,
} from "../engine.js";
const catalog = JSON.parse(
  fs.readFileSync(new URL("../catalog.json", import.meta.url)),
);
const profile = {
  diet: "any",
  maxMinutes: 60,
  preferred: ["chickpeas", "tomato"],
  excluded: [],
  avoidAllergens: [],
  liked: [],
  disliked: [],
};
test("catalog has unique IDs and valid ingredient references, quantities and dietary labels", () => {
  const ids = catalog.products.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(
    new Set(catalog.recipes.map((r) => r.id)).size,
    catalog.recipes.length,
  );
  for (const r of catalog.recipes) {
    assert.ok(r.minutes > 0);
    assert.ok(r.servings > 0);
    for (const i of r.ingredients) {
      assert.ok(ids.includes(i.productId));
      assert.ok(i.quantity > 0);
    }
    const ps = r.ingredients.map((i) =>
      catalog.products.find((p) => p.id === i.productId),
    );
    assert.equal(
      r.vegan,
      ps.every((p) => p.vegan),
    );
    assert.equal(
      r.vegetarian,
      ps.every((p) => p.vegetarian),
    );
    assert.deepEqual(
      r.allergens,
      [...new Set(ps.flatMap((p) => p.allergens))].sort(),
    );
  }
});
test("vegan constraint holds for every returned recipe and plan slot", () => {
  const p = { ...profile, diet: "vegan" };
  assert.ok(recommend(catalog, p).length);
  assert.ok(recommend(catalog, p).every((r) => r.vegan));
  assert.ok(
    makePlan(catalog, p).plan.every(
      (s) => catalog.recipes.find((r) => r.id === s.recipeId).vegan,
    ),
  );
});
test("ingredient exclusions and allergen filters are hard constraints", () => {
  const p = {
    ...profile,
    excluded: ["tomato"],
    avoidAllergens: ["soy", "milk", "egg", "gluten", "fish", "peanut"],
  };
  const ranked = recommend(catalog, p);
  assert.ok(ranked.length);
  assert.ok(
    ranked.every(
      (r) =>
        !r.ingredients.some((i) => i.productId === "tomato") &&
        !r.allergens.length,
    ),
  );
});
test("time limit holds and empty candidate list is explicit", () => {
  assert.ok(
    recommend(catalog, { ...profile, maxMinutes: 15 }).every(
      (r) => r.minutes <= 15,
    ),
  );
  assert.equal(recommend(catalog, { ...profile, maxMinutes: 1 }).length, 0);
  const x = makePlan(catalog, { ...profile, maxMinutes: 1 });
  assert.equal(x.plan.length, 0);
  assert.equal(x.missing.length, 21);
});
test("TF-IDF vectors are normalized and ingredient preference affects order", () => {
  const m = fit(catalog.recipes);
  for (const v of Object.values(m.vectors))
    assert.ok(
      Math.abs(Object.values(v).reduce((s, w) => s + w * w, 0) - 1) < 1e-10,
    );
  const ranked = recommend(catalog, {
    ...profile,
    preferred: ["chickpeas"],
    liked: [],
  });
  assert.equal(ranked[0].id, "chickpea-salad");
  assert.ok(ranked[0].score > 0);
});
test("unknown preference tokens cause finite deterministic fallback scores", () => {
  const p = { ...profile, preferred: ["unknown-token"] };
  const a = recommend(catalog, p);
  assert.ok(a.every((r) => r.score === 0));
  assert.deepEqual(
    a.map((r) => r.id),
    recommend(catalog, p, { mode: "baseline" }).map((r) => r.id),
  );
});
test("likes change scores; dislikes exclude items", () => {
  const p = {
    ...profile,
    preferred: [],
    liked: ["salmon-potato"],
    disliked: ["berry-yogurt"],
  };
  const a = recommend(catalog, p);
  assert.equal(a[0].id, "salmon-potato");
  assert.ok(!a.some((r) => r.id === "berry-yogurt"));
});
test("baseline orders by cooking time without relaxing filters", () => {
  const a = recommend(
    catalog,
    { ...profile, diet: "vegetarian" },
    { mode: "baseline" },
  );
  assert.ok(a.every((r) => r.vegetarian));
  assert.ok(a.every((r, i) => i === 0 || r.minutes >= a[i - 1].minutes));
});
test("planner fills unique day/meal slots with matching meal types and serving sizes", () => {
  const { plan, missing } = makePlan(catalog, profile, { servings: 3 });
  assert.equal(plan.length, 21);
  assert.equal(missing.length, 0);
  assert.equal(new Set(plan.map((s) => `${s.day}:${s.meal}`)).size, 21);
  for (const s of plan) {
    assert.equal(s.servings, 3);
    assert.equal(catalog.recipes.find((r) => r.id === s.recipeId).meal, s.meal);
  }
});
test("planner rotates compatible options before repeating", () => {
  const { plan } = makePlan(catalog, profile);
  const first = plan.filter((s) => s.meal === "lunch").slice(0, 6);
  assert.equal(new Set(first.map((s) => s.recipeId)).size, 6);
});
test("grocery quantities scale and aggregate repeated ingredients", () => {
  const list = groceryList(catalog, [
    { recipeId: "chickpea-salad", servings: 2 },
    { recipeId: "chickpea-salad", servings: 1 },
  ]);
  assert.equal(list.find((p) => p.id === "chickpeas").quantity, 600);
  assert.equal(list.find((p) => p.id === "lemon").quantity, 3);
});
test("pantry subtracts once from combined total and clamps at zero", () => {
  const list = groceryList(
    catalog,
    [
      { recipeId: "chickpea-salad", servings: 2 },
      { recipeId: "chickpea-salad", servings: 1 },
    ],
    { chickpeas: 100, lemon: 10 },
  );
  assert.equal(list.find((p) => p.id === "chickpeas").quantity, 500);
  assert.ok(!list.some((p) => p.id === "lemon"));
});
test("direct product additions share grocery aggregation with meal plan", () => {
  const list = groceryList(
    catalog,
    [{ recipeId: "chickpea-salad", servings: 1 }],
    { tomato: 50 },
    [{ productId: "tomato", quantity: 100 }],
  );
  assert.equal(list.find((p) => p.id === "tomato").quantity, 200);
});
test("invalid quantities, IDs and profiles are rejected", () => {
  assert.throws(() =>
    groceryList(catalog, [], {}, [{ productId: "tomato", quantity: -1 }]),
  );
  assert.throws(() =>
    groceryList(catalog, [], {}, [{ productId: "unknown", quantity: 1 }]),
  );
  assert.throws(() =>
    groceryList(catalog, [{ recipeId: "nope", servings: 1 }]),
  );
  assert.throws(() =>
    groceryList(catalog, [{ recipeId: "chickpea-salad", servings: 1 }], {
      tomato: NaN,
    }),
  );
  assert.throws(() => makePlan(catalog, profile, { servings: 0 }));
  assert.throws(() => validateProfile({ ...profile, maxMinutes: NaN }));
  assert.throws(() => validateProfile({ ...profile, diet: "unknown" }));
});
test("saved plans discard duplicate, malformed and newly incompatible slots", () => {
  const p = { ...profile, diet: "vegan" };
  const rows = [
    { day: 0, meal: "lunch", recipeId: "chickpea-salad", servings: 1 },
    { day: 0, meal: "lunch", recipeId: "chickpea-salad", servings: 1 },
    { day: 1, meal: "lunch", recipeId: "chicken-rice", servings: 1 },
    { day: 1, meal: "breakfast", recipeId: "chickpea-salad", servings: 1 },
    { day: 9, meal: "lunch", recipeId: "chickpea-salad", servings: 1 },
  ];
  assert.equal(sanitizePlan(catalog, rows, p).length, 1);
});
test("product catalog uses the same hard dietary constraints", () => {
  const tofu = catalog.products.find((p) => p.id === "tofu");
  assert.equal(
    eligible(tofu, { ...profile, diet: "vegan", avoidAllergens: ["soy"] }),
    false,
  );
  assert.equal(eligible(tofu, { ...profile, diet: "vegan" }), true);
});
test("Python and JS reference rankings agree across multiple profiles", () => {
  const python = process.env.PANTRYPLAN_PYTHON || "python3";
  const profiles = [
    profile,
    { ...profile, diet: "vegan", preferred: ["rice"] },
    { ...profile, preferred: [], liked: ["salmon-potato"] },
    { ...profile, maxMinutes: 15, avoidAllergens: ["milk", "egg"] },
  ];
  const code =
    "import sys,json;sys.path.insert(0,'scripts');from recommender import recommend;d=json.load(sys.stdin);print(json.dumps([{'id':r['id'],'score':r['score']} for r in recommend(d['catalog'],d['profile'])]))";
  for (const p of profiles) {
    const r = spawnSync(python, ["-c", code], {
      input: JSON.stringify({ catalog, profile: p }),
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr);
    const py = JSON.parse(r.stdout),
      js = recommend(catalog, p);
    assert.deepEqual(
      py.map((r) => r.id),
      js.map((r) => r.id),
    );
    for (let i = 0; i < py.length; i++)
      assert.ok(Math.abs(py[i].score - js[i].score) < 1e-10);
  }
});
