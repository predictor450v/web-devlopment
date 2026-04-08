// ============================================================
//  JAVASCRIPT EVENTS — COMPLETE GUIDE (script.js)
//  
//  This file demonstrates every major concept of JavaScript 
//  events through interactive demos. Each section is heavily 
//  commented for learning purposes.
// ============================================================


// ============================================================
//  UTILITY: Helper Functions
// ============================================================

/**
 * Shortcut for document.getElementById
 * Since we use this a LOT throughout the file, a helper keeps things clean.
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * Appends a timestamped message to an output element.
 * 
 * @param {string} elementId - ID of the output element
 * @param {string} message   - Text to display
 * @param {boolean} append   - If true, append to existing text; else replace
 */
function logOutput(elementId, message, append = false) {
    const el = $(elementId);
    if (!el) return;

    // Get current time as a short timestamp (HH:MM:SS)
    const time = new Date().toLocaleTimeString();

    if (append) {
        // Prepend new entries so the latest appears at the top
        el.textContent = `[${time}] ${message}\n` + el.textContent;
    } else {
        el.textContent = `[${time}] ${message}`;
    }
}

/**
 * Adds a styled entry to an event log (mouse log, bubble log, etc.)
 * 
 * @param {string} containerId - ID of the log container element
 * @param {string} eventName   - Name of the event (e.g., "click")
 * @param {string} details     - Extra info to display
 */
function addLogEntry(containerId, eventName, details = '') {
    const container = $(containerId);
    if (!container) return;

    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `
        <span class="log-event-name">${eventName}</span> 
        ${details} 
        <span class="log-timestamp">${time}</span>
    `;

    // Insert at the top so newest entries are first
    container.insertBefore(entry, container.firstChild);

    // Keep the log manageable — remove old entries after 50
    while (container.children.length > 50) {
        container.removeChild(container.lastChild);
    }
}


// ============================================================
//  SECTION 2: THREE WAYS TO ADD EVENT LISTENERS
// ============================================================

// --- Method 1: Inline HTML ---
// The inline handler is directly in the HTML:
//    <button onclick="alert('Hello!')">Click Me</button>
// 
// Pros: Simple, quick for tiny demos
// Cons: Mixes HTML and JS, only one handler, hard to maintain,
//        runs in global scope, CSP security issues


// --- Method 2: DOM Property (on-event) ---
// You assign a function to an element's event property.
// Only ONE handler can be set per event type this way.

const domPropertyBtn = $('dom-property-btn');

// The first handler:
domPropertyBtn.onclick = function () {
    logOutput('dom-property-output', 'First handler says hello!');
};

// This REPLACES the first handler — only one can exist!
// Uncomment the next line to see the replacement in action:
// domPropertyBtn.onclick = function () {
//     logOutput('dom-property-output', 'Second handler replaced the first!');
// };

// NOTE: The reason only one handler can exist is because we're 
// setting a PROPERTY on the element object. Setting it again 
// overwrites the previous value, just like any JS variable.


// --- Method 3: addEventListener() — THE BEST WAY ---
// Syntax: element.addEventListener(eventType, handlerFunction, options)
// 
// Why it's the best:
//   1. Multiple handlers for the same event
//   2. Supports capture/bubble phase control
//   3. Supports { once: true } to auto-remove
//   4. Works with removeEventListener()
//   5. Cleaner separation of concerns

const addEventBtn = $('add-event-btn');

// Handler 1 — both will fire when clicked!
addEventBtn.addEventListener('click', function () {
    logOutput('add-event-output', 'Handler 1 fired!', true);
});

// Handler 2 — also fires on the same click
addEventBtn.addEventListener('click', function () {
    logOutput('add-event-output', 'Handler 2 fired!', true);
});

// NOTE: Both handlers run in the order they were attached.
// This is impossible with the .onclick property approach.


// --- removeEventListener() Demo ---
// IMPORTANT: You must pass the EXACT SAME function reference.
// Anonymous functions create new references each time, so they 
// CANNOT be removed. You must store the function in a variable.

const removeEventBtn = $('remove-event-btn');
const removeTriggerBtn = $('remove-trigger-btn');

// Store the handler in a variable so we can reference it later
function removableHandler() {
    logOutput('remove-event-output', 'Event fired! (Click "Remove Listener" to disable me)', true);
}

