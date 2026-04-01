type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

type ConsentRecord = {
  version: number;
  timestamp: string; // ISO
  prefs: ConsentPreferences;
};

const STORAGE_KEY = 'cookieConsent_v1';

let subscribers: Array<(record: ConsentRecord | null) => void> = [];

export function getConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

export function setConsent(prefs: ConsentPreferences) {
  const record: ConsentRecord = {
    version: 1,
    timestamp: new Date().toISOString(),
    prefs,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {}
  notify(record);
}

export function acceptAll() {
  setConsent({ analytics: true, marketing: true });
}

export function rejectAll() {
  setConsent({ analytics: false, marketing: false });
  // Optionally remove non-essential cookies here
  try {
    // Best-effort: remove common analytics cookies
    document.cookie = '_ga=; Max-Age=0; path=/';
    document.cookie = '_gid=; Max-Age=0; path=/';
  } catch {}
}

export function hasConsentForAnalytics(): boolean {
  const c = getConsent();
  return !!(c && c.prefs.analytics);
}

export function subscribe(fn: (record: ConsentRecord | null) => void) {
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter(s => s !== fn);
  };
}

function notify(record: ConsentRecord | null) {
  subscribers.forEach(s => {
    try { s(record); } catch {}
  });
}

// Initialize: notify current value on load
notify(getConsent());

export default {
  getConsent,
  setConsent,
  acceptAll,
  rejectAll,
  hasConsentForAnalytics,
  subscribe,
};
