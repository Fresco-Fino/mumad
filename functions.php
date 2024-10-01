<?php

/**
 * Functions
 *
 * @package      mumad
 * @author       Reload
 * @since        1.0.0
 **/

// Theme Support, Config & Enqueque
require_once('inc/theme-support.php');      // Theme support base
require_once('inc/config.php');             // Edit (Image size...)
require_once('inc/enqueue-assets.php');     // Edit assets enqueque

// Navigation, CPT and Sidebars
require_once('inc/navigation.php');         // Config your menus (header and footer by default)
// require_once('inc/sidebar.php');
// require_once('inc/cpt.php');             // Creat your CPT
// require_once('inc/sidebars.php');        // Widgets

// Actions, Helper and Custom fields
require_once('inc/actions/actions.php');    // Actions
require_once('inc/helper/helper.php');      // Helper
require_once('inc/acf/acf.php');            // ACF theme config (options and fields)
// require_once('inc/cutomize.php');

?>