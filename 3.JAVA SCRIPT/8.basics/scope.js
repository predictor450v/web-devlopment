// ============================================================
// JAVASCRIPT SCOPE & HOISTING — Complete Study Guide
// ============================================================
// Two of the most misunderstood concepts in JS.
// Once you truly get these, you will understand WHY your code
// behaves the way it does — and stop being surprised by bugs.
//
// SCOPE  = "where can this variable be seen/accessed?"
// HOISTING = "what does JS do with your code BEFORE running it?"


// ============================================================
// SECTION 1: WHAT IS SCOPE?
// ============================================================
// Scope is the REGION of your code where a variable EXISTS.
// Outside that region, the variable simply does not exist.
//
// Think of scope like ROOMS IN A HOUSE:
//   - A person in the kitchen (inner scope) can see the living room TV (outer)
//   - A person in the living room CANNOT see inside the kitchen (inner)
//   - Two separate kitchens CANNOT see each other
//
// JS has 3 types of scope:
//   1. Global scope  — declared outside everything, visible everywhere
//   2. Block scope   — declared inside {} with let/const, only visible inside
//   3. Function scope — declared inside a function, only visible inside


// ============================================================
// SECTION 2: BLOCK SCOPE — let and const
// ============================================================
// A "block" is any pair of curly braces: if{}, for{}, while{}, or just {}
// Variables declared with let/const inside a block STAY inside that block.
// They are invisible to the outside world.

let a = 300; // declared in GLOBAL scope — visible everywhere below

if (true) {
    let a = 10;       // NEW variable 'a' — exists ONLY inside this if-block
    const b = 20;     // also block-scoped — only inside this if-block

    console.log("INNER a:", a); // 10  — sees the INNER 'a', not the outer one
    console.log("INNER b:", b); // 20  — visible here
}

console.log("OUTER a:", a); // 300 — sees the OUTER 'a' — inner one is gone
// console.log(b);          // ❌ ReferenceError: b is not defined
                             // b died when the if-block closed

// --- What about var? var IGNORES block scope ---
if (true) {
    var leaked = "I escape blocks!"; // var leaks out of if, for, while blocks
    let safe   = "I stay inside";    // let stays contained
}
console.log(leaked); // "I escape blocks!" — var leaked out!
// console.log(safe); // ❌ ReferenceError — let stayed inside

// This is exactly why var causes bugs — it doesn't respect block boundaries.
// let and const were introduced in ES6 specifically to fix this behavior.

// --- Shadowing: same name, different scope ---
// When inner scope declares same name as outer, inner one "shadows" the outer.
// They are TWO COMPLETELY SEPARATE variables that happen to share a name.

let score = 100; // outer 'score'
if (true) {
    let score = 50; // inner 'score' — shadows the outer one
    console.log("Inner score:", score); // 50 — inner wins inside the block
}
console.log("Outer score:", score); // 100 — outer is untouched, inner is gone
// Lesson: be careful with shadowing — it can cause confusion.
// Prefer different names unless you have a strong reason to shadow.


// ============================================================
// SECTION 3: FUNCTION SCOPE + LEXICAL SCOPE
// ============================================================
// Every function creates its own scope bubble.
// Variables inside are private — invisible outside.
//
// LEXICAL SCOPE = inner functions can see outer variables,
//                but outer functions CANNOT see inner variables.
// "Lexical" = based on WHERE the code is WRITTEN, not where it runs.

function one() {
    const username = "hitesh"; // lives in one()'s scope

    function two() {
        const website = "youtube"; // lives in two()'s scope

        // two() can see username — it's in the OUTER scope (lexical scope)
        console.log(username); // "hitesh" ✓ — inner can see outer
        console.log(website);  // "youtube" ✓ — own variable
    }

    // console.log(website); // ❌ ReferenceError — one() cannot see inside two()
    two(); // call two() from inside one()
}
one();

// --- Scope chain: JS searches outward, never inward ---
// When JS looks for a variable, it searches:
//   1. Current scope → 2. Parent scope → 3. Grandparent → ... → Global
// If not found anywhere → ReferenceError
//
// Visual:
//   Global scope
//   └── one() scope  (can see: global)
//       └── two() scope  (can see: one's + global)

