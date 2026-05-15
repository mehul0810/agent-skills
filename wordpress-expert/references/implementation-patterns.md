# WordPress Implementation Patterns

Use this when writing or refactoring code. Adapt names and capabilities to the codebase.

## Compatibility Before Patterns

Before adding compatibility wrappers, fallback reads, migrations, aliases, legacy block attributes, or old REST fields, use `release-contract-compatibility.md`.

- Preserve compatibility for launched/public contracts and real production/client data.
- Do not add compatibility for abandoned intermediate shapes of unreleased features.
- For unreleased rework, prefer deleting draft code and creating the clean final launch contract.

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

## Async Token Pattern

Use this when a job needs sensitive payload data.

```php
$token = wp_generate_uuid4();
set_transient(
    'example_job_' . $token,
    array(
        'record_id' => $record_id,
        'payload'   => $redacted_or_private_payload,
    ),
    HOUR_IN_SECONDS
);

wp_schedule_single_event( time() + 10, 'example_process_job', array( $token ) );
```

Job handler:

```php
public function process_job( string $token ): void {
    $payload = get_transient( 'example_job_' . $token );

    if ( ! is_array( $payload ) ) {
        return;
    }

    delete_transient( 'example_job_' . $token );

    // Re-check record existence and idempotency before side effects.
}
```

Rules:

- Cron/action args carry token/ID only, not PII or secrets.
- Job is idempotent and can safely retry.
- Payload expires and is deleted after use.

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
