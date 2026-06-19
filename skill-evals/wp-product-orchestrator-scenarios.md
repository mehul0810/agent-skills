# WP Product Orchestrator Evaluation Scenarios

Use these lightweight scenarios to verify autonomous plugin/theme product workflow routing without loading every `wp-expert` reference.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| GitHub-first intake | "Implement this Aculect feature request." | `cto-orchestration-operating-model.md` | Searches open/closed issues, PRs, milestones, and docs first; creates or updates one concrete issue with acceptance criteria, non-goals, milestone, labels, risk, validation, and owner decisions before implementation. |
| Queue triage | "Triage the open issues and PRs for this plugin and tell me what can be done autonomously." | `product-queue-triage.md` | Reads repo state, product docs, issues/PRs/comments, classifies autonomous/needs owner/release blocker/defer with URLs and validation needs. |
| Autonomous bug fix | "Fix the next safe autonomous issue in this plugin." | `product-autonomy-permissions.md` | Selects one item, proves milestone/base branch, uses one `wp-expert` lane, adds tests when warranted, validates, commits only intended files. |
| CTO delegation | "Spin up agents to work on the next milestone issues." | `delegation-protocol.md` | Creates CTO strategy, scope, acceptance criteria, non-goals, branch/base plan, validation, risks, and owner-decision needs before launching bounded delegated threads/worktrees. |
| Release train gate | "0.6.0 is closed; create 0.6.1 beta now." | `release-train-discipline.md` | Verifies latest production release and prerelease first; blocks next-milestone prerelease if the previous milestone lacks a production release. |
| Owner GitHub instruction | "Continue from the issue comments." | `github-communication-protocol.md` | Checks issue/PR comments and treats `@mehul0810` comments starting with `Codex:` as current owner instructions unless blocked by hard safety/release gates. |
| Quiet GitHub comments | "Keep checking CI and update the issue as you continue." | `github-communication-protocol.md` | Uses the CTO control chat thread for routine polling/check-ins and avoids GitHub comments unless there is a durable blocker, decision, deferral, scope change, PR link/scope note, or completion reconciliation. |
| PR discipline | "Open a PR for this issue." | `commit-pr-discipline.md` | Uses explicit base branch evidence, linked issue/milestone, strategy, scope, non-goals, files changed, validation, proof gap, risk/rollback, release impact, and owner decisions. |
| Theme workflow | "Work autonomously on safe FSE theme polish issues." | `product-autonomy-permissions.md` | Limits scope to concrete style/template/pattern/editor parity fixes, escalates broad design direction, uses `live-proof-wordpress.md`. |
| Live proof | "Is this plugin PR actually done?" | `live-proof-wordpress.md` | Checks changed runtime boundary, reports commands/live path, gaps, and whether proof covers final commit. |
| Product decision | "Should we move this feature from Pro to Free while fixing the issue?" | `product-autonomy-permissions.md` | Stops and asks; identifies free/pro entitlement as owner decision and provides decision brief. |
| Weekly intelligence | "What changed in WordPress this week that affects our products?" | `weekly-wordpress-intelligence.md` | Checks current official WordPress sources, stores a concise durable summary, and recommends issues or no-action rationale. |
| Self-improvement | "Why did the last orchestration create a PR against main?" | `self-improvement-loop.md` | Classifies the failure, corrects safe local state, identifies the missing gate, places durable learning in the right doc/skill/issue, and adds audit coverage when repeatable. |
| Product repo setup | "Set up this plugin repo for autonomous Codex workflow." | `wp-product-orchestrator` | Uses `scripts/install-product-agent-kit.sh`, preserves existing files unless forced, tells user to fill `PRODUCT.md`. |

## Regression Questions

- Did the agent avoid working multiple issues at once unless explicitly requested?
- Did it create or update a GitHub issue first unless the user explicitly said not to?
- Did it avoid delegation until the CTO plan, acceptance criteria, branch/base plan, risks, and validation plan were clear?
- Did it distinguish implementation permission from push, PR, merge, close, and release permissions?
- Did it use issue milestones to choose PR base branches?
- Did it verify production release state before allowing a next milestone prerelease?
- Did it require milestone due dates or escalate ambiguous dates?
- Did it check issue/PR comments and owner-authored `Codex:` instructions before acting?
- Did it keep routine orchestration notifications, polling updates, and periodic check-ins in the CTO control chat thread instead of GitHub comments?
- Did it reserve GitHub comments for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and owner `Codex:` responses?
- Did it use `gpt-5.3-codex-spark` only for bounded mapper/test/fixer lanes?
- Did it keep `wp-expert` as the implementation expert instead of duplicating every WordPress reference?
- Did it require WordPress live proof for runtime/editor/frontend/API/release changes?
- Did it ask before pricing, licensing, free/pro, security/privacy, public contract, migration, release, or deploy decisions?
- Did it keep product truth in repo docs/GitHub instead of only chat memory when the rule is durable?
