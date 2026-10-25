"use strict";

/* =========================================================
   MAVUNOMART BUYER GUIDE
   Floating assistant that helps buyers find products,
   filters the marketplace for them, and explains how
   the cart, chat and Fair Price Shield work.
   Works offline; uses real AI when MAVUNO_AI_ENDPOINT is set.
========================================================= */

(() => {

  const ENDPOINT = window.MAVUNO_AI_ENDPOINT || "";

  /* ---------- STYLES ---------- */

  const css = `
    .bg-fab{position:fixed;right:18px;bottom:18px;z-index:40;border:0;border-radius:99px;padding:13px 18px;background:#174c32;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25)}
    .bg-panel{position:fixed;right:18px;bottom:74px;z-index:40;width:min(380px,calc(100vw - 36px));height:min(520px,calc(100vh - 110px));display:none;flex-direction:column;background:#fff;border:1px solid #e1e8df;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:hidden}
    .bg-panel.open{display:flex}
    .bg-head{background:#174c32;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700}
    .bg-head button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
    .bg-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f9fbf8}
    .bg-msg{max-width:90%;padding:9px 12px;border-radius:12px;font-size:13.5px;line-height:1.45;white-space:pre-wrap;background:#eef2ec;color:#1b2b1f}
    .bg-msg.user{align-self:flex-end;background:#174c32;color:#fff}
    .bg-msg.thinking{opacity:.6;font-style:italic}
    .bg-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .bg-actions button,.bg-chips button{border:1px solid #cfdacb;background:#fff;color:#174c32;border-radius:99px;padding:6px 11px;font-size:12px;cursor:pointer}
    .bg-actions button:hover,.bg-chips button:hover{background:#eaf4eb}
    .bg-chips{display:flex;gap:6px;overflow-x:auto;padding:8px 10px;border-top:1px solid #eef2ec;background:#fff}
    .bg-chips button{white-space:nowrap}
    .bg-form{display:flex;gap:8px;padding:10px;border-top:1px solid #eef2ec;background:#fff}
    .bg-form input{flex:1;padding:10px;border:1px solid #dbe3d9;border-radius:10px;font-size:14px}
    .bg-form button{border:0;border-radius:10px;padding:0 14px;background:#174c32;color:#fff;font-weight:700;cursor:pointer}
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);


  /* ---------- BUILD UI ---------- */

  const fab = document.createElement("button");
  fab.className = "bg-fab";
  fab.type = "button";
  fab.textContent = "🧭 Buyer Guide";

  const panel = document.createElement("div");
  panel.className = "bg-panel";
  panel.innerHTML = `
    <div class="bg-head">
      <span>🧭 Buyer Guide</span>
      <button type="button" aria-label="Close" id="bgClose">×</button>
    </div>
    <div class="bg-log" id="bgLog" aria-live="polite"></div>
    <div class="bg-chips" id="bgChips"></div>
    <form class="bg-form" id="bgForm">
      <input id="bgInput" maxlength="300" autocomplete="off"
        placeholder="e.g. cheapest tomatoes in Nakuru">
      <button type="submit" id="bgSend">Ask</button>
    </form>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  const log = panel.querySelector("#bgLog");
  const chips = panel.querySelector("#bgChips");
  const form = panel.querySelector("#bgForm");
  const input = panel.querySelector("#bgInput");
  const sendBtn = panel.querySelector("#bgSend");

  const history = [];
  let greeted = false;


  /* ---------- MESSAGES ---------- */

  function addMessage(text, role, actions) {

    const div = document.createElement("div");
    div.className = "bg-msg" + (role ? " " + role : "");

    const span = document.createElement("span");
    span.textContent = text;
    div.appendChild(span);

    if (actions && actions.length) {

      const row = document.createElement("div");
      row.className = "bg-actions";

      actions.forEach(action => {

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        button.addEventListener("click", action.fn);
        row.appendChild(button);

      });

      div.appendChild(row);

    }

    log.appendChild(div);
    log.scrollTop = log.scrollHeight;

    return div;

  }

  const reply = (text, actions = []) => ({ text, actions });


  /* ---------- MARKETPLACE CONTROL ---------- */

  function applyFilters(f = {}) {

    activeCategory = f.category || "all";
    activeSaleFilter = f.sale || "all";
    activeLocation = f.location || "all";
    activeSearch = (f.search || "").toLowerCase();
    activeSort = f.sort || "newest";

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = f.search || "";

    const locationSelect = document.getElementById("locationFilter");
    if (locationSelect) {
      const hasOption = [...locationSelect.options]
        .some(option => option.value === activeLocation);
      if (hasOption) locationSelect.value = activeLocation;
    }

    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.value = activeSort;

    document.querySelectorAll("[data-sale-filter]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.saleFilter === activeSaleFilter
      );
    });

    renderMarketplace();

    document.getElementById("marketplace")
      ?.scrollIntoView({ behavior: "smooth" });

  }

  function sanitizeFilters(f) {

    const clean = {};
    const categories = [
      "fruits", "vegetables", "nuts", "starchy",
      "grains", "legumes", "livestock", "inputs"
    ];
    const sorts = ["newest", "price-low", "price-high", "name", "fairness"];
    const sales = ["retail", "bulk"];

    if (typeof f.search === "string") clean.search = f.search.slice(0, 40);
    if (categories.includes(f.category)) clean.category = f.category;
    if (sales.includes(f.sale)) clean.sale = f.sale;
    if (sorts.includes(f.sort)) clean.sort = f.sort;

    if (typeof f.location === "string") {
      const known = listings.map(item => item.location);
      if (known.includes(f.location)) clean.location = f.location;
    }

    return clean;

  }


  /* ---------- SEARCH HELPERS ---------- */

  const ALIASES = {
    nyanya: "tomatoes",
    mahindi: "maize",
    maharagwe: "beans",
    viazi: "potatoes",
    parachichi: "avocados",
    ndizi: "bananas",
    vitunguu: "onions",
    ndengu: "green grams"
  };

  const CATEGORY_WORDS = [
    ["fruits", /\bfruits?\b|matunda/],
    ["vegetables", /vegetable|veggie|mboga/],
    ["nuts", /\bnuts?\b|karanga/],
    ["starchy", /starch|tuber|\broots?\b/],
    ["grains", /\bgrains?\b|cereal|nafaka/],
    ["legumes", /legume|\bpulses?\b/],
    ["livestock", /livestock|\bcows?\b|goat|sheep|chicken|poultry|ng'ombe|mbuzi|kuku/],
    ["inputs", /\binputs?\b|\bseeds?\b|fertili|\btools?\b|mbegu|mbolea/]
  ];

  const strip = text => text.toLowerCase().replace(/['’]/g, "");

  function parseQuery(raw) {

    let q = strip(raw);

    Object.entries(ALIASES).forEach(([sw, en]) => {
      if (q.includes(sw)) q += " " + en;
    });

    const f = {};

    const names = [...new Set(listings.map(l => l.name.toLowerCase()))];

    const productHit =
      names.find(name => q.includes(name)) ||
      names.find(name => {
        const singular = name.replace(/s$/, "");
        return singular.length > 3 && q.includes(singular);
      });

    if (productHit) f.search = productHit;

    if (!f.search) {
      CATEGORY_WORDS.forEach(([category, pattern]) => {
        if (!f.category && pattern.test(q)) f.category = category;
      });
    }

    const locations = [...new Set(listings.map(l => l.location))];

    const locationHit = locations.find(place => q.includes(strip(place)));

    if (locationHit) f.location = locationHit;

    const budget = q.match(
      /(?:under|below|less than|chini ya|cheaper than|max)\s*(?:ksh\.?|kes|shs?)?\s*(\d+)/
    );

    if (budget) f.maxPrice = Number(budget[1]);

    if (/bulk|wholesale|jumla/.test(q)) f.sale = "bulk";
    else if (/retail|rejareja|household/.test(q)) f.sale = "retail";

    if (/cheap|lowest|rahisi|least expensive/.test(q)) f.sort = "price-low";
    else if (/best price|fair price|good deal|bargain/.test(q)) f.sort = "fairness";

    return f;

  }

  function priceInfo(item, f) {

    const type =
      (f.sale === "bulk" && item.bulkPrice) || !item.retailPrice
        ? "bulk"
        : "retail";

    return {
      type,
      price: Number(type === "bulk" ? item.bulkPrice : item.retailPrice) || 0,
      unit: type === "bulk" ? item.bulkUnit : item.retailUnit
    };

  }

  function matchesFor(f) {

    return listings.filter(item => {

      if (f.category && item.category !== f.category) return false;
      if (f.location && item.location !== f.location) return false;

      if (
        f.sale &&
        !(item.saleType === f.sale || item.saleType === "both")
      ) return false;

      if (f.search) {
        const haystack = [
          item.name, item.category, item.location,
          item.seller, item.description
        ].join(" ").toLowerCase();
        if (!haystack.includes(f.search)) return false;
      }

      if (f.maxPrice) {
        const { price } = priceInfo(item, f);
        if (!(price > 0 && price <= f.maxPrice)) return false;
      }

      return true;

    });

  }

  function describe(item, f) {

    const { type, price, unit } = priceInfo(item, f);

    const fair =
      typeof getFairness === "function"
        ? getFairness(item, type).label
        : "";

    return `• ${item.name}: KSh ${formatMoney(price)}/${unit}` +
      ` (${type}) · ${item.seller}, ${item.location}` +
      (fair ? ` · ${fair}` : "");

  }

  function doSearch(f) {

    let matches = matchesFor(f);

    if (!matches.length) {
      return reply(
        "I couldn't find a matching listing. Try a different product, county or budget, or browse everything.",
        [{ label: "Show all products", fn: () => applyFilters({}) }]
      );
    }

    if (f.sort === "price-low") {
      matches.sort((a, b) => priceInfo(a, f).price - priceInfo(b, f).price);
    }

    if (f.sort === "fairness" && typeof getFairnessScore === "function") {
      matches.sort((a, b) => getFairnessScore(a) - getFairnessScore(b));
    }

    applyFilters(f);

    const top = matches.slice(0, 3);

    let text =
      `Found ${matches.length} listing${matches.length === 1 ? "" : "s"}. ` +
      `I've filtered the marketplace for you.\n\n` +
      top.map(item => describe(item, f)).join("\n");

    if (f.maxPrice) {
      text += `\n\n(Only listings at or under KSh ${f.maxPrice} are shown above; the product grid itself can't filter by price.)`;
    }

    const actions = top.map(item => ({
      label: `🛒 Add ${item.name} (${item.seller})`,
      fn: () => {
        addToCart(item.id, priceInfo(item, f).type);
        addMessage(
          `Added ${item.name} to your cart. When you're ready, open the cart and press Proceed to Checkout to message the seller.`,
          "",
          [{ label: "Open cart", fn: () => openCart() }]
        );
      }
    }));

    return reply(text, actions);

  }


  /* ---------- OFFLINE HELPER ---------- */

  const TOPICS = [
    {
      test: /^(hi|hello|hey|habari|mambo|sasa|niaje)\b/,
      run: () => reply(
        "Habari! 👋 Tell me what you're looking for, for example \"cheapest tomatoes in Nakuru\" or \"bulk maize under 70\". I'll filter the marketplace for you.")
    },
    {
      test: /cart|kikapu|basket/,
      run: () => reply(
        "Use 🛒 Add to Cart on any product. Open the cart to change quantities (bulk orders move in steps of the seller's minimum order), then press Proceed to Checkout.",
        [{ label: "Open cart", fn: () => openCart() }])
    },
    {
      test: /checkout|how.*(buy|order)|nunua|order|\bpay\b|lipa/,
      run: () => reply(
        "How buying works: add items to your cart → Proceed to Checkout → we message each seller to say you're interested and take you to the chat. There you can ask questions, make an offer, and agree pickup or delivery. Payment is agreed directly with the seller for now.",
        [{ label: "Open cart", fn: () => openCart() },
         { label: "Open messages", fn: () => { location.href = "messages.html"; } }])
    },
    {
      test: /message|chat|contact|whatsapp|ongea|reach.*seller/,
      run: () => reply(
        "After checkout you're taken to Messages, where you can chat with each seller, make an offer, and use the WhatsApp or Call buttons. Your conversations are always under 💬 Messages in the top menu.",
        [{ label: "Open messages", fn: () => { location.href = "messages.html"; } }])
    },
    {
      test: /fair|overpriced|shield|too high|bei ghali/,
      run: () => reply(
        "Fair Price Shield compares each listing's price with an indicative market range. 🟢 means fair or good value, 🟠 means above the range, 🔴 means potentially overpriced. The ranges are demo guides, not official prices, so also compare with your local market.",
        [{ label: "Sort by best fair price", fn: () => applyFilters({ sort: "fairness" }) }])
    },
    {
      test: /what.*bulk|bulk.*mean|minimum order|wholesale/,
      run: () => reply(
        "Bulk listings have a lower price per unit but a minimum order, for example 20 kg. In your cart, bulk quantities go up in steps of that minimum.",
        [{ label: "Show bulk deals", fn: () => applyFilters({ sale: "bulk", sort: "price-low" }) }])
    },
    {
      test: /sell|list(ing)? (a|my)|uza/,
      run: () => reply(
        "To sell, press + List a Product, fill in your product, prices and phone number, and publish. Buyers who are interested will message you.",
        [{ label: "List a product", fn: () => openListingModal() }])
    },
    {
      test: /advice|farming tip|how (do|to) (i )?grow|crop|pest|disease|msaidizi|smart assist/,
      run: () => reply(
        "For farming questions, the Smart Assist page has an AI Shamba Assistant for crops, pests, storage and pricing.",
        [{ label: "Open Smart Assist", fn: () => { location.href = "smart-assist.html"; } }])
    },
    {
      test: /login|account|sign ?in|sign ?up/,
      run: () => reply(
        "The Login button at the top is a demo for now; you can browse, add to cart and message sellers without an account.")
    },
    {
      test: /help|what can you|navigate|how.*(use|work)/,
      run: () => reply(
        "I can: \n• find products (\"cheap onions in Nakuru\")\n• filter bulk or retail deals\n• explain Fair Price Shield\n• add items to your cart\n• explain checkout and messaging\n\nTry one of the buttons below.")
    }
  ];

  function offlineReply(question) {

    const f = parseQuery(question);

    const wantsSearch =
      f.search || f.category || f.location || f.maxPrice;

    if (wantsSearch) return doSearch(f);

    const q = question.toLowerCase();
    const topic = TOPICS.find(t => t.test.test(q));

    if (topic) return topic.run();

    if (f.sort || f.sale) return doSearch(f);

    return reply(
      "I'm not sure about that one. I can find products, filter deals, explain Fair Price Shield, and guide you through the cart and chat. Try \"cheapest tomatoes\" or \"how do I buy?\".");

  }


  /* ---------- AI MODE ---------- */

  async function aiReply() {

    const context = listings.slice(0, 40).map(item => ({
      name: item.name,
      category: item.category,
      seller: item.seller,
      location: item.location,
      saleType: item.saleType,
      retailPrice: item.retailPrice || null,
      bulkPrice: item.bulkPrice || null,
      unit: item.retailUnit || item.bulkUnit,
      bulkMinimum: item.bulkMinimum || null
    }));

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "buyer",
        messages: history.slice(-10),
        context
      })
    });

    if (!response.ok) throw new Error("Bad response");

    const data = await response.json();

    if (!data.reply) throw new Error("Empty reply");

    let text = data.reply;
    const actions = [];

    const match = text.match(/ACTION:\s*(\{.*\})\s*$/m);

    if (match) {

      text = text.replace(match[0], "").trim();

      try {

        const filters = sanitizeFilters(JSON.parse(match[1]));

        if (Object.keys(filters).length) {
          applyFilters(filters);
          actions.push({
            label: "Reset filters",
            fn: () => applyFilters({})
          });
        }

      } catch { /* ignore a malformed action */ }

    }

    actions.push({ label: "Open cart", fn: () => openCart() });

    return reply(text, actions);

  }


  /* ---------- ASK ---------- */

  async function ask(question) {

    const text = question.trim();
    if (!text) return;

    addMessage(text, "user");
    history.push({ role: "user", content: text });

    input.value = "";
    sendBtn.disabled = true;

    const thinking = addMessage("Thinking...", "thinking");

    let result;

    if (ENDPOINT) {
      try {
        result = await aiReply();
      } catch {
        result = offlineReply(text);
      }
    } else {
      result = offlineReply(text);
    }

    thinking.remove();
    addMessage(result.text, "", result.actions);
    history.push({ role: "assistant", content: result.text });

    sendBtn.disabled = false;
    input.focus();

  }


  /* ---------- EVENTS ---------- */

  [
    "Cheapest tomatoes",
    "Bulk maize",
    "Fruits in Kiambu",
    "How do I buy?",
    "What is Fair Price Shield?"
  ].forEach(label => {

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => ask(label));
    chips.appendChild(button);

  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    ask(input.value);
  });

  fab.addEventListener("click", () => {

    panel.classList.toggle("open");

    if (panel.classList.contains("open") && !greeted) {
      greeted = true;
      addMessage(
        "Habari! 👋 I'm your Buyer Guide. Tell me what you want to buy and I'll filter the marketplace for you, or ask how anything works."
      );
    }

    if (panel.classList.contains("open")) input.focus();

  });

  panel.querySelector("#bgClose").addEventListener(
    "click",
    () => panel.classList.remove("open")
  );

})();
