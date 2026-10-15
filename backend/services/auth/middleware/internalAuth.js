export const requireInternalService = (req, res, next) => {
    const expected = process.env.INTERNAL_SERVICE_KEY;
    if (!expected) {
        return res.status(503).json({
            success: false,
            message: "Internal service authentication is not configured",
        });
    }
    const provided = req.headers["x-internal-api-key"];
    if (!provided || provided !== expected) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized internal request",
        });
    }
    next();
};
