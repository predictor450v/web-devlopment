// ============================================================
// 'this' KEYWORD — Complete Deep Dive Study Guide
// ============================================================
// 'this' is the most confusing concept in JavaScript.
// Every JS developer gets burned by it at least once.
//
// The ONE rule to remember:
//   'this' is NOT about where the function is DEFINED.
//   'this' is about HOW and WHERE the function is CALLED.
//
// 'this' = the object that is currently EXECUTING the function.
//
// 5 rules determine what 'this' is (in order of priority):
//   1. new binding          — new keyword
//   2. Explicit binding     — call, apply, bind
//   3. Implicit binding     — object method call (dot notation)
//   4. Default binding      — standalone function call
//   5. Arrow function       — lexical 'this' (no own 'this')


// ============================================================
// SECTION 1: WHY 'this' EXISTS — the problem it solves
// ============================================================
// Without 'this', you'd have to pass the object to every method.

// Without 'this' — ugly, error-prone
function greetWithout(person) {
    return `Hi, I'm ${person.name} and I'm ${person.age}`;
}
const person1 = { name: "Ayush", age: 21 };
greetWithout(person1); // must always pass the object manually

// With 'this' — clean, the function knows its own context
const person2 = {
    name: "Ayush",
    age:  21,
    greet() {
        // 'this' automatically refers to the object calling this method
        return `Hi, I'm ${this.name} and I'm ${this.age}`;
    }
};
person2.greet(); // "Hi, I'm Ayush and I'm 21"
// 'this' = person2 — because person2 called greet()


// ============================================================
// SECTION 2: RULE 1 — DEFAULT BINDING
// ============================================================
// When a function is called STANDALONE (no dot, no new, no bind),
// 'this' defaults to:
//   STRICT MODE:   undefined
//   NON-STRICT:    global object (window in browser, global in Node.js)
//
// Default binding is the LOWEST priority rule.
// Applies when no other rule matches.

function showThis() {
    console.log(this); // what is 'this' here?
}

showThis();
// In browser (non-strict):  Window {...}
// In browser (strict mode): undefined
// In Node.js (non-strict):  global {...}

// Strict mode example
function strictFn() {
    "use strict";
    console.log(this); // undefined
}
strictFn();

// The danger of default binding:
const userData = {
    name: "Ayush",
    getName() {
        return this.name; // 'this' depends on HOW it's called
    }
};

// Called as method — 'this' = userData (implicit binding wins)
console.log(userData.getName()); // "Ayush" ✓

// Extracted and called standalone — 'this' = undefined/global
const extractedFn = userData.getName;
console.log(extractedFn()); // undefined (or crash in strict mode)
// WHY? extractedFn() has no object before the dot.
// Default binding kicks in — 'this' = global or undefined.

// Real bug this causes:
const counter = {
    count: 0,
    increment() {
        this.count++; // works when called as counter.increment()
    }
};

counter.increment(); // ✓ this = counter, count = 1

const inc = counter.increment; // extract the method
inc();                          // ✗ this = undefined/global
                                // counter.count stays 1 — bug!
console.log(counter.count);     // 1 (inc() didn't work)


// ============================================================
// SECTION 3: RULE 2 — IMPLICIT BINDING
// ============================================================
// When a function is called as a METHOD of an object (dot notation),
// 'this' = the object BEFORE the dot.
//
// The object must OWN or CONTAIN the method at call time.

const dog = {
    name:  "Rex",
    breed: "Labrador",
    bark() {
        // 'this' = dog (dog called bark)
        return `${this.name} says Woof!`;
    },
    describe() {
        // 'this' = dog
        return `${this.name} is a ${this.breed}`;
    }
};

console.log(dog.bark());     // "Rex says Woof!" — this = dog
console.log(dog.describe()); // "Rex is a Labrador" — this = dog

// ── Implicit binding with nested objects ───────────────────
// 'this' = the IMMEDIATE object before the dot, not the outer one

