# WordPress Plugin Release Workflow

Use with `release-train-discipline.md` for a plugin milestone through GitHub release. The general release gates, exact approvals, and mainline ancestry rules still apply.

## Train And PR Contract

- Create one version-named milestone for the release and give it a due date that represents release exit. Convert discovered defects, test gaps, and release findings into duplicate-screened issues unless fixed inside the current PR.
- Cut `release/<release-version>` from the verified integration base. Each milestone issue gets one branch, worktree, and PR against that release branch; include `Changelog:` with one verified audience-facing item, or `Not applicable - internal only: <reason>`. Aggregate and deduplicate those items during release preparation.
- When scope is complete, the PO reports the exact candidate and asks the owner to choose the release date. Do not invent a date or start release actions. Once chosen, update the version heading/date, `readme.txt`, release notes, and package metadata, then rerun affected checks.

## Candidate And Approval Contract

- Patch releases do not use beta/RC candidates; after full quality, package, and golden-workflow proof, prepare the stable candidate directly.
- Minor and major releases require at least one beta or RC: use beta for tester feedback and RC for a frozen candidate; high-risk work may use both. Each candidate needs exact owner approval.
- A solo owner does not need collaborator approval, but a dedicated project Code Reviewer independently reviews issue PRs and the final release PR. Product Release Readiness checks exact lineage and gates; CTO performs a bounded governance review of the final release PR, and the owner reviews and approves the protected merge/release.
- After approval, merge the release PR into `main`, create the tag/GitHub release from that merged SHA, and verify the repository release Action consumes that tag rather than `release/*`. Keep the train open until post-release reconciliation passes.
