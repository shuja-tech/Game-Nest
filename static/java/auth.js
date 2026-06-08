(function () {
  async function postJson(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : res.statusText;
      throw new Error(msg);
    }
    return data;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }

  function showAuthError(formEl, message) {
    let box = formEl.querySelector('.auth-error');
    if (!box) {
      box = document.createElement('div');
      box.className = 'auth-error';
      box.style.color = '#ff3b3b';
      box.style.marginTop = '10px';
      formEl.appendChild(box);
    }
    box.textContent = message;
  }

  async function handleLogin(e) {
    e.preventDefault();

    const form = document.getElementById('login-form');
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = document.getElementById('login-password')?.value || '';

    try {
      const data = await postJson('/api/auth/login', { username, password });
      if (data && data.ok) {
        window.location.href = '/';
      }
    } catch (err) {
      showAuthError(form, err.message || 'Login failed');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();

    const form = document.getElementById('signup-form');
    const username = (document.getElementById('signup-username')?.value || '').trim();
    const password = document.getElementById('signup-password')?.value || '';

    try {
      const data = await postJson('/api/auth/signup', { username, password });
      if (data && data.ok) {
        window.location.href = '/';
      }
    } catch (err) {
      showAuthError(form, err.message || 'Signup failed');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('logout-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        await logout();
      } catch (e) {
        alert(e.message || 'Logout failed');
      }
    });
  });

  // Expose handlers expected by templates/login.html and templates/signup.html
  window.__authHandlers = {
    handleLogin,
    handleSignup,
  };
})();



