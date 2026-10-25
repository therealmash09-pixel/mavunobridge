
/* =========================================================
   MAVUNOBRIDGE — MAIN MARKETPLACE ENGINE
   Demo version | No Supabase required yet
   ========================================================= */

"use strict";

const MAVUNO = {
  listingsKey: "mavunobridge_listings_v1",
  cartKey: "mavunobridge_cart_v1",
  languageKey: "mavunobridge_language_v1",
  oldListingsKey: "shambamarket_listings_v4",
  oldCartKey: "shambamarket_cart_v4"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const KENYA_COUNTIES = [
  "Baringo", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega",
  "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
  "Kisumu", "Kitui", "Kwale", "Laikipia", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori",
  "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu",
  "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga",
  "Wajir", "West Pokot"
];

const CATEGORY_NAMES = {
  all: "All products",
  fruits: "Fruits",
  vegetables: "Vegetables",
  nuts: "Nuts",
  starchy: "Starchy foods",
  grains: "Grains",
  legumes: "Legumes",
  livestock: "Livestock & animal products",
  inputs: "Farm inputs & equipment",
  services: "Farm services",
  spices: "Spices & herbs"
};

/* Indicative demo prices in KSh.
   These are examples, NOT official or live market prices. */
const PRICE_GUIDE = {
  tomatoes: { low: 60, high: 110, unit: "kg" },
  "hass avocados": { low: 90, high: 180, unit: "kg" },
  maize: { low: 45, high: 80, unit: "kg" },
  beans: { low: 100, high: 180, unit: "kg" },
  potatoes: { low: 40, high: 90, unit: "kg" },
  onions: { low: 70, high: 140, unit: "kg" },
  bananas: { low: 50, high: 120, unit: "kg" },
  "green grams": { low: 100, high: 190, unit: "kg" }
};

const DEMO_PRODUCTS = [
  {
    id: "demo-avocado",
    name: "Fresh Hass Avocados",
    category: "fruits",
    location: "Kiambu",
    seller: "Green Valley Farm",
    phone: "0700000001",
    quantity: 250,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 120,
    retailUnit: "kg",
    bulkPrice: 95,
    bulkUnit: "kg",
    bulkMinimum: 20,
    description: "Fresh Hass avocados. Contact seller to confirm grade and availability.",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-24T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-tomatoes",
    name: "Fresh Red Tomatoes",
    category: "vegetables",
    location: "Nakuru",
    seller: "Nakuru Fresh Produce",
    phone: "0700000002",
    quantity: 180,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 80,
    retailUnit: "kg",
    bulkPrice: 65,
    bulkUnit: "kg",
    bulkMinimum: 20,
    description: "Ripe tomatoes for homes, shops and food businesses. Confirm freshness before ordering.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-23T10:00:00.000Z",
    demo: true
  },
  {
    id: "demo-beans",
    name: "Dry Beans",
    category: "legumes",
    location: "Meru",
    seller: "Meru Harvest Traders",
    phone: "0700000003",
    quantity: 90,
    stockUnit: "bags",
    saleType: "both",
    retailPrice: 140,
    retailUnit: "kg",
    bulkPrice: 6200,
    bulkUnit: "bag",
    bulkMinimum: 5,
    description: "Dry beans for household and wholesale buyers. Ask about bag weight.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-22T09:00:00.000Z",
    demo: true
  },
  {
    id: "demo-maize",
    name: "Dry Maize",
    category: "grains",
    location: "Uasin Gishu",
    seller: "North Rift Grain Farm",
    phone: "0700000004",
    quantity: 500,
    stockUnit: "bags",
    saleType: "bulk",
    retailPrice: null,
    retailUnit: "kg",
    bulkPrice: 3200,
    bulkUnit: "bag",
    bulkMinimum: 10,
    description: "Dry maize for milling and wholesale. Confirm bag weight and quality with seller.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-21T09:00:00.000Z",
    demo: true
  },
  {
    id: "demo-potatoes",
    name: "Irish Potatoes",
    category: "starchy",
    location: "Nyandarua",
    seller: "Aberdare Potato Growers",
    phone: "0700000005",
    quantity: 300,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 60,
    retailUnit: "kg",
    bulkPrice: 48,
    bulkUnit: "kg",
    bulkMinimum: 30,
    description: "Potatoes for homes, hotels and traders. Confirm size and grade.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-20T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-greengrams",
    name: "Green Grams",
    category: "legumes",
    location: "Machakos",
    seller: "Eastern Harvest Farm",
    phone: "0700000006",
    quantity: 120,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 150,
    retailUnit: "kg",
    bulkPrice: 130,
    bulkUnit: "kg",
    bulkMinimum: 20,
    description: "Dried green grams. Confirm cleaning, grade and available quantity.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-19T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-bananas",
    name: "Fresh Bananas",
    category: "fruits",
    location: "Kisumu",
    seller: "Lake Region Fruit Farm",
    phone: "0700000007",
    quantity: 100,
    stockUnit: "bunches",
    saleType: "retail",
    retailPrice: 100,
    retailUnit: "bunch",
    bulkPrice: null,
    bulkUnit: "bunch",
    bulkMinimum: 0,
    description: "Fresh bananas. Contact the seller for bunch sizes and collection arrangements.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-18T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-onions",
    name: "Red Onions",
    category: "vegetables",
    location: "Nakuru",
    seller: "Rift Valley Onion Farm",
    phone: "0700000008",
    quantity: 200,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 100,
    retailUnit: "kg",
    bulkPrice: 85,
    bulkUnit: "kg",
    bulkMinimum: 25,
    description: "Red onions for household and business use. Confirm stock before travelling.",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-17T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-peanuts",
    name: "Raw Groundnuts",
    category: "nuts",
    location: "Busia",
    seller: "Western Nut Growers",
    phone: "0700000009",
    quantity: 80,
    stockUnit: "kg",
    saleType: "both",
    retailPrice: 180,
    retailUnit: "kg",
    bulkPrice: 155,
    bulkUnit: "kg",
    bulkMinimum: 15,
    description: "Raw groundnuts for home use and processing. Ask about sorting and packaging.",
    image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-16T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-eggs",
    name: "Fresh Farm Eggs",
    category: "livestock",
    location: "Kiambu",
    seller: "Sunrise Poultry Farm",
    phone: "0700000010",
    quantity: 40,
    stockUnit: "trays",
    saleType: "both",
    retailPrice: 450,
    retailUnit: "tray",
    bulkPrice: 400,
    bulkUnit: "tray",
    bulkMinimum: 10,
    description: "Farm eggs. Confirm tray size, availability and collection details.",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-15T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-seedlings",
    name: "Vegetable Seedlings",
    category: "inputs",
    location: "Murang'a",
    seller: "Grow Well Nursery",
    phone: "0700000011",
    quantity: 1000,
    stockUnit: "pieces",
    saleType: "retail",
    retailPrice: 5,
    retailUnit: "piece",
    bulkPrice: null,
    bulkUnit: "piece",
    bulkMinimum: 0,
    description: "Vegetable seedlings. Ask the seller about varieties and planting suitability.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-14T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-ploughing",
    name: "Land Preparation Service",
    category: "services",
    location: "Nakuru",
    seller: "Farm Mechanisation Services",
    phone: "0700000012",
    quantity: 1,
    stockUnit: "service",
    saleType: "retail",
    retailPrice: 2500,
    retailUnit: "service",
    bulkPrice: null,
    bulkUnit: "service",
    bulkMinimum: 0,
    description: "Demo service listing. Contact the provider to confirm area covered and final charges.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-13T08:00:00.000Z",
    demo: true
  },
  {
    id: "demo-herbs",
    name: "Fresh Culinary Herbs",
    category: "spices",
    location: "Kiambu",
    seller: "Green Leaf Herb Garden",
    phone: "0700000013",
    quantity: 30,
    stockUnit: "bunches",
    saleType: "retail",
    retailPrice: 50,
    retailUnit: "bunch",
    bulkPrice: null,
    bulkUnit: "bunch",
    bulkMinimum: 0,
    description: "Fresh culinary herbs. Contact seller to confirm varieties and availability.",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-10-12T08:00:00.000Z",
    demo: true
  }
];

let listings = [];
let cart = [];
let activeCategory = "all";
let activeSaleFilter = "all";
let activeSearch = "";
let activeLocation = "all";
let activeSort = "newest";
let activeLanguage = "en";
let toastTimeout = null;

/* =========================================================
   STORAGE
   ========================================================= */

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved data:", key, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Could not save data:", error);
    showToast("Browser storage is unavailable or full.");
    return false;
  }
}

