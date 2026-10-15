import { motion } from "motion/react";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCreateRootFolderMutation } from "../../features/files/tanstack-query";
import { useCreateProjectMutation } from "../../features/projects/tanstack-query";
import type { CreateProjectInputType } from "../../features/projects/types";

interface CreateProjectModalProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const CreateProjectModal = ({ setIsModalOpen }: CreateProjectModalProps) => {
    const [input, setinput] = useState<CreateProjectInputType>({
        name: "",
        description: ""
    })
    const createProjectMutation = useCreateProjectMutation();
    const createRootFolderMutation = useCreateRootFolderMutation();
    const handleSubmit = () => {
        if (!input.name) {
            toast.error("Project name is required");
            return
        }
        createProjectMutation.mutate(input, {
            onSuccess: (data) => {
                createRootFolderMutation.mutate({ folderName: data.project.name.toLowerCase().replaceAll(" ", "-"), projectId: data.project._id }, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setinput({ name: "", description: "" });
                    }
                });
            }
        })
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                onClick={() => setIsModalOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
            />
            <div className="pointer-events-none absolute -z-10 size-115 rounded-full bg-sky-300/20 blur-[130px] dark:bg-sky-500/10" />
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.97,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.97,
                    y: 10,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-black/8 bg-white/70 shadow-[0_20px_60px_-15px_rgba(0.0.0.0.25)] backdrop-blur-2xl dark:border-white/1 dark:bg-white/5 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.7)]"
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent dark:via-white/30" />
                <div className="flex items-center justify-between border-b border-black/6 px-7 py-6 dark:border-white/8">
                    <div className="">
                        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">Create Project</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Set up a new workspace in seconds</p>
                    </div>
                    <button className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/7 dark:hover:text-white" onClick={() => setIsModalOpen(false)}>
                        <FiX size={18} />
                    </button>
                </div>
                <div className="space-y-6 px-7 py-6">
                    <div>
                        <div className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Project Name</div>
                        <input
                            placeholder="My Awesome Project"
                            autoFocus
                            className="w-full rounded-xl border-black/8 bg-black/2 px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-sky-400/50 focus:bg-white focus:ring-4 focus:ring-sky-400/15 dark:border-white/9 dark:bg-white/4 dark:text-white dark:placeholderbg-zinc-500 dark:focus:bg-white/6 dark:focus:ring-sky-400/20"
                            onChange={(e) => setinput({ ...input, name: e.target.value })}
                            type="text" value={input.name} />
                    </div>
                    <div>
                        <div className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</div>
                        <textarea
                            onChange={(e) => setinput({ ...input, description: e.target.value })}
                            autoFocus
                            placeholder="What is this project about?"
                            className="w-full rounded-xl border-black/8 bg-black/2 px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-sky-400/50 focus:bg-white focus:ring-4 focus:ring-sky-400/15 dark:border-white/9 dark:bg-white/4 dark:text-white dark:placeholderbg-zinc-500 dark:focus:bg-white/6 dark:focus:ring-sky-400/20"
                            value={input.description} />
                    </div>
                </div>
                <div
                    className="flex justify-end gap-3 border-t border-black/6 px-7 py-5 dark:border-white/8">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-xl border border-black/8 bg-black/2 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:border-white/1 dark:bg-white/3 dark:text-zinc-300 dark:hover:bg-white/7 dark:hover:text-white">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!input.name || createProjectMutation.isPending}
                        className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_o_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default CreateProjectModal