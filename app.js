"use strict";

/* ==========================================
   SHAMBAMARKET — MAIN APP
   Frontend demo. Supabase comes next.
========================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORAGE = {
  language: "shambamarket_language",
  likes: "shambamarket_likes",
  listings: "shambamarket_demo_listings",
  favourites: "shambamarket_favourites"
};

const translations = {
  mix: {
    tagline: "Shamba yako, soko yako.",
    navHome: "Home",
    navMarket: "Marketplace",
    navAssistant: "Shamba Assistant",
    navCommunity: "Community",
    login: "Login",
    searchPlaceholder: "Search maize, mbolea, ng'ombe...",
    allCategories: "Everything",
    produce: "Farm Produce",
    inputs: "Farm Inputs",
    livestock: "Livestock",
    saccos: "SACCOs",
    opportunities: "Opportunities",
    search: "Search Soko",
    searchHint: "Tafuta bidhaa, livestock, farm inputs na opportunities.",
    heroEyebrow: "BUILT FOR KENYAN FARMERS",
    heroTitle: "Your shamba. Your market. <span>Your opportunity.</span>",
    heroText: "Buy, sell and grow pamoja. Pata farm produce, agricultural inputs, livestock na farming opportunities kwa one place.",
    exploreMarket: "Explore marketplace ↗",
    listItem: "+ List bidhaa yako",
    easyToUse: "Easy to use",
    madeForKenya: "Made for Kenya",
    farmerFirst: "Farmer-first",
    lessHassle: "Less hassle, more connections",
    farmSmarter: "Farm smarter",
    weatherCropTips: "Weather and crop insights",
    oneBigMarket: "ONE BIG AGRI-MARKET",
    marketTitle: "Soko iko open 🌱",
    marketSubtitle: "Chagua category uone what's available.",
    viewAll: "View all listings ↗",
    produceDesc: "Fruits, vegetables, grains na more",
    inputsDesc: "Seeds, tools, fertilizer na equipment",
    livestockDesc: "Cattle, goats, poultry na more",
    allItems: "All items",
    noResults: "Hakuna results zimepatikana",
    tryAnotherSearch: "Try search ingine au badilisha category.",
    demoNote: "Demo listings: prices and availability are examples. Real listings will come from Supabase.",
    smartFarming: "SMART FARMING",
    assistantTitle: "Shamba Assistant 🌦️",
    assistantText: "Usipande tu kubahatisha. Get weather information, crop guidance na alerts za pests zinazoweza kuathiri shamba yako.",
    weatherTitle: "Weather forecast",
    weatherDesc: "Check current and upcoming weather.",
    cropTitle: "Crop Advisor",
    cropDesc: "Explore crops suited to your area.",
    pestTitle: "Pest Watch",
    pestDesc: "Learn about local pest and disease risks.",
    openAssistant: "Open Shamba Assistant ↗",
    farmInsights: "Farm insights",
    preview: "PREVIEW",
    selectArea: "Chagua county yako",
    selectAreaHint: "Select area yako ili tuanze kuandaa farming insights.",
    adviceDisclaimer: "Crop advice needs real weather and agricultural data. This preview does not make live forecasts.",
    growTogether: "GROW TOGETHER",
    communityTitle: "Connections za wakulima 🤝",
    communitySubtitle: "Find support, learn skills na discover opportunities.",
    farmerCoops: "FARMER CO-OPS",
    saccoTitle: "Local SACCOs",
    saccoText: "Discover agricultural SACCOs, check membership details na express interest kujoin.",
    findSaccos: "Find SACCOs ↗",
    newPossibilities: "NEW POSSIBILITIES",
    opportunityTitle: "Opportunities",
    opportunityText: "Training, grants, farmer programs na agricultural competitions.",
    findOpportunities: "Explore opportunities ↗",
    saccoDirectoryTitle: "SACCO directory",
    opportunityDirectoryTitle: "Opportunities board",
    directoryDemo: "Verified local listings will appear here when the directory is connected.",
    opportunityDemo: "Training and funding opportunities will appear here.",
    gotSomethingToSell: "GOT SOMETHING TO SELL?",
    sellTitle: "Let the market find you.",
    sellText: "List produce, farm inputs ama livestock yako.",
    startListing: "Start listing ↗",
    footerTagline: "Growing pamoja.",
    footerText: "Connecting farmers, buyers and opportunities across Kenya.",
    sellerCorner: "SELLER CORNER",
    createListing: "Create listing",
    listingDemoNote: "This is a local demo form. Publishing real listings requires Supabase setup.",
    listingCategory: "What are you listing?",
    productName: "Product name",
    priceKsh: "Price (KSh)",
    location: "Location",
    photoUrl: "Photo URL (optional)",
    description: "Description",
    cancel: "Cancel",
    previewListing: "Preview listing",
    welcomeBack: "Karibu tena!",
    loginSetupNote: "Account login itaunganishwa na Supabase katika next step.",
    okay: "Sawa, got it",
    contact: "Contact",
    liked: "Ume-like listing ❤️",
    unliked: "Like imeondolewa.",
    saved: "Listing imehifadhiwa kwa favourites.",
    removed: "Imeondolewa kwa favourites.",
    loginRequired: "Login itawekwa baada ya Supabase integration.",
    listingPreviewed: "Demo listing imeongezwa kwenye page!",
    invalidPrice: "Weka price sahihi tafadhali.",
    locationNeeded: "Weka location ya bidhaa.",
    photoError: "Photo URL haiko valid. Acha blank ama tumia HTTPS URL.",
    chooseCounty: "Chagua county kwanza.",
    insightDemo: "County yako: {county}. Live weather, crop recommendations na pest alerts zitaongezwa tukiconnect real data sources.",
    searchCount: "{count} listings zimepatikana.",
    imageAlt: "Product photo",
    perUnit: "per listing",
    listingDemo: "Demo listing",
    defaultDescription: "Contact seller upate details zaidi.",
    unavailable: "Unavailable",
    browseCategory: "Angalia category",
    menuOpened: "Menu imefunguliwa.",
    formError: "Kuna shida kwa form. Check details zako.",
    contactDemo: "Messaging itaunganishwa na Supabase katika next step.",
    sampleSacco: "Sample SACCO directory",
    sampleOpportunity: "Sample opportunity board"
  },

  en: {
    tagline: "Your farm, your marketplace.",
    navHome: "Home",
    navMarket: "Marketplace",
    navAssistant: "Farm Assistant",
    navCommunity: "Community",
    login: "Login",
    searchPlaceholder: "Search maize, fertilizer, cattle...",
    allCategories: "Everything",
    produce: "Farm Produce",
    inputs: "Farm Inputs",
    livestock: "Livestock",
    saccos: "SACCOs",
    opportunities: "Opportunities",
    search: "Search",
    searchHint: "Find produce, livestock, farm supplies and opportunities.",
    heroEyebrow: "BUILT FOR KENYAN FARMERS",
    heroTitle: "Your farm. Your market. <span>Your opportunity.</span>",
    heroText: "Buy, sell and grow together. Find farm produce, agricultural inputs, livestock and farming opportunities in one place.",
    exploreMarket: "Explore marketplace ↗",
    listItem: "+ List an item",
    easyToUse: "Easy to use",
    madeForKenya: "Made for Kenya",
    farmerFirst: "Farmer-first",
    lessHassle: "Less hassle, more connections",
    farmSmarter: "Farm smarter",
    weatherCropTips: "Weather and crop insights",
    oneBigMarket: "ONE BIG AGRI-MARKET",
    marketTitle: "The marketplace is open 🌱",
    marketSubtitle: "Choose a category to see what's available.",
    viewAll: "View all listings ↗",
    produceDesc: "Fruits, vegetables, grains and more",
    inputsDesc: "Seeds, tools, fertilizers and equipment",
    livestockDesc: "Cattle, goats, poultry and more",
    allItems: "All items",
    noResults: "No results found",
    tryAnotherSearch: "Try another search or change your category.",
    demoNote: "Demo listings: prices and availability are examples. Real listings will come from Supabase.",
    smartFarming: "SMART FARMING",
    assistantTitle: "Farm Assistant 🌦️",
    assistantText: "Make informed farming decisions with weather information, crop guidance and alerts about pests that may affect your farm.",
    weatherTitle: "Weather forecast",
    weatherDesc: "Check current and upcoming weather.",
    cropTitle: "Crop Advisor",
    cropDesc: "Explore crops suited to your area.",
    pestTitle: "Pest Watch",
    pestDesc: "Learn about local pest and disease risks.",
    openAssistant: "Open Farm Assistant ↗",
    farmInsights: "Farm insights",
    preview: "PREVIEW",
    selectArea: "Select your county",
    selectAreaHint: "Select your area to start exploring farming insights.",
    adviceDisclaimer: "Crop advice requires real weather and agricultural data. This preview does not make live forecasts.",
    growTogether: "GROW TOGETHER",
    communityTitle: "Farmer connections 🤝",
    communitySubtitle: "Find support, learn skills and discover opportunities.",
    farmerCoops: "FARMER CO-OPS",
    saccoTitle: "Local SACCOs",
    saccoText: "Discover agricultural SACCOs, review membership details and express interest in joining.",
    findSaccos: "Find SACCOs ↗",
    newPossibilities: "NEW POSSIBILITIES",
    opportunityTitle: "Opportunities",
    opportunityText: "Training, grants, farmer programs and agricultural competitions.",
    findOpportunities: "Explore opportunities ↗",
    saccoDirectoryTitle: "SACCO directory",
    opportunityDirectoryTitle: "Opportunities board",
    directoryDemo: "Verified local listings will appear here when the directory is connected.",
    opportunityDemo: "Training and funding opportunities will appear here.",
    gotSomethingToSell: "HAVE SOMETHING TO SELL?",
    sellTitle: "Let the market find you.",
    sellText: "List your produce, farm inputs or livestock.",
    startListing: "Start listing ↗",
    footerTagline: "Growing together.",
    footerText: "Connecting farmers, buyers and opportunities across Kenya.",
    sellerCorner: "SELLER CORNER",
    createListing: "Create listing",
    listingDemoNote: "This is a local demo form. Publishing real listings requires Supabase setup.",
    listingCategory: "What are you listing?",
    productName: "Product name",
    priceKsh: "Price (KSh)",
    location: "Location",
    photoUrl: "Photo URL (optional)",
    description: "Description",
    cancel: "Cancel",
    previewListing: "Preview listing",
    welcomeBack: "Welcome back!",
    loginSetupNote: "Account login will be connected to Supabase in the next step.",
    okay: "Okay, got it",
    contact: "Contact",
    liked: "Listing liked ❤️",
    unliked: "Like removed.",
    saved: "Listing saved to favourites.",
    removed: "Removed from favourites.",
    loginRequired: "Login will be added after Supabase integration.",
    listingPreviewed: "Demo listing added to the page!",
    invalidPrice: "Please enter a valid price.",
    locationNeeded: "Please enter the item's location.",
    photoError: "Invalid photo URL. Leave blank or use an HTTPS URL.",
    chooseCounty: "Please select a county first.",
    insightDemo: "Your county: {county}. Live weather, crop recommendations and pest alerts will be added when real data sources are connected.",
    searchCount: "{count} listings found.",
    imageAlt: "Product photo",
    perUnit: "per listing",
    listingDemo: "Demo listing",
    defaultDescription: "Contact the seller for more details.",
    unavailable: "Unavailable",
    browseCategory: "Browse category",
    menuOpened: "Menu opened.",
    formError: "There is a problem with the form. Check your details.",
    contactDemo: "Messaging will be connected to Supabase in the next step.",
    sampleSacco: "Sample SACCO directory",
    sampleOpportunity: "Sample opportunity board"
  },

  sw: {
    tagline: "Shamba lako, soko lako.",
    navHome: "Nyumbani",
    navMarket: "Soko",
    navAssistant: "Msaidizi wa Kilimo",
    navCommunity: "Jumuiya",
    login: "Ingia",
    searchPlaceholder: "Tafuta mahindi, mbolea, ng'ombe...",
    allCategories: "Bidhaa zote",
    produce: "Mazao",
    inputs: "Vifaa vya Kilimo",
    livestock: "Mifugo",
    saccos: "SACCO",
    opportunities: "Fursa",
    search: "Tafuta",
    searchHint: "Tafuta mazao, mifugo, vifaa vya kilimo na fursa.",
    heroEyebrow: "IMEUNDWA KWA WAKULIMA WA KENYA",
    heroTitle: "Shamba lako. Soko lako. <span>Fursa yako.</span>",
    heroText: "Nunua, uza na uendelee pamoja. Pata mazao, vifaa vya kilimo, mifugo na fursa za kilimo mahali pamoja.",
    exploreMarket: "Angalia soko ↗",
    listItem: "+ Tangaza bidhaa",
    easyToUse: "Rahisi kutumia",
    madeForKenya: "Kwa Kenya",
    farmerFirst: "Mkulima kwanza",
    lessHassle: "Rahisi kupata wateja",
    farmSmarter: "Lima kwa maarifa",
    weatherCropTips: "Hali ya hewa na mazao",
    oneBigMarket: "SOKO LA KILIMO",
    marketTitle: "Soko liko wazi 🌱",
    marketSubtitle: "Chagua kundi kuona bidhaa zilizopo.",
    viewAll: "Angalia bidhaa zote ↗",
    produceDesc: "Matunda, mboga, nafaka na zaidi",
    inputsDesc: "Mbegu, vifaa, mbolea na mashine",
    livestockDesc: "Ng'ombe, mbuzi, kuku na zaidi",
    allItems: "Bidhaa zote",
    noResults: "Hakuna matokeo",
    tryAnotherSearch: "Jaribu utafutaji mwingine au badilisha kundi.",
    demoNote: "Hizi ni bidhaa za mfano. Bei na upatikanaji si taarifa zilizothibitishwa.",
    smartFarming: "KILIMO CHA KISASA",
    assistantTitle: "Msaidizi wa Kilimo 🌦️",
    assistantText: "Tumia taarifa za hali ya hewa, ushauri wa mazao na tahadhari za wadudu kufanya maamuzi bora.",
    weatherTitle: "Utabiri wa hali ya hewa",
    weatherDesc: "Angalia hali ya hewa ya sasa na ijayo.",
    cropTitle: "Ushauri wa mazao",
    cropDesc: "Gundua mazao yanayofaa eneo lako.",
    pestTitle: "Tahadhari za wadudu",
    pestDesc: "Jifunze kuhusu hatari za wadudu na magonjwa.",
    openAssistant: "Fungua msaidizi ↗",
    farmInsights: "Taarifa za shamba",
    preview: "MFANO",
    selectArea: "Chagua kaunti yako",
    selectAreaHint: "Chagua eneo lako kupata taarifa za kilimo.",
    adviceDisclaimer: "Ushauri wa mazao unahitaji data halisi. Huu si utabiri wa moja kwa moja.",
    growTogether: "TUKUE PAMOJA",
    communityTitle: "Mahusiano ya wakulima 🤝",
    communitySubtitle: "Pata msaada, jifunze na ugundue fursa.",
    farmerCoops: "VYAMA VYA WAKULIMA",
    saccoTitle: "SACCO za eneo lako",
    saccoText: "Gundua SACCO za kilimo na upate taarifa za kujiunga.",
    findSaccos: "Tafuta SACCO ↗",
    newPossibilities: "FURSA MPYA",
    opportunityTitle: "Fursa",
    opportunityText: "Mafunzo, ufadhili, programu za wakulima na mashindano.",
    findOpportunities: "Angalia fursa ↗",
    saccoDirectoryTitle: "Orodha ya SACCO",
    opportunityDirectoryTitle: "Orodha ya fursa",
    directoryDemo: "SACCO zilizothibitishwa zitaonekana hapa baada ya kuunganisha orodha.",
    opportunityDemo: "Mafunzo na ufadhili vitaonekana hapa.",
    gotSomethingToSell: "UNA BIDHAA YA KUUZA?",
    sellTitle: "Wateja wakupate.",
    sellText: "Tangaza mazao, vifaa vya kilimo au mifugo yako.",
    startListing: "Anza kutangaza ↗",
    footerTagline: "Tunakua pamoja.",
    footerText: "Tunaunganisha wakulima, wanunuzi na fursa nchini Kenya.",
    sellerCorner: "SEHEMU YA MUUZAJI",
    createListing: "Tangaza bidhaa",
    listingDemoNote: "Hii ni fomu ya majaribio. Kutangaza bidhaa halisi kunahitaji Supabase.",
    listingCategory: "Unatangaza nini?",
    productName: "Jina la bidhaa",
    priceKsh: "Bei (KSh)",
    location: "Eneo",
    photoUrl: "Kiungo cha picha (si lazima)",
    description: "Maelezo",
    cancel: "Ghairi",
    previewListing: "Onyesha mfano",
    welcomeBack: "Karibu tena!",
    loginSetupNote: "Kuingia kwenye akaunti kutaunganishwa na Supabase baadaye.",
    okay: "Sawa",
    contact: "Wasiliana",
    liked: "Umependa tangazo ❤️",
    unliked: "Like imeondolewa.",
    saved: "Tangazo limehifadhiwa.",
    removed: "Tangazo limeondolewa kwenye zilizohifadhiwa.",
    loginRequired: "Kuingia kutaongezwa baada ya Supabase.",
    listingPreviewed: "Tangazo la mfano limeongezwa!",
    invalidPrice: "Weka bei sahihi.",
    locationNeeded: "Weka eneo la bidhaa.",
    photoError: "Kiungo cha picha si sahihi. Tumia HTTPS au acha wazi.",
    chooseCounty: "Chagua kaunti kwanza.",
    insightDemo: "Kaunti yako: {county}. Utabiri wa hali ya hewa na ushauri wa mazao utaongezwa data halisi ikiunganishwa.",
    searchCount: "Matangazo {count} yamepatikana.",
    imageAlt: "Picha ya bidhaa",
    perUnit: "kwa tangazo",
    listingDemo: "Tangazo la mfano",
    defaultDescription: "Wasiliana na muuzaji kupata maelezo zaidi.",
    unavailable: "Haipatikani",
    browseCategory: "Angalia kundi",
    menuOpened: "Menyu imefunguliwa.",
    formError: "Kuna tatizo. Kagua taarifa ulizoweka.",
    contactDemo: "Ujumbe utaunganishwa na Supabase baadaye.",
    sampleSacco: "Orodha ya mfano ya SACCO",
    sampleOpportunity: "Orodha ya mfano ya fursa"
  },

  sheng: {
    tagline: "Shamba yako, soko yako.",
    navHome: "Home",
    navMarket: "Soko",
    navAssistant: "Shamba Help",
    navCommunity: "Community",
    login: "Login",
    searchPlaceholder: "Tafuta maize, mbolea, ng'ombe...",
    allCategories: "Everything",
    produce: "Mazao",
    inputs: "Farm Inputs",
    livestock: "Mifugo",
    saccos: "SACCOs",
    opportunities: "Opportunities",
    search: "Tafuta",
    searchHint: "Tafuta stock, mifugo na vitu za shamba.",
    heroEyebrow: "MADE FOR KENYAN FARMERS",
    heroTitle: "Shamba yako. Soko yako. <span>Chance yako.</span>",
    heroText: "Nunua, uza na ujipange. Pata mazao, farm inputs, mifugo na opportunities place moja.",
    exploreMarket: "Check soko ↗",
    listItem: "+ List stock yako",
    easyToUse: "Easy kutumia",
    madeForKenya: "Made for Kenya",
    farmerFirst: "Farmer kwanza",
    lessHassle: "Connections bila stress",
    farmSmarter: "Lima smart",
    weatherCropTips: "Weather na crop tips",
    oneBigMarket: "AGRI-MARKET",
    marketTitle: "Soko iko live 🌱",
    marketSubtitle: "Chagua category uone stock iko aje.",
    viewAll: "Angalia zote ↗",
    produceDesc: "Fruits, mboga, grains na zingine",
    inputsDesc: "Seeds, tools, mbolea na equipment",
    livestockDesc: "Ng'ombe, mbuzi, kuku na zingine",
    allItems: "Zote",
    noResults: "Hakuna kitu imepatikana",
    tryAnotherSearch: "Try search ingine ama change category.",
    demoNote: "Hizi ni demo listings. Prices si confirmed.",
    smartFarming: "SMART FARMING",
    assistantTitle: "Shamba Help 🌦️",
    assistantText: "Pata weather info, crop tips na alerts za pests zinazoweza kusumbua shamba yako.",
    weatherTitle: "Weather forecast",
    weatherDesc: "Check weather ya sasa na inayokuja.",
    cropTitle: "Crop Advisor",
    cropDesc: "Angalia crops zinafit area yako.",
    pestTitle: "Pest Watch",
    pestDesc: "Jua pests na diseases za kuwatch.",
    openAssistant: "Fungua Shamba Help ↗",
    farmInsights: "Farm insights",
    preview: "PREVIEW",
    selectArea: "Chagua county yako",
    selectAreaHint: "Chagua area yako tuanze na farm insights.",
    adviceDisclaimer: "Live weather na crop advice zitahitaji real data. Hii si live forecast.",
    growTogether: "GROW PAMOJA",
    communityTitle: "Farmer connections 🤝",
    communitySubtitle: "Pata support, skills na opportunities.",
    farmerCoops: "FARMER GROUPS",
    saccoTitle: "Local SACCOs",
    saccoText: "Discover SACCOs za kilimo na ucheck vile unaeza kujoin.",
    findSaccos: "Tafuta SACCO ↗",
    newPossibilities: "NEW CHANCES",
    opportunityTitle: "Opportunities",
    opportunityText: "Training, grants, programs na agri competitions.",
    findOpportunities: "Check opportunities ↗",
    saccoDirectoryTitle: "SACCO directory",
    opportunityDirectoryTitle: "Opportunities board",
    directoryDemo: "Verified listings zitaonekana tukiconnect directory.",
    opportunityDemo: "Training na funding zitaonekana hapa.",
    gotSomethingToSell: "UKO NA STOCK YA KUUZA?",
    sellTitle: "Market ikupate.",
    sellText: "List mazao, farm inputs ama mifugo yako.",
    startListing: "Anza ku-list ↗",
    footerTagline: "Tunagrow pamoja.",
    footerText: "Tuna-connect farmers, buyers na opportunities Kenya.",
    sellerCorner: "SELLER CORNER",
    createListing: "Create listing",
    listingDemoNote: "Hii ni demo form. Real listings zitahitaji Supabase.",
    listingCategory: "Una-list nini?",
    productName: "Product name",
    priceKsh: "Price (KSh)",
    location: "Location",
    photoUrl: "Photo URL (optional)",
    description: "Description",
    cancel: "Cancel",
    previewListing: "Preview listing",
    welcomeBack: "Karibu tena!",
    loginSetupNote: "Login ita-connect na Supabase next step.",
    okay: "Sawa",
    contact: "Contact",
    liked: "Ume-like listing ❤️",
    unliked: "Like imeondolewa.",
    saved: "Listing imehifadhiwa.",
    removed: "Imeondolewa kwa favourites.",
    loginRequired: "Login itawekwa baada ya Supabase.",
    listingPreviewed: "Demo listing imeongezwa!",
    invalidPrice: "Weka price poa tafadhali.",
    locationNeeded: "Weka location ya bidhaa.",
    photoError: "Photo URL si valid. Tumia HTTPS ama acha blank.",
    chooseCounty: "Chagua county kwanza.",
    insightDemo: "County yako ni {county}. Live weather na crop tips zitaongezwa tukiconnect real data.",
    searchCount: "Listings {count} zimepatikana.",
    imageAlt: "Picha ya bidhaa",
    perUnit: "per listing",
    listingDemo: "Demo listing",
    defaultDescription: "Contact seller upate details.",
    unavailable: "Haiko available",
    browseCategory: "Angalia category",
    menuOpened: "Menu iko open.",
    formError: "Kuna shida kwa form. Check details.",
    contactDemo: "Messaging ita-connect na Supabase next step.",
    sampleSacco: "Sample SACCO directory",
    sampleOpportunity: "Sample opportunity board"
  }
};

/* ------------------------------------------
   DEMO DATA
   These are illustrative listings, not real
   offers. Supabase will replace this data.
------------------------------------------ */

