// =============================================================================
//  TYPESCRIPT — TOPICS 02 → 22  (Complete Core Reference)
// =============================================================================

export {};
// ─────────────────────────────────────────────────────────────────────────────
//  02 | PROJECT SETUP & INSTALLATION  (00:30:03)
// ─────────────────────────────────────────────────────────────────────────────
//  npm install -g typescript        → global tsc command
//  npm install --save-dev typescript → project-local (RECOMMENDED)
//  npx tsc --version                → verify without global install
//
//  Recommended project structure:
//    my-project/
//    ├── src/          ← your .ts files live here
//    ├── dist/         ← compiled .js output goes here
//    ├── tsconfig.json
//    └── package.json
//
//  ts-node: run TypeScript DIRECTLY without compiling first
//    npm install -D ts-node
//    npx ts-node src/index.ts
//
//  INTERVIEW: "Local install is preferred because each project can pin
//  its own TS version — avoids version mismatch across teams."


// ─────────────────────────────────────────────────────────────────────────────
//  03 | GENERATING tsconfig.json  (00:33:41)
// ─────────────────────────────────────────────────────────────────────────────
//  npx tsc --init   ← generates tsconfig.json with all options commented
//
//  ESSENTIAL OPTIONS:
//  {
//    "compilerOptions": {
//      "target": "ES2020",       // JS version to emit
//      "module": "commonjs",     // module system (commonjs = Node, ESNext = Vite)
//      "rootDir": "./src",       // where TS source files are
//      "outDir": "./dist",       // where compiled JS goes
//      "strict": true,           // ← MOST IMPORTANT: enables all strict checks
//      "sourceMap": true,        // enables debugging TS in browser devtools
//      "noUnusedLocals": true,   // error on unused variables
//      "noImplicitReturns": true // every code path must return a value
//    },
//    "include": ["src/**/*"],
//    "exclude": ["node_modules"]
//  }
//
//  strict: true enables these individually:
//    strictNullChecks, noImplicitAny, strictFunctionTypes,
//    strictBindCallApply, strictPropertyInitialization


// ─────────────────────────────────────────────────────────────────────────────
//  04 | RUNNING TYPESCRIPT (tsc)  (00:37:43)
// ─────────────────────────────────────────────────────────────────────────────
//  tsc                    → compiles using tsconfig.json
//  tsc --watch            → recompiles on every file save (dev mode)
//  tsc --noEmit           → type-check only, don't output JS (used in CI)
//  tsc src/index.ts       → compile a single file (ignores tsconfig!)
//
//  PIPELINE:
//  .ts file → tsc reads tsconfig → type checking → strip types → .js output
//
//  KEY INSIGHT (interview):
//  Types are ERASED at compile time. The JS output has zero type information.
//  "noEmit" is common in CI pipelines just to validate types without
//  producing build artifacts.


// ─────────────────────────────────────────────────────────────────────────────
//  05 | TYPE INFERENCE vs. ANNOTATION  (00:43:05)
// ─────────────────────────────────────────────────────────────────────────────

// INFERENCE — TS deduces the type from the assigned value
let city = "Kolkata";    // inferred: string
let count = 42;          // inferred: number
let active = true;       // inferred: boolean

// ANNOTATION — you explicitly tell TS the type
let username: string = "Ayushman";
let score: number = 95;

// When MUST you annotate?
// 1. Function parameters (TS can't infer these)
// 2. When a variable is declared without initialization
// 3. When inference gives you a wider type than you want

function greet(name: string): string {  // params must be annotated
  return `Hello, ${name}`;
}

let result: string;      // declared without value — must annotate
result = greet("Dev");

// RULE: Annotate function signatures. Let TS infer everything else.
// INTERVIEW: "Prefer inference where possible — it reduces noise.
//  But always annotate public API boundaries (function params/returns)."


// ─────────────────────────────────────────────────────────────────────────────
//  06 | BASIC TYPES: STRING, NUMBER, BOOLEAN  (00:47:26)
// ─────────────────────────────────────────────────────────────────────────────

let firstName: string = "Ayushman";
let age: number = 21;
let isStudent: boolean = true;

// Special numeric values — all valid `number` in TS
let inf: number = Infinity;
let nan: number = NaN;
let hex: number = 0xff;
let binary: number = 0b1010;

// Template literals always produce `string`
let msg: string = `Age: ${age}`;

// null and undefined — with strict: true, these are their OWN types
let nothing: null = null;
let empty: undefined = undefined;

