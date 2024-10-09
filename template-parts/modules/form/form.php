<?php $theme_settings = get_field('theme_settings','options');  ?>

<?php if( !empty($extras['type'] && $extras['type'] == 'form--vertical') ): ?>

    <div class="module__header">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
    </div>

    <div class="items">
        <?php echo do_shortcode('[contact-form-7 id="b8dc830" title="Contact form 1"]'); ?>
    </div>

<?php else: ?>

    <div class="columns">
        <div class="col">

            <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
            <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
            <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>

            <?php if(!empty($theme_settings['contact_info']['address'])):        
                $location_link = (!empty($theme_settings['contact_info']['address_link'])) ? '<a href="'.$theme_settings['contact_info']['address_link']['url'].'">ver en Google Maps</a>' : ''; ?>                <div class="form__row">
                    <div class="form__icon">
                        <img src="<?php bloginfo('template_url') ?>/dist/assets/images/icon-location.png" alt="">
                        <div>
                            <p><?php echo $theme_settings['contact_info']['address']; ?></p>
                            <?php echo $location_link; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <?php if(!empty($theme_settings['contact_info']['transport'])): ?>
                <div class="form__icon__row">
                    <?php foreach($theme_settings['contact_info']['transport'] as $transport):
                        $transport_image = (!empty($transport['image'])) ? '<img src="'.$transport['image']['url'].'" alt="">' : '';
                        $transport_text = (!empty($transport['text'])) ? '<p>'.$transport['text'].'</p>' : '';
                        ?>
                        <div class="form__icon">
                            <?php echo $transport_image; ?>
                            <div>
                                <?php echo $transport_text; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>            

        </div>

        <div class="col">
            <?php echo do_shortcode('[contact-form-7 id="b8dc830" title="Contact form 1"]'); ?>
        </div>

    </div>

<?php endif; ?>