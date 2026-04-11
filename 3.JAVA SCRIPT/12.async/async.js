// ============================================================
// ASYNC JAVASCRIPT — Complete Study Guide
// ============================================================
// JavaScript is SINGLE THREADED.
// One call stack. One thing at a time. No parallel execution.
//
// So how does a webpage stay responsive while waiting for an
// API response that takes 3 seconds?
//
// Answer: the ASYNC model — JS hands off waiting tasks to the
// browser (Web APIs), continues running other code, and comes
// back to handle results when they're ready.
//
// This file covers the complete journey:
//   Synchronous → Callbacks → Promises → async/await
// Each solved the problems of the previous one.


// ============================================================
// SECTION 1: SYNCHRONOUS vs ASYNCHRONOUS — the core difference
// ============================================================
// SYNCHRONOUS = one task at a time, must finish before next starts
// ASYNCHRONOUS = start a task, move on, come back when it's done

// ── SYNCHRONOUS — blocks everything ───────────────────────
console.log("Start");
// Imagine this takes 5 seconds:
// for (let i = 0; i < 5_000_000_000; i++) {} // blocks the ENTIRE browser
console.log("End");
// Nothing else can run until the loop finishes.
// Page freezes. User can't click. Browser tab is dead.

// ── ASYNCHRONOUS — non-blocking ───────────────────────────
console.log("Start");
setTimeout(() => {
    console.log("This runs later");
}, 2000);
console.log("End");
// Output: "Start" → "End" → (2 sec later) → "This runs later"
// JS didn't wait for the 2 seconds.
// It registered the timer and MOVED ON immediately.

// Real world analogy:
//   SYNC  = You stand at the counter waiting for your coffee.
//           No one behind you can be served until yours is done.
//   ASYNC = You place your order, take a token, sit down.
//           Others get served. When your coffee is ready, you're called.


// ============================================================
// SECTION 2: THE JAVASCRIPT RUNTIME — how async actually works
// ============================================================
// JS runtime has 4 key components:
//
//  ┌─────────────────┐    ┌──────────────────────┐
//  │   CALL STACK    │    │      WEB APIs        │
//  │                 │    │  (browser handles)   │
//  │  main()         │    │  setTimeout          │
//  │  console.log()  │    │  fetch               │
//  │  ...            │    │  DOM events          │
//  └────────┬────────┘    └──────────┬───────────┘
//           │                        │
//           │             ┌──────────▼───────────┐
//           │             │    TASK QUEUE        │
//           │             │  (callbacks waiting) │
//           │             └──────────┬───────────┘
//           │                        │
//           └──────────┬─────────────┘
//                      │
//              ┌───────▼──────┐
//              │  EVENT LOOP  │
//              │  watches:    │
//              │  is stack    │
//              │  empty?      │
//              └──────────────┘
//
// CALL STACK — where JS actually executes code (LIFO — last in, first out)
// WEB APIs   — browser handles async tasks (timers, HTTP, events) outside JS
// TASK QUEUE — completed async callbacks wait here to be executed
// EVENT LOOP — constantly checks: "is call stack empty? move next task in"
//
// THE RULE: call stack must be COMPLETELY EMPTY before event loop
//           moves anything from the queue into the stack.

// Proof — this is why setTimeout(fn, 0) still runs AFTER sync code:
console.log("1 — sync");

setTimeout(() => console.log("2 — setTimeout 0ms"), 0);
// Goes to Web API immediately (0ms timer), callback to queue almost instantly.
// But event loop won't touch it until call stack is empty.

console.log("3 — sync");
// Output: "1 — sync", "3 — sync", "2 — setTimeout 0ms"
// The 0ms timer still runs LAST because sync code finishes first.

// ── Microtask Queue vs Task Queue (important for interviews!) ──
// There are actually TWO queues:
//
//   Microtask Queue — Promises (.then, .catch), queueMicrotask
//   Task Queue      — setTimeout, setInterval, DOM events, fetch
//
// MICROTASKS have HIGHER PRIORITY than tasks.
// Event loop: empties ALL microtasks first, THEN one task, repeat.

console.log("A — sync");

setTimeout(() => console.log("B — setTimeout"), 0);   // task queue

