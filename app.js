
/* ============================================================
   SHAMBAMARKET — MARKETPLACE ENGINE
   Frontend-only science fair demo
   Storage: this browser only; no backend required.
   ============================================================ */

"use strict";

/* -------------------- CONFIGURATION -------------------- */

const STORAGE = {
  listings: "shambamarket_v3_listings",
  favourites: "shambamarket_v3_favourites",
  likes: "shambamarket_v3_likes",
  profile: "shambamarket_v3_profile",
  language: "shambamarket_v3_language"
};

const CATEGORIES = {
  fruits: { label: "Fruits", icon: "🍎" },
  vegetables: { label: "Vegetables", icon: "🥬" },
  nuts: { label: "Nuts", icon: "🥜" },
  "starchy-foods": { label: "Starchy foods", icon: "🥔" },
  grains: { label: "Grains", icon: "🌽" },
  legumes: { label: "Legumes", icon: "🫘" },
  livestock: { label: "Livestock", icon: "🐄" },
  "farm-inputs": { label: "Farm inputs", icon: "🧑🏽‍🌾" }
};

const CATEGORY_KEYWORDS = {
  fruits: ["fruit", "fruits", "avocado", "mango", "banana", "orange",
    "lemon", "watermelon", "pineapple", "pawpaw", "passion fruit",
    "guava", "apple", "coconut"],
  vegetables: ["vegetable", "vegetables", "tomato", "kale", "sukuma",
    "spinach", "cabbage", "onion", "carrot", "capsicum", "pepper",
    "broccoli", "lettuce", "okra", "eggplant"],
  nuts: ["nut", "nuts", "groundnut", "peanut", "macadamia", "cashew",
    "almond", "walnut"],
  "starchy-foods": ["potato", "sweet potato", "cassava", "yam",
    "arrowroot", "taro", "nduma", "viazi", "muhogo"],
  grains: ["maize", "corn", "rice", "wheat", "millet", "sorghum",
    "barley", "oats", "grain", "grains"],
  legumes: ["bean", "beans", "legume", "legumes", "pea", "peas",
    "lentil", "lentils", "green gram", "ndengu", "pigeon pea",
    "cowpea", "chickpea"],
  livestock: ["cow", "cattle", "goat", "sheep", "chicken", "poultry",
    "pig", "piglet", "rabbit", "duck", "turkey", "calf", "livestock",
    "animal", "animals", "hen", "bull"],
  "farm-inputs": ["fertiliser", "fertilizer", "manure", "seed",
    "seeds", "tool", "tools", "equipment", "pesticide", "herbicide",
    "feed", "farm input", "farm inputs", "sprayer", "irrigation"]
};

