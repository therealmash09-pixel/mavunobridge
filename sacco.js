/* MAVUNOBRIDGE — SACCO AND FARMER GROUP DEMO */

(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const STORAGE_KEY = "mavunobridge_groups_v1";

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

  let groups = [];

  try {
    groups = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(groups)) groups = [];
  } catch {
    groups = [];
  }

  $("#groupCounty").innerHTML =
    '<option value="">Choose county</option>' +
    counties.map(county =>
      `<option value="${county}">${county}</option>`
    ).join("");

  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });

  function saveGroups() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      return true;
    } catch {
      alert("Browser storage is full. Please remove some old demo entries.");
      return false;
    }
  }

  function renderGroups() {
    const list = $("#groupsList");

    if (!groups.length) {
      list.textContent = "No opportunities saved yet.";
      return;
    }

    list.replaceChildren();

    groups.forEach(group => {
      const article = document.createElement("article");
      article.className = "message-item";

      const title = document.createElement("b");
      title.textContent = group.name;

      const location = document.createElement("small");
      location.textContent = ` · ${group.county}`;

      const description = document.createElement("p");
      description.textContent = group.description;

      article.append(title, location, description);
      list.appendChild(article);
    });
  }

  document.querySelectorAll(".join").forEach(button => {
    button.addEventListener("click", () => {
      groups.unshift({
        name: button.dataset.group,
        county: "Not specified",
        description:
          "Interest recorded locally. This is not a membership application or a verified organisation."
      });

      if (saveGroups()) {
        renderGroups();
        alert("Interest saved in this browser only. No membership or payment was created.");
      }
    });
  });

  $("#groupForm").addEventListener("submit", event => {
    event.preventDefault();

    groups.unshift({
      name: $("#groupName").value.trim(),
      county: $("#groupCounty").value,
      description: $("#groupDesc").value.trim()
    });

    if (saveGroups()) {
      event.target.reset();
      renderGroups();
    }
  });

  renderGroups();
})();
