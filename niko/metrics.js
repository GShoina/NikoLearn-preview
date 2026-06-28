/* ─────────────────────────────────────────────────────────────────────────
   metrics.js — ON-DEVICE difficulty/engagement instrument (owner 2026-06-28).

   WHY: we kept improving content/voice without measuring whether items sit in
   the healthy first-attempt success band (70-85%, per the readability rubric)
   or whether children replay. This measures that — 100% on-device, no backend,
   no PII, no network. It reads/writes ONLY localStorage. Privacy identical to
   the rest of the app: we store a coarse mode name + counts + a day bucket,
   never a child's name, answer, or any identifier.

   first-attempt success per round = (uniqueQuestions - distinctMissed) / uniqueQuestions
     uniqueQuestions = game.shields at finish (one shield per question finally correct)
     distinctMissed  = game.missMap.size   (questions missed at least once)
   Each round is one record. Many rounds of the same mode = a replay/engagement signal.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  var KEY = 'niko_metrics', CAP = 400;
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function store(a) { try { if (a.length > CAP) a = a.slice(a.length - CAP); localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function day() { try { return Math.floor(Date.now() / 86400000); } catch (e) { return 0; } }

  // record one finished round. n = unique questions, miss = distinct missed. All defensive; never throws.
  function logRound(mode, n, miss, durMs, lv) {
    try {
      n = +n || 0; miss = +miss || 0; if (n <= 0) return;            // nothing to measure
      if (miss > n) miss = n;
      var a = load();
      a.push({ t: day(), m: String(mode || '?').slice(0, 24), n: n, x: miss, d: Math.round((+durMs || 0) / 1000), l: +lv || 0 });
      store(a);
    } catch (e) {}
  }

  // aggregate by mode → {mode, rounds, q, firstPct, band, secsPerRound}
  function summary() {
    var a = load(), by = {};
    a.forEach(function (r) {
      var k = r.m; if (!by[k]) by[k] = { mode: k, rounds: 0, q: 0, miss: 0, secs: 0 };
      var g = by[k]; g.rounds++; g.q += r.n; g.miss += r.x; g.secs += (r.d || 0);
    });
    var out = Object.keys(by).map(function (k) {
      var g = by[k], first = g.q ? Math.round((g.q - g.miss) / g.q * 100) : null;
      var band = first == null ? '—' : (first < 70 ? 'hard' : (first > 85 ? 'easy' : 'ok'));
      return { mode: g.mode, rounds: g.rounds, q: g.q, firstPct: first, band: band, secsPerRound: g.rounds ? Math.round(g.secs / g.rounds) : 0 };
    });
    out.sort(function (x, y) { return y.rounds - x.rounds; });
    var totQ = a.reduce(function (s, r) { return s + r.n; }, 0), totMiss = a.reduce(function (s, r) { return s + r.x; }, 0);
    return { modes: out, totalRounds: a.length, overallFirstPct: totQ ? Math.round((totQ - totMiss) / totQ * 100) : null };
  }

  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }

  // compact owner-only readout (HTML). Shown in the parent dashboard only on owner-flagged devices.
  function renderHTML() {
    try {
      var s = summary(); if (!s.totalRounds) return '';
      var col = { hard: 'var(--red)', easy: 'var(--sky-d)', ok: 'var(--green-d)', '—': 'var(--faint)' };
      var rows = s.modes.map(function (m) {
        var c = col[m.band] || 'var(--ink)';
        var tag = m.band === 'hard' ? 'ძნელი' : m.band === 'easy' ? 'მსუბუქი' : m.band === 'ok' ? 'სწორი' : '—';
        return '<tr><td style="padding:2px 6px">' + m.mode + '</td>'
          + '<td style="padding:2px 6px;text-align:center">' + m.rounds + '</td>'
          + '<td style="padding:2px 6px;text-align:center;color:' + c + ';font-weight:700">' + (m.firstPct == null ? '—' : m.firstPct + '%') + '</td>'
          + '<td style="padding:2px 6px;text-align:center;color:' + c + '">' + tag + '</td></tr>';
      }).join('');
      return '<div style="margin-top:12px;padding:10px;border:1px dashed var(--line);border-radius:10px;font-size:.82rem">'
        + '<div style="font-weight:700;margin-bottom:4px">🔧 ხარისხის მეტრიკა (owner, on-device) · სამიზნე 70-85%</div>'
        + '<div style="color:var(--faint);margin-bottom:6px">პირველი-ცდის წარმატება რეჟიმზე. &lt;70% = ძნელი, &gt;85% = მსუბუქი. სულ ' + s.totalRounds + ' რაუნდი · საერთო ' + (s.overallFirstPct == null ? '—' : s.overallFirstPct + '%') + '.</div>'
        + '<table style="width:100%;border-collapse:collapse"><tr style="color:var(--muted)"><td style="padding:2px 6px">რეჟიმი</td><td style="padding:2px 6px;text-align:center">რაუნდი</td><td style="padding:2px 6px;text-align:center">1-ცდა</td><td style="padding:2px 6px;text-align:center">შეფასება</td></tr>'
        + rows + '</table></div>';
    } catch (e) { return ''; }
  }

  window.Metrics = { logRound: logRound, summary: summary, reset: reset, renderHTML: renderHTML };
})();
