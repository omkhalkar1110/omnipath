import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple in-memory "database" for demo purposes
// In a real app, this would be a real database like PostgreSQL or MongoDB
let users: any[] = [];
let reviews: any[] = [];

// Mock database persistence (optional, for demo)
const DB_FILE = "users.json";
if (fs.existsSync(DB_FILE)) {
  users = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

const REVIEWS_FILE = "reviews.json";
if (fs.existsSync(REVIEWS_FILE)) {
  reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
}

const saveUsers = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

const saveReviews = () => {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
};

// API routes
app.get("/api/reviews/:collegeName", (req, res) => {
  const { collegeName } = req.params;
  const collegeReviews = reviews.filter(r => r.collegeName === collegeName);
  res.json(collegeReviews);
});

app.post("/api/reviews", (req, res) => {
  const { collegeName, userName, rating, comment } = req.body;
  
  if (!collegeName || !userName || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newReview = {
    id: Date.now().toString(),
    collegeName,
    userName,
    rating,
    comment,
    date: new Date().toISOString()
  };

  reviews.push(newReview);
  saveReviews();

  res.json(newReview);
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { name, email, phone };
  users.push(newUser);
  saveUsers();

  res.json({ message: "Registration successful", user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const user = users.find(u => u.email === email && u.phone === phone);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
