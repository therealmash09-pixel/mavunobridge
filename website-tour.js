
/* ============================================================
   MAVUNOBRIDGE — WEBSITE TOUR V6
   Complete standalone replacement
   Features:
   - Four selectable 2D farmer avatars
   - Two female and two male farmer characters
   - Different browser voices where available
   - Animated mouth, blinking, waving, nodding and celebration
   - English, Sheng-English and Kiswahili
   - Optional speech and remembered preferences
   - Skippable, restartable, remembered website tour
   - Responsive spotlight and Guide collision avoidance
   - Smart Assist farmer avatar
   - No backend or external libraries required
   ============================================================ */

(function () {
  "use strict";

  if (window.__MAVUNOBRIDGE_TOUR_V6__) return;
  window.__MAVUNOBRIDGE_TOUR_V6__ = true;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const STORAGE = {
    avatar: "mavunobridge_selected_farmer_avatar_v1",
    language: "mavunobridge_language_v2",
    languageOld: "mavunobridge_language_v1",
    voice: "mavunobridge_tour_voice_v1",
    completed: "mavunobridge_tour_completed_v6",
    progress: "mavunobridge_tour_progress_v6"
  };

  const PAGE = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const LANGUAGES = ["en", "mix", "sw"];

  let tourLayer = null;
  let tourCard = null;
  let tourLauncher = null;
  let avatarLauncher = null;
  let currentFarmer = null;
  let currentSteps = [];
  let currentStep = 0;
  let isTourOpen = false;
  let speechEnabled = false;
  let speechActive = false;
  let animationTimer = null;
  let emotionTimer = null;
  let resizeTimer = null;
  let observer = null;
  let lastSpokenStep = -1;
  let lastLayout = "";
  let currentTarget = null;
  let speechToken = 0;

  const reducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function readStorage(key, fallback = "") {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (_) {
      // The tour still works if browser storage is unavailable.
    }
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function getLanguage() {
    const select = $("#languageSelect");
    const chosen = select ? select.value : "";

    if (LANGUAGES.includes(chosen)) return chosen;

    const saved = readStorage(
      STORAGE.language,
      readStorage(STORAGE.languageOld, "mix")
    );

    return LANGUAGES.includes(saved) ? saved : "mix";
  }

  function tr(values) {
    return values[getLanguage()] || values.mix || values.en || "";
  }

  /* ============================================================
     FARMER CHARACTERS
     ============================================================ */

  const FARMERS = [
    {
      id: "mamaAkinyi",
      gender: "female",
      hair: "#25170F",
      skin: "#8E5037",
      shirt: "#527F42",
      hat: "#54783B",
      names: {
        en: "Akinyi",
        mix: "Mama Akinyi",
        sw: "Mama Akinyi"
      },
      voiceGender: "female",
      voiceHint: ["female", "woman"],
      personality: "warm"
    },
    {
      id: "wambui",
      gender: "female",
      hair: "#211711",
      skin: "#663B2B",
      shirt: "#9A653C",
      hat: "#C98C43",
      names: {
        en: "Wambui",
        mix: "Mama Wambui",
        sw: "Mama Wambui"
      },
      voiceGender: "female",
      voiceHint: ["female", "woman"],
      personality: "cheerful"
    },
    {
      id: "kamau",
      gender: "male",
      hair: "#201711",
      skin: "#9A5D40",
      shirt: "#477B47",
      hat: "#466E35",
      names: {
        en: "Kamau",
        mix: "Farmer Kamau",
        sw: "Mkulima Kamau"
      },
      voiceGender: "male",
      voiceHint: ["male", "man"],
      personality: "confident"
    },
    {
      id: "otieno",
      gender: "male",
      hair: "#17110E",
      skin: "#573323",
      shirt: "#416C80",
      hat: "#B78B4A",
      names: {
        en: "Otieno",
        mix: "Farmer Otieno",
        sw: "Mkulima Otieno"
      },
      voiceGender: "male",
      voiceHint: ["male", "man"],
      personality: "calm"
    }
  ];

  function getSelectedFarmer() {
    const saved = readStorage(STORAGE.avatar, "mamaAkinyi");

    return FARMERS.find(farmer => farmer.id === saved) || FARMERS[0];
  }

  function farmerSVG(farmer = getSelectedFarmer(), extraClass = "") {
    const female = farmer.gender === "female";
    const akinyi = farmer.id === "mamaAkinyi";
    const wambui = farmer.id === "wambui";

    const hair = female
      ? akinyi
        ? `
          <path d="M32 49 Q26 20 48 19 Q73 12 87 34
            L88 62 L78 75 L42 73 L32 60Z"
            fill="#211711"/>
          <path d="M38 40 Q30 58 37 82"
            stroke="#38251B" stroke-width="7"
            stroke-linecap="round" fill="none"/>
          <path d="M82 39 Q91 57 83 80"
            stroke="#38251B" stroke-width="7"
            stroke-linecap="round" fill="none"/>
          <path d="M35 57 L40 62 M35 66 L40 71
            M84 56 L79 62 M85 66 L80 72"
            stroke="#BD8754" stroke-width="2" fill="none"/>
        `
        : `
          <path d="M31 49 Q27 23 47 19 Q72 12 88 35
            L87 65 L77 75 L40 72Z"
            fill="#211711"/>
          <path d="M36 36 Q60 18 84 37"
            stroke="#342219" stroke-width="5" fill="none"/>
        `
      : `
        <path d="M34 49 Q30 21 58 20 Q85 19 86 48
          L79 58 L40 58Z" fill="${farmer.hair}"/>
      `;

    const headwear = female
      ? akinyi
        ? `
          <path d="M29 37 Q34 9 60 10 Q87 10 91 37Z"
            fill="#54783B"/>
          <path d="M19 38 Q60 27 101 38
            Q94 47 60 47 Q26 47 19 38Z"
            fill="#71934D"/>
          <path d="M29 38 Q60 30 91 38"
            stroke="#E2C57B" stroke-width="3" fill="none"/>
          <path d="M45 16 Q60 11 75 16"
            stroke="#A6C47A" stroke-width="2" fill="none"/>
        `
        : `
          <path d="M29 42 Q24 18 48 15 Q72 9 91 31
            L87 46 Q61 31 34 48Z"
            fill="#C98C43"/>
          <path d="M28 34 Q60 19 91 34
            L86 43 Q60 31 33 44Z"
            fill="#E0B56B"/>
          <path d="M35 36 Q60 26 84 36"
            stroke="#F6DDA7" stroke-width="3" fill="none"/>
          <path d="M75 20 Q92 17 94 31 L84 37Z"
            fill="#B97739"/>
        `
      : `
        <path d="M29 38 Q34 10 60 10 Q86 10 91 38Z"
          fill="${farmer.hat}"/>
        <path d="M19 39 Q60 28 101 39
          Q94 48 60 48 Q26 48 19 39Z"
          fill="${farmer.hat}"/>
        <path d="M29 39 Q60 31 91 39"
          stroke="#D8BE79" stroke-width="3" fill="none"/>
      `;

    const beard = !female
      ? farmer.id === "otieno"
        ? `
          <path d="M39 67 Q42 87 60 90 Q78 87 81 67
            L76 78 L68 85 L60 88 L52 85 L44 78Z"
            fill="${farmer.hair}"/>
        `
        : `
          <path d="M42 72 Q45 83 60 85 Q75 83 78 72
            Q71 88 60 88 Q49 88 42 72Z"
            fill="${farmer.hair}"/>
        `
      : "";

    return `
      <svg class="mb-farmer-svg ${extraClass}"
        viewBox="0 0 120 150"
        role="img"
        aria-label="${escapeHTML(farmer.names[getLanguage()])}"
        xmlns="http://www.w3.org/2000/svg">

        <defs>
          <linearGradient id="mbShirt-${farmer.id}"
            x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${farmer.shirt}"/>
            <stop offset="100%" stop-color="#24452E"/>
          </linearGradient>
          <linearGradient id="mbFace-${farmer.id}"
            x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${farmer.skin}"/>
            <stop offset="100%" stop-color="#75442F"/>
          </linearGradient>
        </defs>

        <path d="M13 150 L19 119 Q23 94 43 89
          L77 89 Q97 94 101 119 L107 150Z"
          fill="url(#mbShirt-${farmer.id})"/>

        <path d="M26 112 L31 139 M94 112 L89 139"
          stroke="#DDE5D5" stroke-width="1.5" opacity=".45"/>

        <path d="M49 77 L49 96 L60 104 L71 96 L71 77Z"
          fill="${farmer.skin}"/>

        ${hair}

        <ellipse cx="60" cy="57" rx="27" ry="32"
          fill="url(#mbFace-${farmer.id})"/>

        <ellipse cx="33" cy="58" rx="5" ry="8"
          fill="${farmer.skin}"/>
        <ellipse cx="87" cy="58" rx="5" ry="8"
          fill="${farmer.skin}"/>

        ${female ? `
          <circle cx="32" cy="68" r="2.5" fill="#E8C36C"/>
          <circle cx="88" cy="68" r="2.5" fill="#E8C36C"/>
        ` : ""}

        ${headwear}

        <path d="M42 47 Q49 43 55 47"
          stroke="#281A14" stroke-width="2.5"
          stroke-linecap="round" fill="none"/>
        <path d="M65 47 Q72 43 78 47"
          stroke="#281A14" stroke-width="2.5"
          stroke-linecap="round" fill="none"/>

        <g class="mb-farmer-eyes">
          <ellipse cx="49" cy="54" rx="4" ry="4.5" fill="#FFF8E9"/>
          <ellipse cx="71" cy="54" rx="4" ry="4.5" fill="#FFF8E9"/>
          <circle cx="50" cy="54" r="2.5" fill="#211711"/>
          <circle cx="72" cy="54" r="2.5" fill="#211711"/>
          <circle cx="51" cy="53" r="1" fill="#FFF"/>
          <circle cx="73" cy="53" r="1" fill="#FFF"/>
        </g>

        <path d="M59 56 L56 65 Q60 68 64 65"
          stroke="#603727" stroke-width="1.8"
          stroke-linecap="round" fill="none"/>

        <ellipse cx="42" cy="66" rx="6" ry="3"
          fill="#E58C7A" opacity=".27"/>
        <ellipse cx="78" cy="66" rx="6" ry="3"
          fill="#E58C7A" opacity=".27"/>

        <path class="mb-mouth-smile"
          d="M48 73 Q60 82 72 73"
          stroke="#51251F" stroke-width="3"
          stroke-linecap="round" fill="none"/>

        <g class="mb-mouth">
          <ellipse cx="60" cy="75" rx="7" ry="3" fill="#451B1A"/>
          <path d="M54 73 Q60 71 66 73"
            stroke="#FFF2E3" stroke-width="1.5" fill="none"/>
          <ellipse cx="60" cy="78" rx="3.5" ry="1.3" fill="#D56B67"/>
        </g>

        ${beard}

        <g class="mb-farmer-wave">
          <path d="M88 113 Q103 94 101 77"
            stroke="${farmer.skin}" stroke-width="12"
            stroke-linecap="round" fill="none"/>
          <circle cx="101" cy="71" r="8" fill="${farmer.skin}"/>
          <path d="M96 66 L94 60 M101 64 L101 57 M106 66 L109 60"
            stroke="${farmer.skin}" stroke-width="3"
            stroke-linecap="round" fill="none"/>
        </g>

        <path d="M43 91 L60 105 L77 91" fill="#F2E8D4"/>
        <path d="M48 94 L60 105 L72 94" fill="${farmer.shirt}"/>
      </svg>
    `;
  }

  /* ============================================================
     VOICES
     Browser voices differ by device and installed language packs.
     Voice gender cannot be guaranteed by every browser.
     ============================================================ */

  function voicePreferences() {
    const language = getLanguage();

    if (language === "sw") {
      return {
        language: "sw-KE",
        fallbacks: ["sw-KE", "sw-TZ", "sw"]
      };
    }

    return {
      language: "en-KE",
      fallbacks: [
        "en-KE",
        "en-GB",
        "en-US",
        "en-AU",
        "en"
      ]
    };
  }

  function chooseVoice(farmer) {
    if (!("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const preferences = voicePreferences();

    const languageMatches = voices.filter(voice => {
      const lang = (voice.lang || "").toLowerCase();

      return preferences.fallbacks.some(prefix =>
        lang === prefix.toLowerCase() ||
        lang.startsWith(prefix.toLowerCase() + "-")
      );
    });

    const pool = languageMatches.length ? languageMatches : voices;

    const genderMatches = pool.filter(voice => {
      const text = (
        (voice.name || "") + " " + (voice.voiceURI || "")
      ).toLowerCase();

      return farmer.voiceHint.some(word => text.includes(word));
    });

    // Prefer a Kenyan or regional English voice when available.
    const regional = pool.filter(voice =>
      (voice.lang || "").toLowerCase().includes("ke")
    );

    if (genderMatches.length) return genderMatches[0];
    if (regional.length) return regional[0];

    return pool[0] || null;
  }

  function setTalking(talking) {
    speechActive = talking;

    $$(".mb-farmer-svg, .mb-smart-farmer-avatar svg").forEach(svg => {
      svg.classList.toggle("mb-is-talking", talking);
    });

    if (tourCard) {
      const status = $("#mbTourVoiceStatus");

      if (status) {
        status.textContent = talking
          ? tr({
              en: "Speaking…",
              mix: "Ninaongea…",
              sw: "Ninazungumza…"
            })
          : "";
      }
    }
  }

  function stopSpeech() {
    speechToken++;

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }

    setTalking(false);
  }

  function speakCurrentStep() {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    if (!currentSteps.length || !currentSteps[currentStep]) return;

    stopSpeech();

    const token = speechToken;
    const step = currentSteps[currentStep];

    const utterance = new SpeechSynthesisUtterance(
      `${step.title}. ${step.text}`
    );

    const voice = chooseVoice(getSelectedFarmer());

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = voicePreferences().language;
    }

    // Lower pitch for male characters, brighter pitch for female characters.
    // Browser voice gender itself depends on the voices installed on the device.
    const farmer = getSelectedFarmer();

    utterance.pitch = farmer.gender === "male" ? 0.82 : 1.13;
    utterance.rate = 0.94;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (token === speechToken) setTalking(true);
    };

    utterance.onend = () => {
      if (token === speechToken) setTalking(false);
    };

    utterance.onerror = () => {
      if (token === speechToken) setTalking(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      setTalking(false);
    }
  }

  function previewVoice(farmer) {
    stopSpeech();

    if (!("speechSynthesis" in window)) {
      announce(
        tr({
          en: "Voice preview is not supported in this browser.",
          mix: "Hii browser hai-support voice preview.",
          sw: "Kivinjari hiki hakiwezi kucheza sauti ya mfano."
        })
      );
      return;
    }

    const token = speechToken;

    const examples = {
      en: `Hello! My name is ${farmer.names.en}. Welcome to MavunoBridge.`,
      mix: `Sasa! Mimi ni ${farmer.names.mix}. Karibu MavunoBridge, let's grow together.`,
      sw: `Habari! Mimi ni ${farmer.names.sw}. Karibu MavunoBridge.`
    };

    const utterance = new SpeechSynthesisUtterance(
      examples[getLanguage()] || examples.mix
    );

    const voice = chooseVoice(farmer);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = voicePreferences().language;
    }

    utterance.pitch = farmer.gender === "male" ? 0.82 : 1.13;
    utterance.rate = 0.94;

    utterance.onstart = () => {
      if (token === speechToken) setTalking(true);
    };

    utterance.onend = () => {
      if (token === speechToken) setTalking(false);
    };

    utterance.onerror = () => {
      if (token === speechToken) setTalking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  /* ============================================================
     TOUR STEPS
     ============================================================ */

  function makeStep(selector, titles, texts, fallbackSelector) {
    return {
      selector,
      fallbackSelector: fallbackSelector || "main",
      title: tr(titles),
      text: tr(texts)
    };
  }

  function buildSteps() {
    const steps = [];

    const add = (selector, titles, texts, fallback) => {
      steps.push(makeStep(selector, titles, texts, fallback));
    };

    if (PAGE === "smart-assist.html") {
      add(".sa-hero", {
        en: "Meet Smart Assist",
        mix: "Meet Smart Assist",
        sw: "Kutana na Smart Assist"
      }, {
        en: "Your digital farming companion helps you explore farming advice and plan your next steps.",
        mix: "Huyu ni farming assistant wako. Anaku-help kuchunguza farming advice na kupanga next steps.",
        sw: "Huyu ni msaidizi wa kilimo anayekusaidia kuchunguza ushauri na kupanga hatua zako."
      });

      add("#farmPlanner", {
        en: "Plan your farm",
        mix: "Plan shamba yako",
        sw: "Panga shamba lako"
      }, {
        en: "Use the planner to explore crop choices and farming plans.",
        mix: "Tumia planner ku-explore crops na kupanga kazi za shamba.",
        sw: "Tumia mpangaji kuchunguza mazao na kupanga kazi za shamba."
      });

      add(".sa-symptom-field, #saSymptomChecks", {
        en: "Check crop symptoms",
        mix: "Check crop symptoms",
        sw: "Chunguza dalili za mimea"
      }, {
        en: "Choose the symptoms you have noticed to help organise your crop observations.",
        mix: "Chagua symptoms umeona kwa crops zako ili kupanga observations zako.",
        sw: "Chagua dalili ulizoona ili kupanga uchunguzi wa mazao yako."
      });

      add("#saPhoto", {
        en: "Add a crop photo",
        mix: "Add picha ya crop",
        sw: "Ongeza picha ya zao"
      }, {
        en: "If photo input is available, use it to provide more context about your crop.",
        mix: "Kama photo input iko available, tumia picha kutoa details zaidi kuhusu crop.",
        sw: "Ikiwa picha zinakubaliwa, tumia picha kutoa maelezo zaidi kuhusu zao."
      });

      add("#generateReportButton, #reportSection", {
        en: "Review your report",
        mix: "Review report yako",
        sw: "Kagua ripoti yako"
      }, {
        en: "Generate or review your farming report, and verify important advice before acting on it.",
        mix: "Generate ama review report yako. Confirm important advice kabla ya kuchukua action.",
        sw: "Tengeneza au kagua ripoti yako na uthibitishe ushauri muhimu kabla ya kuchukua hatua."
      });

      add("#saQuestionForm", {
        en: "Ask a farming question",
        mix: "Uliza swali ya farming",
        sw: "Uliza swali kuhusu kilimo"
      }, {
        en: "Use the question form to explore the farming topics supported by this demo.",
        mix: "Tumia form kuuliza kuhusu farming topics zinazoungwa mkono na demo hii.",
        sw: "Tumia fomu kuuliza kuhusu mada za kilimo zinazopatikana kwenye demo hii."
      });

      add(".sa-library-controls, #saCropLibraryGrid", {
        en: "Explore crop information",
        mix: "Explore crop info",
        sw: "Chunguza taarifa za mazao"
      }, {
        en: "Browse the crop library to learn about the crops featured in this demo.",
        mix: "Browse crop library ujifunze kuhusu crops zilizo kwa demo hii.",
        sw: "Vinjari maktaba ya mazao ili kujifunza kuhusu mazao yaliyo kwenye demo."
      });
    } else if (PAGE === "sacco.html") {
      add(".page-hero", {
        en: "Welcome to SACCO Hub",
        mix: "Karibu SACCO Hub",
        sw: "Karibu SACCO Hub"
      }, {
        en: "Explore farmer savings groups, cooperative opportunities and useful information.",
        mix: "Explore savings groups, SACCO opportunities na info useful kwa farmers.",
        sw: "Chunguza vikundi vya akiba, SACCO na fursa zinazofaa wakulima."
      });

      add(".sacco-controls", {
        en: "Find an opportunity",
        mix: "Tafuta opportunity",
        sw: "Tafuta fursa"
      }, {
        en: "Use the available search and filters to narrow down the opportunities shown.",
        mix: "Tumia search na filters kutafuta opportunities zinazokufaa.",
        sw: "Tumia utafutaji na vichujio kupata fursa zinazokufaa."
      });

      add("#saccoGrid", {
        en: "Explore SACCO cards",
        mix: "Explore SACCO cards",
        sw: "Chunguza kadi za SACCO"
      }, {
        en: "Read each card carefully and check the requirements before joining a real organisation.",
        mix: "Soma kila card vizuri na ucheck requirements kabla ya kujiunga na organisation halisi.",
        sw: "Soma kila kadi vizuri na uhakikishe masharti kabla ya kujiunga na shirika halisi."
      });

      add(".interest-panel", {
        en: "Show your interest",
        mix: "Onyesha interest yako",
        sw: "Onyesha nia yako"
      }, {
        en: "Use the available interest form to explore the demo's participation flow.",
        mix: "Tumia form kujaribu jinsi ya kuonyesha interest kwenye demo.",
        sw: "Tumia fomu kujaribu jinsi ya kuonyesha nia kwenye demo."
      });
    } else if (PAGE === "buyer-requests.html") {
      add(".page-hero", {
        en: "Buyer requests",
        mix: "Buyer requests",
        sw: "Maombi ya wanunuzi"
      }, {
        en: "This page helps buyers communicate what agricultural products they are looking for.",
        mix: "Hapa buyers wanaweza kueleza agricultural products wanatafuta.",
        sw: "Hapa wanunuzi wanaweza kueleza bidhaa za kilimo wanazotafuta."
      });

      add("#demandForm", {
        en: "Create a request",
        mix: "Create request",
        sw: "Tengeneza ombi"
      }, {
        en: "Enter the requested product details in the form fields provided.",
        mix: "Jaza product details kwa fields zilizopo.",
        sw: "Jaza maelezo ya bidhaa kwenye sehemu zilizopo."
      });

      add("#demandList", {
        en: "Browse buyer requests",
        mix: "Browse buyer requests",
        sw: "Chunguza maombi ya wanunuzi"
      }, {
        en: "Review the requests displayed and check the quantity, location and other details.",
        mix: "Review requests na ucheck quantity, location na details zingine.",
        sw: "Kagua maombi na uhakikishe kiasi, eneo na maelezo mengine."
      });

      add("#supportForm", {
        en: "Get support",
        mix: "Pata support",
        sw: "Pata msaada"
      }, {
        en: "Use the support area for the help options provided by the demo.",
        mix: "Tumia support area kwa options za msaada zilizo kwa demo.",
        sw: "Tumia sehemu ya msaada kwa chaguo zinazopatikana kwenye demo."
      });
    } else if (PAGE === "messages.html") {
      add(".messages-notice", {
        en: "Your messages",
        mix: "Messages zako",
        sw: "Ujumbe wako"
      }, {
        en: "This page demonstrates the marketplace messaging interface.",
        mix: "Hii page inaonyesha vile messaging interface ya marketplace inafanya kazi.",
        sw: "Ukurasa huu unaonyesha jinsi sehemu ya ujumbe inavyofanya kazi."
      });

      add(".conversation-sidebar, #conversationList", {
        en: "Choose a conversation",
        mix: "Chagua conversation",
        sw: "Chagua mazungumzo"
      }, {
        en: "Select a conversation to inspect the available conversation view.",
        mix: "Chagua conversation kuona mazungumzo yaliyopo.",
        sw: "Chagua mazungumzo ili kuyaangalia."
      });

      add(".conversation-panel", {
        en: "Read the conversation",
        mix: "Soma conversation",
        sw: "Soma mazungumzo"
      }, {
        en: "Review the conversation area and any details shown in the demo.",
        mix: "Angalia conversation area na details zinazoonyeshwa kwa demo.",
        sw: "Kagua sehemu ya mazungumzo na maelezo yanayoonyeshwa."
      });

      add("#messageForm", {
        en: "Write a message",
        mix: "Andika message",
        sw: "Andika ujumbe"
      }, {
        en: "Use the message form if messaging is enabled in this demo.",
        mix: "Tumia message form kama messaging imewezeshwa kwa demo hii.",
        sw: "Tumia fomu ya ujumbe ikiwa kipengele hiki kimewezeshwa."
      });
    } else if (PAGE === "login.html") {
      add(".auth-visual", {
        en: "Welcome to MavunoBridge",
        mix: "Karibu MavunoBridge",
        sw: "Karibu MavunoBridge"
      }, {
        en: "MavunoBridge connects the farming community with marketplace tools.",
        mix: "MavunoBridge ina-connect farming community na marketplace tools.",
        sw: "MavunoBridge inaunganisha wakulima na zana za soko."
      });

      add("#demoLoginForm", {
        en: "Try the demo sign-in",
        mix: "Jaribu demo sign-in",
        sw: "Jaribu kuingia kwenye demo"
      }, {
        en: "Follow the form instructions to try the demo sign-in experience.",
        mix: "Fuata instructions za form kujaribu demo sign-in.",
        sw: "Fuata maagizo ya fomu kujaribu kuingia kwenye demo."
      });

      add("#googleDemoButton", {
        en: "Demo sign-in option",
        mix: "Demo sign-in option",
        sw: "Chaguo la kuingia kwenye demo"
      }, {
        en: "This button may demonstrate a sign-in option; it does not guarantee a real Google login.",
        mix: "Button hii inaweza kuonyesha sign-in option; haimaanishi Google login halisi imeunganishwa.",
        sw: "Kitufe hiki kinaweza kuonyesha chaguo la kuingia; hakihakikishi kuingia halisi kwa Google."
      });
    } else {
      add(".topbar", {
        en: "Welcome to MavunoBridge",
        mix: "Karibu MavunoBridge",
        sw: "Karibu MavunoBridge"
      }, {
        en: "MavunoBridge brings farmers and buyers together in one agricultural marketplace.",
        mix: "MavunoBridge inaunganisha farmers na buyers kwa agricultural marketplace moja.",
        sw: "MavunoBridge inaunganisha wakulima na wanunuzi kwenye soko moja la kilimo."
      }, "main");

      add("#categoryGrid .category-card, #categories", {
        en: "Explore product categories",
        mix: "Explore product categories",
        sw: "Chunguza makundi ya bidhaa"
      }, {
        en: "Browse categories to discover the agricultural products available in the marketplace.",
        mix: "Browse categories kuona agricultural products zilizopo sokoni.",
        sw: "Vinjari makundi ili kuona bidhaa za kilimo zinazopatikana sokoni."
      }, "main");

      add(".filters", {
        en: "Filter your search",
        mix: "Filter search yako",
        sw: "Chuja utafutaji wako"
      }, {
        en: "Use the available filters to narrow products by the options provided on this page.",
        mix: "Tumia filters kupunguza products kulingana na options zilizopo.",
        sw: "Tumia vichujio kuchagua bidhaa kulingana na chaguo zilizopo."
      }, "#listingGrid");

      add("#listingGrid .product-card, #listingGrid", {
        en: "Explore marketplace listings",
        mix: "Explore marketplace listings",
        sw: "Chunguza bidhaa sokoni"
      }, {
        en: "Open a listing to review its product details, location, price and seller information.",
        mix: "Fungua listing ucheck product details, location, price na seller info.",
        sw: "Fungua tangazo kuangalia bidhaa, eneo, bei na maelezo ya muuzaji."
      }, "main");

      add("#sellButton, #heroSellButton", {
        en: "List your farm produce",
        mix: "List farm produce yako",
        sw: "Weka mazao yako sokoni"
      }, {
        en: "Farmers can use the listing flow to showcase their agricultural products.",
        mix: "Farmers wanaweza kutumia listing flow kuonyesha agricultural products zao.",
        sw: "Wakulima wanaweza kutumia fomu ya tangazo kuonyesha bidhaa zao."
      }, "main");

      add("#cartButton", {
        en: "Check your cart",
        mix: "Check cart yako",
        sw: "Angalia kikapu chako"
      }, {
        en: "Use the cart to review items you have added, if cart features are enabled.",
        mix: "Tumia cart ku-review items umeongeza, kama cart imewezeshwa.",
        sw: "Tumia kikapu kukagua bidhaa ulizoongeza ikiwa kipengele kinapatikana."
      }, "main");

      add('a[href*="smart-assist.html"]', {
        en: "Visit Smart Assist",
        mix: "Visit Smart Assist",
        sw: "Tembelea Smart Assist"
      }, {
        en: "Open Smart Assist to explore the farming support tools available in the demo.",
        mix: "Fungua Smart Assist ku-explore farming support tools za demo.",
        sw: "Fungua Smart Assist kuchunguza zana za msaada wa kilimo."
      }, "main");

      add('a[href*="sacco.html"]', {
        en: "Explore SACCO Hub",
        mix: "Explore SACCO Hub",
        sw: "Chunguza SACCO Hub"
      }, {
        en: "Explore savings groups and opportunities presented on the SACCO page.",
        mix: "Explore savings groups na opportunities kwa SACCO page.",
        sw: "Chunguza vikundi vya akiba na fursa kwenye ukurasa wa SACCO."
      }, "main");

      add(".demo-note", {
        en: "Remember: this is a demo",
        mix: "Remember: hii ni demo",
        sw: "Kumbuka: hii ni demo"
      }, {
        en: "Some actions may be demonstrations using browser storage rather than a live marketplace backend.",
        mix: "Baadhi ya actions ni demo zinazotumia browser storage badala ya live backend.",
        sw: "Baadhi ya vitendo ni vya majaribio na vinaweza kutumia hifadhi ya kivinjari badala ya mfumo wa moja kwa moja."
      }, "main");
    }

    // Keep only steps with a real target on this page.
    return steps.filter(step =>
      $(step.selector) || $(step.fallbackSelector || "main")
    );
  }

  /* ============================================================
     STYLES
     ============================================================ */

  function injectStyles() {
    if ($("#mbTourV6Styles")) return;

    const style = document.createElement("style");
    style.id = "mbTourV6Styles";

    style.textContent = `
      .mb-tour-launcher,
      .mb-avatar-launcher {
        position: fixed;
        right: 16px;
        z-index: 99980;
        border: 1px solid rgba(36,75,45,.18);
        border-radius: 999px;
        background: #fff;
        color: #21472d;
        box-shadow: 0 5px 20px rgba(0,0,0,.15);
        padding: 11px 15px;
        font: 600 13px/1.25 system-ui, sans-serif;
        cursor: pointer;
        max-width: calc(100vw - 24px);
      }

      .mb-tour-launcher { bottom: 16px; }
      .mb-avatar-launcher { bottom: 66px; }

      .mb-tour-launcher:hover,
      .mb-avatar-launcher:hover {
        background: #f0f5eb;
      }

      .mb-tour-layer {
        position: fixed;
        inset: 0;
        z-index: 99990;
        pointer-events: none;
        isolation: isolate;
      }

      .mb-tour-shade {
        position: fixed;
        background: rgba(12,24,15,.48);
        pointer-events: none;
      }

      .mb-tour-focus {
        position: fixed;
        z-index: 99991;
        pointer-events: none;
        border: 3px solid #9bc96d;
        border-radius: 14px;
        box-shadow: 0 0 0 4px rgba(155,201,109,.20);
        transition: top .2s ease, left .2s ease,
          width .2s ease, height .2s ease;
      }

      .mb-tour-card {
        position: fixed;
        z-index: 99995;
        box-sizing: border-box;
        width: min(570px, calc(100vw - 24px));
        max-width: calc(100vw - 20px);
        max-height: calc(100dvh - 20px);
        overflow-x: hidden;
        overflow-y: auto;
        overflow-wrap: anywhere;
        overscroll-behavior: contain;
        border: 1px solid rgba(255,255,255,.8);
        border-radius: 20px;
        background: rgba(255,255,255,.94);
        color: #22352a;
        box-shadow: 0 16px 50px rgba(0,0,0,.22);
        padding: 17px;
        pointer-events: auto;
        font-family: system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        scrollbar-width: thin;
      }

      .mb-tour-card *,
      .mb-avatar-modal * {
        box-sizing: border-box;
      }

      .mb-tour-topline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }

      .mb-tour-brand {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .08em;
        color: #477044;
        text-transform: uppercase;
      }

      .mb-tour-close {
        min-width: 36px;
        min-height: 36px;
        border: 0;
        border-radius: 50%;
        background: #edf2e8;
        color: #24452e;
        font-size: 20px;
        cursor: pointer;
      }

      .mb-tour-guide-row {
        display: grid;
        grid-template-columns: 100px minmax(0, 1fr);
        gap: 15px;
        align-items: center;
        min-width: 0;
      }

      .mb-tour-farmer {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 124px;
        overflow: hidden;
        border-radius: 16px;
        background: linear-gradient(145deg,#f1f5e8,#dcead5);
      }

      .mb-farmer-svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
        transform-origin: 50% 100%;
        animation: mbFarmerFloat 3.4s ease-in-out infinite;
      }

      .mb-mouth {
        transform-box: fill-box;
        transform-origin: center;
        transform: scaleY(.2);
        opacity: 0;
      }

      .mb-mouth-smile { opacity: 1; }

      .mb-is-talking .mb-mouth {
        opacity: 1;
        animation: mbMouthTalk .19s ease-in-out infinite alternate;
      }

      .mb-is-talking .mb-mouth-smile { opacity: 0; }

      .mb-farmer-eyes {
        transform-box: fill-box;
        transform-origin: center;
        animation: mbFarmerBlink 5.1s infinite;
      }

      .mb-farmer-wave {
        transform-box: view-box;
        transform-origin: 94px 110px;
        animation: mbFarmerWave 3.8s ease-in-out infinite;
      }

      .mb-tour-card.mb-celebrate .mb-farmer-svg {
        animation: mbFarmerCelebrate .65s ease-in-out 2;
      }

      .mb-tour-card.mb-nod .mb-farmer-svg {
        animation: mbFarmerNod .6s ease-in-out 2;
      }

      .mb-tour-copy { min-width: 0; }

      .mb-tour-name {
        margin: 0 0 5px;
        color: #527746;
        font-size: 12px;
        font-weight: 750;
      }

      .mb-tour-title {
        margin: 0 0 8px;
        font-size: clamp(18px, 2.7vw, 23px);
        line-height: 1.2;
        overflow-wrap: anywhere;
      }

      .mb-tour-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
        overflow-wrap: anywhere;
      }

      .mb-tour-progress {
        height: 5px;
        border-radius: 20px;
        overflow: hidden;
        background: #e6ecdf;
        margin: 15px 0 8px;
      }

      .mb-tour-progress > span {
        display: block;
        height: 100%;
        background: #5f8c46;
        transition: width .2s ease;
      }

      .mb-tour-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        color: #68756a;
        font-size: 11px;
      }

      .mb-tour-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      .mb-tour-actions-left,
      .mb-tour-actions-right {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
        min-width: 0;
      }

      .mb-tour-btn {
        border: 1px solid #d8e2d1;
        border-radius: 10px;
        background: #f4f7f1;
        color: #294b31;
        min-height: 39px;
        padding: 9px 12px;
        font: 650 12px/1.2 system-ui, sans-serif;
        cursor: pointer;
      }

      .mb-tour-btn-primary {
        border-color: #477b3f;
        background: #477b3f;
        color: white;
      }

      .mb-tour-btn:focus-visible,
      .mb-tour-close:focus-visible,
      .mb-avatar-option:focus-visible {
        outline: 3px solid #e2b951;
        outline-offset: 3px;
      }

      .mb-tour-voice-status {
        min-height: 16px;
        margin-top: 7px;
        font-size: 11px;
        color: #527746;
      }

      .mb-smart-farmer-avatar {
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .mb-smart-farmer-avatar svg {
        width: 100%;
        height: 100%;
      }

      .mb-avatar-modal {
        position: fixed;
        inset: 0;
        z-index: 100010;
        display: grid;
        place-items: center;
        padding: 12px;
        background: rgba(15,29,18,.58);
        overflow-y: auto;
      }

      .mb-avatar-dialog {
        width: min(520px, 100%);
        max-height: calc(100dvh - 24px);
        overflow: auto;
        border-radius: 20px;
        padding: 18px;
        background: #fff;
        color: #22352a;
        box-shadow: 0 16px 50px rgba(0,0,0,.25);
      }

      .mb-avatar-dialog h2 {
        margin: 0 0 6px;
        font-size: 21px;
      }

      .mb-avatar-description {
        margin: 0 0 15px;
        font-size: 13px;
        line-height: 1.5;
        color: #617064;
      }

      .mb-avatar-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 10px;
      }

      .mb-avatar-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        min-width: 0;
        border: 2px solid #e0e8dc;
        border-radius: 14px;
        background: #f7f9f4;
        padding: 10px;
        color: #263d2a;
        cursor: pointer;
        text-align: center;
      }

      .mb-avatar-option[aria-pressed="true"] {
        border-color: #598646;
        background: #edf5e7;
        box-shadow: inset 0 0 0 1px #598646;
      }

      .mb-avatar-preview {
        width: 88px;
        height: 96px;
        overflow: hidden;
        border-radius: 14px;
        background: linear-gradient(145deg,#f1f5e8,#dcead5);
      }

      .mb-avatar-preview svg {
        width: 100%;
        height: 100%;
      }

      .mb-avatar-option strong { font-size: 13px; }

      .mb-avatar-option small {
        font-size: 11px;
        line-height: 1.4;
        color: #657366;
      }

      .mb-avatar-dialog-actions {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      @keyframes mbFarmerFloat {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      @keyframes mbFarmerWave {
        0%,70%,100% { transform: rotate(0); }
        76% { transform: rotate(-13deg); }
        82% { transform: rotate(10deg); }
        88% { transform: rotate(-10deg); }
        94% { transform: rotate(6deg); }
      }

      @keyframes mbFarmerBlink {
        0%,44%,48%,100% { transform: scaleY(1); }
        46% { transform: scaleY(.08); }
      }

      @keyframes mbMouthTalk {
        from { transform: scaleY(.25); }
        to { transform: scaleY(1.35); }
      }

      @keyframes mbFarmerCelebrate {
        0%,100% { transform: translateY(0) rotate(0); }
        25% { transform: translateY(-7px) rotate(-4deg); }
        75% { transform: translateY(-5px) rotate(4deg); }
      }

      @keyframes mbFarmerNod {
        0%,100% { transform: rotate(0); }
        35% { transform: rotate(5deg); }
        70% { transform: rotate(-4deg); }
      }

      @media (max-width: 650px) {
        .mb-tour-launcher,
        .mb-avatar-launcher {
          right: 10px;
          max-width: calc(100vw - 20px);
          font-size: 12px;
          padding: 10px 12px;
        }

        .mb-tour-launcher { bottom: 10px; }
        .mb-avatar-launcher { bottom: 56px; }

        .mb-tour-card {
          width: calc(100vw - 20px);
          max-width: calc(100vw - 20px);
          max-height: calc(100dvh - 20px);
          padding: 12px;
          border-radius: 16px;
        }

        .mb-tour-guide-row {
          grid-template-columns: 64px minmax(0,1fr);
          gap: 10px;
        }

        .mb-tour-farmer {
          width: 64px;
          height: 80px;
          border-radius: 12px;
        }

        .mb-tour-title { font-size: 19px; }
        .mb-tour-text { font-size: 13px; line-height: 1.48; }

        .mb-tour-actions { align-items: stretch; }
        .mb-tour-actions-left,
        .mb-tour-actions-right { flex: 1 1 100%; }

        .mb-tour-actions-right { justify-content: flex-end; }

        .mb-tour-btn {
          min-height: 38px;
          padding: 9px 10px;
        }
      }

      @media (max-width: 370px) {
        .mb-tour-guide-row {
          grid-template-columns: 48px minmax(0,1fr);
          gap: 8px;
        }

        .mb-tour-farmer {
          width: 48px;
          height: 62px;
        }

        .mb-tour-title { font-size: 17px; }
        .mb-tour-text { font-size: 12px; }

        .mb-tour-btn {
          padding: 8px;
          font-size: 11px;
        }

        .mb-avatar-preview {
          width: 70px;
          height: 80px;
        }
      }

      @media (max-height: 560px) {
        .mb-tour-card {
          max-height: calc(100dvh - 12px);
          padding: 10px;
        }

        .mb-tour-topline { margin-bottom: 7px; }
        .mb-tour-guide-row { gap: 9px; }
        .mb-tour-farmer { height: 65px; }
        .mb-tour-progress { margin: 9px 0 6px; }
        .mb-tour-actions { margin-top: 8px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .mb-farmer-svg,
        .mb-farmer-eyes,
        .mb-farmer-wave,
        .mb-mouth,
        .mb-tour-focus {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     UI BUILDING BLOCKS
     ============================================================ */

  function announce(message) {
    let region = $("#mbTourLiveRegion");

    if (!region) {
      region = document.createElement("div");
      region.id = "mbTourLiveRegion";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      Object.assign(region.style, {
        position: "fixed",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: "0"
      });

      document.body.appendChild(region);
    }

    region.textContent = message;
  }

  function createLayer() {
    if (tourLayer) return;

    tourLayer = document.createElement("div");
    tourLayer.className = "mb-tour-layer";
    tourLayer.id = "mbTourLayer";
    tourLayer.hidden = true;

    for (let index = 0; index < 4; index++) {
      const shade = document.createElement("div");
      shade.className = "mb-tour-shade";
      shade.dataset.shade = String(index);
      tourLayer.appendChild(shade);
    }

    const focus = document.createElement("div");
    focus.className = "mb-tour-focus";
    focus.id = "mbTourFocus";
    focus.hidden = true;
    tourLayer.appendChild(focus);

    tourCard = document.createElement("section");
    tourCard.className = "mb-tour-card";
    tourCard.id = "mbTourCard";
    tourCard.setAttribute("role", "dialog");
    tourCard.setAttribute("aria-modal", "false");
    tourCard.setAttribute("aria-label", "MavunoBridge website tour");

    tourLayer.appendChild(tourCard);
    document.body.appendChild(tourLayer);
  }

  function createLaunchers() {
    if (!tourLauncher) {
      tourLauncher = document.createElement("button");
      tourLauncher.className = "mb-tour-launcher";
      tourLauncher.id = "mbTourLauncher";
      tourLauncher.type = "button";
      tourLauncher.textContent = tr({
        en: "🧭 Website Tour",
        mix: "🧭 Website Tour",
        sw: "🧭 Ziara ya Tovuti"
      });

      tourLauncher.addEventListener("click", () => {
        startTour(true);
      });

      document.body.appendChild(tourLauncher);
    }

    if (!avatarLauncher) {
      avatarLauncher = document.createElement("button");
      avatarLauncher.className = "mb-avatar-launcher";
      avatarLauncher.id = "mbAvatarLauncher";
      avatarLauncher.type = "button";
      avatarLauncher.textContent = tr({
        en: "👩🏾‍🌾 Choose Farmer",
        mix: "👩🏾‍🌾 Choose Farmer",
        sw: "👩🏾‍🌾 Chagua Mkulima"
      });

      avatarLauncher.addEventListener("click", openAvatarPicker);
      document.body.appendChild(avatarLauncher);
    }
  }

  function getGuideRects() {
    const selectors = [
      ".mb-guide-panel",
      "#mbGuidePanel",
      "#guidePanel",
      ".guide-panel",
      ".guide-widget",
      "#guideWidget",
      ".floating-guide",
      ".mb-guide-toggle",
      "#guideButton",
      ".mb-guide-button",
      ".guide-button",
      ".floating-assistant",
      ".chat-widget",
      ".chatbot-container"
    ];

    const elements = selectors.flatMap(selector => $$(selector));

    return elements
      .filter((element, index) =>
        elements.indexOf(element) === index &&
        element !== tourCard &&
        !tourCard.contains(element) &&
        !element.closest("#mbTourLayer") &&
        !element.hidden &&
        element.getClientRects().length > 0
      )
      .map(element => ({
        element,
        rect: element.getBoundingClientRect()
      }))
      .filter(item =>
        item.rect.width > 0 &&
        item.rect.height > 0 &&
        getComputedStyle(item.element).visibility !== "hidden" &&
        getComputedStyle(item.element).display !== "none"
      );
  }

  function updateSpotlight(target) {
    if (!tourLayer || !tourCard) return;

    const shades = $$("[data-shade]", tourLayer);
    const focus = $("#mbTourFocus", tourLayer);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!target || target === document.body || target === document.documentElement) {
      focus.hidden = true;

      shades.forEach(shade => {
        Object.assign(shade.style, {
          left: "0",
          top: "0",
          width: vw + "px",
          height: vh + "px"
        });
      });

      return;
    }

    const rect = target.getBoundingClientRect();

    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.top > vh ||
      rect.left > vw
    ) {
      focus.hidden = true;
      return;
    }

    const padding = 5;
    const left = Math.max(0, rect.left - padding);
    const top = Math.max(0, rect.top - padding);
    const right = Math.min(vw, rect.right + padding);
    const bottom = Math.min(vh, rect.bottom + padding);
    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);

    focus.hidden = false;

    Object.assign(focus.style, {
      left: left + "px",
      top: top + "px",
      width: width + "px",
      height: height + "px"
    });

    const rectangles = [
      { left: 0, top: 0, width: vw, height: top },
      { left: 0, top: bottom, width: vw, height: Math.max(0, vh - bottom) },
      { left: 0, top, width: left, height },
      { left: right, top, width: Math.max(0, vw - right), height }
    ];

    shades.forEach((shade, index) => {
      const item = rectangles[index];

      Object.assign(shade.style, {
        left: item.left + "px",
        top: item.top + "px",
        width: item.width + "px",
        height: item.height + "px"
      });
    });
  }

  function overlaps(a, b) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  function areaOfOverlap(a, b) {
    const width = Math.max(
      0,
      Math.min(a.right, b.right) - Math.max(a.left, b.left)
    );

    const height = Math.max(
      0,
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    );

    return width * height;
  }

  function positionTourCard(target) {
    if (!tourCard || !tourLayer || !isTourOpen) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 650;
    const margin = mobile ? 10 : 16;
    const gap = 12;

    const guideItems = getGuideRects();
    const guideRects = guideItems.map(item => item.rect);

    // Measure the real content after constraining it to the viewport.
    tourCard.style.width = `min(${mobile ? vw - 20 : 570}px, calc(100vw - ${margin * 2}px))`;
    tourCard.style.maxWidth = `calc(100vw - ${margin * 2}px)`;
    tourCard.style.maxHeight = `calc(100dvh - ${margin * 2}px)`;
    tourCard.style.left = margin + "px";
    tourCard.style.top = margin + "px";

    const width = Math.min(
      tourCard.getBoundingClientRect().width,
      vw - margin * 2
    );

    // Constrain long content; allow the card itself to scroll.
    const height = Math.min(
      tourCard.scrollHeight,
      vh - margin * 2
    );

    const rect = target && target.getClientRects().length
      ? target.getBoundingClientRect()
      : null;

    const targetLeft = rect ? rect.left : vw / 2;
    const targetRight = rect ? rect.right : vw / 2;
    const targetTop = rect ? rect.top : vh / 2;
    const targetBottom = rect ? rect.bottom : vh / 2;

    const candidates = [];

    function add(left, top, label) {
      left = Math.max(margin, Math.min(left, vw - width - margin));
      top = Math.max(margin, Math.min(top, vh - height - margin));

      const candidate = {
        left,
        top,
        right: left + width,
        bottom: top + height,
        label
      };

      if (!candidates.some(item =>
        Math.abs(item.left - candidate.left) < 2 &&
        Math.abs(item.top - candidate.top) < 2
      )) {
        candidates.push(candidate);
      }
    }

    // Prefer the side opposite the target when there is space.
    add((vw - width) / 2, targetBottom + gap, "below-target");
    add((vw - width) / 2, targetTop - height - gap, "above-target");

    if (!mobile) {
      add(targetRight + gap, (vh - height) / 2, "right-target");
      add(targetLeft - width - gap, (vh - height) / 2, "left-target");
    }

    // Try the corners and central top/bottom positions.
    add(margin, margin, "top-left");
    add(vw - width - margin, margin, "top-right");
    add(margin, vh - height - margin, "bottom-left");
    add(vw - width - margin, vh - height - margin, "bottom-right");
    add((vw - width) / 2, margin, "top-center");
    add((vw - width) / 2, vh - height - margin, "bottom-center");

    // Place the tour away from the Guide's bounding rectangle.
    guideRects.forEach(guide => {
      add(
        (vw - width) / 2,
        guide.top - height - gap,
        "above-guide"
      );

      add(
        (vw - width) / 2,
        guide.bottom + gap,
        "below-guide"
      );

      if (!mobile) {
        add(
          guide.left - width - gap,
          (vh - height) / 2,
          "left-of-guide"
        );

        add(
          guide.right + gap,
          (vh - height) / 2,
          "right-of-guide"
        );
      }
    });

    const launcherSelectors = [
      "#mbTourLauncher",
      "#mbAvatarLauncher"
    ];

    const launcherRects = launcherSelectors
      .map(selector => $(selector))
      .filter(element =>
        element &&
        element !== tourCard &&
        element.getClientRects().length > 0
      )
      .map(element => element.getBoundingClientRect());

    function score(candidate) {
      let penalty = 0;

      // Avoid the Guide much more strongly than the target.
      guideRects.forEach(guide => {
        penalty += areaOfOverlap(candidate, guide) * 10000;
      });

      // Avoid covering the target whenever possible.
      if (rect) {
        penalty += areaOfOverlap(candidate, rect) * 30;
      }

      // Keep clear of our floating buttons.
      launcherRects.forEach(button => {
        penalty += areaOfOverlap(candidate, button) * 80;
      });

      // Prefer positions that stay inside the visual viewport.
      penalty += Math.max(0, margin - candidate.left) * 1000;
      penalty += Math.max(0, margin - candidate.top) * 1000;
      penalty += Math.max(0, candidate.right - vw + margin) * 1000;
      penalty += Math.max(0, candidate.bottom - vh + margin) * 1000;

      // Small tie-breaker: keep the card near the target.
      if (rect) {
        const cardCenterX = (candidate.left + candidate.right) / 2;
        const cardCenterY = (candidate.top + candidate.bottom) / 2;
        const targetCenterX = (rect.left + rect.right) / 2;
        const targetCenterY = (rect.top + rect.bottom) / 2;

        penalty += (
          Math.abs(cardCenterX - targetCenterX) +
          Math.abs(cardCenterY - targetCenterY)
        ) * 0.015;
      }

      return penalty;
    }

    candidates.sort((a, b) => score(a) - score(b));

    let best = candidates[0];

    /*
     * If all positions collide with the Guide, shrink the card and
     * score again. On very small screens the card may need to scroll.
     */
    if (best && guideRects.some(guide => overlaps(best, guide))) {
      tourCard.style.width = `calc(100vw - ${margin * 2}px)`;
      tourCard.style.maxHeight = `calc(100dvh - ${margin * 2}px)`;
      tourCard.style.padding = mobile ? "9px" : "12px";

      const newRect = tourCard.getBoundingClientRect();
      const newWidth = Math.min(newRect.width, vw - margin * 2);
      const newHeight = Math.min(
        tourCard.scrollHeight,
        vh - margin * 2
      );

      candidates.length = 0;

      add((vw - newWidth) / 2, margin, "compact-top");
      add((vw - newWidth) / 2, vh - newHeight - margin, "compact-bottom");
      add(margin, (vh - newHeight) / 2, "compact-left");
      add(vw - newWidth - margin, (vh - newHeight) / 2, "compact-right");

      guideRects.forEach(guide => {
        add(
          (vw - newWidth) / 2,
          guide.top - newHeight - gap,
          "compact-above-guide"
        );

        add(
          (vw - newWidth) / 2,
          guide.bottom + gap,
          "compact-below-guide"
        );
      });

      candidates.sort((a, b) => score(a) - score(b));
      best = candidates[0];
    }

    if (best) {
      tourCard.style.left = Math.round(best.left) + "px";
      tourCard.style.top = Math.round(best.top) + "px";
    }

    updateSpotlight(target);
  }

  /* ============================================================
     AVATAR PICKER
     ============================================================ */

  function closeAvatarPicker() {
    const modal = $("#mbAvatarModal");
    if (modal) modal.remove();

    if (avatarLauncher) avatarLauncher.focus();
  }

  function openAvatarPicker() {
    closeAvatarPicker();

    const selected = getSelectedFarmer();
    const modal = document.createElement("div");

    modal.className = "mb-avatar-modal";
    modal.id = "mbAvatarModal";
    modal.setAttribute("role", "presentation");

    const title = tr({
      en: "Choose your farmer guide",
      mix: "Chagua farmer guide wako",
      sw: "Chagua mwongozo wako wa mkulima"
    });

    const description = tr({
      en: "Choose one of four animated farmers. Each character has a different appearance and a different voice style where your browser supports it.",
      mix: "Chagua mmoja kati ya farmers wanne. Kila mmoja ako na look tofauti na voice style tofauti pale browser yako inapo-support.",
      sw: "Chagua mmoja kati ya wakulima wanne. Kila mmoja ana mwonekano na mtindo wa sauti tofauti ikiwa kivinjari kinaunga mkono."
    });

    const preview = farmer => `
      <button type="button"
        class="mb-avatar-option"
        data-avatar="${farmer.id}"
        aria-pressed="${farmer.id === selected.id ? "true" : "false"}">
        <span class="mb-avatar-preview">
          ${farmerSVG(farmer)}
        </span>
        <strong>${escapeHTML(farmer.names[getLanguage()])}</strong>
        <small>${farmer.gender === "female"
          ? tr({ en: "Female farmer", mix: "Female farmer", sw: "Mkulima mwanamke" })
          : tr({ en: "Male farmer", mix: "Male farmer", sw: "Mkulima mwanamume" })
        }</small>
        <small>${tr({
          en: "Tap to choose",
          mix: "Tap kuchagua",
          sw: "Bonyeza kuchagua"
        })}</small>
      </button>
    `;

    modal.innerHTML = `
      <div class="mb-avatar-dialog" role="dialog"
        aria-modal="true" aria-labelledby="mbAvatarTitle">
        <h2 id="mbAvatarTitle">${escapeHTML(title)}</h2>
        <p class="mb-avatar-description">${escapeHTML(description)}</p>

        <div class="mb-avatar-grid">
          ${FARMERS.map(preview).join("")}
        </div>

        <div class="mb-avatar-dialog-actions">
          <button class="mb-tour-btn" type="button" id="mbAvatarPreviewVoice">
            ${escapeHTML(tr({
              en: "▶ Preview voice",
              mix: "▶ Sikiza voice",
              sw: "▶ Sikiliza sauti"
            }))}
          </button>

          <button class="mb-tour-btn mb-tour-btn-primary"
            type="button" id="mbAvatarDone">
            ${escapeHTML(tr({
              en: "Done",
              mix: "Done",
              sw: "Maliza"
            }))}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", event => {
      if (event.target === modal) closeAvatarPicker();

      const option = event.target.closest("[data-avatar]");

      if (option) {
        const farmer = FARMERS.find(
          item => item.id === option.dataset.avatar
        );

        if (!farmer) return;

        writeStorage(STORAGE.avatar, farmer.id);

        $$("[data-avatar]", modal).forEach(button => {
          button.setAttribute(
            "aria-pressed",
            button.dataset.avatar === farmer.id ? "true" : "false"
          );
        });

        refreshFarmerArtwork();

        if (isTourOpen) renderStep(false);
      }
    });

    $("#mbAvatarPreviewVoice", modal).addEventListener("click", () => {
      previewVoice(getSelectedFarmer());
    });

    $("#mbAvatarDone", modal).addEventListener("click", () => {
      closeAvatarPicker();
    });

    const firstOption = $("[data-avatar]", modal);
    if (firstOption) firstOption.focus();
  }

  /* ============================================================
     SMART ASSIST AND EXISTING GUIDE AVATARS
     ============================================================ */

  function refreshFarmerArtwork() {
    const farmer = getSelectedFarmer();

    // Update the current tour character.
    const tourArt = $("#mbTourFarmerArt");

    if (tourArt) {
      tourArt.innerHTML = farmerSVG(farmer);
      currentFarmer = farmer;
    }

    // Update Smart Assist avatar without replacing assistant text.
    $$(".sa-assistant-avatar").forEach(container => {
      container.classList.add("mb-smart-farmer-avatar");

      const svg = container.querySelector("svg");
      const existingImage = container.querySelector("img");

      if (
        !svg ||
        !svg.classList.contains("mb-farmer-svg") ||
        existingImage
      ) {
        container.innerHTML = farmerSVG(farmer);
      }
    });

    // Add an avatar to the existing Guide header if one is present.
    $$(".mb-guide-panel .mb-guide-head, #mbGuidePanel .mb-guide-head")
      .forEach(header => {
        if ($(".mb-guide-farmer", header)) {
          const art = $(".mb-guide-farmer", header);
          art.innerHTML = farmerSVG(farmer);
          return;
        }

        const art = document.createElement("span");
        art.className = "mb-guide-farmer";
        art.style.cssText = [
          "display:inline-flex",
          "width:42px",
          "height:48px",
          "overflow:hidden",
          "vertical-align:middle",
          "border-radius:10px",
          "background:#e7f0df",
          "flex-shrink:0"
        ].join(";");

        art.innerHTML = farmerSVG(farmer);
        header.prepend(art);
      });
  }

  /* ============================================================
     TOUR CARD RENDERING
     ============================================================ */

  function renderStep(shouldSpeak = true) {
    if (!isTourOpen || !currentSteps.length) return;

    currentStep = Math.max(
      0,
      Math.min(currentStep, currentSteps.length - 1)
    );

    const step = currentSteps[currentStep];
    const farmer = getSelectedFarmer();

    const stepTarget = $(step.selector) ||
      $(step.fallbackSelector || "main") ||
      $("main") ||
      document.body;

    currentTarget = stepTarget;
    currentFarmer = farmer;

    tourCard.classList.remove("mb-celebrate", "mb-nod");

    if (currentStep === currentSteps.length - 1) {
      tourCard.classList.add("mb-celebrate");
    } else if (currentStep > 0) {
      tourCard.classList.add("mb-nod");
    }

    const percent = Math.round(
      ((currentStep + 1) / currentSteps.length) * 100
    );

    tourCard.innerHTML = `
      <div class="mb-tour-topline">
        <span class="mb-tour-brand">MavunoBridge · ${escapeHTML(
          tr({
            en: "Website Tour",
            mix: "Website Tour",
            sw: "Ziara ya Tovuti"
          })
        )}</span>

        <button class="mb-tour-close" id="mbTourClose"
          type="button" aria-label="${escapeHTML(tr({
            en: "Close tour",
            mix: "Funga tour",
            sw: "Funga ziara"
          }))}">×</button>
      </div>

      <div class="mb-tour-guide-row">
        <div class="mb-tour-farmer" id="mbTourFarmerArt">
          ${farmerSVG(farmer)}
        </div>

        <div class="mb-tour-copy">
          <p class="mb-tour-name">
            ${escapeHTML(farmer.names[getLanguage()])}
          </p>

          <h2 class="mb-tour-title" id="mbTourTitle">
            ${escapeHTML(step.title)}
          </h2>

          <p class="mb-tour-text" id="mbTourText">
            ${escapeHTML(step.text)}
          </p>
        </div>
      </div>

      <div class="mb-tour-progress"
        role="progressbar"
        aria-label="${escapeHTML(tr({
          en: "Tour progress",
          mix: "Tour progress",
          sw: "Maendeleo ya ziara"
        }))}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${percent}">
        <span style="width:${percent}%"></span>
      </div>

      <div class="mb-tour-meta">
        <span>${escapeHTML(tr({
          en: "Step",
          mix: "Step",
          sw: "Hatua"
        }))} ${currentStep + 1} / ${currentSteps.length}</span>

        <span>${percent}%</span>
      </div>

      <div class="mb-tour-actions">
        <div class="mb-tour-actions-left">
          <button class="mb-tour-btn" id="mbTourBack"
            type="button" ${currentStep === 0 ? "disabled" : ""}>
            ${escapeHTML(tr({
              en: "← Back",
              mix: "← Back",
              sw: "← Rudi"
            }))}
          </button>

          <button class="mb-tour-btn" id="mbTourSkip" type="button">
            ${escapeHTML(tr({
              en: "Skip",
              mix: "Skip",
              sw: "Ruka"
            }))}
          </button>
        </div>

        <div class="mb-tour-actions-right">
          <button class="mb-tour-btn" id="mbTourVoice" type="button">
            ${escapeHTML(speechEnabled
              ? tr({ en: "🔊 Voice on", mix: "🔊 Voice on", sw: "🔊 Sauti imewashwa" })
              : tr({ en: "🔈 Read aloud", mix: "🔈 Read aloud", sw: "🔈 Soma kwa sauti" })
            )}
          </button>

          <button class="mb-tour-btn mb-tour-btn-primary"
            id="mbTourNext" type="button">
            ${escapeHTML(currentStep === currentSteps.length - 1
              ? tr({ en: "Finish ✓", mix: "Finish ✓", sw: "Maliza ✓" })
              : tr({ en: "Next →", mix: "Next →", sw: "Endelea →" })
            )}
          </button>
        </div>
      </div>

      <div class="mb-tour-voice-status" id="mbTourVoiceStatus"
        aria-live="polite"></div>
    `;

    $("#mbTourClose", tourCard).addEventListener("click", closeTour);
    $("#mbTourSkip", tourCard).addEventListener("click", skipTour);

    $("#mbTourBack", tourCard).addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        saveProgress();
        renderStep();
      }
    });

    $("#mbTourNext", tourCard).addEventListener("click", () => {
      if (currentStep < currentSteps.length - 1) {
        currentStep++;
        saveProgress();
        renderStep();
      } else {
        finishTour();
      }
    });

    $("#mbTourVoice", tourCard).addEventListener("click", () => {
      speechEnabled = !speechEnabled;
      writeStorage(STORAGE.voice, speechEnabled ? "on" : "off");

      if (speechEnabled) {
        speakCurrentStep();
      } else {
        stopSpeech();
      }

      renderVoiceButton();
    });

    // Persist the current position so the tour can be resumed.
    saveProgress();

    requestAnimationFrame(() => {
      if (!isTourOpen) return;

      positionTourCard(stepTarget);

      try {
        stepTarget.scrollIntoView({
          behavior: reducedMotion() ? "auto" : "smooth",
          block: "nearest",
          inline: "nearest"
        });
      } catch (_) {}

      // Reposition after scrollIntoView changes the viewport geometry.
      setTimeout(() => {
        if (isTourOpen) positionTourCard(stepTarget);
      }, 250);
    });

    if (shouldSpeak && speechEnabled) {
      speakCurrentStep();
    } else {
      stopSpeech();

      // Give the character a short speaking animation when the text changes.
      // This is visual animation, not synchronised audio.
      setTalking(true);

      clearTimeout(animationTimer);
      animationTimer = setTimeout(() => {
        if (!speechActive || !speechEnabled) setTalking(false);
      }, 1300);
    }
  }

  function renderVoiceButton() {
    const button = $("#mbTourVoice");

    if (!button) return;

    button.textContent = speechEnabled
      ? tr({
          en: "🔊 Voice on",
          mix: "🔊 Voice on",
          sw: "🔊 Sauti imewashwa"
        })
      : tr({
          en: "🔈 Read aloud",
          mix: "🔈 Read aloud",
          sw: "🔈 Soma kwa sauti"
        });
  }

  function saveProgress() {
    writeStorage(STORAGE.progress, JSON.stringify({
      page: PAGE,
      step: currentStep,
      savedAt: Date.now()
    }));
  }

  function startTour(restart = false) {
    createLayer();

    currentSteps = buildSteps();

    if (!currentSteps.length) {
      announce(tr({
        en: "No tour steps are available on this page.",
        mix: "Hakuna tour steps za page hii.",
        sw: "Hakuna hatua za ziara kwenye ukurasa huu."
      }));
      return;
    }

    const saved = readJSON(STORAGE.progress, null);

    if (restart) {
      currentStep = 0;
      writeStorage(STORAGE.completed, "no");
    } else if (saved && saved.page === PAGE) {
      currentStep = Math.max(
        0,
        Math.min(Number(saved.step) || 0, currentSteps.length - 1)
      );
    } else {
      currentStep = 0;
    }

    speechEnabled = readStorage(STORAGE.voice, "off") === "on";
    isTourOpen = true;

    tourLayer.hidden = false;
    document.body.classList.add("mb-tour-active");

    renderStep();

    clearInterval(emotionTimer);

    emotionTimer = setInterval(() => {
      if (!isTourOpen || reducedMotion()) return;

      if (Math.random() > 0.45) {
        tourCard.classList.remove("mb-celebrate", "mb-nod");
        void tourCard.offsetWidth;

        tourCard.classList.add(
          Math.random() > 0.5 ? "mb-nod" : "mb-celebrate"
        );
      }
    }, 7000);
  }

  function closeTour() {
    isTourOpen = false;

    stopSpeech();

    clearTimeout(animationTimer);
    clearInterval(emotionTimer);

    if (tourLayer) tourLayer.hidden = true;

    document.body.classList.remove("mb-tour-active");

    if (tourLauncher) tourLauncher.focus();
  }

  function skipTour() {
    writeStorage(STORAGE.completed, "yes");
    closeTour();
  }

  function finishTour() {
    writeStorage(STORAGE.completed, "yes");
    writeStorage(STORAGE.progress, JSON.stringify({
      page: PAGE,
      step: 0,
      finished: true
    }));

    closeTour();

    announce(tr({
      en: "Tour complete. You can restart it whenever you need.",
      mix: "Tour imeisha. Unaweza kuianzisha tena wakati wowote.",
      sw: "Ziara imekamilika. Unaweza kuianzisha tena wakati wowote."
    }));
  }

  /* ============================================================
     RESPONSIVE LAYOUT MONITOR
     ============================================================ */

  function schedulePosition() {
    if (!isTourOpen) return;

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (isTourOpen) positionTourCard(currentTarget);
    }, 80);
  }

  function installLayoutListeners() {
    window.addEventListener("resize", schedulePosition, { passive: true });
    window.addEventListener("orientationchange", schedulePosition, { passive: true });
    window.addEventListener("scroll", schedulePosition, { passive: true, capture: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", schedulePosition);
      window.visualViewport.addEventListener("scroll", schedulePosition);
    }

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        if (isTourOpen) schedulePosition();
      });

      const observeGuideElements = () => {
        getGuideRects().forEach(item => {
          try {
            resizeObserver.observe(item.element);
          } catch (_) {}
        });
      };

      observeGuideElements();

      window.addEventListener("resize", observeGuideElements, { passive: true });
    }

    // Reposition when a Guide opens or closes.
    if ("MutationObserver" in window) {
      observer = new MutationObserver(() => {
        if (isTourOpen) schedulePosition();
        refreshFarmerArtwork();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "aria-expanded"]
      });

      // Stop watching the whole page after setup; the tour has its own listeners.
      setTimeout(() => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }, 5000);
    }
  }

  /* ============================================================
     LANGUAGE UPDATES
     ============================================================ */

  function refreshLauncherText() {
    if (tourLauncher) {
      tourLauncher.textContent = tr({
        en: "🧭 Website Tour",
        mix: "🧭 Website Tour",
        sw: "🧭 Ziara ya Tovuti"
      });
    }

    if (avatarLauncher) {
      avatarLauncher.textContent = tr({
        en: "👩🏾‍🌾 Choose Farmer",
        mix: "👩🏾‍🌾 Choose Farmer",
        sw: "👩🏾‍🌾 Chagua Mkulima"
      });
    }
  }

  function installLanguageListener() {
    const select = $("#languageSelect");

    if (!select) return;

    select.addEventListener("change", () => {
      if (LANGUAGES.includes(select.value)) {
        writeStorage(STORAGE.language, select.value);
      }

      refreshLauncherText();
      refreshFarmerArtwork();

      if (isTourOpen) {
        currentSteps = buildSteps();
        currentStep = Math.min(currentStep, currentSteps.length - 1);
        renderStep(false);
      }
    });
  }

  /* ============================================================
     INITIALISATION
     ============================================================ */

  function init() {
    if (!document.body) return;

    injectStyles();
    createLayer();
    createLaunchers();
    refreshFarmerArtwork();
    installLayoutListeners();
    installLanguageListener();

    speechEnabled = readStorage(STORAGE.voice, "off") === "on";

    // Browser voices may load asynchronously.
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voice selection is performed when the user asks for speech.
      };
    }

    const completed = readStorage(STORAGE.completed, "no");

    if (completed !== "yes") {
      setTimeout(() => {
        if (!document.hidden) startTour(false);
      }, 900);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
