import Splide from '@splidejs/splide';

function moduleTopHeader () {

    // console.log('module Top  Header');

    const carousel = document.querySelectorAll('.splide__top');

    carousel.forEach((item) => {

        const splide = new Splide(item, {
            // autoWidth: true,
            height: 15,
            // type   : 'loop',
            direction: 'ttb',
            autoplay: true,
            pagination: false,
            arrows: false,
            perPage: 1,
            perMove: 1
        });

        splide.mount();

    });
}

export default moduleTopHeader;