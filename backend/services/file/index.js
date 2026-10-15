import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import FileRouter from "./routes/file.route.js";
dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("File service is running");
});

app.use("/", FileRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    process.env.NODE_ENV === "production" ? res.status(statusCode).json({ success: false, message: err.message }) :
        res.status(statusCode).json({ message: err.message, stack: err.stack });
});
app.listen(process.env.FILE_PORT, () => {
    connectDB();
    console.log(`File service is running on port ${process.env.FILE_PORT}`);
});