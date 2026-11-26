"use strict";

/* One shared Supabase connection for every MavunoBridge page.
   Load this after supabase-js and supabase-config.js. */
(() => {
  if (window.mavunoDb) return;
  if (!window.supabase || !window.MAVUNO_SUPABASE_URL || !window.MAVUNO_SUPABASE_ANON_KEY) {
    console.warn("MavunoBridge: Supabase did not load, live features are unavailable.");
    return;
  }
  window.mavunoDb = window.supabase.createClient(
    window.MAVUNO_SUPABASE_URL,
    window.MAVUNO_SUPABASE_ANON_KEY,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
})();
