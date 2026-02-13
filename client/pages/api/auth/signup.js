import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate Username
        let username = name.toLowerCase().replace(/\s+/g, '-');
        let userExists = await User.findOne({ username });
        if (userExists) {
            username = `${username}-${Math.floor(Math.random() * 1000)}`;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                username: savedUser.username,
                email: savedUser.email,
                isPaid: savedUser.isPaid
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
