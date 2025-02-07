<div class="columns">
    <div class="col">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    </div>
    <div class="col">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
    </div>
</div>

<?php if(!empty($items)): ?>
    <div class="items">
        <section class="splide link--drag">
            <div class="splide__track">
                <ul class="splide__list">
                    <?php foreach($items as $item):
                        $item_title = (!empty($item['title'])) ? '<h3>'.$item['title'].'</h3>' : '';
                        $item_subtitle = (!empty($item['subtitle'])) ? '<p>'.$item['subtitle'].'</p>' : '';
                        $item_image = (!empty($item['image'])) ? '<img src="'.$item['image']['url'].'" alt="">' : '';
                        $item_view = (!empty($item['text_large'])) ? '<a>ver más</a>' : '';
                        $item_hover = (!empty($item['text'])) ? '<div class="item__hover">'.$item['text'].' '.$item_view.'</div>' : '';    
                        $item_more = (!empty($item['text_large'])) ? $item['text_large'] : '';                        
                        ?>
                        <li class="splide__slide">
                            <div class="item item--team"  data-title="<?php echo $item['title']; ?>" data-subtitle="<?php echo $item['subtitle']; ?>" data-text="<?php echo $item_more; ?>">
                                <div class="item__hoverlay">
                                    <?php echo $item_title; ?>
                                    <?php echo $item_subtitle; ?>
                                </div>
                                <?php echo $item_hover; ?>
                                <?php echo $item_image; ?>
                            </div>                            
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </section>  
    </div>
<?php endif; ?>