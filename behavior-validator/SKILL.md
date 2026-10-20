---
name: behavior-validator
description: "Use for source-blind validation of observable WordPress, web, macOS, game, API, packaged-build or generated-artifact behavior against an explicit contract."
---

# Behavior Validator

Independently prove what a user or operator can observe. Judge the running target against a behavior contract without using implementation knowledge.

## Source-Blind Contract

- Read the behavior contract first. If none exists, derive a compact contract from the user request or approved acceptance criteria before testing.
- Do not inspect source files, diffs, tests, Git history, implementation notes, review output, or code locations.
- Use only observable surfaces: the actual browser/native app/game, accessibility tree, public/admin UI, API/CLI, generated files, packaged artifact and redacted runtime output. Block/Site Editor and WP-CLI apply only to WordPress.
- Prefer a fresh worker without inherited implementation discussion. Give it only the contract, target/build identity, access method, allowed fixtures or credential names, evidence requirements, and hard gates.
- If implementation context contaminates the run, do not call it independent proof. Start a fresh source-blind run or report `contaminated`.
- Never change product code, issue scope, release state, or acceptance criteria. Return findings to the implementation owner or PO.

## Workflow

1. Select `references/wordpress-behavior-contract.md` for WordPress; otherwise use `../shared/references/observable-proof-contract.md`. Classify every clause as a task, expected result, failure result, probe, or evidence requirement.
2. Confirm the exact target and build identity. For WordPress release candidates, prefer the packaged ZIP/build installed in a disposable `wp-proof` environment rather than a development checkout. Other platforms use their actual build/runtime; a missing macOS runtime is blocked proof, not a reason to create a WordPress site.
3. Exercise the task through the same UI, editor, CLI, API, or artifact path a real user/operator uses.
4. Run only relevant anti-cheat probes: change fixture data, refresh/reopen, cross-check persistence, use invalid/boundary input, test an unauthorized role, or verify rendered output changes.
5. Capture compact redacted evidence. Do not expose secrets, cookies, tokens, private data, or unrelated logs.
6. Mark every clause `pass`, `fail`, `blocked`, or `out_of_scope`; missing evidence is not a pass.
7. After a fix, rerun failed clauses plus nearby regression probes, not the entire suite unless the changed boundary warrants it.

## Routing Boundary

Use this skill for independently observable runtime, editor, frontend, admin, API, packaged-build, or generated-artifact behavior. Do not route static lint, code style, architecture quality, implementation review, release metadata-only edits, or exact user-fed value substitutions here.

Source-aware implementation and code review stay with the owning WordPress specialist or non-WordPress `project-engineer`. Product Design owns aesthetic critique; this skill checks visual behavior or parity only when the contract defines the expected result and evidence.

## Output

Report target/build/environment, contract used, clause status summary, failed behavior with reproduction and evidence, probes run, contamination status, blockers, and remaining proof gaps. Do not report code fixes or guessed file locations.
