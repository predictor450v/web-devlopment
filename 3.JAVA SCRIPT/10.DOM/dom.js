// ============================================================
// DOM MANIPULATION — Complete Study Guide
// ============================================================
// DOM = Document Object Model
// When a browser loads your HTML, it converts it into a TREE
// of objects called the DOM. JavaScript can READ and CHANGE
// this tree — which is how websites become interactive.
//
// HTML file (what you write):
//   <h1 id="title">Hello</h1>
//
// Browser converts it to a DOM tree (what JS sees):
//   document
//   └── html
//       └── body
//           └── h1 (id="title")
//               └── "Hello"  ← text node
//
// JS can grab any node in this tree and:
//   - Read its content
//   - Change its content, style, attributes
//   - Add or remove elements
//   - Listen for user events (click, type, hover)


// ============================================================
// SECTION 1: SELECTING ELEMENTS
// ============================================================
// Before you can change anything, you need to GRAB the element.
// JS gives you several ways to select elements from the DOM.
//
// Think of it like finding a contact in your phone:
//   getElementById   = search by unique ID (one result always)
//   querySelector    = search by any CSS selector (first match)
//   querySelectorAll = search by any CSS selector (all matches)

// --- getElementById ---
// Fastest method. IDs must be unique — always returns ONE element.
const title = document.getElementById("title");
console.log(title);          // <h1 id="title">...</h1>
console.log(title.id);       // "title"
console.log(title.tagName);  // "H1"

// --- querySelector ---
// Uses CSS selector syntax — very flexible.
// Returns the FIRST matching element only.
const firstPara    = document.querySelector("p");           // first <p> tag
const byId         = document.querySelector("#title");      // # = ID selector
const byClass      = document.querySelector(".card");       // . = class selector
const nested       = document.querySelector("div p");       // p inside a div
const firstButton  = document.querySelector("button");      // first button

// --- querySelectorAll ---
// Returns a NodeList (like an array) of ALL matching elements.
// Use when you need to work with multiple elements at once.
const allParas     = document.querySelectorAll("p");        // all <p> tags
const allCards     = document.querySelectorAll(".card");    // all elements with class "card"
const allInputs    = document.querySelectorAll("input");    // all input fields

// NodeList looks like an array but is NOT a real array.
// You can loop over it with forEach, but cannot use map/filter directly.
allParas.forEach((para) => {
    console.log(para.textContent);
});

// Convert NodeList to real array if you need map/filter:
const parasArray = Array.from(allParas);
const texts = parasArray.map((p) => p.textContent);

// --- Other selectors (older, less used) ---
const byTag        = document.getElementsByTagName("p");    // HTMLCollection of all <p>
const byClass2     = document.getElementsByClassName("card"); // HTMLCollection by class
// HTMLCollection is live (auto-updates when DOM changes) — NodeList is static.
// Prefer querySelector/querySelectorAll in modern code.

// --- Null check — always do this! ---
// If element doesn't exist, getElementById returns null.
// Calling .textContent on null crashes your entire script.
const maybeExists = document.getElementById("might-not-exist");
if (maybeExists) {
    maybeExists.textContent = "Found it!";
} else {
    console.log("Element not found — check your ID spelling");
}


// ============================================================
// SECTION 2: READING & CHANGING CONTENT
// ============================================================
// Once you have an element, you can read or change what's inside it.
// Three main properties:
//   textContent — raw text only, ignores/strips HTML tags
//   innerHTML   — full HTML string including tags (powerful but risky)
//   innerText   — visible text only (respects CSS display:none)

const heading = document.querySelector("h1");

// READ content
console.log(heading.textContent); // "Hello World" — just the text
console.log(heading.innerHTML);   // "Hello World" — same if no nested HTML

// WRITE content
heading.textContent = "Welcome to DOM!"; // replaces text, treats as plain text
heading.innerHTML   = "Welcome <span>to DOM!</span>"; // parses as HTML

