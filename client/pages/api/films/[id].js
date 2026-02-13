import dbConnect from '../../../lib/dbConnect';
import Film from '../../../models/Film';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { id } = req.query;
        await Film.findByIdAndDelete(id);
        res.json({ message: "Film deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
