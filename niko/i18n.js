/* ═══════════════════════════════════════════════════════════
   NikoLearn, i18n — ENGINE (render-time ka→en translation)
   Georgian (ka) is the source/default. English (en) is layered on
   at render time by translating text nodes + a few attributes.
   The string tables are DATA and live in two files that load BEFORE
   this one: i18n-strings.js (app, window.I18N_MAP + I18N_PATTERNS)
   and i18n-landing.js (landing, window.I18N_LANDING). Anything not
   in the tables stays Georgian (safe fallback), so the app can never
   break on a missing string. Shared by index.html AND landing.html.
   ═══════════════════════════════════════════════════════════ */
(function(){
  var KEY='niko_uilang';
  var L; try{L=localStorage.getItem(KEY)||'ka';}catch(e){L='ka';}
  if(L!=='en')L='ka';
  window.UILANG=L;
  try{document.documentElement.lang=L;}catch(e){}

  function persist(){try{localStorage.setItem(KEY,window.UILANG);}catch(e){}}

  /* string tables from i18n-strings.js + i18n-landing.js (defensive defaults
     keep the app working even if a data file fails to load: stays Georgian). */
  var MAP=window.I18N_MAP||{};
  var LANDING=window.I18N_LANDING||{};
  var PATTERNS=window.I18N_PATTERNS||[];
  for(var k in LANDING){ if(!(k in MAP)) MAP[k]=LANDING[k]; }  /* app strings win on a key clash */

  function toEn(raw){
    if(raw==null) return raw;
    var s=String(raw);
    var lead=(s.match(/^\s*/)||[''])[0], trail=(s.match(/\s*$/)||[''])[0];
    var core=s.trim().replace(/\s+/g,' ');
    if(core==='') return raw;
    if(MAP[core]!=null) return lead+MAP[core]+trail;
    for(var i=0;i<PATTERNS.length;i++){ var m=core.match(PATTERNS[i][0]); if(m) return lead+PATTERNS[i][1](m)+trail; }
    return raw; // fallback: keep Georgian
  }
  window.t_en=toEn;
  /* code-side helper: translate a Georgian string at BUILD time when UI is English
     (for text that can't be reached by the DOM walker: native dialogs, joined tokens). */
  window.tx=function(s){ return (window.UILANG==='en')?toEn(s):s; };

  /* ── apply / restore across a DOM subtree ── */
  function walkText(root,fn){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    var n,arr=[]; while((n=w.nextNode()))arr.push(n);
    arr.forEach(fn);
  }
  function applyLang(root){
    if(window.UILANG!=='en')return;
    root=root||document.body; if(!root)return;
    walkText(root,function(node){
      var v=node.nodeValue; if(!v||!v.trim())return;
      /* CM-2: honour an opt-out marker so a native autonym ("ქართული") in the language picker
         is never translated to "Georgian" (owner-locked: the autonym must stay native). */
      try{ var p=node.parentNode; if(p&&p.nodeType===1&&p.closest('[data-noi18n]'))return; }catch(e){}
      var en=toEn(v);
      if(en!==v){ if(node.__ka==null)node.__ka=v; node.nodeValue=en; }
    });
    ['placeholder','aria-label','title','data-sum'].forEach(function(attr){
      root.querySelectorAll('['+attr+']').forEach(function(el){
        var v=el.getAttribute(attr); if(!v||!v.trim())return;
        var en=toEn(v);
        if(en!==v){ if(el.getAttribute('data-ka-'+attr)==null)el.setAttribute('data-ka-'+attr,v); el.setAttribute(attr,en); }
      });
    });
  }
  function restoreKa(root){
    root=root||document.body; if(!root)return;
    walkText(root,function(node){ if(node.__ka!=null){node.nodeValue=node.__ka;node.__ka=null;} });
    ['placeholder','aria-label','title','data-sum'].forEach(function(attr){
      root.querySelectorAll('[data-ka-'+attr+']').forEach(function(el){
        el.setAttribute(attr,el.getAttribute('data-ka-'+attr)); el.removeAttribute('data-ka-'+attr);
      });
    });
  }
  window.applyLang=applyLang;
  window.restoreKa=restoreKa;

  function switchLang(l){
    l=(l==='en')?'en':'ka';
    if(l===window.UILANG){return;}
    window.UILANG=l; persist();
    try{document.documentElement.lang=l;}catch(e){}
    if(l==='en')applyLang(document.body); else restoreKa(document.body);
    updateToggle();
    try{window.dispatchEvent(new Event('niko-lang-change'));}catch(e){}
  }
  window.setUILang=switchLang;

  /* ── floating language toggle (one button, all screens) ── */
  function updateToggle(){
    var b=document.getElementById('langtgl'); if(!b)return;
    var isEn=(window.UILANG==='en');
    b.textContent=isEn?'ქარ':'EN';
    // aria-pressed + a state-aware label so a screen-reader user knows the CURRENT language, not just the action
    b.setAttribute('aria-pressed',isEn?'true':'false');
    b.setAttribute('aria-label',isEn?'English is active. Switch to Georgian':'Georgian is active. Switch to English');
  }
  // Language toggle scope (owner 2026-06-23): the EN/ქარ toggle now lives ONLY on the marketing LANDING
  // page (.nav .wrap host), where an English-speaking / diaspora visitor benefits from an English read of
  // the offer — and that page's strings have full en coverage, so it never half-translates. It is
  // intentionally NOT mounted inside the kids APP: the app teaches English through CONTENT, the chrome
  // stays Georgian for the Georgian child/parent, and the app's growing content lacked en mappings so the
  // toggle produced a confusing half-Georgian/half-English UI. Removing it there kills that bug + confusion.
  function mountToggle(){
    if(document.getElementById('langtgl'))return;
    var navWrap=document.querySelector('.nav .wrap');
    if(!navWrap)return;                  // app (no landing nav) → no toggle, UI stays Georgian
    var b=document.createElement('button');
    b.id='langtgl'; b.type='button';
    b.onclick=function(){ switchLang(window.UILANG==='en'?'ka':'en'); };
    b.style.cssText='margin-left:10px;border:1.5px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:6px 12px;font:600 .82rem/1 inherit;cursor:pointer;opacity:.85';
    navWrap.appendChild(b);
    updateToggle();
  }

  function boot(){
    var onLanding=!!document.querySelector('.nav .wrap');
    // App now RESPECTS the persisted UI language (parent switches EN/ka in the parent space — Tier-1 EN
    // coverage, owner 2026-06-25). No force-Georgian. mountToggle still mounts only on the landing nav.
    mountToggle();
    if(window.UILANG==='en')applyLang(document.body);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
