
"use strict";

/* ==========================================
   MAVUNOBRIDGE — PRODUCT CHAT DEMO
   Messages are saved in this browser only.
   ========================================== */

const MESSAGE_KEY = "mavunobridge_demo_messages_v1";
const PENDING_CHAT_KEY = "mavunobridge_pending_chat_v1";

const initialConversations = [
  {
    id: "sample-farm-chat",
    name: "Green Valley Farm",
    about: "Sample farmer · Kiambu County",
    messages: [
      {
        from: "them",
        text: "Hello! Thanks for checking our avocado listing."
      },
      {
        from: "me",
        text: "Hi, are the avocados available in bulk?"
      },
      {
        from: "them",
        text: "Please confirm your quantity so we can discuss availability."
      }
    ]
  },
  {
    id: "sample-buyer-chat",
    name: "Fresh Market Buyer",
    about: "Sample buyer · Nakuru County",
    messages: [
      {
        from: "them",
        text: "Hello, I am looking for fresh tomatoes for my shop."
      }
    ]
  },
  {
    id: "sample-farmer-group",
    name: "Farmer Connections",
    about: "Sample farming group",
    messages: [
      {
        from: "them",
        text: "Welcome to the demo conversation. Share your farming ideas here."
      }
    ]
  }
];

let conversations = loadConversations();
let activeConversationId = null;
let initialDraft = "";

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadConversations() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(MESSAGE_KEY) || "null"
    );

    return Array.isArray(stored) && stored.length
      ? stored
      : deepCopy(initialConversations);
  } catch (error) {
    console.warn("Could not load saved conversations:", error);
    return deepCopy(initialConversations);
  }
}

function saveConversations() {
  try {
    localStorage.setItem(
      MESSAGE_KEY,
      JSON.stringify(conversations)
    );
    return true;
  } catch (error) {
    console.error("Could not save messages:", error);
    return false;
  }
}

function escapeMessage(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* Start or return to the conversation associated with a product. */
function prepareProductChat() {
  let pending = null;

  try {
    pending = JSON.parse(
      localStorage.getItem(PENDING_CHAT_KEY) || "null"
    );
  } catch (error) {
    console.warn("Could not read selected product:", error);
  }

  if (!pending || !pending.productId) return;

  try {
    localStorage.removeItem(PENDING_CHAT_KEY);
  } catch (_) {
    // The chat can still open if pending data could not be cleared.
  }

  const conversationId = "listing-" + pending.productId;

  let conversation = conversations.find(
    (item) => item.id === conversationId
  );

  if (!conversation) {
    conversation = {
      id: conversationId,
      productId: pending.productId,
      productName: pending.productName || "Farm product",
      name: pending.seller || "Farm seller",
      about: `About ${pending.productName || "this product"} · ${pending.county || "Kenya"}`,
      phone: pending.phone || "",
      messages: []
    };

    conversations.unshift(conversation);
  }

  activeConversationId = conversationId;

  if (
    conversation.messages.length === 0 &&
    typeof pending.message === "string"
  ) {
    initialDraft = pending.message;
  }

  saveConversations();
}

/* Render the contact list. */
function renderConversationList() {
  const list = document.querySelector("#conversationList");
  if (!list) return;

  list.innerHTML = conversations.map((conversation) => {
    const lastMessage =
      conversation.messages[conversation.messages.length - 1];

    const selected = conversation.id === activeConversationId;

    const preview = lastMessage
      ? lastMessage.text
      : conversation.productName
        ? `Product enquiry: ${conversation.productName}`
        : "Start a conversation";

    return `
      <button
        type="button"
        class="conversation-item ${selected ? "active" : ""}"
        data-conversation="${escapeMessage(conversation.id)}"
      >
        <span class="conversation-avatar">
          ${escapeMessage((conversation.name || "F").slice(0, 1).toUpperCase())}
        </span>

        <span class="conversation-summary">
          <strong>${escapeMessage(conversation.name || "Farm seller")}</strong>
          <small>${escapeMessage(preview)}</small>
        </span>
      </button>
    `;
  }).join("");
}

/* Render the selected chat. */
function renderActiveConversation() {
  const conversation = conversations.find(
    (item) => item.id === activeConversationId
  );

  const messageList = document.querySelector("#messageList");
  const title = document.querySelector("#conversationTitle");
  const subtitle = document.querySelector("#conversationSubtitle");
  const input = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendMessageButton");

  if (!messageList || !title || !subtitle || !input || !sendButton) {
    return;
  }

  if (!conversation) {
    title.textContent = "Choose a conversation";
    subtitle.textContent = "Select a sample contact to begin.";

    messageList.innerHTML = `
      <div class="message-empty">
        Select a conversation on the left, or open a chat from a product listing.
      </div>
    `;

    input.disabled = true;
    sendButton.disabled = true;
    return;
  }

  title.textContent = conversation.name || "Farm seller";
  subtitle.textContent = conversation.about || "MavunoBridge conversation";

  if (!conversation.messages.length) {
    messageList.innerHTML = `
      <div class="message-empty">
        This chat is ready. Send your enquiry below.
      </div>
    `;
  } else {
    messageList.innerHTML = conversation.messages.map((message) => {
      const mine = message.from === "me";

      return `
        <div class="message-row ${mine ? "mine" : "theirs"}">
          <div class="message-bubble">
            ${escapeMessage(message.text)}
            <small>${mine ? "You · demo" : "Demo contact"}</small>
          </div>
        </div>
      `;
    }).join("");
  }

  input.disabled = false;
  sendButton.disabled = false;
  messageList.scrollTop = messageList.scrollHeight;
}

/* Select an existing conversation. */
function selectConversation(id) {
  if (!conversations.some((item) => item.id === id)) return;

  activeConversationId = id;
  initialDraft = "";

  renderConversationList();
  renderActiveConversation();
}

/* Send a message to the local demo conversation. */
function sendDemoMessage(event) {
  event.preventDefault();

  const input = document.querySelector("#messageInput");

  const conversation = conversations.find(
    (item) => item.id === activeConversationId
  );

  if (!input || !conversation) return;

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  const newMessage = {
    from: "me",
    text: text.slice(0, 1000),
    sentAt: Date.now()
  };

  conversation.messages.push(newMessage);

  if (!saveConversations()) {
    conversation.messages.pop();

    alert(
      "Could not save this message. Browser storage may be full."
    );

    return;
  }

  input.value = "";
  initialDraft = "";

  renderConversationList();
  renderActiveConversation();
  input.focus();
}

function initMessages() {
  const list = document.querySelector("#conversationList");
  const form = document.querySelector("#messageForm");

  if (!list || !form) {
    console.error("Chat page elements are missing. Check messages.html.");
    return;
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation]");
    if (!button) return;

    selectConversation(button.dataset.conversation);
  });

  form.addEventListener("submit", sendDemoMessage);

  prepareProductChat();

  renderConversationList();
  renderActiveConversation();

  const input = document.querySelector("#messageInput");

  if (initialDraft && input && !input.disabled) {
    input.value = initialDraft;
    input.focus();
  }
}

document.addEventListener("DOMContentLoaded", initMessages);
