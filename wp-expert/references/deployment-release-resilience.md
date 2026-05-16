# Deployment And Release Resilience

Use this for enterprise releases, VIP deployment readiness, built artifacts, rollback planning, feature flags, migrations, smoke checks, cache purges, and release communication.

## Current Official Anchors

- VIP code deployment overview: https://docs.wpvip.com/code-deployment/
- VIP build and deploy: https://docs.wpvip.com/code-deployment/default-deployment/build-and-deploy/
- VIP GitHub repository deployment: https://docs.wpvip.com/code-deployment/default-deployment/deploy-with-github/
- VIP app deploy command: https://docs.wpvip.com/vip-cli/commands/app/deploy/
- GitHub Actions workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

## Release Architecture Principle

A release is not complete when code is merged. It is complete when production behavior is validated, rollback is possible, and the team can explain what changed.

Design every enterprise release around:

- Backward-compatible code and data changes.
- Built assets present in the deploying artifact/branch.
- Feature flags or kill switches for risky behavior.
- Safe migrations that are idempotent, bounded, observable, and resumable.
- Cache and search-index impact understood before deploy.
- Smoke checks that match user-facing and admin/editor critical paths.

## VIP Build And Artifact Rules

Verify current VIP docs for the target project. Stable guidance:

- Deploying branches must contain the code and assets needed at runtime.
- If no CI build flow exists, Composer/npm build output must be produced before committing/deploying the runtime artifact.
- VIP CI/CD workflows commonly build from a source branch and push built output to a `-built` branch configured for deployment.
- Avoid committing `node_modules` unless a platform-specific project explicitly requires it; use Composer/npm lockfiles and build artifacts intentionally.
- Confirm Composer autoload, dependency extraction, block assets, and generated manifests are included in the deployed artifact.

## Pre-Deploy Checklist

- Scope: PRs, commits, migration steps, feature flags, and expected user-visible changes.
- Diff risk: endpoints, DB schema, options, cron/jobs, cache keys, search index, auth, assets, templates, and redirects.
- Validation: tests, lint/static analysis, build, package artifact, activation, REST probes, admin/editor/frontend smoke.
- Data: backup/restore point, migration dry run, idempotency, batch size, resume behavior, rollback limitations.
- Operations: deploy window, owner, watcher, support contacts, dashboard links, logs, and rollback command.
- Communication: client note, editorial impact, release notes, known risks, and go/no-go criteria.

## Deployment Patterns

- Feature flag first: deploy dormant code, validate, enable for internal users, then ramp.
- Dark launch: write/read side-by-side where feasible before cutting over.
- Expand/contract migrations: add new schema/fields first, dual-write if needed, migrate data, switch reads, clean old path later.
- Kill switch: a single option/filter/env flag can disable integrations, expensive features, or new UI without code rollback.
- Cache-aware deploy: prewarm key pages, avoid broad purges during peak, and monitor origin traffic after publish/deploy.

## Post-Deploy Smoke Checks

- Frontend anonymous critical pages are cacheable and render correctly.
- Logged-in/admin/editor routes work for expected roles.
- REST routes return correct auth behavior and schemas.
- Cron/queues are scheduled, handlers load, and failures are observable.
- Search/index-dependent pages return expected results.
- Logs show no new fatals, warnings, slow-query spike, or external API failures.
- Built assets load without 404s and dependency-extraction globals resolve.

## Rollback And Backout

- Know whether rollback is code-only or also requires data rollback.
- Do not run irreversible migrations in the same deploy as risky behavior unless unavoidable and approved.
- Keep previous artifact/branch/commit identifiable.
- Document cache/search/index cleanup needed after rollback.
- After rollback, validate both the reverted behavior and the data shape left behind.
