// ============================================================
// call(), apply(), bind() & 'this' — Complete Deep Dive
// ============================================================
// These three methods live on Function.prototype.
// Every function in JS inherits them automatically.
// They all do ONE thing: let you manually control what 'this' is.
//
// WHY they exist:
//   'this' normally depends on how a function is called.
//   Sometimes you need to FORCE a specific 'this'.
//   call, apply, bind give you that control.
//
// In one line:
//   call()  — borrow a function and run it NOW (args one by one)
//   apply() — borrow a function and run it NOW (args as array)
//   bind()  — borrow a function and run it LATER (returns new fn)


// ============================================================
// SECTION 1: THE PROBLEM THEY SOLVE
// ============================================================
// Imagine you have a useful function but it uses 'this'.
// You want to use it with a DIFFERENT object.
// Without call/apply/bind, you'd have to copy the function
// into every object — wasteful and repetitive.

// A function that uses 'this'
function calculateTax() {
    const tax = this.income * (this.taxRate / 100);
    return `${this.name} owes ₹${tax.toFixed(2)} in taxes`;
}

// Three different people — none of them have calculateTax
const person1 = { name: "Ayush", income: 500000, taxRate: 20 };
const person2 = { name: "Alice", income: 800000, taxRate: 25 };
const person3 = { name: "Bob",   income: 300000, taxRate: 10 };

// Without call/apply/bind — you'd have to do this:
person1.calculateTax = calculateTax; // copy function to each object
person2.calculateTax = calculateTax;
person3.calculateTax = calculateTax;
// Ugly. Pollutes objects. Repetitive.

// WITH call — borrow the function for each object:
console.log(calculateTax.call(person1)); // "Ayush owes ₹100000.00 in taxes"
console.log(calculateTax.call(person2)); // "Alice owes ₹200000.00 in taxes"
console.log(calculateTax.call(person3)); // "Bob owes ₹30000.00 in taxes"
// One function, works for any object — clean!


// ============================================================
// SECTION 2: call() — BORROW AND RUN NOW
// ============================================================
// Syntax: fn.call(thisArg, arg1, arg2, arg3, ...)
//
// thisArg = what 'this' should be inside fn
// arg1, arg2... = arguments passed to fn (comma separated)
//
// Invokes fn IMMEDIATELY with thisArg as 'this'.

// Basic call
function greet(greeting, punctuation) {
    return `${greeting}, I am ${this.name}${punctuation}`;
}

const user1 = { name: "Ayush" };
const user2 = { name: "Alice" };

console.log(greet.call(user1, "Hello", "!"));   // "Hello, I am Ayush!"
console.log(greet.call(user2, "Hi",    "..."));  // "Hi, I am Alice..."
console.log(greet.call(user1, "Hey",   "?"));   // "Hey, I am Ayush?"

// What happens internally when you call greet.call(user1, "Hello", "!"):
//   1. 'this' inside greet is set to user1
//   2. greeting = "Hello"
//   3. punctuation = "!"
//   4. greet runs immediately with these values

// ── call with no context (null or undefined) ───────────────
function standalone() {
    console.log(this);
}
standalone.call(null);      // undefined (strict) or global (non-strict)
standalone.call(undefined); // same
// Passing null/undefined = "I don't care about 'this'"

// ── call for method borrowing ──────────────────────────────
// The most powerful use of call — using one object's method
// with a completely different object that doesn't have it.

const dog = {
    name:  "Rex",
    sound: "Woof",
    speak() {
        return `${this.name} says ${this.sound}!`;
    }
};

const cat = {
    name:  "Whiskers",
    sound: "Meow"
    // No speak method!
};

const bird = {
    name:  "Tweety",
    sound: "Tweet"
    // No speak method!
};

// cat and bird BORROW dog's speak method
console.log(dog.speak.call(cat));   // "Whiskers says Meow!"
console.log(dog.speak.call(bird));  // "Tweety says Tweet!"
// dog.speak was written once — works for any object with name + sound

// ── Real world call examples ───────────────────────────────

// Example 1: Borrowing Array methods for array-like objects
// arguments object looks like an array but isn't one
function showArgs() {
    // arguments = { 0: "a", 1: "b", 2: "c", length: 3 }
    // It's NOT a real array — has no .map, .filter etc.

    // Borrow Array.prototype.slice to convert to real array
    const argsArray = Array.prototype.slice.call(arguments);
    console.log(argsArray); // ["a", "b", "c"] — now a real array!

    // Or use join
    const joined = Array.prototype.join.call(arguments, " | ");
    console.log(joined); // "a | b | c"
}
showArgs("a", "b", "c");

