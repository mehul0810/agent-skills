# Gap Remediation Evidence

## Scope

Source base: `6c5b161a7c62f8a96b799b14d4b8cc05e69f9ee5`.
Changes cover table-scenario evidence identity and opt-in global design-defaults
installation. No skill kernel, model selection, authorization policy, live
feedback ledger, or Pen link was changed.

## Verified

- The full `PYTHON=/opt/homebrew/bin/python3.13 npm test` gate passed.
- Shell syntax and `git diff --check` passed.
- Table headers and governing context now invalidate selected-row evidence;
  independent sibling-row edits do not. Regression cases exercise both outcomes.
- Sixteen baseline contracts changed. All seventeen corresponding evidence
  digests were independently recomputed against their original immutable
  `testedRevision` and matched the expanded current contract. Run records,
  original revisions, runtime bindings, and source evidence were not rewritten.
- Isolated installation fixtures cover explicit opt-in, preserved owner text,
  idempotence, absent/conflicting policy, and redirected symlink ancestors.
- The read-only checker accepted the existing exact unmarked global design
  defaults and resolved shared reference. This proves filesystem configuration,
  not that a model loaded or followed the instructions.
- Independent fresh-agent review reproduced a duplicate-policy acceptance bug.
  After correction, fresh fixtures rejected conflicting duplicate sections in
  both modes before link creation. Missing and altered policy cases failed;
  exact legacy policy passed. The final aggregate passed after the repair.

## Open Gates

- Generic harness full-contract hashing and whole-task timing eligibility are
  published at `3326bf098b0e327240ea1911944700c458633bc9`; its 48 tests,
  example validation and self-validation passed under Node 24. CI now selects
  Node 24 as well. The installed dependency pin remains unchanged until
  consumer compatibility and evidence migration are proved. Do not present the
  source patch as deployed runtime protection.
- Native design pilot stopped before canvas edits: Pen UI and MCP disagreed on
  the active document while another document became foreground. No exported
  artifact, visual-quality pass, or native save/reopen proof was produced.
- The end-to-end live feedback correction/outcome/recurrence loop remains
  unproved; no synthetic record was inserted into the live learning ledger.
- Host token telemetry remains unavailable. Route-word budgets and partial
  observation durations do not establish end-to-end token or latency savings.

Next proof should use an exclusive disposable native document, a supervised
real correction lineage, and host-provided usage measurements where available.
