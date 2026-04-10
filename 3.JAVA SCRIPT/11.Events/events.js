// ============================================================
// JAVASCRIPT EVENTS — Complete Documentation & Study Guide
// ============================================================
// An EVENT is a signal that something happened in the browser.
// The user clicked, typed, scrolled, resized — the browser fired an event.
// JS lets you LISTEN for these signals and respond with code.
//
// 3 ERAS of event handling in JS (important for interviews):
//
//   Era 1 — Inline HTML (avoid completely)
//   <button onclick="doSomething()">Click</button>
//   Problem: mixes HTML and JS, can't add multiple handlers
//
//   Era 2 — DOM property (old way)
//   element.onclick = function() { }
//   Problem: can only assign ONE handler per event type
//   Assigning again OVERWRITES the previous one
//
//   Era 3 — addEventListener (modern standard ✓)
//   element.addEventListener("click", function() { })
//   Can attach MULTIPLE handlers to the same event
//   Can remove specific handlers individually
//   Supports capturing/bubbling control


// ============================================================
// SECTION 1: addEventListener — FULL SYNTAX
// ============================================================
// element.addEventListener(type, callback, options)
//
//   type     — event name as string: "click", "keydown", "submit"
//   callback — function to run when event fires (receives event object)
//   options  — boolean OR object (optional, default = false)
//              false = listen in BUBBLING phase (default, most common)
//              true  = listen in CAPTURING phase (rare)
//              OR an object: { once: true, capture: false, passive: true }

const btn = document.querySelector("#myBtn");

// Basic usage
btn.addEventListener("click", function(e) {
    console.log("clicked!");
});

// Arrow function version (same thing)
btn.addEventListener("click", (e) => {
    console.log("also clicked!");
});

// MULTIPLE listeners on the same element — both run
btn.addEventListener("click", () => console.log("handler 1"));
btn.addEventListener("click", () => console.log("handler 2"));
// Output: "handler 1" then "handler 2" — both fire

// Compare with old way — second OVERWRITES first
btn.onclick = () => console.log("first");
btn.onclick = () => console.log("second"); // first is gone forever

// options object
btn.addEventListener("click", handler, {
    once:    true,  // auto-removes itself after firing once (great for one-time dialogs)
    passive: true,  // tells browser "I won't call preventDefault" → smoother scroll
    capture: false  // bubbling phase (default)
});


// ============================================================
// SECTION 2: THE EVENT OBJECT — every property explained
// ============================================================
// When an event fires, JS automatically creates an EVENT OBJECT
// and passes it to your callback. It contains everything about
// what just happened. You can name it e, event, evt — anything.

document.addEventListener("click", function(e) {

    // ── WHAT happened ──────────────────────────────────
    console.log(e.type);             // "click" — what kind of event
    console.log(e.timeStamp);        // 1823.4 — ms since page loaded
    console.log(e.defaultPrevented); // false — was preventDefault called?
    console.log(e.isTrusted);        // true = real user action, false = JS triggered

    // ── WHERE it happened (targets) ────────────────────
    console.log(e.target);           // EXACT element clicked (could be child)
    console.log(e.currentTarget);    // element the listener is ATTACHED TO
    console.log(e.srcElement);       // old IE alias for e.target (avoid)

    // ── MOUSE position ──────────────────────────────────
    console.log(e.clientX, e.clientY); // position relative to VIEWPORT (changes on scroll)
    console.log(e.pageX,   e.pageY);   // position relative to full PAGE (doesn't change on scroll)
    console.log(e.screenX, e.screenY); // position relative to MONITOR screen
    console.log(e.offsetX, e.offsetY); // position relative to the TARGET element itself

    // ── MODIFIER KEYS (were these held during click?) ───
    console.log(e.altKey);   // true/false — Alt held?
    console.log(e.ctrlKey);  // true/false — Ctrl held?
    console.log(e.shiftKey); // true/false — Shift held?
    console.log(e.metaKey);  // true/false — Cmd (Mac) / Win key held?

    // ── MOUSE BUTTON ────────────────────────────────────
    console.log(e.button);
    // 0 = left click
    // 1 = middle click (scroll wheel)
    // 2 = right click
    // 3 = browser back button
    // 4 = browser forward button
});

