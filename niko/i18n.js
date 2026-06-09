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
      var en=toEn(v);
      if(en!==v){ if(node.__ka==null)node.__ka=v; node.nodeValue=en; }
    });
    ['placeholder','aria-label','title'].forEach(function(attr){
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
    ['placeholder','aria-label','title'].forEach(function(attr){
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
    b.textContent=(window.UILANG==='en')?'ქარ':'EN';
    b.setAttribute('aria-label',(window.UILANG==='en')?'Switch to Georgian':'Switch to English');
  }
  function mountToggle(){
    if(document.getElementById('langtgl'))return;
    var host=document.querySelector('.nav .wrap')||document.querySelector('.device')||document.body;
    var b=document.createElement('button');
    b.id='langtgl'; b.type='button';
    var onNav=!!document.querySelector('.nav .wrap');
    b.style.cssText=onNav
      ? 'margin-left:10px;border:1.5px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:6px 12px;font:600 .82rem/1 inherit;cursor:pointer;opacity:.85'
      : 'position:absolute;top:8px;right:8px;z-index:60;border:none;background:rgba(0,0,0,.16);color:#fff;border-radius:999px;padding:5px 11px;font:700 .76rem/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)';
    b.onclick=function(){ switchLang(window.UILANG==='en'?'ka':'en'); };
    host.appendChild(b);
    updateToggle();
  }

  function boot(){
    mountToggle();
    if(window.UILANG==='en')applyLang(document.body);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
