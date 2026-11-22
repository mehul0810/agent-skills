# Record A Walkthrough

Start with one thing a viewer should be able to do. A walkthrough of a product needs that product, not a lookalike. A fictional rehearsal can prove the recording method; label it as such.

## Direct The Take

Make a short take card: **build/role/fixture | starting screen | viewer's question | visible action | evidence/hold | stop before**. For example: "Can I check the paper before sending? Open the proof; find the two versions; compare; hold on the change from white to ivory and on 'Not sent'. End there." This is an editorial intention, not permission to send.

Rehearse off-record. Start the take at an intelligible state, not at login. Let the viewer find the control, name it in the words on screen, act once, then rest on what changed. Use a short contextual line ("We're checking the paper, not sending the job"), not a recital of clicks. Keep a meaningful loading state or label a compressed wait. Use keyboard focus when that is the clearer path. Never add random mouse wobble, pretend hesitation, simulated success or a fabricated human endorsement. If the recorder omits the hardware cursor, verify what the viewer can actually follow; a labeled editorial highlight is not a captured pointer.

## Control And Capture

Identify both the supported **controller** and the **recorder of the same surface**. A screenshot/AX tree or an action log is not video. Prefer an isolated tab or exact app window; turn off microphone, camera and system audio unless separately needed and cleared. Use a disposable profile and sanitized fixture. Never capture a personal desktop, notifications, clipboard, account switcher, login secrets or unrelated windows. A local mirror may still send mail or mutate live data: inspect its effects first. Stop on unexpected data, a new window, an ambiguous action, a permission prompt or any send/pay/publish boundary. Keep failed takes separate; do not upload them.

**Guided take.** From a project with Node 24, a pinned Playwright installation and its matching Chromium already installed:

```sh
# VIDEO_SKILL is the absolute path to this installed skill; OUT is a new directory.
node "$VIDEO_SKILL/scripts/record-walkthrough.mjs" --demo --guided --out "$OUT"
```

Bind computer use to the **new isolated browser window**, check its title and starting state, then act from observed buttons/labels. Observe each result before choosing the next action. Press Enter in the recorder terminal after the final hold. For your own approved local app, replace `--demo` with `--url http://127.0.0.1:4173/proofs`. The adapter is for trusted, credential-free local rehearsals; only same-origin GET/HEAD is allowed. It is not a sandbox for untrusted apps. For native software, pair computer use with a separately permitted, exact-window recorder such as [OBS window capture on macOS](https://obsproject.com/kb/macos-screen-capture-source). If that surface cannot be isolated, stop recording; offer a rehearsal or storyboard, not a screenshot montage labeled as footage.

Extra pages and JavaScript dialogs invalidate the take. The browser recorder cannot reliably detect or include native permission prompts or file choosers. If one appears, interrupt the take rather than pressing Enter or broadening capture.

**Automated retake.** `--demo --out "$OUT"` records the offline example. To repeat a real local workflow, use `--url ... --plan reviewed-take.json --out "$OUT"` instead of guided mode. Copy the shape of [the example plan](../assets/walkthrough-starter/compare.json), not its product labels. Each step names one exact accessible control, newly visible result text and reading hold. No scripts, selectors, passwords or arbitrary keystrokes. A changed screen fails the take rather than guessing a click. Use guided recording for branching, text entry, or recovery. [Playwright actionability](https://playwright.dev/docs/actionability) checks whether an action can run, not whether a viewer can follow it.

## Hand Off The Recording

Wait for the recorder to close and finalize the WebM; [Playwright saves video on context close](https://playwright.dev/docs/videos). Keep raw footage immutable. Match its hash to the receipt, probe duration/size/streams, decode the whole file, and inspect the opening, action, wait and result from encoded timecodes. Check normal-speed pacing before calling it reviewed. A receipt marked `captured` verifies a file, not product success. Record what was observed independently, who or what drove the take, edits, any shortened waits and gaps. The browser starter records no audio. Add optional captions or cleared narration in post; do not present a silent take as narrated. Publication is separate.
