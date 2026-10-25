/* MAVUNOBRIDGE — OFFLINE SMART ASSIST DEMO */

(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);

  const counties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
    "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
    "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
    "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
    "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
    "Samburu", "Siaya", "Taita-Taveta", "Tana River",
    "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
    "Vihiga", "Wajir", "West Pokot"
  ];

  const countySelect = $("#county");

  countySelect.innerHTML =
    '<option value="">Choose county</option>' +
    counties.map(county =>
      `<option value="${county}">${county}</option>`
    ).join("");

  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });

  const symptomAdvice = {
    none: "No obvious problem reported. Scout the crop regularly and record changes early.",
    yellow: "Yellow leaves can have several causes, including water stress, nutrient issues, root problems or pests. Check which leaves are affected and inspect the plant before choosing a treatment.",
    holes: "Leaf holes may be caused by caterpillars, beetles or other pests. Inspect both sides of several leaves and look for insects or droppings. Get the pest identified before applying controls.",
    spots: "Spots may have fungal, bacterial or other causes. Avoid handling wet plants and seek a local diagnosis before treatment.",
    wilting: "Wilting can be caused by dry soil, waterlogged roots, disease or stem damage. Check soil moisture first instead of automatically adding more water.",
    stunted: "Slow growth may relate to soil fertility, moisture, seed quality, weeds, pests or spacing. Compare healthy and affected plants."
  };

  const cropAdvice = {
    "Maize": "Check planting timing and spacing with local extension advice. Scout for unusual leaf damage and get pests identified before considering treatment.",
    "Tomatoes": "Water near the soil when practical, support plants where suitable, and scout for leaf damage and fruit problems.",
    "Beans": "Check drainage, manage weeds early and monitor leaves for holes or unusual spots.",
    "Potatoes": "Use healthy seed tubers, earth up where suitable, and seek advice promptly if unusual dark lesions appear during wet conditions.",
    "Avocado": "Check drainage, avoid root damage and seek help if leaves or fruit develop unusual symptoms.",
    "Sukuma wiki": "Inspect leaf undersides regularly, manage weeds and harvest appropriately.",
    "Green grams": "Monitor moisture during establishment and manage weeds early.",
    "Bananas": "Maintain suitable soil moisture and ensure water can drain away from the plant base.",
    "Onions": "Use well-drained beds and watch for leaf damage or unusual patches.",
    "Other": "Share the crop name and clear symptoms with your local agricultural extension officer."
  };

  $("#assistForm").addEventListener("submit", event => {
    event.preventDefault();

    const county = $("#county").value;
    const crop = $("#crop").value;
    const weather = $("#weather").value;
    const symptom = $("#symptom").value;
    const details = $("#details").value.trim();

    if (!county) {
      alert("Please choose your county first.");
      return;
    }

    const advice = [];

    if (weather === "dry") {
      advice.push(
        "Dry spell: check soil moisture, mulch where suitable and prioritise young plants when water is limited. Follow local advice for your crop."
      );
    } else if (weather === "wet") {
      advice.push(
        "Heavy rain: check drainage, avoid walking on waterlogged beds and watch for signs of plant disease. Follow input labels about application during rainy conditions."
      );
    } else if (weather === "hot") {
      advice.push(
        "Hot conditions: monitor moisture and wilting. Water at cooler times where practical and protect sensitive young seedlings when appropriate."
      );
    } else if (weather === "cool") {
      advice.push(
        "Cool conditions: growth may slow for some crops. Check locally recommended planting times and monitor soil moisture."
      );
    } else {
      advice.push(
        "Planning: use local seasonal advice and your rainfall records. The selected county does not tell us today's actual weather."
      );
    }

    advice.push(symptomAdvice[symptom]);
    advice.push(`Crop note for ${crop}: ${cropAdvice[crop]}`);

    if (details) {
      advice.push(
        `Your note: "${details}". Keep this information when asking an extension officer for advice.`
      );
    }

    const result = $("#assistResult");
    result.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = `Farm guidance for ${county} County`;
    result.appendChild(heading);

    const disclaimer = document.createElement("p");
    disclaimer.className = "muted";
    disclaimer.textContent =
      "Rule-based demo guidance — not a live weather report or confirmed diagnosis.";
    result.appendChild(disclaimer);

    const list = document.createElement("ul");

    advice.forEach(text => {
      const item = document.createElement("li");
      item.textContent = text;
      list.appendChild(item);
    });

    result.appendChild(list);

    const nextStep = document.createElement("p");
    nextStep.textContent =
      "Next step: take clear photos of the whole plant and affected leaves, note when symptoms began, and ask your county agricultural extension officer before using pesticides or major inputs.";
    result.appendChild(nextStep);

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
