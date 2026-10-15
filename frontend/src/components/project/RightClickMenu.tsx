import { FilePlus2, FolderPlus, Pen, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import type { FileTreeType, RightClickMenuType } from "../../features/files/types";
interface RightClickMenuProps {
    menu: RightClickMenuType
    setMenu: React.Dispatch<React.SetStateAction<RightClickMenuType | null>>
    handleOpenRenameInput: () => void
    handleOpenDeleteDialog: () => void
    handleOpenAdd: (type: "file" | "folder", folderId: string) => void
    type: "file" | "folder"
    node: FileTreeType
}
const RightClickMenu = ({ type, menu, setMenu, handleOpenRenameInput, handleOpenAdd, node, handleOpenDeleteDialog }: RightClickMenuProps) => {
    return (
        createPortal(
            <>
                <motion.div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenu(null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="fixed z-50 w-52 rounded-xl border border-white/8 bg=[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
                    style={{ left: menu.x, top: menu.y }}
                >
                    {
                        type === "folder" && (
                            <>
                                <button
                                    className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md py-2 px-3 text-sm text-left font-medium leading-6 text-zinc-300 transition-colors hover:bg-white/6 hover:text-white"
                                    onClick={() => {
                                        setMenu(null);
                                        handleOpenAdd("file", node._id);
                                    }}
                                >
                                    <FilePlus2 size={13} /> New File
                                </button>
                                <button
                                    className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md py-2 px-3 text-sm text-left font-medium leading-6 text-zinc-300 transition-colors hover:bg-white/6 hover:text-white"
                                    onClick={() => {
                                        setMenu(null);
                                        handleOpenAdd("folder", node._id);
                                    }}
                                >
                                    <FolderPlus size={13} /> New Folder
                                </button>

                                {/* seperator */}
                                <div className="my-1 h-px bg-white/8 " />
                            </>
                        )
                    }
                    <button
                        className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md py-2 px-3 text-sm text-left font-medium leading-6 text-zinc-300 transition-colors hover:bg-white/6 hover:text-white"
                        onClick={() => {
                            handleOpenRenameInput();
                            setMenu(null);
                        }}
                    >
                        <Pen size={13} /> Rename
                    </button>
                    {
                        node.parentId !== null && (
                            <button
                                className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md py-2 px-3 text-sm text-left font-medium leading-6 text-zinc-300 transition-colors hover:bg-white/6 hover:text-white"
                                onClick={() => {
                                    handleOpenDeleteDialog();
                                    setMenu(null);
                                }}
                            >
                                <Trash2 size={13} /> Delete
                            </button>
                        )
                    }
                </motion.div>
            </>, document.body
        )
    )
}

export default RightClickMenu