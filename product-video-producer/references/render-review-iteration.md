# Editing, Render, Review, And Iteration

Use this after a storyboard/beat sheet exists, for editing supplied footage, or when reviewing/revising an existing render.

## Edit And Conform Contract

Prove the exact project root, source revision or project-file hash, sequence/composition ID, job ID, and expected output role/path before editing or probing an artifact. A plausible MP4 elsewhere is not completion evidence.

- Ingest originals read-only with hashes, rights, source frame rate/timecode, color interpretation, audio channels, and capture provenance. Mark corrupt or partial media logically excluded and preserve it in place; moving, renaming, replacing, or deleting owner footage requires approval.
- Use proxies for performance when needed, but retain a source-to-proxy map and relink/conform check. Transcode variable-frame-rate or incompatible sources before precision edits; do not silently resample cadence.
- Version the timeline non-destructively. The assigned reviewer approves picture lock before final sound, color, captions, and graphics; delegated internal review is sufficient unless owner review is required. Editorial changes revoke lock and affected proof, not unrelated authority.
- Preserve a truthful source chronology for software demos and evidence sequences. J/L cuts, punch-ins, and pace compression may improve clarity but cannot manufacture a product outcome.
- Record source, timeline, master, review derivative, poster, captions, and cutdowns as a small lineage graph. Small programmatic videos may mark proxy/conform/master steps `not_applicable` with a reason.

Every cut, graphic, sound cue and camera move needs a narrative or comprehension job. Check mobile legibility, cursor purpose, crop continuity, breathing room, and complementary narration/copy.

## Deterministic Render Contract

Choose and record one explicit delivery profile:

- `1080p`: 1920x1080.
- `4K UHD`: 3840x2160, only when the intended channel and source assets justify it.
- Preserve native/source cadence when practical. Record rational frame rate, frame count, timebase, scan, pixel aspect, and pixel format; deliver progressive constant-frame-rate derivatives unless the destination contract requires otherwise.
- Square pixels, explicit duration, and color primaries/transfer/matrix/range. Default enterprise web work to color-managed Rec.709 SDR; HDR is opt-in and needs an end-to-end monitored grade plus a separately reviewed SDR version.
- Use 48 kHz audio when audio exists. Define and measure the channel/client loudness and true-peak target; YouTube does not publish a universal required LUFS value.

Use a repeatable timeline/build pipeline. Pin tool versions, fonts, asset paths/hashes, timing, random seeds, color/audio settings, and render command or project version. Do not claim 4K quality by upscaling weak source assets; report the limitation. Keep review and master profiles separate when the master codec is not practical for review.

## Required Review Package

Produce:

1. Review MP4 at the selected frame size, normally H.264 for compatibility.
2. Intentional poster frame at native resolution, free of transient blur, awkward mid-motion states, or misleading UI.
3. Machine-readable manifest based on `../assets/video-manifest.template.json`.
4. Accurate timed captions for speech and meaningful audio, plus a transcript when the destination or audience needs one. These are distinct artifacts.
5. Optional master/intermediate only when requested and supported by the environment.

The manifest binds identity, lineage, storyboard, toolchain, media profile, provenance, claims, hashes, accessibility, approval receipt and gaps. Resolve paths from the project root. Draft validation may inspect metadata alone. Acceptance must run `../scripts/validate-video-manifest.mjs` with `--verify-files --verify-media` and independent job/project/root, source, project-file, sequence, timeline, dirty-state, artifact and approval-owner identity. Supply the corresponding `--expected-*` flags, including `--expected-artifact-sha256` and `--expected-approval-owner`; copying manifest values is not independent proof.

## Sound, Color, And Accessibility

- Prioritize intelligible dialogue, consistent perspective, clean edits, controlled noise, deliberate music/SFX, sync, mono compatibility, and sensible dynamics. Review on reference headphones, laptop speakers, and a mobile device; do not rely on platform enhancement to rescue the mix.
- Normalize and grade through an explicit color-managed path, inspect scopes, and verify representative target displays. Do not relabel SDR/P3 media as HDR or apply LUTs without source/output interpretation.
- Human-review caption wording, timing, line breaks, speaker changes, and meaningful non-speech cues. Never rely on auto-captions as final proof.
- For WCAG 2.2 AA prerecorded synchronized video, convey important visuals in existing audio or add integrated narration/audio description (`1.2.5`); a descriptive transcript alone is not a substitute. Provide prerecorded captions (`1.2.2`) and live captions (`1.2.4`) when applicable. Record the destination, visual-information coverage, and manual review evidence.
- Check that captions do not obscure UI, no sequence exceeds the applicable flash threshold, and embedded/autoplay usage has a poster, player controls, and reduced-motion fallback when relevant.
- For locale variants, preserve separate text, caption, and audio tracks; identify locale-specific UI; and check text expansion, glyph/RTL behavior, pronunciation, timing, and crop safety before deriving localized outputs.

## QA Gate

