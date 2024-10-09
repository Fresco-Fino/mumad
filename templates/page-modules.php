<?php /* Template name: Modules */?>

<?php get_header('');

// Number
$n = 1;

// Loop Modules
if (have_rows('modules')):
    while (have_rows('modules')):
        the_row();

        /* Get Module Variables */
        require(TEMPLATEPATH . '/template-parts/modules/variables-modules.php'); ?>

        <div id="<?php echo $slug; ?>" data-refresh="<?php echo $n; ?>" class="module <?php echo get_row_layout(); ?> module--<?php echo $n; ?> <?php echo $config_module; ?>"
            style="<?php echo $config_style; ?>">

            <div class="module__wrapper">
                <?php /* Get part - Modules */require(TEMPLATEPATH . '/template-parts/modules/modules.php'); ?>
            </div>

        </div>

        <?php
        $n++;
    endwhile;
endif; ?>

<?php get_footer(); ?>