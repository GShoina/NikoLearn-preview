/* NikoLearn landing — interactions */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ── sticky nav shadow ── */
  var nav = document.querySelector('.nav');
  var onScroll = function(){ nav.classList.toggle('stuck', window.scrollY > 12); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* ── mobile menu ── */
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle) toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
  if (links) links.addEventListener('click', function(e){ if(e.target.tagName==='A') links.classList.remove('open'); });

  /* ── phone screen carousel ── */
  var screens = Array.prototype.slice.call(document.querySelectorAll('.pscreen'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.phone-dots i'));
  var idx = 0, timer = null;
  function go(n){
    idx = (n + screens.length) % screens.length;
    screens.forEach(function(s,i){ s.classList.toggle('on', i===idx); });
    dots.forEach(function(d,i){ d.classList.toggle('on', i===idx); });
  }
  function play(){ if(reduce) return; timer = setInterval(function(){ go(idx+1); }, 3000); }
  function reset(){ clearInterval(timer); play(); }
  dots.forEach(function(d,i){ d.addEventListener('click', function(){ go(i); reset(); }); });
  if (screens.length){ go(0); play(); }

  /* ── scroll reveal ── */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); countMaybe(en.target); io.unobserve(en.target); }
    });
  }, {threshold:0.18, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ── count up ── */
  function countMaybe(scope){
    scope.querySelectorAll('[data-count]').forEach(function(el){
      if(el.dataset.done) return; el.dataset.done='1';
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      if(reduce){ el.textContent = target + suffix; return; }
      var dur = 1100, t0 = null;
      function step(ts){
        if(!t0) t0 = ts;
        var p = Math.min((ts - t0)/dur, 1);
        var e = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ── duplicate marquee track for seamless loop ── */
  var track = document.querySelector('.marquee .track');
  if(track){ track.innerHTML += track.innerHTML; }

  /* ── age picker: swap age-appropriate focus copy on the subject cards ── */
  var AGE_COPY = {
    '3-5': {
      alphabet:'ასოების ცნობა კაშკაშა სურათებითა და ხმით. პირველი ნაბიჯები ანბანში.',
      english:'პირველი სიტყვები: ფერები, ცხოველები და რიცხვები, ყველა ხმით.',
      math:'დათვლა 1-დან 10-მდე, ფორმები და შედარება თამაშის სახით.',
      words:'ცხოველები და ფერები დიდი, კაშკაშა სურათებით.'
    },
    '6-8': {
      alphabet:'კითხვა და წერა: მარცვლები, მარტივი სიტყვები და პირველი წინადადებები.',
      english:'ყოველდღიური სიტყვები და ფრაზები მისალმებიდან გრძნობებამდე, გამოთქმით.',
      math:'შეკრება, გამოკლება და თანმიმდევრობები ნაბიჯ-ნაბიჯ.',
      words:'საკვები, ბუნება და ყოველდღიური საგნები ახალ თემებში.'
    },
    '9-12': {
      alphabet:'სწრაფი კითხვა, მართლწერა და უფრო რთული სიტყვები.',
      english:'ცოცხალი დიალოგები და ფრაზები რეალური საუბრისთვის.',
      math:'ამოცანები, ლოგიკა და დროზე ფიქრი უფრო მაღალ დონეზე.',
      words:'13 თემა, მრავალფეროვანი და უფრო რთული ლექსიკით.'
    }
  };
  var ageChips = Array.prototype.slice.call(document.querySelectorAll('.age-chip'));
  function setAge(age){
    var map = AGE_COPY[age]; if(!map) return;
    ageChips.forEach(function(c){
      var on = c.dataset.age === age;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Object.keys(map).forEach(function(key){
      var p = document.querySelector('[data-subject="'+key+'"]');
      if(!p) return;
      p.style.opacity = '0';
      setTimeout(function(){ p.textContent = map[key]; p.style.opacity = '1'; }, reduce?0:160);
    });
  }
  ageChips.forEach(function(c){
    c.setAttribute('aria-pressed', c.classList.contains('on') ? 'true' : 'false');
    c.addEventListener('click', function(){ setAge(c.dataset.age); });
  });
  if(ageChips.length){ setAge('6-8'); }

  /* ── Hand-drawn animated wavy underline on the hero accent word ──
     Draws in from the left, then gently "boils" (re-sketches) so it feels alive. */
  function buildSketchUnderline(){
    var el = document.querySelector('.hero h1 .hl');
    if(!el) return;
    var old = el.querySelector('.sketch-underline');
    if(old) old.remove();

    var SVGNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'sketch-underline');
    svg.setAttribute('viewBox', '0 0 300 24');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    // three slightly different wavy strokes — cycling between them = the "alive" boil
    var frames = [
      'M3 13 C 45 9, 72 17, 112 12 S 188 18, 232 11 S 286 16, 297 13',
      'M3 14 C 48 11, 70 16, 110 13 S 184 17, 236 12 S 288 15, 297 12',
      'M3 12 C 44 8, 74 18, 114 12 S 190 19, 230 11 S 285 17, 297 14'
    ];
    var path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', frames[0]);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--primary)');
    path.setAttribute('stroke-width', '3.4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('pathLength', '100');

    if(!reduce){
      // boil: morph the stroke shape on a loop
      var anim = document.createElementNS(SVGNS, 'animate');
      anim.setAttribute('attributeName', 'd');
      anim.setAttribute('values', frames[0]+';'+frames[1]+';'+frames[2]+';'+frames[0]);
      anim.setAttribute('dur', '0.9s');
      anim.setAttribute('repeatCount', 'indefinite');
      anim.setAttribute('calcMode', 'spline');
      anim.setAttribute('keyTimes', '0;0.33;0.66;1');
      anim.setAttribute('keySplines', '.4 0 .6 1;.4 0 .6 1;.4 0 .6 1');
      path.appendChild(anim);
    }

    svg.appendChild(path);
    el.appendChild(svg);

    // draw-in from the left using pathLength normalisation
    path.style.strokeDasharray = '100';
    path.style.strokeDashoffset = reduce ? '0' : '100';
    path.style.transition = 'none';
    // next frame: animate the offset to 0
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        path.style.transition = 'stroke-dashoffset .7s cubic-bezier(.2,.8,.25,1)';
        path.style.strokeDashoffset = '0';
      });
    });
  }

  function firstDraw(){ setTimeout(buildSketchUnderline, reduce?0:550); }
  if(document.readyState === 'complete') firstDraw();
  else window.addEventListener('load', firstDraw);

  /* recompute on resize (width changes) and recolour on theme change */
  var rt;
  window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(buildSketchUnderline, 200); }, {passive:true});
  window.addEventListener('niko-theme-change', buildSketchUnderline);
  /* ── FAQ accordion: mirror native [open] into an .is-open class so transform/animation
     recompute reliably (Chromium skips restyling <details> content transforms on toggle) ── */
  document.querySelectorAll('.fq').forEach(function(d){
    function sync(){ d.classList.toggle('is-open', d.open); }
    sync();
    d.addEventListener('toggle', sync);
  });
})();
