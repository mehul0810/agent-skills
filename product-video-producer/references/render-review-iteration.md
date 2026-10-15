# Editing, Render, Review, And Iteration

## Edit And Conform Contract

Prove the exact project root, source revision/file hash, sequence/composition, job, and expected output role/path before editing/probing. An MP4 elsewhere is not proof.

- Ingest originals read-only; record hashes, rights, cadence/timecode, color, audio and provenance. Logically exclude corrupt/partial media but preserve in place. Moving, renaming, replacing/deleting owner footage requires approval.
- For proxies, retain a source-to-proxy map and relink/conform check. Transcode VFR/incompatible sources before precision edits; never silently resample.
- Version timelines non-destructively. Assigned reviewer approves picture lock before final sound, color, captions, and graphics; delegated internal review suffices unless owner review is required. Editorial changes revoke lock and affected proof, not unrelated authority.
- Preserve truthful chronology: J/L cuts, punch-ins and compression cannot manufacture outcomes.
- Record source-to-cutdown lineage. Programmatic video may mark proxy/conform/master `not_applicable` with reason.

Check mobile legibility, cursor and crop. Owner-excluded narration verification is not required or requested unless explicitly restored. Record excluded, never passed; preserve technical audio, captions and all other safety gates. Do not claim verified narration or accessibility conformance.

## Deterministic Render Contract

Choose delivery profile:

- `1080p`: 1920x1080.
- `4K UHD`: 3840x2160, only when the intended channel and source assets justify it.
- Preserve cadence; record rate, frames, timebase, scan, pixel aspect and format. Derivatives are progressive CFR unless required otherwise.
- Use square pixels, duration and color tags. Default enterprise web to managed Rec.709 SDR; HDR needs monitored grade and separate reviewed SDR.
- Audio: 48 kHz; measure channel/client loudness and true peak. YouTube does not publish a universal required LUFS value.

Use repeatable pipeline; pin tools, fonts, asset hashes/paths, timing, seeds, color/audio settings and render command/version. Upscaling weak sources is not 4K quality; report limits. Separate review/master profiles when codec is impractical for review.

## Required Review Package

Produce:

1. Review MP4 at selected size, normally H.264.
2. Intentional poster frame at native resolution, free of blur, awkward motion or misleading UI.
3. Machine-readable manifest based on `../assets/video-manifest.template.json`.
4. Human-checked timed captions for speech/meaningful audio; add a transcript when needed. They are distinct artifacts.
5. Optional master/intermediate only if requested and supported.

Manifest binds identity, lineage, storyboard, toolchain, profile, provenance, claims, hashes, accessibility, approval receipt and gaps; paths are project-root relative. Draft checks may inspect metadata only. Acceptance runs `../scripts/validate-video-manifest.mjs --verify-files --verify-media` with independent job/project/root, source/project, sequence, timeline, dirty-state, artifact and approval-owner identity. Pass `--expected-*`, including `--expected-artifact-sha256`; copied values are not independent proof.

## Sound, Color, And Accessibility

- Prioritize clear dialogue, perspective, clean edits, noise control, deliberate music/SFX, sync, mono and dynamics. Review headphones, laptop and mobile; platform enhancement cannot rescue mix.
- Color-manage; inspect scopes/displays. Never relabel SDR/P3 as HDR or apply LUTs without source/output interpretation.
- Human-review caption wording, timing, line breaks, speakers and meaningful non-speech cues. Never rely on auto-captions as final proof.
- For WCAG 2.2 AA prerecorded synchronized video, convey important visuals in audio or add integrated narration/audio description (`1.2.5`); a descriptive transcript alone is not a substitute. Provide prerecorded (`1.2.2`) and applicable live captions (`1.2.4`). Record destination, visual coverage and manual evidence.
- Captions must not obscure UI; meet flash limits. Embedded/autoplay video needs poster, controls and relevant reduced-motion fallback.
- Locale variants preserve separate text, caption, and audio tracks plus locale UI identification; check expansion, glyph/RTL, pronunciation, timing and crop safety.

## QA Gate

