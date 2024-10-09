<?php if (!empty($media['video']) || !empty($media['image'])): ?>
    <div class="module__media">
        <?php if ($media['type'] === "image") {
                include(TEMPLATEPATH . '/template-parts/modules/commons/module-image.php');
            } else if ($media['type'] === "video") {
                include(TEMPLATEPATH . '/template-parts/modules/commons/module-video.php');
            } ?>
    </div>
<?php endif; ?>