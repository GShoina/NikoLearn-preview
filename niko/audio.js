/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — audio layer
   • Recorded-clip manifest (Georgian voice, dropped in later)
   • Browser-TTS fallback where the device has the voice
   • Duplicate-guard: kills the "sound repeats / double-speaks" bug
   Load AFTER core.js (it wraps speakOne).
   ═══════════════════════════════════════════════════════════ */
(function(){
  // key (lowercased text) → recorded file under niko/audio/.
  // Empty for now: drop ka clips here and they instantly take over from TTS.
  window.AUDIO_MANIFEST = window.AUDIO_MANIFEST || {};
  const BASE = 'niko/audio/';
  let curClip = null;

  function clipFor(text){
    const k = (text||'').trim().toLowerCase();
    return AUDIO_MANIFEST[k] ? (BASE + AUDIO_MANIFEST[k]) : null;
  }
  function stopClip(){ if(curClip){ try{curClip.pause();}catch(e){} curClip=null; } }

  // ── duplicate guard ── ignore an identical utterance fired within the window
  let last = {key:'', t:0};
  const GUARD_MS = 500;

  const _speakOne = window.speakOne;
  window.speakOne = function(t, lang, opts){
    if(!t) return;
    const key = lang + '|' + t;
    const now = Date.now();
    if(key === last.key && now - last.t < GUARD_MS) return; // swallow accidental repeat
    last = {key, t:now};
    // prefer a recorded clip when one exists for this exact text
    const url = clipFor(t);
    if(url){
      stopClip();
      try{ curClip = new Audio(url); curClip.play().catch(()=>{}); return; }catch(e){}
    }
    if(_speakOne) _speakOne(t, lang, opts);
  };

  // make sure cancel() also stops any recorded clip
  const _speak = window.speak;
  window.speak = function(t, lang, opts){ stopClip(); if(_speak) _speak(t, lang, opts); };

  // ── chained speakSeq: each part waits for the PREVIOUS to finish ('ended'), so a Georgian clip
  // then an English word play in order instead of all-at-once. Prefers a recorded clip per part;
  // for TTS it applies the central ka-gate (no real ka voice → skip that part silently, no garble).
  window.speakSeq = function(parts){
    stopClip();
    try{ if('speechSynthesis'in window) speechSynthesis.cancel(); }catch(e){}
    const list = (parts||[]).filter(p=>p&&p.t);
    let i = 0;
    const next = ()=>{
      if(i>=list.length){ curClip=null; return; }
      const p = list[i++];
      const url = clipFor(p.t);
      if(url){
        try{
          const a = new Audio(url); curClip = a;
          a.onended = next;
          a.onerror = ()=> tts(p);
          a.play().catch(()=> tts(p));
        }catch(e){ tts(p); }
      } else { tts(p); }
    };
    const tts = (p)=>{
      const lang = p.lang || 'en-US';
      // ka-gate: no clip + no device ka voice → skip silently and move on
      if(lang.slice(0,2)==='ka' && (typeof window.hasVoiceFor!=='function' || !window.hasVoiceFor('ka'))) return next();
      if(!('speechSynthesis'in window)) return next();
      try{
        const u = new SpeechSynthesisUtterance(p.t);
        u.lang = lang; if(p.rate!=null) u.rate = p.rate;
        const v = (typeof pickVoice==='function') ? pickVoice(lang) : null; if(v) u.voice = v;
        u.onend = next; u.onerror = ()=>next();
        speechSynthesis.speak(u);
      }catch(e){ next(); }
    };
    next();
  };

  // ── instant clip playback for DELIBERATE taps (syllable chips, letters) ──
  // No 500ms duplicate-guard (a tap must ALWAYS sound, even the same syllable twice, e.g. მა-მა),
  // no speechSynthesis dependency, and it stops the current clip + plays immediately so rapid taps
  // keep pace with the child instead of lagging. Returns true if a recorded clip exists.
  const _pre = {};
  // fall back to RAW TTS (not the clip-aware wrapper, which would just retry the broken clip) when a
  // clip is mapped but the FILE is missing/404s. ka with no device voice → core speakOne stays silent.
  function clipFallback(text){
    try{ if(_speakOne) _speakOne(text, 'ka-GE'); }catch(e){}
  }
  window.playClip = function(text){
    const url = clipFor(text);
    if(!url) return false;
    stopClip();
    try{
      let a = _pre[url];
      if(a){ try{ a.currentTime = 0; }catch(e){} } else { a = new Audio(url); }
      curClip = a;
      a.onerror = ()=>{ if(curClip===a){ curClip=null; clipFallback(text); } }; // real 404 fallback
      a.play().catch(()=>{ if(curClip===a){ curClip=null; clipFallback(text); } });
    }catch(e){ clipFallback(text); return false; }
    return true;
  };
  // warm the cache so the FIRST tap of each clip is instant (no load lag = the "slow" feel)
  window.preloadClips = function(texts){
    (texts||[]).forEach(t=>{ const u = clipFor(t); if(u && !_pre[u]){ try{ const a = new Audio(); a.preload = 'auto'; a.src = u; _pre[u] = a; }catch(e){} } });
  };

  // ── play several recorded clips back-to-back (each waits for the previous to END) ──
  // Used by container-card nav voicing ("მათემატიკა" → "აირჩიე"). A later speak()/playClip()
  // pauses curClip, which never fires 'ended', so an interrupted chain stops cleanly.
  window.playClipSeq = function(texts){
    const urls = (texts||[]).map(t=>clipFor(t)).filter(Boolean);
    if(!urls.length) return false;
    stopClip();
    let i = 0;
    const next = ()=>{
      if(i>=urls.length){ curClip=null; return; }
      try{
        const a = new Audio(urls[i++]);
        curClip = a; a.onended = next; a.play().catch(()=>{});
      }catch(e){}
    };
    next();
    return true;
  };

  // does the device actually have a voice for this language? (UI can gray out audio if not)
  window.hasVoiceFor = function(lang){
    if(!('speechSynthesis' in window)) return false;
    const vs = speechSynthesis.getVoices();
    return vs.some(v => v.lang && v.lang.toLowerCase().startsWith((lang||'').slice(0,2)));
  };
})();
