// ============================================================
// PROTOTYPES, OBJECTS & FUNCTIONS — Complete Deep Dive
// ============================================================
// These three concepts are the CORE of JavaScript.
// Everything in JS is built on top of them.
//
// OBJECTS   — containers for data and behavior
// FUNCTIONS — first-class objects (can be stored, passed, returned)
// PROTOTYPES — JS's inheritance mechanism (how objects share behavior)
//
// Key insight most people miss:
//   Functions ARE objects in JS
//   Arrays ARE objects in JS
//   Classes ARE functions in JS
//   Everything (except primitives) IS an object in JS
//
// Understanding this file = understanding JavaScript at its core.


// ============================================================
// SECTION 1: OBJECTS — deep dive
// ============================================================
// An object is a collection of key-value pairs (properties).
// Keys are strings (or Symbols). Values can be anything.
// Objects are the fundamental data structure of JS.

// ── 4 ways to create objects ───────────────────────────────

// 1. Object literal (most common)
const obj1 = {
    name:  "Ayush",
    age:   21,
    greet() { return `Hi, I'm ${this.name}`; }
};

// 2. Object constructor (avoid — same as literal but verbose)
const obj2 = new Object();
obj2.name = "Ayush";
obj2.age  = 21;

// 3. Object.create(proto) — sets prototype explicitly
const personProto = {
    greet() { return `Hi, I'm ${this.name}`; },
    isAdult() { return this.age >= 18; }
};
const obj3 = Object.create(personProto);
obj3.name = "Ayush";
obj3.age  = 21;
// obj3 has NO own greet/isAdult — inherits from personProto

// 4. Constructor function with new (covered in Section 4)
function Person(name, age) {
    this.name = name;
    this.age  = age;
}
const obj4 = new Person("Ayush", 21);

// ── Property descriptors — the hidden metadata of every property ──
// Every property has a DESCRIPTOR — metadata controlling its behavior.
// Most people never see this but it controls EVERYTHING.

const user = { name: "Ayush", age: 21 };

// See the descriptor of a property
console.log(Object.getOwnPropertyDescriptor(user, "name"));
// {
//   value:        "Ayush",   ← the actual value
//   writable:     true,      ← can you change it?
//   enumerable:   true,      ← does it show in for...in and Object.keys?
//   configurable: true       ← can you delete or redefine it?
// }

// Define property with custom descriptor
Object.defineProperty(user, "id", {
    value:        42,
    writable:     false,  // cannot change — like a const property
    enumerable:   false,  // hidden from Object.keys, for...in, JSON.stringify
    configurable: false   // cannot delete or redefine
});

user.id = 99;               // silently fails (strict mode: TypeError)
console.log(user.id);       // 42 — unchanged
console.log(Object.keys(user)); // ["name", "age"] — id is hidden!

// Define multiple properties at once
Object.defineProperties(user, {
    firstName: {
        get() { return this.name.split(" ")[0]; },
        enumerable: true,
        configurable: true
    },
    score: {
        value: 100,
        writable: true,
        enumerable: true
    }
});

// ── Object.freeze() vs Object.seal() ──────────────────────
// freeze: cannot add, remove, or change ANY property
// seal:   cannot add or remove properties, but CAN change existing

const config = Object.freeze({
    apiUrl: "https://api.example.com",
    timeout: 5000
});
config.apiUrl  = "https://other.com"; // silently fails
config.newProp = "value";             // silently fails
console.log(config.apiUrl); // "https://api.example.com" — unchanged

const settings = Object.seal({
    theme: "dark",
    lang:  "en"
});
settings.theme   = "light";  // ✓ allowed — changing existing
settings.newProp = "value";  // ✗ silently fails — can't add
delete settings.theme;       // ✗ silently fails — can't remove
console.log(settings.theme); // "light" — changed ✓

// ── Object methods you must know ───────────────────────────

const product = {
    name:     "Laptop",
    price:    45000,
    category: "Electronics",
    inStock:  true
};

// Object.keys() — array of own enumerable property NAMES
console.log(Object.keys(product));
// ["name", "price", "category", "inStock"]

// Object.values() — array of own enumerable property VALUES
console.log(Object.values(product));
// ["Laptop", 45000, "Electronics", true]

// Object.entries() — array of [key, value] pairs
console.log(Object.entries(product));
// [["name","Laptop"], ["price",45000], ["category","Electronics"], ["inStock",true]]

// Converting back from entries to object
const doubled = Object.fromEntries(
    Object.entries(product)
        .map(([key, val]) => [key, typeof val === "number" ? val * 2 : val])
);
console.log(doubled.price); // 90000

