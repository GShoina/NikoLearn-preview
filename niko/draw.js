/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: draw.js — „ხატვა" Draw & Color creative canvas (v1.234, enriched v1.235)
   New play-activity (alongside movement/talk). A real HTML5-canvas paint tool for kids:
   brush · 🌈 rainbow brush · eraser · fill(bucket) · ⭐ sticker stamps · undo · clear · colour palette ·
   brush sizes · 14 colour-in templates (animals/nature/things) · save.
   PRIVACY: everything stays in the canvas on the device. Nothing is stored or sent. "Save" = a local
   PNG download the child can show a parent. Pointer events → works with finger (touch) and mouse.
   ═══════════════════════════════════════════════════════════ */
let _dCanvas=null,_dCtx=null,_dW=0,_dH=0,_dDpr=1;
let _dColor='#e23b3b',_dSize=14,_dTool='brush',_dDrawing=false,_dLast=null,_dUndo=[];
let _dStamp='⭐',_dHue=0;
const DRAW_COLORS=['#000000','#ffffff','#e23b3b','#f2894c','#e8c45f','#3aa66e','#4d97d1','#6b63b5','#d65aa0','#8a5a3a','#5bc8e8','#ff8fab'];
const DRAW_SIZES=[6,14,28];
const DRAW_STAMPS=['⭐','❤️','🌈','🦋','🌸','🐞','😊','🌟','🍀','☁️','🐱','🚗'];

function _hexRgb(h){const m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h);return m?{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)}:null;}