const demoListings = [
  {
    id: "demo-maize",
    type: "produce",
    name: "Fresh Maize",
    price: 2500,
    unit: "per bag",
    location: "Nakuru, Kenya",
    description: "Fresh maize. Confirm quantity with seller.",
    image: "https://images.unsplash.com/photo-1601593768797-4f3d7e9f1f54?auto=format&fit=crop&w=700&q=80",
    fallback: "🌽"
  },
  {
    id: "demo-avocado",
    type: "produce",
    name: "Fresh Avocados",
    price: 120,
    unit: "per kg",
    location: "Murang'a, Kenya",
    description: "Avocados available. Sample listing.",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
    fallback: "🥑"
  },
  {
    id: "demo-beans",
    type: "produce",
    name: "Dry Beans",
    price: 180,
    unit: "per kg",
    location: "Kirinyaga, Kenya",
    description: "Dry beans. Confirm stock and grade.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80",
    fallback: "🫘"
  },
  {
    id: "demo-tomatoes",
    type: "produce",
    name: "Fresh Tomatoes",
    price: 90,
    unit: "per kg",
    location: "Kiambu, Kenya",
    description: "Fresh tomatoes. Sample market price.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
    fallback: "🍅"
  },
  {
    id: "demo-fertilizer",
    type: "inputs",
    name: "Farm Fertilizer",
    price: 3200,
    unit: "per bag",
    location: "Nairobi, Kenya",
    description: "Check product type and packaging before buying.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80",
    fallback: "🧪"
  },
  {
    id: "demo-seeds",
    type: "inputs",
    name: "Vegetable Seeds",
    price: 250,
    unit: "per pack",
    location: "Kiambu, Kenya",
    description: "Check variety, expiry and suitability for your area.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=700&q=80",
    fallback: "🌱"
  },
  {
    id: "demo-tools",
    type: "inputs",
    name: "Farm Tools",
    price: 800,
    unit: "per item",
    location: "Nairobi, Kenya",
    description: "Sample farm tools listing.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80",
    fallback: "🛠️"
  },
  {
    id: "demo-cow",
    type: "livestock",
    name: "Dairy Cow",
    price: 65000,
    unit: "per animal",
    location: "Kiambu, Kenya",
    description: "Illustrative listing. Verify breed, health and ownership.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80",
    fallback: "🐄"
  },
  {
    id: "demo-goats",
    type: "livestock",
    name: "Farm Goats",
    price: 8500,
    unit: "per animal",
    location: "Nakuru, Kenya",
    description: "Illustrative listing. Ask seller about age and health.",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=700&q=80",
    fallback: "🐐"
  },
  {
    id: "demo-chicken",
    type: "livestock",
    name: "Kienyeji Chicken",
    price: 1200,
    unit: "per bird",
    location: "Machakos, Kenya",
    description: "Illustrative listing. Confirm availability with seller.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=80",
    fallback: "🐔"
  },
  {
    id: "demo-sheep",
    type: "livestock",
    name: "Farm Sheep",
    price: 9000,
    unit: "per animal",
    location: "Nyeri, Kenya",
    description: "Illustrative listing. Confirm age and health.",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=80",
    fallback: "🐑"
  }
];

