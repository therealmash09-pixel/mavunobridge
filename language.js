
"use strict";

/* ==========================================
   MAVUNOBRIDGE — SHARED LANGUAGE SYSTEM
   English | Sheng + Kiswahili | Kiswahili
   ========================================== */

const MAVUNO_LANGUAGE_KEY = "mavunobridge_language_v1";

const MAVUNO_TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search maize, eggs, meat, avocados...",
    search: "Search",
    signIn: "Sign in",
    cart: "Cart",
    marketplace: "Marketplace",
    categories: "Categories",
    sellProduce: "Sell your produce",
    smartAssist: "Smart Assist",
    saccoHub: "SACCO Hub",
    messages: "Messages",
    heroTitle: "From your farm<br>to your next customer.",
    heroDescription: "Connect directly with buyers, discover fresh produce, compare prices and grow your farming business — yote in one place.",
    exploreMarket: "Explore marketplace",
    listProduce: "List your produce",
    sampleListings: "Sample listings",
    countiesKenya: "Counties in Kenya",
    direct: "Direct",
    farmerConnections: "Farmer connections",
    directConnections: "Direct connections",
    connectFarmersBuyers: "Connect buyers and farmers",
    priceAwareness: "Price awareness",
    compareListedPrices: "Compare listed prices",
    localFirst: "Local first",
    kenyanCounties: "Kenyan counties and produce",
    smartFarming: "Smart farming",
    toolsLearning: "Tools and learning support",
    exploreMarketEyebrow: "EXPLORE THE MARKET",
    shopCategory: "Shop by category",
    chooseCategory: "Choose a category to see listed products.",
    viewAllProducts: "View all products →",
    fruits: "Fruits",
    vegetables: "Vegetables",
    nuts: "Nuts",
    starchyFoods: "Starchy foods",
    grains: "Grains",
    cereals: "Cereals",
    legumes: "Legumes",
    spices: "Spices",
    herbalProducts: "Herbal products",
    livestock: "Live livestock",
    livestockProducts: "Livestock products",
    farmInputs: "Farm inputs",
    toolsEquipment: "Tools & equipment",
    farmerServices: "Farmer services",
    plantNext: "Not sure what to plant next?",
    smartAssistDescription: "Explore crop-planning ideas, pest guidance and farm management tips.",
    exploreSmartAssist: "Explore Smart Assist →",
    freshFarm: "FRESH FROM THE FARM",
    marketplaceListings: "Marketplace listings",
    compareProducts: "Compare prices and find products listed by farmers.",
    createListing: "+ Create listing",
    category: "Category",
    county: "County",
    saleType: "Sale type",
    sortBy: "Sort by",
    clearFilters: "Clear filters",
    noListings: "No listings found",
    noListingsHint: "Try another category or county, or create a new listing.",
    forFarmers: "FOR FARMERS & SELLERS",
    haveProduce: "Have produce to sell?",
    addProductDetails: "Add your product details, choose your sale type and let buyers contact you.",
    startListing: "Start a listing →",
    createListingTitle: "Create a listing",
    listingHelp: "Complete the details. Select Both if you sell to retail and bulk buyers.",
    productName: "Product or service name *",
    townArea: "Town / area",
    quantityAvailable: "Quantity available *",
    priceKsh: "Price in KSh *",
    saleTypeHint: "Both means buyers can enquire about retail or bulk quantities.",
    condition: "Condition",
    sellerName: "Your name / farm name *",
    phoneNumber: "Phone number *",
    productPhoto: "Product photo",
    photoHelp: "Optional. Photos are resized to save browser storage.",
    description: "Description",
    cancel: "Cancel",
    publishListing: "Publish listing",
    yourCart: "Your cart",
    demoCart: "Demo cart only. No payment is taken.",
    estimatedTotal: "Estimated total",
    demoCheckout: "Continue to demo checkout",
    footerDescription: "Connecting Kenyan farmers, buyers and agricultural opportunities.",
    demoNotice: "Demo project • Listings and demo messages are stored in this browser.",
    noMessages: "No messages yet",
    send: "Send",
    writeMessage: "Write a message...",
    chooseConversation: "Choose a conversation",
    yourConversations: "Your conversations",
    browseProducts: "Browse products",
    backMarketplace: "← Marketplace",
    chatSeller: "Chat seller",
    addToCart: "Add to cart",
    callSeller: "Call seller",
    deleteListing: "Delete listing",
    retail: "Retail",
    bulk: "Bulk",
    bothSaleTypes: "Retail + Bulk",
    available: "available",
    perUnit: "/ unit",
    loadingListings: "Loading listings..."
  },

  mix: {
    searchPlaceholder: "Tafuta maize, eggs, meat, avocados...",
    search: "Tafuta",
    signIn: "Ingia",
    cart: "Cart",
    marketplace: "Soko",
    categories: "Categories",
    sellProduce: "Uza mazao",
    smartAssist: "Smart Assist",
    saccoHub: "SACCO Hub",
    messages: "Messages",
    heroTitle: "Kutoka shambani<br>moja kwa moja kwa buyer.",
    heroDescription: "Connect na buyers, pata fresh produce, compare prices na grow biashara yako — yote place moja.",
    exploreMarket: "Angalia soko",
    listProduce: "Weka bidhaa",
    sampleListings: "Sample listings",
    countiesKenya: "Counties za Kenya",
    direct: "Direct",
    farmerConnections: "Connections za farmers",
    directConnections: "Direct connections",
    connectFarmersBuyers: "Connect farmers na buyers",
    priceAwareness: "Price comparison",
    compareListedPrices: "Compare prices za listings",
    localFirst: "Local kwanza",
    kenyanCounties: "Counties na bidhaa za Kenya",
    smartFarming: "Smart farming",
    toolsLearning: "Tools na farming tips",
    exploreMarketEyebrow: "ANGALIA SOKO",
    shopCategory: "Shop by category",
    chooseCategory: "Chagua category uone bidhaa farmers wameweka.",
    viewAllProducts: "Angalia bidhaa zote →",
    fruits: "Matunda",
    vegetables: "Mboga",
    nuts: "Karanga na nuts",
    starchyFoods: "Vyakula vya wanga",
    grains: "Grains",
    cereals: "Nafaka",
    legumes: "Mikunde",
    spices: "Viungo",
    herbalProducts: "Bidhaa za mimea",
    livestock: "Mifugo hai",
    livestockProducts: "Bidhaa za mifugo",
    farmInputs: "Farm inputs",
    toolsEquipment: "Tools na equipment",
    farmerServices: "Huduma za farming",
    plantNext: "Hujui upande nini next?",
    smartAssistDescription: "Pata crop ideas, pest tips na guidance ya farming kupitia Smart Assist.",
    exploreSmartAssist: "Fungua Smart Assist →",
    freshFarm: "FRESH FROM THE FARM",
    marketplaceListings: "Bidhaa sokoni",
    compareProducts: "Compare prices au angalia bidhaa farmers wameweka.",
    createListing: "+ Weka listing",
    category: "Category",
    county: "County",
    saleType: "Aina ya sale",
    sortBy: "Panga kwa",
    clearFilters: "Clear filters",
    noListings: "Hakuna listings zimepatikana",
    noListingsHint: "Jaribu category au county ingine, ama weka listing mpya.",
    forFarmers: "FOR FARMERS & SELLERS",
    haveProduce: "Una bidhaa za kuuza?",
    addProductDetails: "Weka details za bidhaa, chagua sale type na buyers wakupate.",
    startListing: "Anza listing →",
    createListingTitle: "Weka listing",
    listingHelp: "Jaza details. Chagua Both kama unauza retail na bulk.",
    productName: "Jina la bidhaa au huduma *",
    townArea: "Town / area",
    quantityAvailable: "Quantity available *",
    priceKsh: "Bei kwa KSh *",
    saleTypeHint: "Both inamaanisha buyers wanaweza kuulizia retail ama bulk.",
    condition: "Condition ya bidhaa",
    sellerName: "Jina lako / jina la shamba *",
    phoneNumber: "Namba ya simu *",
    productPhoto: "Picha ya bidhaa",
    photoHelp: "Si lazima. Picha hupunguzwa size kuokoa browser storage.",
    description: "Maelezo",
    cancel: "Cancel",
    publishListing: "Publish listing",
    yourCart: "Cart yako",
    demoCart: "Demo cart tu. Hakuna payment inafanyika.",
    estimatedTotal: "Total ya makadirio",
    demoCheckout: "Endelea demo checkout",
    footerDescription: "Tunaunganisha farmers, buyers na opportunities za agriculture Kenya.",
    demoNotice: "Demo project • Listings na demo messages zinahifadhiwa kwa browser hii.",
    noMessages: "Hakuna messages bado",
    send: "Tuma",
    writeMessage: "Andika message...",
    chooseConversation: "Chagua chat",
    yourConversations: "Chats zako",
    browseProducts: "Angalia bidhaa",
    backMarketplace: "← Rudi kwa soko",
    chatSeller: "Chat na seller",
    addToCart: "Weka kwa cart",
    callSeller: "Piga seller",
    deleteListing: "Futa listing",
    retail: "Retail",
    bulk: "Bulk",
    bothSaleTypes: "Retail + Bulk",
    available: "ipo",
    perUnit: "/ unit",
    loadingListings: "Inapakia listings..."
  },

  sw: {
    searchPlaceholder: "Tafuta mahindi, mayai, nyama, parachichi...",
    search: "Tafuta",
    signIn: "Ingia",
    cart: "Kikapu",
    marketplace: "Soko",
    categories: "Aina za bidhaa",
    sellProduce: "Uza mazao yako",
    smartAssist: "Msaidizi wa kilimo",
    saccoHub: "Kituo cha SACCO",
    messages: "Ujumbe",
    heroTitle: "Kutoka shambani<br>hadi kwa mteja wako.",
    heroDescription: "Ungana na wanunuzi, pata mazao mapya, linganisha bei na kukuza biashara yako ya kilimo.",
    exploreMarket: "Angalia soko",
    listProduce: "Weka bidhaa yako",
    sampleListings: "Bidhaa za mfano",
    countiesKenya: "Kaunti za Kenya",
    direct: "Moja kwa moja",
    farmerConnections: "Miunganisho ya wakulima",
    directConnections: "Miunganisho ya moja kwa moja",
    connectFarmersBuyers: "Unganisha wakulima na wanunuzi",
    priceAwareness: "Ulinganisho wa bei",
    compareListedPrices: "Linganisha bei za bidhaa",
    localFirst: "Bidhaa za hapa",
    kenyanCounties: "Kaunti na bidhaa za Kenya",
    smartFarming: "Kilimo bora",
    toolsLearning: "Vifaa na maelekezo ya kilimo",
    exploreMarketEyebrow: "ANGALIA SOKO",
    shopCategory: "Nunua kwa aina ya bidhaa",
    chooseCategory: "Chagua aina ya bidhaa kuona zilizowekwa na wakulima.",
    viewAllProducts: "Angalia bidhaa zote →",
    fruits: "Matunda",
    vegetables: "Mboga",
    nuts: "Karanga na njugu",
    starchyFoods: "Vyakula vya wanga",
    grains: "Nafaka za punje",
    cereals: "Nafaka",
    legumes: "Mikunde",
    spices: "Viungo",
    herbalProducts: "Bidhaa za mimea",
    livestock: "Mifugo hai",
    livestockProducts: "Bidhaa za mifugo",
    farmInputs: "Pembejeo za kilimo",
    toolsEquipment: "Zana na vifaa",
    farmerServices: "Huduma za wakulima",
    plantNext: "Hujui cha kupanda baadaye?",
    smartAssistDescription: "Pata mawazo ya mazao, ushauri kuhusu wadudu na vidokezo vya usimamizi wa shamba.",
    exploreSmartAssist: "Fungua msaidizi wa kilimo →",
    freshFarm: "MAZAO MAPYA SHAMBANI",
    marketplaceListings: "Bidhaa zilizowekwa sokoni",
    compareProducts: "Linganisha bei au pata bidhaa zilizowekwa na wakulima.",
    createListing: "+ Weka bidhaa",
    category: "Aina ya bidhaa",
    county: "Kaunti",
    saleType: "Aina ya mauzo",
    sortBy: "Panga kwa",
    clearFilters: "Ondoa vichujio",
    noListings: "Hakuna bidhaa zilizopatikana",
    noListingsHint: "Jaribu aina nyingine au kaunti nyingine, au weka bidhaa mpya.",
    forFarmers: "KWA WAKULIMA NA WAFANYABIASHARA",
    haveProduce: "Una mazao ya kuuza?",
    addProductDetails: "Weka maelezo ya bidhaa, chagua aina ya mauzo na uruhusu wanunuzi wakupate.",
    startListing: "Anza kuweka bidhaa →",
    createListingTitle: "Weka bidhaa sokoni",
    listingHelp: "Jaza maelezo. Chagua Zote ikiwa unauza rejareja na kwa wingi.",
    productName: "Jina la bidhaa au huduma *",
    townArea: "Mji / eneo",
    quantityAvailable: "Kiasi kinachopatikana *",
    priceKsh: "Bei kwa KSh *",
    saleTypeHint: "Zote inaruhusu wanunuzi kuulizia rejareja au kwa wingi.",
    condition: "Hali ya bidhaa",
    sellerName: "Jina lako / jina la shamba *",
    phoneNumber: "Nambari ya simu *",
    productPhoto: "Picha ya bidhaa",
    photoHelp: "Si lazima. Picha hupunguzwa ukubwa ili kuokoa nafasi.",
    description: "Maelezo",
    cancel: "Ghairi",
    publishListing: "Weka bidhaa sokoni",
    yourCart: "Kikapu chako",
    demoCart: "Kikapu cha mfano tu. Hakuna malipo yanayofanyika.",
    estimatedTotal: "Jumla ya makadirio",
    demoCheckout: "Endelea na malipo ya mfano",
    footerDescription: "Kuunganisha wakulima, wanunuzi na fursa za kilimo nchini Kenya.",
    demoNotice: "Mradi wa mfano • Bidhaa na ujumbe huhifadhiwa kwenye kivinjari hiki.",
    noMessages: "Bado hakuna ujumbe",
    send: "Tuma",
    writeMessage: "Andika ujumbe...",
    chooseConversation: "Chagua mazungumzo",
    yourConversations: "Mazungumzo yako",
    browseProducts: "Angalia bidhaa",
    backMarketplace: "← Rudi sokoni",
    chatSeller: "Tuma ujumbe kwa muuzaji",
    addToCart: "Ongeza kikapuni",
    callSeller: "Piga simu kwa muuzaji",
    deleteListing: "Futa bidhaa",
    retail: "Rejareja",
    bulk: "Kwa wingi",
    bothSaleTypes: "Rejareja + kwa wingi",
    available: "inapatikana",
    perUnit: "/ kipimo",
    loadingListings: "Inapakia bidhaa..."
  }
};

