// ============================================================
// JAVASCRIPT LOOPS — Complete Study Guide
// ============================================================
// A loop is a way to make JS repeat a block of code
// without you writing it multiple times.
//
// Without loops:
//   console.log(1); console.log(2); console.log(3)... (tedious)
// With loops:
//   for (let i = 1; i <= 100; i++) console.log(i);  (1 line!)
//
// Every loop has 3 essential parts:
//   1. START     — where do we begin?
//   2. CONDITION — when do we stop?
//   3. UPDATE    — how do we move forward each time?
// Without an update, the condition never changes → INFINITE LOOP → browser crashes


// ============================================================
// SECTION 1: for LOOP
// ============================================================
// Use when: you KNOW exactly how many times to repeat.
// This is the most commonly used loop.
//
// Anatomy of a for loop:
//
//   for ( START ; CONDITION ; UPDATE ) { body }
//         ↓          ↓          ↓
//   let i = 0    i < 5      i++
//   (runs once) (checked   (runs after
//               each time)  each cycle)

for (let i = 1; i <= 5; i++) {
    console.log("Iteration:", i);
}
// Output: 1, 2, 3, 4, 5

// Step-by-step what JS does internally:
// 1. let i = 1        → initialize
// 2. is 1 <= 5? YES   → run body → print 1 → i++ → i = 2
// 3. is 2 <= 5? YES   → run body → print 2 → i++ → i = 3
// 4. is 3 <= 5? YES   → run body → print 3 → i++ → i = 4
// 5. is 4 <= 5? YES   → run body → print 4 → i++ → i = 5
// 6. is 5 <= 5? YES   → run body → print 5 → i++ → i = 6
// 7. is 6 <= 5? NO    → loop ends

// --- Counting BACKWARDS ---
for (let i = 5; i >= 1; i--) {
    console.log("Countdown:", i);
}
// Output: 5, 4, 3, 2, 1 — just flip the logic

// --- Loop with STEP (skip values) ---
for (let i = 0; i <= 20; i += 5) {
    console.log("Multiples of 5:", i);
}
// Output: 0, 5, 10, 15, 20

// --- Real world: print a multiplication table ---
let tableOf = 7;
for (let i = 1; i <= 10; i++) {
    console.log(`${tableOf} × ${i} = ${tableOf * i}`);
}
// 7×1=7, 7×2=14 ... 7×10=70

// --- Nested for loop (loop inside a loop) ---
// Outer loop runs N times. For EACH outer iteration, inner runs M times.
// Total iterations = N × M
for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
        process.stdout.write(`(${row},${col}) `); // print without newline
    }
    console.log(); // newline after each row
}
// (1,1) (1,2) (1,3)
// (2,1) (2,2) (2,3)
// (3,1) (3,2) (3,3)
// Real use: rendering a grid, a chessboard, a 2D game map


// ============================================================
// SECTION 2: while LOOP
// ============================================================
// Use when: you DON'T know how many times you'll loop.
// Keep going WHILE some condition remains true.
//
// Think of it like: "keep asking the user for input WHILE
// they haven't typed the right password"

let j = 1;
while (j <= 5) {
    console.log("Count:", j);
    j++;  // ← CRITICAL: if you forget this, j never changes → infinite loop!
}

// --- Real world: waiting for correct user input ---
// (In real code this would use actual input, here we simulate it)
let attempts  = 0;
let maxTries  = 3;
let password  = "abc123";
let userGuess = "wrong"; // simulating wrong input

while (userGuess !== password && attempts < maxTries) {
    console.log(`Attempt ${attempts + 1}: wrong password`);
    attempts++;
    // In real code: userGuess = prompt("Enter password:")
}
if (attempts === maxTries) {
    console.log("Account locked after 3 failed attempts.");
}

