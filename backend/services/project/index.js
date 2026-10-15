import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import projectRouter from "./routes/project.route.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Project service is running");
});

app.use("/", projectRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    process.env.NODE_ENV === "production" ? res.status(statusCode).json({ success: false, message: err.message }) :
        res.status(statusCode).json({ message: err.message, stack: err.stack });
}); 
app.listen(process.env.PROJECT_PORT, () => {
    connectDB();
    console.log(`Project service is running on port ${process.env.PROJECT_PORT}`);
});