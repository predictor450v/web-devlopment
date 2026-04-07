// ============================================================
// JAVASCRIPT FUNCTIONS — Part 2: Advanced Concepts
// ============================================================
// This file builds on basic functions and covers:
//   - Rest parameters (...)
//   - Passing objects to functions
//   - Passing arrays to functions
//   - Early return pattern
//   - Template literals inside functions


// ============================================================
// SECTION 1: BASIC FUNCTION RECAP + NAMING CONVENTIONS
// ============================================================
// Function names should describe WHAT the function does.
// Use camelCase: sayMyName, addTwoNumbers, calculateCartPrice
//
// A function that just prints = "say", "print", "display"
// A function that calculates = "calculate", "get", "find"
// A function that checks     = "is", "has", "check"

function sayMyName() {
    // This function has NO parameters and NO return value.
    // It only performs a side effect (printing to console).
    // Each letter is printed on a new line — that's intentional.
    console.log("H");
    console.log("I");
    console.log("T");
    console.log("E");
    console.log("S");
    console.log("H");
}
sayMyName(); // H I T E S H (each on new line)

// Notice: sayMyName() without () is just a reference to the function object.
// sayMyName  → points to the function (not executed)
// sayMyName() → actually RUNS the function
console.log(typeof sayMyName);   // "function" — it's just a value in JS
console.log(typeof sayMyName()); // "undefined" — it ran, returned nothing


// ============================================================
// SECTION 2: RETURN VALUES — PRINT vs RETURN
// ============================================================
// This is one of the most important distinctions in JS.
//
// console.log() INSIDE a function = shows output but gives nothing back
// return        INSIDE a function = gives the result back to the caller
//
// Analogy:
//   console.log = a chef who shouts the dish name but gives you nothing
//   return      = a chef who actually HANDS you the plate

// Version 1: prints but can't be reused
function addAndPrint(a, b) {
    console.log(a + b); // output visible, but lost forever
}
let x = addAndPrint(3, 5); // x = undefined — nothing was returned
console.log(x);            // undefined

// Version 2: returns — result can be stored, reused, chained
function addTwoNumbers(number1, number2) {
    // The one-line return is clean and preferred for simple math
    // Long form would be:
    //   let result = number1 + number2;
    //   return result;
    // Short form (same thing):
    return number1 + number2;
}

const result = addTwoNumbers(3, 5); // result = 8, stored and reusable
console.log("Result:", result);     // 8

// Now 'result' can be used anywhere — in conditions, more math, etc.
if (result > 5) console.log("Sum is greater than 5"); // reusing the stored value
console.log("Double the result:", result * 2);         // 16

// Real world: always return from utility functions
// so the caller can decide what to do with the result
function celsiusToFahrenheit(c) {
    return (c * 9/5) + 32;
}
let bodyTemp = celsiusToFahrenheit(37); // 98.6 — stored and used later
console.log("Body temp in F:", bodyTemp);


// ============================================================
// SECTION 3: DEFAULT PARAMETERS + EARLY RETURN PATTERN
// ============================================================
// Default parameters: if caller doesn't pass a value, use this fallback.
// Early return: exit the function immediately if something is wrong.
// Together, these make your functions safe and predictable.

function loginUserMessage(username = "sam") {
    // GUARD CLAUSE — check for bad input FIRST and exit early.
    // This keeps the "happy path" (normal flow) at the bottom, unindented.
    // !username is true when username is: "", null, undefined, 0, false
    if (!username) {
        console.log("Please enter a username");
        return; // return with NO value = exits immediately = returns undefined
                // Nothing below this line runs when condition is true
    }

    // This line only runs if username is valid (truthy)
    // Template literal: backticks (``) allow embedding variables with ${}
    return `${username} just logged in`;
}

console.log(loginUserMessage("Ayush")); // "Ayush just logged in"
console.log(loginUserMessage());        // "sam just logged in" — default kicks in
console.log(loginUserMessage(""));      // logs warning, returns undefined

// --- WHY guard clauses are better than nested if/else ---

// BAD — deeply nested, hard to read
function loginBad(username) {
    if (username) {
        if (username.length > 3) {
            return `${username} logged in`;
        } else {
            return "Username too short";
        }
    } else {
        return "No username";
    }
}