// void — for functions that return nothing
function logMessage(msg: string): void {
  console.log(msg);
  // returning undefined is ok; returning a value is an error
}

// INTERVIEW: "In strict mode, `null` and `undefined` are NOT assignable
//  to `string` or `number`. You must handle them explicitly."


// ─────────────────────────────────────────────────────────────────────────────
//  07 | UNION TYPES  (00:49:33)
// ─────────────────────────────────────────────────────────────────────────────
//  A union type means: "this value can be ONE OF these types"
//  Syntax: TypeA | TypeB

let id: string | number;
id = "abc-123";   // ✅
id = 42;          // ✅
// id = true;     // ❌ boolean not in union

// Union with null (very common pattern)
let nickname: string | null = null;
nickname = "Ayu";

// Union in function params
function formatId(id: string | number): string {
  // Can only use methods that BOTH types share (unless you narrow first)
  return id.toString();  // .toString() exists on both string & number ✅
}

// LITERAL UNION — restrict to specific values (like an enum)
type Direction = "north" | "south" | "east" | "west";
let move: Direction = "north";
// move = "up"; // ❌ not in the literal union

type StatusCode = 200 | 400 | 404 | 500;
let code: StatusCode = 200;

// INTERVIEW: "Union types are the foundation of most advanced TS patterns —
//  discriminated unions, narrowing, exhaustive checks all build on them."


// ─────────────────────────────────────────────────────────────────────────────
//  08 | THE PROBLEM WITH `any`  (00:56:03)
// ─────────────────────────────────────────────────────────────────────────────

// `any` disables ALL type checking for that variable
let data: any = "hello";
data = 42;           // fine
data.foo.bar.baz();  // TS: fine. Runtime: CRASH 💥

// THE CONTAGION PROBLEM:
// any spreads through your codebase
function process(input: any) {
  return input.value; // return type is ALSO `any`
}
const result2 = process({ value: 10 });
// result2 is `any` — you've lost type info downstream

// WHEN `any` APPEARS IMPLICITLY:
// With strict: false, untyped params become `any` silently
// With strict: true, this is a compile error (noImplicitAny)
// function bad(x) { return x; } // ❌ implicit any with strict: true

// ALTERNATIVES TO `any`:
//   unknown  → type-safe (must narrow before use)
//   never    → value that should never exist
//   Generics → preserve type through a function

// INTERVIEW: "Using `any` is TypeScript giving up. It's acceptable only
//  at boundaries with truly dynamic data (legacy APIs, JSON.parse results).
//  Even then, prefer `unknown` and narrow the type explicitly."


// ─────────────────────────────────────────────────────────────────────────────
//  09 | TYPE NARROWING & GUARDS  (00:59:55)
// ─────────────────────────────────────────────────────────────────────────────
//  Narrowing = TS analysing control flow to REFINE a union type
//  into a more specific type inside a block.

function processInput(input: string | number) {
  // Here: input is string | number

  if (typeof input === "string") {
    // Here: input is NARROWED to string
    console.log(input.toUpperCase());
  } else {
    // Here: input is NARROWED to number
    console.log(input.toFixed(2));
  }
}

// NARROWING TECHNIQUES:

// 1. typeof guard
function show(val: string | number | boolean) {
  if (typeof val === "string") { /* string */ }
  if (typeof val === "number") { /* number */ }
}

// 2. instanceof guard (for class instances)
function handleError(err: Error | string) {
  if (err instanceof Error) {
    console.log(err.message); // only available on Error instances
  }
}

// 3. truthiness narrowing
function greetUser(name: string | null) {
  if (name) {  // null is falsy → narrowed to string inside
    console.log(name.toUpperCase());
  }
}

// 4. in operator (checks if property exists on object)
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow(); // narrowed to Cat
  } else {
    animal.bark(); // narrowed to Dog
  }
}

// INTERVIEW: "TS narrowing is based on control flow analysis — it tracks
//  what types are possible at each point in the code."


// ─────────────────────────────────────────────────────────────────────────────
//  10 | THE `unknown` TYPE  (01:01:00)
// ─────────────────────────────────────────────────────────────────────────────
//  `unknown` is the TYPE-SAFE alternative to `any`.
//  You can ASSIGN anything to unknown, but you CANNOT USE IT
//  without first narrowing it.

let userInput: unknown = "hello world";
userInput = 42;       // ✅ assigning is fine
userInput = { a: 1 }; // ✅ still fine

// Using without narrowing → ERROR:
// userInput.toUpperCase(); // ❌ Object is of type 'unknown'
// let x: string = userInput; // ❌ not assignable without narrowing

