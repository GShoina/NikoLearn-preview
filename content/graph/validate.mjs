#!/usr/bin/env node
// NikoLearn skill-graph validator. Zero dependencies (matches the "0-deps data-product" discipline).
// Enforces MORE than a plain schema check: acyclicity, orphans, edge endpoints, reason+strength on
// every edge, skill_type->item_format consistency. (Marble's own validate.mjs does NOT guarantee
// acyclicity/orphans across exports — this closes that gap for our content.)
//
// Usage:
//   node validate.mjs <file.json> [<file2.json> ...]   validate content file(s)
//   node validate.mjs --selftest                        prove the validator actually catches defects
import fs from 'node:fs';
import path from 'node:path';

const SKILL_TYPES = ['CONCEPTUAL', 'PROCEDURAL', 'METACOGNITIVE', 'LANGUAGE', 'REPRESENTATIONAL'];
const STRENGTHS = ['soft', 'medium', 'hard'];
const STD_STATUS = ['mapped', 'unmapped', 'beyond_standard'];
const TYPE_FORMAT = {
  CONCEPTUAL: 'explain', PROCEDURAL: 'practice', METACOGNITIVE: 'reflect',
  LANGUAGE: 'read', REPRESENTATIONAL: 'represent'
};

// Pure function: returns { errors:[], warnings:[], stats:{} } for a parsed graph object.
export function validateGraph(g) {
  const errors = [], warnings = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  need(g && typeof g === 'object', 'root is not an object');
  if (!g || typeof g !== 'object') return { errors, warnings, stats: {} };

  need(g.schema_version === '0', `schema_version must be "0" (got ${JSON.stringify(g.schema_version)})`);
  need(typeof g.subject === 'string' && g.subject, 'subject missing');
  need(typeof g.version === 'string' && g.version, 'version missing');
  const p = g.provenance;
  need(p && p.author && p.created && p.license && p.source,
    'provenance requires author, created, license, source');

  const nodes = Array.isArray(g.nodes) ? g.nodes : [];
  const edges = Array.isArray(g.edges) ? g.edges : [];
  need(nodes.length > 0, 'no nodes');

  const ids = new Set();
  for (const n of nodes) {
    if (!n || typeof n !== 'object') { errors.push('node is not an object'); continue; }
    need(typeof n.id === 'string' && /^[a-z0-9-]+$/.test(n.id), `bad node id: ${JSON.stringify(n.id)}`);
    if (ids.has(n.id)) errors.push(`duplicate node id: ${n.id}`);
    ids.add(n.id);
    need(typeof n.title_ka === 'string' && n.title_ka.length > 0, `node ${n.id}: title_ka missing`);
    need(SKILL_TYPES.includes(n.skill_type), `node ${n.id}: bad skill_type ${JSON.stringify(n.skill_type)}`);
    if (n.item_format != null) {
      need(n.item_format === TYPE_FORMAT[n.skill_type],
        `node ${n.id}: item_format "${n.item_format}" does not match skill_type ${n.skill_type} (expected "${TYPE_FORMAT[n.skill_type]}")`);
    }
    need(typeof n.grade_band === 'string' && n.grade_band, `node ${n.id}: grade_band missing`);
    const s = n.standard;
    need(s && STD_STATUS.includes(s.status), `node ${n.id}: standard.status must be one of ${STD_STATUS.join('/')}`);
    if (s && s.status !== 'mapped') {
      need(s.code == null, `node ${n.id}: standard.code must be null unless status="mapped" (never invent a code)`);
    }
  }

  // edges
  const seenEdge = new Set();
  const adj = new Map([...ids].map(id => [id, []]));
  const indeg = new Map([...ids].map(id => [id, 0]));
  for (const e of edges) {
    if (!e || typeof e !== 'object') { errors.push('edge is not an object'); continue; }
    const key = `${e.from}->${e.to}`;
    need(ids.has(e.from), `edge ${key}: unknown "from" node`);
    need(ids.has(e.to), `edge ${key}: unknown "to" node`);
    need(e.from !== e.to, `edge ${key}: self-loop`);
    if (seenEdge.has(key)) errors.push(`duplicate edge: ${key}`);
    seenEdge.add(key);
    need(typeof e.reason_ka === 'string' && e.reason_ka.trim().length > 0,
      `edge ${key}: reason_ka missing (every prerequisite must explain WHY)`);
    need(STRENGTHS.includes(e.strength), `edge ${key}: bad strength ${JSON.stringify(e.strength)}`);
    if (ids.has(e.from) && ids.has(e.to) && e.from !== e.to) {
      adj.get(e.from).push(e.to);
      indeg.set(e.to, indeg.get(e.to) + 1);
    }
  }

  // acyclicity via Kahn topo-sort
  const q = [...ids].filter(id => indeg.get(id) === 0);
  const deg = new Map(indeg);
  let visited = 0;
  while (q.length) {
    const u = q.shift(); visited++;
    for (const v of adj.get(u)) { deg.set(v, deg.get(v) - 1); if (deg.get(v) === 0) q.push(v); }
  }
  if (visited !== ids.size) errors.push(`graph has a cycle (topo-sort reached ${visited}/${ids.size} nodes) — a prerequisite graph MUST be acyclic`);

  // orphans (a node with no edges at all is likely an authoring miss)
  const touched = new Set();
  for (const e of edges) { touched.add(e.from); touched.add(e.to); }
  for (const id of ids) if (!touched.has(id)) warnings.push(`node ${id}: orphan (no incoming or outgoing edge)`);

  const roots = [...ids].filter(id => indeg.get(id) === 0);
  const leaves = [...ids].filter(id => (adj.get(id) || []).length === 0);
  const mapped = nodes.filter(n => n.standard && n.standard.status === 'mapped').length;
  const stats = {
    nodes: nodes.length, edges: edges.length, roots, leaves,
    standard_mapped_pct: nodes.length ? Math.round(100 * mapped / nodes.length) : 0
  };
  return { errors, warnings, stats };
}

