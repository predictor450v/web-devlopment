/**
 * File: api-typescript-advanced.ts
 *
 * Covers:
 * - Installing Axios & types
 * - Fetching data with types
 * - Safe Axios error handling
 * - import type syntax
 * - Generics for reusable API logic
 * - Clean architecture patterns
 *
 * Run:
 * npx ts-node api-typescript-advanced.ts
 */

// ======================================================
// 0. INSTALLATION (RUN IN TERMINAL)
// ======================================================

/**
 * npm install axios
 */

export {};
// ======================================================
// 1. IMPORTS
// ======================================================

import axios from "axios";
import type { AxiosError } from "axios";

/**
 * import type:
 * - Only used for types
 * - Removed at runtime
 */


// ======================================================
// 2. DATA MODELS
// ======================================================

type User = {
  id: number;
  name: string;
  email: string;
};

type ApiResponse<T> = {
  data: T;
  success: boolean;
};


// ======================================================
// 3. BASIC FETCH WITH TYPES
// ======================================================

async function fetchUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  return response.data;
}


// ======================================================
// 4. SAFE AXIOS ERROR HANDLING
// ======================================================

async function safeFetchUsers(): Promise<User[] | null> {
  try {
    const res = await axios.get<User[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    return res.data;
  } catch (error) {
    /**
     * Proper type narrowing
     */
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error("Axios Error:", err.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return null;
  }
}


// ======================================================
// 5. GENERIC FETCH FUNCTION (VERY IMPORTANT)
// ======================================================

/**
 * Reusable API function using generics
 */
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const res = await axios.get<T>(url);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return null;
  }
}


// ======================================================
// 6. USING GENERIC FUNCTION
// ======================================================

async function runExample() {
  const users = await fetchData<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (!users) {
    console.log("No data received");
    return;
  }

  users.forEach((user) => {
    console.log(user.name, user.email);
  });
}


// ======================================================
// 7. MULTIPLE GENERIC TYPES
// ======================================================

/**
 * Simulating API wrapper
 */
async function postData<T, U>(url: string, payload: T): Promise<U | null> {
  try {
    const res = await axios.post<U>(url, payload);
    return res.data;
  } catch (error) {
    console.error("Post failed");
    return null;
  }
}


// ======================================================
// 8. TYPE-SAFE CONFIG OBJECT (REAL-WORLD)
// ======================================================

type RequestConfig = {
  method: "GET" | "POST";
  url: string;
};

function makeRequest(config: RequestConfig) {
  console.log(`Making ${config.method} request to ${config.url}`);
}


// ======================================================
// 9. INDEX SIGNATURE (DYNAMIC DATA)
// ======================================================

type StringMap = {
  [key: string]: string;
};

const headers: StringMap = {
  Authorization: "Bearer token",
  "Content-Type": "application/json",
};


// ======================================================
// 10. TYPE DECLARATION (.d.ts CONCEPT)
// ======================================================

/**
 * Example (not executable here):
 *
 * declare module "my-lib" {
 *   export function greet(name: string): string;
 * }
 *
 * Used for:
 * - External JS libraries without types
 */


// ======================================================
// 11. INTERVIEW TRAPS & INSIGHTS
// ======================================================

/**
 * ❌ Wrong:
 * catch (e: AxiosError)
 *
 * ✔ Correct:
 * Use axios.isAxiosError(e)
 */


/**
 * Generics:
 * - Makes functions reusable
 * - Preserves type safety
 */


/**
 * import type:
 * - Avoids unnecessary JS output
 */


// ======================================================
// EXECUTION
// ======================================================

runExample().then(() => {
  console.log("✅ Execution complete");
});