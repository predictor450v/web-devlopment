export {};
// =============================================================================
//  06 | ARRAYS, TUPLES & ENUMS
// =============================================================================
//
//  Prerequisites : 05_functions.ts
//  Next File     : 07_classes_and_oop.ts
//
//  This file covers:
//    1. Array types (two syntaxes)
//    2. Readonly arrays
//    3. Array of objects
//    4. Multidimensional arrays
//    5. Tuples (fixed-length typed arrays)
//    6. Named tuples & optional tuple elements
//    7. Rest elements in tuples
//    8. Numeric enums
//    9. String enums
//   10. Const enums
//   11. Enum alternatives (literal unions)
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — ARRAY TYPES
// -----------------------------------------------------------------------------

// Two syntaxes to declare arrays (both are identical):

// SYNTAX 1: Type[] (more common)
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Ayushman", "Rahul", "Alice"];
const flags: boolean[] = [true, false, true];

// SYNTAX 2: Array<Type> (generic syntax)
const scores: Array<number> = [95, 87, 72];
const words: Array<string> = ["hello", "world"];

// MIXED TYPE ARRAYS (union arrays):
const mixed: (string | number)[] = [1, "two", 3, "four"];
// Each element can be string OR number.

// TS INFERS array types:
const inferred = [1, 2, 3]; // TS infers: number[]
const inferredMixed = [1, "hello"]; // TS infers: (string | number)[]

// EMPTY ARRAYS — must annotate or TS infers `any[]`:
const items: string[] = []; // Good — typed
items.push("apple");
items.push("banana");
// items.push(42); // ERROR — only strings allowed


// -----------------------------------------------------------------------------
//  SECTION 2 — READONLY ARRAYS
// -----------------------------------------------------------------------------

// Readonly arrays cannot be modified (no push, pop, splice, index assignment).

const readonlyNums: readonly number[] = [1, 2, 3];
// readonlyNums.push(4);   // ERROR — push doesn't exist on readonly
// readonlyNums[0] = 99;   // ERROR — index assignment not allowed
// readonlyNums.splice(0); // ERROR — splice doesn't exist

// Alternative syntax:
const moreReadonly: ReadonlyArray<string> = ["a", "b", "c"];

// WHY USE READONLY?
// Prevents accidental mutation. Especially useful in:
//   - Function parameters (function should read, not modify)
//   - React state (state should be immutable)
//   - Config objects that shouldn't change

function printNames(names: readonly string[]): void {
  // names.push("new"); // ERROR — can't modify readonly param
  names.forEach(name => console.log(name)); // reading is fine
}

// IMPORTANT:
// readonly is compile-time only. The JS output is a regular array.
// For runtime immutability, use Object.freeze().


// -----------------------------------------------------------------------------
//  SECTION 3 — ARRAY OF OBJECTS
// -----------------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  age: number;
}

const users: User[] = [
  { id: "1", name: "Ayushman", age: 21 },
  { id: "2", name: "Rahul", age: 22 },
  { id: "3", name: "Alice", age: 20 },
];

// Array methods are fully typed:
const adultNames = users
  .filter(user => user.age >= 21) // user is typed as User
  .map(user => user.name);        // returns string[]

console.log(adultNames); // ["Ayushman", "Rahul"]

// Finding an element:
const found = users.find(u => u.id === "2"); // found is User | undefined
if (found) {
  console.log(found.name); // "Rahul" — narrowed from User | undefined to User
}


// -----------------------------------------------------------------------------
//  SECTION 4 — MULTIDIMENSIONAL ARRAYS
// -----------------------------------------------------------------------------

// 2D array (array of arrays):
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(matrix[1][2]); // 6 (row 1, col 2)

// 3D array:
const cube: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]],
];

// PRACTICAL: Grid-based data, game boards, spreadsheets.


// -----------------------------------------------------------------------------
//  SECTION 5 — TUPLES
// -----------------------------------------------------------------------------

// A tuple is a FIXED-LENGTH array where each position has a SPECIFIC type.
// Unlike regular arrays, the ORDER and COUNT of types matter.

