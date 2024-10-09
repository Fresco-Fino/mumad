<?php $theme_settings = get_field('theme_settings','options'); ?>

<?php if(!empty($theme_settings['message_top'])): ?>
    <div class="site-header__top">
        <section class="splide splide__top">
            <div class="splide__track">
                <ul class="splide__list">
                    <?php foreach($theme_settings['message_top'] as $item) { ?>
                        <?php if(!empty($item['text'])): ?>
                            <li class="splide__slide">
                                <p><?php echo $item['text']; ?></p>
                            </li>
                        <?php endif; ?>
                    <?php } ?>
                </ul>
            </div>
        </section>  
    </div>
<?php endif; ?>