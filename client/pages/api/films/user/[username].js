import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import Film from '../../../../models/Film';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { username } = req.query;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let isOwner = false;

        // Check for Auth Token (Preview Mode)
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            try {
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

        // Return object with metadata
        res.json({ films, isOwner, isPaid: user.isPaid });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
