
"use strict";

/* ==========================================
   MAVUNOBRIDGE — INTERACTIVE DEMO MESSAGING
   Rule-based replies; no external AI service.
   ========================================== */

const MESSAGE_KEY = "mavunobridge_demo_messages_v1";
const PENDING_CHAT_KEY = "mavunobridge_pending_chat_v1";
const LANGUAGE_KEY = "mavunobridge_language_v1";

const $ = (selector) => document.querySelector(selector);

const initialConversations = [
  {
    id: "sample-farm-chat",
    name: "Green Valley Farm",
    about: "Sample farmer · Kiambu County",
    productName: "Fresh Hass Avocados",
    county: "Kiambu",
    price: 120,
    quantity: "150 kg",
    saleType: "Both",
    messages: [
      {
        from: "them",
        text: "Hi! Welcome to Green Valley Farm. Ask me about our avocado listing."
      }
    ]
  },
  {
    id: "sample-buyer-chat",
    name: "Fresh Market Buyer",
    about: "Sample buyer · Nakuru County",
    productName: "Fresh Red Tomatoes",
    county: "Nakuru",
    price: 75,
    quantity: "100 kg",
    saleType: "Both",
    messages: [
      {
        from: "them",
        text: "Hello! I am looking for fresh tomatoes for my shop."
      }
    ]
  },
  {
    id: "sample-livestock-chat",
    name: "Sunrise Poultry Farm",
    about: "Sample seller · Kiambu County",
    productName: "Fresh Farm Eggs",
    county: "Kiambu",
    price: 450,
    quantity: "10 trays",
    saleType: "Both",
    messages: [
      {
        from: "them",
        text: "Karibu! You can ask me about the sample egg listing."
      }
    ]
  }
];

let conversations = loadConversations();
let activeConversationId = null;
let pendingDraft = "";
let pendingTimer = null;
let typingConversationId = null;
const pendingReplyTimers = new Set();

/* ---------- STORAGE ---------- */

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadConversations() {
  try {
    const saved = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "null");

    return Array.isArray(saved) && saved.length
      ? saved
      : deepCopy(initialConversations);
  } catch (error) {
    console.warn("Could not read saved demo messages:", error);
    return deepCopy(initialConversations);
  }
}

function saveConversations() {
  try {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(conversations));
    return true;
  } catch (error) {
    console.error("Could not save messages:", error);
    return false;
  }
}

function readPendingChat() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_CHAT_KEY) || "null");
  } catch (_) {
    return null;
  }
}

function getLanguage() {
  try {
    const language = localStorage.getItem(LANGUAGE_KEY);
    return ["en", "mix", "sw"].includes(language) ? language : "mix";
  } catch (_) {
    return "mix";
  }
}

/* ---------- SAFE DISPLAY HELPERS ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function money(value) {
  return "KSh " + Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });
}

function normaliseText(text) {
  return String(text || "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- PRODUCT-SPECIFIC CHAT ---------- */

function prepareProductChat() {
  const pending = readPendingChat();
  if (!pending || !pending.productId) return;

  try {
    localStorage.removeItem(PENDING_CHAT_KEY);
  } catch (_) {}

  const id = "listing-" + pending.productId;
  let conversation = conversations.find((item) => item.id === id);

  if (!conversation) {
    conversation = {
      id,
      productId: pending.productId,
      productName: pending.productName || "Farm product",
      name: pending.seller || "Farm seller",
      about: `Product enquiry · ${pending.county || "Kenya"}`,
      county: pending.county || "",
      phone: pending.phone || "",
      price: Number(pending.price) || 0,
      quantity: pending.quantity || "",
      saleType: pending.saleType || "Both",
      messages: []
    };

    conversations.unshift(conversation);
  } else {
    conversation.productName = pending.productName || conversation.productName;
    conversation.county = pending.county || conversation.county;
    conversation.price = Number(pending.price) || conversation.price;
    conversation.quantity = pending.quantity || conversation.quantity;
    conversation.saleType = pending.saleType || conversation.saleType;
  }

  activeConversationId = id;

  if (conversation.messages.length === 0 && pending.message) {
    pendingDraft = pending.message;
  }

  saveConversations();
}

/* ---------- CONVERSATION LIST ---------- */

