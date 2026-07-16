// ================================================================================================
// NB-64 — discriminator test for the session-pulse / recovery-checkpoint crash-recovery system.
// Run: node qa/session-pulse.test.mjs
//
// WHY THIS FILE EXISTS (NB-55: every owner-visible bug leaves behind the test that would have
// caught it): NB-64 IS the class "a durability rule with no mechanism behind it". Shipping the
// mechanism without a test would recreate the same class one layer up — a hook that everyone
// BELIEVES writes the checkpoint is worth exactly as much as a §6e-2 rule everyone believes the
// agent follows. Belief is the bug. So this asserts behaviour, not existence.
//
// It is a DISCRIMINATOR, not a smoke test: it proves the recovery alert FIRES for a DIFFERENT
// prior session AND proves it STAYS SILENT when the checkpoint is the current session's own
// (a resume, not a crash). An alert that always fires is noise, and noise is how a real alert
// gets ignored — that failure mode is worse than no alert at all.
//
// CONTRACT NOTE (2026-07-16 rewrite): the mechanism was re-architected from a one-shot pulse file
// (docs/.session-pulse.md) into a continuous git-aware checkpoint written by
// tools/recovery-checkpoint.ps1 to `.recovery/current.{json,md}` on every prompt/tool/stop/compact
// event. Two consequences this test now reflects:
//   (1) The owner message is captured from the UserPromptSubmit hook's `prompt` field (clean by
//       construction — the harness never wraps it in a system-reminder or a compaction summary),
//       NOT by re-parsing the transcript. The old transcript-noise traps tested a design that no
//       longer exists.
//   (2) Discrimination is now SESSION-IDENTITY based (different session fires, same session is
//       silent), not FLUSH-STATE based. The old "crashed-mid-work vs clean-close-out" mtime axis
//       retired when checkpointing became continuous (mtime(checkpoint) > mtime(RESUME.md) is now
//       true even on a clean exit, so that heuristic can no longer distinguish the two). That axis
//       is logged as NB-67 with a revive trigger; it is NOT silently dropped.
// ================================================================================================
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOOKS = path.resolve('.claude/hooks');
const PULSE_PS = path.join(HOOKS, 'niko-session-pulse.ps1');       // Stop wrapper -> checkpoint
const HANDOFF_PS = path.join(HOOKS, 'niko-handoff.ps1');           // SessionStart reader
const CHECKPOINT_PS = path.resolve('tools/recovery-checkpoint.ps1'); // the durable writer

let failures = 0;
const ok = (name) => console.log(`  PASS  ${name}`);
const bad = (name, detail) => { failures++; console.log(`  FAIL  ${name}\n        ${detail}`); };
const assert = (cond, name, detail) => cond ? ok(name) : bad(name, detail);

function git(dir, args) { return spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' }); }

// A recovery tool for a git project must be tested against a real git repo — static reading never
// proves the git-dependent paths (branch, HEAD, ahead-count, porcelain status) behave (§14).
function initRepo(dir) {
  spawnSync('git', ['init', '-q', dir], { encoding: 'utf8' });
  git(dir, ['config', 'user.email', 'test@nikolearn.local']);
  git(dir, ['config', 'user.name', 'niko-test']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
  git(dir, ['commit', '--allow-empty', '-q', '-m', 'init']);
  git(dir, ['branch', '-M', 'main']);
}

// Drive the durable writer exactly as settings.json does: -FromHook -Event <e>, JSON over stdin.
function runCheckpoint(root, event, stdinObj) {
  const r = spawnSync('powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', CHECKPOINT_PS, '-FromHook', '-Event', event], {
      input: JSON.stringify(stdinObj),
      env: { ...process.env, CLAUDE_PROJECT_DIR: root },
      encoding: 'utf8',
    });
  return { stdout: (r.stdout || ''), stderr: (r.stderr || '') };
}

// Drive a .claude/hooks wrapper (Stop / SessionStart) the way the harness does.
function runHook(script, root, stdinObj) {
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script], {
    input: JSON.stringify(stdinObj),
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    encoding: 'utf8',
  });
  return { stdout: (r.stdout || ''), stderr: (r.stderr || '') };
}

// --- sandbox: a throwaway git repo, never the real one ------------------------------------------
// Each repo gets its OWN unique parent dir. The checkpoint also mirrors state to an EXTERNAL backup
// at `<parent>/backups/NikoLand-recovery/`; sharing os.tmpdir() as the parent would let one sandbox's
// backup leak into another's fallback read and defeat the isolation the discriminators depend on.
function newSandbox(prefix) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const repo = path.join(base, 'proj');
  fs.mkdirSync(repo);
  initRepo(repo);
  fs.mkdirSync(path.join(repo, 'docs'), { recursive: true });
  return { base, repo };
}
const box = newSandbox('niko-pulse-');
const tmp = box.repo;
const resumePath = path.join(tmp, 'docs', 'RESUME.md');
const statePath = path.join(tmp, '.recovery', 'current.json');
const machinePath = path.join(tmp, '.recovery', 'current.md');
fs.writeFileSync(resumePath, 'RESUME_SEMANTIC_MARKER\n' + Array.from({ length: 20 }, (_, i) => `resume line ${i}`).join('\n'), 'utf8');

