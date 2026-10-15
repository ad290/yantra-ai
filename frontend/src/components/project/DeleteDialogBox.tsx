import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useFileDispatch, useFileSelector } from "../../features/files/store/hooks";
import { setIsDeleteOpen } from "../../features/files/store/file.slice";
import { createPortal } from "react-dom";

interface DeleteDialogBoxProps {
    handleDelete: () => void
}
const DeleteDialogBox = ({ handleDelete }: DeleteDialogBoxProps) => {
    const dispatch = useFileDispatch();
    const { isDeleteOpen } = useFileSelector(state => state.fileOperations);

    if (!isDeleteOpen.file) return null;

    const handleCancel = () => {
        dispatch(setIsDeleteOpen({ file: null }));
    };

    return (createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button
                type="button"
                aria-label="Close delete dialog"
                onClick={handleCancel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 cursor-default bg-black/45 backdrop-blur-sm"
            />
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#17171a]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
                <div className="flex items-start gap-3 px-6 pb-5 pt-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/12 text-red-400">
                        <AlertTriangle size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 id="delete-dialog-title" className="text-base font-semibold text-white">
                            Delete {isDeleteOpen.file.type}
                        </h2>
                        <p id="delete-dialog-description" className="mt-1 text-sm leading-5 text-zinc-400">
                            Are you sure you want to delete <span className="font-medium text-zinc-200">{isDeleteOpen.file.name}</span>? This action cannot be undone.
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close delete dialog"
                        onClick={handleCancel}
                        className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/7 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="flex justify-end gap-2 border-t border-white/8 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-lg border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/8 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-950/30 transition-colors hover:bg-red-400"
                    >
                        <Trash2 size={15} />
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>, document.body
    ))
}

export default DeleteDialogBox