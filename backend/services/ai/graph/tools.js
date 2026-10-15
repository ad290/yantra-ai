import { tool } from "@langchain/core/tools";
import { createFile, createFolder, deleteFile, getFile, getFileTree, updateFile } from "../utils/fetchFileAPIs.js";
import { z } from "zod";

const compactTree = (items = []) => {
    return items.map((item) => ({
        _id: item._id,
        parentId: item.parentId,
        name: item.name,
        type: item.type,
        language: item.language,
        extension: item.extension,
        children: compactTree(item.children || [])
    }))
}
export const fileTools = ({ projectId, userId }) => {
    // get file-tree tool
    const getFileTreeTool = tool(async () => {
        console.log("ai tool-get_tree")
        const result = await getFileTree({ projectId, userId });
        const tree = compactTree(result);
        return JSON.stringify({
            success: true, tree
        })
    }, {
        name: "get_tree",
        description: `
            Get the complete project file and folder tree.

            Important: 
                1. Use this when the project structure is unknown.
                2. Do not repeatedly call get_tree.
                3. type="folder" means folder.
                4. type="file" means file.
                5. Folder IDs are used as parentId.
                6. Never call get_file with a folder ID.
                7. Do not use terminal commands to inspect the project.
                8. Use the exact IDs returned by this tool.

            The tree contains: 
                _id
                parentId
                name
                type 
                extension
                language
                children
        `,
        schema: z.object({})
    })

    // get File tool
    const getFileTool = tool(async ({ fileId }) => {
        console.log("ai tool-get_file")
        const file = await getFile({ fileId, userId });
        if (!file) {
            console.log(`file not found`)
            return JSON.stringify({
                success: false,
                error: "file not found"
            })
        }
        if (file && file.type != "file") {
            console.log(`get file blocked, fileId is folder`)
            return JSON.stringify({
                success: false,
                error: "The provided Id belongs to a folder, not a file",
                instruction: "Do not call get_file for folders. Use the folder ID as parentId"
            })
        }
        return JSON.stringify({
            success: true, file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parentId: file.parentId,
                content: file.content || "",
                language: file.language,
                extension: file.extension
            }
        })
    }, {
        name: "get_file",
        description: `
            Read an EXISTING FILE before modifying it.
            STRICT RULES:
                1. fileId must belong to a file.
                2. Never pass a folder ID.
                3. Use exact file ID from get_tree.
                4. Call this before update_file.
                5. Do not call this for newly created files unless necessary.
                6. Do not call this repeatedly for the same file.

            The response contain the complete file content.
        `,
        schema: z.object({
            fileId: z.string()
        })
    })

    // create folder tool
    const createFolderTool = tool(async ({ folderName, parentId }) => {
        console.log("ai tool-create_folder")
        if (!parentId) {
            return JSON.stringify({
                success: false,
                error: "parentId is required",
                instruction: "Call get_tree and use the exact _id of the destination folder as parentId. Do not use null."
            })
        }
        const folder = await createFolder({ folderName, parentId, projectId, userId });
        return JSON.stringify({
            success: true,
            operation: "folder_created",
            folder: {
                _id: folder._id,
                name: folder.name,
                type: folder.type,
                parentId: folder.parentId,
            }
        })
    }, {
        name: "create_folder",
        description: `
            Create a new folder.
            RULES:
                1. Create parent folders first.
                2. Use exact parentId from get_tree.
                3. Never create duplicate folders.
                4. A folder directly inside another folder must use that folder's ID as parentId.
                5. After creation continue with the remaining files.
                6. Do not call get_tree again just to verify the folder.
        `,
        schema: z.object({
            folderName: z.string(),
            parentId: z.string().min(1)
        })
    })

    // create file tool
    const createFileTool = tool(async ({ fileName, parentId, language, content }) => {
        console.log("ai tool-create_file")
        if (!parentId) {
            return JSON.stringify({
                success: false,
                error: "parentId is required",
                instruction: "Call get_tree and use the exact _id of the destination folder as parentId. Do not use null."
            })
        }
        const file = await createFile({ fileName, parentId, projectId, userId, content, language: language || "plaintext" });
        return JSON.stringify({
            success: true,
            operation: "file_created",
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parentId: file.parentId,
                language: file.language,
                extension: file.extension,
                content: file.content
            }
        })
    }, {
        name: "create_file",
        description: `
            Create a NEW FILE.
            RULES:
                1. Use get_tree first when project structure is unknown.
                2. Use exact folder ID as parentId.
                3. Never create duplicate files.
                4. Send complete file content.
                5. Crate folders before files inside them.
                6. Never use terminal commands to create files.
                7. Do not call get_file immediately after creating a file.
                8. Continue creating all required files.
                9. Do not stop after creating only one file.

            For a React/Vite project, create all required files
        `,
        schema: z.object({
            fileName: z.string(),
            parentId: z.string().min(1),
            language: z.string().optional(),
            content: z.string()
        })
    })

    // update file tool
    const updateFileTool = tool(async ({ fileName, fileId, content }) => {
        console.log("ai tool-update_file")
        const file = await updateFile({ fileName, userId, content, fileId });
        return JSON.stringify({
            success: true,
            operation: "file_updated",
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parentId: file.parentId,
                language: file.language,
                extension: file.extension,
                content: file.content
            }
        })
    }, {
        name: "update_file",
        description: `
            Update an EXISTING FILE.
            RULES: 
                1. Call get_file before updating.
                2. fileId must ne an actual file ID.
                3. Never use a folder ID.
                4. Send the complete updated file content.
                5. Do not update files that do not exist.
                6. After the sucessful update continue with remaining work.
                7. Do not call get_file again unless another modification is needed.
        `,
        schema: z.object({
            fileName: z.string(),
            content: z.string(),
            fileId: z.string()
        })
    })

    // delete file tool
    const deleteFileTool = tool(async ({ fileId }) => {
        console.log("ai tool-delete_file")
        const file = await deleteFile({ userId, fileId });
        return JSON.stringify({
            success: true,
            operation: "file_deleted",
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parentId: file.parentId
            }
        })
    }, {
        name: "delete_file",
        description: `
            Delete an EXISTING FILE from the project.
            STRICT RULES: 
                1. fileId must belong to an actual file.
                2. Never pass a folder ID.
                3. Use the exact file ID from get_tree.
                4. Before deleting, make sure that target is actually a file.
                5. Do not delete a file unless the user's request requires it.
                6. Never use terminal commands to delete files.
                7. After successful deletion, continue with the remaining work.
                8. Do not call get_file after deletion.
        `,
        schema: z.object({
            fileId: z.string()
        })
    })

    return [getFileTool, getFileTreeTool, createFileTool, createFolderTool, updateFileTool, deleteFileTool]
}