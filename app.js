import {
  recommend,
  makePlan,
  groceryList,
  eligible,
  days,
  meals,
} from "./engine.js";
import {
  STORAGE_KEY,
  mondayKey,
  dateAt,
  shiftWeek,
  freshState,
  sanitizeState,
  reconcileProfile,
  moveMeal,
} from "./model.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const paths = {
  home: "M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  book: "M12 6v15M3 4c3-1 6 0 9 2 3-2 6-3 9-2v15c-3-1-6 0-9 2-3-2-6-3-9-2z",
  calendar: "M4 5h16v16H4zM4 10h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2",
  bag: "M5 8h14l1 13H4zM8 8V6a4 4 0 0 1 8 0v2",
  shelf:
    "M4 4v17m16-17v17M4 10h16M4 18h16M7 5h3v5H7zm6-2h4v7h-4zM7 13h4v5H7zm7 0h3v5h-3z",
  search: "M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  plus: "M12 5v14M5 12h14",
  chevron: "M9 5l7 7-7 7",
  down: "M6 9l6 6 6-6",
  left: "M15 5l-7 7 7 7",
  collapse: "M11 6l-6 6 6 6m7-12l-6 6 6 6",
  bulb: "M8 17c0-3-3-4-3-8a7 7 0 0 1 14 0c0 4-3 5-3 8M8 17h8m-7 3h6m-5 2h4",
  layers: "M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4",
  help: "M9 9a3 3 0 1 1 4 3c-1 1-1 1-1 3M12 18h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  edit: "M14 5l5 5M4 20l1-6L16 3l5 5L10 19z",
  link: "M10 14l4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2",
  filter: "M3 4h18l-7 8v7l-4 2v-9z",
  download: "M12 3v12m-5-5l5 5 5-5M4 16v5h16v-5",
  board: "M3 4h18v6H3zM3 14h18v6H3z",
  grid: "M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h6v6h-6z",
  clock: "M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m14-18a4 4 0 0 1 0 8m6 10v-2a4 4 0 0 0-3-3M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  heart: "M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-4 3-1 8 8 15 9-7 12-12 8-15z",
  refresh:
    "M20 7V2m0 5h-5M4 17v5m0-5h5M4 8a8 8 0 0 1 14-3l2 2M4 17l2 2a8 8 0 0 0 14-3",
  close: "M6 6l12 12M6 18L18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  check: "M5 12l4 4L20 5",
  spark: "M12 3l2 6 6 3-6 2-2 7-3-7-6-2 6-3z",
  file: "M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h5",
};
const icon = (n, cls = "") =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}"><path d="${paths[n] || paths.plus}"/></svg>`;
const mealColors = {
  breakfast: ["#F58F1F", "#fff0dd"],
  lunch: ["#457534", "#e8f0e3"],
  dinner: ["#7D8285", "#edf0ef"],
};
let catalog,
  state,
  view = "recipes",
  savedOnly = false,
  toastTimer,
  drag = null;
