import { FileCode2 } from "lucide-react";
import { motion } from "motion/react";

const EmptyEditorState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center gap-4 bg-[#0a0a0c] text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <FileCode2 size={28} className="text-sky-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-200">
          No file selected
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Select a file from the explorer to start editing.
        </p>
      </div>

      <motion.div
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs text-zinc-600"
      >
        Choose a file to continue
      </motion.div>
    </motion.div>
  );
};

export default EmptyEditorState;