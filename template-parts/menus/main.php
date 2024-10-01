<?php

/**
 * Main Menu
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

$main_menu = wp_get_nav_menu_items('Main Menu');
$current_url = trailingslashit(home_url(add_query_arg(array(), $wp->request))); // Obtener la URL actual y agregar una barra al final


?>

<nav id="navigation" class="main-navigation" role="navigation"
    aria-label="<?php esc_attr_e('Main menu', 'mumad'); ?>">

    <ul>

        <?php foreach ($main_menu as $item) {
            $link = trailingslashit($item->url); 
            $title = $item->title;
            // Verificar si el enlace coincide con la URL actual
            $active_class = ($link == $current_url) ? ' class="current"' : '';
            ?>
            <li>
                <a href="<?php echo $link; ?>"<?php echo $active_class; ?>><?php echo $title; ?></a>
            </li>
        <?php } ?>


    </ul>
</nav>