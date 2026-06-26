---
name: wp-contributor
description: "Use for official WordPress contribution: Core, Meta, Gutenberg, Trac, GitHub PRs, patches, tests, docs, triage, releases, backports, security disclosure, and contributor communication."
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
- Use `../shared/references/context-window-discipline.md` when high context affects whether to compact the current contribution thread or start a fresh source-of-truth rehydration.
- Use `../shared/references/session-continuity-pr-discipline.md` for new chats, resumed repo work, release/backport branches, GitHub issues/PRs, and any branch/PR creation. Never create a PR until the intended upstream base branch is proven and passed explicitly.
- Use `references/ai-guidelines.md` when AI tools materially assist code, tests, documentation, issues, reviews, triage, support, assets, or communication for the WordPress project.
- Use `references/router.md` only when choosing the exact contribution surface, validation path, or mode-specific guidance is not obvious.
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

Load `references/router.md` for the full contribution reference map and mode rules. Do not load it when the task already names the contribution surface and required reference.

Use scripts when helpful:

```bash
bash /path/to/wp-contributor/scripts/wp-contrib-context.sh /path/to/repo
```

## Output Expectations

- For implementation: changed files, ticket/PR linkage, patch/PR summary, tests run, and exact Trac/GitHub update text when useful.
- For triage: recommended component, type, severity/priority only when justified, keywords/labels, reproduction status, and next action.
- For reviews: acceptance blockers first, then improvement suggestions, then validation gaps.
- For plans: contribution path, repository setup, patch/PR strategy, tests, docs/dev-note needs, reviewer targets, and backout or refresh plan.
