export {};
// =============================================================================
//  05 | FUNCTIONS IN TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 04_objects_and_interfaces.ts
//  Next File     : 06_arrays_tuples_enums.ts
//
//  This file covers:
//    1. Function type annotations (params + return)
//    2. Arrow functions
//    3. Optional and default parameters
//    4. Rest parameters
//    5. Function overloads
//    6. Callback types & function type aliases
//    7. `this` parameter typing
//    8. void vs undefined (deep dive)
//    9. never as return type
//   10. Generic functions (intro — full coverage in 08_generics.ts)
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — BASIC FUNCTION TYPE ANNOTATIONS
// -----------------------------------------------------------------------------

// In TypeScript, you annotate function PARAMETERS and RETURN TYPE.

function add(a: number, b: number): number {
  // a: number   -> parameter type
  // b: number   -> parameter type
  // : number    -> return type (after parentheses)
  return a + b;
}

console.log(add(10, 20)); // 30
// add(10, "20"); // ERROR: Argument of type 'string' is not assignable to 'number'

// WHY ANNOTATE RETURN TYPES?
// TS can INFER the return type, but explicitly writing it:
//   - Catches bugs (e.g., accidentally returning wrong type)
//   - Documents intent (makes function signature self-explanatory)
//   - Helps with refactoring (TS alerts all callers if return type changes)

// TS INFERS return type here:
function multiply(a: number, b: number) {
  return a * b; // TS infers return type as `number`
}

// RECOMMENDED: Always annotate params. Annotate return types for public/exported functions.


// -----------------------------------------------------------------------------
//  SECTION 2 — ARROW FUNCTIONS
// -----------------------------------------------------------------------------

// Arrow functions work exactly the same way with type annotations:

const subtract = (a: number, b: number): number => a - b;

const greet = (name: string): string => `Hello, ${name}!`;

// Multi-line arrow function:
const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};

// TYPING A FUNCTION STORED IN A VARIABLE (full type annotation):
const square: (n: number) => number = (n) => n * n;
// The part before = is the TYPE: (n: number) => number
// The part after = is the IMPLEMENTATION: (n) => n * n
// Params in the implementation don't need annotations (TS infers from the type).


// -----------------------------------------------------------------------------
//  SECTION 3 — OPTIONAL AND DEFAULT PARAMETERS
// -----------------------------------------------------------------------------

// OPTIONAL PARAMETERS — use ? (must come AFTER required params)
function greetUser(name: string, title?: string): string {
  // title is string | undefined inside the function
  if (title) {
    return `Hello, ${title} ${name}`;
  }
  return `Hello, ${name}`;
}

console.log(greetUser("Ayushman"));           // "Hello, Ayushman"
console.log(greetUser("Ayushman", "Mr."));    // "Hello, Mr. Ayushman"

// RULE: Optional params MUST come last.
// function wrong(a?: number, b: number) {} // ERROR

// DEFAULT PARAMETERS — assign a default value
function createUser(name: string, role: string = "user"): string {
  return `${name} (${role})`;
}

console.log(createUser("Ayushman"));           // "Ayushman (user)"
console.log(createUser("Ayushman", "admin"));  // "Ayushman (admin)"

// Default params DON'T need ?, they're automatically optional.
// TS infers the type from the default value.

// COMMON MISTAKE:
// Using optional AND default together:
// function bad(x?: number = 5) {} // ERROR — pick one or the other


// -----------------------------------------------------------------------------
//  SECTION 4 — REST PARAMETERS
// -----------------------------------------------------------------------------

// Rest params collect all remaining arguments into an array.
// Syntax: ...paramName: Type[]

function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100

// Rest params with other params (rest must be LAST):
function logWithTag(tag: string, ...messages: string[]): void {
  messages.forEach(msg => console.log(`[${tag}] ${msg}`));
}

logWithTag("INFO", "Server started", "Port 3000");
// [INFO] Server started
// [INFO] Port 3000

// TYPED TUPLES AS REST PARAMS (advanced):
function createPerson(...args: [string, number, boolean]): void {
  const [name, age, active] = args;
  console.log(`${name}, ${age}, active: ${active}`);
}

createPerson("Ayushman", 21, true);


// -----------------------------------------------------------------------------
//  SECTION 5 — FUNCTION OVERLOADS
// -----------------------------------------------------------------------------

// Overloads let you define MULTIPLE signatures for a single function.
// Use when the return type DEPENDS on the input type.

// OVERLOAD SIGNATURES (no body — just the type):
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;

// IMPLEMENTATION SIGNATURE (must handle all cases):
function format(value: string | number | boolean): string {
  if (typeof value === "string") return value.toUpperCase();
  if (typeof value === "number") return value.toFixed(2);
  return value ? "YES" : "NO";
}

console.log(format("hello"));  // "HELLO"
console.log(format(3.14159));  // "3.14"
console.log(format(true));     // "YES"

// REAL-WORLD EXAMPLE — different return types based on input:
function getElementById(id: string): HTMLElement;
function getElementById(id: string, strict: true): HTMLElement;
function getElementById(id: string, strict: false): HTMLElement | null;
function getElementById(id: string, strict: boolean = true): HTMLElement | null {
  const el = document.getElementById(id);
  if (strict && !el) throw new Error(`Element #${id} not found`);
  return el;
}

// WHEN TO USE OVERLOADS:
// - Return type changes based on input type
// - You want precise autocomplete for different call patterns
// WHEN NOT TO USE:
// - Simple unions work fine without overloads
// - Generics can handle the case more cleanly


// -----------------------------------------------------------------------------
//  SECTION 6 — CALLBACK TYPES & FUNCTION TYPE ALIASES
// -----------------------------------------------------------------------------

