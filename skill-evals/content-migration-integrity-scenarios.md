# Content Migration Integrity Scenarios

Use the blind packet in `cases/content-migration-integrity/input.json` for synthetic migration reasoning and mechanics. Keep `criteria.md` and expected outcomes author-only. This fixture tests pagination coverage and mutation-safe batch progress; it is not an importer, WordPress runtime, or production-data proof.

## Stable Checks

- `CMI-1 Coverage`: follow revealed pagination until a terminal condition; deduplicate stable item IDs and page identities; identify repeated/clamped pages and separately bound requests and item totals.
- `CMI-2 Honest status`: distinguish complete terminal traversal from request/item-budget stops, access/request failures, and repeated-page stops. Report partial/unknown coverage rather than asserting "all".
- `CMI-3 Mutation safety`: do not advance offset through a resultset whose membership/order is changed by writes. A stable snapshot/keyset or safe re-read from offset zero with durable ID progress must process all intended records once.
- `CMI-4 Resume integrity`: retain per-ID failures, retry unfinished IDs, avoid duplicate successful side effects, and reconcile all expected IDs before completion.
- `CMI-5 No-progress/empty`: terminate repeated no-progress safely as incomplete; a genuinely empty source may complete successfully.

The Node fixture tests only deterministic synthetic mechanics. Passing them does not demonstrate native WordPress APIs, source access, production coverage, or rollback readiness.