const company = {
    name: "TechCorp",
    ceo: {
        name: "Alice",
        greet() {
            // 'this' = ceo — the IMMEDIATE object before the dot
            // NOT company — even though ceo is inside company
            return `I'm ${this.name}, CEO`; // "I'm Alice, CEO"
        }
    }
};

console.log(company.ceo.greet());
// company.ceo.greet()
//         ^^^         ← IMMEDIATE object before dot = ceo
// this = ceo, NOT company

// ── Implicit binding LOSS — the most common 'this' bug ─────
// 'this' is lost when you separate the method from its object.
// This is called "implicit binding loss".

const student = {
    name: "Ayush",
    study() {
        return `${this.name} is studying`;
    }
};

// Normal call — works
console.log(student.study()); // "Ayush is studying" ✓

// Assigned to variable — binding LOST
const studyFn = student.study;
console.log(studyFn()); // "undefined is studying" ✗
                         // studyFn() — no object before dot → default binding

// Passed as callback — binding LOST
function execute(fn) {
    return fn(); // called without object → default binding
}
console.log(execute(student.study)); // "undefined is studying" ✗

// Passed to setTimeout — binding LOST
setTimeout(student.study, 1000); // "undefined is studying" ✗
// setTimeout calls the function without any object context

// ── HOW TO FIX binding loss ────────────────────────────────

// Fix 1: Use .bind() to permanently attach 'this'
const boundStudy = student.study.bind(student);
console.log(boundStudy()); // "Ayush is studying" ✓
execute(boundStudy);        // "Ayush is studying" ✓

// Fix 2: Wrap in arrow function (arrow inherits outer 'this')
setTimeout(() => student.study(), 1000); // ✓ — arrow calls it as a method

// Fix 3: Store reference and call as method
const self = student;
setTimeout(function() { self.study(); }, 1000); // ✓ — called as method

// ── Chained method calls ────────────────────────────────────
const calculator = {
    value: 0,
    add(n) {
        this.value += n;
        return this; // return 'this' to enable chaining!
    },
    subtract(n) {
        this.value -= n;
        return this;
    },
    multiply(n) {
        this.value *= n;
        return this;
    },
    result() {
        return this.value;
    }
};

const answer = calculator
    .add(10)        // this = calculator, value = 10
    .multiply(3)    // this = calculator, value = 30
    .subtract(5)    // this = calculator, value = 25
    .result();      // 25

console.log(answer); // 25
// Each method returns 'this' — so the next call has calculator before the dot


// ============================================================
// SECTION 4: RULE 3 — EXPLICIT BINDING (call, apply, bind)
// ============================================================
// You MANUALLY tell JS what 'this' should be.
// Overrides implicit and default binding.
// Three methods: call, apply, bind — all on Function.prototype.

function introduce(city, country) {
    return `I'm ${this.name}, ${this.age}, from ${city}, ${country}`;
}

const personA = { name: "Ayush", age: 21 };
const personB = { name: "Alice", age: 25 };

// ── call(thisArg, arg1, arg2, ...) ─────────────────────────
// Invokes function IMMEDIATELY with specified 'this'.
// Pass arguments ONE BY ONE after the context.

console.log(introduce.call(personA, "Kolkata", "India"));
// "I'm Ayush, 21, from Kolkata, India"
// 'this' = personA, city = "Kolkata", country = "India"

console.log(introduce.call(personB, "London", "UK"));
// "I'm Alice, 25, from London, UK"
// Same function, different 'this'

// call with no arguments — falls back to default binding
introduce.call(null);    // 'this' = global/undefined
introduce.call(undefined); // same

// ── apply(thisArg, [arg1, arg2, ...]) ──────────────────────
// Same as call but arguments passed as an ARRAY.
// Memory trick: A in apply = Array
// Useful when args are already in an array.

console.log(introduce.apply(personA, ["Kolkata", "India"]));
// Same result as call — args are spread from array