// Attach it
removeEventBtn.addEventListener('click', removableHandler);

// Remove it when the "Remove Listener" button is clicked
removeTriggerBtn.addEventListener('click', function () {
    // Pass the SAME function reference to remove it
    removeEventBtn.removeEventListener('click', removableHandler);
    logOutput('remove-event-output', 'Listener removed! Clicking the button no longer works.');

    // Visual feedback
    removeEventBtn.style.opacity = '0.5';
    removeEventBtn.style.pointerEvents = 'none';
});


// ============================================================
//  SECTION 3: MOUSE EVENTS
// ============================================================

// All the mouse events we'll demonstrate:
//   click        — full click (mousedown + mouseup on same element)
//   dblclick     — double click
//   mousedown    — mouse button pressed
//   mouseup      — mouse button released
//   mousemove    — mouse moves over an element
//   mouseenter   — mouse enters element (NO bubbling)
//   mouseleave   — mouse leaves element (NO bubbling)
//   mouseover    — mouse enters element (WITH bubbling)
//   mouseout     — mouse leaves element (WITH bubbling)
//   contextmenu  — right-click

const mousePlayground = $('mouse-playground');

// List of mouse events to listen for
const mouseEvents = [
    'click', 'dblclick', 'mousedown', 'mouseup',
    'mouseenter', 'mouseleave', 'contextmenu'
];

// Attach a listener for EACH mouse event type
mouseEvents.forEach(eventName => {
    mousePlayground.addEventListener(eventName, function (e) {
        // Log each event with its coordinates
        addLogEntry(
            'mouse-log-entries',
            eventName,
            `— button: ${e.button}, x: ${e.clientX}, y: ${e.clientY}`
        );

        // Brief visual flash on click-type events
        if (['click', 'dblclick', 'mousedown'].includes(eventName)) {
            mousePlayground.classList.add('active');
            setTimeout(() => mousePlayground.classList.remove('active'), 150);
        }

        // Prevent default context menu on right-click (for demo purposes)
        if (eventName === 'contextmenu') {
            e.preventDefault();
        }
    });
});

// Track mouse movement SEPARATELY (it fires very frequently!)
// We use a throttle to avoid flooding the log.
let lastMouseLogTime = 0;

mousePlayground.addEventListener('mousemove', function (e) {
    // Update the coordinate display on every move
    $('mouse-coords').textContent = `X: ${e.offsetX}, Y: ${e.offsetY}`;

    // Only log to the event log once per 500ms (throttle)
    const now = Date.now();
    if (now - lastMouseLogTime > 500) {
        addLogEntry('mouse-log-entries', 'mousemove', `— x: ${e.offsetX}, y: ${e.offsetY}`);
        lastMouseLogTime = now;
    }
});

// Clear button for mouse event log
$('clear-mouse-log').addEventListener('click', function () {
    $('mouse-log-entries').innerHTML = '';
});


// --- mouseenter vs mouseover Comparison ---
// KEY DIFFERENCE:
//   mouseenter — does NOT bubble. Only fires on the element itself.
//   mouseover  — DOES bubble. Fires on children too, which can cause
//                repeated triggers when moving between parent and child.

// mouseenter demo (left side)
let enterCount = 0;
$('mouseenter-outer').addEventListener('mouseenter', function () {
    enterCount++;
    logOutput('mouseenter-output', `mouseenter fired ${enterCount}x on OUTER`);
    this.classList.add('highlight');
});
$('mouseenter-outer').addEventListener('mouseleave', function () {
    this.classList.remove('highlight');
});

// mouseover demo (right side)
let overCount = 0;
$('mouseover-outer').addEventListener('mouseover', function (e) {
    overCount++;
    // e.target tells us WHICH element triggered the event
    const targetName = e.target.id.includes('inner') ? 'INNER' : 'OUTER';
    logOutput('mouseover-output', `mouseover fired ${overCount}x — target: ${targetName}`);
    this.classList.add('highlight');
});
$('mouseover-outer').addEventListener('mouseout', function () {
    this.classList.remove('highlight');
});

// NOTE: Move your mouse back and forth between outer and inner boxes.
// You'll notice mouseover fires MORE times because it bubbles!


// ============================================================
//  SECTION 4: KEYBOARD EVENTS
// ============================================================

