/**
 * NikoLearn — privacy-minimized telemetry, aggregated before storage (Cloudflare Worker, free tier).
 * Routes: POST /v1/t (collect) · GET /v1/stats?k=SECRET (owner-only read, returns aggregate JSON;
 *   optional &prefix= day-slice) · GET /v1/backfill?k=SECRET (owner-only one-time NB-23 metadata
 *   migration, chunked by cursor).
 *   · POST /v1/feedback (a parent VOLUNTARILY sends a contact message — SEPARATE consented channel,
 *     stores the parent's own words + optional contact so we can reply) · GET /v1/feedback?k=SECRET
 *     (owner-only read of those messages). This channel is NOT telemetry: the PII-free aggregate
 *     guarantees below apply to /v1/t only. Child LEARNING data is never sent here; the parent opts
 *     in by writing and submitting the form. fb| rows are excluded from the /v1/stats aggregate read.
 * Binding: KV namespace "NIKO_T" (aggregate counters only). Secret: env.STATS_KEY (set at deploy).
 *
 * IP FRAMING (truthful — GPT review pt.2): Cloudflare transiently processes network metadata as
 * our infrastructure processor. NikoLearn application code below NEVER reads, stores, logs, hashes,
 * or forwards visitor IP addresses. Specifically this Worker does NOT touch:
 *   CF-Connecting-IP · X-Forwarded-For · True-Client-IP · request.cf.* (geo / asn / city / country).
 * It forwards NO request headers to any origin or storage. If an origin subrequest is ever added,
 * strip all IP-related headers before forwarding. Observability (logs/traces/Tail/Logpush/Analytics
 * Engine/external exports) is DISABLED in wrangler.toml — see cloudflare/wrangler.toml + DEPLOY.md.
 *
 * HARD GUARANTEES (see the data manifest):
 *  - User-agent is coarsened to {deviceType, os} buckets ONLY (raw UA is never stored).
 *  - Every event is validated against an ALLOW-LIST of names + numeric/enum props.
 *    Anything with free text / unexpected keys is REJECTED (prevents accidental PII).
 *  - We write AGGREGATE counters (KV increments) keyed by date+event+coarse dims — never a
 *    per-child row, never an identity, never a cross-day/cross-session id.
 *  - No cookies set. No persistent identifier ever reaches the server. No client salt.
 *  - Return/retention (2026-07-10, owner GO): measured ONLY as an id-free banded counter
 *    (retention_ping) — the device computes "days since first use" from a date it keeps LOCALLY
 *    and reports a coarse band at most once per local day. The server stores daily totals it
 *    cannot join across days or link to any device.
 *
 * Deploy: see cloudflare/DEPLOY.md. Do NOT enable Logpush / observability / retain client IP.
 */

