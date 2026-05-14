const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);



// ======================
// SIGNUP ROUTE
// ======================

app.post("/signup", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});



// ======================
// ADMIN PROTECTION MIDDLEWARE
// ======================

const isAdmin = async (req, res, next) => {

  try {

    const email = req.query.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Admins only.",
      });
    }

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};



// ======================
// ADMIN ROUTE
// ======================

app.post("/admin", async (req, res) => {

  try {

    const { email } = req.body;

    // Check email exists
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check role
    if (user.role !== "admin") {

      return res.status(403).json({
        success: false,
        message: "Access Denied. Admins Only.",
      });

    }

    // Success
    res.status(200).json({
      success: true,
      message: `Welcome Admin ${user.name}`,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

});



// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});