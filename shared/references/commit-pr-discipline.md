# Commit And PR Discipline

Use this reference before committing, pushing, opening a PR, updating a PR body, or handing off product work.

## Branch Discipline

- `main` is production release space only. Never push development work directly to `main`.
- `develop` is for unmilestoned development integration or as the verified source for creating missing milestone branches.
- Milestone-based work must create or use `release/<milestone-number>` branches from the verified development base and target issue PRs into that release branch.
- Release branches merge to `main` only after explicit owner release approval.
- Never rely on GitHub's default base; prove and set the PR base explicitly.

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
- Risk and rollback notes.
- Release impact.
- Delegated thread/worktree reference when applicable.
- Owner decisions needed, if any.

PRs must not:

- Rely on GitHub's default base.
- Target `main` for development or milestone work.
- Close issues accidentally when targeting a branch that will not auto-close them.
- Claim release readiness without release-train verification.
- Merge themselves unless explicitly authorized.

Use closing keywords only when the PR fully resolves the linked issue and targets a branch where closure behavior is intended.

## Worker PR Rule

Every issue implementation should be done by a worker using `wp-expert`, a Codex-created worktree, one issue, one branch, and one PR. Workers must not perform release actions, push directly to `main`, close issues, merge PRs, retarget milestones, or subdelegate.
