
/* ============================================================
   MAVUNOBRIDGE — WEBSITE TOUR + SMART FARMER ASSISTANT
   Complete replacement for website-tour.js

   FEATURES
   - Four selectable 2D farmer avatars: two women and two men
   - Different voice profiles for each avatar
   - English, Sheng-English and Kiswahili tour text
   - Animated talking mouth while speech synthesis is active
   - Wave, blink, nod, celebrate and curious animations
   - Optional read-aloud voice
   - Responsive, skippable website tour
   - Saves progress and supports restarting
   - Smart Assist avatar integration
   - Avoids covering the existing Guide where possible
   - No libraries, image files or backend required

   NOTE:
   Browser voice availability depends on the device.
   The standard browser speech API does not expose exact
   phoneme timing, so mouth movement is animated during speech.
   ============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_TOUR_V5__) return;
  window.__MAVUNOBRIDGE_TOUR_V5__ = true;

  const PAGE = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE = {
    avatar: "mavunobridge_selected_farmer_avatar_v1",
    language: "mavunobridge_language_v2",
    languageOld: "mavunobridge_language_v1",
    voice: "mavunobridge_farmer_voice_enabled_v1",
    progress: "mavunobridge_tour_progress_v5_",
    completed: "mavunobridge_tour_completed_v5_"
  };

  const reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safeGet = (key, fallback = "") => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (_) {
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, String(value));
    } catch (_) {}
  };

  const safeRemove = key => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  };

  function getLanguage() {
    const selector = $("#languageSelect");
    const selected = selector?.value;

    if (["en", "mix", "sw"].includes(selected)) {
      return selected;
    }

    const saved =
      safeGet(STORAGE.language) ||
      safeGet(STORAGE.languageOld) ||
      "mix";

    return ["en", "mix", "sw"].includes(saved) ? saved : "mix";
  }

  function tr(en, mix, sw) {
    const language = getLanguage();
    return language === "en" ? en : language === "sw" ? sw : mix;
  }

  /* ============================================================
     1. FOUR FARMER CHARACTERS
     ============================================================ */

  const FARMERS = {
    mamaAkinyi: {
      id: "mamaAkinyi",
      gender: "female",
      names: {
        en: "Mama Akinyi",
        mix: "Mama Akinyi",
        sw: "Mama Akinyi"
      },
      description: {
        en: "Friendly and welcoming farmer",
        mix: "Friendly na ready kukusaidia",
        sw: "Mkulima mkarimu na mwenye kukusaidia"
      },
      voice: {
        gender: "female",
        rate: 0.94,
        pitch: 1.18,
        preferredNames: ["female", "woman", "zira", "samantha", "susan"]
      },
      skin: "#8D5438",
      shirt: "#39744A",
      hat: "#567D38",
      hair: "#241A15",
      accessory: "braids"
    },

    mamaWanjiku: {
      id: "mamaWanjiku",
      gender: "female",
      names: {
        en: "Mama Wanjiku",
        mix: "Mama Wanjiku",
        sw: "Mama Wanjiku"
      },
      description: {
        en: "Energetic and confident farmer",
        mix: "Mchangamfu na confident",
        sw: "Mkulima mwenye nguvu na kujiamini"
      },
      voice: {
        gender: "female",
        rate: 1.04,
        pitch: 1.32,
        preferredNames: ["female", "woman", "aria", "jenny", "karen"]
      },
      skin: "#603B2C",
      shirt: "#C58A40",
      hat: "#315F40",
      hair: "#201815",
      accessory: "headwrap"
    },

    farmerKamau: {
      id: "farmerKamau",
      gender: "male",
      names: {
        en: "Farmer Kamau",
        mix: "Farmer Kamau",
        sw: "Mkulima Kamau"
      },
      description: {
        en: "Calm and experienced farmer",
        mix: "Mkulima calm mwenye experience",
        sw: "Mkulima mtulivu mwenye uzoefu"
      },
      voice: {
        gender: "male",
        rate: 0.88,
        pitch: 0.82,
        preferredNames: ["male", "man", "david", "mark", "daniel", "guy"]
      },
      skin: "#A66A45",
      shirt: "#356A46",
      hat: "#8A6B36",
      hair: "#211B17",
      accessory: "beard"
    },

    farmerOtieno: {
      id: "farmerOtieno",
      gender: "male",
      names: {
        en: "Farmer Otieno",
        mix: "Farmer Otieno",
        sw: "Mkulima Otieno"
      },
      description: {
        en: "Confident and encouraging farmer",
        mix: "Confident na anakupa morale",
        sw: "Mkulima anayejiamini na kutia moyo"
      },
      voice: {
        gender: "male",
        rate: 0.98,
        pitch: 0.72,
        preferredNames: ["male", "man", "james", "thomas", "george", "ryan"]
      },
      skin: "#58382B",
      shirt: "#B66B36",
      hat: "#3E6841",
      hair: "#171412",
      accessory: "shortBeard"
    }
  };

  const DEFAULT_AVATAR = "mamaAkinyi";

  function getSelectedFarmer() {
    const id = safeGet(STORAGE.avatar, DEFAULT_AVATAR);
    return FARMERS[id] ? FARMERS[id] : FARMERS[DEFAULT_AVATAR];
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

  /*
   * Every farmer has their own SVG appearance.
   * The mouth and eyes use shared CSS classes so the
   * animation works consistently for all four characters.
   */
  function farmerSVG(farmer = getSelectedFarmer(), extraClass = "") {
    const female = farmer.gender === "female";

    let hair = "";

    if (farmer.accessory === "braids") {
      hair = `
        <path d="M43 52 Q27 67 36 103 L45 103 L49 69Z" fill="${farmer.hair}"/>
        <path d="M77 52 Q94 66 87 101 L78 103 L73 68Z" fill="${farmer.hair}"/>
        <path d="M39 77 L34 91 M84 76 L90 91"
          stroke="#C39A55" stroke-width="2" fill="none"/>
      `;
    } else if (farmer.accessory === "headwrap") {
      hair = `
        <path d="M31 49 Q25 17 60 18 Q96 18 89 52
          L82 60 L38 60Z" fill="#8B4E32"/>
        <path d="M28 42 Q60 5 93 42 L88 51
          Q60 30 33 52Z" fill="#D4A34D"/>
        <path d="M37 40 Q60 25 84 40"
          fill="none" stroke="#F0D29B" stroke-width="3"/>
      `;
    } else {
      hair = `
        <path d="M35 49 Q31 22 60 20 Q91 21 86 51
          L82 61 L39 61Z" fill="${farmer.hair}"/>
      `;
    }

    let beard = "";

    if (farmer.accessory === "beard") {
      beard = `
        <path d="M39 66 Q42 91 60 94 Q78 91 81 66
          L75 75 L60 84 L45 75Z" fill="${farmer.hair}"/>
      `;
    }

    if (farmer.accessory === "shortBeard") {
      beard = `
        <path d="M40 68 Q43 87 60 89 Q77 87 80 68
          L73 76 L60 81 L47 76Z" fill="${farmer.hair}"/>
      `;
    }

    const hat = `
      <path d="M28 42 Q32 12 60 12 Q88 12 92 42Z"
        fill="${farmer.hat}"/>
      <path d="M20 42 Q60 31 100 42
        Q94 52 60 51 Q27 52 20 42Z"
        fill="${farmer.hat}"/>
      <path d="M37 39 Q60 30 83 39"
        stroke="#D5C17A" stroke-width="2" fill="none"/>
    `;

    return `
      <svg class="mb-farmer-svg ${extraClass}"
        viewBox="0 0 120 150"
        role="img"
        aria-label="${escapeHTML(farmer.names[getLanguage()])}"
        xmlns="http://www.w3.org/2000/svg">

        <defs>
          <linearGradient id="mbShirt-${farmer.id}"
            x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${farmer.shirt}"/>
            <stop offset="100%" stop-color="#244A32"/>
          </linearGradient>
        </defs>

        <!-- Body -->
        <path d="M16 150 L20 116 Q24 91 43 89
          L77 89 Q96 91 100 116 L104 150Z"
          fill="url(#mbShirt-${farmer.id})"/>

        <path d="M45 91 L60 113 L75 91"
          fill="#F1E7CC" opacity=".9"/>

        <!-- Neck -->
        <path d="M49 78 L49 96 L60 105 L71 96 L71 78Z"
          fill="${farmer.skin}"/>

        <!-- Hair / headwrap -->
        ${hair}

        <!-- Face -->
        <ellipse cx="60" cy="57" rx="27" ry="32"
          fill="${farmer.skin}"/>

        <!-- Ears -->
        <ellipse cx="33" cy="59" rx="5" ry="8"
          fill="${farmer.skin}"/>
        <ellipse cx="87" cy="59" rx="5" ry="8"
          fill="${farmer.skin}"/>

        <!-- Hat -->
        ${hat}

        <!-- Eyebrows -->
        <path d="M43 47 Q49 43 54 47"
          stroke="#2A1B15" stroke-width="2.5"
          stroke-linecap="round" fill="none"/>
        <path d="M66 47 Q72 43 77 47"
          stroke="#2A1B15" stroke-width="2.5"
          stroke-linecap="round" fill="none"/>

        <!-- Eyes -->
        <g class="mb-farmer-eyes">
          <ellipse cx="49" cy="54" rx="3.3" ry="4"
            fill="#241914"/>
          <ellipse cx="71" cy="54" rx="3.3" ry="4"
            fill="#241914"/>
          <circle cx="50" cy="53" r="1" fill="#FFF"/>
          <circle cx="72" cy="53" r="1" fill="#FFF"/>
        </g>

        <!-- Nose -->
        <path d="M59 55 L56 65 Q60 68 64 65"
          stroke="#5B3327" stroke-width="1.7"
          stroke-linecap="round" fill="none" opacity=".75"/>

        <!-- Smile -->
        <path class="mb-mouth-smile"
          d="M48 73 Q60 82 72 73"
          stroke="#51251F" stroke-width="3"
          stroke-linecap="round" fill="none"/>

        <!-- Talking mouth -->
        <g class="mb-mouth">
          <ellipse cx="60" cy="75" rx="7" ry="2"
            fill="#451B1A"/>
          <path d="M54 74 Q60 72 66 74"
            stroke="#FFF2E3" stroke-width="1.5"
            fill="none"/>
          <ellipse cx="60" cy="78" rx="3" ry="1.2"
            fill="#D56B67"/>
        </g>

        <!-- Cheeks -->
        <ellipse cx="43" cy="66" rx="5" ry="2.5"
          fill="#D77F6A" opacity=".24"/>
        <ellipse cx="77" cy="66" rx="5" ry="2.5"
          fill="#D77F6A" opacity=".24"/>

        <!-- Facial hair -->
        ${beard}

        <!-- Wave arm -->
        <g class="mb-farmer-wave">
          <path d="M87 113 Q103 94 101 77"
            stroke="${farmer.skin}" stroke-width="12"
            stroke-linecap="round" fill="none"/>
          <circle cx="101" cy="71" r="8"
            fill="${farmer.skin}"/>
          <path d="M96 66 L94 60 M101 64 L101 57 M106 66 L109 60"
            stroke="${farmer.skin}" stroke-width="3"
            stroke-linecap="round" fill="none"/>
        </g>

        <!-- Small farmer collar detail -->
        <path d="M37 100 L30 118 M83 100 L90 118"
          stroke="#D3D8C0" stroke-width="2" opacity=".45"/>

      </svg>
    `;
  }

  /* ============================================================
     2. INJECTED STYLES
     ============================================================ */

  const style = document.createElement("style");

  style.id = "mavunobridge-tour-styles-v5";

  style.textContent = `
    .mb-tour-launcher,
    .mb-avatar-launcher {
      position: fixed;
      right: 16px;
      z-index: 99980;
      border: 1px solid rgba(36,80,48,.18);
      border-radius: 999px;
      padding: 11px 16px;
      background: #fff;
      color: #244D32;
      font: 700 13px/1.2 system-ui, sans-serif;
      box-shadow: 0 7px 25px rgba(20,40,25,.14);
      cursor: pointer;
      min-height: 42px;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .mb-tour-launcher { bottom: 18px; }
    .mb-avatar-launcher { bottom: 68px; }

    .mb-tour-launcher:hover,
    .mb-avatar-launcher:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(20,40,25,.19);
    }

    .mb-tour-launcher:focus-visible,
    .mb-avatar-launcher:focus-visible,
    .mb-tour-card button:focus-visible,
    .mb-avatar-option:focus-visible {
      outline: 3px solid #D9A441;
      outline-offset: 3px;
    }

    .mb-tour-layer {
      position: fixed;
      inset: 0;
      z-index: 99990;
      pointer-events: none;
      font-family: system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }

    .mb-tour-shade {
      position: fixed;
      background: rgba(10,25,15,.48);
      pointer-events: none;
    }

    .mb-tour-focus {
      position: fixed;
      z-index: 99991;
      border: 3px solid #E2B84C;
      border-radius: 13px;
      box-shadow: 0 0 0 4px rgba(255,255,255,.72),
        0 0 0 9999px rgba(0,0,0,0);
      pointer-events: none;
      transition: all .2s ease;
    }

    .mb-tour-card {
      position: fixed;
      z-index: 99993;
      width: min(570px, calc(100vw - 28px));
      max-height: min(430px, calc(100dvh - 30px));
      overflow: auto;
      box-sizing: border-box;
      padding: 17px;
      color: #203A29;
      background: rgba(255,255,255,.91);
      border: 1px solid rgba(255,255,255,.95);
      border-radius: 22px;
      box-shadow: 0 18px 60px rgba(9,25,14,.27);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      pointer-events: auto;
      animation: mbCardIn .25s ease-out;
    }

    @keyframes mbCardIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mb-tour-topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .mb-tour-kicker {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .09em;
      color: #527557;
    }

    .mb-tour-count {
      font-size: 12px;
      font-weight: 700;
      color: #55715A;
      white-space: nowrap;
    }

    .mb-tour-guide-row {
      display: grid;
      grid-template-columns: 104px minmax(0,1fr);
      align-items: center;
      gap: 15px;
    }

    .mb-tour-farmer {
      position: relative;
      width: 104px;
      height: 126px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 18px;
      background: linear-gradient(145deg,#EEF5E9,#DDE9D7);
    }

    .mb-farmer-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .mb-farmer-svg .mb-mouth {
      transform-box: fill-box;
      transform-origin: center;
      transform: scaleY(.1);
      opacity: 0;
    }

    .mb-farmer-svg .mb-mouth-smile {
      opacity: 1;
    }

    .mb-farmer-svg.mb-is-talking .mb-mouth {
      opacity: 1;
      animation: mbMouthTalk .19s ease-in-out infinite alternate;
    }

    .mb-farmer-svg.mb-is-talking .mb-mouth-smile {
      opacity: 0;
    }

    @keyframes mbMouthTalk {
      0% { transform: scaleY(.18); }
      100% { transform: scaleY(1.15); }
    }

    .mb-farmer-svg.mb-is-waving .mb-farmer-wave {
      transform-box: fill-box;
      transform-origin: 80% 70%;
      animation: mbWave .65s ease-in-out 3;
    }

    @keyframes mbWave {
      0%,100% { transform: rotate(0); }
      25% { transform: rotate(18deg); }
      50% { transform: rotate(-10deg); }
      75% { transform: rotate(15deg); }
    }

    .mb-farmer-svg.mb-is-nodding {
      animation: mbNod .65s ease-in-out 2;
      transform-origin: center;
    }

    @keyframes mbNod {
      0%,100% { transform: rotate(0); }
      35% { transform: rotate(5deg); }
      70% { transform: rotate(-3deg); }
    }

    .mb-farmer-svg.mb-is-celebrating {
      animation: mbCelebrate .7s ease-in-out 2;
    }

    @keyframes mbCelebrate {
      0%,100% { transform: translateY(0) rotate(0); }
      25% { transform: translateY(-8px) rotate(-4deg); }
      50% { transform: translateY(0) rotate(4deg); }
      75% { transform: translateY(-5px) rotate(-3deg); }
    }

    .mb-farmer-svg.mb-is-blinking .mb-farmer-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: mbBlink .15s ease-in-out;
    }

    @keyframes mbBlink {
      0%,100% { transform: scaleY(1); }
      50% { transform: scaleY(.08); }
    }

    .mb-tour-copy h2 {
      font-size: clamp(18px, 3vw, 23px);
      line-height: 1.18;
      margin: 0 0 8px;
      color: #1C442A;
    }

    .mb-tour-copy p {
      font-size: 14px;
      line-height: 1.55;
      margin: 0;
      color: #3E5544;
      overflow-wrap: anywhere;
    }

    .mb-tour-progress {
      height: 5px;
      background: #E5EDE2;
      border-radius: 999px;
      overflow: hidden;
      margin: 15px 0;
    }

    .mb-tour-progress > span {
      display: block;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg,#4B8052,#D4A53E);
      border-radius: inherit;
      transition: width .25s ease;
    }

    .mb-tour-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .mb-tour-actions-left,
    .mb-tour-actions-right {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
    }

    .mb-tour-card button,
    .mb-avatar-modal button {
      font: 700 12px/1.2 system-ui, sans-serif;
      border: 1px solid #DCE6D8;
      border-radius: 10px;
      padding: 10px 12px;
      background: #F8FBF6;
      color: #315A39;
      cursor: pointer;
      min-height: 38px;
    }

    .mb-tour-card button.mb-primary {
      color: #fff;
      background: #2F6940;
      border-color: #2F6940;
    }

    .mb-tour-card button:hover,
    .mb-avatar-modal button:hover {
      filter: brightness(.97);
    }

    .mb-tour-card button:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-tour-language {
      font-size: 11px;
      color: #667C68;
      margin-top: 10px;
    }

    .mb-tour-tip {
      margin-top: 10px;
      padding: 9px 11px;
      border-radius: 11px;
      background: #F0F6EB;
      font-size: 12px;
      line-height: 1.45;
      color: #4C664C;
    }

    .mb-avatar-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100010;
      display: grid;
      place-items: center;
      padding: 14px;
      background: rgba(10,25,15,.48);
      pointer-events: auto;
    }

    .mb-avatar-modal {
      width: min(600px, 100%);
      max-height: calc(100dvh - 28px);
      overflow: auto;
      padding: 18px;
      border-radius: 22px;
      background: rgba(255,255,255,.96);
      color: #23432C;
      box-shadow: 0 18px 65px rgba(0,0,0,.24);
    }

    .mb-avatar-modal h2 {
      font-size: 21px;
      margin: 0 0 6px;
    }

    .mb-avatar-modal > p {
      margin: 0 0 15px;
      font-size: 13px;
      line-height: 1.5;
      color: #526A56;
    }

    .mb-avatar-grid {
      display: grid;
      grid-template-columns: repeat(4,minmax(0,1fr));
      gap: 10px;
    }

    .mb-avatar-option {
      min-width: 0;
      padding: 9px 5px !important;
      border-radius: 15px !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 7px;
      text-align: center;
      background: #F7FAF4 !important;
    }

    .mb-avatar-option[aria-pressed="true"] {
      border: 2px solid #4A8651 !important;
      background: #EAF4E6 !important;
    }

    .mb-avatar-option .mb-avatar-preview {
      width: 70px;
      height: 85px;
      display: block;
      border-radius: 12px;
      overflow: hidden;
      background: #E4EDDE;
    }

    .mb-avatar-option strong {
      font-size: 11px;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .mb-avatar-option small {
      font-size: 10px;
      font-weight: 500;
      line-height: 1.35;
      color: #617360;
    }

    .mb-avatar-modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 16px;
    }

    .mb-avatar-modal-footer label {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      font-weight: 650;
    }

    .mb-avatar-modal-footer input {
      accent-color: #2F6940;
    }

    .mb-guide-farmer {
      width: 55px;
      height: 65px;
      flex: 0 0 auto;
      display: inline-flex;
      vertical-align: middle;
      overflow: hidden;
      border-radius: 12px;
      background: #E7F0E1;
    }

    .mb-smart-farmer-avatar {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mb-smart-farmer-avatar .mb-farmer-svg {
      max-width: 100%;
      max-height: 100%;
    }

    .mb-smart-farmer-avatar.mb-is-talking .mb-farmer-svg,
    .mb-guide-farmer.mb-is-talking .mb-farmer-svg {
      animation: mbFarmerFloat 1.6s ease-in-out infinite;
    }

    @keyframes mbFarmerFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    .mb-avatar-speech-status {
      font-size: 11px;
      color: #5C765D;
    }

    @media (max-width: 650px) {
      .mb-tour-launcher,
      .mb-avatar-launcher {
        right: 10px;
        max-width: calc(100vw - 20px);
        font-size: 12px;
        padding: 10px 12px;
      }

      .mb-tour-launcher { bottom: 12px; }
      .mb-avatar-launcher { bottom: 59px; }

      .mb-tour-card {
        width: calc(100vw - 20px);
        max-height: min(46dvh, 330px);
        padding: 13px;
        border-radius: 17px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 70px minmax(0,1fr);
        gap: 10px;
      }

      .mb-tour-farmer {
        width: 70px;
        height: 88px;
        border-radius: 13px;
      }

      .mb-tour-copy h2 {
        font-size: 17px;
        margin-bottom: 5px;
      }

      .mb-tour-copy p {
        font-size: 12px;
        line-height: 1.45;
      }

      .mb-tour-progress {
        margin: 10px 0;
      }

      .mb-tour-actions {
        gap: 6px;
      }

      .mb-tour-actions-left,
      .mb-tour-actions-right {
        gap: 5px;
      }

      .mb-tour-card button {
        padding: 9px 10px;
        min-height: 35px;
        font-size: 11px;
      }

      .mb-tour-tip {
        font-size: 11px;
        margin-top: 7px;
        padding: 7px 9px;
      }

      .mb-avatar-grid {
        grid-template-columns: repeat(2,minmax(0,1fr));
      }

      .mb-avatar-option .mb-avatar-preview {
        width: 76px;
        height: 90px;
      }
    }

    @media (max-width: 370px) {
      .mb-tour-guide-row {
        grid-template-columns: 56px minmax(0,1fr);
        gap: 8px;
      }

      .mb-tour-farmer {
        width: 56px;
        height: 72px;
      }

      .mb-tour-copy h2 { font-size: 15px; }
      .mb-tour-copy p { font-size: 11px; }

      .mb-tour-actions-left,
      .mb-tour-actions-right {
        width: 100%;
      }

      .mb-tour-actions-right {
        justify-content: flex-end;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb-tour-card,
      .mb-farmer-svg,
      .mb-farmer-svg *,
      .mb-tour-progress > span {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  /* ============================================================
     3. VOICE SELECTION
     ============================================================ */

  let voices = [];
  let speechEnabled = safeGet(STORAGE.voice, "true") !== "false";
  let activeUtterance = null;
  let speechGeneration = 0;
  let voiceTimer = null;
  let moodTimer = null;
  let currentMoodTarget = null;

  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }

  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function preferredLanguageTags() {
    const language = getLanguage();

    if (language === "sw") {
      return ["sw-KE", "sw", "en-KE", "en-GB", "en-US"];
    }

    if (language === "mix") {
      return ["en-KE", "en-GB", "en-US", "sw-KE", "sw"];
    }

    return ["en-GB", "en-US", "en-KE", "en-AU"];
  }

  function voiceGenderScore(voice, farmer) {
    const name = (voice.name || "").toLowerCase();
    const uri = (voice.voiceURI || "").toLowerCase();
    const combined = name + " " + uri;
    const femaleHints = [
      "female", "woman", "zira", "samantha", "susan", "aria",
      "jenny", "karen", "victoria", "ava", "libby", "natasha",
      "sonia", "moira", "tessa"
    ];
    const maleHints = [
      "male", "man", "david", "mark", "daniel", "guy",
      "james", "thomas", "george", "ryan", "oliver",
      "liam", "arthur", "fred"
    ];

    const desired = farmer.voice.gender === "female"
      ? femaleHints
      : maleHints;

    const opposite = farmer.voice.gender === "female"
      ? maleHints
      : femaleHints;

    let score = 0;

    if (desired.some(hint => combined.includes(hint))) score += 6;
    if (opposite.some(hint => combined.includes(hint))) score -= 6;

    if (voice.localService) score += 1;

    return score;
  }

  function chooseVoice(farmer) {
    if (!voices.length) return null;

    const languages = preferredLanguageTags();

    const ranked = voices.map(voice => {
      const lang = (voice.lang || "").toLowerCase();
      let languageScore = 0;

      languages.forEach((candidate, index) => {
        const normalized = candidate.toLowerCase();

        if (lang === normalized) {
          languageScore = Math.max(languageScore, 12 - index);
        } else if (
          lang.startsWith(normalized.split("-")[0] + "-") ||
          lang === normalized.split("-")[0]
        ) {
          languageScore = Math.max(languageScore, 7 - index);
        }
      });

      return {
        voice,
        score: languageScore + voiceGenderScore(voice, farmer)
      };
    });

    ranked.sort((a, b) => b.score - a.score);

    return ranked[0]?.voice || null;
  }

  function getSpeechText(text) {
    /*
     * Sheng-English is intentionally spoken as a natural mix.
     * Browser voices may not pronounce all Sheng words perfectly.
     */
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function setTalking(element, isTalking) {
    if (!element) return;

    const svg = element.matches?.(".mb-farmer-svg")
      ? element
      : $(".mb-farmer-svg", element);

    if (!svg) return;

    svg.classList.toggle("mb-is-talking", isTalking);

    if (element.classList) {
      element.classList.toggle("mb-is-talking", isTalking);
    }
  }

  function getVisibleFarmerElements() {
    return $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar");
  }

  function setAllFarmersTalking(isTalking) {
    getVisibleFarmerElements().forEach(element => {
      setTalking(element, isTalking);
    });
  }

  function clearSpeechAnimation() {
    if (voiceTimer) {
      clearTimeout(voiceTimer);
      voiceTimer = null;
    }

    setAllFarmersTalking(false);
  }

  function stopSpeech() {
    speechGeneration++;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    activeUtterance = null;
    clearSpeechAnimation();
  }

  function animateTalkingForDuration(text) {
    clearSpeechAnimation();

    if (!text) return;

    const approximateDuration = Math.min(
      7000,
      Math.max(900, text.length * 32)
    );

    setAllFarmersTalking(true);

    voiceTimer = setTimeout(() => {
      setAllFarmersTalking(false);
      voiceTimer = null;
    }, approximateDuration);
  }

  function speak(text, farmer = getSelectedFarmer()) {
    stopSpeech();

    if (!speechEnabled || !("speechSynthesis" in window)) {
      animateTalkingForDuration(text);
      return;
    }

    refreshVoices();

    const generation = speechGeneration;
    const utterance = new SpeechSynthesisUtterance(
      getSpeechText(text)
    );

    const voice = chooseVoice(farmer);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "en-GB";
    } else {
      utterance.lang = getLanguage() === "sw"
        ? "sw-KE"
        : "en-GB";
    }

    utterance.rate = farmer.voice.rate;
    utterance.pitch = farmer.voice.pitch;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;
      clearSpeechAnimation();
      setAllFarmersTalking(true);
    };

    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      activeUtterance = null;
      clearSpeechAnimation();
    };

    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
      activeUtterance = null;
      clearSpeechAnimation();
    };

    activeUtterance = utterance;

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      animateTalkingForDuration(text);
    }
  }

  function toggleVoice() {
    speechEnabled = !speechEnabled;
    safeSet(STORAGE.voice, speechEnabled);

    if (!speechEnabled) stopSpeech();

    updateVoiceButtons();
  }

  function updateVoiceButtons() {
    $$("[data-mb-voice-toggle]").forEach(button => {
      button.textContent = speechEnabled
        ? tr("🔊 Voice on", "🔊 Voice iko on", "🔊 Sauti imewashwa")
        : tr("🔇 Voice off", "🔇 Voice iko off", "🔇 Sauti imezimwa");

      button.setAttribute("aria-pressed", String(speechEnabled));
    });
  }

  /* ============================================================
     4. RANDOM FARMER EXPRESSIONS
     ============================================================ */

  function playMood(element, mood) {
    if (!element || reducedMotion) return;

    const svg = element.matches?.(".mb-farmer-svg")
      ? element
      : $(".mb-farmer-svg", element);

    if (!svg) return;

    svg.classList.remove(
      "mb-is-waving",
      "mb-is-nodding",
      "mb-is-celebrating",
      "mb-is-blinking"
    );

    void svg.offsetWidth;

    if (mood === "wave") svg.classList.add("mb-is-waving");
    if (mood === "nod") svg.classList.add("mb-is-nodding");
    if (mood === "celebrate") svg.classList.add("mb-is-celebrating");
    if (mood === "blink") svg.classList.add("mb-is-blinking");
  }

  function randomMood() {
    const moods = ["blink", "blink", "nod", "wave", "celebrate"];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  function startMoodLoop() {
    if (moodTimer) clearTimeout(moodTimer);

    const run = () => {
      if (document.hidden) {
        moodTimer = setTimeout(run, 7000);
        return;
      }

      const targets = getVisibleFarmerElements();

      if (targets.length) {
        const target = targets[
          Math.floor(Math.random() * targets.length)
        ];

        playMood(target, randomMood());
      }

      moodTimer = setTimeout(run, 4500 + Math.random() * 3500);
    };

    moodTimer = setTimeout(run, 2200);
  }

  startMoodLoop();

  /* ============================================================
     5. AVATAR PICKER
     ============================================================ */

  let avatarModal = null;

  function closeAvatarPicker() {
    avatarModal?.remove();
    avatarModal = null;
  }

  function applySelectedAvatar() {
    const farmer = getSelectedFarmer();

    $$(".mb-guide-farmer").forEach(element => {
      element.innerHTML = farmerSVG(farmer);
      element.setAttribute("aria-label", farmer.names[getLanguage()]);
    });

    $$(".mb-smart-farmer-avatar").forEach(element => {
      element.innerHTML = farmerSVG(farmer);
      element.setAttribute("aria-label", farmer.names[getLanguage()]);
    });

    $$(".mb-tour-farmer").forEach(element => {
      element.innerHTML = farmerSVG(farmer);
    });

    const nameElement = $("#mbTourFarmerName");

    if (nameElement) {
      nameElement.textContent = farmer.names[getLanguage()];
    }
  }

  function openAvatarPicker() {
    closeAvatarPicker();
    stopSpeech();

    const current = getSelectedFarmer();

    const backdrop = document.createElement("div");
    backdrop.className = "mb-avatar-modal-backdrop";
    backdrop.setAttribute("role", "presentation");

    const modal = document.createElement("section");
    modal.className = "mb-avatar-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute(
      "aria-label",
      tr("Choose your farmer", "Chagua farmer wako", "Chagua mkulima wako")
    );

    const optionsHTML = Object.values(FARMERS).map(farmer => {
      const selected = farmer.id === current.id;

      return `
        <button class="mb-avatar-option"
          type="button"
          data-mb-avatar="${farmer.id}"
          aria-pressed="${selected}">
          <span class="mb-avatar-preview">
            ${farmerSVG(farmer)}
          </span>
          <strong>${escapeHTML(farmer.names[getLanguage()])}</strong>
          <small>${escapeHTML(farmer.description[getLanguage()])}</small>
        </button>
      `;
    }).join("");

    modal.innerHTML = `
      <h2>
        ${tr(
          "Choose your farmer",
          "Chagua farmer wako",
          "Chagua mkulima wako"
        )}
      </h2>

      <p>
        ${tr(
          "Each farmer has a different appearance and voice profile. Your device determines which actual voices are available.",
          "Kila farmer ako na look na voice profile yake. Sauti halisi zinategemea device yako.",
          "Kila mkulima ana mwonekano na mpangilio tofauti wa sauti. Sauti zinazopatikana hutegemea kifaa chako."
        )}
      </p>

      <div class="mb-avatar-grid">${optionsHTML}</div>

      <div class="mb-avatar-modal-footer">
        <label>
          <input type="checkbox"
            data-mb-modal-voice
            ${speechEnabled ? "checked" : ""}>
          ${tr(
            "Enable spoken guidance",
            "Washa voice ya guide",
            "Washa mwongozo wa sauti"
          )}
        </label>

        <button type="button" data-mb-avatar-close>
          ${tr("Done", "Nimemaliza", "Nimemaliza")}
        </button>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    avatarModal = backdrop;

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeAvatarPicker();
    });

    modal.addEventListener("click", event => {
      const option = event.target.closest("[data-mb-avatar]");

      if (option) {
        const id = option.dataset.mbAvatar;

        if (!FARMERS[id]) return;

        safeSet(STORAGE.avatar, id);
        applySelectedAvatar();

        $$(".mb-avatar-option", modal).forEach(button => {
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.mbAvatar === id)
          );
        });

        const farmer = getSelectedFarmer();

        speak(
          tr(
            `Hello! I am ${farmer.names.en}. Welcome to MavunoBridge.`,
            `Sasa! Mimi ni ${farmer.names.mix}. Karibu MavunoBridge.`,
            `Habari! Mimi ni ${farmer.names.sw}. Karibu MavunoBridge.`
          ),
          farmer
        );
      }

      if (event.target.closest("[data-mb-avatar-close]")) {
        closeAvatarPicker();
      }
    });

    const voiceCheckbox = $("[data-mb-modal-voice]", modal);

    voiceCheckbox?.addEventListener("change", () => {
      speechEnabled = voiceCheckbox.checked;
      safeSet(STORAGE.voice, speechEnabled);

      if (!speechEnabled) stopSpeech();

      updateVoiceButtons();
    });

    modal.querySelector("button")?.focus();
  }

  /* ============================================================
     6. PAGE-SPECIFIC TOUR STEPS
     ============================================================ */

  function step(title, description, selector, tip = "") {
    return { title, description, selector, tip };
  }

  function buildSteps() {
    const homeSteps = [
      step(
        tr("Welcome to MavunoBridge!", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
        tr(
          "Your marketplace connects farmers and buyers across Kenya. I'll guide you through the main features.",
          "Hii ni soko ya kuconnect farmers na buyers Kenya. Nitakuonyesha vile inawork.",
          "Soko hili linaunganisha wakulima na wanunuzi Kenya. Nitakuonyesha jinsi ya kulitumia."
        ),
        "body"
      ),
      step(
        tr("Explore product categories", "Explore categories", "Angalia makundi ya bidhaa"),
        tr(
          "Browse fruits, vegetables, nuts, starchy foods, grains, cereals, legumes, spices, livestock, tools and more.",
          "Angalia fruits, veggies, nuts, grains, cereals, legumes, livestock, tools na zingine.",
          "Angalia matunda, mboga, karanga, nafaka, jamii ya kunde, mifugo, vifaa na bidhaa nyingine."
        ),
        "#categoryGrid, #categories, .category-grid"
      ),
      step(
        tr("Find what you need", "Tafuta unachotaka", "Tafuta unachohitaji"),
        tr(
          "Use the search and filters to narrow listings by product, county, price or sale type.",
          "Tumia search na filters kupata product, county, bei au retail/bulk.",
          "Tumia utafutaji na vichujio kutafuta bidhaa, kaunti, bei au aina ya mauzo."
        ),
        ".filters, #searchInput, #searchBar, .search-bar"
      ),
      step(
        tr("Compare farmer listings", "Compare listings", "Linganisha bidhaa"),
        tr(
          "Check product photos, prices, quantities, farmer details and location before deciding.",
          "Angalia picha, bei, quantity, details za farmer na location kabla ya kuamua.",
          "Angalia picha, bei, kiasi, maelezo ya mkulima na eneo kabla ya kuchagua."
        ),
        "#listingGrid, .product-grid, .marketplace-grid"
      ),
      step(
        tr("Want to sell? List your produce", "Unataka kuuza? List produce yako", "Unataka kuuza? Weka bidhaa zako"),
        tr(
          "Farmers can add products with details such as category, quantity, location and contact information.",
          "Farmer anaweza kuadd product, category, quantity, location na contact.",
          "Wakulima wanaweza kuweka bidhaa, kundi, kiasi, eneo na mawasiliano."
        ),
        "#sellButton, #heroSellButton, [data-action='sell']"
      ),
      step(
        tr("Your cart", "Cart yako", "Kikapu chako"),
        tr(
          "Use the cart to keep track of items you want to buy. Check the details before confirming any order.",
          "Tumia cart kukusanya items unazotaka. Hakikisha details kabla ya kuconfirm order.",
          "Tumia kikapu kuhifadhi bidhaa unazotaka kununua. Hakikisha maelezo kabla ya kuthibitisha oda."
        ),
        "#cartButton, #cartCount, [data-action='cart']"
      ),
      step(
        tr("Smart Assist", "Smart Assist ya shamba", "Msaidizi wa shamba"),
        tr(
          "Visit Smart Assist for farming guidance, crop-planning tools and help understanding common crop problems.",
          "Fungua Smart Assist kupata farming tips, crop planning na help ya crop problems.",
          "Fungua Smart Assist kupata ushauri wa kilimo, kupanga mazao na kuelewa matatizo ya mimea."
        ),
        "a[href*='smart-assist'], [href*='smart-assist.html']"
      ),
      step(
        tr("SACCO Hub and opportunities", "SACCO Hub na opportunities", "SACCO Hub na fursa"),
        tr(
          "Explore available SACCO information and opportunities. Check the details before sharing personal information or making payments.",
          "Angalia SACCO na opportunities. Hakikisha details kabla ya kushare personal info ama kulipa.",
          "Angalia taarifa za SACCO na fursa. Hakikisha maelezo kabla ya kutoa taarifa binafsi au kulipa."
        ),
        "a[href*='sacco'], [href*='sacco.html']"
      )
    ];

    const smartSteps = [
      step(
        tr("Welcome to Smart Assist", "Karibu Smart Assist", "Karibu Smart Assist"),
        tr(
          "I'm your farming guide. Explore the available tools and use the information to support your farming decisions.",
          "Mimi ni guide wako wa shamba. Explore tools na utumie info kusaidia decisions zako.",
          "Mimi ni msaidizi wako wa kilimo. Tumia vifaa vilivyopo kusaidia maamuzi yako."
        ),
        ".sa-hero, .sa-assistant-intro, #assistantWelcome"
      ),
      step(
        tr("Plan your farm", "Panga shamba lako", "Panga shamba lako"),
        tr(
          "Use the farm planner if available to organise your crop choices and farming goals.",
          "Tumia farm planner kupanga crops na goals zako za shamba.",
          "Tumia mpangaji wa shamba kupanga mazao na malengo yako."
        ),
        "#farmPlanner"
      ),
      step(
        tr("Describe a crop problem", "Eleza shida ya crop", "Eleza tatizo la mmea"),
        tr(
          "Select the symptoms you notice and provide clear details. A symptom alone cannot always identify a disease.",
          "Chagua symptoms unazoona na ueleze vizuri. Symptom moja haiwezi confirm disease kila time.",
          "Chagua dalili unazoona na ueleze vizuri. Dalili moja haiwezi kuthibitisha ugonjwa kila wakati."
        ),
        ".sa-symptom-field, #saSymptomChecks"
      ),
      step(
        tr("Add a photo if supported", "Add picha kama inawezekana", "Ongeza picha ikiwa inawezekana"),
        tr(
          "A clear crop photo can provide extra context. Avoid relying on a photo alone for high-risk treatment decisions.",
          "Picha clear inaweza kusaidia. Usitumie picha pekee kuamua treatment kali.",
          "Picha iliyo wazi inaweza kusaidia. Usitumie picha pekee kuamua matibabu hatari."
        ),
        "#saPhoto, input[type='file']"
      ),
      step(
        tr("Generate your guidance", "Pata farming guidance", "Pata ushauri wa kilimo"),
        tr(
          "Review the available report and follow reliable local agricultural advice where needed.",
          "Soma report vizuri na utafute ushauri wa agricultural officer inapohitajika.",
          "Soma ripoti vizuri na utafute ushauri wa afisa wa kilimo inapohitajika."
        ),
        "#generateReportButton, #reportSection"
      )
    ];

    const saccoSteps = [
      step(
        tr("Welcome to SACCO Hub", "Karibu SACCO Hub", "Karibu SACCO Hub"),
        tr(
          "Explore SACCO information and opportunities that may support farmers.",
          "Explore SACCO info na opportunities zinazoweza kusaidia farmers.",
          "Angalia taarifa za SACCO na fursa zinazoweza kusaidia wakulima."
        ),
        ".page-hero"
      ),
      step(
        tr("Browse opportunities", "Angalia opportunities", "Angalia fursa"),
        tr(
          "Review the listed SACCOs and read their requirements carefully.",
          "Angalia SACCO zilizolistiwa na usome requirements vizuri.",
          "Angalia SACCO zilizoorodheshwa na usome masharti kwa makini."
        ),
        ".sacco-controls, #saccoGrid"
      ),
      step(
        tr("Check before joining", "Hakikisha kabla ya kujiunga", "Hakikisha kabla ya kujiunga"),
        tr(
          "Confirm fees, eligibility, contact details and official registration before committing money.",
          "Confirm fees, eligibility na registration kabla ya kutoa pesa.",
          "Thibitisha ada, masharti na usajili rasmi kabla ya kutoa pesa."
        ),
        ".interest-panel, #saccoGrid"
      )
    ];

    const buyerSteps = [
      step(
        tr("Buyer Requests", "Buyer Requests", "Maombi ya wanunuzi"),
        tr(
          "Use this page to explore or submit requests for agricultural products.",
          "Hapa unaweza kuangalia ama kuweka requests za agricultural products.",
          "Hapa unaweza kuangalia au kuweka maombi ya bidhaa za kilimo."
        ),
        ".page-hero"
      ),
      step(
        tr("Submit your request", "Weka request yako", "Weka ombi lako"),
        tr(
          "Describe the product, quantity and other useful details so farmers understand what you need.",
          "Eleza product, quantity na details muhimu ili farmers waelewe unahitaji nini.",
          "Eleza bidhaa, kiasi na maelezo muhimu ili wakulima waelewe unachohitaji."
        ),
        "#demandForm"
      ),
      step(
        tr("Review requests", "Angalia requests", "Angalia maombi"),
        tr(
          "Read each request carefully and use the available contact options responsibly.",
          "Soma requests vizuri na utumie contact options kwa uwajibikaji.",
          "Soma maombi kwa makini na utumie njia za mawasiliano kwa uwajibikaji."
        ),
        "#demandList"
      )
    ];

    const messageSteps = [
      step(
        tr("Messages", "Messages", "Ujumbe"),
        tr(
          "This page helps you review available conversations in the demo.",
          "Hapa unaweza kuangalia conversations zilizopo kwa demo.",
          "Hapa unaweza kuangalia mazungumzo yaliyopo kwenye demo."
        ),
        ".messages-notice"
      ),
      step(
        tr("Choose a conversation", "Chagua conversation", "Chagua mazungumzo"),
        tr(
          "Select a conversation from the list if one is available.",
          "Chagua conversation kwa list kama ipo.",
          "Chagua mazungumzo kutoka kwenye orodha ikiwa yapo."
        ),
        ".conversation-sidebar, #conversationList"
      ),
      step(
        tr("Write a message", "Andika message", "Andika ujumbe"),
        tr(
          "Check the recipient and message details before sending.",
          "Hakikisha recipient na message details kabla ya kutuma.",
          "Hakikisha mpokeaji na maelezo ya ujumbe kabla ya kutuma."
        ),
        "#messageForm"
      )
    ];

    const loginSteps = [
      step(
        tr("Welcome to MavunoBridge", "Karibu MavunoBridge", "Karibu MavunoBridge"),
        tr(
          "This demo page introduces the sign-in experience.",
          "Hii ni demo ya sehemu ya kuingia.",
          "Huu ni mfano wa ukurasa wa kuingia."
        ),
        ".auth-visual, main"
      ),
      step(
        tr("Try the demo sign-in", "Jaribu demo sign-in", "Jaribu kuingia kwa demo"),
        tr(
          "Use the available demo form. Avoid entering real passwords into an unverified demonstration site.",
          "Tumia demo form. Usiweke password yako halisi kwa demo site ambayo haijathibitishwa.",
          "Tumia fomu ya majaribio. Usiweke nenosiri lako halisi kwenye tovuti ya majaribio isiyothibitishwa."
        ),
        "#demoLoginForm, #googleDemoButton"
      )
    ];

    const commonSteps = [
      step(
        tr("Welcome to MavunoBridge", "Karibu MavunoBridge", "Karibu MavunoBridge"),
        tr(
          "I'll show you the main features available on this page.",
          "Nitakuonyesha features kuu za hii page.",
          "Nitakuonyesha vipengele vikuu vya ukurasa huu."
        ),
        "main, .topbar, body"
      )
    ];

    if (PAGE.includes("smart-assist")) return smartSteps;
    if (PAGE.includes("sacco")) return saccoSteps;
    if (PAGE.includes("buyer-requests")) return buyerSteps;
    if (PAGE.includes("messages")) return messageSteps;
    if (PAGE.includes("login")) return loginSteps;
    if (PAGE === "index.html" || PAGE === "") return homeSteps;

    return commonSteps;
  }

  /* ============================================================
     7. TOUR UI AND RESPONSIVE PLACEMENT
     ============================================================ */

  let tourLayer = null;
  let tourCard = null;
  let tourFocus = null;
  let tourSteps = [];
  let tourIndex = 0;
  let repositionFrame = 0;
  let previousFocusedElement = null;

  function createLauncher() {
    if (!$("#mbTourLauncher")) {
      const launcher = document.createElement("button");
      launcher.type = "button";
      launcher.id = "mbTourLauncher";
      launcher.className = "mb-tour-launcher";
      launcher.textContent = tr(
        "🧭 Website Tour",
        "🧭 Tour ya website",
        "🧭 Ziara ya tovuti"
      );

      launcher.addEventListener("click", startTour);
      document.body.appendChild(launcher);
    }

    if (!$("#mbAvatarLauncher")) {
      const avatarButton = document.createElement("button");
      avatarButton.type = "button";
      avatarButton.id = "mbAvatarLauncher";
      avatarButton.className = "mb-avatar-launcher";
      avatarButton.textContent = tr(
        "👩🏾‍🌾 Choose Farmer",
        "👩🏾‍🌾 Chagua Farmer",
        "👩🏾‍🌾 Chagua Mkulima"
      );

      avatarButton.addEventListener("click", openAvatarPicker);
      document.body.appendChild(avatarButton);
    }
  }

  function makeTourLayer() {
    if (tourLayer) return;

    tourLayer = document.createElement("div");
    tourLayer.className = "mb-tour-layer";
    tourLayer.id = "mbTourLayer";

    tourLayer.innerHTML = `
      <div class="mb-tour-shade" data-shade="top"></div>
      <div class="mb-tour-shade" data-shade="left"></div>
      <div class="mb-tour-shade" data-shade="right"></div>
      <div class="mb-tour-shade" data-shade="bottom"></div>

      <div class="mb-tour-focus" id="mbTourFocus" hidden></div>

      <section class="mb-tour-card"
        id="mbTourCard"
        role="dialog"
        aria-modal="false"
        aria-labelledby="mbTourTitle"
        aria-describedby="mbTourDescription">

        <div class="mb-tour-topline">
          <span class="mb-tour-kicker">
            🌱 ${tr("MavunoBridge guide", "Guide wa MavunoBridge", "Mwongozo wa MavunoBridge")}
          </span>
          <span class="mb-tour-count" id="mbTourCount"></span>
        </div>

        <div class="mb-tour-guide-row">
          <div class="mb-tour-farmer" id="mbTourFarmer"></div>

          <div class="mb-tour-copy">
            <div class="mb-tour-kicker" id="mbTourFarmerName"></div>
            <h2 id="mbTourTitle"></h2>
            <p id="mbTourDescription"></p>
          </div>
        </div>

        <div class="mb-tour-tip" id="mbTourTip" hidden></div>

        <div class="mb-tour-progress">
          <span id="mbTourProgress"></span>
        </div>

        <div class="mb-tour-actions">
          <div class="mb-tour-actions-left">
            <button type="button" id="mbTourClose">
              ${tr("Close", "Funga", "Funga")}
            </button>
            <button type="button" id="mbTourSkip">
              ${tr("Skip tour", "Skip tour", "Ruka ziara")}
            </button>
          </div>

          <div class="mb-tour-actions-right">
            <button type="button" id="mbTourVoice"
              data-mb-voice-toggle></button>
            <button type="button" id="mbTourBack">
              ${tr("← Back", "← Back", "← Nyuma")}
            </button>
            <button type="button" id="mbTourNext" class="mb-primary">
              ${tr("Next →", "Next →", "Mbele →")}
            </button>
          </div>
        </div>

        <div class="mb-tour-language" id="mbTourLanguage"></div>
      </section>
    `;

    document.body.appendChild(tourLayer);

    tourCard = $("#mbTourCard", tourLayer);
    tourFocus = $("#mbTourFocus", tourLayer);

    $("#mbTourClose", tourLayer).addEventListener("click", closeTour);
    $("#mbTourSkip", tourLayer).addEventListener("click", skipTour);
    $("#mbTourBack", tourLayer).addEventListener("click", previousStep);
    $("#mbTourNext", tourLayer).addEventListener("click", nextStep);
    $("#mbTourVoice", tourLayer).addEventListener("click", toggleVoice);

    updateVoiceButtons();

    tourLayer.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeTour();
      }

      if (event.key === "ArrowRight") {
        nextStep();
      }

      if (event.key === "ArrowLeft") {
        previousStep();
      }
    });
  }

  function getTarget(selector) {
    if (!selector) return null;

    const selectors = selector.split(",").map(s => s.trim());

    for (const candidate of selectors) {
      try {
        const found = $(candidate);

        if (found && found.getClientRects().length) {
          return found;
        }
      } catch (_) {}
    }

    return null;
  }

  function getGuideRect() {
    const candidates = [
      ".mb-guide-panel",
      "#guidePanel",
      ".guide-panel",
      ".guide-widget",
      ".mb-guide-button",
      "#guideButton",
      ".floating-guide"
    ];

    for (const selector of candidates) {
      const element = $(selector);

      if (!element || !element.getClientRects().length) continue;

      const rect = element.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) return rect;
    }

    return null;
  }

  function rectsOverlap(a, b, margin = 0) {
    if (!a || !b) return false;

    return !(
      a.right + margin <= b.left ||
      a.left >= b.right + margin ||
      a.bottom + margin <= b.top ||
      a.top >= b.bottom + margin
    );
  }

  function positionTourCard(target) {
    if (!tourCard) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 650;
    const margin = mobile ? 10 : 16;

    const cardRect = tourCard.getBoundingClientRect();
    const cardWidth = Math.min(
      cardRect.width || 570,
      vw - margin * 2
    );
    const cardHeight = Math.min(
      cardRect.height || 260,
      vh - margin * 2
    );

    const guideRect = getGuideRect();
    const targetRect = target?.getBoundingClientRect() || null;

    const topSpace = targetRect
      ? targetRect.top - margin
      : vh / 2;

    const bottomSpace = targetRect
      ? vh - targetRect.bottom - margin
      : vh / 2;

    let top;

    if (mobile) {
      /*
       * On mobile, prefer the side opposite the highlighted target,
       * but avoid placing the card over the existing Guide.
       */
      if (bottomSpace >= cardHeight && bottomSpace >= topSpace) {
        top = vh - cardHeight - margin;
      } else if (topSpace >= cardHeight) {
        top = margin;
      } else {
        top = bottomSpace >= topSpace
          ? vh - cardHeight - margin
          : margin;
      }
    } else {
      top = Math.max(
        margin,
        Math.min(vh - cardHeight - margin, vh - cardHeight - 25)
      );

      if (targetRect) {
        const below = targetRect.bottom + margin;
        const above = targetRect.top - cardHeight - margin;

        if (below + cardHeight <= vh - margin) {
          top = below;
        } else if (above >= margin) {
          top = above;
        }
      }
    }

    top = Math.max(margin, Math.min(top, vh - cardHeight - margin));

    let left = mobile
      ? margin
      : Math.max(margin, (vw - cardWidth) / 2);

    /*
     * Try the opposite side if the card intersects the Guide.
     */
    if (guideRect) {
      const proposed = {
        left,
        top,
        right: left + cardWidth,
        bottom: top + cardHeight
      };

      if (rectsOverlap(proposed, guideRect, 8)) {
        const candidateTops = [
          guideRect.top - cardHeight - margin,
          guideRect.bottom + margin,
          margin,
          vh - cardHeight - margin
        ];

        const validTop = candidateTops.find(candidate => {
          if (candidate < margin || candidate + cardHeight > vh - margin) {
            return false;
          }

          const rect = {
            left,
            top: candidate,
            right: left + cardWidth,
            bottom: candidate + cardHeight
          };

          return !rectsOverlap(rect, guideRect, 8);
        });

        if (validTop !== undefined) top = validTop;
      }
    }

    tourCard.style.left = `${Math.round(left)}px`;
    tourCard.style.top = `${Math.round(top)}px`;
    tourCard.style.width = `${Math.round(cardWidth)}px`;

    updateSpotlight(target);
  }

  function updateSpotlight(target) {
    if (!tourLayer) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const shades = {
      top: $('[data-shade="top"]', tourLayer),
      left: $('[data-shade="left"]', tourLayer),
      right: $('[data-shade="right"]', tourLayer),
      bottom: $('[data-shade="bottom"]', tourLayer)
    };

    if (!target || target === document.body) {
      Object.values(shades).forEach(shade => {
        shade.style.display = "block";
      });

      shades.top.style.cssText =
        `display:block;left:0;top:0;width:${vw}px;height:${vh}px`;
      shades.left.style.display = "none";
      shades.right.style.display = "none";
      shades.bottom.style.display = "none";

      tourFocus.hidden = true;
      return;
    }

    const rect = target.getBoundingClientRect();

    const pad = 7;
    const left = Math.max(0, rect.left - pad);
    const top = Math.max(0, rect.top - pad);
    const right = Math.min(vw, rect.right + pad);
    const bottom = Math.min(vh, rect.bottom + pad);

    shades.top.style.cssText =
      `display:block;left:0;top:0;width:${vw}px;height:${top}px`;

    shades.left.style.cssText =
      `display:block;left:0;top:${top}px;width:${left}px;height:${bottom-top}px`;

    shades.right.style.cssText =
      `display:block;left:${right}px;top:${top}px;width:${vw-right}px;height:${bottom-top}px`;

    shades.bottom.style.cssText =
      `display:block;left:0;top:${bottom}px;width:${vw}px;height:${vh-bottom}px`;

    tourFocus.hidden = false;
    tourFocus.style.left = `${left}px`;
    tourFocus.style.top = `${top}px`;
    tourFocus.style.width = `${Math.max(0, right - left)}px`;
    tourFocus.style.height = `${Math.max(0, bottom - top)}px`;
  }

  function persistProgress() {
    safeSet(STORAGE.progress + PAGE, tourIndex);
  }

  function renderStep() {
    if (!tourLayer || !tourSteps.length) return;

    const current = tourSteps[tourIndex];
    const farmer = getSelectedFarmer();

    $("#mbTourFarmer", tourLayer).innerHTML = farmerSVG(farmer);
    $("#mbTourFarmerName", tourLayer).textContent =
      farmer.names[getLanguage()];

    $("#mbTourTitle", tourLayer).textContent = current.title;
    $("#mbTourDescription", tourLayer).textContent = current.description;

    const tip = $("#mbTourTip", tourLayer);

    if (current.tip) {
      tip.hidden = false;
      tip.textContent = current.tip;
    } else {
      tip.hidden = true;
      tip.textContent = "";
    }

    $("#mbTourCount", tourLayer).textContent =
      `${tourIndex + 1} / ${tourSteps.length}`;

    $("#mbTourProgress", tourLayer).style.width =
      `${((tourIndex + 1) / tourSteps.length) * 100}%`;

    $("#mbTourBack", tourLayer).disabled = tourIndex === 0;

    $("#mbTourNext", tourLayer).textContent =
      tourIndex === tourSteps.length - 1
        ? tr("Finish ✓", "Finish ✓", "Maliza ✓")
        : tr("Next →", "Next →", "Mbele →");

    $("#mbTourLanguage", tourLayer).textContent = tr(
      "Language follows your MavunoBridge language setting.",
      "Language inafuata setting ya language ya MavunoBridge.",
      "Lugha inafuata mpangilio wa lugha wa MavunoBridge."
    );

    updateVoiceButtons();
    persistProgress();

    const target = getTarget(current.selector);

    if (target && target !== document.body) {
      try {
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
          inline: "nearest"
        });
      } catch (_) {}
    }

    requestAnimationFrame(() => {
      positionTourCard(target);
    });

    /*
     * Animate the avatar mouth while the user reads the current
     * step. If voice is enabled, speech events control the animation.
     */
    speak(
      `${current.title}. ${current.description}`,
      farmer
    );
  }

  function startTour() {
    previousFocusedElement = document.activeElement;

    tourSteps = buildSteps();

    if (!tourSteps.length) return;

    makeTourLayer();

    const completed = safeGet(STORAGE.completed + PAGE, "false") === "true";
    const saved = Number(safeGet(STORAGE.progress + PAGE, "0"));

    tourIndex = completed
      ? 0
      : Math.max(0, Math.min(saved || 0, tourSteps.length - 1));

    tourLayer.style.display = "block";
    $("#mbTourLauncher").style.display = "none";
    $("#mbAvatarLauncher").style.display = "none";

    renderStep();
  }

  function nextStep() {
    if (!tourSteps.length) return;

    if (tourIndex >= tourSteps.length - 1) {
      safeSet(STORAGE.completed + PAGE, "true");
      safeSet(STORAGE.progress + PAGE, 0);
      closeTour();
      return;
    }

    tourIndex++;
    renderStep();
  }

  function previousStep() {
    if (tourIndex <= 0) return;

    tourIndex--;
    renderStep();
  }

  function skipTour() {
    safeSet(STORAGE.completed + PAGE, "true");
    safeSet(STORAGE.progress + PAGE, 0);
    closeTour();
  }

  function closeTour() {
    stopSpeech();

    if (tourLayer) {
      tourLayer.style.display = "none";
    }

    const launcher = $("#mbTourLauncher");
    const avatarButton = $("#mbAvatarLauncher");

    if (launcher) launcher.style.display = "";
    if (avatarButton) avatarButton.style.display = "";

    if (
      previousFocusedElement &&
      typeof previousFocusedElement.focus === "function"
    ) {
      try {
        previousFocusedElement.focus({ preventScroll: true });
      } catch (_) {}
    }
  }

  function restartTour() {
    safeRemove(STORAGE.completed + PAGE);
    safeSet(STORAGE.progress + PAGE, 0);
    startTour();
  }

  /* ============================================================
     8. SMART ASSIST AND EXISTING GUIDE INTEGRATION
     ============================================================ */

  function injectFarmerIntoExistingGuide() {
    const guideHead = $(".mb-guide-panel .mb-guide-head");

    if (guideHead && !$(".mb-guide-farmer", guideHead)) {
      const farmer = document.createElement("span");
      farmer.className = "mb-guide-farmer";
      farmer.setAttribute("aria-label", "MavunoBridge farmer assistant");
      farmer.innerHTML = farmerSVG();

      guideHead.prepend(farmer);
    }

    /*
     * Smart Assist may already contain its own assistant avatar.
     * Replace only its artwork, not its surrounding content.
     */
    $$(".sa-assistant-avatar").forEach(element => {
      element.classList.add("mb-smart-farmer-avatar");

      if (!element.dataset.mbFarmerReady) {
        element.innerHTML = farmerSVG();
        element.dataset.mbFarmerReady = "true";
      }
    });
  }

  /* ============================================================
     9. LANGUAGE CHANGES
     ============================================================ */

  function refreshTourLanguage() {
    const launcher = $("#mbTourLauncher");
    const avatarButton = $("#mbAvatarLauncher");

    if (launcher) {
      launcher.textContent = tr(
        "🧭 Website Tour",
        "🧭 Tour ya website",
        "🧭 Ziara ya tovuti"
      );
    }

    if (avatarButton) {
      avatarButton.textContent = tr(
        "👩🏾‍🌾 Choose Farmer",
        "👩🏾‍🌾 Chagua Farmer",
        "👩🏾‍🌾 Chagua Mkulima"
      );
    }

    if (tourLayer && tourLayer.style.display !== "none") {
      tourSteps = buildSteps();
      tourIndex = Math.min(tourIndex, tourSteps.length - 1);
      renderStep();
    }

    applySelectedAvatar();
  }

  document.addEventListener("change", event => {
    if (event.target?.id === "languageSelect") {
      const value = event.target.value;

      if (["en", "mix", "sw"].includes(value)) {
        safeSet(STORAGE.language, value);
      }

      refreshTourLanguage();
    }
  });

  /* ============================================================
     10. RESPONSIVE EVENTS
     ============================================================ */

  function scheduleReposition() {
    if (!tourLayer || tourLayer.style.display === "none") return;

    cancelAnimationFrame(repositionFrame);

    repositionFrame = requestAnimationFrame(() => {
      const current = tourSteps[tourIndex];
      positionTourCard(getTarget(current?.selector));
    });
  }

  window.addEventListener("resize", scheduleReposition, { passive: true });
  window.addEventListener("scroll", scheduleReposition, {
    passive: true,
    capture: true
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleReposition);
    window.visualViewport.addEventListener("scroll", scheduleReposition);
  }

  /* ============================================================
     11. STARTUP
     ============================================================ */

  function initialise() {
    createLauncher();
    applySelectedAvatar();
    injectFarmerIntoExistingGuide();

    /*
     * Keep checking briefly for Guide/Smart Assist elements
     * that other scripts insert after page load.
     */
    let attempts = 0;

    const observer = new MutationObserver(() => {
      injectFarmerIntoExistingGuide();
      applySelectedAvatar();

      attempts++;

      if (attempts > 20) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => observer.disconnect(), 7000);

    /*
     * Automatically show the tour on a first visit to each page.
     * Returning users can resume using the launcher.
     */
    const completed = safeGet(STORAGE.completed + PAGE, "false") === "true";

    if (!completed) {
      setTimeout(() => {
        if (!document.hidden) startTour();
      }, 900);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, {
      once: true
    });
  } else {
    initialise();
  }

  /* ============================================================
     12. OPTIONAL PUBLIC CONTROLS
     ============================================================ */

  window.MavunoBridgeTour = {
    start: startTour,
    restart: restartTour,
    close: closeTour,
    chooseFarmer: openAvatarPicker,
    speak: text => speak(text, getSelectedFarmer()),
    stopSpeaking: stopSpeech,
    setVoiceEnabled: enabled => {
      speechEnabled = Boolean(enabled);
      safeSet(STORAGE.voice, speechEnabled);

      if (!speechEnabled) stopSpeech();

      updateVoiceButtons();
    },
    getSelectedFarmer: () => getSelectedFarmer().id,
    getAvailableVoices: () => {
      refreshVoices();

      return voices.map(voice => ({
        name: voice.name,
        language: voice.lang,
        local: voice.localService
      }));
    }
  };

})();
