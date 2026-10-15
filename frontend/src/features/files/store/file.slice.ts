import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DeleteType, FileState, FileType, isAddOpenType, RenameType } from "../types";

const initialState: FileState = {
    rename: { value: "", renamingNode: "" },
    isAddOpen: { folderId: "", type: null },
    isDeleteOpen: { file: null },
    openTabs: [],
    activeTab: null,
    isPreviewFullScreen: false,
    showPreview: false
}

const FileOperationSlice = createSlice({
    name: "files-operation",
    initialState,
    reducers: {
        setRename: (state, action: PayloadAction<RenameType>) => { state.rename = action.payload },
        setIsAddOpen: (state, action: PayloadAction<isAddOpenType>) => { state.isAddOpen = action.payload },
        setIsDeleteOpen: (state, action: PayloadAction<DeleteType>) => { state.isDeleteOpen = action.payload },
        setActiveTab: (state, action: PayloadAction<FileType>) => {
            const exist = state.openTabs.find((tab) => tab._id === action.payload?._id);
            if (!exist) state.openTabs.push(action.payload);
            state.activeTab = action.payload
        },
        setShowPreview: (state, action: PayloadAction<boolean>) => { state.showPreview = action.payload },
        setIsPreviewFullScreen: (state, action: PayloadAction<boolean>) => { state.isPreviewFullScreen = action.payload },
        removeFileFromTab: (state, action: PayloadAction<FileType>) => {
            state.openTabs = state.openTabs.filter((tab) => tab._id !== action.payload._id);
            if (state.activeTab?._id === action.payload._id) {
                state.openTabs.length === 0 ? state.activeTab = null : state.activeTab = state.openTabs[state.openTabs.length - 1];
            }
        },
        updateActiveTabContent: (state, action: PayloadAction<FileType>) => {
            state.activeTab = action.payload
            state.openTabs = state.openTabs.map((tab) => tab._id === action.payload._id ? action.payload : tab);
        },
        clearState: () => { return initialState }
    },
})

export const { setIsAddOpen, setRename, setIsDeleteOpen, setActiveTab, setIsPreviewFullScreen, setShowPreview, removeFileFromTab, updateActiveTabContent, clearState } = FileOperationSlice.actions;

export default FileOperationSlice.reducer;