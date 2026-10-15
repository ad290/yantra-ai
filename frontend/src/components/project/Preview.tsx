import { useMemo } from "react"
import type { FileTreeType } from "../../features/files/types"

interface PreviewProps {
  tree: FileTreeType[]
}
const Preview = ({ tree }: PreviewProps) => {
  const srcDocument = useMemo(() => {
    let html = ''
    let css = ''
    let js = ''

    const walk = (tree: FileTreeType[]) => {
      for (const item of tree) {
        if (item.type === 'file' && item.extension === 'html') {
          html = item.content!
        }
        if (item.type === 'file' && item.extension === 'css') {
          css = item.content!
        }
        if (item.type === 'file' && item.extension === 'js') {
          js = item.content!
        }
        if (item.type === 'folder') {
          walk(item.children)
        }
      }
    }
    walk(tree);

    if (!html) return `
    <DOCTYPE html>
    <html>
      <body 
      style = "
      margin: 0;
      background-color: #0a0a0c;
      color: #999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      "
      >
        <div style="text-align: center">
          <h3 style="margin: 0 0 6px;">No html file found</h3>
          <p style="margin: 0;font-size: 14px; color: #666">Please add an html file to your project</p>
        </div>
      </body>
    </html>
    `

    if (css) {
      html = html.includes("</head>") ? html.replace("</head>", `<style>${css}</style></head>`) : `<style>${css}</style>${html}`
    }
    if (js) {
      const script = `<script>\n${js}\n<\/script>`;
      html = html.includes("</body>") ? html.replace("</body>", `${script}</body>`) : `${html}${script}`
    }

    return html;
  }, [tree]);
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-10 items-center justify-between bg-[#111113] px-4">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium text-zinc-300">Preview</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 bg-white">
        <iframe
          title="Project Preview"
          srcDoc={srcDocument}
          sandbox="allow-scripts allow-forms allow-modals"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  )
}

export default Preview