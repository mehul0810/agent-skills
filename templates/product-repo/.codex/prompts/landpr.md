# /landpr

Use `$wp-product-orchestrator` for a PR landing review. Do not merge unless explicit merge permission exists.

1. Verify clean worktree and PR URL/number.
2. Fetch PR details, comments, files, commits, CI, milestone, and base branch.
3. Confirm base branch matches issue milestone/release target.
4. Review changed files with `$wp-expert` and product docs.
5. Repair only if authorized; preserve contributor credit.
6. Run tests/live proof required by the changed boundary.
7. If merge is authorized and gates pass, merge using repo policy; otherwise provide a decision-ready brief.
