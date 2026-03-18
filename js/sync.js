// Sync module — GitHub Gist backend.
// The user only provides a PAT (gist scope). The app finds or creates
// the dedicated gist automatically.

import { getApps, saveApps } from './storage.js';

const CONFIG_KEY   = 'wts_sync_config';   // { token, gistId }
const GIST_FILE    = 'wts-dashboard.json';
const GIST_DESC    = 'WTS Dashboard sync';
const API          = 'https://api.github.com';
const STATUS_EVENT = 'wts:syncstatus';

// ---- config ----

export function getSyncConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null'); }
  catch { return null; }
}

function saveSyncConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

export function clearSyncConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

export function isSyncConfigured() {
  return !!getSyncConfig()?.token;
}

// ---- status ----

function emit(status, msg) {
  window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status, msg } }));
}

export function onSyncStatus(cb) {
  window.addEventListener(STATUS_EVENT, e => cb(e.detail));
}

// ---- GitHub helpers ----

function gh(path, token, opts = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Accept':               'application/vnd.github+json',
      'Authorization':        `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':         'application/json',
      ...(opts.headers ?? {}),
    },
  });
}

/** Find our gist or create it. Returns gistId or throws. */
async function resolveGistId(token) {
  // Check cache first
  const cached = getSyncConfig();
  if (cached?.gistId) return cached.gistId;

  // Search through user's gists (up to 100)
  const res = await gh('/gists?per_page=100', token);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const list = await res.json();
  const found = list.find(g => g.files?.[GIST_FILE]);
  if (found) {
    saveSyncConfig({ token, gistId: found.id });
    return found.id;
  }

  // Not found → create it
  const create = await gh('/gists', token, {
    method: 'POST',
    body: JSON.stringify({
      description: GIST_DESC,
      public: false,
      files: { [GIST_FILE]: { content: JSON.stringify({ apps: [] }, null, 2) } },
    }),
  });
  if (!create.ok) throw new Error(`Could not create gist (HTTP ${create.status})`);
  const gist = await create.json();
  saveSyncConfig({ token, gistId: gist.id });
  return gist.id;
}

// ---- public API ----

export async function pull() {
  const cfg = getSyncConfig();
  if (!cfg?.token) return null;
  emit('syncing');
  try {
    const gistId = await resolveGistId(cfg.token);
    const res    = await gh(`/gists/${gistId}`, cfg.token);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const gist = await res.json();
    const data = JSON.parse(gist.files[GIST_FILE].content);
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

export async function push() {
  const cfg = getSyncConfig();
  if (!cfg?.token) return;
  emit('syncing');
  try {
    const gistId = await resolveGistId(cfg.token);
    const res    = await gh(`/gists/${gistId}`, cfg.token, {
      method: 'PATCH',
      body: JSON.stringify({
        files: { [GIST_FILE]: { content: JSON.stringify({ apps: getApps() }, null, 2) } },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    emit('ok');
  } catch (err) {
    console.warn('[sync] push failed:', err);
    emit('error', err.message);
  }
}

/** Validate token and resolve (or create) the gist. Returns { ok, msg }. */
export async function testConnection(token) {
  try {
    const userRes = await gh('/user', token);
    if (userRes.status === 401) return { ok: false, msg: 'Invalid token — make sure it has the "gist" scope.' };
    if (!userRes.ok)            return { ok: false, msg: `GitHub error (HTTP ${userRes.status}).` };
    const user = await userRes.json();

    // Temporarily store just the token so resolveGistId can cache the result
    saveSyncConfig({ token });
    await resolveGistId(token);

    return { ok: true, msg: `Connected as @${user.login}. Gist ready!` };
  } catch (err) {
    clearSyncConfig();
    return { ok: false, msg: `Error: ${err.message}` };
  }
}

export async function initSync() {
  if (!isSyncConfigured()) { emit('idle'); return; }
  await pull();
}
