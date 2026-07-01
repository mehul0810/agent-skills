# Delegation Protocol

Use before creating product-orchestrator threads, Codex worker threads, worktrees, or subagent prompts. `wp-portfolio-cto` owns cross-product control; `wp-product-orchestrator` owns one product's execution plan.

## Plan Before Delegation

Plan before delegation. No delegated agent or thread should start until the parent portfolio/product control thread has prepared:

- Strategy.
- Scope.
- Acceptance criteria.
- Non-goals.
- Branch/base plan.
- Validation plan.
- Risks.
- Owner decision needs.

Each issue should normally get one PR. Split issues when scope crosses independent release, product, or validation boundaries.

## Thread Boundary

Portfolio control threads should not do product-level work by default. Route product execution to the relevant long-lived product-orchestrator thread.

Product-orchestrator threads are user-visible control threads for one plugin and must not be archived unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after PR/task reconciliation.

## Direct Execution Boundary

The portfolio or product control thread may directly handle only the smallest orchestration actions:

- Source-of-truth rehydration.
- Duplicate-screened issue intake.
- Owner decision briefs.
- PR/body/status synthesis.
- Very small single-issue fixes where delegation overhead is clearly higher than execution.

Once there are two or more independent bounded issues/PR blockers, or one issue requires implementation/evidence gathering that can run in parallel with CTO oversight, the CTO must delegate at least one bounded task unless it writes why direct execution is better.

After an issue has clear strategy, scope, acceptance criteria, non-goals, branch/base plan, validation plan, risks, and owner decision needs, default to delegation for implementation, CI triage, dependency resolution, workflow investigation, or evidence gathering.

Every CTO heartbeat/check-in must include:

```text
Delegation decision: Delegated|Direct|Deferred - <short reason>
```

Use `Direct` only when work is smaller than delegation overhead, the environment cannot delegate, or the owner asked for direct execution. Use `Deferred` when plan or blocker prevents safe delegation.

Before declaring delegation unavailable, use tool discovery for project/thread/worktree/subagent surfaces. Look for `list_projects`, `create_thread`, `fork_thread`, `send_message_to_thread`, available worktree or subagent tools, and shell/manual git worktree capability when safe.

## Worktree Creation Guard

Before creating an app-managed worker worktree, verify the saved project path or source thread `cwd` is the actual plugin Git repository root:

```bash
git rev-parse --show-toplevel
```

Exact-project preflight: saved Codex project path must equal the plugin repo root from `git rev-parse --show-toplevel`. If the product thread is rooted in `wp-content` or `wp-content/plugins`, do not create app worktrees from it; use an exact repo-root project or report `setup-blocked: missing exact repo project` and prepare a tooling/setup decision brief.

When using app-managed worktrees, pass an explicit verified base branch through the worktree starting state when the tool supports it. After the worker materializes, verify:

- The child thread or worktree is readable.
- The worktree path appears in `git worktree list`.
- The worktree is on the intended branch/base.
- The worktree is not detached or on production `main` for implementation work.

If a pending worktree does not materialize, or it lands detached/wrong-base, classify it as `unusable worktree` and stop retrying the same creation path until the repo-root/project/base problem is fixed.

## Worktree Hygiene

Before creating any new worker worktree, run a lightweight inventory from the owning repo with `git worktree list --porcelain` and classify existing worktrees:

- `active`: tied to an open PR/issue, active Codex thread, current release/CI work, or known owner task.
- `prunable metadata`: missing path or broken gitdir entry that `git worktree prune` can safely clear.
- `stale-clean`: clean, no open PR/issue/thread tie, known worker branch, and reconciled task.
- `dirty/needs-review`: uncommitted, untracked, detached, unknown branch, or unclear ownership.
- `owner/user-owned`: primary checkout or any path likely owned by the user.

After a PR is merged/closed or delegated worker output is reconciled, remove safe `stale-clean` worker worktrees or state why they remain active. Prefer `git worktree remove <path>` and then `git worktree prune` from the owning repo. Do not use raw folder deletion unless worktree metadata is already broken and the Git cleanup command confirms that.

Never remove a worktree that is dirty, tied to an open PR/issue, tied to an active Codex thread, on an unknown branch, or under a user-owned primary checkout without explicit confirmation.

## Unblock-First Recovery Ladder

`Setup-blocked` is not a stop condition by itself. It is an internal classification that starts recovery.

Choose the recovery path by work type:

- Research, GitHub issue intake, support/forum triage, Advanced View checks, docs planning, and PR/status synthesis: do directly in the product thread. No worktree required.
- Read-only code mapping or evidence: use available subagent/explorer tools, or same-thread read-only inspection when safe.
- Code changes: first try exact saved repo-root Codex project worktree. If missing, try another safe route: manual `git worktree` from the exact plugin repo root with verified clean base, or a bounded worker/subagent operating on that explicit worktree/path, subject to sandbox and approval rules.

If a repo setup problem can be solved safely through commands or an allowed escalation request, attempt recovery instead of reporting a blocker. Notify the owner only when the remaining action is owner-only: adding a saved Codex project in the app UI, approving recovery/replacement of a user-created stale product thread, branch-model changes, or privileged/destructive/release-sensitive actions.

Final status must not stop at "blocked because X". Use either:

- `Recovered by doing Y; next work is Z`.
- `Owner action required: approve/perform Y; meanwhile I completed A/B/C that did not need Y`.

Stale active turn handling: if a product orchestrator has an older active/inProgress turn, or a pending worktree did not materialize, classify `Product thread topology drift`, escalate to the portfolio thread, and do not launch more work or queue follow-ups into the stuck thread.

Missing milestone due dates are metadata decisions, not blanket implementation blockers. If an existing issue has clear scope plus safe milestone/branch/base evidence, delegate implementation and document or separately brief only unsafe ambiguity.

Dirty or behind primary checkouts block direct edits in that checkout. They do not block a fresh scoped Codex worktree worker from a clean upstream branch when branch/base evidence is safe.

When delegation is deferred, report the exact hard blocker: issue number, missing branch/base, production/beta release approval, missing tool/project, or unsafe checkout state. For an explicit branch-model blocker such as OneSMTP #73, prepare a decision brief instead of passive polling.

## Delegation Ownership Boundary

The portfolio or product control thread owns final plan, branch/base choice, PR body, GitHub comments, validation synthesis, commits, push authorization, owner decisions, issue closure decisions, and release readiness.

Delegated workers own bounded implementation, mapping, review, CI/test triage, dependency resolution, workflow investigation, or evidence collection. They must not create production/beta releases, publish/deploy, close issues, retarget milestones, or subdelegate.

Prefer multi-agent/subagent delegation for subtasks inside the current request. Create user-visible Codex threads only when the owner explicitly requests them or the environment supports that as the intended workflow. Never archive user-created control or skill threads.

## Delegated Thread Prompt

Every delegated thread prompt must include:

- Product/repo name.
- Repo path.
- GitHub issue URL.
- Target milestone.
- Branch/base evidence.
- Issue branch name and PR base; never direct `main` for development work.
- Allowed scope.
- Forbidden actions.
- Expected files or areas to inspect.
- Expected validation commands.
- Screenshot requirement when admin, editor, frontend, style, layout, UX, or other design-visible output changes; include screenshot evidence in the PR or state the exact proof gap.
- Output format.
- Explicit instruction: do not merge, release, close issues, retarget milestones, push to `main`, archive protected product/control threads, or make product decisions.
- Explicit instruction: no subdelegation unless the parent CTO thread asks.

Use worktrees when parallel implementation or CI repair would otherwise risk branch drift. Prefer read-only delegated workers for mapping, evidence, and review. Use narrow fixer workers only after the CTO thread has isolated files, behavior, and acceptance checks.

## Delegated Thread Lifecycle

Before delegation, document strategy in the parent thread and write GitHub comments only for durable state transitions. After worker return, inspect diff/evidence, confirm screenshot proof or proof gap, confirm validation, update PR/issue when needed, and make the final recommendation.

## Worker Reconciliation Checklist

After worker output, PR merge/closure, or abandoned delegation, reconcile before unrelated work:

- Inspect diff/evidence, target issue, branch/base, and PR state.
- Confirm validation, CI, screenshots/browser proof, package proof, or exact proof gap.
- Update GitHub only for state transitions, blockers, deferrals, or owner questions.
- Classify remaining scope: implementation-ready, merge-ready, owner-gated, wrong-base/recovery, blocked, or deferrable.
- Remove/document safe stale-clean worktrees and prunable metadata; never remove dirty, unknown, owner-owned, or active worktrees without approval.
- Stop/update temporary release/CI heartbeats.
- Select the next train item or produce release-ready evidence.

If the CTO catches itself doing repeated direct implementation during a heartbeat, classify it under the self-improvement loop as `Missing delegation after strategy`, correct course by delegating the next bounded task when possible, and route the learning into the skill/reference or repo docs rather than only chat memory.
