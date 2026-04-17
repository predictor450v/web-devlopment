export {};
// =============================================================================
//  01 | TYPESCRIPT SETUP & BASICS
// =============================================================================
//
//  Prerequisites : Basic JavaScript knowledge
//  Next File     : 02_type_system.ts
//
//  This file covers:
//    1. What is TypeScript?
//    2. Installing TypeScript
//    3. Project structure
//    4. tsconfig.json (the brain of your project)
//    5. Compilation pipeline (how TS becomes JS)
//    6. Running TypeScript code
//    7. Compile-time vs Runtime
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — WHAT IS TYPESCRIPT?
// -----------------------------------------------------------------------------
//
//  TypeScript is a STATICALLY TYPED SUPERSET of JavaScript.
//
//  "Superset" means:
//    -> Every valid .js file is already valid TypeScript.
//    -> TS adds EXTRA features on top of JS (primarily: a type system).
//    -> TS COMPILES DOWN to plain JavaScript (called "transpilation").
//    -> Browsers and Node.js never see TypeScript — they always run .js output.
//
//  Created by: Anders Hejlsberg at Microsoft (also the creator of C#).
//
//  WHY THIS MATTERS:
//  In JavaScript, bugs only show up when your code RUNS.
//  In TypeScript, bugs are caught while you TYPE — before anyone sees them.
//
//  Timeline:
//    2012 — TypeScript 0.8 released (open-source)
//    2016 — Angular 2 adopts TS, mass adoption begins
//    2019 — VS Code, Airbnb, Slack, Prisma all written in TS
//    Today — De facto standard for large-scale JavaScript projects


// -----------------------------------------------------------------------------
//  SECTION 2 — INSTALLING TYPESCRIPT
// -----------------------------------------------------------------------------
//
//  OPTION A: Global install (available everywhere on your machine)
//    npm install -g typescript
//    tsc --version
//
//  OPTION B: Local install (RECOMMENDED — each project pins its own version)
//    npm install --save-dev typescript
//    npx tsc --version
//
//  WHY LOCAL IS BETTER:
//  Different projects may need different TS versions.
//  Local install avoids version mismatch across teams.
//
//  BONUS TOOL — ts-node (run TS directly without compiling first):
//    npm install --save-dev ts-node
//    npx ts-node src/index.ts


// -----------------------------------------------------------------------------
//  SECTION 3 — RECOMMENDED PROJECT STRUCTURE
// -----------------------------------------------------------------------------
//
//  my-project/
//  +-- src/              <-- your .ts source files live here
//  |   +-- index.ts
//  |   +-- utils.ts
//  +-- dist/             <-- compiled .js output goes here (auto-generated)
//  +-- node_modules/
//  +-- tsconfig.json     <-- TypeScript configuration
//  +-- package.json
//  +-- .gitignore        <-- add "dist/" and "node_modules/" here
//
//  QUICK START:
//    mkdir my-project && cd my-project
//    npm init -y
//    npm install --save-dev typescript
//    npx tsc --init              <-- generates tsconfig.json
//    mkdir src && touch src/index.ts


// -----------------------------------------------------------------------------
//  SECTION 4 — tsconfig.json (THE BRAIN OF YOUR PROJECT)
// -----------------------------------------------------------------------------
//
//  Every TypeScript project needs a tsconfig.json.
//  Generate one with: npx tsc --init
//
//  Here are the ESSENTIAL options you need to know:
//
//  {
//    "compilerOptions": {
//
//      "target": "ES2020",
//      // What version of JavaScript to output.
//      // ES2020 = modern browsers/Node. ES5 = legacy browser support.
//
//      "module": "commonjs",
//      // Module system. "commonjs" for Node, "ESNext" for Vite/React/modern.
//
//      "strict": true,
//      // THE MOST IMPORTANT FLAG. Enables ALL strict checks at once:
//      //   - strictNullChecks      (null/undefined must be handled explicitly)
//      //   - noImplicitAny         (can't skip typing function params)
//      //   - strictFunctionTypes   (stricter function type checking)
//      //   - strictBindCallApply   (stricter bind/call/apply checking)
//      //   - strictPropertyInitialization (class props must be initialized)
//      // ALWAYS keep this true. Turning it off defeats the purpose of TS.
//
//      "outDir": "./dist",
//      // Where compiled .js files go.
//
//      "rootDir": "./src",
//      // Where your .ts source files live.
//
//      "sourceMap": true,
//      // Generates .js.map files so you can debug TS in browser devtools.
//
//      "noUnusedLocals": true,
//      // Error if you declare a variable and never use it.
//
//      "noImplicitReturns": true,
//      // Every code path in a function must return a value.
//
//      "esModuleInterop": true
//      // Allows default imports from CommonJS modules (e.g., import express from 'express').
//    },
//
//    "include": ["src/**/*"],     // Which files to compile
//    "exclude": ["node_modules"]  // Which files to skip
//  }
//
//  COMMON MISTAKE:
//  Forgetting "strict": true. Without it, TS is basically JavaScript with
//  extra syntax — you lose most of the safety benefits.


// -----------------------------------------------------------------------------
//  SECTION 5 — HOW TYPESCRIPT COMPILES (THE tsc PIPELINE)
// -----------------------------------------------------------------------------
//
//  Step 1: You write  ->  src/index.ts
//           |
//  Step 2: tsc reads tsconfig.json for rules
//           |
//  Step 3: TYPE CHECKING (finds all errors — no output if errors exist)
//           |
//  Step 4: CODE EMISSION — strips all type annotations
//           |
//  Step 5: Outputs  ->  dist/index.js  (plus .js.map if sourceMap is on)
//           |
//  Step 6: Browser/Node runs dist/index.js (never sees types!)
//
//
//  EXAMPLE OF TYPE ERASURE:
//
//  TS Input:
let userName: string = "Ayushman";

