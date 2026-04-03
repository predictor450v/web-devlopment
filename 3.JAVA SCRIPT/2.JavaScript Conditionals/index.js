// ============================================================
// JAVASCRIPT OPERATORS & CONDITIONALS — Complete Study Guide
// ============================================================
// This file covers everything from scratch with real-world
// examples and theory so you truly understand WHY, not just HOW.


// ============================================================
// SECTION 1: WHAT IS AN OPERATOR?
// ============================================================
// An operator is a symbol that tells JS to perform an action
// on one or more values. The values it works on = "operands".
//
// Example:  10 + 3
//            ↑   ↑  ← operands
//              ↑     ← operator


// ============================================================
// SECTION 2: ARITHMETIC OPERATORS
// ============================================================
// Used for math. Think of building a shopping cart total.

let itemPrice = 250;
let quantity  = 3;
let discount  = 50;

let subtotal   = itemPrice * quantity;  // 750  — multiply
let total      = subtotal - discount;   // 700  — subtract
let tax        = total * 0.18;          // 126  — 18% GST
let grandTotal = total + tax;           // 826  — add

console.log("Grand Total:", grandTotal);

// Division — JS always gives decimal result, not integer
let a = 10, b = 3;
console.log(a / b);  // 3.3333... (not 3 — JS is not like C/Java for division)

// Exponent — base ** power
console.log(2 ** 8);  // 256 — useful in binary/memory calculations (2^8 = 256 bytes)

// Modulus — gives the REMAINDER after division
// This is more useful than it looks:
console.log(10 % 3);  // 1 — (10 = 3×3 + 1, remainder is 1)

// Use case 1: even/odd check
let num = 47;
console.log(num % 2 === 0 ? "Even" : "Odd");  // Odd — 47 ÷ 2 has remainder 1

// Use case 2: cycling/wrapping (like a clock)
// If you have 5 items in an array and index reaches 5, wrap back to 0
let index = 5, totalItems = 5;
console.log(index % totalItems);  // 0 — wraps around

// Increment / Decrement
let counter = 0;
counter++;  // counter = 1  (same as counter = counter + 1)
counter++;  // counter = 2
counter--;  // counter = 1  (same as counter = counter - 1)
console.log("Counter:", counter);  // 1

// Pre vs Post increment — a subtle difference
let x = 5;
console.log(x++);  // prints 5 FIRST, then increments (post-increment)
console.log(x);    // now 6
console.log(++x);  // increments FIRST to 7, then prints (pre-increment)
console.log(x);    // 7


// ============================================================
// SECTION 3: ASSIGNMENT OPERATORS
// ============================================================
// Shorthand for "update this variable using its current value".
// These exist purely for cleaner, shorter code.

let score = 100;

score += 20;  // score = score + 20 → 120  (bonus points added)
score -= 15;  // score = score - 15 → 105  (penalty deducted)
score *= 2;   // score = score * 2  → 210  (double points round)
score /= 3;   // score = score / 3  → 70   (divided into levels)
score %= 50;  // score = score % 50 → 20   (remainder after dividing by 50)

console.log("Final score:", score);  // 20


// ============================================================
// SECTION 4: COMPARISON OPERATORS
// ============================================================
// Always return true or false.
// THE MOST IMPORTANT RULE: always use === not ==

// --- WHY == IS DANGEROUS (type coercion) ---
// JS secretly converts types when using ==. This causes bugs
// that are extremely hard to find.

console.log(0   ==  false);      // true  ← WRONG! 0 is a number, false is boolean
console.log(""  ==  false);      // true  ← WRONG! empty string is not false
console.log(null == undefined);  // true  ← surprising
console.log("1" ==  1);          // true  ← string converted to number silently

// --- WHY === IS SAFE (no type conversion) ---
console.log(0   === false);      // false ✓ different types
console.log(""  === false);      // false ✓ different types
console.log("1" === 1);          // false ✓ different types

// Real bug this causes in code:
let userInput = "0";  // User typed "0" in a form — it's a STRING
if (userInput == 0) {
    // This block runs! "0" got silently converted to number 0
    // You thought you were checking for the number zero, but you got a string match
    console.log("This runs even though types are different — BUG!");
}
if (userInput === 0) {
    // This does NOT run — correct behavior
    console.log("This won't run — safe!");
}

