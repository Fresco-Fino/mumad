<?php

/**
 * Configuration
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

// Ocultar barra de admin
add_filter('show_admin_bar', '__return_false');

/*--- Desactivar Gutenberg ---*/
add_filter('use_block_editor_for_post_type', '__return_false', 100);

// Custom image sizes
add_image_size('theme_full', 2500, 2500);
add_image_size('theme_xlarge', 1920, 1080, true);
add_image_size('theme_large', 1440, 810, true);
add_image_size('theme_medium', 850, 580, true);
add_image_size('theme_small', 760, 450, true);
add_image_size('theme_xsmall', 250, 250, true);
add_image_size('theme_single', 620, 520, true);
add_image_size('theme_square', 720, 720, true);

?>