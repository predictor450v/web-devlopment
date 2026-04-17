export {};
// =============================================================================
//  17 | TYPESCRIPT INTERVIEW PREPARATION
// =============================================================================
//
//  Prerequisites : All previous files (01-16)
//
//  This file is your ONE-STOP interview revision sheet.
//  It covers:
//    1. Why TypeScript? (The pitch)
//    2. Top 30 interview questions with detailed answers
//    3. Quick concept refreshers
//    4. Common coding challenges
//    5. Tricky edge cases & gotchas
//    6. What to say (and NOT say) in interviews
//
// =============================================================================


// =============================================================================
//                     PART 1 — WHY TYPESCRIPT? (THE PITCH)
// =============================================================================

// If an interviewer asks "Why TypeScript?", hit these 5 points:
//
//  1. CATCH BUGS EARLY
//     TypeScript catches type errors at compile time — before code runs.
//     In JavaScript, bugs like add(5, "10") -> "510" only appear at runtime.
//     In TypeScript, this is a compile error. Caught instantly.
//
//  2. BETTER DEVELOPER EXPERIENCE
//     Rich autocomplete, go-to-definition, find-all-references, and
//     inline documentation in editors like VS Code. Types act as
//     live documentation that never goes stale.
//
//  3. SAFE REFACTORING
//     Rename a property in an interface -> TS flags every file that
//     uses it. In JavaScript, you'd have to search-and-pray.
//     In large codebases, this is invaluable.
//
//  4. SELF-DOCUMENTING CODE
//     function fetchUser(id: number): Promise<User>
//     Just by reading the signature, you know:
//       - id must be a number
//       - It returns a Promise
//       - The Promise resolves to a User object
//     No need to read the implementation or documentation.
//
//  5. SCALES WITH TEAM SIZE
//     TypeScript prevents entire categories of bugs that arise when
//     multiple developers work on the same codebase: wrong argument
//     types, missing properties, null dereferences, etc.
//     It's the reason companies like Airbnb, Google, Microsoft, and
//     Slack have adopted it.


// =============================================================================
//           PART 2 — TOP 30 INTERVIEW QUESTIONS WITH ANSWERS
// =============================================================================

// ---- FUNDAMENTALS (Questions 1-10) ----

// Q1: What is TypeScript?
// A: TypeScript is a statically typed superset of JavaScript developed by
//    Microsoft. It adds optional type annotations, interfaces, generics,
//    enums, and other features on top of JavaScript. All TypeScript code
//    compiles (transpiles) to plain JavaScript — browsers and Node.js
//    never see TypeScript directly.

// Q2: What happens to types at runtime?
// A: Types are completely ERASED during compilation. The JavaScript output
//    has zero type information. Types exist purely as a development-time aid
//    with zero runtime cost and zero impact on behavior.

// Q3: What is the difference between `any` and `unknown`?
// A: `any` disables ALL type checking — you can use it however you want.
//    `unknown` requires you to NARROW (check) the type before using it.
//    `any` is unsafe (can cause runtime crashes); `unknown` is safe.
//    Rule: Always prefer `unknown` over `any` for dynamic data.

// Q4: What is type inference?
// A: TypeScript's ability to automatically deduce the type of a variable
//    from its assigned value. `let x = 5` is inferred as `number` without
//    writing `: number`. Inference keeps code concise while maintaining
//    full type safety.

// Q5: What is the difference between `type` and `interface`?
// A: Both can describe object shapes. Key differences:
//    - interface supports declaration merging; type does not
//    - type can express unions (A | B), tuples, mapped types
//    - interface uses `extends`; type uses `&` (intersection)
//    Guideline: Use interface for object shapes, type for everything else.

// Q6: What is structural typing?
// A: TypeScript checks type compatibility by SHAPE, not by name.
//    If two types have the same properties and types, they are compatible.
//    Also called "duck typing": if it looks like a duck and quacks like
//    a duck, it IS a duck.

// Q7: What is type narrowing?
// A: The process of refining a broad type (like string | number) into a
//    specific type (like string) using control flow analysis. Techniques:
//    typeof, instanceof, in operator, truthiness checks, equality checks,
//    discriminated unions, and custom type predicates.

// Q8: What is the `never` type?
// A: Represents a value that NEVER occurs. Used for:
//    - Functions that never return (throw or infinite loop)
//    - Exhaustive checks in switch statements
//    - Impossible type intersections (string & number = never)
//    It's the BOTTOM TYPE — nothing is assignable to it.

