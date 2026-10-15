import type { ChatEventHandler, ChatInputType, ChatResponseType, ChatStreamEvent } from "../types";

type StreamEventData =
    | ChatResponseType
    | { content: string }
    | { success: boolean; message: string }
    | string
    | Record<string, unknown>;

type ParsedEvent = {
    type: string;
    data: unknown;
}

const parseEvent = (eventText: string): ParsedEvent | null => {
    let type = "message";
    const dataLines: string[] = [];

    for (const line of eventText.split(/\r?\n/)) {
        if (line.startsWith("event:")) {
            type = line.slice("event:".length).trim();
        }
        if (line.startsWith("data:")) {
            dataLines.push(line.slice("data:".length).trim());
        }
    }

    if (dataLines.length === 0) {
        return null;
    }

    const dataText = dataLines.join("\n");

    try {
        return {
            type,
            data: JSON.parse(dataText) as StreamEventData
        }
    } catch (error) {
        return {
            type,
            data: dataText
        }
    }
}
export const chat = async ({ projectId, history, message }: ChatInputType, onEvent?: ChatEventHandler): Promise<ChatResponseType> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        },
        credentials: "include",
        body: JSON.stringify({ projectId, history, message }),
    })
    if (!response.ok) {
        let errorMessage = "AI Request failed";
        try {
            const data = await response.json();
            errorMessage = data?.message || errorMessage
        } catch { }
        throw new Error(errorMessage)
    }

    if (!response.body) {
        throw new Error("AI Streaming is not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
        while (true) {
            const { value, done } = await reader.read();

            buffer += decoder.decode(value, { stream: !done });

            const events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop() ?? "";

            for (const eventText of events) {
                const parsedEvent = parseEvent(eventText);

                if (!parsedEvent) {
                    continue;
                }

                const event = {
                    type: parsedEvent.type,
                    data: parsedEvent.data
                } as ChatStreamEvent;

                await onEvent?.(event);

                if (event.type === "error") {
                    const errorData = event.data as { message?: string };
                    throw new Error(errorData.message || "AI request failed");
                }

                if (event.type === "done") {
                    const data = event.data as ChatResponseType;

                    if (
                        typeof data.success !== "boolean" ||
                        typeof data.message !== "string"
                    ) {
                        throw new Error("Invalid AI response");
                    }

                    return data;
                }
            }

            if (done) {
                break;
            }
        }
    } finally {
        reader.releaseLock();
    }
    throw new Error("AI stream ended before completion");
}