# Project Subagent Routing Discipline

Use this for WordPress project subagents, custom project agents, and model/reasoning allocation. Keep routing at project/runtime level; do not use global hooks or permanent model IDs to simulate dynamic selection.

## Goal

Reduce wall time and token cost without weakening evidence. The parent owns strategy, boundaries, final decisions, validation synthesis, commits, pushes, and PRs. Subagents own bounded mapping, review, evidence, or narrow implementation.

## Delegation Gate

Use subagents when parallel mapping saves time, independent plugin/theme/test/docs/security lanes exist, a second review materially reduces risk, or browser/CI evidence can be gathered independently.

Do not delegate small obvious edits, work without acceptance criteria, broad mutation without a bounded handoff, or attempts to bypass trust, sandbox, approval, or review controls.

## Availability-First Routing Contract

Before assigning or overriding a model or reasoning level:

1. Inspect the model/reasoning combinations exposed by the current host or tool.
2. Honor an explicit owner-specified combination when it is available and allowed.
3. Classify ambiguity, implementation completeness, risk, reversibility, evidence burden, context size, and latency/cost need.
4. Select the lowest sufficient available capability tier and supported reasoning level.
5. Omit overrides when inherited model/reasoning already fits.

Never assume a model ID or that `high`, `xhigh`, `max`, or another reasoning label exists. Capability-check both fields at runtime.

### Capability Tiers

- Fast/economical: routine mapping, issue intake, deterministic docs/tests, evidence capture, simple CI triage, screenshot capture, and exact narrow fixes with complete files, acceptance criteria, and validation.
- Balanced implementation: bounded implementation with some codebase discovery, ordinary PR review, or moderate integration reasoning.
- Strongest suitable reasoning-capable: ambiguous architecture, security/privacy, migrations, public contracts, high-scale performance, release blockers/decisions, cross-product conflicts, and final high-risk review.

When a 5.6 Sol-class model is exposed, prefer that class with `high` or `xhigh` for complex/high-risk lanes when those reasoning levels are supported. This is a current availability example, not a required or permanent model ID. Use reasoning above `xhigh` only when the owner explicitly requests it or concrete failed proof shows `xhigh` is insufficient.

For final high-risk review, keep the strongest suitable lane as reviewer. Do not downgrade the final reviewer merely for model diversity; add an independent second pass only when variance reduction materially justifies its cost.

Portfolio sweeps normally use low/medium reasoning; escalate for cross-product conflicts, protected-thread recovery, or owner decision briefs. Product heartbeats normally use medium; escalate for release-ready synthesis, ambiguous scope, risky merge/release judgment, migrations, or topology drift. Keep screenshot capture and bounded official-source research on a fast tier unless judgment is complex.

### Escalation And De-Escalation

Escalate only after concrete ambiguity, failed proof, inadequate implementation, or confirmed risk exceeds the current tier. Do not brute-force retries with an underpowered lane. De-escalate after planning, exact-file mapping, acceptance criteria, or deterministic validation removes uncertainty.

Classify repeated retries or weak evidence caused by the assigned lane as `wrong model/reasoning allocation`, then reassess availability and tier.

If the requested/configured combination is unavailable, do not silently substitute. Preserve owner constraints and the requested capability tier before considering an upgrade: replace a fast/economical request with the nearest available fast/economical tier that supports the requested reasoning, not automatically the strongest model. Upgrade tiers only when the task risk requires it or no same-tier option can produce the evidence. Report:

```text
Requested: <model/reasoning>
Available constraint: <missing model or unsupported reasoning>
Fallback: <selected capability tier and supported reasoning>
Impact: <none or evidence/risk difference>
```

## Planning Before Allocation

Front-load scope into the issue and delegation prompt so execution does not spend tokens rediscovering the plan:

- exact repo/path and issue,
- branch/base and allowed files,
- acceptance criteria and non-goals,
- validation and screenshot/live-proof needs,
- risks, hard gates, output format, and stop condition.

Fully planned bounded work should use the lowest sufficient tier. Incomplete or decision-shaping work stays with the parent or moves to the strongest suitable tier before implementation.

## Skill Routing

Assign one lane and the narrowest skill/reference:

- Plugin: `$wp-plugin-expert` plus one plugin reference.
- Theme/FSE: `$wp-theme-expert` plus one theme reference.
- Site/UX/search: `$wp-site-expert` plus one site reference.
- Contribution: `$wp-contributor` plus the Core, Gutenberg, or Meta reference.
- Design: `design-intelligence-routing.md`, then the narrow Product Design capability.
- Portfolio: `$wp-portfolio-cto`; product execution remains in PO/worker lanes.
- Product workflow: `$wp-product-orchestrator`; implementation routes to a specialist.
- Content/growth: `content-writer`, `seo-positioning-optimizer`, or `$wp-site-expert` by artifact.

Subagent prompt contract:

```text
Use only the named skill/reference lane unless a concrete blocker appears.
Inspect the exact artifact first. Stay inside scope and do not subdelegate.
Return findings, files touched/inspected, confidence, validation, risks, and adjacent findings.
Convert Product Design feedback into acceptance criteria, design QA checks, or adjacent findings.
If blocked, report recovery attempted and the exact proof gap.
Do not modify files unless assigned as a narrow fixer.
Keep output within the requested limit.
```

## Reusable Project Profiles

Reusable `.codex/agents/*.toml` templates must not pin transient model IDs or reasoning labels. Omit those fields and inherit the parent by default. If a project needs explicit allocation, materialize the fields at runtime from the verified availability inventory rather than committing a stale ID.

Read-only mapper:

```toml
name = "wp-mapper"
sandbox_mode = "read-only"
developer_instructions = "Use the named specialist and one reference. Map entry points, tests, and risks in at most 20 bullets. Do not edit files."
```

Narrow fixer:

```toml
name = "wp-narrow-fixer"
sandbox_mode = "workspace-write"
developer_instructions = "Use supplied files, acceptance checks, and validation. Make the smallest safe change. Do not broaden scope or commit."
```

Reviewer:

```toml
name = "wp-pr-reviewer"
sandbox_mode = "read-only"
developer_instructions = "Review changed files only. Findings first with severity, file/line, impact, and missing tests. Do not edit files."
```

## Project Configuration

Keep concurrency conservative:

```toml
[agents]
max_threads = 3
max_depth = 1
```

Raise concurrency only after the workflow is proven. Keep depth at one unless the repo deliberately supports nested review.

## Hooks Boundary

Use hooks for deterministic project lifecycle checks such as generated artifacts, formatting, explicit PR base, or validation metadata. Do not use hooks for expertise selection, broad research, or dynamic model assignment.

## Parent Checklist

Before delegation: verify availability, choose the capability tier, front-load the plan, set one lane/output budget, prefer read-only unless exact fixing is assigned, and avoid duplicate exploration.

Keep payloads compact: do not batch broad parallel thread reads, full PR diffs, oversized issue bodies, or accumulated automation history. Create issues one at a time with concise bodies after narrow duplicate-screening.

After return: merge findings rather than transcripts, verify high-risk claims, reassess whether escalation/de-escalation is warranted, and keep commits/PRs parent-owned.
