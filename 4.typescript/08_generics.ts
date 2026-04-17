export {};
// =============================================================================
//  08 | GENERICS
// =============================================================================
//
//  Prerequisites : 07_classes_and_oop.ts
//  Next File     : 09_utility_types.ts
//
//  This file covers:
//    1. Why generics? (the problem they solve)
//    2. Generic functions
//    3. Generic interfaces
//    4. Generic classes
//    5. Generic constraints (extends)
//    6. Multiple generic parameters
//    7. Default generic types
//    8. keyof with generics
//    9. Generic utility patterns
//   10. Common real-world examples
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — WHY GENERICS?
// -----------------------------------------------------------------------------

// Problem: You want a function that works with ANY type but preserves type info.

// OPTION 1: Use `any` — works but LOSES type safety:
function identityAny(value: any): any {
  return value;
}
const resultAny = identityAny("hello");
// resultAny is `any` — TS has no idea what it is. Useless.

// OPTION 2: Write one function per type — works but DUPLICATES code:
function identityString(value: string): string { return value; }
function identityNumber(value: number): number { return value; }
// This doesn't scale. What about booleans, objects, arrays...?

// OPTION 3: GENERICS — works and PRESERVES type safety:
function identity<T>(value: T): T {
  return value;
}

const str = identity<string>("hello");   // str is string
const num = identity<number>(42);        // num is number
const bool = identity(true);             // TS infers T as boolean

// T is a TYPE PARAMETER — a placeholder that gets filled in when called.
// Think of it as: "Whatever type you put IN, you get the SAME type OUT."


// -----------------------------------------------------------------------------
//  SECTION 2 — GENERIC FUNCTIONS
// -----------------------------------------------------------------------------

// The <T> after the function name declares a type parameter.
// Convention: T, U, V for generic names. Use descriptive names for clarity.

// SIMPLE — wrap a value in an array:
function wrapInArray<T>(value: T): T[] {
  return [value];
}

console.log(wrapInArray("hello")); // ["hello"] — type: string[]
console.log(wrapInArray(42));      // [42]      — type: number[]

// GET FIRST ELEMENT — preserves the element type:
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = getFirst([10, 20, 30]); // first is number | undefined
const firstStr = getFirst(["a", "b"]); // firstStr is string | undefined

// SWAP — uses two generic params:
function swap<T, U>(pair: [T, U]): [U, T] {
  return [pair[1], pair[0]];
}

const swapped = swap(["age", 21]); // [21, "age"] — type: [number, string]

// ARROW FUNCTION GENERIC SYNTAX:
const lastElement = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

// NOTE: In .tsx files, <T> can conflict with JSX. Use <T,> or <T extends unknown>:
// const fn = <T,>(val: T): T => val;


// -----------------------------------------------------------------------------
//  SECTION 3 — GENERIC INTERFACES
// -----------------------------------------------------------------------------

// Interfaces can also be generic — they describe shapes that work with any type.

interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: number;
}

// Use with different data types:
const userResponse: ApiResponse<{ name: string; age: number }> = {
  data: { name: "Ayushman", age: 21 },
  success: true,
  timestamp: Date.now(),
};

const numberResponse: ApiResponse<number[]> = {
  data: [1, 2, 3],
  success: true,
  timestamp: Date.now(),
};

// GENERIC INTERFACE FOR COLLECTIONS:
interface Collection<T> {
  items: T[];
  add(item: T): void;
  getById(index: number): T | undefined;
  count(): number;
}

// GENERIC INTERFACE FOR KEY-VALUE STORES:
interface KeyValueStore<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
}


// -----------------------------------------------------------------------------
//  SECTION 4 — GENERIC CLASSES
// -----------------------------------------------------------------------------

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Stack of numbers:
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
console.log(numberStack.peek()); // 20
console.log(numberStack.pop());  // 20
console.log(numberStack.size()); // 1

// Stack of strings:
const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
console.log(stringStack.peek()); // "world"

// The SAME class works with ANY type, fully type-safe each time.


// -----------------------------------------------------------------------------
//  SECTION 5 — GENERIC CONSTRAINTS (extends)
// -----------------------------------------------------------------------------

// Sometimes you need to RESTRICT what types T can be.
// Use `extends` to set a constraint.

// PROBLEM: This function accesses .length, but not all types have it:
// function getLength<T>(value: T): number {
//   return value.length; // ERROR — T might not have .length
// }

// SOLUTION: Constrain T to types that HAVE a .length property:
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(value: T): number {
  return value.length; // SAFE — T is guaranteed to have .length
}

console.log(getLength("hello"));     // 5 (string has .length)
console.log(getLength([1, 2, 3]));   // 3 (array has .length)
console.log(getLength({ length: 10 })); // 10 (object with .length)
// getLength(42); // ERROR — number doesn't have .length

// CONSTRAINT WITH OBJECT SHAPE:
function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Ayushman", age: 21, city: "Kolkata" };
console.log(getProperty(person, "name")); // "Ayushman" — return type is string
console.log(getProperty(person, "age"));  // 21 — return type is number
// getProperty(person, "email"); // ERROR — "email" is not a key of person


// -----------------------------------------------------------------------------
//  SECTION 6 — MULTIPLE GENERIC PARAMETERS
// -----------------------------------------------------------------------------

