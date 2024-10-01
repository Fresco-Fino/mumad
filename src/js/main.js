
// init
import menu from './init/menu.js';
import customCursor from './init/cursor.js';
import smooth from './init/smoothScroll.js';
import calculateVH  from './init/calvulate-vh.js';

// modules
import moduleCarousel from './modules/module-carousel.js';
import moduleModal from './modules/module-modal.js';
import moduleTeam from './modules/module-team.js';
import moduleTopHeader from './modules/module-top-header.js';

// animations
import animatedContent from './animations/animated-content.js';
import animatedPhrases from './animations/animated-phrases.js';
import animatedTitles from './animations/animated-titles.js';

///////////////////////////////////////////////////////////////////////////////////

// before loaded
document.addEventListener('DOMContentLoaded', beforeLoad);

// load
window.addEventListener('load', () => {

    start();

    // const titleFullExist = document.getElementsByClassName('module-title-full');
    // if (titleFullExist.length > 0) {
    //     titleFull();
    // }

    // const loader = document.querySelector('.loader');

    // setTimeout(() => {
    //     loader.classList.add('hidden');
    //     loader.addEventListener('transitionend', () => {
    //         loader.style.display = 'none';
    //     });
    // }, 500);    

});

// Window On Resize
window.addEventListener('resize', onResize);

///////////////////////////////////////////////////////////////////////////////////

function beforeLoad() {
    
    calculateVH();
    customCursor();
    menu();
    smooth();    

    const singleVideoExist = document.getElementsByClassName('single__header--video');
    if ( singleVideoExist.length > 0 ) { moduleCarousel(); }
    
}

function start() {

    const moduleBannerExist = document.getElementsByClassName('new__text');
    if ( moduleBannerExist.length > 0 ) { moduleBanner(); }
    
}

function onResize() {
    calculateVH();
}
