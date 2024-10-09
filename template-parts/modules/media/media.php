<div class="module__header">
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-section.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-title.php'); ?>
    <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-text.php'); ?>
</div>

<?php if(!empty($media['image']) || !empty($media['video'])): ?>
    <div class="items">
        <?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-media.php'); ?>
    </div>
<?php endif; ?>

<?php include(TEMPLATEPATH . '/template-parts/modules/commons/module-buttons.php'); ?>