# Owner Decision Resolution

Use this reference when an owner instruction, correction, approval, prohibition, or preference changes execution. Do not load it for an unambiguous bounded task whose authority is already clear.

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

Never infer release, publish, destructive, transfer, protected-branch, security/privacy-posture, pricing/licensing, or public-contract authority from general direction such as "improve," "proceed," "make it enterprise," or "push the work." Exact action approval is not reusable authorization for a later version, target, or candidate.

## Precedence And Freshness

Apply system/developer safety and current repo policy first. Within owner-controlled evidence, prefer the current explicit instruction for the exact entity, then live product/repository truth, current repo docs, an active `agent-book` decision pointer, and finally memory or older chat. Narrower current direction supersedes a broader older assumption only inside its stated scope.

- Treat "for now," "this time," "on this task," and similar wording as bounded, not standing policy.
- Preserve explicit negative constraints and non-goals. Do not reinterpret "do not use," "do not publish," or "do not change" as a suggestion.
- Reverify drift-prone decisions at their owning source when branch, version, release candidate, model availability, cadence, product state, or external guidance changes.
- If two authoritative instructions conflict, stop only the conflicting action. Continue safe discovery and provide a compact decision brief naming the conflict, recommendation, and reversible default.

## Proactive Execution

Direction to review, improve, implement, fix, or optimize authorizes scoped research, reversible local changes, proportional validation, and the repository's already-approved publication path. It does not authorize a hard-gated action. Do not manufacture an owner blocker when current evidence supports a reversible choice.

When the owner supplies exact values, files, issue/PR identity, or acceptance criteria, honor those constraints first. Verify integration, syntax, and obvious regressions proportionally; do not replace the supplied decision with speculative redesign or expensive proof unrelated to risk.

## Correction And Promotion

An owner correction is not complete with an apology or local patch:

1. State the exact mismatch and whether it was caused by stale evidence, wrong scope, lost constraint, unauthorized inference, weak proof, or execution drift.
2. Correct safe in-scope state and rerun the failed clause.
3. Record a compact sanitized evidence pointer and decision envelope.
4. Keep one-off preferences local. Promote repeatable behavior only after dedupe, privacy classification, reviewer approval, and a regression scenario.
5. Never promote task-specific authorization into reusable permission. A durable decision may describe the gate, but later gated actions still need current exact approval.

Report the decision envelope only when ambiguity, conflict, a hard gate, or durable promotion matters. Otherwise act and keep the final result concise.
