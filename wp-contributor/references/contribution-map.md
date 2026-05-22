# Contribution Map

Use this to route contribution work to the right project surface.

## Core

Use Core workflow for changes to `wordpress-develop`, bundled themes when tracked through Core, REST API, editor integration in Core, default scripts/styles, admin screens, database schema, public APIs, upgrade/install behavior, tests, and developer documentation tied to Core code.

Core contribution normally centers on Core Trac tickets, patches, and optionally GitHub PRs linked to Trac. Work against trunk unless maintainers direct otherwise.

## Gutenberg And Block Editor

Use Gutenberg workflow for block editor packages, editor UI, `@wordpress/*` packages, block APIs, Site Editor behavior, package releases, Storybook, editor accessibility, mobile editor surfaces, and issues tracked in `WordPress/gutenberg`.

Gutenberg uses GitHub for issue and PR management. Still consider Core sync and WordPress release timing when changes affect bundled packages or Core behavior.

## Meta

Use Meta workflow for WordPress.org, WordCamp.org, Make sites, developer.wordpress.org, plugin/theme directories, Pattern Directory, Learn WordPress, global.wordpress.org, jobs.wordpress.net, profile/badge behavior, Slack integrations, handbooks, and project infrastructure maintained by the Meta team.

Meta issues usually belong in Meta Trac or a project-specific GitHub repository listed by the Meta Handbook/project docs. Confirm the component, source location, environment, and tracker before opening or moving tickets.

## Docs, Test, Accessibility, Performance, i18n

Use the relevant Make team surface when the primary contribution is not a code patch:

- Docs: handbook updates, developer docs, inline docs review, user/developer clarity.
- Test: reproduction reports, test cases, test suite improvements, testing instructions.
- Accessibility: keyboard, screen reader, semantics, color contrast, admin/editor accessibility.
- Performance: query count, caching, asset loading, loading strategy, media, measurement.
- i18n/polyglots: strings, translator comments, locale behavior, GlotPress, text domains.

## Routing Rules

- If the issue is in released WordPress Core behavior, start with Core Trac unless it is clearly Gutenberg-only or security-sensitive.
- If the issue is in WordPress.org infrastructure or community sites, start with Meta Trac or the linked Meta project repository.
- If the issue is in the block editor package source or Gutenberg plugin, start with Gutenberg GitHub.
- If the issue is a suspected vulnerability, do not open a public ticket or PR. Use the current private security reporting path.
- If the issue is a support request or site-specific behavior, do not force it into Core or Meta. Identify the plugin/theme/site owner instead.
