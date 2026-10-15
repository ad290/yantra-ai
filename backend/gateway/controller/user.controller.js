import asyncHandler from "express-async-handler";
import axios from "axios";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    try {
        const authServiceUrl = process.env.AUTH_SERVICE_URL;
        const internalKey = process.env.INTERNAL_SERVICE_KEY;
        if (!authServiceUrl || !internalKey) {
            return res.status(503).json({
                success: false,
                message: "User profile service is not configured",
            });
        }
        const { data } = await axios.get(
            `${authServiceUrl}/internal/users/${req.user._id}`,
            {
                headers: { "x-internal-api-key": internalKey },
            }
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(`Error in getCurrentUser controller: ${error}`);
        next(error);
    }
});
