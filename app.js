    // Ask Unsplash for a smaller picture: cards are small, so 420px wide is plenty and loads much faster.
  function lightImage(url) {
    const value = String(url || "");
    if (!value.includes("images.unsplash.com")) return value;
    return value.replace(/([?&])w=\d+/, "$1w=420").replace(/([?&])q=\d+/, "$1q=62");
  }

  function setImageFallback(image, item) {
    if (!image || image.dataset.fallbackApplied === "yes") return;
    image.dataset.fallbackApplied = "yes";

    const fallback = document.createElement("div");
    fallback.className = "product-image-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", `Photo unavailable for ${item?.name || "this product"}`);
    fallback.textContent = "Photo not available";
    fallback.style.display = "flex";
    fallback.style.alignItems = "center";
    fallback.style.justifyContent = "center";
    fallback.style.flexDirection = "column";
    fallback.style.minHeight = "150px";
    fallback.style.width = "100%";
    fallback.style.padding = "16px";
    fallback.style.boxSizing = "border-box";
    fallback.style.background = "linear-gradient(135deg, #edf4e7, #dce8d3)";
    fallback.style.color = "#36553b";
    fallback.style.textAlign = "center";
    fallback.style.fontSize = "0.9rem";
    fallback.style.fontWeight = "700";
    image.replaceWith(fallback);
  }
    function renderListings() {
    const grid = $("#listingGrid");
    if (!grid) return;

    const results = getFilteredListings();
    const visibleResults = results.slice(0, visibleListingLimit);
    grid.innerHTML = "";

    visibleResults.forEach(item => {
      const fair = getFairPrice(item);
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.listingId = item.id;

      const imageWrap = document.createElement("div");
      imageWrap.className = "product-image-wrap";
      const image = document.createElement("img");
      image.className = "product-image";
      image.alt = `${item.name || "Farm product"} product photo`;
      image.loading = "lazy";
      image.decoding = "async";
      image.fetchPriority = "low";
      image.addEventListener("error", () => setImageFallback(image, item), { once: true });
      if (typeof item.image === "string" && item.image.trim()) image.src = item.image;
      imageWrap.appendChild(image);
      if (!item.image || !String(item.image).trim()) setImageFallback(image, item);

      const saleBadge = document.createElement("span");
      saleBadge.className = "sale-badge";
      saleBadge.textContent = saleLabel(item.sale);
      imageWrap.appendChild(saleBadge);

      if (item.demo) {
        const badge = document.createElement("span");
        badge.className = "demo-badge";
        badge.textContent = t("demoBadge");
        imageWrap.appendChild(badge);
      }

      const body = document.createElement("div");
      body.className = "product-body";

      const category = document.createElement("small");
      category.textContent = normalizeCategory(item.category) || "Agriculture";

      const title = document.createElement("h3");
      title.textContent = item.name || "Untitled listing";

      const location = document.createElement("p");
      location.className = "location";
      location.textContent = `📍 ${[item.town, item.county].filter(Boolean).join(", ")}`;

      const profileStatus = document.createElement("p");
      profileStatus.className = "seller-trust-note";
      profileStatus.textContent = item.demo
        ? "Sample seller profile · not independently verified"
        : "Seller-provided profile · confirm details before agreeing";

      const reviewSummary = document.createElement("p");
      reviewSummary.className = "seller-review-summary";
      const localReviews = getLocalArray(STORAGE.demoReviews).filter(review => review.productId === item.id);
      if (localReviews.length) {
        const average = localReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / localReviews.length;
        reviewSummary.textContent = `⭐ ${average.toFixed(1)}/5 · ${localReviews.length} local demo review${localReviews.length === 1 ? "" : "s"} (not verified)`;
      } else {
        reviewSummary.textContent = "No local demo reviews yet";
      }

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

      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = item.description || "";

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

      const groupButton = document.createElement("button");
      groupButton.type = "button";
      groupButton.className = "small mb-action-button";
      groupButton.dataset.mbAction = "group-buy";
      groupButton.dataset.listingId = item.id;
      groupButton.textContent = "Join group buy";

      const preorderButton = document.createElement("button");
      preorderButton.type = "button";
      preorderButton.className = "small mb-action-button";
      preorderButton.dataset.mbAction = "preorder";
      preorderButton.dataset.listingId = item.id;
      preorderButton.textContent = "Pre-order interest";

      const deliveryButton = document.createElement("button");
      deliveryButton.type = "button";
      deliveryButton.className = "small mb-action-button";
      deliveryButton.dataset.mbAction = "delivery";
      deliveryButton.dataset.listingId = item.id;
      deliveryButton.textContent = "Request delivery quote";

      const reviewButton = document.createElement("button");
      reviewButton.type = "button";
      reviewButton.className = "small mb-action-button";
      reviewButton.dataset.mbAction = "review";
      reviewButton.dataset.listingId = item.id;
      reviewButton.textContent = "Delivery review (demo)";

      const callLink = document.createElement("a");
      callLink.className = "small call-link";
      callLink.textContent = t("contact");
      const phone = normalizePhone(item.phone);
      if (phone) {
        callLink.href = `tel:${phone}`;
      } else {
        callLink.href = "#";
        callLink.addEventListener("click", event => {
          event.preventDefault();
          showToast(t("noContact"));
        });
      }

      actions.append(
        addButton,
        chatButton,
        groupButton,
        preorderButton,
        deliveryButton,
        reviewButton,
        callLink
      );

      if (item.remote && item.ownerId && item.ownerId !== currentUserId) {
        const orderButton = document.createElement("button");
        orderButton.type = "button";
        orderButton.className = "small primary";
        orderButton.dataset.mbAction = "order";
        orderButton.dataset.listingId = item.id;
        orderButton.textContent = "Request order";
        actions.insertBefore(orderButton, addButton.nextSibling);
      }

      if (item.remote && currentUserId && item.ownerId === currentUserId) {
        const soldButton = document.createElement("button");
        soldButton.type = "button";
        soldButton.className = "small";
        soldButton.textContent = "Mark as sold";
        soldButton.addEventListener("click", () => markOwnListingSold(item));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "small";
        deleteButton.textContent = "Delete my listing";
        deleteButton.addEventListener("click", () => deleteOwnListing(item));

        actions.append(soldButton, deleteButton);
      }

      body.append(category, title, location, profileStatus, reviewSummary, price, fairBadge, fairDetail, quantity);
      if (description.textContent) body.appendChild(description);
      body.appendChild(actions);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    const resultCount = $("#resultCount");
    if (resultCount) resultCount.textContent = t("showing", results.length);

    const active = $("#activeCategory");
    if (active) {
      active.textContent = activeCategory === "All" ? "" : t("categoryLabel", activeCategory);
    }

    const empty = $("#emptyState");
    if (empty) empty.classList.toggle("hidden", results.length > 0);
    grid.classList.toggle("hidden", results.length === 0);

    let moreButton = $("#loadMoreListingsButton");
    if (!moreButton) {
      moreButton = document.createElement("button");
      moreButton.id = "loadMoreListingsButton";
      moreButton.type = "button";
      moreButton.className = "primary-btn mb-load-more";
      moreButton.textContent = "Load more listings";
      grid.insertAdjacentElement("afterend", moreButton);
      moreButton.addEventListener("click", () => {
        visibleListingLimit += 12;
        renderListings();
      });
    }

    const remaining = Math.max(0, results.length - visibleResults.length);
    moreButton.hidden = remaining === 0;
    moreButton.textContent = remaining > 0
      ? `Load ${Math.min(12, remaining)} more listings (${remaining} remaining)`
      : "All listings shown";
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    modal.querySelector("input:not([type=file]), select, textarea, button")?.focus();
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("hidden");
    if (!$$(".modal:not(.hidden)").length) document.body.classList.remove("modal-open");
  }

  function openListingModal() {
    const modal = $("#listingModal");
    if (!modal) {
      console.error("MavunoBridge: #listingModal is missing from index.html");
      showToast("The listing form is missing. Check index.html and refresh.");
      return;
    }
    const user = getUser();
    const sellerName = $("#sellerName");
    if (user && sellerName && !sellerName.value.trim()) {
      sellerName.value = String(user.name).trim();
    }
    openModal("listingModal");
    window.setTimeout(() => $("#productName")?.focus(), 0);
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) { console.info(message); return; }
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimeout) window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function showListingError(message) {
    const error = $("#listingError");
    if (!error) { showToast(message); return; }
    error.textContent = message;
    error.classList.remove("hidden");
  }

  function clearListingError() {
    const error = $("#listingError");
    if (error) { error.textContent = ""; error.classList.add("hidden"); }
  }

  // Resizes the chosen photo and returns a JPEG Blob ready for Supabase Storage.
  function resizeImageToBlob(file) {
    return new Promise((resolve, reject) => {
      if (!file) { resolve(null); return; }
      if (!file.type.startsWith("image/")) { reject(new Error("Please choose an image file.")); return; }
      if (file.size > 8 * 1024 * 1024) { reject(new Error("That photo is too large. Please choose one under 8 MB.")); return; }
      const url = URL.createObjectURL(file);
      const source = new Image();
      source.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That image could not be opened.")); };
      source.onload = () => {
        URL.revokeObjectURL(url);
        const ratio = Math.min(1, 1200 / Math.max(source.width, source.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(source.width * ratio));
        canvas.height = Math.max(1, Math.round(source.height * ratio));
        const context = canvas.getContext("2d");
        if (!context) { reject(new Error("Your browser could not process that photo.")); return; }
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error("Could not prepare the photo. Try a smaller image.")),
          "image/jpeg",
          0.82
        );
      };
      source.src = url;
    });
  }

  function readAndResizeImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) { resolve(""); return; }
      if (!file.type.startsWith("image/")) { reject(new Error("Please choose an image file.")); return; }
      if (file.size > 8 * 1024 * 1024) { reject(new Error("That photo is too large. Please choose one under 8 MB.")); return; }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read the selected photo."));
      reader.onload = () => {
        const source = new Image();
        source.onerror = () => reject(new Error("That image could not be opened."));
        source.onload = () => {
          const maxDimension = 900;
          const ratio = Math.min(1, maxDimension / Math.max(source.width, source.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(source.width * ratio));
          canvas.height = Math.max(1, Math.round(source.height * ratio));
          const context = canvas.getContext("2d");
          if (!context) { reject(new Error("Your browser could not process that photo.")); return; }
          context.drawImage(source, 0, 0, canvas.width, canvas.height);
          try { resolve(canvas.toDataURL("image/jpeg", 0.78)); }
          catch { reject(new Error("Could not prepare the photo. Try a smaller image.")); }
        };
        source.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }
    async function handleListingSubmit(event) {
    event.preventDefault();
    if (isPublishing) return;
    clearListingError();

    const form = $("#listingForm");
    const publishButton = $("#publishListingButton");
    if (!form) { showToast(t("formMissing")); return; }
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const name = $("#productName")?.value.trim() || "";
    const category = normalizeCategory($("#productCategory")?.value || "");
    const county = $("#productCounty")?.value || "";
    const town = $("#productTown")?.value.trim() || "";
    const qty = $("#productQuantity")?.value.trim() || "";
    const price = Number($("#productPrice")?.value);
    const unit = $("#productPriceUnit")?.value || "kg";
    const saleRaw = $("#productSaleType")?.value || "Retail";
    const sale = ["Retail", "Bulk", "Both"].includes(saleRaw) ? saleRaw : "Retail";
    const seller = $("#sellerName")?.value.trim() || "";
    const phone = normalizePhone($("#sellerPhone")?.value);
    const condition = $("#productCondition")?.value || "";
    const description = $("#productDescription")?.value.trim() || "";
    const harvestDate = $("#productHarvestDate")?.value || "";
    const file = $("#productImage")?.files?.[0] || null;

    if (!name || !category || !county || !qty || !seller || !phone) { showListingError(t("fillAll")); return; }
    if (!CATEGORY_NAMES.includes(category)) { showListingError(t("badCategory")); return; }
    if (!COUNTIES.includes(county)) { showListingError(t("badCounty")); return; }
    if (!Number.isFinite(price) || price <= 0) { showListingError(t("badPrice")); return; }
    if (!validPhone(phone)) { showListingError(t("badPhone")); return; }

    isPublishing = true;
    if (publishButton) { publishButton.disabled = true; publishButton.textContent = t("publishing"); }

    try {
      const client = getDb();
      if (!client) throw new Error("Could not reach the database. Please refresh and try again.");

      const { data: sessionData } = await client.auth.getSession();
      const session = sessionData?.session;
      if (!session) {
        showListingError("Please sign in to post a listing. Redirecting you to the sign-in page...");
        window.setTimeout(() => { window.location.href = "login.html"; }, 1800);
        return;
      }
      const userId = session.user.id;
      currentUserId = userId;

      if (!Object.keys(categoryIdByName).length) await loadLookups();
      const categoryId = categoryIdByName[category];
      const countyId = countyIdByKey[countyKey(county)];
      if (!categoryId) throw new Error("That category isn't set up in the database yet.");
      if (!countyId) throw new Error("That county isn't set up in the database yet.");

      // 1. Upload the photo (if any) into this user's own folder.
      let imageUrl = null;
      const blob = await resizeImageToBlob(file);
      if (blob) {
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const upload = await client.storage.from("listing-images").upload(path, blob, {
          contentType: "image/jpeg", cacheControl: "31536000"
        });
        if (upload.error) throw new Error("Photo upload failed: " + upload.error.message);
        imageUrl = client.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
      }

      // 2. Save the listing.
      const dbCondition = condition === "Fresh / good condition" ? "Fresh" : (condition || "Fresh");
      const { data: saved, error: insertError } = await client.from("listings").insert({
        user_id: userId,
        category_id: categoryId,
        county_id: countyId,
        product_name: name,
        town: town || null,
        price,
        price_unit: unit,
        quantity_available: qty,
        sale_type: sale,
        condition: dbCondition,
        description: description || null,
        image_url: imageUrl
      }).select("id,created_at").single();
      if (insertError) {
        if (insertError.code === "23514") {
          throw new Error("The database rejected one of the values (" + insertError.message + "). Please tell the site admin.");
        }
        throw insertError;
      }

      // 3. Remember the seller's name and phone on their profile (best effort).
      let profileUpdate = await client.from("profiles").update({ display_name: seller, phone }).eq("id", userId);
      if (profileUpdate.error) await client.from("profiles").update({ display_name: seller }).eq("id", userId);

      const newListing = {
        id: saved.id, demo: false, remote: true, ownerId: userId,
        name, category, county, town, price, unit, qty, sale, seller, phone,
        condition: dbCondition, description, image: imageUrl || "",
        createdAt: Date.parse(saved.created_at) || Date.now()
      };
      remoteListings = [newListing, ...remoteListings];
      listings = [...DEMO_LISTINGS, ...remoteListings];
      const storageWorked = true;
      const photoDropped = false;

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

      if (!storageWorked) showToast(t("publishedNoSave"));
      else if (photoDropped) showToast(t("publishedNoPhoto"));
      else showToast(t("published"));

      $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("MavunoBridge listing publish error:", error);
      showListingError(error.message || t("publishFailed"));
    } finally {
      isPublishing = false;
      if (publishButton) { publishButton.disabled = false; publishButton.textContent = t("publish"); }
    }
  }

  function openChat(id) {
    const item = listings.find(listing => listing.id === id);
    if (!item) { showToast(t("cartNotFound")); return; }

    if (!item.remote || !item.ownerId) {
      showToast("This is a sample listing. Chat works with real sellers' listings.");
      return;
    }
    if (currentUserId && item.ownerId === currentUserId) {
      showToast("This is your own listing.");
      return;
    }

    const payload = {
      productId: item.id, sellerId: item.ownerId, productName: item.name,
      seller: item.seller, county: item.county,
      message: t("chatDraft", item.name)
    };

    if (!saveStorage(STORAGE.pendingChat, payload)) { showToast(t("chatFailed")); return; }
    window.location.href = "messages.html";
  }

  function requestProduct() {
    const search = ($("#searchInput")?.value || "").trim();
    const wanted = search || (activeCategory !== "All" ? activeCategory : "");
    try { if (wanted) sessionStorage.setItem(PREFILL_KEY, wanted); }
    catch (error) { console.warn("Could not pass the search to the request board:", error); }
    window.location.href = "buyer-requests.html";
  }

  function saveCart() {
    if (!saveStorage(STORAGE.cart, cart)) { showToast(t("cartSaveFail")); return false; }
    return true;
  }

  function addToCart(id) {
    const item = listings.find(listing => listing.id === id);
    if (!item) { showToast(t("cartNotFound")); return; }
    const existing = cart.find(entry => entry.id === id);
    if (existing) existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
    else cart.push({ id, quantity: 1 });
    if (saveCart()) { updateCartCount(); showToast(t("cartAdded", item.name)); }
  }

  function updateCartCount() {
    const count = $("#cartCount");
    if (!count) return;
    const total = cart.reduce((sum, entry) => sum + Math.max(1, Number(entry.quantity || 1), 0), 0);
    count.textContent = String(total);
  }

  function renderCart() {
    const container = $("#cartItems");
    if (!container) return;
    container.innerHTML = "";
    cart = cart.filter(entry => listings.some(item => item.id === entry.id));
    saveStorage(STORAGE.cart, cart);

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.textContent = t("cartEmpty");
      container.appendChild(empty);
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
      detail.textContent = `${quantity} × ${money(item.price)} / ${item.unit || "unit"} · ${item.seller || t("sellerFallback")}`;
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

  function clearFilters() {
    activeCategory = "All";
    visibleListingLimit = 12;
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
    /* =========================================================
     MAVUNOBRIDGE UNIQUE DEMO FEATURES
     Mavuno Pool, HarvestLink, FreshRoute, FarmProof, GrowCircles,
     Planting Watch and Mavuno Learn. These store local demo entries;
     they do not claim live bookings, delivery ETAs, SMS or payments.
  ========================================================= */

  let mavunoFeatureModal = null;
  let mavunoFeatureContext = null;

  function getLocalArray(storageKey) {
    const value = loadStorage(storageKey, []);
    return Array.isArray(value) ? value : [];
  }

  function saveLocalRecord(storageKey, record) {
    const records = getLocalArray(storageKey);
    records.push({ ...record, createdAt: Date.now(), demoOnly: true });
    return saveStorage(storageKey, records);
  }

  function addMavunoFeatureStyles() {
    if ($("#mavunoFeatureStyles")) return;

    const style = document.createElement("style");
    style.id = "mavunoFeatureStyles";

    style.textContent = `
      .mb-innovation-hub { margin: 8px auto 62px; }
      .mb-innovation-header { max-width: 760px; margin: 0 0 20px; }
      .mb-innovation-header h2 { margin-bottom: 8px; color: var(--green-950, #163321); }
      .mb-innovation-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
      .mb-innovation-card { min-width: 0; padding: 19px; border: 1px solid #dfe7dc; border-radius: 16px; background: #fff; box-shadow: 0 4px 14px rgba(27,56,34,.06); }
      .mb-innovation-card h3 { margin: 9px 0 8px; font-size: 1rem; color: #1e402b; }
      .mb-innovation-card p { margin: 0 0 14px; font-size: .82rem; line-height: 1.55; }
      .mb-innovation-icon { font-size: 1.55rem; }
      .mb-innovation-card button, .mb-innovation-card a { width: 100%; min-height: 38px; }
      .seller-trust-note { margin: -3px 0 4px; color: #6d796e; font-size: .67rem; line-height: 1.4; }
      .seller-review-summary { margin: 0 0 10px; color: #536d48; font-size: .68rem; line-height: 1.4; }
      .mb-action-button { border-color: #d2e2cb !important; background: #f5faf1 !important; color: #315b36 !important; }
      .mb-action-button:hover { background: #e8f2e2 !important; }
      .mb-load-more { display: flex; margin: 20px auto 0; }
      .mb-load-more[hidden] { display:none!important; }
      .mb-feature-modal { position:fixed; inset:0; z-index:7000; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,31,20,.62); }
      .mb-feature-modal[hidden] { display:none!important; }
      .mb-feature-dialog { width:min(560px,100%); max-height:90vh; overflow:auto; padding:24px; border-radius:19px; background:#fff; box-shadow:0 20px 70px #0f23154d; }
      .mb-feature-dialog h2 { margin:0 44px 8px 0; color:#163321; font-size:1.45rem; }
      .mb-feature-dialog > p { font-size:.86rem; line-height:1.6; }
      .mb-feature-close { float:right; width:36px; height:36px; border:1px solid #dfe7dc; border-radius:50%; background:#f7faf5; color:#1e402b; font-size:22px; cursor:pointer; }
      .mb-feature-form { display:grid; gap:13px; margin-top:17px; }
      .mb-feature-form label { display:grid; gap:6px; color:#34483a; font-size:.83rem; font-weight:700; }
      .mb-feature-form input, .mb-feature-form select, .mb-feature-form textarea { width:100%; min-height:42px; padding:10px 12px; border:1px solid #d5dfd2; border-radius:10px; font:inherit; }
      .mb-feature-modal-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:9px; margin-top:18px; }
      .mb-feature-note { padding:10px 12px; border-radius:10px; background:#f4f8f1; color:#5a6c5b; font-size:.76rem; line-height:1.5; }
      @media(max-width:1000px){.mb-innovation-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
      @media(max-width:560px){.mb-innovation-grid{grid-template-columns:1fr;}.mb-feature-dialog{padding:18px;}}
    `;

    document.head.appendChild(style);
  }

  function renderMavunoInnovationHub() {
    addMavunoFeatureStyles();

    if ($("#mavunoInnovationHub")) return;

    const anchor = $(".feature-strip");
    if (!anchor) return;

    const section = document.createElement("section");
    section.id = "mavunoInnovationHub";
    section.className = "section-wrap mb-innovation-hub";

    section.innerHTML = `
      <div class="mb-innovation-header">
        <span class="eyebrow">BUILT FOR KENYAN FARMERS</span>
        <h2>MavunoBridge Plus</h2>
        <p>More than a soko: pool orders, plan harvest sales, request logistics and learn locally. These are interactive demo workflows, not live bookings or payments.</p>
      </div>

      <div class="mb-innovation-grid">
        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🤝</span>
          <h3>Mavuno Pool</h3>
          <p>Record interest in buying inputs together with nearby farmers to explore bulk pricing.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="group-buy">Start a group-buy</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🌱</span>
          <h3>AgriBundle Builder</h3>
          <p>Find starter bundles and coordinate seed, planting guide and input needs from one listing.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="bundle">Explore input bundles</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🗓️</span>
          <h3>HarvestLink</h3>
          <p>Register a local pre-order interest for a crop, quantity and expected harvest date.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="preorder">Plan a pre-order</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🚚</span>
          <h3>FreshRoute</h3>
          <p>Capture a delivery-quote request with destination and quantity. No fake ETA or fee is shown.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="delivery">Request a quote</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧾</span>
          <h3>FarmProof reviews</h3>
          <p>Record a demo delivery confirmation before submitting a local review. This is not independent verification.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="review">Review a listing</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">👩🏽‍🌾</span>
          <h3>County Grower Circles</h3>
          <p>Save your county and crop interests to model local groups for crop advice, transport and buyer leads.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="circle">Join a local circle</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🌦️</span>
          <h3>Planting Watch</h3>
          <p>Save county and crop alert preferences. This demo does not send live SMS or WhatsApp alerts.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="alerts">Set alert preferences</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">📚</span>
          <h3>Mavuno Learn</h3>
          <p>Explore bite-sized lessons on nursery preparation, safe pest checks and post-harvest handling.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="learn">Open mini lessons</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧑🏽‍🌾</span>
          <h3>Ask an agronomy question</h3>
          <p>Use the Smart Assist demo to organise a crop question before consulting a local extension officer.</p>
          <a class="outline-btn" href="smart-assist.html">Open Smart Assist</a>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧪</span>
          <h3>Soil-test match</h3>
          <p>Find the sample soil-testing service listing and ask the provider what its test covers.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="soil-test">Find soil testing</button>
        </article>
      </div>
    `;

    anchor.insertAdjacentElement("afterend", section);
  }

  function ensureMavunoFeatureModal() {
    if (mavunoFeatureModal) return mavunoFeatureModal;

    const modal = document.createElement("div");
    modal.id = "mavunoFeatureModal";
    modal.className = "mb-feature-modal";
    modal.hidden = true;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "mbFeatureTitle");

    modal.innerHTML = `
      <div class="mb-feature-dialog">
        <button type="button" class="mb-feature-close" aria-label="Close">×</button>
        <h2 id="mbFeatureTitle">MavunoBridge feature</h2>
        <p id="mbFeatureDescription"></p>
        <form class="mb-feature-form" id="mbFeatureForm"></form>
        <div class="mb-feature-modal-actions">
          <button type="button" class="outline-btn" id="mbFeatureCancel">Cancel</button>
          <button type="submit" form="mbFeatureForm" class="primary-btn" id="mbFeatureSubmit">Save demo entry</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".mb-feature-close").addEventListener(
      "click",
      closeMavunoFeatureModal
    );

    modal.querySelector("#mbFeatureCancel").addEventListener(
      "click",
      closeMavunoFeatureModal
    );

    modal.addEventListener("click", event => {
      if (event.target === modal) closeMavunoFeatureModal();
    });

    modal.querySelector("#mbFeatureForm").addEventListener(
      "submit",
      submitMavunoFeature
    );

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) {
        closeMavunoFeatureModal();
      }
    });

    mavunoFeatureModal = modal;
    return modal;
  }

  function addFeatureCountySelect(form, value = "") {
    const label = document.createElement("label");
    label.textContent = "County *";

    const select = document.createElement("select");
    select.name = "county";
    select.required = true;
    select.add(new Option("Choose a county", ""));

    COUNTIES.forEach(county => select.add(new Option(county, county)));

    if (COUNTIES.includes(value)) select.value = value;

    label.appendChild(select);
    form.appendChild(label);
  }

  function addFeatureField(
    form,
    labelText,
    name,
    placeholder,
    type = "text",
    required = true
  ) {
    const label = document.createElement("label");
    label.appendChild(
      document.createTextNode(labelText + (required ? " *" : ""))
    );

    let field;

    if (type === "textarea") {
      field = document.createElement("textarea");
      field.rows = 3;
    } else {
      field = document.createElement("input");
      field.type = type;
    }

    field.name = name;
    field.placeholder = placeholder || "";
    field.required = required;

    if (type === "number") field.min = "1";
    if (type === "date") field.min = new Date().toISOString().slice(0, 10);

    label.appendChild(field);
    form.appendChild(label);
  }

  function openMavunoFeature(type, item = null) {
    if (type === "bundle") {
      const search = $("#searchInput");
      if (search) search.value = "starter bundle";

      activeCategory = "Agricultural Inputs";
      visibleListingLimit = 12;

      const filter = $("#categoryFilter");
      if (filter) filter.value = "Agricultural Inputs";

      updateHint();
      renderCategories();
      renderListings();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      showToast(
        "Showing the sample input bundle. Confirm the actual contents with the supplier."
      );
      return;
    }

    if (type === "soil-test") {
      const search = $("#searchInput");
      if (search) search.value = "Farm Soil Testing Service";

      activeCategory = "Farmer Services";
      visibleListingLimit = 12;

      const filter = $("#categoryFilter");
      if (filter) filter.value = "Farmer Services";

      updateHint();
      renderCategories();
      renderListings();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    const modal = ensureMavunoFeatureModal();
    const title = modal.querySelector("#mbFeatureTitle");
    const description = modal.querySelector("#mbFeatureDescription");
    const form = modal.querySelector("#mbFeatureForm");
    const submit = modal.querySelector("#mbFeatureSubmit");

    submit.hidden = false;
    modal.querySelector("#mbFeatureCancel").textContent = "Cancel";
    form.innerHTML = "";

    mavunoFeatureContext = { type, item };

    const name = item ? item.name : "";
    const demoNote = document.createElement("p");
    demoNote.className = "mb-feature-note";

    if (type === "group-buy") {
      title.textContent = item
        ? `Mavuno Pool: ${name}`
        : "Mavuno Pool · Group buying";

      description.textContent =
        "Register local interest in pooling an order with other farmers or buyers. This demo does not place an order or guarantee a bulk discount.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Product or input needed",
          "productName",
          "e.g. certified maize seed"
        );
      }

      addFeatureField(
        form,
        "Approximate quantity needed",
        "quantity",
        "e.g. 5 bags or 200 kg"
      );

      addFeatureField(
        form,
        "Preferred county or delivery area",
        "area",
        item?.county || "e.g. Nakuru",
        "text",
        true
      );

      addFeatureField(form, "Target date (optional)", "targetDate", "", "date", false);

      demoNote.textContent =
        "Saved on this device only. No buyer group, price negotiation or payment is actually created.";

      form.appendChild(demoNote);
      submit.textContent = "Save group-buy interest";

    } else if (type === "preorder") {
      title.textContent = item
        ? `HarvestLink: ${name}`
        : "HarvestLink · Pre-order interest";

      description.textContent =
        "Record the quantity and expected date so the buyer and seller know what needs to be discussed.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Crop or product",
          "productName",
          "e.g. tomatoes, avocados"
        );
      }

      addFeatureField(form, "Quantity wanted", "quantity", "e.g. 30 crates");
      addFeatureField(
        form,
        "Expected harvest / delivery date",
        "targetDate",
        "",
        "date",
        false
      );
      addFeatureField(form, "County", "county", item?.county || "e.g. Meru");

      demoNote.textContent =
        "This is a local pre-order interest, not a contract, stock reservation or confirmed price.";

      form.appendChild(demoNote);
      submit.textContent = "Save pre-order interest";

    } else if (type === "delivery") {
      title.textContent = item
        ? `FreshRoute: ${name}`
        : "FreshRoute · Delivery quote";

      description.textContent =
        "Capture the delivery details needed for a quote. MavunoBridge will not invent a driver, fee or arrival time.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Items to transport",
          "productName",
          "e.g. 10 sacks of maize"
        );
      }

      addFeatureField(
        form,
        "Quantity / load size",
        "quantity",
        "e.g. 10 sacks or 100 kg"
      );

      addFeatureField(
        form,
        "Destination / town",
        "destination",
        "e.g. Nakuru Town"
      );

      addFeatureField(
        form,
        "Pickup county",
        "county",
        item?.county || "Choose a county"
      );

      demoNote.textContent =
        "Saved locally for demonstration only. No transport provider is contacted.";

      form.appendChild(demoNote);
      submit.textContent = "Save quote request";

    } else if (type === "review") {
      title.textContent = item
        ? `FarmProof review: ${name}`
        : "FarmProof · Delivery review";

      description.textContent =
        "Record a local demo delivery confirmation and review. This is not an independently verified transaction.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Product or service",
          "productName",
          "e.g. beans or ploughing"
        );
      }

      const proofLabel = document.createElement("label");
      const proof = document.createElement("input");
      proof.type = "checkbox";
      proof.name = "received";
      proof.required = true;

      proofLabel.append(
        proof,
        document.createTextNode(
          " I confirm this is a demo record of a delivery I received. *"
        )
      );

      form.appendChild(proofLabel);

      const ratingLabel = document.createElement("label");
      ratingLabel.appendChild(document.createTextNode("Rating *"));

      const rating = document.createElement("select");
      rating.name = "rating";
      rating.required = true;
      rating.add(new Option("Choose a rating", ""));

      [5, 4, 3, 2, 1].forEach(n =>
        rating.add(new Option(`${n} / 5 stars`, String(n)))
      );

      ratingLabel.appendChild(rating);
      form.appendChild(ratingLabel);

      addFeatureField(
        form,
        "Review note (optional)",
        "note",
        "What went well or needs improvement?",
        "textarea",
        false
      );

      demoNote.textContent =
        "Reviews remain in this browser and are labelled demo reviews; they do not establish real seller reputation.";

      form.appendChild(demoNote);
      submit.textContent = "Save demo review";
      
    } else if (type === "order") {
      title.textContent = `Request order: ${name}`;

      description.textContent =
        `${money(item.price)} per ${item.unit || "unit"}. The seller is notified and can accept or decline. No payment is taken here; agree payment and delivery with the seller in Messages.`;

      addFeatureField(form, "Quantity wanted", "quantity", "e.g. 20", "number", true);
      form.elements.quantity.step = "any";
      addFeatureField(
        form,
        "Note to the seller (optional)",
        "note",
        "e.g. delivery to Nakuru by Friday",
        "textarea",
        false
      );
      form.elements.note.maxLength = 500;

      demoNote.textContent =
        `Enter the quantity in the listing's price unit (${item.unit || "unit"}). The final price and delivery are agreed with the seller.`;

      form.appendChild(demoNote);
      submit.textContent = "Send order request";

    } else if (type === "circle") {
      title.textContent = "County Grower Circles";

      description.textContent =
        "Choose a county and crop interest to model a local farmer group.";

      addFeatureCountySelect(form);

      addFeatureField(
        form,
        "Crop or shared interest",
        "crop",
        "e.g. dairy, maize, tomatoes"
      );

      addFeatureField(
        form,
        "Group goal (optional)",
        "goal",
        "e.g. share transport or learn together",
        "text",
        false
      );

      demoNote.textContent =
        "This records your interest on this device only. It does not create a public group or expose your details to others.";

      form.appendChild(demoNote);
      submit.textContent = "Save circle preference";

    } else if (type === "alerts") {
      title.textContent = "Planting Watch";

      description.textContent =
        "Save the crop and county you would like alerts for. Actual weather and pest alerts are not connected in this demo.";

      addFeatureCountySelect(form);
      addFeatureField(form, "Crop of interest", "crop", "e.g. maize or beans");

      const channelLabel = document.createElement("label");
      channelLabel.textContent = "Preferred future alert channel";

      const channel = document.createElement("select");
      channel.name = "channel";

      [["in-app", "In-app"], ["sms", "SMS"], ["whatsapp", "WhatsApp"]]
        .forEach(([v, l]) => channel.add(new Option(l, v)));

      channelLabel.appendChild(channel);
      form.appendChild(channelLabel);

      demoNote.textContent =
        "Preference only. No SMS, WhatsApp, weather service or notification will be sent.";

      form.appendChild(demoNote);
      submit.textContent = "Save alert preference";

    } else if (type === "learn") {
      title.textContent = "Mavuno Learn · Mini lessons";

      description.textContent =
        "Choose a short practical lesson. These are starter notes, not a substitute for local professional advice.";

      const courseLabel = document.createElement("label");
      courseLabel.textContent = "Choose a mini lesson *";

      const course = document.createElement("select");
      course.name = "course";
      course.required = true;
      course.add(new Option("Choose a lesson", ""));

      [
        ["nursery", "Seedling nursery basics"],
        ["pest", "Observe pests before acting"],
        ["postharvest", "Post-harvest handling"],
        ["records", "Simple farm cost records"]
      ].forEach(([v, l]) => course.add(new Option(l, v)));

      courseLabel.appendChild(course);
      form.appendChild(courseLabel);

      demoNote.textContent =
        "Lessons are short text previews. No accredited certification is awarded.";

      form.appendChild(demoNote);
      submit.textContent = "Open lesson";
    }

    modal.hidden = false;
    modal.querySelector(".mb-feature-dialog").scrollTop = 0;
    modal.querySelector("input:not([type=hidden]), select, textarea, button")?.focus();
  }

  function closeMavunoFeatureModal() {
    if (mavunoFeatureModal) mavunoFeatureModal.hidden = true;
    mavunoFeatureContext = null;
  }

  function readFeatureForm() {
    const form = $("#mbFeatureForm");
    const data = {};

    if (!form) return data;

    new FormData(form).forEach((value, key) => {
      if (key !== "received") data[key] = String(value).trim();
    });

    data.received = Boolean(form.elements.received?.checked);
    return data;
  }

  function submitMavunoFeature(event) {
    event.preventDefault();
    if (!mavunoFeatureContext) return;

    const { type, item } = mavunoFeatureContext;
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = readFeatureForm();

    const listing = item
      ? {
          productId: item.id,
          productName: item.name,
          seller: item.seller || "",
          listingCounty: item.county || ""
        }
      : {};

    let key = "";
    let success = "Demo entry saved on this device.";

    if (type === "group-buy") {
      key = STORAGE.groupBuys;
      success =
        "Mavuno Pool interest saved locally. No group order or discount has been confirmed.";

    } else if (type === "preorder") {
      key = STORAGE.preOrders;
      success =
        "HarvestLink pre-order interest saved locally. Confirm availability and terms directly before making an agreement.";

    } else if (type === "delivery") {
      key = STORAGE.deliveryRequests;
      success =
        "FreshRoute quote request saved locally. No driver, fee or ETA has been booked.";

    } else if (type === "review") {
      if (!data.received) {
        showToast("Confirm the demo delivery checkbox before submitting a review.");
        return;
      }

      key = STORAGE.demoReviews;
      success = "Demo review saved locally. It is not a verified public rating.";

    } else if (type === "order") {
      submitOrder(item, data);
      return;

    } else if (type === "circle") {
      key = STORAGE.countyCircles;
      success =
        "County Grower Circle preference saved on this device; no public group was created.";

    } else if (type === "alerts") {
      key = STORAGE.plantingAlerts;
      success =
        "Planting Watch preference saved locally. No live alerts will be sent.";

    } else if (type === "learn") {
      key = STORAGE.learningProgress;

      const lessons = {
        nursery: {
          title: "Seedling nursery basics",
          text: "Use clean trays or a prepared, well-drained nursery bed. Label each variety, water gently, and check for damping-off or uneven growth daily. Transplant only when seedlings are suitable for the crop and local conditions. Ask a local extension officer about variety-specific timing."
        },
        pest: {
          title: "Observe pests before acting",
          text: "Inspect several plants and both leaf surfaces. Note the crop, location, affected plant parts and how quickly symptoms are spreading. Take a clear photo if safe. Do not mix pesticides; identify the problem and follow the product label and local extension advice before treatment."
        },
        postharvest: {
          title: "Post-harvest handling",
          text: "Harvest at the suitable stage, keep produce shaded, use clean containers, separate damaged items, and avoid crushing. Keep food products away from chemicals and fuel. Confirm buyer requirements for grade, packaging and delivery before harvest when possible."
        },
        records: {
          title: "Simple farm cost records",
          text: "Record date, input, quantity, cost, labour, harvest quantity, sold quantity and selling price. Keep receipts where available. Comparing total costs with sales over a full crop cycle helps you understand margin; one good sale alone does not show the whole profit picture."
        }
      };

      const lesson = lessons[data.course];

      if (!lesson) {
        showToast("Choose a lesson first.");
        return;
      }

      saveLocalRecord(key, {
        course: data.course,
        title: lesson.title
      });

      const title = $("#mbFeatureTitle");
      const description = $("#mbFeatureDescription");
      const formEl = $("#mbFeatureForm");

      title.textContent = lesson.title;
      description.textContent = lesson.text;
      formEl.innerHTML = "";

      const note = document.createElement("p");
      note.className = "mb-feature-note";
      note.textContent =
        "Lesson marked as opened in this browser. No certificate is issued.";

      formEl.appendChild(note);

      $("#mbFeatureSubmit").hidden = true;
      $("#mbFeatureCancel").textContent = "Close lesson";
      return;

    } else {
      return;
    }

    const saved = saveLocalRecord(key, { ...listing, ...data });

    closeMavunoFeatureModal();

    showToast(
      saved
        ? success
        : "Could not save this demo preference in local browser storage."
    );
  }

  async function submitOrder(item, data) {
    const submitButton = $("#mbFeatureSubmit");
    const quantity = Number(data.quantity);

    if (!item || !item.remote) { showToast("Orders work with real sellers' listings."); return; }
    if (!Number.isFinite(quantity) || quantity <= 0) { showToast("Enter a quantity greater than zero."); return; }

    const client = getDb();
    if (!client) { showToast("Could not reach the database. Please refresh and try again."); return; }

    if (submitButton) submitButton.disabled = true;
    try {
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData?.session) {
        showToast("Please sign in to request an order. Taking you to the sign-in page...");
        window.setTimeout(() => { window.location.href = "login.html"; }, 1500);
        return;
      }

      const { error } = await client.from("orders").insert({
        listing_id: item.id,
        quantity,
        note: data.note || null
      });
      if (error) throw error;

      closeMavunoFeatureModal();
      showToast("Order request sent. The seller has been notified. Track it on the Orders page.");
    } catch (error) {
      console.error("MavunoBridge order error:", error);
      showToast(error.message || "Could not send the order request.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  function bindMavunoHubEvents() {
    $("#mavunoInnovationHub")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mavuno-feature]");
      if (button) openMavunoFeature(button.dataset.mavunoFeature, null);
    });

    $("#listingGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mb-action]");
      if (!button) return;

      const item = listings.find(entry => entry.id === button.dataset.listingId);

      if (!item) {
        showToast("Listing not found. Refresh and try again.");
        return;
      }

      openMavunoFeature(button.dataset.mbAction, item);
    });
  }

  const TRANSLATIONS = [
    [".main-nav a[href=\"#marketplace\"]", "Marketplace", "Soko"],
    [".main-nav a[href=\"smart-assist.html\"]", "Smart Assist", "Msaidizi Mahiri"],
    [".main-nav a[href=\"sacco.html\"]", "SACCO Hub", "Kituo cha SACCO"],
    [".main-nav a[href=\"buyer-requests.html\"]", "Buyer Requests", "Maombi ya Wanunuzi"],
    [".main-nav a[href=\"messages.html\"]", "Messages", "Ujumbe"],
    ["#authLink", "Sign in", "Ingia"],
    ["#signOutButton", "Sign out", "Toka"],
    [".hero .eyebrow", "KENYA'S FARM-TO-MARKET DEMO", "ONYESHO LA KENYA LA SHAMBANI HADI SOKONI"],
    [".hero h1", "Good harvests deserve <span>better markets.</span>", "Mavuno mazuri yanastahili <span>masoko bora.</span>", "html"],
    [".hero-description", "Connect directly with farmers, compare produce, discover opportunities and grow your business. Everything in one place.", "Wasiliana moja kwa moja na wakulima, linganisha mazao, gundua fursa na ukuze biashara yako. Yote mahali pamoja."],
    ["#heroSellButton", "+ Sell your produce", "+ Uza mazao yako"],
    [".category-section h2", "Explore categories", "Tazama aina za bidhaa"],
    [".marketplace h2", "Marketplace", "Soko"],
    ["#sellButton", "+ Create listing", "+ Tengeneza tangazo"],
    ["#searchInput", "Search maize, beans, avocados...", "Tafuta mahindi, maharagwe, parachichi...", "placeholder"],
    ["#showAllButton", "View all products →", "Tazama bidhaa zote →"],
    ["#clearFiltersButton", "Clear filters", "Futa vichujio"],
    ["#emptyState h3", "No listings found", "Hakuna matangazo yaliyopatikana"],
    ["#emptyState p", "Try another search or filter, or create a new listing.", "Jaribu utafutaji au kichujio kingine, au tengeneza tangazo jipya."],
    ["#emptySellButton", "Create a listing", "Tengeneza tangazo"],
    ["#emptyRequestButton", "Post a buyer request", "Weka ombi la mnunuzi"],
    ["#listingModalTitle", "Create a listing", "Tengeneza tangazo"],
    ["#listingModal .modal-card > p", "Fill in your details. Fields marked * are required.", "Jaza maelezo yako. Sehemu zenye * ni lazima."],
    ["#cartTitle", "Shopping cart", "Kikapu cha ununuzi"],
    ["#clearCartButton", "Clear cart", "Futa kikapu"]
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

  function readText(element, mode) {
    if (mode === "placeholder") return element.placeholder;
    if (mode === "html") return element.innerHTML;
    if (element.children.length === 0) return element.textContent;
    const node = [...element.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
    return node ? node.nodeValue : "";
  }

  function writeText(element, mode, value) {
    if (mode === "placeholder") element.placeholder = value;
    else if (mode === "html") element.innerHTML = value;
    else if (element.children.length === 0) element.textContent = value;
    else {
      const node = [...element.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
      if (node) node.nodeValue = value;
    }
  }

  function captureOriginals() {
    if (originalsCaptured) return;
    originalsCaptured = true;
    TRANSLATIONS.forEach(([selector, , , mode]) => {
      const element = findTarget(selector);
      if (element && !originalTexts.has(element)) originalTexts.set(element, readText(element, mode));
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
      const value = currentLang === "mix" ? original : currentLang === "sw" ? swahili : english;
      if (value !== undefined && value !== null) writeText(element, mode, value);
    });

    updateHint();
    renderListings();
    renderUser();

    const cartModal = $("#cartModal");
    if (cartModal && !cartModal.classList.contains("hidden")) renderCart();

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function restoreLanguage() {
    const saved = loadStorage(STORAGE.language, "mix");
    const select = $("#languageSelect");

    if (select) {
      select.value = ["mix", "en", "sw"].includes(saved) ? saved : "mix";
      applyLanguage(select.value);
    } else {
      applyLanguage(saved);
    }
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

    $("#categoryFilter")?.addEventListener(
      "change",
      event => selectCategory(event.target.value || "All")
    );

    ["searchInput", "locationFilter", "saleFilter", "fairPriceFilter", "sortFilter"].forEach(id => {
      document.getElementById(id)?.addEventListener(
        id === "searchInput" ? "input" : "change",
        () => {
          visibleListingLimit = 12;
          renderListings();
        }
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

      if (chatButton) {
        openChat(chatButton.dataset.chat);
      }
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
      saveStorage(STORAGE.language, event.target.value);
      applyLanguage(event.target.value);
      showToast(t("langChanged"));
    });
  }

  function safely(label, step) {
    try {
      step();
    } catch (error) {
      console.error(`MavunoBridge: "${label}" failed`, error);
    }
  }

  function init() {
    if (!$("#listingGrid")) {
      console.info(
        "MavunoBridge: marketplace grid is not on this page; no marketplace startup needed."
      );
      return;
    }

    safely("load data", loadData);
    safely("fill dropdowns", populateSelects);
    safely("connect buttons", bindEvents);
    safely("draw categories", renderCategories);
    safely("draw listings", renderListings);
    safely("render MavunoBridge Plus features", renderMavunoInnovationHub);
    safely("bind MavunoBridge Plus features", bindMavunoHubEvents);
    safely("show signed-in user", renderUser);
    safely("cart count", updateCartCount);
    safely("restore language", restoreLanguage);
    refreshRemoteListings();

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    console.info(
      `MavunoBridge ready: ${listings.length} listings loaded (${DEMO_LISTINGS.length} built-in demo samples).`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