// Object.assign(target, ...sources) — shallow merge/copy
const defaults  = { theme: "light", lang: "en",  timeout: 3000 };
const userPrefs = { theme: "dark",  lang: "hi" };
const merged    = Object.assign({}, defaults, userPrefs);
// {} ← target (new object), then copy defaults, then userPrefs (overwrites)
console.log(merged);
// { theme: "dark", lang: "hi", timeout: 3000 }

// Spread operator — cleaner version of Object.assign
const merged2 = { ...defaults, ...userPrefs };
console.log(merged2); // same result

// Object.assign is SHALLOW — nested objects are still shared!
const original = { a: 1, nested: { b: 2 } };
const copy     = Object.assign({}, original);
copy.a          = 99;     // doesn't affect original
copy.nested.b   = 99;     // DOES affect original — same reference!
console.log(original.a);        // 1 ✓
console.log(original.nested.b); // 99 — shared reference!

// Deep copy solution (simple cases)
const deepCopy = JSON.parse(JSON.stringify(original));
// Limitation: doesn't work with functions, undefined, Date, etc.

// Deep copy with structuredClone (modern, recommended)
const deepCopy2 = structuredClone(original);
deepCopy2.nested.b = 999;
console.log(original.nested.b); // 99 — unaffected ✓

// Object.hasOwn(obj, key) — modern replacement for hasOwnProperty
console.log(Object.hasOwn(product, "name"));     // true
console.log(Object.hasOwn(product, "toString")); // false — on prototype

// Optional chaining — safe property access
const data = { user: { address: { city: "Kolkata" } } };
console.log(data?.user?.address?.city);    // "Kolkata"
console.log(data?.order?.items?.length);   // undefined — no crash!
// Without optional chaining: data.order.items.length → TypeError

// Nullish coalescing — default only for null/undefined (not 0 or "")
const port = data?.config?.port ?? 3000; // 3000 (config is undefined)
const name2 = "" ?? "default";           // "" (empty string is NOT null/undefined)
const name3 = "" || "default";           // "default" (|| treats "" as falsy)


// ============================================================
// SECTION 2: FUNCTIONS — first-class citizens
// ============================================================
// Functions in JS are OBJECTS.
// They can be: stored in variables, passed as arguments,
// returned from other functions, have properties of their own.
// This is what "first-class functions" means.

// ── 5 ways to define functions ─────────────────────────────

// 1. Function Declaration — HOISTED, has own 'this'
function add(a, b) { return a + b; }

// 2. Function Expression — NOT hoisted, has own 'this'
const subtract = function(a, b) { return a - b; };

// 3. Arrow Function — NOT hoisted, NO own 'this' (inherits)
const multiply = (a, b) => a * b;

// 4. Method shorthand (inside object/class)
const math = {
    divide(a, b) { return a / b; }  // shorthand
};

// 5. Constructor Function (used with new)
function Circle(radius) {
    this.radius = radius;
    this.area   = Math.PI * radius ** 2;
}

// ── Functions ARE objects — proof ──────────────────────────
function greet(name) {
    return `Hello, ${name}`;
}

// Functions have properties (they're objects)
console.log(greet.name);   // "greet" — the function's name
console.log(greet.length); // 1 — number of declared parameters

// You can add properties to functions
greet.callCount = 0;
const originalGreet = greet;
// Wrap to track calls
const trackedGreet = function(name) {
    trackedGreet.callCount++;
    return greet(name);
};
trackedGreet.callCount = 0;
trackedGreet("Ayush");
trackedGreet("Alice");
console.log(trackedGreet.callCount); // 2

// Functions have a prototype property (used in OOP)
console.log(typeof greet.prototype); // "object"

// ── Higher Order Functions (HOF) ───────────────────────────
// A function that takes a function as argument OR returns a function.
// The foundation of functional programming in JS.

// Takes a function as argument
function applyTwice(fn, value) {
    return fn(fn(value));
}
const double = x => x * 2;
console.log(applyTwice(double, 3)); // 12 (3→6→12)

// Returns a function — CLOSURE (covered in next section)
function multiplier(factor) {
    return function(number) {
        return number * factor; // 'factor' remembered via closure
    };
}
const triple  = multiplier(3);
const tenX    = multiplier(10);
console.log(triple(5));  // 15
console.log(tenX(5));    // 50

// ── IIFE — Immediately Invoked Function Expression ──────────
// Runs immediately when defined. Creates its own scope.
// Used to avoid polluting global scope.
// Very common in older code — still seen in interviews.

(function() {
    const privateVar = "I'm private";
    console.log("IIFE ran!");
    // privateVar is NOT accessible outside
})();
// console.log(privateVar); // ReferenceError ✓

// IIFE with arrow function
(() => {
    console.log("Arrow IIFE!");
})();

