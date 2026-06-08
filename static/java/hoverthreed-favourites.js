(function () {
  async function postJson(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : res.statusText;
      throw new Error(msg);
    }
    return data;
  }

  async function getJson(url) {
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : res.statusText;
      throw new Error(msg);
    }
    return data;
  }

  function updateStarUI(favRoutes) {
    const stars = document.querySelectorAll('.fav-star');
    const set = new Set(favRoutes || []);
    stars.forEach((btn) => {
      const route = btn.getAttribute('data-route');
      if (!route) return;
      const isFav = set.has(route);
      btn.textContent = isFav ? '★' : '☆';
      btn.classList.toggle('is-fav', isFav);
    });
  }

  async function refreshFavourites() {
    try {
      // login-only check via /api/favourites (401 means logged out)
      const data = await getJson('/api/favourites');
      updateStarUI(data.routes || []);
    } catch (e) {
      updateStarUI([]);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    refreshFavourites();

    document.querySelectorAll('.fav-star').forEach((btn) => {
      btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const route = btn.getAttribute('data-route');
        if (!route) return;

        try {
          await postJson('/api/favourites/toggle', { route });
          await refreshFavourites();

          // Notify other pages (e.g. home) to refresh favourites without manual reload.
          try {
            if (window.__favouritesSync && typeof window.__favouritesSync.fireFavouritesChanged === 'function') {
              window.__favouritesSync.fireFavouritesChanged();
            } else {
              window.dispatchEvent(new CustomEvent('favourites:changed'));
            }
          } catch (_) {}

        } catch (e) {
          alert(e.message || 'Please login to use favourites');
          window.location.href = '/login';
        }
      });
    });
  });
})();

