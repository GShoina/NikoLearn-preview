/* ════════════════════════════════════════════════════════════════════════
   NikoLearn — GEORGIAN VOICE COVERAGE AUDIT
   ────────────────────────────────────────────────────────────────────────
   WHY: the app cannot do runtime Georgian TTS (no reliable on-device ka voice),
   so every Georgian string the child HEARS must have a pre-recorded clip in
   AUDIO_MANIFEST (edge-tts ka-GE-EkaNeural). A new ka string with no clip = the
   app goes SILENT there. This audit lists every VOICED ka string that has no clip.

   IMPORTANT — only flags content that is actually VOICED. By design NOT voiced
   (so excluded): alphabet letters spoken alone (the sound lives in the example
   WORD, which is voiced) and Talk sub-prompts (text-only follow-ups).

   HOW TO RUN: open the app (……/index.html?app=1), pick any profile, paste this
   file in the DevTools console, then:  voiceCoverage()
   → console.tables coverage per category + returns { gaps:[…] }.
   Re-run after adding any Georgian content. gaps:[] = full coverage.
   ════════════════════════════════════════════════════════════════════════ */
window.voiceCoverage = function voiceCoverage(){
  const M = window.AUDIO_MANIFEST || {};
  const norm = s => String(s==null?'':s).trim().toLowerCase();
  const has  = s => Object.prototype.hasOwnProperty.call(M, norm(s));
  const R = {}; const gaps = [];
  const add = (cat, s) => {
    if (s==null || s==='') return;
    R[cat] = R[cat] || { total:0, missing:0, samples:[] };
    R[cat].total++;
    if (!has(s)) { R[cat].missing++; if (R[cat].samples.length<8) R[cat].samples.push(String(s).slice(0,46)); gaps.push({cat, text:String(s)}); }
  };

  // ── only the strings the app ACTUALLY voices in Georgian ──
  try { ['ბრავო','მართალია','შესანიშნავია','ყოჩაღ'].forEach(s=>add('praise', s)); } catch(e){}
  try { add('retry', 'კიდევ სცადე.'); } catch(e){}
  try { for (let n=1;n<=20;n++) add('numbers(digit)', String(n)); } catch(e){}        // numWord(ka) = digit string
  try { for (const c in WORDS) WORDS[c].forEach(w=>add('words_ka', w.ka)); } catch(e){}      // sayWord ka part
  try { for (const cat in PHRASES) PHRASES[cat].forEach(p=>add('phrases_ka', p.ka)); } catch(e){}
  try { (TALK.ka||[]).forEach(t=>add('talk_q', t.q)); } catch(e){}                    // talkSpeak voices c.q only
  try { KA_ALPHA.forEach(e=> (e.x||[]).forEach(p=>add('alpha_word', p[0]))); } catch(e){}     // alphaSay says it.w (NOT the letter)
  try { READING_SENT_KA.forEach(q=>add('read_sent', q.s)); } catch(e){}

  try { console.table(Object.entries(R).map(([cat,v])=>({category:cat, total:v.total, missing:v.missing, samples:v.samples.join(' · ')}))); } catch(e){}
  console.log(`voiceCoverage: ${Object.keys(M).length} manifest keys · ${gaps.length} voiced ka string(s) with NO clip`);
  return { manifestKeys: Object.keys(M).length, gaps, byCategory: R };
};
