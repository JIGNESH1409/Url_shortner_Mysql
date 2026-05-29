const setNavbarActions = (isLoggedIn) => {
  const navbar = document.getElementById("navbar-actions");
  if (!navbar) return;

  if (isLoggedIn) {
    navbar.innerHTML = '<a href="/logout" class="btn-nav logout-btn">Logout</a>';
    return;
  }

  navbar.innerHTML =
    '<a href="/login" class="btn-nav login-btn">Log In</a>' +
    '<a href="/register" class="btn-nav register-btn">Get Started</a>';
};

const setFooterYear = () => {
  const year = document.getElementById("footer-year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

const initCommon = async () => {
  setFooterYear();

  try {
    const res = await fetch("/api/me", { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      setNavbarActions(false);
      return;
    }

    const data = await res.json();
    setNavbarActions(Boolean(data.isLoggedIn));
  } catch (err) {
    setNavbarActions(false);
  }
};

document.addEventListener("DOMContentLoaded", initCommon);
