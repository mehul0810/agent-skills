# Performance Review And Fix

Use for evidence-based WordPress profiling and remediation across PHP, database, cache, remote calls, jobs, admin/editor, frontend assets, and real-user experience.

## Authoritative Anchors

- WordPress Performance Handbook: https://make.wordpress.org/performance/handbook/
- Performance measurement and Server-Timing: https://make.wordpress.org/performance/handbook/measuring-performance/benchmarking-php-performance-with-server-timing/
- Measurement best practices and field data: https://make.wordpress.org/performance/handbook/measuring-performance/best-practices-for-performance-measurement/
- WordPress optimization guidance: https://developer.wordpress.org/advanced-administration/performance/optimization/
- WordPress VIP performance diagnosis: https://docs.wpvip.com/performance/identify-performance-issues/
- WordPress VIP cache/origin analysis and rate limits: https://docs.wpvip.com/performance/analyze-server-performance/ and https://docs.wpvip.com/security/rate-limiting/
- Core Web Vitals: https://web.dev/articles/vitals

Verify current metrics and host limits before making exact claims. Current Core Web Vitals “good” thresholds are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile, segmented across mobile and desktop. They are user-experience targets, not a substitute for product SLAs.

## Performance Contract

Define the measured path before changing code:

- Exact revision/package, URL/screen/route/hook/job, role, device, and environment.
- Realistic data volume, traffic/concurrency, cold/warm cache, and anonymous/authenticated state.
- Baseline metric and budget: query count/time, PHP/request time, memory, cache hit rate, remote latency, queue age, asset bytes, long tasks, LCP/INP/CLS, or a repo-defined SLA.
- Repeatable measurement command or trace. Do not compare unrelated environments.

For elevated, high-traffic, release-critical, or user-visible latency work, extend the receipt with repeated-run distribution (p50/p75/p95 or p99 when the sample supports it), sample/run count, variance, error rate, cache state, field-versus-lab classification, measurement provenance, and material limitations. A median alone can hide tail failure; do not require p99 for a small deterministic local change.

## Review Workflow

1. Rank paths by user impact, frequency, and origin cost.
2. Capture comparable baseline evidence. Use production observability read-only when authorized; reproduce fixes locally or in non-production.
3. Trace dominant cost rather than optimizing every visible call:
   - Unbounded/N+1/meta/tax queries, missing indexes, unnecessary hydration/counts, and write amplification.
   - Large/volatile autoloaded options, cache-key mistakes, invalidation storms, stampedes, and private/public cache mixing.
   - Synchronous remote calls, retries without bounds, cron overlap, queue backlogs, and oversized job payloads.
   - Global bootstrap work, admin-wide hooks/assets, editor preloads, metabox calculations, and list-table scans.
   - Render-blocking or route-global CSS/JS, duplicate libraries, heavy hydration/long tasks, fonts, images, embeds, and layout shift.
4. Prove the suspected cause by removing, isolating, tracing, querying with `EXPLAIN`, or measuring a controlled variant.
5. Report the exact trigger, baseline, impact, root cause, proposed budget, fix, and compatibility risk.

## Resilience And Capacity Boundaries

For public, expensive, paid, import/export, AI/provider, or high-volume paths, define quantitative limits for request/body size, items, concurrency, execution time, retries, queue depth, and provider cost where relevant. Prove the over-limit response (reject, throttle, queue, or bounded degradation), dependency timeout/fallback, retry backoff and ceiling, and that bursts do not create a retry storm or runaway backlog. Treat platform/VIP edge protection as complementary, not a substitute for application limits.

For shared or mutable caches, prove key dimensions, read-after-write behavior, concurrent updates, multi-node/replica consistency, targeted invalidation, and acceptable stale behavior when those conditions are part of the contract. For third-party scripts, embeds, fonts, or APIs, record a per-provider budget, consent/load policy, timeout/fallback, and a disable or kill path when the resource can affect a critical journey.

## Fix Ladder

Prefer structural fixes in this order:

1. Stop unnecessary work or scope it to the exact screen/block/route.
2. Bound and paginate reads/writes; fetch IDs/columns only when full objects are unnecessary.
3. Change data/query shape and add indexes matched to real predicates and sort order.
4. Cache deterministic reads with complete key dimensions, explicit owner/invalidation/TTL, compact payloads, and stampede protection.
5. Move non-immediate external or heavy work to idempotent bounded jobs with retry/backoff and visible failure.
6. Reduce/condition assets, split editor/admin/frontend bundles, reserve layout space, optimize responsive media/fonts, and remove main-thread work.

Do not:

- Add caching before defining invalidation and privacy dimensions.
- Hide a slow query with a long TTL when writes or freshness make it unsafe.
- use `posts_per_page => -1`, unbounded exports, or full-site scans on request paths.
- Run load tests against production without explicit approval.
- Treat Lighthouse alone as field INP or production capacity proof. Lab evidence catches regressions; field data represents real users.

## WordPress Scale Checks

- Queries: explicit limits, `fields => 'ids'`, `no_found_rows`, cache priming, indexed custom-table access, and bounded counts.
- Options: small stable autoloaded configuration only; no logs, caches, provider payloads, or per-user state.
- Cache: site/locale/user/role/permission/feature/schema dimensions when output varies; no secrets or PII in shared entries.
- Remote: explicit timeout, error handling, circuit/fallback behavior, async path for non-immediate work.
- Jobs: bounded batches, cursors, locks, idempotency, retry ceiling, backlog age/failure signals.
- Editor/admin: screen-specific hooks and assets, compact REST payloads, no full dataset bootstrap.
- Frontend: mobile-first media/assets, server response, LCP discovery, INP long tasks, CLS reservation, and third-party script cost.
- Public/expensive work: explicit resource budgets, bounded failure behavior, and no retry amplification.

## Proof And Completion

Re-measure the same path and conditions. Every fixed finding must report:

- Before and after values with units and run identity.
- Budget and whether it passed.
- Variance/sample limitations.
- For elevated paths, tail distribution, error rate, cache state, field/lab classification, provenance, and limitations.
- Functional/regression checks, cache correctness, and failure behavior.
- Remaining bottleneck or operational risk.

Add a regression budget/check when stable and cheap enough. For release-critical paths, test the package or release-branch build with realistic data and cold/warm states. Never claim “faster” without comparable before/after evidence.
