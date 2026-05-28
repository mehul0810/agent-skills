---
name: wp-contributor
description: WordPress contribution skill for Core, Meta, Gutenberg, wordpress-develop, WordPress.org and WordCamp.org code, Make teams, Trac, GitHub PRs, PR/base-branch discipline, SVN/Git patches, testing, coding standards, inline docs, commit messages, props, AI contribution guidelines, triage, bug reports, release/backport work, production dependency hygiene, enterprise code-quality gates, accessibility, performance, i18n, security disclosure, contributor-day workflows, and token-efficient research/web search. Use when Codex works on official WordPress project contributions, tickets, patches, PRs, reviews, validation, or contributor communication.
---

# WP Contributor

Use this skill when working as a WordPress project contributor, not as a client-site implementer. Optimize for upstream acceptance, community process, backward compatibility, tests, documentation, and clear Trac/GitHub communication.

## Operating Rules

- Start from the official contribution surface: Core Trac, Meta Trac, GitHub issue/PR, Make post, Slack channel, repository, branch, milestone, component, labels, keywords, and current release phase.
- Treat WordPress contribution process as drift-prone. Verify current official handbooks, repository docs, and ticket state before giving exact instructions or changing workflow-critical details.
- Work from latest trunk/main unless a release maintainer or ticket explicitly requires a backport branch.
- Keep patches atomic and reviewable. Smaller patches with tests, docs, reproduction steps, and clear rationale move faster.
- Preserve WordPress backward compatibility unless the upstream project has explicitly accepted a breaking change path.
- Do not publicly disclose suspected security vulnerabilities. Route private reports through the current WordPress security process.
- Never assume a GitHub PR is enough for Core. Core PRs must be associated with a Trac ticket unless current official docs say otherwise.
- Use `../shared/references/research-token-discipline.md` for web-heavy, drift-prone, ambiguous, or broad-exploration contribution tasks to keep reasoning and source lookup token-efficient.
- Use `../shared/references/session-continuity-pr-discipline.md` for new chats, resumed repo work, release/backport branches, GitHub issues/PRs, and any branch/PR creation. Never create a PR until the intended upstream base branch is proven and passed explicitly.
- Use `../shared/references/production-dependency-discipline.md` for Composer/npm packaging, CI, release, and deploy tasks so dev-only packages never ship to production.
- Use `../shared/references/enterprise-code-quality-gate.md` for code creation, refactoring, and reviews so patches are modular, performant, secure, maintainable, and covered by appropriate tests including rare/failure scenarios.
- Use `references/ai-guidelines.md` when AI tools materially assist code, tests, documentation, issues, reviews, triage, support, assets, or communication for the WordPress project.
- Make comments and summaries useful to maintainers: concise reproduction, environment, actual/expected behavior, patch scope, tests run, and remaining risk.

## Fast Workflow

1. Classify the contribution: Core bug, Core enhancement, Gutenberg/block editor, Meta/WordPress.org, WordCamp.org, docs, tests, accessibility, performance, i18n, triage, patch refresh, PR review, backport, release support, or security report.
2. Map the source of truth: Trac ticket, GitHub issue/PR, Make post, Slack channel, repository, branch, milestone, component, keywords, labels, prior patches, related changesets, and linked discussions.
3. Reproduce or verify before changing code. Capture exact environment, command output, screenshots only when useful, and whether the issue still applies to trunk/main.
4. Choose the contribution path from the reference router. Load only the relevant reference files.
5. Implement the smallest upstream-friendly change with tests or a reason tests are not applicable.
6. Validate using repository scripts first, then targeted tests/lints/builds. Do not invent CI gates that the project does not use.
7. Produce contribution-ready output: patch/PR summary, Trac comment, testing notes, props candidates, follow-up needs, and exact validation.

## Reference Router

Read the smallest relevant set:

- `../shared/references/research-token-discipline.md`: token-efficient reasoning, repo exploration, web search, source selection, validation, and output discipline.
- `../shared/references/session-continuity-pr-discipline.md`: new-chat context rehydration, branch creation discipline, release/backport branch detection, explicit PR base selection, and post-create PR verification.
- `../shared/references/production-dependency-discipline.md`: Composer/npm production artifact hygiene, `require-dev`/`devDependencies` boundaries, production installs, and release ZIP/deploy checks.
- `../shared/references/enterprise-code-quality-gate.md`: enterprise-grade code creation and review gate for modularity, performance, security, maintainability, observability, and rare-scenario tests.
- `references/official-anchors.md`: current official source links and what must be rechecked before relying on process details.
- `references/contribution-map.md`: WordPress project areas, where to file issues, and how Core, Meta, Gutenberg, Docs, Test, Accessibility, Performance, and i18n differ.
- `references/core-workflow.md`: `wordpress-develop`, trunk-first work, SVN/Git mirrors, patch files, Core Trac, GitHub PR linkage, and patch refreshes.
- `references/meta-workflow.md`: Meta Handbook expertise for WordPress.org/WordCamp.org projects, Meta Trac, GitHub/SVN paths, local environments, Slack escalation, privacy, and project-specific caution.
- `references/gutenberg-workflow.md`: Gutenberg/block editor contribution guidelines, GitHub issues/PRs, labels, packages, tests, accessibility, React Native parity, and Core sync awareness.
- `references/ai-guidelines.md`: AI-assisted contribution disclosure, GPL compatibility, human responsibility, no-AI-slop quality bar, tests/QA, docs/issues, and maintainer expectations.
- `references/trac-github-triage.md`: ticket quality, components, milestones, keywords, labels, PR linkage, comments, and triage discipline.
- `references/testing-validation.md`: Core, Meta, and Gutenberg validation strategy, local environment commands, focused tests, lints, builds, and evidence format.
- `references/standards-docs-props.md`: WordPress coding standards, inline docs, commit-message style, props, dev notes, i18n, accessibility, and compatibility expectations.
- `references/release-backport-security.md`: release phase awareness, backports, RC caution, security vulnerability handling, and private disclosure.

Use scripts when helpful:

```bash
bash /path/to/wp-contributor/scripts/wp-contrib-context.sh /path/to/repo
```

## Review Mode

- Findings first when reviewing a patch or PR. Include file/line, ticket/PR context, impact, and the specific upstream blocker.
- Prefer upstream acceptance blockers over generic engineering preferences: missing reproduction, missing tests, BC risk, coding standards, wrong branch, unclear Trac linkage, incomplete docs, or accessibility regression.
- Apply the enterprise code-quality gate where it improves upstream quality: modularity, performance, security, maintainability, testability, and rare/failure scenarios should be framed as concrete acceptance risks, not generic preferences.
- For triage, do not overstate certainty. Separate confirmed bug, needs reproduction, needs reporter feedback, duplicate candidate, enhancement, and support request.
- Recommend Trac keywords or GitHub labels only when they match the official meaning and the contributor has permission to apply them.

## Implementation Mode

- Make the patch apply cleanly to current trunk/main and keep generated/build artifacts consistent with project conventions.
- Keep Core changes conservative: public APIs, hooks, schema, markup, strings, database behavior, and browser support need extra scrutiny.
- Add or update tests for behavior changes, especially regressions, REST/API changes, date/time, roles/caps, multisite, editor behavior, privacy, security, and database queries.
- Cover rare scenarios when relevant: malformed input, missing/deleted dependencies, permission denial, multisite scope, cache behavior, concurrent/retry execution, migration boundaries, editor reloads, accessibility-sensitive states, and external API failures.
- Update inline docs, user-facing strings, changelog/dev-note material, or handbook docs when the change affects developer or user expectations.
- For GitHub PRs tied to Trac, include the Trac ticket URL in the PR body and post a concise Trac update after material PR changes.
- For patches, generate from the repository root and name files with the ticket number plus sequence when appropriate.

## Universal Contribution Rules

- Problem first, solution second. Ticket titles and descriptions should explain the actual failure or improvement need.
- A failing test that demonstrates the bug is often as valuable as the fix.
- Do not churn formatting, modernize unrelated code, or refactor broad areas inside a narrow contribution.
- Explain why a change belongs upstream rather than in a plugin, theme, site-specific workaround, or documentation-only update.
- Keep accessibility, i18n, performance, privacy, security, and backward compatibility visible in every meaningful change.
- Use WordPress.org usernames for props and credit all meaningful contributions: reporters, testers, reviewers, designers, docs writers, and patch authors.
- If process, ownership, milestone, or release timing is unclear, ask in the relevant Make/Slack channel and summarize the outcome on the ticket.

## Output Expectations

- For implementation: changed files, ticket/PR linkage, patch/PR summary, tests run, and exact Trac/GitHub update text when useful.
- For triage: recommended component, type, severity/priority only when justified, keywords/labels, reproduction status, and next action.
- For reviews: acceptance blockers first, then improvement suggestions, then validation gaps.
- For plans: contribution path, repository setup, patch/PR strategy, tests, docs/dev-note needs, reviewer targets, and backout or refresh plan.
