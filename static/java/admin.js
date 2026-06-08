(function () {
  const tbody = document.getElementById('admin-users-tbody');
  const refreshBtn = document.getElementById('admin-refresh-btn');
  const errorEl = document.getElementById('admin-error');

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  async function loadUsers() {
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="padding:14px; color: rgba(255,255,255,0.75);">Loading…</td></tr>';
    if (errorEl) errorEl.textContent = '';

    const res = await fetch('/api/admin/users', { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (errorEl) errorEl.textContent = data.error || ('Admin load failed: ' + res.status);
      return;
    }

    const data = await res.json();
    const users = data.users || [];

    if (!tbody) return;
    tbody.innerHTML = users.map(u => {
      const userId = escapeHtml(u.user_id);
      const username = escapeHtml(u.username);
      const passwordHash = escapeHtml(u.password_hash || '');

      return `
        <tr>
          <td style="padding:12px; color: rgba(255,255,255,0.9); border-bottom:1px solid rgba(255,255,255,0.08);">${userId}</td>
          <td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">
            <input data-username-input="${userId}" value="${username}" style="width: 180px; padding:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color:#fff;" />
          </td>
          <td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08); max-width: 280px; overflow: hidden; text-overflow: ellipsis;">
            <input data-phash-input="${userId}" value="${passwordHash}" style="width: 260px; padding:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color:#fff;" />
          </td>
          <td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">
            <button data-save-btn="${userId}" class="dashboard-link dashboard-link--ghost" style="height:36px; padding:0 12px; margin-right:10px;" type="button">Save</button>
            <button data-delete-btn="${userId}" class="dashboard-link dashboard-link--ghost" style="height:36px; padding:0 12px;" type="button">Delete</button>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('[data-save-btn]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-save-btn');
        const usernameInput = tbody.querySelector(`[data-username-input="${CSS.escape(id)}"]`);
        const phashInput = tbody.querySelector(`[data-phash-input="${CSS.escape(id)}"]`);

        const username = usernameInput ? usernameInput.value : '';
        const password_hash = phashInput ? phashInput.value : '';

        const res = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: id, username, password_hash })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (errorEl) errorEl.textContent = data.error || ('Save failed: ' + res.status);
          return;
        }
        await loadUsers();
      });
    });

    tbody.querySelectorAll('[data-delete-btn]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-btn');
        if (!confirm('Delete user ' + id + '?')) return;

        const res = await fetch('/api/admin/users?user_id=' + encodeURIComponent(id), { method: 'DELETE' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (errorEl) errorEl.textContent = data.error || ('Delete failed: ' + res.status);
          return;
        }
        await loadUsers();
      });
    });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', loadUsers);
  loadUsers();
})();

