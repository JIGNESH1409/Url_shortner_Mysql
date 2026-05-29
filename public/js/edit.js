const renderError = (message) => {
  const container = document.getElementById("form-errors");
  if (!container) return;
  container.innerHTML = message ? `<p class="flash-error">${message}</p>` : "";
};

const getEditId = () => {
  const match = window.location.pathname.match(/\/edit\/(\d+)/);
  return match ? match[1] : null;
};

const initEdit = async () => {
  const form = document.getElementById("edit-form");
  if (!form) return;

  const id = getEditId();
  if (!id) {
    renderError("Invalid edit link.");
    return;
  }

  const res = await fetch(`/api/links/${id}`, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    renderError(data.error || "Unable to load link.");
    return;
  }

  const data = await res.json();
  if (data.link) {
    form.url.value = data.link.url || "";
    form.shortCode.value = data.link.shortCode || "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    renderError("");

    const payload = {
      url: form.url.value,
      shortCode: form.shortCode.value
    };

    const updateRes = await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json().catch(() => ({}));
      renderError(errData.error || "Failed to update link.");
      return;
    }

    window.location.href = "/";
  });
};

document.addEventListener("DOMContentLoaded", initEdit);