// ── allow-list: event name → permitted props (type 'int' | enum array) ───────────────────────
const EVENTS = {
  profile_created:    { age_band: ['3-5','6-8','9-12'] },
  lesson_started:     { mode: ['alphabet','english','math','counting','kings','reading','movement'] },
  lesson_completed:   { mode: ['alphabet','english','math','counting','kings','reading','movement'], time_to_success_ms: 'int' },
  drop_off:           { screen: ['home','menu','game','results','break','voice'], mode: ['alphabet','english','math','counting','kings','reading','movement','none'] },
  difficulty:         { mode: ['alphabet','english','math','counting','kings','reading'], retries: 'int', errors: 'int', time_to_success_ms: 'int' },
  interaction_latency:{ ms: 'int' },
  session_length:     { seconds: 'int', lessons: 'int' },
  mode_usage:         { mode: ['alphabet','english','math','counting','kings','reading','movement'] },
  // which vocabulary topic (English words) a child opens — fixed enum = the 13 WORDS categories.
  topic_usage:        { topic: ['ფერები 🎨','ცხოველები 🐾','საკვები 🍎','ოჯახი 👨‍👩‍👧‍👦','ბუნება 🌿','სკოლა 🏫','ტანსაცმელი 👕','ტრანსპორტი 🚗','სხეული 🧍','სპორტი ⚽','ამინდი 🌦️','პლანეტები 🪐','პროფესიები 👩‍🚀'] },
  audio_usage:        { used: ['yes','no'] },
  device_context:     { deviceType: ['phone','tablet','desktop'], os: ['ios','android','windows','mac','other'], aspect: ['tall','wide','square'] },
  // ── v1.112 (Phase telemetry A1+A4) — all anonymous, aggregate-only ──
  // A1: parent engagement (no PII; goal/limit are coarse enums)
  parent_open:        {},
  goal_set:           { type: ['words','streak','total'] },
  screenlimit_set:    { minutes: ['0','15','30','45','60'] },
  feedback_open:      {},
  // A4: outcome / struggle signals per round (mode = coarse subject; band = accuracy bucket; retries = wrong taps)
  round_complete:     { mode: ['alphabet','english','math','counting','kings','reading','movement'], band: ['low','mid','high'], retries: 'int' },
  // q = WITHIN-ROUND position bucket where the child bailed (0..7, '8+'). Enum (not int) so it aggregates
  // as a histogram = the abandon heatmap. NO persistent id, NO cross-session link → privacy guarantees intact.
  round_abandon:      { mode: ['alphabet','english','math','counting','kings','reading','movement'], q: ['0','1','2','3','4','5','6','7','8+'] },
  // A3: actual sub-mode used (controlled allow-list = the game.mode values games.js emits)
  submode_usage:      { mode: ['quiz','reverse','listen','listen-yle','yesno','story','speak','pattern','rebus','model','exam','match','spell','phrases','math-add','math-sub','math-mul','math-div','math-miss','math-pat','math-word','math-pic','compare','skip','shapes','money','clock','cal','count','kings-eng','kings-math','ka-alpha','en-alpha','read','sent','build','rtext','digit','shead'] },
  // anonymous traffic: one per page-load. ref = COARSE source bucket (enum, never a URL); page = which page.
  page_view:          { ref: ['direct','internal','facebook','instagram','google','youtube','telegram','search','other'], page: ['landing','app'] },
  // WITHIN-SESSION activation funnel (owner 2026-06-23, "B-honest"): fired ONCE per page-load on the
  // first completed round. Aggregate-only, NO id, NO cross-session link → keeps the "no persistent
  // profile" / COPPA promise intact. Funnel = page_view (opens) -> first_win (activated) -> round_complete.
  first_win:          { mode: ['alphabet','english','math','counting','kings','reading','movement'] },
  // ── 2026-07-10 measurement upgrade (owner GO) — still aggregate-only, id-free ──
  // RETENTION without identity: first-use date lives ONLY on the device; it reports a coarse
  // "days since first use" band max once per local day. band=legacy → device predates this feature.
  // Cell = date|band|played|ctx|deviceType — too coarse to reconstruct any individual trajectory.
  retention_ping:     { band: ['new','d1','d2_7','d8_30','d31p','legacy'], played: ['y','n'], ctx: ['browser','pwa'] },
  // adaptive-ladder level-up (games.js rampMath + bumpFlat boundaries) = learning-progression signal
  tier_up:            { mode: ['math-add','math-sub','math-mul','math-div','compare','skip','money','clock'], tier: ['t1','t2','t3','t4'] },
  // PWA funnel: nudge shown → app installed (events pwa-install.js already emits; now allow-listed)
  pwa_nudge:          {},
  pwa_installed:      {},
};
// Live app origins. nikolearn.com is the production custom domain (2026-06-25); the github.io
// origins remain for the preview repo + the pre-domain Pages URL. Any other origin gets ACAO set to
// the first entry, which (intentionally) blocks the browser from reading the response.
const ALLOWED_ORIGINS = [
  'https://nikolearn.com',
  'https://www.nikolearn.com',
  'https://gshoina.github.io',
];

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// coarse UA → {deviceType, os}. We read UA only to bucket it; we never store the raw string.
function coarseUA(ua) {
  ua = (ua || '').toLowerCase();
  const os = /iphone|ipad|ipod/.test(ua) ? 'ios'
    : /android/.test(ua) ? 'android'
    : /windows/.test(ua) ? 'windows'
    : /mac os/.test(ua) ? 'mac' : 'other';
  const deviceType = /ipad|tablet/.test(ua) ? 'tablet'
    : /mobile|iphone|android/.test(ua) ? 'phone' : 'desktop';
  return { deviceType, os };
}

// validate ONE event against the allow-list; returns a clean {name, props} or null
function clean(ev) {
  if (!ev || typeof ev !== 'object') return null;
  const name = ev.name;
  const spec = EVENTS[name];
  if (!spec) return null;
  const props = {};
  for (const [k, rule] of Object.entries(spec)) {
    const v = ev[k];
    if (v === undefined || v === null) continue;
    if (rule === 'int') {
      if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1e9 || v !== Math.floor(v)) return null;
      props[k] = v;
    } else if (Array.isArray(rule)) {
      if (typeof v !== 'string' || !rule.includes(v)) return null; // enum only, no free text
      props[k] = v;
    }
  }
  // reject any extra keys the child/app might have added (defence in depth)
  for (const k of Object.keys(ev)) {
    if (k !== 'name' && !(k in spec)) return null;
  }
  return { name, props };
}

