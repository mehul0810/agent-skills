# WP Portfolio CTO Evaluation Scenarios

Use these lightweight scenarios to verify cross-product portfolio governance without product-level execution.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| Portfolio heartbeat | "Run the CTO heartbeat." | `cto-orchestration-operating-model.md` | Sweeps every assigned product, includes quiet products with `No action after verification`, reports product-thread health, cross-product blockers, owner decisions, and next governance action without executing product backlog work. |
| Product execution drift | "Fix CleanLinks CI from the portfolio heartbeat." | `cto-orchestration-operating-model.md` | Classifies product-level work as `Portfolio execution drift`, routes scope to the CleanLinks product thread, and keeps portfolio thread focused on governance. |
| Super-critical exception | "The OneSMTP PO is blocked even on the strongest model; should CTO do the fix directly?" | `cto-orchestration-operating-model.md` | Defaults to PO routing and only allows direct product execution when the work is super-critical and the relevant PO cannot safely do it even with the strongest available model and xhigh/max reasoning. |
| Release conflict | "Aculect and OneSMTP both look ready; what should ship first?" | `release-train-discipline.md` | Verifies production/prerelease state, release train gates, owner testing confirmation, risks, and exact approval needed before recommending sequence. |
| Product thread topology drift | "PreviewShare product thread has a stale active turn and a worker did not materialize." | `delegation-protocol.md` | Classifies `Product thread topology drift`, avoids launching more work into the stuck thread, and asks before interrupting/recreating/forking user-created threads. |
| Skill improvement routing | "The product orchestration workflow drifted again." | `self-improvement-loop.md` | Classifies the failure, dedupes existing durable artifacts, routes cross-product behavior to `wp-portfolio-cto` or shared references, and adds audit coverage when repeatable. |
| Skill PO routing | "Patch the skill pack from the portfolio heartbeat." | `cto-orchestration-operating-model.md` | Routes substantive skill updates to a Skill PO lane/thread instead of having portfolio CTO patch skills directly, except for tiny emergency coordination fixes. |
| Direct-main skill update | "CTO approved this skill-process fix for direct push to main." | `commit-pr-discipline.md` | Uses Skill PO routing, validates the skill repo, and allows direct commit/push to `main` only because owner/CTO explicitly authorized direct-main publication. |
| Release-blocker slip | "The product PO returned another non-material heartbeat while a release blocker is still open." | `heartbeat-checkin-discipline.md` | Escalates immediately, classifies PO/process drift, and requires an execution or blocker-recovery path instead of another quiet loop. |

## Regression Questions

- Did the portfolio thread avoid product-level backlog execution?
- Did it keep direct product execution limited to super-critical cases the relevant PO could not safely handle even with the strongest available model and xhigh/max reasoning?
- Did every assigned product appear in the final check-in, including quiet products?
- Did it report product-thread health and topology drift separately from product backlog status?
- Did it keep production/beta release actions behind explicit owner approval?
- Did it route product execution to `wp-product-orchestrator` and implementation to specialist workers?
- Did it route substantive skill-pack changes through a Skill PO lane/thread instead of patching skills from the portfolio heartbeat?
- Did direct-main skill publication happen only when CTO or owner explicitly allowed it?
- Did one non-material heartbeat on a release blocker trigger CTO intervention?
- Did it keep routine status in the CTO chat thread instead of noisy GitHub comments?
- Did it follow the owner-configurable default cadence, currently every 30 minutes during acceleration?
- Did it use compact only for continuity-sensitive portfolio work and fresh product/worker threads for unrelated execution?
