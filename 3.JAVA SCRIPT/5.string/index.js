console.log("🔤 This is a complete string methods tutorial");

// ✅ Basic string and indexing
let a = "Harry";

// Access individual characters by index (0-based)
console.log("Character at index 0:", a[0]); // Output: H
console.log("Character at index 1:", a[1]); // Output: a
console.log("Length of string:", a.length); // Output: 5 (total number of characters)

// ✅ String concatenation using + and template literals
let real_name = "Harry";
let friend = "Rohan";

// Using + operator (traditional)
console.log("Using +:", "His name is " + real_name + " and his friend's name is " + friend);

// Using template literals (modern, cleaner, recommended)
console.log(`Using template literals: His name is ${real_name} and his friend's name is ${friend}`);

// ✅ Case conversion methods
let b = "ShivamSh";

// Converts all letters to uppercase
console.log("Uppercase:", b.toUpperCase()); // Output: SHIVAMSH

// Converts all letters to lowercase
console.log("Lowercase:", b.toLowerCase()); // Output: shivamsh

// ✅ Slicing strings
// Extracts characters from index 1 to 4 (end is exclusive)
console.log("Slice(1, 5):", b.slice(1, 5)); // Output: hiva

// Extracts from index 1 to the end
console.log("Slice(1):", b.slice(1)); // Output: hivamSh

// ✅ Replacing substrings
// Replaces the first occurrence of "Sh" with "77"
console.log("Replace 'Sh' with '77':", b.replace("Sh", "77")); // Output: 77ivamSh

// ✅ Concatenating multiple strings
// Combines several strings using .concat()
console.log("Concatenated string:", b.concat(a, "Aishwariya", "Rahul", "Priya"));

// ✅ String immutability
// Strings in JavaScript are immutable — the original string is not changed
console.log("Original string (unchanged):", b); // Output: ShivamSh

// ✅ Additional and Industry-Relevant Methods

// .trim() — removes spaces from both ends (commonly used in form inputs)
let nameWithSpaces = "   Harry   ";
console.log("Trimmed string:", nameWithSpaces.trim()); // Output: "Harry"

// .includes() — checks if a substring exists (returns true/false)
let sentence = "JavaScript is amazing";
console.log("Includes 'Script':", sentence.includes("Script")); // Output: true

// .startsWith() — checks if string starts with a given substring
console.log("Starts with 'Java':", sentence.startsWith("Java")); // Output: true

// .endsWith() — checks if string ends with a given substring
console.log("Ends with 'ing':", sentence.endsWith("ing")); // Output: true

// .indexOf() — returns first index of a character or substring
let msg = "hello world";
console.log("First index of 'o':", msg.indexOf("o")); // Output: 4

// .lastIndexOf() — returns last index of a character or substring
console.log("Last index of 'o':", msg.lastIndexOf("o")); // Output: 7

// .charAt() — returns the character at a specified index
let user = "Sam";
console.log("Character at index 1:", user.charAt(1)); // Output: a

// .split() — splits the string into an array by a given delimiter
let data = "apple,banana,cherry";
console.log("Split by comma:", data.split(",")); // Output: ["apple", "banana", "cherry"]

// .repeat() — repeats the string N times
let x = "Hi! ";
console.log("Repeated 3 times:", x.repeat(3)); // Output: Hi! Hi! Hi! 

// .match() — extracts pattern using regular expressions
let log = "Error: ID#234 not found";
// This regex looks for digits (\d+ means one or more digits)
console.log("Regex match digits:", log.match(/\d+/)); // Output: ["234"]

// .padStart() — pads string from start to reach a certain length
let num = "5";
console.log("padStart to length 3 with '0':", num.padStart(3, "0")); // Output: "005"

// .padEnd() — pads string from end
console.log("padEnd to length 3 with '*':", num.padEnd(3, "*")); // Output: "5**"
