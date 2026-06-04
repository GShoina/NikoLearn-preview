/* ═══════════════════════════════════════════════════════════
   NikoLearn — i18n (UI language layer)
   Georgian (ka) is the source/default. English (en) is layered on
   at render time by translating text nodes + a few attributes.
   Anything not in the dictionary stays Georgian (safe fallback),
   so the app can never break on a missing string.
   Shared by the app (index.html) AND the landing (landing.html).
   ═══════════════════════════════════════════════════════════ */
(function(){
  var KEY='niko_uilang';
  var L; try{L=localStorage.getItem(KEY)||'ka';}catch(e){L='ka';}
  if(L!=='en')L='ka';
  window.UILANG=L;
  try{document.documentElement.lang=L;}catch(e){}

  function persist(){try{localStorage.setItem(KEY,window.UILANG);}catch(e){}}

  /* ── exact Georgian text → English (matched on trimmed text-node value) ── */
  var MAP={
    /* home / profiles */
    "დაიწყე →":"Start →",
    "შექმენი ბავშვის პროფილი":"Create a child profile",
    "დაამატე ბავშვი":"Add a child",
    "მოგესალმები 👋 — შექმენი ბავშვის პროფილი დასაწყებად":"Welcome 👋 — create a child profile to begin",
    "ვინ თამაშობს?":"Who's playing?",
    "მშობლის სივრცე":"Parent space",
    "დაცულია":"Locked",
    "მონაცემები ამ მოწყობილობაზე რჩება":"Your data stays on this device",
    "მონაცემები მხოლოდ ამ მოწყობილობაზე რჩება":"Your data stays only on this device",
    "დაგვიკავშირდი 💬":"Contact us 💬",

    /* login */
    "შესვლა":"Log in",
    "შესვლა →":"Log in →",
    "მომხმარებელი":"Username",
    "პაროლი":"Password",
    "პაროლი არასწორია":"Wrong password",

    /* onboarding / welcome */
    "თბილი სასწავლო სივრცე შენი ბავშვისთვის":"A warm learning space for your child",
    "ინგლისური · მათემატიკა · Kings (Cambridge YLE) გამოცდისთვის":"English · Math · Kings (Cambridge YLE) prep",
    "მონაცემები ამ მოწყობილობაზე რჩება":"Your data stays on this device",
    "— ღრუბელი არ არის":"— no cloud",
    "ნული":"Zero",
    "რეკლამა · ნული გარე ბმული · მშობლის დაცული სივრცე":"ads · zero external links · a protected parent space",
    "დავიწყოთ 🌟":"Let's start 🌟",

    /* add child / consent */
    "ახალი პროფილი":"New profile",
    "ვინ ქმნის პროფილს?":"Who's creating the profile?",
    "მე მშობელი ვარ":"I'm a parent",
    "ვქმნი ჩემი შვილის პროფილს":"Creating my child's profile",
    "მე ბავშვი ვარ":"I'm a child",
    "საჭიროა მშობლის თანხმობა":"A parent's consent is needed",
    "მშობლის თანხმობა":"Parent's consent",
    "მშობელო, საჭიროა შენი თანხმობა":"Parent, we need your consent",
    "პროფილი იქმნება ბავშვისთვის":"The profile is for a child",
    "ყველა მონაცემი":"All data",
    "ამ მოწყობილობაზე":"on this device",
    "ინახება":"is stored",
    "რეკლამა — ნული · გარე ბმული — ნული":"Ads — zero · external links — zero",
    "მე, მშობელი, ვეთანხმები ✓":"I, the parent, agree ✓",
    "უკან":"Back",
    "ახალი ბავშვი":"New child",
    "სახელი":"Name",
    "ასაკი":"Age",
    "წლის":"yrs",
    "რა ენებზე საუბრობს ბავშვი?":"Which languages does the child speak?",
    "🔊 გახმოვანება და ახსნა ამ ენებზე. ინგლისურს მაინც ისწავლის თამაშით.":"🔊 Voice and hints in these languages. English is still taught through play.",
    "🧸 პატარებისთვის: ტექსტის გარეშე, ხატულა + ხმა":"🧸 For little ones: no text, icons + sound",
    "🎒 დაიწყებს ინგლისურს, მათემატიკას და Kings-ს":"🎒 Starts English, Math and Kings",
    "ფერი":"Colour",
    "მშობლის ტელეფონი (არასავალდებულო)":"Parent's phone (optional)",
    "📞 ნებაყოფლობითი — მხოლოდ თუ შეავსებ, დახმარებისთვის დაგიკავშირდებით.":"📞 Optional — only if you fill it in, we'll reach out to help.",
    "შექმენი პროფილი":"Create profile",

    /* subjects / menu */
    "ინგლისური":"English",
    "მათემატიკა":"Math",
    "Kings ტესტი":"Kings test",
    "Kings ოლიმპიადა":"Kings olympiad",
    "ოლიმპიადა":"olympiad",
    "5 რეჟიმი":"5 modes",
    "🔤 ინგლისური":"🔤 English",
    "🧮 მათემატიკა":"🧮 Math",
    "🔢 დათვლა":"🔢 Counting",
    "🇬🇪 ანბანი":"🇬🇪 Alphabet",
    "📚 ყველა თემა ▾":"📚 All topics ▾",
    "📚 კატეგორიები":"📚 Categories",
    "💬 ფრაზები":"💬 Phrases",
    "🌈 ყველა თემა":"🌈 All topics",
    "🌈 ყველა ფრაზა":"🌈 All phrases",
    "ყველა თემა":"All topics",
    "კატეგორიები":"Categories",
    "აირჩიე თემა":"Pick a topic",
    "ფრაზები":"Phrases",
    "მოისმინე":"Listen",
    "მისმინე":"Listen",
    "სცადე ხელახლა":"Try again",
    "შეამოწმე":"Check",
    "დაწერე":"Write",
    "სწავლა":"Learn",
    "ქვიზი":"Quiz",
    "ქვიზი 🎯":"Quiz 🎯",
    "დათვალე":"Count",
    "რამდენია? აირჩიე რიცხვი":"How many? Pick a number",
    "ქართ → ინგლ":"KA → EN",
    "ინგლ → ქართ":"EN → KA",
    "სურათი":"Picture",
    "დააწყვილე":"Match",
    "შეკრება":"Addition",
    "გამოკლება":"Subtraction",
    "გამრავლება":"Multiplication",
    "პატერნები":"Patterns",
    "ქართული":"Georgian",

    /* game play */
    "აირჩიე მნიშვნელობა":"Pick the meaning",
    "მოისმინე და აირჩიე":"Listen and choose",
    "იპოვე კანონზომიერება":"Find the pattern",
    "შედარება":"Comparison",
    "დათვლა":"Counting",
    "ხუთობით · ათობით":"by 5s · 10s",
    "ფიგურები":"Shapes",
    "მეტი, ნაკლები თუ ტოლი?":"Greater, less or equal?",
    "რა ფიგურაა?":"What shape is it?",
    "დაითვალე ხუთობით":"Count by 5s",
    "დაითვალე ათობით":"Count by 10s",
    "ფული":"Money",
    "საათი":"Clock",
    "₾ · თეთრი":"GEL · tetri",
    "დრო":"time",
    "რამდენი თეთრია?":"How many tetri?",
    "რომელ საათს უჩვენებს?":"What time is it?",
    "კითხვა":"Reading",
    "ყოველდღიური":"everyday",
    "ლექსიკა":"Vocabulary",
    "მოსმენა":"Listening",
    "დონეებით 1–100":"graded 1–100",
    "სურათი · თარგმანი · მართლწერა · გრამატიკა":"picture · translate · spelling · grammar",
    "ამოცანები + ლოგიკა":"word problems + logic",
    "ისწავლე":"Learn",
    "ტესტები":"Quiz",
    "ტესტები 🎯":"Quiz 🎯",
    "ბუ · ანბანის მასწავლებელი":"Owl · alphabet teacher",
    "ბუ · მათემატიკის მასწავლებელი":"Owl · math teacher",
    "ბუ · ინგლისურის მასწავლებელი":"Owl · English teacher",
    "რამდენია?":"How many?",
    "აირჩიე ასო":"Pick the letter",
    "👆 აირჩიე ასო":"👆 Pick the letter",

    /* results */
    "მონეტა":"coins",
    "სიზუსტე":"accuracy",
    "მენიუ":"Menu",
    "📋 მენიუ":"📋 Menu",
    "↻ ისევ":"↻ Again",
    "🎉 მამას & დედას აჩვენე":"🎉 Show Mom & Dad",
    "🎉 მამას &amp; დედას აჩვენე":"🎉 Show Mom & Dad",
    "მშობელი დაინახავს მშობლის სივრცეში ❤️":"Your parent will see it in the parent space ❤️",
    "ახალი დონე!":"New level!",
    "ადექი და აჩვენე":"Get up and show",
    "დედას ან მამას 🤝":"Mom or Dad 🤝",
    "ვაჩვენე! ❤️":"I'll show them! ❤️",

    /* owl / hints */
    "კიდევ →":"More →",
    "💡 სტრატეგია":"💡 Strategy",
    "ხმით":"By voice",
    "მისმინე 👍":"Got it 👍",
    "მივხვდი 👍":"Got it 👍",
    "გასაგებია 👍":"Understood 👍",
    "ბუ · შენი მეგობარი":"Owl · your friend",
    "ბუ · ანბანის ქოუჩი":"Owl · alphabet coach",
    "ბუ · მათემატიკის ქოუჩი":"Owl · math coach",
    "ბუ · ინგლისურის ქოუჩი":"Owl · English coach",

    /* voice mode */
    "ხმოვანი რეჟიმი":"Voice mode",
    "ბუ მოგისმენს, როცა მიკროფონს დააჭერ — და დაგეხმარება გამოთქმაში.":"The owl listens when you press the mic — and helps with pronunciation.",
    "დართე ნება (მშობელი)":"Allow (parent)",
    "ახლა არა":"Not now",
    "ეს ერთჯერადი თანხმობაა. ხმის დამუშავება ხდება მხოლოდ მოწყობილობაზე — ღრუბელში არ იგზავნება.":"This is a one-time consent. Voice is processed on the device only — nothing is sent to the cloud.",
    "დააჭირე და თქვი":"Press and speak",
    "წარმოთქვი სიტყვა ხმამაღლა — ბუ მოგისმენს":"Say the word out loud — the owl will listen",
    "გისმენ…":"Listening…",
    "ლაპარაკობ ნათლად 🎙️":"Speak clearly 🎙️",
    "ვფიქრობ…":"Thinking…",
    "ბუ პასუხობს":"The owl replies",
    "ჩინებული გამოთქმა! 🌟":"Excellent pronunciation! 🌟",
    "კარგია! ცოტა გავაუმჯობესოთ":"Good! Let's polish it a little",

    /* break */
    "ყოჩაღ! 15 წუთი ისწავლე.":"Well done! You studied for 15 minutes.",
    "დროა პატარა შესვენების.":"Time for a little break.",
    "მზად ვარ! 💪":"I'm ready! 💪",
    "5-ჯერ ახტი 🤸":"Jump 5 times 🤸",
    "10-ჯერ შემოუარე ოთახს 🏃":"Run around the room 10 times 🏃",
    "გაიჭიმე მაღლა 🙆":"Stretch up high 🙆",
    "დალიე წყალი 💧":"Drink some water 💧",

    /* parent gate + dashboard */
    "ეს კარი ბავშვებისთვის არ არის. ამოხსენი მაგალითი გასაგრძელებლად.":"This door isn't for kids. Solve the sum to continue.",
    "ყველაფერი ამ მოწყობილობაზე რჩება.":"Everything stays on this device.",
    "პროგრესი ინახება მხოლოდ აქ. რეკლამა — ნული. გარე ბმულები — ნული.":"Progress is stored only here. Ads — zero. External links — zero.",
    "ნასწავლი":"learned",
    "📊 გასაუმჯობესები":"📊 What to improve",
    "შემდეგი ნაბიჯი — ერთად:":"Next step — together:",
    "სესია":"sessions",
    "წუთი სულ":"total minutes",
    "წთ/სესია":"min/session",
    "📤 რეპორტი":"📤 Report",
    "📋 დააკოპირე რეპორტი — გაუზიარე მასწავლებელს":"📋 Copy report — share with the teacher",
    "⏱️ დრო · 🔥 ჩვევა · 🎙️ ხმოვანი თანხმობა":"⏱️ Time · 🔥 Habit · 🎙️ Voice consent",
    "🔒 გასვლა (ჩაკეტვა)":"🔒 Log out (lock)",
    "🗑️ პროგრესის გასუფთავება":"🗑️ Clear progress",
    "წავშალო პროგრესი?":"Clear all progress?",
    "✓ რეპორტი კოპირებულია — ჩასვი და გაუზიარე":"✓ Report copied — paste and share",
    "გაუქმება":"Cancel",
    "წაშლა":"Delete",
    "ქართული ანბანი":"Georgian alphabet",
    "English ანბანი":"English alphabet"
  };

  /* ── landing-page strings (static HTML) ── */
  var LANDING={
    "რას ვასწავლით":"What we teach",
    "AI ნიკო":"AI Niko",
    "მშობლებს":"For parents",
    "დაიწყე უფასოდ":"Start free",
    "🇬🇪 ქართული სასწავლო აპი":"🇬🇪 A Georgian learning app",
    "ნახე როგორ მუშაობს":"See how it works",
    "რეკლამის გარეშე":"Ad-free",
    "მონაცემები მოწყობილობაზე":"Data on the device",
    "მუშაობს ინტერნეტის გარეშე":"Works offline",
    "📚 სასწავლო პროგრამა":"📚 Curriculum",
    "ერთ სივრცეში, ყველაფერი რაც გჭირდება":"Everything you need, in one place",
    "ანბანიდან მათემატიკამდე. ყველა საგანი თამაშია, ასაკის მიხედვით მორგებული.":"From the alphabet to math. Every subject is a game, tuned to the child's age.",
    "ასაკი:":"Age:",
    "3-5 წელი":"3-5 yrs",
    "6-8 წელი":"6-8 yrs",
    "9-12 წელი":"9-12 yrs",
    "ინგლისური ენა":"English",
    "ასო, ხმითა და სურათით":"letters, with sound and pictures",
    "ფრაზა და სიტყვა":"phrases and words",
    "დონე, თანდათან ამაღლებად":"levels, gradually harder",
    "სიტყვების სამყარო":"World of words",
    "ცხოველები, ფერები, საკვები, ბუნება და სხვა. 13 თემა.":"Animals, colours, food, nature and more. 13 topics.",
    "სახალისო რეჟიმები":"Fun modes",
    "ქვიზი, დაკავშირება, მართლწერა და ხმოვანი თამაში.":"Quiz, matching, spelling and a voice game.",
    "ჯილდოები":"Rewards",
    "მონეტები, სერიები, დონეები და რანგები მოტივაციისთვის.":"Coins, streaks, levels and ranks for motivation.",
    "🦉 AI რეპეტიტორი":"🦉 AI tutor",
    "გაიცანი ნიკო ბუ, რომელიც გელაპარაკება":"Meet Niko the owl, who talks with you",
    "ხმოვანი რეჟიმი":"Voice mode",
    "ჭკვიანი მინიშნებები":"Smart hints",
    "მოთმინება და წახალისება":"Patience and encouragement",
    "ნიკო":"Niko",
    "⚡ მარტივი დასაწყები":"⚡ Easy to start",
    "სამ ნაბიჯში მზად ხარ":"Ready in three steps",
    "აირჩიე პროფილი":"Pick a profile",
    "ისწავლე თამაშით":"Learn through play",
    "მიიღე ჯილდო":"Earn rewards",
    "👨‍👩‍👧 მშობლებს":"👨‍👩‍👧 For parents",
    "ბავშვი სწავლობს, შენ ხედავ პროგრესს":"Your child learns, you see the progress",
    "უსაფრთხო":"Safe",
    "რეკლამა და გარე ბმულები არ არის.":"No ads and no external links.",
    "პროგრესი":"Progress",
    "ცხადი რეპორტი ბავშვის შესახებ.":"A clear report about your child.",
    "დღიური ლიმიტი ერთი შეხებით.":"Daily limit in one tap.",
    "კონფიდენციალურობა":"Privacy",
    "🌟 მოტივაცია":"🌟 Motivation",
    "სწავლა, რომელსაც ბავშვი თვითონ ითხოვს":"Learning your child asks for",
    "მონეტები":"Coins",
    "სერია":"Streak",
    "დონეები":"Levels",
    "რანგები":"Ranks",
    "❓ ხშირი კითხვები":"❓ FAQ",
    "რაც მშობელს აინტერესებს":"What parents ask",
    "მუშაობს ინტერნეტის გარეშე?":"Does it work offline?",
    "უსაფრთხოა ბავშვისთვის?":"Is it safe for kids?",
    "რა ღირს?":"How much does it cost?",
    "მზად ხარ დასაწყებად?":"Ready to start?",
    "დაიწყე ახლავე":"Start now",
    "აპის გახსნა":"Open the app",

    /* phone mockup */
    "გამარჯობა, მაშო 👋":"Hi, Masho 👋",
    "ისწავლე თამაშით":"Learn through play",
    "ანბანი":"Alphabet",
    "სიტყვები":"Words",
    "ამოცანები":"problems",
    "ცხოველები 🐾":"Animals 🐾",
    "ყოჩაღ, მაშო! გამოთქმა მშვენიერი იყო 🌟":"Well done, Masho! Great pronunciation 🌟",
    "სცადოთ კიდევ ერთი სიტყვა?":"Shall we try another word?",

    /* hero lead + curriculum */
    "NikoLearn ასწავლის მათემატიკას, ინგლისურს და ქართულ ანბანს. ყველა გაკვეთილი მოკლე თამაშია, ხოლო AI რეპეტიტორი ნიკო ელაპარაკება, უსმენს გამოთქმას და ეხმარება ყოველ ნაბიჯზე.":"NikoLearn teaches math, English and the Georgian alphabet. Every lesson is a short game, and Niko the AI tutor talks, listens to pronunciation and helps at every step.",
    "შედგენილია ეროვნული სასწავლო პროგრამის მიხედვით":"Built to follow the national curriculum",
    "გაკვეთილები ეხმიანება კინგსის პროგრამასა და მის ტესტებს, რათა ბავშვი ტესტებს თავდაჯერებულად შეხვდეს.":"Lessons echo the Kings programme and its tests, so children meet exams with confidence.",

    /* owl section */
    "ნიკო ბუ არ არის უბრალო ღილაკი. ის ესაუბრება ბავშვს, უსმენს გამოთქმას და აძლევს მინიშნებებს. როცა რთულდება, ხსნის. როცა გამოსდის, აქებს.":"Niko the owl isn't just a button. He talks with the child, listens to pronunciation and gives hints. When it gets hard, he explains. When it goes well, he praises.",
    "ბავშვი ლაპარაკობს, ნიკო უსმენს და ასწორებს გამოთქმას.":"The child speaks, Niko listens and corrects pronunciation.",
    "პასუხს არ გასცემს მაშინვე. ჯერ ბიძგს აძლევს, რომ ბავშვმა თვითონ მიხვდეს.":"He doesn't give the answer right away. First he nudges, so the child works it out.",
    "ყოველთვის მშვიდი ტონი. შეცდომა სწავლის ნაწილია, არა ჩავარდნა.":"Always a calm tone. A mistake is part of learning, not a failure.",
    '"ლომი" ინგლისურად არის':'"Lion" in English is',
    ". სცადე ხმამაღლა წარმოთქმა 🦁":". Try saying it out loud 🦁",

    /* mid cta + steps */
    "ერთ წუთში დაიწყებ და ნიკო გელოდება.":"Start in one minute and Niko is waiting.",
    "უფასო · რეგისტრაციის გარეშე · მუშაობს ოფლაინ":"Free · no sign-up · works offline",
    "დაამატე ბავშვი და მიუთითე ასაკი. აპი თავად მოარგებს გაკვეთილებს.":"Add a child and set the age. The app tunes the lessons itself.",
    "მოკლე, სახალისო რაუნდები. ნიკო ეხმარება, როცა საჭიროა.":"Short, fun rounds. Niko helps when needed.",
    "მონეტები და სერიები ბავშვს, ცხადი პროგრესი მშობელს.":"Coins and streaks for the child, clear progress for the parent.",

    /* parents */
    "მშობლის სივრცე გიჩვენებს რას სწავლობს ბავშვი, რა გამოსდის და სად სჭირდება დახმარება. ყველაფერი მარტივ, ცხად ენაზე.":"The parent space shows what your child is learning, what's going well and where help is needed. All in simple, clear language.",
    "ცხადი ინსაიტები.":"Clear insights.",
    "ყოველკვირეული შეჯამება: ძლიერი მხარეები და სუსტი წერტილები.":"A weekly summary: strengths and weak spots.",
    "სრული კონფიდენციალურობა.":"Full privacy.",
    "მონაცემები რჩება მხოლოდ შენს მოწყობილობაზე, არსად იგზავნება.":"Data stays only on your device, nothing is sent anywhere.",
    "დაცული შესვლა.":"Protected access.",
    "მშობლის სივრცე PIN-კოდითაა დაცული, ბავშვი ვერ შევა.":"The parent space is protected with a PIN, the child can't get in.",
    "7 წლის · Learner":"7 yrs · Learner",
    "დღის სერია":"day streak",
    "GDPR & KIDS, მონაცემები დაცულია.":"GDPR & KIDS, data is protected.",
    "ნიკოლოზი":"Nikolozi",
    "ცხოველებში":"with animals",
    "ძლიერია, თუმცა":"is strong, but",
    "მართლწერა":"spelling",
    "ცოტა უჭირს. ამ კვირაში სცადეთ მართლწერის რეჟიმი.":"is a little tricky. Try the spelling mode this week.",

    /* rewards */
    "ყოველ სწორ პასუხზე":"for every correct answer",
    "ყოველდღე დაბრუნება":"coming back daily",
    "თანდათან რთულდება":"gradually harder",
    "Starter-დან Master-მდე":"from Starter to Master",

    /* faq */
    "რა ასაკისთვისაა NikoLearn?":"What ages is NikoLearn for?",
    "3-დან 12 წლამდე. გაკვეთილები ასაკზე იწყობა: პატარებს ასოების ცნობა და დათვლა, უფროსებს კითხვა, მართლწერა და ლოგიკა.":"From 3 to 12. Lessons adapt to age: little ones get letter recognition and counting, older kids get reading, spelling and logic.",
    "რომელ საგნებსა და ენებს მოიცავს?":"Which subjects and languages does it cover?",
    "ქართული ანბანი, ინგლისური ენა და მათემატიკა, პლუს სიტყვების 13 თემა. ახალი ენები მალე დაემატება.":"The Georgian alphabet, English and math, plus 13 word topics. New languages are coming soon.",
    "დიახ. NikoLearn მუშაობს ოფლაინაც, ხოლო ბავშვის მონაცემები რჩება მხოლოდ თქვენს მოწყობილობაზე, არსად იგზავნება.":"Yes. NikoLearn works offline, and your child's data stays only on your device, nothing is sent anywhere.",
    "რეკლამის გარეშე. ბავშვისთვის გასაყიდი ღილაკები არ არსებობს. მშობლის სივრცე დაცულია PIN-კოდით, რომელშიც ბავშვი ვერ შედის.":"Ad-free. There are no buy buttons aimed at children. The parent space is protected with a PIN the child can't enter.",
    "ახლა უფასოა, რეგისტრაციის გარეშე. უბრალოდ გახსენი და დაიწყე თამაში.":"Right now it's free, no sign-up. Just open it and start playing.",

    /* final cta + footer */
    "ნიკო ელოდება. გახსენი აპი, აირჩიე ბავშვის პროფილი და პირველი თამაში ერთ წუთში იწყება.":"Niko is waiting. Open the app, pick your child's profile and the first game starts in one minute.",
    "🔒 მონაცემები რჩება მოწყობილობაზე · © 2026 NikoLearn · შექმნილია ქართველი ბავშვებისთვის ·":"🔒 Data stays on the device · © 2026 NikoLearn · made for children ·",

    /* age-picker copy */
    "ასოების ცნობა კაშკაშა სურათებითა და ხმით. პირველი ნაბიჯები ანბანში.":"Recognising letters with bright pictures and sound. First steps in the alphabet.",
    "პირველი სიტყვები: ფერები, ცხოველები და რიცხვები, ყველა ხმით.":"First words: colours, animals and numbers, all with sound.",
    "დათვლა 1-დან 10-მდე, ფორმები და შედარება თამაშის სახით.":"Counting 1 to 10, shapes and comparing, as a game.",
    "ცხოველები და ფერები დიდი, კაშკაშა სურათებით.":"Animals and colours with big, bright pictures.",
    "კითხვა და წერა: მარცვლები, მარტივი სიტყვები და პირველი წინადადებები.":"Reading and writing: syllables, simple words and first sentences.",
    "ყოველდღიური სიტყვები და ფრაზები მისალმებიდან გრძნობებამდე, გამოთქმით.":"Everyday words and phrases from greetings to feelings, with pronunciation.",
    "შეკრება, გამოკლება და თანმიმდევრობები ნაბიჯ-ნაბიჯ.":"Addition, subtraction and sequences, step by step.",
    "საკვები, ბუნება და ყოველდღიური საგნები ახალ თემებში.":"Food, nature and everyday objects in new topics.",
    "სწრაფი კითხვა, მართლწერა და უფრო რთული სიტყვები.":"Faster reading, spelling and harder words.",
    "ცოცხალი დიალოგები და ფრაზები რეალური საუბრისთვის.":"Lively dialogues and phrases for real conversation.",
    "ამოცანები, ლოგიკა და დროზე ფიქრი უფრო მაღალ დონეზე.":"Word problems, logic and timed thinking at a higher level.",
    "13 თემა, მრავალფეროვანი და უფრო რთული ლექსიკით.":"13 topics, varied and with richer vocabulary."
  };
  for(var k in LANDING){ if(!(k in MAP)) MAP[k]=LANDING[k]; }

  /* ── pattern rules for dynamic strings (only used when L==='en') ── */
  var PATTERNS=[
    [/^(\d+)\s*წლის$/, function(m){return m[1]+' yrs';}],
    [/^(.+?)\s*წლის$/, function(m){return m[1]+' yrs';}],
    [/^(.+?)-ს წაშლა$/, function(m){return 'Delete '+m[1];}],
    [/^პროფილის წაშლა$/, function(){return 'Delete profile';}],
    [/^ყოჩაღ,\s*(.+?)!$/, function(m){return 'Well done, '+m[1]+'!';}],
    [/^(.+?),\s*კიდევ ცადე!$/, function(m){return m[1]+', try again!';}],
    [/^(.+?),\s*შესანიშნავია! 🌟$/, function(m){return m[1]+', brilliant! 🌟';}],
    [/^(.+?),\s*კარგად მიდიხარ! 💪$/, function(m){return m[1]+", you're doing great! 💪";}],
    [/^(.+?),\s*ისწავლე ახალი! 📚$/, function(m){return m[1]+', you learned something new! 📚';}],
    [/^(.+?),\s*ყოველი ცდა = წინსვლა! 🌱$/, function(m){return m[1]+', every try is progress! 🌱';}],
    [/^სწავლა · (\d+)\/(\d+)$/, function(m){return 'Learn · '+m[1]+'/'+m[2];}],
    [/^ისწავლე · (\d+)\/(\d+)$/, function(m){return 'Learn · '+m[1]+'/'+m[2];}],
    [/^შემდეგ დონემდე:\s*(\d+)\s*სიტყვა$/, function(m){return m[1]+' words to next level';}],
    [/^(\d+)\s*სიტყვა$/, function(m){return m[1]+' words';}],
    [/^(\d+)\s*ფრაზა$/, function(m){return m[1]+' phrases';}],
    [/^მაქსიმალური დონე! 🎉$/, function(){return 'Top level! 🎉';}],
    [/^(.+?)მ\s*(\d+)\s*🪙\s*მოაგროვა!$/, function(m){return m[1]+' collected '+m[2]+' 🪙!';}],
    [/^(.+?)\s*—\s*პროფილის წაშლა$/, function(m){return m[1]+' — delete profile';}],
    [/^🎉\s*გაჯობე გუშინს!\s*(\d+)\s*→\s*(\d+)$/, function(m){return '🎉 Beat yesterday! '+m[1]+' → '+m[2];}],
    [/^🤝\s*გუშინდელი გაიმეორე:\s*(\d+)$/, function(m){return '🤝 Matched yesterday: '+m[1];}],
    [/^💪\s*გუშინ\s*(\d+)\s*გქონდა\s*—\s*ხვალ აჯობებ!$/, function(m){return '💪 Yesterday you had '+m[1]+' — beat it tomorrow!';}],
    [/^🚀\s*ახალი დონე გაიხსნა:\s*(.+)$/, function(m){return '🚀 New level unlocked: '+m[1];}],
    [/^დონე\s*(\d+)$/, function(m){return 'Level '+m[1];}],
    [/^(\d+)\s*ასო$/, function(m){return m[1]+' letters';}],
    [/^(\d+)\s*თემა$/, function(m){return m[1]+' topics';}],
    [/^(\d+)\s*\/\s*(\d+)\s*კითხვა$/, function(m){return m[1]+' / '+m[2]+' questions';}]
  ];

  function toEn(raw){
    if(raw==null) return raw;
    var s=String(raw);
    var lead=(s.match(/^\s*/)||[''])[0], trail=(s.match(/\s*$/)||[''])[0];
    var core=s.trim().replace(/\s+/g,' ');
    if(core==='') return raw;
    if(MAP[core]!=null) return lead+MAP[core]+trail;
    for(var i=0;i<PATTERNS.length;i++){ var m=core.match(PATTERNS[i][0]); if(m) return lead+PATTERNS[i][1](m)+trail; }
    return raw; // fallback: keep Georgian
  }
  window.t_en=toEn;

  /* ── apply / restore across a DOM subtree ── */
  function walkText(root,fn){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    var n,arr=[]; while((n=w.nextNode()))arr.push(n);
    arr.forEach(fn);
  }
  function applyLang(root){
    if(window.UILANG!=='en')return;
    root=root||document.body; if(!root)return;
    walkText(root,function(node){
      var v=node.nodeValue; if(!v||!v.trim())return;
      var en=toEn(v);
      if(en!==v){ if(node.__ka==null)node.__ka=v; node.nodeValue=en; }
    });
    ['placeholder','aria-label','title'].forEach(function(attr){
      root.querySelectorAll('['+attr+']').forEach(function(el){
        var v=el.getAttribute(attr); if(!v||!v.trim())return;
        var en=toEn(v);
        if(en!==v){ if(el.getAttribute('data-ka-'+attr)==null)el.setAttribute('data-ka-'+attr,v); el.setAttribute(attr,en); }
      });
    });
  }
  function restoreKa(root){
    root=root||document.body; if(!root)return;
    walkText(root,function(node){ if(node.__ka!=null){node.nodeValue=node.__ka;node.__ka=null;} });
    ['placeholder','aria-label','title'].forEach(function(attr){
      root.querySelectorAll('[data-ka-'+attr+']').forEach(function(el){
        el.setAttribute(attr,el.getAttribute('data-ka-'+attr)); el.removeAttribute('data-ka-'+attr);
      });
    });
  }
  window.applyLang=applyLang;
  window.restoreKa=restoreKa;

  function scope(){ return document.querySelector('.device')||document.body; }
  function switchLang(l){
    l=(l==='en')?'en':'ka';
    if(l===window.UILANG){return;}
    window.UILANG=l; persist();
    try{document.documentElement.lang=l;}catch(e){}
    if(l==='en')applyLang(document.body); else restoreKa(document.body);
    updateToggle();
    try{window.dispatchEvent(new Event('niko-lang-change'));}catch(e){}
  }
  window.setUILang=switchLang;

  /* ── floating language toggle (one button, all screens) ── */
  function updateToggle(){
    var b=document.getElementById('langtgl'); if(!b)return;
    b.textContent=(window.UILANG==='en')?'ქარ':'EN';
    b.setAttribute('aria-label',(window.UILANG==='en')?'Switch to Georgian':'Switch to English');
  }
  function mountToggle(){
    if(document.getElementById('langtgl'))return;
    var host=document.querySelector('.nav .wrap')||document.querySelector('.device')||document.body;
    var b=document.createElement('button');
    b.id='langtgl'; b.type='button';
    var onNav=!!document.querySelector('.nav .wrap');
    b.style.cssText=onNav
      ? 'margin-left:10px;border:1.5px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:6px 12px;font:600 .82rem/1 inherit;cursor:pointer;opacity:.85'
      : 'position:absolute;top:8px;right:8px;z-index:60;border:none;background:rgba(0,0,0,.16);color:#fff;border-radius:999px;padding:5px 11px;font:700 .76rem/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)';
    b.onclick=function(){ switchLang(window.UILANG==='en'?'ka':'en'); };
    host.appendChild(b);
    updateToggle();
  }

  function boot(){
    mountToggle();
    if(window.UILANG==='en')applyLang(document.body);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
