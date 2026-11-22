<?php
add_filter( 'the_content', function ( $content ) {
	return $content . ' [Example note]';
} );
