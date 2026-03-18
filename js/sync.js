// Sync module — persists app list to JSONBin.io so all devices stay in sync.
//
// Setup (one-time):
//  1. Create a free account at https://jsonbin.io
//  2. Create a new Bin with content: {"apps":[]}
//  3. Copy the Bin ID and your Master API Key
//  4. Enter both in the Dashboard Settings page (settings.html)

import { getApps, saveApps } from './storage.js';

const CONFIG_KEY  = 'wts_sync_config';  // {binId, apiKey}
const BASE_URL    = 'https://api.jsonbin.io/v3/b';
const STATUS_EVENT = 'wts:syncstatus'; // detail: {status:'idle'|'syncing'|'ok'|'error', msg?}

// ---- config helpers ----

export function getSyncConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null'); }
  catch { return null; }
}

export function saveSyncConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

export function clearSyncConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

export function isSyncConfigured() {
  const cfg = getSyncConfig();
  return !!(cfg?.binId && cfg?.apiKey);
}

// ---- status events ----

function emit(status, msg) {
  window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status, msg } }));
}

// ---- remote operations ----

async function buildHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': apiKey,
    'X-Bin-Meta':   'false',   // return only the stored JSON, not the wrapper
  };
}

/** Fetch remote apps list. Returns array or null on failure. */
export async function pull() {
  const cfg = getSyncConfig();
  if (!cfg) return null;

  emit('syncing');
  try {
    const res = await fetch(`${BASE_URL}/${cfg.binId}/latest`, {
      headers: await buildHeaders(cfg.apiKey),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const apps = Array.isArray(data.apps) ? data.apps : [];
    saveApps(apps);
    emit('ok');
    return apps;
  } catch (err) {
    console.warn('[sync] pull failed:', err);
    emit('error', err.message);
    return null;
  }
}

/** Push current local apps list to remote. */
export async function push() {
  const cfg = getSyncConfig();
  if (!cfg) return;

  emit('syncing');
  try {
    const apps = getApps();
    const res = await fetch(`${BASE_URL}/${cfg.binId}`, {
      method: 'PUT',
      headers: await buildHeaders(cfg.apiKey),
      body: JSON.stringify({ apps }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    emit('ok');
  } catch (err) {
    console.warn('[sync] push failed:', err);
    emit('error', err.message);
  }
}

/** Test credentials — used by the settings page. Returns {ok, msg}. */
export async function testConnection(binId, apiKey) {
  try {
    const res = await fetch(`${BASE_URL}/${binId}/latest`, {
      headers: {
        'X-Master-Key': apiKey,
        'X-Bin-Meta': 'false',
      },
    });
    if (res.status === 401) return { ok: false, msg: 'Invalid API key.' };
    if (res.status === 404) return { ok: false, msg: 'Bin not found. Double-check the Bin ID.' };
    if (!res.ok)            return { ok: false, msg: `Server error (HTTP ${res.status}).` };
    const data = await res.json();
    if (!Array.isArray(data?.apps)) {
      return { ok: false, msg: 'Bin found but missing "apps" array. Make sure the bin contains {"apps":[]}.' };
    }
    return { ok: true, msg: 'Connection successful!' };
  } catch (err) {
    return { ok: false, msg: `Network error: ${err.message}` };
  }
}

// ---- status listener helper (used by index.html) ----

export function onSyncStatus(callback) {
  window.addEventListener(STATUS_EVENT, e => callback(e.detail));
}

// ---- init: pull on page load if configured ----
// Called explicitly by pages that need auto-sync.
export async function initSync() {
  if (!isSyncConfigured()) {
    emit('idle');
    return;
  }
  await pull();
}
