/* MAVUNOBRIDGE — BUYER REQUEST BOARD
   Requests are stored in Supabase and shared by everyone.
   Support notes stay in this browser only. */

(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const SUPPORT_KEY = "mavunobridge_support_notes_v1";
  const db = window.mavunoDb;

  const COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
    "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
    "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
    "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
    "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya",
    "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana",
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ];

  let me = null;
  let requests = [];
  const countyIdByKey = {};
  const countyNameById = {};
  const names = {};
  let notes = readNotes();

  function countyKey(name) {
    let key = String(name || "").toLowerCase().replace(/\s*county$/, "").replace(/[^a-z]/g, "");
    if (key === "nairobicity") key = "nairobi";
    return key;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function readNotes() {
    try {
      const value = JSON.parse(localStorage.getItem(SUPPORT_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }

  function saveNotes() {
    try { localStorage.setItem(SUPPORT_KEY, JSON.stringify(notes)); return true; }
    catch { alert("Browser storage is full. Try removing old notes."); return false; }
  }

  function setFormMessage(text, isError) {
    let box = $("#requestMessage");
    if (!box) {
      box = el("p", "muted");
      box.id = "requestMessage";
      box.setAttribute("role", "status");
      $("#demandForm").append(box);
    }
    box.textContent = text || "";
    box.style.color = isError ? "#a12a1a" : "";
    box.style.fontWeight = "700";
  }

  $("#dCounty").replaceChildren(new Option("Choose county", ""), ...COUNTIES.map(name => new Option(name, name)));
  $("#menuToggle")?.addEventListener("click", () => $("#mainNav").classList.toggle("open"));

  /* ---------- data ---------- */

  async function loadCounties() {
    const { data, error } = await db.from("counties").select("*");
    if (error) throw error;
    (data || []).forEach(row => {
      const name = row.name || row.county_name || row.title || "";
      countyIdByKey[countyKey(name)] = row.id;
      countyNameById[row.id] = COUNTIES.find(county => countyKey(county) === countyKey(name)) || name;
    });
  }

  async function loadRequests() {
    const { data, error } = await db.from("buyer_requests")
      .select("id,user_id,product,county_id,sale_type,quantity,needed_by,contact,details,status,created_at")
      .order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    requests = data || [];

    const ids = [...new Set(requests.map(request => request.user_id))];
    if (ids.length) {
      const { data: profiles } = await db.from("profiles").select("id,display_name").in("id", ids);
      (profiles || []).forEach(profile => { names[profile.id] = profile.display_name || ""; });
    }
  }

  /* ---------- rendering ---------- */

  function renderRequests() {
    const list = $("#demandList");
    list.replaceChildren();
    const visible = requests.filter(request => request.status === "open" || request.user_id === me);
    if (!visible.length) {
      list.append(el("p", "empty-note", "No buyer requests yet. Post the first one."));
      return;
    }

    visible.forEach(request => {
      const article = el("article", "message-item");
      const mine = request.user_id === me;

      const title = el("b", "", request.product);
      const meta = el("small", "", ` · ${countyNameById[request.county_id] || "Kenya"} County · ${request.sale_type === "Both" ? "Retail or bulk" : request.sale_type}`);
      const quantity = el("p", "",
        `${request.quantity ? request.quantity + " needed" : "Quantity flexible"}` +
        `${request.needed_by ? " · Needed by " + request.needed_by : ""}`);
      const details = el("p", "", request.details || "No extra details provided.");
      const posted = el("small", "", `Posted by ${mine ? "you" : (names[request.user_id] || "a buyer")} · ${new Date(request.created_at).toLocaleDateString("en-KE")}` +
        (request.status === "closed" ? " · CLOSED" : ""));
      article.append(title, meta, quantity, details, posted);

      if (request.contact) article.append(el("p", "", `Buyer contact: ${request.contact}`));

      const actions = el("div");
      actions.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin-top:8px";

      if (mine) {
        const toggle = el("button", "button small", request.status === "open" ? "Mark as fulfilled" : "Reopen");
        toggle.type = "button";
        toggle.addEventListener("click", () => setStatus(request, request.status === "open" ? "closed" : "open"));
        const remove = el("button", "button small", "Delete");
        remove.type = "button";
        remove.addEventListener("click", () => removeRequest(request));
        actions.append(toggle, remove);
      } else {
        const reply = el("a", "button small button-green", "Message buyer");
        reply.href = `messages.html?with=${encodeURIComponent(request.user_id)}&request=${encodeURIComponent(request.id)}`;
        actions.append(reply);
      }
      article.append(actions);
      list.append(article);
    });
  }

  function renderNotes() {
    const list = $("#supportList");
    list.replaceChildren();
    if (!notes.length) { list.append(el("p", "muted", "No support notes saved.")); return; }
    notes.forEach(note => {
      const article = el("article", "message-item");
      article.append(el("p", "", note.text), el("small", "", `Saved ${note.date}`));
      list.append(article);
    });
  }

  /* ---------- actions ---------- */

  async function setStatus(request, status) {
    const { error } = await db.from("buyer_requests").update({ status }).eq("id", request.id).eq("user_id", me);
    if (error) { alert("Could not update: " + error.message); return; }
    request.status = status;
    renderRequests();
  }

  async function removeRequest(request) {
    if (!window.confirm(`Delete your request for "${request.product}"?`)) return;
    const { error } = await db.from("buyer_requests").delete().eq("id", request.id).eq("user_id", me);
    if (error) { alert("Could not delete: " + error.message); return; }
    requests = requests.filter(item => item.id !== request.id);
    renderRequests();
  }

  $("#demandForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!db) { setFormMessage("Could not connect to the database. Please refresh.", true); return; }
    if (!me) {
      setFormMessage("Please sign in to post a request. Redirecting...", true);
      window.setTimeout(() => { window.location.href = "login.html"; }, 1500);
      return;
    }

    const product = $("#dProduct").value.trim();
    const countyName = $("#dCounty").value;
    const countyId = countyIdByKey[countyKey(countyName)];
    if (!countyId) { setFormMessage("That county isn't set up in the database yet.", true); return; }

    const button = event.target.querySelector("button[type=submit]");
    button.disabled = true;
    setFormMessage("Posting...");

    const { data, error } = await db.from("buyer_requests").insert({
      user_id: me,
      product,
      county_id: countyId,
      sale_type: $("#dType").value,
      quantity: $("#dQty").value.trim() || null,
      needed_by: $("#dDate").value || null,
      contact: $("#dContact").value.trim() || null,
      details: $("#dDetails").value.trim() || null
    }).select("*").single();
    button.disabled = false;

    if (error) {
      console.error(error);
      setFormMessage("Could not post your request: " + error.message, true);
      return;
    }
    requests = [data, ...requests];
    names[me] = names[me] || "";
    event.target.reset();
    setFormMessage("Request posted! Sellers with matching products in that county have been notified.");
    renderRequests();
  });

  $("#supportForm").addEventListener("submit", event => {
    event.preventDefault();
    notes.unshift({ text: $("#supportText").value.trim(), date: new Date().toLocaleString() });
    if (saveNotes()) { event.target.reset(); renderNotes(); } else { notes.shift(); }
  });

  try {
    const prefill = sessionStorage.getItem("mavunobridge_prefill_demand");
    if (prefill) { $("#dProduct").value = prefill; sessionStorage.removeItem("mavunobridge_prefill_demand"); }
  } catch { /* ignore */ }

  /* ---------- start ---------- */

  async function init() {
    renderNotes();
    if (!db) { $("#demandList").replaceChildren(el("p", "empty-note", "Could not connect to the database. Please refresh the page.")); return; }
    try {
      const { data } = await db.auth.getSession();
      me = data?.session?.user?.id || null;
      await loadCounties();
      await loadRequests();
      renderRequests();
    } catch (error) {
      console.error("MavunoBridge: could not load buyer requests", error);
      $("#demandList").replaceChildren(el("p", "empty-note", "Could not load requests: " + (error.message || "unknown error")));
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
