<?php if (!empty($buttons)): ?>
    <div class="module__buttons">
        <?php foreach ($buttons as $button) {
            $link = isset($button['link']['url']) ? $button['link']['url'] : '';
            $style = isset($button['style']) ? $button['style'] : 'normal';
            $title = isset($button['title']) ? $button['title'] : ''; ?>
            <a href="<?php echo $link; ?>" class="btn <?php echo $style; ?>">
                <?php echo $title; ?>
            </a>
        <?php } ?>
    </div>
<?php endif; ?>