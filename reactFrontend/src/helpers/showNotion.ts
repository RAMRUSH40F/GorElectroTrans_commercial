import { toast, Id, ToastOptions } from "react-toastify";
import { NOTION } from "../constants/notion";

const alertOptions: ToastOptions = {
    position: "top-right",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

export const showNotion = (type: NOTION, message: string): Id | undefined => {
    switch (type) {
        case NOTION.SUCCESS:
            return toast.success(message, alertOptions);
        case NOTION.ERROR:
            return toast.error(message, alertOptions);
        default:
            return;
    }
};
