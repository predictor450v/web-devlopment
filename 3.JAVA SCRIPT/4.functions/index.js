// ============================================================
// JAVASCRIPT FUNCTIONS — Complete Study Guide
// ============================================================
// A function is a reusable block of code that performs a task.
// Instead of writing the same logic 10 times, you write it once
// inside a function and CALL it 10 times.
//
// Real world analogy: a function is like a RECIPE.
// You write the recipe once (define). Every time you cook
// (call), you follow the same steps — but maybe with
// different ingredients (arguments) each time.
//
// 3 steps to understand any function:
//   1. DEFINE  — write what the function does (once)
//   2. CALL    — trigger it to run (as many times as you want)
//   3. RETURN  — optionally send a result back to the caller


// ============================================================
// SECTION 1: WHY DO FUNCTIONS EXIST?
// ============================================================

// WITHOUT functions — repetitive, messy, hard to maintain
console.log("Hey Alice you are nice!");
console.log("Hey Alice you are good!");
console.log("Hey Bob you are nice!");
console.log("Hey Bob you are good!");
// Imagine doing this for 100 users... and then your manager
// says "change 'nice' to 'awesome'" — you edit 100 lines.

// WITH a function — write once, change once, use everywhere
function greet(name) {
    console.log("Hey " + name + " you are awesome!");
    console.log("Hey " + name + " you are good!");
}
greet("Alice"); // 2 lines of output
greet("Bob");   // 2 more lines — same logic, different data
// Now if the message changes, you edit ONE place. That's the power.


// ============================================================
// SECTION 2: FUNCTION DECLARATION
// ============================================================
// Syntax:
//   function functionName(parameter1, parameter2) {
//       // body — what it does
//       return value; // optional
//   }
//
// PARAMETERS vs ARGUMENTS — people confuse these all the time:
//   Parameters = the variables listed in the function DEFINITION (placeholders)
//   Arguments  = the actual values you pass when CALLING the function
//
//   function sum(a, b)  ← a, b are PARAMETERS (like variable names)
//   sum(3, 5)           ← 3, 5 are ARGUMENTS  (actual values)

function nice(name) {  // 'name' is a parameter — a placeholder
    console.log("Hey " + name + " you are nice!");
    console.log("Hey " + name + " you are good!");
    console.log("Hey " + name + " your tshirt is nice!");
    console.log("Hey " + name + " your course is good too!");
}

nice("Ayush");  // "Ayush" is the argument — the real value
nice("Alice");  // reuse same function with different data
nice("Bob");

// --- HOISTING: a unique JS behavior with function declarations ---
// You can CALL a function declaration BEFORE you define it.
// JS reads the whole file first, lifts (hoists) all declarations to the top.

sayHello("World");  // This works even though sayHello is defined BELOW

function sayHello(who) {
    console.log("Hello,", who);
}
// Function expressions and arrow functions are NOT hoisted — more on this below.


// ============================================================
// SECTION 3: RETURN VALUES
// ============================================================
// A function can either:
//   a) DO something (side effect)  — like console.log, write to DB
//   b) GIVE something back (return value) — a result you can use
//
// Functions without return → give back 'undefined' by default
// Think of return like a CASH REGISTER:
//   You hand over items (arguments) → machine processes → gives back total (return)

function sum(a, b, c = 3) {  // c has a DEFAULT VALUE — explained next section
    console.log(a, b, c);    // shows what values were received
    return a + b + c;         // sends result BACK to whoever called this
}

// The return value can be:
// 1. Stored in a variable
let result1 = sum(3, 2);       // 3+2+3=8   — stored in result1
let result2 = sum(7, 5);       // 7+5+3=15  — stored in result2
let result3 = sum(3, 13, 1);   // 3+13+1=17 — default NOT used, 1 is passed

console.log("Sum 1:", result1); // 8
console.log("Sum 2:", result2); // 15
console.log("Sum 3:", result3); // 17

// 2. Used directly in an expression (no variable needed)
console.log("Direct use:", sum(10, 20));     // 33 — used directly
console.log("In math:", sum(1, 2) * 10);     // 63 — return value used in calculation

