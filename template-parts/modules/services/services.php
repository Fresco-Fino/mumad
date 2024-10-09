<div class="module__header">
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
</div>

<?php if(!empty($items)): ?>
    <div class="items">
        <?php foreach($items as $item):            
            $item_title = (!empty($item['title'])) ? '<h3>'.$item['title'].'</h3>' : '';
            $item_description = (!empty($item['description'])) ? $item['description'] : '';
            $item_age = (!empty($item['age'])) ? '<div class="service__age">'.$item['age'].'</div>' : '';
            ?>
            <div class="item">

                <div class="service__header">
                    <div>
                        <?php echo $item_title; ?>
                        <?php echo $item_description; ?>
                    </div>
                    <?php echo $item_age; ?>
                </div>

                <?php if(!empty($item['subtype'])): ?>
                    <div class="service__body">
                        <?php foreach ($item['subtype'] as $type) {   
                            $type_age = (!empty($type['age'])) ? ' ('.$type['age'].')' : '';                         
                            $type_title = (!empty($type['title'])) ? '<h4><img src="'.get_bloginfo('template_url').'/dist/assets/images/icon-hand.png" alt="">'.$type['title'].''.$type_age.'</h4>' : '';
                            $type_resume = (!empty($type['resume'])) ? $type['resume'] : '';
                            ?>

                            <div class="accordion">

                                <div class="accordion__trigger">

                                    <div>
                                        <?php echo $type_title; ?>
                                        <?php echo $type_resume; ?>
                                    </div>

                                    <?php if(!empty($type['text'])): ?>
                                        <a class="btn btn__outline-primary"><?php _e('Saber más', 'mumad'); ?></a>
                                    <?php endif; ?>

                                </div>

                                <?php if(!empty($type['text'])): ?>
                                    <div class="accordion__body">
                                        <div class="accordion__inside">
                                            <?php echo $type['text']; ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                            </div>
                        <?php } ?>
                    </div>
                <?php endif; ?>

            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>