export type ProjectType = {
    _id: string,
    name: string,
    description: string,
    starred: boolean,
    lastOpenedAt: Date,
    owner: string,
    createdAt: Date,
    updatedAt: Date
}

export type ProjectResponseType = {
    project: ProjectType,
    message: string
}

export type ProjectsResponseType = {
    projects: ProjectType[],
    message: string
}

export type ProjectState = {
    projectList: ProjectType[],
    starredProjects: ProjectType[],
    currentProject: ProjectType | null,
}

export type CreateProjectInputType = {
    name: string,
    description: string
}