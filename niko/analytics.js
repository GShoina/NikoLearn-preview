/* ──────────────────────────────────────────────────────────────────────────
   analytics.js — NikoLearn's single, pluggable analytics facade.

   WHY THIS EXISTS (architecture, owner-set 2026-06-08):
   Keep ALL tracking behind one tiny interface so that — now and in production —
   an analytics or security tool can be added or removed by editing ONLY this
   file. The app never talks to a vendor directly: every screen/subject open just
   calls `Analytics.screen('...')` (and later `Analytics.event('...')`), and this
   file decides which enabled provider(s) receive it. Swapping Cloudflare for a
   custom backend, or adding a second tool, is a one-line `on:` flip here — zero
   changes in the app code.

   PRIVACY (absolute, never relaxed): only coarse screen/subject NAMES flow here.
   Never a child's name, age, answers, scores, or any PII. No cookies are set by
   this file. Local testing (localhost) is skipped so it can't pollute prod data.
   Respects the browser Do-Not-Track signal.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var DNT   = (navigator.doNotTrack == '1' || window.doNotTrack == '1' || navigator.msDoNotTrack == '1');
  var OWNER = false; try { OWNER = localStorage.getItem('niko_owner') === '1'; } catch (e) {} // owner test devices
  // testers / QA automation: append ?notrack=1 to the URL → this session is kept OUT of prod stats (data hygiene).
  var NOTRACK = /[?&]notrack=1/.test(location.search);
  if (NOTRACK) { try { localStorage.setItem('niko_owner', '1'); } catch (e) {} } // sticky: once flagged, stays excluded on this device
  var OFF   = LOCAL || DNT || OWNER || NOTRACK;

  /* ── PROVIDERS ──────────────────────────────────────────────────────────────
     Add / remove a tool here only. Flip `on` to enable or disable it.
     Each provider may implement: screen(path), event(name, data). */
  var providers = {

    // Cloudflare Web Analytics — cookieless, no PII, no IP stored.
    // screen() sets a virtual hash route (#/subject/math) on each screen change.
    // VERIFIED 2026-06-08: the FREE Web Analytics beacon does NOT ingest
    // client-side History API route changes (replaceState/pushState, hash OR
    // path OR query all produced zero new /cdn-cgi/rum hits in testing). It
    // records the initial page load only. So CF gives audience-level stats
    // (visitors, app-vs-landing, geo, device) but NOT per-screen.
    // These hash routes are therefore WIRED + READY but inert for CF today: per-
    // screen counts light up the moment an events-capable provider is enabled
    // below (a tiny custom endpoint, or a cookieless events tool). The hash is
    // harmless — reload-safe on GitHub Pages, Back button never polluted
    // (replaceState) — and hands any future SPA-aware provider the route for free.
    cloudflare: {
      // LAUNCH DECISION (owner, 2026-06-08): the facade + per-screen hooks STAY in the code, but
      // the facade is DORMANT for the prod launch (~1 week out) — provider OFF, so Analytics.screen()
      // is a pure no-op and the app's URL never changes. Audience stats keep flowing via the
      // standalone Cloudflare Web Analytics beacon tag in index.html / landing.html (that beacon is
      // NOT this facade). Per-screen is a POST-LAUNCH decision, taken only if a real product question
      // needs it; if enabled then: default = first-party backend; if 3rd-party, Plausible or
      // GoatCounter, never PostHog.
      on: false,
      screen: function (path) {
        try {
          history.replaceState(history.state, '', location.pathname + location.search + '#/' + path);
        } catch (e) {}
      },
      event: function () { /* CF Web Analytics free has no custom-events API */ }
    },

    // First-party telemetry Worker (privacy-minimized, aggregate-only) — deployed 2026-06-09.
    // Receives ONLY a coarse subject/screen mapped to an allow-listed enum event; no PII, no cookies,
    // no IP (the Worker never reads the IP — see cloudflare/telemetry-worker.js). The send() is fully
    // try/caught + fire-and-forget: if the Worker is unreachable the app is completely unaffected.
    custom: {
      on: true,
      screen: function (path) {
        var mode = mapMode(path);
        if (mode) { _lessons++; send({ name: 'mode_usage', mode: mode }); }
      },
      event: function (name, data) {
        // app sends only allow-listed events (profile_created / topic_usage / session_length);
        // the Worker re-validates against its allow-list and drops anything unexpected.
        var ev = { name: name };
        if (data) for (var k in data) ev[k] = data[k];
        send(ev);
      }
    }
  };

  // map the app's screen path → the Worker's mode_usage enum (anything unmapped is NOT sent)
  var ENDPOINT = 'https://nikolearn-t.bivision.workers.dev/v1/t';
  function mapMode(path) {
    if (path === 'movement') return 'movement';
    if (path.indexOf('subject/') === 0) {
      var M = { math: 'math', counting: 'counting', english: 'english',
        'en-alpha': 'alphabet', 'ka-alpha': 'alphabet',
        'kings-eng': 'kings', 'kings-math': 'kings', reading: 'reading' };
      return M[path.slice(8)] || null;
    }
    return null; // 'home' etc. → not a lesson, not sent
  }
  function send(ev) {
    var body = JSON.stringify({ events: [ev] });
    try { if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body)) return; } catch (e) {}
    try { fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true, mode: 'no-cors' }); } catch (e) {}
  }

  // ── session activity = privacy-safe ENGAGEMENT proxy (sessions/day, lessons/session, minutes).
  //    This is NOT unique-user retention — that needs a persistent identifier = child PII, which we
  //    never set. We fire ONE aggregate session_length on the way out (or first tab-hide).
  var _t0 = Date.now(), _lessons = 0, _sessSent = false;
  function flushSession() {
    if (_sessSent) return; _sessSent = true;
    var secs = Math.round((Date.now() - _t0) / 1000);
    if (secs < 3) return; // ignore instant bounces
    if (window.Analytics) Analytics.event('session_length', { seconds: secs, lessons: _lessons });
  }
  try {
    window.addEventListener('pagehide', flushSession);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flushSession(); });
  } catch (e) {}

  // ── anonymous TRAFFIC beacon (owner 2026-06-22): one page_view per load with a COARSE referrer
  //    BUCKET (fixed enum, never the URL) + which page. Gives first-party visit + source counts so we
  //    no longer depend on the Cloudflare dashboard. Privacy identical to the rest of this facade:
  //    no URL, no PII, no cookie; localhost + DNT + owner-device are all skipped via fanout().
  function refBucket() {
    try {
      var r = (document.referrer || '').toLowerCase();
      if (!r) return 'direct';
      var h = new URL(r).hostname.replace(/^www\./, '');
      if (location.hostname && h.indexOf(location.hostname) >= 0) return 'internal';
      if (/facebook|fbclid|fb\.com|m\.facebook/.test(r)) return 'facebook';
      if (/instagram/.test(r)) return 'instagram';
      if (/youtube|youtu\.be/.test(r)) return 'youtube';
      if (/t\.me|telegram/.test(r)) return 'telegram';
      if (/google\./.test(h)) return 'google';
      if (/bing|duckduckgo|yandex/.test(h)) return 'search';
      return 'other';
    } catch (e) { return 'other'; }
  }
  function pageBucket() { try { return /landing/.test(location.pathname) ? 'landing' : 'app'; } catch (e) { return 'app'; } }
  try {
    setTimeout(function () { try { if (window.Analytics) Analytics.event('page_view', { ref: refBucket(), page: pageBucket() }); } catch (e) {} }, 300);
  } catch (e) {}

  function fanout(method, a, b) {
    if (OFF) return;
    // owner's own device (set in the PIN-gated parent space): skip telemetry so real-user
    // launch stats stay clean. Honest LOCAL marker, not security; checked live so a toggle applies at once.
    try { if (localStorage.getItem('niko_owner') === '1') return; } catch (e) {}
    for (var key in providers) {
      var p = providers[key];
      if (p && p.on && typeof p[method] === 'function') {
        try { p[method](a, b); } catch (e) {}
      }
    }
  }

  // Public API. `screen` names are sanitised to a safe url-ish token set.
  window.Analytics = {
    screen: function (name) {
      fanout('screen', String(name == null ? '' : name).replace(/[^a-z0-9/_-]/gi, '').slice(0, 60));
    },
    event: function (name, data) {
      fanout('event', String(name == null ? '' : name).slice(0, 60), data);
    },
    // exposed so a future admin/debug view (or a test) can read the wiring
    _providers: providers,
    _enabled: !OFF
  };
})();
