
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

/* =========================================================
   MAVUNOBRIDGE — PART 2
   Selling form, photos, fair-price guide and service rates
   ========================================================= */

const FAIR_PRICE_GUIDE = {
  "hass avocados": { min: 90, max: 180, unit: "kg" },
  "tomatoes": { min: 60, max: 110, unit: "kg" },
  "red tomatoes": { min: 60, max: 110, unit: "kg" },
  "dry maize": { min: 45, max: 80, unit: "kg" },
  "maize": { min: 45, max: 80, unit: "kg" },
  "irish potatoes": { min: 35, max: 90, unit: "kg" },
  "dry beans": { min: 100, max: 220, unit: "kg" },
  "green grams": { min: 100, max: 230, unit: "kg" }
};

function checkFairPrice(name, price) {
  const normalised = String(name || "").trim().toLowerCase();
  const guide = FAIR_PRICE_GUIDE[normalised];

  if (!guide) {
    return {
      status: "unknown",
      message: "No demo guide is available for this product yet."
    };
  }

  const amount = Number(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      status: "invalid",
      message: "Enter a valid price to check it."
    };
  }

  if (amount < guide.min) {
    return {
      status: "low",
      message: `Below the illustrative guide of KES ${guide.min}–${guide.max} per ${guide.unit}. Check product quality and quantity.`
    };
  }

  if (amount > guide.max) {
    return {
      status: "high",
      message: `Above the illustrative guide of KES ${guide.min}–${guide.max} per ${guide.unit}. Consider checking local prices.`
    };
  }

  return {
    status: "fair",
    message: "Within the illustrative demo price range. Actual prices may differ by county, season and quality."
  };
}

function setupPriceCheck() {
  const nameInput = $("#productName");
  const priceInput = $("#productPrice");
  const result = $("#priceCheck");

  if (!result) return;

  const update = () => {
    if (!nameInput || !priceInput) return;

    const check = checkFairPrice(nameInput.value, priceInput.value);

    result.textContent = check.message;
    result.dataset.status = check.status;
  };

  nameInput?.addEventListener("input", update);
  priceInput?.addEventListener("input", update);
}

function setupPhotoPreview() {
  const input = $("#photoInput");
  const preview = $("#photoPreview");

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files?.[0];

    if (!file) {
      preview.innerHTML = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      notify("Please choose an image file.");
      input.value = "";
      preview.innerHTML = "";
      return;
    }

    // Keep demo photos reasonably small for browser storage.
    if (file.size > 2 * 1024 * 1024) {
      notify("Choose a photo smaller than 2 MB for this demo.");
      input.value = "";
      preview.innerHTML = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      preview.innerHTML = `
        <img src="${reader.result}"
          alt="Product photo preview"
          style="width:140px;height:110px;object-fit:cover;border-radius:12px;">
      `;
    };

    reader.readAsDataURL(file);
  });
}

function setupListingForm() {
  const form = $("#listingForm");
  const modal = $("#listingModal");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = (selector) => form.querySelector(selector)?.value?.trim() || "";

    const name = value('[name="name"], #productName');
    const category = value('[name="category"], #formCategory');
    const county = value('[name="county"], #formCounty');
    const town = value('[name="town"], #formTown');
    const seller = value('[name="seller"], #sellerName');
    const phone = value('[name="phone"], #sellerPhone');
    const price = Number(value('[name="price"], #productPrice'));
    const quantity = Number(value('[name="quantity"], #productQuantity'));
    const unit = value('[name="unit"], #productUnit') || "kg";
    const saleType = value('[name="saleType"], #saleType') || "retail";
    const condition = value('[name="condition"], #productCondition') || "Good";
    const description = value('[name="description"], #productDescription');
    const harvestDate = value('[name="harvestDate"], #harvestDate');

    if (!name || !category || !county || !seller || !phone) {
      notify("Please complete the required product and seller details.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0 ||
        !Number.isFinite(quantity) || quantity <= 0) {
      notify("Enter a valid price and quantity.");
      return;
    }

    const photoFile = $("#photoInput")?.files?.[0];
    let image = "";

    if (photoFile) {
      if (!photoFile.type.startsWith("image/") ||
          photoFile.size > 2 * 1024 * 1024) {
        notify("Use an image smaller than 2 MB.");
        return;
      }

      image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      }).catch(() => "");

      if (!image) {
        notify("The photo couldn't be read. Please try again.");
        return;
      }
    }

    const listing = {
      id: makeId(),
      name,
      category,
      county,
      town,
      seller,
      phone,
      price,
      quantity,
      unit,
      saleType,
      condition,
      description,
      harvestDate,
      image,
      createdAt: new Date().toISOString(),
      demo: true
    };

    listings.unshift(listing);

    if (!saveData(KEYS.listings, listings)) {
      listings.shift();
      return;
    }

    activeCategory = "all";
    activeSearch = "";
    activeLocation = "";
    activeSaleFilter = "all";
    activeSort = "newest";

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#countyFilter")) $("#countyFilter").value = "";
    if ($("#saleFilter")) $("#saleFilter").value = "all";
    if ($("#sortFilter")) $("#sortFilter").value = "newest";

    renderCategories();
    renderListings();

    form.reset();

    if ($("#photoPreview")) $("#photoPreview").innerHTML = "";

    if (modal) modal.hidden = true;

    notify("Your demo listing has been published!");

    $("#listingGrid")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function setupListingModal() {
  const modal = $("#listingModal");

  const openButtons = [
    $("#sellButton"),
    $("#heroSellButton")
  ].filter(Boolean);

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (modal) modal.hidden = false;
    });
  });

  modal?.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      modal.hidden = true;
    });
  });

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
  });
}

