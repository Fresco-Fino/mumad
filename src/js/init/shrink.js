// Shrink


function shrink() {

    // console.log('shrink');

    var offset = 150;
    var duration = 300;
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery("body").addClass("shrink");

        } else {
            jQuery("body").removeClass("shrink");
        }
    });

}

export default shrink;