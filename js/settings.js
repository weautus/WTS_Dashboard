import { getSyncConfig, clearSyncConfig, isSyncConfigured, testConnection } from './sync.js';

const tokenInput  = document.getElementById('field-token');
const form        = document.getElementById('sync-form');
const feedback    = document.getElementById('sync-feedback');
const btnSave     = document.getElementById('btn-save');
const btnClear    = document.getElementById('btn-clear');
const statusCard  = document.getElementById('sync-status-card');
const statusText  = document.getElementById('sync-status-text');
const syncDetail  = document.getElementById('sync-detail');

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `sync-feedback sync-feedback--${type}`;
  feedback.hidden      = false;
}

function render() {
  const cfg = getSyncConfig();
  if (cfg?.token) {
    tokenInput.value    = cfg.token;
    statusCard.hidden   = false;
    btnClear.hidden     = false;
    statusText.textContent = 'Sync is active';
    syncDetail.textContent = cfg.gistId ? `Gist: …${cfg.gistId.slice(-8)}` : 'Gist will be resolved on next sync';
  } else {
    statusCard.hidden = true;
    btnClear.hidden   = true;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.hidden = true;

  const token = tokenInput.value.trim();
  if (!token) { showFeedback('Please paste your token.', 'error'); return; }

  btnSave.disabled    = true;
  btnSave.textContent = 'Connecting…';

  const result = await testConnection(token);

  btnSave.disabled    = false;
  btnSave.textContent = 'Connect';

  if (result.ok) {
    showFeedback('✅ ' + result.msg, 'ok');
    render();
  } else {
    showFeedback('❌ ' + result.msg, 'error');
  }
});

btnClear.addEventListener('click', () => {
  if (!confirm('Disconnect sync? Your local app list will not be deleted.')) return;
  clearSyncConfig();
  tokenInput.value = '';
  feedback.hidden  = true;
  render();
  showFeedback('Sync disconnected.', 'info');
});

render();
