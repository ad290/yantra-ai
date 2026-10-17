import * as esbuild from "esbuild-wasm";
import type { Plugin } from "esbuild-wasm";

let esbuildReady: Promise<void> | null = null;

function ensureEsbuildInitialized(): Promise<void> {
  if (!esbuildReady) {
    esbuildReady = esbuild.initialize({
      wasmURL: `https://unpkg.com/esbuild-wasm@${esbuild.version}/esbuild.wasm`,
    });
  }
  return esbuildReady;
}

function posixDirname(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

function posixJoin(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");
}

function posixNormalize(path: string): string {
  const segments = path.split("/");
  const out: string[] = [];
  for (const seg of segments) {
    if (!seg || seg === ".") continue;
    if (seg === "..") {
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return out.join("/");
}

function resolveVirtualPath(
  importer: string,
  importPath: string,
  fileSet: Set<string>
): string | null {
  let base: string;
  if (importPath.startsWith("/")) {
    base = importPath.slice(1);
  } else if (importPath.startsWith(".")) {
    const dir = importer ? posixDirname(importer) : "";
    base = posixNormalize(posixJoin(dir, importPath));
  } else {
    return null;
  }

  const candidates = [
    base,
    `${base}.jsx`,
    `${base}.js`,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.mjs`,
    `${base}/index.jsx`,
    `${base}/index.js`,
    `${base}/index.tsx`,
    `${base}/index.ts`,
  ];

  for (const candidate of candidates) {
    if (fileSet.has(candidate)) return candidate;
  }
  return null;
}

function loaderForPath(path: string): esbuild.Loader {
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return "tsx";
  return "jsx";
}

function stripVersionRange(version: string): string {
  return version.replace(/^[\^~>=\s]*/, "").split(" ")[0] || version;
}

function buildImportMap(deps: Record<string, string>): Record<string, string> {
  const imports: Record<string, string> = {};

  for (const [name, range] of Object.entries(deps)) {
    const ver = stripVersionRange(range);
    const pkg = ver ? `${name}@${ver}` : name;
    imports[name] = `https://esm.sh/${pkg}?dev`;
  }

  const reactVer = deps.react ? stripVersionRange(deps.react) : "18";
  const reactDomVer = deps["react-dom"]
    ? stripVersionRange(deps["react-dom"])
    : reactVer;

  imports.react = `https://esm.sh/react@${reactVer}?dev`;
  imports["react-dom"] = `https://esm.sh/react-dom@${reactDomVer}?dev`;
  imports["react-dom/client"] = `https://esm.sh/react-dom@${reactDomVer}/client?dev`;
  imports["react/jsx-runtime"] = `https://esm.sh/react@${reactVer}/jsx-runtime?dev`;
  imports["react/jsx-dev-runtime"] =
    `https://esm.sh/react@${reactVer}/jsx-dev-runtime?dev`;

  return imports;
}

function findModuleEntry(files: Record<string, string>): string {
  const indexHtml = files["index.html"];
  if (indexHtml) {
    const scriptMatch = indexHtml.match(
      /<script[^>]*type\s*=\s*["']module["'][^>]*src\s*=\s*["']([^"']+)["']/i
    );
    if (scriptMatch) {
      const src = scriptMatch[1].replace(/^\//, "");
      const fileSet = new Set(Object.keys(files));
      const resolved = resolveVirtualPath("", `./${src}`, fileSet);
      if (resolved) return resolved;
      if (fileSet.has(src)) return src;
    }
  }

  const fallbacks = ["src/main.jsx", "src/main.tsx", "main.jsx", "main.tsx"];
  for (const entry of fallbacks) {
    if (files[entry]) return entry;
  }

  throw new Error(
    "Could not find a Vite entry (index.html module script or src/main.jsx)."
  );
}

function extractRootMarkup(indexHtml: string | undefined): string {
  if (!indexHtml) return '<div id="root"></div>';
  const match = indexHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) return '<div id="root"></div>';
  const body = match[1].trim();
  return body || '<div id="root"></div>';
}

function virtualFsPlugin(files: Record<string, string>): Plugin {
  const fileSet = new Set(Object.keys(files));

  return {
    name: "yantra-vfs",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") {
          return { path: args.path, namespace: "vfs" };
        }
        if (args.path.startsWith(".") || args.path.startsWith("/")) {
          const importer = args.importer.replace(/^vfs:/, "");
          const resolved = resolveVirtualPath(importer, args.path, fileSet);
          if (!resolved) {
            return {
              errors: [
                {
                  text: `Could not resolve "${args.path}" from "${importer || "entry"}"`,
                },
              ],
            };
          }
          return { path: resolved, namespace: "vfs" };
        }
        return { path: args.path, external: true };
      });

      build.onLoad({ filter: /.*/, namespace: "vfs" }, (args) => {
        const contents = files[args.path];
        if (contents == null) {
          return { errors: [{ text: `Missing virtual file: ${args.path}` }] };
        }
        return {
          contents,
          loader: loaderForPath(args.path),
        };
      });
    },
  };
}

export async function buildReactVitePreviewHtml(
  projectFiles: Record<string, string>
): Promise<string> {
  await ensureEsbuildInitialized();

  const pkgRaw = projectFiles["package.json"];
  if (!pkgRaw) {
    throw new Error("package.json is required for React + Vite preview.");
  }

  const pkg = JSON.parse(pkgRaw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const entry = findModuleEntry(projectFiles);

  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "esm",
    jsx: "automatic",
    plugins: [virtualFsPlugin(projectFiles)],
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    logLevel: "silent",
  });

  const bundle = result.outputFiles[0]?.text ?? "";
  const importMap = buildImportMap(deps);
  const bodyMarkup = extractRootMarkup(projectFiles["index.html"]);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="importmap">${JSON.stringify({ imports: importMap })}</script>
  </head>
  <body>
    ${bodyMarkup}
    <script type="module">${bundle}</script>
  </body>
</html>`;
}

export function previewErrorHtml(message: string): string {
  const safe = message.replace(/</g, "&lt;");
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#0a0a0c;color:#f87171;font-family:system-ui,sans-serif;padding:24px;">
    <h3 style="margin:0 0 8px;color:#fca5a5;">Preview failed</h3>
    <pre style="white-space:pre-wrap;font-size:13px;color:#fecaca;">${safe}</pre>
  </body>
</html>`;
}
