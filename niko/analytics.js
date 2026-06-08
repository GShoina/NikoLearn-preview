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
    // It auto-tracks single-page navigations through the History API, so a
    // screen change updates a virtual hash route (#/subject/math) and Cloudflare
    // logs it as a navigation. Hash is used (not a real path) so a page reload is
    // still safe on GitHub Pages and the browser Back button is never polluted.
    // Note: CF's free tier has no custom-events API, so event() is a no-op here;
    // events light up automatically once an events-capable provider is enabled.
    cloudflare: {
      on: true,
      screen: function (path) {
        try {
          history.replaceState(history.state, '', location.pathname + location.search + '#/' + path);
        } catch (e) {}
      },
      event: function () { /* not supported on CF Web Analytics free */ }
    }

    // ── Future provider example (kept off; enable in production) ───────────────
    // custom: {
    //   on: false,
    //   screen: function (path)      { send({ t: 'screen', p: path }); },
    //   event:  function (name, data){ send({ t: 'event', n: name, d: data }); }
    // }
    // function send(payload){ try{ navigator.sendBeacon('/__t', JSON.stringify(payload)); }catch(e){} }
  };

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
