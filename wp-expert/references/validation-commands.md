# WordPress Validation Commands

Use the cheapest reliable gates first. Adapt paths to the real Git root and WordPress root.

## Discovery

```bash
pwd
git rev-parse --show-toplevel 2>/dev/null || true
git status --short --branch
find . -name wp-load.php -o -path '*/wp-content/plugins' -o -path '*/wp-content/themes'
rg -n "Plugin Name:|register_rest_route|add_action|add_filter|wp_ajax_|register_block_type|wp_schedule|as_enqueue_async_action" .
```

Skill helper:

```bash
bash /path/to/wp-expert/scripts/wp-context.sh /path/to/repo
```

## PHP Syntax

Single file:

```bash
php -l path/to/file.php
```

Changed PHP files:

```bash
git diff --name-only -- '*.php' | xargs -r -n1 php -l
```

Whole plugin/theme, excluding dependencies:

```bash
find . -type f -name '*.php' \
  -not -path './vendor/*' \
  -not -path './node_modules/*' \
  -not -path './.git/*' \
  -print0 | xargs -0 -n1 php -l
```

Skill helper:

```bash
bash /path/to/wp-expert/scripts/wp-validate.sh /path/to/repo
```

## Composer And PHP Static Analysis

```bash
composer validate --no-check-publish
composer dump-autoload
composer test
composer phpcs
composer phpstan
./vendor/bin/phpcs -i
./vendor/bin/phpcs --standard=WordPress,WordPressVIPMinimum path/to/code
./vendor/bin/phpstan analyse
```

Run only scripts that exist in `composer.json` or project docs. Do not introduce dependency updates unless needed.

## JavaScript And Blocks

```bash
npm run build
npm run lint
npm run test
npm run test:unit
npm run test:e2e
node --check path/to/plain-file.js
npx wp-scripts lint-js src
```

Use `node --check` only for plain JavaScript that Node can parse. It is not a substitute for build/lint on JSX/TypeScript.

## GitHub Actions And CI

```bash
find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) -print
find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) -print0 | xargs -0 ruby -e 'require "yaml"; ARGV.each { |file| YAML.load_file(file); puts "parsed: #{file}" }'
gh workflow list
gh run list --limit 10
gh run view --log-failed
```

Use `gh` only when authenticated and when GitHub context matters. YAML parsing confirms syntax only; it does not prove GitHub-specific workflow semantics.

## WordPress Runtime Checks

With WP-CLI:

```bash
wp plugin list
wp theme list
wp eval 'echo get_bloginfo("name") . PHP_EOL;'
wp eval 'var_dump( class_exists("Vendor\\Plugin\\Plugin") );'
wp plugin activate plugin-slug
wp option get option_name --format=json
wp cron event list
```

Studio/local variants may use:

```bash
studio wp eval 'echo get_bloginfo("name") . PHP_EOL;'
studio wp plugin list
```

Without WP-CLI, from a WordPress root:

```bash
php -r 'require "wp-load.php"; require_once ABSPATH . "wp-admin/includes/plugin.php"; echo is_plugin_active("plugin/plugin.php") ? "active\n" : "inactive\n";'
```

Activation probe without WP-CLI:

```bash
php -r 'require "wp-load.php"; require_once ABSPATH . "wp-admin/includes/plugin.php"; $p="plugin/plugin.php"; $r=activate_plugin($p); if (is_wp_error($r)) { echo $r->get_error_message(), "\n"; exit(1); } echo is_plugin_active($p) ? "active\n" : "inactive\n";'
```

## REST And AJAX Smoke Checks

```bash
wp eval 'print_r( rest_get_server()->get_routes() );'
curl -sI http://example.test/wp-json/
curl -s http://example.test/wp-json/example/v1/health
```

For authenticated state-changing routes, do not fake success by skipping auth. Use a real nonce/application password/local login only when safe.

## Database And Migrations

```bash
wp db query 'SHOW TABLES LIKE "%example%"'
wp db query 'SHOW INDEX FROM wp_example_table'
wp option get example_schema_version
wp cron event list --hook=example_process_job
```

For large migrations, validate batch size, resume marker, locking, and rollback behavior. Avoid running destructive migrations on shared/prod data without explicit approval.

## Performance Probes

Local/dev:

```bash
wp profile stage --all
wp profile hook --all
wp transient list
```

If Query Monitor/New Relic/VIP metrics are available, inspect:

- Query count and slow queries.
- Object-cache get/set/delete counts and hit rate.
- Remote HTTP calls and timeout behavior.
- Cron/action queue depth and failures.
- Peak memory and response time for hot paths.
