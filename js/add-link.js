// Page: add / manage app links
import { getApps, saveApps } from './storage.js';

const form       = document.getElementById('add-form');
const nameInput  = document.getElementById('field-name');
const urlInput   = document.getElementById('field-url');
const emojiInput = document.getElementById('field-emoji');
const errorBox   = document.getElementById('form-error');
const savedList  = document.getElementById('saved-list');

// ---- helpers ----

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}
function clearError() {
  errorBox.hidden = true;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// ---- render saved list ----

function renderSavedList() {
  const apps = getApps();
  savedList.innerHTML = '';

  if (apps.length === 0) {
    const li = document.createElement('li');
    li.style.color    = 'var(--text-muted)';
    li.style.fontSize = '.85rem';
    li.textContent    = 'No apps saved yet.';
    savedList.appendChild(li);
    return;
  }

  apps.forEach((app, index) => {
    const li = document.createElement('li');
    li.className = 'saved-list__item';
    li.innerHTML = `
      <span class="saved-list__emoji">${app.emoji || '🔗'}</span>
      <div style="flex:1;overflow:hidden">
        <div class="saved-list__name">${escapeHtml(app.name)}</div>
        <div class="saved-list__url">${escapeHtml(app.url)}</div>
      </div>
      <button class="saved-list__delete" data-index="${index}" title="Remove">✕</button>
    `;
    savedList.appendChild(li);
  });
}

// ---- form submit ----

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();

  const name  = nameInput.value.trim();
  const url   = urlInput.value.trim();
  const emoji = emojiInput.value.trim() || '🔗';

  if (!name) return showError('Please enter an app name.');
  if (!isValidUrl(url)) return showError('Please enter a valid URL (https://…).');

  const apps = getApps();
  apps.push({ name, url, emoji });
  saveApps(apps);

  form.reset();
  renderSavedList();
});

// ---- delete ----

savedList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-index]');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const apps  = getApps();
  apps.splice(index, 1);
  saveApps(apps);
  renderSavedList();
});

// ---- init ----
renderSavedList();
