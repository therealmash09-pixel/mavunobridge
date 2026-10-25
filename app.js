
"use strict";

/* =========================================
   MAVUNOBRIDGE — MARKETPLACE APPLICATION
   Demo storage: this browser only
   ========================================= */

const LISTINGS_KEY = "mavunobridge_listings_v1";
const CART_KEY = "mavunobridge_cart_v1";
const USER_KEY = "mavunobridge_demo_user_v1";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const demoListings = [
  {
    id: "demo-1",
    name: "Fresh Hass Avocados",
    category: "Fruits",
    county: "Kiambu",
    town: "Limuru",
    price: 120,
    quantity: "150 kg",
    saleType: "Retail",
    condition: "Fresh / good condition",
    seller: "Green Valley Farm",
    phone: "0712345678",
    description: "Freshly harvested Hass avocados. Bulk orders can be discussed directly with the farmer.",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 70000,
    demo: true
  },
  {
    id: "demo-2",
    name: "Ripe Red Tomatoes",
    category: "Vegetables",
    county: "Nakuru",
    town: "Molo",
    price: 75,
    quantity: "100 kg",
    saleType: "Retail",
    condition: "Fresh / good condition",
    seller: "Nakuru Fresh Produce",
    phone: "0723456789",
    description: "Fresh tomatoes for homes, shops and food businesses.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 60000,
    demo: true
  },
  {
    id: "demo-3",
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
    description: "Dry maize stored properly. Suitable for bulk buyers and millers.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 50000,
    demo: true
  },
  {
    id: "demo-4",
    name: "Pinto and Rosecoco Beans",
    category: "Legumes",
    county: "Meru",
    town: "Meru Town",
    price: 145,
    quantity: "80 kg",
    saleType: "Retail",
    condition: "Dry",
    seller: "Meru Harvest",
    phone: "0745678901",
    description: "Clean, dry beans ready for cooking or resale.",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 40000,
    demo: true
  },
  {
    id: "demo-5",
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
    description: "Fresh potatoes available for traders, hotels and households.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 30000,
    demo: true
  },
  {
    id: "demo-6",
    name: "Green Grams (Ndengu)",
    category: "Legumes",
    county: "Machakos",
    town: "Kangundo",
    price: 135,
    quantity: "120 kg",
    saleType: "Bulk",
    condition: "Dry",
    seller: "Eastern Harvest Farm",
    phone: "0767890123",
    description: "Clean green grams for retailers, wholesalers and households.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 20000,
    demo: true
  },
  {
    id: "demo-7",
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
    description: "Ripe and semi-ripe bananas. Buyers can agree on quantities directly.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 10000,
    demo: true
  },
  {
    id: "demo-8",
    name: "Red Onions",
    category: "Vegetables",
    county: "Nakuru",
    town: "Naivasha",
    price: 90,
    quantity: "200 kg",
    saleType: "Bulk",
    condition: "Dry",
    seller: "Rift Valley Farm",
    phone: "0789012345",
    description: "Onions for groceries, hotels and produce traders.",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=80",
    createdAt: Date.now() - 5000,
    demo: true
  }
];

let listings = loadListings();
let cart = loadCart();
let toastTimer = null;
let activeSearch = "";

/* ---------- STORAGE HELPERS ---------- */

function readJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn("Could not read browser data:", error);
    return fallback;
  }
}

function loadListings() {
  const saved = readJSON(LISTINGS_KEY, null);

  if (Array.isArray(saved) && saved.length > 0) {
    return saved;
  }

  return [...demoListings];
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

function loadCart() {
  const saved = readJSON(CART_KEY, []);
  return Array.isArray(saved) ? saved : [];
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

/* ---------- GENERAL HELPERS ---------- */

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

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.add("hidden");
  }

  if (!document.querySelector(".modal-backdrop:not(.hidden)")) {
    document.body.style.overflow = "";
  }
}

/* ---------- CREATE LISTING ---------- */

function openListingModal() {
  const form = $("#listingForm");
  const error = $("#listingError");

  if (form) form.reset();

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }

  openModal("listingModal");
}

