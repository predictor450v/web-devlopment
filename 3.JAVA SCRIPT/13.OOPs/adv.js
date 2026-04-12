// ============================================================
// CLASSES, CONSTRUCTORS, GETTERS/SETTERS, OBJECT.DEFINEPROPERTY
// LEXICAL SCOPE, CLOSURES, PURE & IMPURE FUNCTIONS
// ============================================================
// This file covers 7 interconnected concepts that form the
// backbone of professional JavaScript development.
//
// Road map:
//   1. Class & Constructor     — blueprints for objects
//   2. Getters & Setters       — controlled property access
//   3. Object.defineProperty   — hidden property metadata
//   4. Lexical Scope           — where variables live
//   5. Closures                — functions remembering scope
//   6. Pure Functions          — predictable, safe functions
//   7. Impure Functions        — functions with side effects


// ============================================================
// SECTION 1: CLASS & CONSTRUCTOR — blueprints for objects
// ============================================================
// A CLASS is a template/blueprint for creating objects.
// A CONSTRUCTOR is the function that runs when you do 'new'.
// Every instance created from a class gets:
//   - its own PROPERTIES (from constructor)
//   - shared METHODS (from prototype — not copied to each instance)
//
// Real world: Class = cookie cutter, Instance = actual cookie
// Every cookie has the same SHAPE (class) but different TOPPINGS (data)

class Person {
    // ── Class fields (ES2022) ─────────────────────────────
    // Declared at top — visible, clear about what a Person has
    // Public fields — accessible anywhere
    species = "Homo Sapiens"; // every Person gets this by default

    // Private fields — ONLY accessible inside this class
    // Truly private — SyntaxError if accessed from outside
    #password;
    #loginCount = 0;

    // ── Constructor ───────────────────────────────────────
    // Runs ONCE when 'new Person(...)' is called.
    // 'this' inside = the brand new empty object being created.
    // Purpose: set the initial state of the object.
    constructor(name, age, email) {
        // Validation inside constructor — guard against bad data
        if (!name || typeof name !== "string") {
            throw new Error("Name must be a non-empty string");
        }
        if (age < 0 || age > 150) {
            throw new Error("Age must be between 0 and 150");
        }

        // Public properties — accessible from outside
        this.name  = name;
        this.email = email;

        // Private — stored privately, use getter to access
        this._age     = age;    // _ prefix = convention "handle carefully"
        this.#password = Math.random().toString(36).slice(2); // auto-generated

        console.log(`Person "${name}" created`);
    }

    // ── Instance methods (on prototype — shared) ──────────
    // Lives on Person.prototype — all instances share ONE copy
    greet() {
        return `Hi, I'm ${this.name}, ${this._age} years old`;
    }

    login(password) {
        if (password === this.#password) {
            this.#loginCount++;
            return `Welcome back ${this.name}! (Login #${this.#loginCount})`;
        }
        return "Invalid password";
    }

    getLoginCount() {
        return this.#loginCount; // access private field via public method
    }

    // ── toString override ──────────────────────────────────
    // Called automatically when object converted to string
    toString() {
        return `Person(${this.name}, ${this._age})`;
    }

    // ── Static methods — on CLASS, not instances ───────────
    // Called as Person.create() not person.create()
    // 'this' inside static = the class itself
    static create(name, age, email) {
        return new Person(name, age, email);
    }

    static isAdult(age) {
        return age >= 18;
    }

    // Static property
    static count = 0; // tracks how many Person instances exist
}

// Creating instances
const ayush = new Person("Ayush", 21, "ayush@example.com");
const alice = new Person("Alice", 17, "alice@example.com");

console.log(ayush.greet());         // "Hi, I'm Ayush, 21 years old"
console.log(ayush.species);         // "Homo Sapiens" — class field
console.log(Person.isAdult(21));    // true — static method
// console.log(ayush.#password);    // SyntaxError — truly private!

// Methods are on prototype — shared, not copied
console.log(ayush.greet === alice.greet); // true — same function in memory

// ── INHERITANCE with extends ───────────────────────────────
class Student extends Person {
    // Student-specific private field
    #grades = [];

    constructor(name, age, email, course, studentId) {
        // super() MUST come FIRST — calls Person's constructor
        // Before super(), 'this' does NOT exist — using it throws ReferenceError
        super(name, age, email); // sets name, _age, email, #password

        // Add Student-specific properties AFTER super()
        this.course    = course;
        this.studentId = studentId;
    }

    // New method — only Students have this
    addGrade(subject, score) {
        this.#grades.push({ subject, score, date: new Date() });
        return `Grade added: ${subject} = ${score}`;
    }

