const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 3000;

const SECRET_KEY = "secretkey123";

// Blacklist Array
const blacklist = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder
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
});

const User = mongoose.model("User", userSchema);

// ================= SIGNUP =================

app.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Duplicate Email Check
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });

    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Signup Successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

});

// ================= LOGIN =================

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });

    }

    // Generate Token
    const token = jwt.sign(
      {
        email: user.email,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      name: user.name,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

});

// ================= LOGOUT =================

app.post("/logout", (req, res) => {

  try {

    const token = req.headers.authorization;

    if (!token) {

      return res.status(400).json({
        success: false,
        message: "No Token Found",
      });

    }

    // Add token to blacklist
    blacklist.push(token);

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

});

// ================= PROTECTED ROUTE =================

app.get("/profile", (req, res) => {

  try {

    const token = req.headers.authorization;

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Please Login First",
      });

    }

    // Check Blacklist
    if (blacklist.includes(token)) {

      return res.status(401).json({
        success: false,
        message: "Token Expired. Login Again",
      });

    }

    // Verify Token
    const decoded = jwt.verify(token, SECRET_KEY);

    res.status(200).json({
      success: true,
      message: `Welcome ${decoded.email}`,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }

});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});