export {};
// =============================================================================
//  09 | UTILITY TYPES
// =============================================================================
//
//  Prerequisites : 08_generics.ts
//  Next File     : 10_type_assertions.ts
//
//  This file covers:
//    1. Partial<T>       — all properties optional
//    2. Required<T>      — all properties required
//    3. Readonly<T>      — all properties readonly
//    4. Pick<T, K>       — select specific properties
//    5. Omit<T, K>       — remove specific properties
//    6. Record<K, V>     — object with typed keys and values
//    7. Exclude<T, U>    — remove types from a union
//    8. Extract<T, U>    — keep types from a union
//    9. NonNullable<T>   — remove null and undefined
//   10. ReturnType<T>    — get function's return type
//   11. Parameters<T>    — get function's parameter types
//   12. Awaited<T>       — unwrap Promise type
//   13. Combining utility types (real-world patterns)
//
// =============================================================================

// BASE TYPES used throughout this file:

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "editor" | "viewer";
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt?: Date;
  tags: string[];
}


// -----------------------------------------------------------------------------
//  SECTION 1 — Partial<T>
// -----------------------------------------------------------------------------

// Makes ALL properties OPTIONAL (adds ? to every property).

type PartialUser = Partial<User>;
// Equivalent to:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   role?: "admin" | "editor" | "viewer";
// }

// REAL-WORLD USE CASE — Update/patch requests:
function updateUser(id: number, updates: Partial<User>): User {
  // Caller can pass any subset of fields to update
  const existingUser: User = {
    id, name: "Ayushman", email: "a@b.com", age: 21, role: "admin"
  };
  return { ...existingUser, ...updates };
}

// Only update the name — other fields keep their existing values:
const updated = updateUser(1, { name: "New Name" });
console.log(updated.name); // "New Name"

// WHEN TO USE:
// - PATCH/PUT request bodies
// - Config objects with defaults
// - Form state (partially filled forms)


// -----------------------------------------------------------------------------
//  SECTION 2 — Required<T>
// -----------------------------------------------------------------------------

// Makes ALL properties REQUIRED (removes ? from every property).
// Opposite of Partial.

type RequiredBlogPost = Required<BlogPost>;
// publishedAt is now REQUIRED (was optional with ?).

const post: RequiredBlogPost = {
  id: "1",
  title: "TypeScript Tips",
  content: "Some great content...",
  author: "Ayushman",
  publishedAt: new Date(),  // MUST be provided now
  tags: ["typescript"],
};

// WHEN TO USE:
// - Ensuring all config options are explicitly provided
// - Finalizing objects that were built up incrementally


// -----------------------------------------------------------------------------
//  SECTION 3 — Readonly<T>
// -----------------------------------------------------------------------------

// Makes ALL properties READONLY (can't be reassigned after creation).

type ReadonlyUser = Readonly<User>;

const frozenUser: ReadonlyUser = {
  id: 1, name: "Ayushman", email: "a@b.com", age: 21, role: "admin"
};

// frozenUser.name = "New"; // ERROR — readonly property

// WHEN TO USE:
// - State objects in React (state should be immutable)
// - Config that shouldn't change at runtime
// - Frozen API response data

// NOTE: Readonly is SHALLOW — nested objects are NOT readonly:
type DeepObj = Readonly<{ nested: { value: number } }>;
const obj: DeepObj = { nested: { value: 10 } };
// obj.nested = { value: 20 };  // ERROR — top level is readonly
obj.nested.value = 20;          // OK! — nested properties are not readonly

// For deep readonly, use a recursive type or a library.


// -----------------------------------------------------------------------------
//  SECTION 4 — Pick<T, K>
// -----------------------------------------------------------------------------

// Select SPECIFIC properties from a type. Returns a new type with only those keys.

type UserPreview = Pick<User, "id" | "name">;
// Equivalent to: { id: number; name: string; }

const preview: UserPreview = {
  id: 1,
  name: "Ayushman",
  // email: "a@b.com", // ERROR — not picked
};

// REAL-WORLD USE CASE — list items only need a subset of data:
type PostSummary = Pick<BlogPost, "id" | "title" | "author">;

function renderPostList(posts: PostSummary[]): void {
  posts.forEach(p => console.log(`${p.title} by ${p.author}`));
}

// WHEN TO USE:
// - API responses with subset of fields
// - Component props that only need specific data


// -----------------------------------------------------------------------------
//  SECTION 5 — Omit<T, K>
// -----------------------------------------------------------------------------

