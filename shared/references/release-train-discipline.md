# Release Train Discipline

Use this reference before beta, prerelease, stable, deploy, version, tag, WordPress.org, milestone, or release-branch decisions.

## Production Gate

Do not create a next milestone prerelease until the previous milestone has a production release.

Example: if `0.6.0` is not production-released, do not create `0.6.1-beta-*`. New work may be folded into the current unreleased train or queued for a later milestone, but prerelease and release creation are gated by production release state.

Never infer prerelease readiness from milestone closure alone.

`main` is production release space only. Release branches merge to `main` only after explicit owner release approval and owner testing confirmation. Milestone release work must target `release/<release-version>`, where `<release-version>` is the version/milestone title, not the GitHub milestone ID or sequence number. Do not create branches like `release/3` unless the documented release version is literally `3`. `develop` is only for unmilestoned development integration or as the verified source for creating a missing milestone branch.

## Required Release Checks

Before any beta, prerelease, or stable action, verify:

- Latest production release.
- Latest prerelease.
- Current target release train.
- Whether the previous milestone has a production release.
- Whether the owner explicitly authorized production/beta release creation in the current context.
- Whether owner testing confirmation exists for production readiness.
- For WordPress.org-hosted plugins, whether the next compatible release plans `Tested up to` WordPress 7.0.
- Whether release metadata matches the target version: plugin header/version file, `readme.txt` stable tag and changelog, package metadata, and release notes.
- Whether `readme.txt` and changelog/release notes are release-current: stable tag/version, `Tested up to`, Requires WP/PHP if present, changelog section, upgrade notice when applicable, feature descriptions, FAQ/screenshots/tags where relevant, and no overclaiming unmerged future milestone work.
- Whether any admin UI, frontend UI, consent/setup flow, editor surface, or visual output has release-candidate visual proof from the packaged ZIP/build or release branch build.
- Whether the product's golden workflow regression matrix has been smoke-tested against the release candidate package/build.
- Whether package/readme/Plugin Check validation is current after release metadata changes.

Use the source of truth hierarchy from `cto-orchestration-operating-model.md`: GitHub production releases/tags first, then prereleases/tags, then milestones/issues/PRs, then repo docs, then local state, then memory/chat.

Release-ready recommendations and owner approval requests require fresh live verification. If GitHub releases/tags, milestones, issues, PRs, labels/comments, CI, package state, or WordPress.org state cannot be verified live, stop with `live check unavailable` plus the exact missing signal and fallback evidence; do not request beta/production approval.

## Milestone Discipline

Milestones need due dates. If a milestone lacks a due date:

- Set or recommend one only after checking the current release train and existing milestone sequence.
- Ask the owner if the date is ambiguous.
- Do not invent dates that conflict with repo policy or production release order.
- Do not treat the missing due date alone as a blocker to implementation delegation for an existing issue when scope, milestone evidence, and branch/base are otherwise safe.

For milestone-assigned work, create or use `release/<release-version>` from the verified development base; `<release-version>` is the version/milestone title, not the GitHub milestone ID or sequence number. If the milestone title is not a release version, infer only from repo release policy/source-of-truth evidence; otherwise ask or create a product-thread decision brief. Do not target `develop` for milestone PRs. Do not retarget ambiguous milestones or change due dates without evidence.

If a wrong milestone-ID branch such as `release/3` was created, preserve commits by replaying or reconciling them into the correct `release/<release-version>` branch, retarget open PRs, and do not delete the wrong branch without explicit owner approval.

## Release Stop Conditions

Stop before release or prerelease creation when:

- Production release state is unclear.
- The previous release train is not production-released.
- Plugin header, readme stable tag/changelog, package metadata, or release notes do not match the target version.
- `readme.txt` or changelog/release notes are stale, incomplete, or overclaim unmerged future milestone work.
- CI or package validation is not current.
- Package/readme/Plugin Check validation is not current.
- WordPress.org, marketplace, or deploy credentials are missing.
- The owner did not explicitly authorize the production/beta release action.

If release metadata, `readme.txt`, or changelog/release notes are stale, do not ask for production/beta approval yet. Create or delegate a focused release-readiness issue/PR against the active `release/<version>` branch, validate package/readme/Plugin Check from the release branch build after changes, then regenerate the release-ready brief. If current, include explicit readme/changelog audit evidence in the brief.

Normal product orchestration, issue intake, implementation, hardening PRs, branch creation for milestone work, good non-production PR review/merge, dependency/tooling work, docs work, and validation do not require explicit release approval when they avoid production/beta releases, tags, deploys, and public release approval claims.

When the train is release-ready, request exact production/beta release approval with evidence: merged PRs, remaining open issues, CI/package validation, package/build used, exact environment, visual proof status, golden workflow regression status, readme/changelog audit status, docs/release notes/readme/WordPress.org status, risks, rollback notes, failed or skipped proof gaps, and whether skipped proof is acceptable for release.