// Q9: What is the difference between void and undefined?
// A: void means "no meaningful return value" — more flexible.
//    undefined means "the value IS specifically undefined" — stricter.
//    Key difference: void callback types allow returning any value
//    (it's ignored). undefined callback types require exactly undefined.

// Q10: What does strict: true do in tsconfig?
// A:  Enables ALL strict type-checking flags at once:
//     strictNullChecks, noImplicitAny, strictFunctionTypes,
//     strictBindCallApply, strictPropertyInitialization, etc.
//     Without it, TS is barely better than JavaScript.


// ---- INTERMEDIATE (Questions 11-20) ----

// Q11: What is a discriminated union?
// A: A union of object types where each member has a COMMON LITERAL
//    property (discriminant) that uniquely identifies it.
//    Example: { type: "circle"; radius: number } | { type: "square"; side: number }
//    TS uses the discriminant to automatically narrow in switch/if statements.
//    This is the most powerful pattern in TypeScript.

// Q12: What is a type predicate?
// A: A function with return type `param is Type`. When it returns true,
//    TS narrows the parameter to that type in the calling scope.
//    function isString(val: unknown): val is string { ... }
//    Used for custom runtime type checks (API validation, etc.)

// Q13: What is a generic type?
// A: A type parameter (placeholder) that lets you write reusable code
//    that works with any type while preserving type information.
//    function identity<T>(val: T): T — T is filled in at each call site.
//    Unlike `any`, generics DON'T lose type safety.

// Q14: What is keyof?
// A: An operator that produces a union of all keys of a type.
//    keyof { name: string; age: number } = "name" | "age"
//    Used with generics for type-safe property access.

// Q15: What is the difference between Partial, Pick, and Omit?
// A: Partial<T> — makes ALL properties optional
//    Pick<T, K> — selects specific properties
//    Omit<T, K> — removes specific properties
//    Partial is for updates. Pick/Omit reshape object types.

// Q16: What is `as const`?
// A: Const assertion — infers the NARROWEST type (literal types) and
//    makes everything readonly. `["a", "b"] as const` becomes
//    `readonly ["a", "b"]` instead of `string[]`.

// Q17: What is the `satisfies` operator?
// A: (TS 4.9+) Validates a value against a type WITHOUT widening the
//    inferred type. Catches errors while keeping specific types.
//    Unlike type annotation, it preserves literal inference.

// Q18: What are mapped types?
// A: Types that transform each property of an existing type.
//    Syntax: { [K in keyof T]: NewType }
//    This is how Partial, Readonly, Required work internally.

// Q19: What are conditional types?
// A: Types that choose between options based on a condition.
//    Syntax: T extends U ? A : B
//    Used for type branching, extracting types, and filtering unions.

// Q20: What is the `infer` keyword?
// A: Declares a type variable INSIDE a conditional type that captures
//    part of the inspected type. Used to extract return types, array
//    element types, Promise resolved types, etc.
//    Example: T extends Promise<infer R> ? R : never


// ---- ADVANCED / PRACTICAL (Questions 21-30) ----

// Q21: How do you type an event handler in the DOM?
// A: Use the specific event type: addEventListener("click", (e: MouseEvent) => {})
//    e.target is EventTarget — must cast to specific element type.
//    querySelector returns Element | null — use the generic form or assertion.

// Q22: How do you handle errors in try/catch with TypeScript?
// A: catch variable is `unknown` (not Error). You must narrow:
//    if (error instanceof Error) { error.message; }
//    Use a helper like getErrorMessage(error: unknown): string for safety.

// Q23: What is the Result pattern?
// A: An alternative to try/catch using a discriminated union:
//    { success: true; data: T } | { success: false; error: E }
//    The caller handles success/failure explicitly with if/else.

// Q24: How do you type useState in React?
// A: useState<Type>(initialValue). TS infers from the initial value,
//    but you must be explicit when the state can be null:
//    useState<User | null>(null)

// Q25: What is declaration merging?
// A: If you declare the same interface name twice, TS merges them.
//    Used for augmenting third-party types (extending Express Request,
//    adding properties to Window, etc.)

// Q26: What is a branded type?
// A: A technique to make structurally identical types incompatible:
//    type UserId = number & { __brand: "UserId" }
//    Prevents mixing up UserIds and PostIds even though both are numbers.

// Q27: What is module augmentation?
// A: Extending types from third-party modules using:
//    declare module "express" { interface Request { userId?: string; } }
//    Adds custom properties without modifying library code.

// Q28: What is excess property checking?
// A: TS rejects unknown properties when creating object literals directly:
//    const p: Point = { x: 1, y: 2, z: 3 }; // ERROR — z is unknown
//    But NOT when assigning through variables (structural typing applies).

