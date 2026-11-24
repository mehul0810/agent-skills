# Author-Only Criteria: Content Migration Integrity

Do not provide these criteria to the evaluator. Inspect the synthetic artifacts and any executable demonstration; treat this as mechanics coverage, not evidence about a real importer.

1. Pagination follows newly revealed pages/cursors, deduplicates IDs, and guards repeated page identities/clamped terminal pages. Request and item bounds are independent; a budget stop is incomplete.
2. Coverage is claimed only after reconciling source evidence and expected stable IDs. Generic request/write errors, truncated traversal, or exhausted budget do not count as success.
3. A live offset walk that removes each processed item from the selector must not advance offsets on the mutated resultset. For 300 records and batches of 100, naive offsets 0, 100, 200 can skip the middle 100; a stable snapshot/keyset or safe repeated offset-zero strategy processes all 300 once.
4. Failed IDs remain explicitly failed/pending. A retry/resume completes unfinished IDs without duplicating prior successful effects, and completion requires every expected ID to be reconciled.
5. A no-progress guard stops a stuck traversal as incomplete; a genuinely empty source is a successful empty result. Do not imply WordPress, production, external-service, or rollback proof.
