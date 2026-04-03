// ============================================================
// JAVASCRIPT BASICS — Variables, Types & Objects
// ============================================================


// ── COMMENTS ─────────────────────────────────────────────────
// Single-line comment: everything after '//' is ignored by JS

/* Multi-line comment:
   useful for longer explanations.
   Nothing inside here is executed. */

// Every statement ends with ';' (optional but recommended for clarity)
console.log("Hello, JavaScript!"); // Prints output to the browser console



// ── VARIABLE DECLARATIONS ────────────────────────────────────
// A variable is a named container that holds a value.
// JS has 3 ways to declare them — each with different rules.

// 1. var — OLD way. Function-scoped. Avoid in modern code.
var x = 10;

// 2. let — PREFERRED. Block-scoped. Use when the value will change.
let y = 20;

// 3. const — Block-scoped. Value CANNOT be reassigned.
//    Use const by default; switch to let only when reassignment is needed.
const z = 30;



// ── WHY let REPLACED var ─────────────────────────────────────
// 'var' is function-scoped, meaning it ignores block boundaries
// like if/for blocks. This causes unexpected behavior.

if (true) {
    var a = 100;
}
console.log(a); // 100 — 'a' leaked OUT of the if-block! Dangerous.

// 'let' is block-scoped — it stays contained inside {}
if (true) {
    let b = 200;
    console.log(b); // 200 — works fine inside the block
}
// console.log(b); // ❌ ReferenceError — 'b' doesn't exist outside the block
//                    This is the CORRECT behavior: variables should not leak.



// ── NAMING RULES ─────────────────────────────────────────────
// - Can use: letters, digits (not first), $, _
// - Case-sensitive: 'name' and 'Name' are different variables
// - Cannot use reserved JS keywords (let, var, function, return, etc.)

let userName = "John";   // ✅ camelCase — standard JS convention
let _age     = 25;       // ✅ underscore prefix is valid
let $balance = 1000;     // ✅ $ prefix is valid (used by jQuery etc.)
// let 1num  = 5;        // ❌ Syntax error — cannot start with a number



// ── PRIMITIVE DATA TYPES ─────────────────────────────────────
// A "primitive" is a basic, single value (not an object).
// JS has 7 primitives:

let num       = 42;                      // Number   — both integers and decimals
let name      = "Alice";                 // String   — text, wrapped in quotes
let isActive  = true;                    // Boolean  — only true or false
let something;                           // Undefined — declared but no value assigned yet
let nothing   = null;                    // Null     — intentionally set to "empty"
let id        = Symbol("id");            // Symbol   — a guaranteed unique value (ES6)
let bigNum    = 12345678901234567890n;   // BigInt   — for integers beyond safe Number range (ES2020)



// ── typeof OPERATOR ──────────────────────────────────────────
// typeof tells you what type a value is at runtime.
// Syntax: typeof <value>  →  returns a string like "number", "string", etc.

console.log(typeof num);       // "number"
console.log(typeof name);      // "string"
console.log(typeof isActive);  // "boolean"
console.log(typeof something); // "undefined"
console.log(typeof nothing);   // "object"  ← ⚠️ Known JS bug! null is NOT an object.
                                //              This quirk exists for historical reasons.
console.log(typeof id);        // "symbol"
console.log(typeof bigNum);    // "bigint"



// ── OBJECTS ──────────────────────────────────────────────────
// An object groups related data together as key-value pairs.
// Think of it like a form: each field (key) has a value.

let person = {
    firstName: "John",    // key: "firstName", value: "John"
    lastName:  "Doe",
    age:       30,
    isStudent: false
};

// Two ways to READ a property:

// 1. Dot notation — clean, readable, most common
console.log(person.firstName);  // "John"

// 2. Bracket notation — use when the key is dynamic or contains spaces
console.log(person["age"]);     // 30

// Adding a NEW property — just assign it, no special syntax needed
person.country = "India";       // person now has a 'country' key

// Modifying an EXISTING property — same as adding, just overwrite
person.age = 31;                // age is now 31 instead of 30

// Note: even though 'person' is declared with const,
// you CAN still change its properties.
// const only prevents reassigning the variable itself (person = something_else).