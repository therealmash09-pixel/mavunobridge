
/* =========================================================
   MAVUNOBRIDGE — AGRICULTURAL MARKETPLACE
   DEMO VERSION — localStorage, no Supabase
   ========================================================= */

"use strict";

const KEYS = {
  listings: "mavunobridge_listings_v2",
  cart: "mavunobridge_cart_v2",
  language: "mavunobridge_language_v2",
  orders: "mavunobridge_demo_orders_v1",
  requests: "mavunobridge_buyer_requests_v1",
  favourites: "mavunobridge_favourites_v1"
};

const $ = (selector) => document.querySelector(selector);

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

const money = (amount) =>
  "KES " + Number(amount || 0).toLocaleString("en-KE");

const makeId = () =>
  "mv-" + Date.now().toString(36) +
  "-" + Math.random().toString(36).slice(2, 8);

function readData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    notify("Storage is full. Try using a smaller photo.");
    return false;
  }
}

function notify(message) {
  const toast = $("#toast");

  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  } else {
    console.log("[MavunoBridge]", message);
  }
}

const CATEGORIES = [
  { id: "fruits", name: "Fruits", icon: "🍌" },
  { id: "vegetables", name: "Vegetables", icon: "🥬" },
  { id: "nuts", name: "Nuts", icon: "🥜" },
  { id: "starchy", name: "Starchy Foods", icon: "🥔" },
  { id: "grains", name: "Grains", icon: "🌾" },
  { id: "cereals", name: "Cereals", icon: "🌽" },
  { id: "legumes", name: "Legumes", icon: "🫘" },
  { id: "spices", name: "Spices", icon: "🌶️" },
  { id: "herbal", name: "Herbal Products", icon: "🌿" },
  { id: "livestock", name: "Livestock", icon: "🐄" },
  { id: "inputs", name: "Farm Inputs", icon: "🌱" },
  { id: "tools", name: "Tools & Equipment", icon: "🛠️" },
  { id: "services", name: "Farmer Services", icon: "🚜" }
];

const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia",
  "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
  "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
  "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana",
  "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

