/*
========================================================
📘 COMPLETE STRING METHODS IN JAVASCRIPT (DEEP GUIDE)
========================================================

JavaScript strings are one of the most fundamental data types.

👉 KEY THEORY:
- Strings are sequences of characters (UTF-16 encoded)
- Strings are IMMUTABLE → cannot be changed after creation
- Any operation returns a NEW string (original stays same)

Example:
let str = "hello";
str[0] = "H"; ❌ (won't work)

========================================================
🔹 1. BASIC STRING & INDEXING
========================================================
*/

console.log("🔤 This is a complete string methods tutorial");

let a = "Harry";

/*
📌 THEORY:
- Strings are indexed starting from 0
- Each character has a position (index)
- You can access characters using [] or charAt()

Visualization:
Index:   0   1   2   3   4
String:  H   a   r   r   y
*/

console.log("Character at index 0:", a[0]); // H
console.log("Character at index 1:", a[1]); // a

/*
📌 length property:
- Returns total number of characters
- Includes spaces and special characters
*/
console.log("Length of string:", a.length); // 5


/*
========================================================
🔹 2. STRING CONCATENATION
========================================================
*/

let real_name = "Harry";
let friend = "Rohan";

/*
📌 METHOD 1: Using + operator (old method)
- Works fine but becomes messy in large strings
*/
console.log("Using +:", "His name is " + real_name + " and his friend's name is " + friend);

/*
📌 METHOD 2: Template Literals (ES6+)
- Uses backticks ``
- Allows embedding variables using ${}
- Cleaner and industry standard
*/
console.log(`Using template literals: His name is ${real_name} and his friend's name is ${friend}`);

/*
💡 ADVANCED:
Template literals support multiline strings and expressions:
*/
console.log(`Sum example: ${2 + 3}`); // 5


/*
========================================================
🔹 3. CASE CONVERSION METHODS
========================================================
*/

let b = "ShivamSh";

/*
📌 toUpperCase():
- Converts all characters → uppercase
*/
console.log("Uppercase:", b.toUpperCase());

/*
📌 toLowerCase():
- Converts all characters → lowercase
*/
console.log("Lowercase:", b.toLowerCase());

/*
💡 USE CASE:
- Form validation
- Case-insensitive comparisons
*/
console.log("Compare:", "HELLO".toLowerCase() === "hello"); // true


/*
========================================================
🔹 4. SLICING (SUBSTRING EXTRACTION)
========================================================
*/

/*
📌 slice(start, end)
- Extracts part of string
- start → inclusive
- end → exclusive
*/

console.log("Slice(1, 5):", b.slice(1, 5)); // hiva

/*
📌 slice(start)
- Extracts from start to end
*/
console.log("Slice(1):", b.slice(1));

/*
💡 EDGE CASE:
Negative indexing (counts from end)
*/
console.log("Slice(-2):", b.slice(-2)); // Sh


/*
========================================================
🔹 5. REPLACE METHOD
========================================================
*/

/*
📌 replace(old, new)
- Replaces FIRST occurrence only
*/
console.log("Replace 'Sh' with '77':", b.replace("Sh", "77"));

/*
💡 IMPORTANT:
- Only replaces first match
- Use regex /g for global replace
*/
console.log("Replace all 'Sh':", b.replace(/Sh/g, "77"));


/*
========================================================
🔹 6. CONCAT METHOD
========================================================
*/

/*
📌 concat()
- Combines multiple strings
- Alternative to +
*/
console.log("Concatenated string:", b.concat(a, "Aishwariya", "Rahul", "Priya"));


/*
========================================================
🔹 7. STRING IMMUTABILITY
========================================================
*/

/*
📌 THEORY:
- Strings cannot be modified directly
- All methods return NEW string

Example:
*/
let test = "hello";
test.toUpperCase();

console.log("Original string still same:", test); // hello


/*
========================================================
🔹 8. TRIM (IMPORTANT FOR FORMS)
========================================================
*/

let nameWithSpaces = "   Harry   ";

/*
📌 trim()
- Removes whitespace from BOTH ends
*/
console.log("Trimmed string:", nameWithSpaces.trim());

/*
Also:
trimStart() → removes from beginning
trimEnd() → removes from end
*/


/*
========================================================
🔹 9. SEARCH METHODS
========================================================
*/

let sentence = "JavaScript is amazing";

/*
📌 includes()
- Returns true/false
*/
console.log("Includes 'Script':", sentence.includes("Script"));

/*
📌 startsWith()
*/
console.log("Starts with 'Java':", sentence.startsWith("Java"));

/*
📌 endsWith()
*/
console.log("Ends with 'ing':", sentence.endsWith("ing"));


/*
========================================================
🔹 10. INDEX SEARCHING
========================================================
*/

let msg = "hello world";

/*
📌 indexOf()
- Returns FIRST occurrence
*/
console.log("First index of 'o':", msg.indexOf("o"));

/*
📌 lastIndexOf()
- Returns LAST occurrence
*/
console.log("Last index of 'o':", msg.lastIndexOf("o"));

/*
💡 If not found → returns -1
*/
console.log("Not found:", msg.indexOf("z")); // -1


/*
========================================================
🔹 11. CHARACTER ACCESS
========================================================
*/

let user = "Sam";

/*
📌 charAt(index)
- Alternative to []
*/
console.log("Character at index 1:", user.charAt(1));


/*
========================================================
🔹 12. SPLIT METHOD (VERY IMPORTANT)
========================================================
*/

let data = "apple,banana,cherry";

/*
📌 split(delimiter)
- Converts string → array
*/
console.log("Split by comma:", data.split(","));

/*
💡 REAL USE CASE:
- CSV parsing
- User input processing
*/
console.log("Split into characters:", "hello".split("")); 


/*
========================================================
🔹 13. REPEAT METHOD
========================================================
*/

let x = "Hi! ";

/*
📌 repeat(n)
- Repeats string n times
*/
console.log("Repeated 3 times:", x.repeat(3));


/*
========================================================
🔹 14. REGEX MATCH (ADVANCED)
========================================================
*/

let log = "Error: ID#234 not found";

/*
📌 match(regex)
- Extracts patterns

Regex:
\d → digit
+  → one or more
*/
console.log("Regex match digits:", log.match(/\d+/));

/*
💡 USE CASE:
- Extract numbers
- Validate emails
- Pattern matching
*/


/*
========================================================
🔹 15. PADDING (IMPORTANT FOR UI)
========================================================
*/

let num = "5";

/*
📌 padStart(length, char)
*/
console.log("padStart:", num.padStart(3, "0")); // 005

/*
📌 padEnd(length, char)
*/
console.log("padEnd:", num.padEnd(3, "*")); // 5**


/*
========================================================
🚀 FINAL SUMMARY (INTERVIEW READY)
========================================================

MOST IMPORTANT METHODS:
- slice() → substring extraction
- includes() → search
- indexOf() → position
- split() → string → array
- replace() → modify content
- trim() → clean input
- toUpperCase() / toLowerCase()

ADVANCED:
- match() → regex
- padStart() / padEnd() → formatting

CORE CONCEPT:
👉 Strings are IMMUTABLE → always return new string

========================================================
*/