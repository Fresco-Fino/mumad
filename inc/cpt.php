<?php

/**
 * CPT (custom post types)
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

// Register Projects Post type

function cases_post_type()
{

    $labels = array(
        'name' => _x('Cases', 'mumad'),
        'singular_name' => _x('Case', 'mumad'),
        'menu_name' => __('Cases', 'mumad'),
        'name_admin_bar' => __('Cases', 'mumad'),
        'archives' => __('Cases Archives', 'mumad'),
        'attributes' => __('Cases Attributes', 'mumad'),
        'parent_item_colon' => __('Parent Case:', 'mumad'),
        'all_items' => __('All Cases', 'mumad'),
        'add_new_item' => __('Add New Case', 'mumad'),
        'add_new' => __('Add New', 'mumad'),
        'new_item' => __('New Case', 'mumad'),
        'edit_item' => __('Edit Case', 'mumad'),
        'update_item' => __('Update Case', 'mumad'),
        'view_item' => __('View Case', 'mumad'),
        'view_items' => __('View Cases', 'mumad'),
        'search_items' => __('Search Cases', 'mumad'),
        'not_found' => __('Not found', 'mumad'),
        'not_found_in_trash' => __('Not found in Trash', 'mumad'),
        'featured_image' => __('Featured Image', 'mumad'),
        'set_featured_image' => __('Set featured image', 'mumad'),
        'remove_featured_image' => __('Remove featured image', 'mumad'),
        'use_featured_image' => __('Use as featured image', 'mumad'),
        'insert_into_item' => __('Insert into Case', 'mumad'),
        'uploaded_to_this_item' => __('Uploaded to this Case', 'mumad'),
        'items_list' => __('Case list', 'mumad'),
        'items_list_navigation' => __('Case list navigation', 'mumad'),
        'filter_items_list' => __('Filter Case list', 'mumad'),
    );

    $args = array(
        'label' => __('Case', 'mumad'),
        'description' => __('Cases Description', 'mumad'),
        'labels' => $labels,
        'supports' => array('title', 'editor', 'thumbnail'),
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'capability_type' => 'page',
    );

    register_post_type('case', $args);

}

add_action('init', 'cases_post_type', 0);