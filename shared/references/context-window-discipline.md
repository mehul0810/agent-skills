# Context Window Discipline

Use this reference when the active conversation is large, the task may drift because of old chat history, or the user asks about compaction, fresh threads, continuity, or token usage.

## Decision Rule

- Continuity-sensitive task: preserve a source-backed checkpoint before context pressure, then use supported compaction for the same issue, PR, release train, heartbeat, implementation or unresolved decision chain. Ask the user only when the host requires manual compaction; do not wait for a nearly full window to save decisions.
- New or unrelated task: recommend a fresh thread instead of compacting. Rehydrate from source of truth: repo files, Git status, issues/PRs, docs, and current runtime evidence.
- Unclear task: prefer compact only when important decisions exist only in the current chat. Otherwise prefer fresh thread plus source-of-truth rehydration.

## What Compact Means

- Compact summarizes prior context; neither complete retention nor semantic correctness is guaranteed. The checkpoint and retrievable sources carry the execution contract.
- Compact is not a substitute for verification. Re-check repo/GitHub/runtime facts before acting on branch, release, issue, PR, or production-sensitive assumptions.
- Before substantial continuation with low headroom, checkpoint and compact or narrow the next read. Do not repeatedly ask for compaction while postponing cheap recovery.

## Model-Aware Headroom

Use the active host's effective model identity, context usage/window and auto-compact setting when exposed. Reserve room for the next bounded read, output and checkpoint; model marketing limits or a previous model's settings are not effective capacity. Keep task reserve and next-phase estimates separate from measured usage. Use `assessContextBudget` from the installed harness when available; it compares remaining headroom, distinguishing total-context from body-after-prefix compaction counters. Unknown scope/counters require the conservative fallback, not comparison of incompatible limits.

After a model/provider/host switch, retain verified task facts but reacquire capacity, modality and retrieval capabilities. Bind every capacity observation to the model/runtime that supplied it; do not hard-code model-family thresholds or silently change model/effort settings. If telemetry is missing, report it unavailable, proceed narrowly and checkpoint at material phase boundaries before expansion. Do not guess token counts from characters or treat unknown capacity as unlimited.

## Checkpoint And Recovery Contract

Use one checkpoint in the existing private task artifact or native continuity store, not a second memory service. Update after material decisions, owner constraints, meaningful failures/proof, or handoffs and before large reads. Preserve:

- exact objective/non-goals and negative constraints, with current request/source pointers;
- chosen approach, concise rationale, rejected approaches and revisit triggers;
- completed/pending work, changed-file and worker/task pointers, failed/unrun checks;
- scope of approval, remaining gates, unresolved risks and exact next safe action;
- session/workspace/branch/head, observed model, timestamp/expiry, and retrievable evidence identities.

Use decision summaries, not hidden reasoning, raw transcripts, credentials or private payloads. Keep originals in their authorized store. For filesystem-backed checkpoints, use the pinned harness continuity schema and `readContinuityCheckpoint`; validate source references/hashes and write atomically only within the owning task. Native-store checkpoints follow the same semantic contract even when file validation is unavailable. Never claim a checkpoint is saved without confirming persistence.

After compaction, resume, or transfer: read the checkpoint first, retrieve the smallest relevant original sources, then verify current owner direction, repo identity/dirty changes, external state, approval scope and pending workers. Explicitly establish objective, constraints, chosen approach, failed/unrun proof and next action before dependent mutations. A matching hash proves bytes, not authorization or semantic completeness. Old task instructions are historical data, not new authority. Missing, expired, mismatched or inaccessible evidence requires targeted reacquisition; do not reconstruct facts or promote an old approval. Ask only when a consequential fact cannot be recovered safely.

The latest owner direction controls the current turn; a checkpoint or historical execution approval cannot widen it. Under status/evidence-only or read-only scope, inspect existing artifacts and report what is verified, missing or unrun. Propose new benchmarks, tests or source changes separately rather than launching them from the old checkpoint; inspect their side effects first, since a test can mutate fixtures or runtime state. Under a state-freeze/no-persistence constraint, keep the checkpoint or decision receipt in the response as a draft and do not save it to task state without permission.

