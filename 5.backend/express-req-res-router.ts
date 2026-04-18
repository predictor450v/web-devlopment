/**
 * express-easy.ts
 *
 * Express explained with a simple FOOD MENU app.
 * Easy to understand, no complex logic.
 *
 * Imagine you own a restaurant.
 * This server IS the restaurant kitchen.
 * The browser/Postman is the customer placing orders.
 */

import express from "express";
import type { Request, Response, NextFunction, Router } from "express";

const app = express();
app.use(express.json()); // needed to read req.body

// ─────────────────────────────────────────────────────────────
// THE DATA  (pretend this is a database)
// ─────────────────────────────────────────────────────────────

interface FoodItem {
  id: number;
  name: string;
  price: number;
}

const menu: FoodItem[] = [
  { id: 1, name: "Burger",  price: 120 },
  { id: 2, name: "Pizza",   price: 250 },
  { id: 3, name: "Pasta",   price: 180 },
];

// ─────────────────────────────────────────────────────────────
// REQUEST  (req)
// ─────────────────────────────────────────────────────────────
//
// req = the customer's ORDER SLIP
// Everything the customer (browser) sends to you is in req.
//
// req.params  → part of the URL path       /menu/2  → id = "2"
// req.query   → filter after ?             /menu?cheap=true
// req.body    → data sent in POST/PUT      { name: "Dosa", price: 60 }
// req.headers → extra info in the request  Authorization, Content-Type

// ─────────────────────────────────────────────────────────────
// RESPONSE  (res)
// ─────────────────────────────────────────────────────────────
//
// res = the REPLY you send back to the customer
// You must send exactly ONE reply per request.
//
// res.json({ ... })         → send back JSON data
// res.status(404).json()    → send a status code with JSON
// res.send("hello")         → send plain text
//
// Common status codes:
//   200 → OK (success, returning data)
//   201 → Created (new item was added)
//   204 → No Content (deleted, nothing to return)
//   400 → Bad Request (customer sent wrong data)
//   404 → Not Found (item doesn't exist)
//   500 → Server Error (kitchen caught fire 🔥)

// ─────────────────────────────────────────────────────────────
// GET  — "give me something"
// ─────────────────────────────────────────────────────────────

// GET /menu  →  give me the full menu
app.get("/menu", (req: Request, res: Response): void => {

  // req.query lets you filter:  /menu?maxPrice=200
  const maxPrice = req.query.maxPrice;

  if (maxPrice) {
    const filtered = menu.filter((item) => item.price <= Number(maxPrice));
    res.status(200).json({ data: filtered });
    return;
  }

  res.status(200).json({ data: menu });
});

// GET /menu/:id  →  give me one specific item
//
// :id is a URL param — customer types /menu/2
// req.params.id will be "2" (always a string, so we parse it)
app.get("/menu/:id", (req: Request<{ id: string }>, res: Response): void => {

  const id = parseInt(req.params.id, 10); // "2" → 2

  if (isNaN(id)) {
    res.status(400).json({ message: "id must be a number" });
    return;
  }

  const item = menu.find((f) => f.id === id);

  if (!item) {
    res.status(404).json({ message: `No food item with id ${id}` });
    return;
  }

  res.status(200).json({ data: item });
});

// ─────────────────────────────────────────────────────────────
// POST  — "add something new"
// ─────────────────────────────────────────────────────────────

// POST /menu  →  add a new food item to the menu
//
// Customer sends:  { "name": "Dosa", "price": 60 }
// This arrives in req.body  (needs express.json() middleware)
app.post("/menu", (req: Request, res: Response): void => {

  const { name, price } = req.body as { name: string; price: number };

  // Validate — don't add garbage data
  if (!name || price === undefined) {
    res.status(400).json({ message: "name and price are required" });
    return;
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).json({ message: "price must be a positive number" });
    return;
  }

  const newItem: FoodItem = {
    id: menu.length + 1,
    name,
    price,
  };

  menu.push(newItem);

  res.status(201).json({ message: "Item added!", data: newItem });
  //         ^^^
  //         201 = Created (not 200) — this is the correct code for POST
});

// ─────────────────────────────────────────────────────────────
// PUT  — "replace an existing item completely"
// ─────────────────────────────────────────────────────────────

// PUT /menu/:id  →  completely replace a food item
//
// Customer sends:  { "name": "Veg Burger", "price": 100 }
// Both fields required — PUT replaces the whole object
app.put("/menu/:id", (req: Request<{ id: string }>, res: Response): void => {

  const id = parseInt(req.params.id, 10);
  const index = menu.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  const { name, price } = req.body as { name: string; price: number };

  if (!name || price === undefined) {
    res.status(400).json({ message: "name and price are required for PUT" });
    return;
  }

  menu[index] = { id, name, price }; // full replacement
  res.status(200).json({ message: "Item updated", data: menu[index] });
});

// ─────────────────────────────────────────────────────────────
// PATCH  — "update part of an existing item"
// ─────────────────────────────────────────────────────────────

