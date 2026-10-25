
"use strict";

/* ==========================================
   MAVUNOBRIDGE MARKETPLACE
   Demo version — browser storage
   ========================================== */

const LISTINGS_KEY = "mavunobridge_listings_v1";
const CART_KEY = "mavunobridge_cart_v1";
const USER_KEY = "mavunobridge_demo_user_v1";
const PENDING_CHAT_KEY = "mavunobridge_pending_chat_v1";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi City",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot"
];

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
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=80",
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
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80",
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
    description: "Fresh cow milk. Price shown per litre. Buyers should agree on safe handling and collection.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80",
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
    description: "Honey from local beekeepers. Price shown per jar. Ask the seller about jar sizes.",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=700&q=80",
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
    description: "Sample dressed chicken listing. Confirm weight, storage, handling and collection arrangements with the seller.",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=700&q=80",
    createdAt: 1761000011000,
    demo: true
  }
];

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved data:", error);
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
  const known = String(value || "").trim().toLowerCase();

  if (known === "both" || known === "retail and bulk" || known === "retail & bulk") {
    return "Both";
  }
  if (known === "bulk") return "Bulk";
  return "Retail";
}

function normaliseListing(item) {
  const source = item && typeof item === "object" ? item : {};
  const fallback = demoListings.find((demo) => demo.id === source.id) || {};

  function getText(value, defaultValue) {
    return value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
      ? value
      : defaultValue;
  }

  const oldName = source.name || source.product || source.title;
  const rawCategory = getText(source.category, fallback.category || "Vegetables");
  const categoryAliases = {
    "Starchy": "Starchy Foods",
    "Herbal": "Herbal Products",
    "Tools": "Tools & Equipment",
    "Animal Products": "Livestock Products",
    "Animal Products / Livestock Products": "Livestock Products",
    "Livestock product": "Livestock Products"
  };

  const category = categoryAliases[rawCategory] || rawCategory;

  const candidateCounty = getText(
    source.county,
    fallback.county || "Nairobi City"
  );

  const county = COUNTIES.includes(candidateCounty)
    ? candidateCounty
    : (fallback.county || "Nairobi City");

  const rawPrice = source.price;
  const priceIsValid =
    rawPrice !== undefined &&
    rawPrice !== null &&
    String(rawPrice).trim() !== "" &&
    Number.isFinite(Number(rawPrice));

  return {
    ...fallback,
    ...source,
    id: getText(source.id, fallback.id || `saved-${Date.now()}-${Math.random()}`),
    name: getText(oldName, fallback.name || "Farm product"),
    category,
    county,
    town: getText(source.town, fallback.town || ""),
    price: priceIsValid ? Number(rawPrice) : Number(fallback.price ?? 0),
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
    createdAt: Number(source.createdAt || source.created_at) || fallback.createdAt || Date.now(),
    ownerEmail: source.ownerEmail || source.owner_email || "",
    demo: source.demo ?? fallback.demo ?? false
  };
}

function saveListings() {
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return true;
  } catch (error) {
    console.error("Could not save listings:", error);
    return false;
  }
}

function loadListings() {
  const saved = readJSON(LISTINGS_KEY, null);

  if (!Array.isArray(saved) || saved.length === 0) {
    return demoListings.map((item) => ({ ...item }));
  }

  const repaired = saved.map(normaliseListing);
  const savedIds = new Set(repaired.map((item) => item.id));

  const missingSamples = demoListings.filter(
    (item) => !savedIds.has(item.id)
  );

  return [
    ...repaired,
    ...missingSamples.map((item) => ({ ...item }))
  ];
}

let listings = loadListings();

