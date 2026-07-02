# Heartbeat Check-In Discipline

Use this reference for CTO and PO heartbeat reporting. Check-ins must be delta-first, decision-oriented, owner-readable, and brief enough to explain change without repeating unchanged state.

## Core Rules

- Lead with change. Start from what changed since the last check-in, not from a full restatement.
- Separate signal by ownership: blocked, owner-needed, Codex-owned, and quiet.
- Write for owner consumption: owner-readable, not as a raw tool log, XML payload, or verification dump.
- Treat repeated blockers as escalation material. Do not silently restate the same blocker heartbeat after heartbeat.
- Justify quiet status with evidence, not absence of effort.
- Use `NOTIFY` only when there is a material change, blocker, owner decision, executable work, release/proof drift, topology/process concern, or cadence change worth surfacing.
- Use `DONT_NOTIFY` only when no owner decision, blocker, executable work, material drift, or process concern exists.
- Prefer plain decision language over workflow jargon. Replace vague terms like `owner-gated` with the exact decision needed.

## Readability Rules

- Use plain English section titles and short declarative sentences.
- Avoid long SHAs, raw API/XML shapes, or dense verification clauses unless identity proof is the point.
- Put raw proof details only under `Evidence`, and keep them compact.
- Translate workflow status into owner meaning: what changed, what is blocked, what needs a decision, and what Codex will do next.
- If a checkout is dirty/stale, say whether it blocks current work and what would unblock it.

## `DONT_NOTIFY` Rule

`DONT_NOTIFY` is valid only when all of the following are true:

- No new blocker or repeated blocker escalation.
- No owner decision is needed now.
- No executable `owner:codex` work is being skipped.
- No material release, PR, CI, topology, automation, or process drift exists.
- Quiet/no-action status is backed by current evidence.

The `DONT_NOTIFY` message must be one sentence with the product name, strongest quiet reason, and whether any owner decision exists.

Example:

```text
DONT_NOTIFY - CleanLinks is quiet after verification because there is no new PR, CI, or release drift, and no owner decision is needed.
```

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

Omit empty sections only when the omission is obvious and reduces noise.

## Portfolio CTO Template

Use exception reporting plus a compact coverage line for quiet products. Do not repeat a long full-product list unless it materially helps. Translate PO outputs into owner-facing portfolio language instead of copying raw PO XML/messages.

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
Repeated quiet status should trigger cadence reduction/pause or a proactive discovery lane, not the same long quiet message.

## CTO Intervention Trigger

CTO must not merely relay PO output. If a PO report is unclear, log-like, contradictory, passive, repeated, stalled, missing an expected action, or misaligned with the owner-approved objective, intervene immediately: ask why it is happening, what the blocker is, and what will change before the next heartbeat.

Trigger intervention without owner prompting when any of these happen:

- The same quiet state appears twice while active work or a release train still exists.
- The PO says ready but does not execute an approved beta or non-production action.
- The thread stays in progress/stale without material output.
- The PO reports raw logs instead of owner-readable decisions.
- Evidence-backed findings do not become issues.
- Executable non-hard-gated work is deferred as an owner decision without explicit approval needed.
- Heartbeat cadence no longer matches product urgency.

CTO response should be one of: correct the PO, reduce/pause cadence, request the exact blocker, recover/fork the product thread with owner approval when needed, or route a skill/process patch.

Portfolio 'NOTIFY' check-ins should include 'CTO intervention' when this happens so the owner sees what was corrected and why.

## Product PO Template

Product reports should stay concrete:

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
- <issue/PR links or identifiers>; current state.

Evidence
- <compact CI/proof/package/research evidence or exact proof gap>.

Next action
- <single highest-leverage next action>.

Stop condition
- <what would make this thread quiet or require escalation>.
```

## Quiet Evidence

Quiet/no-action claims should cite the best available evidence:

- no new PR/issue/CI/release delta,
- no executable `owner:codex` item,
- only already-known explicit owner decisions remain,
- no new topology/worktree/automation drift,
- no release-readiness regression since the last report.

Avoid phrases like `no update`, `nothing new`, or `still monitoring` without evidence.

## Repetition Control

- If the same blocker repeats, say what was attempted, what changed, and what exact escalation remains.
- If nothing changed, compress to one quiet sentence instead of repeating the full structure.
- If a product consumed most of the action budget, summarize the rest with a compact verified-quiet coverage line.
