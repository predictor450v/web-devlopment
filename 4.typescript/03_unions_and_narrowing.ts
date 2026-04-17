export {};
// =============================================================================
//  03 | UNIONS & TYPE NARROWING
// =============================================================================
//
//  Prerequisites : 02_type_system.ts
//  Next File     : 04_objects_and_interfaces.ts
//
//  This file covers:
//    1. Union types (A | B)
//    2. Literal types
//    3. Type narrowing (typeof, instanceof, in, truthiness)
//    4. Discriminated unions (the most powerful pattern in TS)
//    5. Exhaustive checks with `never`
//    6. Custom type predicates (the `is` keyword)
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — UNION TYPES
// -----------------------------------------------------------------------------

// A union type means: "this value can be ONE OF these types."
// Syntax: TypeA | TypeB

let id: string | number;
id = "abc-123";   // OK — string is in the union
id = 42;          // OK — number is in the union
// id = true;     // ERROR — boolean is NOT in the union

// Union with null (VERY common pattern for optional data):
let nickname: string | null = null;
nickname = "Ayu"; // later we assign a real value

// WHY THIS MATTERS:
// In real apps, data is often "one thing OR another."
// API response: success OR error. Value: present OR null.
// Unions let you model this precisely.

// Using union in function parameters:
function formatId(id: string | number): string {
  // IMPORTANT: Inside here, TS only lets you use methods that
  // BOTH string AND number share (like .toString()).
  // To use string-specific methods, you must NARROW first.
  return id.toString();
}

console.log(formatId("abc")); // "abc"
console.log(formatId(123));   // "123"


// -----------------------------------------------------------------------------
//  SECTION 2 — LITERAL TYPES
// -----------------------------------------------------------------------------

// Literal types restrict a variable to SPECIFIC VALUES (not just any string/number).

// String literal union (like a lightweight enum):
type Direction = "north" | "south" | "east" | "west";
let move: Direction = "north"; // OK
// move = "up";  // ERROR — "up" is not in the union

// Number literal union:
type StatusCode = 200 | 400 | 404 | 500;
let code: StatusCode = 200;
// code = 201;  // ERROR — 201 is not in the union

// Boolean literal (less common, but useful):
type Success = true;
let result: Success = true;
// result = false; // ERROR

// REAL-WORLD USAGE:
// Literal unions are BETTER than enums in most cases:
// - No runtime overhead (they're erased at compile time)
// - Autocomplete works perfectly
// - Exhaustive checking works with switch statements

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function makeRequest(method: HttpMethod, url: string) {
  console.log(`${method} ${url}`);
}

makeRequest("GET", "/api/users"); // OK — autocomplete shows all options
// makeRequest("FETCH", "/api"); // ERROR — "FETCH" not in HttpMethod


// -----------------------------------------------------------------------------
//  SECTION 3 — TYPE NARROWING
// -----------------------------------------------------------------------------

// Narrowing = TypeScript analyzing your code's CONTROL FLOW to automatically
// REFINE a union type into a more specific type inside a block.

// In plain English: "TS watches your if/else and switch statements
// to figure out what the type MUST be at each point."

// -- TECHNIQUE 1: typeof guard --
function processInput(input: string | number) {
  // Here: input is string | number (could be either)

  if (typeof input === "string") {
    // Here: TS KNOWS input is string (narrowed!)
    console.log(input.toUpperCase()); // .toUpperCase() is safe
  } else {
    // Here: TS KNOWS input is number (only option left)
    console.log(input.toFixed(2)); // .toFixed() is safe
  }
}

processInput("hello"); // "HELLO"
processInput(3.14159); // "3.14"


// -- TECHNIQUE 2: instanceof guard (for class instances) --
function handleError(err: Error | string) {
  if (err instanceof Error) {
    // Narrowed to Error — can access .message, .stack
    console.log("Error:", err.message);
  } else {
    // Narrowed to string
    console.log("Message:", err);
  }
}