function initialiseStorage() {
  const savedListings = localStorage.getItem(MAVUNO.listingsKey);

  if (savedListings !== null) {
    const stored = readJSON(MAVUNO.listingsKey, []);
    listings = Array.isArray(stored) ? stored : [...DEMO_PRODUCTS];
  } else {
    const oldListings = readJSON(MAVUNO.oldListingsKey, null);
    listings = Array.isArray(oldListings) && oldListings.length
      ? oldListings.map(normaliseListing)
      : [...DEMO_PRODUCTS];

    saveJSON(MAVUNO.listingsKey, listings);
  }

  const savedCart = localStorage.getItem(MAVUNO.cartKey);

  if (savedCart !== null) {
    const storedCart = readJSON(MAVUNO.cartKey, []);
    cart = Array.isArray(storedCart) ? storedCart : [];
  } else {
    const oldCart = readJSON(MAVUNO.oldCartKey, []);
    cart = Array.isArray(oldCart) ? oldCart : [];
    saveJSON(MAVUNO.cartKey, cart);
  }

  activeLanguage = localStorage.getItem(MAVUNO.languageKey) || "en";

  listings = listings.map(normaliseListing);
  cart = cart.filter(item => item && item.id && Number(item.quantity) > 0);

  saveJSON(MAVUNO.listingsKey, listings);
  saveJSON(MAVUNO.cartKey, cart);
}

