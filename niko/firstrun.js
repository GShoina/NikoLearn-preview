/* ═══════════════════════════════════════════════════════════
   NikoLearn — v2.0 FIRST-RUN activation flow (owner-designed, 2026-07-02)
   Ports the owner's v2 prototype screens 01 (OPEN) → gentle first task → 05 (FIRST WIN).
   Goal (data-backed): a brand-new child goes from open to a FIRST WIN in under a minute,
   which is the direct fix for the q0-abandonment (53% quit on the first question).
   Runs ONCE per profile (state[p].firstRunSeen). Georgian audio = recorded clips only (§6),
   played via frPlay(); never runtime ka TTS. No em dash in any copy (§8).
   Design tokens: ink #2A1C12 · brand #FF8A00 · green #00C48C · cream #FFF3DF/#FAF5EC.
   ═══════════════════════════════════════════════════════════ */

// gentle, guaranteed-easy first task per subject → a sure first win.
const FR_SUBJ = {
  // owner live-test 2026-07-05: a single first-run question felt like a formality and assessed nothing.
  // Now 3 short, all-winnable tasks per subject — still under a minute, but the child DOES a real little
  // activity before the first win (still activation, not a diagnostic; the placement flow does assessment).
  counting: { key:'counting', label:'რიცხვები', ico:'123', grad:'linear-gradient(155deg,#FFD27A,#FF8A00)',
    ring:'#FFE0A0', shadow:'rgba(255,138,0,.5)', sub:'დათვლა და ფიგურები',
    tasks:[
      {q:'დაითვალე ვაშლები. რამდენია?', show:'🍎🍎🍎', clip:'fr_tc1', opts:['2','3','4'], ans:'3'},
      {q:'ახლა დაითვალე. რამდენია?', show:'🍎🍎🍎🍎🍎', clip:'fr_tc2', opts:['4','5','6'], ans:'5'},
      {q:'კიდევ ერთხელ. რამდენია?', show:'🍎🍎', clip:'fr_tc3', opts:['1','2','3'], ans:'2'}
    ],
    winSub:'დათვალე ვაშლები, ერთი-ერთმანეთის მიყოლებით 🍎' },
  'ka-alpha': { key:'ka-alpha', label:'ასოები', ico:'აბგ', grad:'linear-gradient(155deg,#5EE0BC,#00C48C)',
    ring:'#C8F0E2', shadow:'rgba(0,196,140,.45)', sub:'ბგერა და ანბანი',
    tasks:[
      {q:'იპოვე ასო „ა".', show:'<span class="fr-bigletter">ა</span>', clip:'fr_ta1', opts:['ა','ო','მ'], ans:'ა'},
      {q:'იპოვე ასო „ბ".', show:'<span class="fr-bigletter">ბ</span>', clip:'fr_ta2', opts:['ბ','დ','გ'], ans:'ბ'},
      {q:'იპოვე ასო „ო".', show:'<span class="fr-bigletter">ო</span>', clip:'fr_ta3', opts:['ო','ა','ე'], ans:'ო'}
    ],
    winSub:'იპოვე ასოები „ა", „ბ", „ო"' },
  english: { key:'english', label:'ენა', ico:'<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18"></path></svg>',
    grad:'linear-gradient(155deg,#73B4F5,#2E86DE)', ring:'#CFE2FB', shadow:'rgba(46,134,222,.45)', sub:'ინგლისური სიტყვები',
    tasks:[
      {q:'რომელია „კატა" ინგლისურად?', show:'🐱', clip:'fr_te1', opts:['cat','dog','sun'], ans:'cat'},
      {q:'რომელია „ძაღლი" ინგლისურად?', show:'🐶', clip:'fr_te2', opts:['dog','cat','sun'], ans:'dog'},
      {q:'რომელია „მზე" ინგლისურად?', show:'☀️', clip:'fr_te3', opts:['sun','dog','cat'], ans:'sun'}
    ],
    winSub:'იპოვე „cat", „dog", „sun"' }
};

