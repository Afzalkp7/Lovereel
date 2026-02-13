import dbConnect from '../../../lib/dbConnect';
import Film from '../../../models/Film';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increase limit for Base64 images
        },
    },
};

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
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
    } else if (req.method === 'POST') {
        try {
            const { userId, imageUrl, quote } = req.body;

            // Validate inputs
            if (!userId || !imageUrl) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const film = await Film.create({
                user: userId,
                imageUrl, // Base64 string
                quote
            });
            res.json(film);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
