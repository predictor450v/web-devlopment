/**
 * ejs-explained.ts
 *
 * EJS — Embedded JavaScript Templates
 * =====================================
 * Complete guide with easy examples.
 *
 * ANALOGY used throughout:
 * EJS is like a FORM LETTER template.
 * "Dear [NAME], your order [ORDER_ID] is ready."
 * You fill in the blanks with real data at runtime.
 * EJS does this but for HTML pages.
 */

// ═════════════════════════════════════════════════════════════
// 1. WHAT IS EJS?
// ═════════════════════════════════════════════════════════════
//
// EJS = Embedded JavaScript
//
// It is a TEMPLATE ENGINE — it lets you write HTML with
// JavaScript embedded inside it.
//
// Without EJS:
//   You'd have to build HTML strings manually in JavaScript:
//   const html = '<h1>' + user.name + '</h1>';  ← ugly, error-prone
//
// With EJS:
//   You write normal HTML, just add <%= user.name %> where
//   you want dynamic data. EJS fills it in at runtime.
//
// HOW IT WORKS:
//
//   Server (Express)                    Browser
//   ────────────────                    ───────
//   1. Gets a request
//   2. Fetches data (from DB etc.)
//   3. Passes data to EJS template
//   4. EJS fills in the blanks → HTML ──────────► User sees the page
//
// This is called SERVER-SIDE RENDERING (SSR).
// The server builds the full HTML before sending it.
// (React/Vue do CLIENT-SIDE rendering — the browser builds it)
//
// IMPORTANT POINTS:
//   ✦ EJS files have .ejs extension but contain plain HTML + JS tags
//   ✦ EJS runs on the SERVER, not in the browser
//   ✦ ~6 million npm downloads per week — very widely used
//   ✦ Zero dependencies, ~119kb — very lightweight
//   ✦ You already know JS? You already know EJS.

// ═════════════════════════════════════════════════════════════
// 2. INSTALLATION & SETUP
// ═════════════════════════════════════════════════════════════
//
// INSTALL:
//   npm install ejs
//   npm install express
//
// SETUP in Express (app.ts / app.js):
//
//   import express from 'express';
//   import path from 'path';
//
//   const app = express();
//
//   // Tell Express: "use EJS as the template engine"
//   app.set('view engine', 'ejs');
//
//   // Tell Express: "look for .ejs files in the /views folder"
//   app.set('views', path.join(__dirname, 'views'));
//
// FOLDER STRUCTURE:
//
//   project/
//   ├── app.ts              ← Express server
//   ├── views/              ← ALL .ejs files go here
//   │   ├── index.ejs       ← home page
//   │   ├── books.ejs       ← books list page
//   │   ├── book-detail.ejs ← single book page
//   │   └── partials/       ← reusable pieces
//   │       ├── header.ejs
//   │       └── footer.ejs
//   └── public/             ← static files (CSS, images, JS)
//       └── style.css

// ═════════════════════════════════════════════════════════════
// 3. EJS TAGS — the syntax (most important part)
// ═════════════════════════════════════════════════════════════
//
// There are 6 tag types. Learn these and you know EJS.
//
// ┌─────────────┬──────────────────────────────────────────────┐
// │ Tag         │ What it does                                  │
// ├─────────────┼──────────────────────────────────────────────┤
// │ <%= %>      │ OUTPUT value (HTML escaped — SAFE)            │
// │ <%- %>      │ OUTPUT value (raw HTML — use for includes)    │
// │ <% %>       │ EXECUTE JavaScript (no output)                │
// │ <%# %>      │ COMMENT (not sent to browser)                 │
// │ <%_ %>      │ strips whitespace before tag                  │
// │ -%>         │ strips newline after tag                      │
// └─────────────┴──────────────────────────────────────────────┘
//
// THE TWO MOST IMPORTANT ONES:
//
//   <%= value %>   → show a value on the page (escaped)
//                    "escaped" means < > & are converted to safe chars
//                    Use this for USER DATA (prevents XSS attacks)
//
//   <%- html %>    → show raw HTML (NOT escaped)
//                    Use ONLY for trusted content like partials/includes
//                    NEVER use <%- %> with user input — XSS risk!
//
//   <% code %>     → run JavaScript but show nothing
//                    Use for if/else, loops, variable declarations

