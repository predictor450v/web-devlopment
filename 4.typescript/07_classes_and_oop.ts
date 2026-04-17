export {};
// =============================================================================
//  07 | CLASSES & OOP IN TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 06_arrays_tuples_enums.ts
//  Next File     : 08_generics.ts
//
//  This file covers:
//    1. Classes and constructors
//    2. Access modifiers (public, private, protected)
//    3. Parameter properties (shorthand constructor)
//    4. Readonly properties in classes
//    5. Getters and setters
//    6. Static members
//    7. Inheritance (extends)
//    8. Abstract classes
//    9. Implementing interfaces (implements)
//   10. Method overriding
//   11. Private with # (JS native) vs private keyword (TS)
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — CLASSES & CONSTRUCTORS
// -----------------------------------------------------------------------------

// A class is a blueprint for creating objects with properties and methods.

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

const person1 = new Person("Ayushman", 21);
console.log(person1.greet()); // "Hi, I'm Ayushman and I'm 21 years old."

// TS enforces the constructor contract:
// new Person("Ayushman"); // ERROR — expected 2 arguments, got 1


// -----------------------------------------------------------------------------
//  SECTION 2 — ACCESS MODIFIERS
// -----------------------------------------------------------------------------

// TypeScript adds three access modifiers that control visibility:
//
//  Modifier    | Inside Class | Subclass | Outside
//  ------------|-------------|----------|--------
//  public      | YES         | YES      | YES       (default)
//  protected   | YES         | YES      | NO
//  private     | YES         | NO       | NO

class User {
  public username: string;       // accessible everywhere (default)
  private password: string;      // only inside this class
  protected role: string;        // inside this class + subclasses

  constructor(username: string, password: string, role: string) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  // public method — accessible everywhere
  public showInfo(): string {
    return `${this.username} (${this.role})`;
  }

  // private method — only callable inside this class
  private hashPassword(): string {
    return `hashed_${this.password}`;
  }

  public getHashedPassword(): string {
    return this.hashPassword(); // OK — private accessed within class
  }
}

const user = new User("ayush", "secret123", "admin");
console.log(user.username);          // OK — public
// console.log(user.password);       // ERROR — private
// console.log(user.role);           // ERROR — protected
console.log(user.showInfo());        // OK — public method
console.log(user.getHashedPassword()); // OK — calls private internally


// -----------------------------------------------------------------------------
//  SECTION 3 — PARAMETER PROPERTIES (SHORTHAND)
// -----------------------------------------------------------------------------

// Instead of declaring properties AND assigning in the constructor,
// you can do both at once using parameter properties.

// LONG WAY (what we did above):
class ProductLong {
  name: string;
  price: number;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

// SHORT WAY (parameter properties):
class Product {
  constructor(
    public name: string,
    public price: number,
    private sku: string,
    protected category: string = "general", // default values work too
  ) {
    // No need for this.name = name — TS does it automatically!
  }

  display(): string {
    return `${this.name} - $${this.price} (SKU: ${this.sku})`;
  }
}

const laptop = new Product("MacBook", 150000, "MB-001");
console.log(laptop.display()); // "MacBook - $150000 (SKU: MB-001)"

// WHY THIS MATTERS:
// Parameter properties reduce boilerplate significantly.
// Most production TS code uses this pattern.


// -----------------------------------------------------------------------------
//  SECTION 4 — READONLY PROPERTIES IN CLASSES
// -----------------------------------------------------------------------------

class Config {
  constructor(
    public readonly host: string,
    public readonly port: number,
  ) {}
}

const cfg = new Config("localhost", 3000);
console.log(cfg.host); // "localhost"
// cfg.host = "remote"; // ERROR — readonly, can't reassign after construction

// readonly can be combined with any access modifier:
class ImmutableUser {
  constructor(
    public readonly id: string,
    private readonly createdAt: Date = new Date(),
  ) {}

  getCreatedAt(): Date {
    return this.createdAt;
  }
}


// -----------------------------------------------------------------------------
//  SECTION 5 — GETTERS & SETTERS
// -----------------------------------------------------------------------------

// Getters and setters let you control access to properties
// with custom logic (validation, transformation, etc.)

class BankAccount {
  private _balance: number = 0;

  // GETTER — accessed like a property: account.balance
  get balance(): number {
    return this._balance;
  }

  // SETTER — assigned like a property: account.balance = 1000
  set balance(amount: number) {
    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }
    this._balance = amount;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this._balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this._balance) throw new Error("Insufficient funds");
    this._balance -= amount;
  }
}

