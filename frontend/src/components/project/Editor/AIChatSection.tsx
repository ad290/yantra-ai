import { Bot, FileMinus, FilePen, FilePlus2, FolderPlus, Loader2, MessageSquare, Send, Sparkles, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { queryClient } from "../../../app/queryClient";
import { useChatMutation } from "../../../features/ai/tanstack-query";
import type { ChatEventLog, ChatEventType, ChatHistoryMessage, ChatStreamEvent, ToolType } from "../../../features/ai/types";
import { BRAND_NAME } from "../../../constants/brand";

const fileTreeKeys = (projectId: string) => ["file", "tree", projectId] as const;

const TOOL_META = {
    folder_created: { icon: FolderPlus, color: "text-sky-400", label: "Folder Created" },
    file_created: { icon: FilePlus2, color: "text-emerald-400", label: "File Created" },
    file_updated: { icon: FilePen, color: "text-amber-400", label: "File Updated" },
    file_deleted: { icon: FileMinus, color: "text-red-400", label: "File Deleted" },
    message: { icon: MessageSquare, color: "text-sky-400", label: "Message" },
    error: { icon: X, color: "text-red-400", label: "Error" },
}

// tool badge
const ToolBadge = ({ toolType, detail }: { toolType: ToolType | "message" | "error", detail?: string }) => {
    const meta = TOOL_META[toolType]
    if (!meta) return null;
    const Icon = meta.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center"
        >
            <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 py-1 px-3 text-xs text-zinc-400">
                <Icon size={14} className={`${meta.color}`} />
                <span>{meta.label}</span>
                {detail && <span className="text-zinc-600">&middot; {detail}</span>}
            </div>
        </motion.div>
    )
}
interface AIChatProps {
    projectId: string
}

const AIChatSection = ({ projectId }: AIChatProps) => {
    const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
    const [message, setMessage] = useState("");
    const [events, setEvents] = useState<ChatEventLog[]>([]);

    // add event function ....
    const addEvent = (type: ChatEventType, label: string, detail?: string) => {
        setEvents((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, label, detail }]);
    }

    // on Event function...
    const onEvent = async (event: ChatStreamEvent) => {
        if (event.type === "state") {
            addEvent("state", "Connected", event.data.message);
            return;
        }
        if (event.type === "tool_start") {
            addEvent("tool_start", `Running ${event.data.tool}`, JSON.stringify(event.data.args));
            return;
        }
        if (event.type === "tool_result") {
            let detail = event.data;
            try {
                const parsed = JSON.parse(event.data);
                detail = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
            } catch (error) {

            }
            addEvent("tool_result", "Tool completed", detail);
            return;
        }
        if (
            event.type === "file_created" ||
            event.type === "folder_created" ||
            event.type === "file_deleted" ||
            event.type === "file_updated"
        ) {
            const detail = event.data.file?.name || event.data.folder?.name || "Completed";
            addEvent(event.type, event.type.replaceAll("_", " "), detail);
            // invalidate query
            void queryClient.invalidateQueries({ queryKey: fileTreeKeys(projectId) });
            return;
        }
        if (event.type === "message") {
            setMessages((prev) => {
                const lastMessage = prev.at(-1);
                if (lastMessage?.role === "assistant") {
                    return [
                        ...prev.slice(0, - 1),
                        {
                            ...lastMessage,
                            content: event.data.content
                        }
                    ];
                }
                return [
                    ...prev,
                    {
                        role: "assistant",
                        content: event.data.content
                    }
                ]
            });
        }
        if (event.type === "error") {
            addEvent("error", "AI Error", event.data.message);
        }
        if (event.type === "done") {
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(projectId) });
            addEvent("done", "Completed", event.data.message);
        }
    };

    const aiChatMutation = useChatMutation(onEvent);

    // handle Send message  function
    const handleSendMessage = () => {
        const isTrimmedMessage = message.trim();
        if (!isTrimmedMessage || aiChatMutation.isPending) return;
        setMessages((prev) => [...prev, { role: "user", content: message }]);
        let msg = message.trim();
        setMessage("");
        aiChatMutation.mutate({ message: msg, history: messages, projectId }, {
            onSuccess: () => {
                setMessage("");
            }
        });
    }
    return (
        <div className="flex w-80 shrink-0 flex-col border border-white/6 bg-[#111113]/90 backdrop-blur-xl">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/6 px-3">
                <span className="text-xs font-semibold tracking-wider text-zinc-300">{`${BRAND_NAME} Chat`}</span>
            </div>
            {/* message section */}
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {/* Empty section */}
                {messages.length === 0 && (
                    <div className="mt-10 text-center">
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-white/6 bg-white/2"><Sparkles size={22} className="text-zinc-600" /></div>
                        <p className="text-sm font-medium text-zinc-400">What do you want to build?</p>
                        <p className="mt-1.5 text-xs text-zinc-600">Ask me to create or modify files.</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        if (msg.role === "tool" && msg.toolType) {
                            return (
                                <ToolBadge
                                    key={`${msg.toolType}-${index}`}
                                    toolType={msg.toolType}
                                    detail={msg.detail}
                                />
                            );
                        }
                        const isUser = msg.role === "user";

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                key={`${msg.role}-${index}`}
                                className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-white/10 text-zinc-300" : "bg-linear-to-br from-sky-400 to-violet-400 text-white"}`}>
                                    {isUser ? <User size={12} /> : <Bot size={12} />}
                                </div>

                                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${isUser ? "bg-linear-to-b from-sky-500 to-sky-600 text-white" : msg.toolType === "error" ? "border border-red-500/20 bg-red-500/10 text-red-300" : "border border-white/6 bg-white/3 text-zinc-300 "} `}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div className="space-y-2 border-t border-white/6 px-3 py-2">
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-md border border-white/6 bg-white/3 px-2 py-1.5"
                        >
                            <div className="flex items-center gap-2 text-xs">
                                {event.type === "tool_start" && (
                                    <Loader2
                                        size={12}
                                        className="animate-spin text-sky-400"
                                    />
                                )}

                                {event.type === "done" && (
                                    <span className="text-emerald-400">✓</span>
                                )}

                                {event.type === "error" && (
                                    <X size={12} className="text-red-400" />
                                )}

                                <span className="capitalize text-zinc-300">
                                    {event.label}
                                </span>
                            </div>
                            {event.detail && (
                                <p className="mt-1 truncate pl-5 text-[11px] text-zinc-500">
                                    {event.detail}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {aiChatMutation.isPending && (
                    <div className="flex items-center gap-2 pl-8 text-xs text-zinc-500">
                        <Loader2 size={13} className="animate-spin" />
                        <span>AI is thinking...</span>
                    </div>
                )}
            </div>

            {/* input section */}
            <div className="border-t border-white/6 p-3">
                <div className="flex items-end gap-2 rounded-lg border border-white/8 bg-white/3 p-2 transition-colors focus-within:border-sky-400/40">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask AI to build something"
                        className="flex-1 resize-none bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                    />
                    <motion.button
                        onClick={handleSendMessage}
                        disabled={
                            aiChatMutation.isPending ||
                            message.trim().length === 0
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex size-8 items-center justify-center rounded-md bg-linear-to-b from-sky-500 to-sky-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition-opacity hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {
                            aiChatMutation.isPending ? <Loader2 size={13} className="animate-spin" /> :
                                <Send size={16} className="relative" />
                        }
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default AIChatSection