/* =========================================================
   MAVUNOBRIDGE — MARKETPLACE ENGINE
   Demo mode: localStorage only, no Supabase, no real payments
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const KEY = {
    listings: "mavunobridge_listings_v2",
    cart: "mavunobridge_cart_v2",
    language: "mavunobridge_language_v2",
    orders: "mavunobridge_demo_orders_v1"
  };

  const counties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
    "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
    "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
    "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
    "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
    "Samburu", "Siaya", "Taita-Taveta", "Tana River",
    "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
    "Vihiga", "Wajir", "West Pokot"
  ];

  const categories = [
    ["all", "All products", "🌾"],
    ["fruits", "Fruits", "🍌"],
    ["vegetables", "Vegetables", "🥬"],
    ["nuts", "Nuts", "🥜"],
    ["starchy", "Starchy foods", "🥔"],
    ["grains", "Grains", "🌽"],
    ["cereals", "Cereals", "🌾"],
    ["legumes", "Legumes", "🫘"],
    ["spices", "Spices", "🌶️"],
    ["herbal", "Herbal products", "🌿"],
    ["livestock", "Livestock", "🐄"],
    ["inputs", "Farm inputs", "🧑🏽‍🌾"],
    ["tools", "Tools & equipment", "🛠️"],
    ["services", "Farmer services", "🚜"]
  ];

  /* Illustrative examples only, NOT live market prices. */
  const priceGuide = {
    "tomato": [60, 110],
    "hass avocado": [90, 180],
    "avocado": [90, 180],
    "maize": [45, 80],
    "dry beans": [100, 160],
    "beans": [100, 160],
    "potato": [35, 65],
    "green grams": [120, 190],
    "onion": [65, 120],
    "banana": [45, 95],
    "mango": [40, 100],
    "groundnuts": [140, 230],
    "sukuma wiki": [20, 50],
    "chilli": [100, 220]
  };

  const initialListings = [
    {
      id: "demo-avocado",
      name: "Hass Avocados",
      category: "fruits",
      county: "Kiambu",
      town: "Limuru",
      farmer: "Wanjiku Fresh Farm",
      phone: "0712345678",
      quantity: 85,
      unit: "kg",
      price: 130,
      saleType: "both",
      condition: "Fresh",
      quality: "A",
      harvestDate: new Date().toISOString().slice(0, 10),
      freshDays: 7,
      description: "Tree-ripened avocados, carefully sorted. Bulk orders welcome.",
      photo: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 1000
    },
    {
      id: "demo-tomatoes",
      name: "Tomatoes",
      category: "vegetables",
      county: "Nakuru",
      town: "Molo",
      farmer: "Rift Valley Growers",
      phone: "0723456789",
      quantity: 120,
      unit: "kg",
      price: 80,
      saleType: "bulk",
      condition: "Fresh",
      quality: "A",
      harvestDate: new Date().toISOString().slice(0, 10),
      freshDays: 4,
      description: "Firm red tomatoes from a local grower.",
      photo: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 2000
    },
    {
      id: "demo-beans",
      name: "Dry Beans",
      category: "legumes",
      county: "Meru",
      town: "Nkubu",
      farmer: "Mweru Family Farm",
      phone: "0734567890",
      quantity: 60,
      unit: "kg",
      price: 140,
      saleType: "both",
      condition: "Processed / dried",
      quality: "A",
      harvestDate: "",
      freshDays: 30,
      description: "Clean, dry beans stored in a cool, dry place.",
      photo: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 3000
    },
    {
      id: "demo-maize",
      name: "Dry Maize",
      category: "cereals",
      county: "Uasin Gishu",
      town: "Eldoret",
      farmer: "Chepkoilel Harvest",
      phone: "0745678901",
      quantity: 200,
      unit: "kg",
      price: 55,
      saleType: "bulk",
      condition: "Processed / dried",
      quality: "A",
      harvestDate: "",
      freshDays: 60,
      description: "Dry maize for household or milling orders.",
      photo: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 4000
    },
    {
      id: "demo-potatoes",
      name: "Irish Potatoes",
      category: "starchy",
      county: "Nyandarua",
      town: "Ol Kalou",
      farmer: "Aberdare Produce",
      phone: "0756789012",
      quantity: 95,
      unit: "kg",
      price: 50,
      saleType: "both",
      condition: "Good",
      quality: "B",
      harvestDate: "",
      freshDays: 14,
      description: "Mixed sizes available. Ask about a bulk deal.",
      photo: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 5000
    },
    {
      id: "demo-greengrams",
      name: "Green Grams",
      category: "legumes",
      county: "Machakos",
      town: "Kangundo",
      farmer: "Athi Plains Farm",
      phone: "0767890123",
      quantity: 45,
      unit: "kg",
      price: 150,
      saleType: "both",
      condition: "Processed / dried",
      quality: "A",
      harvestDate: "",
      freshDays: 60,
      description: "Green grams cleaned and ready for collection.",
      photo: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 6000
    },
    {
      id: "demo-bananas",
      name: "Sweet Bananas",
      category: "fruits",
      county: "Kisumu",
      town: "Ahero",
      farmer: "Lake Basin Farm",
      phone: "0778901234",
      quantity: 35,
      unit: "kg",
      price: 70,
      saleType: "retail",
      condition: "Fresh",
      quality: "A",
      harvestDate: new Date().toISOString().slice(0, 10),
      freshDays: 4,
      description: "Sweet bananas, ripe and ready to enjoy.",
      photo: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 7000
    },
    {
      id: "demo-onions",
      name: "Red Onions",
      category: "vegetables",
      county: "Nakuru",
      town: "Naivasha",
      farmer: "Green Basket Co-op",
      phone: "0789012345",
      quantity: 75,
      unit: "kg",
      price: 90,
      saleType: "both",
      condition: "Good",
      quality: "A",
      harvestDate: "",
      freshDays: 20,
      description: "Sorted red onions. Retail and wholesale enquiries welcome.",
      photo: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=80",
      createdAt: Date.now() - 8000
    }
  ];

  function readStore(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      notify("Browser storage is full. Try a smaller photo or remove old demo listings.");
      return false;
    }
  }

  let listings = readStore(KEY.listings, null);
  if (!Array.isArray(listings) || listings.length === 0) {
    listings = initialListings;
    writeStore(KEY.listings, listings);
  }

  let cart = readStore(KEY.cart, []);
  let activeCategory = "all";
  let selectedPhoto = "";
  let toastTimer;

  const languageText = {
    en: {
      market: "Marketplace",
      assist: "Smart Assist",
      messages: "Buyer Requests",
      cart: "Cart",
      eyebrow: "KENYA'S FARM-TO-MARKET BRIDGE",
      heroTitle: "Fresh harvests. Fairer deals. Stronger farmers.",
      heroText: "Connect directly with farmers and buyers across Kenya. Nunua fresh, uza smart.",
      explore: "Explore marketplace",
      sellProduce: "Sell your produce",
      grownHere: "Grown close to home",
      supportFarmers: "Support local farmers, grow local trade.",
      marketTitle: "Find your next harvest",
      marketSubtitle: "Browse produce, farm inputs, livestock and services.",
      listProduct: "+ List a product",
      searchPlaceholder: "Search tomatoes, maize, county..."
    },
    sw: {
      market: "Soko",
      assist: "Msaidizi wa Shamba",
      messages: "Maombi ya Wanunuzi",
      cart: "Kikapu",
      eyebrow: "DARaja LA SHAMBA HADI SOKO",
      heroTitle: "Mavuno fresh. Bei poa. Wakulima imara.",
      heroText: "Ungana moja kwa moja na wakulima na wanunuzi Kenya nzima. Nunua fresh, uza smart.",
      explore: "Angalia soko",
      sellProduce: "Uza mazao yako",
      grownHere: "Imelimwa karibu nawe",
      supportFarmers: "Support wakulima wa hapa, biashara ikue.",
      marketTitle: "Pata mavuno yako",
      marketSubtitle: "Angalia mazao, pembejeo, mifugo na huduma.",
      listProduct: "+ Weka bidhaa",
      searchPlaceholder: "Tafuta nyanya, mahindi, county..."
    },
    sheng: {
      market: "Soko",
      assist: "Smart Assist",
      messages: "Buyer Requests",
      cart: "Cart",
      eyebrow: "SHAMBA TO SOKO, VILE INATAKIWA",
      heroTitle: "Mavuno fresh. Deals fiti. Wakulima mbele.",
      heroText: "Connect na farmers na buyers Kenya mzima. Nunua fresh, uza smart.",
      explore: "Check soko",
      sellProduce: "List mazao",
      grownHere: "Imetoka shamba ya karibu",
      supportFarmers: "Support local farmers, biz isonge.",
      marketTitle: "Pata mavuno yako",
      marketSubtitle: "Check produce, farm inputs, mifugo na services.",
      listProduct: "+ List product",
      searchPlaceholder: "Search nyanya, maize, county..."
    }
  };

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function money(value) {
    return "KSh " + Number(value || 0).toLocaleString("en-KE", {
      maximumFractionDigits: 2
    });
  }

  function notify(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function priceGrade(name, price) {
    const productName = String(name || "").toLowerCase();
    const matchedKey = Object.keys(priceGuide).find(key =>
      productName.includes(key)
    );

    if (!matchedKey || price === "" || Number(price) <= 0) {
      return { grade: "N/A", text: "No reference range for this product yet.", range: null };
    }

    const [low, high] = priceGuide[matchedKey];
    const amount = Number(price);

    if (amount < low * 0.8 || amount > high * 1.25) {
      return {
        grade: "C",
        text: "Far outside the illustrative guide. Double-check the price.",
        range: [low, high]
      };
    }

    if (amount < low || amount > high) {
      return {
        grade: "B",
        text: "A little outside the illustrative guide. Review if needed.",
        range: [low, high]
      };
    }

    return {
      grade: "A",
      text: "Within the illustrative guide.",
      range: [low, high]
    };
  }

  function populateCountySelect(select, firstOption) {
    if (!select) return;
    select.innerHTML = firstOption + counties.map(county =>
      `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
    ).join("");
  }

  function initialiseFormOptions() {
    populateCountySelect($("#countyFilter"), '<option value="">All counties</option>');
    populateCountySelect($("#formCounty"), '<option value="">Choose county</option>');

    $("#formCategory").innerHTML = categories
      .filter(category => category[0] !== "all")
      .map(category =>
        `<option value="${category[0]}">${category[1]}</option>`
      ).join("");
  }

  function renderCategories() {
    const grid = $("#categoryGrid");
    if (!grid) return;

    grid.innerHTML = categories.map(([id, name, icon]) => {
      const count = id === "all"
        ? listings.length
        : listings.filter(item => item.category === id).length;

      return `
        <button type="button"
          class="category-card ${activeCategory === id ? "active" : ""}"
          data-category="${id}">
          <span class="cat-icon">${icon}</span>
          <b>${name}</b>
          <small>${count} ${count === 1 ? "listing" : "listings"}</small>
        </button>`;
    }).join("");

    grid.querySelectorAll("[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategories();
        renderListings();
      });
    });
  }

  function renderListings() {
    const grid = $("#listingGrid");
    if (!grid) return;

    const query = ($("#searchInput")?.value || "").trim().toLowerCase();
    const county = $("#countyFilter")?.value || "";
    const saleType = $("#saleFilter")?.value || "all";
    const sort = $("#sortFilter")?.value || "newest";
    const fairOnly = $("#fairOnly")?.checked || false;

    let rows = listings.filter(item => {
      const searchable = [
        item.name, item.county, item.town, item.farmer,
        item.description, item.category
      ].join(" ").toLowerCase();

      const categoryMatch =
        activeCategory === "all" || item.category === activeCategory;
      const countyMatch = !county || item.county === county;
      const searchMatch = !query || searchable.includes(query);
      const saleMatch =
        saleType === "all" ||
        item.saleType === "both" ||
        item.saleType === saleType;
      const priceMatch =
        !fairOnly || ["A", "N/A"].includes(priceGrade(item.name, item.price).grade);

      return categoryMatch && countyMatch && searchMatch && saleMatch && priceMatch;
    });

    rows.sort((a, b) => {
      if (sort === "priceLow") return Number(a.price) - Number(b.price);
      if (sort === "priceHigh") return Number(b.price) - Number(a.price);
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    });

    $("#listingCount").textContent =
      `${rows.length} ${rows.length === 1 ? "listing" : "listings"} · Illustrative price guide`;

    $("#emptyState").classList.toggle("hidden", rows.length > 0);

    grid.innerHTML = rows.map(item => {
      const fair = priceGrade(item.name, item.price);
      let freshness = null;

      if (item.harvestDate) {
        const daysPassed = Math.floor(
          (Date.now() - new Date(item.harvestDate).getTime()) / 86400000
        );
        freshness = Math.max(0, Number(item.freshDays || 5) - daysPassed);
      }

      return `
        <article class="product-card">
          <div class="product-photo">
            ${item.photo
              ? `<img loading="lazy" src="${escapeHTML(item.photo)}" alt="${escapeHTML(item.name)}" onerror="this.style.display='none'">`
              : `<div class="no-photo" aria-label="No product photo">🌱</div>`}
            <span class="pill">${escapeHTML(
              item.saleType === "both" ? "Retail + bulk" : item.saleType
            )}</span>
          </div>

          <div class="product-body">
            <div class="product-tags">
              <span class="tag">${escapeHTML(item.condition || "Good")}</span>
              <span class="tag">Grade ${escapeHTML(item.quality || "A")}</span>
            </div>

            <h3>${escapeHTML(item.name)}</h3>
            <p class="product-location">📍 ${escapeHTML(
              item.town ? item.town + ", " : ""
            )}${escapeHTML(item.county)} County</p>

            <div class="product-price">
              ${money(item.price)}
              <small>/ ${escapeHTML(item.unit || "unit")}</small>
            </div>

            <p class="product-description">${escapeHTML(
              item.description || "Ask the seller for more details."
            )}</p>

            <div class="product-tags">
              <span class="tag fair-${fair.grade}">Price guide: ${fair.grade}</span>
              ${freshness !== null
                ? `<span class="tag">${freshness === 0 ? "Check freshness" : freshness + " day window"}</span>`
                : ""}
            </div>

            <p class="product-location">
              By ${escapeHTML(item.farmer)} ·
              ${Number(item.quantity).toLocaleString()} ${escapeHTML(item.unit || "units")} available
            </p>

            <div class="product-actions">
              <button class="btn btn-primary" type="button" data-add="${escapeHTML(item.id)}">
                Add to cart
              </button>
              <a class="btn btn-outline"
                href="tel:${escapeHTML(item.phone || "")}"
                ${item.phone ? "" : 'aria-disabled="true"'}>
                Call seller
              </a>
            </div>

            <div class="product-actions">
              <button class="btn btn-light" type="button" data-ask="${escapeHTML(item.id)}">
                Ask / reserve
              </button>
              <button class="btn btn-light" type="button" data-trace="${escapeHTML(item.id)}">
                Traceability
              </button>
            </div>
          </div>
        </article>`;
    }).join("");

    grid.querySelectorAll("[data-add]").forEach(button => {
      button.addEventListener("click", () => addToCart(button.dataset.add));
    });

    grid.querySelectorAll("[data-ask]").forEach(button => {
      button.addEventListener("click", () => {
        const item = listings.find(product => product.id === button.dataset.ask);
        if (!item) return;

        const message =
          `Enquiry about ${item.name} in ${item.county}. ` +
          `Please confirm current stock, grade, final price and delivery. ` +
          `Seller: ${item.farmer}, ${item.phone}`;

        const url = "messages.html";
        sessionStorage.setItem("mavunobridge_prefill_demand", message);
        window.location.href = url;
      });
    });

    grid.querySelectorAll("[data-trace]").forEach(button => {
      button.addEventListener("click", () => {
        const item = listings.find(product => product.id === button.dataset.trace);
        if (!item) return;

        alert(
          "MAVUNOBRIDGE DEMO TRACEABILITY\n\n" +
          `Product: ${item.name}\n` +
          `Seller: ${item.farmer}\n` +
          `County: ${item.county}\n` +
          `Harvest date: ${item.harvestDate || "Not provided"}\n` +
          `Listing ID: ${item.id}\n\n` +
          "Demo record only. Details have not been independently verified."
        );
      });
    });
  }

  function addToCart(id) {
    const product = listings.find(item => item.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
      if (existing.qty + 1 > Number(product.quantity)) {
        notify("That is all the listed stock available.");
        return;
      }
      existing.qty += 1;
    } else {
      if (Number(product.quantity) < 1) {
        notify("This listing has no stock available.");
        return;
      }
      cart.push({ id, qty: 1 });
    }

    writeStore(KEY.cart, cart);
    renderCartCount();
    notify("Added to cart. Sawa!");
  }

  function renderCartCount() {
    const count = $("#cartCount");
    if (count) {
      count.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
  }

  function renderCart() {
    const box = $("#cartItems");
    if (!box) return;

    cart = cart.filter(cartItem =>
      listings.some(product => product.id === cartItem.id)
    );

    box.innerHTML = cart.length
      ? cart.map(cartItem => {
          const product = listings.find(item => item.id === cartItem.id);
          return `
            <div class="cart-row">
              <div>
                <h3>${escapeHTML(product.name)}</h3>
                <p>${money(product.price)} / ${escapeHTML(product.unit)} · ${escapeHTML(product.county)}</p>
                <b>${money(product.price * cartItem.qty)}</b>
              </div>
              <div class="cart-controls">
                <button type="button" data-minus="${escapeHTML(cartItem.id)}" aria-label="Decrease quantity">−</button>
                <span>${cartItem.qty}</span>
                <button type="button" data-plus="${escapeHTML(cartItem.id)}" aria-label="Increase quantity">+</button>
                <button type="button" data-remove="${escapeHTML(cartItem.id)}" aria-label="Remove item">×</button>
              </div>
            </div>`;
        }).join("")
      : "<p>Your cart is empty. Add something from the marketplace first.</p>";

    const total = cart.reduce((sum, cartItem) => {
      const product = listings.find(item => item.id === cartItem.id);
      return sum + (product ? Number(product.price) * cartItem.qty : 0);
    }, 0);

    $("#cartTotal").textContent = money(total);

    box.querySelectorAll("[data-minus]").forEach(button => {
      button.onclick = () => changeQuantity(button.dataset.minus, -1);
    });

    box.querySelectorAll("[data-plus]").forEach(button => {
      button.onclick = () => changeQuantity(button.dataset.plus, 1);
    });

    box.querySelectorAll("[data-remove]").forEach(button => {
      button.onclick = () => {
        cart = cart.filter(item => item.id !== button.dataset.remove);
        writeStore(KEY.cart, cart);
        renderCart();
        renderCartCount();
      };
    });
  }

  function changeQuantity(id, difference) {
    const cartItem = cart.find(item => item.id === id);
    const product = listings.find(item => item.id === id);
    if (!cartItem || !product) return;

    if (difference > 0 && cartItem.qty + 1 > Number(product.quantity)) {
      notify("Not enough listed stock.");
      return;
    }

    cartItem.qty += difference;

    if (cartItem.qty < 1) {
      cart = cart.filter(item => item.id !== id);
    }

    writeStore(KEY.cart, cart);
    renderCart();
    renderCartCount();
  }

  function openModal(id) {
    const modal = $("#" + id);
    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (id === "cartModal") renderCart();
  }

  function closeModal(id) {
    const modal = $("#" + id);
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function updatePricePreview() {
    const form = $("#listingForm");
    if (!form) return;

    const name = form.elements.name.value;
    const price = form.elements.price.value;
    const result = priceGrade(name, price);

    $("#priceCheck").innerHTML = `
      <b>Fair-price checker · Grade ${result.grade}</b>
      <p>${escapeHTML(result.text)}
      ${result.range
        ? ` Reference: ${money(result.range[0])}–${money(result.range[1])} per kg (illustrative).`
        : ""}</p>
      <small>This is not a live price feed and does not grade honesty or quality.</small>`;
  }

  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");

      if (!file.type.startsWith("image/")) {
        reject(new Error("Please choose an image file."));
        return;
      }

      if (file.size > 1.2 * 1024 * 1024) {
        reject(new Error("Please choose a photo smaller than 1.2 MB."));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read that image."));
      reader.readAsDataURL(file);
    });
  }

  async function publishListing(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const item = {
      id: "user-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: String(data.get("name") || "").trim(),
      category: data.get("category"),
      county: data.get("county"),
      town: String(data.get("town") || "").trim(),
      farmer: String(data.get("farmer") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      quantity: Number(data.get("quantity")),
      unit: data.get("unit"),
      price: Number(data.get("price")),
      saleType: data.get("saleType"),
      condition: data.get("condition"),
      harvestDate: data.get("harvestDate"),
      freshDays: Number(data.get("freshDays") || 5),
      description: String(data.get("description") || "").trim(),
      quality: data.get("quality"),
      photo: selectedPhoto,
      createdAt: Date.now()
    };

    if (
      !item.name || !item.category || !item.county ||
      !item.farmer || !item.phone ||
      !Number.isFinite(item.quantity) || item.quantity <= 0 ||
      !Number.isFinite(item.price) || item.price <= 0
    ) {
      notify("Please complete the required fields with valid values.");
      return;
    }

    const oldListings = listings;
    listings = [item, ...listings];

    if (!writeStore(KEY.listings, listings)) {
      listings = oldListings;
      return;
    }

    form.reset();
    selectedPhoto = "";
    $("#photoPreview").classList.add("hidden");
    closeModal("listingModal");

    activeCategory = "all";
    renderAll();
    notify("Listing published in this browser. Nice one!");
    $("#market").scrollIntoView({ behavior: "smooth" });
  }

  function setupSlideshow() {
    const slides = [
      {
        src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
        alt: "Green farmland"
      },
      {
        src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85",
        alt: "Agricultural field"
      },
      {
        src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
        alt: "Fresh market produce"
      }
    ];

    const image = $("#heroImage");
    const dots = $("#slideDots");
    if (!image || !dots) return;

    let index = 0;
    let timer;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      image.src = slides[index].src;
      image.alt = slides[index].alt;
      dots.textContent = slides.map((_, i) => i === index ? "●" : "○").join(" ");
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!document.hidden) showSlide(index + 1);
      }, 6500);
    }

    $("#slidePrev").onclick = () => showSlide(index - 1);
    $("#slideNext").onclick = () => showSlide(index + 1);
    image.addEventListener("mouseenter", () => clearInterval(timer));
    image.addEventListener("mouseleave", startTimer);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer);
      else startTimer();
    });

    startTimer();
  }

  function applyLanguage(language) {
    const dictionary = languageText[language] || languageText.en;
    writeStore(KEY.language, language);

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (dictionary[key]) element.textContent = dictionary[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      if (dictionary[key]) element.placeholder = dictionary[key];
    });
  }

  function renderAll() {
    renderCategories();
    renderListings();
    renderCartCount();
  }

  function initialise() {
    initialiseFormOptions();
    renderAll();
    setupSlideshow();

    const savedLanguage = readStore(KEY.language, "en");
    $("#languageSelect").value = savedLanguage;
    applyLanguage(savedLanguage);

    $("#languageSelect").addEventListener("change", event => {
      applyLanguage(event.target.value);
    });

    $("#menuToggle").addEventListener("click", () => {
      $("#mainNav").classList.toggle("open");
    });

    $("#sellButton").addEventListener("click", () => openModal("listingModal"));
    $("#heroSellButton").addEventListener("click", () => openModal("listingModal"));
    $("#emptySell").addEventListener("click", () => openModal("listingModal"));
    $("#openCart").addEventListener("click", () => openModal("cartModal"));

    document.querySelectorAll("[data-close]").forEach(button => {
      button.addEventListener("click", () => closeModal(button.dataset.close));
    });

    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", event => {
        if (event.target === backdrop) closeModal(backdrop.id);
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach(modal => {
          closeModal(modal.id);
        });
      }
    });

    $("#searchInput").addEventListener("input", renderListings);
    $("#countyFilter").addEventListener("change", renderListings);
    $("#saleFilter").addEventListener("change", renderListings);
    $("#sortFilter").addEventListener("change", renderListings);
    $("#fairOnly").addEventListener("change", renderListings);

    $("#listingForm").addEventListener("submit", publishListing);
    $("#listingForm").elements.name.addEventListener("input", updatePricePreview);
    $("#listingForm").elements.price.addEventListener("input", updatePricePreview);

    $("#photoInput").addEventListener("change", async event => {
      try {
        selectedPhoto = await readPhoto(event.target.files[0]);

        if (selectedPhoto) {
          $("#photoPreview").src = selectedPhoto;
          $("#photoPreview").classList.remove("hidden");
        } else {
          $("#photoPreview").classList.add("hidden");
        }
      } catch (error) {
        event.target.value = "";
        selectedPhoto = "";
        notify(error.message);
      }
    });

    $("#checkoutButton").addEventListener("click", () => {
      if (!cart.length) {
        notify("Your cart is empty.");
        return;
      }

      const orders = readStore(KEY.orders, []);
      const total = cart.reduce((sum, cartItem) => {
        const product = listings.find(item => item.id === cartItem.id);
        return sum + (product ? Number(product.price) * cartItem.qty : 0);
      }, 0);

      const order = {
        id: "MB-" + Date.now().toString().slice(-7),
        items: cart.map(cartItem => {
          const product = listings.find(item => item.id === cartItem.id);
          return {
            id: cartItem.id,
            name: product?.name || "Product",
            qty: cartItem.qty
          };
        }),
        total,
        fulfilment: $("#fulfilment").value,
        status: "Demo order created — contact sellers to confirm",
        date: new Date().toLocaleString()
      };

      orders.unshift(order);

      if (!writeStore(KEY.orders, orders)) return;

      cart = [];
      writeStore(KEY.cart, cart);
      renderCart();
      renderCartCount();
      closeModal("cartModal");

      alert(
        `Demo order ${order.id} created.\n` +
        `Estimated total: ${money(total)}.\n\n` +
        "No payment was taken. This order is saved in this browser only."
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise);
  } else {
    initialise();
  }
})();
