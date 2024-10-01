<?php

// module
if (get_row_layout() == 'awards'):
    require(TEMPLATEPATH . '/template-parts/modules/awards/awards.php');

elseif (get_row_layout() == 'banner'):
    require(TEMPLATEPATH . '/template-parts/modules/banner/banner.php');

elseif (get_row_layout() == 'banner_parallax'):
    require(TEMPLATEPATH . '/template-parts/modules/banner/banner_parallax.php');

elseif (get_row_layout() == 'blocks'):
    require(TEMPLATEPATH . '/template-parts/modules/blocks/blocks.php');

elseif (get_row_layout() == 'cases'):
    require(TEMPLATEPATH . '/template-parts/modules/cases/cases.php');

elseif (get_row_layout() == 'clients'):
    require(TEMPLATEPATH . '/template-parts/modules/clients/clients.php');

elseif (get_row_layout() == 'hero'):
    require(TEMPLATEPATH . '/template-parts/modules/hero/hero.php');

elseif (get_row_layout() == 'marquee'):
    require(TEMPLATEPATH . '/template-parts/modules/marquee/marquee.php');

elseif (get_row_layout() == 'quotes'):
    require(TEMPLATEPATH . '/template-parts/modules/quotes/quotes.php');

elseif (get_row_layout() == 'services'):
    require(TEMPLATEPATH . '/template-parts/modules/services/services.php');

elseif (get_row_layout() == 'steps'):
    require(TEMPLATEPATH . '/template-parts/modules/steps/steps.php');

elseif (get_row_layout() == 'team'):
    require(TEMPLATEPATH . '/template-parts/modules/team/team.php');

elseif (get_row_layout() == 'values'):
    require(TEMPLATEPATH . '/template-parts/modules/values/values.php');

elseif (get_row_layout() == 'words'):
    require(TEMPLATEPATH . '/template-parts/modules/words/words.php');

endif;