// Real use case — Math.max with array
const numbers = [3, 7, 1, 9, 4, 6];
console.log(Math.max(...numbers));          // 9 (modern spread)
console.log(Math.max.apply(null, numbers)); // 9 (old way with apply)
// Math.max doesn't use 'this' so null is fine

// apply for borrowing methods
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
// arrayLike.join(",") ← TypeError — not a real array
const joined = Array.prototype.join.call(arrayLike, ",");
console.log(joined); // "a,b,c" — borrowed Array method!

// ── bind(thisArg, arg1, arg2, ...) ─────────────────────────
// Returns a NEW FUNCTION with 'this' PERMANENTLY bound.
// Does NOT invoke immediately — creates a new function.
// The new function's 'this' can NEVER be changed again.

const introduceAyush = introduce.bind(personA);
console.log(introduceAyush("Kolkata", "India")); // Ayush always
console.log(introduceAyush("Mumbai",  "India")); // still Ayush

// Even call/apply can't override a bound function's 'this'
console.log(introduceAyush.call(personB, "London", "UK"));
// Still "I'm Ayush" — bind wins over call!

// Partial application — pre-fill arguments
const introduceAyushIndia = introduce.bind(personA, "Kolkata"); // city pre-filled
console.log(introduceAyushIndia("India"));   // city = Kolkata, country = India
console.log(introduceAyushIndia("Germany")); // city = Kolkata, country = Germany

// Real world bind use case — event handlers
class Timer {
    constructor() {
        this.seconds = 0;
    }