const today = () => new Date().toISOString().slice(0, 10); // UTC date bucket

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });

    // ── READ side: GET /v1/stats?k=SECRET → the aggregate counters as JSON (owner-only).
    // Protected by a shared secret (env.STATS_KEY, set at deploy). Returns ONLY the counters this
    // Worker wrote (date|event|coarse-dims → count) — there are no raw events, no IP, no identity to
    // return. Read-only: never writes. If STATS_KEY is unset, the endpoint is closed (403).
    if (request.method === 'GET' && url.pathname === '/v1/stats') {
      // ACAO:* so the owner's LOCAL stats viewer (file:// or any origin) can read the JSON.
      // Safe: the STATS_KEY query param is the gate, not the origin; the data is non-PII aggregate.
      const sh = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };
      if (!env.STATS_KEY || url.searchParams.get('k') !== env.STATS_KEY) {
        return new Response('forbidden', { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } });
      }
      // NB-23 fix (2026-07-12): the old reader did one KV get() PER key; the keyspace grew past the
      // Workers 1,000-subrequest cap (~1,300 keys) → uncaught "Too many subrequests" = HTTP 500/1101.
      // Now counters carry their value in KV METADATA (written by the collect path below), so the
      // reader consumes list() pages only (~2 subrequests total). Keys written before the fix have no
      // metadata yet → capped get() fallback (≤800) keeps us under the cap until /v1/backfill migrates
      // them; un-fallen-back keys return null (visible, not silently missing). Optional ?prefix= lets
      // tools read day-slices (e.g. prefix=c|2026-07-12) cheaply.
      const out = {};
      const prefix = url.searchParams.get('prefix') || undefined;
      let cursor, fallbackGets = 0;
      do {
        const list = await env.NIKO_T.list({ cursor, prefix });
        for (const k of list.keys) {
          if (k.name.startsWith('fb|')) continue; // fb| = feedback rows, not telemetry
          if (k.metadata && k.metadata.v !== undefined) out[k.name] = String(k.metadata.v);
          else if (fallbackGets < 800) { fallbackGets++; out[k.name] = await env.NIKO_T.get(k.name); }
          else out[k.name] = null; // pre-fix key beyond the safe budget — run /v1/backfill to migrate
        }
        cursor = list.list_complete ? null : list.cursor;
      } while (cursor);
      return new Response(JSON.stringify(out, null, 2), { status: 200, headers: sh });
    }

    // ── OWNER-ONLY MIGRATION: GET /v1/backfill?k=SECRET[&cursor=…] — copies each pre-fix counter's
    // value into KV metadata (same value, nothing new collected; privacy surface unchanged). Processes
    // ≤300 keys per call (1 list + ≤300 get + ≤300 put ≈ 601 subrequests, safely under the cap);
    // call repeatedly with the returned cursor until done:true. Idempotent — migrated keys are skipped.
    // History keys are backfilled WITHOUT a TTL (launch-period data stays for cohort comparisons);
    // only keys written by the collect path after 2026-07-12 carry the 180-day TTL.
    if (request.method === 'GET' && url.pathname === '/v1/backfill') {
      const sh = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };
      if (!env.STATS_KEY || url.searchParams.get('k') !== env.STATS_KEY) {
        return new Response('forbidden', { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } });
      }
      const startCursor = url.searchParams.get('cursor') || undefined;
      const list = await env.NIKO_T.list({ cursor: startCursor, limit: 300 });
      let migrated = 0, skipped = 0;
      for (const k of list.keys) {
        if (k.name.startsWith('fb|')) { skipped++; continue; }
        if (k.metadata && k.metadata.v !== undefined) { skipped++; continue; }
        const cur = await env.NIKO_T.get(k.name);
        const v = parseInt(cur || '0', 10) || 0;
        await env.NIKO_T.put(k.name, String(v), { metadata: { v } });
        migrated++;
      }
      const done = list.list_complete;
      return new Response(JSON.stringify({ done, migrated, skipped, cursor: done ? null : list.cursor }), { status: 200, headers: sh });
    }

    // ── READ side: GET /v1/feedback?k=SECRET → the parent feedback messages (owner-only, same gate).
    if (request.method === 'GET' && url.pathname === '/v1/feedback') {
      const sh = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };
      if (!env.STATS_KEY || url.searchParams.get('k') !== env.STATS_KEY) {
        return new Response('forbidden', { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } });
      }
      const rows = []; let cursor;
      do {
        const list = await env.NIKO_T.list({ prefix: 'fb|', cursor });
        for (const k of list.keys) { try { rows.push(JSON.parse(await env.NIKO_T.get(k.name))); } catch (e) {} }
        cursor = list.list_complete ? null : list.cursor;
      } while (cursor);
      rows.sort((a, b) => (b.ts || '').localeCompare(a.ts || '')); // newest first
      return new Response(JSON.stringify(rows, null, 2), { status: 200, headers: sh });
    }

    if (request.method !== 'POST') return new Response('method', { status: 405, headers: cors(origin) });

    // ── C2 abuse rate-limit (2026-06-14) — global cap so a flood can't hammer the write path / KV quota.
    // IP-FREE BY DESIGN: we do NOT read CF-Connecting-IP (see the privacy guarantee above), so the limit is
    // GLOBAL (a constant key). Dropping a few anonymous telemetry beacons during a flood is harmless.
    if (env.RL) { const { success } = await env.RL.limit({ key: 'g' }); if (!success) return new Response(null, { status: 429, headers: cors(origin) }); }

    // ── FEEDBACK (consented contact channel) — store the parent's message + optional contact as a
    // discrete row so the owner can read and reply. Length-capped; strings only; rate-limited above.
    if (url.pathname === '/v1/feedback') {
      let fb; try { fb = await request.json(); } catch { return new Response('bad json', { status: 400, headers: cors(origin) }); }
      const str = (v, max) => (typeof v === 'string' ? v.slice(0, max).trim() : '');
      const msg = str(fb.msg, 2000), name = str(fb.name, 120), phone = str(fb.phone, 60), email = str(fb.email, 160);
      if (!msg && !phone && !email) return new Response(JSON.stringify({ ok: false, error: 'empty' }), { status: 400, headers: { ...cors(origin), 'Content-Type': 'application/json' } });
      const row = { ts: new Date().toISOString(), name, phone, email, msg, os: coarseUA(request.headers.get('User-Agent')).os };
      try {
        await env.NIKO_T.put(`fb|${row.ts}|${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(row));
      } catch (e) { return new Response(JSON.stringify({ ok: false, error: 'store' }), { status: 500, headers: { ...cors(origin), 'Content-Type': 'application/json' } }); }
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors(origin), 'Content-Type': 'application/json' } });
    }

    let body;
    try { body = await request.json(); } catch { return new Response('bad json', { status: 400, headers: cors(origin) }); }
    const events = Array.isArray(body.events) ? body.events.slice(0, 25) : [];
    if (!events.length) return new Response('no events', { status: 400, headers: cors(origin) });

    const ua = coarseUA(request.headers.get('User-Agent')); // bucketed, never stored raw
    const date = today();

    // Tally per-key deltas for THIS request FIRST, then do one read-modify-write per unique key.
    // (Writing one increment per event raced: two same-key events in a batch both read the old value
    //  and both wrote old+1, losing a count. Summing deltas per key first fixes the within-request race.)
    const deltas = new Map();
    const add = (k, n) => deltas.set(k, (deltas.get(k) || 0) + n);
    for (const raw of events) {
      const e = clean(raw);
      if (!e) continue; // silently drop invalid (no error detail that could leak)
      // aggregate key: date | event | sorted enum dims (numeric props are summed, not keyed)
      const dims = Object.entries(e.props).filter(([, v]) => typeof v === 'string')
        .sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(',');
      add(`c|${date}|${e.name}|${ua.deviceType}|${dims}`, 1);
      // numeric measures → running sum + count for averages (e.g. time_to_success_ms).
      // 2026-07-10: deviceType-split, so session seconds/lessons no longer blend desktop (adult
      // preview) with phone (real kids). Historical keys without the trailing dim coexist —
      // readers must parse BOTH shapes (s|date|event|prop and s|date|event|prop|deviceType).
      for (const [k, v] of Object.entries(e.props)) {
        if (typeof v === 'number') {
          add(`s|${date}|${e.name}|${k}|${ua.deviceType}`, v);
          add(`n|${date}|${e.name}|${k}|${ua.deviceType}`, 1);
        }
      }
    }
    // A2: per-request OS / form-factor tally (coarse buckets only; raw UA never stored). One per request.
    if (deltas.size) {
      const form = ua.deviceType === 'desktop' ? 'desktop' : 'mobile';
      add(`dev|${date}|${ua.os}|${form}`, 1);
    }
    // NB-23 (2026-07-12): value is ALSO written to KV metadata so /v1/stats can read via list() alone
    // (metadata = the same counter number, nothing extra). New telemetry keys get a 180-day TTL —
    // a date-bucketed counter stops being written once its day passes, so it expires 180d later and
    // the keyspace reaches a steady state instead of growing forever. fb| rows are untouched (no TTL).
    const TTL_S = 180 * 24 * 3600;
    const ops = [];
    for (const [key, delta] of deltas) {
      ops.push(env.NIKO_T.get(key).then(cur => {
        const v = (parseInt(cur || '0', 10) || 0) + delta;
        return env.NIKO_T.put(key, String(v), { metadata: { v }, expirationTtl: TTL_S });
      }));
    }
    await Promise.allSettled(ops);
    // 204: no body, nothing that could echo identity back
    return new Response(null, { status: 204, headers: cors(origin) });
  },
};
