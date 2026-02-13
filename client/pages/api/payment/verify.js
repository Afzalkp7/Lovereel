import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment Success -> Update User
            await User.findByIdAndUpdate(userId, {
                isPaid: true,
                paymentId: razorpay_payment_id,
                paymentDate: new Date(),
                amountPaid: 19
            });

            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (err) {
        console.error("Payment Verification Error:", err);
        res.status(500).json({ message: err.message });
    }
}
