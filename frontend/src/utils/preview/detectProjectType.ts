export type PreviewProjectKind = "vite-react" | "static-html";

export function isViteReactProject(files: Record<string, string>): boolean {
  const pkgRaw = files["package.json"];
  if (!pkgRaw) return false;

  try {
    const pkg = JSON.parse(pkgRaw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return Boolean(deps.react && deps.vite);
  } catch {
    return false;
  }
}

export function detectPreviewProjectKind(
  files: Record<string, string>
): PreviewProjectKind {
  if (isViteReactProject(files)) return "vite-react";
  return "static-html";
}
