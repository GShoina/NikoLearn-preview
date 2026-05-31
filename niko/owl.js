// Owl "ბუ" bubble UI — shows on a wrong answer: cheer + item-specific hint + sound. HANDOFF §2, §8.4
function showOwl(subject, item){
  const old = document.getElementById('owl'); if(old) old.remove();
  const cheer = pick(OWL_CHEER);
  const hint = owlHint(subject, item);
  const d = document.createElement('div');
  d.id = 'owl'; d.className = 'owl';
  d.innerHTML = `<div class="owl-av bounce">🦉</div>
    <div class="owl-bubble"><div class="owl-cheer">${cheer}</div><div>${hint}</div></div>
    <button class="owl-x" id="owlx" aria-label="close">✕</button>`;
  document.body.appendChild(d);
  document.getElementById('owlx').onclick = () => d.remove();
  // Speak the English part only (never read Georgian with the English voice — §8.4).
  if(subject === 'words' && item && item.en) speak(item.en, 'en');
  else if(subject === 'phrases' && item && item.en) speak(item.en, 'en');
  else if(subject === 'alpha' && item && /[A-Za-z]/.test(item.word)) speak(item.word, 'en');
  setTimeout(() => { const o = document.getElementById('owl'); if(o) o.remove(); }, 5000);
}
