<?php

/**
 * Theme Support
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

function custom_theme_support()
{

    // https://developer.wordpress.org/reference/functions/add_theme_support/
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
    add_theme_support('html', array('search-form', 'comment-list', 'comment-form', 'gallery', 'caption'));

}

add_action('after_setup_theme', 'custom_theme_support');