export {};
// =============================================================================
//  15 | ERROR HANDLING IN TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 14_async_typescript.ts
//  Next File     : 16_react_typescript.ts
//
//  This file covers:
//    1. try/catch with unknown errors
//    2. Error narrowing patterns
//    3. Custom error classes
//    4. Result pattern (no exceptions)
//    5. Error utility functions
//    6. Validation errors
//    7. Error boundaries (concept)
//    8. Best practices
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — try/catch WITH UNKNOWN ERRORS
// -----------------------------------------------------------------------------

// In TypeScript (strict mode, TS 4.4+), catch clause variables are `unknown`.
// This is CORRECT — ANYTHING can be thrown in JavaScript.

// In JS, you can throw:
// throw new Error("oops");     // Error object
// throw "oops";                // string
// throw 404;                   // number
// throw { message: "oops" };   // object
// throw null;                  // null!

// Because of this, the catch variable CANNOT be assumed to be an Error.

function riskyOperation() {
  try {
    JSON.parse("{ bad json }");
  } catch (error: unknown) {
    // error is `unknown` — must narrow before using

    // PATTERN 1: instanceof Error (most common)
    if (error instanceof Error) {
      console.log("Name:", error.name);       // "SyntaxError"
      console.log("Message:", error.message); // "Unexpected token..."
      console.log("Stack:", error.stack);     // stack trace
    }

    // PATTERN 2: Check for string throws
    else if (typeof error === "string") {
      console.log("Error string:", error);
    }

    // PATTERN 3: Fallback for anything else
    else {
      console.log("Unknown error:", error);
    }
  }
}


// -----------------------------------------------------------------------------
//  SECTION 2 — ERROR NARROWING PATTERNS
// -----------------------------------------------------------------------------

// REUSABLE ERROR MESSAGE EXTRACTOR:
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unknown error occurred";
}

// Usage:
function safeDivide(a: number, b: number): number {
  try {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  } catch (error: unknown) {
    console.error("Error:", getErrorMessage(error));
    return 0;
  }
}

// TYPE GUARD FOR ERRORS:
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function isErrorWithCode(value: unknown): value is Error & { code: string } {
  return (
    value instanceof Error &&
    "code" in value &&
    typeof (value as any).code === "string"
  );
}

// Usage:
function handleNodeError(error: unknown) {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case "ENOENT": console.log("File not found"); break;
      case "EACCES": console.log("Permission denied"); break;
      default: console.log("Error code:", error.code);
    }
  } else if (isError(error)) {
    console.log("Generic error:", error.message);
  }
}


// -----------------------------------------------------------------------------
//  SECTION 3 — CUSTOM ERROR CLASSES
// -----------------------------------------------------------------------------

// Custom errors let you create domain-specific error types
// with additional properties for better error handling.

class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError"; // Set the error name
    Object.setPrototypeOf(this, AppError.prototype); // Fix prototype chain
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
  ) {
    super(message, "VALIDATION_FAILED", 400);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthenticationError";
  }
}

// USING CUSTOM ERRORS:
function findUser(id: number) {
  const users = [{ id: 1, name: "Ayushman" }];
  const user = users.find(u => u.id === id);

  if (!user) {
    throw new NotFoundError("User", id);
  }

  return user;
}

// HANDLING CUSTOM ERRORS:
function handleRequest() {
  try {
    const user = findUser(999);
    console.log(user);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      console.log(`404: ${error.message}`); // specific handling
    } else if (error instanceof ValidationError) {
      console.log(`400: ${error.field} — ${error.message}`);
    } else if (error instanceof AppError) {
      console.log(`${error.statusCode}: ${error.message}`);
    } else {
      console.log("Unexpected error:", getErrorMessage(error));
    }
  }
}

// WHY Object.setPrototypeOf?
// When extending built-in classes like Error, the prototype chain can break
// in some environments. This line fixes it — without it, instanceof checks
// might fail. Always include it in custom error classes.


