
// ============================================================
// JAVASCRIPT ARRAY METHODS — Complete Study Guide
// ============================================================
// Arrays store lists of data. But storing data is only half the job.
// The real power is in TRANSFORMING, FILTERING, and ITERATING that data.
//
// JS gives you built-in array methods so you don't write loops manually.
// These 4 methods cover 90% of real-world array work:
//
//   forEach — loop through, DO something with each item (no new array)
//   filter  — loop through, KEEP items that pass a test (new array)
//   map     — loop through, TRANSFORM each item (new array, same length)
//   reduce  — loop through, COLLAPSE everything into ONE value
//
// Mental models:
//   forEach = "for each item, do this action"
//   filter  = "give me only the items that pass this test"
//   map     = "transform every item and give me a new list"
//   reduce  = "combine everything into one final result"


// ============================================================
// SECTION 1: forEach — LOOP WITHOUT A RETURN VALUE
// ============================================================
// forEach is a replacement for a basic for loop.
// It calls a function once for each item in the array.
//
// CRITICAL RULE: forEach ALWAYS returns undefined — no exceptions.
// It is designed only for SIDE EFFECTS (printing, saving, updating DOM).
// If you need a result back, use map, filter, or reduce instead.

const coding = ["js", "ruby", "java", "python", "cpp"];

// Basic forEach
coding.forEach((item) => {
    console.log(item); // side effect — prints each language
});

