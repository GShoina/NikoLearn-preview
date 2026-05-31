// Core: state, persistence, render router, voice (with Georgian-voice guard). HANDOFF §3, §8.4
const SK = 'nikolearn_p2';
let state, profile = null;

function defaultState(){ return { authed:false, onboarded:false, kids:[] }; }
function load(){ try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(SK) || '{}')); } catch(e){ return defaultState(); } }
function save(){ localStorage.setItem(SK, JSON.stringify(state)); }

function kid(){ return state.kids.find(k => k.id === profile) || null; }
function prog(){
  const id = profile;
  if(!state[id]) state[id] = { coins:0, combo:0, maxCombo:0, dayStreak:0, lastDay:null, counting:{correct:0,wrong:0}, sessions:0 };
  return state[id];
}
function app(html){ document.getElementById('app').innerHTML = html; }
function $(sel){ return document.querySelector(sel); }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

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

function boot(){
  if(!state.authed) return renderLogin();
  if(!state.kids.length) return renderAddKid();
  renderHome();
}
