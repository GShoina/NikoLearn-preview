/* NikoLearn — Tweaks panel (vanilla; implements host edit-mode protocol) */
(function(){
  const DEF = window.__NIKO_DEFAULTS || {aesthetic:'sunlit', aiRole:'companion'};
  let values = {...DEF};
  // remember the chosen theme across sessions
  try{ const _t = localStorage.getItem('niko_theme'); if(_t) values.aesthetic = _t; }catch(e){}
  window.NIKO_TWEAKS = values;
  // bottom-nav theme button: cycle the visual themes and persist the choice
  const THEME_CYCLE = ['sunlit','playground','calm'];
  window.cycleTheme = function(){
    let i = THEME_CYCLE.indexOf(values.aesthetic); i = (i+1) % THEME_CYCLE.length;
    values = {...values, aesthetic: THEME_CYCLE[i]};
    try{ localStorage.setItem('niko_theme', THEME_CYCLE[i]); }catch(e){}
    apply();
    try{ if(window.toast) toast('🎨 '+THEME_CYCLE[i]); }catch(e){}
  };

  function apply(){
    document.documentElement.setAttribute('data-theme', values.aesthetic);
    window.NIKO_TWEAKS = values;
    window.dispatchEvent(new CustomEvent('niko-tweak',{detail:values}));
  }
  function setTweak(key,val){
    values = {...values,[key]:val};
    apply();
    window.parent.postMessage({type:'__edit_mode_set_keys',edits:{[key]:val}},location.origin);
    paint();
  }

  // ── panel DOM ──
  const style=document.createElement('style');
  style.textContent=`
  #nikotweaks{position:fixed;right:18px;bottom:18px;width:266px;z-index:9999;display:none;
    font-family:'Noto Sans Georgian',system-ui,sans-serif;color:#2a2433;
    background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border-radius:20px;
    box-shadow:0 12px 40px rgba(40,30,20,.22),0 0 0 1px rgba(0,0,0,.05);padding:16px;cursor:default}
  #nikotweaks.on{display:block;animation:tw .25s cubic-bezier(.2,.8,.2,1)}
  @keyframes tw{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  #nikotweaks .tw-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;cursor:grab}
  #nikotweaks .tw-ttl{font-weight:700;font-size:.92rem;display:flex;align-items:center;gap:7px}
  #nikotweaks .tw-x{border:none;background:#eee;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:.9rem;color:#555}
  #nikotweaks .tw-lbl{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a90a0;margin:12px 2px 7px}
  #nikotweaks .tw-seg{display:flex;gap:5px;background:#f1edf2;border-radius:12px;padding:4px}
  #nikotweaks .tw-seg.col{flex-direction:column}
  #nikotweaks .tw-seg button{flex:1;border:none;background:none;padding:9px 8px;border-radius:9px;cursor:pointer;
    font-family:inherit;font-weight:600;font-size:.82rem;color:#6b6175;transition:all .15s;text-align:center}
  #nikotweaks .tw-seg button.sel{background:#fff;color:#2a2433;box-shadow:0 2px 6px rgba(0,0,0,.1)}
  #nikotweaks .tw-sw{display:flex;gap:6px;align-items:center;justify-content:center;margin-bottom:2px}
  #nikotweaks .tw-sw i{width:13px;height:13px;border-radius:50%;display:inline-block}
  #nikotweaks .tw-desc{font-size:.72rem;color:#8b8294;margin-top:7px;line-height:1.4}`;
  document.head.appendChild(style);

  const panel=document.createElement('div');
  panel.id='nikotweaks';
  document.body.appendChild(panel);

  const AES=[
    {v:'sunlit',name:'Sunlit',cols:['#e8945f','#7fb47e','#e8c45f'],desc:'თბილი, ნაღდი ფურცელი, მშობლისთვის სანდო და ბავშვისთვის მყუდრო.'},
    {v:'playground',name:'Playground',cols:['#e85d4a','#56c08a','#5b9be8'],desc:'კაშკაშა და ენერგიული, პატარებისთვის სათამაშოდ.'},
    {v:'calm',name:'Calm',cols:['#5a7fb5','#6fae8f','#c9a86a'],desc:'რბილი და თანამედროვე, ნაკლებად ბავშვური, უფრო დახვეწილი.'}
  ];
  const AI=[
    {v:'companion',name:'მეგობარი 🦉',desc:'AI მშვიდი დამხმარეა. ჩნდება მოთხოვნით, სითბო პირველ ადგილზე.'},
    {v:'coach',name:'ქოუჩი 🎯',desc:'AI უფრო აქტიურია. თავად სთავაზობს მინიშნებას და ანალიზს.'}
  ];

  function paint(){
    panel.innerHTML=`
      <div class="tw-hd" id="twdrag">
        <div class="tw-ttl">✦ Tweaks</div>
        <button class="tw-x" id="twx">✕</button>
      </div>
      <div class="tw-lbl">ვიზუალური მიმართულება</div>
      <div class="tw-seg col">
        ${AES.map(a=>`<button class="${values.aesthetic===a.v?'sel':''}" data-aes="${a.v}">
          <span class="tw-sw">${a.cols.map(c=>`<i style="background:${c}"></i>`).join('')}</span>${a.name}</button>`).join('')}
      </div>
      <div class="tw-desc">${AES.find(a=>a.v===values.aesthetic).desc}</div>
      <div class="tw-lbl">ნიკოს როლი</div>
      <div class="tw-seg">
        ${AI.map(a=>`<button class="${values.aiRole===a.v?'sel':''}" data-ai="${a.v}">${a.name}</button>`).join('')}
      </div>
      <div class="tw-desc">${AI.find(a=>a.v===values.aiRole).desc}</div>`;
    panel.querySelectorAll('[data-aes]').forEach(b=>b.onclick=()=>setTweak('aesthetic',b.dataset.aes));
    panel.querySelectorAll('[data-ai]').forEach(b=>b.onclick=()=>setTweak('aiRole',b.dataset.ai));
    panel.querySelector('#twx').onclick=dismiss;
    dragify(panel.querySelector('#twdrag'));
  }
  function dragify(handle){
    handle.onmousedown=e=>{
      const r=panel.getBoundingClientRect();const ox=e.clientX-r.left,oy=e.clientY-r.top;
      const move=ev=>{panel.style.left=(ev.clientX-ox)+'px';panel.style.top=(ev.clientY-oy)+'px';
        panel.style.right='auto';panel.style.bottom='auto';};
      const up=()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);};
      window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
    };
  }

  function open(){panel.classList.add('on');paint();}
  function dismiss(){panel.classList.remove('on');window.parent.postMessage({type:'__edit_mode_dismissed'},location.origin);}

  window.addEventListener('message',e=>{
    if(e.origin!==location.origin)return; // SEC-1: reject cross-origin postMessage so a framing page can never open the dev panel
    const t=e&&e.data&&e.data.type;
    if(t==='__activate_edit_mode')open();
    else if(t==='__deactivate_edit_mode')panel.classList.remove('on');
  });
  window.parent.postMessage({type:'__edit_mode_available'},location.origin);
  apply();
})();
