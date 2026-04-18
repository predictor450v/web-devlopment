/**
 * http-explained.ts
 *
 * What is HTTP?
 * How does it work?
 * Methods, Status Codes, Headers, Body — all explained simply.
 *
 * ANALOGY used throughout this file:
 * HTTP is like sending LETTERS between a customer and a restaurant.
 * Customer = Browser / Postman / Frontend
 * Restaurant = Server (your Express app)
 */

// ─────────────────────────────────────────────────────────────
// WHAT IS HTTP?
// ─────────────────────────────────────────────────────────────
//
// HTTP = HyperText Transfer Protocol
//
// It is a set of RULES that defines how messages are sent
// between a client (browser) and a server.
//
// Every time you:
//   - open a website
//   - click a button that fetches data
//   - submit a form
//   - call an API
//
// ...an HTTP request is being made under the hood.
//
// HTTP is:
//   Stateless   → each request is independent, server remembers nothing
//   Text-based  → messages are plain text (readable by humans)
//   Request-Response → client always starts, server always replies

// ─────────────────────────────────────────────────────────────
// THE HTTP CYCLE  (what actually happens)
// ─────────────────────────────────────────────────────────────
//
//  1. Client sends a REQUEST  →  "Give me the menu"
//  2. Server receives it
//  3. Server processes it     →  looks up the menu in DB
//  4. Server sends a RESPONSE →  "Here is the menu: [...]"
//  5. Client receives it
//
//  That's it. One request → one response. Then it's done.
//  For the next action, a brand new request starts.
//
//  Visual:
//
//  Browser                          Server
//  ───────                          ──────
//    │──── HTTP Request ──────────►  │
//    │                               │  (processes)
//    │◄─── HTTP Response ──────────  │

// ─────────────────────────────────────────────────────────────
// HTTP REQUEST — what a request looks like
// ─────────────────────────────────────────────────────────────
//
// A raw HTTP request has 4 parts:
//
//  1. REQUEST LINE   → method + URL + HTTP version
//  2. HEADERS        → extra info about the request
//  3. BLANK LINE     → separator
//  4. BODY           → data you're sending (optional)
//
// Example raw HTTP request:
//
//  POST /menu HTTP/1.1
//  Host: localhost:3000
//  Content-Type: application/json
//  Authorization: Bearer abc123
//
//  { "name": "Dosa", "price": 60 }
//  ▲                               ▲
//  └─────────── BODY ──────────────┘
//
// Express gives you this as the clean `req` object:
//   req.method          → "POST"
//   req.path            → "/menu"
//   req.headers['host'] → "localhost:3000"
//   req.body            → { name: "Dosa", price: 60 }

// ─────────────────────────────────────────────────────────────
// HTTP RESPONSE — what a response looks like
// ─────────────────────────────────────────────────────────────
//
// A raw HTTP response also has 4 parts:
//
//  1. STATUS LINE    → HTTP version + status code + message
//  2. HEADERS        → info about the response
//  3. BLANK LINE     → separator
//  4. BODY           → the data being returned
//
// Example raw HTTP response:
//
//  HTTP/1.1 201 Created
//  Content-Type: application/json
//
//  { "message": "Item added!", "data": { "id": 4, "name": "Dosa" } }
//
// Express gives you `res` to build this:
//   res.status(201)                    → sets the status line
//   res.set('Content-Type', 'application/json')  → sets a header
//   res.json({ message: "Item added!" })         → sets the body

// ─────────────────────────────────────────────────────────────
// HTTP METHODS  (the "verb" — what action you want)
// ─────────────────────────────────────────────────────────────
//
// Think of methods as the TYPE OF LETTER you're sending.
//
//  GET     → "Can I see the menu?"            (read, no body)
//  POST    → "I want to order a new item"     (create, has body)
//  PUT     → "Replace my entire order"        (full update, has body)
//  PATCH   → "Just change the quantity"       (partial update, has body)
//  DELETE  → "Cancel my order"                (delete, no body)
//
//  Less common:
//  HEAD    → same as GET but returns ONLY headers, no body
//  OPTIONS → asks the server "what methods do you support?"

interface HttpMethod {
  method: string;
  purpose: string;
  hasBody: boolean;
  successCode: number;
  example: string;
}

