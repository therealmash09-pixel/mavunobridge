
/* ============================================================
   MAVUNOBRIDGE — ANIMATED WEBSITE TOUR
   Lightweight • Four farmer guides • Spoken narration
   English • Sheng + English • Kiswahili
   Moving guide • Spotlight • Skip • Restart
   ============================================================ */

(() => {
  "use strict";

  if (window.__mavunoAnimatedTour) return;
  window.__mavunoAnimatedTour = true;

  const STORAGE = {
    avatar: "mavunobridge_tour_avatar",
    language: "mavunobridge_tour_language",
    voice: "mavunobridge_tour_voice",
    completed: "mavunobridge_tour_completed"
  };

  const farmers = {
    woman1: {
      name: "Akinyi",
      skin: "#895338",
      hair: "#241913",
      shirt: "#3c804b",
      style: "braids",
      pitch: 1.12,
      rate: 0.91,
      gender: "female",
      voiceHints: ["zira", "samantha", "karen", "moira", "female"]
    },
    woman2: {
      name: "Wanjiku",
      skin: "#b87952",
      hair: "#302018",
      shirt: "#c58a35",
      style: "puff",
      pitch: 1.24,
      rate: 0.97,
      gender: "female",
      voiceHints: ["victoria", "serena", "tessa", "fiona", "female"]
    },
    man1: {
      name: "Kamau",
      skin: "#75452f",
      hair: "#211915",
      shirt: "#3d7750",
      style: "short",
      pitch: 0.84,
      rate: 0.92,
      gender: "male",
      voiceHints: ["david", "daniel", "george", "male"]
    },
    man2: {
      name: "Otieno",
      skin: "#a66a47",
      hair: "#241b17",
      shirt: "#347a8d",
      style: "fade",
      pitch: 0.96,
      rate: 1.01,
      gender: "male",
      voiceHints: ["mark", "james", "guy", "thomas", "male"]
    }
  };

  const copy = {
    en: {
      launch: "Website Tour",
      heading: "Welcome to MavunoBridge!",
      subheading: "Your farm-to-market connection",
      language: "Guide language",
      voice: "Narration",
      voiceOn: "Voice ON",
      voiceOff: "Voice OFF",
      next: "Next →",
      back: "← Back",
      skip: "Skip tour",
      finish: "Finish tour",
      restart: "Restart tour",
      step: "STEP",
      talking: "Your farmer guide is speaking…",
      ready: "Ready when you are!",
      done: "You're ready to explore MavunoBridge!",
      steps: [
        {
          title: "Karibu! Welcome!",
          speech: "Hi there! Welcome to MavunoBridge. I'm your farmer guide, and I'll show you around. This website demo connects farmers and buyers, making it easier to discover agricultural products and farming opportunities.",
          selectors: ["header", ".site-header", ".navbar", "nav", "#hero", ".hero"]
        },
        {
          title: "Explore the marketplace",
          speech: "This is the marketplace! Here you can explore products listed by farmers, compare prices, and find products that match your needs. Look around and discover what is available.",
          selectors: ["#listingGrid", "#marketplaceGrid", "#products", ".product-grid", ".marketplace", "#marketplace"]
        },
        {
          title: "Choose your category",
          speech: "Now let's explore categories. Look for fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs and equipment. Selecting a category helps you narrow down the products you see.",
          selectors: ["#categories", "#categoryGrid", ".category-grid", ".categories", ".category-list"]
        },
        {
          title: "Search and filter",
          speech: "Want something specific? Use the search box and available filters. Depending on the options on this page, you can narrow your search by product, location, sale type or sorting preference.",
          selectors: ["#searchInput", "#searchBar", "input[type='search']", "#filterLocation", ".marketplace-filters"]
        },
        {
          title: "Sell your harvest",
          speech: "Farmers, this part is for you! Find the sell or add listing button. Add your product information, category, quantity, price, location and contact details using the form provided.",
          selectors: ["#sellButton", "#heroSellButton", "#listingForm", "#sellForm", "[data-action='sell']"]
        },
        {
          title: "Meet Smart Assist",
          speech: "Meet Smart Assist, your digital farming companion! Open it to explore the farming guidance and tools available in this demo. It can help visitors discover useful farming information.",
          selectors: ["#smartAssist", "#smart-assist", ".smart-assist", "a[href*='smart-assist']", "a[href*='smart_assist']"]
        },
        {
          title: "Visit SACCO Hub",
          speech: "SACCO Hub brings together the SACCO information and opportunities featured in this demo. Open the page to explore the details provided there.",
          selectors: ["#saccoHub", "#sacco", ".sacco-hub", "a[href*='sacco']"]
        },
        {
          title: "You're ready to go!",
          speech: "And that's our tour! You now know the main places to explore in MavunoBridge. Try the marketplace, discover farming tools, and explore Smart Assist. Asante for joining the tour. Let's grow together!",
          selectors: []
        }
      ]
    },

    mix: {
      launch: "Website Tour",
      heading: "Karibu MavunoBridge!",
      subheading: "Connecting shamba na soko",
      language: "Guide language",
      voice: "Sauti ya guide",
      voiceOn: "Voice ON",
      voiceOff: "Voice OFF",
      next: "Endelea →",
      back: "← Rudi",
      skip: "Skip tour",
      finish: "Maliza tour",
      restart: "Anza tour tena",
      step: "HATUA",
      talking: "Farmer guide anakuongelesha…",
      ready: "Tuko ready!",
      done: "Uko ready ku-explore MavunoBridge!",
      steps: [
        {
          title: "Karibu! Welcome!",
          speech: "Sasa karibu MavunoBridge! Mimi ni farmer guide wako, na nitakuonyesha vile website inawork. Hii demo inaconnect farmers na buyers na inakusaidia ku-explore agricultural products na farming opportunities.",
          selectors: ["header", ".site-header", ".navbar", "nav", "#hero", ".hero"]
        },
        {
          title: "Explore marketplace",
          speech: "Hapa ndio marketplace! Unaweza ku-browse products zilizowekwa na farmers, ku-compare prices, na kupata products zinamatch na unahitaji. Explore uone vitu ziko available.",
          selectors: ["#listingGrid", "#marketplaceGrid", "#products", ".product-grid", ".marketplace", "#marketplace"]
        },
        {
          title: "Chagua category",
          speech: "Tuangalie categories. Kuna fruits, vegetables, grains, cereals, legumes, nuts, spices, livestock, farm inputs na equipment. Ukichagua category, unapata products za hiyo section kwa urahisi.",
          selectors: ["#categories", "#categoryGrid", ".category-grid", ".categories", ".category-list"]
        },
        {
          title: "Search na filters",
          speech: "Unatafuta kitu specific? Tumia search box na filters zilizopo. Unaweza ku-narrow search kulingana na product, location ama options zingine zinazopatikana kwa page.",
          selectors: ["#searchInput", "#searchBar", "input[type='search']", "#filterLocation", ".marketplace-filters"]
        },
        {
          title: "Sell your harvest",
          speech: "Kama wewe ni farmer, hii ni yako! Tafuta sell ama add listing button. Weka product details, category, quantity, price, location na contact details kwa form.",
          selectors: ["#sellButton", "#heroSellButton", "#listingForm", "#sellForm", "[data-action='sell']"]
        },
        {
          title: "Meet Smart Assist",
          speech: "Huyu ni Smart Assist, digital farming companion wako! Fungua page yake u-explore farming guidance na tools zilizowekwa kwa demo. Itakusaidia kupata useful farming information.",
          selectors: ["#smartAssist", "#smart-assist", ".smart-assist", "a[href*='smart-assist']", "a[href*='smart_assist']"]
        },
        {
          title: "Visit SACCO Hub",
          speech: "SACCO Hub inakuonyesha SACCO information na opportunities zilizowekwa kwa demo. Fungua hiyo page uangalie details zilizopo.",
          selectors: ["#saccoHub", "#sacco", ".sacco-hub", "a[href*='sacco']"]
        },
        {
          title: "Uko ready!",
          speech: "Tumemaliza tour! Sasa uko ready ku-explore MavunoBridge. Jaribu marketplace, farming tools na Smart Assist. Asante kwa kujoin tour. Tu-grow pamoja!",
          selectors: []
        }
      ]
    },

    sw: {
      launch: "Ziara ya Tovuti",
      heading: "Karibu MavunoBridge!",
      subheading: "Kuunganisha wakulima na masoko",
      language: "Lugha ya mwongozo",
      voice: "Sauti ya mwongozo",
      voiceOn: "Sauti IMEWASHWA",
      voiceOff: "Sauti IMEZIMWA",
      next: "Endelea →",
      back: "← Rudi",
      skip: "Ruka ziara",
      finish: "Maliza ziara",
      restart: "Anza tena",
      step: "HATUA",
      talking: "Mwongozo wako anazungumza…",
      ready: "Tuko tayari!",
      done: "Uko tayari kuchunguza MavunoBridge!",
      steps: [
        {
          title: "Karibu MavunoBridge!",
          speech: "Karibu MavunoBridge! Mimi ni mwongozo wako, na nitakuonyesha jinsi tovuti hii inavyofanya kazi. Toleo hili la majaribio linaunganisha wakulima na wanunuzi na kuwasaidia kuchunguza bidhaa za kilimo.",
          selectors: ["header", ".site-header", ".navbar", "nav", "#hero", ".hero"]
        },
        {
          title: "Chunguza soko",
          speech: "Hapa ndipo soko lilipo. Unaweza kuchunguza bidhaa zilizowekwa na wakulima, kulinganisha bei na kutafuta bidhaa zinazokufaa.",
          selectors: ["#listingGrid", "#marketplaceGrid", "#products", ".product-grid", ".marketplace", "#marketplace"]
        },
        {
          title: "Chagua kundi la bidhaa",
          speech: "Tumia makundi kuchunguza matunda, mboga, nafaka, mikunde, karanga, viungo, mifugo, pembejeo na vifaa vya kilimo. Kuchagua kundi hurahisisha kutafuta bidhaa.",
          selectors: ["#categories", "#categoryGrid", ".category-grid", ".categories", ".category-list"]
        },
        {
          title: "Tafuta bidhaa",
          speech: "Tumia sehemu ya utafutaji na vichujio vinavyopatikana kutafuta bidhaa kwa jina au eneo. Hii itakusaidia kupata bidhaa unazohitaji kwa urahisi.",
          selectors: ["#searchInput", "#searchBar", "input[type='search']", "#filterLocation", ".marketplace-filters"]
        },
        {
          title: "Uza mazao yako",
          speech: "Kama wewe ni mkulima, tafuta kitufe cha kuuza au kuongeza bidhaa. Weka jina la bidhaa, kundi, kiasi, bei, eneo na taarifa za mawasiliano zinazohitajika.",
          selectors: ["#sellButton", "#heroSellButton", "#listingForm", "#sellForm", "[data-action='sell']"]
        },
        {
          title: "Kutana na Smart Assist",
          speech: "Smart Assist ni msaidizi wako wa kidijitali wa kilimo. Fungua ukurasa wake kuchunguza ushauri na zana za kilimo zinazopatikana katika toleo hili la majaribio.",
          selectors: ["#smartAssist", "#smart-assist", ".smart-assist", "a[href*='smart-assist']", "a[href*='smart_assist']"]
        },
        {
          title: "Tembelea SACCO Hub",
          speech: "SACCO Hub ina taarifa na fursa za SACCO zilizowekwa katika toleo hili. Fungua ukurasa huo ili kuchunguza maelezo yanayopatikana.",
          selectors: ["#saccoHub", "#sacco", ".sacco-hub", "a[href*='sacco']"]
        },
        {
          title: "Uko tayari!",
          speech: "Tumekamilisha ziara! Sasa unaweza kuchunguza MavunoBridge, kuangalia soko na kutumia zana za kilimo zinazopatikana. Asante kwa kujiunga nasi. Tukuze kilimo pamoja!",
          selectors: []
        }
      ]
    }
  };

  const state = {
    avatar: get(STORAGE.avatar, "woman1"),
    language: get(STORAGE.language, "mix"),
    voiceOn: get(STORAGE.voice, "on") !== "off",
    active: false,
    step: 0,
    session: 0,
    voiceList: [],
    selectedVoiceURI: "",
    speechTimer: 0,
    mouthTimer: 0,
    moveTimer: 0,
    resizeTimer: 0,
    currentTarget: null,
    previousFocus: null
  };

  if (!farmers[state.avatar]) state.avatar = "woman1";
  if (!copy[state.language]) state.language = "mix";

  const lang = () => copy[state.language];

  function get(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function avatarSVG(id, talking = false) {
    const a = farmers[id] || farmers.woman1;

    let hair = "";

    if (a.style === "braids") {
      hair = `
        <path d="M26 47 Q20 10 50 11 Q80 10 74 47 L71 76 L64 66 L66 37 Q50 24 34 37 L36 68 L29 77Z" fill="${a.hair}"/>
        <path d="M29 34 Q24 50 30 64 M36 26 Q30 46 36 62 M64 27 Q71 46 64 62 M71 35 Q77 49 70 64" stroke="#493126" stroke-width="3" fill="none"/>
        <circle cx="29" cy="70" r="3" fill="#e4bd62"/>
        <circle cx="70" cy="70" r="3" fill="#e4bd62"/>`;
    } else if (a.style === "puff") {
      hair = `
        <circle cx="34" cy="25" r="12" fill="${a.hair}"/>
        <circle cx="45" cy="17" r="13" fill="${a.hair}"/>
        <circle cx="59" cy="19" r="13" fill="${a.hair}"/>
        <circle cx="68" cy="28" r="10" fill="${a.hair}"/>
        <path d="M27 44 Q23 25 39 26 Q51 19 63 27 Q77 30 73 46 L68 68 L63 36 Q49 28 35 37 L32 68Z" fill="${a.hair}"/>`;
    } else if (a.style === "short") {
      hair = `<path d="M27 42 Q24 11 50 12 Q76 11 73 42 L66 34 Q50 25 34 34Z" fill="${a.hair}"/>`;
    } else {
      hair = `
        <path d="M27 41 Q27 14 50 13 Q73 14 73 41 L66 31 Q50 25 34 32Z" fill="${a.hair}"/>
        <path d="M31 36 L27 49 M69 36 L73 49" stroke="${a.hair}" stroke-width="4" stroke-linecap="round"/>`;
    }

    const mouth = talking
      ? `<ellipse cx="50" cy="58" rx="5" ry="6" fill="#542b22"/>`
      : `<path d="M42 56 Q50 62 58 56" stroke="#542b22" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;

    const beard = id.startsWith("man")
      ? `<path d="M32 54 Q33 72 50 76 Q67 72 68 54 L61 61 Q50 67 39 61Z" fill="${a.hair}"/>`
      : "";

    const wrap = id === "woman2"
      ? `<path d="M25 34 Q50 18 75 34 L72 41 Q50 31 28 41Z" fill="#684a83"/><path d="M34 30 Q50 25 66 30" stroke="#e5c5f0" stroke-width="3" fill="none"/>`
      : "";

    const earrings = id === "woman1"
      ? `<circle cx="27" cy="51" r="3" fill="#e6bd57"/><circle cx="73" cy="51" r="3" fill="#e6bd57"/>`
      : "";

    return `
      <svg viewBox="0 0 100 112" role="img" aria-label="${escapeHTML(a.name)}">
        <ellipse cx="50" cy="105" rx="29" ry="5" fill="#173b26" opacity=".14"/>
        <path d="M18 105 Q22 80 38 75 L44 73 L50 84 L57 73 Q78 79 82 105Z" fill="${a.shirt}"/>
        <path d="M39 75 L50 88 L61 75" fill="#fff" opacity=".9"/>
        <path d="M43 65 L43 78 L57 78 L57 65" fill="${a.skin}"/>
        <ellipse cx="27" cy="47" rx="5" ry="8" fill="${a.skin}"/>
        <ellipse cx="73" cy="47" rx="5" ry="8" fill="${a.skin}"/>
        <ellipse cx="50" cy="44" rx="22" ry="27" fill="${a.skin}"/>
        ${hair}${wrap}
        <path d="M35 39 Q40 35 45 39 M55 39 Q60 35 65 39" stroke="#35241c" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="40" cy="45" rx="2.5" ry="3" fill="#251b17"/>
        <ellipse cx="60" cy="45" rx="2.5" ry="3" fill="#251b17"/>
        <path d="M49 46 L46 53 Q50 56 53 53" stroke="#75452f" stroke-width="1.5" fill="none"/>
        ${mouth}${beard}${earrings}
      </svg>`;
  }

  function styles() {
    if (document.getElementById("mbAnimatedTourStyles")) return;

    const style = document.createElement("style");
    style.id = "mbAnimatedTourStyles";

    style.textContent = `
      #mbTourLaunch{
        position:fixed;left:15px;bottom:15px;z-index:9990;
        display:flex;align-items:center;gap:9px;
        border:0;border-radius:999px;padding:8px 15px 8px 8px;
        background:#214b31;color:white;font:700 13px system-ui;
        box-shadow:0 5px 20px #142b1b30;cursor:pointer
      }
      #mbTourLaunch .mb-mini{width:36px;height:39px}
      #mbTourLaunch svg,#mbTourPanel svg{width:100%;height:100%;display:block}
      #mbTourOverlay{
        position:fixed;inset:0;z-index:9991;
        background:#1022194d;pointer-events:none;
        transition:background .25s ease
      }
      #mbTourPanel{
        position:fixed;right:18px;bottom:18px;width:min(390px,calc(100vw - 30px));
        max-height:calc(100dvh - 36px);overflow:auto;z-index:9994;
        box-sizing:border-box;background:#fff;color:#24422d;
        border:1px solid #dfebdc;border-radius:21px;padding:16px;
        box-shadow:0 18px 65px #102b1d42;
        font:13px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif
      }
      #mbTourPanel *{box-sizing:border-box}
      #mbTourPanel button,#mbTourPanel select{font:inherit;cursor:pointer}
      #mbTourPanel .mb-top{display:flex;align-items:center;gap:11px}
      #mbTourPanel .mb-portrait{
        flex:0 0 76px;width:76px;height:82px;overflow:hidden;
        border-radius:16px;background:#eef6e9;
        animation:mbGuideFloat 2.8s ease-in-out infinite
      }
      #mbTourPanel .mb-portrait.speaking svg{animation:mbGuideTalk .22s ease-in-out infinite alternate}
      @keyframes mbGuideFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes mbGuideTalk{from{transform:translateY(0)}to{transform:translateY(-2px)}}
      #mbTourPanel .mb-kicker{font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#58815d}
      #mbTourPanel .mb-head{font-size:17px;font-weight:850;line-height:1.2;margin:4px 0}
      #mbTourPanel .mb-sub{font-size:11px;color:#657769}
      #mbTourPanel .mb-close{margin-left:auto;align-self:flex-start;border:0;border-radius:50%;width:30px;height:30px;background:#eff4ed;color:#34543b;font-size:18px}
      #mbTourPanel .mb-avatars{display:flex;gap:6px;margin-top:12px}
      #mbTourPanel .mb-avatar{
        flex:1;min-width:0;padding:5px 2px;border:1px solid #dfe8dc;
        border-radius:11px;background:#fafcf9;color:#435d47;
        font-size:10px;font-weight:700
      }
      #mbTourPanel .mb-avatar svg{width:37px;height:41px;margin:0 auto 3px}
      #mbTourPanel .mb-avatar.selected{border:2px solid #4b8b4c;background:#eff7eb;padding:4px 1px}
      #mbTourPanel .mb-progress{display:flex;gap:5px;margin:15px 0 12px}
      #mbTourPanel .mb-progress span{height:4px;flex:1;border-radius:5px;background:#e6ece4}
      #mbTourPanel .mb-progress span.done{background:#4b8b4c}
      #mbTourPanel .mb-step{font-size:10px;font-weight:800;letter-spacing:.08em;color:#608364}
      #mbTourPanel .mb-title{font-size:18px;font-weight:850;margin:6px 0;color:#203b2a}
      #mbTourPanel .mb-copy{font-size:13px;line-height:1.65;color:#536557;margin:0}
      #mbTourPanel .mb-status{display:flex;align-items:center;gap:6px;margin-top:9px;font-size:10px;color:#658069}
      #mbTourPanel .mb-dot{width:7px;height:7px;border-radius:50%;background:#7eaa67}
      #mbTourPanel .mb-dot.talking{animation:mbPulse .65s infinite alternate}
      @keyframes mbPulse{to{opacity:.25;transform:scale(.75)}}
      #mbTourPanel .mb-settings{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
      #mbTourPanel label{display:block;font-size:10px;font-weight:700;color:#526a56;margin-bottom:4px}
      #mbTourPanel select{width:100%;min-width:0;border:1px solid #dbe5d8;border-radius:9px;padding:8px;background:#f9fbf8;color:#29442f;font-size:12px}
      #mbTourPanel .mb-actions{display:flex;gap:8px;margin-top:14px}
      #mbTourPanel .mb-actions button{border:0;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:800}
      #mbTourPanel .mb-primary{flex:1;background:#2e6b3b;color:white}
      #mbTourPanel .mb-secondary{background:#edf3ea;color:#36553c}
      #mbTourPanel .mb-skip{margin-top:8px;padding:5px 0;border:0;background:transparent;color:#6b7d6d;font-size:11px}
      #mbTourPanel .mb-note{margin-top:5px;color:#7b8c7b;font-size:10px}
      .mb-tour-highlight{
        position:relative!important;z-index:9992!important;
        outline:3px solid #e7bd4d!important;outline-offset:5px!important;
        border-radius:8px!important;
        transition:outline-color .2s ease,box-shadow .2s ease!important;
        box-shadow:0 0 0 7px #e7bd4d30!important
      }
      #mbTourWalker{
        position:fixed;z-index:9993;width:76px;height:90px;
        pointer-events:none;filter:drop-shadow(0 6px 8px #132a1c22);
        transform-origin:50% 85%;
        transition:left .58s cubic-bezier(.2,.8,.2,1),top .58s cubic-bezier(.2,.8,.2,1);
        animation:mbWalkerBob 1.3s ease-in-out infinite
      }
      #mbTourWalker svg{width:100%;height:100%}
      #mbTourWalker.talking svg{animation:mbGuideTalk .2s infinite alternate}
      @keyframes mbWalkerBob{0%,100%{margin-top:0}50%{margin-top:-6px}}
      @media(max-width:560px){
        #mbTourLaunch{left:9px;bottom:9px}
        #mbTourPanel{left:9px;right:9px;bottom:57px;width:auto;max-height:calc(100dvh - 70px);padding:13px;border-radius:17px}
        #mbTourPanel .mb-portrait{width:62px;height:68px;flex-basis:62px}
        #mbTourPanel .mb-head{font-size:15px}
        #mbTourPanel .mb-copy{font-size:12px}
        #mbTourWalker{width:58px;height:70px}
      }
      @media(prefers-reduced-motion:reduce){
        #mbTourPanel *,#mbTourWalker,#mbTourLaunch{animation:none!important;transition:none!important}
      }
    `;

    document.head.appendChild(style);
  }

  function stopSpeech() {
    state.session++;
    state.speaking = false;

    clearTimeout(state.speechTimer);
    clearInterval(state.mouthTimer);

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }

    updateMouth(false);
  }

  function updateMouth(talking) {
    const portrait = document.querySelector("#mbTourPanel .mb-portrait");
    const walker = document.getElementById("mbTourWalker");

    if (portrait) {
      portrait.classList.toggle("speaking", talking);
      portrait.innerHTML = avatarSVG(state.avatar, talking);
    }

    if (walker) {
      walker.classList.toggle("talking", talking);
      walker.innerHTML = avatarSVG(state.avatar, talking);
    }

    const status = document.querySelector("#mbTourPanel .mb-dot");
    const statusText = document.querySelector("#mbTourPanel .mb-status-text");

    if (status) status.classList.toggle("talking", talking);
    if (statusText) {
      statusText.textContent = talking ? lang().talking : lang().ready;
    }
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return [];
    state.voiceList = window.speechSynthesis.getVoices() || [];
    return state.voiceList;
  }

  function pickVoice() {
    const voices = loadVoices();
    if (!voices.length) return null;

    const a = farmers[state.avatar];
    const wantedLanguage = state.language === "sw" ? "sw"
      : state.language === "en" ? "en" : "en";

    const englishVoices = voices.filter(v =>
      /^en(-|_|$)/i.test(v.lang || "")
    );

    const swahiliVoices = voices.filter(v =>
      /^sw(-|_|$)/i.test(v.lang || "") ||
      /swahili/i.test(v.name || "")
    );

    const pool = wantedLanguage === "sw" && swahiliVoices.length
      ? swahiliVoices
      : englishVoices.length ? englishVoices : voices;

    const preferred = pool.find(v =>
      a.voiceHints.some(hint => hint.toLowerCase() === v.name.toLowerCase()) &&
      (!state.selectedVoiceURI || v.voiceURI === state.selectedVoiceURI)
    );

    if (preferred) return preferred;

    const matched = pool.find(v =>
      a.voiceHints.some(hint => v.name.toLowerCase().includes(hint))
    );

    if (matched) return matched;

    // A device may not provide separate male and female voices.
    // Use its best available voice and adjust pitch/rate per character.
    return pool.find(v => v.default) || pool[0] || null;
  }

  function speak(text) {
    stopSpeech();

    if (!state.active || !state.voiceOn ||
        !("speechSynthesis" in window)) {
      return;
    }

    const session = state.session;
    const utterance = new SpeechSynthesisUtterance(text);
    const a = farmers[state.avatar];
    const voice = pickVoice();

    if (voice) {
      utterance.voice = voice;
      state.selectedVoiceURI = voice.voiceURI;
    }

    utterance.lang = state.language === "sw"
      ? "sw-KE"
      : "en-KE";

    utterance.pitch = a.pitch;
    utterance.rate = a.rate;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (session !== state.session || !state.active) return;

      state.speaking = true;
      updateMouth(true);

      // Animate the farmer while speech is active.
      state.mouthTimer = window.setInterval(() => {
        if (session !== state.session || !state.active) {
          clearInterval(state.mouthTimer);
          return;
        }
        const open = Math.random() > 0.38;
        updateMouth(open);
      }, 170);
    };

    const finishSpeech = () => {
      if (session !== state.session) return;

      state.speaking = false;
      clearInterval(state.mouthTimer);
      updateMouth(false);
    };

    utterance.onend = finishSpeech;
    utterance.onerror = finishSpeech;

    // One utterance per step. Never start a second narration
    // until the previous utterance has been cancelled.
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      finishSpeech();
    }
  }

  function findTarget(step) {
    const selectors = lang().steps[step]?.selectors || [];

    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element && element.getClientRects().length) return element;
      } catch (_) {}
    }

    return null;
  }

  function removeHighlight() {
    if (state.currentTarget) {
      state.currentTarget.classList.remove("mb-tour-highlight");
    }
    state.currentTarget = null;
  }

  function createWalker() {
    let walker = document.getElementById("mbTourWalker");

    if (!walker) {
      walker = document.createElement("div");
      walker.id = "mbTourWalker";
      walker.setAttribute("aria-hidden", "true");
      document.body.appendChild(walker);
    }

    walker.innerHTML = avatarSVG(state.avatar);
    return walker;
  }

  function moveWalker(target) {
    const walker = createWalker();
    const panel = document.getElementById("mbTourPanel");
    const mobile = window.innerWidth <= 560;

    let x = window.innerWidth * 0.5;
    let y = Math.max(95, window.innerHeight * 0.22);

    if (target) {
      const rect = target.getBoundingClientRect();

      // Position the animated farmer beside the highlighted item.
      const walkerWidth = mobile ? 58 : 76;
      const rightSpace = window.innerWidth - rect.right;
      const leftSpace = rect.left;

      if (rightSpace > walkerWidth + 15) {
        x = rect.right + 8;
      } else if (leftSpace > walkerWidth + 15) {
        x = rect.left - walkerWidth - 8;
      } else {
        x = Math.max(8, Math.min(
          window.innerWidth - walkerWidth - 8,
          rect.left + rect.width / 2 - walkerWidth / 2
        ));
      }

      y = Math.max(75, Math.min(
        window.innerHeight - 110,
        rect.top + Math.min(rect.height / 2, 70) - 40
      ));
    }

    // Keep the character away from the tour panel.
    if (panel && !panel.hidden) {
      const p = panel.getBoundingClientRect();
      const overlaps = x < p.right && x + (mobile ? 58 : 76) > p.left &&
        y < p.bottom && y + 90 > p.top;

      if (overlaps) {
        y = Math.max(70, p.top - 100);
        if (y < 65) y = Math.min(window.innerHeight - 100, p.bottom + 8);
      }
    }

    walker.style.left = `${Math.round(x)}px`;
    walker.style.top = `${Math.round(y)}px`;
  }

  function updateStep() {
    const current = lang().steps[state.step];
    if (!current) return;

    const panel = document.getElementById("mbTourPanel");
    if (!panel) return;

    panel.querySelector(".mb-step").textContent =
      `${lang().step} ${state.step + 1} / ${lang().steps.length}`;

    panel.querySelector(".mb-title").textContent = current.title;
    panel.querySelector(".mb-copy").textContent = current.speech;

    panel.querySelectorAll(".mb-progress span").forEach((bar, i) => {
      bar.classList.toggle("done", i <= state.step);
    });

    const next = panel.querySelector("[data-action='next']");
    const back = panel.querySelector("[data-action='back']");

    next.textContent = state.step === lang().steps.length - 1
      ? lang().finish
      : lang().next;

    back.textContent = lang().back;
    back.disabled = state.step === 0;
    back.style.opacity = state.step === 0 ? ".45" : "1";

    removeHighlight();

    const target = findTarget(state.step);
    state.currentTarget = target;

    if (target) {
      target.classList.add("mb-tour-highlight");

      // Scroll only the target into view; no continuous page scanning.
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    clearTimeout(state.moveTimer);
    state.moveTimer = window.setTimeout(() => {
      if (state.active) moveWalker(target);
    }, target ? 300 : 30);

    speak(current.speech);
  }

  function createPanel() {
    let panel = document.getElementById("mbTourPanel");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "mbTourPanel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "MavunoBridge animated website tour");

    panel.innerHTML = `
      <div class="mb-top">
        <div class="mb-portrait">${avatarSVG(state.avatar)}</div>
        <div>
          <div class="mb-kicker">MavunoBridge • Farmer Guide</div>
          <div class="mb-head"></div>
          <div class="mb-sub"></div>
        </div>
        <button class="mb-close" data-action="close" aria-label="Close tour">×</button>
      </div>

      <div class="mb-avatars">
        ${Object.entries(farmers).map(([id, a]) => `
          <button class="mb-avatar ${id === state.avatar ? "selected" : ""}"
            data-avatar="${id}" aria-pressed="${id === state.avatar}">
            ${avatarSVG(id)}
            ${escapeHTML(a.name)}
          </button>
        `).join("")}
      </div>

      <div class="mb-progress">
        ${lang().steps.map(() => "<span></span>").join("")}
      </div>

      <div class="mb-step"></div>
      <div class="mb-title"></div>
      <p class="mb-copy"></p>

      <div class="mb-status">
        <span class="mb-dot"></span>
        <span class="mb-status-text"></span>
      </div>

      <div class="mb-settings">
        <div>
          <label for="mbTourLanguage">${escapeHTML(lang().language)}</label>
          <select id="mbTourLanguage">
            <option value="mix">Sheng + English</option>
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
          </select>
        </div>
        <div>
          <label for="mbTourVoice">${escapeHTML(lang().voice)}</label>
          <select id="mbTourVoice">
            <option value="on">${escapeHTML(lang().voiceOn)}</option>
            <option value="off">${escapeHTML(lang().voiceOff)}</option>
          </select>
        </div>
      </div>

      <div class="mb-actions">
        <button class="mb-secondary" data-action="back">${escapeHTML(lang().back)}</button>
        <button class="mb-primary" data-action="next">${escapeHTML(lang().next)}</button>
      </div>

      <button class="mb-skip" data-action="skip">${escapeHTML(lang().skip)}</button>
      <div class="mb-note">Interactive farmer guide • Demo edition</div>
    `;

    panel.addEventListener("click", handlePanelClick);
    panel.addEventListener("change", handlePanelChange);
    document.body.appendChild(panel);

    return panel;
  }

  function refreshPanel() {
    const panel = document.getElementById("mbTourPanel");
    if (!panel) return;

    panel.querySelector(".mb-head").textContent = lang().heading;
    panel.querySelector(".mb-sub").textContent = lang().subheading;

    const languageSelect = panel.querySelector("#mbTourLanguage");
    const voiceSelect = panel.querySelector("#mbTourVoice");

    languageSelect.value = state.language;
    voiceSelect.value = state.voiceOn ? "on" : "off";

    panel.querySelectorAll(".mb-avatar").forEach(button => {
      const selected = button.dataset.avatar === state.avatar;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    panel.querySelector(".mb-portrait").innerHTML = avatarSVG(state.avatar);
    panel.querySelector(".mb-progress").innerHTML =
      lang().steps.map(() => "<span></span>").join("");

    panel.querySelector(".mb-skip").textContent = lang().skip;

    updateStep();
  }

  function createLauncher() {
    if (document.getElementById("mbTourLaunch")) return;

    const button = document.createElement("button");
    button.id = "mbTourLaunch";
    button.type = "button";
    button.innerHTML = `
      <span class="mb-mini">${avatarSVG(state.avatar)}</span>
      <span>${escapeHTML(lang().launch)}</span>
    `;

    button.addEventListener("click", startTour);
    document.body.appendChild(button);
  }

  function refreshLauncher() {
    const button = document.getElementById("mbTourLaunch");
    if (!button) return;

    button.innerHTML = `
      <span class="mb-mini">${avatarSVG(state.avatar)}</span>
      <span>${escapeHTML(lang().launch)}</span>
    `;
  }

  function startTour() {
    stopSpeech();

    state.active = true;
    state.step = 0;
    state.previousFocus = document.activeElement;

    const overlay = document.getElementById("mbTourOverlay") ||
      document.createElement("div");

    overlay.id = "mbTourOverlay";
    overlay.hidden = false;
    document.body.appendChild(overlay);

    const panel = createPanel();
    panel.hidden = false;

    createWalker();
    refreshPanel();
    refreshLauncher();

    set(STORAGE.completed, "no");

    // Start narration after the browser has processed the click.
    window.setTimeout(() => {
      if (state.active) speak(lang().steps[state.step].speech);
    }, 100);
  }

  function closeTour() {
    state.active = false;
    stopSpeech();
    clearTimeout(state.moveTimer);
    clearTimeout(state.resizeTimer);
    removeHighlight();

    const panel = document.getElementById("mbTourPanel");
    const overlay = document.getElementById("mbTourOverlay");
    const walker = document.getElementById("mbTourWalker");

    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;
    if (walker) walker.remove();

    if (state.previousFocus && typeof state.previousFocus.focus === "function") {
      try { state.previousFocus.focus(); } catch (_) {}
    }
  }

  function finishTour() {
    set(STORAGE.completed, "yes");
    closeTour();
  }

  function nextStep() {
    stopSpeech();

    if (state.step >= lang().steps.length - 1) {
      finishTour();
      return;
    }

    state.step++;
    updateStep();
  }

  function previousStep() {
    if (state.step <= 0) return;

    stopSpeech();
    state.step--;
    updateStep();
  }

  function selectAvatar(id) {
    if (!farmers[id]) return;

    // Stop old voice before changing character or voice settings.
    stopSpeech();

    state.avatar = id;
    state.selectedVoiceURI = "";
    set(STORAGE.avatar, id);

    refreshLauncher();

    const panel = document.getElementById("mbTourPanel");
    if (panel) {
      panel.querySelector(".mb-portrait").innerHTML = avatarSVG(id);

      panel.querySelectorAll(".mb-avatar").forEach(button => {
        const selected = button.dataset.avatar === id;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    const walker = document.getElementById("mbTourWalker");
    if (walker) walker.innerHTML = avatarSVG(id);

    // Immediately speak the current step in the newly selected guide's voice.
    if (state.active && state.voiceOn) {
      speak(lang().steps[state.step].speech);
    }
  }

  function selectLanguage(language) {
    if (!copy[language]) return;

    stopSpeech();

    state.language = language;
    state.selectedVoiceURI = "";
    set(STORAGE.language, language);

    if (state.active) {
      refreshPanel();
    }

    refreshLauncher();
  }

  function selectVoiceMode(mode) {
    stopSpeech();

    state.voiceOn = mode === "on";
    set(STORAGE.voice, state.voiceOn ? "on" : "off");

    const statusText = document.querySelector("#mbTourPanel .mb-status-text");

    if (state.voiceOn && state.active) {
      speak(lang().steps[state.step].speech);
    } else if (statusText) {
      statusText.textContent = lang().ready;
    }
  }

  function handlePanelClick(event) {
    const avatarButton = event.target.closest("[data-avatar]");
    if (avatarButton) {
      selectAvatar(avatarButton.dataset.avatar);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    switch (actionButton.dataset.action) {
      case "next": nextStep(); break;
      case "back": previousStep(); break;
      case "skip": closeTour(); break;
      case "close": closeTour(); break;
    }
  }

  function handlePanelChange(event) {
    if (event.target.id === "mbTourLanguage") {
      selectLanguage(event.target.value);
    } else if (event.target.id === "mbTourVoice") {
      selectVoiceMode(event.target.value);
    }
  }

  function onResize() {
    if (!state.active) return;

    clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      if (state.active) moveWalker(state.currentTarget);
    }, 120);
  }

  function init() {
    styles();
    createLauncher();
    createPanel();

    // Speech voices may load asynchronously in some browsers.
    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    window.addEventListener("resize", onResize, { passive: true });

    // Deliberately no auto-start, page-wide MutationObserver,
    // or permanent animation interval: keep marketplace loading light.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