// 3. What happens when there's NO return?
function noReturn() {
    let x = 5 + 3; // does work but returns nothing
}
let val = noReturn();
console.log(val); // undefined — JS default when no return exists

// --- return also EXITS the function immediately ---
function checkAge(age) {
    if (age < 0) {
        return "Invalid age"; // exits here — nothing below runs
    }
    if (age < 18) {
        return "Minor";       // exits here if age is 0-17
    }
    return "Adult";           // only reaches here if age >= 18
}
console.log(checkAge(-5));  // "Invalid age"
console.log(checkAge(15));  // "Minor"
console.log(checkAge(25));  // "Adult"


// ============================================================
// SECTION 4: DEFAULT PARAMETERS
// ============================================================
// Sometimes a function has a parameter that's USUALLY one value
// but can be overridden. Default parameters handle this cleanly.
//
// Without defaults — you'd have to check manually:
function oldSum(a, b, c) {
    if (c === undefined) c = 3; // clunky manual check
    return a + b + c;
}

// With default parameters — clean and readable:
function newSum(a, b, c = 3) { // c defaults to 3 if not provided
    return a + b + c;
}

console.log(newSum(2, 3));     // 8  — c uses default (3)
console.log(newSum(2, 3, 10)); // 15 — c uses provided value (10)

// --- Defaults can be expressions, not just fixed values ---
function createUser(name, role = "viewer", id = Math.random()) {
    return { name, role, id };
}
console.log(createUser("Alice"));           // role="viewer", id=random
console.log(createUser("Bob", "admin"));    // role="admin",  id=random
console.log(createUser("Carol", "editor", 42)); // all provided

// --- Order matters: put defaults LAST ---
// function wrong(a = 1, b) — if you call wrong(5), which is a and which is b?
// JS assigns left to right: a=5, b=undefined — confusing!
// Always: required params first, optional (default) params last.
function correct(required1, required2, optional = "default") {
    return `${required1}, ${required2}, ${optional}`;
}


// ============================================================
// SECTION 5: ARROW FUNCTIONS (ES6)
// ============================================================
// Arrow functions are a shorter syntax for writing functions.
// Introduced in ES6 (2015). Very common in modern JS.
//
// 3 levels of shortening:
//
// Level 1 — Full function declaration:
function multiply1(x, y) {
    return x * y;
}

// Level 2 — Arrow function with body:
const multiply2 = (x, y) => {
    return x * y;
};

// Level 3 — Arrow function, implicit return (one expression):
const multiply3 = (x, y) => x * y; // no braces, no return keyword needed!

console.log(multiply1(3, 4)); // 12
console.log(multiply2(3, 4)); // 12
console.log(multiply3(3, 4)); // 12 — all three are identical in behavior

// --- Single parameter: parentheses optional ---
const double = x => x * 2;       // single param, no () needed
const greetUser = name => "Hi " + name; // same — no () needed
console.log(double(7));           // 14
console.log(greetUser("Ayush"));  // Hi Ayush

// --- No parameters: must use empty parentheses ---
const sayHi = () => console.log("Hi there!");
sayHi(); // Hi there!

// --- Multi-line arrow function: needs {} and explicit return ---
const func1 = (x) => {
    console.log("I am an arrow function", x);
    // multi-line body — must use {} and if returning, use return keyword
};
func1(34); // I am an arrow function 34
func1(66); // I am an arrow function 66
func1(84); // I am an arrow function 84

// --- Real world: arrow functions shine in array methods ---
let numbers = [1, 2, 3, 4, 5];

// map: transform every item (double each number)
let doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter: keep only items that pass a test
let evens = numbers.filter(n => n % 2 === 0);
console.log(evens);   // [2, 4]

// reduce: collapse array to single value (sum)
let total = numbers.reduce((acc, n) => acc + n, 0);
console.log(total);   // 15


// ============================================================
// SECTION 6: FUNCTION TYPES — SIDE BY SIDE COMPARISON
// ============================================================

// 1. Function Declaration — hoisted, can be called before defined
function add(a, b) { return a + b; }

