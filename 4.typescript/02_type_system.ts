export {};
// =============================================================================
//  02 | THE TYPE SYSTEM
// =============================================================================
//
//  Prerequisites : 01_setup_and_basics.ts
//  Next File     : 03_unions_and_narrowing.ts
//
//  This file covers:
//    1. What is a "type"?
//    2. Primitive types (string, number, boolean, null, undefined, bigint, symbol)
//    3. Type annotations vs type inference
//    4. The `any` type (and why it's dangerous)
//    5. The `unknown` type (safe alternative to any)
//    6. The `never` type (impossible values)
//    7. The `void` type (functions that return nothing)
//    8. When to annotate vs when to let TS infer
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — WHAT IS A "TYPE"?
// -----------------------------------------------------------------------------

// A "type" is a CONTRACT — a promise about what shape a value has.
// When you give a variable a type, TypeScript uses it to:
//   1. VALIDATE — check you're using the value correctly
//   2. AUTOCOMPLETE — give IntelliSense suggestions in your editor
//   3. DOCUMENT — future you (or teammates) understand intent instantly
//   4. REFACTOR SAFELY — rename a field, TS flags all broken usages

// Think of types as labels on boxes:
//   Box labeled "number" -> can only hold numbers
//   Box labeled "string" -> can only hold strings
//   Try to put a string in a number box? TS stops you immediately.


// -----------------------------------------------------------------------------
//  SECTION 2 — PRIMITIVE TYPES
// -----------------------------------------------------------------------------

// These are the fundamental building blocks of TypeScript's type system.
// They map directly to JavaScript's primitive values.

// -- string --
let firstName: string = "Ayushman";
let greeting: string = `Hello, ${firstName}`; // template literals are strings too

// -- number --
let age: number = 21;
let price: number = 99.99;
let hex: number = 0xff;        // hexadecimal -> 255
let binary: number = 0b1010;   // binary -> 10
let inf: number = Infinity;     // valid number
let notANumber: number = NaN;   // also a valid number (weird but true)

// -- boolean --
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;

// -- null and undefined --
// With strict: true, these are their OWN types.
// You can't accidentally assign null to a string.
let nothing: null = null;
let notAssigned: undefined = undefined;

// -- bigint (for integers beyond Number.MAX_SAFE_INTEGER) --
// Number.MAX_SAFE_INTEGER = 9007199254740991 (about 9 quadrillion)
// Anything bigger? Use bigint.
let bigNumber: bigint = 9007199254740993n; // note the `n` suffix

// -- symbol (unique identity token) --
// Every Symbol() call creates a globally unique value.
// Used in advanced patterns like unique object keys.
let uniqueId: symbol = Symbol("userId");
let anotherId: symbol = Symbol("userId");
// uniqueId === anotherId  ->  false (they are ALWAYS unique)


// -----------------------------------------------------------------------------
//  SECTION 3 — TYPE ANNOTATIONS vs TYPE INFERENCE
// -----------------------------------------------------------------------------

// TYPE ANNOTATION — YOU explicitly tell TS what the type is.
// Syntax: let variableName: type = value;
let score: number = 95;
let city: string = "Kolkata";
let isActive: boolean = true;

// TYPE INFERENCE — TS DEDUCES the type from the value you assign.
// You don't write the type — TS figures it out automatically.
let country = "India";       // TS infers: string
let year = 2026;             // TS infers: number
let online = true;           // TS infers: boolean

// country = 42; // ERROR: Type 'number' is not assignable to type 'string'
// TS inferred 'string' from "India" and LOCKED IT IN.

// WHY INFERENCE IS POWERFUL:
// You write LESS code, but get the SAME safety.
// TS is smart enough to figure out most types on its own.

// WHEN MUST YOU ANNOTATE? (inference can't help)
//   1. Function parameters — TS can't guess what you'll pass in
//   2. Variables declared without a value
//   3. When inference gives a WIDER type than you want

// Example: must annotate function params
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Example: declared without value — must annotate
let result: string;
result = greet("Dev");

// Example: inference is too wide
let status = "active"; // inferred as 'string' (too wide)
let statusNarrow: "active" | "inactive" = "active"; // exact literal type

// RULE OF THUMB:
// "Let TS infer what it can. Annotate what it can't figure out."
// In practice: always annotate function params and return types.
// Let TS infer local variables.


