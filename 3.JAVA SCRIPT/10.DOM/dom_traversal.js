// ============================================================
// DOM TRAVERSAL — Complete Deep Dive
// ============================================================
// Once you grab ONE element, you can navigate to ANY other
// element in the entire page just by walking the tree.
// No need to querySelector everything separately.
//
// The DOM tree has 3 types of NODES (not just elements!):
//   1. Element nodes  — actual HTML tags: <div>, <p>, <h1>
//   2. Text nodes     — the text content inside tags (including whitespace!)
//   3. Comment nodes  — <!-- comments -->
//
// This distinction is WHY there are two versions of every property:
//   children          vs  childNodes        (elements only vs ALL nodes)
//   firstElementChild vs  firstChild        (elements only vs ALL nodes)
//   nextElementSibling vs nextSibling       (elements only vs ALL nodes)
//
// 90% of the time you want the "Element" version — it skips whitespace/text nodes.
//
// HTML we'll use as reference for all examples:
// <div id="parent">
//     <h2 id="first-child">First Heading</h2>
//     <p id="middle-child">Middle Paragraph</p>
//     <span id="last-child">Last Span</span>
// </div>
// <section id="sibling-one">Section One</section>
// <section id="sibling-two">Section Two</section>


// ============================================================
// SECTION 1: childNodes vs children — THE KEY DIFFERENCE
// ============================================================
// This trips up every beginner. Look carefully at the difference.

const parent = document.getElementById("parent");

// childNodes — returns EVERY node including text nodes (whitespace between tags)
console.log(parent.childNodes);
// NodeList(7) [
//   text,           ← the whitespace/newline before <h2>
//   h2#first-child, ← actual element
//   text,           ← whitespace between <h2> and <p>
//   p#middle-child, ← actual element
//   text,           ← whitespace between <p> and <span>
//   span#last-child,← actual element
//   text            ← whitespace after <span>
// ]
// 3 actual elements but 7 nodes! The text nodes are the whitespace
// between your HTML tags. This surprises everyone the first time.

// children — returns ONLY element nodes (skips all text/comment nodes)
console.log(parent.children);
// HTMLCollection(3) [h2#first-child, p#middle-child, span#last-child]
// Clean — just the 3 actual elements you care about

// childElementCount — number of child ELEMENTS (not nodes)
console.log(parent.childElementCount); // 3 — not 7

// PRACTICAL RULE:
// Use children       — when you want actual HTML elements
// Use childNodes     — almost never in practice (unless you specifically need text nodes)

// Looping over children
for (let child of parent.children) {
    console.log(child.tagName, child.textContent);
    // H2  First Heading
    // P   Middle Paragraph
    // SPAN Last Span
}

// children is HTMLCollection — convert to array for map/filter
const childrenArray = Array.from(parent.children);
const tagNames = childrenArray.map(el => el.tagName);
console.log(tagNames); // ["H2", "P", "SPAN"]


// ============================================================
// SECTION 2: firstChild vs firstElementChild
// ============================================================

// firstChild — first NODE (usually a text/whitespace node — useless)
console.log(parent.firstChild);
// #text — the whitespace/newline between <div> and <h2>
// This is almost NEVER what you want

// firstElementChild — first ELEMENT (what you actually want)
console.log(parent.firstElementChild);
// <h2 id="first-child">First Heading</h2>

// lastChild — last NODE (again, usually whitespace — useless)
console.log(parent.lastChild);
// #text — whitespace after </span>

// lastElementChild — last ELEMENT (what you actually want)
console.log(parent.lastElementChild);
// <span id="last-child">Last Span</span>

// PRACTICAL RULE:
// Always use firstElementChild and lastElementChild
// Forget firstChild and lastChild exist unless you have a special reason

// Real world: highlight the first and last item in a list
const list = document.querySelector("ul");
list.firstElementChild.classList.add("first-item");  // style first li
list.lastElementChild.classList.add("last-item");    // style last li


// ============================================================
// SECTION 3: PARENT TRAVERSAL
// ============================================================
// Moving UP the tree from a child to its ancestors

const middleChild = document.getElementById("middle-child");

// parentElement — direct parent element (what you almost always want)
console.log(middleChild.parentElement);
// <div id="parent">...</div>

// parentNode — direct parent NODE (same as parentElement for elements)
// Only differs at the very top of the tree (document vs documentElement)
console.log(middleChild.parentNode);
// <div id="parent">...</div>  — same result in practice