function renderConversationList() {
  const list = $("#conversationList");
  if (!list) return;

  list.innerHTML = conversations.map((conversation) => {
    const last = conversation.messages[conversation.messages.length - 1];
    const preview = last
      ? last.text
      : `Ask about ${conversation.productName || "this listing"}`;

    return `
      <button
        class="conversation-item ${conversation.id === activeConversationId ? "active" : ""}"
        type="button"
        data-conversation="${escapeHTML(conversation.id)}"
      >
        <span class="conversation-avatar">
          ${escapeHTML((conversation.name || "F").slice(0, 1).toUpperCase())}
        </span>
        <span class="conversation-summary">
          <strong>${escapeHTML(conversation.name || "Farm seller")}</strong>
          <small>${escapeHTML(preview)}</small>
        </span>
      </button>
    `;
  }).join("");
}

/* ---------- CURRENT CHAT ---------- */

function renderActiveConversation() {
  const conversation = conversations.find(
    (item) => item.id === activeConversationId
  );

  const list = $("#messageList");
  const title = $("#conversationTitle");
  const subtitle = $("#conversationSubtitle");
  const input = $("#messageInput");
  const sendButton = $("#sendMessageButton");
  const typing = $("#typingIndicator");

  if (!list || !title || !subtitle || !input || !sendButton) return;

  if (!conversation) {
    title.textContent = "Choose a conversation";
    subtitle.textContent = "Select a sample contact or open a listing chat.";
    list.innerHTML = '<div class="message-empty">Choose a conversation to start chatting.</div>';
    input.disabled = true;
    sendButton.disabled = true;
    if (typing) typing.classList.add("hidden");
    return;
  }

  title.textContent = conversation.name || "Farm seller";
  subtitle.textContent = conversation.about || "MavunoBridge demo conversation";

  if (!conversation.messages.length) {
    list.innerHTML = '<div class="message-empty">Your chat is ready. Send a message to start.</div>';
  } else {
    list.innerHTML = conversation.messages.map((message) => {
      const mine = message.from === "me";
      const automatic = message.from === "bot";

      let senderLabel = mine ? "You" : "Demo seller";
      if (automatic) senderLabel = "Automatic demo reply";

      return `
        <div class="message-row ${mine ? "mine" : "theirs"} ${automatic ? "automated" : ""}">
          <div class="message-bubble">
            ${escapeHTML(message.text)}
            <small>${escapeHTML(senderLabel)}</small>
          </div>
        </div>
      `;
    }).join("");
  }

  input.disabled = false;
  sendButton.disabled = false;
  list.scrollTop = list.scrollHeight;

  if (typing) {
    typing.classList.toggle("hidden", typingConversationId !== activeConversationId);
  }
}

function selectConversation(id) {
  if (!conversations.some((item) => item.id === id)) return;

  activeConversationId = id;
  pendingDraft = "";

  renderConversationList();
  renderActiveConversation();
}

/* ---------- AUTOMATIC DEMO RESPONSES ---------- */

function responseSet(en, mix, sw) {
  const language = getLanguage();
  return language === "en" ? en : language === "sw" ? sw : mix;
}

function detectProductType(conversation) {
  const product = normaliseText(conversation.productName || "");

  if (/egg|mayai|poultry/.test(product)) return "eggs";
  if (/milk|maziwa|dairy/.test(product)) return "milk";
  if (/meat|beef|goat|mutton|chicken|nyama/.test(product)) return "meat";
  if (/honey|asali|bee/.test(product)) return "honey";
  if (/avocado|parachichi/.test(product)) return "avocado";
  if (/tomato|nyanya/.test(product)) return "tomato";
  if (/maize|mahindi/.test(product)) return "maize";
  if (/bean|ndengu|legume/.test(product)) return "beans";

  return "other";
}

