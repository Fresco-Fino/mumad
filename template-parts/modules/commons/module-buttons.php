<?php if (!empty($buttons)): ?>
    <div class="module__buttons">
        <?php foreach ($buttons as $button) {
            $link = isset($button['link']['url']) ? $button['link']['url'] : '';
            $style = isset($button['style']) ? $button['style'] : 'normal';
            $title = isset($button['text']) ? $button['text'] : ''; ?>
            <a href="<?php echo $link; ?>" class="btn btn__icon <?php echo $style; ?>">
                <?php echo $title; ?>
                <?php echo custom_get_svg_icon( array( 'icon' => 'arrow' ));  ?>
            </a>
        <?php } ?>
    </div>
<?php endif; ?>