Promise.resolve()
    .then(() => console.log("C — Promise microtask")); // microtask queue

console.log("D — sync");

// Output: A → D → C → B
// A, D run synchronously first.
// Then microtasks: C (Promise)
// Then tasks: B (setTimeout)
// Promises ALWAYS run before setTimeout even if setTimeout has 0ms delay!


// ============================================================
// SECTION 3: CALLBACKS — the original async solution
// ============================================================
// A callback is a function passed as an argument to another function,
// to be called LATER when an async operation completes.
// This was the ONLY way to handle async in early JavaScript.

// Simple callback example
function fetchData(callback) {
    setTimeout(() => {
        const data = { user: "Ayush", age: 21 };
        callback(null, data);  // convention: first arg = error, second = data
    }, 1000);
}

fetchData(function(error, data) {
    if (error) {
        console.log("Error:", error);
        return;
    }
    console.log("Got data:", data.user); // "Ayush" after 1 second
});

// ── CALLBACK HELL — why callbacks became a problem ─────────
// Real app: get user → get their orders → get order details → get payment info
// Each step depends on the previous one's result.

getUserFromDB(userId, function(err, user) {           // level 1
    if (err) return handleError(err);

    getOrdersByUser(user.id, function(err, orders) {  // level 2
        if (err) return handleError(err);

        getOrderDetails(orders[0].id, function(err, details) { // level 3
            if (err) return handleError(err);

            getPaymentInfo(details.paymentId, function(err, payment) { // level 4
                if (err) return handleError(err);

                // Finally have all data — but we're 4 levels deep!
                console.log(user.name, orders.length, details, payment);
                // Keep adding steps = keeps going right → "pyramid of doom"
            });
        });
    });
});

// Problems with callbacks:
//   1. Callback hell / pyramid of doom — hard to read
//   2. Error handling must be done at every single level
//   3. Can't use try/catch (errors happen in the future, outside current scope)
//   4. Can't return a value from an async callback
//   5. Inversion of control — you give your function to someone else to call
//      (what if they call it twice? never? with wrong args?)
// → Promises were invented to solve all of these


// ============================================================
// SECTION 4: PROMISES — structured async
// ============================================================
// A Promise is an object representing the EVENTUAL result
// of an async operation. Like a receipt — it's not the food,
// but a guarantee that food is coming (or a refund if it fails).
//
// States (can only move forward, never backward):
//   PENDING   → initial state, async work in progress
//   FULFILLED → succeeded, .then() callbacks run
//   REJECTED  → failed, .catch() callbacks run
//
// Once settled (fulfilled or rejected), state NEVER changes.

// ── Creating a Promise ─────────────────────────────────────
const myPromise = new Promise(function(resolve, reject) {
    // The executor function runs IMMEDIATELY (synchronously)
    console.log("Executor runs now"); // runs immediately

    setTimeout(() => {
        const success = true;
        if (success) {
            resolve("Data loaded!");  // fulfills with this value
        } else {
            reject(new Error("Loading failed")); // rejects with this error
        }
    }, 1000);
});

// ── Consuming a Promise ────────────────────────────────────
myPromise
    .then(value => {
        console.log("Resolved:", value); // "Data loaded!"
        return value.toUpperCase();      // returning passes to next .then
    })
    .then(upper => {
        console.log("Chained:", upper);  // "DATA LOADED!"
        return 42;
    })
    .then(num => {
        console.log("Number:", num);     // 42
    })
    .catch(error => {
        // catches ANY rejection from ANY .then above
        console.log("Error:", error.message);
    })
    .finally(() => {
        // runs ALWAYS — resolved or rejected
        console.log("Done — hide loading spinner");
    });

// ── Promise chaining — replaces callback hell ──────────────
// Same 4-step example as callback hell, but readable:

getUser(userId)
    .then(user    => getOrders(user.id))     // each returns a Promise
    .then(orders  => getDetails(orders[0].id))
    .then(details => getPayment(details.paymentId))
    .then(payment => console.log("All done:", payment))
    .catch(err    => console.log("Error at any step:", err.message));
// ONE catch handles ALL errors from ANY step above.
// Linear reading, not nested.

