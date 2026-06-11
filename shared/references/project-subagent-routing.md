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

## Model Routing

Use `gpt-5.3-codex-spark` where a smaller, faster agent can produce bounded output:

- Read-only repo mapper for plugin, theme, block, or test surfaces.
- Log, CI, and test failure summarizer.
- Narrow fixer after the parent provides the exact files, behavior, and acceptance checks.
- Browser/UI evidence collector when the test path is explicit.
- Documentation or changelog draft reviewer with a fixed source set.

Use a stronger model for:

- Cross-system architecture decisions.
- Security, privacy, payment, migration, and data-loss risk.
- VIP/high-scale performance decisions.
- Final PR review, release readiness, and base-branch decisions.
- Ambiguous requirements where the implementation path is not yet clear.

If a configured model is unavailable in the current environment, do not silently substitute. Report the missing model and use the nearest approved project fallback.

## Skill-Level Routing For Subagents

The parent agent should classify the task and assign one lane per subagent. Do not tell every subagent to load all of `wp-expert` or `wp-contributor`.

Examples:

- Plugin mapper: `$wp-expert`, primary reference `plugin-architecture.md`; supporting `enterprise-code-quality-gate.md` only if reviewing code quality.
- Block/FSE mapper: `$wp-expert`, primary reference `block-theme-architecture.md`; supporting `custom-block-theme-from-design.md` only for design-to-theme work.
- UI reviewer: `$wp-expert`, primary reference `ux-product-strategy-design-qa.md`; supporting `visual-parity-regression.md` only when screenshots/designs are involved.
- Security reviewer: `$wp-expert`, primary reference `security-threat-modeling-review.md`; supporting `performance-and-security.md` only when needed.
- WordPress contribution mapper: `$wp-contributor`, primary reference matching the surface: `core-workflow.md`, `gutenberg-workflow.md`, or `meta-workflow.md`.
- Product workflow coordinator: `$wp-product-orchestrator`, primary shared reference `product-queue-triage.md` or `product-autonomy-permissions.md`; implementation details still route to one `wp-expert` lane.
- PR/release reviewer: shared `session-continuity-pr-discipline.md`, plus the one implementation reference tied to the changed surface.

Subagent prompt contract:

```text
Use only the named skill/reference lane unless you find a concrete blocker.
Return: findings, files touched or inspected, confidence, validation evidence, and open risks.
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
developer_instructions = "Use $wp-expert with plugin-architecture.md only. Map entry points, hooks, REST routes, assets, tests, and risk hotspots. Output max 20 bullets with file paths. Do not edit files."
```

Read-only theme/block mapper:

```toml
name = "wp-theme-mapper"
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = "Use $wp-expert with block-theme-architecture.md only. Map theme.json, templates, parts, patterns, blocks, editor/frontend CSS, build output, and editability risks. Output max 20 bullets. Do not edit files."
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
developer_instructions = "Review changed files only. Use $wp-expert review mode plus the relevant primary reference. Findings first with severity, file/line, impact, and missing tests. Do not edit files."
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
- Prefer read-only mode unless a narrow fixer has exact scope.
- Avoid duplicate exploration across agents.
- Tell subagents whether web access is allowed and which official docs to prefer.

After subagents return:

- Merge findings into one plan; do not paste every subagent transcript.
- Verify any high-risk claim before implementing or reporting completion.
- Keep commits and PRs owned by the parent agent.
- For issue-driven PRs, use `session-continuity-pr-discipline.md` to prove the milestone/release base branch before creating the PR.