let activeFilter = "all";
let searchTerm = "";
let toastTimeout;

/* ------------------------------------------
   Storage helpers
------------------------------------------ */

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Storage haipatikani kwa browser hii.");
    return false;
  }
}

function getLikes() {
  return readStorage(STORAGE.likes, []);
}

function getFavourites() {
  return readStorage(STORAGE.favourites, []);
}

function getCustomListings() {
  return readStorage(STORAGE.listings, []);
}

/* ------------------------------------------
   Safe HTML and translations
------------------------------------------ */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function t(key, values = {}) {
  const language = translations[currentLanguage] || translations.mix;
  let output = language[key] ?? translations.mix[key] ?? key;

  Object.entries(values).forEach(([name, value]) => {
    output = output.replaceAll(`{${name}}`, String(value));
  });

  return output;
}

let currentLanguage = "mix";

function setLanguage(language) {
  if (!translations[language]) language = "mix";

  currentLanguage = language;

  try {
    localStorage.setItem(STORAGE.language, language);
  } catch {
    // The app can still work for this page session.
  }

  document.documentElement.lang =
    language === "en" ? "en" : "sw";

  applyTranslations();
  renderListings();
  renderDirectories();
}

function applyTranslations() {
  $$("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (translations[currentLanguage]?.[key] !== undefined ||
        translations.mix[key] !== undefined) {
      element.innerHTML = t(key);
    }
  });

  $$("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  const select = $("#languageSelect");
  if (select) select.value = currentLanguage;

  updateResultsCount();
}