// GOOD — flat, readable, each problem handled and exited immediately
function loginGood(username = "sam") {
    if (!username)           return "No username provided";
    if (username.length < 3) return "Username too short";
    return `${username} just logged in`; // happy path — clean and obvious
}

console.log(loginGood(""));    // "No username provided"
console.log(loginGood("ab"));  // "Username too short"
console.log(loginGood("Ayush")); // "Ayush just logged in"


// ============================================================
// SECTION 4: REST PARAMETER (...)
// ============================================================
// Problem: what if you don't know how many arguments will be passed?
// Solution: rest parameter — collects ALL remaining arguments into an ARRAY.
//
// Syntax: function name(param1, param2, ...theRest)
//                                        ↑
//                         must be the LAST parameter always
//
// "..." is called the SPREAD/REST operator — same symbol, different use:
//   In function definition  → REST   (collects into array)
//   When calling a function → SPREAD (expands an array into arguments)

function calculateCartPrice(val1, val2, ...num1) {
    // val1 and val2 grab the first two arguments individually
    // ...num1 collects ALL remaining arguments into one array
    console.log("val1:", val1);   // first argument
    console.log("val2:", val2);   // second argument
    console.log("rest:", num1);   // array of everything else
    return num1;
}

console.log(calculateCartPrice(200, 400, 500, 2000));
// val1: 200
// val2: 400
// rest: [500, 2000]   ← collected into array
// returns: [500, 2000]

// --- More intuitive example: order with unknown number of items ---
function placeOrder(customerName, ...items) {
    console.log(`Order for: ${customerName}`);
    console.log(`Items ordered: ${items.length}`);
    let total = items.reduce((sum, item) => sum + item, 0);
    console.log(`Total: ₹${total}`);
}

placeOrder("Ayush", 299, 499, 149);        // 3 items
placeOrder("Alice", 999);                   // 1 item
placeOrder("Bob", 200, 300, 500, 800, 100); // 5 items
// Same function handles 1 item or 100 items — very flexible

// --- IMPORTANT: rest must be last ---
// function wrong(...items, name) — SyntaxError!
// function right(name, ...items) — correct ✓


// ============================================================
// SECTION 5: PASSING OBJECTS TO FUNCTIONS
// ============================================================
// Objects are passed by REFERENCE in JS.
// This means the function gets the ACTUAL object, not a copy.
// Changes inside the function affect the original object.
//
// Think of it like: you hand someone your HOUSE KEY (reference),
// not a photo of your house (copy). They can actually change things inside.

const user = {
    username: "hitesh",
    prices: 199  // note: 'prices' not 'price' — a naming inconsistency in original
};

function handleObject(anyobject) {
    // Accessing object properties with dot notation inside a template literal
    // anyobject.username → reads 'username' key from whatever object was passed
    console.log(`Username is ${anyobject.username} and price is ${anyobject.price}`);
}

// Method 1: pass a pre-defined variable
handleObject(user);
// Username is hitesh and price is undefined
// Why undefined? Because user has 'prices' (plural) but we access 'price' (singular)
// This is a BUG in the original code — a common real-world mistake!

// Method 2: pass an object LITERAL directly (inline object)
// Useful for one-off calls where you don't need to store the object
handleObject({
    username: "sam",
    price: 399   // 'price' matches what the function expects — works correctly
});
// Username is sam and price is 399

// --- PROOF that objects are passed by reference ---
function applyDiscount(productObj) {
    productObj.price = productObj.price * 0.9; // 10% discount
    // This changes the ORIGINAL object — not a copy!
}
let product = { name: "Laptop", price: 50000 };
console.log("Before:", product.price); // 50000
applyDiscount(product);
console.log("After:", product.price);  // 45000 — original was changed!

// --- Safe approach: don't mutate, return a new object ---
function applyDiscountSafe(productObj) {
    return { ...productObj, price: productObj.price * 0.9 }; // spread = copy + override
}
let product2 = { name: "Phone", price: 20000 };
let discounted = applyDiscountSafe(product2);
console.log("Original:", product2.price);   // 20000 — untouched
console.log("Discounted:", discounted.price); // 18000 — new object


// ============================================================
// SECTION 6: PASSING ARRAYS TO FUNCTIONS
// ============================================================
// Arrays are also passed by reference (just like objects).
// You can pass an array stored in a variable OR an array literal directly.
// Inside the function, access elements by index: array[0], array[1], etc.