// ── Promise.resolve / Promise.reject — instant promises ────
// Wrap a value in a resolved Promise (useful for testing/defaults)
const instant = Promise.resolve(42);
instant.then(val => console.log(val)); // 42

const failed = Promise.reject(new Error("Instant failure"));
failed.catch(err => console.log(err.message)); // "Instant failure"

// ── Promise combinators ────────────────────────────────────

// Promise.all — wait for ALL, fail if ANY fails
async function allExample() {
    try {
        const [users, posts, comments] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/users").then(r  => r.json()),
            fetch("https://jsonplaceholder.typicode.com/posts").then(r  => r.json()),
            fetch("https://jsonplaceholder.typicode.com/comments").then(r => r.json()),
        ]);
        // All 3 run IN PARALLEL — not one after another
        // Total time = slowest request (not sum of all three)
        console.log(users.length, posts.length, comments.length);
    } catch (err) {
        // If ANY one fails, the whole thing rejects
        console.log("One failed:", err.message);
    }
}

// Promise.allSettled — wait for ALL, get ALL results (never rejects)
async function allSettledExample() {
    const results = await Promise.allSettled([
        Promise.resolve("success 1"),
        Promise.reject(new Error("fail")),
        Promise.resolve("success 2"),
    ]);

    results.forEach(result => {
        if (result.status === "fulfilled") {
            console.log("Success:", result.value);    // "success 1", "success 2"
        } else {
            console.log("Failed:", result.reason.message); // "fail"
        }
    });
    // Use when you need results even if some fail (dashboard with multiple widgets)
}

// Promise.race — resolves/rejects as soon as the FIRST one settles
async function raceExample() {
    const result = await Promise.race([
        fetch("https://api1.example.com/data"),
        fetch("https://api2.example.com/data"), // backup server
    ]);
    // Whichever responds first wins — the other is ignored
    // Use for implementing timeouts or trying multiple servers
}

// Promise.any — resolves as soon as the FIRST one SUCCEEDS (ignores failures)
async function anyExample() {
    const result = await Promise.any([
        Promise.reject(new Error("CDN 1 down")),
        Promise.reject(new Error("CDN 2 down")),
        Promise.resolve("CDN 3 works!"),
    ]);
    console.log(result); // "CDN 3 works!"
    // Only rejects if ALL promises reject (AggregateError)
    // Use for fallback URLs/servers
}

// Summary table:
//  Promise.all         → ALL must succeed. First failure = stop everything.
//  Promise.allSettled  → ALL run. Get every result. Never fails.
//  Promise.race        → First to settle (succeed OR fail) wins.
//  Promise.any         → First to SUCCEED wins. Ignores failures.


// ============================================================
// SECTION 5: async/await — the cleanest syntax
// ============================================================
// async/await is built ON TOP of Promises.
// Not a replacement — just a better way to write Promise code.
// Makes async code look and behave like synchronous code.
//
// Rules:
//   async keyword before function → always returns a Promise
//   await keyword before Promise  → pause until Promise settles
//   await only works INSIDE an async function
//   Use try/catch/finally for error handling

// ── async function always returns a Promise ────────────────
async function getNumber() {
    return 42; // looks like it returns 42
}
const result = getNumber();
console.log(result);         // Promise { 42 }  — it's a Promise!
result.then(val => console.log(val)); // 42

// Even throwing returns a rejected Promise:
async function failFn() {
    throw new Error("async error");
}
failFn().catch(err => console.log(err.message)); // "async error"

// ── await pauses the async function (not the whole program!) ─
async function loadUser() {
    console.log("1 — before fetch");

    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    // JS pauses THIS function here and goes to do other work
    // When fetch resolves, execution resumes from HERE

    console.log("3 — after fetch"); // runs after fetch completes

    const user = await response.json(); // pause again for body parsing
    console.log("User:", user.name);
    return user;
}

console.log("A — before calling loadUser");
loadUser(); // starts the async function
console.log("B — after calling loadUser (doesn't wait!)");

// Output: A → "1 — before fetch" → B → (fetch completes) → "3 — after fetch" → "User: ..."
// "B" prints BEFORE the fetch completes because loadUser is async.
// Calling an async function is non-blocking!

