# Interaction And Form Resilience

Use this as the single supporting reference when a WordPress UI introduces a custom interactive widget, a consequential mutation, or a multi-step save/retry flow. Prefer native HTML, WordPress components, and verified Design System primitives first. Do not load it for static content, release metadata, or a control that already has a proven native contract.

## Native And WordPress-First Boundary

- Use the semantic element or existing WordPress component that already provides the interaction: links for navigation, buttons for actions, native form controls for input, `details`/`summary` for simple disclosure, and documented WordPress menus/panels for admin/editor surfaces.
- A custom widget needs a recorded functional gap, owner, state model, keyboard contract, and browser/assistive-technology proof. Do not add ARIA roles to make non-semantic markup appear compliant.
- Keep one interaction owner. Do not implement the same focus, open/close, selection, or save state in competing React, DOM, and WordPress stores.

## Pattern Contracts

When a custom control is unavoidable, follow the applicable WAI-ARIA Authoring Practices pattern and test the behavior, not only the attributes:

- **Dialog/modal:** expose an accessible name and description when needed; make outside content inert; place focus on a useful element; contain Tab/Shift+Tab; close on Escape unless a documented confirmation contract requires otherwise; restore focus to the invoking control; preserve scroll and announce validation/errors.
- **Combobox/autocomplete:** give the input its own accessible name; expose expanded/collapsed and popup ownership; keep the input value distinct from the active option; support typing, Down/Up, Home/End where applicable, selection, Escape without silently destroying input, and a no-results/loading/error state.
- **Tabs:** use `tablist`, `tab`, and `tabpanel` semantics with selected/controlled relationships and orientation; support the documented arrow-key model, Home/End where appropriate, focus visibility, deep links when required, and a meaningful fallback when panels cannot load.
- **Menu/menubar:** use menu semantics only for application commands, not ordinary site navigation; support arrow-key movement, Enter/Space, Home/End, Escape, disabled items, and focus return. Use `nav` and links for normal WordPress navigation.
- **Disclosure/popover:** use a real button with expanded/controls state; keep focus predictable, close on Escape, avoid hover-only access, and do not trap focus unless the surface is a modal dialog.

If a pattern is nested, portaled, virtualized, or rendered inside an editor iframe, prove focus, announcement, stacking, scroll lock, and cleanup in that actual document. Record the browser and assistive-technology pair; an axe result or screenshot cannot prove keyboard task completion by itself.

## Enterprise Mutation And Recovery Contract

Classify the action as low, medium, or high consequence before choosing the interaction and proof depth. For any medium/high-consequence or remote mutation:

- Make dirty/unsaved state visible and preserve entered values after validation, timeout, navigation interruption, or recoverable failure.
- Prevent duplicate submission with a pending state and server-side idempotency for retryable remote actions. Never present optimistic success unless rollback or reconciliation is defined.
- Detect stale data with a version, revision, or ETag where concurrent editing is possible. Show a conflict and preserve the user's work; never silently apply last-write-wins to settings or records that can affect users, money, permissions, or integrations.
- Make partial success explicit per step/field/resource. A failed follow-up must not be reported as an all-or-nothing success, and retry must target only the failed work.
- For destructive, financial, legal, permission, or data-changing actions, show a reviewable summary and clear confirmation; provide undo or rollback when the contract permits it. Server authorization remains mandatory.
- Define offline, reconnecting, timeout, refresh/back, multi-tab, cancellation, and recovery behavior. Do not hide a blocked action behind a spinner or discard a failed form.

For low-risk local state, record `Not applicable - reason` for concurrency or rollback rather than adding ceremony. Keep the matrix proportional to the affected flow.

## Proof Receipt

For a material custom interaction or mutation, record the pattern, native/WordPress alternative considered, states, keyboard path, browser/assistive-technology pair, document/iframe, concurrency model, retry/idempotency behavior, and known fallback. Test default, focus, disabled, loading, empty, error, success, permission, stale/conflict, cancellation, and long-content states where applicable. Route defects through the owning layer; do not convert a broken interaction into an acceptable visual deviation.

Official pattern references:

- Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- Menu/menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