// Example 2: Borrowing toString to check real type
// typeof [] === "object" (misleading)
// Object.prototype.toString gives the REAL type
console.log(Object.prototype.toString.call([]));         // "[object Array]"
console.log(Object.prototype.toString.call({}));         // "[object Object]"
console.log(Object.prototype.toString.call(null));       // "[object Null]"
console.log(Object.prototype.toString.call(undefined));  // "[object Undefined]"
console.log(Object.prototype.toString.call(42));         // "[object Number]"
console.log(Object.prototype.toString.call("hi"));       // "[object String]"
console.log(Object.prototype.toString.call(function(){})); // "[object Function]"

// This is how libraries check types accurately:
function trueTypeOf(value) {
    return Object.prototype.toString.call(value)
        .slice(8, -1)  // extract "Array" from "[object Array]"
        .toLowerCase(); // → "array"
}
console.log(trueTypeOf([]));        // "array"
console.log(trueTypeOf({}));        // "object"
console.log(trueTypeOf(null));      // "null"
console.log(trueTypeOf(new Date())); // "date"

// Example 3: Constructor chaining (before super() existed)
function Animal(name, sound) {
    this.name  = name;
    this.sound = sound;
}

function Dog(name, breed) {
    Animal.call(this, name, "Woof"); // run Animal's constructor with Dog's 'this'
    // 'this' in Animal = the new Dog object being built
    // Result: name and sound are set on the Dog instance
    this.breed = breed; // Dog-specific property added after
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const myDog = new Dog("Rex", "Labrador");
console.log(myDog.name);  // "Rex"   — set by Animal.call(this, ...)
console.log(myDog.sound); // "Woof"  — set by Animal.call(this, ...)
console.log(myDog.breed); // "Labrador" — set by Dog itself

// Example 4: Calling parent's overridden method
function Vehicle(brand) {
    this.brand = brand;
}
Vehicle.prototype.describe = function() {
    return `Vehicle: ${this.brand}`;
};

function ElectricCar(brand, range) {
    Vehicle.call(this, brand); // inherit Vehicle's properties
    this.range = range;
}
ElectricCar.prototype = Object.create(Vehicle.prototype);
ElectricCar.prototype.constructor = ElectricCar;
ElectricCar.prototype.describe = function() {
    // Call parent's describe with THIS ElectricCar's context
    const parentDesc = Vehicle.prototype.describe.call(this);
    return `${parentDesc}, Range: ${this.range}km`;
};

const tesla = new ElectricCar("Tesla", 500);
console.log(tesla.describe()); // "Vehicle: Tesla, Range: 500km"


// ============================================================
// SECTION 3: apply() — BORROW AND RUN NOW (array args)
// ============================================================
// Syntax: fn.apply(thisArg, [arg1, arg2, arg3, ...])
//
// IDENTICAL to call() — the ONLY difference:
//   call()  → arguments passed individually: fn.call(obj, a, b, c)
//   apply() → arguments passed as array:     fn.apply(obj, [a, b, c])
//
// Memory trick: A in Apply = Array
// Use apply when your arguments are already in an array.

function introduce(city, country, profession) {
    return `${this.name} from ${city}, ${country}. Works as ${profession}.`;
}

const dev = { name: "Ayush" };

// call — args one by one
console.log(introduce.call(dev, "Kolkata", "India", "Developer"));

// apply — args as array (same result)
const args = ["Kolkata", "India", "Developer"];
console.log(introduce.apply(dev, args));

// ── When apply is better than call ────────────────────────

// Scenario: you have args in an array already
const scores = [85, 92, 78, 95, 88, 76, 99];

// Find max from an array
// Math.max(85, 92, 78...) — needs individual args, not array
console.log(Math.max.apply(null, scores)); // 99
// null because Math.max doesn't use 'this'

// Modern equivalent using spread:
console.log(Math.max(...scores)); // 99 (same result, cleaner syntax)
// apply was the old way before spread operator existed

// apply is still useful when spread isn't available or args are dynamic:
function logAll() {
    Array.prototype.forEach.call(arguments, arg => console.log(arg));
}

// ── apply for function decorators ─────────────────────────
function withLogging(fn) {
    return function() {
        console.log(`Calling ${fn.name} with`, arguments);
        const result = fn.apply(this, arguments); // forward 'this' AND all args
        console.log(`${fn.name} returned`, result);
        return result;
    };
}

function multiply(a, b) { return a * b; }

const loggedMultiply = withLogging(multiply);
loggedMultiply(4, 5);
// Calling multiply with Arguments [4, 5]
// multiply returned 20

// apply is perfect here — we don't know how many args fn expects
// arguments is array-like, apply accepts it directly

// ── apply for merging/spreading arrays (old way) ───────────
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Old way with apply:
Array.prototype.push.apply(arr1, arr2); // push all arr2 items into arr1
console.log(arr1); // [1, 2, 3, 4, 5, 6]

// Modern equivalent:
arr1.push(...arr2); // same thing, cleaner

// ── call vs apply — when to use which ─────────────────────
//
// Use call when:
//   - You know the exact arguments and pass them directly
//   - You're borrowing methods with fixed known params
//   - Reading the code — call is slightly more readable
//
// Use apply when:
//   - Arguments are already in an array
//   - Number of arguments is dynamic/unknown
//   - You're building decorators/wrappers that forward args


// ============================================================
// SECTION 4: bind() — BORROW FOR LATER
// ============================================================
// Syntax: const newFn = fn.bind(thisArg, arg1, arg2, ...)
//
// Does NOT invoke the function immediately.
// Returns a NEW function with 'this' PERMANENTLY set to thisArg.
// The new function's 'this' can NEVER be changed — even by call/apply.
// Also allows PARTIAL APPLICATION — pre-fill some arguments.

function greetPerson(greeting, timeOfDay) {
    return `${greeting} ${this.name}! Good ${timeOfDay}.`;
}

const ayush = { name: "Ayush" };
const alice = { name: "Alice" };

// bind returns a NEW function — doesn't run yet
const greetAyush = greetPerson.bind(ayush);
const greetAlice = greetPerson.bind(alice);

// Call the new functions whenever needed
console.log(greetAyush("Hello", "morning"));  // "Hello Ayush! Good morning."
console.log(greetAyush("Hi",    "evening"));  // "Hi Ayush! Good evening."
console.log(greetAlice("Hey",   "night"));    // "Hey Alice! Good night."

// Original function unchanged
console.log(greetPerson.call(ayush, "Yo", "afternoon")); // still works normally

// ── bound function's 'this' CANNOT be changed ─────────────
const obj = { name: "Object" };
const greetBound = greetPerson.bind(ayush); // bound to ayush

// Trying to override with call — doesn't work
console.log(greetBound.call(obj, "Hello", "morning"));
// "Hello Ayush! Good morning." — ayush wins, obj ignored
// bind is STRONGER than call/apply

// Trying to override with another bind — doesn't work
const reBound = greetBound.bind(obj);
console.log(reBound("Hello", "morning"));
// "Hello Ayush! Good morning." — first bind wins

// Only new keyword can override bind (for constructor use cases)

// ── Partial application with bind ─────────────────────────
// Pre-fill some arguments — create specialized versions of functions

function createEmail(to, subject, body) {
    return {
        to,
        subject,
        body,
        from: this.email
    };
}

const emailSender = { email: "ayush@example.com" };

// Bind 'this' AND pre-fill 'to'
const emailToAlice = createEmail.bind(emailSender, "alice@example.com");
// Now emailToAlice only needs subject and body

console.log(emailToAlice("Hello!", "How are you?"));
// { to: "alice@example.com", subject: "Hello!", body: "How are you?", from: "ayush@example.com" }

console.log(emailToAlice("Meeting", "Can we meet tomorrow?"));
// { to: "alice@example.com", subject: "Meeting", body: "...", from: "ayush@..." }

// Bind 'this', 'to', AND 'subject'
const monthlyReport = createEmail.bind(
    emailSender,
    "boss@company.com",
    "Monthly Report"
);
console.log(monthlyReport("Here is the report for January..."));
// Only body needed — everything else pre-filled

// ── Real world bind use cases ──────────────────────────────

// Use case 1: Event listeners on class methods
class Toggle {
    constructor(element) {
        this.element = element;
        this.isOn    = false;

        // Without bind: 'this' inside handleClick = the DOM element
        // With bind: 'this' inside handleClick = this Toggle instance
        this.element.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick() {
        this.isOn = !this.isOn; // 'this' = Toggle instance ✓
        this.element.textContent = this.isOn ? "ON" : "OFF";
        console.log("Toggle is now:", this.isOn);
    }
}

// Use case 2: Preserving 'this' in setTimeout
class Notification {
    constructor(message) {
        this.message = message;
        this.shown   = false;
    }

    show() {
        // Without bind: 'this' in the callback = undefined/global
        setTimeout(this.display.bind(this), 2000);
    }

    display() {
        this.shown = true; // ✓ 'this' = Notification instance
        console.log(`Notification: ${this.message}`);
    }
}

const notif = new Notification("New message received!");
notif.show(); // shows after 2 seconds with correct 'this'

// Use case 3: React-style event handlers (before arrow fields)
class OldStyleComponent {
    constructor() {
        this.state = { count: 0 };
        // Bind in constructor — common React pattern
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.state.count++;
        console.log("Count:", this.state.count);
    }
}

// Use case 4: Currying / functional programming
function power(base, exponent) {
    return Math.pow(base, exponent);
}

const square  = power.bind(null, 2);  // Nope — this pre-fills BASE not 'this'
// Actually for null-this functions, partial application still works:
function multiply2(a, b) { return a * b; }
const double   = multiply2.bind(null, 2); // pre-fill first arg = 2
const triple   = multiply2.bind(null, 3); // pre-fill first arg = 3
const quadruple = multiply2.bind(null, 4);

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(quadruple(5)); // 20


// ============================================================
// SECTION 5: IMPLEMENTING call, apply, bind FROM SCRATCH
// ============================================================
// The best way to understand something is to build it.
// This reveals exactly how these methods work internally.

// ── Custom myCall ──────────────────────────────────────────
Function.prototype.myCall = function(context, ...args) {
    // 'this' here = the function being called (e.g., greet)
    // context = what 'this' should be inside that function

    // Handle null/undefined context
    context = context || globalThis;

    // Create a unique key to avoid overwriting existing properties
    const fnKey = Symbol("fn");

    // Temporarily attach the function to the context object
    // Now when we call context[fnKey](), 'this' inside = context
    context[fnKey] = this;

    // Call the function — 'this' inside it = context ✓
    const result = context[fnKey](...args);

    // Clean up — remove the temporary property
    delete context[fnKey];

    return result;
};

// Test myCall
function sayHi(greeting) {
    return `${greeting}, I'm ${this.name}`;
}
const obj1 = { name: "Ayush" };

console.log(sayHi.myCall(obj1, "Hello")); // "Hello, I'm Ayush" ✓
console.log(sayHi.call(obj1, "Hello"));   // "Hello, I'm Ayush" — same!

// ── Custom myApply ─────────────────────────────────────────
Function.prototype.myApply = function(context, args = []) {
    // Identical to myCall — only difference is args is an array
    context = context || globalThis;
    const fnKey = Symbol("fn");
    context[fnKey] = this;
    const result = context[fnKey](...args); // spread the array
    delete context[fnKey];
    return result;
};

console.log(sayHi.myApply(obj1, ["Hello"])); // "Hello, I'm Ayush" ✓

// ── Custom myBind ──────────────────────────────────────────
Function.prototype.myBind = function(context, ...presetArgs) {
    // 'this' = the original function
    const originalFn = this;

    // Return a NEW function — doesn't run yet
    return function(...laterArgs) {
        // When the new function is eventually called:
        // Merge preset args with later args
        // Use myCall to set 'this' = context
        return originalFn.myCall(context, ...presetArgs, ...laterArgs);
    };
};

const boundSayHi = sayHi.myBind(obj1);
console.log(boundSayHi("Hey"));  // "Hey, I'm Ayush" ✓
console.log(sayHi.bind(obj1)("Hey")); // same!

// Partial application test
function add(a, b, c) { return a + b + c; }
const add5 = add.myBind(null, 5);      // pre-fill a = 5
console.log(add5(3, 2));               // 10 (5 + 3 + 2) ✓

// ── Bind that supports new keyword ─────────────────────────
// The real bind() has special behavior: if the bound function
// is called with 'new', the new keyword overrides the bound 'this'.
// Here's a more complete bind implementation:

Function.prototype.myBindFull = function(context, ...presetArgs) {
    const originalFn = this;

    function boundFn(...laterArgs) {
        // If called with 'new' keyword:
        //   'this' inside boundFn = newly created object
        //   'this instanceof boundFn' = true
        // If called normally:
        //   'this instanceof boundFn' = false → use context
        const thisArg = this instanceof boundFn ? this : context;
        return originalFn.apply(thisArg, [...presetArgs, ...laterArgs]);
    }

    // Preserve the prototype chain for instanceof to work
    boundFn.prototype = Object.create(originalFn.prototype);

    return boundFn;
};

function Person(name, age) {
    this.name = name;
    this.age  = age;
}

const BoundPerson  = Person.myBindFull({ name: "should be ignored" });
const newPerson    = new BoundPerson("Ayush", 21);
console.log(newPerson.name); // "Ayush" — new wins over bound context ✓


// ============================================================
// SECTION 6: 'this' ACROSS ALL CONTEXTS — complete reference
// ============================================================

// ── 1. Global context ──────────────────────────────────────
console.log(this); // Window (browser script) / {} (Node module)

// ── 2. Regular function — non-strict ──────────────────────
function nonStrict() {
    return this; // Window (browser) / global (Node)
}

// ── 3. Regular function — strict mode ─────────────────────
function strict() {
    "use strict";
    return this; // undefined
}

// ── 4. Object method ──────────────────────────────────────
const obj2 = {
    name: "Ayush",
    method() { return this; } // obj2
};
obj2.method(); // this = obj2

// ── 5. Nested function inside method ──────────────────────
const obj3 = {
    name: "Ayush",
    outer() {
        console.log(this.name); // "Ayush" ✓ — obj3.outer() sets this = obj3

        function inner() {
            console.log(this); // undefined/global — inner() called without object!
        }
        inner(); // plain function call — default binding kicks in

        // Fix: arrow inherits 'this' from outer
        const innerArrow = () => {
            console.log(this.name); // "Ayush" ✓ — inherited from outer
        };
        innerArrow();
    }
};
obj3.outer();

// ── 6. Arrow function ──────────────────────────────────────
const obj4 = {
    name: "Ayush",
    // Arrow as method — BAD: 'this' = outer scope (not obj4)
    arrowMethod: () => {
        return this; // NOT obj4! outer scope's 'this'
    },
    // Regular method with arrow inside — GOOD
    regularMethod() {
        const arrow = () => this; // inherits from regularMethod's 'this'
        return arrow(); // this = obj4 ✓
    }
};
console.log(obj4.arrowMethod());  // outer scope (wrong for methods)
console.log(obj4.regularMethod()); // obj4 ✓

// ── 7. Constructor function ────────────────────────────────
function Constructor() {
    this.value = 42;
    console.log(this); // new empty object being built
}
const instance = new Constructor(); // this = new object

// ── 8. Class ───────────────────────────────────────────────
class MyClass {
    constructor() {
        this.x = 10; // this = new instance
    }
    method() {
        return this; // this = instance when called as instance.method()
    }
    static staticMethod() {
        return this; // this = MyClass itself (not instance)
    }
}
const mc = new MyClass();
console.log(mc.method());         // mc (the instance)
console.log(MyClass.staticMethod()); // MyClass (the class)

// ── 9. Event handler ───────────────────────────────────────
// Regular function: 'this' = element that received event
button.addEventListener("click", function() {
    console.log(this); // <button> element
    console.log(this === event.currentTarget); // true
});

// Arrow function: 'this' = outer scope (NOT the element)
button.addEventListener("click", () => {
    console.log(this); // outer scope (window/undefined)
    // Use event.currentTarget if you need the element
});

// ── 10. Callbacks ──────────────────────────────────────────
const obj5 = {
    name: "Ayush",
    items: [1, 2, 3],

    badProcess() {
        return this.items.map(function(item) {
            return `${this.name}: ${item}`; // ✗ 'this' = undefined/global
        });
    },

    goodProcessArrow() {
        return this.items.map(item => {
            return `${this.name}: ${item}`; // ✓ arrow inherits 'this'
        });
    },

    goodProcessThisArg() {
        return this.items.map(function(item) {
            return `${this.name}: ${item}`; // ✓ thisArg provided
        }, this); // second arg to map = 'this' for callback
    },

    goodProcessBind() {
        return this.items.map(function(item) {
            return `${this.name}: ${item}`; // ✓ bound
        }.bind(this));
    }
};


// ============================================================
// SECTION 7: BINDING PRIORITY — what wins?
// ============================================================
// When multiple rules could determine 'this', priority decides.
// Higher number = higher priority.
//
// 1. Default binding    (lowest)  fn()
// 2. Implicit binding             obj.fn()
// 3. Explicit binding             fn.call/apply/bind(obj)
// 4. new binding        (highest) new fn()

// Test 1: Implicit vs Default
function test() { return this?.name || "no name"; }
const container = { name: "container", test };

container.test(); // "container" — implicit binding wins over default

const extracted = container.test;
extracted();      // "no name"   — default binding (no object before dot)

// Test 2: Explicit vs Implicit
const obj6 = { name: "implicit", fn: test };
const obj7 = { name: "explicit" };

obj6.fn();                // "implicit" — implicit binding
obj6.fn.call(obj7);      // "explicit" — explicit WINS over implicit

// Test 3: new vs Explicit (bind)
function Build(name) {
    this.name = name;
}
const BoundBuild = Build.bind({ name: "bound object" });

const instance1 = new BoundBuild("from new"); // new WINS over bind
console.log(instance1.name); // "from new" — not "bound object"

// Test 4: Arrow vs Everything
const outer = {
    name: "outer",
    getArrow() {
        return () => this; // 'this' locked to outer at definition
    }
};

const arrow = outer.getArrow();
console.log(arrow().name);        // "outer" — lexical binding
console.log(arrow.call({ name: "call" }).name);  // "outer" — call ignored
console.log(arrow.bind({ name: "bind" })().name); // "outer" — bind ignored
// Arrow function's 'this' is PERMANENT — nothing can change it


// ============================================================
// SECTION 8: REAL WORLD PATTERNS
// ============================================================

// ── Pattern 1: Method borrowing library ────────────────────
const ArrayUtils = {
    // Works on any array-like object
    toArray(arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    },
    sum(arrayLike) {
        return Array.prototype.reduce.call(
            arrayLike,
            (acc, val) => acc + val,
            0
        );
    },
    max(arrayLike) {
        return Math.max.apply(null, Array.prototype.slice.call(arrayLike));
    }
};

// Works on NodeList (DOM query results)
const divs = document.querySelectorAll("div");
const divsArray = ArrayUtils.toArray(divs);
divsArray.forEach(div => console.log(div.textContent));

// Works on arguments object
function sumAllArgs() {
    return ArrayUtils.sum(arguments);
}
console.log(sumAllArgs(1, 2, 3, 4, 5)); // 15

// ── Pattern 2: Function composition with correct 'this' ────
class Pipeline {
    constructor(data) {
        this.data = data;
        this.steps = [];
    }

    addStep(fn) {
        // bind 'this' so each step has access to pipeline
        this.steps.push(fn.bind(this));
        return this; // enable chaining
    }

    run() {
        return this.steps.reduce((result, step) => step(result), this.data);
    }
}

const pipeline = new Pipeline([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

pipeline
    .addStep(function(data) {
        console.log(`Pipeline processing ${data.length} items`);
        return data.filter(n => n % 2 === 0); // keep evens
    })
    .addStep(function(data) {
        return data.map(n => n * n); // square each
    })
    .addStep(function(data) {
        return data.reduce((sum, n) => sum + n, 0); // sum
    });

console.log(pipeline.run()); // 220 (4+16+36+64+100)

// ── Pattern 3: Mixin with call ──────────────────────────────
// Applying multiple constructors to build complex objects
function Serializable() {
    this.serialize   = () => JSON.stringify(this);
    this.deserialize = (json) => Object.assign(this, JSON.parse(json));
}

function Validatable() {
    this.errors  = [];
    this.isValid = () => this.errors.length === 0;
    this.addError = (msg) => this.errors.push(msg);
}

function Timestampable() {
    this.createdAt = new Date().toISOString();
    this.touch = () => { this.updatedAt = new Date().toISOString(); };
}

function BlogPost(title, content, author) {
    // Apply all mixins using call — each gets 'this' = BlogPost instance
    Serializable.call(this);
    Validatable.call(this);
    Timestampable.call(this);

    // Own properties
    this.title   = title;
    this.content = content;
    this.author  = author;

    // Validation
    if (!title)   this.addError("Title required");
    if (!content) this.addError("Content required");
    if (!author)  this.addError("Author required");
}

const post = new BlogPost("Learning JS", "JS is amazing!", "Ayush");
console.log(post.isValid());         // true
console.log(post.createdAt);         // ISO timestamp
console.log(JSON.parse(post.serialize()).title); // "Learning JS"

post.touch();
console.log(post.updatedAt);         // updated timestamp

// ── Pattern 4: Event emitter with bind ──────────────────────
class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(event, listener) {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(listener);
        return this;
    }

    emit(event, ...args) {
        (this._events[event] || []).forEach(listener => {
            listener.apply(this, args); // 'this' inside listener = emitter
        });
        return this;
    }

    once(event, listener) {
        const wrapper = (...args) => {
            listener.apply(this, args);
            this.off(event, wrapper); // remove after first call
        };
        return this.on(event, wrapper);
    }

    off(event, listener) {
        this._events[event] = (this._events[event] || [])
            .filter(l => l !== listener);
        return this;
    }
}

const emitter = new EventEmitter();

emitter.on("data", function(payload) {
    // 'this' = emitter (set by apply inside emit)
    console.log("Received:", payload);
});

emitter.once("connect", function() {
    console.log("Connected! (fires only once)");
});

emitter.emit("data", { id: 1, value: "hello" });
emitter.emit("connect");
emitter.emit("connect"); // won't fire — 'once' removed it


// ============================================================
// SECTION 9: INTERVIEW QUESTIONS
// ============================================================

// Q1: What is the difference between call, apply, and bind?
// call  → invoke immediately, args as comma-separated values
// apply → invoke immediately, args as array
// bind  → return new function, 'this' permanently set, args optionally pre-filled

// Q2: Predict the output:
const obj8 = {
    x: 10,
    getX() { return this.x; }
};
const fn2 = obj8.getX;
console.log(fn2());         // undefined — default binding
console.log(fn2.call(obj8)); // 10 — explicit binding

// Q3: What does bind return?
// A NEW function. Original function is unchanged.
// The new function's 'this' is PERMANENTLY set — can't be overridden.

// Q4: Can you change 'this' of a bound function?
// NO — bind wins over call and apply.
// Only 'new' keyword can override a bound 'this'.

// Q5: Predict the output:
function fn3() { return this; }
const bound1 = fn3.bind({ a: 1 });
const bound2 = bound1.bind({ b: 2 });
console.log(bound2()); // { a: 1 } — first bind wins, second ignored

// Q6: Why use call when building inheritance?
// Animal.call(this, name) inside Dog constructor
// Runs Animal's setup code with Dog's 'this'
// Equivalent to super(name) in class syntax

// Q7: What is partial application with bind?
// Pre-filling some arguments of a function to create a specialized version
// fn.bind(null, arg1) — 'this' = null, arg1 pre-filled
// Calling the result only needs remaining args

// Q8: When would you use apply over call?
// When arguments are already in an array:
// Math.max.apply(null, arrayOfNumbers)
// In modern code, spread achieves the same: Math.max(...array)

// Q9: Implement bind from scratch.
// (Shown in Section 5 above)
// Key insight: return a closure that calls originalFn.apply(context, args)

// Q10: What is method borrowing?
// Using call/apply to use one object's method with a different object.
// Array.prototype.slice.call(arguments) — most classic example.
// The method is "borrowed" temporarily — no permanent attachment.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// call(thisArg, a, b, c)
//   → Invokes NOW
//   → 'this' = thisArg
//   → Args passed individually
//   → Use for: method borrowing, constructor chaining
//
// apply(thisArg, [a, b, c])
//   → Invokes NOW
//   → 'this' = thisArg
//   → Args passed as array
//   → Use for: when args already in array, decorators
//
// bind(thisArg, a, b)
//   → Returns NEW function (does NOT invoke)
//   → 'this' = thisArg PERMANENTLY
//   → Optionally pre-fills args (partial application)
//   → Use for: callbacks, event handlers, setTimeout
//
// PRIORITY (highest wins):
//   new > bind > call/apply > obj.method() > fn()
//
// GOLDEN RULES:
// 1. call/apply invoke IMMEDIATELY — bind does NOT
// 2. bind returns a NEW function — original unchanged
// 3. A bound function's 'this' cannot be changed by call/apply
// 4. Only 'new' can override a bound 'this'
// 5. First bind wins — rebinding a bound function does nothing
// 6. Apply uses array for args — call uses comma-separated
// 7. null/undefined as thisArg = default binding kicks in
// 8. Partial application: fn.bind(null, preset) pre-fills args
// 9. Method borrowing = call/apply with a different object
// 10. Building call/apply/bind yourself is the best way to understand them