"use strict";

/* ORDERS — buyers see the requests they sent, sellers see the requests they received.
   The database decides who may do what (RLS + triggers); this page is just the UI. */

(() => {
  const statusEl = document.querySelector("#odStatus");
  const receivedGroup = document.querySelector("#odReceivedGroup");
  const placedGroup = document.querySelector("#odPlacedGroup");
  const receivedEl = document.querySelector("#odReceived");
  const placedEl = document.querySelector("#odPlaced");
  const emptyEl = document.querySelector("#odEmpty");

  const STATUS_LABEL = {
    pending: "Waiting for seller",
    accepted: "Accepted",
    declined: "Declined",
    cancelled: "Cancelled",
    completed: "Completed"
  };

  let client = null;
  let userId = null;
  let rows = [];
  const names = {};

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

  function showEmpty(message, linkText, href) {
    receivedGroup.hidden = true;
    placedGroup.hidden = true;
    emptyEl.hidden = false;
    emptyEl.replaceChildren(el("p", "", message));
    if (linkText) {
      const a = el("a", "button primary", linkText);
      a.href = href;
      emptyEl.append(a);
    }
  }

  async function loadOrders() {
    const { data, error } = await client
      .from("orders")
      .select("id,listing_id,buyer_id,seller_id,product_name,unit_price,price_unit,quantity,note,seller_note,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    rows = data || [];

    const ids = [...new Set(rows.flatMap(r => [r.buyer_id, r.seller_id]))].filter(id => id !== userId && !names[id]);
    if (ids.length) {
      const res = await client.from("profiles").select("id,display_name").in("id", ids);
      (res.data || []).forEach(p => { names[p.id] = p.display_name || ""; });
    }
  }

  async function changeStatus(row, status, sellerNote) {
    setStatus("Saving...");
    const changes = { status };
    if (sellerNote) changes.seller_note = sellerNote;
    const { error } = await client.from("orders").update(changes).eq("id", row.id);
    if (error) {
      console.error(error);
      setStatus("Could not update the order: " + error.message, true);
      return;
    }
    Object.assign(row, changes);
    setStatus("Order updated. The other person has been notified.");
    render();
  }

  function chatHref(row, otherId) {
    let href = "messages.html?with=" + encodeURIComponent(otherId);
    if (row.listing_id) href += "&listing=" + encodeURIComponent(row.listing_id);
    return href;
  }

  function buildCard(row, asSeller) {
    const card = el("article", "od-card");
    const otherId = asSeller ? row.buyer_id : row.seller_id;
    const otherName = names[otherId] || (asSeller ? "A buyer" : "The seller");

    card.append(
      el("span", "od-badge " + row.status, STATUS_LABEL[row.status] || row.status),
      el("h3", "", row.product_name),
      el("p", "od-meta", `${asSeller ? "From" : "To"} ${otherName} · ${new Date(row.created_at).toLocaleDateString("en-KE")}`),
      el("p", "od-meta", `${Number(row.quantity)} × ${money(row.unit_price)} / ${row.price_unit || "unit"}`),
      el("p", "od-total", "Estimated total: " + money(Number(row.quantity) * Number(row.unit_price)))
    );
    if (row.note) card.append(el("p", "od-note", "Buyer note: " + row.note));
    if (row.seller_note) card.append(el("p", "od-note", "Seller reply: " + row.seller_note));

    const actions = el("div", "od-actions");

    if (asSeller && row.status === "pending") {
      const reply = el("input", "od-reply");
      reply.placeholder = "Optional reply to the buyer";
      reply.maxLength = 500;
      card.append(reply);
      actions.append(
        button("Accept", "small primary", () => changeStatus(row, "accepted", reply.value.trim())),
        button("Decline", "small", () => changeStatus(row, "declined", reply.value.trim()))
      );
    }
    if (asSeller && row.status === "accepted") {
      actions.append(button("Mark completed", "small primary", () => {
        if (window.confirm("Mark this order as completed?")) changeStatus(row, "completed");
      }));
    }
    if (!asSeller && (row.status === "pending" || row.status === "accepted")) {
      actions.append(button("Cancel order", "small", () => {
        if (window.confirm("Cancel this order request?")) changeStatus(row, "cancelled");
      }));
    }

    const chat = el("a", "small", asSeller ? "Message buyer" : "Message seller");
    chat.href = chatHref(row, otherId);
    actions.append(chat);

    card.append(actions);
    return card;
  }

  function render() {
    const received = rows.filter(r => r.seller_id === userId);
    const placed = rows.filter(r => r.buyer_id === userId);

    if (!received.length && !placed.length) {
      showEmpty("No orders yet. Find something you need in the marketplace and press Request order.", "Browse the marketplace", "index.html#marketplace");
      return;
    }

    emptyEl.hidden = true;
    receivedGroup.hidden = received.length === 0;
    placedGroup.hidden = placed.length === 0;
    receivedEl.replaceChildren(...received.map(r => buildCard(r, true)));
    placedEl.replaceChildren(...placed.map(r => buildCard(r, false)));
  }

  function subscribe() {
    const reload = () => loadOrders().then(render).catch(error => console.warn("Orders refresh failed", error));
    try {
      client.channel("orders-" + userId)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: "seller_id=eq." + userId }, reload)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: "buyer_id=eq." + userId }, reload)
        .subscribe();
    } catch (error) {
      console.warn("Live order updates unavailable", error);
    }
  }

  async function start() {
    if (!window.supabase || !window.MAVUNO_SUPABASE_URL || !window.MAVUNO_SUPABASE_ANON_KEY) {
      setStatus("Could not connect to the database. Please refresh the page.", true);
      return;
    }
    client = window.mavunoDb || window.supabase.createClient(window.MAVUNO_SUPABASE_URL, window.MAVUNO_SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });

    try {
      const { data } = await client.auth.getSession();
      const session = data?.session;
      if (!session) {
        showEmpty("Please sign in to see your orders.", "Sign in", "login.html");
        return;
      }
      userId = session.user.id;
      setStatus("Loading your orders...");
      await loadOrders();
      setStatus("");
      render();
      subscribe();
    } catch (error) {
      console.error("MavunoBridge: could not load orders", error);
      setStatus("Could not load your orders: " + (error.message || "unknown error"), true);
    }
  }

  start();
})();
