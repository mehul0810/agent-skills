# Self-Improvement Loop

Use this reference when the owner flags that something was done wrong, a delegated thread drifted, or the orchestrator identifies a repeatable process failure.

## Self-Improvement Loop

When a mistake is identified:

1. Stop and classify the failure.
2. Correct immediate local state if safe.
3. Identify the missing rule or gate.
4. Decide where the learning belongs.
5. Add or update behavior audit coverage when the mistake is repeatable.
6. Do not leave important workflow lessons only in chat memory.

## Learning Placement

Place durable lessons where they can be enforced:

- `wp-product-orchestrator` skill: cross-product orchestration behavior.
- Shared reference: reusable protocol across skills or products.
- Repo `AGENTS.md`: repo-specific agent workflow, branch rules, validation gates.
- Repo `PRODUCT.md`, `ROADMAP.md`, or `RELEASE.md`: product truth, roadmap intent, release process.
- ADR: material architecture or product decision.
- GitHub issue: actionable product/engineering work.
- Automation memory: recurring audit/check-in learning that should be reused by automation.

## Failure Classification

Use concrete labels:

- Source-of-truth drift.
- Missing GitHub issue-first intake.
- Missing branch/base proof.
- Delegation before strategy.
- Missing delegation after strategy.
- Portfolio coverage drift.
- Portfolio execution drift.
- Product thread topology drift.
- Scope creep or over-engineering.
- Missing owner approval.
- Release train violation.
- Missing validation or live proof.
- Missing GitHub communication.
- Token waste from loading irrelevant references.