// 2. Function Expression — stored in variable, NOT hoisted
const subtract = function(a, b) { return a - b; };

// 3. Arrow Function — shortest syntax, NOT hoisted
const divide = (a, b) => a / b;

console.log(add(10, 3));       // 13
console.log(subtract(10, 3));  // 7
console.log(divide(10, 2));    // 5

// When to use which:
// - Function declaration  → utility functions, helpers, anything top-level
// - Arrow function        → callbacks, array methods (.map, .filter), short logic
// - Function expression   → when you want to conditionally assign a function


// ============================================================
// SECTION 7: SCOPE — WHERE VARIABLES LIVE
// ============================================================
// Variables declared INSIDE a function only exist INSIDE that function.
// This is called "function scope" — a protective bubble.

function makeSecret() {
    let secret = "I am hidden"; // only visible inside this function
    console.log(secret);        // works fine here
}
makeSecret();
// console.log(secret); // ❌ ReferenceError: secret is not defined
//                          The outside world cannot see inside the function bubble

// Global variables — declared outside, visible everywhere
let globalMsg = "I am global";
function readGlobal() {
    console.log(globalMsg); // ✓ can access — it's global
}
readGlobal();

// IMPORTANT: functions should avoid relying on global variables.
// Pass data as arguments instead — makes functions predictable and reusable.


// ============================================================
// SECTION 8: PURE FUNCTIONS — A KEY CONCEPT
// ============================================================
// A "pure" function:
//   1. Always returns the same output for the same input
//   2. Has no side effects (doesn't change anything outside itself)
//
// Pure functions are predictable, testable, and safe.

// Pure — only uses its parameters, returns a value
function pureAdd(a, b) {
    return a + b; // same input always → same output
}

// Impure — reads from outside, or changes something outside
let runningTotal = 0;
function impureAdd(a, b) {
    runningTotal += a + b; // changes an outside variable — side effect!
    return runningTotal;   // result depends on previous calls — unpredictable
}

console.log(pureAdd(2, 3));   // always 5
console.log(impureAdd(2, 3)); // 5 first time
console.log(impureAdd(2, 3)); // 10 second time — same input, different output!


// ============================================================
// SECTION 9: PRACTICAL REAL WORLD EXAMPLES
// ============================================================

// 1. Cart total calculator
function calculateCartTotal(items, taxRate = 0.18) {
    let subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    let tax      = subtotal * taxRate;
    return {
        subtotal: subtotal,
        tax:      Math.round(tax),
        total:    Math.round(subtotal + tax)
    };
}
let cart = [
    { name: "Book",   price: 299, qty: 2 },
    { name: "Pen",    price: 49,  qty: 5 },
    { name: "Bag",    price: 999, qty: 1 }
];
console.log(calculateCartTotal(cart));
// { subtotal: 1842, tax: 331, total: 2173 }

// 2. Password strength checker
function checkPassword(password) {
    if (password.length < 6)      return "Too short";
    if (password.length < 10)     return "Weak";
    if (!/[A-Z]/.test(password))  return "Add an uppercase letter";
    if (!/[0-9]/.test(password))  return "Add a number";
    return "Strong";
}
console.log(checkPassword("abc"));         // Too short
console.log(checkPassword("abcdefgh"));    // Weak
console.log(checkPassword("Abcdefghij")); // Add a number
console.log(checkPassword("Abcdefg123")); // Strong


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// Function Declaration:
//   function name(params) { return value; }
//   ✓ Hoisted  ✓ Can call before defining
//
// Arrow Function:
//   const name = (params) => expression;    // implicit return
//   const name = (params) => { return ...; } // explicit return
//   ✗ Not hoisted
//
// Default Parameters:
//   function fn(a, b = 10) — b is 10 unless caller provides a value
//   Put defaults LAST
//
// GOLDEN RULES:
// 1. Parameters = placeholders in definition | Arguments = real values in call
// 2. return sends a value back AND exits the function immediately
// 3. Variables inside functions are invisible outside (function scope)
// 4. Arrow functions are best for short logic and array methods
// 5. Pure functions = same input → same output, no outside changes
// 6. Use default parameters instead of manual undefined checks