/* =========================================================
   SHAMBAMARKET
   MARKETPLACE ENGINE
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {
  listings: "shambamarket_listings_v4",
  cart: "shambamarket_cart_v4",
  language: "shambamarket_language_v2"
};


/* =========================================================
   FAIR PRICE GUIDE
   IMPORTANT:
   These are indicative demo/reference ranges.
   They are NOT official government prices.
========================================================= */

const FAIR_PRICE_GUIDE = {

  "Tomatoes|kg": {
    min: 60,
    max: 110
  },

  "Hass Avocados|kg": {
    min: 90,
    max: 180
  },

  "Avocados|kg": {
    min: 70,
    max: 150
  },

  "Onions|kg": {
    min: 70,
    max: 130
  },

  "Potatoes|kg": {
    min: 50,
    max: 100
  },

  "Kale|kg": {
    min: 50,
    max: 100
  },

  "Sukuma Wiki|kg": {
    min: 50,
    max: 100
  },

  "Maize|kg": {
    min: 45,
    max: 80
  },

  "Beans|kg": {
    min: 120,
    max: 190
  },

  "Green Grams|kg": {
    min: 140,
    max: 220
  },

  "Groundnuts|kg": {
    min: 150,
    max: 250
  },

  "Bananas|kg": {
    min: 60,
    max: 120
  },

  "Oranges|kg": {
    min: 60,
    max: 120
  },

  "Sweet Potatoes|kg": {
    min: 50,
    max: 100
  }

};


/* =========================================================
   DEMO PRODUCTS
========================================================= */

const DEMO_LISTINGS = [

  {
    id: "demo-1",
    name: "Hass Avocados",
    category: "fruits",
    saleType: "both",
    retailPrice: 140,
    retailUnit: "kg",
    bulkPrice: 110,
    bulkUnit: "kg",
    bulkMinimum: 10,
    quantity: 250,
    stockUnit: "kg",
    location: "Kiambu",
    seller: "Green Valley Farm",
    phone: "0700000001",
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80",
    description:
      "Fresh Hass avocados harvested from a local farm.",
    createdAt: Date.now() - 100000
  },


  {
    id: "demo-2",
    name: "Tomatoes",
    category: "vegetables",
    saleType: "retail",
    retailPrice: 80,
    retailUnit: "kg",
    quantity: 180,
    stockUnit: "kg",
    location: "Nakuru",
    seller: "Nakuru Fresh Produce",
    phone: "0700000002",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
    description:
      "Fresh red tomatoes suitable for homes, restaurants and retailers.",
    createdAt: Date.now() - 200000
  },


  {
    id: "demo-3",
    name: "Beans",
    category: "legumes",
    saleType: "both",
    retailPrice: 170,
    retailUnit: "kg",
    bulkPrice: 145,
    bulkUnit: "kg",
    bulkMinimum: 20,
    quantity: 500,
    stockUnit: "kg",
    location: "Meru",
    seller: "Meru Farmers Group",
    phone: "0700000003",
    image:
      "https://images.unsplash.com/photo-1551462147-ff29053b8b7f?auto=format&fit=crop&w=900&q=80",
    description:
      "Clean, dry beans available for household and bulk buyers.",
    createdAt: Date.now() - 300000
  },


  {
    id: "demo-4",
    name: "Maize",
    category: "grains",
    saleType: "bulk",
    bulkPrice: 65,
    bulkUnit: "kg",
    bulkMinimum: 20,
    quantity: 1000,
    stockUnit: "kg",
    location: "Uasin Gishu",
    seller: "North Rift Grain Hub",
    phone: "0700000004",
    image:
      "https://images.unsplash.com/photo-1601598851547-4302969d4a8e?auto=format&fit=crop&w=900&q=80",
    description:
      "Quality maize available for bulk agricultural buyers.",
    createdAt: Date.now() - 400000
  },


  {
    id: "demo-5",
    name: "Potatoes",
    category: "starchy",
    saleType: "both",
    retailPrice: 85,
    retailUnit: "kg",
    bulkPrice: 65,
    bulkUnit: "kg",
    bulkMinimum: 20,
    quantity: 700,
    stockUnit: "kg",
    location: "Nyandarua",
    seller: "Highland Potato Farmers",
    phone: "0700000005",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    description:
      "Fresh highland potatoes available in retail and bulk quantities.",
    createdAt: Date.now() - 500000
  },


  {
    id: "demo-6",
    name: "Green Grams",
    category: "legumes",
    saleType: "retail",
    retailPrice: 190,
    retailUnit: "kg",
    quantity: 200,
    stockUnit: "kg",
    location: "Machakos",
    seller: "Eastern Growers",
    phone: "0700000006",
    image:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80",
    description:
      "Clean green grams from Eastern Kenya.",
    createdAt: Date.now() - 600000
  },


  {
    id: "demo-7",
    name: "Bananas",
    category: "fruits",
    saleType: "retail",
    retailPrice: 90,
    retailUnit: "kg",
    quantity: 300,
    stockUnit: "kg",
    location: "Kisumu",
    seller: "Lake Region Farmers",
    phone: "0700000007",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
    description:
      "Fresh bananas supplied directly from farmers.",
    createdAt: Date.now() - 700000
  },


  {
    id: "demo-8",
    name: "Onions",
    category: "vegetables",
    saleType: "retail",
    retailPrice: 105,
    retailUnit: "kg",
    quantity: 250,
    stockUnit: "kg",
    location: "Nakuru",
    seller: "Rift Valley Produce",
    phone: "0700000008",
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80",
    description:
      "Dry onions suitable for home and commercial use.",
    createdAt: Date.now() - 800000
  }

];


