/* ================================================================
   MAVUNOBRIDGE — RESPONSIVE WEBSITE TOUR + 2D FARMER
   Complete replacement for website-tour.js

   FEATURES
   - First-visit tutorial with Skip, Back, Next and Finish
   - Restartable tour with per-page progress
   - Smart positioning on mobile, tablet and desktop
   - Animated 2D cartoon farmer
   - Wave, blink, talk, nod and celebrate animations
   - Optional browser text-to-speech
   - English, Sheng-English and Kiswahili
   - Existing Guide avatar integration
   - Smart Assist farmer avatar integration
   - Spotlight highlighting and auto-scroll
   - Keyboard controls and reduced-motion support
   - No external libraries or image assets
   ================================================================ */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_TOUR_V6__) return;
  window.__MAVUNOBRIDGE_TOUR_V6__ = true;

  const PAGE = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE = "mavunobridge_tour_v6";
  const LANGUAGE_KEYS = [
    "mavunobridge_language_v1",
    "mavunobridge_language_v2"
  ];

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const phrase = (en, mix, sw) => ({ en, mix, sw });

  const makeStep = (target, title, description) => ({
    target,
    title,
    description
  });

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================================================================
     1. LANGUAGE SUPPORT
     ================================================================ */

  function getLanguage() {
    const selected = $("#languageSelect")?.value;

    if (["en", "mix", "sw"].includes(selected)) {
      return selected;
    }

    try {
      for (const key of LANGUAGE_KEYS) {
        const saved = localStorage.getItem(key);

        if (["en", "mix", "sw"].includes(saved)) {
          return saved;
        }
      }
    } catch {}

    return "mix";
  }

  function translate(value) {
    if (typeof value === "string") return value;

    return value?.[getLanguage()] ||
      value?.mix ||
      value?.en ||
      "";
  }

  /* ================================================================
     2. ANIMATED 2D CARTOON FARMER
     ================================================================ */

  const FARMER_SVG = `
  <svg class="mb6-art"
       viewBox="0 0 120 140"
       xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">

    <ellipse cx="60" cy="133" rx="31" ry="5"
      fill="#17462d" opacity=".15"/>

    <!-- Legs -->
    <path d="M39 101 L38 120 Q38 125 44 125
      L52 125 Q56 124 55 119 L56 103Z"
      fill="#17613b"/>

    <path d="M62 102 L64 120 Q64 125 69 125
      L78 125 Q83 124 80 119 L77 101Z"
      fill="#17613b"/>

    <!-- Boots -->
    <path d="M39 118 L53 118 L56 127 Q57 132 51 133
      L31 133 Q28 130 33 125Z"
      fill="#44352b"/>

    <path d="M64 118 L79 118 L84 127 Q85 132 78 133
      L61 133 Q58 130 62 125Z"
      fill="#44352b"/>

    <path d="M33 130 L53 130 M62 130 L81 130"
      stroke="#77604b" stroke-width="2"
      stroke-linecap="round"/>

    <!-- Shirt -->
    <path d="M39 58 Q48 53 59 56 Q73 53 81 61
      L88 91 L77 103 L38 103 L29 91Z"
      fill="#a95432"/>

    <!-- Neck -->
    <path d="M48 48 L48 61 Q58 69 68 60 L67 47Z"
      fill="#bd7048"/>

    <!-- Left arm -->
    <path d="M38 65 Q30 72 30 84 L28 96
      Q29 101 34 99 L40 82 L48 72Z"
      fill="#c8794d"/>

    <!-- Animated right arm -->
    <g class="mb6-wave-arm">
      <path d="M79 65 Q87 72 87 84 L92 97
        Q94 102 89 104 Q84 105 82 99
        L74 82 L69 72Z"
        fill="#c8794d"/>

      <path d="M88 98 Q83 93 85 89 Q88 86 91 92
        L94 97 Q98 92 101 95 Q104 99 98 104
        L93 109 Q88 109 88 103Z"
        fill="#d58a5c"/>
    </g>

    <!-- Overalls -->
    <path d="M36 68 Q46 62 51 66 L68 66
      Q76 63 83 70 L80 104 Q79 109 73 109
      L44 109 Q38 108 37 103Z"
      fill="#237448"/>

    <path d="M44 62 L73 62 L76 88
      Q75 93 70 93 L48 93 Q43 92 43 87Z"
      fill="#2d8050"/>

    <path d="M43 63 L49 80 M73 63 L69 80"
      stroke="#2d8050" stroke-width="7"
      stroke-linecap="round"/>

    <rect x="41" y="62" width="7" height="6"
      rx="1.5" fill="#e9bd56"/>

    <rect x="70" y="62" width="7" height="6"
      rx="1.5" fill="#e9bd56"/>

    <path d="M51 77 L67 77 L67 87 L51 87Z"
      fill="#1a5d39" stroke="#3c9860"
      stroke-width="1.4"/>

    <!-- Ears -->
    <ellipse cx="34" cy="43" rx="6" ry="8"
      fill="#c8794d"/>

    <ellipse cx="83" cy="43" rx="6" ry="8"
      fill="#bd7048"/>

    <!-- Head and expressions -->
    <g class="mb6-head">
      <ellipse cx="59" cy="43" rx="26" ry="30"
        fill="#d88a59"/>

      <path d="M35 39 Q32 21 48 16 Q70 10 81 27
        L84 39 Q74 30 63 30 Q47 28 35 39Z"
        fill="#3e2d22"/>

      <path class="mb6-brows"
        d="M43 36 Q49 32 54 36 M65 36 Q71 32 76 36"
        stroke="#39271e" stroke-width="2.5"
        fill="none" stroke-linecap="round"/>

      <!-- Blinking eyes -->
      <g class="mb6-eyes">
        <ellipse cx="49" cy="42" rx="2.6" ry="3.5"
          fill="#2b211b"/>

        <ellipse cx="69" cy="42" rx="2.6" ry="3.5"
          fill="#2b211b"/>

        <circle cx="49.8" cy="41" r=".9" fill="white"/>
        <circle cx="69.8" cy="41" r=".9" fill="white"/>
      </g>

      <ellipse cx="59" cy="49" rx="4" ry="4.5"
        fill="#c16e44"/>

      <path class="mb6-mouth"
        d="M49 56 Q59 65 70 55"
        fill="none"
        stroke="#6e3024"
        stroke-width="2.6"
        stroke-linecap="round"/>
    </g>

    <!-- Green farmer hat -->
    <g class="mb6-hat">
      <path d="M35 27 Q38 6 59 6
        Q80 6 84 27Z"
        fill="#397c3d"/>

      <ellipse cx="59" cy="28" rx="37" ry="8"
        fill="#20592f"/>

      <path d="M42 24 Q47 10 59 10
        Q72 10 77 24"
        fill="none"
        stroke="#8fbd67"
        stroke-width="2"/>

      <path d="M52 12 Q59 8 67 12"
        fill="none"
        stroke="#b4d887"
        stroke-width="2"
        stroke-linecap="round"/>
    </g>

    <!-- Small growing plant -->
    <path d="M16 119 L16 132"
      stroke="#387a42" stroke-width="2.5"/>

    <path d="M16 126 Q4 123 7 115
      Q17 116 16 126Z"
      fill="#6ea94e"/>

    <path d="M16 122 Q24 112 28 119
      Q26 126 16 122Z"
      fill="#438b46"/>

  </svg>`;

  /* ================================================================
     3. TOUR CONTENT
     ================================================================ */

  const TOURS = {
    "index.html": [
      makeStep(
        [".topbar", "header", "nav"],
        phrase("Welcome to MavunoBridge", "Karibu MavunoBridge 🌱", "Karibu MavunoBridge"),
        phrase(
          "Connect with farmers, buyers and agricultural services in one place.",
          "Hapa ni soko ya farmers na buyers — all in one place!",
          "Kutana na wakulima, wanunuzi na huduma za kilimo."
        )
      ),

      makeStep(
        ["#categoryGrid", "#categories", ".category-grid"],
        phrase("Explore categories", "Chagua category yako", "Chagua kundi la bidhaa"),
        phrase(
          "Explore fruits, vegetables, grains, legumes, livestock and more.",
          "Angalia fruits, veggies, grains, livestock na zingine.",
          "Chunguza matunda, mboga, nafaka, mifugo na mengine."
        )
      ),

      makeStep(
        [".filters", "#filterForm", ".marketplace-filters"],
        phrase("Find products faster", "Tafuta bidhaa haraka", "Tafuta bidhaa kwa urahisi"),
        phrase(
          "Use search, location and sorting to find relevant listings.",
          "Tumia search na location kupata unachotaka.",
          "Tumia utafutaji na eneo kupata bidhaa unazohitaji."
        )
      ),

      makeStep(
        ["#listingGrid", ".listing-grid"],
        phrase("Browse products", "Angalia bidhaa", "Tazama bidhaa"),
        phrase(
          "Compare the details, prices and seller information.",
          "Compare bei na details kabla ya kununua.",
          "Linganisha bei na maelezo kabla ya kununua."
        )
      ),

      makeStep(
        ["#sellButton", "#heroSellButton"],
        phrase("Sell your harvest", "Uza mavuno yako", "Uza mavuno yako"),
        phrase(
          "Farmers can add products, quantities, county, prices and photos.",
          "Wewe ni farmer? Weka bidhaa, quantity, county, bei na picha.",
          "Wakulima wanaweza kuweka bidhaa, kiasi, eneo, bei na picha."
        )
      ),

      makeStep(
        ["#cartButton", "#cart"],
        phrase("Your cart", "Shopping cart yako", "Kikapu chako"),
        phrase(
          "Keep track of the products you want to buy.",
          "Weka bidhaa kwa cart ili uzipate kwa urahisi.",
          "Fuatilia bidhaa unazotaka kununua."
        )
      ),

      makeStep(
        ['a[href="smart-assist.html"]', '[href*="smart-assist"]'],
        phrase("Smart Assist", "Smart Assist", "Msaidizi wa kilimo"),
        phrase(
          "Explore farming tips, crop guidance and plant-problem support.",
          "Pata tips za kilimo na msaada wa crop problems.",
          "Pata mwongozo wa kilimo na msaada kuhusu matatizo ya mimea."
        )
      ),

      makeStep(
        ['a[href="sacco.html"]', '[href*="sacco.html"]'],
        phrase("SACCO Hub", "SACCO Hub", "SACCO Hub"),
        phrase(
          "Explore the SACCO information and opportunities in this demo.",
          "Angalia SACCOs na opportunities zilizowekwa kwa demo.",
          "Chunguza taarifa za SACCO na fursa zilizopo kwenye demo."
        )
      ),

      makeStep(
        ['a[href="buyer-requests.html"]', '[href*="buyer-requests"]'],
        phrase("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        phrase(
          "Review requests or post what products you need.",
          "Angalia requests au weka bidhaa unayotafuta.",
          "Tazama maombi au weka ombi la bidhaa unayohitaji."
        )
      ),

      makeStep(
        ['a[href="messages.html"]', '[href*="messages.html"]'],
        phrase("Messages and support", "Messages na support", "Ujumbe na usaidizi"),
        phrase(
          "Use messaging if it is enabled in your demo.",
          "Tumia messages kama feature imewashwa kwa demo yako.",
          "Tumia ujumbe ikiwa kipengele hiki kimewezeshwa."
        )
      )
    ],

    "smart-assist.html": [
      makeStep(
        [".sa-hero", ".sa-assistant-intro", "main"],
        phrase("Meet your Farm Buddy", "Huyu ni Farm Buddy wako", "Huyu ni msaidizi wako wa kilimo"),
        phrase(
          "Explore farming questions and guidance here.",
          "Uliza maswali ya kilimo na upate mwongozo.",
          "Uliza maswali kuhusu kilimo hapa."
        )
      ),

      makeStep(
        ["#farmPlanner", ".farm-planner"],
        phrase("Plan your farm", "Panga shamba lako", "Panga shamba lako"),
        phrase(
          "Use the available fields to organise your farming plans.",
          "Tumia sehemu hii kupanga shughuli za shamba.",
          "Tumia sehemu hii kupanga shughuli za kilimo."
        )
      ),

      makeStep(
        [".sa-symptom-field", "#saSymptomChecks", "#symptomChecks"],
        phrase("Plant problems", "Shida za mimea", "Matatizo ya mimea"),
        phrase(
          "Choose the symptoms you have noticed.",
          "Chagua symptoms umeona kwa mmea.",
          "Chagua dalili ulizoona kwenye mmea."
        )
      ),

      makeStep(
        ["#saPhoto", 'input[type="file"]'],
        phrase("Add a plant photo", "Weka picha ya mmea", "Weka picha ya mmea"),
        phrase(
          "If photo upload is enabled, use a clear image.",
          "Kama photo upload inafanya kazi, weka picha iliyo clear.",
          "Ikiwa kupakia picha kunapatikana, weka picha iliyo wazi."
        )
      ),

      makeStep(
        ["#generateReportButton", "#reportSection"],
        phrase("Create a report", "Tengeneza report", "Tengeneza ripoti"),
        phrase(
          "Organise your observations. Demo guidance is not a guaranteed diagnosis.",
          "Tengeneza report ya observations. Ushauri wa demo si diagnosis ya uhakika.",
          "Panga ulichokiona. Ushauri wa demo si utambuzi wa uhakika."
        )
      ),

      makeStep(
        ["#saQuestionForm", "#assistantQuestionForm"],
        phrase("Ask a question", "Uliza swali", "Uliza swali"),
        phrase(
          "Ask about crops, soil or farm planning.",
          "Uliza kuhusu crops, soil au mipango ya shamba.",
          "Uliza kuhusu mazao, udongo au mipango ya shamba."
        )
      ),

      makeStep(
        [".sa-library-controls", "#saCropLibraryGrid"],
        phrase("Crop library", "Crop library", "Maktaba ya mazao"),
        phrase(
          "Browse available crop information and farming notes.",
          "Angalia crop information na tips zilizopo.",
          "Chunguza taarifa za mazao na maelezo ya kilimo."
        )
      ),

      makeStep(
        ["#savedReportsSection", "#savedReports"],
        phrase("Saved reports", "Reports zilizohifadhiwa", "Ripoti zilizohifadhiwa"),
        phrase(
          "Return to your reports if saving is enabled.",
          "Rudi kwa reports zako kama saving imewashwa.",
          "Rudi kwenye ripoti zako ikiwa kuhifadhi kumewashwa."
        )
      )
    ],

    "sacco.html": [
      makeStep(
        [".page-hero", "main"],
        phrase("Welcome to SACCO Hub", "Karibu SACCO Hub", "Karibu SACCO Hub"),
        phrase(
          "Explore agricultural finance information and opportunities.",
          "Angalia taarifa za finance na opportunities za kilimo.",
          "Chunguza taarifa za fedha na fursa za kilimo."
        )
      ),

      makeStep(
        [".sacco-controls", "#saccoFilters"],
        phrase("Find relevant options", "Tafuta options zinazokufaa", "Tafuta chaguo zinazokufaa"),
        phrase(
          "Use the available filters to narrow down your choices.",
          "Tumia filters kupata options zinazokufaa.",
          "Tumia vichujio kupata chaguo zinazokufaa."
        )
      ),

      makeStep(
        ["#saccoGrid", ".sacco-card"],
        phrase("Explore SACCOs", "Angalia SACCOs", "Chunguza SACCOs"),
        phrase(
          "Read the details and verify information with the organisation.",
          "Soma details na uthibitishe na organisation husika.",
          "Soma taarifa na uzithibitishe na shirika husika."
        )
      ),

      makeStep(
        [".interest-panel", "#interestForm"],
        phrase("Show your interest", "Onyesha interest yako", "Onyesha nia yako"),
        phrase(
          "Use the interest form if available in this demo.",
          "Tumia interest form kama inapatikana kwa demo.",
          "Tumia fomu ya kuonyesha nia ikiwa inapatikana."
        )
      )
    ],

    "buyer-requests.html": [
      makeStep(
        [".page-hero", "main"],
        phrase("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        phrase(
          "This page helps buyers describe the products they need.",
          "Hapa buyers wanaweza kueleza bidhaa wanatafuta.",
          "Hapa wanunuzi wanaeleza bidhaa wanazohitaji."
        )
      ),

      makeStep(
        ["#demandForm", "form"],
        phrase("Create a request", "Weka request", "Weka ombi"),
        phrase(
          "Enter the product and relevant details.",
          "Weka bidhaa na details zinazohitajika.",
          "Weka bidhaa na maelezo yanayohitajika."
        )
      ),

      makeStep(
        ["#demandList", ".demand-list"],
        phrase("Browse requests", "Angalia requests", "Tazama maombi"),
        phrase(
          "See what other buyers are looking for.",
          "Angalia buyers wengine wanahitaji nini.",
          "Angalia bidhaa ambazo wanunuzi wengine wanatafuta."
        )
      ),

      makeStep(
        ["#supportForm", ".support-form"],
        phrase("Get support", "Pata support", "Pata usaidizi"),
        phrase(
          "Use the support area if you need help.",
          "Tumia support kama unahitaji msaada.",
          "Tumia sehemu ya usaidizi ukihitaji msaada."
        )
      )
    ],

    "messages.html": [
      makeStep(
        [".messages-notice", "main"],
        phrase("Messages", "Messages", "Ujumbe"),
        phrase(
          "Use this area for marketplace conversations when enabled.",
          "Hapa ni kwa conversations za marketplace ikiwa zimewashwa.",
          "Tumia sehemu hii kwa mazungumzo ikiwa imewezeshwa."
        )
      ),

      makeStep(
        [".conversation-sidebar", "#conversationList"],
        phrase("Choose a conversation", "Chagua conversation", "Chagua mazungumzo"),
        phrase(
          "Select a conversation if demo conversations are available.",
          "Chagua conversation kama demo messages zipo.",
          "Chagua mazungumzo ikiwa yanapatikana."
        )
      ),

      makeStep(
        [".conversation-panel", "#conversationPanel"],
        phrase("Read messages", "Soma messages", "Soma ujumbe"),
        phrase(
          "Review the conversation and check who you are speaking with.",
          "Soma messages na hakikisha unajua unawasiliana na nani.",
          "Soma ujumbe na uhakikishe unayewasiliana naye."
        )
      ),

      makeStep(
        ["#messageForm", "form"],
        phrase("Write a message", "Andika message", "Andika ujumbe"),
        phrase(
          "Send a message if messaging is enabled in this demo.",
          "Tuma message kama feature imewashwa.",
          "Tuma ujumbe ikiwa kipengele hiki kimewezeshwa."
        )
      )
    ]
  };

  const FALLBACK = [
    makeStep(
      ["header", ".topbar", "nav"],
      phrase("Welcome to MavunoBridge", "Karibu MavunoBridge 🌱", "Karibu MavunoBridge"),
      phrase(
        "Let's take a quick tour of this page.",
        "Twende tour fupi ya page hii.",
        "Tutazunguka ukurasa huu kwa muda mfupi."
      )
    ),

    makeStep(
      ["main", "body"],
      phrase("Explore this page", "Explore page hii", "Chunguza ukurasa huu"),
      phrase(
        "Try the features available here.",
        "Jaribu features zilizopo hapa.",
        "Jaribu vipengele vilivyopo hapa."
      )
    )
  ];

  const getSteps = () => TOURS[PAGE] || FALLBACK;

  /* ================================================================
     4. RESPONSIVE CSS
     ================================================================ */

  const css = document.createElement("style");

  css.textContent = `
    .mb6-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .mb6-head {
      transform-box: fill-box;
      transform-origin: center bottom;
      animation: mb6-head-bob 3s ease-in-out infinite;
    }

    .mb6-wave-arm {
      transform-box: view-box;
      transform-origin: 81px 75px;
      animation: mb6-wave 3s ease-in-out infinite;
    }

    .mb6-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: mb6-blink 4.7s infinite;
    }

    .mb6-hat {
      transform-box: fill-box;
      transform-origin: center bottom;
      animation: mb6-hat-bob 3s ease-in-out infinite;
    }

    .mb6-mouth {
      transform-box: fill-box;
      transform-origin: center;
    }

    .mb6-farmer {
      width: 100%;
      height: 100%;
      animation: mb6-float 3s ease-in-out infinite;
    }

    .mb6-farmer.mb6-talking .mb6-mouth {
      animation: mb6-talk .22s ease-in-out infinite alternate;
    }

    .mb6-farmer.mb6-nod .mb6-head {
      animation: mb6-nod .5s ease-in-out 2;
    }

    .mb6-farmer.mb6-happy .mb6-head {
      animation: mb6-happy .5s ease-in-out 2;
    }

    .mb6-farmer.mb6-celebrate .mb6-head {
      animation: mb6-celebrate .6s ease-in-out 3;
    }

    .mb6-farmer.mb6-wave-now .mb6-wave-arm {
      animation: mb6-wave-now .45s ease-in-out 4;
    }

    .mb-tour-launcher-v6 {
      position: fixed !important;
      z-index: 100002 !important;
      left: max(12px, env(safe-area-inset-left)) !important;
      bottom: max(12px, env(safe-area-inset-bottom)) !important;
      top: auto !important;
      right: auto !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 44px !important;
      max-width: calc(100vw - 24px) !important;
      padding: 10px 15px !important;
      border: 1px solid rgba(255,255,255,.3) !important;
      border-radius: 999px !important;
      background: #205d39 !important;
      color: white !important;
      box-shadow: 0 5px 18px rgba(16,48,29,.26) !important;
      font: 800 12px/1.2 system-ui,sans-serif !important;
      cursor: pointer !important;
      white-space: normal !important;
      touch-action: manipulation !important;
    }

    .mb-tour-launcher-v6[hidden] {
      display: none !important;
    }

    .mb-tour-layer-v6 {
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      z-index: 100003 !important;
      overflow: hidden !important;
      isolation: isolate;
      pointer-events: none;
      font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }

    .mb-tour-layer-v6[hidden] {
      display: none !important;
    }

    .mb-tour-shade-v6 {
      position: fixed;
      background: rgba(8,25,14,.38);
      pointer-events: auto;
    }

    .mb-tour-focus-v6 {
      position: fixed;
      z-index: 1;
      border: 2px solid #9ad76d;
      border-radius: 12px;
      box-shadow: 0 0 0 3px rgba(154,215,109,.2);
      pointer-events: none;
    }

    .mb-tour-card-v6 {
      position: fixed !important;
      z-index: 4 !important;
      top: max(16px, env(safe-area-inset-top)) !important;
      right: 16px !important;
      left: auto !important;
      bottom: auto !important;
      width: min(430px, calc(100vw - 32px)) !important;
      max-width: calc(100vw - 32px) !important;
      max-height: calc(100dvh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      overscroll-behavior: contain;
      pointer-events: auto;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.8);
      border-radius: 20px;
      background: rgba(250,253,248,.91);
      color: #193e28;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      box-shadow: 0 12px 38px rgba(7,31,16,.23);
      overflow-wrap: anywhere;
      animation: mb6-card-in .22s ease both;
    }

    .mb-tour-top-v6 {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mb-tour-brand-v6 {
      display: flex;
      align-items: center;
      gap: 7px;
      flex: 1 1 auto;
      min-width: 0;
      font-size: 12px;
      font-weight: 850;
      color: #245a37;
    }

    .mb-tour-logo-v6 {
      display: grid;
      place-items: center;
      flex: 0 0 27px;
      width: 27px;
      height: 27px;
      border-radius: 9px;
      background: #286940;
      color: white;
      font-weight: 900;
    }

    .mb-tour-count-v6 {
      flex: 0 0 auto;
      color: #4e6a54;
      font-size: 10px;
      font-weight: 800;
      white-space: nowrap;
    }

    .mb-tour-close-v6 {
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 50%;
      background: #e5efe1;
      color: #234e31;
      font-size: 22px;
      cursor: pointer;
      touch-action: manipulation;
    }

    .mb-tour-progress-v6 {
      height: 5px;
      margin: 9px 0;
      overflow: hidden;
      border-radius: 20px;
      background: #e1eadc;
    }

    .mb-tour-progress-v6 span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg,#438b4e,#b1d75f);
      transition: width .2s ease;
    }

    .mb-tour-content-v6 {
      display: grid;
      grid-template-columns: 92px minmax(0,1fr);
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .mb-tour-avatar-v6 {
      display: grid;
      place-items: center;
      width: 92px;
      height: 112px;
      min-width: 0;
      border-radius: 16px;
      background: linear-gradient(145deg,#eff8e8,#d6edca);
      overflow: hidden;
    }

    .mb-tour-kicker-v6 {
      display: block;
      margin-bottom: 5px;
      color: #4e8548;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .06em;
    }

    .mb-tour-card-v6 h2 {
      margin: 0 0 7px;
      color: #183d27;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 850;
      overflow-wrap: anywhere;
    }

    .mb-tour-card-v6 p {
      margin: 0;
      color: #385541;
      font-size: 13px;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    .mb-tour-controls-v6 {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 7px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(37,83,47,.13);
    }

    .mb-tour-group-v6 {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      min-width: 0;
    }

    .mb-tour-btn-v6 {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 40px;
      padding: 8px 11px;
      border: 1px solid #d6e3d1;
      border-radius: 11px;
      background: rgba(255,255,255,.9);
      color: #2b5939;
      font: 750 11px/1.2 system-ui,sans-serif;
      white-space: normal;
      overflow-wrap: anywhere;
      cursor: pointer;
      touch-action: manipulation;
    }

    .mb-tour-btn-v6:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-tour-next-v6 {
      background: #286940;
      border-color: #286940;
      color: white;
    }

    .mb-tour-btn-v6:focus-visible,
    .mb-tour-close-v6:focus-visible,
    .mb-tour-launcher-v6:focus-visible {
      outline: 3px solid #a4d96f;
      outline-offset: 2px;
    }

    /* Existing Guide avatar */
    .mb-guide-head {
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
      min-width: 0 !important;
    }

    .mb-guide-farmer-v6 {
      flex: 0 0 48px;
      width: 48px;
      height: 56px;
      overflow: hidden;
      border-radius: 12px;
      background: #e8f5df;
    }

    .mb-guide-head-copy-v6 {
      flex: 1 1 0%;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    /* Smart Assist avatar */
    .sa-assistant-avatar.mb-smart-farmer-v6 {
      display: flex !important;
      align-items: center;
      justify-content: center;
      flex: 0 0 76px;
      width: 76px;
      height: 88px;
      overflow: hidden;
      border-radius: 17px !important;
      background: #e6f3dd !important;
    }

    .mb-smart-status-v6 {
      display: inline-block;
      margin-bottom: 5px;
      padding: 4px 7px;
      border-radius: 20px;
      background: #e6f4dd;
      color: #2d7040;
      font-size: 9px;
      font-weight: 900;
    }

    /* Optional narration controls */
    .mb-tour-voice-v6 {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      min-height: 36px;
      padding: 7px 9px;
      border: 1px solid #d6e3d1;
      border-radius: 10px;
      background: #fff;
      color: #286940;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      touch-action: manipulation;
    }

    @keyframes mb6-float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    @keyframes mb6-head-bob {
      0%,100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-1px) rotate(1deg); }
    }

    @keyframes mb6-wave {
      0%,72%,100% { transform: rotate(0); }
      80% { transform: rotate(-10deg); }
      87% { transform: rotate(8deg); }
      94% { transform: rotate(-6deg); }
    }

    @keyframes mb6-wave-now {
      0%,100% { transform: rotate(0); }
      25% { transform: rotate(-20deg); }
      50% { transform: rotate(16deg); }
      75% { transform: rotate(-15deg); }
    }

    @keyframes mb6-hat-bob {
      0%,100% { transform: rotate(0); }
      50% { transform: rotate(-1deg) translateY(-1px); }
    }

    @keyframes mb6-blink {
      0%,43%,47%,76%,80%,100% { transform: scaleY(1); }
      45%,78% { transform: scaleY(.12); }
    }

    @keyframes mb6-talk {
      from { transform: scaleY(.6); }
      to { transform: scaleY(1.5); }
    }

    @keyframes mb6-nod {
      0%,100% { transform: rotate(0); }
      35% { transform: rotate(7deg); }
      70% { transform: rotate(-5deg); }
    }

    @keyframes mb6-happy {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-3px) rotate(3deg); }
    }

    @keyframes mb6-celebrate {
      0%,100% { transform: translateY(0) rotate(0); }
      25% { transform: translateY(-5px) rotate(-5deg); }
      75% { transform: translateY(-5px) rotate(5deg); }
    }

    @keyframes mb6-card-in {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* TABLETS */
    @media (min-width: 601px) and (max-width: 1024px) {
      .mb-tour-card-v6 {
        top: max(14px, env(safe-area-inset-top)) !important;
        right: 14px !important;
        width: min(390px, calc(100vw - 28px)) !important;
      }

      .mb-tour-content-v6 {
        grid-template-columns: 78px minmax(0,1fr);
      }

      .mb-tour-avatar-v6 {
        width: 78px;
        height: 94px;
      }
    }

    /* PHONES */
    @media (max-width: 600px) {
      .mb-tour-card-v6 {
        top: max(8px, env(safe-area-inset-top)) !important;
        left: 8px !important;
        right: 8px !important;
        bottom: auto !important;
        width: auto !important;
        max-width: none !important;

        max-height: min(
          42dvh,
          calc(
            100dvh - 95px -
            env(safe-area-inset-top,0px) -
            env(safe-area-inset-bottom,0px)
          )
        ) !important;

        padding: 10px;
        border-radius: 16px;
      }

      .mb-tour-content-v6 {
        grid-template-columns: 60px minmax(0,1fr);
        gap: 9px;
      }

      .mb-tour-avatar-v6 {
        width: 60px;
        height: 74px;
        border-radius: 12px;
      }

      .mb-tour-card-v6 h2 {
        font-size: 15px;
        margin-bottom: 4px;
      }

      .mb-tour-card-v6 p {
        font-size: 11px;
        line-height: 1.35;
      }

      .mb-tour-kicker-v6 {
        font-size: 8px;
        margin-bottom: 3px;
      }

      .mb-tour-controls-v6 {
        gap: 5px;
        margin-top: 8px;
        padding-top: 7px;
      }

      .mb-tour-group-v6 {
        gap: 4px;
      }

      .mb-tour-btn-v6 {
        min-height: 38px;
        padding: 7px 9px;
        font-size: 10px;
      }

      .mb-tour-brand-v6 {
        font-size: 10px;
      }

      .mb-tour-launcher-v6 {
        left: max(10px, env(safe-area-inset-left)) !important;
        bottom: max(10px, env(safe-area-inset-bottom)) !important;
        min-height: 40px !important;
        padding: 9px 12px !important;
        font-size: 11px !important;
      }

      .mb-guide-farmer-v6 {
        flex-basis: 38px;
        width: 38px;
        height: 45px;
      }

      .sa-assistant-avatar.mb-smart-farmer-v6 {
        flex-basis: 60px;
        width: 60px;
        height: 70px;
      }
    }

    /* SMALL PHONES */
    @media (max-width: 360px) {
      .mb-tour-card-v6 {
        left: 6px !important;
        right: 6px !important;
        max-height: 40dvh !important;
        padding: 8px;
      }

      .mb-tour-content-v6 {
        grid-template-columns: 48px minmax(0,1fr);
        gap: 7px;
      }

      .mb-tour-avatar-v6 {
        width: 48px;
        height: 60px;
      }

      .mb-tour-card-v6 h2 {
        font-size: 13px;
      }

      .mb-tour-card-v6 p {
        font-size: 10px;
      }

      .mb-tour-controls-v6 {
        flex-wrap: wrap;
      }

      .mb-tour-btn-v6 {
        min-height: 36px;
        padding: 6px 7px;
        font-size: 9px;
      }
    }

    /* LANDSCAPE PHONES */
    @media (max-width: 900px) and (orientation: landscape) {
      .mb-tour-card-v6 {
        top: max(5px, env(safe-area-inset-top)) !important;
        left: 8px !important;
        right: auto !important;
        width: min(420px, calc(100vw - 16px)) !important;
        max-height: calc(
          100dvh - 10px -
          env(safe-area-inset-top,0px) -
          env(safe-area-inset-bottom,0px)
        ) !important;
        padding: 8px;
      }

      .mb-tour-content-v6 {
        grid-template-columns: 48px minmax(0,1fr);
        gap: 7px;
      }

      .mb-tour-avatar-v6 {
        width: 48px;
        height: 56px;
      }

      .mb-tour-card-v6 h2 {
        font-size: 14px;
      }

      .mb-tour-card-v6 p {
        font-size: 10px;
      }

      .mb-tour-progress-v6 {
        margin: 5px 0;
      }

      .mb-tour-controls-v6 {
        margin-top: 5px;
        padding-top: 5px;
      }
    }

    /* SHORT DESKTOP WINDOWS */
    @media (min-width: 601px) and (max-height: 550px) {
      .mb-tour-card-v6 {
        top: 8px !important;
        max-height: calc(100dvh - 16px) !important;
        padding: 9px;
      }

      .mb-tour-avatar-v6 {
        width: 60px;
        height: 72px;
      }

      .mb-tour-card-v6 h2 {
        font-size: 16px;
      }

      .mb-tour-card-v6 p {
        font-size: 11px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb6-farmer,
      .mb6-head,
      .mb6-wave-arm,
      .mb6-eyes,
      .mb6-hat,
      .mb-tour-card-v6,
      .mb-guide-farmer-v6,
      .sa-assistant-avatar.mb-smart-farmer-v6 {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(css);

  /* ================================================================
     5. AVATAR INTEGRATION
     ================================================================ */

  function addGuideAvatar() {
    const header = $(".mb-guide-panel .mb-guide-head");

    if (!header || $(".mb-guide-farmer-v6", header)) return;

    const possibleHeading = [...header.children].find(
      child => child.tagName === "DIV"
    );

    const avatar = document.createElement("div");
    avatar.className = "mb-guide-farmer-v6";
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", "Animated 2D farmer guide");
    avatar.innerHTML = `<div class="mb6-farmer">${FARMER_SVG}</div>`;

    if (possibleHeading) {
      possibleHeading.classList.add("mb-guide-head-copy-v6");
      header.insertBefore(avatar, possibleHeading);
    } else {
      header.prepend(avatar);
    }
  }

  function addSmartAssistAvatar() {
    if (PAGE !== "smart-assist.html") return;

    const avatar = $(".sa-assistant-avatar");

    if (!avatar) return;

    if (!avatar.classList.contains("mb-smart-farmer-v6")) {
      avatar.classList.add("mb-smart-farmer-v6");
      avatar.setAttribute("role", "img");
      avatar.setAttribute("aria-label", "MavunoBridge animated farming assistant");
      avatar.innerHTML = `<div class="mb6-farmer">${FARMER_SVG}</div>`;
    }

    const intro = $(".sa-assistant-intro");

    if (!intro || $(".mb-smart-status-v6", intro)) return;

    const status = document.createElement("span");
    status.className = "mb-smart-status-v6";

    status.textContent =
      getLanguage() === "sw"
        ? "MSAIDIZI WA SHAMBA"
        : getLanguage() === "en"
          ? "FARM ASSISTANT"
          : "FARM BUDDY · READY";

    const heading =
      $("#assistantWelcome", intro) ||
      $("h3", intro);

    if (heading) {
      heading.parentNode.insertBefore(status, heading);
    } else {
      intro.appendChild(status);
    }
  }

  function setupAvatars() {
    addGuideAvatar();
    addSmartAssistAvatar();
  }

  /* ================================================================
     6. CREATE TOUR UI
     ================================================================ */

  const launcher = document.createElement("button");

  launcher.type = "button";
  launcher.className = "mb-tour-launcher-v6";
  launcher.textContent = "🧭 Website Tour";
  launcher.setAttribute("aria-label", "Open or restart website tour");

  document.body.appendChild(launcher);

  const layer = document.createElement("div");

  layer.className = "mb-tour-layer-v6";
  layer.hidden = true;

  layer.innerHTML = `
    <div class="mb-tour-shade-v6" data-shade="top"></div>
    <div class="mb-tour-shade-v6" data-shade="left"></div>
    <div class="mb-tour-shade-v6" data-shade="right"></div>
    <div class="mb-tour-shade-v6" data-shade="bottom"></div>

    <div class="mb-tour-focus-v6" hidden></div>

    <section class="mb-tour-card-v6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbTourTitleV6"
      aria-describedby="mbTourTextV6">

      <div class="mb-tour-top-v6">
        <div class="mb-tour-brand-v6">
          <span class="mb-tour-logo-v6">M</span>
          <span>MavunoBridge · Tour</span>
        </div>

        <span class="mb-tour-count-v6" id="mbTourCountV6"></span>

        <button type="button"
          class="mb-tour-close-v6"
          id="mbTourCloseV6"
          aria-label="Close tour">×</button>
      </div>

      <div class="mb-tour-progress-v6" aria-hidden="true">
        <span id="mbTourProgressV6"></span>
      </div>

      <div class="mb-tour-content-v6">
        <div class="mb-tour-avatar-v6">
          <div class="mb6-farmer">${FARMER_SVG}</div>
        </div>

        <div>
          <span class="mb-tour-kicker-v6" id="mbTourKickerV6">
            YOUR FARMING GUIDE
          </span>

          <h2 id="mbTourTitleV6"></h2>
          <p id="mbTourTextV6"></p>
        </div>
      </div>

      <div class="mb-tour-controls-v6">
        <div class="mb-tour-group-v6">
          <button type="button" class="mb-tour-btn-v6" id="mbTourSkipV6">
            Skip
          </button>

          <button type="button" class="mb-tour-voice-v6"
            id="mbTourVoiceV6" aria-pressed="false"
            title="Read the tour aloud">🔊 Voice</button>
        </div>

        <div class="mb-tour-group-v6">
          <button type="button" class="mb-tour-btn-v6" id="mbTourBackV6">
            Back
          </button>

          <button type="button"
            class="mb-tour-btn-v6 mb-tour-next-v6"
            id="mbTourNextV6">Next →</button>
        </div>
      </div>
    </section>
  `;

  document.body.appendChild(layer);

  const inTour = selector => $(selector, layer);
  const focusRing = inTour(".mb-tour-focus-v6");

  const shades = Object.fromEntries(
    $$(".mb-tour-shade-v6", layer).map(node => [node.dataset.shade, node])
  );

  let steps = getSteps();
  let index = 0;
  let isOpen = false;
  let previousFocus = null;
  let repositionFrame = 0;
  let emoteTimer = 0;
  let voiceEnabled = false;
  let lastSpoken = "";

  /* ================================================================
     7. TOUR PROGRESS STORAGE
     ================================================================ */

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(`${STORAGE}:${PAGE}`) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(completed = false) {
    try {
      localStorage.setItem(
        `${STORAGE}:${PAGE}`,
        JSON.stringify({
          index,
          completed,
          updatedAt: Date.now()
        })
      );
    } catch {}
  }

  function isCompleted() {
    return readProgress().completed === true;
  }

  /* ================================================================
     8. TARGET SELECTION AND SMART POSITIONING
     ================================================================ */

  function getTarget(selectors) {
    const candidates = Array.isArray(selectors)
      ? selectors
      : [selectors];

    for (const selector of candidates) {
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
      } catch {}
    }

    return null;
  }

  function setShade(name, x, y, width, height) {
    const node = shades[name];

    node.style.left = `${Math.max(0, x)}px`;
    node.style.top = `${Math.max(0, y)}px`;
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
      setShade("top", 0, 0, vw, vh);
      setShade("left", 0, 0, 0, 0);
      setShade("right", 0, 0, 0, 0);
      setShade("bottom", 0, 0, 0, 0);
      focusRing.hidden = true;
      return;
    }

    const padding = 6;
    const left = Math.max(3, rect.left - padding);
    const top = Math.max(3, rect.top - padding);
    const right = Math.min(vw - 3, rect.right + padding);
    const bottom = Math.min(vh - 3, rect.bottom + padding);

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
      getComputedStyle(target).borderRadius || "12px";
  }

  /*
   * Choose the least obstructive card position.
   * On mobile, favour the upper half unless a fixed Guide or header
   * occupies it; on other screens, avoid the target and known panels.
   */

  function positionTourCard(target) {
    const card = inTour(".mb-tour-card-v6");

    if (!card || !isOpen) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 600;
    const landscape = mobile && vw > vh;

    const guide = $(".mb-guide-panel");
    const guideRect = guide?.getBoundingClientRect();

    const guideVisible = !!(
      guide &&
      guideRect &&
      guideRect.width > 0 &&
      guideRect.height > 0 &&
      getComputedStyle(guide).display !== "none" &&
      getComputedStyle(guide).visibility !== "hidden"
    );

    const header = $("header") || $(".topbar");
    const headerRect = header?.getBoundingClientRect();

    const headerVisible = !!(
      header &&
      headerRect &&
      headerRect.top <= 5 &&
      headerRect.bottom > 0
    );

    card.style.left = "";
    card.style.right = "";
    card.style.top = "";
    card.style.bottom = "";

    card.style.width = mobile
      ? "calc(100vw - 16px)"
      : "min(430px, calc(100vw - 32px))";

    if (mobile && !landscape) {
      const cardHeight = card.getBoundingClientRect().height;
      const guideAtTop = guideVisible && guideRect.top < vh * 0.5;
      const headerSpace = headerVisible
        ? Math.max(0, headerRect.bottom + 8)
        : 8;

      if (guideAtTop && guideRect.bottom < vh * 0.62) {
        card.style.top = `${Math.max(8, guideRect.bottom + 8)}px`;
      } else {
        card.style.top = `${Math.min(headerSpace, Math.max(8, vh * 0.16))}px`;
      }

      const availableHeight = Math.max(
        150,
        vh - parseFloat(card.style.top || "8px") - 12
      );

      card.style.maxHeight = `${Math.min(
        vh * 0.48,
        availableHeight,
        vh - 16
      )}px`;

      card.style.left = "8px";
      card.style.right = "8px";
      card.style.bottom = "auto";

      /*
       * If the card would overlap the visible Guide, place it in the
       * free vertical area whenever enough space exists.
       */
      const proposed = card.getBoundingClientRect();

      if (
        guideVisible &&
        proposed.bottom > guideRect.top &&
        proposed.top < guideRect.bottom
      ) {
        const spaceAbove = Math.max(0, guideRect.top - 12);
        const spaceBelow = Math.max(0, vh - guideRect.bottom - 12);

        if (spaceBelow > spaceAbove && spaceBelow >= 135) {
          card.style.top = `${guideRect.bottom + 8}px`;
          card.style.maxHeight = `${Math.max(135, spaceBelow - 8)}px`;
        } else if (spaceAbove >= 135) {
          card.style.top = `${Math.max(8, guideRect.top - Math.min(cardHeight, spaceAbove) - 8)}px`;
          card.style.maxHeight = `${spaceAbove - 8}px`;
        }
      }
    } else if (landscape) {
      card.style.top = "8px";
      card.style.left = "8px";
      card.style.right = "auto";
      card.style.bottom = "auto";
      card.style.width = "min(390px, calc(100vw - 16px))";
      card.style.maxHeight = "calc(100dvh - 16px)";
    } else {
      card.style.top = "16px";
      card.style.right = "16px";
      card.style.left = "auto";
      card.style.bottom = "auto";
      card.style.width = "min(430px, calc(100vw - 32px))";
      card.style.maxHeight = "calc(100dvh - 32px)";

      if (target) {
        const targetRect = target.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const overlaps =
          cardRect.left < targetRect.right &&
          cardRect.right > targetRect.left &&
          cardRect.top < targetRect.bottom &&
          cardRect.bottom > targetRect.top;

        if (overlaps) {
          if (targetRect.left > vw / 2) {
            card.style.left = "16px";
            card.style.right = "auto";
          } else {
            card.style.right = "16px";
            card.style.left = "auto";
          }
        }
      }
    }
  }

  function reposition() {
    if (!isOpen || repositionFrame) return;

    repositionFrame = requestAnimationFrame(() => {
      repositionFrame = 0;

      const target = getTarget(steps[index]?.target);
      positionSpotlight(target);
      positionTourCard(target);
    });
  }

  /* ================================================================
     9. OPTIONAL TEXT-TO-SPEECH
     ================================================================ */

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speakCurrentStep() {
    if (!voiceEnabled) return;

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      voiceEnabled = false;
      inTour("#mbTourVoiceV6").setAttribute("aria-pressed", "false");
      inTour("#mbTourVoiceV6").textContent = "🔇 No voice";
      return;
    }

    const current = steps[index];

    const text = `${translate(current.title)}. ${translate(current.description)}`;

    if (text === lastSpoken) {
      stopSpeaking();
    }

    lastSpoken = text;
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      getLanguage() === "sw"
        ? "sw-KE"
        : "en-KE";

    utterance.rate = 0.92;
    utterance.pitch = 1.08;

    utterance.onstart = () => emote("talking");
    utterance.onend = () => emote("happy");

    window.speechSynthesis.speak(utterance);
  }

  /* ================================================================
     10. RANDOM FARMER EMOTES
     ================================================================ */

  function farmerNodes() {
    return $$(".mb6-farmer");
  }

  function emote(mood = "") {
    farmerNodes().forEach(node => {
      node.classList.remove(
        "mb6-happy",
        "mb6-talking",
        "mb6-nod",
        "mb6-celebrate",
        "mb6-wave-now"
      );

      void node.offsetWidth;

      if (mood) node.classList.add(`mb6-${mood}`);
    });
  }

  function stopEmotes() {
    if (emoteTimer) {
      window.clearInterval(emoteTimer);
      emoteTimer = 0;
    }
  }

  function startEmotes() {
    stopEmotes();

    const moods = [
      "happy",
      "nod",
      "wave-now",
      "",
      "happy",
      ""
    ];

    emoteTimer = window.setInterval(() => {
      if (!reducedMotion()) {
        emote(moods[Math.floor(Math.random() * moods.length)]);
      }
    }, 4200);
  }

  /* ================================================================
     11. LABELS AND STEP RENDERING
     ================================================================ */

  function labels() {
    if (getLanguage() === "sw") {
      return {
        step: "Hatua",
        skip: "Ruka",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        kicker: "MSAIDIZI WAKO WA KILIMO",
        launcher: "🧭 Mwongozo"
      };
    }

    if (getLanguage() === "en") {
      return {
        step: "Step",
        skip: "Skip",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        kicker: "YOUR FARMING GUIDE",
        launcher: "🧭 Website Tour"
      };
    }

    return {
      step: "Step",
      skip: "Skip tour",
      back: "Back",
      next: "Next →",
      finish: "Finish ✓",
      kicker: "FARM BUDDY · TWENDE!",
      launcher: "🧭 Website Tour"
    };
  }

  function renderStep(shouldScroll = true) {
    if (!steps.length) return;

    index = Math.max(0, Math.min(index, steps.length - 1));

    const current = steps[index];
    const words = labels();
    const target = getTarget(current.target);

    inTour("#mbTourTitleV6").textContent = translate(current.title);
    inTour("#mbTourTextV6").textContent = translate(current.description);

    inTour("#mbTourCountV6").textContent =
      `${words.step} ${index + 1}/${steps.length}`;

    inTour("#mbTourProgressV6").style.width =
      `${((index + 1) / steps.length) * 100}%`;

    inTour("#mbTourSkipV6").textContent = words.skip;
    inTour("#mbTourBackV6").textContent = words.back;
    inTour("#mbTourBackV6").disabled = index === 0;

    inTour("#mbTourNextV6").textContent =
      index === steps.length - 1 ? words.finish : words.next;

    inTour("#mbTourKickerV6").textContent = words.kicker;
    launcher.textContent = words.launcher;

    saveProgress(false);
    emote("talking");

    if (shouldScroll && target) {
      target.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    window.setTimeout(() => {
      if (!isOpen) return;

      positionSpotlight(getTarget(steps[index]?.target));
      positionTourCard(getTarget(steps[index]?.target));
    }, shouldScroll && target ? 350 : 0);

    if (voiceEnabled) speakCurrentStep();
  }

  /* ================================================================
     12. OPEN / CLOSE / RESTART
     ================================================================ */

  function closeTour(completed = false, mood = "wave-now") {
    layer.hidden = true;
    launcher.hidden = false;
    isOpen = false;

    saveProgress(completed);

    stopEmotes();
    stopSpeaking();

    window.removeEventListener("resize", reposition);
    window.removeEventListener("scroll", reposition, true);
    window.removeEventListener("orientationchange", reposition);

    if (repositionFrame) {
      cancelAnimationFrame(repositionFrame);
      repositionFrame = 0;
    }

    emote(mood);

    if (previousFocus && typeof previousFocus.focus === "function") {
      try {
        previousFocus.focus({ preventScroll: true });
      } catch {}
    }
  }

  function openTour(restart = true) {
    previousFocus = document.activeElement;
    steps = getSteps();

    if (restart) {
      index = 0;
    } else {
      const progress = readProgress();
      index = Number.isInteger(progress.index)
        ? Math.max(0, Math.min(progress.index, steps.length - 1))
        : 0;
    }

    isOpen = true;
    layer.hidden = false;
    launcher.hidden = true;

    renderStep(true);

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("orientationchange", reposition);

    startEmotes();

    inTour("#mbTourNextV6").focus({ preventScroll: true });
  }

  launcher.addEventListener("click", () => openTour(true));

  inTour("#mbTourCloseV6").addEventListener("click", () => {
    closeTour(false);
  });

  inTour("#mbTourSkipV6").addEventListener("click", () => {
    closeTour(false);
  });

  inTour("#mbTourBackV6").addEventListener("click", () => {
    if (index > 0) {
      index--;
      renderStep(true);
    }
  });

  inTour("#mbTourNextV6").addEventListener("click", () => {
    if (index < steps.length - 1) {
      index++;
      renderStep(true);
      emote("nod");
    } else {
      closeTour(true, "celebrate");
    }
  });

  inTour("#mbTourVoiceV6").addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;

    const button = inTour("#mbTourVoiceV6");

    button.setAttribute("aria-pressed", String(voiceEnabled));
    button.textContent = voiceEnabled ? "🔊 Voice on" : "🔇 Voice off";

    if (voiceEnabled) {
      speakCurrentStep();
    } else {
      stopSpeaking();
      emote("happy");
    }
  });

  /* Keyboard navigation */
  document.addEventListener("keydown", event => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour(false);
    } else if (event.key === "ArrowRight" && index < steps.length - 1) {
      index++;
      renderStep(true);
    } else if (event.key === "ArrowLeft" && index > 0) {
      index--;
      renderStep(true);
    }
  });

  /* Re-render translations when the language changes */
  $("#languageSelect")?.addEventListener("change", () => {
    setupAvatars();

    if (isOpen) {
      lastSpoken = "";
      renderStep(false);
    }

    launcher.textContent = labels().launcher;
  });

  /* ================================================================
     13. FIRST-VISIT BEHAVIOUR
     ================================================================ */

  function startFirstVisit() {
    if (isCompleted()) return;

    window.setTimeout(() => {
      if (!isOpen) openTour(false);
    }, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startFirstVisit,
      { once: true }
    );
  } else {
    startFirstVisit();
  }

  /* ================================================================
     14. ADD AVATARS IF EXISTING UI RENDERS LATER
     ================================================================ */

  setupAvatars();

  const observer = new MutationObserver(() => {
    setupAvatars();

    if (isOpen) reposition();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.setTimeout(() => {
    observer.disconnect();
    setupAvatars();
  }, 8000);

  /* ================================================================
     15. OPTIONAL GLOBAL RESTART CONTROL
     ================================================================ */

  window.MavunoBridgeTour = {
    open: () => openTour(true),
    resume: () => openTour(false),

    reset: () => {
      try {
        localStorage.removeItem(`${STORAGE}:${PAGE}`);
      } catch {}

      index = 0;
      openTour(true);
    },

    stopVoice: () => {
      voiceEnabled = false;
      stopSpeaking();

      if (layer && !layer.hidden) {
        inTour("#mbTourVoiceV6").setAttribute("aria-pressed", "false");
        inTour("#mbTourVoiceV6").textContent = "🔇 Voice off";
      }
    }
  };

  console.info("MavunoBridge Tour V6 loaded successfully.");
})();
