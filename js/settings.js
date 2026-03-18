import { getSyncConfig, saveSyncConfig, clearSyncConfig, testConnection } from './sync.js';

const gistIdInput = document.getElementById('field-gist-id');
const tokenInput  = document.getElementById('field-token');
const form        = document.getElementById('sync-form');
const feedback    = document.getElementById('sync-feedback');
const btnSave     = document.getElementById('btn-save');
const btnClear    = document.getElementById('btn-clear');
const statusCard  = document.getElementById('sync-status-card');
const statusText  = document.getElementById('sync-status-text');
const statusIcon  = document.getElementById('sync-status-icon');
const gistPreview = document.getElementById('sync-gist-preview');

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `sync-feedback sync-feedback--${type}`;
  feedback.hidden      = false;
}

function hideFeedback() {
  feedback.hidden = true;
}

function renderCurrentConfig() {
  const cfg = getSyncConfig();
  if (cfg?.gistId && cfg?.token) {
    gistIdInput.value = cfg.gistId;
    tokenInput.value  = cfg.token;
    statusCard.hidden  = false;
    btnClear.hidden    = false;
    statusIcon.textContent = '✅';
    statusText.textContent = 'Sync is active';
    gistPreview.textContent = `Gist: …${cfg.gistId.slice(-8)}`;
  } else {
    statusCard.hidden = true;
    btnClear.hidden   = true;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideFeedback();

  const gistId = gistIdInput.value.trim();
  const token  = tokenInput.value.trim();

  if (!gistId || !token) {
    showFeedback('Please fill in both fields.', 'error');
    return;
  }

  btnSave.disabled    = true;
  btnSave.textContent = 'Testing…';

  const result = await testConnection(gistId, token);

  btnSave.disabled    = false;
  btnSave.textContent = 'Test & Save';

  if (result.ok) {
    saveSyncConfig({ gistId, token });
    showFeedback('✅ ' + result.msg, 'ok');
    renderCurrentConfig();
  } else {
    showFeedback('❌ ' + result.msg, 'error');
  }
});

btnClear.addEventListener('click', () => {
  if (!confirm('Disconnect sync? Your local app list will not be deleted.')) return;
  clearSyncConfig();
  gistIdInput.value = '';
  tokenInput.value  = '';
  hideFeedback();
  renderCurrentConfig();
  showFeedback('Sync disconnected.', 'info');
});

renderCurrentConfig();