/* =========================================================
   STATE
========================================================= */

let listings = [];
let cart = [];

let activeCategory = "all";
let activeSaleFilter = "all";
let activeLocation = "all";
let activeSearch = "";
let activeSort = "newest";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  loadData();

  setupNavigation();

  setupSearch();

  setupCategories();

  setupFilters();

  setupListingModal();

  setupCart();

  setupLogin();

  setupSmartAssist();

  setupLanguage();

  updateYear();

  renderMarketplace();

  renderCart();

});


/* =========================================================
   STORAGE
========================================================= */

function loadData() {

  const savedListings =
    localStorage.getItem(STORAGE_KEYS.listings);

  const savedCart =
    localStorage.getItem(STORAGE_KEYS.cart);

  if (savedListings) {

    try {
      listings = JSON.parse(savedListings);
    } catch {
      listings = [...DEMO_LISTINGS];
    }

  } else {

    listings = [...DEMO_LISTINGS];

  }


  if (savedCart) {

    try {
      cart = JSON.parse(savedCart);
    } catch {
      cart = [];
    }

  } else {

    cart = [];

  }

}


function saveListings() {

  localStorage.setItem(
    STORAGE_KEYS.listings,
    JSON.stringify(listings)
  );

}


function saveCart() {

  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify(cart)
  );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");

  if (menuToggle && mobileNav) {

    menuToggle.addEventListener("click", () => {

      mobileNav.classList.toggle("open");

    });

  }


  $$(".mobile-nav a").forEach(link => {

    link.addEventListener("click", () => {

      mobileNav?.classList.remove("open");

    });

  });


  $("#sellButton")?.addEventListener(
    "click",
    openListingModal
  );


  $("#heroSellButton")?.addEventListener(
    "click",
    openListingModal
  );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

  const form = $("#searchForm");

  if (!form) return;

  form.addEventListener("submit", event => {

    event.preventDefault();

    activeSearch =
      $("#searchInput")?.value
        .trim()
        .toLowerCase() || "";

    const searchCategory =
      $("#searchCategory")?.value || "all";


    if (searchCategory === "produce") {

      activeCategory = "all";

    }

    if (searchCategory === "inputs") {

      activeCategory = "inputs";

    }

    if (searchCategory === "livestock") {

      activeCategory = "livestock";

    }


    renderMarketplace();


    document
      .querySelector("#marketplace")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  });

}


