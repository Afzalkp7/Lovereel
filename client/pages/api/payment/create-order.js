import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const options = {
            amount: 1900, // 1900 paise = ₹19
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send("Error creating order");

        res.json(order);
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).send(err);
    }
}
