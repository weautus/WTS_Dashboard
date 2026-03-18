// Widget: app links grid (reads from localStorage)
import { getApps } from './storage.js';

const grid       = document.getElementById('apps-grid');
const emptyState = document.getElementById('empty-state');

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderGrid() {
  const apps = getApps();
  grid.innerHTML = '';

  if (apps.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  apps.forEach((app) => {
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

renderGrid();
