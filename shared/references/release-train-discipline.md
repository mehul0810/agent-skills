# Release Train Discipline

Use before beta/prerelease/stable, deploy/version/tag, WordPress.org, milestone/branch, or post-release decisions.

## Production Gate

Do not prerelease a later milestone before the previous production release; milestone closure is not release proof.

The production branch, normally `main` and sometimes documented `master`, is stable release authority only after owner approval/testing. Milestone work targets `release/<release-version>`, never the GitHub milestone ID; `develop` is unmilestoned integration or verified branch source.

## Main-First Production Release Transaction

A stable transaction is issue branch -> `release/<version>` -> PR to verified `main`/`master` -> required CI/exact owner approval -> merge -> tag/package/publish from production SHA. The release branch is integration, never stable authority without an owner-approved documented exception and recovery. Approval is SHA-specific. Beta requires exact version/SHA approval, stays on `release/<version>`, and never advances production.

1. Live-fetch main/release refs, releases/tags/PRs/checks; pin approved PR/SHA.
2. After approval, merge the approved release PR before creating the stable tag/release; prove production SHA on `origin/main` and verify metadata.
3. Revalidate the artifact from that SHA when merge/generated output/metadata can differ.
4. Tag production SHA; run `gh release create <tag> --verify-tag`. Do not use `--target release/*`; select the existing tag in GitHub UI.
5. Prove tag equality/production ancestry and matching tag-derived package; `targetCommitish` is not proof.
6. Forward-sync production-only metadata/hotfixes from `main` to `develop`/next train when present; verify divergence.

Any failed step stops publish, closure, prerelease.

### Recovery: Production Mainline Reconciliation

For an off-main release, freeze releases, verify the tag, and open owner-approved tag-to-`main` PR. Use fast-forward/merge; squash/rebase/cherry-pick does not satisfy tag ancestry. Never move the tag. Prove ancestry, artifact parity, and forward-sync; report `mainline sync missing` meanwhile.

## Release Automation Contract

POs audit workflows/`RELEASE.md`. Automation resolves approved SHA from full history, requires production-branch membership and valid metadata/package, pushes exact tag, releases with `--verify-tag`, then repeats ancestry/artifact checks. Never tag from `release/*`. Run `wp-product-orchestrator/scripts/release-mainline-audit.sh <tag-or-sha> [production-ref] [expected-sha]`; issue-track missing enforcement.

### Hosted Automation Economy

For private repositories, prefer local deterministic checks; retain hosted work only for required or non-equivalent evidence. Public repositories may use useful standard-runner CI, but larger runners/storage still have cost/limits. Follow `github-actions-economy.md` for CI topology/performance. Validate the exact candidate/package and keep publish owner-gated; cost reduction never justifies skipped proof.

## Required Release Checks

Before release, verify:

- Latest production/prerelease, target/previous train state.
- Current release authorization, plus product acceptance evidence only where the product's acceptance contract requires it. Keep technical readiness, contract-required acceptance, authorization, and fresh live verification distinct; one pass proves none of the others.
- For WordPress.org, set `Tested up to` only with a receipt tying the exact release candidate SHA/package to the patched WordPress runtime and matrix. A live-verified latest version alone is not candidate proof.
- Confirm release metadata matches the target version: plugin header/version file, package metadata, release notes, and `readme.txt`.
- `readme.txt` and changelog/release notes are release-current: version/tag, `Tested up to`, Requires WP/PHP, changelog, upgrade notice when applicable, features/docs/assets, no overclaiming unmerged future milestone work.
- Current package/readme/Plugin Check and compact quality gate matrix.
- Changed UI has release-candidate visual proof from the packaged ZIP/build; the golden workflow regression matrix passed against that candidate.

Release-ready recommendations and owner approval requests require fresh live verification. If release/GitHub/CI/package/WordPress.org state is unavailable, report `live check unavailable`, missing signal, fallback evidence; do not request beta/production approval.

## Active Release Train Execution

A train is quiet only when no safe executable scoped item remains. Repair/route safe in-scope failing, draft, or wrong-base work. For each remaining item, record disposition (merged, deferred, genuine owner gate, verified blocker), accountable owner, and next action/review trigger. Escalate repeated executable work; do not label it quiet.

Due date is release exit. At T-1, require implementation on `release/<version>`, freeze scope, allow proof fixes only. One issue/branch/worktree/PR; parallel scopes cannot overlap. User-visible work needs packaged browser proof and fresh source-blind `$behavior-validator`. For plugin-only milestone/changelog/candidate choreography, read `plugin-release-workflow.md`.