function normaliseListing(item) {
  const listing = { ...item };

  listing.id = String(listing.id || makeId());
  listing.name = String(listing.name || listing.product || "Farm product");
  listing.category = normaliseCategory(listing.category || "vegetables");
  listing.location = String(listing.location || listing.county || "Kenya");
  listing.seller = String(listing.seller || listing.farmerName || listing.farmer_name || "Local seller");
  listing.phone = String(listing.phone || "");
  listing.quantity = Number(listing.quantity || 0);
  listing.stockUnit = String(listing.stockUnit || listing.unit || "kg");
  listing.saleType = ["retail", "bulk", "both"].includes(listing.saleType)
    ? listing.saleType
    : "retail";

  listing.retailPrice = toOptionalNumber(
    listing.retailPrice ?? listing.price
  );

  listing.retailUnit = String(listing.retailUnit || "kg");
  listing.bulkPrice = toOptionalNumber(listing.bulkPrice);
  listing.bulkUnit = String(listing.bulkUnit || listing.retailUnit || "kg");
  listing.bulkMinimum = Number(listing.bulkMinimum || 0);
  listing.description = String(listing.description || "");
  listing.image = safeImageURL(listing.image || listing.photo_url || "");
  listing.createdAt = listing.createdAt || listing.created_at || new Date().toISOString();
  listing.demo = Boolean(listing.demo);

  return listing;
}

function normaliseCategory(value) {
  const key = String(value || "").toLowerCase().trim();

  const aliases = {
    fruit: "fruits",
    vegetable: "vegetables",
    "starchy foods": "starchy",
    starch: "starchy",
    cereal: "grains",
    cereals: "grains",
    grain: "grains",
    legume: "legumes",
    livestock: "livestock",
    animals: "livestock",
    "animal products": "livestock",
    equipment: "inputs",
    tools: "inputs",
    "farm inputs": "inputs",
    "farm tools": "inputs",
    "farm services": "services",
    herbs: "spices",
    "spices & herbs": "spices"
  };

  return aliases[key] || (CATEGORY_NAMES[key] ? key : "vegetables");
}

function toOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function makeId() {
  return "mv-" + Date.now().toString(36) + "-" +
    Math.random().toString(36).slice(2, 9);
}

/* =========================================================
   SAFE TEXT AND FORMATTING HELPERS
   ========================================================= */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeImageURL(value) {
  const input = String(value || "").trim();
  if (!input) return "";

  try {
    const parsed = new URL(input, window.location.href);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    return parsed.href;
  } catch {
    return "";
  }
}

function money(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "Price on request";
  }

  return "KSh " + Number(value).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });
}

function formatQuantity(value) {
  return Number(value).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });
}

function categoryName(category) {
  return CATEGORY_NAMES[category] || "Farm products";
}

function formatSaleType(value) {
  if (value === "bulk") return "Bulk / wholesale";
  if (value === "both") return "Retail & bulk";
  return "Retail";
}

function listingPriceForSort(listing) {
  if (listing.saleType === "bulk") return listing.bulkPrice ?? Infinity;
  return listing.retailPrice ?? listing.bulkPrice ?? Infinity;
}

/* =========================================================
   TOAST AND MODALS
   ========================================================= */

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  const firstInput = $("input, select, textarea, button", modal);
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("hidden");

  if (!$(".modal:not(.hidden)")) {
    document.body.classList.remove("modal-open");
  }
}

function setupModals() {
  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => {
      closeModal(button.dataset.closeModal);
    });
  });

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".modal:not(.hidden)").forEach(modal => closeModal(modal.id));
    }
  });

  $("#sellButton")?.addEventListener("click", () => openModal("listingModal"));
  $("#heroSellButton")?.addEventListener("click", () => openModal("listingModal"));

  $("#cartButton")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  $("#continueShopping")?.addEventListener("click", () => closeModal("cartModal"));

  $("#loginButton")?.addEventListener("click", () => openModal("loginModal"));
}

