# Fix a WordPress content filter

A plugin wants to append an example note when WordPress applies the
`the_content` filter. The [before snippet](before.php) registers the callback on
`the_contents` instead, so it never runs for `the_content`. The
[after snippet](after.php) uses the correct hook name. Hook names must match
exactly; registering a callback alone does not prove it will run.

Try asking: Use [WP Plugin Expert](../../wp-plugin-expert/SKILL.md) to explain why the before callback does not run and verify the corrected hook.

## Run offline

You need PHP CLI and a local, unmodified WordPress core source tree, including
`wp-includes/version.php`, `class-wp-hook.php`, and `plugin.php`. No database,
WordPress configuration, site, installation, or network connection is used.
From the repository root, substitute the path to your core tree:

```sh
sh examples/wordpress-before-after/check.sh /absolute/path/to/wordpress
```

The runner loads those actual WordPress core files in separate PHP processes,
then invokes `apply_filters('the_content', ...)` on a fixed string. It expects
the exact unchanged input for the before snippet (a failed assertion reported
with exit code 42) and the corrected output for the after snippet;
the overall command exits zero only when both outcomes occur. A missing core
file or PHP failure is an error, not the expected assertion failure.

Expected output (version numbers vary):

```text
before (WordPress ..., PHP ...): Hello, WordPress.
EXPECTED FAIL: content unchanged; expected Hello, WordPress. [Example note]
Expected failure observed.
after (WordPress ..., PHP ...): Hello, WordPress. [Example note]
PASS: expected content returned
Before/after check passed.
```

This is a server-side hook test, not proof of plugin activation, full WordPress
bootstrap, post rendering, editor behavior, or browser UI. Other plugins and
filters are not loaded. The two snippets are instructional fixtures, not
production-ready plugins.

See the WordPress references for [`add_filter()`](https://developer.wordpress.org/reference/functions/add_filter/)
and [`the_content` hook](https://developer.wordpress.org/reference/hooks/the_content/).
