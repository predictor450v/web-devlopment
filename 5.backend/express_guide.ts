/**
 * express-complete-guide.ts
 *
 * Complete Express.js Guide — All 10 Topics
 * ==========================================
 *  1.  Getting Started with Express
 *  2.  Organizing Your Express Project
 *  3.  HTTP Methods & Status Codes
 *  4.  Request and Response
 *  5.  Routing Controllers
 *  6.  Middleware
 *  7.  Request Validation
 *  8.  MVC Pattern
 *  9.  Repository Pattern
 *  10. Dependency Injection
 *
 * ANALOGY used throughout:
 * We are building a LIBRARY SYSTEM.
 * Books = the data
 * Librarian = the server
 * Visitor = the client (browser/Postman)
 */
// node --loader ts-node/esm express_guide.ts  // (run with Node's native ESM support and ts-node for TypeScript)
export {}; // make this file a module to avoid global scope issues
import express from "express";
import type { Request, Response, NextFunction, Router } from "express";

// ═════════════════════════════════════════════════════════════
// 1. GETTING STARTED WITH EXPRESS
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   Express is a minimal, unopinionated web framework for Node.js.
//   "Unopinionated" means it doesn't force you to structure your
//   code in a specific way — you decide.
//
//   It wraps Node's built-in `http` module and gives you:
//     - Clean routing (app.get, app.post, etc.)
//     - Middleware pipeline
//     - Request/Response helpers
//
// IMPORTANT POINTS:
//   ✦ Express itself is tiny — the power comes from middleware
//   ✦ Every Express app follows the same setup: create → configure → listen
//   ✦ app.use(express.json()) is almost always needed — without it req.body is undefined
//   ✦ app.listen() is what actually starts the server

const app = express();

app.use(express.json());         // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies

// Basic health check route — good practice for every Express app
app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ status: "ok", message: "Library server is running" });
});

// ═════════════════════════════════════════════════════════════
// 2. ORGANIZING YOUR EXPRESS PROJECT
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   A real Express project is NOT one giant file.
//   It is split into folders by responsibility.
//
// STANDARD FOLDER STRUCTURE:
//
//   src/
//   ├── index.ts              ← entry point, starts server
//   ├── app.ts                ← creates express app, registers middleware
//   ├── routes/
//   │   ├── book.routes.ts    ← URL definitions only
//   │   └── user.routes.ts
//   ├── controllers/
//   │   ├── book.controller.ts ← handles req/res
//   │   └── user.controller.ts
//   ├── services/
//   │   └── book.service.ts   ← business logic
//   ├── repositories/
//   │   └── book.repository.ts ← data access (DB queries)
//   ├── models/
//   │   └── book.model.ts     ← TypeScript interfaces / DB schemas
//   └── middleware/
//       ├── auth.middleware.ts
//       └── validate.middleware.ts
//
// IMPORTANT POINTS:
//   ✦ index.ts should only start the server — nothing else
//   ✦ app.ts should only wire things together — no business logic
//   ✦ Each file should have ONE job (Single Responsibility Principle)
//   ✦ This structure scales — adding a new feature = add new files, not edit old ones

// Simulating the structure in one file for learning:
// In real code, each section below would be its own file.

// ─── models/book.model.ts ────────────────────────────────────
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  available: boolean;
}

// ─── "database" (would be MongoDB/PostgreSQL in real app) ────
const books: Book[] = [
  { id: 1, title: "Clean Code",          author: "Robert Martin", genre: "Programming", available: true  },
  { id: 2, title: "The Pragmatic Programmer", author: "Dave Thomas", genre: "Programming", available: false },
  { id: 3, title: "Harry Potter",        author: "J.K. Rowling",  genre: "Fiction",     available: true  },
];

