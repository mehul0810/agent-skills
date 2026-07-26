# /landpr

Use `$wp-product-orchestrator` for a PR landing review.

1. Verify clean worktree and PR URL/number.
2. Fetch PR details, comments, files, commits, CI, milestone, and base branch.
3. Confirm base branch matches issue milestone/release target.
4. Review with the artifact specialist and product docs; add `$wp-quality-reviewer` for a focused quality audit.
5. Repair only if authorized, preserve contributor credit, and use `$behavior-validator` when independent observable proof is required.
6. Run tests/live proof required by the changed boundary.
7. The PO may merge a reviewed, green, non-draft PR into a verified non-production branch when repo policy allows and no current owner stop exists. Production/main merges and beta/production actions require explicit current approval.
