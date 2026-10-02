# Project Subagent Routing Discipline

Use for project subagents and model/reasoning allocation. Route at runtime; avoid global hooks or permanent model IDs.

## Goal

Reduce wall time and token cost without weakening evidence. The parent owns strategy, boundaries, final decisions, validation synthesis, commits, pushes, and PRs. Subagents own bounded mapping, review, evidence, or narrow implementation.

## Delegation Gate

Delegate when parallel mapping, independent lanes, second review, or browser/CI evidence saves time or risk. Keep small edits inline; never delegate unplanned broad mutation or bypass trust/approval controls.

## Availability-First Routing Contract

At each delegation, verify runtime availability and the reviewed versioned policy identified by `contracts/routing-policy.json`. Its canonical owner is agent-loop's `policies/model-routing.json`; do not duplicate fixed role/model assignments in skills. The October 2 descriptor is a proposal until adoption is reviewed. Existing explicit user locks and active configuration stay in force meanwhile.

Assess complexity, uncertainty, consequence, evidence quality, tool/context needs, latency and budget. Select model capability and reasoning independently from the supported authorized set. Role names describe responsibilities and conservative defaults, not permanent models. A deterministic consequential check can need a capable model with low effort; ambiguous implementation can need a stronger model with high effort. A default effort is not a floor after evidence removes uncertainty. Verify supported reasoning at runtime. Use xhigh only with concrete task justification. Never use max/ultra without explicit owner approval; the current executable policy does not select them.

Explicit model and effort locks are hard constraints. If the required combination is unavailable or insufficient, stop only that assignment and ask the owner; do not silently fall back. Runtime exposure, inherited settings, relative cost ranks and this guidance do not authorize another model or spending. Model selection changes capability, not authority.

### Capacity And Concurrency

Verify each route's feasibility before reserving capacity. Held work consumes no slot; continue independent feasible work. Use one worker at a time as a conservative starting point, then choose concurrency proportionally to independent work, coordination cost, consequence and verified runtime support. Preserve one writer per product/artifact and independent consequential review. Do not claim quota/reset visibility or control. Do not ask for a daily capacity signal. Ask only when a specific task materially benefits from a capacity/cost decision the owner must make. Do not create a recurring automation or durable account-usage record without explicit instruction.

### Work Classification

Use current evidence rather than title or role stereotypes. Preserve high-consequence capability floors, explicit locks, tool/context support, budget and owner/security/release gates. Missing metadata is unavailable, not proof of support. An unavailable judgment can hold while separately useful evidence work continues. Compare accepted outcomes, retries, latency and actual available telemetry before claiming savings.

### Escalation And De-Escalation

Escalate for concrete complexity, unresolved ambiguity or failed reasoning; de-escalate effort after planning or deterministic proof removes uncertainty. Access, approval, policy, stale inputs and tool outages need their own recovery, not a stronger model. Escalation-only models require the canonical policy's explicit eligible record. A held assignment reports the requested combination, support constraint, impact and next action in plain language.

Retry advice is bounded by cause and lifetime attempts. Correct reasoning failures before reviewed requeue; a work item's claimed reviewer is not authenticated approval. Preserve source history, stop on exhausted budgets and keep all side-effect gates. Never reset attempts to hide failed work.

## Planning Before Allocation

Give workers outcomes and constraints; let them choose routine execution steps. Reuse established plans; keep tiny tasks inline. Supply:

- exact repo/path and issue,
- branch/base and allowed files,
- acceptance criteria and non-goals,
- validation and screenshot/live-proof needs,
- risks, hard gates, output format, and stop condition.

For code work, include the proportional quality contract from `../../wp-expert/references/planning-drift-control.md`: ownership/contracts, modularity/maintainability and scalability boundary, performance hot path/budget, security/privacy boundary, tests/proof, and rollback. Workers execute that contract and return a quality receipt; they do not spend the execution turn rebuilding an omitted plan.

Fully planned work uses the reviewed authorized policy and current evidence; explicit locks remain binding. Compare quality, retries, duration, and available token telemetry before claiming savings.

### Worker Context Boundary

Prefer a compact task packet with exact evidence pointers. Choose the smallest inherited slice that preserves dependencies and decisions; use no inherited turns for an independent bounded task. A full-history fork requires a concrete continuity need or explicit user instruction, verified headroom and a scoped output budget. Context limits are proportional to the next phase, not a fixed number of references. Preserve constraints, uncertainty and evidence during reduction.

## Skill Routing

Start with the narrowest relevant skill/reference; add sources when the task crosses contracts or needs evidence:

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
Start with the named skill/reference lane; load additional sources when evidence or cross-contract work requires them.
Inspect the exact artifact first. Stay inside scope; subdelegate only when the parent explicitly authorizes a bounded independent role and capacity budget.
Return the outcome with evidence, material uncertainty, validation and actionable blockers; scale detail and format to the task.
Convert Product Design feedback into acceptance criteria, design QA checks, or adjacent findings.
If blocked, report recovery attempted and the exact proof gap.
Do not modify files unless assigned as a narrow fixer.
Keep output within the requested limit.
```

## Reusable Project Profiles

Use the five optional [project agent templates](../../templates/project-agents/README.md): planner, implementer, reviewer, behavior validator, and release readiness. PO coordinates; CTO escalates. Select only needed roles, pass compact packets, and keep review independent. Templates must not pin transient models/reasoning; verify availability and assign both at dispatch when inheritance is unsuitable. They do not create persistent tasks or automations.

## Project Configuration

Keep concurrency proportional; one worker at a time is the conservative starting point. Increase only when the task justifies the coordination and cost and runtime availability is verified:

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
