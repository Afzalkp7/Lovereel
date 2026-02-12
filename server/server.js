const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const filmRoutes = require("./routes/filmRoute");
const authRoutes = require("./routes/authRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"));

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/films", filmRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(5000, () => console.log("Server running on 5000"));
