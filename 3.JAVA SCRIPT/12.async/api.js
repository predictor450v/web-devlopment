// ============================================================
// APIs & FETCH — Complete Documentation & Study Guide
// ============================================================
// API = Application Programming Interface
// A way for two systems to TALK to each other.
//
// Real world analogy:
//   You (client) go to a restaurant (server).
//   You don't go into the kitchen yourself.
//   You talk to a WAITER (API) — give your order (request),
//   waiter goes to kitchen, brings back food (response).
//
// On the web:
//   Your browser (client) wants data from a server.
//   It sends an HTTP REQUEST to an API endpoint (URL).
//   The server processes it and sends back an HTTP RESPONSE.
//   Data is usually formatted as JSON.
//
// WHY APIs exist:
//   - Separate frontend from backend
//   - Let different apps share data (login with Google, pay with Stripe)
//   - Hide database complexity behind a clean interface


// ============================================================
// SECTION 1: HOW THE WEB WORKS — REQUEST & RESPONSE CYCLE
// ============================================================
// Every API call follows this cycle:
//
//   CLIENT                          SERVER
//     |                               |
//     |  ── HTTP REQUEST ──────────►  |
//     |    Method: GET                |
//     |    URL: /api/users/1          |
//     |    Headers: { ... }           |
//     |    Body: { ... } (optional)   |
//     |                               |
//     |  ◄─────── HTTP RESPONSE ───── |
//     |    Status: 200 OK             |
//     |    Headers: { ... }           |
//     |    Body: { "name": "Ayush" }  |
//
// HTTP METHODS — what you want to DO:
//   GET    — READ data (no body sent)
//   POST   — CREATE new data (body contains new item)
//   PUT    — UPDATE entire item (body contains full updated item)
//   PATCH  — UPDATE part of item (body contains only changed fields)
//   DELETE — DELETE data (no body usually)
//
// HTTP STATUS CODES — what happened:
//   2xx SUCCESS:
//     200 OK           — request succeeded
//     201 Created      — new resource was created (POST success)
//     204 No Content   — success but nothing to return (DELETE success)
//   3xx REDIRECT:
//     301 Moved Permanently — URL has changed forever
//     304 Not Modified      — use cached version
//   4xx CLIENT ERRORS (your mistake):
//     400 Bad Request  — malformed request / invalid data sent
//     401 Unauthorized — not logged in / no auth token
//     403 Forbidden    — logged in but no permission
//     404 Not Found    — resource doesn't exist
//     429 Too Many Requests — rate limited
//   5xx SERVER ERRORS (their mistake):
//     500 Internal Server Error — server crashed
//     503 Service Unavailable  — server down/overloaded


// ============================================================
// SECTION 2: JSON — the language of APIs
// ============================================================
// JSON = JavaScript Object Notation
// APIs send and receive data as JSON strings — text that looks
// like a JS object but is NOT a JS object. It must be PARSED.
//
// Two operations:
//   JSON.parse(string)     — convert JSON string → JS object  (receiving data)
//   JSON.stringify(object) — convert JS object → JSON string  (sending data)

// JSON string (what the server sends — it's just text)
const jsonString = '{"name":"Ayush","age":21,"skills":["JS","React"]}';
console.log(typeof jsonString); // "string"

// Parse: string → JS object (now you can use dot notation)
const jsObject = JSON.parse(jsonString);
console.log(jsObject.name);      // "Ayush"
console.log(jsObject.skills[0]); // "JS"
console.log(typeof jsObject);    // "object"

// Stringify: JS object → string (to send to server)
const user = { name: "Ayush", age: 21 };
const toSend = JSON.stringify(user);
console.log(toSend);        // '{"name":"Ayush","age":21}'
console.log(typeof toSend); // "string"

// Pretty print (for readability/debugging)
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "Ayush",
//   "age": 21
// }

// JSON rules (differences from JS objects):
//   Keys MUST be in double quotes: {"name": ...}  (not {name: ...})
//   Values can be: string, number, boolean, null, array, object
//   Values CANNOT be: undefined, function, Symbol, Date object
//   No trailing commas
//   No comments


// ============================================================
// SECTION 3: XMLHttpRequest — the OLD way (still in interviews)
// ============================================================
// Before fetch() existed, XMLHttpRequest (XHR) was the only way
// to make API calls in JS. Still seen in older codebases.
// Understanding it helps you appreciate why fetch() was created.

const xhr = new XMLHttpRequest();

// Step 1: open(method, url, async)
// async = true means non-blocking (almost always true)
xhr.open("GET", "https://jsonplaceholder.typicode.com/users/1", true);

