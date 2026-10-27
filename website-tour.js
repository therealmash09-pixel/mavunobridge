/* =========================================================
   MAVUNOBRIDGE — ANIMATED FARMER WEBSITE TOUR
   COMPLETE REPLACEMENT — website-tour.js

   FEATURES
   ---------------------------------------------------------
   ✓ Four farmer guides
   ✓ Individual farmer personalities
   ✓ More detailed / realistic farmer faces
   ✓ Animated talking mouth
   ✓ Farmer-specific voice personality
   ✓ English / Sheng-English / Kiswahili
   ✓ Browser voice selection
   ✓ Page-aware narration
   ✓ Marketplace tour
   ✓ Smart Assist tour
   ✓ SACCO Hub tour
   ✓ Farmer tools tour
   ✓ Buyer tools tour
   ✓ Element spotlight
   ✓ Back / Next / Skip / Replay
   ✓ Responsive mobile layout
   ✓ Mobile guide + panel do NOT overlap
   ✓ Saves selected avatar / language / voice
   ✓ No external libraries
   ========================================================= */

(() => {
  "use strict";

  if (window.__mavunoTourLoaded) return;
  window.__mavunoTourLoaded = true;

  /* =========================================================
     STORAGE
     ========================================================= */

  const STORAGE = {
    avatar: "mavunobridge_tour_avatar",
    language: "mavunobridge_tour_language",
    voice: "mavunobridge_tour_voice",
    completed: "mavunobridge_tour_completed"
  };

  /* =========================================================
     STATE
     ========================================================= */

  const state = {
    avatar: localStorage.getItem(STORAGE.avatar) || "akinyi",
    language: localStorage.getItem(STORAGE.language) || "en",
    voiceURI: localStorage.getItem(STORAGE.voice) || "",

    step: 0,
    active: false,
    speaking: false,

    session: 0,
    mouthTimer: null,

    voices: [],

    page: "marketplace",

    panel: null,
    guide: null,
    spotlight: null,
    overlay: null,
    launcher: null
  };

  /* =========================================================
     FARMER GUIDES
     ========================================================= */

  const farmers = {

    baba: {
      name: "Baba Otieno",
      role: "Elder grower",

      personality: "Wise, calm & experienced",
      personalityShort: "The wise farmer",
      emoji: "👴🏾",

      description:
        "Baba Otieno is a calm and experienced farmer who believes good farming starts with patience, planning and knowing your land.",

      intro: {
        en:
          "Habari! Mimi ni Baba Otieno. Nimekuwa kwa kilimo for many years, so nitakuonyesha MavunoBridge pole pole na kwa njia rahisi.",
        mix:
          "Sasa! Mimi ni Baba Otieno. Nimekuwa kwa farming for many years, so nitakuonyesha MavunoBridge pole pole, bila pressure.",
        sw:
          "Habari! Mimi ni Baba Otieno. Nimekuwa katika kilimo kwa miaka mingi, kwa hiyo nitakuongoza kwenye MavunoBridge kwa utulivu na kwa urahisi."
      },

      style:
        "calm, patient, practical and encouraging",

      pitch: 0.78,
      rate: 0.86,

      skin: "#70442D",
      skinLight: "#89583A",
      shirt: "#4F7A3A",
      hair: "#D1D1D1",
      hat: "#EBC76B",
      hatDark: "#B88C35",

      type: "elder"
    },

    kamau: {
      name: "Kamau",
      role: "Maize farmer",

      personality: "Energetic, practical & confident",
      personalityShort: "The energetic farmer",
      emoji: "👨🏾",

      description:
        "Kamau is an energetic maize farmer who likes practical solutions, clear prices and getting things done without wasting time.",

      intro: {
        en:
          "Yo! I'm Kamau. I'm a maize farmer and I like things simple and practical. Let me show you how to move around MavunoBridge fast.",
        mix:
          "Sasa bro! Mimi ni Kamau. I'm a maize farmer na napenda things ziwe simple na practical. Let's move through MavunoBridge!",
        sw:
          "Habari! Mimi ni Kamau. Mimi ni mkulima wa mahindi na napenda njia rahisi na za vitendo. Hebu tuangalie MavunoBridge pamoja."
      },

      style:
        "energetic, confident, direct and practical",

      pitch: 1.0,
      rate: 1.02,

      skin: "#8F5935",
      skinLight: "#A86D45",
      shirt: "#E3A72F",
      hair: "#21140F",
      hat: "#C0392B",
      hatDark: "#8E2C22",

      type: "youngman"
    },

    wanjiru: {
      name: "Mama Wanjiru",
      role: "Dairy & vegetable farmer",

      personality: "Warm, caring & organized",
      personalityShort: "The caring farmer",
      emoji: "👩🏾",

      description:
        "Mama Wanjiru is warm and organized. She cares about farmers, buyers and the community, and likes checking details before making decisions.",

      intro: {
        en:
          "Karibu! Mimi ni Mama Wanjiru. I love organized farming and helping people find good opportunities. Tutaenda hatua kwa hatua.",
        mix:
          "Karibu sana! Mimi ni Mama Wanjiru. Napenda farming yenye iko organized na helping farmers na buyers. Tutapitia kila kitu pole pole.",
        sw:
          "Karibu! Mimi ni Mama Wanjiru. Napenda kilimo kilichopangwa vizuri na kusaidia wakulima na wanunuzi. Tutapitia kila hatua pamoja."
      },

      style:
        "warm, caring, organized and reassuring",

      pitch: 1.08,
      rate: 0.92,

      skin: "#633A27",
      skinLight: "#7A4B32",
      shirt: "#1E7F74",
      hair: "#21140F",
      hat: "#E67E22",
      hatDark: "#B95211",

      type: "woman"
    },

    akinyi: {
      name: "Akinyi",
      role: "Tomato grower",

      personality: "Cheerful, curious & innovative",
      personalityShort: "The modern farmer",
      emoji: "👩🏾",

      description:
        "Akinyi is a cheerful tomato grower who enjoys technology, discovering new ideas and helping farmers use modern tools.",

      intro: {
        en:
          "Hey! I'm Akinyi. I grow tomatoes and I love trying smart new ideas. Let's explore MavunoBridge together!",
        mix:
          "Hey! Mimi ni Akinyi. I grow tomatoes and napenda ku-try new ideas. Let's explore MavunoBridge pamoja!",
        sw:
          "Habari! Mimi ni Akinyi. Mimi ni mkulima wa nyanya na napenda kujifunza mawazo mapya. Hebu tuchunguze MavunoBridge pamoja!"
      },

      style:
        "cheerful, curious, modern and enthusiastic",

      pitch: 1.14,
      rate: 1.0,

      skin: "#9D6745",
      skinLight: "#B77D56",
      shirt: "#3C6E9F",
      hair: "#21140F",
      hat: "#F4C430",
      hatDark: "#C49B18",

      type: "tomato"
    }
  };

  /* =========================================================
     TRANSLATIONS
     ========================================================= */

  const words = {

    en: {
      tour: "MavunoBridge Tour",
      welcome: "Karibu to MavunoBridge!",
      choose: "Choose your farmer guide",
      language: "Tour language",
      voice: "Voice",
      browserVoice: "Automatic voice",
      personality: "Personality",
      start: "Start tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish tour",
      replay: "Replay tour",
      step: "Step",
      done: "You're all set!",
      doneText:
        "Explore MavunoBridge and discover the tools available on this page.",
      close: "Close tour",

      langs: {
        en: "English",
        mix: "Sheng-English",
        sw: "Kiswahili"
      }
    },

    mix: {
      tour: "MavunoBridge Tour",
      welcome: "Karibu MavunoBridge!",
      choose: "Chagua farmer guide wako",
      language: "Lugha ya tour",
      voice: "Voice",
      browserVoice: "Automatic voice",
      personality: "Personality",
      start: "Anza tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Maliza tour",
      replay: "Replay tour",
      step: "Step",
      done: "Uko sawa kabisa!",
      doneText:
        "Explore MavunoBridge uone tools ziko available kwa hii page.",
      close: "Close tour",

      langs: {
        en: "English",
        mix: "Sheng-English",
        sw: "Kiswahili"
      }
    },

    sw: {
      tour: "Ziara ya MavunoBridge",
      welcome: "Karibu MavunoBridge!",
      choose: "Chagua mkulima atakayekuongoza",
      language: "Lugha ya ziara",
      voice: "Sauti",
      browserVoice: "Sauti ya kiotomatiki",
      personality: "Tabia",
      start: "Anza ziara",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza ziara",
      replay: "Anza ziara tena",
      step: "Hatua",
      done: "Uko tayari!",
      doneText:
        "Chunguza MavunoBridge na ujifunze kuhusu huduma zilizopo kwenye ukurasa huu.",
      close: "Funga ziara",

      langs: {
        en: "Kiingereza",
        mix: "Sheng na Kiingereza",
        sw: "Kiswahili"
      }
    }
  };

  /* =========================================================
     TOUR SCRIPTS
     ========================================================= */

  const scripts = {

    marketplace: {

      en: [
        [
          "Welcome to MavunoBridge",
          "This is the agricultural marketplace. Explore products and services from farmers and other agricultural sellers.",
          "header,.site-header,.navbar,#hero,.hero"
        ],

        [
          "Explore product categories",
          "Use the categories to find fruits, vegetables, grains, legumes and other agricultural products.",
          "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"
        ],

        [
          "Search and filter",
          "Use search and available filters to narrow down products by name, category or location.",
          "#searchInput,#searchBar,input[type=search],.marketplace-filters"
        ],

        [
          "Browse listings",
          "Check product photos, prices, quantities and farmer details before choosing what works for you.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"
        ],

        [
          "List your produce",
          "If you are a farmer, look for the sell or add listing option to share your produce with potential buyers.",
          "#sellButton,#heroSellButton,#listingForm,#sellForm"
        ],

        [
          "More tools",
          "You can also explore Smart Assist for farming information and SACCO Hub for available opportunities.",
          "a[href*=smart-assist],a[href*=sacco],nav"
        ]
      ],

      mix: [

        [
          "Karibu MavunoBridge!",
          "Hii ni agricultural marketplace. Explore products na services ambazo farmers wameweka.",
          "header,.site-header,.navbar,#hero,.hero"
        ],

        [
          "Explore categories",
          "Chagua category kama fruits, vegetables, grains, legumes na zingine kupata bidhaa unatafuta.",
          "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"
        ],

        [
          "Search na filters",
          "Tumia search na filters kupunguza results kulingana na product, category ama location.",
          "#searchInput,#searchBar,input[type=search],.marketplace-filters"
        ],

        [
          "Browse listings",
          "Angalia picha, price, quantity na farmer details kabla ya kuchagua product.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"
        ],

        [
          "List produce yako",
          "Wewe ni farmer? Tafuta sell ama add listing uweke produce yako ionekane kwa potential buyers.",
          "#sellButton,#heroSellButton,#listingForm,#sellForm"
        ],

        [
          "Explore more tools",
          "Pia unaweza kucheck Smart Assist kwa farming information na SACCO Hub kwa opportunities zilizopo.",
          "a[href*=smart-assist],a[href*=sacco],nav"
        ]
      ],

      sw: [

        [
          "Karibu MavunoBridge",
          "Hili ni soko la bidhaa za kilimo. Chunguza bidhaa na huduma zilizowekwa kwenye tovuti.",
          "header,.site-header,.navbar,#hero,.hero"
        ],

        [
          "Chunguza makundi ya bidhaa",
          "Chagua kundi kama matunda, mboga, nafaka na jamii ya mikunde ili kupata bidhaa unazohitaji.",
          "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"
        ],

        [
          "Tafuta na uchuje",
          "Tumia sehemu ya kutafuta na vichujio kupunguza matokeo kulingana na bidhaa au eneo.",
          "#searchInput,#searchBar,input[type=search],.marketplace-filters"
        ],

        [
          "Angalia bidhaa",
          "Kagua picha, bei, kiasi na maelezo ya mkulima kabla ya kuchagua bidhaa.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"
        ],

        [
          "Weka bidhaa zako",
          "Ikiwa wewe ni mkulima, tafuta sehemu ya kuuza au kuongeza bidhaa ili wanunuzi waweze kuziona.",
          "#sellButton,#heroSellButton,#listingForm,#sellForm"
        ],

        [
          "Huduma nyingine",
          "Unaweza pia kuchunguza Smart Assist kwa taarifa za kilimo na SACCO Hub kwa fursa zilizopo.",
          "a[href*=smart-assist],a[href*=sacco],nav"
        ]
      ]
    },

    smart: {

      en: [
        [
          "Welcome to Smart Assist",
          "This page is for exploring farming support and information available in MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Explore the assistant",
          "Look through the tools and guidance that are available on this page.",
          "#smartAssist,#smart-assist,.smart-assist,main"
        ],

        [
          "Ask or enter information",
          "If an input box is available, use it to enter your farming question or the details requested.",
          "#questionInput,#chatInput,#askInput,textarea,input[type=text]"
        ],

        [
          "Review the guidance",
          "Read the displayed guidance carefully. Check local conditions and trusted agricultural advice before making farming decisions.",
          "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"
        ],

        [
          "Back to the marketplace",
          "When you're ready, return to the marketplace to explore agricultural products and services.",
          "a[href*=index],a[href*=marketplace],nav"
        ]
      ],

      mix: [

        [
          "Karibu Smart Assist",
          "Hii page inakusaidia kuchunguza farming support na information ambayo iko available hapa.",
          "header,h1,.page-header"
        ],

        [
          "Explore assistant",
          "Angalia tools na guidance ambazo ziko kweli kwa hii page.",
          "#smartAssist,#smart-assist,.smart-assist,main"
        ],

        [
          "Weka swali lako",
          "Kama kuna input box, andika farming question yako ama details zinazohitajika.",
          "#questionInput,#chatInput,#askInput,textarea,input[type=text]"
        ],

        [
          "Soma guidance",
          "Soma majibu vizuri. Check local conditions na trusted agricultural advice kabla ya kufanya farming decisions.",
          "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"
        ],

        [
          "Rudi marketplace",
          "Ukiwa ready, rudi marketplace uone agricultural products na services.",
          "a[href*=index],a[href*=marketplace],nav"
        ]
      ],

      sw: [

        [
          "Karibu Smart Assist",
          "Ukurasa huu unakusaidia kuchunguza taarifa na usaidizi wa kilimo unaopatikana.",
          "header,h1,.page-header"
        ],

        [
          "Chunguza msaidizi",
          "Angalia zana na maelekezo yanayoonekana kwenye ukurasa huu.",
          "#smartAssist,#smart-assist,.smart-assist,main"
        ],

        [
          "Weka swali au taarifa",
          "Ikiwa kuna kisanduku cha kuandika, weka swali lako la kilimo au taarifa zinazohitajika.",
          "#questionInput,#chatInput,#askInput,textarea,input[type=text]"
        ],

        [
          "Soma maelekezo",
          "Soma maelezo kwa makini. Hakikisha unazingatia hali ya eneo lako na ushauri wa wataalamu wa kilimo.",
          "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"
        ],

        [
          "Rudi sokoni",
          "Ukiwa tayari, rudi sokoni kuchunguza bidhaa na huduma za kilimo.",
          "a[href*=index],a[href*=marketplace],nav"
        ]
      ]
    },

    sacco: {

      en: [
        [
          "Welcome to SACCO Hub",
          "This page helps you explore SACCO-related information and opportunities displayed by MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Explore available options",
          "Review the SACCOs or opportunities listed here. Availability depends on what has been added to the site.",
          "#saccoHub,#sacco,.sacco-hub,main"
        ],

        [
          "Check the details",
          "Read eligibility, contact information and requirements carefully before making a decision.",
          ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"
        ],

        [
          "Make informed choices",
          "Verify an organisation's details directly before sharing personal information or making payments.",
          "main"
        ],

        [
          "Continue exploring",
          "Return to the marketplace or visit Smart Assist for other available tools.",
          "nav,a[href*=index],a[href*=smart-assist]"
        ]
      ],

      mix: [

        [
          "Karibu SACCO Hub",
          "Hapa unaweza explore SACCO information na opportunities ambazo zimewekwa kwa MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Explore options",
          "Angalia SACCOs ama opportunities zilizoorodheshwa. Availability inategemea content imewekwa kwa site.",
          "#saccoHub,#sacco,.sacco-hub,main"
        ],

        [
          "Check details",
          "Soma eligibility, contact details na requirements vizuri kabla ya kuamua.",
          ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"
        ],

        [
          "Chagua kwa uangalifu",
          "Verify organisation details directly kabla ya kushare personal information ama kutuma pesa.",
          "main"
        ],

        [
          "Endelea kuchunguza",
          "Rudi marketplace ama tembelea Smart Assist kwa tools zingine zilizopo.",
          "nav,a[href*=index],a[href*=smart-assist]"
        ]
      ],

      sw: [

        [
          "Karibu SACCO Hub",
          "Hapa unaweza kuchunguza taarifa za SACCO na fursa zinazoonyeshwa kwenye MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Chunguza chaguo zilizopo",
          "Angalia SACCO na fursa zilizoorodheshwa. Upatikanaji hutegemea taarifa zilizowekwa kwenye tovuti.",
          "#saccoHub,#sacco,.sacco-hub,main"
        ],

        [
          "Kagua maelezo",
          "Soma masharti, taarifa za mawasiliano na mahitaji kwa makini kabla ya kuamua.",
          ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"
        ],

        [
          "Fanya maamuzi kwa uangalifu",
          "Thibitisha taarifa za shirika kabla ya kutoa taarifa binafsi au kutuma pesa.",
          "main"
        ],

        [
          "Endelea kuchunguza",
          "Rudi sokoni au tembelea Smart Assist kwa zana nyingine zilizopo.",
          "nav,a[href*=index],a[href*=smart-assist]"
        ]
      ]
    },

    farmer: {

      en: [
        [
          "Welcome, farmer!",
          "Let's look at the listing tools available on this page.",
          "header,h1,.page-header"
        ],

        [
          "Enter product details",
          "Add the product name and choose the correct agricultural category.",
          "#productName,#product,#category,#productCategory,form"
        ],

        [
          "Add price and quantity",
          "Enter the price and quantity requested by the form. Check the units before submitting.",
          "#price,#quantity,#listingForm,#sellForm,form"
        ],

        [
          "Add photos and location",
          "If the form supports them, add clear product photos and your correct county or location.",
          "#photo,#image,#county,#location,input[type=file],form"
        ],

        [
          "Review before submitting",
          "Double-check the details before submitting your listing. Use the confirmation shown by the website to check whether it worked.",
          "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"
        ]
      ],

      mix: [

        [
          "Karibu farmer!",
          "Tuangalie listing tools ambazo ziko kwa hii page.",
          "header,h1,.page-header"
        ],

        [
          "Weka product details",
          "Andika jina la product na uchague agricultural category inayofaa.",
          "#productName,#product,#category,#productCategory,form"
        ],

        [
          "Weka price na quantity",
          "Weka price na quantity kulingana na form. Hakikisha units ni correct.",
          "#price,#quantity,#listingForm,#sellForm,form"
        ],

        [
          "Ongeza picha na location",
          "Kama form inaruhusu, weka clear product photos na county ama location yako sahihi.",
          "#photo,#image,#county,#location,input[type=file],form"
        ],

        [
          "Kagua kabla ya kutuma",
          "Check details zote kabla ya kusubmit. Angalia confirmation ya website kuhakikisha kama imekubali listing.",
          "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"
        ]
      ],

      sw: [

        [
          "Karibu mkulima!",
          "Tuangalie zana za kuweka bidhaa zinazopatikana kwenye ukurasa huu.",
          "header,h1,.page-header"
        ],

        [
          "Weka maelezo ya bidhaa",
          "Andika jina la bidhaa na uchague kundi sahihi la kilimo.",
          "#productName,#product,#category,#productCategory,form"
        ],

        [
          "Weka bei na kiasi",
          "Weka bei na kiasi kinachohitajika kwenye fomu. Hakikisha vipimo ni sahihi.",
          "#price,#quantity,#listingForm,#sellForm,form"
        ],

        [
          "Ongeza picha na eneo",
          "Ikiwa fomu inaruhusu, weka picha zilizo wazi na kaunti au eneo lako sahihi.",
          "#photo,#image,#county,#location,input[type=file],form"
        ],

        [
          "Kagua kabla ya kutuma",
          "Kagua maelezo yote kabla ya kutuma. Angalia ujumbe wa uthibitisho ili kujua kama bidhaa imekubaliwa.",
          "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"
        ]
      ]
    },

    buyer: {

      en: [
        [
          "Welcome, buyer!",
          "Let's explore how to browse products on MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Search for products",
          "Use the search field if available to find a product by name.",
          "#searchInput,#searchBar,input[type=search]"
        ],

        [
          "Browse and compare",
          "Compare the displayed prices, quantities, locations and product details.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,main"
        ],

        [
          "Check farmer details",
          "Review the seller information shown on a listing before contacting the farmer.",
          ".product-card,.listing-card,.product-details,main"
        ],

        [
          "Choose carefully",
          "Confirm price, quantity, delivery and payment arrangements directly with the seller before making a purchase.",
          "#cartButton,#cart,main"
        ]
      ],

      mix: [

        [
          "Karibu buyer!",
          "Tuangalie vile unaweza browse products kwa MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Search products",
          "Tumia search field kama iko ili kupata product kwa jina.",
          "#searchInput,#searchBar,input[type=search]"
        ],

        [
          "Browse na compare",
          "Compare prices, quantities, locations na product details zinazoonyeshwa.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,main"
        ],

        [
          "Check farmer details",
          "Angalia seller information kwa listing kabla ya kucontact farmer.",
          ".product-card,.listing-card,.product-details,main"
        ],

        [
          "Chagua kwa makini",
          "Confirm price, quantity, delivery na payment arrangements na seller kabla ya kununua.",
          "#cartButton,#cart,main"
        ]
      ],

      sw: [

        [
          "Karibu mnunuzi!",
          "Tuangalie jinsi ya kuchunguza bidhaa kwenye MavunoBridge.",
          "header,h1,.page-header"
        ],

        [
          "Tafuta bidhaa",
          "Tumia sehemu ya kutafuta ikiwa ipo ili kupata bidhaa kwa jina.",
          "#searchInput,#searchBar,input[type=search]"
        ],

        [
          "Chunguza na kulinganisha",
          "Linganisha bei, kiasi, maeneo na maelezo ya bidhaa yanayoonyeshwa.",
          "#listingGrid,#marketplaceGrid,#products,.product-grid,main"
        ],

        [
          "Kagua taarifa za mkulima",
          "Soma taarifa za muuzaji kwenye tangazo kabla ya kuwasiliana naye.",
          ".product-card,.listing-card,.product-details,main"
        ],

        [
          "Chagua kwa uangalifu",
          "Thibitisha bei, kiasi, usafirishaji na malipo na muuzaji kabla ya kununua.",
          "#cartButton,#cart,main"
        ]
      ]
    }
  };

  /* =========================================================
     HTML ESCAPE
     ========================================================= */

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  /* =========================================================
     PAGE DETECTION
     ========================================================= */

  function detectPage() {

    const path = location.pathname.toLowerCase();
    const title = document.title.toLowerCase();
    const bodyPage =
      (document.body?.dataset.page || "").toLowerCase();

    const combined =
      `${path} ${title} ${bodyPage}`;

    if (/smart[-_ ]?assist|smart_assist/.test(combined)) {
      return "smart";
    }

    if (/sacco/.test(combined)) {
      return "sacco";
    }

    if (/farmer|listing|sell-product|add-product/.test(combined)) {
      return "farmer";
    }

    if (/buyer|checkout/.test(combined)) {
      return "buyer";
    }

    return "marketplace";
  }

  function currentWords() {
    return words[state.language] || words.en;
  }

  function getSteps() {

    const page =
      scripts[state.page] || scripts.marketplace;

    return page[state.language] || page.en;
  }

  /* =========================================================
     REALISTIC FARMER AVATAR SVG
     ========================================================= */

  function avatarSVG(id, talking = false) {

    const f =
      farmers[id] || farmers.akinyi;

    const mouth = talking

      ? `
        <ellipse
          cx="100"
          cy="118"
          rx="8"
          ry="6"
          fill="#57251F"
        />

        <ellipse
          cx="100"
          cy="116"
          rx="4"
          ry="2"
          fill="#F4B7A8"
        />
      `

      : `
        <path
          d="M91 117 Q100 123 109 117"
          fill="none"
          stroke="#5C2A24"
          stroke-width="2.7"
          stroke-linecap="round"
        />
      `;

    let headwear = "";

    /* ---------------------------------------------------------
       BABA OTIENO
       --------------------------------------------------------- */

    if (id === "baba") {

      headwear = `
        <path
          d="M58 68
             Q63 29 100 27
             Q137 29 142 68
             Z"
          fill="${f.hat}"
          stroke="${f.hatDark}"
          stroke-width="2.5"
        />

        <ellipse
          cx="100"
          cy="68"
          rx="51"
          ry="10"
          fill="${f.hat}"
          stroke="${f.hatDark}"
          stroke-width="2.5"
        />

        <path
          d="M67 50 Q100 40 133 50"
          fill="none"
          stroke="#C29A42"
          stroke-width="2"
        />

        <path
          d="M72 41 Q100 34 128 41"
          fill="none"
          stroke="#C29A42"
          stroke-width="2"
        />

        <path
          d="M79 33 Q100 28 121 33"
          fill="none"
          stroke="#F3D887"
          stroke-width="2"
        />
      `;
    }

    /* ---------------------------------------------------------
       KAMAU
       --------------------------------------------------------- */

    else if (id === "kamau") {

      headwear = `
        <path
          d="M63 67
             Q60 35 100 30
             Q140 35 137 67
             Z"
          fill="${f.hat}"
          stroke="${f.hatDark}"
          stroke-width="2.5"
        />

        <path
          d="M64 61
             Q100 49 136 61
             L139 70
             Q100 59 61 70
             Z"
          fill="${f.hatDark}"
        />

        <path
          d="M100 32 L100 62"
          stroke="#A32C21"
          stroke-width="2"
        />

        <path
          d="M79 40 Q100 34 121 40"
          fill="none"
          stroke="#E86B5D"
          stroke-width="2"
        />
      `;
    }

    /* ---------------------------------------------------------
       MAMA WANJIRU
       --------------------------------------------------------- */

    else if (id === "wanjiru") {

      headwear = `
        <path
          d="M57 80
             Q54 40 100 30
             Q146 40 143 80
             L132 72
             Q100 53 68 72
             Z"
          fill="${f.hat}"
          stroke="${f.hatDark}"
          stroke-width="2.5"
        />

        <path
          d="M67 57 Q100 43 133 57"
          fill="none"
          stroke="#F7B77B"
          stroke-width="3"
        />

        <path
          d="M64 68 Q100 51 136 68"
          fill="none"
          stroke="#F7B77B"
          stroke-width="3"
        />

        <path
          d="M76 40 Q100 30 124 40"
          fill="none"
          stroke="#286F83"
          stroke-width="3"
        />
      `;
    }

    /* ---------------------------------------------------------
       AKINYI
       --------------------------------------------------------- */

    else {

      headwear = `
        <path
          d="M68 67
             Q61 35 100 27
             Q139 35 132 67
             Z"
          fill="#21140F"
        />

        <circle
          cx="72"
          cy="46"
          r="20"
          fill="#21140F"
        />

        <circle
          cx="128"
          cy="46"
          r="20"
          fill="#21140F"
        />

        <path
          d="M64 51
             Q100 35 136 51
             L131 64
             Q100 52 69 64
             Z"
          fill="#21140F"
        />

        <path
          d="M70 48
             Q100 35 130 48
             L128 59
             Q100 49 72 59
             Z"
          fill="${f.hat}"
        />

        <path
          d="M73 49 Q100 39 127 49"
          fill="none"
          stroke="#F9D95B"
          stroke-width="2"
        />
      `;
    }

    /* ---------------------------------------------------------
       BEARD
       --------------------------------------------------------- */

    const beard =
      id === "baba"

        ? `
          <path
            d="M75 109
               Q72 139 100 151
               Q128 139 125 109
               Q116 128 100 130
               Q84 128 75 109
               Z"
            fill="#D2D2D2"
          />

          <path
            d="M81 132 Q100 142 119 132"
            fill="none"
            stroke="#B1B1B1"
            stroke-width="2"
          />
        `

        : "";

    /* ---------------------------------------------------------
       TOMATO BASKET
       --------------------------------------------------------- */

    const tomatoes =
      id === "akinyi"

        ? `
          <path
            d="M52 169
               L60 143
               L140 143
               L148 169
               Z"
            fill="#A8753B"
            stroke="#704822"
            stroke-width="2"
          />

          <path
            d="M60 153 L140 153
               M62 161 L138 161
               M76 144 L76 168
               M100 144 L100 168
               M124 144 L124 168"
            stroke="#765025"
            stroke-width="2"
          />

          <circle
            cx="80"
            cy="143"
            r="12"
            fill="#D83A2C"
          />

          <circle
            cx="100"
            cy="137"
            r="13"
            fill="#E04431"
          />

          <circle
            cx="120"
            cy="143"
            r="12"
            fill="#D83A2C"
          />

          <path
            d="M76 132 L80 136 L84 132
               M96 125 L100 130 L104 125
               M116 132 L120 136 L124 132"
            fill="none"
            stroke="#4F7A3A"
            stroke-width="3"
            stroke-linecap="round"
          />
        `
        : "";

    return `
      <svg
        class="mbt-avatar-svg"
        viewBox="0 0 200 200"
        role="img"
        aria-label="${escapeHTML(f.name)}, ${escapeHTML(f.role)}"
        xmlns="http://www.w3.org/2000/svg"
      >

        <defs>

          <clipPath id="mbtClip-${id}">
            <circle cx="100" cy="100" r="96"/>
          </clipPath>

          <linearGradient
            id="mbtSky-${id}"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#BFD8E5"
            />

            <stop
              offset=".58"
              stop-color="#E8D8B8"
            />

            <stop
              offset="1"
              stop-color="#F0C991"
            />
          </linearGradient>

          <linearGradient
            id="mbtFace-${id}"
            x1="0"
            y1="0"
            x2=".8"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="${f.skinLight}"
            />

            <stop
              offset="1"
              stop-color="${f.skin}"
            />
          </linearGradient>

          <linearGradient
            id="mbtShirt-${id}"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="${f.shirt}"
            />

            <stop
              offset="1"
              stop-color="#163A27"
              stop-opacity=".28"
            />
          </linearGradient>

        </defs>

        <g clip-path="url(#mbtClip-${id})">

          <!-- SKY -->

          <circle
            cx="100"
            cy="100"
            r="96"
            fill="url(#mbtSky-${id})"
          />

          <!-- SUN -->

          <circle
            cx="161"
            cy="36"
            r="17"
            fill="#FFE7A1"
            opacity=".65"
          />

          <!-- CLOUDS -->

          <ellipse
            cx="39"
            cy="42"
            rx="27"
            ry="10"
            fill="white"
            opacity=".28"
          />

          <ellipse
            cx="150"
            cy="57"
            rx="31"
            ry="11"
            fill="white"
            opacity=".22"
          />

          <!-- FARM LAND -->

          <path
            d="
              M0 113
              Q32 83 68 105
              T136 98
              T200 106
              V200
              H0
              Z
            "
            fill="#91B66C"
          />

          <path
            d="
              M0 138
              Q37 106 77 128
              T150 119
              T200 130
              V200
              H0
              Z
            "
            fill="#719E56"
          />

          <!-- FARM ROWS -->

          <path
            d="M4 157 Q46 139 87 157 T180 153"
            fill="none"
            stroke="#5D8846"
            stroke-width="4"
            opacity=".65"
          />

          <path
            d="M18 174 Q56 157 94 174 T185 170"
            fill="none"
            stroke="#5D8846"
            stroke-width="4"
            opacity=".55"
          />

          <!-- BODY -->

          <path
            d="
              M38 201
              Q42 154 68 142
              Q100 130 132 142
              Q158 154 162 201
              Z
            "
            fill="url(#mbtShirt-${id})"
          />

          <!-- NECK -->

          <path
            d="
              M84 115
              L84 146
              L116 146
              L116 115
              Z
            "
            fill="url(#mbtFace-${id})"
          />

          <!-- SHIRT COLLAR -->

          <path
            d="
              M83 143
              L100 164
              L117 143
              L113 139
              L100 153
              L87 139
              Z
            "
            fill="#F4EFE0"
            opacity=".94"
          />

          <!-- SHOULDERS -->

          <path
            d="
              M39 200
              Q43 161 69 146
              L77 200
              Z
            "
            fill="${f.shirt}"
            opacity=".9"
          />

          <path
            d="
              M161 200
              Q157 161 131 146
              L123 200
              Z
            "
            fill="${f.shirt}"
            opacity=".9"
          />

          <!-- EARS -->

          <ellipse
            cx="68"
            cy="91"
            rx="9"
            ry="13"
            fill="${f.skin}"
          />

          <ellipse
            cx="132"
            cy="91"
            rx="9"
            ry="13"
            fill="${f.skin}"
          />

          <path
            d="M66 88 Q71 91 66 97"
            fill="none"
            stroke="${f.skinLight}"
            stroke-width="2"
          />

          <path
            d="M134 88 Q129 91 134 97"
            fill="none"
            stroke="${f.skinLight}"
            stroke-width="2"
          />

          <!-- FACE -->

          <ellipse
            cx="100"
            cy="91"
            rx="35"
            ry="44"
            fill="url(#mbtFace-${id})"
          />

          <!-- FACE LIGHT -->

          <ellipse
            cx="91"
            cy="77"
            rx="15"
            ry="22"
            fill="#FFFFFF"
            opacity=".055"
          />

          <!-- CHEEKS -->

          <ellipse
            cx="77"
            cy="106"
            rx="9"
            ry="6"
            fill="#E97D73"
            opacity=".17"
          />

          <ellipse
            cx="123"
            cy="106"
            rx="9"
            ry="6"
            fill="#E97D73"
            opacity=".17"
          />

          <!-- HEADWEAR / HAIR -->

          ${headwear}

          <!-- EYEBROWS -->

          <path
            d="M75 81 Q85 75 94 81"
            fill="none"
            stroke="#241710"
            stroke-width="4"
            stroke-linecap="round"
          />

          <path
            d="M106 81 Q115 75 125 81"
            fill="none"
            stroke="#241710"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- EYES -->

          <ellipse
            cx="86"
            cy="91"
            rx="7.5"
            ry="5.8"
            fill="#FFF"
          />

          <ellipse
            cx="114"
            cy="91"
            rx="7.5"
            ry="5.8"
            fill="#FFF"
          />

          <ellipse
            cx="87"
            cy="91"
            rx="3.5"
            ry="4"
            fill="#23150F"
          />

          <ellipse
            cx="113"
            cy="91"
            rx="3.5"
            ry="4"
            fill="#23150F"
          />

          <circle
            cx="88"
            cy="89.5"
            r="1.2"
            fill="#FFF"
          />

          <circle
            cx="114"
            cy="89.5"
            r="1.2"
            fill="#FFF"
          />

          <!-- NOSE -->

          <path
            d="
              M100 94
              Q95 103 99 107
              Q103 109 106 106
            "
            fill="none"
            stroke="#70422F"
            stroke-width="2.3"
            stroke-linecap="round"
          />

          <path
            d="M96 108 Q100 110 104 108"
            fill="none"
            stroke="#6B3B2C"
            stroke-width="1.5"
          />

          <!-- MOUTH -->

          ${mouth}

          <!-- BABA BEARD -->

          ${beard}

          <!-- AKINYI EARRINGS -->

          ${
            id === "akinyi"

              ? `
                <circle
                  cx="70"
                  cy="110"
                  r="4.5"
                  fill="#F4C430"
                />

                <circle
                  cx="130"
                  cy="110"
                  r="4.5"
                  fill="#F4C430"
                />
              `
              : ""
          }

          <!-- WANJIRU EARRINGS -->

          ${
            id === "wanjiru"

              ? `
                <circle
                  cx="70"
                  cy="110"
                  r="4.5"
                  fill="#F1C40F"
                />

                <circle
                  cx="130"
                  cy="110"
                  r="4.5"
                  fill="#F1C40F"
                />
              `
              : ""
          }

          <!-- KAMAU SHIRT DETAIL -->

          ${
            id === "kamau"

              ? `
                <path
                  d="M72 151 L128 151"
                  stroke="#B87A12"
                  stroke-width="2"
                  opacity=".6"
                />

                <path
                  d="M82 165 L118 165"
                  stroke="#B87A12"
                  stroke-width="2"
                  opacity=".6"
                />
              `
              : ""
          }

          <!-- BABA FACIAL DETAIL -->

          ${
            id === "baba"

              ? `
                <path
                  d="M78 84 Q100 73 122 84"
                  stroke="#BDBDBD"
                  stroke-width="3"
                  fill="none"
                />
              `
              : ""
          }

          <!-- TOMATO BASKET -->

          ${tomatoes}

        </g>

        <!-- OUTER FRAME -->

        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="5"
        />

        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#315A3D"
          stroke-width="1.5"
          opacity=".55"
        />

      </svg>
    `;
  }

  /* =========================================================
     PERSONALITY TEXT
     ========================================================= */

  function personalityText(farmer) {

    if (state.language === "sw") {
      return `${farmer.personality}. ${farmer.description}`;
    }

    if (state.language === "mix") {
      return `${farmer.personality}. ${farmer.description}`;
    }

    return `${farmer.personality}. ${farmer.description}`;
  }

  /* =========================================================
     STYLES
     ========================================================= */

  function addStyles() {

    if (document.getElementById("mavuno-tour-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "mavuno-tour-styles";

    style.textContent = `

      /* =====================================================
         GLOBAL
         ===================================================== */

      #mbt-launcher,
      #mbt-panel,
      #mbt-guide,
      #mbt-spotlight,
      #mbt-overlay {
        box-sizing: border-box;
      }

      /* =====================================================
         LAUNCHER
         ===================================================== */

      #mbt-launcher {
        position: fixed;
        z-index: 99990;

        right: 18px;
        bottom: 18px;

        border: 0;
        border-radius: 999px;

        padding: 12px 18px;

        background: #285438;
        color: #fff;

        font:
          700 14px/1.3
          system-ui,
          sans-serif;

        cursor: pointer;

        box-shadow:
          0 8px 25px #0003;

        transition:
          transform .2s ease,
          background .2s ease;
      }

      #mbt-launcher:hover {
        background: #1d402c;
        transform: translateY(-2px);
      }

      /* =====================================================
         DARK OVERLAY
         ===================================================== */

      #mbt-overlay {
        position: fixed;
        inset: 0;

        z-index: 99991;

        background:
          rgb(15 29 20 / 48%);

        pointer-events: none;
      }

      /* =====================================================
         SPOTLIGHT
         ===================================================== */

      #mbt-spotlight {
        position: fixed;

        z-index: 99992;

        pointer-events: none;

        border:
          3px solid #EBC76B;

        border-radius: 15px;

        box-shadow:
          0 0 0 5px
          rgb(235 199 107 / 24%),

          0 0 35px
          rgb(235 199 107 / 40%);

        transition:
          all .25s ease;
      }

      /* =====================================================
         FARMER GUIDE
         DESKTOP = TOP LEFT
         This prevents collision with the bottom panel.
         ===================================================== */

      #mbt-guide {
        position: fixed;

        z-index: 99994;

        left: 18px;
        top: 18px;

        width: 130px;

        text-align: center;

        pointer-events: none;

        animation:
          mbt-float
          2.8s
          ease-in-out
          infinite;
      }

      .mbt-avatar-frame {
        width: 112px;
        height: 112px;

        margin: auto;

        border-radius: 50%;

        padding: 4px;

        background: #fff;

        box-shadow:
          0 10px 30px #0003;

        overflow: hidden;
      }

      .mbt-avatar-svg {
        display: block;

        width: 100%;
        height: 100%;
      }

      #mbt-guide-name {
        display: inline-block;

        margin-top: 6px;

        padding: 5px 10px;

        background: #fff;

        color: #23442e;

        border-radius: 999px;

        font:
          750 12px
          system-ui,
          sans-serif;

        box-shadow:
          0 3px 12px #0002;
      }

      #mbt-guide-personality {
        display: inline-block;

        margin-top: 4px;

        max-width: 125px;

        padding: 4px 8px;

        background:
          rgb(29 64 44 / 94%);

        color: #fff;

        border-radius: 999px;

        font:
          700 9px
          system-ui,
          sans-serif;

        line-height: 1.2;
      }

      /* =====================================================
         MAIN PANEL
         ===================================================== */

      #mbt-panel {
        position: fixed;

        z-index: 99995;

        right: 18px;
        bottom: 18px;

        width:
          min(
            430px,
            calc(100vw - 36px)
          );

        max-height:
          min(
            82vh,
            760px
          );

        overflow-y: auto;

        padding: 18px;

        border:
          1px solid #dce7d8;

        border-radius: 20px;

        background: #fff;

        color: #20352a;

        box-shadow:
          0 18px 55px #0003;

        font:
          14px/1.5
          system-ui,
          sans-serif;

        scrollbar-width: thin;
      }

      #mbt-panel * {
        box-sizing: border-box;
      }

      /* =====================================================
         HEADER
         ===================================================== */

      .mbt-topline {
        display: flex;

        align-items: flex-start;

        justify-content:
          space-between;

        gap: 10px;
      }

      .mbt-eyebrow {
        color: #477e4e;

        font-size: 11px;

        font-weight: 800;

        letter-spacing: .1em;

        text-transform: uppercase;
      }

      .mbt-title {
        margin:
          3px 0 8px;

        color: #153322;

        font-size: 21px;

        line-height: 1.2;
      }

      .mbt-close {
        flex:
          0 0 auto;

        border: 0;

        border-radius: 10px;

        padding:
          6px 10px;

        background: #edf3e9;

        color: #23442e;

        cursor: pointer;

        font-size: 18px;
      }

      .mbt-close:hover {
        background: #dfeadb;
      }

      .mbt-description {
        margin:
          8px 0 14px;
      }

      /* =====================================================
         PERSONALITY BOX
         ===================================================== */

      .mbt-personality-box {
        display: flex;

        gap: 10px;

        align-items: center;

        margin:
          10px 0 14px;

        padding: 10px;

        border:
          1px solid #dce8d8;

        border-radius: 13px;

        background:
          linear-gradient(
            135deg,
            #f6faf3,
            #edf5e9
          );
      }

      .mbt-personality-icon {
        width: 40px;
        height: 40px;

        flex:
          0 0 40px;

        display: grid;

        place-items: center;

        border-radius: 50%;

        background: #fff;

        box-shadow:
          0 3px 10px #0001;

        font-size: 22px;
      }

      .mbt-personality-text {
        min-width: 0;
      }

      .mbt-personality-label {
        color: #477e4e;

        font-size: 10px;

        font-weight: 800;

        text-transform: uppercase;

        letter-spacing: .06em;
      }

      .mbt-personality-value {
        margin-top: 2px;

        color: #20352a;

        font-size: 12px;

        font-weight: 750;
      }

      /* =====================================================
         FORM FIELDS
         ===================================================== */

      .mbt-field {
        margin-top: 12px;
      }

      .mbt-field label {
        display: block;

        margin-bottom: 5px;

        font-size: 12px;

        font-weight: 750;
      }

      .mbt-field select {
        width: 100%;

        min-height: 40px;

        border:
          1px solid #d4dfd1;

        border-radius: 10px;

        padding:
          8px 10px;

        background: #fff;

        color: #20352a;

        font: inherit;
      }

      .mbt-field select:focus {
        outline:
          2px solid
          rgb(71 126 78 / 25%);

        border-color:
          #477e4e;
      }

      /* =====================================================
         AVATAR SELECTOR
         ===================================================== */

      .mbt-avatar-options {
        display: grid;

        grid-template-columns:
          repeat(
            4,
            minmax(0, 1fr)
          );

        gap: 7px;
      }

      .mbt-avatar-option {
        min-width: 0;

        border:
          2px solid #e0e8dc;

        border-radius: 12px;

        padding:
          5px 3px;

        background: #f7faf5;

        color: #20352a;

        cursor: pointer;

        font: inherit;

        transition:
          transform .15s ease,
          border-color .15s ease,
          background .15s ease;
      }

      .mbt-avatar-option:hover {
        transform:
          translateY(-2px);

        border-color:
          #9db89c;
      }

      .mbt-avatar-option[aria-pressed="true"] {
        border-color:
          #477e4e;

        background:
          #eaf3e5;

        box-shadow:
          0 4px 14px
          rgb(71 126 78 / 15%);
      }

      .mbt-avatar-option .mbt-avatar-svg {
        max-width: 72px;

        margin: auto;
      }

      .mbt-avatar-option span {
        display: block;

        overflow-wrap:
          anywhere;

        font-size: 10px;

        font-weight: 750;
      }

      .mbt-avatar-personality {
        display: block;

        margin-top: 2px;

        color: #68786d;

        font-size: 8px;

        line-height: 1.15;
      }

      /* =====================================================
         PROGRESS
         ===================================================== */

      .mbt-progress {
        height: 6px;

        margin:
          12px 0;

        overflow: hidden;

        border-radius: 99px;

        background:
          #e9efe5;
      }

      .mbt-progress > div {
        height: 100%;

        width: 0;

        background:
          #477e4e;

        transition:
          width .2s ease;
      }

      .mbt-step-count {
        color: #5f7064;

        font-size: 12px;

        font-weight: 750;
      }

      /* =====================================================
         BUTTONS
         ===================================================== */

      .mbt-actions {
        display: flex;

        flex-wrap: wrap;

        gap: 8px;

        margin-top: 15px;
      }

      .mbt-button {
        flex:
          1 1 auto;

        min-height: 40px;

        border: 0;

        border-radius: 11px;

        padding:
          10px 13px;

        background:
          #285438;

        color: #fff;

        cursor: pointer;

        font:
          750 13px
          system-ui,
          sans-serif;

        transition:
          transform .15s ease,
          background .15s ease;
      }

      .mbt-button:hover {
        background:
          #1d402c;

        transform:
          translateY(-1px);
      }

      .mbt-button.secondary {
        background:
          #edf3e9;

        color:
          #23442e;
      }

      .mbt-button.secondary:hover {
        background:
          #dfeadb;
      }

      .mbt-button:disabled {
        opacity: .45;

        cursor:
          not-allowed;

        transform: none;
      }

      .mbt-note {
        margin-top: 10px;

        color:
          #617165;

        font-size: 11px;
      }

      /* =====================================================
         ANIMATIONS
         ===================================================== */

      @keyframes mbt-float {

        0%,
        100% {
          transform:
            translateY(0)
            rotate(0deg);
        }

        50% {
          transform:
            translateY(-7px)
            rotate(-1deg);
        }
      }

      @keyframes mbt-wave {

        0%,
        100% {
          transform:
            rotate(0);
        }

        25% {
          transform:
            rotate(-8deg);
        }

        75% {
          transform:
            rotate(8deg);
        }
      }

      #mbt-guide.mbt-waving {
        animation:
          mbt-wave
          .5s
          ease-in-out
          3;
      }

      /* =====================================================
         MOBILE
         
         IMPORTANT:
         Guide is at the TOP.
         Panel is at the BOTTOM.
         Panel has a reserved gap so they cannot overlap.
         ===================================================== */

      @media (max-width: 600px) {

        #mbt-guide {
          left: 8px;
          top: 8px;

          width: 78px;
        }

        .mbt-avatar-frame {
          width: 64px;
          height: 64px;
        }

        #mbt-guide-name {
          max-width: 78px;

          margin-top: 3px;

          padding:
            3px 6px;

          font-size: 9px;
        }

        #mbt-guide-personality {
          max-width: 78px;

          padding:
            3px 5px;

          font-size: 7px;
        }

        #mbt-panel {
          left: 8px;
          right: 8px;

          bottom: 8px;

          width:
            auto;

          /*
           * This creates enough vertical space
           * for the avatar above.
           */
          max-height:
            calc(
              100dvh - 105px
            );

          padding:
            14px;

          border-radius:
            17px;
        }

        .mbt-title {
          font-size: 19px;
        }

        .mbt-avatar-options {
          gap: 5px;
        }

        .mbt-avatar-option {
          padding:
            4px 2px;
        }

        .mbt-avatar-option .mbt-avatar-svg {
          max-width: 58px;
        }

        .mbt-avatar-option span {
          font-size: 8px;
        }

        .mbt-avatar-personality {
          font-size: 7px;
        }

        .mbt-personality-box {
          padding: 8px;
        }

        .mbt-personality-icon {
          width: 34px;
          height: 34px;

          flex-basis: 34px;

          font-size: 18px;
        }

        .mbt-actions {
          gap: 6px;
        }

        .mbt-button {
          min-height: 38px;

          padding:
            9px 10px;

          font-size: 12px;
        }

        #mbt-launcher {
          right: 10px;
          bottom: 10px;

          padding:
            10px 14px;
        }
      }

      /* =====================================================
         VERY SMALL PHONES
         ===================================================== */

      @media (max-width: 380px) {

        #mbt-guide {
          width: 65px;
        }

        .mbt-avatar-frame {
          width: 55px;
          height: 55px;
        }

        #mbt-guide-name {
          max-width: 65px;

          font-size: 8px;
        }

        #mbt-guide-personality {
          display: none;
        }

        #mbt-panel {
          max-height:
            calc(
              100dvh - 88px
            );

          padding:
            11px;
        }

        .mbt-title {
          font-size: 17px;
        }

        .mbt-description {
          font-size: 12px;
        }

        .mbt-field {
          margin-top: 9px;
        }

        .mbt-actions {
          margin-top: 10px;
        }
      }

      /* =====================================================
         REDUCED MOTION
         ===================================================== */

      @media (prefers-reduced-motion: reduce) {

        #mbt-guide,
        #mbt-guide.mbt-waving {
          animation:
            none !important;
        }

        #mbt-spotlight,
        .mbt-progress > div {
          transition:
            none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     ELEMENT CREATOR
     ========================================================= */

  function makeElement(
    tag,
    id,
    parent = document.body
  ) {

    const element =
      document.createElement(tag);

    if (id) {
      element.id = id;
    }

    parent.appendChild(element);

    return element;
  }

  /* =========================================================
     STOP SPEECH
     ========================================================= */

  function stopSpeech() {

    state.session++;

    state.speaking = false;

    if (state.mouthTimer) {

      clearInterval(
        state.mouthTimer
      );

      state.mouthTimer = null;
    }

    if ("speechSynthesis" in window) {

      window.speechSynthesis.cancel();
    }

    if (state.guide) {
      renderGuide(false);
    }
  }

  /* =========================================================
     LOAD BROWSER VOICES
     ========================================================= */

  function loadVoices() {

    if (!("speechSynthesis" in window)) {
      return;
    }

    state.voices =
      window.speechSynthesis
        .getVoices() || [];

    if (state.panel) {

      const select =
        state.panel.querySelector(
          "#mbt-voice"
        );

      if (select) {
        fillVoiceOptions(select);
      }
    }
  }

  /* =========================================================
     VOICE OPTIONS
     ========================================================= */

  function voiceOptionsForLanguage() {

    const prefix = {

      en: [
        "en-KE",
        "en-GB",
        "en-US",
        "en"
      ],

      mix: [
        "en-KE",
        "en-GB",
        "en-US",
        "en"
      ],

      sw: [
        "sw-KE",
        "sw-TZ",
        "sw"
      ]

    }[state.language] || ["en"];

    const voices =
      state.voices.slice();

    return voices.sort(
      (a, b) => {

        const aIndex =
          prefix.findIndex(
            p =>
              a.lang
                .toLowerCase()
                .startsWith(
                  p.toLowerCase()
                )
          );

        const bIndex =
          prefix.findIndex(
            p =>
              b.lang
                .toLowerCase()
                .startsWith(
                  p.toLowerCase()
                )
          );

        return (
          (aIndex < 0 ? 999 : aIndex) -
          (bIndex < 0 ? 999 : bIndex)
        );
      }
    );
  }

  function fillVoiceOptions(select) {

    const t =
      currentWords();

    const previous =
      state.voiceURI;

    select.innerHTML = "";

    const automatic =
      document.createElement(
        "option"
      );

    automatic.value = "";

    automatic.textContent =
      t.browserVoice;

    select.appendChild(
      automatic
    );

    voiceOptionsForLanguage()
      .forEach(voice => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          voice.voiceURI;

        option.textContent =
          `${voice.name} (${voice.lang})`;

        select.appendChild(
          option
        );
      });

    select.value =
      previous;

    if (
      select.value !==
      previous
    ) {
      select.value = "";
    }
  }

  /* =========================================================
     CHOOSE VOICE
     ========================================================= */

  function chooseVoice() {

    const voices =
      voiceOptionsForLanguage();

    if (state.voiceURI) {

      const chosen =
        voices.find(
          voice =>
            voice.voiceURI ===
            state.voiceURI
        );

      if (chosen) {
        return chosen;
      }
    }

    const preferredPrefix =
      state.language === "sw"
        ? "sw"
        : "en";

    return (
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(
              preferredPrefix
            )
      )
      ||
      voices[0]
      ||
      null
    );
  }

  /* =========================================================
     SPEECH
     ========================================================= */

  function speak(text) {

    stopSpeech();

    if (
      !("speechSynthesis" in window) ||
      !text
    ) {
      return;
    }

    const session =
      state.session;

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    const voice =
      chooseVoice();

    if (voice) {
      utterance.voice =
        voice;
    }

    utterance.lang =
      state.language === "sw"
        ? "sw-KE"
        : "en-KE";

    /*
     * Personality affects voice.
     */

    utterance.pitch =
      farmer.pitch;

    utterance.rate =
      farmer.rate;

    utterance.onstart = () => {

      if (
        session !==
        state.session
      ) {
        return;
      }

      state.speaking = true;

      if (state.guide) {
        renderGuide(true);
      }

      state.mouthTimer =
        setInterval(
          () => {

            if (
              session !==
                state.session ||
              !state.speaking
            ) {
              return;
            }

            renderGuide(
              Math.random() > 0.45
            );

          },
          150
        );
    };

    utterance.onend = () => {

      if (
        session !==
        state.session
      ) {
        return;
      }

      state.speaking = false;

      if (state.mouthTimer) {

        clearInterval(
          state.mouthTimer
        );

        state.mouthTimer = null;
      }

      if (state.guide) {
        renderGuide(false);
      }
    };

    utterance.onerror = () => {

      if (
        session !==
        state.session
      ) {
        return;
      }

      state.speaking = false;

      if (state.mouthTimer) {

        clearInterval(
          state.mouthTimer
        );

        state.mouthTimer = null;
      }

      if (state.guide) {
        renderGuide(false);
      }
    };

    window.speechSynthesis
      .speak(utterance);
  }

  /* =========================================================
     PERSONALITY INTRO
     ========================================================= */

  function getPersonalityIntro() {

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    return (
      farmer.intro[state.language] ||
      farmer.intro.en
    );
  }

  /* =========================================================
     GUIDE RENDER
     ========================================================= */

  function renderGuide(
    talking = state.speaking
  ) {

    if (!state.guide) {
      return;
    }

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    state.guide.innerHTML = `

      <div class="mbt-avatar-frame">
        ${avatarSVG(
          state.avatar,
          talking
        )}
      </div>

      <div id="mbt-guide-name">
        ${escapeHTML(
          farmer.name
        )}
      </div>

      <div id="mbt-guide-personality">
        ${escapeHTML(
          farmer.personalityShort
        )}
      </div>
    `;
  }

  /* =========================================================
     CREATE GUIDE
     ========================================================= */

  function createGuide() {

    if (state.guide) {
      return;
    }

    state.guide =
      makeElement(
        "div",
        "mbt-guide"
      );

    state.guide.setAttribute(
      "aria-live",
      "polite"
    );

    renderGuide();
  }

  /* =========================================================
     FIND TARGET
     ========================================================= */

  function findTarget(selector) {

    if (!selector) {
      return null;
    }

    const candidates =
      selector
        .split(",")
        .map(
          s => s.trim()
        );

    for (
      const candidate of candidates
    ) {

      try {

        const elements =
          document.querySelectorAll(
            candidate
          );

        for (
          const element of elements
        ) {

          if (
            !element ||
            element.closest(
              "#mbt-panel,#mbt-guide,#mbt-launcher"
            )
          ) {
            continue;
          }

          const rect =
            element.getBoundingClientRect();

          const style =
            getComputedStyle(
              element
            );

          if (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          ) {
            return element;
          }
        }

      } catch (error) {
        /*
         * Ignore invalid selectors.
         */
      }
    }

    return null;
  }

  /* =========================================================
     CLEAR SPOTLIGHT
     ========================================================= */

  function clearSpotlight() {

    if (state.spotlight) {
      state.spotlight.style.display =
        "none";
    }

    if (state.overlay) {
      state.overlay.style.display =
        "none";
    }
  }

  /* =========================================================
     SHOW SPOTLIGHT
     ========================================================= */

  function showSpotlight(element) {

    if (!element) {
      clearSpotlight();
      return;
    }

    if (!state.overlay) {

      state.overlay =
        makeElement(
          "div",
          "mbt-overlay"
        );
    }

    if (!state.spotlight) {

      state.spotlight =
        makeElement(
          "div",
          "mbt-spotlight"
        );
    }

    const reduced =
      matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    element.scrollIntoView({

      behavior:
        reduced
          ? "auto"
          : "smooth",

      block: "center",

      inline: "nearest"
    });

    const position = () => {

      const rect =
        element.getBoundingClientRect();

      const pad = 5;

      state.spotlight.style.display =
        "block";

      state.spotlight.style.top =
        `${Math.max(
          4,
          rect.top - pad
        )}px`;

      state.spotlight.style.left =
        `${Math.max(
          4,
          rect.left - pad
        )}px`;

      state.spotlight.style.width =
        `${Math.min(
          innerWidth - 8,
          rect.width +
            pad * 2
        )}px`;

      state.spotlight.style.height =
        `${Math.min(
          innerHeight - 8,
          rect.height +
            pad * 2
        )}px`;

      state.overlay.style.display =
        "block";
    };

    requestAnimationFrame(
      position
    );

    setTimeout(
      position,
      300
    );
  }

  /* =========================================================
     PANEL
     ========================================================= */

  function ensurePanel() {

    if (state.panel) {
      return;
    }

    state.panel =
      makeElement(
        "section",
        "mbt-panel"
      );

    state.panel.setAttribute(
      "role",
      "dialog"
    );

    state.panel.setAttribute(
      "aria-modal",
      "false"
    );

    state.panel.setAttribute(
      "aria-label",
      "MavunoBridge guided tour"
    );

    state.panel.addEventListener(
      "click",
      handlePanelClick
    );

    state.panel.addEventListener(
      "change",
      handlePanelChange
    );
  }

  /* =========================================================
     SETUP SCREEN
     ========================================================= */

  function renderSetup() {

    const t =
      currentWords();

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    state.panel.innerHTML = `

      <div class="mbt-topline">

        <div>
          <div class="mbt-eyebrow">
            MavunoBridge
          </div>

          <h2 class="mbt-title">
            ${escapeHTML(
              t.welcome
            )}
          </h2>
        </div>

        <button
          class="mbt-close"
          data-action="close"
          aria-label="${escapeHTML(
            t.close
          )}"
        >
          ×
        </button>

      </div>

      <p class="mbt-description">
        ${escapeHTML(
          t.choose
        )}
      </p>

      <!-- PERSONALITY -->

      <div class="mbt-personality-box">

        <div class="mbt-personality-icon">
          ${farmer.emoji}
        </div>

        <div class="mbt-personality-text">

          <div class="mbt-personality-label">
            ${escapeHTML(
              t.personality
            )}
          </div>

          <div class="mbt-personality-value">
            ${escapeHTML(
              farmer.personality
            )}
          </div>

        </div>

      </div>

      <!-- AVATARS -->

      <div class="mbt-avatar-options">

        ${Object.entries(
          farmers
        )
          .map(
            ([id, farmer]) => `

              <button
                class="mbt-avatar-option"
                data-avatar="${id}"
                aria-pressed="${
                  id === state.avatar
                }"
                title="${escapeHTML(
                  farmer.description
                )}"
              >

                ${avatarSVG(
                  id,
                  false
                )}

                <span>
                  ${escapeHTML(
                    farmer.name
                  )}
                </span>

                <small class="mbt-avatar-personality">
                  ${escapeHTML(
                    farmer.personalityShort
                  )}
                </small>

              </button>
            `
          )
          .join("")
        }

      </div>

      <!-- LANGUAGE -->

      <div class="mbt-field">

        <label
          for="mbt-language"
        >
          ${escapeHTML(
            t.language
          )}
        </label>

        <select
          id="mbt-language"
        >

          ${Object.entries(
            t.langs
          )
            .map(
              ([id, name]) => `

                <option
                  value="${id}"
                  ${
                    id ===
                    state.language
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHTML(
                    name
                  )}
                </option>
              `
            )
            .join("")
          }

        </select>

      </div>

      <!-- VOICE -->

      <div class="mbt-field">

        <label
          for="mbt-voice"
        >
          ${escapeHTML(
            t.voice
          )}
        </label>

        <select
          id="mbt-voice"
        ></select>

      </div>

      <p class="mbt-note">
        Voice choices depend on the voices installed in your browser or device.
      </p>

      <div class="mbt-actions">

        <button
          class="mbt-button"
          data-action="start"
        >
          ${escapeHTML(
            t.start
          )}
        </button>

        <button
          class="mbt-button secondary"
          data-action="close"
        >
          ${escapeHTML(
            t.skip
          )}
        </button>

      </div>
    `;

    fillVoiceOptions(
      state.panel.querySelector(
        "#mbt-voice"
      )
    );

    renderGuide();
  }

  /* =========================================================
     TOUR STEP
     ========================================================= */

  function renderStep() {

    const t =
      currentWords();

    const steps =
      getSteps();

    const step =
      steps[state.step];

    if (!step) {
      renderFinish();
      return;
    }

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    state.panel.innerHTML = `

      <div class="mbt-topline">

        <div>

          <div class="mbt-eyebrow">
            ${escapeHTML(
              t.tour
            )}
          </div>

          <h2 class="mbt-title">
            ${escapeHTML(
              step[0]
            )}
          </h2>

        </div>

        <button
          class="mbt-close"
          data-action="close"
          aria-label="${escapeHTML(
            t.close
          )}"
        >
          ×
        </button>

      </div>

      <p class="mbt-description">
        ${escapeHTML(
          step[1]
        )}
      </p>

      <div class="mbt-personality-box">

        <div class="mbt-personality-icon">
          ${farmer.emoji}
        </div>

        <div class="mbt-personality-text">

          <div class="mbt-personality-label">
            ${escapeHTML(
              farmer.name
            )}
          </div>

          <div class="mbt-personality-value">
            ${escapeHTML(
              farmer.personalityShort
            )}
          </div>

        </div>

      </div>

      <div class="mbt-step-count">

        ${escapeHTML(
          t.step
        )}
        ${state.step + 1}
        /
        ${steps.length}

      </div>

      <div
        class="mbt-progress"
        aria-hidden="true"
      >

        <div
          style="
            width:
            ${
              (
                (state.step + 1) /
                steps.length
              ) * 100
            }%;
          "
        ></div>

      </div>

      <div class="mbt-field">

        <label
          for="mbt-language"
        >
          ${escapeHTML(
            t.language
          )}
        </label>

        <select
          id="mbt-language"
        >

          ${Object.entries(
            t.langs
          )
            .map(
              ([id, name]) => `

                <option
                  value="${id}"
                  ${
                    id ===
                    state.language
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHTML(
                    name
                  )}
                </option>
              `
            )
            .join("")
          }

        </select>

      </div>

      <div class="mbt-field">

        <label
          for="mbt-voice"
        >
          ${escapeHTML(
            t.voice
          )}
        </label>

        <select
          id="mbt-voice"
        ></select>

      </div>

      <div class="mbt-actions">

        <button
          class="mbt-button secondary"
          data-action="back"
          ${
            state.step === 0
              ? "disabled"
              : ""
          }
        >
          ${escapeHTML(
            t.back
          )}
        </button>

        <button
          class="mbt-button"
          data-action="next"
        >
          ${escapeHTML(
            state.step ===
            steps.length - 1
              ? t.finish
              : t.next
          )}
        </button>

        <button
          class="mbt-button secondary"
          data-action="close"
        >
          ${escapeHTML(
            t.skip
          )}
        </button>

      </div>
    `;

    fillVoiceOptions(
      state.panel.querySelector(
        "#mbt-voice"
      )
    );

    renderGuide();
  }

  /* =========================================================
     FINISH
     ========================================================= */

  function renderFinish() {

    const t =
      currentWords();

    state.panel.innerHTML = `

      <div class="mbt-topline">

        <div>

          <div class="mbt-eyebrow">
            MavunoBridge
          </div>

          <h2 class="mbt-title">
            ${escapeHTML(
              t.done
            )}
          </h2>

        </div>

        <button
          class="mbt-close"
          data-action="close"
          aria-label="${escapeHTML(
            t.close
          )}"
        >
          ×
        </button>

      </div>

      <p class="mbt-description">
        ${escapeHTML(
          t.doneText
        )}
      </p>

      <div class="mbt-actions">

        <button
          class="mbt-button"
          data-action="replay"
        >
          ${escapeHTML(
            t.replay
          )}
        </button>

        <button
          class="mbt-button secondary"
          data-action="close"
        >
          ${escapeHTML(
            t.finish
          )}
        </button>

      </div>
    `;

    clearSpotlight();

    stopSpeech();

    state.active = false;

    /*
     * The selected farmer gives the final message.
     */

    const farmer =
      farmers[state.avatar] ||
      farmers.akinyi;

    const finalText =
      state.language === "sw"

        ? `${farmer.name} anasema: ${t.doneText}`

        : state.language === "mix"

        ? `${farmer.name} anasema: ${t.doneText}`

        : `${farmer.name} says: ${t.doneText}`;

    speak(finalText);
  }

  /* =========================================================
     UPDATE STEP
     ========================================================= */

  function updateStep(
    shouldSpeak = true
  ) {

    const steps =
      getSteps();

    if (
      state.step >=
      steps.length
    ) {

      renderFinish();

      return;
    }

    renderStep();

    const step =
      steps[state.step];

    const target =
      findTarget(
        step[2]
      );

    if (target) {
      showSpotlight(target);
    } else {
      clearSpotlight();
    }

    if (shouldSpeak) {

      /*
       * On the first step, introduce
       * the farmer personality first.
       */

      if (state.step === 0) {

        const intro =
          getPersonalityIntro();

        const combined =
          `${intro} ${step[1]}`;

        speak(combined);

      } else {

        speak(step[1]);
      }
    }
  }

  /* =========================================================
     START TOUR
     ========================================================= */

  function startTour() {

    state.page =
      detectPage();

    state.step = 0;

    state.active = true;

    stopSpeech();

    createGuide();

    ensurePanel();

    state.panel.style.display =
      "block";

    state.guide.style.display =
      "block";

    if (state.launcher) {
      state.launcher.style.display =
        "none";
    }

    updateStep(true);
  }

  /* =========================================================
     OPEN SETUP
     ========================================================= */

  function openSetup() {

    stopSpeech();

    state.active = false;

    clearSpotlight();

    createGuide();

    ensurePanel();

    state.panel.style.display =
      "block";

    state.guide.style.display =
      "block";

    if (state.launcher) {
      state.launcher.style.display =
        "none";
    }

    renderSetup();
  }

  /* =========================================================
     CLOSE TOUR
     ========================================================= */

  function closeTour() {

    stopSpeech();

    state.active = false;

    clearSpotlight();

    if (state.panel) {
      state.panel.style.display =
        "none";
    }

    if (state.guide) {
      state.guide.style.display =
        "none";
    }

    if (state.launcher) {
      state.launcher.style.display =
        "block";
    }
  }

  /* =========================================================
     NEXT
     ========================================================= */

  function nextStep() {

    if (!state.active) {
      return;
    }

    const steps =
      getSteps();

    if (
      state.step >=
      steps.length - 1
    ) {

      localStorage.setItem(
        STORAGE.completed,
        "true"
      );

      state.step =
        steps.length;

      renderFinish();

      return;
    }

    state.step++;

    updateStep(true);
  }

  /* =========================================================
     BACK
     ========================================================= */

  function previousStep() {

    if (
      !state.active ||
      state.step <= 0
    ) {
      return;
    }

    state.step--;

    updateStep(true);
  }

  /* =========================================================
     SELECT AVATAR
     ========================================================= */

  function selectAvatar(id) {

    if (!farmers[id]) {
      return;
    }

    stopSpeech();

    state.avatar =
      id;

    localStorage.setItem(
      STORAGE.avatar,
      id
    );

    renderGuide();

    if (state.active) {

      renderStep();

      const steps =
        getSteps();

      const current =
        steps[state.step];

      if (current) {

        /*
         * New farmer introduces
         * themselves when selected.
         */

        const intro =
          getPersonalityIntro();

        speak(
          `${intro} ${current[1]}`
        );
      }

    } else if (state.panel) {

      renderSetup();
    }
  }

  /* =========================================================
     SELECT LANGUAGE
     ========================================================= */

  function selectLanguage(
    language
  ) {

    if (!words[language]) {
      return;
    }

    stopSpeech();

    state.language =
      language;

    localStorage.setItem(
      STORAGE.language,
      language
    );

    if (state.active) {

      updateStep(true);

    } else {

      renderSetup();
    }
  }

  /* =========================================================
     SELECT VOICE
     ========================================================= */

  function selectVoice(uri) {

    stopSpeech();

    state.voiceURI =
      uri;

    localStorage.setItem(
      STORAGE.voice,
      uri
    );

    if (state.active) {

      const current =
        getSteps()[state.step];

      if (current) {

        speak(
          current[1]
        );
      }
    }
  }

  /* =========================================================
     PANEL CLICK
     ========================================================= */

  function handlePanelClick(
    event
  ) {

    const avatarButton =
      event.target.closest(
        "[data-avatar]"
      );

    if (avatarButton) {

      selectAvatar(
        avatarButton.dataset.avatar
      );

      return;
    }

    const button =
      event.target.closest(
        "[data-action]"
      );

    if (
      !button ||
      button.disabled
    ) {
      return;
    }

    switch (
      button.dataset.action
    ) {

      case "start":
        startTour();
        break;

      case "next":
        nextStep();
        break;

      case "back":
        previousStep();
        break;

      case "close":
        closeTour();
        break;

      case "replay":
        openSetup();
        break;
    }
  }

  /* =========================================================
     PANEL CHANGE
     ========================================================= */

  function handlePanelChange(
    event
  ) {

    if (
      event.target.id ===
      "mbt-language"
    ) {

      selectLanguage(
        event.target.value
      );
    }

    if (
      event.target.id ===
      "mbt-voice"
    ) {

      selectVoice(
        event.target.value
      );
    }
  }

  /* =========================================================
     LAUNCHER
     ========================================================= */

  function createLauncher() {

    if (state.launcher) {
      return;
    }

    state.launcher =
      makeElement(
        "button",
        "mbt-launcher"
      );

    state.launcher.type =
      "button";

    state.launcher.textContent =
      "🌱 Take a tour";

    state.launcher.setAttribute(
      "aria-label",
      "Take a MavunoBridge tour"
    );

    state.launcher.addEventListener(
      "click",
      openSetup
    );
  }

  /* =========================================================
     RESIZE
     ========================================================= */

  function onResize() {

    if (!state.active) {
      return;
    }

    const step =
      getSteps()[state.step];

    const target =
      step
        ? findTarget(step[2])
        : null;

    if (target) {
      showSpotlight(target);
    }
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {

    if (!document.body) {
      return;
    }

    addStyles();

    createLauncher();

    if (
      "speechSynthesis" in window
    ) {

      loadVoices();

      window.speechSynthesis
        .onvoiceschanged =
        loadVoices;
    }

    window.addEventListener(
      "resize",
      onResize
    );

    /*
     * The tour does NOT automatically
     * open.
     *
     * User can click:
     * "Take a tour"
     *
     * Or use:
     *
     * window.MavunoBridgeTour.open()
     *
     * Or:
     *
     * window.MavunoBridgeTour.start()
     */
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.MavunoBridgeTour = {

    open:
      openSetup,

    start:
      startTour,

    close:
      closeTour,

    next:
      nextStep,

    back:
      previousStep,

    replay:
      openSetup,

    setAvatar:
      selectAvatar,

    setLanguage:
      selectLanguage,

    getPage:
      detectPage,

    getAvatar:
      () => state.avatar,

    getPersonality:
      () =>
        farmers[state.avatar]
          ?.personality || "",

    getFarmer:
      () =>
        farmers[state.avatar] || null
  };

  /* =========================================================
     DOM READY
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();
  }

})();
