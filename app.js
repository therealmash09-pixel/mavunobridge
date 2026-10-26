
(() => {
  "use strict";

  /* =========================================================
     MAVUNOBRIDGE — MARKETPLACE ENGINE
     Browser-only science-fair demo. No Supabase/backend needed.
     Built-in demo listings load for every visitor, including QR
     visitors on the published website. User listings are local
     to the browser that created them.
  ========================================================= */

  const STORAGE = {
    listings: "mavunobridge_listings_v6",
    cart: "mavunobridge_cart_v6",
    language: "mavunobridge_language_v2",
    user: "mavunobridge_demo_user_v1",
    pendingChat: "mavunobridge_pending_chat_v1"
  };

  const LEGACY_LISTING_KEYS = [
    "mavunobridge_listings_v5",
    "mavunobridge_listings_v4",
    "shambamarket_listings_v4"
  ];

  const PREFILL_KEY = "mavunobridge_prefill_demand";
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  // Category covers are decorative. Product cards never borrow an
  // unrelated product photo; missing photos get a neutral fallback.
  const CATEGORIES = [
    ["Fruits", "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"],
    ["Vegetables", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"],
    ["Nuts", "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80"],
    ["Starchy Foods", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"],
    ["Grains", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"],
    ["Cereals", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"],
    ["Legumes", "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80"],
    ["Spices", "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=80"],
    ["Herbal Products", "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80"],
    ["Livestock", "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80"],
    ["Livestock Produce", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80"],
    ["Agricultural Inputs", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"],
    ["Farm Tools & Equipment", "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=600&q=80"],
    ["Farmer Services", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"]
  ];

  const CATEGORY_NAMES = CATEGORIES.map(([name]) => name);

  const COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
    "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
    "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
    "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
    "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi City", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya",
    "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana",
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ];

  // Illustrative demo ranges only; these are not live market quotations.
  const FAIR_GUIDE = [
    { name: "Tomatoes", min: 60, max: 110, match: n => n.includes("tomato") },
    { name: "Hass Avocados", min: 90, max: 180, match: n => n.includes("hass avocado") },
    { name: "Maize", min: 45, max: 80, match: n => n.includes("maize") }
  ];

  /* =========================================================
     BUILT-IN DEMO LISTINGS
     These load for every visitor, including QR-code visitors
     who have never opened the site before.
  ========================================================= */

  const DEMO_LISTINGS = [
    // FRUITS
    {
      id: "demo-avocado", demo: true, name: "Hass Avocados",
      category: "Fruits", county: "Kiambu", town: "Limuru",
      price: 120, unit: "kg", qty: "80 kg", sale: "Both",
      seller: "Limuru Fresh Farm", phone: "0711223344",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
      description: "Fresh Hass avocados from a sample farm.", createdAt: 1
    },
    {
      id: "demo-bananas", demo: true, name: "Bananas",
      category: "Fruits", county: "Kisumu", town: "Kisumu",
      price: 120, unit: "bunch", qty: "30 bunches", sale: "Retail",
      seller: "Lake Region Farm", phone: "0777889900",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
      description: "Bananas available in bunches.", createdAt: 2
    },
    {
      id: "demo-mango", demo: true, name: "Apple Mangoes",
      category: "Fruits", county: "Makueni", town: "Wote",
      price: 100, unit: "kg", qty: "100 kg", sale: "Both",
      seller: "Wote Fruit Farm", phone: "0701234590",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80",
      description: "Sample seasonal mango listing.", createdAt: 3
    },

    // VEGETABLES
    {
      id: "demo-tomatoes", demo: true, name: "Fresh Tomatoes",
      category: "Vegetables", county: "Nakuru", town: "Naivasha",
      price: 75, unit: "kg", qty: "120 kg", sale: "Both",
      seller: "Naivasha Growers", phone: "0722334455",
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80",
      description: "Fresh tomatoes. Sample demo listing.", createdAt: 4
    },
    {
      id: "demo-onions", demo: true, name: "Red Onions",
      category: "Vegetables", county: "Nakuru", town: "Gilgil",
      price: 95, unit: "kg", qty: "90 kg", sale: "Both",
      seller: "Gilgil Onion Growers", phone: "0788990011",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80",
      description: "Red onions for cooking and retail.", createdAt: 5
    },
    {
      id: "demo-kales", demo: true, name: "Sukuma Wiki (Kale)",
      category: "Vegetables", county: "Kiambu", town: "Thika",
      price: 35, unit: "bunch", qty: "60 bunches", sale: "Retail",
      seller: "Thika Green Farm", phone: "0700112233",
      image: "", description: "Fresh kale in bunches. Product photo has not been supplied for this demo item.",
      createdAt: 6
    },
    {
      id: "demo-cabbage", demo: true, name: "Green Cabbages",
      category: "Vegetables", county: "Nyandarua", town: "Ol Kalou",
      price: 45, unit: "piece", qty: "100 heads", sale: "Both",
      seller: "Ol Kalou Vegetable Farm", phone: "0700112244",
      image: "", description: "Green cabbages sold by piece or in bulk.",
      createdAt: 7
    },

    // NUTS
    {
      id: "demo-groundnuts", demo: true, name: "Groundnuts (Peanuts)",
      category: "Nuts", county: "Kilifi", town: "Malindi",
      price: 220, unit: "kg", qty: "35 kg", sale: "Both",
      seller: "Coastal Harvest", phone: "0712345601",
      image: "", description: "Groundnuts from a sample coastal seller. Product photo not supplied.",
      createdAt: 8
    },

    // STARCHY FOODS
    {
      id: "demo-potatoes", demo: true, name: "Irish Potatoes",
      category: "Starchy Foods", county: "Nyandarua", town: "Ol Kalou",
      price: 65, unit: "kg", qty: "200 kg", sale: "Bulk",
      seller: "Nyandarua Potato Farm", phone: "0755667788",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
      description: "Potatoes for retailers and food businesses.", createdAt: 9
    },
    {
      id: "demo-sweet-potatoes", demo: true, name: "Orange-Fleshed Sweet Potatoes",
      category: "Starchy Foods", county: "Busia", town: "Bumala",
      price: 55, unit: "kg", qty: "85 kg", sale: "Both",
      seller: "Bumala Root Crop Farm", phone: "0712345612",
      image: "", description: "Sweet potatoes sold by kilogram. Product photo not supplied.",
      createdAt: 10
    },

    // GRAINS
    {
      id: "demo-maize", demo: true, name: "Dry Maize Grain",
      category: "Grains", county: "Uasin Gishu", town: "Eldoret",
      price: 58, unit: "kg", qty: "300 kg", sale: "Bulk",
      seller: "Rift Valley Grain Hub", phone: "0733445566",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
      description: "Dry maize grain for bulk buyers.", createdAt: 11
    },
    {
      id: "demo-wheat", demo: true, name: "Wheat Grain",
      category: "Grains", county: "Narok", town: "Narok",
      price: 72, unit: "kg", qty: "250 kg", sale: "Bulk",
      seller: "Narok Grain Growers", phone: "0790123489",
      image: "", description: "Sample wheat grain listing for bulk buyers. No unrelated maize photo is used.",
      createdAt: 12
    },

    // CEREALS
    {
      id: "demo-millet", demo: true, name: "Finger Millet (Wimbi)",
      category: "Cereals", county: "Kakamega", town: "Kakamega",
      price: 140, unit: "kg", qty: "70 kg", sale: "Bulk",
      seller: "Kakamega Wimbi Group", phone: "0799001122",
      image: "", description: "Finger millet for food preparation and milling. Product photo not supplied.",
      createdAt: 13
    },
    {
      id: "demo-sorghum", demo: true, name: "Sorghum Grain",
      category: "Cereals", county: "Kitui", town: "Kitui",
      price: 95, unit: "kg", qty: "90 kg", sale: "Both",
      seller: "Kitui Cereal Growers", phone: "0712345623",
      image: "", description: "Sorghum grain available in sample quantities.",
      createdAt: 14
    },

    // LEGUMES
    {
      id: "demo-beans", demo: true, name: "Rosecoco Beans",
      category: "Legumes", county: "Meru", town: "Meru",
      price: 150, unit: "kg", qty: "60 kg", sale: "Both",
      seller: "Meru Bean Farmers", phone: "0744556677",
      image: "", description: "Dry Rosecoco beans for home and business use.",
      createdAt: 15
    },
    {
      id: "demo-green-grams", demo: true, name: "Green Grams (Ndengu)",
      category: "Legumes", county: "Machakos", town: "Mwala",
      price: 180, unit: "kg", qty: "45 kg", sale: "Both",
      seller: "Machakos Dry Foods", phone: "0766778899",
      image: "", description: "Green grams from a sample seller. Product photo not supplied.",
      createdAt: 16
    },
    {
      id: "demo-cowpeas", demo: true, name: "Cowpeas (Kunde Seeds)",
      category: "Legumes", county: "Kitui", town: "Mwingi",
      price: 130, unit: "kg", qty: "50 kg", sale: "Bulk",
      seller: "Mwingi Legume Group", phone: "0712345634",
      image: "", description: "Dry cowpeas for cooking or planting only when seed suitability is confirmed with the seller.",
      createdAt: 17
    },

    // SPICES
    {
      id: "demo-cinnamon", demo: true, name: "Cinnamon Sticks",
      category: "Spices", county: "Kwale", town: "Ukunda",
      price: 450, unit: "kg", qty: "15 kg", sale: "Retail",
      seller: "Coast Spice Farm", phone: "0723456712",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=700&q=80",
      description: "Cinnamon for cooking and food businesses.", createdAt: 18
    },
    {
      id: "demo-ginger", demo: true, name: "Fresh Ginger Root",
      category: "Spices", county: "Kakamega", town: "Mumias",
      price: 160, unit: "kg", qty: "25 kg", sale: "Both",
      seller: "Mumias Spice Growers", phone: "0712345645",
      image: "", description: "Fresh ginger root for cooking. Product photo not supplied.",
      createdAt: 19
    },

    // HERBAL PRODUCTS
    {
      id: "demo-lemongrass", demo: true, name: "Dried Lemongrass",
      category: "Herbal Products", county: "Kiambu", town: "Thika",
      price: 250, unit: "kg", qty: "12 kg", sale: "Retail",
      seller: "Thika Herb Garden", phone: "0700112255",
      image: "", description: "Dried lemongrass sold as a herbal plant product. No medical claims are made.",
      createdAt: 20
    },
    {
      id: "demo-aloe", demo: true, name: "Aloe Vera Leaves",
      category: "Herbal Products", county: "Makueni", town: "Wote",
      price: 30, unit: "piece", qty: "80 leaves", sale: "Retail",
      seller: "Wote Plant Nursery", phone: "0700112266",
      image: "", description: "Aloe vera leaves sold as a plant product; use and suitability should be checked independently.",
      createdAt: 21
    },

    // LIVESTOCK
    {
      id: "demo-chicken", demo: true, name: "Indigenous Chickens",
      category: "Livestock", county: "Kakamega", town: "Shinyalu",
      price: 1200, unit: "animal", qty: "12 birds", sale: "Retail",
      seller: "Western Poultry Demo Farm", phone: "0700223344",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=80",
      description: "Sample livestock listing. Confirm age and availability with the seller.",
      createdAt: 22
    },
    {
      id: "demo-goat", demo: true, name: "Dairy Goat",
      category: "Livestock", county: "Nyeri", town: "Othaya",
      price: 12500, unit: "animal", qty: "2 goats", sale: "Retail",
      seller: "Othaya Livestock Demo Farm", phone: "0700223355",
      image: "", description: "Sample dairy-goat listing. Confirm breed, health records and availability with the seller.",
      createdAt: 23
    },

    // LIVESTOCK PRODUCE
    {
      id: "demo-eggs", demo: true, name: "Fresh Chicken Eggs",
      category: "Livestock Produce", county: "Kiambu", town: "Ruiru",
      price: 450, unit: "tray", qty: "20 trays", sale: "Both",
      seller: "Ruiru Poultry Demo Farm", phone: "0700334455",
      image: "", description: "Sample egg listing. Confirm tray size and availability with seller.",
      createdAt: 24
    },
    {
      id: "demo-milk", demo: true, name: "Raw Cow's Milk",
      category: "Livestock Produce", county: "Nakuru", town: "Njoro",
      price: 70, unit: "litre", qty: "40 litres", sale: "Retail",
      seller: "Njoro Dairy Demo Farm", phone: "0700334466",
      image: "", description: "Illustrative raw-milk listing. Buyers should follow local food-safety and handling requirements.",
      createdAt: 25
    },

    // AGRICULTURAL INPUTS
    {
      id: "demo-onion-seedlings", demo: true, name: "Onion Seedlings",
      category: "Agricultural Inputs", county: "Nakuru", town: "Njoro",
      price: 2, unit: "piece", qty: "2,000 onion seedlings", sale: "Both",
      seller: "Njoro Seedling Nursery", phone: "0700445566",
      image: "", description: "Onion seedlings for transplanting. Confirm onion variety, seedling age and quantity before purchase.",
      createdAt: 26
    },
    {
      id: "demo-tomato-seedlings", demo: true, name: "Tomato Seedlings",
      category: "Agricultural Inputs", county: "Kiambu", town: "Limuru",
      price: 3, unit: "piece", qty: "1,500 tomato seedlings", sale: "Both",
      seller: "Limuru Seedling Nursery", phone: "0700445577",
      image: "", description: "Tomato seedlings. Ask the nursery which tomato variety is available.",
      createdAt: 27
    },
    {
      id: "demo-cabbage-seedlings", demo: true, name: "Cabbage Seedlings",
      category: "Agricultural Inputs", county: "Nyandarua", town: "Ol Kalou",
      price: 2, unit: "piece", qty: "1,000 cabbage seedlings", sale: "Both",
      seller: "Ol Kalou Seedling Nursery", phone: "0700445588",
      image: "", description: "Cabbage seedlings ready for transplanting. Confirm the variety with the nursery.",
      createdAt: 28
    },
    {
      id: "demo-maize-seeds", demo: true, name: "Certified Maize Seeds",
      category: "Agricultural Inputs", county: "Trans Nzoia", town: "Kitale",
      price: 450, unit: "unit", qty: "15 packets", sale: "Retail",
      seller: "Kitale Farm Inputs Demo Shop", phone: "0700445599",
      image: "", description: "Sample maize-seed listing. Confirm seed variety, packet weight and certification details with seller.",
      createdAt: 29
    },
    {
      id: "demo-compost", demo: true, name: "Organic Farm Compost",
      category: "Agricultural Inputs", county: "Murang'a", town: "Kangema",
      price: 250, unit: "bag", qty: "40 bags", sale: "Both",
      seller: "Kangema Soil Care Demo", phone: "0700445500",
      image: "", description: "Sample compost listing; check bag size and contents with seller.",
      createdAt: 30
    },

    // FARM TOOLS & EQUIPMENT
    {
      id: "demo-jembe", demo: true, name: "Jembe Hand Hoe",
      category: "Farm Tools & Equipment", county: "Nairobi City", town: "Nairobi",
      price: 650, unit: "unit", qty: "20 hoes", sale: "Retail",
      seller: "Farm Tools Demo Shop", phone: "0700556677",
      image: "", description: "Sample listing for jembe hand hoes. Confirm handle and head type with seller.",
      createdAt: 31
    },
    {
      id: "demo-sprayer", demo: true, name: "Knapsack Sprayer",
      category: "Farm Tools & Equipment", county: "Nakuru", town: "Nakuru",
      price: 3500, unit: "unit", qty: "8 sprayers", sale: "Retail",
      seller: "Nakuru Equipment Demo Shop", phone: "0700556688",
      image: "", description: "Sample knapsack sprayer listing. Confirm capacity and condition before purchase.",
      createdAt: 32
    },

    // FARMER SERVICES
    {
      id: "demo-plough", demo: true, name: "Land Ploughing Service",
      category: "Farmer Services", county: "Trans Nzoia", town: "Kitale",
      price: 3500, unit: "service", qty: "Bookings by arrangement", sale: "Both",
      seller: "Kitale Farm Services Demo", phone: "0700667788",
      image: "", description: "Example ploughing service. Confirm acreage, date and final cost.",
      createdAt: 33
    },
    {
      id: "demo-tractor-hire", demo: true, name: "Tractor Hire Service",
      category: "Farmer Services", county: "Uasin Gishu", town: "Eldoret",
      price: 5000, unit: "service", qty: "Bookings by arrangement", sale: "Both",
      seller: "Eldoret Machinery Demo", phone: "0700667799",
      image: "", description: "Sample tractor-hire service. Confirm hourly/acre rate, fuel, schedule and travel costs.",
      createdAt: 34
    },
    {
      id: "demo-soil-test", demo: true, name: "Farm Soil Testing Service",
      category: "Farmer Services", county: "Nairobi City", town: "Nairobi",
      price: 1500, unit: "service", qty: "Appointments available", sale: "Retail",
      seller: "Agri Test Demo Service", phone: "0700667700",
      image: "", description: "Illustrative soil-testing service. Ask the provider what the test includes and how to submit a sample.",
      createdAt: 35
    }
  ];

  let listings = [];
  let cart = [];
  let activeCategory = "All";
  let categoryImageObserver = null;
  let toastTimeout = null;
  let isPublishing = false;
  let currentLang = "mix";

  const D = {
    mix: {
      addCart: "Add to cart", chatSeller: "Chat seller", contact: "Contact seller",
      demoBadge: "DEMO LISTING", saleRetail: "Retail", saleBulk: "Bulk", saleBoth: "Both",
      qtyOnRequest: "Quantity on request", sellerFallback: "Seller", fairNoLabel: "No guide yet",
      fairNoDetail: "No matching demo price guide.", fairBelow: "Below demo guide",
      fairAbove: "Above demo guide", fairWithin: "Within demo guide",
      showing: n => `Showing ${n} listing${n === 1 ? "" : "s"}`,
      categoryLabel: c => `Category: ${c}`,
      hintAll: "Discover products and services from Kenyan sellers.",
      hintCat: c => `Showing ${c}. Chagua product unayohitaji.`,
      noContact: "No contact number was provided for this listing.",
      chatDraft: n => `${n} bado iko? Bei ya mwisho ni ngapi?`,
      chatFailed: "Imeshindwa kufungua chat. Hakikisha browser inaruhusu local storage.",
      greeting: n => `Sasa, ${n}`, signedOut: "Umetoka kwa account.",
      cartEmpty: "Your cart is empty. Browse the marketplace to add items.",
      remove: "Remove", subtotal: v => `Demo subtotal: ${v}`,
      cartAdded: n => `${n} added to your demo cart.`,
      cartNotFound: "Listing not found. Refresh the page and try again.",
      cartSaveFail: "Cart could not be saved in this browser.",
      cartRemoved: "Item removed from cart.", cartCleared: "Cart cleared.",
      publish: "Publish listing", publishing: "Publishing...",
      published: "Listing published! Iko live kwenye marketplace hii browser.",
      publishedNoPhoto: "Listing published without the photo (it was too big to save).",
      publishedNoSave: "Listing added, but your browser blocked saving. It will disappear when you refresh.",
      formMissing: "Listing form could not be found.", fillAll: "Tafadhali jaza required fields zote.",
      badCategory: "Please choose a valid product category.", badCounty: "Please choose a valid county.",
      badPrice: "Enter a price greater than zero.",
      badPhone: "Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.",
      publishFailed: "Could not publish the listing. Please try again.",
      langChanged: "Language set to Sheng + English."
    },
    en: {
      addCart: "Add to cart", chatSeller: "Chat seller", contact: "Contact seller",
      demoBadge: "DEMO LISTING", saleRetail: "Retail", saleBulk: "Bulk", saleBoth: "Retail + bulk",
      qtyOnRequest: "Quantity on request", sellerFallback: "Seller", fairNoLabel: "No guide yet",
      fairNoDetail: "No matching demo price guide.", fairBelow: "Below demo guide",
      fairAbove: "Above demo guide", fairWithin: "Within demo guide",
      showing: n => `Showing ${n} listing${n === 1 ? "" : "s"}`,
      categoryLabel: c => `Category: ${c}`,
      hintAll: "Discover products and services from Kenyan sellers.",
      hintCat: c => `Showing ${c}. Pick the product you need.`,
      noContact: "No contact number was provided for this listing.",
      chatDraft: n => `Is the ${n} still available? What is your best price?`,
      chatFailed: "Could not open the chat. Check that your browser allows local storage.",
      greeting: n => `Hi, ${n}`, signedOut: "You have signed out.",
      cartEmpty: "Your cart is empty. Browse the marketplace to add items.",
      remove: "Remove", subtotal: v => `Demo subtotal: ${v}`,
      cartAdded: n => `${n} added to your demo cart.`,
      cartNotFound: "Listing not found. Refresh the page and try again.",
      cartSaveFail: "Cart could not be saved in this browser.",
      cartRemoved: "Item removed from cart.", cartCleared: "Cart cleared.",
      publish: "Publish listing", publishing: "Publishing...",
      published: "Listing published! It is now live on the marketplace in this browser.",
      publishedNoPhoto: "Listing published without the photo (it was too big to save).",
      publishedNoSave: "Listing added, but your browser blocked saving. It will disappear when you refresh.",
      formMissing: "Listing form could not be found.", fillAll: "Please fill in all required fields.",
      badCategory: "Please choose a valid product category.", badCounty: "Please choose a valid county.",
      badPrice: "Enter a price greater than zero.",
      badPhone: "Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.",
      publishFailed: "Could not publish the listing. Please try again.", langChanged: "Language changed to English."
    },
    sw: {
      addCart: "Weka kikapuni", chatSeller: "Ongea na muuzaji", contact: "Wasiliana na muuzaji",
      demoBadge: "TANGAZO LA MFANO", saleRetail: "Rejareja", saleBulk: "Jumla", saleBoth: "Rejareja + jumla",
      qtyOnRequest: "Kiasi kwa ombi", sellerFallback: "Muuzaji", fairNoLabel: "Hakuna mwongozo bado",
      fairNoDetail: "Hakuna mwongozo wa bei unaolingana.", fairBelow: "Chini ya mwongozo wa majaribio",
      fairAbove: "Juu ya mwongozo wa majaribio", fairWithin: "Ndani ya mwongozo wa majaribio",
      showing: n => n === 1 ? "Tangazo 1 linaonyeshwa" : `Matangazo ${n} yanaonyeshwa`,
      categoryLabel: c => `Aina: ${c}`, hintAll: "Gundua bidhaa na huduma kutoka kwa wauzaji wa Kenya.",
      hintCat: c => `Inaonyesha ${c}. Chagua bidhaa unayohitaji.`,
      noContact: "Hakuna namba ya mawasiliano iliyotolewa kwa tangazo hili.",
      chatDraft: n => `Je, ${n} bado ipo? Bei yako ya mwisho ni ngapi?`,
      chatFailed: "Imeshindwa kufungua mazungumzo. Hakikisha kivinjari kinaruhusu hifadhi ya ndani.",
      greeting: n => `Habari, ${n}`, signedOut: "Umetoka kwenye akaunti.",
      cartEmpty: "Kikapu chako ni tupu. Tazama soko ili uongeze bidhaa.", remove: "Ondoa",
      subtotal: v => `Jumla ndogo ya majaribio: ${v}`,
      cartAdded: n => `${n} imewekwa kwenye kikapu chako cha majaribio.`,
      cartNotFound: "Tangazo halikupatikana. Onyesha upya ukurasa kisha ujaribu tena.",
      cartSaveFail: "Kikapu hakikuweza kuhifadhiwa kwenye kivinjari hiki.",
      cartRemoved: "Bidhaa imeondolewa kwenye kikapu.", cartCleared: "Kikapu kimefutwa.",
      publish: "Chapisha tangazo", publishing: "Inachapisha...",
      published: "Tangazo limechapishwa! Sasa lipo kwenye soko katika kivinjari hiki.",
      publishedNoPhoto: "Tangazo limechapishwa bila picha (ilikuwa kubwa mno kuhifadhiwa).",
      publishedNoSave: "Tangazo limeongezwa, lakini kivinjari kimezuia kuhifadhi. Litatoweka ukionyesha upya ukurasa.",
      formMissing: "Fomu ya tangazo haikupatikana.", fillAll: "Tafadhali jaza sehemu zote zinazohitajika.",
      badCategory: "Tafadhali chagua aina halali ya bidhaa.", badCounty: "Tafadhali chagua kaunti halali.",
      badPrice: "Weka bei inayozidi sifuri.",
      badPhone: "Weka namba halali ya simu ya Kenya, mfano 0712345678 au +254712345678.",
      publishFailed: "Imeshindwa kuchapisha tangazo. Tafadhali jaribu tena.", langChanged: "Lugha imebadilishwa."
    }
  };

  function t(key, ...args) {
    const table = D[currentLang] || D.mix;
    const value = table[key] !== undefined ? table[key] : D.mix[key];
    return typeof value === "function" ? value(...args) : value;
  }

  function saleLabel(sale) {
    if (sale === "Bulk") return t("saleBulk");
    if (sale === "Both") return t("saleBoth");
    return t("saleRetail");
  }
  function money(value) {
    return "KSh " + Number(value || 0).toLocaleString("en-KE", { maximumFractionDigits: 2 });
  }
  function normalizePhone(value) {
    return String(value || "").trim().replace(/[\s()-]/g, "");
  }
  function validPhone(value) {
    return /^(\+?254|0)?[17]\d{8}$/.test(normalizePhone(value));
  }
  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return "listing-" + window.crypto.randomUUID();
    return "listing-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function loadStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved);
    } catch (error) {
      console.warn("MavunoBridge: could not read local storage", error);
      return fallback;
    }
  }
  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("MavunoBridge: could not save local storage", error);
      return false;
    }
  }

  function updateHint() {
    const hint = $("#marketHint");
    if (hint) hint.textContent = activeCategory === "All" ? t("hintAll") : t("hintCat", activeCategory);
  }

  function normalizeCategory(category) {
    const aliases = {
      "Livestock Products": "Livestock Produce",
      "Farm Inputs": "Agricultural Inputs",
      "Tools & Equipment": "Farm Tools & Equipment",
      "Starchy food": "Starchy Foods",
      "Herbs": "Herbal Products"
    };
    const cleaned = aliases[String(category || "").trim()] || String(category || "").trim();
    return CATEGORY_NAMES.includes(cleaned) ? cleaned : cleaned;
  }

  /* LOAD DATA: built-in samples always load, even on a fresh judge's device. */
  function loadData() {
    let savedListings = loadStorage(STORAGE.listings, null);
    if (!Array.isArray(savedListings)) {
      savedListings = [];
      for (const key of LEGACY_LISTING_KEYS) {
        const legacy = loadStorage(key, null);
        if (Array.isArray(legacy)) { savedListings = legacy; break; }
      }
    }

    const userListings = Array.isArray(savedListings)
      ? savedListings.filter(item => item && typeof item === "object" && item.demo !== true && item.id && item.name && item.category && Number.isFinite(Number(item.price)))
        .map(item => ({ ...item, category: normalizeCategory(item.category) }))
      : [];

    listings = [...DEMO_LISTINGS, ...userListings];
    const savedCart = loadStorage(STORAGE.cart, []);
    cart = Array.isArray(savedCart) ? savedCart : [];
  }
  function saveUserListings() {
    return saveStorage(STORAGE.listings, listings.filter(item => item.demo !== true));
  }

  /* SIGN-IN IS ONLY A LOCAL DEMO SESSION */
  function getUser() {
    const saved = loadStorage(STORAGE.user, null);
    return saved && typeof saved === "object" && saved.name ? saved : null;
  }
  function renderUser() {
    const user = getUser();
    const link = $("#authLink");
    const chip = $("#userChip");
    const greeting = $("#userGreeting");
    if (link) link.classList.toggle("hidden", Boolean(user));
    if (chip) chip.classList.toggle("hidden", !user);
    if (user && greeting) greeting.textContent = t("greeting", String(user.name).trim().split(/\s+/)[0].slice(0, 18));
  }
  function signOut() {
    try { localStorage.removeItem(STORAGE.user); } catch (error) { console.warn("Could not clear the demo session", error); }
    renderUser();
    showToast(t("signedOut"));
  }

  /* CATEGORY AND COUNTY SELECTS */
  function populateSelects() {
    const categoryFilter = $("#categoryFilter");
    const productCategory = $("#productCategory");
    const locationFilter = $("#locationFilter");
    const productCounty = $("#productCounty");

    if (categoryFilter) {
      const current = categoryFilter.value || "All";
      categoryFilter.innerHTML = '<option value="All">All categories</option>';
      CATEGORIES.forEach(([name]) => categoryFilter.add(new Option(name, name)));
      categoryFilter.value = CATEGORY_NAMES.includes(current) || current === "All" ? current : "All";
    }
    if (productCategory) {
      const current = productCategory.value;
      productCategory.innerHTML = '<option value="">Choose a category</option>';
      CATEGORIES.forEach(([name]) => productCategory.add(new Option(name, name)));
      if (CATEGORY_NAMES.includes(current)) productCategory.value = current;
    }
    if (locationFilter) {
      const current = locationFilter.value || "All";
      locationFilter.innerHTML = '<option value="All">All counties</option>';
      COUNTIES.forEach(county => locationFilter.add(new Option(county, county)));
      locationFilter.value = COUNTIES.includes(current) || current === "All" ? current : "All";
    }
    if (productCounty) {
      const current = productCounty.value;
      productCounty.innerHTML = '<option value="">Choose a county</option>';
      COUNTIES.forEach(county => productCounty.add(new Option(county, county)));
      if (COUNTIES.includes(current)) productCounty.value = current;
    }
  }

  function renderCategories() {
    const grid = $("#categoryGrid");
    if (!grid) return;
    grid.innerHTML = "";
    if (categoryImageObserver) { categoryImageObserver.disconnect(); categoryImageObserver = null; }

    const canObserve = "IntersectionObserver" in window;
    if (canObserve) {
      categoryImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const imageUrl = el.dataset.categoryImage;
          if (imageUrl) {
            el.style.backgroundImage = `url("${imageUrl.replace(/"/g, "%22")}")`;
            el.removeAttribute("data-category-image");
          }
          observer.unobserve(el);
        });
      }, { rootMargin: "140px 0px" });
    }

    CATEGORIES.forEach(([category, image]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(activeCategory === category));
      if (activeCategory === category) button.classList.add("selected");
      button.innerHTML = `<span class="cat-image"></span><span class="cat-shade"></span><span class="cat-name">${escapeHTML(category)}</span>`;
      const imageEl = button.querySelector(".cat-image");
      imageEl.style.backgroundImage = "linear-gradient(135deg, #edf4e7, #cfe0c3)";
      if (canObserve) {
        imageEl.dataset.categoryImage = image;
        categoryImageObserver.observe(imageEl);
      } else {
        imageEl.style.backgroundImage = `url("${image.replace(/"/g, "%22")}")`;
      }
      grid.appendChild(button);
    });
  }

  function selectCategory(category) {
    activeCategory = CATEGORY_NAMES.includes(category) ? category : "All";
    const filter = $("#categoryFilter");
    if (filter) filter.value = activeCategory;
    renderCategories();
    renderListings();
    updateHint();
    $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* FAIR-PRICE GUIDE */
  function getFairPrice(item) {
    const name = String(item.name || "").toLowerCase();
    const guide = FAIR_GUIDE.find(entry => entry.match(name));
    if (!guide || item.unit !== "kg") return { status: "no-guide", label: t("fairNoLabel"), detail: t("fairNoDetail") };
    const detail = `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`;
    if (Number(item.price) < guide.min) return { status: "below", label: t("fairBelow"), detail };
    if (Number(item.price) > guide.max) return { status: "above", label: t("fairAbove"), detail };
    return { status: "within", label: t("fairWithin"), detail };
  }

  /* FILTER AND SORT */
  function getFilteredListings() {
    const search = ($("#searchInput")?.value || "").trim().toLowerCase();
    const county = $("#locationFilter")?.value || "All";
    const saleType = $("#saleFilter")?.value || "All";
    const fairFilter = $("#fairPriceFilter")?.value || "All";
    const sort = $("#sortFilter")?.value || "recommended";

    const results = listings.filter(item => {
      const searchText = [item.name, item.category, item.county, item.town, item.seller, item.description, item.condition].join(" ").toLowerCase();
      const categoryMatches = activeCategory === "All" || normalizeCategory(item.category) === activeCategory;
      const countyMatches = county === "All" || item.county === county;
      const saleMatches = saleType === "All" || item.sale === saleType || item.sale === "Both";
      const fairMatches = fairFilter === "All" || getFairPrice(item).status === fairFilter;
      const searchMatches = !search || searchText.includes(search);
      return categoryMatches && countyMatches && saleMatches && fairMatches && searchMatches;
    });

    if (sort === "newest") results.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    else if (sort === "price-low") results.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-high") results.sort((a, b) => Number(b.price) - Number(a.price));
    else results.sort((a, b) => Number(Boolean(a.demo)) - Number(Boolean(b.demo)) || Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return results;
  }

  /* IMAGE FALLBACK: show a neutral placeholder, never a different product. */
  function setImageFallback(image, item) {
    if (!image || image.dataset.fallbackApplied === "yes") return;
    image.dataset.fallbackApplied = "yes";
    const fallback = document.createElement("div");
    fallback.className = "product-image-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", `Photo unavailable for ${item?.name || "this product"}`);
    fallback.textContent = "Photo not available";
    Object.assign(fallback.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "150px",
      width: "100%",
      padding: "16px",
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #edf4e7, #dce8d3)",
      color: "#36553b",
      textAlign: "center",
      fontSize: "0.9rem",
      fontWeight: "700"
    });
    image.replaceWith(fallback);
  }

  /* RENDER MARKETPLACE CARDS */
  function renderListings() {
    const grid = $("#listingGrid");
    if (!grid) return;
    const results = getFilteredListings();
    grid.innerHTML = "";

    results.forEach(item => {
      const fair = getFairPrice(item);
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.listingId = item.id;

      const imageWrap = document.createElement("div");
      imageWrap.className = "product-image-wrap";
      const image = document.createElement("img");
      image.className = "product-image";
      image.alt = `${item.name || "Farm product"} product photo`;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => setImageFallback(image, item), { once: true });
      if (typeof item.image === "string" && item.image.trim()) image.src = item.image;
      imageWrap.appendChild(image);
      if (!item.image || !String(item.image).trim()) setImageFallback(image, item);

      const saleBadge = document.createElement("span");
      saleBadge.className = "sale-badge";
      saleBadge.textContent = saleLabel(item.sale);
      imageWrap.appendChild(saleBadge);

      if (item.demo) {
        const badge = document.createElement("span");
        badge.className = "demo-badge";
        badge.textContent = t("demoBadge");
        imageWrap.appendChild(badge);
      }

      const body = document.createElement("div");
      body.className = "product-body";
      const category = document.createElement("small");
      category.textContent = normalizeCategory(item.category) || "Agriculture";
      const title = document.createElement("h3");
      title.textContent = item.name || "Untitled listing";
      const location = document.createElement("p");
      location.className = "location";
      location.textContent = `📍 ${[item.town, item.county].filter(Boolean).join(", ")}`;

      const price = document.createElement("div");
      price.className = "price";
      price.append(document.createTextNode(money(item.price)));
      const unit = document.createElement("span");
      unit.textContent = ` / ${item.unit || "unit"}`;
      price.appendChild(unit);

      const fairBadge = document.createElement("div");
      fairBadge.className = `fair fair-${fair.status}`;
      fairBadge.textContent = fair.label;
      const fairDetail = document.createElement("p");
      fairDetail.className = "fair-detail";
      fairDetail.textContent = fair.detail;

      const quantity = document.createElement("p");
      quantity.className = "quantity";
      quantity.textContent = `${item.qty || t("qtyOnRequest")} · ${item.seller || t("sellerFallback")}`;

      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = item.description || "";

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "small primary";
      addButton.dataset.addCart = item.id;
      addButton.textContent = t("addCart");

      const chatButton = document.createElement("button");
      chatButton.type = "button";
      chatButton.className = "small";
      chatButton.dataset.chat = item.id;
      chatButton.textContent = t("chatSeller");

      const callLink = document.createElement("a");
      callLink.className = "small call-link";
      callLink.textContent = t("contact");
      const phone = normalizePhone(item.phone);
      if (phone) callLink.href = `tel:${phone}`;
      else {
        callLink.href = "#";
        callLink.addEventListener("click", event => {
          event.preventDefault();
          showToast(t("noContact"));
        });
      }

      actions.append(addButton, chatButton, callLink);
      body.append(category, title, location, price, fairBadge, fairDetail, quantity);
      if (description.textContent) body.appendChild(description);
      body.appendChild(actions);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    const resultCount = $("#resultCount");
    if (resultCount) resultCount.textContent = t("showing", results.length);

    const active = $("#activeCategory");
    if (active) active.textContent = activeCategory === "All" ? "" : t("categoryLabel", activeCategory);

    const empty = $("#emptyState");
    if (empty) empty.classList.toggle("hidden", results.length > 0);
    grid.classList.toggle("hidden", results.length === 0);
  }

  /* MODALS AND TOASTS */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    modal.querySelector("input:not([type=file]), select, textarea, button")?.focus();
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("hidden");
    if (!$$(".modal:not(.hidden)").length) document.body.classList.remove("modal-open");
  }
  function openListingModal() {
    const user = getUser();
    const sellerName = $("#sellerName");
    if (user && sellerName && !sellerName.value.trim()) sellerName.value = String(user.name).trim();
    openModal("listingModal");
  }
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) { console.info(message); return; }
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimeout) window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }
  function showListingError(message) {
    const error = $("#listingError");
    if (!error) { showToast(message); return; }
    error.textContent = message;
    error.classList.remove("hidden");
  }
  function clearListingError() {
    const error = $("#listingError");
    if (error) { error.textContent = ""; error.classList.add("hidden"); }
  }

  /* SHRINK UPLOADED IMAGES BEFORE SAVING THEM TO THIS BROWSER */
  function readAndResizeImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) { resolve(""); return; }
      if (!file.type.startsWith("image/")) { reject(new Error("Please choose an image file.")); return; }
      if (file.size > 8 * 1024 * 1024) { reject(new Error("That photo is too large. Please choose one under 8 MB.")); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read the selected photo."));
      reader.onload = () => {
        const source = new Image();
        source.onerror = () => reject(new Error("That image could not be opened."));
        source.onload = () => {
          const maxDimension = 900;
          const ratio = Math.min(1, maxDimension / Math.max(source.width, source.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(source.width * ratio));
          canvas.height = Math.max(1, Math.round(source.height * ratio));
          const context = canvas.getContext("2d");
          if (!context) { reject(new Error("Your browser could not process that photo.")); return; }
          context.drawImage(source, 0, 0, canvas.width, canvas.height);
          try { resolve(canvas.toDataURL("image/jpeg", 0.78)); }
          catch { reject(new Error("Could not prepare the photo. Try a smaller image.")); }
        };
        source.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  /* CREATE AND SAVE A USER LISTING */
  async function handleListingSubmit(event) {
    event.preventDefault();
    if (isPublishing) return;
    clearListingError();

    const form = $("#listingForm");
    const publishButton = $("#publishListingButton");
    if (!form) { showToast(t("formMissing")); return; }
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const name = $("#productName")?.value.trim() || "";
    const category = normalizeCategory($("#productCategory")?.value || "");
    const county = $("#productCounty")?.value || "";
    const town = $("#productTown")?.value.trim() || "";
    const qty = $("#productQuantity")?.value.trim() || "";
    const price = Number($("#productPrice")?.value);
    const unit = $("#productPriceUnit")?.value || "kg";
    const saleRaw = $("#productSaleType")?.value || "Retail";
    const sale = ["Retail", "Bulk", "Both"].includes(saleRaw) ? saleRaw : "Retail";
    const seller = $("#sellerName")?.value.trim() || "";
    const phone = normalizePhone($("#sellerPhone")?.value);
    const condition = $("#productCondition")?.value || "";
    const description = $("#productDescription")?.value.trim() || "";
    const harvestDate = $("#productHarvestDate")?.value || "";
    const file = $("#productImage")?.files?.[0] || null;

    if (!name || !category || !county || !qty || !seller || !phone) { showListingError(t("fillAll")); return; }
    if (!CATEGORY_NAMES.includes(category)) { showListingError(t("badCategory")); return; }
    if (!COUNTIES.includes(county)) { showListingError(t("badCounty")); return; }
    if (!Number.isFinite(price) || price <= 0) { showListingError(t("badPrice")); return; }
    if (!validPhone(phone)) { showListingError(t("badPhone")); return; }

    isPublishing = true;
    if (publishButton) { publishButton.disabled = true; publishButton.textContent = t("publishing"); }

    try {
      const image = await readAndResizeImage(file);
      const newListing = {
        id: makeId(), demo: false, name, category, county, town, price, unit,
        qty, sale, seller, phone, condition, description, harvestDate, image,
        createdAt: Date.now()
      };

      listings = [...listings, newListing];
      let storageWorked = saveUserListings();
      let photoDropped = false;

      if (!storageWorked && newListing.image) {
        const photo = newListing.image;
        newListing.image = "";
        storageWorked = saveUserListings();
        if (storageWorked) photoDropped = true;
        else newListing.image = photo;
      }

      activeCategory = "All";
      if ($("#searchInput")) $("#searchInput").value = "";
      if ($("#categoryFilter")) $("#categoryFilter").value = "All";
      if ($("#locationFilter")) $("#locationFilter").value = "All";
      if ($("#saleFilter")) $("#saleFilter").value = "All";
      if ($("#fairPriceFilter")) $("#fairPriceFilter").value = "All";
      if ($("#sortFilter")) $("#sortFilter").value = "newest";

      renderCategories();
      renderListings();
      updateHint();
      form.reset();
      closeModal("listingModal");

      if (!storageWorked) showToast(t("publishedNoSave"));
      else if (photoDropped) showToast(t("publishedNoPhoto"));
      else showToast(t("published"));

      $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("MavunoBridge listing publish error:", error);
      showListingError(error.message || t("publishFailed"));
    } finally {
      isPublishing = false;
      if (publishButton) { publishButton.disabled = false; publishButton.textContent = t("publish"); }
    }
  }

  /* CHAT HAND-OFF TO messages.html */
  function openChat(id) {
    const item = listings.find(listing => listing.id === id);
    if (!item) { showToast(t("cartNotFound")); return; }

    const payload = {
      productId: item.id, productName: item.name, seller: item.seller,
      county: item.county, phone: item.phone || "", price: Number(item.price) || 0,
      quantity: item.qty || "", saleType: item.sale || "Both",
      message: t("chatDraft", item.name)
    };

    if (!saveStorage(STORAGE.pendingChat, payload)) { showToast(t("chatFailed")); return; }
    window.location.href = "messages.html";
  }

  /* BUYER REQUEST PREFILL */
  function requestProduct() {
    const search = ($("#searchInput")?.value || "").trim();
    const wanted = search || (activeCategory !== "All" ? activeCategory : "");
    try { if (wanted) sessionStorage.setItem(PREFILL_KEY, wanted); }
    catch (error) { console.warn("Could not pass the search to the request board:", error); }
    window.location.href = "buyer-requests.html";
  }

  /* DEMO CART — NO REAL PAYMENT */
  function saveCart() {
    if (!saveStorage(STORAGE.cart, cart)) { showToast(t("cartSaveFail")); return false; }
    return true;
  }
  function addToCart(id) {
    const item = listings.find(listing => listing.id === id);
    if (!item) { showToast(t("cartNotFound")); return; }
    const existing = cart.find(entry => entry.id === id);
    if (existing) existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
    else cart.push({ id, quantity: 1 });
    if (saveCart()) { updateCartCount(); showToast(t("cartAdded", item.name)); }
  }
  function updateCartCount() {
    const count = $("#cartCount");
    if (!count) return;
    const total = cart.reduce((sum, entry) => sum + Math.max(1, Number(entry.quantity || 1)), 0);
    count.textContent = String(total);
  }
  function renderCart() {
    const container = $("#cartItems");
    if (!container) return;
    container.innerHTML = "";
    cart = cart.filter(entry => listings.some(item => item.id === entry.id));
    saveStorage(STORAGE.cart, cart);

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.textContent = t("cartEmpty");
      container.appendChild(empty);
      updateCartCount();
      return;
    }

    let total = 0;
    cart.forEach(entry => {
      const item = listings.find(listing => listing.id === entry.id);
      if (!item) return;
      const quantity = Math.max(1, Number(entry.quantity || 1));
      total += Number(item.price) * quantity;

      const row = document.createElement("div");
      row.className = "cart-item";
      const info = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = item.name;
      const detail = document.createElement("p");
      detail.textContent = `${quantity} × ${money(item.price)} / ${item.unit || "unit"} · ${item.seller || t("sellerFallback")}`;
      info.append(title, detail);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = t("remove");
      remove.dataset.removeCart = item.id;

      row.append(info, remove);
      container.appendChild(row);
    });

    const totalRow = document.createElement("p");
    totalRow.className = "cart-total";
    totalRow.style.fontWeight = "800";
    totalRow.style.marginTop = "18px";
    totalRow.textContent = t("subtotal", money(total));
    container.appendChild(totalRow);
    updateCartCount();
  }
  function removeFromCart(id) {
    cart = cart.filter(entry => entry.id !== id);
    saveCart();
    renderCart();
    showToast(t("cartRemoved"));
  }
  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    showToast(t("cartCleared"));
  }

  function clearFilters() {
    activeCategory = "All";
    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#categoryFilter")) $("#categoryFilter").value = "All";
    if ($("#locationFilter")) $("#locationFilter").value = "All";
    if ($("#saleFilter")) $("#saleFilter").value = "All";
    if ($("#fairPriceFilter")) $("#fairPriceFilter").value = "All";
    if ($("#sortFilter")) $("#sortFilter").value = "recommended";
    updateHint();
    renderCategories();
    renderListings();
  }

  /* LANGUAGE: keeps cards/cart/messages dynamic in all three modes. */
  const TRANSLATIONS = [
    [".main-nav a[href=\"#marketplace\"]", "Marketplace", "Soko"],
    [".main-nav a[href=\"smart-assist.html\"]", "Smart Assist", "Msaidizi Mahiri"],
    [".main-nav a[href=\"sacco.html\"]", "SACCO Hub", "Kituo cha SACCO"],
    [".main-nav a[href=\"buyer-requests.html\"]", "Buyer Requests", "Maombi ya Wanunuzi"],
    [".main-nav a[href=\"messages.html\"]", "Messages", "Ujumbe"],
    ["#authLink", "Sign in", "Ingia"], ["#signOutButton", "Sign out", "Toka"],
    [".hero .eyebrow", "KENYA'S FARM-TO-MARKET DEMO", "ONYESHO LA KENYA LA SHAMBANI HADI SOKONI"],
    [".hero h1", "Good harvests deserve <span>better markets.</span>", "Mavuno mazuri yanastahili <span>masoko bora.</span>", "html"],
    [".hero-description", "Connect directly with farmers, compare produce, discover opportunities and grow your business. Everything in one place.", "Wasiliana moja kwa moja na wakulima, linganisha mazao, gundua fursa na ukuze biashara yako. Yote mahali pamoja."],
    ["#heroSellButton", "+ Sell your produce", "+ Uza mazao yako"],
    [".category-section h2", "Explore categories", "Tazama aina za bidhaa"],
    [".marketplace h2", "Marketplace", "Soko"], ["#sellButton", "+ Create listing", "+ Tengeneza tangazo"],
    ["#searchInput", "Search maize, beans, avocados...", "Tafuta mahindi, maharagwe, parachichi...", "placeholder"],
    ["#showAllButton", "View all products →", "Tazama bidhaa zote →"],
    ["#clearFiltersButton", "Clear filters", "Futa vichujio"],
    ["#emptyState h3", "No listings found", "Hakuna matangazo yaliyopatikana"],
    ["#emptyState p", "Try another search or filter, or create a new listing.", "Jaribu utafutaji au kichujio kingine, au tengeneza tangazo jipya."],
    ["#emptySellButton", "Create a listing", "Tengeneza tangazo"],
    ["#emptyRequestButton", "Post a buyer request", "Weka ombi la mnunuzi"],
    ["#listingModalTitle", "Create a listing", "Tengeneza tangazo"],
    ["#listingModal .modal-card > p", "Fill in your details. Fields marked * are required.", "Jaza maelezo yako. Sehemu zenye * ni lazima."],
    ["#cartTitle", "Shopping cart", "Kikapu cha ununuzi"],
    ["#clearCartButton", "Clear cart", "Futa kikapu"]
  ];
  const originalTexts = new Map();
  let originalsCaptured = false;

  function findTarget(selector) {
    if (selector.charAt(0) === "^") {
      const field = $(selector.slice(1));
      return field ? field.closest("label") : null;
    }
    return $(selector);
  }
  function readText(element, mode) {
    if (mode === "placeholder") return element.placeholder;
    if (mode === "html") return element.innerHTML;
    if (element.children.length === 0) return element.textContent;
    const node = [...element.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
    return node ? node.nodeValue : "";
  }
  function writeText(element, mode, value) {
    if (mode === "placeholder") element.placeholder = value;
    else if (mode === "html") element.innerHTML = value;
    else if (element.children.length === 0) element.textContent = value;
    else {
      const node = [...element.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
      if (node) node.nodeValue = value;
    }
  }
  function captureOriginals() {
    if (originalsCaptured) return;
    originalsCaptured = true;
    TRANSLATIONS.forEach(([selector, , , mode]) => {
      const element = findTarget(selector);
      if (element && !originalTexts.has(element)) originalTexts.set(element, readText(element, mode));
    });
  }
  function applyLanguage(language) {
    currentLang = ["mix", "en", "sw"].includes(language) ? language : "mix";
    document.documentElement.lang = currentLang === "sw" ? "sw" : "en";
    captureOriginals();
    TRANSLATIONS.forEach(([selector, english, swahili, mode]) => {
      const element = findTarget(selector);
      if (!element) return;
      const original = originalTexts.get(element);
      const value = currentLang === "mix" ? original : currentLang === "sw" ? swahili : english;
      if (value !== undefined && value !== null) writeText(element, mode, value);
    });
    updateHint();
    renderListings();
    renderUser();
    const cartModal = $("#cartModal");
    if (cartModal && !cartModal.classList.contains("hidden")) renderCart();
    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }
  function restoreLanguage() {
    const saved = loadStorage(STORAGE.language, "mix");
    const select = $("#languageSelect");
    if (select) {
      select.value = ["mix", "en", "sw"].includes(saved) ? saved : "mix";
      applyLanguage(select.value);
    } else applyLanguage(saved);
  }

  /* EVENTS */
  function bindEvents() {
    $("#sellButton")?.addEventListener("click", openListingModal);
    $("#heroSellButton")?.addEventListener("click", openListingModal);
    $("#emptySellButton")?.addEventListener("click", openListingModal);
    $("#emptyRequestButton")?.addEventListener("click", requestProduct);
    $("#signOutButton")?.addEventListener("click", signOut);
    $("#listingForm")?.addEventListener("submit", handleListingSubmit);
    $("#showAllButton")?.addEventListener("click", () => {
      clearFilters();
      $("#marketplace")?.scrollIntoView({ behavior: "smooth" });
    });

    $("#categoryGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) selectCategory(button.dataset.category);
    });
    $("#categoryFilter")?.addEventListener("change", event => selectCategory(event.target.value || "All"));

    ["searchInput", "locationFilter", "saleFilter", "fairPriceFilter", "sortFilter"].forEach(id => {
      document.getElementById(id)?.addEventListener(id === "searchInput" ? "input" : "change", renderListings);
    });
    $("#clearFiltersButton")?.addEventListener("click", clearFilters);

    $("#listingGrid")?.addEventListener("click", event => {
      const addButton = event.target.closest("[data-add-cart]");
      if (addButton) { addToCart(addButton.dataset.addCart); return; }
      const chatButton = event.target.closest("[data-chat]");
      if (chatButton) openChat(chatButton.dataset.chat);
    });

    $("#cartButton")?.addEventListener("click", () => { renderCart(); openModal("cartModal"); });
    $("#cartItems")?.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-cart]");
      if (button) removeFromCart(button.dataset.removeCart);
    });
    $("#clearCartButton")?.addEventListener("click", clearCart);

    $$("[data-close]").forEach(button => {
      button.addEventListener("click", () => closeModal(button.dataset.close));
    });
    $$(".modal").forEach(modal => {
      modal.addEventListener("click", event => {
        if (event.target === modal) closeModal(modal.id);
      });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") $$(".modal:not(.hidden)").forEach(modal => closeModal(modal.id));
    });

    $("#menuButton")?.addEventListener("click", () => {
      const nav = $("#mainNav");
      const button = $("#menuButton");
      if (!nav || !button) return;
      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    $("#mainNav")?.addEventListener("click", event => {
      if (event.target.closest("a")) {
        $("#mainNav")?.classList.remove("open");
        $("#menuButton")?.setAttribute("aria-expanded", "false");
      }
    });

    $("#languageSelect")?.addEventListener("change", event => {
      saveStorage(STORAGE.language, event.target.value);
      applyLanguage(event.target.value);
      showToast(t("langChanged"));
    });
  }

  function safely(label, step) {
    try { step(); }
    catch (error) { console.error(`MavunoBridge: "${label}" failed`, error); }
  }

  function init() {
    // Run only on the marketplace page. Other pages have their own scripts.
    if (!$("#listingGrid")) {
      console.info("MavunoBridge: marketplace grid is not on this page; skipping marketplace startup.");
      return;
    }

    safely("load demo and user listings", loadData);
    safely("fill category/county selects", populateSelects);
    safely("bind marketplace events", bindEvents);
    safely("render categories", renderCategories);
    safely("render listings", renderListings);
    safely("render signed-in user", renderUser);
    safely("update cart count", updateCartCount);
    safely("restore language", restoreLanguage);

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    console.info(
      `MavunoBridge ready: ${listings.length} listings loaded, including ${DEMO_LISTINGS.length} built-in demo listings.`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
