/**
 * NikoLearn — privacy-minimized telemetry, aggregated before storage (Cloudflare Worker, free tier).
 * Routes: POST /v1/t (collect) · GET /v1/stats?k=SECRET (owner-only read, returns aggregate JSON).
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
 *  - No cookies set. No persistent identifier. No client salt. No return/retention tracking.
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
  submode_usage:      { mode: ['quiz','reverse','listen','listen-yle','yesno','story','speak','pattern','rebus','exam','match','spell','phrases','math-add','math-sub','math-mul','math-div','math-miss','math-pat','math-word','math-pic','compare','skip','shapes','money','clock','cal','count','kings-eng','kings-math','ka-alpha','en-alpha','read','sent','build','rtext','digit'] },
  // anonymous traffic: one per page-load. ref = COARSE source bucket (enum, never a URL); page = which page.
  page_view:          { ref: ['direct','internal','facebook','instagram','google','youtube','telegram','search','other'], page: ['landing','app'] },
  // WITHIN-SESSION activation funnel (owner 2026-06-23, "B-honest"): fired ONCE per page-load on the
  // first completed round. Aggregate-only, NO id, NO cross-session link → keeps the "no persistent
  // profile" / COPPA promise intact. Funnel = page_view (opens) -> first_win (activated) -> round_complete.
  first_win:          { mode: ['alphabet','english','math','counting','kings','reading','movement'] },
};
const ALLOWED_ORIGINS = ['https://gshoina.github.io']; // tighten to the live app origin

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
      const out = {};
      let cursor;
      do {
        const list = await env.NIKO_T.list({ cursor });
        for (const k of list.keys) if (!k.name.startsWith('fb|')) out[k.name] = await env.NIKO_T.get(k.name); // fb| = feedback rows, not telemetry
        cursor = list.list_complete ? null : list.cursor;
      } while (cursor);
      return new Response(JSON.stringify(out, null, 2), { status: 200, headers: sh });
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
      // numeric measures → running sum + count for averages (e.g. time_to_success_ms)
      for (const [k, v] of Object.entries(e.props)) {
        if (typeof v === 'number') {
          add(`s|${date}|${e.name}|${k}`, v);
          add(`n|${date}|${e.name}|${k}`, 1);
        }
      }
    }
    // A2: per-request OS / form-factor tally (coarse buckets only; raw UA never stored). One per request.
    if (deltas.size) {
      const form = ua.deviceType === 'desktop' ? 'desktop' : 'mobile';
      add(`dev|${date}|${ua.os}|${form}`, 1);
    }
    const ops = [];
    for (const [key, delta] of deltas) {
      ops.push(env.NIKO_T.get(key).then(cur => env.NIKO_T.put(key, String((parseInt(cur || '0', 10) || 0) + delta))));
    }
    await Promise.allSettled(ops);
    // 204: no body, nothing that could echo identity back
    return new Response(null, { status: 204, headers: cors(origin) });
  },
};