// Other comparison operators (these work as expected)
let p = 10;
console.log(p > 5);    // true  — greater than
console.log(p < 5);    // false — less than
console.log(p >= 10);  // true  — greater than or equal
console.log(p <= 9);   // false — less than or equal
console.log(p !== 20); // true  — strict NOT equal (use this over !=)


// ============================================================
// SECTION 5: LOGICAL OPERATORS
// ============================================================
// Combine multiple conditions. Work on ANY value, not just booleans.

// --- TRUTHY and FALSY ---
// Every value in JS is either "truthy" or "falsy".
// Falsy values: false, 0, "", null, undefined, NaN  (only these 6)
// Everything else is truthy: "hello", 1, [], {}, "0", -1

// Falsy check examples:
console.log(Boolean(0));          // false — falsy
console.log(Boolean(""));         // false — falsy
console.log(Boolean(null));       // false — falsy
console.log(Boolean("hello"));    // true  — truthy
console.log(Boolean([]));         // true  — truthy (empty array is truthy!)
console.log(Boolean(0));          // false — falsy

// --- && (AND) — both sides must be truthy ---
let username = "ayush";
let password = "secret123";
let isLoggedIn = (username === "ayush") && (password === "secret123");
console.log("Logged in:", isLoggedIn);  // true — both conditions passed

// If first side is falsy, JS STOPS and returns it (short-circuit)
// It never even checks the second side — saves time
let user = null;
let name = user && user.name;  // user is null (falsy) → stops → name = null
console.log(name);              // null — no crash! Without &&, user.name would crash

// --- || (OR) — at least one side must be truthy ---
let isAdmin  = false;
let hasToken = true;
console.log(isAdmin || hasToken);  // true — hasToken saves it

// Power of || — default values!
// If left side is falsy, || gives you the right side instead
let city = "" || "Unknown";           // "" is falsy → "Unknown"
let displayName = null || "Guest";    // null is falsy → "Guest"
let finalScore = undefined || 0;      // undefined is falsy → 0
console.log(city, displayName, finalScore);  // Unknown Guest 0

// --- ! (NOT) — flips the boolean ---
let isActive = true;
console.log(!isActive);   // false
console.log(!!isActive);  // true — double NOT = convert to boolean (useful trick)
console.log(!!0);         // false — converts 0 to its boolean equivalent
console.log(!!"hello");   // true  — converts "hello" to boolean


// ============================================================
// SECTION 6: BITWISE OPERATORS
// ============================================================
// Work on the BINARY representation of numbers.
// Every number is stored as 0s and 1s in memory.
// Rarely used in everyday web dev, but important to understand.
//
// 5 in binary = 0101
// 3 in binary = 0011

let m = 5, n = 3;

// & (AND) — bit is 1 only if BOTH are 1
//   0101
// & 0011
// = 0001 → 1
console.log(m & n);   // 1

// | (OR) — bit is 1 if EITHER is 1
//   0101
// | 0011
// = 0111 → 7
console.log(m | n);   // 7

// ^ (XOR) — bit is 1 if bits are DIFFERENT
//   0101
// ^ 0011
// = 0110 → 6
console.log(m ^ n);   // 6

// << (left shift) — shift bits left = multiply by 2
// 0101 → 1010 = 10
console.log(m << 1);  // 10

// >> (right shift) — shift bits right = divide by 2 (drops remainder)
// 0101 → 0010 = 2
console.log(m >> 1);  // 2

// REAL WORLD USE: Unix-style permission flags
// This is exactly how Linux file permissions (chmod) work
const READ    = 4;  // 100 in binary
const WRITE   = 2;  // 010 in binary
const EXECUTE = 1;  // 001 in binary

let userPerms = READ | WRITE;  // 110 = 6 — user has read + write

if (userPerms & READ)    console.log("Can read ✓");     // runs
if (userPerms & WRITE)   console.log("Can write ✓");    // runs
if (userPerms & EXECUTE) console.log("Can execute ✓");  // does NOT run


