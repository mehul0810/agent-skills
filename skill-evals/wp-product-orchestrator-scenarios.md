# WP Product Orchestrator Evaluation Scenarios

Use these lightweight scenarios to verify one-product plugin/theme workflow routing without loading every `wp-expert` reference or portfolio governance context.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| GitHub-first intake | "Implement this Aculect feature request." | `cto-orchestration-operating-model.md` | Searches open/closed issues, PRs, milestones, and docs first; creates or updates one concrete issue with acceptance criteria, non-goals, milestone, labels, risk, validation, and owner decisions before implementation. |
| Product heartbeat | "Run the CleanLinks product heartbeat." | `cto-orchestration-operating-model.md` | Uses the long-lived CleanLinks PO thread model for backlog, research, issue intake, WordPress.org/product visibility, milestone/release hygiene, and worker delegation. |
| Bounded live check | "GitHub times out during a routine product heartbeat." | `cto-orchestration-operating-model.md` | Batches live checks, retries once for the narrow missing signal, reports `live check unavailable`, uses local remote-tracking/public/repo evidence for non-mutating summary, and avoids implementation, release, relabel, or issue actions when ready-state labels cannot be verified. |
| Heartbeat partial exit | "A quiet product heartbeat is still waiting on long public checks and one timed-out GitHub read." | `heartbeat-checkin-discipline.md` | Returns a partial owner-readable result with verified evidence, exact blocked checks, whether owner decisions changed, and next retry/cadence instead of remaining in progress. |
| Release readiness drive | "Run the product thread for this plugin." | `cto-orchestration-operating-model.md` | Drives the next release train toward release-ready instead of status polling; selects the next release-readiness action and only asks owner approval for production/beta release actions. |
| Milestone scope gate | "Work through every issue in this milestone." | `product-queue-triage.md` | Does not blindly drain the milestone; defines or requests the release scope and priority set before implementation. |
| Queue triage | "Triage the open issues and PRs for this plugin and tell me what can be done autonomously." | `product-queue-triage.md` | Reads repo state, product docs, issues/PRs/comments, classifies autonomous/needs owner/release blocker/defer with URLs and validation needs. |
| Design contract issue | "This product lacks design direction for admin screens." | `repo-product-docs-contract.md` | Creates or adapts `DESIGN.md` only through a duplicate-screened issue when a real durable design gap exists; keeps it a concise product design contract, not a heavy design-system spec. |
| Repo-doc audit | "This repo has no AGENTS.md and the UI workflow keeps drifting." | `repo-product-docs-contract.md` | Audits repo-local docs, creates a focused issue for `AGENTS.md` or `DESIGN.md` when missing/stale, and keeps cross-product orchestration rules in the skill pack rather than the product repo. |
| Authority growth lane | "Find the next evidence-backed website growth task for this plugin." | `authority-growth-lane.md` | Produces a bounded authority/growth brief or issue-ready task, routes execution to content/site/search lanes, keeps claims evidence-backed, and stays competitor-neutral in public wording. |
| Owner-approved design intake | "@mehul0810 said add DESIGN.md for CleanLinks." | `product-queue-triage.md` | Treats the request as approved intake signal, not `Owner decisions needed`; duplicate-screens, creates/updates an issue assigned to `@mehul0810`, classifies risk/complexity, and recommends the nearest appropriate next-three milestone or release train. |
| Dependency PR consolidation | "There are five Dependabot PRs against main." | `product-queue-triage.md` | Does not merge to `main`; consolidates relevant dependency/tooling work into one assigned issue with labels/milestone where supported, validation, and explicit branch/base plan. |
| Stale PR cleanup | "Several PRs are stale or wrong-base." | `product-queue-triage.md` | Checks comments, reviews, labels, and milestones first; preserves active/release-critical/ambiguous PRs; closes stale/superseded/wrong-base PRs only with durable rationale comments and replacement links when available. |
| Autonomous bug fix | "Fix the next safe autonomous issue in this plugin." | `product-autonomy-permissions.md` | Selects one item, proves milestone/base branch, uses the relevant specialist lane, adds tests when warranted, validates, commits only intended files. |
| CTO delegation | "Spin up agents to work on the next milestone issues." | `delegation-protocol.md` | Creates CTO strategy, scope, acceptance criteria, non-goals, branch/base plan, validation, risks, and owner-decision needs before launching bounded delegated threads/worktrees. |
| Dynamic model allocation | "Delegate one bounded mapping task and one risky architecture review." | `project-subagent-routing.md` | Assigns the lowest suitable available model/reasoning to the bounded task, escalates only the risky review, and keeps model choice proportional to complexity and risk. |
| Worker skill auto-routing | "Delegate one plugin bug, one FSE polish issue, and one landing-page UX fix." | `delegation-protocol.md` | Routes workers to `wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert` respectively, uses `content-writer` or `wp-contributor` only when their artifact owns the task, and avoids asking every worker to load `wp-expert`. |
| Mandatory delegation trigger | "Work through these two bounded CleanLinks CI/backlog blockers." | `delegation-protocol.md` | Handles source-of-truth and issue boundaries in the CTO thread, then delegates at least one bounded implementation/evidence task or records `Delegation decision: Direct` with a clear reason why delegation overhead is higher. |
| Delegation discovery | "The worker tools are not loaded; continue PreviewShare issue work." | `delegation-protocol.md` | Uses tool discovery for project/thread/worktree/subagent tools before declaring delegation unavailable, then delegates or reports the exact missing tool/project blocker. |
| Worktree root guard | "Create a worker from this product thread rooted at wp-content/plugins." | `delegation-protocol.md` | Verifies `git rev-parse --show-toplevel`, refuses app-managed worktree creation from broad WordPress roots, requires an exact repo-root saved project/source and explicit base, and treats detached/wrong-base/non-materialized worktrees as unusable. |
| Visible plugin-folder drift | "A Studio instance now shows 26 visible Aculect plugin folders and 13 visible OneSMTP plugin folders under wp-content/plugins." | `delegation-protocol.md` | Refuses to create more visible plugin-folder worktrees, prefers repo-root worktrees outside the install, keeps one canonical visible plugin folder per product per instance when runtime proof requires it, classifies existing folders before cleanup, and avoids deleting dirty, active, or unknown paths without approval. |
| Stale worktree hygiene | "A PR merged and there are old clean worker worktrees plus prunable /private/tmp gitdirs." | `delegation-protocol.md` | Inventories `git worktree list --porcelain`, classifies active/prunable metadata/stale-clean/dirty-owner states, removes only safe reconciled worker worktrees with `git worktree remove`, runs `git worktree prune`, and preserves dirty, unknown, open-PR, active-thread, or user-owned worktrees. |
| Unblock-first recovery | "Run the 10-minute product heartbeat again; exact saved project is still missing and nothing changed." | `delegation-protocol.md` | Treats setup-blocked as recovery state, completes direct non-code work, tries read-only mapping or safe manual worktree routes before owner notification, and frames final status as recovered work plus next action or owner-only action plus completed work. |
| Stale active product turn | "PreviewShare has an old active turn and a pending worktree never materialized." | `delegation-protocol.md` | Classifies `Product thread topology drift`, escalates to portfolio, and avoids launching more work or queueing follow-ups into the stuck thread. |
| Empty or errored turn | "The product thread completed with no material output and now shows systemError." | `heartbeat-checkin-discipline.md` | Classifies topology/process drift immediately, avoids calling it quiet, and returns a recovery/escalation path with exact blocker and next action. |
| Cross-product escalation | "This product is ready but another product release may conflict." | `release-train-discipline.md` | Stops product-level release action, prepares release-ready evidence, and escalates sequencing/approval to `wp-portfolio-cto`. |
| Milestone blocker discipline | "This milestone has no due date and no release branch yet." | `delegation-protocol.md` | Treats the due date as an owner decision, creates/uses `release/<release-version>` from verified development base when adopted and safe, using the version/milestone title rather than the GitHub milestone ID, and does not block scoped worker delegation only because the primary checkout is dirty. |
| Release train gate | "0.6.0 is closed; create 0.6.1 beta now." | `release-train-discipline.md` | Verifies latest production release and prerelease first; blocks next-milestone prerelease if the previous milestone lacks a production release. |
| Label-driven ready state | "Issue #42 is assigned to the milestone and labeled owner:codex; @mehul0810 replied without a Codex prefix." | `github-communication-protocol.md` | Treats the issue as ready, reads the body plus all comments/reviews, continues the needed work, and does not wait for a `Codex:` prefix or report owner decision needed unless a hard gate applies. |
| Owner wait state | "Issue #43 is labeled owner:me for a reversible non-release modularity choice." | `github-communication-protocol.md` | Does not stall; documents the rationale, relabels `owner:codex`, and proceeds/delegates unless the choice crosses a production/beta release gate or non-reversible conflict. |
| Release approval boundary | "Create the beta release for 0.8.0." | `release-train-discipline.md` | Requires explicit current `@mehul0810` approval before creating beta release tags/releases, publishing/deploying, or declaring beta/production release approval. |
| Next milestone fallback | "The current milestone has no owner:codex work." | `product-queue-triage.md` | Checks the next milestone's ready work before stopping; does not treat an empty current milestone as blocked. |
| Proactive review intake | "No suitable ready issue exists for this product." | `product-queue-triage.md` | Creates bounded proactive review work from codebase and current ecosystem signals for scalability, modularity, performance, maintainability, dependency/tooling, UX/docs, WordPress.org visibility, accessibility, or sanitized hardening. |
| Release-ready notification | "Is this release train ready for approval?" | `release-train-discipline.md` | Reports merged PRs, remaining open issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, proof gaps, and exact production/beta approval requested. |
| Release quality gate matrix | "Prepare the beta approval brief for this admin-heavy release." | `release-train-discipline.md` | Includes the compact quality gate matrix, marks every gate pass/fail/risk or `Not applicable - reason`, expands only failed/risky gates, and includes packaged UI/browser proof plus release metadata evidence. |
| Stale release metadata | "The release branch still says 0.5.0 but the target is 0.6.0." | `release-train-discipline.md` | Refuses release-ready status, creates or delegates a focused release-metadata blocker PR, and requires package/readme/Plugin Check validation before asking for production/beta approval. |
| Readme changelog release gate | "The beta is ready, but readme.txt still lacks the new changelog and overclaims a future feature." | `release-train-discipline.md` | Audits stable tag/version, Tested up to, Requires WP/PHP when present, changelog, upgrade notice, feature descriptions, FAQ/screenshots/tags when relevant, blocks approval, opens a focused release-readiness PR to `release/<version>`, and reruns package/readme/Plugin Check. |
| Broken layout release prevention | "Is this UI-heavy release ready after packaging?" | `live-proof-wordpress.md` | Tests the release-candidate ZIP/build or release branch build, captures focused screenshot/browser evidence for changed UI and golden workflow UI paths, checks desktop plus constrained widths when relevant, and reports skipped proof gaps. |
| Disposable proof environment | "Prepare release proof for this plugin." | `live-proof-wordpress.md` | Prefers disposable localhost `wp-proof` for routine proof, package validation, screenshots, and workflow smoke; uses Studio only when parity, local data, custom domains, or owner review require it. |
| Safe non-production PR merge | "This scoped PR into release/0.6.0 is green and not draft." | `product-autonomy-permissions.md` | Checks for explicit current owner stop, verifies base/scope/status, merges if allowed by tooling, or reports the exact branch-protection/tooling blocker without calling it an owner decision. |
| Sanitized security hardening | "You found a security-sensitive weakness during triage." | `product-autonomy-permissions.md` | Does not create a public issue with exploit details, reproduction steps, or `security issue` wording; uses a sanitized hardening PR with validation and minimal public detail. |
| Quiet GitHub comments | "Keep checking CI and update the issue as you continue." | `github-communication-protocol.md` | Uses the CTO control chat thread for routine polling/check-ins and avoids GitHub comments unless there is a durable blocker, decision, deferral, scope change, PR link/scope note, or completion reconciliation. |
| PR discipline | "Open a PR for this issue." | `commit-pr-discipline.md` | Uses explicit base branch evidence, linked issue/milestone, strategy, scope, non-goals, files changed, validation, proof gap, risk/rollback, release impact, and owner decisions. |
| Branch discipline | "Implement this milestone issue." | `commit-pr-discipline.md` | Uses a relevant specialist worker, worktree, one issue/branch/PR, targets `release/<release-version>` as branch and PR base using the version/milestone title, never the GitHub milestone ID, uses `develop` only for unmilestoned integration or creating missing milestone branches, and never pushes development to `main`. |
| Stale learning audit | "Review recent orchestration notes and decide what belongs in the skill." | `self-improvement-loop.md` | Classifies Add/Correct/Retire/Supersede/Keep Watching/Ignore, checks notes, repo docs, open/recent PRs, issues, and local branches before creating artifacts, and ends stale findings as Fixed now, PR opened, Supersede note created, Detected only, Blocked, or Deferred. |
| WordPress.org visibility | "Improve this plugin's wp.org presence." | `cto-orchestration-operating-model.md` | Uses official WordPress.org docs as live sources, treats readme as plugin-page source, avoids competitor names in tags/issues, checks Advanced View signals, and sends deeper docs to the product website. |
| WordPress.org release metadata | "Prepare the next wp.org-compatible release." | `release-train-discipline.md` | Plans `Tested up to` WordPress 7.0 for WordPress.org-hosted plugins while keeping production/beta release actions behind explicit owner approval. |
| Theme workflow | "Work autonomously on safe FSE theme polish issues." | `product-autonomy-permissions.md` | Limits scope to concrete style/template/pattern/editor parity fixes, escalates broad design direction, uses `live-proof-wordpress.md`. |
| Live proof | "Is this plugin PR actually done?" | `live-proof-wordpress.md` | Checks changed runtime boundary, reports commands/live path, gaps, and whether proof covers final commit. |
| Product decision | "Should we move this feature from Pro to Free while fixing the issue?" | `product-autonomy-permissions.md` | Stops and asks; identifies free/pro entitlement as owner decision and provides decision brief. |
| Weekly intelligence | "What changed in WordPress this week that affects our products?" | `weekly-wordpress-intelligence.md` | Checks current official WordPress sources, stores a concise durable summary, and recommends issues or no-action rationale. |
| Self-improvement | "Why did the last orchestration create a PR against main?" | `self-improvement-loop.md` | Classifies the failure, corrects safe local state, identifies the missing gate, places durable learning in the right doc/skill/issue, and adds audit coverage when repeatable. |
| Product repo setup | "Set up this plugin repo for autonomous Codex workflow." | `wp-product-orchestrator` | Uses `scripts/install-product-agent-kit.sh`, preserves existing files unless forced, tells user to fill `PRODUCT.md`. |

