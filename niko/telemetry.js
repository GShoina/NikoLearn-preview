/* ═══════════════════════════════════════════════════════════
   NikoLearn — privacy-first anonymous telemetry (client helper)
   INERT until BOTH are true: (1) NIKO_T_ENDPOINT is set, (2) the parental gate accepted.
   No PII. No cookies. No persistent id. A 24h session salt lives ONLY in sessionStorage
   (same-day functional dedup; cannot link a child across days). First-party only.
   Loads safely even when off — does nothing until enabled.
   ═══════════════════════════════════════════════════════════ */
(function () {
  // Set this to the deployed Cloudflare Worker URL to turn telemetry ON (e.g.
  // 'https://nikolearn-t.<account>.workers.dev/v1/t'). Empty = OFF (no requests at all).
  const NIKO_T_ENDPOINT = '';

  const CONSENT_KEY = 'niko_t_ok';   // sessionStorage only — courtesy parental opt-in for the session
  const SALT_KEY = 'niko_t_salt';    // 24h rotating salt, sessionStorage only

  function enabled() {
    if (!NIKO_T_ENDPOINT) return false;
    try { return sessionStorage.getItem(CONSENT_KEY) === '1'; } catch (e) { return false; }
  }
  // mark the courtesy gate accepted/declined for THIS session (not the legal basis — see manifest)
  window.nikoTelemetryConsent = function (ok) {
    try { sessionStorage.setItem(CONSENT_KEY, ok ? '1' : '0'); } catch (e) {}
    if (ok) flush();
  };

  function salt() { // date + random, rotates daily; sessionStorage only → no cross-day linkage
    try {
      const today = new Date().toISOString().slice(0, 10);
      let s = sessionStorage.getItem(SALT_KEY);
      if (!s || s.indexOf(today) !== 0) {
        s = today + ':' + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(SALT_KEY, s);
      }
      return s;
    } catch (e) { return ''; }
  }

  function coarseAspect() {
    const r = (screen.width || 1) / (screen.height || 1);
    return r > 1.25 ? 'wide' : r < 0.8 ? 'tall' : 'square';
  }

  // allow-list mirrors the Worker — we never send free text, names, answers, or an age+identity row
  const ALLOW = {
    profile_created: ['age_band'],
    lesson_started: ['mode'],
    lesson_completed: ['mode', 'time_to_success_ms'],
    same_day_return: [],
    drop_off: ['screen', 'mode'],
    difficulty: ['mode', 'retries', 'errors', 'time_to_success_ms'],
    interaction_latency: ['ms'],
    session_length: ['seconds', 'lessons'],
    mode_usage: ['mode'],
    audio_usage: ['used'],
    device_context: ['deviceType', 'os', 'aspect'],
  };

  let queue = [];
  // record an anonymous, aggregate event. Unknown name / extra keys are dropped silently.
  window.nikoT = function (name, props) {
    if (!ALLOW[name]) return;
    const clean = { name };
    (props || {}) && ALLOW[name].forEach(k => { if (props && props[k] != null) clean[k] = props[k]; });
    salt(); // ensure a same-day salt exists (used only client-side for dedup, never sent)
    queue.push(clean);
    if (enabled()) flush();
  };

  function flush() {
    if (!enabled() || !queue.length) return;
    const events = queue.splice(0, 25);
    try {
      fetch(NIKO_T_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true,
        // no credentials, no cookies
        credentials: 'omit',
      }).catch(() => {});
    } catch (e) {}
  }

  // emit device_context once per session when enabled
  window.addEventListener('load', function () {
    if (enabled()) {
      const ua = navigator.userAgent.toLowerCase();
      const deviceType = /ipad|tablet/.test(ua) ? 'tablet' : /mobile|iphone|android/.test(ua) ? 'phone' : 'desktop';
      const os = /iphone|ipad|ipod/.test(ua) ? 'ios' : /android/.test(ua) ? 'android' : /windows/.test(ua) ? 'windows' : /mac os/.test(ua) ? 'mac' : 'other';
      window.nikoT('device_context', { deviceType, os, aspect: coarseAspect() });
    }
  });
})();
