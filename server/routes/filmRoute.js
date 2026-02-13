const express = require("express");
const router = express.Router();
const Film = require("../models/Film");
const User = require("../models/User"); // Import User model
const multer = require("multer");
const path = require("path");

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET films (optionally filter by userId)
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) {
            query.user = userId;
        }
        const films = await Film.find(query);
        res.json(films);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET films by USERNAME (Public View)
router.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let isOwner = false;

        // Check for Auth Token (Preview Mode)
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            try {
                // We need to import jwt and process.env.JWT_SECRET (or define it here if reused)
                // Ideally move JWT_SECRET to a shared config or env
                const jwt = require("jsonwebtoken");
                const JWT_SECRET = process.env.JWT_SECRET || "lovereel_secret_key_123";

                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded.id === user._id.toString()) {
                    isOwner = true;
                }
            } catch (e) {
                // Invalid token, ignore (treat as public)
            }
        }

        // STRICT LOCK: Check if user has paid OR is owner
        if (!user.isPaid && !isOwner) {
            return res.status(403).json({ message: "Reel locked", isLocked: true });
        }

        const films = await Film.find({ user: user._id });

        // If owner but unpaid, we might want to flag it in response so frontend can show "Preview Mode"
        res.json({ films, isOwner, isPaid: user.isPaid });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        let imageUrl = req.body.imageUrl;

        // If file uploaded, construct URL
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const film = await Film.create({
            user: req.body.userId, // Expect userId in body
            imageUrl,
            quote: req.body.quote
        });
        res.json(film);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Film.findByIdAndDelete(req.params.id);
        res.json({ message: "Film deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
