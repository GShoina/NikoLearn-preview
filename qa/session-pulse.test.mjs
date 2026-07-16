// ================================================================================================
// NB-64 — discriminator test for the session-pulse crash-recovery system.
// Run: node qa/session-pulse.test.mjs
//
// WHY THIS FILE EXISTS (NB-55: every owner-visible bug leaves behind the test that would have
// caught it): NB-64 IS the class "a durability rule with no mechanism behind it". Shipping the
// mechanism without a test would recreate the same class one layer up — a hook that everyone
// BELIEVES writes the pulse is worth exactly as much as a §6e-2 rule everyone believes the agent
// follows. Belief is the bug. So this asserts behaviour, not existence.
//
// It is a DISCRIMINATOR, not a smoke test: it proves the alert FIRES on a crash AND proves it
// STAYS SILENT on the two healthy shapes. A warning that always fires is noise, and noise is how
// a real warning gets ignored — that failure mode is worse than no warning at all.
// ================================================================================================
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOOKS = path.resolve('.claude/hooks');
const PULSE_PS = path.join(HOOKS, 'niko-session-pulse.ps1');
const HANDOFF_PS = path.join(HOOKS, 'niko-handoff.ps1');

let failures = 0;
const ok = (name) => console.log(`  PASS  ${name}`);
const bad = (name, detail) => { failures++; console.log(`  FAIL  ${name}\n        ${detail}`); };
const assert = (cond, name, detail) => cond ? ok(name) : bad(name, detail);

function runHook(script, root, stdinObj) {
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script], {
    input: JSON.stringify(stdinObj),
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    encoding: 'utf8',
  });
  return { stdout: (r.stdout || ''), stderr: (r.stderr || '') };
}

// --- sandbox: never touch the real repo's pulse/handoff -----------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'niko-pulse-'));
fs.mkdirSync(path.join(tmp, 'docs'), { recursive: true });
const handoffPath = path.join(tmp, 'docs', 'SESSION-HANDOFF.md');
const pulsePath = path.join(tmp, 'docs', '.session-pulse.md');
fs.writeFileSync(handoffPath, Array.from({ length: 70 }, (_, i) => `handoff line ${i}`).join('\n'), 'utf8');

// A transcript shaped like the real thing: the owner's turn is NOT the last type=user event.
// system-reminders are also type=user — that is the trap this asserts against.
const transcript = path.join(tmp, 'fake.jsonl');
fs.writeFileSync(transcript, [
  JSON.stringify({ type: 'user', message: { content: 'ძველი შეკითხვა' } }),
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'reply' }] } }),
  JSON.stringify({ type: 'user', message: { content: 'რა არის პრევენცია რომ არ დამეკარგოს სტატუსი' } }),
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'reply 2' }] } }),
  JSON.stringify({ type: 'user', message: { content: [{ type: 'text', text: '<system-reminder>HOOK_NOISE_MARKER</system-reminder>' }] } }),
  // Regression: the live run captured a COMPACTION SUMMARY as "the owner's last message". It is
  // type=user, carries no system-reminder wrapper, and is our own prose wearing a user costume.
  // The sandbox test was green while the real pulse was polluted — static shapes did not cover it.
  JSON.stringify({ type: 'user', message: { content: 'This session is being continued from a previous conversation that ran out of context. COMPACT_NOISE_MARKER' } }),
].join('\n') + '\n', 'utf8');

const setMtime = (f, when) => fs.utimesSync(f, when, when);
const NOW = Date.now() / 1000;

console.log('\nNB-64 session-pulse — discriminator test\n');

// ================================================================================================
console.log('[0] ENCODING/PARSE guard — EVERY hook, not just the new one (§14: this is a class)');
// ------------------------------------------------------------------------------------------------
// Found the hard way, 2026-07-16: an em dash in a comment BROKE two hooks outright. PowerShell 5.1
// decodes a BOM-less .ps1 as CP1252, so UTF-8 `—` (E2 80 94) arrives as `â€”` — and 0x94 is CP1252's
// RIGHT DOUBLE QUOTATION MARK, which the parser honours as a string delimiter. The script does not
// misbehave, it fails to PARSE, and a Stop/SessionStart hook that cannot parse fails SILENTLY.
// That is the worst possible shape: the recovery system would have looked installed and been dead.
//
// niko-stop-guard.ps1 survives the same treatment only by luck (Georgian bytes miss the quote
// range). Luck is not a mechanism, so this asserts the invariant that actually matters — every
// hook parses under the same engine that will run it — rather than banning a character and hoping.
// ================================================================================================
for (const f of fs.readdirSync(HOOKS).filter(f => f.endsWith('.ps1'))) {
  const full = path.join(HOOKS, f);
  const ps = `$e=$null;$t=$null;[System.Management.Automation.Language.Parser]::ParseFile('${full}',[ref]$t,[ref]$e)|Out-Null;if($e.Count){Write-Output ("BROKEN: "+$e[0].Message)}else{Write-Output 'OK'}`;
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], { encoding: 'utf8' });
  const out = (r.stdout || '').trim();
  assert(out === 'OK', `${f} parses under PowerShell 5.1`,
    `${out} — a hook that cannot parse fails SILENTLY. Check for non-ASCII (esp. an em dash) in the source.`);
}

// ================================================================================================
console.log('\n[1] WRITE half — the Stop hook records state');
// ================================================================================================
const w = runHook(PULSE_PS, tmp, { session_id: 'SESS-AAA', transcript_path: transcript, cwd: tmp });

