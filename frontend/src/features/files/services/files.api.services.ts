import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/axios";
import type { CreateFileInputType, CreateFolderInputType, CreateRootFolderInputType, FileResponseType, FileTreeType, FileType, UpdateFileInputType } from "../types";

/**
 * @createRootFolderService
 * @param input
 * @description create root folder
 * @returns {FileResponseType | string (error message)}
 */
export const createRootFolderService = async (input: CreateRootFolderInputType): Promise<FileResponseType | string> => {
    try {
        const response = await axiosInstance.post<FileResponseType>("/file/root-folder", input);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @createFolderService
 * @description create folder
 * @param input 
 * @returns {FileResponseType | string (error message)}
 */
export const createFolderService = async (input: CreateFolderInputType): Promise<FileResponseType | string> => {
    try {
        const response = await axiosInstance.post<FileResponseType>("/file/create-folder", input);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @createFileService
 * @description create file
 * @param input 
 * @returns {FileResponseType | string (error message)}
 */
export const createFileService = async (input: CreateFileInputType): Promise<FileResponseType | string> => {
    try {
        const response = await axiosInstance.post<FileResponseType>("/file/create-file", input);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @updateFileService
 * @description update file by id
 * @param input 
 * @returns {FileResponseType | string (error message)}
 */
export const updateFileService = async (input: UpdateFileInputType): Promise<FileResponseType | string> => {
    try {
        const response = await axiosInstance.patch<FileResponseType>(`/file/update-file/${input.fileId}`, input);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @deleteFileService
 *  @description delete file by id
 * @param fileId 
 * @returns {FileResponseType | string (error message)}
 */
export const deleteFileService = async (fileId: string): Promise<FileResponseType | string> => {
    try {
        const response = await axiosInstance.delete<FileResponseType>(`/file/delete-file/${fileId}`);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @getFileService
 * @description get file by id
 * @param fileId 
 * @returns 
 */
export const getFileService = async (fileId: string): Promise<FileType | string> => {
    try {
        const response = await axiosInstance.get<FileResponseType>(`/file/${fileId}`);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data.file
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @getFileTreeService
 * @description get file tree by project id
 * @param projectId 
 * @returns {FileTreeType | string (error message)}
 */
export const getFileTreeService = async (projectId: string): Promise<FileTreeType[] | string> => {
    try {
        const response = await axiosInstance.get(`/file/tree/${projectId}`);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}