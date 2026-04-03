/*
========================================================
📘 COMPLETE ARRAYS IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS AN ARRAY?
An array is a special object used to store multiple values 
in a single variable.

Example:
["apple", "banana", "cherry"]

👉 KEY CHARACTERISTICS:
- Ordered collection (maintains index)
- Zero-indexed (starts from 0)
- Can store mixed data types
- MUTABLE (unlike strings)

========================================================
🔹 1. CREATING ARRAYS
========================================================
*/

let fruits = ["apple", "banana", "cherry", "date"];

/*
📌 THEORY:
Index:   0        1          2         3
Value:  apple   banana    cherry    date
*/

console.log(fruits[0]); // apple
console.log(fruits[1]); // banana


/*
========================================================
🔹 2. MODIFYING ELEMENTS
========================================================
*/

/*
📌 Arrays are MUTABLE:
- You can directly change values using index
*/
fruits[1] = "blueberry";

console.log(fruits);

/*
💡 IMPORTANT:
- This changes original array (no copy created)
*/


/*
========================================================
🔹 3. ARRAY LENGTH
========================================================
*/

/*
📌 length:
- Returns total elements
- Also used for iteration
*/
console.log(fruits.length);

/*
💡 ADVANCED:
You can modify length:
*/
fruits.length = 3; // removes extra elements
console.log("After reducing length:", fruits);

// restoring
fruits.push("date");


/*
========================================================
🔹 4. CORE ARRAY METHODS (MUTATING vs NON-MUTATING)
========================================================

👉 MUTATING METHODS (change original array):
push, pop, shift, unshift, splice, reverse, sort

👉 NON-MUTATING METHODS (return new array):
slice, map, filter, concat

========================================================
*/


/*
---------------------------
📌 push() → ADD TO END
---------------------------
*/
fruits.push("elderberry");
console.log(fruits);

/*
Time Complexity: O(1)
*/


/*
---------------------------
📌 pop() → REMOVE LAST
---------------------------
*/
fruits.pop();
console.log(fruits);


/*
---------------------------
📌 unshift() → ADD TO START
---------------------------
*/
fruits.unshift("avocado");
console.log(fruits);

/*
⚠️ Costly (O(n)) → shifts all elements
*/


/*
---------------------------
📌 shift() → REMOVE FIRST
---------------------------
*/
fruits.shift();
console.log(fruits);


/*
---------------------------
📌 indexOf()
---------------------------
*/
console.log(fruits.indexOf("cherry"));

/*
Returns:
- index if found
- -1 if not found
*/


/*
---------------------------
📌 includes()
---------------------------
*/
console.log(fruits.includes("banana"));

/*
Returns true/false
Better for readability than indexOf
*/


/*
---------------------------
📌 slice(start, end)
---------------------------
*/
console.log(fruits.slice(1, 3));

/*
📌 THEORY:
- Does NOT modify original array
- End index is excluded

💡 Negative index allowed:
*/
console.log(fruits.slice(-2));


/*
---------------------------
📌 splice(start, deleteCount, newItem)
---------------------------
*/
fruits.splice(2, 1, "coconut");
console.log(fruits);

/*
📌 THEORY:
- Modifies original array
- Can:
  - remove
  - replace
  - insert

Examples:
*/
let arr = [1,2,3,4];
arr.splice(1,2); // remove 2 elements
console.log(arr); // [1,4]


/*
---------------------------
📌 reverse()
---------------------------
*/
fruits.reverse();
console.log(fruits);

/*
⚠️ Mutates original array
*/


/*
---------------------------
📌 sort()
---------------------------
*/
fruits.sort();
console.log(fruits);

/*
⚠️ IMPORTANT:
- Default sorting is STRING-based

Example problem:
*/
let nums = [10, 2, 5];
nums.sort();
console.log("Wrong sort:", nums); // [10,2,5]

/*
✅ Correct numeric sort:
*/
nums.sort((a, b) => a - b);
console.log("Correct sort:", nums);


/*
---------------------------
📌 join()
---------------------------
*/
console.log(fruits.join(", "));

/*
Converts array → string
*/


/*
---------------------------
📌 concat()
---------------------------
*/
let veggies = ["carrot", "potato"];
let food = fruits.concat(veggies);

console.log(food);

/*
Does NOT modify original array
*/


/*
========================================================
🔹 5. HIGH-ORDER FUNCTIONS (VERY IMPORTANT)
========================================================

👉 These are functional programming tools
👉 Used heavily in real-world + interviews

========================================================
*/


/*
---------------------------
📌 map()
---------------------------
*/

let upperFruits = fruits.map(item => item.toUpperCase());

console.log(upperFruits);

/*
📌 THEORY:
- Returns NEW array
- Same length as original

Example:
[1,2,3] → multiply by 2 → [2,4,6]
*/


/*
---------------------------
📌 filter()
---------------------------
*/

let longFruits = fruits.filter(item => item.length > 5);

console.log(longFruits);

/*
📌 THEORY:
- Returns subset
- Condition-based filtering
*/


/*
---------------------------
📌 find()
---------------------------
*/

let firstC = fruits.find(item => item.startsWith("c"));

console.log(firstC);

/*
📌 THEORY:
- Returns FIRST match
- Stops early (efficient)
*/


/*
---------------------------
📌 reduce() (MOST IMPORTANT)
---------------------------
*/

let numbers = [1, 2, 3, 4];

let total = numbers.reduce((acc, val) => acc + val, 0);

console.log(total);

/*
📌 THEORY:
- Reduces array → single value

Structure:
reduce((accumulator, currentValue) => {}, initialValue)

Example:
[1,2,3,4]
Step1: acc=0+1=1
Step2: 1+2=3
Step3: 3+3=6
Step4: 6+4=10
*/


/*
========================================================
🔹 6. LOOPING THROUGH ARRAYS
========================================================
*/


/*
---------------------------
📌 for loop (classic)
---------------------------
*/
console.log("Using for loop:");
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}


/*
---------------------------
📌 for...of (modern)
---------------------------
*/
console.log("Using for...of loop:");
for (let fruit of fruits) {
    console.log(fruit);
}


/*
---------------------------
📌 forEach()
---------------------------
*/
console.log("Using forEach loop:");
fruits.forEach((item, index) => {
    console.log(index, item);
});

/*
📌 DIFFERENCE:
- forEach cannot break/return
- for loop can control flow
*/


/*
========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 MUST KNOW:
- push, pop → stack operations
- shift, unshift → queue operations
- slice vs splice (VERY IMPORTANT)
- map, filter, reduce → functional core

🔥 MOST ASKED:
- Difference between map & forEach
- Reduce use cases
- Sorting numbers properly

🔥 CORE IDEA:
👉 Arrays are MUTABLE and POWERFUL
👉 Master high-order functions for real-world coding

========================================================
*/