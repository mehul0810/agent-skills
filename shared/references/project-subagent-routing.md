# Project Subagent Routing Discipline

Use for project subagents and model/reasoning allocation. Route at runtime; avoid global hooks or permanent model IDs.

## Goal

Reduce wall time and token cost without weakening evidence. The parent owns strategy, boundaries, final decisions, validation synthesis, commits, pushes, and PRs. Subagents own bounded mapping, review, evidence, or narrow implementation.

## Delegation Gate

Delegate when parallel mapping, independent lanes, second review, or browser/CI evidence saves time or risk. Keep small edits inline; never delegate unplanned broad mutation or bypass trust/approval controls.

## Availability-First Routing Contract

At each delegation, verify runtime availability and follow the current owner model-allocation policy; it overrides older capability-family guidance. Classify ambiguity, completeness, risk, reversibility, evidence/context, latency, and cost before selecting a supported reasoning level. Runtime exposure or inherited settings do not authorize another model.

Current owner allocation: use GPT-6 Luna for implementation, fixes, tests, and routine evidence work; use GPT-6 Sol for orchestration, planning, frontend work, and high-risk final review. Frontend takes precedence over the general implementation lane. Do not select another model for a task, worker, reviewer, retry, or automation without the owner's explicit approval for that assignment. If the required model is unavailable, stop only that assignment and ask the owner; do not silently fall back.

Use low reasoning for routine deterministic work, medium by default, and high for ambiguity or consequential risk. Use xhigh only with concrete complexity or failed-proof justification. Never use max/ultra without explicit owner approval. Verify supported reasoning at runtime; prose cannot change a running task's model or effort.

### Owner Capacity Signal

On the owner's first CTO interaction of their local calendar day, ask once: `Should I plan delegated work around conservative capacity, or do you expect to use available capacity today or this week?`

- Ask once, never block/repeat. Missing answer means one worker at a time. Never claim quota/reset visibility or control.
- After risk/availability classification, use it only for tier, reasoning, concurrency, and duration; never lower risk or expand authority.
- Reserve optional higher-cost or long-running parallel work for stated capacity; high-risk final review still uses owner-approved GPT-6 Sol with supported reasoning regardless of the capacity signal.
- Keep the signal in the current CTO control context. Do not create a recurring automation or durable account-usage record unless the owner explicitly requests it.

### Work Classification

Classify work to choose among the owner-approved lanes, not to invent model substitutions: Luna handles monitoring, mapping, deterministic evidence, screenshots, docs, tests, simple CI, fixes, and implementation; Sol handles orchestration, planning, frontend work, and high-risk final review. Keep routine security lint or dependency review in the normal lane; security model specialization requires explicit owner approval for the task. Model selection changes capability, not authority.

Portfolio sweeps use low/medium; product heartbeats use medium. Escalate reasoning only for listed ambiguity or risk. Screenshots and bounded official research stay low-effort unless judgment is consequential.

### Escalation And De-Escalation

Escalate reasoning after concrete ambiguity, failed proof, inadequate implementation, or higher risk; do not brute-force an underpowered lane. De-escalate after planning or deterministic proof removes uncertainty.

Classify repeated retries or weak evidence caused by the assigned lane as `wrong model/reasoning allocation`, then reassess availability and tier.

If the owner-approved model or a needed reasoning level is unavailable, do not substitute another model. Ask the owner before that assignment; meanwhile, continue independent work that does not depend on it. Do not report an unapproved fallback as completed:

```text
Requested: <model/reasoning>
Available constraint: <missing model or unsupported reasoning>
Fallback: none; awaiting owner direction
Impact: <blocked assignment and independent work that can continue>
```

Withhold a judgment when its required reviewer/model or evidence is unavailable. A separately authorized bounded evidence task may continue only when it is independently useful and does not imply the gated judgment is complete.

## Planning Before Allocation

Give workers outcomes and constraints; let them choose routine execution steps. Reuse established plans; keep tiny tasks inline. Supply:

- exact repo/path and issue,
- branch/base and allowed files,
- acceptance criteria and non-goals,
- validation and screenshot/live-proof needs,
- risks, hard gates, output format, and stop condition.

For code work, include the proportional quality contract from `../../wp-expert/references/planning-drift-control.md`: ownership/contracts, modularity/maintainability and scalability boundary, performance hot path/budget, security/privacy boundary, tests/proof, and rollback. Workers execute that contract and return a quality receipt; they do not spend the execution turn rebuilding an omitted plan.

Fully planned work uses the owner-approved model lane and supported reasoning appropriate to the task; do not select another model because a capability tier or inherited setting appears to fit. Compare quality, retries, duration, and available token telemetry before claiming savings.

### Worker Context Boundary

Default model-routed workers to no inherited turns and provide a compact task packet. If continuity is necessary, pass only the smallest recent-turn slice that carries required evidence. Never use a full-history worker fork: long control-thread history, tool transcripts, and repeated cached context can exhaust a model-specific allowance without improving the bounded result.

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

Use the five optional [project agent templates](../../templates/project-agents/README.md): planner, implementer, reviewer, behavior validator, and release readiness. PO coordinates; CTO escalates. Select only needed roles, pass compact packets, and keep review independent. Templates must not pin transient models/reasoning; verify availability and assign both at dispatch when inheritance is unsuitable. They do not create persistent tasks or automations.

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

For compaction/resume, use the context-window contract and optional [project hooks](../../templates/project-hooks/README.md). Verify supported events, trust and observed invocation. Keep hooks bounded, non-recursive and source-preserving; no global install, permission bypass, transcript scraping or silent context/model mutation. A configured hook is not proof it ran.

## Parent Checklist

Before delegation: verify availability, select only an owner-approved model/reasoning combination, front-load the plan, set one lane/output budget, prefer read-only unless exact fixing is assigned, and avoid duplicate exploration.

Keep payloads compact: do not batch broad parallel thread reads, full PR diffs, oversized issue bodies, or accumulated automation history. Create issues one at a time with concise bodies after narrow duplicate-screening.

After return: merge findings rather than transcripts, verify high-risk claims, reassess whether escalation/de-escalation is warranted, and keep commits/PRs parent-owned.