function frPlay(name){ try{ var a=new Audio('niko/audio/'+name+'.mp3'); a.play().catch(function(){}); }catch(e){} }
let _frT0=0;

// ── screen 01: OPEN (Niko greets, 3 big jelly buttons) ──
function firstRunStart(id){
  if(id) profile=id;
  _frT0 = Date.now();
  if(window.Analytics)Analytics.screen('firstrun');
  const btn=(s)=>`<button class="fr-tile" onclick="frPick('${s.key}')">
      <span class="fr-tile-ic" style="background:${s.grad};box-shadow:0 8px 16px -6px ${s.shadow}">${/^</.test(s.ico)?s.ico:`<span class="fr-pop" style="font-size:32px;font-weight:800;color:#fff">${s.ico}</span>`}</span>
      <span class="fr-tile-txt"><span class="fr-pop fr-tile-name">${s.label}</span><span class="fr-tile-sub">${s.sub}</span></span>
    </button>`;
  render(`<div class="screen fr-screen">
    <div class="fr-stars"><i class="fr-star a"></i><i class="fr-star b"></i></div>
    <div class="fr-niko-wrap">
      <span class="fr-ring"></span>
      <div class="fr-niko"><img src="owl-logo.png" alt="ნიკო"></div>
    </div>
    <div class="fr-voice"><span class="fr-bars"><i></i><i></i><i></i><i></i></span><span class="fr-pop fr-voice-t">ნიკო ლაპარაკობს</span></div>
    <div class="fr-pop fr-greet">გამარჯობა! მე ნიკო ვარ.<br>რა გინდა ვითამაშოთ?</div>
    <div class="fr-tiles">${FR_SUBJ.counting?btn(FR_SUBJ.counting):''}${btn(FR_SUBJ['ka-alpha'])}${btn(FR_SUBJ.english)}</div>
    <div class="fr-foot">＊ ერთი შეხება და თამაში იწყება</div>
  </div>`,false);
  setTimeout(()=>frPlay('fr_greet'),350);
}

// ~1s "GREAT, LET'S GO" transition → the first task
function frPick(subjKey){
  const s=FR_SUBJ[subjKey]; if(!s) return;
  if(window.Analytics)Analytics.event('lesson_started',{mode:subjKey==='ka-alpha'?'alphabet':subjKey});
  render(`<div class="screen fr-screen fr-go">
    <div class="fr-niko-wrap big"><span class="fr-ring"></span><div class="fr-niko"><img src="owl-logo.png" alt="ნიკო"></div></div>
    <div class="fr-pop fr-golead">ყოჩაღ, წავედით!</div>
  </div>`,false);
  setTimeout(()=>firstRunTask(subjKey), 950);
}

// ── screen 04: FIRST TASK (voice + pictures, guaranteed easy, no writing) — now 3 short tasks ──
function frTasks(s){ return (s&&s.tasks&&s.tasks.length)?s.tasks:[{q:s.q,show:s.show,opts:s.opts,ans:s.ans}]; }
function firstRunTask(subjKey, idx){
  idx=idx||0;
  const s=FR_SUBJ[subjKey]; if(!s) return;
  const tasks=frTasks(s), t=tasks[idx]; if(!t) return firstRunWin(subjKey);
  const opts=(typeof shuffle==='function')?shuffle(t.opts.slice()):t.opts.slice();
  render(`<div class="screen fr-screen fr-task">
    <div class="fr-niko-wrap sm"><div class="fr-niko"><img src="owl-logo.png" alt="ნიკო"></div></div>
    <div class="fr-pop" style="font-size:.82rem;opacity:.55;font-weight:800;letter-spacing:.5px">${idx+1} / ${tasks.length}</div>
    <div class="fr-pop fr-taskq">${t.q}${t.clip?` <button class="fr-replay" onclick="frPlay('${t.clip}')" aria-label="მოისმინე">🔊</button>`:''}</div>
    <div class="fr-show">${t.show}</div>
    <div class="fr-taskhint">👆 აირჩიე პასუხი</div>
    <div class="fr-opts">${opts.map(o=>`<button class="fr-opt fr-pop" onclick="frAnswer(this,'${o}','${t.ans}','${subjKey}',${idx})">${o}</button>`).join('')}</div>
  </div>`,false);
  if(t.clip) setTimeout(()=>frPlay(t.clip), 250);   // NB-21/22: voice the task prompt so a pre-reader knows what to do
}