// --- Real world: keep dividing until you reach 1 ---
// (This is the basis of binary search and many algorithms)
let number = 64;
let steps  = 0;
while (number > 1) {
    number = Math.floor(number / 2);
    steps++;
}
console.log(`Reached 1 in ${steps} steps`); // 6 steps (64→32→16→8→4→2→1)

// --- DANGER: infinite loop example (never run this!) ---
// let x = 1;
// while (x > 0) {   // x is always > 0 — this never ends
//     console.log(x);
//     x++;           // x keeps growing, condition never becomes false
// }


// ============================================================
// SECTION 3: do...while LOOP
// ============================================================
// Difference from while: the body runs AT LEAST ONCE,
// even if the condition is false from the beginning.
//
// Why? Because the condition is checked AFTER the body runs.
//
// Real world: showing a menu — you always show it at least
// once before checking if the user wants to continue.

let k = 1;
do {
    console.log("Do-while count:", k);
    k++;
} while (k <= 5);

// --- The KEY difference from while ---
let x = 10;

// while: checks condition FIRST — body never runs (10 is not <= 5)
while (x <= 5) {
    console.log("while — this never prints");
}

// do...while: runs body FIRST, checks after — body runs once
do {
    console.log("do...while — this prints ONCE even though 10 > 5");
} while (x <= 5);

// --- Real world: ATM PIN entry ---
// You always show "enter PIN" at least once
let pinCorrect = false;
let pinAttempts = 0;
do {
    console.log("Please enter your PIN:");
    // (simulating: user enters PIN here)
    pinAttempts++;
    if (pinAttempts === 1) pinCorrect = true; // simulate correct on first try
} while (!pinCorrect && pinAttempts < 3);
console.log("PIN accepted. Welcome!");


// ============================================================
// SECTION 4: for...of LOOP
// ============================================================
// Use when: you want to loop through VALUES of an array or string.
// Cleaner than a regular for loop when you don't need the index.
//
// "for each VALUE OF this collection, do something"

let fruits = ["apple", "banana", "mango", "kiwi"];

// Old way (for loop — you have to manage index manually)
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// Better way (for...of — clean, no index needed)
for (let fruit of fruits) {
    console.log("Fruit:", fruit);
}

// --- Works on strings too (string = array of characters) ---
let word = "HELLO";
for (let char of word) {
    console.log(char); // H, E, L, L, O — one character per iteration
}

// --- Real world: calculate total price of cart items ---
let cartPrices = [299, 599, 149, 999];
let total = 0;
for (let price of cartPrices) {
    total += price;
}
console.log("Cart total: ₹" + total); // ₹2046

// --- for...of with destructuring (powerful pattern) ---
let students = [
    { name: "Alice", grade: "A" },
    { name: "Bob",   grade: "B" },
    { name: "Carol", grade: "A+" }
];
for (let student of students) {
    console.log(`${student.name} got ${student.grade}`);
}
// Alice got A, Bob got B, Carol got A+


// ============================================================
// SECTION 5: for...in LOOP
// ============================================================
// Use when: you want to loop through KEYS of an object.
// for...of gives VALUES. for...in gives KEYS (property names).
//
// Think of an object like a dictionary:
//   for...in = loop through all the words (keys)
//   for...of = loop through all the definitions (values) — not for objects

let person = {
    name: "Alice",
    age:  25,
    city: "New York",
    job:  "Developer"
};

for (let key in person) {
    // 'key' is a string: "name", "age", "city", "job"
    // person[key] accesses the value for that key
    console.log(`${key} → ${person[key]}`);
}
// name → Alice
// age  → 25
// city → New York
// job  → Developer

// --- Real world: display all fields of a form submission ---
let formData = {
    username: "ayush123",
    email:    "ayush@example.com",
    phone:    "9876543210"
};
for (let field in formData) {
    console.log(`Field: ${field}, Value: ${formData[field]}`);
}

// --- for...in vs for...of — SIDE BY SIDE ---
let colors = ["red", "green", "blue"];