const myNewArray = [200, 400, 100, 600];

function returnSecondValue(getArray) {
    // Arrays are zero-indexed: [0]=first, [1]=second, [2]=third...
    // getArray[1] accesses the second element
    return getArray[1];
}

// Method 1: pass a stored array variable
console.log(returnSecondValue(myNewArray));       // 400

// Method 2: pass an array literal directly (inline)
console.log(returnSecondValue([200, 400, 500, 1000])); // 400

// --- More realistic array function examples ---

// Get the last element (regardless of array size)
function getLastElement(arr) {
    return arr[arr.length - 1]; // arr.length-1 is always the last index
}
console.log(getLastElement([10, 20, 30, 40])); // 40
console.log(getLastElement([5]));               // 5

// Find the largest number in an array
function findMax(arr) {
    let max = arr[0]; // assume first is biggest to start
    for (let num of arr) {
        if (num > max) max = num; // update whenever we find something bigger
    }
    return max;
}
console.log(findMax([3, 7, 1, 9, 4])); // 9

// Calculate average of all elements
function getAverage(arr) {
    let total = arr.reduce((sum, num) => sum + num, 0);
    return total / arr.length;
}
console.log(getAverage([10, 20, 30, 40])); // 25


// ============================================================
// SECTION 7: COMMON BUGS SHOWN IN THIS CODE
// ============================================================
// The original code had some real-world mistakes worth studying.

// BUG 1: Property name mismatch
// user object has 'prices' (plural) but function accesses 'price' (singular)
const buggyUser = { username: "hitesh", prices: 199 };
function buggyHandler(obj) {
    console.log(obj.price); // undefined — 'price' doesn't exist, 'prices' does
}
buggyHandler(buggyUser); // undefined — no error thrown, just silent wrong result
// JS doesn't crash on missing properties — it returns undefined silently
// This is dangerous because the bug is invisible unless you check output carefully

// FIX: either rename the property OR access the right name
console.log(buggyUser.prices); // 199 — correct key

// BUG 2: Commented-out console.log means you never see results
// const result = addTwoNumbers(3, 5)
// console.log("Result:", result)  ← commented out = you computed but never checked
// Always uncomment your console.logs during development


// ============================================================
// SECTION 8: PUTTING IT ALL TOGETHER
// ============================================================
// Real-world example combining everything from this file:
// An e-commerce order system

const storeUser = {
    username: "Ayush",
    membershipLevel: "gold"
};

function processOrder(customer, discount = 0, ...itemPrices) {
    // Guard clause — exit early if no items
    if (itemPrices.length === 0) {
        return "No items in order";
    }

    // Calculate using the rest parameter array
    let subtotal = itemPrices.reduce((sum, price) => sum + price, 0);
    let discountAmount = subtotal * (discount / 100);
    let total = subtotal - discountAmount;

    // Return a meaningful object — not just a number
    return {
        customer:   customer.username,
        items:      itemPrices.length,
        subtotal:   subtotal,
        discount:   `${discount}%`,
        total:      Math.round(total)
    };
}

// Call with stored user, a discount, and unknown number of items
let order = processOrder(storeUser, 10, 299, 499, 149, 999);
console.log(order);
// { customer: "Ayush", items: 4, subtotal: 1946, discount: "10%", total: 1751 }

console.log(processOrder(storeUser));
// "No items in order" — guard clause caught it


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// REST PARAMETER:
//   function fn(a, b, ...rest) — rest is an array of remaining args
//   Must be the LAST parameter
//
// EARLY RETURN (guard clause):
//   if (badCondition) return; — exit immediately, keep happy path clean
//
// PASSING OBJECTS:
//   Passed by reference — function can see and change the original
//   Use spread {...obj} to avoid mutating: return {...obj, updatedKey: val}
//
// PASSING ARRAYS:
//   Also by reference — access by index: arr[0], arr[1], arr[arr.length-1]
//   Pass inline: fn([1, 2, 3]) or pass variable: fn(myArray)
//
// GOLDEN RULES:
// 1. return gives back a value — console.log just displays it (lost forever)
// 2. ...rest collects extras into an array — always put it last
// 3. Objects and arrays are passed by reference — changes affect the original
// 4. Guard clauses first — validate input at the top, happy path at the bottom
// 5. Property name typos are silent bugs — JS returns undefined, not an error