    getAverage() {
        if (!this.#grades.length) return 0;
        const total = this.#grades.reduce((sum, g) => sum + g.score, 0);
        return (total / this.#grades.length).toFixed(2);
    }

    // OVERRIDE parent method — polymorphism
    greet() {
        // super.greet() calls Person's greet with this Student's data
        const parentGreet = super.greet();
        return `${parentGreet}, studying ${this.course}`;
    }

    toString() {
        return `Student(${this.name}, ${this.course})`;
    }
}

const student = new Student("Ayush", 21, "a@a.com", "CS", "STU001");
console.log(student.greet());      // "Hi, I'm Ayush, 21, studying CS"
console.log(student.addGrade("Math", 92));
console.log(student.addGrade("Physics", 87));
console.log(student.getAverage()); // "89.50"

// instanceof checks entire prototype chain
console.log(student instanceof Student); // true
console.log(student instanceof Person);  // true — Student extends Person


// ============================================================
// SECTION 2: GETTERS & SETTERS — controlled property access
// ============================================================
// Getters and setters let you intercept property READ and WRITE.
//
// GETTER — runs when you READ the property (no parentheses needed)
// SETTER — runs when you WRITE to the property
//
// From outside, they look like regular properties.
// But inside, they're functions — you control what happens.
//
// WHY use them:
//   - Validate data on the way in (setter)
//   - Compute derived values on the way out (getter)
//   - Log/track when properties are accessed
//   - Maintain invariants (e.g., temperature can't go below -273)

class Temperature {
    // Private storage — the real value lives here
    #celsius;

    constructor(celsius) {
        this.celsius = celsius; // goes through the SETTER automatically
    }

    // SETTER for celsius — validates before storing
    set celsius(value) {
        if (typeof value !== "number") {
            throw new TypeError("Temperature must be a number");
        }
        if (value < -273.15) {
            throw new RangeError(`${value}°C is below absolute zero (-273.15°C)`);
        }
        this.#celsius = value;
        console.log(`Temperature set to ${value}°C`);
    }

    // GETTER for celsius — returns the stored value
    get celsius() {
        return this.#celsius;
    }

    // COMPUTED GETTERS — derived from #celsius, always in sync
    // These look like properties but are actually computed on every access
    get fahrenheit() {
        return (this.#celsius * 9/5) + 32;
    }

    get kelvin() {
        return this.#celsius + 273.15;
    }

    // SETTER for fahrenheit — converts and stores as celsius
    set fahrenheit(value) {
        this.celsius = (value - 32) * 5/9; // uses the celsius setter (validation!)
    }

    get description() {
        if (this.#celsius < 0)   return "Freezing";
        if (this.#celsius < 15)  return "Cold";
        if (this.#celsius < 25)  return "Comfortable";
        if (this.#celsius < 35)  return "Warm";
        return "Hot";
    }
}

const temp = new Temperature(100);
console.log(temp.celsius);    // 100  — getter
console.log(temp.fahrenheit); // 212  — computed getter
console.log(temp.kelvin);     // 373.15 — computed getter
console.log(temp.description); // "Hot"

temp.fahrenheit = 32;          // setter — converts 32°F → 0°C
console.log(temp.celsius);     // 0

// temp.celsius = -300; // RangeError: below absolute zero ✓
// temp.celsius = "hot"; // TypeError: must be a number ✓

// ── Getters/Setters with lazy computation ──────────────────
// Compute expensive values only when first accessed, then cache
class HeavyData {
    #rawData;
    #processedCache = null; // null = not computed yet

    constructor(data) {
        this.#rawData = data;
    }

    get processed() {
        if (this.#processedCache === null) {
            console.log("Computing (expensive operation)...");
            // Simulate expensive operation
            this.#processedCache = this.#rawData
                .filter(n => n % 2 === 0)
                .map(n => n * n)
                .sort((a, b) => b - a);
        } else {
            console.log("Returning cached result");
        }
        return this.#processedCache;
    }

    // Reset cache when data changes
    set rawData(newData) {
        this.#rawData = newData;
        this.#processedCache = null; // invalidate cache
    }
}

const hd = new HeavyData([1,2,3,4,5,6,7,8,9,10]);
console.log(hd.processed); // "Computing..." [100, 64, 36, 16, 4]
console.log(hd.processed); // "Returning cached" [100, 64, 36, 16, 4]
hd.rawData = [2,4,6,8,10]; // invalidate cache
console.log(hd.processed); // "Computing..." new result

// ── Getter-only property (read only) ──────────────────────
class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    // Getter with no matching setter = READ ONLY
    get area() {
        return (Math.PI * this.radius ** 2).toFixed(4);
    }

    get circumference() {
        return (2 * Math.PI * this.radius).toFixed(4);
    }
}

const circle = new Circle(5);
console.log(circle.area);         // "78.5398"
console.log(circle.circumference); // "31.4159"
circle.area = 100; // silently fails (no setter) — strict: TypeError


// ============================================================
// SECTION 3: Object.defineProperty — property metadata
// ============================================================
// Every property has hidden metadata called a PROPERTY DESCRIPTOR.
// Object.defineProperty lets you control this metadata precisely.
//
// Descriptor fields:
//   value        — the property's value
//   writable     — can the value be changed? (default: false with defineProperty)
//   enumerable   — does it show in for...in and Object.keys? (default: false)
//   configurable — can it be deleted or redefined? (default: false)
//
// IMPORTANT: When using defineProperty, all descriptor flags default to FALSE.
// When using normal assignment (obj.x = 1), all flags default to TRUE.

const product = {};

// Define 'id' — read-only, hidden, permanent
Object.defineProperty(product, "id", {
    value:        "PRD-001",
    writable:     false,  // cannot change the value
    enumerable:   false,  // won't show in Object.keys / for...in / JSON.stringify
    configurable: false   // cannot delete or redefine this property
});

// Define 'name' — normal writable property, but non-configurable
Object.defineProperty(product, "name", {
    value:        "Laptop",
    writable:     true,   // can change
    enumerable:   true,   // shows in keys/JSON
    configurable: false   // cannot redefine or delete
});

// Define 'price' — fully normal
Object.defineProperty(product, "price", {
    value:        45000,
    writable:     true,
    enumerable:   true,
    configurable: true
});

console.log(product.id);            // "PRD-001"
product.id = "CHANGED";             // silently fails (strict: TypeError)
console.log(product.id);            // "PRD-001" — unchanged ✓

console.log(Object.keys(product));  // ["name", "price"] — id is hidden!
console.log(JSON.stringify(product)); // {"name":"Laptop","price":45000} — no id!

// delete product.name; // TypeError — non-configurable cannot be deleted

// ── See all descriptors ────────────────────────────────────
console.log(Object.getOwnPropertyDescriptor(product, "id"));
// { value: "PRD-001", writable: false, enumerable: false, configurable: false }

console.log(Object.getOwnPropertyDescriptor(product, "name"));
// { value: "Laptop", writable: true, enumerable: true, configurable: false }

// ── defineProperty with getter/setter ─────────────────────
// Object.defineProperty can define accessor properties (get/set)
// instead of data properties (value/writable)

const bankAccount = { _balance: 10000 };

Object.defineProperty(bankAccount, "balance", {
    get() {
        console.log("Balance accessed");
        return `₹${this._balance}`;
    },
    set(amount) {
        if (amount < 0) throw new Error("Balance cannot be negative");
        console.log(`Balance updated: ₹${this._balance} → ₹${amount}`);
        this._balance = amount;
    },
    enumerable:   true,
    configurable: false
});

console.log(bankAccount.balance); // "Balance accessed" "₹10000"
bankAccount.balance = 15000;      // "Balance updated: ₹10000 → ₹15000"
// bankAccount.balance = -5000;   // Error: cannot be negative ✓

// ── Object.defineProperties — define multiple at once ──────
const config = {};

Object.defineProperties(config, {
    VERSION: {
        value:        "2.1.0",
        writable:     false,
        enumerable:   true,
        configurable: false
    },
    MAX_RETRIES: {
        value:        3,
        writable:     false,
        enumerable:   true,
        configurable: false
    },
    API_URL: {
        value:        "https://api.example.com",
        writable:     false,
        enumerable:   true,
        configurable: false
    },
    _internal: {
        value:        "secret",
        writable:     false,
        enumerable:   false,   // hidden from outside
        configurable: false
    }
});

console.log(config.VERSION);      // "2.1.0"
console.log(Object.keys(config)); // ["VERSION", "MAX_RETRIES", "API_URL"] — no _internal

// ── Practical: making constants on objects ─────────────────
function makeConstants(obj, constants) {
    Object.entries(constants).forEach(([key, value]) => {
        Object.defineProperty(obj, key, {
            value,
            writable:     false,
            enumerable:   true,
            configurable: false
        });
    });
    return obj;
}

const AppConfig = makeConstants({}, {
    DB_HOST:  "localhost",
    DB_PORT:  5432,
    APP_NAME: "MyApp",
    DEBUG:    false
});

AppConfig.DB_HOST = "hacked.com"; // silently fails
console.log(AppConfig.DB_HOST);   // "localhost" — safe ✓

// ── Object.freeze vs Object.seal vs defineProperty ─────────
//
//                   | Add props | Remove props | Change values
// ─────────────────────────────────────────────────────────────
// Normal object      |    ✓      |      ✓       |     ✓
// Object.seal()      |    ✗      |      ✗       |     ✓
// Object.freeze()    |    ✗      |      ✗       |     ✗
// defineProperty     | per prop  |   per prop   |  per prop
//                    | writable:F| configurable:F| writable:F
// ─────────────────────────────────────────────────────────────


// ============================================================
// SECTION 4: LEXICAL SCOPE — where variables live
// ============================================================
// SCOPE = the region of code where a variable EXISTS and is ACCESSIBLE.
// LEXICAL scope = scope is determined by where code is WRITTEN
//                 (not where it's called — that's dynamic scope).
//
// JavaScript uses LEXICAL (static) scope exclusively.
// You can determine a variable's scope just by reading the code.
//
// Scope types:
//   Global scope    — declared outside everything
//   Function scope  — declared inside a function (var, let, const)
//   Block scope     — declared inside {} (let, const only)
//   Module scope    — declared in a module file

// ── Global scope ───────────────────────────────────────────
const globalVar = "I am global"; // visible everywhere below

function readGlobal() {
    console.log(globalVar); // ✓ — inner can access outer
}
readGlobal(); // "I am global"

// ── Function scope ─────────────────────────────────────────
function outer() {
    const outerVar = "I am in outer"; // function scoped

    function inner() {
        const innerVar = "I am in inner"; // function scoped to inner
        console.log(outerVar); // ✓ — inner can see outer
        console.log(innerVar); // ✓ — own variable
    }

    inner();
    console.log(outerVar); // ✓ — own variable
    // console.log(innerVar); // ✗ ReferenceError — can't see inside inner
}
outer();
// console.log(outerVar); // ✗ ReferenceError — can't see inside outer

// ── Block scope (let and const) ────────────────────────────
// let and const are block-scoped — live only inside the {} they're in
// var is NOT block-scoped — it leaks out of blocks (but not functions)

{
    let blockLet   = "block let";
    const blockConst = "block const";
    var blockVar   = "block var"; // leaks out!
}

// console.log(blockLet);   // ✗ ReferenceError — block scoped
// console.log(blockConst); // ✗ ReferenceError — block scoped
console.log(blockVar);      // ✓ "block var" — var ignores block boundaries

// var in if/for blocks leaks out:
if (true) {
    var leaked = "I escaped the if block";
    let safe   = "I stay inside";
}
console.log(leaked); // "I escaped the if block" — var leaked ✗
// console.log(safe); // ReferenceError — let stayed ✓

// ── The scope chain — how JS looks up variables ────────────
// When JS encounters a variable, it searches:
//   1. Current scope
//   2. Parent scope
//   3. Grandparent scope
//   ... all the way to global
// First match found = used. Not found anywhere = ReferenceError
//
// JS NEVER searches inward (child scopes are invisible to parents)

const level1 = "global";

function scopeA() {
    const level2 = "scopeA";

    function scopeB() {
        const level3 = "scopeB";

        function scopeC() {
            const level4 = "scopeC";

            // scopeC can see ALL outer levels
            console.log(level4); // "scopeC"  — own scope
            console.log(level3); // "scopeB"  — parent
            console.log(level2); // "scopeA"  — grandparent
            console.log(level1); // "global"  — great-grandparent
        }

        scopeC();
        // console.log(level4); // ✗ can't see scopeC's variables
    }

    scopeB();
    // console.log(level3); // ✗ can't see scopeB's variables
    // console.log(level4); // ✗ can't see scopeC's variables
}
scopeA();

// ── Shadowing — inner variable hides outer ─────────────────
// When inner scope has same name as outer — inner wins INSIDE,
// outer is untouched outside. They are SEPARATE variables.

const username = "global_user";

function showShadowing() {
    const username = "function_user"; // SHADOWS the global username
    console.log(username); // "function_user" — inner wins

    if (true) {
        const username = "block_user"; // SHADOWS the function username
        console.log(username); // "block_user" — innermost wins
    }

    console.log(username); // "function_user" — block variable gone
}

showShadowing();
console.log(username); // "global_user" — completely untouched

// ── Temporal Dead Zone (TDZ) — let and const ───────────────
// let and const are "hoisted" but NOT initialized.
// The period between the start of scope and the declaration line
// is called the TDZ — accessing in TDZ = ReferenceError

function tdz() {
    // console.log(x); // ✗ ReferenceError — x is in TDZ here
                       // var would give 'undefined' here (hoisted+initialized)
                       // let/const give ReferenceError (hoisted but NOT initialized)

    let x = 10;        // TDZ ends here — x is now safe to use
    console.log(x);    // 10 ✓
}
tdz();

// var hoisting — declared AND initialized to undefined at top of function
function varHoisting() {
    console.log(y); // undefined — var is hoisted AND initialized
    var y = 5;
    console.log(y); // 5
}
// What JS actually sees (mental model):
function varHoistingMental() {
    var y = undefined; // ← hoisted to top of function
    console.log(y);    // undefined
    y = 5;
    console.log(y);    // 5
}


// ============================================================
// SECTION 5: CLOSURES — functions remembering their scope
// ============================================================
// A CLOSURE is formed when a function is defined inside another
// function and REMEMBERS the variables from the outer function's
// scope — even after the outer function has FINISHED executing.
//
// Key insight: the inner function doesn't COPY the variables.
// It holds a LIVE REFERENCE to them.
// Changes to the variable are reflected in the closure.
//
// Every function in JS is a closure — it always carries its
// surrounding scope with it.

// ── Basic closure ──────────────────────────────────────────
function makeAdder(x) {
    // x lives in makeAdder's scope
    // makeAdder finishes executing after returning the inner function
    // BUT x is NOT garbage collected — the inner function holds a reference

    return function(y) {
        return x + y; // x is remembered from makeAdder's scope
    };
}

const add5  = makeAdder(5);  // x = 5, stored in closure
const add10 = makeAdder(10); // x = 10, stored in closure
const add20 = makeAdder(20); // x = 20, stored in closure

console.log(add5(3));   // 8  — x=5 remembered
console.log(add10(3));  // 13 — x=10 remembered
console.log(add20(3));  // 23 — x=20 remembered
console.log(add5(100)); // 105 — still works any time later

// add5, add10, add20 each have their OWN closure with their OWN x

// ── Closure with mutable state ─────────────────────────────
// The closure holds a LIVE REFERENCE — changes persist
function makeCounter(initial = 0, step = 1) {
    // Private state — completely inaccessible from outside
    let count    = initial;
    let totalOps = 0;

    return {
        increment() {
            count += step;
            totalOps++;
            return count;
        },
        decrement() {
            count -= step;
            totalOps++;
            return count;
        },
        reset() {
            count = initial;
            return count;
        },
        getCount()  { return count; },
        getStats()  { return { count, totalOps, initial, step }; }
    };
}

const counter1 = makeCounter(0, 1);   // starts at 0, steps by 1
const counter2 = makeCounter(100, 5); // starts at 100, steps by 5

counter1.increment(); // 1
counter1.increment(); // 2
counter1.increment(); // 3
counter2.increment(); // 105
counter2.decrement(); // 100

console.log(counter1.getCount()); // 3
console.log(counter2.getCount()); // 100
console.log(counter1.getStats()); // { count: 3, totalOps: 3, initial: 0, step: 1 }
// counter1.count → undefined — truly private via closure ✓

// ── Classic closure loop bug — MUST KNOW for interviews ────
console.log("--- Loop with var (bug) ---");
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // prints 3, 3, 3 NOT 0, 1, 2
    }, 100);
}
// WHY? var is function-scoped — all 3 callbacks share the SAME 'i'
// By the time they run, loop is done, i = 3

console.log("--- Loop with let (fix 1) ---");
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2 ✓
    }, 100);
}
// WHY? let is BLOCK scoped — each loop iteration gets its OWN 'i'
// Each callback closes over a DIFFERENT 'i'

