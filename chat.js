/* MAVUNOBRIDGE — BUYER REQUESTS AND SUPPORT NOTES */

(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const DEMANDS_KEY = "mavunobridge_demands_v2";
  const SUPPORT_KEY = "mavunobridge_support_notes_v1";

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

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  let demands = readList(DEMANDS_KEY);
  let notes = readList(SUPPORT_KEY);

  $("#dCounty").innerHTML =
    '<option value="">Choose county</option>' +
    counties.map(county =>
      `<option value="${county}">${county}</option>`
    ).join("");

  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });

  function saveList(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      alert("Browser storage is full. Try removing old demo entries.");
      return false;
    }
  }

  function render() {
    const demandList = $("#demandList");
    demandList.replaceChildren();

    if (!demands.length) {
      demandList.textContent = "No buyer requests yet. Post the first one.";
    } else {
      demands.forEach(demand => {
        const article = document.createElement("article");
        article.className = "message-item";

        const title = document.createElement("b");
        title.textContent = demand.product;

        const meta = document.createElement("small");
        meta.textContent = ` · ${demand.county} County · ${demand.type}`;

        const quantity = document.createElement("p");
        quantity.textContent =
          `${demand.quantity ? demand.quantity + " units needed" : "Quantity flexible"}` +
          `${demand.date ? " · Needed by " + demand.date : ""}`;

        const details = document.createElement("p");
        details.textContent = demand.details || "No extra details provided.";

        const date = document.createElement("small");
        date.textContent = `Posted ${demand.posted}`;

        article.append(title, meta, quantity, details, date);

        if (demand.contact) {
          const contact = document.createElement("p");
          contact.textContent = `Buyer contact: ${demand.contact}`;
          article.appendChild(contact);
        }

        demandList.appendChild(article);
      });
    }

    const supportList = $("#supportList");
    supportList.replaceChildren();

    if (!notes.length) {
      supportList.textContent = "No support notes saved.";
    } else {
      notes.forEach(note => {
        const article = document.createElement("article");
        article.className = "message-item";

        const text = document.createElement("p");
        text.textContent = note.text;

        const date = document.createElement("small");
        date.textContent = `Saved ${note.date}`;

        article.append(text, date);
        supportList.appendChild(article);
      });
    }
  }

  $("#demandForm").addEventListener("submit", event => {
    event.preventDefault();

    const request = {
      product: $("#dProduct").value.trim(),
      county: $("#dCounty").value,
      quantity: $("#dQty").value,
      date: $("#dDate").value,
      contact: $("#dContact").value.trim(),
      type: $("#dType").value,
      details: $("#dDetails").value.trim(),
      posted: new Date().toLocaleString()
    };

    demands.unshift(request);

    if (saveList(DEMANDS_KEY, demands)) {
      event.target.reset();
      render();
    } else {
      demands.shift();
    }
  });

  $("#supportForm").addEventListener("submit", event => {
    event.preventDefault();

    notes.unshift({
      text: $("#supportText").value.trim(),
      date: new Date().toLocaleString()
    });

    if (saveList(SUPPORT_KEY, notes)) {
      event.target.reset();
      render();
    } else {
      notes.shift();
    }
  });

  // Receive a product enquiry passed from the marketplace.
  const prefill = sessionStorage.getItem("mavunobridge_prefill_demand");

  if (prefill) {
    $("#dProduct").value = prefill;
    sessionStorage.removeItem("mavunobridge_prefill_demand");
  }

  render();
})();
