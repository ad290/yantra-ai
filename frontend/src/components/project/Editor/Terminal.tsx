import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css"
import { io } from "socket.io-client"
import { getAccessToken } from "../../../features/auth/token"
import { Eraser } from "lucide-react";
interface TerminalProps {
    projectId: string,
    userId: string
}

const Terminal = ({ projectId, userId }: TerminalProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<XTerminal>(null);
    const [isConnected, setisConnected] = useState(false);
    useEffect(() => {
        if (!projectId || !userId) return;
        const terminal = new XTerminal({
            cursorBlink: true,
            cursorStyle: "block",
            fontSize: 13,
            fontFamily: "monospace, Monaco, Consolas, Menlo",
            scrollback: 5000,
            theme: {
                background: "#0d0d0f",
                foreground: "#d4d4d4",
                cursor: "#ffffff",
                selectionBackground: "#264f78"
            }
        });
        const fitAddOn = new FitAddon();
        terminal.loadAddon(fitAddOn);
        terminal.open(containerRef.current!);
        terminalRef.current = terminal;
        const fitTerminal = () => {
            try {
                fitAddOn.fit()
            } catch { }
        }
        fitTerminal();
        const terminal_url = import.meta.env.VITE_TERMINAL_SERVICE_URL;
        if (!terminal_url) {
            terminal.write("\r\n\x1b[31mTerminal service is not available\x1b[0m\r\n");
            return () => terminal.dispose();
        }
        const accessToken = getAccessToken();
        if (!accessToken) {
            terminal.write("\r\n\x1b[31mNot authenticated for terminal\x1b[0m\r\n");
            return () => terminal.dispose();
        }
        const socket = io(terminal_url, {
            transports: ["websocket"],
            withCredentials: true,
            auth: { token: accessToken },
        })
        socket.on("connect", () => {
            terminal.write("\r\n\x1b[32mConnected to terminal service\x1b[0m\r\n");
            setisConnected(true);
            fitTerminal();

            socket.emit("terminal:init", { projectId, rows: terminal.rows, cols: terminal.cols });
        })

        socket.on("terminal:data", (data) => terminal.write(String(data) || ""));

        socket.on("terminal:ready", () => fitTerminal());
        socket.emit("terminal:resize", { rows: terminal.rows, cols: terminal.cols });
        terminal.focus();
        const input = terminal.onData((data) => {
            if (!socket.connected) return;
            socket.emit("terminal:write", data);
        })
        const resizeTerminal = () => {
            fitTerminal();
            if (!socket.connected) return;

            socket.emit("terminal:resize", { rows: terminal.rows, cols: terminal.cols });
        }
        window.addEventListener("resize", resizeTerminal);
        const reiszeObserver = new ResizeObserver(resizeTerminal);
        reiszeObserver.observe(containerRef.current!);

        const focusTerminal = () => terminal.focus();
        window.addEventListener("focus", focusTerminal);

        socket.on("connect_error", (error: any) => {
            setisConnected(false);
            terminal.write("\r\n\x1b[31m" + error.message + "\x1b[0m\r\n");
        })
        socket.on("disconnect", () => {
            setisConnected(false);
            terminal.write("\r\n\x1b[31mDisconnected from terminal service\x1b[0m\r\n");
        })
        return () => {
            window.removeEventListener("resize", resizeTerminal);
            reiszeObserver.disconnect();
            containerRef.current && containerRef.current?.removeEventListener("focus", focusTerminal);
            containerRef.current = null;
            input.dispose();
            terminal.dispose();
            socket.disconnect();
        }
    }, [projectId, userId]);
    const clearTerminal = () => {
        const terminal = terminalRef.current;
        if (!terminal) return;
        terminal.clear();
        terminal.write("\x1b[2J\x1b[H");
        terminal.focus();
    }




    return (
        <div className="flex h-full flex-col bg-[#0d0d0f]">
            <div className="flex h-7 shrink-0 items-center justify-between border-b border-white/5 px-3">
                <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-zinc-500"}`} />

                    <span className="text-xs text-zinc-500">
                        {isConnected ? "Terminal - Connected" : "Terminal - Disconnected"}
                    </span>
                </div>
                <button onClick={clearTerminal}
                    title="Clear Terminal"
                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white">
                    <Eraser />
                </button>
            </div>
            <div ref={containerRef} className="min-h-0 flex-1 cursor-text overflow-hidden"/>
        </div>
    )
}

export default Terminal