    start() {
        // Without bind: 'this' inside tick would be undefined (called by setInterval)
        // With bind: 'this' is always the Timer instance
        this.intervalId = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.seconds++;
        console.log(`${this.seconds} seconds`);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

const timer = new Timer();
timer.start(); // 1 second, 2 seconds, 3 seconds...
setTimeout(() => timer.stop(), 5000); // stop after 5 seconds

// ── call vs apply vs bind summary ──────────────────────────
//
//              | Invokes immediately | 'this' bound | Args format
// ─────────────────────────────────────────────────────────────
// call(obj,    |        YES          |  one-time    | comma separated
//      a, b)   |                     |              |
// ─────────────────────────────────────────────────────────────
// apply(obj,   |        YES          |  one-time    | as an array
//       [a,b]) |                     |              |
// ─────────────────────────────────────────────────────────────
// bind(obj,    |        NO           |  permanent   | comma separated
//      a)      | returns new fn      | (new fn)     | (partial apply)
// ─────────────────────────────────────────────────────────────


// ============================================================
// SECTION 5: RULE 4 — new BINDING
// ============================================================
// When a function is called with 'new':
//   1. A brand new empty object is created
//   2. 'this' inside the constructor = that new object
//   3. The new object's [[Prototype]] is set to Constructor.prototype
//   4. The new object is returned automatically
//
// new binding has the HIGHEST priority over all other rules.
// Even explicit bind can be overridden by new.

function Car(brand, model, year) {
    // 'this' = the brand new empty object created by 'new'
    this.brand   = brand;   // adding to the new object
    this.model   = model;
    this.year    = year;
    this.speed   = 0;       // default value

    console.log(this); // shows the new object being built
}

Car.prototype.accelerate = function(amount) {
    this.speed += amount;
    return `${this.brand} now going ${this.speed} km/h`;
};

const car1 = new Car("Toyota", "Camry", 2022);
const car2 = new Car("Honda",  "Civic", 2023);

console.log(car1.brand);       // "Toyota" — from the new object
console.log(car1.accelerate(50)); // "Toyota now going 50 km/h"

// car1 and car2 are completely separate objects
console.log(car1 === car2); // false — different objects

// What happens WITHOUT 'new' — the bug:
const car3 = Car("Bugatti", "Veyron", 2024); // forgot new!
// 'this' = global object (non-strict) or undefined (strict)
// brand, model, year get added to GLOBAL SCOPE — pollution!
// car3 = undefined (no explicit return)
console.log(car3);        // undefined
console.log(window.brand); // "Bugatti" — polluted global! (non-strict)

// Safety guard — check if called with new
function SafeCar(brand) {
    if (!(this instanceof SafeCar)) {
        // Called without 'new' — force it
        return new SafeCar(brand);
    }
    this.brand = brand;
}
const s1 = new SafeCar("Tesla"); // ✓ works normally
const s2 = SafeCar("BMW");       // ✓ also works — forced new internally


// ============================================================
// SECTION 6: RULE 5 — ARROW FUNCTIONS & LEXICAL 'this'
// ============================================================
// Arrow functions are COMPLETELY DIFFERENT from regular functions.
// They do NOT have their own 'this'.
// They INHERIT 'this' from the SURROUNDING LEXICAL SCOPE
// (where the arrow function is WRITTEN, not where it's called).
//
// 'this' in an arrow function is determined at DEFINITION time,
// not at call time. It NEVER changes — cannot be overridden.

// Regular function — 'this' depends on call site
const obj = {
    name: "Ayush",
    regularFn: function() {
        console.log("Regular:", this.name); // "Ayush" — called as obj.regularFn()
    },
    arrowFn: () => {
        // Arrow defined here — 'this' = surrounding scope at DEFINITION
        // Surrounding scope = module/global level (NOT obj)
        // obj is just a value — it's not a scope
        console.log("Arrow:", this); // undefined (strict) or global
                                      // NOT obj!
    }
};

obj.regularFn(); // "Regular: Ayush" ✓
obj.arrowFn();   // "Arrow: undefined" or global ✗

// ── When arrow functions HELP — solving 'this' in callbacks ─
class EventHandler {
    constructor(name) {
        this.name    = name;
        this.clicked = 0;
    }

    setupWithRegular() {
        document.addEventListener("click", function() {
            // 'this' here = the DOM element (event target)
            // NOT the EventHandler instance!
            this.clicked++; // ✗ 'this' is wrong here
            console.log(this.name); // undefined — wrong 'this'
        });
    }

    setupWithArrow() {
        document.addEventListener("click", () => {
            // Arrow inherits 'this' from setupWithArrow's scope
            // setupWithArrow's 'this' = the EventHandler instance ✓
            this.clicked++;
            console.log(`${this.name} clicked ${this.clicked} times`); // ✓
        });
    }
}

// ── The classic 'this' problem in async code ───────────────
class DataFetcher {
    constructor(url) {
        this.url  = url;
        this.data = null;
    }

    // Problem: 'this' lost inside callback
    fetchWithRegular() {
        fetch(this.url) // 'this' = DataFetcher here ✓
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                this.data = data; // ✗ 'this' = undefined! (regular fn, strict mode)
            });
    }

    // Solution 1: arrow functions (most common modern fix)
    fetchWithArrow() {
        fetch(this.url)   // 'this' = DataFetcher ✓
            .then(response => response.json())  // arrow inherits 'this'
            .then(data => {
                this.data = data; // ✓ 'this' = DataFetcher (inherited)
                console.log("Loaded:", this.data);
            });
    }

    // Solution 2: async/await (sidesteps the problem entirely)
    async fetchWithAsync() {
        const response = await fetch(this.url); // 'this' = DataFetcher ✓
        this.data      = await response.json(); // 'this' = DataFetcher ✓
        console.log("Loaded:", this.data);
    }

    // Solution 3: bind (old way)
    fetchWithBind() {
        fetch(this.url)
            .then(function(response) { return response.json(); }.bind(this))
            .then(function(data) {
                this.data = data; // ✓ bound to DataFetcher
            }.bind(this));
    }

    // Solution 4: cache 'this' in a variable (old way)
    fetchWithSelf() {
        const self = this; // capture 'this' before callback
        fetch(this.url)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                self.data = data; // ✓ uses the cached reference
            });
    }
}

