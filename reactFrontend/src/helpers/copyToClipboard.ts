import { createEffect } from "effector";

import { NOTICE, showNoticeFx } from "./notice";

interface CopyToClipboardFxParams {
    text: string;
    toastMessage?: string;
}

export const copyToClipboardFx = createEffect<
    CopyToClipboardFxParams,
    void,
    Error
>(({ text, toastMessage }) => {
    console.log(text);
    navigator.clipboard.writeText(text);

    if (toastMessage) {
        showNoticeFx({
            type: NOTICE.SUCCESS,
            message: toastMessage ?? "Успешно скопировано",
        });
    }
});