const currentPlan = () => state.plans[state.week] || [];
const extras = () => state.extras[state.week] || [];
const checked = () => state.checked[state.week] || [];
const list = () => groceryList(catalog, currentPlan(), state.pantry, extras());
function toast(msg, error = false) {
  clearTimeout(toastTimer);
  $("#toast").textContent = msg;
  $("#toast").hidden = false;
  $("#toast").classList.toggle("error", error);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 5500);
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $("#footer-status").textContent = "Changes are saved on this device.";
  } catch {
    $("#footer-status").textContent =
      "Browser storage is unavailable. This session is temporary.";
  }
}
function clearChecks() {
  state.checked[state.week] = [];
}
function setPlan(plan) {
  state.plans[state.week] = plan;
  clearChecks();
  save();
  render();
}
function button(id, n, text = "") {
  const e = $("#" + id);
  if (e) e.innerHTML = icon(n) + (text ? `<span>${text}</span>` : "");
}
function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((e) => {
    e.innerHTML =
      icon(e.dataset.icon) +
      `<span class="nav-label">${e.childNodes[0]?.textContent || e.textContent}</span>` +
      (e.dataset.view === "groceries"
        ? '<span id="nav-grocery-count" class="nav-count"></span>'
        : "");
  });
  for (const [id, n, t] of [
    ["collapse-sidebar", "collapse"],
    ["new-meal-side", "plus"],
    ["note-icon", "bulb"],
    ["search-icon", "search"],
    ["today-button", "calendar"],
    ["help-button", "help"],
    ["mobile-menu", "menu"],
    ["rename-plan", "edit"],
    ["copy-link", "link"],
    ["add-meal-main", "plus", "Add meal"],
    ["filter-button", "filter", "Filter"],
    ["previous-week", "left"],
    ["next-week", "chevron"],
    ["export-button", "download", "Export plan"],
    ["board-layout", "board"],
    ["list-layout", "grid"],
    ["generate-week", "spark", "Generate week"],
    ["close-dialog", "close"],
  ])
    button(id, n, t);
}
function weekLabel() {
  const a = dateAt(state.week),
    b = dateAt(state.week, 6);
  return `${a.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${b.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}
function renderHeader() {
  const names = {
    overview: [
      "Overview",
      "Your kitchen at a glance. Pick up where you left off.",
    ],
    recipes: [
      savedOnly ? "Saved recipes" : "Recipe collection",
      savedOnly
        ? "The recipes you want to come back to."
        : "Choose a recipe, plan your meals, and shop for what you need.",
    ],
    planner: [
      state.title,
      "A place for your meals, from the first idea to the last ingredient.",
    ],
    groceries: [
      "Grocery list",
      "Everything for this week’s meals, minus what’s already in your pantry.",
    ],
    pantry: [
      "My pantry",
      "Keep track of what you have before adding more to your list.",
    ],
  };
  $("#page-title").textContent = names[view][0];
  $("#page-description").textContent = names[view][1];
  $("#breadcrumb-current").textContent = {
    overview: "Overview",
    recipes: "Recipes",
    planner: "Meal planner",
    groceries: "Grocery list",
    pantry: "My pantry",
  }[view];
  document.title = `PantryPlan · ${names[view][0]}`;
  $("#rename-plan").hidden = view !== "planner";
  $("#day-tabs").hidden = !["planner", "overview"].includes(view);
  $("#generate-week").hidden = view !== "planner";
  $(".week-control").hidden = ["recipes", "pantry"].includes(view);
  $(".view-toggle").hidden = view !== "planner";
  $(".toolbar-divider").hidden = view !== "planner";
  $("#export-button").hidden = ["recipes", "pantry"].includes(view);
  $("#copy-link").hidden = false;
  button(
    "export-button",
    "download",
    view === "groceries" ? "Export list" : "Export plan",
  );
  button(
    "add-meal-main",
    "plus",
    view === "groceries" || view === "pantry" ? "Add product" : "Add meal",
  );
  const active =
    Number(state.profile.diet !== "any") +
    state.profile.excluded.length +
    state.profile.avoidAllergens.length +
    Number(state.profile.maxMinutes < 60);
  $("#active-filter").hidden = !active;
  $("#active-filter").textContent =
    `${active} active filter${active === 1 ? "" : "s"}`;
  document
    .querySelectorAll(".main-nav [data-view]")
    .forEach((b) =>
      b.classList.toggle(
        "active",
        b.dataset.view === view && !(savedOnly && view === "recipes"),
      ),
    );
  $("#saved-recipes").classList.toggle(
    "active",
    view === "recipes" && savedOnly,
  );
  $("#saved-count").textContent = state.profile.liked.length;
  $("#nav-grocery-count").textContent = list().length;
  $("#week-label").innerHTML = icon("calendar") + esc(weekLabel());
  $("#board-layout").classList.toggle("active", state.layout === "board");
  $("#list-layout").classList.toggle("active", state.layout === "list");
  $("#board-layout").setAttribute(
    "aria-pressed",
    String(state.layout === "board"),
  );
  $("#list-layout").setAttribute(
    "aria-pressed",
    String(state.layout === "list"),
  );
  const today = new Date();
  $("#day-tabs").innerHTML =
    `<button data-day="all" class="${state.day === "all" ? "active" : ""}" aria-pressed="${state.day === "all"}">All week</button>` +
    days
      .map((d, i) => {
        const date = dateAt(state.week, i),
          isToday = date.toDateString() === today.toDateString();
        return `<button data-day="${i}" class="${state.day === i ? "active" : ""}" aria-pressed="${state.day === i}">${d.slice(0, 3)}<span class="day-number">${date.getDate()}</span>${isToday ? '<span class="today-mark"></span>' : ""}</button>`;
      })
      .join("");
  const summary = {
    overview: `${currentPlan().length} meals planned · ${weekLabel()}`,
    planner: `${currentPlan().filter((s) => state.day === "all" || s.day === state.day).length} planned meals · ${state.day === "all" ? "Drag a meal to swap days" : "Select any meal to change it"}`,
    recipes: `${recipeResults().length} recipes · ${state.mode === "tfidf" ? "Matched to your preferences" : "Quickest first"}`,
    groceries: `${list().length} products to buy · ${currentPlan().length} planned meals`,
    pantry: `${catalog.products.filter((p) => (state.pantry[p.id] || 0) > 0).length} products in your pantry`,
  };
  $("#view-summary").textContent = summary[view];
}
function foodArt(r) {
  const green = ["#dbe7bf", "#6f9258", "#9dbb6c"],
    brown = ["#f4e7d6", "#cda166", "#eed9b6"],
    red = ["#eadccf", "#b96248", "#e09c6b"];
  const colors =
    r.style === "Fresh" ? green : r.meal === "breakfast" ? brown : red;
  const seed = r.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return `<div class="ingredient-preview" style="--food-bg:${colors[0]}"><svg viewBox="0 0 180 140" role="img" aria-label="Illustration of ${esc(r.name)}"><ellipse cx="92" cy="78" rx="59" ry="48" fill="#846b4a0c"/><ellipse cx="90" cy="68" rx="61" ry="51" fill="#fffef8"/><ellipse cx="90" cy="68" rx="50" ry="40" fill="#f1e9db"/>${Array.from(
    { length: 28 },
    (_, i) => {
      const a = i * 2.39996 + seed,
        rad = Math.sqrt(i) * 7,
        x = 90 + Math.cos(a) * rad,
        y = 68 + Math.sin(a) * rad * 0.72;
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.meal === "breakfast" ? 4 + (i % 3) : 6 + (i % 4)}" ry="${3 + (i % 4)}" fill="${i % 5 === 0 ? "#eee1b3" : i % 3 === 0 ? "#729459" : colors[1 + (i % 2)]}" transform="rotate(${i * 29} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    },
  ).join(
    "",
  )}<path d="M71 45q17 3 32 32M83 43q12 12 14 28" fill="none" stroke="#65824b" stroke-width="1.5"/><path d="M153 31v70m-5-70v21m10-21v21" stroke="#b5aaa0" stroke-width="3" fill="none"/><path d="M29 31v70m0-70q-15 10 0 27" stroke="#b5aaa0" stroke-width="3" fill="none"/></svg></div>`;
}
function card(r, slot = null, { image = false } = {}) {
  const liked = state.profile.liked.includes(r.id),
    tags = r.vegan
      ? '<span class="tag vegan">Plant-based</span>'
      : r.vegetarian
        ? '<span class="tag vegetarian">Vegetarian</span>'
        : '<span class="tag">Mixed diet</span>';
  const ps = r.ingredients
    .slice(0, 3)
    .map((i) => catalog.products.find((p) => p.id === i.productId));
  return `<article class="meal-card" ${slot ? `draggable="true" data-drag-slot="${slot.day}:${slot.meal}" data-drop-slot="${slot.day}:${slot.meal}"` : ""}><div class="card-top"><div class="card-tags">${tags}${r.minutes <= 15 ? '<span class="tag">Quick</span>' : ""}</div>${slot ? `<button class="card-menu" data-edit-slot="${slot.day}:${slot.meal}" aria-label="Edit ${days[slot.day]} ${slot.meal}">···</button>` : `<button class="icon-button ${liked ? "saved" : ""}" data-like="${r.id}" aria-label="${liked ? "Unsave" : "Save"} ${esc(r.name)}" aria-pressed="${liked}">${icon("heart")}</button>`}</div>${slot ? `<p class="card-day">${days[slot.day]} · ${dateAt(state.week, slot.day).getDate()} ${dateAt(state.week, slot.day).toLocaleDateString("en-GB", { month: "short" })}</p>` : ""}<h3 class="card-title"><button data-detail="${r.id}" ${slot ? `data-source-slot="${slot.day}:${slot.meal}"` : ""}>${esc(r.name)}</button></h3><p class="card-description">${esc(r.reasons?.[0] || recipeReason(r))}</p>${image ? foodArt(r) : ""}<div class="card-bottom"><div class="mini-products" aria-label="Key ingredients">${ps.map((p, i) => `<span class="mini-product" title="${esc(p.name)}" style="background:${["#fff0dd", "#e8f0e3", "#edf0ef"][i]};color:${["#ab6415", "#457534", "#7d8285"][i]}">${p.name.charAt(0)}</span>`).join("")}</div><span class="card-meta">${icon("clock")}${r.minutes} min</span><span class="card-meta">${icon(slot ? "users" : "shelf")}${slot ? `${slot.servings} serving${slot.servings === 1 ? "" : "s"}` : `${r.ingredients.length} ingredients`}</span></div>${!slot ? `<div class="card-action-row"><button class="outline" data-schedule="${r.id}">${icon("plus")}Add to plan</button><button class="icon-button" data-hide="${r.id}" aria-label="Hide ${esc(r.name)}">${icon("close")}</button></div>` : ""}</article>`;
}
function recipeReason(r) {
  const matched = r.ingredients
    .filter((i) => state.profile.preferred.includes(i.productId))
    .map((i) =>
      catalog.products.find((p) => p.id === i.productId).name.toLowerCase(),
    );
  return matched.length
    ? `Made with ${matched.slice(0, 2).join(" and ")}. A match for your ingredient preferences.`
    : `${r.ingredients.length} ingredients, a few simple steps, and ${r.minutes} minutes in the kitchen.`;
}
function emptySlot(day, meal) {
  return `<div class="empty-slot" data-drop-slot="${day}:${meal}">${days[day]}<br>No meal planned yet<button data-add-slot="${day}:${meal}">${icon("plus")}Choose a recipe</button></div>`;
}
function renderPlanner() {
  const plan = currentPlan(),
    visibleDays = state.day === "all" ? [0, 1, 2, 3, 4, 5, 6] : [state.day];
  if (state.layout === "list")
    return `<div class="list-plan">${visibleDays
      .map(
        (day) =>
          `<section class="day-group"><h2>${days[day]}, ${dateAt(state.week, day).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</h2>${meals
            .map((meal) => {
              const s = plan.find((s) => s.day === day && s.meal === meal),
                r = catalog.recipes.find((r) => r.id === s?.recipeId);
              return `<div class="list-row"><span class="meal-name">${meal}</span><strong>${r ? esc(r.name) : "No meal planned"}</strong><small>${r ? `${r.minutes} min · ${s.servings} serving(s)` : ""}</small><button class="icon-button" ${s ? `data-edit-slot="${day}:${meal}"` : `data-add-slot="${day}:${meal}"`} aria-label="${s ? "Edit" : "Add"} ${days[day]} ${meal}">${icon(s ? "edit" : "plus")}</button></div>`;
            })
            .join("")}</section>`,
      )
      .join("")}</div>`;
  return `<div class="board">${meals
    .map((meal) => {
      const color = mealColors[meal],
        count = plan.filter(
          (s) =>
            s.meal === meal && (state.day === "all" || s.day === state.day),
        ).length;
      return `<section class="board-column" style="--accent:${color[0]};--soft:${color[1]}"><div class="column-heading"><span class="small-dot"></span><h2>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h2><span class="column-count">${count}</span><button data-add-meal="${meal}" aria-label="Add ${meal}">${icon("plus")}</button></div><div class="meal-stack">${visibleDays
        .map((day, i) => {
          const slot = plan.find((s) => s.day === day && s.meal === meal),
            r = catalog.recipes.find((r) => r.id === slot?.recipeId);
          return r
            ? card(r, slot, { image: i === 0 || i === 3 })
            : emptySlot(day, meal);
        })
        .join("")}</div></section>`;
    })
    .join("")}</div>`;
}
function recipeResults() {
  const q = $("#search").value.toLowerCase().trim();
  return recommend(catalog, state.profile, { mode: state.mode }).filter(
    (r) =>
      (!savedOnly || state.profile.liked.includes(r.id)) &&
      [
        r.name,
        r.meal,
        ...r.ingredients.map(
          (i) => catalog.products.find((p) => p.id === i.productId).name,
        ),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
}
function renderRecipes() {
  const results = recipeResults();
  return results.length
    ? `<div class="recipe-grid">${results.map((r) => card(r, null, { image: true })).join("")}</div>`
    : emptyPage(
        savedOnly ? "No saved recipes yet" : "No recipes match these choices",
        savedOnly
          ? "Save a recipe using its heart button to find it here."
          : "Try changing the search, cooking time, or ingredient filters.",
        savedOnly ? "Browse recipes" : "Adjust preferences",
        savedOnly ? "data-browse" : "data-filter",
      );
}
function emptyPage(title, body, action, attr) {
  return `<div class="empty-page"><h2>${title}</h2><p>${body}</p>${action ? `<button class="primary" ${attr}>${action}</button>` : ""}</div>`;
}
function renderGroceries() {
  const items = list();
  const total = items.reduce(
    (s, p) => s + (checked().includes(p.id) ? 1 : 0),
    0,
  );
  return `<div class="grocery-summary"><div class="stat"><small>TO BUY</small><strong>${items.length}<span>products</span></strong></div><div class="stat"><small>CHECKED OFF</small><strong>${total}<span>of ${items.length} products</span></strong></div><div class="stat"><small>MEALS THIS WEEK</small><strong>${currentPlan().length}<span>planned meals</span></strong></div></div>${items.length ? `<div class="table-shell"><table><thead><tr><th scope="col"><span aria-label="Purchased">✓</span></th><th scope="col">Product</th><th scope="col">Total needed</th><th scope="col">In pantry</th><th scope="col">To buy</th></tr></thead><tbody>${items.map((p) => `<tr class="${checked().includes(p.id) ? "completed" : ""}"><td><input type="checkbox" data-check="${p.id}" ${checked().includes(p.id) ? "checked" : ""} aria-label="Mark ${esc(p.name)} purchased"></td><td><div class="product-name"><span class="product-initial">${p.name.charAt(0)}</span><div><strong>${esc(p.name)}</strong><small>${p.category}</small></div></div></td><td>${p.required} ${p.unit}</td><td>${p.inPantry} ${p.unit}</td><td><span class="quantity-pill">${p.quantity} ${p.unit}</span></td></tr>`).join("")}</tbody></table></div>${extras().length ? '<p><button class="text-action" data-clear-extras>Remove direct product additions</button></p>' : ""}` : emptyPage("Your grocery list is clear", "Add meals to this week’s plan, or add a product directly.", "Browse recipes", "data-browse")}`;
}
function renderPantry() {
  const q = $("#search").value.trim().toLowerCase(),
    ps = catalog.products.filter((p) => p.name.toLowerCase().includes(q));
  return ps.length
    ? `<div class="table-shell"><table><thead><tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col">Amount in pantry</th><th scope="col">Add to groceries</th></tr></thead><tbody>${ps.map((p) => `<tr><td><div class="product-name"><span class="product-initial">${p.name.charAt(0)}</span><strong>${esc(p.name)}</strong></div></td><td>${p.category}</td><td><label class="quantity-control"><input type="number" data-pantry="${p.id}" value="${state.pantry[p.id] || 0}" min="0" step="${p.unit === "each" ? 1 : 0.1}" aria-label="${esc(p.name)} in pantry"><small>${p.unit}</small></label></td><td><div class="quantity-control"><input type="number" id="extra-${p.id}" value="${p.unit === "each" ? 1 : 100}" min="${p.unit === "each" ? 1 : 0.1}" step="${p.unit === "each" ? 1 : 0.1}" aria-label="${esc(p.name)} quantity to add"><small>${p.unit}</small><button data-extra="${p.id}" aria-label="Add ${esc(p.name)} to groceries" ${eligible(p, state.profile) ? "" : "disabled"}>${icon("plus")}</button></div></td></tr>`).join("")}</tbody></table></div>`
    : emptyPage("No products found", "Try another ingredient name.");
}
function renderOverview() {
  const day = state.day === "all" ? (new Date().getDay() + 6) % 7 : state.day,
    slots = currentPlan().filter((s) => s.day === day);
  return `<div class="overview-stats"><div class="stat"><small>THIS WEEK</small><strong>${currentPlan().length}<span>meals planned</span></strong></div><div class="stat"><small>GROCERY LIST</small><strong>${list().length}<span>products to buy</span></strong></div><div class="stat"><small>YOUR PANTRY</small><strong>${catalog.products.filter((p) => (state.pantry[p.id] || 0) > 0).length}<span>ingredients available</span></strong></div></div><h2 class="section-title">On the table for ${days[day]}</h2>${
    slots.length
      ? `<div class="recipe-grid">${slots
          .map((s) =>
            card(
              catalog.recipes.find((r) => r.id === s.recipeId),
              s,
              { image: true },
            ),
          )
          .join("")}</div>`
      : emptyPage(
          "A little room to plan",
          "Choose meals for this day to get started.",
          "Explore recipes",
          "data-browse",
        )
  }`;
}
function render() {
  renderHeader();
  $("#content").innerHTML = {
    planner: renderPlanner,
    recipes: renderRecipes,
    groceries: renderGroceries,
    pantry: renderPantry,
    overview: renderOverview,
  }[view]();
}
function navigate(next) {
  view = ["overview", "recipes", "planner", "groceries", "pantry"].includes(
    next,
  )
    ? next
    : "planner";
  document.querySelector(".app").classList.remove("menu-open");
  if (location.hash !== `#${view}`) history.replaceState(null, "", `#${view}`);
  render();
}
function openDialog(label, html) {
  $("#dialog-label").textContent = label;
  $("#dialog-body").innerHTML = html;
  $("#dialog").showModal();
}
function closeDialog() {
  $("#dialog").close();
}
function profileDialog() {
  openDialog(
    "Your preferences",
    `<h2>Food that fits you</h2><p>Set what you like and what you want to leave out.</p><form id="profile-form"><div class="form-grid"><label>Diet<select name="diet">${["any", "vegetarian", "vegan"].map((d) => `<option value="${d}" ${state.profile.diet === d ? "selected" : ""}>${d === "any" ? "Any diet" : d.charAt(0).toUpperCase() + d.slice(1)}</option>`).join("")}</select></label><label>Maximum cooking time<select name="maxMinutes">${[10, 15, 20, 30, 45, 60].map((t) => `<option value="${t}" ${t === state.profile.maxMinutes ? "selected" : ""}>${t} minutes</option>`).join("")}</select></label></div><div class="form-grid"><label>Preferred ingredients<select name="preferred" multiple size="5">${catalog.products.map((p) => `<option value="${p.id}" ${state.profile.preferred.includes(p.id) ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label><label>Excluded ingredients<select name="excluded" multiple size="5">${catalog.products.map((p) => `<option value="${p.id}" ${state.profile.excluded.includes(p.id) ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label></div><p class="fine">Hold Command on Mac or Ctrl on Windows to select multiple ingredients.</p><h3>Exclude declared allergens</h3><div class="checks">${["milk", "egg", "gluten", "soy", "fish", "peanut"].map((a) => `<label><input name="avoidAllergens" type="checkbox" value="${a}" ${state.profile.avoidAllergens.includes(a) ? "checked" : ""}>${a.charAt(0).toUpperCase() + a.slice(1)}</label>`).join("")}</div><p class="fine">Filters use the demo catalog’s ingredient labels. Check real product packaging; cross-contact is not assessed.</p><div class="form-grid"><label>Default servings<input name="servings" type="number" value="${state.servings}" min="1" max="12" step="1"></label><label>Recipe order<select name="mode"><option value="tfidf" ${state.mode === "tfidf" ? "selected" : ""}>Preference matching</option><option value="baseline" ${state.mode === "baseline" ? "selected" : ""}>Quickest first · baseline</option></select></label></div><p class="fine">Applying new exclusions removes incompatible meals from saved weeks. Existing compatible meals keep their serving counts.</p><div class="dialog-actions"><button class="outline" type="button" data-close>Cancel</button><button class="primary" type="submit">Save preferences</button></div></form>`,
  );
}
function mealDialog({
  day = state.day === "all" ? 0 : state.day,
  meal = "lunch",
  recipeId = null,
  editing = false,
} = {}) {
  const slot = editing
    ? currentPlan().find((s) => s.day === day && s.meal === meal)
    : null;
  const ranked = recommend(catalog, state.profile, { mode: state.mode, meal });
  openDialog(
    `${editing ? "Edit" : "Add"} a meal`,
    `<h2>${editing ? "Make a little change" : "What’s on the menu?"}</h2><p>${weekLabel()} · Your grocery list updates with your plan.</p><form id="meal-form" data-original-day="${editing ? day : ""}" data-original-meal="${editing ? meal : ""}"><div class="form-grid"><label>Day<select name="day">${days.map((d, i) => `<option value="${i}" ${i === day ? "selected" : ""}>${d}</option>`).join("")}</select></label><label>Meal<select name="meal" id="meal-type">${meals.map((m) => `<option value="${m}" ${m === meal ? "selected" : ""}>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join("")}</select></label></div><label>Recipe<select name="recipeId" id="meal-recipe">${ranked.map((r) => `<option value="${r.id}" ${r.id === (recipeId || slot?.recipeId) ? "selected" : ""}>${esc(r.name)} · ${r.minutes} min</option>`).join("")}</select></label><p class="fine" id="meal-empty" ${ranked.length ? "hidden" : ""}>No recipes fit this meal with your current preferences.</p><label>Servings<input name="servings" type="number" min="1" max="12" step="1" value="${slot?.servings || state.servings}"></label><p class="fine">One recipe per day and meal. Saving to a filled slot replaces its meal.</p><div class="dialog-actions">${slot ? `<button type="button" class="outline danger" data-remove-slot="${day}:${meal}">Remove meal</button>` : ""}<button type="button" class="outline" data-close>Cancel</button><button type="submit" id="save-meal" class="primary" ${ranked.length ? "" : "disabled"}>Save meal</button></div></form>`,
  );
}
function recipeDetail(id, slotString) {
  const r = catalog.recipes.find((r) => r.id === id);
  if (!r) return;
  openDialog(
    "Recipe details",
    `<h2>${esc(r.name)}</h2><div class="dialog-recipe-meta"><span>${r.meal}</span><span>${r.minutes} minutes</span><span>Ingredients for 1 serving</span></div>${foodArt(r)}<p>${esc(recipeReason(r))}</p><h3>Ingredients</h3>${r.ingredients
      .map((i) => {
        const p = catalog.products.find((p) => p.id === i.productId);
        return `<div class="detail-ingredient"><span>${esc(p.name)}</span><span>${i.quantity} ${p.unit}</span></div>`;
      })
      .join(
        "",
      )}<h3>Method</h3><ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><p class="fine">Declared allergens: ${r.allergens.join(", ") || "none listed"}. This is an illustrative sample recipe.</p><div class="dialog-actions"><button class="outline" data-like="${r.id}">${icon("heart")}${state.profile.liked.includes(r.id) ? "Unsave" : "Save"} recipe</button><button class="primary" ${slotString ? `data-edit-slot="${slotString}"` : `data-schedule="${r.id}"`}>${icon(slotString ? "edit" : "plus")}${slotString ? "Edit this meal" : "Add to plan"}</button></div>`,
  );
}
function productDialog() {
  const ps = catalog.products.filter((p) => eligible(p, state.profile));
  openDialog(
    "Grocery products",
    `<h2>A little extra for your list</h2><p>Add a product directly to this week’s groceries.</p><form id="product-form"><label>Product<select name="productId" id="product-id">${ps.map((p) => `<option value="${p.id}">${esc(p.name)} · ${p.unit}</option>`).join("")}</select></label><label>Quantity <span id="product-unit">(${ps[0]?.unit || ""})</span><input name="quantity" id="product-quantity" type="number" min="${ps[0]?.unit === "each" ? 1 : 0.1}" step="${ps[0]?.unit === "each" ? 1 : 0.1}" value="${ps[0]?.unit === "each" ? 1 : 100}"></label><div class="dialog-actions"><button type="button" class="outline" data-close>Cancel</button><button type="submit" class="primary" ${ps.length ? "" : "disabled"}>Add to list</button></div></form>`,
  );
}
function download(name, text, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportCurrent() {
  if (view === "groceries") {
    download(
      `pantryplan-groceries-${state.week}.txt`,
      [
        `PantryPlan · Grocery list · ${weekLabel()}`,
        "",
        ...list().map(
          (p) =>
            `${checked().includes(p.id) ? "[x]" : "[ ]"} ${p.name}: ${p.quantity} ${p.unit}`,
        ),
      ].join("\n"),
    );
  } else {
    download(
      `pantryplan-meals-${state.week}.txt`,
      [
        `${state.title} · ${weekLabel()}`,
        "",
        ...days.flatMap((d, day) => [
          d,
          ...meals.map((meal) => {
            const s = currentPlan().find(
                (s) => s.day === day && s.meal === meal,
              ),
              r = catalog.recipes.find((r) => r.id === s?.recipeId);
            return `  ${meal}: ${r ? `${r.name} (${s.servings} serving(s))` : "Not planned"}`;
          }),
          "",
        ]),
      ].join("\n"),
    );
  }
  toast("Your file is ready.");
}
function showHelp() {
  openDialog(
    "A quick guide",
    '<h2>From your plan to your pantry</h2><p><strong>1. Choose your meals.</strong> Browse recipes or generate a suggested week. Filter by cooking time, diet, and ingredients.</p><p><strong>2. Make the week your own.</strong> Open any meal card to change its day, recipe, or servings. In the full-week board, drag meals within the same meal column to swap days.</p><p><strong>3. Check your pantry.</strong> Enter the amount you already have. The grocery list combines your plan’s ingredients and subtracts your pantry quantities.</p><p><strong>4. Take your list.</strong> Check products off as you shop, or export the list as a text file.</p><div class="dialog-actions"><button class="primary" data-close>Got it</button></div>',
  );
}
function bind() {
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("button,a[data-view]");
    if (!b) return;
    try {
      if (b.dataset.view) {
        savedOnly = false;
        navigate(b.dataset.view);
      }
      if (b.hasAttribute("data-day")) {
        state.day = b.dataset.day === "all" ? "all" : Number(b.dataset.day);
        save();
        render();
      }
      if (b.dataset.addMeal) {
        closeDialog();
        mealDialog({ meal: b.dataset.addMeal });
      }
      if (b.dataset.addSlot) {
        const [d, m] = b.dataset.addSlot.split(":");
        closeDialog();
        mealDialog({ day: Number(d), meal: m });
      }
      if (b.dataset.editSlot) {
        const [d, m] = b.dataset.editSlot.split(":");
        closeDialog();
        mealDialog({ day: Number(d), meal: m, editing: true });
      }
      if (b.dataset.schedule) {
        const r = catalog.recipes.find((r) => r.id === b.dataset.schedule);
        closeDialog();
        mealDialog({ meal: r.meal, recipeId: r.id });
      }
      if (b.dataset.detail)
        recipeDetail(b.dataset.detail, b.dataset.sourceSlot);
      if (b.dataset.like) {
        const id = b.dataset.like;
        state.profile.liked = state.profile.liked.includes(id)
          ? state.profile.liked.filter((x) => x !== id)
          : [...state.profile.liked, id];
        save();
        render();
        if (
          $("#dialog").open &&
          $("#dialog-label").textContent === "Recipe details"
        )
          recipeDetail(id);
        toast(
          state.profile.liked.includes(id)
            ? "Recipe saved."
            : "Recipe removed from saved recipes.",
        );
      }
      if (b.dataset.hide) {
        state.profile.disliked = [
          ...new Set([...state.profile.disliked, b.dataset.hide]),
        ];
        reconcileProfile(catalog, state, state.profile);
        save();
        render();
        toast("Recipe hidden. Restore hidden recipes from About PantryPlan.");
      }
      if (b.dataset.removeSlot) {
        const [d, m] = b.dataset.removeSlot.split(":");
        setPlan(
          currentPlan().filter((s) => !(s.day === Number(d) && s.meal === m)),
        );
        closeDialog();
        toast("Meal removed. Your grocery list is updated.");
      }
      if (b.dataset.extra) {
        addExtra(b.dataset.extra, Number($("#extra-" + b.dataset.extra).value));
      }
      if (b.hasAttribute("data-clear-extras")) {
        state.extras[state.week] = [];
        clearChecks();
        save();
        render();
        toast("Direct additions removed. Planned ingredients remain.");
      }
      if (b.hasAttribute("data-browse")) {
        savedOnly = false;
        $("#search").value = "";
        navigate("recipes");
      }
      if (
        b.hasAttribute("data-filter") ||
        ["filter-button", "preferences-side"].includes(b.id)
      )
        profileDialog();
      if (b.hasAttribute("data-close") || b.id === "close-dialog")
        closeDialog();
      if (["add-meal-main", "new-meal-side"].includes(b.id)) {
        if (["groceries", "pantry"].includes(view)) productDialog();
        else mealDialog();
      }
      if (b.id === "saved-recipes") {
        savedOnly = true;
        $("#search").value = "";
        navigate("recipes");
      }
      if (b.id === "previous-week" || b.id === "next-week") {
        state.week = shiftWeek(state.week, b.id === "previous-week" ? -1 : 1);
        save();
        render();
      }
      if (b.id === "week-label") {
        state.week = mondayKey();
        save();
        render();
      }
      if (b.id === "today-button") {
        state.week = mondayKey();
        state.day = (new Date().getDay() + 6) % 7;
        save();
        navigate("planner");
      }
      if (b.id === "board-layout" || b.id === "list-layout") {
        state.layout = b.id === "board-layout" ? "board" : "list";
        save();
        render();
      }
      if (b.id === "generate-week") {
        openDialog(
          "Generate a week",
          `<h2>A fresh plan for the week</h2><p>We’ll suggest meals that fit your preferences, with ${state.servings} serving(s) per meal. This replaces meals for ${weekLabel()}.</p><p>Any meal type with no matching recipe will stay empty. You can change every suggestion afterward.</p><div class="dialog-actions"><button class="outline" data-close>Cancel</button><button class="primary" id="confirm-generate">Generate week</button></div>`,
        );
      }
      if (b.id === "confirm-generate") {
        const result = makePlan(catalog, state.profile, {
          mode: state.mode,
          servings: state.servings,
        });
        setPlan(result.plan);
        closeDialog();
        toast(
          result.missing.length
            ? `${result.plan.length} meals suggested. ${result.missing.length} slots have no matching recipe.`
            : "Your week is ready to make your own.",
        );
      }
      if (b.id === "export-button") exportCurrent();
      if (b.id === "rename-plan")
        openDialog(
          "Your meal plan",
          `<h2>Give your plan a name</h2><form id="rename-form"><label>Plan name<input name="title" value="${esc(state.title)}" maxlength="55" required></label><div class="dialog-actions"><button type="button" class="outline" data-close>Cancel</button><button type="submit" class="primary">Save name</button></div></form>`,
        );
      if (b.id === "copy-link") {
        try {
          await navigator.clipboard.writeText(location.href);
          toast(
            "Link to this view copied. Plans are still saved only on this device.",
          );
        } catch {
          toast(
            "Copy the address from your browser. Plans stay on this device.",
          );
        }
      }
      if (b.id === "mobile-menu")
        document.querySelector(".app").classList.toggle("menu-open");
      if (b.id === "collapse-sidebar")
        document.querySelector(".app").classList.toggle("collapsed");
      if (b.id === "help-button") showHelp();
      if (b.id === "about-button")
        openDialog(
          "About PantryPlan",
          '<h2>PantryPlan · Kitchen edition</h2><p>Plan meals, discover recipes, and prepare a grocery list with the ingredients already in your pantry.</p><p>The demo contains 18 illustrative recipes and 30 generic products. It uses preference-based recipe matching and saves plans on this browser. It does not provide medical nutrition advice or check actual product packaging.</p><p>Your preferences and plans are saved in this browser.</p><div class="dialog-actions"><button class="outline" id="restore-hidden">Restore hidden recipes</button><button class="primary" data-close>Close</button></div>',
        );
      if (b.id === "restore-hidden") {
        state.profile.disliked = [];
        save();
        render();
        closeDialog();
        toast("Hidden recipes are available again.");
      }
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.addEventListener("submit", (e) => {
    if (
      !["profile-form", "meal-form", "product-form", "rename-form"].includes(
        e.target.id,
      )
    )
      return;
    e.preventDefault();
    try {
      const form = e.target,
        data = new FormData(form);
      if (form.id === "profile-form") {
        const servings = Number(data.get("servings"));
        if (!Number.isInteger(servings) || servings < 1 || servings > 12)
          throw new Error("Choose a whole number of servings from 1 to 12.");
        const removed = reconcileProfile(catalog, state, {
          ...state.profile,
          diet: data.get("diet"),
          maxMinutes: Number(data.get("maxMinutes")),
          preferred: data.getAll("preferred"),
          excluded: data.getAll("excluded"),
          avoidAllergens: data.getAll("avoidAllergens"),
        });
        state.servings = servings;
        state.mode = data.get("mode");
        save();
        render();
        closeDialog();
        toast(
          `Preferences saved.${removed ? ` ${removed} incompatible meal(s) removed from saved plans.` : ""}`,
        );
      }
      if (form.id === "meal-form") {
        const day = Number(data.get("day")),
          meal = data.get("meal"),
          id = data.get("recipeId"),
          servings = Number(data.get("servings")),
          r = catalog.recipes.find((r) => r.id === id);
        if (!r || r.meal !== meal || !eligible(r, state.profile))
          throw new Error("Choose an eligible recipe for this meal.");
        if (!Number.isInteger(servings) || servings < 1 || servings > 12)
          throw new Error("Choose a whole number of servings from 1 to 12.");
        const originalDay = form.dataset.originalDay,
          originalMeal = form.dataset.originalMeal;
        setPlan([
          ...currentPlan().filter(
            (s) =>
              !(s.day === day && s.meal === meal) &&
              !(
                originalDay !== "" &&
                s.day === Number(originalDay) &&
                s.meal === originalMeal
              ),
          ),
          { day, meal, recipeId: id, servings },
        ]);
        closeDialog();
        toast("Meal saved. Your grocery list is updated.");
      }
      if (form.id === "product-form") {
        addExtra(data.get("productId"), Number(data.get("quantity")));
        closeDialog();
      }
      if (form.id === "rename-form") {
        const t = String(data.get("title")).trim();
        if (!t) throw new Error("Enter a plan name.");
        state.title = t.slice(0, 55);
        save();
        render();
        closeDialog();
        toast("Plan renamed.");
      }
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.addEventListener("change", (e) => {
    try {
      const t = e.target;
      if (t.id === "meal-type") {
        const ranked = recommend(catalog, state.profile, {
          mode: state.mode,
          meal: t.value,
        });
        $("#meal-recipe").innerHTML = ranked
          .map(
            (r) =>
              `<option value="${r.id}">${esc(r.name)} · ${r.minutes} min</option>`,
          )
          .join("");
        $("#meal-empty").hidden = !!ranked.length;
        $("#save-meal").disabled = !ranked.length;
      }
      if (t.id === "product-id") {
        const p = catalog.products.find((p) => p.id === t.value),
          q = $("#product-quantity");
        $("#product-unit").textContent = `(${p.unit})`;
        q.min = p.unit === "each" ? 1 : 0.1;
        q.step = p.unit === "each" ? 1 : 0.1;
        q.value = p.unit === "each" ? 1 : 100;
      }
      if (t.dataset.pantry) {
        const p = catalog.products.find((p) => p.id === t.dataset.pantry),
          q = Number(t.value);
        validateQuantity(p, q, true);
        state.pantry[p.id] = q;
        state.checked = {};
        save();
        renderHeader();
        toast("Pantry updated. Grocery quantities are recalculated.");
      }
      if (t.dataset.check) {
        const id = t.dataset.check;
        state.checked[state.week] = checked().filter((x) => x !== id);
        if (t.checked) state.checked[state.week].push(id);
        save();
        render();
      }
    } catch (err) {
      if (e.target.dataset.pantry)
        e.target.value = state.pantry[e.target.dataset.pantry] || 0;
      toast(err.message, true);
    }
  });
  $("#search").addEventListener("input", () => {
    savedOnly = false;
    if (view !== "pantry") view = "recipes";
    navigate(view);
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !["INPUT", "SELECT", "TEXTAREA"].includes(
        document.activeElement.tagName,
      ) &&
      !$("#dialog").open
    ) {
      e.preventDefault();
      $("#search").focus();
    }
  });
  
  document.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[data-drag-slot]");
    if (!card) return;
    const [day, meal] = card.dataset.dragSlot.split(":");
    drag = { day: Number(day), meal };
    e.dataTransfer.setData("text/plain", JSON.stringify(drag));
    e.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
  });
  document.addEventListener("dragover", (e) => {
    const target = e.target.closest("[data-drop-slot]");
    if (target && drag && target.dataset.dropSlot.split(":")[1] === drag.meal) {
      e.preventDefault();
      target.classList.add("drop-target");
      e.dataTransfer.dropEffect = "move";
    }
  });
  document.addEventListener("dragleave", (e) => {
    const t = e.target.closest("[data-drop-slot]");
    if (t && !t.contains(e.relatedTarget)) t.classList.remove("drop-target");
  });
  document.addEventListener("drop", (e) => {
    const target = e.target.closest("[data-drop-slot]");
    if (!target || !drag) return;
    e.preventDefault();
    try {
      const [day, meal] = target.dataset.dropSlot.split(":");
      setPlan(moveMeal(currentPlan(), drag, { day: Number(day), meal }));
      toast("Meals moved. Your grocery quantities stay in sync.");
    } catch (err) {
      toast(err.message, true);
    }
    drag = null;
  });
  document.addEventListener("dragend", () => {
    drag = null;
    document
      .querySelectorAll(".dragging,.drop-target")
      .forEach((e) => e.classList.remove("dragging", "drop-target"));
  });
  window.addEventListener("hashchange", () => {
    savedOnly = false;
    navigate(location.hash.slice(1));
  });
}

function validateQuantity(product, q, zero = false) {
  if (
    !product ||
    !Number.isFinite(q) ||
    (zero ? q < 0 : q <= 0) ||
    (product.unit === "each" && !Number.isInteger(q))
  )
    throw new Error(
      `Enter a ${zero ? "nonnegative" : "positive"} quantity${product?.unit === "each" ? "; individual items use whole numbers" : ""}.`,
    );
}

function addExtra(id, q) {
  const p = catalog.products.find((p) => p.id === id);
  validateQuantity(p, q);
  if (!eligible(p, state.profile))
    throw new Error("This product conflicts with your food preferences.");
  state.extras[state.week] = [...extras(), { productId: id, quantity: q }];
  clearChecks();
  save();
  render();
  toast(`${p.name} added to this week’s grocery list.`);
}

async function init() {
  try {
    const response = await fetch("./catalog.json");
    if (!response.ok) throw Error("Catalog could not be loaded.");
    catalog = await response.json();
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {}
    state = raw ? sanitizeState(catalog, raw) : freshState(catalog);
    installIcons();
    bind();
    navigate(location.hash.slice(1) || "recipes");
    save();
    if (!raw)
      toast(
        "A suggested week to start with. Change any meal to make it yours.",
      );
  } catch (err) {
    $("#content").innerHTML = emptyPage(
      "The kitchen could not open",
      esc(err.message) + " Start the local server and reload.",
    );
  }
}
init();
