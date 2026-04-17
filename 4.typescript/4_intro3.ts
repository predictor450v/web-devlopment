/**
 * File: advanced-typescript-concepts.ts
 *
 * Covers:
 * - Structural Typing (Duck Typing)
 * - Utility Types (Partial, Required, Pick, Omit)
 * - Functions (basics, void, optional params)
 * - Arrays & Readonly Arrays
 * - Tuples
 * - Enums
 *
 * Focus:
 * - Real-world usage
 * - Interview traps
 * - Internal behavior of TS
 */
export {};
// ======================================================
// 1. STRUCTURAL TYPING (Duck Typing)
// ======================================================

/**
 * TypeScript uses STRUCTURAL typing, not nominal typing.
 * If it "looks like" the type → it's accepted.
 */

type Point = {
  x: number;
  y: number;
};

function printPoint(p: Point) {
  console.log(`X: ${p.x}, Y: ${p.y}`);
}

const obj = { x: 10, y: 20, z: 30 };

printPoint(obj); // ✅ Allowed (extra property ignored)

/**
 * Interview Insight:
 * - TS checks shape, not name
 * - This is called Duck Typing:
 *   "If it walks like a duck and quacks like a duck..."
 */

/**
 * BUT:
 * Excess property checking happens in object literals
 */
printPoint({ x: 1, y: 2, z: 3 }); // ❌ Error (extra property)


// ======================================================
// 2. UTILITY TYPES
// ======================================================

type User = {
  id: string;
  name: string;
  email?: string;
};

// ------------------ Partial<T> ------------------

/**
 * Makes all properties optional
 */
type PartialUser = Partial<User>;

const u1: PartialUser = { name: "Ayushman" };

/**
 * Real-world use:
 * - Update APIs (PATCH requests)
 */


// ------------------ Required<T> ------------------

/**
 * Makes all properties required
 */
type RequiredUser = Required<User>;

const u2: RequiredUser = {
  id: "1",
  name: "A",
  email: "a@mail.com",
};


// ------------------ Pick<T> ------------------

/**
 * Select specific properties
 */
type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = {
  id: "1",
  name: "Ayushman",
};


// ------------------ Omit<T> ------------------

/**
 * Remove specific properties
 */
type UserWithoutEmail = Omit<User, "email">;

const u3: UserWithoutEmail = {
  id: "2",
  name: "Rahul",
};


// ======================================================
// 3. FUNCTIONS BASICS
// ======================================================

/**
 * Function with types
 */
function multiply(a: number, b: number): number {
  return a * b;
}

// Arrow function
const divide = (a: number, b: number): number => a / b;


// ======================================================
// 4. VOID RETURN TYPE
// ======================================================

/**
 * void means:
 * - function returns nothing
 */
function logMessage(msg: string): void {
  console.log(msg);
}

/**
 * Interview Trap:
 * void ≠ undefined exactly
 */


// ======================================================
// 5. OPTIONAL PARAMETERS
// ======================================================

function greet(name: string, age?: number): string {
  return age ? `${name} is ${age}` : `${name}`;
}

/**
 * Rule:
 * Optional params must be LAST
 */
// function wrong(a?: number, b: number) {} ❌


// ======================================================
// 6. ARRAYS BASICS
// ======================================================

// Two ways to define arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["A", "B"];

/**
 * Mixed types (not recommended)
 */
const mixed: (number | string)[] = [1, "A"];


// ======================================================
// 7. READONLY ARRAYS
// ======================================================

/**
 * Prevent modification
 */
const readonlyNums: readonly number[] = [1, 2, 3];

// readonlyNums.push(4); ❌ Error

/**
 * Alternative:
 */
const readonlyNums2: ReadonlyArray<number> = [1, 2, 3];


// ======================================================
// 8. TUPLES
// ======================================================

/**
 * Fixed-length, fixed-type arrays
 */
const userTuple: [string, number] = ["Ayushman", 20];

/**
 * Accessing elements
 */
const username = userTuple[0];
const age = userTuple[1];

/**
 * Advanced tuple
 */
type RGB = [number, number, number];

const color: RGB = [255, 0, 0];

/**
 * Interview Insight:
 * - Tuples enforce order
 */


// ======================================================
// 9. ENUMS
// ======================================================

/**
 * Enums are runtime objects
 */
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const move: Direction = Direction.Up;

/**
 * Custom values
 */
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500,
}

console.log(Status.Success); // 200

/**
 * String enums
 */
enum Role {
  Admin = "ADMIN",
  User = "USER",
}

const currentRole: Role = Role.Admin;

/**
 * Interview Insight:
 * - Enums exist at runtime (unlike types)
 * - Often replaced by union types in modern TS
 */


// ======================================================
// 10. MODERN ALTERNATIVE TO ENUM
// ======================================================

type DirectionType = "UP" | "DOWN" | "LEFT" | "RIGHT";

const dir: DirectionType = "UP";

/**
 * Why preferred:
 * - lighter
 * - no runtime overhead
 */


// ======================================================
// FINAL SUMMARY LOG
// ======================================================

console.log("✅ Advanced TypeScript concepts executed");