const OWNER_MSG = 'რა არის პრევენცია რომ არ დამეკარგოს სტატუსი';

console.log('\nNB-64 recovery-checkpoint — discriminator test\n');

// ================================================================================================
console.log('[0] ENCODING/PARSE guard — EVERY hook + the writer, not just one (§14: this is a class)');
// ------------------------------------------------------------------------------------------------
// Found the hard way, 2026-07-16: an em dash in a comment BROKE two hooks outright. PowerShell 5.1
// decodes a BOM-less .ps1 as CP1252, so UTF-8 `—` (E2 80 94) arrives as `â€”` — and 0x94 is CP1252's
// RIGHT DOUBLE QUOTATION MARK, which the parser honours as a string delimiter. The script does not
// misbehave, it fails to PARSE, and a Stop/SessionStart hook that cannot parse fails SILENTLY.
// That is the worst possible shape: the recovery system would have looked installed and been dead.
//
// The check covers every hook AND tools/recovery-checkpoint.ps1 (the writer they all delegate to);
// a parse break there kills the whole system just as silently. Assert the invariant that actually
// matters — every file parses under the same engine that will run it — not a character ban.
// ================================================================================================
const psFiles = [
  ...fs.readdirSync(HOOKS).filter(f => f.endsWith('.ps1')).map(f => path.join(HOOKS, f)),
  CHECKPOINT_PS,
];
for (const full of psFiles) {
  const ps = `$e=$null;$t=$null;[System.Management.Automation.Language.Parser]::ParseFile('${full}',[ref]$t,[ref]$e)|Out-Null;if($e.Count){Write-Output ("BROKEN: "+$e[0].Message)}else{Write-Output 'OK'}`;
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], { encoding: 'utf8' });
  const out = (r.stdout || '').trim();
  assert(out === 'OK', `${path.basename(full)} parses under PowerShell 5.1`,
    `${out} — a hook that cannot parse fails SILENTLY. Check for non-ASCII (esp. an em dash) in the source.`);
}

// ================================================================================================
console.log('\n[1] WRITE half — the prompt event captures the owner message; the checkpoint is durable');
// ================================================================================================
const w = runCheckpoint(tmp, 'prompt', { session_id: 'SESS-AAA', cwd: tmp, prompt: OWNER_MSG });

// A hook writes to a decision channel; -FromHook mode must stay silent on stdout AND stderr, on
// success or failure. A recovery aid that prints could block a legitimate stop/prompt — it would
// break the very session it exists to protect. Silence is a hard contract, not a preference.
assert(w.stdout.trim() === '', 'checkpoint prints NOTHING to stdout in hook mode',
  `got: ${JSON.stringify(w.stdout.slice(0, 200))}`);

assert(fs.existsSync(statePath), 'checkpoint state written (.recovery/current.json)', `expected ${statePath}`);
assert(fs.existsSync(machinePath), 'machine index written (.recovery/current.md)', `expected ${machinePath}`);

const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};
const machine = fs.existsSync(machinePath) ? fs.readFileSync(machinePath, 'utf8') : '';

// Guard the guard: the negative assertions below pass VACUOUSLY against empty content. Anchor them
// to a body that demonstrably exists (the same trap the first version of this file fell into).
assert(machine.length > 200, 'machine index has real content (anchors the negative assertions below)',
  `only ${machine.length} bytes — the "does NOT contain" checks would pass vacuously`);

assert(state.session_id === 'SESS-AAA', 'checkpoint carries the session id', `got ${JSON.stringify(state.session_id)}`);
assert(typeof state.resume_command === 'string' && state.resume_command.includes('claude --resume SESS-AAA'),
  'checkpoint carries a copy-paste resume command', 'recovery must be one command, not an investigation');
assert(state.launch_cwd === tmp, 'checkpoint records the LAUNCH DIR (the L14 trap: transcripts are keyed by cwd)',
  `got ${JSON.stringify(state.launch_cwd)}`);
assert(machine.includes('SESS-AAA') && machine.includes('claude --resume SESS-AAA'),
  'machine index surfaces the session id + resume command for a human', 'machine index missing the resume line');

// Georgian must survive stdin -> ConvertFrom-Json -> UTF-8 (no BOM) write on PS 5.1's ANSI default.
assert(typeof state.last_owner_message === 'string' && state.last_owner_message.includes('რა არის პრევენცია'),
  'last OWNER message captured verbatim, in Georgian (encoding survives)',
  `either the message was missed or the encoding mangled it: ${JSON.stringify(state.last_owner_message)}`);

