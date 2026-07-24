# WordPress Behavior Contract And Probes

Use this reference only after `behavior-validator` is selected. Keep the contract short and executable; omit irrelevant probe families.

## Contract Template

```text
Goal: <observable user/operator outcome>
Target: <URL, command, endpoint, ZIP/build, or generated artifact>
Build identity: <version, tag, commit, checksum, or artifact run>
Environment: <WordPress/PHP/browser, theme/plugins, multisite, viewport>
Roles and fixtures: <allowed roles, fixture names, credential variable names; never values>

Clauses:
- BV-01 Task: <action through a real surface>
  Expected: <observable state/output/persistence>
  Failure behavior: <expected invalid/error/unauthorized result>
  Evidence: <screenshot, accessibility observation, response summary, CLI excerpt, artifact summary>

Required probes: <relevant probes below>
Out of scope: <explicit exclusions>
```

Every task needs an observable result and evidence type. Record uncertainty as a blocker rather than filling the contract with implementation assumptions.

## WordPress Anti-Cheat Probes

Choose probes that can disprove a false success claim:

- Package/install: install the release ZIP on a clean disposable WordPress instance; activate, deactivate/reactivate, and confirm the reported version/build rather than testing only a source checkout.
- Settings/admin: save a distinctive non-secret value, reload or start a new session, verify persistence, then try empty, invalid, and boundary input plus an unauthorized role.
- REST/API/WP-CLI: vary inputs and fixture state; verify response/status/output changes, permission failure, malformed input handling, and that a success response corresponds to persisted or rendered state.
- Block editor/FSE: with the intended non-technical role, create or insert the documented composition, edit representative copy/media/link content, save, close/reopen, and verify editor state plus frontend rendering. Confirm page-owned content remains editable from its intended admin surface, the block tree stays valid, and no CSS/code knowledge is required for the promised workflow.
- Frontend/UI: exercise empty, loading, error, success, disabled, keyboard/focus, narrow/mobile, and long-content states only when relevant to the changed workflow.
- Data/integration: mutate fixture data, retry/reconnect, and verify idempotency or failure recovery through observable state; mocks do not prove a live provider contract.
- Generated artifact: change the allowed input fixture and confirm output changes; inspect the final file/package rather than trusting a success notice.

Do not run every probe mechanically. Select the smallest set that can expose fake, stale, cached, role-blind, non-persistent, or source-only success.

## Release Candidate Route

For a beta or production candidate with user-visible behavior:

1. Receive the approved behavior contract and exact packaged artifact identity from the PO.
2. Install that artifact in disposable `wp-proof` when available; use Studio only for parity, existing data, custom-domain integration, or owner visual review.
3. Run changed clauses and the product's relevant golden workflows without source access.
4. Return the clause matrix and proof gaps to the PO. The validator does not approve, merge, tag, publish, or release.

## Report Shape

```text
Overall: satisfies_contract | violates_contract | blocked | contaminated
Target/build/environment:
Contract:
Clauses: BV-01 pass; BV-02 fail; BV-03 blocked
Failures: <steps, observed result, expected result, redacted evidence>
Probes: <probe and result>
Proof gaps/blockers:
```

Use `fail` for an observable contract violation or unsupported pass claim. Use `blocked` only for missing runtime access, fixtures, credentials, network, or required tools. Use `out_of_scope` only when the contract explicitly excludes the behavior.