// Sample listings are illustrative demo data.
// Prices are not live market quotations.
const DEMO_PRODUCTS = [
  {
    name: "Hass Avocados",
    category: "fruits",
    county: "Kiambu",
    town: "Limuru",
    price: 120,
    quantity: 80,
    unit: "kg",
    saleType: "bulk",
    seller: "Wanjiku Farm",
    phone: "0712345678",
    condition: "Fresh",
    description: "Fresh avocados for homes, shops and bulk buyers.",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ripe Bananas",
    category: "fruits",
    county: "Kisumu",
    town: "Ahero",
    price: 90,
    quantity: 45,
    unit: "bunch",
    saleType: "retail",
    seller: "Ahero Fresh Produce",
    phone: "0722345678",
    condition: "Fresh",
    description: "Locally grown bananas.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Red Tomatoes",
    category: "vegetables",
    county: "Nakuru",
    town: "Molo",
    price: 75,
    quantity: 100,
    unit: "kg",
    saleType: "bulk",
    seller: "Green Valley Farm",
    phone: "0733345678",
    condition: "Fresh",
    description: "Tomatoes for shops, hotels and households.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sukuma Wiki",
    category: "vegetables",
    county: "Nairobi",
    town: "Kikuyu",
    price: 25,
    quantity: 60,
    unit: "bunch",
    saleType: "retail",
    seller: "Mwangaza Greens",
    phone: "0744345678",
    condition: "Fresh",
    description: "Fresh leafy vegetables.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Groundnuts",
    category: "nuts",
    county: "Busia",
    town: "Bumala",
    price: 180,
    quantity: 35,
    unit: "kg",
    saleType: "bulk",
    seller: "Western Nut Growers",
    phone: "0755345678",
    condition: "Dry",
    description: "Dried groundnuts for cooking and processing.",
    image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Irish Potatoes",
    category: "starchy",
    county: "Nyandarua",
    town: "Ol Kalou",
    price: 55,
    quantity: 200,
    unit: "kg",
    saleType: "bulk",
    seller: "Highland Potato Farm",
    phone: "0766345678",
    condition: "Good",
    description: "Farm-fresh potatoes available in bulk.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sweet Potatoes",
    category: "starchy",
    county: "Busia",
    town: "Nambale",
    price: 65,
    quantity: 50,
    unit: "kg",
    saleType: "retail",
    seller: "Sunrise Farm",
    phone: "0777345678",
    condition: "Good",
    description: "Locally harvested sweet potatoes.",
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dry Beans",
    category: "legumes",
    county: "Meru",
    town: "Maua",
    price: 140,
    quantity: 90,
    unit: "kg",
    saleType: "bulk",
    seller: "Meru Grain Traders",
    phone: "0788345678",
    condition: "Dry",
    description: "Clean beans for homes and institutions.",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Green Grams",
    category: "legumes",
    county: "Machakos",
    town: "Kangundo",
    price: 160,
    quantity: 70,
    unit: "kg",
    saleType: "bulk",
    seller: "Eastern Harvest",
    phone: "0799345678",
    condition: "Dry",
    description: "Dried green grams available in bulk.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dry Maize",
    category: "cereals",
    county: "Uasin Gishu",
    town: "Eldoret",
    price: 55,
    quantity: 300,
    unit: "kg",
    saleType: "bulk",
    seller: "North Rift Farmers",
    phone: "0701234567",
    condition: "Dry",
    description: "Dry maize for milling and animal feed.",
    image: "https://images.unsplash.com/photo-1601593768797-4e1c3d8d5a3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Wheat Grain",
    category: "grains",
    county: "Narok",
    town: "Narok Town",
    price: 60,
    quantity: 250,
    unit: "kg",
    saleType: "bulk",
    seller: "Narok Grain Co-op",
    phone: "0711234567",
    condition: "Dry",
    description: "Wheat grain for bulk buyers.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dried Chillies",
    category: "spices",
    county: "Kitui",
    town: "Kitui Town",
    price: 350,
    quantity: 20,
    unit: "kg",
    saleType: "bulk",
    seller: "Kitui Spice Farm",
    phone: "0721234567",
    condition: "Dry",
    description: "Dried chillies for food preparation.",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dried Herbal Leaves",
    category: "herbal",
    county: "Nyeri",
    town: "Othaya",
    price: 200,
    quantity: 15,
    unit: "pack",
    saleType: "retail",
    seller: "Othaya Herb Growers",
    phone: "0731234567",
    condition: "Dry",
    description: "Dried herbal leaves. Ask the seller about intended use.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Indigenous Chicken",
    category: "livestock",
    county: "Kakamega",
    town: "Shinyalu",
    price: 900,
    quantity: 12,
    unit: "bird",
    saleType: "retail",
    seller: "Shinyalu Poultry Farm",
    phone: "0741234567",
    condition: "Healthy",
    description: "Indigenous poultry. Confirm availability with seller.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Seedlings",
    category: "inputs",
    county: "Kiambu",
    town: "Thika",
    price: 15,
    quantity: 500,
    unit: "seedling",
    saleType: "bulk",
    seller: "Green Start Nursery",
    phone: "0751234567",
    condition: "Healthy",
    description: "Seedlings for planting. Confirm variety before ordering.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Farm Sprayer",
    category: "tools",
    county: "Nakuru",
    town: "Nakuru Town",
    price: 2500,
    quantity: 5,
    unit: "piece",
    saleType: "retail",
    seller: "Nakuru Farm Supplies",
    phone: "0761234567",
    condition: "Good",
    description: "Farm sprayer. Contact seller to confirm specifications.",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0b5f6a?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tractor Ploughing",
    category: "services",
    county: "Uasin Gishu",
    town: "Eldoret",
    price: 3500,
    quantity: 1,
    unit: "acre",
    saleType: "retail",
    seller: "Rift Valley Farm Services",
    phone: "0771234567",
    condition: "Available on request",
    description: "Demo service rate per acre. Confirm fuel, transport and dates.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  }
];

let activeCategory = "all";
let activeSearch = "";
let activeLocation = "";
let activeSaleFilter = "all";
let activeSort = "recommended";
let listings = readData(KEYS.listings, null);
let cart = readData(KEYS.cart, []);

if (!Array.isArray(listings) || listings.length === 0) {
  listings = DEMO_PRODUCTS.map((product) => ({
    ...product,
    id: makeId(),
    createdAt: new Date().toISOString(),
    demo: true
  }));
  saveData(KEYS.listings, listings);
}

if (!Array.isArray(cart)) cart = [];

function getCategoryName(id) {
  return CATEGORIES.find((category) => category.id === id)?.name || id;
}

function renderCategories() {
  const container = $("#categoryGrid");
  if (!container) return;

  const counts = listings.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + 1;
    return result;
  }, {});

  container.innerHTML = `
    <button class="category-card ${activeCategory === "all" ? "active" : ""}"
      data-category="all" type="button">
      <span class="cat-icon">🌍</span>
      <b>All Products</b>
      <small>${listings.length} listings</small>
    </button>
    ${CATEGORIES.map((category) => `
      <button class="category-card ${activeCategory === category.id ? "active" : ""}"
        data-category="${escapeHTML(category.id)}" type="button">
        <span class="cat-icon">${category.icon}</span>
        <b>${escapeHTML(category.name)}</b>
        <small>${counts[category.id] || 0} listings</small>
      </button>
    `).join("")}
  `;

  container.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategories();
      renderListings();
    });
  });
}