// forEach with index (second parameter)
coding.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`); // 1. js, 2. ruby, etc.
});

// forEach with index AND the full array (third parameter — rarely used)
coding.forEach((item, index, arr) => {
    console.log(`${item} is item ${index} of ${arr.length}`);
});

// --- WHY forEach returns undefined — this is the trap in the original code ---
const values = coding.forEach((item) => {
    return item; // you THINK this return goes somewhere — it doesn't!
                 // forEach ignores whatever you return from the callback
});
console.log(values); // undefined — forEach never gives back a new array
// The return inside forEach only exits that ONE callback call,
// it doesn't make forEach itself return anything.
// USE MAP when you want a transformed array back.

// --- forEach with an array of objects (very common in real projects) ---
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob",   age: 30 },
    { name: "Carol", age: 22 }
];
users.forEach((user) => {
    console.log(`${user.name} is ${user.age} years old`);
});

// --- forEach cannot be stopped midway ---
// You cannot use break or return to exit forEach early.
// If you need to stop early, use a regular for loop or for...of instead.
coding.forEach((item) => {
    if (item === "java") return; // this only skips THIS iteration (like continue)
                                  // it does NOT stop the whole forEach
    console.log(item);
});
// prints: js, ruby, python, cpp  (java is skipped, but loop continues)


// ============================================================
// SECTION 2: filter — KEEP ITEMS THAT PASS A TEST
// ============================================================
// filter creates a NEW array containing only the items where
// your callback function returns TRUE.
//
// Rules:
//   - Returns true  → item IS included in the new array
//   - Returns false → item is EXCLUDED from the new array
//   - Original array is NEVER modified
//   - Result can be empty [] if nothing passes
//   - Result can be same length if everything passes

const myNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Basic filter — keep numbers greater than 4
const greaterThanFour = myNums.filter((num) => num > 4);
console.log(greaterThanFour); // [5, 6, 7, 8, 9, 10]

// --- filter vs forEach for the same task ---
// Both produce the same result, but filter is the RIGHT tool here:

// Method 1: forEach + manual push (verbose, 3 lines, easy to make mistakes)
const manualFiltered = [];
myNums.forEach((num) => {
    if (num > 4) {
        manualFiltered.push(num); // manually building the array
    }
});
console.log(manualFiltered); // [5, 6, 7, 8, 9, 10]

// Method 2: filter (clean, 1 line, intention is clear)
const cleanFiltered = myNums.filter((num) => num > 4);
console.log(cleanFiltered); // [5, 6, 7, 8, 9, 10]
// Prefer filter — it communicates intent, it's shorter, and less error-prone.

// --- Multiple conditions in filter ---
const evenAndGreaterThanFour = myNums.filter((num) => num > 4 && num % 2 === 0);
console.log(evenAndGreaterThanFour); // [6, 8, 10]

// --- filter on array of objects (the most common real-world use) ---
const books = [
    { title: 'Book One',   genre: 'Fiction',     publish: 1981, edition: 2004 },
    { title: 'Book Two',   genre: 'Non-Fiction',  publish: 1992, edition: 2008 },
    { title: 'Book Three', genre: 'History',      publish: 1999, edition: 2007 },
    { title: 'Book Four',  genre: 'Non-Fiction',  publish: 1989, edition: 2010 },
    { title: 'Book Five',  genre: 'Science',      publish: 2009, edition: 2014 },
    { title: 'Book Six',   genre: 'Fiction',      publish: 1987, edition: 2010 },
    { title: 'Book Seven', genre: 'History',      publish: 1986, edition: 1996 },
    { title: 'Book Eight', genre: 'Science',      publish: 2011, edition: 2016 },
    { title: 'Book Nine',  genre: 'Non-Fiction',  publish: 1981, edition: 1989 },
];

// Single condition — all History books
let historyBooks = books.filter((bk) => bk.genre === 'History');
console.log("History books:", historyBooks);
// Book Three (1999) and Book Seven (1986)

// Multiple conditions — History books published after 1995
// Both conditions must be true → use &&
let recentHistoryBooks = books.filter((bk) => {
    return bk.publish >= 1995 && bk.genre === "History";
});
console.log("Recent History:", recentHistoryBooks);
// Only Book Three (History, published 1999) — Book Seven was 1986

// OR condition — Fiction OR Science books
let fictionOrScience = books.filter((bk) =>
    bk.genre === "Fiction" || bk.genre === "Science"
);
console.log("Fiction or Science:", fictionOrScience.length); // 4 books

// Books published between 1985 and 2000 (range filter)
let vintageBooks = books.filter((bk) =>
    bk.publish >= 1985 && bk.publish <= 2000
);
console.log("Vintage books (1985-2000):", vintageBooks.length); // 6 books

// Latest edition (edition after 2010)
let newEditions = books.filter((bk) => bk.edition > 2010);
console.log("New editions:", newEditions.map(b => b.title));
// Book Five, Book Eight


// ============================================================
// SECTION 3: map — TRANSFORM EVERY ITEM
// ============================================================
// map creates a NEW array by applying a transformation to EVERY item.
// Unlike filter (which removes items), map KEEPS all items but changes them.
// The new array is always the SAME LENGTH as the original.
//
// Real world: you have prices in USD, you want them in INR.
// You have names in lowercase, you want them capitalized.
// You have an array of objects, you want just one field from each.

const prices = [100, 200, 300, 400, 500];

// Transform: convert every price to INR (multiply by 83)
const pricesInINR = prices.map((price) => price * 83);
console.log(pricesInINR); // [8300, 16600, 24900, 33200, 41500]

// Transform: add tax to every price
const withTax = prices.map((price) => Math.round(price * 1.18));
console.log(withTax); // [118, 236, 354, 472, 590]

// Transform: extract just one field from each object
const bookTitles = books.map((bk) => bk.title);
console.log(bookTitles);
// ["Book One", "Book Two", "Book Three", ...]

// Transform: create a new object from each item (reshape data)
const bookSummaries = books.map((bk) => ({
    // parentheses needed around {} so JS doesn't think it's a function body
    name:  bk.title,
    year:  bk.publish,
    old:   bk.publish < 1990 // adds a new computed field
}));
console.log(bookSummaries[0]); // { name: "Book One", year: 1981, old: true }

// Transform: uppercase every string
const languages = ["javascript", "python", "rust", "go"];
const upperLangs = languages.map((lang) => lang.toUpperCase());
console.log(upperLangs); // ["JAVASCRIPT", "PYTHON", "RUST", "GO"]


// ============================================================
// SECTION 4: CHAINING — filter + map TOGETHER
// ============================================================
// Since filter and map both return new arrays, you can chain them.
// Chain = call the next method directly on the result of the previous.
// This is one of the most powerful patterns in modern JS.
//
// Read chained methods TOP TO BOTTOM — each step feeds into the next.

// Step 1: filter → keep only Science books
// Step 2: map    → extract just the title from each remaining book
const scienceTitles = books
    .filter((bk) => bk.genre === "Science")  // [Book Five, Book Eight]
    .map((bk) => bk.title);                   // ["Book Five", "Book Eight"]
console.log(scienceTitles); // ["Book Five", "Book Eight"]

// More complex chain: filter recent Non-Fiction → get title + year formatted
const recentNonFiction = books
    .filter((bk) => bk.genre === "Non-Fiction" && bk.publish >= 1990)
    .map((bk) => `${bk.title} (${bk.publish})`);
console.log(recentNonFiction); // ["Book Two (1992)"]

// Filter numbers → double them → keep only those above 10
const result = myNums
    .filter((n) => n % 2 === 0)  // [2, 4, 6, 8, 10] — even numbers
    .map((n) => n * 2)            // [4, 8, 12, 16, 20] — doubled
    .filter((n) => n > 10);       // [12, 16, 20] — above 10
console.log(result); // [12, 16, 20]


// ============================================================
// SECTION 5: reduce — COLLAPSE ARRAY INTO ONE VALUE
// ============================================================
// reduce processes every item and ACCUMULATES a single result.
// That result can be a number, string, object, or even a new array.
//
// Syntax: array.reduce((accumulator, currentItem) => {
//             return updatedAccumulator;
//         }, initialValue)
//
// accumulator = the running result (starts as initialValue)
// currentItem = the current array element being processed
// initialValue = what accumulator starts as (always provide this!)

const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, num) => acc + num, 0);
// Round 1: acc=0,  num=1 → return 1
// Round 2: acc=1,  num=2 → return 3
// Round 3: acc=3,  num=3 → return 6
// Round 4: acc=6,  num=4 → return 10
// Round 5: acc=10, num=5 → return 15
console.log("Sum:", sum); // 15

// Find the maximum value
const maxVal = numbers.reduce((acc, num) => num > acc ? num : acc, 0);
console.log("Max:", maxVal); // 5

// Total cart value using reduce on array of objects
const cart = [
    { item: "Book",   price: 299, qty: 2 },
    { item: "Pen",    price:  49, qty: 5 },
    { item: "Bag",    price: 999, qty: 1 }
];
const cartTotal = cart.reduce((total, product) => {
    return total + (product.price * product.qty); // price × quantity for each
}, 0);
console.log("Cart total: ₹" + cartTotal); // ₹1842

// Count occurrences — reduce into an OBJECT (not just a number)
const genres = books.map((bk) => bk.genre); // extract all genres first
const genreCount = genres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1; // if key exists, increment — else start at 1
    return acc;
}, {}); // start with empty object
console.log(genreCount);
// { Fiction: 2, 'Non-Fiction': 3, History: 2, Science: 2 }


// ============================================================
// SECTION 6: CHOOSING THE RIGHT METHOD
// ============================================================
//
//  QUESTION                              → METHOD
//  ──────────────────────────────────────────────────────────
//  I want to DO something with each item → forEach
//  I want to KEEP some items             → filter
//  I want to CHANGE every item           → map
//  I want ONE final value from all items → reduce
//  I want to filter THEN transform       → filter + map (chained)
//  ──────────────────────────────────────────────────────────

// Quick decision test with books array:

// "Print all book titles"         → forEach (side effect only)
books.forEach((bk) => console.log(bk.title));

// "Get all books after year 2000" → filter (keep some)
const modernBooks = books.filter((bk) => bk.publish > 2000);

// "Get just the titles as array"  → map (transform shape)
const titles = books.map((bk) => bk.title);

// "Count total books"             → reduce (one final number)
const bookCount = books.reduce((count) => count + 1, 0);
console.log(bookCount); // 9

// "Get titles of modern books"    → filter + map (chain)
const modernTitles = books
    .filter((bk) => bk.publish > 2000)
    .map((bk) => bk.title);
console.log(modernTitles); // ["Book Five", "Book Eight"]


// ============================================================
// SECTION 7: COMMON MISTAKES TO AVOID
// ============================================================

// MISTAKE 1: Expecting forEach to return something
const wrong = [1, 2, 3].forEach((n) => n * 2);
console.log(wrong); // undefined — use map instead!
const right = [1, 2, 3].map((n) => n * 2);
console.log(right); // [2, 4, 6] ✓

// MISTAKE 2: Forgetting {} needs () in arrow function returning object
const badMap  = books.map((bk) => { title: bk.title });
// JS sees {} as function body, not object — returns undefined for each
console.log(badMap[0]); // undefined

const goodMap = books.map((bk) => ({ title: bk.title }));
// Wrapping {} in () tells JS "this is an object, not a function body"
console.log(goodMap[0]); // { title: "Book One" } ✓

// MISTAKE 3: Not providing initialValue in reduce
// Without initialValue, reduce uses first element as accumulator
// Works for simple sums but breaks for objects
const sumBad  = [1, 2, 3].reduce((acc, n) => acc + n);    // works (3 iterations)
const sumGood = [1, 2, 3].reduce((acc, n) => acc + n, 0); // safer (4 iterations)
// Always provide initialValue to avoid edge cases with empty arrays

// MISTAKE 4: Modifying original array inside map/filter
// These methods should NOT change the original — they create new ones
const original = [1, 2, 3, 4, 5];
const modified = original.map((n) => {
    // original[0] = 999; // ← never do this inside map/filter — side effect!
    return n * 2;         // only return the transformed value
});
console.log(original); // [1, 2, 3, 4, 5] — untouched ✓
console.log(modified); // [2, 4, 6, 8, 10] ✓


// ============================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================
//
// forEach(item => { })
//   → returns undefined always
//   → use for printing, saving, DOM updates
//   → cannot stop early (no break)
//
// filter(item => condition)
//   → returns NEW array of items where condition is true
//   → original unchanged, length can be shorter
//
// map(item => newItem)
//   → returns NEW array of transformed items
//   → original unchanged, length ALWAYS same
//   → wrap returned objects in (): map(x => ({ key: x }))
//
// reduce((acc, item) => newAcc, initialValue)
//   → returns ONE final value (number, string, object)
//   → always provide initialValue (second argument)
//
// GOLDEN RULES:
// 1. forEach = side effects only — never expect a return value
// 2. filter and map never modify the original array
// 3. Chain filter + map for "get some items transformed"
// 4. Always give reduce an initialValue — avoids edge case bugs
// 5. map always gives back same number of items as input
// 6. Returning object from arrow fn needs parentheses: => ({ })=