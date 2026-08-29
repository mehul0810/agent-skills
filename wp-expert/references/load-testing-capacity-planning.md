# Load Testing And Capacity Planning

Use this for launch readiness, peak-event planning, traffic modeling, load-test design, capacity assumptions, and performance acceptance criteria.

## Current Official Anchors

- VIP performance overview: https://docs.wpvip.com/performance/
- VIP load testing: https://docs.wpvip.com/performance/load-testing/
- VIP analyze server performance: https://docs.wpvip.com/performance/analyze-server-performance/
- VIP analyze requests and application code: https://docs.wpvip.com/performance/analyze-requests-and-application-code/
- VIP Insights & Metrics: https://docs.wpvip.com/performance/insights-metrics/

## Capacity Model

Start with a traffic model before choosing a test tool:

- Expected peak page views, requests per second, concurrent users, and duration.
- Origin request percentage after edge cache, not just total traffic.
- Mix of anonymous, logged-in, editor/admin, REST, search, forms, checkout, preview, media, and background jobs.
- Geographic distribution and device/network assumptions.
- Content freshness needs: publish spikes, cache purge behavior, and pre-warming expectations.
- Failure thresholds: latency, 5xx rate, origin saturation, DB time, slow queries, queue backlog, cache hit-rate drop, and third-party timeout rate.

## Capacity Envelope And Scale Lifecycle

Use this overlay for high-traffic, multisite, persistent-state, provider, queue, import/export, or release-critical work. It extends the traffic model; do not invent host-independent limits.

Record a compact capacity envelope:

- Workload identity: request mix, average and peak rate, concurrency, origin/cache-miss share, site or tenant distribution, data cardinality, and dependency/provider mix.
- Growth horizon: launch, near-term, and agreed forecast cardinality/traffic; state confidence and the assumptions that would invalidate it.
- Budgets and headroom: latency/error/DB/worker/cache/queue/provider/storage budgets, measured saturation point, remaining headroom, and the signal that triggers scaling or scope reduction.
- Fairness and admission: per-site/tenant/actor quotas or concurrency caps, priority classes, noisy-neighbor isolation, load shedding, and bounded degradation. State `Not applicable - reason` when the surface is single-tenant and non-shared.
- Queue capacity: arrival rate versus service rate, worker concurrency, maximum age/depth, drain-time target, retry/dead-letter behavior, pause/resume, and duplicate or poison-work handling.
- Data lifecycle: write amplification, hot-key/partition risk, storage and index growth, retention/archive/compaction, migration and reindex limits, backup size, and restore time at the forecast point.
- Distributed behavior: primary/replica consistency, cache invalidation, lock ownership, failover, dependency outage, and recovery or graceful-degradation behavior where applicable.
- Action ownership: the next scale action, trigger, owner, deadline, and rollback or capacity-reduction path.

For elevated or release-critical work, the receipt must include the tested revision/package, environment, workload and forecast, budgets, headroom/saturation evidence, fairness/admission result, queue and storage results, failure/recovery behavior, provenance, and limitations. A single median, a green load-test command, or a platform autoscaling claim is not a capacity guarantee. For low-volume work, record a concise non-applicable reason instead of running a speculative load test.

## VIP-Specific Guardrails

When testing VIP-hosted environments, verify current VIP docs and coordinate with VIP Support before load or stress testing. The current VIP guidance includes notifying Support with objectives and methodology, using baseline tests before/after changes, ramping traffic gradually, stopping at fail thresholds, avoiding artificial cache-busting, and focusing on realistic origin traffic.

Do not simulate denial-of-service behavior, bypass platform safeguards, or run surprise high-volume tests against production.

## Test Plan Template

- Objective: launch validation, regression comparison, peak-event readiness, cache-miss safety, or incident reproduction.
- Scope: domains, routes, environments, user states, data fixtures, traffic shape, test window, and exclusions.
- Baseline: current performance numbers and commit/environment.
- Scenarios: cacheable page views, cache misses, search, REST, forms, editor saves, login, cron/queue, webhooks, and imports when relevant.
- Ramp: warm-up, step increases, steady-state duration, peak duration, cool-down.
- Fail thresholds: latency percentiles, error rates, cache hit rate, origin CPU/memory, DB time, slow query count, queue depth, external API failures.
- Observability: dashboards, logs, traces, request IDs, and owner watching each system.
- Backout: stop condition, rollback/feature flag, communication path, and cleanup.

## Testing Heuristics

- Test the routes users actually hit, not just the homepage.
- Include cold-cache and warm-cache behavior separately.
- Keep test data production-shaped: realistic content counts, taxonomy depth, user roles, order/form volume, media size, and multisite scale.
- Avoid synthetic requests that bypass the edge in ways real users do not.
- Run performance comparisons against the same code path, environment class, data volume, and cache state when possible.
- Confirm frontend Core Web Vitals separately; backend capacity does not prove browser performance.

## Capacity Deliverables

For enterprise clients, provide:

- Traffic assumptions and confidence level.
- Bottleneck summary by layer.
- Risk register with mitigation owner.
- Required code changes before launch.
- Required operational changes: monitoring, alerts, runbooks, on-call, support contacts.
- Go/no-go criteria and post-launch watch plan.

## Acceptance Checks

- Peak traffic model and origin traffic estimate are explicit.
- VIP/platform support requirements are satisfied before testing.
- Test scenarios cover cacheable, uncacheable, admin/editor, REST, and background work.
- Results include metrics, not just tool screenshots.
- Follow-up issues are prioritized by user/business impact and production risk.
