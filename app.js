(() => {

  "use strict";


  /* =========================================================
     MAVUNOBRIDGE — MAIN MARKETPLACE ENGINE
     Browser-only demo
     No Supabase required
  ========================================================= */


  const STORAGE = {

    listings: "mavunobridge_listings_v6",

    cart: "mavunobridge_cart_v6"

  };


  /* =========================================================
     EXACT ROSECOCO IMAGE
  ========================================================= */

  const ROSECOCO_IMAGE =
    "https://static.wixstatic.com/media/b9a05c_e6df03951eb44ecfba0e0fdbc2229634~mv2.jpg/v1/fill/w_474,h_477,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/b9a05c_e6df03951eb44ecfba0e0fdbc2229634~mv2.jpg";


  /* =========================================================
     CATEGORIES
  ========================================================= */

  const CATEGORIES = [

    [
      "Fruits",
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Vegetables",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Nuts",
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Starchy Foods",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Grains",
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Cereals",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Legumes",
      ROSECOCO_IMAGE
    ],

    [
      "Spices",
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Herbal Products",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Livestock",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Livestock Products",
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Farm Inputs",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Tools & Equipment",
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=600&q=75"
    ],

    [
      "Farmer Services",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75"
    ]

  ];


  /* =========================================================
     COUNTIES
  ========================================================= */

  const COUNTIES = [

    "Baringo",
    "Bomet",
    "Bungoma",
    "Busia",
    "Elgeyo-Marakwet",
    "Embu",
    "Garissa",
    "Homa Bay",
    "Isiolo",
    "Kajiado",
    "Kakamega",
    "Kericho",
    "Kiambu",
    "Kilifi",
    "Kirinyaga",
    "Kisii",
    "Kisumu",
    "Kitui",
    "Kwale",
    "Laikipia",
    "Lamu",
    "Machakos",
    "Makueni",
    "Mandera",
    "Marsabit",
    "Meru",
    "Migori",
    "Mombasa",
    "Murang'a",
    "Nairobi City",
    "Nakuru",
    "Nandi",
    "Narok",
    "Nyamira",
    "Nyandarua",
    "Nyeri",
    "Samburu",
    "Siaya",
    "Taita-Taveta",
    "Tana River",
    "Tharaka-Nithi",
    "Trans Nzoia",
    "Turkana",
    "Uasin Gishu",
    "Vihiga",
    "Wajir",
    "West Pokot"

  ];


  /* =========================================================
     FAIR PRICE GUIDE
  ========================================================= */

  const FAIR_GUIDE = [

    {
      name: "Tomatoes",
      min: 60,
      max: 110,
      unit: "kg",
      match: name => name.includes("tomato")
    },

    {
      name: "Hass Avocados",
      min: 90,
      max: 180,
      unit: "kg",
      match: name => name.includes("hass avocado")
    },

    {
      name: "Maize",
      min: 45,
      max: 80,
      unit: "kg",
      match: name => name.includes("maize")
    }

  ];


  /* =========================================================
     DEMO LISTINGS
  ========================================================= */

  const DEMO_LISTINGS = [

    {
      id: "demo-avocado",
      demo: true,
      name: "Hass Avocados",
      category: "Fruits",
      county: "Kiambu",
      town: "Limuru",
      price: 120,
      unit: "kg",
      qty: "80 kg",
      sale: "Both",
      seller: "Limuru Fresh Farm",
      phone: "0711223344",
      image:
        "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=75",
      createdAt: 1
    },


    {
      id: "demo-tomatoes",
      demo: true,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      county: "Nakuru",
      town: "Naivasha",
      price: 75,
      unit: "kg",
      qty: "120 kg",
      sale: "Both",
      seller: "Naivasha Growers",
      phone: "0722334455",
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=75",
      createdAt: 2
    },


    {
      id: "demo-maize",
      demo: true,
      name: "Dry Maize",
      category: "Grains",
      county: "Uasin Gishu",
      town: "Eldoret",
      price: 58,
      unit: "kg",
      qty: "300 kg",
      sale: "Bulk",
      seller: "Rift Valley Grain Hub",
      phone: "0733445566",
      image:
        "https://images.unsplash.com/photo-1601593768799-76f6c1d4b2f1?auto=format&fit=crop&w=700&q=75",
      createdAt: 3
    },


    {
      id: "demo-beans",
      demo: true,
      name: "Rosecoco Beans",
      category: "Legumes",
      county: "Meru",
      town: "Meru",
      price: 150,
      unit: "kg",
      qty: "60 kg",
      sale: "Both",
      seller: "Meru Bean Farmers",
      phone: "0744556677",
      image: ROSECOCO_IMAGE,
      createdAt: 4
    },


    {
      id: "demo-potatoes",
      demo: true,
      name: "Irish Potatoes",
      category: "Starchy Foods",
      county: "Nyandarua",
      town: "Ol Kalou",
      price: 65,
      unit: "kg",
      qty: "200 kg",
      sale: "Bulk",
      seller: "Nyandarua Potato Farm",
      phone: "0755667788",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=75",
      createdAt: 5
    },


    {
      id: "demo-green-grams",
      demo: true,
      name: "Green Grams",
      category: "Legumes",
      county: "Machakos",
      town: "Mwala",
      price: 180,
      unit: "kg",
      qty: "45 kg",
      sale: "Both",
      seller: "Machakos Dry Foods",
      phone: "0766778899",
      image:
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=75",
      createdAt: 6
    },


    {
      id: "demo-bananas",
      demo: true,
      name: "Bananas",
      category: "Fruits",
      county: "Kisumu",
      town: "Kisumu",
      price: 120,
      unit: "bunch",
      qty: "30 bunches",
      sale: "Retail",
      seller: "Lake Region Farm",
      phone: "0777889900",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=75",
      createdAt: 7
    },


    {
      id: "demo-onions",
      demo: true,
      name: "Red Onions",
      category: "Vegetables",
      county: "Nakuru",
      town: "Gilgil",
      price: 95,
      unit: "kg",
      qty: "90 kg",
      sale: "Both",
      seller: "Gilgil Onion Growers",
      phone: "0788990011",
      image:
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=75",
      createdAt: 8
    },


    {
      id: "demo-millet",
      demo: true,
      name: "Finger Millet",
      category: "Cereals",
      county: "Kakamega",
      town: "Kakamega",
      price: 140,
      unit: "kg",
      qty: "70 kg",
      sale: "Bulk",
      seller: "Kakamega Wimbi Group",
      phone: "0799001122",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=75",
      createdAt: 9
    },


    {
      id: "demo-groundnuts",
      demo: true,
      name: "Groundnuts",
      category: "Nuts",
      county: "Kilifi",
      town: "Malindi",
      price: 220,
      unit: "kg",
      qty: "35 kg",
      sale: "Both",
      seller: "Coastal Harvest",
      phone: "0712345601",
      image:
        "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=75",
      createdAt: 10
    },


    {
      id: "demo-spice",
      demo: true,
      name: "Cinnamon",
      category: "Spices",
      county: "Kwale",
      town: "Ukunda",
      price: 450,
      unit: "kg",
      qty: "15 kg",
      sale: "Retail",
      seller: "Coast Spice Farm",
      phone: "0723456712",
      image:
        "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=700&q=75",
      createdAt: 11
    },


    {
      id: "demo-herbal",
      demo: true,
      name: "Aloe Products",
      category: "Herbal Products",
      county: "Kajiado",
      town: "Kajiado",
      price: 300,
      unit: "unit",
      qty: "25 packs",
      sale: "Retail",
      seller: "Kajiado Herbal Group",
      phone: "0734567823",
      image:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=75",
      createdAt: 12
    },


    {
      id: "demo-goats",
      demo: true,
      name: "Dairy Goats",
      category: "Livestock",
      county: "Nyeri",
      town: "Karatina",
      price: 12000,
      unit: "animal",
      qty: "8 goats",
      sale: "Retail",
      seller: "Highland Livestock",
      phone: "0745678934",
      image:
        "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=700&q=75",
      createdAt: 13
    },


    {
      id: "demo-eggs",
      demo: true,
      name: "Fresh Eggs",
      category: "Livestock Products",
      county: "Kiambu",
      town: "Thika",
      price: 450,
      unit: "tray",
      qty: "20 trays",
      sale: "Both",
      seller: "Sunrise Poultry",
      phone: "0756789045",
      image:
        "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=75",
      createdAt: 14
    },


    {
      id: "demo-seed",
      demo: true,
      name: "Certified Maize Seed",
      category: "Farm Inputs",
      county: "Trans Nzoia",
      town: "Kitale",
      price: 450,
      unit: "bag",
      qty: "40 bags",
      sale: "Bulk",
      seller: "Kitale Seed Centre",
      phone: "0767890156",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=75",
      createdAt: 15
    },


    {
      id: "demo-tools",
      demo: true,
      name: "Farm Tools Set",
      category: "Tools & Equipment",
      county: "Nairobi City",
      town: "Nairobi",
      price: 2800,
      unit: "unit",
      qty: "12 sets",
      sale: "Retail",
      seller: "Mavuno Tools",
      phone: "0778901267",
      image:
        "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3a5b?auto=format&fit=crop&w=700&q=75",
      createdAt: 16
    },


    {
      id: "demo-service",
      demo: true,
      name: "Tractor Plough Service",
      category: "Farmer Services",
      county: "Nakuru",
      town: "Nakuru",
      price: 3500,
      unit: "service",
      qty: "By booking",
      sale: "Both",
      seller: "Nakuru Farm Services",
      phone: "0789012378",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=75",
      createdAt: 17
    },


    {
      id: "demo-wheat",
      demo: true,
      name: "Wheat Grain",
      category: "Grains",
      county: "Narok",
      town: "Narok",
      price: 72,
      unit: "kg",
      qty: "250 kg",
      sale: "Bulk",
      seller: "Narok Grain Growers",
      phone: "0790123489",
      image:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=75",
      createdAt: 18
    },


    {
      id: "demo-mango",
      demo: true,
      name: "Apple Mangoes",
      category: "Fruits",
      county: "Makueni",
      town: "Wote",
      price: 100,
      unit: "kg",
      qty: "100 kg",
      sale: "Both",
      seller: "Wote Fruit Farm",
      phone: "0701234590",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=75",
      createdAt: 19
    }

  ];


  /* =========================================================
     STATE
  ========================================================= */

  let listings = [];

  let cart = [];

  let activeCategory = "All";


  /* =========================================================
     SHORTCUTS
  ========================================================= */

  const $ = selector =>
    document.querySelector(selector);


  const $$ = selector =>
    [...document.querySelectorAll(selector)];


  /* =========================================================
     STORAGE
  ========================================================= */

  function loadStorage(key, fallback) {

    try {

      const saved =
        localStorage.getItem(key);

      if (!saved) {

        return fallback;

      }

      return JSON.parse(saved);

    } catch (error) {

      console.warn(
        "Storage read failed:",
        error
      );

      return fallback;

    }

  }


  function saveStorage(key, value) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    } catch (error) {

      console.warn(
        "Storage save failed:",
        error
      );

      return false;

    }

  }


  /* =========================================================
     HTML ESCAPING
  ========================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================================================
     MONEY
  ========================================================= */

  function money(value) {

    return "KSh " +
      Number(value || 0)
        .toLocaleString(
          "en-KE",
          {
            maximumFractionDigits: 2
          }
        );

  }


  /* =========================================================
     LOAD DATA
  ========================================================= */

  function initializeData() {

    const storedListings =
      loadStorage(
        STORAGE.listings,
        []
      );


    const userListings =
      Array.isArray(storedListings)
        ? storedListings.filter(
            item => item && item.demo !== true
          )
        : [];


    listings = [

      ...DEMO_LISTINGS,

      ...userListings

    ];


    const storedCart =
      loadStorage(
        STORAGE.cart,
        []
      );


    cart =
      Array.isArray(storedCart)
        ? storedCart
        : [];

  }


  /* =========================================================
     POPULATE SELECTS
  ========================================================= */

  function populateSelects() {

    const categoryFilter =
      $("#categoryFilter");

    const productCategory =
      $("#productCategory");

    const locationFilter =
      $("#locationFilter");

    const productCounty =
      $("#productCounty");


    CATEGORIES.forEach(
      ([category]) => {

        categoryFilter.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${escapeHTML(category)}">
            ${escapeHTML(category)}
          </option>
          `
        );


        productCategory.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${escapeHTML(category)}">
            ${escapeHTML(category)}
          </option>
          `
        );

      }
    );


    COUNTIES.forEach(
      county => {

        locationFilter.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${escapeHTML(county)}">
            ${escapeHTML(county)}
          </option>
          `
        );


        productCounty.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${escapeHTML(county)}">
            ${escapeHTML(county)}
          </option>
          `
        );

      }
    );

  }


  /* =========================================================
     CATEGORY CARDS
  ========================================================= */

  function renderCategories() {

    const grid =
      $("#categoryGrid");


    if (!grid) {

      return;

    }


    grid.innerHTML = "";


    CATEGORIES.forEach(
      ([category, image]) => {

        const button =
          document.createElement("button");


        button.type = "button";


        button.className =
          "category-card";


        if (
          activeCategory === category
        ) {

          button.classList.add(
            "selected"
          );

        }


        button.dataset.category =
          category;


        button.innerHTML = `

          <span
            class="cat-image"
            style="background-image:url('${image}')"
          ></span>

          <span class="cat-shade"></span>

          <span class="cat-name">
            ${escapeHTML(category)}
          </span>

        `;


        grid.appendChild(button);

      }
    );

  }


  /* =========================================================
     ⭐ THE IMPORTANT CATEGORY FUNCTION
  ========================================================= */

  function selectCategory(category) {

    if (
      category !== "All" &&
      !CATEGORIES.some(
        item => item[0] === category
      )
    ) {

      category = "All";

    }


    activeCategory =
      category;


    const categoryFilter =
      $("#categoryFilter");


    if (categoryFilter) {

      categoryFilter.value =
        category;

    }


    renderCategories();

    renderListings();


    const marketHint =
      $("#marketHint");


    if (marketHint) {

      marketHint.textContent =
        category === "All"

          ? "Browse products listed by farmers and sellers."

          : `Showing products in ${category}.`;

    }


    const marketplace =
      $("#marketplace");


    if (marketplace) {

      marketplace.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =========================================================
     FAIR PRICE
  ========================================================= */

  function getFairPrice(item) {

    const name =
      String(item.name || "")
        .toLowerCase();


    const guide =
      FAIR_GUIDE.find(
        itemGuide =>
          itemGuide.match(name)
      );


    if (
      !guide ||
      item.unit !== guide.unit
    ) {

      return {

        status: "no-guide",

        label: "No guide yet",

        detail:
          "No matching demo price guide."

      };

    }


    if (
      Number(item.price) <
      guide.min
    ) {

      return {

        status: "below",

        label: "Below guide",

        detail:
          `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`

      };

    }


    if (
      Number(item.price) >
      guide.max
    ) {

      return {

        status: "above",

        label: "Above guide",

        detail:
          `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`

      };

    }


    return {

      status: "within",

      label: "Within guide",

      detail:
        `${guide.name}: ${money(guide.min)}–${money(guide.max)} / kg`

    };

  }


  /* =========================================================
     FILTER LISTINGS
  ========================================================= */

  function getFilteredListings() {

    const search =
      $("#searchInput")
        ?.value
        .trim()
        .toLowerCase() || "";


    const county =
      $("#locationFilter")
        ?.value || "All";


    const saleType =
      $("#saleFilter")
        ?.value || "All";


    const fairFilter =
      $("#fairPriceFilter")
        ?.value || "All";


    const sort =
      $("#sortFilter")
        ?.value || "recommended";


    let results =
      listings.filter(
        item => {

          const searchableText = [

            item.name,

            item.category,

            item.county,

            item.town,

            item.seller,

            item.description

          ]
            .join(" ")
            .toLowerCase();


          const categoryMatches =

            activeCategory === "All" ||

            item.category === activeCategory;


          const countyMatches =

            county === "All" ||

            item.county === county;


          const saleMatches =

            saleType === "All" ||

            item.sale === saleType ||

            item.sale === "Both";


          const fairMatches =

            fairFilter === "All" ||

            getFairPrice(item).status === fairFilter;


          const searchMatches =

            !search ||

            searchableText.includes(search);


          return (

            categoryMatches &&

            countyMatches &&

            saleMatches &&

            fairMatches &&

            searchMatches

          );

        }
      );


    if (sort === "newest") {

      results.sort(
        (a, b) =>
          (b.createdAt || 0) -
          (a.createdAt || 0)
      );

    }


    if (sort === "price-low") {

      results.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );

    }


    if (sort === "price-high") {

      results.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );

    }


    return results;

  }


  /* =========================================================
     RENDER LISTINGS
  ========================================================= */

  function renderListings() {

    const grid =
      $("#listingGrid");


    if (!grid) {

      return;

    }


    const results =
      getFilteredListings();


    grid.innerHTML = "";


    results.forEach(
      item => {

        const fair =
          getFairPrice(item);


        const card =
          document.createElement("article");


        card.className =
          "product-card";


        card.innerHTML = `

          <div class="product-image-wrap">

            <img
              class="product-image"
              src="${escapeHTML(item.image || "")}"
              alt="${escapeHTML(item.name)}"
            >

            <span class="sale-badge">
              ${escapeHTML(item.sale)}
            </span>

          </div>


          <div class="product-body">

            <small>
              ${escapeHTML(item.category)}
            </small>


            <h3>
              ${escapeHTML(item.name)}
            </h3>


            <p class="location">
              📍
              ${escapeHTML(item.town || "")}
              ${item.town ? ", " : ""}
              ${escapeHTML(item.county)}
            </p>


            <div class="price">

              ${money(item.price)}

              <span>
                / ${escapeHTML(item.unit)}
              </span>

            </div>


            <div
              class="fair fair-${fair.status}"
            >
              ${escapeHTML(fair.label)}
            </div>


            <p class="fair-detail">
              ${escapeHTML(fair.detail)}
            </p>


            <p class="quantity">

              ${escapeHTML(item.qty)}

              ·

              ${escapeHTML(item.seller)}

            </p>


            <div class="card-actions">

              <button
                type="button"
                class="small primary"
                data-add-cart="${escapeHTML(item.id)}"
              >
                Add to cart
              </button>


              <a
                href="tel:${escapeHTML(item.phone)}"
                class="small"
              >
                Call
              </a>

            </div>

          </div>

        `;


        const image =
          card.querySelector(
            ".product-image"
          );


        image.addEventListener(
          "error",
          () => {

            image.style.display =
              "none";

          }
        );


        grid.appendChild(card);

      }
    );


    const resultCount =
      $("#resultCount");


    if (resultCount) {

      resultCount.textContent =
        `Showing ${results.length} listing${results.length === 1 ? "" : "s"}`;

    }


    const active =
      $("#activeCategory");


    if (active) {

      active.textContent =
        activeCategory === "All"

          ? ""

          : `Category: ${activeCategory}`;

    }


    const empty =
      $("#emptyState");


    if (empty) {

      empty.classList.toggle(
        "hidden",
        results.length !== 0
      );

    }

  }


  /* =========================================================
     MODALS
  ========================================================= */

  function openModal(id) {

    const modal =
      $(id);


    if (!modal) {

      return;

    }


    modal.classList.remove(
      "hidden"
    );


    document.body.classList.add(
      "modal-open"
    );

  }


  function closeModal(id) {

    const modal =
      $(id);


    if (!modal) {

      return;

    }


    modal.classList.add(
      "hidden"
    );


    document.body.classList.remove(
      "modal-open"
    );

  }


  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(message) {

    const toast =
      $("#toast");


    if (!toast) {

      return;

    }


    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      window.mavunoToast
    );


    window.mavunoToast =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },
        2800
      );

  }


  /* =========================================================
     IMAGE COMPRESSION
  ========================================================= */

  function compressImage(file) {

    return new Promise(
      resolve => {

        if (!file) {

          resolve("");

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          event => {

            const image =
              new Image();


            image.onload =
              () => {

                const maxSize =
                  900;


                const scale =
                  Math.min(
                    1,
                    maxSize /
                    Math.max(
                      image.width,
                      image.height
                    )
                  );


                const canvas =
                  document.createElement(
                    "canvas"
                  );


                canvas.width =
                  Math.round(
                    image.width *
                    scale
                  );


                canvas.height =
                  Math.round(
                    image.height *
                    scale
                  );


                const context =
                  canvas.getContext(
                    "2d"
                  );


                context.drawImage(
                  image,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );


                resolve(
                  canvas.toDataURL(
                    "image/jpeg",
                    0.72
                  )
                );

              };


            image.onerror =
              () => resolve("");


            image.src =
              event.target.result;

          };


        reader.onerror =
          () => resolve("");


        reader.readAsDataURL(
          file
        );

      }
    );

  }


  /* =========================================================
     CREATE LISTING
  ========================================================= */

  async function createListing(event) {

    event.preventDefault();


    const error =
      $("#listingError");


    error.classList.add(
      "hidden"
    );


    const requiredFields = [

      [
        "productName",
        "Product name"
      ],

      [
        "productCategory",
        "Category"
      ],

      [
        "productCounty",
        "County"
      ],

      [
        "productQuantity",
        "Quantity"
      ],

      [
        "productPrice",
        "Price"
      ],

      [
        "sellerName",
        "Seller name"
      ],

      [
        "sellerPhone",
        "Phone number"
      ]

    ];


    for (
      const [id, label]
      of requiredFields
    ) {

      const field =
        $("#" + id);


      if (
        !field ||
        !field.value.trim()
      ) {

        error.textContent =
          `Please enter ${label}.`;


        error.classList.remove(
          "hidden"
        );


        field?.focus();


        return;

      }

    }


    const price =
      Number(
        $("#productPrice").value
      );


    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {

      error.textContent =
        "Please enter a valid price.";


      error.classList.remove(
        "hidden"
      );


      return;

    }


    const image =
      await compressImage(
        $("#productImage").files[0]
      );


    const newListing = {

      id:
        "user-" +
        Date.now(),

      demo:
        false,

      name:
        $("#productName")
          .value
          .trim(),

      category:
        $("#productCategory")
          .value,

      county:
        $("#productCounty")
          .value,

      town:
        $("#productTown")
          .value
          .trim(),

      price:

        price,

      unit:
        $("#productPriceUnit")
          .value,

      qty:
        $("#productQuantity")
          .value
          .trim(),

      sale:
        $("#productSaleType")
          .value,

      seller:
        $("#sellerName")
          .value
          .trim(),

      phone:
        $("#sellerPhone")
          .value
          .trim(),

      condition:
        $("#productCondition")
          .value,

      image:

        image,

      description:
        $("#productDescription")
          .value
          .trim(),

      createdAt:
        Date.now()

    };


    listings.push(
      newListing
    );


    const userListings =
      listings.filter(
        item => item.demo !== true
      );


    const saved =
      saveStorage(
        STORAGE.listings,
        userListings
      );


    /*
      IMPORTANT:
      New listing keeps its selected category.
    */

    activeCategory =
      newListing.category;


    $("#categoryFilter").value =
      newListing.category;


    renderCategories();

    renderListings();


    closeModal(
      "#listingModal"
    );


    $("#listingForm").reset();


    showToast(
      saved
        ? "Listing published successfully! 🎉"
        : "Listing added for this session."
    );

  }


  /* =========================================================
     CART
  ========================================================= */

  function renderCart() {

    const box =
      $("#cartItems");


    const count =
      $("#cartCount");


    if (!box) {

      return;

    }


    if (!cart.length) {

      box.innerHTML = `

        <p class="muted">
          Cart iko empty.
        </p>

      `;


      $("#cartTotal").textContent =
        "";


      count.textContent =
        "0";


      return;

    }


    let total = 0;


    box.innerHTML = "";


    cart.forEach(
      (listingId, index) => {

        const item =
          listings.find(
            listing =>
              listing.id === listingId
          );


        if (!item) {

          return;

        }


        total +=
          Number(item.price);


        box.insertAdjacentHTML(
          "beforeend",
          `

          <div class="cart-item">

            <div>

              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${money(item.price)}
                /
                ${escapeHTML(item.unit)}
              </small>

            </div>


            <button
              type="button"
              data-remove-cart="${index}"
            >
              ×
            </button>

          </div>

          `
        );

      }
    );


    $("#cartTotal").textContent =
      `Estimated total: ${money(total)}`;


    count.textContent =
      String(cart.length);

  }


  function addToCart(id) {

    cart.push(id);


    saveStorage(
      STORAGE.cart,
      cart
    );


    renderCart();


    showToast(
      "Added to cart 🛒"
    );

  }


  function removeFromCart(index) {

    cart.splice(
      index,
      1
    );


    saveStorage(
      STORAGE.cart,
      cart
    );


    renderCart();

  }


  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  function clearFilters() {

    activeCategory =
      "All";


    $("#categoryFilter").value =
      "All";


    $("#locationFilter").value =
      "All";


    $("#saleFilter").value =
      "All";


    $("#fairPriceFilter").value =
      "All";


    $("#sortFilter").value =
      "recommended";


    $("#searchInput").value =
      "";


    renderCategories();

    renderListings();

  }


  /* =========================================================
     EVENT BINDING
  ========================================================= */

  function bindEvents() {


    /*
      ⭐ CATEGORY BUTTONS

      This is the important part.

      The listener is attached directly
      to the category container.

      Therefore clicking:

      - image
      - text
      - empty area
      - category card

      all work.
    */

    $("#categoryGrid")
      .addEventListener(
        "click",
        event => {

          const button =
            event.target.closest(
              ".category-card"
            );


          if (!button) {

            return;

          }


          const category =
            button.dataset.category;


          selectCategory(
            category
          );

        }
      );


    /*
      VIEW ALL
    */

    $("#showAllButton")
      .addEventListener(
        "click",
        () => {

          selectCategory(
            "All"
          );

        }
      );


    /*
      CATEGORY SELECT
    */

    $("#categoryFilter")
      .addEventListener(
        "change",
        event => {

          selectCategory(
            event.target.value
          );

        }
      );


    /*
      SEARCH
    */

    $("#searchInput")
      .addEventListener(
        "input",
        renderListings
      );


    /*
      OTHER FILTERS
    */

    [

      "locationFilter",

      "saleFilter",

      "fairPriceFilter",

      "sortFilter"

    ].forEach(
      id => {

        $("#" + id)
          .addEventListener(
            "change",
            renderListings
          );

      }
    );


    /*
      CREATE LISTING BUTTONS
    */

    [

      "sellButton",

      "heroSellButton",

      "emptySellButton"

    ].forEach(
      id => {

        $("#" + id)
          .addEventListener(
            "click",
            () => {

              openModal(
                "#listingModal"
              );

            }
          );

      }
    );


    /*
      LISTING FORM
    */

    $("#listingForm")
      .addEventListener(
        "submit",
        createListing
      );


    /*
      CLOSE BUTTONS
    */

    $$("[data-close]")
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              closeModal(
                "#" +
                button.dataset.close
              );

            }
          );

        }
      );


    /*
      CART
    */

    $("#cartButton")
      .addEventListener(
        "click",
        () => {

          renderCart();

          openModal(
            "#cartModal"
          );

        }
      );


    /*
      ADD TO CART
    */

    $("#listingGrid")
      .addEventListener(
        "click",
        event => {

          const button =
            event.target.closest(
              "[data-add-cart]"
            );


          if (!button) {

            return;

          }


          addToCart(
            button.dataset.addCart
          );

        }
      );


    /*
      REMOVE FROM CART
    */

    $("#cartItems")
      .addEventListener(
        "click",
        event => {

          const button =
            event.target.closest(
              "[data-remove-cart]"
            );


          if (!button) {

            return;

          }


          removeFromCart(
            Number(
              button.dataset.removeCart
            )
          );

        }
      );


    /*
      CLEAR
    */

    $("#clearFiltersButton")
      .addEventListener(
        "click",
        clearFilters
      );


    /*
      DEMO CHECKOUT
    */

    $("#demoCheckout")
      .addEventListener(
        "click",
        () => {

          showToast(
            "Demo checkout — no real payment taken."
          );

        }
      );


    /*
      BACK TO TOP
    */

    window.addEventListener(
      "scroll",
      () => {

        $("#backToTop")
          .classList.toggle(
            "show",
            window.scrollY > 500
          );

      }
    );


    $("#backToTop")
      .addEventListener(
        "click",
        () => {

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );


    /*
      ESCAPE KEY
    */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closeModal(
            "#listingModal"
          );

          closeModal(
            "#cartModal"
          );

        }

      }
    );

  }


  /* =========================================================
     START APP
  ========================================================= */

  function startApp() {

    initializeData();

    populateSelects();

    renderCategories();

    renderListings();

    renderCart();

    bindEvents();


    console.log(
      "🌱 MavunoBridge marketplace loaded successfully."
    );

  }


  /*
    Start safely after HTML exists.
  */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startApp,
      {
        once: true
      }
    );

  } else {

    startApp();

  }


})();