// ================================================================================================
console.log('\n[2] STOP hook — silent, and carries the owner message forward (no prompt on a stop)');
// ================================================================================================
// The Stop event has no `prompt`; the owner message must persist from the last prompt checkpoint,
// not blank out. This is the wrapper the harness actually fires on Stop.
const stop = runHook(PULSE_PS, tmp, { session_id: 'SESS-AAA', cwd: tmp });
assert(stop.stdout.trim() === '', 'Stop pulse prints NOTHING (stdout is a Stop decision channel)',
  `got: ${JSON.stringify(stop.stdout.slice(0, 200))}`);
const afterStop = JSON.parse(fs.readFileSync(statePath, 'utf8'));
assert(typeof afterStop.last_owner_message === 'string' && afterStop.last_owner_message.includes('რა არის პრევენცია'),
  'owner message carried FORWARD across a stop (a prompt-less event does not erase it)',
  `lost the owner message on stop: ${JSON.stringify(afterStop.last_owner_message)}`);

// ================================================================================================
console.log('\n[3] READ half — SessionStart surfaces a DIFFERENT prior session as recoverable');
// ================================================================================================
const fire = runHook(HANDOFF_PS, tmp, { session_id: 'SESS-NEW' });
let fireCtx = '';
try { fireCtx = JSON.parse(fire.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(fireCtx.includes('[RECOVERY]'), 'ALERT FIRES when a different prior session left a checkpoint',
  'the crash/handover case is silent — this is the NB-64 bug itself');
assert(fireCtx.includes('claude --resume SESS-AAA'),
  'alert is ACTIONABLE — the dead session\'s resume command is injected via the machine index',
  'alert fired but hands over nothing to act on');
assert(fireCtx.includes('RESUME_SEMANTIC_MARKER'), 'semantic RESUME.md still injected alongside the alert',
  'the alert replaced the normal startup context instead of adding to it');

// ================================================================================================
console.log('\n[4] DISCRIMINATORS — proving it is not just always-on');
// ================================================================================================
// Your own checkpoint is not a crash. Resuming the SAME session must not flag itself as recoverable.
const quietSelf = runHook(HANDOFF_PS, tmp, { session_id: 'SESS-AAA' });
let qSelf = '';
try { qSelf = JSON.parse(quietSelf.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(!qSelf.includes('[RECOVERY]'), 'SILENT when the checkpoint belongs to the CURRENT session (resume, not crash)',
  'a session would flag its own checkpoint on every compact/resume => noise => real alert ignored');

// No prior checkpoint at all => nothing to recover => silent.
const freshBox = newSandbox('niko-pulse-fresh-');
fs.writeFileSync(path.join(freshBox.repo, 'docs', 'RESUME.md'), 'fresh start, nothing to recover\n', 'utf8');
const quietFresh = runHook(HANDOFF_PS, freshBox.repo, { session_id: 'SESS-NEW' });
let qFresh = '';
try { qFresh = JSON.parse(quietFresh.stdout).hookSpecificOutput.additionalContext; } catch {}
assert(!qFresh.includes('[RECOVERY]'), 'SILENT when no prior checkpoint exists (fresh clone / first run)',
  'fires with nothing to recover => always-on noise');
fs.rmSync(freshBox.base, { recursive: true, force: true });

// ================================================================================================
console.log('\n[5] Robustness — a recovery aid must never break the session it protects');
// ================================================================================================
const junk = runHook(PULSE_PS, tmp, { nothing: true });
assert(junk.stdout.trim() === '', 'malformed stdin (no session_id) -> still silent', `got: ${junk.stdout.slice(0, 120)}`);

const noRoot = runHook(PULSE_PS, path.join(tmp, 'does-not-exist'), { session_id: 'X', cwd: tmp });
assert(noRoot.stdout.trim() === '', 'missing project root -> still silent, no crash', `got: ${noRoot.stdout.slice(0, 120)}`);

// The writer itself, pointed at a non-git dir, must swallow "Not a Git project" in hook mode.
const nonGit = fs.mkdtempSync(path.join(os.tmpdir(), 'niko-pulse-nongit-'));
const noGit = runCheckpoint(nonGit, 'stop', { session_id: 'X', cwd: nonGit });
assert(noGit.stdout.trim() === '', 'writer on a non-git dir -> silent in hook mode (no thrown error to stdout)',
  `got: ${noGit.stdout.slice(0, 120)}`);
fs.rmSync(nonGit, { recursive: true, force: true });

fs.rmSync(box.base, { recursive: true, force: true });

console.log(failures === 0
  ? '\nNB-64 recovery-checkpoint: ALL CHECKS PASS — fires for a different session, silent on self-resume.\n'
  : `\nNB-64 recovery-checkpoint: ${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
