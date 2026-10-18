export const meals = ["breakfast", "lunch", "dinner"];
export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function validateProfile(p = {}) {
  const maxMinutes = Number(p.maxMinutes ?? 60);
  if (!Number.isFinite(maxMinutes) || maxMinutes < 1 || maxMinutes > 240)
    throw new Error("Preparation time must be between 1 and 240 minutes.");
  if (!["any", "vegetarian", "vegan"].includes(p.diet ?? "any"))
    throw new Error("Choose a supported diet.");
  const arr = (key) =>
    Array.isArray(p[key])
      ? [...new Set(p[key].filter((x) => typeof x === "string"))]
      : [];
  return {
    diet: p.diet ?? "any",
    maxMinutes,
    preferred: arr("preferred"),
    excluded: arr("excluded"),
    avoidAllergens: arr("avoidAllergens"),
    liked: arr("liked"),
    disliked: arr("disliked"),
  };
}
export function eligible(item, profile) {
  const p = validateProfile(profile);
  const ids = item.ingredients
    ? item.ingredients.map((i) => i.productId)
    : [item.id];
  return (
    (p.diet === "any" || item[p.diet] === true) &&
    (item.minutes === undefined || item.minutes <= p.maxMinutes) &&
    !ids.some((id) => p.excluded.includes(id)) &&
    !(item.allergens ?? []).some((a) => p.avoidAllergens.includes(a)) &&
    !p.disliked.includes(item.id)
  );
}
const tokens = (r) => [
  ...r.ingredients.map((i) => i.productId),
  `style:${r.style.toLowerCase()}`,
];
export function fit(recipes) {
  const docs = recipes.map(tokens),
    vocab = [...new Set(docs.flat())].sort();
  const idf = Object.fromEntries(
    vocab.map((t) => [
      t,
      1 +
        Math.log(
          (1 + docs.length) / (1 + docs.filter((d) => d.includes(t)).length),
        ),
    ]),
  );
  function vector(ts) {
    const v = {};
    for (const t of ts) if (t in idf) v[t] = (v[t] ?? 0) + idf[t];
    const norm = Math.sqrt(Object.values(v).reduce((a, b) => a + b * b, 0));
    return Object.fromEntries(
      Object.entries(v).map(([t, w]) => [t, norm ? w / norm : 0]),
    );
  }
  return {
    idf,
    vector,
    vectors: Object.fromEntries(recipes.map((r, i) => [r.id, vector(docs[i])])),
  };
}
export function recommend(catalog, profile, options = {}) {
  const p = validateProfile(profile),
    mode = options.mode ?? "tfidf";
  if (!["tfidf", "baseline"].includes(mode))
    throw new Error("Unknown recommendation mode.");
  const model = fit(catalog.recipes);
  const likedTokens = catalog.recipes
    .filter((r) => p.liked.includes(r.id))
    .flatMap(tokens);
  const query = model.vector([...p.preferred, ...likedTokens]);
  return catalog.recipes
    .filter((r) => eligible(r, p) && (!options.meal || r.meal === options.meal))
    .map((r) => {
      const score = Object.entries(query).reduce(
        (s, [t, w]) => s + w * (model.vectors[r.id][t] ?? 0),
        0,
      );
      const matched = r.ingredients
        .filter((i) => p.preferred.includes(i.productId))
        .map(
          (i) =>
            catalog.products.find((x) => x.id === i.productId)?.name ??
            i.productId,
        );
      const reasons = [];
      if (matched.length) reasons.push(`Matches ${matched.join(", ")}`);
      if (p.liked.length && score > 0)
        reasons.push("Shares ingredients or style with your preferences");
      reasons.push(`${r.minutes} minutes; within your time limit`);
      return { ...r, score, reasons };
    })
    .sort(
      (a, b) =>
        (mode === "tfidf" ? b.score - a.score : 0) ||
        a.minutes - b.minutes ||
        a.id.localeCompare(b.id),
    );
}
export function makePlan(
  catalog,
  profile,
  { mode = "tfidf", servings = 1 } = {},
) {
  if (!Number.isInteger(servings) || servings < 1 || servings > 12)
    throw new Error("Servings must be a whole number from 1 to 12.");
  const usage = {},
    plan = [],
    missing = [];
  for (let day = 0; day < 7; day++)
    for (const meal of meals) {
      const ranked = recommend(catalog, profile, { mode, meal });
      // Diversity is a deterministic planner rule, separate from model scores.
      ranked.sort(
        (a, b) =>
          (usage[a.id] ?? 0) - (usage[b.id] ?? 0) ||
          (mode === "tfidf" ? b.score - a.score : 0) ||
          a.minutes - b.minutes ||
          a.id.localeCompare(b.id),
      );
      const r = ranked[0];
      if (!r) {
        missing.push({ day, meal });
        continue;
      }
      usage[r.id] = (usage[r.id] ?? 0) + 1;
      plan.push({ day, meal, recipeId: r.id, servings });
    }
  return { plan, missing };
}
export function groceryList(catalog, plan, pantry = {}, extra = []) {
  const products = new Map(catalog.products.map((p) => [p.id, p]));
  const recipes = new Map(catalog.recipes.map((r) => [r.id, r]));
  const sums = new Map();
  const add = (id, q) => {
    if (!products.has(id)) throw new Error(`Unknown product: ${id}`);
    if (!Number.isFinite(q) || q < 0)
      throw new Error("Quantity must be finite and nonnegative.");
    sums.set(id, (sums.get(id) ?? 0) + q);
  };
  for (const slot of plan) {
    const r = recipes.get(slot.recipeId);
    if (!r) throw new Error(`Unknown recipe: ${slot.recipeId}`);
    if (
      !Number.isFinite(slot.servings) ||
      slot.servings <= 0 ||
      slot.servings > 12
    )
      throw new Error("Invalid serving count.");
    for (const i of r.ingredients)
      add(i.productId, (i.quantity * slot.servings) / r.servings);
  }
  for (const item of extra) add(item.productId, item.quantity);
  return [...sums]
    .map(([id, required]) => {
      const stock = Number(pantry[id] ?? 0);
      if (!Number.isFinite(stock) || stock < 0)
        throw new Error("Pantry quantities must be finite and nonnegative.");
      return {
        ...products.get(id),
        required,
        inPantry: stock,
        quantity: Math.max(0, Math.round((required - stock) * 100) / 100),
      };
    })
    .filter((p) => p.quantity > 0)
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
    );
}
export function sanitizePlan(catalog, plan, profile) {
  if (!Array.isArray(plan)) return [];
  const seen = new Set();
  return plan
    .filter((s) => {
      const r = catalog.recipes.find((r) => r.id === s?.recipeId),
        key = `${s?.day}:${s?.meal}`;
      if (
        !r ||
        !eligible(r, profile) ||
        !Number.isInteger(s.day) ||
        s.day < 0 ||
        s.day > 6 ||
        !meals.includes(s.meal) ||
        r.meal !== s.meal ||
        !Number.isInteger(s.servings) ||
        s.servings < 1 ||
        s.servings > 12 ||
        seen.has(key)
      )
        return false;
      seen.add(key);
      return true;
    })
    .map((s) => ({
      day: s.day,
      meal: s.meal,
      recipeId: s.recipeId,
      servings: s.servings,
    }));
}
