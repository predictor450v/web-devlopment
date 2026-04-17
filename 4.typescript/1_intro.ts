// =============================================================================
//  TYPESCRIPT — INTRODUCTION & FOUNDATIONS
//  Doc Series: 01 / typescript_introduction.ts
// =============================================================================
//
//  WHAT IS TYPESCRIPT?
//  -------------------
//  TypeScript is a *statically typed superset* of JavaScript, developed and
//  maintained by Microsoft (Anders Hejlsberg — also the creator of C#).
//
//  "Superset" means:
//    → Every valid JavaScript file is already valid TypeScript.
//    → TypeScript adds EXTRA features ON TOP of JS (primarily: types).
//    → TypeScript COMPILES DOWN to plain JavaScript (called "transpilation").
//      Browsers & Node.js never see TypeScript — they always run .js output.
//
//  Timeline:
//    2012 — TypeScript 0.8 open-sourced by Microsoft
//    2016 — Angular 2 adopts TS, mass adoption begins
//    2019 — Airbnb, Slack, VS Code, Prisma all written in TS
//    Today — De facto standard for large-scale JS projects
//
// =============================================================================


// =============================================================================
//  SECTION 1 — JAVASCRIPT vs TYPESCRIPT : THE CORE PROBLEM
// =============================================================================

// ----- JAVASCRIPT (Dynamic Typing) -----
// In JS, a variable can hold ANY type at ANY time.
// The engine figures out the type only at *runtime*.

// js_example.js  ← imagine this is plain JS
// let score = 100;
// score = "hundred";      // perfectly valid in JS — no error!
// score = { value: 100 }; // still valid!

// This FLEXIBILITY becomes a LIABILITY when your codebase grows.
// Bugs like the one below crash only at *runtime* in JS:

// function add(a, b) {
//   return a + b;
// }
// add(5, "10"); // Returns "510" instead of 15 — silent bug!


// ----- TYPESCRIPT (Static Typing) -----
// TypeScript catches that same bug at *compile time*, before the code runs.

function add(a: number, b: number): number {
  return a + b;
}

// add(5, "10"); // ← TS ERROR: Argument of type 'string' is not assignable
//                             to parameter of type 'number'.
// The editor shows a red squiggle IMMEDIATELY. No runtime needed.


// =============================================================================
//  SECTION 2 — THE TYPE SYSTEM: WHAT TYPES DO
// =============================================================================

// A "type" is a CONTRACT — a promise about what shape a value has.
// When you annotate a variable, TS uses that annotation to:
//   1. Validate — check you're using it correctly
//   2. Autocomplete — give IntelliSense suggestions in your editor
//   3. Document — future developers understand intent without reading docs
//   4. Refactor safely — rename a field, TS flags all usages that break

// BASIC PRIMITIVES
let username: string = "Ayushman";
let age: number = 21;
let isLoggedIn: boolean = true;
let nothing: null = null;
let notAssigned: undefined = undefined;

// BIGINT (for integers beyond Number.MAX_SAFE_INTEGER — ~9 quadrillion)
let bigNumber: bigint = 9007199254740993n;

// SYMBOL (unique identity token — used in advanced object key patterns)
let id: symbol = Symbol("userId");


// =============================================================================
//  SECTION 3 — JS vs TS: SIDE-BY-SIDE COMPARISON TABLE
// =============================================================================

//  Feature                  │  JavaScript          │  TypeScript
//  ─────────────────────────┼──────────────────────┼──────────────────────────
//  Typing                   │  Dynamic (runtime)   │  Static (compile-time)
//  Error detection          │  At runtime          │  At compile/edit time
//  IDE Autocomplete         │  Limited             │  Rich (IntelliSense)
//  Compiled?                │  No (interpreted)    │  Yes → to JavaScript
//  Runs in browser?         │  Directly            │  After tsc compilation
//  Interfaces               │  No                  │  Yes
//  Generics                 │  No                  │  Yes
//  Enums                    │  No (workarounds)    │  First-class support
//  Type aliases             │  No                  │  Yes
//  Access modifiers         │  Informal (#private) │  public/private/protected
//  Optional chaining        │  ES2020              │  Since TS 3.7
//  File extension           │  .js                 │  .ts / .tsx (React)


