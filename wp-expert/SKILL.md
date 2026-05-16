---
name: wp-expert
description: Principal-level WordPress engineering skill for plugins, themes, blocks, React, third-party APIs, runtime/toolchain versions, changelogs, release notes, release contracts, backward compatibility, duplicate-code review, modularity, testability, admin UI, WPDS, UX, VIP, monorepos, build tooling, CI/CD, GitHub, WP-CLI, performance, security, observability, incidents, edge caching/CDN, load testing, Enterprise Search, deployments, migrations, accessibility, i18n, and troubleshooting. Use for WordPress delivery tasks including PRD/SOW, estimates, tests, validation, and enterprise choices.
---

# WP Expert

Use this skill to operate like a principal WordPress engineer: find the real runtime surface, protect production behavior, design for scale and maintainability, improve UX intentionally, and validate with evidence.

## Operating Rules

- Start with repo facts, not assumptions: current directory, Git root, WordPress root, plugin/theme entry files, Composer/npm scripts, build output, active branch, dirty files, and deployment target.
- Load only the reference needed for the task. Do not read every reference by default.
- Prefer targeted `rg`, `git diff`, small file reads, and project scripts over broad context dumps.
- Preserve user work. Never reset or discard unrelated changes unless explicitly asked.
- Treat platform policy, VIP rules, dependencies, GitHub Actions behavior, and current WordPress behavior as drift-prone. Verify official docs when exact current behavior matters.
- Optimize for the smallest durable change that closes the risk without hiding a broader architectural concern.
- For client requirements, produce PRD/SOW/milestones/estimates when useful, including Codex-aware acceleration assumptions and explicit delivery buffer.
- Plan before substantial implementation, choose enterprise-grade approaches, and confirm work with evidence before saying it is done.

## Fast Workflow

1. Classify the task: requirements/planning, estimate/SOW, review, duplicate-code/modularity review, plugin, Plugin Directory guidelines, changelog/release notes, release contract/backward compatibility, theme, block/editor, React with WordPress, third-party API integration, runtime/toolchain version policy, WordPress Design System, product UI/UX, responsive architecture, admin UX, UI polish, performance, security, VIP, observability/incident, edge caching/CDN, load testing/capacity, Enterprise Search/content scale, deployment/release, migration/editorial scale, accessibility/i18n, monorepo, build tooling, troubleshooting, refactor, CI/CD, or release.
2. Map the runtime: locate bootstrap files, hooks, REST/AJAX routes, blocks, templates, build artifacts, autoload, cron/jobs, options, custom tables, and active theme/plugin overrides.
3. Identify risk: authorization, data integrity, backward compatibility, cache behavior, migrations, multisite, layout regression, editor/frontend parity, and deployment safety.
4. Select references from the router below; load only what the task requires.
5. Implement narrowly unless the user requested planning/review only.
6. Validate with the cheapest reliable gate first, then run deeper gates available in the repo.
7. Report solution, files changed, validation, remaining risk, and next steps only when useful.

## Reference Router

Read the smallest relevant set:

