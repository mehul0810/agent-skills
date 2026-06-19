# Delegation Protocol

Use this reference before creating Codex chat threads, worktrees, or subagent prompts for WordPress product work.

## Plan Before Delegation

Plan before delegation. No delegated agent or thread should start until the CTO thread has prepared:

- Strategy.
- Scope.
- Acceptance criteria.
- Non-goals.
- Branch/base plan.
- Validation plan.
- Risks.
- Owner decision needs.

Each issue should normally get one PR. Split issues when scope crosses independent release, product, or validation boundaries.

## Delegation Ownership Boundary

The CTO thread owns final plan, branch/base choice, PR body, GitHub comments, validation synthesis, commits, push authorization, owner decisions, issue closure decisions, and release readiness.

Delegated threads own bounded implementation, mapping, review, CI/test triage, or evidence collection. They must not merge, release, close issues, retarget milestones, or make product decisions.

## Delegated Thread Prompt

Every delegated thread prompt must include:

- Product/repo name.
- Repo path.
- GitHub issue URL.
- Target milestone.
- Branch/base evidence.
- Allowed scope.
- Forbidden actions.
- Expected files or areas to inspect.
- Expected validation commands.
- Output format.
- Explicit instruction: do not merge, release, close issues, retarget milestones, or make product decisions.
- Explicit instruction: no subdelegation unless the parent CTO thread asks.

Use worktrees when parallel implementation or CI repair would otherwise risk branch drift. Prefer read-only delegated threads for mapping, evidence, and review. Use narrow fixer threads only after the CTO thread has isolated files, behavior, and acceptance checks.

## Delegated Thread Lifecycle

Before delegation, comment or document the strategy when it changes the issue state. After delegated work returns, the CTO thread must inspect the diff/evidence, run or confirm validation, update the PR/issue, and make the final recommendation. Once the PR is merged and the issue state is reconciled, archive the related delegated thread when supported by the environment.