console.log("--- Loop with IIFE (fix 2) ---");
for (var i = 0; i < 3; i++) {
    (function(capturedI) { // IIFE creates new scope, captures current i
        setTimeout(function() {
            console.log(capturedI); // 0, 1, 2 ✓
        }, 100);
    })(i); // pass current value of i
}

console.log("--- Loop with bind (fix 3) ---");
for (var i = 0; i < 3; i++) {
    setTimeout(console.log.bind(null, i), 100); // 0, 1, 2 ✓
}

// ── Closure for data privacy — Module Pattern ─────────────
// Before ES6 modules and classes, this was how privacy was achieved
// STILL widely used for utility modules

const BankAccount = (function() {
    // Private — inaccessible from outside the IIFE
    let balance      = 0;
    let transactions = [];
    let accountId    = Math.random().toString(36).slice(2);

    function recordTransaction(type, amount) {
        transactions.push({
            type,
            amount,
            balance,
            timestamp: new Date().toISOString()
        });
    }

    function validateAmount(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
    }

    // Public API — returned object
    return {
        deposit(amount) {
            validateAmount(amount);
            balance += amount;
            recordTransaction("deposit", amount);
            return `Deposited ₹${amount}. Balance: ₹${balance}`;
        },
        withdraw(amount) {
            validateAmount(amount);
            if (amount > balance) throw new Error("Insufficient funds");
            balance -= amount;
            recordTransaction("withdrawal", amount);
            return `Withdrew ₹${amount}. Balance: ₹${balance}`;
        },
        getBalance()      { return balance; },
        getStatement()    { return [...transactions]; }, // copy, not original
        getAccountId()    { return accountId; }
    };
})(); // IIFE — runs immediately, returns the public API object

