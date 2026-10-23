import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORAGE_KEY,
  mondayKey,
  shiftWeek,
  freshState,
  sanitizeState,
  reconcileProfile,
  moveMeal,
} from "../model.js";
const catalog = JSON.parse(
  fs.readFileSync(new URL("../catalog.json", import.meta.url)),
);

test("application begins with a complete editable week", () => {
  assert.equal(STORAGE_KEY, "pantryplan-kitchen");
  const s = freshState(catalog, new Date("2026-10-22T12:00:00"));
  assert.equal(s.week, "2026-10-19");
  assert.equal(s.plans[s.week].length, 21);
});

test("week navigation handles month and year boundaries", () => {
  assert.equal(mondayKey(new Date("2026-10-25T12:00:00")), "2026-10-19");
  assert.equal(shiftWeek("2026-12-28", 1), "2027-01-04");
  assert.equal(shiftWeek("2026-10-19", -1), "2026-10-12");
});

test("moving occupied meals swaps day assignments without changing servings or ingredients", () => {
  const plan = [
    { day: 0, meal: "lunch", recipeId: "chickpea-salad", servings: 2 },
    { day: 1, meal: "lunch", recipeId: "chicken-rice", servings: 3 },
  ];
  const result = moveMeal(
    plan,
    { day: 0, meal: "lunch" },
    { day: 1, meal: "lunch" },
  );
  assert.equal(result.find((s) => s.day === 1).recipeId, "chickpea-salad");
  assert.equal(result.find((s) => s.day === 1).servings, 2);
  assert.equal(result.find((s) => s.day === 0).recipeId, "chicken-rice");
  assert.equal(plan[0].day, 0);
});
test("moving to an empty day and rejecting incompatible meal columns", () => {
  const plan = [
    { day: 0, meal: "lunch", recipeId: "chickpea-salad", servings: 2 },
  ];
  assert.equal(
    moveMeal(plan, { day: 0, meal: "lunch" }, { day: 4, meal: "lunch" })[0].day,
    4,
  );
  assert.throws(() =>
    moveMeal(plan, { day: 0, meal: "lunch" }, { day: 1, meal: "dinner" }),
  );
  assert.throws(() =>
    moveMeal(plan, { day: 0, meal: "lunch" }, { day: 9, meal: "lunch" }),
  );
});
test("updated dietary constraints reconcile every saved week for all saved weeks", () => {
  const s = freshState(catalog);
  const first = s.week;
  const second = shiftWeek(first, 1);
  s.plans[second] = structuredClone(s.plans[first]);
  const removed = reconcileProfile(catalog, s, { ...s.profile, diet: "vegan" });
  assert.ok(removed > 0);
  for (const plan of Object.values(s.plans))
    assert.ok(
      plan.every(
        (slot) => catalog.recipes.find((r) => r.id === slot.recipeId).vegan,
      ),
    );
});
test("stored data drops malformed weeks, slots, quantities, and products", () => {
  const s = freshState(catalog, new Date("2026-10-22T12:00:00"));
  s.plans.bad = [{ day: 0 }];
  s.plans[s.week].push({
    day: 90,
    meal: "lunch",
    recipeId: "chickpea-salad",
    servings: 1,
  });
  s.pantry = { tomato: -3, banana: 1.5, rice: 200 };
  s.extras[s.week] = [
    { productId: "banana", quantity: 1.5 },
    { productId: "tomato", quantity: 100 },
    { productId: "unknown", quantity: 1 },
  ];
  const restored = sanitizeState(catalog, s);
  assert.ok(!("bad" in restored.plans));
  assert.equal(restored.plans[s.week].length, 21);
  assert.deepEqual(restored.pantry, { rice: 200 });
  assert.deepEqual(restored.extras[s.week], [
    { productId: "tomato", quantity: 100 },
  ]);
});
test("invalid stored profiles recover with a valid independent default", () => {
  const s = sanitizeState(
    catalog,
    { schema: 1, profile: { diet: "unknown" } },
    new Date("2026-10-22T12:00:00"),
  );
  assert.equal(s.profile.diet, "any");
  assert.equal(s.week, "2026-10-19");
});
