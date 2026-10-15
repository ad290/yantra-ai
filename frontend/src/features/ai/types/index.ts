export type ToolType = "file_created" | "folder_created" | "file_updated" | "file_deleted";

export type ChatInputType = {
    projectId: string;
    message: string;
    history: ChatHistoryMessage[];
};

export type ChatHistoryMessage = {
    role: "user" | "assistant" | "tool";
    content?: string;
    detail?: string;
    toolType?: ToolType | "error" | "message";
};

export type FileToolType = {
    _id: string;
    name: string;
    type: "file" | "folder";
    parentId: string | null;
    language?: string;
    content?: string;
    extension?: string;
}

export type ChatResponseType = {
    success: boolean;
    message: string;
    content?: string;
    file?: FileToolType;
    folder?: FileToolType;
};

export type ChatStreamEvent =
    | {
        type: "state";
        data: {
            success: boolean;
            message: string;
        };
    }
    | {
        type: "message";
        data: {
            content: string;
        };
    }
    | {
        type: "tool_start";
        data: {
            tool: string;
            args: Record<string, unknown>;
        };
    }
    | {
        type: "tool_result";
        data: string;
    }
    | {
        type: ToolType;
        data: ChatResponseType;
    }
    | {
        type: "error";
        data: {
            success: false;
            message: string;
        };
    }
    | {
        type: "done";
        data: ChatResponseType;
    };

export type ChatEventHandler = (
    event: ChatStreamEvent,
) => void | Promise<void>;

export type ChatEventType =
    | "state"
    | "message"
    | "tool_start"
    | "tool_result"
    | "file_created"
    | "folder_created"
    | "file_updated"
    | "file_deleted"
    | "error"
    | "done";

export type ChatEventLog = {
    id: string;
    type: ChatEventType;
    label: string;
    detail?: string;
};