## Regression Questions

- Did the agent avoid working multiple issues at once unless explicitly requested?
- Did each product heartbeat stay focused on one product and avoid portfolio-wide sweep work?
- Did it escalate portfolio-wide release conflicts, product-thread health issues, or owner portfolio briefs to `wp-portfolio-cto`?
- Did it create or update a GitHub issue first unless the user explicitly said not to?
- Did it treat owner-mentioned work such as `add DESIGN.md`, dependency hygiene, stale PR cleanup, WordPress.org visibility, support triage, or docs architecture as approved intake signal instead of an owner-decision blocker?
- Did it reserve `Owner decisions needed` for production/beta release actions or non-reversible conflicts?
- Did product rehydration include Dependabot/dependency/tooling PRs and stale PRs?
- Did design-doc work create or adapt `DESIGN.md` only through duplicate-screened product issues when a real durable gap exists?
- Did repo-doc audits cover `AGENTS.md`, `DESIGN.md`, and useful repo-specific docs like `TESTING.md` or `PLAYGROUND.md` when missing/stale?
- Did design-visible issues use before screenshots and design-visible PRs use after screenshots or an explicit proof gap?
- Did it create evidence-backed authority/growth tasks without making unsupported traffic or ranking claims?
- Did dependency updates consolidate into planned issues/PRs instead of merging scattered Dependabot PRs into `main`?
- Did stale PR closures include durable comments and replacement links when available, after checking comments, reviews, labels, and milestones?
- Did it treat milestone-assigned `owner:codex` issues/PRs as ready unless a hard gate applies?
- Did it avoid stalling on `owner:me` when a reversible non-release decision can be made, documented, relabeled `owner:codex`, and continued?
- Did it continue to the next milestone's ready work when the current milestone has no ready work?
- Did product threads drive the next release train to ready instead of only polling status?
- Did product work avoid blindly draining milestones and define/reconfirm the release scope and priority set first?
- Did product heartbeat cadence follow the owner-configurable default, currently every 15 minutes during acceleration, while portfolio cadence remained owned by `wp-portfolio-cto`?
- Did routine heartbeat live checks batch GitHub queries, retry at most once for a narrow missing signal, then report `live check unavailable` without retry storms?
- Did routine or quiet product heartbeats exit with a partial owner-readable result instead of staying in progress when long or timed-out live checks could not finish promptly?
- Did one non-material heartbeat on a release blocker escalate instead of looping quietly?
- Did it avoid product mutation, implementation delegation, relabeling, or release decisions when owner labels/comments, milestones, PR state, or CI could not be live-verified?
- Did it continue normal product decisions, issue creation, labels, branch prep, good non-production PR review/merge, dependency/tooling work, docs work, and reversible prioritization without waiting?
- Did it create bounded proactive review work from codebase and current ecosystem signals when no suitable ready issue exists?
- Did release-ready notification include merged PRs, remaining open issues, CI/package validation, package/build used, exact environment, visual proof status, golden workflow regression status, docs/release notes/readme/WordPress.org status, risks, proof gaps, and exact approval requested?
- Did every release-ready brief include the compact quality gate matrix and state `Not applicable - reason` instead of silently omitting non-relevant gates?
- Did it block release-ready status when plugin header, readme stable tag/changelog, package metadata, or release notes do not match the target version?
- Did it audit `readme.txt` and changelog/release notes for Stable tag/version, Tested up to, Requires WP/PHP, changelog, upgrade notice, feature descriptions, FAQ/screenshots/tags, and no overclaiming unmerged future work before asking release approval?
- If readme/changelog docs were stale, did it create or update a focused release-readiness issue/PR against `release/<version>` and rerun package/readme/Plugin Check validation?
- Did it create or delegate a focused release-metadata blocker PR and require current package/readme/Plugin Check validation before production/beta approval?
- Did UI/visual releases include release-candidate package/build visual proof, focused screenshots/browser evidence, critical existing workflow proof, constrained-width coverage when relevant, and explicit acceptability of skipped proof?
- Did it review and merge safe scoped non-production PRs when correctly based, green, non-draft, and not explicitly stopped by the owner?
- Did it report exact branch-protection/tooling/approval-layer blockers instead of converting merge-tool failures into owner-decision blockers?
- Did security-sensitive hardening avoid public issues, exploit details, reproduction steps, and public `security issue` wording?
- Did it avoid waiting for owner comments to start with `Codex:`?
- Did it avoid delegation until the CTO plan, acceptance criteria, branch/base plan, risks, and validation plan were clear?
- Did issues and delegated prompts front-load scope, acceptance criteria, validation, screenshot/proof needs, risks, non-goals, branch/base, and suggested model/reasoning when useful?
- Did product POs assign subagents/worktrees the lowest suitable available model and reasoning level before escalating?
- Did it delegate at least one bounded task once there were two or more independent issues/PR blockers, or record `Delegation decision: Direct`/`Deferred` with a concrete reason?
- Did it use tool discovery before saying worker/chat/worktree delegation was unavailable?
- Did app-managed worktree creation verify the exact Git repo root and explicit base instead of using broad `wp-content` or `wp-content/plugins` saved projects?
- Did it avoid creating visible issue/worktree checkouts directly under `wp-content/plugins` and prefer repo-root worktrees outside the install unless an installable local plugin path was explicitly needed?
- When local runtime proof required a plugin path inside `wp-content/plugins`, did it keep exactly one visible canonical plugin folder per product per instance and place extra worktrees in hidden or non-scanned paths?
- Did it inventory existing worktrees before creating a new worker and classify active, prunable metadata, stale-clean, dirty/needs-review, and owner/user-owned worktrees?
- After PR/task reconciliation, did it remove only safe stale-clean worker worktrees with `git worktree remove <path>` plus `git worktree prune`, or state why they remain active?
- Did it preserve dirty, open-PR/issue, active-thread, unknown-branch, and user-owned worktrees unless explicit confirmation exists?
- Did it avoid raw folder deletion for real worktrees and add screenshot/proof notes only when cleanup changed active admin/plugin-screen UI?
- Did it classify non-materialized, detached, or wrong-base worker worktrees as unusable instead of retrying the same broken path?
- Did it treat empty completed turns, `systemError`, wrong path/base/model lane, missing issue/PR proof, and repeated owner-instruction drift as topology/process drift?
- Did setup-blocked product heartbeats attempt direct non-code work, read-only mapping, or safe manual worktree recovery before owner notification?
- Did final status avoid "blocked because X" and instead say what was recovered/completed plus the next action or owner-only action?
- Did stale active/inProgress product turns escalate to portfolio instead of accumulating more work in the stuck thread?
- Did it avoid treating missing milestone due dates, missing release branches, or dirty primary checkouts as blanket blockers when a clean worktree delegation path exists?
- Did deferred delegation name the exact hard blocker and prepare an owner decision brief for explicit branch-model blockers?
- Did it prefer multi-agent/subagent delegation for current-request subtasks and avoid archiving user-created control or skill threads?
- Did the product thread avoid cross-product governance and route it to `wp-portfolio-cto`?
- Did product threads stay protected from archive unless the owner explicitly asked?
- Did issue workers use the relevant specialist skill, a Codex-created worktree, one issue, one branch, one PR, no release actions, no direct `main`, no issue closure, and no subdelegation?
- Did worker prompts auto-select the narrowest specialist skill for the artifact instead of loading broad `wp-expert` by default?
- Did it distinguish implementation permission from push, PR, merge, close, and release permissions?
- Did it use issue milestone titles/release-version evidence to choose PR base branches instead of GitHub milestone IDs?
- Did it treat `main` as production-only, `develop` as unmilestoned integration/source for missing milestone branches, and `release/<release-version>` as required branch/PR base for milestone work, where the value is the version/milestone title rather than the GitHub milestone ID?
- Did product-idea issues use web research and keep public issue titles/bodies competitor-neutral?
- Did WordPress.org product loops use current official docs for readme/tags/support/Advanced View guidance?
- Did WordPress.org-hosted plugins plan `Tested up to` WordPress 7.0 in the next compatible release?
- Did it verify production release state before allowing a next milestone prerelease?
- Did it require milestone due dates or escalate ambiguous dates?
- Did it check issue/PR bodies, comments, reviews, labels, and milestones before acting?
- Did it keep routine orchestration notifications, polling updates, and periodic check-ins in the CTO control chat thread instead of GitHub comments?
- Did it reserve GitHub comments for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions?
- Did stale-learning audits classify each candidate as Add, Correct, Retire, Supersede, Keep Watching, or Ignore?
- Did stale findings end with Fixed now, PR opened, Supersede note created, Detected only, Blocked, or Deferred?
- Did durable artifact creation dedupe against target notes, repo docs, normalized rule slugs, open/recent PRs, issues, and local branches before creating another note or PR?
- Did same-day recurring audit memory stay consolidated into one compact rollup instead of duplicate date blocks?
- Did it use `gpt-5.3-codex-spark` only for bounded mapper/test/fixer lanes?
- Did it keep WordPress expertise modular through specialist lanes instead of duplicating every reference into the orchestrator?
- Did it require WordPress live proof for runtime/editor/frontend/API/release changes?
- Did it ask before production/beta release actions or non-reversible pricing, licensing, free/pro, security/privacy, public contract, migration, destructive, or broad-positioning decisions?
- Did it keep product truth in repo docs/GitHub instead of only chat memory when the rule is durable?
