import { createEffect } from "effector";

interface DownloadParams {
    file: Blob;
    fileName: string;
    container?: HTMLElement;
}

export const downloadFileFx = createEffect<DownloadParams, string>(
    ({ file, fileName, container = document.body }) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        link.style.display = "none";
        container.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return fileName;
    },
);
