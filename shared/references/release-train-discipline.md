# Release Train Discipline

Use this reference before beta, prerelease, stable, deploy, version, tag, WordPress.org, milestone, or release-branch decisions.

## Production Gate

Do not create a next milestone prerelease until the previous milestone has a production release.

Example: if `0.6.0` is not production-released, do not create `0.6.1-beta-*`. New work may be folded into the current unreleased train or queued for a later milestone, but prerelease and release creation are gated by production release state.

Never infer prerelease readiness from milestone closure alone.

`main` is production release space only. Release branches merge to `main` only after explicit owner release approval and owner testing confirmation. Milestone work must target `release/<milestone-number>`. `develop` is only for unmilestoned development integration or as the verified source for creating a missing milestone branch.

## Required Release Checks

Before any beta, prerelease, or stable action, verify:

- Latest production release.
- Latest prerelease.
- Current target release train.
- Whether the previous milestone has a production release.
- Whether the owner explicitly authorized production/beta release creation in the current context.
- Whether owner testing confirmation exists for production readiness.

Use the source of truth hierarchy from `cto-orchestration-operating-model.md`: GitHub production releases/tags first, then prereleases/tags, then milestones/issues/PRs, then repo docs, then local state, then memory/chat.

## Milestone Discipline

Milestones need due dates. If a milestone lacks a due date:

- Set or recommend one only after checking the current release train and existing milestone sequence.
- Ask the owner if the date is ambiguous.
- Do not invent dates that conflict with repo policy or production release order.
- Do not treat the missing due date alone as a blocker to implementation delegation for an existing issue when scope, milestone evidence, and branch/base are otherwise safe.

For milestone-assigned work, create or use `release/<milestone-number>` from the verified development base. Do not target `develop` for milestone PRs. Do not retarget ambiguous milestones or change due dates without evidence.

## Release Stop Conditions

Stop before release or prerelease creation when:

- Production release state is unclear.
- The previous release train is not production-released.
- CI or package validation is not current.
- WordPress.org, marketplace, or deploy credentials are missing.
- The owner did not explicitly authorize the production/beta release action.

Normal product orchestration, issue intake, implementation, hardening PRs, branch creation for milestone work, and validation do not require explicit release approval when they avoid production/beta releases, tags, deploys, and public release approval claims.
