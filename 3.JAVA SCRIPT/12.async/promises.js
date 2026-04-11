// ============================================================
// PROMISES — Complete Deep Dive Study Guide
// ============================================================
// Before Promises existed (pre-ES6 2015), async JS was handled
// entirely with CALLBACKS. Promises were invented to fix the
// problems callbacks created.
//
// Think of a Promise like ordering food on Zomato:
//   - You place an order (create a Promise)
//   - You get an ORDER ID / receipt (the Promise object)
//   - You don't wait at the restaurant — you go do other things
//   - Later: food arrives (resolved) or order cancelled (rejected)
//   - You react when it settles (.then / .catch)
//
// KEY INSIGHT: A Promise is just an OBJECT that represents
// a value that isn't available yet but will be in the future.


// ============================================================
// SECTION 1: THE PROBLEM PROMISES SOLVE — Callback Hell
// ============================================================
// To appreciate Promises, you must feel the pain of callbacks first.

// Imagine these 4 functions all take 1 second each:
//   Step 1: Login user
//   Step 2: Get their profile
//   Step 3: Get their orders
//   Step 4: Get order details

// WITH CALLBACKS — pyramid of doom
loginUser("ayush", "password123", function(err, user) {
    if (err) { console.log("Login failed:", err); return; }

    getProfile(user.id, function(err, profile) {
        if (err) { console.log("Profile failed:", err); return; }

        getOrders(profile.id, function(err, orders) {
            if (err) { console.log("Orders failed:", err); return; }

            getOrderDetails(orders[0].id, function(err, details) {
                if (err) { console.log("Details failed:", err); return; }

                console.log("Final result:", details);
                // need another step? indent more →
                // and more → and more →
            });
        });
    });
});
// Problems:
// 1. Reads right (indent grows) instead of down
// 2. Error handling copy-pasted at every single level
// 3. Hard to maintain — change one level, breaks everything
// 4. Can't use try/catch — errors happen in the future
// 5. "Inversion of control" — you hand your function to someone
//    else to call. What if they call it 0 times? 3 times?

// WITH PROMISES — flat and readable
loginUser("ayush", "password123")
    .then(user    => getProfile(user.id))
    .then(profile => getOrders(profile.id))
    .then(orders  => getOrderDetails(orders[0].id))
    .then(details => console.log("Final result:", details))
    .catch(err    => console.log("Error at any step:", err.message));
// ONE catch handles ALL errors from any step.
// Reads top to bottom. Each step clearly visible.


// ============================================================
// SECTION 2: PROMISE STATES — the lifecycle
// ============================================================
// A Promise is ALWAYS in exactly one of these 3 states:
//
//                    ┌─────────────┐
//                    │   PENDING   │  ← initial state, work in progress
//                    └──────┬──────┘
//                           │
//              ┌────────────┴────────────┐
//              ▼                         ▼
//      ┌──────────────┐         ┌──────────────┐
//      │  FULFILLED   │         │   REJECTED   │
//      │  (resolved)  │         │   (failed)   │
//      └──────────────┘         └──────────────┘
//       .then() runs              .catch() runs
//
// RULES:
//   1. Starts as PENDING
//   2. Can only move to FULFILLED or REJECTED — never backwards
//   3. Once settled (fulfilled or rejected) — PERMANENTLY that state
//   4. A settled Promise can never change state again — immutable

// Demonstrating states
const pendingPromise = new Promise((resolve, reject) => {
    // hasn't called resolve or reject yet
    setTimeout(() => resolve("done"), 5000);
});
console.log(pendingPromise); // Promise { <pending> }

const fulfilledPromise = Promise.resolve("I am fulfilled");
console.log(fulfilledPromise); // Promise { 'I am fulfilled' }

const rejectedPromise = Promise.reject(new Error("I am rejected"));
console.log(rejectedPromise); // Promise { <rejected> Error: I am rejected }
// Always handle rejections or you get UnhandledPromiseRejectionWarning
rejectedPromise.catch(() => {}); // silences the warning


