# Testing And Validation

Use this to choose validation for Core, Meta, Gutenberg, and related WordPress contribution work.

## Validation Principles

- Prefer existing repository scripts and documented commands.
- Run the narrowest test that proves the contribution, then broader checks when the risk justifies it.
- Record exact commands and outcomes in Trac or PR comments.
- If a tool is unavailable locally, say that clearly and provide the next best evidence.
- Do not mark work as ready until the changed behavior has been confirmed against trunk/main or the required release branch.

## Core Validation

Discover commands first:

```bash
npm run
composer run-script --list 2>/dev/null || true
```

Common Core checks may include:

```bash
npm run env:start
npm run env:install
npm run build
npm run lint:php
npm run lint:js
npm run test:php
npm run test:js
```

Use exact scripts from the current repository. For targeted PHPUnit tests, inspect the repo test docs and PHPUnit config before choosing class, group, or filter syntax.

Core test evidence should mention:

- Reproduction before fix.
- Test added or updated.
- Targeted PHPUnit/QUnit/Jest command where applicable.
- Manual admin/editor/frontend steps if automated coverage is not enough.
- Multisite, REST, roles/caps, date/time, database, or upgrade tests when affected.

## Gutenberg Validation

Discover scripts first with `npm run`. Common validation areas include:

- Package unit tests.
- E2E tests for editor behavior.
- Type checks if present.
- Linting and formatting checks.
- Storybook or visual checks for components.
- Manual editor testing for block behavior and accessibility.

For editor UI changes, include keyboard and screen reader-relevant checks when possible.

## Meta Validation

Meta validation is project-specific. First identify project docs, local environment, and deployment path.

Typical checks:

- PHP syntax and project linting.
- JS/CSS build and linting if present.
- Local reproduction against the relevant WordPress.org/WordCamp.org component.
- Cache behavior and invalidation for directory/search/profile changes.
- Privacy checks for profile, event, moderation, application, or attendee data.

## Evidence Format

```text
Testing performed:
- [command]: passed/failed with summary
- [manual check]: passed/failed with environment
- [not run]: reason and risk
```
