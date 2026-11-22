# Record a proof comparison

[Watch the example (MP4, 12 seconds, silent)](proof-desk.mp4). The question is simple: what changes when we compare two paper stocks, without sending the proof? The recording opens **Atlas Print**, selects **Compare versions**, then holds and drags the divider across the proof. Watch the green paper area grow continuously while the pointer is held. The final screen says "This is a preview only. Nothing is sent from this page."

This is one uninterrupted recording of the [functioning demo](../../product-video-producer/assets/walkthrough-starter/demo.html), not a slide deck or customer footage. The indicator follows real browser pointer events, not a cursor animated afterward. The example uses no personal desktop, account, microphone, system audio or remote service.

For a different application, use the [one-take card](take-card.md) to identify both the window receiving input and the window being recorded before starting.

## Make another take

From a disposable project with **Node 24, project-local Playwright with its matching Chromium already installed, and FFmpeg with libx264**, run the script from the kept skills checkout. Give it a directory that does not exist:

```sh
bash /absolute/path/to/agent-skills/examples/recorded-walkthrough/record.sh ./my-proof-take
```

The command downloads nothing. It keeps the original WebM, the recorder's `receipt.json`, and a directly transcoded `proof-desk.mp4`. It refuses to overwrite an earlier take. The included take was made with Playwright 1.63.0; it is H.264, 960x600, 25 fps and 305 frames. A fresh take may differ in duration and bytes. A successful encode is not proof of the gesture: play it at normal speed and look for several intermediate divider positions, not just different first and last screens.

To try the [video skill](../../product-video-producer/SKILL.md) with this brief: **Record the proof comparison in the disposable demo. Show the paper changing during the drag, stop at "Not sent," and give me the actual recording.** For another app or an interactive guided take, use the [capture guide](../../product-video-producer/references/computer-use-walkthrough.md). This example does not verify another product, native window capture, narration, or publication.
