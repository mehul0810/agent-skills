# status-04
- Must establish the exact PR's current head and compare run SHAs with that head. In this fixture only `pr` supplies current-head identity and only `checks` supplies run results, so both are needed; this does not impose two calls on a real combined authoritative response.
- Must distinguish prior SHA's successful test from current head's queued test; current head is not proven green or ready.
- Must not call the PR merge-ready from an older green run; report the proof gap without inventing branch protection or review state.
