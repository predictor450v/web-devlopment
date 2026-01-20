// Function declaration named 'nice' that takes one parameter 'name'
function nice(name) {
    // It prints four different personalized messages using the 'name' passed
    console.log("Hey " + name + " you are nice!")
    console.log("Hey " + name + " you are good!")
    console.log("Hey " + name + " your tshirt is nice!")
    console.log("Hey " + name + " your course is good too!")
}

// Function named 'sum' that takes three parameters: a, b, and c
// 'c' has a default value of 3, meaning if no value is passed for 'c', it will be 3
function sum(a, b, c = 3) {
    // This line prints the values of a, b, and c for debugging or observation
    console.log(a, b, c)
    // Returns the sum of a, b, and c
    return a + b + c
}

// Calling the sum function with two arguments; c will take the default value 3
result1 = sum(3, 2)       // a=3, b=2, c=3 => 3+2+3 = 8
// Another call with two arguments; c takes default value again
result2 = sum(7, 5)       // a=7, b=5, c=3 => 7+5+3 = 15
// Here, all three arguments are provided, so default value is not used
result3 = sum(3, 13, 1)   // a=3, b=13, c=1 => 3+13+1 = 17

// Printing the results of each function call
console.log("The sum of these numbers is: ", result1) // Output: 8
console.log("The sum of these numbers is: ", result2) // Output: 15
console.log("The sum of these numbers is: ", result3) // Output: 17

// Declaring an arrow function 'func1' that takes one argument 'x'
const func1 = (x) => {
    // Prints a message along with the passed value
    console.log("I am an arrow function", x)
}

// Calling the arrow function with different arguments
func1(34); // Output: I am an arrow function 34
func1(66); // Output: I am an arrow function 66
func1(84); // Output: I am an arrow function 84
