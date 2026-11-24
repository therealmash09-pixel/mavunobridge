
"use strict";

const LOGIN_USER_KEY = "mavunobridge_demo_user_v1";

const loginEl = (selector) => document.querySelector(selector);

const form = loginEl("#supabaseAuthForm");
const nameInput = loginEl("#loginName");
const emailInput = loginEl("#loginEmail");
const passwordInput = loginEl("#loginPassword");
const roleInput = loginEl("#loginRole");
const nameField = loginEl("#nameField");
const roleField = loginEl("#roleField");
const heading = loginEl("#authHeading");
const subtitle = loginEl("#authSubtitle");
const submitButton = loginEl("#authSubmitButton");
const modeToggle = loginEl("#authModeToggle");
const modePrompt = loginEl("#modePrompt");
const notice = loginEl("#loginNotice");

let isSignUp = true;

function showNotice(message) {
  notice.textContent = message;
}

function setLoading(loading) {
  submitButton.disabled = loading;
  modeToggle.disabled = loading;

  submitButton.textContent = loading
    ? "Please wait..."
    : isSignUp
      ? "Create account"
      : "Sign in";
}

function setMode(signUp) {
  isSignUp = signUp;

  heading.textContent = signUp ? "Create your account" : "Welcome back";

  subtitle.textContent = signUp
    ? "Join MavunoBridge and connect with Kenya's agricultural marketplace."
    : "Sign in to continue to MavunoBridge.";

  nameField.hidden = !signUp;
  roleField.hidden = !signUp;

  nameInput.required = signUp;
  roleInput.required = signUp;

  nameInput.disabled = !signUp;
  roleInput.disabled = !signUp;

  passwordInput.autocomplete = signUp
    ? "new-password"
    : "current-password";

  submitButton.textContent = signUp ? "Create account" : "Sign in";

  modePrompt.textContent = signUp
    ? "Already have an account?"
    : "New to MavunoBridge?";

  modeToggle.textContent = signUp ? "Sign in" : "Create account";

  showNotice(
    signUp
      ? "Your account will be securely managed by Supabase."
      : "Enter your email and password to access your account."
  );
}

modeToggle.addEventListener("click", () => {
  setMode(!isSignUp);
});

function saveAuthenticatedUser(authUser) {
  const metadata = authUser.user_metadata || {};

  const user = {
    id: authUser.id,
    name:
      metadata.full_name ||
      authUser.email?.split("@")[0] ||
      "MavunoBridge User",
    email: authUser.email || "",
    role: metadata.role || "buyer",
    demo: false,
    signedInAt: Date.now()
  };

  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(user));

  return user;
}

function redirectToMarketplace() {
  window.location.href = "index.html";
}

function getFriendlyError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password. Please check your details.";
  }

  if (message.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }

  if (message.includes("already registered")) {
    return "This email already has an account. Please sign in instead.";
  }

  if (message.includes("password")) {
    return error.message;
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Connection problem. Please check your internet and try again.";
  }

  return error?.message || "Something went wrong. Please try again.";
}

async function handleAuthentication(event) {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!window.supabase || !window.MAVUNO_SUPABASE_URL ||
      !window.MAVUNO_SUPABASE_ANON_KEY) {
    showNotice("Supabase has not loaded correctly. Please refresh the page.");
    return;
  }

  setLoading(true);

  try {
    const client = window.supabase.createClient(
      window.MAVUNO_SUPABASE_URL,
      window.MAVUNO_SUPABASE_ANON_KEY
    );

    if (isSignUp) {
      const name = nameInput.value.trim();
      const role = roleInput.value;

      if (!name) {
        showNotice("Please enter your name.");
        return;
      }

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (error) throw error;

      if (data.session && data.user) {
        saveAuthenticatedUser(data.user);

        showNotice("Account created successfully! Redirecting...");

        setTimeout(redirectToMarketplace, 900);
      } else {
        showNotice(
          "Registration successful! Please check your email and click the verification link before signing in."
        );

        setMode(false);
        emailInput.value = email;
      }

    } else {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Could not retrieve your account details.");
      }

      saveAuthenticatedUser(data.user);

      showNotice("Welcome back! Redirecting to MavunoBridge...");

      setTimeout(redirectToMarketplace, 900);
    }

  } catch (error) {
    console.error("MavunoBridge authentication error:", error);
    showNotice(getFriendlyError(error));

  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", handleAuthentication);

setMode(true);

// Restore the email field from a previous browser session, if available.
try {
  const saved = JSON.parse(localStorage.getItem(LOGIN_USER_KEY) || "null");

  if (saved) {
    emailInput.value = saved.email || "";
    nameInput.value = saved.name || "";
    roleInput.value = ["buyer", "farmer", "both"].includes(saved.role)
      ? saved.role
      : "buyer";
  }
} catch (error) {
  console.warn("Could not restore previous login details:", error);
}