// IIFE with parameters
(function(name, year) {
    console.log(`Hello ${name}, welcome to ${year}`);
})("Ayush", 2024);

// IIFE with return value
const result = (function() {
    const x = 10;
    const y = 20;
    return x + y; // capture the returned value
})();
console.log(result); // 30

// ── Pure functions vs Impure functions ─────────────────────
// Pure: same input → always same output, no side effects
// Impure: depends on or modifies external state

let total = 0;

// Impure — modifies external state
function addToTotal(n) {
    total += n; // side effect — changes outside variable
    return total; // result depends on previous calls
}
console.log(addToTotal(5)); // 5
console.log(addToTotal(5)); // 10 — same input, different output!

// Pure — no side effects, predictable
function pureAdd(current, n) {
    return current + n; // only uses its parameters
}
console.log(pureAdd(0, 5)); // 5 — always
console.log(pureAdd(0, 5)); // 5 — always (same input = same output)

// ── Function composition ───────────────────────────────────
// Combining simple functions to build complex ones
// Output of one function becomes input of next

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
// pipe takes functions, returns a function that passes value through each

const processName = pipe(
    str => str.trim(),           // remove whitespace
    str => str.toLowerCase(),    // to lowercase
    str => str.replace(/ /g, "_"), // spaces to underscores
    str => `user_${str}`         // add prefix
);

console.log(processName("  Ayush Kumar  ")); // "user_ayush_kumar"


// ============================================================
// SECTION 3: CLOSURES — functions remembering their birth scope
// ============================================================
// A closure is when a FUNCTION remembers variables from its
// OUTER SCOPE even after that outer function has finished running.
//
// Every function in JS IS a closure — it always has access to:
//   1. Its own local variables
//   2. Variables in its outer function(s)
//   3. Global variables
//
// The inner function doesn't COPY the variable — it holds a
// LIVE REFERENCE to it. Changes are reflected.

// Basic closure
function outer() {
    const secret = "I am remembered"; // lives in outer's scope

    return function inner() {
        // inner() closes over 'secret' — remembers it
        console.log(secret); // accessible even after outer() finishes
    };
}
const innerFn = outer(); // outer() returns inner, outer() is done
innerFn(); // "I am remembered" — secret is still alive in closure!

// ── Closure with mutable state ─────────────────────────────
function makeCounter(start = 0) {
    let count = start; // private — no one outside can touch this directly

    return {
        increment() { return ++count; },
        decrement() { return --count; },
        reset()     { count = start; return count; },
        getCount()  { return count; },
    };
}

const counter1 = makeCounter(0);
const counter2 = makeCounter(100); // separate closure, separate state

counter1.increment(); // 1
counter1.increment(); // 2
counter1.increment(); // 3
counter2.increment(); // 101 — completely independent!

console.log(counter1.getCount()); // 3
console.log(counter2.getCount()); // 101

// counter1.count is undefined — truly private via closure ✓

// ── Closure factory — generating specialized functions ──────
function makeValidator(min, max) {
    return function validate(value) {
        if (value < min) return `Too small — minimum is ${min}`;
        if (value > max) return `Too large — maximum is ${max}`;
        return `${value} is valid`;
    };
}

const validateAge      = makeValidator(0, 150);
const validateScore    = makeValidator(0, 100);
const validateQuantity = makeValidator(1, 999);

console.log(validateAge(25));      // "25 is valid"
console.log(validateAge(200));     // "Too large — maximum is 150"
console.log(validateScore(-5));    // "Too small — minimum is 0"
console.log(validateQuantity(500)); // "500 is valid"

// ── The classic closure loop bug (interview question!) ───────
// What does this print?
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 3, 3, 3 — NOT 0, 1, 2!
    }, 1000);
}
// WHY? var is function-scoped. All 3 callbacks share the SAME 'i'.
// By the time they run, the loop is done and i = 3.

// FIX 1: use let (block-scoped — each iteration gets its OWN 'i')
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2 ✓ — each iteration's own closure
    }, 1000);
}

// FIX 2: IIFE to capture current 'i'
for (var i = 0; i < 3; i++) {
    (function(currentI) {
        setTimeout(function() {
            console.log(currentI); // 0, 1, 2 ✓
        }, 1000);
    })(i); // pass current i as argument — creates new scope
}

// ── Closure for memoization (caching) ──────────────────────
function memoize(fn) {
    const cache = {}; // closed over — persists between calls

    return function(...args) {
        const key = JSON.stringify(args);

        if (key in cache) {
            console.log("Cache hit!");
            return cache[key]; // return cached result
        }

        console.log("Computing...");
        const result = fn(...args);
        cache[key] = result; // store in cache
        return result;
    };
}

