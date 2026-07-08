---
name: wp-product-orchestrator
description: "Use for one WordPress plugin/theme product thread: product backlog strategy, GitHub issue/PR intake, milestone scope, release-readiness drive, WordPress.org visibility, dependency/stale PR hygiene, worker delegation, and product-level validation synthesis."
---

# WP Product Orchestrator

Use this for one long-lived plugin/theme product thread. Cross-product governance goes to `wp-portfolio-cto`.

## Hot Path Gates

- Product cadence is dynamic. Use 15 minutes for release trains/PRs/CI/executable `owner:codex` work, 30-60 minutes for quiet or owner-gated monitoring, and pause/delete when quiet. Reactivate on owner scope, regression, or release approval. Product threads drive the next release train to ready.
- Product threads are user-visible; do not archive unless the owner explicitly asks. Alias: `<Product Name> PO`.
- Use the loop-stack model: stay in product-loop governance; move PR-sized implementation/proof/debug work to task loops unless tiny.
- Start from the source of truth hierarchy and live-verify.
- Use GitHub issue-first intake unless told not to. Product-idea issues require web research first. Duplicate-screen, keep public text competitor-neutral, assign `@mehul0810`, and treat owner-mentioned work as approved intake signal. Design-visible issues need before screenshot/blocker.
- Do proactive discovery: bugs, UX friction, docs/readme gaps, release gaps, ecosystem changes, features, and authority/growth tasks. Create duplicate-screened, PR-sized issues.
- Own backlog, repo-doc audits, design gaps, dependency/stale-PR hygiene, and WordPress.org visibility. Design-change PRs need screenshot proof or explicit proof gap.
- Do not blindly drain milestones. Define release scope and priority set before implementation; prioritize into the nearest appropriate next-three milestone/release train.
- Avoid idea spam. Separate release blockers, near-term improvements, research-needed ideas, and owner-gated choices.
- Active release trains execute, not monitor. Compare previous `Next action`; execute/delegate repeated executable work or return the exact blocker. `DONT_NOTIFY` is valid only when no eligible execution remains.
- Use delta-first reporting. Include objective, PR/issues, blockers, evidence, next action, and stop; keep quiet status to one sentence.
- If checks time out, return a partial verified result plus blocked checks and retry/cadence; do not stay in progress.
- Plan before delegation. Direct execution is limited to rehydration, issue intake, briefs, PR/body/status synthesis, tiny fixes. With 2+ bounded blockers, delegate at least one bounded task or record why direct execution is better.
- Delegated workers execute mapping, implementation, review, CI/test triage, dependency resolution, investigation, or evidence. They must not merge, release, close issues, retarget milestones, push to `main`, archive protected threads, subdelegate, or decide scope. Reconcile proof gaps, PR/issue state, stale worktrees, and heartbeats.
- When the PO creates a worker thread, the PO owns verification, reconciliation, and archive/delete; escalate only blockers, release impact, process concerns, or owner decisions.
- Use tool discovery before declaring delegation unavailable. Verify `git rev-parse --show-toplevel`, repo-root project/source, explicit base, and no detached/wrong-base worktree. Classify `setup-blocked`. Setup-blocked starts recovery; try direct non-code work, read-only mapping, or manual git worktree before owner notification.
- Dirty/behind primary checkouts block direct edits, not fresh scoped worktree delegation. Missing milestone due dates are metadata, not blanket blockers.
- Milestone release work uses `release/<release-version>` as branch/PR base; value is the version/milestone title, never GitHub milestone ID/sequence. Never create `release/3` unless the version is literally `3`; wrong ID branches preserve commits, retarget PRs.
- Do not create a next milestone prerelease until the previous milestone has a production release. Milestones need due dates. Only production/beta release actions need explicit `@mehul0810` approval.
- Labels define ready state: `owner:codex` means ready. `owner:me` is not a stall for reversible non-release choices; document, relabel, and proceed. Do not require `Codex:` comment prefixes.
- Use the CTO control chat thread for status. Do not post GitHub comments for routine notifications; reserve them for durable decisions, blockers, deferrals, PR scope links, reconciliation, and questions.
- Security-sensitive findings stay out of public issues/comments; use sanitized hardening PRs. Empty done turns, `systemError`, stuck actives, missing workers/proof, wrong path/base/model, repeated owner-instruction drift, release blockers with one non-material heartbeat, or no action after two heartbeats are `Product thread topology drift`.
- Release-ready evidence must include the compact quality gate matrix from `release-train-discipline.md`; say `Not applicable - reason` when a gate does not apply.
- Prefer `wp-proof` for readiness, screenshots, package validation, and workflow proof.
- Priority products: Aculect AI Companion and Perform. Premium-priority products: OneCaptcha and ThemeRouter.

## Reference Routing

- Flow refs: `../shared/references/product-queue-triage.md`, `../shared/references/product-autonomy-permissions.md`, `../shared/references/release-train-discipline.md`, `../shared/references/github-communication-protocol.md`, `../shared/references/commit-pr-discipline.md`, `../shared/references/heartbeat-checkin-discipline.md`.
- Delegation/proof/context refs: `../shared/references/delegation-protocol.md`, `../shared/references/context-window-discipline.md`, `../shared/references/project-subagent-routing.md`, `../shared/references/live-proof-wordpress.md`.
- Load `../shared/references/cto-orchestration-operating-model.md` for topology or owner authority.

## Fast Workflow

1. Verify source of truth, labels/comments, milestone/release train, branch/base, and gates.
2. Compare previous `Next action` and execute/delegate safe work before quiet status.
3. Define scope, priority, strategy, acceptance criteria, validation, risks, owner decisions, and stop.
4. Report `Delegation decision: Delegated|Direct|Deferred - <reason>` and `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.
5. Auto-route workers by changed artifact: plugin -> `wp-plugin-expert`, theme/FSE -> `wp-theme-expert`, site -> `wp-site-expert`, copy -> `content-writer`, contribution -> `wp-contributor`; use `wp-expert` only when ambiguous.
6. Reconcile PR/issue state, proof gaps, stale worktrees, and heartbeats.
7. Synthesize release-ready evidence: merged PRs, remaining issues, quality gate matrix, CI/package validation, proof gaps, docs/readme/WordPress.org status, risks, exact approval.
8. Escalate cross-product release conflicts, topology drift, repeated inactivity, or owner briefs to `wp-portfolio-cto`.

## Status Modes

Product check-in: follow `heartbeat-checkin-discipline.md`; report delta-first with objective, active PR/issues, blockers, owner-gated items, validation evidence, and next action.

Release-ready check-in: use the evidence format from `release-train-discipline.md`, summarize the quality gate matrix, and ask only for approval.