// Keyboard Event Types:
//   keydown  — fires when a key is pressed (repeats if held)
//   keyup    — fires when a key is released
//   keypress — DEPRECATED! Don't use. Doesn't detect special keys.
//
// Important Event Object properties:
//   e.key     — readable name: "a", "Enter", "ArrowUp", "Shift"
//   e.code    — physical key: "KeyA", "Enter", "ArrowUp", "ShiftLeft"
//   e.which   — numeric code (deprecated, but still common)
//   e.repeat  — true if the key is being held down
//
// Modifier key booleans:
//   e.shiftKey, e.ctrlKey, e.altKey, e.metaKey

const keyboardInput = $('keyboard-input');

// --- keydown: fires every time a key is pressed (and repeats) ---
keyboardInput.addEventListener('keydown', function (e) {
    // Update the visual key display
    const keyVisual = $('key-visual');
    keyVisual.textContent = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    keyVisual.classList.add('pressed');

    // Update the key detail properties
    $('key-value').textContent = e.key;
    $('code-value').textContent = e.code;
    $('which-value').textContent = e.which || e.keyCode;
    $('event-type-value').textContent = `keydown${e.repeat ? ' (repeat)' : ''}`;

    // Update modifier key indicators
    // Each modifier is a boolean on the event object
    $('mod-shift').classList.toggle('active', e.shiftKey);
    $('mod-ctrl').classList.toggle('active', e.ctrlKey);
    $('mod-alt').classList.toggle('active', e.altKey);
    $('mod-meta').classList.toggle('active', e.metaKey);
});

// --- keyup: fires once when a key is released ---
keyboardInput.addEventListener('keyup', function (e) {
    const keyVisual = $('key-visual');
    keyVisual.classList.remove('pressed');
    $('event-type-value').textContent = 'keyup';

    // Clear modifier indicators on release
    $('mod-shift').classList.toggle('active', e.shiftKey);
    $('mod-ctrl').classList.toggle('active', e.ctrlKey);
    $('mod-alt').classList.toggle('active', e.altKey);
    $('mod-meta').classList.toggle('active', e.metaKey);
});


// --- Detecting Key Combinations ---
// A common pattern: check for modifier keys + a specific key.
// ALWAYS use e.preventDefault() if you're overriding a browser shortcut!

document.addEventListener('keydown', function (e) {
    // Ctrl + S — override the browser's save dialog
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();  // Without this, the browser's Save dialog opens!
        logOutput('combo-output', 'Ctrl+S detected! (Default save prevented)', true);
    }

    // Escape key — commonly used to close modals/popups
    if (e.key === 'Escape') {
        logOutput('combo-output', 'Escape pressed!', true);
    }
});


// ============================================================
//  SECTION 5: FORM EVENTS
// ============================================================

// --- input event: fires on EVERY value change (each keystroke) ---
// Great for: live search, character counters, real-time validation
$('input-demo').addEventListener('input', function (e) {
    // e.target.value gives us the current value of the input
    logOutput('input-event-output', `Value: "${e.target.value}" (length: ${e.target.value.length})`);
});

// --- change event: fires when the value changes AND the element loses focus ---
// Great for: form validation on blur, dropdown selections
$('input-demo').addEventListener('change', function (e) {
    logOutput('change-event-output', `Changed to: "${e.target.value}"`);
});

// NOTE: Try typing in the input — 'input' fires immediately.
// Then click away — 'change' fires only then, IF the value has changed.


// --- focus event: fires when an element receives focus ---
// --- blur event: fires when an element loses focus ---
// These do NOT bubble! Use 'focusin' and 'focusout' if you need bubbling.

const focusDemo = $('focus-demo');

focusDemo.addEventListener('focus', function () {
    // 'this' refers to the element the listener is attached to
    this.classList.add('focused');
    logOutput('focus-output', 'Input is FOCUSED (focus event fired)');
});

focusDemo.addEventListener('blur', function () {
    this.classList.remove('focused');
    logOutput('focus-output', 'Input lost focus (blur event fired)');
});


// --- Form submit event ---
// CRITICAL: Always call e.preventDefault() to stop the page from reloading!
// By default, submitting a form navigates the browser to the form's action URL.

