// =======================
// Basic JavaScript Syntax
// =======================

// This is a single-line comment
/* This is a 
   multi-line comment */

// Every JS statement ends with a semicolon (optional, but good practice)
console.log("Hello, JavaScript!"); // Outputs text to the console

// =======================
// Types of Variables in JavaScript
// =======================

// 1. var – function-scoped (older way of declaring variables)
var x = 10;

// 2. let – block-scoped (preferred over var)
let y = 20;

// 3. const – block-scoped, but can't be reassigned
const z = 30;

// =======================
// Why 'let' is used over 'var'
// =======================

// 'var' is function-scoped, which can lead to bugs if used in blocks
// Example:
if (true) {
    var a = 100;
}
console.log(a); // 100 – 'a' is accessible outside the block

// Now using 'let'
if (true) {
    let b = 200;
    console.log(b); // Works fine
}
// console.log(b); // Error: b is not defined – 'let' is block-scoped

// =======================
// Variable Naming Rules
// =======================
// - Can contain letters, digits, $, and _
// - Must begin with a letter, $ or _
// - Cannot start with a number
// - Case-sensitive (name and Name are different)
// - Reserved keywords cannot be used (like `let`, `var`, `function`, etc.)

let userName = "John";   // valid
let _age = 25;           // valid
let $balance = 1000;     // valid
// let 1num = 5;         // invalid – cannot start with a number

// =======================
// Primitive Data Types
// =======================
// 1. Number
// 2. String
// 3. Boolean
// 4. Undefined
// 5. Null
// 6. Symbol (ES6)
// 7. BigInt (ES2020)

let num = 42;                     // Number
let name = "Alice";              // String
let isActive = true;             // Boolean
let something;                   // Undefined (not assigned yet)
let nothing = null;              // Null (intentional empty value)
let id = Symbol("id");           // Symbol (unique identifier)
let bigNum = 12345678901234567890n; // BigInt (for large integers)

// =======================
// typeof Function
// =======================
// Used to check the type of a value

console.log(typeof num);      // "number"
console.log(typeof name);     // "string"
console.log(typeof isActive); // "boolean"
console.log(typeof something);// "undefined"
console.log(typeof nothing);  // "object" (quirky behavior – this is a known bug in JS)
console.log(typeof id);       // "symbol"
console.log(typeof bigNum);   // "bigint"

// =======================
// Objects – Key-Value Pairs
// =======================

let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    isStudent: false
};

// Accessing object values
console.log(person.firstName);  // "John"
console.log(person["age"]);     // 30

// Adding a new property
person.country = "India";

// Modifying existing property
person.age = 31;