// -- TECHNIQUE 3: truthiness narrowing --
function greetUser(name: string | null) {
  if (name) {
    // null is falsy -> inside this block, name is string
    console.log(`Hello, ${name.toUpperCase()}`);
  } else {
    console.log("Hello, stranger");
  }
}

// COMMON MISTAKE with truthiness:
// 0 and "" are ALSO falsy. If your value could be 0 or "",
// truthiness narrowing will incorrectly exclude those valid values.
function showCount(count: number | null) {
  // BAD: if (count) { ... } // This skips 0!
  // GOOD:
  if (count !== null) {
    console.log("Count:", count); // Works for 0 too
  }
}


// -- TECHNIQUE 4: `in` operator (checks if property exists on object) --
type Cat = { meow: () => void; name: string };
type Dog = { bark: () => void; name: string };

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    // Narrowed to Cat (only Cat has `meow`)
    animal.meow();
  } else {
    // Narrowed to Dog
    animal.bark();
  }
}


// -- TECHNIQUE 5: equality narrowing --
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // If a === b, they must BOTH be strings (the only overlapping type)
    // TS narrows both to string here
    console.log(a.toUpperCase()); // safe
    console.log(b.toUpperCase()); // safe
  }
}


// -----------------------------------------------------------------------------
//  SECTION 4 — DISCRIMINATED UNIONS (THE MOST POWERFUL PATTERN)
// -----------------------------------------------------------------------------

// A discriminated union is a union of object types where each member has
// a COMMON LITERAL PROPERTY (the "discriminant") that uniquely identifies it.
// TS uses this property to narrow the union automatically.

type Circle    = { kind: "circle";    radius: number };
type Square    = { kind: "square";    side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Shape = Circle | Square | Rectangle; // discriminant: `kind`

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TS knows shape is Circle here -> radius is available
      return Math.PI * shape.radius ** 2;

    case "square":
      // TS knows shape is Square -> side is available
      return shape.side ** 2;

    case "rectangle":
      // TS knows shape is Rectangle -> width and height are available
      return shape.width * shape.height;
  }
}

console.log(getArea({ kind: "circle", radius: 5 }));       // 78.54
console.log(getArea({ kind: "square", side: 4 }));          // 16
console.log(getArea({ kind: "rectangle", width: 3, height: 7 })); // 21

// REAL-WORLD EXAMPLE — Redux-like action pattern:
type Action =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "CLEAR_TODOS" };

function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.text]; // `text` is available here
    case "TOGGLE_TODO":
      console.log("Toggle:", action.id); // `id` is available here
      return state;
    case "CLEAR_TODOS":
      return []; // no extra fields needed
  }
}

// ANOTHER REAL-WORLD EXAMPLE — API response pattern:
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function handleResponse(res: ApiResponse<{ name: string }>) {
  switch (res.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Got:", res.data.name); // `data` only exists on success
      break;
    case "error":
      console.log("Error:", res.message); // `message` only exists on error
      break;
  }
}

// WHY DISCRIMINATED UNIONS ARE SO IMPORTANT:
// They model STATE MACHINES at the type level.
// Each state has exactly the data it needs — nothing more, nothing less.
// TS enforces that you handle all states and access only valid properties.


// -----------------------------------------------------------------------------
//  SECTION 5 — EXHAUSTIVE CHECKS WITH `never`
// -----------------------------------------------------------------------------

// Exhaustive checking ensures you handle EVERY case of a union.
// If someone adds a new type later, TS will FORCE you to handle it.

type Fruit = "apple" | "banana" | "orange";

function getFruitColor(fruit: Fruit): string {
  switch (fruit) {
    case "apple":  return "red";
    case "banana": return "yellow";
    case "orange": return "orange";
    default:
      // If ALL cases are handled, `fruit` becomes `never` here.
      // If a new fruit is added to the union WITHOUT a case for it,
      // this line becomes a compile error — TS alerts you!
      const _exhaustiveCheck: never = fruit;
      throw new Error(`Unhandled fruit: ${_exhaustiveCheck}`);
  }
}

