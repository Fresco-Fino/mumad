<?php

/**
 * Main Menu
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

$main_menu = wp_get_nav_menu_items('main-menu');
?>

<nav id="navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e('Main menu', 'mumad'); ?>">

    <ul>

        <?php foreach ($main_menu as $item) {
            $link = $item->url; 
            $title = $item->title;
            ?>
            <li>
                <a href="<?php echo $link; ?>">
                    <?php echo $title; ?>
                </a>
            </li>
        <?php } ?>

    </ul>
</nav>