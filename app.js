
"use strict";

/* =========================================================
   MAVUNOBRIDGE MARKETPLACE — STABLE DEMO BUILD
   Category filtering, local listings, cart, sample chat handoff,
   lazy category photos and floating back-to-top control.
   ========================================================= */

const LISTINGS_KEY = "mavunobridge_listings_v1";
const CART_KEY = "mavunobridge_cart_v1";
const USER_KEY = "mavunobridge_demo_user_v1";
const PENDING_CHAT_KEY = "mavunobridge_pending_chat_v1";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
  "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
  "Migori", "Mombasa", "Murang'a", "Nairobi City", "Nakuru", "Nandi", "Narok",
  "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta",
  "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot"
];

/* Demo records only. Prices, seller names and contacts are illustrative. */
const demoListings = [
  {
    id: "demo-avocados",
    name: "Fresh Hass Avocados",
    category: "Fruits",
    county: "Kiambu",
    town: "Limuru",
    price: 120,
    quantity: "150 kg",
    saleType: "Both",
    condition: "Fresh / good condition",
    seller: "Green Valley Farm",
    phone: "0712345678",
    description: "Freshly harvested Hass avocados. Retail and bulk enquiries welcome.",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000000000,
    demo: true
  },
  {
    id: "demo-tomatoes",
    name: "Fresh Red Tomatoes",
    category: "Vegetables",
    county: "Nakuru",
    town: "Molo",
    price: 75,
    quantity: "100 kg",
    saleType: "Both",
    condition: "Fresh / good condition",
    seller: "Nakuru Fresh Produce",
    phone: "0723456789",
    description: "Fresh tomatoes for households, shops, hotels and food businesses.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000001000,
    demo: true
  },
  {
    id: "demo-maize",
    name: "Dry Yellow Maize",
    category: "Grains",
    county: "Uasin Gishu",
    town: "Eldoret",
    price: 58,
    quantity: "500 kg",
    saleType: "Bulk",
    condition: "Dry",
    seller: "Uasin Gishu Grain Farm",
    phone: "0734567890",
    description: "Dry maize for retailers, wholesalers and millers.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000002000,
    demo: true
  },
  {
    id: "demo-beans",
    name: "Rosecoco Beans",
    category: "Legumes",
    county: "Meru",
    town: "Meru Town",
    price: 145,
    quantity: "80 kg",
    saleType: "Both",
    condition: "Dry",
    seller: "Meru Harvest",
    phone: "0745678901",
    description: "Clean, dry beans for cooking, resale and bulk purchase.",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000003000,
    demo: true
  },
  {
    id: "demo-potatoes",
    name: "Irish Potatoes",
    category: "Starchy Foods",
    county: "Nyandarua",
    town: "Ol Kalou",
    price: 48,
    quantity: "300 kg",
    saleType: "Bulk",
    condition: "Fresh / good condition",
    seller: "Nyandarua Potato Growers",
    phone: "0756789012",
    description: "Fresh potatoes for traders, hotels and households.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000004000,
    demo: true
  },
  {
    id: "demo-ndengu",
    name: "Green Grams (Ndengu)",
    category: "Legumes",
    county: "Machakos",
    town: "Kangundo",
    price: 135,
    quantity: "120 kg",
    saleType: "Both",
    condition: "Dry",
    seller: "Eastern Harvest Farm",
    phone: "0767890123",
    description: "Clean green grams for retailers, wholesalers and households.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000005000,
    demo: true
  },
  {
    id: "demo-bananas",
    name: "Sweet Bananas",
    category: "Fruits",
    county: "Kisumu",
    town: "Kisumu",
    price: 65,
    quantity: "60 bunches",
    saleType: "Retail",
    condition: "Fresh / good condition",
    seller: "Lake Region Produce",
    phone: "0778901234",
    description: "Ripe and semi-ripe bananas. Contact the seller about quantities.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000006000,
    demo: true
  },
  {
    id: "demo-onions",
    name: "Red Onions",
    category: "Vegetables",
    county: "Nakuru",
    town: "Naivasha",
    price: 90,
    quantity: "200 kg",
    saleType: "Both",
    condition: "Dry",
    seller: "Rift Valley Farm",
    phone: "0789012345",
    description: "Onions for groceries, hotels, home use and produce traders.",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000007000,
    demo: true
  },
  {
    id: "demo-eggs",
    name: "Fresh Farm Eggs",
    category: "Livestock Products",
    county: "Kiambu",
    town: "Thika",
    price: 450,
    quantity: "10 trays",
    saleType: "Both",
    condition: "Fresh",
    seller: "Sunrise Poultry Farm",
    phone: "0711122233",
    description: "Fresh table eggs. Price shown per tray. Retail and bulk orders accepted.",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000008000,
    demo: true
  },
  {
    id: "demo-milk",
    name: "Fresh Cow Milk",
    category: "Livestock Products",
    county: "Nyeri",
    town: "Karatina",
    price: 70,
    quantity: "50 litres",
    saleType: "Both",
    condition: "Fresh",
    seller: "Highland Dairy Farm",
    phone: "0722233344",
    description: "Fresh cow milk. Price shown per litre. Agree safe handling and collection with the seller.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000009000,
    demo: true
  },
  {
    id: "demo-honey",
    name: "Pure Harvest Honey",
    category: "Livestock Products",
    county: "Baringo",
    town: "Marigat",
    price: 600,
    quantity: "10 jars",
    saleType: "Both",
    condition: "Processed",
    seller: "Baringo Beekeepers",
    phone: "0733344455",
    description: "Honey from local beekeepers. Ask about jar sizes before ordering.",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000010000,
    demo: true
  },
  {
    id: "demo-chicken",
    name: "Dressed Chicken",
    category: "Livestock Products",
    county: "Machakos",
    town: "Machakos Town",
    price: 850,
    quantity: "12 birds",
    saleType: "Retail",
    condition: "Chilled / frozen",
    seller: "Eastern Poultry Supplies",
    phone: "0744455566",
    description: "Sample dressed chicken listing. Confirm weight, storage and collection before purchase.",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000011000,
    demo: true
  },
  {
    id: "demo-groundnuts",
    name: "Fresh Groundnuts",
    category: "Nuts",
    county: "Kilifi",
    town: "Malindi",
    price: 220,
    quantity: "35 kg",
    saleType: "Both",
    condition: "Dry / good condition",
    seller: "Coastal Harvest Farm",
    phone: "0712345601",
    description: "Groundnuts for households, shops and bulk buyers. Confirm packaging and collection.",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000012000,
    demo: true
  },
  {
    id: "demo-millet",
    name: "Finger Millet (Wimbi)",
    category: "Cereals",
    county: "Bungoma",
    town: "Bungoma Town",
    price: 95,
    quantity: "100 kg",
    saleType: "Both",
    condition: "Dry",
    seller: "Western Grains Farm",
    phone: "0722345602",
    description: "Dry finger millet for milling, household cooking and cereal traders.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000013000,
    demo: true
  },
  {
    id: "demo-turmeric",
    name: "Fresh Turmeric",
    category: "Spices",
    county: "Kirinyaga",
    town: "Kerugoya",
    price: 180,
    quantity: "40 kg",
    saleType: "Both",
    condition: "Fresh",
    seller: "Kirinyaga Spice Growers",
    phone: "0733345603",
    description: "Fresh turmeric roots for cooking, spice preparation and local traders.",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000014000,
    demo: true
  },
  {
    id: "demo-moringa",
    name: "Dried Moringa Leaves",
    category: "Herbal Products",
    county: "Kitui",
    town: "Kitui Town",
    price: 250,
    quantity: "20 packs",
    saleType: "Both",
    condition: "Dried / packaged",
    seller: "Kitui Natural Harvest",
    phone: "0744345604",
    description: "Sample dried moringa product. Confirm pack size, preparation and storage.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000015000,
    demo: true
  },
  {
    id: "demo-goats",
    name: "Indigenous Goats",
    category: "Livestock",
    county: "Kajiado",
    town: "Ngong",
    price: 8500,
    quantity: "8 goats",
    saleType: "Both",
    condition: "Live animals",
    seller: "Kajiado Livestock Farm",
    phone: "0755345605",
    description: "Sample live-goat listing. Confirm age, health records, weight and transport before purchase.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000016000,
    demo: true
  },
  {
    id: "demo-seedlings",
    name: "Vegetable Seedlings",
    category: "Farm Inputs",
    county: "Nakuru",
    town: "Naivasha",
    price: 25,
    quantity: "500 seedlings",
    saleType: "Both",
    condition: "Nursery-grown",
    seller: "Green Start Nursery",
    phone: "0766345606",
    description: "Sample vegetable seedlings. Confirm variety, quantity and collection date.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000017000,
    demo: true
  },
  {
    id: "demo-sprayer",
    name: "16L Knapsack Sprayer",
    category: "Tools & Equipment",
    county: "Kiambu",
    town: "Thika",
    price: 3500,
    quantity: "5 units",
    saleType: "Both",
    condition: "New",
    seller: "Farm Tools Centre",
    phone: "0700345607",
    description: "Sample farm equipment. Confirm model, accessories, warranty and availability.",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000018000,
    demo: true
  },
  {
    id: "demo-ploughing",
    name: "Tractor Ploughing Service",
    category: "Farmer Services",
    county: "Uasin Gishu",
    town: "Eldoret",
    price: 3000,
    quantity: "10 acres available",
    saleType: "Retail",
    condition: "Service",
    seller: "Eldoret Farm Services",
    phone: "0710345608",
    description: "Sample ploughing service. Agree on acreage, field conditions, travel charges and timing.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=620&q=75",
    createdAt: 1761000019000,
    demo: true
  }
];

