# Project Continuity Hooks

Optional Codex lifecycle adapter, not a global interceptor or automatic memory
service. Verify host support before installing: this template follows the
[official hook contract](https://learn.chatgpt.com/docs/hooks) reviewed 2026-09-11.
The locally observed CLI was 0.153.4; CLI version alone does not prove that the
desktop host invokes the same lifecycle events.

## Install And Trust

Use only in an explicitly selected, trusted project with Node 24 and the pinned
agent-harness continuity exports. Copy `scripts/codex-continuity-hook.mjs` into the
project's scripts directory and merge this `hooks.json` into that project's
`.codex/hooks.json` after inspecting existing hooks. Never overwrite existing
configuration or add duplicate hooks. Do not edit global configuration, hook
trust records, permissions or model settings. Review the exact hook definitions
in `/hooks`; untrusted or changed hooks are skipped. Do not bypass hook trust.

## Single Task Checkpoint

The agent owns one checkpoint at
`output/continuity/<session_id>/checkpoint.json` in the existing task artifact
store. Keep that directory ignored and private. Use harness continuity schema v1
and verify with `readContinuityCheckpoint`; source evidence paths are relative to
the project root. Use actual host session identity, canonical root SHA-256, Git
HEAD/branch, observed model slug (or null), strict UTC update/expiry and all six
source-backed sections. Do not infer a session ID from a title or scrape the
private transcript. If identity or filesystem storage is unavailable, use the
native task checkpoint/retrieval facilities instead; do not invent a packet.

Persist after a material decision, constraint change, meaningful failure/proof,
handoff, or before a context-heavy phase. Do not rewrite after every tool call.
Write a new complete temporary file and atomically replace only this task's own
checkpoint after validation. A hook cannot recover decisions never checkpointed.
Real checkpoints and source artifacts must not be committed or exported.

## Behavior And Limitations

- `PreCompact` checks the existing checkpoint and evidence, then reports a bounded
  advisory. It never claims to have saved missing context or blocks auto-compaction.
- Intact historical evidence after a commit, branch change or expiry retains a
  retrieval pointer, never a current-state pass. Other sessions/workspaces, future
  timestamps and damaged evidence cannot use it. Missing filesystem checkpoints
  defer to native sources only for continuity-dependent work, not every new query.
- `SessionStart` for resume/compact injects only a validated retrieval pointer and
  fixed revalidation guidance. Missing/stale checkpoints require source recovery;
  startup without a checkpoint stays quiet. Clear/new work must not inherit an
  old task's authority. Only exact session/workspace identity can match.
- Model changes preserve source-backed task history but require fresh effective
  context-window/auto-compact limits and headroom. The event supplies a model slug,
  not usage or limits. Do not invent per-model numbers or rewrite model config.
- No transcript/prompt/assistant-message fields are read; no checkpoint prose is
  injected as developer instructions. No writes, network calls, model selection,
  permission decisions, release actions, or recursive Stop continuations occur.
- Git inspection is fixed, read-only and timeout-bounded. Detached HEAD, malformed
  payloads and unreadable evidence yield recovery guidance, not a fabricated pass.
- Hooks are supplementary. Disabled/unsupported/untrusted hooks or subagent event
  gaps require the same manual/native recovery contract. A successful adapter
  test is not proof of native automatic compaction.

Before calling activation complete, observe trusted hook discovery and real
resume/compact invocation with a disposable fixture. Then test a fresh agent
given only the checkpoint: it must recover constraints and exact next action,
retrieve required sources, and reject stale authorization. Keep native dispatch,
simulated payload and fresh-agent recovery results separate.
