import type { FileTreeType } from "../../features/files/types";

/** Flatten explorer tree to posix paths -> file contents */
export function flattenFileTree(
  tree: FileTreeType[],
  prefix = ""
): Record<string, string> {
  const files: Record<string, string> = {};

  for (const node of tree) {
    const path = prefix ? `${prefix}/${node.name}` : node.name;
    if (node.type === "folder") {
      Object.assign(files, flattenFileTree(node.children, path));
    } else if (node.type === "file" && node.content != null) {
      files[path] = node.content;
    }
  }

  return files;
}

/** Directory containing package.json (e.g. "" or "my-app/") */
export function findViteProjectRoot(files: Record<string, string>): string | null {
  const pkgPaths = Object.keys(files).filter((p) => p.endsWith("package.json"));
  if (!pkgPaths.length) return null;

  pkgPaths.sort((a, b) => a.length - b.length);
  const pkgPath = pkgPaths[0];
  return pkgPath === "package.json" ? "" : pkgPath.slice(0, -"package.json".length);
}

/** Paths relative to the Vite project root */
export function relativizeToRoot(
  files: Record<string, string>,
  root: string
): Record<string, string> {
  if (!root) return { ...files };
  const prefix = root.endsWith("/") ? root : `${root}/`;
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    if (!path.startsWith(prefix)) continue;
    out[path.slice(prefix.length)] = content;
  }
  return out;
}
