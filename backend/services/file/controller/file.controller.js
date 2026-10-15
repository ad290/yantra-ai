import expressAsyncHandler from "express-async-handler"
import FileModel from "../models/file.model.js"
import { buildTree } from "../utils/buildTree.js";
import { extensionToLanguage } from "../utils/extensionToLanguage.js";
/**
 * @createRootFoldercontroller
 * @description create root folder
 * @header {x-user_id}
 * @body {projectId, folderName}
 */
export const createRootFolderController = expressAsyncHandler(async (req, res, next) => {
    try {
        const { projectId, folderName } = req.body;
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        // if body is empty
        if (!projectId || !folderName) {
            return res.status(400).json({
                message: "Please provide projectId and folderName."
            });
        }

        const existingRootFolder = await FileModel.findOne({ projectId: projectId, parentId: null, isDeleted: false });
        if (existingRootFolder) {
            return res.status(400).json({
                message: "Root folder already exists."
            });
        }
        const rootFolder = await FileModel.create({
            owner: userId,
            name: folderName,
            projectId: projectId,
            type: "folder",
            parentId: null
        })

        res.status(201).json({
            message: "Root folder created successfully.", file: rootFolder
        });
    } catch (error) {
        console.log(`Error in createRootFolder controller: ${error}`);
        next(error);
    }
})

/**
 * @createFolderController
 * @description create folder
 * @header {x-user_id}
 * @body {projectId, parentId, folderName}
 */
export const createFolderController = expressAsyncHandler(async (req, res, next) => {
    try {
        const { projectId, folderName, parentId } = req.body;
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        // if body is empty
        if (!projectId || !folderName || !parentId) {
            return res.status(400).json({
                message: "Please provide projectId and folderName and parentId."
            });
        }

        const existingFolder = await FileModel.findOne({ projectId, name: folderName, parentId, isDeleted: false });
        if (existingFolder) {
            return res.status(400).json({
                message: "Folder already exists."
            });
        }
        const folder = await FileModel.create({
            owner: userId,
            name: folderName,
            projectId: projectId,
            type: "folder",
            parentId: parentId
        })

        res.status(201).json({
            message: "Folder created successfully.", file: folder
        });
    } catch (error) {
        console.log(`Error in createFolder controller: ${error}`);
        next(error);
    }
})

/**
 * @createFileController
 * @description create file
 * @header {x-user_id}
 * @body {projectId, parentId, folderName}
 */
export const createFileController = expressAsyncHandler(async (req, res, next) => {
    try {
        const { projectId, fileName, parentId, content = "", language = "plaintext" } = req.body;
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        // if body is empty
        if (!projectId || !fileName || !parentId) {
            return res.status(400).json({
                message: "Please provide projectId and fileName and parentId."
            });
        }

        const existingFile = await FileModel.findOne({ projectId, name: fileName, parentId, isDeleted: false });
        if (existingFile) {
            return res.status(400).json({
                message: "File already exists."
            });
        }
        const extension = fileName.includes(".") ? fileName.split(".").pop() : "";
        const lang = extensionToLanguage[extension];
        const file = await FileModel.create({
            owner: userId,
            name: fileName,
            projectId: projectId,
            type: "file",
            parentId: parentId || null,
            extension,
            size: content.length,
            content,
            language: lang
        })

        res.status(201).json({
            message: "File created successfully.", file
        });
    } catch (error) {
        console.log(`Error in createFile controller: ${error}`);
        next(error);
    }
})

/**
 * @updateFileController
 * @description update file
 * @header {x-user_id}
 * @body {fileName, content}
 * @params {fileId}
 */
export const updateFileController = expressAsyncHandler(async (req, res, next) => {
    try {
        const { fileName, content } = req.body;
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        const fileId = req.params.fileId;
        const existingFile = await FileModel.findOne({ _id: fileId, owner: userId, isDeleted: false });
        if (!existingFile) {
            return res.status(400).json({
                message: "File not found."
            });
        }
        if (fileName) {
            let extension = fileName.includes(".") ? fileName.split(".").pop() : "";
            existingFile.name = fileName;
            existingFile.extension = extension;
            existingFile.language = extensionToLanguage[extension];
        }
        if (content !== undefined) {
            existingFile.content = content;
            existingFile.size = content.length
        }
        await existingFile.save();
        res.status(200).json({
            message: "File updated successfully.", file: existingFile
        });

    } catch (error) {
        console.log(`Error in updateFileController: ${error}`);
        next(error);
    }
})

/**
 * @deleteFileController
 * @description delete file
 * @header {x-user_id}
 * @params {fileId}
 */
export const deleteFileController = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        const fileId = req.params.fileId;
        const existingFile = await FileModel.findOne({ _id: fileId, owner: userId, isDeleted: false });
        if (!existingFile) {
            return res.status(400).json({
                message: "File not found."
            });
        }
        existingFile.isDeleted = true;
        await existingFile.save();
        res.status(200).json({
            message: "File deleted successfully.", file: existingFile
        });
    } catch (error) {
        console.log(`Error in deleteFileController: ${error}`);
        next(error);
    }
})

/**
 * @getFileController
 * @description get file
 * @header {x-user_id}
 * @params {fileId}
 */
export const getFileController = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        const fileId = req.params.fileId;
        const existingFile = await FileModel.findOne({ _id: fileId, owner: userId, isDeleted: false });
        if (!existingFile) {
            return res.status(400).json({
                message: "File not found."
            });
        }
        res.status(200).json(existingFile);
    } catch (error) {
        console.log(`Error in getFileController: ${error}`);
        next(error);
    }
})

/**
 * @getFileTreeController
 * @description get file
 * @header {x-user_id}
 * @params {fileId}
 */
export const getFileTreeController = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const projectId = req.params.projectId;
        const files = await FileModel.find({
            projectId,
            owner: userId,
            isDeleted: false
        }).sort({
            type: -1,
            name: 1
        });
        const tree = buildTree(files);

        res.status(200).json(tree);
    } catch (error) {
        console.log(`Error in getFileTreeController: ${error}`);
        next(error);
    }
})

