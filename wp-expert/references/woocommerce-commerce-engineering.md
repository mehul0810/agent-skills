# WooCommerce And Commerce Engineering

Use this for WooCommerce stores, commerce plugins, checkout/cart work, payment or shipping integrations, subscriptions, refunds, order operations, high-scale stores, and commerce reviews.

## Current Official Anchors

- WooCommerce HPOS: https://developer.woocommerce.com/docs/features/high-performance-order-storage
- HPOS extension recipe book: https://developer.woocommerce.com/docs/hpos-extension-recipe-book/
- Large-store HPOS guide: https://developer.woocommerce.com/docs/features/high-performance-order-storage/guide-large-store
- WooCommerce Blocks extensibility: https://developer.woocommerce.com/docs/block-development/getting-started/extensibility-overview/
- Checkout payment method integration: https://developer.woocommerce.com/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/payment-method-integration/
- Store API checkout fields: https://developer.woocommerce.com/docs/apis/store-api/extending-store-api/extend-store-api-add-custom-fields/
- Action Scheduler: https://wordpress.org/plugins/action-scheduler/

Verify current WooCommerce docs before relying on checkout block, Store API, HPOS, or payment gateway internals.

## Commerce First Pass

- Identify store surface: classic shortcode checkout, Checkout Block, Cart Block, Store API, REST API, admin order screens, emails, webhooks, cron/Action Scheduler, subscriptions, memberships, bookings, or custom checkout.
- Identify data storage: HPOS authoritative tables, compatibility mode, post/postmeta fallback, product lookup tables, custom tables, and queue tables.
- Identify money movement: gateway, capture/refund/void flow, fraud rules, taxes, shipping rates, coupons, fees, subscriptions, renewals, and payment webhooks.
- Identify scale: order volume, cart traffic, product/catalog size, logged-in ratio, object cache, checkout conversion sensitivity, and admin order operations.

## HPOS Rules

- Do not query `shop_order` posts or order postmeta directly for new order logic. Use WooCommerce CRUD and HPOS-aware APIs.
- Declare HPOS compatibility only after auditing all order reads/writes, admin list filters, exports, reports, webhooks, and tests.
- Test with HPOS enabled, compatibility mode disabled where possible, and compatibility mode enabled only when migration behavior matters.
- For large stores, plan dual-write/sync risk, background migration, admin lockout risk, order lookup performance, and rollback expectations.

## Checkout And Blocks

- Treat shortcode checkout and Checkout Block as different integration surfaces.
- Do not assume legacy PHP checkout hooks affect block checkout. Use WooCommerce Blocks extensibility and Store API extension points.
- Keep payment UI state, validation, and order creation deterministic. Never trust client-only payment state.
- For checkout fields, define where data is captured, validated, stored, shown in admin, included in emails, exported, erased, and exposed through APIs.
- Validate block checkout with real payment method flows, guest and logged-in users, coupons, shipping/tax recalculation, retries, duplicate submissions, and browser back/refresh.

## Payment, Shipping, And Webhooks

- Make payment callbacks idempotent and order-state aware. Duplicate gateway callbacks must not double-capture, double-refund, or corrupt status.
- Verify signatures, source IP expectations only if the provider documents them, event timestamps, replay windows, and order ownership.
- Offload slow provider calls to Action Scheduler when they are not required for synchronous checkout response.
- Never store secrets in localized JS, order notes visible to customers, logs, transients exposed by debug screens, or webhook URLs.
- For shipping and tax, account for address changes, partial shipments, virtual products, local pickup, tax-exempt users, and rate-cache invalidation.

## High-Scale Store Review

- Avoid unbounded product, order, or customer queries. Use pagination, indexed lookups, lookup tables, and batch processing.
- Watch hot paths: cart fragments, checkout, Store API, product archives, search/filter, order admin list, scheduled actions, emails, and webhooks.
- Do not run synchronous exports, reports, or provider sync on admin page load.
- Use Action Scheduler or WP-CLI for bulk order/product/customer work, with progress, retries, locking, and observability.
- Keep cache variation explicit: currency, tax display, customer group, geo, stock, cart state, and personalization.

## Commerce Testing

- Include tests or probes for guest checkout, logged-in checkout, failed payment, successful payment, webhook replay, refund, partial refund, stock decrement/restock, coupon edge cases, tax/shipping recalculation, HPOS mode, and order admin display.
- For frontend work, test mobile checkout, keyboard focus, error messages, loading state, and abandoned/retry flow.
- For releases, include a rollback plan that covers database/schema changes, HPOS compatibility declarations, queue jobs, and payment gateway configuration.

## Output Expectations

- State checkout mode, HPOS mode, gateway/shipping surfaces, validation performed, and commerce risk.
- For reviews, findings should prioritize money loss, order corruption, privacy leaks, checkout breakage, conversion regressions, and high-scale admin failures.
