import { toast, ToastOptions } from "react-toastify";
import { createEffect } from "effector";

export enum NOTICE {
    SUCCESS = "success",
    ERROR = "error",
}

const noticeOptions: ToastOptions = {
    position: "top-right",
    autoClose: 700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

interface NoticeParams {
    type: NOTICE;
    message: string;
}

export const showNoticeFx = createEffect<NoticeParams, void, Error>(
    ({ type, message }) => {
        switch (type) {
            case NOTICE.SUCCESS:
                toast.success(message, noticeOptions);
                break;
            case NOTICE.ERROR:
                toast.error(message, noticeOptions);
                break;
            default:
                break;
        }
    }
);