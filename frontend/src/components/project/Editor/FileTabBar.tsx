import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { removeFileFromTab, setActiveTab } from '../../../features/files/store/file.slice';
import { useFileDispatch, useFileSelector } from '../../../features/files/store/hooks';
import type { FileType } from '../../../features/files/types';
import { getFileIcon } from '../../../utils/customization';

interface FileTabBarProps {
}

const FileTabBar = ({ }: FileTabBarProps) => {
    const dispatch = useFileDispatch();
    const handleSelectTab = (node: FileType) => {
        dispatch(setActiveTab(node));
    }

    const handleRemoveTab = (node: FileType) => {
        dispatch(removeFileFromTab(node));
    }
    const { openTabs, activeTab } = useFileSelector(state => state.fileOperations);
    return (
        <div className="flex h-10 shrink-0 items-center overflow-x-auto border-b border-white/6 bg-[#111113]/90">
            <AnimatePresence>
                {openTabs.map((tab) => {
                    const active = activeTab?._id === tab._id;
                    const { color, icon: Icon } = getFileIcon(tab.extension!);
                    return (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleSelectTab(tab)}
                            key={tab._id} className={`group relative flex h-full cursor-pointer items-center gap-2 whitespace-nowrap border-r border-white/5 px-3.5 transition-colors ${active ? "bg-[#0a0a0c] text-white" : "text-zinc-500 hover:bg-white/2 hover:text-zinc-300"}`}>
                            <Icon className={`${color}`} size={14} />
                            <span className='text-xs font-medium '>{tab.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTab(tab)
                                }} className='rounded p-0.5 text-zinc-500 opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100'><X size={13} />
                            </button>
                            {active && (
                                <motion.div
                                    className='absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-sky-400 to-violet-400'
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                />
                            )}
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

export default FileTabBar