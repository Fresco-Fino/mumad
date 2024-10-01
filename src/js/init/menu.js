import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// Menu function
function menu() {

    const toggleBtn = document.getElementById('menu-toggle'),
        content = document.querySelector('#wrapper'),
        sidenav = document.querySelector('.sidenav'),
        burger = document.querySelector('.header__burger'),
        list = document.querySelector('.sidenav nav'),
        lang = document.querySelector('.lang_selector');
        
    let isOpen = false;

    const tl = gsap.timeline({ paused: true });
    if (window.innerWidth < 768) {
        tl.to(sidenav, { display: 'flex', duration: 0 })
            .to('.icon-equal', { duration: 0.4, morphSVG: '.icon-cross' })
            .to(sidenav, {
                height: '100vh',
                width: '100vw',
                duration: 0.3,
                ease: 'elastic.out(1, 0.75)'
            }, '<')
            .to(list, { opacity: 1, duration: 0.2 })
            .to(lang, { opacity: 1, duration: 0.2 });            
    } else {
        tl.to(sidenav, { display: 'block', duration: 0 })
            .to('.icon-equal', { duration: 0.4, morphSVG: '.icon-cross' })
            .to(sidenav, {
                height: 'auto',
                width: 'auto',
                duration: 0.5,
                ease: 'elastic.out(1, 0.75)'
            }, '<')
            .to(list, { opacity: 1, duration: 0.2 })
            .to(lang, { opacity: 1, duration: 0.2 }); 
    }

    toggleBtn.addEventListener('click', (e) => {
        burger.classList.toggle('is-open');

        if (isOpen === false) {
            tl.play();
        } else {
            tl.reverse();
        }
        isOpen = !isOpen;
    });

    content.addEventListener('click', (e) => {
        let target = e.target;
        if (isOpen && target !== sidenav) {
            tl.reverse();
        }
    });
}

export default menu;
