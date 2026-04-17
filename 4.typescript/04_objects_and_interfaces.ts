export {};
// =============================================================================
//  04 | OBJECTS & INTERFACES
// =============================================================================
//
//  Prerequisites : 03_unions_and_narrowing.ts
//  Next File     : 05_functions.ts
//
//  This file covers:
//    1. Object type annotations (inline)
//    2. Type aliases for objects
//    3. Interfaces
//    4. type vs interface (when to use which)
//    5. Structural typing (duck typing)
//    6. Optional properties (?)
//    7. Readonly properties
//    8. Index signatures
//    9. Excess property checking
//   10. Extending / composing types
//   11. Declaration merging (interfaces only)
//   12. Nested objects
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — INLINE OBJECT TYPE ANNOTATIONS
// -----------------------------------------------------------------------------

// You can define an object's shape directly where you use it:

let profile: { name: string; age: number; email?: string } = {
  name: "Ayushman",
  age: 21,
};

// This works, but gets messy when you reuse the same shape.
// That's where type aliases and interfaces come in.


// -----------------------------------------------------------------------------
//  SECTION 2 — TYPE ALIASES FOR OBJECTS
// -----------------------------------------------------------------------------

// A type alias gives a NAME to any type — including object shapes.
// Keyword: `type`

type User = {
  id: string;
  name: string;
  email: string;
  age?: number; // optional property (covered later)
};

const user1: User = {
  id: "u1",
  name: "Ayushman",
  email: "ayush@example.com",
};

const user2: User = {
  id: "u2",
  name: "Rahul",
  email: "rahul@example.com",
  age: 22,
};

// Type aliases can also represent primitives, unions, tuples, functions:
type UserID = string | number;
type Callback = (event: string) => void;
type Pair<T> = [T, T];
type Maybe<T> = T | null | undefined;


// -----------------------------------------------------------------------------
//  SECTION 3 — INTERFACES
// -----------------------------------------------------------------------------

// An interface also describes the shape of an OBJECT.
// Keyword: `interface`

interface Product {
  id: string;
  name: string;
  price: number;
}

const laptop: Product = {
  id: "p1",
  name: "MacBook Pro",
  price: 150000,
};

// Interfaces support METHOD SIGNATURES too:
interface Animal {
  name: string;
  sound(): string;       // method shorthand
  move: () => void;      // property with function type (also valid)
}

const dog: Animal = {
  name: "Bruno",
  sound() { return "Woof!"; },
  move() { console.log("Running..."); },
};


// -----------------------------------------------------------------------------
//  SECTION 4 — type vs interface (WHEN TO USE WHICH)
// -----------------------------------------------------------------------------

// BOTH can describe object shapes. The differences are:
//
//  Feature                  | type          | interface
//  -------------------------|---------------|------------------
//  Object shapes            | YES           | YES
//  Union types              | YES           | NO
//  Intersection types       | YES           | NO (uses extends)
//  Primitive aliases         | YES           | NO
//  Tuple types              | YES           | NO
//  Declaration merging      | NO            | YES
//  Extending                | & (intersect) | extends keyword
//  Computed/mapped types    | YES           | NO
//
//  PRACTICAL GUIDELINE:
//    -> Use `interface` for object shapes & class contracts
//    -> Use `type` for everything else (unions, utilities, complex types)
//    -> Pick one and be CONSISTENT within a project

// Interface — can't do unions:
// interface StringOrNumber = string | number; // ERROR

// Type — CAN do unions:
type StringOrNumber = string | number; // OK

// Interface — CAN extend other interfaces:
interface Admin extends User {
  role: string;
  permissions: string[];
}

// Type — uses intersection (&) to combine:
type AdminType = User & {
  role: string;
  permissions: string[];
};


// -----------------------------------------------------------------------------
//  SECTION 5 — STRUCTURAL TYPING (DUCK TYPING)
// -----------------------------------------------------------------------------

// TypeScript uses STRUCTURAL typing, NOT nominal typing.
//
//  Nominal typing (Java/C#): Types match by NAME.
//    Two types with the same fields but different names are INCOMPATIBLE.
//
//  Structural typing (TypeScript): Types match by SHAPE.
//    If two types have the same properties, they're COMPATIBLE.
//    Names don't matter.

