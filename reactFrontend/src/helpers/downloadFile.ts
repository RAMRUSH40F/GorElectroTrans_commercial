export const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    console.log(url);
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
};