// Chaining parentElement to go multiple levels up
console.log(middleChild.parentElement.parentElement);
// <body>...</body>  — grandparent

// closest() — travels UP and finds nearest ancestor matching a CSS selector
// Incredibly useful — searches all the way up until it finds a match
const btn = document.querySelector(".delete-btn");
const card = btn.closest(".card");        // finds nearest .card ancestor
const section = btn.closest("section");  // finds nearest <section> ancestor
const form = btn.closest("form");        // finds nearest <form> ancestor
// Returns null if no matching ancestor found

// closest() includes the element ITSELF in the search
// so element.closest(".card") returns element if element itself has .card class

// Real world: delete a card by clicking its inner button
// HTML: <div class="card"><h3>Title</h3><button class="delete-btn">X</button></div>
document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".card"); // walk up to find the card wrapper
        card.remove();                           // remove the whole card
        // Without closest() you'd need: e.target.parentElement.parentElement.remove()
        // which breaks if you ever add one more wrapper div
    });
});


// ============================================================
// SECTION 4: SIBLING TRAVERSAL
// ============================================================
// Moving SIDEWAYS through elements at the same level

const firstChild = document.getElementById("first-child"); // the <h2>

// nextElementSibling — next element at the same level
console.log(firstChild.nextElementSibling);
// <p id="middle-child">Middle Paragraph</p>

console.log(firstChild.nextElementSibling.nextElementSibling);
// <span id="last-child">Last Span</span>

// If there's no next sibling, returns null
console.log(firstChild.nextElementSibling
            .nextElementSibling
            .nextElementSibling);
// null — no element after <span>

// previousElementSibling — previous element at the same level
const lastChild = document.getElementById("last-child"); // the <span>
console.log(lastChild.previousElementSibling);
// <p id="middle-child">Middle Paragraph</p>

console.log(lastChild.previousElementSibling.previousElementSibling);
// <h2 id="first-child">First Heading</h2>

// No previous sibling returns null
console.log(firstChild.previousElementSibling);
// null — nothing before <h2>

// --- nextSibling vs nextElementSibling (same trap as firstChild) ---
console.log(firstChild.nextSibling);
// #text — the whitespace between </h2> and <p>  ← useless

console.log(firstChild.nextElementSibling);
// <p id="middle-child">...</p>  ← correct

// PRACTICAL RULE: always use nextElementSibling and previousElementSibling


// ============================================================
// SECTION 5: REAL WORLD USE CASES
// ============================================================

// --- USE CASE 1: Accordion / Expand-Collapse ---
// HTML:
// <div class="accordion-item">
//     <button class="accordion-header">What is JS?</button>
//     <div class="accordion-body">JavaScript is...</div>
// </div>

document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        // The body is always the nextElementSibling of the header
        const body = header.nextElementSibling;
        body.classList.toggle("open");

        // Close all OTHER accordion items (only one open at a time)
        document.querySelectorAll(".accordion-body").forEach(otherBody => {
            if (otherBody !== body) {
                otherBody.classList.remove("open");
            }
        });
    });
});

// --- USE CASE 2: Active Tab / Menu Highlight ---
// HTML:
// <nav>
//     <a class="nav-link active" href="#">Home</a>
//     <a class="nav-link" href="#">About</a>
//     <a class="nav-link" href="#">Contact</a>
// </nav>

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active from all siblings
        // parent.children gives all siblings including the clicked one
        const allLinks = e.target.parentElement.children;
        Array.from(allLinks).forEach(l => l.classList.remove("active"));

        // Add active only to the clicked link
        e.target.classList.add("active");
    });
});

// --- USE CASE 3: Move item UP/DOWN in a list ---
// HTML:
// <ul id="sortable-list">
//     <li>Item 1 <button class="up">↑</button><button class="down">↓</button></li>
//     <li>Item 2 <button class="up">↑</button><button class="down">↓</button></li>
//     <li>Item 3 <button class="up">↑</button><button class="down">↓</button></li>
// </ul>

