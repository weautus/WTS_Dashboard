// Sync module — persists app list to a GitHub Gist so all devices stay in sync.
//
// Setup (one-time):
//  1. Go to https://github.com/settings/tokens/new
//     - Note: "WTS Dashboard sync"
//     - Expiration: No expiration (or as you prefer)
//     - Scope: check only "gist"
//     - Click "Generate token" and copy it
//  2. Create a new Gist at https://gist.github.com
//     - Filename: wts-dashboard.json
//     - Content: {"apps":[]}
//     - You can make it secret (not public)
//     - Click "Create secret gist" and copy the Gist ID from the URL
//  3. Enter both in the Dashboard Settings page (settings.html)

import { getApps, saveApps } from './storage.js';

const CONFIG_KEY   = 'wts_sync_config';   // {gistId, token}
const GIST_FILE    = 'wts-dashboard.json';
const API_BASE     = 'https://api.github.com/gists';
const STATUS_EVENT = 'wts:syncstatus';    // detail: {status:'idle'|'syncing'|'ok'|'error', msg?}

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
  return !!(cfg?.gistId && cfg?.token);
}

// ---- status events ----

function emit(status, msg) {
  window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status, msg } }));
}

// ---- headers ----

function headers(token) {
  return {
    'Accept':        'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

// ---- remote operations ----

/** Fetch remote apps list. Returns array or null on failure. */
export async function pull() {
  const cfg = getSyncConfig();
  if (!cfg) return null;

  emit('syncing');
  try {
    const res = await fetch(`${API_BASE}/${cfg.gistId}`, {
      headers: headers(cfg.token),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const gist = await res.json();
    const raw  = gist.files?.[GIST_FILE]?.content;
    if (!raw) throw new Error(`File "${GIST_FILE}" not found in gist.`);
    const data = JSON.parse(raw);
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
    const res  = await fetch(`${API_BASE}/${cfg.gistId}`, {
      method: 'PATCH',
      headers: {
        ...headers(cfg.token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILE]: { content: JSON.stringify({ apps }, null, 2) },
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    emit('ok');
  } catch (err) {
    console.warn('[sync] push failed:', err);
    emit('error', err.message);
  }
}

/** Test credentials — used by the settings page. Returns {ok, msg}. */
export async function testConnection(gistId, token) {
  try {
    const res = await fetch(`${API_BASE}/${gistId}`, {
      headers: headers(token),
    });
    if (res.status === 401) return { ok: false, msg: 'Invalid token. Make sure it has the "gist" scope.' };
    if (res.status === 404) return { ok: false, msg: 'Gist not found. Double-check the Gist ID.' };
    if (!res.ok)            return { ok: false, msg: `GitHub API error (HTTP ${res.status}).` };

    const gist = await res.json();
    if (!gist.files?.[GIST_FILE]) {
      return {
        ok: false,
        msg: `Gist found, but missing file "${GIST_FILE}". ` +
             `Add a file named exactly "${GIST_FILE}" with content {"apps":[]}.`,
      };
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

export async function initSync() {
  if (!isSyncConfigured()) {
    emit('idle');
    return;
  }
  await pull();
}
