export {};
/**
 * File: index.ts
 * Purpose:
 * This file demonstrates:
 * - Basic TypeScript setup usage
 * - Compilation awareness (TS → JS)
 * - Functions, types, optional properties
 * - Real-world safe coding patterns
 *
 * How to run:
 * 1. Compile → npx tsc
 * 2. Run → node dist/index.js
 *
 * OR directly:
 * npx ts-node src/index.ts
 */

// ===============================
// 1. Basic Types and Functions
// ===============================

/**
 * TypeScript enforces type safety at compile time
 * These types are REMOVED in JavaScript output
 */
function add(a: number, b: number): number {
  return a + b;
}

const sum = add(10, 20);
console.log("Sum:", sum);


// ===============================
// 2. Optional Properties (?)
// ===============================

/**
 * Optional property example
 */
type User = {
  id: string;
  name: string;
  age?: number; // may be missing or undefined
};

const user1: User = {
  id: "1",
  name: "Ayushman",
};

const user2: User = {
  id: "2",
  name: "Rahul",
  age: 22,
};

console.log("User1:", user1);
console.log("User2:", user2);


// ===============================
// 3. Optional Parameters
// ===============================

/**
 * Optional parameter must come last
 */
function greet(name: string, age?: number): string {
  return age
    ? `Hello ${name}, age ${age}`
    : `Hello ${name}`;
}

console.log(greet("Ayushman"));
console.log(greet("Ayushman", 20));


// ===============================
// 4. Optional Chaining
// ===============================

type Profile = {
  social?: {
    twitter?: string;
  };
};

const profile: Profile = {};

/**
 * Safe access using ?.
 */
const twitterHandle = profile.social?.twitter;

console.log("Twitter:", twitterHandle); // undefined


// ===============================
// 5. Nullish Coalescing (??)
// ===============================

const displayName = twitterHandle ?? "No Handle";

console.log("Display:", displayName);

/**
 * Difference from ||
 */
console.log(0 ?? 10); // 0
console.log(0 || 10); // 10


// ===============================
// 6. Real-World API Pattern
// ===============================

type ApiResponse = {
  data?: {
    user?: {
      id: string;
      email?: string;
    };
  };
};

/**
 * Safe extraction from deeply nested object
 */
function getUserEmail(res: ApiResponse): string {
  return res.data?.user?.email ?? "No Email Found";
}

const apiResponse: ApiResponse = {
  data: {
    user: {
      id: "101",
    },
  },
};

console.log("Email:", getUserEmail(apiResponse));


// ===============================
// 7. Compile-Time vs Runtime
// ===============================

/**
 * IMPORTANT:
 * TypeScript exists only at compile time
 */
let value: number = 10;

// At runtime → just JS:
console.log("Runtime value:", value);

/**
 * This will cause compile error:
 */
// value = "string"; ❌


// ===============================
// 8. Advanced: Type vs Runtime
// ===============================

/**
 * Types are erased after compilation
 */
type Product = {
  name: string;
  price: number;
};

const product: Product = {
  name: "Laptop",
  price: 50000,
};

console.log("Product:", product);


// ===============================
// 9. Common Interview Questions
// ===============================

/**
 * Q1: Does TypeScript run in browser?
 * ❌ No → must compile to JS
 *
 * Q2: What does tsc do?
 * - Type checking
 * - Converts TS → JS
 *
 * Q3: What is removed during compilation?
 * - Types
 * - Interfaces
 *
 * Q4: Difference between ts-node and tsc?
 * - tsc → compile
 * - ts-node → run directly
 */


// ===============================
// 10. Debugging Tip
// ===============================

/**
 * If something compiles but fails at runtime:
 * → It's a JavaScript issue, not TypeScript
 */


// ===============================
// 11. Best Practices
// ===============================

/**
 * ✔ Always use strict mode
 * ✔ Avoid using `any`
 * ✔ Use proper folder structure (src → dist)
 * ✔ Use interfaces/types for data models
 * ✔ Use optional chaining for safety
 */


// ===============================
// 12. Final Execution
// ===============================

console.log("✅ TypeScript setup working correctly!");