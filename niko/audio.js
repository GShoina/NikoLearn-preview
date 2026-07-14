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
  // ONE reused <audio> element for every recorded clip. iOS Safari stops playing after ~5 rapidly
  // CREATED Audio elements (decode cap), which silenced the count-along past 5 (owner 2026-07-05 live
  // test). Reusing a single element and swapping .src sidesteps that cap entirely.
  let curClip = null;
  function getPlayer(){ if(!curClip){ curClip = new Audio(); curClip.volume = 0.85; } return curClip; }
  // NB-20 (2026-07-09): first-gesture AUDIO UNLOCK. Desktop Chrome / iOS block HTMLAudio.play()
  // until a user gesture. The app auto-voices on some screen loads (e.g. a Movement break that
  // opens on its own, prompts, greetings) where the play() is NOT inside a tap handler → silent.
  // On the FIRST real gesture we play a genuinely SILENT asset to unlock, then restore state.
  // NB-49 (2026-07-15): the old unlock played a REAL voice clip ("მოძრაობა" = clip_294) at
  // a.volume=0. iOS Safari IGNORES programmatic .volume (read-only there), so on a phone the very
  // first tap on the profile chooser played „მოძრაობა" ALOUD. Fix = unlock with an all-zero-PCM
  // silent WAV (+ muted) so it is inaudible on EVERY platform, not only where volume is honoured.
  const SILENT_SRC = (function(){
    try{
      const sr=8000, n=160, dl=n*2, b=new Uint8Array(44+dl), dv=new DataView(b.buffer);
      const ws=(o,s)=>{ for(let i=0;i<s.length;i++) b[o+i]=s.charCodeAt(i); };
      ws(0,'RIFF'); dv.setUint32(4,36+dl,true); ws(8,'WAVE'); ws(12,'fmt ');
      dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,1,true);
      dv.setUint32(24,sr,true); dv.setUint32(28,sr*2,true); dv.setUint16(32,2,true); dv.setUint16(34,16,true);
      ws(36,'data'); dv.setUint32(40,dl,true);
      let bin=''; for(let i=0;i<b.length;i++) bin+=String.fromCharCode(b[i]);
      return 'data:audio/wav;base64,'+btoa(bin);
    }catch(e){ return ''; }
  })();
  let _unlocked = false;
  function _primeAudio(){
    if(_unlocked) return; _unlocked = true;
    try{
      const a = getPlayer(); const v = a.volume, m = a.muted;
      a.muted = true; a.volume = 0; if(SILENT_SRC) a.src = SILENT_SRC;
      const restore = ()=>{ try{a.pause();a.currentTime=0;}catch(e){} a.muted = m; a.volume = v||0.85; };
      const p = a.play();
      if(p && p.then) p.then(restore).catch(restore);
      else restore();
    }catch(e){}
    document.removeEventListener('pointerdown', _primeAudio, true);
    document.removeEventListener('touchend', _primeAudio, true);
    document.removeEventListener('click', _primeAudio, true);
  }
  document.addEventListener('pointerdown', _primeAudio, true);
  document.addEventListener('touchend', _primeAudio, true);
  document.addEventListener('click', _primeAudio, true);
  function playClipUrl(url, onended, onfail){
    const a = getPlayer();
    try{ a.pause(); }catch(e){}
    a.onended = onended || null; a.onerror = onfail || null;
    try{ a.src = url; a.currentTime = 0; }catch(e){}
    a.play().catch(()=>{ if(onfail) onfail(); });
    return a;
  }

  function clipFor(text){
    const k = (text||'').trim().toLowerCase();
    return AUDIO_MANIFEST[k] ? (BASE + AUDIO_MANIFEST[k]) : null;
  }
  // play the recorded clip for a piece of text and call onended when it FINISHES (returns false if there
  // is no clip so the caller can fall back). Lets count-along advance only after each number has fully
  // played, instead of a fixed gap that cut the final syllable ("სამი" -> "სამ"). Owner 2026-07-05.
  window.playClipFor = function(text, onended){
    const url = clipFor(text);
    if(!url) return false;
    playClipUrl(url, onended || null);
    return true;
  };
  function stopClip(){ if(curClip){ try{curClip.pause();}catch(e){} curClip.onended=null; } }
  // expose a global hard-stop so navigation can kill any in-flight clip/sequence (fixes cross-screen
  // audio bleed, e.g. a "ყველი" spell-clip continuing onto the next ჩ/ზ screen). Parent-reported 2026-06-28.
  window.stopAudio = function(){ stopClip(); try{ if('speechSynthesis'in window) speechSynthesis.cancel(); }catch(e){} };

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
    if(url){ playClipUrl(url); return; }
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
        try{ playClipUrl(url, next, ()=> tts(p)); }
        catch(e){ tts(p); }
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
      curClip = a; try{ a.volume = 0.85; }catch(e){} // softened 2026-06-22
      a.onerror = ()=>{ if(curClip===a){ curClip=null; clipFallback(text); } }; // real 404 fallback
      a.play().catch(()=>{ if(curClip===a){ curClip=null; clipFallback(text); } });
    }catch(e){ clipFallback(text); return false; }
    return true;
  };
  // ── play a recorded clip and call cb when it ENDS ── (for synced syllable highlighting in reading)
  // Optional rate = playbackRate (e.g. 0.82 to sound a syllable out slower). No clip → ka TTS with an
  // onend if the device has a Georgian voice, else a short timeout so the highlight chain still advances.
  window.playClipThen = function(text, cb, rate){
    let done = ()=>{ if(cb){ const f=cb; cb=null; f(); } };
    const url = clipFor(text);
    if(!url){
      try{
        if('speechSynthesis' in window && window.hasVoiceFor && window.hasVoiceFor('ka')){
          const u = new SpeechSynthesisUtterance(text); u.lang='ka-GE'; if(rate) u.rate = rate;
          u.onend = done; u.onerror = done; speechSynthesis.speak(u); return;
        }
      }catch(e){}
      setTimeout(done, 360); return;
    }
    stopClip();
    try{
      const a = new Audio(url); curClip = a; a.volume = 0.85; a.playbackRate = rate || 1; // fresh Audio: never mutate the shared preload element's rate; 0.85 = softened kid loudness (audit LOW)
      a.onended = done; a.onerror = done;
      a.play().catch(done);
    }catch(e){ done(); }
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
        curClip = a; a.volume = 0.85; a.onended = next; a.play().catch(()=>{});
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
