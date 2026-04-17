export {};
// =============================================================================
//  13 | DOM MANIPULATION & EVENTS IN TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 12_modules_and_namespaces.ts
//  Next File     : 14_async_typescript.ts
//
//  This file covers:
//    1. DOM element types (HTMLElement hierarchy)
//    2. Querying the DOM (getElementById, querySelector)
//    3. Null-safe DOM access patterns
//    4. Event types (MouseEvent, KeyboardEvent, etc.)
//    5. addEventListener with proper typing
//    6. Event handler function types
//    7. Form handling with TypeScript
//    8. Event delegation
//    9. Creating & dispatching custom events
//   10. Common DOM patterns & recipes
//
//  NOTE: This file is designed to be read as documentation.
//  The code examples assume a browser environment with a DOM.
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — DOM ELEMENT TYPE HIERARCHY
// -----------------------------------------------------------------------------

// TypeScript has a rich hierarchy of DOM types built-in.
// Understanding this hierarchy is KEY to typing DOM code correctly.

//  EventTarget           <- base of everything (has addEventListener)
//    |
//  Node                  <- any node in the DOM tree
//    |
//  Element               <- generic element (has tagName, className)
//    |
//  HTMLElement            <- any HTML element (has style, dataset, etc.)
//    |
//  +-- HTMLInputElement   <- <input> (has .value, .checked, .type)
//  +-- HTMLButtonElement  <- <button> (has .disabled, .type)
//  +-- HTMLDivElement     <- <div>
//  +-- HTMLSpanElement    <- <span>
//  +-- HTMLFormElement    <- <form> (has .elements, .submit())
//  +-- HTMLCanvasElement  <- <canvas> (has .getContext())
//  +-- HTMLImageElement   <- <img> (has .src, .alt, .naturalWidth)
//  +-- HTMLAnchorElement  <- <a> (has .href, .target)
//  +-- HTMLSelectElement  <- <select> (has .value, .options)
//  +-- HTMLTextAreaElement <- <textarea> (has .value, .rows)
//  +-- HTMLVideoElement   <- <video> (has .play(), .pause(), .currentTime)
//  +-- HTMLAudioElement   <- <audio> (same as video methods)
//  +-- ... and many more

// WHY THIS MATTERS:
// When you query the DOM, TS gives you a GENERAL type.
// You often need to NARROW to a SPECIFIC type to access
// element-specific properties like .value or .checked.


// -----------------------------------------------------------------------------
//  SECTION 2 — QUERYING THE DOM
// -----------------------------------------------------------------------------

// getElementById — returns HTMLElement | null
const header = document.getElementById("header");
// Type: HTMLElement | null
// TS doesn't know what KIND of element it is.

// querySelector — returns Element | null
const firstButton = document.querySelector("button");
// Type: HTMLButtonElement | null (TS infers from the tag selector!)

const byClass = document.querySelector(".my-class");
// Type: Element | null (TS can't infer from a class selector)

// querySelectorAll — returns NodeListOf<Element>
const allButtons = document.querySelectorAll("button");
// Type: NodeListOf<HTMLButtonElement>

const allDivs = document.querySelectorAll("div");
// Type: NodeListOf<HTMLDivElement>

// GENERIC querySelector — specify the exact type:
const input = document.querySelector<HTMLInputElement>("#username");
// Type: HTMLInputElement | null

const canvas = document.querySelector<HTMLCanvasElement>("#myCanvas");
// Type: HTMLCanvasElement | null

// WHY USE THE GENERIC FORM?
// When the selector is a class or ID (not a tag name), TS can't infer
// the element type. The generic form lets you specify it explicitly.


// -----------------------------------------------------------------------------
//  SECTION 3 — NULL-SAFE DOM ACCESS PATTERNS
// -----------------------------------------------------------------------------

// DOM queries can return null (element might not exist).
// You MUST handle this. Here are the patterns:

// PATTERN 1: Null check (safest)
const el = document.getElementById("app");
if (el) {
  el.innerHTML = "Hello!"; // TS narrows to HTMLElement inside this block
}

// PATTERN 2: Optional chaining (for one-off access)
document.getElementById("app")?.classList.add("active");
// Does nothing if element is null — no crash.

