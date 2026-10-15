import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import type { ChatEventHandler, ChatInputType, ChatResponseType } from "../types"
import { chat } from "../services/ai.api.services"
import { toast } from "react-toastify"
import { queryClient } from "../../../app/queryClient"

const AISessionKeys = ["ai", "session"] as const;

export const useChatMutation = ( onEvent?:ChatEventHandler): UseMutationResult<ChatResponseType, Error, ChatInputType> => {
    return useMutation<ChatResponseType, Error, ChatInputType>({
        mutationFn: async (input: ChatInputType) => {
            const response = await chat(input, onEvent);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: ChatResponseType) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: AISessionKeys });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}