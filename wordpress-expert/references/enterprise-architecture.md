# Enterprise WordPress Architecture

Use this for feature design, refactors, plugin architecture, migrations, async jobs, data modeling, and large-codebase maintainability.

## Principal Engineer Defaults

- Design for production traffic, years of maintenance, partial deploys, rollback, and multiple contributors.
- Preserve backward compatibility unless the user explicitly accepts a breaking change.
- Prefer boring WordPress-native integration points with clear boundaries over clever abstractions.
- Keep every decision tied to a failure mode: security, scale, data integrity, operability, or developer velocity.

## Plugin Structure

A scalable plugin shape:

```text
plugin.php                  thin bootstrap, constants, autoload, Plugin::boot()
src/Plugin.php              composition root, module registration
src/Admin/                  admin screens, list tables, settings registration
src/Rest/                   REST controllers and schemas
src/Domain/                 business rules independent from WP globals where practical
src/Persistence/            options, repositories, custom table gateways
src/Jobs/                   cron/Action Scheduler jobs
src/Assets/                 enqueue and asset metadata
src/Blocks/                 block registration and render callbacks
```

Guidelines:

- Bootstrap should fail safely if dependencies are missing.
- Public hooks/filters should be named consistently and documented inline where non-obvious.
- Keep WordPress boundary code thin. Put business decisions in testable services.
- Avoid service locators everywhere. A small composition root is fine; global mutable containers are not.

## Data Modeling

Use WordPress storage when it matches access patterns:

- Options: small configuration, not high-cardinality records.
- Post/meta: content-like records that need admin/editor/query ecosystem support.
- User/term meta: low-volume attributes attached to existing entities.
- Custom tables: high-volume events/logs, provider attempts, reporting, queues, many writes, or indexed lookup patterns that meta tables cannot support.

Custom table requirements:

- Versioned schema option and idempotent migrations.
- Indexes for every high-volume lookup and retention cleanup path.
- No long activation-time migrations for existing large datasets.
- Explicit retention, privacy, export/erase behavior when records contain user data.
- Repository/gateway layer so SQL is isolated and testable.

## Options And Configuration

- Avoid autoload for large, volatile, or rarely used options.
- Group related settings into a schema when it reduces option churn, but do not create one giant hot option updated by unrelated features.
- Validate settings on write, not only on render.
- Use environment variables or host secret managers for secrets when available; avoid storing plaintext secrets unless there is a deliberate encrypted-at-rest strategy.
- When secrets must be stored in WordPress, never expose them through REST, localized scripts, logs, debug screens, or exported config.

## Async And Background Work

Use async work when a user request would otherwise wait on remote APIs, heavy processing, or large writes.

Design rules:

- Jobs are idempotent. Running twice should not corrupt state or duplicate irreversible side effects.
- Job args contain stable IDs/tokens, not full PII payloads or secrets.
- Store sensitive payloads in short-lived private storage keyed by opaque token when needed.
- Add status transitions, attempts, last error, and timestamps for operability.
- Use locks for single-flight jobs and provider cooldowns.
- Batch large work with cursors; never process unbounded records in one request.
- Prefer Action Scheduler for plugin-owned queues when available; otherwise use WP-Cron carefully and document limitations.

## Caching Strategy

Cache only with an invalidation plan.

- Cache expensive deterministic reads, remote responses, permission-independent computed data, and stable lookup maps.
- Include site/blog ID, locale, user segment, and relevant feature flags in keys when output varies by those dimensions.
- Do not cache permission-sensitive data globally unless the key includes the permission boundary.
- Keep cache payloads compact. Avoid storing full post objects when IDs or small DTOs are enough.
- Invalidate on source writes: `save_post`, `deleted_post`, term changes, option updates, provider state changes, or custom table writes.
- Use stale fallback or locks for high-traffic misses.

## Security Architecture

- Model each endpoint by actor, capability, object ownership, nonce/CSRF, input schema, side effects, and audit trail.
- Keep authorization close to the entry point and repeat object-level checks in lower-level services when records can be accessed from multiple paths.
- Separate validation from sanitization: validation decides whether input is acceptable; sanitization normalizes accepted input.
- Escape late at the output boundary.
- Redact logs at the logger boundary so future call sites cannot leak by accident.

## Multisite

- Decide whether settings are per-site, network-wide, or inherited with site override.
- Include `get_current_blog_id()` in cache keys and custom table strategy when data is site-specific.
- Avoid network-wide loops in web requests. Batch with WP-CLI or background jobs.
- Use `switch_to_blog()` sparingly and always restore.
- Check capabilities at the correct scope: site admin vs network admin.

## Admin And UX

- Admin pages should degrade when external services fail.
- List tables need pagination, indexed queries, bulk action nonces, and object-level permissions.
- Settings pages need clear save feedback and validation errors.
- Avoid loading expensive dashboard widgets or remote health checks on every admin page.

## Blocks And Themes

- Dynamic blocks should keep render callbacks small and cacheable when output is expensive.
- Persist styling controls as attributes if frontend output depends on them.
- Keep layout concerns separate from behavior changes. Do not rewrite native block markup for query/filter behavior unless required.
- For themes, inspect parent theme, child theme, block templates, patterns, theme.json, and build source before editing generated files.

## Observability

Minimum useful production signals:

- Structured error events with redacted context and stable IDs.
- Job status and retry history.
- Query/cache measurements for performance-sensitive paths.
- Admin/debug screens that show health without exposing secrets.
- Feature flags or kill switches for risky external integrations.

## Backward Compatibility

Before changing public behavior, check:

- Hooks, filters, shortcodes, block names/attributes, REST routes, WP-CLI commands.
- Option names and shapes.
- Custom table columns and indexes.
- Asset handles and localized object names.
- Template override paths and theme integration points.
- Third-party extension points and documented snippets.
