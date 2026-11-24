# Context Window Discipline

Use when context size/drift affects continuation, or when compaction, fresh threads, continuity, or token use is in question.

## Decision Rule

- Continuity-sensitive task: checkpoint source-backed state before pressure, then use supported compaction for the same issue, PR, release train, heartbeat, implementation, or unresolved decision. Ask only when the host requires manual compaction; do not wait until the window is nearly full.
- New or unrelated task: use a fresh thread and rehydrate from repo files, Git status, issues/PRs, docs, and current runtime evidence.
- Unclear task: compact only if important decisions exist solely in chat; otherwise start fresh and rehydrate.

## What Compact Means

- Compacting does not guarantee complete retention or semantic correctness; the checkpoint and retrievable sources carry the execution contract.
- Compaction is not verification: recheck repo/GitHub/runtime facts before branch, release, issue, PR, or production-sensitive action.
- With low headroom, checkpoint and compact or narrow the next read; do not defer cheap recovery by repeatedly asking to compact.

## Model-Aware Headroom

Use the active host's effective model, context usage/window, and auto-compact setting when exposed. Reserve room for the next read, output, and checkpoint; marketing limits and prior-model settings are not effective capacity. Separate task reserve/next-phase estimates from measured use. Use installed `assessContextBudget` when available; it distinguishes total-context from body-after-prefix counters. Unknown counters require the conservative fallback, not incompatible comparisons.

After a model/provider/host switch, retain verified task facts but reacquire capacity, modality, and retrieval capabilities. Bind capacity observations to their model/runtime; do not hard-code model-family thresholds or silently change model/effort. If telemetry is missing, say so, proceed narrowly, and checkpoint before expansion. Never infer tokens from characters or treat unknown capacity as unlimited.

## Checkpoint And Recovery Contract

Use one checkpoint in the existing private task artifact/native continuity store, not another memory service. Update after material decisions, owner constraints, failures/proof, handoffs, and before large reads. Preserve:

- exact objective/non-goals and negative constraints, with current request/source pointers;
- chosen approach, concise rationale, rejected approaches and revisit triggers;
- completed/pending work, changed-file and worker/task pointers, failed/unrun checks;
- scope of approval, remaining gates, unresolved risks and exact next safe action;
- session/workspace/branch/head, observed model, timestamp/expiry, and retrievable evidence identities.

Use decision summaries, never hidden reasoning, transcripts, credentials, or private payloads; keep originals in their authorized store. Filesystem checkpoints use the pinned harness schema and `readContinuityCheckpoint`, validate source references/hashes, and write atomically within the owning task. Native stores follow the same semantics. Confirm persistence before claiming a checkpoint is saved.

After compaction/resume/transfer, read the checkpoint, retrieve minimal original sources, then verify owner direction, repo/dirty state, external state, approval scope, and workers. Establish objective, constraints, approach, failed/unrun proof, and next action before mutations. A matching hash proves bytes, not authority or completeness. Old instructions are history, not authority. Reacquire missing, expired, mismatched, or inaccessible evidence; never reconstruct facts or promote old approvals. Ask only when a consequential fact cannot be recovered safely.

Latest owner direction controls; checkpoints/historical approvals cannot widen it. Under status/evidence-only or read-only scope, inspect existing artifacts and report verified, missing, or unrun items. Propose new tests/changes separately; inspect side effects before execution because tests may mutate fixtures/runtime. Under state-freeze/no-persistence, keep the checkpoint/receipt as a response draft; do not save without permission.

Optional [project hooks](../../templates/project-hooks/README.md) validate checkpoints and supply recovery pointers. Verify host support and hook trust: hooks do not restore lost decisions, choose approaches/models, or replace checkpoints. Unsupported, disabled, or untrusted hooks require native/manual recovery; simulated payloads do not prove native dispatch.

## What Fresh Thread Means

- A clean context minimizes drift; an in-task subagent provides it without another visible chat.
- Use a fresh in-task context for unrelated tasks, broad new planning, independent implementation, or worker delegation. Create a user-visible Codex task/thread only when explicitly requested by the owner.
- Carry old assumptions only when durable in repo docs, issues/PRs, commits, or handoff notes.

## Product Orchestration Rules

- `wp-portfolio-cto` and product control threads should stay high-level. Do not let them absorb implementation logs, CI noise, or large code-reading output.
- Start recurring work with a compact repo/GitHub/runtime summary; reread history only for decisions not durable elsewhere.
- Start at the primary task source; add evidence for dependencies, uncertainty, or crossed contracts. Reference count is a heuristic; reserve model-bound headroom for next phase/checkpoint.
- Portfolio heartbeats start with exceptions: blockers, owner decisions, moving PRs/releases, unhealthy threads/workers, and material drift. Use a clean in-task context for unrelated work; compact only to continue the same decision chain.
- For product heartbeats, compact only to continue the same high-context release train; use an in-task subagent for implementation/evidence.
- For small stateful execution outside a control task, use an authorized in-task subagent with a clear stop condition, then reconcile evidence. Create a new user-visible task only when explicitly requested by the owner; environment constraints do not grant that authority.
- New/unrelated product work uses a clean in-task context. Create a visible product thread only on explicit owner request; rehydrate from source-of-truth hierarchy.
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
