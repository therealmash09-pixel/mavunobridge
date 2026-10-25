"use strict";

/* =========================================================
   MAVUNOMART CHAT STORE
   Demo version: data lives in localStorage (same browser).
   For real buyer<->seller messaging across devices, swap the
   read/write functions for Firebase / Supabase calls.
========================================================= */

const ChatStore = (() => {

  const KEY = "shambamarket_inquiries_v1";
  const ID_KEY = "shambamarket_identity_v1";

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

  const all = () => read(KEY, []);
  const save = list => write(KEY, list);
  const identity = () => read(ID_KEY, null);
  const setIdentity = value => write(ID_KEY, value);

  const money = n => Number(n || 0).toLocaleString("en-KE");

  /* One conversation per seller, built from the cart */
  function createFromCart(cart, listings, buyerName) {

    const groups = {};

    cart.forEach(ci => {
      const p = listings.find(l => l.id === ci.productId);
      if (!p) return;
      const bulk = ci.priceType === "bulk";
      (groups[p.seller] ||= { phone: p.phone, items: [] }).items.push({
        productId: p.id,
        name: p.name,
        qty: ci.quantity,
        priceType: ci.priceType,
        unit: bulk ? p.bulkUnit : p.retailUnit,
        price: Number(bulk ? p.bulkPrice : p.retailPrice)
      });
    });

    const list = all();
    const ids = [];

    Object.entries(groups).forEach(([seller, g]) => {
      const now = Date.now();
      const total = g.items.reduce((s, i) => s + i.qty * i.price, 0);
      const summary = g.items
        .map(i => `${i.qty} ${i.unit} ${i.name}`).join(", ");
      const id = `chat-${now}-${Math.random().toString(36).slice(2, 6)}`;

      list.unshift({
        id, seller, sellerPhone: g.phone, buyer: buyerName,
        items: g.items, total, status: "new", createdAt: now,
        unread: { buyer: 0, seller: 1 },
        messages: [{
          from: "system", at: now,
          text: `${buyerName} is interested in: ${summary}. Estimated total KSh ${money(total)}.`
        }]
      });
      ids.push(id);
    });

    save(list);
    return ids;
  }

  function update(id, fn) {
    const list = all();
    const convo = list.find(c => c.id === id);
    if (!convo) return null;
    fn(convo);
    save(list);
    return convo;
  }

  function send(id, role, text, extra = {}) {
    return update(id, c => {
      c.messages.push({ from: role, text, at: Date.now(), ...extra });
      const other = role === "buyer" ? "seller" : "buyer";
      c.unread[other] = (c.unread[other] || 0) + 1;
      if (role === "seller" && c.status === "new") c.status = "open";
    });
  }

  function setStatus(id, status, note) {
    return update(id, c => {
      c.status = status;
      c.messages.push({ from: "system", text: note, at: Date.now() });
      c.unread.buyer++; c.unread.seller++;
    });
  }

  function markRead(id, role) {
    update(id, c => { c.unread[role] = 0; });
  }

  function unreadCount(who) {
    if (!who) return 0;
    return all()
      .filter(c => who.role === "buyer"
        ? c.buyer === who.name
        : c.seller === who.name)
      .reduce((s, c) => s + (c.unread?.[who.role] || 0), 0);
  }

  return {
    all, update, identity, setIdentity, createFromCart,
    send, setStatus, markRead, unreadCount, money
  };

})();