function report(name, r) {
  const ok = r.errors.length === 0;
  console.log(`\n=== ${name} ===`);
  console.log(`nodes: ${r.stats.nodes}  edges: ${r.stats.edges}  roots: [${(r.stats.roots || []).join(', ')}]  leaves: [${(r.stats.leaves || []).join(', ')}]`);
  console.log(`standard-mapped: ${r.stats.standard_mapped_pct}%  (unmapped = honest TO-VALIDATE authoring backlog, not a failure)`);
  for (const w of r.warnings) console.log(`  WARN  ${w}`);
  for (const e of r.errors) console.log(`  FAIL  ${e}`);
  console.log(ok ? 'RESULT: PASS' : `RESULT: FAIL (${r.errors.length} error${r.errors.length === 1 ? '' : 's'})`);
  return ok;
}

function selftest() {
  // A deliberately broken graph: cycle, dangling edge, bad skill_type, item_format mismatch, missing reason.
  const broken = {
    schema_version: '0', subject: 'x', version: '0',
    provenance: { author: 'a', created: 'c', license: 'l', source: 's' },
    nodes: [
      { id: 'a', title_ka: 'ა', skill_type: 'CONCEPTUAL', item_format: 'practice', grade_band: 'g3', standard: { status: 'unmapped', code: null } },
      { id: 'b', title_ka: 'ბ', skill_type: 'BOGUS', grade_band: 'g3', standard: { status: 'unmapped', code: null } }
    ],
    edges: [
      { from: 'a', to: 'b', reason_ka: 'ok', strength: 'hard' },
      { from: 'b', to: 'a', reason_ka: 'ok', strength: 'hard' },       // -> cycle
      { from: 'a', to: 'ghost', reason_ka: 'ok', strength: 'hard' },   // -> dangling
      { from: 'a', to: 'b', reason_ka: '', strength: 'weird' }         // -> dup + empty reason + bad strength
    ]
  };
  const r = validateGraph(broken);
  const want = ['cycle', 'unknown "to" node', 'bad skill_type', 'item_format', 'reason_ka missing', 'duplicate edge', 'bad strength'];
  const caught = want.filter(w => r.errors.some(e => e.includes(w)));
  console.log('\n=== SELFTEST (validator must catch injected defects) ===');
  for (const w of want) console.log(`  ${caught.includes(w) ? 'caught' : 'MISSED'}  ${w}`);
  const ok = caught.length === want.length;
  console.log(ok ? 'SELFTEST: PASS (validator discriminates)' : 'SELFTEST: FAIL');
  return ok;
}

const args = process.argv.slice(2);
if (args[0] === '--selftest') {
  process.exit(selftest() ? 0 : 1);
} else if (args.length === 0) {
  console.error('usage: node validate.mjs <file.json> [...]  |  node validate.mjs --selftest');
  process.exit(2);
} else {
  let allOk = true;
  for (const f of args) {
    let g;
    try { g = JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (err) { console.log(`\n=== ${path.basename(f)} ===\n  FAIL  cannot parse: ${err.message}\nRESULT: FAIL`); allOk = false; continue; }
    allOk = report(path.basename(f), validateGraph(g)) && allOk;
  }
  process.exit(allOk ? 0 : 1);
}
