const mongoose = require("mongoose");

const FilmSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: String,
    quote: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Film || mongoose.model("Film", FilmSchema);