function frAnswer(btn, sel, ans, subjKey, idx){
  idx=idx||0;
  if(subjKey==='english'){ try{ if(typeof speak==='function') speak(sel,'en-US'); }catch(e){} }  // NB-22: hear the English word on tap
  const s=FR_SUBJ[subjKey], total=frTasks(s).length;
  if(sel===ans){
    document.querySelectorAll('.fr-opt').forEach(b=>{b.disabled=true;b.classList.add('dim');});
    btn.classList.remove('dim'); btn.classList.add('ok');
    // advance to the next short task, or to the WIN after the last one
    if(idx+1<total){ setTimeout(()=>firstRunTask(subjKey, idx+1), 640); }
    else { setTimeout(()=>firstRunWin(subjKey), 620); }
  } else {
    btn.classList.add('bad'); setTimeout(()=>btn.classList.remove('bad','dim'), 500);
    // kind, no punishment: keep trying (the item is trivially easy, so this is rare)
  }
}

// ── screen 05: FIRST WIN (under a minute) ──
function firstRunWin(subjKey){
  const s=FR_SUBJ[subjKey]; if(!s) return;
  // real reward into the profile so the win is not empty
  try{ const st=state[profile]; if(st){ st.shields=(st.shields||0)+1; st.firstRunSeen=true; save(); } }catch(e){}
  if(window.Analytics){ Analytics.event('first_win',{mode:subjKey==='ka-alpha'?'alphabet':subjKey}); Analytics.event('lesson_completed',{mode:subjKey==='ka-alpha'?'alphabet':subjKey}); }
  const secs=Math.max(1,Math.round((Date.now()-(_frT0||Date.now()))/1000));
  render(`<div class="screen fr-screen fr-winscr">
    <div class="fr-stars"><i class="fr-star a"></i><i class="fr-star b"></i></div>
    <div class="fr-niko-wrap big">
      <span class="fr-ring"></span>
      <div class="fr-niko"><img src="owl-logo.png" alt="ნიკო"></div>
      <span class="fr-check"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"></path></svg></span>
    </div>
    <div class="fr-pop fr-wintitle">ბრავო! შენ შეძელი!</div>
    <div class="fr-winsub">${s.winSub}</div>
    <div class="fr-reward">
      <span class="fr-reward-ic" style="font-size:30px;line-height:1">🪙</span>
      <span class="fr-reward-t"><b class="fr-pop">პირველი მონეტა</b><small>დღევანდელი გმირი</small></span>
      <span class="fr-pop fr-reward-n">+1</span>
    </div>
    <div class="fr-time"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E9E78" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>პირველი მოგებამდე ≈ ${secs} წამი</span></div>
    <div class="fr-winbtns">
      <button class="fr-pop fr-again pulse" onclick="frMore('${subjKey}')"><span class="fr-sheen"></span><span class="fr-again-ic" aria-hidden="true">🔁</span><span class="fr-again-tx">კიდევ ერთი!</span><span class="fr-tap" aria-hidden="true">👆</span></button>
      <button class="fr-pop fr-done" onclick="frFinish()">დღეს კმარა</button>
    </div>
  </div>`,false);
  setTimeout(()=>frPlay('fr_win'),260);
}

// "one more" → drop the (now warmed-up) child into the real subject; "enough" → home.
function frMore(subjKey){ try{ if(typeof openMenu==='function') return openMenu(subjKey); }catch(e){} frFinish(); }
function frFinish(){ try{ if(typeof selectProfile==='function') return selectProfile(profile); }catch(e){} if(typeof goHome==='function') goHome(); }
