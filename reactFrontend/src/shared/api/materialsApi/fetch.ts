import { isCancel } from "axios";
import { createEffect } from "effector";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

interface DownloadResponse {
    fileName: string;
    file: Blob;
}

export const fetchFx = createEffect<
    DepParams<string>,
    DownloadResponse,
    ApiError
>(async ({ depId, controller, data }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/content/data/${data}`,
            responseType: "blob",
            headers: {
                "Content-Type": "application/octet-stream",
            },
            signal: controller.signal,
        });
        return { file: response.data as Blob, fileName: data };
    } catch (error) {
        if (isCancel(error)) {
            const customError: ApiError = {
                message: "Запрос отменен",
                isCanceled: true,
            };
            throw customError;
        } else {
            const err = error as AuthError;
            const message =
                err?.response?.data?.message ?? "Не удалось скачать файл";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
