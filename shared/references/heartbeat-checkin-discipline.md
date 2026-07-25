# Heartbeat Check-In Discipline

Use this reference for CTO and PO heartbeat reporting. Check-ins must be delta-first, decision-oriented, owner-readable, and brief enough to explain change without repeating unchanged state.

## Core Rules

- Lead with change, separated as blocked, owner-needed, Codex-owned, and quiet.
- Write for the owner, not as raw logs/XML/verification dumps; escalate repeated blockers.
- Justify quiet with evidence.
- Use `NOTIFY` only when there is a material change, blocker, owner decision, executable work, release/proof drift, topology/process concern, or cadence change worth surfacing.
- Use `DONT_NOTIFY` only when no owner decision, blocker, executable work, material drift, or process concern exists.
- Replace `owner-gated` jargon with the exact decision. If checks cannot finish quickly, return a partial owner-readable result instead of staying in progress.

## Readability Rules

- Use plain headings and short sentences. Avoid long SHAs/API/XML unless identity matters; keep raw proof compact under `Evidence`.
- Translate status into change, blocker, decision, and next action.
- If a checkout is dirty/stale, say whether it blocks current work and what would unblock it.
- Do not paste long heartbeat XML, PR bodies, diffs, screenshot lists, or raw tool output into follow-up prompts. Also do not paste full skill bodies or repeated history into follow-up prompts. Use URLs, short deltas, and exact blocker summaries.

## `DONT_NOTIFY` Rule

`DONT_NOTIFY` requires current quiet evidence, no blocker/escalation, owner decision, skipped executable `owner:codex` work, or material release/PR/CI/topology/automation/process drift.

The `DONT_NOTIFY` message must be one sentence with the product name, strongest quiet reason, and whether any owner decision exists.

## `NOTIFY` Structure

Every `NOTIFY` check-in should separate these sections:

```text
What changed
What is blocked
What owner needs to decide
What Codex will do next
Evidence
Quiet products with evidence
Cadence/automation changes
```

## Partial Result Rule

Use a partial `NOTIFY` result for routine product heartbeats, quiet monitoring loops, or post-intervention checks when live checks time out, public checks run long, or one narrow verification path cannot finish promptly.

- Return verified evidence instead of waiting hours; name incomplete checks, owner-decision impact, and next retry/cadence without retry logs.
- If a connector returns `Bad Request`, retry once with a strictly smaller payload and report the payload-reduction rule instead of repeating the same call shape. If the retry fails, stop broad reads, do not paste more context, and switch to one narrow source-of-truth check or a fresh worker/product thread.

Use this shape:

```text
NOTIFY - <product>

What changed
- <verified delta or no verified material change>.

What is blocked
- <exact timed-out or incomplete checks>; impact on confidence.

What owner needs to decide
- <changed decision or no change>.

What Codex will do next
- <retry scope, reduced cadence, or next safe action>.

Evidence
- <verified evidence already gathered>.

Cadence/automation changes
- <next retry window, reduced cadence, or pause reason>.
```

## Thread Health And Drift

Topology/process drift includes empty completions, active turns without output, `systemError`, non-materialized workers, wrong path/base/model lane, issue/PR claims without proof, and repeated quiet while work is executable.

For release blockers, one non-material PO heartbeat is enough to escalate.

Corrective action must be explicit: recover the worker/path, narrow the blocker, reduce/pause cadence, route a bounded worker, or escalate owner approval for protected-thread recovery.

## Portfolio CTO Template

Use exceptions plus one quiet-product coverage line. Translate PO output instead of copying raw XML/messages.

```text
NOTIFY

Material changes
- <product>: <what changed since last check-in>; impact.

Blocked
- <product>: <exact blocker>; why it still blocks; escalation status.

Owner decisions
- <product>: <exact decision needed>; recommendation; why now.

Codex-owned next actions
- <product>: <next executable action Codex can take without owner input>.

PO active work/delegations
- <product>: objective; active PR/issues; worker/delegation state.

Community queues
- <product>: human contributor PRs, human-created issues, bot/dependency PRs, and owner/automation-created issues; only mention material deltas or blockers.

Quiet products with evidence
- Verified quiet: <product list> - <compact reason such as no new PR/issue/CI/release/label drift>.

Cadence/automation changes
- <heartbeat/product>: <reduced, increased, paused, resumed, or topology follow-up>; why.
```

Escalate repeated blockers. For stale topology, surface the exact decision until resolved or cadence changes. Repeated quiet status should trigger cadence reduction/pause or a proactive discovery lane.

## CTO Intervention Trigger

CTO must not merely relay PO output. If a PO report is unclear, log-like, contradictory, passive, repeated, stalled, missing an expected action, or misaligned with the owner-approved objective, intervene immediately: ask why it is happening, what the blocker is, and what will change before the next heartbeat.

Intervene without prompting when:

- Quiet repeats twice during active work; a release blocker gets one non-material heartbeat; approved beta/non-production action is not executed; or a thread stalls/ends empty/`systemError`.
- Raw logs replace decisions; evidence-backed or unexpected behavior, maintainability/comments/tests/validation/workflow findings lack a focused issue.
- Community PR/issues are ignored; UI work lacks Playground/equivalent proof; executable work is falsely owner-gated; cadence mismatches urgency; or work lacks proof/uses the wrong lane.

CTO response should be one of: correct the PO, reduce/pause cadence, request the exact blocker, recover/fork the product thread with owner approval when needed, or route a skill/process patch.

Portfolio 'NOTIFY' check-ins should include 'CTO intervention' when this happens so the owner sees what was corrected and why.

## Product PO Template

```text
NOTIFY - <product>

What changed
- <plain delta since last report>.

What is blocked
- <exact blocker>; does it block current work; what would unblock it.

What owner needs to decide
- <explicit decision wording such as waiting for approval to release 1.0.4 or waiting for next milestone scope>.

What Codex will do next
- <single next action Codex can take without owner input>.

Current objective
- <active release/train objective or bounded goal>.

Active PR/issues
- <release PRs>; <human contributor PR queue>; <bot/dependency PR queue>; <owner-created issues>; <human-created issue queue>; <automation-created issues>.

Evidence
- <compact CI/proof/package/research evidence or exact proof gap>.

Next action
- <single highest-leverage next action>.

Stop condition
- <what would make this thread quiet or require escalation>.
```

## Quiet Evidence

Quiet claims cite no PR/issue/CI/release delta, executable `owner:codex` item, new topology/worktree/automation drift, or release regression; only known owner decisions may remain.

Avoid phrases like `no update`, `nothing new`, or `still monitoring` without evidence.

## Repetition Control

- If the same blocker repeats, say what was attempted, what changed, and what exact escalation remains.
- If nothing changed, compress to one quiet sentence instead of repeating the full structure.
- If a product consumed most of the action budget, summarize the rest with a compact verified-quiet coverage line.
- If a heartbeat timed out or exited partially, the next check-in should say what was verified before timeout, what remains unverified, and whether cadence was reduced or kept for a concrete reason.
