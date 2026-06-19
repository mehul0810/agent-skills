# Release Train Discipline

Use this reference before beta, prerelease, stable, deploy, version, tag, WordPress.org, or milestone decisions.

## Production Gate

Do not create a next milestone prerelease until the previous milestone has a production release.

Example: if `0.6.0` is not production-released, do not create `0.6.1-beta-*`. New work may be folded into the current unreleased train or queued for a later milestone, but prerelease and release creation are gated by production release state.

Never infer prerelease readiness from milestone closure alone.

## Required Release Checks

Before any beta, prerelease, or stable action, verify:

- Latest production release.
- Latest prerelease.
- Current target release train.
- Whether the previous milestone has a production release.
- Whether the owner explicitly authorized prerelease/release creation in the current context.

Use the source of truth hierarchy from `cto-orchestration-operating-model.md`: GitHub production releases/tags first, then prereleases/tags, then milestones/issues/PRs, then repo docs, then local state, then memory/chat.

## Milestone Discipline

Milestones need due dates. If a milestone lacks a due date:

- Set or recommend one only after checking the current release train and existing milestone sequence.
- Ask the owner if the date is ambiguous.
- Do not invent dates that conflict with repo policy or production release order.

## Release Stop Conditions

Stop before release or prerelease creation when:

- Production release state is unclear.
- The previous release train is not production-released.
- CI or package validation is not current.
- WordPress.org, marketplace, or deploy credentials are missing.
- The owner did not explicitly authorize the release action.
