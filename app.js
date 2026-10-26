(() => {
  "use strict";

  /* =====================================================
     MAVUNOBRIDGE — MARKETPLACE ENGINE
     Browser-only science fair demo; no backend required.
  ===================================================== */

  const STORAGE = {
    listings: "mavunobridge_listings_v6",
    cart: "mavunobridge_cart_v6",
    language: "mavunobridge_language_v2",
    user: "mavunobridge_demo_user_v1",
    pendingChat: "mavunobridge_pending_chat_v1"
  };

  // Read by buyer-guide.js to pre-fill the buyer request form.
  const PREFILL_KEY = "mavunobridge_prefill_demand";

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
      image: "images/corn-listing.png",
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
  let currentLang = "mix";

  /* LANGUAGE STRINGS FOR TEXT THAT THE SCRIPT CREATES (cards, cart, toasts) */

  const D = {
    mix: {
      addCart: "Add to cart",
      chatSeller: "Chat seller",
      contact: "Contact seller",
      demoBadge: "DEMO LISTING",
      saleRetail: "Retail",
      saleBulk: "Bulk",
      saleBoth: "Both",
      qtyOnRequest: "Quantity on request",
      sellerFallback: "Seller",
      fairNoLabel: "No guide yet",
      fairNoDetail: "No matching demo price guide.",
      fairBelow: "Below demo guide",
      fairAbove: "Above demo guide",
      fairWithin: "Within demo guide",
      showing: n => `Showing ${n} listing${n === 1 ? "" : "s"}`,
      categoryLabel: c => `Category: ${c}`,
      hintAll: "Discover products and services from Kenyan sellers.",
      hintCat: c => `Showing ${c}. Chagua product unayohitaji.`,
      noContact: "No contact number was provided for this listing.",
      chatDraft: n => `${n} bado iko? Bei ya mwisho ni ngapi?`,
      chatFailed: "Imeshindwa kufungua chat. Hakikisha browser inaruhusu local storage.",
      greeting: n => `Sasa, ${n}`,
      signedOut: "Umetoka kwa account.",
      cartEmpty: "Your cart is empty. Browse the marketplace to add items.",
      remove: "Remove",
      subtotal: v => `Demo subtotal: ${v}`,
      cartAdded: n => `${n} added to your demo cart.`,
      cartNotFound: "Listing not found. Refresh the page and try again.",
      cartSaveFail: "Cart could not be saved in this browser.",
      cartRemoved: "Item removed from cart.",
      cartCleared: "Cart cleared.",
      publish: "Publish listing",
      publishing: "Publishing...",
      published: "Listing published! Iko live kwenye marketplace hii browser.",
      publishedNoPhoto: "Listing published without the photo (it was too big to save).",
      publishedNoSave: "Listing added, but your browser blocked saving. It will disappear when you refresh.",
      formMissing: "Listing form could not be found.",
      fillAll: "Tafadhali jaza required fields zote.",
      badCategory: "Please choose a valid product category.",
      badCounty: "Please choose a valid county.",
      badPrice: "Enter a price greater than zero.",
      badPhone: "Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.",
      publishFailed: "Could not publish the listing. Please try again.",
      langChanged: "Language set to Sheng + English."
    },
    en: {
      addCart: "Add to cart",
      chatSeller: "Chat seller",
      contact: "Contact seller",
      demoBadge: "DEMO LISTING",
      saleRetail: "Retail",
      saleBulk: "Bulk",
      saleBoth: "Retail + bulk",
      qtyOnRequest: "Quantity on request",
      sellerFallback: "Seller",
      fairNoLabel: "No guide yet",
      fairNoDetail: "No matching demo price guide.",
      fairBelow: "Below demo guide",
      fairAbove: "Above demo guide",
      fairWithin: "Within demo guide",
      showing: n => `Showing ${n} listing${n === 1 ? "" : "s"}`,
      categoryLabel: c => `Category: ${c}`,
      hintAll: "Discover products and services from Kenyan sellers.",
      hintCat: c => `Showing ${c}. Pick the product you need.`,
      noContact: "No contact number was provided for this listing.",
      chatDraft: n => `Is the ${n} still available? What is your best price?`,
      chatFailed: "Could not open the chat. Check that your browser allows local storage.",
      greeting: n => `Hi, ${n}`,
      signedOut: "You have signed out.",
      cartEmpty: "Your cart is empty. Browse the marketplace to add items.",
      remove: "Remove",
      subtotal: v => `Demo subtotal: ${v}`,
      cartAdded: n => `${n} added to your demo cart.`,
      cartNotFound: "Listing not found. Refresh the page and try again.",
      cartSaveFail: "Cart could not be saved in this browser.",
      cartRemoved: "Item removed from cart.",
      cartCleared: "Cart cleared.",
      publish: "Publish listing",
      publishing: "Publishing...",
      published: "Listing published! It is now live on the marketplace in this browser.",
      publishedNoPhoto: "Listing published without the photo (it was too big to save).",
      publishedNoSave: "Listing added, but your browser blocked saving. It will disappear when you refresh.",
      formMissing: "Listing form could not be found.",
      fillAll: "Please fill in all required fields.",
      badCategory: "Please choose a valid product category.",
      badCounty: "Please choose a valid county.",
      badPrice: "Enter a price greater than zero.",
      badPhone: "Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.",
      publishFailed: "Could not publish the listing. Please try again.",
      langChanged: "Language changed to English."
    },
    sw: {
      addCart: "Weka kikapuni",
      chatSeller: "Ongea na muuzaji",
      contact: "Wasiliana na muuzaji",
      demoBadge: "TANGAZO LA MFANO",
      saleRetail: "Rejareja",
      saleBulk: "Jumla",
      saleBoth: "Rejareja + jumla",
      qtyOnRequest: "Kiasi kwa ombi",
      sellerFallback: "Muuzaji",
      fairNoLabel: "Hakuna mwongozo bado",
      fairNoDetail: "Hakuna mwongozo wa bei unaolingana.",
      fairBelow: "Chini ya mwongozo wa majaribio",
      fairAbove: "Juu ya mwongozo wa majaribio",
      fairWithin: "Ndani ya mwongozo wa majaribio",
      showing: n => n === 1 ? "Tangazo 1 linaonyeshwa" : `Matangazo ${n} yanaonyeshwa`,
      categoryLabel: c => `Aina: ${c}`,
      hintAll: "Gundua bidhaa na huduma kutoka kwa wauzaji wa Kenya.",
      hintCat: c => `Inaonyesha ${c}. Chagua bidhaa unayohitaji.`,
      noContact: "Hakuna namba ya mawasiliano iliyotolewa kwa tangazo hili.",
      chatDraft: n => `Je, ${n} bado ipo? Bei yako ya mwisho ni ngapi?`,
      chatFailed: "Imeshindwa kufungua mazungumzo. Hakikisha kivinjari chako kinaruhusu hifadhi ya ndani.",
      greeting: n => `Habari, ${n}`,
      signedOut: "Umetoka kwenye akaunti.",
      cartEmpty: "Kikapu chako ni tupu. Tazama soko ili uongeze bidhaa.",
      remove: "Ondoa",
      subtotal: v => `Jumla ndogo ya majaribio: ${v}`,
      cartAdded: n => `${n} imewekwa kwenye kikapu chako cha majaribio.`,
      cartNotFound: "Tangazo halikupatikana. Onyesha upya ukurasa kisha ujaribu tena.",
      cartSaveFail: "Kikapu hakikuweza kuhifadhiwa kwenye kivinjari hiki.",
      cartRemoved: "Bidhaa imeondolewa kwenye kikapu.",
      cartCleared: "Kikapu kimefutwa.",
      publish: "Chapisha tangazo",
      publishing: "Inachapisha...",
      published: "Tangazo limechapishwa! Sasa lipo kwenye soko katika kivinjari hiki.",
      publishedNoPhoto: "Tangazo limechapishwa bila picha (ilikuwa kubwa mno kuhifadhiwa).",
      publishedNoSave: "Tangazo limeongezwa, lakini kivinjari chako kimezuia kuhifadhi. Litatoweka ukionyesha upya ukurasa.",
      formMissing: "Fomu ya tangazo haikupatikana.",
      fillAll: "Tafadhali jaza sehemu zote zinazohitajika.",
      badCategory: "Tafadhali chagua aina halali ya bidhaa.",
      badCounty: "Tafadhali chagua kaunti halali.",
      badPrice: "Weka bei inayozidi sifuri.",
      badPhone: "Weka namba halali ya simu ya Kenya, mfano 0712345678 au +254712345678.",
      publishFailed: "Imeshindwa kuchapisha tangazo. Tafadhali jaribu tena.",
      langChanged: "Lugha imebadilishwa."
    }
  };

  function t(key, ...args) {
    const table = D[currentLang] || D.mix;
    const value = table[key] !== undefined ? table[key] : D.mix[key];
    return typeof value === "function" ? value(...args) : value;
  }

  function saleLabel(sale) {
    if (sale === "Bulk") return t("saleBulk");
    if (sale === "Both") return t("saleBoth");
    return t("saleRetail");
  }

  function updateHint() {
    const hint = $("#marketHint");
    if (!hint) return;
    hint.textContent = activeCategory === "All"
      ? t("hintAll")
      : t("hintCat", activeCategory);
  }

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

  /* SIGNED-IN USER (set by login.js) */

  function getUser() {
    const saved = loadStorage(STORAGE.user, null);
    return saved && typeof saved === "object" && saved.name ? saved : null;
  }

  function renderUser() {
    const user = getUser();
    const link = $("#authLink");
    const chip = $("#userChip");
    const greeting = $("#userGreeting");

    if (link) link.classList.toggle("hidden", Boolean(user));
    if (chip) chip.classList.toggle("hidden", !user);

    if (user && greeting) {
      const firstName = String(user.name).trim().split(/\s+/)[0].slice(0, 18);
      greeting.textContent = t("greeting", firstName);
    }
  }

  function signOut() {
    try {
      localStorage.removeItem(STORAGE.user);
    } catch (error) {
      console.warn("Could not clear the demo session:", error);
    }

    renderUser();
    showToast(t("signedOut"));
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
    updateHint();

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
        label: t("fairNoLabel"),
        detail: t("fairNoDetail")
      };
    }

    if (Number(item.price) < guide.min) {
      return {
        status: "below",
        label: t("fairBelow"),
        detail: `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`
      };
    }

    if (Number(item.price) > guide.max) {
      return {
        status: "above",
        label: t("fairAbove"),
        detail: `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`
      };
    }

    return {
      status: "within",
      label: t("fairWithin"),
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
      saleBadge.textContent = saleLabel(item.sale);
      imageWrap.appendChild(saleBadge);

      if (item.demo) {
        const demoBadge = document.createElement("span");
        demoBadge.className = "demo-badge";
        demoBadge.textContent = t("demoBadge");
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
      quantity.textContent = `${item.qty || t("qtyOnRequest")} · ${item.seller || t("sellerFallback")}`;

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "small primary";
      addButton.dataset.addCart = item.id;
      addButton.textContent = t("addCart");

      const chatButton = document.createElement("button");
      chatButton.type = "button";
      chatButton.className = "small";
      chatButton.dataset.chat = item.id;
      chatButton.textContent = t("chatSeller");

      const phone = normalizePhone(item.phone);
      const callLink = document.createElement("a");
      callLink.className = "small call-link";
      callLink.textContent = t("contact");

      if (phone) {
        callLink.href = `tel:${phone}`;
      } else {
        callLink.href = "#";
        callLink.addEventListener("click", event => {
          event.preventDefault();
          showToast(t("noContact"));
        });
      }

      actions.append(addButton, chatButton, callLink);
      body.append(category, title, location, price, fairBadge, fairDetail, quantity, actions);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    const resultCount = $("#resultCount");
    if (resultCount) {
      resultCount.textContent = t("showing", results.length);
    }

    const active = $("#activeCategory");
    if (active) {
      active.textContent = activeCategory === "All"
        ? ""
        : t("categoryLabel", activeCategory);
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

  // Opens the "Create a listing" form, filling in the seller name
  // from the signed-in demo user.
  function openListingModal() {
    const user = getUser();
    const sellerName = $("#sellerName");

    if (user && sellerName && !sellerName.value.trim()) {
      sellerName.value = String(user.name).trim();
    }

    openModal("listingModal");
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

  /* CREATE AND SAVE LISTING */

  async function handleListingSubmit(event) {
    event.preventDefault();

    if (isPublishing) return;

    clearListingError();

    const form = $("#listingForm");
    const publishButton = $("#publishListingButton");

    if (!form) {
      showToast(t("formMissing"));
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
      showListingError(t("fillAll"));
      return;
    }

    if (!CATEGORIES.some(([label]) => label === category)) {
      showListingError(t("badCategory"));
      return;
    }

    if (!COUNTIES.includes(county)) {
      showListingError(t("badCounty"));
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showListingError(t("badPrice"));
      return;
    }

    if (!validPhone(phone)) {
      showListingError(t("badPhone"));
      return;
    }

    isPublishing = true;

    if (publishButton) {
      publishButton.disabled = true;
      publishButton.textContent = t("publishing");
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
      updateHint();

      form.reset();
      closeModal("listingModal");

      if (!storageWorked) {
        showToast(t("publishedNoSave"));
      } else if (photoDropped) {
        showToast(t("publishedNoPhoto"));
      } else {
        showToast(t("published"));
      }

      $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Listing publish error:", error);
      showListingError(error.message || t("publishFailed"));
    } finally {
      isPublishing = false;

      if (publishButton) {
        publishButton.disabled = false;
        publishButton.textContent = t("publish");
      }
    }
  }

  /* CHAT WITH A SELLER (opens messages.html about this product) */

  function openChat(id) {
    const item = listings.find(listing => listing.id === id);

    if (!item) {
      showToast(t("cartNotFound"));
      return;
    }

    const payload = {
      productId: item.id,
      productName: item.name,
      seller: item.seller,
      county: item.county,
      phone: item.phone || "",
      price: Number(item.price) || 0,
      quantity: item.qty || "",
      saleType: item.sale || "Both",
      message: t("chatDraft", item.name)
    };

    if (!saveStorage(STORAGE.pendingChat, payload)) {
      showToast(t("chatFailed"));
      return;
    }

    window.location.href = "messages.html";
  }

  /* BUYER REQUEST (when nothing matches the search) */

  function requestProduct() {
    const search = ($("#searchInput")?.value || "").trim();
    const wanted = search || (activeCategory !== "All" ? activeCategory : "");

    try {
      if (wanted) sessionStorage.setItem(PREFILL_KEY, wanted);
    } catch (error) {
      console.warn("Could not pass the search to the request board:", error);
    }

    window.location.href = "buyer-requests.html";
  }

  /* CART */

  function saveCart() {
    if (!saveStorage(STORAGE.cart, cart)) {
      showToast(t("cartSaveFail"));
      return false;
    }
    return true;
  }

  function addToCart(id) {
    const item = listings.find(listing => listing.id === id);

    if (!item) {
      showToast(t("cartNotFound"));
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
      showToast(t("cartAdded", item.name));
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
      container.innerHTML = `<p>${escapeHTML(t("cartEmpty"))}</p>`;
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
      remove.textContent = t("remove");
      remove.dataset.removeCart = item.id;

      row.append(info, remove);
      container.appendChild(row);
    });

    const totalRow = document.createElement("p");
    totalRow.className = "cart-total";
    totalRow.style.fontWeight = "800";
    totalRow.style.marginTop = "18px";
    totalRow.textContent = t("subtotal", money(total));
    container.appendChild(totalRow);

    updateCartCount();
  }

  function removeFromCart(id) {
    cart = cart.filter(entry => entry.id !== id);
    saveCart();
    renderCart();
    showToast(t("cartRemoved"));
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    showToast(t("cartCleared"));
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

    updateHint();

    renderCategories();
    renderListings();
  }

  function bindEvents() {
    $("#sellButton")?.addEventListener("click", openListingModal);
    $("#heroSellButton")?.addEventListener("click", openListingModal);
    $("#emptySellButton")?.addEventListener("click", openListingModal);
    $("#emptyRequestButton")?.addEventListener("click", requestProduct);

    $("#signOutButton")?.addEventListener("click", signOut);

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
      updateHint();
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
      const addButton = event.target.closest("[data-add-cart]");
      if (addButton) {
        addToCart(addButton.dataset.addCart);
        return;
      }

      const chatButton = event.target.closest("[data-chat]");
      if (chatButton) openChat(chatButton.dataset.chat);
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
      showToast(t("langChanged"));
    });
  }

  /* LANGUAGE SUPPORT
     Each row is [selector, English, Kiswahili, mode].
     - "Sheng + English" restores the page text exactly as written in index.html.
     - null for English means "same as the original text".
     - mode: omitted = text, "html" = innerHTML, "placeholder" = input placeholder.
     - A selector starting with ^ means "the <label> around this field". */

  const TRANSLATIONS = [
    // Header and navigation
    ['.main-nav a[href="#marketplace"]', "Marketplace", "Soko"],
    ['.main-nav a[href="smart-assist.html"]', "Smart Assist", "Msaidizi Mahiri"],
    ['.main-nav a[href="sacco.html"]', "SACCO Hub", "Kituo cha SACCO"],
    ['.main-nav a[href="buyer-requests.html"]', "Buyer Requests", "Maombi ya Wanunuzi"],
    ['.main-nav a[href="messages.html"]', "Messages", "Ujumbe"],
    ["#authLink", "Sign in", "Ingia"],
    ["#signOutButton", "Sign out", "Toka"],
    ["#cartButton", "🛒 Cart ", "🛒 Kikapu "],

    // Hero
    [".hero .eyebrow", "KENYA'S FARM-TO-MARKET DEMO", "ONYESHO LA KENYA LA SHAMBANI HADI SOKONI"],
    [".hero h1", "Good harvests deserve <span>better markets.</span>", "Mavuno mazuri yanastahili <span>masoko bora.</span>", "html"],
    [".hero-description",
      "Connect directly with farmers, compare produce, discover opportunities and grow your business. Everything in one place.",
      "Wasiliana moja kwa moja na wakulima, linganisha mazao, gundua fursa na ukuze biashara yako. Yote mahali pamoja."],
    ["#heroSellButton", "+ Sell your produce", "+ Uza mazao yako"],
    [".hero-buttons a", "Explore marketplace →", "Tazama soko →"],
    [".hero-stats div:nth-child(1) span", "Kenyan counties", "Kaunti za Kenya"],
    [".hero-stats div:nth-child(2) span", "Farm categories", "Aina za bidhaa za shambani"],
    [".hero-stats div:nth-child(3) strong", "Direct", "Moja kwa moja"],
    [".hero-stats div:nth-child(3) span", "Buyer connections", "Mawasiliano na wanunuzi"],
    [".hero .demo-note",
      "Science fair demonstration · Sample listings are labelled as demo data.",
      "Onyesho la maonyesho ya sayansi · Matangazo ya mfano yamewekwa alama kuwa data ya majaribio."],

    // Categories section
    [".category-section .eyebrow", "FIND WHAT YOU NEED", "TAFUTA UNACHOHITAJI"],
    [".category-section h2", "Explore categories", "Tazama aina za bidhaa"],
    [".category-section .section-heading p",
      "Choose a category to see the available products.",
      "Chagua aina ili uone bidhaa zinazopatikana."],
    ["#showAllButton", "View all products →", "Tazama bidhaa zote →"],

    // Marketplace section
    [".marketplace .eyebrow", "FRESH FROM THE FARM", "MAZAO MAPYA KUTOKA SHAMBANI"],
    [".marketplace h2", "Marketplace", "Soko"],
    ["#sellButton", "+ Create listing", "+ Tengeneza tangazo"],
    ["#searchInput", "Search maize, beans, avocados...", "Tafuta mahindi, maharagwe, parachichi...", "placeholder"],
    ['#categoryFilter option[value="All"]', "All categories", "Aina zote"],
    ['#locationFilter option[value="All"]', "All counties", "Kaunti zote"],
    ['#saleFilter option[value="All"]', "All sale types", "Aina zote za mauzo"],
    ['#saleFilter option[value="Retail"]', "Retail", "Rejareja"],
    ['#saleFilter option[value="Bulk"]', "Bulk", "Jumla"],
    ['#saleFilter option[value="Both"]', "Retail + bulk available", "Rejareja + jumla zinapatikana"],
    ['#fairPriceFilter option[value="All"]', "All price ranges", "Bei zote"],
    ['#fairPriceFilter option[value="within"]', "Within demo guide", "Ndani ya mwongozo wa majaribio"],
    ['#fairPriceFilter option[value="below"]', "Below demo guide", "Chini ya mwongozo wa majaribio"],
    ['#fairPriceFilter option[value="above"]', "Above demo guide", "Juu ya mwongozo wa majaribio"],
    ['#fairPriceFilter option[value="no-guide"]', "No guide available", "Hakuna mwongozo"],
    ['#sortFilter option[value="recommended"]', "Recommended", "Zinazopendekezwa"],
    ['#sortFilter option[value="newest"]', "Newest", "Mpya zaidi"],
    ['#sortFilter option[value="price-low"]', "Price: low to high", "Bei: chini hadi juu"],
    ['#sortFilter option[value="price-high"]', "Price: high to low", "Bei: juu hadi chini"],
    ["#clearFiltersButton", "Clear filters", "Futa vichujio"],

    // Fair-price guide
    [".fair-guide strong", "🌱 Fair-price guide", "🌱 Mwongozo wa bei ya haki"],
    [".fair-guide > div:first-child p",
      "Compare prices before buying. These are illustrative demo ranges, not live market quotations.",
      "Linganisha bei kabla ya kununua. Hizi ni viwango vya mfano tu, si bei halisi za sokoni."],
    [".fair-guide-prices span:nth-child(1)", "Tomatoes: KSh 60–110/kg", "Nyanya: KSh 60–110/kg"],
    [".fair-guide-prices span:nth-child(2)", "Hass avocado: KSh 90–180/kg", "Parachichi la Hass: KSh 90–180/kg"],
    [".fair-guide-prices span:nth-child(3)", "Maize: KSh 45–80/kg", "Mahindi: KSh 45–80/kg"],

    // Empty state
    ["#emptyState h3", "No listings found", "Hakuna matangazo yaliyopatikana"],
    ["#emptyState p",
      "Try another search or filter, or create a new listing.",
      "Jaribu utafutaji au kichujio kingine, au tengeneza tangazo jipya."],
    ["#emptySellButton", "Create a listing", "Tengeneza tangazo"],
    ["#emptyRequestButton", "Post a buyer request", "Weka ombi la mnunuzi"],

    // Feature strip
    [".feature-strip article:nth-child(1) h3", "Smart Assist", "Msaidizi Mahiri"],
    [".feature-strip article:nth-child(1) p",
      "Explore crop-planning and pest information for your farm.",
      "Gundua mipango ya kupanda mazao na taarifa kuhusu wadudu kwa shamba lako."],
    [".feature-strip article:nth-child(1) a", "Explore Smart Assist →", "Tazama Msaidizi Mahiri →"],
    [".feature-strip article:nth-child(2) h3", "SACCO Hub", "Kituo cha SACCO"],
    [".feature-strip article:nth-child(2) p",
      "Discover sample savings groups and farming opportunities.",
      "Gundua vikundi vya akiba vya mfano na fursa za kilimo."],
    [".feature-strip article:nth-child(2) a", "Explore SACCO Hub →", "Tazama Kituo cha SACCO →"],
    [".feature-strip article:nth-child(3) h3", "Buyer requests", "Maombi ya wanunuzi"],
    [".feature-strip article:nth-child(3) p",
      null,
      "Wanunuzi huweka wanachohitaji na wakulima hujibu. Njia rahisi ya kuratibu oda kubwa."],
    [".feature-strip article:nth-child(3) a", "Open the request board →", "Fungua ubao wa maombi →"],

    // Create-listing modal
    ["#listingModal .eyebrow", "JOIN THE MARKETPLACE", "JIUNGE NA SOKO"],
    ["#listingModalTitle", "Create a listing", "Tengeneza tangazo"],
    ["#listingModal .modal-card > p",
      "Fill in your details. Fields marked * are required.",
      "Jaza maelezo yako. Sehemu zenye * ni lazima."],
    ["^#productName", "Product or service name *", "Jina la bidhaa au huduma *"],
    ["^#productCategory", "Category *", "Aina *"],
    ["^#productCounty", "County *", "Kaunti *"],
    ["^#productTown", "Town or area", "Mji au eneo"],
    ["^#productQuantity", "Quantity available *", "Kiasi kinachopatikana *"],
    ["^#productPrice", "Price in KSh *", "Bei kwa KSh *"],
    ["^#productPriceUnit", "Price unit *", "Kipimo cha bei *"],
    ["^#productSaleType", "Sale type *", "Aina ya mauzo *"],
    ["^#sellerName", "Your name or farm name *", "Jina lako au la shamba *"],
    ["^#sellerPhone", "Phone number *", "Namba ya simu *"],
    ["^#productCondition", "Condition", "Hali"],
    ["^#productHarvestDate", "Harvest date (optional)", "Tarehe ya mavuno (si lazima)"],
    ["^#productImage", "Product photo (optional)", "Picha ya bidhaa (si lazima)"],
    ["^#productDescription", "Description", "Maelezo"],
    [".form-grid small",
      "Choose a clear product photo. The demo saves a resized image in this browser.",
      "Chagua picha safi ya bidhaa. Onyesho hili huhifadhi picha iliyopunguzwa ukubwa kwenye kivinjari hiki."],
    ["#productName", "e.g. Rosecoco Beans", "mf. Maharagwe ya Rosecoco", "placeholder"],
    ["#productTown", "e.g. Limuru", "mf. Limuru", "placeholder"],
    ["#productQuantity", "e.g. 50 kg", "mf. kilo 50", "placeholder"],
    ["#productPrice", "e.g. 80", "mf. 80", "placeholder"],
    ["#sellerName", "Your farm or business name", "Jina la shamba au biashara yako", "placeholder"],
    ["#productDescription",
      "Describe your produce, packaging, delivery or harvest.",
      "Eleza mazao yako, vifungashio, uwasilishaji au mavuno.",
      "placeholder"],
    ['#productCategory option[value=""]', "Choose a category", "Chagua aina"],
    ['#productCounty option[value=""]', "Choose a county", "Chagua kaunti"],
    ['#productPriceUnit option[value="kg"]', "Per kg", "Kwa kilo"],
    ['#productPriceUnit option[value="piece"]', "Per piece", "Kwa kipande"],
    ['#productPriceUnit option[value="bag"]', "Per bag", "Kwa gunia"],
    ['#productPriceUnit option[value="bunch"]', "Per bunch", "Kwa mkungu"],
    ['#productPriceUnit option[value="tray"]', "Per tray", "Kwa trei"],
    ['#productPriceUnit option[value="litre"]', "Per litre", "Kwa lita"],
    ['#productPriceUnit option[value="animal"]', "Per animal", "Kwa mnyama"],
    ['#productPriceUnit option[value="service"]', "Per service", "Kwa huduma"],
    ['#productPriceUnit option[value="unit"]', "Per unit", "Kwa kimoja"],
    ['#productSaleType option[value="Retail"]', "Retail", "Rejareja"],
    ['#productSaleType option[value="Bulk"]', "Bulk", "Jumla"],
    ['#productSaleType option[value="Both"]', "Retail + bulk", "Rejareja + jumla"],
    ['#productCondition option[value="Fresh / good condition"]', "Fresh / good condition", "Mbichi / hali nzuri"],
    ['#productCondition option[value="Dry"]', "Dry", "Kavu"],
    ['#productCondition option[value="Processed"]', "Processed", "Imesindikwa"],
    ['#productCondition option[value="Used"]', "Used", "Imetumika"],
    ['#productCondition option[value="Other"]', "Other", "Nyingine"],
    ['#listingForm .modal-actions [data-close]', "Cancel", "Ghairi"],

    // Cart modal
    ["#cartModal .eyebrow", "YOUR SELECTIONS", "ULICHOCHAGUA"],
    ["#cartTitle", "Shopping cart", "Kikapu cha ununuzi"],
    ['#cartModal .modal-actions [data-close]', "Continue shopping", "Endelea kununua"],
    ["#clearCartButton", "Clear cart", "Futa kikapu"],
    ["#cartModal .demo-note",
      "Demo cart only. No real payment is collected.",
      "Kikapu cha majaribio tu. Hakuna malipo halisi yanayokusanywa."],

    // Footer
    [".footer-brand > p", "Connecting harvests to opportunities.", "Kuunganisha mavuno na fursa."],
    ['.footer-links a[href="#marketplace"]', "Marketplace", "Soko"],
    ['.footer-links a[href="smart-assist.html"]', "Smart Assist", "Msaidizi Mahiri"],
    ['.footer-links a[href="sacco.html"]', "SACCO Hub", "Kituo cha SACCO"],
    ['.footer-links a[href="buyer-requests.html"]', "Buyer Requests", "Maombi ya Wanunuzi"],
    ['.footer-links a[href="messages.html"]', "Messages", "Ujumbe"],
    ['.footer-links a[href="login.html"]', "Demo account", "Akaunti ya majaribio"],
    [".footer-disclaimer",
      "MavunoBridge is a demonstration project. Sample sellers, prices and listings are illustrative and are not verified live offers.",
      "MavunoBridge ni mradi wa maonyesho. Wauzaji, bei na matangazo ya mfano ni ya kielelezo tu na si ofa halisi zilizothibitishwa."],
    [".site-footer > p:last-child",
      '© <span id="currentYear">2026</span> MavunoBridge · Made for Kenyan agriculture.',
      '© <span id="currentYear">2026</span> MavunoBridge · Imetengenezwa kwa kilimo cha Kenya.',
      "html"]
  ];

  const originalTexts = new Map();
  let originalsCaptured = false;

  function findTarget(selector) {
    if (selector.charAt(0) === "^") {
      const field = $(selector.slice(1));
      return field ? field.closest("label") : null;
    }
    return $(selector);
  }

  function firstTextNode(element) {
    for (const node of element.childNodes) {
      if (node.nodeType === 3 && node.nodeValue.trim()) return node;
    }
    return null;
  }

  function readValue(element, mode) {
    if (mode === "html") return element.innerHTML;
    if (mode === "placeholder") return element.placeholder;
    if (element.children.length === 0) return element.textContent;
    const node = firstTextNode(element);
    return node ? node.nodeValue : "";
  }

  function writeValue(element, mode, value) {
    if (mode === "html") {
      element.innerHTML = value;
    } else if (mode === "placeholder") {
      element.placeholder = value;
    } else if (element.children.length === 0) {
      element.textContent = value;
    } else {
      const node = firstTextNode(element);
      if (node) node.nodeValue = value;
    }
  }

  // Remember the page text exactly as written (this is the Sheng + English version).
  function captureOriginals() {
    if (originalsCaptured) return;
    originalsCaptured = true;

    TRANSLATIONS.forEach(([selector, , , mode]) => {
      const element = findTarget(selector);
      if (element && !originalTexts.has(element)) {
        originalTexts.set(element, readValue(element, mode));
      }
    });
  }

  function applyLanguage(language) {
    currentLang = ["mix", "en", "sw"].includes(language) ? language : "mix";
    document.documentElement.lang = currentLang === "sw" ? "sw" : "en";

    captureOriginals();

    TRANSLATIONS.forEach(([selector, english, swahili, mode]) => {
      const element = findTarget(selector);
      if (!element) return;

      const original = originalTexts.get(element);
      let value;

      if (currentLang === "mix") {
        value = original;
      } else if (currentLang === "sw") {
        value = swahili;
      } else {
        value = english === null || english === undefined ? original : english;
      }

      if (value === undefined) return;
      writeValue(element, mode, value);
    });

    // The footer line was rewritten above, so refill the year.
    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    // Redraw the parts that the script builds itself.
    updateHint();
    renderListings();
    renderUser();

    const cartModal = $("#cartModal");
    if (cartModal && !cartModal.classList.contains("hidden")) renderCart();
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
    safely("show signed-in user", renderUser);
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
