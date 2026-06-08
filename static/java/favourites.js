(function () {
  async function getJson(url) {
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : res.statusText;
      throw new Error(msg);
    }
    return data;
  }

  function routeToTitle(route) {
    // Must match your app routes list
    switch (route) {
      case '/twozerofoureight':
        return '2048';
      case '/pingpong':
        return 'PING PONG';
      case '/sudoku':
        return 'SUDOKU';
      case '/puzzle':
        return 'PUZZLE';
      case '/memory-cards':
        return 'MEMORY CARDS';
      case '/tictactoe':
        return 'TIC TAC TOE';
      case '/rockpaperscissors':
        return 'ROCK PAPER SCISSORS';
      case '/slide-puzzle':
        return 'SLIDE PUZZLE';
      case '/space-invaders':
        return 'SPACE INVADERS';
      case '/hangman':
        return 'HANGMAN';
      case '/blackjack':
        return 'BLACKJACK';
      case '/wordle':
        return 'WORDLE';
      case '/whackamole':
        return 'WHACK-A-MOLE';
      case '/flappy-bird':
        return 'FLAPPY BIRD';
      case '/minesweeper':
        return 'MINESWEEPER';
      case '/connect-four':
        return 'CONNECT FOUR';
      case '/dino-game':
        return 'DINO GAME';
      case '/doodle-jump':
        return 'DOODLE JUMP';
      case '/snake':
        return 'SNAKE';
      case '/candy-crush':
        return 'CANDY CRUSH';
      default:
        return route;
    }
  }

  function el(id) {
    return document.getElementById(id);
  }

  async function renderFavourites() {
    const wrap = el('favourites-section');
    const grid = el('favourites-grid');
    const status = el('favourites-status');

    if (!wrap || !grid || !status) return;

    // Default UI
    grid.innerHTML = '';
    status.textContent = 'Loading favourites...';

    try {
      // If not logged in, /api/favourites returns 401
      const me = await fetch('/api/auth/me', { credentials: 'include' });
      if (!me.ok) {
        wrap.style.display = 'none';
        return;
      }

      const data = await getJson('/api/favourites');
      const routes = Array.isArray(data.routes) ? data.routes : [];

      if (!routes.length) {
        status.textContent = 'You have no favourites yet. ⭐';
        return;
      }

      status.textContent = '';

      for (const route of routes) {
        const a = document.createElement('a');
        a.className = 'favourites-link';
        a.href = route;

        const chip = document.createElement('div');
        chip.className = 'favourites-chip';
        chip.textContent = routeToTitle(route);

        a.appendChild(chip);
        grid.appendChild(a);
      }
    } catch (e) {
      status.textContent = '';
      grid.innerHTML = '';
      status.textContent = 'Could not load favourites.';
      // Keep section visible if logged in but API failed.
    }
  }

  function setupFavouritesChangedListener() {
    window.addEventListener('favourites:changed', () => {
      // Re-render without requiring a manual refresh.
      renderFavourites();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderFavourites();
    setupFavouritesChangedListener();
  });
})();


