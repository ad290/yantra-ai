import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return next(new Error("Authentication is not configured"));
        }
        const decoded = jwt.verify(token, secret);
        if (decoded.typ !== "access") {
            return next(new Error("Unauthorized"));
        }
        socket.userId = decoded.sub;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
};