// Step 2: set up the onreadystatechange handler
// readyState goes through 5 stages: 0, 1, 2, 3, 4
// 0 = UNSENT, 1 = OPENED, 2 = HEADERS_RECEIVED, 3 = LOADING, 4 = DONE
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {            // 4 = request is complete
        if (xhr.status === 200) {          // 200 = success
            const data = JSON.parse(xhr.responseText); // parse the string
            console.log("Name:", data.name);
            console.log("Email:", data.email);
        } else {
            console.log("Error:", xhr.status);
        }
    }
};

// Step 3: send the request
xhr.send();

// Problems with XHR:
//   - Verbose and hard to read
//   - Uses callbacks → callback hell for multiple requests
//   - Error handling is clunky
//   - No built-in Promise support
// → All solved by fetch()


// ============================================================
// SECTION 4: PROMISES — understanding async JS
// ============================================================
// Before fetch, you need to understand PROMISES.
// A Promise represents a value that isn't available YET
// but will be in the future (or will fail).
//
// A Promise is in one of 3 states:
//   PENDING   — async operation still in progress
//   FULFILLED — operation succeeded, value is available
//   REJECTED  — operation failed, error is available
//
// Once settled (fulfilled or rejected), it NEVER changes state.

// Creating a Promise
const myPromise = new Promise(function(resolve, reject) {
    // Do async work here
    const success = true;

    if (success) {
        resolve("Operation worked!"); // fulfills the promise with this value
    } else {
        reject("Something went wrong"); // rejects with this error
    }
});

// Consuming a Promise with .then() and .catch()
myPromise
    .then(function(value) {
        // runs if promise was RESOLVED
        console.log("Success:", value); // "Operation worked!"
        return value.toUpperCase();    // can return a new value — chains to next .then
    })
    .then(function(upperValue) {
        console.log("Chained:", upperValue); // "OPERATION WORKED!"
    })
    .catch(function(error) {
        // runs if promise was REJECTED (at any point in the chain)
        console.log("Error:", error);
    })
    .finally(function() {
        // runs ALWAYS — whether resolved or rejected
        // great for hiding loading spinners
        console.log("Done — hide loading spinner");
    });

// Simulating async with setTimeout
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "Ayush" }); // success after 1s
            } else {
                reject(new Error("Invalid user ID")); // fail after 1s
            }
        }, 1000);
    });
}

fetchUserData(1)
    .then(user => console.log("Got user:", user.name)) // "Ayush"
    .catch(err => console.log("Failed:", err.message));


// ============================================================
// SECTION 5: fetch() — THE MODERN WAY
// ============================================================
// fetch() is the built-in modern API for HTTP requests.
// It returns a PROMISE — so you use .then() or async/await.
//
// CRITICAL: fetch() only rejects on NETWORK failure (no internet, DNS error).
// A 404 or 500 response is NOT treated as an error by fetch — you must check!
//
// Two-step process:
//   Step 1: fetch(url) → Promise resolves with a Response object
//   Step 2: response.json() → Promise resolves with the parsed JS object

// Basic GET request
fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(function(response) {
        // response is a Response OBJECT — not the data yet!
        console.log(response.status);     // 200
        console.log(response.ok);         // true (ok = status 200-299)
        console.log(response.statusText); // "OK"
        console.log(response.url);        // the URL that was fetched
        console.log(response.headers);    // Headers object

        // response.json() reads the body and parses it — returns another Promise
        return response.json();
    })
    .then(function(data) {
        // NOW we have the actual JS object
        console.log(data.name);    // "Leanne Graham"
        console.log(data.email);   // "Sincere@april.biz"
        console.log(data.address); // { street: "...", city: "..." }
    })
    .catch(function(error) {
        // Only runs on NETWORK errors (no internet, CORS, DNS failure)
        // Does NOT run on 404 or 500 — you must check response.ok manually
        console.log("Network error:", error.message);
    });