const person: [string, number] = ["Ayushman", 21];
// person[0] is string, person[1] is number

// Accessing elements:
const personName: string = person[0]; // typed as string
const personAge: number = person[1];  // typed as number

// DESTRUCTURING tuples:
const [nameVal, ageVal] = person;
console.log(nameVal, ageVal); // "Ayushman" 21

// MORE EXAMPLES:
type RGB = [number, number, number];
const red: RGB = [255, 0, 0];
const green: RGB = [0, 255, 0];

type Coordinate = [number, number];
const origin: Coordinate = [0, 0];

// ERROR CASES:
// const wrong: RGB = [255, 0];          // ERROR — expected 3 elements
// const also_wrong: RGB = [255, 0, 0, 0]; // ERROR — too many elements
// const type_wrong: RGB = ["255", 0, 0];  // ERROR — first element must be number

// COMMON MISTAKE:
// Tuples can still be pushed to (TypeScript limitation):
const pair: [string, number] = ["age", 21];
pair.push("extra"); // TS allows this! (known limitation)
// This is a TS design trade-off. In practice, use readonly tuples.


// -----------------------------------------------------------------------------
//  SECTION 6 — NAMED TUPLES & OPTIONAL ELEMENTS
// -----------------------------------------------------------------------------

// NAMED TUPLES (TS 4.0+) — labels for readability:
type UserEntry = [name: string, age: number, active: boolean];

const entry: UserEntry = ["Ayushman", 21, true];
// Labels don't change behavior — they just improve documentation
// and editor tooltips.

// OPTIONAL TUPLE ELEMENTS:
type FlexPoint = [number, number, number?]; // z is optional

const point2D: FlexPoint = [10, 20];
const point3D: FlexPoint = [10, 20, 30];

// READONLY TUPLES (prevent .push and mutation):
const immutablePair: readonly [string, number] = ["age", 21];
// immutablePair.push("extra"); // ERROR — readonly tuple


// -----------------------------------------------------------------------------
//  SECTION 7 — REST ELEMENTS IN TUPLES
// -----------------------------------------------------------------------------

// You can have a fixed prefix followed by a variable tail:
type LogEntry = [timestamp: Date, level: string, ...messages: string[]];

const log1: LogEntry = [new Date(), "INFO", "Server started"];
const log2: LogEntry = [new Date(), "ERROR", "Connection failed", "Retry in 5s"];

// MIXED REST:
type StringsAndNumber = [...string[], number]; // strings, then one number
const data: StringsAndNumber = ["a", "b", "c", 42];


// -----------------------------------------------------------------------------
//  SECTION 8 — NUMERIC ENUMS
// -----------------------------------------------------------------------------

// Enums define a SET OF NAMED CONSTANTS.
// By default, enum members get auto-incrementing numeric values.

enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

const move: Direction = Direction.Up;
console.log(move);            // 0
console.log(Direction.Right); // 3

// CUSTOM STARTING VALUE:
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500,
}

console.log(Status.Success);  // 200
console.log(Status.NotFound); // 404

// REVERSE MAPPING (numeric enums only):
console.log(Direction[0]);  // "Up"
console.log(Status[200]);   // "Success"
// This works because numeric enums generate a TWO-WAY mapping object.

// IMPORTANT: Enums are RUNTIME objects.
// Unlike types/interfaces, they exist in the compiled JavaScript.
// This means they have a bundle size cost.


// -----------------------------------------------------------------------------
//  SECTION 9 — STRING ENUMS
// -----------------------------------------------------------------------------

// String enums use string values instead of numbers.
// No auto-incrementing — you must assign each value.

