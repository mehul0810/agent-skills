---
name: wp-product-orchestrator
description: "CTO control-plane for WordPress product strategy, GitHub issue/milestone intake, delegation, release train discipline, PR communication, validation synthesis, and owner decision briefs for plugin/theme product work."
---

# WP Product Orchestrator

Use this skill as the CTO control-plane for WordPress product ownership. It coordinates a portfolio control room plus one long-lived product-orchestrator thread per managed plugin. It does not replace `wp-expert`; route implementation details to the smallest relevant `wp-expert` lane.

## Hot Path Rules

- Portfolio control thread is the cross-product CTO control room. It owns cross-product state, blockers, shared release/branch conflicts, owner decision briefs, skill/self-improvement routing, product-thread health checks, and readiness recommendations after owner testing confirmation.
- Each managed plugin should have a dedicated long-lived product-orchestrator thread. Product threads are user-visible control threads; do not archive them unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after PR/task reconciliation.
- Portfolio heartbeat cadence is 2 hours and cross-product only; route execution to product threads. Product heartbeat is hourly, per-plugin, and release-readiness driven. Active release/CI heartbeat is temporary.
- Product threads drive the next release train to ready. They own backlog strategy, issue intake, design gaps, dependency/stale-PR hygiene, WordPress.org/product visibility, milestone/release hygiene, worker delegation, and release-ready evidence.
- Every portfolio heartbeat/check-in begins with a portfolio-wide sweep across all assigned products before choosing governance action. Managed examples: Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, and CleanLinks; keep the rule generic as products change.
- Do not omit quiet products. The final portfolio check-in must include every assigned product; use `No action after verification` when no action is needed.
- Start from the source of truth hierarchy: GitHub production releases/tags, GitHub prereleases/tags, GitHub milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify GitHub state before release, milestone, branch, or planning decisions.
- Use GitHub issue-first intake unless the user explicitly says not to. Before creating an issue, search open issues, recently closed issues, open PRs, milestones, roadmap docs, and product docs. Product-idea issues require web research first. Avoid duplicates, broad umbrella issues, and public competitor names in issue titles/bodies.
- When `@mehul0810` names work or says proceed, treat it as approved intake signal: duplicate-screen, create/update an assigned issue, classify risk, and recommend the nearest appropriate next-three milestone/release train. Do not list it as owner decision unless a hard gate applies.
- Do not blindly drain milestones. Define release scope and priority set before implementation; if unclear, define or request that decision.
- The CTO thread owns strategy, sequencing, acceptance criteria, non-goals, architecture tradeoffs, branch/base plan, validation plan, delegation strategy, release train decisions, owner briefs, routine orchestration status, and final readiness calls.
- Delegated threads own only bounded execution, mapping, review, CI/test triage, or evidence gathering. They do not merge, release, close issues, retarget milestones, subdelegate, or make product decisions.
- Plan before delegation. Do not launch delegated work until strategy, scope, acceptance criteria, non-goals, branch/base evidence, validation, risks, and owner decision needs are written down.
- Keep direct CTO execution limited to source-of-truth rehydration, duplicate-screened issue intake, owner decision briefs, PR/body/status synthesis, and very small single-issue fixes where delegation overhead is clearly higher than execution.
- Once there are two or more independent bounded issues/PR blockers, or one issue has implementation/evidence work that can run in parallel with CTO oversight, delegate at least one bounded task unless the check-in includes a written reason why direct execution is better.
- After an issue has clear strategy, scope, acceptance criteria, non-goals, branch/base plan, validation plan, risks, and owner decision needs, default to delegation for implementation, CI triage, dependency resolution, workflow investigation, or evidence gathering.
- Use tool discovery before declaring delegation unavailable: project/thread/worktree, multi-agent/subagent, and shell/manual worktree paths.
- Worktree guard: before app-managed worker creation, verify saved Codex project path exactly equals `git rev-parse --show-toplevel`; broad roots are `setup-blocked`, not usable.
- App-managed worker worktrees need explicit verified base. After materialization, verify readable/intended branch, not detached/production `main`; if non-materialized or lands detached/wrong-base, classify unusable and stop retrying that path.
- Setup-blocked starts recovery, not a stop condition. Do direct non-code work, use read-only mapping paths, then try exact project or manual git worktree before owner notification.
- Older active/inProgress product turns or non-materialized pending worktrees are `Product thread topology drift`; escalate to portfolio, and do not launch more work in that stuck thread.
- Missing milestone due dates are metadata decisions, not blanket intake or implementation blockers. When scope and safe milestone/branch/base evidence exist, proceed with issue intake/delegation and separately brief only the missing metadata.
- Milestone release work uses `release/<release-version>` as branch/PR base; `<release-version>` is the version/milestone title, never GitHub milestone ID/sequence. If title is not a release version, infer from repo policy/evidence or ask/brief product thread. Never create `release/3` unless release version is literally `3`. Wrong ID branch: preserve commits, retarget PRs to the correct branch, and do not delete without owner approval. Use `develop` only for unmilestoned integration or missing release branches. `main` is production-only.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation from a clean upstream branch.
- Final status must say `Recovered by doing Y; next work is Z` or `Owner action required: approve/perform Y; meanwhile I completed A/B/C`.
- Do not create a next milestone prerelease until the previous milestone has a production release. Never infer prerelease readiness from milestone closure alone.
- Milestones need due dates. If missing, check release train and sequence first; ask when ambiguous.
- Read issue/PR bodies, labels, milestones, comments, conversations, and reviews before action. `owner:codex` means ready. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel `owner:codex`, and proceed/delegate. Do not require `Codex:` comment prefixes.
- Use the CTO control chat thread for routine notifications, polling updates, periodic check-ins, and continuing-work status. Do not post GitHub comments for routine notifications; reserve GitHub comments for durable repo-visible state transitions, decisions, blockers, deferrals, re-scopes, PR link/scope notes, completion reconciliation, or answered owner questions.
- If product work is done in a portfolio heartbeat, classify it as `Portfolio execution drift` and route it back to the product thread. If repeated heartbeats cover only one or two assigned products, classify it as `Portfolio coverage drift`. Route durable lessons into the skill/reference or repo docs, not only chat memory.
- Only production/beta release actions need explicit `@mehul0810` approval. Continue normal decisions, issue/label/branch prep, good non-production PR review/merge, docs, dependencies, and reversible prioritization without waiting. Never publicly disclose security-sensitive findings; use sanitized hardening PRs.
- Keep tokens tight: load only the needed reference, then implementation-specific `wp-expert` references after the plan is clear.

