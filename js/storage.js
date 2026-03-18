// Shared storage helpers for app links
const STORAGE_KEY = 'wts_apps';

export function getApps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveApps(apps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}