// TYPE ALIAS FOR FUNCTIONS:
type MathOperation = (a: number, b: number) => number;

const addFn: MathOperation = (a, b) => a + b;
const subFn: MathOperation = (a, b) => a - b;
const mulFn: MathOperation = (a, b) => a * b;

// INTERFACE FOR FUNCTIONS:
interface Comparator<T> {
  (a: T, b: T): number;
}

const numberSort: Comparator<number> = (a, b) => a - b;

// CALLBACK PARAMETERS:
function fetchData(url: string, callback: (data: string) => void): void {
  // Simulating an async operation
  const data = `Response from ${url}`;
  callback(data);
}

fetchData("/api/users", (data) => {
  console.log("Received:", data);
});

// HIGHER-ORDER FUNCTIONS (functions that return functions):
function createMultiplier(factor: number): (n: number) => number {
  return (n) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15


// -----------------------------------------------------------------------------
//  SECTION 7 — `this` PARAMETER TYPING
// -----------------------------------------------------------------------------

// In TypeScript, you can declare the type of `this` as the FIRST parameter.
// This is a compile-time annotation — it's removed in the JS output.

interface EventHandler {
  name: string;
  handleClick(this: EventHandler, event: string): void;
}

const handler: EventHandler = {
  name: "Button Handler",
  handleClick(event: string) {
    // `this` is typed as EventHandler — TS ensures correct context
    console.log(`${this.name} received: ${event}`);
  },
};

handler.handleClick("click"); // OK

// This prevents mistakes like:
// const detached = handler.handleClick;
// detached("click"); // ERROR: 'this' context does not match

// WHY THIS MATTERS:
// In JS, `this` is determined at call time, leading to subtle bugs.
// TS's `this` parameter ensures functions are called with the right context.


// -----------------------------------------------------------------------------
//  SECTION 8 — void vs undefined (DEEP DIVE)
// -----------------------------------------------------------------------------

// void: "This function doesn't return a meaningful value."
// undefined: "The return value IS specifically undefined."

function logMsg(msg: string): void {
  console.log(msg);
  // Can return nothing, or return undefined — both fine
}

// THE VOID CALLBACK TRICK:
// When a callback type returns void, the callback can actually return ANYTHING.
// The caller just ignores the return value.

type EventCallback = (event: string) => void;

// This callback returns a number, but the type says void.
// TS allows it! The return value is simply ignored.
const myCallback: EventCallback = (event) => {
  console.log(event);
  return 42; // Allowed! Return value is ignored by the caller.
};

// This is intentional — it makes callback types flexible.
// If void were strict, you couldn't use Array.forEach with callbacks
// that happen to return values:

const nums = [1, 2, 3];
// .push() returns a number, but .forEach expects () => void
// This works because void is flexible:
nums.forEach((n) => nums.push(n * 2)); // Would error if void was strict


// -----------------------------------------------------------------------------
//  SECTION 9 — never AS RETURN TYPE
// -----------------------------------------------------------------------------

// A function returning `never` NEVER completes normally.
// It either throws an error or runs an infinite loop.

function fail(message: string): never {
  throw new Error(message);
}

function forever(): never {
  while (true) {}
}

// never vs void:
// void: function completes but returns nothing useful
// never: function NEVER completes (crashes or loops forever)

// PRACTICAL USE — asserting impossible states:
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

// Use in switch exhaustive checks (see 03_unions_and_narrowing.ts)


// -----------------------------------------------------------------------------
//  SECTION 10 — GENERIC FUNCTIONS (INTRO)
// -----------------------------------------------------------------------------

// Generics let you write functions that work with ANY type
// while PRESERVING type information. Full coverage in 08_generics.ts.

// WITHOUT generics — you lose the type:
function identityAny(value: any): any {
  return value; // caller gets `any` back — useless
}

// WITH generics — type is PRESERVED:
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);     // num is number
const str = identity<string>("hello"); // str is string
const inferred = identity(true);       // TS infers T as boolean

// Generics are covered in depth in 08_generics.ts.


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN                     SYNTAX
//  --------------------------  -------------------------------------------
//  Basic function              function fn(a: T, b: U): R { ... }
//  Arrow function              const fn = (a: T, b: U): R => { ... }
//  Optional param              function fn(x: string, y?: number)
//  Default param               function fn(x: string, y: string = "hi")
//  Rest param                  function fn(...args: number[])
//  Function type alias         type Fn = (a: T) => R
//  Callback param              function fn(cb: (x: T) => void)
//  Function overload           Multiple signatures + one implementation
//  this param                  function fn(this: Type, ...)
//  Higher-order function       function fn(): (x: T) => R
//  Generic function            function fn<T>(val: T): T


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: Should you always annotate function return types?
//  A: Function params: always annotate. Return types: recommended for
//     public/exported functions. For internal/simple functions, inference
//     is fine.
//
//  Q2: What is the difference between optional params and default params?
//  A: Optional (?) gives you undefined if not provided. Default (= value)
//     gives you the default value if not provided. Don't combine them.
//
//  Q3: What are function overloads?
//  A: Multiple type signatures for a single function. The implementation
//     must handle all signatures. Used when the return type depends on
//     the input type.
//
//  Q4: Why can void callbacks return a value?
//  A: By design. void in callback types means "the caller will ignore
//     the return value." This makes callbacks flexible — you can pass
//     functions that happen to return values without error.
//
//  Q5: What is a higher-order function?
//  A: A function that takes a function as a parameter or returns a function.
//     Common in callbacks, event handlers, and functional programming.
//
//  Q6: What is the `this` parameter in TypeScript?
//  A: A compile-time annotation (first param position) that declares the
//     expected type of `this` inside the function. It's removed in JS output
//     but ensures the function is called with the right context.


console.log("-- 05_functions.ts executed successfully --");
