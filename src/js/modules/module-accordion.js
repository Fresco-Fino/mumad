const handlers = {
    handleClickAccordion: null,
    handleClickHijoAccordion: null
};

export function moduleAccordion() {

    // console.log('module accordion');

    const allPanels = document.querySelectorAll('.accordion__body');

    allPanels.forEach((panel) => {
        panel.style.maxHeight = '0px';
    })

    const accordions = document.querySelectorAll('.accordion__trigger');

    accordions.forEach((accordion) => {        

        // console.log('cada accordion');

        // obetenemos el padre
        const parent = accordion.parentElement;

        // obtenemos el panel que contiene
        const panel = parent.querySelector('.accordion__body');        

        // Funcion para el click de los padres
        handlers.handleClickAccordion = (e) => {

            // console.log('click accordeon');

            // se esta activado
            if (accordion.classList.contains('active')) {

                if( panel != null) {
                    panel.style.maxHeight = '0px';
                    panel.style.marginTop = '0px';
                    accordion.classList.remove('active');
                }

            // si no esta activado
            } else {

                if(panel != null) {
                    const contentHeight = panel.scrollHeight;
                    panel.style.maxHeight = `${contentHeight}px`;
                    panel.style.marginTop = '20px';
                    accordion.classList.add('active');
                }

                // Cierra el resto de los otros paneles > padres e hijos
                parent.parentElement.querySelectorAll('.accordion__body').forEach((hermanoPanel) => {
                    if (hermanoPanel !== panel) {
                        // console.log(hermanoPanel);
                        hermanoPanel.style.maxHeight = '0px';
                        hermanoPanel.style.marginTop = '0px';
                        hermanoPanel.parentElement.querySelector('.accordion__trigger').classList.remove('active');
                    }
                });
            }

        };

        accordion.addEventListener('click', handlers.handleClickAccordion);
        accordion.handleClickFunction = handlers.handleClickAccordion; // Guardar la función original

    });

}

export default moduleAccordion;