// ── try/catch/finally with async/await ────────────────────
async function loadData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Must manually throw — fetch doesn't throw on 4xx/5xx
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // Catches: network errors + our manually thrown HTTP errors
        if (error.name === "TypeError") {
            console.log("Network error — no internet?");
        } else {
            console.log("Request failed:", error.message);
        }
        return null; // return null so caller can check

    } finally {
        // ALWAYS runs — perfect for cleanup
        hideLoadingSpinner();
        console.log("Request complete");
    }
}

// ── Sequential vs Parallel — the most important performance concept ──
// Common mistake: using await in a loop makes calls sequential when
// they could run in parallel.

// ❌ SLOW — sequential (each waits for previous to finish)
async function loadSequential() {
    const user1 = await getUser(1); // wait... 1s
    const user2 = await getUser(2); // wait... 1s
    const user3 = await getUser(3); // wait... 1s
    // Total: ~3 seconds
    return [user1, user2, user3];
}

// ✓ FAST — parallel (all start at the same time)
async function loadParallel() {
    const [user1, user2, user3] = await Promise.all([
        getUser(1),
        getUser(2),
        getUser(3)
    ]);
    // Total: ~1 second (only as slow as the slowest one)
    return [user1, user2, user3];
}

// ── await in loops — when sequential IS correct ────────────
// Sometimes you need sequential — when each call depends on previous result:
async function processQueue(items) {
    const results = [];
    for (const item of items) {
        // This item's result needed before processing next item
        const processed = await processItem(item);
        results.push(processed);
    }
    return results;
}

// When order doesn't matter — map + Promise.all is better:
async function processAll(items) {
    const promises = items.map(item => processItem(item)); // start ALL at once
    return await Promise.all(promises); // wait for all to finish
}


// ============================================================
// SECTION 6: ERROR HANDLING PATTERNS — production level
// ============================================================

// ── Pattern 1: try/catch in every async function (verbose) ─
async function pattern1() {
    try {
        const data = await fetchSomething();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ── Pattern 2: handle errors where they're called ──────────
async function fetchSomething() {
    const response = await fetch("/api/data"); // let errors bubble up
    if (!response.ok) throw new Error(response.status);
    return response.json();
}

async function useFetch() {
    try {
        const data = await fetchSomething(); // catch here where you can react
        renderData(data);
    } catch (err) {
        showErrorToUser(err.message);
    }
}

// ── Pattern 3: async wrapper that never throws (Go-style) ──
// Returns [data, error] — caller decides how to handle
async function safeAwait(promise) {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

// Usage — no try/catch needed at call site
async function loadWithSafeAwait() {
    const [user, userErr] = await safeAwait(
        fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json())
    );
    if (userErr) {
        console.log("User failed:", userErr.message);
        return;
    }

    const [posts, postsErr] = await safeAwait(
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
            .then(r => r.json())
    );
    if (postsErr) {
        console.log("Posts failed:", postsErr.message);
        return;
    }

    console.log(user.name, "has", posts.length, "posts");
}

// ── Pattern 4: AbortController — cancel requests ───────────
async function fetchWithTimeout(url, ms = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error(`Timed out after ${ms}ms`);
        }
        throw err;
    }
}

// Cancel on user action (e.g. user navigates away)
let currentController = null;

async function searchUsers(query) {
    // Cancel previous search if still running
    if (currentController) {
        currentController.abort();
    }
    currentController = new AbortController();

    try {
        const response = await fetch(
            `/api/users?search=${query}`,
            { signal: currentController.signal }
        );
        const users = await response.json();
        renderUsers(users);
    } catch (err) {
        if (err.name !== "AbortError") { // ignore expected cancellations
            showError(err.message);
        }
    }
}


// ============================================================
// SECTION 7: REAL PATTERNS USED IN PRODUCTION
// ============================================================

// ── Loading state pattern (every data-fetching UI) ─────────
let isLoading = false;

async function fetchAndRender(url) {
    if (isLoading) return; // prevent duplicate calls
    isLoading = true;
    showSpinner();

    try {
        const data = await fetchWithTimeout(url);
        render(data);
    } catch (err) {
        showError(err.message);
    } finally {
        isLoading = false;
        hideSpinner(); // always hide spinner whether success or failure
    }
}

