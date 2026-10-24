
"use strict";

/* =========================================================
   MAVUNOBRIDGE — MARKETPLACE DEMO
   Current storage: this browser only.
   Supabase integration can replace the local demo storage later.
   ========================================================= */

const MB = {
  keys: {
    listings: "mavunobridge_listings_v1",
    requests: "mavunobridge_requests_v1",
    cart: "mavunobridge_cart_v1",
    profile: "mavunobridge_profile_v1"
  },
  images: {
    fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80",
    vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    nuts: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80",
    starchy: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    grains: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80",
    legumes: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80",
    livestock: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=80",
    inputs: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    services: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
  },
  categoryNames: {
    all: "All listings",
    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchy: "Starchy crops",
    grains: "Grains",
    legumes: "Legumes",
    livestock: "Livestock",
    inputs: "Farm inputs",
    services: "Services & machinery"
  },
  counties: [
    "Nairobi", "Kiambu", "Nakuru", "Uasin Gishu", "Meru", "Nyeri",
    "Kirinyaga", "Murang'a", "Machakos", "Makueni", "Kajiado",
    "Laikipia", "Kakamega", "Bungoma", "Kisumu", "Trans Nzoia",
    "Embu", "Kitui", "Other"
  ]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function makeId(prefix = "item") {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    console.warn("Could not read local demo data:", error);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Could not save demo data:", error);
    showToast("Your browser could not save this. Try fewer or smaller photos.");
    return false;
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price on request";
  return "KSh " + new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 2
  }).format(amount);
}

function unitLabel(unit = "item") {
  const units = {
    kg: "kg", piece: "piece", bunch: "bunch", bag: "bag",
    crate: "crate", litre: "litre", animal: "animal", item: "item",
    acre: "acre", hour: "hour", day: "day", fixed: "fixed price",
    tonne: "tonne", sack: "sack", load: "load"
  };
  return units[unit] || unit;
}

function formatPrice(price, unit) {
  if (price === "" || price === null || price === undefined ||
      !Number.isFinite(Number(price))) {
    return "Price on request";
  }
  const suffix = unit && unit !== "fixed" ? ` / ${unitLabel(unit)}` : "";
  return `${formatMoney(price)}${suffix}`;
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  document.body.classList.add("modal-open");
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");

  if (!$("dialog[open]")) document.body.classList.remove("modal-open");
}

function setupDialogs() {
  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => closeDialog(button.dataset.close));
  });

  $$("dialog").forEach(dialog => {
    dialog.addEventListener("close", () => {
      if (!$("dialog[open]")) document.body.classList.remove("modal-open");
    });

    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog.id);
    });
  });
}

/* ---------------- SAMPLE LISTINGS ----------------
   These are clearly labelled demonstration listings,
   not verified real sellers or current market offers.
--------------------------------------------------- */

