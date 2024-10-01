<?php

/**
 * Menu & Navigation
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

function custom_register_menus() {

    register_nav_menus(
        array(
            'main-menu' => esc_html__('Main Menu', 'mumad'),
            'legal-menu' => esc_html__('Legal Menu', 'mumad'),
            'social-menu' => esc_html__('Social Menu', 'mumad'),
        )
    );

}

add_action('init', 'custom_register_menus');