// -----------------------------------------------------------------------------
//  SECTION 4 — RESULT PATTERN (NO EXCEPTIONS)
// -----------------------------------------------------------------------------

// Instead of throwing errors, return a discriminated union.
// The caller handles success and failure explicitly — no surprise throws.

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions:
function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// USING THE RESULT PATTERN:
function parseAge(input: string): Result<number, string> {
  const parsed = parseInt(input, 10);
  if (isNaN(parsed)) return fail(`"${input}" is not a valid number`);
  if (parsed < 0) return fail("Age cannot be negative");
  if (parsed > 150) return fail("Age is unrealistically high");
  return ok(parsed);
}

const ageResult = parseAge("twenty");
if (ageResult.success) {
  console.log("Age:", ageResult.data); // data is number
} else {
  console.log("Error:", ageResult.error); // error is string
}

// CHAINING RESULTS:
function parseAndValidateUser(
  nameInput: string,
  ageInput: string
): Result<{ name: string; age: number }, string> {
  if (nameInput.trim().length === 0) return fail("Name is required");

  const ageResult = parseAge(ageInput);
  if (!ageResult.success) return ageResult; // propagate the error

  return ok({ name: nameInput.trim(), age: ageResult.data });
}

// ASYNC RESULT PATTERN:
async function fetchUserSafe(id: number): Promise<Result<{ name: string }>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return fail(new Error(`HTTP ${response.status}`));
    const data = await response.json();
    return ok(data);
  } catch (error) {
    return fail(error instanceof Error ? error : new Error(String(error)));
  }
}

// WHY USE THE RESULT PATTERN?
//   - Explicit: caller sees that errors are possible (it's in the type)
//   - Composable: results can be chained and transformed
//   - No surprise throws: every error is handled at the call site
//   - Self-documenting: the error types tell you what can go wrong


// -----------------------------------------------------------------------------
//  SECTION 5 — ERROR UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

// A collection of reusable error handling utilities:

// 1. Ensure a value is an Error object:
function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  return new Error(`Unknown error: ${JSON.stringify(value)}`);
}

