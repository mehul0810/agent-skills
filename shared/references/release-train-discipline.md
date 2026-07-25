# Release Train Discipline

Use this reference before beta, prerelease, stable, deploy, version, tag, WordPress.org, milestone, release-branch, or post-release closure decisions.

## Production Gate

Do not create a next milestone prerelease before the previous production release. Milestone closure is not release proof.

`main` is production release space only. It receives release branches only after owner approval/testing. Milestone release work must target `release/<release-version>`, never the GitHub milestone ID; `develop` is unmilestoned integration or verified branch source.

## Main-First Production Release Transaction

A stable release is one transaction. Approval names the exact release PR/candidate SHA and production merge, tag, release, and publish/deploy actions; it does not transfer to another SHA. Never publish before syncing `main`. Beta requires approval for the exact version and candidate SHA, stays on `release/<version>`, and never advances `main`.

1. Live-fetch main/release refs, releases/tags/PRs/checks; pin approved PR/SHA.
2. After approval, merge the approved release PR into `main` before creating the stable tag or GitHub release. Fetch the production SHA, prove it on `origin/main`, and verify metadata.
3. Revalidate the artifact from that SHA when merge, generated output, or metadata can differ.
4. Tag the production SHA, then run `gh release create <tag> --verify-tag`. Do not use `--target release/*`; select the existing tag in GitHub UI.
5. Prove the tag equals the approved SHA, is an ancestor of `origin/main`, and matches package metadata; `targetCommitish` is not proof.
6. Forward-sync production-only metadata/hotfixes from `main` into `develop` or the next train when present; verify remaining divergence.

Any failed step stops publish, closure, and the next prerelease.

### Recovery: Production Mainline Reconciliation

For an already-published off-main release, freeze releases, verify the tag, and open an owner-approved PR from a narrow branch at that tag into `main`. Use fast-forward/merge; squash, rebase, or cherry-pick recovery does not satisfy tag ancestry. Never move the tag. Prove ancestry, artifact parity, and forward-sync; meanwhile report `mainline sync missing`.

## Release Automation Contract

POs audit workflows and `RELEASE.md`. Production automation resolves the approved SHA from full history, requires it on `origin/main` with valid metadata/package, pushes the exact tag, releases with `--verify-tag`, and repeats ancestry/artifact checks. Never tag production from `release/*`. Use `wp-product-orchestrator/scripts/release-mainline-audit.sh <tag-or-sha> [main-ref] [expected-sha]`; issue-track missing enforcement.

### Hosted Automation Economy

Default to canonical local validation. Reserve Actions for release transactions using the same scripts and exact package, plus documented non-equivalent evidence such as untrusted contributions, required matrices/protections, secret-backed integration, or compliance. Avoid duplicate PR/push jobs; economy never justifies skipped proof.

## Required Release Checks

Before release action, verify:

- Latest production/prerelease, target/previous train state.
- Current authorization and owner testing confirmation.
- For WordPress.org, `Tested up to` matches the live-verified release target.
- Confirm release metadata matches the target version: plugin header/version file, package metadata, release notes, and `readme.txt`.
- `readme.txt` and changelog/release notes are release-current: version/stable tag, `Tested up to`, Requires WP/PHP, changelog, upgrade notice when applicable, features/docs/assets, and no overclaiming unmerged future milestone work.
- Current package/readme/Plugin Check and compact quality gate matrix.
- Changed UI has release-candidate visual proof from the packaged ZIP/build; the golden workflow regression matrix passed against that candidate.

Release-ready recommendations and owner approval requests require fresh live verification. If release/GitHub/CI/package/WordPress.org state is unavailable, report `live check unavailable`, missing signal, and fallback evidence; do not request beta/production approval.

## Active Release Train Execution

A train is quiet only when scoped work is merged, owner-gated, failing, draft, wrong-base, blocked, or deferred. Action clean PRs or escalate repeated executable work.

The due date is release exit. At T-1, require implementation on `release/<version>`, freeze scope, and allow proof fixes only. One issue/branch/worktree/PR; parallel scope cannot overlap. User-visible work needs packaged browser proof and fresh source-blind `$behavior-validator`.