// ============================================================
// SECTION 3: CREATING PROMISES — the constructor
// ============================================================
// new Promise(executor)
//
// executor = a function that runs IMMEDIATELY (synchronously)
// It receives two functions: resolve and reject
//   resolve(value) — fulfill the promise with a value
//   reject(reason) — reject the promise with an error
//
// Only the FIRST call to resolve/reject matters.
// Subsequent calls are completely ignored.

const myPromise = new Promise(function(resolve, reject) {
    // This executor runs RIGHT NOW — synchronously
    console.log("Executor runs immediately"); // prints first

    // Simulate async work (API call, file read, timer)
    setTimeout(function() {
        const dataFromServer = { id: 1, name: "Ayush" };
        const success = true;

        if (success) {
            resolve(dataFromServer);   // Promise → FULFILLED
                                        // dataFromServer becomes the value
        } else {
            reject(new Error("Server returned an error")); // Promise → REJECTED
        }
    }, 1000);
});

console.log("This runs before the setTimeout fires"); // prints second

// First call wins — subsequent resolve/reject calls are ignored:
const tricky = new Promise((resolve, reject) => {
    resolve("first");   // ✓ this one wins
    resolve("second");  // ignored
    reject("error");    // ignored
    resolve("third");   // ignored
});
tricky.then(val => console.log(val)); // "first"

// Wrapping a callback-based function in a Promise (promisification)
// This is how Node.js fs.readFile, older libs get "promisified"
function readFilePromise(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) reject(err);   // error → reject
            else     resolve(data); // success → resolve
        });
    });
}

// More examples of creating Promises from scratch
function delay(ms) {
    // Returns a Promise that resolves after ms milliseconds
    return new Promise(resolve => setTimeout(resolve, ms));
}
delay(2000).then(() => console.log("2 seconds passed"));

function fetchMockData(shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Mock fetch failed"));
            } else {
                resolve({ data: [1, 2, 3], status: "ok" });
            }
        }, 500);
    });
}


// ============================================================
// SECTION 4: CONSUMING PROMISES — .then() .catch() .finally()
// ============================================================

// ── .then(onFulfilled, onRejected) ─────────────────────────
// Called when Promise FULFILLS. Receives the resolved value.
// Can also receive onRejected as 2nd argument (but use .catch instead)

myPromise.then(function(value) {
    // value = whatever was passed to resolve()
    console.log("Fulfilled with:", value); // { id: 1, name: "Ayush" }
    console.log("Name:", value.name);       // "Ayush"
});

// ── .catch(onRejected) ─────────────────────────────────────
// Called when Promise REJECTS. Receives the rejection reason.
// Best practice: ALWAYS have a .catch at the end of every chain.

const failingPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Something broke")), 500);
});

failingPromise
    .then(value => console.log("This won't run"))
    .catch(error => {
        // error = whatever was passed to reject()
        console.log("Caught:", error.message);   // "Something broke"
        console.log("Type:", error.name);         // "Error"
    });

// ── .finally(onFinally) ────────────────────────────────────
// Called ALWAYS — whether fulfilled or rejected.
// Receives NO arguments (doesn't know success or failure).
// Perfect for cleanup: hide loading spinners, close DB connections.

function loadUser(id) {
    showSpinner(); // show loading indicator

    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(user => {
            renderUser(user);
            return user; // pass along for further chaining
        })
        .catch(err => {
            showError(err.message);
        })
        .finally(() => {
            hideSpinner(); // ALWAYS hide spinner — success or failure
            // Can't access value/error here — use .then/.catch for that
        });
}

// ── .then() returns a NEW Promise — this enables chaining ──
// Each .then() creates a brand new Promise.
// What you RETURN from .then() determines the next Promise's value.
//
// Return rules:
//   return value      → next .then gets that value
//   return Promise    → next .then waits for that Promise to resolve
//   throw error       → jumps to .catch
//   return nothing    → next .then gets undefined


