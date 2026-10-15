import path from "path";
import os from "os";
const WORK_SPACE_ROOT = path.join(os.tmpdir(), "vertex-ai")     // c://temp/vertex-ai/prijectId
const SHELL = process.platform === "win32" ? "powershell.exe" : "bash"

// safe file/folder name
export const safeName = (name) => {
    if (!name || name === "." || name === ".." || name.includes("/") || name.includes("\\") || name.includes(":")) {
        throw new Error(`Invalid file/folder name: ${name}`);
    }
    return name;
}

// workspace
export const workspace = (projectId) => {
    return path.join(WORK_SPACE_ROOT, String(projectId));
}

// normalize columns
export const normalizeColumns = (cols) => {
    const value = Number(cols);
    if (!Number.isFinite(value)) return 80;
    return Math.max(20, Math.min(Math.floor(value), 500));
}

// normalize rows
export const normalizeRows = (rows) => {
    const value = Number(rows);
    if (!Number.isFinite(value)) return 30;
    return Math.max(5, Math.min(Math.floor(value), 200));
}