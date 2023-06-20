import { createEffect } from "effector";

interface DownloadParams {
    file: Blob;
    fileName: string;
}

export const downloadFileFx = createEffect<DownloadParams, string>(
    ({ file, fileName }) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.append(link);
        link.style.display = "none";
        const handleClick = (event: MouseEvent) => event.stopPropagation();
        link.addEventListener("click", handleClick, { once: true });
        const clickEvent = new MouseEvent("click", { bubbles: false });
        link.dispatchEvent(clickEvent);
        link.removeEventListener("click", handleClick);
        link.remove();
        URL.revokeObjectURL(url);
        return fileName;
    }
);
