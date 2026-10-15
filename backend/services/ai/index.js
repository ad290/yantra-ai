import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import airouter from "./routes/ai.routes.js";
dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI service is running");
});

app.use("/", airouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    process.env.NODE_ENV === "production" ? res.status(statusCode).json({ success: false, message: err.message }) :
        res.status(statusCode).json({ message: err.message, stack: err.stack });
});


app.listen(process.env.AI_PORT, () => {
    connectDB();
    console.log(`AI service is running on port ${process.env.AI_PORT}`);
});