// ── Arrow in class methods — when to use, when NOT to ──────
class Counter {
    count = 0; // class field

    // Regular method — goes on prototype (shared, memory efficient)
    // 'this' determined at call time
    increment() {
        this.count++;
    }

    // Arrow as class field — goes on INSTANCE (not prototype)
    // 'this' ALWAYS = the instance (permanent lexical binding)
    // Useful for event handlers / callbacks
    decrement = () => {
        this.count--;
    }
}

const c1 = new Counter();
const c2 = new Counter();

// Regular method: shared via prototype
console.log(c1.increment === c2.increment); // true — same function

// Arrow class field: each instance gets its OWN copy
console.log(c1.decrement === c2.decrement); // false — different functions!
// This is WHY class fields as arrows are used for callbacks:
// they're safe to pass around without losing 'this'

const { decrement } = c1;
decrement(); // ✓ 'this' = c1 always — even extracted from object
c1.increment.call(c2); // changes c2.count — regular method, this can be changed


// ============================================================
// SECTION 7: 'this' IN DIFFERENT CONTEXTS
// ============================================================

// ── Global context ─────────────────────────────────────────
// At the top level of a script (not a module):
console.log(this); // Window (browser) / {} (Node module) / global (Node script)

// ── Inside a regular function ──────────────────────────────
function test() {
    console.log(this); // undefined (strict) or Window/global (non-strict)
}

// ── Inside an object method ────────────────────────────────
const obj2 = {
    test() {
        console.log(this); // the obj2 object
    }
};

// ── Inside a class ─────────────────────────────────────────
class MyClass {
    constructor() {
        console.log(this); // the new instance being created
    }
    method() {
        console.log(this); // the instance (when called as instance.method())
    }
}

// ── Inside an event handler ────────────────────────────────
button.addEventListener("click", function() {
    console.log(this); // the button element (regular function)
});
button.addEventListener("click", () => {
    console.log(this); // outer scope's 'this' (arrow — NOT the button!)
});

// ── Inside setTimeout / setInterval ───────────────────────
const obj3 = {
    name: "Ayush",
    start() {
        setTimeout(function() {
            console.log(this.name); // undefined — 'this' = Window/global
        }, 1000);

        setTimeout(() => {
            console.log(this.name); // "Ayush" — arrow inherits from start()
        }, 1000);
    }
};
obj3.start();

// ── 'this' in class static methods ─────────────────────────
class MathUtils {
    static PI = 3.14159;

    static circleArea(r) {
        // 'this' = MathUtils class itself (not an instance)
        return this.PI * r * r;
    }
}
console.log(MathUtils.circleArea(5)); // uses MathUtils.PI via 'this'

// ── 'this' in getters and setters ─────────────────────────
const rectangle = {
    width:  10,
    height: 5,
    get area() {
        return this.width * this.height; // 'this' = rectangle
    },
    set dimensions({ width, height }) {
        this.width  = width;   // 'this' = rectangle
        this.height = height;
    }
};
console.log(rectangle.area); // 50
rectangle.dimensions = { width: 20, height: 8 };
console.log(rectangle.area); // 160


// ============================================================
// SECTION 8: PRIORITY ORDER — which rule wins?
// ============================================================
// When multiple rules could apply, higher priority wins.
//
// PRIORITY (highest to lowest):
//   1. new binding
//   2. Explicit binding (bind wins over call/apply)
//   3. Implicit binding (method call)
//   4. Default binding

// Test 1: new vs explicit bind
function Foo() {
    console.log(this);
}
const obj4      = { name: "explicit" };
const BoundFoo  = Foo.bind(obj4);

BoundFoo();         // 'this' = obj4 (explicit binding)
new BoundFoo();     // 'this' = new empty object (new WINS over bind!)
// New always creates a fresh object — even bound functions obey new

// Test 2: explicit vs implicit
function greetFn() {
    return this.name;
}
const obj5 = { name: "implicit", greet: greetFn };

