import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectState, ProjectType } from "../types";

const initialState: ProjectState = {
    projectList: [],
    starredProjects: [],
    currentProject: null
}

const ProjectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjectList: (state, action: PayloadAction<ProjectType[]>) => {
            state.projectList = action.payload
        },
        setCurrentProject: (state, action: PayloadAction<ProjectType>) => {
            state.currentProject = action.payload
        },
        setStarredProjects: (state, action: PayloadAction<ProjectType[]>) => {
            state.starredProjects = action.payload
        },
        starProject: (state, payload: PayloadAction<ProjectType>) => {
            const project = state.projectList.find((project) => project._id === payload.payload._id);
            if (project) {
                project.starred = !project.starred
            }
        },
        deleteProject: (state, payload: PayloadAction<ProjectType>) => {
            state.projectList = state.projectList.filter((project) => project._id !== payload.payload._id);
            state.starredProjects = state.starredProjects.filter((project) => project._id !== payload.payload._id);
        }
    }
})

export const { setProjectList, setCurrentProject, setStarredProjects, starProject, deleteProject } = ProjectSlice.actions;

export default ProjectSlice.reducer;