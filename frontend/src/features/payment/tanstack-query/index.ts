import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createOrder, getPaymentHistoryService, verfyPayment } from "../services/payment.api.services";
import type { CreateOrderResponseType, PaymentType, VerifyPaymentRequestType, VerifyPaymentResponseType } from "../types";
import { queryClient } from "../../../app/queryClient";

/**
 * @useCreateOrderMutation
 * @description create order
 * @returns 
 */
export const useCreateOrderMutation = (): UseMutationResult<CreateOrderResponseType, Error, "pro" | "team"> => {
    return useMutation<CreateOrderResponseType, Error, "pro" | "team">({
        mutationFn: async (plan) => {
            const response = await createOrder(plan);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: CreateOrderResponseType) => {
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useVerifyOrderMutation
 * @description verify order
 * @returns 
 */
export const useVerifyOrderMutation = (): UseMutationResult<VerifyPaymentResponseType, Error, VerifyPaymentRequestType> => {
    return useMutation<VerifyPaymentResponseType, Error, VerifyPaymentRequestType>({
        mutationFn: async (input) => {
            const response = await verfyPayment(input);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: VerifyPaymentResponseType) => {
            queryClient.invalidateQueries({ queryKey: ["payment-history"] });
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

export const usePaymentHistoryQuery = (): UseQueryResult<PaymentType[], Error> => {
    const cachedData = queryClient.getQueryData<PaymentType[]>(["payment-history"]);
    return useQuery<PaymentType[], Error>({
        queryKey: ["payment-history"],
        queryFn: async () => {
            const response = await getPaymentHistoryService();
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        initialData: cachedData,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}