// PATTERN 3: Non-null assertion (when you're CERTAIN it exists)
const appDiv = document.getElementById("app")!;
appDiv.innerHTML = "Hello!";
// WARNING: If the element doesn't exist, this crashes at runtime.

// PATTERN 4: Type assertion + non-null (when you know the exact type)
const nameInput = document.getElementById("name") as HTMLInputElement;
console.log(nameInput.value); // TS knows it's an input element

// PATTERN 5: Guard function (reusable)
function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

const myInput = getElement<HTMLInputElement>("username");
console.log(myInput.value); // Safe — function guarantees it exists


// -----------------------------------------------------------------------------
//  SECTION 4 — EVENT TYPES
// -----------------------------------------------------------------------------

// TypeScript has detailed types for every kind of DOM event.
// Knowing the right event type gives you autocomplete + safety.

// MOUSE EVENTS:
//   MouseEvent       — click, dblclick, mousedown, mouseup, mousemove
//                      Properties: .clientX, .clientY, .button, .target

// KEYBOARD EVENTS:
//   KeyboardEvent    — keydown, keyup, keypress
//                      Properties: .key, .code, .altKey, .ctrlKey, .shiftKey

// FORM EVENTS:
//   Event            — change, input, submit, reset
//   InputEvent       — input (more specific — has .data, .inputType)
//   SubmitEvent      — submit (has .submitter)

// FOCUS EVENTS:
//   FocusEvent       — focus, blur, focusin, focusout
//                      Properties: .relatedTarget

// DRAG EVENTS:
//   DragEvent        — drag, dragstart, dragend, drop, dragover
//                      Properties: .dataTransfer

// TOUCH EVENTS:
//   TouchEvent       — touchstart, touchmove, touchend
//                      Properties: .touches, .changedTouches

// WHEEL/SCROLL:
//   WheelEvent       — wheel (.deltaX, .deltaY)
//   Event            — scroll

// CLIPBOARD:
//   ClipboardEvent   — copy, cut, paste (.clipboardData)

// ANIMATION/TRANSITION:
//   AnimationEvent   — animationstart, animationend
//   TransitionEvent  — transitionend


// -----------------------------------------------------------------------------
//  SECTION 5 — addEventListener WITH PROPER TYPING
// -----------------------------------------------------------------------------

// When using addEventListener, TS infers the event type from the event name.

const button = document.querySelector<HTMLButtonElement>("#myBtn");

// TS automatically knows `e` is MouseEvent for "click":
button?.addEventListener("click", (e: MouseEvent) => {
  console.log("Clicked at:", e.clientX, e.clientY);
  console.log("Button:", e.button); // 0=left, 1=middle, 2=right
});

// TS knows `e` is KeyboardEvent for "keydown":
document.addEventListener("keydown", (e: KeyboardEvent) => {
  console.log("Key:", e.key);      // "a", "Enter", "ArrowUp"
  console.log("Code:", e.code);    // "KeyA", "Enter", "ArrowUp"
  console.log("Ctrl?", e.ctrlKey); // true/false
  console.log("Shift?", e.shiftKey);

  // Common pattern — keyboard shortcuts:
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault(); // prevent browser's default save dialog
    console.log("Custom save triggered!");
  }
});

// Input event:
const textInput = document.querySelector<HTMLInputElement>("#search");
textInput?.addEventListener("input", (e: Event) => {
  const target = e.target as HTMLInputElement;
  console.log("Current value:", target.value);
});

// WHY CAST e.target?
// e.target is typed as EventTarget | null (generic).
// You know it's an HTMLInputElement, so you cast it.


// -----------------------------------------------------------------------------
//  SECTION 6 — EVENT HANDLER FUNCTION TYPES
// -----------------------------------------------------------------------------

// You can type event handlers as standalone functions:

// PATTERN 1: Using the Event type directly
function handleClick(e: MouseEvent): void {
  console.log("Clicked at:", e.clientX, e.clientY);
}

button?.addEventListener("click", handleClick);

// PATTERN 2: Using React-style event handler type (for standalone typing)
type ClickHandler = (event: MouseEvent) => void;
type KeyHandler = (event: KeyboardEvent) => void;
type InputHandler = (event: Event) => void;

const onClick: ClickHandler = (e) => {
  console.log("Button:", e.button);
};

