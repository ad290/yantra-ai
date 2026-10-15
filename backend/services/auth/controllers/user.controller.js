import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { toPublicUser } from "../utils/userPublic.js";

export const getUserById = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json(toPublicUser(user));
});
