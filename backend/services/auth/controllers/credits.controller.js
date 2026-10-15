import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";

export const deductCredits = asyncHandler(async (req, res, next) => {
    const { userId, amount } = req.body;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized, user Id not found.",
        });
    }
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({
            message: "User not found.",
        });
    }
    if (user.credits < amount) {
        return res.status(400).json({
            message: "Insufficient credits.",
        });
    }
    user.credits -= amount;
    await user.save();
    res.status(200).json({
        message: "Credits deducted successfully.",
        credits: user.credits,
    });
});

export const addCredits = asyncHandler(async (req, res, next) => {
    const { userId, amount } = req.body;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized, user Id not found.",
        });
    }
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({
            message: "User not found.",
        });
    }
    user.credits += amount;
    await user.save();
    res.status(200).json({
        message: "Credits added successfully.",
        credits: user.credits,
    });
});