// --- textContent vs innerHTML ---
const box = document.querySelector(".box");
box.textContent = "<strong>Bold</strong>";
// shows literally: <strong>Bold</strong> — tags treated as plain text

box.innerHTML = "<strong>Bold</strong>";
// renders as: Bold (actually bold) — tags are parsed as HTML

// --- innerHTML SECURITY WARNING (XSS Attack) ---
// NEVER put user-provided data directly into innerHTML.
// A malicious user could inject: <script>stealYourCookies()</script>
const userInput = "<img src=x onerror='alert(\"hacked!\")'>";
// box.innerHTML = userInput; // ❌ DANGEROUS — runs the onerror script!
box.textContent = userInput;  // ✓ SAFE — displays as text, not executed

// --- innerText vs textContent ---
// <p>Hello <span style="display:none">hidden</span> World</p>
// textContent → "Hello hidden World"  (returns all text including hidden)
// innerText   → "Hello World"         (respects CSS, skips hidden elements)


// ============================================================
// SECTION 3: CHANGING STYLES
// ============================================================
// Two approaches:
//   1. element.style.property — inline styles (direct, immediate)
//   2. element.classList      — add/remove CSS classes (recommended)
//
// Prefer classList because:
//   - Keeps styles in CSS where they belong
//   - Easier to toggle, add, remove multiple styles
//   - Better for animations and transitions

const box2 = document.querySelector(".box");

// --- Inline style (element.style) ---
// CSS property names become camelCase in JS:
//   background-color → backgroundColor
//   font-size        → fontSize
//   border-radius    → borderRadius
box2.style.backgroundColor = "blue";
box2.style.fontSize         = "24px";
box2.style.padding          = "20px";
box2.style.borderRadius     = "8px";
box2.style.color            = "white";

// Reading a style — only works for INLINE styles set by JS
// Cannot read styles defined in a CSS file this way
console.log(box2.style.backgroundColor); // "blue"

// To read ANY computed style (including from CSS file):
const computedStyle = window.getComputedStyle(box2);
console.log(computedStyle.fontSize); // "24px" — reads the actual computed value

// --- classList — the RIGHT way to change styles ---
const card = document.querySelector(".card");

card.classList.add("active");        // adds class — card now has both .card and .active
card.classList.remove("hidden");     // removes class
card.classList.toggle("highlight");  // adds if missing, removes if present (great for on/off)
card.classList.replace("old", "new"); // replaces one class with another

// Check if element has a class
if (card.classList.contains("active")) {
    console.log("Card is active");
}

// Real world: dark mode toggle
const body = document.body;
function toggleDarkMode() {
    body.classList.toggle("dark-mode");
    // In CSS: .dark-mode { background: #1a1a1a; color: white; }
}


// ============================================================
// SECTION 4: CHANGING ATTRIBUTES
// ============================================================
// HTML attributes: id, class, src, href, alt, value, disabled, etc.
// JS can read, set, and remove any attribute.

const img   = document.querySelector("img");
const link  = document.querySelector("a");
const input = document.querySelector("input");

// --- getAttribute / setAttribute / removeAttribute ---
console.log(img.getAttribute("src"));    // "/images/photo.jpg"
console.log(img.getAttribute("alt"));    // "Profile photo"

img.setAttribute("src", "/images/new-photo.jpg"); // change image source
img.setAttribute("alt", "New photo");             // change alt text
img.setAttribute("width", "300");                  // add new attribute

link.setAttribute("href", "https://example.com");  // change link destination
link.setAttribute("target", "_blank");             // open in new tab

input.removeAttribute("disabled");                 // enable a disabled input

// --- Direct property access (faster for common attributes) ---
// For well-known attributes, you can access them as properties directly:
console.log(img.src);         // full URL including domain
console.log(link.href);       // full URL
console.log(input.value);     // current value typed in input
console.log(input.type);      // "text", "email", "password" etc.
console.log(input.disabled);  // true or false

// Setting via property
input.value    = "Hello";   // sets the text in the input field
input.disabled = true;       // disables the input
img.src        = "/new.jpg"; // changes image

