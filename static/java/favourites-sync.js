(function () {
  // Utility to dispatch a global event when favourites are changed
  function fireFavouritesChanged() {
    window.dispatchEvent(new CustomEvent('favourites:changed'));
  }

  // Listen for backend changes triggered by other scripts (optional)
  // This is used by hoverthreed-favourites.js after toggles.
  window.__favouritesSync = {
    fireFavouritesChanged,
  };
})();

