# Video Format Production Review

One skill still owns the video. The change is which shot to make, what it can
prove and how to check it, not a new host, model policy or production service.

## Decision Evidence

Fresh agents worked from frozen skill guidance and raw synthetic briefs; separate
reviewers held the scoring criteria. The original 48 cases were retained and
seven were added: placement-specific openers, a silent motion loop, an uncleared
creator, a cleared virtual host, two edits from one take log, a phone placement
check, and a physical-product continuity mismatch.

| Tested source | Result |
| --- | --- |
| `8d9d77a` | First pass: 48/55 passed, six failed, one incomplete. All seven new briefs passed. Separate recovery passed three of seven; review-package routing, master lineage, accessible post and walkthrough pacing still missed named requirements. |
| `89e5df5` | The kernel now separates edit, channel and verification stages; the guides make picture-lock lineage, player review and cursor/explanation timing explicit. All 55 decisions were run again, including one isolated selection from the neutral 17-skill catalog. |
| First pass on the revised source | 49/55 after a scorer corrected a misread of the isolated case's actual editing-reference read log (original tally 48). All seven new briefs again passed. The six failed handoffs concerned enterprise treatment, edit lineage, channel packaging, accessibility, walkthrough branches and motion scripting. |
| Targeted recovery on the same source | Three fresh performers prepared six operator handoffs; a separate scorer passed all six. In the enterprise spot the evidence was human control and an observable result, **not** a filmed failure state. Combined coverage: 44/44 registered checks, not a flawless first attempt. |

Both source packages were hash-verified before dispatch. On the revised
source the legacy manifest SHA-256 was
`c6b766099bde8c3fe08866f3f2e8c7b405a4a3f88dbea8ee76a2b6f28f40e9b4`;
the format manifest was
`828b12f24726151524c47987632f5f4826e12a7afe89c3bbe89ca364a4954f1f`.
The initial and corrected-first-pass receipts were retained separately from
the combined receipt (`94fa76bb7f232e46affc25cee1ce3a7a459d51476260856c868adc490af8d22e`).
Preflight found complete check bindings; it does not itself grant admission.
One performer saw all 48 raw briefs rather than its assigned range, but no
scoring material. The SVG continuity response used SVG source, not observed
playback. Host token/cost telemetry was unavailable.

## Research To Practice

Primary sources reviewed on 2026-11-22; recheck market/placement rules for the
actual job. These are editorial applications, not claims of audience lift:

| Source | Production decision |
| --- | --- |
| [YouTube intro retention](https://support.google.com/youtube/answer/9314415) | Answer the title's promise in a cold open. Don't turn an analytics window into a mandatory ident duration. |
| [Adobe speed graphs](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html) | Animate a subject changing state, then inspect spacing and speed through the cut or loop seam. Preserve reading holds. |
| [TechSmith screen-state storyboards](https://www.techsmith.com/blog/how-to-storyboard-a-video/) and [Apple App Previews](https://developer.apple.com/app-store/app-previews/) | Cut sales proof and repeatable instructions differently from the same take log. An App Store preview uses in-app footage, not a presenter stand-in. |
| [HeyGen participant consent](https://help.heygen.com/en/articles/12092609-recording-your-consent-video) and [FTC avatar/testimonial FAQ](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) | Clear likeness and voice for the actual use. A fictional presenter can explain a feature; disclosure cannot make up for a fabricated experience. |
| [ASCI influencer guidance](https://www.ascionline.in/the-asci-code-guidelines/), [YouTube AI disclosure](https://support.google.com/youtube/answer/14328491), [TikTok creative guidance](https://ads.tiktok.com/business/en-US/creative-codes) | Decide commercial and synthetic disclosures separately. Compose their placement with captions, face and product controls; do not assume one set of worldwide rules or pixel margins. |

## Rendered Evidence

- The actual CLI extracted clean and guided PNGs from a local encoded portrait
  fixture. In the 180-pixel-wide samples the top remained visible while the
  lower band darkened under the supplied guide. Decoded RGB at (90,50) stayed
  `[0,0,253]`; at (90,280) it changed from `[0,0,253]` to `[0,0,39]`.
  This was an intentional test overlay, not a platform template.
- Candidate `be09c8a` refused a real 1080x1920 H.264 export with no declared
  sample aspect ratio. The source composition confirmed a square-pixel canvas.
  Candidate `8d9d77a` kept that refusal by default and sampled the **same file**
  with an explicit source-confirmed override. At 390x693, the 0.5s opening's
  page badges were finer than the headline; the 8s preview and 15.5s routing
  table were visible. No real placement overlay was available for this export.
- Native regression covered an untagged MOV, actual pixel changes, aspect and
  rotation conflicts, invisible/opaque/wrong-shape guides, installed CLI links,
  and no-overwrite behavior. These checks do not establish temporal readability,
  a human performance, authentic product capture, platform playback, an approved
  master or audience response. Owner-excluded narration and screen-reader
  verification were not run or counted as passes.
