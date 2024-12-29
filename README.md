Custom JavaScript Slider Library
A lightweight, customizable, and modern JavaScript slider library that supports autoplay, touch dragging, custom navigation, and pagination options. This library is designed to offer flexibility and an easy-to-use API similar to Swiper.js.

Features
Responsive Design: Works across all devices.
Touch Dragging: Allows dragging on touch and mouse devices.
Autoplay: Automatically cycles through slides with a configurable interval.
Custom Navigation: Use your own elements for Next and Prev buttons.
Custom Pagination: Fully customizable pagination dots.
Looping: Continuously loops through slides.
Easy Integration: Works with simple HTML and JavaScript.
Memory Safe: Includes a destroy method for cleanup.
Installation
Add the Script
Include the script in your HTML file:

html
Copy code
<script src="path/to/slider.js"></script>
Basic Usage
HTML Structure
Create the slider container:

html
Copy code
<div class="TSslider">
    <div class="TSslider-wrapper">
        <div class="slide">
            <img src="image1.jpg" alt="Slide 1">
        </div>
        <div class="slide">
            <img src="image2.jpg" alt="Slide 2">
        </div>
        <div class="slide">
            <img src="image3.jpg" alt="Slide 3">
        </div>
    </div>
</div>
Initialize the Slider
Initialize the slider with default or custom options:

javascript
Copy code
initializeSlider(".TSslider", {
    autoplay: true, // Enable autoplay
    loop: true, // Enable looping
    interval: 3000, // Autoplay interval in milliseconds
    pagination: {
        el: ".custom-pagination", // Selector for custom pagination
        clickable: true, // Enable clicking on pagination dots
    },
    navigation: {
        nextEl: ".custom-next", // Selector for custom Next button
        prevEl: ".custom-prev", // Selector for custom Prev button
    },
});
Configuration Options
Main Options
Option	Type	Default	Description
autoplay	boolean	true	Enables automatic sliding of slides.
loop	boolean	true	Allows the slider to loop back to the start after the last slide.
interval	number	3000	Interval time in milliseconds for autoplay.
pagination	object	null	Configuration for pagination (see below).
navigation	object	null	Configuration for navigation buttons (see below).
Pagination Options
Option	Type	Default	Description
el	string	null	A CSS selector or DOM element for the pagination container.
clickable	boolean	true	Enables clicking on pagination dots to navigate to specific slides.
Navigation Options
Option	Type	Default	Description
nextEl	string	null	A CSS selector or DOM element for the Next button.
prevEl	string	null	A CSS selector or DOM element for the Previous button.
Custom Navigation and Pagination
You can use your own navigation buttons and pagination dots:

HTML Example
html
Copy code
<div class="TSslider">
    <div class="TSslider-wrapper">
        <div class="slide"><img src="image1.jpg" alt="Slide 1"></div>
        <div class="slide"><img src="image2.jpg" alt="Slide 2"></div>
        <div class="slide"><img src="image3.jpg" alt="Slide 3"></div>
    </div>
</div>

<!-- Custom Navigation Buttons -->
<button class="custom-prev">Previous</button>
<button class="custom-next">Next</button>

<!-- Custom Pagination -->
<div class="custom-pagination"></div>
JavaScript Example
javascript
Copy code
initializeSlider(".TSslider", {
    navigation: {
        nextEl: ".custom-next", // Custom Next button
        prevEl: ".custom-prev", // Custom Prev button
    },
    pagination: {
        el: ".custom-pagination", // Custom pagination container
        clickable: true, // Enable clicking on dots
    },
});
Public API
Once the slider is initialized, you can access its public methods:

Method	Description
next()	Navigates to the next slide.
prev()	Navigates to the previous slide.
goTo(index)	Navigates to the slide at the specified index (0-based).
destroy()	Cleans up all event listeners and removes the slider from the DOM to prevent memory leaks.
Example
javascript
Copy code
const slider = initializeSlider(".TSslider");

// Programmatically navigate
slider.next();
slider.prev();
slider.goTo(2);

// Destroy the slider when needed
slider.destroy();
Lazy Loading
To enable lazy loading for images, use the data-src attribute instead of src. The library will load the image only when it becomes visible.

Example
html
Copy code
<div class="slide">
    <img data-src="image1.jpg" alt="Slide 1">
</div>
Error Handling
The library includes built-in error handling:

Logs errors to the console with descriptive messages.
Ensures safe fallbacks for missing elements or configurations.
Gracefully handles invalid configurations.
Browser Compatibility
The slider works on all modern browsers, including:

Google Chrome
Mozilla Firefox
Safari
Microsoft Edge
For legacy browser support (e.g., IE11), consider using a polyfill for modern JavaScript features.

License
This library is open-source and available under the MIT License.

Feel free to reach out if you need further assistance or customizations!






