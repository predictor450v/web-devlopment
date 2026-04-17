export {};
// =============================================================================
//  12 | MODULES & NAMESPACES
// =============================================================================
//
//  Prerequisites : 11_advanced_types.ts
//  Next File     : 13_dom_and_events.ts
//
//  This file covers:
//    1. What are modules? (ES Modules)
//    2. Named exports & imports
//    3. Default exports
//    4. Re-exports
//    5. import type (type-only imports)
//    6. Declaration files (.d.ts)
//    7. @types packages (DefinitelyTyped)
//    8. Module resolution (how TS finds modules)
//    9. Namespaces (legacy, but good to know)
//   10. Module augmentation
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — WHAT ARE MODULES?
// -----------------------------------------------------------------------------

// A MODULE is any file that has at least one `import` or `export` statement.
// Without import/export, a file is a "script" — everything is in the global scope.

// In TypeScript (and modern JS), each file is its own module with its own scope.
// Variables, functions, and types declared in a module are PRIVATE by default.
// You must explicitly EXPORT them to make them available to other files.

// WHY MODULES MATTER:
//   - Encapsulation: each file has its own scope (no global pollution)
//   - Reusability: import specific pieces where you need them
//   - Maintainability: clear dependencies between files
//   - Tree-shaking: bundlers can remove unused exports

// NOTE: The `export {}` at the top of this file makes it a module,
// preventing global scope conflicts with other .ts files.


// -----------------------------------------------------------------------------
//  SECTION 2 — NAMED EXPORTS & IMPORTS
// -----------------------------------------------------------------------------

// EXPORTING — make items available to other files:

// FILE: math.ts
// export function add(a: number, b: number): number {
//   return a + b;
// }
//
// export function subtract(a: number, b: number): number {
//   return a - b;
// }
//
// export const PI = 3.14159;
//
// export interface MathResult {
//   value: number;
//   operation: string;
// }

// IMPORTING — bring items into this file:

// FILE: app.ts
// import { add, subtract, PI, MathResult } from "./math";
//
// const sum = add(10, 20);
// console.log(PI);

// RENAME ON IMPORT (aliasing):
// import { add as addNumbers } from "./math";
// const result = addNumbers(5, 10);

// IMPORT EVERYTHING as a namespace object:
// import * as MathUtils from "./math";
// MathUtils.add(5, 10);
// MathUtils.PI;

// RENAME ON EXPORT:
// export { add as addNumbers, subtract as subtractNumbers };


// -----------------------------------------------------------------------------
//  SECTION 3 — DEFAULT EXPORTS
// -----------------------------------------------------------------------------

// Each module can have ONE default export.
// The importer can name it whatever they want.

// FILE: User.ts
// export default class User {
//   constructor(public name: string, public age: number) {}
// }

// FILE: app.ts
// import User from "./User";          // Can name it anything
// import MyUser from "./User";        // Same import, different name
// const u = new User("Ayushman", 21);

// MIXING default and named exports:
// FILE: config.ts
// const config = { host: "localhost", port: 3000 };
// export default config;
// export type Config = typeof config;

// FILE: app.ts
// import config, { Config } from "./config";

// RECOMMENDATION:
// Prefer NAMED exports over default exports.
// Reasons:
//   - Named exports enforce consistent naming across your codebase
//   - IDE auto-imports work better with named exports
//   - Easier to refactor (rename propagates everywhere)
//   - Default exports make it easy to accidentally use different names


// -----------------------------------------------------------------------------
//  SECTION 4 — RE-EXPORTS
// -----------------------------------------------------------------------------

// Re-export items from another module (barrel exports).
// Common pattern: index.ts file that re-exports from multiple files.

// FILE: models/User.ts
// export interface User { id: number; name: string; }

// FILE: models/Post.ts
// export interface Post { id: string; title: string; }

// FILE: models/index.ts (BARREL FILE):
// export { User } from "./User";
// export { Post } from "./Post";
// export * from "./helpers";  // re-export everything

// FILE: app.ts
// import { User, Post } from "./models"; // Clean single import!

// WHY BARREL EXPORTS:
// - Cleaner imports (one path instead of many)
// - Hide internal module structure
// - Common in React component libraries


