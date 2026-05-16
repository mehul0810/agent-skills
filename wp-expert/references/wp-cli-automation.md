# WP-CLI And Automation

Use this for WP-CLI probes, admin-free verification, scaffolding, search-replace, DB checks, cron, block/theme/plugin automation, and environments where browser/admin access is limited.

## Official Anchors

- WP-CLI command reference: https://developer.wordpress.org/cli/commands/
- WP-CLI scaffold command: https://developer.wordpress.org/cli/commands/scaffold/

## Discovery

```bash
wp cli info
wp core version
wp plugin list
wp theme list
wp option get siteurl
wp rewrite list
wp cron event list
```

If `wp` is unavailable, check for environment wrappers such as `studio wp`, `lando wp`, `ddev wp`, `wp-env run cli wp`, or `docker compose run --rm cli wp`.

## Runtime Probes

```bash
wp eval 'echo get_bloginfo("name") . PHP_EOL;'
wp eval 'var_dump( class_exists("Vendor\\Plugin\\Plugin") );'
wp eval 'print_r( rest_get_server()->get_routes() );'
wp option get option_name --format=json
wp transient get transient_name
wp cache get key group
```

Use probes to verify behavior, not to mutate production data casually.

## Activation Without Browser

```bash
wp plugin activate plugin-slug
wp plugin deactivate plugin-slug
wp eval 'require_once ABSPATH . "wp-admin/includes/plugin.php"; echo is_plugin_active("plugin/plugin.php") ? "active\n" : "inactive\n";'
```

Without WP-CLI from WordPress root:

```bash
php -r 'require "wp-load.php"; require_once ABSPATH . "wp-admin/includes/plugin.php"; echo is_plugin_active("plugin/plugin.php") ? "active\n" : "inactive\n";'
```

## Database And Search Replace

- Always confirm environment before DB mutations.
- Prefer dry runs for search-replace.
- Avoid production DB writes without explicit approval.

```bash
wp db check
wp db query 'SHOW TABLES LIKE "%example%"'
wp search-replace 'https://old.example' 'https://new.example' --all-tables --dry-run
```

## Cron And Queues

```bash
wp cron event list
wp cron event run hook_name
wp option get cron --format=json
wp action-scheduler list
wp action-scheduler run --hooks=example_hook
```

Action Scheduler commands require the package/plugin to expose them. If missing, inspect tables and admin tools instead.

## Scaffolding

Use scaffolding as a starting point, not architecture authority:

```bash
wp scaffold plugin plugin-slug
wp scaffold plugin-tests plugin-slug
wp scaffold block block-name --theme
wp scaffold theme theme-slug
```

Replace generated boilerplate with project conventions before committing.

## Multisite

```bash
wp site list
wp --url=https://site.example option get home
wp user list --url=https://site.example
```

Be explicit about `--url` and network vs site scope. Avoid loops over all sites in web requests; use CLI or background batches.
