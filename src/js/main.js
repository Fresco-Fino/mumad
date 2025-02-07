
// init
import menu from './init/menu.js';
import shrink from './init/shrink.js';
import hideMenu from './init/hide-menu.js';
import customCursor from './init/cursor.js';
import smooth from './init/smoothScroll.js';

// modules
import moduleCarousel from './modules/module-carousel.js';
import moduleTeam from './modules/module-team.js';
import moduleTopHeader from './modules/module-top-header.js';
import moduleAccordion from './modules/module-accordion.js';

// animations
import animatedContent from './animations/animated-content.js';
import animatedTitles from './animations/animated-titles.js';

///////////////////////////////////////////////////////////////////////////////////

// before loaded
document.addEventListener('DOMContentLoaded', beforeLoad);

// load
window.addEventListener('load', () => {    

    const loader = document.querySelector('.loader');

    setTimeout(() => {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
            start();
        });
    }, 500);    

});

// Window On Resize
window.addEventListener('resize', onResize);

///////////////////////////////////////////////////////////////////////////////////

function beforeLoad() {

    smooth();   
    shrink(); 
    hideMenu();  
    menu(); 
    customCursor(); 

    const topHeaderExist = document.getElementsByClassName('site-header__top');
    if ( topHeaderExist.length > 0 ) { moduleTopHeader(); }

    const carouselExist = document.getElementsByClassName('carousel');
    if ( carouselExist.length > 0 ) { moduleCarousel(); }

    const teamExist = document.getElementsByClassName('team');
    if ( teamExist.length > 0 ) { moduleTeam(); }

    const accordionExist = document.getElementsByClassName('accordion');
    if ( accordionExist.length > 0 ) { moduleAccordion(); }    
    
}

function start() {

    const animatedTitleExist = document.getElementsByClassName('animated__title');
    if ( animatedTitleExist.length > 0 ) { animatedTitles(); }

    const animatedContentExist = document.getElementsByClassName('animated__content');
    if ( animatedContentExist.length > 0 ) { animatedContent(); }
    
}

function onResize() {}

function openModal(element) {
    document.getElementById('modalTitle').innerText = element.getAttribute('data-title');
    document.getElementById('modalSubtitle').innerText = element.getAttribute('data-subtitle');
    document.getElementById('modalText').innerHTML = element.getAttribute('data-text');
    document.getElementById('teamModal').style.display = "flex";
}

function closeModal() {
    document.getElementById('teamModal').style.display = "none";
}