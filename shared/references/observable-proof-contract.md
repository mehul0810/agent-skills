# Observable Proof Contract

Use for user-visible web, macOS, game or other runtime acceptance. WordPress uses its existing behavior/proof adapter. This contract defines what was observed, not a universal visual aesthetic or automatic permission to test external systems.

## Smallest Honest Contract

Before testing, identify the exact artifact/revision, platform, workflow stage, environment and task. Write the necessary success/failure conditions and evidence needed. Use only scope-relevant checks; do not add every platform's checklist. Distinguish owner requirements from testable hypotheses so a preference cannot silently become a hard gate.

For each material clause report `pass`, `fail`, `blocked` or `out_of_scope`, its observation, and a reproducible evidence pointer. For an excluded check record the owner exclusion without implying it passed. A screenshot, test result or receipt must identify its actual target and state; a different revision or environment is not interchangeable.

## Evidence By Boundary

- Web: render the real page/app, inspect the changed region and a representative task at needed widths. Check actual assets/fonts, keyboard/focus, constrained content and relevant navigation/recovery. Capture evidence after interaction, not just the initial shell.
- macOS: run the actual native build in the supported environment and exercise the relevant window/menu/keyboard/state behavior. Browser/Figma approximations may explain a concept but cannot establish native rendering, OS permissions, persistence or packaging. If the runtime is unavailable, mark those clauses blocked while available portable tests proceed.
- Games: run the real playable target and representative camera/scene. Probe control response, restart/failure and state relevant to the brief; measure frame-time/memory against the project's explicit budget. Inspect asset credibility, lighting/material cohesion and silhouette/readability in play, not only a staged beauty frame. Label graybox and placeholder assets honestly.
- Other: name the actual runtime and user task. If the available observer cannot reach it, state the missing capability rather than substitute a familiar platform.

Synthetic fixtures prove only the exercised contract. They cannot establish production quality, native runtime, automatic skill activation, model superiority or a general creativity improvement.

## Craft Is Not Compliance

Evaluate finished appearance separately from mechanically testable correctness. For open-ended visual work, judge whether the composition, content, assets and interaction serve this particular brief; recognize coherent alternatives instead of rewarding one house style. For exact-target work, compare the approved target at matching states without reinventing it.

When comparing changes to skills, freeze the brief/content/time or artifact budget, tested source identities and rubric before running. Retain unsuccessful attempts, label evaluator subjectivity and compare counterexamples such as tiny fixes and constrained client UI. A keyword match, polished explanation, count of alternatives or passing proof schema is not visual quality evidence. Report ties, regressions and inconclusive outcomes.

## Independence And Recovery

For source-blind acceptance, give a fresh observer only the contract, target/build identity, access, safe fixtures and evidence requirements. No source, patch, implementation rationale or expected verdict. Report contamination. Separate design judgment from observable interaction checks; do not present an implementer's self-review as independent acceptance.

After a real defect, repair its owning layer and rerun the affected checks plus nearby regressions. When evidence is inaccessible, retain the blocked clause and smallest next verification step. Do not fabricate captures, relabel a plan as a run, or silently weaken acceptance to obtain green results.

## Optional Machine-Checked Receipt

For durable artifact-backed runs, `scripts/validate-platform-proof.mjs <record.json> <evidence-root>` checks schema version 1, platform/stage, target identity, observer independence, clause status/evidence links, local artifact hashes and runtime compatibility. Supply an immutable trusted evidence directory; concurrent untrusted writers are not supported. Screenshot receipts currently accept bounded non-interlaced 8-bit grayscale/RGB/RGBA PNG only, with chunk/CRC/scanline validation, not video/JPEG. Other capture formats can remain human-reviewed evidence outside this optional validator. The executable examples in `scripts/test-platform-proof.mjs` demonstrate the shape. It rejects browser proof for native-app passes and logs presented as appearance proof, while retaining explicit blocked and failed clauses. Successful validation means receipt integrity only, not all clauses passed, capture authenticity, visual quality or permission to publish. Do not require this receipt for a tiny task that only needs a truthful inline result.
