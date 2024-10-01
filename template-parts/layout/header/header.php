<header class="site-header">

    <?php // Header Top ?>
    <?php get_template_part('template-parts/layout/header/header-top'); ?>

    <?php // Header Inside ?>
    <div class="site-header__inside">

        <?php // Header Brand ?>
        <?php get_template_part('template-parts/layout/header/header-brand'); ?>

        <?php // Header Right ?>
        <div class="site-header__right">
            <?php get_template_part('template-parts/menus/main'); ?>            
            <?php get_template_part('template-parts/layout/header/header-cta'); ?>
            <?php get_template_part('template-parts/layout/header/header-burger'); ?>
        </div>

    </div>

</header>