// PATTERN 3: Generic event handler interface
interface EventMap {
  click: MouseEvent;
  keydown: KeyboardEvent;
  submit: SubmitEvent;
  input: Event;
  scroll: Event;
  resize: UIEvent;
}

function on<K extends keyof EventMap>(
  target: EventTarget,
  event: K,
  handler: (e: EventMap[K]) => void
): void {
  target.addEventListener(event, handler as EventListener);
}

// Usage — fully typed, autocomplete works:
// on(button!, "click", (e) => { console.log(e.clientX); });
// on(document, "keydown", (e) => { console.log(e.key); });


// -----------------------------------------------------------------------------
//  SECTION 7 — FORM HANDLING WITH TYPESCRIPT
// -----------------------------------------------------------------------------

const form = document.querySelector<HTMLFormElement>("#loginForm");

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault(); // Prevent page reload

  // Access form elements by name:
  const formData = new FormData(form);
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt:", { username, password });
});

// TYPED FORM ACCESS (using .elements):
form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  // Type the form elements:
  const elements = form.elements;
  const usernameInput = elements.namedItem("username") as HTMLInputElement;
  const passwordInput = elements.namedItem("password") as HTMLInputElement;

  console.log("Username:", usernameInput.value);
  console.log("Password:", passwordInput.value);
});

// CHECKBOX HANDLING:
const checkbox = document.querySelector<HTMLInputElement>("#agree");
checkbox?.addEventListener("change", () => {
  console.log("Checked:", checkbox.checked); // boolean
});

// SELECT DROPDOWN:
const dropdown = document.querySelector<HTMLSelectElement>("#country");
dropdown?.addEventListener("change", () => {
  console.log("Selected:", dropdown.value);
  console.log("Selected index:", dropdown.selectedIndex);
});


// -----------------------------------------------------------------------------
//  SECTION 8 — EVENT DELEGATION
// -----------------------------------------------------------------------------

// Event delegation: attach ONE listener to a parent element
// instead of individual listeners on each child.
// Events BUBBLE UP from child to parent.

const todoList = document.querySelector<HTMLUListElement>("#todoList");

todoList?.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  // Check what was clicked using the target:
  if (target.tagName === "BUTTON") {
    const todoItem = target.closest("li");
    if (todoItem) {
      console.log("Delete todo:", todoItem.textContent);
      todoItem.remove();
    }
  }

  if (target.tagName === "LI") {
    target.classList.toggle("completed");
  }
});

// WHY DELEGATION?
//   - Better performance (one listener vs N listeners)
//   - Works with dynamically added elements
//   - Less memory usage

// TYPE-SAFE DELEGATION HELPER:
function delegate<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  selector: K,
  eventType: string,
  handler: (element: HTMLElementTagNameMap[K], event: Event) => void
): void {
  parent.addEventListener(eventType, (e: Event) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target && parent.contains(target)) {
      handler(target as HTMLElementTagNameMap[K], e);
    }
  });
}

// Usage:
// delegate(todoList!, "button", "click", (button, event) => {
//   console.log("Button text:", button.textContent);
// });


// -----------------------------------------------------------------------------
//  SECTION 9 — CUSTOM EVENTS
// -----------------------------------------------------------------------------

// You can create and dispatch your own typed events.

// BASIC CUSTOM EVENT:
const customEvent = new CustomEvent("userLogin", {
  detail: {
    userId: 123,
    username: "Ayushman",
    timestamp: Date.now(),
  },
});

// Listen for custom event:
document.addEventListener("userLogin", ((e: CustomEvent) => {
  console.log("User logged in:", e.detail.userId);
  console.log("Username:", e.detail.username);
}) as EventListener);

// Dispatch it:
document.dispatchEvent(customEvent);

// TYPED CUSTOM EVENT (better approach):
interface LoginEventDetail {
  userId: number;
  username: string;
  timestamp: number;
}

function createLoginEvent(detail: LoginEventDetail): CustomEvent<LoginEventDetail> {
  return new CustomEvent<LoginEventDetail>("userLogin", { detail });
}

// Now the event detail is fully typed!

// TYPE-SAFE EVENT SYSTEM:
type AppEvents = {
  userLogin: { userId: number; username: string };
  userLogout: { userId: number };
  themeChange: { theme: "light" | "dark" };
  notification: { message: string; type: "info" | "error" | "success" };
};