/* ── colour-in templates: thick-outline line art the child fills with the bucket/brush. Grouped by theme. ── */
const DRAW_TEMPLATES={
  sun:{ico:'☀️',draw(c,w,h){const x=w/2,y=h/2,r=Math.min(w,h)*0.2;c.beginPath();c.arc(x,y,r,0,7);c.stroke();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.beginPath();c.moveTo(x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8));c.lineTo(x+Math.cos(a)*(r+r*0.7),y+Math.sin(a)*(r+r*0.7));c.stroke();}}},
  cloud:{ico:'☁️',draw(c,w,h){const x=w/2,y=h/2,u=Math.min(w,h)*0.12;
    c.beginPath();c.arc(x-u*1.4,y,u,Math.PI*0.5,Math.PI*1.5);c.arc(x-u*0.5,y-u*0.9,u*1.1,Math.PI,Math.PI*2);
    c.arc(x+u*0.9,y-u*0.7,u*0.95,Math.PI*1.2,Math.PI*2);c.arc(x+u*1.8,y,u,Math.PI*1.5,Math.PI*0.5);c.closePath();c.stroke();}},
  flower:{ico:'🌸',draw(c,w,h){const x=w/2,y=h/2-h*0.05,r=Math.min(w,h)*0.1;
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;c.beginPath();c.arc(x+Math.cos(a)*r*1.6,y+Math.sin(a)*r*1.6,r,0,7);c.stroke();}
    c.beginPath();c.arc(x,y,r*0.9,0,7);c.stroke();
    c.beginPath();c.moveTo(x,y+r*1.6);c.lineTo(x,y+h*0.28);c.stroke();}},
  tree:{ico:'🌳',draw(c,w,h){const x=w/2,y=h/2,r=Math.min(w,h)*0.2;
    c.beginPath();c.arc(x,y-r*0.5,r,0,7);c.stroke();
    c.strokeRect(x-r*0.18,y+r*0.4,r*0.36,r*0.9);}},
  star:{ico:'⭐',draw(c,w,h){const x=w/2,y=h/2,R=Math.min(w,h)*0.3,r=R*0.42;c.beginPath();
    for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?r:R;const px=x+Math.cos(a)*rad,py=y+Math.sin(a)*rad;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.stroke();}},
  heart:{ico:'❤️',draw(c,w,h){const x=w/2,y=h/2,s=Math.min(w,h)*0.32;c.beginPath();c.moveTo(x,y+s*0.7);
    c.bezierCurveTo(x-s*1.3,y-s*0.4,x-s*0.4,y-s*0.9,x,y-s*0.25);
    c.bezierCurveTo(x+s*0.4,y-s*0.9,x+s*1.3,y-s*0.4,x,y+s*0.7);c.stroke();}},
  cat:{ico:'🐱',draw(c,w,h){const x=w/2,y=h/2,r=Math.min(w,h)*0.2;
    c.beginPath();c.moveTo(x-r*0.7,y-r*0.6);c.lineTo(x-r*1.05,y-r*1.25);c.lineTo(x-r*0.25,y-r*0.85);c.stroke();
    c.beginPath();c.moveTo(x+r*0.7,y-r*0.6);c.lineTo(x+r*1.05,y-r*1.25);c.lineTo(x+r*0.25,y-r*0.85);c.stroke();
    c.beginPath();c.arc(x,y,r,0,7);c.stroke();
    c.beginPath();c.arc(x-r*0.4,y-r*0.1,r*0.1,0,7);c.stroke();c.beginPath();c.arc(x+r*0.4,y-r*0.1,r*0.1,0,7);c.stroke();
    c.beginPath();c.moveTo(x,y+r*0.1);c.lineTo(x,y+r*0.28);c.stroke();
    c.beginPath();c.moveTo(x-r*0.15,y+r*0.28);c.lineTo(x+r*0.15,y+r*0.28);c.stroke();}},
  fish:{ico:'🐟',draw(c,w,h){const x=w/2,y=h/2,rx=Math.min(w,h)*0.28,ry=rx*0.62;
    c.beginPath();c.ellipse(x-rx*0.2,y,rx,ry,0,0,7);c.stroke();
    c.beginPath();c.moveTo(x+rx*0.7,y);c.lineTo(x+rx*1.5,y-ry*0.7);c.lineTo(x+rx*1.5,y+ry*0.7);c.closePath();c.stroke();
    c.beginPath();c.arc(x-rx*0.7,y-ry*0.2,ry*0.16,0,7);c.stroke();}},
  butterfly:{ico:'🦋',draw(c,w,h){const x=w/2,y=h/2,u=Math.min(w,h)*0.16;
    c.beginPath();c.ellipse(x,y,u*0.12,u*0.9,0,0,7);c.stroke();
    c.beginPath();c.ellipse(x-u*0.9,y-u*0.55,u*0.8,u*0.55,0.5,0,7);c.stroke();
    c.beginPath();c.ellipse(x+u*0.9,y-u*0.55,u*0.8,u*0.55,-0.5,0,7);c.stroke();
    c.beginPath();c.ellipse(x-u*0.75,y+u*0.6,u*0.55,u*0.45,-0.4,0,7);c.stroke();
    c.beginPath();c.ellipse(x+u*0.75,y+u*0.6,u*0.55,u*0.45,0.4,0,7);c.stroke();}},
  ladybug:{ico:'🐞',draw(c,w,h){const x=w/2,y=h/2,r=Math.min(w,h)*0.2;
    c.beginPath();c.arc(x,y,r,0,7);c.stroke();
    c.beginPath();c.moveTo(x,y-r);c.lineTo(x,y+r);c.stroke();
    c.beginPath();c.arc(x,y-r*1.1,r*0.45,0,7);c.stroke();
    [[-0.45,-0.2],[0.45,-0.2],[-0.5,0.35],[0.5,0.35]].forEach(d=>{c.beginPath();c.arc(x+d[0]*r,y+d[1]*r,r*0.16,0,7);c.stroke();});}},
  house:{ico:'🏠',draw(c,w,h){const s=Math.min(w,h)*0.5,x=w/2-s/2,y=h/2-s/4;
    c.strokeRect(x,y,s,s*0.8);
    c.beginPath();c.moveTo(x-s*0.08,y);c.lineTo(x+s/2,y-s*0.45);c.lineTo(x+s+s*0.08,y);c.stroke();
    c.strokeRect(x+s*0.4,y+s*0.4,s*0.2,s*0.4);
    c.strokeRect(x+s*0.1,y+s*0.12,s*0.2,s*0.2);}},
  car:{ico:'🚗',draw(c,w,h){const s=Math.min(w,h)*0.5,x=w/2-s/2,y=h/2;
    c.beginPath();c.moveTo(x,y);c.lineTo(x,y-s*0.22);c.lineTo(x+s*0.25,y-s*0.22);c.lineTo(x+s*0.38,y-s*0.42);c.lineTo(x+s*0.7,y-s*0.42);c.lineTo(x+s*0.82,y-s*0.22);c.lineTo(x+s,y-s*0.22);c.lineTo(x+s,y);c.closePath();c.stroke();
    c.beginPath();c.arc(x+s*0.25,y,s*0.1,0,7);c.stroke();c.beginPath();c.arc(x+s*0.75,y,s*0.1,0,7);c.stroke();}},
  rocket:{ico:'🚀',draw(c,w,h){const x=w/2,y=h/2,u=Math.min(w,h)*0.2;
    c.beginPath();c.moveTo(x,y-u*1.5);c.quadraticCurveTo(x+u*0.7,y-u*0.4,x+u*0.55,y+u*0.8);c.lineTo(x-u*0.55,y+u*0.8);c.quadraticCurveTo(x-u*0.7,y-u*0.4,x,y-u*1.5);c.stroke();
    c.beginPath();c.arc(x,y-u*0.3,u*0.28,0,7);c.stroke();
    c.beginPath();c.moveTo(x-u*0.55,y+u*0.4);c.lineTo(x-u*0.95,y+u*0.95);c.lineTo(x-u*0.55,y+u*0.8);c.stroke();
    c.beginPath();c.moveTo(x+u*0.55,y+u*0.4);c.lineTo(x+u*0.95,y+u*0.95);c.lineTo(x+u*0.55,y+u*0.8);c.stroke();}},
  balloon:{ico:'🎈',draw(c,w,h){const x=w/2,y=h/2-h*0.05,r=Math.min(w,h)*0.17;
    c.beginPath();c.ellipse(x,y,r*0.85,r,0,0,7);c.stroke();
    c.beginPath();c.moveTo(x-r*0.1,y+r);c.lineTo(x+r*0.1,y+r);c.lineTo(x,y+r*1.18);c.closePath();c.stroke();
    c.beginPath();c.moveTo(x,y+r*1.18);c.quadraticCurveTo(x+r*0.3,y+r*1.8,x-r*0.15,y+h*0.26);c.stroke();}},
  icecream:{ico:'🍦',draw(c,w,h){const x=w/2,y=h/2,u=Math.min(w,h)*0.15;
    c.beginPath();c.moveTo(x-u*0.7,y);c.lineTo(x+u*0.7,y);c.lineTo(x,y+u*1.6);c.closePath();c.stroke();
    c.beginPath();c.arc(x-u*0.35,y-u*0.35,u*0.55,0,7);c.stroke();
    c.beginPath();c.arc(x+u*0.35,y-u*0.35,u*0.55,0,7);c.stroke();
    c.beginPath();c.arc(x,y-u*0.95,u*0.55,0,7);c.stroke();}}
};