function expensiveCalc(n) {
    // Simulating slow computation
    let result = 0;
    for (let i = 0; i <= n; i++) result += i;
    return result;
}

const fastCalc = memoize(expensiveCalc);
console.log(fastCalc(1000)); // "Computing..." 500500
console.log(fastCalc(1000)); // "Cache hit!" 500500 — instant!
console.log(fastCalc(2000)); // "Computing..." 2001000
console.log(fastCalc(2000)); // "Cache hit!" 2001000 — instant!


// ============================================================
// SECTION 4: CONSTRUCTOR FUNCTIONS — before classes existed
// ============================================================
// Constructor functions are regular functions used with 'new'.
// Convention: start with capital letter (Person, not person).
// This is how OOP was done in JS before ES6 classes.
// Classes compile DOWN to this — understanding it = understanding classes.

function PersonFn(firstName, lastName, age) {
    // 'this' = the new empty object 'new' created
    this.firstName = firstName;
    this.lastName  = lastName;
    this.age       = age;

    // DO NOT put methods here — each instance gets its OWN copy (memory waste)
    // this.greet = function() {} ← BAD — 1000 persons = 1000 greet copies
}

// Methods go on prototype — SHARED by all instances
PersonFn.prototype.greet = function() {
    return `Hi, I'm ${this.firstName} ${this.lastName}`;
};

PersonFn.prototype.isAdult = function() {
    return this.age >= 18;
};

PersonFn.prototype.toString = function() {
    return `Person(${this.firstName}, ${this.age})`;
};

// Create instances
const p1 = new PersonFn("Ayush", "Kumar", 21);
const p2 = new PersonFn("Alice", "Smith", 16);

console.log(p1.greet());     // "Hi, I'm Ayush Kumar"
console.log(p2.isAdult());   // false

// Proof methods are shared (not copied):
console.log(p1.greet === p2.greet); // true — exact same function!

// Own vs inherited properties
console.log(p1.hasOwnProperty("firstName")); // true — own
console.log(p1.hasOwnProperty("greet"));     // false — on prototype

// ── What 'new' does — step by step ─────────────────────────
// new PersonFn("Ayush", "Kumar", 21) does exactly this:

function simulateNew(Constructor, ...args) {
    // Step 1: Create empty object
    const obj = {};

    // Step 2: Set its [[Prototype]] to Constructor.prototype
    Object.setPrototypeOf(obj, Constructor.prototype);
    // same as: obj.__proto__ = Constructor.prototype

    // Step 3: Call Constructor with this = obj
    const returned = Constructor.apply(obj, args);

    // Step 4: Return the object
    // (unless constructor explicitly returned a different object)
    return returned instanceof Object ? returned : obj;
}

const p3 = simulateNew(PersonFn, "Bob", "Jones", 30);
console.log(p3.greet()); // "Hi, I'm Bob Jones" ✓
console.log(p3 instanceof PersonFn); // true ✓

// ── Prototype-based inheritance with constructor functions ──
// This is what ES6 classes compile to under the hood

function StudentFn(firstName, lastName, age, course) {
    // Call parent constructor to set parent properties
    PersonFn.call(this, firstName, lastName, age); // like super()
    this.course = course;
    this.grades = [];
}

// Set up inheritance chain — StudentFn.prototype inherits from PersonFn.prototype
StudentFn.prototype = Object.create(PersonFn.prototype);

// Fix the constructor property (Object.create breaks it)
StudentFn.prototype.constructor = StudentFn;

// Add Student-specific methods
StudentFn.prototype.addGrade = function(grade) {
    this.grades.push(grade);
};

StudentFn.prototype.getAverage = function() {
    if (!this.grades.length) return 0;
    return this.grades.reduce((a, b) => a + b, 0) / this.grades.length;
};

// Override parent method
StudentFn.prototype.greet = function() {
    // Call parent's greet using PersonFn.prototype.greet.call(this)
    const parentGreet = PersonFn.prototype.greet.call(this);
    return `${parentGreet}, studying ${this.course}`;
};

const student = new StudentFn("Ayush", "Kumar", 21, "Computer Science");
console.log(student.greet());     // "Hi, I'm Ayush Kumar, studying Computer Science"
console.log(student.isAdult());   // true — inherited from PersonFn.prototype
student.addGrade(85);
student.addGrade(92);
console.log(student.getAverage()); // 88.5

console.log(student instanceof StudentFn); // true
console.log(student instanceof PersonFn);  // true ✓


// ============================================================
// SECTION 5: PROTOTYPE CHAIN — complete deep dive
// ============================================================
// The prototype chain is the mechanism behind ALL inheritance in JS.
// Every object has [[Prototype]] — a hidden link to another object.
// Property lookup walks this chain until found or null reached.

