// ============================================================
// OBJECT ORIENTED PROGRAMMING IN JAVASCRIPT — Complete Guide
// ============================================================
// OOP is a programming paradigm (style/approach) that organizes
// code around OBJECTS rather than functions and logic.
//
// An OBJECT bundles together:
//   - DATA (properties/attributes) — what the object HAS
//   - BEHAVIOR (methods) — what the object CAN DO
//
// Real world: a CAR object
//   Properties: brand, color, speed, fuel
//   Methods:    accelerate(), brake(), refuel()
//
// 4 PILLARS of OOP:
//   1. ENCAPSULATION — bundle data + behavior, hide internals
//   2. ABSTRACTION   — expose only what's needed, hide complexity
//   3. INHERITANCE   — child class gets parent's properties/methods
//   4. POLYMORPHISM  — same method name, different behavior per class
//
// JavaScript's OOP is PROTOTYPE-BASED — different from Java/C++
// Classes in JS (ES6) are SYNTACTIC SUGAR over prototypes.
// Understanding prototypes is key to truly understanding JS OOP.


// ============================================================
// SECTION 1: OBJECTS — the foundation
// ============================================================
// Before classes, understand plain objects.
// An object is a collection of key-value pairs.

// Object literal — simplest way to create an object
const car = {
    // Properties — data the object holds
    brand:  "Toyota",
    model:  "Camry",
    speed:  0,
    fuel:   100,

    // Methods — functions that belong to the object
    // 'this' refers to the object itself
    accelerate(amount) {
        this.speed += amount;
        this.fuel  -= amount * 0.5;
        console.log(`Speed: ${this.speed} km/h, Fuel: ${this.fuel}L`);
    },

    brake(amount) {
        this.speed = Math.max(0, this.speed - amount);
        console.log(`Braked. Speed: ${this.speed} km/h`);
    },

    describe() {
        return `${this.brand} ${this.model} going ${this.speed} km/h`;
    }
};

car.accelerate(50); // Speed: 50, Fuel: 75
car.brake(20);      // Speed: 30
console.log(car.describe()); // "Toyota Camry going 30 km/h"

// Problem with object literals:
// What if you need 100 cars? You'd copy-paste 100 times.
// Solution: factory functions or classes (covered below)


// ============================================================
// SECTION 2: 'this' KEYWORD — the most misunderstood concept
// ============================================================
// 'this' refers to the object that is CALLING the method.
// Its value depends on HOW and WHERE the function is called.
// Not where it's defined — where it's CALLED.

// Rule 1: Method call — 'this' = the object before the dot
const person = {
    name: "Ayush",
    greet() {
        console.log("Hello, I am", this.name); // this = person
    }
};
person.greet(); // "Hello, I am Ayush" — person called greet()

// Rule 2: Regular function call — 'this' = undefined (strict mode)
//         or global object (window in browser, non-strict)
function standalone() {
    console.log(this); // undefined (strict) or window (non-strict)
}
standalone();

// Rule 3: Arrow functions — NO own 'this'
//         Inherit 'this' from the surrounding scope
const obj = {
    name: "Ayush",
    greetArrow: () => {
        console.log(this.name); // undefined! arrow has no own 'this'
                                 // 'this' comes from outer scope (module/global)
    },
    greetRegular() {
        console.log(this.name); // "Ayush" ✓ — regular method has own 'this'

        // But inside a callback (arrow is correct here):
        const nums = [1, 2, 3];
        nums.forEach(n => {
            console.log(this.name, n); // 'this' inherited from greetRegular
        });                             // works because arrow inherits 'this'
    }
};
obj.greetArrow();   // undefined
obj.greetRegular(); // "Ayush" 1, "Ayush" 2, "Ayush" 3

// Rule 4: 'this' lost when method assigned to variable
const greetFn = person.greet;
greetFn(); // undefined — lost the 'person' context!
           // Fix: use .bind() to permanently attach 'this'
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hello, I am Ayush" ✓

// ── call(), apply(), bind() — manually set 'this' ──────────
function introduce(city, country) {
    console.log(`I'm ${this.name} from ${city}, ${country}`);
}

const user1 = { name: "Ayush" };
const user2 = { name: "Alice" };

