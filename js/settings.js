import { getSyncConfig, saveSyncConfig, clearSyncConfig, isSyncConfigured, testConnection } from './sync.js';

const binIdInput  = document.getElementById('field-bin-id');
const apiKeyInput = document.getElementById('field-api-key');
const form        = document.getElementById('sync-form');
const feedback    = document.getElementById('sync-feedback');
const btnSave     = document.getElementById('btn-save');
const btnClear    = document.getElementById('btn-clear');
const statusCard  = document.getElementById('sync-status-card');
const statusText  = document.getElementById('sync-status-text');
const statusIcon  = document.getElementById('sync-status-icon');
const binPreview  = document.getElementById('sync-bin-preview');

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
  if (cfg?.binId && cfg?.apiKey) {
    binIdInput.value  = cfg.binId;
    apiKeyInput.value = cfg.apiKey;
    statusCard.hidden  = false;
    btnClear.hidden    = false;
    statusIcon.textContent = '✅';
    statusText.textContent = 'Sync is active';
    binPreview.textContent = `Bin: …${cfg.binId.slice(-8)}`;
  } else {
    statusCard.hidden = true;
    btnClear.hidden   = true;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideFeedback();

  const binId  = binIdInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!binId || !apiKey) {
    showFeedback('Please fill in both fields.', 'error');
    return;
  }

  btnSave.disabled  = true;
  btnSave.textContent = 'Testing…';

  const result = await testConnection(binId, apiKey);

  btnSave.disabled  = false;
  btnSave.textContent = 'Test & Save';

  if (result.ok) {
    saveSyncConfig({ binId, apiKey });
    showFeedback('✅ ' + result.msg, 'ok');
    renderCurrentConfig();
  } else {
    showFeedback('❌ ' + result.msg, 'error');
  }
});

btnClear.addEventListener('click', () => {
  if (!confirm('Disconnect sync? Your local app list will not be deleted.')) return;
  clearSyncConfig();
  binIdInput.value  = '';
  apiKeyInput.value = '';
  hideFeedback();
  renderCurrentConfig();
  showFeedback('Sync disconnected.', 'info');
});

// Init
renderCurrentConfig();
