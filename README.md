# WP Expert Codex Skill

This repository contains the `wordpress-expert` Codex skill for complete, principal-grade WordPress engineering work.

## What It Covers

- Plugin development and refactoring.
- Third-party API integrations of any type using official documentation or user-provided specs: REST, GraphQL, SOAP/WSDL, XML-RPC, SDKs, webhooks, OAuth, API keys, rate limits, retries, idempotency, queues, and provider operations.
- Requirements analysis, PRDs, scope of work, technical breakdowns, Codex-aware estimates, milestones, and delivery buffers.
- WordPress.org Plugin Directory guideline review, block directory eligibility, readme policy, licensing, tracking, and trademark checks.
- Theme development, classic themes, block themes, and `theme.json`.
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

## Skill

Install or reference the skill folder:

```text
wordpress-expert/
```

Default invocation:

```text
Use $wordpress-expert to review, implement, debug, harden, or improve a WordPress plugin, third-party API integration, theme, React/admin app, block editor, admin UX, CI/CD workflow, or enterprise/VIP codebase.
```

## Design

The skill is intentionally token-efficient:

- `SKILL.md` contains the core operating workflow and reference router.
- `references/` contains deeper playbooks loaded only when relevant.
- `scripts/` contains read-only discovery and validation helpers.

See `PLANNING_REPORT.md` for the planning rationale and validation history.
