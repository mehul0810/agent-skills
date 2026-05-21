---
name: wp-contributor
description: WordPress contribution skill for Core, Meta, Gutenberg, wordpress-develop, WordPress.org and WordCamp.org code, Make teams, Trac, GitHub PRs, SVN/Git patches, testing, coding standards, inline docs, commit messages, props, triage, bug reports, release/backport work, accessibility, performance, i18n, security disclosure, and contributor-day workflows. Use when Codex works on official WordPress project contributions, tickets, patches, PRs, reviews, validation, or contributor communication.
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

- `references/official-anchors.md`: current official source links and what must be rechecked before relying on process details.
- `references/contribution-map.md`: WordPress project areas, where to file issues, and how Core, Meta, Gutenberg, Docs, Test, Accessibility, Performance, and i18n differ.
- `references/core-workflow.md`: `wordpress-develop`, trunk-first work, SVN/Git mirrors, patch files, Core Trac, GitHub PR linkage, and patch refreshes.
- `references/meta-workflow.md`: Meta team scope, WordPress.org/WordCamp.org projects, Meta Trac, local environment expectations, and project-specific caution.
- `references/gutenberg-workflow.md`: Gutenberg/block editor contribution guidelines, GitHub issues/PRs, labels, packages, tests, accessibility, React Native parity, and Core sync awareness.
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
- For triage, do not overstate certainty. Separate confirmed bug, needs reproduction, needs reporter feedback, duplicate candidate, enhancement, and support request.
- Recommend Trac keywords or GitHub labels only when they match the official meaning and the contributor has permission to apply them.

## Implementation Mode

- Make the patch apply cleanly to current trunk/main and keep generated/build artifacts consistent with project conventions.
- Keep Core changes conservative: public APIs, hooks, schema, markup, strings, database behavior, and browser support need extra scrutiny.
- Add or update tests for behavior changes, especially regressions, REST/API changes, date/time, roles/caps, multisite, editor behavior, privacy, security, and database queries.
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
