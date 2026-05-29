# VIP Enterprise Launch Readiness

Use this for go/no-go reviews before enterprise, VIP, high-traffic, migration, release, campaign, conversion, or critical WordPress launches.

Use alongside `vip-scale-playbook.md`, `deployment-release-resilience.md`, `observability-incident-response.md`, `load-testing-capacity-planning.md`, `edge-caching-cdn-architecture.md`, `security-operations-compliance.md`, and `enterprise-acceptance-criteria-templates.md`.

## Launch Readiness Mindset

A launch is ready when the team can prove the code, data, cache, search, redirects, observability, rollback, and support plan can survive the expected production conditions. A passing local smoke test is not enough for enterprise/VIP work.

## Go/No-Go Matrix

| Area | Ready signal | No-go signal |
| --- | --- | --- |
| Code | CI/lint/tests pass for changed surfaces | unreviewed high-risk code or missing build artifacts |
| Data | migration dry run, backup, resume/rollback plan | destructive migration with no restore path |
| Cache/CDN | cacheability and purge paths proven | public pages personalized or global purge-only strategy |
| Search/SEO | redirects, canonicals, sitemaps, schema checked | URL changes without redirect/indexing plan |
| Performance | hot paths measured or budgeted | unbounded queries, remote calls on render, unknown origin load |
| Security/privacy | secrets/PII reviewed, consent respected | exposed secrets, missing capabilities, telemetry without consent |
| Observability | logs, metrics, queue status, alerts, runbook | no way to detect or triage failure |
| Rollback | code/data/cache rollback documented | migration cannot be reversed or paused |
| Support | owner, window, escalation, comms ready | launch with no support coverage |

## Pre-Launch Checklist

- Branch, release target, and PR base are correct.
- Build artifacts, Composer vendor policy, generated assets, translations, and release package contents are verified.
- Feature flags and kill switches exist for risky integrations.
- Migrations are bounded, resumable, logged, and tested on realistic data volume.
- Backups are fresh and restore path is known.
- Cache invalidation and CDN purge strategy are documented and tested.
- Search indexes, sitemaps, redirects, canonicals, robots, and structured data are checked when URLs/content change.
- Background jobs have queue depth, retry, lock, and failure visibility.
- Third-party API timeouts, retries, circuit breakers, quotas, and fallback behavior are reviewed.
- Accessibility, i18n/RTL, and mobile checks cover changed user journeys.
- Analytics and conversion events are consent-aware and verified.

## Launch Window

During launch:

- Freeze risky editorial/config changes when needed.
- Deploy in the planned order: code, config, migrations, cache/search warmup, traffic cutover.
- Monitor error rate, response time, DB load, object-cache behavior, queue depth, search health, conversion events, and support reports.
- Keep rollback commands and owners visible.
- Avoid stacking unrelated fixes into the launch window.

## Post-Launch

- Verify production URLs, admin/editor workflows, forms/checkout, redirects, sitemaps, tracking, queues, and critical integrations.
- Compare metrics against baseline and launch budgets.
- Keep heightened monitoring until traffic and queues stabilize.
- Record follow-up issues separately from launch blockers.
- Remove temporary feature flags, debug logging, and launch-only bypasses when safe.

## Output Format

```text
Launch scope:
Readiness status:
Go blockers:
Risks accepted:
Validation evidence:
Rollback/backout:
Owners and monitoring:
Post-launch checks:
```
