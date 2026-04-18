/**
 * backend-concepts.ts
 *
 * A fully annotated TypeScript file covering:
 *   1. What the "backend" is
 *   2. Node.js — the runtime
 *   3. npm — the package manager
 *   4. Nodemon — development tool
 *   5. CommonJS vs ES Modules
 *   6. Express.js — the web framework
 *   7. How to install and wire everything up
 */

// ─────────────────────────────────────────────────────────────
// 1. BACKEND
// ─────────────────────────────────────────────────────────────
//
// The "backend" is the server-side part of a web application.
// It is responsible for:
//   - Receiving HTTP requests from the client (browser)
//   - Running business logic (auth, calculations, rules)
//   - Reading/writing to a database
//   - Sending HTTP responses back to the client
//
// The user never sees backend code directly — only its output.
// In a MERN stack:  M = MongoDB, E = Express, R = React, N = Node.js
//                                 ↑ backend        ↑ frontend

// ─────────────────────────────────────────────────────────────
// 2. NODE.JS
// ─────────────────────────────────────────────────────────────
//
// JavaScript normally only runs inside a browser.
// Node.js is a RUNTIME that lets JavaScript run on your machine
// or server, outside the browser.
//
// It uses Chrome's V8 engine under the hood.
//
// Install Node.js: https://nodejs.org  (LTS version)
// After installing:
//
//   node -v      → prints installed Node version
//   npm -v       → prints installed npm version
//
// Node.js gives you access to the file system, network, OS, etc.
// which browsers intentionally block for security reasons.

import * as os from "os";
import * as path from "path";

const nodeInfo = {
  platform: os.platform(),          // e.g. "win32", "linux", "darwin"
  nodeVersion: process.version,     // e.g. "v20.11.0"
  currentDir: process.cwd(),        // current working directory
  resolvedPath: path.resolve("."),  // absolute path
};

console.log("Node.js environment info:", nodeInfo);

// ─────────────────────────────────────────────────────────────
// 3. NPM — Node Package Manager
// ─────────────────────────────────────────────────────────────
//
// npm ships with Node.js — you don't install it separately.
//
// Core commands:
//   npm init -y              → creates package.json (project manifest)
//   npm install express      → installs a package locally
//   npm install -D typescript ts-node @types/node  → dev dependencies
//   npm install -g nodemon   → installs a package globally
//   npm run dev              → runs a script defined in package.json
//   npm uninstall express    → removes a package
//
// package.json tracks:
//   - Project name, version, description
//   - "dependencies"    → needed in production
//   - "devDependencies" → only needed during development (TS, linters, etc.)
//   - "scripts"         → shortcuts for common commands
//
// Example package.json scripts section:
// {
//   "scripts": {
//     "dev":   "ts-node src/index.ts",
//     "build": "tsc",
//     "start": "node dist/index.js"
//   }
// }

// ─────────────────────────────────────────────────────────────
// 3.5. NODEMON — Development Tool
// ─────────────────────────────────────────────────────────────
//
// Nodemon is a utility that monitors your Node.js application for
// file changes and automatically restarts the server when you
// make changes to your code. This speeds up development by
// eliminating the need to manually stop and restart the server
// every time you edit a file.
//
// Without nodemon: edit code → stop server (Ctrl+C) → restart server
// With nodemon:    edit code → server restarts automatically
//
// Install nodemon:
//   npm install -g nodemon          → global install (recommended for dev)
//   OR
//   npm install --save-dev nodemon  → local dev dependency
//
// Usage:
//   nodemon app.js                  → runs app.js and watches for changes
//   nodemon --exec ts-node app.ts   → for TypeScript files
//
// Nodemon watches .js, .mjs, .json, .ts files by default.
// You can configure what to watch in a nodemon.json file.

// ─────────────────────────────────────────────────────────────
// 5. COMMONJS vs ES MODULES
// ─────────────────────────────────────────────────────────────
//
// JavaScript has two module systems. You need to know both
// because you'll encounter them in the wild.

// ── CommonJS (CJS) ──────────────────────────────────────────
//
// Node.js's original module system. Still widely used.
// Syntax:
//   const express = require('express')          ← import
//   module.exports = { myFunction }              ← export
//
// Key traits:
//   - Loads modules SYNCHRONOUSLY (blocking)
//   - Works in .js files by default in Node.js
//   - Cannot use `import` syntax without configuration

// ── ES Modules (ESM) ────────────────────────────────────────
//
// The OFFICIAL JavaScript standard (ES2015+).
// Syntax:
//   import express from 'express'               ← import
//   export const myFunction = () => {}           ← named export
//   export default myFunction                    ← default export
//
// Key traits:
//   - Loads modules ASYNCHRONOUSLY
//   - Natively supported in browsers
//   - Supported in Node.js via .mjs extension OR
//     "type": "module" in package.json
//
// TypeScript compiles to either depending on your tsconfig.json:
//   "module": "CommonJS"     → outputs require()
//   "module": "ESNext"       → outputs import/export

