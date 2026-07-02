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
  counting: { key:'counting', label:'რიცხვები', ico:'123', grad:'linear-gradient(155deg,#FFD27A,#FF8A00)',
    ring:'#FFE0A0', shadow:'rgba(255,138,0,.5)', sub:'დათვლა და ფიგურები',
    q:'დაითვალე ვაშლები. რამდენია?', show:'🍎🍎🍎', opts:['2','3','4'], ans:'3',
    winSub:'პირველივე ცდაზე დათვალე სამი 🍎' },
  'ka-alpha': { key:'ka-alpha', label:'ასოები', ico:'აბგ', grad:'linear-gradient(155deg,#5EE0BC,#00C48C)',
    ring:'#C8F0E2', shadow:'rgba(0,196,140,.45)', sub:'ბგერა და ანბანი',
    q:'იპოვე ასო „ა".', show:'🔤', opts:['ა','ო','მ'], ans:'ა',
    winSub:'პირველივე ცდაზე იპოვე ასო „ა"' },
  english: { key:'english', label:'ენა', ico:'<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18"></path></svg>',
    grad:'linear-gradient(155deg,#73B4F5,#2E86DE)', ring:'#CFE2FB', shadow:'rgba(46,134,222,.45)', sub:'ინგლისური სიტყვები',
    q:'რომელია „კატა" ინგლისურად?', show:'🐱', opts:['cat','dog','sun'], ans:'cat',
    winSub:'პირველივე ცდაზე იპოვე „cat"' }
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

// ── screen 04: FIRST TASK (voice + pictures, guaranteed easy, no writing) ──
function firstRunTask(subjKey){
  const s=FR_SUBJ[subjKey]; if(!s) return;
  const opts=(typeof shuffle==='function')?shuffle(s.opts.slice()):s.opts.slice();
  render(`<div class="screen fr-screen fr-task">
    <div class="fr-niko-wrap sm"><div class="fr-niko"><img src="owl-logo.png" alt="ნიკო"></div></div>
    <div class="fr-pop fr-taskq">${s.q}</div>
    <div class="fr-show">${s.show}</div>
    <div class="fr-taskhint">👆 აირჩიე პასუხი</div>
    <div class="fr-opts">${opts.map(o=>`<button class="fr-opt fr-pop" onclick="frAnswer(this,'${o}','${s.ans}','${subjKey}')">${o}</button>`).join('')}</div>
  </div>`,false);
}

function frAnswer(btn, sel, ans, subjKey){
  if(sel===ans){
    document.querySelectorAll('.fr-opt').forEach(b=>{b.disabled=true;b.classList.add('dim');});
    btn.classList.remove('dim'); btn.classList.add('ok');
    setTimeout(()=>firstRunWin(subjKey), 620);
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
      <button class="fr-pop fr-again" onclick="frMore('${subjKey}')"><span class="fr-sheen"></span>კიდევ ერთი!</button>
      <button class="fr-pop fr-done" onclick="frFinish()">დღეს კმარა</button>
    </div>
  </div>`,false);
  setTimeout(()=>frPlay('fr_win'),260);
}

// "one more" → drop the (now warmed-up) child into the real subject; "enough" → home.
function frMore(subjKey){ try{ if(typeof openMenu==='function') return openMenu(subjKey); }catch(e){} frFinish(); }
function frFinish(){ try{ if(typeof selectProfile==='function') return selectProfile(profile); }catch(e){} if(typeof goHome==='function') goHome(); }
