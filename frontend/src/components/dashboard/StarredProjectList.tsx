import { useEffect } from "react";
import { useProjectDispatch, useProjectSelector } from "../../features/projects/store/hooks";
import { setStarredProjects } from "../../features/projects/store/project.slice";
import { useGetStarredProjectListQuery } from "../../features/projects/tanstack-query";
import { FiFolder } from "react-icons/fi";
import ProjectCard from "./ProjectCard";

interface RecentProjectListProps {

}

const StarredProjectList = ({ }: RecentProjectListProps) => {
    const dispatch = useProjectDispatch();
    const { data: projectData, isLoading, isError, error } = useGetStarredProjectListQuery();
    const projects = useProjectSelector(state => state.project.starredProjects);
    useEffect(() => {
        projectData && dispatch(setStarredProjects(projectData));
    }, [projectData, dispatch]);
    return (
        <div>
            {isLoading && (
                <p className="mt-4 text-sm text-slate-500">Loading projects...</p>
            )}

            {isError && (
                <p className="mt-4 text-sm text-red-500">{error.message}</p>
            )}

            {projects.length === 0 && (
                <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 py-16 text-center dark:border-white/1 dark:bg-white/1">
                    <div
                        className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-900/5 dark:bg-white/10"
                    >
                        <FiFolder size={24} className="text-slate-500 dark:text-white" />
                    </div>
                    <h2 className="mb-1.5 text-lg font-semibold text-slate-900 dark:text-white">No starred projects</h2>
                    <p className="mb-5 max-w-xs text-sm text-slate-500 dark:text-slate-500">Star a project to see it here!</p>
                </div>
            )}

            {projects.length > 0 && (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {projects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default StarredProjectList