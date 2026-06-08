(function () {
  function recordPlay(route) {
    if (!route) return;
    fetch('/api/games/played', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ route })
    }).catch(() => { /* ignore */ });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Record current page play (best effort)
    // Avoid recording the browser/listing pages like /hoverthreed.
    try {
      const path = window.location.pathname;
      if (path && path !== '/' && path !== '/hoverthreed') {
        recordPlay(path);
      }
    } catch (e) {
      // ignore
    }
  });
})();


