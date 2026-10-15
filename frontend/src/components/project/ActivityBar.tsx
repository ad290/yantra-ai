import { Bot, Files, SquareTerminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from 'react';
import type { IconType } from 'react-icons/lib';
interface ActivityIconProps {
    icon: IconType;
    active: boolean;
    onClick: () => void;
    label: string
}
function ActivityIcon({ icon: Icon, active, label, onClick }: ActivityIconProps) {
    const [hovered, setHovered] = useState(false);
    return (
        <div onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className=''
        >
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClick}
                className='relative flex size-9 items-center justify-center rounded-lg'
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className='absolute inset-0 rounded-lg bg-white/7 ring-1 ring-white/10' />
                    )}
                </AnimatePresence>
                <Icon className={`relative z-10 transition-colors ${active ? "text-sky-400" : "text-zinc-400 hover:text-zinc-300"} `} size={20} />
                <AnimatePresence>
                    {active && (
                        <motion.div
                            transition={{ duration: 0.35, type: "spring", bounce: 0.15 }}
                            className='absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-linear-to-b from-sky-400 to-violet-400' />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.12 }}
                            className='pointer-events-none absolute left-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border-white/8 bg-[#17171a] px-2 py-1 text-xs font-medium text-zinc-300 shadow-lg shadow-black/40'
                        >
                            {label}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

interface ActivityBarProps {
    showExplorer: boolean;
    showAichat: boolean;
    showTerminal: boolean
    setShowExplorer: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAichat: React.Dispatch<React.SetStateAction<boolean>>;
    setShowTerminal: React.Dispatch<React.SetStateAction<boolean>>
}
const ActivityBar = ({ setShowAichat, setShowExplorer, setShowTerminal, showAichat, showExplorer, showTerminal }: ActivityBarProps) => {

    return (
        <div className='flex w-14 shrink-0 flex-col items-center gap-2 border-r border-white/6 bg-[#111113]/90 py-3'>
            <ActivityIcon icon={Files} active={showExplorer} onClick={() => {
                setShowExplorer(!showExplorer)
            }} label='Explorer' />
            <ActivityIcon icon={Bot} active={showAichat} onClick={() => {
                setShowAichat(!showAichat)
            }} label='AI Chat' />

            <div className="mt-auto flex flex-col items-center gap-2">
                <div className="mb-1 h-px w-6 bg-white/6" />

                <ActivityIcon icon={SquareTerminal} active={showTerminal} onClick={() => {
                    setShowTerminal(!showTerminal)
                }} label='Terminal' />
            </div>
        </div>
    )
}

export default ActivityBar