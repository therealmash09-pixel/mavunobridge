/* ============================================================
   MAVUNOBRIDGE — WEBSITE TOUR + FARMER ASSISTANT
   Complete replacement: website-tour.js

   Features:
   - Skippable first-visit tutorial
   - Back, Next, Skip and Finish controls
   - Responsive spotlight tour
   - Detailed 3D-look farmer figurine made with SVG/CSS
   - Farmer assistant in the tour, Guide and Smart Assist
   - Random farmer moods and animations
   - English, Sheng + English, and Kiswahili
   - Compact mobile launcher to reduce button overlap
   - Translucent tour card
   - Keyboard support and reduced-motion support
   - No external libraries or image files required
   ============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_TOUR_V4__) return;
  window.__MAVUNOBRIDGE_TOUR_V4__ = true;

  const PAGE = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE_KEY = "mavunobridge_tour_completed_v4";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const makeStep = (target, title, description) => ({
    target,
    title,
    description
  });

  /* ============================================================
     1. LANGUAGE
     ============================================================ */

  function language() {
    const selected = $("#languageSelect")?.value;

    if (["en", "mix", "sw"].includes(selected)) {
      return selected;
    }

    try {
      const saved =
        localStorage.getItem("mavunobridge_language_v1") ||
        localStorage.getItem("mavunobridge_language_v2");

      if (["en", "mix", "sw"].includes(saved)) return saved;
    } catch {}

    return "mix";
  }

  function t(en, mix, sw) {
    return { en, mix, sw };
  }

  function translate(value) {
    if (typeof value === "string") return value;
    return value?.[language()] || value?.mix || value?.en || "";
  }

  /* ============================================================
     2. DETAILED FARMER FIGURINE
     Inspired by your reference: green hat, overalls and tools.
     This is an illustrated 3D-look character, not a 3D mesh.
     ============================================================ */

  const FARMER_SVG = `
  <svg class="mb-farmer-art"
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 160 190"
       role="presentation"
       focusable="false">

    <defs>
      <linearGradient id="mbHat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#79a84c"/>
        <stop offset=".45" stop-color="#356d32"/>
        <stop offset="1" stop-color="#173f27"/>
      </linearGradient>

      <linearGradient id="mbSkin" x1="0" y1="0" x2="1" y2=".4">
        <stop offset="0" stop-color="#f2a05e"/>
        <stop offset=".48" stop-color="#d9783e"/>
        <stop offset="1" stop-color="#a94c29"/>
      </linearGradient>

      <linearGradient id="mbOveralls" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#287b4b"/>
        <stop offset=".55" stop-color="#145537"/>
        <stop offset="1" stop-color="#0c3628"/>
      </linearGradient>

      <linearGradient id="mbBoots" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#554437"/>
        <stop offset="1" stop-color="#201c18"/>
      </linearGradient>

      <linearGradient id="mbTool" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b97537"/>
        <stop offset=".5" stop-color="#efbb6a"/>
        <stop offset="1" stop-color="#8b4b27"/>
      </linearGradient>

      <radialGradient id="mbCheek">
        <stop offset="0" stop-color="#f7a06e" stop-opacity=".9"/>
        <stop offset="1" stop-color="#f7a06e" stop-opacity="0"/>
      </radialGradient>

      <filter id="mbShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="4" stdDeviation="3"
          flood-color="#193522" flood-opacity=".25"/>
      </filter>
    </defs>

    <!-- Soft backdrop -->
    <ellipse cx="82" cy="177" rx="43" ry="7"
      fill="#163d2b" opacity=".15"/>

    <!-- Garden fork handle -->
    <g class="mb-farmer-tool">
      <path d="M29 62 L24 130"
        stroke="#5d351e" stroke-width="8" stroke-linecap="round"/>
      <path d="M29 62 L24 130"
        stroke="url(#mbTool)" stroke-width="5" stroke-linecap="round"/>

      <path d="M20 63 L20 43 Q20 38 24 38
        Q28 38 28 43 L28 53 L36 53 L36 43
        Q36 38 40 38 Q44 38 44 43 L44 61
        Q44 67 38 67 L26 67"
        fill="none" stroke="#49382b" stroke-width="5"
        stroke-linecap="round" stroke-linejoin="round"/>

      <path d="M20 62 L20 43 Q20 38 24 38
        Q28 38 28 43 L28 53 L36 53 L36 43
        Q36 38 40 38 Q44 38 44 43 L44 61"
        fill="none" stroke="#8b7258" stroke-width="2"
        stroke-linecap="round"/>
    </g>

    <!-- Legs -->
    <path d="M57 127 L56 158 Q56 164 62 165
      L74 165 Q78 164 78 159 L80 130Z"
      fill="url(#mbOveralls)"/>

    <path d="M84 128 L86 158 Q87 164 92 165
      L104 165 Q110 164 109 158 L105 127Z"
      fill="#124a32"/>

    <!-- Boots -->
    <g filter="url(#mbShadow)">
      <path d="M57 151 L76 151 L78 164
        Q88 170 82 178 L49 178
        Q43 176 47 168Z"
        fill="url(#mbBoots)"/>

      <path d="M86 151 L105 151 L111 165
        Q120 171 114 178 L84 178
        Q79 176 83 168Z"
        fill="url(#mbBoots)"/>

      <path d="M48 173 Q64 177 81 173"
        fill="none" stroke="#8a7560" stroke-width="2"/>

      <path d="M84 173 Q100 177 114 173"
        fill="none" stroke="#8a7560" stroke-width="2"/>
    </g>

    <!-- Shirt -->
    <path d="M54 75 Q66 68 80 72
      Q96 68 107 80 L116 116
      Q104 127 82 126 Q58 127 45 117Z"
      fill="#78412d"/>

    <path d="M77 75 L83 86 L89 75"
      fill="#f4c18a" opacity=".9"/>

    <!-- Arms -->
    <path d="M52 83 Q44 89 42 104
      L39 119 Q38 125 44 127
      Q50 128 52 121 L61 98Z"
      fill="url(#mbSkin)"/>

    <g class="mb-farmer-wave">
      <path d="M105 84 Q112 91 114 106
        L119 121 Q121 127 115 130
        Q109 132 106 125 L98 101Z"
        fill="url(#mbSkin)"/>

      <path d="M112 120 Q118 114 123 120
        L129 131 Q132 138 126 142
        Q121 145 117 138 L111 129Z"
        fill="url(#mbSkin)"/>
    </g>

    <!-- Overalls body -->
    <path d="M48 94 Q58 88 68 90
      L95 90 Q105 89 111 96
      L108 132 Q105 139 97 139
      L61 139 Q51 138 49 131Z"
      fill="url(#mbOveralls)" filter="url(#mbShadow)"/>

    <!-- Bib -->
    <path d="M60 81 L99 81 L103 111
      Q101 117 95 117 L65 117
      Q59 116 58 110Z"
      fill="#206a41"/>

    <!-- Shoulder straps -->
    <path d="M58 82 L64 104"
      stroke="#319057" stroke-width="8" stroke-linecap="round"/>

    <path d="M97 82 L94 104"
      stroke="#319057" stroke-width="8" stroke-linecap="round"/>

    <rect x="56" y="82" width="10" height="8" rx="2"
      fill="#e5b44e"/>

    <rect x="91" y="82" width="10" height="8" rx="2"
      fill="#e5b44e"/>

    <!-- Overall pocket -->
    <path d="M69 100 L91 100 L91 112
      Q80 117 69 112Z"
      fill="#155235" stroke="#3e9560" stroke-width="1.5"/>

    <!-- Neck -->
    <path d="M69 62 L69 78 Q79 86 91 78 L90 61Z"
      fill="url(#mbSkin)"/>

    <!-- Head -->
    <g class="mb-farmer-head" filter="url(#mbShadow)">
      <path d="M56 37 Q59 19 81 19
        Q105 19 107 42 L103 61
        Q98 78 81 79 Q63 78 57 61Z"
        fill="url(#mbSkin)"/>

      <!-- Ear -->
      <ellipse cx="55" cy="52" rx="7" ry="10"
        fill="#d87943"/>

      <ellipse cx="105" cy="52" rx="7" ry="10"
        fill="#c76536"/>

      <!-- Cheeks -->
      <ellipse cx="64" cy="58" rx="9" ry="5"
        fill="url(#mbCheek)"/>

      <ellipse cx="95" cy="58" rx="9" ry="5"
        fill="url(#mbCheek)"/>

      <!-- Hair -->
      <path d="M58 39 Q57 25 73 22
        Q95 18 104 35 L100 41
        Q84 32 65 40Z"
        fill="#38271f"/>

      <!-- Eyebrows -->
      <path d="M65 42 Q71 38 76 42"
        fill="none" stroke="#3b271d" stroke-width="3"
        stroke-linecap="round"/>

      <path d="M86 42 Q92 38 97 42"
        fill="none" stroke="#3b271d" stroke-width="3"
        stroke-linecap="round"/>

      <!-- Eyes -->
      <g class="mb-farmer-eyes">
        <ellipse cx="71" cy="48" rx="3.5" ry="4.5"
          fill="#211d18"/>
        <ellipse cx="91" cy="48" rx="3.5" ry="4.5"
          fill="#211d18"/>

        <circle cx="72" cy="46.5" r="1.2" fill="#fff"/>
        <circle cx="92" cy="46.5" r="1.2" fill="#fff"/>
      </g>

      <!-- Nose -->
      <ellipse cx="81" cy="55" rx="5" ry="5.5"
        fill="#bd5e35"/>

      <ellipse cx="79" cy="53" rx="2" ry="1.5"
        fill="#f5b37b" opacity=".8"/>

      <!-- Smile -->
      <path d="M71 63 Q81 72 92 62"
        fill="none" stroke="#612d22" stroke-width="3"
        stroke-linecap="round"/>

      <path d="M74 64 Q81 68 89 64"
        fill="none" stroke="#fff0d5" stroke-width="1.5"
        stroke-linecap="round"/>
    </g>

    <!-- Big green gardener hat -->
    <g class="mb-farmer-hat" filter="url(#mbShadow)">
      <path d="M51 35 Q54 8 80 8
        Q107 8 111 35 L104 43
        Q80 35 57 43Z"
        fill="url(#mbHat)"/>

      <ellipse cx="81" cy="37" rx="39" ry="10"
        fill="#204f2b"/>

      <ellipse cx="81" cy="34" rx="38" ry="8"
        fill="#356b32"/>

      <path d="M59 31 Q63 13 80 13
        Q98 13 103 31"
        fill="none" stroke="#a5ca78" stroke-width="2"
        opacity=".7"/>

      <path d="M72 17 Q81 12 90 18"
        fill="none" stroke="#c3df91" stroke-width="2"
        stroke-linecap="round"/>
    </g>

    <!-- Small watering can -->
    <g class="mb-farmer-can">
      <path d="M121 143 L144 143 L141 165
        Q140 169 136 169 L127 169
        Q123 168 123 164Z"
        fill="#38784b" stroke="#205638" stroke-width="2"/>

      <path d="M125 144 Q121 133 132 132
        Q144 131 141 144"
        fill="none" stroke="#285b3b" stroke-width="4"/>

      <path d="M141 148 L150 145 L151 150 L143 154"
        fill="#4d8d58"/>

      <path d="M127 150 L139 150"
        stroke="#8bbf78" stroke-width="2" opacity=".8"/>
    </g>

    <!-- Tiny leaf details -->
    <path d="M43 151 Q33 143 36 135
      Q47 137 43 151Z"
      fill="#76ae50"/>

    <path d="M43 151 Q46 140 52 138"
      fill="none" stroke="#3b7c3d" stroke-width="2"/>

  </svg>`;

  /* ============================================================
     3. TOUR CONTENT
     ============================================================ */

  const TOURS = {
    "index.html": [
      makeStep(
        [".topbar", "header", "nav"],
        t("Welcome to MavunoBridge", "Karibu MavunoBridge 🌱", "Karibu MavunoBridge"),
        t(
          "Your marketplace connects farmers, buyers and agricultural services in one place.",
          "Hapa ni soko ya farmers na buyers — kila kitu in one place.",
          "Hapa ndipo wakulima na wanunuzi hukutana kupata bidhaa na huduma za kilimo."
        )
      ),
      makeStep(
        ["#categoryGrid .category-card", "#categories", ".category-grid"],
        t("Explore categories", "Chagua category yako", "Chagua aina ya bidhaa"),
        t(
          "Choose a category to explore fruits, vegetables, grains, legumes, livestock and more.",
          "Chagua category uone fruits, veggies, grains, livestock na zingine.",
          "Chagua kundi la bidhaa unalotaka kutafuta."
        )
      ),
      makeStep(
        [".filters", "#filterForm", ".marketplace-filters"],
        t("Find what you need", "Tafuta unachotaka", "Tafuta bidhaa unayohitaji"),
        t(
          "Use search, location and sorting options to narrow down listings.",
          "Tumia search na location kupata bidhaa haraka.",
          "Tumia utafutaji na eneo kupata bidhaa kwa urahisi."
        )
      ),
      makeStep(
        ["#listingGrid .product-card", "#listingGrid", ".listing-grid"],
        t("Browse farm products", "Angalia bidhaa za shamba", "Tazama bidhaa za shambani"),
        t(
          "Compare prices, product details and seller information before choosing.",
          "Compare bei na details kabla ya kuamua kununua.",
          "Linganisha bei na maelezo ya bidhaa kabla ya kuchagua."
        )
      ),
      makeStep(
        ["#sellButton", "#heroSellButton", '[data-action="sell"]'],
        t("List your products", "Uza bidhaa zako", "Weka bidhaa zako sokoni"),
        t(
          "Farmers can add a product, quantity, county, price and product photo.",
          "Wewe ni farmer? Add bidhaa, quantity, county, bei na picha.",
          "Wakulima wanaweza kuweka bidhaa, kiasi, eneo, bei na picha."
        )
      ),
      makeStep(
        ["#cartButton", "#cart", '[data-action="cart"]'],
        t("Your shopping cart", "Shopping cart yako", "Kikapu chako cha manunuzi"),
        t(
          "Use the cart to keep track of the products you want to buy.",
          "Weka bidhaa kwa cart ili uzipate kwa urahisi.",
          "Tumia kikapu kufuatilia bidhaa unazotaka kununua."
        )
      ),
      makeStep(
        ['a[href="smart-assist.html"]', '[href*="smart-assist"]'],
        t("Meet Smart Assist", "Kutana na Smart Assist", "Tumia Smart Assist"),
        t(
          "Open Smart Assist for farming guidance, crop ideas and plant problem help.",
          "Smart Assist inaweza kukusaidia na crop ideas na matatizo ya mimea.",
          "Smart Assist hutoa mwongozo wa kilimo na usaidizi wa matatizo ya mimea."
        )
      ),
      makeStep(
        ['a[href="sacco.html"]', '[href*="sacco.html"]'],
        t("Discover SACCO Hub", "Angalia SACCO Hub", "Gundua SACCO Hub"),
        t(
          "Explore SACCO information and opportunities available in the demo.",
          "Angalia SACCOs na opportunities zilizowekwa kwa demo.",
          "Chunguza taarifa za SACCO na fursa zilizopo kwenye demo."
        )
      ),
      makeStep(
        ['a[href="buyer-requests.html"]', '[href*="buyer-requests"]'],
        t("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        t(
          "Check buyer requests or create a request for a product you need.",
          "Angalia buyer requests au weka request ya bidhaa unahitaji.",
          "Tazama maombi ya wanunuzi au weka ombi la bidhaa unayohitaji."
        )
      ),
      makeStep(
        ['a[href="messages.html"]', '[href*="messages.html"]'],
        t("Messages and support", "Messages na support", "Ujumbe na usaidizi"),
        t(
          "Use the messaging area if it is enabled in your demo build.",
          "Tumia messages kuwasiliana kama feature imewashwa kwa demo yako.",
          "Tumia sehemu ya ujumbe ikiwa imewashwa kwenye toleo lako la demo."
        )
      ),
      makeStep(
        [".demo-note", "#demoNotice", ".demo-banner"],
        t("Remember: this is a demo", "Kumbuka: hii ni demo", "Kumbuka: hili ni toleo la majaribio"),
        t(
          "Some actions use demo data stored in your browser. Refreshing or changing browsers may affect it.",
          "Baadhi ya data ni demo na huhifadhiwa kwa browser yako.",
          "Baadhi ya taarifa ni za majaribio na huhifadhiwa kwenye kivinjari chako."
        )
      )
    ],

    "smart-assist.html": [
      makeStep(
        [".sa-hero", ".sa-assistant-intro", "main"],
        t("Meet your Farm Buddy", "Huyu ni Farm Buddy wako", "Huyu ni msaidizi wako wa kilimo"),
        t(
          "Use this assistant to explore farming questions and guidance.",
          "Uliza maswali ya kilimo na upate mwongozo.",
          "Tumia msaidizi huyu kuuliza maswali kuhusu kilimo."
        )
      ),
      makeStep(
        ["#farmPlanner", ".farm-planner"],
        t("Plan your farm", "Panga shamba lako", "Panga shughuli za shamba"),
        t(
          "Explore the available planning fields to organise your farming ideas.",
          "Tumia sehemu hii kupanga ideas za shamba lako.",
          "Tumia sehemu hii kupanga shughuli zako za kilimo."
        )
      ),
      makeStep(
        [".sa-symptom-field", "#saSymptomChecks", "#symptomChecks"],
        t("Describe plant problems", "Eleza shida ya mmea", "Eleza tatizo la mmea"),
        t(
          "Choose the symptoms you have noticed to help organise the information.",
          "Chagua symptoms umeona kwa mmea wako.",
          "Chagua dalili ulizoona kwenye mmea."
        )
      ),
      makeStep(
        ["#saPhoto", 'input[type="file"]'],
        t("Add a plant photo", "Weka picha ya mmea", "Weka picha ya mmea"),
        t(
          "If photo upload is available, add a clear image of the affected plant.",
          "Kama photo upload inafanya kazi, weka picha iliyo clear.",
          "Ikiwa kupakia picha kunapatikana, weka picha iliyo wazi."
        )
      ),
      makeStep(
        ["#generateReportButton", "#reportSection"],
        t("Create a report", "Tengeneza report", "Tengeneza ripoti"),
        t(
          "Use the report feature to organise your observations. Demo guidance is not a guaranteed diagnosis.",
          "Tengeneza report ya observations zako. Ushauri wa demo si diagnosis ya uhakika.",
          "Tengeneza ripoti ya ulichokiona. Ushauri wa majaribio si utambuzi wa uhakika."
        )
      ),
      makeStep(
        ["#saQuestionForm", "#assistantQuestionForm"],
        t("Ask a farming question", "Uliza swali la kilimo", "Uliza swali la kilimo"),
        t(
          "Type a question about crops, soil or everyday farm planning.",
          "Andika swali kuhusu crops, soil au kupanga shughuli za shamba.",
          "Andika swali kuhusu mimea, udongo au mipango ya shamba."
        )
      ),
      makeStep(
        [".sa-library-controls", "#saCropLibraryGrid"],
        t("Explore the crop library", "Angalia crop library", "Chunguza maktaba ya mazao"),
        t(
          "Browse the available crop information and useful farming notes.",
          "Angalia crop information na tips zilizopo.",
          "Chunguza taarifa za mazao na maelezo ya kilimo."
        )
      ),
      makeStep(
        ["#savedReportsSection", "#savedReports"],
        t("Find saved reports", "Pata reports zilizohifadhiwa", "Pata ripoti zilizohifadhiwa"),
        t(
          "If saving is enabled, revisit reports you created earlier.",
          "Kama saving imewashwa, unaweza kurudi kwa reports zako.",
          "Ikiwa kuhifadhi kumewashwa, unaweza kuona ripoti zako tena."
        )
      )
    ],

    "sacco.html": [
      makeStep(
        [".page-hero", "main"],
        t("Welcome to SACCO Hub", "Karibu SACCO Hub", "Karibu SACCO Hub"),
        t(
          "Explore agricultural finance information and opportunities listed in the demo.",
          "Angalia taarifa za finance na opportunities za kilimo.",
          "Chunguza taarifa za fedha na fursa za kilimo."
        )
      ),
      makeStep(
        [".sacco-controls", "#saccoFilters"],
        t("Find relevant options", "Tafuta options zinazokufaa", "Tafuta fursa zinazokufaa"),
        t(
          "Use the available controls to narrow down your choices.",
          "Tumia filters kupata options zinazokufaa.",
          "Tumia vichujio kutafuta chaguo zinazokufaa."
        )
      ),
      makeStep(
        ["#saccoGrid .sacco-card", "#saccoGrid"],
        t("Explore SACCO cards", "Angalia SACCO cards", "Tazama taarifa za SACCO"),
        t(
          "Read the information carefully and verify details with the organisation.",
          "Soma details na uthibitishe taarifa na organisation husika.",
          "Soma taarifa na uzithibitishe na shirika husika."
        )
      ),
      makeStep(
        [".interest-panel", "#interestForm"],
        t("Show your interest", "Onyesha interest yako", "Onyesha nia yako"),
        t(
          "Use the interest form if it is available in your version of the demo.",
          "Tumia interest form kama inapatikana kwa demo yako.",
          "Tumia fomu ya kuonyesha nia ikiwa inapatikana."
        )
      )
    ],

    "buyer-requests.html": [
      makeStep(
        [".page-hero", "main"],
        t("Buyer requests", "Buyer requests", "Maombi ya wanunuzi"),
        t(
          "This page helps buyers describe the products they are looking for.",
          "Hapa buyers wanaweza kueleza bidhaa wanatafuta.",
          "Hapa wanunuzi wanaweza kueleza bidhaa wanazotafuta."
        )
      ),
      makeStep(
        ["#demandForm", "form"],
        t("Create a request", "Weka request", "Weka ombi"),
        t(
          "Enter the product and relevant details in the request form.",
          "Weka bidhaa na details zinazohitajika kwa form.",
          "Jaza bidhaa na maelezo yanayohitajika kwenye fomu."
        )
      ),
      makeStep(
        ["#demandList", ".demand-list"],
        t("Browse requests", "Angalia requests", "Tazama maombi"),
        t(
          "Review existing requests to see what buyers need.",
          "Angalia requests zingine kuona buyers wanahitaji nini.",
          "Angalia maombi yaliyopo kuona mahitaji ya wanunuzi."
        )
      ),
      makeStep(
        ["#supportForm", ".support-form"],
        t("Get support", "Pata support", "Pata usaidizi"),
        t(
          "Use the support area if you need help with the demo.",
          "Tumia support kama unahitaji msaada kwa demo.",
          "Tumia sehemu ya usaidizi ikiwa unahitaji msaada."
        )
      )
    ],

    "messages.html": [
      makeStep(
        [".messages-notice", "main"],
        t("Messages", "Messages", "Ujumbe"),
        t(
          "This area is intended for marketplace conversations when messaging is enabled.",
          "Hapa ni kwa conversations za marketplace ikiwa messages zimewashwa.",
          "Sehemu hii ni ya mazungumzo ya soko ikiwa ujumbe umewezeshwa."
        )
      ),
      makeStep(
        [".conversation-sidebar", "#conversationList"],
        t("Choose a conversation", "Chagua conversation", "Chagua mazungumzo"),
        t(
          "Select a conversation from the list if demo conversations are available.",
          "Chagua conversation kama demo messages zipo.",
          "Chagua mazungumzo ikiwa yanapatikana kwenye demo."
        )
      ),
      makeStep(
        [".conversation-panel", "#conversationPanel"],
        t("Read the conversation", "Soma conversation", "Soma mazungumzo"),
        t(
          "Review the displayed messages and check who you are communicating with.",
          "Soma messages na hakikisha unajua unawasiliana na nani.",
          "Soma ujumbe na uhakikishe unajua unayewasiliana naye."
        )
      ),
      makeStep(
        ["#messageForm", "form"],
        t("Write a message", "Andika message", "Andika ujumbe"),
        t(
          "Use the message form if sending messages is enabled in this demo.",
          "Tumia form kama kutuma messages kumewashwa.",
          "Tumia fomu ikiwa kutuma ujumbe kumewezeshwa."
        )
      )
    ],

    "login.html": [
      makeStep(
        [".auth-visual", "main"],
        t("Welcome to MavunoBridge", "Karibu MavunoBridge", "Karibu MavunoBridge"),
        t(
          "This page introduces the demo sign-in experience.",
          "Hapa ndipo unaanza kwa demo login.",
          "Ukurasa huu unaonyesha jinsi kuingia kwenye demo kunavyofanya kazi."
        )
      ),
      makeStep(
        ["#demoLoginForm", "form"],
        t("Demo sign-in", "Demo login", "Kuingia kwenye demo"),
        t(
          "Use only the demo options provided on the page. Do not enter a real password unless the site is properly secured.",
          "Tumia options za demo pekee. Usiweke password yako halisi kama site haijalindwa vizuri.",
          "Tumia chaguo za majaribio pekee. Usiweke nenosiri lako halisi ikiwa tovuti haijalindwa."
        )
      ),
      makeStep(
        ["#googleDemoButton"],
        t("Other sign-in options", "Njia zingine za kuingia", "Njia nyingine za kuingia"),
        t(
          "A demo button does not necessarily connect to a real Google account.",
          "Button ya demo haimaanishi imeunganishwa na Google halisi.",
          "Kitufe cha majaribio si lazima kiunganishwe na akaunti halisi ya Google."
        )
      )
    ]
  };

  const FALLBACK_TOUR = [
    makeStep(
      ["header", ".topbar", "nav"],
      t("Welcome to MavunoBridge", "Karibu MavunoBridge 🌱", "Karibu MavunoBridge"),
      t(
        "Let's take a quick tour of this page.",
        "Twende tour fupi ya page hii.",
        "Tutazunguka ukurasa huu kwa muda mfupi."
      )
    ),
    makeStep(
      ["main", "body"],
      t("Explore the page", "Explore page hii", "Chunguza ukurasa huu"),
      t(
        "Look around and try the features available here.",
        "Angalia features zilizopo na ujaribu zinazopatikana.",
        "Angalia vipengele vilivyopo na ujaribu vinavyopatikana."
      )
    )
  ];

  function getSteps() {
    return TOURS[PAGE] || FALLBACK_TOUR;
  }

  /* ============================================================
     4. STYLES — DESKTOP + MOBILE OVERLAP FIX
     ============================================================ */

  const style = document.createElement("style");

  style.textContent = `
    .mb-farmer-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .mb-tour-launcher {
      position: fixed !important;
      z-index: 99990 !important;
      right: max(14px, env(safe-area-inset-right)) !important;
      bottom: max(14px, env(safe-area-inset-bottom)) !important;
      left: auto !important;
      top: auto !important;
      width: auto !important;
      max-width: calc(100vw - 28px) !important;
      min-height: 46px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 11px 17px !important;
      border: 1px solid rgba(255,255,255,.35) !important;
      border-radius: 999px !important;
      background: linear-gradient(135deg,#356d43,#17442e) !important;
      color: #fff !important;
      box-shadow: 0 7px 22px rgba(16,48,29,.28) !important;
      font: 700 14px/1.2 system-ui,sans-serif !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      transform: none !important;
      margin: 0 !important;
      touch-action: manipulation;
    }

    .mb-tour-launcher:hover {
      filter: brightness(1.08);
    }

    .mb-tour-launcher[hidden] {
      display: none !important;
    }

    .mb-tour-layer {
      position: fixed;
      inset: 0;
      z-index: 99999;
      overflow: hidden;
      pointer-events: none;
      font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }

    .mb-tour-layer[hidden] {
      display: none !important;
    }

    .mb-tour-shade {
      position: fixed;
      pointer-events: auto;
      background: rgba(7,22,13,.46);
      transition: left .18s ease,top .18s ease,width .18s ease,height .18s ease;
    }

    .mb-tour-focus {
      position: fixed;
      z-index: 1;
      pointer-events: none;
      border: 2px solid #8fd36d;
      box-shadow: 0 0 0 3px rgba(143,211,109,.18);
      outline: 2px solid rgba(255,255,255,.8);
      transition: left .18s ease,top .18s ease,width .18s ease,height .18s ease;
    }

    .mb-tour-card {
      position: fixed;
      z-index: 3;
      right: 18px;
      bottom: 18px;
      width: min(460px,calc(100vw - 36px));
      max-height: min(390px,calc(100dvh - 36px));
      overflow-y: auto;
      overscroll-behavior: contain;
      pointer-events: auto;
      padding: 15px;
      border: 1px solid rgba(255,255,255,.65);
      border-radius: 23px;
      background: rgba(248,252,246,.82);
      -webkit-backdrop-filter: blur(14px) saturate(135%);
      backdrop-filter: blur(14px) saturate(135%);
      box-shadow: 0 18px 55px rgba(8,31,18,.28);
      color: #173b27;
      animation: mbCardIn .25s ease both;
      scrollbar-width: thin;
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mb-tour-brand {
      display: flex;
      align-items: center;
      gap: 7px;
      flex: 1;
      min-width: 0;
      font-size: 12px;
      font-weight: 800;
      color: #1f5737;
    }

    .mb-tour-brand > span:last-child {
      overflow-wrap: anywhere;
    }

    .mb-tour-mark {
      display: grid;
      place-items: center;
      flex: 0 0 27px;
      width: 27px;
      height: 27px;
      border-radius: 9px;
      background: #2d7044;
      color: #fff;
      font-size: 15px;
    }

    .mb-tour-count {
      flex: 0 0 auto;
      color: #48634f;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
    }

    .mb-tour-close {
      display: grid;
      place-items: center;
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: 50%;
      background: rgba(34,80,48,.09);
      color: #204b30;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }

    .mb-tour-progress {
      height: 5px;
      margin: 11px 0 12px;
      overflow: hidden;
      border-radius: 99px;
      background: rgba(35,88,49,.12);
    }

    .mb-tour-progress span {
      display: block;
      height: 100%;
      width: 0;
      border-radius: inherit;
      background: linear-gradient(90deg,#4b9654,#b3d85b);
      transition: width .25s ease;
    }

    .mb-tour-guide-row {
      display: grid;
      grid-template-columns: 112px minmax(0,1fr);
      align-items: center;
      gap: 13px;
    }

    .mb-tour-farmer {
      display: block;
      width: 112px;
      height: 140px;
      overflow: visible;
      filter: drop-shadow(0 5px 5px rgba(22,62,35,.12));
      animation: mbFarmerFloat 3.1s ease-in-out infinite;
      transform-origin: center bottom;
    }

    .mb-tour-guide-copy {
      min-width: 0;
    }

    .mb-tour-speaking {
      display: inline-block;
      margin-bottom: 5px;
      color: #51804c;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .09em;
      line-height: 1.4;
    }

    .mb-tour-card h2 {
      margin: 0 0 7px;
      color: #173e28;
      font-size: clamp(17px,2.5vw,22px);
      font-weight: 850;
      line-height: 1.15;
      overflow-wrap: anywhere;
    }

    .mb-tour-card p {
      margin: 0;
      color: #314c39;
      font-size: 13px;
      line-height: 1.48;
      overflow-wrap: anywhere;
    }

    .mb-tour-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 12px;
      padding-top: 11px;
      border-top: 1px solid rgba(34,83,47,.13);
    }

    .mb-tour-left,
    .mb-tour-right {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .mb-tour-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 37px;
      padding: 8px 11px;
      border: 1px solid rgba(31,77,45,.17);
      border-radius: 11px;
      background: rgba(255,255,255,.76);
      color: #285339;
      font: 750 11px/1.2 system-ui,sans-serif;
      cursor: pointer;
      white-space: nowrap;
      touch-action: manipulation;
    }

    .mb-tour-btn:disabled {
      opacity: .42;
      cursor: not-allowed;
    }

    .mb-tour-next {
      border-color: #28683f;
      background: #28683f;
      color: #fff;
    }

    .mb-tour-btn:focus-visible,
    .mb-tour-close:focus-visible,
    .mb-tour-launcher:focus-visible {
      outline: 3px solid #a8d76b;
      outline-offset: 3px;
    }

    /* Existing Guide avatar */
    .mb-guide-head {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      min-width: 0 !important;
    }

    .mb-guide-farmer {
      display: block;
      flex: 0 0 58px;
      width: 58px;
      height: 64px;
      overflow: visible;
      animation: mbFarmerFloat 3.2s ease-in-out infinite;
    }

    .mb-guide-head-copy {
      flex: 1;
      min-width: 0;
    }

    /* Smart Assist avatar */
    .sa-assistant-avatar.mb-smart-farmer-avatar {
      display: flex !important;
      align-items: center;
      justify-content: center;
      flex: 0 0 94px;
      width: 94px;
      height: 110px;
      overflow: visible;
      background: linear-gradient(145deg,#edf8e7,#cde7c4) !important;
      border-radius: 24px !important;
      animation: mbFarmerFloat 3.2s ease-in-out infinite;
    }

    .sa-assistant-avatar.mb-smart-farmer-avatar .mb-farmer-art {
      width: 100%;
      height: 100%;
    }

    .sa-assistant-intro .mb-smart-farmer-status {
      display: inline-flex;
      width: fit-content;
      max-width: 100%;
      margin-bottom: 6px;
      padding: 4px 8px;
      border-radius: 99px;
      background: #e4f3dc;
      color: #2b6a3c;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .06em;
      overflow-wrap: anywhere;
    }

    /* Character emotes */
    .mb-farmer-head {
      transform-box: fill-box;
      transform-origin: center bottom;
    }

    .mb-farmer-wave {
      transform-box: view-box;
      transform-origin: 109px 100px;
    }

    .mb-farmer-happy .mb-farmer-head {
      animation: mbFarmerNod .55s ease;
    }

    .mb-farmer-happy .mb-farmer-art {
      filter: drop-shadow(0 3px 5px rgba(83,151,64,.2));
    }

    .mb-farmer-talking .mb-farmer-head {
      animation: mbFarmerTalk .45s ease-in-out 2;
    }

    .mb-farmer-celebrate {
      animation: mbFarmerCelebrate .75s ease !important;
    }

    .mb-farmer-wave-now .mb-farmer-wave {
      animation: mbFarmerWave 1s ease-in-out 2;
    }

    .mb-farmer-curious .mb-farmer-head {
      animation: mbFarmerCurious .55s ease;
    }

    .mb-farmer-tool {
      transform-box: fill-box;
      transform-origin: center;
    }

    @keyframes mbFarmerFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes mbFarmerWave {
      0%,100% { transform: rotate(0); }
      30%,65% { transform: rotate(-12deg); }
      48% { transform: rotate(9deg); }
    }

    @keyframes mbFarmerNod {
      0%,100% { transform: rotate(0); }
      35% { transform: rotate(-5deg) translateY(-2px); }
      70% { transform: rotate(4deg); }
    }

    @keyframes mbFarmerTalk {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(2px) rotate(1deg); }
    }

    @keyframes mbFarmerCurious {
      0%,100% { transform: rotate(0); }
      50% { transform: rotate(7deg) translateY(-2px); }
    }

    @keyframes mbFarmerCelebrate {
      0%,100% { transform: translateY(0) rotate(0); }
      25% { transform: translateY(-8px) rotate(-5deg); }
      55% { transform: translateY(-3px) rotate(5deg); }
    }

    @keyframes mbCardIn {
      from { opacity: 0; transform: translateY(9px) scale(.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Mobile layout */
    @media (max-width: 600px) {
      .mb-tour-launcher {
        right: max(10px, env(safe-area-inset-right)) !important;
        bottom: max(10px, env(safe-area-inset-bottom)) !important;
        min-height: 39px !important;
        max-width: 150px !important;
        padding: 9px 12px !important;
        font-size: 12px !important;
        box-shadow: 0 4px 14px rgba(16,48,29,.25) !important;
      }

      .mb-tour-card {
        right: 8px;
        left: 8px;
        bottom: max(8px, env(safe-area-inset-bottom));
        width: auto;
        max-width: none;
        max-height: min(44dvh,350px);
        padding: 11px;
        border-radius: 18px;
        background: rgba(248,252,246,.76);
        -webkit-backdrop-filter: blur(10px) saturate(125%);
        backdrop-filter: blur(10px) saturate(125%);
      }

      .mb-tour-progress {
        margin: 8px 0;
      }

      .mb-tour-guide-row {
        grid-template-columns: 76px minmax(0,1fr);
        gap: 9px;
      }

      .mb-tour-farmer {
        width: 76px;
        height: 94px;
      }

      .mb-tour-speaking {
        margin-bottom: 3px;
        font-size: 8px;
      }

      .mb-tour-card h2 {
        margin-bottom: 4px;
        font-size: 16px;
      }

      .mb-tour-card p {
        font-size: 11px;
        line-height: 1.38;
      }

      .mb-tour-controls {
        margin-top: 8px;
        padding-top: 8px;
        gap: 5px;
      }

      .mb-tour-left,
      .mb-tour-right {
        gap: 5px;
      }

      .mb-tour-btn {
        min-height: 33px;
        padding: 7px 9px;
        font-size: 10px;
      }

      .mb-tour-brand {
        font-size: 10px;
      }

      .mb-tour-count {
        font-size: 10px;
      }

      .mb-guide-farmer {
        flex-basis: 43px;
        width: 43px;
        height: 49px;
      }

      .sa-assistant-avatar.mb-smart-farmer-avatar {
        flex-basis: 70px;
        width: 70px;
        height: 82px;
        border-radius: 18px !important;
      }
    }

    @media (max-width: 360px) {
      .mb-tour-card {
        max-height: 42dvh;
        padding: 9px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 59px minmax(0,1fr);
        gap: 7px;
      }

      .mb-tour-farmer {
        width: 59px;
        height: 77px;
      }

      .mb-tour-card h2 {
        font-size: 14px;
      }

      .mb-tour-card p {
        font-size: 10px;
      }

      .mb-tour-btn {
        padding: 6px 7px;
        font-size: 9px;
      }

      .mb-tour-controls {
        flex-wrap: wrap;
      }

      .mb-tour-left,
      .mb-tour-right {
        flex-wrap: wrap;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb-tour-card,
      .mb-tour-launcher,
      .mb-tour-focus,
      .mb-tour-shade,
      .mb-tour-progress span,
      .mb-tour-farmer,
      .mb-guide-farmer,
      .sa-assistant-avatar.mb-smart-farmer-avatar,
      .mb-farmer-head,
      .mb-farmer-wave {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  /* ============================================================
     5. AVATAR IN GUIDE + SMART ASSIST
     ============================================================ */

  function addGuideAvatar() {
    const header = $(".mb-guide-panel .mb-guide-head");

    if (!header || $(".mb-guide-farmer", header)) return;

    const headingGroup = header.querySelector("div");
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

  function addSmartAssistAvatar() {
    if (PAGE !== "smart-assist.html") return;

    const avatar = $(".sa-assistant-avatar");
    if (!avatar) return;

    if (!avatar.classList.contains("mb-smart-farmer-avatar")) {
      avatar.classList.add("mb-smart-farmer-avatar");
      avatar.setAttribute("role", "img");
      avatar.setAttribute(
        "aria-label",
        "MavunoBridge farmer assistant"
      );
      avatar.innerHTML = FARMER_SVG;
    }

    const intro = $(".sa-assistant-intro");

    if (!intro || $(".mb-smart-farmer-status", intro)) return;

    const status = document.createElement("span");
    status.className = "mb-smart-farmer-status";

    status.textContent = language() === "sw"
      ? "MSAIDIZI WA SHAMBA"
      : language() === "en"
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
  }

  /* ============================================================
     6. TOUR LAUNCHER + PANEL
     ============================================================ */

  const launcher = document.createElement("button");

  launcher.type = "button";
  launcher.className = "mb-tour-launcher";
  launcher.textContent = "🧭 Website Tour";
  launcher.setAttribute("aria-label", "Open MavunoBridge website tour");

  document.body.appendChild(launcher);

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
      aria-describedby="mbTourText">

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
          aria-label="Close tutorial">×</button>
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        <span id="mbTourProgress"></span>
      </div>

      <div class="mb-tour-guide-row">
        <div class="mb-tour-farmer" role="img" aria-label="Farmer assistant">
          ${FARMER_SVG}
        </div>

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
          <button type="button" class="mb-tour-btn" id="mbTourSkip">
            Skip tutorial
          </button>
        </div>

        <div class="mb-tour-right">
          <button type="button" class="mb-tour-btn" id="mbTourBack">
            Back
          </button>

          <button type="button" class="mb-tour-btn mb-tour-next" id="mbTourNext">
            Next →
          </button>
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
  let emoteTimer = 0;

  /* ============================================================
     7. SPOTLIGHT
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
        console.warn("Invalid tour selector:", selector);
      }
    }

    return null;
  }

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
      getComputedStyle(target).borderRadius || "10px";
  }

  function scheduleReposition() {
    if (!tourOpen || animationFrame) return;

    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      positionSpotlight(getTarget(steps[index]?.target));
    });
  }

  /* ============================================================
     8. FARMER EMOTES
     ============================================================ */

  function farmerElements() {
    return $$(".mb-tour-farmer, .mb-guide-farmer, .mb-smart-farmer-avatar");
  }

  function farmerEmote(mood) {
    const classes = [
      "mb-farmer-happy",
      "mb-farmer-talking",
      "mb-farmer-celebrate",
      "mb-farmer-wave-now",
      "mb-farmer-curious"
    ];

    farmerElements().forEach(avatar => {
      avatar.classList.remove(...classes);

      // Restart the selected animation.
      void avatar.offsetWidth;

      if (mood) {
        avatar.classList.add(`mb-farmer-${mood}`);
      }
    });
  }

  function startRandomEmotes() {
    stopRandomEmotes();

    const moods = [
      "happy",
      "talking",
      "wave-now",
      "curious",
      ""
    ];

    emoteTimer = window.setInterval(() => {
      const mood = moods[Math.floor(Math.random() * moods.length)];
      farmerEmote(mood);
    }, 4200);
  }

  function stopRandomEmotes() {
    if (emoteTimer) {
      window.clearInterval(emoteTimer);
      emoteTimer = 0;
    }
  }

  /* ============================================================
     9. WORDING + RENDER
     ============================================================ */

  function labels() {
    if (language() === "sw") {
      return {
        step: "Hatua",
        skip: "Ruka mwongozo",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        speaking: "MSAIDIZI WAKO WA KILIMO"
      };
    }

    if (language() === "en") {
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
      finish: "Finish ✓",
      speaking: "FARM BUDDY · TWENDE!"
    };
  }

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

    farmerEmote("talking");

    if (shouldScroll && target) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    window.setTimeout(() => {
      if (tourOpen) {
        positionSpotlight(getTarget(steps[index]?.target));
      }
    }, shouldScroll && target ? 350 : 0);
  }

  /* ============================================================
     10. OPEN / CLOSE / CONTROLS
     ============================================================ */

  function completed() {
    try {
      return localStorage.getItem(`${STORAGE_KEY}:${PAGE}`) === "1";
    } catch {
      return false;
    }
  }

  function markCompleted() {
    try {
      localStorage.setItem(`${STORAGE_KEY}:${PAGE}`, "1");
    } catch {}
  }

  function closeTour(mood = "") {
    layer.hidden = true;
    launcher.hidden = false;
    tourOpen = false;

    markCompleted();
    stopRandomEmotes();

    window.removeEventListener("resize", scheduleReposition);
    window.removeEventListener("scroll", scheduleReposition, true);

    farmerEmote(mood);

    if (lastFocused && typeof lastFocused.focus === "function") {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch {}
    }
  }

  function openTour() {
    lastFocused = document.activeElement;

    steps = getSteps();
    index = 0;
    tourOpen = true;

    layer.hidden = false;
    launcher.hidden = true;

    renderStep(true);

    window.addEventListener("resize", scheduleReposition);
    window.addEventListener("scroll", scheduleReposition, true);

    startRandomEmotes();

    inTour("#mbTourNext").focus({ preventScroll: true });
  }

  launcher.addEventListener("click", openTour);

  inTour("#mbTourClose").addEventListener("click", () => {
    closeTour("wave-now");
  });

  inTour("#mbTourSkip").addEventListener("click", () => {
    closeTour("wave-now");
  });

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
      closeTour("celebrate");
    }
  });

  document.addEventListener("keydown", event => {
    if (!tourOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour("wave-now");
    } else if (event.key === "ArrowRight" && index < steps.length - 1) {
      index += 1;
      renderStep(true);
    } else if (event.key === "ArrowLeft" && index > 0) {
      index -= 1;
      renderStep(true);
    }
  });

  $("#languageSelect")?.addEventListener("change", () => {
    setupAvatars();

    if (tourOpen) renderStep(false);
  });

  /* ============================================================
     11. FIRST-VISIT TOUR
     ============================================================ */

  function startIfNewVisitor() {
    if (completed()) return;

    window.setTimeout(() => {
      if (!tourOpen) openTour();
    }, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startIfNewVisitor,
      { once: true }
    );
  } else {
    startIfNewVisitor();
  }

  /* ============================================================
     12. ADD AVATARS IF OTHER PAGE CONTENT LOADS LATER
     ============================================================ */

  setupAvatars();

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
  }, 6000);

  console.info("MavunoBridge Tour V4 loaded.");
})();
