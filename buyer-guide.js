/* =========================================================
   MAVUNOBRIDGE — BUYER + FARMER WEBSITE GUIDE
   Uses the existing buyer-guide.js filename.
   Offline help works without an AI service.
   Preserves the existing buyer-checklist function.
   ========================================================= */

(() => {
  "use strict";

  /* Preserve the existing buyer checklist API. */
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

  if (window.__MAVUNOBRIDGE_BUYER_FARMER_GUIDE__) return;
  window.__MAVUNOBRIDGE_BUYER_FARMER_GUIDE__ = true;

  const currentPage = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const pageNames = {
    "index.html": "Marketplace",
    "smart-assist.html": "Smart Assist",
    "sacco.html": "SACCO Hub",
    "buyer-requests.html": "Buyer Requests",
    "messages.html": "Messages",
    "login.html": "Sign in"
  };

  const pageName = pageNames[currentPage] || "MavunoBridge";

  /* GUIDE STYLES */
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
      width: min(400px, calc(100vw - 24px));
      height: min(610px, calc(100dvh - 110px));
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
      max-width: 94%;
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
      padding: 10px 12px 0;
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

    @media (max-width: 480px) {
      .mb-guide-panel {
        right: 8px;
        bottom: 75px;
        width: calc(100vw - 16px);
        height: min(630px, calc(100dvh - 95px));
      }

      .mb-guide-launcher {
        right: 12px;
        bottom: 12px;
      }
    }
  `;

  document.head.appendChild(css);

  /* BACK TO TOP */
  const footer = document.querySelector(
    ".site-footer, .footer, footer"
  );

  if (footer && !footer.querySelector(".mb-back-top")) {
    const wrap = document.createElement("div");
    wrap.className = "mb-back-top-wrap";

    const link = document.createElement("a");
    link.className = "mb-back-top";
    link.href = "#top";
    link.textContent = "↑ Back to top";

    link.addEventListener("click", event => {
      event.preventDefault();

      const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    wrap.appendChild(link);
    footer.appendChild(wrap);
  }

  /* FLOATING GUIDE BUTTON */
  const launcher = document.createElement("button");

  launcher.type = "button";
  launcher.className = "mb-guide-launcher";
  launcher.textContent = "🌱 Buyer + Farmer Guide";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "mbGuidePanel");

  /* GUIDE WINDOW */
  const panel = document.createElement("section");

  panel.id = "mbGuidePanel";
  panel.className = "mb-guide-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute(
    "aria-label",
    "MavunoBridge buyer and farmer guide"
  );

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
        data-question="I'm a buyer. How do I find and check a product?">
        I'm a buyer
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="How do I search and filter products?">
        Find products
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="What should I check before buying?">
        Buying checklist
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="How do I use Smart Assist?">
        Smart Assist
      </button>

      <button class="mb-guide-chip" type="button"
        data-question="How does the demo cart work?">
        Cart help
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
        placeholder="Ask a question..."
      ></textarea>

      <button class="mb-guide-send" type="submit">Ask</button>
    </form>

    <p class="mb-guide-status" id="mbGuideStatus">
      Offline website help is ready. Generative AI is optional.
    </p>
  `;

  document.body.append(launcher, panel);

  const messageArea = panel.querySelector("#mbGuideMessages");
  const form = panel.querySelector("#mbGuideForm");
  const input = panel.querySelector("#mbGuideInput");
  const sendButton = panel.querySelector(".mb-guide-send");
  const status = panel.querySelector("#mbGuideStatus");

  /* SAFELY DISPLAY A MESSAGE */
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

  function openGuide() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");

    if (!messageArea.childElementCount) {
      addMessage(
        `Sasa! I can help buyers and farmers use MavunoBridge. You're on ${pageName}. Ask me about listing produce, finding items, checking a seller, the cart, Smart Assist, SACCO Hub, Buyer Requests or Messages.`,
        "assistant"
      );
    }

    input.focus();
  }

  function closeGuide() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", () => {
    if (panel.hidden) {
      openGuide();
    } else {
      closeGuide();
    }
  });

  panel.querySelector(".mb-guide-close").addEventListener(
    "click",
    closeGuide
  );

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) {
      closeGuide();
    }
  });

  /* BUILT-IN OFFLINE HELP */
  function offlineAnswer(question) {
    const q = String(question || "").toLowerCase();

    if (/farmer|sell|list|publish|create listing|upload|add product/.test(q)) {
      return "Farmer guide: On Marketplace, click + Create listing. Enter the product or service name, choose the correct category and county, add quantity, price and unit, sale type, farm name and contact number. Add a clear product photo if you have one, then click Publish listing. Demo listings you create are stored in that browser, so they won't automatically appear on another person's device.";
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

    if (/smart assist|crop|plant|pest|weather|farm plan|disease/.test(q)) {
      return "Open Smart Assist and choose the relevant county, crop or farm issue. The current project is a demo and does not automatically confirm live weather or local pest outbreaks. Treat guidance as general information and contact an agricultural extension officer for important crop-protection decisions.";
    }

    if (/sacco|saving group|savings|loan|opportun/.test(q)) {
      return "Open SACCO Hub to explore sample savings groups and agricultural opportunities. Check eligibility, fees and terms directly with the real organisation before sharing personal information or making payments; the samples in this demo are not verified applications.";
    }

    if (/buyer request|request board|request a product|post a request/.test(q)) {
      return "Open Buyer Requests and fill in the item you need, quantity, location and contact details. This is a demonstration board; posting a request here does not guarantee that farmers receive it or that an order will be fulfilled.";
    }

    if (/message|chat|contact|call/.test(q)) {
      return "Use the chat/contact option on a listing to open the Messages page or the seller's contact option. Messaging in this browser-only demo may not reach another visitor's device. Confirm the deal details directly before arranging collection.";
    }

    if (/sign.?in|login|account|password/.test(q)) {
      return "Sign in opens the project's demo account flow. This is not production authentication, so don't reuse a real password or provide sensitive information.";
    }

    if (/price|fair|cost|expensive|market price/.test(q)) {
      return "The fair-price guide shows illustrative ranges for selected items only. These are not live market quotations and may not apply to every county, season, grade or quantity. Confirm today's price, unit, quality and transport cost with the seller.";
    }

    if (/photo|image|picture/.test(q)) {
      return "When publishing a listing, use the Product photo field to choose a clear image from your device. Make sure the photo actually shows the item being sold. Sample listing photos are illustrative, and an image problem should never be solved by displaying a different crop's photo.";
    }

    return "I can help with two main tasks: farmers can publish produce or services; buyers can search, compare listings and check details before agreeing. I can also explain filters, the demo cart, Smart Assist, SACCO Hub, Buyer Requests and Messages. Tell me which part you're using.";
  }

  /* OPTIONAL GENERATIVE AI ENDPOINT */
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
      "You are the MavunoBridge buyer and farmer website guide for a Kenyan agriculture marketplace demonstration.",
      `The visitor is on ${pageName} (${currentPage}).`,
      "Explain website navigation first. Sample listings and price ranges are illustrative, not verified live offers. User-created listings, cart and demo session data are browser-local and are not automatically shared across devices. Do not claim live weather, market prices, verified sellers or real payments. Never ask for passwords, PINs or sensitive personal information. Use clear English with light Kenyan Swahili where helpful.",
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

  async function ask(question) {
    const text = String(question || "").trim().slice(0, 1000);

    if (!text) return;

    addMessage(text, "user");

    input.value = "";
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
          : "Offline help is active. Set the Worker URL for generative AI.";

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
