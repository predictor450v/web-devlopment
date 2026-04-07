/*
========================================================
📘 JAVASCRIPT EXECUTION CONTEXT (CORE CONCEPT)
========================================================

👉 WHAT IS EXECUTION CONTEXT?

Execution Context = Environment where JavaScript code runs.

👉 Think of it like:
📦 A box that contains everything needed to run your code:
- Variables
- Functions
- Scope
- this keyword

========================================================
🔹 TYPES OF EXECUTION CONTEXT
========================================================

1. GLOBAL EXECUTION CONTEXT (GEC)
2. FUNCTION EXECUTION CONTEXT (FEC)
3. EVAL EXECUTION CONTEXT (rare, ignore)

========================================================
🔹 1. GLOBAL EXECUTION CONTEXT (GEC)
========================================================
*/

/*
👉 Created when JS file runs

Contains:
- Global object (window in browser, {} in Node)
- this keyword
- variables and functions

Example:
*/

var a = 10;

function test() {
    console.log("Hello");
}

/*
👉 Before execution, memory is allocated:

a → undefined
test → function definition

this → global object

========================================================
🔹 2. HOW CODE EXECUTES (VERY IMPORTANT)
========================================================

JavaScript runs in TWO PHASES:

1️⃣ MEMORY CREATION PHASE (HOISTING)
2️⃣ EXECUTION PHASE

========================================================
🔹 MEMORY PHASE (HOISTING)
========================================================

👉 JS scans code BEFORE execution

- Variables → undefined
- Functions → full definition

Example:
*/

console.log(x); // undefined (NOT error)

var x = 5;

/*
Memory Phase:
x → undefined

Execution Phase:
x → 5
*/


/*
========================================================
🔹 FUNCTION HOISTING
========================================================
*/

sayHello(); // works

function sayHello() {
    console.log("Hello");
}

/*
👉 Functions are fully hoisted
*/


/*
========================================================
🔹 3. EXECUTION PHASE
========================================================

👉 Code runs line by line

Assignments happen:
x = 5
function calls execute
*/


/*
========================================================
🔹 4. FUNCTION EXECUTION CONTEXT (FEC)
========================================================
*/

function add(num1, num2) {
    let total = num1 + num2;
    return total;
}

let result = add(2, 3);

/*
👉 When function is called:

A NEW EXECUTION CONTEXT is created

Steps:
1. New memory space created
2. Arguments assigned:
   num1 → 2
   num2 → 3
3. Execution happens

After completion → context is deleted
*/


/*
========================================================
🔹 5. CALL STACK (VERY IMPORTANT)
========================================================

👉 JavaScript uses a STACK to manage execution contexts

Rule:
👉 LIFO (Last In First Out)

Example:
*/

function one() {
    console.log("One");
    two();
}

function two() {
    console.log("Two");
    three();
}

function three() {
    console.log("Three");
}

one();

/*
Execution Flow:

Global()
  ↓
one()
  ↓
two()
  ↓
three()

Stack:
[Global]
[one]
[two]
[three]

Then:
three() completes → removed
two() completes → removed
one() completes → removed
*/


/*
========================================================
🔹 6. VISUAL FLOW (IMPORTANT FOR UNDERSTANDING)
========================================================

Global Execution Context
        ↓
Function Call → New Execution Context
        ↓
Push to stack
        ↓
Execute
        ↓
Pop from stack

========================================================
🔹 7. IMPORTANT INTERVIEW POINTS
========================================================

🔥 HOISTING:
- Variables → undefined
- Functions → full definition

🔥 CALL STACK:
- Manages execution order
- LIFO

🔥 EXECUTION CONTEXT:
- Created for every function call

🔥 this keyword:
- Depends on execution context

========================================================
🔹 8. COMMON MISTAKE
========================================================

console.log(a);
let a = 10;

❌ ERROR: Cannot access before initialization

👉 Because:
let/const → hoisted BUT in "Temporal Dead Zone (TDZ)"

========================================================
🔹 9. REAL-WORLD ANALOGY
========================================================

👉 Think of execution context like:

👨‍🍳 Kitchen (Global context)
🍳 Each dish = Function call

Each dish:
- Gets its own workspace
- Uses ingredients (variables)
- Finishes → workspace cleaned

========================================================
🚀 FINAL SUMMARY (SHORT REVISION)
========================================================

👉 Execution Context = Environment of execution

👉 Types:
- Global
- Function

👉 Phases:
1. Memory Phase (Hoisting)
2. Execution Phase

👉 Call Stack:
- Manages execution
- LIFO

👉 Key:
- Functions create new context
- Context gets destroyed after execution

========================================================
*/