obj5.greet();                   // "implicit" — implicit binding
obj5.greet.call({ name: "explicit" }); // "explicit" — explicit WINS

// Test 3: implicit vs default
const obj6 = {
    name: "object",
    fn() { return this.name; }
};
obj6.fn();         // "object" — implicit binding (has object before dot)
const f = obj6.fn;
f();               // undefined — default binding (no object before dot)


// ============================================================
// SECTION 9: COMMON 'this' BUGS AND FIXES
// ============================================================

// ── BUG 1: Method extracted from object ────────────────────
const user = {
    name: "Ayush",
    greet() { return `Hello ${this.name}`; }
};

const greet         = user.greet;
console.log(greet()); // "Hello undefined" ✗

// Fix: bind
const greetBound    = user.greet.bind(user);
console.log(greetBound()); // "Hello Ayush" ✓

// ── BUG 2: Callback loses 'this' ───────────────────────────
class Button {
    constructor(label) {
        this.label   = label;
        this.clicks  = 0;
    }

    // BUG: passed as callback — 'this' lost
    handleClickBug() {
        this.clicks++;
        console.log(`${this.label} clicked ${this.clicks} times`);
    }

    // FIX 1: bind in constructor
    constructor2(label) {
        this.label        = label;
        this.clicks       = 0;
        this.handleClick  = this.handleClickBug.bind(this); // bound once
    }

    // FIX 2: arrow class field (most modern)
    handleClick = () => {
        this.clicks++;
        console.log(`${this.label} clicked ${this.clicks} times`);
    }
}

const btn = new Button("Submit");
// Both safe to use as callbacks:
document.addEventListener("click", btn.handleClick);

// ── BUG 3: 'this' in nested regular functions ───────────────
const team = {
    name: "Dev Team",
    members: ["Ayush", "Alice", "Bob"],

    // BUG: 'this' lost in the inner function
    listMembersBug() {
        this.members.forEach(function(member) {
            // 'this' here ≠ team — regular function called without object
            console.log(`${this.name}: ${member}`); // "undefined: Ayush"
        });
    },

    // FIX 1: arrow function (inherits 'this' from listMembers)
    listMembersArrow() {
        this.members.forEach(member => {
            console.log(`${this.name}: ${member}`); // ✓ "Dev Team: Ayush"
        });
    },

    // FIX 2: bind the callback
    listMembersBind() {
        this.members.forEach(function(member) {
            console.log(`${this.name}: ${member}`); // ✓
        }.bind(this));
    },

    // FIX 3: cache 'this' (old way, still works)
    listMembersSelf() {
        const self = this;
        this.members.forEach(function(member) {
            console.log(`${self.name}: ${member}`); // ✓
        });
    },

    // FIX 4: forEach's second argument — sets 'this' for the callback
    listMembersThisArg() {
        this.members.forEach(function(member) {
            console.log(`${this.name}: ${member}`); // ✓
        }, this); // ← second argument to forEach = 'this' for callback
    }
};

team.listMembersBug();       // "undefined: Ayush" — wrong
team.listMembersArrow();     // "Dev Team: Ayush" — correct
team.listMembersBind();      // "Dev Team: Ayush" — correct
team.listMembersSelf();      // "Dev Team: Ayush" — correct
team.listMembersThisArg();   // "Dev Team: Ayush" — correct

// ── BUG 4: 'this' in promise chains ────────────────────────
class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.data    = null;
    }

    // BUG: regular function in .then loses 'this'
    fetchBug() {
        fetch(this.baseUrl)
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                this.data = data; // ✗ 'this' = undefined
            });
    }

    // FIX: arrows in .then (most common)
    fetchFix() {
        fetch(this.baseUrl)
            .then(res => res.json())  // arrow — 'this' inherited
            .then(data => {
                this.data = data;     // ✓ 'this' = Api instance
            });
    }
}


// ============================================================
// SECTION 10: INTERVIEW QUESTIONS ON 'this'
// ============================================================

