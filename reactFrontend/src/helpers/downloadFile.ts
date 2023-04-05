export const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    console.log(url);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.append(link);
    link.style.display = "none";
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
