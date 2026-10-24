
"use strict";

/* SHAMBAMARKET — LOCAL DEMO VERSION
   No Firebase or Supabase required.
   Listings are stored in this browser only.
*/

const $ = id => document.getElementById(id);
const STORAGE_KEY = "shambamarket-listings";
const LANGUAGE_KEY = "shambamarket-language";

const categoryNames = {
  all: "All products",
  fruits: "Fruits",
  vegetables: "Vegetables",
  nuts: "Nuts",
  starchy: "Starchy foods",
  grains: "Grains",
  legumes: "Legumes",
  livestock: "Livestock",
  inputs: "Farm inputs"
};

const categoryImages = {
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80",
  vegetables: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=700&q=80",
  nuts: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=80",
  starchy: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
  grains: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
  legumes: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
  livestock: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=700&q=80",
  inputs: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80"
};

const translations = {
  en: {
    tagline: "Your farm, your market.",
    home: "Home",
    marketplace: "Marketplace",
    assistant: "Shamba Assistant",
    community: "Community",
    login: "Login",
    searchPlaceholder: "Search maize, mangoes, fertilizer...",
    allCategories: "All categories",
    produce: "Farm produce",
    inputs: "Farm inputs",
    livestock: "Livestock",
    search: "Search",
    searchHint: "Find farm products from sellers across Kenya.",
    heroEyebrow: "BUILT FOR KENYAN FARMERS",
    heroTitle: "Your farm. Your market. Your opportunity.",
    heroText: "Buy, sell and grow together. Find produce, farm inputs and livestock in one place.",
    explore: "Explore marketplace ↗",
    listProduct: "+ List your product",
    oneMarket: "ONE BIG AGRI-MARKET",
    marketTitle: "The marketplace is open 🌱",
    marketSubtitle: "Choose a category to see what's available.",
    viewAll: "View all listings ↗",
    allProducts: "All products",
    allProductsDesc: "Explore the whole market",
    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchy: "Starchy foods",
    grains: "Grains",
    legumes: "Legumes",
    allItems: "All items",
    retail: "Retail",
    bulk: "Bulk",
    both: "Retail + bulk",
    noResults: "No listings found",
    demoNote: "Demo listings and prices are examples, not live offers.",
    assistantTitle: "Shamba Assistant 🌦️",
    assistantText: "Explore crop guidance and useful farming checklists for your area.",
    openAssistant: "Open Shamba Assistant ↗",
    selectCounty: "Choose your county",
    communityTitle: "Farmer connections 🤝",
    createListing: "Create a listing",
    publishListing: "Publish listing",
    startListing: "Start listing ↗",
    loginTitle: "Welcome to ShambaMarket",
    loginNote: "Account sign-in is a demo placeholder. No password is collected."
  },
  sw: {
    tagline: "Shamba lako, soko lako.",
    home: "Nyumbani",
    marketplace: "Soko",
    assistant: "Msaidizi wa Shamba",
    community: "Jumuiya",
    login: "Ingia",
    searchPlaceholder: "Tafuta mahindi, maembe, mbolea...",
    allCategories: "Makundi yote",
    produce: "Mazao ya shamba",
    inputs: "Vifaa vya kilimo",
    livestock: "Mifugo",
    search: "Tafuta",
    searchHint: "Pata bidhaa za kilimo kutoka kwa wauzaji kote Kenya.",
    heroEyebrow: "IMEUNDWA KWA WAKULIMA WA KENYA",
    heroTitle: "Shamba lako. Soko lako. Fursa yako.",
    heroText: "Nunua, uza na uendelee kukua pamoja. Pata mazao, vifaa vya kilimo na mifugo sehemu moja.",
    explore: "Angalia soko ↗",
    listProduct: "+ Orodhesha bidhaa",
    oneMarket: "SOKO KUBWA LA KILIMO",
    marketTitle: "Soko liko wazi 🌱",
    marketSubtitle: "Chagua kundi uone bidhaa zilizopo.",
    viewAll: "Ona bidhaa zote ↗",
    allProducts: "Bidhaa zote",
    allProductsDesc: "Angalia bidhaa zote sokoni",
    fruits: "Matunda",
    vegetables: "Mboga",
    nuts: "Karanga na njugu",
    starchy: "Vyakula vya wanga",
    grains: "Nafaka",
    legumes: "Mikunde",
    allItems: "Bidhaa zote",
    retail: "Rejareja",
    bulk: "Kwa wingi",
    both: "Rejareja na wingi",
    noResults: "Hakuna bidhaa zilizopatikana",
    demoNote: "Bidhaa na bei ni mifano ya majaribio, si ofa halisi.",
    assistantTitle: "Msaidizi wa Shamba 🌦️",
    assistantText: "Pata mwongozo wa mazao na orodha za kukusaidia kupanga kazi za shamba.",
    openAssistant: "Fungua Msaidizi wa Shamba ↗",
    selectCounty: "Chagua kaunti yako",
    communityTitle: "Mahusiano ya wakulima 🤝",
    createListing: "Orodhesha bidhaa",
    publishListing: "Chapisha bidhaa",
    startListing: "Anza kuorodhesha ↗",
    loginTitle: "Karibu ShambaMarket",
    loginNote: "Kuingia kwenye akaunti ni mfano tu. Hakuna nenosiri linalokusanywa."
  },
  sheng: {
    tagline: "Shamba yako, soko yako.",
    home: "Home",
    marketplace: "Soko",
    assistant: "Shamba Assistant",
    community: "Wasee wa shamba",
    login: "Ingia",
    searchPlaceholder: "Tafuta mahindi, maembe, mbolea...",
    allCategories: "Categories zote",
    produce: "Mazao",
    inputs: "Farm inputs",
    livestock: "Mifugo",
    search: "Tafuta soko",
    searchHint: "Pata products za shamba kutoka kwa sellers wa Kenya.",
    heroEyebrow: "MADE FOR FARMERS WA KENYA",
    heroTitle: "Shamba yako. Soko yako. Chance yako.",
    heroText: "Buy, sell na grow pamoja. Mazao, farm inputs na mifugo—zote place moja.",
    explore: "Check soko ↗",
    listProduct: "+ List product yako",
    oneMarket: "SOKO MOJA KUBWA",
    marketTitle: "Soko iko open 🌱",
    marketSubtitle: "Chagua category uone vitu ziko.",
    viewAll: "Check listings zote ↗",
    allProducts: "Products zote",
    allProductsDesc: "Explore soko yote",
    fruits: "Matunda",
    vegetables: "Mboga",
    nuts: "Njugu na karanga",
    starchy: "Vyakula za wanga",
    grains: "Nafaka",
    legumes: "Mikunde",
    allItems: "Vitu zote",
    retail: "Retail",
    bulk: "Bulk",
    both: "Retail + bulk",
    noResults: "Hakuna product imepatikana",
    demoNote: "Hizi listings na bei ni demo, si offers za live.",
    assistantTitle: "Shamba Assistant 🌦️",
    assistantText: "Pata crop tips na checklists za kupanga kazi za shamba yako.",
    openAssistant: "Fungua Shamba Assistant ↗",
    selectCounty: "Chagua county yako",
    communityTitle: "Connections za wakulima 🤝",
    createListing: "List product yako",
    publishListing: "Publish listing",
    startListing: "Anza ku-list ↗",
    loginTitle: "Karibu ShambaMarket",
    loginNote: "Login ni demo tu kwa sasa. Hatukusanyi password."
  }
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function money(value) {
  return Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });
}

