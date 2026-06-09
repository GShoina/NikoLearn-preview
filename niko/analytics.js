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
  var OFF   = LOCAL || DNT;

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
        if (mode) send({ name: 'mode_usage', mode: mode });
      },
      event: function () { /* reserved: only allow-listed events; none wired yet */ }
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

  function fanout(method, a, b) {
    if (OFF) return;
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
