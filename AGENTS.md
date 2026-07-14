# Agent Skills Repository Contract

## Scope

This repository owns reusable Agent Skills, shared references, eval specifications, validation scripts, and install templates. Product-specific rules belong in product repositories; transient portfolio state belongs in the governed portfolio manifest or automation definition.

## Workflow

- Start with `git status --short --branch`, current `origin/main`, open PRs, and overlapping local branches.
- Publish validated changes to `main` directly. Do not create feature branches or PRs for this repository unless the owner explicitly requests review or repository protection makes direct publication impossible.
- Preserve unrelated user changes. Never reset, discard, or delete branches/worktrees without explicit approval.
- Keep `SKILL.md` as the compact execution kernel. Put mode detail in one-level routers/references and avoid second-level hidden expertise.
- Before adding a rule, duplicate-screen skills, references, evals, open/recent PRs, and local unpublished branches.
- Update behavior/eval coverage for repeatable owner corrections. Structural string checks do not replace fresh-agent forward tests.
- Keep generic route-budget and scenario-inventory contracts in `agent-harness.config.json`, backed by the exact `agent-harness` commit pinned in `package-lock.json`. Keep WordPress skill-specific section and routing policy in local audits.
- Commit scoped validated changes and push `main` after validation. The owner has established direct-to-`main` as the standing publication policy for `agent-*` repositories; branch or PR creation now requires an explicit exception.

## Required Validation

Run the commands in `TESTING.md`. Any authority, routing, release, hallucination, design, or self-learning change also requires fresh-agent scenarios for the changed role and a concise commit or durable evidence note.

## Review Priorities

Findings first: unsafe authority, lost expertise/reachability, wrong routing, unverified claims, missing proof, token-route regressions, and stale transient policy. Avoid broad wording churn when a router, deterministic audit, or scenario closes the gap more cheaply.
