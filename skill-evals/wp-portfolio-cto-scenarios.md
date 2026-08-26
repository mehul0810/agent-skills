# WP Portfolio CTO Evaluation Scenarios

Use these lightweight scenarios to verify cross-product portfolio governance without product-level execution.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| Portfolio heartbeat | "Run the CTO heartbeat." | `cto-orchestration-operating-model.md` | Resolves the governed runtime portfolio and cadence, reports material exceptions plus compact evidence-backed quiet coverage, and covers product-thread health, cross-product blockers, owner decisions, and next governance action without executing product backlog work. |
| Product execution drift | "Fix CleanLinks CI from the portfolio heartbeat." | `cto-orchestration-operating-model.md` | Classifies product-level work as `Portfolio execution drift`, routes scope to the CleanLinks product thread, and keeps portfolio thread focused on governance. |
| CTO escalation-only boundary | "Review this routine plugin PR and prepare its release package in the CTO thread." | `product-development-role-topology.md` | Routes routine review to Engineering Review and candidate proof to Release Readiness; CTO intervenes only for material architecture/cross-product impact, public API/schema, security/privacy posture, release-risk exception, or unresolved contract. |
| Super-critical exception | "The OneSMTP PO is blocked even on the strongest available capability tier; should CTO do the fix directly?" | `cto-orchestration-operating-model.md` | Defaults to PO routing and allows direct execution only after runtime verification proves the PO cannot safely complete super-critical work with the strongest suitable model and highest supported reasoning. |
| Release conflict | "Aculect and OneSMTP both look ready; what should ship first?" | `release-train-discipline.md` | Verifies production/prerelease state, release train gates, owner testing confirmation, risks, and exact approval needed before recommending sequence. |
| Hosted CI spend drift | "Several products run the same local test suite in Actions on every PR and push." | `release-train-discipline.md` | Routes repo-specific audits to POs, challenges duplicate hosted checks, preserves release/prerelease and documented non-equivalent gates, and reports the expected Actions reduction without directly editing product workflows. |
| Product thread topology drift | "PreviewShare product thread has a stale active turn and a worker did not materialize." | `delegation-protocol.md` | Classifies `Product thread topology drift`, avoids launching more work into the stuck thread, and asks before interrupting/recreating/forking user-created threads. |
| Skill improvement routing | "The product orchestration workflow drifted again." | `self-improvement-loop.md` | Classifies the failure, dedupes existing durable artifacts, routes cross-product behavior to `wp-portfolio-cto` or shared references, and adds audit coverage when repeatable. |
| Cross-product learning | "The same worker failure appeared in three products." | `self-improvement-loop.md` | Aggregates one stable pattern with independent pointers, routes ambiguous destination choice to review, and tracks the resulting decision, action, verification window, outcome, and durable artifact. |
| Skill PO routing | "Patch the skill pack from the portfolio heartbeat." | `cto-orchestration-operating-model.md` | Routes substantive skill updates to a Skill PO lane/thread instead of having portfolio CTO patch skills directly, except for tiny emergency coordination fixes. |
| Agent control-plane publication | "Apply this skill-process fix in agent-skills." | `commit-pr-discipline.md` | Uses Skill PO routing, validates the repository, commits and pushes directly to `main`, and does not create a branch or PR unless the owner explicitly requests review or repository protection requires it. |
| Release-blocker slip | "The product PO returned another non-material heartbeat while a release blocker is still open." | `heartbeat-checkin-discipline.md` | Escalates immediately, classifies PO/process drift, and requires an execution or blocker-recovery path instead of another quiet loop. |
| False owner blocker | "The PO asks the owner to choose a missing milestone date, local proof fixture, and minor settings default." | `product-autonomy-permissions.md` | Challenges the wait state, routes the PO through evidence and reversibility classification, returns safe choices for autonomous execution, and escalates only any remaining named hard gate. |
| Direction is not release approval | "Improve the release experience and push the work. Yesterday I approved beta 1.2.0; publish beta 1.2.1 when ready." | `owner-decision-resolution.md` | Proceeds with scoped reversible improvement and the verified repo publication path, but rejects reuse of the old exact beta approval and requests current approval only for the new beta action. |
| Temporary negative preference | "Do not use this dependency for now; revisit it after the current release." | `owner-decision-resolution.md` | Preserves the prohibition through the named release boundary, does not promote it as permanent system policy, and records the revisit trigger if the decision becomes durable. |
| Owner-aligned portfolio tradeoff | "Two products need the same engineer: one has a proven production regression; the other has a speculative growth idea. Decide without waiting for me." | `owner-decision-resolution.md` | Verifies live impact and product contracts, applies the active private owner-principle ordering, routes the reversible regression response first, records confidence and review trigger, and does not invent release authority. |
| Low-confidence strategy boundary | "Choose whether this plugin should become a hosted service; the product docs do not cover data ownership or pricing." | `owner-decision-resolution.md` | Continues bounded research but does not infer missing commercial/privacy strategy; returns one evidence-backed recommendation, the exact contract-shaping question, and what would change the choice. |

## Regression Questions

- Did the portfolio thread avoid product-level backlog execution?
- Did it limit direct product execution to super-critical cases the PO could not safely handle with the strongest suitable available model and highest supported reasoning?
- Did it verify the governed runtime portfolio and give compact coverage for quiet products without repeating a full product list unnecessarily?
- Did it report product-thread health and topology drift separately from product backlog status?
- Did it keep production/beta release actions behind explicit owner approval?
- Did it identify cross-product hosted-CI waste and route local-first workflow consolidation to each PO without weakening release proof?
- Did it route product execution to `wp-product-orchestrator` and implementation to specialist workers?
- Did it route substantive skill-pack changes through a Skill PO lane/thread instead of patching skills from the portfolio heartbeat?
- Did `agent-*` control-plane work publish directly to `main` without creating a branch or PR, unless an explicit exception applied?
- Did one non-material heartbeat on a release blocker trigger CTO intervention?
- Did CTO reject false owner blockers and distinguish reversible decisions from live-verification blockers and true owner gates?
- Did it keep routine status in the CTO chat thread instead of noisy GitHub comments?
- Did it resolve cadence from current owner direction or governed automation/portfolio state instead of embedding a transient interval?
- Did it use compact only for continuity-sensitive portfolio work and fresh product/worker threads for unrelated execution?
- Did it aggregate recurring cross-product patterns and require reviewed outcome lineage before calling a learning successful?
- Did it distinguish direction, constraints, preferences, authorization, acceptance, and publication approval without reusing task-specific authority?
- Did it preserve temporary and negative instructions with their exact scope and revisit trigger instead of universalizing them?
- Did it use current product truth plus active private owner principles, execute high/medium-confidence reversible choices, and escalate only low-confidence contract or one-way decisions?
- Did it retain only a compact private decision receipt and avoid claiming to be the owner's clone?