const DEMO_LISTINGS = [
  {
    id: "demo-avocado-hass",
    name: "Avocados",
    variety: "Hass",
    category: "fruits",
    price: 80,
    unit: "kg",
    quantity: 120,
    location: "Kiambu County",
    description: "Fresh Hass avocados from a sample farm. Suitable for local markets.",
    image: "",
    contact: "",
    seller: "Green Valley Demo Farm",
    createdAt: "2026-10-23T08:00:00.000Z",
    demo: true,
    likes: 4
  },
  {
    id: "demo-mango",
    name: "Mangoes",
    variety: "Apple mango",
    category: "fruits",
    price: 60,
    unit: "kg",
    quantity: 80,
    location: "Makueni County",
    description: "Sample listing of ripe seasonal mangoes.",
    image: "",
    contact: "",
    seller: "Sunrise Demo Farm",
    createdAt: "2026-10-22T08:00:00.000Z",
    demo: true,
    likes: 7
  },
  {
    id: "demo-tomatoes",
    name: "Tomatoes",
    variety: "Anna F1",
    category: "vegetables",
    price: 100,
    unit: "crate",
    quantity: 15,
    location: "Nakuru County",
    description: "Example tomato listing for the marketplace demonstration.",
    image: "",
    contact: "",
    seller: "Fresh Fields Demo Farm",
    createdAt: "2026-10-21T08:00:00.000Z",
    demo: true,
    likes: 5
  },
  {
    id: "demo-kale",
    name: "Kale",
    variety: "Sukuma wiki",
    category: "vegetables",
    price: 30,
    unit: "bunch",
    quantity: 100,
    location: "Kajiado County",
    description: "A sample listing of fresh leafy vegetables.",
    image: "",
    contact: "",
    seller: "Green Basket Demo Farm",
    createdAt: "2026-10-20T08:00:00.000Z",
    demo: true,
    likes: 2
  },
  {
    id: "demo-macadamia",
    name: "Macadamia nuts",
    variety: "Raw in shell",
    category: "nuts",
    price: 180,
    unit: "kg",
    quantity: 60,
    location: "Murang'a County",
    description: "Illustrative listing for raw macadamia nuts.",
    image: "",
    contact: "",
    seller: "Highland Demo Farm",
    createdAt: "2026-10-19T08:00:00.000Z",
    demo: true,
    likes: 3
  },
  {
    id: "demo-potatoes",
    name: "Potatoes",
    variety: "Shangi",
    category: "starchy-foods",
    price: 1800,
    unit: "bag",
    quantity: 20,
    location: "Nyandarua County",
    description: "Sample Shangi potato listing. Confirm bag size with the seller.",
    image: "",
    contact: "",
    seller: "Highland Harvest Demo Farm",
    createdAt: "2026-10-18T08:00:00.000Z",
    demo: true,
    likes: 6
  },
  {
    id: "demo-maize",
    name: "Maize",
    variety: "Dry white maize",
    category: "grains",
    price: 75,
    unit: "kg",
    quantity: 300,
    location: "Uasin Gishu County",
    description: "Example listing of dry grain for demonstration purposes.",
    image: "",
    contact: "",
    seller: "Rift Valley Demo Farm",
    createdAt: "2026-10-17T08:00:00.000Z",
    demo: true,
    likes: 8
  },
  {
    id: "demo-rice",
    name: "Rice",
    variety: "Pishori",
    category: "grains",
    price: 160,
    unit: "kg",
    quantity: 50,
    location: "Kirinyaga County",
    description: "Sample rice listing. Price is illustrative, not a live quote.",
    image: "",
    contact: "",
    seller: "Mwea Demo Farm",
    createdAt: "2026-10-16T08:00:00.000Z",
    demo: true,
    likes: 3
  },
  {
    id: "demo-beans",
    name: "Beans",
    variety: "Rosecoco",
    category: "legumes",
    price: 140,
    unit: "kg",
    quantity: 75,
    location: "Busia County",
    description: "Example dry bean listing for exploring product varieties.",
    image: "",
    contact: "",
    seller: "Western Demo Farm",
    createdAt: "2026-10-15T08:00:00.000Z",
    demo: true,
    likes: 5
  },
  {
    id: "demo-ndengu",
    name: "Green grams",
    variety: "Ndengu",
    category: "legumes",
    price: 120,
    unit: "kg",
    quantity: 90,
    location: "Kitui County",
    description: "Sample green gram listing.",
    image: "",
    contact: "",
    seller: "Eastern Demo Farm",
    createdAt: "2026-10-14T08:00:00.000Z",
    demo: true,
    likes: 2
  },
  {
    id: "demo-goat",
    name: "Goats",
    variety: "Local breed",
    category: "livestock",
    price: 6500,
    unit: "animal",
    quantity: 6,
    location: "Kajiado County",
    description: "Example livestock listing. Inspect animals before any purchase.",
    image: "",
    contact: "",
    seller: "Savannah Demo Farm",
    createdAt: "2026-10-13T08:00:00.000Z",
    demo: true,
    likes: 4
  },
  {
    id: "demo-seeds",
    name: "Vegetable seeds",
    variety: "Mixed garden pack",
    category: "farm-inputs",
    price: 250,
    unit: "piece",
    quantity: 25,
    location: "Nairobi County",
    description: "Illustrative farm-input listing. Verify the seed variety and source.",
    image: "",
    contact: "",
    seller: "Agri Supplies Demo",
    createdAt: "2026-10-12T08:00:00.000Z",
    demo: true,
    likes: 1
  }
];

/* -------------------- LANGUAGE SUPPORT -------------------- */