// ── THE fetch() GOTCHA — 404 is NOT an error! ─────────────
fetch("https://jsonplaceholder.typicode.com/users/9999") // doesn't exist
    .then(response => {
        console.log(response.status); // 404
        console.log(response.ok);     // FALSE — but fetch doesn't reject!

        // You MUST manually check response.ok and throw if needed
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(err => console.log("Caught:", err.message)); // "HTTP Error: 404"


// ============================================================
// SECTION 6: async/await — cleanest syntax for API calls
// ============================================================
// async/await is syntactic sugar over Promises.
// Makes async code LOOK like synchronous code — easier to read.
//
// Rules:
//   async before function = that function always returns a Promise
//   await before Promise  = pause HERE until Promise resolves
//   await can ONLY be used inside an async function
//   Wrap in try/catch for error handling (replaces .catch())

// Basic async/await GET
async function getUser(userId) {
    try {
        // await pauses execution here until fetch resolves
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );

        // Always check response.ok before parsing
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // await again to parse the JSON body
        const user = await response.json();

        console.log("Name:",    user.name);
        console.log("Email:",   user.email);
        console.log("Company:", user.company.name);

        return user; // async functions always return a Promise
                     // so: getUser(1) returns Promise<user>

    } catch (error) {
        // catches BOTH network errors AND our manually thrown errors
        console.log("Error:", error.message);
    }
}

getUser(1); // call it — returns a Promise

// ── Multiple API calls in sequence (one after another) ─────
async function getUserAndPosts(userId) {
    try {
        // Call 1: get user
        const userRes = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        const user = await userRes.json();

        // Call 2: get that user's posts (uses data from call 1)
        const postsRes = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const posts = await postsRes.json();

        console.log(`${user.name} has ${posts.length} posts`);
        return { user, posts };

    } catch (err) {
        console.log("Error:", err.message);
    }
}

// ── Multiple API calls in PARALLEL (faster!) ───────────────
// Sequential: call1 finishes → call2 starts → call3 starts  (slow)
// Parallel:   all 3 start at same time → wait for all       (fast)
// Use Promise.all() for parallel calls

async function getMultipleUsers() {
    try {
        // All 3 fetch calls start SIMULTANEOUSLY
        const [user1, user2, user3] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json()),
            fetch("https://jsonplaceholder.typicode.com/users/2").then(r => r.json()),
            fetch("https://jsonplaceholder.typicode.com/users/3").then(r => r.json()),
        ]);
        // Resolves when ALL three complete
        // If ANY one fails → entire Promise.all rejects

        console.log(user1.name, user2.name, user3.name);

    } catch (err) {
        console.log("One of the calls failed:", err.message);
    }
}

// Promise.allSettled — get results even if some fail
async function getWithPartialFailure() {
    const results = await Promise.allSettled([
        fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json()),
        fetch("https://invalid-url-that-fails.com/data"),       // this will fail
        fetch("https://jsonplaceholder.typicode.com/users/3").then(r => r.json()),
    ]);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`Call ${index + 1} succeeded:`, result.value);
        } else {
            console.log(`Call ${index + 1} failed:`, result.reason.message);
        }
    });
    // Unlike Promise.all, this NEVER rejects — always gives all results
}


// ============================================================
// SECTION 7: POST, PUT, PATCH, DELETE requests
// ============================================================
// GET is the default. For other methods, pass a config object
// as the second argument to fetch().

// ── POST — create new data ─────────────────────────────────
async function createPost() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",                         // specify method
                headers: {
                    "Content-Type": "application/json", // tell server what format
                    "Authorization": "Bearer mytoken123" // auth token if needed
                },
                body: JSON.stringify({                  // must stringify the object!
                    title:  "My new post",
                    body:   "This is the content",
                    userId: 1
                })
            }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const newPost = await response.json();
        console.log("Created post with ID:", newPost.id); // 101
        console.log("Title:", newPost.title);

    } catch (err) {
        console.log("Failed to create:", err.message);
    }
}
createPost();

// ── PUT — replace entire resource ─────────────────────────
async function updatePost(postId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id:     postId,
                title:  "Updated Title",   // must send ALL fields
                body:   "Updated content",
                userId: 1
            })
        }
    );
    const updated = await response.json();
    console.log("Updated:", updated.title);
}

// ── PATCH — update only specific fields ───────────────────
async function patchPost(postId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Only title changed" // only send fields that changed
                // body and userId stay the same — server keeps existing values
            })
        }
    );
    const patched = await response.json();
    console.log("Patched title:", patched.title);
}

// ── DELETE — remove a resource ─────────────────────────────
async function deletePost(postId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            method: "DELETE"
            // no body needed for DELETE usually
        }
    );
    // 204 No Content = successful delete, empty body
    if (response.ok) {
        console.log(`Post ${postId} deleted. Status: ${response.status}`);
    }
}
deletePost(1);


// ============================================================
// SECTION 8: HEADERS — sending and reading metadata
// ============================================================
// Headers carry metadata about the request/response.
// Common request headers you'll send:

