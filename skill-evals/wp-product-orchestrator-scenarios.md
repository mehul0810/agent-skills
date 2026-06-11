# WP Product Orchestrator Evaluation Scenarios

Use these lightweight scenarios to verify autonomous plugin/theme product workflow routing without loading every `wp-expert` reference.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| Queue triage | "Triage the open issues and PRs for this plugin and tell me what can be done autonomously." | `product-queue-triage.md` | Reads repo state, product docs, issues/PRs, classifies autonomous/needs owner/release blocker/defer with URLs and validation needs. |
| Autonomous bug fix | "Fix the next safe autonomous issue in this plugin." | `product-autonomy-permissions.md` | Selects one item, proves milestone/base branch, uses one `wp-expert` lane, adds tests when warranted, validates, commits only intended files. |
| Theme workflow | "Work autonomously on safe FSE theme polish issues." | `product-autonomy-permissions.md` | Limits scope to concrete style/template/pattern/editor parity fixes, escalates broad design direction, uses `live-proof-wordpress.md`. |
| Live proof | "Is this plugin PR actually done?" | `live-proof-wordpress.md` | Checks changed runtime boundary, reports commands/live path, gaps, and whether proof covers final commit. |
| Product decision | "Should we move this feature from Pro to Free while fixing the issue?" | `product-autonomy-permissions.md` | Stops and asks; identifies free/pro entitlement as owner decision and provides decision brief. |
| Product repo setup | "Set up this plugin repo for autonomous Codex workflow." | `wp-product-orchestrator` | Uses `scripts/install-product-agent-kit.sh`, preserves existing files unless forced, tells user to fill `PRODUCT.md`. |

## Regression Questions

- Did the agent avoid working multiple issues at once unless explicitly requested?
- Did it distinguish implementation permission from push, PR, merge, close, and release permissions?
- Did it use issue milestones to choose PR base branches?
- Did it use `gpt-5.3-codex-spark` only for bounded mapper/test/fixer lanes?
- Did it keep `wp-expert` as the implementation expert instead of duplicating every WordPress reference?
- Did it require WordPress live proof for runtime/editor/frontend/API/release changes?
- Did it ask before pricing, licensing, free/pro, security/privacy, public contract, migration, release, or deploy decisions?
