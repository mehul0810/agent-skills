# Product Autonomy And Permissions

Use this reference before deciding whether a WordPress plugin/theme product task can be completed autonomously.

## Permission Levels

Treat each level as separate. Permission for one level does not imply the next.

| Level | Allowed work | Requires explicit current permission |
| --- | --- | --- |
| Inspect | Read repo, issues, PRs, docs, CI, logs, and local runtime state | None; remain read-only |
| Plan | Produce PRD, scope, estimates, acceptance criteria, or implementation plan | None; remain read-only |
| Implement local | Edit files and run local validation within assigned scope | Any critical, destructive, transfer, or uncertain-side-effect action |
| Commit | Stage and commit intended files when role/repo policy permits | Protected-branch mutation or broader unauthorized scope |
| Push | Push a scoped non-protected branch when role/repo policy permits | Protected-branch direct push or unauthorized repository scope |
| PR | Create/update PR body/comments when role/repo policy permits | Protected mutation, release, or action outside role authority |
| CI repair | Inspect or rerun proven-safe non-production CI and fix scoped failures | Deploy/release-capable or otherwise gated workflow action |
| Merge/close | Merge safe non-production PRs or close items when role/repo policy permits | Protected/production merge, release/deploy/publish, or ambiguous authority |
| Release | Version bump, tag, GitHub Release, wp.org SVN, package upload | Must be explicit for target/version |

## Autonomous By Default

A task is a good autonomous candidate when all are true:

- Clear issue/PR or user request.
- Bounded blast radius.
- Fits current `PRODUCT.md`, `VISION.md`, roadmap, or accepted repo pattern.
- Validation path exists locally, through CI, or through safe live proof.
- No production/beta release action or public security disclosure is required.
- The fix can be explained and reverted.

Common autonomous plugin/theme work:

- Reproduced bug fixes with regression coverage.
- Coding standards, lint, type, build, packaging, docs, and test fixes.
- Small admin UX, settings, onboarding, list table, notice, or supportability improvements.
- Theme template, pattern, block style, responsive, editor/frontend parity, and visual-polish fixes with explicit acceptance.
- Duplicate-code removal where behavior is preserved and tests cover changed seams.

## Owner Approval Boundary

Production or beta release actions always require explicit current `@mehul0810` approval: creating production/beta releases or tags, publishing/deploying a release, or declaring a production/beta release approved. Other command and CI actions follow `command-ci-approval-boundary.md`: critical, destructive, transfer, uncertain-side-effect, and approval-bypass actions are also owner-gated even when technically allowlisted.

For normal product orchestration, do not stall on `owner:me` if a decision is reasonable, reversible, and non-release. Document the rationale, relabel to `owner:codex`, and proceed or delegate. Continue issue creation, labels, branch prep, PR review/merge for good non-production PRs, dependency/tooling work, docs work, and reversible backlog prioritization when repo policy and validation support it.

Review and merge safe non-production PRs only after live-verifying that the target `develop` or release branch is unprotected, the PR is correctly based, scoped, non-draft, green, and no explicit current owner stop exists on that exact PR. Protected-branch merges require explicit current owner approval even when the target is non-production; ambiguous protection status fails closed. If the merge UI/tool/API blocks an otherwise authorized action, report the exact tooling or approval-layer blocker rather than inventing a different owner decision.

If the owner is unavailable and the blocker is non-destructive, local, reversible, and outside the hard-gate list, do not stop at wait-state language. Question the assumption, verify the repo/product reality, search current docs or web sources when needed, choose the safest viable unblock path, act, and then report the action plus residual risk.

## Research And Reversibility Ladder

Uncertainty starts investigation; it does not create owner authority. Before writing `owner decision needed`:

1. Name the exact decision/side effect; separate gated actions.
2. Check the exact item, repo docs/patterns, release state, tests, and runtime. For drift-prone facts, search current official/primary sources and record the date.
3. Classify:
   - `Reversible`: scoped, non-production, limited impact, no governed data/contract/promise, and credible rollback. Decide and act.
   - `Verification blocked`: authority may exist, but a required live fact is unavailable. Pause only that mutation, finish safe work, and retry narrowly; do not ask the owner to supply authority.
   - `Owner gate`: destructive/protected/release/publish/deploy/transfer/irreversible action or governed commercial, privacy/security, public-contract, or broad-positioning change. Prepare one recommendation and ask. Never execute destructive work without approval.
4. Record material reversible choices as `Decision / Evidence / Assumptions / Rollback / Validation / Review trigger`; skip ADRs for routine choices.
5. Act and validate. Escalate only if evidence reveals a gate or rollback is no longer credible.

Use one authoritative source plus repo/runtime proof when sufficient; stop when more research cannot change classification. Never use web search to justify bypassing an approval boundary.

Common reversible PO decisions: branch/base or missing non-protected release branch from verified policy; formula-backed labels/milestones/due dates; local proof fixtures and test matrices; implementation details or minor UX/copy defaults inside accepted contracts; duplicate-screened PR-sized intake; dependency/docs/tests work; wrong-base non-production correction without history rewrite/deletion; and eligible unprotected non-production PR merge.

Escalate rather than guess when work is not reversible or crosses:

- Broad or externally committed positioning/roadmap, pricing, licensing, free/pro entitlement, upsell, or telemetry. Routine issue ordering inside an accepted roadmap is autonomous.
- Public contracts: hooks, filters, REST schema, shortcode attributes, block attributes, WP-CLI commands, database schema, storage layout, import/export format, or API behavior.
- Security/privacy posture, data retention, consent, PII handling, OAuth scopes, webhook trust, or external provider permissions.
- Migrations affecting real production data.
- Changing release branch policy/versioning, WordPress.org publish/SVN, marketplace submissions, public release claims, or production/beta release action. Applying documented branch/version policy is autonomous.
- New brand-wide UI direction, conversion promise, SEO-critical information architecture, or content-model contract. Issue-level implementation inside accepted `DESIGN.md`/product contracts is autonomous.

## Reversible Default Rule

If a product choice is minor and reversible, choose the safer enterprise default and document it in the PR. If the choice affects customer expectations, paid functionality, data, privacy, SEO, release behavior, or security disclosure, stop and ask.

## Security Disclosure Safety

Security-sensitive findings should not become public issues and should not include exploit details, reproduction steps, or public `security issue` wording. Implement them as sanitized hardening PRs with validation and minimal public detail.

## Fail-Closed Boundaries

Pause only the affected mutation and report the exact recovery when:

- An unrelated dirty checkout has no proven clean worktree/base alternative.
- Milestone/base evidence still conflicts after repo/GitHub/release-policy verification.
- A required credential, account, runtime, or live fact is unavailable and no fixture or safe fallback can prove the affected boundary.
- Validation exposes a release-blocking or one-way-door conflict outside scope; otherwise record an adjacent issue and finish scoped proof.
- The best implementation changes a public contract, real data, security/privacy posture, commercial promise, or broad product direction.
- A destructive command, migration, or production/beta release action would be needed.

Proof-environment blockers, missing branches/dates, stale product-thread topology, local reversible config adjustments, repeated validation surprises, or weak workflow defaults are not owner decisions by themselves. Apply the ladder, recover safely, and escalate only the remaining owner-only action.

## Decision Brief Format

When owner input is needed, provide:

- URL or repo path and item title.
- What changes and who benefits.
- Why the decision is needed now.
- Proof already completed: reproduction, tests, CI, live proof, review.
- Tradeoffs and residual risks.
- Recommended option with rationale.
- Exact choices, including what happens if no action is taken.
