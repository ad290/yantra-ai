import { configureStore } from "@reduxjs/toolkit";
import ProjectReducer from "../features/projects/store/project.slice";
import UserReducer from "../features/auth/store/user.slice";
import FileOperationReducer from "../features/files/store/file.slice";
export const store = configureStore({
    reducer: {
        user: UserReducer,
        project: ProjectReducer,
        fileOperations: FileOperationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;