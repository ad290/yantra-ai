import { File } from "lucide-react";
import { BsFiletypeScss } from "react-icons/bs";
import { FaCss3, FaHtml5, FaJava, FaPython, FaReact, FaReadme } from "react-icons/fa";
import { IoLogoJavascript, } from "react-icons/io5";
import type { IconType } from "react-icons/lib";
import { SiJpeg } from "react-icons/si";
import { TbBrandCpp, TbBrandTypescript, TbFileTypePng, TbFileTypeSvg, TbJson } from "react-icons/tb";
export const getFileIcon = (extension: string) => {
    const key = extension.toLowerCase();

    const map: { [key: string]: { icon: IconType, color: string } } = {
        js: { icon: IoLogoJavascript, color: "text-yellow-400" },
        jsx: { icon: FaReact, color: "text-yellow-400" },
        json: { icon: TbJson, color: "text-yellow-400" },
        ts: { icon: TbBrandTypescript, color: "text-blue-400" },
        tsx: { icon: FaReact, color: "text-blue-400" },
        css: { icon: FaCss3, color: "text-violet-400" },
        scss: { icon: BsFiletypeScss, color: "text-violet-400" },
        md: { icon: FaReadme, color: "text-sky-400" },
        c: { icon: TbBrandCpp, color: "text-amber-400" },
        cpp: { icon: TbBrandCpp, color: "text-amber-400" },
        py: { icon: FaPython, color: "text-amber-400" },
        java: { icon: FaJava, color: "text-amber-400" },
        html: { icon: FaHtml5, color: "text-orange-400" },
        env: { icon: File, color: "text-zinc-400" },
        jpeg: { icon: SiJpeg, color: "text-amber-400" },
        png: { icon: TbFileTypePng, color: "text-amber-400" },
        svg: { icon: TbFileTypeSvg, color: "text-amber-400" },

    }
    return map[key] || { icon: File, color: "text-sky-400" };
}

export const getFolderColor = (name: string) => {
    const key = name.toLowerCase();

    const map: { [key: string]: string } = {
        src: "text-sky-400",
        public: "text-emerald-400",
        images: "text-pink-400",
        img: "text-pink-400",
        assets: "text-pink-400",
        css: "text-violet-400",
        styles: "text-violet-400",
        js: "text-yellow-400",
        scripts: "text-yellow-400",
        components: "text-sky-400",
        pages: "text-sky-400",
        utils: "text-amber-400",
        hooks: "text-teal-400",
        routes: "text-teal-400",
        api: "text-rose-400",
        node_modules: "text-zinc-400",
        dist: "text-zinc-400",
        build: "text-zinc-400"
    }
    return map[key] || "text-sky-400";
}