/* =========================================================
   MARKETPLACE FILTERING AND RENDERING
   ========================================================= */

function getFilteredListings() {
  let results = [...listings];

  if (activeCategory !== "all") {
    results = results.filter(item => item.category === activeCategory);
  }

  if (activeSaleFilter !== "all") {
    results = results.filter(item =>
      item.saleType === activeSaleFilter || item.saleType === "both"
    );
  }

  if (activeLocation !== "all") {
    results = results.filter(item =>
      item.location.toLowerCase().includes(activeLocation.toLowerCase())
    );
  }

  if (activeSearch) {
    const query = activeSearch.toLowerCase();

    results = results.filter(item => {
      const searchable = [
        item.name,
        item.category,
        item.location,
        item.seller,
        item.description
      ].join(" ").toLowerCase();

      return searchable.includes(query);
    });
  }

  if (activeSort === "price-low") {
    results.sort((a, b) => listingPriceForSort(a) - listingPriceForSort(b));
  } else if (activeSort === "price-high") {
    results.sort((a, b) => listingPriceForSort(b) - listingPriceForSort(a));
  } else if (activeSort === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    results.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return results;
}

function renderListings() {
  const grid = $("#listingGrid");
  const emptyState = $("#emptyState");
  const resultsCount = $("#resultsCount");

  if (!grid) return;

  const results = getFilteredListings();

  grid.replaceChildren();

  results.forEach(listing => {
    grid.appendChild(createProductCard(listing));
  });

  if (emptyState) {
    emptyState.classList.toggle("hidden", results.length > 0);
  }

  if (resultsCount) {
    resultsCount.textContent = results.length === 1
      ? "1 product found"
      : `${results.length} products found`;
  }

  updateActiveCategoryButtons();
}

function createProductCard(listing) {
  const card = document.createElement("article");
  card.className = "product-card";

  const retailAvailable = listing.retailPrice !== null &&
    ["retail", "both"].includes(listing.saleType);

  const bulkAvailable = listing.bulkPrice !== null &&
    ["bulk", "both"].includes(listing.saleType);

  let priceHTML = "";

  if (retailAvailable && bulkAvailable) {
    priceHTML = `
      <div class="product-price">
        <span>Retail</span>
        <strong>${escapeHTML(money(listing.retailPrice))}/${escapeHTML(listing.retailUnit)}</strong>
      </div>
      <div class="product-price secondary-price">
        <span>Bulk</span>
        <strong>${escapeHTML(money(listing.bulkPrice))}/${escapeHTML(listing.bulkUnit)}</strong>
      </div>`;
  } else if (bulkAvailable) {
    priceHTML = `
      <div class="product-price">
        <span>Bulk price</span>
        <strong>${escapeHTML(money(listing.bulkPrice))}/${escapeHTML(listing.bulkUnit)}</strong>
      </div>`;
  } else if (retailAvailable) {
    priceHTML = `
      <div class="product-price">
        <span>Price</span>
        <strong>${escapeHTML(money(listing.retailPrice))}/${escapeHTML(listing.retailUnit)}</strong>
      </div>`;
  } else {
    priceHTML = `
      <div class="product-price">
        <span>Price</span>
        <strong>Contact seller</strong>
      </div>`;
  }

  const image = listing.image
    ? `<img src="${escapeHTML(listing.image)}" alt="${escapeHTML(listing.name)}" loading="lazy">`
    : `<div class="product-image-placeholder" role="img" aria-label="No product image">🌱</div>`;

  const stockLabel = listing.quantity > 0
    ? `${formatQuantity(listing.quantity)} ${listing.stockUnit} available`
    : "Quantity to be confirmed";

  const saleBadge = formatSaleType(listing.saleType);
  const demoBadge = listing.demo
    ? `<span class="product-demo-badge">Demo listing</span>`
    : "";

  card.innerHTML = `
    <div class="product-image">
      ${image}
      <span class="product-category">${escapeHTML(categoryName(listing.category))}</span>
    </div>

    <div class="product-card-body">
      <div class="product-location">📍 ${escapeHTML(listing.location)}</div>
      <h3>${escapeHTML(listing.name)}</h3>
      <p class="product-seller">Seller: ${escapeHTML(listing.seller)}</p>
      <p class="product-stock">${escapeHTML(stockLabel)}</p>
      ${priceHTML}
      <div class="product-badges">
        <span class="sale-badge">${escapeHTML(saleBadge)}</span>
        ${demoBadge}
      </div>
      <p class="product-description">${escapeHTML(listing.description || "Contact the seller for more information.")}</p>
      <div class="product-card-actions">
        <button class="btn btn-primary add-to-cart" type="button" data-add-cart="${escapeHTML(listing.id)}">
          Add to cart
        </button>
        <button class="btn btn-outline contact-seller" type="button" data-contact-seller="${escapeHTML(listing.id)}">
          Contact
        </button>
      </div>
    </div>`;

  const img = $("img", card);

  if (img) {
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "product-image-placeholder";
      placeholder.textContent = "🌱";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", "Product image unavailable");
      img.replaceWith(placeholder);
    }, { once: true });
  }

  return card;
}

