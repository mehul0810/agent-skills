# GitHub Actions Economy

Use this reference when designing or auditing GitHub Actions for a WordPress product. Default to local validation; keep hosted work for evidence that cannot be obtained locally or for an owner-authorized release transaction. Even when a repository has free minutes, unnecessary runners, cache entries, artifacts, and notifications consume capacity and obscure failures.

Official anchors: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [concurrency](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency), [dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching), and [workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts).

## Local-vs-hosted decision

Run locally, through one canonical repository command, when the check is deterministic and the worker/maintainer can reproduce it:

- PHP/JS/CSS/YAML syntax, lint, static analysis, unit/integration tests, and focused browser tests.
- Build, production dependency install, package/ZIP assembly, Plugin Check, SBOM/provenance generation, and metadata checks.
- Docs, changelog, schema, fixture, snapshot, and compatibility checks that do not require a hosted secret, operating system, or protected environment.

Retain a hosted job only for non-equivalent evidence:

- Release-candidate and stable validation from a clean runner against an explicit candidate SHA/version, including the production package and release proof.
- Untrusted external contributions that need an isolated, read-only, secret-free runner.
- A documented branch-protection check, supported PHP/WordPress/OS matrix, secret-backed non-production integration, or compliance/provenance control that cannot run safely and reproducibly locally.

Do not retain PR and feature-push workflows merely because they already exist, or run the same full gate on every trigger. Frequent scheduled polling, duplicate browser screenshots, and broad matrices without a supported combination are hosted-cost defects. Record the exception and its non-equivalent evidence in `AGENTS.md`, `TESTING.md`, or `RELEASE.md`.

## Minimal workflow topology

1. One local fast gate and one local full/package gate are the source of truth. Hosted jobs invoke those same scripts; they do not maintain a second YAML-only test implementation.
2. Use one release workflow with `workflow_dispatch` inputs for the exact candidate SHA and version. Validate, build, and package once in a clean runner; pass the immutable artifact to later proof/publish jobs instead of checking out and rebuilding repeatedly.
3. Keep beta/production publish in a separate environment-protected job. Give validation `contents: read`; grant write, deploy, or release permissions only to the smallest final job. A tag event is not release authorization unless the exact tag was created through the approved gate.
4. Use reusable workflows or composite actions for genuinely shared logic, but avoid nested fan-out that runs the same setup and gate more than once.

## Trigger and cost controls

- Prefer release-only `workflow_dispatch` plus an explicitly verified tag/release path. Add `pull_request`, `push`, or `merge_group` only for documented non-equivalent evidence.
- Use branch/path filters for optional checks, but never make a required check disappear silently: GitHub leaves a skipped path-filtered check pending. For required protection, keep a small always-on decision job or make the filtered job non-required. Path evaluation is limited to the first 300 changed files, so large changes need an explicit fallback.
- Add `concurrency` per workflow and branch. Cancel stale development/PR runs; never cancel an active beta/production publication or a run that owns the only release artifact. Use `timeout-minutes` on every job.
- Keep matrices to supported combinations, set `fail-fast` and a justified `max-parallel`, and do not multiply a check across versions when the local gate already covers it. Prefer one setup/checkout/build job followed by artifact consumers.
- Cache only regenerable dependencies or intermediate outputs with lockfile- and runtime-scoped keys. A cache is not a release artifact; never cache secrets or trust restored cache contents from low-trust workflows. Use restore-only behavior for untrusted triggers.
- Upload artifacts only for release, proof, rollback, cross-job handoff, or failed-run diagnosis. Set short `retention-days` for disposable evidence and avoid uploading duplicate logs on success.
- Pin third-party actions to reviewed immutable commit SHAs (or the repository's approved policy), use least-privilege permissions, and review action changes as dependencies. Never use `pull_request_target` to execute fork code.

## Migration and evidence

Before changing workflows, inventory triggers, jobs, matrices, average duration, cache/artifact storage, required checks, and release permissions. Classify each job as `local`, `hosted exception`, or `release-only`; remove duplicate hosted jobs only after the canonical local command and any required protection check are proven. Re-run the local full gate, then a dry-run or non-publishing release workflow with an explicit candidate. Report expected minute/storage reduction, retained evidence, and any proof gap.

For WordPress plugins/themes, hosted release validation must still install the exact package, run Plugin Check and metadata/readme checks, capture required browser/golden-workflow proof, verify tag ancestry and package parity, and perform WordPress.org/SVN or deploy steps only in the owner-gated release job. Cost reduction never permits skipped security, performance, accessibility, compatibility, or rollback proof.