// =============================================================================
//  SECTION 4 — HOW TYPESCRIPT COMPILES (THE tsc PIPELINE)
// =============================================================================

//  You write:    yourFile.ts
//        ↓
//  tsc (TypeScript Compiler) reads tsconfig.json for rules
//        ↓
//  Type Checking (finds all errors here — NO OUTPUT on error by default)
//        ↓
//  Code Emission — strips all type annotations, outputs yourFile.js
//        ↓
//  Browser/Node runs yourFile.js (never sees types!)

//  IMPORTANT INSIGHT (interview gold):
//  "Types are ERASED at runtime. TypeScript types have ZERO runtime cost
//   and zero impact on the JavaScript output. They exist only to help
//   developers during development."

//  Example:
//  TS Input:       let name: string = "Ayushman";
//  JS Output:      let name = "Ayushman";
//  ↑ The `: string` annotation is completely removed.


// =============================================================================
//  SECTION 5 — tsconfig.json: THE BRAIN OF A TS PROJECT
// =============================================================================

// Every TypeScript project has a tsconfig.json that controls compilation.
// Create one with:  npx tsc --init

// Key options (conceptual — in a real .json file):
//
//  {
//    "compilerOptions": {
//
//      "target": "ES2020",
//      // ↑ What version of JS to output. ES2020 = modern Node/browsers.
//      //   ES5 = older browsers (no arrow functions, spread, etc.)
//
//      "module": "commonjs",
//      // ↑ Module system. "commonjs" for Node, "ESNext" for Vite/React
//
//      "strict": true,
//      // ↑ MOST IMPORTANT FLAG. Enables ALL strict checks:
//      //   - strictNullChecks (null/undefined must be handled)
//      //   - noImplicitAny (can't skip typing params)
//      //   - strictFunctionTypes, etc.
//
//      "outDir": "./dist",
//      // ↑ Where compiled JS files go
//
//      "rootDir": "./src",
//      // ↑ Where your TS source files live
//
//      "sourceMap": true,
//      // ↑ Generates .js.map files — lets you debug TS in browser devtools
//
//      "noUnusedLocals": true,
//      // ↑ Error if you declare a variable and never use it
//
//      "noImplicitReturns": true
//      // ↑ Every code path in a function must return a value
//    }
//  }


// =============================================================================
//  SECTION 6 — TYPE INFERENCE (you don't always have to write types)
// =============================================================================

// TypeScript is SMART. It can INFER (auto-detect) types from initial values.
// You don't need to annotate everything — TS figures it out.

let city = "Kolkata";        // TS infers: string
let year = 2026;             // TS infers: number
let active = true;           // TS infers: boolean

// city = 42;  // ← ERROR: Type 'number' is not assignable to type 'string'
//               TS inferred 'string' from "Kolkata" and locked it in!

// When SHOULD you write explicit annotations?
// → Function parameters and return types (inference doesn't help here)
// → When a variable starts as one type but you want to be explicit
// → When working with complex objects (for documentation clarity)

// The RULE OF THUMB:
// "Let TS infer what it can; annotate what it can't figure out."


// =============================================================================
//  SECTION 7 — THE `any` TYPE (and why it's dangerous)
// =============================================================================

// `any` is an escape hatch — it turns off type checking for that variable.
// It's basically saying: "Trust me, I know what this is."

let data: any = "hello";
data = 42;        // fine
data = true;      // fine
data.foo.bar();   // ALSO fine at compile time... but crashes at runtime!

// WHY `any` IS AN ANTI-PATTERN:
// Using `any` defeats the entire purpose of TypeScript.
// It spreads like a virus — when you pass `any` to a function,
// the output becomes `any` too. This is called the "any escape hatch contagion".

// INTERVIEW TIP:
// "In production code, `any` is a red flag. You should prefer `unknown`
//  (type-safe cousin of any) which forces you to narrow the type before using it."

