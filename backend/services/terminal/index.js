import dotenv from "dotenv";
import express from "express";
import http from "http";
import pty from "node-pty";
import { Server } from "socket.io";
import { syncProject } from "./utils/fileUtilities.js";
import { normalizeColumns, normalizeRows } from "./utils/utilFn.js";
import { socketAuth } from "./middleware/socketAuth.js";
dotenv.config();

const app = express();

app.use(express.json());

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

const SHELL = process.platform === "win32" ? "powershell.exe" : "bash"

const sessions = new Map();

io.use(socketAuth);

const send = (socket, data) => {
    if (!socket.connected) {
        return;
    }
    socket.emit("terminal:data", String(data || ""));
}

io.on("connection", (socket) => {
    console.log(`terminal connected`, socket?.id);

    // init
    socket.on("terminal:init", async ({ projectId, cols = 80, rows = 30 }) => {
        try {
            projectId = String(projectId);
            const userId = String(socket.userId);

            if (!projectId || !userId) {
                throw new Error("projectId and userId are required");
            }

            const existingSession = sessions.get(socket.id);
            if (existingSession) {
                try {
                    existingSession.ptyProcess.kill();
                } catch (error) {

                }
                sessions.delete(socket.id);
            }
            cols = normalizeColumns(cols);
            rows = normalizeRows(rows);

            const { root } = await syncProject(projectId, userId);
            const ptyProcess = pty.spawn(
                SHELL,
                [],
                {
                    name: "xterm-256color",
                    cols,
                    rows,
                    cwd: root,
                    env: {
                        ...process.env,
                        FORCE_COLOR: "1",
                    }
                }
            )

            ptyProcess.onData((data) => {
                send(socket, data);
            })

            ptyProcess.onExit(({ exitCode }) => {
                send(socket, `\r\n\x1b[90m[shell exited: ${exitCode}]\x1b[0m\r\n`);
                const session = sessions.get(socket.id);
                if (session?.ptyProcess === ptyProcess) {
                    sessions.delete(socket.id);
                }
            })
            sessions.set(socket.id, {
                projectId, userId, ptyProcess, cwd: root
            })

            socket.emit("terminal:ready", { cols, rows })
        } catch (error) {
            console.log(`terminal:init error: ${error}`);
            send(socket, `\r\n\x1b[31m[error: ${error.message}]\x1b[0m\r\n`);
        }
    })

    // write
    socket.on("terminal:write", (data) => {
        const session = sessions.get(socket.id);
        if (!session) return;
        session.ptyProcess.write(String(data));
    })

    // resize
    socket.on("terminal:resize", ({ cols, rows }) => {
        const session = sessions.get(socket.id);
        if (!session) return;
        cols = Number(cols);
        rows = Number(rows);
        if (!Number.isFinite(cols) || !Number.isFinite(rows)) return;
        cols = normalizeColumns(cols);
        rows = normalizeRows(rows);
        session.ptyProcess.resize(cols, rows);
    })

    //  disconnect
    socket.on("disconnect", () => {
        console.log(`terminal disconnected`);
        const session = sessions.get(socket.id);
        if (session) {
            try {
                session.ptyProcess.kill();
                sessions.delete(socket.id);
            } catch { }
        }
    })
})

// health route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "terminal" });
});

// use error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    process.env.NODE_ENV === "production" ? res.status(statusCode).json({ success: false, message: err.message }) :
        res.status(statusCode).json({ message: err.message, stack: err.stack });
});

server.listen(process.env.TERMINAL_PORT, () => {
    console.log(`Terminal service is running on port ${process.env.TERMINAL_PORT}`);
});