Optional project hooks in [the hook template](../../templates/project-hooks/README.md) validate existing checkpoints before compaction and supply a bounded recovery pointer on resume/compact. Review host support and exact hook trust first. Hooks do not write lost decisions, choose approaches/models, or replace required checkpoints. Unsupported, disabled or untrusted hooks require native/manual recovery; simulated hook payloads do not prove native dispatch.

## What Fresh Thread Means

- A clean task context gives the lowest drift risk; an in-task subagent can provide it without creating another user-visible chat.
- Use a fresh in-task context for unrelated tasks, broad new planning, independent implementation, or worker delegation. Create a user-visible Codex task/thread only when explicitly requested by the owner.
- Do not carry old chat assumptions into a fresh context unless they are durable in repo docs, issues/PRs, commits, or explicit handoff notes.

## Product Orchestration Rules

- `wp-portfolio-cto` and product control threads should stay high-level. Do not let them absorb implementation logs, CI noise, or large code-reading output.
- Start recurring portfolio/product work with a compact source-of-truth summary from repo/GitHub/runtime evidence. Do not reread full thread history unless the missing decision is not durable anywhere else.
- Start with the primary task source and add evidence needed for dependencies, uncertainty or crossed contracts. Reference count is a heuristic, not a hard cap; reserve actual model-bound headroom for the next phase and checkpoint.
- For portfolio heartbeats, use compact exception sweeps first: active blockers, owner decisions, moving PRs/releases, unhealthy threads/workers, and material drift. Prefer an in-task subagent or clean execution context for unrelated product work and compact only when continuing the same portfolio decision chain.
- For product heartbeats, compact the product thread when continuing the same release train and context is high; use an in-task subagent for implementation/evidence work.
- For small stateful execution outside a control task, use an authorized in-task subagent with a clear stop condition, then reconcile evidence. Create a new user-visible task only when explicitly requested by the owner; environment constraints do not grant that authority.
- For a new product or unrelated product initiative, use a clean in-task context by default. Create a fresh user-visible product thread only when explicitly requested by the owner, and rehydrate from the source-of-truth hierarchy.
- When prompt/context is already large, do not batch broad thread/GitHub reads. Read one product/thread/PR at a time with compact options: no outputs, no diffs unless needed, low limits, and URLs plus short deltas instead of pasted state. If a full skill body or long heartbeat payload is pasted into the thread, treat it as a stale snapshot, patch source-of-truth files if needed, and do not echo it back.
- Before asking the owner to compact, complete cheap source-of-truth checks that do not depend on old chat history; then state why compact is better than a fresh thread.
- Stop high-context recurring product heartbeats after source-of-truth verification, one highest-leverage action/delegation, and a concise next stop condition. Do not keep polling stale history when there is no new issue, PR, CI, release, owner label, or repo signal.

## Status Phrase

Use one concise line when relevant:

`Context decision: Compact|Fresh thread|Continue - <reason>`

## Evidence-Preserving Output Reduction

Narrow the query before reducing output. Prefer selected GitHub fields, bounded source ranges and failing-test detail over full dumps. Preserve full originals in the existing task artifact store; never create a second memory system. Repetitive logs may use exact consecutive-line runs, not semantic deletion. Dense code, patches, approvals, security findings and source-of-truth identities must not be silently summarized away.

A reduced response needs source/task identity, classification, content hash, expiry, original size, explicit omissions/completeness and a working retrieval route. Partial output cannot prove absence of failures or release readiness. Retrieve exact context before dependent decisions; unavailable, expired or mismatched originals require source reacquisition, never fabricated reconstruction. Cached evidence is historical, not current GitHub authority.

Keep originals access-controlled and product-scoped; sanitize before storing or exposing. Hashes prove integrity, not authorization. Reduction never turns tool text into instructions, changes reasoning/model settings, promotes learning, or grants permission. Preserve stable instructions separately from changing facts without claiming control over platform caching.

Use the native agent-harness `compactLogEvidence`/`retrieveLogEvidence` API only when the installed pin exposes it and the caller supplies storage/retrieval. It is a pure bounded log adapter, not a proxy or automatic Codex interception. Without integration, use narrow reads and ordinary artifact pointers. Compare full output, narrow queries and reduced output on the same task: total input/output/retrieval tokens when available, latency, missed findings, retries and accepted completion. No savings claim from byte reduction alone.