let userInput: unknown = getUserInput();

// Must narrow before use:
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // ✅ safe
}
// userInput.toUpperCase(); // ← ERROR with unknown — safe by default!

function getUserInput(): unknown {
  return "some input";
}


// =============================================================================
//  SECTION 8 — TYPE ANNOTATION vs TYPE ASSERTION vs TYPE CASTING
// =============================================================================

// TYPE ANNOTATION — telling TS what type a variable IS
let score: number = 95;

// TYPE ASSERTION — telling TS to TREAT a value as a specific type
// Use when YOU know the type better than TS does (e.g., from DOM or API)
const input = document.getElementById("username") as HTMLInputElement;
// Now TS knows it's an input, not just a generic HTMLElement
// input.value is now accessible ✅

// Alternative angle-bracket syntax (not usable in .tsx files):
const input2 = <HTMLInputElement>document.getElementById("username");

// ⚠️ CAUTION: Assertions don't perform runtime checks.
//    If you're wrong, it still crashes at runtime.

// DOUBLE ASSERTION (force a type TS would normally reject):
// Only use in extreme edge cases. Almost always a design smell.
const weird = ("hello" as unknown) as number;


// =============================================================================
//  SECTION 9 — STRUCTURAL TYPING (how TS checks types)
// =============================================================================

// TS uses STRUCTURAL typing, not NOMINAL typing.
// This is a key insight that surprises most developers coming from Java/C#.

// NOMINAL typing (Java/C#): Two types are compatible only if one explicitly
// extends the other. Names/declarations matter.

// STRUCTURAL typing (TypeScript): Two types are compatible if they have
// the same SHAPE (same properties and their types). Names don't matter.

