import { motion } from "motion/react";
import type { FileTreeType } from "../../features/files/types";
import Preview from "./Preview";
interface FullScreenPreviewProps {
    tree: FileTreeType[]
}
const FullScreenPreview = ({ tree }: FullScreenPreviewProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-100 bg-white"
        >
            <Preview tree={tree} />
        </motion.div>
    )
}

export default FullScreenPreview