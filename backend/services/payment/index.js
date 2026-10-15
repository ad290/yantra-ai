import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import paymentRouter from "./routes/payment.route.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Payment service is running");
});

app.use("/", paymentRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    process.env.NODE_ENV === "production" ? res.status(statusCode).json({ success: false, message: err.message }) :
        res.status(statusCode).json({ message: err.message, stack: err.stack });
}); 
app.listen(process.env.PAYMENT_PORT, () => {
    connectDB();
    console.log(`Payment service is running on port ${process.env.PAYMENT_PORT}`);
});