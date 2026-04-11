// ============================================================
// FETCH API — Complete Deep Dive Study Guide
// ============================================================
// fetch() is the modern browser built-in function for making
// HTTP requests. It replaced XMLHttpRequest (XHR) and is
// built on top of Promises.
//
// Before fetch existed:
//   XMLHttpRequest — verbose, callback-based, hard to read
//   jQuery $.ajax  — cleaner but required a whole library
//   fetch()        — built-in, Promise-based, clean syntax ✓
//
// The Golden Rule of fetch():
//   fetch() ONLY rejects on NETWORK failure.
//   A 404, 500, or any HTTP error is NOT a rejection.
//   You MUST check response.ok manually — always.


// ============================================================
// SECTION 1: HOW fetch() WORKS INTERNALLY
// ============================================================
// fetch() is a two-step process — this is why you need two awaits.
//
// Step 1: Browser sends request → server responds with HEADERS first
//         fetch() resolves with a Response OBJECT (not the data yet!)
//         This is like receiving the envelope — not the letter inside
//
// Step 2: You call response.json() / response.text() to READ the BODY
//         The body arrives as a STREAM — it takes time to fully arrive
//         response.json() reads the stream and parses it → resolves with data
//
// Visual:
//   fetch(url)
//      │
//      ▼ (headers arrive)
//   Response Object  ← you get THIS first
//      │
//      ▼ .json() reads the body stream
//   Actual Data      ← you get THIS second
//
// This is why two awaits are ALWAYS needed:
//   const response = await fetch(url);    // wait for headers + Response object
//   const data     = await response.json(); // wait for body to be read

// Proof that response is NOT the data:
async function showTwoSteps() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    console.log(typeof response);       // "object" — it's a Response object
    console.log(response instanceof Response); // true
    console.log(response.status);       // 200
    console.log(response.ok);           // true
    console.log(response.url);          // the URL that was fetched
    console.log(response.headers);      // Headers object
    // response.name is undefined — it's NOT the user data yet!

    const data = await response.json(); // NOW read and parse the body
    console.log(typeof data);           // "object" — actual JS object
    console.log(data.name);             // "Leanne Graham" — actual user data!
}
showTwoSteps();


// ============================================================
// SECTION 2: THE RESPONSE OBJECT — every property explained
// ============================================================

async function exploreResponse() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    // ── Status information ──────────────────────────────────
    console.log(response.status);     // 200 — HTTP status code
    console.log(response.statusText); // "OK" — human readable status
    console.log(response.ok);
    // true if status is 200–299, false for everything else
    // THIS is what you check — not the status number directly

    // ── URL information ─────────────────────────────────────
    console.log(response.url);        // final URL (may differ if redirected)
    console.log(response.redirected); // true if response came via a redirect

    // ── Headers ─────────────────────────────────────────────
    console.log(response.headers.get("content-type"));
    // "application/json; charset=utf-8"
    console.log(response.headers.get("x-rate-limit-remaining"));
    // "95" — how many requests left

    // Iterate all headers
    response.headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
    });

    // ── Body reading methods (can only be called ONCE!) ─────
    // Each method returns a Promise. Can only read body ONCE.
    // After calling one, body is consumed — calling another throws.

    // response.json()     → parses body as JSON → JS object
    // response.text()     → reads body as plain string
    // response.blob()     → reads body as binary Blob (images, files)
    // response.arrayBuffer() → reads as raw binary ArrayBuffer
    // response.formData() → reads as FormData object

    const data = await response.json(); // body consumed here
    // await response.text() // ❌ TypeError: body already used

    // ── bodyUsed — check if body was already consumed ───────
    console.log(response.bodyUsed); // true — body was read above
}
exploreResponse();


// ============================================================
// SECTION 3: BASIC GET REQUEST — all patterns
// ============================================================

// ── Pattern 1: .then() chain ───────────────────────────────
fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        console.log("Name:", user.name);
        console.log("Email:", user.email);
    })
    .catch(error => {
        console.error("Failed:", error.message);
    });

// ── Pattern 2: async/await (cleaner, preferred) ────────────
async function getUser(id) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        // ALWAYS check response.ok before parsing
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const user = await response.json();
        console.log(user.name);
        return user;

    } catch (error) {
        // Catches: network errors + manually thrown HTTP errors
        console.error("getUser failed:", error.message);
        return null;
    }
}
getUser(1);