function loadCart() {
  const saved = readJSON(CART_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

let cart = loadCart();
let activeSearch = "";
let toastTimer = null;

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
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");

  if (!document.querySelector(".modal-backdrop:not(.hidden)")) {
    document.body.style.overflow = "";
  }
}

/* Populate county filters and listing form with all 47 counties. */
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
    formCounty.innerHTML =
      '<option value="">Select county</option>' +
      COUNTIES.map((county) =>
        `<option value="${escapeHTML(county)}">${escapeHTML(county)}</option>`
      ).join("");
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

/* Resize images before saving to reduce storage usage. */
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

    reader.onerror = () => reject(new Error("Could not read the photo."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Could not open the photo."));

      image.onload = () => {
        const maxWidth = 700;
        const maxHeight = 550;
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Your browser could not process the photo."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.52));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

async function handleListingSubmit(event) {
  event.preventDefault();

  const form = $("#listingForm");
  const error = $("#listingError");
  const submitButton = $("#submitListingButton");

  if (!form || !form.reportValidity()) return;

  error.textContent = "";
  error.classList.add("hidden");
  submitButton.disabled = true;
  submitButton.textContent = "Publishing...";

  try {
    const photo = $("#productImage")?.files?.[0] || null;

    if (photo && photo.size > 12 * 1024 * 1024) {
      throw new Error("Photo is over 12 MB. Please choose a smaller image.");
    }

    const county = $("#productCounty").value;
    const saleType = $("#productSaleType").value;
    const category = $("#productCategory").value;

    if (!COUNTIES.includes(county)) {
      throw new Error("Please choose one of Kenya's 47 counties.");
    }

    if (!["Retail", "Bulk", "Both"].includes(saleType)) {
      throw new Error("Select Retail, Bulk or Both.");
    }

    const currentUser = readJSON(USER_KEY, null);

    const newListing = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: $("#productName").value.trim(),
      category,
      county,
      town: $("#productTown").value.trim(),
      quantity: $("#productQuantity").value.trim(),
      price: Number($("#productPrice").value),
      saleType,
      condition: $("#productCondition").value,
      seller: $("#sellerName").value.trim(),
      phone: $("#sellerPhone").value.trim(),
      image: await compressImage(photo),
      description: $("#productDescription").value.trim(),
      createdAt: Date.now(),
      ownerEmail: currentUser?.email || "",
      demo: false
    };

    if (
      !newListing.name ||
      !newListing.category ||
      !newListing.quantity ||
      !newListing.seller ||
      !newListing.phone
    ) {
      throw new Error("Please complete the required fields.");
    }

    if (!Number.isFinite(newListing.price) || newListing.price < 0) {
      throw new Error("Enter a valid price in KSh.");
    }

    listings.unshift(newListing);

    let savedWithoutPhoto = false;

    if (!saveListings()) {
      if (newListing.image) {
        newListing.image = "";
        savedWithoutPhoto = saveListings();
      }

      if (!savedWithoutPhoto) {
        listings.shift();
        throw new Error("Could not save listing. Browser storage may be full.");
      }
    }

    $("#categoryFilter").value = "All";
    $("#locationFilter").value = "All";
    $("#saleFilter").value = "All";
    $("#sortFilter").value = "newest";
    $("#searchInput").value = "";
    activeSearch = "";

    $$(".category-card").forEach((card) => card.classList.remove("selected"));

    $("#marketTitle").textContent = "Marketplace listings";

    renderListings();
    renderCart();
    closeModal("listingModal");
    form.reset();

    $("#marketplace").scrollIntoView({ behavior: "smooth" });

    showToast(
      savedWithoutPhoto
        ? "Listing saved without the photo because storage was limited."
        : "Listing published! It is now visible in the marketplace."
    );
  } catch (err) {
    error.textContent = err.message || "Could not publish listing.";
    error.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publish listing";
  }
}

/* Both listings appear under Retail and Bulk filters. */
function getFilteredListings() {
  const category = $("#categoryFilter")?.value || "All";
  const county = $("#locationFilter")?.value || "All";
  const saleType = $("#saleFilter")?.value || "All";
  const sortBy = $("#sortFilter")?.value || "recommended";
  const search = activeSearch.trim().toLowerCase();

  const result = listings.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesCounty = county === "All" || item.county === county;
    const matchesSale =
      saleType === "All" ||
      item.saleType === "Both" ||
      item.saleType === saleType;

    const text = [
      item.name, item.category, item.county,
      item.town, item.seller, item.description, item.saleType
    ].join(" ").toLowerCase();

    return matchesCategory && matchesCounty && matchesSale &&
      (!search || text.includes(search));
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

function renderListings() {
  const grid = $("#listingGrid");
  if (!grid) return;

  const items = getFilteredListings();

  grid.innerHTML = items.map((item) => {
    const photo = item.image
      ? `<img class="product-photo" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')">`
      : "";

    const placeholder = `
      <div class="product-placeholder ${item.image ? "hidden" : ""}">
        ${escapeHTML(item.name)}
      </div>`;

    const location = [item.town, item.county].filter(Boolean).join(", ");
    const saleLabel = item.saleType === "Both"
      ? "Retail + Bulk"
      : item.saleType === "Bulk" ? "Bulk offer" : "Retail";

    const user = readJSON(USER_KEY, null);
    const isOwner = Boolean(
      user && item.ownerEmail && user.email === item.ownerEmail
    );

    const actionButton = isOwner
      ? `<button class="small-button" type="button" data-delete="${escapeHTML(item.id)}">Delete</button>`
      : `<button class="small-button" type="button" data-chat="${escapeHTML(item.id)}">Chat seller</button>`;

    const safePhone = String(item.phone || "").replace(/[^0-9+]/g, "");

    return `
      <article class="product-card">
        <div class="product-photo-wrap">
          ${photo}
          ${placeholder}
          <span class="product-tag">${escapeHTML(saleLabel)}</span>
        </div>
        <div class="product-info">
          <p class="product-category">${escapeHTML(item.category)}</p>
          <h3>${escapeHTML(item.name)}</h3>
          <p class="product-location">${escapeHTML(location || "Kenya")}</p>
          <div class="product-price">
            ${money(item.price)}
            <span class="price-unit">/ unit</span>
          </div>
          <p class="product-quantity">
            ${escapeHTML(item.quantity || "Ask seller")} available ·
            ${escapeHTML(item.condition || "Good condition")}
          </p>
          <p class="product-seller">
            <strong>${escapeHTML(item.seller || "Local seller")}</strong>
            ${escapeHTML(item.description || "Contact seller for more details.")}
          </p>
          <div class="product-actions">
            <button class="small-button primary" type="button" data-add="${escapeHTML(item.id)}">Add to cart</button>
            ${actionButton}
          </div>
          ${safePhone
            ? `<a class="plain-button call-link" href="tel:${escapeHTML(safePhone)}">Call seller</a>`
            : ""}
        </div>
      </article>`;
  }).join("");

  $("#emptyState")?.classList.toggle("hidden", items.length > 0);

  if ($("#resultCount")) {
    $("#resultCount").textContent =
      `Showing ${items.length} listing${items.length === 1 ? "" : "s"}`;
  }

  if ($("#listingTotal")) {
    $("#listingTotal").textContent = `${listings.length}+`;
  }
}

/* Start a product-specific demo chat. */
function openChatForListing(id) {
  const item = listings.find((listing) => listing.id === id);

  if (!item) {
    showToast("Listing not found.");
    return;
  }

  const pendingChat = {
    productId: item.id,
    productName: item.name,
    seller: item.seller || "Farm seller",
    phone: item.phone || "",
    county: item.county || "",
    price: item.price,
    message: `Hi ${item.seller || "there"}, I'm interested in ${item.name}. Is it available?`
  };

  try {
    localStorage.setItem(PENDING_CHAT_KEY, JSON.stringify(pendingChat));
    window.location.href = "messages.html";
  } catch (error) {
    showToast("Could not open the chat in this browser.");
  }
}

/* ---------- CART ---------- */

function renderCart() {
  const cartCount = $("#cartCount");
  const cartItems = $("#cartItems");
  const cartTotal = $("#cartTotal");

  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  if (cartItems) {
    cartItems.innerHTML = cart.length
      ? cart.map((entry) => {
          const item = listings.find((product) => product.id === entry.id);
          if (!item) return "";

          return `
            <div class="cart-item">
              <div>
                <strong>${escapeHTML(item.name)}</strong>
                <p>${entry.quantity} × ${money(item.price)}</p>
              </div>
              <div>
                <strong>${money(item.price * entry.quantity)}</strong><br>
                <button type="button" data-remove-cart="${escapeHTML(item.id)}">Remove</button>
              </div>
            </div>`;
        }).join("")
      : "<p class='muted'>Your cart is empty.</p>";
  }

  const total = cart.reduce((sum, entry) => {
    const item = listings.find((product) => product.id === entry.id);
    return sum + (item ? item.price * entry.quantity : 0);
  }, 0);

  if (cartTotal) cartTotal.textContent = money(total);
}

function addToCart(id) {
  const product = listings.find((item) => item.id === id);
  if (!product) return;

  const previousCart = cart.map((item) => ({ ...item }));
  const existing = cart.find((item) => item.id === id);

  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });

  if (!saveCart()) {
    cart = previousCart;
    showToast("Could not save cart. Try again.");
    renderCart();
    return;
  }

  renderCart();
  showToast(`${product.name} added to your cart.`);
}

function removeFromCart(id) {
  const previousCart = cart.map((item) => ({ ...item }));
  cart = cart.filter((item) => item.id !== id);

  if (!saveCart()) {
    cart = previousCart;
    showToast("Could not update your cart.");
    return;
  }

  renderCart();
  showToast("Item removed from cart.");
}

/* ---------- PAGE CONTROLS ---------- */

function setCategory(category) {
  if ($("#categoryFilter")) $("#categoryFilter").value = category;

  $$(".category-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.category === category);
  });

  if ($("#marketTitle")) {
    $("#marketTitle").textContent = category === "All"
      ? "Marketplace listings"
      : `${category} listings`;
  }

  renderListings();
  $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
}

function clearFilters() {
  $("#categoryFilter").value = "All";
  $("#locationFilter").value = "All";
  $("#saleFilter").value = "All";
  $("#sortFilter").value = "recommended";
  $("#searchInput").value = "";
  activeSearch = "";

  $$(".category-card").forEach((card) => card.classList.remove("selected"));
  $("#marketTitle").textContent = "Marketplace listings";

  renderListings();
}

function updateAccountLink() {
  const link = $("#accountLink");
  const user = readJSON(USER_KEY, null);

  if (link && user) {
    link.textContent = user.name ? `Hi, ${user.name}` : "My account";
  }
}

function init() {
  populateCountySelects();

  [
    "sellButton", "heroSellButton",
    "sellSectionButton", "emptySellButton"
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

  $$(".category-card").forEach((card) => {
    card.addEventListener("click", () => setCategory(card.dataset.category));
  });

  $("#showAllButton")?.addEventListener("click", () => setCategory("All"));
  $("#categoryFilter")?.addEventListener("change", () => setCategory($("#categoryFilter").value));
  $("#locationFilter")?.addEventListener("change", renderListings);
  $("#saleFilter")?.addEventListener("change", renderListings);
  $("#sortFilter")?.addEventListener("change", renderListings);
  $("#clearFiltersButton")?.addEventListener("click", clearFilters);

  $("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    activeSearch = $("#searchInput").value;
    renderListings();
    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
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
    if (deleteButton) {
      const user = readJSON(USER_KEY, null);
      const index = listings.findIndex((item) =>
        item.id === deleteButton.dataset.delete &&
        user &&
        item.ownerEmail &&
        item.ownerEmail === user.email
      );

      if (index === -1) return;

      if (window.confirm("Delete your listing?")) {
        const removed = listings.splice(index, 1)[0];

        if (saveListings()) {
          cart = cart.filter((entry) => entry.id !== removed.id);
          saveCart();
          renderListings();
          renderCart();
          showToast("Listing deleted.");
        } else {
          listings.splice(index, 0, removed);
          showToast("Could not delete listing.");
        }
      }
    }
  });

  $("#cartItems")?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) removeFromCart(removeButton.dataset.removeCart);
  });

  $("#menuToggle")?.addEventListener("click", () => {
    $("#mainNav")?.classList.toggle("open");
  });

  $$("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => $("#mainNav")?.classList.remove("open"));
  });

  renderListings();
  renderCart();
  updateAccountLink();

  // Persist repaired listings and add the new animal-product samples.
  saveListings();
}

document.addEventListener("DOMContentLoaded", init);
