<?php

/**
 * Custom Excerpt Filter
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

// Excerpt Length

function custom_longer_excerpts($length)
{

	// Don't change anything inside /wp-admin/
	if (is_admin()) {
		return $length;
	}

	// Set excerpt length to 25 words
	return 15;

}

// "999" priority makes this run last of all the functions hooked to this filter, meaning it overrides them

add_filter('excerpt_length', 'custom_longer_excerpts', 999);

// Excerpt Text

function custom_change_and_link_excerpt($more)
{

	if (is_admin()) {
		return $more;
	}

	// Change text, make it link, and return change
	return '...';

}

add_filter('excerpt_more', 'custom_change_and_link_excerpt', 999);