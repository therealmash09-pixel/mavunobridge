
/* ============================================================
   MAVUNOBRIDGE — ANIME FARMER TOUR
   Complete replacement: website-tour.js

   FEATURES
   - Four anime-style farmer guides
   - Young Akinyi with curly hair and yellow headband
   - Animated mouths while browser speech is active
   - Blinking eyes and character movement
   - Individual personalities and voice profiles
   - English, casual Sheng-English, Kiswahili
   - Voice selection
   - Page-aware tour and element spotlight
   - Back, Next, Skip, Finish, Replay
   - Responsive design and mobile overlap protection
   - Saves preferences in localStorage
   - No external libraries or image hosting required
   ============================================================ */

(() => {
  "use strict";

  if (window.__mavunoAnimeTourLoaded) return;
  window.__mavunoAnimeTourLoaded = true;

  const STORAGE = {
    avatar: "mavunobridge_tour_avatar",
    language: "mavunobridge_tour_language",
    voice: "mavunobridge_tour_voice",
    completed: "mavunobridge_tour_completed"
  };

  const state = {
    avatar: localStorage.getItem(STORAGE.avatar) || "akinyi",
    language: localStorage.getItem(STORAGE.language) || "en",
    voiceURI: localStorage.getItem(STORAGE.voice) || "",
    step: 0,
    active: false,
    setupOpen: false,
    speaking: false,
    voices: [],
    page: "marketplace",
    speechSession: 0,
    mouthTimer: null,
    panel: null,
    guide: null,
    overlay: null,
    spotlight: null,
    launcher: null
  };

  const farmers = {
    baba: {
      name: "Baba Otieno",
      role: "Experienced grower",
      personality: "Wise & patient",
      pitch: 0.78,
      rate: 0.86,
      skin: "#895437",
      hair: "#D5D1C7",
      shirt: "#4F7A3A",
      accent: "#D7B36A",
      hat: "#D8AC58",
      greeting: {
        en: "Karibu! I'm Baba Otieno. Let me share some farming wisdom with you.",
        mix: "Karibu! I'm Baba Otieno. Niko hapa kukushow vile MavunoBridge inawork.",
        sw: "Karibu! Mimi ni Baba Otieno. Nitakuonyesha jinsi ya kutumia MavunoBridge."
      }
    },

    kamau: {
      name: "Kamau",
      role: "Maize farmer",
      personality: "Energetic & practical",
      pitch: 1.02,
      rate: 1.08,
      skin: "#9B603C",
      hair: "#20150F",
      shirt: "#E4A52C",
      accent: "#C0392B",
      hat: "#C0392B",
      greeting: {
        en: "Sasa! I'm Kamau. Let's get moving and explore MavunoBridge!",
        mix: "Sasa! I'm Kamau. Twende kazi, let's explore MavunoBridge!",
        sw: "Habari! Mimi ni Kamau. Twende tukajifunze kutumia MavunoBridge!"
      }
    },

    wanjiru: {
      name: "Mama Wanjiru",
      role: "Dairy & vegetable farmer",
      personality: "Warm & organized",
      pitch: 1.04,
      rate: 0.96,
      skin: "#75432C",
      hair: "#21150F",
      shirt: "#207F75",
      accent: "#E58B35",
      hat: "#E58B35",
      greeting: {
        en: "Hello and welcome! I'm Mama Wanjiru. I'll guide you step by step.",
        mix: "Hello! I'm Mama Wanjiru. Pole pole tutapitia kila kitu pamoja.",
        sw: "Habari na karibu! Mimi ni Mama Wanjiru. Nitakuongoza hatua kwa hatua."
      }
    },

    akinyi: {
      name: "Akinyi",
      role: "Young tomato grower",
      personality: "Curious & creative",
      pitch: 1.18,
      rate: 1.02,
      skin: "#A86E49",
      hair: "#21140F",
      shirt: "#426F9D",
      accent: "#F2C52F",
      hat: "#F2C52F",
      greeting: {
        en: "Hey! I'm Akinyi. Let's discover smarter ways to grow and sell!",
        mix: "Hey! I'm Akinyi. Tuone vile tunaeza grow na kuuza smarter!",
        sw: "Habari! Mimi ni Akinyi. Tujifunze njia bora za kulima na kuuza!"
      }
    }
  };

  const words = {
    en: {
      title: "Meet your farmer guide",
      subtitle: "Choose a character to explore MavunoBridge.",
      personality: "Personality",
      language: "Language",
      voice: "Speaking voice",
      start: "Start tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish",
      replay: "Replay",
      close: "Close",
      step: "Step",
      done: "You're all set!",
      doneText: "Great work! You now know your way around MavunoBridge. You can replay this tour whenever you need help.",
      launcher: "Take a tour",
      setup: "Choose your guide",
      unavailable: "This section is not available on the current page.",
      mute: "Stop speaking",
      traits: "Your guide"
    },

    mix: {
      title: "Meet your farmer guide",
      subtitle: "Chagua character wako, then tuanze tour.",
      personality: "Personality",
      language: "Language",
      voice: "Voice ya guide",
      start: "Twende!",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Tumemaliza!",
      replay: "Replay",
      close: "Close",
      step: "Step",
      done: "Umeweza!",
      doneText: "Poa sana! Sasa unajua vile MavunoBridge inawork. Unaweza replay hii tour ukihitaji help.",
      launcher: "Take a tour",
      setup: "Chagua guide wako",
      unavailable: "Hii section haiko kwa page hii.",
      mute: "Stop speaking",
      traits: "Guide wako"
    },

    sw: {
      title: "Kutana na mwongozo wako",
      subtitle: "Chagua mhusika wako ili kuanza.",
      personality: "Tabia",
      language: "Lugha",
      voice: "Sauti",
      start: "Anza ziara",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza",
      replay: "Rudia",
      close: "Funga",
      step: "Hatua",
      done: "Umefanikiwa!",
      doneText: "Vizuri sana! Sasa unajua jinsi ya kutumia MavunoBridge. Unaweza kurudia ziara hii wakati wowote.",
      launcher: "Anza ziara",
      setup: "Chagua mwongozo",
      unavailable: "Sehemu hii haipatikani kwenye ukurasa huu.",
      mute: "Simamisha sauti",
      traits: "Mwongozo wako"
    }
  };

  const tours = {
    marketplace: {
      en: [
        ["Welcome to MavunoBridge", "This is your agricultural marketplace. Farmers can showcase produce, while buyers can discover products and compare available offers.", null],
        ["Search for produce", "Use the search bar to find products such as maize, tomatoes, beans, fruits and other farm produce.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Explore categories", "Choose a category to browse the products you need. Different farmers can list the same type of product.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Browse product listings", "Check product photos, prices, locations and seller information before choosing what works for you.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Find a fair deal", "Compare prices, quantities and locations. Remember that prices can change depending on season and availability.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Ready to explore!", "You're ready to explore MavunoBridge. Open a listing to learn more, or continue browsing the marketplace.", null]
      ],

      mix: [
        ["Karibu MavunoBridge!", "Hapa ndio marketplace. Farmers wanaweza list produce zao, na buyers wanaweza browse offers.", null],
        ["Search products", "Tumia search bar kutafuta maize, tomatoes, beans, fruits na products zingine.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Chagua category", "Click category unataka. Kuna different farmers wanaweza list product kama hiyo.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Angalia listings", "Check picha, price, location na seller details kabla uamue kununua.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Compare deals", "Linganisha prices na quantity. Bei zinaweza change kulingana na season na location.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Uko ready!", "Sasa unaweza explore marketplace, kufungua listing na kucompare offers.", null]
      ],

      sw: [
        ["Karibu MavunoBridge", "Hii ni soko la kilimo. Wakulima wanaweza kuweka bidhaa zao na wanunuzi wanaweza kuzitafuta.", null],
        ["Tafuta bidhaa", "Tumia sehemu ya kutafuta kupata mahindi, nyanya, maharagwe, matunda na bidhaa nyingine.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Chagua kundi", "Chagua kundi la bidhaa unayotaka kuona.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Angalia bidhaa", "Angalia picha, bei, eneo na maelezo ya muuzaji kabla ya kuchagua.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Linganisha bei", "Linganisha bei na kiasi cha bidhaa. Bei zinaweza kubadilika kulingana na msimu na eneo.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Uko tayari!", "Sasa unaweza kutafuta bidhaa na kuchagua ofa inayokufaa.", null]
      ]
    },

    smart: {
      en: [
        ["Welcome to Smart Assist", "This section helps you explore farming guidance and practical ideas for your farm.", null],
        ["Ask for farming help", "Look for the available assistant controls and enter a farming question.", "textarea, input[type='text'], #questionInput, #chatInput"],
        ["Explore suggestions", "Use available suggestions to explore crop care, pest management and farming topics.", "#suggestions, .suggestions, .quick-prompts"],
        ["Check local conditions", "When weather or location features are connected, use them to help inform your farming decisions.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Keep learning", "Use Smart Assist as a source of guidance, and verify important crop or pest decisions with a qualified local agricultural expert.", null]
      ],

      mix: [
        ["Karibu Smart Assist", "Hapa utapata farming guidance na ideas za kusaidia shamba yako.", null],
        ["Uliza swali", "Tafuta assistant input, then andika swali kuhusu farming.", "textarea, input[type='text'], #questionInput, #chatInput"],
        ["Explore suggestions", "Tumia suggestions kupata ideas kuhusu crops, pests na crop care.", "#suggestions, .suggestions, .quick-prompts"],
        ["Angalia conditions", "Kama weather feature iko connected, itumie kuhelp kupanga kazi za shamba.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Endelea kujifunza", "Kwa decisions muhimu kuhusu pests au crops, confirm na agricultural expert wa eneo lako.", null]
      ],

      sw: [
        ["Karibu Smart Assist", "Hapa unaweza kupata mwongozo na mawazo ya kusaidia shughuli za kilimo.", null],
        ["Uliza swali", "Tafuta sehemu ya kuandika swali lako kuhusu kilimo.", "textarea, input[type='text'], #questionInput, #chatInput"],
        ["Angalia mapendekezo", "Tumia mapendekezo kujifunza kuhusu mazao na wadudu waharibifu.", "#suggestions, .suggestions, .quick-prompts"],
        ["Angalia hali ya eneo", "Ikiwa taarifa za hali ya hewa zimeunganishwa, zitumie kupanga kazi za shamba.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Endelea kujifunza", "Kwa maamuzi muhimu kuhusu mazao, pata ushauri kutoka kwa mtaalamu wa kilimo wa eneo lako.", null]
      ]
    },

    sacco: {
      en: [
        ["Welcome to SACCO Hub", "Explore the SACCO and farmer opportunity information available on this page.", null],
        ["Browse opportunities", "Review available SACCOs, membership opportunities and the details shown for each option.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Check requirements", "Before joining, confirm membership requirements, fees, savings rules and contact details directly with the organization.", null],
        ["Make an informed choice", "Compare options carefully and ask questions before making financial commitments.", null]
      ],

      mix: [
        ["Karibu SACCO Hub", "Hapa unaweza explore SACCOs na opportunities za farmers.", null],
        ["Browse opportunities", "Angalia SACCOs zilizolist na details za kila option.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Check requirements", "Confirm membership rules, fees, savings na contact details kabla ujiunge.", null],
        ["Chagua wisely", "Compare options na uliza maswali kabla ya kufanya financial commitment.", null]
      ],

      sw: [
        ["Karibu SACCO Hub", "Hapa unaweza kuchunguza SACCO na fursa za wakulima.", null],
        ["Angalia fursa", "Pitia SACCO na maelezo ya fursa zinazopatikana.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Thibitisha masharti", "Thibitisha ada, masharti ya uanachama na maelezo ya mawasiliano.", null],
        ["Chagua kwa uangalifu", "Linganisha chaguo na uliza maswali kabla ya kutoa fedha.", null]
      ]
    },

    farmer: {
      en: [
        ["Welcome, farmer!", "This section is for learning how to present your products and farm information to potential buyers.", null],
        ["Start a listing", "Look for the sell or add-listing control to see the available product form.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Add product details", "Enter accurate product information, quantity, location, price and contact details in the available fields.", "#listingForm, #productForm, form"],
        ["Add clear photos", "Use clear, genuine product photos so buyers can understand what you are offering.", 'input[type="file"]'],
        ["Review before publishing", "Check your details carefully before saving or publishing your listing.", "#saveListing, #submitListing, button[type='submit']"]
      ],

      mix: [
        ["Karibu farmer!", "Hii section inakusaidia kuonyesha products zako kwa potential buyers.", null],
        ["Anza listing", "Tafuta sell au add listing button.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Jaza details", "Weka product, quantity, location, price na contact details zilizo correct.", "#listingForm, #productForm, form"],
        ["Add picha", "Tumia clear na genuine photos za product yako.", 'input[type="file"]'],
        ["Review kwanza", "Check details zote kabla ya kusave au kupublish listing.", "#saveListing, #submitListing, button[type='submit']"]
      ],

      sw: [
        ["Karibu mkulima!", "Sehemu hii inakusaidia kuonyesha bidhaa zako kwa wanunuzi.", null],
        ["Anza kuweka bidhaa", "Tafuta kitufe cha kuuza au kuongeza bidhaa.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Jaza maelezo", "Weka jina la bidhaa, kiasi, eneo, bei na mawasiliano sahihi.", "#listingForm, #productForm, form"],
        ["Weka picha", "Tumia picha halisi na zilizo wazi za bidhaa yako.", 'input[type="file"]'],
        ["Kagua kabla ya kuchapisha", "Hakikisha maelezo yote ni sahihi kabla ya kuhifadhi bidhaa.", "#saveListing, #submitListing, button[type='submit']"]
      ]
    },

    buyer: {
      en: [
        ["Welcome, buyer!", "Let's explore how to find products and compare farmer offers.", null],
        ["Search and filter", "Use search and the available filters to narrow down your choices.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Compare listings", "Compare product quality, quantity, price and location before choosing.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Contact the seller", "Use the contact options shown on a listing to ask questions about availability and collection.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Shop thoughtfully", "Confirm important details with the seller before arranging payment or collection.", null]
      ],

      mix: [
        ["Karibu buyer!", "Tuone vile unaweza kupata products na kucompare offers za farmers.", null],
        ["Search na filters", "Tumia search na filters kupunguza options.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Compare listings", "Linganisha quality, quantity, price na location.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Contact seller", "Tumia contact options kuuliza kuhusu availability na collection.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Nunua carefully", "Confirm details muhimu na seller kabla ya payment au collection.", null]
      ],

      sw: [
        ["Karibu mnunuzi!", "Tutajifunza jinsi ya kutafuta bidhaa na kulinganisha ofa.", null],
        ["Tafuta na chuja", "Tumia sehemu ya kutafuta na vichujio vilivyopo.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Linganisha bidhaa", "Linganisha ubora, kiasi, bei na eneo.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Wasiliana na muuzaji", "Tumia mawasiliano yaliyowekwa kuuliza kuhusu bidhaa na mahali pa kuipokea.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Nunua kwa uangalifu", "Thibitisha maelezo muhimu na muuzaji kabla ya kulipa au kuchukua bidhaa.", null]
      ]
    }
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function t(key) {
    return words[state.language]?.[key] || words.en[key] || key;
  }

  function currentFarmer() {
    return farmers[state.avatar] || farmers.akinyi;
  }

  function detectPage() {
    const path = (
      location.pathname + location.hash
    ).toLowerCase();

    if (/smart-assist|smartassist|assistant/.test(path)) {
      return "smart";
    }

    if (/sacco|opportunit/.test(path)) {
      return "sacco";
    }

    if (/buyer/.test(path)) {
      return "buyer";
    }

    if (/farmer|sell/.test(path)) {
      return "farmer";
    }

    return "marketplace";
  }

  function getSteps() {
    const page = tours[state.page] || tours.marketplace;
    return page[state.language] || page.en;
  }

  /* ----------------------------------------------------------
     ANIME FARMER SVG
     Each portrait is drawn separately so the mouth and eyes
     can animate independently during speech.
     ---------------------------------------------------------- */

  function avatarSVG(id, large = false) {
    const f = farmers[id] || farmers.akinyi;

    const isBaba = id === "baba";
    const isKamau = id === "kamau";
    const isWanjiru = id === "wanjiru";
    const isAkinyi = id === "akinyi";

    const hair = isBaba
      ? `<path d="M34 51 Q27 18 64 16 Q98 15 98 52 L92 65 L39 64 Z" fill="#D5D1C7"/>
         <path d="M38 45 Q43 25 61 24 M77 25 Q92 34 93 49" fill="none" stroke="#F0ECE3" stroke-width="3" stroke-linecap="round"/>`
      : isKamau
      ? `<path d="M32 51 Q28 18 65 19 Q96 20 97 53 L91 41 Q74 29 61 38 Q46 45 36 56 Z" fill="#20150F"/>`
      : isWanjiru
      ? `<path d="M29 57 Q22 20 64 18 Q104 20 100 60 L94 77 L35 76 Z" fill="#20150F"/>
         <path d="M37 41 Q50 53 46 79 M88 42 Q78 55 84 79" fill="none" stroke="#493023" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M29 56 Q24 19 64 17 Q103 18 100 58 L95 83 Q91 51 77 40 Q62 30 45 45 L35 76 Z" fill="#20150F"/>
         <path d="M33 37 Q24 17 46 12 Q64 6 78 15 Q102 20 94 41 Q74 27 55 29 Q42 30 33 37 Z" fill="#2A1A13"/>
         <path d="M40 24 Q35 11 48 12 M56 18 Q65 7 75 17 M80 25 Q94 15 91 32" fill="none" stroke="#493023" stroke-width="5" stroke-linecap="round"/>`;

    const hat = isBaba
      ? `<path d="M12 49 Q18 14 63 12 Q106 14 114 49 Q66 59 12 49 Z" fill="#E8C477" stroke="#A57A3B" stroke-width="2"/>
         <path d="M8 48 Q63 39 118 48 Q98 62 64 60 Q29 60 8 48 Z" fill="#D8AC58" stroke="#A57A3B" stroke-width="2"/>
         <path d="M34 30 Q62 20 88 30" fill="none" stroke="#F4D99A" stroke-width="2"/>`
      : isKamau
      ? `<path d="M27 43 Q28 17 62 16 Q91 17 100 42 L94 51 L34 51 Z" fill="#C0392B" stroke="#7E211B" stroke-width="2"/>
         <path d="M26 42 Q64 35 106 43 Q84 54 44 50 Z" fill="#D94A3F"/>`
      : isWanjiru
      ? `<path d="M26 51 Q13 26 39 15 Q67 0 91 21 Q112 37 97 58 L87 68 L35 64 Z" fill="#E58B35" stroke="#AC5725" stroke-width="2"/>
         <path d="M29 36 Q57 46 96 25 M33 47 Q62 55 99 37 M42 21 Q66 33 85 18" fill="none" stroke="#F7BC65" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M32 32 Q44 12 64 19 Q87 12 96 33 L91 40 Q64 31 36 41 Z" fill="#F2C52F" stroke="#C99913" stroke-width="2"/>
         <path d="M35 29 Q31 20 38 17 Q48 13 52 23 M74 21 Q87 11 92 22" fill="none" stroke="#FFE887" stroke-width="3" stroke-linecap="round"/>`;

    const eyes = isBaba
      ? `<path class="mbt-eye" d="M39 60 Q48 55 56 61 Q48 68 39 60 Z" fill="#FFF7E9"/>
         <path class="mbt-eye" d="M70 61 Q79 55 88 60 Q79 68 70 61 Z" fill="#FFF7E9"/>
         <circle class="mbt-pupil" cx="48" cy="61" r="3.5" fill="#241710"/>
         <circle class="mbt-pupil" cx="79" cy="61" r="3.5" fill="#241710"/>
         <path d="M36 55 Q47 50 57 55 M68 55 Q80 50 90 55" fill="none" stroke="#665042" stroke-width="3" stroke-linecap="round"/>`
      : `<path class="mbt-eye" d="M37 61 Q47 51 57 61 Q47 70 37 61 Z" fill="#FFF8F0"/>
         <path class="mbt-eye" d="M70 61 Q80 51 90 61 Q80 70 70 61 Z" fill="#FFF8F0"/>
         <ellipse class="mbt-pupil" cx="48" cy="61" rx="4.2" ry="5.5" fill="#24150F"/>
         <ellipse class="mbt-pupil" cx="80" cy="61" rx="4.2" ry="5.5" fill="#24150F"/>
         <circle cx="49.5" cy="59" r="1.7" fill="#FFFFFF"/>
         <circle cx="81.5" cy="59" r="1.7" fill="#FFFFFF"/>
         <path d="M35 56 Q47 49 58 56 M69 56 Q81 49 92 56" fill="none" stroke="#281810" stroke-width="3.2" stroke-linecap="round"/>`;

    const facialHair = isBaba
      ? `<path d="M37 76 Q45 86 63 84 Q82 86 90 75 L87 92 Q77 108 63 109 Q47 106 39 92 Z" fill="#E2DED5"/>
         <path d="M43 83 Q62 91 83 82 M49 96 Q63 101 77 96" fill="none" stroke="#BEBAB2" stroke-width="2"/>`
      : isKamau
      ? `<path d="M44 80 Q48 88 63 89 Q77 88 84 79 L79 91 Q64 99 49 91 Z" fill="#21150F"/>`
      : "";

    const mouth = isBaba
      ? `<path class="mbt-mouth-line" d="M47 76 Q63 88 80 76" fill="none" stroke="#542D20" stroke-width="3" stroke-linecap="round"/>
         <ellipse class="mbt-mouth-open" cx="63" cy="81" rx="10" ry="1.5" fill="#431E1B"/>
         <path class="mbt-teeth" d="M54 79 Q63 83 72 79" fill="none" stroke="#FFF4E8" stroke-width="2"/>`
      : `<path class="mbt-mouth-line" d="M47 77 Q63 87 80 77" fill="none" stroke="#542D20" stroke-width="3" stroke-linecap="round"/>
         <ellipse class="mbt-mouth-open" cx="63" cy="81" rx="9" ry="1.5" fill="#451C1A"/>
         <path class="mbt-teeth" d="M54 79 Q63 83 72 79" fill="none" stroke="#FFF4E8" stroke-width="2"/>`;

    const earrings = isWanjiru || isAkinyi
      ? `<circle cx="31" cy="75" r="3" fill="#F3CC64" stroke="#A87626" stroke-width="1"/>
         <circle cx="95" cy="75" r="3" fill="#F3CC64" stroke="#A87626" stroke-width="1"/>`
      : "";

    const neck = `<path d="M51 94 L51 111 Q63 121 75 111 L75 94 Z" fill="${f.skin}"/>
      <path d="M54 101 Q63 108 72 101" fill="none" stroke="#70442E" stroke-width="1.5" opacity=".55"/>`;

    const shirt = `<path d="M51 105 L34 110 Q15 117 12 151 L114 151 Q111 117 92 110 L75 105 Q64 119 51 105 Z" fill="${f.shirt}" stroke="#294B3A" stroke-width="1.5"/>
      <path d="M51 105 L63 121 L75 105" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".7"/>
      <path d="M27 126 L23 145 M98 126 L103 145" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".18"/>`;

    const accessories = isAkinyi
      ? `<path d="M30 112 L22 148 M94 112 L103 148" stroke="#F2C52F" stroke-width="5" stroke-linecap="round"/>
         <path d="M27 125 L43 125 M83 125 L99 125" stroke="#F2C52F" stroke-width="3"/>`
      : isKamau
      ? `<path d="M31 119 L48 136 M94 119 L78 136" stroke="#69451F" stroke-width="5" stroke-linecap="round"/>`
      : isWanjiru
      ? `<path d="M43 114 L32 148 M84 114 L97 148" stroke="#6B4934" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M32 116 L45 137 M93 116 L80 137" stroke="#4C5D3A" stroke-width="5" stroke-linecap="round"/>`;

    const produce = isAkinyi
      ? `<g transform="translate(0 3)">
          <path d="M28 147 Q63 133 99 147 L104 158 L22 158 Z" fill="#B97A45" stroke="#83502C" stroke-width="2"/>
          <circle cx="40" cy="144" r="7" fill="#E64A36"/>
          <circle cx="56" cy="141" r="8" fill="#D9392D"/>
          <circle cx="72" cy="143" r="7" fill="#F04F3A"/>
          <circle cx="87" cy="145" r="7" fill="#D9392D"/>
          <path d="M54 134 l3 -5 l4 4 M70 136 l3 -5 l4 4" fill="none" stroke="#387C42" stroke-width="2"/>
        </g>`
      : "";

    return `
      <svg class="mbt-anime-avatar ${large ? "mbt-large-avatar" : ""}"
           viewBox="0 0 126 160"
           role="img"
           aria-label="${escapeHTML(f.name)}, ${escapeHTML(f.role)}"
           xmlns="http://www.w3.org/2000/svg">

        <defs>
          <linearGradient id="mbt-skin-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${f.skin}"/>
            <stop offset="100%" stop-color="#5D3526"/>
          </linearGradient>
          <linearGradient id="mbt-shirt-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${f.shirt}"/>
            <stop offset="100%" stop-color="#244A3A"/>
          </linearGradient>
        </defs>

        <g class="mbt-character">
          ${shirt.replace(f.shirt, `url(#mbt-shirt-${id})`)}
          ${accessories}

          <g class="mbt-head">
            ${hair}

            <path d="M31 48 Q31 28 63 28 Q95 28 95 49 L91 78 Q87 101 63 104 Q39 101 35 78 Z"
                  fill="url(#mbt-skin-${id})"
                  stroke="#593321"
                  stroke-width="1.4"/>

            <path d="M37 51 Q42 36 61 35 Q83 35 90 52"
                  fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".1"/>

            <ellipse cx="33" cy="69" rx="5" ry="8" fill="${f.skin}"/>
            <ellipse cx="94" cy="69" rx="5" ry="8" fill="${f.skin}"/>

            <path d="M35 71 Q39 77 35 80 M92 71 Q88 77 92 80"
                  fill="none" stroke="#70442E" stroke-width="1.5" opacity=".65"/>

            ${eyes}

            <path d="M63 62 Q58 71 60 75 Q63 78 67 75"
                  fill="none" stroke="#70442E" stroke-width="2.2" stroke-linecap="round"/>

            <ellipse cx="43" cy="73" rx="7" ry="3.5" fill="#D98C79" opacity=".25"/>
            <ellipse cx="83" cy="73" rx="7" ry="3.5" fill="#D98C79" opacity=".25"/>

            ${facialHair}
            ${mouth}
            ${earrings}
            ${hat}
          </g>

          ${neck}
          ${produce}
        </g>
      </svg>
    `;
  }

  /* ----------------------------------------------------------
     STYLES
     ---------------------------------------------------------- */

  function addStyles() {
    if ($("#mbt-anime-styles")) return;

    const style = document.createElement("style");
    style.id = "mbt-anime-styles";

    style.textContent = `
      #mbt-guide, #mbt-panel, #mbt-launcher,
      #mbt-overlay, #mbt-spotlight {
        box-sizing: border-box;
      }

      #mbt-guide {
        position: fixed;
        top: 14px;
        left: 14px;
        width: 88px;
        z-index: 99994;
        pointer-events: none;
        transition: opacity .2s ease, transform .2s ease;
      }

      .mbt-guide-card {
        background: #fff;
        border: 1px solid #e1e9df;
        border-radius: 17px;
        padding: 6px;
        box-shadow: 0 7px 24px #17291b22;
        text-align: center;
      }

      .mbt-avatar-frame {
        overflow: hidden;
        border-radius: 13px;
        background: #f1f7ec;
        border: 1px solid #e1e9df;
      }

      #mbt-guide .mbt-avatar-frame {
        width: 74px;
        height: 78px;
        margin: auto;
      }

      .mbt-anime-avatar {
        display: block;
        width: 100%;
        height: 100%;
      }

      .mbt-character {
        transform-origin: 63px 145px;
        animation: mbt-character-idle 3s ease-in-out infinite;
      }

      #mbt-guide .mbt-guide-name {
        margin-top: 5px;
        color: #21452c;
        font-size: 10px;
        line-height: 1.2;
        font-weight: 800;
      }

      #mbt-guide .mbt-guide-personality {
        color: #64806a;
        font-size: 8px;
        line-height: 1.2;
        margin-top: 3px;
      }

      #mbt-guide.mbt-personality-baba .mbt-character {
        animation-duration: 4s;
      }

      #mbt-guide.mbt-personality-kamau .mbt-character {
        animation-duration: 1.7s;
      }

      #mbt-guide.mbt-personality-wanjiru .mbt-character {
        animation-duration: 3.2s;
      }

      #mbt-guide.mbt-personality-akinyi .mbt-character {
        animation-duration: 2.2s;
      }

      .mbt-mouth-open, .mbt-teeth {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: center;
      }

      .mbt-mouth-line {
        opacity: 1;
      }

      .mbt-speaking .mbt-mouth-open {
        opacity: 1;
        animation: mbt-mouth-talk .19s ease-in-out infinite alternate;
      }

      .mbt-speaking .mbt-mouth-line {
        opacity: .15;
      }

      .mbt-speaking .mbt-teeth {
        opacity: .95;
      }

      .mbt-speaking .mbt-character {
        animation: mbt-character-talk .34s ease-in-out infinite alternate;
      }

      .mbt-blink .mbt-eye,
      .mbt-blink .mbt-pupil {
        transform-box: fill-box;
        transform-origin: center;
        animation: mbt-blink .13s ease-in-out;
      }

      @keyframes mbt-mouth-talk {
        from { transform: scaleY(.35) scaleX(.85); }
        to { transform: scaleY(2.5) scaleX(1.05); }
      }

      @keyframes mbt-blink {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(.08); }
      }

      @keyframes mbt-character-idle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      @keyframes mbt-character-talk {
        from { transform: translateY(0) rotate(-.4deg); }
        to { transform: translateY(-2px) rotate(.4deg); }
      }

      #mbt-overlay {
        position: fixed;
        inset: 0;
        z-index: 99991;
        background: rgb(13 26 16 / 47%);
        pointer-events: none;
      }

      #mbt-spotlight {
        position: fixed;
        z-index: 99992;
        pointer-events: none;
        border: 3px solid #fff;
        border-radius: 13px;
        box-shadow: 0 0 0 9999px rgb(13 26 16 / 47%),
                    0 0 25px rgb(255 255 255 / 45%);
        transition: all .22s ease;
      }

      #mbt-panel {
        position: fixed;
        z-index: 99995;
        right: 18px;
        bottom: 18px;
        width: min(410px, calc(100vw - 36px));
        max-height: calc(100dvh - 36px);
        overflow: auto;
        background: #fff;
        color: #203827;
        border: 1px solid #e1e9df;
        border-radius: 22px;
        padding: 18px;
        box-shadow: 0 18px 55px rgb(0 0 0 / 25%);
        font-family: inherit;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      #mbt-panel * { box-sizing: border-box; }

      .mbt-panel-heading {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .mbt-panel-avatar {
        flex: 0 0 90px;
        height: 110px;
        overflow: hidden;
        border-radius: 15px;
        background: #f1f7ec;
      }

      .mbt-panel-title {
        font-size: 19px;
        font-weight: 850;
        line-height: 1.2;
        margin: 3px 0 6px;
      }

      .mbt-muted {
        color: #68776b;
        font-size: 13px;
        line-height: 1.5;
      }

      .mbt-personality-tag {
        display: inline-block;
        margin-top: 7px;
        padding: 5px 8px;
        border-radius: 20px;
        background: #edf5e9;
        color: #315f38;
        font-size: 11px;
        font-weight: 750;
      }

      .mbt-label {
        display: block;
        margin: 14px 0 6px;
        font-size: 12px;
        font-weight: 800;
        color: #35513a;
      }

      .mbt-select, .mbt-button {
        min-height: 40px;
        font: inherit;
        border-radius: 11px;
      }

      .mbt-select {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #d5e1d2;
        background: white;
        color: #203827;
      }

      .mbt-avatar-choices {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
        margin-top: 13px;
      }

      .mbt-avatar-choice {
        min-width: 0;
        padding: 5px;
        background: #fff;
        border: 1px solid #dfe7dd;
        border-radius: 13px;
        color: #29462f;
        font: inherit;
        cursor: pointer;
      }

      .mbt-avatar-choice[aria-pressed="true"] {
        border: 2px solid #4c874b;
        background: #f0f7eb;
      }

      .mbt-avatar-choice .mbt-avatar-frame {
        height: 76px;
      }

      .mbt-avatar-choice span {
        display: block;
        font-size: 10px;
        font-weight: 800;
        margin-top: 5px;
        overflow-wrap: anywhere;
      }

      .mbt-description {
        margin-top: 15px;
        padding: 13px;
        background: #f5f8f2;
        border-radius: 14px;
        font-size: 14px;
        line-height: 1.55;
      }

      .mbt-step-count {
        color: #5d795e;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .04em;
        text-transform: uppercase;
      }

      .mbt-step-title {
        margin: 5px 0 8px;
        font-size: 20px;
        line-height: 1.25;
        font-weight: 850;
      }

      .mbt-step-text {
        font-size: 14px;
        line-height: 1.65;
        color: #526356;
        overflow-wrap: anywhere;
      }

      .mbt-progress {
        height: 5px;
        overflow: hidden;
        border-radius: 8px;
        background: #e8eee5;
        margin: 14px 0;
      }

      .mbt-progress-fill {
        height: 100%;
        background: #56894e;
        transition: width .2s ease;
      }

      .mbt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 16px;
      }

      .mbt-button {
        flex: 1 1 auto;
        padding: 9px 12px;
        border: 1px solid #dce6d8;
        background: #fff;
        color: #2a4830;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .mbt-button-primary {
        background: #397844;
        color: #fff;
        border-color: #397844;
      }

      .mbt-button:focus-visible,
      .mbt-select:focus-visible,
      .mbt-avatar-choice:focus-visible {
        outline: 3px solid #e5b73e;
        outline-offset: 2px;
      }

      #mbt-launcher {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 99990;
        border: 0;
        border-radius: 30px;
        padding: 12px 17px;
        background: #2f713c;
        color: #fff;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        box-shadow: 0 8px 24px rgb(0 0 0 / 20%);
        cursor: pointer;
      }

      @media (max-width: 700px) {
        #mbt-guide {
          top: max(6px, env(safe-area-inset-top));
          left: 6px;
          width: 53px;
        }

        #mbt-guide .mbt-guide-card {
          padding: 3px;
          border-radius: 12px;
        }

        #mbt-guide .mbt-avatar-frame {
          width: 45px;
          height: 48px;
          border-radius: 9px;
        }

        #mbt-guide .mbt-guide-name,
        #mbt-guide .mbt-guide-personality {
          display: none;
        }

        #mbt-panel {
          left: 8px;
          right: 8px;
          bottom: max(8px, env(safe-area-inset-bottom));
          width: auto;
          max-height: calc(100dvh - 92px);
          padding: 14px;
          border-radius: 18px;
        }

        body.mbt-tour-panel-open #mbt-guide {
          opacity: 0;
          transform: scale(.65);
        }

        .mbt-panel-title { font-size: 17px; }
        .mbt-panel-avatar { flex-basis: 76px; height: 95px; }
        .mbt-avatar-choice .mbt-avatar-frame { height: 62px; }
        .mbt-avatar-choice span { font-size: 9px; }
        .mbt-step-title { font-size: 18px; }
        #mbt-launcher { right: 8px; bottom: 8px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .mbt-character,
        .mbt-speaking .mbt-mouth-open,
        .mbt-speaking .mbt-character,
        .mbt-blink .mbt-eye,
        .mbt-blink .mbt-pupil {
          animation: none !important;
        }

        * { scroll-behavior: auto !important; }
      }
    `;

    document.head.appendChild(style);
  }

  function makeElement(tag, attrs = {}, html = "") {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "text") {
        element.textContent = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (html) element.innerHTML = html;
    return element;
  }

  /* ----------------------------------------------------------
     SPEECH + MOUTH ANIMATION
     ---------------------------------------------------------- */

  function setSpeaking(on) {
    state.speaking = on;

    if (state.guide) {
      state.guide.classList.toggle("mbt-speaking", on);
    }

    document.querySelectorAll(".mbt-anime-avatar").forEach(avatar => {
      avatar.classList.toggle("mbt-speaking", on);
    });

    if (state.mouthTimer) {
      clearInterval(state.mouthTimer);
      state.mouthTimer = null;
    }

    if (on) {
      state.mouthTimer = setInterval(() => {
        if (!state.speaking) return;

        document.querySelectorAll(".mbt-anime-avatar").forEach(avatar => {
          avatar.querySelectorAll(".mbt-mouth-open").forEach(mouth => {
            const opening = 0.6 + Math.random() * 1.6;
            mouth.style.transform = `scaleY(${opening})`;
          });
        });
      }, 115);
    } else {
      document.querySelectorAll(".mbt-mouth-open").forEach(mouth => {
        mouth.style.transform = "";
      });
    }
  }

  function stopSpeech() {
    state.speechSession++;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;

    state.voices = window.speechSynthesis.getVoices();

    if (state.panel && state.panel.isConnected) {
      const select = $("#mbt-voice-select", state.panel);
      if (select) fillVoiceOptions(select);
    }
  }

  function voiceOptionsForLanguage() {
    const prefix = {
      en: "en",
      mix: "en",
      sw: "sw"
    }[state.language] || "en";

    const voices = state.voices.filter(voice =>
      voice.lang.toLowerCase().startsWith(prefix)
    );

    return voices.length ? voices : state.voices;
  }

  function fillVoiceOptions(select) {
    const voices = voiceOptionsForLanguage();

    select.innerHTML = "";

    const automatic = makeElement("option", {
      value: "",
      text: "Automatic voice"
    });

    select.appendChild(automatic);

    voices.forEach(voice => {
      const option = makeElement("option", {
        value: voice.voiceURI,
        text: `${voice.name} (${voice.lang})`
      });

      select.appendChild(option);
    });

    select.value = voices.some(v => v.voiceURI === state.voiceURI)
      ? state.voiceURI
      : "";

    if (state.voiceURI && !select.value) {
      state.voiceURI = "";
      localStorage.removeItem(STORAGE.voice);
    }
  }

  function chooseVoice(utterance) {
    const available = voiceOptionsForLanguage();

    const selected = available.find(v => v.voiceURI === state.voiceURI);

    if (selected) {
      utterance.voice = selected;
      return;
    }

    const languagePrefix = state.language === "sw" ? "sw" : "en";

    const fallback = available.find(v =>
      v.lang.toLowerCase().startsWith(languagePrefix)
    );

    if (fallback) utterance.voice = fallback;
  }

  function speak(text) {
    stopSpeech();

    if (!("speechSynthesis" in window) || !text) return;

    const session = state.speechSession;
    const farmer = currentFarmer();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.pitch = farmer.pitch;
    utterance.rate = farmer.rate;

    chooseVoice(utterance);

    utterance.onstart = () => {
      if (session === state.speechSession) setSpeaking(true);
    };

    utterance.onend = () => {
      if (session === state.speechSession) setSpeaking(false);
    };

    utterance.onerror = () => {
      if (session === state.speechSession) setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  /* ----------------------------------------------------------
     GUIDE AND TOUR UI
     ---------------------------------------------------------- */

  function renderGuide() {
    const farmer = currentFarmer();

    if (!state.guide) {
      state.guide = makeElement("div", {
        id: "mbt-guide",
        "aria-hidden": "true"
      });

      document.body.appendChild(state.guide);
    }

    state.guide.className = `mbt-personality-${state.avatar}`;

    state.guide.innerHTML = `
      <div class="mbt-guide-card">
        <div class="mbt-avatar-frame">${avatarSVG(state.avatar)}</div>
        <div class="mbt-guide-name">${escapeHTML(farmer.name)}</div>
        <div class="mbt-guide-personality">${escapeHTML(farmer.personality)}</div>
      </div>
    `;
  }

  function createTourElements() {
    if (!state.overlay) {
      state.overlay = makeElement("div", { id: "mbt-overlay" });
      document.body.appendChild(state.overlay);
    }

    if (!state.spotlight) {
      state.spotlight = makeElement("div", { id: "mbt-spotlight" });
      state.spotlight.hidden = true;
      document.body.appendChild(state.spotlight);
    }

    if (!state.launcher) {
      state.launcher = makeElement("button", {
        id: "mbt-launcher",
        type: "button",
        text: t("launcher")
      });

      state.launcher.addEventListener("click", openSetup);
      document.body.appendChild(state.launcher);
    }

    state.overlay.hidden = true;
  }

  function ensurePanel() {
    if (state.panel) return;

    state.panel = makeElement("section", {
      id: "mbt-panel",
      role: "dialog",
      "aria-modal": "false",
      "aria-label": "MavunoBridge farmer tour"
    });

    state.panel.addEventListener("click", handlePanelClick);
    state.panel.addEventListener("change", handlePanelChange);

    document.body.appendChild(state.panel);
  }

  function avatarChoices() {
    return Object.entries(farmers).map(([id, farmer]) => `
      <button type="button"
        class="mbt-avatar-choice"
        data-avatar="${id}"
        aria-pressed="${state.avatar === id ? "true" : "false"}">
        <div class="mbt-avatar-frame">${avatarSVG(id)}</div>
        <span>${escapeHTML(farmer.name)}</span>
      </button>
    `).join("");
  }

  function renderSetup() {
    const farmer = currentFarmer();

    state.setupOpen = true;
    state.active = false;

    stopSpeech();
    clearSpotlight();

    document.body.classList.add("mbt-tour-panel-open");

    if (state.launcher) state.launcher.hidden = true;
    if (state.overlay) state.overlay.hidden = true;

    ensurePanel();

    state.panel.innerHTML = `
      <div class="mbt-panel-heading">
        <div class="mbt-panel-avatar">${avatarSVG(state.avatar, true)}</div>
        <div>
          <div class="mbt-panel-title">${escapeHTML(t("title"))}</div>
          <div class="mbt-muted">${escapeHTML(t("subtitle"))}</div>
          <div class="mbt-personality-tag">${escapeHTML(farmer.personality)}</div>
        </div>
      </div>

      <div class="mbt-avatar-choices">${avatarChoices()}</div>

      <label class="mbt-label" for="mbt-language-select">${escapeHTML(t("language"))}</label>
      <select id="mbt-language-select" class="mbt-select">
        <option value="en">English</option>
        <option value="mix">Sheng + English</option>
        <option value="sw">Kiswahili</option>
      </select>

      <label class="mbt-label" for="mbt-voice-select">${escapeHTML(t("voice"))}</label>
      <select id="mbt-voice-select" class="mbt-select"></select>

      <div class="mbt-description">
        <strong>${escapeHTML(farmer.name)}</strong><br>
        ${escapeHTML(farmer.role)}<br>
        <span class="mbt-muted">${escapeHTML(farmer.personality)}</span>
      </div>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="preview">${escapeHTML("Hear greeting")}</button>
        <button class="mbt-button mbt-button-primary" data-action="start">${escapeHTML(t("start"))}</button>
        <button class="mbt-button" data-action="close">${escapeHTML(t("close"))}</button>
      </div>
    `;

    $("#mbt-language-select", state.panel).value = state.language;
    fillVoiceOptions($("#mbt-voice-select", state.panel));

    state.panel.hidden = false;
    renderGuide();
  }

  function renderStep(shouldSpeak = true) {
    const steps = getSteps();

    if (!steps.length) {
      renderFinish();
      return;
    }

    state.step = Math.max(0, Math.min(state.step, steps.length - 1));

    const [title, description, selector] = steps[state.step];
    const farmer = currentFarmer();

    state.active = true;
    state.setupOpen = false;

    document.body.classList.add("mbt-tour-panel-open");

    if (state.launcher) state.launcher.hidden = true;
    if (state.overlay) state.overlay.hidden = false;

    ensurePanel();

    state.panel.innerHTML = `
      <div class="mbt-panel-heading">
        <div class="mbt-panel-avatar">${avatarSVG(state.avatar, true)}</div>
        <div>
          <div class="mbt-muted">${escapeHTML(farmer.name)} · ${escapeHTML(farmer.role)}</div>
          <div class="mbt-personality-tag">${escapeHTML(farmer.personality)}</div>
        </div>
      </div>

      <div class="mbt-progress">
        <div class="mbt-progress-fill" style="width:${((state.step + 1) / steps.length) * 100}%"></div>
      </div>

      <div class="mbt-step-count">${escapeHTML(t("step"))} ${state.step + 1} / ${steps.length}</div>
      <h2 class="mbt-step-title">${escapeHTML(title)}</h2>
      <div class="mbt-step-text">${escapeHTML(description)}</div>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="back" ${state.step === 0 ? "disabled" : ""}>${escapeHTML(t("back"))}</button>
        <button class="mbt-button" data-action="repeat">${escapeHTML(t("replay"))}</button>
        <button class="mbt-button mbt-button-primary" data-action="next">${escapeHTML(state.step === steps.length - 1 ? t("finish") : t("next"))}</button>
        <button class="mbt-button" data-action="skip">${escapeHTML(t("skip"))}</button>
      </div>
    `;

    state.panel.hidden = false;

    renderGuide();
    showSpotlight(selector);

    if (shouldSpeak) {
      const greeting = state.step === 0
        ? `${farmer.greeting[state.language]} ${title}. ${description}`
        : `${title}. ${description}`;

      speak(greeting);
    }
  }

  function renderFinish() {
    stopSpeech();
    clearSpotlight();

    state.active = false;
    state.setupOpen = false;

    localStorage.setItem(STORAGE.completed, "true");

    if (state.overlay) state.overlay.hidden = true;

    if (state.panel) {
      state.panel.innerHTML = `
        <div class="mbt-panel-heading">
          <div class="mbt-panel-avatar">${avatarSVG(state.avatar, true)}</div>
          <div>
            <div class="mbt-panel-title">${escapeHTML(t("done"))}</div>
            <div class="mbt-muted">${escapeHTML(currentFarmer().name)}</div>
          </div>
        </div>

        <div class="mbt-description">${escapeHTML(t("doneText"))}</div>

        <div class="mbt-actions">
          <button class="mbt-button" data-action="replay">${escapeHTML(t("replay"))}</button>
          <button class="mbt-button mbt-button-primary" data-action="close">${escapeHTML(t("close"))}</button>
        </div>
      `;

      state.panel.hidden = false;
    }

    speak(t("doneText"));
  }

  /* ----------------------------------------------------------
     SPOTLIGHT
     ---------------------------------------------------------- */

  function findTarget(selector) {
    if (!selector) return null;

    const selectors = selector.split(",").map(s => s.trim());

    for (const item of selectors) {
      try {
        const target = $(item);

        if (
          target &&
          !target.closest("#mbt-panel") &&
          !target.closest("#mbt-guide") &&
          !target.closest("#mbt-launcher") &&
          !target.closest("#mbt-overlay") &&
          !target.closest("#mbt-spotlight") &&
          target.getClientRects().length
        ) {
          return target;
        }
      } catch (_) {
        // Ignore invalid selectors and try the next candidate.
      }
    }

    return null;
  }

  function clearSpotlight() {
    if (state.spotlight) state.spotlight.hidden = true;
  }

  function showSpotlight(selector) {
    clearSpotlight();

    if (!state.active || !selector) return;

    const target = findTarget(selector);
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
      inline: "nearest"
    });

    const update = () => {
      if (!state.spotlight || !state.active) return;

      const rect = target.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        clearSpotlight();
        return;
      }

      state.spotlight.style.left = `${Math.max(0, rect.left - 4)}px`;
      state.spotlight.style.top = `${Math.max(0, rect.top - 4)}px`;
      state.spotlight.style.width = `${rect.width + 8}px`;
      state.spotlight.style.height = `${rect.height + 8}px`;
      state.spotlight.hidden = false;
    };

    requestAnimationFrame(update);
  }

  /* ----------------------------------------------------------
     CONTROLS
     ---------------------------------------------------------- */

  function selectAvatar(id) {
    if (!farmers[id]) return;

    state.avatar = id;
    localStorage.setItem(STORAGE.avatar, id);

    renderGuide();

    if (state.active) {
      renderStep(false);
      speak(`${currentFarmer().greeting[state.language]} ${getSteps()[state.step][1]}`);
    } else {
      renderSetup();
    }
  }

  function selectLanguage(language) {
    if (!words[language]) return;

    state.language = language;
    localStorage.setItem(STORAGE.language, language);

    if (state.active) {
      renderStep(true);
    } else {
      renderSetup();
    }
  }

  function selectVoice(voiceURI) {
    state.voiceURI = voiceURI || "";

    if (state.voiceURI) {
      localStorage.setItem(STORAGE.voice, state.voiceURI);
    } else {
      localStorage.removeItem(STORAGE.voice);
    }
  }

  function startTour() {
    state.page = detectPage();
    state.step = 0;
    state.active = true;

    renderStep(true);
  }

  function nextStep() {
    if (!state.active) return;

    if (state.step >= getSteps().length - 1) {
      renderFinish();
      return;
    }

    state.step++;
    renderStep(true);
  }

  function previousStep() {
    if (!state.active || state.step <= 0) return;

    state.step--;
    renderStep(true);
  }

  function closeTour() {
    stopSpeech();
    clearSpotlight();

    state.active = false;
    state.setupOpen = false;

    document.body.classList.remove("mbt-tour-panel-open");

    if (state.panel) state.panel.hidden = true;
    if (state.overlay) state.overlay.hidden = true;
    if (state.launcher) state.launcher.hidden = false;

    renderGuide();
  }

  function openSetup() {
    state.page = detectPage();
    renderSetup();
  }

  function handlePanelClick(event) {
    const avatarButton = event.target.closest("[data-avatar]");

    if (avatarButton) {
      selectAvatar(avatarButton.dataset.avatar);
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;

    switch (button.dataset.action) {
      case "start":
        startTour();
        break;

      case "next":
        nextStep();
        break;

      case "back":
        previousStep();
        break;

      case "skip":
      case "close":
        closeTour();
        break;

      case "repeat":
        if (state.active) {
          const step = getSteps()[state.step];
          speak(`${step[0]}. ${step[1]}`);
        } else {
          speak(currentFarmer().greeting[state.language]);
        }
        break;

      case "preview":
        speak(currentFarmer().greeting[state.language]);
        break;

      case "replay":
        startTour();
        break;
    }
  }

  function handlePanelChange(event) {
    if (event.target.id === "mbt-language-select") {
      selectLanguage(event.target.value);
    }

    if (event.target.id === "mbt-voice-select") {
      selectVoice(event.target.value);
    }
  }

  /* ----------------------------------------------------------
     BLINKING AND RESPONSIVENESS
     ---------------------------------------------------------- */

  function scheduleBlink() {
    const delay = 2400 + Math.random() * 2800;

    window.setTimeout(() => {
      document.querySelectorAll(".mbt-anime-avatar").forEach(avatar => {
        avatar.classList.add("mbt-blink");

        window.setTimeout(() => {
          avatar.classList.remove("mbt-blink");
        }, 150);
      });

      if (state.guide && state.guide.isConnected) {
        scheduleBlink();
      }
    }, delay);
  }

  function onResize() {
    if (!state.active) return;

    const step = getSteps()[state.step];
    if (step) showSpotlight(step[2]);
  }

  /* ----------------------------------------------------------
     INIT + PUBLIC API
     ---------------------------------------------------------- */

  function init() {
    if (!document.body) return;

    addStyles();
    createTourElements();
    renderGuide();
    scheduleBlink();

    if ("speechSynthesis" in window) {
      loadVoices();

      window.speechSynthesis.addEventListener?.(
        "voiceschanged",
        loadVoices
      );
    }

    window.addEventListener("resize", onResize);

    window.addEventListener("keydown", event => {
      if (event.key === "Escape" && (state.active || state.setupOpen)) {
        closeTour();
      }
    });

    // Do not automatically open the tour.
    // Visitors can launch it whenever they want.
  }

  window.MavunoBridgeTour = {
    open: openSetup,
    start: startTour,
    close: closeTour,
    next: nextStep,
    back: previousStep,
    replay: startTour,
    setAvatar: selectAvatar,
    setLanguage: selectLanguage,
    getPage: detectPage
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