// --- data attributes (custom attributes) ---
// Store extra data in HTML using data-* attributes
// HTML: <div data-user-id="42" data-role="admin">...</div>
const userEl = document.querySelector("[data-user-id]");
const userId = userEl.dataset.userId;  // "42"  (camelCase in JS)
const role   = userEl.dataset.role;    // "admin"
userEl.dataset.status = "online";      // adds data-status="online" to HTML


// ============================================================
// SECTION 5: CREATING & INSERTING ELEMENTS
// ============================================================
// You can build new HTML elements entirely in JS and insert them
// into the page. This is how dynamic content works (adding a new
// tweet, a new comment, a new product card).
//
// Steps:
//   1. createElement  — creates an element (not yet in the page)
//   2. Set content/attributes/styles on it
//   3. appendChild / prepend / insertBefore — put it in the page

// --- createElement + appendChild ---
const newPara = document.createElement("p");    // creates <p></p> in memory
newPara.textContent = "I was created by JavaScript!";
newPara.classList.add("dynamic-text");
newPara.style.color = "blue";

const container = document.querySelector(".container");
container.appendChild(newPara);  // adds as the LAST child of container

// --- Build a complete card element ---
function createProductCard(product) {
    // create outer wrapper
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute("data-id", product.id);

    // create and populate inner elements
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `₹${product.price}`;
    price.classList.add("price");

    const btn = document.createElement("button");
    btn.textContent = "Add to Cart";
    btn.classList.add("btn");

    // nest elements inside the card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(btn);

    return card; // return completed card — not yet in DOM
}

// Now insert the card into the page
const productsGrid = document.querySelector(".products-grid");
const sampleProduct = { id: 1, name: "Laptop", price: 45000, image: "/laptop.jpg" };
const newCard = createProductCard(sampleProduct);
productsGrid.appendChild(newCard);

// --- Insertion positions ---
const parents = document.querySelector(".list");
const newItem = document.createElement("li");
newItem.textContent = "New item";

parents.appendChild(newItem);             // insert as LAST child
parents.prepend(newItem);                 // insert as FIRST child
parents.prepend("Text at start");         // prepend can take text too

// insertBefore(newNode, referenceNode)
const referenceEl = document.querySelector(".reference");
parents.insertBefore(newItem, referenceEl); // insert BEFORE referenceEl

// Modern: insertAdjacentHTML (fastest, most flexible)
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
parents.insertAdjacentHTML("beforeend", "<li class='new'>New Item</li>");
// beforebegin: before the element itself
// afterbegin:  inside element, before first child
// beforeend:   inside element, after last child (like appendChild)
// afterend:    after the element itself


// ============================================================
// SECTION 6: REMOVING ELEMENTS
// ============================================================

const toRemove = document.querySelector(".remove-me");

// Modern way — call remove() directly on the element
toRemove.remove();  // element is gone from the DOM

// Old way — remove via parent (still works, seen in older code)
// toRemove.parentElement.removeChild(toRemove);

// Remove all children of an element (clear a list)
const listEl = document.querySelector("ul");
listEl.innerHTML = "";          // fast but not ideal (triggers full re-parse)
// Better: loop and remove one by one
while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
}


// ============================================================
// SECTION 7: EVENT LISTENERS
// ============================================================
// Events are things the user does: click, type, hover, scroll, submit.
// addEventListener lets JS LISTEN for these and respond.
//
// Syntax:
//   element.addEventListener("eventType", callbackFunction)
//
// The callback receives an EVENT OBJECT with details about what happened.

const btn = document.querySelector("#myButton");

// --- Basic click event ---
btn.addEventListener("click", function() {
    console.log("Button was clicked!");
});

// Arrow function version (more common in modern code)
btn.addEventListener("click", () => {
    console.log("Clicked with arrow function!");
});

