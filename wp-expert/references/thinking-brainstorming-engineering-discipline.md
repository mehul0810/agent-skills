# Thinking Brainstorming And Engineering Discipline

Use this when WordPress work risks drifting into too much brainstorming, too much process, too much polish, or over-engineered implementation. The goal is enterprise-quality judgment with minimum necessary context, not maximum ceremony.

## Core Principle

Apply enough thinking to prevent rework, then converge. Enterprise quality means the chosen path is secure, scalable, maintainable, testable, usable, and polished for the changed surface. It does not mean every task needs a full architecture review, design audit, or exhaustive option matrix.

## Thinking Budget

Choose the smallest budget that protects the risk:

| Risk level | Use when | Expected behavior |
| --- | --- | --- |
| Direct edit | Exact value, copy, config, or local docs change | Apply narrowly, confirm diff, run cheap checks only. |
| Bounded decision | 2-3 plausible implementation paths | Compare up to 3 options, recommend one, state rejected paths. |
| Substantial build | New behavior, API, UI flow, block/theme surface, data contract, or release-sensitive change | Create a short plan, acceptance checks, test decision, and rollback/backout note. |
| Enterprise risk | Security, migration, public contract, high traffic, payment, privacy, VIP launch, or production incident | Use the relevant deep reference plus acceptance criteria, tests, observability, and rollback evidence. |

Escalate only for named risks, not because more process feels safer.

## Reference And Token Discipline

- Default to one primary reference and at most two supporting references.
- Load more only when a named acceptance risk cannot be handled safely with the current set.
- When exceeding the default reference budget, state the risk that justifies it, then load only the relevant section or file.
- Stop exploration when the implementation path, validation path, and residual risks are clear.
- Prefer `rg`, targeted file reads, diffs, project scripts, and concise summaries over broad context dumps.
- Do not re-open large references unless new evidence invalidates the working model.

## Brainstorming Convergence

When brainstorming, produce a decision, not an endless idea list:

```text
Problem:
Constraints:
Option 1:
Option 2:
Option 3:
Recommendation:
Rejected because:
Prototype or validation step:
```

Rules:

- Present no more than 3 options unless the user explicitly asks for more.
- Score options by security, performance, scalability, maintainability, admin/editor/visitor usability, WordPress fit, testability, rollout safety, and premium feel when UI is involved.
- Recommend one path and explain why it wins for the real constraints.
- Reject options that are clever but harder to operate, harder to test, or worse for editors/admins/visitors.
- End with the next concrete action: prototype, implementation, validation, user decision, or backlog.

## Anti-Overengineering Gate

Before adding abstraction, infrastructure, dependencies, or compatibility layers, ask:

- Does this solve a current requirement or a proven near-term requirement?
- Is there repeated behavior with stable shared semantics, or are the cases only superficially similar?
- Will this make tests, onboarding, and support easier rather than harder?
- Does WordPress already provide a native API, block, pattern, hook, REST contract, cache layer, cron/action queue, or theme primitive that fits?
- Is the public contract launched or depended on by real users, add-ons, clients, or production data?
- Is the extra complexity cheaper than a small clear implementation plus tests?

Prefer:

- Native WordPress primitives over custom frameworks.
- Small services with clear ownership over generic manager/factory layers.
- Scoped CSS/theme tokens over global visual rewrites.
- REST routes with schemas over new `admin-ajax.php` handlers.
- Feature flags only for risky rollout, migration, external dependency, or reversible production control.
- Compatibility only for launched behavior or real production/client data, not abandoned unreleased intermediate shapes.

Do not under-engineer security, permissions, data integrity, scalability, accessibility, or tests. Cut unnecessary ceremony, not essential quality.

## Premium And Enterprise Polish Stopping Rule

A changed UI is premium enough when the changed surface meets all applicable criteria:

- Matches the approved design, style guide, tokens, parent theme, or visual reference within practical platform constraints.
- Looks intentional on mobile, tablet, desktop, and relevant admin/editor canvases.
- Has clear hierarchy, spacing rhythm, typography, alignment, color, states, and focus behavior.
- Avoids generic AI-looking layouts, accidental defaults, inconsistent radii/shadows, and random one-off CSS.
- Preserves accessibility, responsive behavior, performance, WordPress editability, and maintainability.
- Covers visible empty, loading, error, success, disabled, hover, focus, and long-content states when those states are part of the changed flow.
- Has the evidence required by `planning-drift-control.md` for the validation level.

Stop polishing when those criteria are satisfied and remaining changes are subjective, outside scope, or better handled as separate design backlog. Record the backlog item instead of expanding the current task.

For exact user-fed visual values, apply the value and confirm the diff. Do not spend extra tokens on visual QA unless the change is cascade-sensitive or the user asked for it.

## Acceptance Criteria Calibration

Acceptance criteria should prevent drift, not create checklist theater.

- Fill only the sections that apply to the work.
- Delete or omit irrelevant template rows instead of writing `N/A` boilerplate.
- Every criterion should map to a user-visible behavior, operational risk, validation command, or explicit non-goal.
- Keep criteria minimal for small changes and stronger for security, data, public contracts, migration, performance, VIP, and release work.
- If a template creates more process than clarity, replace it with a short risk-based checklist.

## Plugin Contract Inventory Scope

Do not force a full product-wide inventory for every plugin edit. Pick the smallest contract scope that matches the change:

- Touched contract: a small change to one hook, route, block, option, asset, or class.
- Feature contract: a new or changed feature with multiple related surfaces.
- Release contract: a release that changes public behavior, add-ons/pro boundaries, migrations, or compatibility.
- Full audit: marketplace, enterprise onboarding, public API redesign, major version, acquisition/due-diligence, or repeated regression pattern.

State the selected scope before doing broad inventory.

## Analytics And Tracking Scope Gate

Do not add new analytics vendors, pixels, tag managers, experiments, telemetry, or conversion events unless:

- The user requested it.
- The requirement or existing measurement plan requires it.
- The repo already has an approved convention and the change extends it narrowly.

If measurement is useful but not approved, propose the event contract and consent/privacy guardrails as a recommendation instead of implementing tracking scope creep.

## Output Discipline

For plans:

```text
Goal:
Scope:
Chosen path:
Why not alternatives:
Acceptance checks:
Validation level:
Stop conditions:
```

For reviews:

```text
Findings:
Overengineering risk:
Underengineering risk:
Missing validation or tests:
Recommended smallest safe fix:
```

For implementation summaries, report only the solution, changed files, validation, commit status, and residual risk. Do not narrate every internal step.