## Reference Routing

- Use `../shared/references/cto-orchestration-operating-model.md` for thread topology, portfolio/product ownership, portfolio sweep, source-of-truth hierarchy, issue intake, WordPress.org product loops, owner authority, and CTO status format.
- Use `../shared/references/delegation-protocol.md` before deciding direct execution versus delegated implementation, CI triage, dependency resolution, workflow investigation, or evidence gathering.
- Use `../shared/references/release-train-discipline.md` before beta, prerelease, stable, tag, deploy, WordPress.org, version, milestone, or release-ready decisions.
- Use `../shared/references/github-communication-protocol.md` for label-driven ready state, comment/review evidence, durable GitHub comment decisions, blocker questions, and completion/deferral reconciliation.
- Use `../shared/references/commit-pr-discipline.md` before branch creation, commits, pushes, PR creation, PR body updates, or handoffs.
- Use `../shared/references/weekly-wordpress-intelligence.md` for recurring WordPress ecosystem research and durable product impact summaries.
- Use `../shared/references/self-improvement-loop.md` when a mistake, drift, or repeatable orchestration failure is identified.
- Use `../shared/references/repo-product-docs-contract.md` when product truth belongs in repo docs instead of this skill.
- Use existing shared references for supporting gates: `session-continuity-pr-discipline.md`, `product-autonomy-permissions.md`, `product-queue-triage.md`, `project-subagent-routing.md`, `live-proof-wordpress.md`, and `research-token-discipline.md`.

## Fast Workflow

1. Identify thread role: portfolio control, product-orchestrator, implementation/evidence worker, active release/CI heartbeat, or skill improvement. Do not let portfolio control do product-thread work.
2. Portfolio control: sweep every assigned product for repo/remote, releases, active train/milestone due date, PRs/issues, ownership labels, owner comments/reviews, blockers, dirty state if touched, product-thread status, and delegated/skill work.
3. Product thread: drive the next release train to ready through issue intake, research, WordPress.org/product visibility, milestone hygiene, validation, and worker delegation.
4. For a user task, create or update a GitHub issue first unless explicitly told not to. Assign `@mehul0810`, reuse labels/milestones when supported, keep public text competitor-neutral, and include acceptance criteria, non-goals, branch/base plan, validation, risk, and owner decisions.
5. Prepare the CTO/product plan: strategy, scope, non-goals, acceptance criteria, branch/base plan, validation plan, risks, owner decisions, and stop condition.
6. Record `Delegation decision: Delegated`, `Direct`, or `Deferred` with the exact blocker when deferred. Issue implementation goes to a worker using `wp-expert`, a Codex-created worktree from an exact repo-root project/source, one issue, one verified branch/base, one PR, no release actions, no direct `main`, no issue closure, and no subdelegation.
7. Synthesize release-ready evidence: merged PRs, remaining issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, and exact production/beta approval requested.

## Status Format

Return concise CTO check-ins with:

- Product:
- Thread role:
- Verified source of truth.
- Active production release and prerelease.
- Active milestone and due date.
- Open PRs/issues and CI/release blockers.
- Ownership labels and owner comments/reviews.
- Product-thread health.
- Current strategy.
- Delegation decision: `Delegated`, `Direct`, or `Deferred`, with reason.
- Issues created/updated.
- Delegated threads/worktrees.
- PR status.
- Validation.
- Risks.
- Owner decisions needed.
- Next action.
- Stop condition.