interface Point2D {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

let p: Point2D = { x: 10, y: 20 };
let c: Coordinate = p; // ✅ Works! Same shape = compatible
// In Java, this would be a compile error because the types have different names.

// DUCK TYPING MENTAL MODEL:
// "If it has x: number and y: number, it IS a Point2D — regardless of
//  what it's called."


// =============================================================================
//  SECTION 10 — WHY TEAMS ADOPT TYPESCRIPT (real-world reasons)
// =============================================================================

// 1. SELF-DOCUMENTING CODE
//    Types ARE documentation. You don't need JSDoc comments everywhere.
//    The function signature tells you everything:
function fetchUser(id: number, options?: { cache: boolean }): Promise<User> {
  // Just by reading this, you know:
  //   - id must be a number
  //   - options is optional
  //   - it returns a Promise that resolves to a User
  return Promise.resolve({ id, name: "Ayushman", email: "a@example.com" });
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 2. FEARLESS REFACTORING
//    Rename a field in an interface → TS immediately shows you every
//    file in your codebase that uses it. In large repos, this is invaluable.

// 3. BETTER TOOLING
//    VS Code's IntelliSense, go-to-definition, find-all-references all
//    become dramatically more powerful with type information.

// 4. ONBOARDING NEW DEVELOPERS
//    A new team member can understand an API just by reading its types —
//    no need to read the implementation or documentation.

// 5. CATCHES ENTIRE CLASSES OF BUGS
//    Null pointer dereferences, wrong argument orders, typos in property
//    names — all caught before code even runs.


// =============================================================================
//  SECTION 11 — COMMON INTERVIEW QUESTIONS ON THIS TOPIC
// =============================================================================

// Q1: "What is TypeScript and how does it differ from JavaScript?"
// A: TS is a statically typed superset of JS. It adds optional static typing,
//    interfaces, generics, and other features. It compiles to plain JS.
//    JS is dynamically typed — errors surface at runtime. TS catches them
//    at compile time, improving reliability and developer experience.

// Q2: "Is TypeScript a replacement for JavaScript?"
// A: No. TypeScript is a development tool. At runtime, browsers and Node.js
//    always execute plain JavaScript. TypeScript helps you WRITE better JS —
//    it doesn't replace it.

// Q3: "What is the difference between `any` and `unknown`?"
// A: `any` disables type checking entirely — you can do anything with it.
//    `unknown` is type-safe — you must perform a type check (narrowing)
//    before you can use it. `unknown` is the better choice when you truly
//    don't know the type ahead of time.

// Q4: "What is type inference in TypeScript?"
// A: TS can automatically deduce (infer) the type of a variable from its
//    initial value or return expression. You don't always have to write
//    explicit annotations — TS figures it out. This keeps code concise
//    while maintaining full type safety.

// Q5: "What is structural typing?"
// A: TS uses structural (shape-based) compatibility instead of nominal
//    (name-based) compatibility. If two types have the same shape
//    (same properties and types), they are assignable to each other —
//    even if they have different names. This is sometimes called "duck typing".

// Q6: "What happens to TypeScript types at runtime?"
// A: Types are completely ERASED by the TypeScript compiler. The compiled
//    JavaScript has no trace of type annotations. Types have zero runtime
//    cost and zero impact on behavior — they exist purely as a development aid.


// =============================================================================
//  SECTION 12 — NEW & MODERN TS FEATURES (beyond the basics)
// =============================================================================

// ── SATISFIES OPERATOR (TS 4.9, 2022) ──────────────────────────────────────
// Validates a value against a type WITHOUT widening the inferred type.
// Solves a real pain point in config objects.

type Color = "red" | "green" | "blue";
type Palette = Record<string, Color | number[]>;

// Without satisfies — loses the specific type of each key:
const paletteOld: Palette = {
  red: [255, 0, 0],
  green: "green",
};
// paletteOld.red is Color | number[] — TS lost that it's number[]

// With satisfies — validates type but KEEPS the inferred type:
const palette = {
  red: [255, 0, 0],
  green: "green",
  blue: [0, 0, 255],
} satisfies Palette;

palette.red;   // still inferred as number[], not Color | number[] ✅
palette.green; // still inferred as string, not Color | number[]  ✅


// ── CONST TYPE PARAMETERS (TS 5.0, 2023) ────────────────────────────────────
// Forces TS to infer the narrowest (most literal) type for generics.

function firstElement<const T extends readonly unknown[]>(arr: T): T[0] {
  return arr[0];
}

const first = firstElement(["a", "b", "c"]);
// Without `const`: first is inferred as string
// With `const`:    first is inferred as "a" (the literal type!) ✅


// ── USING DECLARATIONS / EXPLICIT RESOURCE MANAGEMENT (TS 5.2, 2023) ────────
// Automatic cleanup of resources when they go out of scope.
// Like Python's `with` statement or C#'s `using`.
// Requires objects to implement [Symbol.dispose]() method.

// class DatabaseConnection {
//   connect() { console.log("Connected"); }
//   [Symbol.dispose]() { console.log("Connection auto-closed"); }
// }

// function runQuery() {
//   using db = new DatabaseConnection(); // ← new keyword: `using`
//   db.connect();}

  // ... db is automatically disposed (connection closed) when this
  // function exits — even if an error is thrown!

// This eliminates entire categories of resource leak bugs.


// =============================================================================
//  SUMMARY
// =============================================================================

//  ┌─────────────────────────────────────────────────────────────────────┐
//  │  TypeScript in one sentence:                                        │
//  │  "JavaScript with a safety net — catch bugs while you type them,   │
//  │   not while your users find them."                                  │
//  └─────────────────────────────────────────────────────────────────────┘
//
//  Key Takeaways:
//  ✓ TS = JS + Static Types + Extra Features (interfaces, generics, etc.)
//  ✓ Compiles to JS — browsers/Node never see TypeScript
//  ✓ Types are erased at runtime — zero overhead
//  ✓ Uses structural (shape-based) typing, not nominal typing
//  ✓ `unknown` > `any` — always prefer type-safe alternatives
//  ✓ Type inference means you write LESS annotations, not more
//  ✓ The `satisfies` operator (4.9) and `using` declarations (5.2)
//    are modern features worth knowing for interviews
//
//  Next in series → 02_primitive_types_and_arrays.ts