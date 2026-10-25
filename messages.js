
"use strict";

/* =========================================
   MAVUNOBRIDGE — DEMO MESSAGES
   Messages stay in this browser only.
   ========================================= */

const MESSAGE_KEY = "mavunobridge_demo_messages_v1";

const initialConversations = [
  {
    id: "farm-1",
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
    id: "buyer-1",
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
    id: "group-1",
    name: "Farmer Connections",
    about: "Sample farming group",
    messages: [
      {
        from: "them",
        text: "Welcome to the demo conversation. Share farming ideas here."
      }
    ]
  }
];

let conversations = loadConversations();
let activeConversationId = null;

/* ---------- LOAD AND SAVE ---------- */

function loadConversations() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(MESSAGE_KEY) || "null"
    );

    return Array.isArray(saved) && saved.length > 0
      ? saved
      : JSON.parse(JSON.stringify(initialConversations));
  } catch (error) {
    console.warn("Could not load saved messages:", error);
    return JSON.parse(JSON.stringify(initialConversations));
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

/* ---------- SAFE DISPLAY ---------- */

function escapeMessage(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* ---------- CONVERSATION LIST ---------- */

function renderConversationList() {
  const list = document.querySelector("#conversationList");

  if (!list) return;

  list.innerHTML = conversations.map((conversation) => {
    const lastMessage =
      conversation.messages[conversation.messages.length - 1];

    const selected =
      conversation.id === activeConversationId;

    return `
      <button
        type="button"
        class="conversation-item ${selected ? "active" : ""}"
        data-conversation="${escapeMessage(conversation.id)}"
      >
        <span class="conversation-avatar">
          ${escapeMessage(conversation.name.slice(0, 1).toUpperCase())}
        </span>

        <span class="conversation-summary">
          <strong>${escapeMessage(conversation.name)}</strong>
          <small>
            ${escapeMessage(lastMessage ? lastMessage.text : "No messages yet")}
          </small>
        </span>
      </button>
    `;
  }).join("");
}

/* ---------- DISPLAY SELECTED CHAT ---------- */

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
        Select a conversation on the left.
      </div>
    `;

    input.disabled = true;
    sendButton.disabled = true;

    return;
  }

  title.textContent = conversation.name;
  subtitle.textContent = conversation.about;

  messageList.innerHTML = conversation.messages.map((message) => {
    const isMine = message.from === "me";

    return `
      <div class="message-row ${isMine ? "mine" : "theirs"}">
        <div class="message-bubble">
          ${escapeMessage(message.text)}
          <small>${isMine ? "You · demo" : "Demo contact"}</small>
        </div>
      </div>
    `;
  }).join("");

  messageList.scrollTop = messageList.scrollHeight;

  input.disabled = false;
  sendButton.disabled = false;
}

/* ---------- SELECT A CONVERSATION ---------- */

function selectConversation(id) {
  const exists = conversations.some(
    (conversation) => conversation.id === id
  );

  if (!exists) return;

  activeConversationId = id;

  renderConversationList();
  renderActiveConversation();
}

/* ---------- SEND A DEMO MESSAGE ---------- */

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
    text,
    sentAt: Date.now()
  };

  conversation.messages.push(newMessage);

  if (!saveConversations()) {
    conversation.messages.pop();

    alert(
      "Could not save this message. Check your browser storage and try again."
    );

    return;
  }

  input.value = "";

  renderConversationList();
  renderActiveConversation();
  input.focus();
}

/* ---------- INITIALISE ---------- */

function initMessages() {
  const list = document.querySelector("#conversationList");
  const form = document.querySelector("#messageForm");

  if (!list || !form) {
    console.error(
      "Messages page elements are missing. Check messages.html."
    );
    return;
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation]");

    if (!button) return;

    selectConversation(button.dataset.conversation);
  });

  form.addEventListener("submit", sendDemoMessage);

  renderConversationList();
  renderActiveConversation();
}

document.addEventListener("DOMContentLoaded", initMessages);