function createDemoListings() {
  const now = Date.now();
  const sample = [
    {
      name: "Fresh Irish potatoes",
      category: "starchy", type: "product", saleType: "both",
      retailPrice: 40, retailUnit: "kg",
      bulkPrice: 2800, bulkUnit: "bag", bulkMinimum: 5,
      quantity: 500, stockUnit: "kg", location: "Nakuru",
      seller: "Demo Green Valley Farm", phone: "",
      description: "Demonstration listing for potatoes. Confirm variety, bag size, quality and delivery terms with the seller.",
      images: [MB.images.starchy], demo: true, createdAt: now - 60000
    },
    {
      name: "Dry maize grain",
      category: "grains", type: "product", saleType: "both",
      retailPrice: 45, retailUnit: "kg",
      bulkPrice: 3500, bulkUnit: "bag", bulkMinimum: 10,
      quantity: 1000, stockUnit: "kg", location: "Uasin Gishu",
      seller: "Demo Harvest Point", phone: "",
      description: "Sample grain offer for the marketplace demonstration. Agree on moisture level, bag size and collection details.",
      images: [MB.images.grains], demo: true, createdAt: now - 120000
    },
    {
      name: "Fresh green vegetables",
      category: "vegetables", type: "product", saleType: "retail",
      retailPrice: 60, retailUnit: "bunch",
      quantity: 80, stockUnit: "pieces", location: "Kiambu",
      seller: "Demo Fresh Basket", phone: "",
      description: "Illustrative vegetable listing. Confirm the specific vegetable and available quantity.",
      images: [MB.images.vegetables], demo: true, createdAt: now - 180000
    },
    {
      name: "Dry beans",
      category: "legumes", type: "product", saleType: "both",
      retailPrice: 120, retailUnit: "kg",
      bulkPrice: 7000, bulkUnit: "bag", bulkMinimum: 5,
      quantity: 350, stockUnit: "kg", location: "Meru",
      seller: "Demo Farmers Collective", phone: "",
      description: "Sample dry bean offer. Variety, bag weight and final price need confirmation.",
      images: [MB.images.legumes], demo: true, createdAt: now - 240000
    },
    {
      name: "Avocados",
      category: "fruits", type: "product", saleType: "both",
      retailPrice: 80, retailUnit: "kg",
      bulkPrice: 2200, bulkUnit: "crate", bulkMinimum: 4,
      quantity: 200, stockUnit: "kg", location: "Murang'a",
      seller: "Demo Orchard Farm", phone: "",
      description: "Sample avocado listing. Check size, ripeness, grade and crate capacity before agreeing.",
      images: [MB.images.fruits], demo: true, createdAt: now - 300000
    },
    {
      name: "Groundnuts",
      category: "nuts", type: "product", saleType: "retail",
      retailPrice: 180, retailUnit: "kg",
      quantity: 100, stockUnit: "kg", location: "Kitui",
      seller: "Demo Dryland Harvest", phone: "",
      description: "Demonstration groundnut offer. Confirm whether the product is raw, roasted or processed.",
      images: [MB.images.nuts], demo: true, createdAt: now - 360000
    },
    {
      name: "Healthy dairy goats",
      category: "livestock", type: "product", saleType: "retail",
      retailPrice: 12000, retailUnit: "animal",
      quantity: 4, stockUnit: "animals", location: "Nyeri",
      seller: "Demo Livestock Centre", phone: "",
      description: "Example livestock listing. Buyers should inspect the animals and verify relevant records before purchase.",
      images: [MB.images.livestock], demo: true, createdAt: now - 420000
    },
    {
      name: "Seedling starter packs",
      category: "inputs", type: "product", saleType: "retail",
      retailPrice: 250, retailUnit: "item",
      quantity: 50, stockUnit: "items", location: "Kiambu",
      seller: "Demo Farm Supplies", phone: "",
      description: "Example farm-input listing. Confirm crop variety, pack contents and supplier details.",
      images: [MB.images.inputs], demo: true, createdAt: now - 480000
    },
    {
      name: "Tractor ploughing service",
      category: "services", type: "service", serviceMode: "service",
      servicePrice: 2500, serviceUnit: "acre",
      quantity: 20, stockUnit: "available slots", location: "Nakuru",
      seller: "Demo Field Services", phone: "",
      description: "Example service offer. Confirm acreage, terrain, transport charges and availability.",
      images: [MB.images.services], demo: true, createdAt: now - 540000
    },
    {
      name: "Tractor available for hire",
      category: "services", type: "machinery", serviceMode: "rent",
      servicePrice: 5000, serviceUnit: "day", machineCondition: "Used - good",
      quantity: 1, stockUnit: "items", location: "Uasin Gishu",
      seller: "Demo Machinery Hire", phone: "",
      description: "Illustrative machinery hire offer. Confirm operator, fuel, transport and hire conditions.",
      images: [MB.images.services], demo: true, createdAt: now - 600000
    }
  ];

  return sample.map((item, index) => ({
    id: `demo-${index + 1}`,
    ...item
  }));
}

let listings = readStore(MB.keys.listings, null);
if (!Array.isArray(listings)) {
  listings = createDemoListings();
  writeStore(MB.keys.listings, listings);
}

let requests = readStore(MB.keys.requests, []);
if (!Array.isArray(requests)) requests = [];

let cart = readStore(MB.keys.cart, []);
if (!Array.isArray(cart)) cart = [];

let profile = readStore(MB.keys.profile, null);
let selectedCategory = "all";
let selectedSaleFilter = "all";
let selectedPhotos = [];
let toastTimer = null;

/* ---------------- CATEGORY AND FILTERING ---------------- */

function getListingCategoryLabel(category) {
  return MB.categoryNames[category] || "Other";
}

