import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: String,
        enum: ["pro", "team"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    razorPayOrderId: {
        type: String,
        required: true
    },
    razorPayPaymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    }
}, {timestamps: true});

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;