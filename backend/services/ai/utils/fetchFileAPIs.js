import dotenv from "dotenv"
dotenv.config()
import axios from "axios"
const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL

/**
 * @createFolder
 * @description create folder
 * @param {projectId, parentId, folderName, userId} param0 
 * @returns 
 */
export const createFolder = async ({ projectId, parentId, folderName, userId }) => {
    try {
        const { data } = await axios.post(`${FILE_SERVICE_URL}/create-folder`,
            { projectId, parentId, folderName },
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data.file;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * @createFile
 * @description create file
 * @param {projectId, parentId, fileName, userId, content, language} param0 
 * @returns 
 */
export const createFile = async ({ projectId, parentId, fileName, userId, content = "", language = "plainText" }) => {
    try {
        const { data } = await axios.post(`${FILE_SERVICE_URL}/create-file`,
            { projectId, parentId, fileName, content, language },
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data.file;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * @updateFile
 * @description update file
 * @param {fileName, fileId, content} param0 
 * @param {userId} param1   
 * @returns 
 */
export const updateFile = async ({ fileName, fileId, content, userId }) => {
    try {
        const { data } = await axios.patch(`${FILE_SERVICE_URL}/update-file/${fileId}`,
            { fileName, content },
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data.file;
    } catch (error) {
        throw new Error(error);
    }

}

/**
 * @deleteFile
 * @description delete file
 * @param {fileId, userId} param0 
 * @returns 
 */
export const deleteFile = async ({ fileId, userId }) => {
    try {
        const { data } = await axios.delete(`${FILE_SERVICE_URL}/delete-file/${fileId}`,
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data.file;
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * @getFileTree
 * @description get file tree
 * @param {projectId, userId} param0 
 * @returns 
 */
export const getFileTree = async ({ projectId, userId }) => {
    try {
        const { data } = await axios.get(`${FILE_SERVICE_URL}/tree/${projectId}`,
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * @getFile
 * @description get file
 * @param {fileId, userId} param0 
 * @returns 
 */
export const getFile = async ({ fileId, userId }) => {
    try {
        const { data } = await axios.get(`${FILE_SERVICE_URL}/file/${fileId}`,
            {
                headers: {
                    "x-user_id": String(userId)
                }
            });
        return data;
    } catch (error) {
        throw new Error(error);
    }
}