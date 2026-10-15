import express from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { addCredits, deductCredits } from "../controllers/credits.controller.js";
import { getUserById } from "../controllers/user.controller.js";
import { requireInternalService } from "../middleware/internalAuth.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

authRouter.get("/internal/users/:userId", requireInternalService, getUserById);
authRouter.post("/add-credits", requireInternalService, addCredits);
authRouter.post("/deduct-credits", requireInternalService, deductCredits);

export default authRouter;