// Complete prototype chain visualization:
//
// student (instance)
//   .firstName = "Ayush"     ← own property
//   .course = "CS"           ← own property
//   [[Prototype]] ──────────► StudentFn.prototype
//                               .addGrade = fn
//                               .getAverage = fn
//                               .greet = fn (override)
//                               [[Prototype]] ──► PersonFn.prototype
//                                                   .greet = fn
//                                                   .isAdult = fn
//                                                   [[Prototype]] ──► Object.prototype
//                                                                       .toString = fn
//                                                                       .hasOwnProperty = fn
//                                                                       .valueOf = fn
//                                                                       [[Prototype]] ──► null

// Walking the chain manually:
console.log(Object.getPrototypeOf(student) === StudentFn.prototype); // true
console.log(Object.getPrototypeOf(StudentFn.prototype) === PersonFn.prototype); // true
console.log(Object.getPrototypeOf(PersonFn.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of chain

// Property lookup order:
// student.greet → found on StudentFn.prototype → STOP, use it
// student.isAdult → NOT on student, NOT on StudentFn.proto → found on PersonFn.proto
// student.toString → walks all the way to Object.prototype

// Checking where a property lives:
function whereIs(obj, prop) {
    let current = obj;
    while (current !== null) {
        if (Object.hasOwn(current, prop)) {
            const label = current === obj ? "own" : Object.constructor?.name || "prototype";
            return `'${prop}' found on: ${current === obj ? "the object itself" : current.constructor?.name + ".prototype"}`;
        }
        current = Object.getPrototypeOf(current);
    }
    return `'${prop}' not found in chain`;
}

console.log(whereIs(student, "firstName")); // own
console.log(whereIs(student, "addGrade"));  // StudentFn.prototype
console.log(whereIs(student, "isAdult"));   // PersonFn.prototype
console.log(whereIs(student, "toString"));  // Object.prototype

// ── Shadowing — instance property overrides prototype ───────
// When instance has same property name as prototype — instance wins

PersonFn.prototype.species = "Human"; // on prototype

const p4 = new PersonFn("Dan", "Lee", 40);
console.log(p4.species); // "Human" — from prototype

p4.species = "Alien"; // creates OWN property on p4 — shadows prototype
console.log(p4.species); // "Alien" — own property wins

delete p4.species; // remove own property
console.log(p4.species); // "Human" — prototype visible again

// ── Extending built-in prototypes (don't do in production!) ─
// You CAN add to built-in prototypes but it's dangerous
// (conflicts with future JS additions, confuses others)
// Understanding it helps you understand how toString etc. work

// How Array.prototype works
const arr = [1, 2, 3];
// arr.map exists because:
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
// map is on Array.prototype — all arrays share it

// All prototype chains end at Object.prototype:
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Function.prototype) === Object.prototype); // true


// ============================================================
// SECTION 6: FUNCTIONS AS OBJECTS — deep dive
// ============================================================
// Functions have their own prototype chain:
//
// myFn (function object)
//   .name = "myFn"
//   .length = paramCount
//   .prototype = { constructor: myFn } ← for use with 'new'
//   [[Prototype]] ──► Function.prototype
//                       .call = fn
//                       .apply = fn
//                       .bind = fn
//                       [[Prototype]] ──► Object.prototype

function myFn(a, b, c) { return a + b + c; }

// Function own properties
console.log(myFn.name);     // "myFn"
console.log(myFn.length);   // 3 — number of parameters

// Function prototype chain
console.log(Object.getPrototypeOf(myFn) === Function.prototype); // true
// This is why myFn.call, myFn.apply, myFn.bind all work!
// They're inherited from Function.prototype

// myFn.prototype — different from [[Prototype]]!
// myFn.prototype is used when myFn is used as a CONSTRUCTOR
console.log(myFn.prototype); // { constructor: myFn }
// When you do: new myFn() → the instance's [[Prototype]] = myFn.prototype

// Arrow functions have NO prototype property:
const arrowFn = () => {};
console.log(arrowFn.prototype); // undefined — can't use as constructor
// new arrowFn() ← TypeError: arrowFn is not a constructor

// ── call, apply, bind — manual 'this' control ─────────────
function describe(city, country) {
    return `${this.name} (${this.age}) lives in ${city}, ${country}`;
}

const personA = { name: "Ayush", age: 21 };
const personB = { name: "Alice", age: 25 };

// call — invoke immediately, args passed separately
console.log(describe.call(personA, "Kolkata", "India"));
// "Ayush (21) lives in Kolkata, India"

