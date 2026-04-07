/*
========================================================
📘 ARRAY.REDUCE() IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS reduce()?

reduce() is a HIGHER-ORDER FUNCTION that:
👉 Reduces an array to a SINGLE VALUE

Examples:
- Sum of numbers
- Total price
- Object building
- Frequency counting

========================================================
🔹 1. BASIC SYNTAX
========================================================

array.reduce((accumulator, currentValue) => {
    return updatedAccumulator;
}, initialValue)

👉 acc → accumulated result
👉 curr → current element

========================================================
🔹 2. SIMPLE EXAMPLE (YOUR CODE)
========================================================
*/

const myNums = [1, 2, 3];

/*
👉 Step-by-step breakdown:
Initial acc = 0

Iteration:
1 → acc = 0 + 1 = 1
2 → acc = 1 + 2 = 3
3 → acc = 3 + 3 = 6
*/

const myTotal = myNums.reduce((acc, curr) => acc + curr, 0);

console.log(myTotal); // 6


/*
========================================================
🔹 3. VISUAL EXECUTION FLOW (VERY IMPORTANT)
========================================================

Array: [1,2,3]

Step   acc   curr   result
--------------------------
1      0     1      1
2      1     2      3
3      3     3      6

Final Output → 6

========================================================
🔹 4. WITH CONSOLE DEBUG (BETTER UNDERSTANDING)
========================================================
*/

myNums.reduce(function (acc, currval) {
    console.log(`acc: ${acc} and currval: ${currval}`);
    return acc + currval;
}, 0);

/*
👉 Helps you understand internal flow
*/


/*
========================================================
🔹 5. REAL-WORLD EXAMPLE (SHOPPING CART)
========================================================
*/

const shoppingCart = [
    { itemName: "js course", price: 2999 },
    { itemName: "py course", price: 999 },
    { itemName: "mobile dev course", price: 5999 },
    { itemName: "data science course", price: 12999 }
];

/*
👉 Goal:
Calculate TOTAL price
*/

const priceToPay = shoppingCart.reduce(
    (acc, item) => acc + item.price,
    0
);

console.log(priceToPay); // 22996


/*
========================================================
🔹 6. WHY reduce() IS POWERFUL
========================================================

👉 It can replace:
- loops
- map + filter combinations
- complex aggregations

========================================================
🔹 7. ADVANCED USE CASES
========================================================

👉 Example 1: Count frequency
*/

const arr = ["a", "b", "a", "c", "b", "a"];

const freq = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
}, {});

console.log(freq);

/*
Output:
{ a: 3, b: 2, c: 1 }
*/


/*
👉 Example 2: Flatten array
*/

const nested = [[1,2], [3,4], [5]];

const flat = nested.reduce((acc, curr) => acc.concat(curr), []);

console.log(flat); // [1,2,3,4,5]


/*
========================================================
🔹 8. COMMON MISTAKES
========================================================

❌ Forgetting initial value

Example:
*/

[1,2,3].reduce((acc, curr) => acc + curr);

/*
👉 Works, but:
- acc starts from first element
- can cause bugs in complex cases

👉 Always use initial value:
*/


/*
========================================================
🔹 9. reduce vs map vs filter
========================================================

map:
- transforms → returns array

filter:
- selects → returns array

reduce:
- compresses → returns single value

========================================================
🔹 10. WHEN TO USE reduce()
========================================================

👉 Use reduce when:
- You need ONE final result
- Aggregation required
- Complex transformations

👉 Avoid when:
- Simple mapping → use map()
- Simple filtering → use filter()

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 reduce():
- Converts array → single value

🔥 PARAMETERS:
(accumulator, current)

🔥 MUST KNOW:
- Always provide initial value
- Understand flow deeply

🔥 REAL-WORLD:
- Total price
- Frequency count
- Data aggregation

========================================================
*/