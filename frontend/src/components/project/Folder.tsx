import { ChevronRightIcon, FilePlus, FolderClosed, FolderOpen, FolderPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useFileDispatch, useFileSelector } from "../../features/files/store/hooks";
import { useCreateFileMutation, useCreateFolderMutation, useDeleteFileMutation, useUpdateFileMutation } from "../../features/files/tanstack-query";
import type { FileTreeType, FileType, RightClickMenuType } from "../../features/files/types";
import { getFileIcon, getFolderColor } from "../../utils/customization";
import RightClickMenu from "./RightClickMenu";
import { setActiveTab, setIsAddOpen, setIsDeleteOpen, setRename } from "../../features/files/store/file.slice";
import DeleteDialogBox from "./DeleteDialogBox";
interface FolderProps {
  projectId: string;
  tree: FileTreeType[];
  node: FileTreeType;
}

const Folder = ({ node, projectId, tree }: FolderProps) => {
  const dispatch = useFileDispatch();
  const { isAddOpen, rename, isDeleteOpen } = useFileSelector(state => state.fileOperations);

  const [isOpen, setisOpen] = useState(false);
  const folderColor = getFolderColor(node.name);
  const FileIcon = getFileIcon(node.extension ?? "");


  const [folderName, setfolderName] = useState("");
  const [fileName, setfileName] = useState("");

  const [createFileMutation, createFolderMutation, updateFileMutation, deleteFileMutation] = [useCreateFileMutation(), useCreateFolderMutation(), useUpdateFileMutation(), useDeleteFileMutation()]
  const [menu, setMenu] = useState<RightClickMenuType | null>(null);

  // handle Open rename input
  const handleOpenRenameInput = () => {
    dispatch(setRename({ value: node.name, renamingNode: node._id }));
  }

  // handle Open Add Input
  const handleOpenAdd = (type: "file" | "folder", folderId: string) => {
    dispatch(setIsAddOpen({ folderId: folderId, type: type }));
  }

  // handle Open Delete Dialog
  const handleOpenDeleteDialog = () => {
    dispatch(setIsDeleteOpen({ file: node }));
  }

  // handle Open File
  const handleOpenFile = (file: FileType) => {
    dispatch(setActiveTab(file));
  }

  // handle Create folder 
  const handleCreateFolder = () => {
    createFolderMutation.mutate({ projectId, folderName: folderName, parentId: node._id }, {
      onSuccess: () => {
        setfolderName("");
        dispatch(setIsAddOpen({
          folderId: "",
          type: null
        }));
      }
    });
  }

  // handle Create file
  const handleCreateFile = () => {
    createFileMutation.mutate({ projectId, content: "", fileName, language: "", parentId: isAddOpen?.folderId }, {
      onSuccess: () => {
        setfileName("");
        dispatch(setIsAddOpen({
          folderId: "",
          type: null
        }));
      }
    });
  }

  // handle rename file or folder
  const handleRename = () => {
    updateFileMutation.mutate({ content: node.content ?? "", fileId: node._id, fileName: rename.value }, {
      onSuccess: () => {
        dispatch(setRename({ value: "", renamingNode: "" }));
      }
    });
  }

  // handle delete file or folder
  const handleDelete = () => {
    deleteFileMutation.mutate(node._id, {
      onSuccess: () => {
        dispatch(setIsDeleteOpen({ file: null }));
      }
    });
  }

  if (node.type === "file") return (
    <div className="relative" onClick={() => handleOpenFile(node)}>
      {/* file name and icon section */}
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        className="group flex items-center justify-between py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        {/* File icon */}
        <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5">
          <FileIcon.icon size={16} className={`shrink-0 ${FileIcon.color}`} />
          {rename.renamingNode === node._id ? (
            <div className="py-1 pl-1">
              <motion.input
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                autoFocus
                value={rename.value}
                placeholder={node.name}
                className="w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
                onChange={(e) => {
                  dispatch(setRename({ ...rename, value: e.target.value }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                  if (e.key === "Escape") {
                    dispatch(setRename({ value: "", renamingNode: "" }));
                  }
                }}
              />
            </div>
          ) : (
            <span className="truncate text-sm text-zinc-300 transition-colors group-hover:text-white">{node.name}</span>
          )
          }
        </div>
      </motion.div>

      {/* right click menu  */}
      {menu && (
        <RightClickMenu
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          node={node}
          handleOpenAdd={handleOpenAdd}
          handleOpenRenameInput={handleOpenRenameInput}
          type={"file"}
          menu={menu}
          setMenu={setMenu}
        />
      )}
      {
        isDeleteOpen.file === node && <DeleteDialogBox handleDelete={handleDelete} />
      }
    </div>
  )
  return (
    <div className="relative">
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        className="group flex items-center justify-between py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5" onClick={() => setisOpen(!isOpen)}>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="shrink-0"
          >
            <ChevronRightIcon size={14} className="text-zinc-500" />
          </motion.div>
          {isOpen ? <FolderOpen size={16} className={`shrink-0 ${folderColor}`} /> : <FolderClosed size={16} className={`shrink-0 ${folderColor}`} />}
          {rename.renamingNode === node._id ? (
            <div className="py-1 pl-1">
              <motion.input
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                autoFocus
                value={rename.value}
                placeholder={node.name}
                className="w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
                onChange={(e) => {
                  dispatch(setRename({ ...rename, value: e.target.value }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                  if (e.key === "Escape") {
                    dispatch(setRename({ value: "", renamingNode: "" }));
                  }
                }}
              />
            </div>
          ) : (
            <span className="truncate text-sm text-zinc-300 transition-colors group-hover:text-white">{node.name}</span>
          )
          }
        </div>

        {/* create file and folder buttons */}
        <div className="hidden items-center gap-0.5 group-hover:flex">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => {
              e.stopPropagation();
              setisOpen(true)
              handleOpenAdd("file", node._id)
            }}
            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/7 hover:text-white"
            title="Create File"
          >
            <FilePlus size={13} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => {
              e.stopPropagation();
              setisOpen(true)
              handleOpenAdd("folder", node._id)
            }}
            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/7 hover:text-white"
            title="Create Folder"
          >
            <FolderPlus size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* right click menu  */}
      {menu && (
        <RightClickMenu
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          node={node}
          handleOpenAdd={handleOpenAdd}
          type="folder"
          menu={menu}
          setMenu={setMenu}
          handleOpenRenameInput={handleOpenRenameInput}
        />
      )}
      {/* add file or folder input section */}
      {(isAddOpen.folderId === node._id) && (
        <div className="py-1 pl-1">
          <motion.input
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            autoFocus
            value={isAddOpen.type === "file" ? fileName : folderName}
            placeholder={isAddOpen.type === "file" ? "File name" : "Folder name"}
            className="w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
            onChange={(e) => {
              if (isAddOpen.type === "file") {
                setfileName(e.target.value);
              } else {
                setfolderName(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                isAddOpen.type === "file" ? handleCreateFile() : handleCreateFolder()
              }
              if (e.key === "Escape") {
                dispatch(setIsAddOpen({ folderId: "", type: null }));
              }
            }}
          />
        </div>
      )}
      {/* child folders */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="ml-5 overflow-hidden border border-white/5 pl-1"
        >
          {node.children.map((child) => (
            <Folder
              key={child._id}
              node={child}
              projectId={projectId}
              tree={tree}
            />
          ))}

        </motion.div>
      )}
      {
        isDeleteOpen.file === node && <DeleteDialogBox handleDelete={handleDelete} />
      }
    </div>
  )
}

export default Folder