// ── GET with query parameters ───────────────────────────────
async function searchPosts(userId, limit = 5) {
    // Build URL with query params
    const url = new URL("https://jsonplaceholder.typicode.com/posts");
    url.searchParams.append("userId", userId);
    url.searchParams.append("_limit", limit);
    // url is now: https://...typicode.com/posts?userId=1&_limit=5

    const response = await fetch(url);
    const posts    = await response.json();
    console.log(`Found ${posts.length} posts`);
    return posts;
}
searchPosts(1, 3);

// Using URLSearchParams directly
const param = new URLSearchParams({
    userId: 1,
    _sort:  "id",
    _order: "desc"
});
fetch(`https://jsonplaceholder.typicode.com/posts?${param}`)
    .then(r => r.json())
    .then(posts => console.log(posts));


// ============================================================
// SECTION 4: POST REQUEST — sending data to server
// ============================================================
// POST = create a new resource on the server.
// Must send: method, headers (Content-Type), body (JSON stringified)

async function createPost(postData) {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",

                headers: {
                    // Tell the server what format you're sending
                    "Content-Type": "application/json",

                    // Tell the server what format you want back
                    "Accept": "application/json",
                },

                // MUST JSON.stringify() — fetch doesn't do this automatically
                body: JSON.stringify(postData)
            }
        );

        if (!response.ok) {
            // Try to get error details from response body
            const errorBody = await response.json().catch(() => null);
            throw new Error(
                errorBody?.message || `HTTP ${response.status}`
            );
        }

        const created = await response.json();
        console.log("Created with ID:", created.id); // 101
        return created;

    } catch (error) {
        console.error("Create failed:", error.message);
        throw error; // re-throw so caller knows it failed
    }
}

createPost({
    title:  "Learning Fetch API",
    body:   "It is really powerful",
    userId: 1
});

// ── What happens if you forget JSON.stringify? ─────────────
// body: { title: "test" }
// fetch sends: [object Object]  ← string representation of object
// Server receives garbage, usually returns 400 Bad Request
// ALWAYS: body: JSON.stringify(yourData)


// ============================================================
// SECTION 5: PUT and PATCH — updating data
// ============================================================

// ── PUT — replace the ENTIRE resource ──────────────────────
// Send ALL fields — even unchanged ones.
// Server replaces the whole document with what you send.
async function updatePost(id, fullPostData) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id:     id,
                title:  fullPostData.title,  // must send ALL fields
                body:   fullPostData.body,
                userId: fullPostData.userId
            })
        }
    );
    if (!response.ok) throw new Error(`PUT failed: ${response.status}`);
    return response.json();
}

// ── PATCH — update ONLY specific fields ────────────────────
// Send ONLY the fields you want to change.
// Server merges your changes with existing data.
async function patchPost(id, changes) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes) // only the changed fields
        }
    );
    if (!response.ok) throw new Error(`PATCH failed: ${response.status}`);
    return response.json();
}

// Usage
updatePost(1, { title: "New Title", body: "New body", userId: 1 });
patchPost(1,  { title: "Only title changed" }); // body and userId stay same

// PUT vs PATCH — interview question:
// PUT:   "Replace the whole thing with this"
// PATCH: "Change only these specific fields"


// ============================================================
// SECTION 6: DELETE REQUEST
// ============================================================

async function deletePost(id) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
            method: "DELETE"
            // Usually no body or Content-Type needed for DELETE
        }
    );

    // 204 No Content = successful delete, empty body
    // 200 OK         = successful delete, may have body
    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }

    // 204 has no body — don't call response.json() or it will throw
    if (response.status === 204) {
        console.log(`Post ${id} deleted successfully`);
        return true;
    }

    return response.json(); // some APIs return deleted object
}

deletePost(1);


// ============================================================
// SECTION 7: HEADERS — sending and reading
// ============================================================
// Headers carry metadata about the request/response.
// Created with the Headers constructor or plain objects.

// ── Sending headers ─────────────────────────────────────────
async function authenticatedRequest(url) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(url, {
        headers: {
            // Content negotiation
            "Content-Type":  "application/json",
            "Accept":        "application/json",

            // Authentication
            "Authorization": `Bearer ${token}`,

            // Custom headers your API requires
            "X-API-Key":     "your-api-key",
            "X-Client-Version": "2.1.0",

            // Cache control
            "Cache-Control": "no-cache",
        }
    });

    return response.json();
}

