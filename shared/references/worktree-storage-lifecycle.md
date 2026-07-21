# Worktree Storage Lifecycle

Use only when creating a worktree, reconciling completed work, or reviewing local-storage pressure. Product POs own repo cleanup; portfolio CTO reports cross-product pressure and drift.

## Completion Gate

A merged or closed PR does not finish the local execution lifecycle. After remote state and task acceptance are verified, either remove the disposable worker worktree or record a concrete retention reason and review trigger. Limited local storage makes indefinite clean-worktree retention a process defect.

Before creating another worktree and after each worker/PR reconciliation, run `git worktree list --porcelain` from the owning repo. Classify each entry:

- `active`: open issue/PR, active worker/thread, release/proof hold, or current owner task.
- `cleanup-eligible`: agent-created, clean, known branch, accepted/reconciled, remote PR merged or closed, and every needed commit reachable from a verified remote ref.
- `prunable metadata`: broken record that Git confirms can be pruned.
- `dirty/needs-review`: modified or untracked files, detached/unknown history, or uncertain ownership.
- `owner/user-owned`: primary checkout or owner-managed path.

## Eligibility Proof

Do not infer cleanup from PR state alone. For each candidate verify:

1. Exact path and owning repository.
2. Clean status, including no untracked files.
3. PR/issue and worker thread are reconciled; no active release, CI, or proof dependency remains.
4. Remote commit reachability is proved: the worktree HEAD and any required commits exist on the verified remote merge/base or retained remote branch.
5. The path is disposable and agent-created, not a primary or owner-owned checkout.

Any failed or unknown check protects the worktree. Report the exact failed condition rather than repeatedly rescanning it.

## Cleanup Transaction

Batch verified candidates by repository into one compact cleanup manifest: path, branch/HEAD, remote PR, clean/reachability evidence, estimated size when storage pressure is material, and disposition. This reduces repeated approvals and tool calls.

When the command authority permits the reviewed cleanup, run `git worktree remove <path>` without `--force`, then `git worktree prune` from the owning repo and verify the entry/path is gone. Never use raw folder deletion for a valid worktree. Local branch deletion is separate, destructive, and not required to reclaim the worktree files; perform it only under its own approval and merged-history proof.

Do not run broad `git clean`, force removal, garbage collection, or owner-path cleanup as a shortcut. Dirty, active, unknown, proof-held, and owner-owned entries require explicit owner review. If cleanup cannot run now, retain one reason, owner action, and next review trigger instead of leaving it silently active.

## Reporting

Keep normal check-ins compact:

- `Removed`: count and paths; storage reclaimed when measured.
- `Retained`: count plus only exceptional reasons.
- `Pressure`: material free-space risk or repeated cleanup drift.

No notification is needed when routine eligible cleanup succeeds and no risk or owner decision remains. Escalate repeated retained clean worktrees as `Worktree storage lifecycle drift`.
