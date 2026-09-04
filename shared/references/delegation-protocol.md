# Delegation Protocol

Use before creating worker threads, worktrees, or subagent prompts. `wp-portfolio-cto` owns portfolio control; `wp-product-orchestrator` owns the product plan.

## Plan Before Delegation

Plan before delegation. No worker starts without role contract, exact product/repo identity, strategy, scope, acceptance criteria, non-goals, branch/base, validation, proof environment/mutation level, risks, and owner decision needs.

Use one PR per issue unless scope crosses release or validation boundaries. Push planning into the issue body and delegated prompt so workers replan less.

## Thread Boundary

Portfolio control routes product execution to the product PO. User-visible product control threads must not be archived unless the owner asks; only reconciled Codex-created workers may be archived.

`Worker Threads` is the project for execution rooms. Create `CTO Worker <Task Name>` for small stateful execution. These workers are execution rooms, not control rooms: no roadmap authority, no direct product-thread contact except through CTO reconciliation, and no release/publish/merge/pricing/licensing/privacy/security/public-contract decisions.

When the owner adopts dedicated roles for a product, PO instead creates disposable `<Product> Worker <Issue or Outcome>` tasks in that same saved product project. Record each returned thread ID; project/title matching alone is insufficient for archive or recovery. Keep Planner, PO, Review, Test & Proof, and Release Readiness tasks protected and long-lived.

Worker lifecycle owner is the creator. CTO- or PO-created workers remain that creator's responsibility for scope, proof, reconciliation, and archive/delete. POs report only blockers, release-readiness changes, cross-product/process concerns, or owner decisions.

## Direct Execution Boundary

Control threads directly handle only rehydration, duplicate-screened intake, decision briefs, status synthesis, and fixes smaller than delegation overhead.

Once there are two or more independent bounded issues/PR blockers, or one issue needs parallel implementation/evidence work, the CTO must delegate at least one bounded task unless it writes why direct execution is better.

Once the plan is clear, delegate implementation, CI/dependency/workflow investigation, or evidence gathering.

Every CTO heartbeat/check-in must include:

```text
Delegation decision: Delegated|Direct|Deferred - <short reason>
```

Use `Direct` only when work is smaller than delegation overhead, delegation is unavailable, or the owner asked. Use `Deferred` when a plan/blocker prevents delegation.

Use a `Worker Threads` execution room for narrow stateful fixes/audits/cleanup/docs/investigation/validation; keep direction, release scope, priority, customer decisions, and product context in the PO.

Before declaring delegation unavailable, use tool discovery for project/thread/worktree/subagent tools. Look for `list_projects`, `create_thread`, `fork_thread`, `send_message_to_thread`, worktree/subagent tools, and shell/manual git worktree capability.

## Worktree Creation Guard

Before an app-managed worktree, verify the saved project/source `cwd` is the plugin repo root:

```bash
git rev-parse --show-toplevel
```

Exact-project preflight: the saved project path must equal `git rev-parse --show-toplevel`. Broad `wp-content` roots are unusable; choose an exact project or report `setup-blocked: missing exact repo project`.

Do not create issue/worktree checkouts directly as visible plugin folders under `wp-content/plugins`. Keep worktrees outside the install. Runtime proof may keep exactly one visible canonical plugin folder per product per instance; extra worktrees/copies stay non-scanned.

Pass an explicit verified base when supported. After materialization, verify readability, `git worktree list`, intended branch/base, and not detached/production `main`.

If a pending worktree does not materialize, or it lands detached/wrong-base, classify it as `unusable worktree` and stop retrying that path until the root/base problem is fixed.

## Worktree Lifecycle Route

Before creation and after reconciliation, apply `worktree-storage-lifecycle.md`: classify entries, prove remote reachability and clean disposable ownership, then remove or retain with reason. UI proof is needed only when cleanup changes an active WordPress screen.

## Unblock-First Recovery Ladder

`Setup-blocked` is not a stop condition by itself. It is an internal classification that starts recovery.

Choose the recovery path by work type:

