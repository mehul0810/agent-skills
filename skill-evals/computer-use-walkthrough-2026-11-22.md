# Computer-Use Walkthrough Recording

The same video skill now covers acquisition as well as editing. An operator
controls an identified surface; a recorder continuously captures that same
surface. An action log, a set of stills, and a screen recording are different
deliverables. No host, model, effort or publication policy changed.

## Production Evidence

| Run | Observed result |
| --- | --- |
| Guided development pilot | Codex Computer Use selected a fresh Chromium for Testing window containing only the offline Proof desk fixture. It operated **Open proof**, then **Compare versions**, and observed **Comparing versions...**, **Comparison ready** and **Not sent**. The independent page recorder finalized a silent 960x600, 25 fps, 47.44-second VP8 WebM. The guided receipt did not invent an action log. |
| Review edit of that take | One uninterrupted 14.4-second excerpt (raw 25.000-39.400); no internal cuts, speed changes or synthesized UI. A separate text rail below the page leaves controls visible. Independent timed-frame review found both stock values already visible before the click; the revised cue says to *check* both proofs rather than claiming the action reveals them. The corrected H.264 file fully decoded: 960x680, 25 fps, 360 frames, no audio. Raw SHA-256 `73176fcde446383331a1fdea35da0e63f7eb089973fe2ba6ac1653ce5eb498ea`; revised review SHA-256 `31c5c10114f225c6a1d526f60488665f833bb0715608c06a2242da252552663d`. |
| Final native regression | On Node 24, project-local Playwright 1.63.0, matching Chromium and FFmpeg/ffprobe: 5/5 passed, no skips. Verified automatic demo capture and a separate local-plan run, actual encoded files, receipt hashes, silent streams, missing-result rejection, output preservation, isolation across a two-server redirect, and failed takes for a popup and JavaScript dialog. The fixture result was visible at desktop and mobile widths. |

The guided pilot predates the final popup/dialog safeguard; the latter was tested
separately in Chromium on the final code. The pilot and sample frames support
fixture-specific claims, not a native-app capture, a customer's workflow, an
owner-approved master or narrated performance. Owner-excluded screen-reader
and voice-over narration verification were not run or counted as passed.

## Decision Evidence

At `816b08ef6aa7510286b3b89d844396f99f81f276`, five fresh performers
answered 59 synthetic briefs (48 existing production, seven format, four
computer-use); separate reviewers held the keys. A neutral-catalog intake
loaded the existing editing guide for supplied footage, not the new recording
guide. Its initial routing mark was corrected against the actual ordered log.
After that correction the first pass was **54/59**. The five misses concerned a
bounded re-edit, review/master lineage, walkthrough repeatability, an animatable
script and the recorder's native-dialog limit.

Targeted independent handoffs passed four of those five. The remaining
generic walkthrough still did not record a viewport. A separate synthetic QA
log anchored a concrete run to its build, role and 960x600 viewport; that
response, alone, omitted some pacing/skip guidance present in the generic
handoff. A separate reviewer passed the **combined** repeatability check,
not either standalone response. A placeholder-only results file was retained
as failed evidence; scoring used a separate verbatim transcription of the
already-delivered run sheet. This was paper evidence, not a learner reproducing
the task. All four computer-use briefs passed individually after the targeted
handoff. The final receipt covered 48/48 registered checks; original failures
were not rewritten. No host cost/token telemetry was available.

Frozen manifest hashes: production
`e42ffe900056c01b92bfa8cfba57c8756a83505dd4e33071a0364d7da2596f50`,
formats `aded53c2c2f84d4f564dd91de010f9dcf9ae2fbde4c3ccf90af6b82bc61d890c`,
capture `8c86885f5d9f6fcbd14cc2b481db885e40ef7486d552f3ef6cb9e9124ec4f2d1`,
and external settings supplement
`84fadd01753b1d2e47d462357a040d1d3d7f94b6e1d6b2c2507bde285b2ea4a6`.
The combined receipt preflight was complete (not itself admission):
`3e9ffbbb714bceb6be8df50672a8b964f12ebbec331799d8cc48a2d69557a14f`.

## Reproduce

Use the [capture guide](../product-video-producer/references/computer-use-walkthrough.md)
and the opt-in command in [TESTING.md](../TESTING.md). With only the portable
dependencies, the regression reports the native test as skipped. There is no
browser dependency or download in the public skills installer.

The split between controller, page recording and finalization follows
[Playwright video recording](https://playwright.dev/docs/videos). Its
[actionability checks](https://playwright.dev/docs/actionability) do not attest
to editorial timing. For native software, OBS documents a distinct
[single-window capture mode](https://obsproject.com/kb/macos-screen-capture-source);
that mode was not exercised in this pilot.