## Milestone Discipline

Milestones need due dates from train evidence; ask if ambiguous. A missing due date alone is not an implementation blocker.

Milestone release work must target `release/<release-version>` from verified base, not the GitHub milestone ID or sequence number. Create missing branches and PRs there. Non-version titles need evidence/brief; retarget dates only with evidence.

For wrong milestone-ID branches, replay/reconcile commits into `release/<release-version>`, retarget PRs, and preserve the branch until deletion approval.

## Release Stop Conditions

Stop release creation for unresolved production/previous train, stale metadata/docs/CI/package/Plugin Check, unavailable credentials, or missing authorization; stable also needs approved main-first plan.

Package/readme/Plugin Check validation is not current if release metadata changed after the run.

Release-readiness is execution, not report-only: fix safe authorized gaps on active `release/<version>`, open/update correctly based PR, rerun affected checks, regenerate brief. If metadata/readme/changelog is stale, create a focused release-readiness issue/PR against the active `release/<version>` branch; rerun package/readme/Plugin Check. Otherwise include explicit readme/changelog audit evidence. Protected-branch, release, tag, and deploy remain owner-gated.

Issue intake, implementation, hardening PRs, branch creation, unprotected non-production merges, tooling/docs, and validation need no release approval; protected-branch, release, tag, deploy do.

## Release Quality Gate Matrix

Brief matrix: one-line passes, expanded risks, `Not applicable - reason`.

For release readiness, `$wp-quality-reviewer` owns technical matrix evidence/dispositions using compact multi-domain mode; PO verifies candidate identity and synthesizes product, milestone, package, and approval state. The PO must not infer a technical pass from worker summaries or green CI alone. Use detailed review only for confirmed risk.

Before counting a PR, require `enterprise-code-quality-gate.md` or record exception/residual risk. Critical fixes need fresh source-aware review; use separate source-blind `$behavior-validator` for observable claims.

- Security/privacy: capabilities, nonces/auth, sanitization/escaping, secrets/data, dependencies; no exploit detail.
- Performance: admin/frontend load, queries, assets/enqueues, footprint, cache/async, regressions.
- Modularity/architecture/maintainability: boundaries, coupling, contracts, migration/rollback, clarity, comments, duplication.
- Test coverage: applicable unit/integration/e2e/browser, release CI, packaged candidate, golden workflows.
- Documentation/release notes: `readme.txt`, changelog/upgrade notice, docs/assets, WordPress.org metadata/`Tested up to`, no future claims.
- Commented-code/dead-code hygiene: disabled/debug code, stale TODOs, unused paths, and dead shims.
- Compatibility/runtime assurance: launched contracts, supported runtime/editor/integration, dependency/license/vulnerability evidence, and triggered SBOM/provenance/operations proof.
- Packaging/version: headers, metadata, runtime-only dependencies, ZIP contents, alignment.
- UI/browser: packaged screenshots/Playwright at relevant widths; design audit for material workflow changes.

When the train is release-ready, request exact approval with merged/open work, quality matrix, CI/package validation, package/build used, exact environment, visual proof status, golden-workflow proof, docs/public state, risk/rollback, and accepted gaps.

## Post-Release Verification

After release/deploy/publish, keep the train open until checks prove:

- Approved commit, production SHA, tag/release, and tag-derived package/artifact align.
- For production, the exact release tag is an ancestor of the verified `origin/main` or `origin/master`, production metadata matches, and prerelease tags did not advance the production branch.
- Release-branch lifecycle is explicit: retain for supported maintenance with owner/review trigger, or propose cleanup separately without destructive action.
- Public version/docs/assets/`Tested up to` signals are current.
- Installed-package golden workflow passes or has accepted gap.
- Where required, verify post-release observation window, signals, thresholds, owner, rollback trigger.
- Reconcile issues as `Fixed now`, `Implemented-proof-gap`, `Deferred`, or `Blocked`; manually close only accepted work.
- Reconcile next train/temporary automation; remove merged worktrees or retain with reason/review trigger.

Failed proof stops closure and routes recovery/decision.

A distinct post-release regression gets a new linked issue, not a reopened issue. `Fixes`/`Closes` mean full resolution; partial work uses `Related`.

## Production Regression Escalation

P0/production regression pauses normal flow for explicit hotfix/release decision; CTO brief gives recommendation, options, risk, deadline. Escalate at T-1 or after four working hours without response. Investigation/proof/reversible candidate prep may continue; production merge/tag/release remains owner-approved.
