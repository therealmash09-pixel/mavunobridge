"use strict";

/* MAVUNOBRIDGE NOTIFICATION BELL */

(() => {
  const db = window.mavunoDb;
  if (!db) return;

  let userId = null;
  let items = [];
  let unread = 0;
  let channel = null;
  let pollTimer = null;
  let bell = null;
  let badge = null;
  let panel = null;
  let listEl = null;
  const baseTitle = document.title;

  function injectStyles() {
    if (document.getElementById("mbBellStyles")) return;
    const style = document.createElement("style");
    style.id = "mbBellStyles";
    style.textContent = `
      .mb-bell-wrap { position: relative; display: inline-flex; }
      .mb-bell { position: relative; background: #fff; border: 1px solid #c9d8c0; border-radius: 999px; width: 40px; height: 40px; cursor: pointer; font-size: 1.1rem; line-height: 1; }
      .mb-bell:hover { background: #f1f7ec; }
      .mb-badge { position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #c0392b; color: #fff; font-size: .7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
      .mb-badge[hidden] { display: none; }
      .mb-panel { position: absolute; right: 0; top: 48px; width: min(360px, 92vw); max-height: 70vh; overflow: auto; background: #fff; border: 1px solid #dce8d3; border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,.18); z-index: 2000; }
      .mb-panel[hidden] { display: none; }
      .mb-panel-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid #edf4e7; font-weight: 800; }
      .mb-panel-head button { background: none; border: 0; color: #2f5d34; font-weight: 700; cursor: pointer; }
      .mb-item { display: block; width: 100%; text-align: left; background: #fff; border: 0; border-bottom: 1px solid #f1f5ee; padding: 11px 14px; cursor: pointer; font: inherit; }
      .mb-item:hover { background: #f6faf2; }
      .mb-item.unread { background: #eef7e8; }
      .mb-item strong { display: block; font-size: .92rem; }
      .mb-item span { display: block; color: #5b6b5c; font-size: .84rem; margin-top: 2px; }
      .mb-item small { color: #8a978b; font-size: .75rem; }
      .mb-empty { padding: 22px 14px; text-align: center; color: #5b6b5c; }
      .mb-toast { position: fixed; right: 16px; bottom: 16px; max-width: min(340px, 92vw); background: #183522; color: #fff; padding: 12px 14px; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,.3); z-index: 3000; cursor: pointer; font-size: .9rem; }
      .mb-toast strong { display: block; margin-bottom: 2px; }
    `;
    document.head.append(style);
  }

  function ago(iso) {
    const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " h ago";
    return new Date(iso).toLocaleDateString("en-KE");
  }

  function buildBell() {
    if (bell) return;
    injectStyles();
    const wrap = document.createElement("div");
    wrap.className = "mb-bell-wrap";

    bell = document.createElement("button");
    bell.type = "button";
    bell.className = "mb-bell";
    bell.setAttribute("aria-label", "Notifications");
    bell.setAttribute("aria-haspopup", "true");
    bell.textContent = "🔔";

    badge = document.createElement("span");
    badge.className = "mb-badge";
    badge.hidden = true;
    bell.append(badge);

    panel = document.createElement("div");
    panel.className = "mb-panel";
    panel.hidden = true;

    const head = document.createElement("div");
    head.className = "mb-panel-head";
    const title = document.createElement("span");
    title.textContent = "Notifications";
    const markAll = document.createElement("button");
    markAll.type = "button";
    markAll.textContent = "Mark all read";
    markAll.addEventListener("click", markAllRead);
    head.append(title, markAll);

    listEl = document.createElement("div");
    panel.append(head, listEl);
    wrap.append(bell, panel);

    const host = document.querySelector(".top-actions, .header-actions") || document.querySelector("header");
    if (!host) return;
    host.prepend(wrap);

    bell.addEventListener("click", event => {
      event.stopPropagation();
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        placePanel();
        refresh();
      }
    });
    window.addEventListener("resize", () => { if (panel && !panel.hidden) placePanel(); });
    document.addEventListener("click", event => {
      if (!wrap.contains(event.target)) panel.hidden = true;
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") panel.hidden = true;
    });
  }

  // Keep the dropdown fully on screen wherever the bell sits in the header.
  function placePanel() {
    const rect = bell.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 16);
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
    panel.style.position = "fixed";
    panel.style.width = width + "px";
    panel.style.left = left + "px";
    panel.style.right = "auto";
    panel.style.top = Math.round(rect.bottom + 8) + "px";
  }

  function removeBell() {
    document.querySelector(".mb-bell-wrap")?.remove();
    bell = badge = panel = listEl = null;
    document.title = baseTitle;
  }

  function renderBadge() {
    if (!badge) return;
    badge.hidden = unread <= 0;
    badge.textContent = unread > 99 ? "99+" : String(unread);
    document.title = unread > 0 ? `(${unread}) ${baseTitle}` : baseTitle;
  }

  function renderList() {
    if (!listEl) return;
    listEl.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "mb-empty";
      empty.textContent = "No notifications yet.";
      listEl.append(empty);
      return;
    }
    items.forEach(item => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "mb-item" + (item.read_at ? "" : " unread");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const body = document.createElement("span");
      body.textContent = item.body || "";
      const time = document.createElement("small");
      time.textContent = ago(item.created_at);
      row.append(title, body, time);
      row.addEventListener("click", () => openItem(item));
      listEl.append(row);
    });
  }

  async function refresh() {
    if (!userId) return;
    const [list, count] = await Promise.all([
      db.from("notifications").select("id,type,title,body,link,read_at,created_at")
        .order("created_at", { ascending: false }).limit(20),
      db.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null)
    ]);
    if (!list.error) items = list.data || [];
    if (!count.error) unread = count.count || 0;
    renderBadge();
    renderList();
  }

  async function markRead(ids) {
    if (!ids.length) return;
    const now = new Date().toISOString();
    await db.from("notifications").update({ read_at: now }).in("id", ids);
    items.forEach(item => { if (ids.includes(item.id)) item.read_at = now; });
    unread = Math.max(0, items.filter(item => !item.read_at).length);
    refresh();
  }

  async function markAllRead() {
    await markRead(items.filter(item => !item.read_at).map(item => item.id));
  }

  async function openItem(item) {
    if (!item.read_at) await markRead([item.id]);
    if (item.link) window.location.href = item.link;
  }

  function showToast(item) {
    const toast = document.createElement("div");
    toast.className = "mb-toast";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const body = document.createElement("span");
    body.textContent = item.body || "";
    toast.append(title, body);
    toast.addEventListener("click", () => openItem(item));
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 6000);
  }

  function subscribe() {
    if (channel) db.removeChannel(channel);
    channel = db.channel("mb-notifications-" + userId)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        payload => {
          items = [payload.new, ...items].slice(0, 20);
          unread += 1;
          renderBadge();
          renderList();
          showToast(payload.new);
        })
      .subscribe();
  }

  async function start(session) {
    window.clearInterval(pollTimer);
    if (channel) { db.removeChannel(channel); channel = null; }
    if (!session) { userId = null; items = []; unread = 0; removeBell(); return; }
    userId = session.user.id;
    buildBell();
    await refresh();
    subscribe();
    pollTimer = window.setInterval(refresh, 60000);
  }

  window.addEventListener("mb:refresh-notifications", refresh);

  document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await db.auth.getSession();
    start(data?.session || null);
    db.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.id === userId) return;
      if (event === "TOKEN_REFRESHED") return;
      start(session);
    });
  });
})();
