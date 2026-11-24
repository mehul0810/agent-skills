<?php
// Bug: WordPress applies the singular "the_content" filter.
add_filter( 'the_contents', function ( $content ) {
	return $content . ' [Example note]';
} );