interface Point2D {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

let point: Point2D = { x: 10, y: 20 };
let coord: Coordinate = point; // WORKS! Same shape = compatible.

// In Java, this would be a compile error because the type NAMES differ.
// In TypeScript, only the SHAPE matters.

// DUCK TYPING MENTAL MODEL:
// "If it has x: number and y: number, it IS a Point2D —
//  regardless of what it's called."

// This also works with extra properties (when assigned through variables):
const point3D = { x: 1, y: 2, z: 3 };
let flatPoint: Point2D = point3D; // OK — has at least x and y


// -----------------------------------------------------------------------------
//  SECTION 6 — OPTIONAL PROPERTIES (?)
// -----------------------------------------------------------------------------

// The ? after a property name means it MAY be missing (or undefined).

interface Config {
  host: string;
  port?: number;      // optional — may or may not be provided
  timeout?: number;
}

const cfg1: Config = { host: "localhost" };               // OK — port omitted
const cfg2: Config = { host: "localhost", port: 3000 };   // OK — port provided

// Accessing optional properties safely:
function connect(cfg: Config) {
  const port = cfg.port ?? 3000;         // default if undefined
  const timeout = cfg.timeout ?? 5000;
  console.log(`Connecting to ${cfg.host}:${port} (timeout: ${timeout}ms)`);
}

// IMPORTANT DISTINCTION:
// age?: number    ->  property may be MISSING entirely
// age: number | undefined  ->  property MUST exist, but value can be undefined

type A = { age?: number };
type B = { age: number | undefined };

const a: A = {};                  // OK — property is missing
// const b: B = {};               // ERROR — property must exist

// COMMON MISTAKE:
// Making everything optional "just to be safe."
// If a property MUST exist logically, don't make it optional.
// Optional properties should represent truly optional data.


// -----------------------------------------------------------------------------
//  SECTION 7 — READONLY PROPERTIES
// -----------------------------------------------------------------------------

// The `readonly` modifier means: "Can be set on creation, but NOT changed after."

interface Point3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

const origin: Point3D = { x: 0, y: 0, z: 0 };
// origin.x = 5; // ERROR: Cannot assign to 'x' because it is read-only

// READONLY ARRAYS:
const numbers: readonly number[] = [1, 2, 3];
// numbers.push(4);  // ERROR — readonly array has no push
// numbers[0] = 99;  // ERROR — index signature is readonly

// Alternative syntax:
const moreNumbers: ReadonlyArray<number> = [4, 5, 6];

// IMPORTANT:
// readonly is a COMPILE-TIME guarantee, not runtime.
// The JS output has no readonly — Object.freeze() is the runtime equivalent.

// PRACTICAL USAGE — function params:
// Mark params as readonly when the function should NOT mutate them.
function printIds(ids: readonly string[]) {
  // ids.push("new"); // ERROR — function can't modify the array
  ids.forEach(id => console.log(id)); // reading is fine
}


// -----------------------------------------------------------------------------
//  SECTION 8 — INDEX SIGNATURES
// -----------------------------------------------------------------------------

// Index signatures let you type objects with DYNAMIC keys.
// You don't know the key names ahead of time, but you know their types.

interface StringMap {
  [key: string]: string; // any string key -> string value
}

const headers: StringMap = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token123",
  // Can add any string key with a string value
};

// INDEX SIGNATURE + KNOWN KEYS:
interface FlexibleConfig {
  timeout: number;                  // known key (must match index type)
  [key: string]: number | string;   // dynamic keys
}

// RECORD UTILITY TYPE — a cleaner way to write index signatures:
type Scores = Record<string, number>;
const leaderboard: Scores = { Ayushman: 95, Alice: 87, Bob: 72 };

// Record<Keys, Values> means: "object where all keys are Keys type
// and all values are Values type."

// More precise Record:
type UserRoles = Record<"admin" | "editor" | "viewer", boolean>;
const roles: UserRoles = {
  admin: true,
  editor: false,
  viewer: true,
};


// -----------------------------------------------------------------------------
//  SECTION 9 — EXCESS PROPERTY CHECKING
// -----------------------------------------------------------------------------

// When you create an object LITERAL directly, TS rejects unknown properties.

interface Button {
  label: string;
  color: string;
}

// const btn: Button = { label: "Click", color: "blue", size: 12 };
// ERROR: Object literal may only specify known properties — 'size' doesn't exist.

// BUT when assigning through a VARIABLE, excess properties are allowed:
const buttonData = { label: "Click", color: "blue", size: 12 };
const btn: Button = buttonData; // OK — structural typing, extra props ignored

// WHY THIS MATTERS:
// Excess checking catches TYPOS in object literals:
// const btn: Button = { label: "Click", colour: "blue" };
// ERROR: 'colour' does not exist — did you mean 'color'?

// Without this check, that typo would silently pass.


// -----------------------------------------------------------------------------
//  SECTION 10 — EXTENDING / COMPOSING TYPES
// -----------------------------------------------------------------------------

