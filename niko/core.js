// Core: state, persistence, render router, voice (with Georgian-voice guard). HANDOFF §3, §8.4
const SK = 'nikolearn_p2';
let state, profile = null;

function defaultState(){ return { authed:false, onboarded:false, kids:[] }; }
function load(){ try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(SK) || '{}')); } catch(e){ return defaultState(); } }
function save(){ localStorage.setItem(SK, JSON.stringify(state)); }

function kid(){ return state.kids.find(k => k.id === profile) || null; }
function prog(){
  const id = profile;
  if(!state[id]) state[id] = { coins:0, combo:0, maxCombo:0, dayStreak:0, lastDay:null, counting:{correct:0,wrong:0}, words:{correct:0,wrong:0}, phrases:{correct:0,wrong:0}, math:{correct:0,wrong:0}, alpha:{correct:0,wrong:0}, mathLevel:0, sessions:0 };
  const s = state[id];
  ['counting','words','phrases','math','alpha'].forEach(k => { if(!s[k]) s[k] = {correct:0,wrong:0}; });
  if(typeof s.mathLevel !== 'number') s.mathLevel = 0;
  return state[id];
}
function app(html){ document.getElementById('app').innerHTML = html; }
function $(sel){ return document.querySelector(sel); }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function rnd(min, max){ return Math.floor(Math.random()*(max-min+1)) + min; }
function accuracy(o){ if(!o) return null; const t=(o.correct||0)+(o.wrong||0); return t ? Math.round(100*o.correct/t) : null; }

// Build answer choices: the correct item + distinct distractors, capped at pool size (never freezes
// on small pools — latent bug guard), shuffled. keyFn dedupes by a stable key.
function distractors(pool, correct, keyFn){
  const need = Math.min(3, pool.length);
  const m = new Map(); m.set(keyFn(correct), correct);
  let g = 0; while(m.size < need && g++ < 200){ const c = pick(pool); m.set(keyFn(c), c); }
  return [...m.values()].sort(() => Math.random() - 0.5);
}

// Shared end-of-round screen.
function results(right, total, againFn, extra){
  const perfect = right === total;
  const stars = '⭐'.repeat(right) + '·'.repeat(Math.max(0, total-right));
  app(`<div class="center" style="margin-top:12vh">
    <div class="bounce" style="font-size:4.5rem">${perfect?'🏆':'🎉'}</div>
    <div class="q">${right}/${total}</div>
    <div class="emojis">${stars}</div>
    ${extra||''}
    <button class="btn big" id="show">📣 მაჩვენე მშობელს</button>
    <button class="btn ghost big" id="again">კიდევ</button>
    <button class="btn ghost" id="menu">მენიუ</button></div>`);
  $('#again').onclick = againFn; $('#menu').onclick = renderMenu;
  $('#show').onclick = () => celebrate(right, total, againFn);
}

// Warm "show mom & dad" moment — the child shows the parent what they learned (success = warmth + trust).
function celebrate(right, total, againFn){
  const p = prog(); p.shown = (p.shown||0)+1; save();
  const k = kid();
  app(`<div class="center" style="margin-top:12vh">
    <div class="bounce" style="font-size:5rem">🌟🎉🌟</div>
    <div class="q" style="font-size:1.5rem">${esc(k.name)}-მ ${right}/${total} ისწავლა!</div>
    <div style="font-size:1.2rem;color:var(--muted)">დედა და მამა, შეაქეთ! 👏❤️</div>
    <button class="btn big" id="again">კიდევ თამაში</button>
    <button class="btn ghost" id="menu">მენიუ</button></div>`);
  praise();
  $('#again').onclick = againFn; $('#menu').onclick = renderMenu;
}

// ── Voice ── NEVER read Georgian text with the English voice (HANDOFF §8.4).
function voices(){ return (window.speechSynthesis && speechSynthesis.getVoices()) || []; }
function hasVoiceFor(lang){ return voices().some(v => v.lang && v.lang.toLowerCase().startsWith(lang)); }
if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => voices();
function speak(text, lang){
  if(lang === 'ka'){ if(window.playClip && playClip(text)) return; if(!hasVoiceFor('ka')) return; } // clip or silent — never gibberish
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.lang = lang === 'ka' ? 'ka-GE' : 'en-US';
  const v = voices().find(v => v.lang && v.lang.toLowerCase().startsWith(lang)); if(v) u.voice = v;
  speechSynthesis.speak(u);
}
function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1100); }
function praise(){ const p = pick(PRAISE_KA); toast(p); speak(p,'ka'); }

// ── Day streak (calendar days) — separate from in-a-row combo. Improvement over HANDOFF §7. ──
function dayKey(d){ return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function touchDay(){
  const p = prog(), t = dayKey(new Date());
  if(p.lastDay === t) return;
  const ys = dayKey(new Date(Date.now()-864e5));
  p.dayStreak = (p.lastDay === ys) ? (p.dayStreak||0)+1 : 1;
  p.lastDay = t; p.sessions = (p.sessions||0)+1; save();
}

// ── Data durability (pilot needs progress to survive; iOS evicts non-installed PWA storage ~7d) ──
async function requestPersist(){
  try {
    if(navigator.storage && navigator.storage.persist){
      const already = navigator.storage.persisted ? await navigator.storage.persisted() : false;
      if(!already) await navigator.storage.persist();
    }
  } catch(e){}
}
let _installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); _installPrompt = e; });
function canInstall(){ return !!_installPrompt; }
async function doInstall(){
  if(!_installPrompt) return;
  _installPrompt.prompt();
  try { await _installPrompt.userChoice; } catch(e){}
  _installPrompt = null;
  if(typeof renderHome === 'function') renderHome();
}

function boot(){
  requestPersist();
  if(!state.authed) return renderLogin();
  if(!state.kids.length) return renderAddKid();
  renderHome();
}