// Use multiple type params when your function needs different types.

function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair("age", 21);       // [string, number]
const p2 = pair(true, [1, 2, 3]); // [boolean, number[]]

// REAL-WORLD: Map/transform function:
function mapValue<Input, Output>(
  value: Input,
  transform: (val: Input) => Output
): Output {
  return transform(value);
}

const doubled = mapValue(5, n => n * 2);          // 10 (number)
const stringified = mapValue(42, n => n.toString()); // "42" (string)
const parsed = mapValue("100", s => parseInt(s));    // 100 (number)


// -----------------------------------------------------------------------------
//  SECTION 7 — DEFAULT GENERIC TYPES
// -----------------------------------------------------------------------------

// You can assign DEFAULT types to generic params (like default function params):

interface Container<T = string> {
  value: T;
}

const strContainer: Container = { value: "hello" };       // T defaults to string
const numContainer: Container<number> = { value: 42 };    // T overridden to number

// Default with constraint:
interface Repository<T extends { id: string | number } = { id: string }> {
  findById(id: T["id"]): T | undefined;
}

// WHEN TO USE:
// When most users will use one type but some need flexibility.


// -----------------------------------------------------------------------------
//  SECTION 8 — keyof WITH GENERICS
// -----------------------------------------------------------------------------

// `keyof T` produces a union of all KEYS of type T.

interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // "id" | "name" | "email"

// COMBINING keyof WITH GENERICS:
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users: User[] = [
  { id: 1, name: "Ayushman", email: "a@b.com" },
  { id: 2, name: "Rahul", email: "r@b.com" },
];

const allNames = pluck(users, "name");   // string[] -> ["Ayushman", "Rahul"]
const allEmails = pluck(users, "email"); // string[] -> ["a@b.com", "r@b.com"]
const allIds = pluck(users, "id");       // number[] -> [1, 2]
// pluck(users, "phone"); // ERROR — "phone" is not a key of User


// -----------------------------------------------------------------------------
//  SECTION 9 — GENERIC UTILITY PATTERNS
// -----------------------------------------------------------------------------

// PATTERN 1: Nullable wrapper
type Nullable<T> = T | null;
let maybeUser: Nullable<User> = null;

// PATTERN 2: Result type (success or failure)
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { ok: false, error: "Division by zero" };
  return { ok: true, value: a / b };
}

const divResult = divide(10, 3);
if (divResult.ok) {
  console.log(divResult.value); // 3.333...
} else {
  console.log(divResult.error); // would show error message
}

// PATTERN 3: Async data wrapper
type AsyncData<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// PATTERN 4: Event handler
type EventHandler<T = Event> = (event: T) => void;


// -----------------------------------------------------------------------------
//  SECTION 10 — COMMON REAL-WORLD EXAMPLES
// -----------------------------------------------------------------------------

// GENERIC FETCH FUNCTION:
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

// Usage:
// const users = await fetchData<User[]>("/api/users");
// users is now typed as User[]

// GENERIC LOCAL STORAGE HELPER:
function getFromStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
}

function setInStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Usage:
// setInStorage("user", { name: "Ayushman", age: 21 });
// const user = getFromStorage<User>("user");

// GENERIC FILTER FUNCTION:
function filterBy<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter(item => item[key] === value);
}

const admins = filterBy(users, "name", "Ayushman");
// Returns only users where name === "Ayushman"


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN                    SYNTAX
//  -------------------------  -------------------------------------------
//  Generic function           function fn<T>(val: T): T
//  Generic interface          interface Box<T> { value: T }
//  Generic class              class Stack<T> { ... }
//  Constraint                 <T extends HasLength>
//  Multiple params            <T, U>
//  Default type               <T = string>
//  keyof                      keyof T -> union of keys
//  Indexed access             T[K] -> value type at key K
//  Generic arrow fn           const fn = <T>(val: T): T => val
//  Constrained key            <T, K extends keyof T>


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What are generics?
//  A: Generics are type parameters — placeholders that let you write
//     reusable code that works with any type while preserving type safety.
//     Think: "type variable" — like a function parameter, but for types.
//
//  Q2: What is the difference between generics and `any`?
//  A: `any` throws away type information. Generics PRESERVE it.
//     identity<string>("hi") returns string. identity(any) returns any.
//     Generics give you flexibility WITHOUT sacrificing safety.
//
//  Q3: What is a generic constraint?
//  A: Using `extends` to restrict what types a generic param can accept.
//     <T extends HasLength> means T must have a .length property.
//     This prevents calling the function with incompatible types.
//
//  Q4: What is keyof?
//  A: keyof T produces a union of all key names of type T.
//     keyof { name: string; age: number } = "name" | "age".
//     Used with generics to write type-safe property access.
//
//  Q5: When should you use generics?
//  A: When you have a function/class/interface that works with multiple
//     types AND you need the output type to depend on the input type.
//     Common: data containers, API wrappers, utility functions.
//
//  Q6: Can a generic parameter have a default type?
//  A: Yes. interface Container<T = string> defaults T to string if not
//     specified. Works like default function parameters.


console.log("-- 08_generics.ts executed successfully --");
