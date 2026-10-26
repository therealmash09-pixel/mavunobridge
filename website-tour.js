
/* =========================================================
   MAVUNOBRIDGE — ANIMATED FARMER WEBSITE TOUR
   Complete replacement: website-tour.js

   Features:
   - Four selectable farmer guides
   - English, casual Sheng-English, Kiswahili
   - Browser voice selection
   - Animated farmer avatar and talking mouth
   - Page-aware narration
   - Element spotlight
   - Back, Next, Skip and Replay controls
   - Responsive panel
   - No external libraries required
   ========================================================= */

(() => {
  "use strict";

  if (window.__mavunoTourLoaded) return;
  window.__mavunoTourLoaded = true;

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
    speaking: false,
    session: 0,
    mouthTimer: null,
    voices: [],
    page: "marketplace",
    panel: null,
    guide: null,
    spotlight: null,
    launcher: null
  };

  const farmers = {
    baba: {
      name: "Baba Otieno",
      role: "Elder grower",
      pitch: 0.82,
      rate: 0.88,
      shirt: "#4F7A3A",
      skin: "#7a4a2e",
      hair: "#cfcfcf",
      hat: "#EBC76B",
      type: "elder"
    },
    kamau: {
      name: "Kamau",
      role: "Maize farmer",
      pitch: 0.98,
      rate: 1,
      shirt: "#E3A72F",
      skin: "#9a6238",
      hair: "#20130d",
      hat: "#C0392B",
      type: "youngman"
    },
    wanjiru: {
      name: "Mama Wanjiru",
      role: "Dairy and vegetable farmer",
      pitch: 1.08,
      rate: 0.94,
      shirt: "#1E7F74",
      skin: "#5e3520",
      hair: "#20130d",
      hat: "#E67E22",
      type: "woman"
    },
    akinyi: {
      name: "Akinyi",
      role: "Tomato grower",
      pitch: 1.13,
      rate: 1,
      shirt: "#3C6E9F",
      skin: "#b27a4e",
      hair: "#20130d",
      hat: "#F4C430",
      type: "tomato"
    }
  };

  const words = {
    en: {
      tour: "MavunoBridge Tour",
      welcome: "Karibu to MavunoBridge!",
      choose: "Choose your farmer guide",
      language: "Tour language",
      voice: "Voice",
      browserVoice: "Automatic voice",
      start: "Start tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Finish tour",
      replay: "Replay tour",
      step: "Step",
      done: "You're all set!",
      doneText: "Explore MavunoBridge and discover the tools available on this page.",
      marketplace: "Marketplace",
      assist: "Smart Assist",
      sacco: "SACCO Hub",
      farmer: "Farmer tools",
      buyer: "Buyer tools",
      unavailable: "This section isn't visible on the current page. You can still continue the tour.",
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
      start: "Anza tour",
      next: "Next",
      back: "Back",
      skip: "Skip tour",
      finish: "Maliza tour",
      replay: "Replay tour",
      step: "Step",
      done: "Uko sawa kabisa!",
      doneText: "Explore MavunoBridge uone tools ziko available kwa hii page.",
      marketplace: "Marketplace",
      assist: "Smart Assist",
      sacco: "SACCO Hub",
      farmer: "Farmer tools",
      buyer: "Buyer tools",
      unavailable: "Hii section haionekani kwa hii page. Unaweza kuendelea na tour.",
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
      start: "Anza ziara",
      next: "Endelea",
      back: "Rudi",
      skip: "Ruka ziara",
      finish: "Maliza ziara",
      replay: "Anza ziara tena",
      step: "Hatua",
      done: "Uko tayari!",
      doneText: "Chunguza MavunoBridge na ujifunze kuhusu huduma zilizopo kwenye ukurasa huu.",
      marketplace: "Soko",
      assist: "Smart Assist",
      sacco: "SACCO Hub",
      farmer: "Huduma za mkulima",
      buyer: "Huduma za mnunuzi",
      unavailable: "Sehemu hii haionekani kwenye ukurasa wa sasa. Unaweza kuendelea na ziara.",
      close: "Funga ziara",
      langs: {
        en: "Kiingereza",
        mix: "Sheng na Kiingereza",
        sw: "Kiswahili"
      }
    }
  };

  const scripts = {
    marketplace: {
      en: [
        ["Welcome to MavunoBridge", "Meet your farmer guide! This is the agricultural marketplace. Explore the available products and services.", "header,.site-header,.navbar,#hero,.hero"],
        ["Explore product categories", "Use the categories to find products such as fruits, vegetables, grains, legumes and more.", "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"],
        ["Search and filter", "Use search and available filters to narrow down products by name, category or location.", "#searchInput,#searchBar,input[type=search],.marketplace-filters"],
        ["Browse listings", "Check product photos, prices, quantities and farmer details before choosing what works for you.", "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"],
        ["List your produce", "Are you a farmer? Look for the sell or add listing option to share your produce with potential buyers.", "#sellButton,#heroSellButton,#listingForm,#sellForm"],
        ["More tools", "You can also explore Smart Assist for farming information and SACCO Hub for available opportunities.", "a[href*=smart-assist],a[href*=sacco],nav"]
      ],
      mix: [
        ["Karibu MavunoBridge!", "Hii ni agricultural marketplace. Explore products na services ambazo farmers wameweka.", "header,.site-header,.navbar,#hero,.hero"],
        ["Explore categories", "Chagua category kama fruits, vegetables, grains, legumes na zingine kupata bidhaa unatafuta.", "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"],
        ["Search na filters", "Tumia search na filters kupunguza results kulingana na product, category ama location.", "#searchInput,#searchBar,input[type=search],.marketplace-filters"],
        ["Browse listings", "Angalia picha, price, quantity na farmer details kabla ya kuchagua product.", "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"],
        ["List produce yako", "Wewe ni farmer? Tafuta sell ama add listing uweke produce yako ionekane kwa potential buyers.", "#sellButton,#heroSellButton,#listingForm,#sellForm"],
        ["Explore more tools", "Pia unaweza kucheck Smart Assist kwa farming information na SACCO Hub kwa opportunities zilizopo.", "a[href*=smart-assist],a[href*=sacco],nav"]
      ],
      sw: [
        ["Karibu MavunoBridge", "Hili ni soko la bidhaa za kilimo. Chunguza bidhaa na huduma zilizowekwa kwenye tovuti.", "header,.site-header,.navbar,#hero,.hero"],
        ["Chunguza makundi ya bidhaa", "Chagua kundi kama matunda, mboga, nafaka na jamii ya mikunde ili kupata bidhaa unazohitaji.", "#categories,#categoryGrid,.category-grid,.categories,[data-categories]"],
        ["Tafuta na uchuje", "Tumia sehemu ya kutafuta na vichujio kupunguza matokeo kulingana na bidhaa au eneo.", "#searchInput,#searchBar,input[type=search],.marketplace-filters"],
        ["Angalia bidhaa", "Kagua picha, bei, kiasi na maelezo ya mkulima kabla ya kuchagua bidhaa.", "#listingGrid,#marketplaceGrid,#products,.product-grid,.marketplace"],
        ["Weka bidhaa zako", "Ikiwa wewe ni mkulima, tafuta sehemu ya kuuza au kuongeza bidhaa ili wanunuzi waweze kuziona.", "#sellButton,#heroSellButton,#listingForm,#sellForm"],
        ["Huduma nyingine", "Unaweza pia kuchunguza Smart Assist kwa taarifa za kilimo na SACCO Hub kwa fursa zilizopo.", "a[href*=smart-assist],a[href*=sacco],nav"]
      ]
    },

    smart: {
      en: [
        ["Welcome to Smart Assist", "This page is for exploring farming support and information available in MavunoBridge.", "header,h1,.page-header"],
        ["Explore the assistant", "Look through the tools and guidance that are actually available on this page.", "#smartAssist,#smart-assist,.smart-assist,main"],
        ["Ask or enter information", "If an input box is available, use it to enter your farming question or the details requested.", "#questionInput,#chatInput,#askInput,textarea,input[type=text]"],
        ["Review the guidance", "Read the displayed guidance carefully. Check local conditions and trusted agricultural advice before making farming decisions.", "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"],
        ["Back to the marketplace", "When you're ready, return to the marketplace to explore agricultural products and services.", "a[href*=index],a[href*=marketplace],nav"]
      ],
      mix: [
        ["Karibu Smart Assist", "Hii page inakusaidia kuchunguza farming support na information ambayo iko available hapa.", "header,h1,.page-header"],
        ["Explore assistant", "Angalia tools na guidance ambazo ziko kweli kwa hii page.", "#smartAssist,#smart-assist,.smart-assist,main"],
        ["Weka swali lako", "Kama kuna input box, andika farming question yako ama details zinazohitajika.", "#questionInput,#chatInput,#askInput,textarea,input[type=text]"],
        ["Soma guidance", "Soma majibu vizuri. Check local conditions na trusted agricultural advice kabla ya kufanya farming decisions.", "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"],
        ["Rudi marketplace", "Ukiwa ready, rudi marketplace uone agricultural products na services.", "a[href*=index],a[href*=marketplace],nav"]
      ],
      sw: [
        ["Karibu Smart Assist", "Ukurasa huu unakusaidia kuchunguza taarifa na usaidizi wa kilimo unaopatikana.", "header,h1,.page-header"],
        ["Chunguza msaidizi", "Angalia zana na maelekezo yanayoonekana kwenye ukurasa huu.", "#smartAssist,#smart-assist,.smart-assist,main"],
        ["Weka swali au taarifa", "Ikiwa kuna kisanduku cha kuandika, weka swali lako la kilimo au taarifa zinazohitajika.", "#questionInput,#chatInput,#askInput,textarea,input[type=text]"],
        ["Soma maelekezo", "Soma maelezo kwa makini. Hakikisha unazingatia hali ya eneo lako na ushauri wa wataalamu wa kilimo.", "#response,#answer,#chatMessages,.chat-messages,.assistant-response,main"],
        ["Rudi sokoni", "Ukiwa tayari, rudi sokoni kuchunguza bidhaa na huduma za kilimo.", "a[href*=index],a[href*=marketplace],nav"]
      ]
    },

    sacco: {
      en: [
        ["Welcome to SACCO Hub", "This page helps you explore SACCO-related information and opportunities displayed by MavunoBridge.", "header,h1,.page-header"],
        ["Explore available options", "Review the SACCOs or opportunities listed here. Availability depends on what has been added to the site.", "#saccoHub,#sacco,.sacco-hub,main"],
        ["Check the details", "Read eligibility, contact information and requirements carefully before making a decision.", ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"],
        ["Make informed choices", "Verify an organisation's details directly before sharing personal information or making payments.", "main"],
        ["Continue exploring", "Return to the marketplace or visit Smart Assist for other available tools.", "nav,a[href*=index],a[href*=smart-assist]"]
      ],
      mix: [
        ["Karibu SACCO Hub", "Hapa unaweza explore SACCO information na opportunities ambazo zimewekwa kwa MavunoBridge.", "header,h1,.page-header"],
        ["Explore options", "Angalia SACCOs ama opportunities zilizoorodheshwa. Availability inategemea content imewekwa kwa site.", "#saccoHub,#sacco,.sacco-hub,main"],
        ["Check details", "Soma eligibility, contact details na requirements vizuri kabla ya kuamua.", ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"],
        ["Chagua kwa uangalifu", "Verify organisation details directly kabla ya kushare personal information ama kutuma pesa.", "main"],
        ["Endelea kuchunguza", "Rudi marketplace ama tembelea Smart Assist kwa tools zingine zilizopo.", "nav,a[href*=index],a[href*=smart-assist]"]
      ],
      sw: [
        ["Karibu SACCO Hub", "Hapa unaweza kuchunguza taarifa za SACCO na fursa zinazoonyeshwa kwenye MavunoBridge.", "header,h1,.page-header"],
        ["Chunguza chaguo zilizopo", "Angalia SACCO na fursa zilizoorodheshwa. Upatikanaji hutegemea taarifa zilizowekwa kwenye tovuti.", "#saccoHub,#sacco,.sacco-hub,main"],
        ["Kagua maelezo", "Soma masharti, taarifa za mawasiliano na mahitaji kwa makini kabla ya kuamua.", ".sacco-card,.opportunity-card,#saccoGrid,.sacco-grid"],
        ["Fanya maamuzi kwa uangalifu", "Thibitisha taarifa za shirika kabla ya kutoa taarifa binafsi au kutuma pesa.", "main"],
        ["Endelea kuchunguza", "Rudi sokoni au tembelea Smart Assist kwa zana nyingine zilizopo.", "nav,a[href*=index],a[href*=smart-assist]"]
      ]
    },

    farmer: {
      en: [
        ["Welcome, farmer!", "Let's look at the listing tools available on this page.", "header,h1,.page-header"],
        ["Enter product details", "Add the product name and choose the correct agricultural category.", "#productName,#product,#category,#productCategory,form"],
        ["Add price and quantity", "Enter the price and quantity requested by the form. Check the units before submitting.", "#price,#quantity,#listingForm,#sellForm,form"],
        ["Add photos and location", "If the form supports them, add clear product photos and your correct county or location.", "#photo,#image,#county,#location,input[type=file],form"],
        ["Review before submitting", "Double-check the details before submitting your listing. Use the confirmation shown by the website to check whether it worked.", "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"]
      ],
      mix: [
        ["Karibu farmer!", "Tuangalie listing tools ambazo ziko kwa hii page.", "header,h1,.page-header"],
        ["Weka product details", "Andika jina la product na uchague agricultural category inayofaa.", "#productName,#product,#category,#productCategory,form"],
        ["Weka price na quantity", "Weka price na quantity kulingana na form. Hakikisha units ni correct.", "#price,#quantity,#listingForm,#sellForm,form"],
        ["Ongeza picha na location", "Kama form inaruhusu, weka clear product photos na county ama location yako sahihi.", "#photo,#image,#county,#location,input[type=file],form"],
        ["Kagua kabla ya kutuma", "Check details zote kabla ya kusubmit. Angalia confirmation ya website kuhakikisha kama imekubali listing.", "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"]
      ],
      sw: [
        ["Karibu mkulima!", "Tuangalie zana za kuweka bidhaa zinazopatikana kwenye ukurasa huu.", "header,h1,.page-header"],
        ["Weka maelezo ya bidhaa", "Andika jina la bidhaa na uchague kundi sahihi la kilimo.", "#productName,#product,#category,#productCategory,form"],
        ["Weka bei na kiasi", "Weka bei na kiasi kinachohitajika kwenye fomu. Hakikisha vipimo ni sahihi.", "#price,#quantity,#listingForm,#sellForm,form"],
        ["Ongeza picha na eneo", "Ikiwa fomu inaruhusu, weka picha zilizo wazi na kaunti au eneo lako sahihi.", "#photo,#image,#county,#location,input[type=file],form"],
        ["Kagua kabla ya kutuma", "Kagua maelezo yote kabla ya kutuma. Angalia ujumbe wa uthibitisho ili kujua kama bidhaa imekubaliwa.", "#submitListing,#addListing,#listingForm button[type=submit],#sellForm button[type=submit],form button[type=submit]"]
      ]
    },

    buyer: {
      en: [
        ["Welcome, buyer!", "Let's explore how to browse products on MavunoBridge.", "header,h1,.page-header"],
        ["Search for products", "Use the search field if available to find a product by name.", "#searchInput,#searchBar,input[type=search]"],
        ["Browse and compare", "Compare the displayed prices, quantities, locations and product details.", "#listingGrid,#marketplaceGrid,#products,.product-grid,main"],
        ["Check farmer details", "Review the seller information shown on a listing before contacting the farmer.", ".product-card,.listing-card,.product-details,main"],
        ["Choose carefully", "Confirm price, quantity, delivery and payment arrangements directly with the seller before making a purchase.", "#cartButton,#cart,main"]
      ],
      mix: [
        ["Karibu buyer!", "Tuangalie vile unaweza browse products kwa MavunoBridge.", "header,h1,.page-header"],
        ["Search products", "Tumia search field kama iko ili kupata product kwa jina.", "#searchInput,#searchBar,input[type=search]"],
        ["Browse na compare", "Compare prices, quantities, locations na product details zinazoonyeshwa.", "#listingGrid,#marketplaceGrid,#products,.product-grid,main"],
        ["Check farmer details", "Angalia seller information kwa listing kabla ya kucontact farmer.", ".product-card,.listing-card,.product-details,main"],
        ["Chagua kwa makini", "Confirm price, quantity, delivery na payment arrangements na seller kabla ya kununua.", "#cartButton,#cart,main"]
      ],
      sw: [
        ["Karibu mnunuzi!", "Tuangalie jinsi ya kuchunguza bidhaa kwenye MavunoBridge.", "header,h1,.page-header"],
        ["Tafuta bidhaa", "Tumia sehemu ya kutafuta ikiwa ipo ili kupata bidhaa kwa jina.", "#searchInput,#searchBar,input[type=search]"],
        ["Chunguza na kulinganisha", "Linganisha bei, kiasi, maeneo na maelezo ya bidhaa yanayoonyeshwa.", "#listingGrid,#marketplaceGrid,#products,.product-grid,main"],
        ["Kagua taarifa za mkulima", "Soma taarifa za muuzaji kwenye tangazo kabla ya kuwasiliana naye.", ".product-card,.listing-card,.product-details,main"],
        ["Chagua kwa uangalifu", "Thibitisha bei, kiasi, usafirishaji na malipo na muuzaji kabla ya kununua.", "#cartButton,#cart,main"]
      ]
    }
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function detectPage() {
    const path = location.pathname.toLowerCase();
    const title = document.title.toLowerCase();
    const bodyPage = (document.body?.dataset.page || "").toLowerCase();

    if (/smart[-_ ]?assist|smart_assist/.test(path + " " + title + " " + bodyPage)) {
      return "smart";
    }

    if (/sacco/.test(path + " " + title + " " + bodyPage)) {
      return "sacco";
    }

    if (/farmer|listing|sell-product|add-product/.test(path + " " + title + " " + bodyPage)) {
      return "farmer";
    }

    if (/buyer|checkout/.test(path + " " + title + " " + bodyPage)) {
      return "buyer";
    }

    return "marketplace";
  }

  function currentWords() {
    return words[state.language] || words.en;
  }

  function getSteps() {
    const page = scripts[state.page] || scripts.marketplace;
    return page[state.language] || page.en;
  }

  /*
   * Inline portraits use one consistent visual system:
   * circular framing, matching face proportions, bold outlines,
   * soft farm scenery and a matching vector illustration style.
   */
  function avatarSVG(id, talking = false) {
    const f = farmers[id] || farmers.akinyi;
    const mouth = talking
      ? '<ellipse cx="100" cy="119" rx="9" ry="6" fill="#672f2b"/>'
      : '<path d="M91 117 Q100 125 109 117" fill="none" stroke="#672f2b" stroke-width="3" stroke-linecap="round"/>';

    let headwear = "";

    if (id === "baba") {
      headwear = `
        <path d="M61 67 Q65 29 100 29 Q135 29 139 67Z" fill="#EBC76B" stroke="#9B7430" stroke-width="2"/>
        <ellipse cx="100" cy="68" rx="49" ry="9" fill="#D9AE4B" stroke="#9B7430" stroke-width="2"/>
        <path d="M66 51 Q100 42 134 51 M72 42 Q100 35 128 42" fill="none" stroke="#C9A043" stroke-width="2"/>
      `;
    } else if (id === "kamau") {
      headwear = `
        <path d="M63 70 Q60 34 100 31 Q139 34 137 70Z" fill="#C0392B" stroke="#84251D" stroke-width="2"/>
        <path d="M100 32 L100 64" stroke="#962D22" stroke-width="2"/>
        <ellipse cx="100" cy="70" rx="41" ry="7" fill="#962D22"/>
      `;
    } else if (id === "wanjiru") {
      headwear = `
        <path d="M59 81 Q54 37 100 31 Q146 37 141 81 L132 73 Q100 54 68 73Z" fill="#E67E22" stroke="#B95211" stroke-width="2"/>
        <path d="M68 58 Q100 44 132 58 M65 68 Q100 52 135 68" fill="none" stroke="#F5B06D" stroke-width="3"/>
        <path d="M75 40 Q100 31 125 40" fill="none" stroke="#1F5F8B" stroke-width="3"/>
      `;
    } else {
      headwear = `
        <path d="M70 66 Q61 30 100 27 Q139 30 130 66" fill="#20130D"/>
        <circle cx="75" cy="41" r="19" fill="#20130D"/>
        <circle cx="125" cy="41" r="19" fill="#20130D"/>
        <path d="M64 51 Q100 35 136 51 L130 64 Q100 52 70 64Z" fill="#20130D"/>
        <path d="M70 48 Q100 35 130 48 L128 58 Q100 48 72 58Z" fill="#F4C430"/>
      `;
    }

    const beard = id === "baba"
      ? '<path d="M75 110 Q72 145 100 150 Q128 145 125 110 Q113 133 100 128 Q87 133 75 110Z" fill="#D8D8D8"/>'
      : "";

    const tomatoes = id === "akinyi"
      ? `
        <path d="M53 167 L61 143 L139 143 L147 167Z" fill="#A0713B" stroke="#6F4929" stroke-width="2"/>
        <path d="M60 154 L140 154 M76 144 L76 166 M100 144 L100 166 M124 144 L124 166" stroke="#7C5428" stroke-width="2"/>
        <circle cx="80" cy="143" r="12" fill="#D93B2B"/>
        <circle cx="100" cy="137" r="13" fill="#D93B2B"/>
        <circle cx="120" cy="143" r="12" fill="#D93B2B"/>
        <path d="M76 132 l4 5 l4 -5 M96 125 l4 5 l4 -5 M116 132 l4 5 l4 -5" fill="#4F7A3A"/>
      `
      : "";

    return `
      <svg class="mbt-avatar-svg" viewBox="0 0 200 200"
           role="img" aria-label="${escapeHTML(f.name)}, ${escapeHTML(f.role)}"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="mbtClip${id}">
            <circle cx="100" cy="100" r="95"/>
          </clipPath>
          <linearGradient id="mbtSky${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#D5E6F0"/>
            <stop offset="1" stop-color="#FBE6BF"/>
          </linearGradient>
        </defs>

        <g clip-path="url(#mbtClip${id})">
          <circle cx="100" cy="100" r="95" fill="url(#mbtSky${id})"/>
          <circle cx="30" cy="47" r="20" fill="#FFFFFF" opacity=".35"/>
          <circle cx="163" cy="42" r="27" fill="#FFFFFF" opacity=".3"/>
          <path d="M0 111 Q35 76 71 105 T145 97 T200 103 V200 H0Z" fill="#A3C47A"/>
          <path d="M0 135 Q40 103 78 128 T150 120 T200 130 V200 H0Z" fill="#7DA85F"/>

          <path d="M40 200 Q43 148 69 143 L131 143 Q157 148 160 200Z"
                fill="${f.shirt}"/>
          <path d="M83 145 L100 164 L117 145" fill="#F3EFE2"/>
          <path d="M84 145 L80 200 M116 145 L120 200"
                stroke="${id === "akinyi" ? "#244F7C" : f.shirt}"
                stroke-width="7" fill="none"/>

          <path d="M84 116 L84 145 L116 145 L116 116Z" fill="${f.skin}"/>
          <ellipse cx="70" cy="91" rx="8" ry="12" fill="${f.skin}"/>
          <ellipse cx="130" cy="91" rx="8" ry="12" fill="${f.skin}"/>

          <ellipse cx="100" cy="91" rx="34" ry="42" fill="${f.skin}"/>
          <ellipse cx="100" cy="101" rx="26" ry="25" fill="${f.skin}" opacity=".2"/>

          ${headwear}

          <path d="M75 83 Q85 77 93 82 M107 82 Q115 77 125 83"
                fill="none" stroke="#20130D" stroke-width="4" stroke-linecap="round"/>

          <ellipse cx="86" cy="91" rx="7" ry="5" fill="#FFFFFF"/>
          <ellipse cx="114" cy="91" rx="7" ry="5" fill="#FFFFFF"/>
          <circle cx="87" cy="91" r="3.5" fill="#20130D"/>
          <circle cx="113" cy="91" r="3.5" fill="#20130D"/>
          <circle cx="88" cy="90" r="1.2" fill="#FFFFFF"/>
          <circle cx="114" cy="90" r="1.2" fill="#FFFFFF"/>

          <path d="M100 96 Q95 106 101 108"
                fill="none" stroke="#75462F" stroke-width="2.2" stroke-linecap="round"/>

          <circle cx="76" cy="105" r="7" fill="#E57373" opacity=".22"/>
          <circle cx="124" cy="105" r="7" fill="#E57373" opacity=".22"/>

          ${beard}
          ${mouth}
          ${tomatoes}

          ${id === "baba"
            ? '<path d="M77 84 Q100 73 123 84" stroke="#BDBDBD" stroke-width="3" fill="none"/>'
            : ""}

          ${id === "kamau"
            ? '<path d="M71 151 L129 151 M80 165 L120 165" stroke="#B87A12" stroke-width="2" opacity=".6"/>'
            : ""}

          ${id === "wanjiru"
            ? '<circle cx="70" cy="110" r="4" fill="#F1C40F"/><circle cx="130" cy="110" r="4" fill="#F1C40F"/>'
            : ""}

          ${id === "akinyi"
            ? '<circle cx="71" cy="110" r="4" fill="#F4C430"/><circle cx="129" cy="110" r="4" fill="#F4C430"/>'
            : ""}
        </g>
      </svg>
    `;
  }

  function addStyles() {
    if (document.getElementById("mavuno-tour-styles")) return;

    const style = document.createElement("style");
    style.id = "mavuno-tour-styles";

    style.textContent = `
      #mbt-launcher, #mbt-panel, #mbt-guide,
      #mbt-spotlight, #mbt-overlay {
        box-sizing: border-box;
      }

      #mbt-launcher {
        position: fixed;
        z-index: 99990;
        right: 18px;
        bottom: 18px;
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        background: #285438;
        color: white;
        font: 700 14px/1.3 system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 8px 25px #0002;
      }

      #mbt-launcher:hover { background: #1d402c; }

      #mbt-overlay {
        position: fixed;
        inset: 0;
        z-index: 99991;
        background: rgb(15 29 20 / 48%);
        pointer-events: none;
      }

      #mbt-spotlight {
        position: fixed;
        z-index: 99992;
        pointer-events: none;
        border: 3px solid #EBC76B;
        border-radius: 15px;
        box-shadow: 0 0 0 5px rgb(235 199 107 / 24%),
                    0 0 35px rgb(235 199 107 / 40%);
        transition: all .25s ease;
      }

      #mbt-guide {
        position: fixed;
        z-index: 99994;
        left: 18px;
        bottom: 18px;
        width: 116px;
        text-align: center;
        pointer-events: none;
        animation: mbt-float 2.6s ease-in-out infinite;
      }

      .mbt-avatar-frame {
        width: 104px;
        height: 104px;
        border-radius: 50%;
        padding: 4px;
        background: white;
        box-shadow: 0 8px 25px #0003;
        overflow: hidden;
      }

      .mbt-avatar-svg {
        display: block;
        width: 100%;
        height: 100%;
      }

      #mbt-guide-name {
        display: inline-block;
        margin-top: 5px;
        padding: 4px 9px;
        background: white;
        color: #23442e;
        border-radius: 999px;
        font: 700 12px system-ui, sans-serif;
        box-shadow: 0 2px 10px #0002;
      }

      #mbt-panel {
        position: fixed;
        z-index: 99995;
        right: 18px;
        bottom: 18px;
        width: min(430px, calc(100vw - 36px));
        max-height: min(82vh, 760px);
        overflow: auto;
        padding: 18px;
        border: 1px solid #dce7d8;
        border-radius: 20px;
        background: #fff;
        color: #20352a;
        box-shadow: 0 18px 55px #0003;
        font: 14px/1.5 system-ui, sans-serif;
      }

      #mbt-panel * { box-sizing: border-box; }

      .mbt-topline {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
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
        margin: 3px 0 8px;
        color: #153322;
        font-size: 21px;
        line-height: 1.2;
      }

      .mbt-close {
        border: 0;
        border-radius: 10px;
        padding: 6px 10px;
        background: #edf3e9;
        color: #23442e;
        cursor: pointer;
        font-size: 18px;
      }

      .mbt-description { margin: 8px 0 14px; }

      .mbt-field { margin-top: 12px; }

      .mbt-field label {
        display: block;
        margin-bottom: 5px;
        font-size: 12px;
        font-weight: 750;
      }

      .mbt-field select {
        width: 100%;
        min-height: 40px;
        border: 1px solid #d4dfd1;
        border-radius: 10px;
        padding: 8px 10px;
        background: white;
        color: #20352a;
        font: inherit;
      }

      .mbt-avatar-options {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
      }

      .mbt-avatar-option {
        min-width: 0;
        border: 2px solid #e0e8dc;
        border-radius: 12px;
        padding: 5px 3px;
        background: #f7faf5;
        color: #20352a;
        cursor: pointer;
        font: inherit;
      }

      .mbt-avatar-option[aria-pressed="true"] {
        border-color: #477e4e;
        background: #eaf3e5;
      }

      .mbt-avatar-option .mbt-avatar-svg {
        max-width: 66px;
        margin: auto;
      }

      .mbt-avatar-option span {
        display: block;
        overflow-wrap: anywhere;
        font-size: 10px;
        font-weight: 750;
      }

      .mbt-progress {
        height: 6px;
        margin: 12px 0;
        overflow: hidden;
        border-radius: 99px;
        background: #e9efe5;
      }

      .mbt-progress > div {
        height: 100%;
        width: 0;
        background: #477e4e;
        transition: width .2s ease;
      }

      .mbt-step-count {
        color: #5f7064;
        font-size: 12px;
        font-weight: 750;
      }

      .mbt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      .mbt-button {
        flex: 1 1 auto;
        min-height: 40px;
        border: 0;
        border-radius: 11px;
        padding: 10px 13px;
        background: #285438;
        color: white;
        cursor: pointer;
        font: 750 13px system-ui, sans-serif;
      }

      .mbt-button:hover { background: #1d402c; }

      .mbt-button.secondary {
        background: #edf3e9;
        color: #23442e;
      }

      .mbt-button.secondary:hover { background: #dfeadb; }

      .mbt-button:disabled {
        opacity: .45;
        cursor: not-allowed;
      }

      .mbt-note {
        margin-top: 10px;
        color: #617165;
        font-size: 11px;
      }

      @keyframes mbt-float {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-7px) rotate(-1deg); }
      }

      @keyframes mbt-wave {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-9deg); }
        75% { transform: rotate(9deg); }
      }

      #mbt-guide.mbt-waving { animation: mbt-wave .5s ease-in-out 3; }

      @media (max-width: 600px) {
        #mbt-panel {
          right: 10px;
          bottom: 10px;
          width: calc(100vw - 20px);
          max-height: 78vh;
          padding: 14px;
        }

        #mbt-guide {
          left: 8px;
          bottom: 10px;
          width: 76px;
        }

        .mbt-avatar-frame {
          width: 68px;
          height: 68px;
        }

        #mbt-guide-name {
          max-width: 76px;
          font-size: 10px;
        }

        #mbt-launcher {
          right: 10px;
          bottom: 10px;
        }

        .mbt-title { font-size: 19px; }
      }

      @media (prefers-reduced-motion: reduce) {
        #mbt-guide, #mbt-guide.mbt-waving {
          animation: none !important;
        }

        #mbt-spotlight, .mbt-progress > div {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function makeElement(tag, id, parent = document.body) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    parent.appendChild(element);
    return element;
  }

  function stopSpeech() {
    state.session++;
    state.speaking = false;

    if (state.mouthTimer) {
      clearInterval(state.mouthTimer);
      state.mouthTimer = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (state.guide) renderGuide();
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;

    state.voices = window.speechSynthesis.getVoices() || [];

    if (state.panel) {
      const select = state.panel.querySelector("#mbt-voice");
      if (select) fillVoiceOptions(select);
    }
  }

  function voiceOptionsForLanguage() {
    const prefix = {
      en: ["en-KE", "en-GB", "en-US", "en"],
      mix: ["en-KE", "en-GB", "en-US", "en"],
      sw: ["sw-KE", "sw-TZ", "sw"]
    }[state.language] || ["en"];

    const voices = state.voices.slice();

    return voices.sort((a, b) => {
      const aIndex = prefix.findIndex(p => a.lang.toLowerCase().startsWith(p.toLowerCase()));
      const bIndex = prefix.findIndex(p => b.lang.toLowerCase().startsWith(p.toLowerCase()));
      return (aIndex < 0 ? 999 : aIndex) - (bIndex < 0 ? 999 : bIndex);
    });
  }

  function fillVoiceOptions(select) {
    const t = currentWords();
    const previous = state.voiceURI;

    select.innerHTML = "";
    const automatic = document.createElement("option");
    automatic.value = "";
    automatic.textContent = t.browserVoice;
    select.appendChild(automatic);

    voiceOptionsForLanguage().forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = `${voice.name} (${voice.lang})`;
      select.appendChild(option);
    });

    select.value = previous;
    if (select.value !== previous) select.value = "";
  }

  function chooseVoice() {
    const voices = voiceOptionsForLanguage();

    if (state.voiceURI) {
      const chosen = voices.find(voice => voice.voiceURI === state.voiceURI);
      if (chosen) return chosen;
    }

    const preferredPrefix = state.language === "sw" ? "sw" : "en";
    return voices.find(voice => voice.lang.toLowerCase().startsWith(preferredPrefix))
      || voices[0]
      || null;
  }

  function speak(text) {
    stopSpeech();

    if (!("speechSynthesis" in window) || !text) return;

    const session = state.session;
    const farmer = farmers[state.avatar] || farmers.akinyi;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = chooseVoice();

    if (voice) utterance.voice = voice;

    utterance.lang = state.language === "sw" ? "sw-KE" : "en-KE";
    utterance.pitch = farmer.pitch;
    utterance.rate = farmer.rate;

    utterance.onstart = () => {
      if (session !== state.session) return;
      state.speaking = true;
      if (state.guide) renderGuide();
      state.mouthTimer = setInterval(() => {
        if (session !== state.session || !state.speaking) return;
        renderGuide(Math.random() > 0.45);
      }, 150);
    };

    utterance.onend = () => {
      if (session !== state.session) return;
      state.speaking = false;
      if (state.mouthTimer) clearInterval(state.mouthTimer);
      state.mouthTimer = null;
      if (state.guide) renderGuide(false);
    };

    utterance.onerror = () => {
      if (session !== state.session) return;
      state.speaking = false;
      if (state.mouthTimer) clearInterval(state.mouthTimer);
      state.mouthTimer = null;
      if (state.guide) renderGuide(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function renderGuide(talking = state.speaking) {
    if (!state.guide) return;

    const farmer = farmers[state.avatar] || farmers.akinyi;

    state.guide.innerHTML = `
      <div class="mbt-avatar-frame">
        ${avatarSVG(state.avatar, talking)}
      </div>
      <div id="mbt-guide-name">${escapeHTML(farmer.name)}</div>
    `;
  }

  function createGuide() {
    if (state.guide) return;

    state.guide = makeElement("div", "mbt-guide");
    state.guide.setAttribute("aria-live", "polite");
    renderGuide();
  }

  function findTarget(selector) {
    if (!selector) return null;

    const candidates = selector.split(",").map(s => s.trim());

    for (const candidate of candidates) {
      try {
        const elements = document.querySelectorAll(candidate);

        for (const element of elements) {
          if (!element || element.closest("#mbt-panel,#mbt-guide,#mbt-launcher")) continue;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);

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
        // Ignore invalid selectors and try the next selector.
      }
    }

    return null;
  }

  function clearSpotlight() {
    if (state.spotlight) state.spotlight.style.display = "none";
    if (state.overlay) state.overlay.style.display = "none";
  }

  function showSpotlight(element) {
    if (!element) {
      clearSpotlight();
      return;
    }

    if (!state.overlay) {
      state.overlay = makeElement("div", "mbt-overlay");
    }

    if (!state.spotlight) {
      state.spotlight = makeElement("div", "mbt-spotlight");
    }

    element.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
      inline: "nearest"
    });

    const position = () => {
      const rect = element.getBoundingClientRect();
      const pad = 5;

      state.spotlight.style.display = "block";
      state.spotlight.style.top = `${Math.max(4, rect.top - pad)}px`;
      state.spotlight.style.left = `${Math.max(4, rect.left - pad)}px`;
      state.spotlight.style.width = `${Math.min(innerWidth - 8, rect.width + pad * 2)}px`;
      state.spotlight.style.height = `${Math.min(innerHeight - 8, rect.height + pad * 2)}px`;
      state.overlay.style.display = "block";
    };

    requestAnimationFrame(position);
    setTimeout(position, 250);
  }

  function ensurePanel() {
    if (state.panel) return;

    state.panel = makeElement("section", "mbt-panel");
    state.panel.setAttribute("role", "dialog");
    state.panel.setAttribute("aria-modal", "false");
    state.panel.setAttribute("aria-label", "MavunoBridge guided tour");

    state.panel.addEventListener("click", handlePanelClick);
    state.panel.addEventListener("change", handlePanelChange);
  }

  function renderSetup() {
    const t = currentWords();

    state.panel.innerHTML = `
      <div class="mbt-topline">
        <div>
          <div class="mbt-eyebrow">MavunoBridge</div>
          <h2 class="mbt-title">${escapeHTML(t.welcome)}</h2>
        </div>
        <button class="mbt-close" data-action="close" aria-label="${escapeHTML(t.close)}">×</button>
      </div>

      <p class="mbt-description">${escapeHTML(t.choose)}</p>

      <div class="mbt-avatar-options">
        ${Object.entries(farmers).map(([id, farmer]) => `
          <button class="mbt-avatar-option"
                  data-avatar="${id}"
                  aria-pressed="${id === state.avatar}">
            ${avatarSVG(id, false)}
            <span>${escapeHTML(farmer.name)}</span>
          </button>
        `).join("")}
      </div>

      <div class="mbt-field">
        <label for="mbt-language">${escapeHTML(t.language)}</label>
        <select id="mbt-language">
          ${Object.entries(t.langs).map(([id, name]) => `
            <option value="${id}" ${id === state.language ? "selected" : ""}>
              ${escapeHTML(name)}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="mbt-field">
        <label for="mbt-voice">${escapeHTML(t.voice)}</label>
        <select id="mbt-voice"></select>
      </div>

      <p class="mbt-note">Voice choices depend on the voices installed in your browser or device.</p>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="start">${escapeHTML(t.start)}</button>
        <button class="mbt-button secondary" data-action="close">${escapeHTML(t.skip)}</button>
      </div>
    `;

    fillVoiceOptions(state.panel.querySelector("#mbt-voice"));
    renderGuide();
  }

  function renderStep() {
    const t = currentWords();
    const steps = getSteps();
    const step = steps[state.step];

    if (!step) {
      renderFinish();
      return;
    }

    state.panel.innerHTML = `
      <div class="mbt-topline">
        <div>
          <div class="mbt-eyebrow">${escapeHTML(t.tour)}</div>
          <h2 class="mbt-title">${escapeHTML(step[0])}</h2>
        </div>
        <button class="mbt-close" data-action="close" aria-label="${escapeHTML(t.close)}">×</button>
      </div>

      <p class="mbt-description">${escapeHTML(step[1])}</p>

      <div class="mbt-step-count">
        ${escapeHTML(t.step)} ${state.step + 1} / ${steps.length}
      </div>

      <div class="mbt-progress" aria-hidden="true">
        <div style="width:${((state.step + 1) / steps.length) * 100}%"></div>
      </div>

      <div class="mbt-field">
        <label for="mbt-language">${escapeHTML(t.language)}</label>
        <select id="mbt-language">
          ${Object.entries(t.langs).map(([id, name]) => `
            <option value="${id}" ${id === state.language ? "selected" : ""}>
              ${escapeHTML(name)}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="mbt-field">
        <label for="mbt-voice">${escapeHTML(t.voice)}</label>
        <select id="mbt-voice"></select>
      </div>

      <div class="mbt-actions">
        <button class="mbt-button secondary" data-action="back"
          ${state.step === 0 ? "disabled" : ""}>${escapeHTML(t.back)}</button>
        <button class="mbt-button" data-action="next">
          ${escapeHTML(state.step === steps.length - 1 ? t.finish : t.next)}
        </button>
        <button class="mbt-button secondary" data-action="close">${escapeHTML(t.skip)}</button>
      </div>
    `;

    fillVoiceOptions(state.panel.querySelector("#mbt-voice"));
    renderGuide();
  }

  function renderFinish() {
    const t = currentWords();

    state.panel.innerHTML = `
      <div class="mbt-topline">
        <div>
          <div class="mbt-eyebrow">MavunoBridge</div>
          <h2 class="mbt-title">${escapeHTML(t.done)}</h2>
        </div>
        <button class="mbt-close" data-action="close" aria-label="${escapeHTML(t.close)}">×</button>
      </div>

      <p class="mbt-description">${escapeHTML(t.doneText)}</p>

      <div class="mbt-actions">
        <button class="mbt-button" data-action="replay">${escapeHTML(t.replay)}</button>
        <button class="mbt-button secondary" data-action="close">${escapeHTML(t.finish)}</button>
      </div>
    `;

    clearSpotlight();
    stopSpeech();
    speak(t.doneText);
    state.active = false;
  }

  function updateStep(shouldSpeak = true) {
    const steps = getSteps();

    if (state.step >= steps.length) {
      renderFinish();
      return;
    }

    renderStep();

    const step = steps[state.step];
    const target = findTarget(step[2]);

    if (target) {
      showSpotlight(target);
    } else {
      clearSpotlight();
    }

    if (shouldSpeak) speak(step[1]);
  }

  function startTour() {
    state.page = detectPage();
    state.step = 0;
    state.active = true;

    stopSpeech();
    createGuide();
    ensurePanel();

    state.panel.style.display = "block";
    state.guide.style.display = "block";

    updateStep(true);
  }

  function openSetup() {
    stopSpeech();
    state.active = false;
    clearSpotlight();
    createGuide();
    ensurePanel();

    state.panel.style.display = "block";
    state.guide.style.display = "block";

    renderSetup();
  }

  function closeTour() {
    stopSpeech();
    state.active = false;
    clearSpotlight();

    if (state.panel) state.panel.style.display = "none";
    if (state.guide) state.guide.style.display = "none";

    if (state.launcher) state.launcher.style.display = "block";
  }

  function nextStep() {
    if (!state.active) return;

    const steps = getSteps();

    if (state.step >= steps.length - 1) {
      localStorage.setItem(STORAGE.completed, "true");
      state.step = steps.length;
      renderFinish();
      return;
    }

    state.step++;
    updateStep(true);
  }

  function previousStep() {
    if (!state.active || state.step <= 0) return;
    state.step--;
    updateStep(true);
  }

  function selectAvatar(id) {
    if (!farmers[id]) return;

    stopSpeech();
    state.avatar = id;
    localStorage.setItem(STORAGE.avatar, id);
    renderGuide();

    if (state.active) {
      renderStep();
      speak(getSteps()[state.step]?.[1] || currentWords().welcome);
    } else if (state.panel) {
      renderSetup();
    }
  }

  function selectLanguage(language) {
    if (!words[language]) return;

    stopSpeech();
    state.language = language;
    localStorage.setItem(STORAGE.language, language);

    if (state.active) {
      updateStep(true);
    } else {
      renderSetup();
    }
  }

  function selectVoice(uri) {
    stopSpeech();
    state.voiceURI = uri;
    localStorage.setItem(STORAGE.voice, uri);

    if (state.active) {
      speak(getSteps()[state.step]?.[1] || currentWords().welcome);
    }
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
      case "close":
        closeTour();
        break;
      case "replay":
        openSetup();
        break;
    }
  }

  function handlePanelChange(event) {
    if (event.target.id === "mbt-language") {
      selectLanguage(event.target.value);
    }

    if (event.target.id === "mbt-voice") {
      selectVoice(event.target.value);
    }
  }

  function createLauncher() {
    if (state.launcher) return;

    state.launcher = makeElement("button", "mbt-launcher");
    state.launcher.type = "button";
    state.launcher.textContent = "🌱 Take a tour";
    state.launcher.addEventListener("click", openSetup);
  }

  function onResize() {
    if (!state.active) return;
    const step = getSteps()[state.step];
    const target = step ? findTarget(step[2]) : null;
    if (target) showSpotlight(target);
  }

  function init() {
    if (!document.body) return;

    addStyles();
    createLauncher();

    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    window.addEventListener("resize", onResize);

    /*
     * Tour does not auto-start. Users can open it using the
     * floating "Take a tour" button.
     *
     * To launch the setup manually from another script:
     * window.MavunoBridgeTour.open()
     *
     * To start directly with the tour:
     * window.MavunoBridgeTour.start()
     */
  }

  window.MavunoBridgeTour = {
    open: openSetup,
    start: startTour,
    close: closeTour,
    next: nextStep,
    back: previousStep,
    replay: openSetup,
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