// ═════════════════════════════════════════════════════════════
// 4. PASSING DATA FROM EXPRESS TO EJS
// ═════════════════════════════════════════════════════════════
//
// res.render('templateName', { key: value, key2: value2 })
//
// The second argument is a plain object.
// Every key becomes a VARIABLE available in the .ejs file.
//
// Example:
//
//   // In Express route:
//   app.get('/profile', (req, res) => {
//     res.render('profile', {
//       name: 'Ayushman',
//       role: 'Admin',
//       isLoggedIn: true,
//     });
//   });
//
//   // In views/profile.ejs:
//   <h1>Hello, <%= name %>!</h1>        ← outputs: Hello, Ayushman!
//   <p>Role: <%= role %></p>             ← outputs: Role: Admin
//
// IMPORTANT POINTS:
//   ✦ res.render() automatically looks in the /views folder
//   ✦ Don't add .ejs extension: res.render('profile') not 'profile.ejs'
//   ✦ All keys in the object become local variables in the template
//   ✦ If you pass nothing, template gets no variables

import express from "express";
import path from "path";
import type { Request, Response } from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // serve CSS/images
app.use(express.json());

// ─── Data (pretend this comes from a DB) ─────────────────────

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  rating: number;
}

const books: Book[] = [
  { id: 1, title: "Clean Code",       author: "Robert Martin", genre: "Programming", available: true,  rating: 5 },
  { id: 2, title: "Harry Potter",     author: "J.K. Rowling",  genre: "Fiction",     available: false, rating: 5 },
  { id: 3, title: "Atomic Habits",    author: "James Clear",   genre: "Self-Help",   available: true,  rating: 4 },
  { id: 4, title: "The Alchemist",    author: "Paulo Coelho",  genre: "Fiction",     available: true,  rating: 4 },
];

// ═════════════════════════════════════════════════════════════
// 5. ROUTES — passing data to templates
// ═════════════════════════════════════════════════════════════

// HOME PAGE
app.get("/", (req: Request, res: Response): void => {
  res.render("index", {
    title: "Library Home",        // <%= title %> in template
    message: "Welcome to the Library!",
    totalBooks: books.length,
  });
});

// BOOKS LIST PAGE
app.get("/books", (req: Request, res: Response): void => {
  const { genre } = req.query;

  const filtered = genre
    ? books.filter((b) => b.genre === genre)
    : books;

  res.render("books", {
    title: "All Books",
    books: filtered,             // loop over this in template
    selectedGenre: genre || "All",
  });
});

// SINGLE BOOK PAGE
app.get("/books/:id", (req: Request<{ id: string }>, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);

  if (!book) {
    // Render a 404 page
    res.status(404).render("error", {
      title: "Not Found",
      message: `Book with id ${id} does not exist`,
    });
    return;
  }

  res.render("book-detail", {
    title: book.title,
    book,                        // entire book object
  });
});

// ═════════════════════════════════════════════════════════════
// 6. EJS TEMPLATE EXAMPLES
//    (These would be actual .ejs files in /views folder)
//    Shown here as comments so you can copy them
// ═════════════════════════════════════════════════════════════

// ─── views/index.ejs ─────────────────────────────────────────
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>   ← dynamic title from Express
</head>
<body>

  <%# This is an EJS comment — not sent to browser %>

  <%- include('partials/header') %>    ← include the header partial

  <h1><%= message %></h1>             ← outputs: Welcome to the Library!

  <p>We have <%= totalBooks %> books.</p>  ← outputs: We have 4 books.

  <a href="/books">Browse all books</a>

  <%- include('partials/footer') %>    ← include the footer partial

</body>
</html>
*/