// ============================================================
// SECTION 5: PROMISE CHAINING — the real power
// ============================================================
// Chaining works because .then() ALWAYS returns a new Promise.
// What you return inside .then() becomes the resolved value
// of that new Promise — feeding directly into the next .then().

// Each return becomes the next .then's input:
Promise.resolve(1)
    .then(val => {
        console.log(val);   // 1
        return val + 1;     // return 2 → next .then gets 2
    })
    .then(val => {
        console.log(val);   // 2
        return val * 10;    // return 20 → next .then gets 20
    })
    .then(val => {
        console.log(val);   // 20
        return val.toString() + "!"; // return "20!"
    })
    .then(val => {
        console.log(val);   // "20!"
    });

// Returning a Promise from .then() — chain WAITS for it
function getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(res => res.json());
}
function getPosts(userId) {
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(res => res.json());
}
function getComments(postId) {
    return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(res => res.json());
}

// Each step returns a Promise — chain waits for each one
getUser(1)
    .then(user => {
        console.log("User:", user.name);
        return getPosts(user.id);    // returns a Promise — chain waits
    })
    .then(posts => {
        console.log("Posts:", posts.length);
        return getComments(posts[0].id); // returns a Promise — chain waits
    })
    .then(comments => {
        console.log("Comments:", comments.length);
    })
    .catch(err => console.log("Error:", err.message));

// ── COMMON MISTAKE: forgetting to return in .then() ────────
// Without return, the next .then gets undefined

// BAD — missing return
getUser(1)
    .then(user => {
        getPosts(user.id); // ← no return! result is lost
    })
    .then(posts => {
        console.log(posts); // undefined! getPosts result was thrown away
    });

// GOOD — with return
getUser(1)
    .then(user => {
        return getPosts(user.id); // ✓ return the Promise
    })
    .then(posts => {
        console.log(posts.length); // works correctly
    });

// ── Error handling in chains ───────────────────────────────
// Throwing or rejecting in .then() jumps straight to .catch()
// .catch() can also RECOVER — return a value and chain continues

Promise.resolve("start")
    .then(val => {
        console.log(val);       // "start"
        throw new Error("oops"); // jump to .catch
    })
    .then(val => {
        console.log("skipped"); // NEVER runs
    })
    .catch(err => {
        console.log("Caught:", err.message); // "oops"
        return "recovered";                   // RETURN a value → chain continues!
    })
    .then(val => {
        console.log("After recovery:", val); // "recovered" — chain resumed!
    });


// ============================================================
// SECTION 6: Promise.resolve() and Promise.reject()
// ============================================================
// Shorthand to create instantly settled Promises.
// No need for new Promise() constructor.

// Promise.resolve(value) — creates an immediately fulfilled Promise
const p1 = Promise.resolve(42);
p1.then(val => console.log(val)); // 42

const p2 = Promise.resolve({ name: "Ayush", role: "dev" });
p2.then(user => console.log(user.name)); // "Ayush"

// Useful for: providing default values, testing, making sync values
// work with Promise chains
function getConfig(key) {
    const cache = { theme: "dark", lang: "en" };
    if (cache[key]) {
        return Promise.resolve(cache[key]); // wrap sync value in Promise
    }
    return fetch(`/api/config/${key}`).then(r => r.json()); // real async
    // Either way, caller always gets a Promise — consistent interface
}

// Promise.reject(reason) — creates an immediately rejected Promise
const p3 = Promise.reject(new Error("Something failed"));
p3.catch(err => console.log(err.message)); // "Something failed"

// ALWAYS pass an Error object to reject — not a string
// reject("error string") — you lose stack trace, hard to debug
// reject(new Error("error string")) — full stack trace ✓


// ============================================================
// SECTION 7: PROMISE COMBINATORS — handling multiple Promises
// ============================================================
// All 4 take an ARRAY (or iterable) of Promises.
// All 4 return a NEW Promise.
// They differ in WHEN they settle and HOW they handle failures.

