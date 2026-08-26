# Commit And PR Discipline

Use this reference before committing, pushing, opening a PR, updating a PR body, or handing off product work.

## Branch Discipline

- Product repositories keep the verified `main` or documented `master` production branch as stable release space; it must not receive development work directly.
- Owner-managed `agent-*` control-plane repositories are the exception: validated changes commit and push directly to `main` by default. Do not create a feature branch or PR unless the owner explicitly asks for review or repository protection requires that path.
- `develop` is for unmilestoned development integration or as the verified source for creating missing milestone branches.
- Milestone-based work must create or use `release/<release-version>` branches from the verified development base and target issue PRs into that release branch. `<release-version>` is the version/milestone title, not the GitHub milestone ID or sequence number; do not create `release/3` unless the documented release version is literally `3`.
- Release branches merge to the production branch only after explicit owner release approval.
- Production release approval must identify the exact release PR and candidate SHA. Merge that PR into verified `main`/`master` before creating the stable tag/release, then tag that merged SHA; never release from `release/*` and reconcile the production branch afterward.
- Never rely on GitHub's default base; prove and set the PR base explicitly.
- If a wrong milestone-ID branch was created, preserve commits by replaying or reconciling them into the correct release-version branch, retarget open PRs, and do not delete the wrong branch without explicit owner approval.

## Commit Convention

Use this commit format:

```text
type(scope): concise action
```

Examples:

- `feat(mcp): add internal link audit tool`
- `fix(oauth): harden redirect validation`
- `docs(release): clarify beta train gates`
- `test(content): cover internal link audit filters`
- `chore(ci): tighten package validation`

Rules:

- Keep commits scoped.
- Do not mix unrelated issues.
- Reference issue numbers in the PR body, not necessarily every commit subject.
- Commit only intended files.
- Avoid generated noise unless required.
- Do not push unless repo policy or the parent CTO thread authorizes it.
- Do not push to `main` for development work.

## PR Requirements

Every PR must include:

- Linked issue and milestone.
- Base branch evidence.
- Strategy summary.
- Scope.
- Non-goals / intentionally excluded work.
- Files changed.
- Validation commands and results.
- Live proof or proof gap.
- Screenshot evidence for admin, editor, frontend, style, layout, UX, or other design-visible changes, or an explicit reason screenshots could not be captured.
- Risk and rollback notes.
- Release impact.
- Delegated thread/worktree reference when applicable.
- Owner decisions needed, if any.

PRs must not:

- Rely on GitHub's default base.
- Target `main`/`master` for development or milestone work.
- Close issues accidentally when targeting a branch that will not auto-close them.
- Claim release readiness without release-train verification.
- Omit screenshot evidence when the PR changes design-visible output unless the proof gap is explicit.
- Merge themselves unless explicitly authorized.

Use `Fixes` or `Closes` only when the PR fully resolves the linked issue and targets a branch where closure behavior is intended. Partial work uses `Related`; release-branch merges require manual post-merge issue reconciliation.

## Non-Production Merge Rule

Product orchestrators may review and merge scoped, non-draft, green PRs into `develop` or `release/<release-version>` only when the base is correct, validation is current, no explicit current owner stop exists, and live branch-policy evidence proves the target is unprotected. A protected target requires explicit current owner approval; unknown protection status fails closed. If review rules, permissions, or tooling blocks an otherwise authorized merge, report the exact blocker instead of inventing a different owner decision.

## Worker PR Rule

Every issue implementation should be done by a worker using the narrowest relevant WordPress specialist skill (`wp-plugin-expert`, `wp-theme-expert`, `wp-site-expert`, `wp-contributor`, or `content-writer`; `wp-expert` only if ambiguous), a Codex-created worktree, one issue, one branch, and one PR. Workers must not perform release actions, push directly to `main`, close issues, merge PRs, retarget milestones, or subdelegate.