// ─── views/books.ejs ─────────────────────────────────────────
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= title %></title>
</head>
<body>

  <%- include('partials/header') %>

  <h1>Books — <%= selectedGenre %></h1>

  <%# Filter links — plain HTML %>
  <nav>
    <a href="/books">All</a>
    <a href="/books?genre=Fiction">Fiction</a>
    <a href="/books?genre=Programming">Programming</a>
    <a href="/books?genre=Self-Help">Self-Help</a>
  </nav>

  <%# Conditional — show message if no books found %>
  <% if (books.length === 0) { %>
    <p>No books found for this genre.</p>
  <% } else { %>

    <%# Loop — render one card per book %>
    <% books.forEach(function(book) { %>
      <div class="book-card">
        <h2><%= book.title %></h2>
        <p>by <%= book.author %></p>
        <p>Genre: <%= book.genre %></p>

        <%# Conditional inside loop %>
        <% if (book.available) { %>
          <span class="badge green">Available</span>
        <% } else { %>
          <span class="badge red">Borrowed</span>
        <% } %>

        <%# Rating stars using loop %>
        <p>
          <% for (let i = 0; i < book.rating; i++) { %>
            ★
          <% } %>
        </p>

        <a href="/books/<%= book.id %>">View Details</a>
      </div>
    <% }); %>

  <% } %>

  <%- include('partials/footer') %>

</body>
</html>
*/

// ─── views/book-detail.ejs ───────────────────────────────────
/*
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>

  <%- include('partials/header') %>

  <h1><%= book.title %></h1>
  <p>Author: <%= book.author %></p>
  <p>Genre:  <%= book.genre %></p>

  <%# Ternary inside EJS %>
  <p>Status: <%= book.available ? 'Available' : 'Borrowed' %></p>

  <a href="/books">← Back to all books</a>

  <%- include('partials/footer') %>

</body>
</html>
*/

// ─── views/error.ejs ─────────────────────────────────────────
/*
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>Oops!</h1>
  <p><%= message %></p>
  <a href="/">Go Home</a>
</body>
</html>
*/

// ─── views/partials/header.ejs ───────────────────────────────
/*
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/books">Books</a>
  </nav>
  <hr>
</header>
*/

// ─── views/partials/footer.ejs ───────────────────────────────
/*
<footer>
  <hr>
  <p>&copy; 2025 Library App</p>
</footer>
*/

// ═════════════════════════════════════════════════════════════
// 7. PARTIALS — reusable template pieces
// ═════════════════════════════════════════════════════════════
//
// A PARTIAL is a small .ejs file you include in other templates.
// Use it for: header, footer, navbar, cards, modals
//
// Two ways to include:
//
//   <%- include('partials/header') %>
//   <%- include('partials/header', { title: 'Custom Title' }) %>
//                                    ↑ pass extra data to the partial
//
// WHY use <%- %> not <%= %> for includes?
//   <%- %> outputs RAW HTML (no escaping)
//   <%= %> would escape < > characters — your HTML would break
//   Partials are YOUR code (trusted), so <%- %> is safe here
//
// IMPORTANT POINTS:
//   ✦ Partials are relative to the current template
//   ✦ You can pass extra variables into partials
//   ✦ Partials can include other partials
//   ✦ Use partials to avoid repeating header/footer on every page

// ═════════════════════════════════════════════════════════════
// 8. CONDITIONALS in EJS
// ═════════════════════════════════════════════════════════════
//
// Just use normal JavaScript if/else inside <% %> tags:
//
//   <% if (isLoggedIn) { %>
//     <p>Welcome back!</p>
//   <% } else { %>
//     <a href="/login">Please log in</a>
//   <% } %>
//
// Ternary (inline):
//   <p><%= isLoggedIn ? 'Logged In' : 'Guest' %></p>
//
// Check array length:
//   <% if (books.length > 0) { %>
//     ...show books...
//   <% } else { %>
//     <p>No books found.</p>
//   <% } %>

// ═════════════════════════════════════════════════════════════
// 9. LOOPS in EJS
// ═════════════════════════════════════════════════════════════
//
// Just use normal JavaScript loops inside <% %> tags:
//
// forEach:
//   <ul>
//     <% books.forEach(function(book) { %>
//       <li><%= book.title %> by <%= book.author %></li>
//     <% }); %>
//   </ul>
//
// for loop (for ratings, pagination etc.):
//   <% for (let i = 1; i <= 5; i++) { %>
//     <span class="<%= i <= book.rating ? 'filled' : 'empty' %>">★</span>
//   <% } %>
//
// map (returns array — use join to output):
//   <%= books.map(b => b.title).join(', ') %>
//
// IMPORTANT POINTS:
//   ✦ Open braces { go in one <% %> tag
//   ✦ HTML goes in between (no tag needed for plain HTML)
//   ✦ Closing braces } go in another <% %> tag
//   ✦ forEach needs the semicolon after the closing }): <% }); %>