// ═════════════════════════════════════════════════════════════
// 3. HTTP METHODS & STATUS CODES
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   HTTP Methods = the ACTION you want to perform
//   Status Codes = the RESULT of that action
//
// METHODS — think of them as verbs:
//   GET    → READ   — "show me the books"
//   POST   → CREATE — "add a new book"
//   PUT    → REPLACE — "replace this book's info entirely"
//   PATCH  → UPDATE — "just change the availability"
//   DELETE → DELETE — "remove this book"
//
// STATUS CODE GROUPS:
//   2xx = Success      3xx = Redirect
//   4xx = Your fault   5xx = My fault
//
// IMPORTANT POINTS:
//   ✦ GET requests must NOT change data — they are "safe" and "idempotent"
//   ✦ POST returns 201 (Created), not 200
//   ✦ DELETE can return 204 (no body) or 200 (with deleted item)
//   ✦ 401 = not logged in,  403 = logged in but not allowed (different!)
//   ✦ 400 = wrong data sent,  404 = resource doesn't exist (different!)
//   ✦ Always use the correct code — it tells the client exactly what happened

// ═════════════════════════════════════════════════════════════
// 4. REQUEST AND RESPONSE
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   req (Request)  = everything the CLIENT sent to the server
//   res (Response) = everything the SERVER sends back to the client
//
//   req anatomy:
//     req.params   → /books/:id         → { id: "1" }
//     req.query    → /books?genre=Fiction → { genre: "Fiction" }
//     req.body     → POST body           → { title: "...", author: "..." }
//     req.headers  → Authorization, Content-Type, etc.
//     req.method   → "GET", "POST", etc.
//     req.path     → "/books/1"
//
//   res methods:
//     res.json()        → send JSON
//     res.status()      → set status code (chainable)
//     res.send()        → send any data
//     res.redirect()    → redirect to another URL
//     res.end()         → close with no body
//
// IMPORTANT POINTS:
//   ✦ req.params.id is ALWAYS a string — always parseInt() it
//   ✦ req.body is undefined unless you use express.json() middleware
//   ✦ Always call res exactly ONCE per request
//   ✦ Use Request<{id:string}> generic to type params properly in TypeScript
//   ✦ res.status() is chainable: res.status(201).json({...})

// ═════════════════════════════════════════════════════════════
// 5. ROUTING & CONTROLLERS
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   Router = a mini Express app for a specific resource
//   Controller = the function that handles a specific route
//
//   Without a router, everything goes in app.ts — messy.
//   With a router, each resource (books, users, orders) has
//   its own file with its own routes.
//
//   Flow:
//     Request → app.use('/books', bookRouter) → bookRouter.get('/:id') → controller
//
// IMPORTANT POINTS:
//   ✦ Router path + mounted path combine:
//       app.use('/books', bookRouter)  +  router.get('/:id')  =  GET /books/:id
//   ✦ Controllers should be thin — just read req, call service, send res
//   ✦ Never put business logic in a controller — that goes in the service
//   ✦ One controller file per resource (bookController, userController)
//   ✦ Router-level middleware only runs for that router's routes

// ─── controllers/book.controller.ts ─────────────────────────

const BookController = {

  // GET /books
  getAll: (req: Request, res: Response): void => {
    const { genre } = req.query;

    if (genre) {
      const filtered = books.filter(
        (b) => b.genre.toLowerCase() === (genre as string).toLowerCase()
      );
      res.status(200).json({ success: true, data: filtered });
      return;
    }

    res.status(200).json({ success: true, data: books });
  },

  // GET /books/:id
  getOne: (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "id must be a number" });
      return;
    }

    const book = books.find((b) => b.id === id);

    if (!book) {
      res.status(404).json({ success: false, message: `Book ${id} not found` });
      return;
    }

    res.status(200).json({ success: true, data: book });
  },

  // POST /books
  create: (req: Request, res: Response): void => {
    const { title, author, genre } = req.body as Omit<Book, "id" | "available">;

    if (!title || !author || !genre) {
      res.status(400).json({ success: false, message: "title, author, genre required" });
      return;
    }

    const newBook: Book = {
      id: books.length + 1,
      title,
      author,
      genre,
      available: true,
    };

    books.push(newBook);
    res.status(201).json({ success: true, data: newBook });
  },

  // PATCH /books/:id
  update: (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    const updates = req.body as Partial<Omit<Book, "id">>;
    books[index] = { ...books[index], ...updates } as Book;

    res.status(200).json({ success: true, data: books[index] });
  },

  // DELETE /books/:id
  remove: (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    const [deleted] = books.splice(index, 1);
    res.status(200).json({ success: true, data: deleted });
  },
};