// REMOVE specific properties from a type. Returns everything EXCEPT those keys.
// Opposite of Pick.

type UserWithoutRole = Omit<User, "role">;
// Has: id, name, email, age. Missing: role.

type CreateUserInput = Omit<User, "id">;
// When creating a user, the server assigns the id — we don't send it.

const newUser: CreateUserInput = {
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  role: "viewer",
};

// Omit multiple:
type PublicUser = Omit<User, "email" | "age">;
// Has: id, name, role. Privacy-safe for public display.

// WHEN TO USE:
// - Create/insert operations (omit auto-generated fields like id, createdAt)
// - Public data (omit sensitive fields like email, password)


// -----------------------------------------------------------------------------
//  SECTION 6 — Record<K, V>
// -----------------------------------------------------------------------------

// Creates an object type where all keys are K and all values are V.

// Simple dictionary:
type StringMap = Record<string, string>;
const headers: StringMap = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
};

// Typed keys:
type UserRoles = Record<"admin" | "editor" | "viewer", boolean>;
const roleFlags: UserRoles = {
  admin: true,
  editor: false,
  viewer: true,
};

// Lookup table:
type StatusMessages = Record<200 | 400 | 404 | 500, string>;
const messages: StatusMessages = {
  200: "OK",
  400: "Bad Request",
  404: "Not Found",
  500: "Internal Server Error",
};

// Record with complex values:
type UserDatabase = Record<string, User>;
const db: UserDatabase = {
  "u1": { id: 1, name: "Ayushman", email: "a@b.com", age: 21, role: "admin" },
  "u2": { id: 2, name: "Rahul", email: "r@b.com", age: 22, role: "editor" },
};

// WHEN TO USE:
// - Dictionaries/maps
// - Lookup tables
// - Replacing index signatures: Record<string, T> is cleaner than {[key: string]: T}


// -----------------------------------------------------------------------------
//  SECTION 7 — Exclude<T, U>
// -----------------------------------------------------------------------------

// REMOVES types from a UNION. Works on union types, not object properties.

type AllRoles = "admin" | "editor" | "viewer" | "superadmin";
type BasicRoles = Exclude<AllRoles, "superadmin" | "admin">;
// Result: "editor" | "viewer"

type Primitive = string | number | boolean | null | undefined;
type NonNullPrimitive = Exclude<Primitive, null | undefined>;
// Result: string | number | boolean

// WHEN TO USE:
// - Restricting a broader union type
// - Removing specific cases from a union


// -----------------------------------------------------------------------------
//  SECTION 8 — Extract<T, U>
// -----------------------------------------------------------------------------

// KEEPS only the types from a union that MATCH U. Opposite of Exclude.

type AdminRoles = Extract<AllRoles, "admin" | "superadmin">;
// Result: "admin" | "superadmin"

type StringTypes = Extract<string | number | boolean, string | boolean>;
// Result: string | boolean

// Exclude REMOVES matching. Extract KEEPS matching.


// -----------------------------------------------------------------------------
//  SECTION 9 — NonNullable<T>
// -----------------------------------------------------------------------------

// Removes null and undefined from a type.

type MaybeName = string | null | undefined;
type DefiniteName = NonNullable<MaybeName>;
// Result: string

// EQUIVALENT TO: Exclude<T, null | undefined>

// WHEN TO USE:
// - After null-checking, narrowing the type
// - Ensuring a value is definitely present

function processName(name: MaybeName) {
  // name is string | null | undefined here
  if (name !== null && name !== undefined) {
    // name is string here (narrowed)
    const definite: NonNullable<MaybeName> = name;
    console.log(definite.toUpperCase());
  }
}


// -----------------------------------------------------------------------------
//  SECTION 10 — ReturnType<T>
// -----------------------------------------------------------------------------

// Extracts the RETURN TYPE of a function type.

function createUser() {
  return {
    id: 1,
    name: "Ayushman",
    createdAt: new Date(),
  };
}

type CreatedUser = ReturnType<typeof createUser>;
// Result: { id: number; name: string; createdAt: Date; }

// WHEN TO USE:
// - Deriving types FROM functions instead of defining them separately
// - Matching return types across related functions
// - Especially useful with third-party functions whose types you don't control

// With generic functions:
function fetchItems<T>(url: string): Promise<T[]> {
  return fetch(url).then(r => r.json());
}

// To get the return type of a specific instantiation:
type FetchUsersReturn = ReturnType<typeof fetchItems<User>>;
// Result: Promise<User[]>