- Probe the exact expected artifact and verify codec, frame size, rational frame rate/frame count, duration, pixel format, scan, color tags, audio layout/rate, and integrity against the manifest. Acceptance validation recomputes media evidence with `ffprobe` and fails closed when it is unavailable; another parser may support draft investigation but is not completion proof until the validator supports it.
- Review the first/last frame, every cut, title hold, logo appearance, caption, and representative motion frame at 100%.
- Check spelling, line breaks, adaptive/mobile safe areas, contrast, hierarchy, clipping, banding, flicker/flash, judder, unintended blank frames, sync, dialogue intelligibility, loudness/true peak, and audio transitions.
- Inspect logos over light and dark frames for matte boxes, halos, color shifts, distortion, and insufficient clear space.
- Confirm every UI frame is real and versioned or unmistakably conceptual. Confirm every product/scale/security/outcome claim has evidence.
- Compare the render to storyboard acceptance criteria, not merely to source code or timeline settings.

## Critique Loop

Translate user critique into a compact change ledger:

| Field | Meaning |
|---|---|
| User feedback | Exact concise request |
| Interpretation | Proposed observable change |
| Location | Shot and timestamp |
| Invariants | Approved elements to preserve |
| Proof | Frame, clip, or technical check |
| Status | Pending, changed, accepted, or blocked |

Do not reinterpret precise values or broaden a local note into a redesign. For ambiguous critique, offer the smallest concrete interpretation and identify the decision needed. Render the affected shot/range first when possible; invalidate its dependent conform/derivatives, rebuild them after approval, and rerun affected technical/content checks. Preserve versioned outputs and never overwrite the last approved master.

When feedback reveals a repeatable failure, record the owning cause, correction, regression proof, and destination: project brief/template for production-specific learning, this skill through reviewed maintenance for reusable behavior, or no durable artifact for a one-off preference. Do not let the edit silently relearn or rewrite approved rules.

Stop when the storyboard acceptance criteria and critique ledger pass, required artifacts exist, and any remaining quality tradeoff is explicitly accepted. Privacy, consent, rights, product-truth, accessibility, and output-identity failures remain blocking. More polish without a named defect is not a reason for another render.

## Official Anchors

Verify destination specifics at delivery: [color management](https://helpx.adobe.com/premiere/desktop/correct-color/set-up-color-management/configuring-sequence-color-management.html), [loudness](https://tech.ebu.ch/loudness/), [captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded), [audio description](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html), [flash limits](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html).

## Programmatic Motion Adapter

For typography/UI video, evaluate [Remotion](https://www.remotion.dev/docs/); retain proven editors for footage. The optional `../assets/motion-starter/` provides an adaptable deterministic vector starter, not a required aesthetic or production acceptance. Inspect its usage before execution. No implicit global installs or paid rendering.

Separate typed scenes, assets and timing manifest. Use frame-driven animation, never wall-clock timers, unseeded randomness or live network content. Pin dependencies/fonts, await assets and test shot boundaries. Capture real UI separately; generation cannot own exact text/logos or workflow proof.

Use cheap previews plus full-resolution representative ranges before a full render; honor explicit 4K requests. Poster-only edits do not rerender video. Benchmark concurrency and separate model/render costs. Follow current owner model allocation, not historical model ceilings.

## Fidelity And Consistent Acceptance

Run `../scripts/check-shot-fidelity.mjs` on measured source/crop/maximum-zoom footprints; see `../assets/shot-fidelity.example.json`. Coverage is not sharpness proof; vector wrappers cannot exempt embedded rasters. Inspect encoded text/logo edges, gradients, compression and UI detail at 100% and intended display size. Record encoding settings; never equate upscaling or bitrate with quality.

Compare permitted model/effort trials on identical briefs/assets/gates; record settings, revisions, retries, defects and available costs. Separate held-out clips from repair cases. Missing telemetry/playback remains unknown. Repair failures, use permitted runtime escalation, or mark draft. One render cannot certify all-model equivalence.

## Playback Calibration Gate

Before claiming smooth enterprise quality, review the complete rendered artifact at normal speed with audio, then inspect suspect ranges frame-by-frame. A contact sheet, valid manifest or successful render cannot pass this gate. If playback/audio inspection is unavailable, deliver a clearly labeled draft with the exact gap, not an accepted master.

Use short controlled fixtures for: unreadable title hold, inconsistent easing, competing focal objects, crop/zoom legibility loss, discontinuous transition, audio cue offset, and logo matte artifacts. Include a clean control. Independent review receives the brief and rendered clips without the defect answer key; report detected/missed/false-positive results separately from technical tests. Store the render/toolchain identity and timecoded evidence. Scenarios without rendered fixtures are policy tests only, not motion calibration.

Score narrative, composition, motion, audio and brand/product fidelity pass/fail/blocked. Repair named defects, preserve approved direction and rerender dependencies. Stop when QA passes; never guarantee first-render perfection or polish without an observable defect.
