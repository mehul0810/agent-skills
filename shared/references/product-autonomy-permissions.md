# Product Autonomy And Permissions

Use before deciding whether a WordPress plugin/theme task can proceed autonomously.

## Permission Levels

Each permission level is separate; one does not imply the next.

| Level | Allowed work | Requires explicit current permission |
| --- | --- | --- |
| Inspect | Read repo, issues, PRs, docs, CI, logs, and local runtime state | None; remain read-only |
| Plan | Produce PRD, scope, estimates, acceptance criteria, or implementation plan | None; remain read-only |
| Implement local | Edit files and run local validation within assigned scope | Any critical, destructive, transfer, or uncertain-side-effect action |
| Commit | Stage and commit intended files when role/repo policy permits | Protected-branch mutation or broader unauthorized scope |
| Push | Only an explicit current owner request or the verified no-pipeline open-source-plugin exception in `change-delivery-discipline.md` | Client work without explicit request; unknown side effects; protected or unauthorized target; a role/repo policy alone |
| PR | Create/update PR body/comments when role/repo policy permits | Protected mutation, release, or action outside role authority |
| CI repair | Inspect or rerun proven-safe non-production CI and fix scoped failures | Deploy/release-capable or otherwise gated workflow action |
| Merge/close | Merge safe non-production PRs or close items when role/repo policy permits | Protected/production merge, release/deploy/publish, or ambiguous authority |
| Release | Tag, GitHub Release, wp.org SVN, release publication/upload | Must be explicit for target/version/candidate; local metadata/version preparation is not publication |

## Autonomous By Default

A task is autonomous when it has:

- Clear issue/PR or user request.
- Bounded blast radius.
- Fits current `PRODUCT.md`, `VISION.md`, roadmap, or accepted repo pattern.
- Validation path exists locally, through CI, or through safe live proof.
- No production/beta release action or public security disclosure is required.
- The fix can be explained and reverted.

Common autonomous plugin/theme work includes:

- Reproduced bug fixes with regression coverage.
- Coding standards, lint, type, build, packaging, docs, and test fixes.
- Small admin UX, settings, onboarding, list table, notice, or supportability improvements.
- Theme template, pattern, block style, responsive, editor/frontend parity, and visual-polish fixes with explicit acceptance.
- Duplicate-code removal where behavior is preserved and tests cover changed seams.

## Owner Approval Boundary

Production/beta release actions require current explicit `@mehul0810` approval: creating releases/tags, publishing/deploying, or declaring them approved. Other commands/CI follow `command-ci-approval-boundary.md`: critical, destructive, transfer, uncertain-side-effect, and approval-bypass actions remain owner-gated even when allowlisted.

For reversible non-release choices, do not stall on `owner:me`: document rationale, relabel `owner:codex`, proceed/delegate. Continue issue/label/branch prep, dependency/tooling/docs, and reversible prioritization. PR review/merge for good non-production PRs; review and merge safe non-production PRs when policy allows.

Review and merge safe non-production PRs only after live-verifying that the branch is unprotected (`develop`/release), with correct base/scope, non-draft green state, and no owner stop. Protected-branch merges require explicit current owner approval even for non-production; ambiguous protection status fails closed. If tooling blocks action, report the exact tooling or approval-layer blocker, not an invented owner decision.

If the owner is unavailable and the blocker is non-destructive, local, reversible, and outside the hard-gate list, do not wait passively. Verify repo/product facts and current docs/sources, take the safest unblock path, report action/residual risk.

## Research And Reversibility Ladder

Uncertainty starts investigation; it does not create owner authority. Never use web search to justify bypassing an approval boundary. Before `owner decision needed`:

1. Name the exact decision/side effect; separate gated actions.
2. Check the item, repo docs/patterns, release state, tests, and runtime. For drift-prone facts, verify current official/primary sources and record date.
3. Classify:
   - `Reversible`: scoped non-production, limited impact, no governed data/contract/promise, credible rollback; decide and act.
   - `Verification blocked`: required live fact unavailable; pause only that mutation, finish safe work, retry narrowly; do not ask owner to supply authority.
   - `Owner gate`: destructive/protected/release/publish/deploy/transfer/irreversible action or governed commercial, privacy/security, public-contract, or broad-positioning change. Recommend once; ask. Never execute destructive work without approval.
