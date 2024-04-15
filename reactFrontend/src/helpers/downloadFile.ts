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
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return fileName;
    },
);
