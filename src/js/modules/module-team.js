import Splide from '@splidejs/splide';

function moduleTeam() {

    console.log('module Team');

    const carousel = document.querySelectorAll('.team .splide');

    carousel.forEach((item) => {
        const splide = new Splide(item, {
            // autoWidth: true,
            // height: 400,
            pagination: false,
            arrows: false,
            gap: 10,
            perPage: 4,
            padding: { left: 0, right: 250 },
            breakpoints: {
                767: {
                    perPage: 1,
                    perMove: 1,
                    padding: { left: 0, right: 60 },
                    gap: 15
                },
                991: {
                    perPage: 2,
                    perMove: 1,
                    padding: { left: 0, right: 100 },
                    gap: 15
                },
                1199: {
                    perPage: 3,
                    perMove: 1,
                    padding: { left: 0, right: 150 },
                    gap: 15
                }
            }
        });

        splide.mount();
    });
}

export default moduleTeam;
