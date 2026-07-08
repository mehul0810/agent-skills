# Delegation Protocol

Use before creating worker threads, worktrees, or subagent prompts. `wp-portfolio-cto` owns portfolio control; `wp-product-orchestrator` owns the product plan.

## Plan Before Delegation

Plan before delegation. No worker should start until the parent control thread has prepared:

- Strategy.
- Scope.
- Acceptance criteria.
- Non-goals.
- Branch/base plan.
- Validation plan.
- Risks.
- Owner decision needs.

Use one PR per issue unless scope crosses release or validation boundaries. Push planning into the issue body and delegated prompt so workers replan less.

## Thread Boundary

Portfolio control threads should not do product-level work. Route product execution to the product-orchestrator thread. Product-orchestrator threads are user-visible control threads and must not be archived unless the owner explicitly asks. Only Codex-created workers may be archived after reconciliation.

`Worker Threads` is the project for execution rooms. Create `CTO Worker <Task Name>` for small stateful execution. These workers are execution rooms, not control rooms: no roadmap authority, no direct product-thread contact except through CTO reconciliation, and no release/publish/merge/pricing/licensing/privacy/security/public-contract decisions.

Worker lifecycle owner is the creator. If CTO creates a worker thread, CTO owns scope, verification, reconciliation, and archive/delete. If a PO creates a worker thread, that PO owns scope, verification, reconciliation, and archive/delete. POs report to CTO only for blockers, release-readiness changes, cross-product/process concerns, or owner decisions.

## Direct Execution Boundary

The portfolio or product control thread may directly handle only the smallest orchestration actions: source-of-truth rehydration, duplicate-screened issue intake, owner decision briefs, PR/body/status synthesis, and very small fixes where delegation overhead is higher than execution.

Once there are two or more independent bounded issues/PR blockers, or one issue needs parallel implementation/evidence work, the CTO must delegate at least one bounded task unless it writes why direct execution is better.

After an issue has clear strategy, scope, acceptance criteria, non-goals, branch/base, validation, risks, and owner decision needs, default to delegation for implementation, CI triage, dependency resolution, workflow investigation, or evidence gathering.

Every CTO heartbeat/check-in must include:

```text
Delegation decision: Delegated|Direct|Deferred - <short reason>
```

Use `Direct` only when work is smaller than delegation overhead, delegation is unavailable, or the owner asked. Use `Deferred` when a plan/blocker prevents delegation.

Use a `Worker Threads` execution room for narrow, stateful work such as fixes, audits, cleanup, draft docs, investigations, or validation. Use product PO threads for product direction, release scope, backlog priority, customer-facing decisions or product context. Keep checks and actions inline in CTO.

Before declaring delegation unavailable, use tool discovery for project/thread/worktree/subagent tools. Look for `list_projects`, `create_thread`, `fork_thread`, `send_message_to_thread`, worktree/subagent tools, and shell/manual git worktree capability.

## Worktree Creation Guard

Before creating an app-managed worker worktree, verify the saved project path or source thread `cwd` is the actual plugin repo root:

```bash
git rev-parse --show-toplevel
```

Exact-project preflight: saved Codex project path must equal the plugin repo root from `git rev-parse --show-toplevel`. If the product thread is rooted in `wp-content` or `wp-content/plugins`, do not create app worktrees from it; use an exact repo-root project or report `setup-blocked: missing exact repo project`.

Do not create issue/worktree checkouts directly as visible plugin folders under `wp-content/plugins`. Prefer exact repo-root Codex worktrees outside the install unless the task explicitly requires an installable local plugin path. If runtime proof needs `wp-content/plugins`, keep exactly one visible canonical plugin folder per product per instance and put extra worktrees or proof copies in hidden or non-scanned paths.

When using app-managed worktrees, pass an explicit verified base branch when the tool supports it. After the worker materializes, verify the child is readable, the path appears in `git worktree list`, the branch/base is intended, and the worktree is not detached or on production `main`.

If a pending worktree does not materialize, or it lands detached/wrong-base, classify it as `unusable worktree` and stop retrying that path until the root/base problem is fixed.

## Worktree Hygiene

Before creating any new worker worktree, run `git worktree list --porcelain` and classify worktrees:

- `active`: tied to an open PR/issue, active Codex thread, release/CI work, or owner task.
- `prunable metadata`: broken entry that `git worktree prune` can clear.
- `stale-clean`: clean and reconciled.
- `dirty/needs-review`: uncommitted, detached, unknown, or unclear.
- `owner/user-owned`: primary checkout or user-owned path.

After a PR is merged/closed or delegated worker output is reconciled, remove safe `stale-clean` worker worktrees or state why they remain active. Prefer `git worktree remove <path>` and `git worktree prune` from the owning repo. Avoid raw folder deletion unless Git cleanup confirms broken metadata.

