import Splide from '@splidejs/splide';

function moduleCarousel () {

    // console.log('module Carousel');

    const carousel = document.querySelectorAll('.carousel .splide');

    carousel.forEach((item) => {

        const splide = new Splide(item, {
            autoWidth: true,
            // height: 400,
            type   : 'loop',
            autoplay: true,
            pagination: true,
            arrows: false,
            gap: 10,
            perMove: 1,
            padding: { left: '0', right: '15vw' }
        });

        splide.mount();
        
    });
}

export default moduleCarousel;