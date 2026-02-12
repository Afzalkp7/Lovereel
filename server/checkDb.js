const mongoose = require("mongoose");
const Film = require("./Models/Film");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const count = await Film.countDocuments();
        console.log(`Film count: ${count}`);
        if (count === 0) {
            console.log("Database is empty. Seeding...");
            await Film.create([
                { imageUrl: "https://placehold.co/600x400", quote: "Here's looking at you, kid." },
                { imageUrl: "https://placehold.co/600x400", quote: "May the Force be with you." }
            ]);
            console.log("Seeding complete.");
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