Never remove a worktree that is dirty, tied to an open PR/issue, tied to an active Codex thread, on an unknown branch, or under a user-owned primary checkout without explicit confirmation.

If visible plugin-folder cleanup affects active WordPress admin/plugin screens, include screenshot/proof notes only for the UI-visible state change. Skip proof overhead for filesystem-only cleanup.

## Unblock-First Recovery Ladder

`Setup-blocked` is not a stop condition by itself. It is an internal classification that starts recovery.

Choose the recovery path by work type:

- Research, GitHub issue intake, support/forum triage, Advanced View checks, docs planning, and PR/status synthesis: do directly in the product thread.
- Read-only code mapping or evidence: use subagent/explorer tools or same-thread read-only inspection.
- Code changes: first try exact saved repo-root Codex project worktree. If missing, try manual `git worktree` from the exact plugin repo root with a clean base, or a bounded worker/subagent on that path.

If a repo setup problem can be solved safely through commands or an allowed escalation request, attempt recovery instead of reporting a blocker. Notify the owner only when the remaining action is owner-only: app UI project setup, stale user-created product-thread recovery, branch-model changes, or release-sensitive actions.

Final status must not stop at "blocked because X". Use either:

- `Recovered by doing Y; next work is Z`.
- `Owner action required: approve/perform Y; meanwhile I completed A/B/C that did not need Y`.

Stale active turn handling: if a product orchestrator has an older active/inProgress turn, an empty completed turn, `systemError`, missing proof, wrong path/base/model lane, repeated owner-instruction drift, or a pending worktree did not materialize, classify `Product thread topology drift`, escalate, and do not queue more work into that thread.

Missing milestone due dates are metadata decisions, not blanket implementation blockers. If an issue has clear scope plus safe milestone/branch/base evidence, delegate implementation and brief only unsafe ambiguity.

Dirty or behind primary checkouts block direct edits there. They do not block a fresh scoped Codex worktree worker from a clean upstream branch when branch/base evidence is safe.

When delegation is deferred, report the exact hard blocker: issue number, missing branch/base, production/beta release approval, missing tool/project, or unsafe checkout state. For an explicit branch-model blocker such as OneSMTP #73, prepare a decision brief instead of passive polling.

## Delegation Ownership Boundary

The portfolio or product control thread owns final plan, branch/base choice, PR body, GitHub comments, validation synthesis, commits, push authorization, owner decisions, issue closure, and release readiness.

Delegated workers own bounded implementation, mapping, review, CI/test triage, dependency resolution, workflow investigation, or evidence collection. They must not create releases, publish/deploy, close issues, retarget milestones, or subdelegate.

Prefer multi-agent/subagent delegation for subtasks inside the current request. Create user-visible Codex threads only when the owner explicitly requests them or the environment requires it. Never archive user-created control or skill threads.

## Delegated Thread Prompt

Every delegated thread prompt must include:

- Product/repo name, task scope, and repo path.
- Or explicit no-edit boundary when read-only.
- GitHub issue URL plus milestone and branch/base evidence.
- Issue branch name and PR base; never direct `main` for development work.
- Allowed/forbidden scope, files, and validation commands.
- Screenshot requirement when admin, editor, frontend, style, layout, UX, or other design-visible output changes; include evidence or exact proof gap.
- Suggested model/reasoning when useful.
- Hard gates: no merge, release, issue close, milestone retarget, push to `main`, protected archive, product decision, or subdelegation unless the parent CTO thread asks.
- Stop condition and summary requirements.

Use worktrees when parallel implementation or CI repair risks branch drift. Prefer read-only workers for mapping/evidence.

## Delegated Thread Lifecycle

Before delegation, document strategy in the parent thread and write GitHub comments only for durable transitions. After worker return, the worker creator inspects diff/evidence, confirms proof and validation, updates PR/issue when needed, reconciles product state, extracts durable lessons into issues/docs/skill updates, and archive/delete the disposable worker.

## Worker Reconciliation Checklist

After worker output, PR merge/closure, or abandonment:

- Inspect diff/evidence, target issue, branch/base, and PR state.
- Confirm validation/proof or the exact gap.
- Update GitHub only for state transitions, blockers, deferrals, or owner questions.
- Remove/document safe stale-clean worktrees or prunable metadata.
- Stop/update temporary release/CI heartbeats.
- Select the next train item or release-ready evidence.
- Final worker summary covers work done, files/issues/PRs touched, validation/proof, blockers, risks, and handoff needs.

If the CTO catches itself doing repeated direct implementation during a heartbeat, classify it under the self-improvement loop as `Missing delegation after strategy`, correct course by delegating the next bounded task when possible, and route the learning into the skill/reference or repo docs rather than chat memory.
