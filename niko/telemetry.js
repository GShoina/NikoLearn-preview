/* ═══════════════════════════════════════════════════════════
   NikoLearn — privacy-minimized telemetry, aggregated before storage (client helper)
   INERT until BOTH are true: (1) NIKO_T_ENDPOINT is set, (2) the parental gate accepted.
   No PII. No cookies. No cross-session identifier of any kind. No salt, no fingerprint.
   The ONLY persistent local state is a boolean `niko_t_opt_in` that remembers the parental
   gate choice (GPT review pt.5) — it never holds/generates an id and is NEVER transmitted.
   First-party only. Loads safely even when off — does nothing until enabled.
   ═══════════════════════════════════════════════════════════ */
(function () {
  // Set this to the deployed Cloudflare Worker URL to turn telemetry ON (e.g.
  // 'https://nikolearn-t.<account>.workers.dev/v1/t'). Empty = OFF (no requests at all).
  const NIKO_T_ENDPOINT = '';

  // persistent boolean ONLY — remembers the parental courtesy-gate choice across sessions.
  // pure '1'/'0'. never an identifier. never sent on the wire. (GPT review pt.5)
  const OPTIN_KEY = 'niko_t_opt_in';

  function enabled() {
    if (!NIKO_T_ENDPOINT) return false;
    try { return localStorage.getItem(OPTIN_KEY) === '1'; } catch (e) { return false; }
  }
  // mark the courtesy gate accepted/declined (persisted so parents aren't re-asked every visit).
  // this is a UX control, NOT the legal basis — see the data manifest / DEPLOY.md.
  window.nikoTelemetryConsent = function (ok) {
    try { localStorage.setItem(OPTIN_KEY, ok ? '1' : '0'); } catch (e) {}
    if (ok) flush();
  };

  function coarseAspect() {
    const r = (screen.width || 1) / (screen.height || 1);
    return r > 1.25 ? 'wide' : r < 0.8 ? 'tall' : 'square';
  }

  // allow-list mirrors the Worker EXACTLY — we never send free text, names, answers, or any
  // identity/return row. `same_day_return` was removed (GPT review pt.1): aggregate-daily only.
  const ALLOW = {
    profile_created: ['age_band'],
    lesson_started: ['mode'],
    lesson_completed: ['mode', 'time_to_success_ms'],
    drop_off: ['screen', 'mode'],
    difficulty: ['mode', 'retries', 'errors', 'time_to_success_ms'],
    interaction_latency: ['ms'],
    session_length: ['seconds', 'lessons'],
    mode_usage: ['mode'],
    audio_usage: ['used'],
    device_context: ['deviceType', 'os', 'aspect'],
  };

  let queue = [];
  // record one aggregate event. Unknown name / extra keys are dropped silently.
  window.nikoT = function (name, props) {
    if (!ALLOW[name]) return;
    const clean = { name };
    (props || {}) && ALLOW[name].forEach(k => { if (props && props[k] != null) clean[k] = props[k]; });
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
        // no credentials, no cookies — nothing that could carry an identifier
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
