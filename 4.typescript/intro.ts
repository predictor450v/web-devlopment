// --- user.service.ts ---

// 1. We define a 'Type' or 'Interface' to strictly enforce the shape of our data.
// This acts as a contract for our code.
interface User {
    id: number;
    name: string;
    email: string;
    isActive?: boolean; // The '?' makes this property optional
}

// 2. We explicitly state that this function takes a 'User' object as an argument,
// and we promise it will return a 'string'.
function generateWelcomeMessage(user: User): string {
    // If we try to use a method that doesn't exist on a string, TS will yell at us here.
    const lowerCaseEmail = user.email.toLowerCase(); 
    
    return `Welcome ${user.name}! Your account under ${lowerCaseEmail} is ready.`;
}

// --- The JavaScript Way (Prone to errors) ---
// In JS, you could pass ANYTHING into this function:
// generateWelcomeMessage({ name: "Alice" }) -> CRASH! (email is undefined, can't call toLowerCase)

// --- The TypeScript Way (Safe) ---

// Correct usage:
const validUser: User = {
    id: 1,
    name: "Ayushman",
    email: "ayushman@example.com",
    isActive: true
};
console.log(generateWelcomeMessage(validUser)); 

// ERROR DEMONSTRATION (Uncommenting the below code would cause a compile error):
/*
const invalidUser = {
    id: 2,
    name: "John",
    // Missing the required 'email' property!
};

// TypeScript Error: Argument of type '{ id: number; name: string; }' is not assignable to parameter of type 'User'.
// Property 'email' is missing...
generateWelcomeMessage(invalidUser); 
*/