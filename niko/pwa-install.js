/* ═══════════════════════════════════════════════════════════
   NikoLearn — PWA install + in-app-browser nudge  (rewritten 2026-06-26)
   PRINCIPLE: never block the first impression. The app loads and works
   immediately, even inside the Facebook/Instagram in-app browser. Any
   install / "open in browser" hint is a SOFT, dismissable bottom nudge that
   appears only AFTER the parent has seen the app (deferred), honours a
   14-day snooze, and offers detailed steps only on demand. No dead ends.

   Cases:
     1. In-app webview (FB/IG/etc) → soft nudge "open in a real browser",
        steps on demand. App stays fully usable underneath.
     2. Real Android browser → soft nudge with the native install prompt.
     3. Real iOS Safari → soft nudge → "Add to Home Screen" steps on demand.
     4. Already installed / desktop → nothing.
   Self-contained: no app dependencies, inline styles, safe on landing + app.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var UA = navigator.userAgent || '';
  var isInApp = /FBAN|FBAV|FB_IAB|FBIOS|FB4A|Instagram|Messenger|Line\/|MicroMessenger|Twitter|TikTok|Snapchat/i.test(UA);
  var isIOS = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(UA);
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  var DKEY = 'niko_pwa_dismissed';
  var REVEAL_MS = 28000; // never on arrival: let the parent see the app first
  var deferred = null;   // captured beforeinstallprompt
  var shown = false;     // nudge shown this session

  function dismissedRecently() { try { var t = +localStorage.getItem(DKEY) || 0; return (Date.now() - t) < 14 * 864e5; } catch (e) { return false; } }
  function markDismissed() { try { localStorage.setItem(DKEY, String(Date.now())); } catch (e) {} }
  function track(name) { try { if (window.Analytics && Analytics.event) Analytics.event(name, {}); } catch (e) {} }
  function el(tag, css, html) { var n = document.createElement(tag); if (css) n.style.cssText = css; if (html != null) n.innerHTML = html; return n; }
  function gone(id) { var n = document.getElementById(id); if (n) n.remove(); }
  function removeAll() { ['niko-pwa-bar', 'niko-pwa-sheet'].forEach(gone); }

  // ── styles (defined before any show, all inline so no CSS dependency) ──
  // Soft nudge: a small rounded pill anchored bottom-centre, lifted above the
  // 5-button bottom-nav so it never covers navigation. Dismissable.
  var BAR = 'position:fixed;left:12px;right:12px;bottom:calc(78px + env(safe-area-inset-bottom));z-index:2147482000;' +
    'display:flex;align-items:center;gap:10px;max-width:440px;margin:0 auto;background:#fff;color:#3a2a1a;' +
    'border-radius:16px;box-shadow:0 8px 28px rgba(60,45,15,.24);padding:11px 12px;' +
    'font-family:system-ui,-apple-system,"Segoe UI",sans-serif;animation:nikoPwaUp .28s ease-out';
  var ACT = 'border:none;border-radius:999px;background:#e8612f;color:#fff;font-weight:800;font-size:14px;padding:9px 15px;cursor:pointer;flex:0 0 auto;white-space:nowrap';
  var XBT = 'border:none;background:transparent;font-size:20px;color:#a08a66;cursor:pointer;line-height:1;padding:2px 4px;flex:0 0 auto';
  // On-demand steps sheet — the ONLY element that dims the screen, and only when the parent asks for it.
  var SHEETBACK = 'position:fixed;inset:0;z-index:2147483000;background:rgba(40,30,15,.55);display:flex;align-items:flex-end;justify-content:center;padding:0 0 14px;font-family:system-ui,-apple-system,sans-serif';
  var CARD = 'position:relative;background:#fff;border-radius:20px;box-shadow:0 12px 40px rgba(60,45,15,.28);padding:20px 18px;max-width:360px;margin:0 12px;text-align:center;color:#3a2a1a';
  var BTN = 'display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:999px;background:#e8612f;color:#fff;font-weight:800;font-size:16px;padding:13px 22px;cursor:pointer;width:100%;box-sizing:border-box;margin-top:14px';
  var XCARD = 'position:absolute;top:8px;right:12px;border:none;background:transparent;font-size:22px;color:#a08a66;cursor:pointer;line-height:1';
  var INFO = 'background:#fbf4e6;border-radius:14px;padding:12px 14px;font-size:14.5px;line-height:1.7;text-align:left;color:#4a3a26;margin-top:12px';
  (function injectKf() {
    if (document.getElementById('niko-pwa-kf')) return;
    var s = document.createElement('style'); s.id = 'niko-pwa-kf';
    s.textContent = '@keyframes nikoPwaUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}';
    (document.head || document.documentElement).appendChild(s);
  })();

  if (isStandalone) return; // installed as an app → never nudge

  // Always capture the install prompt so the nudge can use it later.
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () { track('pwa_installed'); markDismissed(); removeAll(); });

  // Reveal the soft nudge only AFTER value: a custom app signal if present, else a delay. Never on load.
  function maybeReveal() {
    if (shown || isStandalone || dismissedRecently()) return;
    if (isInApp || isIOS || deferred) showBar();
  }
  try { document.addEventListener('niko:value', maybeReveal); } catch (e) {}
  setTimeout(maybeReveal, REVEAL_MS);

  // Public manual trigger (e.g. a menu "install" item) → show steps right away (user-initiated).
  window.nikoPWA = function () { openSheet(); };

  /* ── soft bottom nudge ── */
  function showBar() {
    if (shown || document.getElementById('niko-pwa-bar')) return;
    shown = true;
    track('pwa_nudge');
    var text, actLabel;
    if (isInApp) { text = '🦉 NikoLearn უკეთ მუშაობს ბრაუზერში'; actLabel = 'როგორ?'; }
    else if (deferred) { text = '📲 დააინსტალირე NikoLearn'; actLabel = 'დაამატე'; }
    else { text = '📲 დაამატე ეკრანზე, აპივით'; actLabel = 'როგორ?'; } // iOS Safari

    var bar = el('div', BAR); bar.id = 'niko-pwa-bar';
    var label = el('div', 'flex:1;min-width:0;font-size:14px;font-weight:700;line-height:1.3', text);
    var act = el('button', ACT, actLabel);
    act.onclick = function () {
      if (deferred && !isInApp && !isIOS) { // Android real browser → native prompt
        deferred.prompt();
        deferred.userChoice.then(function (c) { track('pwa_prompt_' + (c && c.outcome || 'x')); markDismissed(); removeAll(); });
        deferred = null;
      } else {
        openSheet();
      }
    };
    var x = el('button', XBT, '&times;');
    x.onclick = function () { track('pwa_nudge_dismiss'); markDismissed(); removeAll(); };
    bar.appendChild(label); bar.appendChild(act); bar.appendChild(x);
    (document.body || document.documentElement).appendChild(bar);
  }

  /* ── on-demand steps sheet (dismissable, never auto-shown, never a dead end) ── */
  function openSheet() {
    if (document.getElementById('niko-pwa-sheet')) return;
    track('pwa_sheet');
    var back = el('div', SHEETBACK); back.id = 'niko-pwa-sheet';
    back.onclick = function (ev) { if (ev.target === back) closeSheet(); };
    var card = el('div', CARD);

    var title, body, steps, primary;
    if (isInApp) {
      title = 'გახსენი ბრაუზერში';
      body = 'NikoLearn აქ, Facebook-ის შიგნით, უკვე მუშაობს. ეკრანზე აპად რომ დააყენო, ერთხელ გახსენი ნამდვილ ბრაუზერში.';
      steps = isIOS
        ? '<b>iOS:</b> ზედა-მარჯვენა <b>aA</b> ან <b>⋯</b> ღილაკი, მერე <b>"Open in Safari"</b>.'
        : '<b>Android:</b> ზედა-მარჯვენა <b>⋮</b> ღილაკი, მერე <b>"Open in Chrome"</b>.';
    } else if (isIOS) {
      title = 'დაამატე ეკრანზე';
      body = 'ნამდვილი აპივით გაიხსნება, ბრაუზერის ზოლის გარეშე.';
      steps = '1. ქვემოთ დააჭირე <b>Share</b> <span style="display:inline-block;border:1.5px solid #4a3a26;border-radius:5px;padding:0 5px;font-weight:700">⎙</span><br>' +
        '2. აირჩიე <b>"Add to Home Screen"</b> <span style="font-weight:700">⊞</span>';
    } else {
      title = 'დააინსტალირე NikoLearn';
      body = 'ეკრანზე დაემატება, ბრაუზერის ზოლის გარეშე.';
      steps = 'ბრაუზერის მენიუში აირჩიე <b>"Install"</b> ან <b>"დაამატე ეკრანზე"</b>.';
    }

    card.innerHTML =
      '<div style="font-size:44px;line-height:1">🦉</div>' +
      '<h2 style="margin:8px 0 4px;font-size:20px;font-weight:800">' + title + '</h2>' +
      '<p style="margin:0;color:#6a5740;font-size:14.5px;line-height:1.5">' + body + '</p>' +
      '<div style="' + INFO + '">' + steps + '</div>';

    // Android in-app: a quick "open in Chrome" attempt, but always keep a way to stay.
    if (isInApp && isAndroid) {
      var chrome = el('button', BTN, '🚀 გახსენი Chrome-ში');
      chrome.onclick = function () {
        track('pwa_open_chrome');
        var url = location.href.replace(/^https?:\/\//, '');
        try { location.href = 'intent://' + url + '#Intent;scheme=https;package=com.android.chrome;end'; } catch (e) {}
      };
      card.appendChild(chrome);
    }

    // Primary "continue / got it" — closing always returns to the working app. No trap.
    primary = el('button', BTN + (isInApp && isAndroid ? ';background:#fff;color:#e8612f;border:1.5px solid #e8d6b8' : ''),
      isInApp ? 'გააგრძელე აქ' : 'გასაგებია');
    primary.onclick = function () { markDismissed(); removeAll(); }; // decision made → clear sheet AND the bar
    card.appendChild(primary);

    var x = el('button', XCARD, '&times;');
    x.onclick = function () { closeSheet(); };
    card.appendChild(x);

    back.appendChild(card);
    (document.body || document.documentElement).appendChild(back);
  }

  function closeSheet() { gone('niko-pwa-sheet'); }
})();
