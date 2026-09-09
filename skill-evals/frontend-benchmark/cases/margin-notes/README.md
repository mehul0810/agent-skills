# Margin Notes Execution Case

This independently authored source packet was frozen before the first native
WordPress implementation attempt. It is now a published development case, not a
private held-out case for future skill optimization. Do not expose a candidate
implementation or author source to a fresh worker running this case.

Use `../../EXECUTION.md` as the acceptance protocol and `packet/brief.md` as the
implementation brief. `packet/manifest.json` binds all ten supplied artifacts,
viewport/DPR, browser identity, actor exposure and creation time. The manifest's
SHA-256 is `593f615b60d05e00097f7aaf6963af1e40d66fa1133492d76654e27e7a7aab3d`.
The packet includes unmodified font binaries, notices and complete bundled
licenses, plus the original fixture illustration. No customer data is present.

## Run

1. Freeze the tested skill revision and acceptance contract. Verify packet file
   hashes against the manifest before dispatch; do not silently refresh hashes.
2. Give a fresh implementation worker the packet only, the site skill, and an
   authorized disposable native WordPress runtime. For a pinned calibration
   runtime, see `../../native-proof.md`; its persistence runner is not this test.
3. Give a separate evaluator the source packet, execution contract and frozen
   running candidate, without implementation or rationale. Exercise the visible
   editor workflow, not just native store/API persistence.
4. Record initial and repaired results, including failed/blocked gates, in a new
   evidence note. Do not rewrite the first pilot result or count this now-public
   case as held-out evidence. Obtain another private target for generalization.

The reference packet is durable in Git. Runtime, candidate artifacts and traces
are not automatically retained by this directory; each run must state their
actual location and retention. Source screenshots alone prove no native behavior.
