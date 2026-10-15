export type CreateOrderResponseType = {
  message: string,
  order: {
    id: string,
    amount: number,
    currency: string
  },
  plan: {
    name: string,
    credits: number
  },
  key_id: string
}

export type VerifyPaymentRequestType = {
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string
}

export type VerifyPaymentResponseType = {
  message: string,
  credits: number
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
  };
  theme?: { color: string };
  callback_url?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentType {
  userId: string,
  plan: string,
  amount: number,
  credits: number,
  currency: string,
  razorPayOrderId: string,
  razorPayPaymentId: string,
  status: "pending" | "completed" | "failed",
  createdAt: Date,
  updatedAt: Date
}