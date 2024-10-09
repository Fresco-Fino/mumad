import Splide from '@splidejs/splide';

function moduleTeam() {

    // console.log('module Team');

    const carousel = document.querySelectorAll('.team .splide');

    carousel.forEach((item) => {
        const splide = new Splide(item, {
            pagination: true,
            arrows: false,
            gap: 15,
            perPage: 4,
            perMove: 1,
            padding: { left: '0', right: '15vw' },
            breakpoints: {
                767: {
                    perPage: 1,
                    padding: { left: 0, right: 100 },
                    gap: 10
                },
                991: {
                    perPage: 2,                    
                    padding: { left: 0, right: 100 }
                },
                1599: {
                    perPage: 3,
                    padding: { left: 0, right: 150 }
                }
            }
        });

        splide.mount();
    });
}

export default moduleTeam;