// call() — call immediately, pass args one by one
introduce.call(user1, "Kolkata", "India");  // "I'm Ayush from Kolkata, India"
introduce.call(user2, "London",  "UK");     // "I'm Alice from London, UK"

// apply() — call immediately, pass args as ARRAY
introduce.apply(user1, ["Kolkata", "India"]); // same result
// Memory trick: Apply = Array

// bind() — returns a NEW function with 'this' permanently set
const ayushIntro = introduce.bind(user1, "Kolkata");
ayushIntro("India");   // "I'm Ayush from Kolkata, India"
ayushIntro("Germany"); // "I'm Ayush from Kolkata, Germany"
// bind is used to create reusable functions with preset context


// ============================================================
// SECTION 3: FACTORY FUNCTIONS — creating multiple objects
// ============================================================
// A factory function returns a new object each time it's called.
// No 'new' keyword needed. Simple and straightforward.

function createPerson(name, age, role) {
    // Private variable — not accessible from outside (closure)
    let loginCount = 0;

    return {
        // Public properties
        name,  // shorthand for name: name (ES6)
        age,
        role,

        // Public methods
        greet() {
            return `Hi, I'm ${this.name}, a ${this.role}`;
        },

        login() {
            loginCount++;
            return `${this.name} logged in (${loginCount} times)`;
        },

        // Getter — access private loginCount without exposing it
        getLoginCount() {
            return loginCount; // can read private variable
        }
    };
}

const person1 = createPerson("Ayush", 21, "Developer");
const person2 = createPerson("Alice", 25, "Designer");

console.log(person1.greet());         // "Hi, I'm Ayush, a Developer"
console.log(person1.login());         // "Ayush logged in (1 times)"
console.log(person1.login());         // "Ayush logged in (2 times)"
console.log(person1.getLoginCount()); // 2
console.log(person1.loginCount);      // undefined — private! ✓

// Problem with factory functions:
// Every object gets its OWN COPY of every method.
// 1000 persons = 1000 copies of greet(), login() etc.
// Memory wasteful. Solution: prototypes and classes.


// ============================================================
// SECTION 4: PROTOTYPES — JavaScript's inheritance mechanism
// ============================================================
// Every object in JS has a hidden [[Prototype]] property.
// It points to another object — the "prototype".
// When you access a property, JS looks:
//   1. On the object itself
//   2. On its prototype
//   3. On the prototype's prototype
//   ... all the way to null
// This chain is called the PROTOTYPE CHAIN.

// Every function has a .prototype property (an object).
// Objects created with 'new' get their [[Prototype]] set
// to the constructor function's .prototype.

function PersonConstructor(name, age) {
    // 'this' = the new empty object being created
    this.name = name; // own property
    this.age  = age;  // own property
    // Methods should NOT go here — each instance would get own copy
}

// Methods go on prototype — SHARED by all instances (memory efficient!)
PersonConstructor.prototype.greet = function() {
    return `Hi, I'm ${this.name}`;
};
PersonConstructor.prototype.isAdult = function() {
    return this.age >= 18;
};

const p1 = new PersonConstructor("Ayush", 21);
const p2 = new PersonConstructor("Alice", 15);

console.log(p1.greet());    // "Hi, I'm Ayush"
console.log(p2.isAdult());  // false

// p1 and p2 SHARE the same greet/isAdult functions (not copies)
console.log(p1.greet === p2.greet); // true — same function in memory!

// ── What 'new' keyword does internally ─────────────────────
// new PersonConstructor("Ayush", 21) does:
//   1. Creates a new empty object {}
//   2. Sets its [[Prototype]] to PersonConstructor.prototype
//   3. Calls PersonConstructor with 'this' = the new object
//   4. Returns the object (unless constructor explicitly returns an object)

// Manually doing what 'new' does (so you understand it):
function manualNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype); // step 1 + 2
    Constructor.apply(obj, args);                      // step 3
    return obj;                                        // step 4
}
const p3 = manualNew(PersonConstructor, "Bob", 30);
console.log(p3.greet()); // "Hi, I'm Bob" ✓

// ── Prototype chain lookup ──────────────────────────────────
console.log(p1.hasOwnProperty("name"));  // true — 'name' is on p1 itself
console.log(p1.hasOwnProperty("greet")); // false — 'greet' is on prototype

