# Optional WordPress Project Agents

Use these on demand under a product PO. Small fixes need implementation and applicable proof; do not run five roles automatically or create five permanent tasks. CTO handles material cross-product/authority decisions. Profiles contain boundaries; installed skills contain expertise.

## Setup

After verifying the exact Git root, installed named skills and current host support, copy only the needed TOML files into that project's `.codex/agents/`. Preserve existing same-name agents; compare and deliberately merge instead of overwriting. Do not copy this directory into a WordPress plugin runtime folder or replace project/global config. Confirm discovery in a new session before relying on a custom role. If custom profiles are unavailable, use an explicitly bounded subagent prompt with the same contract and report that fallback.

[Official custom agent format](https://learn.chatgpt.com/docs/agent-configuration/subagents), checked 2026-09-08: standalone TOML requires name, description and developer_instructions. Sandbox defaults can be overridden by the live parent session; instructions and reviewed tool permissions still matter. Files alone do not create, schedule, archive or switch an active task.

## Dispatch

| Profile | Inputs and output | Preferred capability |
| --- | --- | --- |
| wp-planner | Problem/evidence to implementation-ready packet | Balanced; strong for ambiguity |
| wp-implementer | One issue/contract to scoped diff and checks | Balanced; economical for exact work |
| wp-reviewer | Immutable diff/contract to independent findings | Balanced; strong for high risk |
| wp-behavior-validator | Acceptance contract/package to observable proof | Lowest sufficient for actual tool/visual judgment |
| wp-release-readiness | Candidate/evidence to GO/NO-GO brief | Strong for release judgment |

Follow `shared/references/project-subagent-routing.md` in the installed skill pack for runtime allocation. Recheck both model and reasoning availability; no model IDs are pinned here. Specify both at dispatch when inherited settings are inappropriate. Astra remains low/light unless explicitly approved otherwise. Do not silently inherit an expensive tier for deterministic work.

Packet: exact product/repo/path; issue and milestone; branch/base or candidate; scope/non-goals; acceptance criteria; validation commands; proof environment and mutation limits; relevant skill; risks/authority; concise output and stop condition. Supply URLs and deltas rather than full histories. A validator receives source-blind artifacts, not implementation explanations. Reviewer may inspect relevant callers beyond the diff.

Parent verifies returned evidence and reconciles product state. Run only independent non-overlapping work concurrently. These profiles have no GitHub mutation or publication authority; authorized PO actions remain parent-owned. Close disposable agents through supported lifecycle tools after reconciliation; user-created control tasks remain protected.

## Validation

Run `python3 scripts/validate-agent-profiles.py` from the skill repo (Python 3.11+). This checks TOML structure and template boundaries, not live host discovery or sandbox enforcement. Fresh role scenarios supplement it. Compare accepted outcomes, retries, time and available token telemetry before claiming efficiency gains.
