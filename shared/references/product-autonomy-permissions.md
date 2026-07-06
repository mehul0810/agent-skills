# Product Autonomy And Permissions

Use this reference before deciding whether a WordPress plugin/theme product task can be completed autonomously.

## Permission Levels

Treat each level as separate. Permission for one level does not imply the next.

| Level | Allowed work | Requires explicit current permission |
| --- | --- | --- |
| Inspect | Read repo, issues, PRs, docs, CI, logs, and local runtime state | No mutation |
| Plan | Produce PRD, scope, estimates, acceptance criteria, or implementation plan | No mutation |
| Implement local | Edit files and run local validation | Push, PR, merge, release |
| Commit | Stage and commit intended files | Push, PR, merge, release |
| Push | Push current branch/commits | PR creation, merge, release |
| PR | Create/update PR body/comments | Merge, close, release |
| CI repair | Rerun/fix CI after push | Workflow/security changes unless in scope |
| Merge/close | Merge PR or close issue/PR | Production/beta release/deploy/publish |
| Release | Version bump, tag, GitHub Release, wp.org SVN, package upload | Must be explicit for target/version |

## Autonomous By Default

A task is a good autonomous candidate when all are true:

- Clear issue/PR or user request.
- Bounded blast radius.
- Fits current `PRODUCT.md`, `VISION.md`, roadmap, or accepted repo pattern.
- Validation path exists locally, through CI, or through safe live proof.
- No production/beta release action or public security disclosure is required.
- The fix can be explained and reverted.

Common autonomous plugin/theme work:

- Reproduced bug fixes with regression coverage.
- Coding standards, lint, type, build, packaging, docs, and test fixes.
- Small admin UX, settings, onboarding, list table, notice, or supportability improvements.
- Theme template, pattern, block style, responsive, editor/frontend parity, and visual-polish fixes with explicit acceptance.
- Duplicate-code removal where behavior is preserved and tests cover changed seams.

## Owner Approval Boundary

Only production or beta release actions require explicit current `@mehul0810` approval: creating production/beta releases or tags, publishing/deploying a release, or declaring a production/beta release approved.

For normal product orchestration, do not stall on `owner:me` if a decision is reasonable, reversible, and non-release. Document the rationale, relabel to `owner:codex`, and proceed or delegate. Continue issue creation, labels, branch prep, PR review/merge for good non-production PRs, dependency/tooling work, docs work, and reversible backlog prioritization when repo policy and validation support it.

Review and merge safe non-production PRs when they target `develop` or a release branch, are correctly based, scoped, non-draft, green, and have no explicit current owner stop on that exact PR. If the merge UI/tool/API blocks the action, report the exact tooling or approval-layer blocker; do not convert that into an owner-decision blocker.

Escalate rather than guess when work is not reversible or crosses:

- Product positioning, roadmap, pricing, licensing, free/pro entitlement, upsell, or telemetry.
- Public contracts: hooks, filters, REST schema, shortcode attributes, block attributes, WP-CLI commands, database schema, storage layout, import/export format, or API behavior.
- Security/privacy posture, data retention, consent, PII handling, OAuth scopes, webhook trust, or external provider permissions.
- Migrations affecting real production data.
- Release branch policy, versioning, WordPress.org assets/SVN, marketplace submissions, public release notes, or production/beta release action.
- Broad UI/brand direction, conversion strategy, SEO-critical templates, or content model.

## Reversible Default Rule

If a product choice is minor and reversible, choose the safer enterprise default and document it in the PR. If the choice affects customer expectations, paid functionality, data, privacy, SEO, release behavior, or security disclosure, stop and ask.

## Security Disclosure Safety

Security-sensitive findings should not become public issues and should not include exploit details, reproduction steps, or public `security issue` wording. Implement them as sanitized hardening PRs with validation and minimal public detail.

## Stop Conditions

Stop immediately and report exact next action when:

- The worktree has unrelated dirty changes.
- The issue milestone/base branch is ambiguous.
- Required credential, paid account, local site, test data, or live proof target is unavailable.
- Validation fails outside the scoped change and cannot be safely fixed.
- The best implementation requires a broader architecture/product decision.
- A destructive command, migration, or production/beta release action would be needed.

## Decision Brief Format

When owner input is needed, provide:

- URL or repo path and item title.
- What changes and who benefits.
- Why the decision is needed now.
- Proof already completed: reproduction, tests, CI, live proof, review.
- Tradeoffs and residual risks.
- Recommended option with rationale.
- Exact choices, including what happens if no action is taken.
