const KEY = 'adet-fiyat-state/v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.rows)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveState(rows) {
  try {
    const payload = { rows };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {}
}

export function clearState() {
  try { localStorage.removeItem(KEY); } catch {}
}
