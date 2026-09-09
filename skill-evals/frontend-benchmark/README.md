# Small Rendered Frontend Benchmark

Purpose: catch a polished-looking but behaviorally wrong composition without building a new benchmark framework. This is an offline HTML rendering harness with genuine serialized WordPress core group, heading, paragraph, columns, and button blocks in `blocks.html`. Its CSS approximates a target design; it does not load WordPress or Gutenberg.

For a fresh source-design-to-native-WordPress build and repair attempt, use
`EXECUTION.md`. That separate execution test requires independent fidelity and
visible author editing proof; this fixture remains a discrimination test.

## Run

Serve this directory with any loopback HTTP server, then open `index.html?variant=a`. The page loads `blocks.html` via fetch, so file URLs are unsupported. No network fonts, images, or remote application dependencies are needed.

For automated browser screenshots and source-aware geometry/persistence smoke checks:

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright \
CHROME_PATH=/absolute/path/to/chrome \
node skill-evals/frontend-benchmark/capture.cjs
```

Omit environment overrides if Playwright and its Chromium are installed conventionally. Output defaults to ignored `output/playwright/frontend-benchmark`; set `BENCH_OUTPUT` to isolate a run. Every variant/viewport gets a fresh browser context. The script starts an ephemeral loopback server, captures ten screenshots before mutations, tests persisted headings, and closes its browser/server. Browser launch/listen may require sandbox approval. No dependency or package-lock changes are needed.

## Author Key (Do Not Give To Blind Evaluator)

| Variant | Deliberate difference |
| --- | --- |
| a | Reference |
| b | Unbalanced 64px top / 8px bottom card padding |
| c | Buttons follow paragraph height instead of sharing a desktop baseline |
| d | Mobile columns force an 850px minimum width |
| e | Simulated editor reports saved data but visible heading ignores it |

Spacing is independently visually graded, not given a passing score by the smoke checks. Alignment, overflow, and persistence assertions confirm fixture mutations exist; they are not independent reviewer scores. There is no automatic composite quality score.

## Independent Evaluation

Use a fresh source-blind evaluator with only `CONTRACT.md`, target URL, viewport sizes, and the screenshot files. Do not share this README, source, author key, or smoke JSON. Record visual and usability scores separately and mark untested clauses blocked. Save evaluator identity, target file hashes, browser version, evidence paths, and contamination status in the owning review evidence. Fixture authors cannot claim independent validation of their own work.

For actual WordPress proof, import `blocks.html` into a disposable WordPress page via the editor code view, verify all blocks are valid native blocks, supply scoped styles, change content in the visual editor, save/reopen, and verify frontend desktop/mobile output. This step has not been executed here. In particular, variant e is only an editor-ownership *analogue*, not a reproduced Gutenberg/editor defect.

## Captured Smoke Evidence

A local Chrome 152.0.7977.76 run on 2026-09-06 captured ten full-page screenshots and passed all 25 overflow, persistence, and desktop-alignment assertions. Actual browser version is recorded in `/private/tmp/frontend-benchmark-proof/smoke.json`; screenshots are adjacent (`a-1280.png` through `e-390.png`). These temporary files are not portable durable proof and are not committed. Independent screenshot grading is recorded in `evaluation-2026-09-06.md`; interaction and WordPress runtime gates remain pending. The Playwright CLI wrapper could not download from npm (`ENOTFOUND`); capture used the preinstalled bundled Playwright library instead.

## Source-Fidelity Extensions

Variants f-j add oversized heading/hero inset, wrong font metrics, excessive section gap, border/radius drift and intermediate-only overflow respectively. Capture now includes 1280, 768 and 390 widths (30 images). Use variant a as the selected target; retain original image dimensions and compare same-viewport crops. These defects require independent fidelity/design grading, not merely passing the script's geometry assertions.

For native WordPress coverage, use an already authorized proof environment: import the serialized blocks and scoped theme styles, capture the baseline, then introduce a task-owned Global Styles spacing override. Confirm computed style ownership, detect divergence, restore only that task-owned change and reprove. Save/reopen representative heading, media and link edits and compare editor/frontend output. Do not create a Studio site or overwrite existing user styles. Record candidate, environment, before/after artifacts and cleanup/proof gaps. This native procedure is required calibration work, not evidence it has already run.
