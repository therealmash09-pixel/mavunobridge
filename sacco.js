
"use strict";

const SACCO_KEY = "mavunobridge_sacco_interests_v1";
const saccoGrid = document.querySelector("#saccoGrid");
const savedInterests = document.querySelector("#savedInterests");

function getInterests() {
  try {
    const data = JSON.parse(localStorage.getItem(SACCO_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

function saveInterests(items) {
  localStorage.setItem(SACCO_KEY, JSON.stringify(items));
}

function renderInterests() {
  const interests = getInterests();

  if (!interests.length) {
    savedInterests.innerHTML = '<p class="muted">You haven\'t saved an opportunity yet.</p>';
    return;
  }

  savedInterests.innerHTML = interests.map((name) => `
    <div class="saved-interest">
      <span>${escapeInterest(name)}</span>
      <button type="button" data-unsave="${escapeInterest(name)}">Remove</button>
    </div>
  `).join("");
}

function escapeInterest(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function filterOpportunities() {
  const query = document.querySelector("#saccoSearch").value.trim().toLowerCase();
  const type = document.querySelector("#saccoType").value;

  saccoGrid.querySelectorAll(".sacco-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    const matchesText = !query || text.includes(query);
    const matchesType = type === "All" || card.dataset.type === type;
    card.classList.toggle("hidden", !(matchesText && matchesType));
  });
}

document.querySelector("#saccoSearch").addEventListener("input", filterOpportunities);
document.querySelector("#saccoType").addEventListener("change", filterOpportunities);

saccoGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-opportunity]");
  if (!button) return;

  const name = button.dataset.opportunity;
  const interests = getInterests();

  if (interests.includes(name)) {
    document.querySelectorAll("[data-opportunity]").forEach((item) => {
      if (item.dataset.opportunity === name) item.textContent = "Saved";
    });
    return;
  }

  interests.push(name);

  try {
    saveInterests(interests);
    renderInterests();

    document.querySelectorAll("[data-opportunity]").forEach((item) => {
      if (item.dataset.opportunity === name) item.textContent = "Saved ✓";
    });
  } catch (_) {
    alert("Could not save your selection in this browser.");
  }
});

savedInterests.addEventListener("click", (event) => {
  const button = event.target.closest("[data-unsave]");
  if (!button) return;

  const name = button.dataset.unsave;
  saveInterests(getInterests().filter((item) => item !== name));

  document.querySelectorAll("[data-opportunity]").forEach((item) => {
    if (item.dataset.opportunity === name) item.textContent = "Save interest";
  });

  renderInterests();
});

renderInterests();

document.querySelectorAll("[data-opportunity]").forEach((button) => {
  if (getInterests().includes(button.dataset.opportunity)) {
    button.textContent = "Saved ✓";
  }
});
