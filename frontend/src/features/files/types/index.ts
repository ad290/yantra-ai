export type FileType = {
    _id: string;
    name: string;
    type: "file" | "folder";
    projectId: string;
    parentId: string | null;
    extension?: string;
    owner: string;
    language?: string;
    content?: string;
    size?: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
export type CreateRootFolderInputType = {
    folderName: string;
    projectId: string;
}

export type FileResponseType = {
    message: string;
    file: FileType
}

export type CreateFolderInputType = {
    folderName: string;
    parentId: string;
    projectId: string;
}

export type CreateFileInputType = {
    fileName: string;
    content: string;
    parentId: string;
    projectId: string;
    language: string;
}

export type UpdateFileInputType = {
    fileName: string;
    content: string;
    fileId: string;
}

export type GetFileTreeResponseType = {
    message: string;
    fileTree: FileTreeType
}

export type FileTreeType = {
    _id: string;
    name: string;
    type: "file" | "folder";
    projectId: string;
    parentId: string | null;
    extension?: string;
    owner: string;
    language?: string;
    content?: string;
    size?: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    children: FileTreeType[];
}


export type isAddOpenType = {
    folderId: string;
    type: "file" | "folder" | null;
}

export type RightClickMenuType = {
    x: number,
    y: number
}

export type RenameType = {
    value: string;
    renamingNode: string;
}

export type DeleteType = {
    file: FileType | null
}
export type FileState = {
    rename: RenameType,
    isAddOpen: isAddOpenType,
    isDeleteOpen: DeleteType,
    openTabs: FileType[],
    activeTab: FileType | null,
    showPreview: boolean,
    isPreviewFullScreen: boolean
}