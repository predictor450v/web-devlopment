/*
========================================================
📘 TRUTHY, FALSY, NULLISH & TERNARY (DEEP GUIDE)
========================================================

👉 WHY THIS TOPIC MATTERS?

- Used in almost EVERY real-world app
- Critical for:
  - Authentication checks
  - Form validation
  - Default values
  - Clean conditional logic

========================================================
🔹 1. TRUTHY vs FALSY VALUES
========================================================
*/

/*
👉 JavaScript converts values to boolean in conditions

if (value) → checks truthiness
*/

const userEmail = [];

/*
📌 IMPORTANT:
Empty array is TRUTHY
*/

if (userEmail) {
    console.log("Got user email");
} else {
    console.log("Don't have user email");
}

/*
👉 Output: "Got user email"

WHY?
[] → truthy

========================================================
🔹 2. LIST OF FALSY VALUES (MEMORIZE)
========================================================

false
0
-0
0n (BigInt zero)
"" (empty string)
null
undefined
NaN

👉 ONLY these are falsy
Everything else → truthy

========================================================
🔹 3. TRUTHY VALUES (COMMON CONFUSION)
========================================================

"0"        → truthy
"false"    → truthy
" "        → truthy (space)
[]         → truthy
{}         → truthy
function() → truthy

👉 VERY IMPORTANT FOR INTERVIEWS
*/


/*
========================================================
🔹 4. CHECKING EMPTY ARRAY
========================================================
*/

/*
❌ WRONG WAY:
if (userEmail) → doesn't check emptiness

✅ CORRECT WAY:
*/
if (userEmail.length === 0) {
    console.log("Array is empty");
}

/*
📌 THEORY:
- Arrays are objects → always truthy
- Must check length
*/


/*
========================================================
🔹 5. CHECKING EMPTY OBJECT
========================================================
*/

const emptyObj = {};

/*
📌 Object.keys(obj):
- Returns array of keys
*/
if (Object.keys(emptyObj).length === 0) {
    console.log("Object is empty");
}

/*
💡 FLOW:
{} → keys = []
[].length = 0 → empty

========================================================
🔹 6. NULLISH COALESCING OPERATOR (??)
========================================================

👉 Purpose:
Provide DEFAULT value ONLY when value is:
- null
- undefined

Syntax:
value ?? fallback
*/

let val1;

/*
Examples:
*/

val1 = 5 ?? 10;        // 5
val1 = null ?? 10;     // 10
val1 = undefined ?? 15; // 15

/*
👉 MULTIPLE chaining:
*/
val1 = null ?? 10 ?? 20;

console.log(val1); // 10

/*
📌 THEORY:
- Stops at FIRST non-null/undefined value

IMPORTANT DIFFERENCE:
*/


/*
========================================================
🔹 ?? vs || (VERY IMPORTANT)
========================================================
*/

let value;

/*
|| (OR operator):
- treats ALL falsy values as false
*/
value = 0 || 10;  // 10 ❌ (0 is ignored)

/*
?? (Nullish):
- only null/undefined
*/
value = 0 ?? 10;  // 0 ✅ (correct)

console.log(value);

/*
👉 USE ?? when:
- 0, "", false are VALID values

========================================================
🔹 7. TERNARY OPERATOR
========================================================

👉 Short form of if-else

Syntax:
condition ? true : false
*/

const iceTeaPrice = 100;

iceTeaPrice <= 80 
    ? console.log("less than 80") 
    : console.log("more than 80");

/*
📌 Equivalent to:

if (iceTeaPrice <= 80) {
    console.log("less than 80");
} else {
    console.log("more than 80");
}

========================================================
🔹 8. REAL-WORLD USE CASES
========================================================

👉 Default value:
*/

let username = null;

let displayName = username ?? "Guest";
console.log(displayName);

/*
👉 API response handling:
*/

let apiData = undefined;

let safeData = apiData ?? [];
console.log(safeData);

/*
👉 UI condition:
*/

let isLoggedIn = true;

isLoggedIn 
    ? console.log("Show dashboard") 
    : console.log("Show login");


/*
========================================================
🔹 9. COMMON MISTAKES
========================================================

❌ Assuming [] is falsy → WRONG
❌ Using || instead of ?? incorrectly
❌ Not checking array/object emptiness properly

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 FALSY VALUES:
false, 0, "", null, undefined, NaN

🔥 TRUTHY:
Everything else (including [] and {})

🔥 MUST KNOW:
- array → check .length
- object → check Object.keys()

🔥 IMPORTANT:
- ?? → null/undefined only
- || → all falsy values

🔥 TERNARY:
- shorthand if-else

========================================================
*/