const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if this email is already taken before we do any work
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // hashing password 
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
                // doesnt include password
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Password confirmed — issue a signed token proving who they are
        const token = jwt.sign(
            { id: user._id },        // payload: just enough to identify them later
            process.env.JWT_SECRET,  // the server's secret signing key
            { expiresIn: "7d" }      // token stops being valid after 7 days
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;