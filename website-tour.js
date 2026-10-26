/* ==========================================================
   MAVUNOBRIDGE — WEBSITE TOUR + ANIMATED FARMER ASSISTANT
   COMPLETE REPLACEMENT

   Added:
   - Random farmer emotes
   - Farmer eyes follow cursor
   - Farmer reacts to mobile taps
   - Wave / nod / talk / happy / sad animations
   - Celebration when tutorial finishes
   - Sad reaction when tutorial is skipped
   - Transparent guide speech panel
   - Improved mobile tutorial layout
   - Responsive farmer assistant
   - Reduced-motion support
   ========================================================== */

(() => {
  "use strict";

  if (window.__MAVUNO_WEBSITE_TOUR_V4__) return;
  window.__MAVUNO_WEBSITE_TOUR_V4__ = true;

  const PAGE = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE_KEY = "mavunobridge_tour_completed_v4";

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

  /* ==========================================================
     LANGUAGE
     ========================================================== */

  function language() {
    const selected = $("#languageSelect")?.value;

    if (["en", "mix", "sw"].includes(selected)) {
      return selected;
    }

    try {
      const saved =
        localStorage.getItem("mavunobridge_language_v1") ||
        localStorage.getItem("mavunobridge_language_v2");

      if (["en", "mix", "sw"].includes(saved)) {
        return saved;
      }
    } catch {}

    return "mix";
  }

  function translate(value) {
    if (typeof value === "string") return value;

    return (
      value?.[language()] ||
      value?.mix ||
      value?.en ||
      ""
    );
  }

  /* ==========================================================
     FARMER SVG
     ========================================================== */

  const FARMER_SVG = `
    <svg class="mb-farmer-art"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      aria-hidden="true">

      <circle cx="60" cy="60" r="59" fill="#e6f5e8"/>

      <path d="M13 91 Q7 66 24 58 Q30 78 13 91Z"
        fill="#83bf83"/>

      <path d="M101 92 Q119 69 102 57 Q91 79 101 92Z"
        fill="#a5d59a"/>

      <!-- BODY -->
      <path d="M26 120 Q28 86 47 79 L74 79
        Q94 87 96 120Z"
        fill="#246548"/>

      <path d="M49 83 L60 96 L71 83"
        fill="none"
        stroke="#d2ead0"
        stroke-width="3"
        stroke-linecap="round"/>

      <!-- NECK -->
      <path d="M49 65 L49 82
        Q60 91 72 81 L71 65Z"
        fill="#9b5937"/>

      <!-- WAVING ARM -->
      <g class="mb-farmer-wave">
        <path d="M80 88 Q87 74 92 59 L98 43
          Q101 36 107 40 Q112 43 108 51
          L102 70 Q99 88 90 98Z"
          fill="#9b5937"/>

        <path d="M98 45 Q91 37 95 32
          Q99 29 103 37
          Q107 28 111 33
          Q114 37 108 44"
          fill="#a96843"/>
      </g>

      <!-- EARS -->
      <circle cx="37" cy="52" r="7" fill="#a96843"/>
      <circle cx="83" cy="52" r="7" fill="#a96843"/>

      <!-- FACE -->
      <ellipse cx="60" cy="51"
        rx="25"
        ry="29"
        fill="#b8754d"/>

      <!-- HAIR -->
      <path d="M35 47 Q32 23 57 22
        Q81 21 85 46
        L77 39 L44 39Z"
        fill="#3d3025"/>

      <!-- EYES -->
      <g class="mb-farmer-eyes">
        <ellipse cx="50" cy="52"
          rx="2.5"
          ry="3.2"
          fill="#29251f"/>

        <ellipse cx="70" cy="52"
          rx="2.5"
          ry="3.2"
          fill="#29251f"/>
      </g>

      <!-- SMILE -->
      <path d="M51 64 Q60 72 70 63"
        fill="none"
        stroke="#6c3229"
        stroke-width="2.6"
        stroke-linecap="round"/>

      <!-- HAT -->
      <path d="M34 35 Q36 12 60 12
        Q82 13 86 35Z"
        fill="#367d4b"/>

      <ellipse cx="60" cy="35"
        rx="34"
        ry="7"
        fill="#205e3b"/>

      <path d="M49 19 Q57 6 69 17
        Q61 16 58 27
        Q55 20 49 19Z"
        fill="#a6d969"/>

      <path d="M59 26 Q62 18 69 17"
        fill="none"
        stroke="#e2f6c8"
        stroke-width="2"
        stroke-linecap="round"/>

      <!-- PLANT -->
      <circle cx="60" cy="105"
        r="9"
        fill="#d7efaa"/>

      <path d="M60 111 Q59 102 64 99
        M60 106 Q54 100 52 103"
        fill="none"
        stroke="#246548"
        stroke-width="2"
        stroke-linecap="round"/>
    </svg>
  `;

  /* ==========================================================
     TOUR CONTENT
     ========================================================== */

  const TOURS = {

    "index.html": [

      makeStep(
        ".topbar",
        phrase(
          "Welcome to MavunoBridge",
          "Karibu MavunoBridge!",
          "Karibu MavunoBridge!"
        ),
        phrase(
          "Use the navigation to explore Marketplace, Smart Assist, SACCO Hub, Buyer Requests and Messages. Choose your preferred language from the header.",
          "Tumia navigation kufungua Marketplace, Smart Assist, SACCO Hub, Buyer Requests na Messages. Chagua lugha unayopendelea.",
          "Tumia menyu kufungua Marketplace, Smart Assist, SACCO Hub, Buyer Requests na Messages. Chagua lugha unayopendelea."
        )
      ),

      makeStep(
        ["#categoryGrid .category-card", "#categories"],
        phrase(
          "Explore product categories",
          "Chagua category ya bidhaa unataka.",
          "Chagua kundi la bidhaa."
        ),
        phrase(
          "Choose All Products or a category such as fruits, vegetables, grains, legumes, livestock, farm tools or agricultural services.",
          "Chagua All Products ama category kama fruits, vegetables, grains, livestock, farm tools ama agricultural services.",
          "Chagua bidhaa zote au kundi kama matunda, mboga, nafaka, mifugo, zana au huduma za kilimo."
        )
      ),

      makeStep(
        ".filters",
        phrase(
          "Search and filter",
          "Tafuta bidhaa na upunguze results.",
          "Tafuta na uchuje bidhaa."
        ),
        phrase(
          "Search by name, select a category or county, filter retail/bulk sales and sort your results.",
          "Search kwa jina, chagua category ama county, filter retail/bulk na sort results zako.",
          "Tafuta kwa jina, chagua kundi au kaunti, chuja retail/bulk na panga matokeo."
        )
      ),

      makeStep(
        ["#listingGrid .product-card", "#listingGrid"],
        phrase(
          "Explore product listings",
          "Angalia details za listing kabla ya kununua.",
          "Linganisha matangazo."
        ),
        phrase(
          "Review the product, seller, location, quantity and price. Listing cards may offer Call, Message or Add to cart.",
          "Angalia product, seller, location, quantity na bei. Unaweza kuona Call, Message ama Add to cart.",
          "Kagua bidhaa, muuzaji, eneo, kiasi na bei. Kadi zinaweza kuwa na Call, Message au Add to cart."
        )
      ),

      makeStep(
        "#sellButton",
        phrase(
          "Create a listing",
          "Farmer? Weka bidhaa yako sokoni hapa.",
          "Tengeneza tangazo."
        ),
        phrase(
          "Enter your product details, category, county, quantity, price and sale type. Add a clear product photo when available.",
          "Weka product details, category, county, quantity, bei na sale type. Ongeza picha clear kama iko.",
          "Weka maelezo ya bidhaa, kundi, kaunti, kiasi, bei na aina ya mauzo. Ongeza picha iliyo wazi."
        )
      ),

      makeStep(
        "#cartButton",
        phrase(
          "Your cart",
          "Cart inakusaidia ku-review ulizochagua.",
          "Kikapu chako."
        ),
        phrase(
          "Open Cart to review or remove items. The demo cart does not take payments or submit real orders.",
          "Fungua Cart kuona ama kuondoa products. Demo cart haichukui malipo wala kuweka order halisi.",
          "Fungua kikapu kukagua au kuondoa bidhaa. Kikapu cha demo hakipokei malipo wala kuweka oda halisi."
        )
      ),

      makeStep(
        'a[href="smart-assist.html"]',
        phrase(
          "Smart Assist",
          "Pata crop guidance na farm report.",
          "Msaidizi wa kilimo."
        ),
        phrase(
          "Explore crop planning, symptoms, farm reports, questions and crop guides.",
          "Explore crop planning, symptoms, farm reports, questions na crop guides.",
          "Chunguza mipango ya mazao, dalili, ripoti, maswali na miongozo."
        )
      ),

      makeStep(
        'a[href="sacco.html"]',
        phrase(
          "SACCO Hub",
          "Explore sample farmer groups na opportunities.",
          "SACCO Hub."
        ),
        phrase(
          "Explore sample farmer groups and agricultural opportunities.",
          "Explore sample farmer groups na agricultural opportunities.",
          "Chunguza mifano ya vikundi na fursa za kilimo."
        )
      ),

      makeStep(
        'a[href="buyer-requests.html"]',
        phrase(
          "Buyer Requests",
          "Wanunuzi wanaweza kuweka wanachohitaji.",
          "Maombi ya wanunuzi."
        ),
        phrase(
          "Buyers can describe the produce they need, location and quantity.",
          "Buyers wanaweza kuweka product, location na quantity wanahitaji.",
          "Wanunuzi wanaweza kueleza bidhaa, eneo na kiasi wanachohitaji."
        )
      ),

      makeStep(
        'a[href="messages.html"]',
        phrase(
          "Messages",
          "Jaribu demo chat hapa.",
          "Ujumbe."
        ),
        phrase(
          "Choose a sample contact and try the messaging interface.",
          "Chagua sample contact na ujaribu chat.",
          "Chagua mtu wa mfano na ujaribu mazungumzo."
        )
      ),

      makeStep(
        ".demo-note",
        phrase(
          "Remember: this is a demo",
          "Kumbuka hii ni demo.",
          "Kumbuka: huu ni mfano."
        ),
        phrase(
          "Some data is saved only in this browser. Prices and messages may be demonstration data.",
          "Data fulani hubaki kwa browser hii. Bei na messages zinaweza kuwa demo data.",
          "Baadhi ya data huhifadhiwa kwenye kivinjari hiki. Bei na ujumbe unaweza kuwa data ya mfano."
        )
      )
    ],

    "smart-assist.html": [

      makeStep(
        ".sa-hero",
        phrase(
          "Welcome to Smart Assist",
          "Karibu kwa Smart Assist!",
          "Karibu Smart Assist!"
        ),
        phrase(
          "Explore the farm planner, crop symptoms, reports, questions and crop library.",
          "Explore farm planner, crop symptoms, reports, questions na crop library.",
          "Chunguza mpango wa shamba, dalili, ripoti, maswali na mwongozo wa mazao."
        )
      ),

      makeStep(
        "#farmPlanner",
        phrase(
          "Describe your farm",
          "Chagua county, crop na hali ya shamba.",
          "Eleza shamba lako."
        ),
        phrase(
          "Choose your county and crop, then add the information you know about the farm.",
          "Chagua county na crop, kisha ongeza details unazojua kuhusu shamba.",
          "Chagua kaunti na zao, kisha ongeza maelezo unayojua kuhusu shamba."
        )
      ),

      makeStep(
        [".sa-symptom-field", "#saSymptomChecks"],
        phrase(
          "Select symptoms",
          "Tick dalili unazoona kwa crop.",
          "Chagua dalili."
        ),
        phrase(
          "Select visible signs and describe the crop problem.",
          "Tick symptoms na ueleze tatizo la crop.",
          "Chagua dalili zinazoonekana na ueleze tatizo la zao."
        )
      ),

      makeStep(
        "#saPhoto",
        phrase(
          "Add a crop photo",
          "Weka picha clear ya crop.",
          "Ongeza picha ya zao."
        ),
        phrase(
          "Choose a clear photo of the affected crop area so you can review it with your farm notes.",
          "Upload picha clear ya sehemu ya crop imeathirika.",
          "Pakia picha iliyo wazi ya sehemu ya zao iliyoathirika."
        )
      ),

      makeStep(
        ["#generateReportButton", "#reportSection"],
        phrase(
          "Generate your report",
          "Generate report upate tips.",
          "Tengeneza ripoti."
        ),
        phrase(
          "Generate your farm report and review the suggested next steps.",
          "Generate farm report kisha angalia next steps.",
          "Tengeneza ripoti ya shamba na ukague hatua zinazopendekezwa."
        )
      ),

      makeStep(
        "#saQuestionForm",
        phrase(
          "Ask the farm assistant",
          "Uliza swali kuhusu shamba.",
          "Uliza msaidizi."
        ),
        phrase(
          "Ask about crops, pests, soil, water or harvesting.",
          "Uliza kuhusu crops, pests, soil, maji ama harvest.",
          "Uliza kuhusu mazao, wadudu, udongo, maji au mavuno."
        )
      ),

      makeStep(
        [".sa-library-controls", "#saCropLibraryGrid"],
        phrase(
          "Explore crop guides",
          "Search crops na filter.",
          "Chunguza miongozo."
        ),
        phrase(
          "Search and explore crop information from the built-in library.",
          "Search na explore crop information kutoka library.",
          "Tafuta na uchunguze maelezo ya mazao kutoka kwenye maktaba."
        )
      ),

      makeStep(
        "#savedReportsSection",
        phrase(
          "Saved reports",
          "Reports ulizohifadhi ziko hapa.",
          "Ripoti zilizohifadhiwa."
        ),
        phrase(
          "Review reports saved in this browser.",
          "Angalia reports ulizohifadhi kwa browser hii.",
          "Kagua ripoti ulizohifadhi kwenye kivinjari hiki."
        )
      )
    ],

    "sacco.html": [

      makeStep(
        ".page-hero",
        phrase(
          "Welcome to SACCO Hub",
          "Karibu SACCO Hub!",
          "Karibu SACCO Hub!"
        ),
        phrase(
          "Explore sample farmer groups and agricultural opportunities.",
          "Explore sample farmer groups na agricultural opportunities.",
          "Chunguza mifano ya vikundi vya wakulima na fursa za kilimo."
        )
      ),

      makeStep(
        ".sacco-controls",
        phrase(
          "Search opportunities",
          "Tafuta kwa jina ama county.",
          "Tafuta fursa."
        ),
        phrase(
          "Search and filter the available demonstration opportunities.",
          "Search na filter sample opportunities.",
          "Tafuta na uchuje fursa za mfano."
        )
      ),

      makeStep(
        ["#saccoGrid .sacco-card", "#saccoGrid"],
        phrase(
          "Explore groups",
          "Angalia groups zinazopatikana.",
          "Chunguza vikundi."
        ),
        phrase(
          "Read the cards and explore the information provided.",
          "Soma cards na explore information.",
          "Soma kadi na uchunguze maelezo."
        )
      ),

      makeStep(
        ".interest-panel",
        phrase(
          "Saved interests",
          "Hapa utaona interests zako.",
          "Fursa ulizohifadhi."
        ),
        phrase(
          "Review the opportunities you have saved.",
          "Angalia opportunities ulizosave.",
          "Kagua fursa ulizohifadhi."
        )
      )
    ],

    "buyer-requests.html": [

      makeStep(
        ".page-hero",
        phrase(
          "Welcome to Buyer Requests",
          "Karibu Buyer Requests!",
          "Karibu Buyer Requests!"
        ),
        phrase(
          "Buyers can describe the produce they need.",
          "Buyer anaweza kuweka products anahitaji.",
          "Wanunuzi wanaweza kueleza bidhaa wanazohitaji."
        )
      ),

      makeStep(
        "#demandForm",
        phrase(
          "Post a request",
          "Weka product, county na quantity.",
          "Weka ombi."
        ),
        phrase(
          "Enter the product, location, quantity and other useful details.",
          "Weka product, location, quantity na details zingine.",
          "Weka bidhaa, eneo, kiasi na maelezo mengine."
        )
      ),

      makeStep(
        "#demandList",
        phrase(
          "Browse requests",
          "Angalia requests zilizopo.",
          "Vinjari maombi."
        ),
        phrase(
          "Review the buyer requests available on the demo page.",
          "Angalia buyer requests zilizopo kwa demo.",
          "Kagua maombi ya wanunuzi yaliyopo kwenye demo."
        )
      ),

      makeStep(
        "#supportForm",
        phrase(
          "Support",
          "Weka reminder ama swali.",
          "Msaada."
        ),
        phrase(
          "Use the support area for a simple note or reminder.",
          "Tumia support area kwa note ama reminder.",
          "Tumia sehemu ya msaada kwa dokezo au kikumbusho."
        )
      )
    ],

    "messages.html": [

      makeStep(
        ".messages-notice",
        phrase(
          "Messages demo",
          "Kumbuka replies ni simulated.",
          "Ujumbe wa demo."
        ),
        phrase(
          "This page demonstrates the messaging experience.",
          "Hii page inaonyesha messaging experience ya demo.",
          "Ukurasa huu unaonyesha mfano wa mfumo wa ujumbe."
        )
      ),

      makeStep(
        [".conversation-sidebar", "#conversationList"],
        phrase(
          "Choose a conversation",
          "Chagua sample contact.",
          "Chagua mazungumzo."
        ),
        phrase(
          "Choose a conversation from the list.",
          "Chagua conversation kutoka list.",
          "Chagua mazungumzo kutoka kwenye orodha."
        )
      ),

      makeStep(
        ".conversation-panel",
        phrase(
          "Read messages",
          "Messages zitaonekana hapa.",
          "Soma ujumbe."
        ),
        phrase(
          "Review the selected conversation.",
          "Angalia conversation uliyochagua.",
          "Kagua mazungumzo uliyochagua."
        )
      ),

      makeStep(
        "#messageForm",
        phrase(
          "Write a message",
          "Andika message kisha Send.",
          "Andika ujumbe."
        ),
        phrase(
          "Type your message and press Send.",
          "Andika message yako kisha bonyeza Send.",
          "Andika ujumbe wako kisha bonyeza Tuma."
        )
      )
    ],

    "login.html": [

      makeStep(
        ".auth-visual",
        phrase(
          "Welcome to sign-in",
          "Karibu kwa demo ya sign-in.",
          "Karibu kwenye mfano wa kuingia."
        ),
        phrase(
          "This page demonstrates a sign-in experience.",
          "Hii ni demo ya sign-in experience.",
          "Ukurasa huu unaonyesha mfano wa kuingia."
        )
      ),

      makeStep(
        "#demoLoginForm",
        phrase(
          "Demo account",
          "Tumia details za mfano pekee.",
          "Akaunti ya mfano."
        ),
        phrase(
          "Use demonstration information only. Never enter a real password or payment PIN.",
          "Tumia demo information pekee. Usiweke password ama payment PIN halisi.",
          "Tumia taarifa za mfano pekee. Usiweke nenosiri au PIN ya malipo halisi."
        )
      ),

      makeStep(
        "#googleDemoButton",
        phrase(
          "Google-style button",
          "Hii ni button ya demo.",
          "Kitufe cha mfano."
        ),
        phrase(
          "This demonstrates the interface and does not create a real Google login.",
          "Hii ni interface ya demo na haifungui Google login halisi.",
          "Hiki ni kiolesura cha mfano na hakifanyi kuingia kwa Google halisi."
        )
      )
    ]
  };

  const FALLBACK_TOUR = [
    makeStep(
      ".topbar",
      phrase(
        "Welcome to MavunoBridge",
        "Karibu MavunoBridge!",
        "Karibu MavunoBridge!"
      ),
      phrase(
        "Use the navigation to explore MavunoBridge.",
        "Tumia navigation kuchunguza MavunoBridge.",
        "Tumia menyu kuchunguza MavunoBridge."
      )
    ),

    makeStep(
      "main",
      phrase(
        "Explore this page",
        "Angalia features za page hii.",
        "Chunguza ukurasa huu."
      ),
      phrase(
        "Use the buttons and tools available on this page.",
        "Tumia buttons na tools zilizopo hapa.",
        "Tumia vitufe na zana zilizopo hapa."
      )
    )
  ];

  function getSteps() {
    return TOURS[PAGE] || FALLBACK_TOUR;
  }

  /* ==========================================================
     ANIMATION CSS
     ========================================================== */

  const style = document.createElement("style");

  style.textContent = `

    /* ========================================================
       TOUR LAUNCHER
       ======================================================== */

    .mb-tour-launcher {
      position: fixed;
      z-index: 10030;
      left: 18px;
      bottom: 18px;
      max-width: calc(100vw - 28px);
      padding: 12px 16px;
      border: 1px solid #d4e7d9;
      border-radius: 999px;
      background: #fff;
      color: #134c39;
      font: 800 12px/1.2 system-ui,sans-serif;
      box-shadow: 0 8px 26px #142d1b2b;
      cursor: pointer;
      transition: transform .2s ease, background .2s ease;
    }

    .mb-tour-launcher:hover {
      transform: translateY(-3px);
      background: #f0f8f1;
    }

    .mb-tour-launcher[hidden],
    .mb-tour-layer[hidden] {
      display: none !important;
    }

    /* ========================================================
       TOUR LAYER
       ======================================================== */

    .mb-tour-layer {
      position: fixed;
      z-index: 10020;
      inset: 0;
      pointer-events: none;
    }

    .mb-tour-shade {
      position: fixed;
      background: rgba(5,25,17,.64);
      pointer-events: auto;
    }

    .mb-tour-focus {
      position: fixed;
      z-index: 10021;
      border: 3px solid #91e7a4;
      border-radius: 12px;
      box-shadow:
        0 0 0 2px #fff,
        0 0 28px rgba(145,231,164,.3);
      pointer-events: none;
      transition:
        top .2s ease,
        left .2s ease,
        width .2s ease,
        height .2s ease;
    }

    /* ========================================================
       TRANSPARENT SPEECH / GUIDE PANEL
       ======================================================== */

    .mb-tour-card {
      position: fixed;
      z-index: 10022;

      left: 50%;
      bottom: max(16px,env(safe-area-inset-bottom));

      width: min(590px,calc(100vw - 24px));
      max-height: min(390px,calc(100dvh - 28px));

      overflow-y: auto;

      transform: translateX(-50%);

      padding: 15px 17px 13px;

      border: 1px solid rgba(207,230,211,.78);
      border-radius: 20px;

      /*
       * IMPORTANT:
       * The white is intentionally translucent so
       * the farmer remains visible behind the guide.
       */
      background: rgba(255,255,255,.72);

      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);

      color: #1b3226;

      box-shadow:
        0 18px 70px rgba(0,0,0,.25),
        inset 0 1px 0 rgba(255,255,255,.7);

      font-family:
        system-ui,
        -apple-system,
        "Segoe UI",
        sans-serif;

      pointer-events: auto;
    }

    .mb-tour-card * {
      box-sizing: border-box;
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 9px;
    }

    .mb-tour-brand {
      display: flex;
      align-items: center;
      gap: 8px;

      color: #266144;

      font-size: 9px;
      font-weight: 850;
      letter-spacing: .9px;
      text-transform: uppercase;
    }

    .mb-tour-mark {
      display: grid;
      width: 27px;
      height: 27px;
      place-items: center;

      border-radius: 9px;
      background: rgba(230,245,233,.86);

      color: #175338;
      font-size: 15px;
    }

    .mb-tour-count {
      margin-left: auto;

      color: #607668;
      font-size: 10px;
      font-weight: 750;
      white-space: nowrap;
    }

    .mb-tour-progress {
      height: 5px;
      overflow: hidden;
      margin-bottom: 13px;
      border-radius: 99px;
      background: rgba(232,240,233,.8);
    }

    .mb-tour-progress span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: 99px;

      background:
        linear-gradient(
          90deg,
          #47a966,
          #9bdc83
        );

      transition: width .25s ease;
    }

    /* ========================================================
       FARMER GUIDE
       ======================================================== */

    .mb-tour-guide-row {
      display: grid;

      grid-template-columns:
        83px
        minmax(0,1fr);

      align-items: center;

      gap: 14px;
    }

    .mb-tour-farmer,
    .mb-guide-farmer {
      position: relative;

      display: grid;

      flex: 0 0 auto;

      place-items: center;

      overflow: visible;

      border: 1px solid #bfe2c6;
      border-radius: 21px;

      background:
        linear-gradient(
          145deg,
          #eff9e9,
          #cce9d0
        );

      box-shadow:
        0 6px 18px rgba(25,91,52,.12);

      transform-origin: center bottom;

      animation:
        mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-tour-farmer {
      width: 83px;
      height: 83px;
    }

    .mb-farmer-art {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* ========================================================
       FARMER RANDOM EMOTES
       ======================================================== */

    .mb-farmer-wave {
      transform-box: view-box;
      transform-origin: 91px 88px;

      animation:
        mbFarmerWave 2.8s ease-in-out infinite;
    }

    .mb-farmer-eyes {
      transform-box: fill-box;
      transform-origin: center;

      transition:
        transform .12s ease-out;

      animation:
        mbFarmerBlink 5s infinite;
    }

    .mb-farmer-happy {
      animation:
        mbHappyBounce .65s ease-in-out 2 !important;
    }

    .mb-farmer-talking {
      animation:
        mbFarmerTalk .55s ease-in-out 2 !important;
    }

    .mb-farmer-nod {
      animation:
        mbFarmerNod .65s ease-in-out 2 !important;
    }

    .mb-farmer-celebrate {
      animation:
        mbFarmerCelebrate .75s ease-in-out 4 !important;
    }

    .mb-farmer-sad {
      animation:
        mbFarmerSad .85s ease-in-out 1 !important;

      filter: saturate(.65);
    }

    .mb-farmer-wiggle {
      animation:
        mbFarmerWiggle .6s ease-in-out 2 !important;
    }

    /* ========================================================
       RANDOM EMOTE BUBBLE
       ======================================================== */

    .mb-farmer-emote {
      position: absolute;

      z-index: 5;

      top: -13px;
      right: -12px;

      display: grid;

      min-width: 30px;
      height: 30px;

      place-items: center;

      padding: 3px 7px;

      border:
        1px solid
        rgba(255,255,255,.8);

      border-radius: 999px;

      background:
        rgba(255,255,255,.88);

      box-shadow:
        0 5px 14px rgba(0,0,0,.15);

      font-size: 15px;

      pointer-events: none;

      animation:
        mbEmotePop .65s ease-out forwards;
    }

    .mb-farmer-sparkles {
      position: absolute;

      inset: -15px;

      z-index: 6;

      display: flex;

      align-items: center;
      justify-content: center;

      color: #e6a928;

      font-size: 16px;
      font-weight: 900;

      pointer-events: none;

      animation:
        mbSparklePop 1s ease-out forwards;
    }

    /* ========================================================
       GUIDE SPEECH
       ======================================================== */

    .mb-tour-speaking {
      display: inline-block;

      margin-bottom: 5px;

      color: #258052;

      font-size: 9px;
      font-weight: 800;

      letter-spacing: 1px;
    }

    .mb-tour-card h2 {
      margin: 0 0 7px;

      color: #143e2e;

      font:
        800
        clamp(18px,2.6vw,22px)/1.25
        system-ui,
        sans-serif;

      letter-spacing: -.45px;
    }

    .mb-tour-card p {
      margin: 0;

      color: #435b4c;

      font:
        12px/1.65
        system-ui,
        sans-serif;

      overflow-wrap: anywhere;
    }

    /* ========================================================
       CONTROLS
       ======================================================== */

    .mb-tour-controls {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 9px;

      margin-top: 14px;
      padding-top: 11px;

      border-top:
        1px solid
        rgba(220,232,222,.75);
    }

    .mb-tour-left,
    .mb-tour-right {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .mb-tour-btn {
      display: inline-flex;

      min-height: 37px;

      align-items: center;
      justify-content: center;

      padding: 9px 12px;

      border:
        1px solid
        rgba(212,226,214,.9);

      border-radius: 9px;

      background:
        rgba(255,255,255,.72);

      color: #244b33;

      font:
        750
        11px/1.2
        system-ui,
        sans-serif;

      cursor: pointer;

      transition:
        transform .15s ease,
        background .15s ease;
    }

    .mb-tour-btn:hover {
      transform: translateY(-1px);
      background: rgba(242,248,242,.9);
    }

    .mb-tour-btn:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-tour-next {
      border-color: #174d37;

      background:
        rgba(23,77,55,.94);

      color: #fff;
    }

    .mb-tour-next:hover {
      background: #0b3d2b;
      color: #fff;
    }

    .mb-tour-close {
      display: grid;

      width: 31px;
      height: 31px;

      flex: 0 0 auto;

      place-items: center;

      border:
        1px solid
        rgba(224,233,225,.9);

      border-radius: 50%;

      background:
        rgba(255,255,255,.72);

      color: #516a59;

      font-size: 18px;

      cursor: pointer;
    }

    /* ========================================================
       EXISTING FARMER GUIDE
       ======================================================== */

    .mb-guide-head {
      gap: 10px !important;
    }

    .mb-guide-farmer {
      width: 52px;
      height: 52px;

      border-radius: 15px;
    }

    .mb-guide-head .mb-guide-head-copy {
      flex: 1;
      min-width: 0;
    }

    /* ========================================================
       SMART ASSIST FARMER
       ======================================================== */

    .sa-assistant-avatar.mb-smart-farmer-avatar {
      position: relative;

      display: grid;

      width: 88px;
      height: 88px;

      flex: 0 0 auto;

      place-items: center;

      overflow: visible;

      border:
        2px solid
        #bde2c6;

      border-radius: 24px;

      background:
        linear-gradient(
          145deg,
          #eff9e9,
          #cce9d0
        );

      box-shadow:
        0 7px 19px rgba(25,91,52,.12);

      animation:
        mbFarmerFloat 3s ease-in-out infinite;
    }

    .sa-assistant-avatar.mb-smart-farmer-avatar
    .mb-farmer-art {
      width: 100%;
      height: 100%;
    }

    .sa-smart-farmer-status,
    .mb-smart-farmer-status {
      display: inline-flex;

      align-items: center;

      gap: 6px;

      width: fit-content;

      margin: 0 0 8px;

      padding: 5px 8px;

      border:
        1px solid
        #d3ead7;

      border-radius: 999px;

      background:
        rgba(242,250,244,.82);

      color: #26724c;

      font-size: 9px;
      font-weight: 800;

      letter-spacing: .45px;
    }

    .sa-smart-farmer-status::before,
    .mb-smart-farmer-status::before {
      content: "";

      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #49b876;

      box-shadow:
        0 0 0 3px
        rgba(73,184,118,.13);

      animation:
        mbStatusPulse 1.8s ease-in-out infinite;
    }

    /* ========================================================
       ANIMATIONS
       ======================================================== */

    @keyframes mbFarmerFloat {
      0%,100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-5px);
      }
    }

    @keyframes mbFarmerWave {
      0%,100% {
        transform: rotate(0deg);
      }

      20% {
        transform: rotate(-9deg);
      }

      45% {
        transform: rotate(7deg);
      }

      65% {
        transform: rotate(-6deg);
      }

      80% {
        transform: rotate(3deg);
      }
    }

    @keyframes mbFarmerBlink {
      0%,43%,47%,83%,87%,100% {
        transform: scaleY(1);
      }

      45%,85% {
        transform: scaleY(.12);
      }
    }

    @keyframes mbHappyBounce {
      0%,100% {
        transform:
          translateY(0)
          rotate(0)
          scale(1);
      }

      25% {
        transform:
          translateY(-11px)
          rotate(-5deg)
          scale(1.04);
      }

      50% {
        transform:
          translateY(0)
          rotate(0)
          scale(1);
      }

      75% {
        transform:
          translateY(-7px)
          rotate(5deg)
          scale(1.03);
      }
    }

    @keyframes mbFarmerTalk {
      0%,100% {
        transform:
          rotate(0)
          translateY(0);
      }

      30% {
        transform:
          rotate(-4deg)
          translateY(-3px);
      }

      65% {
        transform:
          rotate(4deg)
          translateY(0);
      }
    }

    @keyframes mbFarmerNod {
      0%,100% {
        transform:
          rotate(0)
          translateY(0);
      }

      35% {
        transform:
          rotate(-4deg)
          translateY(2px);
      }

      70% {
        transform:
          rotate(4deg)
          translateY(0);
      }
    }

    @keyframes mbFarmerCelebrate {
      0%,100% {
        transform:
          translateY(0)
          rotate(0)
          scale(1);
      }

      20% {
        transform:
          translateY(-18px)
          rotate(-8deg)
          scale(1.08);
      }

      40% {
        transform:
          translateY(0)
          rotate(0)
          scale(1);
      }

      60% {
        transform:
          translateY(-14px)
          rotate(8deg)
          scale(1.07);
      }

      80% {
        transform:
          translateY(0)
          rotate(0)
          scale(1);
      }
    }

    @keyframes mbFarmerSad {
      0%,100% {
        transform:
          translateY(0)
          rotate(0);
      }

      35% {
        transform:
          translateY(4px)
          rotate(-5deg);
      }

      70% {
        transform:
          translateY(1px)
          rotate(4deg);
      }
    }

    @keyframes mbFarmerWiggle {
      0%,100% {
        transform: rotate(0);
      }

      25% {
        transform: rotate(-7deg);
      }

      50% {
        transform: rotate(7deg);
      }

      75% {
        transform: rotate(-4deg);
      }
    }

    @keyframes mbEmotePop {
      0% {
        opacity: 0;
        transform:
          translateY(7px)
          scale(.45);
      }

      45% {
        opacity: 1;
        transform:
          translateY(-2px)
          scale(1.12);
      }

      100% {
        opacity: 0;
        transform:
          translateY(-15px)
          scale(.85);
      }
    }

    @keyframes mbSparklePop {
      0% {
        opacity: 0;
        transform:
          scale(.4)
          rotate(-20deg);
      }

      35% {
        opacity: 1;
        transform:
          scale(1.2)
          rotate(12deg);
      }

      100% {
        opacity: 0;
        transform:
          scale(.8)
          translateY(-12px);
      }
    }

    @keyframes mbStatusPulse {
      0%,100% {
        opacity: 1;
      }

      50% {
        opacity: .45;
      }
    }

    /* ========================================================
       MOBILE
       ======================================================== */

    @media(max-width:520px) {

      .mb-tour-launcher {
        left: 10px;
        bottom: 10px;

        padding:
          10px 12px;

        font-size: 11px;
      }

      /*
       * Mobile card is intentionally transparent.
       * This prevents the guide from hiding the farmer.
       */
      .mb-tour-card {
        left: 50%;

        bottom:
          max(
            8px,
            env(safe-area-inset-bottom)
          );

        width:
          calc(100vw - 18px);

        max-height:
          43dvh;

        overflow-y:
          auto;

        padding:
          10px 11px 9px;

        border-radius:
          16px;

        background:
          rgba(255,255,255,.68);

        backdrop-filter:
          blur(4px);

        -webkit-backdrop-filter:
          blur(4px);
      }

      .mb-tour-top {
        gap: 6px;
        margin-bottom: 6px;
      }

      .mb-tour-mark {
        width: 23px;
        height: 23px;

        border-radius: 7px;

        font-size: 12px;
      }

      .mb-tour-brand {
        font-size: 7px;
        letter-spacing: .5px;
      }

      .mb-tour-count {
        font-size: 8px;
      }

      .mb-tour-progress {
        height: 4px;
        margin-bottom: 8px;
      }

      /*
       * Farmer remains visible and gets its own space.
       */
      .mb-tour-guide-row {
        grid-template-columns:
          53px
          minmax(0,1fr);

        gap: 8px;

        align-items: center;
      }

      .mb-tour-farmer {
        width: 53px;
        height: 53px;

        border-radius: 15px;
      }

      .mb-tour-speaking {
        margin-bottom: 2px;

        font-size: 7px;
        letter-spacing: .6px;
      }

      .mb-tour-card h2 {
        margin-bottom: 3px;

        font-size: 14px;
        line-height: 1.18;
      }

      .mb-tour-card p {
        font-size: 9.5px;
        line-height: 1.35;
      }

      .mb-tour-controls {
        gap: 5px;

        margin-top: 8px;
        padding-top: 7px;
      }

      .mb-tour-left,
      .mb-tour-right {
        gap: 4px;
      }

      .mb-tour-btn {
        min-height: 31px;

        padding:
          6px 8px;

        border-radius: 8px;

        font-size: 9px;
      }

      .mb-tour-close {
        width: 26px;
        height: 26px;

        font-size: 15px;
      }

      .mb-guide-farmer {
        width: 43px;
        height: 43px;

        border-radius: 13px;
      }

      .sa-assistant-avatar.mb-smart-farmer-avatar {
        width: 68px;
        height: 68px;

        border-radius: 19px;
      }
    }

    @media(max-width:380px) {

      .mb-tour-card {
        max-height: 39dvh;

        padding:
          8px 9px 8px;
      }

      .mb-tour-guide-row {
        grid-template-columns:
          45px
          minmax(0,1fr);

        gap: 7px;
      }

      .mb-tour-farmer {
        width: 45px;
        height: 45px;

        border-radius: 13px;
      }

      .mb-tour-card h2 {
        font-size: 12px;
      }

      .mb-tour-card p {
        font-size: 8.5px;
        line-height: 1.3;
      }

      .mb-tour-btn {
        min-height: 29px;

        padding:
          5px 6px;

        font-size: 8px;
      }
    }

    /* ========================================================
       REDUCED MOTION
       ======================================================== */

    @media(prefers-reduced-motion:reduce) {

      .mb-tour-launcher,
      .mb-tour-focus,
      .mb-tour-progress span,
      .mb-tour-farmer,
      .mb-farmer-wave,
      .mb-farmer-eyes,
      .mb-guide-farmer,
      .sa-assistant-avatar.mb-smart-farmer-avatar,
      .mb-smart-farmer-status::before,
      .sa-smart-farmer-status::before,
      .mb-farmer-emote,
      .mb-farmer-sparkles {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  /* ==========================================================
     FARMER AVATAR HELPERS
     ========================================================== */

  function farmerAvatars() {
    return [
      ...$$(
        ".mb-tour-farmer, " +
        ".mb-guide-farmer, " +
        ".mb-smart-farmer-avatar"
      )
    ];
  }

  function farmerEyes() {
    return [
      ...$$(".mb-farmer-eyes")
    ];
  }

  function clearFarmerMood(avatar) {
    avatar.classList.remove(
      "mb-farmer-happy",
      "mb-farmer-talking",
      "mb-farmer-nod",
      "mb-farmer-celebrate",
      "mb-farmer-sad",
      "mb-farmer-wiggle"
    );
  }

  function farmerMood(mood) {

    const avatars = farmerAvatars();

    avatars.forEach(avatar => {

      clearFarmerMood(avatar);

      if (!mood) return;

      void avatar.offsetWidth;

      avatar.classList.add(
        `mb-farmer-${mood}`
      );

      if (mood === "celebrate") {

        const sparkles =
          document.createElement("span");

        sparkles.className =
          "mb-farmer-sparkles";

        sparkles.textContent =
          "✦ ✨ ✦";

        sparkles.setAttribute(
          "aria-hidden",
          "true"
        );

        avatar.appendChild(sparkles);

        window.setTimeout(() => {
          sparkles.remove();
        }, 1100);
      }
    });

    window.setTimeout(() => {

      farmerAvatars().forEach(
        clearFarmerMood
      );

    }, mood === "celebrate" ? 3000 : 1400);
  }

  /* ==========================================================
     RANDOM EMOTES
     ========================================================== */

  const RANDOM_EMOTES = [
    {
      mood: "happy",
      icon: "😊"
    },
    {
      mood: "talking",
      icon: "💬"
    },
    {
      mood: "nod",
      icon: "👍"
    },
    {
      mood: "wiggle",
      icon: "👋"
    },
    {
      mood: "happy",
      icon: "🌱"
    },
    {
      mood: "nod",
      icon: "🌾"
    },
    {
      mood: "talking",
      icon: "🧑🏾‍🌾"
    }
  ];

  let randomEmoteTimer = null;

  function showRandomEmote() {

    if (!tourOpen) return;

    const avatars = farmerAvatars();

    if (!avatars.length) return;

    const choice =
      RANDOM_EMOTES[
        Math.floor(
          Math.random() *
          RANDOM_EMOTES.length
        )
      ];

    farmerMood(choice.mood);

    avatars.forEach(avatar => {

      const old =
        $(".mb-farmer-emote", avatar);

      if (old) old.remove();

      const bubble =
        document.createElement("span");

      bubble.className =
        "mb-farmer-emote";

      bubble.textContent =
        choice.icon;

      bubble.setAttribute(
        "aria-hidden",
        "true"
      );

      avatar.appendChild(bubble);

      window.setTimeout(() => {
        bubble.remove();
      }, 800);
    });
  }

  function startRandomEmotes() {

    stopRandomEmotes();

    randomEmoteTimer =
      window.setInterval(() => {

        if (!tourOpen) return;

        /*
         * Random delay feeling:
         * the interval itself changes after
         * every emote.
         */
        showRandomEmote();

        stopRandomEmotes();

        const delay =
          4500 +
          Math.random() * 5500;

        randomEmoteTimer =
          window.setTimeout(() => {
            startRandomEmotes();
          }, delay);

      }, 5000);
  }

  function stopRandomEmotes() {

    if (randomEmoteTimer) {

      window.clearInterval(
        randomEmoteTimer
      );

      window.clearTimeout(
        randomEmoteTimer
      );

      randomEmoteTimer = null;
    }
  }

  /* ==========================================================
     EYES FOLLOW CURSOR
     ========================================================== */

  function moveEyes(clientX, clientY) {

    const x =
      (clientX / window.innerWidth - .5) * 5;

    const y =
      (clientY / window.innerHeight - .5) * 3.5;

    farmerEyes().forEach(eyes => {

      eyes.style.transform =
        `translate(${x}px, ${y}px)`;
    });
  }

  document.addEventListener(
    "pointermove",
    event => {

      if (event.pointerType === "touch") {
        return;
      }

      moveEyes(
        event.clientX,
        event.clientY
      );

    },
    { passive: true }
  );

  /* ==========================================================
     MOBILE TAP REACTION
     ========================================================== */

  document.addEventListener(
    "pointerdown",
    event => {

      moveEyes(
        event.clientX,
        event.clientY
      );

      if (
        event.pointerType === "touch" &&
        tourOpen
      ) {

        farmerMood("happy");

        window.setTimeout(
          () => showRandomEmote(),
          180
        );
      }

    },
    { passive: true }
  );

  /* ==========================================================
     ADD FARMER TO GUIDE
     ========================================================== */

  function addGuideAvatar() {

    const header =
      $(".mb-guide-panel .mb-guide-head");

    if (!header) return;

    if (
      $(".mb-guide-farmer", header)
    ) {
      return;
    }

    const avatar =
      document.createElement("div");

    avatar.className =
      "mb-guide-farmer";

    avatar.setAttribute(
      "role",
      "img"
    );

    avatar.setAttribute(
      "aria-label",
      "Animated MavunoBridge farmer guide"
    );

    avatar.innerHTML =
      FARMER_SVG;

    const headingGroup =
      header.querySelector(
        ".mb-guide-head-copy"
      ) ||
      header.querySelector("div");

    if (headingGroup) {

      headingGroup.classList.add(
        "mb-guide-head-copy"
      );

      header.insertBefore(
        avatar,
        headingGroup
      );

    } else {

      header.prepend(
        avatar
      );
    }
  }

  /* ==========================================================
     SMART ASSIST FARMER
     ========================================================== */

  function addSmartAssistAvatar() {

    if (
      PAGE !== "smart-assist.html"
    ) {
      return;
    }

    const avatar =
      $(".sa-assistant-avatar");

    if (!avatar) return;

    avatar.classList.add(
      "mb-smart-farmer-avatar"
    );

    avatar.setAttribute(
      "role",
      "img"
    );

    avatar.setAttribute(
      "aria-label",
      "MavunoBridge animated farming assistant"
    );

    if (
      !$(".mb-farmer-art", avatar)
    ) {

      avatar.innerHTML =
        FARMER_SVG;
    }

    const intro =
      $(".sa-assistant-intro");

    if (!intro) return;

    if (
      $(".mb-smart-farmer-status", intro) ||
      $(".sa-smart-farmer-status", intro)
    ) {
      return;
    }

    const status =
      document.createElement("span");

    status.className =
      "mb-smart-farmer-status";

    status.textContent =
      language() === "sw"
        ? "MSAIDIZI WA SHAMBA"
        : language() === "en"
          ? "FARM ASSISTANT"
          : "FARM BUDDY · READY";

    const heading =
      $("#assistantWelcome", intro) ||
      $("h3", intro);

    if (heading) {

      heading.parentNode.insertBefore(
        status,
        heading
      );

    } else {

      intro.prepend(
        status
      );
    }
  }

  function setupAvatars() {

    addGuideAvatar();

    addSmartAssistAvatar();
  }

  /* ==========================================================
     TOUR UI
     ========================================================== */

  const launcher =
    document.createElement("button");

  launcher.type = "button";

  launcher.className =
    "mb-tour-launcher";

  launcher.textContent =
    "🧭 Website Tour";

  launcher.setAttribute(
    "aria-label",
    "Open MavunoBridge website tour"
  );

  document.body.appendChild(
    launcher
  );

  const layer =
    document.createElement("div");

  layer.className =
    "mb-tour-layer";

  layer.hidden = true;

  layer.innerHTML = `

    <div
      class="mb-tour-shade"
      data-shade="top">
    </div>

    <div
      class="mb-tour-shade"
      data-shade="left">
    </div>

    <div
      class="mb-tour-shade"
      data-shade="right">
    </div>

    <div
      class="mb-tour-shade"
      data-shade="bottom">
    </div>

    <div
      class="mb-tour-focus"
      hidden>
    </div>

    <section
      class="mb-tour-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbTourTitle"
      aria-describedby="mbTourText">

      <div class="mb-tour-top">

        <div class="mb-tour-brand">

          <span class="mb-tour-mark">
            M
          </span>

          <span>
            MavunoBridge · Tour
          </span>

        </div>

        <span
          class="mb-tour-count"
          id="mbTourCount">
        </span>

        <button
          type="button"
          class="mb-tour-close"
          id="mbTourClose"
          aria-label="Skip tutorial">
          ×
        </button>

      </div>

      <div
        class="mb-tour-progress"
        aria-hidden="true">

        <span
          id="mbTourProgress">
        </span>

      </div>

      <div class="mb-tour-guide-row">

        <div
          class="mb-tour-farmer"
          role="img"
          aria-label="Animated farmer assistant">

          ${FARMER_SVG}

        </div>

        <div
          class="mb-tour-guide-copy">

          <span
            class="mb-tour-speaking"
            id="mbTourSpeaking">

            YOUR FARMING GUIDE

          </span>

          <h2
            id="mbTourTitle">
          </h2>

          <p
            id="mbTourText">
          </p>

        </div>

      </div>

      <div class="mb-tour-controls">

        <div class="mb-tour-left">

          <button
            type="button"
            class="mb-tour-btn"
            id="mbTourSkip">

            Skip tutorial

          </button>

        </div>

        <div class="mb-tour-right">

          <button
            type="button"
            class="mb-tour-btn"
            id="mbTourBack">

            Back

          </button>

          <button
            type="button"
            class="mb-tour-btn mb-tour-next"
            id="mbTourNext">

            Next →

          </button>

        </div>

      </div>

    </section>
  `;

  document.body.appendChild(
    layer
  );

  const inTour =
    selector => $(selector, layer);

  const shades =
    Object.fromEntries(
      $$(".mb-tour-shade", layer)
        .map(node => [
          node.dataset.shade,
          node
        ])
    );

  const focusRing =
    inTour(".mb-tour-focus");

  let steps = getSteps();

  let index = 0;

  let tourOpen = false;

  let lastFocused = null;

  let animationFrame = 0;

  /* ==========================================================
     TARGET FINDER
     ========================================================== */

  function getTarget(selectors) {

    const list =
      Array.isArray(selectors)
        ? selectors
        : [selectors];

    for (const selector of list) {

      if (!selector) continue;

      try {

        const target =
          $(selector);

        if (
          target &&
          target.getClientRects().length
        ) {
          return target;
        }

      } catch (error) {

        console.warn(
          "Invalid tour target:",
          selector
        );
      }
    }

    return null;
  }

  /* ==========================================================
     SPOTLIGHT
     ========================================================== */

  function setShade(
    name,
    left,
    top,
    width,
    height
  ) {

    const node =
      shades[name];

    node.style.left =
      `${Math.max(0,left)}px`;

    node.style.top =
      `${Math.max(0,top)}px`;

    node.style.width =
      `${Math.max(0,width)}px`;

    node.style.height =
      `${Math.max(0,height)}px`;
  }

  function positionSpotlight(
    target
  ) {

    const vw =
      window.innerWidth;

    const vh =
      window.innerHeight;

    if (!target) {

      setShade(
        "top",
        0,
        0,
        vw,
        vh
      );

      setShade(
        "left",
        0,
        0,
        0,
        0
      );

      setShade(
        "right",
        0,
        0,
        0,
        0
      );

      setShade(
        "bottom",
        0,
        0,
        0,
        0
      );

      focusRing.hidden =
        true;

      return;
    }

    const rect =
      target.getBoundingClientRect();

    if (
      rect.bottom <= 0 ||
      rect.top >= vh ||
      rect.right <= 0 ||
      rect.left >= vw
    ) {

      positionSpotlight(
        null
      );

      return;
    }

    const padding = 7;

    const left =
      Math.max(
        4,
        rect.left - padding
      );

    const top =
      Math.max(
        4,
        rect.top - padding
      );

    const right =
      Math.min(
        vw - 4,
        rect.right + padding
      );

    const bottom =
      Math.min(
        vh - 4,
        rect.bottom + padding
      );

    setShade(
      "top",
      0,
      0,
      vw,
      top
    );

    setShade(
      "left",
      0,
      top,
      left,
      bottom - top
    );

    setShade(
      "right",
      right,
      top,
      vw - right,
      bottom - top
    );

    setShade(
      "bottom",
      0,
      bottom,
      vw,
      vh - bottom
    );

    focusRing.hidden =
      false;

    focusRing.style.left =
      `${left}px`;

    focusRing.style.top =
      `${top}px`;

    focusRing.style.width =
      `${right - left}px`;

    focusRing.style.height =
      `${bottom - top}px`;

    focusRing.style.borderRadius =
      getComputedStyle(
        target
      ).borderRadius ||
      "10px";
  }

  function scheduleReposition() {

    if (
      !tourOpen ||
      animationFrame
    ) {
      return;
    }

    animationFrame =
      requestAnimationFrame(() => {

        animationFrame = 0;

        positionSpotlight(
          getTarget(
            steps[index]?.target
          )
        );

      });
  }

  /* ==========================================================
     LABELS
     ========================================================== */

  function labels() {

    if (
      language() === "sw"
    ) {

      return {
        step: "Hatua",
        skip: "Ruka mwongozo",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        speaking:
          "MSAIDIZI WAKO WA KILIMO"
      };
    }

    if (
      language() === "en"
    ) {

      return {
        step: "Step",
        skip: "Skip tutorial",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        speaking:
          "YOUR FARMING GUIDE"
      };
    }

    return {
      step: "Hatua",
      skip: "Skip tutorial",
      back: "Back",
      next: "Next →",
      finish: "Finish ✓",
      speaking:
        "FARM BUDDY · READY"
    };
  }

  /* ==========================================================
     RENDER STEP
     ========================================================== */

  function renderStep(
    shouldScroll = true
  ) {

    if (!steps.length) return;

    index =
      Math.max(
        0,
        Math.min(
          index,
          steps.length - 1
        )
      );

    const current =
      steps[index];

    const words =
      labels();

    const target =
      getTarget(
        current.target
      );

    inTour(
      "#mbTourTitle"
    ).textContent =
      translate(
        current.title
      );

    inTour(
      "#mbTourText"
    ).textContent =
      translate(
        current.description
      );

    inTour(
      "#mbTourCount"
    ).textContent =
      `${words.step} ${index + 1} / ${steps.length}`;

    inTour(
      "#mbTourProgress"
    ).style.width =
      `${((index + 1) / steps.length) * 100}%`;

    inTour(
      "#mbTourSkip"
    ).textContent =
      words.skip;

    inTour(
      "#mbTourBack"
    ).textContent =
      words.back;

    inTour(
      "#mbTourBack"
    ).disabled =
      index === 0;

    inTour(
      "#mbTourNext"
    ).textContent =
      index === steps.length - 1
        ? words.finish
        : words.next;

    inTour(
      "#mbTourSpeaking"
    ).textContent =
      words.speaking;

    /*
     * Farmer talks/nods every time
     * the guide changes topic.
     */
    farmerMood(
      index % 2 === 0
        ? "talking"
        : "nod"
    );

    if (
      shouldScroll &&
      target
    ) {

      const reduced =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      target.scrollIntoView({
        behavior:
          reduced
            ? "auto"
            : "smooth",

        block: "center",

        inline: "nearest"
      });
    }

    window.setTimeout(
      () => {

        if (tourOpen) {

          positionSpotlight(
            getTarget(
              steps[index]?.target
            )
          );
        }

      },
      shouldScroll && target
        ? 350
        : 0
    );
  }

  /* ==========================================================
     STORAGE
     ========================================================== */

  function completed() {

    try {

      return (
        localStorage.getItem(
          `${STORAGE_KEY}:${PAGE}`
        ) === "1"
      );

    } catch {

      return false;
    }
  }

  function markCompleted() {

    try {

      localStorage.setItem(
        `${STORAGE_KEY}:${PAGE}`,
        "1"
      );

    } catch {}
  }

  /* ==========================================================
     CLOSE TOUR
     ========================================================== */

  function closeTour({
    skipped = false,
    celebrated = false
  } = {}) {

    layer.hidden =
      true;

    launcher.hidden =
      false;

    tourOpen =
      false;

    markCompleted();

    stopRandomEmotes();

    window.removeEventListener(
      "resize",
      scheduleReposition
    );

    window.removeEventListener(
      "scroll",
      scheduleReposition,
      true
    );

    /*
     * FINISH
     */
    if (celebrated) {

      farmerMood(
        "celebrate"
      );

      window.setTimeout(
        () => {

          farmerAvatars()
            .forEach(avatar => {

              const old =
                $(".mb-farmer-emote", avatar);

              if (old) old.remove();

              const bubble =
                document.createElement(
                  "span"
                );

              bubble.className =
                "mb-farmer-emote";

              bubble.textContent =
                "🎉";

              avatar.appendChild(
                bubble
              );

              window.setTimeout(
                () => bubble.remove(),
                900
              );

            });

        },
        250
      );
    }

    /*
     * SKIP
     */
    if (skipped) {

      farmerMood(
        "sad"
      );

      farmerAvatars()
        .forEach(avatar => {

          const bubble =
            document.createElement(
              "span"
            );

          bubble.className =
            "mb-farmer-emote";

          bubble.textContent =
            "🥺";

          avatar.appendChild(
            bubble
          );

          window.setTimeout(
            () => bubble.remove(),
            850
          );

        });
    }

    if (
      lastFocused &&
      typeof lastFocused.focus ===
        "function"
    ) {

      try {

        lastFocused.focus({
          preventScroll: true
        });

      } catch {}
    }
  }

  /* ==========================================================
     OPEN TOUR
     ========================================================== */

  function openTour() {

    lastFocused =
      document.activeElement;

    steps =
      getSteps();

    index = 0;

    tourOpen =
      true;

    layer.hidden =
      false;

    launcher.hidden =
      true;

    setupAvatars();

    farmerMood(
      "happy"
    );

    renderStep(
      true
    );

    window.addEventListener(
      "resize",
      scheduleReposition
    );

    window.addEventListener(
      "scroll",
      scheduleReposition,
      true
    );

    startRandomEmotes();

    window.setTimeout(
      () => {

        inTour(
          "#mbTourNext"
        )?.focus({
          preventScroll: true
        });

      },
      50
    );
  }

  /* ==========================================================
     BUTTON EVENTS
     ========================================================== */

  launcher.addEventListener(
    "click",
    openTour
  );

  inTour(
    "#mbTourClose"
  ).addEventListener(
    "click",
    () => {

      closeTour({
        skipped: true
      });

    }
  );

  inTour(
    "#mbTourSkip"
  ).addEventListener(
    "click",
    () => {

      closeTour({
        skipped: true
      });

    }
  );

  inTour(
    "#mbTourBack"
  ).addEventListener(
    "click",
    () => {

      if (index > 0) {

        index -= 1;

        farmerMood(
          "nod"
        );

        renderStep(
          true
        );
      }
    }
  );

  inTour(
    "#mbTourNext"
  ).addEventListener(
    "click",
    () => {

      if (
        index <
        steps.length - 1
      ) {

        index += 1;

        farmerMood(
          index % 2 === 0
            ? "talking"
            : "nod"
        );

        renderStep(
          true
        );

      } else {

        /*
         * FINAL STEP:
         * Farmer celebrates instead
         * of simply disappearing.
         */

        closeTour({
          celebrated: true
        });
      }
    }
  );

  /* ==========================================================
     KEYBOARD
     ========================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (!tourOpen) return;

      if (
        event.key === "Escape"
      ) {

        event.preventDefault();

        closeTour({
          skipped: true
        });

      } else if (
        event.key === "ArrowRight" &&
        index <
          steps.length - 1
      ) {

        index += 1;

        farmerMood(
          "talking"
        );

        renderStep(
          true
        );

      } else if (
        event.key === "ArrowLeft" &&
        index > 0
      ) {

        index -= 1;

        farmerMood(
          "nod"
        );

        renderStep(
          true
        );
      }
    }
  );

  /* ==========================================================
     LANGUAGE SWITCH
     ========================================================== */

  $("#languageSelect")?.addEventListener(
    "change",
    () => {

      setupAvatars();

      if (tourOpen) {

        renderStep(
          false
        );
      }
    }
  );

  /* ==========================================================
     FIRST VISIT
     ========================================================== */

  function startIfNewVisitor() {

    if (completed()) {
      return;
    }

    window.setTimeout(
      () => {

        if (!tourOpen) {
          openTour();
        }

      },
      850
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startIfNewVisitor,
      { once: true }
    );

  } else {

    startIfNewVisitor();
  }

  /* ==========================================================
     SETUP AVATARS
     ========================================================== */

  setupAvatars();

  /* ==========================================================
     WATCH FOR DYNAMIC GUIDE
     ========================================================== */

  const observer =
    new MutationObserver(
      () => {

        addGuideAvatar();
        addSmartAssistAvatar();

      }
    );

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

  window.setTimeout(
    () => {

      observer.disconnect();

      setupAvatars();

    },
    7000
  );

  console.info(
    "MavunoBridge animated farmer tour ready."
  );

})();
