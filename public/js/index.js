const renderError = (message) => {
  const container = document.getElementById("form-errors");
  if (!container) return;
  container.innerHTML = message ? `<p class="flash-error">${message}</p>` : "";
};

const renderStatus = (isLoggedIn) => {
  const status = document.getElementById("user-status");
  if (!status) return;

  status.innerHTML = isLoggedIn
    ? '<div class="status-badge success"><i class="zmdi zmdi-check-circle"></i><span>You are logged in</span></div>'
    : '<div class="status-badge warning"><i class="zmdi zmdi-alert-circle"></i><span>You are not logged in</span></div>';
};

const renderLinks = (links) => {
  const list = document.getElementById("url-list");
  const empty = document.getElementById("empty-list");
  if (!list || !empty) return;

  list.innerHTML = "";
  if (!links || links.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  const host = window.location.host;

  links.forEach((link) => {
    const truncatedUrl = link.url.length >= 30 ? `${link.url.slice(0, 30)}...` : link.url;
    const item = document.createElement("li");
    item.className = "url-item";
    item.innerHTML = `
      <div class="url-info">
        <a href="/${link.shortCode}" class="short-url" target="_blank">
          <i class="zmdi zmdi-link"></i>
          ${host}/${link.shortCode}
        </a>
        <span class="original-url">${truncatedUrl}</span>
      </div>
      <div class="url-actions">
        <a href="/edit/${link.id}" class="copy-btn edit-btn" aria-label="Edit short link">
          <i class="zmdi zmdi-edit"></i>
        </a>
        <button class="copy-btn" data-url="${host}/${link.shortCode}" aria-label="Copy short link" type="button">
          <i class="zmdi zmdi-copy"></i>
        </button>
        <button class="copy-btn delete-btn" data-id="${link.id}" aria-label="Delete short link" type="button">
          <i class="zmdi zmdi-delete"></i>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
};

const loadLinks = async () => {
  const res = await fetch("/api/links", { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    if (res.status === 401) {
      renderStatus(false);
    }
    return;
  }

  const data = await res.json();
  renderLinks(data.links || []);
};

const handleCopyClick = (button) => {
  const url = button.getAttribute("data-url");
  if (!url) return;

  navigator.clipboard.writeText(url).then(() => {
    button.innerHTML = '<i class="zmdi zmdi-check"></i>';
    setTimeout(() => {
      button.innerHTML = '<i class="zmdi zmdi-copy"></i>';
    }, 2000);
  });
};

const handleDeleteClick = async (button) => {
  const id = button.getAttribute("data-id");
  if (!id) return;

  const res = await fetch(`/api/links/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    renderError(data.error || "Failed to delete link.");
    return;
  }

  renderError("");
  await loadLinks();
};

const initIndex = async () => {
  const form = document.getElementById("url-form");
  if (!form) return;

  try {
    const meRes = await fetch("/api/me", { headers: { "Accept": "application/json" } });
    const meData = await meRes.json().catch(() => ({ isLoggedIn: false }));
    renderStatus(Boolean(meData.isLoggedIn));
  } catch (err) {
    renderStatus(false);
  }

  await loadLinks();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    renderError("");

    const payload = {
      url: form.url.value,
      shortCode: form.shortCode.value
    };

    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      renderError(data.error || "Failed to create short link.");
      return;
    }

    form.reset();
    await loadLinks();
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest(".copy-btn");
    if (!target) return;

    if (target.hasAttribute("data-url")) {
      handleCopyClick(target);
      return;
    }

    if (target.hasAttribute("data-id")) {
      handleDeleteClick(target);
    }
  });
};

document.addEventListener("DOMContentLoaded", initIndex);