/*
  Exact text phrases for pages which don't use data-i18n.
  Message bubbles and user-entered text are deliberately ignored.
*/
const MAVUNO_PAGE_PHRASES = [
  ["← Marketplace", "← Rudi kwa soko", "← Rudi sokoni"],
  ["← Back to marketplace", "← Rudi kwa soko", "← Rudi sokoni"],
  ["Good things grow when we connect.", "Biashara hukua tukiconnect.", "Mambo mazuri hukua tunapoungana."],
  ["Welcome back", "Karibu tena", "Karibu tena"],
  ["Sign in to continue to MavunoBridge.", "Ingia uendelee na MavunoBridge.", "Ingia ili kuendelea na MavunoBridge."],
  ["Continue with Google", "Endelea na Google", "Endelea na Google"],
  ["OR", "AMA", "AU"],
  ["Your name", "Jina lako", "Jina lako"],
  ["Email address", "Email yako", "Anwani ya barua pepe"],
  ["I am joining as", "Najiunga kama", "Ninajiunga kama"],
  ["Buyer", "Buyer", "Mnunuzi"],
  ["Farmer / Seller", "Farmer / Seller", "Mkulima / Muuzaji"],
  ["Both", "Both", "Wote"],
  ["Continue to marketplace", "Endelea kwa soko", "Endelea kwenye soko"],
  ["Continue browsing without signing in", "Endelea kuangalia bila kuingia", "Endelea kuvinjari bila kuingia"],
  ["YOUR FARM. YOUR MARKET.", "SHAMBA YAKO. SOKO YAKO.", "SHAMBA LAKO. SOKO LAKO."],
  ["MADE FOR KENYAN AGRICULTURE", "MADE FOR KENYAN AGRICULTURE", "IMEUNDWA KWA KILIMO CHA KENYA"],
  ["YOUR DIGITAL FARMING COMPANION", "Msaidizi wako wa farming", "Msaidizi wako wa kilimo"],
  ["Smarter decisions.", "Fanya maamuzi smart.", "Fanya maamuzi bora."],
  ["Better harvests.", "Harvest nzuri zaidi.", "Mavuno bora zaidi."],
  ["Tell us about your farm", "Tuambie kuhusu shamba lako", "Tuambie kuhusu shamba lako"],
  ["Farm knowledge corner", "Farm tips", "Kona ya maarifa ya kilimo"],
  ["Soil health", "Soil health", "Afya ya udongo"],
  ["Pest scouting", "Ku-check pests", "Kuchunguza wadudu"],
  ["Water management", "Water management", "Usimamizi wa maji"],
  ["Generate farm tips →", "Pata farm tips →", "Pata vidokezo vya kilimo →"],
  ["GROW TOGETHER", "Tukue pamoja", "Tukue pamoja"],
  ["Discover opportunities", "Pata opportunities", "Gundua fursa"],
  ["Find your next opportunity", "Pata opportunity yako next", "Pata fursa yako inayofuata"],
  ["Save interest", "Save interest", "Hifadhi nia"],
  ["Saved interests", "Opportunities ulizohifadhi", "Fursa ulizohifadhi"],
  ["STAY CONNECTED", "Tuendelee kuconnect", "Endelea kuwasiliana"],
  ["Your conversations", "Chats zako", "Mazungumzo yako"],
  ["Choose a conversation", "Chagua chat", "Chagua mazungumzo"],
  ["Select a sample contact to begin.", "Chagua contact ya demo uanze.", "Chagua mtu wa mfano kuanza."],
  ["Browse products", "Angalia bidhaa", "Angalia bidhaa"],
  ["Send", "Tuma", "Tuma"],
  ["Write a message...", "Andika message...", "Andika ujumbe..."],
  ["Demo contact is typing...", "Demo contact anaandika...", "Mtu wa mfano anaandika..."],
  ["Demo seller", "Demo seller", "Muuzaji wa mfano"],
  ["Automatic demo reply", "Jibu la demo", "Jibu la mfano"],
  ["Demo conversations with buyers and farmers.", "Chats za demo na buyers na farmers.", "Mazungumzo ya mfano na wanunuzi na wakulima."],
  ["DEMO MODE · NOT A LIVE WEATHER FORECAST", "DEMO MODE · SI LIVE WEATHER", "MFANO TU · SI UTabiri HALISI WA HALI YA HEWA"]
];

