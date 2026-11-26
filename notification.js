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
      if (event.key ===
