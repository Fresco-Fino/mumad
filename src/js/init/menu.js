// Menu
import $ from 'jquery';

function menu() {

    // console.log('menu 1.0');

    var bodyEl = document.body,
      content = document.querySelector('.sidenav__bg'),
      openbtn = document.getElementById('menu-open'),
      botones = document.querySelectorAll('.sidenav a'),
      isOpen = false;

    function init() {
      initEvents();
    }

    function initEvents() {

      openbtn.addEventListener('click', toggleMenu);

      botones.forEach(function (element) {
        element.addEventListener('click', toggleMenu);
      })

      // close the menu element if the target it´s not the menu element or one of its descendants..
      content.addEventListener('click', function (ev) {
        var target = ev.target;
        if (isOpen && target !== openbtn) {
          toggleMenu();
        }
      });

    }

    // toggle menu
    function toggleMenu() {
        if (isOpen) {
            jQuery('body').removeClass('menu-open');
            jQuery('.sidenav__bg').fadeOut();
        } else {
            jQuery('body').addClass('menu-open');
            jQuery('.sidenav__bg').fadeIn();
        }
        isOpen = !isOpen;
    }

    // init
    init();

}

export default menu;