const p_fast   = new Promise(res => setTimeout(() => res("fast"),   500));
const p_medium = new Promise(res => setTimeout(() => res("medium"), 1000));
const p_slow   = new Promise(res => setTimeout(() => res("slow"),   2000));
const p_fail   = new Promise((res, rej) => setTimeout(() => rej(new Error("failed")), 700));

// ── Promise.all() ──────────────────────────────────────────
// Waits for ALL Promises to fulfill.
// Rejects immediately if ANY Promise rejects.
// Result: array of all values in the same order as input.
// Use when: ALL results are needed AND failure of one = failure of all.

Promise.all([p_fast, p_medium, p_slow])
    .then(([fast, medium, slow]) => {
        // Waits for ALL — so waits for the slowest (2s)
        // Results in INPUT ORDER regardless of which resolved first
        console.log(fast, medium, slow); // "fast" "medium" "slow"
    })
    .catch(err => console.log("One failed, all failed:", err.message));

// With one failure:
Promise.all([p_fast, p_fail, p_slow])
    .then(results => console.log("won't run"))
    .catch(err => console.log("Rejected at:", err.message)); // "failed"
    // p_fast and p_slow results are LOST — Promise.all doesn't wait for them

// ── Promise.allSettled() ───────────────────────────────────
// Waits for ALL Promises to settle (fulfilled OR rejected).
// NEVER rejects — always resolves with an array of result objects.
// Each result: { status: "fulfilled", value: ... }
//           or { status: "rejected",  reason: ... }
// Use when: you need ALL results regardless of individual failures.
// Perfect for: dashboard widgets, batch operations, loading multiple resources

Promise.allSettled([p_fast, p_fail, p_slow])
    .then(results => {
        // Always gets here — never goes to .catch
        results.forEach((result, i) => {
            if (result.status === "fulfilled") {
                console.log(`Promise ${i} succeeded:`, result.value);
            } else {
                console.log(`Promise ${i} failed:`, result.reason.message);
            }
        });
        // Promise 0 succeeded: "fast"
        // Promise 1 failed: "failed"
        // Promise 2 succeeded: "slow"
    });

// ── Promise.race() ─────────────────────────────────────────
// Resolves/rejects as soon as the FIRST Promise settles.
// The "winning" result is returned. Others are ignored.
// Use when: you only need the fastest response.
// Perfect for: timeout implementation, trying multiple servers

Promise.race([p_fast, p_medium, p_slow])
    .then(winner => console.log("First finished:", winner)); // "fast" (after 500ms)

// Classic timeout pattern using Promise.race:
function fetchWithTimeout(url, ms) {
    const fetchPromise = fetch(url).then(r => r.json());

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    );

    return Promise.race([fetchPromise, timeoutPromise]);
    // If fetch takes longer than ms → timeout Promise rejects first → fetch cancelled
}

fetchWithTimeout("https://jsonplaceholder.typicode.com/users", 3000)
    .then(data => console.log("Got data:", data.length))
    .catch(err => console.log("Error:", err.message));

// ── Promise.any() ──────────────────────────────────────────
// Resolves as soon as the FIRST Promise SUCCEEDS (ignores rejections).
// Only rejects if ALL Promises reject → AggregateError.
// Use when: trying multiple sources and any one success is enough.
// Perfect for: fallback URLs, CDN failover, trying multiple APIs

const fail1 = Promise.reject(new Error("Server 1 down"));
const fail2 = Promise.reject(new Error("Server 2 down"));
const ok    = Promise.resolve("Server 3 works!");

Promise.any([fail1, fail2, ok])
    .then(result => console.log("First success:", result)) // "Server 3 works!"
    .catch(err => {
        // Only reaches here if ALL fail
        console.log("All failed:", err.message);   // AggregateError
        console.log("All errors:", err.errors);    // array of all errors
    });

// ── Comparison summary ─────────────────────────────────────
//
//                    | Fulfills when    | Rejects when
// ─────────────────────────────────────────────────────────
// Promise.all        | ALL fulfill      | ANY rejects
// Promise.allSettled | ALL settle       | never
// Promise.race       | FIRST settles    | FIRST rejects
// Promise.any        | FIRST fulfills   | ALL reject
// ─────────────────────────────────────────────────────────