/* =========================================================
   CATEGORIES
========================================================= */

function setupCategories() {

  $$(".category-card").forEach(card => {

    card.addEventListener("click", () => {

      activeCategory =
        card.dataset.category || "all";

      activeSearch = "";

      const input = $("#searchInput");

      if (input) input.value = "";

      renderMarketplace();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth"
      });

    });

  });

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

  $$("[data-sale-filter]").forEach(button => {

    button.addEventListener("click", () => {

      $$("[data-sale-filter]")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      button.classList.add("active");

      activeSaleFilter =
        button.dataset.saleFilter || "all";

      renderMarketplace();

    });

  });


  $("#locationFilter")?.addEventListener(
    "change",
    event => {

      activeLocation = event.target.value;

      renderMarketplace();

    }
  );


  $("#sortSelect")?.addEventListener(
    "change",
    event => {

      activeSort = event.target.value;

      renderMarketplace();

    }
  );


  $("#showAllButton")?.addEventListener(
    "click",
    resetFilters
  );


  $("#showAllButtonFallback")?.addEventListener(
    "click",
    resetFilters
  );

}


function resetFilters() {

  activeCategory = "all";
  activeSaleFilter = "all";
  activeLocation = "all";
  activeSearch = "";
  activeSort = "newest";


  const searchInput = $("#searchInput");

  if (searchInput) {
    searchInput.value = "";
  }


  const locationFilter =
    $("#locationFilter");

  if (locationFilter) {
    locationFilter.value = "all";
  }


  const sortSelect =
    $("#sortSelect");

  if (sortSelect) {
    sortSelect.value = "newest";
  }


  $$("[data-sale-filter]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.saleFilter === "all"
      );

    });


  renderMarketplace();

}


/* =========================================================
   MARKETPLACE
========================================================= */