enum Role {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

const currentRole: Role = Role.Admin;
console.log(currentRole); // "ADMIN"

// String enums do NOT support reverse mapping:
// console.log(Role["ADMIN"]); // undefined (doesn't work like numeric enums)

// WHY STRING ENUMS?
// String values are READABLE in logs and debugger.
// Numeric enums show meaningless numbers: 0, 1, 2.
// String enums show: "ADMIN", "EDITOR", "VIEWER".


// -----------------------------------------------------------------------------
//  SECTION 10 — CONST ENUMS
// -----------------------------------------------------------------------------

// const enums are INLINED at compile time (no runtime object).
// The enum is replaced with the literal value wherever it's used.

const enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

const myColor = Color.Red;
// JS Output: const myColor = "RED";
// The Color object doesn't exist at runtime — it's inlined.

// BENEFIT: Zero bundle size cost.
// CAVEAT: Can't be used in certain scenarios (like iterating over values).


// -----------------------------------------------------------------------------
//  SECTION 11 — ENUM ALTERNATIVES (LITERAL UNIONS)
// -----------------------------------------------------------------------------

// Modern TypeScript often PREFERS literal unions over enums:

type DirectionType = "UP" | "DOWN" | "LEFT" | "RIGHT";
const dir: DirectionType = "UP";

type StatusType = "success" | "error" | "loading";
const apiStatus: StatusType = "loading";

// WHY LITERAL UNIONS ARE OFTEN BETTER:
//   - No runtime overhead (erased at compile time, unlike enums)
//   - Simpler syntax
//   - Better tree-shaking
//   - No reverse mapping confusion
//   - Work perfectly with discriminated unions

// WHEN ENUMS ARE STILL USEFUL:
//   - You need runtime access to all values (Object.values(Direction))
//   - You're working with a codebase that already uses them
//   - You want numeric auto-incrementing

// CONST OBJECTS (another alternative):
const DIRECTIONS = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;

type DirectionFromConst = typeof DIRECTIONS[keyof typeof DIRECTIONS];
// "UP" | "DOWN" | "LEFT" | "RIGHT"

// This gives you both runtime values AND a type.


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT              SYNTAX                           NOTES
//  -------------------  -------------------------------  -------------------------
//  Array                number[] or Array<number>        Mutable by default
//  Readonly array       readonly number[]                No push/pop/splice
//  Union array          (string | number)[]              Mixed types
//  Tuple                [string, number]                 Fixed length & types
//  Named tuple          [name: string, age: number]      Labels for docs
//  Readonly tuple       readonly [string, number]        Immutable tuple
//  Numeric enum         enum E { A, B, C }               Auto-incrementing
//  String enum          enum E { A = "A" }               Must assign values
//  Const enum           const enum E { A = "A" }         Inlined, no runtime
//  Literal union        "a" | "b" | "c"                  Modern enum alternative


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is the difference between an array and a tuple?
//  A: Arrays are variable-length with one type (or union).
//     Tuples are fixed-length where each position has a specific type.
//     Arrays: number[] = [1, 2, 3]. Tuple: [string, number] = ["age", 21].
//
//  Q2: What is a readonly array?
//  A: An array that cannot be modified after creation. No push, pop, splice,
//     or index assignment. Declared with `readonly number[]` or `ReadonlyArray<T>`.
//     Compile-time only — the JS output is a normal array.
//
//  Q3: What is the difference between enum and literal union?
//  A: Enums create runtime objects (exist in JS output, have bundle cost).
//     Literal unions are compile-time only (erased, zero cost).
//     Modern TS often prefers literal unions for simplicity and performance.
//
//  Q4: What is a const enum?
//  A: An enum that is INLINED at compile time. The enum object doesn't exist
//     in the JS output — each usage is replaced with the literal value.
//     Benefit: zero bundle cost. Caveat: can't iterate over values.
//
//  Q5: What is reverse mapping in enums?
//  A: Numeric enums generate a two-way object: Direction[0] = "Up" and
//     Direction.Up = 0. String enums do NOT have reverse mapping.
//
//  Q6: When should you use a tuple?
//  A: When you need a fixed-size collection with specific types at each
//     position. Common use cases: function return values ([value, error]),
//     coordinates [x, y], React's useState return [state, setState].


console.log("-- 06_arrays_tuples_enums.ts executed successfully --");
