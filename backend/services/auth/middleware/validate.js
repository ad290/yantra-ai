import { z } from "zod";

const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(1, "Password is required").max(128),
});

export const validateRegister = (req, res, next) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: parsed.error.issues[0]?.message || "Validation failed",
        });
    }
    req.validated = parsed.data;
    next();
};

export const validateLogin = (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: parsed.error.issues[0]?.message || "Validation failed",
        });
    }
    req.validated = parsed.data;
    next();
};
