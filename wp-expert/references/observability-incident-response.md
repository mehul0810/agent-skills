# Observability And Incident Response

Use this for production incidents, high-traffic triage, monitoring strategy, SLOs, log review, New Relic/Query Monitor/VIP Insights, slow queries, cache metrics, and post-incident work.

## Current Official Anchors

- VIP performance overview: https://docs.wpvip.com/performance/
- VIP Insights & Metrics: https://docs.wpvip.com/performance/insights-metrics/
- VIP New Relic: https://docs.wpvip.com/performance/new-relic/
- VIP logs overview: https://docs.wpvip.com/logs/
- VIP Runtime Logs: https://docs.wpvip.com/logs/runtime-logs/
- VIP Log Shipping: https://docs.wpvip.com/logs/log-shipping/
- VIP slow query logs: https://docs.wpvip.com/logs/slow-query/

## Operating Model

Treat observability as a production feature, not a debugging afterthought.

- Define the critical user journeys: homepage, article, search, login, checkout/form submit, REST endpoints, editor save, cron/queue processing, import/export, webhook ingestion.
- Define service-level indicators before optimizing: availability, latency percentiles, error rate, cache hit rate, origin request rate, DB time, slow queries, object-cache operation count, queue depth, deploy health.
- Segment metrics by environment, route, user state, cache status, device class, locale, and multisite blog/network when relevant.
- Make logs useful but safe: structured context, stable event names, request IDs, correlation IDs, redacted payloads, no secrets or PII.
- Add visibility to background work: job name, target ID, attempt, duration, result, retry/backoff, and final failure state.

## VIP And Enterprise Signals

Use the available platform signals before guessing:

- Insights & Metrics for HTTP, resource usage, database, and cache health.
- New Relic for slow transactions, slow external calls, slow queries, error traces, Apdex, and route-level anomalies when enabled.
- Runtime Logs for near-real-time PHP/application errors, knowing container logs can rotate across deployments.
- Log Shipping for durable HTTP edge/origin logs, application logs, batch logs, and slow query logs when deeper analysis is needed.
- Query Monitor for local/staging query, hook, HTTP, and object-cache visibility.
- WP-CLI/VIP-CLI probes for options, cron, Action Scheduler, REST route discovery, cache checks, and index/search state.

## Incident Flow

1. State the incident clearly: impact, affected audience, affected routes, start time, last known good release, and business priority.
2. Stabilize first: feature flag, disable risky integration, reduce batch size, bypass non-critical remote calls, rollback, or route traffic away if platform support is involved.
3. Preserve evidence: deploy SHA, logs, traces, request IDs, user role, cache status, payload shape, reproduction steps, screenshots, and monitoring window.
4. Isolate the layer: edge cache/CDN, PHP, database, object cache, remote dependency, queue/cron, search index, media/filesystem, browser/frontend, admin/editor.
5. Apply the smallest reversible fix or mitigation.
6. Validate recovery with production-relevant checks, not just local tests.
7. Write a post-incident note: root cause, trigger, blast radius, detection gap, prevention, owner, and due date.

## WordPress Failure Patterns To Check

- Cache bypass caused by cookies, non-cacheable headers, query strings, personalized full-page output, or logged-in assumptions.
- Slow origin generation from broad `WP_Query`, meta queries, term queries, user queries, `FOUND_ROWS`, N+1 loops, autoloaded option bloat, or synchronous remote calls.
- Admin/editor incidents from expensive dashboard widgets, list table counts, block editor data stores, autosaves, REST preloads, or plugin bootstrap side effects.
- Queue incidents from missing handlers, unsafe retries, too-large batches, unbounded memory growth, duplicate execution, or secrets/PII in args.
- Search incidents from stale indexes, direct database writes that bypass indexing hooks, oversized indexed fields, or fallback queries hitting MySQL under load.
- Deploy incidents from missing built assets, Composer autoload drift, DB migrations running on web requests, cache invalidation gaps, or backwards-incompatible schema changes.

## Incident Report Template

- Impact: affected users, routes, roles, revenue/editorial impact, and duration.
- Detection: alert, user report, monitoring signal, or deploy smoke failure.
- Root cause: exact code/config/platform condition with evidence.
- Mitigation: what changed and why it was reversible.
- Validation: metrics/logs/tests proving recovery.
- Prevention: tests, alerts, dashboards, runbook, ownership, and deadline.

## Done Criteria

- Incident impact and root cause are evidence-backed.
- The fix or mitigation is deployed, validated, and reversible.
- Logs/metrics are redacted and sufficient for future recurrence detection.
- Follow-up work is captured as issues with owner, priority, and acceptance criteria.
