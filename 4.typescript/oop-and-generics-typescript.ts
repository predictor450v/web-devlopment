/**
 * File: oop-and-generics-typescript.ts
 *
 * Covers:
 * - Classes, Constructors
 * - Access Modifiers (public, private, protected)
 * - Getters & Setters
 * - Static Members
 * - Abstract Classes
 * - Interfaces & Function Interfaces
 * - Index Signatures
 * - Interface Merging
 * - Generics (single, multiple, interfaces)
 * - Type Declarations (.d.ts concept)
 */
export {};
// ======================================================
// 1. CLASSES INTRODUCTION
// ======================================================

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, I am ${this.name}`;
  }
}

const p1 = new Person("Ayushman", 20);
console.log(p1.greet());


// ======================================================
// 2. ACCESS MODIFIERS
// ======================================================

class User {
  public username: string;
  private password: string;
  protected role: string;

  constructor(username: string, password: string, role: string) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  public showUser() {
    console.log(this.username);
  }

  private showPassword() {
    console.log(this.password);
  }
}

/**
 * Interview Insight:
 * public → accessible everywhere
 * private → only inside class
 * protected → inside class + subclasses
 */


// ======================================================
// 3. PROTECTED MODIFIER
// ======================================================

class Admin extends User {
  constructor(username: string, password: string) {
    super(username, password, "admin");
  }

  getRole() {
    return this.role; // ✅ allowed (protected)
  }
}


// ======================================================
// 4. GETTERS & SETTERS
// ======================================================

class BankAccount {
  private _balance: number = 0;

  get balance(): number {
    return this._balance;
  }

  set balance(amount: number) {
    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }
    this._balance = amount;
  }
}

const account = new BankAccount();
account.balance = 1000;
console.log(account.balance);


/**
 * Interview Insight:
 * - Encapsulation
 * - Validation logic inside setter
 */


// ======================================================
// 5. STATIC MEMBERS
// ======================================================

class MathUtil {
  static PI: number = 3.14;

  static square(n: number): number {
    return n * n;
  }
}

console.log(MathUtil.PI);
console.log(MathUtil.square(4));

/**
 * Static:
 * - Belongs to class, not instance
 */


// ======================================================
// 6. ABSTRACT CLASSES
// ======================================================

abstract class Animal {
  abstract makeSound(): void;

  move() {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Bark");
  }
}

const dog = new Dog();
dog.makeSound();
dog.move();

/**
 * Interview Insight:
 * - Cannot instantiate abstract class
 * - Must implement abstract methods
 */


// ======================================================
// 7. INTERFACES INTRO
// ======================================================

interface Product {
  id: string;
  name: string;
  price: number;
}

const product: Product = {
  id: "101",
  name: "Laptop",
  price: 50000,
};


// ======================================================
// 8. INTERFACES FOR FUNCTIONS
// ======================================================

interface AddFunction {
  (a: number, b: number): number;
}

const add: AddFunction = (a, b) => a + b;


// ======================================================
// 9. INDEX SIGNATURES
// ======================================================

interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: "Ayushman",
  city: "Kolkata",
};

/**
 * Useful for dynamic object keys
 */


// ======================================================
// 10. INTERFACE MERGING
// ======================================================

interface Car {
  brand: string;
}

interface Car {
  model: string;
}

/**
 * Merged automatically
 */
const car: Car = {
  brand: "Toyota",
  model: "Innova",
};

/**
 * Interview Insight:
 * - Only interfaces support merging
 * - Types DO NOT
 */


// ======================================================
// 11. GENERICS BASICS
// ======================================================

function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(10);
const str = identity<string>("Hello");


/**
 * Why generics?
 * - Reusable, type-safe functions
 */


// ======================================================
// 12. MULTIPLE GENERIC TYPES
// ======================================================

function pair<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

const result = pair<string, number>("Age", 20);


// ======================================================
// 13. GENERIC INTERFACES
// ======================================================

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

const response: ApiResponse<string> = {
  data: "Success",
  success: true,
};

/**
 * Real-world use:
 * - APIs
 * - HTTP responses
 */


// ======================================================
// 14. TYPE DECLARATIONS (.d.ts)
// ======================================================

/**
 * .d.ts files:
 * - Only contain type definitions
 * - No actual implementation
 *
 * Example (not executable here):
 *
 * declare function greet(name: string): string;
 *
 * Used for:
 * - External JS libraries
 * - Type definitions (@types packages)
 */


/**
 * Interview Insight:
 * - .d.ts files are for TYPE SYSTEM only
 * - No runtime code
 */


// ======================================================
// FINAL OUTPUT
// ======================================================

console.log("✅ OOP & Generics Concepts Completed");