// TRY THIS: Add "grape" to the Fruit union without adding a case.
// You'll get: Type '"grape"' is not assignable to type 'never'.
// This is a COMPILE-TIME guard that prevents forgotten cases.

// WHY THIS MATTERS:
// In large codebases, unions grow over time. Exhaustive checks guarantee
// that EVERY switch statement handling that union stays complete.


// -----------------------------------------------------------------------------
//  SECTION 6 — CUSTOM TYPE PREDICATES (THE `is` KEYWORD)
// -----------------------------------------------------------------------------

// Sometimes typeof and instanceof aren't enough.
// You need a CUSTOM function to check if something is a specific type.
// A type predicate is a function whose return type is `param is Type`.

interface Fish { swim: () => void }
interface Bird { fly: () => void }

// Custom type predicate function:
function isFish(animal: Fish | Bird): animal is Fish {
  // The return type `animal is Fish` tells TS:
  // "If this function returns true, treat `animal` as Fish in the calling scope."
  return (animal as Fish).swim !== undefined;
}

function moveAnimal(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // TS knows it's Fish here
  } else {
    animal.fly();  // TS knows it's Bird here
  }
}

// MORE PRACTICAL — validating unknown API data:
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}

// Usage with API response:
const apiData: unknown = JSON.parse('{"id": 1, "name": "Ayushman", "email": "a@b.com"}');

if (isUser(apiData)) {
  // TS now treats apiData as User — all properties are accessible
  console.log(apiData.name);  // "Ayushman"
  console.log(apiData.email); // "a@b.com"
}

// WHY THIS MATTERS:
// Type predicates bridge the gap between compile-time types and runtime checks.
// They're essential for validating external data (APIs, user input, JSON).


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT                 SYNTAX                         USE CASE
//  ----------------------  -----------------------------  --------------------------
//  Union type              string | number                Value can be either type
//  Literal type            "north" | "south"              Restrict to exact values
//  typeof guard            typeof x === "string"          Narrow primitives
//  instanceof guard        x instanceof Error             Narrow class instances
//  in guard                "prop" in obj                  Check property existence
//  Truthiness guard        if (x) { ... }                 Remove null/undefined
//  Equality guard          if (a === b) { ... }           Narrow overlapping types
//  Discriminated union     { kind: "circle"; ... }        Model state machines
//  Exhaustive check        const _: never = x             Catch unhandled cases
//  Type predicate          function isX(v): v is X        Custom type guard


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is a union type?
//  A: A type that can be one of several types, written as TypeA | TypeB.
//     You can only use operations that are valid for ALL types in the union
//     unless you narrow the type first.
//
//  Q2: What is type narrowing?
//  A: TS analyzing control flow (if/else, switch, typeof, instanceof)
//     to refine a union type into a more specific type within a block.
//
//  Q3: What is a discriminated union?
//  A: A union of object types where each member has a common literal
//     property (like `kind` or `type`) that uniquely identifies it.
//     TS uses this property to narrow the union in switch statements.
//     This is the most powerful pattern in TypeScript.
//
//  Q4: What is an exhaustive check?
//  A: A pattern using `never` in the default case of a switch statement
//     to guarantee at compile time that all union members are handled.
//     If a new member is added without a case, TS produces an error.
//
//  Q5: What is a type predicate?
//  A: A function with return type `param is Type`. When it returns true,
//     TS narrows the parameter to that type in the calling scope.
//     Used for custom validation logic (e.g., checking API responses).
//
//  Q6: What is the difference between typeof and instanceof?
//  A: typeof works on primitives (string, number, boolean, etc.).
//     instanceof works on class instances (Error, Date, Array, custom classes).
//     Neither works on interfaces or type aliases — use `in` or type predicates.


console.log("-- 03_unions_and_narrowing.ts executed successfully --");
