# GitHub Actions Economy

Use this reference when designing or auditing GitHub Actions. Verify repository visibility and runner/storage types before making a cost claim; if visibility is unknown, treat it as unknown rather than assuming public-repo pricing. GitHub-hosted CI may be useful for any task, but choose it for evidence, feedback, or a required control that justifies its total cost and optimize it for performance. Do not weaken required proof to save minutes.

Official anchors: [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [concurrency](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency), [dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching), and [workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts).

## Visibility-Aware Cost Policy

- **Private repositories:** local-first by default because standard hosted-runner minutes, artifact storage, and cache storage can consume plan allowances or incur charges. Keep hosted jobs only for required branch-protection checks, untrusted contributions, supported runtime/OS evidence, secret-backed integration, compliance, or release/package proof that local execution cannot safely and equivalently provide. Avoid duplicate push/PR/full-suite runs. Where available, use account/repository budgets and usage alerts as guardrails; do not imply those settings are configured without checking.
- **Public repositories:** use standard GitHub-hosted CI for any task when it provides useful feedback or non-equivalent evidence; do not artificially restrict CI to release-only work. Optimize anyway: standard hosted runners are free for public repositories, but larger runners are billed, and artifact/cache storage or other limits remain relevant. Verify current plan/pricing for the exact runner and storage path.
- **Unknown or changing visibility:** verify visibility before estimating cost or designing a policy that depends on public-runner treatment. Prefer the private-safe local-first shape until verified, without mislabeling the repository.
- **Measure the whole workflow:** reduce redundant starts, runner minutes, setup/checkout/build work, matrix fan-out, retained artifact/cache volume, and noisy duplicate reports. State expected savings as an estimate unless comparable before/after usage is measured.

## Local-vs-hosted decision

Run locally, through one canonical repository command, when the check is deterministic and the worker/maintainer can reproduce it. This is the default for private repositories, not a blanket prohibition on public CI:

- PHP/JS/CSS/YAML syntax, lint, static analysis, unit/integration tests, and focused browser tests.
- Build, production dependency install, package/ZIP assembly, Plugin Check, SBOM/provenance generation, and metadata checks.
- Docs, changelog, schema, fixture, snapshot, and compatibility checks that do not require a hosted secret, operating system, or protected environment.

Retain hosted jobs when they provide useful feedback or non-equivalent evidence. For private repositories, require a documented reason that justifies the cost; for public repositories, CI may cover ordinary validation as well as these cases:

- Release-candidate and stable validation from a clean runner against an explicit candidate SHA/version, including the production package and release proof.
- Untrusted external contributions that need an isolated, read-only, secret-free runner.
- A documented branch-protection check, supported PHP/WordPress/OS matrix, secret-backed non-production integration, or compliance/provenance control that cannot run safely and reproducibly locally.

Do not retain PR and feature-push workflows merely because they already exist, or run the same full gate on every trigger. For private repositories, remove equivalent hosted work where local proof is sufficient; for public repositories, retain the useful trigger but still avoid duplicate full gates. Frequent scheduled polling, duplicate browser screenshots, and broad matrices without a supported combination are performance/capacity defects. Record private-repo exceptions and the evidence they provide in `AGENTS.md`, `TESTING.md`, or `RELEASE.md`.

## Minimal workflow topology

1. One local fast gate and one local full/package gate are the source of truth. Hosted jobs invoke those same scripts; they do not maintain a second YAML-only test implementation. Keep the fast gate short and changed-boundary focused, then run full/package proof at the trigger that needs it.
2. Use one release workflow with `workflow_dispatch` inputs for the exact candidate SHA and version. Validate, build, and package once in a clean runner; pass the immutable artifact to later proof/publish jobs instead of checking out and rebuilding repeatedly.
3. Keep beta/production publish in a separate environment-protected job. Give validation `contents: read`; grant write, deploy, or release permissions only to the smallest final job. A tag event is not release authorization unless the exact tag was created through the approved gate.
4. Use reusable workflows or composite actions for genuinely shared logic, but avoid nested fan-out that runs the same setup and gate more than once.

## Trigger and cost controls

- Choose triggers by repository visibility and task value: private repositories default to local-first with only cost-justified hosted exceptions; public repositories may run useful `pull_request`, `push`, or `merge_group` validation. Avoid overlapping triggers that run the same gate for the same revision. Keep release dispatch/tag paths explicit and owner-gated.
- Use branch/path filters only where safe, and never make a required check disappear silently: GitHub can leave a skipped path-filtered check pending. Preserve the existing required status contract; do not change branch protection to make a check optional without the authorized owner/admin. For path-selective work, keep a stable always-on required decision/status job and route relevant changes to the full check, or run the required check on every event. Path evaluation is limited to the first 300 changed files, so large changes need an explicit fallback. If a merge queue is configured, include `merge_group` for required checks that must validate the queued merge candidate; do not add it when no queue requires it.
- Add narrowly scoped `concurrency` per workflow/ref. Cancel stale PR/development validation when a newer revision supersedes it; do not cancel release, deployment, rollback, or the run holding the only release artifact. Use `timeout-minutes` on every job and make cleanup/finalization behavior cancellation-safe.
- Keep matrices to supported combinations, use `fail-fast` when early failure is useful, cap `max-parallel` to available capacity, and do not multiply checks across versions already covered by the canonical gate. Reduce repeated checkout, dependency installation, compilation, and packaging; build once and pass the exact artifact to consumers.
- Cache only regenerable dependencies or intermediate outputs with lockfile-, runtime-, and platform-scoped keys. A cache is not a release artifact; never cache secrets or trust restored cache contents from low-trust workflows. Use restore-only behavior for untrusted triggers, and monitor cache growth/restore time so cache maintenance does not cost more than recomputation.
- Upload artifacts only for release, proof, rollback, cross-job handoff, or failed-run diagnosis. Set short `retention-days` for disposable evidence, avoid duplicate uploads, and keep artifacts no larger or longer-lived than their evidence purpose requires.
- Pin third-party actions to reviewed immutable commit SHAs (or the repository's approved policy), use least-privilege permissions, and review action changes as dependencies. Never use `pull_request_target` to execute fork code.

## Migration and evidence

Before changing workflows, verify visibility and inventory triggers, jobs, matrices, duration, runner type, cache/artifact storage, required checks, and release permissions. Classify each job as `local`, `useful public CI`, `documented private hosted exception`, or `release-only`; remove duplicate hosted jobs only after the canonical local command and any required protection check are proven. Re-run affected local gates, then a dry-run or non-publishing release workflow with an explicit candidate. Report measured or estimated runtime/minute/storage changes, retained evidence, and any proof gap.

For WordPress plugins/themes, hosted release validation must still install the exact package, run Plugin Check and metadata/readme checks, capture required browser/golden-workflow proof, verify tag ancestry and package parity, and perform WordPress.org/SVN or deploy steps only in the owner-gated release job. Cost reduction never permits skipped security, performance, accessibility, compatibility, or rollback proof.