// INTERFACES — use `extends` keyword:
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface BlogPost extends BaseEntity {
  title: string;
  content: string;
  author: string;
}

// BlogPost now has: id, createdAt, title, content, author

// Multiple inheritance:
interface Timestamped {
  updatedAt: Date;
}

interface FullPost extends BaseEntity, Timestamped {
  title: string;
  body: string;
}

// TYPES — use intersection (&):
type BaseConfig = { host: string; port: number };
type AuthConfig = BaseConfig & { token: string };
type FullConfig = AuthConfig & { timeout: number };

// FullConfig has: host, port, token, timeout

// CONFLICT IN INTERSECTION: Same property, different types:
type A2 = { id: string };
type B2 = { id: number };
type C2 = A2 & B2;
// C2.id is `string & number` = `never` — impossible to assign!
// This is a design error. TS won't warn, but no value can satisfy it.


// -----------------------------------------------------------------------------
//  SECTION 11 — DECLARATION MERGING (INTERFACES ONLY)
// -----------------------------------------------------------------------------

// If you declare the same interface name twice, TS MERGES them into one.
// This is unique to interfaces — types do NOT support this.

interface Window {
  myCustomProp: string;
}

interface Window {
  anotherProp: number;
}

// Now Window has BOTH myCustomProp and anotherProp.

// WHEN IS THIS USEFUL?
// -> Augmenting third-party types (e.g., adding custom properties to Window)
// -> Library authors extending their own types across files
// -> Module augmentation in Express, Next.js, etc.

// type Window2 = { myProp: string };
// type Window2 = { anotherProp: number }; // ERROR: Duplicate identifier

// This is a KEY difference: interfaces merge, types don't.


// -----------------------------------------------------------------------------
//  SECTION 12 — NESTED OBJECTS
// -----------------------------------------------------------------------------

interface Address {
  street: string;
  city: string;
  pin: string;
}

interface UserProfile {
  name: string;
  address: Address;
  tags: string[];
  social?: {
    twitter?: string;
    github?: string;
  };
}

const myProfile: UserProfile = {
  name: "Ayushman",
  address: { street: "Park Street", city: "Kolkata", pin: "700001" },
  tags: ["developer", "student"],
  social: {
    github: "ayushman",
  },
};

// DESTRUCTURING with types (types flow through automatically):
const { name, address: { city } } = myProfile;
// name: string, city: string — TS infers from the object type

// ACCESSING DEEPLY NESTED OPTIONAL PROPERTIES:
const twitter = myProfile.social?.twitter ?? "No Twitter";
// Optional chaining (?.) + nullish coalescing (??) = safe access


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT                  SYNTAX                      NOTES
//  -----------------------  --------------------------  --------------------------
//  Type alias (object)      type T = { x: number }      Can also do unions, tuples
//  Interface                interface I { x: number }    Object shapes & classes
//  Optional property        prop?: Type                  May be missing/undefined
//  Readonly property        readonly prop: Type          Set once, can't change
//  Index signature          [key: string]: Type          Dynamic keys
//  Record utility           Record<Keys, Values>         Cleaner index signature
//  Extends (interface)      interface B extends A        Inherit shape
//  Intersection (type)      type C = A & B               Combine shapes
//  Declaration merging      interface X twice             Interfaces only
//  Excess property check    Direct literals only          Catches typos


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is the difference between type and interface?
//  A: Interfaces support declaration merging and `extends`.
//     Types can express unions, intersections, tuples, mapped types.
//     For object shapes, they are largely interchangeable.
//     Pick one and be consistent.
//
//  Q2: What is structural typing?
//  A: TS checks compatibility by SHAPE, not by name. If two types
//     have the same properties and types, they are assignable to
//     each other — even if they have different names. Also called
//     "duck typing."
//
//  Q3: What is excess property checking?
//  A: When you assign an object LITERAL directly to a typed variable,
//     TS rejects unknown/extra properties. This catches typos.
//     But when assigning through a variable, extra properties are
//     allowed (structural typing applies).
//
//  Q4: What is declaration merging?
//  A: If you declare the same interface name twice, TS automatically
//     merges them into one interface with all properties combined.
//     Types do NOT support this.
//
//  Q5: What is the difference between ? and | undefined?
//  A: age?: number means the property may be MISSING entirely.
//     age: number | undefined means the property MUST exist but
//     its value can be undefined. Subtle but important distinction.
//
//  Q6: Is readonly enforced at runtime?
//  A: No. readonly is a compile-time check only. The JS output has
//     no concept of readonly. For runtime immutability, use Object.freeze().


console.log("-- 04_objects_and_interfaces.ts executed successfully --");
