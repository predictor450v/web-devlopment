export {};
// =============================================================================
//  10 | TYPE ASSERTIONS & SPECIAL OPERATORS
// =============================================================================
//
//  Prerequisites : 09_utility_types.ts
//  Next File     : 11_advanced_types.ts
//
//  This file covers:
//    1. Type assertion (as keyword)
//    2. Angle-bracket syntax (alternative)
//    3. Non-null assertion (!)
//    4. Double assertion (escape hatch)
//    5. const assertion (as const)
//    6. satisfies operator (TS 4.9+)
//    7. Assertion vs narrowing — when to use which
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — TYPE ASSERTION (as keyword)
// -----------------------------------------------------------------------------

// Type assertion tells TS: "I KNOW the type better than you do."
// It's a COMPILE-TIME hint — NO runtime effect.

// MOST COMMON USE — DOM queries:
// document.getElementById returns HTMLElement | null
// But YOU know what specific element it is:

const inputElement = document.getElementById("username") as HTMLInputElement;
// Now TS treats it as HTMLInputElement — you can access .value
console.log(inputElement.value);

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
// Now you can access .getContext("2d")

// ANOTHER USE — API data you know the shape of:
const rawData = JSON.parse('{"name": "Ayushman", "age": 21}');
const user = rawData as { name: string; age: number };
console.log(user.name); // TS now knows this is a string

// IMPORTANT WARNING:
// Assertions do NOT perform runtime validation.
// If you assert the wrong type, TS won't catch it — you'll crash at runtime.

const badAssertion = "hello" as unknown as number;
// TS thinks it's a number, but it's actually a string.
// badAssertion.toFixed(2); // Runtime crash!

// RULE: Assertions are for when YOU know better than TS.
// If you're not sure, use type guards (typeof, instanceof, in) instead.


// -----------------------------------------------------------------------------
//  SECTION 2 — ANGLE-BRACKET SYNTAX
// -----------------------------------------------------------------------------

// An older alternative syntax for assertions:
const element = <HTMLDivElement>document.getElementById("app");

// IMPORTANT CAVEAT:
// This syntax DOES NOT WORK in .tsx files (React).
// In JSX, <Something> is interpreted as a JSX element, not a type assertion.
// ALWAYS use `as` syntax — it works everywhere.

// PREFER:
const elementSafe = document.getElementById("app") as HTMLDivElement;
// OVER:
// const elementAngle = <HTMLDivElement>document.getElementById("app");


// -----------------------------------------------------------------------------
//  SECTION 3 — NON-NULL ASSERTION (!)
// -----------------------------------------------------------------------------

// The ! operator tells TS: "This value is NOT null or undefined."
// It removes null and undefined from the type.

// WITHOUT non-null assertion:
const el = document.getElementById("app"); // Type: HTMLElement | null
// el.innerHTML = "Hello"; // ERROR — 'el' is possibly null

// WITH non-null assertion:
const el2 = document.getElementById("app")!; // Type: HTMLElement
el2.innerHTML = "Hello"; // OK — ! removed null from the type

// DANGER: If the element doesn't exist, this crashes at runtime.
// Use only when you're 100% certain the value is not null.

// SAFER ALTERNATIVES:
// 1. Null check:
const el3 = document.getElementById("app");
if (el3) {
  el3.innerHTML = "Hello"; // TS narrows to HTMLElement inside if block
}

// 2. Optional chaining:
const el4 = document.getElementById("app");
el4?.classList.add("active"); // Does nothing if el4 is null

// WHEN NON-NULL ASSERTION IS OK:
// - In test code where you know the DOM is set up
// - After a guard that TS can't analyze (e.g., framework lifecycle hooks)
// - Never in user-facing production code without a fallback


// -----------------------------------------------------------------------------
//  SECTION 4 — DOUBLE ASSERTION (ESCAPE HATCH)
// -----------------------------------------------------------------------------

// Direct assertion between unrelated types isn't allowed:
// const x = "hello" as number; // ERROR — string and number don't overlap

// Double assertion forces it through `unknown`:
const forced = ("hello" as unknown) as number;
// TS now thinks `forced` is a number — but it's actually a string.

// THIS IS ALMOST ALWAYS WRONG. Use only:
//   - In extreme edge cases during migration
//   - When working around TS limitations with third-party types
//   - NEVER in normal code

// If you need double assertion, it's a sign that your types are wrong.


// -----------------------------------------------------------------------------
//  SECTION 5 — CONST ASSERTION (as const)
// -----------------------------------------------------------------------------

// `as const` makes TS infer the NARROWEST possible type.
// It freezes the type to literal values and makes everything readonly.

// WITHOUT as const:
const colors = ["red", "green", "blue"];
// Type: string[] — TS infers a general array of strings
// colors[0] is just `string`, not "red"

// WITH as const:
const colorsConst = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"] — exact literal types!
// colorsConst[0] is "red" (literal), not string

// Object with as const:
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
} as const;
// Type: { readonly host: "localhost"; readonly port: 3000; readonly debug: true }
// config.host is "localhost" (literal), not string
// config.port is 3000 (literal), not number
// All properties are readonly

// config.host = "remote"; // ERROR — readonly
// config.port = 8080;     // ERROR — readonly

// USE CASE 1 — Creating a type from constant values:
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"