// ─── routes/book.routes.ts ───────────────────────────────────

const bookRouter: Router = express.Router();

bookRouter.get("/",     BookController.getAll);
bookRouter.get("/:id",  BookController.getOne);
bookRouter.post("/",    BookController.create);
bookRouter.patch("/:id", BookController.update);
bookRouter.delete("/:id", BookController.remove);

// ═════════════════════════════════════════════════════════════
// 6. MIDDLEWARE
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   Middleware = a function that runs BETWEEN request and response.
//   Every middleware receives (req, res, next).
//   You MUST call next() to continue, or send a response to stop.
//
//   Think of middleware as SECURITY CHECKPOINTS at the library door:
//     1. Logger       → write down who entered (always let through)
//     2. Auth check   → do you have a library card? (stop if not)
//     3. Role check   → are you allowed in the restricted section?
//     4. Your route   → finally reach the book shelf
//
//   Types of middleware:
//     Application-level  → app.use(fn)          runs for all routes
//     Router-level       → router.use(fn)        runs for that router only
//     Route-level        → app.get('/', fn, fn)  runs for that route only
//     Error-handling     → (err, req, res, next) 4 params, catches errors
//     Built-in           → express.json(), express.static()
//     Third-party        → cors, helmet, morgan
//
// IMPORTANT POINTS:
//   ✦ Order matters — middleware runs in the order you define it
//   ✦ Always call next() unless you are sending a response
//   ✦ Error middleware MUST have 4 params: (err, req, res, next)
//   ✦ Put error middleware LAST in the file
//   ✦ Middleware is how you share logic across routes (auth, logging, validation)

// ─── middleware/logger.middleware.ts ─────────────────────────

const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next(); // MUST call this — otherwise request hangs
};

// ─── middleware/auth.middleware.ts ───────────────────────────

interface AuthRequest extends Request {
  user?: { id: number; role: "admin" | "member" };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"];

  if (!token) {
    // Stop here — send 401, don't call next()
    res.status(401).json({ success: false, message: "No token. Please log in." });
    return;
  }

  if (token !== "Bearer library-secret") {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  // Attach user info — available in all subsequent middleware/controllers
  req.user = { id: 1, role: "admin" };
  next(); // authenticated — continue to the route handler
};

// ─── middleware/admin.middleware.ts ──────────────────────────

const adminOnlyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, message: "Admins only" });
    return;
  }
  next();
};

// ─── middleware/error.middleware.ts ──────────────────────────
// Error middleware — MUST have exactly 4 parameters
// Express recognises the 4-param signature and treats it as error handler
// Any route that calls next(error) will end up here

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction  // must be here even if unused
): void => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
};

// ═════════════════════════════════════════════════════════════
// 7. REQUEST VALIDATION
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   Never trust data from the client.
//   Always validate BEFORE processing.
//
//   Validation = checking that the data is correct
//   Sanitization = cleaning the data (trim whitespace, lowercase email)
//
//   Where to validate:
//     - In middleware (reusable validation)
//     - In the controller (quick inline checks)
//     - Using a library like Zod or Joi (best for production)
//
//   What to validate:
//     - Required fields are present
//     - Types are correct (number, string, boolean)
//     - Values are in valid range (price > 0)
//     - Strings are not empty after trimming
//     - Enums are valid values
//
// IMPORTANT POINTS:
//   ✦ Validate at the BOUNDARY — as soon as data enters your system
//   ✦ Return 400 with a clear message explaining WHAT is wrong
//   ✦ Don't just say "invalid data" — say "title must be a non-empty string"
//   ✦ Validate params, query, AND body — not just body
//   ✦ In production, use Zod or Joi — don't hand-write all validations

// ─── middleware/validate.middleware.ts ───────────────────────

