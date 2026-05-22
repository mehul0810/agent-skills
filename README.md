# WP Expert Codex Skill Pack

This repository contains WordPress-focused Codex skills:

- `wp-expert`: principal-grade WordPress engineering for client, product, enterprise, VIP, plugin, theme, block editor, performance, security, and delivery work.
- `wp-contributor`: official WordPress project contribution workflows for Core, Meta, Gutenberg, Trac, GitHub PRs, patches, testing, docs, triage, releases, and contributor communication.
- `shared/references/research-token-discipline.md`: reusable token-efficient reasoning, repo exploration, web search, validation, and output discipline used by both skills.

## wp-expert Coverage

- Plugin development and refactoring.
- Third-party API integrations of any type using official documentation or user-provided specs: REST, GraphQL, SOAP/WSDL, XML-RPC, SDKs, webhooks, OAuth, API keys, rate limits, retries, idempotency, queues, and provider operations.
- Runtime and toolchain version policy: choose the minimum stable actively maintained non-EOL PHP, Node, npm, Composer, database, CI image, and tool versions that satisfy WordPress, host/VIP, dependency, and deployment constraints.
- Changelog and release notes expertise: public/internal changelogs, unreleased feature aggregation, WordPress.org `readme.txt` changelog rules, SemVer impact, security notes, migrations, and developer-facing API notes.
- Release contract and backward compatibility policy: preserve launched/public contracts and real production/client data, but avoid compatibility shims for abandoned intermediate shapes of unreleased features.
- Duplicate code, modularity, and maintainability review: find repeated logic, reduce drift, improve service boundaries, add better tests, and keep refactors simple and reliable.
- Requirements analysis, PRDs, scope of work, technical breakdowns, Codex-aware estimates, milestones, and delivery buffers.
- WordPress.org Plugin Directory guideline review, block directory eligibility, readme policy, licensing, tracking, and trademark checks.
- Theme development, classic themes, block themes, and `theme.json`.
- Ollie block theme and Ollie Pro expertise: Site Editor workflows, child themes, design tokens, Pro pattern library, setup wizard, starter sites, extensions, Menu Designer, WooCommerce layouts, and troubleshooting.
- Blocksy theme and Blocksy Pro expertise: Customizer workflows, Companion plugin, header/footer builders, Content Blocks, Dynamic Data, starter sites, Shop Extra/WooCommerce, Advanced Menu, Pro extensions, licensing, and troubleshooting.
- Block editor compatible code generation and dynamic/static block work.
- React with WordPress enterprise standards: admin/editor apps, frontend interactive blocks, headless boundaries, dependency extraction, REST contracts, `@wordpress/data`, `@wordpress/components`, testing, accessibility, and release artifacts.
- Product-grade UI/UX improvement: visual QA, interaction states, forms, dashboards, responsive polish, and conversion clarity.
- Mobile-first responsive architecture for frontend/customer-facing flows and responsive-safe admin/editor interfaces.
- WordPress Design System support: `@wordpress/components`, design tokens, Figma-to-code mapping, and accessibility.
- Admin UX, settings screens, onboarding, list tables, notices, and frontend UI improvement.
- Performance, caching, database scale, security, privacy, secrets, and PII handling.
- Enterprise architecture, multisite, migrations, async jobs, observability, and rollout/backout planning.
- Observability and incident response: SLOs, VIP Insights, New Relic, logs, slow queries, runbooks, and postmortems.
- Edge caching and CDN architecture: page cache, object cache, static assets, personalization, purge strategy, and stampede protection.
- Load testing and capacity planning for launches, traffic spikes, high-origin-load scenarios, and VIP coordination.
- Enterprise Search and content-scale querying: indexing, search offload, relevance, admin search, and multisite boundaries.
- Security operations and compliance: access governance, penetration testing, audit evidence, privacy, dependency risk, and incident response.
- Deployment and release resilience: built artifacts, feature flags, rollback, smoke checks, cache/search impact, and release communication.
- Content migration and editorial scale: large imports, media migration, redirects, SEO preservation, roles, workflows, and launch cutovers.
- Accessibility, internationalization, localization, RTL, multilingual/global readiness, and WCAG-aligned UI validation.
- WordPress monorepos, multi-plugin/theme packages, shared tooling, generated artifacts, and release engineering.
- WordPress VIP readiness and high-traffic production constraints.
- Troubleshooting, incident triage, WP-CLI probes, activation checks, and operational debugging.
- Coding standards, linting, static analysis, tests, GitHub Actions, CI/CD, PR workflows, and releases.
- Enterprise GitHub workflows: issue triage, labels, milestones, scoped commits, PR descriptions, review response discipline.
- Efficient tests and maintainable code comments/docblocks for onboarding and future regression prevention.
- Webpack, Composer, npm, dependency extraction, lockfiles, build scripts, and release artifact packaging.

## wp-contributor Coverage

- WordPress Core contribution through `wordpress-develop`, Core Trac, SVN/Git patches, and linked GitHub PRs.
- WordPress Meta contribution using Meta Handbook workflows for WordPress.org, WordCamp.org, Make sites, developer.wordpress.org, directories, profiles, badges, Trac/GitHub/SVN paths, local environments, Slack escalation, and project infrastructure.
- Gutenberg and block editor contribution through `wordpress/gutenberg` guidelines, GitHub issues, PRs, labels, milestones, package boundaries, editor tests, accessibility, React Native parity, Storybook, and Core sync awareness.
- Ticket triage, issue reproduction, component/milestone/keyword guidance, patch refreshes, review comments, and maintainer-ready summaries.
- Testing and validation strategy for Core, Meta, and Gutenberg using existing repo scripts first.
- WordPress coding standards, inline docs, i18n, accessibility, performance, privacy, security, dev-note, props, and commit-message guidance.
- Release phase, backport, RC/minor-release caution, and private security disclosure workflows.

## Skills

Install or reference the skill folders:

```text
wp-expert/
wp-contributor/
```

Default invocations:

```text
Use $wp-expert to review, implement, debug, harden, or improve a WordPress plugin, duplicate-code/modularity issue, changelog/release notes, release compatibility policy, third-party API integration, theme, Ollie block theme/Ollie Pro site, Blocksy theme/Blocksy Pro site, React/admin app, block editor, admin UX, CI/CD workflow, or enterprise/VIP codebase.

Use $wp-contributor to contribute to WordPress Core, Meta, Gutenberg, wordpress-develop, WordPress.org, WordCamp.org, Trac tickets, GitHub PRs, patches, tests, docs, standards, triage, release/backport work, or contributor communication.
```

## Design

The skills are intentionally token-efficient:

- Each `SKILL.md` contains the core operating workflow and reference router.
- Each `references/` directory contains deeper playbooks loaded only when relevant.
- The shared `research-token-discipline.md` reference keeps web/research behavior explicit without duplicating guidance across skills.
- Each `scripts/` directory contains read-only discovery and validation helpers.

See `PLANNING_REPORT.md` for the planning rationale and validation history.