console.log(BankAccount.deposit(5000));   // "Deposited ₹5000. Balance: ₹5000"
console.log(BankAccount.withdraw(2000));  // "Withdrew ₹2000. Balance: ₹3000"
console.log(BankAccount.getBalance());    // 3000
// BankAccount.balance      → undefined — private ✓
// BankAccount.transactions → undefined — private ✓

// ── Closure for memoization ────────────────────────────────
function memoize(fn) {
    const cache = new Map(); // closed over — persists between calls

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`Cache hit for ${fn.name}(${args})`);
            return cache.get(key);
        }

        console.log(`Computing ${fn.name}(${args})...`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const fastFib = memoize(fibonacci);
console.log(fastFib(10)); // "Computing..." 55
console.log(fastFib(10)); // "Cache hit!" 55 — instant!
console.log(fastFib(20)); // "Computing..." 6765

// ── Closure for function factories ────────────────────────
function makeMultiplier(factor) {
    // factor is closed over — each factory has its own
    return function(number) {
        return number * factor;
    };
}

const double   = makeMultiplier(2);
const triple   = makeMultiplier(3);
const byTen    = makeMultiplier(10);
const byHalf   = makeMultiplier(0.5);

console.log([1, 2, 3, 4, 5].map(double));  // [2, 4, 6, 8, 10]
console.log([1, 2, 3, 4, 5].map(triple));  // [3, 6, 9, 12, 15]
console.log([100, 200].map(byHalf));        // [50, 100]

// ── Closure for partial application ───────────────────────
function partial(fn, ...presetArgs) {
    // fn and presetArgs are closed over
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

function calculatePrice(basePrice, taxRate, discount) {
    const afterTax      = basePrice * (1 + taxRate / 100);
    const afterDiscount = afterTax * (1 - discount / 100);
    return afterDiscount.toFixed(2);
}

// Pre-fill taxRate = 18 (GST)
const priceWithGST = partial(calculatePrice, undefined, 18);
// Wait — undefined doesn't work like that. Let me show correctly:

const addGST = (price, discount) => calculatePrice(price, 18, discount);
const addLuxuryTax = (price, discount) => calculatePrice(price, 28, discount);

console.log(addGST(1000, 10));       // "1062.00" (1000 + 18% GST - 10% disc)
console.log(addLuxuryTax(1000, 5));  // "1216.00" (1000 + 28% tax - 5% disc)


// ============================================================
// SECTION 6: PURE FUNCTIONS — predictable, safe, testable
// ============================================================
// A PURE function has TWO strict rules:
//
//   Rule 1: SAME INPUT → ALWAYS SAME OUTPUT
//           Given the same arguments, always returns the same result.
//           No randomness, no external state, no date/time dependency.
//
//   Rule 2: NO SIDE EFFECTS
//           Does NOT modify anything outside itself:
//           - Does not change arguments (no mutation)
//           - Does not modify global variables
//           - Does not call console.log, fetch, DOM manipulation
//           - Does not write to database, file system
//           - Does not generate random numbers or use Date
//
// WHY pure functions matter:
//   - Predictable — always know what you'll get
//   - Testable — no need to mock or set up state
//   - Cacheable — same input = same output → safe to memoize
//   - Composable — chain them confidently
//   - Parallelizable — no shared state = no race conditions

// ── Pure function examples ─────────────────────────────────

// Pure: only uses parameters, returns new value, no mutation
function add(a, b) {
    return a + b; // same args → same result, always
}

function multiply(a, b) {
    return a * b;
}

function square(n) {
    return n * n;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}

// Pure: array operations that return NEW array (no mutation)
function addItem(array, item) {
    return [...array, item]; // new array — original untouched
}

function removeItem(array, index) {
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

function updateItem(array, index, newValue) {
    return array.map((item, i) => i === index ? newValue : item);
}

// Pure: object operations that return NEW object
function updateUser(user, updates) {
    return { ...user, ...updates }; // new object — original untouched
}

function addProperty(obj, key, value) {
    return { ...obj, [key]: value };
}

// Proof they're pure — originals untouched
const items = [1, 2, 3];
const newItems = addItem(items, 4);
console.log(items);    // [1, 2, 3] — unchanged ✓
console.log(newItems); // [1, 2, 3, 4] — new array

const user = { name: "Ayush", age: 21 };
const updatedUser = updateUser(user, { age: 22, city: "Kolkata" });
console.log(user);        // { name: "Ayush", age: 21 } — unchanged ✓
console.log(updatedUser); // { name: "Ayush", age: 22, city: "Kolkata" }

// ── Pure functions are composable ─────────────────────────
// Chain pure functions — output of one is input of next
// Each step is independent and testable

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processPrice = pipe(
    price => price * 1.18,        // add 18% GST
    price => Math.round(price),   // round to integer
    price => `₹${price}`          // format as string
);

console.log(processPrice(1000)); // "₹1180"
console.log(processPrice(2500)); // "₹2950"
// Completely predictable — same input, same output always

// ── Testing pure functions is trivial ─────────────────────
// No mocks, no setup, no cleanup needed
function runTest(name, fn, input, expected) {
    const result = JSON.stringify(fn(...input));
    const pass   = result === JSON.stringify(expected);
    console.log(`${pass ? "✓" : "✗"} ${name}`);
    if (!pass) console.log(`  Expected: ${JSON.stringify(expected)}, Got: ${result}`);
}

runTest("add(2,3) = 5",           () => add(2, 3),           [],    5);
runTest("addItem adds to array",  () => addItem([1,2], 3),   [],    [1,2,3]);
runTest("removeItem removes idx", () => removeItem([1,2,3],1), [], [1,3]);
runTest("capitalize works",       () => capitalize("hello"), [],    "Hello");


// ============================================================
// SECTION 7: IMPURE FUNCTIONS — functions with side effects
// ============================================================
// An IMPURE function breaks at least one of the pure rules:
//   - Depends on or modifies external state
//   - Same input can produce different output
//   - Causes side effects (I/O, DOM, network, mutation)
//
// Impure functions are NOT bad — they are NECESSARY.
// A program that does NOTHING is pure but useless.
// Reading files, calling APIs, showing UI — all impure.
//
// The art is: ISOLATE impurity.
// Keep most logic pure. Push impurity to the edges.
// This makes code testable and predictable where it matters.

// ── Impure: modifies external state ───────────────────────
let globalCount = 0;

function impureIncrement() {
    globalCount++; // SIDE EFFECT — modifies external variable
    return globalCount;
}

console.log(impureIncrement()); // 1
console.log(impureIncrement()); // 2 — SAME call, different result!
console.log(impureIncrement()); // 3 — not predictable

// ── Impure: mutates arguments ──────────────────────────────
function impurePush(array, item) {
    array.push(item); // MUTATION — modifies the argument!
    return array;
}

const myArr = [1, 2, 3];
impurePush(myArr, 4);
console.log(myArr); // [1, 2, 3, 4] — original changed! Side effect!

// ── Impure: depends on external state ─────────────────────
let taxRate = 18;

function calculateTaxImpure(price) {
    return price * (1 + taxRate / 100); // depends on external taxRate!
}

console.log(calculateTaxImpure(1000)); // 1180
taxRate = 28; // external state changed
console.log(calculateTaxImpure(1000)); // 1280 — SAME INPUT, different output!

// Pure version — taxRate passed as argument
function calculateTaxPure(price, taxRate) {
    return price * (1 + taxRate / 100); // only uses parameters
}
console.log(calculateTaxPure(1000, 18)); // always 1180
console.log(calculateTaxPure(1000, 28)); // always 1280

// ── Impure: I/O and DOM operations ────────────────────────
function impureLog(message) {
    console.log(message); // side effect — writes to console
    return message;
}

function impureFetch(url) {
    return fetch(url); // side effect — network call
}

function impureUpdateDOM(id, text) {
    document.getElementById(id).textContent = text; // side effect — DOM mutation
}

function impureGetTime() {
    return Date.now(); // impure — different result every call!
}

function impureRandom() {
    return Math.random(); // impure — never the same!
}

// ── Impure: non-deterministic ──────────────────────────────
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]; // random = impure
}

// ── The contrast — pure vs impure side by side ─────────────
const shoppingCart = {
    items:    [],
    discount: 0
};

// IMPURE version — mutates the cart directly
function impureAddToCart(item) {
    shoppingCart.items.push(item);        // mutates external object
    shoppingCart.total = shoppingCart.items // recomputes on external
        .reduce((sum, i) => sum + i.price, 0);
    return shoppingCart;
}

// PURE version — takes cart as input, returns NEW cart
function pureAddToCart(cart, item) {
    const newItems = [...cart.items, item];    // new array
    const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
    return { ...cart, items: newItems, total: newTotal }; // new object
}

const cart1 = { items: [], discount: 0 };
const cart2 = pureAddToCart(cart1, { name: "Book",   price: 299 });
const cart3 = pureAddToCart(cart2, { name: "Pen",    price: 49 });
const cart4 = pureAddToCart(cart3, { name: "Laptop", price: 45000 });

console.log(cart1.items.length); // 0 — original untouched ✓
console.log(cart4.items.length); // 3
console.log(cart4.total);        // 45348

// ── Isolating impurity — best practice ────────────────────
// Keep business logic PURE, push I/O to the EDGES

// PURE — business logic (easy to test)
function calculateOrderSummary(items, taxRate, discountCode) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = discountCode === "SAVE10" ? subtotal * 0.10 : 0;
    const taxable  = subtotal - discount;
    const tax      = taxable * (taxRate / 100);
    const total    = taxable + tax;

    return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax:      tax.toFixed(2),
        total:    total.toFixed(2)
    };
}