// --- The EVENT OBJECT (e or event) ---
// JS passes an event object to your callback automatically.
// It contains details: what was clicked, where, what was typed, etc.
btn.addEventListener("click", (e) => {
    console.log(e.type);          // "click"
    console.log(e.target);        // the element that was clicked
    console.log(e.target.id);     // "myButton"
    console.log(e.clientX);       // X position of mouse click
    console.log(e.clientY);       // Y position of mouse click
    console.log(e.timeStamp);     // when the click happened
});

// --- Common event types ---

// Mouse events
btn.addEventListener("click",      (e) => console.log("Clicked"));
btn.addEventListener("dblclick",   (e) => console.log("Double clicked"));
btn.addEventListener("mouseenter", (e) => console.log("Mouse entered"));
btn.addEventListener("mouseleave", (e) => console.log("Mouse left"));
btn.addEventListener("mousemove",  (e) => console.log(`Mouse at ${e.clientX}, ${e.clientY}`));

// Keyboard events
const inputField = document.querySelector("input");
inputField.addEventListener("keydown",  (e) => console.log("Key down:", e.key));
inputField.addEventListener("keyup",    (e) => console.log("Key up:", e.key));
inputField.addEventListener("keypress", (e) => console.log("Key:", e.key)); // deprecated

// e.key = the actual key ("Enter", "a", "ArrowUp", " ")
// e.code = physical key code ("KeyA", "Space", "Enter")
// e.ctrlKey, e.shiftKey, e.altKey = true/false if modifier held

inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        console.log("Form submitted with Enter key!");
    }
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // block browser's default Ctrl+S behavior
        console.log("Custom save triggered!");
    }
});

// Form events
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // CRITICAL: stops page from reloading on submit
    const inputVal = inputField.value.trim();
    if (!inputVal) {
        console.log("Input is empty!");
        return;
    }
    console.log("Form submitted with:", inputVal);
});

inputField.addEventListener("input",  (e) => console.log("Live value:", e.target.value));
inputField.addEventListener("change", (e) => console.log("Changed to:", e.target.value));
inputField.addEventListener("focus",  ()  => inputField.style.borderColor = "blue");
inputField.addEventListener("blur",   ()  => inputField.style.borderColor = "");

// --- removeEventListener — stop listening ---
function handleClick() { console.log("Clicked"); }
btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick); // must pass SAME function reference
// This is why anonymous functions inside addEventListener can't be removed:
// btn.addEventListener("click", () => {}); // can never remove this!
// Always name your function if you need to remove it later.


// ============================================================
// SECTION 8: EVENT DELEGATION — ONE LISTENER FOR MANY ELEMENTS
// ============================================================
// Problem: if you have 100 list items and add a listener to each,
// that's 100 listeners. Adding new items later gets no listener at all.
//
// Solution: EVENT DELEGATION — attach ONE listener to the PARENT.
// When a child is clicked, the event "bubbles up" to the parent.
// Check event.target to know which child was actually clicked.
//
// Event bubbling: when you click a child, the click event travels
// UP through all parent elements (child → parent → grandparent → document).

const todoList = document.querySelector("#todo-list");

// ONE listener on the parent — handles ALL current AND future children
todoList.addEventListener("click", (e) => {
    // e.target = the exact element that was clicked (could be li or button inside li)

    // Check if a delete button was clicked
    if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove(); // remove the parent <li>
    }

    // Check if a todo item itself was clicked
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("completed"); // toggle strikethrough
    }
});

// Now any new <li> added to todoList AUTOMATICALLY gets this behavior.
// No need to attach new listeners every time you add an item.

// --- e.stopPropagation() — stop bubbling ---
const innerBtn = document.querySelector(".inner-btn");
innerBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // click won't bubble up to parent listeners
    console.log("Inner button clicked — not bubbling up");
});


// ============================================================
// SECTION 9: TRAVERSING THE DOM
// ============================================================
// Move around the DOM tree from any element you already have.

const element = document.querySelector(".item");

