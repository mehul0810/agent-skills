# Project Subagent Routing Discipline

Use this reference when a WordPress or WordPress-contribution project should use Codex subagents, custom project agents, or model routing. Keep this project-level. Do not bloat global skills or use hooks to simulate dynamic skill loading.

## Goal

Use subagents to reduce wall time and isolate risk without increasing total token waste. The parent agent owns the plan, final decisions, implementation boundaries, validation evidence, commits, pushes, and PRs. Subagents provide bounded research, mapping, review, or narrow implementation assistance.

## When To Use Subagents

Use project subagents when one of these is true:

- The repo is large enough that parallel read-only mapping will save time.
- The task has independent lanes: plugin PHP, block/editor JS, theme/FSE, tests, docs, release, security, or performance.
- A second review pass materially reduces risk before commit or PR.
- Browser/UI evidence, logs, or CI output can be summarized independently.
- You want to route lower-risk work to `gpt-5.3-codex-spark` while reserving stronger models for architecture, security, release, or final review.

Do not use subagents for:

- Small single-file edits, exact CSS/value changes, copy edits, or obvious config changes.
- Tasks where the parent has not defined the acceptance criteria.
- Work requiring broad repo mutation without a narrow handoff.
- Attempts to bypass project trust, sandbox, permissions, or review requirements.

## Project Configuration Pattern

Create subagents in the app project, not in this skill repository, unless you are adding reusable templates. Recommended project files:

```text
.codex/config.toml
.codex/agents/wp-plugin-mapper.toml
.codex/agents/wp-theme-mapper.toml
.codex/agents/wp-pr-reviewer.toml
.codex/agents/wp-narrow-fixer.toml
```

Start conservative:

```toml
[agents]
max_threads = 3
max_depth = 1
```

Raise concurrency only after the repo workflow is proven. Keep `max_depth = 1` unless a project has a deliberate multi-agent review process.

## Model And Reasoning Routing

Use the cheapest model/reasoning combination that can safely produce the needed evidence. Escalate only when ambiguity, irreversible decisions, release impact, security/privacy, migrations, or architecture risk is real.

- Portfolio heartbeat/sweep: compact source-of-truth sweep; low or medium reasoning. The active acceleration default is every 30 minutes, but lower cadence is preferred when the sweep is mostly quiet. Use high only for release conflict resolution, owner decision briefs, protected-thread recovery, or cross-product governance changes.
- Product hourly heartbeat or 15-minute acceleration heartbeat: medium reasoning by default. Prefer 15-minute cadence only for active release trains/PRs/CI/executable `owner:codex` work; otherwise 30-60 minutes or pause. Use high only for release-ready synthesis, ambiguous milestone scope, risky PR merge/release decisions, security/privacy posture, schema/data migration, or product thread topology drift.
- Worker implementation: match the specialist skill and artifact. Use `gpt-5.3-codex-spark` or another approved fast/lower-cost model for bounded mapping, issue intake, docs, test evidence, simple CI triage, narrow fixes with exact files, and explicit validation commands.
- Stronger worker/reviewer model: use for architecture, security, privacy, public API contracts, data migrations, VIP/high-scale performance, release blockers, final PR review, base-branch decisions, or unclear implementation paths.
- Screenshots/design proof: use a fast model for explicit screenshot capture or visual proof. Escalate only when visual regression judgment, UX tradeoffs, accessibility impact, or design-system interpretation is complex.
- Web/current research: keep bounded, prefer official/primary sources, summarize only decision-relevant changes, and use high reasoning only when the result is cross-product, release-blocking, security-sensitive, or architecture-shaping.
- For material UI/workflow risk, route through `design-intelligence-routing.md` and then the narrowest Product Design skill instead of improvising broad design critique.

If a configured model is unavailable in the current environment, do not silently substitute. Report the missing model and use the nearest approved project fallback. Do not spend a stronger model on routine polling, broad rereads, or evidence the source of truth can answer cheaply.

## Skill-Level Routing For Subagents

The parent agent should classify the task and assign one lane per subagent. Auto-select the narrowest skill from the artifact being inspected or changed; do not tell every subagent to load `wp-expert` or every WordPress reference.

Examples:

