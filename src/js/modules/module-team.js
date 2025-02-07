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

    // Add event listeners to team items
    const teamItems = document.querySelectorAll('.item--team');

    teamItems.forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    // Add event listener to close button
    const closeButton = document.querySelector('.modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Add event listener to modal container
    const modal = document.getElementById('teamModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    function openModal(element) {
        document.getElementById('modalTitle').innerText = element.getAttribute('data-title');
        document.getElementById('modalSubtitle').innerText = element.getAttribute('data-subtitle');
        document.getElementById('modalText').innerHTML = element.getAttribute('data-text');
        document.getElementById('teamModal').style.display = "flex";
    }
    
    function closeModal() {
        document.getElementById('teamModal').style.display = "none";
    }
}

export default moduleTeam;