// Q1: What is 'this' in JavaScript?
// 'this' refers to the object currently executing the function.
// Its value is determined by HOW the function is called, not
// where it is defined (except arrow functions).

// Q2: What are the rules that determine 'this'?
// 1. new binding:      new Fn()  → 'this' = new empty object
// 2. Explicit binding: fn.call/apply/bind(obj) → 'this' = obj
// 3. Implicit binding: obj.fn() → 'this' = obj
// 4. Default binding:  fn() → 'this' = undefined/global

// Q3: What is 'this' in an arrow function?
// Arrow functions have NO own 'this'.
// They inherit 'this' from their surrounding lexical scope.
// Cannot be changed with call/apply/bind.

// Q4: Predict the output:
const obj7 = {
    val: 42,
    getVal() { return this.val; }
};
const fn1 = obj7.getVal;
console.log(fn1()); // undefined — default binding (no object before dot)
console.log(obj7.getVal()); // 42 — implicit binding

// Q5: Predict the output:
function makeObj() {
    return {
        name: "inner",
        getName: () => this.name // arrow — 'this' = makeObj's 'this'
    };
}
const o = makeObj();
console.log(o.getName()); // undefined (makeObj called without object)
// If makeObj were called as obj.makeObj(), 'this' = obj in arrow

// Q6: How do you fix 'this' in a callback?
// 3 options: .bind(this), arrow function, cache in variable (self = this)

// Q7: What does bind() return?
// A NEW function with 'this' permanently set.
// The bound function's 'this' cannot be changed even by call/apply.

// Q8: What is the difference between call and apply?
// call(obj, a, b, c)  — args passed individually
// apply(obj, [a,b,c]) — args passed as array

// Q9: Can you change 'this' of an arrow function?
// NO. Arrow functions inherit 'this' lexically.
// bind/call/apply on arrow functions are ignored (for 'this').
const arrowFn2 = () => this;
arrowFn2.call({ name: "test" }); // 'this' is still outer scope
// (first argument to call is ignored for arrow functions)

// Q10: What is 'this' in a class constructor?
// 'this' = the new instance being created.
// Used to set properties on the instance.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// RULE 1 — DEFAULT (lowest priority):
//   fn()              → this = undefined (strict) / global (non-strict)
//
// RULE 2 — IMPLICIT:
//   obj.fn()          → this = obj (object before the dot)
//   obj.a.b.fn()      → this = obj.a.b (IMMEDIATE object before dot)
//
// RULE 3 — EXPLICIT:
//   fn.call(obj, a)   → this = obj, invoke immediately
//   fn.apply(obj,[a]) → this = obj, invoke immediately, args as array
//   fn.bind(obj, a)   → this = obj, returns NEW function (permanent)
//
// RULE 4 — new (highest priority):
//   new Fn()          → this = new empty object
//
// ARROW FUNCTIONS (special — no own 'this'):
//   () => {}          → this = outer scope's this (lexical)
//                        cannot be changed with call/apply/bind
//
// COMMON FIXES for lost 'this':
//   1. .bind(this)                      — explicit permanent binding
//   2. Arrow function instead of regular — lexical 'this'
//   3. Arrow in callback: () => fn()    — calls as method
//   4. const self = this                — cache reference
//   5. async/await                      — sidesteps callback issue
//
// GOLDEN RULES:
// 1. 'this' = who CALLS the function (except arrows)
// 2. Arrow functions NEVER have own 'this' — always lexical
// 3. Extracting a method LOSES its 'this' — use bind
// 4. new beats bind beats obj.method beats standalone call
// 5. In strict mode, default 'this' = undefined (not global)
// 6. Arrow in class field = own copy per instance (not on prototype)
// 7. Regular class method = shared on prototype, 'this' flexible
// 8. bind returns NEW function — original unchanged
// 9. forEach/map/filter accept thisArg as second parameter
// 10. async/await sidesteps most 'this' callback problems