/*
  Resize uploaded photos before saving them.
  Smaller photos reduce browser storage usage.
*/
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
      reject(new Error("Could not read the photo. Try another image."));
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        reject(new Error("Could not open that photo."));
      };

      image.onload = () => {
        const maxWidth = 700;
        const maxHeight = 550;

        const scale = Math.min(
          1,
          maxWidth / image.width,
          maxHeight / image.height
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Your browser could not process the photo."));
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

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

  let newListing = null;

  try {
    const photo = $("#productImage")?.files?.[0] || null;

    if (photo && photo.size > 12 * 1024 * 1024) {
      throw new Error("That image is over 12 MB. Choose a smaller photo.");
    }

    const imageData = await compressImage(photo);
    const currentUser = readJSON(USER_KEY, null);

    newListing = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: $("#productName").value.trim(),
      category: $("#productCategory").value,
      county: $("#productCounty").value,
      town: $("#productTown").value.trim(),
      quantity: $("#productQuantity").value.trim(),
      price: Number($("#productPrice").value),
      saleType: $("#productSaleType").value,
      condition: $("#productCondition").value,
      seller: $("#sellerName").value.trim(),
      phone: $("#sellerPhone").value.trim(),
      image: imageData,
      description: $("#productDescription").value.trim(),
      createdAt: Date.now(),
      ownerEmail: currentUser?.email || "",
      demo: false
    };

    if (
      !newListing.name ||
      !newListing.category ||
      !newListing.county ||
      !newListing.quantity ||
      !newListing.seller ||
      !newListing.phone
    ) {
      throw new Error("Please complete all required fields.");
    }

    if (!Number.isFinite(newListing.price) || newListing.price < 0) {
      throw new Error("Enter a valid price in KSh.");
    }

    listings.unshift(newListing);

    let publishedWithoutPhoto = false;

    if (!saveListings()) {
      // Remove the photo and retry if storage space is limited.
      if (newListing.image) {
        newListing.image = "";
        publishedWithoutPhoto = saveListings();
      }

      if (!publishedWithoutPhoto) {
        listings.shift();

        throw new Error(
          "Could not save this listing. Browser storage may be full. Try again without a photo."
        );
      }
    }

    // Reset filters so the newly published listing is visible.
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

    closeModal("listingModal");
    form.reset();

    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });

    showToast(
      publishedWithoutPhoto
        ? "Listing published, but its photo could not be saved. Try a smaller photo."
        : "Listing published! It is now visible in the marketplace."
    );
  } catch (err) {
    error.textContent = err.message || "Could not publish the listing. Please try again.";
    error.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publish listing";
  }
}

/* ---------- MARKETPLACE FILTERS ---------- */

function getFilteredListings() {
  const category = $("#categoryFilter")?.value || "All";
  const county = $("#locationFilter")?.value || "All";
  const saleType = $("#saleFilter")?.value || "All";
  const sortBy = $("#sortFilter")?.value || "recommended";
  const search = activeSearch.trim().toLowerCase();

  const result = listings.filter((item) => {
    const matchesCategory =
      category === "All" || item.category === category;

    const matchesCounty =
      county === "All" || item.county === county;

    const matchesSale =
      saleType === "All" || item.saleType === saleType;

    const searchText = [
      item.name,
      item.category,
      item.county,
      item.town,
      item.seller,
      item.description,
      item.saleType
    ].join(" ").toLowerCase();

    return (
      matchesCategory &&
      matchesCounty &&
      matchesSale &&
      (!search || searchText.includes(search))
    );
  });

  if (sortBy === "price-low") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sortBy === "price-high") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sortBy === "newest") {
    result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }

  return result;
}

/* ---------- RENDER PRODUCT CARDS ---------- */