// ============================================================
// SECTION 8: PROMISE INTERNALS — how .then() REALLY works
// ============================================================
// Understanding this makes chaining click completely.
//
// When you call .then(callback):
//   1. A NEW Promise is created and returned
//   2. When the original Promise fulfills, callback runs
//   3. Whatever callback RETURNS determines the new Promise:
//      - Return a value    → new Promise resolves with that value
//      - Return a Promise  → new Promise "follows" that Promise
//      - Throw an error    → new Promise rejects with that error
//      - Return nothing    → new Promise resolves with undefined

// Simulating how Promise chaining works internally:
function fakePromise(value) {
    return {
        then(callback) {
            const result = callback(value);
            // If result is a Promise, wait for it
            // If result is a value, wrap it in a new fakePromise
            if (result && typeof result.then === "function") {
                return result; // it's already thenable
            }
            return fakePromise(result); // wrap value for next .then
        }
    };
}
// This is a simplified model — real Promises handle async timing,
// error handling, and the microtask queue — but the CONCEPT is this.

// Thenable — anything with a .then() method
// Promises detect if you return a "thenable" and wait for it:
Promise.resolve("start")
    .then(() => ({
        // This object is a "thenable" — has a .then method
        then(resolve) { resolve("from thenable"); }
    }))
    .then(val => console.log(val)); // "from thenable"
    // Promise chain waited for the thenable to resolve


// ============================================================
// SECTION 9: BUILDING A REAL PROMISE CHAIN — step by step
// ============================================================
// Complete example: search GitHub users
// Step 1: get input from user
// Step 2: fetch matching users from API
// Step 3: get details of first result
// Step 4: display the result
// Step 5: handle all errors in one place

const searchInput = document.getElementById("search");
const resultBox   = document.getElementById("result");

function validateInput(query) {
    return new Promise((resolve, reject) => {
        if (!query || query.trim().length < 2) {
            reject(new Error("Query must be at least 2 characters"));
        } else {
            resolve(query.trim());
        }
    });
}

function searchGithubUsers(query) {
    return fetch(`https://api.github.com/search/users?q=${query}`)
        .then(res => {
            if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data.items.length === 0) throw new Error("No users found");
            return data.items[0]; // return first result
        });
}

function getUserDetails(user) {
    return fetch(user.url)
        .then(res => res.json());
}

function displayUser(user) {
    resultBox.innerHTML = `
        <img src="${user.avatar_url}" width="80" style="border-radius:50%">
        <h3>${user.name || user.login}</h3>
        <p>Followers: ${user.followers}</p>
        <p>Public repos: ${user.public_repos}</p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
    `;
    return user; // return for further chaining if needed
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const query = searchInput.value;
    resultBox.innerHTML = "Loading...";

    validateInput(query)
        .then(cleanQuery  => searchGithubUsers(cleanQuery))
        .then(firstResult => getUserDetails(firstResult))
        .then(userDetails => displayUser(userDetails))
        .catch(err => {
            resultBox.innerHTML = `<p style="color:red">${err.message}</p>`;
        })
        .finally(() => {
            searchInput.disabled = false;
        });
});


// ============================================================
// SECTION 10: PROMISIFICATION — converting callbacks to Promises
// ============================================================
// Many older JS APIs (Node.js fs, older browsers) use callbacks.
// Wrapping them in Promises is called "promisification".

// Generic promisify utility (Node.js has util.promisify built-in)
function promisify(callbackFn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            // Add our callback as the last argument
            callbackFn(...args, function(err, result) {
                if (err) reject(err);
                else     resolve(result);
            });
        });
    };
}

// Usage — convert Node.js fs.readFile
const readFile = promisify(fs.readFile);

// Old callback way:
// fs.readFile("config.json", "utf8", (err, data) => { ... })