function listingMatchesSale(item) {
  if (selectedSaleFilter === "all") return true;

  if (selectedSaleFilter === "retail") {
    return item.saleType === "retail" || item.saleType === "both";
  }
  if (selectedSaleFilter === "bulk") {
    return item.saleType === "bulk" || item.saleType === "both";
  }
  if (selectedSaleFilter === "rent") {
    return item.category === "services" && item.serviceMode === "rent";
  }
  if (selectedSaleFilter === "service") {
    return item.category === "services" &&
      (item.type === "service" || item.serviceMode === "service");
  }
  if (selectedSaleFilter === "sale") {
    return item.category === "services" &&
      (item.serviceMode === "sale" || item.type === "machinery");
  }
  return true;
}

function listingMatchesSearch(item, query) {
  if (!query) return true;
  const searchable = [
    item.name, item.description, item.seller, item.location,
    getListingCategoryLabel(item.category), item.serviceMode
  ].filter(Boolean).join(" ").toLowerCase();
  return searchable.includes(query.toLowerCase());
}

function getSortPrice(item) {
  if (item.category === "services") return Number(item.servicePrice) || Infinity;
  if (item.saleType === "bulk") return Number(item.bulkPrice) || Infinity;
  return Number(item.retailPrice) || Number(item.bulkPrice) || Infinity;
}

function getFilteredListings() {
  const query = ($("#searchInput")?.value || "").trim();
  const categoryFromSearch = $("#searchCategory")?.value || "all";
  const county = $("#locationFilter")?.value || "all";
  const sort = $("#sortSelect")?.value || "newest";

  let result = listings.filter(item => {
    const category = categoryFromSearch !== "all"
      ? categoryFromSearch
      : selectedCategory;

    return (category === "all" || item.category === category) &&
      (county === "all" || item.location === county) &&
      listingMatchesSale(item) &&
      listingMatchesSearch(item, query);
  });

  if (sort === "price-low") result.sort((a, b) => getSortPrice(a) - getSortPrice(b));
  else if (sort === "price-high") result.sort((a, b) => getSortPrice(b) - getSortPrice(a));
  else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  else result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return result;
}

function renderListings() {
  const grid = $("#listingGrid");
  const empty = $("#emptyState");
  if (!grid || !empty) return;

  const results = getFilteredListings();
  const categoryFromSearch = $("#searchCategory")?.value || "all";
  const activeCategory = categoryFromSearch !== "all"
    ? categoryFromSearch
    : selectedCategory;

  $("#activeCategoryLabel").textContent = getListingCategoryLabel(activeCategory);
  $("#resultsCount").textContent = `${results.length} ${results.length === 1 ? "offer" : "offers"}`;
  grid.innerHTML = "";
  empty.hidden = results.length !== 0;

  results.forEach(item => {
    const card = document.createElement("article");
    card.className = "listing-card";
    const cover = item.images?.[0] || MB.images[item.category] || MB.images.fruits;
    const retailAvailable = item.saleType === "retail" || item.saleType === "both";
    const bulkAvailable = item.saleType === "bulk" || item.saleType === "both";
    const isService = item.category === "services";

    const badges = [];
    if (item.demo) badges.push('<span class="listing-badge">Demo offer</span>');
    if (retailAvailable && !isService) badges.push('<span class="listing-badge">Retail</span>');
    if (bulkAvailable && !isService) badges.push('<span class="listing-badge bulk">Bulk</span>');
    if (item.serviceMode === "rent") badges.push('<span class="listing-badge">For hire</span>');
    if (item.serviceMode === "service") badges.push('<span class="listing-badge">Service</span>');
    if (item.serviceMode === "sale") badges.push('<span class="listing-badge">For sale</span>');

    let priceHTML = "";
    if (isService) {
      priceHTML = `<div class="listing-price"><small>${escapeHTML(item.serviceMode || "Service")}</small>
        <strong>${escapeHTML(formatPrice(item.servicePrice, item.serviceUnit))}</strong></div>`;
    } else {
      if (retailAvailable) {
        priceHTML += `<div class="listing-price"><small>Retail</small>
          <strong>${escapeHTML(formatPrice(item.retailPrice, item.retailUnit))}</strong></div>`;
      }
      if (bulkAvailable) {
        const minimum = item.bulkMinimum
          ? `<small>Minimum: ${escapeHTML(item.bulkMinimum)} ${escapeHTML(unitLabel(item.bulkUnit))} units</small>`
          : "";
        priceHTML += `<div class="listing-price"><small>Bulk</small>
          <strong>${escapeHTML(formatPrice(item.bulkPrice, item.bulkUnit))}</strong>${minimum}</div>`;
      }
    }

    card.innerHTML = `
      <div class="listing-image">
        <img src="${escapeHTML(cover)}" alt="${escapeHTML(item.name)}" loading="lazy">
        <div class="listing-badges">${badges.join("")}</div>
      </div>
      <div class="listing-body">
        <div class="listing-meta">
          <span>📍 ${escapeHTML(item.location || "Kenya")}</span>
          <span>${escapeHTML(getListingCategoryLabel(item.category))}</span>
        </div>
        <h3>${escapeHTML(item.name)}</h3>
        <p class="listing-description">${escapeHTML(item.description || "Contact the seller for more details.")}</p>
        <div class="listing-prices">${priceHTML}</div>
        <div class="listing-card-footer">
          <button class="button button-outline" data-action="details" data-id="${escapeHTML(item.id)}">View details</button>
          <button class="button button-primary" data-action="cart" data-id="${escapeHTML(item.id)}">Add to cart</button>
        </div>
        <div class="listing-seller">Listed by ${escapeHTML(item.seller || "Marketplace seller")}</div>
      </div>`;
    grid.appendChild(card);
  });

  $$(".category-card").forEach(button => {
    button.classList.toggle("selected", button.dataset.category === activeCategory);
  });
}

function setCategory(category) {
  selectedCategory = category || "all";
  $("#searchCategory").value = category || "all";
  renderListings();
  $("#marketplace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupMarketplace() {
  $$(".category-card, [data-category]").forEach(button => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
  });

  $$(".sale-filter").forEach(button => {
    button.addEventListener("click", () => {
      selectedSaleFilter = button.dataset.saleFilter || "all";
      $$(".sale-filter").forEach(item => {
        item.classList.toggle("active", item === button);
      });
      renderListings();
    });
  });

  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    selectedCategory = $("#searchCategory").value || "all";
    renderListings();
    $("#marketplace").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  ["searchInput", "searchCategory", "locationFilter", "sortSelect"].forEach(id => {
    $(`#${id}`)?.addEventListener(id === "searchInput" ? "input" : "change", () => {
      if (id === "searchCategory") selectedCategory = $("#searchCategory").value;
      renderListings();
    });
  });

  $("#showAllButton")?.addEventListener("click", () => {
    selectedCategory = "all";
    selectedSaleFilter = "all";
    $("#searchInput").value = "";
    $("#searchCategory").value = "all";
    $("#locationFilter").value = "all";
    $("#sortSelect").value = "newest";
    $$(".sale-filter").forEach(button => {
      button.classList.toggle("active", button.dataset.saleFilter === "all");
    });
    renderListings();
  });

  $("#listingGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const item = listings.find(listing => listing.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "details") showListingDetails(item);
    if (button.dataset.action === "cart") addToCart(item);
  });
}

/* ---------------- CREATE LISTING ---------------- */

function updateSaleFields() {
  const saleType = $("#saleType")?.value || "retail";
  const type = $("#listingType")?.value || "product";
  const isService = type === "service" || type === "machinery";

  $("#retailFields").hidden = isService || !["retail", "both"].includes(saleType);
  $("#bulkFields").hidden = isService || !["bulk", "both"].includes(saleType);
  $("#serviceFields").hidden = !isService;

  $("#retailPrice").required = !isService && ["retail", "both"].includes(saleType);
  $("#bulkPrice").required = !isService && ["bulk", "both"].includes(saleType);
  $("#bulkMinimum").required = !isService && ["bulk", "both"].includes(saleType);
  $("#servicePrice").required = isService;
}

function openListingForm() {
  $("#listingForm").reset();
  selectedPhotos = [];
  $("#photoPreview").innerHTML = "";
  $("#listingMessage").textContent = "";
  $("#listingType").value = "product";
  $("#saleType").value = "retail";
  $("#listingCategory").value = "";
  $("#machineCondition").value = "Not applicable";
  updateSaleFields();
  openDialog("listingModal");
}

function setupListingForm() {
  ["openListingButton", "heroSellButton", "marketSellButton", "footerSellButton"]
    .forEach(id => $(`#${id}`)?.addEventListener("click", openListingForm));

  $("#saleType")?.addEventListener("change", updateSaleFields);
  $("#listingType")?.addEventListener("change", () => {
    if ($("#listingType").value !== "product") {
      $("#listingCategory").value = "services";
    }
    updateSaleFields();
  });

  $("#listingCategory")?.addEventListener("change", () => {
    if ($("#listingCategory").value === "services") {
      if ($("#listingType").value === "product") $("#listingType").value = "machinery";
    } else if ($("#listingType").value !== "product") {
      $("#listingType").value = "product";
    }
    updateSaleFields();
  });

  $("#listingPhotos")?.addEventListener("change", handlePhotoSelection);
  $("#photoPreview")?.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-photo]");
    if (!removeButton) return;
    selectedPhotos.splice(Number(removeButton.dataset.removePhoto), 1);
    renderPhotoPreview();
  });

  $("#listingForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const message = $("#listingMessage");
    message.textContent = "";

    const type = $("#listingType").value;
    const category = $("#listingCategory").value;
    const saleType = $("#saleType").value;
    const isService = type === "service" || type === "machinery";

    if (isService && category !== "services") {
      message.textContent = "Choose Services & machinery for a service or machinery listing.";
      return;
    }

    const retailPrice = $("#retailPrice").value;
    const bulkPrice = $("#bulkPrice").value;
    const bulkMinimum = $("#bulkMinimum").value;
    const servicePrice = $("#servicePrice").value;

    if (!isService && ["retail", "both"].includes(saleType) &&
        (retailPrice === "" || Number(retailPrice) < 0)) {
      message.textContent = "Enter a valid retail price.";
      return;
    }
    if (!isService && ["bulk", "both"].includes(saleType) &&
        (bulkPrice === "" || Number(bulkPrice) < 0 || Number(bulkMinimum) < 1)) {
      message.textContent = "Enter a valid bulk price and minimum bulk order.";
      return;
    }
    if (isService && (servicePrice === "" || Number(servicePrice) < 0)) {
      message.textContent = "Enter a valid service or machinery price.";
      return;
    }

    const submitButton = $('#listingForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Preparing listing…";

    try {
      const imageData = [];
      for (const file of selectedPhotos.slice(0, 6)) {
        imageData.push(await compressImage(file));
      }

      const item = {
        id: makeId("listing"),
        name: $("#listingName").value.trim(),
        category,
        type,
        saleType: isService ? "service" : saleType,
        retailPrice: !isService && ["retail", "both"].includes(saleType) ? Number(retailPrice) : null,
        retailUnit: $("#retailUnit").value,
        bulkPrice: !isService && ["bulk", "both"].includes(saleType) ? Number(bulkPrice) : null,
        bulkUnit: $("#bulkUnit").value,
        bulkMinimum: !isService && ["bulk", "both"].includes(saleType) ? Number(bulkMinimum) : null,
        serviceMode: isService ? $("#serviceMode").value : "",
        servicePrice: isService ? Number(servicePrice) : null,
        serviceUnit: $("#serviceUnit").value,
        machineCondition: isService ? $("#machineCondition").value : "",
        quantity: $("#listingQuantity").value === "" ? null : Number($("#listingQuantity").value),
        stockUnit: $("#listingStockUnit").value,
        location: $("#listingLocation").value,
        seller: $("#listingSeller").value.trim(),
        phone: $("#listingPhone").value.trim(),
        description: $("#listingDescription").value.trim(),
        images: imageData.length ? imageData : [MB.images[category] || MB.images.fruits],
        demo: false,
        createdAt: Date.now()
      };

      listings.unshift(item);
      if (!writeStore(MB.keys.listings, listings)) {
        listings.shift();
        return;
      }

      closeDialog("listingModal");
      renderListings();
      showToast("Your listing has been added to this browser's demo marketplace.");
      $("#marketplace").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
      message.textContent = "Could not process those photos. Try smaller images or fewer photos.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Publish listing";
    }
  });
}

async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select image files.");
  }

  // Resize images before saving to localStorage to reduce quota errors.
  const imageURL = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageURL;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const maxDimension = 1100;
    const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * ratio));
    canvas.height = Math.max(1, Math.round(image.height * ratio));

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(imageURL);
  }
}

function handlePhotoSelection(event) {
  const files = [...event.target.files];
  const remaining = Math.max(0, 6 - selectedPhotos.length);

  if (files.length > remaining) {
    showToast("You can add up to 6 photos per listing.");
  }

  selectedPhotos.push(...files.slice(0, remaining));
  selectedPhotos = selectedPhotos.slice(0, 6);
  renderPhotoPreview();

  // Let the same file be selected again if the user removes it.
  event.target.value = "";
}

