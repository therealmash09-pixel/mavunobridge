"use strict";

/* MY LISTINGS — a seller's dashboard.
   Reads every listing owned by the signed-in user (RLS lets owners see
   their own sold/hidden listings too) and lets them edit, mark sold,
   relist or delete. The database enforces ownership; this page is just UI. */

(() => {
  const listEl = document.querySelector("#mlList");
  const statusEl = document.querySelector("#mlStatus");

  const UNITS = ["kg", "piece", "bag", "bunch", "tray", "litre", "animal", "service", "unit"];
  const SALE_TYPES = [["Retail", "Retail"], ["Bulk", "Bulk"], ["Both", "Retail + bulk"]];

  let client = null;
  let userId = null;
  let rows = [];
  const categoryNames = {};
  const countyNames = {};

  function setStatus(message, isError = false) {
    statusEl.textContent = message || "";
    statusEl.classList.toggle("error", Boolean(isError));
  }

  function money(value) {
    return "KSh " + Number(value || 0).toLocaleString("en-KE", { maximumFractionDigits: 2 });
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, className, onClick) {
    const b = el("button", className || "small", label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  async function loadLookups() {
    const [cats, counties] = await Promise.all([
      client.from("categories").select("id,name"),
      client.from("counties").select("*")
    ]);
    (cats.data || []).forEach(row => { categoryNames[row.id] = row.name; });
    (counties.data || []).forEach(row => {
      countyNames[row.id] = row.name || row.county_name || row.title || "";
    });
  }

  async function loadMine() {
    const { data, error } = await client
      .from("listings")
      .select("id,category_id,county_id,product_name,town,price,price_unit,quantity_available,sale_type,description,image_url,status,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    rows = data || [];
  }

  function emptyState(message, linkText, href) {
    listEl.replaceChildren();
    const box = el("div", "panel ml-empty");
    box.append(el("p", "", message));
    if (linkText) {
      const a = el("a", "button primary", linkText);
      a.href = href;
      box.append(a);
    }
    listEl.append(box);
  }

  async function updateListing(row, changes, successMessage) {
    setStatus("Saving...");
    const { error } = await client.from("listings").update(changes).eq("id", row.id).eq("user_id", userId);
    if (error) {
      console.error(error);
      setStatus(
        error.code === "23514"
          ? "The database didn't accept that value (" + error.message + ")."
          : "Could not save: " + error.message,
        true
      );
      return false;
    }
    Object.assign(row, changes);
    setStatus(successMessage);
    render();
    return true;
  }

  async function deleteListing(row) {
    if (!window.confirm(`Delete "${row.product_name}"? This cannot be undone.`)) return;
    setStatus("Deleting...");
    const { error } = await client.from("listings").delete().eq("id", row.id).eq("user_id", userId);
    if (error) {
      console.error(error);
      setStatus("Could not delete: " + error.message, true);
      return;
    }
    rows = rows.filter(r => r.id !== row.id);
    setStatus("Listing deleted.");
    render();
  }

  function buildEditor(row, card) {
    const form = el("form", "ml-edit");

    const nameLabel = el("label", "", "Product name");
    const nameInput = el("input");
    nameInput.value = row.product_name || "";
    nameInput.maxLength = 120;
    nameInput.required = true;
    nameLabel.append(nameInput);

    const priceLabel = el("label", "", "Price (KSh)");
    const priceInput = el("input");
    priceInput.type = "number";
    priceInput.min = "1";
    priceInput.step = "any";
    priceInput.value = row.price;
    priceInput.required = true;
    priceLabel.append(priceInput);

    const unitLabel = el("label", "", "Price unit");
    const unitSelect = el("select");
    const units = UNITS.includes(row.price_unit) ? UNITS : [...UNITS, row.price_unit].filter(Boolean);
    units.forEach(u => unitSelect.add(new Option("Per " + u, u)));
    unitSelect.value = row.price_unit || "kg";
    unitLabel.append(unitSelect);

    const qtyLabel = el("label", "", "Quantity available");
    const qtyInput = el("input");
    qtyInput.value = row.quantity_available || "";
    qtyInput.maxLength = 60;
    qtyLabel.append(qtyInput);

    const saleLabel = el("label", "", "Sale type");
    const saleSelect = el("select");
    SALE_TYPES.forEach(([value, label]) => saleSelect.add(new Option(label, value)));
    saleSelect.value = row.sale_type || "Both";
    saleLabel.append(saleSelect);

    const descLabel = el("label", "", "Description");
    const descInput = el("textarea");
    descInput.rows = 3;
    descInput.maxLength = 600;
    descInput.value = row.description || "";
    descLabel.append(descInput);

    const actions = el("div", "ml-actions");
    actions.style.padding = "0";
    const save = el("button", "small primary", "Save changes");
    save.type = "submit";
    actions.append(save, button("Cancel", "small", () => render()));

    form.append(nameLabel, priceLabel, unitLabel, qtyLabel, saleLabel, descLabel, actions);

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const price = Number(priceInput.value);
      if (!nameInput.value.trim()) { setStatus("Please enter a product name.", true); return; }
      if (!Number.isFinite(price) || price <= 0) { setStatus("Please enter a valid price.", true); return; }
      await updateListing(row, {
        product_name: nameInput.value.trim(),
        price,
        price_unit: unitSelect.value,
        quantity_available: qtyInput.value.trim() || null,
        sale_type: saleSelect.value,
        description: descInput.value.trim() || null
      }, "Listing updated.");
    });

    card.append(form);
  }

  function buildCard(row) {
    const card = el("article", "ml-card");

    if (row.image_url) {
      const img = el("img");
      img.src = row.image_url;
      img.alt = `${row.product_name} photo`;
      img.loading = "lazy";
      img.addEventListener("error", () => img.replaceWith(el("div", "ml-noimg", "Photo not available")), { once: true });
      card.append(img);
    } else {
      card.append(el("div", "ml-noimg", "No photo"));
    }

    const body = el("div", "ml-body");
    const status = row.status || "active";
    const badge = el("span", "ml-badge" + (status === "sold" ? " sold" : status === "active" ? "" : " hidden-status"),
      status === "active" ? "Live" : status === "sold" ? "Sold" : status);

    body.append(
      badge,
      el("h3", "", row.product_name),
      el("p", "ml-price", `${money(row.price)} / ${row.price_unit || "unit"}`),
      el("p", "ml-meta", [categoryNames[row.category_id], [row.town, countyNames[row.county_id]].filter(Boolean).join(", ")].filter(Boolean).join(" · ")),
      el("p", "ml-meta", `${row.quantity_available || "Quantity not set"} · posted ${new Date(row.created_at).toLocaleDateString("en-KE")}`)
    );
    card.append(body);

    const actions = el("div", "ml-actions");
    actions.append(button("Edit", "small", () => {
      card.querySelector(".ml-actions")?.remove();
      buildEditor(row, card);
    }));
    if (status === "active") {
      actions.append(button("Mark as sold", "small", () => updateListing(row, { status: "sold" }, "Marked as sold.")));
    } else {
      actions.append(button("Relist", "small primary", () => updateListing(row, { status: "active" }, "Listing is live again.")));
    }
    actions.append(button("Delete", "small", () => deleteListing(row)));
    card.append(actions);

    return card;
  }

  function render() {
    if (!rows.length) {
      emptyState("You haven't posted any listings yet.", "+ Post your first listing", "index.html#marketplace");
      return;
    }
    listEl.replaceChildren(...rows.map(buildCard));
  }

  async function start() {
    if (!window.supabase || !window.MAVUNO_SUPABASE_URL || !window.MAVUNO_SUPABASE_ANON_KEY) {
      setStatus("Could not connect to the database. Please refresh the page.", true);
      return;
    }
    client = window.supabase.createClient(window.MAVUNO_SUPABASE_URL, window.MAVUNO_SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });

    try {
      const { data } = await client.auth.getSession();
      const session = data?.session;
      if (!session) {
        emptyState("Please sign in to see your listings.", "Sign in", "login.html");
        return;
      }
      userId = session.user.id;

      setStatus("Loading your listings...");
      await loadLookups();
      await loadMine();
      setStatus("");
      render();
    } catch (error) {
      console.error("MavunoBridge: could not load my listings", error);
      setStatus("Could not load your listings: " + (error.message || "unknown error"), true);
    }
  }

  start();
})();