// -----------------------------------------------------------------------------
//  SECTION 5 — import type (TYPE-ONLY IMPORTS)
// -----------------------------------------------------------------------------

// `import type` imports ONLY the type information.
// It is completely REMOVED at compile time — zero JS output.

// REGULAR import (included in JS output):
// import { User } from "./models";

// TYPE-ONLY import (removed in JS output):
// import type { User } from "./models";

// WHEN TO USE import type:
// - Importing interfaces, type aliases, or types you ONLY use as types
// - Prevents accidental runtime dependency on type-only modules
// - Reduces bundle size (bundler knows it's type-only)

// INLINE TYPE IMPORT (TS 4.5+):
// import { type User, createUser } from "./models";
// User is type-only, createUser is runtime

// EXPORT TYPE:
// export type { User };  // Type-only re-export
// export type { User } from "./models";

// REAL-WORLD EXAMPLE:
// import type { AxiosError } from "axios";
// // Axios types are removed at runtime — no need to bundle them.
// // Only the actual axios functions remain.


// -----------------------------------------------------------------------------
//  SECTION 6 — DECLARATION FILES (.d.ts)
// -----------------------------------------------------------------------------

// .d.ts files contain ONLY type declarations — no implementation code.
// They tell TypeScript the shape of external code (JS libraries, global variables).

// EXAMPLE: my-lib.d.ts
// declare function greet(name: string): string;
// declare const VERSION: string;
//
// declare interface Config {
//   host: string;
//   port: number;
// }
//
// declare module "my-special-lib" {
//   export function doSomething(): void;
//   export const value: number;
// }

// WHEN .d.ts FILES ARE USED:
// 1. Publishing a JS library with type support
// 2. Adding types to a third-party JS library that has no types
// 3. Declaring global variables (from CDN scripts, window extensions)
// 4. Type-only packages (e.g., @types/node)

// HOW tsc GENERATES THEM:
// Set "declaration": true in tsconfig.json
// tsc will output .d.ts files alongside .js files

// EXAMPLE OUTPUT:
// Source: src/math.ts  ->  dist/math.js + dist/math.d.ts
// The .d.ts file contains type info for consumers of your library.


// -----------------------------------------------------------------------------
//  SECTION 7 — @types PACKAGES (DefinitelyTyped)
// -----------------------------------------------------------------------------

// Many JavaScript libraries (lodash, express, react) were written in plain JS.
// The DefinitelyTyped project provides community-maintained type definitions.

// INSTALLING TYPES:
// npm install --save-dev @types/express
// npm install --save-dev @types/lodash
// npm install --save-dev @types/node

// AFTER INSTALLING:
// import express from "express";
// express is now fully typed — TypeScript reads from @types/express

// HOW IT WORKS:
// TypeScript automatically searches node_modules/@types/ for type definitions.
// When you import "express", TS looks for:
//   1. express package's own types (if it has .d.ts files)
//   2. @types/express package

// CHECKING IF TYPES EXIST:
// Many modern libraries ship their own types (axios, prisma, zod).
// Check the library's package.json for a "types" or "typings" field.

// COMMON @types PACKAGES:
// @types/node        - Node.js APIs (fs, path, http, etc.)
// @types/react       - React
// @types/express     - Express
// @types/lodash      - Lodash


// -----------------------------------------------------------------------------
//  SECTION 8 — MODULE RESOLUTION
// -----------------------------------------------------------------------------

// When you write `import { x } from "./utils"`, TS needs to FIND the file.
// This is called module resolution.

// TWO STRATEGIES:
//
// 1. NODE (default for "module": "commonjs")
//    Mimics Node.js resolution:
//    import "./utils"
//      -> ./utils.ts
//      -> ./utils.tsx
//      -> ./utils/index.ts
//      -> checks node_modules/
//
// 2. BUNDLER (recommended for Vite/webpack)
//    Set "moduleResolution": "bundler" in tsconfig
//    Similar to Node but with extras for package.json "exports"

// PATH ALIASES:
// You can set up shortcut paths in tsconfig:
// {
//   "compilerOptions": {
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["src/*"],
//       "@components/*": ["src/components/*"]
//     }
//   }
// }
//
// Then import:
// import { Button } from "@components/Button";
// Instead of:
// import { Button } from "../../../components/Button";