$('demo-form').addEventListener('submit', function (e) {
    // Prevent the default form submission (page reload)
    e.preventDefault();

    // Access form data using the FormData API
    // FormData reads all named inputs inside the form
    const formData = new FormData(e.target);
    const username = formData.get('username');

    logOutput('form-output', `Form submitted! Username: "${username}"`);

    // Alternative: access inputs directly
    // const username = e.target.elements.username.value;

    // Reset the form after submission (optional)
    e.target.reset();
});


// --- select event: fires when the user selects text ---
$('select-demo').addEventListener('select', function (e) {
    // Get the selected text using selectionStart and selectionEnd
    const input = e.target;
    const selectedText = input.value.substring(input.selectionStart, input.selectionEnd);
    logOutput('select-output', `Selected: "${selectedText}"`);
});

// --- Clipboard events: copy, cut, paste ---
// These fire when the user copies/cuts/pastes text.
// You can read/modify clipboard data via e.clipboardData

$('select-demo').addEventListener('copy', function (e) {
    logOutput('select-output', 'Text copied!', true);
});

$('select-demo').addEventListener('paste', function (e) {
    // Access pasted data:
    // const pastedText = e.clipboardData.getData('text');
    logOutput('select-output', 'Text pasted!', true);
});


// ============================================================
//  SECTION 6: THE EVENT OBJECT
// ============================================================

// Every event handler receives an Event object as its first parameter.
// This object contains ALL the information about the event.
//
// You can name it anything, but common conventions are:
//   e, event, evt
//
// The Event object is automatically created by the browser and passed 
// to your handler function. You don't need to create it yourself.


// --- e.target vs e.currentTarget ---
// 
// e.target        = The ACTUAL element that was clicked/triggered
// e.currentTarget = The element the listener is ATTACHED to
//
// These are the SAME when you click the element itself.
// They DIFFER when event bubbling is involved:
//   - Click a child → e.target = child, e.currentTarget = parent (if listener is on parent)

$('target-demo-parent').addEventListener('click', function (e) {
    // e.target: the element the user actually clicked
    // e.currentTarget: the element this listener is on (the parent div)
    // this: same as e.currentTarget in regular functions (NOT arrow functions!)
    
    const targetTag = e.target.tagName;
    const currentTag = e.currentTarget.tagName;

    logOutput('target-output',
        `e.target: <${targetTag}> (id: ${e.target.id}) | e.currentTarget: <${currentTag}> (id: ${e.currentTarget.id})`
    );
});

// NOTE: Click the "Child Button" — e.target will be BUTTON, 
// but e.currentTarget will be the parent DIV.
// Click the "Parent" text — both will be the DIV.


// --- preventDefault() ---
// Stops the browser's DEFAULT behavior for an event.
// Examples:
//   - <a> click: prevents navigation
//   - <form> submit: prevents page reload
//   - contextmenu: prevents right-click menu
//   - keydown: prevents character input
//
// IMPORTANT: preventDefault() does NOT stop event propagation (bubbling).
// For that, use e.stopPropagation().

$('prevent-link').addEventListener('click', function (e) {
    e.preventDefault();  // Link won't navigate to Google!
    logOutput('prevent-output', 'Link click prevented! Would have gone to: ' + this.href);
});


// ============================================================
//  SECTION 7: EVENT BUBBLING & CAPTURING
// ============================================================

// When an event occurs, it goes through THREE phases:
//
// Phase 1: CAPTURING (top-down)
//   window → document → html → body → ... → target's parent
//   Listeners with { capture: true } fire during this phase
//
// Phase 2: TARGET
//   The event reaches the actual target element
//   Both capture and bubble listeners fire here
//
// Phase 3: BUBBLING (bottom-up)  ← DEFAULT
//   target's parent → ... → body → html → document → window
//   Listeners WITHOUT { capture: true } fire during this phase
//
// By default, addEventListener uses the BUBBLING phase.
// Most events bubble, but some don't (e.g., focus, blur, mouseenter, mouseleave).

const grandparent = $('bubble-grandparent');
const parent = $('bubble-parent');
const child = $('bubble-child');
const stopPropToggle = $('stop-propagation-toggle');

// Attach click listeners to all three nested elements
grandparent.addEventListener('click', function (e) {
    addLogEntry('bubble-log-entries', 'Grandparent clicked', '(bubble phase)');
    this.classList.add('flash');
    setTimeout(() => this.classList.remove('flash'), 300);
});