// Simple manual validation middleware for creating a book
const validateCreateBook = (req: Request, res: Response, next: NextFunction): void => {
  const { title, author, genre } = req.body as Partial<Book>;
  const errors: string[] = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("title is required and must be a non-empty string");
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    errors.push("author is required and must be a non-empty string");
  }

  if (!genre || typeof genre !== "string" || genre.trim() === "") {
    errors.push("genre is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  // Clean the data before it reaches the controller
  req.body.title  = title!.trim();
  req.body.author = author!.trim();
  req.body.genre  = genre!.trim();

  next();
};

// Validation middleware for ID params
const validateIdParam = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ success: false, message: "id must be a positive number" });
    return;
  }

  next();
};

// ═════════════════════════════════════════════════════════════
// 8. MVC PATTERN
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   MVC = Model  View  Controller
//   It is a way to SEPARATE CONCERNS in your application.
//
//   Model      → the data and rules about the data (Book interface, DB schema)
//   View       → what the user sees (in APIs, the JSON response IS the view)
//   Controller → the bridge — reads req, calls service, sends res
//
//   In a REST API with Express:
//     Model      → TypeScript interface + DB schema (book.model.ts)
//     View       → JSON response (res.json())
//     Controller → book.controller.ts
//     (+ Service layer between Controller and Model for business logic)
//
//   Full request flow in MVC:
//
//   HTTP Request
//       ↓
//   Router          → decides which controller to call
//       ↓
//   Controller      → reads req, calls service, sends res
//       ↓
//   Service         → business logic (can a book be borrowed?)
//       ↓
//   Repository      → talks to the database
//       ↓
//   Database        → returns raw data
//       ↑ (data flows back up, controller sends res)
//
// IMPORTANT POINTS:
//   ✦ Controller should NOT know about the database
//   ✦ Service should NOT know about req/res
//   ✦ Model should NOT have any logic — just data shape
//   ✦ This separation makes testing and changing each layer easy
//   ✦ "Thin controllers, fat services" — keep controllers simple

// ─── services/book.service.ts ────────────────────────────────
// Service contains BUSINESS LOGIC — rules about how the app works
// It does NOT know about req or res

const BookService = {

  getAllBooks: (genre?: string): Book[] => {
    if (genre) {
      return books.filter((b) => b.genre.toLowerCase() === genre.toLowerCase());
    }
    return books;
  },

  getBookById: (id: number): Book | undefined => {
    return books.find((b) => b.id === id);
  },

  createBook: (data: Omit<Book, "id" | "available">): Book => {
    // Business rule: check for duplicate title
    const exists = books.some(
      (b) => b.title.toLowerCase() === data.title.toLowerCase()
    );
    if (exists) throw new Error("A book with this title already exists");

    const newBook: Book = { id: books.length + 1, available: true, ...data };
    books.push(newBook);
    return newBook;
  },

  borrowBook: (id: number): Book => {
    const book = books.find((b) => b.id === id);
    if (!book) throw new Error("Book not found");
    if (!book.available) throw new Error("Book is already borrowed");

    // Business rule: mark as unavailable when borrowed
    book.available = false;
    return book;
  },

  returnBook: (id: number): Book => {
    const book = books.find((b) => b.id === id);
    if (!book) throw new Error("Book not found");
    if (book.available) throw new Error("Book was not borrowed");

    book.available = true;
    return book;
  },
};

// ═════════════════════════════════════════════════════════════
// 9. REPOSITORY PATTERN
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   The Repository Pattern adds a layer between your service
//   and the actual database.
//
//   Without Repository:
//     Service → directly writes MongoDB/SQL queries
//     Problem: if you switch from MongoDB to PostgreSQL,
//              you rewrite ALL your services
//
//   With Repository:
//     Service → calls BookRepository.findById(id)
//     Repository → runs the actual DB query
//     Benefit: switch DB? Only rewrite the repository file.
//              Services don't change at all.
//
//   Think of it as:
//     Service = a librarian who asks "find me a book by this ID"
//     Repository = the filing system that knows WHERE books are stored
//     The librarian doesn't care if books are in shelf A or shelf B
//
//   Repository methods follow a standard naming convention:
//     findAll()         → get all records
//     findById(id)      → get one by id
//     findByField(val)  → get by any field
//     create(data)      → insert new record
//     update(id, data)  → update a record
//     delete(id)        → remove a record
//
// IMPORTANT POINTS:
//   ✦ Repository only does CRUD — no business logic
//   ✦ Service calls repository — never the other way
//   ✦ This makes unit testing easy — mock the repository in tests
//   ✦ One repository per model/entity (BookRepository, UserRepository)
//   ✦ In real apps, repository methods are async (return Promises)

