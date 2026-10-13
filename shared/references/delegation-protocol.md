# Delegation Protocol

Use before delegation prompts; CTO owns portfolio control, PO product plans.

## Plan Before Delegation

No worker starts without role, product/repo, strategy, scope/AC/non-goals, branch/base, validation, proof environment/mutation, risks, owner decisions.

PR per issue unless release/validation boundaries cross. Maintain one versioned task packet in issue/repo: scope/AC/non-goals, owners, source/design IDs, branch/base, risk, proof matrix, evidence index, proof environment/mutation level. Prompts carry pointer/revision/role/delta; workers replan only invalidated assumptions. Append head-bound proof dispositions. Cached packets never replace approval or live GitHub state.

## Thread Boundary

Portfolio control routes execution to the product PO. Do not archive visible product-control threads without owner request; only reconciled Codex-created workers may be archived.

Use an in-task subagent by default. Create a new user-visible Codex task/thread only when the owner explicitly requests one; environment/tool constraints do not authorize it. When explicitly authorized, a visible worker is an execution room, not a control room: no roadmap authority, direct product-thread contact except through CTO reconciliation, or release/publish/merge/pricing/licensing/privacy/security/public-contract decisions.

For owner-adopted roles, preserve authorized long-lived roles; create disposable `<Product> Worker <Issue or Outcome>` tasks only within visible-task authorization. Record each returned thread ID; title/project alone cannot identify archive/recovery targets. Protect Planner, PO, Review, Test & Proof, and Release Readiness.

Worker lifecycle owner is the creator. CTO- or PO-created workers remain that creator's responsibility for scope, proof, reconciliation, and archive/delete the disposable worker. POs report blockers, readiness changes, cross-product/process concerns, or owner decisions.

## Direct Execution Boundary

Control threads handle rehydration, screened intake, decision briefs, status synthesis, and sub-delegation-sized fixes.

With two or more independent bounded issues/PR blockers, or one needing parallel implementation/evidence, the CTO weighs bounded delegation against coordination cost, evidence independence, and one-writer ownership. Keep trivial sequential work direct; delegate when quality/time improves.

Once clear, delegate implementation, CI/dependency/workflow investigation, or evidence gathering.

When delegation affects outcome/blockers, state the decision and reason. Optional label:

```text
Delegation decision: Delegated|Direct|Deferred - <short reason>
```

Use `Direct` when scope/dependencies/cost/evidence favor it; `Deferred` when a plan/blocker prevents delegation.

Use an in-task subagent for narrow stateful fixes/audits/cleanup/docs/investigation/validation when available; keep direction, release scope, priority, customer decisions, and product context in the PO. If only a visible task can do it, ask first and continue independent work.

Before declaring delegation unavailable, use tool discovery for project/thread/worktree/subagent tools. Look for `list_projects`, `create_thread`, `fork_thread`, `send_message_to_thread`, worktree/subagent tools, and shell/manual git worktree capability.

## Worktree Creation Guard

Before an app-managed worktree, verify saved project/source `cwd` is the plugin repo root:

```bash
git rev-parse --show-toplevel
```

Exact-project preflight: the saved project path must equal `git rev-parse --show-toplevel`. Broad `wp-content` roots are unusable; choose an exact project or report `setup-blocked: missing exact repo project`.

Do not create issue/worktree checkouts directly as visible plugin folders under `wp-content/plugins`. Keep worktrees outside the install. Runtime proof may keep exactly one visible canonical plugin folder per product per instance; extra worktrees/copies stay non-scanned.

Pass an explicit verified base. After creation, verify readability, `git worktree list`, intended branch/base, and not detached/production `main`.

If a worktree fails to materialize or lands detached/wrong-base, mark `unusable worktree`; do not retry until root/base is fixed.

## Worktree Lifecycle Route

Before creation and after reconciliation, apply `worktree-storage-lifecycle.md`: classify entries, prove remote reachability and clean disposable ownership, then remove or retain with reason. UI proof is needed only when cleanup changes an active WordPress screen.

## Unblock-First Recovery Ladder

`Setup-blocked` starts recovery; it is not a stop condition.

Choose the recovery path by work type:

