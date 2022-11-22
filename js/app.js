//slide library 1.0

//TODO add sound support to slides
//TODO add check icon next to button when slide is completed

const slide = (slideSelector, storageName="modules_completed") => {

    //console.log('booting slide', slideSelector);

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
    //component state
    const state = {
        completedModules: {}
    };
    const pageName = document.getElementById('page')?.dataset?.pageId || "";

    //current audio track
    let currentAudioTrack = "";
    //audio player
    let audioPlayer = new Audio();

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
    
    const btnsCheck = wrapper.getElementsByClassName('btn-check');

    //if modal is present in DOM store ref in modal variable
    const modal = document.getElementById('modal');

    function initializeState () {
        //if there are buttons that can be checked then initialize the state
        if (btnsCheck.length) {
            for (let i = 0; i < btnsCheck.length; i++) {
                state.completedModules[btnsCheck[i].dataset.check] = false;
                btnsCheck[i].addEventListener('click', () => {
                    state.completedModules[btnsCheck[i].dataset.check] = true;
                    checkForCompletedModule();
                });
            }
        }
    }

    //check if module has been completed when user clicks in the button
    function checkForCompletedModule() {
        //console.log(slideSelector, state);
        if (btnsCheck.length) {
            for (let i = 0; i < btnsCheck.length; i++) {
                const key = btnsCheck[i].dataset.check;
                if (state.completedModules[key]) {
                    btnsCheck[i].classList.add('btn-check__show');
                    //console.log('completed module', pageName + key);
                    //console.log(state.completedModules);
                    updateModuleState(state);
                }
            }
        }
    }

    function updateModuleState() {
        const savedState = JSON.parse(localStorage.getItem(storageName)) || {};
        if (!savedState[pageName]) {
            savedState[pageName] = {};
        } 
        savedState[pageName][slideSelector] = state.completedModules;
        localStorage.setItem('modules_completed', JSON.stringify(savedState));
    }

    function loadStateFromStorage() {
        const savedState = JSON.parse(localStorage.getItem(storageName)) || {};
        if (savedState[pageName]) {
            if (savedState[pageName][slideSelector]) {
                state.completedModules = savedState[pageName][slideSelector];
            }
        } else {
            updateModuleState();
        }
    }


    //check if there are buttons that can open other slides
    //add click event to this buttons
    //reading the property data-slide-selector of the element we know which slide to open
    if (btnOpenSlideList.length) {
        for (let i = 0; i < btnOpenSlideList.length; i++) {
            btnOpenSlideList[i].addEventListener('click', (e) => {
                wrapper.classList.add('hide');
                const slideToOpen = btnOpenSlideList[i].dataset.slideSelector;
                document.getElementById(slideToOpen).classList.remove('hide');
                stopAudio();
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
                    stopAudio();
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
            render();
        });

        //button prev (Anterior)
        addClickEventToControl(btnPrev,  () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                controlDir = "prev";
            }
            render();
        });

        //button player
        addClickEventToControl(btnPlay,  () => {
            if (!currentAudioTrack && !audioPlayer) {
                return;
            }
        
            if (audioPlayer.paused) {
                togglePlayerButton(true);
                audioPlayer.play();
            } else {
                togglePlayerButton(false);
                audioPlayer.pause();
            }
        });

        //button home (Icono casa)
        addClickEventToControl(btnBack, () => {
            const slideToOpen = btnBack.dataset.slideSelector;
            if (slideToOpen) {
                wrapper.classList.add('hide');
                document.getElementById(slideToOpen).classList.remove('hide');
                stopAudio();
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

    //toggle player button
    function togglePlayerButton(playing) {
        const btnIcon = btnPlay.querySelector(".fa-solid");
        if (playing) {
            btnIcon.classList.remove('fa-play');
            btnIcon.classList.add('fa-pause');
        } else {
            btnIcon.classList.remove('fa-pause');
            btnIcon.classList.add('fa-play');
        }
    }

    //callback when audio ends
    audioPlayer.addEventListener('ended', () => {
        togglePlayerButton(false);
    });

    function stopAudio() {
        if (audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            togglePlayerButton(false);
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

        //load audio file to player
        currentAudioTrack = currentSlide.dataset.audio;
        if (currentAudioTrack) {
            togglePlayerButton(false);
            audioPlayer.src=currentAudioTrack;
        } else {
            audioPlayer.pause();
        }
    }

    //render player button
    function showPlayerButton() {
        if (!currentAudioTrack) {
            btnPlay.classList.add('hide');
        } else {
            btnPlay.classList.remove('hide');
        }
    }

    //render menu buttons
    function showButtons() {
        currentSlideIndex === 0 ? btnPrev.classList.add('btn-hide') : btnPrev.classList.remove('btn-hide');
        currentSlideIndex+1 >= slides.length ? btnNext.classList.add('btn-hide') : btnNext.classList.remove('btn-hide');
        showPlayerButton();
    }

    //function to execute everytime we want to update the screen
    //it accepts a callback (optional)
    function render () {
        showCurrentActiveSlide();
        showButtons();
        checkForCompletedModule();

        if(typeof cb == "function") {
            cb();
        }
    }


    //add listeners when library loads
    addEventListenersToControls();

    //initialize state
    initializeState();

    //load completed modules data from storage
    loadStateFromStorage();

    //render for the first time
    render();

};


const completedModules = (pagesRoute, storageName) => {

    let state = {};

    function loadStateFromStorage() {
        const savedState = JSON.parse(localStorage.getItem(storageName)) || {};
        state = savedState;
        unlockCompletedModules(state);
    }

    function unlockCompletedModules (modules) {
        const modulesResult = {};
        for (let key in modules) {
            modulesResult[key] = countCompletedModules(modules[key], 0);
        }

        //console.log(modulesResult);

        for (let i = 0; i < pagesRoute.length; i++) {
            const result = modulesResult[pagesRoute[i].pageName];

            //console.log(pagesRoute[i].pageName, result)

            if (result === undefined || result === null) {
                break;
            }


            if (result >= pagesRoute[i].slides && i < pagesRoute.length) {
                if (Array.isArray(pagesRoute[i+1].pageName)) {
                    pagesRoute[i+1].pageName.forEach(p => unlockFromDOM(p));
                } else {
                    unlockFromDOM(pagesRoute[i+1].pageName);
                }
            }
        }
    }


    function unlockFromDOM (pageSelector) {
        console.log("UNLOCK ", pageSelector);
        const el = document.getElementById(pageSelector);
        el.classList.remove('disabled-wrapper');
        el.classList.add('enable-wrapper');
    }

    function countCompletedModules(obj, counter) {
        for (let key in obj) {
            let val = obj[key];
            if (typeof val === 'object') {
                counter = countCompletedModules(val, counter)
            } else {
                if (obj[key] === true) {
                    counter++;
                }
            }
        }
        return counter;
    }

    loadStateFromStorage();

}