// ─── repositories/book.repository.ts ────────────────────────

// Interface defines what a repository must be able to do
interface IBookRepository {
  findAll(): Book[];
  findById(id: number): Book | undefined;
  findByGenre(genre: string): Book[];
  create(data: Omit<Book, "id">): Book;
  update(id: number, data: Partial<Book>): Book | undefined;
  delete(id: number): Book | undefined;
}

// Concrete implementation — uses in-memory array
// In production, this would use mongoose.find(), prisma.book.findMany(), etc.
class InMemoryBookRepository implements IBookRepository {

  private db: Book[] = [...books]; // our "database"

  findAll(): Book[] {
    return this.db;
  }

  findById(id: number): Book | undefined {
    return this.db.find((b) => b.id === id);
  }

  findByGenre(genre: string): Book[] {
    return this.db.filter((b) => b.genre.toLowerCase() === genre.toLowerCase());
  }

  create(data: Omit<Book, "id">): Book {
    const newBook: Book = { id: this.db.length + 1, ...data };
    this.db.push(newBook);
    return newBook;
  }

  update(id: number, data: Partial<Book>): Book | undefined {
    const index = this.db.findIndex((b) => b.id === id);
    if (index === -1) return undefined;
    this.db[index] = { ...this.db[index], ...data } as Book;
    return this.db[index];
  }

  delete(id: number): Book | undefined {
    const index = this.db.findIndex((b) => b.id === id);
    if (index === -1) return undefined;
    const [deleted] = this.db.splice(index, 1);
    return deleted;
  }
}

// ═════════════════════════════════════════════════════════════
// 10. DEPENDENCY INJECTION
// ═════════════════════════════════════════════════════════════
//
// THEORY:
//   Dependency Injection (DI) = instead of a class CREATING
//   its own dependencies, you GIVE (inject) them from outside.
//
//   Without DI (bad):
//     class BookService {
//       private repo = new InMemoryBookRepository(); // hardcoded!
//     }
//     Problem: BookService is LOCKED to InMemoryBookRepository.
//     You can't test it easily, can't swap it.
//
//   With DI (good):
//     class BookService {
//       constructor(private repo: IBookRepository) {} // injected!
//     }
//     Now you can pass ANY repository — real, fake, mock, MongoDB, etc.
//
//   Think of it like:
//     A librarian needs a filing system.
//     Without DI: the librarian BUILDS their own filing cabinet
//     With DI: someone GIVES the librarian a filing cabinet
//     The librarian doesn't care if it's wood or metal — just works.
//
// IMPORTANT POINTS:
//   ✦ Program to interfaces, not implementations (IBookRepository, not InMemoryBookRepository)
//   ✦ DI makes unit testing easy — inject a fake/mock dependency
//   ✦ Constructor injection is the most common pattern in TypeScript
//   ✦ DI is the "D" in SOLID principles (Dependency Inversion)
//   ✦ Frameworks like NestJS do DI automatically — in Express, you do it manually

// ─── Injecting repository into service ───────────────────────

class BookServiceWithDI {

  // The service depends on IBookRepository (the interface)
  // It does NOT care about the concrete class
  constructor(private bookRepo: IBookRepository) {}

  getAllBooks(genre?: string): Book[] {
    if (genre) return this.bookRepo.findByGenre(genre);
    return this.bookRepo.findAll();
  }

  getBookById(id: number): Book {
    const book = this.bookRepo.findById(id);
    if (!book) throw new Error(`Book with id ${id} not found`);
    return book;
  }

  createBook(data: Omit<Book, "id" | "available">): Book {
    return this.bookRepo.create({ ...data, available: true });
  }

  deleteBook(id: number): Book {
    const deleted = this.bookRepo.delete(id);
    if (!deleted) throw new Error(`Book with id ${id} not found`);
    return deleted;
  }
}

// ─── Controller with DI ──────────────────────────────────────

class BookControllerWithDI {

