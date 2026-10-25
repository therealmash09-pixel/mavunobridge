
"use strict";

const LOGIN_USER_KEY = "mavunobridge_demo_user_v1";

const loginEl = (selector) => document.querySelector(selector);

function saveDemoUser(name, email, role) {
  const user = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    demo: true,
    signedInAt: Date.now()
  };

  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(user));
  loginEl("#loginNotice").textContent =
    `Demo sign-in complete. Welcome, ${user.name}! Redirecting to the marketplace...`;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 650);
}

loginEl("#demoLoginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  try {
    saveDemoUser(
      loginEl("#loginName").value,
      loginEl("#loginEmail").value,
      loginEl("#loginRole").value
    );
  } catch (error) {
    loginEl("#loginNotice").textContent =
      "Could not save the demo session. Check that your browser allows local storage.";
  }
});

const googleModal = loginEl("#googleDemoModal");

loginEl("#googleDemoButton")?.addEventListener("click", () => {
  googleModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

function closeGoogleModal() {
  googleModal.classList.add("hidden");
  document.body.style.overflow = "";
}

loginEl("#cancelGoogleDemo")?.addEventListener("click", closeGoogleModal);

googleModal?.addEventListener("click", (event) => {
  if (event.target === googleModal) closeGoogleModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGoogleModal();
});

loginEl("#googleDemoForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  try {
    saveDemoUser(
      loginEl("#googleDemoName").value,
      loginEl("#googleDemoEmail").value,
      "Buyer"
    );
  } catch (error) {
    closeGoogleModal();
    loginEl("#loginNotice").textContent =
      "Could not save the demo session. Check your browser storage settings.";
  }
});

// If a demo user is already saved, prefill the form.
try {
  const saved = JSON.parse(localStorage.getItem(LOGIN_USER_KEY) || "null");
  if (saved) {
    loginEl("#loginName").value = saved.name || "";
    loginEl("#loginEmail").value = saved.email || "";
    loginEl("#loginRole").value = saved.role || "Buyer";
  }
} catch (_) {
  // The login form still works when no saved session exists.
}
