<?php

/**
 * Legal Menu
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

$legal_menu = wp_get_nav_menu_items('Legal Menu');
?>

<nav id="menu-legal" role="navigation" aria-label="<?php esc_attr_e('Legal menu', 'mumad'); ?>">
	<ul>
		<?php foreach ($legal_menu as $item) {
			$link = $item->url;
			$title = $item->title;
			?>
			<li><a href="<?php echo $link; ?>"><?php echo $title; ?></a></li>
		<?php } ?>
	</ul>
</nav>