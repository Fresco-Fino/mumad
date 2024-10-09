// hide menu

function hideMenu() {

    // console.log('hide menu');

    /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
    var prevScrollpos = window.pageYOffset;

    window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            jQuery('.site-header').removeClass('hide-menu');
        } else {
            jQuery('.site-header').addClass('hide-menu');
        }
        prevScrollpos = currentScrollPos;
    };
    
}

export default hideMenu;
