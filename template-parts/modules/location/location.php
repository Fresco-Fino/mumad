<?php $theme_settings = get_field('theme_settings','options');  ?>

<div class="module__header">

    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>

    <?php if(!empty($theme_settings['contact_info']['address'])):        
        $location_link = (!empty($theme_settings['contact_info']['address_link'])) ? '<a target="_blank" href="'.$theme_settings['contact_info']['address_link']['url'].'">ver en Google Maps</a>' : ''; ?>
        <div class="location__address">
            <img src="<?php bloginfo('template_url') ?>/dist/assets/images/icon-location.png" alt="">
            <p><?php echo $theme_settings['contact_info']['address']; ?></p>
            <p><?php echo $location_link; ?></p>
        </div>
    <?php endif; ?>
    
</div>

<?php
$location_image = (!empty($media[0])) ? '<img src="'.$media[0]['url'].'" alt="">' : '';
$location_phone = (!empty($theme_settings['contact_info']['phone'])) ? '<div class="location__icon"><img src="'.get_bloginfo('template_url').'/dist/assets/images/icon-phone.png"><p>'.$theme_settings['contact_info']['phone'].'</p></div>' : '';
$location_email = (!empty($theme_settings['contact_info']['email'])) ? '<div class="location__icon"><img src="'.get_bloginfo('template_url').'/dist/assets/images/icon-email.png"><p>'.$theme_settings['contact_info']['email'].'</p></div>' : '';
?>

<div class="items">
    <div class="item">
        <?php echo $location_image; ?>
        <div class="location__contact">
            <div>
                <?php if(!empty($theme_settings['contact_info']['transport'])): ?>
                    <?php foreach($theme_settings['contact_info']['transport'] as $transport):
                        $transport_image = (!empty($transport['image'])) ? '<img src="'.$transport['image']['url'].'" alt="">' : '';
                        $transport_text = (!empty($transport['text'])) ? '<p>'.$transport['text'].'</p>' : '';
                        ?>
                        <div class="location__icon">
                            <?php echo $transport_image; ?>
                            <?php echo $transport_text; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <div>
                <?php echo $location_phone; ?>
                <?php echo $location_email; ?>
            </div>
        </div>
    </div>
</div>

