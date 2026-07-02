# Heartbeat Check-In Discipline

Use this reference for CTO and PO heartbeat reporting. Check-ins must be delta-first, decision-oriented, and brief enough to explain what changed without repeating full unchanged state.

## Core Rules

- Lead with change. Start from what changed since the last check-in, not from a full restatement.
- Separate signal by ownership: blocked, owner-needed, Codex-owned, and quiet.
- Treat repeated blockers as escalation material. Do not silently restate the same blocker heartbeat after heartbeat.
- Justify quiet status with evidence, not absence of effort.
- Use `NOTIFY` only when there is a material change, blocker, owner decision, executable work, release/proof drift, topology/process concern, or cadence change worth surfacing.
- Use `DONT_NOTIFY` only when no owner decision, blocker, executable work, material drift, or process concern exists.

## `DONT_NOTIFY` Rule

`DONT_NOTIFY` is valid only when all of the following are true:

- No new blocker or repeated blocker escalation.
- No owner decision is needed now.
- No executable `owner:codex` work is being skipped.
- No material release, PR, CI, topology, automation, or process drift exists.
- Quiet/no-action status is backed by current evidence.

The `DONT_NOTIFY` message must be one sentence with the strongest quiet reason.

Example:

```text
DONT_NOTIFY - Quiet after verification: all products are either unchanged and healthy, or have only already-known owner-gated items with no new drift.
```

## `NOTIFY` Structure

Every `NOTIFY` check-in should separate these sections:

```text
Material changes
Blocked
Owner decisions
Codex-owned next actions
PO active work/delegations
Quiet products with evidence
Cadence/automation changes
```

Omit empty sections only when the omission is obvious and reduces noise.

## Portfolio CTO Template

Use exception reporting plus a compact coverage line for quiet products. Do not repeat a long full-product list unless it materially helps.

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

Quiet products with evidence
- Verified quiet: <product list> - <compact reason such as no new PR/issue/CI/release/label drift>.

Cadence/automation changes
- <heartbeat/product>: <reduced, increased, paused, resumed, or topology follow-up>; why.
```

If a product remains blocked across repeated heartbeats, escalate the blocker instead of restating it passively. For stale product-thread topology, keep surfacing the exact owner decision needed until resolved or cadence is reduced/paused.

## Product PO Template

Product reports should stay concrete:

```text
NOTIFY - <product>

Current objective
- <active release/train objective or bounded goal>.

Material changes
- <what changed since last report>.

Active PR/issues
- <issue/PR links or identifiers>; current state.

Blockers
- <exact blocker>; why it blocks; escalation status.

Owner-gated items
- <exact owner decision or approval still required>.

Codex-handled items
- <what Codex can do now without owner input>.

Validation evidence
- <CI/proof/package/research evidence or exact proof gap>.

Next action
- <single highest-leverage next action>.

Stop condition
- <what would make this thread quiet or require escalation>.
```

## Quiet Evidence

Quiet/no-action claims should cite the best available evidence:

- no new PR/issue/CI/release delta,
- no executable `owner:codex` item,
- only already-known owner-gated items remain,
- no new topology/worktree/automation drift,
- no release-readiness regression since the last report.

Avoid phrases like `no update`, `nothing new`, or `still monitoring` without evidence.

## Repetition Control

- If the same blocker repeats, say what was attempted, what changed, and what exact escalation remains.
- If nothing changed, compress to one quiet sentence instead of repeating the full structure.
- If a product consumed most of the action budget, summarize the rest with a compact verified-quiet coverage line.