4. Record material reversible choices as `Decision / Evidence / Assumptions / Rollback / Validation / Review trigger`; no routine ADRs.
5. Act and validate. Escalate only if evidence reveals a gate or rollback is no longer credible.

Use authoritative source plus repo/runtime proof when sufficient; stop when research cannot change classification. Web search never justifies bypassing approval.

Examples: verified branch/base and missing unprotected release branch; formula-backed labels/dates; local fixtures; accepted-contract implementation/UX; duplicate-screened intake; dependency/docs/tests; safe wrong-base correction; eligible unprotected merge.

Escalate rather than guess for irreversible work or:

- Broad/external positioning or roadmap, pricing, licensing, entitlements, upsell, or telemetry; routine issue ordering within an accepted roadmap stays autonomous.
- Public contracts: hooks/filters, REST/API, shortcode/block attributes, WP-CLI, database/storage, or import/export formats.
- Security/privacy posture, retention, consent/PII, OAuth scopes, webhook trust, or provider permissions.
- Migrations of real production data.
- Release branch/version policy changes, WordPress.org/SVN or marketplace publishing, public release claims, production/beta actions; documented branch/version policy remains autonomous.
- Brand-wide UI, conversion promises, SEO-critical IA, or content-model changes; issue-level work within accepted `DESIGN.md`/product contracts remains autonomous.

## Reversible Default Rule

For minor reversible choices, choose and document the safer enterprise default. Ask if customer expectations, paid functionality, data, privacy, SEO, release behavior, or security disclosure is affected.

## Security Disclosure Safety

Security-sensitive findings should not become public issues. Omit exploit details, reproduction steps, and public `security issue` wording. Use validated sanitized-hardening PRs with minimal public detail.

## Fail-Closed Boundaries

Pause only the affected mutation and report the exact recovery when:

- An unrelated dirty checkout has no proven clean worktree/base alternative.
- Milestone/base evidence still conflicts after repo/GitHub/release-policy verification.
- A required credential, account, runtime, or live fact is unavailable and no fixture or safe fallback can prove the affected boundary.
- Validation exposes a release-blocking or one-way-door conflict outside scope; otherwise record an adjacent issue and finish scoped proof.
- The best implementation changes a public contract, real data, security/privacy posture, commercial promise, or broad product direction.
- A destructive command, migration, or production/beta release action would be needed.

Proof-environment blockers, missing branches/dates, stale topology, reversible local config, validation surprises, and weak defaults are not owner decisions; apply the ladder and escalate only owner-only actions.

## Decision Brief Format

Owner briefs include:

- URL or repo path and item title.
- What changes and who benefits.
- Why the decision is needed now.
- Proof already completed: reproduction, tests, CI, live proof, review.
- Tradeoffs and residual risks.
- Recommended option with rationale.
- Exact choices, including what happens if no action is taken.

## Coordinated Product And Website Delivery

Authorized autonomous website content publishing is not a plugin/theme release. PO uses one versioned packet and exact repo/content targets across code/site/docs. Publish accurate shipped behavior after link, accessibility, editability, and rendered-page checks; stage future-version docs. Preserve revisions and check concurrent edits. This does not authorize pricing/privacy promises, unsupported claims, deployment, or releases.

Prefer verified Aculect AI Companion inspect -> prepare -> validate -> publish -> public verification. Tool success is not proof; record content ID/revision and evidence URL, avoid duplicate publication. For capability gaps, give sanitized evidence to Aculect PO for duplicate-screened work; use an authorized fallback, do not expand into plugin development. Aculect releases remain gated.

Under a no-destructive-actions profile, never delete sites, content, branches, or worktrees; report cleanup eligibility. Reversible work and eligible non-production integration continue. Keep discovery value-based, release scope bounded, and docs impact in issue acceptance. Use independent review/proof without habitual permanent roles or heartbeats.