function emit<K extends keyof AppEvents>(event: K, detail: AppEvents[K]): void {
  document.dispatchEvent(new CustomEvent(event, { detail }));
}

function listen<K extends keyof AppEvents>(
  event: K,
  handler: (detail: AppEvents[K]) => void
): void {
  document.addEventListener(event, ((e: CustomEvent<AppEvents[K]>) => {
    handler(e.detail);
  }) as EventListener);
}

// Fully typed usage:
listen("themeChange", (detail) => {
  console.log("Theme changed to:", detail.theme); // autocomplete works!
});

emit("themeChange", { theme: "dark" }); // validated at compile time
// emit("themeChange", { theme: "rainbow" }); // ERROR — not in the union


// -----------------------------------------------------------------------------
//  SECTION 10 — COMMON DOM PATTERNS & RECIPES
// -----------------------------------------------------------------------------

// RECIPE 1: Toggle visibility
function toggleVisibility(elementId: string): void {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.display = el.style.display === "none" ? "block" : "none";
  }
}

// RECIPE 2: Debounced input handler
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const searchInput = document.querySelector<HTMLInputElement>("#search");
const debouncedSearch = debounce((query: string) => {
  console.log("Searching for:", query);
}, 300);

searchInput?.addEventListener("input", () => {
  debouncedSearch(searchInput.value);
});

// RECIPE 3: Typed DOM manipulation
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Partial<HTMLElementTagNameMap[K]>,
  children?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) Object.assign(el, props);
  if (children) el.textContent = children;
  return el;
}

const newButton = createElement("button", {
  className: "btn-primary",
  disabled: false,
}, "Click Me");
// newButton is HTMLButtonElement — fully typed!

// RECIPE 4: Intersection Observer (typed)
const observer = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.5 }
);

// observer.observe(document.querySelector(".lazy-section")!);


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  DOM QUERY              RETURN TYPE                      USE
//  ---------------------  -------------------------------- --------------------
//  getElementById(id)     HTMLElement | null                By ID
//  querySelector(sel)     Element | null                   First match (CSS)
//  querySelector<T>(sel)  T | null                         First match (typed)
//  querySelectorAll(sel)  NodeListOf<Element>              All matches
//
//  EVENT TYPE             EVENTS                           KEY PROPERTIES
//  ---------------------  -------------------------------- --------------------
//  MouseEvent             click, dblclick, mousemove       clientX, clientY
//  KeyboardEvent          keydown, keyup                   key, code, ctrlKey
//  FocusEvent             focus, blur                      relatedTarget
//  SubmitEvent            submit                           submitter
//  InputEvent             input                            data, inputType
//  DragEvent              drag, drop                       dataTransfer
//  TouchEvent             touchstart, touchend             touches
//  WheelEvent             wheel                            deltaX, deltaY


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: How do you type DOM queries in TypeScript?
//  A: getElementById returns HTMLElement | null. querySelector returns
//     Element | null. Use the generic form querySelector<T>() or type
//     assertion (as HTMLInputElement) to get specific element types.
//
//  Q2: How do you handle null from DOM queries?
//  A: Four patterns: null check (if (el)), optional chaining (el?.method()),
//     non-null assertion (el!), or a guard function that throws if null.
//
//  Q3: What is the type of e.target in event handlers?
//  A: EventTarget | null (generic). You must narrow it using type assertion
//     (e.target as HTMLInputElement) to access specific properties like .value.
//
//  Q4: What is event delegation?
//  A: Attaching one event listener to a parent element instead of many on
//     children. Events bubble up, and you use e.target to identify which
//     child was interacted with. Better performance + works with dynamic elements.
//
//  Q5: How do you create typed custom events?
//  A: Use CustomEvent<T> with a detail type. For a full typed event system,
//     create an event map type and generic emit/listen functions.
//
//  Q6: Why does TS show errors when accessing .value on e.target?
//  A: e.target is typed as EventTarget (not HTMLInputElement). You must
//     assert: (e.target as HTMLInputElement).value. This is because
//     events can bubble — the target might be any element.


console.log("-- 13_dom_and_events.ts executed successfully --");