- Research, GitHub issue intake, support/forum triage, Advanced View checks, docs planning, and PR/status synthesis: do directly in the product thread.
- Read-only code mapping or evidence: use subagent/explorer tools or same-thread read-only inspection.
- Code changes: first try exact saved repo-root Codex project worktree. If missing, try manual `git worktree` from the exact plugin repo root with a clean base, or a bounded worker/subagent on that path.

Recover safe setup problems through commands/allowed escalation. Notify the owner only when the remaining action is owner-only: app setup, user-thread recovery, branch-model change, or release-sensitive action.

Final status must not stop at "blocked because X". Use either:

- `Recovered by doing Y; next work is Z`.
- `Owner action required: approve/perform Y; meanwhile I completed A/B/C that did not need Y`.

Stale active turn handling: if a product orchestrator has an older active/inProgress turn, an empty completed turn, `systemError`, missing proof, wrong path/base/model lane, repeated owner-instruction drift, or a pending worktree did not materialize, classify `Product thread topology drift`, escalate, and do not queue more work into that thread.

Missing milestone due dates are metadata decisions, not blanket implementation blockers. If an issue has clear scope plus safe milestone/branch/base evidence, delegate implementation and brief only unsafe ambiguity.

Dirty or behind primary checkouts block direct edits there. They do not block a fresh scoped Codex worktree worker from a clean upstream branch when branch/base evidence is safe.

When delegation is deferred, report the exact hard blocker: issue number, missing branch/base, production/beta release approval, missing tool/project, or unsafe checkout state. For an explicit branch-model conflict, prepare a decision brief instead of passive polling.

## Delegation Ownership Boundary

Control owns final plan, branch/base, PR/GitHub state, proof synthesis, push authorization, decisions, issue closure, and release readiness.

Workers own bounded implementation/mapping/review/triage/investigation/evidence. No release, publish/deploy, issue close, milestone retarget, or subdelegation.

Prefer multi-agent/subagent delegation for subtasks inside the current request. Create user-visible Codex threads only when the owner explicitly requests them or the environment requires it. Never archive user-created control or skill threads.

## Delegated Thread Prompt

Every delegated thread prompt must include:

- Assigned role (`Planner`, implementation worker, `Engineering Review`, or `Release Readiness`) plus outcome name.
- Exact product/repo name, task scope, and repo path; do not collapse sibling products into a shared parent identity.
- Or explicit no-edit boundary when read-only.
- GitHub issue URL plus milestone and branch/base evidence.
- Issue branch name and PR base; never direct `main` for development work.
- Allowed/forbidden scope, files, and validation commands.
- Declared proof environment, exact target, mutation level, allowed fixtures, and cleanup owner; new Studio creation is owner-gated.
- Screenshot requirement when admin, editor, frontend, style, layout, UX, or other design-visible output changes; include evidence or exact proof gap.
- Suggested model/reasoning when useful.
- Hard gates: no merge, release, issue close, milestone retarget, push to `main`, protected archive, product decision, or subdelegation unless the parent CTO thread asks.
- Stop condition and summary requirements.

Use worktrees when parallel implementation or CI repair risks branch drift. Prefer read-only workers for mapping/evidence.

## Delegated Thread Lifecycle

Document strategy before delegation; use GitHub comments only for durable transitions. On return, the creator verifies diff/proof, reconciles PR/issue/product state and lessons, then archive/delete the disposable worker.

For an owner-approved dedicated product topology, apply the exact-ID automatic archive and proof gates in `product-development-role-topology.md`; never treat push alone as completion.

## Worker Reconciliation Checklist

After worker output, PR merge/closure, or abandonment:

- Inspect diff/evidence, target issue, branch/base, and PR state.
- Confirm validation/proof or the exact gap.
- Update GitHub only for state transitions, blockers, deferrals, or owner questions.
- Apply the storage lifecycle: remove approved cleanup-eligible worktrees or record the exact retention reason and review trigger.
- Stop/update temporary release/CI heartbeats.
- Select the next train item or release-ready evidence.
- Final worker summary covers work done, files/issues/PRs touched, validation/proof, blockers, risks, and handoff needs.

If the CTO catches itself doing repeated direct implementation during a heartbeat, classify it under the self-improvement loop as `Missing delegation after strategy`, correct course by delegating the next bounded task when possible, and route the learning into the skill/reference or repo docs rather than chat memory.