async function requestWithHeaders() {
    const response = await fetch("https://api.example.com/data", {
        method: "GET",
        headers: {
            // Tell server what format you're sending
            "Content-Type": "application/json",

            // Tell server what format you can receive
            "Accept": "application/json",

            // Authentication — two common formats:
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9...", // JWT token
            // "Authorization": "Basic dXNlcjpwYXNz",          // username:password base64

            // Custom headers your API might require
            "X-API-Key": "your-api-key-here",
            "X-Request-ID": "unique-request-id"
        }
    });

    // Reading response headers
    console.log(response.headers.get("Content-Type"));   // "application/json"
    console.log(response.headers.get("X-Rate-Limit-Remaining")); // "95"

    const data = await response.json();
    return data;
}


// ============================================================
// SECTION 9: ERROR HANDLING PATTERNS
// ============================================================
// Production-grade error handling — covers all failure scenarios

// ── Reusable fetch wrapper (used in real projects) ─────────
async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers  // merge any extra headers passed in
            },
            ...options              // merge method, body etc.
        });

        // Handle specific status codes
        if (response.status === 401) {
            // Not authenticated — redirect to login
            window.location.href = "/login";
            return;
        }
        if (response.status === 403) {
            throw new Error("You don't have permission to do that");
        }
        if (response.status === 404) {
            throw new Error("Resource not found");
        }
        if (response.status === 429) {
            throw new Error("Too many requests — please slow down");
        }
        if (!response.ok) {
            throw new Error(`Unexpected error: ${response.status}`);
        }

        // 204 No Content — successful but no body (DELETE responses)
        if (response.status === 204) return null;

        return await response.json();

    } catch (error) {
        // Network error (no internet, DNS, CORS)
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Network error — check your internet connection");
        }
        throw error; // re-throw so the caller can handle it too
    }
}

// Using the wrapper
async function loadDashboard() {
    try {
        const user  = await apiFetch("/api/user/profile");
        const posts = await apiFetch("/api/posts?limit=10");
        console.log(user.name, posts.length);
    } catch (err) {
        console.error("Dashboard failed to load:", err.message);
        showErrorMessage(err.message); // show in UI
    }
}

// ── Timeout — cancel request if too slow ──────────────────
// fetch doesn't have a built-in timeout. Use AbortController.
async function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController(); // creates controller + signal

    // Auto-cancel after timeoutMs
    const timeoutId = setTimeout(() => {
        controller.abort(); // sends abort signal to fetch
    }, timeoutMs);

    try {
        const response = await fetch(url, {
            signal: controller.signal // attach signal to fetch
        });
        clearTimeout(timeoutId); // cancel the timeout if request succeeded

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();

    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw err;
    }
}

// ── Retry logic — automatically retry on failure ───────────
async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt} of ${maxRetries}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();

        } catch (err) {
            if (attempt === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts: ${err.message}`);
            }
            // Wait before retrying (exponential backoff: 1s, 2s, 4s)
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
            console.log(`Retrying in ${delay * attempt}ms...`);
        }
    }
}


// ============================================================
// SECTION 10: REAL WORLD — COMPLETE API INTEGRATION EXAMPLE
// ============================================================
// A complete pattern used in real projects:
// Loading state → fetch → render data → handle errors

// State management
const state = {
    users:   [],
    loading: false,
    error:   null
};

// DOM references
const userList    = document.getElementById("user-list");
const loader      = document.getElementById("loader");
const errorBox    = document.getElementById("error-box");
const searchInput = document.getElementById("search");

// Show/hide UI states
function setLoading(isLoading) {
    state.loading = isLoading;
    loader.style.display  = isLoading ? "block" : "none";
    userList.style.opacity = isLoading ? "0.5" : "1";
}

function showError(message) {
    state.error = message;
    errorBox.textContent  = message;
    errorBox.style.display = "block";
    setTimeout(() => { errorBox.style.display = "none"; }, 4000);
}

function renderUsers(users) {
    userList.innerHTML = ""; // clear existing

    if (users.length === 0) {
        userList.innerHTML = "<p>No users found</p>";
        return;
    }

    users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.address.city}</p>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
        `;
        userList.appendChild(card);
    });
}

// Fetch all users
async function loadUsers() {
    setLoading(true);
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);

        state.users = await response.json();
        renderUsers(state.users);

    } catch (err) {
        showError("Failed to load users: " + err.message);
    } finally {
        setLoading(false); // always runs — hides loader
    }
}

// Create a new user
async function createUser(userData) {
    setLoading(true);
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users",
            {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(userData)
            }
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const newUser = await response.json();
        state.users.push(newUser);      // add to local state
        renderUsers(state.users);        // re-render
        console.log("Created:", newUser.id);

    } catch (err) {
        showError("Failed to create user: " + err.message);
    } finally {
        setLoading(false);
    }
}

