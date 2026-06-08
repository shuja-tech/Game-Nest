(function () {
  function el(id) {
    return document.getElementById(id);
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

  function routeToTitle(route) {
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
      // If something else slips in (like /hoverthreed), hide it via placeholder.
      case '/hoverthreed':
        return null;
      default:
        return route;
    }
  }


  async function loadRecent() {
    const wrap = el('recently-played-section');
    const grid = el('recently-played-grid');
    const status = el('recently-played-status');
    if (!wrap || !grid || !status) return;

    grid.innerHTML = '';
    status.textContent = 'Loading...';

    try {
      const me = await fetch('/api/auth/me', { credentials: 'include' });
      if (!me.ok) {
        wrap.style.display = 'none';
        return;
      }

      const data = await getJson('/api/games/recent');
      const games = Array.isArray(data.games) ? data.games : [];

      if (!games.length) {
        status.textContent = 'No games played yet. 🎮';
        return;
      }

      status.textContent = '';

      // Limitation: show only the last played game
      const lastGame = games[0];
      for (const game of (lastGame ? [lastGame] : [])) {

        const route = game.route;
        const title = game.title;
        if (!route || !title) continue;

        const a = document.createElement('a');
        a.className = 'favourites-link';
        a.href = route;

        const chip = document.createElement('div');
        chip.className = 'favourites-chip';
        chip.textContent = title;

        a.appendChild(chip);
        grid.appendChild(a);
      }
    } catch (e) {
      status.textContent = '';
      grid.innerHTML = '';
      status.textContent = 'Could not load recently played.';
    }
  }

  document.addEventListener('DOMContentLoaded', loadRecent);
})();