  constructor(private bookService: BookServiceWithDI) {}

  getAll = (req: Request, res: Response): void => {
    const genre = req.query.genre as string | undefined;
    const data  = this.bookService.getAllBooks(genre);
    res.status(200).json({ success: true, data });
  };

  getOne = (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    try {
      const book = this.bookService.getBookById(id);
      res.status(200).json({ success: true, data: book });
    } catch (err) {
      res.status(404).json({ success: false, message: (err as Error).message });
    }
  };

  create = (req: Request, res: Response): void => {
    const { title, author, genre } = req.body as Omit<Book, "id" | "available">;
    try {
      const book = this.bookService.createBook({ title, author, genre });
      res.status(201).json({ success: true, data: book });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  };

  remove = (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    try {
      const deleted = this.bookService.deleteBook(id);
      res.status(200).json({ success: true, data: deleted });
    } catch (err) {
      res.status(404).json({ success: false, message: (err as Error).message });
    }
  };
}

// ─── Wire everything together (Composition Root) ─────────────
//
// This is where Dependency Injection happens.
// All dependencies are created here and injected downward.
// This one place is called the "Composition Root".

const bookRepository    = new InMemoryBookRepository();
const bookServiceDI     = new BookServiceWithDI(bookRepository);
const bookControllerDI  = new BookControllerWithDI(bookServiceDI);

// ─── Routes wired to DI controller ──────────────────────────

const bookRouterDI: Router = express.Router();

bookRouterDI.get("/",      bookControllerDI.getAll);
bookRouterDI.get("/:id",   bookControllerDI.getOne);
bookRouterDI.post("/",     validateCreateBook, bookControllerDI.create);
bookRouterDI.delete("/:id", validateIdParam as any, bookControllerDI.remove);

// ═════════════════════════════════════════════════════════════
// PUTTING IT ALL TOGETHER — mount everything on the app
// ═════════════════════════════════════════════════════════════

// Application-level middleware (runs for every request)
app.use(loggerMiddleware);

// Public routes (no auth needed)
app.use("/books",  bookRouter);

// Protected routes (auth required)
app.use("/library/books", authMiddleware, bookRouterDI);
// Admin-only routes
app.use("/admin/books",   authMiddleware, adminOnlyMiddleware, bookRouterDI);

// 404 handler — must be BEFORE error middleware, AFTER all routes
app.use((req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `${req.method} ${req.path} not found` });
});

// Error middleware — must be LAST, must have 4 params
app.use(errorMiddleware);

// ─────────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log("\n📚 Library Server running at http://localhost:3000\n");
  console.log("PUBLIC routes (no auth):");
  console.log("  GET    /books");
  console.log("  GET    /books?genre=Fiction");
  console.log("  GET    /books/:id");
  console.log("  POST   /books");
  console.log("  PATCH  /books/:id");
  console.log("  DELETE /books/:id");
  console.log("\nPROTECTED routes (Authorization: Bearer library-secret):");
  console.log("  GET    /library/books");
  console.log("  POST   /library/books");
  console.log("  DELETE /library/books/:id");
  console.log("\nADMIN routes (same token + admin role):");
  console.log("  GET    /admin/books");
});

// ═════════════════════════════════════════════════════════════
// QUICK REFERENCE — all 10 topics in one glance
// ═════════════════════════════════════════════════════════════
//
//  TOPIC                 KEY POINT
//  ─────────────────     ──────────────────────────────────────────────
//  1. Getting Started    app = express() → app.use() → app.listen()
//  2. Project Structure  routes/ controllers/ services/ repositories/ models/
//  3. HTTP Methods       GET=read POST=create PUT=replace PATCH=update DELETE=remove
//  4. req & res          req=what came in, res=what goes out, one res per request
//  5. Router+Controller  Router groups routes, Controller handles one route action
//  6. Middleware         (req,res,next) → always call next() or send response
//  7. Validation         validate at boundary, return 400 with clear error messages
//  8. MVC                Model=data, View=JSON, Controller=bridge, Service=logic
//  9. Repository         abstracts DB access, findAll/findById/create/update/delete
//  10. Dependency Inject  inject dependencies via constructor, program to interfaces