// ── Debounced search — don't fetch on every keystroke ──────
// Wait until user stops typing for 500ms, then fetch
let debounceTimer = null;

function debounce(fn, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);        // cancel previous timer
        debounceTimer = setTimeout(() => {  // start new timer
            fn.apply(this, args);
        }, delay);
    };
}

const debouncedSearch = debounce(async function(query) {
    if (!query.trim()) return;
    const results = await searchUsers(query);
    renderResults(results);
}, 500); // only fires 500ms after last keystroke

document.getElementById("search").addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
});

// ── Polling — check server repeatedly until condition met ──
async function pollUntilDone(jobId, intervalMs = 2000) {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                const status = await fetchWithTimeout(`/api/jobs/${jobId}`);

                if (status.state === "completed") {
                    clearInterval(intervalId);
                    resolve(status.result);
                } else if (status.state === "failed") {
                    clearInterval(intervalId);
                    reject(new Error(status.error));
                }
                // still "pending"? keep polling...

            } catch (err) {
                clearInterval(intervalId);
                reject(err);
            }
        }, intervalMs);
    });
}

// Usage:
async function uploadAndProcess(file) {
    const { jobId } = await uploadFile(file);
    console.log("Uploaded, waiting for processing...");

    const result = await pollUntilDone(jobId);
    console.log("Processing done:", result);
}

// ── Retry with exponential backoff ─────────────────────────
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            if (attempt === maxRetries) throw err; // last attempt — give up

            // Wait longer each retry: 1s, 2s, 4s (exponential backoff)
            const delay = 1000 * Math.pow(2, attempt - 1);
            console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


// ============================================================
// SECTION 8: COMMON MISTAKES & MISCONCEPTIONS
// ============================================================

// ── MISTAKE 1: Forgetting await ────────────────────────────
async function bad() {
    const data = fetch("https://jsonplaceholder.typicode.com/users/1");
    // data is a PENDING PROMISE, not the actual response!
    console.log(data.name); // undefined — it's a Promise object, not user data
}
async function good() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await response.json();
    console.log(data.name); // "Leanne Graham" ✓
}

// ── MISTAKE 2: await outside async function ────────────────
// const data = await fetch(url); // ❌ SyntaxError at top level
// Solution: wrap in async function or use top-level await (ES2022 in modules)
async function main() {
    const data = await fetch(url); // ✓ inside async function
}

// ── MISTAKE 3: Sequential when parallel is possible ────────
async function slowWay() {
    const a = await fetch("/api/a").then(r => r.json()); // 1s
    const b = await fetch("/api/b").then(r => r.json()); // 1s
    const c = await fetch("/api/c").then(r => r.json()); // 1s
    // Total: 3s — each waits for previous
}
async function fastWay() {
    const [a, b, c] = await Promise.all([
        fetch("/api/a").then(r => r.json()),
        fetch("/api/b").then(r => r.json()),
        fetch("/api/c").then(r => r.json()),
    ]);
    // Total: ~1s — all run at the same time
}

// ── MISTAKE 4: Not handling errors ─────────────────────────
// Unhandled promise rejection — crashes the app in Node.js,
// shows warning in browser, silently fails in production
async function dangerous() {
    const data = await fetch("/api/data").then(r => r.json());
    // If this throws, nobody handles it → silent failure
}
async function safe() {
    try {
        const data = await fetch("/api/data").then(r => r.json());
        return data;
    } catch (err) {
        console.error("Failed:", err);
        return null;
    }
}

// ── MISTAKE 5: Creating a Promise inside async (redundant) ─
// BAD — unnecessary, async already wraps in Promise
async function redundant() {
    return new Promise((resolve) => {
        resolve(42);
    });
}
// GOOD — just return the value, async handles the Promise wrapping
async function clean() {
    return 42; // async function automatically wraps this in Promise.resolve(42)
}

