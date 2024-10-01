<?php

/**
 * ACF Actions [Scripts header and footer]
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

// Get Head Scripts [ACF fields]

add_action('custom_append-head', 'add_head_scripts', 1);

function add_head_scripts() {
    $header_scripts = get_field('custom_codigo_header', 'option');
    if (!empty($header_scripts)) {
        echo $header_scripts;
    }
}

// Get Body Scripts [ACF fields]

add_action('custom_prepend-body', 'add_body_scripts', 1);

function add_body_scripts() {
    $body_scripts = get_field('custom_codigo_body', 'option');
    if (!empty($body_scripts)) {
        echo $body_scripts;
    }
}

?>