parent.addEventListener('click', function (e) {
    addLogEntry('bubble-log-entries', 'Parent clicked', '(bubble phase)');
    this.classList.add('flash');
    setTimeout(() => this.classList.remove('flash'), 300);
});

child.addEventListener('click', function (e) {
    // Check if user has enabled stopPropagation
    if (stopPropToggle.checked) {
        // stopPropagation() prevents the event from bubbling UP
        // So parent and grandparent handlers WON'T fire
        e.stopPropagation();
        addLogEntry('bubble-log-entries', 'Child clicked', '— stopPropagation() called!');
    } else {
        addLogEntry('bubble-log-entries', 'Child clicked', '(bubble phase — will propagate up!)');
    }
    this.classList.add('flash');
    setTimeout(() => this.classList.remove('flash'), 300);
});

// NOTE: When you click the child:
//   Without stopPropagation: Child → Parent → Grandparent (all fire)
//   With stopPropagation:    Child only (parent/grandparent don't fire)

// Clear button for bubble log
$('clear-bubble-log').addEventListener('click', function (e) {
    // We need stopPropagation here too, otherwise the grandparent 
    // handler fires (because the clear button is inside it!)
    e.stopPropagation();
    $('bubble-log-entries').innerHTML = '';
});


// --- Capturing Phase Demo ---
// To listen during the CAPTURING phase (top-down instead of bottom-up),
// pass { capture: true } as the third argument to addEventListener.

const captureOuter = $('capture-outer');
const captureInner = $('capture-inner');

// This listener fires during CAPTURE phase (before the target)
captureOuter.addEventListener('click', function () {
    logOutput('capture-output', 'Outer (capture phase — fires FIRST!)', true);
}, { capture: true });  // ← This makes it a capture listener!
// Shorthand: addEventListener('click', handler, true)

// This listener fires during BUBBLE phase (after the target)
captureOuter.addEventListener('click', function () {
    logOutput('capture-output', 'Outer (bubble phase — fires LAST!)', true);
});
// By default, capture is false, so this is a bubble listener

// Target element (fires during target phase)
captureInner.addEventListener('click', function (e) {
    e.stopPropagation(); // Stop further propagation after bubble on outer
    logOutput('capture-output', 'Inner button (target phase)', true);
});

// Click order: Capture Outer → Inner (target) → Bubble Outer


// ============================================================
//  SECTION 8: EVENT DELEGATION
// ============================================================

// EVENT DELEGATION is a pattern where you attach ONE event listener 
// to a PARENT element instead of individual listeners on each child.
//
// HOW IT WORKS:
//   1. Events bubble up from children to parents
//   2. The parent listener checks e.target to see which child was clicked
//   3. It responds accordingly
//
// WHY USE IT:
//   1. Performance: 1 listener instead of 100+ listeners
//   2. Dynamic elements: Works for elements added AFTER the listener is set up
//   3. Memory: Fewer listeners = less memory usage
//   4. Cleaner code: Centralized event handling

const delegationList = $('delegation-list');
let itemCount = 3; // Track how many items exist

// ONE listener on the parent <ul> handles ALL <li> clicks!
delegationList.addEventListener('click', function (e) {
    // Check if the clicked element is actually a list item
    // e.target gives us the element that was ACTUALLY clicked
    if (e.target.classList.contains('delegation-item')) {
        // Remove 'selected' from all items
        document.querySelectorAll('.delegation-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add 'selected' to the clicked item
        e.target.classList.add('selected');

        logOutput('delegation-output', `Selected: "${e.target.textContent}"`);
    }

    // Alternative approach using closest():
    // const item = e.target.closest('.delegation-item');
    // if (item) { /* handle click */ }
    //
    // closest() walks up the DOM tree to find the nearest ancestor
    // matching the selector. Useful when items have nested content.
});

// "Add New Item" button — demonstrates that delegation works 
// for dynamically added elements without any extra listeners
$('add-item-btn').addEventListener('click', function () {
    itemCount++;

    const newItem = document.createElement('li');
    newItem.className = 'delegation-item new-item';
    newItem.textContent = `Item ${itemCount} — Dynamically added! (still works!)`;

    delegationList.appendChild(newItem);

    logOutput('delegation-output', `Added Item ${itemCount} — click it! No new listener needed.`);
});

// NOTE: We never add listeners to individual <li> elements.
// Even newly created items respond to clicks because of bubbling!


// ============================================================
//  SECTION 9: WINDOW & DOCUMENT EVENTS
// ============================================================

// --- DOMContentLoaded ---
// Fires when the HTML has been fully parsed and the DOM tree is built.
// DOES NOT wait for images, stylesheets, or other resources.
// This is the EARLIEST safe moment to query DOM elements.

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded — DOM is ready! (fires before images load)');
    
    // This is where most initialization code should go.
    // Since our <script> is at the bottom of <body>, the DOM
    // is already parsed by the time this script runs, but using
    // DOMContentLoaded is still a good habit for safety.
});

