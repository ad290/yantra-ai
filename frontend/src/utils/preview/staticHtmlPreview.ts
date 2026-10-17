import type { FileTreeType } from "../../features/files/types";

function walkStaticFiles(
  tree: FileTreeType[],
  acc: { html: string; css: string; js: string }
) {
  for (const item of tree) {
    if (item.type === "file" && item.extension === "html") {
      acc.html = item.content ?? "";
    }
    if (item.type === "file" && item.extension === "css") {
      acc.css = item.content ?? "";
    }
    if (item.type === "file" && item.extension === "js") {
      acc.js = item.content ?? "";
    }
    if (item.type === "folder") {
      walkStaticFiles(item.children, acc);
    }
  }
}

const emptyPreview = `
<!DOCTYPE html>
<html>
  <body
    style="
      margin: 0;
      background-color: #0a0a0c;
      color: #999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  >
    <div style="text-align: center">
      <h3 style="margin: 0 0 6px;">No html file found</h3>
      <p style="margin: 0; font-size: 14px; color: #666">
        Add an HTML file, or a React + Vite project with package.json
      </p>
    </div>
  </body>
</html>
`;

export function buildStaticHtmlPreview(tree: FileTreeType[]): string {
  const acc = { html: "", css: "", js: "" };
  walkStaticFiles(tree, acc);

  let html = acc.html;
  if (!html) return emptyPreview;

  if (acc.css) {
    html = html.includes("</head>")
      ? html.replace("</head>", `<style>${acc.css}</style></head>`)
      : `<style>${acc.css}</style>${html}`;
  }
  if (acc.js) {
    const script = `<script>\n${acc.js}\n<\/script>`;
    html = html.includes("</body>")
      ? html.replace("</body>", `${script}</body>`)
      : `${html}${script}`;
  }

  return html;
}
