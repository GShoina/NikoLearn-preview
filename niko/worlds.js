/* ═══════════════════════════════════════════════════════════
   worlds.js — „ბუს ქვეყანა" (owner-approved concept v2, 2026-07-10).
   ONE central map for the ≤7 play-framing: home world cards, inner play-labels,
   spoken names. Rename a world or inner label HERE (one line) — home, menus,
   topbar and voicing all follow. 8+ and the parent surface never read this map
   (worldsOn gates everything). Clips: niko/audio/wclip_*.mp3 (tools/_gen_worlds.py).
   ═══════════════════════════════════════════════════════════ */
const WORLD_AGE_MAX = 7; // owner: "8+ დარჩეს" — the play-country covers ages ≤7
function worldsOn(p){ try{ const a=kidObj(p||profile).age; return a>0 && a<=WORLD_AGE_MAX; }catch(e){ return false; } }

const WORLDS = { // subject/route → world card (name is the SPOKEN text too — must match a manifest key)
  counting:    { nm:'რიცხვების სამეფო',    ic:'🏰', hue:'whue-gold'   },
  'ka-alpha':  { nm:'ასოების ქალაქი',      ic:'🏙️', hue:'whue-purple' },
  'en-alpha':  { nm:'ინგლისურის კუნძული',  ic:'🏝️', hue:'whue-blue'   },
  english:     { nm:'ინგლისურის კუნძული',  ic:'🏝️', hue:'whue-blue'   },
  math:        { nm:'დათვლის ჯუნგლები',    ic:'🌿', hue:'whue-green'  },
  shapes:      { nm:'ფიგურების ქვეყანა',   ic:'🔷', hue:'whue-teal'   },
  talk:        { nm:'საუბრის ბუდე',        ic:'💬', hue:'whue-teal'   },
  dayq:        { nm:'დღის კითხვა',         ic:'💡', hue:'whue-gold'   }, // W7 v3 — voiced wclip_20.mp3 (edge_tts EkaNeural, build-time)
  move:        { nm:'მოძრაობის მოედანი',   ic:'🤸', hue:'whue-pink'   },
  ws:          { nm:'სიტყვების ძებნა',     ic:'🔎', hue:'whue-orange' },
  draw:        { nm:'ხატვის სტუდია',       ic:'🎨', hue:'whue-pink'   },
  'kings-eng': { nm:'კინგსი ინგლისური',    ic:'👑', hue:'whue-kings'  }, // names stay (owner pick A: exam-prep value)
  'kings-math':{ nm:'კინგსი მათემატიკა',   ic:'📐', hue:'whue-kings'  }
};
const WORLD_INNER = { // inner tile play-labels for ≤7 — rule: school words → play words; play verbs stay
  counting:  { quiz:'ციფრების გამოცანა' },
  'ka-alpha':{ learn:'ასოების სახლები', quiz:'გამოცანების კოშკი', read:'ზღაპრების ხე', trace:'ჯადოსნური კალამი' },
  'en-alpha':{ learn:'ABC ნაპირი', quiz:'განძის ძიება' },
  math:      { 'math-add':'შეკრების ბილიკი', 'math-sub':'გამოკლების მდინარე', 'math-pat':'იპოვე წესი', shapes:'ფიგურების ქვეყანა' }
};
function worldName(subj){ const w=WORLDS[subj]; return w?w.nm:null; }
function innerName(subj,key,fb){ if(!worldsOn(profile)) return fb; const m=WORLD_INNER[subj]; return (m&&m[key])||fb; }
/* voice the tapped tile's rendered name (recorded clip only; silent no-op when no clip / reader labels) */
function wSay(el){ try{ const t=el&&el.querySelector('.m-name'); if(t&&window.playClipFor) playClipFor(t.textContent.trim()); }catch(e){} }
function wVoice(nm){ try{ if(window.playClipFor) playClipFor(nm); }catch(e){} }

function worldCard(key,route){
  const w=WORLDS[key];
  return `<div class="subj wld ${w.hue}" role="button" tabindex="0" onclick="wVoice('${w.nm}');${route}"
    onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${route}}">
    <span class="w-spk" aria-hidden="true">🔊</span><div class="w-ico">${w.ic}</div><div class="w-nm">${w.nm}</div></div>`;
}
/* the ≤7 home body: owl + one big „ითამაშე!" (continues the existing path via homeResume) + world cards.
   ≤5 keeps its own subject set (incl. tiny shapes swap); 6-7 keeps ITS set (incl. Kings, gold, names kept). */
function worldsHome(p){
  let cards;
  if(isYoung(p)){
    cards=[
      worldCard('counting',"openSubj(event,'counting')"),
      worldCard('ka-alpha',"openSubj(event,'ka-alpha')"),
      worldCard('en-alpha',"openSubj(event,'en-alpha')"),
      isTiny(p)?worldCard('shapes',"startGame('shapes')"):worldCard('math',"openSubj(event,'math')"),
      worldCard('talk','openTalk()'),
      worldCard('dayq','openDayQ()'),
      worldCard('move','showBreak(true)'),
      worldCard('ws','wsStart()'),
      worldCard('draw','openDraw()')
    ];
  } else { // 6-7
    cards=[
      worldCard('kings-eng',"openSubj(event,'kings-eng')"),
      worldCard('kings-math',"openSubj(event,'kings-math')"),
      worldCard('english',"openSubj(event,'english')"),
      worldCard('math',"openSubj(event,'math')"),
      worldCard('ka-alpha',"openSubj(event,'ka-alpha')"),
      worldCard('talk','openTalk()'),
      worldCard('dayq','openDayQ()'),
      worldCard('move','showBreak(true)'),
      worldCard('ws','wsStart()'),
      worldCard('draw','openDraw()')
    ];
  }
  const r=homeResume(p);
  return `<div class="ykick">🦉 ბუს ქვეყანა</div>
    <div class="yhero"><div class="y-owl" aria-hidden="true">🦉</div>
      <button class="bigplay" onclick="openSubj(event,'${r.subj}')">ითამაშე!</button>
      <div class="yheap">ბუ თვითონ მიგიყვანს შემდეგ თავგადასავალთან</div></div>
    <div class="subj-grid wgrid">${cards.join('')}</div>`;
}