function renderListings() {
  const grid = $("#listingGrid");
  const emptyState = $("#emptyState");
  const resultCount = $("#resultCount");

  if (!grid) return;

  const items = getFilteredListings();

  grid.innerHTML = items.map((item) => {
    const image = item.image
      ? `<img
          class="product-photo"
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')"
        >`
      : "";

    const placeholder = `
      <div class="product-placeholder ${item.image ? "hidden" : ""}">
        ${escapeHTML(item.name)}
      </div>
    `;

    const location = [item.town, item.county]
      .filter(Boolean)
      .join(", ");

    const description = escapeHTML(
      item.description || "Contact the seller for more information."
    );

    const safePhone = String(item.phone || "").replace(/[^0-9+]/g, "");
    const badge = item.saleType === "Bulk" ? "Bulk offer" : "Retail";
    const user = readJSON(USER_KEY, null);

    const ownListing = Boolean(
      user &&
      item.ownerEmail &&
      user.email === item.ownerEmail
    );

    const secondButton = ownListing
      ? `<button class="small-button" data-delete="${escapeHTML(item.id)}" type="button">Delete</button>`
      : `<button class="small-button" data-contact="${escapeHTML(item.id)}" type="button">Contact</button>`;

    return `
      <article class="product-card">
        <div class="product-photo-wrap">
          ${image}
          ${placeholder}
          <span class="product-tag">${escapeHTML(badge)}</span>
        </div>

        <div class="product-info">
          <p class="product-category">${escapeHTML(item.category)}</p>
          <h3>${escapeHTML(item.name)}</h3>
          <p class="product-location">${escapeHTML(location || "Kenya")}</p>

          <div class="product-price">
            ${money(item.price)}
            <span style="font-size:10px;font-weight:500;color:#6c766c">/ unit</span>
          </div>

          <p class="product-quantity">
            ${escapeHTML(item.quantity || "Ask seller")} available ·
            ${escapeHTML(item.condition || "Good condition")}
          </p>

          <p class="product-seller">
            <strong>${escapeHTML(item.seller || "Local seller")}</strong>
            ${description}
          </p>

          <div class="product-actions">
            <button class="small-button primary" data-add="${escapeHTML(item.id)}" type="button">
              Add to cart
            </button>
            ${secondButton}
          </div>

          ${safePhone
            ? `<a class="plain-button" style="display:inline-block;margin-top:8px" href="tel:${escapeHTML(safePhone)}">Call seller</a>`
            : ""}
        </div>
      </article>
    `;
  }).join("");

  if (emptyState) {
    emptyState.classList.toggle("hidden", items.length > 0);
  }

  if (resultCount) {
    resultCount.textContent =
      `Showing ${items.length} listing${items.length === 1 ? "" : "s"}`;
  }

  const total = $("#listingTotal");

  if (total) {
    total.textContent = listings.length + "+";
  }
}

/* ---------- SHOPPING CART ---------- */

function renderCart() {
  const count = $("#cartCount");
  const cartItems = $("#cartItems");
  const totalDisplay = $("#cartTotal");

  if (count) {
    count.textContent = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  }

  if (cartItems) {
    cartItems.innerHTML = cart.length
      ? cart.map((cartItem) => {
          const item = listings.find(
            (product) => product.id === cartItem.id
          );

          if (!item) return "";

          return `
            <div class="cart-item">
              <div>
                <strong>${escapeHTML(item.name)}</strong>
                <p>${cartItem.quantity} × ${money(item.price)}</p>
              </div>
              <div style="text-align:right">
                <strong>${money(Number(item.price) * cartItem.quantity)}</strong>
                <br>
                <button type="button" data-remove-cart="${escapeHTML(item.id)}">
                  Remove
                </button>
              </div>
            </div>
          `;
        }).join("")
      : "<p class='muted'>Your cart is empty. Add something from the marketplace.</p>";
  }

  const total = cart.reduce((sum, cartItem) => {
    const item = listings.find(
      (product) => product.id === cartItem.id
    );

    return sum + (
      item ? Number(item.price) * cartItem.quantity : 0
    );
  }, 0);

  if (totalDisplay) {
    totalDisplay.textContent = money(total);
  }
}

function addToCart(id) {
  const product = listings.find((item) => item.id === id);

  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  if (!saveCart()) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
    showToast("Cart could not be saved in this browser.");
    return;
  }

  renderCart();
  showToast(`${product.name} added to your cart.`);
}

function showCheckoutMessage() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  showToast("Demo checkout only. No payments or orders are processed.");
}

/* ---------- CATEGORY SELECTING ---------- */

function setCategory(category) {
  const select = $("#categoryFilter");

  if (select) {
    select.value = category;
  }

  $$(".category-card").forEach((card) => {
    card.classList.toggle(
      "selected",
      card.dataset.category === category
    );
  });

  const title = $("#marketTitle");

  if (title) {
    title.textContent =
      category === "All"
        ? "Marketplace listings"
        : category + " listings";
  }

  renderListings();
  $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
}

