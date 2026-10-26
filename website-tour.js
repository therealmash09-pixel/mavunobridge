
/* ==========================================================
   MAVUNOBRIDGE — LIGHTWEIGHT FARMER TOUR
   Features:
   - Four selectable farmer avatars
   - English, Sheng-English and Kiswahili
   - Optional text-to-speech
   - Animated farmer expressions
   - Skippable, restartable website tour
   - Smart Assist welcome card
   - Responsive positioning
   - No external libraries
   - No automatic heavy startup
   ========================================================== */

(() => {
  "use strict";

  if (window.__mavunoLightTourLoaded) return;
  window.__mavunoLightTourLoaded = true;

  const STORAGE = {
    avatar: "mavunobridge_tour_avatar",
    language: "mavunobridge_tour_language",
    voice: "mavunobridge_tour_voice",
    completed: "mavunobridge_tour_completed"
  };

  const state = {
    avatar: localStorage.getItem(STORAGE.avatar) || "woman1",
    language: localStorage.getItem(STORAGE.language) || "mix",
    voice: localStorage.getItem(STORAGE.voice) !== "off",
    step: 0,
    running: false,
    speaking: false,
    speechToken: 0,
    expressionTimer: null,
    resizeTimer: null
  };

  const avatars = {
    woman1: { name: "Akinyi", type: "woman", skin: "#8b563b", shirt: "#477b43", hair: "#30201b" },
    woman2: { name: "Wanjiku", type: "woman", skin: "#bd8059", shirt: "#d6a447", hair: "#30201b" },
    man1:   { name: "Kamau", type: "man", skin: "#75452f", shirt: "#477b43", hair: "#211a16" },
    man2:   { name: "Otieno", type: "man", skin: "#a96c49", shirt: "#397c91", hair: "#211a16" }
  };

  const words = {
    en: {
      launch: "Meet your farmer guide",
      start: "Start website tour",
      title: "Karibu to MavunoBridge!",
      subtitle: "Your farm-to-market connection.",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish tour",
      restart: "Restart tour",
      avatar: "Choose your farmer",
      language: "Guide language",
      voice: "Voice narration",
      voiceOn: "On",
      voiceOff: "Off",
      close: "Close",
      stepLabel: "Step",
      done: "You're ready to explore!",
      doneText: "Discover farm products, connect with farmers and explore Smart Assist.",
      smartTitle: "Meet Smart Assist",
      smartText: "Your digital farming companion can help you explore crop ideas, farming tips and available guidance.",
      smartButton: "Explore Smart Assist",
      steps: [
        ["Welcome to MavunoBridge", "Discover a marketplace connecting farmers and buyers across Kenya. This quick tour shows you the main features."],
        ["Explore the marketplace", "Browse agricultural products, explore categories and compare listings. Use search and filters to find what you need."],
        ["Discover farm categories", "Explore fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs and equipment."],
        ["Sell your harvest", "Open the listing form, add your product details and follow the available steps to showcase your harvest."],
        ["Meet Smart Assist", "Visit Smart Assist to explore farming guidance, crop ideas and helpful information for farmers."],
        ["Your farming community", "Explore SACCO Hub and discover the community and opportunities available in your demo."],
        ["You're ready!", "You're all set. Explore MavunoBridge and discover how technology can help connect farms to markets."]
      ]
    },

    mix: {
      launch: "Meet your farmer guide",
      start: "Anza website tour",
      title: "Karibu MavunoBridge!",
      subtitle: "Connecting shamba na soko.",
      next: "Endelea",
      back: "Rudi",
      skip: "Skip tour",
      finish: "Maliza tour",
      restart: "Anza tour tena",
      avatar: "Chagua farmer wako",
      language: "Lugha ya guide",
      voice: "Voice narration",
      voiceOn: "On",
      voiceOff: "Off",
      close: "Close",
      stepLabel: "Step",
      done: "Uko ready ku-explore!",
      doneText: "Angalia mazao, connect na farmers, na explore Smart Assist.",
      smartTitle: "Meet Smart Assist",
      smartText: "Your digital farming companion inakusaidia ku-explore crop ideas, farming tips na guidance.",
      smartButton: "Explore Smart Assist",
      steps: [
        ["Karibu MavunoBridge!", "Hii ni marketplace inayoconnect farmers na buyers across Kenya. Let's explore vile inawork."],
        ["Explore marketplace", "Browse agricultural products, check categories na compare listings. Tumia search na filters kupata unatafuta."],
        ["Farm categories", "Explore fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs na equipment."],
        ["Sell your harvest", "Open listing form, ongeza product details, then follow the steps kuonyesha harvest yako."],
        ["Meet Smart Assist", "Visit Smart Assist kupata farming guidance, crop ideas na helpful information."],
        ["SACCO Hub", "Explore SACCO Hub kuona community na opportunities zilizowekwa kwa demo yako."],
        ["Uko ready!", "Sasa ni time ya ku-explore MavunoBridge. Let technology help connect shamba na soko!"]
      ]
    },

    sw: {
      launch: "Kutana na mwongozo wako",
      start: "Anza ziara ya tovuti",
      title: "Karibu MavunoBridge!",
      subtitle: "Kuunganisha wakulima na masoko.",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza ziara",
      restart: "Anza ziara tena",
      avatar: "Chagua mkulima wako",
      language: "Lugha ya mwongozo",
      voice: "Mwongozo wa sauti",
      voiceOn: "Washa",
      voiceOff: "Zima",
      close: "Funga",
      stepLabel: "Hatua",
      done: "Uko tayari kuchunguza!",
      doneText: "Gundua mazao, wasiliana na wakulima na ujaribu Smart Assist.",
      smartTitle: "Kutana na Smart Assist",
      smartText: "Msaidizi wa kilimo anaweza kukusaidia kuchunguza mawazo ya mazao na ushauri wa kilimo.",
      smartButton: "Fungua Smart Assist",
      steps: [
        ["Karibu MavunoBridge!", "Hii ni soko la kidijitali linalounganisha wakulima na wanunuzi kote Kenya. Tuanze ziara fupi."],
        ["Chunguza soko", "Tazama bidhaa za kilimo, chunguza makundi na linganisha bidhaa. Tumia utafutaji na vichujio."],
        ["Makundi ya bidhaa", "Chunguza matunda, mboga, nafaka, mikunde, karanga, viungo, mifugo, pembejeo na vifaa vya kilimo."],
        ["Uza mazao yako", "Fungua fomu ya bidhaa, weka maelezo na ufuate hatua za kuonyesha mazao yako."],
        ["Smart Assist", "Tembelea Smart Assist kuchunguza mawazo ya mazao na taarifa muhimu za kilimo."],
        ["SACCO Hub", "Chunguza SACCO Hub na nafasi zilizowekwa kwenye toleo hili la majaribio."],
        ["Uko tayari!", "Sasa unaweza kuchunguza MavunoBridge na kuona jinsi teknolojia inavyoweza kusaidia wakulima kupata masoko."]
      ]
    }
  };

  const t = () => words[state.language] || words.mix;

  const stepTargets = [
    null,
    ["#marketplace", "#listingGrid", ".marketplace", ".product-grid", "#products", "#marketplaceGrid"],
    ["#categories", ".category-grid", ".categories", "#categoryGrid"],
    ["#sellButton", "#heroSellButton", "#listingForm", "#sellForm", ".sell-section"],
    ["a[href*='smart-assist']", "#smartAssist", ".smart-assist", "#smart-assist"],
    ["a[href*='sacco']", "#saccoHub", ".sacco-hub", "#sacco"],
    null
  ];

  function safeGet(selector) {
    try {
      return document.querySelector(selector);
    } catch (_) {
      return null;
    }
  }

  function findTarget(index) {
    const selectors = stepTargets[index];
    if (!selectors) return null;

    for (const selector of selectors) {
      const element = safeGet(selector);
      if (element && element.getClientRects().length) return element;
    }

    return null;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function farmerSVG(id, expression = "normal") {
    const a = avatars[id] || avatars.woman1;
    const mouth = expression === "talk" ? "M43 57 Q50 68 57 57" :
                  expression === "happy" ? "M42 56 Q50 67 58 56" :
                  expression === "surprised" ? "M46 56 Q50 62 54 56" :
                  "M44 58 Q50 61 56 58";

    const hair = a.type === "woman"
      ? `<path d="M27 39 Q24 10 50 12 Q77 10 73 42 L70 67 Q64 45 65 30 Q49 19 34 32 L31 66Z" fill="${a.hair}"/>`
      : `<path d="M29 37 Q29 12 50 13 Q72 12 72 37 L65 30 Q50 25 35 31Z" fill="${a.hair}"/>`;

    return `
      <svg viewBox="0 0 100 112" role="img"
           aria-label="${escapeHTML(a.name)}, farmer guide"
           xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="103" rx="31" ry="6" fill="#173b26" opacity=".12"/>
        <path d="M23 103 Q25 75 39 73 L61 73 Q76 77 78 103Z"
              fill="${a.shirt}"/>
        <path d="M39 73 L50 86 L61 73" fill="#fff" opacity=".8"/>
        <path d="M44 64 L44 78 L56 78 L56 64" fill="${a.skin}"/>
        <ellipse cx="50" cy="45" rx="23" ry="28" fill="${a.skin}"/>
        ${hair}
        <path d="M26 34 Q50 2 76 33 L72 40 Q50 24 29 41Z" fill="#3e6636"/>
        <path d="M22 35 Q50 22 78 35 L75 40 Q50 31 25 40Z" fill="#d3a44b"/>
        <circle cx="41" cy="46" r="2.5" fill="#30201b"/>
        <circle cx="59" cy="46" r="2.5" fill="#30201b"/>
        <path d="${mouth}" stroke="#522b23" stroke-width="2.2"
              stroke-linecap="round" fill="none"/>
        <circle cx="33" cy="53" r="4" fill="#d98171" opacity=".25"/>
        <circle cx="67" cy="53" r="4" fill="#d98171" opacity=".25"/>
        <path d="M34 38 Q40 34 45 38 M55 38 Q61 34 66 38"
              stroke="#30201b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M20 91 Q8 77 13 67" stroke="${a.skin}" stroke-width="9" stroke-linecap="round" fill="none"/>
        <circle cx="13" cy="65" r="5" fill="${a.skin}"/>
        <path d="M13 65 L8 59 M13 65 L18 59" stroke="${a.skin}" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
  }

  function injectStyles() {
    if (document.getElementById("mb-light-tour-styles")) return;

    const style = document.createElement("style");
    style.id = "mb-light-tour-styles";
    style.textContent = `
      #mbTourLauncher {
        position:fixed;left:18px;bottom:18px;z-index:9990;
        display:flex;align-items:center;gap:9px;
        border:0;border-radius:999px;padding:10px 16px 10px 10px;
        background:#214b31;color:white;font:600 13px/1.2 system-ui,sans-serif;
        box-shadow:0 5px 22px #142b1b35;cursor:pointer;
        transition:transform .2s,box-shadow .2s;
      }
      #mbTourLauncher:hover {transform:translateY(-3px);box-shadow:0 8px 25px #142b1b40}
      #mbTourLauncher .mb-mini-farmer {width:34px;height:34px;display:block}
      #mbTourLauncher .mb-mini-farmer svg {width:100%;height:100%}

      #mbTourShade {
        position:fixed;inset:0;z-index:9991;
        background:rgba(14,28,19,.36);
        backdrop-filter:blur(2px);
      }
      #mbTourCard {
        position:fixed;z-index:9992;right:20px;bottom:20px;
        width:min(390px,calc(100vw - 28px));
        max-height:calc(100dvh - 30px);overflow:auto;
        padding:19px;border-radius:22px;background:#fff;color:#203b2a;
        box-shadow:0 18px 65px #102b1d38;
        border:1px solid #e0eadf;
        font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        animation:mbTourEnter .24s ease-out;
      }
      @keyframes mbTourEnter {
        from {opacity:0;transform:translateY(12px) scale(.985)}
        to {opacity:1;transform:translateY(0) scale(1)}
      }
      #mbTourCard * {box-sizing:border-box}
      #mbTourCard button,#mbTourCard select {font:inherit}
      #mbTourCard button {cursor:pointer}
      #mbTourCard .mb-tour-top {display:flex;align-items:center;gap:12px}
      #mbTourCard .mb-tour-farmer {
        width:75px;height:83px;flex:0 0 75px;
        border-radius:18px;background:#edf5e9;overflow:hidden;
        animation:mbFarmerFloat 3s ease-in-out infinite;
      }
      #mbTourCard .mb-tour-farmer svg {width:100%;height:100%}
      @keyframes mbFarmerFloat {
        0%,100% {transform:translateY(0)}
        50% {transform:translateY(-3px)}
      }
      #mbTourCard .mb-tour-eyebrow {
        color:#58815d;font-size:11px;font-weight:800;
        letter-spacing:.09em;text-transform:uppercase;
      }
      #mbTourCard .mb-tour-heading {font-size:19px;line-height:1.2;margin:5px 0;font-weight:800}
      #mbTourCard .mb-tour-subtitle {font-size:12px;color:#657769;line-height:1.4}
      #mbTourCard .mb-tour-close {
        margin-left:auto;align-self:flex-start;border:0;background:#f1f5ef;
        color:#37543e;width:31px;height:31px;border-radius:50%;font-size:18px;
      }
      #mbTourCard .mb-tour-progress {display:flex;gap:5px;margin:17px 0 14px}
      #mbTourCard .mb-tour-progress span {height:4px;flex:1;border-radius:8px;background:#e6ece4}
      #mbTourCard .mb-tour-progress span.active {background:#4b8b4c}
      #mbTourCard .mb-tour-step {font-size:10px;font-weight:800;color:#608364;text-transform:uppercase;letter-spacing:.08em}
      #mbTourCard .mb-tour-copy-title {font-size:18px;font-weight:800;margin:7px 0;color:#203b2a}
      #mbTourCard .mb-tour-copy {font-size:13px;line-height:1.65;color:#536557;margin:0}
      #mbTourCard .mb-tour-settings {
        display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px;
      }
      #mbTourCard .mb-tour-field label {display:block;font-size:11px;font-weight:700;color:#526a56;margin-bottom:5px}
      #mbTourCard .mb-tour-field select {
        width:100%;min-width:0;border:1px solid #dbe5d8;border-radius:10px;
        padding:8px;background:#f9fbf8;color:#29442f;font-size:12px;
      }
      #mbTourCard .mb-tour-voice {
        display:flex;align-items:center;justify-content:space-between;
        gap:8px;margin-top:12px;padding:9px 11px;border-radius:11px;background:#f5f8f3;
        font-size:12px;font-weight:650;
      }
      #mbTourCard .mb-tour-voice button {
        border:0;border-radius:99px;padding:6px 11px;
        background:#e0eddb;color:#2e6237;font-size:11px;font-weight:800;
      }
      #mbTourCard .mb-tour-actions {display:flex;align-items:center;gap:8px;margin-top:17px}
      #mbTourCard .mb-tour-actions button {
        border:0;border-radius:11px;padding:10px 12px;font-size:12px;font-weight:800;
      }
      #mbTourCard .mb-tour-primary {background:#2e6b3b;color:#fff;flex:1}
      #mbTourCard .mb-tour-secondary {background:#edf3ea;color:#36553c}
      #mbTourCard .mb-tour-skip {border:0;background:transparent;color:#6b7d6d;font-size:11px;padding:8px 0}
      #mbTourCard .mb-tour-avatar-row {display:flex;gap:7px;margin-top:12px}
      #mbTourCard .mb-tour-avatar {
        flex:1;min-width:0;border:1px solid #dfe8dc;border-radius:12px;
        background:#fafcf9;padding:6px 3px;color:#435d47;font-size:10px;font-weight:700;
      }
      #mbTourCard .mb-tour-avatar svg {display:block;width:39px;height:43px;margin:0 auto 3px}
      #mbTourCard .mb-tour-avatar.selected {border:2px solid #4b8b4c;background:#eff7eb;padding:5px 2px}
      #mbTourCard .mb-tour-note {font-size:10px;color:#7b8c7b;margin-top:10px;line-height:1.5}
      #mbTourCard .mb-tour-link {display:inline-block;margin-top:12px;color:#2d713d;font-size:12px;font-weight:800;text-decoration:none}
      #mbTourCard .mb-tour-link:hover {text-decoration:underline}
      #mbTourCard .mb-tour-speech {display:inline-block;width:6px;height:6px;border-radius:50%;background:#76a85e;margin-left:4px}
      @media(max-width:560px) {
        #mbTourLauncher {left:10px;bottom:10px;padding:8px 12px 8px 8px}
        #mbTourCard {left:10px!important;right:10px!important;bottom:58px!important;
          width:auto;max-height:calc(100dvh - 74px);padding:15px;border-radius:18px}
        #mbTourCard .mb-tour-farmer {width:64px;height:73px;flex-basis:64px}
        #mbTourCard .mb-tour-heading {font-size:17px}
        #mbTourCard .mb-tour-copy {font-size:12px}
      }
      @media(prefers-reduced-motion:reduce) {
        #mbTourCard *,#mbTourLauncher {animation:none!important;transition:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function makeLauncher() {
    if (document.getElementById("mbTourLauncher")) return;

    const button = document.createElement("button");
    button.id = "mbTourLauncher";
    button.type = "button";
    button.setAttribute("aria-label", "Open MavunoBridge website tour");
    button.innerHTML = `
      <span class="mb-mini-farmer">${farmerSVG(state.avatar)}</span>
      <span class="mb-tour-launch-text">${escapeHTML(t().launch)}</span>
    `;

    button.addEventListener("click", () => {
      state.step = 0;
      state.running = true;
      showCard();
      renderStep();
    });

    document.body.appendChild(button);
  }

  function syncLauncher() {
    const button = document.getElementById("mbTourLauncher");
    if (!button) return;

    button.querySelector(".mb-mini-farmer").innerHTML = farmerSVG(state.avatar);
    button.querySelector(".mb-tour-launch-text").textContent = t().launch;
  }

  function cardMarkup() {
    const text = t();

    return `
      <div class="mb-tour-top">
        <div class="mb-tour-farmer">${farmerSVG(state.avatar)}</div>
        <div>
          <div class="mb-tour-eyebrow">MavunoBridge • Farmer Guide</div>
          <div class="mb-tour-heading">${escapeHTML(text.title)}</div>
          <div class="mb-tour-subtitle">${escapeHTML(text.subtitle)}</div>
        </div>
        <button type="button" class="mb-tour-close" data-action="close"
                aria-label="${escapeHTML(text.close)}">×</button>
      </div>

      <div class="mb-tour-avatar-row" aria-label="${escapeHTML(text.avatar)}">
        ${Object.entries(avatars).map(([id, a]) => `
          <button type="button" class="mb-tour-avatar ${id === state.avatar ? "selected" : ""}"
                  data-avatar="${id}" aria-pressed="${id === state.avatar}">
            ${farmerSVG(id)}
            ${escapeHTML(a.name)}
          </button>
        `).join("")}
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        ${text.steps.map((_, i) => `<span data-progress="${i}"></span>`).join("")}
      </div>

      <div class="mb-tour-step" id="mbTourStepLabel"></div>
      <div class="mb-tour-copy-title" id="mbTourStepTitle"></div>
      <p class="mb-tour-copy" id="mbTourStepCopy"></p>

      <div class="mb-tour-settings">
        <div class="mb-tour-field">
          <label for="mbTourLanguage">${escapeHTML(text.language)}</label>
          <select id="mbTourLanguage">
            <option value="mix">Sheng + English</option>
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
          </select>
        </div>
        <div class="mb-tour-field">
          <label for="mbTourVoice">${escapeHTML(text.voice)}</label>
          <select id="mbTourVoice">
            <option value="on">${escapeHTML(text.voiceOn)}</option>
            <option value="off">${escapeHTML(text.voiceOff)}</option>
          </select>
        </div>
      </div>

      <div class="mb-tour-actions">
        <button type="button" class="mb-tour-secondary" data-action="back">${escapeHTML(text.back)}</button>
        <button type="button" class="mb-tour-primary" data-action="next">${escapeHTML(text.next)}</button>
      </div>
      <button type="button" class="mb-tour-skip" data-action="skip">${escapeHTML(text.skip)}</button>
      <div class="mb-tour-note">Made for Kenyan farmers and buyers • Demo experience</div>
    `;
  }

  function showCard() {
    injectStyles();

    if (!document.getElementById("mbTourShade")) {
      const shade = document.createElement("div");
      shade.id = "mbTourShade";
      shade.hidden = true;
      shade.addEventListener("click", closeTour);
      document.body.appendChild(shade);
    }

    let card = document.getElementById("mbTourCard");

    if (!card) {
      card = document.createElement("section");
      card.id = "mbTourCard";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "false");
      card.setAttribute("aria-label", "MavunoBridge website tour");
      card.hidden = true;
      document.body.appendChild(card);

      card.addEventListener("click", handleCardClick);
      card.addEventListener("change", handleCardChange);
    }

    card.innerHTML = cardMarkup();
    card.querySelector("#mbTourLanguage").value = state.language;
    card.querySelector("#mbTourVoice").value = state.voice ? "on" : "off";

    document.getElementById("mbTourShade").hidden = false;
    card.hidden = false;
    positionCard();
  }

  function handleCardClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.avatar) {
      state.avatar = button.dataset.avatar;
      localStorage.setItem(STORAGE.avatar, state.avatar);
      syncLauncher();
      showCard();
      renderStep();
      return;
    }

    switch (button.dataset.action) {
      case "close":
      case "skip":
        closeTour();
        break;

      case "back":
        if (state.step > 0) {
          state.step--;
          renderStep();
        }
        break;

      case "next":
        if (state.step < t().steps.length - 1) {
          state.step++;
          renderStep();
        } else {
          finishTour();
        }
        break;
    }
  }

  function handleCardChange(event) {
    if (event.target.id === "mbTourLanguage") {
      state.language = event.target.value;
      localStorage.setItem(STORAGE.language, state.language);
      syncLauncher();
      showCard();
      renderStep();
    }

    if (event.target.id === "mbTourVoice") {
      state.voice = event.target.value === "on";
      localStorage.setItem(STORAGE.voice, state.voice ? "on" : "off");

      if (!state.voice) stopSpeech();
      renderStep();
    }
  }

  function renderStep() {
    const card = document.getElementById("mbTourCard");
    if (!card || card.hidden) return;

    const text = t();
    const total = text.steps.length;
    const current = text.steps[state.step];
    const last = state.step === total - 1;

    card.querySelector("#mbTourStepLabel").textContent =
      `${text.stepLabel} ${state.step + 1} / ${total}`;

    card.querySelector("#mbTourStepTitle").textContent = current[0];
    card.querySelector("#mbTourStepCopy").textContent = current[1];

    card.querySelectorAll("[data-progress]").forEach((bar, index) => {
      bar.classList.toggle("active", index <= state.step);
    });

    card.querySelector('[data-action="back"]').disabled = state.step === 0;
    card.querySelector('[data-action="back"]').style.opacity =
      state.step === 0 ? ".45" : "1";

    card.querySelector('[data-action="next"]').textContent =
      last ? text.finish : text.next;

    card.querySelector(".mb-tour-farmer").innerHTML =
      farmerSVG(state.avatar, state.voice ? "talk" : "normal");

    positionCard();
    speak(current[1]);

    const target = findTarget(state.step);
    if (target && window.innerWidth > 700) {
      // Highlight gently without changing the target's styling.
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function positionCard() {
    const card = document.getElementById("mbTourCard");
    if (!card || card.hidden) return;

    // Default bottom-right; move left if it collides with the site's Guide.
    card.style.left = "";
    card.style.right = "";
    card.style.bottom = "";

    if (window.innerWidth <= 560) return;

    const guideSelectors = [
      "#mbGuidePanel", ".mb-guide-panel", "#guidePanel",
      ".guide-panel", ".guide-widget", "#guideWidget",
      ".floating-guide", ".floating-assistant", ".chat-widget",
      ".chatbot-container", "#guideButton", ".mb-guide-toggle",
      ".mb-guide-button", ".guide-button"
    ];

    const guide = guideSelectors.map(safeGet).find(element => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 &&
        style.display !== "none" && style.visibility !== "hidden";
    });

    if (!guide) return;

    const cardRect = card.getBoundingClientRect();
    const guideRect = guide.getBoundingClientRect();

    const overlaps = (a, b) =>
      a.left < b.right && a.right > b.left &&
      a.top < b.bottom && a.bottom > b.top;

    if (overlaps(cardRect, guideRect)) {
      card.style.left = "20px";
      card.style.right = "auto";

      requestAnimationFrame(() => {
        if (!card.isConnected || card.hidden) return;

        const newRect = card.getBoundingClientRect();
        if (overlaps(newRect, guideRect)) {
          card.style.left = "";
          card.style.right = "20px";
          card.style.bottom = `${Math.max(20, window.innerHeight - guideRect.top + 12)}px`;
        }
      });
    }
  }

  function stopSpeech() {
    state.speechToken++;
    state.speaking = false;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speak(message) {
    stopSpeech();

    if (!state.voice || !("speechSynthesis" in window)) return;

    const token = state.speechToken;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.lang = state.language === "sw" ? "sw-KE" : "en-KE";
    utterance.rate = 0.94;
    utterance.pitch = state.avatar.startsWith("woman") ? 1.08 : 0.92;

    // Available voices depend on the visitor's browser and device.
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(voice =>
      state.language === "sw"
        ? /sw|kiswahili/i.test(`${voice.lang} ${voice.name}`)
        : /en.ke|english.*kenya/i.test(`${voice.lang} ${voice.name}`)
    );

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      if (token !== state.speechToken) return;
      state.speaking = true;
      const farmer = document.querySelector("#mbTourCard .mb-tour-farmer");
      if (farmer) farmer.innerHTML = farmerSVG(state.avatar, "talk");
    };

    utterance.onend = () => {
      if (token !== state.speechToken) return;
      state.speaking = false;
      const farmer = document.querySelector("#mbTourCard .mb-tour-farmer");
      if (farmer) farmer.innerHTML = farmerSVG(state.avatar, "happy");
    };

    utterance.onerror = () => {
      state.speaking = false;
    };

    // Do not wait for voices to load or block the page.
    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      // Tour remains fully usable without speech.
    }
  }

  function closeTour() {
    state.running = false;
    stopSpeech();

    const card = document.getElementById("mbTourCard");
    const shade = document.getElementById("mbTourShade");

    if (card) card.hidden = true;
    if (shade) shade.hidden = true;
  }

  function finishTour() {
    localStorage.setItem(STORAGE.completed, "yes");
    closeTour();

    // Small completion message; no blocking alert.
    let toast = document.getElementById("mbTourToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mbTourToast";
      toast.style.cssText =
        "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);" +
        "z-index:9993;background:#214b31;color:#fff;padding:13px 18px;" +
        "border-radius:13px;box-shadow:0 8px 25px #102b1d30;" +
        "font:600 13px system-ui,sans-serif;max-width:90vw;text-align:center;";
      document.body.appendChild(toast);
    }

    toast.textContent = t().done;
    toast.hidden = false;

    // Hide the message on the next user interaction instead of running a timer.
    const hideToast = () => {
      toast.hidden = true;
      document.removeEventListener("pointerdown", hideToast);
      document.removeEventListener("keydown", hideToast);
    };

    document.addEventListener("pointerdown", hideToast, { once: true });
    document.addEventListener("keydown", hideToast, { once: true });
  }

  function smartAssistWelcome() {
    const path = location.pathname.toLowerCase();
    const isSmartAssist =
      path.includes("smart-assist") ||
      document.body.dataset.page === "smart-assist";

    if (!isSmartAssist || document.getElementById("mbSmartFarmer")) return;

    const host =
      safeGet("#smartAssist") ||
      safeGet("#smart-assist") ||
      safeGet(".smart-assist-container") ||
      safeGet("main") ||
      document.body;

    const welcome = document.createElement("aside");
    welcome.id = "mbSmartFarmer";
    welcome.style.cssText =
      "display:flex;align-items:center;gap:12px;margin:14px 0;padding:13px;" +
      "border:1px solid #dce9d7;border-radius:16px;background:#f3f8ef;" +
      "color:#24452c;font:13px/1.55 system-ui,sans-serif;";

    welcome.innerHTML = `
      <div style="width:68px;height:76px;flex:0 0 68px">
        ${farmerSVG(state.avatar, "happy")}
      </div>
      <div>
        <strong style="display:block;font-size:15px;margin-bottom:4px">
          ${escapeHTML(t().smartTitle)}
        </strong>
        <span>${escapeHTML(t().smartText)}</span>
        <div>
          <button type="button" id="mbSmartTourButton"
            style="margin-top:9px;border:0;border-radius:9px;padding:8px 11px;
            background:#2e6b3b;color:white;font-weight:700;cursor:pointer">
            ${escapeHTML(t().smartButton)}
          </button>
        </div>
      </div>
    `;

    const existingHeading = host.querySelector("h1, h2");
    if (existingHeading && existingHeading.parentElement) {
      existingHeading.parentElement.insertAdjacentElement("afterend", welcome);
    } else {
      host.prepend(welcome);
    }

    welcome.querySelector("#mbSmartTourButton").addEventListener("click", () => {
      state.step = 4;
      state.running = true;
      showCard();
      renderStep();
    });
  }

  function init() {
    injectStyles();
    makeLauncher();

    // Only one resize listener. No full-page MutationObserver or animation loop.
    window.addEventListener("resize", () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(positionCard, 120);
    }, { passive: true });

    // Smart Assist card is added only when the page is ready.
    smartAssistWelcome();

    // Deliberately do not auto-launch the tour.
    // Visitors can start it from the farmer button at the bottom-left.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // Optional functions for your existing buttons to call.
  window.MavunoBridgeTour = {
    start() {
      state.step = 0;
      state.running = true;
      showCard();
      renderStep();
    },
    restart() {
      localStorage.removeItem(STORAGE.completed);
      this.start();
    },
    close: closeTour
  };
})();