// ── Using the Headers constructor ──────────────────────────
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer token123");
myHeaders.append("X-Custom", "value");

fetch("/api/data", { headers: myHeaders });

// Headers methods
const h = new Headers({ "content-type": "application/json" });
h.get("content-type");     // "application/json"
h.has("content-type");     // true
h.set("content-type", "text/plain"); // replace
h.append("x-custom", "1"); // add
h.delete("x-custom");      // remove

// ── Reading response headers ───────────────────────────────
async function readResponseHeaders(url) {
    const response = await fetch(url);

    // Read specific headers
    const contentType  = response.headers.get("content-type");
    const rateLimit    = response.headers.get("x-ratelimit-remaining");
    const cacheControl = response.headers.get("cache-control");

    console.log("Content type:", contentType);
    console.log("Rate limit remaining:", rateLimit);

    // Read ALL headers
    for (const [name, value] of response.headers) {
        console.log(`${name}: ${value}`);
    }
}


// ============================================================
// SECTION 8: ERROR HANDLING — production patterns
// ============================================================
// Three types of errors with fetch:
//   1. Network error     — no internet, DNS failure, CORS block
//                          fetch() REJECTS the Promise
//   2. HTTP error        — 4xx, 5xx responses
//                          fetch() RESOLVES but response.ok = false
//   3. Parsing error     — response isn't valid JSON
//                          response.json() REJECTS the Promise

// ── Handling all three error types ─────────────────────────
async function robustFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);

        // Handle HTTP errors (4xx, 5xx)
        if (!response.ok) {
            // Try to parse error details from response body
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.error || errorMessage;
            } catch {
                // Response body wasn't JSON — use status text
            }

            // Create a custom error with status code attached
            const error = new Error(errorMessage);
            error.status = response.status;
            error.response = response;
            throw error;
        }

        // Handle empty body (204 No Content)
        if (response.status === 204) return null;

        // Parse and return JSON body
        return await response.json();

    } catch (error) {
        // Network error — no internet, DNS failure, CORS
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new Error("Network error — check your internet connection");
        }
        throw error; // re-throw HTTP errors and parse errors
    }
}

// ── Handling specific status codes ──────────────────────────
async function smartFetch(url, options = {}) {
    const response = await fetch(url, options);

    switch (true) {
        case response.status === 200:
        case response.status === 201:
            return response.json();

        case response.status === 204:
            return null; // no content

        case response.status === 400:
            const badReqBody = await response.json();
            throw new Error(`Bad request: ${JSON.stringify(badReqBody.errors)}`);

        case response.status === 401:
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // redirect to login
            throw new Error("Session expired — please login again");

        case response.status === 403:
            throw new Error("You don't have permission to do this");

        case response.status === 404:
            throw new Error(`Resource not found at ${url}`);

        case response.status === 429:
            const retryAfter = response.headers.get("retry-after");
            throw new Error(`Rate limited — retry after ${retryAfter}s`);

        case response.status >= 500:
            throw new Error(`Server error ${response.status} — try again later`);

        default:
            throw new Error(`Unexpected status: ${response.status}`);
    }
}


// ============================================================
// SECTION 9: ABORTCONTROLLER — cancelling requests
// ============================================================
// fetch() has no built-in timeout or cancel mechanism.
// AbortController lets you cancel a fetch at any time.
// The controller creates a "signal" — attaching it to fetch
// lets you abort the fetch by calling controller.abort().

// ── Basic cancellation ──────────────────────────────────────
const controller = new AbortController();
const signal     = controller.signal;

fetch("https://jsonplaceholder.typicode.com/users", { signal })
    .then(res => res.json())
    .then(users => console.log(users))
    .catch(err => {
        if (err.name === "AbortError") {
            console.log("Fetch was cancelled"); // expected — not a real error
        } else {
            console.error("Real error:", err);
        }
    });

// Cancel after 2 seconds
setTimeout(() => {
    controller.abort();
    console.log("Aborted the fetch!");
}, 2000);

// ── Timeout using AbortController ──────────────────────────
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
    const controller = new AbortController();

    // Auto-cancel after timeoutMs
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId); // important — cancel timeout if request succeeded

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw error;
    }
}

// ── Cancel previous request on new input (live search) ─────
// Classic use case: user types in search box.
// Each keystroke starts a new request.
// Cancel the previous request before starting the new one.

