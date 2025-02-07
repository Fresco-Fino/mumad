<?php
$theme_settings = get_field('theme_settings','options'); 
$location_phone = (!empty($theme_settings['contact_info']['phone'])) ? $theme_settings['contact_info']['phone'] : '';
$location_email = (!empty($theme_settings['contact_info']['email'])) ? $theme_settings['contact_info']['email'] : '';
$location_link = (!empty($theme_settings['contact_info']['address_link'])) ? '<a target="_blank" href="'.$theme_settings['contact_info']['address_link']['url'].'">ver en Google Maps</a><br/>' : '';
?>

<footer class="site-footer">

    <?php // Footer inside ?>
    <div class="site-footer__inside">

        <div class="site-footer__contact">

            <img src="<?php bloginfo('template_url') ?>/dist/assets/logos/brand-imagotipo.png" alt="">

            <div>
                <p>

                <?php if(!empty($theme_settings['contact_info']['address'])): ?>
                    <?php echo $theme_settings['contact_info']['address']; ?><br/>
                <?php endif; ?>

                <?php echo $location_link; ?>
                <?php echo $location_phone; ?> · <?php echo $location_email; ?>

                </p>
            </div>

        </div>

        <?php get_template_part('template-parts/menus/social'); ?>  

    </div>
    
    <?php // Footer Bottom ?>
    <div class="site-footer__bottom">
        <?php get_template_part('template-parts/menus/legal'); ?>  
    </div>

</footer>

<!-- Modal HTML -->
<div id="teamModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2 id="modalTitle"></h3>
        <p id="modalSubtitle"></p>
        <div id="modalText"></div>
    </div>
</div>

<?php // Custom Cursor ?>
<?php get_template_part('template-parts/components/cursor'); ?>  