// apply — invoke immediately, args passed as array
console.log(describe.apply(personB, ["London", "UK"]));
// "Alice (25) lives in London, UK"

// bind — returns NEW function with 'this' permanently bound
const describeAyush = describe.bind(personA);
console.log(describeAyush("Kolkata", "India")); // always personA
console.log(describeAyush("Mumbai", "India"));  // still personA

// Partial application with bind — pre-fill some arguments
const describeAyushIndia = describe.bind(personA, "Kolkata");
console.log(describeAyushIndia("India"));   // city already set!
console.log(describeAyushIndia("Germany")); // just change country

// ── Implementing call, apply, bind from scratch ─────────────
// This reveals how they actually work internally

// Custom call implementation
Function.prototype.myCall = function(context, ...args) {
    // 'this' here = the function being called (describe)
    context = context || globalThis;
    const sym = Symbol(); // unique key — avoid overwriting existing props
    context[sym] = this;  // temporarily attach function to context object
    const result = context[sym](...args); // call it (now 'this' = context)
    delete context[sym];  // clean up
    return result;
};

console.log(describe.myCall(personA, "Kolkata", "India")); // works! ✓

// Custom apply implementation
Function.prototype.myApply = function(context, args = []) {
    context = context || globalThis;
    const sym = Symbol();
    context[sym] = this;
    const result = context[sym](...args); // spread the args array
    delete context[sym];
    return result;
};

console.log(describe.myApply(personB, ["London", "UK"])); // works! ✓

// Custom bind implementation
Function.prototype.myBind = function(context, ...presetArgs) {
    const fn = this; // the original function
    return function(...laterArgs) {
        // Merge preset args with later args
        return fn.apply(context, [...presetArgs, ...laterArgs]);
    };
};

const boundDescribe = describe.myBind(personA, "Kolkata");
console.log(boundDescribe("India")); // works! ✓


// ============================================================
// SECTION 7: Object.create() — explicit prototype control
// ============================================================
// Object.create(proto) creates an object whose [[Prototype]] = proto
// The purest, most direct way to set up prototype chains
// No constructor function needed — just objects linking to objects

// Creating a prototype chain with just objects
const vehicleProto = {
    describe() {
        return `${this.brand} ${this.model}, ${this.year}`;
    },
    start() {
        this.running = true;
        return `${this.brand} started`;
    },
    stop() {
        this.running = false;
        return `${this.brand} stopped`;
    }
};

const carProto = Object.create(vehicleProto); // carProto inherits from vehicleProto
carProto.refuel = function(amount) {
    this.fuel += amount;
    return `Refueled ${amount}L. Total: ${this.fuel}L`;
};
carProto.drive = function(km) {
    this.fuel -= km * 0.08;
    return `Drove ${km}km. Fuel: ${this.fuel.toFixed(1)}L`;
};

// Create a specific car — inherits from carProto
function createCar(brand, model, year, fuel) {
    const car = Object.create(carProto); // [[Prototype]] = carProto
    car.brand   = brand;
    car.model   = model;
    car.year    = year;
    car.fuel    = fuel;
    car.running = false;
    return car;
}

const myCar = createCar("Toyota", "Camry", 2022, 40);

console.log(myCar.describe()); // inherited from vehicleProto (2 levels up!)
console.log(myCar.start());    // inherited from vehicleProto
console.log(myCar.refuel(20)); // inherited from carProto
console.log(myCar.drive(100)); // inherited from carProto

// Chain: myCar → carProto → vehicleProto → Object.prototype → null
console.log(Object.getPrototypeOf(myCar) === carProto); // true
console.log(Object.getPrototypeOf(carProto) === vehicleProto); // true

// ── Object.create(null) — object with NO prototype ──────────
// Creates a truly empty object — no toString, no hasOwnProperty, nothing
const pureDict = Object.create(null);
pureDict["name"] = "Ayush";
pureDict["age"]  = 21;
// Object.getPrototypeOf(pureDict) === null
// pureDict.toString() ← TypeError — no prototype chain!
// Use for: hash maps where keys shouldn't clash with built-in methods
// Faster lookups too — no prototype chain to walk

// Risk with regular objects as dict:
const regularDict = {};
regularDict["constructor"] = "my value"; // overwrites Object.prototype.constructor!
// This can cause subtle bugs — use Object.create(null) for pure dicts


// ============================================================
// SECTION 8: ES6 CLASSES vs CONSTRUCTOR FUNCTIONS — side by side
// ============================================================
// They produce IDENTICAL results. Classes are 100% syntactic sugar.

