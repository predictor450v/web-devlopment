// 🧱 1. Creating Arrays
let fruits = ["apple", "banana", "cherry", "date"];

// ✅ Arrays are zero-indexed: indexes start from 0
console.log(fruits[0]); // Output: apple
console.log(fruits[1]); // Output: banana

// 🔄 2. Modifying Elements
fruits[1] = "blueberry"; // Replacing "banana" with "blueberry"
console.log(fruits);     // ["apple", "blueberry", "cherry", "date"]

// 📏 3. Array Length
console.log(fruits.length); // Output: 4 (number of elements in array)

// 🧰 4. Commonly Used Array Methods

// push() ➝ Adds element to end
fruits.push("elderberry");
console.log(fruits); // ["apple", "blueberry", "cherry", "date", "elderberry"]

// pop() ➝ Removes last element
fruits.pop();
console.log(fruits); // ["apple", "blueberry", "cherry", "date"]

// unshift() ➝ Adds element to beginning
fruits.unshift("avocado");
console.log(fruits); // ["avocado", "apple", "blueberry", "cherry", "date"]

// shift() ➝ Removes first element
fruits.shift();
console.log(fruits); // ["apple", "blueberry", "cherry", "date"]

// indexOf() ➝ Finds index of an element
console.log(fruits.indexOf("cherry")); // Output: 2

// includes() ➝ Checks if element exists
console.log(fruits.includes("banana")); // false

// slice(start, end) ➝ Returns a sub-array (end not included)
console.log(fruits.slice(1, 3)); // Output: ["blueberry", "cherry"]

// splice(start, deleteCount, newItem) ➝ Remove/replace/add items
fruits.splice(2, 1, "coconut"); // Replaces "cherry" with "coconut"
console.log(fruits); // ["apple", "blueberry", "coconut", "date"]

// reverse() ➝ Reverses array in-place
fruits.reverse();
console.log(fruits); // ["date", "coconut", "blueberry", "apple"]

// sort() ➝ Sorts alphabetically by default
fruits.sort();
console.log(fruits); // ["apple", "blueberry", "coconut", "date"]

// join() ➝ Converts array to string with a delimiter
console.log(fruits.join(", ")); // Output: "apple, blueberry, coconut, date"

// concat() ➝ Merges two arrays
let veggies = ["carrot", "potato"];
let food = fruits.concat(veggies);
console.log(food); // ["apple", "blueberry", "coconut", "date", "carrot", "potato"]

// map() ➝ Creates new array by applying function to each item
let upperFruits = fruits.map(item => item.toUpperCase());
console.log(upperFruits); // ["APPLE", "BLUEBERRY", "COCONUT", "DATE"]

// filter() ➝ Creates new array with items that match condition
let longFruits = fruits.filter(item => item.length > 5);
console.log(longFruits); // ["blueberry", "coconut"]

// find() ➝ Returns first element matching condition
let firstC = fruits.find(item => item.startsWith("c"));
console.log(firstC); // coconut

// reduce() ➝ Reduces array to a single value (like sum)
let numbers = [1, 2, 3, 4];
let total = numbers.reduce((acc, val) => acc + val, 0);
console.log(total); // 10

// 🌀 5. Looping through Arrays

// for loop
console.log("Using for loop:");
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// for...of loop ➝ Modern and clean
console.log("Using for...of loop:");
for (let fruit of fruits) {
    console.log(fruit);
}

// forEach() ➝ Preferred for short iterations
console.log("Using forEach loop:");
fruits.forEach((item, index) => {
    console.log(index, item);
});
