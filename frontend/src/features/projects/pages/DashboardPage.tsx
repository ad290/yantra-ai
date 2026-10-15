import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import SideBar from "../../../components/dashboard/SideBar";
import Navbar from "../../../components/shared/Navbar";
import { useAuthSelector } from "../../auth/store/hooks";
import RecentProjectList from "../../../components/dashboard/RecentProjectList";
import StarredProjectList from "../../../components/dashboard/StarredProjectList";
import CreateProjectModal from "../../../components/dashboard/CreateProjectModal";
import { Menu, X } from "lucide-react";

const DashboardPage = () => {
  const [activeSession, setActiveSession] = useState<"projects" | "starred">("projects");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mobileSidebar, setmobileSidebar] = useState(false);

  const { userData } = useAuthSelector(state => state.user);
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#07070c]">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-175 w-175 rounded-full bg-white/4 blur-[140px] dark:block" />
      <div className="pointer-events-none absolute right-0 top-1/3 hidden h-125 w-125 rounded-full bg-white/3 blur-[150px] dark:block" />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* navbar */}
        <Navbar />
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="hidden md:block">
            <SideBar activeSession={activeSession} setActiveSession={setActiveSession} />
          </div>
          {/* Mobile sidebar */}
          {mobileSidebar && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div onClick={() => setmobileSidebar(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-slate-50 shadow-2xl dark:bg-[#0a0a10]">
                <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200/70 dark:border-white/7">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Menu
                  </span>
                  <button
                    onClick={() => setmobileSidebar(false)}
                    className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/6" aria-label="Close Menu">
                    <X size={18} />
                  </button>
                </div>
                <SideBar activeSession={activeSession} setActiveSession={setActiveSession} />
              </div>
            </div>
          )}
          {/* content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 scrollbar-thin [scrollbar-color:rgba(100,116,139,0.35)_transparnt] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent &[::-webkit-scrollbar-thumb]:rounded-full &[::-webkit-scrollbar-thumb]:bg-slate-300 &[::-webkit-scrollbar-thumb]:border-2 &[::-webkit-scrollbar-thumb]:border-solid &[::-webkit-scrollbar-thumb]:border-transparent &[::-webkit-scrollbar-thumb]:bg-clip-padding hover:&[::-webkit-scrollbar-thumb]:bg-slate-400 dark:&[::-webkit-scrollbar-thumb]:bg-white/10 dark:hover:&[::-webkit-scrollbar-thumb]:bh-white/20">
            {/* Mobile header */}
            <div onClick={() => setmobileSidebar(true)} className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/8 dark:bg-white/4 dark:text-slate-300 md:hidden">
              <Menu size={16} /> Menu
            </div>
            {/* Welcome Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="flex items-center gap-2 text-lg md:text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {" "}
                  {(userData?.name)?.split(" ")[0] || "User"} 👋🏼
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ready to build amazing Today?</p>
              </div>
              {/* create project button */}
              <button className="flex shrink-0 justify-center items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-70 dark:bg-white dark:text-slate-900" onClick={() => setIsModalOpen(true)}>
                <FiPlus size={16} /> New Project
              </button>
            </div>

            {/* Tab header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{activeSession === "projects" ? "Recent" : "Starred"} Projects</h2>
            </div>

            <div className="pm">


              {/* Tab content */}
              {activeSession === "projects" ? <RecentProjectList
              /> : <StarredProjectList
              />}
            </div>

            {isModalOpen &&
              <CreateProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage