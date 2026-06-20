# Delegation Protocol

Use this reference before creating product-orchestrator threads, Codex worker threads, worktrees, or subagent prompts for WordPress product work.

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

Use `Direct` only when the task is smaller than the delegation overhead, the environment cannot safely delegate, or the owner explicitly asked the CTO thread to execute directly. Use `Deferred` when the plan is not yet clear enough to delegate or a blocker prevents safe delegation.

Before declaring delegation unavailable, use tool discovery for project/thread/worktree/subagent surfaces. Look for `list_projects`, `create_thread`, `fork_thread`, `send_message_to_thread`, and available worktree or subagent tools when they are not already loaded.

## Worktree Creation Guard

Before creating an app-managed worker worktree, verify the saved project path or source thread `cwd` is the actual plugin Git repository root:

```bash
git rev-parse --show-toplevel
```

Exact-project preflight: the saved Codex project path must exactly equal the plugin repo root returned by `git rev-parse --show-toplevel`. If the product thread is rooted in a broader WordPress folder such as `wp-content` or `wp-content/plugins`, do not call `create_thread` or `fork_thread` with a worktree environment from that thread. App-managed worktree setup can fail or land on the wrong repository/base. Use an exact plugin repo-root saved project when available; otherwise report `setup-blocked: missing exact repo project` as the hard blocker and prepare a tooling/setup decision brief.

When using app-managed worktrees, pass an explicit verified base branch through the worktree starting state when the tool supports it. After the worker materializes, verify:

- The child thread or worktree is readable.
- The worktree path appears in `git worktree list`.
- The worktree is on the intended branch/base.
- The worktree is not detached or on production `main` for implementation work.

If a pending worktree does not materialize, or it lands detached/wrong-base, classify it as `unusable worktree` and stop retrying the same creation path until the repo-root/project/base problem is fixed.

Setup-blocked cooldown: when exact project setup is missing, product heartbeats must avoid repeated full rehydration and must not retry worker creation. Return concise `DONT_NOTIFY/setup-blocked` with the missing exact repo-root project and next owner action unless a new owner/product source-of-truth signal appeared.

Stale active turn handling: if a product orchestrator has an older active/inProgress turn, or a pending worktree did not materialize, classify `Product thread topology drift`, escalate to the portfolio thread, and do not launch more work or queue follow-ups into the stuck thread.

Missing milestone due dates are owner decisions, not blanket implementation blockers. If an existing issue has clear scope plus safe milestone/branch/base evidence, delegate implementation and prepare a separate due-date decision brief.

Dirty or behind primary checkouts block direct edits in that checkout. They do not block a fresh scoped Codex worktree worker from a clean upstream branch when branch/base evidence is safe.

When delegation is deferred, report the exact hard blocker: issue number, missing branch/base, missing owner decision, missing tool/project, or unsafe checkout state. For an explicit branch-model blocker such as OneSMTP #73, prepare an owner decision brief instead of passive polling.

## Delegation Ownership Boundary

The portfolio or product control thread owns final plan, branch/base choice, PR body, GitHub comments, validation synthesis, commits, push authorization, owner decisions, issue closure decisions, and release readiness.

Delegated workers own bounded implementation, mapping, review, CI/test triage, dependency resolution, workflow investigation, or evidence collection. They must not merge, release, close issues, retarget milestones, make owner decisions, or subdelegate.

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
- Output format.
- Explicit instruction: do not merge, release, close issues, retarget milestones, push to `main`, archive protected product/control threads, or make product decisions.
- Explicit instruction: no subdelegation unless the parent CTO thread asks.

Use worktrees when parallel implementation or CI repair would otherwise risk branch drift. Prefer read-only delegated workers for mapping, evidence, and review. Use narrow fixer workers only after the CTO thread has isolated files, behavior, and acceptance checks.

## Delegated Thread Lifecycle

Before delegation, document the strategy in the CTO control thread and only write GitHub comments when the state transition is durable. After delegated work returns, the CTO thread must inspect the diff/evidence, run or confirm validation, update the PR/issue when needed, and make the final recommendation.

If the CTO catches itself doing repeated direct implementation during a heartbeat, classify it under the self-improvement loop as `Missing delegation after strategy`, correct course by delegating the next bounded task when possible, and route the learning into the skill/reference or repo docs rather than only chat memory.
