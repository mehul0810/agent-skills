# Product Context

Replace placeholders before relying on autonomous decisions.

## Product

- Name: `<product-name>`
- Type: `plugin | theme | block theme | add-on | monorepo`
- WordPress.org slug: `<slug-or-none>`
- Free/pro model: `<free-only | free+pro | pro-only | client>`
- Primary users: `<admins, editors, developers, merchants, visitors>`
- Primary value: `<one sentence>`

## Autonomy Policy

Autonomous without asking:

- Reproduced bug fixes with tests or clear validation.
- Coding standards, lint, CI, build, docs, and packaging fixes.
- Small admin/editor/frontend polish with explicit acceptance criteria.
- Refactors that preserve behavior and improve maintainability.

Ask first:

- New product features or UX direction.
- Pricing, licensing, free/pro entitlement, upsell, telemetry, or privacy changes.
- Public API, REST schema, block attributes, shortcode, WP-CLI, database schema, or migration changes.
- WordPress.org release, SVN deploy, marketplace submission, or public announcement.
- Security vulnerability handling or customer-data risk.

## Release Policy

- Default branch: `<main|trunk|develop>`
- Release branch pattern: `<release/x.y.z|none>`
- Version source: `<plugin header|package.json|VERSION|readme.txt>`
- Changelog file: `<CHANGELOG.md|readme.txt|both>`
- Build artifact command: `<npm run build|composer install --no-dev|custom>`

## Validation Policy

- Minimum local gate: `<commands>`
- Plugin activation check: `<local site command>`
- Theme/editor check: `<local site command>`
- Browser/local HTTPS URL: `<https://site.test>`
- Live external providers needing permission: `<list>`
