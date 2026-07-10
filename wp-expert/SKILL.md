---
name: wp-expert
description: Router for ambiguous WordPress work. Use when explicitly requested or unclear whether the task belongs to wp-plugin-expert, wp-theme-expert, wp-site-expert, wp-portfolio-cto, wp-product-orchestrator, wp-contributor, or content-writer; clear tasks should trigger the specialist directly.
---

# WP Expert

Use this skill as the thin WordPress engineering router. Prefer the narrow specialist skill whenever the task intent is clear; keep this hot path small so expertise is loaded only when needed.

## Route First

- Auto-select the specialist by the task's primary artifact or outcome. Stop after routing when the specialist is clear; do not load the routing map or broad references.
- Plugin/product code, REST APIs, admin screens, custom tables, WordPress.org plugin releases, Composer/npm tooling, CI, tests, security, performance, or plugin troubleshooting: use `wp-plugin-expert`.
- Themes, block themes, FSE, `theme.json`, templates, patterns, block styles, custom blocks, design-to-theme builds, visual parity, Ollie, Blocksy, or editor/frontend parity: use `wp-theme-expert`.
- Whole-site work, landing pages, conversion flows, UX/IA, content architecture, SEO/AEO/GEO, analytics, accessibility, responsive polish, performance, or premium visitor/admin experience: use `wp-site-expert`.
- Cross-product portfolio governance, portfolio heartbeats, product-thread health, release conflicts across products, owner portfolio briefs, or shared process/skill self-improvement: use `wp-portfolio-cto`.
- One product's backlog strategy, GitHub issue intake, milestones, release train, delegation, product heartbeat, PR synthesis, or release-ready brief: use `wp-product-orchestrator`.
- WordPress Core, Meta, Gutenberg, Trac, upstream patches, contributor docs, or official contribution workflow: use `wp-contributor`.
- Organic-search writing, briefs, drafts, content refreshes, AI Overview/AEO/GEO writing: use `content-writer`.

## Universal Rules

- Start with repo facts, not assumptions: current directory, Git root, WordPress root, active branch, dirty files, plugin/theme entry points, build scripts, and deployment target.
- Preserve user work. Never reset or discard unrelated changes unless explicitly asked.
- Load one primary reference first. Add one supporting reference only for a confirmed risk; more requires a written reason.
- Use `references/reference-routing-map.md` only when the correct specialist or primary reference is ambiguous.
- Use `references/architecture-decision-gate.md` for substantial build/review work so ownership, source of truth, release state, public contracts, security, performance, and proof are explicit.
- Use `../shared/references/research-token-discipline.md` only for web-heavy, drift-prone, ambiguous, or broad exploration.
- Use `../shared/references/context-window-discipline.md` when context is high or the task may need compact vs fresh-thread routing.
- Use `../shared/references/session-continuity-pr-discipline.md` for new chats, resumed repo work, release branches, issues/PRs, and branch/PR creation. Never create a PR until the intended base branch is proven and passed explicitly.
- Use `../shared/references/project-subagent-routing.md` for project subagents, skill routing, and availability-first model/reasoning allocation.
- Use `../shared/references/production-dependency-discipline.md` only for Composer/npm packaging, CI artifacts, release ZIP/SVN, deploy, or production dependency verification.
- Use `../shared/references/live-proof-wordpress.md` before claiming WordPress runtime, editor, frontend, external integration, or release behavior is complete.
- Apply enterprise/WPVIP standards by default: modular, performant, secure, maintainable, accessible, observable where useful, and covered by appropriate tests for meaningful behavior or risk.
- Validate with the cheapest reliable proof that reaches the changed boundary; disclose unrun checks.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation policy authorizes it.

## WordPress Hard Gates

- Capability checks authorize actions; nonces only reduce CSRF.
- Validate/sanitize input on ingress and escape output at the final boundary.
- Use `$wpdb->prepare()` for dynamic SQL values and whitelist identifiers/order clauses.
- Every REST route needs a meaningful `permission_callback`; avoid `admin-ajax.php` for new REST-fit work.
- Avoid large or volatile autoloaded options, repeated hot option writes, unbounded queries, and filesystem-persistence assumptions on cloud/VIP-style environments.
- Preserve backward compatibility for launched/public contracts and real production/client data; do not add shims for abandoned intermediate shapes of unreleased work.
- Use the lowest stable actively maintained non-EOL runtime/tool versions that satisfy WordPress, host/VIP, dependency, and deployment constraints.
- Never expose secret keys, API tokens, private salts, customer PII, or sensitive payloads in public surfaces.

## Output

- Reviews: findings first with severity, file/line references, concrete impact, then questions or testing gaps.
- Implementation: solution, changed files, validation commands/results, residual risk, and next step only when useful.
- Plans: recommended path, tradeoffs, acceptance checks, validation, rollout/backout, and owner decisions only when real gates exist.
