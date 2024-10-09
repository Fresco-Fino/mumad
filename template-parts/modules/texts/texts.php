<?php if (!empty($items)): ?>
    <div class="columns">
        <?php foreach ($items as $item): 
            $content[] = '';
            $content['title'] = (!empty($item['title'])) ? $item['title'] : '';
            $content['text'] = (!empty($item['text'])) ? $item['text'] : '';
            ?>
            <div class="col">
                <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
                <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
            </div> 
        <?php endforeach; ?>
    </div>
<?php endif; ?>