function createDemoReply(userText, conversation) {
  const text = normaliseText(userText);
  const productType = detectProductType(conversation);

  const shownProduct = conversation.productName || "this product";
  const shownCounty = conversation.county || "the listed county";
  const shownPrice = money(conversation.price);
  const shownQuantity = conversation.quantity || "the quantity shown in the listing";
  const shownSaleType = conversation.saleType || "Both";

  if (/\b(hello|hi|hey|habari|niaje|mambo|sasa|hujambo|jambo)\b/.test(text)) {
    return responseSet(
      `Hello! Thanks for contacting us about ${shownProduct}. What would you like to know?`,
      `Sasa! Asante kwa ku-check ${shownProduct}. Unataka kujua nini kuhusu hii product?`,
      `Habari! Asante kwa kuulizia ${shownProduct}. Ungependa kujua nini kuhusu bidhaa hii?`
    );
  }

  if (/\b(price|cost|how much|bei|pesa ngapi|ngapi|shilingi)\b/.test(text)) {
    return responseSet(
      `The demo listing shows ${shownPrice} per unit for ${shownProduct}. Please confirm the unit and final price directly with the seller before buying.`,
      `Kwa demo listing, ${shownProduct} iko ${shownPrice} per unit. Confirm unit na final price na seller kabla ya kununua.`,
      `Bei kwenye listing ya mfano ni ${shownPrice} kwa kipimo cha ${shownProduct}. Thibitisha kipimo na bei ya mwisho na muuzaji kabla ya kununua.`
    );
  }

  if (/\b(available|availability|stock|still have|in stock|ipo|zipo|bado iko|bado mna)\b/.test(text)) {
    return responseSet(
      `The demo listing shows ${shownQuantity}. I cannot check live stock in this demo, so please confirm current availability with the seller.`,
      `Listing inaonyesha ${shownQuantity}. Hii demo haiwezi check stock live, so tafadhali confirm na seller kama bado iko.`,
      `Listing inaonyesha ${shownQuantity}. Mfumo huu wa mfano hauangalii akiba ya sasa, kwa hivyo thibitisha upatikanaji na muuzaji.`
    );
  }

  if (/\b(bulk|wholesale|jumla|kwa wingi|large order|many kilos|retail|rejareja|small quantity)\b/.test(text)) {
    if (shownSaleType === "Retail") {
      return responseSet(
        `This listing is marked Retail. Ask the seller whether they can accept a bulk order or larger quantity.`,
        `Hii listing ni Retail. Uliza seller kama anaweza accept bulk order ama quantity kubwa.`,
        `Bidhaa hii imewekwa kwa mauzo ya rejareja. Uliza muuzaji kama anaweza kuuza kwa wingi.`
      );
    }

    if (shownSaleType === "Bulk") {
      return responseSet(
        `This listing is marked Bulk. Please tell the seller the quantity you need and confirm their minimum order.`,
        `Hii listing ni Bulk. Mwambie seller quantity unahitaji na uconfirm minimum order.`,
        `Bidhaa hii imewekwa kwa mauzo ya wingi. Mwambie muuzaji kiasi unachohitaji na uthibitishe kiwango cha chini cha oda.`
      );
    }

    return responseSet(
      `The listing accepts retail and bulk enquiries. Tell the seller the quantity you need so you can discuss the terms.`,
      `Hii listing inakubali retail na bulk. Mwambie seller quantity unahitaji ili mjadiliane terms.`,
      `Listing hii inaruhusu mauzo ya rejareja na ya wingi. Mwambie muuzaji kiasi unachohitaji mjadili masharti.`
    );
  }

  if (/\b(delivery|deliver|transport|shipping|pickup|pick up|location|where|county|town|eneo|usafiri|leta|mnafika)\b/.test(text)) {
    return responseSet(
      `The listing is in ${shownCounty}. Delivery is not arranged by this demo, so please agree on transport, collection point and any extra costs directly with the seller.`,
      `Listing iko ${shownCounty}. Hii demo haipangi delivery, so ongeeni na seller kuhusu transport, pickup point na extra cost.`,
      `Bidhaa imeorodheshwa ${shownCounty}. Mfumo huu haupangi usafirishaji; kubaliana na muuzaji kuhusu usafiri, mahali pa kuchukulia na gharama zozote.`
    );
  }

  if (/\b(discount|cheaper|negotiate|negotiable|offer|punguza|discount|punguzo|last price)\b/.test(text)) {
    return responseSet(
      `You can ask the seller whether a discount is possible, especially for larger quantities. Any discount must be agreed directly with the seller.`,
      `Unaweza uliza seller kama discount inawezekana, especially uki-order quantity kubwa. Muelewane direct kuhusu bei.`,
      `Unaweza kuuliza muuzaji kama punguzo linawezekana kwa kiasi kikubwa. Kubalianeni moja kwa moja kuhusu bei.`
    );
  }

  if (/\b(pay|payment|mpesa|m-pesa|send money|deposit|lipa|malipo|kutuma pesa)\b/.test(text)) {
    return responseSet(
      `Payments are not processed in this demo. Verify the seller and product independently, agree on the terms, and use a payment method you trust.`,
      `Hii demo haiprocess payments. Verify seller na product kwanza, mkubaliane terms, na utumie payment method una-trust.`,
      `Mfumo huu wa mfano haupokei malipo. Hakikisha muuzaji na bidhaa ni halali, kubalianeni masharti, na tumia njia ya malipo unayoamini.`
    );
  }

  if (/\b(fresh|quality|safe|expiry|expire|storage|weight|freshness|halali|ubora|salama|uzito|expiry date)\b/.test(text)) {
    if (productType === "eggs") {
      return responseSet(
        `For eggs, please confirm the tray size, collection date and how the eggs are handled. Inspect the eggs when you collect them.`,
        `Kwa mayai, confirm idadi ya mayai kwa tray, tarehe ya kukusanywa na handling. Angalia mayai ukichukua.`,
        `Kwa mayai, thibitisha idadi kwa trei, tarehe ya kukusanywa na namna yalivyohifadhiwa. Yakague unapoyapokea.`
      );
    }

    if (productType === "milk" || productType === "meat") {
      return responseSet(
        `For this animal product, confirm the collection time, safe handling and suitable chilled storage with the seller. Check the product before accepting it.`,
        `Kwa hii animal product, confirm collection time, handling safe na storage ya baridi na seller. Kagua bidhaa kabla ya kuipokea.`,
        `Kwa bidhaa hii ya mnyama, thibitisha muda wa kuchukua, usalama wa utunzaji na hifadhi ya baridi na muuzaji. Kagua kabla ya kupokea.`
      );
    }

    return responseSet(
      `Please ask the seller about harvest or packing date, product condition and storage. Check the product before accepting it.`,
      `Uliza seller kuhusu harvest/packing date, condition ya product na storage. Kagua bidhaa kabla ya kuipokea.`,
      `Uliza muuzaji kuhusu tarehe ya kuvunwa au kufungashwa, hali ya bidhaa na uhifadhi. Kagua bidhaa kabla ya kuipokea.`
    );
  }

  if (/\b(egg|eggs|mayai|tray)\b/.test(text) || productType === "eggs") {
    return responseSet(
      `The sample product is ${shownProduct}, listed at ${shownPrice}, with ${shownQuantity} shown. Please confirm tray size, current stock and collection arrangements with the seller.`,
      `Sample product ni ${shownProduct}, bei ${shownPrice}, quantity ${shownQuantity}. Confirm tray size, stock na pickup na seller.`,
      `Bidhaa ya mfano ni ${shownProduct}, bei ${shownPrice}, kiasi ${shownQuantity}. Thibitisha idadi kwa trei, akiba na mahali pa kuchukulia na muuzaji.`
    );
  }

  if (/\b(meat|beef|goat|mutton|chicken|nyama|kuku)\b/.test(text) || productType === "meat") {
    return responseSet(
      `For ${shownProduct}, ask the seller to confirm weight, price per unit, preparation and safe chilled transport before ordering.`,
      `Kwa ${shownProduct}, uliza seller a-confirm weight, bei per unit, preparation na transport ya baridi kabla ya order.`,
      `Kwa ${shownProduct}, thibitisha uzito, bei kwa kipimo, namna ilivyotayarishwa na usafiri wa baridi kabla ya kuagiza.`
    );
  }

  if (/\b(milk|maziwa|honey|asali)\b/.test(text) || ["milk", "honey"].includes(productType)) {
    return responseSet(
      `Ask the seller to confirm the container or package size, price per unit, collection time and appropriate storage for ${shownProduct}.`,
      `Uliza seller a-confirm size ya container/package, price per unit, pickup time na storage inayofaa kwa ${shownProduct}.`,
      `Uliza muuzaji athibitishe ukubwa wa chombo au kifurushi, bei kwa kipimo, muda wa kuchukua na uhifadhi unaofaa wa ${shownProduct}.`
    );
  }

  if (/\b(thanks|thank you|asante|shukran)\b/.test(text)) {
    return responseSet(
      "You're welcome! Ask another question about the product or the sale terms.",
      "Karibu! Uliza swali lingine kuhusu product ama sale terms.",
      "Karibu! Uliza swali lingine kuhusu bidhaa au masharti ya mauzo."
    );
  }

  if (/\b(order|buy|purchase|want|need|naomba|nataka|ninahitaji|agiza|kununua)\b/.test(text)) {
    return responseSet(
      `Thanks for your interest in ${shownProduct}. Please tell the seller your required quantity and preferred collection or delivery arrangement.`,
      `Asante kwa interest ya ${shownProduct}. Mwambie seller quantity unataka na vile utachukua ama kupanga delivery.`,
      `Asante kwa kuonyesha nia ya ${shownProduct}. Mwambie muuzaji kiasi unachohitaji na jinsi utakavyochukua au kupanga usafirishaji.`
    );
  }

  return responseSet(
    `Thanks for your message about ${shownProduct}. In this demo, I can help with price, available quantity, sale type, location, delivery questions and product handling. What would you like to know?`,
    `Nimekupata kuhusu ${shownProduct}. Kwa demo hii naweza kusaidia kuhusu bei, quantity, retail/bulk, location, delivery na handling. Unataka kujua nini?`,
    `Asante kwa ujumbe kuhusu ${shownProduct}. Katika mfano huu, naweza kusaidia kuhusu bei, kiasi, aina ya mauzo, eneo, usafirishaji na utunzaji. Ungependa kujua nini?`
  );
}

