'use strict';

var slideShow = (function () {
    return function (selector) {
        let slider = document.querySelector(selector);
        let sliderViewport = slider.querySelector('.slider-viewport');
        let sliderWrapper = slider.querySelector('.slider-wrapper');
        let sliderItems = slider.querySelectorAll('.slider-item');
        let indexMax = sliderItems.length - 1;
        let translateWidth = 0;
        let switchPointItems = [];
        let stepTouch = 50;

        sliderItems.forEach((item) => {
            item.style.width = `calc(100%/${sliderItems.length})`;
        });
        sliderWrapper.style.width = `calc(100%*${sliderItems.length})`;

        let position = {
            current: 0,
            get() {
                return this.current;
            },
            perv() {
                this.set(this.current - 1);
            },
            next() {
                this.set(this.current + 1);
            },
            set(value) {
                if(value < 0) {
                    this.current = 0;
                    return;
                }
                if(value > indexMax) {
                    this.current = indexMax;
                    return;
                }
                this.current = value;
            }
        }

        let move = (direction) => {
            let perviousIndicator = position.get();
            let viewportWidth = sliderViewport.getBoundingClientRect().width;
            position[direction]();
            translateWidth = - viewportWidth * position.get();
            sliderWrapper.style.transform = `translateX(${translateWidth}px)`;

            switchPointItems[perviousIndicator].classList.remove('slider-point-active');
            switchPointItems[position.get()].classList.add('slider-point-active');
        }

        let moveTo = (index) => {
            let direction = (index > position.get()) ? 'next' : 'perv';
            while(position.get() !== index) {
                move(direction);
            }
        }

        let isTouchDevice = () => {
            return ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0);
        };

        let addSliderSwitchPoints = () => {
            let sliderSwitch = document.createElement('div');
            sliderSwitch.classList.add('slide-switch');
            for(let i = 0; i <= indexMax; i++) {
                let switchPoint = document.createElement('div');
                if(i === 0) {
                    switchPoint.classList.add('slider-point-active');
                }
                switchPoint.setAttribute("data-slide-to", i);
                sliderSwitch.appendChild(switchPoint);
            }
            slider.appendChild(sliderSwitch);
            switchPointItems = slider.querySelectorAll('.slide-switch > div');
        };

        let setListeners = () => {
            let startX = 0;
            if(isTouchDevice()) {
                slider.addEventListener('touchstart', (evnt) => {
                    startX = evnt.changedTouches[0].clientX;
                });
                slider.addEventListener('touchend', (evnt) => {
                    let finishX = evnt.changedTouches[0].clientX;
                    let deltaX = finishX - startX;
                    if(Math.abs(deltaX) > stepTouch) {
                        move((deltaX < 0) ? 'next' : 'perv');
                    }
                });
            }
            slider.addEventListener('click', (evnt) => {
                if(evnt.target.classList.contains('slider-control')) {
                    evnt.preventDefault();
                    move((evnt.target.classList.contains('slider-control-right')) ? 'next' : 'perv');
                    return
                }
                if(evnt.target.getAttribute('data-slide-to')) {
                    evnt.preventDefault();
                    moveTo(parseInt(evnt.target.getAttribute('data-slide-to')));
                }
            });
        }

        addSliderSwitchPoints();
        setListeners();
    };
}());

slideShow('.slider');
