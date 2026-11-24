<?php
if ( $argc !== 3 || ! in_array( $argv[2], array( 'before', 'after' ), true ) ) {
	fwrite( STDERR, "Usage: php test-case.php /path/to/wordpress before|after\n" );
	exit( 2 );
}
$core = rtrim( $argv[1], '/' );
foreach ( array( 'version.php', 'class-wp-hook.php', 'plugin.php' ) as $file ) {
	if ( ! is_file( $core . '/wp-includes/' . $file ) ) {
		fwrite( STDERR, "Missing WordPress core file: $file\n" );
		exit( 2 );
	}
}
require $core . '/wp-includes/version.php';
require $core . '/wp-includes/plugin.php';
require __DIR__ . '/' . $argv[2] . '.php';

$input    = 'Hello, WordPress.';
$actual   = apply_filters( 'the_content', $input );
$expected = 'Hello, WordPress. [Example note]';
printf( "%s (WordPress %s, PHP %s): %s\n", $argv[2], $wp_version, PHP_VERSION, $actual );
if ( 'before' === $argv[2] ) {
	if ( $actual === $input ) {
		fwrite( STDERR, "EXPECTED FAIL: content unchanged; expected $expected\n" );
		exit( 42 );
	}
	fwrite( STDERR, "ERROR: before produced an unexpected result\n" );
	exit( 1 );
}
if ( $actual !== $expected ) {
	fwrite( STDERR, "FAIL: expected $expected\n" );
	exit( 1 );
}
echo "PASS: expected content returned\n";
