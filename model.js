import { makePlan, sanitizePlan, validateProfile, eligible } from "./engine.js";
export const STORAGE_KEY = "pantryplan-kitchen";
export function mondayKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dateAt(key, day = 0) {
  const d = new Date(key + "T12:00:00");
  d.setDate(d.getDate() + day);
  return d;
}
export function shiftWeek(key, amount) {
  return mondayKey(dateAt(key, amount * 7));
}
export function freshState(catalog, date = new Date()) {
  const week = mondayKey(date);
  const profile = validateProfile({
    diet: "any",
    maxMinutes: 60,
    preferred: ["tomato", "chickpeas", "rice"],
  });
  return {
    schema: 1,
    title: "Weekly meal plan",
    week,
    profile,
    servings: 1,
    mode: "tfidf",
    layout: "board",
    day: "all",
    plans: { [week]: makePlan(catalog, profile).plan },
    pantry: {},
    extras: {},
    checked: {},
  };
}
export function sanitizeState(catalog, raw, date = new Date()) {
  const base = freshState(catalog, date);
  if (!raw || raw.schema !== 1) return base;
  try {
    const profile = validateProfile(raw.profile);
    const validWeek = (k) =>
      /^\d{4}-\d{2}-\d{2}$/.test(k) &&
      !Number.isNaN(dateAt(k).getTime()) &&
      mondayKey(dateAt(k)) === k;
    const plans = Object.fromEntries(
      Object.entries(raw.plans || {})
        .filter(([k]) => validWeek(k))
        .map(([k, p]) => [k, sanitizePlan(catalog, p, profile)]),
    );
    const extras = Object.fromEntries(
      Object.entries(raw.extras || {})
        .filter(([k, a]) => validWeek(k) && Array.isArray(a))
        .map(([k, a]) => [
          k,
          a
            .filter((x) => {
              const p = catalog.products.find((p) => p.id === x?.productId);
              return (
                p &&
                eligible(p, profile) &&
                Number.isFinite(x.quantity) &&
                x.quantity > 0 &&
                (p.unit !== "each" || Number.isInteger(x.quantity))
              );
            })
            .map((x) => ({ productId: x.productId, quantity: x.quantity })),
        ]),
    );
    const pantry = Object.fromEntries(
      catalog.products
        .filter(
          (p) =>
            Number.isFinite(raw.pantry?.[p.id]) &&
            raw.pantry[p.id] >= 0 &&
            (p.unit !== "each" || Number.isInteger(raw.pantry[p.id])),
        )
        .map((p) => [p.id, raw.pantry[p.id]]),
    );
    const checked = Object.fromEntries(
      Object.entries(raw.checked || {})
        .filter(([k, a]) => validWeek(k) && Array.isArray(a))
        .map(([k, a]) => [
          k,
          a.filter((id) => catalog.products.some((p) => p.id === id)),
        ]),
    );
    return {
      ...base,
      title:
        typeof raw.title === "string" && raw.title.trim()
          ? raw.title.trim().slice(0, 55)
          : base.title,
      week: validWeek(raw.week) ? raw.week : base.week,
      profile,
      plans,
      extras,
      pantry,
      checked,
      servings:
        Number.isInteger(raw.servings) &&
        raw.servings >= 1 &&
        raw.servings <= 12
          ? raw.servings
          : 1,
      mode: ["tfidf", "baseline"].includes(raw.mode) ? raw.mode : "tfidf",
      layout: raw.layout === "list" ? "list" : "board",
      day:
        raw.day === "all" ||
        (Number.isInteger(raw.day) && raw.day >= 0 && raw.day < 7)
          ? raw.day
          : "all",
    };
  } catch {
    return base;
  }
}
export function reconcileProfile(catalog, state, profile) {
  state.profile = validateProfile(profile);
  let removed = 0;
  for (const key of Object.keys(state.plans)) {
    const next = sanitizePlan(catalog, state.plans[key], state.profile);
    removed += state.plans[key].length - next.length;
    state.plans[key] = next;
  }
  for (const key of Object.keys(state.extras)) {
    state.extras[key] = state.extras[key].filter((x) =>
      eligible(
        catalog.products.find((p) => p.id === x.productId),
        state.profile,
      ),
    );
  }
  state.checked = {};
  return removed;
}
export function moveMeal(plan, source, target) {
  if (
    !source ||
    !target ||
    source.meal !== target.meal ||
    !Number.isInteger(target.day) ||
    target.day < 0 ||
    target.day > 6
  )
    throw new Error(
      "Move a meal within its breakfast, lunch, or dinner column.",
    );
  const origin = plan.find(
    (s) => s.day === source.day && s.meal === source.meal,
  );
  if (!origin) throw new Error("The original meal is no longer in this plan.");
  if (source.day === target.day) return plan.map((s) => ({ ...s }));
  const other = plan.find(
    (s) => s.day === target.day && s.meal === target.meal,
  );
  return [
    ...plan.filter(
      (s) =>
        !(s.day === source.day && s.meal === source.meal) &&
        !(s.day === target.day && s.meal === target.meal),
    ),
    { ...origin, day: target.day },
    ...(other ? [{ ...other, day: source.day }] : []),
  ];
}
