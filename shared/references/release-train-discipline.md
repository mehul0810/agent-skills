# Release Train Discipline

Use this reference before beta, prerelease, stable, deploy, version, tag, WordPress.org, milestone, release-branch, or post-release closure decisions.

## Production Gate

Do not create a next milestone prerelease until the previous milestone has a production release; fold new work into the current train or queue it later. Milestone closure alone is not release proof.

`main` is production release space only. Release branches merge to it only after explicit owner approval and testing. Milestone release work must target `release/<release-version>`: the version string, never the GitHub milestone ID; `develop` is only unmilestoned integration or a verified release-branch source.

## Main-First Production Release Transaction

A stable production release is one transaction. Request approval naming the exact release PR/candidate SHA and production merge, tag, GitHub release, and publish/deploy actions; approval for one SHA does not authorize another. Never publish first and sync `main` later. Beta/prerelease tags stay on the active release train and must not advance `main`.

For beta, require current approval for the exact version and candidate SHA. Prepare and prove the candidate autonomously on `release/<version>`; neither beta tags nor beta releases advance `main`.

1. Live-fetch `origin/main`, `release/<version>`, releases, tags, PRs, and checks; pin the approved PR and candidate SHA.
2. After approval, merge the approved release PR into `main` before creating the stable tag or GitHub release. Fetch, record the production SHA, prove it reachable from `origin/main`, and verify target-version metadata there.
3. Build or revalidate the artifact from that SHA when merge, generated output, or metadata can differ.
4. Create and push the tag at the production SHA, then run `gh release create <tag> --verify-tag`. Do not use `--target release/*`; in GitHub UI select the existing tag.
5. After publish, prove the actual tag commit equals the approved SHA, is an ancestor of `origin/main`, and matches package metadata. `targetCommitish` is not tag proof.
6. Forward-sync production-only metadata/hotfixes from `main` into `develop` or the next train when present; verify remaining divergence.

Any failed step stops the transaction. Do not publish, close the train, or start another prerelease from a known mismatch.

### Recovery: Production Mainline Reconciliation

For an already-published off-main release, freeze further releases, verify the tag commit, and create a narrow branch at that tag for an owner-approved PR into `main`. Use a fast-forward or merge commit; squash, rebase, or cherry-pick recovery does not satisfy tag ancestry. Never move the public tag. Prove tag ancestry, version/artifact parity, and forward-sync; until then report `mainline sync missing` and keep the train open.

## Release Automation Contract

POs audit `.github/workflows` and `RELEASE.md`. Production automation uses full history; resolves the approved SHA; requires it on `origin/main` with valid metadata/package; pushes the exact tag; releases with `--verify-tag`; and repeats ancestry/artifact checks. Never auto-create a production tag from `release/*`. Use `wp-product-orchestrator/scripts/release-mainline-audit.sh <tag-or-sha> [main-ref] [expected-sha]`. Missing enforcement becomes a focused issue before release.

### Hosted Automation Economy

Default owner-managed development to canonical local validation. Reserve GitHub Actions for beta/prerelease/stable release transactions that call the same repo scripts, validate the exact package, and gate publishing separately.

Avoid duplicate PR/feature-push jobs. Keep hosted development CI only for documented non-equivalent evidence: untrusted contributions, required matrices/protections, secret-backed integration, or compliance. POs issue-track changes; saving Actions minutes never justifies skipping proof.

## Required Release Checks

Before beta, prerelease, or stable action, verify:

- Latest production/prerelease, target train, and previous milestone production state.
- Current owner authorization and owner testing confirmation for production readiness.
- For WordPress.org, `Tested up to` matches the live-verified release target.
- Confirm release metadata matches the target version: plugin header/version file, `readme.txt` stable tag/changelog, package metadata, and release notes.
- `readme.txt` and changelog/release notes are release-current: version, `Tested up to`, Requires WP/PHP, changelog, upgrade notice when applicable, feature/docs/assets metadata, and no overclaiming unmerged future milestone work.
- Package/readme/Plugin Check validation and the compact quality gate matrix are current.
- Changed UI has release-candidate visual proof from the packaged ZIP/build; the golden workflow regression matrix passed against that candidate.

Apply the source hierarchy in `cto-orchestration-operating-model.md`; live releases/tags and GitHub state outrank repo/local/chat evidence.

Release-ready recommendations and owner approval requests require fresh live verification. If GitHub releases/tags, milestones, issues, PRs, labels/comments, CI, package state, or WordPress.org state cannot be verified live, stop with `live check unavailable` plus the exact missing signal and fallback evidence; do not request beta/production approval.

## Active Release Train Execution

An active train is quiet only when every scoped item is merged, owner-gated, failing, draft, wrong-base, blocked, or deferred. Action clean non-production PRs or state the concrete blocker; repeated executable work escalates to portfolio CTO.