// -----------------------------------------------------------------------------
//  SECTION 4 — THE `any` TYPE (THE ESCAPE HATCH)
// -----------------------------------------------------------------------------

// `any` turns OFF type checking for that variable.
// It's TS saying: "Fine, do whatever you want. I won't check."

let data: any = "hello";
data = 42;           // fine
data = true;         // fine
data = { x: 1 };    // fine
data.foo.bar.baz();  // TS: fine. Runtime: CRASH! (foo doesn't exist)

// THE CONTAGION PROBLEM:
// `any` spreads like a virus. When you pass `any` to a function,
// the return type becomes `any` too. You lose type info downstream.

function processData(input: any) {
  return input.value; // return type is also `any`
}
const result2 = processData({ value: 10 });
// result2 is `any` — TS has no idea what it is anymore.

// WHEN `any` APPEARS IMPLICITLY (without you writing it):
// With strict: false (bad), untyped params silently become `any`.
// With strict: true (good), this is a compile error (noImplicitAny):
// function bad(x) { return x; } // ERROR with strict: true

// COMMON MISTAKE:
// Using `any` because "I'll fix the types later." You won't.
// Every `any` is a bug waiting to happen.

// WHEN `any` IS ACCEPTABLE (rare cases):
//   - Migrating a large JS codebase to TS incrementally
//   - Prototyping throwaway code
//   - Third-party library with no type definitions
// Even then, prefer `unknown` (see next section).


// -----------------------------------------------------------------------------
//  SECTION 5 — THE `unknown` TYPE (SAFE ALTERNATIVE TO `any`)
// -----------------------------------------------------------------------------

// `unknown` is the TYPE-SAFE version of `any`.
// You can ASSIGN anything to unknown, but you CANNOT USE IT
// without first NARROWING (checking) its type.

let userInput: unknown = "hello world";
userInput = 42;        // fine — assigning is allowed
userInput = { a: 1 };  // fine — still allowed

// BUT you can't USE it without checking first:
// userInput.toUpperCase();    // ERROR: Object is of type 'unknown'
// let x: string = userInput;  // ERROR: Not assignable without narrowing

// You MUST narrow before using:
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // SAFE — narrowed to string
}

if (typeof userInput === "number") {
  console.log(userInput.toFixed(2)); // SAFE — narrowed to number
}

// GREAT PATTERN — use unknown for data from external sources:
function parseJSON(json: string): unknown {
  return JSON.parse(json); // Returns unknown, forcing caller to validate
}

const parsed = parseJSON('{"name": "Ayushman"}');
// parsed.name  ->  ERROR! Must narrow first.
if (typeof parsed === "object" && parsed !== null && "name" in parsed) {
  console.log((parsed as { name: string }).name); // SAFE
}

// COMPARISON TABLE:
//
//  Feature           |  any              |  unknown
//  ------------------|-------------------|-------------------
//  Assign anything   |  YES              |  YES
//  Use without check |  YES (UNSAFE!)    |  NO (must narrow)
//  Assignable to X   |  YES (spreads)    |  NO (contained)
//  Recommended       |  RARELY           |  YES, for dynamic data

// RULE: If you don't know the type, use `unknown`, not `any`.
//       `unknown` forces you to check — `any` lets you crash.


// -----------------------------------------------------------------------------
//  SECTION 6 — THE `never` TYPE (IMPOSSIBLE VALUES)
// -----------------------------------------------------------------------------

// `never` represents a value that NEVER occurs.
// It is the BOTTOM TYPE — nothing is assignable to it (except never itself).

// USE CASE 1: Functions that never return (they throw or loop forever)
function throwError(msg: string): never {
  throw new Error(msg);
  // Execution never reaches past this point.
  // return; // Unreachable — TS enforces this.
}

function infiniteLoop(): never {
  while (true) {
    // This function runs forever — it never returns.
  }
}

// USE CASE 2: Exhaustive checks (covered in detail in 03_unions_and_narrowing.ts)
// After handling every case of a union, the remaining type becomes `never`.
// This guarantees at compile time that you haven't missed any case.

// USE CASE 3: Impossible type intersections
type Impossible = string & number; // string AND number at the same time? -> never

// MENTAL MODEL:
//   unknown  = "could be ANYTHING"    (top type — widest)
//   never    = "can't be ANYTHING"    (bottom type — narrowest)
//   any      = "I don't care"         (escape hatch — breaks the system)


