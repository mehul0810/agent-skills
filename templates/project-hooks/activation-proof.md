# Native Activation Receipt

Use only when verifying an explicitly selected project's existing hooks. This
receipt is not permission to trust, enable, edit or trigger destructive actions.
Keep it in the existing private task evidence store, not committed configuration.

| Check | Observed identity / evidence pointer | Disposition |
| --- | --- | --- |
| Host and version, project root, exact hook configuration hash | | Unrun |
| Host-supported event and trusted discovery | | Unrun |
| Real resume/compact event and host-reported invocation | | Unrun |
| Bounded output and timeout/failure handling | | Unrun |
| Fresh actor retrieves originals and rejects stale authority | | Unrun |

Keep simulated payload tests separate. Record events individually; observing
resume does not prove automatic compaction. If native events or trust state are
not exposed, report unavailable rather than infer success from a CLI version,
configuration file or adapter exit code. Use existing supported host surfaces;
do not scrape private transcripts or change trust to force a pass. Missing proof
leaves activation unverified and manual/native continuity remains the fallback.
