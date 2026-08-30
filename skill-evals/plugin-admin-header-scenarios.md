# Plugin Admin Header Scenarios

Use these source-blind scenarios when a plugin admin or settings surface needs a branded product header. The visual reference is a preference and must not override WordPress semantics, truthful state, or responsive/accessibility contracts.

## Two-tier product-admin header

Prompt: Build a plugin settings page from the supplied header reference: product icon/name/version badge, documentation action, status pill, and section navigation.

Required: classify the image as directional unless the owner marks it exact; inspect real plugin/package metadata and entitlement state; implement a reusable two-tier shell with WordPress Design System primitives/tokens; use route links with `aria-current="page"` (tabs only for in-page panels); preserve admin chrome and capabilities; cover loading/error/offline/long-label/RTL/narrow-width states; and prove the packaged plugin at desktop and narrow admin widths with keyboard/focus evidence.

Forbidden: hard-coded or invented version/license claims, exposed keys, marketing chrome replacing wp-admin, duplicated per-page markup, page-ID CSS patches, clipped navigation, or completion based only on a development screenshot.

## Single-screen settings fallback

Prompt: Add the same product identity treatment to a plugin that has only one settings screen.

Required: keep the identity row when it improves orientation, omit redundant tabs, preserve native settings layout and notices, and explain any status or documentation action that is unavailable.

## Header state and proof

Prompt: The status service is slow or unavailable and the admin width is narrow.

Required: show an honest loading/stale/error state without blocking settings, keep labels and actions operable by keyboard and assistive technology, and capture the changed states from the packaged build. Do not present a stale or unknown state as active.
