# Agent Skills Repository Contract

## Scope

This repository owns reusable Agent Skills, shared references, eval specifications, validation scripts, and install templates. Product-specific rules belong in product repositories; transient portfolio state belongs in the governed portfolio manifest or automation definition.

## Workflow

- Start repo work with `git status --short --branch` and the exact requested artifact. Check current `origin/main`, open PRs and overlapping local branches before changes or publication, not for every read-only explanation.
- Publish validated changes to `main` directly. Do not create feature branches or PRs for this repository unless the owner explicitly requests review or repository protection makes direct publication impossible.
- Preserve unrelated user changes. Never reset, discard, or delete branches/worktrees without explicit approval.
- Keep `SKILL.md` as the compact execution kernel. Put mode detail in one-level routers/references and avoid second-level hidden expertise.
- Before adding a rule, duplicate-screen skills, references, evals, open/recent PRs, and local unpublished branches.
- Update behavior/eval coverage for repeatable owner corrections. Structural string checks do not replace fresh-agent forward tests.
- Keep generic route-budget and scenario-inventory contracts in `agent-harness.config.json`, backed by the exact `agent-harness` commit pinned in `package-lock.json`. Keep WordPress skill-specific section and routing policy in local audits.
- Commit scoped validated changes and push `main` after validation. The owner has established direct-to-`main` as the standing publication policy for `agent-*` repositories; branch or PR creation now requires an explicit exception.

## Required Validation

Run the commands in `TESTING.md`. Any authority, routing, release, hallucination, design, or self-learning change also requires fresh-agent scenarios for the changed role and a concise commit or durable evidence note.

## Skill Admission Gate

Add a top-level skill only for a recurring portable workflow, tool boundary, or evidence contract with a distinct trigger, explicit inputs/outputs, failure modes, and safety boundary. Put conditional domain detail in an existing one-level reference, repeated deterministic operations in scripts, product-specific truth in product repo docs, and one-off findings in issues or no durable artifact. Duplicate-screen first and prove the installed or runtime boundary; do not create a skill merely to restate generic engineering judgment.

## Review Priorities

Findings first: unsafe authority, lost expertise/reachability, wrong routing, unverified claims, missing proof, token-route regressions, and stale transient policy. Avoid broad wording churn when a router, deterministic audit, or scenario closes the gap more cheaply.

## Code Review Rules

- **Reachable expertise:** When shortening a skill or moving a reference, preserve a reachable route for each retained capability. A smaller kernel is safe when the owning router still reaches the detail; flag removed or misleading routes, not wording changes alone. Safe path: update callers and prove the affected route with a fresh scenario.
- **Evidence identity:** Changes to baselines, runtime compatibility or proof claims must preserve the original tested revision, artifact identity and limitations. A passing fixture or adapter cannot establish native execution. Safe path: keep historical evidence labeled, use the explicit dependency receipt where eligible, or run fresh proof. Do not flag a correctly labeled blocked or inconclusive result as dishonest success.

These rules supplement ordinary bug review, not replace it. Cite the applicable
rule and concrete changed location for a rule-based finding. Leave safe exceptions
and unrelated changes alone; keep mechanical formatting checks in validation.
