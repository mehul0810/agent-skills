# Game engine and session evidence

The game skill chooses a stack from the game's constraints. It does not install an editor, convert a project, or add online services just because a playbook exists. The [eight engine and session briefs](cases/game-development-engine-routes/input.json) have [separate grading criteria](cases/game-development-engine-routes/criteria.md).

## Decision runs

At `10c02c9`, a fresh performer and independent scorer passed 8/8 engine/session, 8/8 general gameplay and 5/5 Unreal decisions. This did not detect an actual focus bug in an offline pilot. After adding a pointer-to-keyboard case, a separate run at `5cfe7ea` scored **4/8, 8/8 and 4/5**. Proposed test plans omitted the web loader/build settings, the visible focus cue distinct from selected content, matched export templates, or a before/after frame-time comparison. The guides were corrected and the new packet now asks for reproducible build prerequisites. The grading criteria were not relaxed.

**Final decisions:** Three fresh performers each received only their packet and the frozen skill. A separate scorer graded **8/8 engine/session, 8/8 general and 5/5 Unreal**. Source: `68d26e4f0ec5750b4a4c99ac5e575a7f774d8f57`; skill tree: `5271d2c40f7eda37f7fd504756f63919b22902d2`. The source tree and all three packet manifests were verified before publication. This is one complete decision run, not a guarantee about future game builds.

| Frozen identity | SHA-256 |
|---|---|
| Engine/session packet | `40c4bdd535fceca8dc032c0cf6f0102a7c6e78d141f9792829eb65738e2c366f` |
| General packet | `91e5970b46af164ecd8fbd46c5a765311385a8cc74ab8e7806fd51f8348c3d18` |
| Unreal packet | `d02b12586566fa062af9d0d13433f234acc5c50a3484f7e32814630a355a6ec9` |
| Independent grading report | `8126b033a9048c02091682cdaf8e8e0351a15b6df6f9eeb1a47854500aa773c8` |

## Runtime pilots

- **Three.js:** An original, locally served calibration game used the locked npm package `three@0.180.0` and headless Chrome 158 with WebGL 2 on ANGLE SwiftShader. In the first pilot a pointer hit all three objects, reset worked, and twenty resets retained two geometries and zero textures. Those counters do not prove arbitrary asset-heavy games are leak-free. That run did not prove keyboard-only selection.
- **Keyboard recovery:** A separate build added a focus ring and exposed the same world action to keyboard and pointer. Tab focused the canvas; arrows selected objects, Enter/Space completed all three, and R reset. After the viewport changed from 1000 x 850 to 540 x 720, a pointer hit the intended object on the now-offset canvas. This is rendered interaction on one software backend, not WebGPU, target-device speed, or assistive-technology conformance.
- **Browser saves:** A disposable IndexedDB fixture committed a migrated slot separately from its old source. A second write reported request success but then aborted. A new Chrome process reopened the same isolated profile and origin without reseeding; the original, migrated, unknown-newer and malformed slots all retained their expected bytes. This tests a graceful restart, not power-loss durability or other storage backends. Restart result SHA-256: `ac656d134aa15468d7c4c5bacc8145e25a23f557b28b8bd294aae77aa4942bdf`.
- **Unity:** No editor was found in the checked local installation paths, PATH or application index. No editor was installed or activated. The guidance was reviewed against Unity's [build profiles](https://docs.unity3d.com/6000.0/Documentation/Manual/build-profiles-reference.html) and [pipeline matrix](https://docs.unity3d.com/6000.0/Documentation/Manual/render-pipelines-feature-comparison.html); there was no Unity player run.
- **Godot:** The official 4.5.1 macOS archive matched its published SHA-512, but the extracted app did not pass strict macOS signature verification. Earlier headless output was excluded from accepted evidence; no exported player or Web target was verified. Do not work around a failed trust check. Use the [Web export documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) for the pinned minor.

## Existing game regressions

Both existing fixed-camera briefs used skill tree `882cc5f7768e9ea9713246e64c64ecb590d95701`. These are native browser interactions with offline HTML, not Unity, Godot or Unreal exports.

- **No supplied art:** The 448,179-byte file embedded an original generated plate and animated needle. At 1280 x 913 the tester observed a miss, corrected it with the keyboard, started another calibration and passed using pointer drag. A needle highlight was repaired and the path replayed. No physical reference comparison, human play or frame-time benchmark was performed.
- **Supplied art, initial result:** The 485,955-byte file contained the original JPEG bytes. Synthetic DOM calls suggested the full round worked. An isolated Chrome run at 1200 x 1000 instead showed that clicking the knob did not transfer keyboard focus: trim stayed at zero, and the apparent success field contained a second miss. The test process nevertheless exited zero. This led to the new focus and outcome-assertion checks; the original run remains a failure.
- **Supplied art, recovery:** The repaired pointer handler intentionally focused the pictured knob before canceling the press. A test with explicit state assertions failed against the original HTML, then passed against the corrected offline file: Tab-only play, miss, pointer-to-keyboard correction, next round, drag and restart. The captured frames showed the visible focus ring and needle aligned with zero. Tested HTML SHA-256: `65cc8b4fd7d8c97b4fe54a8abd12e61c36989ebc8d5de9394937e5f5d6ce06fd`. This was one headless desktop browser, not a physical controller, screen-reader or performance test.
