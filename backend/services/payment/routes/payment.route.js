import router from "express";
import { createOrder, getPaymentHistory, verify } from "../controllers/payment.controller.js";

const paymentRouter = router.Router();

paymentRouter.post("/create-checkout-session", createOrder);
paymentRouter.post("/verify-payment", verify);
paymentRouter.get("/get-payment-history", getPaymentHistory);

export default paymentRouter;