// IMPURE — I/O layer (hard to test, but isolated)
async function processOrder(userId, cartItems) {
    // Impure: fetch from external source
    const user    = await fetch(`/api/users/${userId}`).then(r => r.json());
    const taxRate = await fetch(`/api/tax/${user.country}`).then(r => r.json());

    // PURE: all computation (easily testable in isolation)
    const summary = calculateOrderSummary(cartItems, taxRate, user.discountCode);

    // Impure: write to external source
    await fetch("/api/orders", {
        method: "POST",
        body:   JSON.stringify({ userId, items: cartItems, ...summary })
    });

    // Impure: DOM manipulation
    document.getElementById("total").textContent = `Total: ₹${summary.total}`;

    return summary;
}
// calculateOrderSummary is pure → unit testable without any mocks
// processOrder is impure → integration test with mocks


// ============================================================
// SECTION 8: EVERYTHING TOGETHER — real world example
// ============================================================
// A Product catalog using classes, getters/setters,
// Object.defineProperty, closures, pure and impure functions

class Product2 {
    #id;
    #stock;
    #priceHistory = [];

    static #nextId = 1000;

    constructor(name, price, stock, category) {
        // Immutable ID using Object.defineProperty on instance
        this.#id = `PRD-${++Product2.#nextId}`;
        Object.defineProperty(this, "id", {
            get: () => this.#id,
            enumerable:   true,
            configurable: false
        });

        this.name     = name;
        this.category = category;
        this.#stock   = stock;
        this._price   = price;
        this.#priceHistory.push({ price, date: new Date() });
    }

