import type { FileTreeType } from "../../features/files/types";
import {
  flattenFileTree,
  findViteProjectRoot,
  relativizeToRoot,
} from "./flattenFileTree";
import { detectPreviewProjectKind } from "./detectProjectType";
import { buildStaticHtmlPreview } from "./staticHtmlPreview";

export type PreviewBuildResult = {
  html: string;
  kind: "vite-react" | "static-html" | "error";
};

export async function buildPreviewDocument(
  tree: FileTreeType[]
): Promise<PreviewBuildResult> {
  const flat = flattenFileTree(tree);
  const root = findViteProjectRoot(flat);
  const projectFiles = root != null ? relativizeToRoot(flat, root) : flat;

  const kind = detectPreviewProjectKind(projectFiles);

  if (kind === "vite-react") {
    try {
      const { buildReactVitePreviewHtml } = await import("./buildReactVitePreview");
      const html = await buildReactVitePreviewHtml(projectFiles);
      return { html, kind: "vite-react" };
    } catch (error) {
      const { previewErrorHtml } = await import("./buildReactVitePreview");
      const message =
        error instanceof Error ? error.message : "Unknown preview error";
      return { html: previewErrorHtml(message), kind: "error" };
    }
  }

  return {
    html: buildStaticHtmlPreview(tree),
    kind: "static-html",
  };
}
