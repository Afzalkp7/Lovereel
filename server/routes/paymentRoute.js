const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order (Amount: ₹19)
router.post("/create-order", async (req, res) => {
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
});

// Verify Payment
router.post("/verify", async (req, res) => {
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
});

module.exports = router;