- Probe the exact artifact against manifest: codec, size, rational rate/count, duration, pixel format, scan, color, audio layout/rate and integrity. Acceptance recomputes evidence with `ffprobe` and fails closed if unavailable; other parsers are draft-only until supported by validator.
- Review endpoints, cuts, title holds, logos, captions and representative frames at 100%.
- Check copy, safe areas, contrast, clipping, banding, flicker, judder, blanks, sync, dialogue and audio transitions/levels. In 3D inspect encoded motion for intersections, stray geometry, popping and guides, not just keyframes.
- Check logos on light/dark frames for matte boxes, halos, color shifts, distortion and clear space.
- Confirm UI is real/versioned or unmistakably conceptual, and product/scale/security/outcome claims evidenced.
- Compare the render to storyboard acceptance criteria, not merely to source code or timeline settings.

## Critique Loop

Track critique in a compact ledger:

| Field | Meaning |
|---|---|
| User feedback | Exact concise request |
| Interpretation | Proposed observable change |
| Location | Shot and timestamp |
| Invariants | Approved elements to preserve |
| Proof | Frame, clip, or technical check |
| Status | Pending, changed, accepted, or blocked |

Do not reinterpret exact values or turn local notes into redesign. For ambiguity, offer smallest interpretation and decision. Render affected range first; invalidate dependencies, rebuild after approval and rerun checks. Version outputs; never overwrite approved master.

For repeatable failures record cause, correction, regression proof and destination: project brief/template, reviewed skill maintenance, or nothing for one-off preference. Edits cannot silently rewrite approved rules.

Stop when storyboard criteria and ledger pass, required artifacts exist, and remaining tradeoffs are accepted. Privacy, consent, rights, product-truth, accessibility, and output-identity failures remain blocking. Polish without a named defect does not justify another render.

## Official Anchors

Verify destination requirements: [color](https://helpx.adobe.com/premiere/desktop/correct-color/set-up-color-management/configuring-sequence-color-management.html), [loudness](https://tech.ebu.ch/loudness/), [captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded), [audio description](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html), [flash](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html).

## Programmatic Motion Adapter

For typography/UI video consider [Remotion](https://www.remotion.dev/docs/); retain proven footage editors. Optional `../assets/motion-starter/` is a deterministic adaptable vector starter, not required aesthetic/acceptance. Inspect usage first; no global installs or paid rendering.

Separate typed scenes/assets/timing manifest. Use frame-driven animation, never wall-clock timers, unseeded randomness or live network. Pin dependencies/fonts, await assets, test boundaries. Capture real UI separately; generation cannot prove exact text/logos/workflows.

Compile beats to frame-indexed tracks: stable IDs, poses, reading holds, cue frames and overlaps. Preserve objects; test position/scale/velocity at handoffs except intentional cuts. Render risky transitions first; inspect encoded in-betweens/playback. Easing cannot rescue absent visible action.

Preview and render full-resolution ranges before full renders; honor explicit 4K. Poster edits do not rerender video. Measure concurrency; separate model/render cost. Follow owner allocation.

## Fidelity And Consistent Acceptance

Run `../scripts/check-shot-fidelity.mjs` on measured source/crop/maximum-zoom footprints; see `../assets/shot-fidelity.example.json`. Coverage is not sharpness; vector wrappers do not exempt rasters. Inspect encoded text/logo edges, gradients, compression/UI at 100% and target size. Record encoding; upscaling/bitrate is not quality.

Compare permitted model/effort trials on identical briefs/assets/gates; record settings, revisions, retries, defects, costs. Separate held-out from repair clips. Missing telemetry/playback is unknown. Repair, permitted escalation or mark draft; one render cannot certify model equivalence.

## Playback Calibration Gate

Before claiming smooth quality, review full render at normal speed and suspect ranges frame-by-frame; honor the narration exclusion above. Contact sheet, manifest or successful render cannot pass. Missing playback/other audio proof remains a draft gap. Excluded narration alone permits completion: record `known_gaps` category `audio`, disposition `accepted`, owner directive in `evidence`, approval owner in `accepted_by`. This accepts omitted verification, not narration quality or another defect.

Use short fixtures for unreadable holds, easing inconsistency, competing focal objects, crop/zoom legibility loss, discontinuity, cue offset and logo matte; include clean control. Independent reviewer gets brief/clips without answer key; report hits/misses/false positives separately from technical tests. Store render/toolchain ID and timecodes. Without rendered fixtures, scenarios test policy, not motion.

Score narrative, composition, motion, audio and brand/product fidelity pass/fail/blocked. Repair named defects, preserve approved direction and rerender dependencies. Stop when QA passes; never guarantee first-render perfection or polish without an observable defect.
