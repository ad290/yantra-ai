import express from "express";
import { createFileController, createFolderController, createRootFolderController, deleteFileController, getFileController, getFileTreeController, updateFileController } from "../controller/file.controller.js";

const FileRouter = express.Router();

/**
 * @createRootFolder
 * @description create root folder
 * @method POST
 * @route /root-folder
 * @body {projectId, folderName}
 */
FileRouter.post('/root-folder', createRootFolderController);

/**
 * @createFolder
 * @description create folder
 * @method POST
 * @route /folder
 * @body {projectId, folderName, parentId}
 */
FileRouter.post("/create-folder", createFolderController);

/**
 * @createFile
 * @description create file
 * @method POST
 * @route /file
 * @body {projectId, fileName, parentId, content = "", language = "plaintext"}
 */
FileRouter.post("/create-file", createFileController);

/**
 * @updateFile
 * @description update file
 * @method PATCH
 * @route /update/:fileId
 * @params {fileId}
 * @body {fileName, content}
 */
FileRouter.patch("/update-file/:fileId", updateFileController);

/**
 * @deleteFile
 * @description delete file
 * @method DELETE
 * @route /delete/:fileId
 * @params {fileId}
 */
FileRouter.delete("/delete-file/:fileId", deleteFileController);

/**
 * @getFile
 * @description get file
 * @method GET
 * @route /:fileId
 * @params {fileId}
 */
FileRouter.get('/:fileId', getFileController);

/**
 * @getFileTree
 * @description get file tree
 * @method GET
 * @route /get-tree/:projectId
 * @params {projectId}
*/
FileRouter.get('/tree/:projectId', getFileTreeController);

export default FileRouter;