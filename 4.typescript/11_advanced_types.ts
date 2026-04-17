export {};
// =============================================================================
//  11 | ADVANCED TYPES
// =============================================================================
//
//  Prerequisites : 10_type_assertions.ts
//  Next File     : 12_modules_and_namespaces.ts
//
//  This file covers:
//    1. Mapped types
//    2. Conditional types
//    3. Template literal types
//    4. The `infer` keyword
//    5. Branded / opaque types
//    6. Recursive types
//    7. Variadic tuple types
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — MAPPED TYPES
// -----------------------------------------------------------------------------

// Mapped types create NEW types by transforming each property of an existing type.
// Syntax: { [K in keyof T]: NewType }

// EXAMPLE 1: Make every property a boolean
interface User {
  id: number;
  name: string;
  email: string;
}

type BooleanFlags<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = BooleanFlags<User>;
// Result: { id: boolean; name: boolean; email: boolean; }

const flags: UserFlags = {
  id: true,
  name: false,
  email: true,
};

// EXAMPLE 2: Make every property optional (this is how Partial<T> works!)
type MyPartial<T> = {
  [K in keyof T]?: T[K]; // T[K] = original value type
};

// EXAMPLE 3: Make every property readonly (this is how Readonly<T> works!)
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// EXAMPLE 4: Wrap every property in a getter function
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// Result: { getId: () => number; getName: () => string; getEmail: () => string; }

// KEY MODIFIERS in mapped types:
// readonly / -readonly  -> add or remove readonly
// ? / -?                -> add or remove optional

// Remove optional (make everything required):
type Concrete<T> = {
  [K in keyof T]-?: T[K]; // -? removes the optional marker
};

// Remove readonly (make everything mutable):
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // -readonly removes readonly
};


// -----------------------------------------------------------------------------
//  SECTION 2 — CONDITIONAL TYPES
// -----------------------------------------------------------------------------

// Conditional types choose between types based on a condition.
// Syntax: T extends U ? TrueType : FalseType

// SIMPLE EXAMPLE:
type IsString<T> = T extends string ? "yes" : "no";

type Test1 = IsString<string>;  // "yes"
type Test2 = IsString<number>;  // "no"
type Test3 = IsString<"hello">; // "yes" (string literal extends string)

// WITH UNIONS — conditional types DISTRIBUTE over unions:
type IsStringDistributed = IsString<string | number>;
// Distributes: IsString<string> | IsString<number> = "yes" | "no"

// PRACTICAL EXAMPLE — type-safe event handler:
type EventData<T extends string> =
  T extends "click" ? { x: number; y: number } :
  T extends "keypress" ? { key: string; code: number } :
  T extends "scroll" ? { scrollY: number } :
  never;

function handleEvent<T extends "click" | "keypress" | "scroll">(
  type: T,
  data: EventData<T>
): void {
  console.log(`Event: ${type}`, data);
}

handleEvent("click", { x: 10, y: 20 });      // OK
handleEvent("keypress", { key: "a", code: 65 }); // OK
// handleEvent("click", { key: "a", code: 65 }); // ERROR — wrong data shape!

// NESTED CONDITIONAL:
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T0 = TypeName<string>;    // "string"
type T1 = TypeName<42>;        // "number"
type T2 = TypeName<() => void>; // "function"


// -----------------------------------------------------------------------------
//  SECTION 3 — TEMPLATE LITERAL TYPES
// -----------------------------------------------------------------------------

// Template literal types let you build string types using template syntax.
// They work like JavaScript template literals but at the TYPE level.

type Color = "red" | "green" | "blue";
type Size = "sm" | "md" | "lg";

// Combine strings into all possible combinations:
type CSSClass = `${Size}-${Color}`;
// Result: "sm-red" | "sm-green" | "sm-blue" | "md-red" | "md-green" | ...

let className: CSSClass = "lg-blue"; // OK
// className = "xl-red"; // ERROR — not a valid combination

// BUILT-IN STRING MANIPULATION TYPES:
type Upper = Uppercase<"hello">;     // "HELLO"
type Lower = Lowercase<"HELLO">;     // "hello"
type Cap = Capitalize<"hello">;      // "Hello"
type Uncap = Uncapitalize<"HELLO">;  // "hELLO"

// PRACTICAL EXAMPLE — typed event names:
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickHandler = EventName<"click">;     // "onClick"
type HoverHandler = EventName<"hover">;     // "onHover"
type SubmitHandler = EventName<"submit">;   // "onSubmit"

// PATTERN — getter/setter names from object keys:
type PropGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PropSetters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (val: T[K]) => void;
};


// -----------------------------------------------------------------------------
//  SECTION 4 — THE `infer` KEYWORD
// -----------------------------------------------------------------------------

// `infer` declares a type variable INSIDE a conditional type.
// It "captures" a part of the type being inspected.

// EXAMPLE 1: Extract the return type of a function (how ReturnType works):
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
//                                                    ^^^^^^^ infer R
// "If T is a function, capture its return type as R and use it."

type RT1 = MyReturnType<() => string>;       // string
type RT2 = MyReturnType<(x: number) => boolean>; // boolean
type RT3 = MyReturnType<string>;             // never (not a function)

// EXAMPLE 2: Extract the element type of an array:
type ElementType<T> = T extends (infer E)[] ? E : T;

type E1 = ElementType<string[]>;   // string
type E2 = ElementType<number[]>;   // number
type E3 = ElementType<boolean>;    // boolean (not an array, returns T)