// --- Nested block scope works the same way ---
if (true) {
    const username = "hitesh"; // outer block

    if (username === "hitesh") {
        const website = "youtube"; // inner block
        console.log(username + website); // ✓ inner can see outer block's variable
    }

    // console.log(website); // ❌ ReferenceError — website is in inner block
}
// console.log(username); // ❌ ReferenceError — username is in the if-block


// ============================================================
// SECTION 4: HOISTING — JS's Behind-the-Scenes Magic
// ============================================================
// Before JS runs a single line of your code, it does a PREPARATION PASS.
// During this pass it "hoists" (lifts) certain things to the top.
//
// What gets hoisted:
//   ✓ function DECLARATIONS — fully hoisted (definition + body)
//   ~ var declarations      — partially hoisted (name only, value = undefined)
//   ✗ let / const           — NOT hoisted (Temporal Dead Zone)
//   ✗ function EXPRESSIONS  — NOT hoisted (they're stored in let/const/var)
//   ✗ arrow functions       — NOT hoisted (same reason)
//
// This is why the order of your code matters differently for different types.

// ============================================================
// SECTION 5: FUNCTION DECLARATION HOISTING
// ============================================================
// Function declarations are FULLY hoisted — JS reads the entire function
// body during the preparation pass. You can call them BEFORE they appear.

// Calling BEFORE the definition — works perfectly!
console.log(addOne(5)); // 6 ✓ — JS already knows about addOne

function addOne(num) {
    return num + 1;
}

// Calling AFTER definition also works (as always)
console.log(addOne(10)); // 11 ✓

// What JS actually does internally (mental model):
// STEP 1 (preparation): reads all function declarations, stores them
// STEP 2 (execution): runs code line by line
// So by the time line 1 runs, addOne already exists in memory.


// ============================================================
// SECTION 6: FUNCTION EXPRESSION — NOT HOISTED
// ============================================================
// Function expressions assign a function to a variable.
// The VARIABLE is hoisted (with var) or not at all (with let/const).
// The FUNCTION BODY is never hoisted for expressions.

// addTwo(5); // ❌ ReferenceError: Cannot access 'addTwo' before initialization
             // addTwo is declared with const — it's in the Temporal Dead Zone

const addTwo = function(num) {
    return num + 2;
};

console.log(addTwo(5)); // 7 ✓ — works AFTER the definition

// --- What if you used var instead of const? ---
// varAdd(5); // ❌ TypeError: varAdd is not a function
             // var is hoisted but its VALUE is undefined at this point
             // undefined(5) → TypeError

var varAdd = function(num) {
    return num + 2;
};
// After this line, varAdd is now the function — works below
console.log(varAdd(5)); // 7 ✓

// Mental model of what JS does with var:
// PREPARATION: var varAdd = undefined; (name hoisted, no value)
// EXECUTION:   varAdd = function(num){...} (value assigned here)
// So calling before assignment → undefined(5) → TypeError


// ============================================================
// SECTION 7: TEMPORAL DEAD ZONE (TDZ)
// ============================================================
// let and const ARE hoisted, but into a special zone called the
// Temporal Dead Zone — a period where the variable exists in memory
// but CANNOT be accessed yet.
//
// Accessing a let/const before its declaration line → ReferenceError
//
// Why does TDZ exist?
//   To prevent the confusing behavior of var (undefined instead of error).
//   A clear ReferenceError is better than a silent undefined bug.

// console.log(myLet);   // ❌ ReferenceError: Cannot access before initialization
let myLet = "hello";
console.log(myLet);     // ✓ "hello" — TDZ is over after the declaration line

// Timeline for let/const:
// |--- TDZ (exists but forbidden) ---|--- safe to use ---|
// ^                                  ^
// start of block                     declaration line


// ============================================================
// SECTION 8: COMPLETE HOISTING COMPARISON
// ============================================================

// 1. Function declaration — FULLY hoisted ✓
console.log(declaredFn()); // "I work!" — called before definition
function declaredFn() { return "I work!"; }