// ── KEYBOARD specific properties ──────────────────────────
document.addEventListener("keydown", function(e) {
    console.log(e.key);      // "Enter", "a", "A", "ArrowUp", " " — actual key value
    console.log(e.code);     // "Enter", "KeyA", "ArrowUp", "Space" — physical key location
    console.log(e.keyCode);  // 13, 65, 38, 32 — DEPRECATED, use e.key instead
    console.log(e.repeat);   // true if key is being held down continuously

    // e.key vs e.code difference:
    // You press "a" key:
    //   e.key  = "a" (lowercase, no shift) or "A" (with shift) — WHAT was typed
    //   e.code = "KeyA" always — physical key LOCATION on keyboard
    // Use e.key for text input, use e.code for game controls (WASD etc.)
});


// ============================================================
// SECTION 3: e.target vs e.currentTarget — the most important distinction
// ============================================================
// This is asked in almost every JS interview.
//
// Scenario: a <ul> has a listener. User clicks an <img> inside a <li>.
//
//   e.target        = <img>  — the ACTUAL element that was clicked
//   e.currentTarget = <ul>   — the element the addEventListener is on
//
// They are the SAME only when you click the exact element that has the listener.
// They DIFFER when you click a child of the element with the listener.

const ul = document.getElementById("images");

ul.addEventListener("click", function(e) {
    console.log("e.target:",        e.target);        // <img id="owl">
    console.log("e.currentTarget:", e.currentTarget); // <ul id="images">
    console.log("Same?", e.target === e.currentTarget); // false (unless ul itself clicked)
});

// Real world use:
ul.addEventListener("click", function(e) {
    if (e.target.tagName === "IMG") {
        // user clicked an image — handle it
        console.log("Image ID:", e.target.id);

        // e.target           = the <img>
        // e.target.parentNode = the <li> wrapping it
        // Remove the whole <li>, not just the <img>
        e.target.parentNode.remove();

        // Why parentNode and not parentElement here?
        // Both work for element parents.
        // parentNode  — works for ANY node type (elements, text, document)
        // parentElement — only returns ELEMENT parents (returns null at document root)
        // For normal HTML elements: they are identical. Use either.
    }
});


// ============================================================
// SECTION 4: EVENT BUBBLING & CAPTURING — full explanation
// ============================================================
// When an event fires, it travels in 3 PHASES:
//
//   Phase 1 — CAPTURING (top down):
//   document → html → body → div → ul → li → img
//
//   Phase 2 — TARGET:
//   The event reaches the actual element that was interacted with
//
//   Phase 3 — BUBBLING (bottom up):
//   img → li → ul → div → body → html → document
//
// By default, addEventListener listens in the BUBBLING phase.
// Set 3rd argument to true to listen in CAPTURING phase.
//
// Visual for clicking an <img> inside <ul> inside <div>:
//
//  CAPTURING →          BUBBLING ←
//  document                document
//    body                    body
//      div                     div
//        ul    ←target→       ul
//          li                   li
//            img              img

// Bubbling demo
document.getElementById("images").addEventListener("click", function(e) {
    console.log("UL heard the click (bubbling)"); // fires AFTER img listener
}, false); // false = bubbling phase

document.getElementById("owl").addEventListener("click", function(e) {
    console.log("IMG heard the click");
    // e.stopPropagation() here would prevent UL from hearing it
}, false);

// Capturing demo (true = capturing)
document.getElementById("images").addEventListener("click", function(e) {
    console.log("UL heard click in CAPTURING phase"); // fires BEFORE img listener
}, true);


// ============================================================
// SECTION 5: e.stopPropagation() — stop bubbling
// ============================================================
// Prevents the event from traveling further up (or down in capturing).
// The element that calls stopPropagation still handles the event —
// it just doesn't pass it up to ancestors.

document.getElementById("owl").addEventListener("click", function(e) {
    console.log("owl clicked");
    e.stopPropagation(); // UL listener will NOT fire after this
});

document.getElementById("images").addEventListener("click", function(e) {
    console.log("ul clicked"); // this will NOT run if owl was clicked
});