function renderPhotoPreview() {
  const preview = $("#photoPreview");
  if (!preview) return;
  preview.innerHTML = "";

  selectedPhotos.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      // A file may have been removed while its preview was loading.
      if (!selectedPhotos.includes(file)) return;
      const item = document.createElement("div");
      item.className = "photo-preview-item";
      item.innerHTML = `
        <img src="${reader.result}" alt="Selected listing photo">
        ${index === 0 ? "<small>Cover photo</small>" : ""}
        <button type="button" data-remove-photo="${index}" aria-label="Remove photo">×</button>`;
      preview.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

/* ---------------- LISTING DETAILS ---------------- */

function showListingDetails(item) {
  const images = (item.images || []).slice(0, 6);
  const gallery = images.length
    ? `<div class="detail-gallery">${images.map((src, index) =>
        `<img src="${escapeHTML(src)}" alt="${escapeHTML(item.name)} photo ${index + 1}" loading="lazy">`
      ).join("")}</div>`
    : "";

  const service = item.category === "services";
  const prices = service
    ? `<p><strong>${escapeHTML(item.serviceMode || "Service")}:</strong>
         ${escapeHTML(formatPrice(item.servicePrice, item.serviceUnit))}</p>
       ${item.machineCondition ? `<p><strong>Condition:</strong> ${escapeHTML(item.machineCondition)}</p>` : ""}`
    : `<div class="listing-prices">
        ${(item.saleType === "retail" || item.saleType === "both")
          ? `<div class="listing-price"><small>Retail</small><strong>${escapeHTML(formatPrice(item.retailPrice, item.retailUnit))}</strong></div>` : ""}
        ${(item.saleType === "bulk" || item.saleType === "both")
          ? `<div class="listing-price"><small>Bulk</small><strong>${escapeHTML(formatPrice(item.bulkPrice, item.bulkUnit))}</strong><small>Minimum: ${escapeHTML(item.bulkMinimum || 1)}</small></div>` : ""}
       </div>`;

  const phoneHTML = item.phone
    ? `<p><strong>Contact:</strong> <a href="tel:${escapeHTML(item.phone)}">${escapeHTML(item.phone)}</a></p>`
    : `<p>Contact information has not been provided in this demo listing.</p>`;

  $("#detailContent").innerHTML = `
    ${gallery}
    <span class="request-type">${escapeHTML(getListingCategoryLabel(item.category))}</span>
    <h2>${escapeHTML(item.name)}</h2>
    <p class="detail-copy">${escapeHTML(item.description || "No description provided.")}</p>
    ${prices}
    <div class="detail-contact">
      <p><strong>Seller:</strong> ${escapeHTML(item.seller || "Marketplace seller")}</p>
      <p><strong>County:</strong> ${escapeHTML(item.location || "Not specified")}</p>
      ${item.quantity !== null && item.quantity !== undefined
        ? `<p><strong>Availability:</strong> ${escapeHTML(item.quantity)} ${escapeHTML(item.stockUnit || "")}</p>` : ""}
      ${phoneHTML}
    </div>
    ${item.demo ? '<p class="fine-print">This is a sample demonstration offer, not a verified real seller.</p>' : ""}
    <div class="modal-actions">
      <button class="button button-outline" data-close="detailModal">Close</button>
      <button class="button button-primary" id="detailAddToCart">Add to cart</button>
    </div>`;

  $("#detailAddToCart")?.addEventListener("click", () => addToCart(item));
  openDialog("detailModal");
}

/* ---------------- CART ---------------- */

function addToCart(item) {
  const existing = cart.find(line => line.id === item.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: item.id, quantity: 1 });

  if (!writeStore(MB.keys.cart, cart)) return;
  renderCart();
  showToast(`${item.name} added to your demo cart.`);
}

function getCartLines() {
  return cart.map(line => {
    const item = listings.find(listing => listing.id === line.id);
    return item ? { ...line, item } : null;
  }).filter(Boolean);
}

function getCartPrice(item) {
  if (item.category === "services") return Number(item.servicePrice) || 0;
  if (item.saleType === "bulk") return Number(item.bulkPrice) || 0;
  return Number(item.retailPrice ?? item.bulkPrice) || 0;
}

