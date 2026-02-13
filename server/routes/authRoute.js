const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
console.log("-> Auth Routes Module Loaded <-"); // DEBUG LOG

// SECRET for JWT
const JWT_SECRET = process.env.JWT_SECRET || "lovereel_secret_key_123";

// REGISTER
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        console.log("Signup Request:", { name, email }); // LOGGING

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email); // LOGGING
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate Username
        let username = name.toLowerCase().replace(/\s+/g, '-');
        // Ensure uniqueness roughly (append random chars if taken could be implemented, but simple for now)
        // Check if username exists
        let userExists = await User.findOne({ username });
        if (userExists) {
            username = `${username}-${Math.floor(Math.random() * 1000)}`;
        }

        // Hash password
        console.log("Hashing password..."); // LOGGING
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        console.log("Creating user...", username); // LOGGING
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        console.log("User Saved:", savedUser._id); // LOGGING

        // Generate Token
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                username: savedUser.username,
                email: savedUser.email,
                isPaid: savedUser.isPaid
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                isPaid: user.isPaid
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
