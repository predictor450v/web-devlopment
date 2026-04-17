export {};
// =============================================================================
//  14 | ASYNC TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 13_dom_and_events.ts
//  Next File     : 15_error_handling.ts
//
//  This file covers:
//    1. Promise<T> typing
//    2. async/await with TypeScript
//    3. Typed fetch API
//    4. Error handling in async code
//    5. Promise.all, Promise.race, Promise.allSettled
//    6. Generic API wrapper functions
//    7. Axios with TypeScript
//    8. AbortController (cancellable requests)
//    9. Retry patterns
//   10. Real-world async patterns
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — Promise<T> TYPING
// -----------------------------------------------------------------------------

// A Promise in TypeScript is generic: Promise<T>
// T is the type of the VALUE the promise resolves to.

// BASIC PROMISE:
const numberPromise: Promise<number> = new Promise((resolve) => {
  setTimeout(() => resolve(42), 1000);
});

// Function returning a typed promise:
function fetchUsername(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Ayushman"), 500);
  });
}

// TS infers the type from resolve():
const inferred = new Promise((resolve) => {
  resolve("hello"); // TS infers Promise<string>
});

// IMPORTANT: If resolve can be called with different types,
// annotate the Promise explicitly:
const mixedPromise: Promise<string | number> = new Promise((resolve) => {
  if (Math.random() > 0.5) {
    resolve("text");
  } else {
    resolve(42);
  }
});


// -----------------------------------------------------------------------------
//  SECTION 2 — ASYNC/AWAIT WITH TYPESCRIPT
// -----------------------------------------------------------------------------

// async functions ALWAYS return a Promise.
// TS wraps the return type in Promise<T> automatically.

async function getUser(): Promise<{ name: string; age: number }> {
  // Even without Promise.resolve(), async wraps the return in a Promise.
  return { name: "Ayushman", age: 21 };
}

// await UNWRAPS the Promise — gives you the resolved value:
async function demo() {
  const user = await getUser();
  // user is { name: string; age: number } — NOT Promise<...>
  console.log(user.name); // "Ayushman"
}

// MULTIPLE AWAIT in sequence:
async function getUserData() {
  const user = await getUser();              // wait for user
  const username = await fetchUsername();     // THEN wait for username
  return { user, username };
}

// RULE: async function return types are always Promise<T>.
// Even if you write `return 42`, the return type is Promise<number>.


// -----------------------------------------------------------------------------
//  SECTION 3 — TYPED FETCH API
// -----------------------------------------------------------------------------

// The Fetch API returns Promise<Response>.
// response.json() returns Promise<any> by default.
// YOU must provide the type.

interface User {
  id: number;
  name: string;
  email: string;
}

// BASIC TYPED FETCH:
async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data: User[] = await response.json();
  // or: const data = await response.json() as User[];
  return data;
}

// GENERIC TYPED FETCH WRAPPER:
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Usage — specify the expected type:
async function example() {
  const users = await fetchJSON<User[]>("https://jsonplaceholder.typicode.com/users");
  console.log(users[0].name); // fully typed!

  const singleUser = await fetchJSON<User>("https://jsonplaceholder.typicode.com/users/1");
  console.log(singleUser.email); // fully typed!
}

// FETCH WITH REQUEST OPTIONS:
async function createUser(userData: Omit<User, "id">): Promise<User> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  return response.json() as Promise<User>;
}


// -----------------------------------------------------------------------------
//  SECTION 4 — ERROR HANDLING IN ASYNC CODE
// -----------------------------------------------------------------------------