// Q29: What are template literal types?
// A: Types that use template syntax to build string types:
//    type Event = `on${Capitalize<"click" | "hover">}` = "onClick" | "onHover"
//    Great for typed CSS classes, event names, and route patterns.

// Q30: What is the difference between extends in interfaces vs generics?
// A: In interfaces: extends means "inherit shape" (interface B extends A).
//    In generics: extends means "constrain" (T extends HasLength).
//    Same keyword, different purposes.


// =============================================================================
//               PART 3 — QUICK CONCEPT REFRESHERS
// =============================================================================

// TYPE SYSTEM HIERARCHY (from most restrictive to least):
//
//   never        -> can't be anything (bottom type)
//        |
//   literal      -> exact values ("admin", 42, true)
//        |
//   primitive    -> string, number, boolean, etc.
//        |
//   object       -> { }, interface, class
//        |
//   unknown      -> could be anything (must narrow)
//        |
//   any          -> I don't care (escape hatch)

// UTILITY TYPES CHEAT SHEET:
//
//  Partial<T>     -> all props optional         | Update operations
//  Required<T>    -> all props required          | Finalization
//  Readonly<T>    -> all props readonly           | Immutable state
//  Pick<T, K>     -> keep keys K                  | API responses
//  Omit<T, K>     -> remove keys K                | Hide sensitive fields
//  Record<K, V>   -> object with K keys, V values | Dictionaries
//  Exclude<U, T>  -> remove T from union U        | Filter unions
//  Extract<U, T>  -> keep T from union U          | Extract unions
//  NonNullable<T> -> remove null/undefined         | Required values
//  ReturnType<F>  -> function's return type        | Derive types
//  Parameters<F>  -> function's param types        | Forward calls
//  Awaited<T>     -> unwrap Promise                | Async return types

// NARROWING TECHNIQUES:
//  typeof                 -> primitives (string, number, boolean)
//  instanceof             -> class instances (Error, Date)
//  in                     -> property existence on object
//  truthiness             -> remove null/undefined (careful with 0 and "")
//  equality (===)         -> narrow overlapping union members
//  discriminant property  -> discriminated unions (kind, type, status)
//  type predicate (is)    -> custom guard functions


// =============================================================================
//               PART 4 — COMMON CODING CHALLENGES
// =============================================================================

// CHALLENGE 1: Type-safe pluck function
// "Write a function that extracts a list of property values from an array of objects"

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users = [
  { name: "Ayushman", age: 21 },
  { name: "Alice", age: 25 },
];
const names = pluck(users, "name"); // string[]
const ages = pluck(users, "age");   // number[]


// CHALLENGE 2: Type-safe getter
// "Write a function that safely gets a property from an object"

function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const name = getProperty({ name: "Ayushman", age: 21 }, "name"); // string


// CHALLENGE 3: Implement a basic Partial<T>
// "Implement Partial without using the built-in"

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};


// CHALLENGE 4: Implement a basic Pick<T, K>
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};


// CHALLENGE 5: Implement ReturnType<T>
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;


// CHALLENGE 6: Implement NonNullable<T>
type MyNonNullable<T> = T extends null | undefined ? never : T;


// CHALLENGE 7: Flatten a nested object type
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};


// CHALLENGE 8: Type-safe event emitter
type EventMap = {
  login: { userId: number };
  logout: { userId: number };
  error: { message: string };
};

class TypedEmitter<T extends Record<string, any>> {
  private handlers: Partial<Record<keyof T, Function[]>> = {};

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.handlers[event]?.forEach(fn => fn(data));
  }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on("login", (data) => console.log(data.userId)); // typed!
emitter.emit("login", { userId: 123 }); // validated!
// emitter.emit("login", { message: "hi" }); // ERROR — wrong shape


// CHALLENGE 9: Type-safe builder pattern
class UserBuilder {
  private user: Partial<{ name: string; age: number; email: string }> = {};

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  build(): { name: string; age: number; email: string } {
    if (!this.user.name || !this.user.age || !this.user.email) {
      throw new Error("All fields are required");
    }
    return this.user as { name: string; age: number; email: string };
  }
}

const builtUser = new UserBuilder()
  .setName("Ayushman")
  .setAge(21)
  .setEmail("a@b.com")
  .build();


// =============================================================================
//               PART 5 — TRICKY EDGE CASES & GOTCHAS
// =============================================================================

// GOTCHA 1: Object.keys() returns string[], not keyof T
const config = { host: "localhost", port: 3000 };
const keys = Object.keys(config); // string[] — not ("host" | "port")[]
// This is by design — TS can't guarantee no extra keys at runtime.