function updateActiveCategoryButtons() {
  $$("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      normaliseCategory(button.dataset.category) === activeCategory
    );
  });
}

function resetFilters() {
  activeCategory = "all";
  activeSaleFilter = "all";
  activeSearch = "";
  activeLocation = "all";
  activeSort = "newest";

  if ($("#searchInput")) $("#searchInput").value = "";
  if ($("#searchCategory")) $("#searchCategory").value = "all";
  if ($("#locationFilter")) $("#locationFilter").value = "all";
  if ($("#sortSelect")) $("#sortSelect").value = "newest";
  if ($("#saleTypeFilter")) $("#saleTypeFilter").value = "all";

  $$("[data-sale-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.saleFilter === "all");
  });

  renderListings();
}

function setupMarketplaceFilters() {
  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();

    activeSearch = ($("#searchInput")?.value || "").trim();

    activeCategory = $("#searchCategory")?.value || "all";
    renderListings();

    $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#searchInput")?.addEventListener("input", event => {
    activeSearch = event.target.value.trim();
    renderListings();
  });

  $("#searchCategory")?.addEventListener("change", event => {
    activeCategory = event.target.value || "all";
    renderListings();
  });

  $("#locationFilter")?.addEventListener("change", event => {
    activeLocation = event.target.value || "all";
    renderListings();
  });

  $("#sortSelect")?.addEventListener("change", event => {
    activeSort = event.target.value || "newest";
    renderListings();
  });

  $("#saleTypeFilter")?.addEventListener("change", event => {
    activeSaleFilter = event.target.value || "all";

    $$("[data-sale-filter]").forEach(button => {
      button.classList.toggle("active", button.dataset.saleFilter === activeSaleFilter);
    });

    renderListings();
  });

  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = normaliseCategory(button.dataset.category);
      if ($("#searchCategory")) $("#searchCategory").value = activeCategory;
      renderListings();
    });
  });

  $$("[data-sale-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeSaleFilter = button.dataset.saleFilter || "all";

      if ($("#saleTypeFilter")) {
        $("#saleTypeFilter").value = activeSaleFilter;
      }

      $$("[data-sale-filter]").forEach(other => {
        other.classList.toggle("active", other === button);
      });

      renderListings();
    });
  });

  $("#showAllButton")?.addEventListener("click", resetFilters);

  $("#listingGrid")?.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-cart]");
    const contactButton = event.target.closest("[data-contact-seller]");

    if (addButton) addToCart(addButton.dataset.addCart);
    if (contactButton) contactSeller(contactButton.dataset.contactSeller);
  });
}

/* =========================================================
   PRODUCT LISTING FORM
   ========================================================= */

function updateSalePriceFields() {
  const saleType = $("#saleType")?.value || "retail";
  const retailFields = $("#retailFields");
  const bulkFields = $("#bulkFields");

  const showRetail = saleType === "retail" || saleType === "both";
  const showBulk = saleType === "bulk" || saleType === "both";

  retailFields?.classList.toggle("hidden", !showRetail);
  bulkFields?.classList.toggle("hidden", !showBulk);

  const retailPrice = $("#retailPrice");
  const bulkPrice = $("#bulkPrice");

  if (retailPrice) retailPrice.required = showRetail;
  if (bulkPrice) bulkPrice.required = showBulk;
}

