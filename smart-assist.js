
"use strict";

const assistForm = document.querySelector("#assistForm");
const assistResults = document.querySelector("#assistResults");

const cropGuidance = {
  "Maize": {
    planting: "Use certified seed suited to your area's altitude and rainfall. Check spacing and planting depth on the seed packet.",
    pests: "Scout for fall armyworm, especially in the leaf whorl. Check for fresh damage and get local agricultural guidance before treating.",
    harvest: "Check grain maturity and moisture before harvesting and storing. Keep harvested grain dry and protected from pests."
  },
  "Beans": {
    planting: "Choose a variety suited to your area and use well-drained soil. Avoid planting into waterlogged ground.",
    pests: "Inspect leaves, stems and pods regularly for chewing damage, aphids and disease symptoms.",
    harvest: "Harvest when pods are mature and dry the crop safely before storage."
  },
  "Tomatoes": {
    planting: "Use healthy seedlings, maintain good spacing and provide support where appropriate. Avoid leaving leaves wet for long periods.",
    pests: "Check leaf undersides and new growth for whiteflies, aphids, caterpillars and unusual spots. Confirm the cause before applying a treatment.",
    harvest: "Harvest at the maturity stage your buyer needs. Handle fruit carefully to prevent bruising."
  },
  "Potatoes": {
    planting: "Use healthy certified seed potatoes and rid soil around plants. Rotate away from potatoes and related crops when possible.",
    pests: "Scout for late-blight symptoms and insect damage. If disease is spreading, seek advice from a local agricultural officer quickly.",
    harvest: "Avoid harvesting into very wet soil. Cure and store tubers according to recommended local practices."
  },
  "Avocados": {
    planting: "Use a healthy tree suited to your conditions. Good drainage and careful moisture management are important.",
    pests: "Inspect new shoots, leaves and fruit for damage. Seek local advice if you find symptoms you cannot identify.",
    harvest: "Follow maturity guidance for your avocado variety and market. Harvest carefully to avoid bruises."
  },
  "Green grams": {
    planting: "Select a locally recommended variety and use well-drained soil. Avoid excessive waterlogging.",
    pests: "Check leaves and pods for insect damage and look out for yellowing or unusual spots.",
    harvest: "Harvest mature pods promptly and dry the grain properly before storage."
  },
  "Kale": {
    planting: "Use healthy seedlings and keep consistent moisture without waterlogging. Plant spacing helps air move through the crop.",
    pests: "Inspect leaf undersides for caterpillars and aphids. Use locally recommended control methods once the pest is identified.",
    harvest: "Harvest outer leaves carefully and continue checking plants for pests and nutrient issues."
  },
  "Bananas": {
    planting: "Use healthy planting material and maintain soil moisture. Organic mulch can help conserve water where appropriate.",
    pests: "Check leaves, stems and fruit for damage. Remove diseased plant material using local agricultural guidance.",
    harvest: "Handle bunches gently and harvest at the maturity stage needed for your intended market."
  }
};

const countyNotes = {
  "Nakuru": "Conditions vary between locations in Nakuru County. Check your local rainfall and soil before planting.",
  "Kiambu": "Elevation and conditions differ across Kiambu. Match crop varieties to your specific area.",
  "Uasin Gishu": "Plan planting around local rainfall and soil conditions; avoid relying on county-wide assumptions.",
  "Meru": "Conditions vary with altitude and location. Confirm the recommended varieties for your part of Meru.",
  "Machakos": "Some areas experience dry spells. Plan water use carefully and consider locally recommended drought-tolerant varieties.",
  "Kisumu": "Account for local rainfall, humidity and drainage. Avoid assuming every part of the county has the same conditions.",
  "Nyandarua": "Local temperature and altitude can affect crop suitability. Consult nearby agricultural extension services.",
  "Bungoma": "Use local rainfall patterns and soil conditions to plan planting and crop management."
};

function escapeAssist(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function createTips(county, crop, condition) {
  const guidance = cropGuidance[crop] || cropGuidance["Maize"];
  const tips = [guidance.planting, guidance.pests, guidance.harvest];

  if (condition === "dry") {
    tips.unshift("Dry soil selected: check moisture below the surface before watering, mulch where appropriate, and seek local advice on water-efficient methods.");
  } else if (condition === "wet") {
    tips.unshift("Wet soil selected: check field drainage and avoid working saturated soil. Watch for increased disease pressure after prolonged wet conditions.");
  } else if (condition === "pests") {
    tips.unshift("Crop damage selected: photograph affected plants, inspect several locations and confirm the pest or disease before applying a treatment.");
  }

  return {
    county: countyNotes[county] || "Check local soil and rainfall information before making farm decisions.",
    tips
  };
}

assistForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!assistForm.reportValidity()) return;

  const county = document.querySelector("#assistCounty").value;
  const crop = document.querySelector("#assistCrop").value;
  const condition = document.querySelector("#assistCondition").value;
  const result = createTips(county, crop, condition);

  assistResults.innerHTML = `
    <div class="assist-result-heading">
      <p class="eyebrow">YOUR FARMING GUIDE</p>
      <h2>${escapeAssist(crop)} · ${escapeAssist(county)} County</h2>
      <p>${escapeAssist(result.county)}</p>
    </div>
    <div class="tip-grid">
      ${result.tips.map((tip, index) => `
        <article class="tip-card">
          <span class="tip-index">${String(index + 1).padStart(2, "0")}</span>
          <p>${escapeAssist(tip)}</p>
        </article>`).join("")}
    </div>
    <p class="assist-disclaimer">These are general, rule-based demo suggestions. They do not use live weather data or identify a pest from an image. Confirm advice with your local agricultural extension officer.</p>
    <button class="button button-green" id="assistAgainButton" type="button">Update my farm plan</button>
  `;

  document.querySelector("#assistAgainButton")?.addEventListener("click", () => {
    assistForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
