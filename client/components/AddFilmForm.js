import { useState } from "react";
import axios from "axios";

export default function AddFilmForm({ onFilmAdded }) {
    const [imageFile, setImageFile] = useState(null);
    const [quote, setQuote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User ID missing. Please login again.");
            setLoading(false);
            return;
        }

        try {
            if (!imageFile) throw new Error("Please select an image");

            const base64Image = await convertToBase64(imageFile);

            await axios.post("/api/films", {
                userId,
                imageUrl: base64Image,
                quote
            });

            setImageFile(null);
            setQuote("");
            // Reset file input manually since we don't have a ref
            document.getElementById("fileInput").value = "";

            if (onFilmAdded) onFilmAdded();

        } catch (err) {
            console.error(err);
            setError("Failed to add film. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-gray-900/90 border border-red-900/30 p-4 md:p-8 rounded-xl shadow-2xl backdrop-blur-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl text-red-100 mb-4 font-serif italic">Add to Reel</h3>

            {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

            <div className="mb-4">
                <label className="block text-red-200/70 text-sm mb-2">Upload Photo</label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                    className="w-full bg-black/50 border border-red-900/50 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900 file:text-white hover:file:bg-red-800"
                />
            </div>

            <div className="mb-6">
                <label className="block text-red-200/70 text-sm mb-2">Quote</label>
                <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="A memorable line..."
                    required
                    rows="2"
                    className="w-full bg-black/50 border border-red-900/50 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-900 to-red-700 text-white font-bold py-2 rounded hover:from-red-800 hover:to-red-600 transition-all disabled:opacity-50 shadow-lg"
            >
                {loading ? "Adding..." : "Add Film"}
            </button>
        </form>
    );
}
