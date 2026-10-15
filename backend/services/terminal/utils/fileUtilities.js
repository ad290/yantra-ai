import dotenv from "dotenv";
import { safeName, workspace } from "./utilFn.js";
import path from "path";
import fs from "fs/promises";
dotenv.config();

const fileServiceUrl = process.env.FILE_SERVICE_URL || "http://localhost:8003";


export const getTree = async (projectId, userId) => {
    const url = `${fileServiceUrl}/tree/${projectId}`;
    const response = await fetch(url, {
        headers: {
            "x-user_id": String(userId)
        }
    })
    const text = await response.text();
    let data = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch (error) {
        data = { message: text };
    }
    if (!response.ok) throw new Error(data?.message || `File Service returned error: ${response.status}`);

    return Array.isArray(data) ? data : [];
}

export const writeNodes = async (nodes, directory) => {
    if (!Array.isArray(nodes)) return;

    for (const node of nodes) {
        const name = safeName(node.name);
        const target = path.join(directory, name);
        if (node.type === "folder") {
            await fs.mkdir(target, { recursive: true });
            writeNodes(node.children || [], target);
            continue;
        }
        if (node.type === "file") {
            await fs.mkdir(path.dirname(target), { recursive: true });
            await fs.writeFile(target, node.content || "", "utf8");
        }
    }
}


export const syncProject = async (projectId, userId) => {
    const tree = await getTree(projectId, userId);

    const root = workspace(projectId);
    await fs.mkdir(root, { recursive: true });
    if (tree.length == 1 && tree[0]?.type === "folder") {
        await writeNodes(tree[0].children || [], root);
    } else {
        await writeNodes(tree || [], root);
    }
    return { tree, root }
}