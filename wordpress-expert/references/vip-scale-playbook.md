# WordPress VIP And Enterprise Scale Playbook

Use this for VIP readiness, high-traffic performance, cache behavior, filesystem assumptions, PHPCS/VIPCS, and enterprise deployment risk. Verify current official VIP documentation when exact platform policy matters.

## Current Official Anchors

- VIP performance overview: https://docs.wpvip.com/performance/
- VIP caching overview: https://docs.wpvip.com/caching/
- VIP object cache: https://docs.wpvip.com/caching/object-cache/
- VIP file system: https://docs.wpvip.com/vip-file-system/
- VIP PHPCS installed standards: https://docs.wpvip.com/php_codesniffer/installed-standards/
- WordPress plugin security handbook: https://developer.wordpress.org/plugins/security/

## Platform Mental Model

VIP-style enterprise hosting is horizontally scaled and cache-heavy. Code must assume:

- Multiple web containers can serve requests concurrently.
- Page cache, object cache, query cache, static asset caching, database indexes/read replicas, and autoscaling may exist, but infrastructure does not rescue inefficient application code.
- Local filesystem persistence is not guaranteed except documented temporary paths.
- Deploys, cron runners, queues, and cache invalidation can overlap.

## Cache Layers

Page cache:

- Anonymous GET responses may be cached at the edge.
- Cookies, auth, query parameters, personalized output, and cache-control headers can change cacheability.
- Avoid unnecessary cookies on public pages; they can destroy cache hit rate.
- Do not personalize full pages when fragment/personalization APIs or client-side hydration would preserve cacheability.

Object cache:

- Use for slow queries, remote HTTP responses, computed lookups, and expensive operations.
- Cache entries should stay under platform limits; VIP documents a 1 MB object-cache entry limit.
- Many small cache operations can add latency. Cache intentionally, not reflexively.
- Transients on VIP are backed by object cache, not the options table. Do not query the database directly for transients.
- Include invalidation strategy and key dimensions: site, locale, user segment, permissions, feature flags, source version.

Query cache:

- WP_Query API calls can benefit from platform query caching, but writes flush query cache frequently.
- Persistently cache expensive queries yourself when they are repeated and safe to cache.

## Database And Query Scale

High-risk patterns:

- Unbounded `posts_per_page => -1`, `get_users()` without limits, broad `get_terms()`, large meta queries.
- Leading-wildcard `LIKE`, serialized meta searches, sorting by unindexed meta values.
- Repeated count queries on hot paths when counts are not displayed.
- N+1 post/meta/term/user loading in loops.
- Large writes inside page render or admin bootstrap.

Better patterns:

- Use pagination and upper bounds.
- Use `fields => 'ids'` for ID-only work.
- Use `no_found_rows => true` when total pagination counts are not needed.
- Prime caches deliberately before loops when object hydration is needed.
- Add custom tables for high-volume operational records with proper indexes.
- Use slow query logs, Query Monitor, New Relic, and database metrics when available.

## Filesystem And Media

VIP file system principles:

- `/wp-content/uploads/` maps to an external object store; do not treat it as a normal local filesystem.
- Use `wp_upload_dir()`, `wp_get_upload_dir()`, `media_handle_sideload()`, `media_sideload_image()`, or `wp_upload_bits()` for media operations.
- Do not use `chmod()`/`chown()` style assumptions for uploaded media paths.
- Use `get_temp_dir()` and `wp_tempnam()` for local temporary work.
- Temporary files must be cleaned up and only relied on for the current request.

## VIP Coding Standards

- Prefer project PHPCS with WordPressCS and VIPCS when available.
- Current VIP docs identify `WordPress-VIP-Go` and `WordPressVIPMinimum` as active standards and note that deprecated `WordPress-VIP` should not appear in current standard lists.
- Treat PHPCS findings as review inputs, not blind edits. Fix behavior and security first; avoid sweeping style churn in unrelated files.

## Load Testing And Incidents

- For VIP-hosted load/stress testing, official docs say to notify VIP through Support before testing and outline objectives/methodology.
- Test the highest-traffic request types, not just the homepage.
- Include logged-in/admin, REST, search, checkout/form submission, cache-miss, and background queue scenarios when relevant.
- Measure origin response time, DB queries, slow queries, cache hit rate, object-cache operation count, remote HTTP, PHP errors, and queue depth.

## Enterprise Release Gates

Before calling work VIP/enterprise ready, confirm:

- No secrets or PII leak to logs, cron args, cache keys, client JS, HTML, REST, or PR text.
- Activation and migrations are bounded and resume-safe.
- Hot paths have no synchronous remote dependency unless timeout/fallback behavior is acceptable.
- Cache invalidation is implemented and tested for writes.
- Public pages preserve page cacheability where possible.
- Queries are bounded and indexed for expected production cardinality.
- Background jobs are idempotent and observable.
- Multisite behavior is explicit.
- PHPCS/WPCS/VIPCS or equivalent standards were run when available.
