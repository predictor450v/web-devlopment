/*
========================================================
📘 ARRAY.MAP() IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS map()?

map() is a HIGHER-ORDER FUNCTION that:
- Iterates over an array
- Applies a function to EACH element
- Returns a NEW array

👉 KEY POINT:
- Does NOT modify original array (non-mutating)

========================================================
🔹 1. BASIC SYNTAX
========================================================

array.map((element, index, array) => {
    return newValue;
});

========================================================
🔹 2. SIMPLE EXAMPLE
========================================================
*/

const numbers = [1, 2, 3, 4];

/*
👉 Multiply each element by 2
*/

const doubled = numbers.map((num) => {
    return num * 2;
});

console.log(doubled); // [2, 4, 6, 8]

/*
Original array unchanged:
*/
console.log(numbers); // [1, 2, 3, 4]


/*
========================================================
🔹 3. SHORT (IMPLICIT RETURN)
========================================================
*/

const squared = numbers.map(num => num * num);

console.log(squared); // [1, 4, 9, 16]


/*
========================================================
🔹 4. HOW map() WORKS (INTERNAL LOGIC)
========================================================

👉 Conceptually:

for each element:
    apply function
    store result in new array

Equivalent to:
*/

let result = [];

for (let i = 0; i < numbers.length; i++) {
    result.push(numbers[i] * 2);
}

console.log(result);

/*
👉 map() does this internally in a cleaner way
*/


/*
========================================================
🔹 5. USING INDEX PARAMETER
========================================================
*/

const indexed = numbers.map((num, index) => {
    return num + index;
});

console.log(indexed); // [1, 3, 5, 7]


/*
========================================================
🔹 6. ARRAY OF OBJECTS (VERY IMPORTANT)
========================================================
*/

const users = [
    { id: 1, name: "Ayushman" },
    { id: 2, name: "Rohan" },
    { id: 3, name: "Sam" }
];

/*
👉 Extract names
*/

const names = users.map(user => user.name);

console.log(names); // ["Ayushman", "Rohan", "Sam"]

/*
👉 Modify objects
*/

const updatedUsers = users.map(user => {
    return {
        ...user,
        isActive: true
    };
});

console.log(updatedUsers);


/*
========================================================
🔹 7. CHAINING (ADVANCED)
========================================================
*/

const resultChain = numbers
    .map(num => num * 2)     // [2,4,6,8]
    .map(num => num + 1);    // [3,5,7,9]

console.log(resultChain);

/*
👉 map() can be chained with other methods
*/


/*
========================================================
🔹 8. map() vs forEach() (INTERVIEW FAVORITE)
========================================================
*/

/*
📌 map():
- Returns new array
- Used for transformation

📌 forEach():
- Does NOT return anything
- Used for side effects
*/

const arr = [1, 2, 3];

const mapResult = arr.map(x => x * 2);
const forEachResult = arr.forEach(x => x * 2);

console.log(mapResult);     // [2, 4, 6]
console.log(forEachResult); // undefined


/*
========================================================
🔹 9. COMMON MISTAKES
========================================================

❌ Forgetting return:
*/

const wrong = numbers.map((num) => {
    num * 2; // no return
});

console.log(wrong); // [undefined, undefined, undefined, undefined]


/*
========================================================
🔹 10. REAL-WORLD USE CASES
========================================================

👉 UI rendering (React):
*/

const products = [
    { name: "Laptop", price: 50000 },
    { name: "Phone", price: 20000 }
];

const productNames = products.map(p => p.name);

console.log(productNames);

/*
👉 Data transformation (API response):
*/

const apiData = [
    { id: 1, score: 50 },
    { id: 2, score: 70 }
];

const updated = apiData.map(item => ({
    ...item,
    passed: item.score >= 60
}));

console.log(updated);


/*
========================================================
🔹 11. WHEN TO USE map()
========================================================

👉 Use map when:
- You want to transform data
- You need a NEW array
- Functional programming approach

👉 Do NOT use when:
- You only need side effects → use forEach()

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 map():
- Iterates array
- Returns NEW array
- Does NOT modify original

🔥 KEY:
- Always returns same length array
- Needs return statement

🔥 DIFFERENCE:
- map → transformation
- forEach → side effects

🔥 REAL-WORLD:
- React rendering
- API data processing

========================================================
*/