const TRANSLATIONS = {
  en: {
    marketplace: "Marketplace",
    smartAssist: "Smart Assist",
    saccoHub: "SACCO Hub",
    opportunities: "Opportunities",
    signIn: "Sign in",
    sellProduce: "+ Sell produce",
    explore: "Explore marketplace →",
    listProducts: "List your products",
    farmerMarket: "THE FARMERS' MARKET",
    findNeeds: "Find what you need.",
    browseProducts: "Browse products or search for a specific crop variety.",
    searchProducts: "Search products",
    location: "County or location",
    allCategories: "All categories",
    search: "Search",
    availableProducts: "Available farm products",
    favourites: "♡ Favourites",
    clearFilters: "Clear filters",
    newest: "Newest first",
    lowPrice: "Price: low to high",
    highPrice: "Price: high to low",
    productName: "Product name",
    createListing: "+ Create listing",
    noProducts: "No matching products",
    noProductsMessage: "Try another search, county or category.",
    contactSeller: "Contact option",
    demoProfile: "Demo profile",
    saveListing: "Save demo listing",
    cancel: "Cancel",
    chooseCategory: "Choose a category",
    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchy: "Starchy foods",
    grains: "Grains",
    legumes: "Legumes",
    livestock: "Livestock",
    farmInputs: "Farm inputs"
  },
  sw: {
    marketplace: "Soko",
    smartAssist: "Msaidizi wa Kilimo",
    saccoHub: "Kitovu cha SACCO",
    opportunities: "Fursa",
    signIn: "Ingia",
    sellProduce: "+ Uza mazao",
    explore: "Angalia soko →",
    listProducts: "Orodhesha mazao",
    farmerMarket: "SOKO LA WAKULIMA",
    findNeeds: "Pata unachohitaji.",
    browseProducts: "Tafuta bidhaa au aina maalum ya zao.",
    searchProducts: "Tafuta bidhaa",
    location: "Kaunti au eneo",
    allCategories: "Aina zote",
    search: "Tafuta",
    availableProducts: "Mazao yanayopatikana",
    favourites: "♡ Vipendwa",
    clearFilters: "Ondoa vichujio",
    newest: "Mpya kwanza",
    lowPrice: "Bei: chini hadi juu",
    highPrice: "Bei: juu hadi chini",
    productName: "Jina la bidhaa",
    createListing: "+ Orodhesha bidhaa",
    noProducts: "Hakuna bidhaa zinazolingana",
    noProductsMessage: "Jaribu utafutaji, kaunti au aina nyingine.",
    contactSeller: "Wasiliana na muuzaji",
    demoProfile: "Wasifu wa majaribio",
    saveListing: "Hifadhi tangazo la majaribio",
    cancel: "Ghairi",
    chooseCategory: "Chagua aina",
    fruits: "Matunda",
    vegetables: "Mboga",
    nuts: "Karanga na njugu",
    starchy: "Vyakula vya wanga",
    grains: "Nafaka",
    legumes: "Mikunde",
    livestock: "Mifugo",
    farmInputs: "Vifaa vya kilimo"
  },
  sheng: {
    marketplace: "Soko",
    smartAssist: "Smart Assist",
    saccoHub: "SACCO Hub",
    opportunities: "Fursa",
    signIn: "Ingia",
    sellProduce: "+ Weka mazao",
    explore: "Cheki soko →",
    listProducts: "Weka bidhaa zako",
    farmerMarket: "SOKO YA MAFARMERS",
    findNeeds: "Pata vitu unatafuta.",
    browseProducts: "Search bidhaa ama variety ya crop unataka.",
    searchProducts: "Search products",
    location: "County ama location",
    allCategories: "Categories zote",
    search: "Search",
    availableProducts: "Products ziko available",
    favourites: "♡ Zimependwa",
    clearFilters: "Clear filters",
    newest: "Mpya kwanza",
    lowPrice: "Bei: chini hadi juu",
    highPrice: "Bei: juu hadi chini",
    productName: "Jina ya product",
    createListing: "+ Weka listing",
    noProducts: "Hakuna product imepatikana",
    noProductsMessage: "Try search ama county ingine.",
    contactSeller: "Contact seller",
    demoProfile: "Demo profile",
    saveListing: "Save demo listing",
    cancel: "Cancel",
    chooseCategory: "Chagua category",
    fruits: "Fruits",
    vegetables: "Veggies",
    nuts: "Nuts",
    starchy: "Starchy foods",
    grains: "Grains",
    legumes: "Legumes",
    livestock: "Mifugo",
    farmInputs: "Farm inputs"
  },
  mix: {
    marketplace: "Soko / Marketplace",
    smartAssist: "Smart Assist",
    saccoHub: "SACCO Hub",
    opportunities: "Fursa",
    signIn: "Ingia / Sign in",
    sellProduce: "+ Uza produce",
    explore: "Explore soko →",
    listProducts: "List bidhaa zako",
    farmerMarket: "SOKO LA FARMERS",
    findNeeds: "Pata what you need.",
    browseProducts: "Browse bidhaa ama search crop variety.",
    searchProducts: "Search bidhaa",
    location: "County / eneo",
    allCategories: "Categories zote",
    search: "Search",
    availableProducts: "Available farm products",
    favourites: "♡ Favourites",
    clearFilters: "Clear filters",
    newest: "Newest first",
    lowPrice: "Bei: low to high",
    highPrice: "Bei: high to low",
    productName: "Product name",
    createListing: "+ Create listing",
    noProducts: "Hakuna matching products",
    noProductsMessage: "Try search ama category ingine.",
    contactSeller: "Contact seller",
    demoProfile: "Demo profile",
    saveListing: "Save demo listing",
    cancel: "Cancel",
    chooseCategory: "Chagua category",
    fruits: "Matunda / Fruits",
    vegetables: "Mboga / Vegetables",
    nuts: "Nuts",
    starchy: "Starchy foods",
    grains: "Nafaka / Grains",
    legumes: "Mikunde / Legumes",
    livestock: "Mifugo / Livestock",
    farmInputs: "Farm inputs"
  }
};

function getLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE.language);
    return TRANSLATIONS[saved] ? saved : "en";
  } catch {
    return "en";
  }
}

let currentLanguage = getLanguage();

function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key]
    || TRANSLATIONS.en[key]
    || key;
}

function applyLanguage(language) {
  currentLanguage = TRANSLATIONS[language] ? language : "en";

  try {
    localStorage.setItem(STORAGE.language, currentLanguage);
  } catch {
    // The website remains usable when storage is unavailable.
  }

  const selector = document.getElementById("languageSelect");
  if (selector) selector.value = currentLanguage;

  const textMap = {
    ".main-nav a[href='index.html']": "marketplace",
    ".main-nav a[href='smart-assist.html']": "smartAssist",
    ".main-nav a[href='sacco.html']": "saccoHub",
    ".main-nav a[href='#opportunities']": "opportunities",
    "#loginBtn": "signIn",
    "#openListingBtn": "sellProduce",
    ".hero-actions a": "explore",
    "#heroSellBtn": "listProducts",
    "#sectionSellBtn": "createListing",
    ".section-heading .eyebrow": "farmerMarket",
    ".search-field input#searchInput": "searchProducts",
    ".search-field input#locationInput": "location",
    "#searchForm button[type='submit']": "search",
    "#listingHeading": "availableProducts",
    "#favoritesFilterBtn": "favourites",
    "#clearFiltersBtn": "clearFilters",
    "#listingModal .modal-header h2": "createListing",
    "#listingForm button[type='submit']": "saveListing"
  };

  for (const [selector, key] of Object.entries(textMap)) {
    const element = document.querySelector(selector);
    if (!element) continue;

    if (element.matches("input")) {
      element.placeholder = t(key);
    } else {
      element.textContent = t(key);
    }
  }

  const heading = document.querySelector("#marketplace .section-heading h2");
  if (heading) heading.textContent = t("findNeeds");

  const description = document.querySelector("#marketplace .section-heading p");
  if (description) description.textContent = t("browseProducts");

  const locationInput = document.getElementById("locationInput");
  if (locationInput) locationInput.placeholder = "e.g. Nakuru, Kiambu";

  const searchInput = document.getElementById("searchInput");
  if (searchInput && currentLanguage === "sw") {
    searchInput.placeholder = "Mfano: Hass avocado, maharagwe...";
  } else if (searchInput && currentLanguage === "sheng") {
    searchInput.placeholder = "Try Hass avocado, beans, maize...";
  }

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    const options = categoryFilter.options;
    const keys = [
      "allCategories", "fruits", "vegetables", "nuts", "starchy",
      "grains", "legumes", "livestock", "farmInputs"
    ];

    Array.from(options).forEach((option, index) => {
      if (keys[index]) option.textContent = t(keys[index]);
    });
  }

  const categoryLabels = {
    fruits: "fruits",
    vegetables: "vegetables",
    nuts: "nuts",
    "starchy-foods": "starchy",
    grains: "grains",
    legumes: "legumes",
    livestock: "livestock",
    "farm-inputs": "farmInputs"
  };

  document.querySelectorAll(".category-card").forEach(card => {
    const category = card.dataset.category;
    const title = card.querySelector("strong");
    if (title && categoryLabels[category]) {
      title.textContent = t(categoryLabels[category]);
    }
  });

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    const sortKeys = ["newest", "lowPrice", "highPrice", "productName"];
    Array.from(sortSelect.options).forEach((option, index) => {
      if (sortKeys[index]) option.textContent = t(sortKeys[index]);
    });
  }

  renderListings();
}