// PATCH /menu/:id  →  update only what you send
//
// Customer sends:  { "price": 99 }   (only changing the price)
// Unlike PUT, you don't need to send all fields
app.patch("/menu/:id", (req: Request<{ id: string }>, res: Response): void => {

  const id = parseInt(req.params.id, 10);
  const index = menu.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  const updates = req.body as Partial<Omit<FoodItem, "id">>;

  // Only update fields that were actually sent
 menu[index] = { ...menu[index], ...updates } as FoodItem;

  res.status(200).json({ message: "Item patched", data: menu[index] });
});

// ─────────────────────────────────────────────────────────────
// DELETE  — "remove something"
// ─────────────────────────────────────────────────────────────

// DELETE /menu/:id  →  remove a food item from the menu
app.delete("/menu/:id", (req: Request<{ id: string }>, res: Response): void => {

  const id = parseInt(req.params.id, 10);
  const index = menu.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  const deleted = menu.splice(index, 1)[0]; // remove from array

  res.status(200).json({ message: "Item deleted", data: deleted });
  //
  // Note: some APIs use 204 (No Content) for DELETE
  // Use 200 if you want to return the deleted item
  // Use 204 if you want to return nothing:  res.status(204).end()
});

// ─────────────────────────────────────────────────────────────
// ROUTER  — "organise routes into separate files"
// ─────────────────────────────────────────────────────────────
//
// Right now all routes are in one file — fine for small apps.
// As it grows, you split into routers.
//
// Think of Router like a DEPARTMENT in the restaurant:
//   menuRouter   → handles everything about /menu
//   orderRouter  → handles everything about /orders
//   authRouter   → handles everything about /auth
//
// You then tell the main app:
//   "anything starting with /menu, send to menuRouter"

const orderRouter: Router = express.Router();

// In-memory orders
interface Order {
  id: number;
  itemName: string;
  quantity: number;
}

const orders: Order[] = [];

// GET /orders  →  see all orders
orderRouter.get("/", (req: Request, res: Response): void => {
  res.status(200).json({ data: orders });
});

// POST /orders  →  place a new order
orderRouter.post("/", (req: Request, res: Response): void => {
  const { itemName, quantity } = req.body as { itemName: string; quantity: number };

  if (!itemName || !quantity) {
    res.status(400).json({ message: "itemName and quantity are required" });
    return;
  }

  const newOrder: Order = {
    id: orders.length + 1,
    itemName,
    quantity,
  };

  orders.push(newOrder);
  res.status(201).json({ message: "Order placed!", data: newOrder });
});

// DELETE /orders/:id  →  cancel an order
orderRouter.delete("/:id", (req: Request<{ id: string }>, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  orders.splice(index, 1);
  res.status(204).end(); // 204 = deleted, no content returned
});

// Mount the router on the main app
// Now:  orderRouter's "/"    becomes  "/orders"
//       orderRouter's "/:id" becomes  "/orders/:id"
app.use("/orders", orderRouter);

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE  (bonus — you'll need this everywhere)
// ─────────────────────────────────────────────────────────────
//
// Middleware = a function that runs BEFORE your route handler.
// It's like a security guard at the restaurant door.
//
// Signature: (req, res, next) => void
// You MUST call next() to pass control to the next handler.
// If you don't call next(), the request hangs forever.

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`→ ${req.method} ${req.path}`);
  next(); // pass to the next middleware or route
};

app.use(logger); // runs for every request

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────

app.listen(3000, () => {
  console.log("Restaurant is open at http://localhost:3000");
  console.log("");
  console.log("MENU routes:");
  console.log("  GET    /menu              → get all items");
  console.log("  GET    /menu?maxPrice=200 → filter by price");
  console.log("  GET    /menu/:id          → get one item");
  console.log("  POST   /menu              → add new item");
  console.log("  PUT    /menu/:id          → replace item fully");
  console.log("  PATCH  /menu/:id          → update item partially");
  console.log("  DELETE /menu/:id          → remove item");
  console.log("");
  console.log("ORDER routes (via Router):");
  console.log("  GET    /orders            → see all orders");
  console.log("  POST   /orders            → place an order");
  console.log("  DELETE /orders/:id        → cancel an order");
});

// ─────────────────────────────────────────────────────────────
// QUICK REFERENCE CHEATSHEET
// ─────────────────────────────────────────────────────────────
//
//  HTTP METHOD   PURPOSE               BODY NEEDED?   SUCCESS CODE
//  ──────────    ───────────────────   ────────────   ────────────
//  GET           Read / fetch data     No             200
//  POST          Create new resource   Yes            201
//  PUT           Replace fully         Yes            200
//  PATCH         Update partially      Yes            200
//  DELETE        Remove resource       No             200 or 204
//
//  req.params.id   → from URL path :id     always string → parse it
//  req.query.x     → from URL ?x=value     always string → convert it
//  req.body.x      → from request body     type depends on what client sends
//
//  Router = mini express app
//  app.use('/prefix', router) mounts it at that prefix