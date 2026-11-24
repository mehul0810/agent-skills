---
name: apple-app-development
description: Build, debug, or review native apps for iPhone, iPad, Mac, Apple Watch, Apple TV, and Apple Vision Pro using SwiftUI, UIKit, AppKit, and Xcode. Not for websites merely viewed on Apple devices or design-file-only work.
---

# Apple App Development

Start with the user's task on the named device: what should someone be able to do, using which input, and what should happen if it fails? Work on the requested targets, not all six by default. For a game, gameplay and playtesting belong to the game workflow; use this skill for the native shell, Apple integration, or distribution question.

- **Choose the implementation.** Inspect the actual workspace/project or Swift package, schemes, deployment floor, UI framework, and supported destinations. Reuse a working UIKit/AppKit or cross-platform app; don't rewrite it because the target is Apple. For a new native UI, consider SwiftUI first. Use an existing system component or a narrow framework bridge if it meets the hard requirement on the oldest supported OS. Don't raise the floor, add a package, or invent six UIs to avoid testing that choice.
- **Build the user flow.** For layout, input, state, interoperability or a performance complaint, use [Platform and UI](references/platform-ui.md). Deliver the requested working path from input to observable result, including relevant cancellation, failure, and relaunch behavior. A mockup or a preview is not that path.
- **Run the right proof.** For builds, tests and diagnostics, use [Xcode verification](references/xcode-verification.md). Give the runnable scheme or entry point, revision, destination/OS, tests actually executed, and the most important unverified behavior. Don't turn a device limitation into a reason to withhold work that can be tested locally.
- **Check privacy and distribution only when relevant.** If a feature adds protected data, an SDK, an entitlement, or a distribution request, use [Privacy and distribution](references/privacy-distribution.md). Local development and readiness review do not authorize account changes, provisioning updates, uploads, TestFlight distribution, notarization, or App Store submission.
