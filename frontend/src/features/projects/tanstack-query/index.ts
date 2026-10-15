import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "../../../app/queryClient";
import { createProjectService, deleteProjectService, getProjectByIdService, getProjectListService, getStarredProjectListService, toggleProjectStarService } from "../services/project.api.service";
import type { CreateProjectInputType, ProjectResponseType, ProjectType } from "../types";
import { useAuthSelector } from "../../auth/store/hooks";

const ProjectSessionKeys = ["project", "session"] as const;
const StarredProjectKeys = ["project", "starred"] as const;
const signleProjectInfoKey = (projectId: string) => ["project", "info", projectId] as const;
/**
 * @useCreateProjectMutation
 * @description create project
 * @returns {UseMutationResult<ProjectResponseType, Error, CreateProjectInputType>}
 */
export const useCreateProjectMutation = (): UseMutationResult<ProjectResponseType, Error, CreateProjectInputType> => {
    return useMutation<ProjectResponseType, Error, CreateProjectInputType>({
        mutationFn: async ({ name, description }: CreateProjectInputType) => {
            const response = await createProjectService(name, description);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: ProjectResponseType) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ProjectSessionKeys })
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useGetProjectListQuery
 * @description get project list
 * @returns 
 */
export const useGetProjectListQuery = (): UseQueryResult<ProjectType[], Error> => {
    const { userData } = useAuthSelector(state => state.user);
    const cacheData = queryClient.getQueryData<ProjectType[]>(ProjectSessionKeys);
    return useQuery<ProjectType[], Error>({
        queryKey: ProjectSessionKeys,
        queryFn: async () => {
            const response = await getProjectListService();
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        initialData: cacheData,
        enabled: !!userData,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}

/**
 * @useGetStarredProjectListQuery
 * @description get starred project list
 * @returns 
 */
export const useGetStarredProjectListQuery = (): UseQueryResult<ProjectType[], Error> => {
    const { userData } = useAuthSelector(state => state.user);
    const cacheData = queryClient.getQueryData<ProjectType[]>(StarredProjectKeys);
    return useQuery({
        queryKey: StarredProjectKeys,
        queryFn: async () => {
            const response = await getStarredProjectListService();
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        enabled: !!userData,
        initialData: cacheData,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}

/**
 * @useGetSingleProjectInformationQuery
 * @description get single project information
 * @param projectId 
 * @returns 
 */
export const useGetSingleProjectInformationQuery = (projectId: string): UseQueryResult<ProjectType, Error> => {
    const cacheData = queryClient.getQueryData<ProjectType>(signleProjectInfoKey(projectId));
    return useQuery<ProjectType, Error>({
        queryKey: signleProjectInfoKey(projectId),
        queryFn: async () => {
            const response = await getProjectByIdService(projectId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        initialData: cacheData,
        enabled: !!projectId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}

/**
 * @useToggleStarProjectMutation
 * @description toggle star project
 * @returns 
 */
export const useToggleStarProjectMutation = (): UseMutationResult<ProjectResponseType, Error, string> => {
    return useMutation<ProjectResponseType, Error, string>({
        mutationFn: async (projectId) => {
            const response = await toggleProjectStarService(projectId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: ProjectResponseType) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ProjectSessionKeys });
            queryClient.invalidateQueries({
                queryKey: signleProjectInfoKey(data.project._id),
            });
            queryClient.invalidateQueries({ queryKey: StarredProjectKeys });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useDeleteProjectMutation
 * @description delete project
 * @returns 
 */
export const useDeleteProjectMutation = (): UseMutationResult<ProjectResponseType, Error, string> => {
    return useMutation<ProjectResponseType, Error, string>({
        mutationFn: async (projectId: string) => {
            const response = await deleteProjectService(projectId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: ProjectResponseType) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ProjectSessionKeys });
            queryClient.invalidateQueries({ queryKey: StarredProjectKeys });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}