// NOTE: Path aliases in tsconfig are for TYPE CHECKING only.
// Your bundler (Vite, webpack) needs its own alias config to resolve at build time.


// -----------------------------------------------------------------------------
//  SECTION 9 — NAMESPACES (LEGACY)
// -----------------------------------------------------------------------------

// Namespaces were TypeScript's original module system (before ES Modules).
// They use the `namespace` keyword to group related code.

namespace Validation {
  export function isEmail(email: string): boolean {
    return email.includes("@");
  }

  export function isNotEmpty(str: string): boolean {
    return str.length > 0;
  }

  // NOT exported — private to the namespace
  function sanitize(input: string): string {
    return input.trim();
  }
}

// Usage:
console.log(Validation.isEmail("ayush@example.com")); // true
console.log(Validation.isNotEmpty("hello"));           // true
// Validation.sanitize("hi"); // ERROR — not exported

// IMPORTANT: Namespaces are LEGACY.
// Modern TypeScript uses ES Modules (import/export) exclusively.
// Use namespaces only when:
//   - Working with legacy TS codebases
//   - Augmenting global types (see next section)
//   - Declaration files for older libraries


// -----------------------------------------------------------------------------
//  SECTION 10 — MODULE AUGMENTATION
// -----------------------------------------------------------------------------

// You can ADD new properties to existing types from third-party libraries.
// This is called "module augmentation" — uses declaration merging.

// EXAMPLE 1: Adding a custom property to Express Request:
// FILE: types/express.d.ts
// import "express";
//
// declare module "express" {
//   interface Request {
//     userId?: string;
//     role?: "admin" | "user";
//   }
// }
// Now every Express Request object has optional userId and role fields.

// EXAMPLE 2: Adding to the Window object:
// declare global {
//   interface Window {
//     analytics: {
//       track(event: string, data?: object): void;
//     };
//   }
// }
// Now window.analytics.track("click") is typed.

// EXAMPLE 3: Adding to a module's types:
// declare module "my-lib" {
//   interface Config {
//     customField: string; // added by your project
//   }
// }

// WHY THIS IS POWERFUL:
// You don't modify the library's code — you extend its types.
// This is a clean way to handle custom middleware, plugins, and extensions.


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN                    SYNTAX
//  -------------------------  --------------------------------------------------
//  Named export               export function fn() {}
//  Named import               import { fn } from "./module"
//  Default export             export default class X {}
//  Default import             import X from "./module"
//  Import all                 import * as Mod from "./module"
//  Type-only import           import type { T } from "./module"
//  Inline type import         import { type T, fn } from "./module"
//  Re-export                  export { X } from "./module"
//  Re-export all              export * from "./module"
//  Declaration file           .d.ts (types only, no implementation)
//  Install types              npm i -D @types/packagename
//  Path alias                 "paths": { "@/*": ["src/*"] }
//  Module augmentation        declare module "lib" { ... }
//  Global augmentation        declare global { ... }


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is the difference between named and default exports?
//  A: Named exports require curly braces to import and enforce consistent
//     naming. Default exports can be imported with any name. A module
//     can have one default export and many named exports.
//
//  Q2: What does `import type` do?
//  A: It imports ONLY the type information, which is completely removed
//     at compile time. It produces zero JS output and prevents accidental
//     runtime dependencies on type-only modules.
//
//  Q3: What is a .d.ts file?
//  A: A declaration file that contains only type definitions — no runtime
//     code. Used to provide type information for JS libraries, global
//     variables, and published packages.
//
//  Q4: What is module augmentation?
//  A: Adding new properties to existing types from third-party libraries
//     using `declare module`. It extends types without modifying library
//     code. Common with Express, React, and other frameworks.
//
//  Q5: What are @types packages?
//  A: Community-maintained type definitions (from DefinitelyTyped) for
//     JavaScript libraries that don't ship their own types.
//     Install with: npm install --save-dev @types/packagename
//
//  Q6: Why are named exports preferred over default exports?
//  A: Named exports enforce consistent naming across the codebase,
//     work better with IDE auto-imports, and make refactoring easier
//     (rename propagates). Default exports allow inconsistent naming.


console.log("-- 12_modules_and_namespaces.ts executed successfully --");
