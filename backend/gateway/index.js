import "./config/loadEnv.js";
import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import proxy from "express-http-proxy"
import { isAuth } from "./middleware/protect.js";
import { getCurrentUser } from "./controller/user.controller.js"
import { setProxyHeader } from "./utils/proxyHeaderSetter.js"

const PORT = process.env.PORT || 8000;
const app = express();

app.use(morgan("dev"))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// auth service proxy
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.use("/api/project", isAuth, setProxyHeader(process.env.PROJECT_SERVICE_URL));
app.use("/api/file", isAuth, setProxyHeader(process.env.FILE_SERVICE_URL));
app.use('/api/ai', isAuth, setProxyHeader(process.env.AI_SERVICE_URL));
app.use('/api/payment', isAuth, setProxyHeader(process.env.PAYMENT_SERVICE_URL));
app.get("/api/me", isAuth, getCurrentUser);

app.listen(PORT, () => {
    console.log(`Gateway Server is running on port ${PORT}`)
})