// 2. var — name hoisted, value is undefined
console.log(varVar); // undefined — name exists, no value yet
var varVar = "var value";
console.log(varVar); // "var value" — now has value

// 3. let — TDZ until declaration
// console.log(letVar); // ❌ ReferenceError
let letVar = "let value";
console.log(letVar); // "let value" ✓

// 4. const — same as let (TDZ)
// console.log(constVar); // ❌ ReferenceError
const constVar = "const value";
console.log(constVar); // "const value" ✓

// 5. Arrow function — NOT hoisted (same as the variable it's stored in)
// console.log(arrowFn()); // ❌ ReferenceError (if const/let) or TypeError (if var)
const arrowFn = () => "arrow result";
console.log(arrowFn()); // "arrow result" ✓


// ============================================================
// SECTION 9: WHY THIS ALL MATTERS — REAL BUGS
// ============================================================

// BUG 1: Relying on var hoisting (common in old code)
function bugExample() {
    console.log(name); // undefined — not an error, but NOT what you expect!
    var name = "Ayush";
    console.log(name); // "Ayush"
}
bugExample();
// With let: ReferenceError immediately tells you the bug exists.
// With var: undefined slips through silently — much harder to debug.

// BUG 2: Forgetting that function expressions aren't hoisted
// (Seen in original code — addTwo was called before its definition)
// Solution: always define function expressions BEFORE calling them,
// or switch to function declarations if you need to call them early.

// BUG 3: Thinking inner scope variables exist outside
function makeCounter() {
    let count = 0; // private to makeCounter
    count++;
    return count;
}
// console.log(count); // ❌ ReferenceError — count is private inside function
console.log(makeCounter()); // 1 — access through the function, not directly


// ============================================================
// SECTION 10: CLOSURE — SCOPE'S SUPERPOWER
// ============================================================
// A closure is when an inner function REMEMBERS variables from
// its outer function even after the outer function has finished running.
// This is only possible because of lexical scope.

function makeMultiplier(factor) {
    // factor lives in makeMultiplier's scope
    return function(number) {
        return number * factor; // inner function REMEMBERS factor — closure!
    };
}

const double   = makeMultiplier(2); // factor = 2, stored in closure
const triple   = makeMultiplier(3); // factor = 3, stored in closure
const tenTimes = makeMultiplier(10); // factor = 10, stored in closure

console.log(double(5));    // 10 — remembers factor=2
console.log(triple(5));    // 15 — remembers factor=3
console.log(tenTimes(5)); // 50 — remembers factor=10
// makeMultiplier() has FINISHED running, but factor is still alive
// inside each returned function — that's the magic of closure.

// Real world: a counter that keeps its own private state
function createCounter() {
    let count = 0; // private — no one outside can touch this directly

    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount:  () => count
    };
}

const counter = createCounter();
counter.increment(); // count = 1
counter.increment(); // count = 2
counter.increment(); // count = 3
counter.decrement(); // count = 2
console.log(counter.getCount()); // 2
// count is completely private — no one can set it to 999 from outside


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// SCOPE RULES:
//   let/const inside {} → block scoped, invisible outside
//   var inside {}       → leaks out of blocks (only respects functions)
//   Inner scope CAN see outer variables (lexical scope)
//   Outer scope CANNOT see inner variables
//
// HOISTING RULES:
//   function declaration → fully hoisted, call anywhere ✓
//   var                  → name hoisted (undefined), value not hoisted
//   let / const          → NOT accessible before declaration (TDZ) ❌
//   function expression  → follows its variable's rules (usually not hoisted) ❌
//   arrow function       → follows its variable's rules (usually not hoisted) ❌
//
// GOLDEN RULES:
// 1. Always use let/const — never var (block scope saves you from bugs)
// 2. Declare variables before using them — even though declarations are hoisted
// 3. Define function expressions BEFORE calling them
// 4. Inner functions can see outer variables — outer cannot see inner
// 5. Shadowing works but use different names when possible — less confusion
// 6. TDZ errors (ReferenceError) are GOOD — they catch bugs early
// 7. Closures = inner function + it remembers outer scope = very powerful