// -----------------------------------------------------------------------------
//  SECTION 7 — THE `void` TYPE (FUNCTIONS THAT RETURN NOTHING)
// -----------------------------------------------------------------------------

// `void` means "this function doesn't return a meaningful value."
// It's the return type for functions that just DO something (side effects).

function logMessage(msg: string): void {
  console.log(msg);
  // No return statement — that's fine for void.
  // Returning undefined is also fine (it's the implicit return value).
}

// void vs undefined:
// - void: "I don't care about the return value" (more flexible)
// - undefined: "The return value IS specifically undefined"

function returnsVoid(): void {
  // return undefined; // OK
  // return;           // OK
  // return 42;        // ERROR — can't return a value
}

function returnsUndefined(): undefined {
  return undefined; // Must explicitly return undefined
}

// WHY THIS MATTERS:
// When you use void in callback types, TS is more flexible:
type Logger = (msg: string) => void;

// This callback returns a number, but the Logger type says void.
// TS allows it! Because the CALLER ignores the return value anyway.
const myLogger: Logger = (msg) => {
  console.log(msg);
  return 42; // Allowed! void callbacks can return anything (it's ignored).
};

// This is by design — it makes callback types more practical.


// -----------------------------------------------------------------------------
//  SECTION 8 — WHEN TO ANNOTATE vs WHEN TO LET TS INFER
// -----------------------------------------------------------------------------
//
//  ANNOTATE (write the type explicitly):
//    - Function parameters          -> always
//    - Function return types         -> recommended for public APIs
//    - Variables without an initial value
//    - When inference is too wide (you want a literal type)
//    - Complex objects (for documentation clarity)
//
//  LET TS INFER (don't write the type):
//    - Local variables with an initial value
//    - Return types of simple/obvious functions
//    - Array items that are clearly typed
//    - Boolean expressions, arithmetic results
//
//  EXAMPLE — good balance:

function calculateTax(income: number, rate: number): number {
  // Params annotated (MUST), return type annotated (RECOMMENDED).
  const tax = income * rate; // `tax` inferred as number — no annotation needed.
  return tax;
}

const myTax = calculateTax(100000, 0.3); // myTax inferred as number


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  TYPE        DESCRIPTION                  EXAMPLE
//  ----------  --------------------------   -------------------------
//  string      Text                         "hello", `template ${x}`
//  number      All numbers (int, float)     42, 3.14, NaN, Infinity
//  boolean     true/false                   true, false
//  null        Intentional empty value      null
//  undefined   Not yet assigned             undefined
//  bigint      Large integers               9007199254740993n
//  symbol      Unique identifier            Symbol("id")
//  any         Disables type checking       (avoid in production)
//  unknown     Safe wildcard (must narrow)  (use for dynamic data)
//  never       Impossible/unreachable       (functions that throw)
//  void        No return value              (side-effect functions)


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What are the primitive types in TypeScript?
//  A: string, number, boolean, null, undefined, bigint, symbol.
//     TypeScript also adds: any, unknown, never, void (these are TS-specific).
//
//  Q2: What is the difference between type annotation and type inference?
//  A: Annotation is when YOU explicitly write the type (let x: number = 5).
//     Inference is when TS automatically deduces the type from the value
//     (let x = 5 -> TS infers number). Both provide the same safety.
//
//  Q3: What is the difference between `any` and `unknown`?
//  A: `any` disables all type checking — you can do anything with it (unsafe).
//     `unknown` requires you to narrow (check) the type before using it (safe).
//     `unknown` is what `any` should have been. Always prefer `unknown`.
//
//  Q4: When should you use `never`?
//  A: For functions that never return (throw errors, infinite loops) and
//     for exhaustive checks in switch statements. `never` means "this code
//     path is unreachable" or "this value is impossible."
//
//  Q5: What is the difference between `void` and `undefined`?
//  A: `void` means "this function doesn't return a meaningful value" — it's
//     flexible (callbacks with void can return anything, it's just ignored).
//     `undefined` means "the value IS specifically undefined" — stricter.
//
//  Q6: Should you annotate everything?
//  A: No. Let TS infer local variables. Always annotate function parameters
//     and (ideally) return types. This gives you maximum safety with
//     minimum noise.


console.log("-- 02_type_system.ts executed successfully --");