let searchController = null;

async function liveSearch(query) {
    // Cancel the previous search if still running
    if (searchController) {
        searchController.abort();
    }

    // Create fresh controller for this search
    searchController = new AbortController();

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users?name_like=${query}`,
            { signal: searchController.signal }
        );
        const results = await response.json();
        renderSearchResults(results);

    } catch (error) {
        if (error.name !== "AbortError") {
            // Don't show error for expected cancellations
            showSearchError(error.message);
        }
    }
}

// Wire up to search input
document.getElementById("search").addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length >= 2) {
        liveSearch(query); // previous search auto-cancelled
    }
});


// ============================================================
// SECTION 10: SENDING DIFFERENT BODY TYPES
// ============================================================

// ── JSON (most common) ─────────────────────────────────────
fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Ayush", age: 21 })
});

// ── FormData — file uploads and form submissions ────────────
const formData = new FormData();
formData.append("username", "ayush");
formData.append("email",    "ayush@example.com");
formData.append("avatar",   fileInput.files[0]); // file upload!

fetch("/api/profile", {
    method: "POST",
    // DO NOT set Content-Type header for FormData!
    // Browser sets it automatically WITH the boundary string:
    // "multipart/form-data; boundary=----WebKitFormBoundary..."
    // Setting it manually breaks file uploads
    body: formData
});

// ── Reading FormData from HTML form ────────────────────────
const form = document.getElementById("profileForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const formData = new FormData(form); // auto-reads all form fields!

    try {
        const response = await fetch("/api/profile", {
            method: "POST",
            body: formData // browser handles Content-Type automatically
        });
        const result = await response.json();
        console.log("Profile updated:", result);
    } catch (err) {
        console.error("Upload failed:", err);
    }
});

// ── URLSearchParams — application/x-www-form-urlencoded ────
const params = new URLSearchParams();
params.append("grant_type", "password");
params.append("username", "ayush");
params.append("password", "secret");

fetch("/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
    // sends: grant_type=password&username=ayush&password=secret
});

// ── Plain text ─────────────────────────────────────────────
fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "User performed action XYZ at 14:32"
});

// ── Reading different response body types ──────────────────
// Image/file download
async function downloadFile(url) {
    const response = await fetch(url);
    const blob = await response.blob();          // binary data
    const objectUrl = URL.createObjectURL(blob); // create local URL
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "downloaded-file";
    link.click();
    URL.revokeObjectURL(objectUrl); // clean up memory
}

// Plain text response
async function getTextFile(url) {
    const response = await fetch(url);
    const text = await response.text(); // read as string
    console.log(text);
}


// ============================================================
// SECTION 11: CACHING AND CACHE CONTROL
// ============================================================
// fetch() supports the Cache API through the cache option.
// Controls how the browser cache interacts with the request.

// cache options:
//   "default"        — standard browser caching rules
//   "no-store"       — never cache, always fetch fresh (sensitive data)
//   "reload"         — fetch fresh, then update cache
//   "no-cache"       — check server if cache is fresh (conditional request)
//   "force-cache"    — use cache even if stale, only fetch if nothing cached
//   "only-if-cached" — only use cache, fail if not cached

// Always fresh — never use cached (for real-time data)
fetch("/api/live-prices", { cache: "no-store" });

// Check if cache is fresh — good for semi-static data
fetch("/api/config", { cache: "no-cache" });

// Use cache if available — good for static assets
fetch("/api/countries", { cache: "force-cache" });


// ============================================================
// SECTION 12: CORS — understanding the most confusing error
// ============================================================
// CORS = Cross-Origin Resource Sharing
// A BROWSER security mechanism — not a server thing.
// Browser blocks JS from reading responses from different origins.
//
// Origin = protocol + domain + port
//   https://mysite.com:443 — one origin
//   https://api.other.com  — different origin → CORS policy applies
//
// Server-to-server: no CORS restriction (only browser enforces it)
//
// How CORS works:
//   1. Browser sends request with Origin header
//   2. Server responds with Access-Control-Allow-Origin header
//   3. If header matches → browser allows JS to read response
//   4. If header missing/mismatch → browser BLOCKS the response
//      (request WAS sent and server DID respond — browser just hides it from JS)
//
// fetch() mode option:
//   "cors"        — default, expects CORS headers from server
//   "no-cors"     — sends request, you get opaque response (can't read it)
//   "same-origin" — fails immediately if different origin

// Simple request (no preflight):
//   Method: GET, POST, HEAD
//   Content-Type: text/plain, application/x-www-form-urlencoded, multipart/form-data
//   Browser sends directly, server's response determines if allowed

// Preflighted request (OPTIONS first):
//   Method: PUT, DELETE, PATCH
//   Content-Type: application/json
//   Custom headers: Authorization, X-API-Key
//   Browser sends OPTIONS preflight FIRST to check if allowed
//   Then sends actual request if server says ok

// You can't fix CORS from the frontend — the SERVER must send
// the correct headers. Common solutions:
//   1. Backend team adds: Access-Control-Allow-Origin: https://yoursite.com
//   2. Use a proxy server (your backend proxies the request)
//   3. Use CORS proxy for development only (never in production)

// Detecting CORS error:
fetch("https://api.someservice.com/data")
    .catch(err => {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
            // Could be: CORS block, no internet, DNS failure
            // Check browser console for actual CORS error message
            console.log("Possible CORS error — check browser console");
        }
    });


// ============================================================
// SECTION 13: BUILDING A COMPLETE API CLIENT
// ============================================================
// A reusable fetch wrapper used in real projects.
// Handles: base URL, auth tokens, error handling, timeouts.

class ApiClient {
    constructor(baseURL, options = {}) {
        this.baseURL    = baseURL;
        this.timeout    = options.timeout || 10000; // 10s default
        this.headers    = {
            "Content-Type": "application/json",
            "Accept":       "application/json",
            ...options.headers
        };
    }

    // Set auth token (call after login)
    setToken(token) {
        this.headers["Authorization"] = `Bearer ${token}`;
    }

    // Remove auth token (call on logout)
    clearToken() {
        delete this.headers["Authorization"];
    }

    // Core request method
    async request(endpoint, options = {}) {
        const url        = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                headers: { ...this.headers, ...options.headers },
                signal:  controller.signal,
                ...options
            });

            clearTimeout(timeoutId);

            // 204 No Content — return null (no body to parse)
            if (response.status === 204) return null;

            // Parse body (try JSON, fall back to text)
            let body;
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                body = await response.json();
            } else {
                body = await response.text();
            }

            // HTTP error — attach response info to error
            if (!response.ok) {
                const error     = new Error(body?.message || `HTTP ${response.status}`);
                error.status    = response.status;
                error.body      = body;
                throw error;
            }

            return body;

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                throw new Error(`Request timed out after ${this.timeout}ms`);
            }
            throw error;
        }
    }

    // Convenience methods
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: "GET" });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body:   JSON.stringify(data)
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body:   JSON.stringify(data)
        });
    }

    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "PATCH",
            body:   JSON.stringify(data)
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }

    // File upload — uses FormData
    upload(endpoint, formData, options = {}) {
        const headers = { ...this.headers };
        delete headers["Content-Type"]; // let browser set multipart boundary
        return this.request(endpoint, {
            ...options,
            method:  "POST",
            headers: headers,
            body:    formData
        });
    }
}

// ── Using the ApiClient ────────────────────────────────────
const api = new ApiClient("https://jsonplaceholder.typicode.com", {
    timeout: 8000
});

// Login and set token
async function login(username, password) {
    try {
        const { token } = await api.post("/auth/login", { username, password });
        api.setToken(token);
        localStorage.setItem("token", token);
        console.log("Logged in!");
    } catch (err) {
        console.error("Login failed:", err.message);
    }
}

// All requests now have auth token and base URL automatically
async function loadDashboard() {
    try {
        // All run in parallel
        const [users, posts, todos] = await Promise.all([
            api.get("/users"),
            api.get("/posts?_limit=5"),
            api.get("/todos?_limit=10"),
        ]);
        console.log(users.length, posts.length, todos.length);
    } catch (err) {
        if (err.status === 401) {
            api.clearToken();
            redirectToLogin();
        } else {
            showError(err.message);
        }
    }
}

// CRUD operations
async function userOperations() {
    // Create
    const newUser = await api.post("/users", {
        name:  "Ayush",
        email: "ayush@example.com"
    });

    // Read
    const user = await api.get(`/users/${newUser.id}`);

    // Update
    const updated = await api.put(`/users/${user.id}`, {
        ...user,
        name: "Ayush Kumar"
    });

    // Partial update
    const patched = await api.patch(`/users/${user.id}`, {
        phone: "9876543210"
    });

    // Delete
    await api.delete(`/users/${user.id}`);
}


// ============================================================
// SECTION 14: INTERVIEW QUESTIONS ON FETCH
// ============================================================

// Q1: Why does fetch need two awaits?
// First await: waits for HTTP response headers to arrive.
//              Resolves with a Response object (not the data).
// Second await: reads and parses the response BODY (a stream).
//               response.json() resolves with the actual data.

// Q2: Why doesn't fetch throw on 404 or 500?
// fetch() only rejects on NETWORK failures (no internet, DNS, CORS).
// HTTP error status codes are "successful" HTTP responses.
// You must check response.ok (true for 200-299) manually.

// Q3: What is response.ok?
// Boolean: true if status code is 200-299, false otherwise.
// Always check this before parsing the body.

// Q4: How do you cancel a fetch request?
// Use AbortController:
//   const ctrl = new AbortController();
//   fetch(url, { signal: ctrl.signal });
//   ctrl.abort(); // cancels the request
// Fetch rejects with AbortError — check err.name === "AbortError"

// Q5: How do you send JSON data with fetch?
// Three requirements:
//   1. method: "POST" (or PUT/PATCH)
//   2. headers: { "Content-Type": "application/json" }
//   3. body: JSON.stringify(yourData)
// All three are required — missing any one causes issues.

// Q6: How do you upload a file with fetch?
// Use FormData — DO NOT set Content-Type header manually.
//   const fd = new FormData();
//   fd.append("file", fileInput.files[0]);
//   fetch(url, { method: "POST", body: fd });
// Browser auto-sets Content-Type with multipart boundary.

// Q7: What is CORS and how does it affect fetch?
// Browser blocks JS from reading responses from different origins.
// Server must send Access-Control-Allow-Origin header to allow it.
// Can't fix CORS from frontend — server must be configured.
// CORS only applies in browsers — not Node.js or server-to-server.

// Q8: Difference between PUT and PATCH?
// PUT:   send ALL fields, server replaces entire resource
// PATCH: send ONLY changed fields, server merges with existing

// Q9: What is a preflight request?
// For "non-simple" requests (PUT, DELETE, custom headers, JSON body):
// Browser first sends OPTIONS request to check if CORS allows it.
// Server must respond with appropriate Access-Control headers.
// Then browser sends the actual request.

// Q10: How do you add auth token to every fetch request?
// Option 1: wrapper function that adds Authorization header
// Option 2: class-based ApiClient (shown above)
// Option 3: interceptors (axios pattern — not built into fetch)


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// BASIC GET:
//   const res  = await fetch(url);
//   if (!res.ok) throw new Error(res.status);
//   const data = await res.json();
//
// POST/PUT/PATCH:
//   const res = await fetch(url, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(data)
//   });
//
// DELETE:
//   await fetch(url, { method: "DELETE" });
//
// FILE UPLOAD:
//   const fd = new FormData();
//   fd.append("file", file);
//   await fetch(url, { method: "POST", body: fd });
//   // NO Content-Type header!
//
// TIMEOUT:
//   const ctrl = new AbortController();
//   setTimeout(() => ctrl.abort(), 5000);
//   fetch(url, { signal: ctrl.signal });
//
// RESPONSE OBJECT:
//   response.ok          → true if 200-299
//   response.status      → 200, 404, 500 etc.
//   response.statusText  → "OK", "Not Found"
//   response.json()      → parse body as JSON (Promise)
//   response.text()      → read body as string (Promise)
//   response.blob()      → read body as binary (Promise)
//   response.headers.get("name") → read a header
//
// GOLDEN RULES:
// 1. Always check response.ok — fetch doesn't throw on 4xx/5xx
// 2. Always JSON.stringify() the body — fetch doesn't do it for you
// 3. Always two awaits — one for response, one for body
// 4. Never set Content-Type for FormData — browser does it
// 5. AbortController for timeouts — fetch has no built-in timeout
// 6. CORS is a browser rule — server must send correct headers
// 7. Body can only be read ONCE — check response.bodyUsed
// 8. Store AbortController to cancel on user action or new request
// 9. 204 No Content — don't call response.json() or it throws
// 10. URLSearchParams for query strings — cleaner than string concatenation