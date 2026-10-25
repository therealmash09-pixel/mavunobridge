(() => {
  "use strict";

  /* =====================================================
     MAVUNOBRIDGE — MARKETPLACE ENGINE
     Browser-only science fair demo; no backend required.
  ===================================================== */

  const STORAGE = {
    listings: "mavunobridge_listings_v6",
    cart: "mavunobridge_cart_v6",
    language: "mavunobridge_language_v2"
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const ROSECOCO_IMAGE =
    "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80";

  const CATEGORIES = [
    ["Fruits", "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"],
    ["Vegetables", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"],
    ["Nuts", "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80"],
    ["Starchy Foods", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"],
    ["Grains", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"],
    ["Cereals", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"],
    ["Legumes", ROSECOCO_IMAGE],
    ["Spices", "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=80"],
    ["Herbal Products", "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80"],
    ["Livestock", "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80"],
    ["Livestock Products", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80"],
    ["Farm Inputs", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"],
    ["Tools & Equipment", "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=600&q=80"],
    ["Farmer Services", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"]
  ];

  const COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
    "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
    "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
    "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
    "Migori", "Mombasa", "Murang'a", "Nairobi City", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
    "Samburu", "Siaya", "Taita-Taveta", "Tana River",
    "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
    "Vihiga", "Wajir", "West Pokot"
  ];

  // Illustrative ranges for the demo, not live market prices.
  const FAIR_GUIDE = [
    { name: "Tomatoes", min: 60, max: 110, match: n => n.includes("tomato") },
    { name: "Hass Avocados", min: 90, max: 180, match: n => n.includes("hass avocado") },
    { name: "Maize", min: 45, max: 80, match: n => n.includes("maize") }
  ];

  const DEMO_LISTINGS = [
    {
      id: "demo-avocado", demo: true, name: "Hass Avocados",
      category: "Fruits", county: "Kiambu", town: "Limuru",
      price: 120, unit: "kg", qty: "80 kg", sale: "Both",
      seller: "Limuru Fresh Farm", phone: "0711223344",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
      description: "Fresh Hass avocados from a sample farm.",
      createdAt: 1
    },
    {
      id: "demo-tomatoes", demo: true, name: "Fresh Tomatoes",
      category: "Vegetables", county: "Nakuru", town: "Naivasha",
      price: 75, unit: "kg", qty: "120 kg", sale: "Both",
      seller: "Naivasha Growers", phone: "0722334455",
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
      description: "Fresh tomatoes. Sample demo listing.",
      createdAt: 2
    },
    {
      id: "demo-maize", demo: true, name: "Dry Maize",
      category: "Grains", county: "Uasin Gishu", town: "Eldoret",
      price: 58, unit: "kg", qty: "300 kg", sale: "Bulk",
      seller: "Rift Valley Grain Hub", phone: "0733445566",
      image: "https://images.unsplash.com/photo-1601593768799-76f6c1d4b2f1?auto=format&fit=crop&w=700&q=80",
      description: "Dry maize for bulk buyers.",
      createdAt: 3
    },
    {
      id: "demo-beans", demo: true, name: "Rosecoco Beans",
      category: "Legumes", county: "Meru", town: "Meru",
      price: 150, unit: "kg", qty: "60 kg", sale: "Both",
      seller: "Meru Bean Farmers", phone: "0744556677",
      image: ROSECOCO_IMAGE,
      description: "Dry beans for home and business use.",
      createdAt: 4
    },
    {
      id: "demo-potatoes", demo: true, name: "Irish Potatoes",
      category: "Starchy Foods", county: "Nyandarua", town: "Ol Kalou",
      price: 65, unit: "kg", qty: "200 kg", sale: "Bulk",
      seller: "Nyandarua Potato Farm", phone: "0755667788",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
      description: "Potatoes for retailers and food businesses.",
      createdAt: 5
    },
    {
      id: "demo-green-grams", demo: true, name: "Green Grams",
      category: "Legumes", county: "Machakos", town: "Mwala",
      price: 180, unit: "kg", qty: "45 kg", sale: "Both",
      seller: "Machakos Dry Foods", phone: "0766778899",
      image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
      description: "Green grams from a sample seller.",
      createdAt: 6
    },
    {
      id: "demo-bananas", demo: true, name: "Bananas",
      category: "Fruits", county: "Kisumu", town: "Kisumu",
      price: 120, unit: "bunch", qty: "30 bunches", sale: "Retail",
      seller: "Lake Region Farm", phone: "0777889900",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
      description: "Bananas available in bunches.",
      createdAt: 7
    },
    {
      id: "demo-onions", demo: true, name: "Red Onions",
      category: "Vegetables", county: "Nakuru", town: "Gilgil",
      price: 95, unit: "kg", qty: "90 kg", sale: "Both",
      seller: "Gilgil Onion Growers", phone: "0788990011",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80",
      description: "Red onions for cooking and retail.",
      createdAt: 8
    },
    {
      id: "demo-millet", demo: true, name: "Finger Millet",
      category: "Cereals", county: "Kakamega", town: "Kakamega",
      price: 140, unit: "kg", qty: "70 kg", sale: "Bulk",
      seller: "Kakamega Wimbi Group", phone: "0799001122",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80",
      description: "Finger millet for food and milling.",
      createdAt: 9
    },
    {
      id: "demo-groundnuts", demo: true, name: "Groundnuts",
      category: "Nuts", county: "Kilifi", town: "Malindi",
      price: 220, unit: "kg", qty: "35 kg", sale: "Both",
      seller: "Coastal Harvest", phone: "0712345601",
      image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=80",
      description: "Groundnuts from a sample coastal seller.",
      createdAt: 10
    },
    {
      id: "demo-spice", demo: true, name: "Cinnamon",
      category: "Spices", county: "Kwale", town: "Ukunda",
      price: 450, unit: "kg", qty: "15 kg", sale: "Retail",
      seller: "Coast Spice Farm", phone: "0723456712",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=700&q=80",
      description: "Cinnamon for cooking and food businesses.",
      createdAt: 11
    },
    {
      id: "demo-herbs", demo: true, name: "Fresh Herbs",
      category: "Herbal Products", county: "Kiambu", town: "Thika",
      price: 80, unit: "bunch", qty: "25 bunches", sale: "Retail",
      seller: "Green Garden Farm", phone: "0700112233",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80",
      description: "Fresh garden herbs. Ask the seller for details.",
      createdAt: 12
    },
    {
      id: "demo-chicken", demo: true, name: "Indigenous Chickens",
      category: "Livestock", county: "Kakamega", town: "Shinyalu",
      price: 1200, unit: "animal", qty: "12 birds", sale: "Retail",
      seller: "Western Poultry Demo Farm", phone: "0700223344",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=80",
      description: "Sample livestock listing. Confirm age and availability with the seller.",
      createdAt: 13
    },
    {
      id: "demo-eggs", demo: true, name: "Fresh Eggs",
      category: "Livestock Products", county: "Kiambu", town: "Ruiru",
      price: 450, unit: "tray", qty: "20 trays", sale: "Both",
      seller: "Ruiru Poultry Demo Farm", phone: "0700334455",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80",
      description: "Sample egg listing. Confirm tray size with seller.",
      createdAt: 14
    },
    {
      id: "demo-seedlings", demo: true, name: "Vegetable Seedlings",
      category: "Farm Inputs", county: "Nakuru", town: "Njoro",
      price: 10, unit: "piece", qty: "500 seedlings", sale: "Both",
      seller: "Njoro Seedling Nursery", phone: "0700445566",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80",
      description: "Sample seedlings listing. Check variety before buying.",
      createdAt: 15
    },
    {
      id: "demo-tools", demo: true, name: "Garden Hand Tools",
      category: "Tools & Equipment", county: "Nairobi City", town: "Nairobi",
      price: 650, unit: "unit", qty: "10 sets", sale: "Retail",
      seller: "Farm Tools Demo Shop", phone: "0700556677",
      image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=700&q=80",
      description: "Sample listing for basic farm tools.",
      createdAt: 16
    },
    {
      id: "demo-plough", demo: true, name: "Land Ploughing Service",
      category: "Farmer Services", county: "Trans Nzoia", town: "Kitale",
      price: 3500, unit: "service", qty: "Bookings by arrangement", sale: "Both",
      seller: "Kitale Farm Services Demo", phone: "0700667788",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
      description: "Example ploughing service. Confirm acreage, date and final cost.",
      createdAt: 17
    },
    {
      id: "demo-wheat", demo: true, name: "Wheat Grain",
      category: "Grains", county: "Narok", town: "Narok",
      price: 72, unit: "kg", qty: "250 kg", sale: "Bulk",
      seller: "Narok Grain Growers", phone: "0790123489",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
      description: "Sample wheat listing for bulk buyers.",
      createdAt: 18
    },
    {
      id: "demo-mango", demo: true, name: "Apple Mangoes",
      category: "Fruits", county: "Makueni", town: "Wote",
      price: 100, unit: "kg", qty: "100 kg", sale: "Both",
      seller: "Wote Fruit Farm", phone: "0701234590",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80",
      description: "Sample seasonal mango listing.",
      createdAt: 19
    }
  ];

  let listings = [];
  let cart = [];
  let activeCategory = "All";
  let toastTimeout = null;
  let isPublishing = false;

  /* STORAGE */

  function loadStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Could not read browser storage:", error);
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Could not save browser storage:", error);
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function money(value) {
    return "KSh " + Number(value || 0).toLocaleString("en-KE", {
      maximumFractionDigits: 2
    });
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "listing-" + window.crypto.randomUUID();
    }
    return "listing-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }

  function normalizePhone(value) {
    return String(value || "").trim().replace(/[\s()-]/g, "");
  }

  function validPhone(value) {
    const phone = normalizePhone(value);
    return /^(\+?254|0)?[17]\d{8}$/.test(phone);
  }

  function loadData() {
    const savedListings = loadStorage(STORAGE.listings, []);
    const userListings = Array.isArray(savedListings)
      ? savedListings.filter(item =>
          item &&
          typeof item === "object" &&
          item.demo !== true &&
          item.id &&
          item.name &&
          item.category &&
          Number.isFinite(Number(item.price))
        )
      : [];

    // Keep demo listings separate so refreshes don't duplicate them.
    listings = [...DEMO_LISTINGS, ...userListings];

    const savedCart = loadStorage(STORAGE.cart, []);
    cart = Array.isArray(savedCart) ? savedCart : [];
  }

  function saveUserListings() {
    const userListings = listings.filter(item => item.demo !== true);
    return saveStorage(STORAGE.listings, userListings);
  }

  /* SELECTS AND CATEGORIES */

  function populateSelects() {
    const categoryFilter = $("#categoryFilter");
    const productCategory = $("#productCategory");
    const locationFilter = $("#locationFilter");
    const productCounty = $("#productCounty");

    if (categoryFilter) {
      const current = categoryFilter.value || "All";
      categoryFilter.innerHTML = '<option value="All">All categories</option>';
      CATEGORIES.forEach(([name]) => {
        categoryFilter.add(new Option(name, name));
      });
      categoryFilter.value = current;
    }

    if (productCategory) {
      productCategory.innerHTML = '<option value="">Choose a category</option>';
      CATEGORIES.forEach(([name]) => {
        productCategory.add(new Option(name, name));
      });
    }

    if (locationFilter) {
      const current = locationFilter.value || "All";
      locationFilter.innerHTML = '<option value="All">All counties</option>';
      COUNTIES.forEach(county => locationFilter.add(new Option(county, county)));
      locationFilter.value = current;
    }

    if (productCounty) {
      productCounty.innerHTML = '<option value="">Choose a county</option>';
      COUNTIES.forEach(county => productCounty.add(new Option(county, county)));
    }
  }

  function renderCategories() {
    const grid = $("#categoryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    CATEGORIES.forEach(([category, image]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(activeCategory === category));

      if (activeCategory === category) button.classList.add("selected");

      button.innerHTML = `
        <span class="cat-image"></span>
        <span class="cat-shade"></span>
        <span class="cat-name">${escapeHTML(category)}</span>
      `;

      const imageEl = button.querySelector(".cat-image");
      imageEl.style.backgroundImage = `url("${image}")`;

      // If the photo is dead or blocked, show a green tile so the card
      // still looks right (it keeps working as a filter button either way).
      const probe = new Image();
      probe.onerror = () => {
        imageEl.style.backgroundImage =
          "linear-gradient(135deg, #edf4e7, #cfe0c3)";
      };
      probe.src = image;

      grid.appendChild(button);
    });
  }

  function selectCategory(category, scroll = true) {
    const exists = category === "All" ||
      CATEGORIES.some(([name]) => name === category);

    activeCategory = exists ? category : "All";

    const filter = $("#categoryFilter");
    if (filter) filter.value = activeCategory;

    renderCategories();
    renderListings();

    const hint = $("#marketHint");
    if (hint) {
      hint.textContent = activeCategory === "All"
        ? "Discover products and services from Kenyan sellers."
        : `Showing ${activeCategory}. Chagua product unayohitaji.`;
    }

    if (scroll) {
      $("#marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /* FAIR PRICE GUIDE */

  function getFairPrice(item) {
    const name = String(item.name || "").toLowerCase();
    const guide = FAIR_GUIDE.find(entry => entry.match(name));

    if (!guide || item.unit !== "kg") {
      return {
        status: "no-guide",
        label: "No guide yet",
        detail: "No matching demo price guide."
      };
    }

    if (Number(item.price) < guide.min) {
      return {
        status: "below",
        label: "Below demo guide",
        detail: `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`
      };
    }

    if (Number(item.price) > guide.max) {
      return {
        status: "above",
        label: "Above demo guide",
        detail: `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`
      };
    }

    return {
      status: "within",
      label: "Within demo guide",
      detail: `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`
    };
  }

  /* FILTERING */

  function getFilteredListings() {
    const search = ($("#searchInput")?.value || "").trim().toLowerCase();
    const county = $("#locationFilter")?.value || "All";
    const saleType = $("#saleFilter")?.value || "All";
    const fairFilter = $("#fairPriceFilter")?.value || "All";
    const sort = $("#sortFilter")?.value || "recommended";

    const results = listings.filter(item => {
      const text = [
        item.name, item.category, item.county, item.town,
        item.seller, item.description, item.condition
      ].join(" ").toLowerCase();

      const categoryMatches =
        activeCategory === "All" || item.category === activeCategory;

      const countyMatches = county === "All" || item.county === county;

      // "Both" listings can satisfy either a retail or bulk filter.
      const saleMatches = saleType === "All" ||
        item.sale === saleType ||
        item.sale === "Both";

      const fairMatches = fairFilter === "All" ||
        getFairPrice(item).status === fairFilter;

      const searchMatches = !search || text.includes(search);

      return categoryMatches &&
        countyMatches &&
        saleMatches &&
        fairMatches &&
        searchMatches;
    });

    if (sort === "newest") {
      results.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    } else if (sort === "price-low") {
      results.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      results.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      results.sort((a, b) =>
        Number(Boolean(a.demo)) - Number(Boolean(b.demo))
      );
    }

    return results;
  }

  /* IMAGE FALLBACK */

  function setImageFallback(image) {
    if (!image || image.dataset.fallbackApplied === "yes") return;

    image.dataset.fallbackApplied = "yes";

    const fallback = document.createElement("div");
    fallback.className = "product-image-fallback";
    fallback.setAttribute("aria-label", "Product image unavailable");
    fallback.textContent = "🌱";

    image.replaceWith(fallback);
  }

  /* RENDER LISTINGS */

  function renderListings() {
    const grid = $("#listingGrid");
    if (!grid) return;

    const results = getFilteredListings();
    grid.innerHTML = "";

    results.forEach(item => {
      const fair = getFairPrice(item);
      const card = document.createElement("article");
      card.className = "product-card";

      const imageWrap = document.createElement("div");
      imageWrap.className = "product-image-wrap";

      const image = document.createElement("img");
      image.className = "product-image";
      image.alt = item.name || "Farm product";
      image.loading = "lazy";
      image.decoding = "async";
      image.src = item.image || "";

      image.addEventListener("error", () => setImageFallback(image), { once: true });
      imageWrap.appendChild(image);

      // No photo at all: show the fallback tile straight away.
      if (!item.image) setImageFallback(image);

      const saleBadge = document.createElement("span");
      saleBadge.className = "sale-badge";
      saleBadge.textContent = item.sale || "Retail";
      imageWrap.appendChild(saleBadge);

      if (item.demo) {
        const demoBadge = document.createElement("span");
        demoBadge.className = "demo-badge";
        demoBadge.textContent = "DEMO LISTING";
        imageWrap.appendChild(demoBadge);
      }

      const body = document.createElement("div");
      body.className = "product-body";

      const category = document.createElement("small");
      category.textContent = item.category || "Agriculture";

      const title = document.createElement("h3");
      title.textContent = item.name || "Untitled listing";

      const location = document.createElement("p");
      location.className = "location";
      location.textContent = `📍 ${[item.town, item.county].filter(Boolean).join(", ")}`;

      const price = document.createElement("div");
      price.className = "price";
      price.append(document.createTextNode(money(item.price)));

      const unit = document.createElement("span");
      unit.textContent = ` / ${item.unit || "unit"}`;
      price.appendChild(unit);

      const fairBadge = document.createElement("div");
      fairBadge.className = `fair fair-${fair.status}`;
      fairBadge.textContent = fair.label;

      const fairDetail = document.createElement("p");
      fairDetail.className = "fair-detail";
      fairDetail.textContent = fair.detail;

      const quantity = document.createElement("p");
      quantity.className = "quantity";
      quantity.textContent = `${item.qty || "Quantity on request"} · ${item.seller || "Seller"}`;

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "small primary";
      addButton.dataset.addCart = item.id;
      addButton.textContent = "Add to cart";

      const phone = normalizePhone(item.phone);
      const callLink = document.createElement("a");
      callLink.className = "small";
      callLink.textContent = "Contact seller";

      if (phone) {
        callLink.href = `tel:${phone}`;
      } else {
        callLink.href = "#";
        callLink.addEventListener("click", event => {
          event.preventDefault();
          showToast("No contact number was provided for this listing.");
        });
      }

      actions.append(addButton, callLink);
      body.append(category, title, location, price, fairBadge, fairDetail, quantity, actions);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    const resultCount = $("#resultCount");
    if (resultCount) {
      resultCount.textContent =
        `Showing ${results.length} listing${results.length === 1 ? "" : "s"}`;
    }

    const active = $("#activeCategory");
    if (active) {
      active.textContent = activeCategory === "All"
        ? ""
        : `Category: ${activeCategory}`;
    }

    const empty = $("#emptyState");
    if (empty) empty.classList.toggle("hidden", results.length > 0);

    grid.classList.toggle("hidden", results.length === 0);
  }

  /* MODALS */

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");

    const focusTarget = modal.querySelector(
      "input:not([type=file]), select, textarea, button"
    );
    focusTarget?.focus();
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("hidden");

    if (!$$(".modal:not(.hidden)").length) {
      document.body.classList.remove("modal-open");
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) {
      console.info(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    if (toastTimeout) window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function showListingError(message) {
    const error = $("#listingError");
    if (!error) {
      showToast(message);
      return;
    }

    error.textContent = message;
    error.classList.remove("hidden");
  }

  function clearListingError() {
    const error = $("#listingError");
    if (!error) return;
    error.textContent = "";
    error.classList.add("hidden");
  }

  /* IMAGE UPLOAD RESIZING */

  function readAndResizeImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("Please choose an image file."));
        return;
      }

      // Avoid excessive storage use in the demo.
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error("That photo is too large. Please choose one under 8 MB."));
        return;
      }

      const reader = new FileReader();

      reader.onerror = () => reject(new Error("Could not read the selected photo."));
      reader.onload = () => {
        const source = new Image();

        source.onerror = () => reject(new Error("That image could not be opened."));
        source.onload = () => {
          const maxDimension = 900;
          const ratio = Math.min(
            1,
            maxDimension / Math.max(source.width, source.height)
          );

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(source.width * ratio));
          canvas.height = Math.max(1, Math.round(source.height * ratio));

          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Your browser could not process that photo."));
            return;
          }

          context.drawImage(source, 0, 0, canvas.width, canvas.height);

          try {
            resolve(canvas.toDataURL("image/jpeg", 0.78));
          } catch {
            reject(new Error("Could not prepare the photo. Try a smaller image."));
          }
        };

        source.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });
  }

  /* CREATE AND SAVE LISTING — LISTING ISSUE FIX */

  async function handleListingSubmit(event) {
    event.preventDefault();

    if (isPublishing) return;

    clearListingError();

    const form = $("#listingForm");
    const publishButton = $("#publishListingButton");

    if (!form) {
      showToast("Listing form could not be found.");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = $("#productName")?.value.trim() || "";
    const category = $("#productCategory")?.value || "";
    const county = $("#productCounty")?.value || "";
    const town = $("#productTown")?.value.trim() || "";
    const qty = $("#productQuantity")?.value.trim() || "";
    const price = Number($("#productPrice")?.value);
    const unit = $("#productPriceUnit")?.value || "kg";
    const sale = $("#productSaleType")?.value || "Retail";
    const seller = $("#sellerName")?.value.trim() || "";
    const phone = normalizePhone($("#sellerPhone")?.value);
    const condition = $("#productCondition")?.value || "";
    const description = $("#productDescription")?.value.trim() || "";
    const harvestDate = $("#productHarvestDate")?.value || "";
    const file = $("#productImage")?.files?.[0] || null;

    if (!name || !category || !county || !qty || !seller || !phone) {
      showListingError("Tafadhali jaza required fields zote.");
      return;
    }

    if (!CATEGORIES.some(([label]) => label === category)) {
      showListingError("Please choose a valid product category.");
      return;
    }

    if (!COUNTIES.includes(county)) {
      showListingError("Please choose a valid county.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showListingError("Enter a price greater than zero.");
      return;
    }

    if (!validPhone(phone)) {
      showListingError("Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.");
      return;
    }

    isPublishing = true;

    if (publishButton) {
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";
    }

    try {
      const image = await readAndResizeImage(file);

      const newListing = {
        id: makeId(),
        demo: false,
        name,
        category,
        county,
        town,
        price,
        unit,
        qty,
        sale,
        seller,
        phone,
        condition,
        description,
        harvestDate,
        image,
        createdAt: Date.now()
      };

      listings = [...listings, newListing];

      // Try to save. If storage is full, retry without the photo.
      // If the browser blocks storage completely, keep the listing for
      // this visit only and say so, instead of failing with an error.
      let storageWorked = true;
      let photoDropped = false;

      if (!saveUserListings()) {
        const photo = newListing.image;
        newListing.image = "";

        if (photo && saveUserListings()) {
          photoDropped = true;
        } else {
          newListing.image = photo;
          storageWorked = false;
        }
      }

      // Clear search and filters so the new item is immediately visible.
      activeCategory = "All";

      if ($("#searchInput")) $("#searchInput").value = "";
      if ($("#categoryFilter")) $("#categoryFilter").value = "All";
      if ($("#locationFilter")) $("#locationFilter").value = "All";
      if ($("#saleFilter")) $("#saleFilter").value = "All";
      if ($("#fairPriceFilter")) $("#fairPriceFilter").value = "All";
      if ($("#sortFilter")) $("#sortFilter").value = "newest";

      renderCategories();
      renderListings();

      form.reset();
      closeModal("listingModal");

      if (!storageWorked) {
        showToast("Listing added, but your browser blocked saving. It will disappear when you refresh.");
      } else if (photoDropped) {
        showToast("Listing published without the photo (it was too big to save).");
      } else {
        showToast("Listing published! Iko live kwenye marketplace hii browser.");
      }

      $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Listing publish error:", error);
      showListingError(error.message || "Could not publish the listing. Please try again.");
    } finally {
      isPublishing = false;

      if (publishButton) {
        publishButton.disabled = false;
        publishButton.textContent = "Publish listing";
      }
    }
  }

  /* CART */

  function saveCart() {
    if (!saveStorage(STORAGE.cart, cart)) {
      showToast("Cart could not be saved in this browser.");
      return false;
    }
    return true;
  }

  function addToCart(id) {
    const item = listings.find(listing => listing.id === id);

    if (!item) {
      showToast("Listing not found. Refresh the page and try again.");
      return;
    }

    const existing = cart.find(entry => entry.id === id);

    if (existing) {
      existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
    } else {
      cart.push({ id, quantity: 1 });
    }

    if (saveCart()) {
      updateCartCount();
      showToast(`${item.name} added to your demo cart.`);
    }
  }

  function updateCartCount() {
    const count = $("#cartCount");
    if (!count) return;

    const total = cart.reduce(
      (sum, entry) => sum + Math.max(1, Number(entry.quantity || 1)),
      0
    );

    count.textContent = String(total);
  }

  function renderCart() {
    const container = $("#cartItems");
    if (!container) return;

    container.innerHTML = "";

    // Remove items that no longer exist.
    cart = cart.filter(entry => listings.some(item => item.id === entry.id));
    saveStorage(STORAGE.cart, cart);

    if (!cart.length) {
      container.innerHTML = "<p>Your cart is empty. Browse the marketplace to add items.</p>";
      updateCartCount();
      return;
    }

    let total = 0;

    cart.forEach(entry => {
      const item = listings.find(listing => listing.id === entry.id);
      if (!item) return;

      const quantity = Math.max(1, Number(entry.quantity || 1));
      total += Number(item.price) * quantity;

      const row = document.createElement("div");
      row.className = "cart-item";

      const info = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = item.name;

      const detail = document.createElement("p");
      detail.textContent =
        `${quantity} × ${money(item.price)} / ${item.unit} · ${item.seller}`;

      info.append(title, detail);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.dataset.removeCart = item.id;

      row.append(info, remove);
      container.appendChild(row);
    });

    const totalRow = document.createElement("p");
    totalRow.className = "cart-total";
    totalRow.style.fontWeight = "800";
    totalRow.style.marginTop = "18px";
    totalRow.textContent = `Demo subtotal: ${money(total)}`;
    container.appendChild(totalRow);

    updateCartCount();
  }

  function removeFromCart(id) {
    cart = cart.filter(entry => entry.id !== id);
    saveCart();
    renderCart();
    showToast("Item removed from cart.");
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    showToast("Cart cleared.");
  }

  /* FILTER EVENTS */

  function clearFilters() {
    activeCategory = "All";

    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#categoryFilter")) $("#categoryFilter").value = "All";
    if ($("#locationFilter")) $("#locationFilter").value = "All";
    if ($("#saleFilter")) $("#saleFilter").value = "All";
    if ($("#fairPriceFilter")) $("#fairPriceFilter").value = "All";
    if ($("#sortFilter")) $("#sortFilter").value = "recommended";

    const hint = $("#marketHint");
    if (hint) hint.textContent = "Discover products and services from Kenyan sellers.";

    renderCategories();
    renderListings();
  }

  function bindEvents() {
    $("#sellButton")?.addEventListener("click", () => openModal("listingModal"));
    $("#heroSellButton")?.addEventListener("click", () => openModal("listingModal"));
    $("#emptySellButton")?.addEventListener("click", () => openModal("listingModal"));

    $("#listingForm")?.addEventListener("submit", handleListingSubmit);

    $("#showAllButton")?.addEventListener("click", () => {
      clearFilters();
      $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
    });

    $("#categoryGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) selectCategory(button.dataset.category);
    });

    $("#categoryFilter")?.addEventListener("change", event => {
      activeCategory = event.target.value || "All";
      renderCategories();
      renderListings();

      const hint = $("#marketHint");
      if (hint) {
        hint.textContent = activeCategory === "All"
          ? "Discover products and services from Kenyan sellers."
          : `Showing ${activeCategory}. Chagua product unayohitaji.`;
      }
    });

    ["searchInput", "locationFilter", "saleFilter", "fairPriceFilter", "sortFilter"]
      .forEach(id => {
        document.getElementById(id)?.addEventListener(
          id === "searchInput" ? "input" : "change",
          renderListings
        );
      });

    $("#clearFiltersButton")?.addEventListener("click", clearFilters);

    $("#listingGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-add-cart]");
      if (button) addToCart(button.dataset.addCart);
    });

    $("#cartButton")?.addEventListener("click", () => {
      renderCart();
      openModal("cartModal");
    });

    $("#cartItems")?.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-cart]");
      if (button) removeFromCart(button.dataset.removeCart);
    });

    $("#clearCartButton")?.addEventListener("click", clearCart);

    $$("[data-close]").forEach(button => {
      button.addEventListener("click", () => closeModal(button.dataset.close));
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

    $("#menuButton")?.addEventListener("click", () => {
      const nav = $("#mainNav");
      const button = $("#menuButton");
      if (!nav || !button) return;

      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    $("#mainNav")?.addEventListener("click", event => {
      if (event.target.closest("a")) {
        $("#mainNav")?.classList.remove("open");
        $("#menuButton")?.setAttribute("aria-expanded", "false");
      }
    });

    $("#languageSelect")?.addEventListener("change", event => {
      const language = event.target.value;
      saveStorage(STORAGE.language, language);
      applyLanguage(language);
      showToast(
        language === "sw" ? "Lugha imebadilishwa." :
        language === "en" ? "Language changed to English." :
        "Language set to Sheng + English."
      );
    });
  }

  /* LIGHT LANGUAGE SUPPORT */

  function applyLanguage(language) {
    document.documentElement.lang = language === "sw" ? "sw" : "en";

    // Core interface labels. Product names and seller descriptions remain unchanged.
    const translations = {
      en: {
        marketplace: "Marketplace",
        create: "+ Create listing",
        search: "Search maize, beans, avocados...",
        allCategories: "All categories",
        allCounties: "All counties"
      },
      mix: {
        marketplace: "Marketplace",
        create: "+ Create listing",
        search: "Search maize, beans, avocados...",
        allCategories: "All categories",
        allCounties: "All counties"
      },
      sw: {
        marketplace: "Soko",
        create: "+ Tengeneza tangazo",
        search: "Tafuta mahindi, maharagwe, parachichi...",
        allCategories: "Aina zote",
        allCounties: "Kaunti zote"
      }
    };

    const t = translations[language] || translations.mix;
    const marketLink = $$(".main-nav a").find(a =>
      a.getAttribute("href") === "#marketplace"
    );

    if (marketLink) marketLink.textContent = t.marketplace;

    ["sellButton"].forEach(id => {
      const button = document.getElementById(id);
      if (button) button.textContent = t.create;
    });

    const search = $("#searchInput");
    if (search) search.placeholder = t.search;

    const category = $("#categoryFilter");
    if (category && category.options.length) {
      category.options[0].textContent = t.allCategories;
    }

    const county = $("#locationFilter");
    if (county && county.options.length) {
      county.options[0].textContent = t.allCounties;
    }
  }

  function restoreLanguage() {
    const saved = loadStorage(STORAGE.language, "mix");
    const select = $("#languageSelect");

    if (select) {
      select.value = ["mix", "en", "sw"].includes(saved) ? saved : "mix";
      applyLanguage(select.value);
    }
  }

  /* STARTUP */

  // Runs one startup step; if it throws, the error is logged and the
  // remaining steps (especially the buttons) still get set up.
  function safely(label, step) {
    try {
      step();
    } catch (error) {
      console.error(`MavunoBridge: "${label}" failed`, error);
    }
  }

  function init() {
    if (!$("#listingGrid")) {
      console.warn("Marketplace listing grid not found on this page.");
      return;
    }

    safely("load data", loadData);
    safely("fill dropdowns", populateSelects);
    safely("connect buttons", bindEvents);
    safely("draw categories", renderCategories);
    safely("draw listings", renderListings);
    safely("cart count", updateCartCount);
    safely("restore language", restoreLanguage);

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    console.info(
      `MavunoBridge ready: ${listings.length} listings loaded, including demo samples.`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