## Milestone Discipline

Milestones need due dates from train evidence; ask if ambiguous. A missing due date alone is not an implementation blocker.

Create/use `release/<release-version>` from the verified base: use the version, not the GitHub milestone ID or sequence number. Non-version titles require repo evidence or a decision brief. Do not retarget/change dates without evidence.

If a wrong milestone-ID branch exists, replay/reconcile its commits into `release/<release-version>`, retarget PRs, and preserve it until deletion is approved.

## Release Stop Conditions

Stop release creation for unresolved production/previous train, stale metadata/docs/CI/package/Plugin Check, unavailable credentials, or absent authorization. Stable also needs an approved main-first plan.

Package/readme/Plugin Check validation is not current when any release metadata changed after its last run.

If metadata/readme/changelog is stale, create a focused release-readiness issue/PR against the active `release/<version>` branch, rerun package/readme/Plugin Check, and regenerate the brief. Otherwise include explicit readme/changelog audit evidence.

Normal product orchestration, issue intake, implementation, hardening PRs, branch creation, good non-production PR review/merge, tooling/docs/validation need no release approval when they avoid release/tag/deploy claims.

## Release Quality Gate Matrix

Every brief has a compact quality gate matrix: one-line passes, expanded risks, `Not applicable - reason`.

Before counting a PR, require `enterprise-code-quality-gate.md` or record exception/residual risk.

- Security/privacy: capabilities, nonces/auth, sanitization/escaping, secrets/data, dependencies, no exploit detail.
- Performance: admin/frontend load, queries, assets/enqueues, footprint, cache/async, regression risk.
- Modularity/architecture/maintainability: boundaries, coupling, contracts, migration/rollback, clarity, comments, duplication.
- Test coverage: applicable unit/integration/e2e/browser, release CI, packaged candidate, golden workflows.
- Documentation/release notes: `readme.txt`, changelog/upgrade notice, docs/assets, WordPress.org metadata/`Tested up to`, no future claims.
- Commented-code/dead-code hygiene: disabled/debug code, stale TODOs, unused paths, and dead shims.
- Compatibility and runtime assurance: launched contracts, supported runtime/editor/integration cells, dependency/license/vulnerability evidence, and elevated SBOM/provenance/operations proof when triggered.
- Packaging/version: headers, metadata, runtime-only dependencies, ZIP contents, alignment.
- UI/browser: packaged screenshots/Playwright at relevant widths; design audit for material workflow changes.

When the train is release-ready, request exact approval with merged/open work, compact quality gate matrix, CI/package validation, package/build used, exact environment, visual proof status, golden workflow regression status, docs/public state, risk/rollback, and accepted gaps.

## Post-Release Verification

After release/deploy/publish, keep the train open until a compact check proves:

- Approved commit, tag/release, and package/artifact align.
- For production, the exact release tag is an ancestor of `origin/main`, main metadata matches, and prerelease tags did not advance `main`.
- Public version/docs/assets/`Tested up to` signals are current.
- Installed-package golden workflow passes or accepted gap.
- The defined post-release observation window, signals, thresholds, owner, and rollback trigger are checked when runtime assurance requires them.
- Reconcile issues as `Fixed now`, `Implemented-proof-gap`, `Deferred`, or `Blocked`; manually close only accepted work.
- Next train/temporary automation are reconciled; merged worktrees are removed or retained with reason/review trigger.

Failed proof stops closure and routes recovery/decision.

A distinct post-release regression gets a new linked issue; do not reopen a completed issue merely because a different bug appeared. Use `Fixes` or `Closes` only when a PR fully resolves the issue; partial work uses `Related`.

## Production Regression Escalation

A P0 or production regression pauses normal flow and requires an explicit hotfix/release decision. The CTO brief gives a recommendation, options, risk, and decision deadline. Escalate immediately at T-1; otherwise escalate when no owner response arrives within four working hours. Investigation, proof, and reversible candidate preparation may continue, but production merge/tag/release remains owner-approved.