for (let index in colors) {
    console.log(index);        // "0", "1", "2" — gives INDEXES (as strings!)
}
for (let color of colors) {
    console.log(color);        // "red", "green", "blue" — gives VALUES
}
// Rule of thumb: use for...of for arrays, for...in for objects


// ============================================================
// SECTION 6: break AND continue
// ============================================================
// These are "loop control" statements — they change how the loop flows.
//
// break    → EXIT the loop immediately, skip remaining iterations
// continue → SKIP just this iteration, go to the next one

// --- continue: skip specific values ---
console.log("Skipping even numbers:");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) continue; // if even, skip to next iteration
    console.log(i);            // only odd numbers print: 1, 3, 5, 7, 9
}

// --- break: stop when condition is met ---
console.log("Find first number divisible by 7:");
for (let i = 1; i <= 100; i++) {
    if (i % 7 === 0) {
        console.log("Found:", i); // prints 7, then stops
        break;                    // no point checking the rest
    }
}

// --- Real world: search in an array ---
let inventory = ["pen", "book", "rubber", "scale", "notebook"];
let searchItem = "rubber";
let found = false;

for (let item of inventory) {
    if (item === searchItem) {
        console.log(`"${searchItem}" is in stock!`);
        found = true;
        break; // stop searching once found — no need to check the rest
    }
}
if (!found) console.log(`"${searchItem}" is not available.`);

// --- break inside nested loops — only breaks the INNER loop ---
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        if (j === 2) break; // only breaks inner loop, outer continues
        console.log(`i=${i}, j=${j}`);
    }
}
// i=1,j=1  then j=2→break→back to outer
// i=2,j=1  then j=2→break→back to outer
// i=3,j=1  then j=2→break
// Outer loop is NOT affected by inner break


// ============================================================
// SECTION 7: CHOOSING THE RIGHT LOOP
// ============================================================
//
//  SITUATION                              → USE
//  ─────────────────────────────────────────────────────
//  Know exact number of iterations        → for
//  Don't know count, check condition      → while
//  Must run at least once (menu, PIN)     → do...while
//  Loop through array/string values       → for...of
//  Loop through object keys               → for...in
//  ─────────────────────────────────────────────────────

// ============================================================
// SECTION 8: COMMON MISTAKES TO AVOID
// ============================================================

// MISTAKE 1: Off-by-one error
let arr = ["a", "b", "c"]; // length = 3, valid indexes = 0, 1, 2
// for (let i = 1; i <= arr.length; i++)  ← WRONG: starts at 1, goes to 3 (index 3 doesn't exist)
for (let i = 0; i < arr.length; i++) {   // ← CORRECT: 0 to 2
    console.log(arr[i]);
}

// MISTAKE 2: Forgetting to update the variable in a while loop
// let n = 0;
// while (n < 5) { console.log(n); }  ← INFINITE LOOP — n never changes!
let n = 0;
while (n < 5) { console.log(n); n++; }   // ← CORRECT: always update

// MISTAKE 3: using for...in on an array (gives string indexes, not values)
let nums = [10, 20, 30];
for (let i in nums) {
    console.log(typeof i); // "string"! i is "0", "1", "2" not 0, 1, 2
}
// Use for...of instead for arrays


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// for (let i = 0; i < n; i++) { }     — classic, index-based
// while (condition) { }                — unknown iterations
// do { } while (condition);            — runs at least once
// for (let val of array) { }           — array/string values
// for (let key in object) { }          — object keys
//
// break    → exit loop entirely
// continue → skip current iteration, continue loop
//
// GOLDEN RULES:
// 1. Always update your loop variable — or it runs forever
// 2. Array indexes start at 0, not 1 (common off-by-one mistake)
// 3. for...of for arrays, for...in for objects — don't mix them
// 4. break only exits the INNERMOST loop, not all loops
// 5. Use for...of over for loops when you don't need the index