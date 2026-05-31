// Owl "ბუ" hint engine — algorithmic, item-specific hints per subject. HANDOFF §2, §8.4
const OWL_CHEER = ['არა უშავს! 🦉', 'კიდევ სცადე! 💪', 'თითქმის! 🌟', 'შენ შეგიძლია! 🦉'];

function owlHint(subject, item){
  switch(subject){
    case 'counting': return `დათვალე ნელა, თითით 👆 — ${item.emoji.repeat(item.n)}`;
    case 'words':    return `ეს არის „${item.ka}" ${item.emoji}. მოუსმინე ინგლისურს 🔊`;
    case 'phrases':  return `კარგად მოუსმინე ფრაზას 🔊 და აირჩიე მისი ქართული მნიშვნელობა.`;
    case 'alpha':    return `${item.emoji} „${item.word}" — იწყება ასოთი „${item.l}".`;
    case 'math':     return `დაითვალე ფრთხილად, თითებზე — და სცადე ისევ 👐`;
    default:         return pick(OWL_CHEER);
  }
}
