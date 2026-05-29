const renderError = (message) => {
  const container = document.getElementById("form-errors");
  if (!container) return;
  container.innerHTML = message ? `<p class="flash-error">${message}</p>` : "";
};

const handleAuth = async (form, endpoint) => {
  const payload = Object.fromEntries(new FormData(form));

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    renderError(data.error || "Something went wrong.");
    return false;
  }

  renderError("");
  return true;
};

const initAuth = () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const ok = await handleAuth(loginForm, "/login");
      if (ok) window.location.href = "/";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const ok = await handleAuth(registerForm, "/register");
      if (ok) window.location.href = "/login";
    });
  }
};

document.addEventListener("DOMContentLoaded", initAuth);