// e.stopImmediatePropagation() — even stronger version
// Stops bubbling AND prevents other listeners on the SAME element from firing
btn.addEventListener("click", function(e) {
    console.log("handler 1 — calls stopImmediatePropagation");
    e.stopImmediatePropagation();
});
btn.addEventListener("click", function(e) {
    console.log("handler 2 — will NOT run");
});


// ============================================================
// SECTION 6: e.preventDefault() — stop default browser behavior
// ============================================================
// Every HTML element has DEFAULT behavior the browser performs automatically:
//   <a href>     → navigates to the URL
//   <form>       → reloads the page on submit
//   <input type="checkbox"> → toggles checked state
//   right-click  → shows context menu
//   space bar    → scrolls the page
//
// e.preventDefault() CANCELS that default behavior.
// It does NOT stop bubbling (that's stopPropagation's job).

// Prevent link navigation
document.getElementById("google").addEventListener("click", function(e) {
    e.preventDefault();    // stops navigation to google.com
    e.stopPropagation();   // stops bubbling to parent ul listener
    console.log("Google link clicked but navigation blocked");
});

// Prevent form submission (most common use)
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault(); // stops page reload
    const input = document.querySelector("input[name='username']");
    if (!input.value.trim()) {
        console.log("Username required!");
        return;
    }
    console.log("Valid — handle submission with JS/fetch instead");
});

// Prevent right-click context menu
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    console.log("Right click at:", e.clientX, e.clientY);
    // show your own custom context menu here
});

// ── KEY DIFFERENCE: stopPropagation vs preventDefault ──────
// e.preventDefault()    → stops what the BROWSER does (navigation, reload)
// e.stopPropagation()   → stops the event from reaching PARENT listeners
// They are completely independent — you can call both, either, or neither.


// ============================================================
// SECTION 7: EVENT DELEGATION — the most powerful pattern
// ============================================================
// Problem: you have 100 list items. Attaching a listener to each = 100 listeners.
// Worse: items added dynamically later get NO listener at all.
//
// Solution: attach ONE listener to the PARENT.
// Child clicks bubble up. Check e.target to know which child was clicked.
//
// Benefits:
//   - Memory efficient (1 listener vs 100)
//   - Automatically works for dynamically added children
//   - Cleaner code

// WITHOUT delegation (bad for large/dynamic lists)
document.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", function() {
        this.remove(); // works but 100 listeners, new items get none
    });
});

// WITH delegation (correct way)
document.getElementById("images").addEventListener("click", function(e) {
    // Guard: only act on IMG clicks, ignore clicks on the UL itself
    if (e.target.tagName !== "IMG") return;

    console.log("Clicked image id:", e.target.id);
    console.log("Clicked image src:", e.target.src);

    const li = e.target.parentNode; // go up to the <li>
    li.remove();                     // remove the whole list item
});

// More advanced delegation — handle multiple child types
document.getElementById("todo-list").addEventListener("click", function(e) {
    // Clicked the delete button
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("li").remove();
        return;
    }
    // Clicked the checkbox
    if (e.target.classList.contains("checkbox")) {
        e.target.closest("li").classList.toggle("done");
        return;
    }
    // Clicked the text span
    if (e.target.classList.contains("todo-text")) {
        console.log("Task:", e.target.textContent);
    }
});


// ============================================================
// SECTION 8: setTimeout — FULL EXPLANATION
// ============================================================
// Schedules a function to run ONCE after a delay.
// JS doesn't pause — it schedules and moves on immediately.
//
// Returns a TIMER ID (a number). Store it to cancel later.
//
// Syntax:
//   const id = setTimeout(callback, delayMs, arg1, arg2, ...)
//   clearTimeout(id)  — cancel before it fires

// Basic usage
const timerId = setTimeout(function() {
    console.log("Fired after 2 seconds");
}, 2000);

// With arguments — pass extra args after the delay
const sayHitesh = function(greeting, name) {
    console.log(greeting, name); // "Hello Hitesh"
};
setTimeout(sayHitesh, 1000, "Hello", "Hitesh");

