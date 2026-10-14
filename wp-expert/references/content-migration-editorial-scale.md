# Content Migration And Editorial Scale

Use this for large imports, VIP database/media import planning, content modeling, redirects, SEO preservation, editorial workflows, role/capability design, migration WP-CLI commands, and launch cutovers.

## Current Official Anchors

- VIP databases overview: https://docs.wpvip.com/databases/
- VIP import command: https://docs.wpvip.com/vip-cli/commands/import/
- VIP import SQL with VIP-CLI: https://docs.wpvip.com/databases/import/import-with-vip-cli/
- VIP migrate content/databases: https://docs.wpvip.com/how-tos/migrate-content-databases/
- VIP multisite database imports: https://docs.wpvip.com/databases/import/multisite-database-imports/
- VIP WP-CLI with VIP-CLI: https://docs.wpvip.com/vip-cli/wp-cli-with-vip-cli/
- VIP custom WP-CLI commands at scale: https://docs.wpvip.com/vip-cli/wp-cli-with-vip-cli/cli-commands-at-scale/

## Migration Principle

A migration is a product launch with data risk. Treat content integrity, editorial continuity, SEO preservation, and rollback as first-class requirements.

Inventory before building:

- Post types, taxonomies, statuses, authors, comments, media, menus, widgets, options, metadata, relationships, redirects, forms, embeds, shortcodes, blocks, and custom tables.
- URL contracts, canonical URLs, sitemaps, hreflang, redirects, analytics, schema markup, and feed consumers.
- Editorial workflows, roles, approvals, scheduled posts, previews, revisions, autosaves, and newsroom peak times.
- Data quality: duplicates, orphaned media, broken embeds, invalid dates, invalid authors, missing alt text, oversized meta, serialized data, and legacy encodings.

## VIP Import Planning

Verify current VIP limits and procedures before committing to an import plan.

- Use VIP validation commands for SQL/media files before import where available.
- Understand launched vs unlaunched environment behavior, maintenance mode, protected options, and multisite table-prefix requirements.
- Use search-replace deliberately and preserve serialized data integrity.
- Use checksums or counts for source/destination validation.
- Do dry runs in local/staging with production-shaped data.
- For sensitive remote import URLs, use short-lived credentials and never commit or paste secrets into logs/PRs.

## Custom Import Commands

For custom WP-CLI importers:

- Make commands idempotent and resumable with checkpoints.
- Process in bounded batches and clean memory between batches.
- Treat pagination as a coverage protocol: follow newly revealed next-page links/cursors until an explicit terminal condition, while tracking visited page/cursor identities and deduplicating source item IDs. Bound requests and items separately; detect repeated pages, cursor loops, and APIs that clamp an out-of-range page back to a prior terminal page. Report the exact observed coverage and whether request/batch limits stopped traversal. Do not claim "all" records from a page count or a successful response alone.
- Reconcile source evidence and stable IDs before claiming completeness. If the importer changes the membership or order of the live query used for offset pagination, do not advance its offset as if the resultset were static. Prefer a stable-ID snapshot, keyset cursor, or high-water mark; otherwise restart safely from offset zero and skip IDs already durably completed, with a no-progress bound. Keep failed IDs in a retry/resume ledger and reconcile them before reporting completion; a generic error or exhausted batch is not success.
- Avoid loading full datasets into memory.
- Use WordPress APIs when hooks, cache invalidation, search indexing, or media metadata must run.
- If direct DB writes are unavoidable, schedule explicit cache cleanup, search reindex, and integrity checks.
- Log counts and redacted errors; do not log full private payloads.
- Support `--dry-run`, `--limit`, `--offset` or cursor, `--resume`, and `--skip-existing` when practical.

## Media And Asset Migration

- Validate file paths, MIME types, image sizes, duplicates, and missing originals.
- Preserve attachment IDs only when the whole database contract requires it; otherwise map old IDs to new IDs explicitly.
- Regenerate metadata and responsive image sizes when needed.
- Confirm object-storage behavior and do not assume local file persistence across web nodes.
- Keep redirect mapping for moved media URLs when legacy URLs have search or social value.

## Editorial Scale

- Use roles/capabilities to reflect workflow, not convenience admin access.
- Optimize admin list tables, filters, search, and bulk actions for production content counts.
- Avoid network-wide or full-content scans during admin page loads.
- For large publishing teams, design previews, approvals, notifications, content locking, and scheduled publishing carefully.
- Monitor cron/scheduled post reliability and queue backlog during launches.

## Cutover Checklist

- Freeze window and delta migration plan are approved.
- Redirects, canonicals, sitemaps, robots, feeds, analytics, and SEO metadata are validated.
- Content counts and sample records match expected source data.
- Search indexes and caches are warmed or ready.
- Editors can create, edit, preview, schedule, and publish with expected roles.
- Rollback and communication plan is documented.