/* -------------------- SAFE STORAGE -------------------- */

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Browser storage is unavailable or full. Changes may not persist.", true);
    return false;
  }
}

function getListings() {
  const value = readJSON(STORAGE.listings, null);
  if (!Array.isArray(value)) {
    writeJSON(STORAGE.listings, DEMO_LISTINGS);
    return [...DEMO_LISTINGS];
  }
  return value;
}

function saveListings(listings) {
  return writeJSON(STORAGE.listings, listings);
}

function getFavourites() {
  const value = readJSON(STORAGE.favourites, []);
  return Array.isArray(value) ? value : [];
}

function saveFavourites(value) {
  writeJSON(STORAGE.favourites, value);
}

function getLikes() {
  const value = readJSON(STORAGE.likes, []);
  return Array.isArray(value) ? value : [];
}

function saveLikes(value) {
  writeJSON(STORAGE.likes, value);
}

/* -------------------- GENERAL HELPERS -------------------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function validImageURL(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    // Invalid image URLs are ignored.
  }

  return "";
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Price on request";

  return "KSh " + new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 2
  }).format(number);
}

function formatUnit(unit) {
  const units = {
    kg: "kg",
    bag: "bag",
    piece: "piece",
    crate: "crate",
    bunch: "bunch",
    litre: "litre",
    animal: "animal",
    tray: "tray",
    other: "unit"
  };

  return units[unit] || unit || "unit";
}

function categoryInfo(category) {
  return CATEGORIES[category] || {
    label: "Other",
    icon: "🌱"
  };
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return "user-" + window.crypto.randomUUID();
  }

  return "user-" + Date.now().toString(36)
    + Math.random().toString(36).slice(2, 10);
}

function showToast(message, isError = false) {
  const container = document.getElementById("toastContainer");
  if (!container) {
    console.log(message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " error" : "");
  toast.setAttribute("role", isError ? "alert" : "status");
  toast.textContent = message;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3500);
}

function openDialog(dialog) {
  if (!dialog) return;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (!dialog) return;

  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

/* -------------------- SEARCH AND FILTER STATE -------------------- */

const state = {
  category: "all",
  search: "",
  location: "",
  favouritesOnly: false
};

function getSearchableText(item) {
  return [
    item.name,
    item.variety,
    item.category,
    categoryInfo(item.category).label,
    item.location,
    item.description,
    item.seller
  ].filter(Boolean).join(" ").toLowerCase();
}