// GOTCHA 2: Arrays are objects
// typeof [] === "object"  ->  true
// Use Array.isArray() for array checks, not typeof.

// GOTCHA 3: Readonly is shallow
const obj = { nested: { value: 1 } } as const;
// obj.nested.value = 2;  // This MIGHT work! as const is one level deep for objects
// Use DeepReadonly for true deep immutability.

// GOTCHA 4: Enums are not just types — they're runtime objects
enum Status { Active, Inactive }
// This creates a JavaScript object at runtime. Unlike types/interfaces.

// GOTCHA 5: void callbacks can return values
type Callback = () => void;
const cb: Callback = () => 42; // No error! void means "ignore the return"

// GOTCHA 6: Excess property checking only applies to direct literals
interface Point { x: number; y: number }
// const p: Point = { x: 1, y: 2, z: 3 }; // ERROR — direct literal
const data = { x: 1, y: 2, z: 3 };
const p: Point = data; // OK — through variable (structural typing)

// GOTCHA 7: Type assertions don't validate at runtime
const bad = "hello" as unknown as number;
// TS thinks it's a number. It's still a string at runtime.

// GOTCHA 8: Optional chaining returns undefined, not null
const obj2 = { a: null };
const result = obj2?.a; // null (not undefined!) — ?. only short-circuits for null/undefined

// GOTCHA 9: Union types narrow BOTH directions
function fn(x: string | number) {
  if (typeof x !== "string") {
    // x is number here (not string | number)
  }
}

// GOTCHA 10: Tuples can be pushed to (TS limitation)
const tuple: [string, number] = ["a", 1];
tuple.push("extra"); // TS allows this! Use readonly tuples to prevent it.


// =============================================================================
//            PART 6 — WHAT TO SAY (AND NOT SAY) IN INTERVIEWS
// =============================================================================

// SAY THIS:
//
//  "TypeScript adds a type system on top of JavaScript. It catches
//   bugs at compile time, provides excellent IDE support, and makes
//   refactoring safe. Types are erased at runtime — zero overhead."
//
//  "I prefer unknown over any — it forces me to validate data
//   before using it, which leads to more reliable code."
//
//  "Discriminated unions are the most powerful pattern in TS.
//   I use them for state machines, API responses, and Redux actions."
//
//  "I let TypeScript infer where it can, and annotate function
//   signatures and public APIs explicitly."
//
//  "I use the Result pattern for expected failures and try/catch
//   for unexpected errors."

// DON'T SAY THIS:
//
//  "I use `any` everywhere to avoid type errors."
//     -> Shows you don't understand the point of TS.
//
//  "TypeScript replaces JavaScript."
//     -> Wrong. TS compiles TO JavaScript. Browsers run JS.
//
//  "Types exist at runtime."
//     -> Wrong. Types are erased during compilation.
//
//  "I always use type assertions (as) to fix type errors."
//     -> Shows you're bypassing the type system instead of fixing issues.
//
//  "Interfaces and types are the same thing."
//     -> They're similar but have important differences
//        (merging, unions, extends vs &).


// =============================================================================
//                    QUICK REVISION BEFORE THE INTERVIEW
// =============================================================================
//
//  KEY CONCEPTS TO REVIEW:
//  [ ] Primitives: string, number, boolean, null, undefined, bigint, symbol
//  [ ] Special types: any, unknown, never, void
//  [ ] Union types (|) and intersection types (&)
//  [ ] Type narrowing techniques (typeof, instanceof, in, discriminant)
//  [ ] Generics and constraints (<T extends HasLength>)
//  [ ] Utility types (Partial, Pick, Omit, Record, ReturnType)
//  [ ] Type aliases vs interfaces (merging, unions, extends)
//  [ ] as const, satisfies, type assertions
//  [ ] Mapped types and conditional types
//  [ ] Modules (import/export, import type, .d.ts, @types)
//  [ ] DOM typing (HTMLElement hierarchy, event types)
//  [ ] async/await typing (Promise<T>, typed fetch)
//  [ ] Error handling (unknown catch, Result pattern)
//  [ ] React + TS (props, hooks, events, generics)
//
//  REMEMBER:
//  -> TypeScript = JavaScript + Static Types
//  -> Types are erased at runtime (zero cost)
//  -> unknown > any (always)
//  -> Discriminated unions = most powerful pattern
//  -> Inference where possible, annotation where necessary
//  -> strict: true ALWAYS


console.log("-- 17_interview_prep.ts loaded successfully --");
