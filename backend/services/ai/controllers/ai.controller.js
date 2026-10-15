import expressAsyncHandler from "express-async-handler";
import { graph } from "../graph/graph.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";

const buildHistory = (history) => {
    if (!Array.isArray(history)) {
        return [];
    }
    const recents = history.slice(-6);
    return recents.filter((recent) => recent?.content && (recent.role == "user" || recent.role == "assistant"))
        .map((msg) => {
            if (msg.role == "user") {
                return new HumanMessage(msg.content);
            }
            return new AIMessage(msg.content);
        })
}


// send event 
const sendEvent = (res, type, data) => {
    if (res.writableEnded || res.destroyed) return false;
    try {
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data || {})}\n\n`);
        return true;
    } catch (error) {
        console.log(`SSE error: ${error}`);
        return false;
    }
}

export const chat = expressAsyncHandler(async (req, res, next) => {
    let disconnected = false;
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        const { projectId, message, history = [] } = req.body;

        if (!projectId || !message) {
            return res.status(400).json({
                message: "Please provide projectId and message."
            });
        }

        const graphData = graph({ projectId, userId });
        const messages = buildHistory(history);
        messages.push(new HumanMessage(message.trim()));


        // setting headers
        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");

        res.flushHeaders?.();

        res.once("close", () => {
            disconnected = true;
            console.log("AI CLIENT DISCONNECTED");
        })
        sendEvent(res, "state", {
            success: true,
            message: "AI CLIENT CONNECTED"
        })

        // stream messages
        const stream = await graphData.stream({
            messages
        }, {
            streamMode: "updates", recursionLimit: 40
        });

        // deduct credits from user
        await deductCredits(userId, 20);
        let finalMessage = "";

        for await (const chunk of stream) {
            if (disconnected || res.writableEnded || res.destroyed) {
                break;
            }
            if (chunk?.agent) {
                const agentMessages = chunk?.agent?.messages || [];
                const last = agentMessages[agentMessages.length - 1];
                if (!last) continue;
                if (Array.isArray(last.tool_calls) && last.tool_calls?.length) {
                    for (const call of last.tool_calls) {
                        sendEvent(res, "tool_start", {
                            tool: call.name,
                            args: call.args || {}
                        });
                    }
                    continue
                };
                let content = "";
                if (typeof last.content === "string") {
                    content = last.content;
                } else if (Array.isArray(last.content)) {
                    content = last.content
                        .filter((item) => item.type === "text")
                        .map((item) => item.text).join("")
                }
                if (content) {
                    finalMessage = content;
                    sendEvent(res, "message", {
                        content
                    })
                }
            }
            if (chunk.tools) {
                const toolMessages = chunk.tools?.messages || [];
                for (const toolMessage of toolMessages) {
                    let result = toolMessage.content;
                    try {
                        result = typeof result === "string" ? JSON.parse(result) : result;
                    } catch (error) {
                        continue;
                    }
                    if (result?.operation) {
                        sendEvent(res, result.operation, result);
                    }

                    sendEvent(res, "tool_result", typeof toolMessage === "string" ? toolMessage.content : JSON.stringify(toolMessage.content))
                }
            }
        }
        // 
        if (!disconnected && !res.writableEnded) {
            sendEvent(res, "done", {
                success: true,
                message: finalMessage || "done"
            })
        }


    } catch (error) {
        console.log(`Error in chat controller: ${error}`);
        if (disconnected) {
            return;
        }
        if (res.headersSent) {
            sendEvent(res, "error", {
                success: false,
                message: error.message || "AI request failed"
            })
            res.end();
            return;
        }
        next(error);
    }
})