function getFilteredListings() {
  let listings = getListings();

  if (state.category !== "all") {
    listings = listings.filter(item => item.category === state.category);
  }

  if (state.search) {
    const searchTerms = state.search
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    listings = listings.filter(item => {
      const searchable = getSearchableText(item);
      return searchTerms.every(term => searchable.includes(term));
    });
  }

  if (state.location) {
    const location = state.location.toLowerCase();
    listings = listings.filter(item =>
      String(item.location || "").toLowerCase().includes(location)
    );
  }

  if (state.favouritesOnly) {
    const favourites = getFavourites();
    listings = listings.filter(item => favourites.includes(item.id));
  }

  const sort = document.getElementById("sortSelect")?.value || "newest";

  listings.sort((a, b) => {
    if (sort === "price-low") {
      return Number(a.price) - Number(b.price);
    }

    if (sort === "price-high") {
      return Number(b.price) - Number(a.price);
    }

    if (sort === "name") {
      return String(a.name).localeCompare(String(b.name));
    }

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return listings;
}

/* -------------------- PRODUCT RENDERING -------------------- */

function renderProduct(item) {
  const category = categoryInfo(item.category);
  const imageURL = validImageURL(item.image);
  const favourites = getFavourites();
  const likes = getLikes();

  const isFavourite = favourites.includes(item.id);
  const hasLiked = likes.includes(item.id);
  const likeCount = Math.max(0, Number(item.likes) || 0) + (hasLiked ? 1 : 0);

  const productName = [item.name, item.variety]
    .filter(Boolean)
    .map(escapeHTML)
    .join(" · ");

  const photo = imageURL
    ? `<img src="${escapeHTML(imageURL)}" alt="${escapeHTML(item.name)}" loading="lazy">`
    : `<span class="product-placeholder" aria-hidden="true">${category.icon}</span>`;

  const demoBadge = item.demo
    ? '<span class="product-badge">DEMO SAMPLE</span>'
    : '<span class="product-badge">LOCAL LISTING</span>';

  return `
    <article class="product-card" data-product-id="${escapeHTML(item.id)}">
      <div class="product-image">
        ${photo}
        ${demoBadge}
        <button
          class="favorite-btn ${isFavourite ? "active" : ""}"
          type="button"
          data-action="favorite"
          data-id="${escapeHTML(item.id)}"
          aria-label="${isFavourite ? "Remove from favourites" : "Add to favourites"}"
          aria-pressed="${isFavourite}"
          title="${isFavourite ? "Remove favourite" : "Save favourite"}"
        >${isFavourite ? "♥" : "♡"}</button>
      </div>

      <div class="product-card-body">
        <span class="product-category">${escapeHTML(category.label)}</span>
        <h3 class="product-name">${productName || escapeHTML(item.name)}</h3>

        <div class="product-location">📍 ${escapeHTML(item.location || "Location not supplied")}</div>

        <p class="product-description">${escapeHTML(item.description || "No description supplied.")}</p>

        <div class="product-meta">
          📦 ${escapeHTML(item.quantity ?? "—")} ${escapeHTML(formatUnit(item.unit))} available
        </div>

        <div class="product-price">
          ${formatPrice(item.price)}
          <small>/ ${escapeHTML(formatUnit(item.unit))}</small>
        </div>

        <div class="product-seller">Listed by ${escapeHTML(item.seller || "Demo farmer")}</div>

        <div class="product-card-footer">
          <button
            class="btn btn-outline"
            type="button"
            data-action="like"
            data-id="${escapeHTML(item.id)}"
            aria-pressed="${hasLiked}"
            title="Like this listing"
          >${hasLiked ? "♥" : "♡"} ${likeCount}</button>

          <button
            class="btn btn-primary"
            type="button"
            data-action="contact"
            data-id="${escapeHTML(item.id)}"
          >Contact option</button>
        </div>
      </div>
    </article>
  `;
}

function renderListings() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const listings = getFilteredListings();
  const count = document.getElementById("resultsCount");
  const heading = document.getElementById("listingHeading");

  if (count) {
    count.textContent = `${listings.length} product${listings.length === 1 ? "" : "s"} found`;
  }

  if (heading) {
    heading.textContent = state.favouritesOnly
      ? t("favourites")
      : state.category !== "all"
        ? categoryInfo(state.category).label
        : t("availableProducts");
  }

  grid.innerHTML = listings.length
    ? listings.map(renderProduct).join("")
    : `
      <div class="empty-state">
        <span>🔎</span>
        <h3>${escapeHTML(t("noProducts"))}</h3>
        <p>${escapeHTML(t("noProductsMessage"))}</p>
      </div>
    `;

  document.querySelectorAll(".category-card").forEach(card => {
    const active = card.dataset.category === state.category;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", String(active));
  });

  const favouriteButton = document.getElementById("favoritesFilterBtn");
  if (favouriteButton) {
    favouriteButton.classList.toggle("active", state.favouritesOnly);
    favouriteButton.setAttribute("aria-pressed", String(state.favouritesOnly));
  }

  updateStats();
}

function updateStats() {
  const listings = getListings();

  const listingStat = document.getElementById("statListings");
  const categoryStat = document.getElementById("statCategories");

  if (listingStat) listingStat.textContent = String(listings.length);
  if (categoryStat) categoryStat.textContent = String(Object.keys(CATEGORIES).length);
}

/* -------------------- CATEGORY DETECTION -------------------- */

function inferCategory(name, variety, description) {
  const text = `${name} ${variety} ${description}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return "";
}

/* -------------------- LISTING CREATION -------------------- */

function createListing(formData) {
  const category = String(formData.get("category") || "");
  const name = String(formData.get("name") || "").trim();
  const variety = String(formData.get("variety") || "").trim();
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity"));
  const unit = String(formData.get("unit") || "kg");
  const location = String(formData.get("location") || "").trim();
  const image = validImageURL(String(formData.get("image") || "").trim());
  const description = String(formData.get("description") || "").trim();
  const contact = String(formData.get("contact") || "").trim();

  if (!CATEGORIES[category]) {
    showToast("Please choose a valid product category.", true);
    return false;
  }

  if (!name || name.length > 80) {
    showToast("Enter a product name of up to 80 characters.", true);
    return false;
  }

  if (!Number.isFinite(price) || price < 0) {
    showToast("Enter a valid price of zero or more.", true);
    return false;
  }

  if (!Number.isFinite(quantity) || quantity < 0) {
    showToast("Enter a valid available quantity.", true);
    return false;
  }

  if (!location || location.length > 100) {
    showToast("Enter a valid county or location.", true);
    return false;
  }

  const profile = readJSON(STORAGE.profile, null);

  const listing = {
    id: makeId(),
    name,
    variety,
    category,
    price,
    unit,
    quantity,
    location,
    description,
    image,
    contact,
    seller: profile?.name || "Demo farmer",
    createdAt: new Date().toISOString(),
    demo: false,
    likes: 0
  };

  const listings = getListings();
  listings.unshift(listing);

  if (!saveListings(listings)) return false;

  state.category = "all";
  state.search = "";
  state.location = "";
  state.favouritesOnly = false;

  const searchInput = document.getElementById("searchInput");
  const locationInput = document.getElementById("locationInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) searchInput.value = "";
  if (locationInput) locationInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";

  renderListings();
  showToast("Your demo listing has been saved in this browser.");

  return true;
}

/* -------------------- PROFILE -------------------- */

function updateProfileButton() {
  const button = document.getElementById("loginBtn");
  const profile = readJSON(STORAGE.profile, null);

  if (button) {
    button.textContent = profile?.name
      ? `👤 ${profile.name}`
      : t("signIn");

    button.title = profile?.name
      ? "Open your local demo profile"
      : "Create a local demo profile";
  }
}

/* -------------------- EVENT LISTENERS -------------------- */

function setupSearch() {
  const form = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const locationInput = document.getElementById("locationInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");

  form?.addEventListener("submit", event => {
    event.preventDefault();

    state.search = searchInput?.value.trim() || "";
    state.location = locationInput?.value.trim() || "";
    state.category = categoryFilter?.value || "all";
    state.favouritesOnly = false;

    renderListings();

    document.getElementById("listingHeading")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  searchInput?.addEventListener("input", () => {
    state.search = searchInput.value.trim();
    renderListings();
  });

  locationInput?.addEventListener("input", () => {
    state.location = locationInput.value.trim();
    renderListings();
  });

  categoryFilter?.addEventListener("change", () => {
    state.category = categoryFilter.value;
    state.favouritesOnly = false;
    renderListings();
  });

  sortSelect?.addEventListener("change", renderListings);

  document.getElementById("categoryGrid")?.addEventListener("click", event => {
    const card = event.target.closest("[data-category]");
    if (!card) return;

    state.category = state.category === card.dataset.category
      ? "all"
      : card.dataset.category;

    state.favouritesOnly = false;

    if (categoryFilter) categoryFilter.value = state.category;

    renderListings();

    document.getElementById("listingHeading")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    state.category = "all";
    state.search = "";
    state.location = "";
    state.favouritesOnly = false;

    if (searchInput) searchInput.value = "";
    if (locationInput) locationInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (sortSelect) sortSelect.value = "newest";

    renderListings();
    showToast("Filters cleared.");
  });

  document.getElementById("favoritesFilterBtn")?.addEventListener("click", () => {
    state.favouritesOnly = !state.favouritesOnly;
    renderListings();

    if (state.favouritesOnly) {
      document.getElementById("listingHeading")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

function setupProductActions() {
  document.getElementById("productGrid")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const listings = getListings();
    const item = listings.find(listing => listing.id === id);

    if (!item) {
      showToast("That listing could not be found.", true);
      return;
    }

    if (action === "favorite") {
      const favourites = getFavourites();
      const exists = favourites.includes(id);

      saveFavourites(
        exists ? favourites.filter(value => value !== id) : [...favourites, id]
      );

      renderListings();
      showToast(exists ? "Removed from favourites." : "Added to favourites.");
    }

    if (action === "like") {
      const likes = getLikes();
      const exists = likes.includes(id);

      saveLikes(
        exists ? likes.filter(value => value !== id) : [...likes, id]
      );

      renderListings();
      showToast(exists ? "Like removed." : "You liked this listing.");
    }

    if (action === "contact") {
      if (item.contact) {
        showToast(`Demo contact information: ${item.contact}`);
      } else {
        showToast(
          "Demo marketplace: no contact details supplied. Confirm seller details before any transaction."
        );
      }
    }
  });
}

function setupListingModal() {
  const modal = document.getElementById("listingModal");
  const form = document.getElementById("listingForm");

  const openButtons = [
    document.getElementById("openListingBtn"),
    document.getElementById("heroSellBtn"),
    document.getElementById("sectionSellBtn")
  ];

  openButtons.forEach(button => {
    button?.addEventListener("click", () => openDialog(modal));
  });

  modal?.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeDialog(modal));
  });

  modal?.addEventListener("click", event => {
    if (event.target === modal) closeDialog(modal);
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const success = createListing(new FormData(form));

    if (success) {
      form.reset();
      closeDialog(modal);
    }
  });
}

function setupProfileModal() {
  const modal = document.getElementById("loginModal");
  const form = document.getElementById("loginForm");

  document.getElementById("loginBtn")?.addEventListener("click", () => {
    const profile = readJSON(STORAGE.profile, null);
    const nameInput = document.getElementById("demoUserName");
    const roleInput = document.getElementById("demoUserRole");

    if (nameInput) nameInput.value = profile?.name || "";
    if (roleInput) roleInput.value = profile?.role || "farmer";

    openDialog(modal);
  });

  modal?.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeDialog(modal));
  });

  modal?.addEventListener("click", event => {
    if (event.target === modal) closeDialog(modal);
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("demoUserName")?.value.trim() || "";
    const role = document.getElementById("demoUserRole")?.value || "farmer";

    if (!name || name.length > 60) {
      showToast("Enter a display name of up to 60 characters.", true);
      return;
    }

    const saved = writeJSON(STORAGE.profile, { name, role });

    if (saved) {
      updateProfileButton();
      closeDialog(modal);
      showToast(`Welcome, ${name}! Your local demo profile is ready.`);
    }
  });
}

function setupLanguage() {
  document.getElementById("languageSelect")?.addEventListener("change", event => {
    applyLanguage(event.target.value);
    showToast("Language preference updated.");
  });
}

function setupMobileMenu() {
  const button = document.getElementById("mobileMenuBtn");
  const nav = document.querySelector(".main-nav");

  button?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open") || false;
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "✕" : "☰";
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");

      if (button) button.textContent = "☰";
    });
  });
}

/* -------------------- STARTUP -------------------- */

function initialiseShambaMarket() {
  // Initialise sample listings only on first use.
  getListings();

  const year = document.getElementById("currentYear");
  if (year) year.textContent = String(new Date().getFullYear());

  setupSearch();
  setupProductActions();
  setupListingModal();
  setupProfileModal();
  setupLanguage();
  setupMobileMenu();

  updateProfileButton();
  applyLanguage(currentLanguage);
  renderListings();

  console.info("ShambaMarket demo initialised.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseShambaMarket, {
    once: true
  });
} else {
  initialiseShambaMarket();
}