// Cancel before it fires
const changeText = function() {
    document.querySelector("h1").innerHTML = "best JS series";
};
const changeMe = setTimeout(changeText, 2000);

document.querySelector("#stop").addEventListener("click", function() {
    clearTimeout(changeMe); // cancels the scheduled changeText call
    console.log("STOPPED — heading will not change");
});

// ── setTimeout with delay = 0 (tricky interview question!) ──
console.log("1 — synchronous");
setTimeout(() => console.log("2 — setTimeout 0ms"), 0);
console.log("3 — synchronous");
// Output: 1, 3, 2
// WHY? setTimeout always goes to the "task queue" first.
// JS finishes ALL synchronous code before processing the queue.
// So even delay=0 runs AFTER all current synchronous code completes.

// ── Recursive setTimeout (better than setInterval for heavy tasks) ──
// setInterval fires every N ms regardless of how long the task takes.
// If task takes longer than interval → callbacks pile up → memory issue.
// Recursive setTimeout waits for each run to FINISH first.
function pollServer() {
    fetch("/api/updates")
        .then(res => res.json())
        .then(data => {
            console.log("Got data:", data);
            setTimeout(pollServer, 1000); // schedule NEXT run after this one finishes
        });
}
setTimeout(pollServer, 1000); // start after 1 second


// ============================================================
// SECTION 9: setInterval — FULL EXPLANATION
// ============================================================
// Calls a function REPEATEDLY at a fixed interval forever,
// until you call clearInterval(id).
//
// Syntax:
//   const id = setInterval(callback, delayMs, arg1, arg2, ...)
//   clearInterval(id)

// Basic usage
const sayDate = function(str) {
    console.log(str, Date.now()); // "hi" + current timestamp
};
const intervalId = setInterval(sayDate, 1000, "hi");
// fires every 1000ms: "hi 1718023400000", "hi 1718023401000" ...

// To stop it
clearInterval(intervalId); // stops all future calls

// ── THE BUG IN ORIGINAL CODE ─────────────────────────────
// const intervalId = setInterval(sayDate, 1000, "hi")
// clearInterval(intervalId)  ← called IMMEDIATELY on the next line!
// The interval is cancelled before it ever fires even once.
// clearInterval should be called from a button click or some condition.

// CORRECT PATTERN — start/stop with buttons
const startBtn = document.getElementById("start");
const stopBtn  = document.getElementById("stop");
let clockId    = null; // null = not running

startBtn.addEventListener("click", function() {
    if (clockId) return; // already running — don't start a second interval
    clockId = setInterval(function() {
        const now = new Date();
        document.querySelector("h1").textContent = now.toLocaleTimeString();
    }, 1000);
    startBtn.disabled = true;
    stopBtn.disabled  = false;
});

stopBtn.addEventListener("click", function() {
    clearInterval(clockId); // stop the interval
    clockId = null;          // reset so it can be started again
    startBtn.disabled = false;
    stopBtn.disabled  = true;
});

// ── setInterval with condition — stop automatically ────────
let count = 0;
const counterId = setInterval(function() {
    count++;
    console.log("Count:", count);
    if (count >= 5) {
        clearInterval(counterId); // stop after 5 ticks
        console.log("Counter done!");
    }
}, 1000);
// Output: 1, 2, 3, 4, 5, "Counter done!"


// ============================================================
// SECTION 10: ALL EVENT TYPES — categorized reference
// ============================================================

// ── MOUSE EVENTS ───────────────────────────────────────────
element.addEventListener("click",       e => {}); // single left click
element.addEventListener("dblclick",    e => {}); // double click
element.addEventListener("mousedown",   e => {}); // mouse button pressed down
element.addEventListener("mouseup",     e => {}); // mouse button released
element.addEventListener("mousemove",   e => {}); // mouse moving over element
element.addEventListener("mouseenter",  e => {}); // mouse enters element (no bubble)
element.addEventListener("mouseleave",  e => {}); // mouse leaves element (no bubble)
element.addEventListener("mouseover",   e => {}); // mouse enters element OR child (bubbles)
element.addEventListener("mouseout",    e => {}); // mouse leaves element OR child (bubbles)
element.addEventListener("contextmenu", e => {}); // right click

