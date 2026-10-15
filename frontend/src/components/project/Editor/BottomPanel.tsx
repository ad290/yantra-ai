import { TerminalIcon, X } from "lucide-react"
import { motion } from "motion/react"
import Terminal from "./Terminal"
import { useProjectSelector } from "../../../features/projects/store/hooks"
interface BottomPanelProps {
    projectId: string
    setShowTerminal: React.Dispatch<React.SetStateAction<boolean>>
}
const BottomPanel = ({ setShowTerminal, projectId }: BottomPanelProps) => {
    const { currentProject } = useProjectSelector(state => state.project);
    const userId = currentProject?.owner || "";
    return (
        <div className="max-h-[45vh] md:max-h-none">
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 256, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex shrink-0 flex-col overflow-hidden border-t border-white/6 bg-[#111113]"
            >
                <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/6 px-3">
                    <div className="flex items-center gap-2">
                        <button className="relativ flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-colors text-white">
                            <TerminalIcon size={13} className="relative" />
                            <span className="relative uppercase">Terminal</span>
                        </button>
                    </div>
                    <button
                        title="Close Terminal"
                        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/7 hover:text-white"
                        onClick={() => setShowTerminal(false)}><X size={14} /></button>
                </div>

                <div className="min-h-0 flex-1">
                    <Terminal projectId={projectId} userId={userId} />
                </div>
            </motion.div>
        </div>
    )
}

export default BottomPanel