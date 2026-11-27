"use strict";

/* One shared Supabase connection for every MavunoBridge page.
   Load this after supabase-js and supabase-config.js.

   It also decides who sees the "My Listings" link: only signed-in
   farmers, sellers and "both" accounts. Buyer-only accounts never see it. */
(() => {
  const SELLER_ROLES = ["farmer", "both", "service_provider"];
  const ROLE_CACHE_KEY = "mavunobridge_is_seller_v1";

  // Hide the link by default; it appears only when <html> has the mb-seller class.
  const style = document.createElement("style");
  style.textContent = 'html:not(.mb-seller) a[href="my-listings.html"] { display: none !important; }';
  document.head.append(style);

  // Use the last known answer straight away so the link doesn't flicker.
  try {
    if (localStorage.getItem(ROLE_CACHE_KEY) === "1") document.documentElement.classList.add("mb-seller");
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
    let isSeller = false;
    if (session) {
      const { data, error } = await db.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      if (error) { console.warn("Could not read your account type", error); return; }
      isSeller = Boolean(data && SELLER_ROLES.includes(data.role));
    }
    document.documentElement.classList.toggle("mb-seller", isSeller);
    try { localStorage.setItem(ROLE_CACHE_KEY, isSeller ? "1" : "0"); } catch (_) { /* ignore */ }
  }

  db.auth.getSession().then(({ data }) => applyRole(data.session));
  db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
      window.setTimeout(() => applyRole(session), 0);   // never call Supabase directly inside this callback
    }
  });
})();