function getLanguage() {
  try {
    const saved = localStorage.getItem(MAVUNO_LANGUAGE_KEY);
    return ["en", "mix", "sw"].includes(saved) ? saved : "mix";
  } catch (_) {
    return "mix";
  }
}

let currentLanguage = getLanguage();

function phraseIndex() {
  const index = new Map();

  MAVUNO_PAGE_PHRASES.forEach(([en, mix, sw]) => {
    const entry = { en, mix, sw };
    [en, mix, sw].forEach((phrase) => {
      if (!index.has(phrase)) index.set(phrase, entry);
    });
  });

  return index;
}

function translateStaticElements(language) {
  const dictionary = MAVUNO_TRANSLATIONS[language] || MAVUNO_TRANSLATIONS.mix;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (
      dictionary[key] !== undefined &&
      element.innerHTML !== dictionary[key]
    ) {
      element.innerHTML = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;

    if (
      dictionary[key] !== undefined &&
      element.placeholder !== dictionary[key]
    ) {
      element.placeholder = dictionary[key];
    }
  });
}

function translateTextNodes(language) {
  const index = phraseIndex();
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];

  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;

    if (parent.closest(
      "script, style, textarea, input, [contenteditable='true'], .message-bubble, [data-i18n]"
    )) {
      return;
    }

    const original = node.nodeValue;
    const trimmed = original.trim();
    const translation = index.get(trimmed);

    if (!translation) return;

    const next = translation[language] || translation.en;

    if (next !== trimmed) {
      node.nodeValue = original.replace(trimmed, next);
    }
  });
}

