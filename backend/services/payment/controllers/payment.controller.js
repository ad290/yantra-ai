import expressAsyncHandler from "express-async-handler";
import razorpay from "../config/razorpay.js";
import PaymentModel from "../models/payement.model.js";
import crypto from "crypto";
import { addCredits } from "../utils/updateCredits.js";

const PLANS = {
    pro: {
        name: "Pro",
        amount: 29900,
        credits: 500
    },
    team: {
        name: "Team",
        amount: 79900,
        credits: 1500
    }
}

/**
 * @createOrder
 * @description create order
 * @header {x-user_id}
 * @body {plan}
 */
export const createOrder = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        const { plan } = req.body;
        const planDetails = PLANS[plan];
        if (!planDetails) {
            return res.status(400).json({
                message: "Invalid plan."
            });
        }

        // create order
        const order = await razorpay.orders.create({
            amount: planDetails.amount,
            currency: "INR",
            receipt: `receipt-${Date.now()}-${Math.random()}`,
            notes: {
                plan: planDetails.name,
                userId
            }
        })
        await PaymentModel.create({
            userId,
            plan, amount:
                planDetails.amount,
            credits: planDetails.credits,
            currency: "INR",
            razorPayOrderId: order.id
        });

        res.status(201).json({
            message: "Order created successfully.",
            order: {
                id: order.id,
                currency: order.currency,
                amount: order.amount
            },
            plan: {
                name: planDetails.name,
                credits: planDetails.credits
            },
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.log(`Error in create order service: ${error}`);
        next(error);
    }
})

/**
 * @verify
 * @description verify payment
 * @header {x-user_id}
 * @body {razorpay_payment_id, razorpay_order_id, razorpay_signature}
 */
export const verify = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                message: "Invalid request."
            });
        }

        const payment = await PaymentModel.findOne({ razorPayOrderId: razorpay_order_id });
        if (!payment) {
            return res.status(400).json({
                message: "Payment not found."
            });
        }

        // check if payment is already paid
        if (payment.status === "completed") {
            return res.status(400).json({
                message: "Payment already verified."
            });
        }

        // verify payment
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (razorpay_signature !== generatedSignature) {
            payment.status = "failed",
                await payment.save();
            return res.status(400).json({
                message: "Payment verification failed."
            });
        }

        payment.status = "completed";
        payment.razorPayPaymentId = razorpay_payment_id;
        await payment.save();

        // add credits to user
        const response = await addCredits(userId, payment.credits);
        if (typeof response === "string") throw new Error(response);

        res.status(200).json({
            message: "Payment verified successfully.",
            credits: response.credits
        });

    } catch (error) {
        console.log(`Error in verify Payment controller: ${error}`);
        next(error);
    }
})

/**
 * @getPaymentHistory
 * @description get payment history
 * @header {x-user_id}
 */
export const getPaymentHistory = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const payments = await PaymentModel.find({ userId });
        res.status(200).json(payments);
    } catch (error) {
        console.log(`Error in getPaymentHistory controller: ${error}`);
        next(error);
    }
})