function getFilteredListings() {
  let result = listings.filter((item) => {
    const searchText = [
      item.name, item.category, item.county,
      item.town, item.seller, item.description
    ].join(" ").toLowerCase();

    const matchesSearch = !activeSearch ||
      searchText.includes(activeSearch.toLowerCase());

    const matchesCategory = activeCategory === "all" ||
      item.category === activeCategory;

    const matchesCounty = !activeLocation ||
      item.county === activeLocation;

    const matchesSale = activeSaleFilter === "all" ||
      item.saleType === activeSaleFilter;

    return matchesSearch && matchesCategory &&
      matchesCounty && matchesSale;
  });

  if (activeSort === "price-low") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (activeSort === "price-high") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (activeSort === "newest") {
    result.sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  return result;
}

function renderListings() {
  const grid = $("#listingGrid");
  const emptyState = $("#emptyState");
  const count = $("#listingCount");

  if (!grid) return;

  const results = getFilteredListings();

  if (count) {
    count.textContent = `${results.length} product${results.length === 1 ? "" : "s"}`;
  }

  if (emptyState) {
    emptyState.hidden = results.length > 0;
  }

  grid.innerHTML = results.map((item) => `
    <article class="product-card" data-id="${escapeHTML(item.id)}">
      <div class="product-image-wrap">
        <img class="product-image"
          src="${escapeHTML(item.image || "")}"
          alt="${escapeHTML(item.name)}"
          loading="lazy"
          onerror="this.style.display='none'">
        <span class="product-badge">${escapeHTML(item.saleType || "retail")}</span>
      </div>
      <div class="product-info">
        <p class="product-location">📍 ${escapeHTML(item.county)}${item.town ? ", " + escapeHTML(item.town) : ""}</p>
        <h3>${escapeHTML(item.name)}</h3>
        <p class="product-description">${escapeHTML(item.description || "")}</p>
        <p class="product-price">${money(item.price)} <small>/ ${escapeHTML(item.unit || "item")}</small></p>
        <p class="product-quantity">Available: ${escapeHTML(item.quantity)} ${escapeHTML(item.unit || "items")}</p>
        <p class="product-seller">Seller: ${escapeHTML(item.seller || "Local farmer")}</p>
        <div class="product-actions">
          <button class="add-cart-btn" data-cart="${escapeHTML(item.id)}" type="button">Add to cart</button>
          ${item.phone ? `<a class="contact-seller" href="tel:${escapeHTML(item.phone)}">Call seller</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.cart));
  });
}

function setupFilters() {
  $("#searchInput")?.addEventListener("input", (event) => {
    activeSearch = event.target.value.trim();
    renderListings();
  });

  $("#countyFilter")?.addEventListener("change", (event) => {
    activeLocation = event.target.value;
    renderListings();
  });

  $("#saleFilter")?.addEventListener("change", (event) => {
    activeSaleFilter = event.target.value;
    renderListings();
  });

  $("#sortFilter")?.addEventListener("change", (event) => {
    activeSort = event.target.value;
    renderListings();
  });

  $("#fairOnly")?.addEventListener("change", () => {
    notify("Fair-price checking will be connected in Part 2.");
  });
}

function populateCountyFilter() {
  const select = $("#countyFilter");
  if (!select) return;

  select.innerHTML = `<option value="">All counties</option>` +
    COUNTIES.map((county) =>
      `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
    ).join("");
}

function initialiseMarketplace() {
  populateCountyFilter();
  setupFilters();
  renderCategories();
  renderListings();
}

document.addEventListener("DOMContentLoaded", initialiseMarketplace);