- Research, GitHub issue intake, support/forum triage, Advanced View checks, docs planning, and PR/status synthesis: do directly in the product thread.
- Read-only code mapping or evidence: use subagent/explorer tools or same-thread read-only inspection.
- Code changes: first try exact saved repo-root Codex project worktree. If missing, try manual `git worktree` from the exact plugin repo root with a clean base, or a bounded worker/subagent on that path.

Recover safe setup problems through commands/allowed escalation. Notify the owner only when the remaining action is owner-only: app setup, user-thread recovery, branch-model change, or release-sensitive action.

Final status must not stop at "blocked because X". Use either:

- `Recovered by doing Y; next work is Z`.
- `Owner action required: approve/perform Y; meanwhile I completed A/B/C that did not need Y`.

Stale active turn handling: if a product orchestrator has an older active/inProgress turn, an empty completed turn, `systemError`, missing proof, wrong path/base/model lane, repeated owner-instruction drift, or a pending worktree did not materialize, classify `Product thread topology drift`, escalate, and do not queue more work into that thread.

Missing milestone due dates are metadata, not blanket blockers. With clear scope and safe milestone/branch/base evidence, delegate; brief only unsafe ambiguity.

Dirty or behind primary checkouts block direct edits there. They do not block a fresh scoped Codex worktree worker from a clean upstream branch when branch/base evidence is safe.

When delegation is deferred, report the exact hard blocker: issue number, missing branch/base, production/beta release approval, missing tool/project, or unsafe checkout state. For an explicit branch-model conflict, prepare a decision brief instead of passive polling.

## Delegation Ownership Boundary

Control owns plan, base, GitHub/proof synthesis, push authorization, decisions, issue closure, readiness.

Workers own bounded implementation/mapping/review/triage/investigation/evidence. No release, publish/deploy, issue close, or milestone retarget; subdelegation requires parent authorization of a bounded role and capacity.

Prefer in-task subagents for subtasks inside the current request. Create user-visible Codex tasks only when explicitly requested by the owner; a missing subagent, tool, project, or runtime does not authorize a visible task as a workaround. Never archive user-created control or skill threads.

## Delegated Thread Prompt

Every prompt includes:

- Assigned role (`Planner`, implementation worker, `Engineering Review`, or `Release Readiness`) plus outcome name.
- Exact product/repo, scope, and path; never collapse sibling products into a shared identity.
- Or explicit no-edit boundary when read-only.
- Issue URL, milestone, and branch/base evidence.
- Issue branch name and PR base; never direct `main` for development work.
- Allowed/forbidden scope/files and validation commands.
- Declared proof environment, exact target, mutation level, allowed fixtures, and cleanup owner; new Studio creation is owner-gated.
- Screenshot requirement when admin, editor, frontend, style, layout, UX, or other design-visible output changes; include evidence or exact proof gap.
- Suggested model/reasoning when useful.
- Hard gates: no merge, release, issue close, milestone retarget, push to `main`, protected archive, product decision, or subdelegation unless parent CTO asks.
- Creating another user-visible task requires explicit owner authorization.
- Stop condition and summary requirements.

Use worktrees for parallel implementation/CI branch-drift risk; prefer read-only mapping/evidence workers.

## Delegated Thread Lifecycle

Document strategy first; use GitHub comments only for durable transitions. Creator verifies diff/proof, reconciles PR/issue/product state and lessons, then archives/deletes the worker.

For an owner-approved dedicated product topology, apply the exact-ID automatic archive and proof gates in `product-development-role-topology.md`; never treat push alone as completion.

## Worker Reconciliation Checklist

After worker output, PR merge/closure, or abandonment:

- Inspect diff/evidence, issue, branch/base, and PR state.
- Confirm proof or exact gap.
- Update GitHub only for state transitions, blockers, deferrals, or owner questions.
- Apply storage lifecycle: remove approved eligible worktrees or record retention reason/review trigger.
- Stop/update temporary release/CI heartbeats.
- Select next train item or release evidence.
- Final worker summary covers work done, files/issues/PRs touched, validation/proof, blockers, risks, and handoff needs.

If CTO repeats implementation during heartbeat, classify `Missing delegation after strategy`; delegate next bounded task when possible; record learning in skill/reference or repo docs, not chat.
