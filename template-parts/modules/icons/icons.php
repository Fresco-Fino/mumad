<div class="module__header">
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
</div>

<?php if (!empty($items)): ?>
    <div class="items">
        <?php foreach ($items as $item):
            $item_image = (!empty($item['image'])) ? '<img src="' . $item['image']['url'] . '" alt="">' : '';
            $item_title = (!empty($item['title'])) ? '<h3>' . $item['title'] . '</h3>' : '';
            ?>
            <div class="item">
                <?php echo $item_image; ?>
                <?php echo $item_title; ?>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>