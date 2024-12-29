(function (initialObject, version) {
    "use strict";

    const globalKey = "expLibraryData";

    // Initialize or update the global object
    window[globalKey] = window[globalKey] || { ...initialObject, version: 0 };
    if (window[globalKey].version >= version) return;

    Object.assign(window[globalKey], {
        ...initialObject,
        version,
        sliders: [],
    });

    const { sliders } = window[globalKey];

    const injectStylesheet = () => {
        try {
            const style = document.createElement("style");
            style.textContent = `
                .TSslider {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }
                .TSslider-wrapper {
                    display: flex;
                    transition: transform 0.3s ease;
                    gap: 10px;
                }
                .slide {
                    flex: 0 0 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .TSslider-wrapper {
                    cursor: grab;
                }
                .TSslider-wrapper:active {
                    cursor: grabbing;
                }
                .ts-slider-pagination {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                }
                .ts-slider-dot {
                    width: 10px;
                    height: 10px;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .ts-slider-dot.active {
                    background-color: rgba(0, 0, 0, 0.8);
                }
            `;
            document.head.appendChild(style);
        } catch (err) {
            console.error("Error injecting stylesheet:", err);
        }
    };

    injectStylesheet();

    window.initializeSlider = (selector, options = {}) => {
        try {
            const defaultOptions = {
                autoplay: true,
                pagination: {
                    el: null, // User-defined selector or DOM element for pagination
                    clickable: true, // Enable clickable pagination dots
                },
                navigation: {
                    nextEl: null, // User-defined selector or DOM element for the Next button
                    prevEl: null, // User-defined selector or DOM element for the Previous button
                },
                loop: true,
                interval: 3000,
                styles: {
                    activeDot: "active", // Class for active pagination dot
                },
            };

            const config = { ...defaultOptions, ...options };

            const sliderElement = document.querySelector(selector);
            if (!sliderElement) {
                throw new Error(`Slider element not found: ${selector}`);
            }

            const wrapper = sliderElement.querySelector(".TSslider-wrapper");
            const slides = [...sliderElement.querySelectorAll(".slide")];

            if (!wrapper || slides.length === 0) {
                throw new Error("Slider requires a .TSslider-wrapper and .slide elements.");
            }

            let currentIndex = 0;
            let autoplayInterval;
            let isDragging = false;
            let startX = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;

            let paginationDots = [];

            const goToSlide = index => {
                try {
                    currentIndex = (index + slides.length) % slides.length;
                    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
                    updatePagination();
                } catch (err) {
                    console.error("Error navigating to slide:", err);
                }
            };

            const nextSlide = () => goToSlide(currentIndex + 1);
            const prevSlide = () => goToSlide(currentIndex - 1);

            const startAutoplay = () => {
                try {
                    if (config.autoplay) {
                        clearInterval(autoplayInterval);
                        autoplayInterval = setInterval(nextSlide, config.interval);
                    }
                } catch (err) {
                    console.error("Error starting autoplay:", err);
                }
            };

            const stopAutoplay = () => {
                try {
                    clearInterval(autoplayInterval);
                } catch (err) {
                    console.error("Error stopping autoplay:", err);
                }
            };

            const addNavigation = () => {
                try {
                    let prevButton, nextButton;

                    if (config.navigation.prevEl) {
                        prevButton = typeof config.navigation.prevEl === "string"
                            ? document.querySelector(config.navigation.prevEl)
                            : config.navigation.prevEl;
                    } else {
                        prevButton = document.createElement("button");
                        prevButton.className = "ts-slider-button-prev";
                        prevButton.innerText = "Prev";
                        sliderElement.appendChild(prevButton);
                    }

                    if (config.navigation.nextEl) {
                        nextButton = typeof config.navigation.nextEl === "string"
                            ? document.querySelector(config.navigation.nextEl)
                            : config.navigation.nextEl;
                    } else {
                        nextButton = document.createElement("button");
                        nextButton.className = "ts-slider-button-next";
                        nextButton.innerText = "Next";
                        sliderElement.appendChild(nextButton);
                    }

                    prevButton.addEventListener("click", e => {
                        e.preventDefault();
                        prevSlide();
                        restartAutoplay();
                    });

                    nextButton.addEventListener("click", e => {
                        e.preventDefault();
                        nextSlide();
                        restartAutoplay();
                    });
                } catch (err) {
                    console.error("Error adding navigation buttons:", err);
                }
            };

            const addPagination = () => {
                try {
                    if (!config.pagination.el) return;

                    let paginationContainer;

                    if (typeof config.pagination.el === "string") {
                        paginationContainer = document.querySelector(config.pagination.el);
                    } else if (config.pagination.el instanceof HTMLElement) {
                        paginationContainer = config.pagination.el;
                    } else {
                        paginationContainer = document.createElement("div");
                        paginationContainer.className = "ts-slider-pagination";
                        sliderElement.appendChild(paginationContainer);
                    }

                    slides.forEach((_, i) => {
                        const dot = document.createElement("button");
                        dot.className = "ts-slider-dot";
                        dot.dataset.index = i;
                        if (i === 0) dot.classList.add(config.styles.activeDot);

                        paginationContainer.appendChild(dot);
                    });

                    paginationDots = [...paginationContainer.children];

                    if (config.pagination.clickable) {
                        sliderElement.addEventListener("click", e => {
                            if (e.target.matches(".ts-slider-dot")) {
                                const index = parseInt(e.target.dataset.index, 10);
                                goToSlide(index);
                                restartAutoplay();
                            }
                        });
                    }
                } catch (err) {
                    console.error("Error adding pagination:", err);
                }
            };

            const updatePagination = () => {
                try {
                    paginationDots.forEach((dot, i) =>
                        dot.classList.toggle(config.styles.activeDot, i === currentIndex)
                    );
                } catch (err) {
                    console.error("Error updating pagination:", err);
                }
            };

            const enableDragging = () => {
                const getPositionX = e =>
                    e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

                const dragStart = e => {
                    isDragging = true;
                    startX = getPositionX(e);
                    wrapper.style.transition = "none";
                    stopAutoplay();
                };

                const dragMove = e => {
                    if (!isDragging) return;
                    const currentX = getPositionX(e);
                    currentTranslate = prevTranslate + (currentX - startX);
                    wrapper.style.transform = `translateX(${currentTranslate}px)`;
                };

                const dragEnd = () => {
                    isDragging = false;
                    const movedBy = currentTranslate - prevTranslate;

                    if (movedBy < -50) nextSlide();
                    else if (movedBy > 50) prevSlide();
                    else wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

                    wrapper.style.transition = "transform 0.3s ease";
                    prevTranslate = currentIndex * -sliderElement.offsetWidth;
                    startAutoplay();
                };

                wrapper.addEventListener("mousedown", dragStart);
                wrapper.addEventListener("mousemove", dragMove);
                wrapper.addEventListener("mouseup", dragEnd);
                wrapper.addEventListener("mouseleave", dragEnd);
                wrapper.addEventListener("touchstart", dragStart, { passive: true });
                wrapper.addEventListener("touchmove", dragMove, { passive: false });
                wrapper.addEventListener("touchend", dragEnd);
            };

            const restartAutoplay = () => {
                stopAutoplay();
                setTimeout(startAutoplay, 2000); // Delay autoplay restart
            };

            wrapper.style.display = "flex";
            wrapper.style.transition = "transform 0.3s ease";

            slides.forEach(slide => {
                slide.style.flex = "0 0 100%";
            });

            addNavigation();
            addPagination();
            enableDragging();
            if (config.loop) startAutoplay();

            sliderElement.addEventListener("mouseenter", stopAutoplay);
            sliderElement.addEventListener("mouseleave", startAutoplay);

            sliders.push({
                sliderElement,
                next: nextSlide,
                prev: prevSlide,
                goTo: goToSlide,
                destroy: () => {
                    try {
                        clearInterval(autoplayInterval);
                        wrapper.removeEventListener("mousedown", dragStart);
                        wrapper.removeEventListener("mousemove", dragMove);
                        wrapper.removeEventListener("mouseup", dragEnd);
                        wrapper.removeEventListener("mouseleave", dragEnd);
                        sliderElement.innerHTML = ""; // Clear slider content
                    } catch (err) {
                        console.error("Error destroying slider:", err);
                    }
                },
            });
        } catch (err) {
            console.error("Error initializing slider:", err);
        }
    };
})(
    { data: {}, logs: [], tmp: {} },
    1
);
