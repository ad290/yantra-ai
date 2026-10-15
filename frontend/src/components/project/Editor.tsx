import { useEffect, useState } from "react";
import { updateActiveTabContent } from "../../features/files/store/file.slice";
import { useFileDispatch, useFileSelector } from "../../features/files/store/hooks";
import { useUpdateFileMutation } from "../../features/files/tanstack-query";
import FileTabBar from "./Editor/FileTabBar";
import SaveFileBar from "./Editor/SaveFileBar";
import MonacoEditor from "@monaco-editor/react";
import EmptyEditorState from "./Editor/EmptyEditorState";
const Editor = () => {
  const [code, setCode] = useState("");
  const { activeTab } = useFileSelector(state => state.fileOperations);
  const updateFileMutation = useUpdateFileMutation();
  const [justSaved, setjustSaved] = useState(false);
  const dispatch = useFileDispatch();

  // handle Save file
  const handleSaveFile = () => {
    if (!activeTab) return;
    updateFileMutation.mutate({ content: code, fileName: activeTab?.name, fileId: activeTab?._id! }, {
      onSuccess: (data) => {
        setjustSaved(true);
        dispatch(updateActiveTabContent(data.file));
        setTimeout(() => {
          setjustSaved(false);
        }, 1500);
      }
    });
  }
  useEffect(() => {
    setCode(activeTab?.content || "");
  }, [activeTab]);
  return (
    <div className="flex flex-1 flex-col bg-[#0a0a0c] ">
      <FileTabBar />
      {/* save file bar */}
      {
        activeTab && (
          <SaveFileBar handleSaveFile={handleSaveFile} isSaving={updateFileMutation.isPending} justSaved={justSaved} />
        )
      }
      {/* editor */}
      <div className="min-h-0 flex-1">
        {activeTab ? (
          <MonacoEditor
            height={"100%"}
            theme="vs-dark"
            language={activeTab?.language || "plaintext"}
            value={code || activeTab?.content || ""}
            onChange={(value) => {
              if (!value) return;
              setCode(value);
            }}
            options={{
              fontSize: 14,
              automaticLayout: true,
              minimap: { enabled: true, },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12 }
            }}
          />
        ) : (
          <EmptyEditorState />
        )}
      </div>



    </div>
  )
}

export default Editor