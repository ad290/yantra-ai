import { Code2, Eye, Folder, Maximize, Minimize, Sparkles, TerminalIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ActivityBar from "../../../components/project/ActivityBar";
import Editor from "../../../components/project/Editor";
import Explorer from "../../../components/project/Explorer";
import Preview from "../../../components/project/Preview";
import TopBar from "../../../components/project/TopBar";
import LoadingScreen from "../../../components/shared/LoadingScreen";
import { useProjectDispatch } from "../store/hooks";
import { setCurrentProject } from "../store/project.slice";
import { useGetSingleProjectInformationQuery } from "../tanstack-query";
import { useFileDispatch, useFileSelector } from "../../files/store/hooks";
import { setIsPreviewFullScreen, setShowPreview } from "../../files/store/file.slice";
import { useGetFileTreeQuery } from "../../files/tanstack-query";
import FullScreenPreview from "../../../components/project/FullScreenPreview";
import BottomPanel from "../../../components/project/Editor/BottomPanel";
import AIChatSection from "../../../components/project/Editor/AIChatSection";

const ProjectPage = () => {
  const params = useParams();
  const { projectId } = params;
  const dispatch = useProjectDispatch();
  const fileOperationdispatch = useFileDispatch();
  const { showPreview, isPreviewFullScreen } = useFileSelector(state => state.fileOperations);
  const { data: project, isLoading, isError } = useGetSingleProjectInformationQuery(projectId!);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showAichat, setShowAichat] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"explorer" | "aichat" | "terminal" | "editor">("explorer");
  const { data: fileTree } = useGetFileTreeQuery(projectId!);
  useEffect(() => {
    project && dispatch(setCurrentProject(project!));
  }, [project, dispatch]);

  if (isLoading) return <LoadingScreen />
  // if there will be error in fetching the project from the backend then route back to home page
  if (isError) return <Navigate to="/" />
  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-[#0a0a0c]">
      <div className="pointer-events-none absolute -top-40 left-1/3 size-96 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 size-80 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* top bar */}
      <TopBar />

      {/* main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <ActivityBar
            showExplorer={showExplorer}
            showAichat={showAichat}
            showTerminal={showTerminal}
            setShowExplorer={setShowExplorer}
            setShowTerminal={setShowTerminal}
            setShowAichat={setShowAichat}
          />
        </div>

        {/* Explorer */}
        <div className={`${mobilePanel === "explorer" ? "flex" : "hidden"} w-full md:flex md:w-auto`}>
          <AnimatePresence initial={false}>
            {showExplorer || mobilePanel === "explorer" && <Explorer projectId={projectId!} fileTree={fileTree!} />}
          </AnimatePresence>
        </div>

        {/* Editor */}
        <div className={`${mobilePanel === "editor" ? "flex" : "hidden"} relative w-full min-w-0 flex-1 flex-col overflow-hidden border-x border-white/5 md:flex`}>
          <div className="pointer-events-none z-110 absolute right-2 top-2 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2">
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                itemType="button"
                onClick={() => fileOperationdispatch(setIsPreviewFullScreen(!isPreviewFullScreen))}
                title={isPreviewFullScreen ? "Exit Full Screen" : "FullScreen Preview"}
                className="pointer-events-auto flex items-center justify-center rounded-lg border border-white/10 bg-[#111113]/95 p-1.5 text-zinc-400 shadow-lg shadow-black/40 hover:text-white sm:p-2 backdrop-blur-xl "
              >
                {isPreviewFullScreen ? <Minimize size={13} /> : <Maximize size={13} />}
              </motion.div>
            )}

            <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 shadow-black backdrop-blur">
              {/* Editor button */}
              <button
                className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${!showPreview ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                onClick={() => {
                  fileOperationdispatch(setShowPreview(false))
                  fileOperationdispatch(setIsPreviewFullScreen(false))
                }}>
                {!showPreview && (
                  <motion.div
                    className="absolute inset-0 bg-linear-to-b from-zinc-700 to-zinc-800"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <Code2 size={14} className="relative" /> <span className="relative hidden sm:inline">Editor</span>
              </button>

              {/* Preview Button */}
              <button
                className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${showPreview ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                onClick={() => fileOperationdispatch(setShowPreview(true))}>
                {showPreview && (
                  <motion.div className="absolute inset-0 bg-linear-to-b from-zinc-700 to-zinc-800"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <Eye className="relative" size={14} /> <span className="relative hidden sm:inline">Preview</span>
              </button>
            </div>
          </div>

          {/* Editor and preview section */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {
              !showPreview ? <Editor /> : <Preview tree={fileTree!} />
            }
          </div>
          {/* Full screen preview */}
          <AnimatePresence>
            {isPreviewFullScreen && showPreview && <FullScreenPreview tree={fileTree!} />}
          </AnimatePresence>
          {/* Terminal Section */}
          <AnimatePresence>
            {showTerminal && <BottomPanel projectId={projectId!} setShowTerminal={setShowTerminal} />}
          </AnimatePresence>
        </div>

        {/* AI Chat section */}
        <div className={`${mobilePanel === "aichat" ? "flex" : "hidden"} w-full md:flex md:w-auto`}>
          <AnimatePresence initial={false}>
            {showAichat && <AIChatSection projectId={projectId!} />}
          </AnimatePresence>
        </div>
      </div>

      {/* bottom buttons */}
      <div className="flex items-center justify-around border-t border-white/6 bg-[#0f0f12] py-2 md:hidden">
        <button
          title="Explorer"
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${mobilePanel === "explorer" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          onClick={() => setMobilePanel("explorer")}>
          <Folder size={14} className="relative" /> <span className="relative hidden sm:inline">Explorer</span>
        </button>
        <button
          title="Editor"
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${mobilePanel === "editor" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          onClick={() => setMobilePanel("editor")}>
          <Code2 size={14} className="relative" /> <span className="relative hidden sm:inline">Editor</span>
        </button>
        <button
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${mobilePanel === "terminal" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          title="Terminal"
          onClick={() => {
            setShowTerminal(v => !v)
          }}>
          <TerminalIcon size={14} className="relative" /> <span className="relative hidden sm:inline">Terminal</span>
        </button>
        <button
          title="AI Chat"
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${mobilePanel === "aichat" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          onClick={() => {
            setShowAichat(true)
            setMobilePanel("aichat")
          }}>
          <Sparkles size={14} className="relative" /> <span className="relative hidden sm:inline">AI Chat</span>
        </button>
      </div>
    </div>
  )
}

export default ProjectPage