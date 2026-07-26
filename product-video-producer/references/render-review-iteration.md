# Editing, Render, Review, And Iteration

Use this after a storyboard/beat sheet exists, for editing supplied footage, or when reviewing/revising an existing render.

## Edit And Conform Contract

Prove the exact project root, source revision or project-file hash, sequence/composition ID, job ID, and expected output role/path before editing or probing an artifact. A plausible MP4 elsewhere is not completion evidence.

- Ingest originals read-only with hashes, rights, source frame rate/timecode, color interpretation, audio channels, and capture provenance. Mark corrupt or partial media logically excluded and preserve it in place; moving, renaming, replacing, or deleting owner footage requires approval.
- Use proxies for performance when needed, but retain a source-to-proxy map and relink/conform check. Transcode variable-frame-rate or incompatible sources before precision edits; do not silently resample cadence.
- Version the timeline non-destructively. A rough cut proves structure and a fine cut proves timing/continuity. The review owner approves picture lock before final sound, color, captions, and graphics; an editorial change after lock revokes it until the changed cut is approved again.
- Preserve a truthful source chronology for software demos and evidence sequences. J/L cuts, punch-ins, and pace compression may improve clarity but cannot manufacture a product outcome.
- Record source, timeline, master, review derivative, poster, captions, and cutdowns as a small lineage graph. Small programmatic videos may mark proxy/conform/master steps `not_applicable` with a reason.

Every cut, speed change, transition, graphic, sound cue, and camera move needs a narrative, attention, continuity, or comprehension job. Remove effects that only signal "premium." Check mobile legibility, cursor purpose, UI crop continuity, visual breathing room, and whether narration and on-screen copy complement rather than duplicate each other.

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

The manifest records immutable project/job/output identity, source/timeline lineage, storyboard/version, render toolchain, rational frame rate/frame count, color/audio profile, rights/provenance, claims/disclosure, output hashes/probes, accessibility decisions, approval receipt, validation, and known gaps. Resolve relative paths from the project root. Draft validation may inspect the manifest alone. Acceptance or completion must run `../scripts/validate-video-manifest.mjs` with `--verify-files --verify-media` and an independently supplied tuple covering job/project/root, source revision, project-file hash, sequence, timeline, dirty-state hash, artifact ID/hash/role/path, and approval owner. Use the corresponding `--expected-*` flags, including `--expected-artifact-sha256` and `--expected-approval-owner`; values copied from the manifest are not independent proof.

## Sound, Color, And Accessibility

- Prioritize intelligible dialogue, consistent perspective, clean edits, controlled noise, deliberate music/SFX, sync, mono compatibility, and sensible dynamics. Review on reference headphones, laptop speakers, and a mobile device; do not rely on platform enhancement to rescue the mix.
- Normalize and grade through an explicit color-managed path, inspect scopes, and verify representative target displays. Do not relabel SDR/P3 media as HDR or apply LUTs without source/output interpretation.
- Human-review caption wording, timing, line breaks, speaker changes, and meaningful non-speech cues. Never rely on auto-captions as final proof.
- Decide whether essential visual/UI information is already spoken. Otherwise supply integrated narration, audio description, or a descriptive transcript appropriate to the destination.
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

Live-check destination specifics at delivery. Stable anchors: [Adobe color management](https://helpx.adobe.com/premiere/desktop/correct-color/set-up-color-management/configuring-sequence-color-management.html), [EBU loudness measurement](https://tech.ebu.ch/loudness/), [W3C prerecorded captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded), [W3C audio description](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html), and [W3C flash limits](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html). Last reviewed: 2026-07-26.