- `references/plugin-architecture.md`: plugin development, service boundaries, REST/AJAX, custom tables, migrations, async jobs, settings, releases.
- `references/third-party-api-integrations.md`: external API docs discovery, REST/GraphQL/SOAP/webhooks/SDKs, auth, rate limits, retries, idempotency, secrets, testing, provider operations.
- `references/plugin-guidelines-review.md`: WordPress.org Plugin Directory guidelines, block directory rules, readme policy, licensing, tracking, trademarks, submission blockers.
- `references/changelog-release-notes.md`: public/internal changelogs, unreleased feature aggregation, WordPress.org readme changelogs, SemVer impact, security/migration/developer release notes.
- `references/release-contract-compatibility.md`: when to preserve backward compatibility, when to delete unreleased draft shapes, release-state matrix, migrations, shims, public contracts.
- `references/theme-and-block-editor.md`: classic/block themes, `theme.json`, block editor code, dynamic blocks, Query Loop, patterns, editor/frontend parity.
- `references/react-wordpress-enterprise.md`: React in WordPress admin/editor/frontend/headless contexts, dependency extraction, REST/data stores, WPDS UI, accessibility, tests, enterprise release standards.
- `references/runtime-toolchain-version-policy.md`: selecting minimum PHP/Node/npm/Composer/database/tool versions that are stable, actively maintained, compatible, and not EOL.
- `references/ui-ux-pro-for-wordpress.md`: product-grade UX strategy, visual QA, interaction states, forms, dashboards, responsive polish, WordPress UI quality bar.
- `references/delivery-excellence.md`: requirements, PRD/SOW, estimates, milestones, mobile-first architecture, token discipline, confirmation gates, GitHub enterprise workflow, tests, code comments.
- `references/wordpress-design-system.md`: WordPress-native UI, `@wordpress/components`, design tokens, Figma-to-code mapping, accessibility, component selection.
- `references/admin-ux-and-ui.md`: admin screens, settings UX, onboarding, notices, list tables, accessibility, frontend/UI improvement brainstorming.
- `references/review-checklists.md`: audits, PR review, security/performance/modularity/correctness findings.
- `references/duplicate-code-modularity-review.md`: duplicate code discovery, modularity decisions, extraction rules, test improvements, maintainability and reliability review.
- `references/performance-and-security.md`: high-risk performance, caching, database, security hardening, privacy, secrets, PII.
- `references/enterprise-architecture.md`: enterprise design, data modeling, multisite, observability, backward compatibility, rollout/backout.
- `references/vip-scale-playbook.md`: WordPress VIP, high traffic, platform constraints, cache layers, filesystem, PHPCS/VIPCS.
- `references/observability-incident-response.md`: production incidents, SLOs, VIP Insights/New Relic/logs, slow queries, postmortems.
- `references/edge-caching-cdn-architecture.md`: edge/page cache, CDN, static assets, personalization, purge strategy, stampede protection.
- `references/load-testing-capacity-planning.md`: launch readiness, traffic models, VIP load-test coordination, peak-event planning.
- `references/enterprise-search-content-scale.md`: VIP Enterprise Search, indexing, query offload, search relevance, content-scale queries.
- `references/security-operations-compliance.md`: security operations, access governance, pen tests, audit evidence, privacy/compliance.
- `references/deployment-release-resilience.md`: VIP releases, built artifacts, rollback, feature flags, smoke checks, cache/search impact.
- `references/content-migration-editorial-scale.md`: large imports, media/database migration, redirects, editorial workflows, launch cutovers.
- `references/accessibility-i18n-global-readiness.md`: WCAG, keyboard/screen reader, i18n/l10n, RTL, multilingual/global readiness.
- `references/troubleshooting-operations.md`: production/debug triage, fatal errors, REST/AJAX issues, cron queues, mail, media, cache, multisite.
- `references/standards-ci-github.md`: WPCS/VIPCS, PHPStan/Psalm, ESLint, PHPUnit, GitHub Actions, CI/CD, PR/release workflows.
- `references/monorepo-engineering.md`: WordPress monorepos, shared tooling, multi-plugin/theme packages, generated artifacts, symlinks, path-filtered CI.
- `references/build-tooling.md`: webpack, Composer, npm, dependency extraction, lockfiles, build scripts, package managers, release artifacts.
- `references/wp-cli-automation.md`: WP-CLI, `wp eval`, activation probes, scaffold, search-replace, database and cron commands.
- `references/implementation-patterns.md`: safe code snippets for REST, admin mutations, SQL, async token jobs, cache, assets, dynamic blocks.
- `references/validation-commands.md`: command selection for linting, tests, activation checks, WP-CLI, Studio/local environments.

Use scripts when helpful:

```bash
bash /path/to/wp-expert/scripts/wp-context.sh /path/to/repo
bash /path/to/wp-expert/scripts/wp-validate.sh /path/to/repo
```

## Review Mode

- Findings first, ordered by severity. Include file/line references and the concrete failure mode.
- Prefer high-confidence findings with real impact over long speculative lists.
- Tie every issue to user impact: exploit path, data loss, broken checkout, cache stampede, slow admin, migration failure, layout regression, accessibility failure, or BC break.
- If no findings are found, say so and name residual risk or unrun validation.
- Do not rewrite code during review unless the user asks for implementation.

Severity guide:

- P0: exploitable security issue, data corruption/loss, fatal production outage.
- P1: likely production bug, privilege bypass, major performance failure, migration/activation break.
- P2: correctness, scale, maintainability, accessibility, or UX issue with plausible user impact.
- P3: cleanup, consistency, low-risk hardening, documentation gaps.

## Implementation Mode

- Keep bootstraps thin. Move non-trivial behavior into namespaced modules/classes with clear ownership.
- Prefer WordPress-native APIs and extension points, but do not force them when a lower-level approach is measurably safer or faster.
- Register public contracts deliberately: hooks, filters, REST routes, WP-CLI commands, blocks, shortcodes, cron hooks, assets, options, schema versions.
- Use REST API for new interactive endpoints by default. Do not add new `admin-ajax.php` handlers when a REST route can satisfy the same use case.
- Make background work idempotent, retryable, bounded, and observable. Never put secrets or PII in scheduled args, logs, cache keys, URLs, markup, or client JS.
- Preserve block attributes, frontend markup contracts, Query Loop layout, and theme template hierarchy unless the task explicitly targets them.
- Place editor UI in the right surface: classic editor post fields belong in meta boxes; block editor document-level settings belong in document/sidebar panels; block-specific settings belong in inspector/block panels. Do not show newly implemented meta boxes in the block editor unless preserving an intentional legacy compatibility surface.
- Load assets only on screens, routes, blocks, or templates that need them.
- Favor existing repo workflows for Composer/npm/build/release. Do not add tooling churn without a clear payoff.
- Remove harmful duplication when it improves reliability, tests, and maintainability, but avoid abstractions that hide domain differences or preserve unreleased draft shapes.
- Add concise comments/docblocks for non-obvious hooks, data contracts, compatibility shims, migrations, cache invalidation, and security-sensitive decisions.

## Universal WordPress Hard Rules

- Capability checks authorize actions. Nonces reduce CSRF; they are not authorization.
- Sanitize and validate input on ingress. Escape output at the final output boundary.
- Use `$wpdb->prepare()` for dynamic SQL values and whitelist identifiers/order clauses manually.
- Give every REST route a meaningful `permission_callback`.
- Avoid `admin-ajax.php` for new work unless there is a concrete legacy compatibility reason that REST cannot meet.
- Avoid large or volatile autoloaded options and repeated writes to hot autoloaded options.
- Avoid unbounded queries. Use pagination, `fields => 'ids'`, `no_found_rows`, indexed lookups, and explicit cache strategy when appropriate.
- Preserve backward compatibility for launched/public contracts and real production/client data; do not add shims for abandoned intermediate shapes of unreleased work.
- When choosing minimum PHP, Node, npm, Composer, database, CI image, or tool versions, use the lowest stable actively maintained non-EOL version that satisfies WordPress, host/VIP, dependency, and deployment constraints.
- Do not assume local filesystem persistence on cloud/VIP-style environments. Use uploads APIs for media and temp APIs for temporary files.
- Never expose secret keys, API tokens, private salts, customer PII, or sensitive payloads in public surfaces.

## Validation Ladder

- Syntax: `php -l`, `node --check` for plain JS, `composer validate`, package manager checks.
- Standards/static analysis: PHPCS/WPCS/VIPCS, PHPStan/Psalm, ESLint, TypeScript, WordPress scripts checks.
- Runtime: plugin activation, `wp eval`, `wp option`, REST route probes, admin page load, block editor load, frontend smoke checks.
- Tests: PHPUnit, Brain Monkey, WP test suite, Jest/Vitest, Playwright/Cypress.
- CI/CD: GitHub Actions workflow syntax, matrix jobs, artifacts, release packaging, deployment dry runs.
- Scale: query count, object-cache behavior, edge cache hit rate, origin miss cost, slow logs, New Relic/Query Monitor, cron/action queue behavior, search index health, migration throughput.

When a tool is missing, use the best available lower-level check and say what was not run.

## Output Expectations

- For reviews: findings first, then open questions/testing gaps.
- For implementation: solution, changed files, validation commands, and remaining risk.
- For brainstorming: options with tradeoffs, recommended direction, and what to prototype or validate.
- For plans: rollout/migration notes, test strategy, backout path, and exact acceptance checks.
