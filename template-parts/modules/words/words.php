<?php  /*
// fields and content
$words_intro = (!empty($content['text'])) ? '<div class="module__intro">'.$content['text'].'</div>' : '';
?>

<div class="module__content">
    <?php echo $words_intro; ?>
</div>

<div class="words__items">
    <?php foreach ($items as $item) { 
        $word__title = (!empty($item['title'])) ? '<div class="words__title">'.$item['title'].'</div>' : '';
        $word__text = (!empty($item['text'])) ? '<div class="words__text">'.$item['text'].'</div>' : ''; ?>
        <div class="words__item">
            <?php echo $word__title; ?>
            <?php echo $word__text; ?>
        </div>
    <?php } ?>
</div> */ ?>
