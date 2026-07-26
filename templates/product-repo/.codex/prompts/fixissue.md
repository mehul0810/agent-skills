# /fixissue

Use `$wp-product-orchestrator` to coordinate one issue end-to-end within current authorization.

1. Read issue, comments, labels, milestone, product docs, and release branch policy.
2. Prove the correct PR base from milestone/release branch.
3. Reproduce or identify root cause.
4. Route implementation to `$wp-plugin-expert`, `$wp-theme-expert`, or `$wp-site-expert`; use `$wp-expert` only if ownership is ambiguous.
5. Use `$wp-quality-reviewer` for a focused quality pass and `$behavior-validator` for independent observable proof when risk warrants them.
6. Add/update tests and run focused validation plus WordPress live proof for the changed boundary.
7. Keep the worker to one issue, branch, worktree, and PR. Commit focused changes; push/create the PR only when authorized.
8. Report proof, residual risk, adjacent findings, and the exact next permission if blocked.
