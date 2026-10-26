
/* ==========================================================
   MAVUNOBRIDGE — ANIMATED WEBSITE TOUR + FARMER ASSISTANT
   Features:
   - Skippable guided website tour
   - Back, Next and Finish navigation
   - First-visit tutorial per page
   - Floating button to replay the tutorial
   - Animated farmer avatar in the tour
   - Animated avatar in Buyer + Farmer Guide
   - Animated farmer inside Smart Assist
   - Sheng + English, English and Kiswahili descriptions
   - Responsive layout and reduced-motion support
   ========================================================== */

(() => {
  "use strict";

  if (window.__MAVUNO_WEBSITE_TOUR_V2__) return;
  window.__MAVUNO_WEBSITE_TOUR_V2__ = true;

  const PAGE =
    (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const STORAGE_KEY = "mavunobridge_tour_completed_v2";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  /* ==========================================================
     1. LANGUAGE
     ========================================================== */

  function currentLanguage() {
    const value = $("#languageSelect")?.value;

    if (["mix", "en", "sw"].includes(value)) return value;

    try {
      const saved =
        localStorage.getItem("mavunobridge_language_v1") ||
        localStorage.getItem("mavunobridge_language_v2") ||
        localStorage.getItem("shambamarket_language_v2");

      if (["mix", "en", "sw"].includes(saved)) return saved;
    } catch {}

    return "mix";
  }

  function phrase(en, mix, sw) {
    return { en, mix, sw };
  }

  function text(value) {
    if (typeof value === "string") return value;

    const language = currentLanguage();
    return value?.[language] || value?.mix || value?.en || "";
  }

  function tourStep(target, title, description) {
    return { target, title, description };
  }

  /* ==========================================================
     2. FARMER AVATAR
     This SVG is embedded locally. No image file is required.
     ========================================================== */

  const FARMER_SVG = `
    <svg
      class="mb-farmer-art"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Illustrated Kenyan farming assistant"
    >
      <circle cx="60" cy="60" r="59" fill="#e6f5e8"/>

      <path d="M13 91 Q7 66 24 58 Q30 78 13 91Z"
        fill="#83bf83"/>
      <path d="M101 92 Q119 69 102 57 Q91 79 101 92Z"
        fill="#a5d59a"/>

      <path d="M26 120 Q28 86 47 79 L74 79 Q94 87 96 120Z"
        fill="#246548"/>

      <path d="M49 83 L60 96 L71 83"
        fill="none" stroke="#d2ead0" stroke-width="3"
        stroke-linecap="round"/>

      <path d="M49 65 L49 82 Q60 91 72 81 L71 65Z"
        fill="#9b5937"/>

      <g class="mb-farmer-wave">
        <path d="M80 88 Q87 74 92 59 L98 43 Q101 36 107 40
          Q112 43 108 51 L102 70 Q99 88 90 98Z"
          fill="#9b5937"/>

        <path d="M98 45 Q91 37 95 32 Q99 29 103 37
          Q107 28 111 33 Q114 37 108 44"
          fill="#a96843"/>
      </g>

      <circle cx="37" cy="52" r="7" fill="#a96843"/>
      <circle cx="83" cy="52" r="7" fill="#a96843"/>

      <ellipse cx="60" cy="51" rx="25" ry="29" fill="#b8754d"/>

      <path d="M35 47 Q32 23 57 22 Q81 21 85 46
        L77 39 L44 39Z"
        fill="#3d3025"/>

      <g class="mb-farmer-eyes">
        <ellipse cx="50" cy="52" rx="2.5" ry="3.2" fill="#29251f"/>
        <ellipse cx="70" cy="52" rx="2.5" ry="3.2" fill="#29251f"/>
      </g>

      <path d="M51 64 Q60 72 70 63"
        fill="none" stroke="#6c3229" stroke-width="2.6"
        stroke-linecap="round"/>

      <path d="M34 35 Q36 12 60 12 Q82 13 86 35Z"
        fill="#367d4b"/>

      <ellipse cx="60" cy="35" rx="34" ry="7" fill="#205e3b"/>

      <path d="M49 19 Q57 6 69 17 Q61 16 58 27 Q55 20 49 19Z"
        fill="#a6d969"/>

      <path d="M59 26 Q62 18 69 17"
        fill="none" stroke="#e2f6c8" stroke-width="2"
        stroke-linecap="round"/>

      <circle cx="60" cy="105" r="9" fill="#d7efaa"/>

      <path d="M60 111 Q59 102 64 99 M60 106 Q54 100 52 103"
        fill="none" stroke="#246548" stroke-width="2"
        stroke-linecap="round"/>
    </svg>
  `;

  /* ==========================================================
     3. TOUR CONTENT BY PAGE
     ========================================================== */

  const TOURS = {
    "index.html": [
      tourStep(
        ".topbar",
        phrase("Welcome to MavunoBridge", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
        phrase(
          "Use the navigation to visit Marketplace, Smart Assist, SACCO Hub, Buyer Requests and Messages. You can also change your preferred language.",
          "Tumia navigation kufungua Marketplace, Smart Assist, SACCO Hub, Buyer Requests na Messages. Unaweza pia kubadilisha lugha.",
          "Tumia menyu kufungua Marketplace, Smart Assist, SACCO Hub, Buyer Requests na Messages. Unaweza pia kubadilisha lugha."
        )
      ),

      tourStep(
        ["#categoryGrid .category-card", "#categories"],
        phrase("Browse product categories", "Chagua category ya bidhaa unataka.", "Chagua kundi la bidhaa."),
        phrase(
          "Choose All Products or a category such as Fruits, Vegetables, Grains, Legumes, Livestock, Farm Tools and other agricultural products.",
          "Chagua All Products ama category kama Fruits, Vegetables, Grains, Legumes, Livestock ama Farm Tools.",
          "Chagua bidhaa zote au kundi kama matunda, mboga, nafaka, mikunde, mifugo au zana za kilimo."
        )
      ),

      tourStep(
        ".filters",
        phrase("Search and filter products", "Tafuta bidhaa na upunguze results.", "Tafuta na uchuje bidhaa."),
        phrase(
          "Search by name, choose a category or county, filter by retail or bulk sales, use the illustrative price guide and sort by price or date. Clear filters resets your choices.",
          "Search kwa jina, chagua category au county, filter retail/bulk, angalia price guide na sort kwa bei ama tarehe. Clear filters inaanza upya.",
          "Tafuta kwa jina, chagua kundi au kaunti, chuja retail/bulk, tumia mwongozo wa bei na panga kwa bei au tarehe."
        )
      ),

      tourStep(
        ["#listingGrid .product-card", "#listingGrid"],
        phrase("Compare product listings", "Angalia details za listing kabla ya kununua.", "Linganisha matangazo."),
        phrase(
          "Cards show available demo product details, location, price and quantity. Depending on the card, you may see Call, Message or Add to cart. Verify real stock, quality and terms before a real purchase.",
          "Cards zinaonyesha product, location, bei na quantity. Unaweza kuona Call, Message ama Add to cart. Thibitisha stock na quality kabla ya kununua.",
          "Kadi zinaonyesha bidhaa, eneo, bei na kiasi. Unaweza kuona Call, Message au Add to cart. Thibitisha bidhaa na masharti kabla ya kununua."
        )
      ),

      tourStep(
        "#sellButton",
        phrase("Create a listing", "Farmer? Weka bidhaa yako sokoni hapa.", "Tengeneza tangazo."),
        phrase(
          "Choose the category and county, enter the product name, quantity, price and contact details, add a photo if available, then publish. In this demo, new listings are stored in this browser only.",
          "Chagua category na county, weka product name, quantity, bei na contact. Ongeza picha kama iko, then publish. Listing inabaki kwa browser hii.",
          "Chagua kundi na kaunti, weka jina la bidhaa, kiasi, bei na mawasiliano. Ongeza picha ukinayo, kisha uchapishe. Katika demo, tangazo hubaki kwenye kivinjari hiki."
        )
      ),

      tourStep(
        "#cartButton",
        phrase("Use your cart", "Cart inakusaidia ku-review items ulizochagua.", "Tumia kikapu chako."),
        phrase(
          "Open Cart to review or remove selected products. The demo cart does not accept payments, reserve stock or create real orders.",
          "Fungua Cart kuona ama kuondoa products ulizochagua. Cart ya demo haichukui malipo wala kuweka order halisi.",
          "Fungua kikapu kukagua au kuondoa bidhaa ulizochagua. Kikapu cha demo hakipokei malipo wala kuweka oda halisi."
        )
      ),

      tourStep(
        'a[href="smart-assist.html"]',
        phrase("Smart Assist", "Pata crop guidance na farm report.", "Msaidizi wa kilimo."),
        phrase(
          "Choose a crop, add farm details, select symptoms and create a farm report. Ask follow-up questions and browse the crop library. Photo previews do not themselves identify a pest or disease.",
          "Chagua crop, weka details za shamba na symptoms, kisha generate report. Uliza maswali na browse crop library. Photo preview peke yake haitambui ugonjwa.",
          "Chagua zao, weka maelezo ya shamba na dalili, kisha tengeneza ripoti. Uliza maswali na soma mwongozo wa mazao. Kuonyesha picha pekee hakutambui ugonjwa."
        )
      ),

      tourStep(
        'a[href="sacco.html"]',
        phrase("SACCO Hub", "Explore sample farmer groups na opportunities.", "SACCO Hub."),
        phrase(
          "Search or filter sample opportunities and save ones you wish to investigate. Entries are demonstration concepts, not verified SACCO offers or official applications.",
          "Search ama filter sample opportunities, kisha save interest. Hizi ni examples tu, si offers zilizothibitishwa.",
          "Tafuta au chuja mifano ya fursa na uhifadhi unazotaka kuchunguza. Hizi si ofa zilizothibitishwa au maombi rasmi."
        )
      ),

      tourStep(
        'a[href="buyer-requests.html"]',
        phrase("Buyer Requests", "Wanunuzi wanaweza kuweka wanachohitaji.", "Maombi ya wanunuzi."),
        phrase(
          "Buyers can describe a product, quantity, county and other useful details. This demo does not guarantee that a real farmer receives or fulfils a request.",
          "Buyer anaweza kuweka product, quantity na county. Demo haihakikishi kuwa farmer halisi atapata ama kutimiza ombi.",
          "Mnunuzi anaweza kueleza bidhaa, kiasi na kaunti. Demo haihakikishi kuwa mkulima halisi atapokea au kutimiza ombi."
        )
      ),

      tourStep(
        'a[href="messages.html"]',
        phrase("Messages", "Jaribu demo chat hapa.", "Ujumbe."),
        phrase(
          "Choose a sample contact and test the chat. Replies are simulated and are not delivered to real sellers or other visitors.",
          "Chagua sample contact na ujaribu chat. Replies zina-simulate tu; hazitumwi kwa sellers halisi.",
          "Chagua mtu wa mfano na ujaribu mazungumzo. Majibu yanaigwa na hayafikii wauzaji halisi."
        )
      ),

      tourStep(
        ".demo-note",
        phrase("Remember: this is a demo", "Kumbuka hii ni demo ya science fair.", "Kumbuka: huu ni mfano."),
        phrase(
          "Some listings, saved reports, interests and messages are stored locally in this browser. Price ranges are illustrative, and the sign-in flow is not production authentication. Never enter real passwords or payment PINs.",
          "Listings, reports na messages zinaweza kubaki kwa browser hii. Bei ni examples na sign-in ni demo. Usitumie password au PIN halisi.",
          "Baadhi ya matangazo, ripoti na ujumbe huhifadhiwa kwenye kivinjari hiki. Bei ni za mfano na kuingia ni demo. Usitumie nenosiri au PIN halisi."
        )
      )
    ],

    "smart-assist.html": [
      tourStep(
        ".sa-hero",
        phrase("Welcome to Smart Assist", "Karibu kwa Smart Assist!", "Karibu Smart Assist!"),
        phrase(
          "Explore crop planning, symptom matching, farm reports, follow-up questions and crop guides. Built-in recommendations are demo guidance, not confirmed diagnoses or live weather data.",
          "Hapa kuna crop planner, symptom matching, farm report na crop guides. Ni demo guidance, si live weather wala diagnosis ya uhakika.",
          "Hapa kuna mpango wa mazao, kulinganisha dalili, ripoti na mwongozo. Haya ni maelekezo ya demo, si utabiri wa moja kwa moja au utambuzi wa uhakika."
        )
      ),

      tourStep(
        "#farmPlanner",
        phrase("Step 1: Describe your farm", "Chagua county, crop na hali ya shamba.", "Hatua ya 1: Eleza shamba."),
        phrase(
          "Choose your county and crop. Add the growth stage, main concern, soil and water details if known. Farm size and extra notes are optional.",
          "Chagua county na crop. Jaza stage, concern, soil na maji kama unajua. Farm size na notes ni optional.",
          "Chagua kaunti na zao. Weka hatua ya ukuaji, tatizo, udongo na maji kama unajua. Ukubwa na maelezo ya ziada si lazima."
        )
      ),

      tourStep(
        ["#saSymptomChecks", ".sa-symptom-field"],
        phrase("Step 2: Select symptoms", "Tick dalili unazoona kwa crop.", "Hatua ya 2: Chagua dalili."),
        phrase(
          "Select visible signs and describe the problem in the text box. The starter library compares signs and text with possible crop-health matches. Results are suggestions, not a diagnosis.",
          "Tick symptoms na ueleze tatizo kwa text box. Mfumo hulinganisha na starter library; results ni possibilities, si diagnosis.",
          "Chagua dalili zinazoonekana na ueleze tatizo. Mfumo hulinganisha na orodha ya mwanzo; matokeo ni mapendekezo, si utambuzi wa uhakika."
        )
      ),

      tourStep(
        "#saPhoto",
        phrase("Step 3: Add a crop photo", "Unaweza upload picha ya sehemu imeathirika.", "Hatua ya 3: Weka picha."),
        phrase(
          "Choose a clear image of the affected leaf, stem, fruit or root. This page can preview the image; automatic image recognition needs a connected image-analysis service.",
          "Upload picha clear ya leaf, stem ama fruit. Preview inafanya kazi, lakini image recognition inahitaji service kuunganishwa.",
          "Pakia picha iliyo wazi ya jani, shina, tunda au mzizi. Utambuzi wa picha unahitaji huduma tofauti iliyounganishwa."
        )
      ),

      tourStep(
        ["#generateReportButton", "#reportSection"],
        phrase("Step 4: Generate a farm report", "Generate report upate summary na next steps.", "Hatua ya 4: Tengeneza ripoti."),
        phrase(
          "Review possible matches, growing tips and suggested next steps. You can save the report on this device, download text or print/save as PDF.",
          "Soma possible matches, growing tips na next steps. Unaweza kuhifadhi kwa device hii, kupakua text au kuchapisha PDF.",
          "Soma uwezekano, maelekezo ya kilimo na hatua zinazofuata. Unaweza kuhifadhi kwenye kifaa hiki, kupakua maandishi au kuchapisha PDF."
        )
      ),

      tourStep(
        "#saQuestionForm",
        phrase("Step 5: Ask a farm question", "Uliza kuhusu maji, pests, soil ama harvest.", "Hatua ya 5: Uliza swali."),
        phrase(
          "Choose a suggested question or type your own. If no AI service is connected, answers use the built-in guidance library and may not cover every situation.",
          "Chagua swali lililopendekezwa ama andika lako. Bila AI service, majibu hutumia built-in guidance.",
          "Chagua swali lililopendekezwa au andika lako. Bila huduma ya AI, majibu hutumia maelekezo yaliyowekwa."
        )
      ),

      tourStep(
        ["#saCropLibraryGrid", ".sa-library-controls"],
        phrase("Step 6: Explore crop guides", "Search crops na filter kwa group ama county.", "Hatua ya 6: Mwongozo wa mazao."),
        phrase(
          "Search for a crop and filter by group or county context. Use a crop card's button to select that crop in the planner.",
          "Search crop na filter group ama county. Button ya crop card itachagua crop kwa planner.",
          "Tafuta zao na uchuje kwa kundi au kaunti. Kitufe cha kadi kitachagua zao kwenye mpango."
        )
      ),

      tourStep(
        "#savedReportsSection",
        phrase("Step 7: Saved reports", "Reports ulizohifadhi zinapatikana hapa.", "Hatua ya 7: Ripoti zilizohifadhiwa."),
        phrase(
          "Open a saved report to review it or delete it. Saved reports stay in this browser and do not automatically sync to other devices.",
          "Fungua report kuona ama kufuta. Reports hubaki kwa browser hii na hazisync kwa devices zingine.",
          "Fungua ripoti kuitazama au kuifuta. Ripoti hubaki kwenye kivinjari hiki na haziunganishwi kiotomatiki na vifaa vingine."
        )
      )
    ],

    "sacco.html": [
      tourStep(
        ".page-hero",
        phrase("Welcome to SACCO Hub", "Karibu SACCO Hub!", "Karibu SACCO Hub!"),
        phrase(
          "Explore sample farmer groups, cooperative concepts and agricultural opportunity ideas. The entries are demonstrations, not verified offers.",
          "Explore sample farmer groups na opportunities. Hizi ni examples, si offers zilizothibitishwa.",
          "Vinjari mifano ya vikundi vya wakulima na fursa za kilimo. Hizi ni za majaribio, si ofa zilizothibitishwa."
        )
      ),
      tourStep(
        ".sacco-controls",
        phrase("Search opportunities", "Tafuta kwa jina, county ama type.", "Tafuta fursa."),
        phrase(
          "Search by name or place and filter by opportunity type to narrow the examples.",
          "Search kwa jina au eneo na filter kwa type ya opportunity.",
          "Tafuta kwa jina au eneo na uchuje kwa aina ya fursa."
        )
      ),
      tourStep(
        ["#saccoGrid .sacco-card", "#saccoGrid"],
        phrase("Save an interest", "Bonyeza Save interest kwa fursa unayopenda.", "Hifadhi fursa."),
        phrase(
          "Read a card and save an interest to keep it in your browser. This does not send an official application or contact a real cooperative.",
          "Soma card kisha Save interest. Hii haiwasilishi application rasmi wala kuwasiliana na SACCO halisi.",
          "Soma kadi kisha hifadhi unayopendezwa nayo. Hii haiwasilishi maombi rasmi wala kuwasiliana na chama halisi."
        )
      ),
      tourStep(
        ".interest-panel",
        phrase("Review saved interests", "Hapa utaona opportunities ulizohifadhi.", "Kagua fursa ulizohifadhi."),
        phrase(
          "Review saved opportunities. Before joining or paying a real organisation, independently confirm its registration, eligibility, fees and terms.",
          "Kagua interests ulizohifadhi. Kabla ya kujiunga au kulipa, verify registration, fees na terms.",
          "Kagua fursa ulizohifadhi. Kabla ya kujiunga au kulipa, thibitisha usajili, ada na masharti."
        )
      )
    ],

    "buyer-requests.html": [
      tourStep(
        ".page-hero",
        phrase("Welcome to Buyer Requests", "Karibu Buyer Requests!", "Karibu Buyer Requests!"),
        phrase(
          "This board lets buyers describe the produce or agricultural items they need. It is a demonstration request board, not a live ordering system.",
          "Hii ni board ya buyers kuweka bidhaa wanazohitaji. Ni demo, si live order system.",
          "Ukurasa huu huwawezesha wanunuzi kueleza bidhaa wanazohitaji. Ni mfano tu, si mfumo halisi wa oda."
        )
      ),
      tourStep(
        "#demandForm",
        phrase("Post a buyer request", "Weka product, county na quantity.", "Weka ombi la bidhaa."),
        phrase(
          "Enter the product and county, then add quantity, sale type and extra details if helpful. Share contact details only if you're comfortable displaying them in a demo.",
          "Weka product na county, ongeza quantity na details. Weka contact tu kama uko sawa kuionyesha kwa demo.",
          "Weka bidhaa na kaunti, kisha ongeza kiasi na maelezo. Weka mawasiliano tu ikiwa uko tayari kuyaonyesha kwenye demo."
        )
      ),
      tourStep(
        "#demandList",
        phrase("Browse current requests", "Angalia requests zilizopo.", "Vinjari maombi."),
        phrase(
          "Review sample requests. New requests are generally stored in this browser only, so other visitors may not see them on their devices.",
          "Review requests zilizopo. Requests mpya hubaki kwa browser hii, kwa hiyo wengine huenda wasizione.",
          "Kagua maombi yaliyopo. Maombi mapya huhifadhiwa kwenye kivinjari hiki pekee, kwa hiyo wengine huenda wasiyaone."
        )
      ),
      tourStep(
        "#supportForm",
        phrase("Save a support note", "Hifadhi reminder ama swali.", "Hifadhi dokezo."),
        phrase(
          "Support notes are local reminders for the demo. They are not sent to a support team; don't enter passwords or sensitive information.",
          "Support notes ni reminders tu, hazitumwi kwa support team. Usiweke password ama data nyeti.",
          "Dokezo ni vikumbusho tu na havitumwi kwa timu ya usaidizi. Usiweke nenosiri au taarifa nyeti."
        )
      )
    ],

    "messages.html": [
      tourStep(
        ".messages-notice",
        phrase("Messages demo", "Kumbuka replies ni simulated.", "Ujumbe wa demo."),
        phrase(
          "The chat uses sample contacts and simulated replies. Messages are not delivered to real sellers or other visitors.",
          "Chat hutumia sample contacts na simulated replies. Messages hazifiki kwa sellers halisi.",
          "Mazungumzo hutumia watu wa mfano na majibu ya kuigiza. Ujumbe haupelekwi kwa wauzaji halisi."
        )
      ),
      tourStep(
        [".conversation-sidebar", "#conversationList"],
        phrase("Choose a conversation", "Chagua sample contact kwa sidebar.", "Chagua mazungumzo."),
        phrase(
          "Select a sample contact to open a conversation. You can return to Marketplace to review the product and seller details.",
          "Chagua sample contact kufungua chat. Unaweza kurudi Marketplace kukagua product na seller.",
          "Chagua mtu wa mfano kufungua mazungumzo. Unaweza kurudi sokoni kukagua bidhaa na muuzaji."
        )
      ),
      tourStep(
        ".conversation-panel",
        phrase("Read the conversation", "Messages zitaonekana hapa.", "Soma mazungumzo."),
        phrase(
          "Read the conversation and simulated replies in this panel. Never share payment PINs, passwords or private documents.",
          "Soma messages na replies hapa. Usi-share PIN za malipo, passwords ama documents za private.",
          "Soma ujumbe na majibu hapa. Usishiriki PIN za malipo, manenosiri au hati za faragha."
        )
      ),
      tourStep(
        "#messageForm",
        phrase("Write a message", "Type message kisha bonyeza Send.", "Andika ujumbe."),
        phrase(
          "Choose a conversation, enter your question and press Send. Real messaging between separate visitors would require a connected backend.",
          "Chagua conversation, andika swali kisha bonyeza Send. Messaging halisi inahitaji backend.",
          "Chagua mazungumzo, andika swali kisha bonyeza Tuma. Ujumbe halisi kati ya watumiaji unahitaji backend."
        )
      )
    ],

    "login.html": [
      tourStep(
        ".auth-visual",
        phrase("Welcome to the sign-in demo", "Karibu kwa demo ya sign-in.", "Karibu kwenye mfano wa kuingia."),
        phrase(
          "This page demonstrates a sign-in flow. You can return to the marketplace without signing in.",
          "Hii inaonyesha mfano wa sign-in. Unaweza kurudi Marketplace bila kuingia.",
          "Ukurasa huu unaonyesha mfano wa kuingia. Unaweza kurudi sokoni bila kuingia."
        )
      ),
      tourStep(
        "#demoLoginForm",
        phrase("Demo account details", "Tumia details za mfano pekee.", "Maelezo ya akaunti ya demo."),
        phrase(
          "The demo flow does not create a real account. Do not reuse a real password or provide sensitive personal information.",
          "Hii haifungui account halisi. Usitumie password yako halisi ama data nyeti.",
          "Huu si usajili wa akaunti halisi. Usitumie nenosiri lako halisi au taarifa nyeti."
        )
      ),
      tourStep(
        "#googleDemoButton",
        phrase("Google-style demo button", "Hii ni account chooser ya mfano.", "Kitufe cha mfano cha Google."),
        phrase(
          "The Google-style button opens a simulated account chooser. It is not real Google authentication.",
          "Kitufe hiki kinaonyesha account chooser ya mfano, si Google authentication halisi.",
          "Kitufe hiki huonyesha kisanduku cha akaunti cha mfano, si uthibitishaji halisi wa Google."
        )
      ),
      tourStep(
        "#loginNotice",
        phrase("Continue safely", "Unaweza kuendelea bila sign-in.", "Endelea kwa usalama."),
        phrase(
          "Demo details stay in this browser. Use the option to continue browsing without signing in if you prefer.",
          "Demo details hubaki kwa browser hii. Unaweza kuendelea browsing bila sign-in.",
          "Maelezo ya demo hubaki kwenye kivinjari hiki. Unaweza kuendelea kuvinjari bila kuingia."
        )
      )
    ]
  };

  const DEFAULT_TOUR = [
    tourStep(
      ".topbar",
      phrase("Welcome to MavunoBridge", "Karibu MavunoBridge!", "Karibu MavunoBridge!"),
      phrase(
        "Use the navigation to explore the marketplace and farming tools. Reopen this tour anytime using the floating button.",
        "Tumia navigation kuchunguza marketplace na farming tools. Unaweza kufungua tour tena kwa button ya chini.",
        "Tumia menyu kuchunguza soko na zana za kilimo. Unaweza kufungua mwongozo tena kwa kitufe cha chini."
      )
    ),
    tourStep(
      "main",
      phrase("Explore this page", "Angalia sections za page hii.", "Chunguza ukurasa huu."),
      phrase(
        "Use the page's search, form and action buttons where available. Some functions in this demonstration store data only in this browser.",
        "Tumia search, form na buttons zilizopo. Features kadhaa huhifadhi data kwa browser hii tu.",
        "Tumia utafutaji, fomu na vitufe vilivyopo. Vipengele kadhaa huhifadhi data kwenye kivinjari hiki pekee."
      )
    )
  ];

  function getTourSteps() {
    return TOURS[PAGE] || DEFAULT_TOUR;
  }

  /* ==========================================================
     4. STYLES: TOUR + ANIMATED FARMER
     ========================================================== */

  const styles = document.createElement("style");

  styles.textContent = `
    .mb-tour-launcher {
      position: fixed;
      left: 18px;
      bottom: 18px;
      z-index: 10030;
      max-width: calc(100vw - 28px);
      padding: 12px 16px;
      border: 1px solid #d4e7d9;
      border-radius: 999px;
      background: #fff;
      color: #134c39;
      font: 800 12px/1.2 system-ui,sans-serif;
      box-shadow: 0 8px 26px #142d1b2b;
      cursor: pointer;
      transition: transform .18s ease, background .18s ease;
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
      inset: 0;
      z-index: 10020;
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
        0 0 0 2px rgba(255,255,255,.95),
        0 0 28px rgba(145,231,164,.3);
      pointer-events: none;
      transition: top .2s ease, left .2s ease,
        width .2s ease, height .2s ease;
    }

    .mb-tour-card {
      position: fixed;
      left: 50%;
      bottom: max(16px,env(safe-area-inset-bottom));
      z-index: 10022;
      width: min(580px,calc(100vw - 24px));
      max-height: min(390px,calc(100dvh - 28px));
      overflow-y: auto;
      transform: translateX(-50%);
      padding: 17px 19px 15px;
      border: 1px solid #d7e6da;
      border-radius: 18px;
      background: #fff;
      color: #1b3226;
      box-shadow: 0 18px 70px rgba(0,0,0,.26);
      font-family: system-ui,-apple-system,"Segoe UI",sans-serif;
      pointer-events: auto;
    }

    .mb-tour-card * {
      box-sizing: border-box;
    }

    .mb-tour-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      margin: 0 0 15px;
      border-radius: 99px;
      background: #e8f0e9;
    }

    .mb-tour-progress span {
      display: block;
      height: 100%;
      width: 0;
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

    .mb-tour-farmer {
      display: grid;
      width: 83px;
      height: 83px;
      place-items: center;
      overflow: hidden;
      border: 1px solid #d3ead7;
      border-radius: 23px;
      background: linear-gradient(145deg,#eaf8e9,#cce9d0);
      box-shadow: 0 5px 15px rgba(25,91,52,.12);
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-farmer-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
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
      color: white;
    }

    .mb-tour-next:hover {
      background: #0b3d2b;
      color: white;
    }

    .mb-tour-close {
      display: grid;
      width: 31px;
      height: 31px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid #e0e9e1;
      border-radius: 50%;
      background: #fff;
      color: #516a59;
      font-size: 18px;
      cursor: pointer;
    }

    /* Farmer avatar in the floating Buyer + Farmer Guide. */

    .mb-guide-head {
      gap: 10px !important;
    }

    .mb-guide-farmer {
      display: grid;
      width: 43px;
      height: 43px;
      flex: 0 0 auto;
      place-items: center;
      overflow: hidden;
      border: 1px solid #b9dfc1;
      border-radius: 13px;
      background: #e6f5e8;
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .mb-guide-farmer .mb-farmer-art {
      width: 100%;
      height: 100%;
    }

    .mb-guide-head .mb-guide-head-copy {
      flex: 1;
      min-width: 0;
    }

    /* Farmer avatar inside Smart Assist. */

    .sa-assistant-avatar.mb-smart-farmer-avatar {
      position: relative;
      display: grid;
      width: 68px;
      height: 68px;
      flex: 0 0 auto;
      place-items: center;
      overflow: visible;
      border: 2px solid #bde2c6;
      border-radius: 20px;
      background: linear-gradient(145deg,#eff9e9,#cce9d0);
      box-shadow: 0 7px 19px rgba(25,91,52,.12);
      animation: mbFarmerFloat 3s ease-in-out infinite;
    }

    .sa-assistant-avatar.mb-smart-farmer-avatar .mb-farmer-art {
      width: 100%;
      height: 100%;
      overflow: visible;
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

  document.head.appendChild(styles);

  /* ==========================================================
     5. ADD FARMER TO BUYER + FARMER GUIDE
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

  /* ==========================================================
     6. ADD FARMER TO SMART ASSIST
     ========================================================== */

  function addSmartAssistAvatar() {
    if (PAGE !== "smart-assist.html") return;

    const avatar = $(".sa-assistant-avatar");
    if (!avatar) return;

    avatar.classList.add("mb-smart-farmer-avatar");
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", "Animated MavunoBridge farm assistant");
    avatar.innerHTML = FARMER_SVG;

    const intro = $(".sa-assistant-intro");
    if (!intro || $(".mb-smart-farmer-status", intro)) return;

    const status = document.createElement("span");
    status.className = "mb-smart-farmer-status";
    status.textContent = currentLanguage() === "sw"
      ? "MSAIDIZI WA SHAMBA"
      : "FARM BUDDY · READY";

    const heading = $("#assistantWelcome", intro) || $("h3", intro);

    if (heading) {
      heading.parentNode.insertBefore(status, heading);
    } else {
      intro.appendChild(status);
    }
  }

  function setupExistingGuides() {
    addGuideAvatar();
    addSmartAssistAvatar();
  }

  /* buyer-guide.js is normally loaded before this file. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupExistingGuides, {
      once: true
    });
  } else {
    setupExistingGuides();
  }

  /* ==========================================================
     7. CREATE TOUR BUTTON
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

    <section
      class="mb-tour-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mbTourTitle"
      aria-describedby="mbTourText"
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
          aria-label="Skip tutorial"
        >×</button>
      </div>

      <div class="mb-tour-progress">
        <span id="mbTourProgress"></span>
      </div>

      <div class="mb-tour-guide-row">
        <div
          class="mb-tour-farmer"
          role="img"
          aria-label="Animated farmer assistant"
        >
          ${FARMER_SVG}
        </div>

        <div class="mb-tour-guide-copy">
          <span class="mb-tour-speaking">YOUR FARMING GUIDE</span>
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

  let steps = getTourSteps();
  let index = 0;
  let lastFocused = null;
  let animationFrame = 0;
  let tourOpen = false;

  /* ==========================================================
     8. FIND THE ELEMENT TO HIGHLIGHT
     ========================================================== */

  function getTarget(selectors) {
    if (!selectors) return null;

    const list = Array.isArray(selectors)
      ? selectors
      : [selectors];

    for (const selector of list) {
      try {
        const target = $(selector);

        if (target && target.getClientRects().length) {
          return target;
        }
      } catch (error) {
        console.warn("Invalid website tour selector:", selector);
      }
    }

    return null;
  }

  function shade(name, left, top, width, height) {
    const element = shades[name];

    element.style.left = `${Math.max(0, left)}px`;
    element.style.top = `${Math.max(0, top)}px`;
    element.style.width = `${Math.max(0, width)}px`;
    element.style.height = `${Math.max(0, height)}px`;
  }

  function spotlight(target) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!target) {
      shade("top", 0, 0, vw, vh);
      shade("left", 0, 0, 0, 0);
      shade("right", 0, 0, 0, 0);
      shade("bottom", 0, 0, 0, 0);

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
      spotlight(null);
      return;
    }

    const padding = 7;
    const left = Math.max(4, rect.left - padding);
    const top = Math.max(4, rect.top - padding);
    const right = Math.min(vw - 4, rect.right + padding);
    const bottom = Math.min(vh - 4, rect.bottom + padding);

    shade("top", 0, 0, vw, top);
    shade("left", 0, top, left, bottom - top);
    shade("right", right, top, vw - right, bottom - top);
    shade("bottom", 0, bottom, vw, vh - bottom);

    focusRing.hidden = false;
    focusRing.style.left = `${left}px`;
    focusRing.style.top = `${top}px`;
    focusRing.style.width = `${right - left}px`;
    focusRing.style.height = `${bottom - top}px`;

    focusRing.style.borderRadius =
      getComputedStyle(target).borderRadius || "10px";
  }

  function reposition() {
    if (!tourOpen || animationFrame) return;

    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      spotlight(getTarget(steps[index]?.target));
    });
  }

  /* ==========================================================
     9. LANGUAGE-AWARE BUTTON LABELS
     ========================================================== */

  function buttonLabels() {
    const language = currentLanguage();

    const translations = {
      en: {
        step: "Step",
        skip: "Skip tutorial",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        speaking: "YOUR FARMING GUIDE"
      },

      mix: {
        step: "Step",
        skip: "Skip tutorial",
        back: "Back",
        next: "Next →",
        finish: "Finish ✓",
        speaking: "YOUR FARMING GUIDE"
      },

      sw: {
        step: "Hatua",
        skip: "Ruka mwongozo",
        back: "Nyuma",
        next: "Ifuatayo →",
        finish: "Maliza ✓",
        speaking: "MSAIDIZI WAKO WA KILIMO"
      }
    };

    return translations[language] || translations.mix;
  }

  function renderStep(shouldScroll = true) {
    if (!steps.length) return;

    index = Math.max(0, Math.min(index, steps.length - 1));

    const current = steps[index];
    const labels = buttonLabels();
    const target = getTarget(current.target);

    inTour("#mbTourTitle").textContent = text(current.title);
    inTour("#mbTourText").textContent = text(current.description);

    inTour("#mbTourCount").textContent =
      `${labels.step} ${index + 1} / ${steps.length}`;

    inTour("#mbTourProgress").style.width =
      `${((index + 1) / steps.length) * 100}%`;

    inTour("#mbTourSkip").textContent = labels.skip;
    inTour("#mbTourBack").textContent = labels.back;
    inTour("#mbTourBack").disabled = index === 0;

    inTour("#mbTourNext").textContent =
      index === steps.length - 1 ? labels.finish : labels.next;

    inTour(".mb-tour-speaking").textContent = labels.speaking;

    if (shouldScroll && target) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    window.setTimeout(
      () => spotlight(getTarget(steps[index]?.target)),
      shouldScroll && target ? 320 : 0
    );
  }

  /* ==========================================================
     10. OPEN, CLOSE, SKIP, BACK AND FINISH
     ========================================================== */

  function setCompleted() {
    try {
      localStorage.setItem(`${STORAGE_KEY}:${PAGE}`, "1");
    } catch {}
  }

  function closeTour(completed = true) {
    layer.hidden = true;
    launcher.hidden = false;
    tourOpen = false;

    if (completed) setCompleted();

    window.removeEventListener("resize", reposition);
    window.removeEventListener("scroll", reposition, true);

    if (lastFocused && typeof lastFocused.focus === "function") {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch {}
    }
  }

  function openTour() {
    lastFocused = document.activeElement;
    steps = getTourSteps();
    index = 0;
    tourOpen = true;

    layer.hidden = false;
    launcher.hidden = true;

    renderStep(true);

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    inTour("#mbTourNext").focus({ preventScroll: true });
  }

  launcher.addEventListener("click", openTour);

  inTour("#mbTourClose").addEventListener("click", () => {
    closeTour(true);
  });

  inTour("#mbTourSkip").addEventListener("click", () => {
    closeTour(true);
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
      closeTour(true);
    }
  });

  document.addEventListener("keydown", event => {
    if (!tourOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour(true);
    } else if (event.key === "ArrowRight" && index < steps.length - 1) {
      index += 1;
      renderStep(true);
    } else if (event.key === "ArrowLeft" && index > 0) {
      index -= 1;
      renderStep(true);
    }
  });

  $("#languageSelect")?.addEventListener("change", () => {
    setupExistingGuides();

    if (tourOpen) renderStep(false);
  });

  /* ==========================================================
     11. FIRST VISIT AUTO-START
     Each page has its own completion record.
     ========================================================== */

  function autoStartIfNeeded() {
    let completed = false;

    try {
      completed = localStorage.getItem(`${STORAGE_KEY}:${PAGE}`) === "1";
    } catch {}

    if (completed) return;

    window.setTimeout(() => {
      if (!tourOpen) openTour();
    }, 850);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoStartIfNeeded, {
      once: true
    });
  } else {
    autoStartIfNeeded();
  }

  /* ==========================================================
     12. KEEP THE GUIDE AVATAR IN PLACE
     buyer-guide.js may build its panel after this script.
     ========================================================== */

  const guideObserver = new MutationObserver(() => {
    addGuideAvatar();
  });

  guideObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  /* Disconnect after the guide has had time to initialise. */
  window.setTimeout(() => {
    guideObserver.disconnect();
    setupExistingGuides();
  }, 5000);

  console.info("MavunoBridge animated website tour ready.");
})();
