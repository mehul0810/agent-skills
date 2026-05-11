# WP Expert Codex Skill

This repository contains the `wordpress-expert` Codex skill for complete, principal-grade WordPress engineering work.

## What It Covers

- Plugin development and refactoring.
- WordPress.org Plugin Directory guideline review, block directory eligibility, readme policy, licensing, tracking, and trademark checks.
- Theme development, classic themes, block themes, and `theme.json`.
- Block editor compatible code generation and dynamic/static block work.
- Product-grade UI/UX improvement: visual QA, interaction states, forms, dashboards, responsive polish, and conversion clarity.
- WordPress Design System support: `@wordpress/components`, design tokens, Figma-to-code mapping, and accessibility.
- Admin UX, settings screens, onboarding, list tables, notices, and frontend UI improvement.
- Performance, caching, database scale, security, privacy, secrets, and PII handling.
- Enterprise architecture, multisite, migrations, async jobs, observability, and rollout/backout planning.
- WordPress monorepos, multi-plugin/theme packages, shared tooling, generated artifacts, and release engineering.
- WordPress VIP readiness and high-traffic production constraints.
- Troubleshooting, incident triage, WP-CLI probes, activation checks, and operational debugging.
- Coding standards, linting, static analysis, tests, GitHub Actions, CI/CD, PR workflows, and releases.
- Webpack, Composer, npm, dependency extraction, lockfiles, build scripts, and release artifact packaging.

## Skill

Install or reference the skill folder:

```text
wordpress-expert/
```

Default invocation:

```text
Use $wordpress-expert to review, implement, debug, harden, or improve a WordPress plugin, theme, block editor, admin UX, CI/CD workflow, or enterprise/VIP codebase.
```

## Design

The skill is intentionally token-efficient:

- `SKILL.md` contains the core operating workflow and reference router.
- `references/` contains deeper playbooks loaded only when relevant.
- `scripts/` contains read-only discovery and validation helpers.

See `PLANNING_REPORT.md` for the planning rationale and validation history.
