# Planning Drift Control

Use this when a task needs enough planning to prevent implementation drift, or when validation should be calibrated to risk instead of treated as all-or-nothing. Use `thinking-brainstorming-engineering-discipline.md` when the risk is over-planning, over-polishing, broad brainstorming, or overengineering.

## Principle

Plan enough to protect scope, then execute narrowly. Validation should prove the risk that actually changed; do not spend tokens or time visually proving an exact user-supplied value change unless the change is cascade-sensitive or the user requested verification.

Do not use planning as a substitute for decision-making. If multiple paths are plausible, compare up to 3 options, choose one, and proceed unless the wrong choice would be costly.

## Drift-Resistant Plan Contract

For substantial or ambiguous work, produce or mentally confirm:

- Goal.
- In scope.
- Out of scope.
- Files likely touched.
- Implementation contract.
- Acceptance checks.
- Validation level.
- Stop/ask triggers.

Keep this short. Use a written plan when the task is cross-cutting, security-sensitive, data-affecting, UI/UX ambiguous, or likely to span multiple files. Use a mental plan for trivial direct edits.

## Scope Drift Guard

Before editing:

- Map the exact requested outcome and intended files.
- Identify what must not change.
- Decide which validation level applies.

During editing:

- Do not fix adjacent issues unless they block the requested outcome.
- If implementation needs unplanned files, public contracts, migrations, dependencies, or broader refactors, stop and ask or state the scope change before continuing.
- If a simple CSS/theme request reveals cascade, saved global styles, editor/frontend parity, or parent/child theme ambiguity, treat it as a higher-risk theme debugging task.

After editing:

- Compare the actual diff to the plan.
- Confirm every changed file maps to the requested scope.
- Call out any intentional deviation or unverified surface.

## Validation Levels

### Level 0: Exact User-Fed Value Change

Use when the user gives exact values or units and the change is a direct substitution or addition in the expected file, such as `margin-top: 24px`, `width: 320px`, a color token value, or a copy typo.

Required:

- Apply the exact requested value.
- Confirm the diff shows the requested value in the expected place.
- Run only cheap non-visual checks when useful, such as `git diff --check`, CSS brace/syntax checks, or formatter/lint if already cheap.

Do not:

- Spend time on browser/editor visual validation unless requested.
- Claim visual verification.
- Widen into design-system refactors.

Report:

- "Applied exact value; diff confirmed. Visual acceptance left for user review."

Escalate above Level 0 when the value affects shared tokens, responsive breakpoints, global styles, critical layout, accessibility, or editor/frontend parity.

### Level 1: Low-Risk Code Or Config Edit

Use for small isolated edits with limited behavior risk.

Required:

- Diff review.
- Syntax or config validation where available.
- Relevant focused lint if cheap.

### Level 2: Behavior Change

Use for new or changed PHP/JS behavior, REST routes, settings saves, cron/jobs, persistence, or business rules.

Required:

- Targeted runtime or unit/integration validation.
- Permission or negative case where relevant.
- State remaining risk if deeper tests are unavailable.

### Level 3: UI, Layout, Theme, Or Editor Change

Use for visual, responsive, block editor, theme, admin, or frontend behavior changes not covered by Level 0.

Required:

- Check the relevant surface: admin, editor, frontend, responsive/mobile, or screenshot/visual parity as appropriate.
- If browser access is blocked, use `local-https-testing.md` fallback or report the blocked surface.

### Level 4: Enterprise, VIP, Security, Migration, Or Release Change

Use for public contracts, migrations, security/privacy, production packaging, VIP/high-scale paths, release workflows, or broad refactors.

Required:

- Full validation ladder available in the repo.
- Backout/rollback and residual-risk notes.
- Edge/failure scenario coverage appropriate to the change.

## Stop Or Ask Triggers

Stop and ask or explicitly restate assumptions when:

- The user's requested value conflicts with theme tokens, style guide, or design-system constraints.
- A direct edit would require changing public contracts, migrations, dependencies, generated artifacts, or release behavior.
- The task has multiple plausible interpretations and the wrong choice is costly.
- The changed file is generated and the source file is not obvious.
- Validation cannot match the risk level and there is no acceptable lower-confidence check.

## Output Rules

- For Level 0, report the exact value/file changed and whether diff/syntax checks ran. Do not apologize for not doing browser QA.
- For higher levels, report validation that matches the risk.
- Never say "done" based only on intent. Say what was confirmed and what remains for user/client acceptance.
