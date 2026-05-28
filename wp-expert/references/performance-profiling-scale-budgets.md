# Performance Profiling And Scale Budgets

Use this for WordPress performance design, profiling, optimization, regression review, load-readiness, Core Web Vitals, admin/editor speed, database/query engineering, object-cache behavior, and high-traffic acceptance criteria. For custom table schema/index/migration architecture review, use `database-table-architecture-review.md`.

## Official Anchors

- VIP performance overview: https://docs.wpvip.com/performance/
- VIP request/application analysis: https://docs.wpvip.com/performance/analyze-requests-and-application-code/
- VIP Insights and Metrics: https://docs.wpvip.com/performance/insights-metrics/
- VIP caching overview: https://docs.wpvip.com/technical-references/caching/
- WordPress performance handbook: https://make.wordpress.org/performance/handbook/
- WordPress database class reference: https://developer.wordpress.org/reference/classes/wpdb/
- Core Web Vitals: https://web.dev/vitals/

Verify current official docs before relying on exact platform limits, benchmark tooling, or host-specific rules.

## Performance Principle

Do not optimize by intuition when the path can be measured. For enterprise WordPress, a performance change is complete when the changed hot path has a budget, a baseline, a measured result, and a known remaining risk.

## Profiling Workflow

1. Define the path: public page, cache miss, REST endpoint, admin screen, block editor load, checkout/form, search, import, cron/job, webhook, or CLI command.
2. Define the user and traffic model: anonymous, logged-in, editor, admin, customer, integration, multisite tenant, peak RPS, cache hit rate, data volume, and concurrency.
3. Capture a baseline: query count, slow queries, TTFB/server time, REST latency, object-cache operations, memory, remote calls, bundle size, Core Web Vitals, job duration, and error rate where relevant.
4. Set a budget before changing code.
5. Make the smallest structural fix: query shape, cache, async, pagination, bundle split, asset loading, or data model.
6. Re-measure the same path with comparable data and cache state.
7. Add tests or guardrails for the failure mode, not only the happy path.

If a tool is unavailable, use the closest lower-level evidence and state the gap.

## Default Review Budgets

These are starting review triggers, not universal SLA promises. Tighten them for critical paths and high-traffic launches.

| Surface | Initial budget / review trigger |
| --- | --- |
| Anonymous public page | Must preserve edge/page cacheability unless personalization is approved. Avoid cookies, user-specific HTML, random output, and no-cache headers. |
| Public cache miss | No unbounded queries, no synchronous slow remote calls, no N+1 loops, and no large autoload churn. |
| REST GET route | Bounded pagination, compact payload, permission-aware cache strategy, and predictable p95 target. Heavy routes need measured latency and cache behavior. |
| REST mutation/form/checkout | Explicit timeout/fallback for remote calls, idempotency or duplicate-submit safety, and no expensive synchronous work that can be queued. |
| Admin list table | Pagination, indexed filtering/sorting, bounded counts, and no work proportional to total site size on every load. |
| Block editor load | No global editor data fetches beyond needed entities, no heavy metabox work, no unbounded preloads, and no large route-agnostic bundles. |
| Autoloaded options | Keep autoloaded data small and stable. Large, volatile, log-like, cache-like, or per-user/provider state must not autoload. |
| Object cache entry | Keep entries compact. Treat very large payloads, many small operations in tight loops, or missing key dimensions as review blockers. |
| Frontend bundle | Enqueue only where needed, split admin/editor/frontend bundles, and justify meaningful gzip size increases on critical paths. |
| Background job | Bounded batch size, idempotent processing, retry safety, observable failure, and no unbounded memory growth. |

When the repo or host already defines budgets, use those instead and report deviations.

## Hot Path Detection

Search for these risk patterns:

```bash
rg -n "posts_per_page\\s*=>\\s*-1|get_posts\\(|new WP_Query|get_users\\(|get_terms\\(|meta_query|orderby.*meta|admin_init|init|wp_remote_|set_transient|get_option\\(|update_option\\(|wp_schedule|ActionScheduler|register_rest_route|enqueue" .
```

Review recurring WordPress hotspots:

- Plugin/theme bootstrap on every request.
- `admin_init`, `init`, `plugins_loaded`, `current_screen`, dashboard widgets, plugin list, Site Health, and update checks.
- Block editor preload, REST route registration, document panels, metabox compatibility, block render callbacks, and Query Loop variations.
- Search, archive, reports, analytics, WooCommerce order/customer queries, large taxonomy trees, and media libraries.
- Imports, exports, sync jobs, webhooks, and queue workers.
- `get_plugins()`, theme directory scans, active plugin resolution, list-table counts, and broad filesystem scans.

