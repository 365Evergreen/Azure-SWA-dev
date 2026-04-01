let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  // Placeholder: initialize analytics providers here (e.g. Google Analytics)
  // Keep lightweight: only set up a dataLayer stub and log for now.
  try {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: 'analytics_initialized', timestamp: Date.now() });
    console.log('Analytics initialized');
  } catch (e) {
    // ignore
  }
}

export function teardownAnalytics() {
  if (!initialized) return;
  initialized = false;
  try {
    // Best-effort: clear dataLayer
    delete (window as any).dataLayer;
    console.log('Analytics torn down');
  } catch {}
}

export default { initAnalytics, teardownAnalytics };
