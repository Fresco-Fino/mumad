<?php

// module
if (get_row_layout() == 'carousel'):
    require(TEMPLATEPATH . '/template-parts/modules/carousel/carousel.php');

elseif (get_row_layout() == 'claim'):
    require(TEMPLATEPATH . '/template-parts/modules/claim/claim.php');

elseif (get_row_layout() == 'form'):
    require(TEMPLATEPATH . '/template-parts/modules/form/form.php');

elseif (get_row_layout() == 'hero'):
    require(TEMPLATEPATH . '/template-parts/modules/hero/hero.php');

elseif (get_row_layout() == 'icons'):
    require(TEMPLATEPATH . '/template-parts/modules/icons/icons.php');

elseif (get_row_layout() == 'image-text'):
    require(TEMPLATEPATH . '/template-parts/modules/image-text/image-text.php');

elseif (get_row_layout() == 'location'):
    require(TEMPLATEPATH . '/template-parts/modules/location/location.php');

elseif (get_row_layout() == 'media'):
    require(TEMPLATEPATH . '/template-parts/modules/media/media.php');

elseif (get_row_layout() == 'services'):
    require(TEMPLATEPATH . '/template-parts/modules/services/services.php');

elseif (get_row_layout() == 'team'):
    require(TEMPLATEPATH . '/template-parts/modules/team/team.php');

elseif (get_row_layout() == 'texts'):
    require(TEMPLATEPATH . '/template-parts/modules/texts/texts.php');
    
elseif (get_row_layout() == 'words'):
    require(TEMPLATEPATH . '/template-parts/modules/words/words.php');

endif;