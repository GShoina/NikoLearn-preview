// NikoLearn content layer — expand freely; keep item shapes. See docs/HANDOFF.md §3.
const COUNTING = [
  {n:1, emoji:'🍎', ka:'ერთი',  en:'one'},
  {n:2, emoji:'🍌', ka:'ორი',   en:'two'},
  {n:3, emoji:'🍓', ka:'სამი',  en:'three'},
  {n:4, emoji:'🐟', ka:'ოთხი',  en:'four'},
  {n:5, emoji:'⭐', ka:'ხუთი',  en:'five'},
  {n:6, emoji:'🌸', ka:'ექვსი', en:'six'},
  {n:7, emoji:'🍇', ka:'შვიდი', en:'seven'},
  {n:8, emoji:'🐝', ka:'რვა',   en:'eight'},
  {n:9, emoji:'🚗', ka:'ცხრა',  en:'nine'},
  {n:10,emoji:'🎈', ka:'ათი',   en:'ten'}
];

const WORDS = {
  'ცხოველები 🐾':[{ka:'კატა',en:'cat',emoji:'🐈'},{ka:'ძაღლი',en:'dog',emoji:'🐕'},{ka:'თევზი',en:'fish',emoji:'🐟'},{ka:'ფრინველი',en:'bird',emoji:'🐦'}],
  'ფერები 🎨':[{ka:'წითელი',en:'red',emoji:'🟥'},{ka:'ლურჯი',en:'blue',emoji:'🟦'},{ka:'მწვანე',en:'green',emoji:'🟩'},{ka:'ყვითელი',en:'yellow',emoji:'🟨'}]
};

// ~100 everyday English phrases (Kings prep). Starter bank — expand each group freely. Item {ka,en}.
const PHRASES = {
  '👋 მისალმება':[{ka:'გამარჯობა',en:'Hello'},{ka:'როგორ ხარ?',en:'How are you?'},{ka:'კარგად ვარ',en:"I'm fine"},{ka:'ნახვამდის',en:'Goodbye'}],
  '🙏 თავაზიანობა':[{ka:'გმადლობ',en:'Thank you'},{ka:'გთხოვ',en:'Please'},{ka:'ბოდიში',en:'Sorry'},{ka:'არაუშავს',en:"It's okay"}],
  '🏫 სკოლა':[{ka:'შემიძლია წყალი დავლიო?',en:'Can I drink water?'},{ka:'არ მესმის',en:"I don't understand"},{ka:'მზად ვარ',en:"I'm ready"},{ka:'დამეხმარე',en:'Help me, please'}],
  '😊 გრძნობები':[{ka:'მშია',en:"I'm hungry"},{ka:'დავიღალე',en:"I'm tired"},{ka:'ბედნიერი ვარ',en:"I'm happy"},{ka:'მიყვარს ეს',en:'I like it'}]
};

const PRAISE_KA = ['ყოჩაღ!','ბრავო!','მართალია!','სუპერ!','აფერი!'];