// THE most important assertion in this file. A Stop hook's stdout is parsed as a decision object.
// If the pulse ever printed anything, it could block a legitimate stop — a recovery aid that
// breaks the session it is meant to protect. Silence is a hard contract, not a preference.
assert(w.stdout.trim() === '', 'pulse prints NOTHING to stdout (stdout is a Stop decision channel)',
  `got: ${JSON.stringify(w.stdout.slice(0, 200))}`);

assert(fs.existsSync(pulsePath), 'pulse file written', `expected ${pulsePath}`);
const body = fs.existsSync(pulsePath) ? fs.readFileSync(pulsePath, 'utf8') : '';

// Guard the guard: every "does NOT contain" assertion below passes VACUOUSLY against an empty
// string. The first run of this file did exactly that — two green PASSes on a pulse that was never
// written. A test that reports success when the thing under test is absent is the same bug as the
// one being fixed, so anchor the negatives to a body that demonstrably exists.
assert(body.length > 200, 'pulse has real content (anchors the negative assertions below)',
  `only ${body.length} bytes — the "does NOT contain" checks would pass vacuously`);

assert(body.includes('SESS-AAA'), 'pulse carries the session id', 'missing session id');
assert(body.includes(`claude --resume SESS-AAA`), 'pulse carries a copy-paste resume command',
  'recovery must be one command, not an investigation');
assert(body.includes(tmp), 'pulse records the LAUNCH DIR (the L14 trap: transcripts are keyed by cwd)',
  'missing launch dir');

// Georgian must survive PS 5.1's ANSI default on a BOM-less UTF-8 transcript.
assert(body.includes('რა არის პრევენცია'), 'last OWNER message captured verbatim, in Georgian',
  'either the message was missed or the encoding mangled it');
assert(!body.includes('ძველი შეკითხვა'), 'takes the LATEST owner message, not an earlier one', 'stale message captured');
assert(!body.includes('HOOK_NOISE_MARKER'), 'system-reminders are NOT mistaken for the owner (they are also type=user)',
  'harness noise leaked into the pulse as if the owner had said it');
assert(!body.includes('COMPACT_NOISE_MARKER'), 'compaction summaries are NOT mistaken for the owner (found by a LIVE run, not this file)',
  'the pulse would quote our own summary back as what the owner asked for');

// ================================================================================================
console.log('\n[2] READ half — SessionStart surfaces a crash');
// ================================================================================================
setMtime(handoffPath, NOW - 3600); // handoff saved an hour ago...
setMtime(pulsePath, NOW);          // ...session kept working after that, then died.
const fire = runHook(HANDOFF_PS, tmp, { session_id: 'SESS-NEW' });
let fireCtx = '';
try { fireCtx = JSON.parse(fire.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(fireCtx.includes('WITHOUT FLUSHING'), 'ALERT FIRES when a different session pulsed after the last handoff write',
  'the crash case is silent — this is the NB-64 bug itself');
assert(fireCtx.includes('SESS-AAA') && fireCtx.includes('claude --resume'),
  'alert hands over the dead session id + resume command', 'alert fired but is not actionable');
assert(fireCtx.includes('handoff line 0'), 'handoff head still injected alongside the alert', 'alert replaced the normal context');

// ================================================================================================
console.log('\n[3] DISCRIMINATORS — proving it is not just always-on');
// ================================================================================================
// Healthy close-out: the agent DID flush. Handoff is newer than the pulse.
setMtime(handoffPath, NOW);
setMtime(pulsePath, NOW - 3600);
const quiet1 = runHook(HANDOFF_PS, tmp, { session_id: 'SESS-NEW' });
let q1 = '';
try { q1 = JSON.parse(quiet1.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(!q1.includes('WITHOUT FLUSHING'), 'SILENT when the handoff is newer than the pulse (clean close-out)',
  'fires on healthy sessions => it is noise => the real warning gets ignored');

// Your own pulse is not a crash. Resuming the same session must not warn about itself.
setMtime(handoffPath, NOW - 3600);
setMtime(pulsePath, NOW);
const quiet2 = runHook(HANDOFF_PS, tmp, { session_id: 'SESS-AAA' });
let q2 = '';
try { q2 = JSON.parse(quiet2.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(!q2.includes('WITHOUT FLUSHING'), 'SILENT when the pulse belongs to the CURRENT session (resume, not crash)',
  'a session would warn about its own pulse on every compact/resume');

// ================================================================================================
console.log('\n[4] Robustness — a recovery aid must never break the session it protects');
// ================================================================================================
const junk = runHook(PULSE_PS, tmp, { nothing: true });
assert(junk.stdout.trim() === '', 'malformed stdin (no session_id) -> still silent', `got: ${junk.stdout.slice(0,120)}`);
const noRoot = runHook(PULSE_PS, path.join(tmp, 'does-not-exist'), { session_id: 'X', cwd: tmp });
assert(noRoot.stdout.trim() === '', 'missing project root -> still silent, no crash', `got: ${noRoot.stdout.slice(0,120)}`);

fs.rmSync(tmp, { recursive: true, force: true });

console.log(failures === 0
  ? '\nNB-64 pulse: ALL CHECKS PASS — fires on a crash, silent on healthy sessions.\n'
  : `\nNB-64 pulse: ${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
