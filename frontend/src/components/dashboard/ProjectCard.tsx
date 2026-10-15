import { motion } from "motion/react"
import { useState } from 'react'
import { FiStar, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from "react-router-dom"
import { useProjectDispatch } from '../../features/projects/store/hooks'
import { deleteProject, starProject } from '../../features/projects/store/project.slice'
import { useDeleteProjectMutation, useToggleStarProjectMutation } from '../../features/projects/tanstack-query'
import type { ProjectType } from '../../features/projects/types'

interface ProjectCardProps {
    project: ProjectType
}
const ProjectCard = ({ project }: ProjectCardProps) => {
    const navigate = useNavigate();
    const toggleStarMutation = useToggleStarProjectMutation();
    const deleteProjectMutation = useDeleteProjectMutation();
    const [isconfirmDelete, setisconfirmDelete] = useState(false);
    const dispatch = useProjectDispatch();
    const isStarred = project.starred;
    // handle toggle star
    const handleToggleStar = (projectId: string) => {
        if (toggleStarMutation.isPending) return;
        dispatch(starProject(project));
        toggleStarMutation.mutate(projectId);
    }
    // handle delete
    const handleDelete = (projectId: string) => {
        if (deleteProjectMutation.isPending) return;
        dispatch(deleteProject(project));
        deleteProjectMutation.mutate(projectId, {
            onSuccess: () => {
                setisconfirmDelete(false);
            }
        });
    }

    // handle click
    const handleClickProject = (project: ProjectType) => {
        navigate(`/project/${project._id}`);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => handleClickProject(project)}
            className='group relative cursor-pointer rounded-2xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/7 dark:bg-white/3 dark:shadow-none dark:hover:border-white/14 dark:hover:bg-white/4.5'
        >
            <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={toggleStarMutation.isPending}
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStar(project._id)
                }}
                className={`absolute z-50 right-4 top-4 rounded-md p-1 transition-opacity hover:text-amber-400 ${isStarred ? "opacity-100 text-amber-400" : "opacity-0 text-zinc-300 group-hover:opacity-100 dark:text-zinc-600"} ${toggleStarMutation.isPending ? "cursor-wait opacity-60" : ""}`}
            >
                <FiStar strokeWidth={2} size={20} className={`${isStarred ? "fill-amber-400" : "text-amber-400"}`} />
            </motion.button>
            <h3 className='mb-1.5 truncate text-sm font-semibold tracking-tight text-indigo-900 dark:text-white'>{project.name}</h3>
            <p className='line-clamp-2 min-h-10 text-xs leading-snug text-zinc-500'>{project.description || "No description..."}</p>
            <div className='mt-4 pt-3 items-center flex justify-end border-t border-black/5 dark:border-white/6'>
                {deleteProjectMutation.isPending ? (
                    <div className='flex items-center gap-1 rounded-md px-1.5 text-xs text-zinc-300 dark:text-zinc-600'>
                        <FiTrash2 size={13} />
                        <span>Deleting...</span>
                    </div>
                ) : isconfirmDelete ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex items-center gap-2 z-50'
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setisconfirmDelete(false)
                            }
                            }
                            className='rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                            disabled={deleteProjectMutation.isPending}
                        >Cancel</button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project._id)
                            }}
                            className='rounded-md bg-red-500/10 py-1 px-2 text-xs font-medium text-red-500 hover:bg-red-500/20 dark:text-red-400 disabled:cursor-wait disabled:opacity-50'
                            disabled={deleteProjectMutation.isPending}
                        >Confirm</button>
                    </motion.div>
                ) : (
                    <motion.button className='flex items-center gap-1 rounded-md px-1.5 text-xs text-zinc-300 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:text-red-400'
                        onClick={(e) => {
                            e.stopPropagation();
                            setisconfirmDelete(true)
                        }
                        }
                    >
                        <FiTrash2 size={13} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}

export default ProjectCard