function renderMarketplace() {

  const grid = $("#listingGrid");

  if (!grid) return;

  let filtered = [...listings];


  /* CATEGORY */

  if (activeCategory !== "all") {

    filtered = filtered.filter(item =>
      item.category === activeCategory
    );

  }


  /* SALE TYPE */

  if (activeSaleFilter !== "all") {

    filtered = filtered.filter(item =>

      item.saleType === activeSaleFilter ||
      item.saleType === "both"

    );

  }


  /* LOCATION */

  if (activeLocation !== "all") {

    filtered = filtered.filter(item =>
      item.location === activeLocation
    );

  }


  /* SEARCH */

  if (activeSearch) {

    filtered = filtered.filter(item => {

      const searchable = [

        item.name,
        item.category,
        item.location,
        item.seller,
        item.description

      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(activeSearch);

    });

  }


  /* SORT */

  if (activeSort === "newest") {

    filtered.sort(
      (a,b) => b.createdAt - a.createdAt
    );

  }


  if (activeSort === "price-low") {

    filtered.sort(
      (a,b) =>
        getDisplayPrice(a) -
        getDisplayPrice(b)
    );

  }


  if (activeSort === "price-high") {

    filtered.sort(
      (a,b) =>
        getDisplayPrice(b) -
        getDisplayPrice(a)
    );

  }


  if (activeSort === "name") {

    filtered.sort((a,b) =>
      a.name.localeCompare(b.name)
    );

  }


  if (activeSort === "fairness") {

    filtered.sort((a,b) =>
      getFairnessScore(a) -
      getFairnessScore(b)
    );

  }


  grid.innerHTML = "";


  if (!filtered.length) {

    $("#emptyState")?.classList.remove("hidden");

  } else {

    $("#emptyState")?.classList.add("hidden");

    filtered.forEach(item => {

      grid.appendChild(
        createListingCard(item)
      );

    });

  }


  const count =
    $("#resultsCount");

  if (count) {

    count.textContent =
      `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

  }

}


/* =========================================================
   PRICE HELPERS
========================================================= */

function getDisplayPrice(item) {

  if (
    activeSaleFilter === "bulk" &&
    item.bulkPrice
  ) {

    return Number(item.bulkPrice);

  }

  if (item.retailPrice) {

    return Number(item.retailPrice);

  }

  if (item.bulkPrice) {

    return Number(item.bulkPrice);

  }

  return 0;

}


function getPriceUnit(item) {

  if (
    activeSaleFilter === "bulk" &&
    item.bulkPrice
  ) {

    return item.bulkUnit || "unit";

  }

  if (item.retailPrice) {

    return item.retailUnit || "unit";

  }

  return item.bulkUnit || "unit";

}


function getFairGuide(item, priceType = "retail") {

  const price =
    priceType === "bulk"
      ? item.bulkPrice
      : item.retailPrice;


  const unit =
    priceType === "bulk"
      ? item.bulkUnit
      : item.retailUnit;


  if (!price || !unit) return null;


  const exactKey =
    `${item.name}|${unit}`;


  if (FAIR_PRICE_GUIDE[exactKey]) {

    return FAIR_PRICE_GUIDE[exactKey];

  }


  /*
    Fallback:
    Use category-level demo ranges.
    This makes the system useful even when
    a farmer enters a new product.
  */

  const fallback = {

    fruits: {
      min: 60,
      max: 180
    },

    vegetables: {
      min: 50,
      max: 140
    },

    nuts: {
      min: 120,
      max: 280
    },

    starchy: {
      min: 45,
      max: 110
    },

    grains: {
      min: 45,
      max: 120
    },

    legumes: {
      min: 100,
      max: 250
    },

    livestock: {
      min: 500,
      max: 50000
    },

    inputs: {
      min: 50,
      max: 5000
    }

  };


  return fallback[item.category] || null;

}


/* =========================================================
   FAIRNESS
========================================================= */

function getFairness(item, priceType = "retail") {

  const price =
    priceType === "bulk"
      ? Number(item.bulkPrice)
      : Number(item.retailPrice);


  const guide =
    getFairGuide(item, priceType);


  if (!guide || !price) {

    return {
      status: "unknown",
      label: "Guide unavailable",
      difference: 0,
      guide: null
    };

  }


  const difference =
    ((price - guide.max) / guide.max) * 100;


  if (price < guide.min) {

    return {
      status: "good",
      label: "Good value",
      difference,
      guide
    };

  }


  if (price <= guide.max) {

    return {
      status: "good",
      label: "Fair price",
      difference,
      guide
    };

  }


  if (price <= guide.max * 1.20) {

    return {
      status: "watch",
      label: "Above fair range",
      difference,
      guide
    };

  }


  return {
    status: "high",
    label: "Potentially overpriced",
    difference,
    guide
  };

}


function getFairnessScore(item) {

  const retail =
    getFairness(item, "retail");

  const bulk =
    getFairness(item, "bulk");


  const values = [];

  if (retail.guide) {
    values.push(Math.max(0, retail.difference));
  }

  if (bulk.guide) {
    values.push(Math.max(0, bulk.difference));
  }

  if (!values.length) return 999;

  return Math.min(...values);

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createListingCard(item) {

  const card =
    document.createElement("article");

  card.className = "listing-card";


  const image =
    item.image ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80";


  const price =
    getDisplayPrice(item);


  const unit =
    getPriceUnit(item);


  let priceType = "retail";

  if (
    activeSaleFilter === "bulk" &&
    item.bulkPrice
  ) {

    priceType = "bulk";

  }


  if (
    !item.retailPrice &&
    item.bulkPrice
  ) {

    priceType = "bulk";

  }


  const fairness =
    getFairness(item, priceType);


  let fairHTML = "";


  if (fairness.guide) {

    fairHTML = `

      <div class="fair-badge ${fairness.status}">

        ${
          fairness.status === "good"
            ? "🟢"
            : fairness.status === "watch"
            ? "🟠"
            : "🔴"
        }

        ${fairness.label}

      </div>

      <div class="fair-guide">

        Guide:
        KSh ${formatMoney(fairness.guide.min)}
        –
        KSh ${formatMoney(fairness.guide.max)}
        /${unit}

      </div>

    `;

  }


  let saleText = "";


  if (
    item.saleType === "both" &&
    item.bulkPrice
  ) {

    saleText = `
      <div class="listing-unit">
        Bulk: KSh ${formatMoney(item.bulkPrice)}/${item.bulkUnit}
      </div>
    `;

  }


  card.innerHTML = `

    <div
      class="listing-image"
      style="background-image:url('${escapeAttribute(image)}')"
    >

      <span class="listing-category">
        ${formatCategory(item.category)}
      </span>

    </div>


    <div class="listing-body">

      <div class="listing-title-row">

        <div>

          <div class="listing-title">
            ${escapeHTML(item.name)}
          </div>

          <div class="listing-location">
            📍 ${escapeHTML(item.location)}
          </div>

        </div>

      </div>


      <p class="listing-description">

        ${escapeHTML(
          item.description || "Fresh agricultural product."
        )}

      </p>


      <div>

        <span class="listing-price">
          KSh ${formatMoney(price)}
        </span>

        <span class="listing-unit">
          /${unit}
        </span>

      </div>


      ${saleText}

      ${fairHTML}


      <div class="seller-row">

        👤
        ${escapeHTML(item.seller)}

      </div>


      <div class="listing-actions">

        <button
          class="btn btn-primary cart-add"
          type="button"
          data-add-cart="${item.id}"
        >
          🛒 Add to Cart
        </button>


        <button
          class="btn btn-outline"
          type="button"
          data-buy-now="${item.id}"
        >
          Buy
        </button>

      </div>

    </div>

  `;


  card
    .querySelector("[data-add-cart]")
    ?.addEventListener(
      "click",
      () => addToCart(item.id, priceType)
    );


  card
    .querySelector("[data-buy-now]")
    ?.addEventListener(
      "click",
      () => {

        addToCart(item.id, priceType);

        openCart();

      }
    );


  return card;

}


/* =========================================================
   CART
========================================================= */

function setupCart() {

  $("#cartButton")?.addEventListener(
    "click",
    openCart
  );


  $("#continueShopping")?.addEventListener(
    "click",
    () => {

      $("#cartModal")?.close();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth"
      });

    }
  );


  $("#checkoutButton")?.addEventListener(
    "click",
    checkout
  );

}


function addToCart(productId, priceType = "retail") {

  const product =
    listings.find(item =>
      item.id === productId
    );


  if (!product) return;


  let existing =
    cart.find(item =>
      item.productId === productId &&
      item.priceType === priceType
    );


  if (!existing) {

    existing = {

      productId,

      priceType,

      quantity:
        priceType === "bulk"
          ? Number(product.bulkMinimum || 1)
          : 1

    };

    cart.push(existing);

  } else {

    existing.quantity +=
      priceType === "bulk"
        ? Number(product.bulkMinimum || 1)
        : 1;

  }


  saveCart();

  renderCart();

  showToast(
    `${product.name} added to your cart 🛒`
  );

}


function removeFromCart(productId, priceType) {

  cart = cart.filter(item =>
    !(
      item.productId === productId &&
      item.priceType === priceType
    )
  );


  saveCart();

  renderCart();

}


function changeCartQuantity(
  productId,
  priceType,
  direction
) {

  const cartItem =
    cart.find(item =>
      item.productId === productId &&
      item.priceType === priceType
    );


  if (!cartItem) return;


  const product =
    listings.find(item =>
      item.id === productId
    );


  if (!product) return;


  const step =
    priceType === "bulk"
      ? Number(product.bulkMinimum || 1)
      : 1;


  cartItem.quantity +=
    direction * step;


  const minimum =
    priceType === "bulk"
      ? step
      : 1;


  if (cartItem.quantity < minimum) {

    removeFromCart(
      productId,
      priceType
    );

    return;

  }


  if (
    product.quantity &&
    cartItem.quantity > product.quantity
  ) {

    cartItem.quantity =
      product.quantity;

    showToast(
      "You reached the available stock."
    );

  }


  saveCart();

  renderCart();

}


function renderCart() {

  const container =
    $("#cartItems");

  if (!container) return;


  container.innerHTML = "";


  if (!cart.length) {

    $("#cartEmpty")
      ?.classList.remove("hidden");

    $("#cartSummary")
      ?.classList.add("hidden");

    updateCartCount();

    return;

  }


  $("#cartEmpty")
    ?.classList.add("hidden");

  $("#cartSummary")
    ?.classList.remove("hidden");


  let subtotal = 0;

  let itemCount = 0;

  let hasHighPrice = false;


  cart.forEach(cartItem => {

    const product =
      listings.find(item =>
        item.id === cartItem.productId
      );


    if (!product) return;


    const price =
      cartItem.priceType === "bulk"
        ? Number(product.bulkPrice)
        : Number(product.retailPrice);


    const unit =
      cartItem.priceType === "bulk"
        ? product.bulkUnit
        : product.retailUnit;


    const total =
      price * cartItem.quantity;


    subtotal += total;

    itemCount += cartItem.quantity;


    const fairness =
      getFairness(
        product,
        cartItem.priceType
      );


    if (fairness.status === "high") {

      hasHighPrice = true;

    }


    const image =
      product.image ||
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80";


    const item =
      document.createElement("div");

    item.className = "cart-item";


    item.innerHTML = `

      <div
        class="cart-item-image"
        style="background-image:url('${escapeAttribute(image)}')"
      ></div>


      <div>

        <h4>
          ${escapeHTML(product.name)}
        </h4>

        <small>
          ${escapeHTML(product.seller)}
        </small>

        <small>
          KSh ${formatMoney(price)}/${unit}
        </small>


        <div class="quantity-controls">

          <button
            type="button"
            data-minus
          >
            −
          </button>

          <strong>
            ${cartItem.quantity}
          </strong>

          <button
            type="button"
            data-plus
          >
            +
          </button>

        </div>


        <button
          class="remove-cart-item"
          type="button"
          data-remove
        >
          Remove
        </button>

      </div>


      <div class="cart-item-price">

        KSh ${formatMoney(total)}

      </div>

    `;


    item
      .querySelector("[data-minus]")
      ?.addEventListener(
        "click",
        () =>
          changeCartQuantity(
            product.id,
            cartItem.priceType,
            -1
          )
      );


    item
      .querySelector("[data-plus]")
      ?.addEventListener(
        "click",
        () =>
          changeCartQuantity(
            product.id,
            cartItem.priceType,
            1
          )
      );


    item
      .querySelector("[data-remove]")
      ?.addEventListener(
        "click",
        () =>
          removeFromCart(
            product.id,
            cartItem.priceType
          )
      );


    container.appendChild(item);

  });


  $("#cartItemTotal").textContent =
    itemCount;


  $("#cartSubtotal").textContent =
    `KSh ${formatMoney(subtotal)}`;


  $("#cartFairWarning")
    ?.classList.toggle(
      "hidden",
      !hasHighPrice
    );


  updateCartCount();

}


function updateCartCount() {

  const count =
    cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );


  const element =
    $("#cartCount");

  if (element) {

    element.textContent =
      count > 99 ? "99+" : count;

  }

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

  renderCart();

  const modal =
    $("#cartModal");

  if (
    modal &&
    typeof modal.showModal === "function"
  ) {

    modal.showModal();

  }

}


/* =========================================================
   CHECKOUT
========================================================= */

function checkout() {

  if (!cart.length) {

    showToast(
      "Your cart is empty."
    );

    return;

  }


  /*
    Demo checkout.
    No real payment is processed.
  */

  showToast(
    "Checkout demo ready — payment integration can be added later."
  );

}


/* =========================================================
   LISTING MODAL
========================================================= */

function setupListingModal() {

  const modal =
    $("#listingModal");

  const form =
    $("#listingForm");


  $("#saleType")?.addEventListener(
    "change",
    updatePricingFields
  );


  updatePricingFields();


  form?.addEventListener(
    "submit",
    handleListingSubmit
  );


  $$("[data-close-modal]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const modal =
            button.closest("dialog");

          modal?.close();

        }
      );

    });


  /*
    Close dialogs when clicking backdrop.
  */

  [$("#listingModal"), $("#cartModal"), $("#loginModal")]
    .forEach(dialog => {

      if (!dialog) return;

      dialog.addEventListener(
        "click",
        event => {

          if (event.target === dialog) {
            dialog.close();
          }

        }
      );

    });

}


function openListingModal() {

  const modal =
    $("#listingModal");

  if (
    modal &&
    typeof modal.showModal === "function"
  ) {

    modal.showModal();

  }

}


function updatePricingFields() {

  const type =
    $("#saleType")?.value || "retail";


  const retailFields =
    $("#retailFields");

  const bulkFields =
    $("#bulkFields");


  if (retailFields) {

    retailFields.classList.toggle(
      "hidden",
      type === "bulk"
    );

  }


  if (bulkFields) {

    bulkFields.classList.toggle(
      "hidden",
      type === "retail"
    );

  }


  const retailPrice =
    $("#retailPrice");

  const bulkPrice =
    $("#bulkPrice");

  const bulkMinimum =
    $("#bulkMinimum");


  if (retailPrice) {

    retailPrice.required =
      type === "retail" ||
      type === "both";

  }


  if (bulkPrice) {

    bulkPrice.required =
      type === "bulk" ||
      type === "both";

  }


  if (bulkMinimum) {

    bulkMinimum.required =
      type === "bulk" ||
      type === "both";

  }

}


/* =========================================================
   CREATE LISTING
========================================================= */

function handleListingSubmit(event) {

  event.preventDefault();


  const form =
    event.target;


  const type =
    $("#saleType").value;


  const newListing = {

    id:
      `user-${Date.now()}`,

    name:
      $("#listingName").value.trim(),

    category:
      $("#listingType").value,

    saleType:
      type,

    retailPrice:
      type === "bulk"
        ? null
        : Number($("#retailPrice").value),

    retailUnit:
      $("#retailUnit").value,

    bulkPrice:
      type === "retail"
        ? null
        : Number($("#bulkPrice").value),

    bulkUnit:
      $("#bulkUnit").value,

    bulkMinimum:
      type === "retail"
        ? null
        : Number($("#bulkMinimum").value),

    quantity:
      Number($("#listingQuantity").value),

    stockUnit:
      $("#listingStockUnit").value,

    location:
      $("#listingLocation").value.trim(),

    seller:
      $("#listingSeller").value.trim(),

    phone:
      $("#listingPhone").value.trim(),

    image:
      $("#listingImage").value.trim(),

    description:
      $("#listingDescription").value.trim(),

    createdAt:
      Date.now()

  };


  if (
    !newListing.name ||
    !newListing.category ||
    !newListing.location ||
    !newListing.seller ||
    !newListing.phone
  ) {

    showListingMessage(
      "Please complete all required fields.",
      true
    );

    return;

  }


  if (
    (type === "retail" || type === "both") &&
    (!newListing.retailPrice ||
      newListing.retailPrice <= 0)
  ) {

    showListingMessage(
      "Enter a valid retail price.",
      true
    );

    return;

  }


  if (
    (type === "bulk" || type === "both") &&
    (!newListing.bulkPrice ||
      newListing.bulkPrice <= 0)
  ) {

    showListingMessage(
      "Enter a valid bulk price.",
      true
    );

    return;

  }


  listings.unshift(newListing);

  saveListings();

  renderMarketplace();

  form.reset();

  updatePricingFields();


  $("#listingModal")?.close();


  showToast(
    "Your product has been listed successfully! 🌱"
  );

}


function showListingMessage(
  message,
  error = false
) {

  const element =
    $("#listingMessage");

  if (!element) return;

  element.textContent = message;

  element.style.color =
    error
      ? "#c83d3d"
      : "#356b43";

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

  $("#loginButton")?.addEventListener(
    "click",
    () => {

      $("#loginModal")?.showModal();

    }
  );


  $("#loginForm")?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      $("#loginModal")?.close();

      showToast(
        "Demo login successful 👋"
      );

    }
  );

}


/* =========================================================
   SMART ASSIST
========================================================= */

function setupSmartAssist() {

  const county =
    $("#countySelect");

  const output =
    $("#insightMessage");


  if (!county || !output) return;


  const insights = {

    nairobi:
      "Urban farming, poultry, vegetables and short-cycle crops can be practical market opportunities.",

    kiambu:
      "Kiambu has strong opportunities in horticulture, dairy and high-value crops.",

    nakuru:
      "Nakuru offers opportunities across vegetables, grains, dairy and horticulture.",

    muranga:
      "Murang'a is well suited to horticulture, fruits, tea and smallholder farming.",

    machakos:
      "Water-efficient crops, legumes and drought-resilient farming can be important choices.",

    kisumu:
      "Vegetables, grains, fish-related value chains and livestock can create market opportunities.",

    meru:
      "Meru has strong potential in fruits, horticulture, dairy and other high-value crops."

  };


  county.addEventListener(
    "change",
    () => {

      const value =
        county.value;


      output.textContent =
        insights[value] ||
        "Select your county to see an insight.";

    }
  );

}


/* =========================================================
   LANGUAGE
========================================================= */

const TRANSLATIONS = {

  en: {

    navHome: "Home",
    navMarketplace: "Marketplace",
    navSmart: "Smart Assist",
    navCommunity: "Community",
    login: "Login",
    cart: "Cart",
    searchPlaceholder:
      "Search products e.g. Hass avocados..."

  },


  sw: {

    navHome: "Nyumbani",
    navMarketplace: "Soko",
    navSmart: "Msaidizi wa Kilimo",
    navCommunity: "Jamii",
    login: "Ingia",
    cart: "Kikapu",
    searchPlaceholder:
      "Tafuta bidhaa mfano parachichi ya Hass..."

  },


  sheng: {

    navHome: "Home",
    navMarketplace: "Soko",
    navSmart: "Smart Assist",
    navCommunity: "Community",
    login: "Ingia",
    cart: "Cart",
    searchPlaceholder:
      "Search stuff kama Hass avocado..."

  }

};


function setupLanguage() {

  const select =
    $("#languageSelect");

  if (!select) return;


  const saved =
    localStorage.getItem(
      STORAGE_KEYS.language
    );


  if (saved && TRANSLATIONS[saved]) {

    select.value = saved;

    applyLanguage(saved);

  }


  select.addEventListener(
    "change",
    event => {

      const language =
        event.target.value;

      localStorage.setItem(
        STORAGE_KEYS.language,
        language
      );

      applyLanguage(language);

    }
  );

}


function applyLanguage(language) {

  const dictionary =
    TRANSLATIONS[language] ||
    TRANSLATIONS.en;


  $$("[data-i18n]").forEach(element => {

    const key =
      element.dataset.i18n;

    if (dictionary[key]) {

      element.textContent =
        dictionary[key];

    }

  });


  $$("[data-i18n-placeholder]")
    .forEach(element => {

      const key =
        element.dataset.i18nPlaceholder;

      if (dictionary[key]) {

        element.placeholder =
          dictionary[key];

      }

    });

}


/* =========================================================
   UTILITIES
========================================================= */

function formatMoney(number) {

  return Number(number || 0)
    .toLocaleString("en-KE", {
      maximumFractionDigits: 2
    });

}


function formatCategory(category) {

  const names = {

    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchy: "Starchy Foods",
    grains: "Grains",
    legumes: "Legumes",
    livestock: "Livestock",
    inputs: "Farm Inputs"

  };


  return names[category] ||
    "Agriculture";

}


function escapeHTML(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

  return String(value || "")
    .replaceAll("\\", "")
    .replaceAll("'", "%27")
    .replaceAll('"', "%22");

}


function updateYear() {

  const year =
    $("#currentYear");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}


let toastTimer;

function showToast(message) {

  const toast =
    $("#toast");

  if (!toast) return;


  clearTimeout(toastTimer);


  toast.textContent =
    message;

  toast.classList.add("show");


  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2800);

}