// toString() works even though we never defined it
// JS found it on Object.prototype (top of every chain)
console.log(p1.toString()); // "[object Object]" — from Object.prototype

// Prototype chain for p1:
// p1 → PersonConstructor.prototype → Object.prototype → null

// ── Object.getPrototypeOf() — inspect the chain ────────────
console.log(Object.getPrototypeOf(p1) === PersonConstructor.prototype); // true
console.log(Object.getPrototypeOf(PersonConstructor.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of chain


// ============================================================
// SECTION 5: CLASSES — modern syntax (ES6)
// ============================================================
// Classes are syntactic sugar over prototype-based inheritance.
// Same mechanics underneath, much cleaner syntax.
// Introduced in ES6 (2015). Standard in modern JS.

class Person {
    // constructor — runs when 'new Person()' is called
    constructor(name, age) {
        this.name = name; // public property
        this.age  = age;
        this._loginCount = 0; // _ prefix = convention for "private" (not truly private)
    }

    // Methods — automatically go on Person.prototype (not copied to each instance)
    greet() {
        return `Hi, I'm ${this.name}, ${this.age} years old`;
    }

    isAdult() {
        return this.age >= 18;
    }

    login() {
        this._loginCount++;
        return `${this.name} logged in (${this._loginCount} times)`;
    }

    // Getter — access like a property: person.info (no parentheses)
    get info() {
        return `${this.name} | Age: ${this.age}`;
    }

    // Setter — set like a property: person.age = 25
    set age(value) {
        if (value < 0 || value > 150) {
            throw new Error("Invalid age");
        }
        this._age = value;
    }
    get age() {
        return this._age;
    }

    // Static method — called on CLASS itself, not on instances
    // Person.create() not person.create()
    static create(name, age) {
        return new Person(name, age);
    }

    // Static property
    static species = "Homo sapiens";

    // toString — override default [object Object]
    toString() {
        return `Person(${this.name}, ${this.age})`;
    }
}

const ayush = new Person("Ayush", 21);
const alice = new Person("Alice", 16);

console.log(ayush.greet());   // "Hi, I'm Ayush, 21 years old"
console.log(alice.isAdult()); // false
console.log(ayush.login());   // "Ayush logged in (1 times)"
console.log(ayush.info);      // "Ayush | Age: 21" — getter, no ()

// Static — called on class, not instance
const bob = Person.create("Bob", 30);
console.log(Person.species); // "Homo sapiens"
// ayush.species → undefined (static not on instances)

// Class still uses prototypes under the hood
console.log(typeof Person); // "function" — classes ARE functions!
console.log(ayush.greet === alice.greet); // true — shared via prototype


// ============================================================
// SECTION 6: ENCAPSULATION — hiding internal details
// ============================================================
// Encapsulation = bundle data + behavior together,
//                 expose only what's needed,
//                 hide internal implementation.
//
// WHY: prevents accidental modification, easier to change internals.

// ── Private fields using # (ES2022) ────────────────────────
// True private — cannot be accessed from outside the class AT ALL
class BankAccount {
    #balance;      // private field — must declare at top
    #pin;
    #transactions;

    constructor(owner, initialBalance, pin) {
        this.owner    = owner;    // public
        this.#balance = initialBalance; // private
        this.#pin     = pin;            // private
        this.#transactions = [];        // private
    }

    // Public interface — the only way to interact with private data
    deposit(amount) {
        if (amount <= 0) throw new Error("Deposit must be positive");
        this.#balance += amount;
        this.#transactions.push({ type: "deposit", amount, date: new Date() });
        console.log(`Deposited ₹${amount}. New balance: ₹${this.#balance}`);
    }

    withdraw(pin, amount) {
        this.#verifyPin(pin); // private method call
        if (amount > this.#balance) throw new Error("Insufficient funds");
        this.#balance -= amount;
        this.#transactions.push({ type: "withdrawal", amount, date: new Date() });
        console.log(`Withdrew ₹${amount}. New balance: ₹${this.#balance}`);
    }

    getBalance(pin) {
        this.#verifyPin(pin);
        return this.#balance;
    }

    getStatement() {
        return this.#transactions.map(t =>
            `${t.type}: ₹${t.amount} on ${t.date.toLocaleDateString()}`
        );
    }

    // Private method — can only be called from inside the class
    #verifyPin(pin) {
        if (pin !== this.#pin) throw new Error("Invalid PIN");
    }
}

const account = new BankAccount("Ayush", 10000, 1234);
account.deposit(5000);           // ₹5000 deposited
account.withdraw(1234, 2000);    // ₹2000 withdrawn
console.log(account.getBalance(1234)); // 13000

// console.log(account.#balance); // ❌ SyntaxError — truly private!
// account.#verifyPin(1234);      // ❌ SyntaxError — private method!
console.log(account.owner);      // "Ayush" ✓ — public

// ── Getters and Setters for validation ──────────────────────
class Temperature {
    #celsius;

    constructor(celsius) {
        this.celsius = celsius; // goes through setter
    }

    set celsius(value) {
        if (value < -273.15) throw new Error("Below absolute zero!");
        this.#celsius = value;
    }

    get celsius() { return this.#celsius; }

    // Computed getters — derived values
    get fahrenheit() { return this.#celsius * 9/5 + 32; }
    get kelvin()     { return this.#celsius + 273.15; }
}

const temp = new Temperature(100);
console.log(temp.celsius);    // 100
console.log(temp.fahrenheit); // 212
console.log(temp.kelvin);     // 373.15
// temp.celsius = -300; // ❌ Error: Below absolute zero!


// ============================================================
// SECTION 7: INHERITANCE — child gets parent's features
// ============================================================
// Inheritance lets one class EXTEND another.
// The child class gets all properties and methods of the parent.
// Child can add new methods and override parent methods.

class Animal {
    constructor(name, sound, legs) {
        this.name  = name;
        this.sound = sound;
        this.legs  = legs;
        this.energy = 100;
    }

    speak() {
        return `${this.name} says ${this.sound}!`;
    }

    eat(food) {
        this.energy += 30;
        return `${this.name} eats ${food}. Energy: ${this.energy}`;
    }

    sleep() {
        this.energy += 50;
        return `${this.name} sleeps. Energy: ${this.energy}`;
    }

    describe() {
        return `${this.name} has ${this.legs} legs`;
    }

    toString() {
        return `Animal(${this.name})`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        // super() MUST be called first in child constructor
        // Calls parent (Animal) constructor
        super(name, "Woof", 4); // name, sound, legs

        // Add child-specific properties AFTER super()
        this.breed = breed;
        this.tricks = [];
    }

    // New method — only Dogs have this
    learnTrick(trick) {
        this.tricks.push(trick);
        return `${this.name} learned ${trick}!`;
    }

    performTricks() {
        if (this.tricks.length === 0) return `${this.name} knows no tricks`;
        return `${this.name} performs: ${this.tricks.join(", ")}`;
    }

    // OVERRIDE parent method — polymorphism!
    speak() {
        // Can call parent version with super.speak()
        const parentVersion = super.speak(); // "Rex says Woof!"
        return `${parentVersion} (tail wagging)`; // extends parent behavior
    }

    // Override toString
    toString() {
        return `Dog(${this.name}, ${this.breed})`;
    }
}

class Cat extends Animal {
    constructor(name, isIndoor) {
        super(name, "Meow", 4);
        this.isIndoor = isIndoor;
        this.lives    = 9;
    }

    purr() {
        return `${this.name} purrs contentedly...`;
    }

    // Override speak differently than Dog
    speak() {
        const times = Math.floor(Math.random() * 3) + 1;
        return `${this.name} says ${"Meow ".repeat(times).trim()}`;
    }
}

class Bird extends Animal {
    constructor(name, canFly) {
        super(name, "Tweet", 2);
        this.canFly = canFly;
    }

    fly() {
        if (!this.canFly) return `${this.name} cannot fly`;
        return `${this.name} soars through the sky!`;
    }

    // Override speak
    speak() {
        return this.canFly
            ? `${this.name} tweets melodically`
            : `${this.name} tweets from the ground`;
    }
}

const dog  = new Dog("Rex", "Labrador");
const cat  = new Cat("Whiskers", true);
const bird = new Bird("Tweety", true);

console.log(dog.speak());        // "Rex says Woof! (tail wagging)"
console.log(cat.speak());        // "Whiskers says Meow Meow"
console.log(bird.fly());         // "Tweety soars through the sky!"
console.log(dog.eat("bone"));    // inherited from Animal ✓
console.log(dog.learnTrick("sit")); // Dog-specific ✓
console.log(dog.performTricks()); // "Rex performs: sit"

// instanceof — check ancestry
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true — Dog extends Animal
console.log(cat instanceof Dog);    // false

// Multi-level inheritance
class GuideDog extends Dog {
    constructor(name, breed, owner) {
        super(name, breed);         // calls Dog constructor
        this.owner       = owner;
        this.isCertified = false;
    }

    certify() {
        this.isCertified = true;
        return `${this.name} is now a certified guide dog!`;
    }
}

const guide = new GuideDog("Buddy", "Golden Retriever", "John");
console.log(guide.speak());   // inherited from Dog (which inherited from Animal)
console.log(guide.eat("kibble")); // inherited from Animal (2 levels up)
console.log(guide.certify()); // GuideDog-specific
console.log(guide instanceof GuideDog); // true
console.log(guide instanceof Dog);      // true
console.log(guide instanceof Animal);   // true


// ============================================================
// SECTION 8: POLYMORPHISM — same interface, different behavior
// ============================================================
// Polymorphism = many forms.
// Same method name behaves DIFFERENTLY depending on which
// object calls it.
//
// This is the most powerful OOP concept for writing flexible code.
// Write code that works with ANY object that has a specific method,
// regardless of what TYPE that object is.

// All animals have speak() but each does it differently
const animals = [
    new Dog("Rex", "Lab"),
    new Cat("Whiskers", true),
    new Bird("Tweety", true),
    new Animal("Snake", "Hiss", 0),
];

// Polymorphism in action — same call, different results
animals.forEach(animal => {
    console.log(animal.speak());
    // Dog:    "Rex says Woof! (tail wagging)"
    // Cat:    "Whiskers says Meow"
    // Bird:   "Tweety tweets melodically"
    // Animal: "Snake says Hiss!"
    // Each class defines its OWN speak() — code doesn't care which type
});

// Real world polymorphism — payment processing
class Payment {
    constructor(amount) {
        this.amount = amount;
    }
    process() {
        throw new Error("process() must be implemented by subclass");
    }
    getReceipt() {
        return `Payment of ₹${this.amount} processed via ${this.constructor.name}`;
    }
}

class CreditCard extends Payment {
    constructor(amount, cardNumber) {
        super(amount);
        this.cardNumber = cardNumber;
    }
    process() {
        console.log(`Processing ₹${this.amount} via Credit Card ****${this.cardNumber.slice(-4)}`);
        return { success: true, method: "credit_card", amount: this.amount };
    }
}

class UPI extends Payment {
    constructor(amount, upiId) {
        super(amount);
        this.upiId = upiId;
    }
    process() {
        console.log(`Sending ₹${this.amount} to ${this.upiId} via UPI`);
        return { success: true, method: "upi", amount: this.amount };
    }
}

class NetBanking extends Payment {
    constructor(amount, bankCode) {
        super(amount);
        this.bankCode = bankCode;
    }
    process() {
        console.log(`Processing ₹${this.amount} via Net Banking (${this.bankCode})`);
        return { success: true, method: "net_banking", amount: this.amount };
    }
}

// One function handles ANY payment type — polymorphism!
function checkout(cart, payment) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    console.log(`Total: ₹${total}`);

    const result = payment.process(); // calls the RIGHT process() automatically
    if (result.success) {
        console.log(payment.getReceipt());
    }
}

const cart = [{ name: "Book", price: 299 }, { name: "Pen", price: 49 }];

checkout(cart, new CreditCard(348, "1234567890123456"));
checkout(cart, new UPI(348, "ayush@upi"));
checkout(cart, new NetBanking(348, "HDFC"));
// checkout() doesn't know or care WHICH payment type — it just calls process()


// ============================================================
// SECTION 9: ABSTRACTION — hiding complexity
// ============================================================
// Abstraction = expose a simple interface, hide the complex
// implementation details inside.
// Users of the class don't need to know HOW it works,
// just WHAT it does.

class DatabaseConnection {
    #connection = null;
    #queryCount = 0;
    #isConnected = false;

    constructor(host, database) {
        this.host     = host;
        this.database = database;
    }

    // Public interface — simple and clean
    async connect() {
        console.log(`Connecting to ${this.database}...`);
        await this.#establishConnection(); // private — hidden complexity
        this.#isConnected = true;
        console.log("Connected!");
    }

    async query(sql, params = []) {
        this.#ensureConnected();
        this.#validateQuery(sql);
        const sanitized = this.#sanitizeParams(params);
        this.#queryCount++;
        return this.#executeQuery(sql, sanitized);
    }

    async disconnect() {
        if (this.#isConnected) {
            await this.#closeConnection();
            this.#isConnected = false;
            console.log("Disconnected");
        }
    }

    get stats() {
        return { queries: this.#queryCount, connected: this.#isConnected };
    }

    // Private methods — implementation details hidden from users
    async #establishConnection() {
        // Complex TCP handshake, auth, connection pooling...
        // User doesn't need to know about this
        this.#connection = { id: Math.random() };
    }

    #ensureConnected() {
        if (!this.#isConnected) throw new Error("Not connected to database");
    }

    #validateQuery(sql) {
        if (!sql || typeof sql !== "string") throw new Error("Invalid query");
    }

    #sanitizeParams(params) {
        // Prevent SQL injection — hidden from user
        return params.map(p => String(p).replace(/['"]/g, ""));
    }

    async #executeQuery(sql, params) {
        // Low-level query execution — hidden from user
        return { rows: [], sql, params, time: "3ms" };
    }

    async #closeConnection() {
        this.#connection = null;
    }
}

// User only needs to know: connect, query, disconnect
const db = new DatabaseConnection("localhost", "myapp");
// User calls 3 simple methods — doesn't know about sanitization,
// connection pooling, validation happening internally
async function useDB() {
    await db.connect();
    const users = await db.query("SELECT * FROM users WHERE id = ?", [1]);
    console.log(db.stats); // { queries: 1, connected: true }
    await db.disconnect();
}
useDB();


// ============================================================
// SECTION 10: MIXINS — adding abilities without inheritance
// ============================================================
// Problem: JS only allows single inheritance (one parent class).
// What if you need features from multiple sources?
// Solution: Mixins — objects that contain methods to be mixed into classes.

// Mixin 1: Serialization ability
const Serializable = {
    serialize() {
        return JSON.stringify(this);
    },
    deserialize(json) {
        return Object.assign(Object.create(this), JSON.parse(json));
    }
};

// Mixin 2: Timestamp tracking ability
const Timestamped = {
    setCreatedAt() {
        this.createdAt = new Date().toISOString();
        return this;
    },
    setUpdatedAt() {
        this.updatedAt = new Date().toISOString();
        return this;
    },
    getAge() {
        return Date.now() - new Date(this.createdAt);
    }
};

// Mixin 3: Event emitting ability
const EventEmitter = {
    _handlers: {},
    on(event, handler) {
        if (!this._handlers[event]) this._handlers[event] = [];
        this._handlers[event].push(handler);
        return this;
    },
    emit(event, data) {
        (this._handlers[event] || []).forEach(h => h(data));
        return this;
    },
    off(event, handler) {
        this._handlers[event] = (this._handlers[event] || [])
            .filter(h => h !== handler);
        return this;
    }
};

// Apply mixins to a class using Object.assign on prototype
class User {
    constructor(name, email) {
        this.name  = name;
        this.email = email;
        this._handlers = {}; // needed for EventEmitter mixin
        this.setCreatedAt(); // from Timestamped mixin
    }

    login() {
        this.emit("login", { user: this.name, time: new Date() }); // from EventEmitter
        return `${this.name} logged in`;
    }
}

// Mix in abilities — copy mixin methods onto User.prototype
Object.assign(User.prototype, Serializable, Timestamped, EventEmitter);

const user = new User("Ayush", "ayush@example.com");

// Now User has ALL mixin abilities
user.on("login", data => console.log("Login event:", data.user));
user.login();                          // emits event → "Login event: Ayush"
console.log(user.createdAt);           // timestamp from Timestamped
console.log(user.serialize());         // JSON from Serializable


// ============================================================
// SECTION 11: OBJECT.CREATE — pure prototype inheritance
// ============================================================
// Object.create(proto) creates an object with proto as its [[Prototype]]
// More direct way to set up prototype chains without classes

const animalProto = {
    speak() {
        return `${this.name} says ${this.sound}`;
    },
    eat(food) {
        return `${this.name} eats ${food}`;
    }
};

// Create objects that inherit from animalProto
const lion = Object.create(animalProto);
lion.name  = "Leo";
lion.sound = "Roar";

console.log(lion.speak()); // "Leo says Roar" — found on prototype
console.log(Object.getPrototypeOf(lion) === animalProto); // true

// Object.create(null) — create object with NO prototype
// No toString, no hasOwnProperty — pure key-value store
const pureMap = Object.create(null);
pureMap.key1 = "value1";
pureMap.key2 = "value2";
// console.log(pureMap.toString()); // TypeError — no prototype chain!
// Use for: dictionaries where keys might clash with Object methods


// ============================================================
// SECTION 12: REAL WORLD — E-COMMERCE SYSTEM
// ============================================================
// Combining all OOP concepts in one realistic example

class Product {
    #stock;

    constructor(id, name, price, stock) {
        this.id    = id;
        this.name  = name;
        this.price = price;
        this.#stock = stock;
    }

    get stock() { return this.#stock; }

    get isAvailable() { return this.#stock > 0; }

    reduceStock(qty) {
        if (qty > this.#stock) throw new Error(`Insufficient stock for ${this.name}`);
        this.#stock -= qty;
    }

    toString() {
        return `${this.name} — ₹${this.price} (${this.#stock} left)`;
    }
}

class DigitalProduct extends Product {
    constructor(id, name, price, downloadUrl) {
        super(id, name, price, Infinity); // digital = unlimited stock
        this.downloadUrl = downloadUrl;
    }

    reduceStock() {
        // Override — digital products don't run out
        // Do nothing
    }

    get downloadLink() {
        return `${this.downloadUrl}?token=${Math.random().toString(36).slice(2)}`;
    }
}

class Cart {
    #items = new Map(); // productId → { product, qty }
    #owner;

    constructor(owner) {
        this.#owner = owner;
    }

    addItem(product, qty = 1) {
        if (!product.isAvailable) {
            throw new Error(`${product.name} is out of stock`);
        }
        const current = this.#items.get(product.id);
        this.#items.set(product.id, {
            product,
            qty: current ? current.qty + qty : qty
        });
        console.log(`Added ${qty}x ${product.name} to cart`);
    }

    removeItem(productId) {
        this.#items.delete(productId);
    }

    get subtotal() {
        let total = 0;
        this.#items.forEach(({ product, qty }) => {
            total += product.price * qty;
        });
        return total;
    }

    get itemCount() {
        let count = 0;
        this.#items.forEach(({ qty }) => count += qty);
        return count;
    }

    get items() {
        return Array.from(this.#items.values());
    }

    checkout(payment) {
        if (this.#items.size === 0) throw new Error("Cart is empty");

        // Polymorphism — works with any payment type
        const result = payment.process();

        if (result.success) {
            // Reduce stock for each item
            this.#items.forEach(({ product, qty }) => {
                product.reduceStock(qty);
            });
            const order = new Order(this.#owner, this.items, this.subtotal);
            this.#items.clear();
            return order;
        }
        throw new Error("Payment failed");
    }
}

class Order {
    static #counter = 1000;

    constructor(customer, items, total) {
        this.id       = `ORD-${++Order.#counter}`;
        this.customer = customer;
        this.items    = items;
        this.total    = total;
        this.status   = "confirmed";
        this.date     = new Date();
    }

    get summary() {
        const itemList = this.items
            .map(({ product, qty }) => `  ${product.name} x${qty} = ₹${product.price * qty}`)
            .join("\n");
        return `Order ${this.id}\n${itemList}\nTotal: ₹${this.total}`;
    }
}

// Using the system
const laptop  = new Product(1, "Laptop",  45000, 10);
const course  = new DigitalProduct(2, "JS Course", 999, "https://cdn.example.com/course");
const headset = new Product(3, "Headset",  2500,  5);

const myCart = new Cart("Ayush");
myCart.addItem(laptop,  1);
myCart.addItem(course,  1);
myCart.addItem(headset, 2);

console.log(`Cart: ${myCart.itemCount} items, ₹${myCart.subtotal}`);

const order = myCart.checkout(new UPI(myCart.subtotal, "ayush@upi"));
console.log(order.summary);
console.log(`Laptop stock remaining: ${laptop.stock}`); // 9


// ============================================================
// SECTION 13: INTERVIEW QUESTIONS ON OOP IN JS
// ============================================================

// Q1: What are the 4 pillars of OOP?
// Encapsulation — bundle data + methods, hide internals
// Abstraction   — simple interface, hide complexity
// Inheritance   — child gets parent's features (extends)
// Polymorphism  — same method name, different behavior per class

// Q2: What is a prototype in JavaScript?
// Every object has a [[Prototype]] — a link to another object.
// When accessing a property, JS walks up the prototype chain
// until found or null is reached.

// Q3: What is the difference between __proto__ and prototype?
// prototype — property on CONSTRUCTOR FUNCTIONS (and classes)
//             Contains methods shared by all instances
// __proto__  — property on INSTANCES (all objects)
//              Points to the constructor's .prototype
// Object.getPrototypeOf(obj) is the modern way to access __proto__

// Q4: What does the 'new' keyword do?
// 1. Creates an empty object {}
// 2. Sets its [[Prototype]] to Constructor.prototype
// 3. Calls Constructor with 'this' = new object
// 4. Returns the object

// Q5: What is the difference between class and prototype?
// Classes (ES6) are syntactic sugar over prototype-based inheritance.
// Same behavior, cleaner syntax. typeof ClassName === "function".

// Q6: What is super()?
// Calls the parent class constructor from within a child class.
// Must be called BEFORE accessing 'this' in child constructor.
// super.method() calls parent's version of a method.

// Q7: What is a static method?
// Belongs to the CLASS itself — not to instances.
// Called as ClassName.method() — not instance.method().
// Used for utility functions, factory methods.

// Q8: How do you make a private property in JS?
// # prefix (ES2022): truly private — syntax error if accessed outside
// _ prefix: convention only — still accessible (not truly private)

// Q9: What is the difference between inheritance and mixins?
// Inheritance: single parent, IS-A relationship (Dog IS-A Animal)
// Mixins: add abilities from multiple sources without hierarchy
//         HAS-A relationship (User HAS serialization ability)

// Q10: What is polymorphism and why is it useful?
// Same method name, different implementation per class.
// Write code that works with any object having that method —
// without knowing the specific type. Enables flexible, extensible code.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// CLASS SYNTAX:
//   class Name {
//     #privateField;                    // private field
//     constructor(args) { }            // runs on new Name()
//     method() { }                      // on prototype (shared)
//     get prop() { return this.x; }    // getter — no ()
//     set prop(val) { this.x = val; }  // setter
//     static method() { }              // on class, not instance
//   }
//
// INHERITANCE:
//   class Child extends Parent {
//     constructor() {
//       super(); // MUST call before this
//     }
//     override() { super.override(); } // call parent version
//   }
//
// 'this' RULES:
//   method call:   this = the object before the dot
//   regular fn:    this = undefined (strict) / global (non-strict)
//   arrow fn:      this = inherited from surrounding scope
//   new:           this = the new object being created
//
// BINDING:
//   fn.call(obj, arg1, arg2)    // call immediately, args separate
//   fn.apply(obj, [arg1, arg2]) // call immediately, args as array
//   fn.bind(obj, arg1)          // return new fn with fixed this
//
// PRIVATE:
//   #field   → truly private (ES2022) — SyntaxError if accessed outside
//   _field   → convention only — still accessible
//
// GOLDEN RULES:
// 1. Classes are sugar over prototypes — typeof Class === "function"
// 2. Methods on prototype are SHARED — not copied to each instance
// 3. Arrow functions have NO own 'this' — inherit from outer scope
// 4. super() must be called before 'this' in child constructor
// 5. Static methods on CLASS, instance methods on prototype
// 6. Use # for true privacy, _ is just a naming convention
// 7. instanceof checks entire prototype chain
// 8. Favor composition (mixins) over deep inheritance chains
// 9. Getters/setters allow validation when reading/writing properties
// 10. Polymorphism = write code for the interface, not the specific type