// ── Side-by-side comparison ──────────────────────────────────

interface ModuleComparison {
  feature: string;
  commonJS: string;
  esModules: string;
}

const moduleComparison: ModuleComparison[] = [
  { feature: "Import syntax",   commonJS: "require('mod')",       esModules: "import x from 'mod'"     },
  { feature: "Export syntax",   commonJS: "module.exports = {}",  esModules: "export default / export" },
  { feature: "Loading",         commonJS: "Synchronous",          esModules: "Asynchronous"            },
  { feature: "Node.js default", commonJS: "Yes (.js files)",      esModules: "Needs config (.mjs)"     },
  { feature: "Browser native",  commonJS: "No",                   esModules: "Yes"                     },
  { feature: "TypeScript uses", commonJS: "module: CommonJS",     esModules: "module: ESNext/ES2020"   },
];

console.table(moduleComparison);

// ─────────────────────────────────────────────────────────────
// 6. EXPRESS.JS
// ─────────────────────────────────────────────────────────────
//
// WHY Express?
//   Node.js CAN handle HTTP on its own — but it's very verbose:
//
//   import http from 'http';
//   const server = http.createServer((req, res) => {
//     if (req.url === '/users' && req.method === 'GET') {
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ users: [] }));
//     }
//   });
//   server.listen(3000);
//
//   ↑ This gets unmanageable fast. Express wraps all of this cleanly.
//
// HOW TO INSTALL EXPRESS:
//
// 1. Install Express as a dependency:
//    npm install express
//
// 2. For TypeScript support, install type definitions:
//    npm install --save-dev @types/express
//
// 3. (Optional) Install additional useful middleware types:
//    npm install --save-dev @types/cors @types/morgan
//
// Express will be added to your package.json under "dependencies".
// The @types packages go under "devDependencies" since they're only
// needed during development for TypeScript compilation.

import express from "express";
import type { Request, Response, NextFunction } from "express";

// ── App Setup ────────────────────────────────────────────────

const app = express();
const PORT: number = 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// ── What is Middleware? ───────────────────────────────────────
//
// Middleware is a function that runs BETWEEN the request arriving
// and the response being sent. It has access to (req, res, next).
//
// req  → the incoming request (headers, body, params, query)
// res  → the outgoing response (send, json, status)
// next → call this to pass control to the next middleware
//
// Common uses: logging, auth checks, body parsing, error handling

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // pass to the next middleware or route handler
};

app.use(requestLogger);

// ── Type Definitions ─────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
}

// In-memory "database" for this example
const users: User[] = [
  { id: 1, name: "Ayushman", email: "ayushman@example.com" },
  { id: 2, name: "Alice",    email: "alice@example.com"    },
];

// ── Routes ───────────────────────────────────────────────────
//
// A route = HTTP method + URL path + handler function
// Express supports: .get(), .post(), .put(), .patch(), .delete()

// GET /users → return all users
app.get("/users", (req: Request, res: Response): void => {
  res.status(200).json({ success: true, data: users });
});

// GET /users/:id → return a single user by ID
app.get("/users/:id", (req: Request, res: Response): void => {
  const idParam = req.params.id;
  if (!idParam || typeof idParam !== 'string') {
    res.status(400).json({ success: false, message: "ID parameter is required and must be a string" });
    return;
  }
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "ID must be a number" });
    return;
  }
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, data: user });
});

// POST /users → create a new user
app.post("/users", (req: Request, res: Response): void => {
  const { name, email } = req.body as Omit<User, "id">;

  if (!name || !email) {
    res.status(400).json({ success: false, message: "name and email are required" });
    return;
  }

  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// DELETE /users/:id → remove a user
app.delete("/users/:id", (req: Request, res: Response): void => {
  const idParam = req.params.id;
  if (!idParam || typeof idParam !== 'string') {
    res.status(400).json({ success: false, message: "ID parameter is required and must be a string" });
    return;
  }
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "ID must be a number" });
    return;
  }
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const deleted = users.splice(index, 1)[0];
  res.status(200).json({ success: true, data: deleted });
});

// ── Error Handling Middleware ─────────────────────────────────
//
// Must have exactly 4 parameters — Express detects this signature
// and treats it as an error handler.

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start Server ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("  GET    /users");
  console.log("  GET    /users/:id");
  console.log("  POST   /users");
  console.log("  DELETE /users/:id");
});

// ─────────────────────────────────────────────────────────────
// 7. SETUP SUMMARY — run these commands to use this file
// ─────────────────────────────────────────────────────────────
//
//   npm init -y
//   npm install express
//   npm install -D typescript ts-node @types/node @types/express nodemon
//   npx tsc --init                     ← generates tsconfig.json
//
//   Then in tsconfig.json set:
//     "target": "ES2020"
//     "module": "CommonJS"
//     "outDir": "./dist"
//     "rootDir": "./src"
//     "strict": true
//
//   Run in development:
//     npx ts-node backend-concepts.ts
//
//   Build to JavaScript:
//     npx tsc
//     node dist/backend-concepts.js