function renderCart() {
  const lines = getCartLines();
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + getCartPrice(line.item) * line.quantity, 0);

  $("#cartCount").textContent = String(count);
  $("#cartSubtotal").textContent = formatMoney(subtotal);

  const container = $("#cartItems");
  container.innerHTML = "";

  if (!lines.length) {
    container.innerHTML = '<div class="empty-state compact"><span>🛒</span><h3>Your cart is empty</h3><p>Explore the marketplace to add demo items.</p></div>';
    return;
  }

  lines.forEach(line => {
    const item = document.createElement("div");
    item.className = "cart-line";
    item.innerHTML = `
      <div><strong>${escapeHTML(line.item.name)}</strong>
        <small>${escapeHTML(formatPrice(getCartPrice(line.item), line.item.category === "services" ? line.item.serviceUnit : line.item.retailUnit))}</small>
        <small>Quantity: ${escapeHTML(line.quantity)}</small>
      </div>
      <div class="cart-line-actions">
        <button data-cart-action="minus" data-id="${escapeHTML(line.id)}" aria-label="Reduce quantity">−</button>
        <span>${escapeHTML(line.quantity)}</span>
        <button data-cart-action="plus" data-id="${escapeHTML(line.id)}" aria-label="Increase quantity">+</button>
        <button data-cart-action="remove" data-id="${escapeHTML(line.id)}" aria-label="Remove item">×</button>
      </div>`;
    container.appendChild(item);
  });
}

function setupCart() {
  $("#openCartButton")?.addEventListener("click", () => {
    renderCart();
    openDialog("cartModal");
  });

  $("#cartItems")?.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const line = cart.find(item => item.id === button.dataset.id);
    if (!line) return;

    if (button.dataset.cartAction === "minus") line.quantity -= 1;
    if (button.dataset.cartAction === "plus") line.quantity += 1;
    if (button.dataset.cartAction === "remove") line.quantity = 0;

    cart = cart.filter(item => item.quantity > 0);
    writeStore(MB.keys.cart, cart);
    renderCart();
  });

  $("#clearCartButton")?.addEventListener("click", () => {
    cart = [];
    writeStore(MB.keys.cart, cart);
    renderCart();
    showToast("Demo cart cleared.");
  });

  $("#checkoutButton")?.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }
    showToast("Demo only: no order or payment has been sent.");
  });
}

/* ---------------- BUYER REQUEST BOARD ---------------- */

function renderRequests() {
  const grid = $("#requestGrid");
  const empty = $("#requestEmpty");
  if (!grid || !empty) return;

  grid.innerHTML = "";
  empty.hidden = requests.length > 0;

  [...requests].sort((a, b) => b.createdAt - a.createdAt).forEach(request => {
    const card = document.createElement("article");
    card.className = "request-card";
    card.innerHTML = `
      <span class="request-type">${escapeHTML(request.type)}</span>
      <h3>${escapeHTML(request.title)}</h3>
      <div class="request-details">
        <span>📍 ${escapeHTML(request.location)}</span>
        ${request.budget !== null ? `<span>💰 Budget: ${escapeHTML(formatMoney(request.budget))}</span>` : ""}
      </div>
      <p>${escapeHTML(request.description || "Contact the buyer for more details.")}</p>
      ${request.contact
        ? `<p><strong>Contact:</strong> ${escapeHTML(request.contact)}</p>`
        : '<p class="fine-print">No contact details provided.</p>'}
      <p class="fine-print">${request.demo ? "Sample request" : "Local demo request"}</p>`;
    grid.appendChild(card);
  });
}

function openRequestForm() {
  $("#requestForm").reset();
  $("#requestMessage").textContent = "";
  openDialog("requestModal");
}