// --- window.load ---
// Fires AFTER everything has loaded: DOM, images, stylesheets, 
// iframes, fonts, etc. Slower than DOMContentLoaded.

window.addEventListener('load', function () {
    console.log('window.load — Everything fully loaded! (including images)');
});


// --- resize event ---
// Fires when the browser window is resized.
// IMPORTANT: This fires VERY frequently during resize.
// Always debounce or throttle this handler in production!

function updateWindowStats() {
    // window.innerWidth / innerHeight = viewport size (excluding scrollbars)
    $('window-size').textContent = `${window.innerWidth} × ${window.innerHeight}px`;

    // window.scrollX / scrollY = how far the page has been scrolled
    $('scroll-position').textContent = `X: ${Math.round(window.scrollX)}, Y: ${Math.round(window.scrollY)}px`;

    // screen.width / height = the physical screen resolution
    $('screen-size').textContent = `${screen.width} × ${screen.height}px`;

    // navigator.onLine = whether the browser has internet connection
    $('online-status').textContent = navigator.onLine ? 'Online' : 'Offline';
}

// Initial update
updateWindowStats();

// Update on resize (using a simple throttle)
let resizeTimeout;
window.addEventListener('resize', function () {
    // Debounce: wait 100ms after the last resize event before updating
    // This prevents the handler from running hundreds of times per second
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateWindowStats, 100);
});

// --- scroll event ---
// Fires when the page (or an element) is scrolled.
// Like resize, this fires VERY frequently — always throttle!

let scrollTimeout;
window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateWindowStats, 50);
});


// --- online / offline events ---
// Fire when the browser's network connection changes.
// Useful for showing "You are offline" banners.

window.addEventListener('online', function () {
    $('online-status').textContent = 'Online';
    console.log('Back online!');
});

window.addEventListener('offline', function () {
    $('online-status').textContent = 'Offline';
    console.log('Gone offline!');
});


// --- Scroll-to-top button visibility ---
// Show/hide the "scroll to top" button based on scroll position

const scrollTopBtn = $('scroll-top-btn');

window.addEventListener('scroll', function () {
    // Show button when scrolled past 500px
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', function () {
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'  // 'smooth' enables smooth scrolling animation
    });
});


// --- Navigation scroll behavior ---
// Shrink nav on scroll and highlight active section

const nav = $('main-nav');

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Active nav link highlighting based on scroll position
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

// IntersectionObserver watches elements enter/leave the viewport.
// Much more efficient than checking scroll position in a scroll handler!
const observerOptions = {
    // rootMargin offsets the detection area (negative = inward)
    rootMargin: '-20% 0px -70% 0px'
};

const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove 'active' from all nav links
            navLinks.forEach(link => link.classList.remove('active'));

            // Find the nav link matching this section and activate it
            const activeLink = document.querySelector(
                `.nav-links a[href="#${entry.target.id}"]`
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => sectionObserver.observe(section));


// ============================================================
//  SECTION 10: CUSTOM EVENTS
// ============================================================

// JavaScript allows you to create and dispatch your OWN custom events.
// This is powerful for building component-based architectures where 
// components communicate via events instead of direct function calls.
//
// Two ways to create custom events:
//
// 1. new Event('eventName')
//    - Simple custom event without extra data
//
// 2. new CustomEvent('eventName', { detail: {...} })
//    - Custom event WITH arbitrary data payload (in the 'detail' property)
//    - Also supports: bubbles (boolean), cancelable (boolean), composed (boolean)

// --- Pizza Order Demo ---
const orderBtn = $('order-pizza-btn');
const pizzaSelect = $('pizza-type');

