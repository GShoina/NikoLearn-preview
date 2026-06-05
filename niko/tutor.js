/* ═══════════════════════════════════════════════════════════
   NikoLearn — Tutor engine
   Algorithmic, offline, item-specific. Teaches strategy.
   NEVER reveals the answer. Age-adaptive (masho=ka, niko=mixed).
   ═══════════════════════════════════════════════════════════ */
(function(){
  const big=(a,b)=>Math.max(a,b), small=(a,b)=>Math.min(a,b);
  const warm=k=>k?['ერთად შევძლებთ! ','ბრავო, ვცადოთ ერთად. ',''][Math.floor(Math.random()*3)]:'';

  // ── MATH (structured q: {op,a1,a2,seq,step,a}) ──
  function math(q,kid){
    const a1=q.a1,a2=q.a2,op=q.op;
    if(op==='add'){
      const B=big(a1,a2),S=small(a1,a2),nextTen=Math.ceil(B/10)*10,need=nextTen-B;
      const h2 = (!kid&&need>0&&need<S)
        ? `ხერხი „ავაშენოთ ათეული": ${B} + ${need} = ${nextTen}. დარჩა ${S-need}. ახლა ${nextTen} + ${S-need} = ?`
        : (kid?`დაითვალე თითებზე 🖐️: ${B}-ს დაუმატე კიდევ ${S}.`:`დაშალე ერთეულებად და ათეულებად, მერე შეკრიბე.`);
      return {hints:[
        `${warm(kid)}დაიწყე დიდი რიცხვიდან — ${B}. ახლა დაითვალე წინ ${S}-ჯერ: ${B+1}, ${B+2}…`,
        h2
      ], explain:`შეკრება = ორი ჯგუფის გაერთიანება. დიდი რიცხვი ჯერ, პატარა ნაბიჯ-ნაბიჯ დაუმატე. პასუხს თვითონ მიხვდები! 🌟`};
    }
    if(op==='sub'){
      return {hints:[
        `${warm(kid)}${a1}-დან წაიღე ${a2}. დაითვალე უკან: ${a1-1}, ${a1-2}…`,
        `ან იფიქრე პირიქით: ${a2}-ს რამდენი უნდა დაუმატო, რომ ${a1} გამოვიდეს?`
      ], explain:`გამოკლება გვეუბნება „რამდენი დარჩა" ან „რა სხვაობაა". უკან დათვალე ან იპოვე სხვაობა.`};
    }
    if(op==='mul'){
      return {hints:[
        `${warm(kid)}${a1} × ${a2} = ${a1} აღებული ${a2}-ჯერ.`,
        `დაითვალე ${a1}-ობით: ${a1}, ${a1*2}, ${a1*3}… სულ ${a2} ბიჯი.`
      ], explain:`გამრავლება = ერთი რიცხვის რამდენჯერმე შეკრება. ${a1}-ობით დათვლა ყველაზე სწრაფია.`};
    }
    // pattern
    const seq=q.seq||[], step=q.step!=null?q.step:(seq.length>1?seq[1]-seq[0]:1);
    return {hints:[
      `${warm(kid)}შეადარე მეზობელი რიცხვები — რამდენით იცვლება ყოველ ჯერზე?`,
      step>=0?`ყოველ ჯერზე იზრდება ${step}-ით. ბოლო რიცხვს დაუმატე ${step}.`:`ყოველ ჯერზე მცირდება ${Math.abs(step)}-ით. ბოლო რიცხვს გამოაკელი ${Math.abs(step)}.`
    ], explain:`კანონზომიერება = მუდმივი ნაბიჯი. იპოვე ნაბიჯი და გააგრძელე იგივეთი.`};
  }

  // ── VOCABULARY (q:{ka,en,emoji}) ──
  function vocab(q,mode,kid){
    const info=(window.WORD_INDEX&&window.WORD_INDEX[q.en])||q;
    const cat=(info.cat||'').replace(/\s*\p{Emoji}.*$/u,'').trim()||'სიტყვები';
    const catEmoji=((info.cat||'').match(/\p{Emoji}/u)||[''])[0];
    const s=q.en[0], len=q.en.replace(/\s/g,'').length;
    if(mode==='reverse'){ // english shown → pick Georgian meaning
      return {hints:[
        `სიტყვა „${q.en}" ჯგუფიდანაა „${cat}" ${catEmoji}.`,
        `დააკვირდი ${q.emoji} — რა არის ეს ქართულად?`
      ], explain:`ჯერ მოისმინე 🔊 და ამოიცანი ჯგუფი, მერე აირჩიე ქართული სიტყვა.`};
    }
    return {hints:[
      kid?`ეს არის ${cat} ${catEmoji}. დააკვირდი: ${q.emoji}`:`ეს სიტყვა ჯგუფიდანაა „${cat}" ${catEmoji}. სურათი: ${q.emoji}`,
      `ინგლისურად იწყება ბგერით /${s}/ და აქვს ${len} ასო. 🔊`
    ], explain:`დააჭირე 🔊-ს, კარგად მოისმინე და გაიმეორე. ბგერები გეტყვის სწორ სიტყვას — შენ შეგიძლია!`};
  }

  // ── KINGS ENGLISH (q.type) ──
  function kingsEng(q,kid){
    const t=q.type, core=q.a.replace(/^(a |an |the )/i,'');
    if(t==='pic2word')return {hints:[`დააკვირდი სურათს: ${q.emoji}. რა ხედავ?`,`ინგლისური სიტყვა იწყება ბგერით /${core[0]}/.`],explain:`ჯერ ამოიცანი საგანი სურათზე, მერე იპოვე მისი ინგლისური სახელი.`};
    if(t==='translate')return {hints:[`ქართული: „${q.q}". რომელია მთავარი სიტყვა?`,`აირჩიე ვარიანტი, სადაც მთავარი სიტყვა ემთხვევა (ფერი/რიცხვი ცალკე შეამოწმე).`],explain:`თარგმანში ჯერ მთავარი არსებითი სახელი იპოვე, მერე ფერი, რიცხვი ან ზედსართავი.`};
    if(t==='spelling')return {hints:[`წარმოთქვი სიტყვა ნელა, თითო ბგერა.`,`ერთ ვარიანტში ასოა არასწორი — შეადარე ასო-ასო.`],explain:`მართლწერა: დაშალე სიტყვა ბგერებად და თითო ასო შეამოწმე.`};
    if(t==='number')return {hints:[`წაიკითხე რიცხვი: ${q.q}.`,`გაიხსენე რიცხვების სახელები ინგლისურად 1–20.`],explain:`დააკავშირე ციფრი მის ინგლისურ სახელთან.`};
    // grammar
    return {hints:[`ვის ან რას ეხება წინადადება? (I · he · she · they · it?)`,`ზმნა უნდა მოერგოს ქვემდებარეს: I → am, he/she/it → is, you/they → are.`],explain:`გრამატიკაში ქვემდებარე და ზმნა ერთმანეთს უნდა შეეთანხმოს.`};
  }

  // ── KINGS MATH (q.kind, hintA/hintB/step) ──
  function kingsMath(q,kid){
    const k=q.kind,A=q.hintA,B=q.hintB;
    if(k==='add')return {hints:[`ეს შეკრების ამოცანაა. რომელი ორი რიცხვი უნდა შეკრიბო?`,`${A} + ${B}: დაიწყე ${big(A,B)}-დან, დაუმატე ${small(A,B)} ნაბიჯ-ნაბიჯ.`],explain:`ამოცანა → მოქმედება → გამოთვლა. აქ ჯგუფები ერთიანდება, ანუ ვკრებავთ.`};
    if(k==='sub')return {hints:[`რაღაც აიღეს ან დაიკარგა — ეს გამოკლებაა.`,`${A} − ${B}: დაითვალე უკან ${B}-ჯერ ${A}-დან.`],explain:`„დარჩა" ან „წაიღო" = გამოკლება. უკან დათვალე.`};
    if(k==='mul')return {hints:[`აქ ${B} რამდენჯერმე მეორდება — ეს გამრავლებაა.`,`${A} × ${B}: დაითვალე ${B}-ობით ${A}-ჯერ.`],explain:`„თითო X-ით, რამდენიმე ჯგუფი" = გამრავლება.`};
    if(k==='div')return {hints:[`თანაბრად გაყოფა: ${A} გაიყო ${B} ჯგუფად.`,`იპოვე: ${B} × ? = ${A}.`],explain:`თანაბრად დარიგება = გაყოფა. გამრავლების შებრუნებაა.`};
    if(k==='pat'||k==='double')return {hints:[`ეს მიმდევრობაა — იპოვე წესი.`,k==='double'?`ყოველი რიცხვი ორმაგდება (×2).`:(q.step>=0?`ყოველ ჯერზე +${q.step}.`:`ყოველ ჯერზე −${Math.abs(q.step)}.`)],explain:`მიმდევრობაში ერთი და იგივე წესი მეორდება. იპოვე და გააგრძელე.`};
    // logic
    return {hints:[`კარგად წაიკითხე — ზუსტად რას გეკითხება?`,`თითო ვარიანტი ცალკე გამოთვალე, მერე შეადარე.`],explain:`ლოგიკურ ამოცანაში თითო ვარიანტი შეამოწმე, მერე აირჩიე.`};
  }

  function counting(kid){
    return {hints:[`დაითვალე ნელა, თითო-თითო 👆: ერთი… ორი… სამი…`,`კიდევ ერთხელ დათვალე ხმამაღლა.`],explain:`დათვლა ნელა და ხმამაღლა ყველაზე ზუსტია.`};
  }

  // ── ALPHABET (q:{l,w,e}) ──
  function alpha(q){
    return {hints:[
      `დააჭირე 🔊-ს და კარგად მოისმინე — როგორ იწყება სიტყვა?`,
      `სიტყვა „${q.w}" ${q.e}. პირველი ბგერა გეტყვის სწორ ასოს.`
    ], explain:`ჯერ მოისმინე სიტყვა, იპოვე პირველი ბგერა, მერე აირჩიე იგივე ასო. შენ შეგიძლია! 🌟`};
  }

  // ── A: comparison / skip-counting / shapes ──
  function compareT(q){
    return {hints:[
      `შეადარე: ${q?q.a:'პირველი'} და ${q?q.b:'მეორე'} — რომელია უფრო დიდი?`,
      `ნიშნის ღია მხარე დიდი რიცხვისკენ იყურება. „>" = მეტი, „<" = ნაკლები, „=" = ტოლი.`
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
      `დააკვირდი ფორმას — რამდენი გვერდი და კუთხე აქვს?`,
      `მრგვალია → წრე. სამი კუთხე → სამკუთხედი. ოთხი თანაბარი გვერდი → კვადრატი.`
    ], explain:`დაითვალე გვერდები და კუთხეები — ისინი გეტყვის ფიგურის სახელს.`};
  }

  function moneyT(q){return {hints:['დაითვალე მონეტები: ერთმანეთს მიუმატე მათი რიცხვები.','დაიწყე დიდი მონეტიდან და დაუმატე დანარჩენი.'],explain:'მონეტების ჯამი = ფულის რაოდენობა. შეკრიბე ყველა მონეტა.'};}
  function clockT(q){return {hints:['პატარა ისარი აჩვენებს საათს, დიდი ისარი — წუთებს.','დიდი ისარი 12-ზე = ზუსტი საათი; 6-ზე = ნახევარი (:30).'],explain:'საათის ისარი = საათი, წუთის ისარი = წუთები. იპოვე სად დგას ისრები.'};}

  // ── public ──
  window.Tutor = {
    build(ctx){
      const kid=ctx.profile==='masho';
      let r;
      switch(ctx.subject){
        case 'math': r=math(ctx.q,kid); break;
        case 'kings-eng': r=kingsEng(ctx.q,kid); break;
        case 'kings-math': r=kingsMath(ctx.q,kid); break;
        case 'counting': r=counting(kid); break;
        case 'alpha': r=alpha(ctx.q); break;
        case 'compare': r=compareT(ctx.q); break;
        case 'skip': r=skipT(ctx.q); break;
        case 'shapes': r=shapesT(ctx.q); break;
        case 'money': r=moneyT(ctx.q); break;
        case 'clock': r=clockT(ctx.q); break;
        default: r=vocab(ctx.q,ctx.mode,kid);
      }
      const mathish=(ctx.subject==='math'||ctx.subject==='kings-math'||ctx.subject==='compare'||ctx.subject==='skip'||ctx.subject==='shapes'||ctx.subject==='money'||ctx.subject==='clock');
      r.name = ctx.aiRole==='coach'
        ? (ctx.subject==='alpha'?'ბუ · ანბანის მასწავლებელი':mathish?'ბუ · მათემატიკის მასწავლებელი':'ბუ · ინგლისურის მასწავლებელი')
        : 'ბუ · შენი მეგობარი';
      return r;
    }
  };
})();
