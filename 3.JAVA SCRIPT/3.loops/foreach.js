/*
========================================================
📘 forEach() IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS forEach()?

forEach() is an array method used to:
👉 Iterate over each element in an array

👉 KEY POINT:
- Executes a function for EACH element
- Does NOT return anything (very important)

========================================================
🔹 1. BASIC USAGE
========================================================
*/

const coding = ["js", "ruby", "java", "python", "cpp"];

/*
📌 Syntax:
array.forEach(function(element) {})
*/

coding.forEach(function (val) {
    console.log(val);
});

/*
👉 Output:
js
ruby
java
python
cpp
*/


/*
========================================================
🔹 2. USING ARROW FUNCTION (MODERN)
========================================================
*/

coding.forEach((item) => {
    console.log(item);
});

/*
👉 Cleaner and preferred in modern JS
*/


/*
========================================================
🔹 3. PASSING FUNCTION REFERENCE
========================================================
*/

function printMe(item) {
    console.log(item);
}

coding.forEach(printMe);

/*
📌 IMPORTANT:
- Don't call function → just pass reference
- forEach automatically calls it for each element
*/


/*
========================================================
🔹 4. ACCESS ALL PARAMETERS
========================================================
*/

coding.forEach((item, index, arr) => {
    console.log(item, index, arr);
});

/*
📌 PARAMETERS:
1. item  → current value
2. index → position
3. arr   → original array

Example:
js 0 [full array]
*/


/*
========================================================
🔹 5. ARRAY OF OBJECTS (VERY IMPORTANT)
========================================================
*/

const myCoding = [
    {
        languageName: "javascript",
        languageFileName: "js"
    },
    {
        languageName: "java",
        languageFileName: "java"
    },
    {
        languageName: "python",
        languageFileName: "py"
    }
];

/*
👉 Access object properties
*/

myCoding.forEach((item) => {
    console.log(item.languageName);
});

/*
👉 Output:
javascript
java
python

💡 VERY IMPORTANT:
- Common in API responses
- Used heavily in real-world apps
*/


/*
========================================================
🔹 6. HOW forEach WORKS INTERNALLY
========================================================

👉 Conceptually:

for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
}

👉 forEach is just a cleaner abstraction of loop
*/


/*
========================================================
🔹 7. VERY IMPORTANT LIMITATION
========================================================

❌ forEach DOES NOT return anything
*/

const result = coding.forEach((item) => {
    return item;
});

console.log(result); // undefined

/*
👉 WHY?
- It ignores return values
- Designed for side effects (logging, updates)

========================================================
🔹 8. forEach vs map (INTERVIEW FAVORITE)
========================================================

forEach:
- No return
- Used for side effects

map:
- Returns new array
- Used for transformation

Example:
*/

const nums = [1, 2, 3];

const res1 = nums.forEach(n => n * 2);
const res2 = nums.map(n => n * 2);

console.log(res1); // undefined
console.log(res2); // [2,4,6]


/*
========================================================
🔹 9. BREAK / CONTINUE ISSUE
========================================================

❌ You CANNOT break or continue in forEach
*/

coding.forEach((item) => {
    if (item === "java") return; // only skips this iteration
    console.log(item);
});

/*
👉 If you need break → use for loop or for...of
*/


/*
========================================================
🔹 10. REAL-WORLD USE CASES
========================================================

👉 Logging
👉 UI rendering
👉 Updating values
*/

const prices = [100, 200, 300];

prices.forEach((price, index) => {
    prices[index] = price + 10;
});

console.log(prices); // [110, 210, 310]


/*
========================================================
🔹 11. COMMON MISTAKES
========================================================

❌ Expecting return value
❌ Trying to break loop
❌ Using forEach for transformations

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 forEach:
- Iterates array
- No return value
- Used for side effects

🔥 PARAMETERS:
(item, index, array)

🔥 LIMITATIONS:
- No break/continue
- Cannot chain

🔥 USE WHEN:
- Logging
- Updating values
- Simple iteration

🔥 DO NOT USE WHEN:
- Need new array → use map()

========================================================
*/