// mouseenter vs mouseover — interview question!
// mouseenter — fires once when mouse enters the element. Does NOT bubble.
// mouseover  — fires when mouse enters element OR any of its children. BUBBLES.
// For tooltips and hover effects: use mouseenter/mouseleave (no bubble = cleaner)

// ── KEYBOARD EVENTS ────────────────────────────────────────
element.addEventListener("keydown",  e => {}); // key pressed (fires repeatedly if held)
element.addEventListener("keyup",    e => {}); // key released
element.addEventListener("keypress", e => {}); // DEPRECATED — use keydown instead

// Order when you press and hold a key:
// keydown → keydown → keydown → ... (repeats) → keyup

// ── FORM / INPUT EVENTS ────────────────────────────────────
input.addEventListener("input",  e => {}); // fires on EVERY change (each keystroke)
input.addEventListener("change", e => {}); // fires when value changes AND focus leaves
input.addEventListener("focus",  e => {}); // element gains focus (tabbed/clicked into)
input.addEventListener("blur",   e => {}); // element loses focus
input.addEventListener("submit", e => {}); // form submit (attach to <form>, not button!)

// input vs change:
// input  — fires live on every keystroke (use for live search, character count)
// change — fires only when user leaves the field (use for validation after typing done)

// ── WINDOW / PAGE EVENTS ───────────────────────────────────
window.addEventListener("load",            e => {}); // everything loaded (images, scripts)
window.addEventListener("DOMContentLoaded",e => {}); // HTML parsed, DOM ready (faster than load)
window.addEventListener("resize",          e => {}); // window resized
window.addEventListener("scroll",          e => {}); // page scrolled
window.addEventListener("beforeunload",    e => {}); // user about to leave page

// DOMContentLoaded vs load — interview question!
// DOMContentLoaded — fires when HTML is parsed and DOM is built.
//                    Images/stylesheets may still be loading.
//                    Use this for almost everything.
// load             — fires when EVERYTHING is loaded (images, fonts, stylesheets).
//                    Slower. Use only when you need images to be ready.

// ── CLIPBOARD EVENTS ───────────────────────────────────────
document.addEventListener("copy",  e => { console.log("User copied text"); });
document.addEventListener("paste", e => {
    const pasted = e.clipboardData.getData("text");
    console.log("Pasted:", pasted);
});
document.addEventListener("cut",   e => { console.log("User cut text"); });

// ── DRAG EVENTS ────────────────────────────────────────────
element.addEventListener("dragstart", e => {}); // started dragging
element.addEventListener("dragend",   e => {}); // released after drag
element.addEventListener("dragover",  e => { e.preventDefault(); }); // must call preventDefault to allow drop
element.addEventListener("drop",      e => {}); // dropped on target

// ── TOUCH EVENTS (mobile) ──────────────────────────────────
element.addEventListener("touchstart", e => {}); // finger touches screen
element.addEventListener("touchmove",  e => {}); // finger moves on screen
element.addEventListener("touchend",   e => {}); // finger lifted


// ============================================================
// SECTION 11: REMOVING EVENT LISTENERS
// ============================================================
// To remove a listener, you must pass the EXACT same function reference.
// Anonymous functions (arrows inline) CANNOT be removed.

// WRONG — cannot be removed (no reference to the function)
btn.addEventListener("click", () => console.log("anonymous — stuck forever"));

// CORRECT — named function can be removed
function handleClick() {
    console.log("named — can be removed");
}
btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick); // works — same reference

// Once option — auto-removes after one fire (clean alternative)
btn.addEventListener("click", function() {
    console.log("fires once then removes itself");
}, { once: true });


// ============================================================
// SECTION 12: CREATING AND DISPATCHING CUSTOM EVENTS
// ============================================================
// You can create your own event types and dispatch them manually.
// Useful for component communication and testing.

// Create a custom event
const myEvent = new CustomEvent("userLoggedIn", {
    detail: { username: "Ayush", role: "admin" }, // custom data
    bubbles: true,    // should it bubble up the DOM?
    cancelable: true  // can it be cancelled with preventDefault?
});