const account = new BankAccount();
account.balance = 1000;    // calls the setter (validates amount)
console.log(account.balance); // calls the getter -> 1000
account.deposit(500);
console.log(account.balance); // 1500

// WHY USE GETTERS/SETTERS?
//   - Encapsulation: hide the internal _balance property
//   - Validation: setter rejects negative values
//   - Computed properties: getter can calculate values on the fly

// NAMING CONVENTION:
// Private field: _balance (underscore prefix)
// Public getter/setter: balance (no underscore)


// -----------------------------------------------------------------------------
//  SECTION 6 — STATIC MEMBERS
// -----------------------------------------------------------------------------

// Static members belong to the CLASS itself, not to instances.
// You access them via ClassName.member, not instance.member.

class MathUtils {
  static PI: number = 3.14159;

  static square(n: number): number {
    return n * n;
  }

  static cube(n: number): number {
    return n * n * n;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

console.log(MathUtils.PI);        // 3.14159
console.log(MathUtils.square(5)); // 25
console.log(MathUtils.cube(3));   // 27
console.log(MathUtils.clamp(15, 0, 10)); // 10

// You DON'T create instances of utility classes:
// const m = new MathUtils(); // Works, but pointless — use the class directly.

// REAL-WORLD USES:
//   - Utility functions (validators, formatters)
//   - Factory methods
//   - Singleton pattern
//   - Constants (MathUtils.PI)

// STATIC COUNTER PATTERN:
class Employee {
  static count: number = 0;

  constructor(public name: string) {
    Employee.count++;
  }
}

new Employee("Alice");
new Employee("Bob");
console.log(Employee.count); // 2


// -----------------------------------------------------------------------------
//  SECTION 7 — INHERITANCE (extends)
// -----------------------------------------------------------------------------

class Animal {
  constructor(
    public name: string,
    protected speed: number,
  ) {}

  move(): string {
    return `${this.name} moves at ${this.speed} km/h`;
  }
}

class Dog extends Animal {
  constructor(name: string, speed: number, public breed: string) {
    super(name, speed); // MUST call super() first
  }

  bark(): string {
    return `${this.name} says: Woof!`;
  }

  // Can access protected members:
  sprint(): string {
    return `${this.name} sprints at ${this.speed * 2} km/h`;
  }
}

const doggo = new Dog("Bruno", 30, "Labrador");
console.log(doggo.move());   // "Bruno moves at 30 km/h"
console.log(doggo.bark());   // "Bruno says: Woof!"
console.log(doggo.sprint()); // "Bruno sprints at 60 km/h"

// SUPER KEYWORD:
// super() — calls the parent constructor (MUST be first line in child constructor)
// super.method() — calls the parent's version of an overridden method


// -----------------------------------------------------------------------------
//  SECTION 8 — ABSTRACT CLASSES
// -----------------------------------------------------------------------------

// Abstract classes CANNOT be instantiated directly.
// They define a CONTRACT that subclasses MUST implement.

abstract class Shape {
  constructor(public color: string) {}

  // Abstract method — no implementation. Subclass MUST override.
  abstract area(): number;
  abstract perimeter(): number;

  // Regular method — inherited as-is (can be overridden).
  describe(): string {
    return `A ${this.color} shape with area ${this.area().toFixed(2)}`;
  }
}

// const s = new Shape("red"); // ERROR — cannot instantiate abstract class

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }

  // MUST implement abstract methods:
  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(color: string, public width: number, public height: number) {
    super(color);
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const circle = new Circle("red", 5);
console.log(circle.describe());    // "A red shape with area 78.54"
console.log(circle.perimeter());   // 31.42

const rect = new Rectangle("blue", 4, 6);
console.log(rect.describe());     // "A blue shape with area 24.00"

// WHEN TO USE ABSTRACT CLASSES:
// When you want to share some code (methods) but force subclasses
// to implement certain methods themselves.


// -----------------------------------------------------------------------------
//  SECTION 9 — IMPLEMENTING INTERFACES
// -----------------------------------------------------------------------------

// A class can IMPLEMENT an interface — it must provide all declared members.

interface Printable {
  print(): void;
}

interface Saveable {
  save(path: string): boolean;
}

// A class can implement MULTIPLE interfaces:
class Document implements Printable, Saveable {
  constructor(public content: string) {}

  print(): void {
    console.log(`Printing: ${this.content}`);
  }

  save(path: string): boolean {
    console.log(`Saving to ${path}`);
    return true;
  }
}

const doc = new Document("Hello World");
doc.print();           // "Printing: Hello World"
doc.save("/docs/hw");  // "Saving to /docs/hw"

// ABSTRACT CLASS vs INTERFACE:
//   Abstract class: can have implemented methods + abstract methods
//   Interface: only declares the shape (no implementation)
//   A class can extend ONE class but implement MANY interfaces.


// -----------------------------------------------------------------------------
//  SECTION 10 — METHOD OVERRIDING
// -----------------------------------------------------------------------------

class Base {
  greet(): string {
    return "Hello from Base";
  }
}

class Derived extends Base {
  // Override the parent method:
  greet(): string {
    return "Hello from Derived";
  }

  greetBoth(): string {
    return `${super.greet()} AND ${this.greet()}`;
  }
}

const d = new Derived();
console.log(d.greet());     // "Hello from Derived"
console.log(d.greetBoth()); // "Hello from Base AND Hello from Derived"

// OVERRIDE KEYWORD (TS 4.3+):
// With noImplicitOverride: true in tsconfig, you must use `override`:
class StrictDerived extends Base {
  override greet(): string {
    return "Hello from StrictDerived";
  }
}
// This catches typos — if the method name doesn't match a parent method, TS errors.


// -----------------------------------------------------------------------------
//  SECTION 11 — PRIVATE: # (JS) vs private (TS)
// -----------------------------------------------------------------------------

// TypeScript has TWO ways to make fields private:

// 1. TS `private` keyword — compile-time only (erased in JS output)
class TSPrivate {
  private secret: string = "hidden";
}
// new TSPrivate().secret; // TS ERROR — but accessible at runtime in JS!

// 2. JS `#` private field — true runtime privacy (ES2022+)
class JSPrivate {
  #secret: string = "truly hidden";

  getSecret(): string {
    return this.#secret;
  }
}
// new JSPrivate().#secret; // BOTH TS error AND JS runtime error

// WHICH TO USE?
// #private: true privacy, works in modern JS, slightly better security
// private keyword: more compatible, cleaner syntax

// In practice, both work. Use `private` keyword for most cases.
// Use `#` when you need actual runtime privacy (security-sensitive code).


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT                 SYNTAX
//  ----------------------  --------------------------------------------------
//  Class                   class Name { constructor() {} }
//  public                  public prop: Type (default, accessible everywhere)
//  private                 private prop: Type (class only)
//  protected               protected prop: Type (class + subclasses)
//  readonly                readonly prop: Type (set once, can't change)
//  Parameter property      constructor(public name: string) {}
//  Getter                  get prop(): Type { return this._prop; }
//  Setter                  set prop(val: Type) { this._prop = val; }
//  Static                  static method(): Type { ... }
//  Inheritance             class Child extends Parent { ... }
//  Abstract class          abstract class Name { abstract method(): Type; }
//  Implement interface     class Name implements Interface { ... }
//  Override                override method(): Type { ... }
//  JS private              #prop: Type (true runtime privacy)


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What are access modifiers in TypeScript?
//  A: public (accessible everywhere), private (class only),
//     protected (class + subclasses). Default is public.
//
//  Q2: What are parameter properties?
//  A: A shorthand for declaring + initializing class properties in the
//     constructor. Adding an access modifier to a constructor param
//     automatically creates and assigns the property.
//
//  Q3: What is an abstract class?
//  A: A class that cannot be instantiated directly. It can have abstract
//     methods (no implementation — subclasses must implement) and regular
//     methods (shared implementation). Used to define contracts with
//     partial implementation.
//
//  Q4: What is the difference between extends and implements?
//  A: extends: inherits from a class (one parent only).
//     implements: promises to match an interface shape (multiple allowed).
//     extends gives you code; implements gives you a contract.
//
//  Q5: What is the difference between TS `private` and JS `#private`?
//  A: TS `private` is compile-time only — removed in JS output, accessible
//     at runtime. JS `#private` is true runtime privacy — can't be accessed
//     even in JavaScript. Use `private` for most cases; `#` for security.
//
//  Q6: When should you use getters/setters?
//  A: When you need validation logic on assignment, computed properties,
//     lazy initialization, or encapsulation of internal state. They let
//     you control access while keeping the API look like simple properties.


console.log("-- 07_classes_and_oop.ts executed successfully --");
