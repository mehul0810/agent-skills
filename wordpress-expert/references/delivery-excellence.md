# Delivery Excellence And Estimation

Use this for client requirement review, PRDs, scope of work, estimates, milestones, implementation plans, GitHub issue/PR discipline, mobile-first responsive architecture, token-efficient execution, confirmation gates, testing strategy, and maintainable onboarding-friendly code.

## Delivery Defaults

- Treat every task as enterprise work unless the user explicitly asks for a prototype or throwaway experiment.
- Prefer the implementation path that is performant, scalable, secure, maintainable, and easy for admins, editors, and visitors.
- When multiple valid approaches exist, choose the one with the best long-term operating profile, not the one that is shortest to type.
- Plan enough to finish in one pass, then implement narrowly.
- Confirm with evidence before saying work is done.
- Keep token usage low by reading only the files and references needed for the current decision.

## Requirements Intake

When reviewing client requirements, extract:

- Goal: business outcome and user outcome.
- Users: admin, editor, customer, visitor, developer, shop manager, network admin.
- Scope: must-have, should-have, could-have, explicitly out of scope.
- Existing system: plugin/theme/site/monorepo, integrations, data model, hosting, constraints.
- UX expectations: admin flow, editor flow, frontend flow, mobile behavior, accessibility.
- Non-functional requirements: performance, security, privacy, SEO, scale, multisite, VIP, compatibility.
- Acceptance criteria: observable behavior, validation checks, browsers/devices, roles, edge cases.
- Risks and unknowns: unclear requirements, external API limits, migration risk, data quality, dependency conflicts.

If requirements are ambiguous and implementation risk is high, ask one concise clarifying question. Otherwise state assumptions and proceed.

## PRD Structure

Use this for product-facing planning:

```text
Title:
Problem:
Goals:
Non-goals:
User personas:
User stories:
Core flows:
Functional requirements:
Non-functional requirements:
Admin/editor UX:
Frontend/mobile UX:
Permissions and security:
Data and migration notes:
Integrations:
Analytics/observability:
Acceptance criteria:
Risks and assumptions:
```

## Scope Of Work Structure

Use this for client/project delivery:

```text
Overview:
In scope:
Out of scope:
Deliverables:
Milestones:
Dependencies:
Client responsibilities:
Technical assumptions:
Testing and acceptance:
Deployment/release plan:
Backout plan:
Estimate and buffer:
```

## Technical Breakdown And Estimates

Break estimates into implementation units that can be validated independently:

```text
Discovery and architecture:
Data model/migrations:
Backend/API:
Admin/editor UI:
Frontend/responsive UI:
Security/privacy:
Tests:
QA/regression:
Release/deployment:
Documentation/handoff:
```

Estimate rules:

- Estimate in hours or half-day blocks depending on precision.
- Include Codex acceleration only where the task is well-scoped, codebase conventions are clear, and validation is available.
- Add explicit buffer for uncertainty, integration risk, QA, review, and deployment.
- Typical buffer: 15-25% for clear scoped work; 25-40% for integrations, migrations, unknown legacy code, or production-risk work.
- Separate discovery spike estimates from implementation estimates when requirements or architecture are unclear.
- Do not hide testing, review, documentation, and release effort inside implementation hours.

## Milestone Planning

Good milestones produce working, reviewable increments:

1. Discovery and technical plan.
2. Architecture/data contracts.
3. Backend/API and permission model.
4. Admin/editor UX.
5. Frontend/mobile behavior.
6. Tests and hardening.
7. Release packaging, deployment, and handoff.

For smaller tasks, compress milestones into phases, but keep validation and release readiness visible.

## Mobile-First Responsive Architecture

Use mobile-first thinking for frontend and customer-facing experiences, and responsive-safe thinking for admin/editor interfaces.

- Start with the smallest useful viewport and primary task.
- Use fluid layouts, intrinsic sizing, and responsive media rather than fixed desktop widths.
- Prevent horizontal scroll and layout shift.
- Preserve readable typography: body text should remain legible and controls should not trigger mobile zoom.
- Ensure touch targets are large enough and spaced safely.
- Prioritize content on small screens; move secondary controls into disclosure, filters, or contextual menus.
- Validate logged-in/out, translated strings, long content, missing media, and high-density data on mobile.
- In wp-admin/editor, test narrow sidebars, editor canvas constraints, and responsive control panels.
- Avoid shipping heavy frontend frameworks or global bundles just to solve responsive styling.

## Planning Before Implementation

Before editing substantial code, produce or mentally confirm:

- Runtime surface and exact files likely affected.
- Data/API contract and backward compatibility implications.
- Release state: whether the affected behavior is unreleased, private preview, beta/RC, feature-flagged in production, or publicly launched. Use `release-contract-compatibility.md` before adding compatibility shims.
- Security model: actor, capability, nonce/CSRF, validation, escaping.
- Performance model: hot paths, queries, cache, remote calls, assets.
- UX model: admin/editor/frontend/mobile states.
- Test plan: fastest meaningful checks plus deeper regression checks.
- Backout path: how to disable, revert, or migrate safely.

The plan should be short unless the user asks for a detailed plan. The goal is to complete the work in one pass, not to create planning theater.

## Token-Efficient Execution

- Start with targeted discovery: `git status`, `rg`, file list, and the smallest relevant files.
- Load one reference at a time based on task classification.
- Summarize what you learned instead of keeping rereading large files.
- Prefer deterministic scripts and project commands over re-deriving repository facts.
- Avoid broad scans of vendor, build, node_modules, uploads, cache, and generated artifacts unless the task requires them.
- When context grows, write down the working model and proceed from evidence.

## Confirmation Before Done

Do not say work is complete until the relevant evidence is checked:

- Files changed match the intended scope.
- Syntax/build/lint/test checks were run where available.
- Runtime behavior was probed when feasible.
- UI changes were checked in the relevant contexts: admin, editor, frontend, responsive/mobile.
- Git status is understood.
- Known gaps are disclosed.

If a check cannot be run, say exactly what was not run and why.

## Enterprise Implementation Choice

When choosing between implementation options, score them by:

- Security and privacy.
- Performance at production scale.
- Backward compatibility.
- Release-contract scope: preserve launched behavior and real data, but do not preserve unreleased draft shapes.
- Admin/editor/visitor ease of use.
- Testability.
- Operational visibility.
- Migration and rollback safety.
- Fit with existing repository conventions.
- Long-term maintainability for a new team member.

Prefer boring, native, observable WordPress patterns over clever abstractions unless the abstraction removes repeated risk.

## GitHub Enterprise Workflow

Issues:

- Create focused issues with problem, expected behavior, acceptance criteria, technical notes, dependencies, and test requirements.
- Label by type, priority, area, status, and risk where the repo has that convention.
- Triage duplicates, blockers, security-sensitive reports, and reproduction gaps before implementation.

Branches and commits:

- Keep branches scoped to one feature/fix.
- Commit messages should state the behavior change, not just the file touched.
- Do not mix refactors, formatting, and feature behavior unless explicitly part of the same change.

Pull requests:

- PR description should include summary, changed areas, screenshots for UI, validation, risks, deployment notes, and rollback notes when relevant.
- For changelogs and release notes, use `changelog-release-notes.md` so entries are audience-appropriate and unreleased feature fixes are not inflated into fake fixed/improved entries.
- Link issues and call out breaking changes or migrations.
- Reply to each actionable review thread individually when requested.
- Keep PRs reviewable; split large work by milestone or package boundary.

## Testing Strategy

Test the behavior, not only the implementation:

- Unit tests for pure services, validators, formatting, policy, and data transformations.
- Integration tests for WordPress hooks, REST routes, permissions, migrations, and custom tables.
- E2E tests for editor/admin/frontend flows that are hard to trust with unit tests alone.
- Regression tests for every bug fix when a stable reproduction exists.
- Accessibility checks for UI: labels, focus, keyboard, contrast, error state.
- Performance checks for hot paths: query count, cache behavior, no unbounded loops, no synchronous remote calls.

Keep tests effective and efficient:

- Add the narrowest test that would have caught the bug or will protect the feature contract.
- Avoid brittle snapshots unless markup shape is the contract.
- Prefer factories/fixtures that express user intent.
- Include negative permission tests for endpoints and admin actions.
- Include mobile/responsive smoke checks for frontend/UI-heavy changes when tooling allows.

## Code Comments And Onboarding

Use comments to explain why, not what:

- Explain non-obvious WordPress hooks, timing, cache invalidation, migration decisions, compatibility shims, external API quirks, and security constraints.
- Document public hooks/filters, REST routes, option schemas, custom table schemas, cron/action args, and feature flags.
- Avoid comments that restate code.
- Remove stale comments during refactors.
- Prefer clear names and small functions over long explanatory comments.
- Add docblocks for public APIs and complex array shapes where static analysis or onboarding benefits.

A new team member should be able to understand the feature boundary, data flow, and validation path without reading the entire repo.