//  JS Output (after compilation):
//  let userName = "Ayushman";
//
//  The `: string` annotation is completely removed.
//  Types have ZERO runtime cost — they exist only during development.


// -----------------------------------------------------------------------------
//  SECTION 6 — RUNNING TYPESCRIPT
// -----------------------------------------------------------------------------
//
//  METHOD 1: Compile then run
//    npx tsc                    -> compiles everything per tsconfig.json
//    node dist/index.js         -> run the compiled JavaScript
//
//  METHOD 2: Watch mode (recompiles on every file save — great for dev)
//    npx tsc --watch
//
//  METHOD 3: Run directly without compiling (using ts-node)
//    npx ts-node src/index.ts
//
//  METHOD 4: Type-check only (no JS output — common in CI pipelines)
//    npx tsc --noEmit
//
//  METHOD 5: Compile a single file (ignores tsconfig!)
//    npx tsc src/index.ts
//
//  WHEN TO USE EACH:
//  - Development  -> tsc --watch or ts-node
//  - Production   -> tsc (full compile)
//  - CI/CD        -> tsc --noEmit (just validate types, don't build)


// -----------------------------------------------------------------------------
//  SECTION 7 — COMPILE-TIME vs RUNTIME
// -----------------------------------------------------------------------------

// This is the SINGLE MOST IMPORTANT concept to understand in TypeScript.

// COMPILE-TIME (when tsc runs):
//   - Type annotations are checked
//   - Type errors are caught
//   - Interfaces, type aliases, generics are processed
//   - ALL of the above are then REMOVED from the output

// RUNTIME (when Node/browser runs the .js):
//   - Types don't exist anymore
//   - typeof still works (it's a JavaScript operator)
//   - instanceof still works (it checks the prototype chain)
//   - But you CANNOT check interfaces or type aliases at runtime

// Example:
let value: number = 42;
// value = "hello"; // COMPILE-TIME ERROR: Type 'string' not assignable to 'number'

// At runtime, `value` is just a regular JavaScript variable.
console.log("Value:", value); // Works fine — just JS at this point.

// COMMON MISTAKE:
// Thinking that TypeScript type checks happen at runtime.
// They DON'T. If something compiles but crashes at runtime,
// it's a JavaScript issue, not a TypeScript issue.


// -----------------------------------------------------------------------------
//  SECTION 8 — YOUR FIRST TYPESCRIPT PROGRAM
// -----------------------------------------------------------------------------

// Let's put it all together with a simple typed function:

function add(a: number, b: number): number {
  // a: number  ->  parameter type annotation
  // b: number  ->  parameter type annotation
  // : number   ->  return type annotation (after the parentheses)
  return a + b;
}

const sum = add(10, 20);
console.log("Sum:", sum); // 30

// Try uncommenting this line — you'll get a compile-time error:
// add(5, "10"); // Error: Argument of type 'string' is not assignable to 'number'

// In plain JavaScript, add(5, "10") would silently return "510" (string concatenation).
// TypeScript catches this BEFORE the code ever runs.


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  COMMAND                         PURPOSE
//  ------------------------------------------------------------------
//  npm i -D typescript             Install TS locally (recommended)
//  npx tsc --init                  Generate tsconfig.json
//  npx tsc                         Compile project
//  npx tsc --watch                 Auto-recompile on save
//  npx tsc --noEmit                Type-check only (no JS output)
//  npx ts-node src/index.ts        Run TS directly
//
//  KEY tsconfig OPTIONS:
//  strict: true       -> enables all strict checks (ALWAYS use this)
//  target: "ES2020"   -> JS version to output
//  outDir: "./dist"   -> where compiled JS goes
//  rootDir: "./src"   -> where your TS source lives
//  sourceMap: true    -> enables debugging TS in browser devtools


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is TypeScript?
//  A: TypeScript is a statically typed superset of JavaScript developed by
//     Microsoft. It adds optional type annotations, interfaces, generics,
//     and other features. It compiles to plain JavaScript.
//
//  Q2: Does TypeScript run in the browser?
//  A: No. Browsers only understand JavaScript. TypeScript must be compiled
//     to .js first using the tsc compiler.
//
//  Q3: What does tsc do?
//  A: tsc (TypeScript Compiler) does two things:
//     1. Type-checks your code (catches errors)
//     2. Transpiles .ts files to .js files (strips types)
//
//  Q4: What is the difference between tsc and ts-node?
//  A: tsc compiles TS to JS files on disk. ts-node compiles and runs TS
//     in memory — no .js files are created. ts-node is for development;
//     tsc is for production builds.
//
//  Q5: What happens to TypeScript types at runtime?
//  A: They are completely ERASED. The compiled JavaScript has zero trace
//     of type annotations. Types have no runtime cost and no impact on
//     behavior — they exist purely as a development aid.
//
//  Q6: Why is "strict: true" important?
//  A: It enables all strict type-checking flags at once. Without it,
//     TypeScript allows many unsafe patterns (like implicit any, unchecked
//     null access) that defeat the purpose of using TS.


console.log("-- 01_setup_and_basics.ts executed successfully --");
