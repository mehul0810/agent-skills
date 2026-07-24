# Render, Review, And Iteration

Use this after a storyboard exists or when reviewing/revising an existing render.

## Deterministic Render Contract

Choose and record one explicit delivery profile:

- `1080p`: 1920x1080.
- `4K UHD`: 3840x2160, only when the intended channel and source assets justify it.
- Constant frame rate selected for the brief, commonly 24, 25, or 30 fps.
- Square pixels, explicit duration/timebase, Rec.709 SDR unless another governed profile is required, and 48 kHz audio when audio exists.

Use a repeatable timeline/build pipeline. Pin tool versions, fonts, asset paths/hashes, timing, random seeds, color/audio settings, and render command or project version. Do not claim 4K quality by upscaling weak source assets; report the limitation. Keep review and master profiles separate when the master codec is not practical for review.

## Required Review Package

Produce:

1. Review MP4 at the selected frame size, normally H.264 for compatibility.
2. Intentional poster frame at native resolution, free of transient blur, awkward mid-motion states, or misleading UI.
3. Machine-readable manifest based on `../assets/video-manifest.template.json`.
4. Captions/transcript when speech or meaningful on-screen copy requires an accessible alternative.
5. Optional master/intermediate only when requested and supported by the environment.

The manifest records source version, storyboard/version, render command/toolchain, canvas, frame rate, duration, color/audio profile, asset provenance and hashes, claims evidence, output hashes, validation, and known gaps.

## QA Gate

- Probe the exported file and verify codec, frame size, frame rate, duration, audio, and file integrity against the manifest.
- Review the first/last frame, every cut, title hold, logo appearance, caption, and representative motion frame at 100%.
- Check spelling, line breaks, text safe areas, contrast, hierarchy, clipping, banding, flicker, judder, unintended blank frames, and audio peaks/transitions.
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

Do not reinterpret precise values or broaden a local note into a redesign. For ambiguous critique, offer the smallest concrete interpretation and identify the decision needed. Render the affected shot/range first when possible; after approval, rerender the full output and rerun affected technical/content checks. Preserve versioned outputs and never overwrite the last approved master.

Stop when the storyboard acceptance criteria and critique ledger pass, required artifacts exist, and remaining gaps are explicitly accepted. More polish without a named defect is not a reason for another render.
