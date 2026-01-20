console.log("hello world");


// =======================
// JavaScript Operators
// =======================

// 1. Arithmetic Operators
let a = 10, b = 3;
console.log(a + b); // Addition: 13
console.log(a - b); // Subtraction: 7
console.log(a * b); // Multiplication: 30
console.log(a / b); // Division: 3.333...
console.log(a % b); // Modulus (remainder): 1
console.log(a ** b); // Exponentiation: 10^3 = 1000
a++; // Increment
b--; // Decrement
console.log(a, b); // 11, 2

// 2. Assignment Operators
let x = 5;
x += 3; // x = x + 3 => 8
x -= 2; // x = x - 2 => 6
x *= 2; // x = x * 2 => 12
x /= 4; // x = x / 4 => 3
x %= 2; // x = x % 2 => 1
console.log(x);

// 3. Comparison Operators
let p = 10, q = "10";
console.log(p == q);  // true – loose equality (only value)
console.log(p === q); // false – strict equality (value + type)
console.log(p != q);  // false – loose inequality
console.log(p !== q); // true – strict inequality
console.log(p > 5);   // true
console.log(p < 15);  // true
console.log(p >= 10); // true
console.log(p <= 9);  // false

// 4. Logical Operators
let isTrue = true, isFalse = false;
console.log(isTrue && isFalse); // AND: false
console.log(isTrue || isFalse); // OR: true
console.log(!isTrue);           // NOT: false

// 5. Bitwise Operators (work at the binary level)
let m = 5, n = 3;
console.log(m & n); // AND: 1 (0101 & 0011 = 0001)
console.log(m | n); // OR: 7 (0101 | 0011 = 0111)
console.log(m ^ n); // XOR: 6 (0101 ^ 0011 = 0110)
console.log(~m);    // NOT: -6 (bitwise NOT)
console.log(m << 1); // Left shift: 10 (5 * 2)
console.log(m >> 1); // Right shift: 2 (5 / 2)

// 6. Type Operators
console.log(typeof "Hello"); // string
console.log(typeof 123);     // number

// =======================
// if-else statement
// =======================
let age = 18;
if (age >= 18) {
    console.log("You are eligible to vote.");
} else {
    console.log("You are not eligible to vote.");
}

// =======================
// if-else-if-else ladder
// =======================
let marks = 75;
if (marks >= 90) {
    console.log("Grade: A+");
} else if (marks >= 75) {
    console.log("Grade: A");
} else if (marks >= 60) {
    console.log("Grade: B");
} else if (marks >= 40) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// =======================
// Ternary Operator
// =======================
// Syntax: condition ? exprIfTrue : exprIfFalse

let score = 45;
let result = (score >= 40) ? "Pass" : "Fail";
console.log(result); // "Pass"
