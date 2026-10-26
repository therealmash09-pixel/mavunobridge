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
    pendingChat: "mavunobridge_pending_chat_v1",
    groupBuys: "mavunobridge_group_buys_v1",
    preOrders: "mavunobridge_preorders_v1",
    deliveryRequests: "mavunobridge_delivery_requests_v1",
    countyCircles: "mavunobridge_county_circles_v1",
    plantingAlerts: "mavunobridge_planting_alerts_v1",
    demoReviews: "mavunobridge_demo_reviews_v1",
    learningProgress: "mavunobridge_learning_progress_v1"
  };

  const LEGACY_LISTING_KEYS = [
    "mavunobridge_listings_v5",
    "mavunobridge_listings_v4",
    "shambamarket_listings_v4"
  ];

  const PREFILL_KEY = "mavunobridge_prefill_demand";
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

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
      image: "https://cdn.mafrservices.com/pim-content/KEN/media/product/1482/1776092400/1482_main.jpg",
      description: "Fresh kale in bunches from a sample produce listing.", createdAt: 6
    },
    {
      id: "demo-cabbage", demo: true, name: "Green Cabbages",
      category: "Vegetables", county: "Nyandarua", town: "Ol Kalou",
      price: 45, unit: "piece", qty: "100 heads", sale: "Both",
      seller: "Ol Kalou Vegetable Farm", phone: "0700112244",
      image: "https://cdn.shopify.com/s/files/1/0470/7306/7165/files/freshpoint-green-cabbage-1000x1000.jpg?v=1728919839",
      description: "Green cabbages sold by piece or in bulk.", createdAt: 7
    },

    // NUTS
    {
      id: "demo-groundnuts", demo: true, name: "Groundnuts (Peanuts)",
      category: "Nuts", county: "Kilifi", town: "Malindi",
      price: 220, unit: "kg", qty: "35 kg", sale: "Both",
      seller: "Coastal Harvest", phone: "0712345601",
      image: "https://finefolk.ch/cdn/shop/files/finefolk-runner-peanuts.jpg?v=1757598353&width=1200",
      description: "Groundnuts from a sample coastal seller.", createdAt: 8
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
      image: "https://www.akkerbouwbedrijf.nl/content/uploads/sites/10/2021/12/zoeteaardappelennetuitdegrond.jpg",
      description: "Orange-fleshed sweet potatoes sold by kilogram.", createdAt: 10
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
      image: "https://i.brecorder.com/large/2026/03/31112158329b037.webp",
      description: "Sample wheat grain listing for bulk buyers.", createdAt: 12
    },

    // CEREALS
    {
      id: "demo-millet", demo: true, name: "Finger Millet (Wimbi)",
      category: "Cereals", county: "Kakamega", town: "Kakamega",
      price: 140, unit: "kg", qty: "70 kg", sale: "Bulk",
      seller: "Kakamega Wimbi Group", phone: "0799001122",
      image: "https://ppmoilmill.com/cdn/shop/files/Finger_Millet_1.webp?v=1758176944&width=1200",
      description: "Finger millet for food preparation and milling.", createdAt: 13
    },
    {
      id: "demo-sorghum", demo: true, name: "Sorghum Grain",
      category: "Cereals", county: "Kitui", town: "Kitui",
      price: 95, unit: "kg", qty: "90 kg", sale: "Both",
      seller: "Kitui Cereal Growers", phone: "0712345623",
      image: "https://img500.exportersindia.com/product_images/bc-500/2024/8/13582260/richbloom-sorghum-seeds-1722589470-7524009.jpg",
      description: "Sorghum grain available in sample quantities.", createdAt: 14
    },

    // LEGUMES
    {
      id: "demo-beans", demo: true, name: "Rosecoco Beans",
      category: "Legumes", county: "Meru", town: "Meru",
      price: 150, unit: "kg", qty: "60 kg", sale: "Both",
      seller: "Meru Bean Farmers", phone: "0744556677",
      image: "https://britnuts.co.uk/cdn/shop/files/rosecoco-beans.jpg?v=1694121682",
      description: "Dry Rosecoco beans for home and business use.", createdAt: 15
    },
    {
      id: "demo-green-grams", demo: true, name: "Green Grams (Ndengu)",
      category: "Legumes", county: "Machakos", town: "Mwala",
      price: 180, unit: "kg", qty: "45 kg", sale: "Both",
      seller: "Machakos Dry Foods", phone: "0766778899",
      image: "https://www.grocery.com/store/image/cache/catalog/aiva-we-believe-in-quality/aiva-green-moong-whole-mung-beans-green-gram-natur-0-500x500w.jpg",
      description: "Green grams from a sample seller.", createdAt: 16
    },
    {
      id: "demo-cowpeas", demo: true, name: "Cowpeas (Kunde Seeds)",
      category: "Legumes", county: "Kitui", town: "Mwingi",
      price: 130, unit: "kg", qty: "50 kg", sale: "Bulk",
      seller: "Mwingi Legume Group", phone: "0712345634",
      image: "https://organicsphere.com/cdn/shop/files/il_1588xN.3243093955_ox5e.jpg?v=1758899103",
      description: "Dry cowpeas for cooking or planting only when seed suitability is confirmed with the seller.", createdAt: 17
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
      image: "https://images.ctfassets.net/3s5io6mnxfqz/3l70gsqlimAbkHsfA6jLkb/4a530ade13a910b3792103aafb56d1b6/AdobeStock_384941354_2.jpeg?w=1200",
      description: "Fresh ginger root for cooking.", createdAt: 19
    },

    // HERBAL PRODUCTS
    {
      id: "demo-lemongrass", demo: true, name: "Dried Lemongrass",
      category: "Herbal Products", county: "Kiambu", town: "Thika",
      price: 250, unit: "kg", qty: "12 kg", sale: "Retail",
      seller: "Thika Herb Garden", phone: "0700112255",
      image: "https://dehaat.in/_next/image?q=75&url=https%3A%2F%2Fdehaat-kheti-prod.s3.amazonaws.com%2Fdjango-summernote%2F2021-07-26%2F147502b5-893c-4eff-8648-aed85183b153.png&w=3840",
      description: "Dried lemongrass sold as a herbal plant product. No medical claims are made.", createdAt: 20
    },
    {
      id: "demo-aloe", demo: true, name: "Aloe Vera Leaves",
      category: "Herbal Products", county: "Makueni", town: "Wote",
      price: 30, unit: "piece", qty: "80 leaves", sale: "Retail",
      seller: "Wote Plant Nursery", phone: "0700112266",
      image: "https://greenparadiselive.com/cdn/shop/files/Aloe_vera_plant_1.png?v=1729578285&width=1920",
      description: "Aloe vera leaves sold as a plant product; use and suitability should be checked independently.", createdAt: 21
    },

    // LIVESTOCK
    {
      id: "demo-chicken", demo: true, name: "Indigenous Chickens",
      category: "Livestock", county: "Kakamega", town: "Shinyalu",
      price: 1200, unit: "animal", qty: "12 birds", sale: "Retail",
      seller: "Western Poultry Demo Farm", phone: "0700223344",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=80",
      description: "Sample livestock listing. Confirm age and availability with the seller.", createdAt: 22
    },
    {
      id: "demo-goat", demo: true, name: "Dairy Goat",
      category: "Livestock", county: "Nyeri", town: "Othaya",
      price: 12500, unit: "animal", qty: "2 goats", sale: "Retail",
      seller: "Othaya Livestock Demo Farm", phone: "0700223355",
      image: "https://images.pexels.com/photos/15084412/pexels-photo-15084412.jpeg?auto=compress&cs=tinysrgb&w=900",
      description: "Sample dairy-goat listing. Confirm breed, health records and availability with the seller.", createdAt: 23
    },

    // LIVESTOCK PRODUCE
    {
      id: "demo-eggs", demo: true, name: "Fresh Chicken Eggs",
      category: "Livestock Produce", county: "Kiambu", town: "Ruiru",
      price: 450, unit: "tray", qty: "20 trays", sale: "Both",
      seller: "Ruiru Poultry Demo Farm", phone: "0700334455",
      image: "https://www.puga.es/php/thumbnail.php?alto=550&ancho=550&carpeta=articulos&img=articulo12343_1.jpg",
      description: "Sample egg listing. Confirm tray size and availability with seller.", createdAt: 24
    },
    {
      id: "demo-milk", demo: true, name: "Raw Cow's Milk",
      category: "Livestock Produce", county: "Nakuru", town: "Njoro",
      price: 70, unit: "litre", qty: "40 litres", sale: "Retail",
      seller: "Njoro Dairy Demo Farm", phone: "0700334466",
      image: "https://static.tygodnik-rolniczy.pl/images/2022/10/21/219264.webp",
      description: "Illustrative raw-milk listing. Buyers should follow local food-safety and handling requirements.", createdAt: 25
    },

    // AGRICULTURAL INPUTS
    {
      id: "demo-onion-seedlings", demo: true, name: "Onion Seedlings",
      category: "Agricultural Inputs", county: "Nakuru", town: "Njoro",
      price: 2, unit: "piece", qty: "2,000 onion seedlings", sale: "Both",
      seller: "Njoro Seedling Nursery", phone: "0700445566",
      image: "https://www.jains.com/Tissue/Nursery/images/Seedling/Onion_770x441.jpg",
      description: "Onion seedlings for transplanting. Confirm onion variety, seedling age and quantity before purchase.", createdAt: 26
    },
    {
      id: "demo-tomato-seedlings", demo: true, name: "Tomato Seedlings",
      category: "Agricultural Inputs", county: "Kiambu", town: "Limuru",
      price: 3, unit: "piece", qty: "1,500 tomato seedlings", sale: "Both",
      seller: "Limuru Seedling Nursery", phone: "0700445577",
      image: "https://tarimdanhabercom.teimg.com/tarimdanhaber-com/images/upload/domatesfidesi_1.jpg",
      description: "Tomato seedlings. Ask the nursery which tomato variety is available.", createdAt: 27
    },
    {
      id: "demo-cabbage-seedlings", demo: true, name: "Cabbage Seedlings",
      category: "Agricultural Inputs", county: "Nyandarua", town: "Ol Kalou",
      price: 2, unit: "piece", qty: "1,000 cabbage seedlings", sale: "Both",
      seller: "Ol Kalou Seedling Nursery", phone: "0700445588",
      image: "https://www.epicgardening.com/wp-content/uploads/2023/05/Sowing-Cabbage-Seeds-Indoor.jpeg",
      description: "Cabbage seedlings ready for transplanting. Confirm the variety with the nursery.", createdAt: 28
    },
    {
      id: "demo-maize-seeds", demo: true, name: "Certified Maize Seeds",
      category: "Agricultural Inputs", county: "Trans Nzoia", town: "Kitale",
      price: 450, unit: "unit", qty: "15 packets", sale: "Retail",
      seller: "Kitale Farm Inputs Demo Shop", phone: "0700445599",
      image: "https://imaginecare.co.ke/wp-content/uploads/2022/09/Kenya-Seed-Maize-H629-Highland-2kg.jpg",
      description: "Sample maize-seed listing. Confirm seed variety, packet weight and certification details with seller.", createdAt: 29
    },
    {
      id: "demo-compost", demo: true, name: "Organic Farm Compost",
      category: "Agricultural Inputs", county: "Murang'a", town: "Kangema",
      price: 250, unit: "bag", qty: "40 bags", sale: "Both",
      seller: "Kangema Soil Care Demo", phone: "0700445500",
      image: "https://grow.ifa.coop/hs-fs/hubfs/Imported_Blog_Media/webimg_oakdell_compost.jpg?height=1800&name=webimg_oakdell_compost.jpg&width=1800",
      description: "Sample compost listing; check bag size and contents with seller.", createdAt: 30
    },

    // FARM TOOLS & EQUIPMENT
    {
      id: "demo-jembe", demo: true, name: "Jembe Hand Hoe",
      category: "Farm Tools & Equipment", county: "Nairobi City", town: "Nairobi",
      price: 650, unit: "unit", qty: "20 hoes", sale: "Retail",
      seller: "Farm Tools Demo Shop", phone: "0700556677",
      image: "https://www.lehmans.com/cdn/shop/files/504eb2714521519b1600d3b4e45e9fe278213a48_100068957_1_L.png?v=1778777825&width=800",
      description: "Sample listing for jembe hand hoes. Confirm handle and head type with seller.", createdAt: 31
    },
    {
      id: "demo-sprayer", demo: true, name: "Knapsack Sprayer",
      category: "Farm Tools & Equipment", county: "Nakuru", town: "Nakuru",
      price: 3500, unit: "unit", qty: "8 sprayers", sale: "Retail",
      seller: "Nakuru Equipment Demo Shop", phone: "0700556688",
      image: "https://image.made-in-china.com/2f0j00OZTiVaWgHlry/16-Litres-Agriculture-Knapsack-Hand-Sprayer-Pump-for-Farm.webp",
      description: "Sample knapsack sprayer listing. Confirm capacity and condition before purchase.", createdAt: 32
    },

    // FARMER SERVICES
    {
      id: "demo-plough", demo: true, name: "Land Ploughing Service",
      category: "Farmer Services", county: "Trans Nzoia", town: "Kitale",
      price: 3500, unit: "service", qty: "Bookings by arrangement", sale: "Both",
      seller: "Kitale Farm Services Demo", phone: "0700667788",
      image: "https://stories.cpre.org.uk/saveoursoils/assets/hgVcNoUE0l/tractor-ploughing-2560x1707.jpeg",
      description: "Example ploughing service. Confirm acreage, date and final cost.", createdAt: 33
    },
    {
      id: "demo-tractor-hire", demo: true, name: "Tractor Hire Service",
      category: "Farmer Services", county: "Uasin Gishu", town: "Eldoret",
      price: 5000, unit: "service", qty: "Bookings by arrangement", sale: "Both",
      seller: "Eldoret Machinery Demo", phone: "0700667799",
      image: "https://agrigoindia.com/assets/tractors.jpg",
      description: "Sample tractor-hire service. Confirm hourly/acre rate, fuel, schedule and travel costs.", createdAt: 34
    },
    {
      id: "demo-soil-test", demo: true, name: "Farm Soil Testing Service",
      category: "Farmer Services", county: "Nairobi City", town: "Nairobi",
      price: 1500, unit: "service", qty: "Appointments available", sale: "Retail",
      seller: "Agri Test Demo Service", phone: "0700667700",
      image: "https://orbitoglobal.com/wp-content/uploads/2024/05/Lab-Tester-4-1024x678.jpg",
      description: "Illustrative soil-testing service. Ask the provider what the test includes and how to submit a sample.", createdAt: 35
    },
    {
      id: "demo-maize-starter-bundle", demo: true, name: "Quarter-Acre Maize Starter Bundle",
      category: "Agricultural Inputs", county: "Trans Nzoia", town: "Kitale",
      price: 3600, unit: "bundle", qty: "1 sample starter bundle", sale: "Retail",
      seller: "MavunoBridge Input Bundle Demo", phone: "0700445501",
      image: "https://imaginecare.co.ke/wp-content/uploads/2022/09/Kenya-Seed-Maize-H629-Highland-2kg.jpg",
      description: "Illustrative input bundle concept: maize seed, a crop-planning checklist and a fertiliser-planning guide. Confirm product varieties, quantities and suitability with the supplier; delivery and fertiliser are not guaranteed to be included.", createdAt: 36
    }
  ];

  let listings = [];
  let cart = [];
  let activeCategory = "All";
  let visibleListingLimit = 12;
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

  function populateSelects() {
    const categoryFilter = $("#categoryFilter");
    const productCategory = $("#productCategory");
    const locationFilter = $("#locationFilter");
    const productCounty = $("#productCounty");

    if (categoryFilter) {
      const current = categoryFilter.value || "All";
      categoryFilter.innerHTML = '<option value="All">All Products</option>';
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

    if (categoryImageObserver) {
      categoryImageObserver.disconnect();
      categoryImageObserver = null;
    }

    const canObserve = "IntersectionObserver" in window;

    if (canObserve) {
      categoryImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const imageEl = entry.target;
          const imageUrl = imageEl.dataset.categoryImage;
          if (imageUrl) {
            imageEl.style.backgroundImage = `url("${imageUrl.replace(/"/g, "%22")}")`;
            imageEl.removeAttribute("data-category-image");
          }
          observer.unobserve(imageEl);
        });
      }, { rootMargin: "80px 0px" });
    }

    // All Products is a marketplace view only; never add it to seller categories.
    const categoryCards = [
      ["All Products", "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=75", "All"],
      ...CATEGORIES.map(([name, image]) => [name, image, name])
    ];

    categoryCards.forEach(([label, image, categoryValue]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.dataset.category = categoryValue;
      const selected = activeCategory === categoryValue;
      button.setAttribute("aria-pressed", String(selected));
      if (selected) button.classList.add("selected");
      button.innerHTML = `<span class="cat-image"></span><span class="cat-shade"></span><span class="cat-name">${escapeHTML(label)}</span>`;

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
    visibleListingLimit = 12;
    const filter = $("#categoryFilter");
    if (filter) filter.value = activeCategory;
    renderCategories();
    renderListings();
    updateHint();
    $("#marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getFairPrice(item) {
    const name = String(item.name || "").toLowerCase();
    const guide = FAIR_GUIDE.find(entry => entry.match(name));
    if (!guide || item.unit !== "kg") return { status: "no-guide", label: t("fairNoLabel"), detail: t("fairNoDetail") };

    const detail = `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`;
    if (Number(item.price) < guide.min) return { status: "below", label: t("fairBelow"), detail };
    if (Number(item.price) > guide.max) return { status: "above", label: t("fairAbove"), detail };
    return { status: "within", label: t("fairWithin"), detail };
  }

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

  function setImageFallback(image, item) {
    if (!image || image.dataset.fallbackApplied === "yes") return;
    image.dataset.fallbackApplied = "yes";

    const fallback = document.createElement("div");
    fallback.className = "product-image-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", `Photo unavailable for ${item?.name || "this product"}`);
    fallback.textContent = "Photo not available";
    fallback.style.display = "flex";
    fallback.style.alignItems = "center";
    fallback.style.justifyContent = "center";
    fallback.style.flexDirection = "column";
    fallback.style.minHeight = "150px";
    fallback.style.width = "100%";
    fallback.style.padding = "16px";
    fallback.style.boxSizing = "border-box";
    fallback.style.background = "linear-gradient(135deg, #edf4e7, #dce8d3)";
    fallback.style.color = "#36553b";
    fallback.style.textAlign = "center";
    fallback.style.fontSize = "0.9rem";
    fallback.style.fontWeight = "700";
    image.replaceWith(fallback);
  }
    function renderListings() {
    const grid = $("#listingGrid");
    if (!grid) return;

    const results = getFilteredListings();
    const visibleResults = results.slice(0, visibleListingLimit);
    grid.innerHTML = "";

    visibleResults.forEach(item => {
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
      image.fetchPriority = "low";
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

      const profileStatus = document.createElement("p");
      profileStatus.className = "seller-trust-note";
      profileStatus.textContent = item.demo
        ? "Sample seller profile · not independently verified"
        : "Seller-provided profile · confirm details before agreeing";

      const reviewSummary = document.createElement("p");
      reviewSummary.className = "seller-review-summary";
      const localReviews = getLocalArray(STORAGE.demoReviews).filter(review => review.productId === item.id);
      if (localReviews.length) {
        const average = localReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / localReviews.length;
        reviewSummary.textContent = `⭐ ${average.toFixed(1)}/5 · ${localReviews.length} local demo review${localReviews.length === 1 ? "" : "s"} (not verified)`;
      } else {
        reviewSummary.textContent = "No local demo reviews yet";
      }

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

      const groupButton = document.createElement("button");
      groupButton.type = "button";
      groupButton.className = "small mb-action-button";
      groupButton.dataset.mbAction = "group-buy";
      groupButton.dataset.listingId = item.id;
      groupButton.textContent = "Join group buy";

      const preorderButton = document.createElement("button");
      preorderButton.type = "button";
      preorderButton.className = "small mb-action-button";
      preorderButton.dataset.mbAction = "preorder";
      preorderButton.dataset.listingId = item.id;
      preorderButton.textContent = "Pre-order interest";

      const deliveryButton = document.createElement("button");
      deliveryButton.type = "button";
      deliveryButton.className = "small mb-action-button";
      deliveryButton.dataset.mbAction = "delivery";
      deliveryButton.dataset.listingId = item.id;
      deliveryButton.textContent = "Request delivery quote";

      const reviewButton = document.createElement("button");
      reviewButton.type = "button";
      reviewButton.className = "small mb-action-button";
      reviewButton.dataset.mbAction = "review";
      reviewButton.dataset.listingId = item.id;
      reviewButton.textContent = "Delivery review (demo)";

      const callLink = document.createElement("a");
      callLink.className = "small call-link";
      callLink.textContent = t("contact");
      const phone = normalizePhone(item.phone);
      if (phone) {
        callLink.href = `tel:${phone}`;
      } else {
        callLink.href = "#";
        callLink.addEventListener("click", event => {
          event.preventDefault();
          showToast(t("noContact"));
        });
      }

      actions.append(
        addButton,
        chatButton,
        groupButton,
        preorderButton,
        deliveryButton,
        reviewButton,
        callLink
      );

      body.append(category, title, location, profileStatus, reviewSummary, price, fairBadge, fairDetail, quantity);
      if (description.textContent) body.appendChild(description);
      body.appendChild(actions);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    const resultCount = $("#resultCount");
    if (resultCount) resultCount.textContent = t("showing", results.length);

    const active = $("#activeCategory");
    if (active) {
      active.textContent = activeCategory === "All" ? "" : t("categoryLabel", activeCategory);
    }

    const empty = $("#emptyState");
    if (empty) empty.classList.toggle("hidden", results.length > 0);
    grid.classList.toggle("hidden", results.length === 0);

    let moreButton = $("#loadMoreListingsButton");
    if (!moreButton) {
      moreButton = document.createElement("button");
      moreButton.id = "loadMoreListingsButton";
      moreButton.type = "button";
      moreButton.className = "primary-btn mb-load-more";
      moreButton.textContent = "Load more listings";
      grid.insertAdjacentElement("afterend", moreButton);
      moreButton.addEventListener("click", () => {
        visibleListingLimit += 12;
        renderListings();
      });
    }

    const remaining = Math.max(0, results.length - visibleResults.length);
    moreButton.hidden = remaining === 0;
    moreButton.textContent = remaining > 0
      ? `Load ${Math.min(12, remaining)} more listings (${remaining} remaining)`
      : "All listings shown";
  }

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
    const modal = $("#listingModal");
    if (!modal) {
      console.error("MavunoBridge: #listingModal is missing from index.html");
      showToast("The listing form is missing. Check index.html and refresh.");
      return;
    }
    const user = getUser();
    const sellerName = $("#sellerName");
    if (user && sellerName && !sellerName.value.trim()) {
      sellerName.value = String(user.name).trim();
    }
    openModal("listingModal");
    window.setTimeout(() => $("#productName")?.focus(), 0);
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

  function requestProduct() {
    const search = ($("#searchInput")?.value || "").trim();
    const wanted = search || (activeCategory !== "All" ? activeCategory : "");
    try { if (wanted) sessionStorage.setItem(PREFILL_KEY, wanted); }
    catch (error) { console.warn("Could not pass the search to the request board:", error); }
    window.location.href = "buyer-requests.html";
  }

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
    const total = cart.reduce((sum, entry) => sum + Math.max(1, Number(entry.quantity || 1), 0), 0);
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
    visibleListingLimit = 12;
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
    /* =========================================================
     MAVUNOBRIDGE UNIQUE DEMO FEATURES
     Mavuno Pool, HarvestLink, FreshRoute, FarmProof, GrowCircles,
     Planting Watch and Mavuno Learn. These store local demo entries;
     they do not claim live bookings, delivery ETAs, SMS or payments.
  ========================================================= */

  let mavunoFeatureModal = null;
  let mavunoFeatureContext = null;

  function getLocalArray(storageKey) {
    const value = loadStorage(storageKey, []);
    return Array.isArray(value) ? value : [];
  }

  function saveLocalRecord(storageKey, record) {
    const records = getLocalArray(storageKey);
    records.push({ ...record, createdAt: Date.now(), demoOnly: true });
    return saveStorage(storageKey, records);
  }

  function addMavunoFeatureStyles() {
    if ($("#mavunoFeatureStyles")) return;

    const style = document.createElement("style");
    style.id = "mavunoFeatureStyles";

    style.textContent = `
      .mb-innovation-hub { margin: 8px auto 62px; }
      .mb-innovation-header { max-width: 760px; margin: 0 0 20px; }
      .mb-innovation-header h2 { margin-bottom: 8px; color: var(--green-950, #163321); }
      .mb-innovation-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
      .mb-innovation-card { min-width: 0; padding: 19px; border: 1px solid #dfe7dc; border-radius: 16px; background: #fff; box-shadow: 0 4px 14px rgba(27,56,34,.06); }
      .mb-innovation-card h3 { margin: 9px 0 8px; font-size: 1rem; color: #1e402b; }
      .mb-innovation-card p { margin: 0 0 14px; font-size: .82rem; line-height: 1.55; }
      .mb-innovation-icon { font-size: 1.55rem; }
      .mb-innovation-card button, .mb-innovation-card a { width: 100%; min-height: 38px; }
      .seller-trust-note { margin: -3px 0 4px; color: #6d796e; font-size: .67rem; line-height: 1.4; }
      .seller-review-summary { margin: 0 0 10px; color: #536d48; font-size: .68rem; line-height: 1.4; }
      .mb-action-button { border-color: #d2e2cb !important; background: #f5faf1 !important; color: #315b36 !important; }
      .mb-action-button:hover { background: #e8f2e2 !important; }
      .mb-load-more { display: flex; margin: 20px auto 0; }
      .mb-load-more[hidden] { display:none!important; }
      .mb-feature-modal { position:fixed; inset:0; z-index:7000; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,31,20,.62); }
      .mb-feature-modal[hidden] { display:none!important; }
      .mb-feature-dialog { width:min(560px,100%); max-height:90vh; overflow:auto; padding:24px; border-radius:19px; background:#fff; box-shadow:0 20px 70px #0f23154d; }
      .mb-feature-dialog h2 { margin:0 44px 8px 0; color:#163321; font-size:1.45rem; }
      .mb-feature-dialog > p { font-size:.86rem; line-height:1.6; }
      .mb-feature-close { float:right; width:36px; height:36px; border:1px solid #dfe7dc; border-radius:50%; background:#f7faf5; color:#1e402b; font-size:22px; cursor:pointer; }
      .mb-feature-form { display:grid; gap:13px; margin-top:17px; }
      .mb-feature-form label { display:grid; gap:6px; color:#34483a; font-size:.83rem; font-weight:700; }
      .mb-feature-form input, .mb-feature-form select, .mb-feature-form textarea { width:100%; min-height:42px; padding:10px 12px; border:1px solid #d5dfd2; border-radius:10px; font:inherit; }
      .mb-feature-modal-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:9px; margin-top:18px; }
      .mb-feature-note { padding:10px 12px; border-radius:10px; background:#f4f8f1; color:#5a6c5b; font-size:.76rem; line-height:1.5; }
      @media(max-width:1000px){.mb-innovation-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
      @media(max-width:560px){.mb-innovation-grid{grid-template-columns:1fr;}.mb-feature-dialog{padding:18px;}}
    `;

    document.head.appendChild(style);
  }

  function renderMavunoInnovationHub() {
    addMavunoFeatureStyles();

    if ($("#mavunoInnovationHub")) return;

    const anchor = $(".feature-strip");
    if (!anchor) return;

    const section = document.createElement("section");
    section.id = "mavunoInnovationHub";
    section.className = "section-wrap mb-innovation-hub";

    section.innerHTML = `
      <div class="mb-innovation-header">
        <span class="eyebrow">BUILT FOR KENYAN FARMERS</span>
        <h2>MavunoBridge Plus</h2>
        <p>More than a soko: pool orders, plan harvest sales, request logistics and learn locally. These are interactive demo workflows, not live bookings or payments.</p>
      </div>

      <div class="mb-innovation-grid">
        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🤝</span>
          <h3>Mavuno Pool</h3>
          <p>Record interest in buying inputs together with nearby farmers to explore bulk pricing.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="group-buy">Start a group-buy</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🌱</span>
          <h3>AgriBundle Builder</h3>
          <p>Find starter bundles and coordinate seed, planting guide and input needs from one listing.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="bundle">Explore input bundles</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🗓️</span>
          <h3>HarvestLink</h3>
          <p>Register a local pre-order interest for a crop, quantity and expected harvest date.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="preorder">Plan a pre-order</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🚚</span>
          <h3>FreshRoute</h3>
          <p>Capture a delivery-quote request with destination and quantity. No fake ETA or fee is shown.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="delivery">Request a quote</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧾</span>
          <h3>FarmProof reviews</h3>
          <p>Record a demo delivery confirmation before submitting a local review. This is not independent verification.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="review">Review a listing</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">👩🏽‍🌾</span>
          <h3>County Grower Circles</h3>
          <p>Save your county and crop interests to model local groups for crop advice, transport and buyer leads.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="circle">Join a local circle</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🌦️</span>
          <h3>Planting Watch</h3>
          <p>Save county and crop alert preferences. This demo does not send live SMS or WhatsApp alerts.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="alerts">Set alert preferences</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">📚</span>
          <h3>Mavuno Learn</h3>
          <p>Explore bite-sized lessons on nursery preparation, safe pest checks and post-harvest handling.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="learn">Open mini lessons</button>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧑🏽‍🌾</span>
          <h3>Ask an agronomy question</h3>
          <p>Use the Smart Assist demo to organise a crop question before consulting a local extension officer.</p>
          <a class="outline-btn" href="smart-assist.html">Open Smart Assist</a>
        </article>

        <article class="mb-innovation-card">
          <span class="mb-innovation-icon">🧪</span>
          <h3>Soil-test match</h3>
          <p>Find the sample soil-testing service listing and ask the provider what its test covers.</p>
          <button type="button" class="outline-btn" data-mavuno-feature="soil-test">Find soil testing</button>
        </article>
      </div>
    `;

    anchor.insertAdjacentElement("afterend", section);
  }

  function ensureMavunoFeatureModal() {
    if (mavunoFeatureModal) return mavunoFeatureModal;

    const modal = document.createElement("div");
    modal.id = "mavunoFeatureModal";
    modal.className = "mb-feature-modal";
    modal.hidden = true;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "mbFeatureTitle");

    modal.innerHTML = `
      <div class="mb-feature-dialog">
        <button type="button" class="mb-feature-close" aria-label="Close">×</button>
        <h2 id="mbFeatureTitle">MavunoBridge feature</h2>
        <p id="mbFeatureDescription"></p>
        <form class="mb-feature-form" id="mbFeatureForm"></form>
        <div class="mb-feature-modal-actions">
          <button type="button" class="outline-btn" id="mbFeatureCancel">Cancel</button>
          <button type="submit" form="mbFeatureForm" class="primary-btn" id="mbFeatureSubmit">Save demo entry</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".mb-feature-close").addEventListener(
      "click",
      closeMavunoFeatureModal
    );

    modal.querySelector("#mbFeatureCancel").addEventListener(
      "click",
      closeMavunoFeatureModal
    );

    modal.addEventListener("click", event => {
      if (event.target === modal) closeMavunoFeatureModal();
    });

    modal.querySelector("#mbFeatureForm").addEventListener(
      "submit",
      submitMavunoFeature
    );

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) {
        closeMavunoFeatureModal();
      }
    });

    mavunoFeatureModal = modal;
    return modal;
  }

  function addFeatureCountySelect(form, value = "") {
    const label = document.createElement("label");
    label.textContent = "County *";

    const select = document.createElement("select");
    select.name = "county";
    select.required = true;
    select.add(new Option("Choose a county", ""));

    COUNTIES.forEach(county => select.add(new Option(county, county)));

    if (COUNTIES.includes(value)) select.value = value;

    label.appendChild(select);
    form.appendChild(label);
  }

  function addFeatureField(
    form,
    labelText,
    name,
    placeholder,
    type = "text",
    required = true
  ) {
    const label = document.createElement("label");
    label.appendChild(
      document.createTextNode(labelText + (required ? " *" : ""))
    );

    let field;

    if (type === "textarea") {
      field = document.createElement("textarea");
      field.rows = 3;
    } else {
      field = document.createElement("input");
      field.type = type;
    }

    field.name = name;
    field.placeholder = placeholder || "";
    field.required = required;

    if (type === "number") field.min = "1";
    if (type === "date") field.min = new Date().toISOString().slice(0, 10);

    label.appendChild(field);
    form.appendChild(label);
  }

  function openMavunoFeature(type, item = null) {
    if (type === "bundle") {
      const search = $("#searchInput");
      if (search) search.value = "starter bundle";

      activeCategory = "Agricultural Inputs";
      visibleListingLimit = 12;

      const filter = $("#categoryFilter");
      if (filter) filter.value = "Agricultural Inputs";

      updateHint();
      renderCategories();
      renderListings();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      showToast(
        "Showing the sample input bundle. Confirm the actual contents with the supplier."
      );
      return;
    }

    if (type === "soil-test") {
      const search = $("#searchInput");
      if (search) search.value = "Farm Soil Testing Service";

      activeCategory = "Farmer Services";
      visibleListingLimit = 12;

      const filter = $("#categoryFilter");
      if (filter) filter.value = "Farmer Services";

      updateHint();
      renderCategories();
      renderListings();

      $("#marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    const modal = ensureMavunoFeatureModal();
    const title = modal.querySelector("#mbFeatureTitle");
    const description = modal.querySelector("#mbFeatureDescription");
    const form = modal.querySelector("#mbFeatureForm");
    const submit = modal.querySelector("#mbFeatureSubmit");

    submit.hidden = false;
    modal.querySelector("#mbFeatureCancel").textContent = "Cancel";
    form.innerHTML = "";

    mavunoFeatureContext = { type, item };

    const name = item ? item.name : "";
    const demoNote = document.createElement("p");
    demoNote.className = "mb-feature-note";

    if (type === "group-buy") {
      title.textContent = item
        ? `Mavuno Pool: ${name}`
        : "Mavuno Pool · Group buying";

      description.textContent =
        "Register local interest in pooling an order with other farmers or buyers. This demo does not place an order or guarantee a bulk discount.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Product or input needed",
          "productName",
          "e.g. certified maize seed"
        );
      }

      addFeatureField(
        form,
        "Approximate quantity needed",
        "quantity",
        "e.g. 5 bags or 200 kg"
      );

      addFeatureField(
        form,
        "Preferred county or delivery area",
        "area",
        item?.county || "e.g. Nakuru",
        "text",
        true
      );

      addFeatureField(form, "Target date (optional)", "targetDate", "", "date", false);

      demoNote.textContent =
        "Saved on this device only. No buyer group, price negotiation or payment is actually created.";

      form.appendChild(demoNote);
      submit.textContent = "Save group-buy interest";

    } else if (type === "preorder") {
      title.textContent = item
        ? `HarvestLink: ${name}`
        : "HarvestLink · Pre-order interest";

      description.textContent =
        "Record the quantity and expected date so the buyer and seller know what needs to be discussed.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Crop or product",
          "productName",
          "e.g. tomatoes, avocados"
        );
      }

      addFeatureField(form, "Quantity wanted", "quantity", "e.g. 30 crates");
      addFeatureField(
        form,
        "Expected harvest / delivery date",
        "targetDate",
        "",
        "date",
        false
      );
      addFeatureField(form, "County", "county", item?.county || "e.g. Meru");

      demoNote.textContent =
        "This is a local pre-order interest, not a contract, stock reservation or confirmed price.";

      form.appendChild(demoNote);
      submit.textContent = "Save pre-order interest";

    } else if (type === "delivery") {
      title.textContent = item
        ? `FreshRoute: ${name}`
        : "FreshRoute · Delivery quote";

      description.textContent =
        "Capture the delivery details needed for a quote. MavunoBridge will not invent a driver, fee or arrival time.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Items to transport",
          "productName",
          "e.g. 10 sacks of maize"
        );
      }

      addFeatureField(
        form,
        "Quantity / load size",
        "quantity",
        "e.g. 10 sacks or 100 kg"
      );

      addFeatureField(
        form,
        "Destination / town",
        "destination",
        "e.g. Nakuru Town"
      );

      addFeatureField(
        form,
        "Pickup county",
        "county",
        item?.county || "Choose a county"
      );

      demoNote.textContent =
        "Saved locally for demonstration only. No transport provider is contacted.";

      form.appendChild(demoNote);
      submit.textContent = "Save quote request";

    } else if (type === "review") {
      title.textContent = item
        ? `FarmProof review: ${name}`
        : "FarmProof · Delivery review";

      description.textContent =
        "Record a local demo delivery confirmation and review. This is not an independently verified transaction.";

      if (item) {
        const product = document.createElement("input");
        product.type = "hidden";
        product.name = "productName";
        product.value = item.name;
        form.appendChild(product);
      } else {
        addFeatureField(
          form,
          "Product or service",
          "productName",
          "e.g. beans or ploughing"
        );
      }

      const proofLabel = document.createElement("label");
      const proof = document.createElement("input");
      proof.type = "checkbox";
      proof.name = "received";
      proof.required = true;

      proofLabel.append(
        proof,
        document.createTextNode(
          " I confirm this is a demo record of a delivery I received. *"
        )
      );

      form.appendChild(proofLabel);

      const ratingLabel = document.createElement("label");
      ratingLabel.appendChild(document.createTextNode("Rating *"));

      const rating = document.createElement("select");
      rating.name = "rating";
      rating.required = true;
      rating.add(new Option("Choose a rating", ""));

      [5, 4, 3, 2, 1].forEach(n =>
        rating.add(new Option(`${n} / 5 stars`, String(n)))
      );

      ratingLabel.appendChild(rating);
      form.appendChild(ratingLabel);

      addFeatureField(
        form,
        "Review note (optional)",
        "note",
        "What went well or needs improvement?",
        "textarea",
        false
      );

      demoNote.textContent =
        "Reviews remain in this browser and are labelled demo reviews; they do not establish real seller reputation.";

      form.appendChild(demoNote);
      submit.textContent = "Save demo review";

    } else if (type === "circle") {
      title.textContent = "County Grower Circles";

      description.textContent =
        "Choose a county and crop interest to model a local farmer group.";

      addFeatureCountySelect(form);

      addFeatureField(
        form,
        "Crop or shared interest",
        "crop",
        "e.g. dairy, maize, tomatoes"
      );

      addFeatureField(
        form,
        "Group goal (optional)",
        "goal",
        "e.g. share transport or learn together",
        "text",
        false
      );

      demoNote.textContent =
        "This records your interest on this device only. It does not create a public group or expose your details to others.";

      form.appendChild(demoNote);
      submit.textContent = "Save circle preference";

    } else if (type === "alerts") {
      title.textContent = "Planting Watch";

      description.textContent =
        "Save the crop and county you would like alerts for. Actual weather and pest alerts are not connected in this demo.";

      addFeatureCountySelect(form);
      addFeatureField(form, "Crop of interest", "crop", "e.g. maize or beans");

      const channelLabel = document.createElement("label");
      channelLabel.textContent = "Preferred future alert channel";

      const channel = document.createElement("select");
      channel.name = "channel";

      [["in-app", "In-app"], ["sms", "SMS"], ["whatsapp", "WhatsApp"]]
        .forEach(([v, l]) => channel.add(new Option(l, v)));

      channelLabel.appendChild(channel);
      form.appendChild(channelLabel);

      demoNote.textContent =
        "Preference only. No SMS, WhatsApp, weather service or notification will be sent.";

      form.appendChild(demoNote);
      submit.textContent = "Save alert preference";

    } else if (type === "learn") {
      title.textContent = "Mavuno Learn · Mini lessons";

      description.textContent =
        "Choose a short practical lesson. These are starter notes, not a substitute for local professional advice.";

      const courseLabel = document.createElement("label");
      courseLabel.textContent = "Choose a mini lesson *";

      const course = document.createElement("select");
      course.name = "course";
      course.required = true;
      course.add(new Option("Choose a lesson", ""));

      [
        ["nursery", "Seedling nursery basics"],
        ["pest", "Observe pests before acting"],
        ["postharvest", "Post-harvest handling"],
        ["records", "Simple farm cost records"]
      ].forEach(([v, l]) => course.add(new Option(l, v)));

      courseLabel.appendChild(course);
      form.appendChild(courseLabel);

      demoNote.textContent =
        "Lessons are short text previews. No accredited certification is awarded.";

      form.appendChild(demoNote);
      submit.textContent = "Open lesson";
    }

    modal.hidden = false;
    modal.querySelector(".mb-feature-dialog").scrollTop = 0;
    modal.querySelector("input:not([type=hidden]), select, textarea, button")?.focus();
  }

  function closeMavunoFeatureModal() {
    if (mavunoFeatureModal) mavunoFeatureModal.hidden = true;
    mavunoFeatureContext = null;
  }

  function readFeatureForm() {
    const form = $("#mbFeatureForm");
    const data = {};

    if (!form) return data;

    new FormData(form).forEach((value, key) => {
      if (key !== "received") data[key] = String(value).trim();
    });

    data.received = Boolean(form.elements.received?.checked);
    return data;
  }

  function submitMavunoFeature(event) {
    event.preventDefault();
    if (!mavunoFeatureContext) return;

    const { type, item } = mavunoFeatureContext;
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = readFeatureForm();

    const listing = item
      ? {
          productId: item.id,
          productName: item.name,
          seller: item.seller || "",
          listingCounty: item.county || ""
        }
      : {};

    let key = "";
    let success = "Demo entry saved on this device.";

    if (type === "group-buy") {
      key = STORAGE.groupBuys;
      success =
        "Mavuno Pool interest saved locally. No group order or discount has been confirmed.";

    } else if (type === "preorder") {
      key = STORAGE.preOrders;
      success =
        "HarvestLink pre-order interest saved locally. Confirm availability and terms directly before making an agreement.";

    } else if (type === "delivery") {
      key = STORAGE.deliveryRequests;
      success =
        "FreshRoute quote request saved locally. No driver, fee or ETA has been booked.";

    } else if (type === "review") {
      if (!data.received) {
        showToast("Confirm the demo delivery checkbox before submitting a review.");
        return;
      }

      key = STORAGE.demoReviews;
      success = "Demo review saved locally. It is not a verified public rating.";

    } else if (type === "circle") {
      key = STORAGE.countyCircles;
      success =
        "County Grower Circle preference saved on this device; no public group was created.";

    } else if (type === "alerts") {
      key = STORAGE.plantingAlerts;
      success =
        "Planting Watch preference saved locally. No live alerts will be sent.";

    } else if (type === "learn") {
      key = STORAGE.learningProgress;

      const lessons = {
        nursery: {
          title: "Seedling nursery basics",
          text: "Use clean trays or a prepared, well-drained nursery bed. Label each variety, water gently, and check for damping-off or uneven growth daily. Transplant only when seedlings are suitable for the crop and local conditions. Ask a local extension officer about variety-specific timing."
        },
        pest: {
          title: "Observe pests before acting",
          text: "Inspect several plants and both leaf surfaces. Note the crop, location, affected plant parts and how quickly symptoms are spreading. Take a clear photo if safe. Do not mix pesticides; identify the problem and follow the product label and local extension advice before treatment."
        },
        postharvest: {
          title: "Post-harvest handling",
          text: "Harvest at the suitable stage, keep produce shaded, use clean containers, separate damaged items, and avoid crushing. Keep food products away from chemicals and fuel. Confirm buyer requirements for grade, packaging and delivery before harvest when possible."
        },
        records: {
          title: "Simple farm cost records",
          text: "Record date, input, quantity, cost, labour, harvest quantity, sold quantity and selling price. Keep receipts where available. Comparing total costs with sales over a full crop cycle helps you understand margin; one good sale alone does not show the whole profit picture."
        }
      };

      const lesson = lessons[data.course];

      if (!lesson) {
        showToast("Choose a lesson first.");
        return;
      }

      saveLocalRecord(key, {
        course: data.course,
        title: lesson.title
      });

      const title = $("#mbFeatureTitle");
      const description = $("#mbFeatureDescription");
      const formEl = $("#mbFeatureForm");

      title.textContent = lesson.title;
      description.textContent = lesson.text;
      formEl.innerHTML = "";

      const note = document.createElement("p");
      note.className = "mb-feature-note";
      note.textContent =
        "Lesson marked as opened in this browser. No certificate is issued.";

      formEl.appendChild(note);

      $("#mbFeatureSubmit").hidden = true;
      $("#mbFeatureCancel").textContent = "Close lesson";
      return;

    } else {
      return;
    }

    const saved = saveLocalRecord(key, { ...listing, ...data });

    closeMavunoFeatureModal();

    showToast(
      saved
        ? success
        : "Could not save this demo preference in local browser storage."
    );
  }

  function bindMavunoHubEvents() {
    $("#mavunoInnovationHub")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mavuno-feature]");
      if (button) openMavunoFeature(button.dataset.mavunoFeature, null);
    });

    $("#listingGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mb-action]");
      if (!button) return;

      const item = listings.find(entry => entry.id === button.dataset.listingId);

      if (!item) {
        showToast("Listing not found. Refresh and try again.");
        return;
      }

      openMavunoFeature(button.dataset.mbAction, item);
    });
  }

  const TRANSLATIONS = [
    [".main-nav a[href=\"#marketplace\"]", "Marketplace", "Soko"],
    [".main-nav a[href=\"smart-assist.html\"]", "Smart Assist", "Msaidizi Mahiri"],
    [".main-nav a[href=\"sacco.html\"]", "SACCO Hub", "Kituo cha SACCO"],
    [".main-nav a[href=\"buyer-requests.html\"]", "Buyer Requests", "Maombi ya Wanunuzi"],
    [".main-nav a[href=\"messages.html\"]", "Messages", "Ujumbe"],
    ["#authLink", "Sign in", "Ingia"],
    ["#signOutButton", "Sign out", "Toka"],
    [".hero .eyebrow", "KENYA'S FARM-TO-MARKET DEMO", "ONYESHO LA KENYA LA SHAMBANI HADI SOKONI"],
    [".hero h1", "Good harvests deserve <span>better markets.</span>", "Mavuno mazuri yanastahili <span>masoko bora.</span>", "html"],
    [".hero-description", "Connect directly with farmers, compare produce, discover opportunities and grow your business. Everything in one place.", "Wasiliana moja kwa moja na wakulima, linganisha mazao, gundua fursa na ukuze biashara yako. Yote mahali pamoja."],
    ["#heroSellButton", "+ Sell your produce", "+ Uza mazao yako"],
    [".category-section h2", "Explore categories", "Tazama aina za bidhaa"],
    [".marketplace h2", "Marketplace", "Soko"],
    ["#sellButton", "+ Create listing", "+ Tengeneza tangazo"],
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
    } else {
      applyLanguage(saved);
    }
  }

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

    $("#categoryFilter")?.addEventListener(
      "change",
      event => selectCategory(event.target.value || "All")
    );

    ["searchInput", "locationFilter", "saleFilter", "fairPriceFilter", "sortFilter"].forEach(id => {
      document.getElementById(id)?.addEventListener(
        id === "searchInput" ? "input" : "change",
        () => {
          visibleListingLimit = 12;
          renderListings();
        }
      );
    });

    $("#clearFiltersButton")?.addEventListener("click", clearFilters);

    $("#listingGrid")?.addEventListener("click", event => {
      const addButton = event.target.closest("[data-add-cart]");

      if (addButton) {
        addToCart(addButton.dataset.addCart);
        return;
      }

      const chatButton = event.target.closest("[data-chat]");

      if (chatButton) {
        openChat(chatButton.dataset.chat);
      }
    });

    $("#cartButton")?.addEventListener("click", () => {
      renderCart();
      openModal("cartModal");
    });

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
      if (event.key === "Escape") {
        $$(".modal:not(.hidden)").forEach(modal => closeModal(modal.id));
      }
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
    try {
      step();
    } catch (error) {
      console.error(`MavunoBridge: "${label}" failed`, error);
    }
  }

  function init() {
    if (!$("#listingGrid")) {
      console.info(
        "MavunoBridge: marketplace grid is not on this page; no marketplace startup needed."
      );
      return;
    }

    safely("load data", loadData);
    safely("fill dropdowns", populateSelects);
    safely("connect buttons", bindEvents);
    safely("draw categories", renderCategories);
    safely("draw listings", renderListings);
    safely("render MavunoBridge Plus features", renderMavunoInnovationHub);
    safely("bind MavunoBridge Plus features", bindMavunoHubEvents);
    safely("show signed-in user", renderUser);
    safely("cart count", updateCartCount);
    safely("restore language", restoreLanguage);

    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    console.info(
      `MavunoBridge ready: ${listings.length} listings loaded (${DEMO_LISTINGS.length} built-in demo samples).`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
