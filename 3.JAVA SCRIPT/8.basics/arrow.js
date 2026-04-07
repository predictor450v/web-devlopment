/*
========================================================
📘 JAVASCRIPT "this" + ARROW FUNCTIONS (DEEP GUIDE)
========================================================

👉 CORE IDEA:
"this" refers to the CURRENT EXECUTION CONTEXT

BUT ⚠️ its value depends on HOW a function is called,
NOT where it is written.

========================================================
🔹 1. "this" INSIDE OBJECT METHODS
========================================================
*/

const user = {
    username: "hitesh",
    price: 999,

    /*
    📌 Method inside object
    */
    welcomeMessage: function() {

        /*
        👉 "this" refers to the object that called it
        */
        console.log(`${this.username} , welcome to website`);

        console.log(this);
    }
};

/*
📌 Function call using object
*/
user.welcomeMessage();

/*
💡 If we change value:
*/
user.username = "sam";
user.welcomeMessage();

/*
👉 IMPORTANT:
- "this" refers to current object
- Works correctly ONLY in object methods
*/


/*
========================================================
🔹 2. "this" IN GLOBAL CONTEXT
========================================================
*/

/*
📌 In browser:
this → window object

📌 In Node.js:
this → {} (empty object)
*/
console.log(this);


/*
========================================================
🔹 3. "this" INSIDE NORMAL FUNCTION
========================================================
*/

function chai() {
    let username = "hitesh";

    /*
    📌 "this" DOES NOT refer to local variables
    */
    console.log(this.username); // undefined
}

chai();

/*
💡 WHY?
- "this" refers to global object
- NOT function scope variables
*/


/*
========================================================
🔹 4. FUNCTION EXPRESSION
========================================================
*/

const chai2 = function () {
    let username = "hitesh";
    console.log(this.username); // undefined
};

chai2();

/*
👉 SAME behavior as normal function
*/


/*
========================================================
🔹 5. ARROW FUNCTION (VERY IMPORTANT)
========================================================
*/

const chaiArrow = () => {
    let username = "hitesh";

    /*
    📌 Arrow functions DO NOT have their own "this"
    */
    console.log(this);
};

chaiArrow();

/*
========================================================
🔥 KEY THEORY (VERY IMPORTANT)
========================================================

Normal Function:
- Has its OWN "this"

Arrow Function:
- DOES NOT have its own "this"
- Takes "this" from surrounding (lexical scope)

This is called:
👉 LEXICAL THIS BINDING

========================================================
🔹 6. WHY ARROW FUNCTIONS ARE USED
========================================================

Example (Real-world problem):

const obj = {
    name: "Ayushman",
    greet: function() {
        setTimeout(function() {
            console.log(this.name); ❌ undefined
        }, 1000);
    }
};

👉 FIX using arrow function:
*/

const obj = {
    name: "Ayushman",
    greet: function() {
        setTimeout(() => {
            console.log(this.name); // ✅ correct
        }, 1000);
    }
};

obj.greet();

/*
💡 Because arrow function inherits "this" from parent (obj)
*/


/*
========================================================
🔹 7. ARROW FUNCTION SYNTAX VARIATIONS
========================================================
*/

/*
📌 NORMAL RETURN
*/
const addTwo1 = (num1, num2) => {
    return num1 + num2;
};

/*
📌 IMPLICIT RETURN (no return keyword)
*/
const addTwo2 = (num1, num2) => num1 + num2;

/*
📌 USING ()
*/
const addTwo3 = (num1, num2) => (num1 + num2);

console.log(addTwo1(2,3));
console.log(addTwo2(2,3));
console.log(addTwo3(2,3));


/*
========================================================
🔹 8. RETURNING OBJECT FROM ARROW FUNCTION
========================================================
*/

/*
⚠️ IMPORTANT RULE:
To return object → wrap in ()
*/

const addTwo = (num1, num2) => ({username: "hitesh"});

console.log(addTwo(3, 4));

/*
💡 WHY?
Without () → {} treated as function body
With () → treated as object
*/


/*
========================================================
🔹 9. ARROW FUNCTIONS IN ARRAYS
========================================================
*/

const myArray = [2, 5, 3, 7, 8];

/*
📌 forEach with arrow function
*/
myArray.forEach((num) => {
    console.log(num * 2);
});


/*
========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 "this" RULES:

1. Inside object → refers to object
2. Inside normal function → global (or undefined in strict mode)
3. Inside arrow function → inherited from parent

🔥 ARROW FUNCTION:
- No own "this"
- Short syntax
- Used heavily in React

🔥 MOST ASKED:
- Difference between arrow & normal function
- Why arrow functions don’t bind "this"
- Returning object from arrow function

🔥 REAL-WORLD:
- Event handlers
- setTimeout / async code
- Functional programming

========================================================
*/