// ── MISTAKE 6: async in forEach ────────────────────────────
// forEach doesn't wait for async callbacks!
async function badLoop() {
    const ids = [1, 2, 3];
    ids.forEach(async (id) => {
        const user = await getUser(id); // forEach ignores this Promise!
        console.log(user.name);
    });
    console.log("Done"); // prints BEFORE any user is loaded!
}
// FIX: use for...of or Promise.all with map
async function goodLoop() {
    const ids = [1, 2, 3];

    // Option 1: for...of (sequential)
    for (const id of ids) {
        const user = await getUser(id); // properly awaited
        console.log(user.name);
    }

    // Option 2: map + Promise.all (parallel, faster)
    const users = await Promise.all(ids.map(id => getUser(id)));
    users.forEach(u => console.log(u.name));
}


// ============================================================
// SECTION 9: INTERVIEW QUESTIONS ON ASYNC
// ============================================================

// Q1: What is the event loop?
// JS is single-threaded. The event loop watches the call stack
// and task queue. When the stack is empty, it moves the next
// callback from the queue into the stack to execute.

// Q2: What is the difference between microtask and task queue?
// Microtasks (Promises) have higher priority than tasks (setTimeout).
// After each task, ALL microtasks are drained before the next task runs.
// So Promise callbacks always run before setTimeout callbacks.

// Q3: Output question — what prints and in what order?
async function order() {
    console.log("1");
    await Promise.resolve();
    console.log("2");
}
console.log("3");
order();
console.log("4");
// Answer: 3 → 1 → 4 → 2
// 3: sync before order() call
// 1: sync inside order() before await
// 4: sync after order() call (order() paused at await)
// 2: microtask queue — runs after all sync code done

// Q4: What is the difference between Promise.all and Promise.allSettled?
// Promise.all       — rejects immediately if ANY promise fails
// Promise.allSettled — waits for all, gives { status, value/reason } for each

// Q5: Can you use await without async?
// Not in regular functions (SyntaxError).
// ES2022 allows top-level await in ES modules only.

// Q6: What happens if you don't await a Promise?
// You get the Promise object (pending), not the resolved value.
// The async work still runs — you just can't access its result.

// Q7: Why is async/await better than raw Promises?
// Looks synchronous — easier to read and reason about.
// try/catch works naturally (vs .catch chaining).
// Easier debugging — stack traces are clearer.
// Easier to write sequential async logic.

// Q8: What is callback hell and how do Promises solve it?
// Callback hell = deeply nested callbacks making code unreadable.
// Promises flatten it with .then() chaining.
// async/await flattens it further to look synchronous.

// Q9: Is async/await truly synchronous?
// NO. It looks synchronous but is still non-blocking.
// await pauses the async FUNCTION, not the entire JS thread.
// Other code continues running while an async function is paused.

// Q10: What is Promise chaining?
// Returning a value from .then() wraps it in Promise.resolve().
// Returning a Promise from .then() makes the chain wait for it.
// This lets you chain multiple async steps linearly.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// ASYNC FUNCTION:
//   async function fn() {}   → always returns a Promise
//   const fn = async () => {} → arrow version
//
// AWAIT:
//   const data = await somePromise  → pause until resolved
//   Only works inside async function
//
// ERROR HANDLING:
//   try { await ... } catch(e) {} finally {} → always use this
//
// PARALLEL:
//   await Promise.all([p1, p2, p3])         → all succeed or fail together
//   await Promise.allSettled([p1, p2, p3])  → get all results
//   await Promise.race([p1, p2])            → first to settle wins
//   await Promise.any([p1, p2])             → first to succeed wins
//
// COMMON PATTERNS:
//   fetchWithTimeout  → AbortController + setTimeout
//   fetchWithRetry    → loop + exponential backoff
//   debounce          → clearTimeout + setTimeout
//   poll              → setInterval + clearInterval on condition
//
// GOLDEN RULES:
// 1. async/await is Promise sugar — understanding Promises is still essential
// 2. await pauses the FUNCTION not the program — other code still runs
// 3. Always try/catch async functions — unhandled rejections crash Node.js
// 4. Promise.all for parallel — never await in sequence when parallel is fine
// 5. fetch doesn't throw on 404/500 — always check response.ok
// 6. Microtasks (Promises) run before macrotasks (setTimeout) — always
// 7. async functions always return a Promise — even if you return a plain value
// 8. forEach ignores async callbacks — use for...of or Promise.all + map
// 9. Don't wrap return values in new Promise inside async — redundant
// 10. AbortController cancels fetch — essential for search inputs and timeouts