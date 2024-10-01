<?php get_header(''); ?>

<img src="<?php bloginfo('template_url') ?>/dist/assets/images/404.png" alt="">

<h4><?php _e('Página no encontrada...', 'mumad') ?></h4>

<a href="<?php bloginfo( 'url' ) ?>" class="btn btn__icon btn__outline-white">
    <?php _e('Volver a la Home', 'mumad') ?>
    <?php echo custom_get_svg_icon( array( 'icon' => 'arrow' ));  ?>
</a>

<?php get_footer(); ?>