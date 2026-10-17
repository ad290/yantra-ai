import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import type { FileTreeType } from "../../features/files/types"
import { buildPreviewDocument } from "../../utils/preview/buildPreviewDocument"

interface PreviewProps {
  tree: FileTreeType[]
}

const treeSignature = (tree: FileTreeType[]): string => {
  const parts: string[] = []
  const walk = (nodes: FileTreeType[]) => {
    for (const node of nodes) {
      parts.push(`${node._id}:${node.updatedAt}:${node.content?.length ?? 0}`)
      if (node.children?.length) walk(node.children)
    }
  }
  walk(tree)
  return parts.join("|")
}

const Preview = ({ tree }: PreviewProps) => {
  const signature = useMemo(() => treeSignature(tree), [tree])
  const [srcDocument, setSrcDocument] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [previewKind, setPreviewKind] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    buildPreviewDocument(tree)
      .then((result) => {
        if (cancelled) return
        setSrcDocument(result.html)
        setPreviewKind(result.kind)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tree, signature])

  const previewLabel =
    previewKind === "vite-react" ? "React (Vite)" : "Preview"

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-10 items-center justify-between bg-[#111113] px-4">
        <div className="flex items-center gap-2">
          <div
            className={`size-2 rounded-full ${loading ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`}
          />
          <span className="text-sm font-medium text-zinc-300">{previewLabel}</span>
          {loading && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Loader2 size={12} className="animate-spin" />
              Building…
            </span>
          )}
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-white">
        {loading && !srcDocument && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0c] text-sm text-zinc-400">
            <Loader2 className="mr-2 animate-spin" size={18} />
            Preparing preview…
          </div>
        )}
        {srcDocument && (
          <iframe
            title="Project Preview"
            srcDoc={srcDocument}
            sandbox="allow-scripts allow-forms allow-modals"
            className="h-full w-full border-0"
          />
        )}
      </div>
    </div>
  )
}

export default Preview