// Delete a user (event delegation on the list)
userList.addEventListener("click", async function(e) {
    if (!e.target.classList.contains("delete-btn")) return;

    const userId = e.target.dataset.id; // from data-id attribute

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`,
            { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Delete failed");

        // Remove from local state
        state.users = state.users.filter(u => u.id !== parseInt(userId));
        renderUsers(state.users);

    } catch (err) {
        showError("Failed to delete: " + err.message);
    }
});

// Client-side search (filter already loaded data)
searchInput.addEventListener("input", function(e) {
    const query = e.target.value.toLowerCase().trim();
    const filtered = state.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    renderUsers(filtered);
});

// Initial load
loadUsers();


// ============================================================
// SECTION 11: COMMON INTERVIEW QUESTIONS ON APIs
// ============================================================

// Q1: What is the difference between fetch and XMLHttpRequest?
// XHR is callback-based, verbose, older.
// fetch is Promise-based, cleaner syntax, modern standard.
// fetch doesn't reject on 4xx/5xx — you must check response.ok.

// Q2: Why does fetch need two awaits?
// First await: wait for the HTTP response headers to arrive (Response object)
// Second await: wait for the response BODY to be read and parsed (actual data)
// The body is a stream — it arrives separately after the headers.

// Q3: What is CORS?
// Cross-Origin Resource Sharing — a browser security rule.
// Browser blocks JS from fetching data from a DIFFERENT domain
// unless that server explicitly allows it via response headers:
//   Access-Control-Allow-Origin: https://yoursite.com
// CORS is enforced by the BROWSER — not the server itself.
// Server-to-server requests have no CORS restrictions.

// Q4: What is the difference between PUT and PATCH?
// PUT    — replace the ENTIRE resource with what you send
// PATCH  — update ONLY the fields you send, keep others unchanged

// Q5: Promise.all vs Promise.allSettled?
// Promise.all         — rejects immediately if ANY promise fails
// Promise.allSettled  — waits for ALL promises, gives results for each
//                       (success or failure), never rejects

// Q6: How do you cancel a fetch request?
// Use AbortController:
//   const controller = new AbortController();
//   fetch(url, { signal: controller.signal });
//   controller.abort(); // cancels the request

// Q7: What is async/await? Is it different from Promises?
// async/await is syntactic sugar OVER Promises.
// Under the hood it's still Promises.
// async functions always return a Promise.
// await pauses execution inside the async function (not the whole program).

// Q8: What happens if you don't await a Promise?
async function example() {
    const result = fetch("https://api.example.com/data"); // missing await
    console.log(result); // Promise { <pending> } — not the data!
    // You get the Promise OBJECT, not its resolved value
}

// Q9: What is the event loop? Why can't JS do two things at once?
// JS is SINGLE THREADED — one call stack, one thing at a time.
// fetch/setTimeout are Web APIs — browser runs them outside JS thread.
// When done, their callbacks go to the task queue.
// Event loop: when call stack is empty → pull next task from queue.
// This is why setTimeout(fn, 0) runs AFTER synchronous code.

// Q10: How do you handle errors in async/await?
// Use try/catch (wraps the await calls)
// The catch block receives any rejection from any await in the try block.
// Use finally for cleanup (hiding loaders) — runs always.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// BASIC FETCH (GET):
//   const res  = await fetch(url);
//   if (!res.ok) throw new Error(res.status);
//   const data = await res.json();
//
// POST/PUT/PATCH:
//   await fetch(url, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(data)
//   });
//
// DELETE:
//   await fetch(url, { method: "DELETE" });
//
// PARALLEL:
//   const [a, b] = await Promise.all([fetch(url1), fetch(url2)]);
//
// TIMEOUT:
//   const controller = new AbortController();
//   setTimeout(() => controller.abort(), 5000);
//   fetch(url, { signal: controller.signal });
//
// JSON:
//   JSON.parse(string)      → JS object  (receiving)
//   JSON.stringify(object)  → string     (sending)
//
// STATUS CODES:
//   200 OK | 201 Created | 204 No Content
//   400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found
//   500 Server Error | 503 Unavailable
//
// GOLDEN RULES:
// 1. Always check response.ok — fetch doesn't throw on 404/500
// 2. Always JSON.stringify() when sending data in body
// 3. Always set Content-Type header when sending JSON
// 4. Use try/catch/finally — finally always runs (hide loaders there)
// 5. Promise.all for parallel calls — much faster than sequential
// 6. Use AbortController for timeouts — fetch has no built-in timeout
// 7. async functions ALWAYS return a Promise — even if you return a plain value
// 8. Two awaits needed — one for response, one for body parsing
// 9. CORS is a BROWSER security rule — not server-to-server
// 10. Store data in state object — re-render from state, not from DOM