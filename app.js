
/* ==========================================================
   SHAMBAMARKET — COMPLETE DEMO APPLICATION
   Version: 2.0
   Storage: Browser localStorage only
   No Firebase. No Supabase. No real payments.
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------
     1. CONFIGURATION
     -------------------------------------------------------- */

  const KEYS = {
    products: "shambamarket_products_v2",
    cart: "shambamarket_cart_v2",
    favourites: "shambamarket_favourites_v2",
    profile: "shambamarket_profile_v2",
    settings: "shambamarket_settings_v2",
    requests: "shambamarket_requests_v2",
    groups: "shambamarket_groups_v2",
    feedback: "shambamarket_feedback_v2",
    orders: "shambamarket_orders_v2",
    tutorial: "shambamarket_tutorial_v2"
  };

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const CATEGORY_NAMES = {
    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchy: "Starchy foods",
    grains: "Grains",
    legumes: "Legumes",
    livestock: "Livestock",
    "farm-inputs": "Farm inputs"
  };

  const CATEGORY_EMOJIS = {
    fruits: "🥭",
    vegetables: "🥬",
    nuts: "🥜",
    starchy: "🥔",
    grains: "🌽",
    legumes: "🫘",
    livestock: "🐄",
    "farm-inputs": "🌱"
  };

  const UNIT_NAMES = {
    kg: "kg",
    piece: "piece",
    crate: "crate",
    bag: "bag",
    bunch: "bunch",
    litre: "litre",
    tray: "tray",
    animal: "animal",
    sack: "sack",
    packet: "packet",
    other: "unit"
  };

  /*
   * Illustrative comparison prices for the science fair demo.
   * These are NOT verified Kenyan market prices.
   * Change them only when you have reliable, comparable data.
   */
  const DEMO_REFERENCES = {
    avocado: { kg: 100, piece: 25 },
    mango: { kg: 100, piece: 30 },
    banana: { kg: 80, bunch: 100 },
    tomato: { kg: 100, crate: 1800 },
    onion: { kg: 100, bag: 2500 },
    potato: { kg: 80, bag: 2500 },
    maize: { kg: 60, bag: 3000 },
    beans: { kg: 150, bag: 6000 },
    groundnut: { kg: 180 },
    chicken: { animal: 900 },
    eggs: { tray: 450 },
    spinach: { bunch: 30 },
    cabbage: { piece: 70 },
    sukuma: { bunch: 30 },
    milk: { litre: 70 },
    default: {
      kg: 100,
      piece: 50,
      crate: 1500,
      bag: 3000,
      bunch: 40,
      litre: 80,
      tray: 450,
      animal: 1000,
      sack: 2500,
      packet: 100,
      other: 100
    }
  };

  const SEED_PRODUCTS = [
    {
      id: "demo-avocado-1",
      name: "Fresh Hass Avocados",
      variety: "Hass",
      category: "fruits",
      condition: "fresh",
      price: 120,
      quantity: 80,
      unit: "kg",
      location: "Murang'a",
      contact: "Demo seller",
      harvestDate: "",
      description: "Fresh avocados from a sample farm listing. Ask the seller about ripeness and collection.",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Green Valley Farm",
      createdAt: "2026-10-22T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-tomato-1",
      name: "Farm Fresh Tomatoes",
      variety: "Regular",
      category: "vegetables",
      condition: "ripe",
      price: 150,
      quantity: 40,
      unit: "kg",
      location: "Nakuru",
      contact: "Demo seller",
      harvestDate: "",
      description: "Ripe tomatoes available in this demonstration listing. Check quality and price before arranging a purchase.",
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: true,
      seller: "Nakuru Fresh Produce",
      createdAt: "2026-10-22T08:00:00.000Z",
      demo: true
    },
    {
      id: "demo-mango-1",
      name: "Sweet Mangoes",
      variety: "Mixed varieties",
      category: "fruits",
      condition: "ripe",
      price: 90,
      quantity: 60,
      unit: "kg",
      location: "Makueni",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample mango listing. Ask about variety, ripeness and available quantity.",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: true,
      seller: "Makueni Fruit Growers",
      createdAt: "2026-10-21T11:00:00.000Z",
      demo: true
    },
    {
      id: "demo-maize-1",
      name: "Dry Maize",
      variety: "White maize",
      category: "grains",
      condition: "good",
      price: 65,
      quantity: 120,
      unit: "kg",
      location: "Trans Nzoia",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample dry maize listing. Confirm moisture condition, quantity and collection arrangements.",
      image: "https://images.unsplash.com/photo-1601593768792-5e1e4f0f7c8d?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "North Rift Grain Farm",
      createdAt: "2026-10-21T10:00:00.000Z",
      demo: true
    },
    {
      id: "demo-beans-1",
      name: "Dry Beans",
      variety: "Mixed beans",
      category: "legumes",
      condition: "good",
      price: 140,
      quantity: 75,
      unit: "kg",
      location: "Embu",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample dry beans listing. Confirm variety, cleanliness and packaging with the seller.",
      image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Embu Harvest Co.",
      createdAt: "2026-10-20T12:00:00.000Z",
      demo: true
    },
    {
      id: "demo-potatoes-1",
      name: "Irish Potatoes",
      variety: "Mixed sizes",
      category: "starchy",
      condition: "good",
      price: 75,
      quantity: 90,
      unit: "kg",
      location: "Nyandarua",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample potato listing. Ask about size grading, quantity and collection.",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Highland Roots",
      createdAt: "2026-10-20T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-onions-1",
      name: "Red Onions",
      variety: "Red",
      category: "vegetables",
      condition: "good",
      price: 110,
      quantity: 50,
      unit: "kg",
      location: "Kajiado",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample red onion listing. Check size, dryness and storage condition.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Kajiado Produce",
      createdAt: "2026-10-19T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-peanuts-1",
      name: "Groundnuts",
      variety: "Dry groundnuts",
      category: "nuts",
      condition: "good",
      price: 180,
      quantity: 30,
      unit: "kg",
      location: "Busia",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample groundnut listing. Confirm whether the product is shelled and how it is packaged.",
      image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Western Nut Growers",
      createdAt: "2026-10-18T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-spinach-1",
      name: "Fresh Spinach",
      variety: "Leafy greens",
      category: "vegetables",
      condition: "fresh",
      price: 30,
      quantity: 45,
      unit: "bunch",
      location: "Kiambu",
      contact: "Demo seller",
      harvestDate: "",
      description: "Fresh leafy greens in a sample listing. Confirm freshness and bunch size.",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
      negotiable: false,
      harvestRescue: false,
      seller: "Kiambu Green Gardens",
      createdAt: "2026-10-17T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-bananas-1",
      name: "Ripe Bananas",
      variety: "Sweet bananas",
      category: "fruits",
      condition: "ripe",
      price: 85,
      quantity: 35,
      unit: "kg",
      location: "Kisii",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample ripe banana listing. Check ripeness and quantity with the seller.",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: true,
      seller: "Kisii Banana Growers",
      createdAt: "2026-10-16T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-cabbage-1",
      name: "Fresh Cabbages",
      variety: "Green cabbage",
      category: "vegetables",
      condition: "fresh",
      price: 65,
      quantity: 50,
      unit: "piece",
      location: "Nakuru",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample cabbage listing. Ask about head size and the number available.",
      image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Rift Fresh Farms",
      createdAt: "2026-10-15T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-eggs-1",
      name: "Farm Eggs",
      variety: "Chicken eggs",
      category: "livestock",
      condition: "good",
      price: 450,
      quantity: 20,
      unit: "tray",
      location: "Kiambu",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample egg listing. Confirm egg size, tray count and safe collection.",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Happy Hen Demo Farm",
      createdAt: "2026-10-14T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-milk-1",
      name: "Fresh Milk",
      variety: "Cow milk",
      category: "livestock",
      condition: "fresh",
      price: 70,
      quantity: 40,
      unit: "litre",
      location: "Nyeri",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample milk listing. Confirm safe handling, storage and collection arrangements.",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
      negotiable: false,
      harvestRescue: false,
      seller: "Nyeri Dairy Demo",
      createdAt: "2026-10-13T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-fertilizer-1",
      name: "Farm Fertilizer",
      variety: "Demo farm input",
      category: "farm-inputs",
      condition: "good",
      price: 2500,
      quantity: 10,
      unit: "bag",
      location: "Nairobi",
      contact: "Demo seller",
      harvestDate: "",
      description: "Illustrative farm-input listing. Check the product label, supplier and suitability before purchasing.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      negotiable: false,
      harvestRescue: false,
      seller: "Agri Supplies Demo",
      createdAt: "2026-10-12T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-chicken-1",
      name: "Local Chicken",
      variety: "Indigenous chicken",
      category: "livestock",
      condition: "good",
      price: 900,
      quantity: 8,
      unit: "animal",
      location: "Machakos",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample livestock listing. Contact the seller to confirm details, welfare and collection requirements.",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Machakos Poultry Demo",
      createdAt: "2026-10-11T09:00:00.000Z",
      demo: true
    },
    {
      id: "demo-sweetpotato-1",
      name: "Sweet Potatoes",
      variety: "Mixed sizes",
      category: "starchy",
      condition: "good",
      price: 70,
      quantity: 60,
      unit: "kg",
      location: "Homa Bay",
      contact: "Demo seller",
      harvestDate: "",
      description: "Sample sweet potato listing. Confirm size, variety and available quantity.",
      image: "https://images.unsplash.com/photo-1596097635121-14b63a7a0e77?auto=format&fit=crop&w=800&q=80",
      negotiable: true,
      harvestRescue: false,
      seller: "Lake Region Roots",
      createdAt: "2026-10-10T09:00:00.000Z",
      demo: true
    }
  ];

  /* --------------------------------------------------------
     2. SAFE STORAGE AND GENERAL HELPERS
     -------------------------------------------------------- */

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;

      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (error) {
      console.warn("Could not read local demo data:", key, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Could not save demo data:", error);
      toast("Your browser could not save this change. Check available storage.");
      return false;
    }
  }

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
    try {
      const url = new URL(String(value || ""));
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function makeId(prefix = "item") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function money(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "KSh 0";

    return "KSh " + amount.toLocaleString("en-KE", {
      minimumFractionDigits: amount % 1 ? 2 : 0,
      maximumFractionDigits: 2
    });
  }

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function normaliseProduct(product) {
    return {
      ...product,
      id: String(product.id || makeId("product")),
      name: String(product.name || "Unnamed product"),
      variety: String(product.variety || ""),
      category: CATEGORY_NAMES[product.category] ? product.category : "farm-inputs",
      condition: String(product.condition || "good"),
      price: Math.max(0, Number(product.price) || 0),
      quantity: Math.max(0, Number(product.quantity) || 0),
      unit: UNIT_NAMES[product.unit] ? product.unit : "other",
      location: String(product.location || "Location not provided"),
      contact: String(product.contact || ""),
      harvestDate: String(product.harvestDate || ""),
      description: String(product.description || ""),
      image: safeImageURL(product.image),
      negotiable: Boolean(product.negotiable),
      harvestRescue: Boolean(product.harvestRescue),
      seller: String(product.seller || "Community seller"),
      createdAt: product.createdAt || new Date().toISOString(),
      demo: Boolean(product.demo)
    };
  }

  /* --------------------------------------------------------
     3. APP STATE
     -------------------------------------------------------- */

  let products = readStorage(KEYS.products, null);

  if (!Array.isArray(products) || products.length === 0) {
    products = SEED_PRODUCTS.map(normaliseProduct);
    writeStorage(KEYS.products, products);
  } else {
    products = products.map(normaliseProduct);
  }

  let cart = readStorage(KEYS.cart, []);
  if (!Array.isArray(cart)) cart = [];

  cart = cart
    .filter(item => item && typeof item.productId === "string")
    .map(item => ({
      productId: item.productId,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));

  let favourites = readStorage(KEYS.favourites, []);
  if (!Array.isArray(favourites)) favourites = [];

  let profile = readStorage(KEYS.profile, {
    name: "",
    role: "buyer"
  });

  let settings = readStorage(KEYS.settings, {
    language: "en"
  });

  let activeCategory = "all";
  let favouritesOnly = false;
  let harvestOnly = false;
  let searchTerm = "";
  let locationTerm = "";
  let tutorialStep = 0;
  let editingProductId = null;

  const tutorialSteps = [
    {
      icon: "🌱",
      label: "WELCOME",
      title: "Welcome to ShambaMarket",
      description: "Explore a demo marketplace designed to connect farmers and buyers."
    },
    {
      icon: "🧺",
      label: "DISCOVER",
      title: "Find what you need",
      description: "Search listings, choose categories, compare demo prices and save favourites."
    },
    {
      icon: "🛒",
      label: "SHOP",
      title: "Build your basket",
      description: "Add products, change quantities and create a demo order summary. No payment is collected."
    },
    {
      icon: "🤝",
      label: "EXPLORE",
      title: "Try the farmer tools",
      description: "Visit Smart Assist and SACCO Hub, or try Harvest Rescue and Buyer Requests."
    }
  ];

  /* --------------------------------------------------------
     4. NOTIFICATIONS AND MODALS
     -------------------------------------------------------- */

  function toast(message) {
    const container = $("#toastContainer");

    if (!container) {
      console.info(message);
      return;
    }

    const item = document.createElement("div");
    item.className = "toast";
    item.setAttribute("role", "status");
    item.textContent = message;

    container.appendChild(item);

    window.setTimeout(() => {
      item.classList.add("toast-leaving");
      window.setTimeout(() => item.remove(), 250);
    }, 3200);
  }

  function announce(message) {
    const region = $("#appStatus");
    if (region) region.textContent = message;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) {
      toast("That feature is not available on this page yet.");
      return;
    }

    $$(".modal.is-open").forEach(other => {
      if (other !== modal) closeModalElement(other);
    });

    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    const firstInput = $("input:not([type=hidden]), select, textarea, button", modal);
    if (firstInput) {
      window.setTimeout(() => firstInput.focus(), 30);
    }
  }

  function closeModalElement(modal) {
    modal.classList.remove("is-open");
    modal.hidden = true;

    if (!$(".modal.is-open")) {
      document.body.classList.remove("modal-open");
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) closeModalElement(modal);
  }

  document.addEventListener("click", event => {
    const closeTarget = event.target.closest("[data-close-modal]");
    if (!closeTarget) return;

    const modal = closeTarget.closest(".modal");
    if (modal) closeModalElement(modal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const modal = $(".modal.is-open");
      if (modal) closeModalElement(modal);
    }
  });

  /* --------------------------------------------------------
     5. DEMO PRICE GUARD
     -------------------------------------------------------- */

  function referencePrice(product) {
    const text = `${product.name} ${product.variety}`.toLowerCase();

    const matches = [
      ["avocado", "avocado"],
      ["mango", "mango"],
      ["banana", "banana"],
      ["tomato", "tomato"],
      ["onion", "onion"],
      ["potato", "potato"],
      ["maize", "maize"],
      ["beans", "beans"],
      ["groundnut", "groundnut"],
      ["peanut", "groundnut"],
      ["chicken", "chicken"],
      ["egg", "eggs"],
      ["spinach", "spinach"],
      ["sukuma", "sukuma"],
      ["cabbage", "cabbage"],
      ["milk", "milk"]
    ];

    let key = "default";

    for (const [needle, result] of matches) {
      if (text.includes(needle)) {
        key = result;
        break;
      }
    }

    const categoryDefaults = {
      fruits: "kg",
      vegetables: "kg",
      nuts: "kg",
      starchy: "kg",
      grains: "kg",
      legumes: "kg",
      livestock: "animal",
      "farm-inputs": "bag"
    };

    const referenceSet = DEMO_REFERENCES[key] || DEMO_REFERENCES.default;
    const unit = product.unit;
    let price = referenceSet[unit];

    if (price === undefined && referenceSet.kg !== undefined && unit === "other") {
      price = referenceSet.kg;
    }

    if (price === undefined) {
      const fallback = DEMO_REFERENCES.default;
      price = fallback[unit];

      if (price === undefined) {
        price = fallback[categoryDefaults[product.category]] || 100;
      }
    }

    return Number(price);
  }

  function priceComparison(product) {
    const reference = referencePrice(product);
    const price = Number(product.price);

    if (!reference || !Number.isFinite(price)) {
      return {
        reference,
        difference: 0,
        percentage: 0,
        status: "unavailable",
        label: "No comparison available"
      };
    }

    const percentage = ((price - reference) / reference) * 100;

    if (percentage >= 30) {
      return {
        reference,
        difference: price - reference,
        percentage,
        status: "high",
        label: "Above demo reference"
      };
    }

    if (percentage <= -15) {
      return {
        reference,
        difference: price - reference,
        percentage,
        status: "low",
        label: "Below demo reference"
      };
    }

    return {
      reference,
      difference: price - reference,
      percentage,
      status: "near",
      label: "Near demo reference"
    };
  }

  function renderListingPricePreview() {
    const preview = $("#listingPricePreview");
    const name = $("#productName")?.value.trim();
    const category = $("#productCategory")?.value;
    const price = Number($("#productPrice")?.value);
    const unit = $("#productUnit")?.value || "kg";

    if (!preview) return;

    if (!name || !category || !Number.isFinite(price) || price <= 0) {
      preview.className = "price-check-preview";
      preview.textContent =
        "Enter a product name, category and price to see the demo price comparison.";
      return;
    }

    const comparison = priceComparison({
      name,
      category,
      price,
      unit,
      variety: ""
    });

    const statusText = {
      high: "⚠️ This asking price is 30% or more above the demo reference.",
      low: "ℹ️ This asking price is below the demo reference.",
      near: "✓ This asking price is near the demo reference.",
      unavailable: "A comparable demo reference is not available."
    };

    preview.className = `price-check-preview price-${comparison.status}`;
    preview.textContent =
      `${statusText[comparison.status]} Demo reference: ${money(comparison.reference)} per ${UNIT_NAMES[unit] || unit}. These sample values are not live market prices. You may still choose your own asking price.`;
  }

  [
    "#productName",
    "#productCategory",
    "#productPrice",
    "#productUnit"
  ].forEach(selector => {
    const element = $(selector);
    if (element) {
      element.addEventListener("input", renderListingPricePreview);
      element.addEventListener("change", renderListingPricePreview);
    }
  });

  /* --------------------------------------------------------
     6. PRODUCT RENDERING
     -------------------------------------------------------- */

  function productImageMarkup(product) {
    const url = safeImageURL(product.image);
    const fallback = CATEGORY_EMOJIS[product.category] || "🌱";

    if (!url) {
      return `<div class="product-placeholder" aria-label="No product image">
        <span>${fallback}</span>
      </div>`;
    }

    return `<img class="product-photo"
      src="${escapeHTML(url)}"
      alt="${escapeHTML(product.name)}"
      loading="lazy"
      onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <div class="product-placeholder" hidden>
        <span>${fallback}</span>
      </div>`;
  }

  function productCard(product) {
    const comparison = priceComparison(product);
    const isFavourite = favourites.includes(product.id);
    const inCart = cart.find(item => item.productId === product.id);
    const soldOut = product.quantity <= 0;
    const condition = product.condition
      .replace(/-/g, " ")
      .replace(/\b\w/g, character => character.toUpperCase());

    let priceStatus = "";
    if (comparison.status === "high") {
      priceStatus = `<span class="price-status price-status-high">⚠ Above demo reference</span>`;
    } else if (comparison.status === "low") {
      priceStatus = `<span class="price-status price-status-low">↓ Below demo reference</span>`;
    } else if (comparison.status === "near") {
      priceStatus = `<span class="price-status price-status-near">✓ Near demo reference</span>`;
    }

    const harvestBadge = product.harvestRescue
      ? `<span class="product-badge harvest-badge">♻ Harvest Rescue</span>`
      : "";

    const demoBadge = product.demo
      ? `<span class="product-badge demo-badge">Demo listing</span>`
      : "";

    const dateLine = product.harvestDate
      ? `<p class="product-meta">📅 Harvested: ${escapeHTML(formatDate(product.harvestDate))}</p>`
      : "";

    return `
      <article class="product-card" data-product-id="${escapeHTML(product.id)}">
        <div class="product-card-media">
          ${productImageMarkup(product)}
          <div class="product-badges">
            ${harvestBadge}
            ${demoBadge}
          </div>
          <button
            class="favourite-button ${isFavourite ? "is-favourite" : ""}"
            type="button"
            data-action="favourite"
            data-id="${escapeHTML(product.id)}"
            aria-label="${isFavourite ? "Remove from favourites" : "Add to favourites"}"
            aria-pressed="${isFavourite}"
            title="${isFavourite ? "Remove favourite" : "Save favourite"}">
            ${isFavourite ? "♥" : "♡"}
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-title-row">
            <span class="product-category-label">
              ${escapeHTML(CATEGORY_NAMES[product.category] || "Farm products")}
            </span>
          </div>

          <h3 class="product-title">${escapeHTML(product.name)}</h3>

          ${product.variety
            ? `<p class="product-variety">${escapeHTML(product.variety)}</p>`
            : ""}

          <div class="product-price">
            ${money(product.price)}
            <span>/ ${escapeHTML(UNIT_NAMES[product.unit] || product.unit)}</span>
          </div>

          ${priceStatus}

          <div class="product-meta-list">
            <p class="product-meta">📍 ${escapeHTML(product.location)}</p>
            <p class="product-meta">🍃 Condition: ${escapeHTML(condition)}</p>
            <p class="product-meta">📦 Available: ${escapeHTML(product.quantity)} ${escapeHTML(UNIT_NAMES[product.unit] || product.unit)}</p>
            ${dateLine}
          </div>

          <p class="product-description">${escapeHTML(product.description)}</p>

          <div class="freshness-mini">
            <span>🧾 Freshness Passport</span>
            <span>${product.harvestDate ? "Harvest date provided" : "Condition reported by seller"}</span>
          </div>

          <p class="seller-label">Seller: ${escapeHTML(product.seller)}</p>

          <div class="product-card-footer">
            <button
              class="button button-primary product-add-cart"
              type="button"
              data-action="add-cart"
              data-id="${escapeHTML(product.id)}"
              ${soldOut ? "disabled" : ""}>
              ${soldOut ? "Unavailable" : inCart ? `🛒 Add more (${inCart.quantity})` : "🛒 Add to cart"}
            </button>
            <button
              class="button button-outline product-contact-btn"
              type="button"
              data-action="contact"
              data-id="${escapeHTML(product.id)}">
              Contact
            </button>
          </div>
        </div>
      </article>`;
  }

  function getFilteredProducts() {
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter(product => product.category === activeCategory);
    }

    if (favouritesOnly) {
      result = result.filter(product => favourites.includes(product.id));
    }

    if (harvestOnly) {
      result = result.filter(product => product.harvestRescue);
    }

    if (searchTerm) {
      result = result.filter(product => {
        const searchable = [
          product.name,
          product.variety,
          product.description,
          product.seller,
          CATEGORY_NAMES[product.category]
        ].join(" ").toLowerCase();

        return searchable.includes(searchTerm);
      });
    }

    if (locationTerm) {
      result = result.filter(product =>
        product.location.toLowerCase().includes(locationTerm)
      );
    }

    const sort = $("#sortSelect")?.value || "recommended";

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result.sort((a, b) =>
        Number(b.harvestRescue) - Number(a.harvestRescue)
      );
    }

    return result;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">🔎</span>
          <h3>No matching products found</h3>
          <p>Try another search, choose a different category or clear your filters.</p>
          <button class="button button-primary" type="button" data-action="clear-filters">
            Show all products
          </button>
        </div>`;
    } else {
      grid.innerHTML = filtered.map(productCard).join("");
    }

    const count = $("#resultsCount");
    if (count) {
      count.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;
    }

    const heading = $("#listingHeading");
    if (heading) {
      if (harvestOnly) heading.textContent = "Harvest Rescue offers";
      else if (favouritesOnly) heading.textContent = "Your favourite products";
      else if (activeCategory !== "all") {
        heading.textContent = CATEGORY_NAMES[activeCategory] || "Products";
      } else {
        heading.textContent = "Fresh finds for you";
      }
    }

    const favouriteButton = $("#favoritesFilterBtn");
    if (favouriteButton) {
      favouriteButton.classList.toggle("is-active", favouritesOnly);
      favouriteButton.setAttribute("aria-pressed", String(favouritesOnly));
    }

    const rescueButton = $("#harvestRescueBtn");
    if (rescueButton) {
      rescueButton.textContent = harvestOnly
        ? "Show all products ↑"
        : "Explore rescue offers →";
    }

    updateStats();
  }

  function updateStats() {
    const listings = $("#statListings");
    const categories = $("#statCategories");

    if (listings) listings.textContent = String(products.length);
    if (categories) {
      categories.textContent = String(Object.keys(CATEGORY_NAMES).length);
    }

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* --------------------------------------------------------
     7. SEARCH AND FILTERS
     -------------------------------------------------------- */

  const searchForm = $("#searchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      searchTerm = ($("#searchInput")?.value || "").trim().toLowerCase();
      locationTerm = ($("#locationInput")?.value || "").trim().toLowerCase();
      renderProducts();
    });
  }

  $("#searchInput")?.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  $("#locationInput")?.addEventListener("input", event => {
    locationTerm = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  $("#sortSelect")?.addEventListener("change", renderProducts);

  $("#categoryGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category || "all";
    favouritesOnly = false;
    harvestOnly = false;

    $$("#categoryGrid [data-category]").forEach(item => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });

    renderProducts();
  });

  $("#clearFiltersBtn")?.addEventListener("click", () => {
    searchTerm = "";
    locationTerm = "";
    activeCategory = "all";
    favouritesOnly = false;
    harvestOnly = false;

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#locationInput")) $("#locationInput").value = "";
    if ($("#sortSelect")) $("#sortSelect").value = "recommended";

    $$("#categoryGrid [data-category]").forEach(button => {
      const active = button.dataset.category === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    renderProducts();
  });

  $("#favoritesFilterBtn")?.addEventListener("click", () => {
    favouritesOnly = !favouritesOnly;
    harvestOnly = false;
    renderProducts();
  });

  $("#featureFavoritesBtn")?.addEventListener("click", () => {
    favouritesOnly = true;
    harvestOnly = false;
    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
    renderProducts();
  });

  /* --------------------------------------------------------
     8. PRODUCT ACTIONS AND FAVOURITES
     -------------------------------------------------------- */

  function saveProducts() {
    writeStorage(KEYS.products, products);
  }

  function saveCart() {
    writeStorage(KEYS.cart, cart);
  }

  function saveFavourites() {
    writeStorage(KEYS.favourites, favourites);
  }

  function getProduct(id) {
    return products.find(product => product.id === id);
  }

  function toggleFavourite(id) {
    if (!getProduct(id)) return;

    if (favourites.includes(id)) {
      favourites = favourites.filter(item => item !== id);
      toast("Removed from favourites.");
    } else {
      favourites.push(id);
      toast("Added to favourites.");
    }

    saveFavourites();
    renderProducts();
  }

  function addToCart(id) {
    const product = getProduct(id);
    if (!product) {
      toast("That product could not be found.");
      return;
    }

    if (product.quantity <= 0) {
      toast("This listing is currently unavailable.");
      return;
    }

    const existing = cart.find(item => item.productId === id);
    const nextQuantity = (existing?.quantity || 0) + 1;

    if (nextQuantity > product.quantity) {
      toast(`Only ${product.quantity} ${UNIT_NAMES[product.unit] || product.unit} available in this listing.`);
      return;
    }

    if (existing) existing.quantity = nextQuantity;
    else cart.push({ productId: id, quantity: 1 });

    saveCart();
    renderCart();
    renderProducts();
    toast(`${product.name} added to your cart.`);
  }

  function contactSeller(id) {
    const product = getProduct(id);
    if (!product) return;

    if (product.demo || product.contact.toLowerCase().includes("demo")) {
      toast("This is a sample seller. Real contact details are not available in the demo.");
      return;
    }

    const message =
      `Seller contact supplied for ${product.name}: ${product.contact}. Confirm details and agree on arrangements before buying.`;

    toast(message);
    announce(message);
  }

  $("#productGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "favourite") toggleFavourite(id);
    if (action === "add-cart") addToCart(id);
    if (action === "contact") contactSeller(id);

    if (action === "clear-filters") {
      $("#clearFiltersBtn")?.click();
    }
  });

  /* --------------------------------------------------------
     9. CART AND DEMO CHECKOUT
     -------------------------------------------------------- */

  function cartDetails() {
    return cart.map(item => {
      const product = getProduct(item.productId);
      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity
      };
    }).filter(Boolean);
  }

  function renderCart() {
    const itemsContainer = $("#cartItems");
    const count = $("#cartCount");
    const subtotalElement = $("#cartSubtotal");

    const details = cartDetails();
    const totalItems = details.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = details.reduce((sum, item) => sum + item.lineTotal, 0);

    if (count) count.textContent = String(totalItems);
    if (subtotalElement) subtotalElement.textContent = money(subtotal);

    if (itemsContainer) {
      if (details.length === 0) {
        itemsContainer.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Browse the marketplace and add a product to start your basket.</p>
          </div>`;
      } else {
        itemsContainer.innerHTML = details.map(({ product, quantity, lineTotal }) => `
          <article class="cart-item" data-cart-id="${escapeHTML(product.id)}">
            <div class="cart-item-image">
              ${product.image
                ? `<img src="${escapeHTML(product.image)}" alt="" loading="lazy">`
                : `<span>${CATEGORY_EMOJIS[product.category] || "🌱"}</span>`}
            </div>
            <div class="cart-item-details">
              <h3>${escapeHTML(product.name)}</h3>
              <p>${money(product.price)} / ${escapeHTML(UNIT_NAMES[product.unit] || product.unit)}</p>
              <strong>${money(lineTotal)}</strong>
              <div class="cart-quantity-controls">
                <button type="button" data-cart-action="decrease"
                  data-id="${escapeHTML(product.id)}" aria-label="Decrease quantity">−</button>
                <span>${quantity}</span>
                <button type="button" data-cart-action="increase"
                  data-id="${escapeHTML(product.id)}" aria-label="Increase quantity">+</button>
                <button type="button" data-cart-action="remove"
                  data-id="${escapeHTML(product.id)}" class="cart-remove-button">Remove</button>
              </div>
            </div>
          </article>
        `).join("");
      }
    }

    const checkout = $("#checkoutBtn");
    if (checkout) checkout.disabled = details.length === 0;

    const orderSummary = $("#orderSummary");
    if (orderSummary) {
      orderSummary.hidden = true;
      orderSummary.innerHTML = "";
    }
  }

  $("#openCartBtn")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  $("#basketCalculatorBtn")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  $("#cartItems")?.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.cartAction;
    const item = cart.find(entry => entry.productId === id);
    const product = getProduct(id);

    if (!item || !product) return;

    if (action === "increase") {
      if (item.quantity >= product.quantity) {
        toast("You have reached the available quantity for this listing.");
        return;
      }
      item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.productId !== id);
      }
    }

    if (action === "remove") {
      cart = cart.filter(entry => entry.productId !== id);
      toast("Product removed from your cart.");
    }

    saveCart();
    renderCart();
    renderProducts();
  });

  $("#clearCartBtn")?.addEventListener("click", () => {
    if (cart.length === 0) {
      toast("Your cart is already empty.");
      return;
    }

    cart = [];
    saveCart();
    renderCart();
    renderProducts();

    if ($("#cartFeedback")) {
      $("#cartFeedback").textContent = "Your cart has been cleared.";
    }
  });

  $("#checkoutBtn")?.addEventListener("click", () => {
    const details = cartDetails();
    if (!details.length) {
      toast("Add a product before creating an order summary.");
      return;
    }

    const total = details.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = {
      id: makeId("demo-order"),
      createdAt: new Date().toISOString(),
      items: details.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity
      })),
      total,
      status: "Demo order summary only"
    };

    const orders = readStorage(KEYS.orders, []);
    orders.push(order);

    if (!writeStorage(KEYS.orders, orders)) return;

    const summary = $("#orderSummary");
    if (summary) {
      summary.hidden = false;
      summary.innerHTML = `
        <h3>Demo order summary</h3>
        <p><strong>Reference:</strong> ${escapeHTML(order.id)}</p>
        <p><strong>Date:</strong> ${escapeHTML(formatDate(order.createdAt))}</p>
        <ul>
          ${details.map(({ product, quantity, lineTotal }) => `
            <li>${escapeHTML(product.name)} × ${quantity} — ${money(lineTotal)}</li>
          `).join("")}
        </ul>
        <p><strong>Estimated total: ${money(total)}</strong></p>
        <p>This is not a real order. No payment was taken and no seller was contacted.</p>
        <button class="button button-outline" type="button" data-action="close-order">
          Close summary
        </button>`;
    }

    $("#cartFeedback") && ($("#cartFeedback").textContent =
      "Demo summary created and saved in this browser.");

    announce("Demo order summary created.");
    toast("Demo order summary created.");
  });

  $("#orderSummary")?.addEventListener("click", event => {
    if (event.target.closest('[data-action="close-order"]')) {
      $("#orderSummary").hidden = true;
    }
  });

  /* --------------------------------------------------------
     10. LISTING CREATION AND EDITING
     -------------------------------------------------------- */

  function resetListingForm() {
    const form = $("#listingForm");
    if (form) form.reset();

    editingProductId = null;

    const title = $("#listingModalTitle");
    if (title) title.textContent = "Create a product listing";

    const submit = $("#listingForm button[type='submit']");
    if (submit) submit.textContent = "Publish demo listing";

    const feedback = $("#listingFeedback");
    if (feedback) feedback.textContent = "";

    renderListingPricePreview();
  }

  function openListingForm(product = null) {
    resetListingForm();

    if (product) {
      editingProductId = product.id;

      const form = $("#listingForm");
      if (!form) return;

      const fields = {
        name: product.name,
        variety: product.variety,
        category: product.category,
        condition: product.condition,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        location: product.location,
        contact: product.contact,
        harvestDate: product.harvestDate,
        image: product.image,
        description: product.description,
        negotiable: product.negotiable,
        harvestRescue: product.harvestRescue
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = form.elements.namedItem(name);
        if (!input) return;

        if (input.type === "checkbox") input.checked = Boolean(value);
        else input.value = value ?? "";
      });

      if ($("#listingModalTitle")) {
        $("#listingModalTitle").textContent = "Edit your product listing";
      }

      const submit = $("#listingForm button[type='submit']");
      if (submit) submit.textContent = "Save listing changes";
    }

    renderListingPricePreview();
    openModal("listingModal");
  }

  [
    "#openListingBtn",
    "#heroSellBtn",
    "#sectionSellBtn",
    "#ctaSellBtn",
    "#footerSellBtn"
  ].forEach(selector => {
    $(selector)?.addEventListener("click", () => openListingForm());
  });

  $("#listingForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const category = String(data.get("category") || "");
    const price = Number(data.get("price"));
    const quantity = Number(data.get("quantity"));
    const unit = String(data.get("unit") || "");
    const location = String(data.get("location") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const description = String(data.get("description") || "").trim();

    const feedback = $("#listingFeedback");

    function listingError(message) {
      if (feedback) feedback.textContent = message;
      toast(message);
    }

    if (!name || !CATEGORY_NAMES[category]) {
      listingError("Please enter a product name and choose a category.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      listingError("Enter a valid asking price greater than zero.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      listingError("Enter an available quantity greater than zero.");
      return;
    }

    if (!UNIT_NAMES[unit]) {
      listingError("Please choose a valid price unit.");
      return;
    }

    if (!location || !contact || !description) {
      listingError("Please complete the location, contact and description fields.");
      return;
    }

    const rawImage = String(data.get("image") || "").trim();
    if (rawImage && !safeImageURL(rawImage)) {
      listingError("Use a valid HTTPS image URL, or leave the image field empty.");
      return;
    }

    const product = normaliseProduct({
      id: editingProductId || makeId("product"),
      name,
      variety: String(data.get("variety") || "").trim(),
      category,
      condition: String(data.get("condition") || "good"),
      price,
      quantity,
      unit,
      location,
      contact,
      harvestDate: String(data.get("harvestDate") || ""),
      image: rawImage,
      description,
      negotiable: data.get("negotiable") === "on",
      harvestRescue: data.get("harvestRescue") === "on",
      seller: profile.name || "Demo seller",
      createdAt: editingProductId
        ? (getProduct(editingProductId)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
      demo: false
    });

    if (editingProductId) {
      products = products.map(existing =>
        existing.id === editingProductId ? product : existing
      );
    } else {
      products.unshift(product);
    }

    if (!writeStorage(KEYS.products, products)) {
      listingError("Could not save your listing. Please try again.");
      return;
    }

    if (feedback) {
      feedback.textContent = editingProductId
        ? "Your listing changes have been saved in this browser."
        : "Your product has been added to the demo marketplace.";
    }

    closeModal("listingModal");
    resetListingForm();

    activeCategory = "all";
    favouritesOnly = false;
    harvestOnly = false;
    searchTerm = "";
    locationTerm = "";

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#locationInput")) $("#locationInput").value = "";

    $$("#categoryGrid [data-category]").forEach(button => {
      const active = button.dataset.category === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    renderProducts();
    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });

    toast(editingProductId ? "Listing updated!" : "Product listed successfully!");
    announce("Your listing has been saved.");
  });

  /* --------------------------------------------------------
     11. HARVEST RESCUE
     -------------------------------------------------------- */

  function showHarvestRescue() {
    harvestOnly = !harvestOnly;
    favouritesOnly = false;
    activeCategory = "all";

    $$("#categoryGrid [data-category]").forEach(button => {
      const active = button.dataset.category === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
    renderProducts();

    if (harvestOnly) {
      toast("Showing seller-flagged Harvest Rescue offers.");
    }
  }

  $("#harvestRescueBtn")?.addEventListener("click", showHarvestRescue);

  /* --------------------------------------------------------
     12. BUYER REQUESTS
     -------------------------------------------------------- */

  function openRequestForm() {
    if ($("#requestForm")) $("#requestForm").reset();
    if ($("#requestFeedback")) $("#requestFeedback").textContent = "";
    openModal("requestModal");
  }

  $("#requestProductBtn")?.addEventListener("click", openRequestForm);
  $("#featureRequestBtn")?.addEventListener("click", openRequestForm);

  $("#requestForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const product = String(data.get("product") || "").trim();
    const quantity = String(data.get("quantity") || "").trim();
    const location = String(data.get("location") || "").trim();
    const budgetText = String(data.get("budget") || "").trim();
    const budget = budgetText ? Number(budgetText) : null;

    if (!product || !quantity || !location) {
      $("#requestFeedback").textContent = "Complete the product, quantity and location fields.";
      return;
    }

    if (budgetText && (!Number.isFinite(budget) || budget < 0)) {
      $("#requestFeedback").textContent = "Enter a valid budget or leave it empty.";
      return;
    }

    const requests = readStorage(KEYS.requests, []);

    requests.unshift({
      id: makeId("request"),
      product,
      quantity,
      location,
      budget,
      details: String(data.get("details") || "").trim(),
      createdAt: new Date().toISOString()
    });

    if (!writeStorage(KEYS.requests, requests)) return;

    $("#requestFeedback").textContent =
      "Your demo request has been saved in this browser. It has not been sent to farmers.";

    event.currentTarget.reset();
    toast("Demo buyer request saved.");
  });

  /* --------------------------------------------------------
     13. GROUP BUYING
     -------------------------------------------------------- */

  $("#groupBuyingBtn")?.addEventListener("click", () => {
    if ($("#groupBuyingForm")) $("#groupBuyingForm").reset();
    if ($("#groupBuyingFeedback")) $("#groupBuyingFeedback").textContent = "";
    openModal("groupBuyingModal");
  });

  $("#groupBuyingForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const product = String(data.get("product") || "").trim();
    const quantity = String(data.get("quantity") || "").trim();
    const location = String(data.get("location") || "").trim();

    if (!product || !quantity || !location) {
      $("#groupBuyingFeedback").textContent =
        "Please complete the product, quantity and location fields.";
      return;
    }

    const groups = readStorage(KEYS.groups, []);

    groups.unshift({
      id: makeId("group"),
      product,
      quantity,
      location,
      contact: String(data.get("contact") || "").trim(),
      createdAt: new Date().toISOString(),
      status: "Demo interest only"
    });

    if (!writeStorage(KEYS.groups, groups)) return;

    $("#groupBuyingFeedback").textContent =
      "Your group-buying idea has been saved locally. No other buyers have been contacted.";

    event.currentTarget.reset();
    toast("Group-buying idea saved.");
  });

  /* --------------------------------------------------------
     14. DEMO PROFILE
     -------------------------------------------------------- */

  function renderProfile() {
    const nameInput = $("#demoUserName");
    const roleInput = $("#demoUserRole");

    if (nameInput) nameInput.value = profile.name || "";
    if (roleInput) roleInput.value = profile.role || "buyer";
  }

  $("#loginBtn")?.addEventListener("click", () => {
    renderProfile();
    if ($("#profileFeedback")) $("#profileFeedback").textContent = "";
    openModal("loginModal");
  });

  $("#loginForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#demoUserName")?.value.trim();
    const role = $("#demoUserRole")?.value || "buyer";

    if (!name) {
      $("#profileFeedback").textContent = "Enter a display name.";
      return;
    }

    profile = { name, role };

    if (!writeStorage(KEYS.profile, profile)) return;

    $("#profileFeedback").textContent = "Your local demo profile has been saved.";
    toast(`Welcome, ${name}!`);
    closeModal("loginModal");
  });

  /* --------------------------------------------------------
     15. SETTINGS AND LANGUAGE
     -------------------------------------------------------- */

  const translations = {
    sw: {
      "Home": "Nyumbani",
      "Marketplace": "Soko",
      "Harvest Rescue": "Okoa Mazao",
      "Explore the marketplace": "Tembelea soko",
      "Fresh finds for you": "Mazao mapya kwako",
      "Search": "Tafuta",
      "Clear": "Futa",
      "Fruits": "Matunda",
      "Vegetables": "Mboga",
      "Nuts": "Karanga",
      "Grains": "Nafaka",
      "Legumes": "Mikunde",
      "Sell produce": "Uza mazao",
      "List a product": "Weka bidhaa",
      "Your cart": "Kikapu chako"
    },
    en: {},
    sheng: {},
    mix: {}
  };

  function applyLanguage() {
    const language = settings.language || "en";
    const dictionary = translations[language] || {};

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (dictionary[key]) element.textContent = dictionary[key];
    });

    const select = $("#languageSelect");
    if (select) select.value = language;
  }

  $("#openSettingsBtn")?.addEventListener("click", () => {
    applyLanguage();
    if ($("#settingsFeedback")) $("#settingsFeedback").textContent = "";
    openModal("settingsModal");
  });

  $("#mobileSettingsBtn")?.addEventListener("click", () => {
    applyLanguage();
    openModal("settingsModal");
  });

  $("#settingsForm")?.addEventListener("submit", event => {
    event.preventDefault();

    settings.language = $("#languageSelect")?.value || "en";

    if (!writeStorage(KEYS.settings, settings)) return;

    applyLanguage();

    $("#settingsFeedback").textContent =
      settings.language === "en"
        ? "Settings saved."
        : "Settings saved. Full translations are being developed.";

    toast("Settings saved.");
  });

  /* --------------------------------------------------------
     16. SUPPORT AND FEEDBACK
     -------------------------------------------------------- */

  $("#supportForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const topic = $("#supportTopic")?.value || "";
    const message = $("#supportMessage")?.value.trim() || "";

    if (!topic || !message) {
      $("#supportFeedback").textContent = "Choose a topic and enter a message.";
      return;
    }

    const feedbackList = readStorage(KEYS.feedback, []);

    feedbackList.unshift({
      id: makeId("feedback"),
      topic,
      message,
      createdAt: new Date().toISOString()
    });

    if (!writeStorage(KEYS.feedback, feedbackList)) return;

    $("#supportFeedback").textContent =
      "Thank you. Your feedback has been saved locally for the demo.";

    event.currentTarget.reset();
    toast("Feedback saved in this browser.");
  });

  /* --------------------------------------------------------
     17. INTRODUCTION / TUTORIAL
     -------------------------------------------------------- */

  function renderTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    if (!step) return;

    if ($("#tutorialIllustration")) {
      $("#tutorialIllustration").textContent = step.icon;
    }
    if ($("#tutorialStepLabel")) {
      $("#tutorialStepLabel").textContent =
        `${step.label} · ${tutorialStep + 1} OF ${tutorialSteps.length}`;
    }
    if ($("#tutorialTitle")) $("#tutorialTitle").textContent = step.title;
    if ($("#tutorialDescription")) {
      $("#tutorialDescription").textContent = step.description;
    }

    const progress = $("#tutorialProgress");
    if (progress) {
      const percent = ((tutorialStep + 1) / tutorialSteps.length) * 100;
      progress.innerHTML = `<span class="tutorial-progress-bar" style="width:${percent}%"></span>`;
    }

    const next = $("#nextTutorialBtn");
    if (next) {
      next.textContent = tutorialStep === tutorialSteps.length - 1
        ? "Let's explore →"
        : "Next →";
    }
  }

  function startTutorial() {
    tutorialStep = 0;
    renderTutorialStep();
    openModal("tutorialModal");
  }

  function finishTutorial() {
    writeStorage(KEYS.tutorial, true);
    closeModal("tutorialModal");
  }

  $("#replayTutorialBtn")?.addEventListener("click", startTutorial);
  $("#settingsTutorialBtn")?.addEventListener("click", startTutorial);

  $("#skipTutorialBtn")?.addEventListener("click", finishTutorial);

  $("#nextTutorialBtn")?.addEventListener("click", () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      tutorialStep += 1;
      renderTutorialStep();
    } else {
      finishTutorial();
    }
  });

  /* --------------------------------------------------------
     18. MOBILE NAVIGATION
     -------------------------------------------------------- */

  const mobileMenuButton = $("#mobileMenuBtn");
  const mainNav = $("#mainNav");

  mobileMenuButton?.addEventListener("click", () => {
    const isOpen = mainNav?.classList.toggle("is-open") || false;

    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav?.classList.remove("is-open");
      mobileMenuButton?.setAttribute("aria-expanded", "false");
    });
  });

  /* --------------------------------------------------------
     19. GENERAL STARTUP
     -------------------------------------------------------- */

  function initialiseApp() {
    // Normalise stored cart entries and discard deleted products.
    cart = cart.filter(item => getProduct(item.productId));
    saveCart();

    favourites = favourites.filter(id => getProduct(id));
    saveFavourites();

    renderProducts();
    renderCart();
    renderProfile();
    applyLanguage();
    updateStats();

    // Restore category button accessibility state.
    $$("#categoryGrid [data-category]").forEach(button => {
      const active = button.dataset.category === activeCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    // First-visit introduction.
    const hasSeenTutorial = readStorage(KEYS.tutorial, false);

    if (!hasSeenTutorial) {
      window.setTimeout(() => {
        if (!$(".modal.is-open")) startTutorial();
      }, 700);
    }

    console.info("ShambaMarket demo initialised successfully.");
  }

  initialiseApp();
});
