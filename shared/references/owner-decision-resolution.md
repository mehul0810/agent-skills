# Owner Decision Resolution

Use when owner direction changes execution; skip unambiguous bounded work.

## Decision Envelope

Resolve the instruction before acting:

| Field | Question |
|---|---|
| Intent | Is this direction, a constraint, a preference, authorization, acceptance, or publication approval? |
| Scope | Does it apply to this action, task, product, portfolio, or reusable system behavior? |
| Durability | Is it one-off, standing, valid until a named trigger, or unknown? |
| Authority | Which exact mutation is allowed? Which hard gates remain? |
| Evidence | What current repo/runtime facts, non-goals, and success proof bound the decision? |
| Destination | Does it belong only in the task, a product issue/doc, `agent-book`, or a reviewed shared-skill change? |

Never infer release, publish, destructive, transfer, protected-branch, security/privacy, commercial, or public-contract authority from general direction. Exact action approval is not reusable authorization for another version, target, or candidate.

## Precedence And Freshness

Apply safety and repo policy first. Then prefer the current exact owner instruction, live product truth, repo docs, active `agent-book` decision, and finally memory/older chat. Narrow current direction supersedes older assumptions only in scope.

- Treat "for now," "this time," "on this task," and similar wording as bounded, not standing policy.
- Preserve negative constraints and non-goals; prohibitions are not suggestions.
- Reverify drift-prone decisions at their owning source when relevant state changes.
- On conflict, stop only the conflicting action, continue safe discovery, and brief the conflict, recommendation, and reversible default.

## Proactive Execution

Direction to review, improve, implement, fix, or optimize authorizes scoped research, reversible work, proportional validation, and the repo-approved publication path, not hard-gated action. Do not manufacture an owner blocker.

Honor owner-supplied values, files, entity identity, and acceptance criteria. Check integration and obvious regressions proportionally; do not substitute speculative redesign or irrelevant proof.

## Owner-Aligned Decision Stack

Use this stack only when two or more credible paths remain after live verification:

1. Filter hard-gated, unsafe, contradictory, and product-contract-breaking options.
2. Rehydrate the exact item, product docs, ADRs, and runtime. Missing product truth is not permission to invent it.
3. Read the active private owner-principles decision pointer from `agent-book` when available. It guides judgment, not authority; never copy it into public artifacts.
4. Compare user outcome, WordPress ownership, compatibility, risk, enterprise quality, growth evidence, reversibility, and cost using the recorded order. Do not invent weights.
5. Choose the smallest complete root-cause solution; reject patches that leave known failure and abstractions without measured benefit.

Calibrate the action:

- `High`: current evidence and owner principles make one reversible option dominant. Decide, execute, and validate.
- `Medium`: a bounded tradeoff remains, but rollback is credible and no product contract or hard gate changes. Choose the safer reversible path and record the assumption.
- `Low`: material product truth is missing, options alter a one-way contract/strategy, or owner principles conflict. Continue safe discovery and return one recommendation plus the exact question.

For a material ambiguous decision, retain privately: `class | options | choice | principle IDs | confidence | evidence | rollback | expected outcome | review trigger`. Omit routine decisions. State what would change the choice; never fabricate confidence or claim to be the owner's clone.

Calibration is evidence, not policy. Record later acceptance, modification, or reversal only as a sanitized disposition and pointer. Never store full chat, ask solely for training, or mutate policy without review.

## Correction And Promotion

An owner correction is not complete with an apology or local patch:

1. State the mismatch and classify stale evidence, wrong scope, lost constraint, unauthorized inference, weak proof, or execution drift.
2. Correct safe in-scope state and rerun the failed clause.
3. Record a compact sanitized evidence pointer and decision envelope.
4. Keep one-offs local. Promote only after dedupe, privacy classification, review, and regression proof.
5. Never promote task authorization into permission; later gated actions still need exact approval.

Report the decision envelope only when ambiguity, conflict, a hard gate, or durable promotion matters. Otherwise act and keep the final result concise.
