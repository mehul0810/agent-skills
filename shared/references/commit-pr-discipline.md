# Commit And PR Discipline

Use this reference before committing, pushing, opening a PR, updating a PR body, or handing off product work.

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
- Close issues accidentally when targeting a branch that will not auto-close them.
- Claim release readiness without release-train verification.
- Merge themselves unless explicitly authorized.

Use closing keywords only when the PR fully resolves the linked issue and targets a branch where closure behavior is intended.