/* ---------- RESPONSE TIMING ---------- */

function setTyping(id) {
  typingConversationId = id;
  const typing = $("#typingIndicator");

  if (typing && activeConversationId === id) {
    const language = getLanguage();

    typing.textContent = language === "en"
      ? "Demo contact is typing..."
      : language === "sw"
        ? "Mtu wa mfano anaandika..."
        : "Demo contact anaandika...";

    typing.classList.remove("hidden");
  }
}

function clearTyping(id) {
  if (typingConversationId === id) {
    typingConversationId = null;
  }

  const typing = $("#typingIndicator");
  if (typing) typing.classList.add("hidden");
}

function scheduleDemoReply(conversationId, userText) {
  const conversation = conversations.find(
    (item) => item.id === conversationId
  );

  if (!conversation) return;

  setTyping(conversationId);

  const timer = setTimeout(() => {
    pendingReplyTimers.delete(timer);

    const currentConversation = conversations.find(
      (item) => item.id === conversationId
    );

    if (!currentConversation) {
      clearTyping(conversationId);
      return;
    }

    const reply = createDemoReply(userText, currentConversation);

    currentConversation.messages.push({
      from: "bot",
      text: reply,
      sentAt: Date.now()
    });

    saveConversations();

    clearTyping(conversationId);
    renderConversationList();

    if (activeConversationId === conversationId) {
      renderActiveConversation();
    }
  }, 850);

  pendingReplyTimers.add(timer);
}

