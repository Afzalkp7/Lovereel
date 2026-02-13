import mongoose from 'mongoose';

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

export default mongoose.models.Film || mongoose.model("Film", FilmSchema);