// ═════════════════════════════════════════════════════════════
// 10. <%= %> vs <%- %> — THE KEY DIFFERENCE
// ═════════════════════════════════════════════════════════════
//
// This is the most important thing to understand in EJS.
//
// <%= %>  ESCAPED output — converts < > & " to safe HTML entities
//   Example:  user.bio = '<script>alert("hacked")</script>'
//   <%= user.bio %>  outputs:  &lt;script&gt;alert("hacked")&lt;/script&gt;
//   Browser shows it as TEXT — safe! XSS prevented.
//
// <%- %>  RAW output — outputs exactly as-is, no escaping
//   <%- user.bio %>  outputs:  <script>alert("hacked")</script>
//   Browser EXECUTES the script — DANGEROUS with user input!
//
// RULE:
//   Use <%= %>  for ALL user-provided data (names, emails, text input)
//   Use <%- %>  ONLY for:
//     - includes:  <%- include('partials/header') %>
//     - your own trusted HTML strings

// ═════════════════════════════════════════════════════════════
// 11. EJS vs React — when to use which
// ═════════════════════════════════════════════════════════════
//
//                EJS (SSR)               React (CSR)
//  ──────────    ────────────────        ──────────────────
//  Rendering     Server builds HTML      Browser builds HTML
//  Speed         Fast first load         Slower first load
//  SEO           Great (HTML is ready)   Needs extra config
//  Complexity    Simple — just HTML+JS   Components, state, hooks
//  Use case      Simple websites, MVC    SPAs, complex UIs
//  Learning      Easy — you know HTML    Steeper curve
//
//  Use EJS when:
//    - Building a simple website or admin panel
//    - SEO is important
//    - You don't need complex client-side interactivity
//    - Working with Express MVC pattern
//
//  Use React when:
//    - Building a Single Page Application (SPA)
//    - Complex interactive UI
//    - You have a separate backend API
//    - Real-time updates needed

// ═════════════════════════════════════════════════════════════
// 12. COMMON MISTAKES & FIXES
// ═════════════════════════════════════════════════════════════
//
// ✗ MISTAKE 1: Using <%- %> with user input
//   <%- req.query.name %>  ← XSS vulnerability!
//   Fix: Always use <%= req.query.name %>
//
// ✗ MISTAKE 2: Forgetting express.json() or views setup
//   app.set('view engine', 'ejs');              ← required
//   app.set('views', path.join(__dirname, 'views')); ← required
//
// ✗ MISTAKE 3: Adding .ejs in res.render()
//   res.render('index.ejs')  ← wrong
//   res.render('index')      ← correct
//
// ✗ MISTAKE 4: Using undefined variables in template
//   If you don't pass a variable, EJS throws an error.
//   Fix: always pass defaults or check before using:
//   <% if (typeof user !== 'undefined') { %>
//
// ✗ MISTAKE 5: Using <%= %> for includes
//   <%= include('partials/header') %>  ← HTML gets escaped, breaks page
//   <%- include('partials/header') %>  ← correct

// ─────────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log("Library server at http://localhost:3000");
  console.log("");
  console.log("Routes:");
  console.log("  GET  /           → index.ejs     (home page)");
  console.log("  GET  /books      → books.ejs     (list all books)");
  console.log("  GET  /books?genre=Fiction         (filtered)");
  console.log("  GET  /books/:id  → book-detail.ejs");
});

// ═════════════════════════════════════════════════════════════
// QUICK REFERENCE CHEATSHEET
// ═════════════════════════════════════════════════════════════
//
//  TAG            PURPOSE                         EXAMPLE
//  ──────────     ──────────────────────────       ──────────────────────────
//  <%= %>         Show value (safe/escaped)        <%= user.name %>
//  <%- %>         Show raw HTML (unescaped)        <%- include('header') %>
//  <% %>          Run JS, no output                <% if (x > 0) { %>
//  <%# %>         Comment (hidden from browser)    <%# TODO: fix this %>
//
//  res.render('template', { key: val })   → passes data to .ejs file
//  <%- include('partials/nav') %>         → includes another .ejs file
//  <%= arr.length %>                      → use any JS expression
//  <% arr.forEach(item => { %> ... <% }) %> → loop over array