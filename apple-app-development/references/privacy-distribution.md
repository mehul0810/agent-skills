# Privacy and distribution

**Start from the data flow.** What data enters the app, stays on the device, leaves it, and reaches which recipient (including bundled SDKs)?
Prefer a narrow system picker when the feature only needs user-selected items; for example, [Photos picker](https://developer.apple.com/documentation/photokit/bringing-photos-picker-to-your-swiftui-app) can deliver a chosen photo without requesting broad library access.
Request protected access at the action that needs it, explain the purpose accurately, and keep unrelated features usable after denial, cancellation or revocation.
Use least-privilege entitlements and platform secret storage such as Keychain for credentials, not preferences or logs. Don't widen an existing data boundary to simplify implementation. [HIG: Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)

**Check these separately.** A purpose string explains a system permission. An entitlement enables a capability.
A bundled `PrivacyInfo.xcprivacy` declares applicable collection, tracking and required-reason API use. App Store privacy details disclose the app's actual practices, including partners. None substitutes for another or grants consent.
Inspect target membership and the built product as well as source. For required-reason APIs, match the actual purpose and platform to an Apple-approved reason; never guess a reason code.
Check whether an SDK is on Apple's list and whether its distribution form requires a signature. An incomplete SDK inventory makes the declaration unverified, not "no data collected."
[Privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files), [required reasons](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api), [SDK requirements](https://developer.apple.com/support/third-party-SDK-requirements/), [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)

**Match the channel.** Development builds, a local archive, TestFlight, App Store review, and Developer ID distribution outside the Mac App Store have different evidence and effects.
Before assessing readiness, recheck Apple's current [submission requirements](https://developer.apple.com/app-store/submitting/) and the applicable [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) rather than hardcoding a future SDK floor.
For a directly distributed Mac app, inspect the intended signing, hardened runtime, entitlements and [notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) path instead of treating an App Store checklist as sufficient.

For an audit, report the exact artifact/channel, observed gaps and next local check. Don't alter team identifiers, certificates, profiles, portal capabilities or Store metadata; don't enable automatic provisioning updates, submit to a notary, upload a build, invite testers or release merely because credentials exist. Those actions require explicit scope for that target. A local build or checklist cannot promise acceptance by Apple.
