/*
========================================================
📘 SWITCH STATEMENT IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS SWITCH?

Switch is used to handle multiple conditions 
based on a single value.

👉 Alternative to:
if-else-if ladder (when checking same variable repeatedly)

========================================================
🔹 1. BASIC SYNTAX
========================================================

switch (key) {
    case value1:
        // code
        break;

    case value2:
        // code
        break;

    default:
        // fallback
}

👉 key → value we are checking
👉 case → possible matches
👉 break → stops execution
👉 default → runs if no match

========================================================
🔹 2. YOUR EXAMPLE
========================================================
*/

const month = "march";

switch (month) {

    case "jan":
        console.log("January");
        break;

    case "feb":
        console.log("February");
        break;

    case "march":
        console.log("March");
        break;

    case "april":
        console.log("April");
        break;

    default:
        console.log("default case match");
        break;
}

/*
📌 FLOW:
month = "march"

Check:
"jan"   ❌
"feb"   ❌
"march" ✅ → executes → stops due to break

========================================================
🔹 3. VERY IMPORTANT: BREAK KEYWORD
========================================================

👉 break prevents FALL-THROUGH

Example WITHOUT break:
*/

const day = "monday";

switch (day) {
    case "monday":
        console.log("Monday");

    case "tuesday":
        console.log("Tuesday");

    case "wednesday":
        console.log("Wednesday");
}

/*
📌 OUTPUT:
Monday
Tuesday
Wednesday

👉 WHY?
- No break → execution continues to next cases

This is called:
🔥 FALL-THROUGH behavior
*/


/*
========================================================
🔹 4. WHEN TO USE SWITCH vs IF-ELSE
========================================================

👉 USE SWITCH WHEN:
- Comparing ONE variable with many values
- Cleaner and more readable

👉 USE IF-ELSE WHEN:
- Conditions are complex
- Using ranges (>, <, etc.)

Example:
*/

let score = 85;

/*
Better with if:
*/
if (score > 90) {
    console.log("A");
} else if (score > 75) {
    console.log("B");
}


/*
========================================================
🔹 5. STRICT COMPARISON (VERY IMPORTANT)
========================================================

👉 switch uses STRICT comparison (===)

Example:
*/

let value = 1;

switch (value) {
    case "1":
        console.log("string one");
        break;

    case 1:
        console.log("number one"); // ✅ this runs
        break;
}

/*
👉 No type conversion happens
*/


/*
========================================================
🔹 6. GROUPING CASES
========================================================

👉 Multiple cases → same output
*/

let fruit = "apple";

switch (fruit) {
    case "apple":
    case "mango":
    case "banana":
        console.log("This is a fruit");
        break;

    default:
        console.log("Unknown");
}

/*
📌 Useful when multiple values share same logic
*/


/*
========================================================
🔹 7. REAL-WORLD USE CASES
========================================================

👉 Example 1: Menu system
*/

let option = 2;

switch (option) {
    case 1:
        console.log("Login");
        break;
    case 2:
        console.log("Signup");
        break;
    case 3:
        console.log("Exit");
        break;
}

/*
👉 Example 2: Role-based system
*/

let role = "admin";

switch (role) {
    case "admin":
        console.log("Full access");
        break;
    case "user":
        console.log("Limited access");
        break;
    default:
        console.log("Guest");
}


/*
========================================================
🔹 8. COMMON MISTAKES
========================================================

❌ Forgetting break → causes fall-through
❌ Using switch for complex conditions
❌ Expecting type coercion (it uses ===)

========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 SWITCH:
- Used for multiple equality checks

🔥 MUST REMEMBER:
- Uses === (strict comparison)
- break prevents fall-through

🔥 USE WHEN:
- Same variable, multiple values

🔥 AVOID WHEN:
- Complex conditions (use if-else)

========================================================
*/