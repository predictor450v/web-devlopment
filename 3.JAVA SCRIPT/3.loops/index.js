// =======================
// JavaScript Loops
// =======================

// Loops are used to execute a block of code repeatedly
// until a certain condition is met.

// =======================
// 1. for loop
// =======================

// Syntax: for(initialization; condition; increment/decrement)
console.log("Using for loop:");
for (let i = 1; i <= 5; i++) {
    console.log("Iteration:", i); // prints 1 to 5
}

// Best used when the number of iterations is known

// =======================
// 2. while loop
// =======================

// Syntax: while(condition)
// Executes the loop **as long as** the condition is true

console.log("\nUsing while loop:");
let j = 1;
while (j <= 5) {
    console.log("Count:", j);
    j++;
}

// Best used when you're not sure how many times you'll loop

// =======================
// 3. do...while loop
// =======================

// Syntax:
// do {
//   // block of code
// } while (condition);

// Executes the block **at least once**, even if the condition is false

console.log("\nUsing do...while loop:");
let k = 1;
do {
    console.log("Do while count:", k);
    k++;
} while (k <= 5);

// =======================
// 4. for...of loop
// =======================

// Used to loop through the **values** of iterable objects like arrays or strings

console.log("\nUsing for...of loop:");
let fruits = ["apple", "banana", "mango"];
for (let fruit of fruits) {
    console.log("Fruit:", fruit);
}

// Works best with arrays and strings

// =======================
// 5. for...in loop
// =======================

// Used to loop through the **keys/indexes** of an object or array

console.log("\nUsing for...in loop:");
let person = {
    name: "Alice",
    age: 25,
    city: "New York"
};

for (let key in person) {
    console.log(`${key} : ${person[key]}`);
}

// for...in is best for objects or when you need to access property names

// =======================
// Bonus: break and continue
// =======================

console.log("\nUsing break and continue:");

for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue; // Skip 3
    }
    if (i === 5) {
        break; // Stop loop at 5
    }
    console.log("Value:", i);
}

// Output: 1, 2, 4 (skips 3, stops before printing 5)