// Step 1: Listen for our custom event on the document
// (You could listen on any element — document is convenient for global events)
document.addEventListener('pizza-ordered', function (e) {
    // Access custom data via e.detail
    const { type, orderId, timestamp } = e.detail;

    logOutput('pizza-output',
        `Order received!\n   Type: ${type}\n   Order ID: #${orderId}\n   Time: ${timestamp}`,
        true
    );
});

// Step 2: Dispatch the custom event when the button is clicked
orderBtn.addEventListener('click', function () {
    const selectedPizza = pizzaSelect.value;

    // Create a CustomEvent with data in the 'detail' property
    const pizzaEvent = new CustomEvent('pizza-ordered', {
        detail: {
            type: selectedPizza,
            orderId: Math.floor(Math.random() * 10000),
            timestamp: new Date().toLocaleTimeString()
        },
        bubbles: true,     // Allow the event to bubble up
        cancelable: true   // Allow the event to be cancelled with preventDefault()
    });

    // Dispatch it on the document (triggers any listeners for 'pizza-ordered')
    document.dispatchEvent(pizzaEvent);
});

// WHY CUSTOM EVENTS?
// 1. Loose coupling: components don't need to know about each other
// 2. Clean architecture: emit events and let any number of listeners respond
// 3. Real-world use cases:
//    - "user-authenticated" → update nav, load data, track analytics
//    - "cart-updated" → update cart icon, recalculate total, save to localStorage
//    - "theme-changed" → update colors across all components


// --- { once: true } Option Demo ---
// When you pass { once: true }, the listener automatically removes itself 
// after firing once. No need to call removeEventListener()!

const onceBtn = $('once-btn');

onceBtn.addEventListener('click', function () {
    logOutput('once-output', 'This only fires ONCE! Try clicking again — nothing will happen.');

    // Visual feedback
    onceBtn.textContent = 'Already clicked! (listener removed)';
    onceBtn.style.opacity = '0.5';
}, { once: true });
// The { once: true } option automatically removes this listener after the first click

// EQUIVALENT manual approach:
// function handler() {
//     console.log('Fired!');
//     onceBtn.removeEventListener('click', handler); // manually remove
// }
// onceBtn.addEventListener('click', handler);


// ============================================================
//  EXTRA: ADVANCED CONCEPTS (logged to console)
// ============================================================

// --- Event.composedPath() ---
// Returns an array of all elements the event will travel through.
// Useful for debugging propagation paths.
//
// document.addEventListener('click', (e) => {
//     console.log('Event path:', e.composedPath());
//     // → [button, div, section, main, body, html, document, Window]
// });

// --- Passive Event Listeners ---
// { passive: true } tells the browser the handler WON'T call 
// preventDefault(). This allows performance optimizations,
// especially for scroll and touch events.
//
// document.addEventListener('touchstart', handler, { passive: true });
// document.addEventListener('wheel', handler, { passive: true });
//
// Modern browsers set passive: true by default for touchstart, 
// touchmove, and wheel events on document-level listeners.

// --- AbortController for Event Listeners ---
// Modern way to remove event listeners using an AbortController:
//
// const controller = new AbortController();
// 
// btn.addEventListener('click', handler, { signal: controller.signal });
// btn.addEventListener('mouseover', handler2, { signal: controller.signal });
//
// // Remove ALL listeners at once:
// controller.abort();
//
// This is especially useful when a component is destroyed — you can
// remove all its listeners with a single abort() call.


// ============================================================
//  INITIALIZATION: Page Load Complete
// ============================================================

console.log(`
╔══════════════════════════════════════════════════╗
║    JavaScript Events — Complete Guide            ║
║                                                  ║
║    Open this console to see additional output    ║
║    from the interactive demos above!             ║
╠══════════════════════════════════════════════════╣
║    Sections:                                     ║
║    01. What Are Events?                          ║
║    02. Three Ways to Add Event Listeners         ║
║    03. Mouse Events                              ║
║    04. Keyboard Events                           ║
║    05. Form Events                               ║
║    06. The Event Object                          ║
║    07. Event Bubbling & Capturing                ║
║    08. Event Delegation                          ║
║    09. Window & Document Events                  ║
║    10. Custom Events                             ║
║    11. Cheat Sheet                               ║
╚══════════════════════════════════════════════════╝
`);
