# Command And CI Approval Boundary

Use this before a CTO, PO, or worker runs a command or CI action with mutation potential. The canonical machine-readable policy is `mehul0810/agent-loop` `policies/command-execution-policy.json`; live owner instructions, global `AGENTS.md`, and stricter role/repository rules still apply.

## Core Rule

A runtime allowlist or approved command prefix grants technical capability, not product or owner authorization. Classify the action by side effect before execution. Unknown, compound, or broader-than-reviewed effects require owner approval.

## Run Without Owner Approval

- Read-only Git/GitHub inspection: status, diff, log, show, list/view, checks, workflow/run state, logs, annotations, and artifact download.
- Local or hosted quality work: tests, lint, format checks, static analysis, security scans, builds, packaging, and dry-run validation.
- Trigger or rerun reviewed non-production CI only when it cannot deploy, publish, release, mutate secrets or permissions, transfer protected data, or write a protected branch.
- Reversible issue/PR updates or scoped non-protected branch pushes already allowed by the active role and repository.

## Require Explicit Owner Approval

- Production/beta release or tag actions; publish/deploy; protected-branch merge/direct push; deploy-capable workflow dispatch; repository settings, permissions, secrets, or tokens.
- Security/privacy posture, breaking public API/schema, pricing/licensing, or broad positioning changes.
- Destructive actions: deletion/overwrite with recovery impact, force push, history rewrite, hard reset/clean, irreversible migration, critical workflow cancellation, or destructive environment/data/cache changes.
- Transfers of repository/domain ownership, money, credentials/secrets/tokens, restricted data, or production data across owners/trust boundaries.
- Any uncertain, compound, or approval-bypass action.

## Execution Discipline

- Split compound commands at the approval boundary: run safe inspection/validation now; request approval only for the gated mutation.
- Never wrap, alias, encode, script, or route a command to evade approval. Never request blanket shell/interpreter approval.
- Before requesting approval, state the exact action/command, target, expected effect, rollback where possible, and why it is gated.
- If workflow behavior is unclear, inspect its definition and inputs first. Do not dispatch until deploy/release/secret/permission/data/protected-branch effects are disproven.

## Output

Report `Executed safely`, `Owner approval required`, or `Blocked pending side-effect verification`, with the evidence used. Do not call a technically allowlisted action owner-authorized unless a current policy or owner instruction grants it.