// 2. Assert function — throw if condition is false:
function assert(
  condition: unknown,
  message: string = "Assertion failed"
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

// Usage — TS narrows the type after assert:
function processUser(user: { name: string; age?: number }) {
  assert(user.age !== undefined, "Age is required");
  // After assert, TS knows user.age is number (not undefined)
  console.log(user.age.toFixed(0));
}

// 3. assertNever — exhaustive check utility:
function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${value}`);
}

// 4. Wrap function to catch errors:
function tryCatch<T>(fn: () => T): Result<T> {
  try {
    return ok(fn());
  } catch (error) {
    return fail(toError(error));
  }
}

const result = tryCatch(() => JSON.parse("invalid"));
if (!result.success) {
  console.log("Parse failed:", result.error.message);
}


// -----------------------------------------------------------------------------
//  SECTION 6 — VALIDATION ERRORS
// -----------------------------------------------------------------------------

// Pattern for collecting MULTIPLE validation errors at once:

interface FieldError {
  field: string;
  message: string;
}

class FormValidationError extends Error {
  constructor(public readonly errors: FieldError[]) {
    super(`Validation failed: ${errors.length} error(s)`);
    this.name = "FormValidationError";
  }
}

interface SignupForm {
  username: string;
  email: string;
  password: string;
  age: number;
}

function validateSignup(form: SignupForm): Result<SignupForm, FieldError[]> {
  const errors: FieldError[] = [];

  if (form.username.length < 3) {
    errors.push({ field: "username", message: "Must be at least 3 characters" });
  }

  if (!form.email.includes("@")) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (form.password.length < 8) {
    errors.push({ field: "password", message: "Must be at least 8 characters" });
  }

  if (form.age < 13 || form.age > 120) {
    errors.push({ field: "age", message: "Must be between 13 and 120" });
  }

  if (errors.length > 0) return fail(errors);
  return ok(form);
}

// Usage:
const signupResult = validateSignup({
  username: "ay",
  email: "invalid",
  password: "short",
  age: 21,
});

if (!signupResult.success) {
  signupResult.error.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}


// -----------------------------------------------------------------------------
//  SECTION 7 — ERROR BOUNDARIES (CONCEPT)
// -----------------------------------------------------------------------------

// In a real application, you want error boundaries — layers that catch
// errors at different levels of your app.

// LAYER 1: Domain/Business Logic
// Uses custom errors (NotFoundError, ValidationError)
// Throws meaningful errors with context

// LAYER 2: Service/API Layer
// Catches domain errors, converts to Result types
// Adds logging and monitoring

// LAYER 3: Controller/Handler Layer
// Converts Results to HTTP responses (status codes, error messages)
// Handles unexpected errors with generic 500 response

// LAYER 4: Global Error Handler (top-level)
// Catches anything that slipped through
// Logs, alerts, graceful degradation

// Example structure:
// function globalErrorHandler(error: unknown): void {
//   const err = toError(error);
//   console.error("[FATAL]", err.message, err.stack);
//   // Send to error monitoring service (Sentry, etc.)
//   // Show user-friendly error page
// }


// -----------------------------------------------------------------------------
//  SECTION 8 — BEST PRACTICES
// -----------------------------------------------------------------------------

// 1. ALWAYS use `unknown` in catch blocks (not `any`)
//    catch (error: unknown)  -> forces you to narrow safely

// 2. CREATE custom error classes for domain-specific errors
//    NotFoundError, ValidationError, AuthError — not just plain Error

// 3. INCLUDE context in errors
//    new Error(`User ${id} not found`) instead of new Error("Not found")

// 4. USE the Result pattern for expected failure modes
//    Validation, parsing, API calls — these are not "exceptions"

// 5. THROW only for unexpected/unrecoverable errors
//    Programming errors, corrupt state, missing dependencies

// 6. LOG at the boundary, not in the utility function
//    Don't console.log inside every function — let the caller decide

// 7. USE assertion functions for invariants
//    assert(user.id > 0) narrows the type AND documents assumptions

// 8. DON'T catch and swallow errors silently
//    catch (e) { } <- NEVER do this. At minimum, log the error.


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN                    WHEN TO USE
//  -------------------------  -------------------------------------------
//  try/catch + unknown        Any code that might throw
//  instanceof narrowing       Distinguishing error types
//  getErrorMessage()          Extract message from any thrown value
//  Custom error classes       Domain-specific errors with extra data
//  Result<T, E>               Expected failures (validation, parsing)
//  assert()                   Invariants that narrow types
//  assertNever()              Exhaustive switch statements
//  toError()                  Convert unknown to Error safely


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: Why is the catch variable `unknown` in TypeScript?
//  A: Because JS allows throwing ANY value (strings, numbers, objects,
//     null). It's not safe to assume it's an Error. `unknown` forces
//     you to narrow the type before using it.
//
//  Q2: What is the Result pattern?
//  A: A discriminated union { success: true; data: T } | { success: false; error: E }
//     that represents either success or failure. The caller handles both
//     cases explicitly instead of using try/catch.
//
//  Q3: Why extend the Error class for custom errors?
//  A: Custom error classes let you add domain-specific data (statusCode,
//     field, code) and use instanceof for precise error handling.
//     They make error handling more structured and meaningful.
//
//  Q4: What does `asserts condition` do?
//  A: It's a return type that tells TS: "If this function returns normally,
//     the condition is true." TS narrows the type after the assertion call.
//     Used for invariant checks that also act as type guards.
//
//  Q5: What is the difference between throwing and returning errors?
//  A: Throwing interrupts control flow — the caller MUST use try/catch.
//     Returning errors (Result pattern) keeps normal control flow — the
//     caller uses if/else. Returning is more explicit and composable.
//
//  Q6: Why should you not catch and swallow errors?
//  A: Silent catch blocks hide bugs. The error disappears and you get
//     mysterious behavior later. Always at least log the error, or
//     re-throw it if you can't handle it.


console.log("-- 15_error_handling.ts executed successfully --");
