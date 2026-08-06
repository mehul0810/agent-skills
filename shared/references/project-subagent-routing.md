# Project Subagent Routing Discipline

Use this for WordPress project subagents, custom project agents, and model/reasoning allocation. Keep routing at project/runtime level; do not use global hooks or permanent model IDs to simulate dynamic selection.

## Goal

Reduce wall time and token cost without weakening evidence. The parent owns strategy, boundaries, final decisions, validation synthesis, commits, pushes, and PRs. Subagents own bounded mapping, review, evidence, or narrow implementation.

## Delegation Gate

Delegate when parallel mapping, independent lanes, second review, or browser/CI evidence saves time or risk. Keep small edits inline; never delegate unplanned broad mutation or bypass trust/approval controls.

## Availability-First Routing Contract

At each delegation: re-check host model/reasoning availability; treat owner choices as preferences; classify ambiguity, completeness, risk, reversibility, evidence/context, latency/cost; select the lowest sufficient available capability tier; omit fitting overrides.

Never assume a model ID or that `high`, `xhigh`, `max`, or another reasoning label exists. Capability-check both fields at runtime.

### Owner Capacity Signal

On the owner's first CTO interaction of their local calendar day, ask once: `Should I plan delegated work around conservative capacity, or do you expect to use available capacity today or this week?`

- Ask once, never block/repeat. Missing answer means one worker at a time. Never claim quota/reset visibility or control.
- After risk/availability classification, use it only for tier, reasoning, concurrency, and duration; never lower risk or expand authority.
- Reserve optional higher-cost or long-running parallel work for stated capacity; high-risk work still receives the strongest suitable lane even under conservative capacity.
- Keep the signal in the current CTO control context. Do not create a recurring automation or durable account-usage record unless the owner explicitly requests it.

### Capability Tiers

- Fast/economical: mapping, intake, deterministic docs/tests/evidence/screenshots, simple CI.
- Balanced: bounded implementation, normal review, CI repair, moderate integration.
- Strongest reasoning-capable: ambiguous architecture, security/privacy, migration/public contracts, high-scale/release/cross-product decisions, final high-risk review.

When the current host exposes the 5.6 capability family, map its runtime classes after inventory:

- Luna-class: monitoring/mapping/deterministic evidence/screenshots/docs/tests/simple CI; `low` or synthesis `medium`.
- Terra-class: PO execution/bounded implementation/ordinary review/CI/integration; `medium` or ambiguous `high`.
- Sol-class: release/critical review/security/architecture/migrations/contracts/regressions/conflicts/topology/owner decisions; supported `high`/`xhigh`.

These are current capability-class aliases, not permanent model IDs or reusable configuration values. If the host exposes different names, preserve the same risk/cost tiers. Use reasoning above `xhigh` only when the owner explicitly requests it or concrete failed proof shows `xhigh` is insufficient.

Allocation changes capability, not authority. A Sol-class assignment for topology recovery or release judgment still inherits protected-thread, mutation, and owner-approval gates from the governing role.

For final high-risk review, keep the strongest suitable lane as reviewer. Do not downgrade the final reviewer merely for model diversity; add an independent second pass only when variance reduction materially justifies its cost.

Portfolio sweeps use low/medium; product heartbeats medium. Escalate only for listed risk. Screenshots and bounded official research stay fast unless judgment is complex.

### Escalation And De-Escalation

Escalate after concrete ambiguity, failed proof, inadequate implementation, or higher risk; do not brute-force an underpowered lane. De-escalate after planning or deterministic proof removes uncertainty.

Classify repeated retries or weak evidence caused by the assigned lane as `wrong model/reasoning allocation`, then reassess availability and tier.

If unavailable, preserve risk tier and choose its nearest class/reasoning. Never downgrade high-risk judgment for a name; cross tiers only when necessary. Keep equivalent substitutions quiet; report meaningful change:

```text
Requested: <model/reasoning>
Available constraint: <missing model or unsupported reasoning>
Fallback: <selected capability tier and supported reasoning>
Impact: <none or evidence/risk difference>
```

If the strongest available fallback cannot meet the evidence or reliability required for a high-risk final recommendation, fail closed: return the capability/proof gap and withhold that recommendation. A weaker fallback may map evidence or prepare options, but it must not present the gated judgment as complete.

## Planning Before Allocation

Front-load scope into the issue and delegation prompt so execution does not spend tokens rediscovering the plan:

- exact repo/path and issue,
- branch/base and allowed files,
- acceptance criteria and non-goals,
- validation and screenshot/live-proof needs,
- risks, hard gates, output format, and stop condition.

Fully planned bounded work uses the lowest sufficient tier; decision-shaping work stays with parent or a stronger tier.

## Skill Routing

Assign one lane and the narrowest skill/reference:

- Plugin: `$wp-plugin-expert` plus one plugin reference.
- Theme/FSE: `$wp-theme-expert` plus one theme reference.
- Site/UX/search: `$wp-site-expert` plus one site reference.
- Contribution: `$wp-contributor` plus the Core, Gutenberg, or Meta reference.
- Design: `design-intelligence-routing.md`, then the narrow Product Design capability.
- Portfolio: `$wp-portfolio-cto`; product execution remains in PO/worker lanes.
- Product workflow: `$wp-product-orchestrator`; implementation routes to a specialist.
- Product/release documentation: `$wp-product-docs-writer` for factual README, `readme.txt`, changelog, release-note, upgrade-notice, and synchronization work.
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

Reusable `.codex/agents/*.toml` must not pin transient models/reasoning. Inherit by default or materialize from live inventory.

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

Keep concurrency conservative and reduce it further when the capacity signal is missing or conservative:

```toml
[agents]
max_threads = 3
max_depth = 1
```

Raise concurrency only after proof; keep depth one unless nested review is deliberate.

## Hooks Boundary

Use hooks for deterministic project lifecycle checks such as generated artifacts, formatting, explicit PR base, or validation metadata. Do not use hooks for expertise selection, broad research, or dynamic model assignment.

## Parent Checklist

Before delegation: verify availability, choose the capability tier, front-load the plan, set one lane/output budget, prefer read-only unless exact fixing is assigned, and avoid duplicate exploration.

Keep payloads compact: do not batch broad parallel thread reads, full PR diffs, oversized issue bodies, or accumulated automation history. Create issues one at a time with concise bodies after narrow duplicate-screening.

After return: merge findings rather than transcripts, verify high-risk claims, reassess whether escalation/de-escalation is warranted, and keep commits/PRs parent-owned.