// Must narrow first:
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // ✅ narrowed to string
}

// GREAT PATTERN: API responses
function parseJSON(json: string): unknown {
  return JSON.parse(json); // returns unknown, forcing caller to narrow
}

// COMPARISON TABLE:
//  any     → assign ✅  use without check ✅  (UNSAFE)
//  unknown → assign ✅  use without check ❌  (SAFE — must narrow)

// INTERVIEW: "unknown is what any SHOULD be. Use it whenever you have
//  genuinely dynamic data — JSON, user input, API responses."


// ─────────────────────────────────────────────────────────────────────────────
//  11 | EXHAUSTIVE CHECKS  (01:06:35)
// ─────────────────────────────────────────────────────────────────────────────
//  Exhaustive checking ensures you handle EVERY case of a union.
//  If someone adds a new type to the union later, TS will force you
//  to handle it. Uses the `never` type as the mechanism.

type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":   return Math.PI * 5 * 5;
    case "square":   return 5 * 5;
    case "triangle": return 0.5 * 5 * 5;
    default:
      // If all cases are handled, `shape` is `never` here
      // If a new shape is added to the union without a case,
      // this line becomes a compile error ✅
      const _exhaustiveCheck: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustiveCheck}`);
  }
}

// INTERVIEW: "Exhaustive checks are a compile-time safety net.
//  They guarantee that adding a new union member forces you to
//  update ALL switch statements that handle that union."


// ─────────────────────────────────────────────────────────────────────────────
//  12 | CUSTOM TYPE PREDICATES (is)  (01:10:35)
// ─────────────────────────────────────────────────────────────────────────────
//  A type predicate is a function whose return type is `param is Type`.
//  It acts as a CUSTOM type guard — TS trusts your check and narrows
//  the type in the calling scope.

interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

// Custom type predicate function:
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move2(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // TS knows it's Fish here ✅
  } else {
    animal.fly();  // TS knows it's Bird here ✅
  }
}

// MORE PRACTICAL EXAMPLE — validating API response:
interface User { id: number; name: string; }

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj
  );
}

const response: unknown = { id: 1, name: "Ayushman" };
if (isUser(response)) {
  console.log(response.name); // ✅ safely typed as User
}

// INTERVIEW: "Type predicates let you create reusable, composable type
//  guards — essential for runtime validation of external data."


// ─────────────────────────────────────────────────────────────────────────────
//  13 | DISCRIMINATED UNIONS  (01:17:45)
// ─────────────────────────────────────────────────────────────────────────────
//  A discriminated union is a union of object types where each member
//  has a COMMON LITERAL PROPERTY (the discriminant) that uniquely
//  identifies it. TS uses this property to narrow the union.

type Circle    = { kind: "circle";    radius: number };
type Square    = { kind: "square";    side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Geometry = Circle | Square | Rectangle;  // discriminant: `kind`

function area(shape: Geometry): number {
  switch (shape.kind) {           // TS narrows based on `kind`
    case "circle":    return Math.PI * shape.radius ** 2;  // shape is Circle
    case "square":    return shape.side ** 2;               // shape is Square
    case "rectangle": return shape.width * shape.height;    // shape is Rectangle
  }
}

// REAL WORLD — API action/response pattern (Redux-like):
type Action =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + action.amount; // amount is available ✅
    case "DECREMENT": return state - action.amount;
    case "RESET":     return 0;
    // no default needed — union is exhausted
  }
}

// INTERVIEW: "Discriminated unions + exhaustive checks = the most powerful
//  pattern in TypeScript for modelling state machines and API responses."


// ─────────────────────────────────────────────────────────────────────────────
//  14 | TYPE ASSERTION (as keyword)  (01:23:10)
// ─────────────────────────────────────────────────────────────────────────────
//  Type assertion tells TS: "I know the type better than you do."
//  It does NOT perform runtime conversion — purely a compile-time hint.

// SYNTAX 1: `as` keyword (works everywhere, including .tsx)
const input = document.getElementById("name") as HTMLInputElement;
console.log(input.value); // ✅ TS now knows it's an input, not generic Element

// SYNTAX 2: angle-bracket (NOT valid in .tsx files)
// const input2 = <HTMLInputElement>document.getElementById("name");

// WHEN TO USE:
// → DOM queries (getElementById returns Element | null, you know it's specific)
// → Data from JSON.parse where you know the shape
// → Migrating JS to TS incrementally

// DOUBLE ASSERTION (force incompatible types):
// Only when you absolutely must — usually a design smell
const weird = ("hello" as unknown) as number; // force string → number

// NON-NULL ASSERTION OPERATOR `!`
// Tells TS: "this value is NOT null or undefined"
const el = document.getElementById("app")!; // `!` strips null from type
el.innerHTML = "Hello"; // ✅ no null check needed

// ⚠️ CAUTION: Assertions have NO runtime effect.
//    If wrong, you get a runtime crash — not a compile error.

// INTERVIEW: "Assertions are escape hatches — use them at boundaries
//  where TS can't infer the type (DOM, JSON, third-party libs).
//  Prefer type guards for runtime safety."


// ─────────────────────────────────────────────────────────────────────────────
//  15 | unknown vs any DEEP DIVE  (01:29:21)
// ─────────────────────────────────────────────────────────────────────────────

//                    any          unknown
//  ─────────────────────────────────────────
//  Assign anything   ✅           ✅
//  Use freely        ✅ (unsafe)  ❌ (must narrow)
//  Assignable to X   ✅           ❌ (only to unknown/any)
//  Type contagion    ✅ spreads   ❌ contained
//  Recommended       ❌ rarely    ✅ always for dynamic data

// `any` assignment goes both ways — it poisons surrounding types:
let a: any = 5;
let str: string = a;   // TS: fine. But this is wrong and TS won't stop you.

// `unknown` is ONE-WAY — you can put anything IN, but can't take it OUT
let u: unknown = 5;
// let str2: string = u; // ❌ not assignable — TS protects you

// REAL DIFFERENCE in practice:
function riskyAny(val: any) {
  return val.name.toUpperCase(); // no error from TS — crash at runtime if wrong
}

function safeUnknown(val: unknown) {
  // return val.name; // ❌ TS error — forces you to handle it
  if (typeof val === "object" && val !== null && "name" in val) {
    return (val as { name: string }).name.toUpperCase(); // ✅
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  16 | HANDLING ERRORS IN TRY/CATCH  (01:32:25)
// ─────────────────────────────────────────────────────────────────────────────
//  In TypeScript (with useUnknownInCatchVariables: true, part of strict),
//  catch clause variables are typed as `unknown`, not `any`.
//  This is CORRECT — anything can be thrown in JS (strings, objects, etc.)

// BEFORE (pre-TS 4.0 / without strict):
// try { } catch (err) { console.log(err.message); } // err was `any`

// NOW (TS 4.4+ / strict mode):
function riskyOperation() {
  try {
    JSON.parse("{ bad json }");
  } catch (err: unknown) {  // explicitly unknown
    // err.message ❌ — can't access without narrowing

    if (err instanceof Error) {
      console.log(err.message);  // ✅ narrowed to Error
      console.log(err.stack);    // ✅
    } else if (typeof err === "string") {
      console.log(err);          // ✅ narrowed to string
    } else {
      console.log("Unknown error", err);
    }
  }
}

// HELPER PATTERN — reusable error message extractor:
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
}

// INTERVIEW: "In strict TS, catch errors are `unknown`. This forces you
//  to handle both Error objects and other thrown values — better runtime safety."


// ─────────────────────────────────────────────────────────────────────────────
//  17 | THE `never` TYPE  (01:35:14)
// ─────────────────────────────────────────────────────────────────────────────
//  `never` represents a value that NEVER occurs.
//  It is the BOTTOM TYPE — assignable to everything, nothing is assignable to it.

//  USE CASE 1: Functions that never return (throw or infinite loop)
function throwError(msg: string): never {
  throw new Error(msg);
  // return; ← unreachable — TS enforces this
}

function infiniteLoop(): never {
  while (true) {}
}

//  USE CASE 2: Exhaustive checks (see topic 11)
//  After all union members are handled, the remaining type is `never`

//  USE CASE 3: Conditional type filtering
//  (advanced) Remove types from a union:
type NonNullable2<T> = T extends null | undefined ? never : T;
type A = NonNullable2<string | null | undefined>; // → string

//  USE CASE 4: Impossible states
type NoStringNumber = string & number; // impossible → never

// MENTAL MODEL:
//   unknown  = "could be anything" (top type)
//   never    = "can't be anything" (bottom type)
//   any      = "I don't care"      (escape hatch, breaks the system)

// INTERVIEW: "never is TS's way of saying 'this code path is unreachable'
//  or 'this value is impossible'. Exhaustive checks use never to guarantee
//  compile-time completeness."


// ─────────────────────────────────────────────────────────────────────────────
//  18 | TYPE ALIASES (type)  (01:40:37)
// ─────────────────────────────────────────────────────────────────────────────
//  A type alias gives a NAME to any type — primitive, union, tuple, function, object.
//  Keyword: `type`

type UserID = string | number;
type Point = { x: number; y: number };
type Callback = (event: MouseEvent) => void;
type Pair<T> = [T, T];          // generic type alias
type Maybe<T> = T | null | undefined;

// USING TYPE ALIASES:
let uid: UserID = "abc-123";
let origin: Point = { x: 0, y: 0 };
let coord: Pair<number> = [10, 20];
let maybeUsername: Maybe<string> = null;

// TYPE ALIAS FOR COMPLEX UNIONS:
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error";   message: string }
  | { status: "loading" };

function handleResponse(res: ApiResponse<User>) {
  if (res.status === "success") console.log(res.data.name);
  if (res.status === "error")   console.log(res.message);
}

// INTERVIEW: "Type aliases are purely compile-time constructs — they
//  don't exist in the JS output. They can represent ANY type, including
//  unions, intersections, tuples, and mapped types."


// ─────────────────────────────────────────────────────────────────────────────
//  19 | INTERFACES vs. TYPES  (01:44:33)
// ─────────────────────────────────────────────────────────────────────────────

// INTERFACES — describe the shape of OBJECTS and CLASSES
interface IUser {
  id: number;
  name: string;
  greet(): string;
}

// TYPE ALIASES — describe ANY type (unions, primitives, tuples, etc.)
type TUser = {
  id: number;
  name: string;
  greet(): string;
};

// BOTH work for object shapes — key differences:

// 1. DECLARATION MERGING — interfaces support it, types don't
interface Window { myProp: string; }
interface Window { anotherProp: number; } // ✅ merges into one
// type Window = { myProp: string };       // ❌ duplicate identifier

// 2. EXTENDING:
interface Admin extends IUser { role: string; }  // interface extends interface
type AdminType = TUser & { role: string };        // type uses intersection

// 3. UNION/INTERSECTION — only `type` can express unions
type StringOrNumber = string | number; // ✅ only with type
// interface StringOrNumber = string | number; // ❌ invalid

// 4. COMPUTED/MAPPED TYPES — only `type`
type Keys = keyof IUser;   // "id" | "name" | "greet"
type Readonly2<T> = { readonly [K in keyof T]: T[K] };

// WHICH TO USE?
// → Interfaces for public API shapes (libraries, classes)
// → Types for everything else (unions, utilities, complex types)
// → Pick one and be consistent within a project

// INTERVIEW: "The main practical differences are: interfaces support
//  declaration merging (useful for augmenting third-party types) while
//  type aliases can express unions. For object shapes they're interchangeable."


// ─────────────────────────────────────────────────────────────────────────────
//  20 | INTERSECTION TYPES  (01:51:23)
// ─────────────────────────────────────────────────────────────────────────────
//  Intersection combines MULTIPLE types into ONE.
//  The result must satisfy ALL constituent types simultaneously.
//  Syntax: TypeA & TypeB

type HasName = { name: string };
type HasAge  = { age: number };
type Person  = HasName & HasAge;   // must have BOTH name AND age

const person: Person = { name: "Ayushman", age: 21 }; // ✅

// EXTENDING OBJECTS (alternative to interface extends):
type BaseConfig   = { host: string; port: number };
type AuthConfig   = BaseConfig & { token: string };
type FullConfig   = AuthConfig & { timeout: number };

// INTERSECTION WITH FUNCTIONS (mixins):
type Serializable = { serialize: () => string };
type Loggable     = { log: () => void };
type DataModel    = Person & Serializable & Loggable;

// CONFLICT IN INTERSECTION — same property, different types:
type A2 = { id: string };
type B2 = { id: number };
type C  = A2 & B2;
// C.id is `string & number` = `never` — impossible value!
// This is a design error — TS won't warn, but id can never be assigned.

// UNION vs INTERSECTION MENTAL MODEL:
//   Union  (|) = OR  → value satisfies AT LEAST ONE type
//   Intersection (&) = AND → value satisfies ALL types

// INTERVIEW: "Intersections are additive — they combine all properties.
//  They're commonly used for mixins, extending configs, and composing types."


// ─────────────────────────────────────────────────────────────────────────────
//  21 | OPTIONAL & READONLY PROPERTIES  (01:54:43)
// ─────────────────────────────────────────────────────────────────────────────

// OPTIONAL PROPERTIES — suffix `?` — property may be absent (undefined)
interface Config {
  host: string;
  port?: number;        // optional: number | undefined
  timeout?: number;
}

const cfg1: Config = { host: "localhost" };            // ✅ port omitted
const cfg2: Config = { host: "localhost", port: 3000 }; // ✅ port provided

// Accessing optional properties safely:
function connect(cfg: Config) {
  const port = cfg.port ?? 3000;     // nullish coalescing: default if undefined
  const timeout = cfg.timeout ?? 5000;
  console.log(`${cfg.host}:${port} (timeout: ${timeout}ms)`);
}

// READONLY PROPERTIES — can be set at creation but not mutated after
interface Point3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

const origin3D: Point3D = { x: 0, y: 0, z: 0 };
// origin3D.x = 5; // ❌ Cannot assign to 'x' because it is read-only

// READONLY ARRAYS:
const nums: readonly number[] = [1, 2, 3];
// nums.push(4); // ❌ readonly array has no push
// nums[0] = 9;  // ❌ index signature is readonly

// UTILITY TYPES for bulk optional/readonly:
type PartialConfig  = Partial<Config>;    // ALL properties optional
type RequiredConfig = Required<Config>;   // ALL properties required
type ReadonlyPoint  = Readonly<Point3D>;  // ALL properties readonly

// INTERVIEW: "Readonly provides immutability guarantees at compile time —
//  not runtime. Object.freeze() is the runtime equivalent.
//  Partial<T> is heavily used for update/patch request bodies."


// ─────────────────────────────────────────────────────────────────────────────
//  22 | OBJECTS IN TYPESCRIPT  (01:58:06)
// ─────────────────────────────────────────────────────────────────────────────

// INLINE OBJECT TYPE ANNOTATION:
let profile: { name: string; age: number; email?: string } = {
  name: "Ayushman",
  age: 21,
};

// EXCESS PROPERTY CHECKING — TS rejects extra properties in object literals
interface Point2 { x: number; y: number; }
// const p: Point2 = { x: 1, y: 2, z: 3 }; // ❌ 'z' not in Point2

// But NOT when assigned through a variable (structural typing):
const extra = { x: 1, y: 2, z: 3 };
const p2: Point2 = extra;  // ✅ — structural check, extra props allowed

// INDEX SIGNATURES — for objects with dynamic keys
interface StringMap {
  [key: string]: string;  // any string key → string value
}
const headers: StringMap = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token123",
};

// INDEX SIGNATURE + KNOWN KEYS:
interface FlexibleConfig {
  timeout: number;               // known key (must be compatible with index type)
  [key: string]: number | string; // dynamic keys
}

// RECORD UTILITY TYPE — cleaner index signature
type Scores = Record<string, number>;
const leaderboard: Scores = { Ayushman: 95, Alice: 87 };

// NESTED OBJECTS:
interface Address { city: string; pin: string; }
interface UserProfile {
  name: string;
  address: Address;
  tags: string[];
}

const user2: UserProfile = {
  name: "Ayushman",
  address: { city: "Kolkata", pin: "700001" },
  tags: ["developer", "student"],
};

// DESTRUCTURING WITH TYPES:
const { name, address: { city } } = user2;
// name: string, city: string — types flow through destructuring

// INTERVIEW: "Excess property checking only applies to DIRECT object literals.
//  When you assign through a variable, TS uses structural typing.
//  Use Record<K, V> instead of index signatures for cleaner, readable code."


// =============================================================================
//  QUICK REFERENCE CARD
// =============================================================================
//
//  any      → unsafe wildcard, avoid in production
//  unknown  → safe wildcard, must narrow before use
//  never    → impossible / unreachable type (bottom type)
//  void     → function returns nothing
//  |        → union: one of these types
//  &        → intersection: all of these types combined
//  ?        → optional property (T | undefined)
//  readonly → immutable after initialization (compile-time only)
//  as       → type assertion (no runtime effect)
//  is       → type predicate in custom guard function
//  satisfies→ validate against type WITHOUT widening (TS 4.9+)
//
//  UTILITY TYPES:
//  Partial<T>   → all props optional
//  Required<T>  → all props required
//  Readonly<T>  → all props readonly
//  Record<K,V>  → object with keys K and values V
//  Pick<T,K>    → keep only keys K from T
//  Omit<T,K>    → remove keys K from T
//
//  Next series → Functions, Generics, Classes, Utility Types (deep dive)