const httpMethods: HttpMethod[] = [
  { method: "GET",     purpose: "Read / fetch data",       hasBody: false, successCode: 200, example: "GET /menu"       },
  { method: "POST",    purpose: "Create a new resource",   hasBody: true,  successCode: 201, example: "POST /menu"      },
  { method: "PUT",     purpose: "Replace fully",           hasBody: true,  successCode: 200, example: "PUT /menu/2"     },
  { method: "PATCH",   purpose: "Update partially",        hasBody: true,  successCode: 200, example: "PATCH /menu/2"   },
  { method: "DELETE",  purpose: "Remove a resource",       hasBody: false, successCode: 204, example: "DELETE /menu/2"  },
];

console.table(httpMethods);

// ─────────────────────────────────────────────────────────────
// HTTP STATUS CODES  (the "result" — what happened)
// ─────────────────────────────────────────────────────────────
//
// Status codes are 3-digit numbers grouped by first digit.
// Think of them as the restaurant's reply stamp on your letter.
//
//  1xx  → Informational   "hold on, still processing"
//  2xx  → Success         "all good!"
//  3xx  → Redirection     "go here instead"
//  4xx  → Client Error    "YOU made a mistake"
//  5xx  → Server Error    "WE made a mistake"

interface StatusCode {
  code: number;
  name: string;
  meaning: string;
  when: string;
}

const statusCodes: StatusCode[] = [
  // 2xx — Success
  { code: 200, name: "OK",                   meaning: "Success, returning data",     when: "GET, PUT, PATCH, DELETE"    },
  { code: 201, name: "Created",              meaning: "New resource was created",    when: "POST"                       },
  { code: 204, name: "No Content",           meaning: "Success, nothing to return",  when: "DELETE (no body needed)"    },

  // 3xx — Redirection
  { code: 301, name: "Moved Permanently",    meaning: "URL changed forever",         when: "Old URL redirects to new"   },
  { code: 302, name: "Found (Redirect)",     meaning: "URL changed temporarily",     when: "res.redirect('/new-path')"  },

  // 4xx — Client Errors (the client did something wrong)
  { code: 400, name: "Bad Request",          meaning: "Invalid data sent",           when: "Missing fields, wrong type" },
  { code: 401, name: "Unauthorized",         meaning: "Not logged in",               when: "No token / invalid token"   },
  { code: 403, name: "Forbidden",            meaning: "Logged in but not allowed",   when: "Wrong role / permissions"   },
  { code: 404, name: "Not Found",            meaning: "Resource doesn't exist",      when: "Wrong ID, wrong URL"        },
  { code: 409, name: "Conflict",             meaning: "Duplicate resource",          when: "Email already registered"   },
  { code: 422, name: "Unprocessable",        meaning: "Validation failed",           when: "Data format is wrong"       },

  // 5xx — Server Errors (your code broke something)
  { code: 500, name: "Internal Server Error", meaning: "Something crashed on server", when: "Unhandled error in code"   },
  { code: 503, name: "Service Unavailable",  meaning: "Server is down / overloaded", when: "DB connection failed"       },
];

console.table(statusCodes);

// ─────────────────────────────────────────────────────────────
// HTTP HEADERS  (extra info attached to every request/response)
// ─────────────────────────────────────────────────────────────
//
// Headers are key-value pairs.
// Think of them as the LABEL on the outside of the envelope —
// they describe what's inside without opening it.
//
// ── Common REQUEST headers (client → server) ─────────────────
//
//  Content-Type: application/json     → "I'm sending JSON"
//  Authorization: Bearer <token>      → "Here's my login token"
//  Accept: application/json           → "I want JSON back"
//  Cookie: session=abc123             → "Here's my cookie"
//
// ── Common RESPONSE headers (server → client) ────────────────
//
//  Content-Type: application/json     → "I'm sending JSON back"
//  Set-Cookie: session=abc123         → "Store this cookie"
//  Cache-Control: no-store            → "Don't cache this"
//  Access-Control-Allow-Origin: *     → "Any domain can access this" (CORS)

// Reading headers in Express:
import express from "express";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/headers-demo", (req: Request, res: Response): void => {
  const contentType   = req.headers["content-type"];    // what format client sent
  const authorization = req.headers["authorization"];   // login token
  const userAgent     = req.headers["user-agent"];      // which browser/tool

  console.log({ contentType, authorization, userAgent });

  // Setting response headers
  res.set("X-Powered-By", "My Express App");
  res.set("Cache-Control", "no-store");

  res.status(200).json({ message: "Headers demo", received: { authorization, userAgent } });
});

