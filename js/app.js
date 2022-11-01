const slide = (slideSelector) => {

    console.log('booting slide', slideSelector);

    const wrapper = document.getElementById(slideSelector);
    
    if (!wrapper) {
        throw Error(`DOM element ${slideSelector} does not exist`);
    }

    let currentSlideIndex = 0;
    let controlDir = "next";

    const btnNext = wrapper.querySelector('#btn-next');
    const btnPrev = wrapper.querySelector('#btn-prev');
    const btnBack = wrapper.querySelector('#btn-back');
    const btnPlay = wrapper.querySelector('#btn-play');
    const title = wrapper.querySelector('#sl-title');
    const body = wrapper.querySelector('#body');
    const slides = wrapper.getElementsByClassName('sl');
    const btnOpenSlideList = wrapper.getElementsByClassName('btn-open-slide');
    const contentModalBtns = wrapper.getElementsByClassName('content-modal-btn');
    const modal = document.getElementById('modal');

    if (btnOpenSlideList.length) {
        for (let i = 0; i < btnOpenSlideList.length; i++) {
            btnOpenSlideList[i].addEventListener('click', (e) => {
                console.log(btnOpenSlideList[i]);
                wrapper.classList.add('hide');
                const slideToOpen = btnOpenSlideList[i].dataset.slideSelector;
                document.getElementById(slideToOpen).classList.remove('hide');
            });
        }
    }

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

    function addClickEventToControl(control, cb) {
        if (control && typeof cb == 'function') {
            control.addEventListener('click', cb);
        }
    }

    function addEventListenersToControls () {
        addClickEventToControl(btnNext, () => {
            if (currentSlideIndex < slides.length) {
                currentSlideIndex++;
                controlDir = "next";
            }
            afterEachSlide();
        });

        addClickEventToControl(btnPrev,  () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                controlDir = "prev";
            }
            afterEachSlide();
        });

        addClickEventToControl(btnBack, () => {
            const slideToOpen = btnBack.dataset.slideSelector;
            if (slideToOpen) {
                wrapper.classList.add('hide');
                document.getElementById(slideToOpen).classList.remove('hide');
            }
        });

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
        title.textContent = currentSlide.dataset.title;
        currentSlide.classList.add('show');
    }

    function showButtons() {
        currentSlideIndex === 0 ? btnPrev.classList.add('btn-hide') : btnPrev.classList.remove('btn-hide');
        currentSlideIndex+1 >= slides.length ? btnNext.classList.add('btn-hide') : btnNext.classList.remove('btn-hide');
    }

    function afterEachSlide(cb) {
        showCurrentActiveSlide();
        showButtons();

        if(typeof cb == "function") {
            cb();
        }
    }

    addEventListenersToControls();
    afterEachSlide();

};