function setupListingForm() {
  $("#saleType")?.addEventListener("change", updateSalePriceFields);
  updateSalePriceFields();

  $("#listingForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const message = $("#listingMessage");

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const seller = String(data.get("seller") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const location = String(data.get("location") || "").trim();
    const quantity = Number(data.get("quantity"));
    const saleType = String(data.get("saleType") || "retail");

    if (!name || !seller || !phone || !location || !Number.isFinite(quantity) || quantity <= 0) {
      if (message) message.textContent = "Please fill in all required fields correctly.";
      return;
    }

    const retailPrice = saleType === "bulk"
      ? null
      : toOptionalNumber(data.get("retailPrice"));

    const bulkPrice = saleType === "retail"
      ? null
      : toOptionalNumber(data.get("bulkPrice"));

    if (saleType !== "bulk" && retailPrice === null) {
      if (message) message.textContent = "Please enter a valid retail price.";
      return;
    }

    if (saleType !== "retail" && bulkPrice === null) {
      if (message) message.textContent = "Please enter a valid bulk price.";
      return;
    }

    const imageURL = safeImageURL(data.get("image"));

    const newListing = normaliseListing({
      id: makeId(),
      name,
      category: data.get("category"),
      location,
      seller,
      phone,
      quantity,
      stockUnit: data.get("stockUnit"),
      saleType,
      retailPrice,
      retailUnit: data.get("retailUnit") || "kg",
      bulkPrice,
      bulkUnit: data.get("bulkUnit") || "kg",
      bulkMinimum: Number(data.get("bulkMinimum") || 0),
      image: imageURL,
      description: String(data.get("description") || "").trim(),
      createdAt: new Date().toISOString(),
      demo: false
    });

    listings.unshift(newListing);

    if (!saveJSON(MAVUNO.listingsKey, listings)) {
      listings.shift();
      if (message) message.textContent = "Could not save your listing. Please try again.";
      return;
    }

    form.reset();
    updateSalePriceFields();

    if (message) message.textContent = "Listing published in this browser demo.";
    activeCategory = "all";
    activeSaleFilter = "all";
    activeLocation = "all";
    activeSearch = "";

    resetFilters();
    closeModal("listingModal");
    showToast("Your product has been listed!");

    $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* =========================================================
   SHOPPING CART
   ========================================================= */

function getCartListing(id) {
  return listings.find(item => String(item.id) === String(id));
}

function getCartUnitPrice(listing, saleMode = "retail") {
  if (!listing) return null;

  if (saleMode === "bulk") {
    return listing.bulkPrice ?? listing.retailPrice ?? null;
  }

  return listing.retailPrice ?? listing.bulkPrice ?? null;
}

function addToCart(id) {
  const listing = getCartListing(id);
  if (!listing) {
    showToast("Product not found.");
    return;
  }

  const availablePrice = getCartUnitPrice(listing);
  if (availablePrice === null) {
    showToast("Contact the seller for pricing before ordering.");
    contactSeller(id);
    return;
  }

  const existing = cart.find(item =>
    String(item.id) === String(id) && item.saleMode === "retail"
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: listing.id,
      quantity: 1,
      saleMode: "retail"
    });
  }

  saveJSON(MAVUNO.cartKey, cart);
  renderCart();
  showToast("Added to cart.");
}

function changeCartQuantity(id, saleMode, amount) {
  const item = cart.find(entry =>
    String(entry.id) === String(id) && entry.saleMode === saleMode
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry !== item);
  }

  saveJSON(MAVUNO.cartKey, cart);
  renderCart();
}

function removeCartItem(id, saleMode) {
  cart = cart.filter(item =>
    !(String(item.id) === String(id) && item.saleMode === saleMode)
  );

  saveJSON(MAVUNO.cartKey, cart);
  renderCart();
  showToast("Item removed.");
}

