# WP Contributor Router

Use this router only after `wp-contributor` is selected. Load the smallest relevant set for the contribution surface and current release phase.

## Reference Routes

- `../../shared/references/research-token-discipline.md`: token-efficient reasoning, repo exploration, web search, source selection, validation, and output discipline.
- `../../shared/references/session-continuity-pr-discipline.md`: new-chat context rehydration, branch creation discipline, release/backport branch detection, explicit PR base selection, and post-create PR verification.
- `../../shared/references/project-subagent-routing.md`: project-level subagent profiles, model routing, bounded parallel mapping, and parent-owned commits/PRs.
- `../../shared/references/production-dependency-discipline.md`: Composer/npm production artifact hygiene, `require-dev`/`devDependencies` boundaries, production installs, and release ZIP/deploy checks.
- `../../shared/references/enterprise-code-quality-gate.md`: enterprise-grade code creation and review gate for modularity, performance, security, maintainability, observability, and rare-scenario tests.
- `official-anchors.md`: current official source links and what must be rechecked before relying on process details.
- `contribution-map.md`: WordPress project areas, where to file issues, and how Core, Meta, Gutenberg, Docs, Test, Accessibility, Performance, and i18n differ.
- `core-workflow.md`: `wordpress-develop`, trunk-first work, SVN/Git mirrors, patch files, Core Trac, GitHub PR linkage, and patch refreshes.
- `meta-workflow.md`: Meta Handbook expertise for WordPress.org/WordCamp.org projects, Meta Trac, GitHub/SVN paths, local environments, Slack escalation, privacy, and project-specific caution.
- `gutenberg-workflow.md`: Gutenberg/block editor contribution guidelines, GitHub issues/PRs, labels, packages, tests, accessibility, React Native parity, and Core sync awareness.
- `ai-guidelines.md`: AI-assisted contribution disclosure, GPL compatibility, human responsibility, no-AI-slop quality bar, tests/QA, docs/issues, and maintainer expectations.
- `trac-github-triage.md`: ticket quality, components, milestones, keywords, labels, PR linkage, comments, and triage discipline.
- `testing-validation.md`: Core, Meta, and Gutenberg validation strategy, local environment commands, focused tests, lints, builds, and evidence format.
- `standards-docs-props.md`: WordPress coding standards, inline docs, commit-message style, props, dev notes, i18n, accessibility, and compatibility expectations.
- `release-backport-security.md`: release phase awareness, backports, RC caution, security vulnerability handling, and private disclosure.

## Mode Rules

Review mode:
- Findings first with file/line, ticket/PR context, impact, and the specific upstream blocker.
- Prefer upstream acceptance blockers over generic preferences: missing reproduction, missing tests, BC risk, coding standards, wrong branch, unclear Trac linkage, incomplete docs, or accessibility regression.
- Separate confirmed bug, needs reproduction, needs reporter feedback, duplicate candidate, enhancement, and support request.

Implementation mode:
- Make the patch apply cleanly to current trunk/main and keep generated/build artifacts consistent with project conventions.
- Keep Core changes conservative: public APIs, hooks, schema, markup, strings, database behavior, and browser support need extra scrutiny.
- Add or update tests for behavior changes, especially regressions, REST/API changes, date/time, roles/caps, multisite, editor behavior, privacy, security, and database queries.
- Cover rare scenarios when relevant: malformed input, missing/deleted dependencies, permission denial, multisite scope, cache behavior, concurrent/retry execution, migration boundaries, editor reloads, accessibility-sensitive states, and external API failures.
- Update inline docs, user-facing strings, changelog/dev-note material, or handbook docs when the change affects developer or user expectations.

Universal contribution rules:
- Problem first, solution second. Ticket titles and descriptions should explain the actual failure or improvement need.
- A failing test that demonstrates the bug is often as valuable as the fix.
- Do not churn formatting, modernize unrelated code, or refactor broad areas inside a narrow contribution.
- Explain why a change belongs upstream rather than in a plugin, theme, site-specific workaround, or documentation-only update.
- Keep accessibility, i18n, performance, privacy, security, and backward compatibility visible in every meaningful change.
- Use WordPress.org usernames for props and credit all meaningful contributions.
