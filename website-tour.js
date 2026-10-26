/* ============================================================
   MAVUNOBRIDGE — COMPLETE WEBSITE TOUR + FARMER ASSISTANT
   File: website-tour.js

   FEATURES
   ✓ Automatic first-visit tutorial
   ✓ Skip, Back, Next and Finish buttons
   ✓ Website section spotlight
   ✓ Animated farmer mascot inspired by your reference image
   ✓ Random farmer emotes
   ✓ Buyer + Farmer Guide avatar
   ✓ Smart Assist avatar
   ✓ English, Sheng + English, Kiswahili
   ✓ Translucent tutorial card
   ✓ Responsive mobile layout
   ✓ Reduced-motion accessibility
   ✓ Keyboard controls
   ✓ No external libraries
   ✓ No external image dependencies
   ✓ Safe handling of missing website sections

   IMPORTANT
   This file does not replace app.js, style.css or other pages.
   It adds the tour and enhances existing assistant avatars.
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     1. PREVENT DUPLICATE INITIALIZATION
     ============================================================ */

  if (window.__MAVUNOBRIDGE_WEBSITE_TOUR_V4__) return;

  window.__MAVUNOBRIDGE_WEBSITE_TOUR_V4__ = true;

  const PAGE = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE_KEY = "mavunobridge_tour_completed_v4";
  const PREVIOUS_STORAGE_KEY = "mavunobridge_tour_completed_v3";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const phrase = (en, mix, sw) => ({ en, mix, sw });

  const makeStep = (target, title, description) => ({
    target,
    title,
    description
  });

  /* ============================================================
     2. LANGUAGE SUPPORT
     ============================================================ */

  function getLanguage() {
    const select = $("#languageSelect");

    if (select && ["en", "mix", "sw"].includes(select.value)) {
      return select.value;
    }

    try {
      const saved =
        localStorage.getItem("mavunobridge_language_v1") ||
        localStorage.getItem("mavunobridge_language_v2");

      if (["en", "mix", "sw"].includes(saved)) {
        return saved;
      }
    } catch (error) {
      // Continue with the default language.
    }

    return "mix";
  }

  function translate(value) {
    if (typeof value === "string") return value;

    const lang = getLanguage();

    return value?.[lang] || value?.mix || value?.en || "";
  }

  /* ============================================================
     3. FARMER MASCOT SVG
     Inspired by the uploaded gardener figurine:
     green hat, brown shirt, green overalls, boots and tools.
     ============================================================ */

  const FARMER_SVG = `
    <svg
      class="mb-farmer-art"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      role="presentation"
      focusable="false"
    >
      <defs>
        <linearGradient id="mbFarmerSkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f3a16a"/>
          <stop offset="100%" stop-color="#c7683b"/>
        </linearGradient>

        <linearGradient id="mbFarmerHat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#46804a"/>
          <stop offset="100%" stop-color="#174329"/>
        </linearGradient>

        <linearGradient id="mbFarmerOveralls" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#276e48"/>
          <stop offset="100%" stop-color="#123e2b"/>
        </linearGradient>

        <linearGradient id="mbFarmerBoots" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#51402f"/>
          <stop offset="100%" stop-color="#241d17"/>
        </linearGradient>
      </defs>

      <!-- Ground shadow -->
      <ellipse
        cx="59"
        cy="133"
        rx="35"
        ry="5"
        fill="#183d28"
        opacity=".15"
      />

      <!-- Garden tool behind the body -->
      <g class="mb-farmer-tool">
        <path
          d="M27 42 L30 104"
          stroke="#89552e"
          stroke-width="5"
          stroke-linecap="round"
        />

        <path
          d="M22 43 L34 43 L36 51 L27 56 L20 51 Z"
          fill="#636d66"
          stroke="#414c44"
          stroke-width="1.5"
        />

        <path
          d="M27 47 L33 47"
          stroke="#a8b1a8"
          stroke-width="1.5"
        />
      </g>

      <!-- Legs -->
      <path
        d="M37 91 L56 91 L55 116 L36 116 Z"
        fill="url(#mbFarmerOveralls)"
      />

      <path
        d="M63 91 L82 91 L81 116 L64 116 Z"
        fill="url(#mbFarmerOveralls)"
      />

      <!-- Boots -->
      <g class="mb-farmer-boots">
        <path
          d="M36 111 L54 111 L56 125
             Q55 132 32 130
             Q27 129 31 122 Z"
          fill="url(#mbFarmerBoots)"
        />

        <path
          d="M65 111 L82 111 L89 124
             Q94 131 70 131
             Q64 130 64 124 Z"
          fill="url(#mbFarmerBoots)"
        />

        <path
          d="M32 126 Q43 129 55 126"
          fill="none"
          stroke="#78624a"
          stroke-width="2"
          stroke-linecap="round"
        />

        <path
          d="M68 126 Q78 129 88 126"
          fill="none"
          stroke="#78624a"
          stroke-width="2"
          stroke-linecap="round"
        />
      </g>

      <!-- Shirt -->
      <path
        d="M43 43 L77 43 L89 72
           L79 84 L41 84 L31 72 Z"
        fill="#8a482d"
      />

      <!-- Neck -->
      <path
        d="M49 36 L49 49
           Q60 56 71 48 L71 36 Z"
        fill="url(#mbFarmerSkin)"
      />

      <!-- Overalls -->
      <path
        d="M34 58 L86 58 L82 100
           Q60 108 38 100 Z"
        fill="url(#mbFarmerOveralls)"
      />

      <!-- Shoulder straps -->
      <path
        d="M42 45 L52 45 L56 74 L44 74 Z"
        fill="#246443"
      />

      <path
        d="M68 45 L78 45 L76 74 L64 74 Z"
        fill="#246443"
      />

      <!-- Brass buttons -->
      <circle cx="47" cy="49" r="2.7" fill="#e8bd62"/>
      <circle cx="73" cy="49" r="2.7" fill="#e8bd62"/>

      <!-- Overall pocket -->
      <path
        d="M47 70 L72 70 L72 84
           Q60 89 47 84 Z"
        fill="#1d593b"
        stroke="#39815a"
        stroke-width="1.4"
      />

      <path
        d="M51 74 L68 74"
        stroke="#3f8059"
        stroke-width="1.4"
        stroke-linecap="round"
      />

      <!-- Ears -->
      <ellipse cx="35" cy="34" rx="6" ry="8" fill="#c96f42"/>
      <ellipse cx="85" cy="34" rx="6" ry="8" fill="#c96f42"/>

      <!-- Face -->
      <ellipse
        cx="60"
        cy="34"
        rx="25"
        ry="29"
        fill="url(#mbFarmerSkin)"
      />

      <!-- Cheeks -->
      <ellipse cx="44" cy="41" rx="5" ry="3" fill="#e99165" opacity=".55"/>
      <ellipse cx="76" cy="41" rx="5" ry="3" fill="#e99165" opacity=".55"/>

      <!-- Hair -->
      <path
        d="M36 28 Q34 9 54 7
           Q76 5 85 27
           L77 22 L48 19 Z"
        fill="#35271d"
      />

      <!-- Eyes -->
      <g class="mb-farmer-eyes">
        <ellipse cx="50" cy="33" rx="3" ry="4" fill="#29211b"/>
        <ellipse cx="70" cy="33" rx="3" ry="4" fill="#29211b"/>

        <circle cx="51" cy="32" r="1" fill="#ffffff"/>
        <circle cx="71" cy="32" r="1" fill="#ffffff"/>
      </g>

      <!-- Eyebrows -->
      <path
        d="M45 26 Q50 23 55 26"
        fill="none"
        stroke="#493025"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <path
        d="M65 26 Q70 23 75 26"
        fill="none"
        stroke="#493025"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <!-- Nose -->
      <ellipse cx="60" cy="40" rx="5" ry="4.5" fill="#bc603b"/>

      <ellipse cx="59" cy="39" rx="2" ry="1.5" fill="#e99b6d" opacity=".8"/>

      <!-- Smile -->
      <g class="mb-farmer-mouth">
        <path
          d="M49 47 Q60 57 72 46"
          fill="none"
          stroke="#713820"
          stroke-width="2.8"
          stroke-linecap="round"
        />
      </g>

      <!-- Hat crown -->
      <path
        d="M37 23 Q39 2 60 2
           Q82 2 85 23 Z"
        fill="url(#mbFarmerHat)"
      />

      <!-- Hat crown highlight -->
      <path
        d="M48 11 Q59 5 71 10"
        fill="none"
        stroke="#77a56a"
        stroke-width="2"
        stroke-linecap="round"
        opacity=".8"
      />

      <!-- Wide hat brim -->
      <path
        d="M17 24
           Q59 9 103 24
           Q98 35 77 34
           L43 34
           Q23 34 17 24 Z"
        fill="#19462b"
      />

      <path
        d="M27 24 Q60 15 93 24"
        fill="none"
        stroke="#477b48"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Animated waving arm -->
      <g class="mb-farmer-wave">
        <path
          d="M81 53 Q88 63 91 75"
          fill="none"
          stroke="#8a482d"
          stroke-width="12"
          stroke-linecap="round"
        />

        <path
          d="M81 53 Q88 63 91 75"
          fill="none"
          stroke="#d77c49"
          stroke-width="9"
          stroke-linecap="round"
        />

        <path
          d="M91 75 L95 83"
          fill="none"
          stroke="#d77c49"
          stroke-width="9"
          stroke-linecap="round"
        />

        <g class="mb-farmer-hand">
          <circle cx="96" cy="84" r="6" fill="#e69a64"/>

          <path
            d="M94 81 L92 75
               M97 80 L97 73
               M100 82 L102 77"
            fill="none"
            stroke="#e69a64"
            stroke-width="3"
            stroke-linecap="round"
          />
        </g>
      </g>

      <!-- Small watering can -->
      <g class="mb-farmer-can">
        <path
          d="M87 101 L105 101 L103 124
             Q96 129 89 124 Z"
          fill="#285c3e"
        />

        <ellipse cx="96" cy="101" rx="9" ry="3.5" fill="#49865a"/>

        <path
          d="M90 102 Q91 92 99 93 Q105 94 104 102"
          fill="none"
          stroke="#204d33"
          stroke-width="3"
        />

        <path
          d="M104 107 L113 103 L115 107 L104 112 Z"
          fill="#3b7650"
        />

        <path
          d="M91 114 L102 114"
          stroke="#5d9869"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </g>

      <!-- Tiny plant detail -->
      <g class="mb-farmer-plant">
        <path
          d="M60 102 L60 111"
          stroke="#a5ce69"
          stroke-width="2"
          stroke-linecap="round"
        />

        <path
          d="M60 106 Q52 96 48 102
             Q53 109 60 106 Z"
          fill="#a5ce69"
        />

        <path
          d="M60 104 Q67 94 72 99
             Q69 106 60 104 Z"
          fill="#76b456"
        />
      </g>
    </svg>
  `;

  /* ============================================================
     4. TOUR CONTENT — ENGLISH, SHENG + ENGLISH, KISWAHILI
     ============================================================ */

  const TOURS = {
    "index.html": [
      makeStep(
        [".topbar", ".navbar", "header"],
        phrase("Welcome to MavunoBridge!", "Karibu MavunoBridge! 🌱", "Karibu MavunoBridge!"),
        phrase(
          "I'm your farming buddy. I'll show you how to explore the marketplace, find products, and connect with farmers.",
          "Niko hapa kukushow vile MavunoBridge inawork. Let's find fresh produce and connect na farmers!",
          "Mimi ni msaidizi wako. Nitakuonyesha jinsi ya kutafuta bidhaa na kuwasiliana na wakulima."
        )
      ),
      makeStep(
        ["#categoryGrid", ".category-grid", "#categories"],
        phrase("Explore product categories", "Chagua category yako", "Chagua aina ya bidhaa"),
        phrase(
          "Browse fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs, and more.",
          "Hapa kuna fruits, veggies, grains, cereals, legumes, livestock na farm tools. Chagua unataka nini!",
          "Tafuta matunda, mboga, nafaka, kunde, mifugo, pembejeo na bidhaa nyingine."
        )
      ),
      makeStep(
        [".search-bar", "#searchInput", "#searchBar", 'input[type="search"]'],
        phrase("Search for products", "Tafuta bidhaa haraka", "Tafuta bidhaa"),
        phrase(
          "Type a product name, such as tomatoes, maize, potatoes, or avocados, to find matching listings.",
          "Type jina ya product, kama tomatoes ama maize, upate listings zinazofanana.",
          "Andika jina la bidhaa unayotafuta ili kuona matangazo yanayolingana."
        )
      ),
      makeStep(
        [".filters", "#filterPanel", ".market-filters"],
        phrase("Use filters", "Tumia filters", "Tumia vichujio"),
        phrase(
          "Filter listings by county, price, sale type, or sorting options when those controls are available.",
          "Tumia filters kuchagua county, sale type na kupanga listings kulingana na options zilizopo.",
          "Tumia vichujio kuchagua kaunti, aina ya mauzo na mpangilio wa bidhaa."
        )
      ),
      makeStep(
        ["#listingGrid", ".listing-grid", ".product-grid", ".products-grid"],
        phrase("Explore farmer listings", "Angalia bidhaa za farmers", "Angalia bidhaa za wakulima"),
        phrase(
          "Compare products, prices, quantities, locations, and available details before deciding what to buy.",
          "Compare bei, quantity na location. Angalia details za product kabla uamue kununua.",
          "Linganisha bei, kiasi, eneo na maelezo ya bidhaa kabla ya kununua."
        )
      ),
      makeStep(
        ["#sellButton", "#heroSellButton", "#addListingButton", 'a[href*="sell"]'],
        phrase("List your farm products", "Uza bidhaa zako", "Weka bidhaa zako sokoni"),
        phrase(
          "Farmers can use the listing form to add product details, prices, quantities, categories, and photos when supported.",
          "Wewe ni farmer? Tumia listing form kuweka bidhaa, category, quantity, bei na picha.",
          "Wakulima wanaweza kuweka bidhaa zao, bei, kiasi, aina na picha kupitia fomu ya matangazo."
        )
      ),
      makeStep(
        ["#cartButton", "#cartIcon", ".cart-button", 'a[href*="cart"]'],
        phrase("Your shopping cart", "Shopping cart yako", "Kikapu chako"),
        phrase(
          "If the cart feature is available, use it to review the products you have added before continuing.",
          "Ukiadd products kwa cart, unaweza kuziangalia tena kabla ya kuendelea.",
          "Tumia kikapu kuangalia bidhaa ulizoongeza kabla ya kuendelea."
        )
      ),
      makeStep(
        ['a[href="smart-assist.html"]', 'a[href*="smart-assist"]', "#smartAssistLink"],
        phrase("Meet Smart Assist", "Kutana na Smart Assist", "Kutana na Smart Assist"),
        phrase(
          "Open Smart Assist for farming guidance, crop planning, and other tools provided by the demo.",
          "Smart Assist inakusaidia na crop planning na farming tips kulingana na features zilizopo.",
          "Fungua Smart Assist kupata mwongozo wa kilimo na kupanga mazao."
        )
      ),
      makeStep(
        ['a[href="sacco.html"]', 'a[href*="sacco"]', "#saccoLink"],
        phrase("Explore SACCO Hub", "Tembelea SACCO Hub", "Tembelea SACCO Hub"),
        phrase(
          "Explore the available SACCO and farming opportunity information. Check the details before applying or joining.",
          "Angalia SACCOs na opportunities zilizowekwa. Soma requirements kabla ya kujiunga.",
          "Angalia taarifa za SACCO na fursa za kilimo. Hakikisha umesoma masharti."
        )
      ),
      makeStep(
        ['a[href="buyer-requests.html"]', 'a[href*="buyer-requests"]', "#buyerRequestsLink"],
        phrase("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        phrase(
          "Where available, buyers can describe what they need so farmers can review their requests.",
          "Buyers wanaweza kuweka wanachotafuta ili farmers waone requests hizo.",
          "Wanunuzi wanaweza kueleza bidhaa wanazohitaji ili wakulima waone maombi hayo."
        )
      ),
      makeStep(
        ['a[href="messages.html"]', 'a[href*="messages"]', "#messagesLink"],
        phrase("Messages and support", "Messages na support", "Ujumbe na usaidizi"),
        phrase(
          "Use the messaging or support area if it is available to find help or communicate about a listing.",
          "Ukipata swali kuhusu listing, angalia sehemu ya messages au support.",
          "Tumia sehemu ya ujumbe au usaidizi ikiwa inapatikana."
        )
      ),
      makeStep(
        [".demo-note", "#demoNotice", ".demo-banner", "footer"],
        phrase("You're ready to explore!", "Uko ready kuanza!", "Uko tayari kuanza!"),
        phrase(
          "This is a demo, so some actions may use sample data or browser storage. Enjoy exploring MavunoBridge!",
          "Kumbuka hii ni demo. Baadhi ya features zinatumia sample data kwa browser yako. Explore MavunoBridge!",
          "Hii ni demo. Baadhi ya vipengele vinaweza kutumia data ya mfano iliyohifadhiwa kwenye kivinjari."
        )
      )
    ],

    "smart-assist.html": [
      makeStep(
        [".sa-hero", ".page-hero", "main h1"],
        phrase("Welcome to Smart Assist", "Karibu Smart Assist", "Karibu Smart Assist"),
        phrase(
          "I'm your farming buddy. Let's explore the farming guidance tools available on this page.",
          "Hapa ndio farm buddy wako! Tuchunguze tools za farming zilizo available.",
          "Mimi ni msaidizi wako wa kilimo. Tuchunguze zana za mwongozo zilizopo."
        )
      ),
      makeStep(
        ["#farmPlanner", ".farm-planner"],
        phrase("Plan your farming", "Panga kilimo chako", "Panga shughuli zako za kilimo"),
        phrase(
          "Use the planner to explore crop or farm planning options provided by the demo.",
          "Tumia planner kupanga mazao na shughuli zako kulingana na options zilizopo.",
          "Tumia kipangaji kuchunguza chaguo za kupanga mazao na shughuli za shamba."
        )
      ),
      makeStep(
        [".sa-symptom-field", "#saSymptomChecks", "#symptomChecks"],
        phrase("Describe crop symptoms", "Eleza shida ya mmea", "Eleza dalili za mmea"),
        phrase(
          "If a crop looks unhealthy, choose the symptoms you can observe. Treat results as guidance, not a confirmed diagnosis.",
          "Mmea ukiwa na shida, chagua symptoms unazoona. Ushauri wa demo si diagnosis ya uhakika.",
          "Ikiwa mmea unaonekana kuwa na shida, chagua dalili unazoona. Matokeo si utambuzi wa uhakika."
        )
      ),
      makeStep(
        ["#saPhoto", "#cropPhoto", 'input[type="file"]'],
        phrase("Add a crop photo", "Weka picha ya mmea", "Ongeza picha ya mmea"),
        phrase(
          "If photo upload is supported, add a clear crop photo to provide extra context.",
          "Ikiwa upload inafanya kazi, weka picha safi ya mmea ili kuongeza maelezo.",
          "Ikiwa upakiaji wa picha unapatikana, ongeza picha iliyo wazi ya mmea."
        )
      ),
      makeStep(
        ["#generateReportButton", "#reportSection", "#analyzeButton"],
        phrase("Review your farming report", "Angalia farming report", "Angalia ripoti ya kilimo"),
        phrase(
          "Use the available action to view the guidance generated by the demo. Verify important advice with a qualified local agricultural adviser.",
          "Bonyeza action iliyopo kuona report. Kwa maamuzi muhimu, uliza agricultural officer wa eneo lako.",
          "Tumia kitufe kilichopo kuona mwongozo. Thibitisha ushauri muhimu na mtaalamu wa kilimo."
        )
      ),
      makeStep(
        ["#saQuestionForm", "#assistantQuestionForm"],
        phrase("Ask the assistant", "Uliza assistant", "Uliza msaidizi"),
        phrase(
          "If the question form is enabled, type a farming question and use the available submit control.",
          "Kama question form iko active, type swali yako ya farming na utume.",
          "Ikiwa fomu inafanya kazi, andika swali lako la kilimo kisha ulitume."
        )
      ),
      makeStep(
        [".sa-library-controls", "#saCropLibraryGrid", "#cropLibrary"],
        phrase("Explore the crop library", "Angalia crop library", "Angalia maktaba ya mazao"),
        phrase(
          "Browse the crop information available in the demo and open the entries relevant to your farm.",
          "Explore crop library uone information za mazao zilizowekwa.",
          "Chunguza taarifa za mazao zilizopo na uchague zinazohusiana na shamba lako."
        )
      ),
      makeStep(
        ["#savedReportsSection", "#savedReports"],
        phrase("Saved reports", "Reports zilizohifadhiwa", "Ripoti zilizohifadhiwa"),
        phrase(
          "If saving is enabled, revisit reports stored by the demo in your browser.",
          "Kama saving iko active, unaweza kurudi kuona reports ulizohifadhi.",
          "Ikiwa uhifadhi unapatikana, unaweza kufungua tena ripoti zilizohifadhiwa kwenye kivinjari."
        )
      )
    ],

    "sacco.html": [
      makeStep(
        [".page-hero", "main h1"],
        phrase("Welcome to SACCO Hub", "Karibu SACCO Hub", "Karibu SACCO Hub"),
        phrase(
          "Explore the SACCO information and agricultural opportunities listed in this demo.",
          "Hapa unaweza kuchunguza SACCOs na opportunities za kilimo zilizowekwa.",
          "Chunguza taarifa za SACCO na fursa za kilimo zilizowekwa kwenye demo."
        )
      ),
      makeStep(
        [".sacco-controls", "#saccoFilters", ".filter-bar"],
        phrase("Find relevant opportunities", "Tafuta opportunities zinazokufaa", "Tafuta fursa zinazokufaa"),
        phrase(
          "Use the available search or filter controls to narrow down the displayed options.",
          "Tumia search au filters zilizopo kupata options zinazokufaa.",
          "Tumia utafutaji au vichujio kuchagua fursa zinazokufaa."
        )
      ),
      makeStep(
        ["#saccoGrid", ".sacco-grid", ".sacco-list"],
        phrase("Review SACCO cards", "Angalia SACCO cards", "Angalia kadi za SACCO"),
        phrase(
          "Read each entry carefully and confirm eligibility, fees, and requirements directly with the organisation.",
          "Soma details na uhakikishe eligibility, fees na requirements na organisation husika.",
          "Soma maelezo na uthibitishe masharti na ada moja kwa moja kwa taasisi husika."
        )
      ),
      makeStep(
        [".interest-panel", "#interestForm", "#joinSaccoForm"],
        phrase("Express your interest", "Onyesha interest yako", "Onyesha nia yako"),
        phrase(
          "If an interest form is available, use it to explore the demo's contact or enquiry flow.",
          "Kama form iko, itumie kuonyesha interest yako kwenye demo.",
          "Ikiwa fomu inapatikana, itumie kuwasilisha nia yako kwenye demo."
        )
      )
    ],

    "buyer-requests.html": [
      makeStep(
        [".page-hero", "main h1"],
        phrase("Welcome to Buyer Requests", "Karibu Buyer Requests", "Karibu kwenye maombi ya wanunuzi"),
        phrase(
          "This page helps buyers describe products they are looking for when the demo's request feature is available.",
          "Hapa buyers wanaweza kueleza products wanazotafuta ikiwa feature hii inafanya kazi.",
          "Hapa wanunuzi wanaweza kueleza bidhaa wanazotafuta ikiwa kipengele hiki kinapatikana."
        )
      ),
      makeStep(
        ["#demandForm", "#buyerRequestForm"],
        phrase("Create a request", "Weka request yako", "Weka ombi lako"),
        phrase(
          "Enter the product details requested by the form and review them before submitting.",
          "Weka details za product form inauliza, kisha uzikague kabla ya kutuma.",
          "Jaza maelezo ya bidhaa yanayohitajika na uyakague kabla ya kutuma."
        )
      ),
      makeStep(
        ["#demandList", "#buyerRequestList", ".demand-list"],
        phrase("Review buyer requests", "Angalia buyer requests", "Angalia maombi ya wanunuzi"),
        phrase(
          "Browse the requests shown and check product details before responding.",
          "Angalia requests zilizopo na details zake kabla ya kujibu.",
          "Angalia maombi yaliyoonyeshwa na ukague maelezo kabla ya kujibu."
        )
      ),
      makeStep(
        ["#supportForm", "#supportSection"],
        phrase("Get support", "Pata support", "Pata usaidizi"),
        phrase(
          "Use the support form if you need help with the demo.",
          "Ukipata shida, tumia support form ikiwa inapatikana.",
          "Ikiwa unahitaji msaada, tumia fomu ya usaidizi ikiwa ipo."
        )
      )
    ],

    "messages.html": [
      makeStep(
        [".messages-notice", ".page-hero", "main h1"],
        phrase("Welcome to Messages", "Karibu Messages", "Karibu kwenye Ujumbe"),
        phrase(
          "This page is designed to organise conversations supported by the demo.",
          "Hapa ndipo sehemu ya kuangalia conversations zinazoungwa mkono na demo.",
          "Ukurasa huu umeundwa kupanga mazungumzo yanayoungwa mkono na demo."
        )
      ),
      makeStep(
        [".conversation-sidebar", "#conversationList"],
        phrase("Choose a conversation", "Chagua conversation", "Chagua mazungumzo"),
        phrase(
          "Select an available conversation to review its contents.",
          "Chagua conversation iliyopo ili kuangalia messages zake.",
          "Chagua mazungumzo yaliyopo ili kuona ujumbe wake."
        )
      ),
      makeStep(
        [".conversation-panel", "#conversationPanel"],
        phrase("Review the conversation", "Angalia messages", "Angalia mazungumzo"),
        phrase(
          "Check the conversation details and the other participant's information before sharing personal details.",
          "Angalia messages na details kabla ya kushare personal information.",
          "Kagua ujumbe na maelezo kabla ya kushiriki taarifa binafsi."
        )
      ),
      makeStep(
        ["#messageForm", "#sendMessageForm"],
        phrase("Write a message", "Andika message", "Andika ujumbe"),
        phrase(
          "If messaging is enabled, write your message and use the available send button.",
          "Kama messaging iko active, andika message yako na utume.",
          "Ikiwa ujumbe unatumika, andika ujumbe wako kisha utume."
        )
      )
    ],

    "login.html": [
      makeStep(
        [".auth-visual", ".login-hero", "main h1"],
        phrase("Welcome to MavunoBridge", "Karibu MavunoBridge", "Karibu MavunoBridge"),
        phrase(
          "This page demonstrates the available sign-in experience.",
          "Hapa unaona login experience ya demo.",
          "Hapa unaweza kuona mfano wa kuingia kwenye akaunti."
        )
      ),
      makeStep(
        ["#demoLoginForm", "#loginForm", "form"],
        phrase("Explore the sign-in form", "Angalia login form", "Angalia fomu ya kuingia"),
        phrase(
          "Review the fields and follow the instructions displayed by your demo.",
          "Angalia fields na ufuate instructions zilizoonyeshwa.",
          "Kagua sehemu za fomu na ufuate maelekezo yaliyoonyeshwa."
        )
      ),
      makeStep(
        ["#googleDemoButton", "#googleSignInButton"],
        phrase("Demo sign-in options", "Login options", "Chaguo za kuingia"),
        phrase(
          "If a sign-in button is displayed, check its demo status before relying on it for a real account.",
          "Kama login button iko, kumbuka hii ni demo na inaweza isiwe connected na account halisi.",
          "Ikiwa kitufe cha kuingia kipo, kumbuka kuwa demo huenda isiwe imeunganishwa na akaunti halisi."
        )
      )
    ]
  };

  const FALLBACK_TOUR = [
    makeStep(
      ["header", ".topbar", ".navbar"],
      phrase("Welcome to MavunoBridge!", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
      phrase(
        "I'm your farming buddy. Let's explore this page together.",
        "Mimi ni farm buddy wako. Tuchunguze page hii pamoja!",
        "Mimi ni msaidizi wako wa kilimo. Tuchunguze ukurasa huu pamoja."
      )
    ),
    makeStep(
      ["main", "#app", "body"],
      phrase("Explore this page", "Explore page hii", "Chunguza ukurasa huu"),
      phrase(
        "Look through the available features. You can reopen this tour whenever you need help.",
        "Angalia features zilizopo. Unaweza kufungua tour hii tena ukihitaji help.",
        "Angalia vipengele vilivyopo. Unaweza kufungua mwongozo huu tena unapohitaji msaada."
      )
    )
  ];

  function getSteps() {
    return TOURS[PAGE] || FALLBACK_TOUR;
  }

  /* ============================================================
     5. STYLES
     ============================================================ */

  const style = document.createElement("style");

  style.id = "mavunobridge-tour-styles";

  style.textContent = `
    /* Keep the tour above ordinary page content */
    .mb-tour-layer,
    .mb-tour-launcher {
      font-family: inherit;
      box-sizing: border-box;
    }

    .mb-tour-layer *,
    .mb-tour-launcher * {
      box-sizing: border-box;
    }

    .mb-tour-layer[hidden],
    .mb-tour-launcher[hidden] {
      display: none !important;
    }

    /* Floating launch button */
    .mb-tour-launcher {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;
      max-width: calc(100vw - 28px);
      padding: 11px 17px;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 999px;
      background: linear-gradient(135deg,#285f3d,#173c29);
      color: #fff;
      box-shadow: 0 8px 25px rgba(20,55,34,.28);
      font-size: 13px;
      font-weight: 750;
      cursor: pointer;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .mb-tour-launcher:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(20,55,34,.34);
    }

    .mb-tour-launcher:focus-visible,
    .mb-tour-btn:focus-visible,
    .mb-tour-close:focus-visible {
      outline: 3px solid #e2b65d;
      outline-offset: 3px;
    }

    /* Main tour overlay */
    .mb-tour-layer {
      position: fixed;
      inset: 0;
      z-index: 2147483001;
      overflow: hidden;
      pointer-events: none;
    }

    /* Four separate shade panels create a spotlight */
    .mb-tour-shade {
      position: fixed;
      background: rgba(8,20,13,.60);
      pointer-events: auto;
      transition:
        top .22s ease,
        left .22s ease,
        width .22s ease,
        height .22s ease;
    }

    .mb-tour-focus {
      position: fixed;
      z-index: 1;
      border: 2px solid #a8d67c;
      box-shadow:
        0 0 0 4px rgba(168,214,124,.16),
        0 0 24px rgba(168,214,124,.28);
      pointer-events: none;
      transition: all .22s ease;
    }

    .mb-tour-focus[hidden] {
      display: none !important;
    }

    /* Translucent glass tutorial panel */
    .mb-tour-card {
      position: fixed;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: min(540px,calc(100vw - 32px));
      max-height: min(650px,calc(100dvh - 32px));
      overflow-y: auto;
      overscroll-behavior: contain;
      border: 1px solid rgba(255,255,255,.68);
      border-radius: 23px;
      background: rgba(249,252,246,.78);
      color: #1a3424;
      box-shadow: 0 20px 70px rgba(0,0,0,.25);
      -webkit-backdrop-filter: blur(15px) saturate(130%);
      backdrop-filter: blur(15px) saturate(130%);
      padding: 18px;
      pointer-events: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(45,94,57,.4) transparent;
      animation: mbTourCardEnter .28s ease-out;
    }

    @keyframes mbTourCardEnter {
      from {
        opacity: 0;
        transform: translate(-50%,-47%) scale(.97);
      }
      to {
        opacity: 1;
        transform: translate(-50%,-50%) scale(1);
      }
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      gap: 9px;
      min-width: 0;
      margin-bottom: 13px;
    }

    .mb-tour-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex: 1;
      font-size: 12px;
      font-weight: 800;
      color: #20482f;
    }

    .mb-tour-brand > span:last-child {
      overflow-wrap: anywhere;
    }

    .mb-tour-mark {
      width: 30px;
      height: 30px;
      flex: 0 0 30px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      color: white;
      background: linear-gradient(145deg,#4b8a50,#205435);
      font-size: 15px;
      font-weight: 900;
    }

    .mb-tour-count {
      flex: 0 0 auto;
      color: #45654c;
      font-size: 11px;
      font-weight: 750;
      white-space: nowrap;
    }

    .mb-tour-close {
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: 10px;
      background: rgba(32,72,47,.09);
      color: #24432e;
      font-size: 23px;
      cursor: pointer;
    }

    .mb-tour-progress {
      width: 100%;
      height: 5px;
      margin-bottom: 17px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(35,80,48,.13);
    }

    .mb-tour-progress span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg,#2d7143,#92c96a);
      transition: width .25s ease;
    }

    /* Avatar and text layout */
    .mb-tour-guide-row {
      display: grid;
      grid-template-columns: 100px minmax(0,1fr);
      align-items: center;
      gap: 17px;
      min-width: 0;
    }

    .mb-tour-farmer,
    .mb-guide-farmer {
      display: grid;
      place-items: center;
      min-width: 0;
      overflow: visible;
      isolation: isolate;
    }

    .mb-tour-farmer {
      width: 100px;
      height: 112px;
      justify-self: center;
      border-radius: 25px;
      background:
        radial-gradient(ellipse at 50% 80%,rgba(120,172,96,.22),transparent 65%);
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
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 7px;
      color: #44764b;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .09em;
    }

    .mb-tour-speaking::before {
      content: "";
      width: 6px;
      height: 6px;
      flex: 0 0 6px;
      border-radius: 50%;
      background: #5eab59;
      animation: mbTourPulse 1.7s ease-in-out infinite;
    }

    .mb-tour-card h2 {
      margin: 0 0 9px;
      color: #173d27;
      font-size: clamp(19px,3vw,25px);
      font-weight: 850;
      line-height: 1.18;
      overflow-wrap: anywhere;
    }

    .mb-tour-card p {
      margin: 0;
      color: #294633;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }

    /* Navigation controls */
    .mb-tour-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid rgba(40,81,48,.13);
    }

    .mb-tour-left,
    .mb-tour-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mb-tour-right {
      margin-left: auto;
    }

    .mb-tour-btn {
      min-height: 39px;
      padding: 9px 13px;
      border: 1px solid rgba(37,79,47,.18);
      border-radius: 11px;
      background: rgba(255,255,255,.68);
      color: #254630;
      font-family: inherit;
      font-size: 12px;
      font-weight: 750;
      line-height: 1.2;
      cursor: pointer;
      transition: background .15s ease, transform .15s ease;
    }

    .mb-tour-btn:hover:not(:disabled) {
      background: rgba(225,241,218,.9);
      transform: translateY(-1px);
    }

    .mb-tour-btn:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-tour-next {
      border-color: #235b37;
      background: #235b37;
      color: #fff;
    }

    .mb-tour-next:hover:not(:disabled) {
      background: #17452b;
    }

    /* ========================================================
       FARMER ANIMATIONS
       ======================================================== */

    .mb-tour-farmer,
    .mb-guide-farmer,
    .mb-smart-farmer-avatar {
      perspective: 600px;
    }

    .mb-tour-farmer .mb-farmer-art,
    .mb-guide-farmer .mb-farmer-art,
    .mb-smart-farmer-avatar .mb-farmer-art {
      transform-origin: center bottom;
      animation: mbFarmerFloat 3.2s ease-in-out infinite;
    }

    .mb-farmer-wave {
      transform-box: view-box;
      transform-origin: 83px 55px;
      animation: mbFarmerWave 3.5s ease-in-out infinite;
    }

    .mb-farmer-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: mbFarmerBlink 4.8s infinite;
    }

    .mb-farmer-can {
      transform-box: fill-box;
      transform-origin: top center;
      animation: mbFarmerCan 3.5s ease-in-out infinite;
    }

    .mb-farmer-tool {
      transform-box: fill-box;
      transform-origin: bottom center;
      animation: mbFarmerTool 4s ease-in-out infinite;
    }

    .mb-farmer-mouth {
      transform-box: fill-box;
      transform-origin: center;
    }

    .mb-farmer-hand {
      transform-box: fill-box;
      transform-origin: center;
    }

    @keyframes mbFarmerFloat {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(.7deg); }
    }

    @keyframes mbFarmerWave {
      0%,70%,100% { transform: rotate(0deg); }
      76% { transform: rotate(-9deg); }
      82% { transform: rotate(8deg); }
      88% { transform: rotate(-6deg); }
      94% { transform: rotate(3deg); }
    }

    @keyframes mbFarmerBlink {
      0%,43%,47%,87%,91%,100% { transform: scaleY(1); }
      45%,89% { transform: scaleY(.12); }
    }

    @keyframes mbFarmerCan {
      0%,100% { transform: rotate(0deg); }
      50% { transform: rotate(-3deg); }
    }

    @keyframes mbFarmerTool {
      0%,100% { transform: rotate(0deg); }
      50% { transform: rotate(2deg); }
    }

    @keyframes mbTourPulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: .45; transform: scale(.78); }
    }

    /* Random mood classes */
    .mb-farmer-mood-talk .mb-farmer-mouth {
      animation: mbFarmerTalk .25s ease-in-out infinite alternate;
    }

    .mb-farmer-mood-nod .mb-farmer-art {
      animation: mbFarmerNod .65s ease-in-out 2;
    }

    .mb-farmer-mood-curious .mb-farmer-art {
      animation: mbFarmerCurious .8s ease-in-out 1;
    }

    .mb-farmer-mood-celebrate .mb-farmer-art {
      animation: mbFarmerCelebrate .8s ease-in-out 2;
    }

    .mb-farmer-mood-wave .mb-farmer-wave {
      animation: mbFarmerWaveNow .85s ease-in-out 3;
    }

    .mb-farmer-mood-happy .mb-farmer-mouth {
      animation: mbFarmerSmile .45s ease-out 1;
    }

    @keyframes mbFarmerTalk {
      from { transform: scaleY(.75); }
      to { transform: scaleY(1.25); }
    }

    @keyframes mbFarmerNod {
      0%,100% { transform: rotate(0); }
      30% { transform: rotate(7deg); }
      65% { transform: rotate(-5deg); }
    }

    @keyframes mbFarmerCurious {
      0%,100% { transform: rotate(0); }
      40% { transform: rotate(-5deg) translateY(-2px); }
      70% { transform: rotate(3deg); }
    }

    @keyframes mbFarmerCelebrate {
      0%,100% { transform: translateY(0) rotate(0); }
      30% { transform: translateY(-8px) rotate(-5deg); }
      60% { transform: translateY(-2px) rotate(5deg); }
    }

    @keyframes mbFarmerWaveNow {
      0%,100% { transform: rotate(0); }
      25% { transform: rotate(-14deg); }
      50% { transform: rotate(12deg); }
      75% { transform: rotate(-9deg); }
    }

    @keyframes mbFarmerSmile {
      from { transform: scale(1); }
      to { transform: scale(1.13); }
    }

    /* ========================================================
       BUYER + FARMER GUIDE AVATAR
       ======================================================== */

    .mb-guide-panel .mb-guide-head {
      display: flex;
      align-items: center;
      gap: 10px !important;
      min-width: 0;
    }

    .mb-guide-farmer {
      flex: 0 0 48px;
      width: 48px;
      height: 48px;
      padding: 2px;
      border: 1px solid rgba(51,106,62,.16);
      border-radius: 14px;
      background: #e8f4e6;
    }

    .mb-guide-head .mb-guide-head-copy {
      flex: 1 1 auto;
      min-width: 0;
    }

    /* ========================================================
       SMART ASSIST AVATAR
       ======================================================== */

    .sa-assistant-avatar.mb-smart-farmer-avatar {
      display: grid;
      place-items: center;
      flex: 0 0 68px;
      width: 68px;
      height: 68px;
      padding: 2px;
      overflow: visible;
      border: 1px solid rgba(51,106,62,.17);
      border-radius: 18px;
      background: #e8f4e6;
    }

    .sa-assistant-avatar.mb-smart-farmer-avatar .mb-farmer-art {
      width: 100%;
      height: 100%;
    }

    .sa-assistant-intro .mb-smart-farmer-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0 0 5px;
      color: #397345;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .07em;
    }

    .mb-smart-farmer-status::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      flex: 0 0 6px;
      border-radius: 50%;
      background: #62ad5c;
    }

    /* ========================================================
       MOBILE LAYOUT
       ======================================================== */

    @media (max-width: 600px) {
      .mb-tour-launcher {
        right: 12px;
        bottom: max(12px,env(safe-area-inset-bottom));
        min-height: 42px;
        padding: 10px 13px;
        font-size: 12px;
      }

      .mb-tour-card {
        top: auto;
        bottom: max(8px,env(safe-area-inset-bottom));
        left: 8px;
        transform: none;
        width: calc(100vw - 16px);
        max-height: min(43dvh,390px);
        padding: 11px 12px 10px;
        border-radius: 17px;
        background: rgba(249,252,246,.76);
        -webkit-backdrop-filter: blur(11px) saturate(125%);
        backdrop-filter: blur(11px) saturate(125%);
        animation: mbTourMobileEnter .2s ease-out;
      }

      @keyframes mbTourMobileEnter {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mb-tour-top {
        gap: 6px;
        margin-bottom: 8px;
      }

      .mb-tour-mark {
        width: 25px;
        height: 25px;
        flex-basis: 25px;
        border-radius: 8px;
        font-size: 13px;
      }

      .mb-tour-brand {
        gap: 6px;
        font-size: 10px;
      }

      .mb-tour-count {
        font-size: 9px;
      }

      .mb-tour-close {
        flex-basis: 27px;
        width: 27px;
        height: 27px;
        font-size: 20px;
      }

      .mb-tour-progress {
        height: 4px;
        margin-bottom: 9px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 63px minmax(0,1fr);
        gap: 9px;
        align-items: center;
      }

      .mb-tour-farmer {
        width: 63px;
        height: 80px;
        border-radius: 13px;
      }

      .mb-tour-speaking {
        margin-bottom: 4px;
        font-size: 8px;
      }

      .mb-tour-card h2 {
        margin-bottom: 5px;
        font-size: clamp(15px,4.4vw,19px);
        line-height: 1.18;
      }

      .mb-tour-card p {
        font-size: 11px;
        line-height: 1.42;
      }

      .mb-tour-controls {
        gap: 5px;
        margin-top: 10px;
        padding-top: 8px;
      }

      .mb-tour-left,
      .mb-tour-right {
        gap: 5px;
      }

      .mb-tour-btn {
        min-height: 34px;
        padding: 7px 9px;
        border-radius: 9px;
        font-size: 10px;
      }

      .mb-guide-farmer {
        flex-basis: 39px;
        width: 39px;
        height: 39px;
        border-radius: 11px;
      }

      .sa-assistant-avatar.mb-smart-farmer-avatar {
        flex-basis: 56px;
        width: 56px;
        height: 56px;
        border-radius: 14px;
      }
    }

    @media (max-width: 360px) {
      .mb-tour-card {
        left: 5px;
        bottom: max(5px,env(safe-area-inset-bottom));
        width: calc(100vw - 10px);
        max-height: 46dvh;
        padding: 9px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 49px minmax(0,1fr);
        gap: 7px;
      }

      .mb-tour-farmer {
        width: 49px;
        height: 66px;
      }

      .mb-tour-card h2 {
        font-size: 15px;
      }

      .mb-tour-card p {
        font-size: 10px;
      }

      .mb-tour-btn {
        padding: 7px;
        font-size: 9px;
      }
    }

    /* Short landscape screens */
    @media (max-height: 500px) and (orientation: landscape) {
      .mb-tour-card {
        max-height: calc(100dvh - 12px);
        padding: 9px 13px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 57px minmax(0,1fr);
        gap: 10px;
      }

      .mb-tour-farmer {
        width: 57px;
        height: 66px;
      }

      .mb-tour-card p {
        font-size: 11px;
        line-height: 1.4;
      }

      .mb-tour-controls {
        margin-top: 8px;
        padding-top: 7px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb-tour-layer *,
      .mb-tour-launcher,
      .mb-tour-farmer *,
      .mb-guide-farmer *,
      .mb-smart-farmer-avatar *,
      .mb-tour-card {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
  `;

  if (!$("#mavunobridge-tour-styles")) {
    document.head.appendChild(style);
  }

  /* ============================================================
     6. ADD FARMER TO THE EXISTING GUIDE
     ============================================================ */

  function addGuideAvatar() {
    const header = $(".mb-guide-panel .mb-guide-head");

    if (!header || $(".mb-guide-farmer", header)) return;

    const children = Array.from(header.children);

    const headingGroup =
      children.find(child => child.tagName === "DIV") || null;

    const avatar = document.createElement("div");

    avatar.className = "mb-guide-farmer";
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", "Animated farmer guide");
    avatar.innerHTML = FARMER_SVG;

    if (headingGroup) {
      headingGroup.classList.add("mb-guide-head-copy");
      header.insertBefore(avatar, headingGroup);
    } else {
      header.prepend(avatar);
    }
  }

  /* ============================================================
     7. ADD FARMER TO SMART ASSIST
     ============================================================ */

  function addSmartAssistAvatar() {
    if (PAGE !== "smart-assist.html") return;

    const avatar = $(".sa-assistant-avatar");

    if (!avatar) return;

    // Avoid replacing the avatar repeatedly.
    if (!avatar.classList.contains("mb-smart-farmer-avatar")) {
      avatar.classList.add("mb-smart-farmer-avatar");
      avatar.setAttribute("role", "img");
      avatar.setAttribute(
        "aria-label",
        "Animated MavunoBridge farming assistant"
      );

      avatar.innerHTML = FARMER_SVG;
    }

    const intro = $(".sa-assistant-intro");

    if (!intro || $(".mb-smart-farmer-status", intro)) return;

    const status = document.createElement("span");

    status.className = "mb-smart-farmer-status";

    status.textContent =
      getLanguage() === "sw"
        ? "MSAIDIZI WA KILIMO"
        : getLanguage() === "en"
          ? "FARM ASSISTANT"
          : "FARM BUDDY · READY";

    const heading =
      $("#assistantWelcome", intro) ||
      $("h3", intro) ||
      $("h2", intro);

    if (heading && heading.parentNode) {
      heading.parentNode.insertBefore(status, heading);
    } else {
      intro.prepend(status);
    }
  }

  function setupAvatars() {
    addGuideAvatar();
    addSmartAssistAvatar();
  }

  /* ============================================================
     8. RANDOM FARMER EMOTES
     ============================================================ */

  const FARMER_MOODS = [
    "happy",
    "talk",
    "nod",
    "curious",
    "wave"
  ];

  let moodTimer = null;
  let lastMood = "";

  function getFarmerAvatars() {
    return $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar");
  }

  function setFarmerMood(mood) {
    const avatars = getFarmerAvatars();

    avatars.forEach(avatar => {
      avatar.classList.remove(
        "mb-farmer-mood-happy",
        "mb-farmer-mood-talk",
        "mb-farmer-mood-nod",
        "mb-farmer-mood-curious",
        "mb-farmer-mood-wave",
        "mb-farmer-mood-celebrate"
      );

      if (mood) {
        avatar.classList.add(`mb-farmer-mood-${mood}`);
      }
    });

    lastMood = mood || "";
  }

  function randomFarmerMood() {
    if (reducedMotion()) return;

    const choices = FARMER_MOODS.filter(mood => mood !== lastMood);

    if (!choices.length) return;

    const mood = choices[Math.floor(Math.random() * choices.length)];

    setFarmerMood(mood);
  }

  function startFarmerEmotes() {
    if (moodTimer || reducedMotion()) return;

    moodTimer = window.setInterval(() => {
      randomFarmerMood();
    }, 4800);
  }

  function stopFarmerEmotes() {
    if (moodTimer) {
      window.clearInterval(moodTimer);
      moodTimer = null;
    }

    setFarmerMood("");
  }

  /* ============================================================
     9. CREATE TOUR LAUNCH BUTTON
     ============================================================ */

  const launcher = document.createElement("button");

  launcher.type = "button";
  launcher.className = "mb-tour-launcher";
  launcher.textContent = "🧭 Website Tour";
  launcher.setAttribute("aria-label", "Open MavunoBridge website tour");
  launcher.setAttribute("title", "Open the website guide");

  document.body.appendChild(launcher);

  /* ============================================================
     10. CREATE TOUR INTERFACE
     ============================================================ */

  const layer = document.createElement("div");

  layer.className = "mb-tour-layer";
  layer.hidden = true;

  layer.innerHTML = `
    <div class="mb-tour-shade" data-shade="top"></div>
    <div class="mb-tour-shade" data-shade="left"></div>
    <div class="mb-tour-shade" data-shade="right"></div>
    <div class="mb-tour-shade" data-shade="bottom"></div>

    <div class="mb-tour-focus" hidden></div>

    <section
      class="mb-tour-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbTourTitle"
      aria-describedby="mbTourText"
      tabindex="-1"
    >
      <div class="mb-tour-top">
        <div class="mb-tour-brand">
          <span class="mb-tour-mark">M</span>
          <span>MavunoBridge · Tour</span>
        </div>

        <span class="mb-tour-count" id="mbTourCount"></span>

        <button
          type="button"
          class="mb-tour-close"
          id="mbTourClose"
          aria-label="Close tutorial"
          title="Close tutorial"
        >×</button>
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        <span id="mbTourProgress"></span>
      </div>

      <div class="mb-tour-guide-row">
        <div
          class="mb-tour-farmer"
          role="img"
          aria-label="Animated farmer assistant"
        >${FARMER_SVG}</div>

        <div class="mb-tour-guide-copy">
          <span class="mb-tour-speaking" id="mbTourSpeaking">
            YOUR FARMING GUIDE
          </span>

          <h2 id="mbTourTitle"></h2>

          <p id="mbTourText"></p>
        </div>
      </div>

      <div class="mb-tour-controls">
        <div class="mb-tour-left">
          <button
            type="button"
            class="mb-tour-btn"
            id="mbTourSkip"
          >Skip tutorial</button>
        </div>

        <div class="mb-tour-right">
          <button
            type="button"
            class="mb-tour-btn"
            id="mbTourBack"
          >Back</button>

          <button
            type="button"
            class="mb-tour-btn mb-tour-next"
            id="mbTourNext"
          >Next →</button>
        </div>
      </div>
    </section>
  `;

  document.body.appendChild(layer);

  const inTour = selector => $(selector, layer);

  const shades = Object.fromEntries(
    $$(".mb-tour-shade", layer).map(node => [
      node.dataset.shade,
      node
    ])
  );

  const focusRing = inTour(".mb-tour-focus");

  let steps = getSteps();
  let index = 0;
  let tourOpen = false;
  let lastFocused = null;
  let animationFrame = 0;
  let repositionTimer = null;

  /* ============================================================
     11. TARGET SELECTION
     ============================================================ */

  function getTarget(selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];

    for (const selector of list) {
      if (!selector) continue;

      try {
        const target = $(selector);

        if (target && target.getClientRects().length) {
          return target;
        }
      } catch (error) {
        console.warn("MavunoBridge tour: invalid selector.", selector);
      }
    }

    return null;
  }

  /* ============================================================
     12. SPOTLIGHT POSITIONING
     ============================================================ */

  function setShade(name, left, top, width, height) {
    const node = shades[name];

    if (!node) return;

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

    const padding = 7;

    const left = Math.max(4, rect.left - padding);
    const top = Math.max(4, rect.top - padding);
    const right = Math.min(vw - 4, rect.right + padding);
    const bottom = Math.min(vh - 4, rect.bottom + padding);

    setShade("top", 0, 0, vw, top);
    setShade("left", 0, top, left, bottom - top);
    setShade("right", right, top, vw - right, bottom - top);
    setShade("bottom", 0, bottom, vw, vh - bottom);

    focusRing.hidden = false;
    focusRing.style.left = `${left}px`;
    focusRing.style.top = `${top}px`;
    focusRing.style.width = `${right - left}px`;
    focusRing.style.height = `${bottom - top}px`;

    const radius = window.getComputedStyle(target).borderRadius;

    focusRing.style.borderRadius = radius || "10px";
  }

  function scheduleReposition() {
    if (!tourOpen || animationFrame) return;

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = 0;
      positionSpotlight(getTarget(steps[index]?.target));
    });
  }

  /* ============================================================
     13. BUTTON LABELS
     ============================================================ */

  function labels() {
    const lang = getLanguage();

    if (lang === "sw") {
      return {
        step: "Hatua",
        skip: "Ruka mwongozo",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        speaking: "MSAIDIZI WAKO WA KILIMO"
      };
    }

    if (lang === "en") {
      return {
        step: "Step",
        skip: "Skip tutorial",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        speaking: "YOUR FARMING GUIDE"
      };
    }

    return {
      step: "Step",
      skip: "Skip tour",
      back: "Back",
      next: "Next →",
      finish: "Done ✓",
      speaking: "FARM BUDDY WAKO"
    };
  }

  /* ============================================================
     14. RENDER CURRENT TOUR STEP
     ============================================================ */

  function renderStep(shouldScroll = true) {
    if (!steps.length) return;

    index = Math.max(0, Math.min(index, steps.length - 1));

    const current = steps[index];
    const words = labels();
    const target = getTarget(current.target);

    inTour("#mbTourTitle").textContent = translate(current.title);
    inTour("#mbTourText").textContent = translate(current.description);

    inTour("#mbTourCount").textContent =
      `${words.step} ${index + 1} / ${steps.length}`;

    inTour("#mbTourProgress").style.width =
      `${((index + 1) / steps.length) * 100}%`;

    inTour("#mbTourSkip").textContent = words.skip;
    inTour("#mbTourBack").textContent = words.back;
    inTour("#mbTourBack").disabled = index === 0;

    inTour("#mbTourNext").textContent =
      index === steps.length - 1 ? words.finish : words.next;

    inTour("#mbTourSpeaking").textContent = words.speaking;

    if (shouldScroll && target) {
      target.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    setFarmerMood(index === steps.length - 1 ? "celebrate" : "talk");

    if (repositionTimer) {
      window.clearTimeout(repositionTimer);
    }

    repositionTimer = window.setTimeout(() => {
      if (tourOpen) {
        positionSpotlight(getTarget(steps[index]?.target));
      }
    }, shouldScroll && target ? 350 : 0);
  }

  /* ============================================================
     15. TOUR COMPLETION STORAGE
     ============================================================ */

  function completed() {
    try {
      return (
        localStorage.getItem(`${STORAGE_KEY}:${PAGE}`) === "1" ||
        localStorage.getItem(`${PREVIOUS_STORAGE_KEY}:${PAGE}`) === "1"
      );
    } catch (error) {
      return false;
    }
  }

  function markCompleted() {
    try {
      localStorage.setItem(`${STORAGE_KEY}:${PAGE}`, "1");
    } catch (error) {
      // The tour remains usable when storage is unavailable.
    }
  }

  /* ============================================================
     16. OPEN TOUR
     ============================================================ */

  function openTour() {
    if (tourOpen) return;

    lastFocused = document.activeElement;
    steps = getSteps();
    index = 0;
    tourOpen = true;

    layer.hidden = false;
    launcher.hidden = true;

    renderStep(true);
    startFarmerEmotes();

    window.addEventListener("resize", scheduleReposition);
    window.addEventListener("scroll", scheduleReposition, true);

    inTour(".mb-tour-card").focus({ preventScroll: true });
  }

  /* ============================================================
     17. CLOSE TOUR
     ============================================================ */

  function closeTour() {
    if (!tourOpen) return;

    const wasFinished = index === steps.length - 1;

    layer.hidden = true;
    launcher.hidden = false;
    tourOpen = false;

    markCompleted();

    window.removeEventListener("resize", scheduleReposition);
    window.removeEventListener("scroll", scheduleReposition, true);

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    if (repositionTimer) {
      window.clearTimeout(repositionTimer);
      repositionTimer = null;
    }

    if (wasFinished) {
      setFarmerMood("celebrate");
    } else {
      setFarmerMood("");
    }

    if (lastFocused && typeof lastFocused.focus === "function") {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch (error) {
        // Ignore focus restoration failures.
      }
    }
  }

  /* ============================================================
     18. BUTTON EVENTS
     ============================================================ */

  launcher.addEventListener("click", openTour);

  inTour("#mbTourClose").addEventListener("click", closeTour);
  inTour("#mbTourSkip").addEventListener("click", closeTour);

  inTour("#mbTourBack").addEventListener("click", () => {
    if (index > 0) {
      index -= 1;
      renderStep(true);
    }
  });

  inTour("#mbTourNext").addEventListener("click", () => {
    if (index < steps.length - 1) {
      index += 1;
      renderStep(true);
    } else {
      closeTour();
    }
  });

  /* Clicking the shade does not accidentally skip the tutorial. */

  /* ============================================================
     19. KEYBOARD SUPPORT
     ============================================================ */

  document.addEventListener("keydown", event => {
    if (!tourOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour();
      return;
    }

    if (event.key === "ArrowRight" && index < steps.length - 1) {
      event.preventDefault();
      index += 1;
      renderStep(true);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      index -= 1;
      renderStep(true);
    }
  });

  /* ============================================================
     20. LANGUAGE CHANGE SUPPORT
     ============================================================ */

  $("#languageSelect")?.addEventListener("change", () => {
    setupAvatars();

    const status = $(".mb-smart-farmer-status");

    if (status) {
      const lang = getLanguage();

      status.textContent =
        lang === "sw"
          ? "MSAIDIZI WA KILIMO"
          : lang === "en"
            ? "FARM ASSISTANT"
            : "FARM BUDDY · READY";
    }

    if (tourOpen) {
      renderStep(false);
    }
  });

  /* ============================================================
     21. AUTOMATIC FIRST-VISIT TOUR
     ============================================================ */

  function startIfNewVisitor() {
    if (completed()) return;

    window.setTimeout(() => {
      if (!tourOpen && !document.hidden) {
        openTour();
      }
    }, 900);
  }

  /* ============================================================
     22. HANDLE EXISTING GUIDE CONTENT LOADED LATER
     ============================================================ */

  let guideObserver = null;
  let guideObserverTimer = null;

  function observeGuide() {
    setupAvatars();

    if (guideObserver) return;

    guideObserver = new MutationObserver(() => {
      addGuideAvatar();
    });

    guideObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    guideObserverTimer = window.setTimeout(() => {
      if (guideObserver) {
        guideObserver.disconnect();
        guideObserver = null;
      }
    }, 8000);
  }

  /* ============================================================
     23. START EVERYTHING
     ============================================================ */

  function initialize() {
    setupAvatars();
    observeGuide();
    startFarmerEmotes();
    startIfNewVisitor();

    console.info("MavunoBridge tour and farmer assistant are ready.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    initialize();
  }

})();