function renderCart() {
  const container = $("#cartItems");
  const empty = $("#cartEmpty");
  const summary = $("#cartSummary");
  const count = $("#cartCount");
  const subtotalElement = $("#cartSubtotal");
  const totalElement = $("#cartItemTotal");

  if (!container) return;

  container.replaceChildren();

  cart = cart.filter(item => getCartListing(item.id) && Number(item.quantity) > 0);

  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach(item => {
    const listing = getCartListing(item.id);
    if (!listing) return;

    const mode = item.saleMode || "retail";
    const price = getCartUnitPrice(listing, mode);
    const unit = mode === "bulk" ? listing.bulkUnit : listing.retailUnit;

    if (price !== null) subtotal += price * item.quantity;
    totalQuantity += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item-details">
        <h3>${escapeHTML(listing.name)}</h3>
        <p>${escapeHTML(listing.location)} · ${escapeHTML(formatSaleType(listing.saleType))}</p>
        <p>${escapeHTML(money(price))}/${escapeHTML(unit || "unit")}</p>
        <div class="cart-quantity-controls">
          <button type="button" data-cart-minus="${escapeHTML(listing.id)}" data-cart-mode="${escapeHTML(mode)}" aria-label="Decrease quantity">−</button>
          <span>${formatQuantity(item.quantity)}</span>
          <button type="button" data-cart-plus="${escapeHTML(listing.id)}" data-cart-mode="${escapeHTML(mode)}" aria-label="Increase quantity">+</button>
          <button type="button" class="cart-remove" data-cart-remove="${escapeHTML(listing.id)}" data-cart-mode="${escapeHTML(mode)}">Remove</button>
        </div>
      </div>`;

    container.appendChild(row);
  });

  if (count) count.textContent = String(totalQuantity);

  const isEmpty = cart.length === 0;
  empty?.classList.toggle("hidden", !isEmpty);
  summary?.classList.toggle("hidden", isEmpty);

  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (totalElement) {
    totalElement.textContent = `${totalQuantity} item${totalQuantity === 1 ? "" : "s"} · subtotal excludes delivery`;
  }

  saveJSON(MAVUNO.cartKey, cart);
}

function setupCart() {
  $("#cartItems")?.addEventListener("click", event => {
    const plus = event.target.closest("[data-cart-plus]");
    const minus = event.target.closest("[data-cart-minus]");
    const remove = event.target.closest("[data-cart-remove]");

    if (plus) {
      changeCartQuantity(plus.dataset.cartPlus, plus.dataset.cartMode, 1);
    }

    if (minus) {
      changeCartQuantity(minus.dataset.cartMinus, minus.dataset.cartMode, -1);
    }

    if (remove) {
      removeCartItem(remove.dataset.cartRemove, remove.dataset.cartMode);
    }
  });

  $("#checkoutButton")?.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    const lines = cart.map(item => {
      const listing = getCartListing(item.id);
      if (!listing) return "";

      const mode = item.saleMode || "retail";
      const price = getCartUnitPrice(listing, mode);
      const unit = mode === "bulk" ? listing.bulkUnit : listing.retailUnit;

      return `${listing.name} x ${item.quantity} — ${money(price)}/${unit || "unit"}; seller: ${listing.seller}`;
    }).filter(Boolean);

    const message = [
      "Hello, I am interested in ordering these products through MavunoBridge:",
      "",
      ...lines,
      "",
      "Please confirm availability, exact units, delivery/collection and final price. This is a demo order enquiry."
    ].join("\n");

    const firstListing = getCartListing(cart[0]?.id);

    if (firstListing && window.ChatStore && typeof window.ChatStore.startConversation === "function") {
      try {
        window.ChatStore.startConversation(firstListing, message);
        closeModal("cartModal");
        showToast("Order enquiry prepared in messages.");
        return;
      } catch (error) {
        console.warn("Chat integration unavailable:", error);
      }
    }

    const messagesPage = `messages.html?draft=${encodeURIComponent(message)}`;
    window.location.href = messagesPage;
  });
}

/* =========================================================
   CONTACT SELLER
   ========================================================= */

function contactSeller(id) {
  const listing = getCartListing(id);
  if (!listing) return;

  const text = `Hello ${listing.seller}, I found your listing "${listing.name}" on MavunoBridge. Is it still available? Please confirm the price, quantity and collection/delivery details.`;

  if (window.ChatStore && typeof window.ChatStore.startConversation === "function") {
    try {
      window.ChatStore.startConversation(listing, text);
      return;
    } catch (error) {
      console.warn("Chat integration unavailable:", error);
    }
  }

  if (listing.phone) {
    const phone = listing.phone.replace(/[^\d+]/g, "");
    const whatsappNumber = phone.replace(/^\+/, "");

    const confirmed = window.confirm(
      `Seller: ${listing.seller}\nPhone: ${listing.phone}\n\nOK = open WhatsApp with a message, Cancel = stay here.`
    );

    if (confirmed) {
      const url = `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } else {
    showToast("Seller contact details are not available.");
  }
}

/* =========================================================
   DEMO LOGIN
   ========================================================= */

function setupDemoLogin() {
  $("#loginForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const message = $("#loginMessage");
    const email = ($("#loginEmail")?.value || "").trim();

    if (!email) {
      if (message) message.textContent = "Please enter an email address.";
      return;
    }

    if (message) {
      message.textContent =
        "Demo access only. No real account was created and no password was saved.";
    }

    closeModal("loginModal");
    showToast("Welcome to the MavunoBridge demo!");
  });
}

/* =========================================================
   LANGUAGE SELECTOR
   ========================================================= */

const TRANSLATIONS = {
  en: {
    login: "Login",
    marketplace: "Marketplace",
    smart: "Smart Assist",
    sacco: "SACCO Hub",
    messages: "Messages",
    explore: "Explore marketplace",
    sell: "List a product",
    discover: "Discover the marketplace",
    search: "Search"
  },
  sw: {
    login: "Ingia",
    marketplace: "Soko",
    smart: "Msaidizi wa Kilimo",
    sacco: "SACCO Hub",
    messages: "Ujumbe",
    explore: "Angalia soko",
    sell: "Weka bidhaa",
    discover: "Gundua soko",
    search: "Tafuta"
  },
  sheng: {
    login: "Ingia",
    marketplace: "Soko",
    smart: "Smart Assist",
    sacco: "SACCO Hub",
    messages: "Messages",
    explore: "Check soko",
    sell: "List product",
    discover: "Check marketplace",
    search: "Tafuta"
  }
};