function safeImage(url, fallback) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.href;
    }
  } catch (_) {}
  return fallback || "";
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toast(message) {
  const element = $("toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("visible"), 2800);
}

function readListings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn("Could not read saved demo listings.", error);
  }

  // These sample listings are illustrative demo data.
  const samples = [
    {
      id: "sample-maize",
      name: "Dry maize",
      category: "grains",
      saleType: "both",
      retailPrice: 80,
      retailUnit: "kg",
      bulkPrice: 3500,
      bulkUnit: "50 kg bag",
      bulkMinimum: 5,
      quantity: 500,
      stockUnit: "kg",
      location: "Nakuru",
      seller: "Green Valley Farm",
      phone: "",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
      description: "Clean, dry maize. Example listing for demonstration.",
      createdAt: Date.now() - 30000,
      sample: true
    },
    {
      id: "sample-mango",
      name: "Fresh mangoes",
      category: "fruits",
      saleType: "both",
      retailPrice: 30,
      retailUnit: "piece",
      bulkPrice: 1200,
      bulkUnit: "crate",
      bulkMinimum: 3,
      quantity: 200,
      stockUnit: "pieces",
      location: "Machakos",
      seller: "Sunrise Orchard",
      phone: "",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80",
      description: "Fresh seasonal mangoes. Sample prices only.",
      createdAt: Date.now() - 20000,
      sample: true
    },
    {
      id: "sample-potatoes",
      name: "Irish potatoes",
      category: "starchy",
      saleType: "bulk",
      retailPrice: 60,
      retailUnit: "kg",
      bulkPrice: 2800,
      bulkUnit: "50 kg bag",
      bulkMinimum: 4,
      quantity: 300,
      stockUnit: "kg",
      location: "Nyeri",
      seller: "Highland Produce",
      phone: "",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
      description: "Good for household or business orders.",
      createdAt: Date.now() - 10000,
      sample: true
    },
    {
      id: "sample-beans",
      name: "Dry beans",
      category: "legumes",
      saleType: "retail",
      retailPrice: 160,
      retailUnit: "kg",
      bulkPrice: 0,
      bulkUnit: "bag",
      bulkMinimum: 1,
      quantity: 120,
      stockUnit: "kg",
      location: "Kiambu",
      seller: "Kamau Family Farm",
      phone: "",
      image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
      description: "Dry beans for everyday cooking.",
      createdAt: Date.now() - 5000,
      sample: true
    },
    {
      id: "sample-vegetables",
      name: "Fresh vegetables",
      category: "vegetables",
      saleType: "both",
      retailPrice: 50,
      retailUnit: "bunch",
      bulkPrice: 700,
      bulkUnit: "crate",
      bulkMinimum: 2,
      quantity: 80,
      stockUnit: "bunches",
      location: "Nairobi",
      seller: "City Edge Growers",
      phone: "",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=700&q=80",
      description: "Mixed fresh vegetables. Example demo offer.",
      createdAt: Date.now(),
      sample: true
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  } catch (error) {
    console.warn("Browser storage is unavailable.", error);
  }
  return samples;
}