// Listen for it
document.addEventListener("userLoggedIn", function(e) {
    console.log("User logged in:", e.detail.username); // "Ayush"
    console.log("Role:", e.detail.role);               // "admin"
});

// Dispatch (fire) it
document.dispatchEvent(myEvent);

// Real world: fire a custom event when cart updates
function addToCart(item) {
    // ... add item to cart array ...
    const cartEvent = new CustomEvent("cartUpdated", {
        detail: { item, cartSize: cart.length },
        bubbles: true
    });
    document.dispatchEvent(cartEvent);
}
// Anywhere in your app:
document.addEventListener("cartUpdated", (e) => {
    updateCartIcon(e.detail.cartSize); // update the UI badge
});


// ============================================================
// SECTION 13: COMMON INTERVIEW QUESTIONS ON EVENTS
// ============================================================

// Q1: What is event bubbling?
// When an event fires on an element, it travels UP through all
// ancestors firing on each. Stops at document.
// Prevented with e.stopPropagation().

// Q2: What is event capturing?
// The OPPOSITE of bubbling — event travels DOWN from document
// to the target before bubbling back up. Enabled by passing
// true as 3rd argument to addEventListener.

// Q3: What is event delegation?
// Attaching one listener to a PARENT to handle events from
// all its children. Works because of bubbling. More efficient
// and handles dynamically added elements automatically.

// Q4: Difference between e.target and e.currentTarget?
// e.target = element that was actually clicked/interacted with
// e.currentTarget = element that has the listener attached
// They differ when clicking a child of the listening element.

// Q5: What does e.preventDefault() do?
// Stops the DEFAULT browser behavior (link navigation, form reload,
// checkbox toggle). Does NOT stop bubbling.

// Q6: What does e.stopPropagation() do?
// Stops the event from bubbling to parent elements.
// Does NOT affect default browser behavior.

// Q7: setTimeout vs setInterval?
// setTimeout  — fires callback ONCE after delay
// setInterval — fires callback REPEATEDLY every delay ms
// Both return an ID. clearTimeout/clearInterval cancel them.

// Q8: What is the output order?
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
// Answer: A, C, B
// Reason: setTimeout always goes to task queue.
// Synchronous code (A, C) runs first. Then queue is processed (B).

// Q9: What is DOMContentLoaded vs load?
// DOMContentLoaded — DOM ready, images may still load (use this usually)
// load             — everything including images ready (slower)

// Q10: Can you add multiple listeners to the same event?
// YES with addEventListener — both handlers fire.
// NO with onclick property — second one overwrites first.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// ATTACH:
//   el.addEventListener("click", fn)           — basic
//   el.addEventListener("click", fn, true)     — capturing phase
//   el.addEventListener("click", fn, {once:true}) — fires once only
//
// REMOVE:
//   el.removeEventListener("click", namedFn)   — must be same reference
//
// EVENT OBJECT:
//   e.target          — element actually interacted with
//   e.currentTarget   — element with the listener
//   e.type            — "click", "keydown" etc.
//   e.key             — "Enter", "a", "ArrowUp" (keyboard)
//   e.clientX/Y       — mouse position in viewport
//   e.preventDefault() — stop browser default (link/form)
//   e.stopPropagation()— stop bubbling to parents
//
// TIMERS:
//   const id = setTimeout(fn, ms)   — run once after delay
//   clearTimeout(id)                 — cancel it
//   const id = setInterval(fn, ms)  — run forever every ms
//   clearInterval(id)                — stop it
//
// GOLDEN RULES:
// 1. Always use addEventListener — never onclick property in real code
// 2. e.preventDefault() ≠ e.stopPropagation() — completely different jobs
// 3. e.target = what was clicked | e.currentTarget = where listener lives
// 4. Use event delegation for lists — one parent listener beats many child listeners
// 5. Store timer IDs — you can't cancel what you don't track
// 6. clearInterval immediately after setInterval = bug (original code mistake)
// 7. Anonymous arrow functions in addEventListener cannot be removed later
// 8. setTimeout delay=0 still runs AFTER all synchronous code (task queue)
// 9. mouseenter doesn't bubble, mouseover does — use enter/leave for hover
// 10. DOMContentLoaded fires before images load — use it over window.load