/* ---------- SEND MESSAGE ---------- */

function sendDemoMessage(event) {
  event.preventDefault();

  const input = $("#messageInput");

  const conversation = conversations.find(
    (item) => item.id === activeConversationId
  );

  if (!input || !conversation) return;

  const text = input.value.trim();
  if (!text) return;

  if (text.length > 1000) {
    alert("Please keep your message under 1,000 characters.");
    return;
  }

  conversation.messages.push({
    from: "me",
    text,
    sentAt: Date.now()
  });

  if (!saveConversations()) {
    conversation.messages.pop();
    alert("Could not save this message. Browser storage may be full.");
    return;
  }

  input.value = "";
  renderConversationList();
  renderActiveConversation();

  scheduleDemoReply(conversation.id, text);
}

/* ---------- INITIALISE ---------- */

function initMessages() {
  const list = $("#conversationList");
  const form = $("#messageForm");

  if (!list || !form) {
    console.error("Chat elements are missing. Check messages.html.");
    return;
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation]");
    if (!button) return;

    activeConversationId = button.dataset.conversation;
    pendingDraft = "";

    renderConversationList();
    renderActiveConversation();
  });

  form.addEventListener("submit", sendDemoMessage);

  prepareProductChat();
  renderConversationList();
  renderActiveConversation();

  if (pendingDraft && $("#messageInput") && !$("#messageInput").disabled) {
    $("#messageInput").value = pendingDraft;
    $("#messageInput").focus();
  }
}

document.addEventListener("DOMContentLoaded", initMessages);
