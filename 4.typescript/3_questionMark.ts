/**
 * File: optional-question-mark.ts
 * Topic: Usage of '?' in TypeScript
 *
 * Covers:
 * - Optional properties
 * - Optional parameters
 * - Optional chaining
 * - Internal type behavior
 * - Edge cases and interview traps
 */
export {};

// ===============================
// 1. Optional Properties
// ===============================

type User = {
  name: string;
  age?: number; // optional property
};

/**
 * Key Insight:
 * age?: number means:
 * - Property may be missing
 * - OR present with value undefined
 */
const user1: User = { name: "Ayushman" }; // no age
const user2: User = { name: "Ayushman", age: 20 };
const user3: User = { name: "Ayushman", age: undefined };

/**
 * Interview Trap:
 * Difference between:
 */
type A = { age?: number };
type B = { age: number | undefined };

// A allows missing property
const a1: A = {}; // ✅

// B requires property to exist
const b1: B = {}; // ❌ Error


// ===============================
// 2. Optional Function Parameters
// ===============================

function greet(name: string, age?: number) {
  console.log(`Hello ${name}, age: ${age}`);
}

greet("Ayushman");      // age = undefined
greet("Ayushman", 20);

/**
 * Important Rule:
 * Optional params must be last
 */
// function wrong(a?: number, b: number) {} // ❌


// ===============================
// 3. Optional Chaining
// ===============================

type Profile = {
  bio?: {
    twitter?: string;
  };
};

const profile: Profile = {};

/**
 * Without optional chaining → crash risk
 */
// profile.bio.twitter ❌ runtime error

/**
 * With optional chaining → safe
 */
const twitter = profile.bio?.twitter; // undefined

/**
 * Advanced:
 * Works with function calls too
 */
const maybeFn: ((x: number) => number) | undefined = undefined;

const result = maybeFn?.(5); // safe call


// ===============================
// 4. Combining with Nullish Coalescing
// ===============================

const username = profile.bio?.twitter ?? "No Twitter";

/**
 * Difference:
 */
const x = 0 ?? 10;   // 0 (not replaced)
const y = 0 || 10;   // 10 (replaced)


// ===============================
// 5. Deep Type Insight
// ===============================

/**
 * Optional property creates a union internally:
 */
type Internal = {
  value?: number;
};

/**
 * Equivalent behavior:
 */
type Expanded = {
  value: number | undefined;
};

/**
 * BUT:
 * Optional also affects object shape
 */


// ===============================
// 6. Real-World Pattern
// ===============================

type ApiResponse = {
  data?: {
    user?: {
      id: string;
    };
  };
};

function getUserId(res: ApiResponse): string {
  return res.data?.user?.id ?? "anonymous";
}


// ===============================
// 7. When NOT to Use '?'
// ===============================

/**
 * Avoid optional if:
 * - Property MUST exist logically
 */
type BadDesign = {
  id?: string; // ❌ should not be optional
};

/**
 * Better:
 */
type GoodDesign = {
  id: string;
};


// ===============================
// 8. Interview Questions
// ===============================

/**
 * Q1: Difference between ? and | undefined?
 * Answer:
 * - ? → property may be missing
 * - | undefined → property must exist but value can be undefined
 */

/**
 * Q2: What does optional chaining return?
 * Answer:
 * - undefined if chain breaks
 */

/**
 * Q3: Can optional chaining be used with functions?
 * Yes → fn?.()
 */

/**
 * Q4: Why is ? useful?
 * - Prevents runtime crashes
 * - Models real-world incomplete data
 */
