// Dashboard init: sync + status indicator
import { initSync, onSyncStatus, isSyncConfigured } from './sync.js';

const dot   = document.getElementById('sync-dot');
const label = document.getElementById('sync-label');

const STATES = {
  idle:    { cls: 'dot--off',      text: 'No sync' },
  syncing: { cls: 'dot--syncing',  text: 'Syncing…' },
  ok:      { cls: 'dot--ok',       text: 'Synced' },
  error:   { cls: 'dot--error',    text: 'Sync error' },
};

function setStatus(status) {
  const s = STATES[status] ?? STATES.idle;
  dot.className = `sync-indicator__dot ${s.cls}`;
  label.textContent = s.text;
}

onSyncStatus(({ status }) => setStatus(status));

// Pull on load, then re-render the grid
(async () => {
  setStatus(isSyncConfigured() ? 'syncing' : 'idle');

  // links.js already did a local render; if sync pulls new data, re-render
  const { getApps } = await import('./storage.js');
  const grid        = document.getElementById('apps-grid');
  const emptyState  = document.getElementById('empty-state');

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function rerender() {
    const apps = getApps();
    grid.innerHTML = '';
    if (apps.length === 0) { emptyState.hidden = false; return; }
    emptyState.hidden = true;
    apps.forEach(app => {
      const a = document.createElement('a');
      a.className = 'app-card';
      a.href      = app.url;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.title     = app.name;
      a.innerHTML = `
        <span class="app-card__emoji">${app.emoji || '🔗'}</span>
        <span class="app-card__name">${escapeHtml(app.name)}</span>
      `;
      grid.appendChild(a);
    });
  }

  await initSync();
  rerender();  // re-render with potentially updated data from remote
})();
