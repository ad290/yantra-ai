import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, access token not found.",
            });
        }
        const token = authHeader.slice(7);
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return res.status(503).json({
                success: false,
                message: "Authentication is not configured",
            });
        }
        const decoded = jwt.verify(token, secret);
        if (decoded.typ !== "access") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, invalid token type.",
            });
        }
        req.user = {
            _id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
        };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, access token expired.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Unauthorized, invalid access token.",
        });
    }
};