    // Getter/Setter for price with validation + history tracking
    get price() { return this._price; }
    set price(newPrice) {
        if (newPrice < 0) throw new RangeError("Price cannot be negative");
        this.#priceHistory.push({ price: newPrice, date: new Date() });
        this._price = newPrice;
    }

    // Computed getter
    get isInStock()     { return this.#stock > 0; }
    get stockStatus()   {
        if (this.#stock === 0)  return "Out of Stock";
        if (this.#stock < 5)   return "Low Stock";
        return "In Stock";
    }

    // Pure method — no side effects, returns new value
    calculateDiscountedPrice(discountPercent) {
        return parseFloat((this._price * (1 - discountPercent / 100)).toFixed(2));
    }

    reduceStock(qty) {
        if (qty > this.#stock) throw new Error(`Only ${this.#stock} items left`);
        this.#stock -= qty;
        return this.#stock;
    }

    get priceHistory() { return [...this.#priceHistory]; } // copy not original
}

// Pure functions for product operations
const sortByPrice    = products => [...products].sort((a,b) => a.price - b.price);
const filterByCategory = (products, cat) => products.filter(p => p.category === cat);
const filterInStock  = products => products.filter(p => p.isInStock);
const getTotalValue  = products => products.reduce((sum, p) => sum + p.price, 0);

// Closure-based product manager
function createProductManager() {
    const products   = [];    // private via closure
    let totalSales   = 0;

    return {
        add(product) {
            products.push(product);
            return this;
        },
        findById(id) {
            return products.find(p => p.id === id) || null;
        },
        // Uses pure functions — no side effects
        getByCategory(cat) { return filterByCategory(products, cat); },
        getInStock()        { return filterInStock(products); },
        getSortedByPrice()  { return sortByPrice(products); },
        getTotalValue()     { return getTotalValue(products); },
        getAll()            { return [...products]; },

        // Impure — modifies state + would call APIs in real code
        sell(productId, qty) {
            const product = this.findById(productId);
            if (!product) throw new Error("Product not found");
            const remaining = product.reduceStock(qty); // side effect
            totalSales += product.price * qty;          // side effect
            return { remaining, totalSales };
        },
        getTotalSales() { return totalSales; }
    };
}

// Usage
const catalog = createProductManager();

const laptop = new Product2("MacBook Pro", 120000, 10, "Electronics");
const phone  = new Product2("iPhone 15",    80000, 25, "Electronics");
const book   = new Product2("Clean Code",     499, 100, "Books");

catalog.add(laptop).add(phone).add(book); // chaining works — returns this

laptop.price = 115000; // price drop via setter — logged in history
console.log(laptop.priceHistory.length); // 2

console.log(catalog.getByCategory("Electronics").length); // 2
console.log(catalog.getTotalValue()); // 200499
console.log(catalog.getSortedByPrice().map(p => p.name));
// ["Clean Code", "iPhone 15", "MacBook Pro"]

catalog.sell(laptop.id, 2);
console.log(laptop.stockStatus); // "In Stock" (8 remaining)
console.log(catalog.getTotalSales()); // 230000


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// CLASS:
//   class Name {
//     #private;                    // truly private field
//     static count = 0;            // class-level property
//     constructor(args) {}         // runs on new Name()
//     method() {}                  // on prototype (shared)
//     get prop() {}                // getter — accessed as property
//     set prop(v) {}               // setter — assigned as property
//     static util() {}             // on class, not instance
//   }
//   class Child extends Parent {
//     constructor() { super(); }   // super() MUST be first
//   }
//
// OBJECT.DEFINEPROPERTY:
//   Object.defineProperty(obj, "key", {
//     value, writable, enumerable, configurable
//   })
//   Defaults: ALL false when using defineProperty
//   Defaults: ALL true when using normal obj.key = value
//
// LEXICAL SCOPE:
//   Scope determined at WRITE time, not run time
//   Inner can see outer — outer CANNOT see inner
//   let/const = block scoped | var = function scoped
//   TDZ: let/const hoisted but not initialized
//
// CLOSURE:
//   Inner function + access to outer scope variables
//   Variables are LIVE REFERENCES not copies
//   Used for: private state, factories, memoization
//
// PURE FUNCTION:
//   Same input → ALWAYS same output
//   NO side effects (no mutation, no I/O, no globals)
//   Returns new values — never modifies arguments
//
// IMPURE FUNCTION:
//   Modifies external state OR depends on it
//   I/O: console, fetch, DOM, file, DB
//   Non-deterministic: Math.random(), Date.now()
//
// GOLDEN RULES:
// 1. Private class fields (#) = truly private (SyntaxError from outside)
// 2. Getters/setters look like properties but are functions — validate in setters
// 3. defineProperty flags default to FALSE — opposite of normal assignment
// 4. Lexical scope = where code WRITTEN determines scope (not where called)
// 5. var leaks out of blocks — let/const stay in their block
// 6. Closures hold LIVE references — changes to variables are reflected
// 7. Classic loop var bug — use let or IIFE to give each iteration own scope
// 8. Pure functions: same input = same output, zero side effects
// 9. Impure functions are necessary — isolate them at the edges of your app
// 10. Keep business logic pure, push I/O (fetch, DOM, DB) to outer layers