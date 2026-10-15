import "./config/loadEnv.js";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "production") {
        res.status(statusCode).json({ success: false, message: err.message });
    } else {
        res.status(statusCode).json({ message: err.message, stack: err.stack });
    }
});

app.listen(process.env.AUTH_PORT, () => {
    connectDB();
    console.log(`Auth service is running on port ${process.env.AUTH_PORT}`);
});
