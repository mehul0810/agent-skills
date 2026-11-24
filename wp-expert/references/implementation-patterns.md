# WordPress Implementation Patterns

Use this when writing or refactoring code. Adapt names and capabilities to the codebase.

For enterprise/WPVIP-grade implementation or review, load `../../shared/references/enterprise-code-quality-gate.md` before choosing final structure and validation.

## Compatibility Before Patterns

Before adding compatibility wrappers, fallback reads, migrations, aliases, legacy block attributes, or old REST fields, use `release-contract-compatibility.md`.

- Preserve compatibility for launched/public contracts and real production/client data.
- Do not add compatibility for abandoned intermediate shapes of unreleased features.
- For unreleased rework, prefer deleting draft code and creating the clean final launch contract.

## Modularity Before Extraction

Before extracting shared code, use `duplicate-code-modularity-review.md`.

- Extract duplicated behavior only when the shared responsibility is real and the abstraction improves reliability, testing, and maintainability.
- Keep intentional duplication when product rules will diverge or abstraction would hide important domain differences.
- For unreleased duplicate draft code, prefer deleting/reworking it into the final simple implementation instead of creating reusable helpers.

## REST Route

```php
register_rest_route(
    'example/v1',
    '/records/(?P<id>\d+)',
    array(
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => array( $controller, 'get_record' ),
        'permission_callback' => static function ( WP_REST_Request $request ): bool {
            return current_user_can( 'manage_options' );
        },
        'args'                => array(
            'id' => array(
                'type'              => 'integer',
                'required'          => true,
                'sanitize_callback' => 'absint',
                'validate_callback' => static fn ( $value ): bool => $value > 0,
            ),
        ),
    )
);
```

Rules:

- Prefer REST routes for new JS-driven interactions. Do not create new `wp_ajax_*` actions when this REST pattern can satisfy the request.
- Permission callback is required and meaningful.
- Validate object ownership inside the callback or controller when ID-level access matters.
- Return `WP_Error` with useful status codes for failures.

## Admin Post Mutation

```php
public function handle_save(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'example' ), 403 );
    }

    check_admin_referer( 'example_save_settings' );

    $enabled = isset( $_POST['enabled'] ) ? (bool) absint( wp_unslash( $_POST['enabled'] ) ) : false;
    $mode    = isset( $_POST['mode'] ) ? sanitize_key( wp_unslash( $_POST['mode'] ) ) : 'safe';

    if ( ! in_array( $mode, array( 'safe', 'strict' ), true ) ) {
        $mode = 'safe';
    }

    update_option(
        'example_settings',
        array(
            'enabled' => $enabled,
            'mode'    => $mode,
        ),
        false
    );

    wp_safe_redirect( add_query_arg( 'updated', '1', wp_get_referer() ?: admin_url() ) );
    exit;
}
```

Rules:

- Capability before mutation.
- Nonce for CSRF.
- `wp_unslash()` before sanitizing request values.
- Explicit `autoload` argument for options likely not needed on every request.

## Legacy AJAX Compatibility Wrapper

Use this only when an existing `wp_ajax_*` action must remain for backward compatibility. New JS endpoints should use REST.

```php
public function ajax_save(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => __( 'Sorry, you are not allowed to do that.', 'example' ) ), 403 );
    }

    check_ajax_referer( 'example_save_settings' );

    $result = $this->settings_service->save_from_request( wp_unslash( $_POST ) );

    if ( is_wp_error( $result ) ) {
        wp_send_json_error( array( 'message' => $result->get_error_message() ), 400 );
    }

    wp_send_json_success( array( 'message' => __( 'Settings saved.', 'example' ) ) );
}
```

Rules:

- Keep wrappers thin; the shared service should also power the REST controller.
- Do not add new AJAX-only business logic.
- Keep the nonce/capability checks even when the UI is admin-only.

## Safe SQL

```php
$table   = $wpdb->prefix . 'example_events';
$status  = sanitize_key( $status );
$allowed = array( 'created_at', 'status', 'id' );
$order_by = in_array( $order_by, $allowed, true ) ? $order_by : 'created_at';

$sql = $wpdb->prepare(
    "SELECT id, status, created_at FROM {$table} WHERE status = %s ORDER BY {$order_by} DESC LIMIT %d OFFSET %d",
    $status,
    $limit,
    $offset
);

$rows = $wpdb->get_results( $sql );
```

Rules:

- Values go through `prepare`.
- Identifiers are whitelisted, not interpolated from user input.
- Limits and offsets are bounded before query execution.

## Async Job Contract

For sensitive or durable work, persist the job payload in a private durable store appropriate to the application (for example, a protected custom table or private post/meta record); transients alone are not a durable queue. Schedule or dispatch only an opaque job ID. Never place PII or secrets in cron/action arguments.

The worker should atomically claim the job with a lease or equivalent concurrency control, reload and validate its private payload, and re-check authorization/state before side effects. Make side effects idempotent; do not promise exactly-once execution. Acknowledge/delete the job only after successful completion. On failure, retain observable status/error metadata and use bounded retries with recovery for expired claims. Define payload retention and cleanup explicitly; do not delete the only payload before work succeeds. Scheduling/dispatch failure must remain visible and recoverable rather than silently losing the job.

## Object Cache Wrapper

```php
$key   = 'record_map:' . get_current_blog_id() . ':' . md5( wp_json_encode( $args ) );
$group = 'example_records';
$data  = wp_cache_get( $key, $group );

if ( false === $data ) {
    $data = $repository->fetch_record_map( $args );
    wp_cache_set( $key, $data, $group, 10 * MINUTE_IN_SECONDS );
}

return $data;
```

Rules:

- Include dimensions that change output.
- Keep payload compact.
- Invalidate on writes or use a short TTL when precise invalidation is not available.

## Asset Loading

```php
add_action( 'admin_enqueue_scripts', function ( string $hook_suffix ): void {
    if ( 'settings_page_example' !== $hook_suffix ) {
        return;
    }

    wp_enqueue_script(
        'example-admin',
        plugins_url( 'build/admin.js', EXAMPLE_PLUGIN_FILE ),
        array( 'wp-api-fetch', 'wp-i18n' ),
        EXAMPLE_VERSION,
        true
    );
} );
```

Rules:

- Gate by admin screen, block, shortcode, or route.
- Use asset metadata when a build generates `.asset.php`.
- Register inline-only scripts with `false` as source.

## Dynamic Block Render

```php
register_block_type(
    __DIR__ . '/build/blocks/example',
    array(
        'render_callback' => static function ( array $attributes, string $content ): string {
            $label = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';

            return sprintf(
                '<div class="wp-block-example">%s</div>',
                esc_html( $label )
            );
        },
    )
);
```

Rules:

- Treat attributes as input, even if editor-generated.
- Escape rendered output.
- Preserve native block wrapper/layout unless the task requires markup changes.
