/* ================================================================
   MAVUNOBRIDGE — WEBSITE TOUR V6
   2D ANIMATED FARMER ASSISTANT + AVATAR SELECTOR
   ================================================================

   FEATURES
   - Four selectable 2D farmer avatars: 2 women and 2 men
   - Animated mouth while speaking
   - Blinking, waving, nodding, talking and celebrating
   - Optional browser text-to-speech
   - English, Sheng + English, Kiswahili
   - Skippable tour with Next, Back and Finish
   - Remembers completion and tour progress
   - Restart tour at any time
   - Smart Assist avatar integration
   - Buyer + Farmer Guide integration
   - Responsive positioning for phones, tablets and desktop
   - Attempts to avoid covering the existing Guide and important controls
   - Reduced-motion accessibility support
   - No external libraries or image assets
   - Uses localStorage; no backend required

   IMPORTANT:
   Add this script once to your HTML pages.
   ================================================================ */

(() => {
  "use strict";

  if (window.__MAVUNO_TOUR_V6__) return;
  window.__MAVUNO_TOUR_V6__ = true;

  const PAGE = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE = {
    avatar: "mavunobridge_selected_farmer_v6",
    language: "mavunobridge_language_v1",
    languageOld: "mavunobridge_language_v2",
    completed: "mavunobridge_tour_completed_v6",
    progress: "mavunobridge_tour_progress_v6",
    speech: "mavunobridge_tour_speech_v6"
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const safeGet = key => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  const lang = () => {
    const selected = $("#languageSelect")?.value;

    if (["en", "mix", "sw"].includes(selected)) {
      return selected;
    }

    const saved =
      safeGet(STORAGE.language) ||
      safeGet(STORAGE.languageOld);

    return ["en", "mix", "sw"].includes(saved) ? saved : "mix";
  };

  const t = (en, mix, sw) => ({
    en,
    mix,
    sw
  });

  const tr = value => {
    if (typeof value === "string") return value;
    return value?.[lang()] || value?.mix || value?.en || "";
  };

  /* ================================================================
     1. FOUR FARMER CHARACTERS
     ================================================================ */

  const FARMERS = {
    womanA: {
      name: t("Amina", "Amina", "Amina"),
      description: t(
        "Woman farmer · Green farming outfit",
        "Mama mkulima · Green farming outfit",
        "Mkulima mwanamke · Mavazi ya kijani"
      ),
      skin: "#8B5238",
      skinLight: "#A96848",
      hair: "#241B18",
      shirt: "#387B4A",
      shirtLight: "#5E9B5D",
      hat: "#2D693E",
      hatLight: "#77AD55",
      scarf: "#E6B94D",
      hairStyle: "braids",
      faceStyle: "soft",
      accessory: "scarf"
    },

    womanB: {
      name: t("Wanjiku", "Wanjiku", "Wanjiku"),
      description: t(
        "Woman farmer · Blue-green outfit",
        "Mama mkulima · Blue-green outfit",
        "Mkulima mwanamke · Mavazi ya bluu-kijani"
      ),
      skin: "#603923",
      skinLight: "#865035",
      hair: "#171514",
      shirt: "#277E82",
      shirtLight: "#56AAA0",
      hat: "#B37B37",
      hatLight: "#E4B75D",
      scarf: "#F1D7A6",
      hairStyle: "natural",
      faceStyle: "round",
      accessory: "band"
    },

    manA: {
      name: t("Kamau", "Kamau", "Kamau"),
      description: t(
        "Man farmer · Green hat and shirt",
        "Mkulima · Green hat na shati",
        "Mkulima mwanamume · Kofia na shati la kijani"
      ),
      skin: "#965B3E",
      skinLight: "#B87950",
      hair: "#33261E",
      shirt: "#286748",
      shirtLight: "#49895A",
      hat: "#2B6941",
      hatLight: "#77B85C",
      scarf: "#E4C16C",
      hairStyle: "short",
      faceStyle: "long",
      accessory: "hat"
    },

    manB: {
      name: t("Baraka", "Baraka", "Baraka"),
      description: t(
        "Man farmer · Earth-tone farming outfit",
        "Mkulima · Earth-tone farming outfit",
        "Mkulima mwanamume · Mavazi ya rangi za udongo"
      ),
      skin: "#75452E",
      skinLight: "#9D6240",
      hair: "#211A17",
      shirt: "#A65F36",
      shirtLight: "#CF8954",
      hat: "#335C3D",
      hatLight: "#7EA05B",
      scarf: "#E8C77A",
      hairStyle: "curly",
      faceStyle: "broad",
      accessory: "hat"
    }
  };

  function getSelectedFarmerId() {
    const saved = safeGet(STORAGE.avatar);
    return FARMERS[saved] ? saved : "manA";
  }

  let selectedFarmerId = getSelectedFarmerId();

  function selectedFarmer() {
    return FARMERS[selectedFarmerId] || FARMERS.manA;
  }

  /* ================================================================
     2. SVG AVATAR GENERATOR
     ================================================================ */

  function farmerSVG(id = selectedFarmerId) {
    const f = FARMERS[id] || FARMERS.manA;

    let hairBehind = "";
    let hairFront = "";
    let headwear = "";

    if (id === "womanA") {
      hairBehind = `
        <path d="M32 42 Q28 12 60 12 Q92 12 88 44
          L84 74 L76 83 L73 55 L47 55 L43 84 L35 73Z"
          fill="${f.hair}"/>
        <path d="M37 49 L34 76 M43 49 L40 84
          M82 48 L85 75 M76 50 L79 83"
          stroke="${f.hair}" stroke-width="5"
          stroke-linecap="round"/>
      `;
      hairFront = `
        <path d="M36 37 Q39 17 60 18 Q80 17 84 38
          L77 32 L64 34 L51 29 L42 39Z"
          fill="${f.hair}"/>
      `;
      headwear = `
        <path d="M33 34 Q39 8 60 8 Q82 8 87 34Z"
          fill="${f.hat}"/>
        <ellipse cx="60" cy="34" rx="35" ry="7"
          fill="${f.hatLight}"/>
      `;
    } else if (id === "womanB") {
      hairBehind = `
        <path d="M32 44 Q30 14 60 15 Q91 15 88 47
          L86 69 Q78 81 70 67 L68 51 L47 51
          L43 68 Q34 79 31 65Z"
          fill="${f.hair}"/>
        <path d="M39 28 Q44 14 56 16
          M60 16 Q75 14 82 30"
          fill="none" stroke="#44332B" stroke-width="4"
          stroke-linecap="round"/>
      `;
      hairFront = `
        <path d="M35 37 Q36 15 60 16
          Q81 16 85 38 L74 32 L63 36
          L52 31 L42 39Z"
          fill="${f.hair}"/>
      `;
      headwear = `
        <path d="M35 34 Q41 12 60 12 Q79 12 85 34Z"
          fill="${f.hat}"/>
        <ellipse cx="60" cy="34" rx="34" ry="7"
          fill="${f.hatLight}"/>
      `;
    } else if (id === "manB") {
      hairBehind = `
        <path d="M35 43 Q31 20 60 19
          Q88 19 85 44 L81 52 L39 52Z"
          fill="${f.hair}"/>
      `;
      hairFront = `
        <path d="M36 39 Q35 17 60 17
          Q82 17 85 38 L77 32 L68 34
          L60 29 L50 34 L42 39Z"
          fill="${f.hair}"/>
      `;
      headwear = `
        <path d="M33 33 Q38 10 60 10 Q82 10 87 33Z"
          fill="${f.hat}"/>
        <ellipse cx="60" cy="34" rx="35" ry="7"
          fill="${f.hatLight}"/>
      `;
    } else {
      hairBehind = `
        <path d="M36 42 Q34 19 60 19
          Q85 19 84 43 L79 52 L41 52Z"
          fill="${f.hair}"/>
      `;
      hairFront = `
        <path d="M37 39 Q35 18 60 18
          Q82 18 84 38 L76 31 L65 33
          L55 29 L44 36Z"
          fill="${f.hair}"/>
      `;
      headwear = `
        <path d="M33 33 Q38 10 60 10 Q82 10 87 33Z"
          fill="${f.hat}"/>
        <ellipse cx="60" cy="34" rx="35" ry="7"
          fill="${f.hatLight}"/>
      `;
    }

    const faceShape = f.faceStyle === "round"
      ? "M35 47 Q34 24 60 23 Q86 24 85 47 L80 65 Q73 79 60 79 Q47 79 40 65Z"
      : f.faceStyle === "broad"
        ? "M33 45 Q35 22 60 23 Q85 22 87 45 L81 67 Q73 80 60 80 Q47 80 39 67Z"
        : f.faceStyle === "long"
          ? "M37 44 Q36 23 60 23 Q84 23 83 44 L77 68 Q70 81 60 81 Q50 81 43 68Z"
          : "M35 45 Q34 23 60 23 Q86 23 85 45 L79 66 Q72 79 60 79 Q48 79 41 66Z";

    const outfitAccessory = f.accessory === "scarf"
      ? `<path d="M45 79 L60 93 L75 79 L80 88
          L68 106 L60 97 L52 106 L40 88Z"
          fill="${f.scarf}"/>`
      : f.accessory === "band"
        ? `<path d="M34 32 Q60 22 86 32 L84 39
            Q60 30 36 39Z" fill="${f.scarf}"/>`
        : "";

    return `
      <svg class="mb-farmer-art"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        role="presentation"
        focusable="false">

        <defs>
          <linearGradient id="mbSkin${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${f.skinLight}"/>
            <stop offset="100%" stop-color="${f.skin}"/>
          </linearGradient>
          <linearGradient id="mbShirt${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${f.shirtLight}"/>
            <stop offset="100%" stop-color="${f.shirt}"/>
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="59" fill="#E9F4E5"/>

        <path d="M8 94 Q2 70 18 59 Q28 77 8 94Z"
          fill="#8DBE78"/>
        <path d="M103 95 Q120 71 103 57 Q91 78 103 95Z"
          fill="#B4D99A"/>

        <!-- Body -->
        <path d="M24 120 Q25 91 43 80
          L77 80 Q96 91 97 120Z"
          fill="url(#mbShirt${id})"/>

        <path d="M49 82 L60 96 L71 82"
          fill="none" stroke="#DCEBD4" stroke-width="3"
          stroke-linecap="round"/>

        <!-- Neck -->
        <path d="M49 69 L49 83 Q60 91 71 83 L71 69Z"
          fill="url(#mbSkin${id})"/>

        <!-- Waving arm -->
        <g class="mb-farmer-wave">
          <path d="M78 90 Q88 77 91 61
            L96 46 Q98 39 103 41
            Q109 43 106 51 L102 70
            Q100 89 89 100Z"
            fill="url(#mbSkin${id})"/>

          <path d="M97 45 Q91 38 94 33
            Q98 29 102 38 Q106 29 110 34
            Q114 38 108 45"
            fill="url(#mbSkin${id})"/>
        </g>

        ${hairBehind}

        <!-- Ears -->
        <ellipse cx="37" cy="51" rx="6" ry="9"
          fill="${f.skin}"/>
        <ellipse cx="83" cy="51" rx="6" ry="9"
          fill="${f.skin}"/>

        <!-- Face -->
        <path d="${faceShape}"
          fill="url(#mbSkin${id})"/>

        ${hairFront}

        <!-- Cheeks -->
        <ellipse cx="44" cy="60" rx="5" ry="3"
          fill="#D88A77" opacity=".25"/>
        <ellipse cx="76" cy="60" rx="5" ry="3"
          fill="#D88A77" opacity=".25"/>

        <!-- Eyebrows -->
        <path d="M43 45 Q50 41 55 45"
          fill="none" stroke="${f.hair}" stroke-width="2.5"
          stroke-linecap="round"/>
        <path d="M65 45 Q71 41 77 45"
          fill="none" stroke="${f.hair}" stroke-width="2.5"
          stroke-linecap="round"/>

        <!-- Blinking eyes -->
        <g class="mb-farmer-eyes">
          <ellipse cx="50" cy="51" rx="2.8" ry="3.3"
            fill="#241D19"/>
          <ellipse cx="70" cy="51" rx="2.8" ry="3.3"
            fill="#241D19"/>
          <circle cx="50.8" cy="50" r=".8" fill="#FFFFFF"/>
          <circle cx="70.8" cy="50" r=".8" fill="#FFFFFF"/>
        </g>

        <!-- Talking mouth: closed, open and smile states -->
        <g class="mb-farmer-mouth">
          <path class="mb-mouth-closed"
            d="M51 65 Q60 70 69 65"
            fill="none" stroke="#642E28" stroke-width="2.5"
            stroke-linecap="round"/>

          <ellipse class="mb-mouth-open"
            cx="60" cy="66" rx="5" ry="1"
            fill="#642E28"/>

          <ellipse class="mb-mouth-inner"
            cx="60" cy="68" rx="2.5" ry="1"
            fill="#D97978"/>
        </g>

        <!-- Hat / headwear -->
        ${headwear}

        ${outfitAccessory}

        <!-- Small plant -->
        <circle cx="60" cy="107" r="8"
          fill="#D4EBAA"/>
        <path d="M60 112 Q59 104 64 101
          M60 107 Q54 101 52 104"
          fill="none" stroke="#286748" stroke-width="2"
          stroke-linecap="round"/>
      </svg>
    `;
  }

  /* ================================================================
     3. STYLES — RESPONSIVE TOUR AND AVATARS
     ================================================================ */

  const style = document.createElement("style");

  style.id = "mavunobridge-tour-v6-styles";

  style.textContent = `
    .mb-tour-launcher,
    .mb-avatar-open {
      position: fixed;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      max-width: calc(100vw - 24px);
      min-height: 42px;
      padding: 10px 15px;
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 999px;
      background: #245C3B;
      color: #fff;
      font: 700 13px/1.2 system-ui, sans-serif;
      box-shadow: 0 5px 18px rgba(18,50,29,.22);
      cursor: pointer;
      touch-action: manipulation;
    }

    .mb-tour-launcher {
      right: 16px;
      bottom: max(16px, env(safe-area-inset-bottom));
    }

    .mb-avatar-open {
      right: 16px;
      bottom: calc(max(16px, env(safe-area-inset-bottom)) + 54px);
      background: #fff;
      color: #245C3B;
      border: 1px solid #D7E6D6;
    }

    .mb-tour-launcher:hover,
    .mb-avatar-open:hover {
      filter: brightness(1.08);
    }

    .mb-tour-launcher:focus-visible,
    .mb-avatar-open:focus-visible,
    .mb-tour-btn:focus-visible,
    .mb-avatar-option:focus-visible {
      outline: 3px solid #E7BC53;
      outline-offset: 3px;
    }

    .mb-tour-layer[hidden],
    .mb-avatar-layer[hidden] {
      display: none !important;
    }

    .mb-tour-layer {
      position: fixed;
      inset: 0;
      z-index: 10000;
      isolation: isolate;
      pointer-events: none;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .mb-tour-shade {
      position: absolute;
      background: rgba(10, 25, 16, .42);
      pointer-events: auto;
      transition: opacity .15s ease;
    }

    .mb-tour-focus {
      position: fixed;
      z-index: 1;
      border: 2px solid #B5E58C;
      box-shadow:
        0 0 0 4px rgba(181,229,140,.18),
        0 0 24px rgba(181,229,140,.4);
      pointer-events: none;
      transition: top .2s ease, left .2s ease,
        width .2s ease, height .2s ease;
    }

    .mb-tour-card {
      position: fixed;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(510px, calc(100vw - 28px));
      max-height: min(75dvh, 620px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.8);
      border-radius: 21px;
      background: rgba(250, 253, 248, .91);
      color: #193B27;
      box-shadow: 0 15px 55px rgba(12,32,19,.24);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      pointer-events: auto;
      scrollbar-width: thin;
      transition: top .2s ease, bottom .2s ease;
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      margin-bottom: 10px;
    }

    .mb-tour-brand {
      display: flex;
      align-items: center;
      gap: 7px;
      flex: 1;
      min-width: 0;
      font-size: 12px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .mb-tour-mark {
      display: grid;
      place-items: center;
      width: 29px;
      height: 29px;
      flex: 0 0 29px;
      border-radius: 10px;
      background: #245C3B;
      color: white;
      font-size: 15px;
    }

    .mb-tour-count {
      flex: 0 0 auto;
      color: #55735C;
      font-size: 11px;
      font-weight: 700;
    }

    .mb-tour-close {
      width: 32px;
      height: 32px;
      flex: 0 0 32px;
      border: 0;
      border-radius: 50%;
      background: rgba(35,84,53,.09);
      color: #234D33;
      font-size: 23px;
      line-height: 1;
      cursor: pointer;
    }

    .mb-tour-progress {
      width: 100%;
      height: 5px;
      margin-bottom: 13px;
      overflow: hidden;
      border-radius: 99px;
      background: #DCE8D9;
    }

    .mb-tour-progress span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: #418B50;
      transition: width .25s ease;
    }

    .mb-tour-guide-row {
      display: grid;
      grid-template-columns: 91px minmax(0, 1fr);
      align-items: center;
      gap: 13px;
      min-width: 0;
    }

    .mb-tour-farmer,
    .mb-guide-farmer,
    .mb-smart-farmer-avatar,
    .mb-avatar-preview {
      position: relative;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 19px;
      background: #E9F4E5;
    }

    .mb-tour-farmer {
      width: 91px;
      height: 91px;
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-farmer-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .mb-tour-guide-copy {
      min-width: 0;
    }

    .mb-tour-speaking {
      display: inline-block;
      margin-bottom: 5px;
      color: #47824B;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .09em;
      line-height: 1.4;
    }

    .mb-tour-card h2 {
      margin: 0 0 6px;
      color: #1A432A;
      font-size: clamp(17px, 3vw, 22px);
      font-weight: 850;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .mb-tour-card p {
      margin: 0;
      color: #395642;
      font-size: 13px;
      line-height: 1.55;
      overflow-wrap: anywhere;
      white-space: pre-line;
    }

    .mb-tour-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 15px;
      padding-top: 11px;
      border-top: 1px solid rgba(41,94,56,.13);
    }

    .mb-tour-left,
    .mb-tour-right {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
    }

    .mb-tour-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 39px;
      max-width: 100%;
      padding: 9px 12px;
      border: 1px solid #D6E3D4;
      border-radius: 12px;
      background: rgba(255,255,255,.85);
      color: #294C33;
      font: 700 12px/1.2 system-ui, sans-serif;
      cursor: pointer;
      overflow-wrap: anywhere;
    }

    .mb-tour-btn:disabled {
      opacity: .42;
      cursor: not-allowed;
    }

    .mb-tour-next {
      border-color: #245C3B;
      background: #245C3B;
      color: #fff;
    }

    /* Mouth movement synchronized to speech */
    .mb-farmer-mouth .mb-mouth-open,
    .mb-farmer-mouth .mb-mouth-inner {
      opacity: 0;
      transform-box: fill-box;
      transform-origin: center;
    }

    .mb-farmer-mouth .mb-mouth-closed {
      opacity: 1;
    }

    .mb-speaking .mb-farmer-mouth .mb-mouth-closed {
      opacity: 0;
    }

    .mb-speaking .mb-farmer-mouth .mb-mouth-open {
      opacity: 1;
      animation: mbMouthTalk .19s ease-in-out infinite alternate;
    }

    .mb-speaking .mb-farmer-mouth .mb-mouth-inner {
      opacity: 1;
      animation: mbMouthInner .19s ease-in-out infinite alternate;
    }

    .mb-farmer-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: mbFarmerBlink 5s infinite;
    }

    .mb-farmer-wave {
      transform-box: view-box;
      transform-origin: 91px 88px;
      animation: mbFarmerWave 2.8s ease-in-out infinite;
    }

    .mb-farmer-nod .mb-farmer-art {
      animation: mbFarmerNod .65s ease-in-out 2;
    }

    .mb-farmer-celebrate .mb-farmer-art {
      animation: mbFarmerCelebrate .7s ease-in-out 3;
    }

    .mb-farmer-curious .mb-farmer-art {
      animation: mbFarmerCurious .7s ease-in-out 2;
    }

    @keyframes mbFarmerFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes mbFarmerWave {
      0%, 60%, 100% { transform: rotate(0deg); }
      68% { transform: rotate(-12deg); }
      76% { transform: rotate(9deg); }
      84% { transform: rotate(-10deg); }
      92% { transform: rotate(5deg); }
    }

    @keyframes mbFarmerBlink {
      0%, 44%, 48%, 72%, 76%, 100% { transform: scaleY(1); }
      46%, 74% { transform: scaleY(.08); }
    }

    @keyframes mbMouthTalk {
      from { transform: scaleY(.35) scaleX(.8); }
      to { transform: scaleY(1.45) scaleX(1.05); }
    }

    @keyframes mbMouthInner {
      from { transform: scaleY(.3); }
      to { transform: scaleY(1); }
    }

    @keyframes mbFarmerNod {
      0%, 100% { transform: rotate(0); }
      30% { transform: rotate(5deg) translateY(2px); }
      60% { transform: rotate(-3deg); }
    }

    @keyframes mbFarmerCelebrate {
      0%, 100% { transform: translateY(0) rotate(0); }
      35% { transform: translateY(-8px) rotate(-5deg); }
      65% { transform: translateY(-5px) rotate(5deg); }
    }

    @keyframes mbFarmerCurious {
      0%, 100% { transform: rotate(0); }
      50% { transform: rotate(7deg); }
    }

    /* Avatar chooser */
    .mb-avatar-layer {
      position: fixed;
      inset: 0;
      z-index: 11000;
      display: grid;
      place-items: center;
      padding: 14px;
      background: rgba(12, 30, 18, .52);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .mb-avatar-panel {
      width: min(580px, 100%);
      max-height: min(86dvh, 720px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.7);
      border-radius: 23px;
      background: #F8FCF5;
      color: #193B27;
      box-shadow: 0 18px 60px rgba(0,0,0,.24);
    }

    .mb-avatar-panel-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 7px;
    }

    .mb-avatar-panel h2 {
      margin: 0;
      color: #1C4D30;
      font-size: clamp(19px, 4vw, 25px);
      line-height: 1.2;
    }

    .mb-avatar-panel p {
      margin: 6px 0 14px;
      color: #55705A;
      font-size: 13px;
      line-height: 1.5;
    }

    .mb-avatar-close {
      display: grid;
      place-items: center;
      flex: 0 0 36px;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: #E5EFE1;
      color: #245C3B;
      font-size: 23px;
      cursor: pointer;
    }

    .mb-avatar-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 11px;
    }

    .mb-avatar-option {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 10px;
      border: 2px solid #DDE8D9;
      border-radius: 16px;
      background: #fff;
      color: #23432D;
      text-align: left;
      cursor: pointer;
    }

    .mb-avatar-option[aria-pressed="true"] {
      border-color: #418B50;
      background: #EDF7E9;
      box-shadow: 0 0 0 2px rgba(65,139,80,.1);
    }

    .mb-avatar-preview {
      width: 68px;
      height: 68px;
      border-radius: 15px;
    }

    .mb-avatar-copy {
      min-width: 0;
    }

    .mb-avatar-name {
      display: block;
      font-size: 13px;
      font-weight: 850;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    .mb-avatar-desc {
      display: block;
      margin-top: 4px;
      color: #657967;
      font-size: 10px;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    .mb-avatar-selected {
      display: block;
      margin-top: 5px;
      color: #31723E;
      font-size: 10px;
      font-weight: 800;
    }

    .mb-avatar-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 15px;
      padding-top: 12px;
      border-top: 1px solid #E0EADF;
    }

    .mb-avatar-speech-option {
      display: flex;
      align-items: center;
      gap: 9px;
      margin-top: 13px;
      padding: 10px 12px;
      border-radius: 12px;
      background: #EDF5E9;
      color: #355840;
      font-size: 12px;
      line-height: 1.4;
    }

    .mb-avatar-speech-option input {
      width: 17px;
      height: 17px;
      flex: 0 0 17px;
      accent-color: #347447;
    }

    /* Existing Guide avatar integration */
    .mb-guide-panel .mb-guide-head {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .mb-guide-farmer {
      width: 43px;
      height: 43px;
      border-radius: 13px;
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-guide-head-copy {
      flex: 1;
      min-width: 0;
    }

    /* Smart Assist avatar integration */
    .sa-assistant-avatar.mb-smart-farmer-avatar {
      width: 68px;
      height: 68px;
      flex: 0 0 68px;
      border-radius: 18px;
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-smart-farmer-status {
      display: inline-block;
      margin-bottom: 5px;
      color: #43804A;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .08em;
    }

    /* Keep floating controls away from smaller screens' edges */
    @media (max-width: 600px) {
      .mb-tour-launcher {
        right: 10px;
        bottom: max(10px, env(safe-area-inset-bottom));
        min-height: 40px;
        padding: 9px 12px;
        font-size: 12px;
      }

      .mb-avatar-open {
        right: 10px;
        bottom: calc(max(10px, env(safe-area-inset-bottom)) + 48px);
        min-height: 38px;
        padding: 8px 11px;
        font-size: 11px;
      }

      .mb-tour-card {
        width: calc(100vw - 20px);
        max-height: min(54dvh, 450px);
        padding: 11px;
        border-radius: 17px;
      }

      .mb-tour-top {
        margin-bottom: 7px;
      }

      .mb-tour-progress {
        margin-bottom: 9px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 62px minmax(0, 1fr);
        gap: 9px;
      }

      .mb-tour-farmer {
        width: 62px;
        height: 62px;
        border-radius: 14px;
      }

      .mb-tour-card h2 {
        font-size: 16px;
        margin-bottom: 4px;
      }

      .mb-tour-card p {
        font-size: 11px;
        line-height: 1.42;
      }

      .mb-tour-speaking {
        font-size: 8px;
      }

      .mb-tour-controls {
        margin-top: 10px;
        padding-top: 8px;
        gap: 6px;
      }

      .mb-tour-left,
      .mb-tour-right {
        gap: 5px;
      }

      .mb-tour-btn {
        min-height: 35px;
        padding: 8px 9px;
        border-radius: 10px;
        font-size: 11px;
      }

      .mb-tour-brand {
        font-size: 10px;
      }

      .mb-tour-mark {
        width: 25px;
        height: 25px;
        flex-basis: 25px;
      }

      .mb-guide-farmer {
        width: 37px;
        height: 37px;
        border-radius: 11px;
      }

      .sa-assistant-avatar.mb-smart-farmer-avatar {
        width: 54px;
        height: 54px;
        flex-basis: 54px;
        border-radius: 14px;
      }

      .mb-avatar-panel {
        padding: 13px;
        border-radius: 18px;
      }

      .mb-avatar-grid {
        gap: 8px;
      }

      .mb-avatar-option {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 8px;
      }

      .mb-avatar-preview {
        width: 58px;
        height: 58px;
      }

      .mb-avatar-name {
        font-size: 12px;
      }

      .mb-avatar-desc {
        font-size: 10px;
      }
    }

    @media (max-width: 360px) {
      .mb-tour-card {
        width: calc(100vw - 14px);
        max-height: 48dvh;
        padding: 9px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 49px minmax(0, 1fr);
        gap: 7px;
      }

      .mb-tour-farmer {
        width: 49px;
        height: 49px;
      }

      .mb-tour-card h2 {
        font-size: 14px;
      }

      .mb-tour-card p {
        font-size: 10px;
      }

      .mb-tour-btn {
        min-height: 33px;
        padding: 7px;
        font-size: 10px;
      }

      .mb-avatar-grid {
        grid-template-columns: 1fr;
      }

      .mb-avatar-option {
        flex-direction: row;
        align-items: center;
      }

      .mb-avatar-preview {
        width: 54px;
        height: 54px;
      }
    }

    @media (min-width: 900px) {
      .mb-tour-card {
        width: min(510px, calc(100vw - 40px));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb-tour-layer *,
      .mb-avatar-layer *,
      .mb-tour-launcher,
      .mb-avatar-open {
        scroll-behavior: auto !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
  `;

  if (!$("#mavunobridge-tour-v6-styles")) {
    document.head.appendChild(style);
  }

  /* ================================================================
     4. AVATAR RENDERING AND RANDOM EMOTES
     ================================================================ */

  function renderAvatarNode(node) {
    if (!node) return;

    node.innerHTML = farmerSVG();
    node.classList.remove(
      "mb-speaking",
      "mb-farmer-nod",
      "mb-farmer-celebrate",
      "mb-farmer-curious"
    );
  }

  function updateAllAvatars() {
    $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar, .mb-avatar-preview")
      .forEach(node => {
        const avatarId = node.dataset.avatarId || selectedFarmerId;
        node.innerHTML = farmerSVG(avatarId);
      });

    updateAvatarOptions();
  }

  function updateAvatarOptions() {
    $$(".mb-avatar-option").forEach(button => {
      const chosen = button.dataset.avatarId === selectedFarmerId;
      button.setAttribute("aria-pressed", String(chosen));

      const badge = $(".mb-avatar-selected", button);

      if (badge) {
        badge.textContent = chosen
          ? tr(t("Selected ✓", "Huyu ndiye ✓", "Amechaguliwa ✓"))
          : "";
      }
    });
  }

  function chooseAvatar(id) {
    if (!FARMERS[id]) return;

    selectedFarmerId = id;
    safeSet(STORAGE.avatar, id);

    updateAllAvatars();
    animateFarmer("happy");
  }

  function animateFarmer(mood = "talk") {
    const classes = {
      wave: "mb-farmer-wave",
      talk: "mb-speaking",
      nod: "mb-farmer-nod",
      celebrate: "mb-farmer-celebrate",
      curious: "mb-farmer-curious",
      happy: "mb-farmer-nod"
    };

    const className = classes[mood];
    if (!className) return;

    const nodes = $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar");

    nodes.forEach(node => {
      node.classList.remove(
        "mb-farmer-nod",
        "mb-farmer-celebrate",
        "mb-farmer-curious"
      );

      if (mood === "wave") {
        const wave = $(".mb-farmer-wave", node);
        if (wave) {
          wave.style.animation = "none";
          void wave.offsetWidth;
          wave.style.animation = "";
        }
      } else if (mood !== "talk") {
        node.classList.add(className);
        window.setTimeout(() => node.classList.remove(className), 2200);
      }
    });
  }

  let emoteTimer = 0;

  function startRandomEmotes() {
    if (emoteTimer) return;

    const moods = ["wave", "nod", "curious", "happy"];

    emoteTimer = window.setInterval(() => {
      if (document.hidden) return;

      const mood = moods[Math.floor(Math.random() * moods.length)];
      animateFarmer(mood);
    }, 6500);
  }

  function stopRandomEmotes() {
    if (emoteTimer) {
      window.clearInterval(emoteTimer);
      emoteTimer = 0;
    }
  }

  /* ================================================================
     5. OPTIONAL TEXT-TO-SPEECH WITH MOUTH SYNCHRONIZATION
     ================================================================ */

  let speechEnabled = safeGet(STORAGE.speech) === "1";
  let speechGeneration = 0;

  function stopSpeaking() {
    speechGeneration++;

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar")
      .forEach(node => node.classList.remove("mb-speaking"));
  }

  function speakText(text) {
    stopSpeaking();

    if (!speechEnabled || !("speechSynthesis" in window)) return;

    const generation = speechGeneration;
    const utterance = new SpeechSynthesisUtterance(
      String(text || "").replace(/\s+/g, " ").trim()
    );

    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 1;

    if (lang() === "sw") {
      utterance.lang = "sw-KE";
    } else {
      utterance.lang = "en-KE";
    }

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;

      $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar")
        .forEach(node => node.classList.add("mb-speaking"));
    };

    utterance.onend = () => {
      if (generation !== speechGeneration) return;

      $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar")
        .forEach(node => node.classList.remove("mb-speaking"));
    };

    utterance.onerror = () => {
      $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar")
        .forEach(node => node.classList.remove("mb-speaking"));
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      // Tour remains usable even if the browser cannot speak.
    }
  }

  /* ================================================================
     6. TOUR CONTENT
     ================================================================ */

  const makeStep = (target, title, description) => ({
    target,
    title,
    description
  });

  const TOURS = {
    "index.html": [
      makeStep(
        [".topbar", "header", ".navbar"],
        t("Welcome to MavunoBridge!", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
        t(
          "Your digital marketplace for farmers, buyers and agricultural services in Kenya. Let's take a quick tour.",
          "Hapa ni soko ya wakulima na buyers Kenya. Twende tour fupi tuone vile inawork.",
          "Hili ni soko la kidijitali la wakulima, wanunuzi na huduma za kilimo Kenya. Tufanye ziara fupi."
        )
      ),
      makeStep(
        ["#categoryGrid", "#categories", ".category-grid"],
        t("Explore categories", "Explore categories", "Angalia makundi"),
        t(
          "Browse fruits, vegetables, grains, legumes, livestock, farm inputs and more.",
          "Chagua category kama fruits, vegetables, grains, legumes, mifugo na farm inputs.",
          "Chagua kundi kama matunda, mboga, nafaka, jamii ya kunde, mifugo na pembejeo."
        )
      ),
      makeStep(
        [".filters", "#filterBar", ".marketplace-filters"],
        t("Find what you need", "Tafuta unachohitaji", "Tafuta unachohitaji"),
        t(
          "Use search, location and sale-type filters to find suitable products.",
          "Tumia search, location na filters kupata products unataka.",
          "Tumia utafutaji, eneo na vichujio kupata bidhaa zinazokufaa."
        )
      ),
      makeStep(
        ["#listingGrid", ".listing-grid", ".product-grid"],
        t("Browse farmer listings", "Angalia listings za wakulima", "Angalia bidhaa za wakulima"),
        t(
          "Compare products, quantities, prices and farmer details before deciding.",
          "Compare bidhaa, quantity, bei na details za mkulima kabla ya kuamua.",
          "Linganisha bidhaa, kiasi, bei na taarifa za mkulima kabla ya kuamua."
        )
      ),
      makeStep(
        ["#sellButton", "#heroSellButton", '[data-action="sell"]'],
        t("List your products", "Weka bidhaa zako", "Weka bidhaa zako"),
        t(
          "Farmers can add their products, select a category, enter a price and provide contact details.",
          "Wewe ni farmer? Weka bidhaa, chagua category, price na contact details.",
          "Wewe ni mkulima? Weka bidhaa, chagua kundi, bei na maelezo ya mawasiliano."
        )
      ),
      makeStep(
        ["#cartButton", "#cartToggle", '[data-action="cart"]'],
        t("Your cart", "Shopping cart yako", "Kikapu chako"),
        t(
          "Use the cart to keep track of the products you want to buy.",
          "Tumia cart kufuatilia bidhaa unataka kununua.",
          "Tumia kikapu kufuatilia bidhaa unazotaka kununua."
        )
      ),
      makeStep(
        ['a[href="smart-assist.html"]', '[href*="smart-assist"]', "#smartAssistLink"],
        t("Smart Assist", "Smart Assist", "Smart Assist"),
        t(
          "Open Smart Assist for farming guidance, crop planning and helpful information.",
          "Fungua Smart Assist upate ideas za crops, farming na ushauri.",
          "Fungua Smart Assist kwa mwongozo wa kilimo, kupanga mazao na taarifa muhimu."
        )
      ),
      makeStep(
        ['a[href="sacco.html"]', '[href*="sacco"]', "#saccoLink"],
        t("SACCO Hub", "SACCO Hub", "SACCO Hub"),
        t(
          "Explore SACCO opportunities and farmer-support information available in the demo.",
          "Angalia SACCO opportunities na support info kwa wakulima.",
          "Angalia fursa za SACCO na taarifa za kusaidia wakulima."
        )
      ),
      makeStep(
        ['a[href="buyer-requests.html"]', '[href*="buyer-requests"]'],
        t("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        t(
          "Buyers can share what they are looking for so farmers can discover demand.",
          "Buyers wanaweza kuweka wanachotafuta ili farmers wajue demand.",
          "Wanunuzi wanaweza kueleza wanachotafuta ili wakulima wajue mahitaji."
        )
      ),
      makeStep(
        ['a[href="messages.html"]', '[href*="messages"]', "#messagesLink"],
        t("Messages and support", "Messages na support", "Ujumbe na msaada"),
        t(
          "Use the available messaging and support areas to communicate or find help.",
          "Tumia messages na support kupata msaada au kuwasiliana.",
          "Tumia ujumbe na sehemu ya msaada kuwasiliana au kupata usaidizi."
        )
      )
    ],

    "smart-assist.html": [
      makeStep(
        [".sa-hero", ".sa-assistant-intro", "main"],
        t("Meet Smart Assist", "Kutana na Smart Assist", "Kutana na Smart Assist"),
        t(
          "Your farming helper can guide you through the tools available on this page.",
          "Huyu ni farming buddy wako wa kukuonyesha tools za page hii.",
          "Huyu ni msaidizi wa kilimo anayekuonyesha zana za ukurasa huu."
        )
      ),
      makeStep(
        ["#farmPlanner", ".farm-planner"],
        t("Plan your farm", "Panga shamba lako", "Panga shamba lako"),
        t(
          "Explore the farm-planning tools and provide accurate details for more useful suggestions.",
          "Tumia farm planner na uweke details sahihi ili upate suggestions useful.",
          "Tumia zana za kupanga shamba na uweke taarifa sahihi kwa mapendekezo bora."
        )
      ),
      makeStep(
        [".sa-symptom-field", "#saSymptomChecks", "#symptomChecks"],
        t("Check crop symptoms", "Angalia symptoms za crops", "Angalia dalili za mazao"),
        t(
          "Describe the problem you notice. Suggestions are guidance, not a guaranteed diagnosis.",
          "Eleza shida unaona kwa crop. Suggestions ni guidance, si diagnosis ya uhakika.",
          "Eleza tatizo unaloona kwenye zao. Mapendekezo ni mwongozo, si utambuzi wa uhakika."
        )
      ),
      makeStep(
        ["#saPhoto", 'input[type="file"]'],
        t("Add a photo", "Ongeza picha", "Ongeza picha"),
        t(
          "If photo input is available, add a clear crop photo to provide more context.",
          "Kama photo upload inapatikana, weka picha clear ya crop.",
          "Ikiwa kupakia picha kunapatikana, ongeza picha iliyo wazi ya zao."
        )
      ),
      makeStep(
        ["#generateReportButton", "#reportSection"],
        t("Review your report", "Angalia report yako", "Angalia ripoti yako"),
        t(
          "Review the information carefully and confirm important farming decisions with a qualified local expert.",
          "Soma report vizuri. Kwa decision muhimu, confirm na agricultural expert wa eneo lako.",
          "Soma ripoti kwa makini. Kwa maamuzi muhimu, thibitisha na mtaalamu wa kilimo wa eneo lako."
        )
      ),
      makeStep(
        ["#saQuestionForm", "#assistantQuestionForm"],
        t("Ask a question", "Uliza swali", "Uliza swali"),
        t(
          "Enter a clear farming question if the question form is available.",
          "Andika swali clear kuhusu farming kama form inapatikana.",
          "Andika swali lililo wazi kuhusu kilimo ikiwa fomu inapatikana."
        )
      ),
      makeStep(
        ["#saCropLibraryGrid", ".sa-library-controls"],
        t("Explore crop information", "Explore crop info", "Angalia taarifa za mazao"),
        t(
          "Browse the crop information provided in this demo.",
          "Angalia crop information zilizowekwa kwa demo hii.",
          "Angalia taarifa za mazao zilizopo kwenye onyesho hili."
        )
      ),
      makeStep(
        ["#savedReportsSection"],
        t("Saved reports", "Reports ulizohifadhi", "Ripoti ulizohifadhi"),
        t(
          "If saving is supported on this page, revisit your stored reports here.",
          "Kama saving inasupportiwa, unaweza kurudi kuona reports zako hapa.",
          "Ikiwa kuhifadhi kunapatikana, unaweza kuona ripoti ulizohifadhi hapa."
        )
      )
    ],

    "sacco.html": [
      makeStep(
        [".page-hero", "main"],
        t("Welcome to SACCO Hub", "Karibu SACCO Hub", "Karibu SACCO Hub"),
        t(
          "Discover the SACCO and farmer-support information shown in the demo.",
          "Gundua SACCO na farmer-support information kwa demo hii.",
          "Gundua taarifa za SACCO na msaada wa wakulima kwenye onyesho hili."
        )
      ),
      makeStep(
        [".sacco-controls", "#saccoFilters"],
        t("Filter opportunities", "Chuja opportunities", "Chuja fursa"),
        t(
          "Use available controls to narrow down the opportunities you want to explore.",
          "Tumia filters kupata opportunities zinazokufaa.",
          "Tumia vichujio kupata fursa unazotaka kuchunguza."
        )
      ),
      makeStep(
        ["#saccoGrid", ".sacco-grid"],
        t("Explore SACCOs", "Angalia SACCOs", "Angalia SACCOs"),
        t(
          "Review each listing and independently confirm its requirements before joining or sharing personal information.",
          "Soma details na confirm requirements kabla ya kujiunga au kushare personal info.",
          "Soma taarifa na uthibitishe masharti kabla ya kujiunga au kutoa taarifa binafsi."
        )
      ),
      makeStep(
        [".interest-panel", "#interestPanel"],
        t("Show your interest", "Onyesha interest yako", "Onyesha nia yako"),
        t(
          "Use the available interest panel if you want to learn more about an opportunity.",
          "Tumia interest panel kupata details zaidi kuhusu opportunity.",
          "Tumia sehemu ya kuonyesha nia ikiwa unahitaji taarifa zaidi kuhusu fursa."
        )
      )
    ],

    "buyer-requests.html": [
      makeStep(
        [".page-hero", "main"],
        t("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        t(
          "This page helps buyers describe the products they want.",
          "Hapa buyers wanaeleza products wanatafuta.",
          "Hapa wanunuzi wanaeleza bidhaa wanazotafuta."
        )
      ),
      makeStep(
        ["#demandForm"],
        t("Create a request", "Weka request", "Weka ombi"),
        t(
          "Enter the product, quantity and other relevant details clearly.",
          "Weka product, quantity na details muhimu kwa uwazi.",
          "Weka bidhaa, kiasi na taarifa nyingine muhimu kwa uwazi."
        )
      ),
      makeStep(
        ["#demandList"],
        t("View requests", "Angalia requests", "Angalia maombi"),
        t(
          "Browse the requests shown and check the details before contacting anyone.",
          "Angalia requests na details kabla ya kuwasiliana na mtu.",
          "Angalia maombi na taarifa kabla ya kuwasiliana na mtu."
        )
      ),
      makeStep(
        ["#supportForm"],
        t("Need help?", "Unahitaji help?", "Unahitaji msaada?"),
        t(
          "Use the support section if it is available on this page.",
          "Tumia support section kama inapatikana.",
          "Tumia sehemu ya msaada ikiwa inapatikana."
        )
      )
    ],

    "messages.html": [
      makeStep(
        [".messages-notice", "main"],
        t("Messages", "Messages", "Ujumbe"),
        t(
          "This area helps you access the messaging interface included in the demo.",
          "Hapa unaweza kutumia messaging interface iliyowekwa kwa demo.",
          "Hapa unaweza kutumia sehemu ya ujumbe iliyopo kwenye onyesho."
        )
      ),
      makeStep(
        [".conversation-sidebar", "#conversationList"],
        t("Choose a conversation", "Chagua conversation", "Chagua mazungumzo"),
        t(
          "Choose a conversation from the available list.",
          "Chagua conversation kutoka kwa list.",
          "Chagua mazungumzo kutoka kwenye orodha."
        )
      ),
      makeStep(
        [".conversation-panel"],
        t("Read the conversation", "Soma conversation", "Soma mazungumzo"),
        t(
          "Review the messages and confirm who you are communicating with.",
          "Soma messages na hakikisha unajua unawasiliana na nani.",
          "Soma ujumbe na uhakikishe unajua unawasiliana na nani."
        )
      ),
      makeStep(
        ["#messageForm"],
        t("Send a message", "Tuma message", "Tuma ujumbe"),
        t(
          "Use the message form if enabled. Avoid sharing passwords or sensitive personal information.",
          "Tumia message form kama inawork. Usishare password au personal info nyeti.",
          "Tumia fomu ya ujumbe ikiwa inafanya kazi. Usishiriki nywila au taarifa binafsi nyeti."
        )
      )
    ],

    "login.html": [
      makeStep(
        [".auth-visual", "main"],
        t("Welcome", "Karibu", "Karibu"),
        t(
          "This is the demo access page for MavunoBridge.",
          "Hii ni page ya kuingia kwa demo ya MavunoBridge.",
          "Huu ni ukurasa wa kuingia kwenye onyesho la MavunoBridge."
        )
      ),
      makeStep(
        ["#demoLoginForm"],
        t("Demo sign-in", "Demo sign-in", "Kuingia kwenye demo"),
        t(
          "Follow the form instructions. Demo sign-in may not create a real account.",
          "Fuata instructions za form. Demo sign-in inaweza isiunde account halisi.",
          "Fuata maelekezo ya fomu. Kuingia kwenye demo kunaweza kusiunde akaunti halisi."
        )
      ),
      makeStep(
        ["#googleDemoButton"],
        t("Other sign-in options", "Njia zingine za kuingia", "Njia nyingine za kuingia"),
        t(
          "Use an alternative sign-in option only if it is enabled in your demo.",
          "Tumia option nyingine kama imewashwa kwa demo yako.",
          "Tumia njia nyingine ya kuingia ikiwa imewashwa kwenye onyesho lako."
        )
      )
    ]
  };

  const FALLBACK_TOUR = [
    makeStep(
      ["header", ".topbar", "nav", "main"],
      t("Welcome to MavunoBridge", "Karibu MavunoBridge", "Karibu MavunoBridge"),
      t(
        "Your farming marketplace tour starts here. Use Next to explore this page.",
        "Tour ya MavunoBridge inaanzia hapa. Bonyeza Next tuangalie page hii.",
        "Ziara ya MavunoBridge inaanzia hapa. Bonyeza Ifuatayo kuchunguza ukurasa huu."
      )
    ),
    makeStep(
      ["main", "footer"],
      t("Explore the page", "Explore page hii", "Chunguza ukurasa huu"),
      t(
        "Explore the available controls. You can restart this tour whenever you need it.",
        "Explore controls zilizopo. Unaweza kuanza tour tena wakati wowote.",
        "Chunguza vidhibiti vilivyopo. Unaweza kuanza ziara tena wakati wowote."
      )
    )
  ];

  function getSteps() {
    return TOURS[PAGE] || FALLBACK_TOUR;
  }

  /* ================================================================
     7. TOUR INTERFACE
     ================================================================ */

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "mb-tour-launcher";
  launcher.textContent = "🧭 " + tr(t("Website Tour", "Tour ya website", "Ziara ya tovuti"));
  launcher.setAttribute("aria-label", "Open MavunoBridge website tour");

  const avatarOpen = document.createElement("button");
  avatarOpen.type = "button";
  avatarOpen.className = "mb-avatar-open";
  avatarOpen.textContent = "👩🏾‍🌾 " + tr(t("Choose Farmer", "Chagua Farmer", "Chagua Mkulima"));
  avatarOpen.setAttribute("aria-label", "Choose your animated farmer avatar");

  const layer = document.createElement("div");
  layer.className = "mb-tour-layer";
  layer.hidden = true;

  layer.innerHTML = `
    <div class="mb-tour-shade" data-shade="top"></div>
    <div class="mb-tour-shade" data-shade="left"></div>
    <div class="mb-tour-shade" data-shade="right"></div>
    <div class="mb-tour-shade" data-shade="bottom"></div>

    <div class="mb-tour-focus" hidden></div>

    <section class="mb-tour-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbTourTitle"
      aria-describedby="mbTourText">

      <div class="mb-tour-top">
        <div class="mb-tour-brand">
          <span class="mb-tour-mark">M</span>
          <span>MavunoBridge · Tour</span>
        </div>

        <span class="mb-tour-count" id="mbTourCount"></span>

        <button type="button"
          class="mb-tour-close"
          id="mbTourClose"
          aria-label="Close tour">×</button>
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        <span id="mbTourProgress"></span>
      </div>

      <div class="mb-tour-guide-row">
        <div class="mb-tour-farmer"
          role="img"
          aria-label="Animated farmer assistant"></div>

        <div class="mb-tour-guide-copy">
          <span class="mb-tour-speaking" id="mbTourSpeaking">
            YOUR FARMING GUIDE
          </span>
          <h2 id="mbTourTitle"></h2>
          <p id="mbTourText"></p>
        </div>
      </div>

      <label class="mb-avatar-speech-option">
        <input type="checkbox" id="mbTourSpeechToggle">
        <span id="mbTourSpeechLabel">
          Read the guide aloud using browser speech
        </span>
      </label>

      <div class="mb-tour-controls">
        <div class="mb-tour-left">
          <button type="button" class="mb-tour-btn" id="mbTourSkip">
            Skip
          </button>
        </div>

        <div class="mb-tour-right">
          <button type="button" class="mb-tour-btn" id="mbTourBack">
            Back
          </button>

          <button type="button" class="mb-tour-btn" id="mbTourChoose">
            Avatar
          </button>

          <button type="button" class="mb-tour-btn mb-tour-next" id="mbTourNext">
            Next →
          </button>
        </div>
      </div>
    </section>
  `;

  /* ================================================================
     8. AVATAR SELECTOR INTERFACE
     ================================================================ */

  const avatarLayer = document.createElement("div");
  avatarLayer.className = "mb-avatar-layer";
  avatarLayer.hidden = true;

  avatarLayer.innerHTML = `
    <section class="mb-avatar-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbAvatarTitle">

      <div class="mb-avatar-panel-head">
        <div>
          <h2 id="mbAvatarTitle">Choose your farmer</h2>
          <p id="mbAvatarDescription">
            Pick a farmer to guide you around MavunoBridge.
          </p>
        </div>

        <button type="button"
          class="mb-avatar-close"
          id="mbAvatarClose"
          aria-label="Close avatar selection">×</button>
      </div>

      <div class="mb-avatar-grid" id="mbAvatarGrid"></div>

      <div class="mb-avatar-actions">
        <button type="button" class="mb-tour-btn" id="mbAvatarCancel">
          Cancel
        </button>
        <button type="button" class="mb-tour-btn mb-tour-next" id="mbAvatarDone">
          Use this farmer ✓
        </button>
      </div>
    </section>
  `;

  document.body.append(launcher, avatarOpen, layer, avatarLayer);

  const inTour = selector => $(selector, layer);
  const tourCard = inTour(".mb-tour-card");
  const focusRing = inTour(".mb-tour-focus");

  const shades = Object.fromEntries(
    $$(".mb-tour-shade", layer).map(node => [node.dataset.shade, node])
  );

  function buildAvatarChoices() {
    const grid = $("#mbAvatarGrid", avatarLayer);
    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(FARMERS).forEach(([id, f]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mb-avatar-option";
      button.dataset.avatarId = id;
      button.setAttribute("aria-pressed", String(id === selectedFarmerId));

      const preview = document.createElement("span");
      preview.className = "mb-avatar-preview";
      preview.dataset.avatarId = id;
      preview.innerHTML = farmerSVG(id);

      const copy = document.createElement("span");
      copy.className = "mb-avatar-copy";

      const name = document.createElement("span");
      name.className = "mb-avatar-name";
      name.textContent = tr(f.name);

      const description = document.createElement("span");
      description.className = "mb-avatar-desc";
      description.textContent = tr(f.description);

      const badge = document.createElement("span");
      badge.className = "mb-avatar-selected";
      badge.textContent = id === selectedFarmerId
        ? tr(t("Selected ✓", "Huyu ndiye ✓", "Amechaguliwa ✓"))
        : "";

      copy.append(name, description, badge);
      button.append(preview, copy);

      button.addEventListener("click", () => {
        chooseAvatar(id);
        updateAvatarOptions();
      });

      grid.appendChild(button);
    });
  }

  /* ================================================================
     9. GUIDE AND SMART ASSIST AVATAR INTEGRATION
     ================================================================ */

  function addGuideAvatar() {
    const header = $(".mb-guide-panel .mb-guide-head");

    if (!header || $(".mb-guide-farmer", header)) return;

    const avatar = document.createElement("div");
    avatar.className = "mb-guide-farmer";
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", "Animated MavunoBridge farmer guide");
    avatar.dataset.avatarId = selectedFarmerId;
    avatar.innerHTML = farmerSVG();

    const headingGroup = header.querySelector("div");

    if (headingGroup) {
      headingGroup.classList.add("mb-guide-head-copy");
      header.insertBefore(avatar, headingGroup);
    } else {
      header.prepend(avatar);
    }
  }

  function addSmartAssistAvatar() {
    if (PAGE !== "smart-assist.html") return;

    const avatar = $(".sa-assistant-avatar");
    if (!avatar) return;

    avatar.classList.add("mb-smart-farmer-avatar");
    avatar.dataset.avatarId = selectedFarmerId;
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", "Animated farming assistant");
    avatar.innerHTML = farmerSVG();

    const intro = $(".sa-assistant-intro");
    if (!intro || $(".mb-smart-farmer-status", intro)) return;

    const status = document.createElement("span");
    status.className = "mb-smart-farmer-status";
    status.textContent = lang() === "sw"
      ? "MSAIDIZI WA SHAMBA"
      : lang() === "en"
        ? "FARM ASSISTANT"
        : "FARM BUDDY · READY";

    const heading = $("#assistantWelcome", intro) || $("h3", intro);

    if (heading) {
      heading.parentNode.insertBefore(status, heading);
    } else {
      intro.appendChild(status);
    }
  }

  function setupAvatars() {
    addGuideAvatar();
    addSmartAssistAvatar();
    updateAllAvatars();
  }

  /* ================================================================
     10. FIND TOUR TARGETS
     ================================================================ */

  function getTarget(selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];

    for (const selector of list) {
      if (!selector) continue;

      try {
        const target = $(selector);

        if (
          target &&
          target.getClientRects().length &&
          getComputedStyle(target).display !== "none" &&
          getComputedStyle(target).visibility !== "hidden"
        ) {
          return target;
        }
      } catch {
        // Ignore invalid selectors and try the next candidate.
      }
    }

    return null;
  }

  /* ================================================================
     11. SMART SPOTLIGHT AND RESPONSIVE CARD PLACEMENT
     ================================================================ */

  let steps = getSteps();
  let index = 0;
  let tourOpen = false;
  let avatarOpenState = false;
  let lastFocused = null;
  let animationFrame = 0;
  let lastSpeechText = "";

  function setShade(name, left, top, width, height) {
    const node = shades[name];

    node.style.left = `${Math.max(0, left)}px`;
    node.style.top = `${Math.max(0, top)}px`;
    node.style.width = `${Math.max(0, width)}px`;
    node.style.height = `${Math.max(0, height)}px`;
  }

  function positionSpotlight(target) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!target) {
      setShade("top", 0, 0, vw, vh);
      setShade("left", 0, 0, 0, 0);
      setShade("right", 0, 0, 0, 0);
      setShade("bottom", 0, 0, 0, 0);
      focusRing.hidden = true;
      return;
    }

    const rect = target.getBoundingClientRect();

    if (
      rect.bottom <= 0 ||
      rect.top >= vh ||
      rect.right <= 0 ||
      rect.left >= vw
    ) {
      positionSpotlight(null);
      return;
    }

    const pad = 6;
    const left = Math.max(3, rect.left - pad);
    const top = Math.max(3, rect.top - pad);
    const right = Math.min(vw - 3, rect.right + pad);
    const bottom = Math.min(vh - 3, rect.bottom + pad);

    setShade("top", 0, 0, vw, top);
    setShade("left", 0, top, left, bottom - top);
    setShade("right", right, top, vw - right, bottom - top);
    setShade("bottom", 0, bottom, vw, vh - bottom);

    focusRing.hidden = false;
    focusRing.style.left = `${left}px`;
    focusRing.style.top = `${top}px`;
    focusRing.style.width = `${right - left}px`;
    focusRing.style.height = `${bottom - top}px`;

    focusRing.style.borderRadius =
      getComputedStyle(target).borderRadius || "10px";
  }

  function rectanglesOverlap(a, b) {
    if (!a || !b) return false;

    return !(
      a.right <= b.left ||
      a.left >= b.right ||
      a.bottom <= b.top ||
      a.top >= b.bottom
    );
  }

  function positionTourCard(target) {
    if (!tourOpen) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = vw <= 600 ? 7 : 14;

    const guide = $(".mb-guide-panel");
    const guideRect = guide && getComputedStyle(guide).display !== "none"
      ? guide.getBoundingClientRect()
      : null;

    const cardHeight = Math.min(
      tourCard.scrollHeight || 260,
      vw <= 600 ? vh * 0.54 : vh * 0.75
    );

    const cardWidth = Math.min(
      vw - margin * 2,
      vw <= 600 ? 510 : 510
    );

    const targetRect = target ? target.getBoundingClientRect() : null;

    const candidates = [
      { name: "bottom", top: vh - cardHeight - margin },
      { name: "top", top: margin },
      { name: "middle", top: (vh - cardHeight) / 2 }
    ];

    function score(candidate) {
      const proposed = {
        left: (vw - cardWidth) / 2,
        right: (vw + cardWidth) / 2,
        top: candidate.top,
        bottom: candidate.top + cardHeight
      };

      let penalty = 0;

      if (targetRect && rectanglesOverlap(proposed, targetRect)) {
        penalty += 1000;
      }

      if (guideRect && rectanglesOverlap(proposed, guideRect)) {
        penalty += 1500;
      }

      if (proposed.top < margin) penalty += 500;
      if (proposed.bottom > vh - margin) penalty += 500;

      // Prefer bottom on desktop; on mobile, use whichever
      // available region avoids the Guide and highlighted target.
      if (candidate.name === "bottom") penalty += 0;
      if (candidate.name === "top") penalty += 10;
      if (candidate.name === "middle") penalty += 20;

      return penalty;
    }

    candidates.forEach(candidate => {
      candidate.top = Math.max(
        margin,
        Math.min(candidate.top, vh - cardHeight - margin)
      );
      candidate.score = score(candidate);
    });

    candidates.sort((a, b) => a.score - b.score);

    const chosen = candidates[0];

    tourCard.style.left = "50%";
    tourCard.style.transform = "translateX(-50%)";
    tourCard.style.top = `${chosen.top}px`;
    tourCard.style.bottom = "auto";
    tourCard.style.width = `${cardWidth}px`;
    tourCard.style.maxHeight =
      `${Math.max(130, vh - chosen.top - margin)}px`;
  }

  function scheduleReposition() {
    if (!tourOpen || animationFrame) return;

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = 0;

      const target = getTarget(steps[index]?.target);
      positionSpotlight(target);
      positionTourCard(target);
    });
  }

  /* ================================================================
     12. TOUR WORDING
     ================================================================ */

  function labels() {
    if (lang() === "sw") {
      return {
        step: "Hatua",
        skip: "Ruka",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        avatar: "Mkulima",
        speaking: "MSAIDIZI WAKO WA KILIMO",
        speech: "Soma mwongozo kwa sauti ya browser",
        launcher: "🧭 Ziara ya Tovuti",
        choose: "Chagua Mkulima"
      };
    }

    if (lang() === "en") {
      return {
        step: "Step",
        skip: "Skip",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        avatar: "Avatar",
        speaking: "YOUR FARMING GUIDE",
        speech: "Read guide aloud using browser speech",
        launcher: "🧭 Website Tour",
        choose: "Choose Farmer"
      };
    }

    return {
      step: "Step",
      skip: "Skip tour",
      back: "Back",
      next: "Next →",
      finish: "Finish ✓",
      avatar: "Farmer",
      speaking: "FARM BUDDY WAKO",
      speech: "Soma guide aloud using browser speech",
      launcher: "🧭 Website Tour",
      choose: "Chagua Farmer"
    };
  }

  function renderStep(shouldScroll = true) {
    if (!steps.length) return;

    index = Math.max(0, Math.min(index, steps.length - 1));

    const current = steps[index];
    const words = labels();
    const target = getTarget(current.target);

    inTour("#mbTourTitle").textContent = tr(current.title);
    inTour("#mbTourText").textContent = tr(current.description);
    inTour("#mbTourCount").textContent =
      `${words.step} ${index + 1} / ${steps.length}`;

    inTour("#mbTourProgress").style.width =
      `${((index + 1) / steps.length) * 100}%`;

    inTour("#mbTourSkip").textContent = words.skip;
    inTour("#mbTourBack").textContent = words.back;
    inTour("#mbTourBack").disabled = index === 0;

    inTour("#mbTourNext").textContent =
      index === steps.length - 1 ? words.finish : words.next;

    inTour("#mbTourChoose").textContent = words.avatar;
    inTour("#mbTourSpeaking").textContent = words.speaking;

    inTour("#mbTourSpeechLabel").textContent = words.speech;
    inTour("#mbTourSpeechToggle").checked = speechEnabled;

    if (shouldScroll && target) {
      target.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    stopSpeaking();

    lastSpeechText = tr(current.description);

    if (speechEnabled) {
      // Give layout a moment to settle before speaking.
      window.setTimeout(() => {
        if (tourOpen) speakText(lastSpeechText);
      }, shouldScroll && target ? 250 : 50);
    } else {
      animateFarmer(index % 2 === 0 ? "wave" : "nod");
    }

    window.setTimeout(() => {
      if (!tourOpen) return;

      const freshTarget = getTarget(steps[index]?.target);
      positionSpotlight(freshTarget);
      positionTourCard(freshTarget);
    }, shouldScroll && target ? 350 : 20);

    safeSet(STORAGE.progress, JSON.stringify({
      page: PAGE,
      index,
      updatedAt: Date.now()
    }));
  }

  /* ================================================================
     13. REMEMBER TOUR PROGRESS
     ================================================================ */

  function completed() {
    return safeGet(`${STORAGE.completed}:${PAGE}`) === "1";
  }

  function markCompleted() {
    safeSet(`${STORAGE.completed}:${PAGE}`, "1");
  }

  function clearCompleted() {
    try {
      localStorage.removeItem(`${STORAGE.completed}:${PAGE}`);
    } catch {}
  }

  function savedProgress() {
    try {
      const data = JSON.parse(safeGet(STORAGE.progress) || "null");

      if (data && data.page === PAGE && Number.isInteger(data.index)) {
        return Math.max(0, Math.min(data.index, getSteps().length - 1));
      }
    } catch {}

    return 0;
  }

  /* ================================================================
     14. OPEN / CLOSE TOUR
     ================================================================ */

  function openTour(options = {}) {
    stopSpeaking();

    lastFocused = document.activeElement;
    steps = getSteps();

    index = options.resume ? savedProgress() : 0;

    tourOpen = true;
    layer.hidden = false;
    launcher.hidden = true;
    avatarOpen.hidden = true;

    renderStep(true);

    window.addEventListener("resize", scheduleReposition);
    window.addEventListener("scroll", scheduleReposition, true);

    inTour("#mbTourNext").focus({ preventScroll: true });

    animateFarmer("wave");
  }

  function closeTour(options = {}) {
    stopSpeaking();

    layer.hidden = true;
    launcher.hidden = false;
    avatarOpen.hidden = false;
    tourOpen = false;

    window.removeEventListener("resize", scheduleReposition);
    window.removeEventListener("scroll", scheduleReposition, true);

    if (options.finished) {
      markCompleted();

      safeSet(STORAGE.progress, JSON.stringify({
        page: PAGE,
        index: 0,
        finished: true,
        updatedAt: Date.now()
      }));

      animateFarmer("celebrate");
    } else if (options.skipped) {
      // Remember where the user stopped so they can resume.
      safeSet(STORAGE.progress, JSON.stringify({
        page: PAGE,
        index,
        finished: false,
        updatedAt: Date.now()
      }));
    }

    if (lastFocused && typeof lastFocused.focus === "function") {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch {}
    }
  }

  function finishOrAdvance() {
    if (index < steps.length - 1) {
      index++;
      renderStep(true);
      animateFarmer("nod");
    } else {
      closeTour({ finished: true });
    }
  }

  /* ================================================================
     15. AVATAR SELECTOR OPEN / CLOSE
     ================================================================ */

  let focusBeforeAvatar = null;

  function openAvatarChooser() {
    focusBeforeAvatar = document.activeElement;
    avatarOpenState = true;
    avatarLayer.hidden = false;

    buildAvatarChoices();
    updateAvatarOptions();

    $("#mbAvatarDone").focus({ preventScroll: true });
  }

  function closeAvatarChooser() {
    avatarOpenState = false;
    avatarLayer.hidden = true;

    if (focusBeforeAvatar && typeof focusBeforeAvatar.focus === "function") {
      try {
        focusBeforeAvatar.focus({ preventScroll: true });
      } catch {}
    }
  }

  /* ================================================================
     16. EVENT HANDLERS
     ================================================================ */

  launcher.addEventListener("click", () => {
    clearCompleted();
    openTour();
  });

  avatarOpen.addEventListener("click", openAvatarChooser);

  inTour("#mbTourClose").addEventListener("click", () => {
    closeTour({ skipped: true });
  });

  inTour("#mbTourSkip").addEventListener("click", () => {
    closeTour({ skipped: true });
  });

  inTour("#mbTourBack").addEventListener("click", () => {
    if (index > 0) {
      index--;
      renderStep(true);
      animateFarmer("nod");
    }
  });

  inTour("#mbTourNext").addEventListener("click", finishOrAdvance);

  inTour("#mbTourChoose").addEventListener("click", openAvatarChooser);

  inTour("#mbTourSpeechToggle").addEventListener("change", event => {
    speechEnabled = Boolean(event.target.checked);
    safeSet(STORAGE.speech, speechEnabled ? "1" : "0");

    if (speechEnabled) {
      speakText(lastSpeechText);
    } else {
      stopSpeaking();
    }
  });

  $("#mbAvatarClose", avatarLayer).addEventListener(
    "click",
    closeAvatarChooser
  );

  $("#mbAvatarCancel", avatarLayer).addEventListener(
    "click",
    closeAvatarChooser
  );

  $("#mbAvatarDone", avatarLayer).addEventListener("click", () => {
    closeAvatarChooser();

    if (tourOpen && speechEnabled) {
      speakText(lastSpeechText);
    }
  });

  avatarLayer.addEventListener("click", event => {
    if (event.target === avatarLayer) closeAvatarChooser();
  });

  document.addEventListener("keydown", event => {
    if (avatarOpenState) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAvatarChooser();
      }
      return;
    }

    if (!tourOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour({ skipped: true });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      finishOrAdvance();
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      index--;
      renderStep(true);
    }
  });

  $("#languageSelect")?.addEventListener("change", () => {
    setupAvatars();

    launcher.textContent = labels().launcher;
    avatarOpen.textContent = "👩🏾‍🌾 " + labels().choose;

    if (tourOpen) renderStep(false);
    if (avatarOpenState) buildAvatarChoices();
  });

  /* ================================================================
     17. AUTOMATIC FIRST-VISIT TOUR
     ================================================================ */

  function startIfNewVisitor() {
    if (completed()) return;

    window.setTimeout(() => {
      if (!tourOpen && !avatarOpenState) {
        openTour({ resume: true });
      }
    }, 900);
  }

  /* ================================================================
     18. OBSERVE DYNAMIC GUIDE / SMART ASSIST ELEMENTS
     ================================================================ */

  function initialize() {
    setupAvatars();

    startRandomEmotes();

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        startIfNewVisitor,
        { once: true }
      );
    } else {
      startIfNewVisitor();
    }
  }

  const observer = new MutationObserver(() => {
    addGuideAvatar();
    addSmartAssistAvatar();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.setTimeout(() => {
    observer.disconnect();
    setupAvatars();
  }, 7000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSpeaking();
    }
  });

  initialize();

  console.info("MavunoBridge Tour V6 ready.");
})();