// -----------------------------------------------------------------------------
//  SECTION 11 — Parameters<T>
// -----------------------------------------------------------------------------

// Extracts the PARAMETER types of a function as a tuple.

function registerUser(name: string, age: number, email: string): void {
  console.log(`Registered: ${name}, ${age}, ${email}`);
}

type RegisterParams = Parameters<typeof registerUser>;
// Result: [string, number, string]

// Use case — forwarding function calls:
function logAndRegister(...args: Parameters<typeof registerUser>) {
  console.log("Calling registerUser with:", args);
  registerUser(...args);
}

logAndRegister("Ayushman", 21, "a@b.com");


// -----------------------------------------------------------------------------
//  SECTION 12 — Awaited<T>
// -----------------------------------------------------------------------------

// Unwraps a Promise type to get the resolved value type.

type PromiseString = Promise<string>;
type ResolvedString = Awaited<PromiseString>;
// Result: string

type NestedPromise = Promise<Promise<number>>;
type ResolvedNestedPromise = Awaited<NestedPromise>;
// Result: number (deeply unwraps!)

// WHEN TO USE:
// Getting the type of what a Promise resolves to,
// especially with async functions.

async function fetchUser(): Promise<User> {
  return { id: 1, name: "Ayushman", email: "a@b.com", age: 21, role: "admin" };
}

type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;
// Result: User


// -----------------------------------------------------------------------------
//  SECTION 13 — COMBINING UTILITY TYPES (REAL-WORLD PATTERNS)
// -----------------------------------------------------------------------------

// PATTERN 1: Create input type (omit auto-generated, make some optional)
type CreatePostInput = Omit<BlogPost, "id" | "publishedAt"> & {
  publishedAt?: Date; // add back as optional
};

// PATTERN 2: Update input type (everything optional except id)
type UpdatePostInput = Partial<Omit<BlogPost, "id">> & {
  id: string; // id is always required
};

// PATTERN 3: Readonly API response
type ApiUser = Readonly<Pick<User, "id" | "name" | "role">>;

// PATTERN 4: Database entity (always has id + timestamps)
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type DBUser = WithTimestamps<User>;
// Has all User fields PLUS createdAt and updatedAt


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  UTILITY TYPE         WHAT IT DOES                        EXAMPLE
//  -------------------  ----------------------------------  -----------------------
//  Partial<T>           All props optional                  Partial<User>
//  Required<T>          All props required                  Required<Config>
//  Readonly<T>          All props readonly                  Readonly<User>
//  Pick<T, K>           Keep only keys K                    Pick<User, "id"|"name">
//  Omit<T, K>           Remove keys K                       Omit<User, "password">
//  Record<K, V>         Object with keys K, values V        Record<string, number>
//  Exclude<U, T>        Remove T from union U               Exclude<A|B|C, C>
//  Extract<U, T>        Keep T from union U                 Extract<A|B|C, A|B>
//  NonNullable<T>       Remove null/undefined               NonNullable<string|null>
//  ReturnType<T>        Get function return type             ReturnType<typeof fn>
//  Parameters<T>        Get function params as tuple         Parameters<typeof fn>
//  Awaited<T>           Unwrap Promise                       Awaited<Promise<User>>


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is the difference between Pick and Omit?
//  A: Pick selects specific keys to KEEP. Omit specifies keys to REMOVE.
//     Pick<User, "id"|"name"> keeps only id and name.
//     Omit<User, "id"|"name"> keeps everything EXCEPT id and name.
//
//  Q2: When would you use Partial<T>?
//  A: For update/patch operations where you want to allow updating any
//     subset of properties. Also for config objects with defaults.
//
//  Q3: What is the difference between Exclude and Omit?
//  A: Exclude works on UNION TYPES (removes members from a union).
//     Omit works on OBJECT TYPES (removes properties from an object).
//
//  Q4: Is Readonly deep or shallow?
//  A: Shallow. Only top-level properties are readonly. Nested objects
//     can still be mutated. For deep readonly, use a recursive type.
//
//  Q5: What does ReturnType do?
//  A: Extracts the return type of a function type. Useful for deriving
//     types from existing functions without duplicating type definitions.
//
//  Q6: How do you combine utility types?
//  A: Use intersection (&) to combine. Example:
//     Partial<Omit<User, "id">> & { id: string }
//     = everything optional except id (which is required).


console.log("-- 09_utility_types.ts executed successfully --");