// PATTERN 1: try/catch (most common)
async function safelyFetchUsers(): Promise<User[]> {
  try {
    const users = await fetchJSON<User[]>("/api/users");
    return users;
  } catch (error: unknown) {
    // `error` is unknown in strict mode — must narrow
    if (error instanceof Error) {
      console.error("Fetch failed:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return []; // return fallback value
  }
}

// PATTERN 2: Result type (no try/catch)
type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

async function fetchWithResult<T>(url: string): Promise<Result<T>> {
  try {
    const data = await fetchJSON<T>(url);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// Usage — no try/catch needed at the call site:
async function exampleResult() {
  const result = await fetchWithResult<User[]>("/api/users");

  if (result.ok) {
    console.log("Users:", result.data); // data is User[]
  } else {
    console.log("Error:", result.error.message); // error is Error
  }
}

// PATTERN 3: Tuple return [data, error]
async function safeFetch<T>(url: string): Promise<[T | null, Error | null]> {
  try {
    const data = await fetchJSON<T>(url);
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Usage:
async function exampleTuple() {
  const [users, error] = await safeFetch<User[]>("/api/users");

  if (error) {
    console.log("Failed:", error.message);
    return;
  }

  console.log("Got users:", users); // users is User[] (narrowed)
}


// -----------------------------------------------------------------------------
//  SECTION 5 — Promise.all, Promise.race, Promise.allSettled
// -----------------------------------------------------------------------------

// PROMISE.ALL — wait for ALL promises to resolve. Fails if ANY fails.
async function fetchDashboardData() {
  const [users, posts, comments] = await Promise.all([
    fetchJSON<User[]>("/api/users"),
    fetchJSON<{ id: number; title: string }[]>("/api/posts"),
    fetchJSON<{ id: number; body: string }[]>("/api/comments"),
  ]);

  // TS infers the types correctly:
  // users: User[]
  // posts: { id: number; title: string }[]
  // comments: { id: number; body: string }[]

  console.log("Users:", users.length);
  console.log("Posts:", posts.length);
}

// PROMISE.RACE — resolves with the FIRST promise to settle.
async function fetchWithTimeout<T>(url: string, timeoutMs: number): Promise<T> {
  const fetchPromise = fetchJSON<T>(url);
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

// PROMISE.ALLSETTLED — waits for ALL promises, never fails.
// Returns status + value/reason for each.
async function fetchMultipleAPIs() {
  const results = await Promise.allSettled([
    fetchJSON<User[]>("/api/users"),
    fetchJSON<{ id: string }[]>("/api/posts"),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`API ${index} succeeded:`, result.value);
    } else {
      console.log(`API ${index} failed:`, result.reason);
    }
  });
}


// -----------------------------------------------------------------------------
//  SECTION 6 — GENERIC API WRAPPER FUNCTIONS
// -----------------------------------------------------------------------------

// A fully typed API client:

interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

function createApiClient(config: ApiConfig) {
  async function get<T>(path: string): Promise<T> {
    const response = await fetch(`${config.baseUrl}${path}`, {
      headers: config.headers,
    });
    if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
    return response.json() as Promise<T>;
  }

  async function post<T, B>(path: string, body: B): Promise<T> {
    const response = await fetch(`${config.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`POST ${path} failed: ${response.status}`);
    return response.json() as Promise<T>;
  }

  return { get, post };
}

// Usage:
const api = createApiClient({
  baseUrl: "https://jsonplaceholder.typicode.com",
  headers: { "Authorization": "Bearer token123" },
});

// Fully typed API calls:
// const users = await api.get<User[]>("/users");
// const newUser = await api.post<User, Omit<User, "id">>("/users", {
//   name: "Alice", email: "alice@example.com"
// });


// -----------------------------------------------------------------------------
//  SECTION 7 — AXIOS WITH TYPESCRIPT
// -----------------------------------------------------------------------------

// Axios is a popular HTTP client with BUILT-IN TypeScript support.
//
// INSTALL:
// npm install axios
//
// BASIC USAGE:
// import axios from "axios";
// import type { AxiosError, AxiosResponse } from "axios";
//
// // Generic GET:
// const response = await axios.get<User[]>("/api/users");
// // response.data is User[] — typed!
//
// // Generic POST:
// const created = await axios.post<User>("/api/users", {
//   name: "Alice",
//   email: "alice@example.com",
// });
//
// // Error handling with Axios:
// try {
//   const data = await axios.get<User[]>("/api/users");
// } catch (error) {
//   if (axios.isAxiosError(error)) {
//     // Narrowed to AxiosError — has .response, .status, .config
//     console.log("Status:", error.response?.status);
//     console.log("Message:", error.message);
//   } else {
//     console.log("Unknown error:", error);
//   }
// }
//
// IMPORTANT: isAxiosError() is the correct way to narrow.
// DON'T do: catch (e: AxiosError) — catch variables can only be unknown or any.
//
// GENERIC AXIOS WRAPPER:
// async function fetchData<T>(url: string): Promise<T | null> {
//   try {
//     const { data } = await axios.get<T>(url);
//     return data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios Error:", error.message);
//     }
//     return null;
//   }
// }


// -----------------------------------------------------------------------------
//  SECTION 8 — AbortController (CANCELLABLE REQUESTS)
// -----------------------------------------------------------------------------

// AbortController lets you CANCEL ongoing fetch requests.
// Useful for: search-as-you-type, component unmounts, timeouts.

async function fetchWithAbort<T>(
  url: string,
  signal: AbortSignal
): Promise<T | null> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request was cancelled");
      return null;
    }
    throw error; // re-throw non-abort errors
  }
}

// Usage:
const controller = new AbortController();

// Start the request:
const promise = fetchWithAbort<User[]>("/api/users", controller.signal);

// Cancel it if needed:
// controller.abort();

// SEARCH PATTERN — cancel previous request before starting new one:
let currentController: AbortController | null = null;

async function search(query: string): Promise<User[]> {
  // Cancel previous request:
  currentController?.abort();

  // Create new controller for this request:
  currentController = new AbortController();

  const result = await fetchWithAbort<User[]>(
    `/api/search?q=${query}`,
    currentController.signal
  );

  return result ?? [];
}


// -----------------------------------------------------------------------------
//  SECTION 9 — RETRY PATTERNS
// -----------------------------------------------------------------------------

// Automatically retry failed requests with exponential backoff:

async function fetchWithRetry<T>(
  url: string,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchJSON<T>(url);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const backoff = delayMs * Math.pow(2, attempt); // exponential backoff
        console.log(`Retry ${attempt + 1}/${maxRetries} in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError ?? new Error("All retries failed");
}

// Usage:
// const users = await fetchWithRetry<User[]>("/api/users", 3, 1000);
// Tries up to 4 times (initial + 3 retries) with 1s, 2s, 4s delays.


// -----------------------------------------------------------------------------
//  SECTION 10 — REAL-WORLD ASYNC PATTERNS
// -----------------------------------------------------------------------------

// PATTERN 1: Parallel with error handling
async function loadPageData() {
  const results = await Promise.allSettled([
    fetchJSON<User>("/api/user"),
    fetchJSON<{ title: string }[]>("/api/posts"),
    fetchJSON<{ count: number }>("/api/notifications"),
  ]);

  const user = results[0].status === "fulfilled" ? results[0].value : null;
  const posts = results[1].status === "fulfilled" ? results[1].value : [];
  const notifications = results[2].status === "fulfilled" ? results[2].value : { count: 0 };

  return { user, posts, notifications };
}

// PATTERN 2: Sequential dependent requests
async function getUserPosts(userId: number) {
  const user = await fetchJSON<User>(`/api/users/${userId}`);
  const posts = await fetchJSON<{ id: number; title: string }[]>(
    `/api/users/${user.id}/posts`
  );
  return { user, posts };
}

// PATTERN 3: Batching requests
async function fetchInBatches<T>(
  urls: string[],
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(url => fetchJSON<T>(url))
    );
    results.push(...batchResults);
  }

  return results;
}


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  CONCEPT                    SYNTAX / TYPE
//  -------------------------  -------------------------------------------
//  Typed Promise              Promise<User>
//  async function             async function fn(): Promise<T>
//  await                      const data = await promise (unwraps)
//  fetch typed                response.json() as Promise<T>
//  Generic fetch              async function get<T>(url): Promise<T>
//  Promise.all                Promise.all([p1, p2]) — fails on first error
//  Promise.allSettled         Promise.allSettled([p1, p2]) — never fails
//  Promise.race               Promise.race([p1, timeout])
//  AbortController            new AbortController() + fetch({signal})
//  Result type                { ok: true; data: T } | { ok: false; error: E }


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: What is the return type of an async function?
//  A: Always Promise<T>. Even if you return a plain value, async wraps
//     it in a Promise. `async function f(): Promise<number>`.
//
//  Q2: How do you type fetch responses in TypeScript?
//  A: response.json() returns Promise<any>. You must provide the type:
//     `response.json() as Promise<User[]>` or assign to a typed variable.
//
//  Q3: What is the difference between Promise.all and Promise.allSettled?
//  A: Promise.all fails immediately if ANY promise rejects.
//     Promise.allSettled waits for ALL promises and returns each result
//     as { status: "fulfilled", value } or { status: "rejected", reason }.
//
//  Q4: How do you cancel a fetch request?
//  A: Use AbortController. Create a controller, pass its signal to fetch,
//     and call controller.abort() to cancel. The fetch throws an AbortError.
//
//  Q5: What is the Result pattern?
//  A: A discriminated union type { ok: true; data: T } | { ok: false; error: E }
//     that replaces try/catch with explicit success/error handling.
//     The caller uses if/else instead of try/catch.
//
//  Q6: How do you handle errors in async TypeScript?
//  A: try/catch with `catch (error: unknown)` — narrow using instanceof Error.
//     Or use the Result pattern for explicit error handling without try/catch.


console.log("-- 14_async_typescript.ts executed successfully --");