/* ------------------------------------------
   Listings and search
------------------------------------------ */

function getAllListings() {
  return [...getCustomListings(), ...demoListings];
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
}

function getCategoryLabel(type) {
  const labels = {
    produce: "produce",
    inputs: "inputs",
    livestock: "livestock"
  };

  return t(labels[type] || "produce");
}

function getFilteredListings() {
  const listings = getAllListings();

  return listings.filter(item => {
    const matchesCategory =
      activeFilter === "all" || item.type === activeFilter;

    const searchable = [
      item.name,
      item.type,
      item.location,
      item.description,
      item.unit
    ].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function renderListings() {
  const grid = $("#listingGrid");
  if (!grid) return;

  const listings = getFilteredListings();
  const likes = getLikes();
  const favourites = getFavourites();

  grid.innerHTML = listings.map(item => {
    const liked = likes.includes(item.id);
    const saved = favourites.includes(item.id);

    const name = escapeHTML(item.name);
    const location = escapeHTML(item.location);
    const description = escapeHTML(item.description || t("defaultDescription"));
    const typeLabel = escapeHTML(getCategoryLabel(item.type));
    const unit = escapeHTML(item.unit || t("perUnit"));
    const price = escapeHTML(formatPrice(item.price));

    const image = escapeHTML(item.image || "");
    const fallback = escapeHTML(item.fallback || "🌱");

    return `
      <article class="listing-card">
        <div class="listing-photo-wrap">
          <img
            class="listing-photo"
            src="${image}"
            alt="${name}"
            loading="lazy"
            data-fallback="${fallback}"
            onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('image-failed');this.parentElement.insertAdjacentHTML('afterbegin','<span class=&quot;image-fallback&quot; aria-hidden=&quot;true&quot;>${fallback}</span>')"
          >
          <span class="listing-type">${typeLabel}</span>
          <button
            class="like-button ${liked ? "liked" : ""}"
            data-like="${escapeHTML(item.id)}"
            aria-label="${liked ? "Unlike" : "Like"} ${name}"
            aria-pressed="${liked}"
            title="${liked ? "Unlike" : "Like"}"
          >${liked ? "♥" : "♡"}</button>
          <button
            class="save-button ${saved ? "saved" : ""}"
            data-save="${escapeHTML(item.id)}"
            aria-label="${saved ? "Remove favourite" : "Save favourite"}"
            aria-pressed="${saved}"
            title="${saved ? "Saved" : "Save favourite"}"
          >${saved ? "★" : "☆"}</button>
        </div>

        <div class="listing-content">
          <span class="listing-location">📍 ${location}</span>
          <h3 class="listing-title">${name}</h3>
          <p class="listing-description">${description}</p>

          <div class="listing-bottom">
            <div class="listing-price">
              ${price}
              <span class="listing-unit">${unit}</span>
            </div>
            <button
              class="listing-contact"
              data-contact="${escapeHTML(item.id)}"
            >${escapeHTML(t("contact"))} ↗</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  $("#emptyState").hidden = listings.length > 0;
  updateResultsCount();
}

function updateResultsCount() {
  const element = $("#resultsCount");
  if (!element) return;

  element.textContent = t("searchCount", {
    count: getFilteredListings().length
  });
}

function applySearch() {
  searchTerm = ($("#searchInput")?.value || "").trim().toLowerCase();

  const category = $("#searchCategory")?.value || "all";

  activeFilter = category;

  $$(".filter-pill").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === activeFilter);
  });

  renderListings();

  $("#marketplace")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function setCategory(category) {
  activeFilter = category;

  const searchCategory = $("#searchCategory");
  if (searchCategory) searchCategory.value = category;

  $$(".filter-pill").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === category);
  });

  renderListings();
  $("#listingFilters")?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ------------------------------------------
   Likes and favourites
------------------------------------------ */

function toggleLike(id) {
  const likes = getLikes();
  const index = likes.indexOf(id);

  if (index >= 0) {
    likes.splice(index, 1);
    writeStorage(STORAGE.likes, likes);
    showToast(t("unliked"));
  } else {
    likes.push(id);
    writeStorage(STORAGE.likes, likes);
    showToast(t("liked"));
  }

  renderListings();
}

function toggleFavourite(id) {
  const favourites = getFavourites();
  const index = favourites.indexOf(id);

  if (index >= 0) {
    favourites.splice(index, 1);
    writeStorage(STORAGE.favourites, favourites);
    showToast(t("removed"));
  } else {
    favourites.push(id);
    writeStorage(STORAGE.favourites, favourites);
    showToast(t("saved"));
  }

  renderListings();
}

/* ------------------------------------------
   Modals and demo listing form
------------------------------------------ */

function openModal(selector) {
  const dialog = $(selector);
  if (!dialog) return;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    showToast(t("unavailable"));
  }
}

function closeModal(element) {
  const dialog = element.closest("dialog");
  if (dialog) dialog.close();
}

function isValidImageURL(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function handleListingSubmit(event) {
  event.preventDefault();

  const name = $("#listingName").value.trim();
  const type = $("#listingType").value;
  const priceValue = $("#listingPrice").value;
  const location = $("#listingLocation").value.trim();
  const image = $("#listingImage").value.trim();
  const description = $("#listingDescription").value.trim();

  const message = $("#listingMessage");
  message.textContent = "";

  if (!name || !location || priceValue === "") {
    message.textContent = t("formError");
    return;
  }

  const price = Number(priceValue);

  if (!Number.isFinite(price) || price < 0) {
    message.textContent = t("invalidPrice");
    return;
  }

  if (!isValidImageURL(image)) {
    message.textContent = t("photoError");
    return;
  }

  const newListing = {
    id: "demo-user-" + Date.now(),
    type,
    name,
    price,
    unit: t("perUnit"),
    location,
    description: description || t("defaultDescription"),
    image: image || "",
    fallback: type === "livestock" ? "🐄" : type === "inputs" ? "🧪" : "🌱"
  };

  const customListings = getCustomListings();
  customListings.unshift(newListing);

  if (!writeStorage(STORAGE.listings, customListings)) {
    message.textContent = t("formError");
    return;
  }

  $("#listingForm").reset();
  $("#listingModal").close();

  activeFilter = type;
  searchTerm = "";
  $("#searchInput").value = "";
  $("#searchCategory").value = type;

  $$(".filter-pill").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === type);
  });

  renderListings();
  showToast(t("listingPreviewed"));

  $("#marketplace").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* ------------------------------------------
   Weather and farming assistant preview
------------------------------------------ */

function updateCountyInsight() {
  const county = $("#countySelect")?.value;
  const message = $("#insightMessage");

  if (!county) {
    message.innerHTML = `
      <span>📍</span>
      <p>${escapeHTML(t("selectAreaHint"))}</p>
    `;
    return;
  }

  message.innerHTML = `
    <span>🌱</span>
    <p>${escapeHTML(t("insightDemo", { county }))}</p>
  `;
}

function openAssistant() {
  $("#assistant")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  $("#countySelect")?.focus();
}

/* ------------------------------------------
   Directory placeholders
------------------------------------------ */

function renderDirectories() {
  const sacco = $("#saccoResults");
  const opportunities = $("#opportunityResults");

  if (sacco) {
    sacco.innerHTML = `
      <div class="directory-item">
        <strong>🏦 ${escapeHTML(t("sampleSacco"))}</strong>
        <small>${escapeHTML(t("directoryDemo"))}</small>
      </div>
    `;
  }

  if (opportunities) {
    opportunities.innerHTML = `
      <div class="directory-item">
        <strong>🎓 ${escapeHTML(t("sampleOpportunity"))}</strong>
        <small>${escapeHTML(t("opportunityDemo"))}</small>
      </div>
    `;
  }
}

/* ------------------------------------------
   Toast messages
------------------------------------------ */

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2800);
}

/* ------------------------------------------
   Event listeners
------------------------------------------ */

function bindEvents() {
  $("#languageSelect")?.addEventListener("change", event => {
    setLanguage(event.target.value);
  });

  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    applySearch();
  });

  $("#searchInput")?.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderListings();
  });

  $("#searchCategory")?.addEventListener("change", event => {
    setCategory(event.target.value);
  });

  $$(".category-card").forEach(button => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.category);
    });
  });

  $$(".filter-pill").forEach(button => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.filter);
    });
  });

  $("#listingGrid")?.addEventListener("click", event => {
    const likeButton = event.target.closest("[data-like]");
    const saveButton = event.target.closest("[data-save]");
    const contactButton = event.target.closest("[data-contact]");

    if (likeButton) {
      toggleLike(likeButton.dataset.like);
      return;
    }

    if (saveButton) {
      toggleFavourite(saveButton.dataset.save);
      return;
    }

    if (contactButton) {
      showToast(t("contactDemo"));
    }
  });

  $("#listItemButton")?.addEventListener("click", () => {
    openModal("#listingModal");
  });

  $("#sellBannerButton")?.addEventListener("click", () => {
    openModal("#listingModal");
  });

  $("#loginButton")?.addEventListener("click", () => {
    openModal("#loginModal");
  });

  $("#assistantButton")?.addEventListener("click", openAssistant);

  $("#countySelect")?.addEventListener("change", updateCountyInsight);

  $("#listingForm")?.addEventListener("submit", handleListingSubmit);

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeModal(button));
  });

  $$("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  });

  $("#menuToggle")?.addEventListener("click", () => {
    const nav = $("#mobileNav");
    if (!nav) return;

    const opening = nav.hidden;
    nav.hidden = !opening;

    $("#menuToggle").setAttribute("aria-expanded", String(opening));
    $("#menuToggle").setAttribute(
      "aria-label",
      opening ? "Close menu" : "Open menu"
    );
  });

  $$("#mobileNav a").forEach(link => {
    link.addEventListener("click", () => {
      $("#mobileNav").hidden = true;
      $("#menuToggle").setAttribute("aria-expanded", "false");
    });
  });

  $("#currentYear").textContent = new Date().getFullYear();
}

/* ------------------------------------------
   Start the application
------------------------------------------ */

function initApp() {
  let savedLanguage = "mix";

  try {
    savedLanguage = localStorage.getItem(STORAGE.language) || "mix";
  } catch {
    // Use default language.
  }

  currentLanguage = translations[savedLanguage] ? savedLanguage : "mix";

  bindEvents();
  applyTranslations();
  renderListings();
  renderDirectories();
  updateCountyInsight();
}

document.addEventListener("DOMContentLoaded", initApp);