function applyLanguage(language) {
  if (!["en", "mix", "sw"].includes(language)) {
    language = "mix";
  }

  currentLanguage = language;

  try {
    localStorage.setItem(MAVUNO_LANGUAGE_KEY, language);
  } catch (error) {
    console.warn("Could not save language preference:", error);
  }

  document.documentElement.lang = language === "sw" ? "sw" : "en";

  const selector = document.querySelector("#languageSelect");
  if (selector) selector.value = language;

  translateStaticElements(language);
  translateTextNodes(language);

  document.dispatchEvent(new CustomEvent("mavuno:languagechange", {
    detail: { language }
  }));
}

window.MavunoBridgeLanguage = {
  get current() {
    return currentLanguage;
  },

  t(key) {
    return (MAVUNO_TRANSLATIONS[currentLanguage] || MAVUNO_TRANSLATIONS.mix)[key]
      || MAVUNO_TRANSLATIONS.en[key]
      || key;
  },

  set: applyLanguage
};

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.querySelector("#languageSelect");

  if (selector) {
    selector.value = currentLanguage;
    selector.addEventListener("change", () => {
      applyLanguage(selector.value);
    });
  }

  applyLanguage(currentLanguage);

  // Translate interface labels that are created after page load.
  const observer = new MutationObserver(() => {
    translateStaticElements(currentLanguage);
    translateTextNodes(currentLanguage);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
