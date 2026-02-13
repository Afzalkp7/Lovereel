import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String,
        default: null
    },
    paymentDate: {
        type: Date,
        default: null
    },
    amountPaid: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
