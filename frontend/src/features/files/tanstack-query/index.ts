import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { CreateFileInputType, CreateFolderInputType, CreateRootFolderInputType, FileResponseType, FileTreeType, FileType, UpdateFileInputType } from "../types";
import { createFileService, createFolderService, createRootFolderService, deleteFileService, getFileService, getFileTreeService, updateFileService } from "../services/files.api.services";
import { toast } from "react-toastify";
import { queryClient } from "../../../app/queryClient";

const singleFileKey = (fileId: string) => ["file", "info", fileId] as const;
const fileTreeKeys = (projectId: string) => ["file", "tree", projectId] as const;
/**
 * @useCreateRootFolderMutation
 * @description create root folder mutation
 * @returns 
 */
export const useCreateRootFolderMutation = (): UseMutationResult<FileResponseType, Error, CreateRootFolderInputType> => {
    return useMutation<FileResponseType, Error, CreateRootFolderInputType>({
        mutationFn: async (input: CreateRootFolderInputType) => {
            const response = await createRootFolderService(input);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: FileResponseType) => {
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(data?.file.projectId!) });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useCreateFolderMutation
 * @description create folder mutation
 * @returns 
 */
export const useCreateFolderMutation = (): UseMutationResult<FileResponseType, Error, CreateFolderInputType> => {
    return useMutation<FileResponseType, Error, CreateFolderInputType>({
        mutationFn: async (input: CreateFolderInputType) => {
            const response = await createFolderService(input);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: FileResponseType) => {
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(data?.file.projectId!) });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useCreateFileMutation
 * @description create file mutation
 * @returns 
 */
export const useCreateFileMutation = (): UseMutationResult<FileResponseType, Error, CreateFileInputType> => {
    return useMutation<FileResponseType, Error, CreateFileInputType>({
        mutationFn: async (input: CreateFileInputType) => {
            const response = await createFileService(input);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: FileResponseType) => {
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(data?.file.projectId!) });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}

/**
 * @useUpdateFileMutation
 * @description update file mutation
 * @returns 
 */
export const useUpdateFileMutation = (): UseMutationResult<FileResponseType, Error, UpdateFileInputType> => {
    return useMutation<FileResponseType, Error, UpdateFileInputType>({
        mutationFn: async (input: UpdateFileInputType) => {
            const response = await updateFileService(input);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: FileResponseType) => {
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(data?.file.projectId!) });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

}

/**
 * @useDeleteFileMutation
 * @description delete file mutation
 * @returns 
 */
export const useDeleteFileMutation = (): UseMutationResult<FileResponseType, Error, string> => {
    return useMutation<FileResponseType, Error, string>({
        mutationFn: async (fileId: string) => {
            const response = await deleteFileService(fileId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        onSuccess: (data: FileResponseType) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: fileTreeKeys(data?.file.projectId!) });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })
}


// queries

/**
 * @useGetFileQuery
 * @description get file query
 */
export const useGetFileQuery = (fileId: string): UseQueryResult<FileType, Error> => {
    const cachedData = queryClient.getQueryData<FileType>(singleFileKey(fileId));
    return useQuery<FileType, Error>({
        queryKey: singleFileKey(fileId),
        queryFn: async () => {
            if (cachedData) return cachedData;
            const response = await getFileService(fileId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        initialData: cachedData,
        enabled: !!fileId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}

/**
 * @useGetFileTreeQuery
 * @description get file tree
 * @param projectId 
 * @returns 
 */
export const useGetFileTreeQuery = (projectId: string): UseQueryResult<FileTreeType[], Error> => {
    const cachedData = queryClient.getQueryData<FileTreeType[]>(fileTreeKeys(projectId));
    return useQuery<FileTreeType[], Error>({
        queryKey: fileTreeKeys(projectId),
        queryFn: async () => {
            const response = await getFileTreeService(projectId);
            if (typeof response === "string") throw new Error(response);
            return response;
        },
        initialData: cachedData,
        enabled: !!projectId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}