function setupRequests() {
  $("#openRequestButton")?.addEventListener("click", openRequestForm);
  $("#openRequestButtonEmpty")?.addEventListener("click", openRequestForm);

  $("#requestForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const budgetText = $("#requestBudget").value;
    const request = {
      id: makeId("request"),
      title: $("#requestTitle").value.trim(),
      type: $("#requestType").value,
      location: $("#requestLocation").value,
      budget: budgetText === "" ? null : Number(budgetText),
      contact: $("#requestContact").value.trim(),
      description: $("#requestDescription").value.trim(),
      createdAt: Date.now(),
      demo: false
    };

    if (!request.title || !request.location) {
      $("#requestMessage").textContent = "Please provide a request title and county.";
      return;
    }

    requests.unshift(request);
    if (!writeStore(MB.keys.requests, requests)) {
      requests.shift();
      return;
    }

    renderRequests();
    closeDialog("requestModal");
    showToast("Your request has been posted in this browser's demo board.");
    $("#need-board").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------------- DEMO PROFILE ---------------- */

function renderProfileButton() {
  const button = $("#profileButton");
  if (!button) return;
  button.textContent = profile?.name
    ? `Hi, ${profile.name.slice(0, 14)}`
    : "My profile";
}

function setupProfile() {
  renderProfileButton();

  $("#profileButton")?.addEventListener("click", () => {
    $("#profileName").value = profile?.name || "";
    $("#profileRole").value = profile?.role || "farmer";
    openDialog("loginModal");
  });

  $("#loginForm")?.addEventListener("submit", event => {
    event.preventDefault();
    profile = {
      name: $("#profileName").value.trim(),
      role: $("#profileRole").value
    };

    if (!profile.name) return;
    if (!writeStore(MB.keys.profile, profile)) return;

    renderProfileButton();
    closeDialog("loginModal");
    showToast("Demo profile saved in this browser. No account was created.");
  });
}

/* ---------------- COUNTY INSIGHTS ---------------- */

const countyInsights = {
  Nairobi: "Explore urban retailers, food businesses and buyers. Use the county filter to narrow available demo offers.",
  Kiambu: "Discover sample horticulture, fruit and farm-input offers. Check each listing for its actual collection location.",
  Nakuru: "Explore illustrative grain, potato and agricultural-service listings in this demo marketplace.",
  "Uasin Gishu": "Explore sample grain and machinery offers. Verify quantities, quality and transport arrangements directly.",
  Meru: "Discover illustrative legume and produce offers. Ask sellers about harvest timing and availability.",
  Nyeri: "Explore sample livestock and agricultural offers. Confirm quality and seller details before making arrangements.",
  Kirinyaga: "Use category filters to explore sample produce listings and compare seller-provided terms.",
  "Murang'a": "Explore illustrative fruit and produce listings. Confirm grades, quantities and delivery terms with sellers.",
  Machakos: "Browse the marketplace for sample farm-input, produce and service listings.",
  Makueni: "Explore sample dryland produce and agricultural-service offers in this demonstration.",
  Kajiado: "Browse livestock and machinery categories, and verify all listing information before arranging a transaction.",
  Laikipia: "Explore sample livestock and agricultural-service listings in the demo marketplace.",
  Kakamega: "Browse produce and farm-input categories to discover illustrative offers.",
  Bungoma: "Explore sample grain and produce offers. Confirm prices and bag sizes directly with sellers.",
  Kisumu: "Use the search and county filters to find relevant sample offers in the marketplace.",
  "Trans Nzoia": "Explore illustrative grain and farm-service offers. Check the seller's details and availability.",
  Embu: "Browse produce, grain and farm-input categories for demonstration listings.",
  Kitui: "Explore sample nuts and dryland produce listings. Confirm product condition and quantity.",
  Other: "Choose a category or search for a product to discover relevant listings in this demo."
};

function setupCountyInsights() {
  const select = $("#countySelect");
  if (!select) return;

  function update() {
    const county = select.value;
    $("#insightMessage").innerHTML = `
      <span class="insight-icon">📍</span>
      <h3>${escapeHTML(county)} market insight</h3>
      <p>${escapeHTML(countyInsights[county] || countyInsights.Other)}</p>
      <button class="button button-outline" id="filterCountyButton" type="button">View ${escapeHTML(county)} listings →</button>`;

    $("#filterCountyButton")?.addEventListener("click", () => {
      $("#locationFilter").value = county;
      selectedCategory = "all";
      $("#searchCategory").value = "all";
      renderListings();
      $("#marketplace").scrollIntoView({ behavior: "smooth" });
    });
  }

  select.addEventListener("change", update);
  update();
}

/* ---------------- MOBILE NAVIGATION ---------------- */

function setupMobileMenu() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "☰";
    });
  });
}

/* ---------------- STARTUP ---------------- */

function initialiseApp() {
  $("#currentYear").textContent = String(new Date().getFullYear());

  setupDialogs();
  setupMarketplace();
  setupListingForm();
  setupCart();
  setupRequests();
  setupProfile();
  setupCountyInsights();
  setupMobileMenu();

  renderListings();
  renderCart();
  renderRequests();
  updateSaleFields();

  console.info("MavunoBridge demo marketplace loaded.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseApp);
} else {
  initialiseApp();
}