// New Promise way:
readFile("config.json", "utf8")
    .then(data => JSON.parse(data))
    .then(config => console.log("Config:", config))
    .catch(err => console.log("Read failed:", err.message));

// Real-world promisification of geolocation API
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),    // success callback → resolve
            error    => reject(error)          // error callback → reject
        );
    });
}

getCurrentPosition()
    .then(pos => {
        console.log("Lat:", pos.coords.latitude);
        console.log("Lng:", pos.coords.longitude);
    })
    .catch(err => console.log("Location denied:", err.message));


// ============================================================
// SECTION 11: COMMON MISTAKES WITH PROMISES
// ============================================================

// ── MISTAKE 1: Forgetting to return in .then() ─────────────
// This is the #1 Promise mistake. Without return, the chain breaks.

// BAD
fetch("/api/users")
    .then(res => {
        res.json(); // ← no return! result is lost
    })
    .then(data => {
        console.log(data); // undefined — json() result was discarded
    });

// GOOD
fetch("/api/users")
    .then(res => {
        return res.json(); // ✓ return the Promise
    })
    .then(data => {
        console.log(data); // [array of users] ✓
    });

// ── MISTAKE 2: Promise constructor antipattern ─────────────
// Wrapping a Promise in another Promise unnecessarily

// BAD — "deferred antipattern"
function badFetch(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => resolve(res.json())) // wrapping existing Promise needlessly
            .catch(err => reject(err));
    });
}

// GOOD — just return the existing Promise
function goodFetch(url) {
    return fetch(url).then(res => res.json()); // already a Promise — just return it
}

// ── MISTAKE 3: Not handling rejections ─────────────────────
// Every Promise chain needs a .catch()
// Unhandled rejections crash Node.js and show warnings in browsers

// BAD — no .catch
fetch("/api/data")
    .then(res => res.json())
    .then(data => processData(data));
// If fetch fails → UnhandledPromiseRejectionWarning → potential crash

// GOOD — always .catch
fetch("/api/data")
    .then(res => res.json())
    .then(data => processData(data))
    .catch(err => console.error("Failed:", err.message)); // ✓

// ── MISTAKE 4: Catching too early — swallowing errors ──────

// BAD — .catch in the middle swallows error, chain continues
fetch("/api/data")
    .then(res => res.json())
    .catch(err => console.log("Caught but chain continues")) // swallows error!
    .then(data => processData(data)); // runs even after error — data = undefined

// GOOD — .catch at the END
fetch("/api/data")
    .then(res => res.json())
    .then(data => processData(data))
    .catch(err => console.log("Caught at end")); // ✓ doesn't interfere with chain

// ── MISTAKE 5: Nesting Promises (callback hell returns) ────

// BAD — nested .then (defeats the purpose of Promises)
getUser(1).then(user => {
    getPosts(user.id).then(posts => {      // nested inside!
        getComments(posts[0].id).then(comments => { // nested inside!
            console.log(comments);
        });
    });
});

// GOOD — flat chain (always return from .then)
getUser(1)
    .then(user  => getPosts(user.id))      // return → flat
    .then(posts => getComments(posts[0].id)) // return → flat
    .then(comments => console.log(comments));

// ── MISTAKE 6: Using Promise.all when one failure is ok ────

// BAD — one dashboard widget failing kills the whole dashboard
Promise.all([
    loadUserData(),       // if this fails...
    loadNotifications(),  // these results are lost
    loadRecommendations() // even if they succeeded
]).then(([user, notifs, recs]) => renderDashboard(user, notifs, recs));

// GOOD — use allSettled for independent operations
Promise.allSettled([
    loadUserData(),
    loadNotifications(),
    loadRecommendations()
]).then(([userResult, notifsResult, recsResult]) => {
    const user  = userResult.status  === "fulfilled" ? userResult.value  : null;
    const notifs = notifsResult.status === "fulfilled" ? notifsResult.value : [];
    const recs   = recsResult.status  === "fulfilled" ? recsResult.value  : [];
    renderDashboard(user, notifs, recs); // renders with whatever succeeded
});


// ============================================================
// SECTION 12: INTERVIEW QUESTIONS ON PROMISES
// ============================================================

// Q1: What is a Promise?
// An object representing the eventual result of an async operation.
// Can be pending, fulfilled, or rejected. Once settled, never changes.

// Q2: What is the difference between .then() and async/await?
// They're the same thing underneath — async/await is syntactic sugar
// over Promises. async/await is easier to read and write,
// especially for sequential async operations and error handling.

// Q3: Can a Promise be cancelled?
// No — standard Promises cannot be cancelled once created.
// Use AbortController to cancel fetch requests.
// Or use external libraries (RxJS Observables support cancellation).

// Q4: What happens if you throw inside .then()?
// The returned Promise rejects with that error.
// Execution jumps to the next .catch() in the chain.

// Q5: Difference between Promise.all and Promise.allSettled?
// Promise.all:        rejects immediately if ANY rejects
// Promise.allSettled: waits for ALL, gives results for each (never rejects)

// Q6: What is Promise chaining?
// .then() always returns a NEW Promise. Returning a value from .then()
// resolves that new Promise with that value. Returning a Promise
// makes the chain wait for that Promise to settle.

// Q7: Predict the output:
console.log("1");
Promise.resolve()
    .then(() => console.log("2"))
    .then(() => console.log("3"));
console.log("4");
// Output: 1 → 4 → 2 → 3
// 1, 4 are synchronous — run first
// 2, 3 are microtasks — run after ALL sync code

// Q8: What is the difference between reject(value) and throw?
// Inside a Promise constructor or .then() callback:
// reject(err) — explicitly rejects the Promise
// throw err   — also rejects the Promise
// Both result in the same behavior — .catch() gets called
// OUTSIDE a Promise callback: throw is a regular sync error — must try/catch

// Q9: Why should you always pass an Error to reject()?
// reject("string") — no stack trace, harder to debug
// reject(new Error("string")) — full stack trace, instanceof checks work,
//                               consistent with try/catch behavior

// Q10: What is Promise.resolve() used for?
// Creates an already-fulfilled Promise.
// Useful for: wrapping sync values in Promises for consistent interfaces,
// testing, providing default/cached values while sometimes fetching live.


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// CREATE:
//   new Promise((resolve, reject) => { ... })
//   Promise.resolve(value)   → instant fulfilled
//   Promise.reject(error)    → instant rejected
//
// CONSUME:
//   .then(val  => ...)        → runs on fulfill
//   .catch(err => ...)        → runs on reject
//   .finally(()  => ...)      → runs always (no arguments)
//
// CHAIN RULES:
//   return value    → next .then gets value
//   return Promise  → next .then waits for it
//   throw error     → jumps to .catch
//   no return       → next .then gets undefined (COMMON BUG)
//
// COMBINATORS:
//   Promise.all([...])         → all succeed or fail together
//   Promise.allSettled([...])  → all run, get every result
//   Promise.race([...])        → first to settle wins
//   Promise.any([...])         → first to succeed wins
//
// STATES:
//   pending → fulfilled  (resolve called)
//   pending → rejected   (reject called or throw)
//   Once settled: NEVER changes
//
// GOLDEN RULES:
// 1. ALWAYS return inside .then() — forgetting return breaks the chain
// 2. ALWAYS have .catch() at the end — unhandled rejections crash apps
// 3. Pass new Error() to reject() — not a plain string
// 4. .finally() has no arguments — use .then/.catch for values
// 5. Promise.all for "all or nothing" — Promise.allSettled for independent ops
// 6. Don't nest .then() — return Promises to keep the chain flat
// 7. Don't wrap existing Promises in new Promise() — return them directly
// 8. Microtasks (Promises) always run before macrotasks (setTimeout)
// 9. First resolve/reject call wins — subsequent ones are ignored
// 10. async/await is Promise sugar — understanding Promises is still essential