const CATEGORY_PHOTOS = {
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=420&q=65",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=420&q=65",
  nuts: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=420&q=65",
  starchy: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=420&q=65",
  grains: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=420&q=65",
  cereals: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=420&q=65",
  legumes: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=420&q=65",
  spices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=420&q=65",
  herbs: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=420&q=65",
  livestock: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=420&q=65",
  livestockProducts: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=420&q=65",
  inputs: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=420&q=65",
  tools: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=420&q=65",
  services: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=420&q=65"
};

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}:`, error);
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function money(value) {
  return "KSh " + Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });
}

function normaliseSaleType(value) {
  const type = String(value || "").trim().toLowerCase();

  if (type === "both" || type === "retail and bulk" || type === "retail & bulk") {
    return "Both";
  }

  if (type === "bulk") return "Bulk";
  return "Retail";
}

function normaliseListing(item) {
  const source = item && typeof item === "object" ? item : {};
  const fallback = demoListings.find((demo) => demo.id === source.id) || {};

  const getText = (value, defaultValue = "") =>
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
      ? value
      : defaultValue;

  const rawName = source.name || source.product || source.title;
  const rawCategory = getText(source.category, fallback.category || "Vegetables");

  const aliases = {
    "Starchy": "Starchy Foods",
    "Herbal": "Herbal Products",
    "Tools": "Tools & Equipment",
    "Animal Products": "Livestock Products",
    "Animal Products / Livestock Products": "Livestock Products"
  };

  const rawCounty = getText(source.county, fallback.county || "Nairobi City");
  const county = COUNTIES.includes(rawCounty)
    ? rawCounty
    : (fallback.county || "Nairobi City");

  const candidatePrice = source.price;
  const validPrice =
    candidatePrice !== "" &&
    candidatePrice !== null &&
    candidatePrice !== undefined &&
    Number.isFinite(Number(candidatePrice));

  return {
    ...fallback,
    ...source,
    id: getText(source.id, fallback.id || `saved-${Date.now()}`),
    name: getText(rawName, fallback.name || "Farm product"),
    category: aliases[rawCategory] || rawCategory,
    county,
    town: getText(source.town, fallback.town || ""),
    price: validPrice ? Number(candidatePrice) : Number(fallback.price || 0),
    quantity: getText(source.quantity, fallback.quantity || "Ask seller"),
    saleType: normaliseSaleType(source.saleType || fallback.saleType),
    condition: getText(source.condition, fallback.condition || "Good condition"),
    seller: getText(source.seller || source.farmerName, fallback.seller || "Local seller"),
    phone: getText(source.phone, fallback.phone || ""),
    description: getText(
      source.description,
      fallback.description || "Contact the seller for more information."
    ),
    image: getText(source.image || source.photo_url, fallback.image || ""),
    createdAt: Number(source.createdAt || source.created_at) ||
      fallback.createdAt || Date.now(),
    ownerEmail: source.ownerEmail || source.owner_email || "",
    demo: source.demo ?? fallback.demo ?? false
  };
}

/* Always rebuild demo samples from the current complete sample data. */
function loadListings() {
  const saved = readJSON(LISTINGS_KEY, []);
  const samplesById = new Set(demoListings.map((item) => item.id));
  const samplesByName = new Set(
    demoListings.map((item) => item.name.toLowerCase())
  );

  const userItems = (Array.isArray(saved) ? saved : [])
    .filter((item) => {
      if (!item || typeof item !== "object") return false;

      const id = String(item.id || "");
      const name = String(
        item.name || item.product || item.title || ""
      ).trim().toLowerCase();

      return item.demo !== true &&
        !id.startsWith("demo-") &&
        !samplesById.has(id) &&
        !samplesByName.has(name);
    })
    .map(normaliseListing);

  const unique = new Map();
  userItems.forEach((item) => unique.set(item.id, item));
  demoListings.forEach((item) => unique.set(item.id, { ...item }));

  return Array.from(unique.values());
}

let listings = loadListings();
let cart = readJSON(CART_KEY, []);
if (!Array.isArray(cart)) cart = [];

let activeSearch = "";
let toastTimer = null;
let scrollTicking = false;
let listingSaveDroppedPhotos = false;

function saveListings() {
  listingSaveDroppedPhotos = false;

  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return true;
  } catch (firstError) {
    console.warn(
      "Normal listing save failed; retrying without embedded photos.",
      firstError
    );
  }

  try {
    const compact = listings.map((item) => {
      if (
        typeof item.image === "string" &&
        item.image.startsWith("data:image/")
      ) {
        listingSaveDroppedPhotos = true;
        return { ...item, image: "" };
      }

      return item;
    });

    localStorage.setItem(LISTINGS_KEY, JSON.stringify(compact));
    listings = compact;
    return true;
  } catch (retryError) {
    console.error("Could not save listings:", retryError);
    return false;
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error("Could not save cart:", error);
    return false;
  }
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  const firstField = $("input, select, textarea, button", modal);
  if (firstField) {
    window.setTimeout(() => firstField.focus({ preventScroll: true }), 30);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");

  if (!$(".modal-backdrop:not(.hidden)")) {
    document.body.classList.remove("modal-open");
  }
}

function populateCountySelects() {
  const filter = $("#locationFilter");
  const formCounty = $("#productCounty");

  if (filter) {
    const current = filter.value || "All";

    filter.innerHTML =
      '<option value="All">All counties</option>' +
      COUNTIES.map((county) =>
        `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
      ).join("");

    filter.value = COUNTIES.includes(current) ? current : "All";
  }

  if (formCounty) {
    const current = formCounty.value || "";

    formCounty.innerHTML =
      '<option value="">Select county</option>' +
      COUNTIES.map((county) =>
        `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
      ).join("");

    formCounty.value = COUNTIES.includes(current) ? current : "";
  }
}

function openListingModal() {
  $("#listingForm")?.reset();

  const error = $("#listingError");
  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }

  populateCountySelects();
  openModal("listingModal");
}

/* Resize uploaded images to make browser storage last longer. */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose a valid image file."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Could not read the photo. Try another file."));
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        reject(new Error("Could not open this photo. Try another image."));
      };

      image.onload = () => {
        const maxWidth = 640;
        const maxHeight = 480;
        const scale = Math.min(
          1,
          maxWidth / image.width,
          maxHeight / image.height
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d", { alpha: false });

        if (!context) {
          reject(new Error("Your browser could not process the photo."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.55));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

/* CREATE AND SAVE A LISTING */
async function handleListingSubmit(event) {
  event.preventDefault();

  const form = $("#listingForm");
  const errorBox = $("#listingError");
  const submit = $("#submitListingButton");

  const showError = (message) => {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove("hidden");
      errorBox.scrollIntoView({ behavior: "auto", block: "center" });
    } else {
      window.alert(message);
    }
  };

  if (!form || !form.reportValidity()) return;

  if (errorBox) errorBox.classList.add("hidden");

  if (submit) {
    submit.disabled = true;
    submit.textContent = "Publishing...";
  }

  const oldListings = listings.slice();

  try {
    const field = (id) =>
      String(document.getElementById(id)?.value ?? "").trim();

    const name = field("productName");
    const category = field("productCategory");
    const county = field("productCounty");
    const town = field("productTown");
    const quantity = field("productQuantity");
    const priceText = field("productPrice");
    const saleType = field("productSaleType");
    const condition = field("productCondition");
    const seller = field("sellerName");
    const phone = field("sellerPhone");
    const description = field("productDescription");
    const photo = $("#productImage")?.files?.[0] || null;

    if (!name || !category || !county || !quantity || !seller || !phone) {
      throw new Error("Please complete all required fields.");
    }

    if (!COUNTIES.includes(county)) {
      throw new Error("Select one of Kenya's 47 counties.");
    }

    if (!["Retail", "Bulk", "Both"].includes(saleType)) {
      throw new Error("Select Retail, Bulk or Both.");
    }

    if (
      priceText === "" ||
      !Number.isFinite(Number(priceText)) ||
      Number(priceText) < 0
    ) {
      throw new Error("Enter a valid price in KSh.");
    }

    if (photo && !photo.type.startsWith("image/")) {
      throw new Error("Choose a valid image file.");
    }

    if (photo && photo.size > 12 * 1024 * 1024) {
      throw new Error("The photo is over 12 MB. Choose a smaller file.");
    }

    const user = readJSON(USER_KEY, null);
    const image = await compressImage(photo);

    const item = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category,
      county,
      town,
      price: Number(priceText),
      quantity,
      saleType,
      condition: condition || "Good condition",
      seller,
      phone,
      image,
      description,
      createdAt: Date.now(),
      ownerEmail: user?.email || "",
      demo: false
    };

    listings.unshift(item);

    if (!saveListings()) {
      listings = oldListings;
      throw new Error(
        "Could not save the listing. Browser storage may be full or unavailable. Try publishing without a photo."
      );
    }

    if ($("#categoryFilter")) $("#categoryFilter").value = "All";
    if ($("#locationFilter")) $("#locationFilter").value = "All";
    if ($("#saleFilter")) $("#saleFilter").value = "All";
    if ($("#sortFilter")) $("#sortFilter").value = "newest";
    if ($("#searchInput")) $("#searchInput").value = "";

    activeSearch = "";

    $$(".category-card").forEach((card) => {
      card.classList.remove("selected");
    });

    if ($("#marketTitle")) {
      $("#marketTitle").textContent = "Marketplace listings";
    }

    renderListings();
    renderCart();

    form.reset();
    closeModal("listingModal");

    $("#marketplace")?.scrollIntoView({
      behavior: "auto",
      block: "start"
    });

    showToast(
      listingSaveDroppedPhotos
        ? "Listing saved, but uploaded photos were removed to save browser storage."
        : "Listing published! It is now visible in the marketplace."
    );
  } catch (error) {
    console.error("Listing publish failed:", error);
    showError(error.message || "Could not publish listing. Please try again.");
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = "Publish listing";
    }
  }
}

/* Filtering. Listings marked Both appear under Retail and Bulk filters. */
function getFilteredListings() {
  const category = $("#categoryFilter")?.value || "All";
  const county = $("#locationFilter")?.value || "All";
  const saleType = $("#saleFilter")?.value || "All";
  const sortBy = $("#sortFilter")?.value || "recommended";
  const search = activeSearch.trim().toLowerCase();

  const result = listings.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesCounty = county === "All" || item.county === county;
    const matchesSale = saleType === "All" ||
      item.saleType === "Both" ||
      item.saleType === saleType;

    const haystack = [
      item.name, item.category, item.county, item.town,
      item.seller, item.description, item.saleType
    ].join(" ").toLowerCase();

    return matchesCategory && matchesCounty && matchesSale &&
      (!search || haystack.includes(search));
  });

  if (sortBy === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    result.sort((a, b) => b.createdAt - a.createdAt);
  }

  return result;
}

/* Build product cards safely using DOM elements. */
function renderListings() {
  const grid = $("#listingGrid");
  if (!grid) return;

  const items = getFilteredListings();
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const saleLabel = item.saleType === "Both"
      ? "Retail + Bulk"
      : item.saleType === "Bulk" ? "Bulk offer" : "Retail";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-photo-wrap";

    const img = document.createElement("img");
    img.className = "product-photo";
    img.alt = item.name;
    img.loading = "lazy";
    img.decoding = "async";

    if (item.image) img.src = item.image;

    const placeholder = document.createElement("div");
    placeholder.className = "product-placeholder";
    placeholder.textContent = item.name;

    if (item.image) {
      img.addEventListener("error", () => {
        img.hidden = true;
        placeholder.hidden = false;
      }, { once: true });

      placeholder.hidden = true;
      imageWrap.append(img, placeholder);
    } else {
      img.hidden = true;
      imageWrap.append(img, placeholder);
    }

    const badge = document.createElement("span");
    badge.className = "product-tag";
    badge.textContent = saleLabel;
    imageWrap.append(badge);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = item.category;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const location = document.createElement("p");
    location.className = "product-location";
    location.textContent = [item.town, item.county].filter(Boolean).join(", ") || "Kenya";

    const price = document.createElement("div");
    price.className = "product-price";
    price.append(document.createTextNode(money(item.price) + " "));

    const unit = document.createElement("span");
    unit.className = "price-unit";
    unit.textContent = "/ unit";
    price.append(unit);

    const quantity = document.createElement("p");
    quantity.className = "product-quantity";
    quantity.textContent =
      `${item.quantity || "Ask seller"} available · ${item.condition || "Good condition"}`;

    const seller = document.createElement("p");
    seller.className = "product-seller";

    const sellerName = document.createElement("strong");
    sellerName.textContent = item.seller || "Local seller";

    seller.append(
      sellerName,
      document.createTextNode(item.description || "Contact seller for more details.")
    );

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-button primary";
    addButton.dataset.add = item.id;
    addButton.textContent = "Add to cart";
    actions.append(addButton);

    const user = readJSON(USER_KEY, null);
    const isOwner = Boolean(
      user && item.ownerEmail && user.email === item.ownerEmail
    );

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "small-button";

    if (isOwner) {
      actionButton.dataset.delete = item.id;
      actionButton.textContent = "Delete";
    } else {
      actionButton.dataset.chat = item.id;
      actionButton.textContent = "Chat seller";
    }

    actions.append(actionButton);
    info.append(category, title, location, price, quantity, seller, actions);

    const phone = String(item.phone || "").replace(/[^0-9+]/g, "");

    if (phone) {
      const call = document.createElement("a");
      call.className = "plain-button call-link";
      call.href = `tel:${phone}`;
      call.textContent = `Call seller · ${item.phone}`;
      info.append(call);
    }

    card.append(imageWrap, info);
    fragment.append(card);
  });

  grid.replaceChildren(fragment);

  $("#emptyState")?.classList.toggle("hidden", items.length > 0);

  if ($("#resultCount")) {
    $("#resultCount").textContent =
      `Showing ${items.length} listing${items.length === 1 ? "" : "s"}`;
  }

  if ($("#listingTotal")) {
    $("#listingTotal").textContent = `${listings.length}+`;
  }
}

/* Open a product-specific demo conversation. */
function openChatForListing(id) {
  const item = listings.find((listing) => listing.id === id);

  if (!item) {
    showToast("Listing not found.");
    return;
  }

  try {
    localStorage.setItem(PENDING_CHAT_KEY, JSON.stringify({
      productId: item.id,
      productName: item.name,
      seller: item.seller || "Farm seller",
      phone: item.phone || "",
      county: item.county || "",
      price: item.price,
      message: `Hi ${item.seller || "there"}, I am interested in ${item.name}. Is it available?`
    }));

    window.location.href = "messages.html";
  } catch (error) {
    showToast("Could not open chat in this browser.");
  }
}

/* CART */
function renderCart() {
  const validCart = cart.filter((entry) =>
    listings.some((item) => item.id === entry.id)
  );

  if (validCart.length !== cart.length) cart = validCart;

  if ($("#cartCount")) {
    $("#cartCount").textContent = cart.reduce(
      (sum, entry) => sum + Number(entry.quantity || 0),
      0
    );
  }

  const cartItems = $("#cartItems");

  if (cartItems) {
    cartItems.replaceChildren();

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Your cart is empty.";
      cartItems.append(empty);
    } else {
      cart.forEach((entry) => {
        const item = listings.find((product) => product.id === entry.id);
        if (!item) return;

        const row = document.createElement("div");
        row.className = "cart-item";

        const detail = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = item.name;

        const quantity = document.createElement("p");
        quantity.textContent = `${entry.quantity} × ${money(item.price)}`;
        detail.append(name, quantity);

        const right = document.createElement("div");
        const total = document.createElement("strong");
        total.textContent = money(item.price * entry.quantity);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.dataset.removeCart = item.id;
        remove.textContent = "Remove";

        right.append(total, document.createElement("br"), remove);
        row.append(detail, right);
        cartItems.append(row);
      });
    }
  }

  const sum = cart.reduce((total, entry) => {
    const item = listings.find((product) => product.id === entry.id);
    return total + (item ? item.price * entry.quantity : 0);
  }, 0);

  if ($("#cartTotal")) $("#cartTotal").textContent = money(sum);

  saveCart();
}

function addToCart(id) {
  const item = listings.find((listing) => listing.id === id);
  if (!item) return;

  const previous = cart.map((entry) => ({ ...entry }));
  const existing = cart.find((entry) => entry.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  if (!saveCart()) {
    cart = previous;
    showToast("Could not save the cart in this browser.");
    return;
  }

  renderCart();
  showToast(`${item.name} added to your cart.`);
}

function removeFromCart(id) {
  const previous = cart.map((entry) => ({ ...entry }));
  cart = cart.filter((entry) => entry.id !== id);

  if (!saveCart()) {
    cart = previous;
    showToast("Could not update the cart.");
    return;
  }

  renderCart();
  showToast("Item removed from cart.");
}

/* CATEGORY SELECTION — CLEAR FILTER CONFLICTS AND REDRAW */
function setCategory(category) {
  const selectedCategory = String(category || "All").trim();

  const categoryFilter = $("#categoryFilter");
  const locationFilter = $("#locationFilter");
  const saleFilter = $("#saleFilter");
  const sortFilter = $("#sortFilter");
  const searchInput = $("#searchInput");
  const marketTitle = $("#marketTitle");

  if (categoryFilter) categoryFilter.value = selectedCategory;
  if (locationFilter) locationFilter.value = "All";
  if (saleFilter) saleFilter.value = "All";
  if (sortFilter) sortFilter.value = "recommended";
  if (searchInput) searchInput.value = "";

  activeSearch = "";

  $$(".category-card").forEach((card) => {
    card.classList.toggle(
      "selected",
      card.dataset.category === selectedCategory
    );
  });

  if (marketTitle) {
    marketTitle.textContent = selectedCategory === "All"
      ? "Marketplace listings"
      : `${selectedCategory} listings`;
  }

  renderListings();

  $("#marketplace")?.scrollIntoView({
    behavior: "auto",
    block: "start"
  });
}

function clearFilters() {
  if ($("#categoryFilter")) $("#categoryFilter").value = "All";
  if ($("#locationFilter")) $("#locationFilter").value = "All";
  if ($("#saleFilter")) $("#saleFilter").value = "All";
  if ($("#sortFilter")) $("#sortFilter").value = "recommended";
  if ($("#searchInput")) $("#searchInput").value = "";

  activeSearch = "";

  $$(".category-card").forEach((card) => card.classList.remove("selected"));

  if ($("#marketTitle")) {
    $("#marketTitle").textContent = "Marketplace listings";
  }

  renderListings();
}

function updateAccountLink() {
  const link = $("#accountLink");
  const user = readJSON(USER_KEY, null);

  if (link && user?.name) {
    link.textContent = user.name;
    link.title = "Demo account saved in this browser";
  }
}

/* Load category backgrounds only when they are near the viewport. */
function setupLazyCategoryPhotos() {
  const photos = $$(".category-photo[data-photo]");

  const applyPhoto = (element) => {
    const url = CATEGORY_PHOTOS[element.dataset.photo];

    if (!url || element.dataset.loaded === "true") return;

    element.style.backgroundImage = `url("${url}")`;
    element.dataset.loaded = "true";
  };

  if (!("IntersectionObserver" in window)) {
    photos.forEach(applyPhoto);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      applyPhoto(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "220px 0px",
    threshold: 0.01
  });

  photos.forEach((photo) => observer.observe(photo));
}

/* Floating Back to top button. */
function setupBackToTop() {
  const button = $("#backToTop");
  if (!button) return;

  const update = () => {
    button.classList.toggle("visible", window.scrollY > 420);
    scrollTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  button.addEventListener("click", () => {
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });

  update();
}

/* STARTUP */
function init() {
  populateCountySelects();

  // Reconcile current demo samples while preserving user-created listings.
  saveListings();

  setupLazyCategoryPhotos();
  setupBackToTop();

  [
    "sellButton",
    "heroSellButton",
    "sellSectionButton",
    "emptySellButton"
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", openListingModal);
  });

  $("#listingForm")?.addEventListener("submit", handleListingSubmit);

  $$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });

  $$(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $$(".modal-backdrop:not(.hidden)").forEach((modal) => closeModal(modal.id));
    }
  });

  /*
    Direct listeners on every category button:
    clicks on the photo or label bubble to the button and select its category.
  */
  $$(".category-card[data-category]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      setCategory(card.dataset.category);
    });
  });

  $("#showAllButton")?.addEventListener("click", () => setCategory("All"));

  $("#categoryFilter")?.addEventListener("change", () => {
    setCategory($("#categoryFilter").value);
  });

  $("#locationFilter")?.addEventListener("change", renderListings);
  $("#saleFilter")?.addEventListener("change", renderListings);
  $("#sortFilter")?.addEventListener("change", renderListings);
  $("#clearFiltersButton")?.addEventListener("click", clearFilters);

  $("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    activeSearch = $("#searchInput")?.value || "";
    renderListings();

    $("#marketplace")?.scrollIntoView({
      behavior: "auto",
      block: "start"
    });
  });

  $("#cartButton")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  $("#checkoutButton")?.addEventListener("click", () => {
    showToast(cart.length
      ? "Demo checkout only. No payment is processed."
      : "Your cart is empty.");
  });

  $("#listingGrid")?.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      addToCart(add.dataset.add);
      return;
    }

    const chat = event.target.closest("[data-chat]");
    if (chat) {
      openChatForListing(chat.dataset.chat);
      return;
    }

    const deleteButton = event.target.closest("[data-delete]");
    if (!deleteButton) return;

    const user = readJSON(USER_KEY, null);

    const index = listings.findIndex((item) =>
      item.id === deleteButton.dataset.delete &&
      user &&
      item.ownerEmail &&
      item.ownerEmail === user.email
    );

    if (index < 0) {
      showToast("Sign in with the demo account used to create this listing to delete it.");
      return;
    }

    if (!window.confirm("Delete your listing?")) return;

    const removed = listings.splice(index, 1)[0];

    if (saveListings()) {
      cart = cart.filter((entry) => entry.id !== removed.id);
      saveCart();
      renderListings();
      renderCart();
      showToast("Listing deleted.");
    } else {
      listings.splice(index, 0, removed);
      showToast("Could not delete listing. Browser storage may be full.");
    }
  });

  $("#cartItems")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-cart]");
    if (button) removeFromCart(button.dataset.removeCart);
  });

  $("#menuToggle")?.addEventListener("click", () => {
    const nav = $("#mainNav");
    if (!nav) return;

    nav.classList.toggle("open");

    $("#menuToggle").setAttribute(
      "aria-expanded",
      nav.classList.contains("open") ? "true" : "false"
    );
  });

  $$("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
      $("#mainNav")?.classList.remove("open");
      $("#menuToggle")?.setAttribute("aria-expanded", "false");
    });
  });

  renderListings();
  renderCart();
  updateAccountLink();
}

document.addEventListener("DOMContentLoaded", init, { once: true });