// Moving UP (to ancestors)
const parent      = element.parentElement;       // direct parent
const grandParent = element.parentElement.parentElement;
const closest     = element.closest(".container"); // nearest ancestor with class

// Moving DOWN (to children)
const children    = element.children;             // HTMLCollection of all children
const firstChild  = element.firstElementChild;    // first child element
const lastChild   = element.lastElementChild;     // last child element
const childCount  = element.childElementCount;    // number of children

// Moving SIDEWAYS (to siblings)
const nextEl      = element.nextElementSibling;   // next sibling
const prevEl      = element.previousElementSibling; // previous sibling

// Real world: highlight clicked item, reset siblings
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        // Remove active from all items
        menuItems.forEach((i) => i.classList.remove("active"));
        // Add active only to clicked item
        e.target.classList.add("active");
    });
});


// ============================================================
// SECTION 10: REAL WORLD MINI PROJECT — Todo List
// ============================================================
// Combines everything: selecting, creating, events, delegation

// HTML needed:
// <input id="todo-input" placeholder="Add a task..." />
// <button id="add-btn">Add</button>
// <ul id="todo-list"></ul>

const todoInput  = document.getElementById("todo-input");
const addBtn     = document.getElementById("add-btn");
const list       = document.getElementById("todo-list");

function addTodo() {
    const text = todoInput.value.trim();

    // Guard clause — don't add empty items
    if (!text) {
        todoInput.style.borderColor = "red";
        return;
    }
    todoInput.style.borderColor = "";

    // Create list item
    const li = document.createElement("li");
    li.classList.add("todo-item");

    // Create text span
    const span = document.createElement("span");
    span.textContent = text;

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Assemble and insert
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);

    // Clear input for next item
    todoInput.value = "";
    todoInput.focus(); // bring cursor back to input
}

// Add on button click
addBtn.addEventListener("click", addTodo);

// Add on Enter key press
todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo();
});

// Handle clicks inside the list — event delegation
list.addEventListener("click", (e) => {
    // Delete button clicked
    if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove();
    }
    // Toggle complete on span click
    if (e.target.tagName === "SPAN") {
        e.target.parentElement.classList.toggle("completed");
    }
});


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// SELECTING:
//   document.getElementById("id")         → one element by ID
//   document.querySelector(".class")      → first match (CSS selector)
//   document.querySelectorAll("p")        → NodeList of all matches
//
// CONTENT:
//   el.textContent = "text"               → safe, treats as plain text
//   el.innerHTML   = "<b>html</b>"        → parses HTML (avoid with user input!)
//
// STYLES:
//   el.style.backgroundColor = "red"      → inline style
//   el.classList.add/remove/toggle("cls") → preferred — keeps styles in CSS
//
// ATTRIBUTES:
//   el.getAttribute("src")                → read any attribute
//   el.setAttribute("href", "/page")      → set any attribute
//   el.dataset.userId                     → read data-user-id attribute
//
// CREATING:
//   document.createElement("div")         → create (not yet in DOM)
//   parent.appendChild(child)             → insert as last child
//   parent.insertAdjacentHTML("beforeend", "<p>html</p>")
//
// REMOVING:
//   el.remove()                           → remove element from DOM
//
// EVENTS:
//   el.addEventListener("click", (e) => {})
//   e.preventDefault()                    → stop default browser behavior
//   e.stopPropagation()                   → stop event bubbling up
//   e.target                              → element that triggered the event
//
// TRAVERSAL:
//   el.parentElement                      → parent
//   el.children                           → all children
//   el.nextElementSibling                 → next sibling
//   el.closest(".class")                  → nearest matching ancestor
//
// GOLDEN RULES:
// 1. Always null-check before accessing element properties
// 2. Never use innerHTML with user-provided data — XSS risk
// 3. Prefer classList over inline styles
// 4. Use event delegation for dynamic lists — one listener on parent
// 5. Always e.preventDefault() on form submit to stop page reload
// 6. Name your event handler functions if you need to remove them later
// 7. Use textContent for plain text, innerHTML only when you need real HTML tags