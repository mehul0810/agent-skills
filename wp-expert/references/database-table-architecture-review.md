# Database Table Architecture Review

Use this for custom database table design or review from performance, scalability, maintainability, data integrity, migration, privacy, and WordPress portability standpoints.

## Official Anchors

- WordPress Database Description: https://codex.wordpress.org/Database_Description
- WordPress `wpdb` reference: https://developer.wordpress.org/reference/classes/wpdb/
- Creating tables with plugins: https://developer.wordpress.org/plugins/creating-tables-with-plugins/
- `dbDelta()` reference: https://developer.wordpress.org/reference/functions/dbdelta/
- Metadata API: https://developer.wordpress.org/plugins/metadata/

Verify current project database versions, host/VIP constraints, and plugin conventions before depending on database-specific features.

## Review Goal

Determine whether the table architecture supports the real workload safely:

- Performance: predictable query plans, indexes, bounded reads/writes, no hot-table surprises.
- Scalability: production-shaped cardinality, write rate, retention, concurrency, multisite, and operational growth.
- Maintainability: clear ownership, schema versioning, migrations, repository boundaries, tests, and repair/debug tooling.
- WordPress fit: works with `$wpdb`, prefixes, charset/collation, multisite, activation/upgrade flow, uninstall, privacy/export/erase, and platform portability.

## First Questions

Before reviewing columns or indexes, establish:

- What business entity or event does each row represent?
- Expected row count at launch, 6 months, 1 year, and enterprise scale.
- Read paths: admin lists, REST endpoints, frontend rendering, reports, exports, queues, webhooks, search, and joins.
- Write paths: user action, webhook, cron/job, import, migration, checkout, editor save, or integration sync.
- Access pattern: point lookup, recent feed, filtered list, aggregation, dedupe, status transition, full-text-like search, or analytics/reporting.
- Retention and deletion rules: PII, logs, audit records, failed jobs, soft deletes, legal hold, export/erase.
- Multisite ownership: per-site tables, network/global tables, or tenant-aware columns.
- Migration and rollback expectations for existing production data.

If the workload is unclear, do not approve the table design. Ask for the missing query/write/retention model.

## Custom Table Decision Gate

Custom tables are appropriate when data is:

- High-volume or high-write-rate.
- Transactional, event-like, queue-like, log-like, or operational.
- Queried by multiple indexed columns, status/date ranges, dedupe keys, or reporting dimensions.
- Too expensive or semantically wrong for `postmeta`, `usermeta`, options, transients, or CPTs.
- Independent from editorial content lifecycle or needs strict retention/export behavior.

Custom tables are usually not appropriate for:

- Normal editorial content with URLs, revisions, authors, archives, templates, or search.
- Small bounded settings or feature flags.
- Attributes that belong naturally to one post/user/term/comment and are not queried at scale.
- Cache data that can live in object cache/transients with safe TTL/invalidation.

State why WordPress core tables, metadata, options, transients, taxonomies, or CPTs were rejected.

## Schema Design Checklist

Table ownership:

- Table names are prefixed with `$wpdb->prefix` for site-scoped tables or `$wpdb->base_prefix` for network/global tables only when intentional.
- Table constants or a schema registry define names in one place.
- Every table has a documented owner module and lifecycle.

Primary keys and identity:

- Use a simple numeric primary key for internal identity unless a natural key is truly stable.
- Add unique keys for external IDs, idempotency keys, dedupe keys, provider object IDs, or tenant-specific uniqueness.
- Do not overload primary keys with provider IDs that can change or collide across accounts/sites.

Columns and types:

- Use the smallest clear type that supports expected range and portability.
- Store timestamps consistently, usually UTC `datetime`/integer epoch plus timezone context only when business logic needs it.
- Store money as integer minor units plus currency, not floats.
- Store booleans/statuses with explicit enums or tiny integers plus documented allowed values.
- Avoid nullable columns unless "unknown" is materially different from empty/default.
- Avoid JSON blobs for fields that must be filtered, sorted, joined, retained, exported, or erased.
- Keep PII minimal and separate from operational data when retention differs.
- Use WordPress charset/collation via `$wpdb->get_charset_collate()`.

Relationships:

- Document references to posts, users, terms, orders, attachments, sites, providers, or external objects.
- Do not rely on foreign keys to WordPress core tables for portability unless the project explicitly accepts that operational constraint.
- Enforce referential integrity in application code, delete hooks, cleanup jobs, and repair commands.

## Index Strategy

Indexes must match real queries, not guessed fields.

For each read path, record:

- `WHERE` filters.
- Equality columns.
- Range columns.
- Sort column and direction.
- Limit/pagination style.
- Join columns.
- Expected selectivity and row count.

Index rules:

- Prefer composite indexes that match equality filters first, then range/sort columns.
- Respect leftmost-prefix behavior; an index is not useful if the query skips leading columns.
- Add unique indexes for integrity, not only speed.
- Avoid many low-value indexes; every index slows writes and migrations.
- Avoid indexing long text/blob columns. Use fixed-length hashes for dedupe/search keys when appropriate.
- For admin filters, make the common filter/sort path indexed before launch.
- Use `EXPLAIN` on production-shaped data before calling an index correct.

Pagination:

- Prefer keyset/seek pagination for large tables and cursor-like feeds.
- Offset pagination is acceptable for small/admin lists, but large offsets become expensive.
- Count queries need their own budget. Avoid exact total counts when not required.

## Query Architecture

- Use repository/query classes rather than scattered `$wpdb` calls.
- Keep SQL close to named methods that describe intent, such as `find_pending_batch()` or `mark_attempt_failed()`.
- Always use `$wpdb->prepare()` for values.
- Whitelist table names, column names, sort fields, sort direction, and dynamic operators.
- Bound every list/export/report query with limit, cursor, date range, or batch size.
- Separate command methods from query methods when that improves testing and transaction reasoning.
- Return compact DTOs/arrays for hot paths; do not hydrate unnecessary WordPress objects.
- Use cache only when invalidation and privacy boundaries are clear.

## Writes, Concurrency, And Data Integrity

- Make writes idempotent where webhooks, retries, imports, queues, or duplicate submissions are possible.
- Use unique keys plus safe insert/update behavior for dedupe.
- Avoid read-then-write races; prefer atomic updates when possible.
- Track status transitions explicitly with allowed states and timestamps.
- Use transactions only when the target environment supports them and the code handles failure/rollback clearly.
- Keep lock scope short. Do not hold locks during remote API calls, file operations, or slow hooks.
- Record failure reason, retry count, locked/claimed timestamp, and last attempt for queue-like tables.

## Migrations And Lifecycle

Activation:

- Activation creates or updates schema quickly. It must not run long backfills on large sites.
- Use a schema version option and idempotent migration functions.
- Use `dbDelta()` carefully and follow its syntax constraints; do not assume it handles every schema change.

Upgrades:

- Split schema changes from data backfills.
- Backfill in bounded batches via WP-CLI, Action Scheduler, cron, or explicit admin action.
- Make migrations resumable and safe to rerun.
- Preserve launched table/column contracts unless a migration path and rollback limitation are documented.
- Do not add compatibility for abandoned intermediate schemas of unreleased features.

Uninstall:

- Define whether tables are deleted, retained, or retained behind an explicit setting.
- Remove scheduled jobs and options related to table lifecycle.
- Respect legal, audit, and customer data retention requirements.

## Multisite And Enterprise Scale

- Decide per-site vs network/global table before launch; changing later is expensive.
- Per-site tables use `$wpdb->prefix` and isolate tenant data by blog.
- Network/global tables use `$wpdb->base_prefix` and need a `blog_id`/site dimension where data is tenant-scoped.
- Every cache key, query, unique key, export, erase, and repair command must include the correct site/network dimension.
- Avoid scanning every site synchronously. Use WP-CLI or queued batches for network-wide operations.
- For large networks, plan reporting/index tables rather than cross-site runtime joins.

## Privacy, Security, And Compliance

- Minimize PII and sensitive payloads.
- Redact secrets, tokens, headers, request bodies, and private URLs.
- Store opaque references instead of raw sensitive payloads when possible.
- Add personal data exporter/eraser support when the table stores personal data.
- Document retention and purge behavior.
- Avoid logging sensitive rows in admin notices, REST responses, CLI output, debug logs, screenshots, or PR text.

## Maintainability Signals

Good table architecture includes:

- Schema registry or installer class.
- Versioned migrations with tests.
- Repository/query layer with named methods.
- Constants for statuses/types and documented state transitions.
- Integration tests for install/upgrade, CRUD, duplicate/idempotent writes, permissions, and query filters.
- WP-CLI commands for inspect, migrate, backfill, repair, and purge when data volume justifies them.
- Admin diagnostics showing table version, row counts, pending jobs, failed jobs, and repair status when operationally useful.
- Clear docs explaining why custom tables exist and how to evolve them.

Bad table architecture signs:

- Scattered raw SQL across controllers, templates, REST callbacks, and cron handlers.
- Tables created on normal requests.
- Schema changes coupled to long data migrations in activation.
- Missing unique keys for idempotency or provider IDs.
- `SELECT *` on hot paths.
- Unbounded exports/reports.
- Admin filters that sort/filter on unindexed columns.
- JSON blobs used for fields the UI filters or reports on.
- Retention policy missing for logs/events/errors/PII.
- No tests for upgrade from previous schema versions.

## Review Procedure

1. Inventory tables, owners, schema versions, migrations, uninstall behavior, and repository classes.
2. Map each table to business entity, read paths, write paths, retention, and expected cardinality.
3. List real queries and compare them to primary, unique, and secondary indexes.
4. Check `EXPLAIN` or equivalent query plan evidence for high-volume paths when runtime access exists.
5. Review writes for idempotency, concurrency, duplicate submissions, retries, status transitions, and failure visibility.
6. Review multisite, privacy/export/erase, cache keys, and operational tooling.
7. Report findings with performance, scalability, maintainability, and migration impact.

## Finding Template

```text
[P1] Missing composite index makes provider event lookup scan the log table
Table: wp_example_events
Path: webhook replay detection and admin event history
Evidence: queries filter by provider_account_id, external_event_id, and created_at, but only created_at is indexed.
Impact: replay checks and admin history slow down as event rows grow, increasing webhook latency and database load.
Fix: add a unique key on (provider_account_id, external_event_id) for idempotency and an index on (provider_account_id, created_at) for history pagination.
Maintainability: add migration test from the previous schema version and document the query-to-index mapping.
```
