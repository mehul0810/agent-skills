# Performance Review And Fix

Use for evidence-based WordPress profiling and remediation across PHP, database, cache, remote calls, jobs, admin/editor, frontend assets, and real-user experience.

## Authoritative Anchors

- WordPress Performance Handbook: https://make.wordpress.org/performance/handbook/
- WordPress optimization guidance: https://developer.wordpress.org/advanced-administration/performance/optimization/
- WordPress VIP performance diagnosis: https://docs.wpvip.com/performance/identify-performance-issues/
- Core Web Vitals: https://web.dev/articles/vitals

Verify current metrics and host limits before making exact claims. Current Core Web Vitals “good” thresholds are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile, segmented across mobile and desktop. They are user-experience targets, not a substitute for product SLAs.

## Performance Contract

Define the measured path before changing code:

- Exact revision/package, URL/screen/route/hook/job, role, device, and environment.
- Realistic data volume, traffic/concurrency, cold/warm cache, and anonymous/authenticated state.
- Baseline metric and budget: query count/time, PHP/request time, memory, cache hit rate, remote latency, queue age, asset bytes, long tasks, LCP/INP/CLS, or a repo-defined SLA.
- Repeatable measurement command or trace. Do not compare unrelated environments.

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

## Proof And Completion

Re-measure the same path and conditions. Every fixed finding must report:

- Before and after values with units and run identity.
- Budget and whether it passed.
- Variance/sample limitations.
- Functional/regression checks, cache correctness, and failure behavior.
- Remaining bottleneck or operational risk.

Add a regression budget/check when stable and cheap enough. For release-critical paths, test the package or release-branch build with realistic data and cold/warm states. Never claim “faster” without comparable before/after evidence.
