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
  const _speakSeq = window.speakSeq;
  window.speakSeq = function(parts){ stopClip(); if(_speakSeq) _speakSeq(parts); };

  // does the device actually have a voice for this language? (UI can gray out audio if not)
  window.hasVoiceFor = function(lang){
    if(!('speechSynthesis' in window)) return false;
    const vs = speechSynthesis.getVoices();
    return vs.some(v => v.lang && v.lang.toLowerCase().startsWith((lang||'').slice(0,2)));
  };
})();