// ─────────────────────────────────────────────────────────────
// HTTP BODY  (the actual data being sent)
// ─────────────────────────────────────────────────────────────
//
// The body is the LETTER CONTENT inside the envelope.
// Only POST, PUT, PATCH typically have a body.
// GET and DELETE usually don't.
//
// Body formats:
//   application/json       → { "name": "Dosa", "price": 60 }   ← most common in APIs
//   application/x-www-form-urlencoded → name=Dosa&price=60      ← old HTML forms
//   multipart/form-data    → file uploads
//   text/plain             → plain text
//
// In Express:
//   app.use(express.json())             → parses JSON bodies into req.body
//   app.use(express.urlencoded(...))    → parses form bodies into req.body

app.post("/body-demo", (req: Request, res: Response): void => {
  // req.body is only available because of app.use(express.json()) above
  console.log("Body received:", req.body);
  res.status(200).json({ youSent: req.body });
});

// ─────────────────────────────────────────────────────────────
// URL ANATOMY  (breaking down a full URL)
// ─────────────────────────────────────────────────────────────
//
// Full URL:
// https://myapp.com/api/menu/42?filter=veg&maxPrice=200
//
//  https          → PROTOCOL  (HTTP vs HTTPS — S = encrypted)
//  myapp.com      → HOST      (domain name / IP address)
//  /api/menu/42   → PATH      (req.path in Express)
//  42             → PARAM     (req.params.id — defined as :id in route)
//  ?filter=veg    → QUERY     (req.query.filter === "veg")
//  &maxPrice=200  → QUERY     (req.query.maxPrice === "200")
//
// In Express terms:
app.get("/api/menu/:id", (req: Request<{ id: string }>, res: Response): void => {
  const id       = req.params.id;          // "42"
  const filter   = req.query.filter;       // "veg"
  const maxPrice = req.query.maxPrice;     // "200"

  res.json({ id, filter, maxPrice });
});

// ─────────────────────────────────────────────────────────────
// HTTP vs HTTPS
// ─────────────────────────────────────────────────────────────
//
// HTTP  → plain text, anyone can read the data in transit
// HTTPS → encrypted with TLS/SSL, data is unreadable in transit
//
// Think of it as:
//   HTTP  = sending a POSTCARD  (anyone handling it can read it)
//   HTTPS = sending a SEALED ENVELOPE  (only recipient can open it)
//
// In development → HTTP is fine (localhost:3000)
// In production  → always use HTTPS (your hosting platform handles this)

// ─────────────────────────────────────────────────────────────
// FULL EXAMPLE — tying everything together
// ─────────────────────────────────────────────────────────────
//
// Request:
//   POST /api/menu
//   Headers:  Content-Type: application/json
//             Authorization: Bearer mytoken123
//   Body:     { "name": "Dosa", "price": 60 }
//
// What Express sees:
//   req.method               → "POST"
//   req.path                 → "/api/menu"
//   req.headers.authorization → "Bearer mytoken123"
//   req.body.name            → "Dosa"
//   req.body.price           → 60
//
// Response:
//   Status: 201 Created
//   Headers: Content-Type: application/json
//   Body:    { "message": "Item added!", "data": { "id": 4, "name": "Dosa", "price": 60 } }

app.post("/api/menu", (req: Request, res: Response): void => {
  const token = req.headers["authorization"];

  if (!token) {
    // 401 — not logged in
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const { name, price } = req.body as { name: string; price: number };

  if (!name || !price) {
    // 400 — client sent bad data
    res.status(400).json({ message: "name and price required" });
    return;
  }

  // 201 — successfully created
  res.status(201).json({
    message: "Item added!",
    data: { id: 4, name, price },
  });
});

// ─────────────────────────────────────────────────────────────
// SUMMARY CHEATSHEET
// ─────────────────────────────────────────────────────────────
//
//  PART          WHERE IN EXPRESS        EXAMPLE
//  ──────────    ────────────────────    ──────────────────────────────
//  Method        req.method              "GET", "POST", "DELETE"
//  URL path      req.path                "/api/menu/42"
//  URL param     req.params.id           "42"  (always string)
//  Query string  req.query.filter        "veg" (always string)
//  Body          req.body.name           "Dosa" (needs express.json())
//  Headers in    req.headers['auth']     "Bearer abc123"
//  Status out    res.status(201)         sets response status code
//  Body out      res.json({ ... })       sends JSON response
//  Headers out   res.set('key', 'val')   sets response header

app.listen(3000, () => {
  console.log("HTTP demo server running at http://localhost:3000");
});