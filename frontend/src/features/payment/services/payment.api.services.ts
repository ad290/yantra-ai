import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/axios"
import type { CreateOrderResponseType, PaymentType, VerifyPaymentRequestType, VerifyPaymentResponseType } from "../types";

/**
 * @createOrder 
 * @description create order
 * @param plan
 * @returns {CREATEORDERRESPONSETYPE | string (error message)}
 */
export const createOrder = async (plan: "pro" | "team"): Promise<CreateOrderResponseType | string> => {
    try {
        const response = await axiosInstance.post(`/payment/create-checkout-session`, { plan });
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) return error.response?.data.message;
        else return error.message;
    }
}

/**
 * @verifyPayment
 * @description verify payment
 * @param input 
 * @returns 
 */
export const verfyPayment = async (input: VerifyPaymentRequestType): Promise<VerifyPaymentResponseType | string> => {
    try {
        if (!input.razorpay_payment_id || !input.razorpay_order_id || !input.razorpay_signature) throw new Error("Invalid input");
        const response = await axiosInstance.post("/payment/verify-payment", input);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) return error?.response?.data.message;
        else return error.message;
    }
}

/**
 * @getPaymentHistory
 * @description get payment history
 * @returns 
 */
export const getPaymentHistoryService = async (): Promise<PaymentType[] | string> => {
    try {
        const response = await axiosInstance.get("/payment/get-payment-history");
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) return error?.response?.data.message;
        else return error.message;
    }
}