let listings = readListings();
let selectedCategory = "all";
let selectedSaleFilter = "all";
let language = localStorage.getItem(LANGUAGE_KEY) || "mix";

function t(key) {
  const dict = translations[language] || {};
  return dict[key] || translations.en[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = language === "sw" ? "sw" : "en";

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    const value = t(key);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    const value = t(key);
    if (value) element.placeholder = value;
  });

  $("languageSelect").value = language;
  renderListings();
}

function saveListings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    return true;
  } catch (error) {
    console.error("Could not save listings.", error);
    toast("Browser storage is full or unavailable. Try a smaller photo URL.");
    return false;
  }
}

function categoryLabel(category) {
  return t(category) || categoryNames[category] || category;
}

function saleLabel(type) {
  if (type === "retail") return t("retail");
  if (type === "bulk") return t("bulk");
  return t("both");
}

function priceMarkup(product) {
  let html = "";

  if (product.saleType === "retail" || product.saleType === "both") {
    html += `<div class="price-line"><span>${escapeHTML(t("retail"))} · ${escapeHTML(product.retailUnit || "unit")}</span><strong>KSh ${money(product.retailPrice)}</strong></div>`;
  }

  if (product.saleType === "bulk" || product.saleType === "both") {
    html += `<div class="price-line"><span>${escapeHTML(t("bulk"))} · ${escapeHTML(product.bulkUnit || "unit")}<small> · Min. ${money(product.bulkMinimum || 1)}</small></span><strong>KSh ${money(product.bulkPrice)}</strong></div>`;
  }

  return html;
}

