/* ═══════════════════════════════════════════════════════════
   NikoLearn — PWA install + in-app-browser ESCAPE (owner 2026-06-26)
   Most FB/IG-ad traffic opens the link inside Facebook/Instagram's in-app
   webview, where "Add to Home Screen" is IMPOSSIBLE. So:
     1. If inside an in-app webview  → show an "open in real browser" escape.
     2. If a real browser on Android → custom Install button (beforeinstallprompt).
     3. If a real browser on iOS Safari → "Share → Add to Home Screen" modal.
   Self-contained: no app dependencies, inline styles, safe on landing + app pages.
   ═══════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var UA = navigator.userAgent || '';
  // In-app webviews where install never works (FB family, IG, Messenger, plus common others)
  var isInApp   = /FBAN|FBAV|FB_IAB|FBIOS|FB4A|Instagram|Messenger|Line\/|MicroMessenger|Twitter|TikTok|Snapchat/i.test(UA);
  var isIOS     = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(UA);
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  var DKEY = 'niko_pwa_dismissed';

  function dismissedRecently(){ try { var t = +localStorage.getItem(DKEY) || 0; return (Date.now() - t) < 14 * 864e5; } catch(e){ return false; } }
  function markDismissed(){ try { localStorage.setItem(DKEY, String(Date.now())); } catch(e){} }
  function track(name){ try { if (window.Analytics && Analytics.event) Analytics.event(name, {}); } catch(e){} }
  function el(tag, css, html){ var n = document.createElement(tag); if (css) n.style.cssText = css; if (html != null) n.innerHTML = html; return n; }

  // style constants — defined BEFORE any show*() call (showEscape runs synchronously for in-app webviews,
  // so these must already be assigned, not hoisted-undefined).
  var WRAP = 'position:fixed;z-index:2147483000;left:0;right:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;';
  var CARD = 'background:#fff;border-radius:20px;box-shadow:0 12px 40px rgba(60,45,15,.28);padding:20px 18px;max-width:340px;margin:0 auto;text-align:center;color:#3a2a1a;';
  var BTN  = 'display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:999px;background:#e8612f;color:#fff;font-weight:800;font-size:16px;padding:13px 22px;cursor:pointer;width:100%;box-sizing:border-box;';
  var X    = 'position:absolute;top:8px;right:12px;border:none;background:transparent;font-size:22px;color:#a08a66;cursor:pointer;line-height:1;';
  function removeUI(){ ['niko-pwa-esc','niko-pwa-and','niko-pwa-ios'].forEach(function(id){ var n=document.getElementById(id); if(n) n.remove(); }); }

  if (isStandalone) return; // already installed as an app → show nothing

  // ── 1. INSIDE FB/IG in-app webview → escape overlay (install can't work here) ──
  if (isInApp) { showEscape(); return; }

  // ── 2. REAL BROWSER ──
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferred = e;
    if (!dismissedRecently()) showAndroidInstall();
  });
  window.addEventListener('appinstalled', function(){ track('pwa_installed'); markDismissed(); removeUI(); });
  // iOS Safari: no beforeinstallprompt. Show A2HS modal once the app has settled.
  if (isIOS && !isInApp && !dismissedRecently()) { setTimeout(showIOSModal, 1800); }

  /* ── UI (style constants + removeUI defined above, before the in-app early-return) ── */
  function showEscape(){
    track('pwa_inapp_escape');
    var back = el('div', 'position:fixed;inset:0;z-index:2147483000;background:rgba(40,30,15,.86);display:flex;align-items:center;justify-content:center;padding:22px;font-family:system-ui,-apple-system,sans-serif;');
    back.id = 'niko-pwa-esc';
    var steps = isIOS
      ? '<b>iOS:</b> ზედა-მარჯვენა <b>‹›</b> ან <b>aA</b> / <b>⋯</b> ღილაკი → <b>"Open in Safari"</b>'
      : '<b>Android:</b> ზედა-მარჯვენა <b>⋮</b> ღილაკი → <b>"Open in Chrome"</b> (ან "გახსენი ბრაუზერში")';
    var card = el('div', CARD + 'max-width:360px');
    card.innerHTML =
      '<div style="font-size:46px;line-height:1">🦉</div>' +
      '<h2 style="margin:8px 0 4px;font-size:20px;font-weight:800">გახსენი ბრაუზერში</h2>' +
      '<p style="margin:0 0 14px;color:#6a5740;font-size:14.5px;line-height:1.5">NikoLearn აპად რომ დააყენო და სრულად იმუშაოს, გახსენი ნამდვილ ბრაუზერში (აქ, Facebook-ის შიგნით, ვერ მუშაობს).</p>' +
      '<div style="background:#fbf4e6;border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.6;text-align:left;color:#4a3a26">' + steps + '</div>';
    if (isAndroid) {
      var b = el('button', BTN + 'margin-top:14px', '🚀 გახსენი Chrome-ში');
      b.onclick = function(){
        var url = location.href.replace(/^https?:\/\//, '');
        // try to force-open Chrome from the in-app webview
        try { location.href = 'intent://' + url + '#Intent;scheme=https;package=com.android.chrome;end'; } catch(e){}
        // if Chrome isn't installed / intent ignored, the on-screen ⋮ instruction remains
      };
      card.appendChild(b);
    }
    back.appendChild(card);
    (document.body || document.documentElement).appendChild(back);
  }

  function showAndroidInstall(){
    if (document.getElementById('niko-pwa-and')) return;
    var bar = el('div', WRAP + 'bottom:0;padding:12px 14px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(255,243,224,0),#fff 30%);');
    bar.id = 'niko-pwa-and';
    var card = el('div', CARD + 'position:relative;display:flex;align-items:center;gap:12px;max-width:420px;text-align:left;padding:14px 16px');
    card.innerHTML =
      '<img src="icon-192.png" alt="" style="width:46px;height:46px;border-radius:12px;flex:0 0 auto">' +
      '<div style="flex:1;min-width:0"><div style="font-weight:800;font-size:15px">დააინსტალირე NikoLearn</div>' +
      '<div style="font-size:12.5px;color:#a08a66">ეკრანზე დაემატება, ბრაუზერის ზოლის გარეშე</div></div>';
    var ins = el('button', 'border:none;border-radius:999px;background:#e8612f;color:#fff;font-weight:800;font-size:14px;padding:10px 16px;cursor:pointer;flex:0 0 auto', 'დაამატე');
    ins.onclick = function(){
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function(c){ track('pwa_prompt_' + (c && c.outcome || 'x')); markDismissed(); removeUI(); });
      deferred = null;
    };
    var x = el('button', X, '&times;'); x.onclick = function(){ markDismissed(); removeUI(); };
    card.appendChild(ins); card.appendChild(x); bar.appendChild(card);
    (document.body || document.documentElement).appendChild(bar);
  }

  function showIOSModal(){
    if (document.getElementById('niko-pwa-ios') || isStandalone) return;
    track('pwa_ios_a2hs');
    var back = el('div', 'position:fixed;inset:0;z-index:2147483000;background:rgba(40,30,15,.55);display:flex;align-items:flex-end;justify-content:center;padding:0 0 14px;font-family:system-ui,-apple-system,sans-serif;');
    back.id = 'niko-pwa-ios';
    back.onclick = function(ev){ if (ev.target === back){ markDismissed(); removeUI(); } };
    var card = el('div', CARD + 'position:relative;margin:0 12px;animation:none');
    card.innerHTML =
      '<div style="font-size:42px;line-height:1">🦉</div>' +
      '<h2 style="margin:6px 0 4px;font-size:19px;font-weight:800">დააინსტალირე NikoLearn</h2>' +
      '<p style="margin:0 0 12px;color:#6a5740;font-size:14px;line-height:1.5">ეკრანზე დაემატება ნამდვილი აპივით, ბრაუზერის ზოლის გარეშე.</p>' +
      '<div style="background:#fbf4e6;border-radius:14px;padding:12px 14px;text-align:left;font-size:14.5px;line-height:1.7;color:#4a3a26">' +
        '1. ქვემოთ დააჭირე <b>Share</b> <span style="display:inline-block;border:1.5px solid #4a3a26;border-radius:5px;padding:0 5px;font-weight:700">⎙</span><br>' +
        '2. აირჩიე <b>"Add to Home Screen"</b> <span style="font-weight:700">⊞</span>' +
      '</div>';
    var ok = el('button', BTN + 'margin-top:14px', 'გასაგებია'); ok.onclick = function(){ markDismissed(); removeUI(); };
    var x = el('button', X, '&times;'); x.onclick = function(){ markDismissed(); removeUI(); };
    card.appendChild(ok); card.appendChild(x); back.appendChild(card);
    (document.body || document.documentElement).appendChild(back);
  }

  // expose a manual trigger (e.g. an "install" link can call window.nikoPWA())
  window.nikoPWA = function(){
    if (isInApp) return showEscape();
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function(c){ track('pwa_prompt_'+(c&&c.outcome||'x')); }); return; }
    if (isIOS) return showIOSModal();
  };
})();
