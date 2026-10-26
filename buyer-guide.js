/* =========================================================
   MAVUNOBRIDGE — BUYER + FARMER GUIDE
   Navigation assistant + offline help.
   Browser-only demo; no backend required for basic guidance.
   ========================================================= */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_BUYER_FARMER_GUIDE__) return;
  window.__MAVUNOBRIDGE_BUYER_FARMER_GUIDE__ = true;

  /* Keep the buyer-checklist API for other project files. */
  window.MAVUNO_BUYER_GUIDE = window.MAVUNO_BUYER_GUIDE || {};

  window.MAVUNO_BUYER_GUIDE.checkListing = function checkListing(listing) {
    const checks = [];
    const item = listing || {};

    if (!item.name) checks.push("Ask for the exact product name.");
    if (!item.county) checks.push("Confirm the county and collection point.");
    if (!item.price) checks.push("Confirm the final price and unit.");

    if (!item.quantity && !item.qty) {
      checks.push("Confirm the available quantity before travelling.");
    }

    if (!item.condition) {
      checks.push("Ask about the product condition and inspect it where practical.");
    }

    if (!item.phone) checks.push("Ask the seller for a contact method.");

    if (!checks.length) {
      checks.push(
        "Confirm stock, quality, final price, units, transport and payment terms before agreeing."
      );
    }

    return checks;
  };

  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const destinations = {
    marketplace: {
      label: "Marketplace",
      url: "index.html#marketplace",
      page: "index.html"
    },
    listing: {
      label: "Create listing",
      url: "index.html?guide=listing#marketplace",
      page: "index.html"
    },
    "smart-assist": {
      label: "Smart Assist",
      url: "smart-assist.html",
      page: "smart-assist.html"
    },
    sacco: {
      label: "SACCO Hub",
      url: "sacco.html",
      page: "sacco.html"
    },
    requests: {
      label: "Buyer Requests",
      url: "buyer-requests.html",
      page: "buyer-requests.html"
    },
    messages: {
      label: "Messages",
      url: "messages.html",
      page: "messages.html"
    },
    signin: {
      label: "Sign in",
      url: "login.html",
      page: "login.html"
    }
  };

  const pageNames = {
    "index.html": "Marketplace",
    "smart-assist.html": "Smart Assist",
    "sacco.html": "SACCO Hub",
    "buyer-requests.html": "Buyer Requests",
    "messages.html": "Messages",
    "login.html": "Sign in"
  };

  const pageName = pageNames[currentPage] || "MavunoBridge";

  /* -------------------- GUIDE STYLES -------------------- */

  const css = document.createElement("style");

  css.textContent = `
    .mb-guide-launcher {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 10001;
      max-width: calc(100vw - 30px);
      padding: 13px 17px;
      border: 0;
      border-radius: 999px;
      background: #20482f;
      color: #fff;
      font: 750 13px/1.25 system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 8px 26px #142d1b45;
    }

    .mb-guide-launcher:hover {
      background: #163321;
    }

    .mb-guide-panel {
      position: fixed;
      right: 18px;
      bottom: 78px;
      z-index: 10002;
      display: flex;
      flex-direction: column;
      width: min(410px, calc(100vw - 24px));
      height: min(650px, calc(100dvh - 110px));
      min-height: 360px;
      overflow: hidden;
      border: 1px solid #dce5d9;
      border-radius: 18px;
      background: #fff;
      color: #1e2b22;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      box-shadow: 0 20px 70px #0f23153d;
    }

    .mb-guide-panel[hidden] {
      display: none !important;
    }

    .mb-guide-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 15px 16px;
      background: #20482f;
      color: #fff;
    }

    .mb-guide-head h2 {
      margin: 0;
      color: #fff;
      font-size: 16px;
      line-height: 1.3;
    }

    .mb-guide-head p {
      margin: 4px 0 0;
      color: #d8e6d6;
      font-size: 11px;
    }

    .mb-guide-close {
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      border: 1px solid #ffffff55;
      border-radius: 50%;
      background: transparent;
      color: #fff;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }

    .mb-guide-messages {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 10px;
      overflow: auto;
      padding: 14px;
      background: #f7f9f4;
    }

    .mb-guide-bubble {
      max-width: 96%;
      padding: 11px 13px;
      border: 1px solid #e0e7dc;
      border-radius: 13px;
      background: #fff;
      color: #26372b;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .mb-guide-bubble.user {
      align-self: flex-end;
      border-color: #20482f;
      background: #20482f;
      color: #fff;
    }

    .mb-guide-bubble.assistant {
      align-self: flex-start;
    }

    .mb-guide-bubble small {
      display: block;
      margin-top: 7px;
      opacity: .75;
      font-size: 10px;
    }

    .mb-guide-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      padding: 10px 12px;
      border-top: 1px solid #edf1e9;
      background: #fff;
    }

    .mb-guide-chip {
      padding: 7px 10px;
      border: 1px solid #d5e2d0;
      border-radius: 999px;
      background: #f7faf4;
      color: #294c32;
      font: 650 11px/1.3 system-ui, sans-serif;
      cursor: pointer;
    }

    .mb-guide-chip:hover {
      background: #e9f2e8;
    }

    .mb-guide-form {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 11px 12px;
      border-top: 1px solid #e5eae1;
      background: #fff;
    }

    .mb-guide-input {
      flex: 1;
      min-width: 0;
      max-height: 95px;
      resize: vertical;
      padding: 10px 11px;
      border: 1px solid #d5dfd2;
      border-radius: 10px;
      color: #1e2b22;
      font: 12px/1.5 system-ui, sans-serif;
    }

    .mb-guide-send {
      min-height: 40px;
      padding: 0 13px;
      border: 0;
      border-radius: 10px;
      background: #20482f;
      color: #fff;
      font-weight: 750;
      cursor: pointer;
    }

    .mb-guide-send:disabled {
      opacity: .55;
      cursor: wait;
    }

    .mb-guide-status {
      margin: 0;
      padding: 0 13px 9px;
      background: #fff;
      color: #6c786e;
      font-size: 10px;
      line-height: 1.45;
    }

    .mb-back-top-wrap {
      display: flex;
      justify-content: center;
      margin: 18px auto 0;
      padding: 0 18px;
    }

    .mb-back-top {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border: 1px solid #cdd9cd;
      border-radius: 999px;
      background: #fff;
      color: #20482f;
      font: 750 12px/1.3 system-ui, sans-serif;
      text-decoration: none;
    }

    .mb-back-top:hover {
      background: #e9f2e8;
      color: #20482f;
    }

    .destination-guide-button {
      width: 100%;
      margin-top: 10px;
    }

    .footer-guide-button {
      padding-left: 0;
    }

    @media (max-width: 480px) {
      .mb-guide-panel {
        right: 8px;
        bottom: 75px;
        width: calc(100vw - 16px);
        height: min(650px, calc(100dvh - 95px));
      }

      .mb-guide-launcher {
        right: 12px;
        bottom: 12px;
      }
    }
  `;

  document.head.appendChild(css);

  /* -------------------- BACK TO TOP -------------------- */

  const footer = document.querySelector(".site-footer, .footer, footer");

  if (footer && !footer.querySelector(".mb-back-top")) {
    const wrap = document.createElement("div");
    wrap.className = "mb-back-top-wrap";

    const link = document.createElement("a");
    link.className = "mb-back-top";
    link.href = "#top";
    link.textContent = "↑ Back to top";

    link.addEventListener("click", event => {
      event.preventDefault();

      const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    wrap.appendChild(link);
    footer.appendChild(wrap);
  }

  /* -------------------- GUIDE LAUNCHER -------------------- */

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "mb-guide-launcher";
  launcher.textContent = "🌱 Buyer + Farmer Guide";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "mbGuidePanel");

  const panel = document.createElement("section");
  panel.id = "mbGuidePanel";
  panel.className = "mb-guide-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "MavunoBridge buyer and farmer guide");

  panel.innerHTML = `
    <div class="mb-guide-head">
      <div>
        <h2>Buyer + Farmer Guide</h2>
        <p>Website help · ${pageName}</p>
      </div>

      <button
        class="mb-guide-close"
        type="button"
        aria-label="Close guide"
      >×</button>
    </div>

    <div
      class="mb-guide-messages"
      id="mbGuideMessages"
      aria-live="polite"
    ></div>

    <div class="mb-guide-quick">
      <button class="mb-guide-chip" type="button"
        data-question="I'm a farmer. How do I list my produce?">
        I'm a farmer
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="What should I check before buying?">
        Buying checklist
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="How do I search and filter products?">
        Find products
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="listing">
        Create listing
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="smart-assist">
        Open Smart Assist
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="sacco">
        Open SACCO Hub
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="requests">
        Buyer Requests
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="messages">
        Messages
      </button>

      <button class="mb-guide-chip" type="button"
        data-go="marketplace">
        Marketplace
      </button>
    </div>

    <form class="mb-guide-form" id="mbGuideForm">
      <textarea
        class="mb-guide-input"
        id="mbGuideInput"
        rows="1"
        maxlength="1000"
        required
        aria-label="Ask the buyer and farmer guide"
        placeholder="Ask a question or type Smart Assist..."
      ></textarea>

      <button class="mb-guide-send" type="submit">Ask</button>
    </form>

    <p class="mb-guide-status" id="mbGuideStatus">
      Offline website help is ready.
    </p>
  `;

  document.body.append(launcher, panel);

  const messageArea = panel.querySelector("#mbGuideMessages");
  const form = panel.querySelector("#mbGuideForm");
  const input = panel.querySelector("#mbGuideInput");
  const sendButton = panel.querySelector(".mb-guide-send");
  const status = panel.querySelector("#mbGuideStatus");

  /* -------------------- OPEN / CLOSE GUIDE -------------------- */

  function openGuide() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");

    if (!messageArea.childElementCount) {
      addMessage(
        `Sasa! I can guide you around MavunoBridge. You're on ${pageName}. Choose a destination below, or type what you want to do. If you ask for Smart Assist, SACCO Hub, Messages or Buyer Requests, I'll open that page for you.`,
        "assistant"
      );
    }

    input.focus();
  }

  function closeGuide() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
  }

  launcher.addEventListener("click", () => {
    if (panel.hidden) openGuide();
    else closeGuide();
  });

  panel.querySelector(".mb-guide-close").addEventListener(
    "click",
    closeGuide
  );

  /* Open guide from buttons in index.html. */
  [
    "#openGuideButton",
    "#openGuideFromFeatures",
    "#openGuideFooterButton"
  ].forEach(selector => {
    document.querySelector(selector)?.addEventListener("click", () => {
      openGuide();
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) closeGuide();
  });

  /* -------------------- SAFE MESSAGE DISPLAY -------------------- */

  function addMessage(text, role, note = "") {
    const bubble = document.createElement("div");
    bubble.className = `mb-guide-bubble ${role}`;
    bubble.textContent = text;

    if (note) {
      const small = document.createElement("small");
      small.textContent = note;
      bubble.appendChild(small);
    }

    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  /* -------------------- REDIRECT / NAVIGATION -------------------- */

  function navigateTo(destination) {
    const target = destinations[destination];

    if (!target) {
      status.textContent = "I couldn't find that destination.";
      return;
    }

    closeGuide();

    /* Listing is a modal on the marketplace page. */
    if (destination === "listing") {
      if (currentPage === "index.html") {
        const marketplace = document.getElementById("marketplace");
        marketplace?.scrollIntoView({ behavior: "smooth", block: "start" });

        window.setTimeout(() => {
          document.getElementById("sellButton")?.click();
        }, 100);
      } else {
        window.location.href = target.url;
      }
      return;
    }

    /* Stay on the page if the visitor is already there. */
    if (destination === "marketplace" && currentPage === "index.html") {
      window.location.hash = "marketplace";
      document.getElementById("marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    if (target.page === currentPage) {
      if (destination === "marketplace") {
        document.getElementById("marketplace")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
      return;
    }

    window.location.href = target.url;
  }

  /* Button destinations work directly, without needing to type a question. */
  panel.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.go);
    });
  });

  /* "Take me there" buttons on the main page. */
  document.querySelectorAll("[data-guide-go]").forEach(button => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.guideGo);
    });
  });

  /*
   * Recognize direct requests to open a page.
   * Asking to open Smart Assist takes the visitor there, rather than
   * merely describing what Smart Assist does.
   */
  function destinationForQuestion(question) {
    const q = String(question || "").toLowerCase().trim();

    if (
      /\bsmart[\s-]*assist\b/.test(q) ||
      /\bopen weather\b/.test(q) ||
      /\bopen crop (help|assistant|advice)\b/.test(q)
    ) {
      return "smart-assist";
    }

    if (
      /\bsacco\b/.test(q) ||
      /\bsavings group(s)?\b/.test(q) ||
      /\bopen savings\b/.test(q)
    ) {
      return "sacco";
    }

    if (
      /\bbuyer requests?\b/.test(q) ||
      /\brequest board\b/.test(q) ||
      /\bopen requests?\b/.test(q)
    ) {
      return "requests";
    }

    if (
      /\bmessages?\b/.test(q) ||
      /\bopen chat\b/.test(q) ||
      /\bmessage centre\b/.test(q)
    ) {
      return "messages";
    }

    if (
      /\bsign in\b/.test(q) ||
      /\blog ?in\b/.test(q) ||
      /\bopen account\b/.test(q)
    ) {
      return "signin";
    }

    if (
      /\b(create|make|publish|open)\s+(a\s+)?listing\b/.test(q) ||
      /\bsell (my |your )?(produce|products|crops)\b/.test(q) ||
      /\bi want to sell\b/.test(q) ||
      /\blist my produce\b/.test(q)
    ) {
      return "listing";
    }

    if (
      /\bopen marketplace\b/.test(q) ||
      /\btake me to (the )?marketplace\b/.test(q) ||
      /\bgo to (the )?marketplace\b/.test(q) ||
      /\bshow me (the )?marketplace\b/.test(q)
    ) {
      return "marketplace";
    }

    return null;
  }

  /* -------------------- OFFLINE GUIDE ANSWERS -------------------- */

  function offlineAnswer(question) {
    const q = String(question || "").toLowerCase();

    if (/farmer|sell|list|publish|create listing|upload|add product/.test(q)) {
      return "Farmer guide: On Marketplace, click + Create listing. Enter the product or service name, choose the correct category and county, add quantity, price and unit, sale type, farm name and contact number. Add a clear product photo if you have one, then click Publish listing. Demo listings you create are saved in that browser only, so they won't automatically appear on another person's device.";
    }

    if (/buyer|buying checklist|before buying|check a product|seller|quality|verify/.test(q)) {
      return "Buyer guide: Check the exact product name, county and collection point, quantity, unit, condition, final price and seller contact. Ask about transport and payment terms, and inspect the produce where practical before agreeing. Sample listings are demonstration data, not verified live offers. Never share passwords or payment PINs.";
    }

    if (/search|filter|find product|category|county|onion seedlings|tomato seedlings/.test(q)) {
      return "Use the Marketplace search box or select a category card. You can narrow results by category, county, sale type and price-guide filter, or sort by price and newest. Try a specific term such as Onion Seedlings. Tap Clear filters to start again.";
    }

    if (/cart|basket|checkout|payment|pay|order/.test(q)) {
      return "Tap Add to cart on a product card, then open Cart in the header to review or remove items. This is a demonstration cart only: it does not collect money, reserve stock or place a real order. Confirm availability and terms directly with the seller.";
    }

    if (/sacco|saving group|savings|loan|opportun/.test(q)) {
      return "SACCO Hub has sample savings-group and agricultural-opportunity information. Check eligibility, fees and terms directly with the real organisation before sharing personal information or making payments. The sample entries are not verified applications.";
    }

    if (/buyer request|request board|request a product|post a request/.test(q)) {
      return "Buyer Requests is where a buyer can describe an item, quantity and location. This demo does not guarantee that farmers receive a request or that an order will be fulfilled.";
    }

    if (/message|chat|contact|call/.test(q)) {
      return "Use the chat/contact option on a listing to open Messages or the seller's contact option. Messaging in this browser-only demo may not reach another visitor's device. Confirm the deal details directly before arranging collection.";
    }

    if (/sign.?in|login|account|password/.test(q)) {
      return "Sign in opens the project's demo account flow. This is not production authentication, so don't reuse a real password or provide sensitive information.";
    }

    if (/price|fair|cost|expensive|market price/.test(q)) {
      return "The fair-price guide shows illustrative ranges for selected items only. These are not live market quotations and may not apply to every county, season, grade or quantity. Confirm today's price, unit, quality and transport cost with the seller.";
    }

    if (/photo|image|picture/.test(q)) {
      return "When publishing a listing, use the Product photo field to choose a clear image from your device. Make sure the photo actually shows the item being sold. Sample listing photos are illustrative.";
    }

    return "I can guide you to Marketplace, Create listing, Smart Assist, SACCO Hub, Buyer Requests, Messages or Sign in. Type the destination's name or choose one of the buttons above. You can also ask for help with filters, the demo cart or checking a listing.";
  }

  /* -------------------- OPTIONAL AI GUIDE -------------------- */

  async function getAnswer(question) {
    const endpoint = String(
      window.MAVUNO_AI_ENDPOINT || ""
    ).trim();

    if (!endpoint) {
      return {
        answer: offlineAnswer(question),
        source: "Offline guide"
      };
    }

    const prompt = [
      "You are the MavunoBridge buyer and farmer website guide for a Kenyan agriculture marketplace demo.",
      `The visitor is on ${pageName} (${currentPage}).`,
      "Explain navigation first. Sample listings, prices and reviews are illustrative, not verified live offers. New listings and demo cart data are browser-local, not shared automatically across devices. Do not claim verified sellers, real payments, live weather or live prices. Never ask for passwords, PINs or sensitive personal information. Use clear English with light Kenyan Swahili where helpful.",
      `Visitor question: ${question}`
    ].join("\n\n");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: prompt })
    });

    if (!response.ok) {
      throw new Error("AI guide request failed.");
    }

    const data = await response.json();

    if (
      !data ||
      typeof data.answer !== "string" ||
      !data.answer.trim()
    ) {
      throw new Error("AI guide did not return an answer.");
    }

    return {
      answer: data.answer.trim(),
      source: "Connected AI guide"
    };
  }

  /* -------------------- ASK THE GUIDE -------------------- */

  async function ask(question) {
    const text = String(question || "").trim().slice(0, 1000);

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    const destination = destinationForQuestion(text);

    if (destination) {
      const target = destinations[destination];

      addMessage(
        `Opening ${target.label} for you…`,
        "assistant",
        "Taking you to the requested section"
      );

      status.textContent = `Opening ${target.label}…`;

      window.setTimeout(() => navigateTo(destination), 250);
      return;
    }

    sendButton.disabled = true;
    status.textContent = "Checking the guide…";

    try {
      const result = await getAnswer(text);

      addMessage(
        result.answer,
        "assistant",
        result.source
      );

      status.textContent =
        result.source === "Connected AI guide"
          ? "AI connected. Verify important details before making a deal."
          : "Offline help is active. You can also choose a destination above.";

    } catch (error) {
      console.warn("MavunoBridge guide fallback:", error);

      addMessage(
        offlineAnswer(text),
        "assistant",
        "Offline fallback"
      );

      status.textContent =
        "AI did not respond; showing built-in help instead.";

    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    ask(input.value);
  });

  panel.querySelectorAll("[data-question]").forEach(button => {
    button.addEventListener("click", () => {
      ask(button.dataset.question);
    });
  });

})();
