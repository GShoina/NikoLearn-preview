# content/graph — NikoLearn skill graph (content as DATA, not code)

**Status:** ACTIVE (v0 proof) · created 2026-07-14 · owner-ask: Marble learnings → concrete execution.

## Why this exists
NikoLearn content today is scattered in JS (`niko/games.js`, the hardcoded `PATHS` "toy" map + `SUBJ_DIAG`
pools in `niko/placement.js`). No versioning, no schema, no automatic quality check, and prerequisite order
is implicit. This folder is the fix: content lives as **versioned, schema-validated JSON data** so quality is
checked by a script, not by eye.

The idea (a prerequisite DAG where every edge is explained) is inspired by the *structure* of open skill
graphs. It is NOT a copy: all text is original Georgian authoring (CLAUDE.md §11), and the DB structure idea
is not copyrightable.

## Files
- `skill-graph.schema.json` — the declarative contract (JSON Schema draft-07).
- `math-fractions.v0.json` — first real content: a 11-node Georgian Fractions ladder.
- `validate.mjs` — zero-dependency validator. Enforces MORE than schema shape:
  acyclicity (Kahn topo-sort), edge endpoints exist, no self-loops/dup edges, **every edge carries
  `reason_ka` + `strength`**, and **`skill_type` → `item_format`** consistency. (This closes a gap in
  Marble's own validator, which does not guarantee acyclicity/orphans across exports.)

## Run
```
node validate.mjs math-fractions.v0.json   # validate content
node validate.mjs --selftest               # prove the validator catches injected defects
```

## The two payloads that make this valuable (owner learnings #1, #5)
- **`edges[].reason_ka` + `strength`** — WHY a skill is a prerequisite. This is the scaffolding payload:
  it is exactly what the tutor should say to a child on failure. (Wiring into `tutor.js` = NEXT, deferred
  until the design-time backbone is accepted.)
- **`nodes[].skill_type` → `item_format`** — CONCEPTUAL needs *explain*, PROCEDURAL needs *practice*,
  METACOGNITIVE needs *reflect*. This is how we move past "everything is a quiz". (Render-wiring = NEXT.)

## Honest gaps (not failures)
- `standard.status` ships `unmapped`: mapping each node to a **real Georgian national-curriculum code** is an
  authoring pass that needs the actual curriculum document. We do NOT invent codes.
- Runtime graph-routing (the app choosing the next skill from this graph live) is **deferred** — this v0 is a
  *design-time backbone*, not yet a live router. That is the recommended sequence.

## Add a subject
Copy the JSON shape, author original Georgian nodes + explained edges, run `validate.mjs`. Green = ship-ready data.
