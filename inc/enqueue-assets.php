<?php

/**
 * Scripts & Styles
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

// Custom css and js
function custom_assets()
{

    // Include jquery
    wp_enqueue_script('jquery');

    // Include css
    wp_enqueue_style('custom-style', get_template_directory_uri() . '/dist/css/style.css', array(), '2.0', 'all');

    // Include js
    wp_enqueue_script('custom-scripts', get_template_directory_uri() . '/dist/js/script.js', array(), '1.0', 'true');

}

add_action('wp_enqueue_scripts', 'custom_assets');