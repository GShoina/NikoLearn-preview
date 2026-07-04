/* ═══════════════════════════════════════════════════════════
   NikoLearn, Tutor engine
   Algorithmic, offline, item-specific. Teaches strategy.
   NEVER reveals the answer. Age-adaptive (masho=ka, niko=mixed).
   ═══════════════════════════════════════════════════════════ */
(function(){
  const big=(a,b)=>Math.max(a,b), small=(a,b)=>Math.min(a,b);
  const WARMS=['ერთად შევძლებთ! ','ბრავო, ვცადოთ ერთად. ','არ დანებდე, შენ შეგიძლია. ','კარგი ცდა იყო, ვცადოთ კიდევ. ','მოდი, ერთად ვიფიქროთ. ',''];
  const warm=k=>k?WARMS[Math.floor(Math.random()*WARMS.length)]:'';

  // Guardrail (AITUTOR-01): a count-on preview must NEVER print the answer.
  // Show at most 2 leading steps and always STOP >=1 step short of the total,
  // so for small operands (5-2, 6+1, 4x2) the terminal answer is never revealed.
  function countSeq(start,delta,steps){
    const show=Math.min(2,steps-1);
    if(show<=0) return '';               // answer is only 1 step away -> print no numbers
    const a=[]; for(let i=1;i<=show;i++) a.push(start+delta*i);
    return a.join(', ')+'…';
  }
  function mulSeq(base,times){
    const show=Math.min(2,times-1);
    if(show<=0) return '';
    const a=[]; for(let i=1;i<=show;i++) a.push(base*i);
    return a.join(', ')+'…';
  }

  // ── MATH (structured q: {op,a1,a2,seq,step,a}) ──
  function math(q,kid){
    const a1=q.a1,a2=q.a2,op=q.op;
    if(op==='add'){
      const B=big(a1,a2),S=small(a1,a2),nextTen=Math.ceil(B/10)*10,need=nextTen-B;
      // units/tens now DEFINED inline (owner 2026-07-01: a child may not know what ერთეული/ათეული are).
      const h2 = (!kid&&need>0&&need<S)
        ? `ხერხი „ავაშენოთ ათეული": ${B} + ${need} = ${nextTen}. დარჩა ${S-need}. ახლა ${nextTen} + ${S-need} = ?`
        : (kid?`დაითვალე თითებზე 🖐️: ${B}-ს დაუმატე კიდევ ${S}.`:`<span class="r-lead">დაშალე ათეულებად და ერთეულებად:</span><span class="r-item">ათეული = ათ-ათი (10, 20, 30)</span><span class="r-item">ერთეული = თითო (1, 2, 3)</span><span class="r-end">ჯერ ათეულები შეკრიბე, მერე ერთეულები.</span>`);
      const aseq=countSeq(B,1,S);
      return {say:'შეკრებაში დაიწყე დიდი რიცხვიდან და დაითვალე წინ, თითო-თითო. თუ გინდა, დიდი რიცხვი დაშალე ათეულებად და ერთეულებად.', hints:[
        aseq?`${warm(kid)}დაიწყე დიდი რიცხვიდან, ${B}. ახლა დაითვალე წინ ${S}-ჯერ: ${aseq}`:`${warm(kid)}დაიწყე დიდი რიცხვიდან, ${B}. ახლა დაითვალე წინ ${S}-ჯერ, თითო-თითო.`,
        h2
      ], explain:`შეკრება = ორი ჯგუფის გაერთიანება. დიდი რიცხვი ჯერ, პატარა ნაბიჯ-ნაბიჯ დაუმატე. პასუხს თვითონ მიხვდები! 🌟`};
    }
    if(op==='sub'){
      const sseq=countSeq(a1,-1,a2);
      return {say:'გამოკლებაში დიდი რიცხვიდან დაითვალე უკან. ან იფიქრე, რამდენი უნდა დაუმატო პატარას, რომ დიდი გამოვიდეს.', hints:[
        sseq?`${warm(kid)}${a1}-დან წაიღე ${a2}. დაითვალე უკან: ${sseq}`:`${warm(kid)}${a1}-დან წაიღე ${a2}. დაითვალე უკან, თითო ბიჯით.`,
        `ან იფიქრე პირიქით: ${a2}-ს რამდენი უნდა დაუმატო, რომ ${a1} გამოვიდეს?`
      ], explain:`გამოკლება გვეუბნება „რამდენი დარჩა" ან „რა სხვაობაა". უკან დათვალე ან იპოვე სხვაობა.`};
    }
    if(op==='mul'){
      const mseq=mulSeq(a1,a2);
      return {say:'გამრავლება ერთი რიცხვის რამდენჯერმე შეკრებაა. დაითვალე ჯგუფებად, თითო რიცხვით.', hints:[
        `${warm(kid)}${a1} × ${a2} = ${a1} აღებული ${a2}-ჯერ.`,
        mseq?`დაითვალე ${a1}-ობით: ${mseq} სულ ${a2} ბიჯი.`:`დაითვალე ${a1}-ობით, სულ ${a2} ბიჯი.`
      ], explain:`გამრავლება = ერთი რიცხვის რამდენჯერმე შეკრება. ${a1}-ობით დათვლა ყველაზე სწრაფია.`};
    }
    // division: teach equal-sharing + inverse-of-multiplication (was missing → fell to the sequence
    // default and told the child to find a "+1 rule" on 10÷2; audit 2026-07-04 GAP-1).
    if(op==='div'){
      return {say:'გაყოფა კითხულობს: რამდენჯერ ეტევა პატარა რიცხვი დიდში. იფიქრე გამრავლებით, პირიქით.', hints:[
        `${warm(kid)}${a1} თანაბრად დაყავი ${a2} ჯგუფად. რამდენი მოხვდება თითო ჯგუფში?`,
        `იფიქრე პირიქით: ${a2}-ზე რამდენი უნდა გავამრავლო, რომ ${a1} გამოვიდეს? ${a2} × ? = ${a1}`
      ], explain:`გაყოფა = თანაბრად დანაწილება, გამრავლების საპირისპირო. იპოვე რამდენჯერ ეტევა ${a2} რიცხვში ${a1}.`};
    }
    // picture-substitution puzzle: teach the reasoning (substitute known values → find the unknown)
    if(op==='pic'){
      return {say:'ჯერ ის ფასები ნახე, რომლებიც უკვე იცი. მერე ჩაანაცვლე და უცნობი იპოვე.', hints:[
        `${warm(kid)}ჯერ ის ნივთები ნახე, რომელთა ფასი უკვე იცი.`,
        `ჩაანაცვლე ცნობილი ფასები და იპოვე უცნობი: დააკავშირე რა რის ტოლია.`
      ], explain:`სურათების თავსატეხი: თუ ზოგი ფასი იცი, დანარჩენს ლოგიკით იპოვი. ეს პატარა ალგებრაა! 🧠`};
    }
    // multi-step (3-term, e.g. 9 + 9 − 8): teach left-to-right, one step at a time
    if(op==='multi'){
      return {say:'გამოთვალე ნაბიჯ-ნაბიჯ, მარცხნიდან მარჯვნივ. ჯერ პირველი ორი რიცხვი, მერე მესამე.', hints:[
        `${warm(kid)}გამოთვალე ნაბიჯ-ნაბიჯ, მარცხნიდან მარჯვნივ.`,
        `ჯერ პირველი ორი რიცხვი გამოთვალე, მერე მიღებულ შედეგს მესამე მოქმედება გაუკეთე.`
      ], explain:`რამდენიმე მოქმედება ერთად: მარცხნიდან მარჯვნივ, თითო ნაბიჯად დაშალე.`};
    }
    // pattern
    const seq=q.seq||[];
    // doubling (×2) pattern: step is null and each number is twice the previous one
    if(q.step==null && seq.length>2 && seq[1]===seq[0]*2 && seq[2]===seq[1]*2){
      return {say:'იპოვე წესი: რა იცვლება ყოველ ბიჯზე. მერე იგივე წესი გაიმეორე გამოტოვებულ ადგილას.', hints:[
        `${warm(kid)}დააკვირდი: ყოველი რიცხვი წინაზე ორჯერ მეტია.`,
        `გამოტოვებული რიცხვი მის მარცხენა მეზობელზე ორჯერ მეტია (×2).`
      ], explain:`აქ ნაბიჯი მუდმივი არ არის: ყოველ ჯერზე რიცხვი ორმაგდება (×2).`};
    }
    const step=q.step!=null?q.step:(seq.length>1?seq[1]-seq[0]:1);
    return {say:'იპოვე წესი: რა იცვლება ყოველ ბიჯზე. მერე იგივე წესი გაიმეორე გამოტოვებულ ადგილას.', hints:[
      `${warm(kid)}შეადარე მეზობელი რიცხვები, რამდენით იცვლება ყოველ ჯერზე?`,
      step>=0?`ყოველ ჯერზე იზრდება ${step}-ით: გამოტოვებულ ადგილზე მარცხენა მეზობელს დაუმატე ${step}.`:`ყოველ ჯერზე მცირდება ${Math.abs(step)}-ით: გამოტოვებულ ადგილზე მარცხენა მეზობელს გამოაკელი ${Math.abs(step)}.`
    ], explain:`კანონზომიერება = ნაბიჯი ან წესი. იპოვე წესი და იპოვე გამოტოვებული რიცხვი.`};
  }

  // ── VOCABULARY (q:{ka,en,emoji}) ──
  function vocab(q,mode,kid){
    // guard: reading / digit / build modes fall through to this default tutor, but their question objects
    // have no `.en`, so `q.en[0]` below would throw (owner deep-QA 2026-06-13: owl help crashed there).
    // Give a safe, generic encouraging hint instead of crashing.
    if(!q || typeof q.en!=='string'){
      return {hints:[
        'დააკვირდი სურათსა და მინიშნებას, რას ხედავ? 👀',
        'მოისმინე ხმა 🔊 და ნელა გაიმეორე.'
      ], explain:'დააკვირდი, მოისმინე და სცადე. შენ შეგიძლია! 🌟'};
    }
    const info=(window.WORD_INDEX&&window.WORD_INDEX[q.en])||q;
    const cat=(info.cat||'').replace(/\s*\p{Emoji}.*$/u,'').trim()||'სიტყვები';
    const catEmoji=((info.cat||'').match(/\p{Emoji}/u)||[''])[0];
    const s=q.en[0], len=q.en.replace(/\s/g,'').length;
    if(mode==='reverse'){ // english shown → pick Georgian meaning
      return {hints:[
        `სიტყვა „${q.en}" ჯგუფიდანაა „${cat}" ${catEmoji}.`,
        `დააკვირდი ${q.emoji}, რა არის ეს ქართულად?`
      ], explain:`ჯერ მოისმინე 🔊 და ამოიცანი ჯგუფი, მერე აირჩიე ქართული სიტყვა.`};
    }
    return {hints:[
      kid?`ეს არის ${cat} ${catEmoji}. დააკვირდი: ${q.emoji}`:`ეს სიტყვა ჯგუფიდანაა „${cat}" ${catEmoji}. სურათი: ${q.emoji}`,
      `ინგლისურად იწყება ბგერით /${s}/ და აქვს ${len} ასო. 🔊`
    ], explain:`დააჭირე 🔊-ს, კარგად მოისმინე და გაიმეორე. ბგერები გეტყვის სწორ სიტყვას, შენ შეგიძლია!`};
  }

  // ── KINGS ENGLISH (q.type) ──
  function kingsEng(q,kid){
    const t=q.type, core=String(q.a==null?'':q.a).replace(/^(a |an |the )/i,''); // CM-1: q.a may be a number (defensive) — never call .replace on a non-string
    if(t==='pic2word')return {hints:[`დააკვირდი სურათს: ${q.emoji}. რას ხედავ?`,`ინგლისური სიტყვა იწყება ბგერით /${core[0]}/.`],explain:`ჯერ ამოიცანი საგანი სურათზე, მერე იპოვე მისი ინგლისური სახელი.`};
    if(t==='translate')return {hints:[`ქართული: „${q.q}". რომელია მთავარი სიტყვა?`,`აირჩიე ვარიანტი, სადაც მთავარი სიტყვა ემთხვევა (ფერი/რიცხვი ცალკე შეამოწმე).`],explain:`თარგმანში ჯერ მთავარი არსებითი სახელი იპოვე, მერე ფერი, რიცხვი ან ზედსართავი.`};
    if(t==='spelling')return {hints:[`წარმოთქვი სიტყვა ნელა, თითო ბგერა.`,`ერთ ვარიანტში ასოა არასწორი, შეადარე ასო-ასო.`],explain:`მართლწერა: დაშალე სიტყვა ბგერებად და თითო ასო შეამოწმე.`};
    if(t==='number')return {hints:[`წაიკითხე რიცხვი: ${q.q}.`,`გაიხსენე რიცხვების სახელები ინგლისურად 1–20.`],explain:`დააკავშირე ციფრი მის ინგლისურ სახელთან.`};
    // grammar
    return {hints:[`ვის ან რას ეხება წინადადება? (I · he · she · they · it?)`,`<span class="r-lead">ზმნა ქვემდებარეს მოერგოს:</span><span class="r-item">I → am</span><span class="r-item">he / she / it → is</span><span class="r-item">you / they → are</span>`],explain:`გრამატიკაში ქვემდებარე და ზმნა ერთმანეთს უნდა შეეთანხმოს.`};
  }

  // ── KINGS MATH (q.kind, hintA/hintB/step) ──
  function kingsMath(q,kid){
    const k=q.kind,A=q.hintA,B=q.hintB;
    if(k==='add')return {hints:[`ეს შეკრების ამოცანაა. რომელი ორი რიცხვი უნდა შეკრიბო?`,`${A} + ${B}: დაიწყე ${big(A,B)}-დან, დაუმატე ${small(A,B)} ნაბიჯ-ნაბიჯ.`],explain:`ამოცანა → მოქმედება → გამოთვლა. აქ ჯგუფები ერთიანდება, ანუ ვკრებთ.`};
    if(k==='sub')return {hints:[`რაღაც აიღეს ან დაიკარგა, ეს გამოკლებაა.`,`${A} − ${B}: დაითვალე უკან ${B}-ჯერ ${A}-დან.`],explain:`„დარჩა" ან „წაიღო" = გამოკლება. უკან დათვალე.`};
    if(k==='mul')return {hints:[`აქ ${B} რამდენჯერმე მეორდება, ეს გამრავლებაა.`,`${A} × ${B}: დაითვალე ${B}-ობით ${A}-ჯერ.`],explain:`„თითო X-ით, რამდენიმე ჯგუფი" = გამრავლება.`};
    if(k==='div')return {hints:[`თანაბრად გაყოფა: ${A} გაიყო ${B} ჯგუფად.`,`იპოვე: ${B} × ? = ${A}.`],explain:`თანაბრად დარიგება = გაყოფა. გამრავლების შებრუნებაა.`};
    if(k==='pat'||k==='double')return {hints:[`ეს მიმდევრობაა, იპოვე წესი.`,k==='double'?`ყოველი რიცხვი ორმაგდება (×2).`:(q.step>=0?`ყოველ ჯერზე +${q.step}.`:`ყოველ ჯერზე −${Math.abs(q.step)}.`)],explain:`მიმდევრობაში ერთი და იგივე წესი მეორდება. იპოვე და გააგრძელე.`};
    // logic
    return {hints:[`კარგად წაიკითხე, ზუსტად რას გეკითხება?`,`თითო ვარიანტი ცალკე გამოთვალე, მერე შეადარე.`],explain:`ლოგიკურ ამოცანაში თითო ვარიანტი შეამოწმე, მერე აირჩიე.`};
  }

  function counting(kid){
    return {hints:[`დაითვალე ნელა, თითო-თითო 👆: ერთი… ორი… სამი…`,`კიდევ ერთხელ დათვალე ხმამაღლა.`],explain:`დათვლა = ყოველ ნივთს თითო რიცხვს ვეუბნებით: ერთი, ორი, სამი. ბოლო ნათქვამი რიცხვი გვეუბნება, რამდენია სულ.`};
  }

  // ── ALPHABET (q:{l,w,e}) ──
  function alpha(q){
    return {hints:[
      `დააჭირე 🔊-ს და კარგად მოისმინე, როგორ იწყება სიტყვა?`,
      `სიტყვა „${q.w}" ${q.e}. პირველი ბგერა გეტყვის სწორ ასოს.`
    ], explain:`ჯერ მოისმინე სიტყვა, იპოვე პირველი ბგერა, მერე აირჩიე იგივე ასო. შენ შეგიძლია! 🌟`};
  }

  // ── A: comparison / skip-counting / shapes ──
  function compareT(q){
    return {hints:[
      `შეადარე: ${q?q.a:'პირველი'} და ${q?q.b:'მეორე'}, რომელია უფრო დიდი?`,
      `<span class="r-lead">ნიშნის ღია მხარე დიდი რიცხვისკენ იყურება.</span><span class="r-item">„>" = მეტი</span><span class="r-item">„<" = ნაკლები</span><span class="r-item">„=" = ტოლი</span>`
    ], explain:`დიდი რიცხვი მარცხნივ → „>"; პატარა მარცხნივ → „<"; ერთნაირი → „=".`};
  }
  function skipT(q){
    const st=q&&q.step?q.step:5;
    return {hints:[
      `ყოველ ნაბიჯზე ერთი და იგივე რიცხვი ემატება: ${st}.`,
      `ბოლო რიცხვს დაუმატე ${st} და მიიღებ პასუხს.`
    ], explain:`${st}-ობით დათვლა: ${st}, ${st*2}, ${st*3}… ყოველ ჯერზე ${st} ემატება.`};
  }
  function shapesT(q){
    return {hints:[
      `დააკვირდი ფორმას, რამდენი გვერდი და კუთხე აქვს?`,
      `<span class="r-lead">დაითვალე გვერდები და კუთხეები:</span><span class="r-item">მრგვალი → წრე</span><span class="r-item">3 კუთხე → სამკუთხედი</span><span class="r-item">4 თანაბარი გვერდი → კვადრატი</span>`
    ], explain:`დაითვალე გვერდები და კუთხეები, ისინი გეტყვის ფიგურის სახელს.`};
  }

  function moneyT(q){return {hints:['დაითვალე მონეტები: ერთმანეთს მიუმატე მათი რიცხვები.','დაიწყე დიდი მონეტიდან და დაუმატე დანარჩენი.'],explain:'მონეტების ჯამი = ფულის რაოდენობა. შეკრიბე ყველა მონეტა.'};}
  // ── REASONING strands (pattern / rebus / model / triangle) — Kings-math. FIXED, voiceable ka phrases
  // (each has an edge-tts clip so the owl actually SPEAKS), strategy-only so the answer is never revealed.
  // The item-specific worked rule (q.rule) stays in the round's own 2nd-miss LEARN reveal, not here.
  function reasoning(q){
    return {hints:[
      'დააკვირდი რიცხვებს და იპოვე წესი. რა იცვლება ყოველ ბიჯზე?',
      'როცა წესს იპოვი, იგივე წესი გამოტოვებულ ადგილას გამოიყენე.'
    ], explain:'კანონზომიერებაში ერთი წესი მეორდება. იპოვე ეს წესი და გამოტოვებული რიცხვი თვითონ გამოვა.'};
  }
  function clockT(q){return {hints:['პატარა ისარი აჩვენებს საათს, დიდი ისარი, წუთებს.','<span class="r-lead">დიდი ისრის მიხედვით:</span><span class="r-item">12-ზე = ზუსტი საათი</span><span class="r-item">6-ზე = ნახევარი (:30)</span>'],explain:'საათის ისარი = საათი, წუთის ისარი = წუთები. იპოვე სად დგას ისრები.'};}

  // Georgian reading / word-building (read/sent/rtext/build/shead): subject-appropriate hints that make
  // NO reference to a q field (these modes' q shapes vary) so it never renders "undefined" (owner 2026-07-04).
  function reading(){
    return {hints:[
      'ნელა წაიკითხე, ასო-ასო. ჯერ თითო ბგერა თქვი, მერე შეაერთე.',
      'დააკვირდი პირველ ასოს, მერე მთელ სიტყვას. ხმამაღლა თქვი.'
    ], explain:'კითხვა = ასოებს ბგერებად აქცევ და აერთებ. ნელა დაიწყე, მერე უფრო სწრაფად.'};
  }
  // Fixed voiceable ka phrase per subject (INV-3: the owl speaks even when the hint TEXT is dynamic and
  // has no clip). math ops set their own `say` inline; this fills the rest. Keys == audio-manifest keys.
  const SUBJECT_SAY={
    vocab:'დააკვირდი სურათს და მოისმინე. ბგერები გეტყვის სწორ სიტყვას.',
    alpha:'მოისმინე, როგორ იწყება სიტყვა. პირველი ბგერა გეტყვის სწორ ასოს.',
    reading:'ნელა წაიკითხე, ასო-ასო. ჯერ თითო ბგერა თქვი, მერე შეაერთე მთელ სიტყვად.',
    'kings-eng':'დააკვირდი და მოისმინე. იპოვე მთავარი სიტყვა, მერე შეამოწმე ფერი და რიცხვი.',
    counting:'დაითვალე ნელა, თითო-თითო, ხმამაღლა.',
    compare:'შეადარე ორი რიცხვი. ნიშნის ღია მხარე დიდი რიცხვისკენ იყურება.',
    skip:'ყოველ ნაბიჯზე ერთი და იგივე რიცხვი ემატება. იპოვე ეს ნაბიჯი.',
    shapes:'დაითვალე ფიგურის გვერდები და კუთხეები. ისინი გეტყვის სახელს.',
    money:'დაითვალე მონეტები. დაიწყე დიდიდან და დაუმატე დანარჩენი.',
    clock:'პატარა ისარი აჩვენებს საათს, დიდი ისარი წუთებს.'
  };
  // ── public ──
  window.Tutor = {
    build(ctx){
      const kid=ctx.profile==='masho';
      let r;
      if(ctx.mode==='listen-yle'){
        r={hints:['კიდევ ერთხელ მოუსმინე 🔊. რამდენი საგანია და რა საგანია?','ჯერ რიცხვი დაიჭირე, მერე საგანი. მაგ. „two dogs" = ორი ძაღლი.'],explain:'მოუსმინე ბოლომდე, დათვალე საგნები და აირჩიე სურათი, რომელიც ზუსტად ემთხვევა ნათქვამს.',say:'მოუსმინე ყურადღებით. ჯერ დაითვალე რამდენია, მერე იპოვე რა საგანია.'};
        r.name = ctx.aiRole==='coach' ? 'ბუ · ინგლისურის მასწავლებელი' : 'ბუ · შენი მეგობარი';
        return r;
      }
      if(ctx.mode==='yesno'){
        r={hints:['დააკვირდი სურათს. წინადადება ემთხვევა იმას, რასაც ხედავ?','თუ ემთხვევა → ✅ კი. თუ არა → ❌ არა.'],explain:'წაიკითხე წინადადება, შეადარე სურათს. სიმართლეა → კი, არა → არა.',say:'დააკვირდი სურათს. თუ წინადადება ემთხვევა, თქვი კი. თუ არა, თქვი არა.'};
        r.name = ctx.aiRole==='coach' ? 'ბუ · ინგლისურის მასწავლებელი' : 'ბუ · შენი მეგობარი';
        return r;
      }
      if(ctx.mode==='speak'){
        r={hints:['ჯერ მოუსმინე კითხვას 🔊, მერე ხმამაღლა უპასუხე ინგლისურად.','სრული წინადადებით თქვი. მაგ. „It is a dog. It is brown."'],explain:'ლაპარაკი ვარჯიშია: ხმამაღლა თქვი პასუხი ინგლისურად. სწორი თუ არასწორი არ ფასდება, მთავარია ცადო.',say:'მოუსმინე კითხვას, მერე ხმამაღლა უპასუხე ინგლისურად. მთავარია სცადო.'};
        r.name = ctx.aiRole==='coach' ? 'ბუ · ინგლისურის მასწავლებელი' : 'ბუ · შენი მეგობარი';
        return r;
      }
      if(ctx.mode==='story'){
        r={hints:['ხელახლა წაიკითხე ამბავი ნელა, ან მოუსმინე 🔊.','იპოვე ის წინადადება, სადაც პასუხია. კითხვის მთავარ სიტყვას მიჰყევი.'],explain:'ჯერ ამბავი წაიკითხე, მერე კითხვა. პასუხი თვითონ ტექსტშია დამალული.',say:'ჯერ წაიკითხე ამბავი, მერე კითხვა. პასუხი თვითონ ტექსტშია.'};
        r.name = ctx.aiRole==='coach' ? 'ბუ · ინგლისურის მასწავლებელი' : 'ბუ · შენი მეგობარი';
        return r;
      }
      switch(ctx.subject){
        case 'math': r=math(ctx.q,kid); break;
        case 'kings-eng': r=kingsEng(ctx.q,kid); break;
        case 'kings-math': r=kingsMath(ctx.q,kid); break;
        case 'counting': r=counting(kid); break;
        case 'alpha': r=alpha(ctx.q); break;
        case 'reading': r=reading(); break;
        case 'compare': r=compareT(ctx.q); break;
        case 'skip': r=skipT(ctx.q); break;
        case 'shapes': r=shapesT(ctx.q); break;
        case 'money': r=moneyT(ctx.q); break;
        case 'clock': r=clockT(ctx.q); break;
        case 'pattern': r=reasoning(ctx.q); break;
        default: r=vocab(ctx.q,ctx.mode,kid);
      }
      if(r && !r.say && SUBJECT_SAY[ctx.subject]) r.say = SUBJECT_SAY[ctx.subject];
      const mathish=(ctx.subject==='math'||ctx.subject==='kings-math'||ctx.subject==='compare'||ctx.subject==='skip'||ctx.subject==='shapes'||ctx.subject==='money'||ctx.subject==='clock'||ctx.subject==='pattern');
      r.name = ctx.aiRole==='coach'
        ? (ctx.subject==='alpha'?'ბუ · ანბანის მასწავლებელი':ctx.subject==='reading'?'ბუ · კითხვის მასწავლებელი':mathish?'ბუ · მათემატიკის მასწავლებელი':'ბუ · ინგლისურის მასწავლებელი')
        : 'ბუ · შენი მეგობარი';
      return r;
    }
  };
})();