Treat the milestone due date as the release exit date. At T-1, require all implementation on `release/<version>`, freeze scope, and allow only fixes needed to clear release proof. One issue maps to one branch, worktree, and PR; parallel workers need non-overlapping scope. User-visible work requires packaged browser proof plus a fresh, source-blind `$behavior-validator` pass.

## Milestone Discipline

Milestones need due dates: derive them from train/sequence evidence, ask if ambiguous, and do not treat the missing due date alone as an implementation blocker.

For milestone work, create/use `release/<release-version>` from the verified base; use the version string, not the GitHub milestone ID or sequence number. For non-version titles, use repo evidence or a decision brief. Do not retarget/change dates without evidence.

If a wrong milestone-ID branch exists, replay/reconcile its commits into `release/<release-version>`, retarget PRs, and preserve it until deletion is approved.

## Release Stop Conditions

Stop before release/prerelease creation when production state or the previous train is unresolved; metadata, readme/changelog, CI, package, or Plugin Check is stale; required credentials are unavailable; or current owner authorization is absent. For stable production, also stop unless the approved main-first merge/tag plan is explicit.

Package/readme/Plugin Check validation is not current when any release metadata changed after its last run.

If metadata/readme/changelog is stale, create a focused release-readiness issue/PR against the active `release/<version>` branch, rerun package/readme/Plugin Check, then regenerate the brief. If current, include explicit readme/changelog audit evidence.

Normal product orchestration, issue intake, implementation, hardening PRs, branch creation for milestone work, good non-production PR review/merge, dependency/tooling work, docs work, and validation do not require explicit release approval when they avoid production/beta releases, tags, deploys, and public release approval claims.

## Release Quality Gate Matrix

Every release-ready brief includes a compact quality gate matrix. Keep passes to one line, expand failures/risks, and use `Not applicable - reason` rather than omit a gate.

Before a worker PR is treated as merge-ready or counted in release-ready evidence, confirm the implementation also satisfies `enterprise-code-quality-gate.md` or state the exact exception and residual risk.

- Security/privacy: capabilities, nonces/auth, sanitization/escaping, secrets/data, dependency signals, and no public exploit detail.
- Performance: admin/frontend load, queries, assets/enqueues, footprint, cache/async behavior, and regression risk.
- Modularity/architecture: boundaries, coupling, public contracts, migration, and rollback.
- Maintainability: clarity, useful comments, duplication, and team supportability.
- Test coverage: relevant unit/integration/e2e/browser, release CI, packaged candidate, and golden workflows.
- Documentation/release notes: `readme.txt`, changelog/upgrade notice, docs/assets, WordPress.org metadata/`Tested up to`, and no future-work claims.
- Commented-code/dead-code hygiene: disabled/debug code, stale TODOs, unused paths, and dead shims.
- Compatibility: launched commitments, supported runtimes/browsers/editors, and integrations.
- Packaging/version metadata: headers, package metadata, runtime-only dependencies, ZIP contents, and version alignment.
- UI/browser proof: packaged screenshots/Playwright for changed UI and constrained widths; add design audit evidence for material workflow changes.

When the train is release-ready, request exact production/beta approval with merged/open work, compact quality gate matrix, CI/package validation, package/build used, exact environment, visual proof status, golden workflow regression status, docs/WordPress.org state, risks, rollback, and accepted proof gaps.

## Post-Release Verification

After beta/production release, deploy, or WordPress.org publish, keep the train open until a compact check proves:

- Approved commit, tag/release, and package/artifact align.
- For production, the exact release tag is an ancestor of `origin/main`, main metadata matches, and prerelease tags did not advance `main`.
- Public version/docs/assets/`Tested up to` signals are current.
- Installed-package golden workflow passes or its proof gap is accepted.
- Support/error signals and rollback notes are checked.
- Every issue is reconciled as `Fixed now`, `Implemented-proof-gap`, `Deferred`, or `Blocked`; close only fully accepted work. Release-branch merges may not auto-close issues, so reconcile them manually.
- Next train and temporary automation are reconciled; merged worker worktrees are removed under the approved storage lifecycle or retained with a reason and review trigger.

If any post-release proof fails, stop normal release closure and route recovery to the product thread or prepare an owner decision brief.

A distinct post-release regression gets a new linked issue; do not reopen a completed issue merely because a different bug appeared. Use `Fixes` or `Closes` only when a PR fully resolves the issue; partial work uses `Related`.

## Production Regression Escalation

A P0 or production regression pauses normal flow and requires an explicit hotfix/release decision. The CTO brief gives a recommendation, options, risk, and decision deadline. Escalate immediately at T-1; otherwise escalate when no owner response arrives within four working hours. Investigation, proof, and reversible candidate preparation may continue, but production merge/tag/release remains owner-approved.
