// Audio layer: recorded clips override TTS, offline, on every device. HANDOFF §5a.
// Drop ka-GE clips here as  'lowercased text': 'niko/audio/file.mp3'  and they instantly win over TTS.
const AUDIO_MANIFEST = {
  // 'ერთი': 'niko/audio/ka-1.mp3',
  // 'ყოჩაღ!': 'niko/audio/ka-praise-1.mp3',
};
function hasClip(t){ return !!AUDIO_MANIFEST[String(t).toLowerCase()]; }
function playClip(t){
  const f = AUDIO_MANIFEST[String(t).toLowerCase()];
  if(!f) return false;
  try { new Audio(f).play().catch(()=>{}); } catch(e){ return false; }
  return true;
}
window.playClip = playClip;
window.hasClip = hasClip;