- Plugin mapper: `$wp-plugin-expert`, primary route `plugin-architecture.md`; supporting `enterprise-code-quality-gate.md` for implementation/review quality gates.
- Block/FSE mapper: `$wp-theme-expert`, primary route `block-theme-architecture.md`; supporting `custom-block-theme-from-design.md` only for design-to-theme work.
- Theme/site implementer or reviewer: add `enterprise-code-quality-gate.md` when code is being changed or approved.
- Direct fixer or reviewer with implementation responsibility: add `worker-execution-discipline.md` so exact-entity-first inspection, blocker recovery, assumption control, and finish-pass behavior stay consistent.
- Design audit or redesign planner: use `design-intelligence-routing.md`, then `product-design:audit`, `product-design:get-context` + `product-design:ideate`, or `product-design:image-to-code` based on whether the task is critique, direction-finding, or implementation from a chosen visual target.
- UI reviewer: `$wp-site-expert` for site UX or `$wp-theme-expert` for editor/theme UX; supporting `visual-parity-regression.md` only when screenshots/designs are involved.
- Security reviewer: `$wp-plugin-expert`, `$wp-theme-expert`, or `$wp-site-expert` based on the changed artifact; primary route `security-threat-modeling-review.md` only when the risk is concrete.
- WordPress contribution mapper: `$wp-contributor`, primary reference matching the surface: `core-workflow.md`, `gutenberg-workflow.md`, or `meta-workflow.md`.
- Portfolio governance: `$wp-portfolio-cto`, primary shared reference `cto-orchestration-operating-model.md`; route product execution to product threads.
- Product workflow coordinator: `$wp-product-orchestrator`, primary shared reference `product-queue-triage.md` or `product-autonomy-permissions.md`; implementation details still route to one specialist lane.
- PR/release reviewer: shared `session-continuity-pr-discipline.md`, plus the specialist skill and one implementation reference tied to the changed surface.

Subagent prompt contract:

```text
Use only the named skill/reference lane unless you find a concrete blocker.
Return: findings, files touched or inspected, confidence, validation evidence, and open risks.
Report adjacent findings separately and preserve scoped task boundaries unless immediate escalation is required.
Turn Product Design feedback into acceptance criteria, design QA checks, or adjacent findings instead of vague taste commentary.
Inspect the exact referenced artifact first, and if blocked, report attempted recovery plus the remaining proof gap instead of a generic tool failure.
Do not modify files unless explicitly assigned as a narrow fixer.
Keep output under the requested line or bullet limit.
```

## Suggested Agent Profiles

Read-only plugin mapper:

```toml
name = "wp-plugin-mapper"
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = "Use $wp-plugin-expert with plugin-architecture.md only. Map entry points, hooks, REST routes, assets, tests, and risk hotspots. Output max 20 bullets with file paths. Do not edit files."
```

Read-only theme/block mapper:

```toml
name = "wp-theme-mapper"
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = "Use $wp-theme-expert with block-theme-architecture.md only. Map theme.json, templates, parts, patterns, blocks, editor/frontend CSS, build output, and editability risks. Output max 20 bullets. Do not edit files."
```

Narrow fixer after the parent isolates scope:

```toml
name = "wp-narrow-fixer"
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
developer_instructions = "Use the exact files, acceptance checks, and validation commands supplied by the parent. Make the smallest safe change. Do not broaden scope or commit."
```

High-confidence reviewer:

```toml
name = "wp-pr-reviewer"
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = "Review changed files only. Use the narrowest WordPress specialist skill plus the relevant primary reference. Findings first with severity, file/line, impact, and missing tests. Do not edit files."
```

## Hooks Boundary

Use hooks for deterministic lifecycle enforcement in a specific trusted project, such as:

- Rejecting commits with dirty generated artifacts.
- Running formatting or lint checks after edits.
- Blocking PR creation when the base branch is not explicit.
- Capturing logs or environment metadata before validation.

Do not rely on hooks for dynamic WordPress expertise selection, broad research, or model assignment. Those decisions belong in the parent plan and project subagent profiles.

## Parent Agent Checklist

Before launching subagents:

- Define the acceptance criteria and stop condition.
- Assign each subagent one lane, one expected output format, and a token/output budget.
- Set model/reasoning from the matrix above; do not default every worker to the strongest model.
- Prefer read-only mode unless a narrow fixer has exact scope.
- Avoid duplicate exploration across agents.
- Tell subagents whether web access is allowed and which official docs to prefer.

After subagents return:

- Merge findings into one plan; do not paste every subagent transcript.
- Verify any high-risk claim before implementing or reporting completion.
- Keep commits and PRs owned by the parent agent.
- For issue-driven PRs, use `session-continuity-pr-discipline.md` to prove the milestone/release base branch before creating the PR.
