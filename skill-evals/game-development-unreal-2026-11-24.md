# Unreal Engine guidance: evidence and limits

Epic's [5.9 notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-9-release-notes) identified Preview 2 on 2026-11-24. The [Web packaging guide](https://dev.epicgames.com/documentation/unreal-engine/packaging-your-project-for-webassembly?lang=en-US) still included a Preview 1 C++ prerequisite; the newer notes explicitly remove it for Blueprint-only projects. The guide's matching SDK and browser hosting requirements still apply. The skill does not require Unreal for photographic art.

## Decisions

Freeze the [Unreal briefs](cases/game-development-unreal/input.json) and [general game briefs](cases/game-development/input.json) with the packet builder. Give the performer the requests, listed artifacts and frozen skill, not the [Unreal scoring criteria](cases/game-development-unreal/criteria.md) or [general criteria](cases/game-development/criteria.md). Grade the two sets separately.

An initial review identified missing cross-origin isolation; a second identified missing range and cache policies. Both were corrected against Epic's hosting section. A subsequent run at `f06805a` scored 4/5 Unreal and 8/8 general: the browser case did not distinguish a hosted GPU stream from local execution. The revised brief asks about that proposed alternative without changing the scoring requirement.

**Final result:** at source `377f408356161d1490b524955f4e2ca21b433fd7`, with skill tree `a3e39177b8c0230553380a1d297af1da89cff007`, a fresh performer answered the two blind packets. A different evaluator scored **5/5 Unreal** and **8/8 general game** decisions. The same skill tree passed **3/3 separate routing decisions**: use the realism reference for in-game lighting and controls, the Unreal reference for an existing Blueprint game's packaged map, and neither for a trailer-only request. These are decisions, not executions.

| Identity | SHA-256 |
|---|---|
| Unreal packet digest | `d02b12586566fa062af9d0d13433f234acc5c50a3484f7e32814630a355a6ec9` |
| General packet digest | `91e5970b46af164ecd8fbd46c5a765311385a8cc74ab8e7806fd51f8348c3d18` |
| Final decision response | `25766757cf99e1f28b9e0ea9987214e1a16ec5ef36377983d85442431ec8c5c5` |
| Independent grade, including routing | `8de66dfadcfad21674734a824ed644e0ea97a1c2ed6a56eab9e33776f0473819` |

## Native editor

The locally installed macOS editor reported **5.8.4, changelist 58902052**. In a disposable, content-only project, one headless process created a level and saved a named TargetPoint. A second process reopened the saved map and verified exactly one matching actor, its class, label and position `(125, 25, 80)`. Both editor commandlets exited 0. Map SHA-256: `8e49da3bf340369b7ae99c24aeaf484a233396c73fa46ff15507d613eb6579b4`.

Earlier startup attempts did not pass: the initial sandboxed process stalled, a named cache graph was missing, and a later cache path exceeded the engine's limit. The successful runs used macOS services and a short, task-local cache. This proves **5.8.4 editor persistence**, not gameplay, rendering, timing, packaging, migration between versions, Windows hosting or execution of 5.9.

## Playable controls

The two pre-existing offline browser pilots were attempted with skill tree `e728b24e9f574f4ae4a0bf9fa775bff458cbcb65`, not with an Unreal executable. Their fixed-camera game paths did not use the Unreal reference.

- No supplied art: the first playable implementation looked illustrated. A separate recovery embedded original generated artwork in a 338,438-byte HTML file. A headless Chrome run exercised keyboard miss/correction/success and pointer reset, drag and submit. The moving parts are 2D overlays; status text fell below the capture at the tested viewport. Neither human play nor frame pacing was measured.
- Supplied art: the 486,063-byte HTML file embedded the supplied JPEG unchanged and its JavaScript parsed. Browser policy blocked opening this artifact, so needle alignment, keyboard/pointer interaction and restart on this run remain **unverified**. The [older pilot](game-development-review-2026-11-20.md) used a different artifact and does not close this gap.
