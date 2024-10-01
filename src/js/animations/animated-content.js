import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger );

function animatedContent() {

    console.log('animated content 1.0');

    // animated contents
    const itemContent = gsap.utils.toArray('.animated__content');

    itemContent.forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                start: 'top 50%',
                end: 'bottom top',
                trigger: item,
                onEnter() {
                    item.classList.add('animated');
                },
                onLeave() {
                    item.classList.remove('animated');
                },
                onEnterBack() {
                    item.classList.add('animated');
                },
                onLeaveBack() {
                    item.classList.remove('animated');
                }
            }
        });
    });

}

export default animatedContent;