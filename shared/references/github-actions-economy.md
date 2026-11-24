# GitHub Actions Economy

Use when designing/auditing Actions. Verify visibility and runner/storage before cost claims; unknown visibility stays unknown. Choose hosted CI for useful evidence, feedback, or controls, optimize total cost/performance, and never weaken required proof to save minutes.

Official anchors: [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [concurrency](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency), [dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching), and [workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts).

## Visibility-Aware Cost Policy

- **Private repositories:** local-first; keep hosted jobs only for required protection, untrusted contributions, supported runtime/OS, secret-backed integration, compliance, or release/package proof unavailable safely and equivalently locally. Avoid duplicate push/PR/full-suite runs. Use available budgets/alerts, but do not claim they are configured without checking.
- **Public repositories:** use standard hosted CI when it provides useful feedback or non-equivalent evidence, not only for releases. Standard hosted runners are free for public repositories; larger runners are billed, and artifact/cache storage or other limits remain relevant. Verify current plan/pricing for the exact runner/storage.
- **Unknown/changing visibility:** verify before cost estimates or visibility-based policy; use private-safe local-first meanwhile without mislabeling the repo.
- **Measure the whole workflow:** reduce duplicate starts, minutes, setup/checkout/build, matrix fan-out, retained artifact/cache volume, and reports. Savings remain estimates absent comparable before/after usage.

## Local-vs-hosted decision

Use one canonical local command for deterministic checks maintainers can reproduce. This is private-repo default, not a public-CI prohibition:

- PHP/JS/CSS/YAML syntax, lint, static analysis, unit/integration tests, and focused browser tests.
- Build, production dependency install, package/ZIP assembly, Plugin Check, SBOM/provenance generation, and metadata checks.
- Docs, changelog, schema, fixture, snapshot, and compatibility checks that do not require a hosted secret, operating system, or protected environment.

Retain hosted jobs for useful feedback or non-equivalent evidence. Document the cost rationale for private repos; public CI may also cover ordinary validation:

- Release-candidate and stable validation from a clean runner against an explicit candidate SHA/version, including the production package and release proof.
- Untrusted external contributions that need an isolated, read-only, secret-free runner.
- A documented branch-protection check, supported PHP/WordPress/OS matrix, secret-backed non-production integration, or compliance/provenance control that cannot run safely and reproducibly locally.

Do not preserve PR/feature-push workflows merely because they exist or run the same full gate on every trigger. Remove locally equivalent hosted work for private repos; retain useful public triggers without duplicate gates. Frequent polling, duplicate screenshots, and unsupported matrices waste capacity. Record private exceptions and evidence in `AGENTS.md`, `TESTING.md`, or `RELEASE.md`.

## Minimal workflow topology

1. One local fast gate and one full/package gate are the source of truth; hosted jobs invoke these scripts, not YAML-only tests. Keep fast checks changed-boundary focused; run full/package proof only at needed triggers.
2. One release workflow uses `workflow_dispatch` inputs for the exact candidate SHA and version. Validate, build, and package once in a clean runner; pass the immutable artifact to proof/publish jobs instead of rebuilding.
3. Separate beta/production publish into an environment-protected job. Validation gets `contents: read`; only the smallest final job gets write/deploy/release permissions. A tag event is not release authorization unless created through the approved gate.
4. Reuse workflows/composite actions for shared logic; avoid nested duplicate setup/gates.

## Trigger and cost controls

- Choose triggers by repository visibility and task value: private repositories default to local-first with only cost-justified hosted exceptions; public repositories may run useful `pull_request`, `push`, or `merge_group` validation. Avoid overlapping triggers that run the same gate for the same revision. Keep release dispatch/tag paths explicit and owner-gated.
- Use branch/path filters only where safe, and never make a required check disappear silently: GitHub can leave a skipped path-filtered check pending. Preserve the existing required status contract; do not change branch protection to make a check optional without the authorized owner/admin. For path-selective work, keep a stable always-on required decision/status job and route relevant changes to the full check, or run the required check on every event. Path evaluation is limited to the first 300 changed files, so large changes need an explicit fallback. If a merge queue is configured, include `merge_group` for required checks that must validate the queued merge candidate; do not add it when no queue requires it.
- Add narrowly scoped `concurrency` per workflow/ref. Cancel stale PR/development validation when a newer revision supersedes it; do not cancel release, deployment, rollback, or the run holding the only release artifact. Use `timeout-minutes` on every job and make cleanup/finalization behavior cancellation-safe.
- Keep matrices to supported combinations, use `fail-fast` when early failure is useful, cap `max-parallel` to available capacity, and do not multiply checks across versions already covered by the canonical gate. Reduce repeated checkout, dependency installation, compilation, and packaging; build once and pass the exact artifact to consumers.
- Cache only regenerable dependencies or intermediate outputs with lockfile-, runtime-, and platform-scoped keys. A cache is not a release artifact; never cache secrets or trust restored cache contents from low-trust workflows. Use restore-only behavior for untrusted triggers, and monitor cache growth/restore time so cache maintenance does not cost more than recomputation.
- Upload artifacts only for release, proof, rollback, cross-job handoff, or failed-run diagnosis. Set short `retention-days` for disposable evidence, avoid duplicate uploads, and keep artifacts no larger or longer-lived than their evidence purpose requires.
- Pin third-party actions to reviewed immutable commit SHAs (or the repository's approved policy), use least-privilege permissions, and review action changes as dependencies. Never use `pull_request_target` to execute fork code.

## Migration and evidence

Before changes, verify visibility, triggers/jobs/matrices/duration, runner, cache/artifact storage, required checks, and release permissions. Classify jobs `local`, `useful public CI`, `documented private hosted exception`, or `release-only`; remove duplicates only after proving the canonical local command and protection checks. Re-run affected gates and a dry-run/non-publishing release workflow for an explicit candidate. Report measured/estimated runtime/minute/storage, retained evidence, and proof gaps.

For WordPress plugins/themes, hosted release validation still installs the exact package, runs Plugin Check and metadata/readme checks, captures required browser/golden-workflow proof, verifies tag ancestry/package parity, and performs WordPress.org/SVN or deploy steps only in the owner-gated release job. Cost cuts never skip security, performance, accessibility, compatibility, or rollback proof.
