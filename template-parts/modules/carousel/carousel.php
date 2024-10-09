<div class="columns">
    <div class="col">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    </div>
    <div class="col">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-buttons.php'); ?>   
    </div>
</div>

<?php if(!empty($media)): ?>
    <div class="items">
        <section class="splide link--drag">
            <div class="splide__track">
                <ul class="splide__list">
                    <?php foreach($media as $item): ?>
                        <li class="splide__slide">
                            <img src="<?php echo $item['url']; ?>" alt="">
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </section>  
    </div>
<?php endif; ?>