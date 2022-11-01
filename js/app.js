//slide library 1.0

const slide = (slideSelector) => {

    console.log('booting slide', slideSelector);

    //get wrapper from DOM
    const wrapper = document.getElementById(slideSelector);
    
    //if wrapper does not exist then throw Error
    if (!wrapper) {
        throw Error(`DOM element ${slideSelector} does not exist`);
    }

    //current slide
    let currentSlideIndex = 0;
    //direction of the navigation
    let controlDir = "next";

    //get all DOM elements from wrapper
    const btnNext = wrapper.querySelector('#btn-next');
    const btnPrev = wrapper.querySelector('#btn-prev');
    const btnBack = wrapper.querySelector('#btn-back');
    const btnPlay = wrapper.querySelector('#btn-play');
    const title = wrapper.querySelector('#sl-title');
    const body = wrapper.querySelector('#body');
    const slides = wrapper.getElementsByClassName('sl');
    const btnOpenSlideList = wrapper.getElementsByClassName('btn-open-slide');
    const contentModalBtns = wrapper.getElementsByClassName('content-modal-btn');

    //if modal is present in DOM store ref in modal var
    const modal = document.getElementById('modal');

    //check if there are buttons that can open other slides
    //add click event to this buttons
    //reading the property data-slide-selector of the element we know which slide to open
    if (btnOpenSlideList.length) {
        for (let i = 0; i < btnOpenSlideList.length; i++) {
            btnOpenSlideList[i].addEventListener('click', (e) => {
                wrapper.classList.add('hide');
                const slideToOpen = btnOpenSlideList[i].dataset.slideSelector;
                document.getElementById(slideToOpen).classList.remove('hide');
            });
        }
    }

    //check if there are buttons that can open the modal window
    //add click event to this buttons
    //reading the property data-modal of the element we know which content to load
    if (contentModalBtns.length) {
        for (let i = 0; i < contentModalBtns.length; i++) {
            contentModalBtns[i].addEventListener('click', (e) => {
                if (modal) {
                    const contentToOpen = modal.querySelector(`#${contentModalBtns[i].dataset.modal}`);
                    contentToOpen.classList.remove('hide');
                    modal.classList.remove('hide');
                }
            });
        }
    }

    //generic method to add click event
    function addClickEventToControl(control, cb) {
        if (control && typeof cb == 'function') {
            control.addEventListener('click', cb);
        }
    }

    //add click events to bottom screen controls
    function addEventListenersToControls () {

        //button next (Siguiente)
        addClickEventToControl(btnNext, () => {
            if (currentSlideIndex < slides.length) {
                currentSlideIndex++;
                controlDir = "next";
            }
            afterEachSlide();
        });

        //button prev (Anterior)
        addClickEventToControl(btnPrev,  () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                controlDir = "prev";
            }
            afterEachSlide();
        });

        //button home (Icono casa)
        addClickEventToControl(btnBack, () => {
            const slideToOpen = btnBack.dataset.slideSelector;
            if (slideToOpen) {
                wrapper.classList.add('hide');
                document.getElementById(slideToOpen).classList.remove('hide');
            }
        });

        //if modal is present then add event to the close button
        //and remove all content in the modal
        if (modal) {
            const closeButtonModal = modal.querySelector("#modal-close-btn");
            addClickEventToControl(closeButtonModal, () => {
                const modalContent = modal.getElementsByClassName('modal-body');
                for (let i=0; i < modalContent.length; i++) {
                    modalContent[i].classList.add('hide');
                }
                modal.classList.add('hide');
            });
        }
    }

    //function to render current slide
    function showCurrentActiveSlide() {

        //if index if out of bounds then return
        if (!(currentSlideIndex >= 0 && currentSlideIndex < slides.length)) {
            return;
        }

        //if dir is next then hide prev slide
        if (controlDir === "next" && (currentSlideIndex-1) >= 0){
            slides[currentSlideIndex-1].classList.add('hide');
            slides[currentSlideIndex-1].classList.remove('show');
        }

        //if dir is prev then hide next slide
        if (controlDir === "prev" && (currentSlideIndex+1) < slides.length){
            slides[currentSlideIndex+1].classList.add('hide');
            slides[currentSlideIndex+1].classList.remove('show');
        }
        
        //show slide
        const currentSlide = slides[currentSlideIndex];
        //load title from data-title in the header 
        title.textContent = currentSlide.dataset.title;
        currentSlide.classList.add('show');
    }

    //render menu buttons
    function showButtons() {
        currentSlideIndex === 0 ? btnPrev.classList.add('btn-hide') : btnPrev.classList.remove('btn-hide');
        currentSlideIndex+1 >= slides.length ? btnNext.classList.add('btn-hide') : btnNext.classList.remove('btn-hide');
    }

    //function to execute after each slide is rendered
    //it accepts a callback (optional)
    function afterEachSlide(cb) {
        showCurrentActiveSlide();
        showButtons();

        if(typeof cb == "function") {
            cb();
        }
    }

    //add listeners when library loads
    addEventListenersToControls();

    //render for the first time
    afterEachSlide();
};
