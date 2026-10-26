
/* ==========================================================
   MAVUNOBRIDGE — COMPLETE LIGHTWEIGHT WEBSITE TOUR
   Four farmer characters • Voice profiles • Responsive tour
   English • Sheng-English • Kiswahili
   Smart Assist welcome • Skippable and restartable
   No external libraries • No heavy observers or animation loops
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
    resizeTimer: null
  };

  const avatars = {
    woman1: {
      name: "Akinyi",
      skin: "#8b563b",
      shirt: "#3f7848",
      hair: "#211914",
      style: "braids",
      accessory: "earrings",
      pitch: 1.12,
      rate: 0.92,
      voiceNames: /zira|samantha|karen|moira|female|woman/i
    },
    woman2: {
      name: "Wanjiku",
      skin: "#bd8059",
      shirt: "#c98b35",
      hair: "#30221c",
      style: "puff",
      accessory: "headwrap",
      pitch: 1.25,
      rate: 1.00,
      voiceNames: /victoria|serena|tessa|fiona|female|woman/i
    },
    man1: {
      name: "Kamau",
      skin: "#75452f",
      shirt: "#397a51",
      hair: "#201a17",
      style: "short",
      accessory: "beard",
      pitch: 0.87,
      rate: 0.91,
      voiceNames: /david|daniel|george|male|man/i
    },
    man2: {
      name: "Otieno",
      skin: "#a96c49",
      shirt: "#367b91",
      hair: "#201a17",
      style: "fade",
      accessory: "beard",
      pitch: 0.98,
      rate: 1.02,
      voiceNames: /mark|james|guy|thomas|male|man/i
    }
  };

  const words = {
    en: {
      launch: "Meet your farmer guide",
      title: "Welcome to MavunoBridge!",
      subtitle: "Your farm-to-market connection.",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish tour",
      close: "Close",
      stepLabel: "Step",
      avatar: "Choose your farmer",
      language: "Guide language",
      voice: "Voice narration",
      voiceOn: "On",
      voiceOff: "Off",
      smartTitle: "Meet Smart Assist",
      smartText: "Your digital farming companion can help you explore crop ideas, farming tips and useful information.",
      smartButton: "Explore Smart Assist",
      done: "You're ready to explore MavunoBridge!",
      steps: [
        ["Welcome to MavunoBridge", "Discover a marketplace connecting farmers and buyers across Kenya. This quick tour introduces the main features."],
        ["Explore the marketplace", "Browse agricultural products, explore categories and compare listings. Use search and filters to find what you need."],
        ["Discover farm categories", "Explore fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs and equipment."],
        ["Sell your harvest", "Open the listing form, add your product details and follow the available steps to showcase your harvest."],
        ["Meet Smart Assist", "Explore farming guidance, crop ideas and useful information for farmers on the Smart Assist page."],
        ["Discover SACCO Hub", "Explore SACCO Hub and the community opportunities included in this demo."],
        ["You're ready!", "You're all set. Explore MavunoBridge and see how technology can help connect farms to markets."]
      ]
    },

    mix: {
      launch: "Meet your farmer guide",
      title: "Karibu MavunoBridge!",
      subtitle: "Connecting shamba na soko.",
      next: "Endelea",
      back: "Rudi",
      skip: "Skip tour",
      finish: "Maliza tour",
      close: "Close",
      stepLabel: "Step",
      avatar: "Chagua farmer wako",
      language: "Lugha ya guide",
      voice: "Voice narration",
      voiceOn: "On",
      voiceOff: "Off",
      smartTitle: "Meet Smart Assist",
      smartText: "Your digital farming companion inakusaidia ku-explore crop ideas, farming tips na useful information.",
      smartButton: "Explore Smart Assist",
      done: "Uko ready ku-explore MavunoBridge!",
      steps: [
        ["Karibu MavunoBridge!", "Hii ni marketplace inayoconnect farmers na buyers across Kenya. Let's explore vile inawork."],
        ["Explore marketplace", "Browse agricultural products, check categories na compare listings. Tumia search na filters kupata unatafuta."],
        ["Farm categories", "Explore fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs na equipment."],
        ["Sell your harvest", "Open listing form, ongeza product details, then follow the steps kuonyesha harvest yako."],
        ["Meet Smart Assist", "Visit Smart Assist kupata farming guidance, crop ideas na useful information for farmers."],
        ["SACCO Hub", "Explore SACCO Hub kuona community na opportunities zilizowekwa kwa demo yako."],
        ["Uko ready!", "Sasa ni time ya ku-explore MavunoBridge. Let technology help connect shamba na soko!"]
      ]
    },

    sw: {
      launch: "Kutana na mwongozo wako",
      title: "Karibu MavunoBridge!",
      subtitle: "Kuunganisha wakulima na masoko.",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza ziara",
      close: "Funga",
      stepLabel: "Hatua",
      avatar: "Chagua mkulima wako",
      language: "Lugha ya mwongozo",
      voice: "Mwongozo wa sauti",
      voiceOn: "Washa",
      voiceOff: "Zima",
      smartTitle: "Kutana na Smart Assist",
      smartText: "Msaidizi wa kilimo anaweza kukusaidia kuchunguza mawazo ya mazao, ushauri wa kilimo na taarifa muhimu.",
      smartButton: "Fungua Smart Assist",
      done: "Uko tayari kuchunguza MavunoBridge!",
      steps: [
        ["Karibu MavunoBridge!", "Hii ni soko la kidijitali linalounganisha wakulima na wanunuzi kote Kenya. Tuanze ziara fupi."],
        ["Chunguza soko", "Tazama bidhaa za kilimo, chunguza makundi na linganisha bidhaa. Tumia utafutaji na vichujio."],
        ["Makundi ya bidhaa", "Chunguza matunda, mboga, nafaka, mikunde, karanga, viungo, mifugo, pembejeo na vifaa vya kilimo."],
        ["Uza mazao yako", "Fungua fomu ya bidhaa, weka maelezo na ufuate hatua za kuonyesha mazao yako."],
        ["Smart Assist", "Tembelea Smart Assist kuchunguza mawazo ya mazao na taarifa muhimu za kilimo."],
        ["SACCO Hub", "Chunguza SACCO Hub na nafasi zilizowekwa kwenye toleo hili la majaribio."],
        ["Uko tayari!", "Sasa unaweza kuchunguza MavunoBridge na kuona jinsi teknolojia inavyoweza kuwasaidia wakulima kupata masoko."]
      ]
    }
  };

  const t = () => words[state.language] || words.mix;

  const stepTargets = [
    null,
    ["#marketplace", "#listingGrid", ".marketplace", ".product-grid", "#products", "#marketplaceGrid"],
    ["#categories", ".category-grid", ".categories", "#categoryGrid"],
    ["#sellButton", "#heroSellButton", "#listingForm", "#sellForm", ".sell-section"],
    ["#smartAssist", "#smart-assist", ".smart-assist", "a[href*='smart-assist']"],
    ["#saccoHub", "#sacco", ".sacco-hub", "a[href*='sacco']"],
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

  /* ----------------------------------------------------------
     FOUR DISTINCT FARMER ILLUSTRATIONS
     ---------------------------------------------------------- */

  function farmerSVG(id, expression = "normal") {
    const a = avatars[id] || avatars.woman1;

    const mouth = expression === "talk"
      ? `<ellipse cx="50" cy="57" rx="5" ry="6" fill="#522b23"/>
         <path d="M46 57 Q50 60 54 57" stroke="#fff" stroke-width="1.5" fill="none"/>`
      : expression === "happy"
      ? `<path d="M42 55 Q50 66 58 55 Q50 69 42 55" fill="#6d3029"/>`
      : expression === "surprised"
      ? `<ellipse cx="50" cy="57" rx="3.5" ry="5" fill="#522b23"/>`
      : `<path d="M44 57 Q50 60 56 57" stroke="#522b23"
             stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

    let hairstyle = "";

    if (a.style === "braids") {
      hairstyle = `
        <path d="M28 43 Q22 13 49 12 Q77 11 72 43
                 L69 72 L63 66 L65 38
                 Q49 23 34 38 L36 68 L30 73Z"
              fill="${a.hair}"/>
        <path d="M31 35 Q26 49 31 62
                 M36 29 Q31 47 37 59
                 M65 30 Q70 47 64 60
                 M70 37 Q75 51 68 63"
              stroke="#493126" stroke-width="3"
              stroke-linecap="round" fill="none"/>
        <circle cx="30" cy="68" r="3" fill="#d9a34a"/>
        <circle cx="68" cy="67" r="3" fill="#d9a34a"/>
      `;
    } else if (a.style === "puff") {
      hairstyle = `
        <circle cx="35" cy="24" r="12" fill="${a.hair}"/>
        <circle cx="46" cy="17" r="13" fill="${a.hair}"/>
        <circle cx="59" cy="19" r="13" fill="${a.hair}"/>
        <circle cx="68" cy="28" r="10" fill="${a.hair}"/>
        <path d="M27 43 Q24 24 39 26
                 Q50 20 63 27 Q75 30 73 46
                 L68 66 L63 35 Q49 28 35 37 L32 66Z"
              fill="${a.hair}"/>
        <path d="M28 31 Q50 20 72 31
                 L76 39 Q50 31 25 40Z"
              fill="#a65e3c"/>
        <path d="M29 35 Q50 29 72 35"
              stroke="#f0c27b" stroke-width="3" fill="none"/>
      `;
    } else if (a.style === "short") {
      hairstyle = `
        <path d="M28 41 Q25 12 50 12
                 Q75 12 72 41 L66 34
                 Q50 25 34 34Z"
              fill="${a.hair}"/>
        <path d="M34 30 Q49 23 65 30"
              stroke="#493126" stroke-width="2" fill="none"/>
      `;
    } else {
      hairstyle = `
        <path d="M28 39 Q28 14 50 13
                 Q73 14 72 39 L66 31
                 Q50 25 34 32Z"
              fill="${a.hair}"/>
        <path d="M32 27 Q50 19 68 27"
              stroke="#493126" stroke-width="2" fill="none"/>
        <path d="M31 38 L27 48 M69 38 L73 48"
              stroke="${a.hair}" stroke-width="4"
              stroke-linecap="round"/>
      `;
    }

    const headwear = a.accessory === "headwrap"
      ? `<path d="M25 34 Q50 19 75 34 L72 41 Q50 31 28 41Z" fill="#694d8d"/>
         <path d="M32 31 Q50 25 68 31" stroke="#e5c5f0" stroke-width="3" fill="none"/>`
      : "";

    const facialHair = a.accessory === "beard"
      ? `<path d="M32 55 Q33 72 50 76 Q67 72 68 55
                 L61 61 Q50 66 39 61Z" fill="${a.hair}"/>`
      : "";

    const earrings = a.accessory === "earrings"
      ? `<circle cx="27" cy="51" r="3" fill="#e6bd57"/>
         <circle cx="73" cy="51" r="3" fill="#e6bd57"/>`
      : "";

    return `
      <svg viewBox="0 0 100 112" role="img"
           aria-label="${escapeHTML(a.name)}, farmer guide"
           xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="105" rx="29" ry="5"
                 fill="#173b26" opacity=".13"/>
        <path d="M19 105 Q22 79 38 75 L44 73 L50 84 L57 73
                 Q78 79 81 105Z" fill="${a.shirt}"/>
        <path d="M39 75 L50 88 L61 75" fill="#fff" opacity=".9"/>
        <path d="M43 65 L43 78 L57 78 L57 65" fill="${a.skin}"/>

        <ellipse cx="27" cy="47" rx="5" ry="8" fill="${a.skin}"/>
        <ellipse cx="73" cy="47" rx="5" ry="8" fill="${a.skin}"/>
        <ellipse cx="50" cy="44" rx="22" ry="27" fill="${a.skin}"/>

        ${hairstyle}
        ${headwear}

        <path d="M35 39 Q40 35 45 39 M55 39 Q60 35 65 39"
              stroke="#35241c" stroke-width="2.5"
              stroke-linecap="round" fill="none"/>
        <ellipse cx="40" cy="45" rx="2.5" ry="3" fill="#251b17"/>
        <ellipse cx="60" cy="45" rx="2.5" ry="3" fill="#251b17"/>
        <circle cx="40.7" cy="44" r=".8" fill="#fff"/>
        <circle cx="60.7" cy="44" r=".8" fill="#fff"/>

        <path d="M49 46 L46 53 Q50 56 53 53"
              stroke="#75452f" stroke-width="1.5"
              stroke-linecap="round" fill="none"/>

        ${mouth}
        ${facialHair}

        <ellipse cx="34" cy="53" rx="4" ry="2.5"
                 fill="#e78e7b" opacity=".25"/>
        <ellipse cx="66" cy="53" rx="4" ry="2.5"
                 fill="#e78e7b" opacity=".25"/>

        ${earrings}

        <path d="M43 78 L50 86 L57 78"
              stroke="#fff" stroke-width="1.5"
              fill="none" opacity=".7"/>
      </svg>
    `;
  }

  /* ----------------------------------------------------------
     LIGHTWEIGHT STYLES
     ---------------------------------------------------------- */

  function injectStyles() {
    if (document.getElementById("mb-light-tour-styles")) return;

    const style = document.createElement("style");
    style.id = "mb-light-tour-styles";

    style.textContent = `
      #mbTourLauncher {
        position:fixed;left:18px;bottom:18px;z-index:9990;
        display:flex;align-items:center;gap:9px;
        border:0;border-radius:999px;padding:10px 16px 10px 10px;
        background:#214b31;color:white;
        font:600 13px/1.2 system-ui,sans-serif;
        box-shadow:0 5px 22px #142b1b35;cursor:pointer;
        transition:transform .2s,box-shadow .2s;
      }
      #mbTourLauncher:hover {
        transform:translateY(-3px);
        box-shadow:0 8px 25px #142b1b40;
      }
      #mbTourLauncher .mb-mini-farmer {
        width:34px;height:34px;display:block;
      }
      #mbTourLauncher .mb-mini-farmer svg,
      #mbTourCard .mb-tour-farmer svg,
      #mbSmartFarmer svg {
        width:100%;height:100%;display:block;overflow:visible;
      }

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
        box-shadow:0 18px 65px #102b1d38;border:1px solid #e0eadf;
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

      #mbTourCard .mb-tour-top {
        display:flex;align-items:center;gap:12px;
      }
      #mbTourCard .mb-tour-farmer {
        width:75px;height:83px;flex:0 0 75px;
        border-radius:18px;background:#edf5e9;overflow:hidden;
        animation:mbFarmerFloat 3s ease-in-out infinite;
      }
      @keyframes mbFarmerFloat {
        0%,100% {transform:translateY(0)}
        50% {transform:translateY(-3px)}
      }

      #mbTourCard .mb-tour-eyebrow {
        color:#58815d;font-size:11px;font-weight:800;
        letter-spacing:.09em;text-transform:uppercase;
      }
      #mbTourCard .mb-tour-heading {
        font-size:19px;line-height:1.2;margin:5px 0;font-weight:800;
      }
      #mbTourCard .mb-tour-subtitle {
        font-size:12px;color:#657769;line-height:1.4;
      }
      #mbTourCard .mb-tour-close {
        margin-left:auto;align-self:flex-start;border:0;
        background:#f1f5ef;color:#37543e;
        width:31px;height:31px;border-radius:50%;font-size:18px;
      }

      #mbTourCard .mb-tour-avatar-row {
        display:flex;gap:7px;margin-top:12px;
      }
      #mbTourCard .mb-tour-avatar {
        flex:1;min-width:0;border:1px solid #dfe8dc;
        border-radius:12px;background:#fafcf9;padding:6px 3px;
        color:#435d47;font-size:10px;font-weight:700;
        transition:transform .2s,background .2s;
      }
      #mbTourCard .mb-tour-avatar:hover {
        transform:translateY(-2px);
      }
      #mbTourCard .mb-tour-avatar svg {
        display:block;width:39px;height:43px;margin:0 auto 3px;
      }
      #mbTourCard .mb-tour-avatar.selected {
        border:2px solid #4b8b4c;background:#eff7eb;padding:5px 2px;
        box-shadow:0 0 0 2px #b5d8a9;
      }

      #mbTourCard .mb-tour-progress {
        display:flex;gap:5px;margin:17px 0 14px;
      }
      #mbTourCard .mb-tour-progress span {
        height:4px;flex:1;border-radius:8px;background:#e6ece4;
      }
      #mbTourCard .mb-tour-progress span.active {background:#4b8b4c}

      #mbTourCard .mb-tour-step {
        font-size:10px;font-weight:800;color:#608364;
        text-transform:uppercase;letter-spacing:.08em;
      }
      #mbTourCard .mb-tour-copy-title {
        font-size:18px;font-weight:800;margin:7px 0;color:#203b2a;
      }
      #mbTourCard .mb-tour-copy {
        font-size:13px;line-height:1.65;color:#536557;margin:0;
      }

      #mbTourCard .mb-tour-settings {
        display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px;
      }
      #mbTourCard .mb-tour-field label {
        display:block;font-size:11px;font-weight:700;
        color:#526a56;margin-bottom:5px;
      }
      #mbTourCard .mb-tour-field select {
        width:100%;min-width:0;border:1px solid #dbe5d8;
        border-radius:10px;padding:8px;background:#f9fbf8;
        color:#29442f;font-size:12px;
      }

      #mbTourCard .mb-tour-actions {
        display:flex;align-items:center;gap:8px;margin-top:17px;
      }
      #mbTourCard .mb-tour-actions button {
        border:0;border-radius:11px;padding:10px 12px;
        font-size:12px;font-weight:800;
      }
      #mbTourCard .mb-tour-primary {
        background:#2e6b3b;color:#fff;flex:1;
      }
      #mbTourCard .mb-tour-secondary {
        background:#edf3ea;color:#36553c;
      }
      #mbTourCard .mb-tour-skip {
        border:0;background:transparent;color:#6b7d6d;
        font-size:11px;padding:8px 0;
      }
      #mbTourCard .mb-tour-note {
        font-size:10px;color:#7b8c7b;margin-top:10px;line-height:1.5;
      }

      @media(max-width:560px) {
        #mbTourLauncher {
          left:10px;bottom:10px;padding:8px 12px 8px 8px;
        }
        #mbTourCard {
          left:10px!important;right:10px!important;bottom:58px!important;
          width:auto;max-height:calc(100dvh - 74px);
          padding:15px;border-radius:18px;
        }
        #mbTourCard .mb-tour-farmer {
          width:64px;height:73px;flex-basis:64px;
        }
        #mbTourCard .mb-tour-heading {font-size:17px}
        #mbTourCard .mb-tour-copy {font-size:12px}
      }

      @media(prefers-reduced-motion:reduce) {
        #mbTourCard *,#mbTourLauncher {animation:none!important;transition:none!important}
      }
    `;

    document.head.appendChild(style);
  }

  /* ----------------------------------------------------------
     LAUNCHER AND TOUR CARD
     ---------------------------------------------------------- */

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

    button.addEventListener("click", start);
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

      <div class="mb-tour-avatar-row">
        ${Object.entries(avatars).map(([id, a]) => `
          <button type="button"
                  class="mb-tour-avatar ${id === state.avatar ? "selected" : ""}"
                  data-avatar="${id}"
                  aria-pressed="${id === state.avatar}">
            ${farmerSVG(id)}
            ${escapeHTML(a.name)}
          </button>
        `).join("")}
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        ${text.steps.map((_, i) =>
          `<span data-progress="${i}"></span>`
        ).join("")}
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
        <button type="button" class="mb-tour-secondary" data-action="back">
          ${escapeHTML(text.back)}
        </button>
        <button type="button" class="mb-tour-primary" data-action="next">
          ${escapeHTML(text.next)}
        </button>
      </div>

      <button type="button" class="mb-tour-skip" data-action="skip">
        ${escapeHTML(text.skip)}
      </button>

      <div class="mb-tour-note">
        Made for Kenyan farmers and buyers • Demo experience
      </div>
    `;
  }

  function showCard() {
    injectStyles();

    let shade = document.getElementById("mbTourShade");

    if (!shade) {
      shade = document.createElement("div");
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

      card.addEventListener("click", handleCardClick);
      card.addEventListener("change", handleCardChange);
      document.body.appendChild(card);
    }

    card.innerHTML = cardMarkup();
    card.querySelector("#mbTourLanguage").value = state.language;
    card.querySelector("#mbTourVoice").value = state.voice ? "on" : "off";

    shade.hidden = false;
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

    const backButton = card.querySelector('[data-action="back"]');
    backButton.disabled = state.step === 0;
    backButton.style.opacity = state.step === 0 ? ".45" : "1";

    card.querySelector('[data-action="next"]').textContent =
      last ? text.finish : text.next;

    card.querySelector(".mb-tour-farmer").innerHTML =
      farmerSVG(state.avatar, "normal");

    positionCard();
    speak(current[1]);

    const target = findTarget(state.step);

    if (target && window.innerWidth > 700) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  /* ----------------------------------------------------------
     RESPONSIVE POSITIONING
     ---------------------------------------------------------- */

  function positionCard() {
    const card = document.getElementById("mbTourCard");
    if (!card || card.hidden || window.innerWidth <= 560) return;

    card.style.left = "";
    card.style.right = "";
    card.style.bottom = "";

    const selectors = [
      "#mbGuidePanel", ".mb-guide-panel", "#guidePanel",
      ".guide-panel", ".guide-widget", "#guideWidget",
      ".floating-guide", ".floating-assistant", ".chat-widget",
      ".chatbot-container", "#guideButton", ".mb-guide-toggle",
      ".mb-guide-button", ".guide-button"
    ];

    const guide = selectors.map(safeGet).find(element => {
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden";
    });

    if (!guide) return;

    const a = card.getBoundingClientRect();
    const b = guide.getBoundingClientRect();

    const overlaps =
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;

    if (!overlaps) return;

    card.style.left = "20px";
    card.style.right = "auto";

    requestAnimationFrame(() => {
      if (!card.isConnected || card.hidden) return;

      const newRect = card.getBoundingClientRect();

      const stillOverlaps =
        newRect.left < b.right &&
        newRect.right > b.left &&
        newRect.top < b.bottom &&
        newRect.bottom > b.top;

      if (stillOverlaps) {
        card.style.left = "";
        card.style.right = "20px";
        card.style.bottom =
          `${Math.max(20, window.innerHeight - b.top + 12)}px`;
      }
    });
  }

  /* ----------------------------------------------------------
     DISTINCT VOICE PROFILES
     ---------------------------------------------------------- */

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
    const profile = avatars[state.avatar] || avatars.woman1;

    const voices = window.speechSynthesis.getVoices();
    const languagePrefix = state.language === "sw" ? "sw" : "en";

    const languageVoices = voices.filter(voice =>
      voice.lang.toLowerCase().startsWith(languagePrefix)
    );

    const fallbackEnglish = voices.filter(voice =>
      voice.lang.toLowerCase().startsWith("en")
    );

    const candidates = languageVoices.length
      ? languageVoices
      : fallbackEnglish;

    const matching = candidates.filter(voice =>
      profile.voiceNames.test(voice.name)
    );

    const pool = matching.length ? matching : candidates;

    if (pool.length) {
      const characterOrder = ["woman1", "woman2", "man1", "man2"];
      const characterIndex = characterOrder.indexOf(state.avatar);

      // Different characters use different voices when the device has them.
      utterance.voice = pool[characterIndex % pool.length];
    }

    utterance.lang = state.language === "sw" ? "sw-KE" : "en-KE";
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (token !== state.speechToken) return;

      state.speaking = true;

      const farmer = document.querySelector(
        "#mbTourCard .mb-tour-farmer"
      );

      if (farmer) {
        farmer.innerHTML = farmerSVG(state.avatar, "talk");
      }
    };

    utterance.onend = () => {
      if (token !== state.speechToken) return;

      state.speaking = false;

      const farmer = document.querySelector(
        "#mbTourCard .mb-tour-farmer"
      );

      if (farmer) {
        farmer.innerHTML = farmerSVG(state.avatar, "happy");
      }
    };

    utterance.onerror = () => {
      if (token === state.speechToken) state.speaking = false;
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      state.speaking = false;
    }
  }

  /* ----------------------------------------------------------
     START, CLOSE AND FINISH
     ---------------------------------------------------------- */

  function start() {
    state.step = 0;
    state.running = true;
    showCard();
    renderStep();
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

    const hideToast = () => {
      toast.hidden = true;
    };

    document.addEventListener("pointerdown", hideToast, { once: true });
    document.addEventListener("keydown", hideToast, { once: true });
  }

  /* ----------------------------------------------------------
     SMART ASSIST FARMER WELCOME
     ---------------------------------------------------------- */

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

    const heading = host.querySelector("h1, h2");

    if (heading && heading.parentElement) {
      heading.parentElement.insertAdjacentElement("afterend", welcome);
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

  /* ----------------------------------------------------------
     INITIALISE LIGHTLY
     ---------------------------------------------------------- */

  function init() {
    injectStyles();
    makeLauncher();
    smartAssistWelcome();

    window.addEventListener("resize", () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(positionCard, 120);
    }, { passive: true });

    // The visitor opens the tour manually. No startup animation loop,
    // no full-page MutationObserver and no forced automatic tour.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.MavunoBridgeTour = {
    start,
    restart() {
      localStorage.removeItem(STORAGE.completed);
      start();
    },
    close: closeTour
  };
})();
