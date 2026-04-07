/*
========================================================
📘 COMPLETE OBJECTS IN JAVASCRIPT (DEEP GUIDE)
========================================================

👉 WHAT IS AN OBJECT?
An object is a collection of key-value pairs.

Example:
{
    name: "Hitesh",
    age: 18
}

👉 KEY THEORY:
- Objects are reference types
- Stored in heap memory
- Mutable (can be changed)
- Keys are strings or Symbols

========================================================
🔹 1. OBJECT CREATION METHODS
========================================================
*/

/*
📌 METHOD 1: Object Literal (MOST COMMON)
*/
const JsUser = {};

/*
📌 METHOD 2: Constructor (Singleton object)
*/
const tinderUser = new Object();
// what is new?
// `new` creates an empty object and sets `this` to it, then returns `this`

/*
📌 METHOD 3: Object.create()
- Used for prototypal inheritance
- Advanced use case
*/
const protoObj = {
    greet: function () {
        console.log("Hello from prototype");
    }
};
const obj = Object.create(protoObj);

/*
========================================================
🔹 2. OBJECT WITH PROPERTIES
========================================================
*/

const mySym = Symbol("key1");

/*
📌 THEORY:
- Symbol is a UNIQUE key
- Used to avoid key conflicts
*/

const JsUserFull = {
    name: "Hitesh",

    /*
    📌 Special case:
    Keys with spaces must use quotes
    */
    "full name": "Hitesh Choudhary",

    /*
    📌 Symbol usage:
    Must use [] to access
    */
    [mySym]: "mykey1",

    age: 18,
    location: "Jaipur",
    email: "hitesh@google.com",
    isLoggedIn: false,

    /*
    📌 Arrays inside objects
    */
    lastLoginDays: ["Monday", "Saturday"]
};


/*
========================================================
🔹 3. ACCESSING OBJECT VALUES
========================================================
*/

/*
📌 Dot notation
*/
console.log(JsUserFull.email);

/*
📌 Bracket notation
- Required for:
  - keys with spaces
  - dynamic keys
*/
console.log(JsUserFull["email"]);
console.log(JsUserFull["full name"]);

/*
📌 Symbol access
*/
console.log(JsUserFull[mySym]);


/*
========================================================
🔹 4. MODIFYING OBJECTS
========================================================
*/

JsUserFull.email = "hitesh@chatgpt.com";

/*
📌 Object.freeze()
- Prevents any modification
*/
Object.freeze(JsUserFull);

JsUserFull.email = "hitesh@microsoft.com"; // ❌ ignored

console.log("After freeze:", JsUserFull);


/*
========================================================
🔹 5. ADDING METHODS (FUNCTIONS INSIDE OBJECT)
========================================================
*/

const user = {
    name: "Hitesh"
};

/*
📌 Method creation
*/
user.greeting = function () {
    console.log("Hello JS user");
};

/*
📌 'this' keyword:
- Refers to current object
*/
user.greetingTwo = function () {
    console.log(`Hello JS user, ${this.name}`);
};
// $ this is very important in OOP and React
// $ it allows methods to access other properties of the same object

console.log(user.greeting());
console.log(user.greetingTwo());


/*
========================================================
🔹 6. NESTED OBJECTS
========================================================
*/

const regularUser = {
    email: "some@gmail.com",
    fullname: {
        userfullname: {
            firstname: "hitesh",
            lastname: "choudhary"
        }
    }
};

/*
📌 Access deeply nested values
*/
console.log(regularUser.fullname.userfullname.firstname);


/*
========================================================
🔹 7. MERGING OBJECTS
========================================================
*/

const obj1 = {1: "a", 2: "b"};
const obj2 = {3: "a", 4: "b"};
const obj4 = {5: "a", 6: "b"};

/*
📌 METHOD 1: Object.assign()
*/
const merged1 = Object.assign({}, obj1, obj2, obj4);

/*
📌 METHOD 2: Spread operator (MOST USED)
*/
const merged2 = {...obj1, ...obj2};

console.log(merged2);

/*
💡 THEORY:
- Spread operator is cleaner and modern
*/


/*
========================================================
🔹 8. ARRAY OF OBJECTS (VERY IMPORTANT)
========================================================
*/

const users = [
    { id: 1, email: "h@gmail.com" },
    { id: 2, email: "x@gmail.com" },
    { id: 3, email: "y@gmail.com" }
];

/*
📌 Access:
*/
console.log(users[1].email);

/*
💡 REAL USE CASE:
- APIs return data in this format
*/


/*
========================================================
🔹 9. OBJECT UTILITY METHODS
========================================================
*/

console.log(Object.keys(tinderUser));   // keys
console.log(Object.values(tinderUser)); // values
console.log(Object.entries(tinderUser)); // key-value pairs

/*
📌 hasOwnProperty()
*/
console.log(tinderUser.hasOwnProperty('isLoggedIn'));


/*
========================================================
🔹 10. OBJECT DESTRUCTURING (VERY IMPORTANT)
========================================================
*/

const course = {
    coursename: "js in hindi",
    price: "999",
    courseInstructor: "hitesh"
};

/*
📌 Destructuring:
- Extract values easily
*/
const { courseInstructor: instructor } = course;

console.log(instructor);

/*
💡 WHY IMPORTANT?
- Used heavily in React, APIs
*/


/*
========================================================
🔹 11. JSON (REAL WORLD DATA FORMAT)
========================================================
*/

/*
📌 JSON:
- Looks like object but keys are always strings
- Used in APIs
*/

const jsonExample = {
    "name": "hitesh",
    "coursename": "js in hindi",
    "price": "free"
};

/*
📌 Array of JSON objects
*/
const jsonArray = [
    {},
    {},
    {}
];


/*
========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

🔥 CORE CONCEPTS:
- Objects = key-value pairs
- Mutable & reference type
- Use dot & bracket notation

🔥 MUST KNOW:
- this keyword
- destructuring
- Object.keys(), values(), entries()
- spread operator

🔥 MOST ASKED:
- Difference: object vs array
- shallow vs deep copy
- this behavior

🔥 REAL-WORLD:
- APIs → return array of objects
- React → uses destructuring heavily

========================================================
*/