function setupCountyOptions() {
  const countySelect = $("#formCounty");

  if (!countySelect) return;

  const selected = countySelect.value;

  countySelect.innerHTML =
    '<option value="">Choose county</option>' +
    COUNTIES.map((county) =>
      `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
    ).join("");

  countySelect.value = selected;
}

function setupCategoryOptions() {
  const categorySelect = $("#formCategory");

  if (!categorySelect) return;

  categorySelect.innerHTML =
    '<option value="">Choose category</option>' +
    CATEGORIES.map((category) =>
      `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`
    ).join("");
}

// Demo service pricing examples.
// These are example rates, not verified quotations.
const SERVICE_RATE_EXAMPLES = [
  { service: "Tractor ploughing", unit: "acre", exampleRate: 3500 },
  { service: "Rotavation", unit: "acre", exampleRate: 4500 },
  { service: "Farm equipment hire", unit: "day", exampleRate: 2500 },
  { service: "Water pump hire", unit: "day", exampleRate: 1500 }
];

function getServiceRateExamples() {
  return SERVICE_RATE_EXAMPLES.map((item) => ({
    ...item,
    displayRate: `${money(item.exampleRate)} / ${item.unit}`,
    note: "Illustrative demo rate. Confirm the final cost with the provider."
  }));
}

// Connect this section after Part 4's main initialisation function.
function initialiseSellingFeatures() {
  setupPriceCheck();
  setupPhotoPreview();
  setupListingForm();
  setupListingModal();
  setupCountyOptions();
  setupCategoryOptions();
}

/* =========================================================
   MAVUNOBRIDGE — PART 3
   Cart, checkout demo, favourites and buyer requests
   ========================================================= */

function getCart() {
  return Array.isArray(cart) ? cart : [];
}

function saveCart() {
  return saveData(KEYS.cart, cart);
}

function addToCart(listingId) {
  const product = listings.find((item) => item.id === listingId);

  if (!product) {
    notify("This listing is no longer available.");
    return;
  }

  const existing = cart.find((item) => item.id === listingId);

  if (existing) {
    const nextQuantity = Number(existing.quantity || 1) + 1;

    if (nextQuantity > Number(product.quantity || 0)) {
      notify("That quantity is not available.");
      return;
    }

    existing.quantity = nextQuantity;
  } else {
    if (Number(product.quantity || 0) < 1) {
      notify("This product is currently out of stock.");
      return;
    }

    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  if (saveCart()) {
    renderCart();
    notify(`${product.name} added to your cart.`);
  }
}

function updateCartQuantity(listingId, change) {
  const item = cart.find((entry) => entry.id === listingId);
  const product = listings.find((entry) => entry.id === listingId);

  if (!item || !product) return;

  const newQuantity = Number(item.quantity || 1) + change;

  if (newQuantity <= 0) {
    cart = cart.filter((entry) => entry.id !== listingId);
  } else if (newQuantity > Number(product.quantity || 0)) {
    notify("You've reached the available quantity.");
    return;
  } else {
    item.quantity = newQuantity;
  }

  saveCart();
  renderCart();
}

function removeFromCart(listingId) {
  cart = cart.filter((item) => item.id !== listingId);
  saveCart();
  renderCart();
  notify("Item removed from your cart.");
}

function renderCart() {
  const container = $("#cartItems");
  const totalElement = $("#cartTotal");
  const countElement = $("#cartCount");

  let total = 0;
  let itemCount = 0;

  const cartProducts = getCart().map((entry) => {
    const product = listings.find((item) => item.id === entry.id);

    if (!product) return null;

    const quantity = Math.max(1, Number(entry.quantity || 1));
    const subtotal = Number(product.price || 0) * quantity;

    total += subtotal;
    itemCount += quantity;

    return { product, quantity, subtotal };
  }).filter(Boolean);

  if (container) {
    container.innerHTML = cartProducts.length
      ? cartProducts.map(({ product, quantity, subtotal }) => `
        <article class="cart-item">
          <div class="cart-item-info">
            <strong>${escapeHTML(product.name)}</strong>
            <p>${money(product.price)} / ${escapeHTML(product.unit || "item")}</p>
            <small>${escapeHTML(product.county || "")}</small>
          </div>

          <div class="cart-item-controls">
            <button type="button"
              data-cart-minus="${escapeHTML(product.id)}"
              aria-label="Decrease quantity">−</button>

            <span>${quantity}</span>

            <button type="button"
              data-cart-plus="${escapeHTML(product.id)}"
              aria-label="Increase quantity">+</button>
          </div>

          <strong>${money(subtotal)}</strong>

          <button type="button"
            data-cart-remove="${escapeHTML(product.id)}"
            aria-label="Remove ${escapeHTML(product.name)}">Remove</button>
        </article>
      `).join("")
      : "<p>Your cart is empty. Add products from the marketplace.</p>";

    container.querySelectorAll("[data-cart-minus]").forEach((button) => {
      button.addEventListener("click", () =>
        updateCartQuantity(button.dataset.cartMinus, -1)
      );
    });

    container.querySelectorAll("[data-cart-plus]").forEach((button) => {
      button.addEventListener("click", () =>
        updateCartQuantity(button.dataset.cartPlus, 1)
      );
    });

    container.querySelectorAll("[data-cart-remove]").forEach((button) => {
      button.addEventListener("click", () =>
        removeFromCart(button.dataset.cartRemove)
      );
    });
  }

  if (totalElement) totalElement.textContent = money(total);
  if (countElement) countElement.textContent = String(itemCount);

  const checkout = $("#checkoutButton");

  if (checkout) {
    checkout.disabled = cartProducts.length === 0;
  }
}

function setupCartModal() {
  const modal = $("#cartModal");
  const openButton = $("#openCart");

  openButton?.addEventListener("click", () => {
    renderCart();
    if (modal) modal.hidden = false;
  });

  modal?.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      modal.hidden = true;
    });
  });

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
  });
}

function setupDemoCheckout() {
  const button = $("#checkoutButton");

  button?.addEventListener("click", () => {
    if (!cart.length) {
      notify("Add a product to your cart first.");
      return;
    }

    const fulfilment = $("#fulfilment")?.value || "collection";

    const items = cart.map((entry) => {
      const product = listings.find((item) => item.id === entry.id);

      if (!product) return null;

      const quantity = Number(entry.quantity || 1);

      return {
        listingId: product.id,
        name: product.name,
        quantity,
        unit: product.unit || "item",
        unitPrice: Number(product.price || 0),
        subtotal: Number(product.price || 0) * quantity,
        seller: product.seller,
        phone: product.phone
      };
    }).filter(Boolean);

    if (!items.length) {
      notify("Your cart contains unavailable products.");
      return;
    }

    const order = {
      id: makeId(),
      items,
      fulfilment,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
      status: "Demo order — not paid",
      createdAt: new Date().toISOString()
    };

    const orders = readData(KEYS.orders, []);
    orders.unshift(order);

    if (!saveData(KEYS.orders, orders)) return;

    cart = [];
    saveCart();
    renderCart();

    const modal = $("#cartModal");
    if (modal) modal.hidden = true;

    notify("Demo order recorded! No payment was taken.");

    console.log("MavunoBridge demo order:", order);
  });
}

/* -------------------- FAVOURITES -------------------- */

let favourites = readData(KEYS.favourites, []);

if (!Array.isArray(favourites)) favourites = [];

function toggleFavourite(listingId) {
  if (favourites.includes(listingId)) {
    favourites = favourites.filter((id) => id !== listingId);
    notify("Removed from favourites.");
  } else {
    favourites.push(listingId);
    notify("Added to favourites.");
  }

  saveData(KEYS.favourites, favourites);
  renderListings();
}

function getFavouriteListings() {
  return listings.filter((item) => favourites.includes(item.id));
}

/* -------------------- BUYER REQUESTS -------------------- */

function getBuyerRequests() {
  const requests = readData(KEYS.requests, []);
  return Array.isArray(requests) ? requests : [];
}

function createBuyerRequest(details) {
  const request = {
    id: makeId(),
    product: String(details.product || "").trim(),
    category: String(details.category || "").trim(),
    county: String(details.county || "").trim(),
    quantity: Number(details.quantity || 0),
    unit: String(details.unit || "kg").trim(),
    budget: Number(details.budget || 0),
    buyerName: String(details.buyerName || "").trim(),
    phone: String(details.phone || "").trim(),
    notes: String(details.notes || "").trim(),
    createdAt: new Date().toISOString(),
    status: "Open — demo request"
  };

  if (!request.product || !request.county ||
      !request.buyerName || !request.phone ||
      request.quantity <= 0) {
    notify("Add the product, county, buyer contact and quantity.");
    return false;
  }

  const requests = getBuyerRequests();
  requests.unshift(request);

  if (!saveData(KEYS.requests, requests)) return false;

  notify("Buyer request saved on this device.");
  return request;
}

function renderBuyerRequests(container) {
  if (!container) return;

  const requests = getBuyerRequests();

  container.innerHTML = requests.length
    ? requests.map((request) => `
      <article class="buyer-request-card">
        <h3>${escapeHTML(request.product)}</h3>
        <p>${escapeHTML(request.quantity)} ${escapeHTML(request.unit)} needed</p>
        <p>📍 ${escapeHTML(request.county)}</p>
        ${request.budget > 0
          ? `<p>Budget: ${money(request.budget)}</p>`
          : ""}
        <p>${escapeHTML(request.notes || "Buyer has not added extra details.")}</p>
        <small>${escapeHTML(request.status)}</small>
      </article>
    `).join("")
    : "<p>No buyer requests yet.</p>";
}

/* -------------------- MACHINERY / SERVICE ENQUIRY -------------------- */

function createServiceEnquiry(details) {
  const enquiry = {
    id: makeId(),
    service: String(details.service || "").trim(),
    county: String(details.county || "").trim(),
    date: String(details.date || "").trim(),
    area: Number(details.area || 0),
    unit: String(details.unit || "acre").trim(),
    customerName: String(details.customerName || "").trim(),
    phone: String(details.phone || "").trim(),
    notes: String(details.notes || "").trim(),
    createdAt: new Date().toISOString(),
    status: "Enquiry only — not booked"
  };

  if (!enquiry.service || !enquiry.county ||
      !enquiry.customerName || !enquiry.phone) {
    notify("Enter the service, county and your contact details.");
    return false;
  }

  const enquiries = readData("mavunobridge_service_enquiries_v1", []);
  enquiries.unshift(enquiry);

  if (!saveData("mavunobridge_service_enquiries_v1", enquiries)) {
    return false;
  }

  notify("Service enquiry saved on this device. Contact the provider to confirm.");
  return enquiry;
}

/* Part 3 initialisation */
function initialiseShoppingFeatures() {
  renderCart();
  setupCartModal();
  setupDemoCheckout();
}

/* =========================================================
   MAVUNOBRIDGE — PART 4
   Language, navigation, slideshow, favourites and startup
   ========================================================= */

/* -------------------- LANGUAGE -------------------- */

const UI_TEXT = {
  en: {
    search: "Search products, farmers or counties...",
    sell: "Sell your produce",
    cart: "Your cart",
    empty: "No products match your search.",
    addCart: "Add to cart",
    all: "All Products"
  },
  sw: {
    search: "Tafuta bidhaa, wakulima au kaunti...",
    sell: "Uza mazao yako",
    cart: "Kikapu chako",
    empty: "Hakuna bidhaa zinazolingana na utafutaji wako.",
    addCart: "Weka kikapuni",
    all: "Bidhaa zote"
  },
  sheng: {
    search: "Tafuta mazao, mkulima ama county...",
    sell: "Uza mazao yako",
    cart: "Shopping cart yako",
    empty: "Hakuna bidhaa ime-match search yako.",
    addCart: "Weka kwa cart",
    all: "Bidhaa zote"
  }
};

function getLanguage() {
  const stored = readData(KEYS.language, "en");
  return UI_TEXT[stored] ? stored : "en";
}

function applyLanguage(language) {
  const selected = UI_TEXT[language] ? language : "en";

  saveData(KEYS.language, selected);

  const selector = $("#languageSelect");
  if (selector) selector.value = selected;

  const text = UI_TEXT[selected];

  if ($("#searchInput")) {
    $("#searchInput").placeholder = text.search;
  }

  $$("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (text[key]) element.textContent = text[key];
  });

  renderCategories();
  renderListings();
  renderCart();

  notify(
    selected === "sw" ? "Lugha imebadilishwa." :
    selected === "sheng" ? "Language imebadilishwa." :
    "Language changed."
  );
}

function setupLanguage() {
  const selector = $("#languageSelect");
  if (!selector) return;

  selector.addEventListener("change", () => {
    applyLanguage(selector.value);
  });

  selector.value = getLanguage();
}

/* -------------------- MOBILE NAVIGATION -------------------- */

function setupMobileNavigation() {
  const button = $("#menuToggle");
  const nav = $("#mainNav");

  if (!button || !nav) return;

  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

/* -------------------- HERO SLIDESHOW -------------------- */

function setupHeroSlideshow() {
  const heroImage = $("#heroImage");
  const previous = $("#slidePrev");
  const next = $("#slideNext");
  const dots = $("#slideDots");

  if (!heroImage) return;

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
      alt: "Agricultural farmland in Kenya"
    },
    {
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",
      alt: "Green agricultural fields"
    },
    {
      image: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85",
      alt: "Fresh agricultural produce"
    }
  ];

  let index = 0;

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    heroImage.src = slides[index].image;
    heroImage.alt = slides[index].alt;

    if (dots) {
      dots.innerHTML = slides.map((slide, i) => `
        <button type="button"
          class="${i === index ? "active" : ""}"
          aria-label="Show slide ${i + 1}"
          aria-current="${i === index ? "true" : "false"}"
          data-slide="${i}"></button>
      `).join("");

      dots.querySelectorAll("[data-slide]").forEach((button) => {
        button.addEventListener("click", () => {
          showSlide(Number(button.dataset.slide));
        });
      });
    }
  }

  previous?.addEventListener("click", () => showSlide(index - 1));
  next?.addEventListener("click", () => showSlide(index + 1));

  showSlide(0);
}

/* -------------------- FAVOURITE BUTTONS -------------------- */

function addFavouriteButtons() {
  const grid = $("#listingGrid");
  if (!grid) return;

  grid.querySelectorAll(".product-card").forEach((card) => {
    const id = card.dataset.id;
    if (!id || card.querySelector("[data-favourite]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.favourite = id;
    button.className = "favourite-button";

    const updateLabel = () => {
      const isFavourite = favourites.includes(id);
      button.textContent = isFavourite ? "♥ Saved" : "♡ Save";
      button.setAttribute("aria-pressed", String(isFavourite));
      button.setAttribute(
        "aria-label",
        isFavourite ? "Remove from favourites" : "Add to favourites"
      );
    };

    updateLabel();

    button.addEventListener("click", () => {
      toggleFavourite(id);
    });

    card.querySelector(".product-image-wrap")?.appendChild(button);
  });
}

/* -------------------- ACCESSIBILITY -------------------- */

function setupEscapeKey() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    ["listingModal", "cartModal"].forEach((id) => {
      const modal = document.getElementById(id);
      if (modal) modal.hidden = true;
    });
  });
}

/* -------------------- SUPPORT -------------------- */

function setupSupportLinks() {
  $$("[data-support]").forEach((element) => {
    element.addEventListener("click", () => {
      notify(
        "Demo support: contact the seller directly for product enquiries. " +
        "Online support messaging is not connected yet."
      );
    });
  });
}

/* -------------------- FINAL STARTUP -------------------- */

function startMavunoBridge() {
  // Marketplace and filters
  initialiseMarketplace();

  // Selling features
  initialiseSellingFeatures();

  // Cart and demo checkout
  initialiseShoppingFeatures();

  // Navigation and interface
  setupLanguage();
  setupMobileNavigation();
  setupHeroSlideshow();
  setupEscapeKey();
  setupSupportLinks();

  // Add save buttons to the rendered cards.
  addFavouriteButtons();

  // Re-add favourite buttons after every product render.
  const listingGrid = $("#listingGrid");

  if (listingGrid) {
    const observer = new MutationObserver(() => {
      addFavouriteButtons();
    });

    observer.observe(listingGrid, {
      childList: true,
      subtree: true
    });
  }

  console.log(
    "MavunoBridge demo started.",
    listings.length,
    "listings loaded."
  );
}

// Avoid starting the app twice.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startMavunoBridge, {
    once: true
  });
} else {
  startMavunoBridge();
}
