/* =========================================================
   MAVUNOBRIDGE — ANIME FARMER TOUR
   Complete replacement: website-tour.js

   Includes:
   - Four custom anime-inspired farmer avatars
   - Young adult Akinyi with curly puff and yellow headband
   - Distinct personalities and default voice profiles
   - Chrome voice discovery and per-avatar voice overrides
   - Cursor-following anime eyes
   - Blinking eyes, moving mouths and random idle animations
   - Homepage character reactions
   - English, casual Sheng-English and Kiswahili
   - Page-aware tours and element spotlight
   - Back, Next, Skip, Finish, Replay and voice preview
   - Mobile overlap protection
   - No external JavaScript libraries
   ========================================================= */

(() => {
  "use strict";

  if (window.__mavunoAnimeTourFinal) return;
  window.__mavunoAnimeTourFinal = true;

  const STORE = {
    avatar: "mavunobridge_tour_avatar",
    language: "mavunobridge_tour_language",
    overrides: "mavunobridge_tour_voice_overrides",
    completed: "mavunobridge_tour_completed"
  };

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  const savedOverrides = readJSON(STORE.overrides, {});

  const state = {
    avatar: localStorage.getItem(STORE.avatar) || "akinyi",
    language: localStorage.getItem(STORE.language) || "mix",
    voiceOverrides: savedOverrides,
    voices: [],
    page: "marketplace",
    step: 0,
    active: false,
    setupOpen: false,
    speaking: false,
    session: 0,
    mouthTimer: null,
    reactionTimer: null,
    blinkTimer: null,
    guide: null,
    panel: null,
    launcher: null,
    overlay: null,
    spotlight: null
  };

  const farmers = {
    baba: {
      name: "Baba Otieno",
      role: "Experienced grower",
      personality: "Wise & patient",
      pitch: 0.79,
      rate: 0.88,
      skin: "#875034",
      skinLight: "#A56F4D",
      shirt: "#527C41",
      hair: "#D3D0C7",
      voiceNames: ["daniel", "george", "ryan", "mark", "guy"],
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
      pitch: 1.04,
      rate: 1.07,
      skin: "#985D3B",
      skinLight: "#B9794E",
      shirt: "#E5A832",
      hair: "#21140E",
      voiceNames: ["david", "guy", "mark", "ryan", "alex"],
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
      pitch: 1.02,
      rate: 0.95,
      skin: "#74402B",
      skinLight: "#965D41",
      shirt: "#207E75",
      hair: "#24150F",
      voiceNames: ["samantha", "karen", "victoria", "zira", "jenny"],
      greeting: {
        en: "Hello and welcome! I'm Mama Wanjiru. I'll guide you step by step.",
        mix: "Hello! I'm Mama Wanjiru. Pole pole tutapitia kila kitu pamoja.",
        sw: "Habari na karibu! Mimi ni Mama Wanjiru. Nitakuongoza hatua kwa hatua."
      }
    },

    akinyi: {
      name: "Akinyi",
      role: "Young adult tomato grower",
      personality: "Curious & creative",
      pitch: 1.16,
      rate: 1.02,
      skin: "#A96F4B",
      skinLight: "#CA9065",
      shirt: "#426F9D",
      hair: "#24140D",
      voiceNames: ["ava", "aria", "jenny", "samantha", "victoria"],
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
      language: "Language",
      voice: "Voice for this farmer",
      automatic: "Use this avatar's default voice",
      start: "Start tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish",
      replay: "Replay",
      close: "Close",
      step: "Step",
      done: "You're all set!",
      doneText: "Great work! You're ready to explore MavunoBridge. You can replay this tour whenever you need help.",
      launcher: "Meet your farmer guide",
      preview: "Hear greeting"
    },
    mix: {
      title: "Meet your farmer guide",
      subtitle: "Chagua guide wako, then tuanze.",
      language: "Language",
      voice: "Voice ya farmer",
      automatic: "Tumia default voice ya huyu avatar",
      start: "Twende!",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Tumemaliza!",
      replay: "Replay",
      close: "Close",
      step: "HATUA",
      done: "Umeweza!",
      doneText: "Poa sana! Sasa uko ready ku-explore MavunoBridge. Unaweza kufungua tour tena ukihitaji help.",
      launcher: "Meet your farmer guide",
      preview: "Sikiliza greeting"
    },
    sw: {
      title: "Kutana na mwongozo wako",
      subtitle: "Chagua mkulima atakayekuonyesha tovuti.",
      language: "Lugha",
      voice: "Sauti ya mkulima",
      automatic: "Tumia sauti chaguomsingi",
      start: "Anza ziara",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza",
      replay: "Rudia",
      close: "Funga",
      step: "HATUA",
      done: "Umefanikiwa!",
      doneText: "Vizuri sana! Sasa uko tayari kutumia MavunoBridge. Unaweza kurudia ziara hii wakati wowote.",
      launcher: "Kutana na mwongozo",
      preview: "Sikiliza salamu"
    }
  };

  const tours = {
    marketplace: {
      en: [
        ["Welcome to MavunoBridge", "This is your agricultural marketplace. Farmers can showcase their products, while buyers discover produce and compare offers.", null],
        ["Search for produce", "Use the search bar to find maize, tomatoes, beans, fruits and other agricultural products.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Explore categories", "Choose a product category to browse available produce and farm-related items.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Browse listings", "Check product photos, prices, locations and seller information before choosing an offer.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Compare your options", "Compare price, quantity and location. Prices can change with seasons and availability.", "#listingGrid, .listing-grid, #productsGrid"],
        ["You're ready!", "Open a listing to learn more, or continue browsing the marketplace.", null]
      ],
      mix: [
        ["Karibu MavunoBridge!", "Hapa ndio marketplace. Farmers wanaweza list produce zao na buyers wanaweza kucompare offers.", null],
        ["Search products", "Tumia search kutafuta maize, tomatoes, beans, fruits na agricultural products zingine.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Chagua category", "Click category unataka kuona ili upate products related na hiyo category.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Angalia listings", "Check product photos, price, location na seller info kabla uamue.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Compare offers", "Linganisha price, quantity na location. Prices zinaweza change kulingana na season.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Uko ready!", "Sasa unaweza browse marketplace na kuchagua offer inayokufaa.", null]
      ],
      sw: [
        ["Karibu MavunoBridge!", "Hili ni soko la kilimo. Wakulima wanaweza kuweka bidhaa na wanunuzi wanaweza kulinganisha ofa.", null],
        ["Tafuta bidhaa", "Tumia sehemu ya kutafuta kupata mahindi, nyanya, maharagwe, matunda na bidhaa nyingine.", 'input[type="search"], #searchInput, #searchBar, [data-search]'],
        ["Chagua kundi", "Chagua kundi la bidhaa unalotaka kuona.", "#categoryGrid, .category-grid, [data-categories]"],
        ["Angalia bidhaa", "Kagua picha, bei, eneo na maelezo ya muuzaji kabla ya kuchagua.", "#listingGrid, .listing-grid, #productsGrid, .products-grid"],
        ["Linganisha ofa", "Linganisha bei, kiasi na eneo. Bei zinaweza kubadilika kulingana na msimu.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Uko tayari!", "Sasa unaweza kutafuta bidhaa na kuchagua ofa inayokufaa.", null]
      ]
    },

    smart: {
      en: [
        ["Welcome to Smart Assist", "Explore the farming guidance and practical ideas available on this page.", null],
        ["Ask a question", "Use the assistant input to enter a farming question.", "textarea, #questionInput, #chatInput, input[type='text']"],
        ["Explore suggestions", "Look for suggestions about crops, plant care and pest management.", "#suggestions, .suggestions, .quick-prompts"],
        ["Check conditions", "When weather information is connected, use it with local farming advice.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Keep learning", "For important crop or pest decisions, verify guidance with a qualified local agricultural expert.", null]
      ],
      mix: [
        ["Karibu Smart Assist", "Hapa unaweza kupata farming guidance na ideas za kusaidia shamba yako.", null],
        ["Uliza swali", "Tumia assistant input kuandika swali kuhusu farming.", "textarea, #questionInput, #chatInput, input[type='text']"],
        ["Explore suggestions", "Angalia suggestions kuhusu crops, plant care na pests.", "#suggestions, .suggestions, .quick-prompts"],
        ["Angalia conditions", "Kama weather feature iko connected, itumie kusaidia kupanga farm activities.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Endelea kujifunza", "Kwa decisions muhimu kuhusu crops au pests, confirm na agricultural expert wa eneo lako.", null]
      ],
      sw: [
        ["Karibu Smart Assist", "Hapa unaweza kupata mwongozo wa shughuli za kilimo.", null],
        ["Uliza swali", "Tumia sehemu ya kuandika swali lako kuhusu kilimo.", "textarea, #questionInput, #chatInput, input[type='text']"],
        ["Angalia mapendekezo", "Tafuta mapendekezo kuhusu mazao na wadudu waharibifu.", "#suggestions, .suggestions, .quick-prompts"],
        ["Angalia hali ya hewa", "Ikiwa taarifa za hali ya hewa zimeunganishwa, zitumie kupanga kazi za shamba.", "#weatherWidget, .weather-widget, [data-weather]"],
        ["Endelea kujifunza", "Kwa maamuzi muhimu, thibitisha ushauri na mtaalamu wa kilimo wa eneo lako.", null]
      ]
    },

    sacco: {
      en: [
        ["Welcome to SACCO Hub", "Explore SACCO information and opportunities listed on this page.", null],
        ["Browse opportunities", "Open the available cards and read about each option.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Check requirements", "Confirm membership rules, fees, savings requirements and contact details directly with the organisation.", null],
        ["Choose carefully", "Compare options and ask questions before making financial commitments.", null]
      ],
      mix: [
        ["Karibu SACCO Hub", "Hapa unaweza explore SACCOs na opportunities za farmers.", null],
        ["Browse opportunities", "Angalia SACCO cards na details za kila option.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Check requirements", "Confirm membership rules, fees na savings requirements kabla ujiunge.", null],
        ["Choose carefully", "Compare options na uliza maswali kabla ya commitment.", null]
      ],
      sw: [
        ["Karibu SACCO Hub", "Hapa unaweza kuchunguza SACCO na fursa za wakulima.", null],
        ["Angalia fursa", "Fungua kadi zilizopo na usome maelezo yake.", "#saccoGrid, .sacco-grid, #opportunities, .opportunities"],
        ["Thibitisha masharti", "Thibitisha ada, masharti ya uanachama na mawasiliano na shirika husika.", null],
        ["Chagua kwa uangalifu", "Linganisha chaguo kabla ya kufanya maamuzi ya kifedha.", null]
      ]
    },

    farmer: {
      en: [
        ["Welcome, farmer!", "Let's explore how you can present your farm products to potential buyers.", null],
        ["Start a listing", "Look for the sell or add-listing control to open the product form.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Enter product details", "Add accurate product name, quantity, location, price and contact information.", "#listingForm, #productForm, form"],
        ["Add genuine photos", "Use clear photos of the actual product you are offering.", 'input[type="file"]'],
        ["Review before publishing", "Check your details before saving or publishing your listing.", "#saveListing, #submitListing, button[type='submit']"]
      ],
      mix: [
        ["Karibu farmer!", "Tuone vile unaweza kuonyesha farm products zako kwa buyers.", null],
        ["Anza listing", "Tafuta sell au add listing button.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Jaza product details", "Weka jina, quantity, location, price na contact info correct.", "#listingForm, #productForm, form"],
        ["Add genuine photos", "Tumia clear photos za product unauza.", 'input[type="file"]'],
        ["Review kwanza", "Check details kabla ya kusave au kupublish listing.", "#saveListing, #submitListing, button[type='submit']"]
      ],
      sw: [
        ["Karibu mkulima!", "Tujifunze jinsi ya kuonyesha bidhaa zako kwa wanunuzi.", null],
        ["Anza kuweka bidhaa", "Tafuta kitufe cha kuuza au kuongeza bidhaa.", "#sellButton, #heroSellButton, #addListing, [data-add-listing]"],
        ["Jaza maelezo", "Weka jina, kiasi, eneo, bei na mawasiliano sahihi.", "#listingForm, #productForm, form"],
        ["Ongeza picha halisi", "Tumia picha zilizo wazi za bidhaa unayouza.", 'input[type="file"]'],
        ["Kagua kwanza", "Hakikisha maelezo ni sahihi kabla ya kuhifadhi bidhaa.", "#saveListing, #submitListing, button[type='submit']"]
      ]
    },

    buyer: {
      en: [
        ["Welcome, buyer!", "Let's see how to find products and compare offers.", null],
        ["Search and filter", "Use the search bar and filters to narrow down the available products.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Compare listings", "Compare quantity, price, product quality and location.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Contact the seller", "Use the contact details on a listing to ask about availability.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Shop thoughtfully", "Confirm key details with the seller before arranging payment or collection.", null]
      ],
      mix: [
        ["Karibu buyer!", "Tuone vile unaweza kupata products na kucompare offers.", null],
        ["Search na filters", "Tumia search na filters kupata options zinazokufaa.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Compare listings", "Linganisha quantity, price, quality na location.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Contact seller", "Tumia contact details kuuliza kama product bado iko available.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Nunua carefully", "Confirm details na seller kabla ya payment au collection.", null]
      ],
      sw: [
        ["Karibu mnunuzi!", "Tujifunze kutafuta bidhaa na kulinganisha ofa.", null],
        ["Tafuta na chuja", "Tumia sehemu ya kutafuta na vichujio kupata bidhaa zinazokufaa.", 'input[type="search"], #searchInput, #searchBar, select'],
        ["Linganisha bidhaa", "Linganisha kiasi, bei, ubora na eneo.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Wasiliana na muuzaji", "Tumia mawasiliano yaliyowekwa kuuliza kuhusu upatikanaji wa bidhaa.", "#listingGrid, .listing-grid, #productsGrid"],
        ["Nunua kwa uangalifu", "Thibitisha maelezo muhimu kabla ya kupanga malipo au kuchukua bidhaa.", null]
      ]
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);

  function t(key) {
    return words[state.language]?.[key] || words.en[key] || key;
  }

  function currentFarmer() {
    return farmers[state.avatar] || farmers.akinyi;
  }

  function detectPage() {
    const path = (location.pathname + location.hash).toLowerCase();

    if (/smart-assist|smartassist|assistant/.test(path)) return "smart";
    if (/sacco|opportunit/.test(path)) return "sacco";
    if (/buyer/.test(path)) return "buyer";
    if (/farmer|sell/.test(path)) return "farmer";

    return "marketplace";
  }

  function getSteps() {
    const group = tours[state.page] || tours.marketplace;
    return group[state.language] || group.en;
  }

  /* =========================================================
     ANIME AVATARS (REMODELLED)
     Soft chibi-style faces, friendly eyes, small smiles.
     Self-contained SVG: no external image URLs required.
     ========================================================= */

  function avatarSVG(id) {
    const f = farmers[id] || farmers.akinyi;
    const baba = id === "baba";
    const kamau = id === "kamau";
    const wanjiru = id === "wanjiru";
    const akinyi = id === "akinyi";
    const feminine = wanjiru || akinyi;
    const line = "#3A2218";

    /* ---------- Eyes ---------- */
    const eyeRx = baba ? 6.6 : akinyi ? 8 : 7.4;
    const eyeRy = baba ? 7.4 : akinyi ? 9.4 : 8.4;
    const eyeY = 75;

    function eye(side, cx) {
      const irisRx = eyeRx - 1.6;
      const irisRy = eyeRy - 1.4;
      const outer = side === "left" ? -1 : 1;

      const lash = feminine
        ? `<path d="M${cx + outer * (eyeRx + 0.5)} ${eyeY - 2} l${outer * 3} -3"
                 fill="none" stroke="${line}" stroke-width="2" stroke-linecap="round"/>`
        : "";

      return `
        <g class="mbt-eye-group mbt-${side}-eye">
          <defs>
            <clipPath id="mbt-clip-${side}-${id}">
              <ellipse cx="${cx}" cy="${eyeY}" rx="${eyeRx}" ry="${eyeRy}"/>
            </clipPath>
          </defs>

          <ellipse cx="${cx}" cy="${eyeY}" rx="${eyeRx}" ry="${eyeRy}"
                   fill="#FFFFFF" stroke="${line}" stroke-width="1"/>

          <g clip-path="url(#mbt-clip-${side}-${id})">
            <g class="mbt-pupil">
              <ellipse cx="${cx}" cy="${eyeY}" rx="${irisRx}" ry="${irisRy}" fill="#6B3C27"/>
              <ellipse cx="${cx}" cy="${eyeY + irisRy * 0.35}" rx="${irisRx * 0.72}" ry="${irisRy * 0.42}"
                       fill="#9A6038" opacity=".65"/>
              <ellipse cx="${cx}" cy="${eyeY}" rx="${irisRx * 0.52}" ry="${irisRy * 0.58}" fill="#1D110C"/>
              <circle cx="${cx + 2}" cy="${eyeY - 3}" r="2.3" fill="#FFFFFF"/>
              <circle cx="${cx - 2}" cy="${eyeY + 3}" r="1.1" fill="#FFFFFF" opacity=".9"/>
            </g>
          </g>

          <path d="M${cx - eyeRx - 0.5} ${eyeY - 1} Q${cx} ${eyeY - eyeRy - 3} ${cx + eyeRx + 0.5} ${eyeY - 1}"
                fill="none" stroke="${line}" stroke-width="2.6" stroke-linecap="round"/>
          ${lash}
        </g>`;
    }

    const eyes = eye("left", 51) + eye("right", 79);

    /* ---------- Brows ---------- */
    const browColor = baba ? "#BDB7AB" : f.hair;
    const browWidth = feminine ? 2.6 : 3.4;
    const brows = `
      <path d="M42 62 Q51 57.5 59 61" fill="none" stroke="${browColor}"
            stroke-width="${browWidth}" stroke-linecap="round"/>
      <path d="M71 61 Q79 57.5 88 62" fill="none" stroke="${browColor}"
            stroke-width="${browWidth}" stroke-linecap="round"/>`;

    /* ---------- Hair behind the head ---------- */
    const hairBack = baba
      ? `<path d="M32 70 Q27 38 48 30 Q65 25 82 30 Q103 38 98 70 L94 62 L36 62Z" fill="#D3D0C7"/>`
      : kamau
      ? `<path d="M32 66 Q28 34 65 29 Q102 34 98 66 L94 58 L36 58Z" fill="${f.hair}"/>`
      : wanjiru
      ? `<path d="M30 72 Q26 36 65 31 Q104 36 100 72 L99 94 Q82 88 65 88 Q48 88 31 94Z" fill="${f.hair}"/>`
      : `<g fill="${f.hair}">
           <circle cx="65" cy="23" r="17"/>
           <circle cx="46" cy="29" r="13"/>
           <circle cx="84" cy="29" r="13"/>
           <circle cx="33" cy="42" r="11"/>
           <circle cx="97" cy="42" r="11"/>
           <circle cx="65" cy="36" r="16"/>
           <circle cx="31" cy="80" r="5.5"/>
           <circle cx="99" cy="80" r="5.5"/>
           <circle cx="29" cy="68" r="5"/>
           <circle cx="101" cy="68" r="5"/>
         </g>
         <g fill="#3A2418" opacity=".55">
           <circle cx="60" cy="19" r="3"/>
           <circle cx="74" cy="23" r="2.5"/>
           <circle cx="44" cy="27" r="2.5"/>
           <circle cx="86" cy="31" r="2.5"/>
         </g>`;

    /* ---------- Ears ---------- */
    const ears = `
      <ellipse cx="33" cy="73" rx="4" ry="6" fill="${f.skin}"/>
      <ellipse cx="97" cy="73" rx="4" ry="6" fill="${f.skin}"/>
      ${wanjiru
        ? `<circle cx="32" cy="82" r="3.4" fill="#F6D16B" stroke="#AF7628" stroke-width="1.2"/>
           <circle cx="98" cy="82" r="3.4" fill="#F6D16B" stroke="#AF7628" stroke-width="1.2"/>`
        : ""}`;

    /* ---------- Face ---------- */
    const face = `
      <path d="M34 66 Q34 36 65 36 Q96 36 96 66 Q96 86 84 98 Q76 105 65 105 Q54 105 46 98 Q34 86 34 66Z"
            fill="url(#mbt-skin-${id})" stroke="${f.skin}" stroke-width="1.2"/>
      <path d="M40 54 Q45 43 58 41" fill="none" stroke="#FFFFFF" stroke-width="2.5"
            stroke-linecap="round" opacity=".14"/>`;

    const blush = `
      <ellipse cx="42" cy="89" rx="6" ry="3.2" fill="#F58E8E" opacity="${baba ? ".12" : ".3"}"/>
      <ellipse cx="88" cy="89" rx="6" ry="3.2" fill="#F58E8E" opacity="${baba ? ".12" : ".3"}"/>`;

    /* ---------- Hair in front of the face ---------- */
    const hairFront = baba
      ? `<path d="M34 64 Q32 52 40 45 L45 53 Q39 58 38 70Z" fill="#D3D0C7"/>
         <path d="M96 64 Q98 52 90 45 L85 53 Q91 58 92 70Z" fill="#D3D0C7"/>`
      : kamau
      ? `<path d="M34 62 Q30 36 65 31 Q100 36 96 62 Q92 50 82 49 Q74 55 65 49 Q56 55 48 49 Q38 50 34 62Z"
               fill="${f.hair}"/>`
      : akinyi
      ? `<path d="M34 62 Q32 38 65 34 Q98 38 96 62 Q90 46 65 44 Q40 46 34 62Z" fill="${f.hair}"/>`
      : "";

    /* ---------- Nose + mouth ---------- */
    const nose = `
      <path d="M63 86 Q65 88.5 67 86" fill="none" stroke="${f.skin}"
            stroke-width="1.8" stroke-linecap="round" opacity=".85"/>
      <path d="M63 86 Q65 88.5 67 86" fill="none" stroke="#000"
            stroke-width="1" stroke-linecap="round" opacity=".15"/>`;

    const beard = baba
      ? `<path d="M36 80 Q38 98 50 104 Q65 114 80 104 Q92 98 94 80 Q88 90 80 91 Q65 86 50 91 Q42 90 36 80Z"
               fill="#D3D0C7"/>
         <path d="M48 100 Q65 108 82 100" fill="none" stroke="#B7B1A7" stroke-width="1.5"
               stroke-linecap="round"/>`
      : "";

    const mouth = `
      <ellipse class="mbt-mouth-open" cx="65" cy="95.5" rx="5.5" ry="1.6" fill="#4A1D1A"/>
      <path class="mbt-teeth" d="M60.5 93.8 Q65 95.5 69.5 93.8" fill="none"
            stroke="#FFF4EA" stroke-width="1.8" stroke-linecap="round"/>
      <path class="mbt-mouth-line" d="M57 93 Q65 99.5 73 93" fill="none"
            stroke="#6B2F25" stroke-width="2.2" stroke-linecap="round"/>`;

    const mustache = baba
      ? `<path d="M52 90 Q58 84.5 65 88.5 Q72 84.5 78 90 Q72 93 65 91 Q58 93 52 90Z" fill="#E4E0D7"
               stroke="#B7B1A7" stroke-width=".8"/>`
      : "";

    /* ---------- Headwear ---------- */
    const headwear = baba
      ? `<path d="M40 47 Q41 19 65 18 Q89 19 90 47Z" fill="#EBCB7E" stroke="#A57A3B" stroke-width="1.6"/>
         <path d="M41 41 Q65 48 89 41" fill="none" stroke="#8B5E2B" stroke-width="4"/>
         <path d="M48 30 Q65 24 82 30" fill="none" stroke="#FFE5A0" stroke-width="2" stroke-linecap="round"/>
         <ellipse cx="65" cy="47" rx="46" ry="8.5" fill="#D6A654" stroke="#9D7237" stroke-width="1.8"/>
         <path d="M26 47 Q65 53 104 47" fill="none" stroke="#B88B40" stroke-width="1.5" opacity=".7"/>`
      : kamau
      ? `<path d="M36 50 Q36 22 65 21 Q94 22 94 50 Q65 44 36 50Z" fill="#D9433B" stroke="#87251E" stroke-width="1.6"/>
         <path d="M65 22 L65 46" stroke="#B92D28" stroke-width="1.5"/>
         <circle cx="65" cy="22" r="2.6" fill="#B92D28"/>
         <path d="M48 30 Q56 25 64 26" fill="none" stroke="#F4796B" stroke-width="2" stroke-linecap="round"/>
         <path d="M33 50 Q65 66 97 50 Q94 45 65 46 Q36 45 33 50Z" fill="#B92D28" stroke="#87251E" stroke-width="1.4"/>`
      : wanjiru
      ? `<path d="M31 58 Q26 30 52 20 Q66 14 82 18 Q104 28 99 58 Q82 46 65 46 Q48 46 31 58Z"
               fill="#EB8938" stroke="#A85124" stroke-width="1.6"/>
         <path d="M36 44 Q60 32 96 40 M34 52 Q62 40 99 50" fill="none" stroke="#FFC16B"
               stroke-width="2.6" stroke-linecap="round"/>
         <ellipse cx="88" cy="19" rx="11" ry="7" transform="rotate(-25 88 19)"
                  fill="#EB8938" stroke="#A85124" stroke-width="1.6"/>
         <path d="M80 21 Q88 15 96 17" fill="none" stroke="#FFC16B" stroke-width="2" stroke-linecap="round"/>`
      : `<path d="M33 52 Q65 35 97 52 L95 59 Q65 44 35 59Z" fill="#F3C831" stroke="#BB9119" stroke-width="1.6"/>
         <path d="M42 50 Q65 40 88 50" fill="none" stroke="#FFE991" stroke-width="2" stroke-linecap="round"/>`;

    /* ---------- Neck, shoulders and outfit ---------- */
    const shirt = `
      <path d="M20 176 Q20 128 52 118 Q65 126 78 118 Q110 128 110 176Z"
            fill="url(#mbt-clothes-${id})" stroke="#254832" stroke-width="1.4"/>
      <path d="M30 140 Q26 154 26 168 M100 140 Q104 154 104 168" fill="none"
            stroke="#FFFFFF" stroke-width="2" opacity=".15" stroke-linecap="round"/>`;

    const neck = `
      <path d="M56 98 L56 114 Q65 130 74 114 L74 98Z" fill="${f.skin}"/>
      <ellipse cx="65" cy="106" rx="19" ry="4.5" fill="#000" opacity=".12"/>
      <path d="M56 114 Q65 130 74 114" fill="none" stroke="#FFFFFF" stroke-width="2"
            opacity=".75" stroke-linecap="round"/>`;

    const outfit = baba
      ? `<path d="M80 146 h14 v12 h-14z" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity=".45"/>
         <circle cx="65" cy="140" r="1.7" fill="#FFFFFF" opacity=".7"/>
         <circle cx="65" cy="152" r="1.7" fill="#FFFFFF" opacity=".7"/>`
      : kamau
      ? `<path d="M40 126 L36 176 M90 126 L94 176" stroke="#855522" stroke-width="7" stroke-linecap="round"/>
         <circle cx="38.5" cy="152" r="2.6" fill="#E2B54A"/>
         <circle cx="91.5" cy="152" r="2.6" fill="#E2B54A"/>`
      : wanjiru
      ? `<path d="M54 118 Q65 134 76 118" fill="none" stroke="#F6D16B" stroke-width="3.2"
               stroke-linecap="round" stroke-dasharray="0.1 5.6"/>`
      : "";

    const produce = akinyi
      ? `<g>
           <circle cx="42" cy="157" r="7" fill="#E83D31"/>
           <circle cx="58" cy="153" r="8" fill="#D92F2C"/>
           <circle cx="75" cy="155" r="8" fill="#EF4B37"/>
           <circle cx="90" cy="158" r="6.5" fill="#D92F2C"/>
           <path d="M55 147 l3 -4 l4 4 M72 149 l3 -4 l4 4" fill="none" stroke="#348545" stroke-width="2"
                 stroke-linecap="round"/>
           <path d="M26 161 Q65 152 104 161 L100 176 L30 176Z" fill="#B77A45" stroke="#82502D" stroke-width="1.8"/>
           <path d="M34 168 H96" stroke="#82502D" stroke-width="1.2" opacity=".6"/>
         </g>`
      : "";

    return `
      <svg class="mbt-anime-avatar" viewBox="0 0 130 176"
           role="img" aria-label="${escapeHTML(f.name)} anime farmer"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mbt-skin-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${f.skinLight}"/>
            <stop offset="100%" stop-color="${f.skin}"/>
          </linearGradient>
          <linearGradient id="mbt-clothes-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${f.shirt}"/>
            <stop offset="100%" stop-color="#244833"/>
          </linearGradient>
        </defs>

        <ellipse cx="65" cy="172" rx="42" ry="4" fill="#24452C" opacity=".12"/>

        <g class="mbt-character">
          ${shirt}
          ${neck}
          ${outfit}

          <g class="mbt-head">
            ${hairBack}
            ${ears}
            ${face}
            ${blush}
            ${hairFront}
            ${brows}
            ${eyes}
            ${nose}
            ${beard}
            ${mouth}
            ${mustache}
            ${headwear}
          </g>

          ${produce}
        </g>
      </svg>`;
  }

  /* =========================================================
     TOUR STYLES
     ========================================================= */

  function addStyles() {
    if ($("#mbt-anime-final-style")) return;

    const style = document.createElement("style");
    style.id = "mbt-anime-final-style";

    style.textContent = `
      #mbt-guide, #mbt-panel, #mbt-launcher,
      #mbt-overlay, #mbt-spotlight {
        box-sizing: border-box;
      }

      #mbt-guide {
        position: fixed;
        left: 12px;
        bottom: 14px;
        width: 69px;
        z-index: 99994;
        pointer-events: none;
        transition: opacity .2s ease, transform .2s ease;
      }

      .mbt-guide-card {
        padding: 4px;
        border: 1px solid #dce8d8;
        border-radius: 15px;
        background: #fff;
        text-align: center;
        box-shadow: 0 6px 22px #17291b26;
      }

      .mbt-avatar-frame {
        overflow: hidden;
        border: 1px solid #deead8;
        border-radius: 11px;
        background: #eff7e9;
      }

      #mbt-guide .mbt-avatar-frame {
        width: 58px;
        height: 69px;
        margin: auto;
      }

      .mbt-anime-avatar {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .mbt-character {
        transform-origin: 65px 163px;
        animation: mbt-idle-bob 2.8s ease-in-out infinite;
      }

      .mbt-head {
        transform-origin: 65px 90px;
      }

      .mbt-eye-group {
        transform-box: fill-box;
        transform-origin: center;
        transition: transform .1s ease;
      }

      .mbt-pupil {
        transition: transform .07s linear;
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
        animation: mbt-mouth-talk .17s ease-in-out infinite alternate;
      }

      .mbt-speaking.mbt-mouth-wide .mbt-mouth-open {
        transform: scaleY(2.5);
      }

      .mbt-speaking .mbt-mouth-line {
        opacity: .12;
      }

      .mbt-speaking .mbt-teeth {
        opacity: .95;
      }

      .mbt-guide-name {
        margin-top: 4px;
        color: #24482E;
        font-size: 9px;
        font-weight: 850;
        line-height: 1.15;
      }

      .mbt-guide-personality {
        margin-top: 2px;
        color: #6C806C;
        font-size: 7px;
        line-height: 1.1;
      }

      @keyframes mbt-mouth-talk {
        from { transform: scaleY(.45); }
        to { transform: scaleY(1.8); }
      }

      @keyframes mbt-idle-bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      .mbt-react-bounce .mbt-character {
        animation: mbt-react-bounce .65s ease;
      }

      .mbt-react-sway .mbt-head {
        animation: mbt-react-sway .7s ease;
      }

      .mbt-react-happy .mbt-character {
        animation: mbt-react-happy .8s ease;
      }

      .mbt-react-wink .mbt-right-eye {
        transform: scaleY(.08);
      }

      .mbt-react-surprised .mbt-mouth-open {
        opacity: .95;
        transform: scaleY(2.3);
      }

      @keyframes mbt-react-bounce {
        0%, 100% { transform: translateY(0); }
        35% { transform: translateY(-9px); }
        65% { transform: translateY(1px); }
      }

      @keyframes mbt-react-sway {
        0%, 100% { transform: rotate(0); }
        30% { transform: rotate(-7deg); }
        70% { transform: rotate(5deg); }
      }

      @keyframes mbt-react-happy {
        0%, 100% { transform: translateY(0) rotate(0); }
        25% { transform: translateY(-5px) rotate(-2deg); }
        55% { transform: translateY(-2px) rotate(2deg); }
      }

      #mbt-overlay {
        position: fixed;
        inset: 0;
        z-index: 99991;
        background: rgb(13 26 16 / 44%);
        pointer-events: none;
      }

      #mbt-spotlight {
        position: fixed;
        z-index: 99992;
        pointer-events: none;
        border: 3px solid #fff;
        border-radius: 12px;
        box-shadow: 0 0 0 9999px rgb(13 26 16 / 44%),
                    0 0 25px rgb(255 255 255 / 45%);
        transition: top .2s, left .2s, width .2s, height .2s;
      }

      #mbt-panel {
        position: fixed;
        z-index: 99995;
        right: 16px;
        bottom: 16px;
        width: min(420px, calc(100vw - 32px));
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        padding: 17px;
        border: 1px solid #dce7d8;
        border-radius: 21px;
        background: #fff;
        color: #253C2A;
        box-shadow: 0 18px 56px rgb(0 0 0 / 23%);
        font-family: inherit;
      }

      #mbt-panel * { box-sizing: border-box; }

      .mbt-panel-heading {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .mbt-panel-avatar {
        flex: 0 0 88px;
        width: 88px;
        height: 106px;
        overflow: hidden;
        border: 1px solid #deead8;
        border-radius: 15px;
        background: #eff7e9;
      }

      .mbt-panel-title {
        margin: 2px 0 6px;
        font-size: 19px;
        font-weight: 850;
        line-height: 1.2;
      }

      .mbt-muted {
        color: #6a796b;
        font-size: 12px;
        line-height: 1.5;
      }

      .mbt-personality-tag {
        display: inline-block;
        margin-top: 7px;
        padding: 5px 8px;
        border-radius: 20px;
        background: #edf5e8;
        color: #35613B;
        font-size: 10px;
        font-weight: 800;
      }

      .mbt-label {
        display: block;
        margin: 13px 0 6px;
        color: #35533B;
        font-size: 12px;
        font-weight: 800;
      }

      .mbt-select, .mbt-button {
        min-width: 0;
        min-height: 39px;
        max-width: 100%;
        border-radius: 10px;
        font: inherit;
      }

      .mbt-select {
        width: 100%;
        padding: 8px;
        border: 1px solid #d7e3d2;
        background: #fff;
        color: #263c2a;
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
        border: 1px solid #dce7d8;
        border-radius: 12px;
        background: #fff;
        color: #24482e;
        font: inherit;
        cursor: pointer;
      }

      .mbt-avatar-choice[aria-pressed="true"] {
        padding: 4px;
        border: 2px solid #51874c;
        background: #f0f7eb;
      }

      .mbt-avatar-choice .mbt-avatar-frame {
        height: 72px;
      }

      .mbt-avatar-choice span {
        display: block;
        margin-top: 5px;
        font-size: 9px;
        font-weight: 850;
        line-height: 1.2;
        overflow-wrap: anywhere;
      }

      .mbt-description, .mbt-step-text {
        font-size: 14px;
        line-height: 1.6;
        overflow-wrap: anywhere;
      }

      .mbt-description {
        margin-top: 13px;
        padding: 12px;
        border-radius: 12px;
        background: #f5f8f2;
      }

      .mbt-step-count {
        margin-top: 15px;
        color: #608064;
        font-size: 10px;
        font-weight: 850;
        letter-spacing: .05em;
        text-transform: uppercase;
      }

      .mbt-step-title {
        margin: 5px 0 8px;
        font-size: 20px;
        font-weight: 850;
        line-height: 1.25;
      }

      .mbt-step-text { color: #58685b; }

      .mbt-progress {
        height: 5px;
        margin-top: 14px;
        overflow: hidden;
        border-radius: 10px;
        background: #e6eee2;
      }

      .mbt-progress-fill {
        height: 100%;
        background: #52884d;
        transition: width .25s ease;
      }

      .mbt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 15px;
      }

      .mbt-button {
        flex: 1 1 auto;
        padding: 8px 10px;
        border: 1px solid #dae5d6;
        background: #fff;
        color: #32553a;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .mbt-button-primary {
        border-color: #397744;
        background: #397744;
        color: #fff;
      }

      .mbt-button:disabled {
        opacity: .45;
        cursor: not-allowed;
      }

      .mbt-button:focus-visible,
      .mbt-select:focus-visible,
      .mbt-avatar-choice:focus-visible {
        outline: 3px solid #e4b93a;
        outline-offset: 2px;
      }

      #mbt-launcher {
        position: fixed;
        right: 14px;
        bottom: 14px;
        z-index: 99990;
        max-width: calc(100vw - 110px);
        padding: 11px 15px;
        border: 0;
        border-radius: 28px;
        background: #2f713c;
        color: #fff;
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        box-shadow: 0 7px 22px #0003;
        cursor: pointer;
      }

      /* The avatar never competes with the open tour panel. */
      body.mbt-tour-panel-open #mbt-guide {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      @media (max-width: 700px) {
        #mbt-guide {
          top: max(8px, env(safe-area-inset-top));
          right: 7px;
          bottom: auto;
          left: auto;
          width: 46px;
        }

        #mbt-guide .mbt-avatar-frame {
          width: 38px;
          height: 47px;
          border-radius: 8px;
        }

        #mbt-guide .mbt-guide-name,
        #mbt-guide .mbt-guide-personality {
          display: none;
        }

        #mbt-panel {
          right: 7px;
          bottom: max(7px, env(safe-area-inset-bottom));
          left: 7px;
          width: auto;
          max-height: calc(100dvh - 85px);
          padding: 13px;
          border-radius: 17px;
        }

        .mbt-panel-title { font-size: 17px; }
        .mbt-panel-avatar { flex-basis: 76px; width: 76px; height: 92px; }
        .mbt-avatar-choice .mbt-avatar-frame { height: 59px; }
        .mbt-step-title { font-size: 18px; }
        #mbt-launcher { right: 7px; bottom: 7px; }
      }

      @media (max-width: 360px) {
        #mbt-panel { padding: 10px; }
        .mbt-avatar-choices { gap: 4px; }
        .mbt-avatar-choice { padding: 3px; }
        .mbt-avatar-choice[aria-pressed="true"] { padding: 2px; }
        .mbt-avatar-choice span { font-size: 8px; }
        .mbt-panel-heading { gap: 8px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .mbt-character { animation: none !important; }
        #mbt-guide, #mbt-panel, #mbt-spotlight { transition: none; }
      }
    `;

    document.head.appendChild(style);
  }

  function makeElement(tag, attrs = {}, html = "") {
    const node = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "text") node.textContent = value;
      else if (key === "className") node.className = value;
      else node.setAttribute(key, value);
    });

    if (html) node.innerHTML = html;
    return node;
  }

  /* =========================================================
     EYES FOLLOW THE POINTER
     ========================================================= */

  function moveEyes(clientX, clientY) {
    document.querySelectorAll(".mbt-anime-avatar").forEach(svg => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dx = Math.max(-3.2, Math.min(
        3.2,
        ((clientX - (rect.left + rect.width / 2)) / rect.width) * 7
      ));

      const dy = Math.max(-3.2, Math.min(
        3.2,
        ((clientY - (rect.top + rect.height / 2)) / rect.height) * 7
      ));

      svg.querySelectorAll(".mbt-pupil").forEach(pupil => {
        pupil.setAttribute(
          "transform",
          `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`
        );
      });
    });
  }

  function resetEyes() {
    document.querySelectorAll(".mbt-pupil").forEach(pupil => {
      pupil.setAttribute("transform", "translate(0 0)");
    });
  }

  document.addEventListener("pointermove", event => {
    moveEyes(event.clientX, event.clientY);
  }, { passive: true });

  document.addEventListener("pointerleave", resetEyes, { passive: true });

  /* =========================================================
     SPEECH + MOUTH ANIMATION
     ========================================================= */

  function setSpeaking(on) {
    state.speaking = on;

    document.querySelectorAll(".mbt-anime-avatar").forEach(svg => {
      svg.classList.toggle("mbt-speaking", on);
      svg.classList.remove("mbt-mouth-wide");
    });

    if (state.mouthTimer) {
      clearInterval(state.mouthTimer);
      state.mouthTimer = null;
    }

    if (on) {
      state.mouthTimer = setInterval(() => {
        document.querySelectorAll(".mbt-anime-avatar.mbt-speaking").forEach(svg => {
          svg.classList.toggle("mbt-mouth-wide", Math.random() > .42);
        });
      }, 110);
    }
  }

  function stopSpeech() {
    state.session++;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }

  /* =========================================================
     FOUR DEFAULT VOICE PROFILES
     Chrome supplies the actual speech voices. If fewer than
     four suitable voices exist, pitch and rate still differ.
     ========================================================= */

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;

    state.voices = window.speechSynthesis.getVoices();

    const select = state.panel && $("#mbt-voice-select", state.panel);
    if (select) populateVoiceSelect(select);
  }

  function preferredLanguageVoices() {
    if (state.language === "sw") {
      const swahili = state.voices.filter(v =>
        v.lang.toLowerCase().startsWith("sw")
      );

      if (swahili.length) return swahili;
    }

    return state.voices.filter(v =>
      v.lang.toLowerCase().startsWith("en")
    );
  }

  function defaultVoice() {
    if (!state.voices.length) return null;

    const f = currentFarmer();

    if (state.language === "sw") {
      const swVoice = state.voices.find(v =>
        v.lang.toLowerCase().startsWith("sw")
      );

      if (swVoice) return swVoice;
    }

    const matching = preferredLanguageVoices();

    for (const wanted of f.voiceNames) {
      const match = matching.find(v =>
        v.name.toLowerCase().includes(wanted)
      );

      if (match) return match;
    }

    // Give each farmer a different fallback when Chrome has
    // several voices available in the selected language.
    const ids = Object.keys(farmers);
    const avatarIndex = Math.max(0, ids.indexOf(state.avatar));

    if (matching.length) {
      return matching[avatarIndex % matching.length];
    }

    return state.voices[avatarIndex % state.voices.length] || null;
  }

  function selectedVoice() {
    const uri = state.voiceOverrides[state.avatar];

    if (uri) {
      const saved = state.voices.find(v => v.voiceURI === uri);
      if (saved) return saved;
    }

    return defaultVoice();
  }

  function populateVoiceSelect(select) {
    select.innerHTML = "";

    select.appendChild(makeElement("option", {
      value: "",
      text: t("automatic")
    }));

    state.voices.forEach(voice => {
      select.appendChild(makeElement("option", {
        value: voice.voiceURI,
        text: `${voice.name} (${voice.lang})`
      }));
    });

    select.value = state.voiceOverrides[state.avatar] || "";
  }

  function speak(text) {
    stopSpeech();

    if (!("speechSynthesis" in window) || !text) return;

    const session = state.session;
    const f = currentFarmer();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice();

    utterance.pitch = f.pitch;
    utterance.rate = f.rate;
    utterance.lang = state.language === "sw" ? "sw-KE" : "en-KE";

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      if (session === state.session) setSpeaking(true);
    };

    utterance.onend = () => {
      if (session === state.session) setSpeaking(false);
    };

    utterance.onerror = () => {
      if (session === state.session) setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  /* =========================================================
     RANDOM HOMEPAGE ANIMATIONS
     ========================================================= */

  const idleReactions = [
    "mbt-react-bounce",
    "mbt-react-sway",
    "mbt-react-happy",
    "mbt-react-wink",
    "mbt-react-surprised"
  ];

  function randomHomepageReaction() {
    if (state.page !== "marketplace") return;
    if (state.active || state.setupOpen || state.speaking) return;
    if (!state.guide) return;

    const svg = $(".mbt-anime-avatar", state.guide);
    if (!svg) return;

    idleReactions.forEach(c => svg.classList.remove(c));

    const choice = idleReactions[
      Math.floor(Math.random() * idleReactions.length)
    ];

    svg.classList.add(choice);

    setTimeout(() => svg.classList.remove(choice), 900);
  }

  function scheduleReaction() {
    clearTimeout(state.reactionTimer);

    state.reactionTimer = setTimeout(() => {
      randomHomepageReaction();
      scheduleReaction();
    }, 2200 + Math.random() * 3600);
  }

  function scheduleBlink() {
    clearTimeout(state.blinkTimer);

    state.blinkTimer = setTimeout(() => {
      document.querySelectorAll(".mbt-anime-avatar").forEach(svg => {
        svg.querySelectorAll(".mbt-eye-group").forEach(eye => {
          eye.style.transform = "scaleY(.08)";
        });

        setTimeout(() => {
          svg.querySelectorAll(".mbt-eye-group").forEach(eye => {
            eye.style.transform = "";
          });
        }, 130);
      });

      scheduleBlink();
    }, 2200 + Math.random() * 2800);
  }

  /* =========================================================
     GUIDE + TOUR PANEL
     ========================================================= */

  function renderGuide() {
    if (!state.guide) {
      state.guide = makeElement("div", {
        id: "mbt-guide",
        "aria-hidden": "true"
      });

      document.body.appendChild(state.guide);
    }

    state.guide.innerHTML = `
      <div class="mbt-guide-card">
        <div class="mbt-avatar-frame">${avatarSVG(state.avatar)}</div>
        <div class="mbt-guide-name">${escapeHTML(currentFarmer().name)}</div>
        <div class="mbt-guide-personality">${escapeHTML(currentFarmer().personality)}</div>
      </div>
    `;
  }

  function ensureUI() {
    if (!state.overlay) {
      state.overlay = makeElement("div", { id: "mbt-overlay" });
      state.overlay.hidden = true;
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

    if (!state.panel) {
      state.panel = makeElement("section", {
        id: "mbt-panel",
        role: "dialog",
        "aria-label": "MavunoBridge farmer guide"
      });

      state.panel.hidden = true;
      state.panel.addEventListener("click", handlePanelClick);
      state.panel.addEventListener("change", handlePanelChange);
      document.body.appendChild(state.panel);
    }
  }

  function avatarChoices() {
    return Object.entries(farmers).map(([id, f]) => `
      <button type="button"
        class="mbt-avatar-choice"
        data-avatar="${id}"
        aria-pressed="${state.avatar === id ? "true" : "false"}">
        <div class="mbt-avatar-frame">${avatarSVG(id)}</div>
        <span>${escapeHTML(f.name)}</span>
      </button>
    `).join("");
  }

  function renderSetup() {
    stopSpeech();
    clearSpotlight();

    state.active = false;
    state.setupOpen = true;
    state.page = detectPage();

    ensureUI();

    document.body.classList.add("mbt-tour-panel-open");
    state.overlay.hidden = true;
    state.launcher.hidden = true;
    state.panel.hidden = false;

    state.panel.innerHTML = `
      <div class="mbt-panel-heading">
        <div class="mbt-panel-avatar">${avatarSVG(state.avatar)}</div>
        <div>
          <div class="mbt-panel-title">${escapeHTML(t("title"))}</div>
          <div class="mbt-muted">${escapeHTML(t("subtitle"))}</div>
          <div class="mbt-personality-tag">${escapeHTML(currentFarmer().personality)}</div>
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
        <strong>${escapeHTML(currentFarmer().name)}</strong><br>
        ${escapeHTML(currentFarmer().role)}<br>
        <span class="mbt-muted">${escapeHTML(currentFarmer().personality)}</span>
      </div>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="preview">${escapeHTML(t("preview"))}</button>
        <button class="mbt-button mbt-button-primary" data-action="start">${escapeHTML(t("start"))}</button>
        <button class="mbt-button" data-action="close">${escapeHTML(t("close"))}</button>
      </div>
    `;

    $("#mbt-language-select", state.panel).value = state.language;
    populateVoiceSelect($("#mbt-voice-select", state.panel));

    renderGuide();
  }

  function renderStep(shouldSpeak = true) {
    const list = getSteps();

    if (!list.length) {
      renderFinish();
      return;
    }

    state.step = Math.max(0, Math.min(state.step, list.length - 1));
    state.active = true;
    state.setupOpen = false;

    const [title, description, selector] = list[state.step];

    ensureUI();

    document.body.classList.add("mbt-tour-panel-open");

    state.launcher.hidden = true;
    state.overlay.hidden = false;
    state.panel.hidden = false;

    state.panel.innerHTML = `
      <div class="mbt-panel-heading">
        <div class="mbt-panel-avatar">${avatarSVG(state.avatar)}</div>
        <div>
          <div class="mbt-muted">${escapeHTML(currentFarmer().name)} · ${escapeHTML(currentFarmer().role)}</div>
          <div class="mbt-personality-tag">${escapeHTML(currentFarmer().personality)}</div>
        </div>
      </div>

      <div class="mbt-progress">
        <div class="mbt-progress-fill"
          style="width:${((state.step + 1) / list.length) * 100}%"></div>
      </div>

      <div class="mbt-step-count">${escapeHTML(t("step"))} ${state.step + 1} / ${list.length}</div>
      <h2 class="mbt-step-title">${escapeHTML(title)}</h2>
      <div class="mbt-step-text">${escapeHTML(description)}</div>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="back" ${state.step === 0 ? "disabled" : ""}>${escapeHTML(t("back"))}</button>
        <button class="mbt-button" data-action="repeat">${escapeHTML(t("replay"))}</button>
        <button class="mbt-button mbt-button-primary" data-action="next">${escapeHTML(state.step === list.length - 1 ? t("finish") : t("next"))}</button>
        <button class="mbt-button" data-action="skip">${escapeHTML(t("skip"))}</button>
      </div>
    `;

    renderGuide();
    showSpotlight(selector);

    if (shouldSpeak) {
      const spoken = state.step === 0
        ? `${currentFarmer().greeting[state.language]} ${title}. ${description}`
        : `${title}. ${description}`;

      speak(spoken);
    }
  }

  function renderFinish() {
    stopSpeech();
    clearSpotlight();

    state.active = false;
    state.setupOpen = false;

    localStorage.setItem(STORE.completed, "true");
    state.overlay.hidden = true;

    state.panel.innerHTML = `
      <div class="mbt-panel-heading">
        <div class="mbt-panel-avatar">${avatarSVG(state.avatar)}</div>
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

    speak(t("doneText"));
  }

  /* =========================================================
     SPOTLIGHT
     ========================================================= */

  function clearSpotlight() {
    if (state.spotlight) state.spotlight.hidden = true;
  }

  function findTarget(selector) {
    if (!selector) return null;

    for (const candidate of selector.split(",").map(s => s.trim())) {
      try {
        const target = $(candidate);

        if (
          target &&
          target.getClientRects().length &&
          !target.closest("#mbt-panel") &&
          !target.closest("#mbt-guide") &&
          !target.closest("#mbt-launcher") &&
          !target.closest("#mbt-overlay") &&
          !target.closest("#mbt-spotlight")
        ) {
          return target;
        }
      } catch {
        // Try the next selector.
      }
    }

    return null;
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
      if (!state.active || !state.spotlight) return;

      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      state.spotlight.style.left = `${Math.max(0, rect.left - 4)}px`;
      state.spotlight.style.top = `${Math.max(0, rect.top - 4)}px`;
      state.spotlight.style.width = `${rect.width + 8}px`;
      state.spotlight.style.height = `${rect.height + 8}px`;
      state.spotlight.hidden = false;
    };

    requestAnimationFrame(update);
  }

  /* =========================================================
     ACTIONS
     ========================================================= */

  function selectAvatar(id) {
    if (!farmers[id]) return;

    state.avatar = id;
    localStorage.setItem(STORE.avatar, id);

    if (state.active) {
      renderStep(false);
      speak(currentFarmer().greeting[state.language]);
    } else {
      renderSetup();
    }
  }

  function selectLanguage(language) {
    if (!words[language]) return;

    state.language = language;
    localStorage.setItem(STORE.language, language);

    if (state.active) renderStep(true);
    else renderSetup();
  }

  function selectVoice(uri) {
    if (uri) {
      state.voiceOverrides[state.avatar] = uri;
    } else {
      delete state.voiceOverrides[state.avatar];
    }

    localStorage.setItem(STORE.overrides, JSON.stringify(state.voiceOverrides));

    speak(currentFarmer().greeting[state.language]);
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
    scheduleReaction();
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
      case "preview":
        speak(currentFarmer().greeting[state.language]);
        break;
      case "repeat":
        if (state.active) {
          const current = getSteps()[state.step];
          speak(`${current[0]}. ${current[1]}`);
        } else {
          speak(currentFarmer().greeting[state.language]);
        }
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

  function onResize() {
    if (!state.active) return;

    const current = getSteps()[state.step];
    if (current) showSpotlight(current[2]);
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    if (!document.body) return;

    addStyles();
    state.page = detectPage();

    ensureUI();
    renderGuide();

    scheduleReaction();
    scheduleBlink();

    if ("speechSynthesis" in window) {
      loadVoices();

      window.speechSynthesis.addEventListener?.(
        "voiceschanged",
        loadVoices
      );
    }

    window.addEventListener("resize", onResize);

    window.addEventListener("hashchange", () => {
      state.page = detectPage();
      scheduleReaction();
    });

    window.addEventListener("keydown", event => {
      if (event.key === "Escape" && (state.active || state.setupOpen)) {
        closeTour();
      }
    });
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