function applyLanguage(language) {
  activeLanguage = TRANSLATIONS[language] ? language : "en";

  const select = $("#languageSelect");
  if (select) select.value = activeLanguage;

  localStorage.setItem(MAVUNO.languageKey, activeLanguage);

  const words = TRANSLATIONS[activeLanguage];

  const loginButton = $("#loginButton");
  if (loginButton) loginButton.textContent = words.login;

  const sellButton = $("#sellButton");
  if (sellButton) sellButton.textContent = "+ " + words.sell;

  const heroSellButton = $("#heroSellButton");
  if (heroSellButton) heroSellButton.textContent = "+ " + words.sell;

  const exploreLink = $(".hero-actions a");
  if (exploreLink) exploreLink.textContent = words.explore;

  const marketplaceTitle = $("#marketplace .section-heading h2");
  if (marketplaceTitle) marketplaceTitle.textContent = words.discover;

  const searchButton = $(".search-button");
  if (searchButton) searchButton.textContent = words.search;
}

function setupLanguageSelector() {
  $("#languageSelect")?.addEventListener("change", event => {
    applyLanguage(event.target.value);
    showToast("Language preference saved.");
  });

  applyLanguage(activeLanguage);
}

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setupMobileMenu() {
  const button = $("#menuToggle");
  const nav = $("#mobileNav");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isHidden = nav.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!isHidden));
    button.setAttribute("aria-label", isHidden ? "Open navigation menu" : "Close navigation menu");
    button.textContent = isHidden ? "☰" : "✕";
  });

  $$("a", nav).forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      button.textContent = "☰";
    });
  });
}

/* =========================================================
   COUNTY FARMING TIPS
   These are general tips, NOT live weather forecasts.
   ========================================================= */

const COUNTY_TIPS = {
  "Kiambu": "Consider crops suited to your altitude and soil. Check seed quality, drainage and local disease alerts before planting.",
  "Nakuru": "Plan crop rotation and soil management. Check local rainfall forecasts before scheduling planting or irrigation.",
  "Meru": "Choose crop varieties suited to your elevation and rainfall. Monitor crops regularly for pests and disease.",
  "Machakos": "Water conservation can help in dry periods. Consider mulching, water harvesting and crops suited to local conditions.",
  "Kisumu": "Check drainage and local flood advisories where relevant. Use suitable crop varieties and monitor crop health.",
  "Uasin Gishu": "Plan seed and soil preparation ahead of planting. Check local rainfall and market demand before committing to large volumes.",
  "Nyandarua": "Consider the local cool conditions when choosing varieties. Monitor crop diseases and store harvested produce properly.",
  "Makueni": "Water harvesting, mulching and soil moisture conservation may be useful. Match planting plans to local rainfall.",
  "Kakamega": "Manage soil fertility and drainage. Inspect crops frequently and seek local advice when pests or diseases appear.",
  "Embu": "Choose varieties suited to your location and season. Check rainfall guidance and maintain soil fertility."
};

function setupCountyInsights() {
  const button = $("#getInsightButton");
  const countySelect = $("#countySelect");
  const output = $("#insightMessage");

  if (!button || !countySelect || !output) return;

  button.addEventListener("click", () => {
    const county = countySelect.value;
    const tip = COUNTY_TIPS[county] ||
      "Check local rainfall guidance, soil conditions and crop advisories before planting. Ask a local agricultural extension officer for county-specific advice.";

    output.textContent = `${county}: ${tip} These are general tips, not a live weather forecast.`;
  });
}

/* =========================================================
   FOOTER AND INITIAL STARTUP
   ========================================================= */

function setupFooter() {
  const year = $("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupGlobalImageFallbacks() {
  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    }, { once: true });
  });
}

function startMavunoBridge() {
  initialiseStorage();

  setupModals();
  setupMarketplaceFilters();
  setupListingForm();
  setupCart();
  setupDemoLogin();
  setupLanguageSelector();
  setupMobileMenu();
  setupCountyInsights();
  setupFooter();
  setupGlobalImageFallbacks();

  renderListings();
  renderCart();

  console.info("MavunoBridge demo is ready.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startMavunoBridge);
} else {
  startMavunoBridge();
}
