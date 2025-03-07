require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator"); // ✅ Import validation functions

// ✅ Import Mongoose models (Ensure these models exist in your project)
const User = require("./models/User");
const Recipe = require("./models/Recipe");
const Admin = require("./models/Admin");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Check if MONGO_URI is loaded correctly
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined! Check your .env file.");
  process.exit(1);
}

// ✅ Connect to MongoDB Compass
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Compass"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json()); // ✅ Middleware to parse JSON data

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("<h1>MongoDB Compass Connected Successfully!</h1>");
});

// ✅ GET all users
app.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ status: "200", data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ POST - Register User
app.post(
  "/adduser",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// ✅ POST - User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE User by ID
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ GET All Recipes
app.get("/getrecipe", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ status: "200", data: recipes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ POST - Add a Recipe
app.post("/addrecipes", async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRecipe = new Recipe({ title, ingredients, instructions, image });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ DELETE Recipe by ID
app.delete("/deleterecipe/:id", async (req, res) => {
  try {
    const result = await Recipe.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Recipe not found" });

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error });
  }
});

// ✅ GET Admins
app.get("/admin", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins", error: err.message });
  }
});

// ✅ POST - Register Admin
app.post("/admin/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// ✅ POST - Admin Login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
