# Continuous Walkthroughs

The prior proofing example was a real page recording, but its app view held
for 4.2 seconds and then switched screens. That is not a useful demonstration
of a drag. This change distinguishes continuous recording from showing the
interaction a viewer actually needs to learn.

## Recorded Evidence

Used the published [SVG-Edit](https://github.com/SVG-Edit/svgedit) 7.4.2
distribution on a disposable local origin, with Playwright 1.63.0 and an
empty document. No private session or account was involved. Actual browser
mouse input selected the rectangle tool, held and dragged across the artboard,
selected the shape, recolored it blue, and dragged it to another position.
The trusted-event indicator distinguished pressing from moving; it was not
an OS cursor or a path painted over the finished movie. No screenshots,
simulated UI, pans or file export were used to make the video.

| Evidence | Observation |
| --- | --- |
| Source | One continuously recorded silent WebM. SHA-256: `086d70c85f2984ecca81c6912a3442837267eb91f69ad179e67722e63431e0e0`. |
| Review copy | Direct H.264 transcode: 1280x800, 25 fps, 21.8 s, 545 frames; full decode passed. SHA-256: `16bc0cf06a2f7b616b381a928e2ac068c229a51404e130b274ed380735944b09`. |
| Held drawing | In encoded frames at 5.8, 6.6, 7.4, 8.2 and 9.0 s, the pink fill anchored at (452,272) grew to widths 28, 72, 116, 158 and 202 pixels. This measurement isolates app fill rather than the cursor. |
| Held movement | At five instants between 17.96 and 20.20 s, the left edge of the blue selection moved from x=452 to 524; the top edge moved from y=248 to 296. The final SVG rectangle was 240x140 at document position (200,143), with blue fill. |
| Playback | A local Chromium player reached the end at 1x in 21.825 s, 545 decoded frames, zero dropped. This is measured browser playback and timed-frame inspection, not a claim of owner review or subjective approval. |

The optional Chromium regression also records the bundled print-comparison
fixture. It decodes the sweep away from the pointer, looking for ordered
intermediate divider positions during the held input. Static and direct-cut
controls are rejected. All six native test groups passed; this fixture is
not evidence of SVG-Edit or of another product.

The sample is silent. macOS screen-reader and voice-over narration checks
remain excluded by owner direction; no conduct of those checks or native
desktop recording is implied. The videos remain local, outside the repo.

## Decision Evidence

The changed skill and its raw case packets were frozen at
`3ed3b3232274bc75dfc6f20f6dd178feb28293ef`. Separate performers and scorers
exercised 60 synthetic production decisions: 48 existing production briefs,
seven format briefs and five computer-use briefs. All five capture briefs
passed on the first attempt, including the new request to replace a
screenshot-like video. The underlying real editor take is the separate
recording described above, not something established by the synthetic answers.

The initial result was 57/60 individual cases and 46/49 registered checks.
The three misses were distinguishing a Short poster from its thumbnail,
including conversion evidence in channel diagnosis, and giving persistent
objects usable motion paths and handoffs in the visual script. In a bounded
new attempt, the channel diagnosis and script passed. The first Short retry
distinguished the poster but deferred rather than performed its live rules
check; that attempt was scored incomplete. The script performer also read the
adjacent raw request, not an answer or scorer file. Original grades were
retained independently of subsequent attempts.

A further independent Short handoff consulted official YouTube Help and
distinguished the two output packages in one response. It passed separate
grading. After the bounded recoveries, 60/60 individual cases and 49/49
registered checks passed. The final receipt preflight was complete, not
admission on its own; host cost and token telemetry were unavailable.

Frozen packet manifest hashes:

- Production: `d701e88be950750dbcb8f8f2cc787f6e49e56852de349f855e3bc4899a1030e6`.
- Formats: `6f3b878190b86866cfa7e7837cba80fb0202558c44fea47d739bdbc215a97837`.
- Computer use: `97acc5be780ee13e7f94de1dcaea00c4af68045debf7b81bc677459bb4efad41`.
- Initial decision receipt: `0b7a0a7fa029ed1053b87db44d52a190c7dff432de5b4c8114dc2969a57506eb`.
- Final decision receipt: `ff953ee306d59fe6af1d70e0001a3ab02bf260a2d603af2403a66e4f53d028e8`.

For a new take, use the [recording guide](../product-video-producer/references/computer-use-walkthrough.md)
and the opt-in browser regression in [TESTING.md](../TESTING.md). The recorder
uses [Playwright page video](https://playwright.dev/docs/videos) and
[browser mouse input](https://playwright.dev/docs/api/class-mouse). Neither
the input log nor successful encoding alone verifies the visible interaction.
