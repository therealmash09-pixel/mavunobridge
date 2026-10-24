
/* =========================================================
   SHAMBAMARKET — APP.JS
   Science-fair demo | No Firebase or Supabase required
   Demo data is stored in this browser using localStorage.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const STORAGE = {
    products: "shambamarket_products_v1",
    favourites: "shambamarket_favourites_v1",
    profile: "shambamarket_profile_v1",
    settings: "shambamarket_settings_v1",
    support: "shambamarket_support_v1",
    requests: "shambamarket_requests_v1",
    tutorialSeen: "shambamarket_tutorial_seen_v1"
  };

  const CATEGORIES = {
    fruits: { label: "Fruits", emoji: "🥑" },
    vegetables: { label: "Vegetables", emoji: "🥬" },
    nuts: { label: "Nuts", emoji: "🥜" },
    starchy: { label: "Starchy foods", emoji: "🥔" },
    grains: { label: "Grains", emoji: "🌾" },
    legumes: { label: "Legumes", emoji: "🫘" },
    livestock: { label: "Livestock", emoji: "🐄" },
    "farm-inputs": { label: "Farm inputs", emoji: "🧑‍🌾" }
  };

  const CONDITION_LABELS = {
    fresh: "Fresh",
    good: "Good condition",
    ripe: "Ripe",
    overripe: "Overripe",
    blemished: "Damaged / blemished",
    inspect: "Needs inspection"
  };

  const DEMO_PRODUCTS = [
    {
      id: "demo-001", name: "Avocado", variety: "Hass",
      category: "fruits", price: 80, quantity: 120, unit: "kg",
      location: "Murang'a", contact: "Demo seller — Murang'a",
      condition: "fresh",
      description: "Freshly harvested Hass avocados. Sample listing for demonstration.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-20T08:00:00Z"
    },
    {
      id: "demo-002", name: "Mango", variety: "Apple Mango",
      category: "fruits", price: 60, quantity: 80, unit: "kg",
      location: "Makueni", contact: "Demo seller — Makueni",
      condition: "ripe",
      description: "Ripe apple mangoes. Illustrative sample; confirm quality with seller.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-21T08:00:00Z"
    },
    {
      id: "demo-003", name: "Bananas", variety: "Sweet Bananas",
      category: "fruits", price: 100, quantity: 30, unit: "bunch",
      location: "Kisii", contact: "Demo seller — Kisii",
      condition: "good",
      description: "Banana bunches in good condition. Sample marketplace entry.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-22T08:00:00Z"
    },
    {
      id: "demo-004", name: "Tomatoes", variety: "Anna F1",
      category: "vegetables", price: 90, quantity: 50, unit: "kg",
      location: "Kirinyaga", contact: "Demo seller — Kirinyaga",
      condition: "fresh",
      description: "Fresh tomatoes. This is sample information, not a verified offer.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-19T08:00:00Z"
    },
    {
      id: "demo-005", name: "Kale", variety: "Sukuma Wiki",
      category: "vegetables", price: 25, quantity: 100, unit: "bunch",
      location: "Kiambu", contact: "Demo seller — Kiambu",
      condition: "fresh",
      description: "Fresh sukuma wiki bunches for a sample listing.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-21T09:00:00Z"
    },
    {
      id: "demo-006", name: "Groundnuts", variety: "Local Groundnuts",
      category: "nuts", price: 180, quantity: 40, unit: "kg",
      location: "Busia", contact: "Demo seller — Busia",
      condition: "good",
      description: "Groundnuts in good condition. Sample price and quantity.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-18T08:00:00Z"
    },
    {
      id: "demo-007", name: "Potatoes", variety: "Shangi",
      category: "starchy", price: 55, quantity: 200, unit: "kg",
      location: "Nyandarua", contact: "Demo seller — Nyandarua",
      condition: "good",
      description: "Shangi potatoes, medium-sized, with a few surface marks in this example.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-22T09:00:00Z"
    },
    {
      id: "demo-008", name: "Sweet Potatoes", variety: "Orange-fleshed",
      category: "starchy", price: 45, quantity: 60, unit: "kg",
      location: "Kakamega", contact: "Demo seller — Kakamega",
      condition: "fresh",
      description: "Fresh orange-fleshed sweet potatoes. Illustrative listing.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-20T10:00:00Z"
    },
    {
      id: "demo-009", name: "Maize", variety: "Dry White Maize",
      category: "grains", price: 65, quantity: 20, unit: "bag",
      location: "Trans Nzoia", contact: "Demo seller — Trans Nzoia",
      condition: "good",
      description: "Dry white maize. Bag weight should be confirmed with the seller.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-21T10:00:00Z"
    },
    {
      id: "demo-010", name: "Rice", variety: "Pishori",
      category: "grains", price: 160, quantity: 75, unit: "kg",
      location: "Mwea", contact: "Demo seller — Mwea",
      condition: "good",
      description: "Sample Pishori rice listing. Check packaging and quality before purchase.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-22T10:00:00Z"
    },
    {
      id: "demo-011", name: "Beans", variety: "Rosecoco",
      category: "legumes", price: 140, quantity: 90, unit: "kg",
      location: "Embu", contact: "Demo seller — Embu",
      condition: "good",
      description: "Rosecoco beans in good condition. Sample listing.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-19T10:00:00Z"
    },
    {
      id: "demo-012", name: "Green Grams", variety: "Ndengu",
      category: "legumes", price: 130, quantity: 45, unit: "kg",
      location: "Kitui", contact: "Demo seller — Kitui",
      condition: "good",
      description: "Sample green grams listing. Confirm stock before arranging collection.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-20T11:00:00Z"
    },
    {
      id: "demo-013", name: "Dairy Cow", variety: "Friesian Cross",
      category: "livestock", price: 85000, quantity: 1, unit: "animal",
      location: "Nakuru", contact: "Demo seller — Nakuru",
      condition: "good",
      description: "Illustrative livestock listing. This is not a verified animal or offer.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-17T10:00:00Z"
    },
    {
      id: "demo-014", name: "Indigenous Chickens", variety: "Local Kienyeji",
      category: "livestock", price: 900, quantity: 10, unit: "animal",
      location: "Machakos", contact: "Demo seller — Machakos",
      condition: "good",
      description: "Example listing for indigenous chickens. Sample price only.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-21T11:00:00Z"
    },
    {
      id: "demo-015", name: "Seedlings", variety: "Tomato Seedlings",
      category: "farm-inputs", price: 5, quantity: 500, unit: "piece",
      location: "Kiambu", contact: "Demo seller — Kiambu",
      condition: "fresh",
      description: "Tomato seedlings for transplanting. Confirm variety and availability.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-22T11:00:00Z"
    },
    {
      id: "demo-016", name: "Organic Compost", variety: "Composted Manure",
      category: "farm-inputs", price: 250, quantity: 10, unit: "bag",
      location: "Nyeri", contact: "Demo seller — Nyeri",
      condition: "good",
      description: "Example compost listing. Bag size and composition should be confirmed.",
      image: "", seller: "Demo Farmer", createdAt: "2026-10-18T11:00:00Z"
    }
  ];

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn("Could not read demo storage:", key, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Could not save demo storage:", key, error);
      showToast("Your browser could not save this change. Check browser storage settings.");
      return false;
    }
  }

  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function makeId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function money(value) {
    return new Intl.NumberFormat("en-KE", {
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  }

  let products = readStorage(STORAGE.products, null);
  if (!Array.isArray(products)) {
    products = DEMO_PRODUCTS.map(product => ({ ...product }));
    writeStorage(STORAGE.products, products);
  }

  let favourites = readStorage(STORAGE.favourites, []);
  if (!Array.isArray(favourites)) favourites = [];

  let profile = readStorage(STORAGE.profile, null);
  let settings = readStorage(STORAGE.settings, {
    language: "en",
    tutorialSeen: false
  });

  let activeCategory = "all";
  let showFavouritesOnly = false;
  let searchTerm = "";
  let locationTerm = "";
  let tutorialStep = 0;
  let slideIndex = 0;
  let slidePaused = false;
  let slideTimer = null;

  /* ---------------- TOAST MESSAGES ---------------- */

  function showToast(message) {
    const container = $("#toastContainer");
    if (!container) {
      console.log(message);
      return;
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => {
      toast.classList.add("toast-hide");
      window.setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ---------------- MODALS ---------------- */

  function openModal(id) {
    const modal = typeof id === "string" ? document.getElementById(id) : id;
    if (!modal) return;

    $$(".modal.is-open").forEach(open => {
      if (open !== modal) closeModal(open);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const firstInput = $("input:not([type='hidden']), select, textarea, button", modal);
    if (firstInput) {
      window.setTimeout(() => firstInput.focus(), 80);
    }
  }

  function closeModal(modal) {
    if (typeof modal === "string") modal = document.getElementById(modal);
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    if (!$(".modal.is-open")) {
      document.body.classList.remove("modal-open");
    }
  }

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const opened = $(".modal.is-open");
      if (opened) closeModal(opened);
    }
  });

  /* ---------------- PRODUCT DISPLAY ---------------- */

  function productMatches(product) {
    if (activeCategory !== "all" && product.category !== activeCategory) {
      return false;
    }

    if (showFavouritesOnly && !favourites.includes(product.id)) {
      return false;
    }

    const search = searchTerm.trim().toLowerCase();
    const location = locationTerm.trim().toLowerCase();

    if (search) {
      const searchable = [
        product.name,
        product.variety,
        product.category,
        product.location,
        product.description,
        product.condition
      ].join(" ").toLowerCase();

      if (!searchable.includes(search)) return false;
    }

    if (location && !String(product.location).toLowerCase().includes(location)) {
      return false;
    }

    return true;
  }

  function getVisibleProducts() {
    const visible = products.filter(productMatches);
    const sort = $("#sortSelect")?.value || "newest";

    visible.sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return visible;
  }

  function productCard(product) {
    const category = CATEGORIES[product.category] || {
      label: product.category || "Other",
      emoji: "🌱"
    };

    const isSaved = favourites.includes(product.id);
    const image = String(product.image || "").trim();
    const safeImage = /^https?:\/\/\S+$/i.test(image) ? image : "";

    const photo = safeImage
      ? `<img class="product-photo" src="${safeText(safeImage)}" alt="${safeText(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="product-placeholder" style="display:none">${category.emoji}</div>`
      : `<div class="product-placeholder">${category.emoji}</div>`;

    return `
      <article class="product-card">
        <div class="product-card-media">
          ${photo}
          <span class="product-category-tag">${category.emoji} ${safeText(category.label)}</span>
          <button class="favourite-button ${isSaved ? "is-favourite" : ""}"
            type="button" data-favourite="${safeText(product.id)}"
            aria-label="${isSaved ? "Remove from" : "Add to"} saved items"
            aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
        </div>
        <div class="product-card-body">
          <div class="product-title-row">
            <div>
              <h3>${safeText(product.name)}</h3>
              <p class="product-variety">${safeText(product.variety)}</p>
            </div>
            <div class="product-price">KSh ${money(product.price)}<small> / ${safeText(product.unit)}</small></div>
          </div>
          <div class="product-meta">
            <span>📍 ${safeText(product.location)}</span>
            <span>📦 ${money(product.quantity)} ${safeText(product.unit)}</span>
          </div>
          <p class="product-condition"><strong>Condition:</strong> ${safeText(CONDITION_LABELS[product.condition] || product.condition || "Not specified")}</p>
          <p class="product-description">${safeText(product.description || "No description provided.")}</p>
          <div class="product-card-footer">
            <span class="seller-label">🌱 ${safeText(product.seller || "Demo seller")}</span>
            <button class="button button-outline product-contact-btn"
              type="button" data-contact="${safeText(product.id)}">View contact</button>
          </div>
        </div>
      </article>`;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;

    const visible = getVisibleProducts();

    if ($("#resultsCount")) {
      $("#resultsCount").textContent =
        `${visible.length} ${visible.length === 1 ? "product" : "products"} found` +
        (showFavouritesOnly ? " · Saved items" : "");
    }

    if ($("#listingHeading")) {
      $("#listingHeading").textContent = showFavouritesOnly
        ? "Your saved products"
        : activeCategory === "all"
          ? "Explore products"
          : `Explore ${CATEGORIES[activeCategory]?.label || activeCategory}`;
    }

    if ($("#favoritesFilterBtn")) {
      $("#favoritesFilterBtn").classList.toggle("is-active", showFavouritesOnly);
      $("#favoritesFilterBtn").setAttribute("aria-pressed", String(showFavouritesOnly));
      $("#favoritesFilterBtn").innerHTML =
        `${showFavouritesOnly ? "♥" : "♡"} <span>Saved items (${favourites.length})</span>`;
    }

    if ($("#statListings")) $("#statListings").textContent = String(products.length);
    if ($("#statCategories")) $("#statCategories").textContent = "8";

    if (!visible.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔎</div>
          <h3>No matching products yet</h3>
          <p>Try another product name, variety, location, or category.</p>
          <button class="button button-outline" type="button" id="emptyClearBtn">Clear filters</button>
          <button class="button button-primary" type="button" id="emptyListBtn">List a product</button>
        </div>`;
      $("#emptyClearBtn")?.addEventListener("click", clearFilters);
      $("#emptyListBtn")?.addEventListener("click", () => openModal("listingModal"));
      return;
    }

    grid.innerHTML = visible.map(productCard).join("");
  }

  function clearFilters() {
    activeCategory = "all";
    showFavouritesOnly = false;
    searchTerm = "";
    locationTerm = "";

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#locationInput")) $("#locationInput").value = "";

    $$("[data-category]").forEach(button => {
      button.classList.toggle("selected", button.dataset.category === "all");
      button.setAttribute("aria-pressed", String(button.dataset.category === "all"));
    });

    renderProducts();
  }

  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    searchTerm = $("#searchInput")?.value || "";
    locationTerm = $("#locationInput")?.value || "";
    showFavouritesOnly = false;
    renderProducts();

    $("#productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#searchInput")?.addEventListener("input", () => {
    searchTerm = $("#searchInput").value;
    showFavouritesOnly = false;
    renderProducts();
  });

  $("#locationInput")?.addEventListener("input", () => {
    locationTerm = $("#locationInput").value;
    renderProducts();
  });

  $("#sortSelect")?.addEventListener("change", renderProducts);

  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      showFavouritesOnly = false;

      $$("[data-category]").forEach(item => {
        const selected = item === button;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      renderProducts();
    });
  });

  $("#clearFiltersBtn")?.addEventListener("click", clearFilters);

  function toggleFavourite(id) {
    if (favourites.includes(id)) {
      favourites = favourites.filter(item => item !== id);
      showToast("Removed from saved items.");
    } else {
      favourites.push(id);
      showToast("Product saved to your favourites.");
    }

    writeStorage(STORAGE.favourites, favourites);
    renderProducts();
  }

  $("#productGrid")?.addEventListener("click", event => {
    const favouriteButton = event.target.closest("[data-favourite]");
    if (favouriteButton) {
      toggleFavourite(favouriteButton.dataset.favourite);
      return;
    }

    const contactButton = event.target.closest("[data-contact]");
    if (contactButton) {
      const product = products.find(item => item.id === contactButton.dataset.contact);
      if (!product) return;

      showToast(`Seller contact: ${product.contact || "Contact not provided"}`);
    }
  });

  $("#favoritesFilterBtn")?.addEventListener("click", () => {
    showFavouritesOnly = !showFavouritesOnly;
    renderProducts();
    $("#productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#featureFavoritesBtn")?.addEventListener("click", () => {
    showFavouritesOnly = true;
    renderProducts();
    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- CREATE A LISTING ---------------- */

  function openListingModal() {
    openModal("listingModal");
  }

  [
    "#openListingBtn",
    "#heroSellBtn",
    "#sectionSellBtn",
    "#ctaSellBtn"
  ].forEach(selector => {
    $(selector)?.addEventListener("click", openListingModal);
  });

  $("#listingForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const variety = String(data.get("variety") || "").trim();
    const category = String(data.get("category") || "");
    const condition = String(data.get("condition") || "");
    const price = Number(data.get("price"));
    const quantity = Number(data.get("quantity"));
    const unit = String(data.get("unit") || "");
    const location = String(data.get("location") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const image = String(data.get("image") || "").trim();
    const description = String(data.get("description") || "").trim();

    const feedback = $("#listingFeedback");

    if (!name || !variety || !CATEGORIES[category] ||
        !condition || !location || !contact || !description ||
        !Number.isFinite(price) || price < 0 ||
        !Number.isFinite(quantity) || quantity <= 0) {
      if (feedback) feedback.textContent = "Please complete all required fields with valid values.";
      return;
    }

    if (image && !/^https?:\/\/\S+$/i.test(image)) {
      if (feedback) feedback.textContent = "Please enter a valid image URL beginning with http:// or https://.";
      return;
    }

    const newProduct = {
      id: makeId("product"),
      name, variety, category, condition,
      price, quantity, unit, location, contact,
      image, description,
      seller: profile?.name || "Demo seller",
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);

    if (!writeStorage(STORAGE.products, products)) {
      products.shift();
      return;
    }

    activeCategory = "all";
    showFavouritesOnly = false;
    searchTerm = "";
    locationTerm = "";

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#locationInput")) $("#locationInput").value = "";

    $$("[data-category]").forEach(button => {
      const selected = button.dataset.category === "all";
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    form.reset();
    if (feedback) feedback.textContent = "";
    closeModal("listingModal");
    renderProducts();
    showToast("Your demo product has been published!");

    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- DEMO PROFILE ---------------- */

  function refreshProfileButton() {
    const button = $("#loginBtn");
    if (!button) return;

    button.textContent = profile?.name
      ? `Hi, ${profile.name}`
      : "My profile";
  }

  $("#loginBtn")?.addEventListener("click", () => {
    if (profile) {
      const nameInput = $("#demoUserName");
      const roleInput = $("#demoUserRole");
      if (nameInput) nameInput.value = profile.name || "";
      if (roleInput) roleInput.value = profile.role || "buyer";
    }
    openModal("loginModal");
  });

  $("#loginForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#demoUserName")?.value.trim() || "";
    const role = $("#demoUserRole")?.value || "buyer";

    if (!name) {
      showToast("Please enter a display name.");
      return;
    }

    profile = { name, role };
    if (!writeStorage(STORAGE.profile, profile)) return;

    refreshProfileButton();
    closeModal("loginModal");
    showToast(`Demo profile saved. Welcome, ${name}!`);
  });

  /* ---------------- SETTINGS AND LANGUAGES ---------------- */

  const TRANSLATIONS = {
    en: {
      announcement: "Growing Kenya together — one farm at a time.",
      navMarketplace: "Marketplace",
      navSmartAssist: "Smart Assist",
      navSacco: "SACCO Hub",
      navHowItWorks: "How it works",
      navSupport: "Help & support",
      myProfile: "My profile",
      listProduct: "List a product",
      heroEyebrow: "🇰🇪 MADE FOR KENYAN AGRICULTURE",
      heroTitle: "Good food.<br>Fair markets.<br>Stronger farmers.",
      heroDescription: "Discover fresh produce, connect with farmers, and bring the people who grow our food closer to the people who need it.",
      exploreMarketplace: "Explore marketplace",
      imFarmer: "I'm a farmer",
      simpleToUse: "Simple to use",
      localProduce: "Local produce",
      farmerFocused: "Farmer-focused",
      productsListed: "Products listed",
      productCategories: "Product categories",
      acrossKenya: "Across Kenya",
      localTrade: "Built for local trade",
      growTogether: "Grow together",
      supportFarmers: "Support local farmers",
      marketEyebrow: "THE MARKETPLACE",
      marketTitle: "What are you looking for?",
      marketDescription: "Find products by name, variety, location, or category.",
      sellProduce: "Sell your produce",
      browseCategories: "Browse categories",
      clearFilters: "Clear filters ↗",
      allProducts: "All products",
      fruits: "Fruits",
      vegetables: "Vegetables",
      nuts: "Nuts",
      starchyFoods: "Starchy foods",
      grains: "Grains",
      legumes: "Legumes",
      livestock: "Livestock",
      farmInputs: "Farm inputs",
      freshFinds: "FRESH FINDS",
      exploreProducts: "Explore products",
      savedItems: "Saved items",
      sortBy: "Sort:",
      cantFind: "Can't find what you need?",
      requestProduct: "Request a product",
      moreThanMarket: "MORE THAN A MARKET",
      toolsToGrow: "Tools that help you grow",
      toolsDescription: "Explore features designed to make agricultural trading easier.",
      smartAssist: "Smart Assist",
      smartAssistDescription: "Explore sample crop-care guidance, farming tips, and weather-planning information.",
      exploreSmartAssist: "Explore Smart Assist →",
      saccoHub: "SACCO Hub",
      saccoDescription: "Explore an illustrative directory of agricultural savings and cooperative resources.",
      exploreSacco: "Explore SACCO Hub →",
      yourFavourites: "Your favourites",
      favouritesDescription: "Keep interesting listings close and compare products before contacting a seller.",
      viewSavedProducts: "View saved products →",
      harvestEyebrow: "YOUR HARVEST HAS A MARKET",
      readyToList: "Ready to list your first product?",
      readyToListDescription: "Show buyers what you grow and help them discover your produce.",
      createListing: "Create a listing ↗",
      hereToHelp: "WE'RE HERE TO HELP",
      needAHand: "Need a hand?",
      supportDescription: "Get help with listings, search, language settings, and using the demo.",
      replayTutorial: "Replay the tutorial",
      sendSupportMessage: "Send a support message",
      supportDemoNotice: "This demo stores your message in this browser. It does not send an email.",
      supportTopicLabel: "What do you need help with?",
      yourMessage: "Your message",
      saveSupportMessage: "Save support message",
      footerTagline: "Built with purpose for Kenya's farming community.",
      settings: "Settings",
      sellOnShamba: "SELL ON SHAMBAMARKET",
      listYourProduct: "List your product",
      listingIntro: "Share a few details so buyers can discover your produce.",
      productNameLabel: "Product name *",
      varietyLabel: "Variety *",
      categoryLabel: "Product category *",
      conditionLabel: "Product condition *",
      priceLabel: "Price (KSh) *",
      quantityLabel: "Quantity available *",
      unitLabel: "Unit *",
      locationLabel: "County or town *",
      contactLabel: "Seller contact *",
      photoLabel: "Product photo (optional)",
      photoHelp: "Use a direct image URL. Do not enter private information.",
      conditionDescriptionLabel: "Describe the product and its condition *",
      descriptionHelp: "Be honest about freshness, ripeness, blemishes, packaging, and any defects.",
      listingDemoNotice: "Demo notice: your listing is saved in this browser and is not shared with other visitors.",
      cancel: "Cancel",
      publishDemoListing: "✓ Publish demo listing",
      yourSpace: "YOUR SPACE",
      demoProfileTitle: "Set up your demo profile",
      demoProfileDescription: "No password or real account is required for this demonstration.",
      displayNameLabel: "Your display name",
      roleLabel: "I am a...",
      saveDemoProfile: "Save demo profile",
      profileDemoNotice: "Your demo profile is stored only in this browser.",
      personalise: "MAKE IT YOURS",
      settingsIntro: "Choose how you want to use ShambaMarket.",
      preferredLanguage: "Preferred language",
      languageHelp: "Your choice will be saved in this browser. Some demo content may remain in English.",
      gettingStarted: "Getting started",
      tutorialHelp: "Want a quick guide to the main features?",
      startTutorial: "Start the tutorial",
      helpAndSupport: "Help & support",
      settingsSupportDescription: "Find help using the support section or send a demo support message.",
      openSupport: "Open help & support ↗",
      saveSettings: "Save settings",
      skipTutorial: "Skip tutorial",
      next: "Next →",
      helpUsImprove: "HELP US IMPROVE",
      requestProductTitle: "Request a product",
      requestProductDescription: "Tell us what you hoped to find. This is a demo request, not a confirmed order.",
      requestedProductLabel: "Product or variety",
      preferredLocationLabel: "Preferred location (optional)",
      saveDemoRequest: "Save demo request"
    },

    sw: {
      announcement: "Tujenge Kenya pamoja — shamba moja kwa wakati.",
      navMarketplace: "Soko",
      navSmartAssist: "Msaidizi wa Kilimo",
      navSacco: "Kitovu cha SACCO",
      navHowItWorks: "Jinsi inavyofanya kazi",
      navSupport: "Msaada",
      myProfile: "Wasifu wangu",
      listProduct: "Weka bidhaa",
      exploreMarketplace: "Tembelea soko",
      imFarmer: "Mimi ni mkulima",
      productsListed: "Bidhaa zilizowekwa",
      productCategories: "Aina za bidhaa",
      marketTitle: "Unatafuta nini?",
      marketDescription: "Tafuta bidhaa kwa jina, aina, eneo au kundi.",
      sellProduce: "Uza mazao yako",
      browseCategories: "Angalia makundi",
      clearFilters: "Ondoa vichujio ↗",
      allProducts: "Bidhaa zote",
      fruits: "Matunda",
      vegetables: "Mboga",
      nuts: "Karanga",
      starchyFoods: "Vyakula vya wanga",
      grains: "Nafaka",
      legumes: "Mikunde",
      livestock: "Mifugo",
      farmInputs: "Vifaa vya kilimo",
      exploreProducts: "Angalia bidhaa",
      savedItems: "Bidhaa zilizohifadhiwa",
      sortBy: "Panga:",
      cantFind: "Hujapata unachotafuta?",
      requestProduct: "Omba bidhaa",
      toolsToGrow: "Zana za kukusaidia kukua",
      smartAssist: "Msaidizi wa Kilimo",
      saccoHub: "Kitovu cha SACCO",
      yourFavourites: "Unazopenda",
      readyToList: "Uko tayari kuweka bidhaa yako ya kwanza?",
      createListing: "Weka bidhaa ↗",
      needAHand: "Unahitaji msaada?",
      supportDescription: "Pata msaada kuhusu bidhaa, utafutaji, lugha na matumizi ya demo.",
      replayTutorial: "Rudia mafunzo",
      sendSupportMessage: "Tuma ujumbe wa msaada",
      supportTopicLabel: "Unahitaji msaada kuhusu nini?",
      yourMessage: "Ujumbe wako",
      saveSupportMessage: "Hifadhi ujumbe",
      settings: "Mipangilio",
      listYourProduct: "Weka bidhaa yako",
      listingIntro: "Jaza maelezo ili wanunuzi wapate mazao yako.",
      productNameLabel: "Jina la bidhaa *",
      varietyLabel: "Aina ya zao *",
      categoryLabel: "Kundi la bidhaa *",
      conditionLabel: "Hali ya bidhaa *",
      priceLabel: "Bei (KSh) *",
      quantityLabel: "Kiasi kilichopo *",
      unitLabel: "Kipimo *",
      locationLabel: "Kaunti au mji *",
      contactLabel: "Mawasiliano ya muuzaji *",
      conditionDescriptionLabel: "Eleza bidhaa na hali yake *",
      cancel: "Ghairi",
      publishDemoListing: "✓ Chapisha bidhaa ya demo",
      demoProfileTitle: "Tengeneza wasifu wa demo",
      displayNameLabel: "Jina lako",
      roleLabel: "Mimi ni...",
      saveDemoProfile: "Hifadhi wasifu",
      preferredLanguage: "Lugha unayopendelea",
      gettingStarted: "Anza hapa",
      startTutorial: "Anza mafunzo",
      helpAndSupport: "Msaada",
      saveSettings: "Hifadhi mipangilio",
      skipTutorial: "Ruka mafunzo",
      next: "Endelea →",
      requestProductTitle: "Omba bidhaa",
      requestedProductLabel: "Bidhaa au aina ya zao",
      preferredLocationLabel: "Eneo unalopendelea (si lazima)",
      saveDemoRequest: "Hifadhi ombi"
    },

    sheng: {
      announcement: "Tujenge Kenya pamoja, shamba moja at a time.",
      navMarketplace: "Soko",
      navSmartAssist: "Smart Assist",
      navSacco: "SACCO Hub",
      navHowItWorks: "Inawork aje",
      navSupport: "Help",
      myProfile: "Profile yangu",
      listProduct: "Weka product",
      exploreMarketplace: "Angalia soko",
      imFarmer: "Mimi ni mkulima",
      productsListed: "Products zimewekwa",
      productCategories: "Aina za products",
      marketTitle: "Unatafuta nini?",
      marketDescription: "Search product kwa jina, variety, location ama category.",
      sellProduce: "Uza mazao yako",
      browseCategories: "Angalia categories",
      clearFilters: "Clear filters ↗",
      allProducts: "Products zote",
      fruits: "Matunda",
      vegetables: "Mboga",
      nuts: "Karanga",
      starchyFoods: "Vyakula vya wanga",
      grains: "Nafaka",
      legumes: "Mikunde",
      livestock: "Mifugo",
      farmInputs: "Vitu za kilimo",
      exploreProducts: "Angalia products",
      savedItems: "Zilizohifadhiwa",
      sortBy: "Panga:",
      cantFind: "Hujapata unataka?",
      requestProduct: "Request product",
      toolsToGrow: "Tools za kukusaidia kukua",
      smartAssist: "Smart Assist",
      saccoHub: "SACCO Hub",
      yourFavourites: "Favourites zako",
      readyToList: "Uko ready kuweka product yako ya kwanza?",
      createListing: "Weka listing ↗",
      needAHand: "Unahitaji help?",
      supportDescription: "Pata help kwa listings, search, language na kutumia demo.",
      replayTutorial: "Rudia tutorial",
      sendSupportMessage: "Tuma support message",
      supportTopicLabel: "Unahitaji help na nini?",
      yourMessage: "Ujumbe wako",
      saveSupportMessage: "Save message",
      settings: "Settings",
      listYourProduct: "Weka product yako",
      listingIntro: "Jaza details ili buyers wapate mazao yako.",
      productNameLabel: "Jina ya product *",
      varietyLabel: "Variety *",
      categoryLabel: "Category ya product *",
      conditionLabel: "Condition ya product *",
      priceLabel: "Bei (KSh) *",
      quantityLabel: "Quantity iko *",
      unitLabel: "Unit *",
      locationLabel: "County ama town *",
      contactLabel: "Contact ya seller *",
      conditionDescriptionLabel: "Eleza product na condition yake *",
      cancel: "Cancel",
      publishDemoListing: "✓ Publish demo listing",
      demoProfileTitle: "Set up demo profile yako",
      displayNameLabel: "Jina yako",
      roleLabel: "Wewe ni...",
      saveDemoProfile: "Save profile",
      preferredLanguage: "Language unataka",
      gettingStarted: "Anza hapa",
      startTutorial: "Anza tutorial",
      helpAndSupport: "Help & support",
      saveSettings: "Save settings",
      skipTutorial: "Skip tutorial",
      next: "Next →",
      requestProductTitle: "Request product",
      requestedProductLabel: "Product ama variety",
      preferredLocationLabel: "Location unataka (optional)",
      saveDemoRequest: "Save request"
    },

    mix: {
      navMarketplace: "Soko / Marketplace",
      navSmartAssist: "Msaidizi / Smart Assist",
      navSacco: "SACCO Hub",
      navSupport: "Msaada / Help",
      myProfile: "Wasifu / Profile",
      listProduct: "Weka product",
      exploreMarketplace: "Angalia soko / Explore",
      imFarmer: "Mimi ni farmer",
      productsListed: "Bidhaa / Products listed",
      productCategories: "Makundi / Categories",
      marketTitle: "Unatafuta nini? / What are you looking for?",
      marketDescription: "Search kwa jina, variety, location ama category.",
      sellProduce: "Uza mazao / Sell produce",
      browseCategories: "Angalia categories",
      clearFilters: "Clear filters",
      allProducts: "Bidhaa zote / All products",
      fruits: "Matunda / Fruits",
      vegetables: "Mboga / Vegetables",
      nuts: "Karanga / Nuts",
      starchyFoods: "Vyakula vya wanga / Starchy foods",
      grains: "Nafaka / Grains",
      legumes: "Mikunde / Legumes",
      livestock: "Mifugo / Livestock",
      farmInputs: "Vifaa vya kilimo / Farm inputs",
      exploreProducts: "Angalia products",
      savedItems: "Zilizohifadhiwa / Saved",
      sortBy: "Panga / Sort:",
      requestProduct: "Omba product",
      toolsToGrow: "Tools za kukusaidia kukua",
      smartAssist: "Smart Assist",
      saccoHub: "SACCO Hub",
      yourFavourites: "Favourites zako",
      readyToList: "Ready kuweka product yako ya kwanza?",
      createListing: "Weka listing",
      needAHand: "Unahitaji help?",
      replayTutorial: "Rudia tutorial",
      sendSupportMessage: "Tuma support message",
      yourMessage: "Ujumbe / Message",
      saveSupportMessage: "Hifadhi / Save message",
      settings: "Mipangilio / Settings",
      listYourProduct: "Weka product yako",
      productNameLabel: "Jina la product *",
      varietyLabel: "Variety *",
      categoryLabel: "Category ya product *",
      conditionLabel: "Condition ya product *",
      priceLabel: "Bei (KSh) *",
      quantityLabel: "Quantity available *",
      locationLabel: "County au town *",
      contactLabel: "Seller contact *",
      conditionDescriptionLabel: "Eleza product na condition yake *",
      publishDemoListing: "✓ Publish demo listing",
      preferredLanguage: "Lugha / Language",
      saveSettings: "Hifadhi / Save settings",
      skipTutorial: "Ruka / Skip tutorial",
      next: "Endelea / Next →"
    }
  };

  function applyLanguage(language) {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.en;

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (dictionary[key]) {
        // Only the hero heading intentionally contains HTML line breaks.
        if (key === "heroTitle") {
          element.innerHTML = dictionary[key];
        } else {
          element.textContent = dictionary[key];
        }
      }
    });

    document.documentElement.lang = language === "sw" ? "sw" : "en";
  }

  function openSettings() {
    if ($("#languageSelect")) {
      $("#languageSelect").value = settings.language || "en";
    }
    openModal("settingsModal");
  }

  [
    "#openSettingsBtn",
    "#mobileSettingsBtn",
    "#footerSettingsBtn"
  ].forEach(selector => {
    $(selector)?.addEventListener("click", openSettings);
  });

  $("#settingsForm")?.addEventListener("submit", event => {
    event.preventDefault();

    settings.language = $("#languageSelect")?.value || "en";
    if (!writeStorage(STORAGE.settings, settings)) return;

    applyLanguage(settings.language);
    closeModal("settingsModal");
    showToast("Settings saved in this browser.");
  });

  $("#languageSelect")?.addEventListener("change", event => {
    applyLanguage(event.target.value);
  });

  $("#settingsSupportLink")?.addEventListener("click", () => {
    closeModal("settingsModal");
  });

  /* ---------------- SUPPORT MESSAGES ---------------- */

  $("#supportForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const topic = $("#supportTopic")?.value || "";
    const message = $("#supportMessage")?.value.trim() || "";

    if (!topic || !message) {
      showToast("Please select a topic and enter your message.");
      return;
    }

    const savedMessages = readStorage(STORAGE.support, []);
    savedMessages.push({
      id: makeId("support"),
      topic,
      message,
      createdAt: new Date().toISOString()
    });

    if (!writeStorage(STORAGE.support, savedMessages)) return;

    $("#supportFeedback").textContent =
      "Your demo message has been saved in this browser. It has not been sent.";
    event.currentTarget.reset();
    showToast("Support message saved locally.");
  });

  /* ---------------- REQUEST A PRODUCT ---------------- */

  $("#requestProductBtn")?.addEventListener("click", () => {
    openModal("requestModal");
  });

  $("#requestForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const product = String(data.get("product") || "").trim();
    const location = String(data.get("location") || "").trim();

    if (!product) {
      showToast("Please enter the product you are looking for.");
      return;
    }

    const requests = readStorage(STORAGE.requests, []);
    requests.push({
      id: makeId("request"),
      product,
      location,
      createdAt: new Date().toISOString()
    });

    if (!writeStorage(STORAGE.requests, requests)) return;

    const feedback = $("#requestFeedback");
    if (feedback) {
      feedback.textContent = "Demo request saved. This is not an order or a live request to farmers.";
    }

    form.reset();
    showToast("Your demo product request has been saved.");
  });

  /* ---------------- MOBILE NAVIGATION ---------------- */

  const mobileMenuButton = $("#mobileMenuBtn");
  const mainNav = $("#mainNav");

  function closeMobileNav() {
    if (!mainNav || !mobileMenuButton) return;
    mainNav.classList.remove("is-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Open navigation");
    mobileMenuButton.textContent = "☰";
  }

  mobileMenuButton?.addEventListener("click", () => {
    if (!mainNav) return;

    const isOpen = mainNav.classList.toggle("is-open");
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    mobileMenuButton.textContent = isOpen ? "×" : "☰";
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  /* ---------------- HERO SLIDESHOW ---------------- */

  const slides = $$(".hero-slide");
  const captions = [
    "Growing together in Kenya",
    "Fresh produce, closer to buyers",
    "Supporting our farming community"
  ];

  function showSlide(index) {
    if (!slides.length) return;

    slideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
      slide.setAttribute("aria-hidden", String(i !== slideIndex));
    });

    if ($("#heroCaption")) {
      $("#heroCaption").textContent = captions[slideIndex] || captions[0];
    }

    if ($("#heroSlideCounter")) {
      $("#heroSlideCounter").textContent =
        `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }

    if ($("#heroPauseBtn")) {
      $("#heroPauseBtn").textContent = slidePaused ? "▶" : "Ⅱ";
      $("#heroPauseBtn").setAttribute("aria-label", slidePaused ? "Play slideshow" : "Pause slideshow");
    }
  }

  function startSlideshow() {
    window.clearInterval(slideTimer);
    if (slides.length < 2 || slidePaused) return;

    slideTimer = window.setInterval(() => {
      showSlide(slideIndex + 1);
    }, 6000);
  }

  $("#heroPrevBtn")?.addEventListener("click", () => {
    showSlide(slideIndex - 1);
    startSlideshow();
  });

  $("#heroNextBtn")?.addEventListener("click", () => {
    showSlide(slideIndex + 1);
    startSlideshow();
  });

  $("#heroPauseBtn")?.addEventListener("click", () => {
    slidePaused = !slidePaused;
    showSlide(slideIndex);
    startSlideshow();
  });

  showSlide(0);
  startSlideshow();

  /* ---------------- SKIPPABLE TUTORIAL ---------------- */

  const TUTORIAL_STEPS = [
    {
      emoji: "🌱",
      label: "WELCOME / 01",
      title: "Welcome to ShambaMarket",
      description: "A demonstration marketplace designed to help Kenyan farmers showcase products and help buyers discover produce."
    },
    {
      emoji: "🔎",
      label: "DISCOVER / 02",
      title: "Find the right product",
      description: "Search by product name or exact variety, filter by county, or browse the eight separate product categories."
    },
    {
      emoji: "🧺",
      label: "SELL / 03",
      title: "Create a product listing",
      description: "Add the variety, price, quantity, location, contact details and an honest description of the product's condition."
    },
    {
      emoji: "⭐",
      label: "PERSONALISE / 04",
      title: "Save your favourites",
      description: "Save listings, choose a language in Settings, and explore Smart Assist and SACCO Hub. You can skip this tutorial at any time."
    }
  ];

  function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step) return;

    if ($("#tutorialIllustration")) $("#tutorialIllustration").textContent = step.emoji;
    if ($("#tutorialStepLabel")) $("#tutorialStepLabel").textContent = step.label;
    if ($("#tutorialTitle")) $("#tutorialTitle").textContent = step.title;
    if ($("#tutorialDescription")) $("#tutorialDescription").textContent = step.description;

    const progress = $("#tutorialProgress");
    if (progress) {
      $$("span", progress).forEach((dot, index) => {
        dot.classList.toggle("active", index === tutorialStep);
      });
    }

    if ($("#nextTutorialBtn")) {
      $("#nextTutorialBtn").textContent =
        tutorialStep === TUTORIAL_STEPS.length - 1 ? "Finish ✓" : "Next →";
    }
  }

  function startTutorial() {
    tutorialStep = 0;
    renderTutorialStep();
    closeModal("settingsModal");
    openModal("tutorialModal");
  }

  function finishTutorial() {
    settings.tutorialSeen = true;
    writeStorage(STORAGE.settings, settings);
    writeStorage(STORAGE.tutorialSeen, true);
    closeModal("tutorialModal");
    showToast("You're ready to explore ShambaMarket!");
  }

  $("#replayTutorialBtn")?.addEventListener("click", startTutorial);
  $("#settingsTutorialBtn")?.addEventListener("click", startTutorial);

  $("#nextTutorialBtn")?.addEventListener("click", () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      tutorialStep++;
      renderTutorialStep();
    } else {
      finishTutorial();
    }
  });

  $("#skipTutorialBtn")?.addEventListener("click", finishTutorial);

  /* ---------------- FIRST VISIT AND STARTUP ---------------- */

  if ($("#currentYear")) {
    $("#currentYear").textContent = String(new Date().getFullYear());
  }

  applyLanguage(settings.language || "en");
  refreshProfileButton();
  renderProducts();

  const tutorialAlreadySeen =
    readStorage(STORAGE.tutorialSeen, false) ||
    settings.tutorialSeen === true;

  if (!tutorialAlreadySeen) {
    // A short delay lets the first page render before opening the tutorial.
    window.setTimeout(() => {
      if (!$(".modal.is-open")) startTutorial();
    }, 700);
  }

  console.info("ShambaMarket demo initialised successfully.");
});