## Database And Query Engineering

- Use `EXPLAIN` for custom SQL and slow `WP_Query` equivalents when possible.
- Avoid leading wildcard `LIKE`, serialized meta search, unindexed `meta_value` sorting, and broad OR meta queries on large tables.
- Prefer exact indexed filters, taxonomy tables, lookup tables, custom tables, or search indexes when meta queries become operational data.
- Use `fields => 'ids'`, `no_found_rows => true`, pagination, and explicit `posts_per_page` limits.
- Prime caches intentionally when object hydration is needed; do not let templates create N+1 meta/term/user loads.
- Add composite indexes to custom tables based on real query predicates and sort order.
- Keep write amplification visible: every save hook, status transition, import row, webhook, and queue item can invalidate caches or update options.

## Cache And Stampede Engineering

- Define cache owner, key dimensions, invalidation event, TTL, and stale behavior.
- Include blog ID, locale, user segment, role/capability boundary, feature flag, provider account, and schema/version dimensions when output varies.
- Store IDs or compact DTOs instead of full objects where possible.
- Prevent hot-miss stampedes with short locks, stale fallback, jittered TTL, request coalescing, or async warming.
- Avoid global cache purges for narrow content changes.
- Do not cache private data under public keys or user-specific data without the user/site dimension.

## Admin And Editor Performance

- Do not run expensive scans or remote calls on every admin request.
- Load admin assets only on the screen that needs them.
- Keep block editor data preloads targeted to the current post/site context.
- Move heavy classic editor metabox calculations behind explicit user action or async fetches where possible.
- For block editor document/sidebar panels, fetch only required data, debounce writes, and keep REST responses compact.
- Avoid registering large pattern/style/variation payloads dynamically on every editor load if they can be static or cached.

## Frontend And Core Web Vitals

- Protect LCP: optimized hero media, explicit dimensions, responsive image sizes, no unnecessary render-blocking assets, and no late server-generated layout shifts.
- Protect INP: avoid global heavy JS, long tasks, unnecessary hydration, and broad event listeners.
- Protect CLS: reserve media/ad/embed space and avoid late injected notices/toolbars in public layouts.
- Use hashed/versioned assets and long-lived cache headers where the platform supports it.
- Keep block/theme CSS scoped and avoid shipping editor-only styles to public pages.
- Test mobile-first. Desktop-only performance is not enough.

## Async And Backpressure

- Queue work that is slow, retryable, external, or not required for the user's immediate response.
- Make jobs idempotent with stable item keys and processed markers.
- Use bounded batches and resume cursors.
- Add retry limits, exponential backoff where appropriate, dead-letter/error visibility, and admin/operator status.
- Avoid putting PII/secrets or large payloads in scheduled args. Store opaque IDs and load private payloads server-side.
- Watch queue depth, oldest pending age, failure rate, and per-job runtime.

## Measurement Recipes

Cheap local checks:

```bash
wp option list --autoload=on --format=json | wc -c
wp transient delete --all
wp cron event list
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' https://example.test/wp-json/example/v1/route
```

Repo/runtime checks:

- Query Monitor or `SAVEQUERIES` for query count and duplicate queries on local/staging only.
- New Relic, VIP Insights, APM traces, slow query logs, and platform metrics where available.
- Browser devtools, Lighthouse, WebPageTest, or Playwright traces for frontend and editor surfaces.
- k6, Artillery, or platform-approved load tests for traffic shape and concurrency.
- WP-CLI probes for options, cron, queues, custom tables, and migration progress.

## Performance Review Output

For every performance finding, include:

- Path: exact route, screen, template, hook, job, or CLI command.
- Trigger: traffic/data shape, role, cache state, or concurrency.
- Evidence: query count, slow query, timing, bundle size, cache behavior, code path, or measured before/after.
- Impact: origin load, editor delay, checkout risk, cache stampede, memory growth, slow admin, queue backlog, or Core Web Vitals regression.
- Fix: structural change and acceptance check.
- BC risk: public API, data model, hook behavior, UI/editor behavior, or migration concern.

## Finding Template

```text
[P1] Admin list table performs unbounded meta queries on every load
Path: /wp-admin/admin.php?page=example-reports
Trigger: sites with 100k+ orders and multiple report filters.
Evidence: get_posts() runs with posts_per_page => -1 and a meta_query sorted by unindexed meta_value.
Impact: slow admin and database saturation during reporting.
Fix: add paginated custom table or lookup table with indexed report columns, and add a focused regression test for bounded pagination.
BC risk: preserve existing filters and export columns while changing the storage/query path.
```