// EXAMPLE 3: Extract Promise's resolved type (how Awaited works):
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;
// Recursively unwraps nested Promises:
type P1 = MyAwaited<Promise<string>>;           // string
type P2 = MyAwaited<Promise<Promise<number>>>;  // number

// EXAMPLE 4: Extract first function argument:
type FirstArg<T> = T extends (first: infer A, ...args: any[]) => any ? A : never;

type FA1 = FirstArg<(name: string, age: number) => void>; // string
type FA2 = FirstArg<() => void>;                          // never


// -----------------------------------------------------------------------------
//  SECTION 5 — BRANDED / OPAQUE TYPES
// -----------------------------------------------------------------------------

// Problem: TypeScript uses STRUCTURAL typing, so these are interchangeable:
type UserIdPlain = number;
type PostIdPlain = number;
// let userId: UserIdPlain = 1;
// let postId: PostIdPlain = userId; // No error — both are just `number`

// BRANDED TYPES add a compile-time "brand" to make structurally
// identical types INCOMPATIBLE:

type UserId = number & { readonly __brand: "UserId" };
type PostId = number & { readonly __brand: "PostId" };

// Create branded values using helper functions:
function createUserId(id: number): UserId {
  return id as UserId;
}

function createPostId(id: number): PostId {
  return id as PostId;
}

const userId = createUserId(1);
const postId = createPostId(1);

// userId and postId are both `number` at runtime,
// but TypeScript treats them as DIFFERENT types:
// const wrong: UserId = postId; // ERROR — PostId not assignable to UserId

function fetchUser(id: UserId): void {
  console.log("Fetching user:", id);
}

fetchUser(userId);  // OK
// fetchUser(postId); // ERROR — can't pass PostId as UserId
// fetchUser(42);     // ERROR — can't pass raw number

// Generic branded type helper:
type Brand<T, B extends string> = T & { readonly __brand: B };
type OrderId = Brand<string, "OrderId">;
type ProductId = Brand<string, "ProductId">;


// -----------------------------------------------------------------------------
//  SECTION 6 — RECURSIVE TYPES
// -----------------------------------------------------------------------------

// Types can reference themselves — useful for tree-like structures.

// JSON type (JSON can be a string, number, boolean, null, array, or object):
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const validJson: JSONValue = {
  name: "Ayushman",
  age: 21,
  hobbies: ["coding", "reading"],
  address: {
    city: "Kolkata",
    pin: "700001",
  },
};

// TREE NODE:
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

const tree: TreeNode<string> = {
  value: "root",
  children: [
    { value: "child1", children: [] },
    {
      value: "child2",
      children: [
        { value: "grandchild", children: [] },
      ],
    },
  ],
};

// DEEP READONLY (recursive readonly):
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type DeepUser = DeepReadonly<{
  name: string;
  address: { city: string; pin: string };
}>;
// Both top-level AND nested properties are readonly.


// -----------------------------------------------------------------------------
//  SECTION 7 — VARIADIC TUPLE TYPES
// -----------------------------------------------------------------------------

// Variadic tuples use spread (...) in tuple types to work with
// variable-length type sequences.

// CONCATENATING TWO TUPLES:
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];

type AB = Concat<[string, number], [boolean]>;
// Result: [string, number, boolean]

// PREPEND AN ELEMENT:
type Prepend<T, Arr extends unknown[]> = [T, ...Arr];

type WithId = Prepend<number, [string, boolean]>;
// Result: [number, string, boolean]

// PRACTICAL — typed zip function:
function zip<A extends unknown[], B extends unknown[]>(
  a: [...A],
  b: [...B]
): [A, B] {
  return [a, b];
}

const zipped = zip([1, "hello"], [true, 42]);
// Type: [[number, string], [boolean, number]]


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT                SYNTAX                               USE CASE
//  ---------------------  -----------------------------------  -----------------------
//  Mapped type            { [K in keyof T]: NewType }          Transform all props
//  Conditional type       T extends U ? A : B                  Type branching
//  Template literal       `prefix-${Type}`                     String type combos
//  infer                  T extends F<infer R> ? R : never     Extract inner types
//  Branded type           T & { __brand: "X" }                 Prevent ID mixups
//  Recursive type         type T = ... | T[]                   Trees, JSON
//  Variadic tuple         [...A, ...B]                         Tuple operations


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is a mapped type?
//  A: A type that creates a new type by iterating over the keys of an
//     existing type and transforming each property. It's how Partial,
//     Readonly, and Required are implemented internally.
//
//  Q2: How do conditional types work?
//  A: They follow the pattern T extends U ? A : B. If T is assignable
//     to U, the result is A; otherwise B. They distribute over unions
//     (each member is checked separately).
//
//  Q3: What is `infer` used for?
//  A: `infer` declares a type variable inside a conditional type that
//     captures part of the inspected type. Used to extract return types,
//     array element types, Promise resolved types, etc.
//
//  Q4: What are branded types?
//  A: Types that add a phantom property to make structurally identical
//     types incompatible. Example: UserId and PostId are both numbers
//     but can't be mixed up. Useful for preventing logic errors.
//
//  Q5: What are template literal types?
//  A: Types that use template string syntax to create string type
//     combinations. `${Size}-${Color}` produces all combinations like
//     "sm-red", "md-blue", etc.
//
//  Q6: Can types be recursive?
//  A: Yes. Types can reference themselves, useful for tree structures,
//     JSON values, deeply nested data. Example: type JSONValue includes
//     JSONValue[] in its definition.


console.log("-- 11_advanced_types.ts executed successfully --");