function openDraw(){
  if(window.Analytics)Analytics.screen('draw');
  if(game)game.subj=null;
  const cols=DRAW_COLORS.map(c=>`<button class="dw-color${c===_dColor?' on':''}${c==='#ffffff'?' light':''}" style="background:${c}" onclick="dwPickColor(this,'${c}')" aria-label="ფერი"></button>`).join('');
  const rainbow=`<button class="dw-color rainbow${_dColor==='rainbow'?' on':''}" onclick="dwPickColor(this,'rainbow')" aria-label="ცისარტყელა ფუნჯი"></button>`;
  const sizes=DRAW_SIZES.map(s=>`<button class="dw-size${s===_dSize?' on':''}" onclick="dwPickSize(this,${s})" aria-label="ფუნჯის ზომა"><span style="width:${s}px;height:${s}px"></span></button>`).join('');
  const tmpls=Object.keys(DRAW_TEMPLATES).map(k=>`<button class="dw-tmpl" onclick="dwTemplate('${k}')" aria-label="გასაფერადებელი">${DRAW_TEMPLATES[k].ico}</button>`).join('');
  const stamps=DRAW_STAMPS.map(s=>`<button class="dw-stamp${s===_dStamp?' on':''}" onclick="dwPickStamp(this,'${s}')" aria-label="შტამპი">${s}</button>`).join('');
  render(`<div class="screen draw-screen">
    <div class="dw-top">
      <button class="iconbtn" onclick="dwExit()" aria-label="უკან">&lt;</button>
      <div class="dw-tools">
        <button class="dw-tool on" id="dwT-brush" onclick="dwTool(this,'brush')" aria-label="ფუნჯი">✏️</button>
        <button class="dw-tool" id="dwT-fill" onclick="dwTool(this,'fill')" aria-label="შევსება">🪣</button>
        <button class="dw-tool" id="dwT-stamp" onclick="dwTool(this,'stamp')" aria-label="შტამპი">⭐</button>
        <button class="dw-tool" id="dwT-eraser" onclick="dwTool(this,'eraser')" aria-label="საშლელი">🧽</button>
        <button class="dw-tool" onclick="dwUndo()" aria-label="ერთი ნაბიჯით უკან">↩️</button>
        <button class="dw-tool" onclick="dwClear()" aria-label="გასუფთავება">🗑️</button>
      </div>
      <button class="dw-save" onclick="dwSave()">📷 შენახვა</button>
    </div>
    <div class="dw-canvas-wrap"><canvas id="dwCanvas"></canvas></div>
    <div class="dw-tmpls" aria-label="გასაფერადებელი შაბლონები">${tmpls}</div>
    <div class="dw-stamps" id="dwStampRow" aria-label="შტამპები">${stamps}</div>
    <div class="dw-palette">
      <div class="dw-colors">${cols}${rainbow}</div>
      <div class="dw-sizes">${sizes}</div>
    </div>
  </div>`,false);
  setTimeout(dwInit,40);
}
function dwInit(){
  _dCanvas=document.getElementById('dwCanvas'); if(!_dCanvas)return;
  const wrap=_dCanvas.parentElement, r=wrap.getBoundingClientRect();
  _dW=Math.max(1,Math.round(r.width)); _dH=Math.max(1,Math.round(r.height));
  _dDpr=Math.min(window.devicePixelRatio||1,2);
  _dCanvas.width=Math.round(_dW*_dDpr); _dCanvas.height=Math.round(_dH*_dDpr);
  _dCanvas.style.width=_dW+'px'; _dCanvas.style.height=_dH+'px';
  _dCtx=_dCanvas.getContext('2d',{willReadFrequently:true}); _dCtx.scale(_dDpr,_dDpr);
  _dCtx.lineCap='round'; _dCtx.lineJoin='round';
  _dCtx.fillStyle='#fff'; _dCtx.fillRect(0,0,_dW,_dH);
  _dUndo=[]; dwPush();
  _dCanvas.style.touchAction='none';
  _dCanvas.onpointerdown=dwDown; _dCanvas.onpointermove=dwMove;
  _dCanvas.onpointerup=dwUp; _dCanvas.onpointercancel=dwUp;
}
function _dPos(e){const r=_dCanvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function dwDown(e){ if(!_dCtx)return; try{_dCanvas.setPointerCapture(e.pointerId);}catch(x){}
  const p=_dPos(e);
  if(_dTool==='fill'){ dwFill(p.x,p.y); dwPush(); return; }
  if(_dTool==='stamp'){ dwStampAt(p.x,p.y); dwPush(); return; }
  _dDrawing=true; _dLast=p; dwStroke(p,p); }
function dwMove(e){ if(!_dDrawing)return; const p=_dPos(e); dwStroke(_dLast,p); _dLast=p; }
function dwUp(){ if(_dDrawing){ _dDrawing=false; dwPush(); } }
function dwStroke(a,b){
  if(_dTool==='eraser'){ _dCtx.strokeStyle='#ffffff'; _dCtx.lineWidth=_dSize*2; }
  else if(_dColor==='rainbow'){ _dHue=(_dHue+8)%360; _dCtx.strokeStyle='hsl('+_dHue+',90%,55%)'; _dCtx.lineWidth=_dSize; }
  else { _dCtx.strokeStyle=_dColor; _dCtx.lineWidth=_dSize; }
  _dCtx.beginPath(); _dCtx.moveTo(a.x,a.y); _dCtx.lineTo(b.x,b.y); _dCtx.stroke(); }
function dwStampAt(x,y){ const sz=_dSize*2.4+18; _dCtx.font=sz+'px serif'; _dCtx.textAlign='center'; _dCtx.textBaseline='middle'; try{_dCtx.fillText(_dStamp,x,y);}catch(e){} }
function dwPush(){ try{ _dUndo.push(_dCtx.getImageData(0,0,_dCanvas.width,_dCanvas.height)); if(_dUndo.length>12)_dUndo.shift(); }catch(e){} }
function dwUndo(){ if(_dUndo.length<2)return; _dUndo.pop(); _dCtx.putImageData(_dUndo[_dUndo.length-1],0,0); }
function dwClear(){ if(!_dCtx)return; _dCtx.fillStyle='#fff'; _dCtx.fillRect(0,0,_dW,_dH); dwPush(); }
function dwTemplate(k){ const t=DRAW_TEMPLATES[k]; if(!t||!_dCtx)return;
  _dCtx.fillStyle='#fff'; _dCtx.fillRect(0,0,_dW,_dH);
  _dCtx.strokeStyle='#222'; _dCtx.lineWidth=4; _dCtx.beginPath(); t.draw(_dCtx,_dW,_dH); dwPush(); }
/* scanline flood fill (bucket) — efficient + bounded, works on the device-pixel buffer */
function dwFill(cssX,cssY){
  if(!_dCtx)return; const w=_dCanvas.width,h=_dCanvas.height;
  const img=_dCtx.getImageData(0,0,w,h),d=img.data;
  const sx=Math.floor(cssX*_dDpr),sy=Math.floor(cssY*_dDpr);
  if(sx<0||sy<0||sx>=w||sy>=h)return;
  const si=(sy*w+sx)*4,tr=d[si],tg=d[si+1],tb=d[si+2],ta=d[si+3];
  const fc=(_dColor==='rainbow')?{r:255,g:120,b:60}:_hexRgb(_dColor); if(!fc)return;
  if(Math.abs(tr-fc.r)<2&&Math.abs(tg-fc.g)<2&&Math.abs(tb-fc.b)<2&&ta===255)return;
  const tol=40, match=i=>Math.abs(d[i]-tr)<=tol&&Math.abs(d[i+1]-tg)<=tol&&Math.abs(d[i+2]-tb)<=tol&&Math.abs(d[i+3]-ta)<=tol;
  const set=i=>{d[i]=fc.r;d[i+1]=fc.g;d[i+2]=fc.b;d[i+3]=255;};
  const stack=[[sx,sy]];
  while(stack.length){
    const c=stack.pop(); let x=c[0]; const y=c[1];
    if(!match((y*w+x)*4))continue;
    let lx=x; while(lx>0&&match((y*w+(lx-1))*4))lx--;
    let rx=x; while(rx<w-1&&match((y*w+(rx+1))*4))rx++;
    let up=false,dn=false;
    for(let xx=lx;xx<=rx;xx++){
      set((y*w+xx)*4);
      if(y>0){ const m=match(((y-1)*w+xx)*4); if(m&&!up){stack.push([xx,y-1]);up=true;} else if(!m)up=false; }
      if(y<h-1){ const m=match(((y+1)*w+xx)*4); if(m&&!dn){stack.push([xx,y+1]);dn=true;} else if(!m)dn=false; }
    }
  }
  _dCtx.putImageData(img,0,0);
}
function dwPickColor(el,c){ _dColor=c;
  if(_dTool==='eraser'||_dTool==='stamp'||(c==='rainbow'&&_dTool==='fill'))dwTool(document.getElementById('dwT-brush'),'brush');
  const box=el&&el.parentElement; if(box)[...box.children].forEach(b=>b.classList.remove('on')); if(el)el.classList.add('on'); }
function dwPickSize(el,s){ _dSize=s; const box=el&&el.parentElement; if(box)[...box.children].forEach(b=>b.classList.remove('on')); if(el)el.classList.add('on'); }
function dwPickStamp(el,s){ _dStamp=s; dwTool(document.getElementById('dwT-stamp'),'stamp');
  const box=el&&el.parentElement; if(box)[...box.children].forEach(b=>b.classList.remove('on')); if(el)el.classList.add('on'); }
function dwTool(el,t){ _dTool=t; ['dwT-brush','dwT-fill','dwT-stamp','dwT-eraser'].forEach(id=>{const b=document.getElementById(id);if(b)b.classList.remove('on');});
  if(el&&el.id)el.classList.add('on'); else { const b=document.getElementById('dwT-'+t); if(b)b.classList.add('on'); } }
function dwSave(){ try{ const a=document.createElement('a'); a.download='niko-naxati.png'; a.href=_dCanvas.toDataURL('image/png'); a.click(); if(typeof praise==='function')praise(); }catch(e){} }
function dwExit(){ _dUndo=[]; _dCanvas=null; _dCtx=null; if(typeof profile!=='undefined'&&profile)selectProfile(profile); else goHome(); }
