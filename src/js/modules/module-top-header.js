import Splide from '@splidejs/splide';

function moduleTopHeader () {

    console.log('module Carousel');

    const carousel = document.querySelectorAll('.single__carousel .splide');

    carousel.forEach((item) => {

        const splide = new Splide(item, {
            // autoWidth: true,
            // height: 400,
            type   : 'loop',
            autoplay: true,
            pagination: false,
            arrows: false,
            gap: 10,
            perPage: 1,
            perMove: 1,
            padding: { left: '25vw', right: '25vw' },
            breakpoints: {
                767: {
                    perPage: 1,
                    perMove: 1,
                    padding: { left: '10vw', right: '10vw' },
                    gap: 10
                }
            }
        });

        splide.mount();
    });
}

export default moduleTopHeader;