function clearFilters() {
  if ($("#categoryFilter")) $("#categoryFilter").value = "All";
  if ($("#locationFilter")) $("#locationFilter").value = "All";
  if ($("#saleFilter")) $("#saleFilter").value = "All";
  if ($("#sortFilter")) $("#sortFilter").value = "recommended";
  if ($("#searchInput")) $("#searchInput").value = "";

  activeSearch = "";

  $$(".category-card").forEach((card) => {
    card.classList.remove("selected");
  });

  if ($("#marketTitle")) {
    $("#marketTitle").textContent = "Marketplace listings";
  }

  renderListings();
}

/* ---------- ACCOUNT LINK ---------- */

function updateAccountLink() {
  const link = $("#accountLink");
  const user = readJSON(USER_KEY, null);

  if (!link || !user) return;

  link.textContent = user.name ? `Hi, ${user.name}` : "My account";
  link.title = "Open demo account";
}

/* ---------- EVENT LISTENERS ---------- */

function init() {
  // Listing form open buttons.
  [
    "sellButton",
    "heroSellButton",
    "sellSectionButton",
    "emptySellButton"
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener(
      "click",
      openListingModal
    );
  });

  $("#listingForm")?.addEventListener(
    "submit",
    handleListingSubmit
  );

  // Modal close buttons.
  $$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.dataset.close);
    });
  });

  // Click outside a modal to close it.
  $$(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Escape key closes open modals.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $$(".modal-backdrop:not(.hidden)").forEach((modal) => {
        closeModal(modal.id);
      });
    }
  });

  // Category image cards.
  $$(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      setCategory(card.dataset.category);
    });
  });

  $("#showAllButton")?.addEventListener("click", () => {
    setCategory("All");
  });

  $("#categoryFilter")?.addEventListener("change", () => {
    setCategory($("#categoryFilter").value);
  });

  $("#locationFilter")?.addEventListener("change", renderListings);
  $("#saleFilter")?.addEventListener("change", renderListings);
  $("#sortFilter")?.addEventListener("change", renderListings);

  $("#clearFiltersButton")?.addEventListener("click", clearFilters);

  // Marketplace search.
  $("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    activeSearch = $("#searchInput").value;

    renderListings();

    $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
  });

  // Shopping cart modal.
  $("#cartButton")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  $("#checkoutButton")?.addEventListener(
    "click",
    showCheckoutMessage
  );

  // Product buttons are delegated because cards are rendered dynamically.
  $("#listingGrid")?.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
      addToCart(addButton.dataset.add);
      return;
    }

    const contactButton = event.target.closest("[data-contact]");

    if (contactButton) {
      const product = listings.find(
        (item) => item.id === contactButton.dataset.contact
      );

      if (product) {
        const phone = String(product.phone || "").replace(/[^0-9+]/g, "");

        if (phone) {
          window.location.href = "tel:" + phone;
        } else {
          showToast("Seller has not added a phone number.");
        }
      }

      return;
    }

    const deleteButton = event.target.closest("[data-delete]");

    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      const user = readJSON(USER_KEY, null);

      const index = listings.findIndex((item) =>
        item.id === id &&
        user &&
        item.ownerEmail &&
        item.ownerEmail === user.email
      );

      if (index < 0) return;

      if (window.confirm("Delete your listing?")) {
        const removed = listings.splice(index, 1)[0];

        if (saveListings()) {
          cart = cart.filter((item) => item.id !== id);
          saveCart();

          renderListings();
          renderCart();

          showToast("Your listing was deleted.");
        } else {
          listings.splice(index, 0, removed);
          showToast("Could not delete this listing. Try again.");
        }
      }
    }
  });

  // Remove items from the cart.
  $("#cartItems")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-cart]");

    if (!button) return;

    const oldCart = [...cart];

    cart = cart.filter(
      (item) => item.id !== button.dataset.removeCart
    );

    if (!saveCart()) {
      cart = oldCart;
      showToast("Could not update the cart.");
      return;
    }

    renderCart();
    showToast("Item removed from cart.");
  });

  // Mobile menu.
  $("#menuToggle")?.addEventListener("click", () => {
    $("#mainNav")?.classList.toggle("open");
  });

  $$("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
      $("#mainNav")?.classList.remove("open");
    });
  });

  renderListings();
  renderCart();
  updateAccountLink();
}

document.addEventListener("DOMContentLoaded", init);
