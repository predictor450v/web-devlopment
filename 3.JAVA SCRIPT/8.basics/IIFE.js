/*
========================================================
📘 IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSIONS)
========================================================

👉 WHAT IS IIFE?

IIFE = A function that runs IMMEDIATELY after it is defined.

Syntax:
(function() {
    // code
})();

========================================================
🔹 WHY IIFE EXISTS?
========================================================

📌 PROBLEM (Before ES6):
- JavaScript had NO block scope (only function scope)
- Variables could pollute global scope

Example problem:
*/

var a = 10;

function test() {
    var a = 20;
}

test();
console.log(a); // 10 (but global pollution still exists)

/*
👉 In large applications:
- Too many global variables → conflicts
- Hard to manage

========================================================
✅ SOLUTION → IIFE
========================================================

👉 IIFE creates:
- Private scope
- Immediate execution
- No global pollution

========================================================
🔹 1. BASIC IIFE (NAMED)
========================================================
*/

(function chai(){
    /*
    📌 Named IIFE
    - Function has a name (chai)
    - Useful for debugging
    */
    console.log(`DB CONNECTED`);
})();

/*
⚠️ IMPORTANT:
- () around function → converts it into expression
- () at end → immediately invokes it
*/


/*
========================================================
🔹 2. IIFE WITH PARAMETERS
========================================================
*/

(function(name){
    console.log(`Hello ${name}`);
})("Hitesh");

/*
📌 Works like normal function:
- Accepts parameters
- Executes instantly
*/


/*
========================================================
🔹 3. ARROW FUNCTION IIFE
========================================================
*/

((name) => {
    console.log(`DB CONNECTED TWO ${name}`);
})('hitesh');

/*
📌 Modern version using arrow function
*/


/*
========================================================
🔹 4. VERY IMPORTANT RULE (SEMICOLON)
========================================================

⚠️ MUST USE SEMICOLON AFTER IIFE

Why?

Because JavaScript may treat next IIFE as continuation
of previous one → ERROR
*/

(function(){
    console.log("First IIFE");
})(); // ← IMPORTANT semicolon

(function(){
    console.log("Second IIFE");
})();


/*
========================================================
🔹 5. REAL-WORLD USE CASES
========================================================

👉 Use Case 1: Avoid global pollution
*/

(function(){
    let privateVar = "secret";
    console.log("Inside IIFE:", privateVar);
})();

// console.log(privateVar); ❌ ERROR (not accessible)


/*
👉 Use Case 2: Initialization code
*/

const app = (() => {
    console.log("App initializing...");
    return {
        version: "1.0"
    };
})();

console.log(app.version);


/*
👉 Use Case 3: Data privacy (before modules)
*/

const counter = (function(){
    let count = 0;

    return {
        increment: function() {
            count++;
            console.log(count);
        },
        get: function() {
            return count;
        }
    };
})();

counter.increment(); // 1
counter.increment(); // 2

/*
💡 count is PRIVATE (closure + IIFE)
*/


/*
========================================================
🔹 6. IIFE vs NORMAL FUNCTION
========================================================

Normal Function:
- Defined first
- Called later

IIFE:
- Defined + executed immediately
- No need to call separately

========================================================
🔹 7. MODERN JAVASCRIPT NOTE
========================================================

👉 Today (ES6+):
- let & const provide block scope
- Modules reduce need for IIFE

BUT:
- Still used in:
  - libraries
  - initialization logic
  - closures

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 IIFE = function that runs immediately

🔥 WHY:
- Avoid global pollution
- Create private scope
- Execute setup code instantly

🔥 TYPES:
- Named IIFE
- Anonymous IIFE
- Arrow IIFE

🔥 MUST REMEMBER:
- Wrap function in ()
- End with () to execute
- Use ; when chaining multiple IIFEs

========================================================
*/