// ============================================================
// SECTION 7: CONDITIONALS — if / else-if / else
// ============================================================
// Conditionals let your code make decisions.
// Think of it as a bouncer — checks rules in order,
// acts on the FIRST match, ignores the rest.

// --- COMMON BEGINNER MISTAKE: separate if vs else-if ---

let temp = 35;

// WRONG — 3 separate ifs, ALL matching ones run
if (temp > 0)  console.log("Not freezing");  // runs
if (temp > 20) console.log("Warm");          // ALSO runs
if (temp > 30) console.log("Hot");           // ALSO runs — 3 lines printed!

// CORRECT — else-if ladder, ONLY first match runs
if (temp > 30) {
    console.log("Hot — stay hydrated");       // runs, rest skipped
} else if (temp > 20) {
    console.log("Warm — nice weather");
} else if (temp > 0) {
    console.log("Cold — wear a jacket");
} else {
    console.log("Freezing — stay inside");
}
// ORDER MATTERS: always check the most specific/strict condition first

// --- Real world example: grade system ---
let marks = 75;

if (marks >= 90) {
    console.log("Grade: A+");
} else if (marks >= 75) {
    console.log("Grade: A");   // marks=75 hits here → rest skipped
} else if (marks >= 60) {
    console.log("Grade: B");
} else if (marks >= 40) {
    console.log("Grade: C");
} else {
    console.log("Grade: F — Please reappear");
}


// ============================================================
// SECTION 8: TERNARY OPERATOR
// ============================================================
// A compact one-liner for simple if/else assignments.
// Syntax: condition ? valueIfTrue : valueIfFalse
// Mental model: "which value do I want?" (not "what should I do?")

let age = 20;

// Instead of:
// let ticketType;
// if (age >= 18) { ticketType = "Adult"; } else { ticketType = "Child"; }

// Write this:
let ticketType = (age >= 18) ? "Adult" : "Child";
console.log(ticketType);  // "Adult"

// More real examples
let isOnline    = true;
let statusText  = isOnline ? "Online" : "Offline";    // UI badge text
let btnLabel    = isOnline ? "Disconnect" : "Connect"; // button label

console.log(statusText, btnLabel);  // Online Disconnect

// Ternary inside a string (very common in React/frontend)
let cartItems = 3;
console.log(`You have ${cartItems} item${cartItems > 1 ? "s" : ""} in your cart`);
// "You have 3 items in your cart"   (adds 's' only when plural)

// --- WHEN NOT TO USE TERNARY ---
// Nested ternaries = unreadable. Use if-else instead.

// BAD — please never write this
let g = marks >= 90 ? "A+" : marks >= 75 ? "A" : marks >= 60 ? "B" : "C";
// By the time you read the end you've forgotten the start

// GOOD — clear if-else ladder (already shown above)


// ============================================================
// SECTION 9: typeof OPERATOR
// ============================================================
// Tells you the data type of any value at runtime.
// Returns a lowercase string.

console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← known JS bug, null is NOT an object
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"  ← arrays are also "object"!
console.log(typeof function(){}); // "function"

// Practical use: validating input before using it
function double(val) {
    if (typeof val !== "number") {
        console.log("Please provide a number!");
        return;
    }
    return val * 2;
}
console.log(double(5));       // 10
console.log(double("hello")); // "Please provide a number!"


// ============================================================
// QUICK REFERENCE CHEATSHEET (as comments)
// ============================================================
//
// ARITHMETIC:  +  -  *  /  %  **  ++  --
// ASSIGNMENT:  =  +=  -=  *=  /=  %=
// COMPARISON:  ===  !==  >  <  >=  <=   (avoid == and !=)
// LOGICAL:     &&  ||  !
// BITWISE:     &  |  ^  ~  <<  >>
// OTHER:       typeof   ? :  (ternary)
//
// GOLDEN RULES:
// 1. Always === never ==
// 2. Use else-if, not multiple separate ifs
// 3. Ternary for simple value picks, if-else for complex logic
// 4. || gives default values, && prevents crashes
// 5. Every value is truthy EXCEPT: false, 0, "", null, undefined, NaN