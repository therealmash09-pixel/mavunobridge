
/* ==========================================================
   MAVUNOBRIDGE — WEBSITE TOUR + ANIMATED FARMER ASSISTANT
   Complete replacement for website-tour.js

   Features:
   - Skippable first-visit tour
   - Next, Back, Skip and Finish controls
   - Highlighted website sections
   - Animated farmer: floating, waving and blinking
   - Farmer avatar in the Buyer + Farmer Guide
   - Farmer avatar in Smart Assist
   - English, Sheng + English and Kiswahili
   - Responsive and reduced-motion support
   - No external images or animation libraries
   ========================================================== */

(() => {
  "use strict";

  if (window.__MAVUNO_WEBSITE_TOUR_V3__) return;
  window.__MAVUNO_WEBSITE_TOUR_V3__ = true;

  const PAGE = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const STORAGE_KEY = "mavunobridge_tour_completed_v3";

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

  function translate(value) {
    if (typeof value === "string") return value;
    return value?.[language()] || value?.mix || value?.en || "";
  }

  /* ==========================================================
     1. FARMER AVATAR — EMBEDDED SVG
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

      <!-- Body -->
      <path d="M26 120 Q28 86 47 79 L74 79 Q94 87 96 120Z"
        fill="#246548"/>

      <path d="M49 83 L60 96 L71 83"
        fill="none" stroke="#d2ead0" stroke-width="3"
        stroke-linecap="round"/>

      <!-- Neck -->
      <path d="M49 65 L49 82 Q60 91 72 81 L71 65Z"
        fill="#9b5937"/>

      <!-- Animated waving arm -->
      <g class="mb-farmer-wave">
        <path d="M80 88 Q87 74 92 59 L98 43
          Q101 36 107 40 Q112 43 108 51
          L102 70 Q99 88 90 98Z"
          fill="#9b5937"/>

        <path d="M98 45 Q91 37 95 32 Q99 29 103 37
          Q107 28 111 33 Q114 37 108 44"
          fill="#a96843"/>
      </g>

      <!-- Face -->
      <circle cx="37" cy="52" r="7" fill="#a96843"/>
      <circle cx="83" cy="52" r="7" fill="#a96843"/>

      <ellipse cx="60" cy="51" rx="25" ry="29"
        fill="#b8754d"/>

      <path d="M35 47 Q32 23 57 22 Q81 21 85 46
        L77 39 L44 39Z"
        fill="#3d3025"/>

      <!-- Blinking eyes -->
      <g class="mb-farmer-eyes">
        <ellipse cx="50" cy="52" rx="2.5" ry="3.2"
          fill="#29251f"/>
        <ellipse cx="70" cy="52" rx="2.5" ry="3.2"
          fill="#29251f"/>
      </g>

      <!-- Smile -->
      <path d="M51 64 Q60 72 70 63"
        fill="none" stroke="#6c3229" stroke-width="2.6"
        stroke-linecap="round"/>

      <!-- Green farmer hat -->
      <path d="M34 35 Q36 12 60 12 Q82 13 86 35Z"
        fill="#367d4b"/>

      <ellipse cx="60" cy="35" rx="34" ry="7"
        fill="#205e3b"/>

      <path d="M49 19 Q57 6 69 17 Q61 16 58 27
        Q55 20 49 19Z"
        fill="#a6d969"/>

      <path d="M59 26 Q62 18 69 17"
        fill="none" stroke="#e2f6c8" stroke-width="2"
        stroke-linecap="round"/>

      <!-- Small growing plant -->
      <circle cx="60" cy="105" r="9" fill="#d7efaa"/>

      <path d="M60 111 Q59 102 64 99
        M60 106 Q54 100 52 103"
        fill="none" stroke="#246548" stroke-width="2"
        stroke-linecap="round"/>
    </svg>
  `;

  /* ==========================================================
     2. TOUR CONTENT
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
          "Search by name, select a category or county, filter retail/bulk sales, compare the illustrative price guide, and sort by date or price. Clear filters resets the choices.",
          "Search kwa jina, chagua category ama county, filter retail/bulk, angalia price guide na sort kwa bei ama tarehe. Clear filters inaanza upya.",
          "Tafuta kwa jina, chagua kundi au kaunti, chuja retail/bulk, angalia mwongozo wa bei na panga kwa bei au tarehe."
        )
      ),

      makeStep(
        ["#listingGrid .product-card", "#listingGrid"],
        phrase(
          "Compare product listings",
          "Angalia details za listing kabla ya kununua.",
          "Linganisha matangazo."
        ),
        phrase(
          "Review the product, seller, location, quantity and price. Listing cards may offer Call, Message or Add to cart. Sample offers are demo data, so confirm stock and terms before a real deal.",
          "Angalia product, seller, location, quantity na bei. Unaweza kuona Call, Message ama Add to cart. Sample listings ni demo; thibitisha stock kabla ya deal.",
          "Kagua bidhaa, muuzaji, eneo, kiasi na bei. Kadi zinaweza kuwa na Call, Message au Add to cart. Matangazo ni mifano; thibitisha upatikanaji na masharti."
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
          "Enter the product name, category, county, quantity, price, sale type and seller contact. Add a clear product photo when available, then publish. In demo mode, new listings stay in this browser.",
          "Weka product name, category, county, quantity, bei, sale type na contact. Ongeza picha halisi kisha publish. Listing mpya inabaki kwa browser hii.",
          "Weka jina la bidhaa, kundi, kaunti, kiasi, bei, aina ya mauzo na mawasiliano. Ongeza picha kisha uchapishe. Tangazo la demo hubaki kwenye kivinjari hiki."
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
          "Open Cart to review or remove items. The demo cart does not take payments, reserve stock or submit real orders.",
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
          "Create a crop plan, select visible symptoms, describe a crop problem and generate a farm report. Ask follow-up questions and explore crop guides. Photo previews are not automatic diagnoses.",
          "Create crop plan, select symptoms na generate farm report. Uliza maswali na browse crop guides. Photo preview peke yake haitambui ugonjwa.",
          "Tengeneza mpango wa zao, chagua dalili na unda ripoti ya shamba. Uliza maswali na soma mwongozo. Kuonyesha picha pekee hakutambui ugonjwa."
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
          "Search and filter example farmer groups and opportunities, then save interests. These are demo concepts, not verified offers or official applications.",
          "Tafuta na filter sample farmer groups, kisha save interests. Hizi ni examples tu, si offers zilizothibitishwa.",
          "Tafuta na chuja mifano ya vikundi na fursa, kisha hifadhi unazopenda. Si ofa zilizothibitishwa wala maombi rasmi."
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
          "Buyers can describe the product, location, quantity and requirements. Requests are demo data and do not guarantee that a real farmer will receive or fulfil them.",
          "Buyers wanaweza kuweka product, county na quantity. Requests ni demo; hazihakikishi kuwa farmer halisi atapata ombi.",
          "Wanunuzi wanaweza kueleza bidhaa, kaunti, kiasi na mahitaji. Maombi ni data za mfano na hayahakikishi kutimizwa."
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
          "Choose a sample contact and try the messaging interface. Replies are simulated and are not delivered to real sellers or other visitors.",
          "Chagua sample contact na ujaribu chat. Replies zina-simulate tu na hazitumwi kwa sellers halisi.",
          "Chagua mtu wa mfano na ujaribu mazungumzo. Majibu yanaigwa na hayafikii wauzaji halisi."
        )
      ),

      makeStep(
        ".demo-note",
        phrase(
          "Remember: this is a demo",
          "Kumbuka hii ni demo ya science fair.",
          "Kumbuka: huu ni mfano."
        ),
        phrase(
          "Some data is saved only in this browser. Prices are illustrative, messages are simulated and sign-in is a demo flow. Never enter real passwords or payment PINs.",
          "Data fulani hubaki kwa browser hii. Bei ni examples, messages ni simulated na sign-in ni demo. Usitumie password au PIN halisi.",
          "Baadhi ya data huhifadhiwa kwenye kivinjari hiki pekee. Bei ni za mfano, ujumbe ni wa majaribio na kuingia ni demo. Usitumie nenosiri au PIN halisi."
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
          "Explore the farm planner, symptom matching, farm reports, follow-up questions and crop library. Built-in results are demo guidance, not confirmed diagnoses or live weather data.",
          "Hapa kuna crop planner, symptom matching, farm reports na crop library. Ni demo guidance, si live weather ama diagnosis ya uhakika.",
          "Hapa kuna mpango wa shamba, kulinganisha dalili, ripoti na mwongozo wa mazao. Si utabiri wa moja kwa moja au utambuzi wa uhakika."
        )
      ),

      makeStep(
        "#farmPlanner",
        phrase(
          "Step 1: Describe your farm",
          "Chagua county, crop na hali ya shamba.",
          "Hatua ya 1: Eleza shamba."
        ),
        phrase(
          "Choose your county and crop, then add the growth stage, main concern, soil and water details if known. Farm size and extra notes are optional.",
          "Chagua county na crop. Weka stage, concern, soil na maji kama unajua. Farm size na notes ni optional.",
          "Chagua kaunti na zao. Weka hatua ya ukuaji, tatizo, udongo na maji kama unajua. Ukubwa na maelezo ya ziada si lazima."
        )
      ),

      makeStep(
        [".sa-symptom-field", "#saSymptomChecks"],
        phrase(
          "Step 2: Select symptoms",
          "Tick dalili unazoona kwa crop.",
          "Hatua ya 2: Chagua dalili."
        ),
        phrase(
          "Select visible signs and describe the problem. The built-in library compares your description and selections with possible crop-health matches. These are suggestions, not a diagnosis.",
          "Tick symptoms na ueleze tatizo. Mfumo hulinganisha na starter library; results ni possibilities, si diagnosis.",
          "Chagua dalili na ueleze tatizo. Mfumo hulinganisha maelezo na orodha ya mwanzo; matokeo ni uwezekano tu."
        )
      ),

      makeStep(
        "#saPhoto",
        phrase(
          "Step 3: Upload a crop photo",
          "Weka picha clear ya sehemu imeathirika.",
          "Hatua ya 3: Pakia picha."
        ),
        phrase(
          "Choose a clear photo of the affected leaf, stem, fruit or root. The page can preview images. Automatic visual matching requires a connected image-analysis service.",
          "Upload picha clear ya leaf, stem, fruit ama root. Preview inafanya kazi, lakini visual matching inahitaji service kuunganishwa.",
          "Pakia picha iliyo wazi ya jani, shina, tunda au mzizi. Utambuzi wa picha unahitaji huduma tofauti iliyounganishwa."
        )
      ),

      makeStep(
        ["#generateReportButton", "#reportSection"],
        phrase(
          "Step 4: Generate your report",
          "Generate report upate tips na next steps.",
          "Hatua ya 4: Tengeneza ripoti."
        ),
        phrase(
          "Review possible matches, growing tips and suggested next steps. Save the report in this browser, download a text copy or print/save as PDF.",
          "Soma possible matches na next steps. Unaweza kuhifadhi kwa browser hii, download text ama print PDF.",
          "Soma uwezekano na hatua zinazofuata. Hifadhi kwenye kivinjari hiki, pakua maandishi au chapisha kama PDF."
        )
      ),

      makeStep(
        "#saQuestionForm",
        phrase(
          "Step 5: Ask a farm question",
          "Uliza kuhusu maji, pests, soil ama harvest.",
          "Hatua ya 5: Uliza swali."
        ),
        phrase(
          "Use a suggested question or type your own. Offline answers use the built-in guidance library and may not cover every situation.",
          "Chagua suggested question ama andika yako. Offline answers hutumia built-in guidance.",
          "Chagua swali lililopendekezwa au andika lako. Majibu ya nje ya mtandao hutumia maelekezo yaliyowekwa."
        )
      ),

      makeStep(
        [".sa-library-controls", "#saCropLibraryGrid"],
        phrase(
          "Step 6: Explore crop guides",
          "Search crops na filter kwa group ama county.",
          "Hatua ya 6: Mwongozo wa mazao."
        ),
        phrase(
          "Search for a crop and filter by crop group or county context. Use the button on a crop card to select that crop in the planner.",
          "Search crop na filter group ama county. Button ya crop card itachagua crop kwenye planner.",
          "Tafuta zao na uchuje kwa kundi au kaunti. Tumia kitufe cha kadi kuchagua zao kwenye mpango."
        )
      ),

      makeStep(
        "#savedReportsSection",
        phrase(
          "Step 7: Saved reports",
          "Reports ulizohifadhi zinapatikana hapa.",
          "Hatua ya 7: Ripoti zilizohifadhiwa."
        ),
        phrase(
          "Review or delete previous reports. Saved reports remain in this browser and do not automatically sync to other devices.",
          "Hapa unaweza kuona ama kufuta reports za zamani. Hazisync automatic kwa devices zingine.",
          "Tazama au futa ripoti zilizopita. Ripoti hubaki kwenye kivinjari hiki na haziunganishwi kiotomatiki na vifaa vingine."
        )
      )
    ],

    "sacco.html": [
      makeStep(
        ".page-hero",
        phrase("Welcome to SACCO Hub", "Karibu SACCO Hub!", "Karibu SACCO Hub!"),
        phrase(
          "Explore the sample farmer groups, cooperative concepts and agricultural opportunities. These are demonstration ideas, not verified offers.",
          "Explore sample farmer groups na opportunities. Hizi ni examples tu, si offers zilizothibitishwa.",
          "Vinjari mifano ya vikundi na fursa za kilimo. Hizi ni za majaribio, si ofa zilizothibitishwa."
        )
      ),
      makeStep(
        ".sacco-controls",
        phrase("Search opportunities", "Tafuta kwa jina, county ama type.", "Tafuta fursa."),
        phrase(
          "Search by name or location and filter by opportunity type to narrow down the example cards.",
          "Search kwa jina au location, kisha filter kwa type ya opportunity.",
          "Tafuta kwa jina au eneo na uchuje kwa aina ya fursa."
        )
      ),
      makeStep(
        ["#saccoGrid .sacco-card", "#saccoGrid"],
        phrase("Save an interest", "Bonyeza Save interest kwa fursa unayopenda.", "Hifadhi fursa."),
        phrase(
          "Read each card and save your interest. This does not submit an official application or contact a real cooperative.",
          "Soma card kisha Save interest. Hii haiwasilishi application rasmi wala kuwasiliana na SACCO halisi.",
          "Soma kadi na uhifadhi unayopendezwa nayo. Hii haiwasilishi maombi rasmi wala kuwasiliana na chama halisi."
        )
      ),
      makeStep(
        ".interest-panel",
        phrase("Review saved interests", "Hapa utaona interests ulizohifadhi.", "Kagua fursa ulizohifadhi."),
        phrase(
          "Review your saved opportunities. Before joining or paying any real organisation, verify its registration, charges, eligibility and terms.",
          "Kagua interests zako. Kabla ya kujiunga ama kulipa, verify registration, fees na terms.",
          "Kagua fursa ulizohifadhi. Kabla ya kujiunga au kulipa, thibitisha usajili, ada na masharti."
        )
      )
    ],

    "buyer-requests.html": [
      makeStep(
        ".page-hero",
        phrase("Welcome to Buyer Requests", "Karibu Buyer Requests!", "Karibu Buyer Requests!"),
        phrase(
          "Buyers can describe the produce they need. This is a demo request board, not a live ordering system.",
          "Buyer anaweza kuweka products anahitaji. Hii ni demo, si live order system.",
          "Wanunuzi wanaweza kueleza bidhaa wanazohitaji. Huu ni mfano tu, si mfumo halisi wa oda."
        )
      ),
      makeStep(
        "#demandForm",
        phrase("Post a request", "Weka product, county na quantity.", "Weka ombi."),
        phrase(
          "Enter the product and county, then add quantity, sale type, deadline or other details as needed. Share contact details only if you're comfortable displaying them in the demo.",
          "Weka product na county, kisha quantity na details. Weka contact tu kama uko comfortable kuionyesha kwenye demo.",
          "Weka bidhaa na kaunti, kisha ongeza kiasi na maelezo. Weka mawasiliano tu ikiwa uko tayari kuyaonyesha kwenye demo."
        )
      ),
      makeStep(
        "#demandList",
        phrase("Browse requests", "Angalia requests zilizopo.", "Vinjari maombi."),
        phrase(
          "Review available requests. In this demo, data is stored locally and may not be visible on another visitor's device.",
          "Kagua requests zilizopo. Data inabaki kwa browser hii, kwa hiyo wengine huenda wasizione.",
          "Kagua maombi yaliyopo. Data huhifadhiwa kwenye kivinjari hiki na huenda isionekane kwa wageni wengine."
        )
      ),
      makeStep(
        "#supportForm",
        phrase("Save a support note", "Hifadhi reminder ama swali.", "Hifadhi dokezo."),
        phrase(
          "Support notes are local reminders, not messages sent to a support team. Avoid entering passwords or sensitive information.",
          "Support notes ni reminders tu; hazitumwi kwa support team. Usiweke password ama data nyeti.",
          "Dokezo ni vikumbusho tu na hazitumwi kwa timu ya usaidizi. Usiweke nenosiri au taarifa nyeti."
        )
      )
    ],

    "messages.html": [
      makeStep(
        ".messages-notice",
        phrase("Messages demo", "Kumbuka replies ni simulated.", "Ujumbe wa demo."),
        phrase(
          "This messaging page uses sample contacts and simulated responses. Messages are not delivered to real sellers.",
          "Hii chat hutumia sample contacts na simulated replies. Messages hazifiki kwa sellers halisi.",
          "Ukurasa huu hutumia watu wa mfano na majibu ya kuigiza. Ujumbe haupelekwi kwa wauzaji halisi."
        )
      ),
      makeStep(
        [".conversation-sidebar", "#conversationList"],
        phrase("Choose a conversation", "Chagua sample contact kwa sidebar.", "Chagua mazungumzo."),
        phrase(
          "Select a sample contact to start. You can go back to Marketplace to review the product or seller information.",
          "Chagua sample contact kuanza. Unaweza kurudi Marketplace kuangalia product na seller details.",
          "Chagua mtu wa mfano kuanza mazungumzo. Unaweza kurudi sokoni kukagua bidhaa na muuzaji."
        )
      ),
      makeStep(
        ".conversation-panel",
        phrase("Read your messages", "Messages zitaonekana hapa.", "Soma ujumbe."),
        phrase(
          "Review the conversation and simulated replies. Never share payment PINs, passwords or private documents.",
          "Soma chat na replies. Usi-share PIN za malipo, password ama documents za private.",
          "Soma mazungumzo na majibu. Usishiriki PIN za malipo, manenosiri au hati za faragha."
        )
      ),
      makeStep(
        "#messageForm",
        phrase("Write a message", "Andika message kisha bonyeza Send.", "Andika ujumbe."),
        phrase(
          "Choose a conversation, type your question and press Send. Real-time communication between separate users requires a connected backend.",
          "Chagua conversation, andika swali kisha Send. Messaging halisi kati ya users inahitaji backend.",
          "Chagua mazungumzo, andika swali kisha bonyeza Tuma. Ujumbe wa moja kwa moja unahitaji backend."
        )
      )
    ],

    "login.html": [
      makeStep(
        ".auth-visual",
        phrase("Welcome to sign-in", "Karibu kwa demo ya sign-in.", "Karibu kwenye mfano wa kuingia."),
        phrase(
          "This page demonstrates a sign-in flow. You can continue browsing without signing in.",
          "Hii ni mfano wa sign-in. Unaweza kurudi Marketplace bila kuingia.",
          "Ukurasa huu unaonyesha mfano wa kuingia. Unaweza kuvinjari bila kuingia."
        )
      ),
      makeStep(
        "#demoLoginForm",
        phrase("Demo account details", "Tumia details za mfano pekee.", "Maelezo ya akaunti ya demo."),
        phrase(
          "No real account is created. Do not reuse a real password or enter sensitive personal information.",
          "Hakuna account halisi inayofunguliwa. Usitumie password yako halisi ama data nyeti.",
          "Akaunti halisi haifunguliwi. Usitumie nenosiri lako halisi au taarifa nyeti."
        )
      ),
      makeStep(
        "#googleDemoButton",
        phrase("Google-style demo button", "Hii ni account chooser ya mfano.", "Kitufe cha mfano cha Google."),
        phrase(
          "The Google-style button opens a simulated account chooser, not actual Google authentication.",
          "Kitufe hiki kinaonyesha account chooser ya mfano, si Google authentication halisi.",
          "Kitufe hiki huonyesha kisanduku cha akaunti cha mfano, si uthibitishaji halisi wa Google."
        )
      )
    ]
  };

  const FALLBACK_TOUR = [
    makeStep(
      ".topbar",
      phrase("Welcome to MavunoBridge", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
      phrase(
        "Use the navigation to explore the marketplace and farming tools.",
        "Tumia navigation kuchunguza marketplace na farming tools.",
        "Tumia menyu kuchunguza soko na zana za kilimo."
      )
    ),
    makeStep(
      "main",
      phrase("Explore this page", "Angalia features za page hii.", "Chunguza ukurasa huu."),
      phrase(
        "Use the forms and buttons available. Some features in this demo save data in this browser only.",
        "Tumia forms na buttons zilizopo. Features zingine huhifadhi data kwa browser hii tu.",
        "Tumia fomu na vitufe vilivyopo. Vipengele vingine huhifadhi data kwenye kivinjari hiki pekee."
      )
    )
  ];

  function getSteps() {
    return TOURS[PAGE] || FALLBACK_TOUR;
  }

  /* ==========================================================
     3. ANIMATIONS AND VISUAL STYLES
     ========================================================== */

  const style = document.createElement("style");

  style.textContent = `
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
      transition: transform .18s ease,background .18s ease;
    }

    .mb-tour-launcher:hover {
      transform: translateY(-2px);
      background: #f0f8f1;
    }

    .mb-tour-launcher[hidden],
    .mb-tour-layer[hidden] {
      display: none !important;
    }

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
      box-shadow: 0 0 0 2px #fff,
        0 0 28px rgba(145,231,164,.3);
      pointer-events: none;
      transition: top .2s ease,left .2s ease,
        width .2s ease,height .2s ease;
    }

    .mb-tour-card {
      position: fixed;
      z-index: 10022;
      left: 50%;
      bottom: max(16px,env(safe-area-inset-bottom));
      width: min(580px,calc(100vw - 24px));
      max-height: min(390px,calc(100dvh - 28px));
      overflow-y: auto;
      transform: translateX(-50%);
      padding: 17px 19px 15px;
      border: 1px solid #d7e6da;
      border-radius: 18px;
      background: #fff;
      color: #1b3226;
      box-shadow: 0 18px 70px #0004;
      font-family: system-ui,-apple-system,"Segoe UI",sans-serif;
      pointer-events: auto;
    }

    .mb-tour-card * {
      box-sizing: border-box;
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 11px;
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
      background: #e6f5e9;
      color: #175338;
      font-size: 15px;
    }

    .mb-tour-count {
      margin-left: auto;
      color: #6b8072;
      font-size: 10px;
      font-weight: 750;
      white-space: nowrap;
    }

    .mb-tour-progress {
      height: 5px;
      overflow: hidden;
      margin-bottom: 15px;
      border-radius: 99px;
      background: #e8f0e9;
    }

    .mb-tour-progress span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg,#47a966,#9bdc83);
      transition: width .2s ease;
    }

    .mb-tour-guide-row {
      display: grid;
      grid-template-columns: 83px minmax(0,1fr);
      align-items: start;
      gap: 14px;
    }

    .mb-tour-farmer,
    .mb-guide-farmer {
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      overflow: hidden;
      border: 1px solid #bfe2c6;
      border-radius: 21px;
      background: linear-gradient(145deg,#eff9e9,#cce9d0);
      box-shadow: 0 6px 18px rgba(25,91,52,.12);
      animation: mbFarmerFloat 3s ease-in-out infinite;
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

    .mb-farmer-wave {
      transform-box: view-box;
      transform-origin: 91px 88px;
      animation: mbFarmerWave 2.6s ease-in-out infinite;
    }

    .mb-farmer-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: mbFarmerBlink 5s infinite;
    }

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
      font: 800 clamp(18px,2.6vw,22px)/1.25 system-ui,sans-serif;
      letter-spacing: -.45px;
    }

    .mb-tour-card p {
      margin: 0;
      color: #4c6255;
      font: 12px/1.72 system-ui,sans-serif;
      overflow-wrap: anywhere;
    }

    .mb-tour-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 9px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #edf2ed;
    }

    .mb-tour-left,
    .mb-tour-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mb-tour-btn {
      display: inline-flex;
      min-height: 37px;
      align-items: center;
      justify-content: center;
      padding: 9px 12px;
      border: 1px solid #d4e2d6;
      border-radius: 9px;
      background: white;
      color: #244b33;
      font: 750 11px/1.2 system-ui,sans-serif;
      cursor: pointer;
    }

    .mb-tour-btn:hover {
      background: #f2f8f2;
    }

    .mb-tour-btn:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-tour-next {
      border-color: #174d37;
      background: #174d37;
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
      border: 1px solid #e0e9e1;
      border-radius: 50%;
      background: white;
      color: #516a59;
      font-size: 18px;
      cursor: pointer;
    }

    /* Buyer + Farmer Guide avatar */

    .mb-guide-head {
      gap: 10px !important;
    }

    .mb-guide-farmer {
      width: 43px;
      height: 43px;
      border-radius: 13px;
    }

    .mb-guide-head .mb-guide-head-copy {
      flex: 1;
      min-width: 0;
    }

    /* Smart Assist avatar */

    .sa-assistant-avatar.mb-smart-farmer-avatar {
      position: relative;
      display: grid;
      width: 68px;
      height: 68px;
      flex: 0 0 auto;
      place-items: center;
      overflow: hidden;
      border: 2px solid #bde2c6;
      border-radius: 20px;
      background: linear-gradient(145deg,#eff9e9,#cce9d0);
      box-shadow: 0 7px 19px rgba(25,91,52,.12);
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .sa-assistant-avatar.mb-smart-farmer-avatar .mb-farmer-art {
      width: 100%;
      height: 100%;
    }

    .sa-assistant-intro .mb-smart-farmer-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      width: fit-content;
      margin: 0 0 8px;
      padding: 5px 8px;
      border: 1px solid #d3ead7;
      border-radius: 999px;
      background: #f2faf4;
      color: #26724c;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .45px;
    }

    .mb-smart-farmer-status::before {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #49b876;
      box-shadow: 0 0 0 3px rgba(73,184,118,.13);
      content: "";
      animation: mbStatusPulse 1.8s ease-in-out infinite;
    }

    @keyframes mbFarmerFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes mbFarmerWave {
      0%,100% { transform: rotate(0deg); }
      20% { transform: rotate(-9deg); }
      45% { transform: rotate(7deg); }
      65% { transform: rotate(-6deg); }
      80% { transform: rotate(3deg); }
    }

    @keyframes mbFarmerBlink {
      0%,43%,47%,83%,87%,100% { transform: scaleY(1); }
      45%,85% { transform: scaleY(.12); }
    }

    @keyframes mbStatusPulse {
      0%,100% { opacity: 1; }
      50% { opacity: .45; }
    }

    @media(max-width:520px) {
      .mb-tour-launcher {
        left: 10px;
        bottom: 10px;
        padding: 11px 12px;
        font-size: 11px;
      }

      .mb-tour-card {
        bottom: max(10px,env(safe-area-inset-bottom));
        padding: 14px 13px 12px;
        border-radius: 15px;
      }

      .mb-tour-guide-row {
        grid-template-columns: 59px minmax(0,1fr);
        gap: 10px;
      }

      .mb-tour-farmer {
        width: 59px;
        height: 59px;
        border-radius: 17px;
      }

      .mb-tour-card p {
        font-size: 11px;
      }

      .mb-tour-btn {
        min-height: 36px;
        padding: 8px 9px;
        font-size: 10px;
      }

      .mb-tour-controls,
      .mb-tour-left,
      .mb-tour-right {
        gap: 5px;
      }

      .mb-guide-farmer {
        width: 37px;
        height: 37px;
      }

      .sa-assistant-avatar.mb-smart-farmer-avatar {
        width: 60px;
        height: 60px;
      }
    }

    @media(prefers-reduced-motion:reduce) {
      .mb-tour-launcher,
      .mb-tour-focus,
      .mb-tour-progress span,
      .mb-tour-farmer,
      .mb-farmer-wave,
      .mb-farmer-eyes,
      .mb-guide-farmer,
      .sa-assistant-avatar.mb-smart-farmer-avatar,
      .mb-smart-farmer-status::before {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  /* ==========================================================
     4. ADD THE FARMER TO EXISTING ASSISTANTS
     ========================================================== */

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

    avatar.classList.add("mb-smart-farmer-avatar");
    avatar.setAttribute("role", "img");
    avatar.setAttribute(
      "aria-label",
      "Animated MavunoBridge farming assistant"
    );
    avatar.innerHTML = FARMER_SVG;

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

  /* ==========================================================
     5. BUILD THE TOUR INTERFACE
     ========================================================== */

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
          aria-label="Skip tutorial">×</button>
      </div>

      <div class="mb-tour-progress" aria-hidden="true">
        <span id="mbTourProgress"></span>
      </div>

      <div class="mb-tour-guide-row">
        <div class="mb-tour-farmer"
          role="img"
          aria-label="Animated farmer assistant">
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
          <button type="button"
            class="mb-tour-btn"
            id="mbTourSkip">Skip tutorial</button>
        </div>

        <div class="mb-tour-right">
          <button type="button"
            class="mb-tour-btn"
            id="mbTourBack">Back</button>

          <button type="button"
            class="mb-tour-btn mb-tour-next"
            id="mbTourNext">Next →</button>
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

  /* ==========================================================
     6. SPOTLIGHT / HIGHLIGHT
     ========================================================== */

  function getTarget(selectors) {
    const list = Array.isArray(selectors)
      ? selectors
      : [selectors];

    for (const selector of list) {
      if (!selector) continue;

      try {
        const target = $(selector);

        if (target && target.getClientRects().length) {
          return target;
        }
      } catch (error) {
        console.warn("Invalid tour target:", selector);
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

  /* ==========================================================
     7. TOUR BUTTON WORDING
     ========================================================== */

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

    return {
      step: "Step",
      skip: "Skip tutorial",
      back: "Back",
      next: "Next →",
      finish: "Finish ✓",
      speaking: "YOUR FARMING GUIDE"
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
    }, shouldScroll && target ? 300 : 0);
  }

  /* ==========================================================
     8. OPEN / CLOSE / SKIP / NEXT / BACK
     ========================================================== */

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

  function closeTour() {
    layer.hidden = true;
    launcher.hidden = false;
    tourOpen = false;
    markCompleted();

    window.removeEventListener("resize", scheduleReposition);
    window.removeEventListener("scroll", scheduleReposition, true);

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

    inTour("#mbTourNext").focus({ preventScroll: true });
  }

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

  document.addEventListener("keydown", event => {
    if (!tourOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour();
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

  /* ==========================================================
     9. AUTOMATIC FIRST-VISIT TOUR
     Each page gets its own completed marker.
     ========================================================== */

  function startIfNewVisitor() {
    if (completed()) return;

    window.setTimeout(() => {
      if (!tourOpen) openTour();
    }, 850);
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

  /* ==========================================================
     10. CONNECT EXISTING GUIDE AND SMART ASSIST AVATARS
     ========================================================== */

  setupAvatars();

  /*
    buyer-guide.js can create its floating panel after this script.
    Observe the page briefly and add our avatar when the panel appears.
  */

  const observer = new MutationObserver(() => {
    addGuideAvatar();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.setTimeout(() => {
    observer.disconnect();
    setupAvatars();
  }, 5000);

  console.info("MavunoBridge animated tour ready.");
})();
