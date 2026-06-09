/**
 * NikoLearn — privacy-minimized telemetry, aggregated before storage (Cloudflare Worker, free tier).
 * Routes: POST /v1/t (collect) · GET /v1/stats?k=SECRET (owner-only read, returns aggregate JSON).
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
  audio_usage:        { used: ['yes','no'] },
  device_context:     { deviceType: ['phone','tablet','desktop'], os: ['ios','android','windows','mac','other'], aspect: ['tall','wide','square'] },
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
      if (!env.STATS_KEY || url.searchParams.get('k') !== env.STATS_KEY) {
        return new Response('forbidden', { status: 403 });
      }
      const out = {};
      let cursor;
      do {
        const list = await env.NIKO_T.list({ cursor });
        for (const k of list.keys) out[k.name] = await env.NIKO_T.get(k.name);
        cursor = list.list_complete ? null : list.cursor;
      } while (cursor);
      return new Response(JSON.stringify(out, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    if (request.method !== 'POST') return new Response('method', { status: 405, headers: cors(origin) });

    let body;
    try { body = await request.json(); } catch { return new Response('bad json', { status: 400, headers: cors(origin) }); }
    const events = Array.isArray(body.events) ? body.events.slice(0, 25) : [];
    if (!events.length) return new Response('no events', { status: 400, headers: cors(origin) });

    const ua = coarseUA(request.headers.get('User-Agent')); // bucketed, never stored raw
    const date = today();
    const ops = [];

    for (const raw of events) {
      const e = clean(raw);
      if (!e) continue; // silently drop invalid (no error detail that could leak)
      // aggregate key: date | event | sorted enum dims (numeric props are summed, not keyed)
      const dims = Object.entries(e.props).filter(([, v]) => typeof v === 'string')
        .sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(',');
      const key = `c|${date}|${e.name}|${ua.deviceType}|${dims}`;
      ops.push(env.NIKO_T.get(key).then(cur => env.NIKO_T.put(key, String((parseInt(cur || '0', 10) || 0) + 1))));
      // numeric measures → running sum + count for averages (e.g. time_to_success_ms)
      for (const [k, v] of Object.entries(e.props)) {
        if (typeof v === 'number') {
          const sk = `s|${date}|${e.name}|${k}`, nk = `n|${date}|${e.name}|${k}`;
          ops.push(env.NIKO_T.get(sk).then(cur => env.NIKO_T.put(sk, String((parseInt(cur || '0', 10) || 0) + v))));
          ops.push(env.NIKO_T.get(nk).then(cur => env.NIKO_T.put(nk, String((parseInt(cur || '0', 10) || 0) + 1))));
        }
      }
    }
    await Promise.allSettled(ops);
    // 204: no body, nothing that could echo identity back
    return new Response(null, { status: 204, headers: cors(origin) });
  },
};
