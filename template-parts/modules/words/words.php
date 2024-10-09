<div class="module__header">
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
</div>

<?php if (!empty($items)): ?>
    <div class="items">
        <?php foreach ($items as $item):
            $item_title = (!empty($item['title'])) ? $item['title'] : ''; ?>
            <div class="item">
                <?php echo $item_title; ?>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-buttons.php'); ?>

