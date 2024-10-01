<?php

/**
 * Social Menu
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

$social_menu = wp_get_nav_menu_items('Social Menu');
?>

<?php if(!empty($social_menu)) : ?>
	<nav id="menu-social" class="menu-social" role="navigation"
		aria-label="<?php esc_attr_e('Social menu', 'mumad'); ?>">

		<ul>

			<?php foreach ($social_menu as $item) {
				$link = $item->url;
				$title = $item->title;
				?>
				<li><a href="<?php echo $link; ?>"><?php echo $title; ?></a></li>
			<?php } ?>


		</ul>
	</nav>
<?php endif; ?>