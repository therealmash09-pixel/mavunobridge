"use strict";

/* One shared Supabase connection for every MavunoBridge page.
   Load this after supabase-js and supabase-config.js.

   It also decides who sees the "My Listings" link: only farmers, "both"
   accounts and service providers. Buyer-only and signed-out visitors don't. */
(() => {
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

  const SELLER_ROLES = ["farmer", "both", "service_provider"];

  // Hide the link straight away so buyers never see it flash.
  function setLinkHidden(hidden) {
    const existing = document.getElementById("mbSellerOnlyStyle");
    if (hidden && !existing) {
      const style = document.createElement("style");
      style.id = "mbSellerOnlyStyle";
      style.textContent = 'a[href="my-listings.html"] { display: none !important; }';
      document.head.append(style);
    } else if (!hidden && existing) {
      existing.remove();
    }
  }
  setLinkHidden(true);

  async function applyRole(session) {
    window.mavunoRole = null;
    if (session) {
      const { data } = await db.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      window.mavunoRole = data?.role || session.user.user_metadata?.role || "buyer";
    }
    const isSeller = SELLER_ROLES.includes(window.mavunoRole);
    setLinkHidden(!isSeller);
    window.dispatchEvent(new CustomEvent("mb:role", { detail: window.mavunoRole }));
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await db.auth.getSession();
    applyRole(data?.session || null);
    db.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      applyRole(session);
    });
  });
})();
