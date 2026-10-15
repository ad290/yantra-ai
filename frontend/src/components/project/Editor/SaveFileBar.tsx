import { AnimatePresence, motion } from 'motion/react';
import { useFileSelector } from '../../../features/files/store/hooks';
import { getFileIcon } from '../../../utils/customization';
import { Check, Loader2, Save } from 'lucide-react';

interface SaveFileBarProps {
    justSaved: boolean;
    handleSaveFile: () => void;
    isSaving: boolean;
}
const SaveFileBar = ({ handleSaveFile, justSaved, isSaving }: SaveFileBarProps) => {
    const { activeTab } = useFileSelector(state => state.fileOperations);
    const { icon: ActiveFileIcon, color: ActiveFileIconColor } = getFileIcon(activeTab?.extension ?? "");

    return (
        <div className="flex h-10 shrink-0 items-center gap-5 border-b border-white/6 px-4">

            <div className="flex items-center gap-2 text-zinc-400">
                <ActiveFileIcon className={`${ActiveFileIconColor}`} size={14} />
                <span className="text-xs font-medium">{activeTab?.name}</span>
            </div>
            <motion.button
                disabled={justSaved}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSaveFile();
                }}
                className="flex items-center gap-2 rounded-lg bg-linear-to-b from-sky-500 to-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-[0_1px_o_rgba(255,255,255,0.2)] transition-colors hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <AnimatePresence initial={false} mode="wait">
                    {
                        isSaving ? (
                            <motion.span
                                key={"saving"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm"
                            >
                                <Loader2 className="animate-spin" size={14} /> Saving
                            </motion.span>
                        ) : justSaved ? (
                            <motion.span
                                key={"saved"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm"
                            >
                                <Check className="animate-ping" size={14} /> Saved
                            </motion.span>
                        ) : (
                            <motion.span
                                key={"save"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm">
                                <Save className="" strokeWidth={2} size={14} /> Save
                            </motion.span>
                        )
                    }

                </AnimatePresence>

            </motion.button>
        </div>
    )
}

export default SaveFileBar