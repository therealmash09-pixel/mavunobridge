"use strict";

/* One shared Supabase connection for every MavunoBridge page.
   Load this after supabase-js and supabase-config.js.

   It also decides what each kind of account sees:
   - "My Listings" link: only signed-in farmers, sellers and "both" accounts.
   - "Create listing" buttons: hidden for signed-in buyer-only accounts.
   Visitors who are signed out still see the sell buttons (they are sent to sign in). */
(() => {
  const SELLER_ROLES = ["farmer", "both", "service_provider"];
  const ROLE_CACHE_KEY = "mavunobridge_account_kind_v2";   // "seller" | "buyer" | "anon"

  const style = document.createElement("style");
  style.textContent =
    'html:not(.mb-seller) a[href="my-listings.html"] { display: none !important; }' +
    'html.mb-buyer #sellButton, html.mb-buyer #heroSellButton, html.mb-buyer #emptySellButton { display: none !important; }';
  document.head.append(style);

  function setKind(kind) {
    const root = document.documentElement;
    root.classList.toggle("mb-seller", kind === "seller");
    root.classList.toggle("mb-buyer", kind === "buyer");
  }

  // Use the last known answer straight away so nothing flickers.
  try {
    const cached = localStorage.getItem(ROLE_CACHE_KEY);
    if (cached) setKind(cached);
  } catch (_) { /* storage blocked: fine */ }

  if (window.mavunoDb) return;
  if (!window.supabase || !window.MAVUNO_SUPABASE_URL || !window.MAVUNO_SUPABASE_ANON_KEY) {
    console.warn("MavunoBridge: Supabase did not load, live features are unavailable.");
    return;
  }
  const db = window.supabase.createClient(
    window.MAVUNO_SUPABASE_URL,
    window.MAVUNO_SUPABASE_ANON_KEY,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
  window.mavunoDb = db;

  async function applyRole(session) {
    let kind = "anon";
    if (session) {
      const { data, error } = await db.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      if (error) { console.warn("Could not read your account type", error); return; }
      kind = data && SELLER_ROLES.includes(data.role) ? "seller" : "buyer";
    }
    setKind(kind);
    try { localStorage.setItem(ROLE_CACHE_KEY, kind); } catch (_) { /* ignore */ }
  }

  db.auth.getSession().then(({ data }) => applyRole(data.session));
  db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
      window.setTimeout(() => applyRole(session), 0);   // never call Supabase directly inside this callback
    }
  });
})();
