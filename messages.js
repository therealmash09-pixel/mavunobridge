"use strict";

/* ==========================================
   MAVUNOBRIDGE — LIVE MESSAGING
   Real buyer-to-seller chat stored in Supabase.
   ========================================== */

(() => {
  const PENDING_CHAT_KEY = "mavunobridge_pending_chat_v1";
  const $ = selector => document.querySelector(selector);

  const db = window.mavunoDb;
  let me = null;
  let messages = [];
  const names = {};
  const drafts = new Map();
  let activeKey = null;
  let pendingText = "";
  let channel = null;

  const keyOf = (otherId, listingId, requestId) => `${otherId}|${listingId || ""}|${requestId || ""}`;
  const parseKey = key => { const [otherId, listingId, requestId] = key.split("|"); return { otherId, listingId: listingId || null, requestId: requestId || null }; };
  const displayName = id => names[id] || "MavunoBridge user";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function notice(message, linkText, href) {
    $("#conversationList").replaceChildren(el("p", "muted", message));
    if (linkText) {
      const link = el("a", "button button-green", linkText);
      link.href = href;
      $("#conversationList").append(link);
    }
    $("#messageInput").disabled = true;
    $("#sendMessageButton").disabled = true;
  }

  function buildConversations() {
    const map = new Map();
    messages.forEach(message => {
      const otherId = message.sender_id === me ? message.recipient_id : message.sender_id;
      const key = keyOf(otherId, message.listing_id, message.request_id);
      let conversation = map.get(key);
      if (!conversation) {
        conversation = { key, otherId, listingId: message.listing_id, requestId: message.request_id, context: "", last: null, unread: 0 };
        map.set(key, conversation);
      }
      if (message.context) conversation.context = message.context;
      conversation.last = message;
      if (message.recipient_id === me && !message.read_at) conversation.unread += 1;
    });
    drafts.forEach((draft, key) => { if (!map.has(key)) map.set(key, { ...draft, key, last: null, unread: 0 }); });
    return [...map.values()].sort((a, b) =>
      Date.parse(b.last?.created_at || Date.now()) - Date.parse(a.last?.created_at || Date.now()));
  }

  function renderList() {
    const list = $("#conversationList");
    list.replaceChildren();
    const conversations = buildConversations();
    if (!conversations.length) {
      list.append(el("p", "muted", "No conversations yet. Open a listing in the marketplace and tap “Chat with seller”."));
      return;
    }
    conversations.forEach(conversation => {
      const button = el("button", "conversation-item" + (conversation.key === activeKey ? " active" : ""));
      button.type = "button";
      const avatar = el("span", "conversation-avatar", displayName(conversation.otherId).slice(0, 1).toUpperCase());
      const summary = el("span", "conversation-summary");
      const title = el("strong", "", displayName(conversation.otherId));
      const preview = el("small", "", conversation.last ? conversation.last.body : `About: ${conversation.context || "a listing"}`);
      summary.append(title, preview);
      button.append(avatar, summary);
      if (conversation.unread) {
        const dot = el("span", "", String(conversation.unread));
        dot.style.cssText = "background:#c0392b;color:#fff;border-radius:999px;padding:1px 7px;font-size:.72rem;font-weight:800;margin-left:auto";
        button.append(dot);
      }
      button.addEventListener("click", () => selectConversation(conversation.key));
      list.append(button);
    });
  }

  function renderActive() {
    const list = $("#messageList");
    const input = $("#messageInput");
    const send = $("#sendMessageButton");
    const conversation = buildConversations().find(item => item.key === activeKey);

    if (!conversation) {
      $("#conversationTitle").textContent = "Choose a conversation";
      $("#conversationSubtitle").textContent = "Select a conversation on the left.";
      list.replaceChildren(el("div", "message-empty", "Select a conversation on the left."));
      input.disabled = true;
      send.disabled = true;
      return;
    }

    $("#conversationTitle").textContent = displayName(conversation.otherId);
    $("#conversationSubtitle").textContent = conversation.context ? `About: ${conversation.context}` : "Direct message";

    const thread = messages.filter(message =>
      keyOf(message.sender_id === me ? message.recipient_id : message.sender_id, message.listing_id, message.request_id) === activeKey);

    list.replaceChildren();
    if (!thread.length) {
      list.append(el("div", "message-empty", "Your chat is ready. Say hello to start."));
    } else {
      thread.forEach(message => {
        const mine = message.sender_id === me;
        const row = el("div", "message-row " + (mine ? "mine" : "theirs"));
        const bubble = el("div", "message-bubble", message.body);
        const meta = el("small", "", (mine ? "You" : displayName(message.sender_id)) + " · " +
          new Date(message.created_at).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }));
        bubble.append(meta);
        row.append(bubble);
        list.append(row);
      });
    }
    input.disabled = false;
    send.disabled = false;
    list.scrollTop = list.scrollHeight;
  }

  async function markConversationRead(key) {
    const unreadIds = messages
      .filter(message => message.recipient_id === me && !message.read_at &&
        keyOf(message.sender_id, message.listing_id, message.request_id) === key)
      .map(message => message.id);
    if (!unreadIds.length) return;
    const now = new Date().toISOString();
    const { error } = await db.from("messages").update({ read_at: now }).in("id", unreadIds);
    if (error) { console.warn("Could not mark messages read", error); return; }
    messages.forEach(message => { if (unreadIds.includes(message.id)) message.read_at = now; });

    const { otherId } = parseKey(key);
    await db.from("notifications").update({ read_at: now })
      .eq("type", "message").is("read_at", null).like("link", `messages.html?with=${otherId}%`);
    window.dispatchEvent(new Event("mb:refresh-notifications"));
    renderList();
  }

  function selectConversation(key) {
    activeKey = key;
    renderList();
    renderActive();
    markConversationRead(key);
    if (pendingText && !$("#messageInput").disabled) {
      $("#messageInput").value = pendingText;
      pendingText = "";
    }
    $("#messageInput").focus();
  }

  async function loadNames(ids) {
    const missing = [...new Set(ids)].filter(id => id && !names[id]);
    if (!missing.length) return;
    const { data } = await db.from("profiles").select("id,display_name").in("id", missing);
    (data || []).forEach(profile => { names[profile.id] = profile.display_name || "MavunoBridge user"; });
  }

  async function sendMessage(event) {
    event.preventDefault();
    const input = $("#messageInput");
    const body = input.value.trim();
    if (!body || !activeKey) return;
    const { otherId, listingId, requestId } = parseKey(activeKey);
    const conversation = buildConversations().find(item => item.key === activeKey);

    const send = $("#sendMessageButton");
    send.disabled = true;
    const { data, error } = await db.from("messages").insert({
      sender_id: me,
      recipient_id: otherId,
      listing_id: listingId,
      request_id: requestId,
      context: conversation?.context || null,
      body
    }).select("*").single();
    send.disabled = false;

    if (error) {
      console.error("Message failed", error);
      alert("Could not send your message: " + error.message);
      return;
    }
    input.value = "";
    messages.push(data);
    drafts.delete(activeKey);
    renderList();
    renderActive();
  }

  function subscribe() {
    if (channel) db.removeChannel(channel);
    channel = db.channel("mb-messages-" + me)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${me}` },
        async payload => {
          const message = payload.new;
          if (messages.some(item => item.id === message.id)) return;
          await loadNames([message.sender_id]);
          messages.push(message);
          const key = keyOf(message.sender_id, message.listing_id, message.request_id);
          renderList();
          if (key === activeKey) { renderActive(); markConversationRead(key); }
        })
      .subscribe();
  }

  async function resolveRequestedConversation() {
    const params = new URLSearchParams(window.location.search);
    let otherId = params.get("with");
    let listingId = params.get("listing");
    let requestId = params.get("request");
    let context = "";

    let pending = null;
    try { pending = JSON.parse(localStorage.getItem(PENDING_CHAT_KEY) || "null"); } catch (_) { /* ignore */ }
    if (!otherId && pending && pending.sellerId) {
      otherId = pending.sellerId;
      listingId = pending.productId || null;
      context = pending.productName || "";
      pendingText = pending.message || "";
    }
    if (pending) { try { localStorage.removeItem(PENDING_CHAT_KEY); } catch (_) { /* ignore */ } }
    if (!otherId || otherId === me) return null;

    if (!context && listingId) {
      const { data } = await db.from("listings").select("product_name").eq("id", listingId).maybeSingle();
      context = data?.product_name || "";
    }
    if (!context && requestId) {
      const { data } = await db.from("buyer_requests").select("product").eq("id", requestId).maybeSingle();
      context = data?.product || "";
    }
    await loadNames([otherId]);

    const key = keyOf(otherId, listingId, requestId);
    if (!messages.some(message => keyOf(message.sender_id === me ? message.recipient_id : message.sender_id, message.listing_id, message.request_id) === key)) {
      drafts.set(key, { otherId, listingId, requestId, context });
    }
    return key;
  }

  async function init() {
    $("#messageForm")?.addEventListener("submit", sendMessage);
    $("#typingIndicator")?.classList.add("hidden");

    if (!db) { notice("Could not connect to the database. Please refresh the page."); return; }

    const { data: sessionData } = await db.auth.getSession();
    if (!sessionData?.session) {
      notice("Please sign in to send and read messages.", "Sign in", "login.html");
      return;
    }
    me = sessionData.session.user.id;

    const { data, error } = await db.from("messages").select("*")
      .or(`sender_id.eq.${me},recipient_id.eq.${me}`)
      .order("created_at", { ascending: true }).limit(500);
    if (error) {
      console.error(error);
      notice("Could not load your messages: " + error.message);
      return;
    }
    messages = data || [];
    await loadNames(messages.map(message => message.sender_id === me ? message.recipient_id : message.sender_id));

    const requested = await resolveRequestedConversation();
    renderList();
    renderActive();
    subscribe();

    if (requested) selectConversation(requested);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