// Constructor function approach:
function AnimalFn(name, sound) {
    this.name  = name;
    this.sound = sound;
}
AnimalFn.prototype.speak  = function() { return `${this.name}: ${this.sound}`; };
AnimalFn.prototype.eat    = function(food) { return `${this.name} eats ${food}`; };
AnimalFn.create           = function(name, sound) { return new AnimalFn(name, sound); }; // static

function DogFn(name, breed) {
    AnimalFn.call(this, name, "Woof");
    this.breed = breed;
}
DogFn.prototype = Object.create(AnimalFn.prototype);
DogFn.prototype.constructor = DogFn;
DogFn.prototype.fetch = function(item) { return `${this.name} fetches ${item}`; };
DogFn.prototype.speak = function() {
    return AnimalFn.prototype.speak.call(this) + " (wag wag)";
};

// ES6 Class approach — identical behavior, cleaner syntax:
class AnimalClass {
    constructor(name, sound) {
        this.name  = name;
        this.sound = sound;
    }
    speak() { return `${this.name}: ${this.sound}`; }
    eat(food) { return `${this.name} eats ${food}`; }
    static create(name, sound) { return new AnimalClass(name, sound); }
}

class DogClass extends AnimalClass {
    constructor(name, breed) {
        super(name, "Woof"); // = AnimalFn.call(this, name, "Woof")
        this.breed = breed;
    }
    fetch(item) { return `${this.name} fetches ${item}`; }
    speak() { return super.speak() + " (wag wag)"; }
}

// Proof they're identical:
const dog1 = new DogFn("Rex", "Lab");
const dog2 = new DogClass("Rex", "Lab");

console.log(dog1.speak()); // "Rex: Woof (wag wag)"
console.log(dog2.speak()); // "Rex: Woof (wag wag)" — same!

// Classes are functions:
console.log(typeof AnimalClass);   // "function" — not "class"!
console.log(typeof AnimalFn);      // "function"

// The only real differences:
// 1. Classes MUST be called with 'new' — AnimalClass() ← TypeError
//    Functions without 'new' just run normally
// 2. Class methods are non-enumerable by default
//    Constructor function prototype methods ARE enumerable
// 3. Classes have a Temporal Dead Zone (like let/const)
//    Function declarations are hoisted


// ============================================================
// SECTION 9: OBJECT PATTERNS — real world usage
// ============================================================

// ── Module pattern using closure ───────────────────────────
// Expose public API, hide private implementation
const UserModule = (function() {
    // Private — not accessible from outside
    const users = [];
    let nextId = 1;

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Public API — returned object
    return {
        addUser(name, email) {
            if (!validateEmail(email)) throw new Error("Invalid email");
            const user = { id: nextId++, name, email };
            users.push(user);
            return user;
        },
        findById(id) {
            return users.find(u => u.id === id) || null;
        },
        findByEmail(email) {
            return users.find(u => u.email === email) || null;
        },
        getAll() {
            return [...users]; // return COPY — prevent external mutation
        },
        get count() {
            return users.length;
        }
    };
})(); // IIFE — runs immediately

UserModule.addUser("Ayush", "ayush@example.com");
UserModule.addUser("Alice", "alice@example.com");
console.log(UserModule.count);        // 2
console.log(UserModule.getAll());     // [{id:1,...}, {id:2,...}]
// UserModule.users    ← undefined — private!
// UserModule.nextId   ← undefined — private!

// ── Prototype extension pattern ────────────────────────────
// Adding methods to existing prototypes (careful in prod!)
// Understanding this reveals how Array methods work

// How .last and .first would work if added to Array.prototype
Array.prototype.first = function() { return this[0]; };
Array.prototype.last  = function() { return this[this.length - 1]; };
Array.prototype.sum   = function() { return this.reduce((a, b) => a + b, 0); };
Array.prototype.avg   = function() { return this.sum() / this.length; };

const nums = [10, 20, 30, 40, 50];
console.log(nums.first()); // 10
console.log(nums.last());  // 50
console.log(nums.sum());   // 150
console.log(nums.avg());   // 30
// These work because the instance (nums) inherits from Array.prototype

// ── Object composition (prefer over deep inheritance) ───────
// Instead of: GuideDog extends TrainedDog extends Dog extends Animal
// Compose behaviors as simple objects and mix them in

const canSwim = (state) => ({
    swim: () => `${state.name} swims!`
});

const canFly = (state) => ({
    fly: () => `${state.name} flies!`
});

const canBark = (state) => ({
    bark: () => `${state.name} barks: Woof!`
});

const canFetch = (state) => ({
    fetch: (item) => `${state.name} fetches the ${item}!`
});

// Compose a duck from behaviors
function createDuck(name) {
    const state = { name };
    return Object.assign(
        {},
        canSwim(state),
        canFly(state),
        canBark(state)
    );
}