// USE CASE 2 — Enum-like objects:
const STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING",
} as const;

type StatusType = typeof STATUS[keyof typeof STATUS];
// "SUCCESS" | "ERROR" | "LOADING"

// USE CASE 3 — Function returning literal type:
function getDirection() {
  return { x: 1, y: 0 } as const;
  // Return type: { readonly x: 1; readonly y: 0 }
}

// WITHOUT as const, x and y would be inferred as `number`.
// WITH as const, they're exact literals 1 and 0.


// -----------------------------------------------------------------------------
//  SECTION 6 — satisfies OPERATOR (TS 4.9+)
// -----------------------------------------------------------------------------

// `satisfies` validates that a value matches a type WITHOUT changing the
// inferred type. It catches errors while preserving specific inference.

// THE PROBLEM without satisfies:
type Color = "red" | "green" | "blue";
type Palette = Record<string, Color | number[]>;

// Using type annotation — works but LOSES specific inference:
const paletteAnnotated: Palette = {
  red: [255, 0, 0],
  green: "green",
  blue: [0, 0, 255],
};
// paletteAnnotated.red is Color | number[] — TS forgot it's number[]!
// paletteAnnotated.green is Color | number[] — TS forgot it's "green"!

// USING satisfies — validates AND preserves inference:
const paletteSatisfied = {
  red: [255, 0, 0],
  green: "green",
  blue: [0, 0, 255],
} satisfies Palette;

// paletteSatisfied.red is number[] (specific!)
// paletteSatisfied.green is "green" (specific!)

// Still catches errors:
// const badPalette = {
//   red: [255, 0, 0],
//   green: "not-a-color", // ERROR — "not-a-color" is not Color | number[]
// } satisfies Palette;

// REAL-WORLD USE — Route configuration:
type Route = { path: string; method: "GET" | "POST" | "PUT" | "DELETE" };

const routes = {
  getUsers: { path: "/users", method: "GET" },
  createUser: { path: "/users", method: "POST" },
} satisfies Record<string, Route>;

// routes.getUsers.method is "GET" (not just string or "GET"|"POST"|...)
// Catches typos but preserves exact types.

// WHEN TO USE satisfies:
// - Config objects where you want validation + specific inference
// - Lookup tables where values should be checked but kept specific
// - Anywhere you'd use a type annotation but want narrower inference


// -----------------------------------------------------------------------------
//  SECTION 7 — ASSERTION vs NARROWING: WHEN TO USE WHICH
// -----------------------------------------------------------------------------

// NARROWING (preferred — SAFE):
// Uses runtime checks (typeof, instanceof, in) to prove the type.
// If wrong, the code path doesn't execute — no crash.
function safeProcess(input: unknown) {
  if (typeof input === "string") {
    console.log(input.toUpperCase()); // provably string
  }
}

// ASSERTION (escape hatch — UNSAFE):
// You TELL TS the type without any runtime check.
// If wrong, you crash.
function riskyProcess(input: unknown) {
  const str = input as string;
  console.log(str.toUpperCase()); // crashes if input isn't a string
}

// DECISION TABLE:
//
//  Situation                              Use
//  -------------------------------------  --------------------
//  You can check the type at runtime      Narrowing (safe)
//  DOM element that you KNOW exists        Assertion (as)
//  JSON data from external source          Unknown + narrow
//  Config value you're certain about       satisfies or as const
//  Third-party library type mismatch       Assertion (last resort)
//  Migrating JS to TS incrementally        Assertion (temporary)


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN               SYNTAX                          EFFECT
//  --------------------  ------------------------------  -------------------------
//  Type assertion        value as Type                   Tells TS the type
//  Angle-bracket         <Type>value                     Same (not in .tsx)
//  Non-null assertion    value!                          Remove null/undefined
//  Double assertion      (val as unknown) as Type        Force unrelated types
//  const assertion       value as const                  Narrow to literals + readonly
//  satisfies             value satisfies Type            Validate without widening


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is a type assertion?
//  A: A compile-time hint that tells TS to treat a value as a specific type.
//     Uses `as Type` syntax. No runtime effect — doesn't convert values.
//
//  Q2: What is the danger of type assertions?
//  A: Assertions bypass type checking. If you assert a wrong type,
//     TS won't catch it — you get a runtime crash. They should be used
//     only at boundaries (DOM, JSON, third-party libs).
//
//  Q3: What does `as const` do?
//  A: It infers the NARROWEST type possible — literal types for primitives,
//     readonly for objects and arrays. Great for creating types from values.
//
//  Q4: What is the `satisfies` operator? (TS 4.9+)
//  A: It validates that a value matches a type WITHOUT changing the inferred
//     type. Unlike type annotation, it preserves specific literal inference
//     while still catching type errors.
//
//  Q5: When should you use assertion vs narrowing?
//  A: Narrowing (typeof, instanceof, in) is always preferred — it's safe.
//     Assertions are for cases where TS can't analyze the type but you know
//     it (DOM queries, framework-specific patterns, migration).
//
//  Q6: What is the non-null assertion operator (!)?
//  A: The `!` postfix removes null and undefined from a type. It tells TS
//     "I guarantee this is not null." Use sparingly — if wrong, runtime crash.


console.log("-- 10_type_assertions.ts executed successfully --");
