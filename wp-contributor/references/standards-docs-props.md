# Standards, Docs, Commit Messages, And Props

Use this for contribution quality, coding standards, inline docs, commit-message drafting, props, dev notes, and cross-team review needs.

## Coding Standards

Follow WordPress standards for PHP, JavaScript, CSS, HTML, accessibility, and inline documentation. Use the repository's configured tooling first. Do not reformat unrelated legacy code unless the ticket is explicitly about standards cleanup.

## Inline Documentation

Update docs when changing:

- Public functions, classes, methods, hooks, filters, actions, REST schemas, globals, constants, or developer-facing behavior.
- New or changed parameters, return values, default behavior, deprecations, and since-version expectations.
- JavaScript package APIs, components, hooks, data stores, or block APIs.

Keep comments concise and useful for future contributors. Explain why a non-obvious compatibility, security, cache, or performance decision exists.

## Commit Message Drafting

Even non-committers can draft useful commit-message material for maintainers.

A strong draft includes:

- Component prefix and short imperative summary.
- Explanation of what changed and why.
- Developer-facing impact or compatibility notes.
- Props list using WordPress.org usernames.
- Ticket references such as `Fixes #12345` or `See #12345` when appropriate.

Do not imply a fix closes a ticket unless the patch fully resolves it.

## Props Discipline

Consider props for:

- Reporter.
- Patch authors and patch refreshers.
- Test authors.
- Reviewers.
- Designers and accessibility reviewers.
- Documentation contributors.
- User testers or reproduction providers.
- Duplicate ticket contributors with useful evidence.

Use WordPress.org usernames where possible.

## Dev Notes And Field Guides

Flag possible dev-note needs when a change affects:

- Public APIs, hooks, filters, classes, REST endpoints, database schema, block APIs, editor behavior, package APIs, default themes, or backward compatibility.
- Deprecated behavior or migration paths.
- New requirements for plugin/theme authors.

## Cross-Team Review

Request specialist review when the change affects:

- Accessibility: UI controls, keyboard behavior, semantics, focus, contrast, screen reader announcements.
- Performance: hot paths, queries, caching, autoloaded options, assets, media, editor load.
- Security/privacy: auth, capabilities, nonces, escaping, sanitization, data exposure, personal data.
- Design/UX: editor flows, admin UI, user-facing interaction patterns.
- i18n/polyglots: strings, translator comments, locale behavior, RTL.
