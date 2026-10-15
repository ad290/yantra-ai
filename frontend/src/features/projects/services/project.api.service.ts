import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/axios";
import type { ProjectResponseType, ProjectType } from "../types";

/**
 * @createProjectService
 * @param name 
 * @param description 
 * @returns {CreateProjectResponseType | string (error message)}
 */
export const createProjectService = async (name: string, description: string): Promise<ProjectResponseType | string> => {
    try {
        const response = await axiosInstance.post<ProjectResponseType>("/project", { name, description });
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
 * @getProjectListService
 * @returns {ProjectType[] | string (error message)}
 */
export const getProjectListService = async (): Promise<ProjectType[] | string> => {
    try {
        const response = await axiosInstance("/project/all");
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
 * @getProjectByIdService
 * @param projectId 
 * @returns {ProjectType | string (error message)}
 */
export const getProjectByIdService = async (projectId: string): Promise<ProjectType | string> => {
    try {
        const response = await axiosInstance.get<ProjectResponseType>(`/project/single/${projectId}`);
        if (response.status === 400) throw new Error(response.data.message);
        return Array.isArray(response.data.project) ? response.data.project[0] : response.data.project;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}

/**
 * @getStarredProjectListService
 * @returns {ProjectType[] | string}
 */
export const getStarredProjectListService = async (): Promise<ProjectType[] | string> => {
    try {
        const response = await axiosInstance.get("/project/starred");
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
 * @toggleProjectStar
 * @param projectId 
 * @returns {ProjectType | string (error message)}
*/
export const toggleProjectStarService = async (projectId: string): Promise<ProjectResponseType | string> => {
    try {
        const response = await axiosInstance.patch(`/project/starred/${projectId}`);
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
 * @deleteProjectService
 * @param projectId 
 * @returns {string (error message)}
 */
export const deleteProjectService = async (projectId: string): Promise<ProjectResponseType | string> => {
    try {
        const response = await axiosInstance.delete(`/project/single/${projectId}`);
        if (response.status === 400) throw new Error(response.data.message);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error?.response?.data.message;
        }
        else return error.message;
    }
}