function renderListings() {
  if (!$("listingGrid")) return;

  const query = $("searchInput").value.trim().toLowerCase();
  const location = $("locationFilter").value;
  const searchCategory = $("searchCategory").value;
  const sort = $("sortSelect").value;

  let visible = listings.filter(product => {
    const searchable = [
      product.name, product.category, product.location,
      product.seller, product.description
    ].join(" ").toLowerCase();

    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    const saleMatch =
      selectedSaleFilter === "all" ||
      product.saleType === selectedSaleFilter ||
      (selectedSaleFilter === "retail" && product.saleType === "both") ||
      (selectedSaleFilter === "bulk" && product.saleType === "both");

    const searchCategoryMatch =
      searchCategory === "all" ||
      (searchCategory === "produce" && !["inputs", "livestock"].includes(product.category)) ||
      (searchCategory === "inputs" && product.category === "inputs") ||
      (searchCategory === "livestock" && product.category === "livestock");

    return categoryMatch && saleMatch && searchCategoryMatch &&
      (!location || product.location.toLowerCase() === location.toLowerCase()) &&
      (!query || searchable.includes(query));
  });

  if (sort === "price-low") {
    visible.sort((a, b) => comparablePrice(a) - comparablePrice(b));
  } else if (sort === "price-high") {
    visible.sort((a, b) => comparablePrice(b) - comparablePrice(a));
  } else if (sort === "name") {
    visible.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    visible.sort((a, b) => b.createdAt - a.createdAt);
  }

  $("resultsCount").textContent =
    `${visible.length} listing${visible.length === 1 ? "" : "s"}`;

  $("emptyState").hidden = visible.length > 0;

  $("listingGrid").innerHTML = visible.map(product => {
    const fallback = categoryImages[product.category] || categoryImages.grains;
    const imageUrl = safeImage(product.image, fallback);
    const contact = String(product.phone || "").replace(/[^\d+]/g, "");
    const contactButton = contact
      ? `<a class="btn btn-green" href="tel:${escapeHTML(contact)}">Contact seller</a>`
      : `<span class="product-location">Demo listing</span>`;

    return `
      <article class="product-card">
        <img class="product-photo" src="${escapeHTML(imageUrl)}" alt="${escapeHTML(product.name)}" loading="lazy">
        <div class="product-body">
          <div class="product-topline">
            <span class="product-category">${escapeHTML(categoryLabel(product.category))}</span>
            <span class="sale-badge">${escapeHTML(saleLabel(product.saleType))}</span>
          </div>
          <h3>${escapeHTML(product.name)}</h3>
          <div class="product-location">📍 ${escapeHTML(product.location)}</div>
          <div class="price-options">${priceMarkup(product)}</div>
          <div class="product-meta">
            <span>📦 ${money(product.quantity)} ${escapeHTML(product.stockUnit || "units")} available</span>
          </div>
          ${product.description ? `<p class="product-description">${escapeHTML(product.description)}</p>` : ""}
          <div class="seller-line">Seller: ${escapeHTML(product.seller || "Local farmer")}</div>
          <div class="product-actions">${contactButton}</div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".category-card").forEach(button => {
    button.classList.toggle("active", button.dataset.category === selectedCategory);
  });

  document.querySelectorAll("[data-sale-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.saleFilter === selectedSaleFilter);
  });
}

function comparablePrice(product) {
  if (selectedSaleFilter === "bulk" || product.saleType === "bulk") {
    return Number(product.bulkPrice || product.retailPrice || 0);
  }
  return Number(product.retailPrice || product.bulkPrice || 0);
}

function setSaleFields() {
  const type = $("saleType").value;
  const showRetail = type === "retail" || type === "both";
  const showBulk = type === "bulk" || type === "both";

  $("retailFields").hidden = !showRetail;
  $("bulkFields").hidden = !showBulk;

  $("retailPrice").required = showRetail;
  $("bulkPrice").required = showBulk;
}

function openDialog(id) {
  const dialog = $(id);
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function resetListingForm() {
  $("listingForm").reset();
  $("saleType").value = "retail";
  setSaleFields();
  $("listingMessage").textContent = "";
}

function handleListingSubmit(event) {
  event.preventDefault();

  const type = $("saleType").value;
  const retailPrice = Number($("retailPrice").value);
  const bulkPrice = Number($("bulkPrice").value);
  const quantity = Number($("listingQuantity").value);
  const name = $("listingName").value.trim();
  const location = $("listingLocation").value.trim();

  if (!name || !location || !(quantity > 0)) {
    $("listingMessage").textContent = "Please fill in the required fields.";
    return;
  }

  if ((type === "retail" || type === "both") && !(retailPrice > 0)) {
    $("listingMessage").textContent = "Enter a valid retail price.";
    return;
  }

  if ((type === "bulk" || type === "both") && !(bulkPrice > 0)) {
    $("listingMessage").textContent = "Enter a valid bulk price.";
    return;
  }

  const product = {
    id: makeId(),
    name,
    category: $("listingType").value,
    saleType: type,
    retailPrice: type === "bulk" ? 0 : retailPrice,
    retailUnit: $("retailUnit").value,
    bulkPrice: type === "retail" ? 0 : bulkPrice,
    bulkUnit: $("bulkUnit").value,
    bulkMinimum: Math.max(1, Number($("bulkMinimum").value || 1)),
    quantity,
    stockUnit: $("listingStockUnit").value,
    location,
    seller: $("listingSeller").value.trim() || "Local farmer",
    phone: $("listingPhone").value.trim(),
    image: safeImage($("listingImage").value, categoryImages[$("listingType").value]),
    description: $("listingDescription").value.trim(),
    createdAt: Date.now(),
    sample: false
  };

  listings.unshift(product);

  if (!saveListings()) {
    listings = listings.filter(item => item.id !== product.id);
    return;
  }

  selectedCategory = "all";
  selectedSaleFilter = "all";
  $("searchInput").value = "";
  $("searchCategory").value = "all";
  $("locationFilter").value = "";
  $("sortSelect").value = "newest";

  renderListings();
  closeDialog($("listingModal"));
  resetListingForm();
  toast("Listing published in this browser!");
  $("marketplace").scrollIntoView({ behavior: "smooth" });
}

/* Language selector */
$("languageSelect").addEventListener("change", event => {
  language = event.target.value;
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (_) {}
  applyLanguage();
});

/* Search */
$("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  renderListings();
  $("marketplace").scrollIntoView({ behavior: "smooth" });
});
$("searchInput").addEventListener("input", renderListings);
$("searchCategory").addEventListener("change", renderListings);
$("locationFilter").addEventListener("change", renderListings);
$("sortSelect").addEventListener("change", renderListings);

/* Category and retail/bulk filters */
document.querySelector(".category-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderListings();
  $("listingGrid").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector(".filter-pills").addEventListener("click", event => {
  const button = event.target.closest("[data-sale-filter]");
  if (!button) return;
  selectedSaleFilter = button.dataset.saleFilter;
  renderListings();
});

$("showAllButton").addEventListener("click", () => {
  selectedCategory = "all";
  selectedSaleFilter = "all";
  $("searchInput").value = "";
  $("searchCategory").value = "all";
  $("locationFilter").value = "";
  renderListings();
  $("listingGrid").scrollIntoView({ behavior: "smooth" });
});

/* Listing modal */
document.querySelectorAll("[data-open-listing]").forEach(button => {
  button.addEventListener("click", () => {
    resetListingForm();
    openDialog("listingModal");
  });
});

document.querySelectorAll("[data-close-modal]").forEach(button => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");
    if (dialog) closeDialog(dialog);
  });
});

$("listingModal").addEventListener("click", event => {
  if (event.target === $("listingModal")) closeDialog($("listingModal"));
});
$("loginModal").addEventListener("click", event => {
  if (event.target === $("loginModal")) closeDialog($("loginModal"));
});

$("listingForm").addEventListener("submit", handleListingSubmit);
$("saleType").addEventListener("change", setSaleFields);

$("loginButton").addEventListener("click", () => openDialog("loginModal"));

/* Mobile navigation */
$("menuToggle").addEventListener("click", () => {
  const nav = $("mobileNav");
  const opening = nav.hidden;
  nav.hidden = !opening;
  $("menuToggle").setAttribute("aria-expanded", String(opening));
  $("menuToggle").setAttribute("aria-label", opening ? "Close menu" : "Open menu");
});

$("mobileNav").querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    $("mobileNav").hidden = true;
    $("menuToggle").setAttribute("aria-expanded", "false");
  });
});

/* Demo farming insights — no live weather claims */
$("countySelect").addEventListener("change", event => {
  const county = event.target.value;
  const tips = {
    Nairobi: "Urban farming tip: check drainage, use clean containers and plan regular watering.",
    Kiambu: "Planning tip: check local soil conditions and use crop varieties suited to your area.",
    Nakuru: "Planning tip: monitor soil moisture and follow locally recommended planting guidance.",
    Machakos: "Dry-area tip: conserve water, mulch where appropriate and check seasonal forecasts.",
    Nyeri: "Planning tip: check crop disease guidance and local recommendations for your crop.",
    Meru: "Planning tip: choose crop varieties suited to your altitude, rainfall and soil.",
    "Uasin Gishu": "Planning tip: monitor field conditions and consult local guidance for planting times.",
    Kisumu: "Planning tip: check drainage and local weather before planning field work.",
    Kirinyaga: "Planning tip: manage irrigation carefully and check guidance for your selected crop.",
    Other: "Check local agricultural extension guidance and your area's current weather information."
  };
  $("insightMessage").textContent = county
    ? `${county}: ${tips[county] || tips.Other}`
    : "Select a county to view demo farming tips.";
});

/* Start-up */
$("currentYear").textContent = new Date().getFullYear();

try {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  if (savedLanguage && ["en", "sw", "sheng", "mix"].includes(savedLanguage)) {
    language = savedLanguage;
  }
} catch (_) {}

applyLanguage();
setSaleFields();
renderListings();
