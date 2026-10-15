import { FolderTree, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { useGetFileTreeQuery } from "../../features/files/tanstack-query";
import Folder from "./Folder";
import type { FileTreeType } from "../../features/files/types";
interface ExplorerProps {
  projectId: string,
  fileTree: FileTreeType[]
}
const Explorer = ({ projectId, fileTree }: ExplorerProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, width: 0 }}
      animate={{ opacity: 1, x: 0, width: 288 }}
      exit={{ opacity: 0, x: -16, width: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col overflow-hidden border-r-white/6 bg-[#111113]/90 backdrop-blur-xl "
    >
      <div className="flex h-10 w-72 shrink-0 items-center justify-between border-b border-white/6 px-3 ">
        <span className="text-xs font-semibold tracking-wider text-zinc-500">EXPLORE</span>
        <motion.button
          whileHover={{ rotate: 60 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => { useGetFileTreeQuery(projectId!).refetch() }}
          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/7 hover:text-white"
          title="Refresh"
        >
          <RefreshCcw size={14} />
        </motion.button>
      </div>
      <div className="w-72 overflow-y-auto px-1 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/8 hover:[&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:transition-colors scrollbar-thin"
        style={{ scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {fileTree?.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
            <FolderTree size={22} className="text-zinc-400" />
            <span>Empty Workspace</span>
          </div>
        ) : (
          fileTree?.map((node) => (
            <Folder node={node} projectId={projectId} tree={fileTree} key={node._id} />
          ))
        )}
      </div>

    </motion.div>
  )
}

export default Explorer