document.getElementById("sortable-list").addEventListener("click", (e) => {
    // Find the <li> that contains the clicked button
    const li = e.target.closest("li");
    if (!li) return;

    if (e.target.classList.contains("up")) {
        const prev = li.previousElementSibling; // item above
        if (prev) prev.insertAdjacentElement("beforebegin", li);
        // "beforebegin" = insert li BEFORE prev → moves li up
    }

    if (e.target.classList.contains("down")) {
        const next = li.nextElementSibling; // item below
        if (next) next.insertAdjacentElement("afterend", li);
        // "afterend" = insert li AFTER next → moves li down
    }
});

// --- USE CASE 4: Form — highlight the label of a focused input ---
// HTML:
// <div class="form-group">
//     <label>Email</label>
//     <input type="email" />
// </div>

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        // label is always the previousElementSibling of the input
        const label = input.previousElementSibling;
        if (label && label.tagName === "LABEL") {
            label.classList.add("focused");
        }
    });

    input.addEventListener("blur", () => {
        const label = input.previousElementSibling;
        if (label && label.tagName === "LABEL") {
            label.classList.remove("focused");
        }
    });
});

// --- USE CASE 5: Table — highlight entire row on cell click ---
// HTML: <table><tr><td>...</td><td>...</td></tr></table>

document.querySelector("table").addEventListener("click", (e) => {
    if (e.target.tagName !== "TD") return; // only act on cell clicks

    // Remove highlight from all rows
    document.querySelectorAll("tr").forEach(row => row.classList.remove("highlighted"));

    // e.target = the TD clicked
    // parentElement = the TR (row) containing that TD
    e.target.parentElement.classList.add("highlighted");
});

// --- USE CASE 6: Step wizard — next/previous buttons ---
// HTML:
// <div class="wizard">
//     <div class="step active">Step 1 content</div>
//     <div class="step">Step 2 content</div>
//     <div class="step">Step 3 content</div>
// </div>
// <button id="prev-btn">Previous</button>
// <button id="next-btn">Next</button>

document.getElementById("next-btn").addEventListener("click", () => {
    const active = document.querySelector(".step.active");
    const next   = active.nextElementSibling;

    if (next) {
        active.classList.remove("active"); // hide current step
        next.classList.add("active");      // show next step
    }
});

document.getElementById("prev-btn").addEventListener("click", () => {
    const active = document.querySelector(".step.active");
    const prev   = active.previousElementSibling;

    if (prev) {
        active.classList.remove("active"); // hide current step
        prev.classList.add("active");      // show previous step
    }
});


// ============================================================
// SECTION 6: FULL TRAVERSAL MAP (all properties together)
// ============================================================

const el = document.querySelector(".target");

// ── CHILDREN (going DOWN) ──────────────────────────────────
el.children              // HTMLCollection — element children only ✓
el.childNodes            // NodeList — ALL nodes including text ✗ (avoid)
el.firstElementChild     // first child element ✓
el.lastElementChild      // last child element ✓
el.firstChild            // first node (usually text/whitespace) ✗ (avoid)
el.lastChild             // last node (usually text/whitespace) ✗ (avoid)
el.childElementCount     // number of child elements

// ── PARENT (going UP) ──────────────────────────────────────
el.parentElement         // direct parent element ✓
el.parentNode            // direct parent node (same result in practice)
el.closest(".selector")  // nearest ancestor matching selector ✓ (very useful)

// ── SIBLINGS (going SIDEWAYS) ──────────────────────────────
el.nextElementSibling     // next element sibling ✓
el.previousElementSibling // previous element sibling ✓
el.nextSibling            // next node (usually whitespace) ✗ (avoid)
el.previousSibling        // previous node (usually whitespace) ✗ (avoid)


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// GOING DOWN (children):
//   el.children              → element children only (use this)
//   el.firstElementChild     → first child element (use this)
//   el.lastElementChild      → last child element (use this)
//   el.childElementCount     → count of child elements
//
// GOING UP (parents):
//   el.parentElement         → direct parent
//   el.closest(".class")     → nearest matching ancestor (very powerful)
//
// GOING SIDEWAYS (siblings):
//   el.nextElementSibling    → next sibling element
//   el.previousElementSibling→ previous sibling element
//
// GOLDEN RULES:
// 1. Always use the "Element" version — firstElementChild NOT firstChild
// 2. childNodes includes whitespace text nodes — use children instead
// 3. closest() is your best friend — use it instead of chaining parentElement
// 4. Always null-check before chaining: el.nextElementSibling?.classList
// 5. nextSibling / previousSibling almost always give you a text node — avoid