// Compose a labrador from different behaviors
function createLabrador(name) {
    const state = { name };
    return Object.assign(
        {},
        canSwim(state),
        canBark(state),
        canFetch(state)
    );
}

const duck = createDuck("Donald");
const lab  = createLabrador("Rex");

console.log(duck.swim());    // "Donald swims!"
console.log(duck.fly());     // "Donald flies!"
console.log(lab.swim());     // "Rex swims!"
console.log(lab.fetch("ball")); // "Rex fetches the ball!"
// lab.fly() ← TypeError — labs can't fly ✓


// ============================================================
// SECTION 10: INTERVIEW QUESTIONS
// ============================================================

// Q1: What is a prototype in JS?
// Every object has [[Prototype]] — a link to another object.
// When a property isn't found on the object, JS looks up the chain.
// Ends at Object.prototype whose [[Prototype]] is null.

// Q2: Difference between __proto__ and prototype?
// prototype — property on FUNCTIONS. Contains methods shared by instances.
//             Dog.prototype — the object instances inherit from.
// __proto__  — property on ALL OBJECTS. Points to their [[Prototype]].
//             dog.__proto__ === Dog.prototype
// Use Object.getPrototypeOf(obj) instead of __proto__ in modern code.

// Q3: What does 'new' do?
// 1. Creates empty object
// 2. Sets [[Prototype]] to Constructor.prototype
// 3. Calls Constructor with this = new object
// 4. Returns the object (unless constructor returns different object)

// Q4: What is a closure?
// A function that remembers variables from its outer scope
// even after the outer function has returned.
// Created every time a function is created.

// Q5: What is the difference between call, apply, and bind?
// call(obj, a, b)  — invoke immediately, args one by one
// apply(obj, [a,b])— invoke immediately, args as array
// bind(obj, a)     — return NEW function with fixed 'this'

// Q6: What is an IIFE and why use it?
// Immediately Invoked Function Expression — runs immediately.
// Creates private scope. Used to avoid polluting global scope.
// Common in module patterns and older code.

// Q7: Why do arrow functions not have 'this'?
// Arrow functions inherit 'this' from their lexical scope.
// They have no own 'this' binding — useful for callbacks
// where you want to use the outer object's 'this'.

// Q8: What is Object.create(null) used for?
// Creates object with no prototype chain.
// Pure dictionary — no inherited toString, hasOwnProperty, etc.
// Keys can't clash with Object.prototype methods.

// Q9: What is the prototype chain?
// The sequence of [[Prototype]] links from object to object.
// JS walks this chain looking for properties/methods.
// Ends at Object.prototype (whose [[Prototype]] is null).

// Q10: Difference between Object.freeze and Object.seal?
// freeze: cannot add, remove, OR change properties (deep immutable)
// seal:   cannot add or remove, but CAN change existing values


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// OBJECT CREATION:
//   {}                           — literal
//   Object.create(proto)         — explicit prototype
//   new Constructor()            — constructor function
//   new Class()                  — class
//
// PROTOTYPE:
//   Object.getPrototypeOf(obj)   — read [[Prototype]]
//   Object.setPrototypeOf(obj, proto) — set [[Prototype]]
//   obj instanceof Constructor   — check prototype chain
//   obj.hasOwnProperty(key)      — is it OWN property?
//   Object.hasOwn(obj, key)      — modern version
//
// OBJECT METHODS:
//   Object.keys(obj)             — own enumerable keys
//   Object.values(obj)           — own enumerable values
//   Object.entries(obj)          — [key, value] pairs
//   Object.assign(target, src)   — shallow merge
//   Object.freeze(obj)           — immutable
//   Object.seal(obj)             — no add/delete, can change
//   structuredClone(obj)         — deep clone
//
// FUNCTION BINDING:
//   fn.call(obj, a, b)           — invoke with this=obj
//   fn.apply(obj, [a, b])        — invoke with this=obj, args array
//   fn.bind(obj, a)              — new fn with fixed this
//
// CLOSURE:
//   Inner function remembers outer scope variables.
//   Used for: private state, factory functions, memoization.
//
// GOLDEN RULES:
// 1. Everything in JS (except primitives) is an object
// 2. Functions are objects — they have properties and prototypes
// 3. Classes are functions — typeof ClassName === "function"
// 4. Every function has a .prototype object used when called with new
// 5. Every object has [[Prototype]] — the chain ends at null
// 6. 'new' creates object, sets [[Prototype]], calls constructor
// 7. Arrow functions have NO own 'this' and NO .prototype
// 8. Closures hold LIVE REFERENCES — not copies of variables
// 9. var in loops = shared closure (use let or IIFE to fix)
// 10. Prefer composition over deep inheritance chains