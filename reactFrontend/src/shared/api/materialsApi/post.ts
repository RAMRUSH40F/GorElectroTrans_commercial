import { createEffect } from "effector";
import { ApiError, AuthError, DepParams } from "../types";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { IMaterial } from "models/Plan";

interface MaterialParams<T> extends DepParams<T> {
    lessonId: number;
}

export const postFx = createEffect<
    MaterialParams<FormData>,
    IMaterial,
    ApiError
>(async ({ depId, data, controller, lessonId }) => {
    try {
        const response = await authRequestFx({
            method: "POST",
            url: `/dep_${depId}/content/data`,
            data,
            params: { lessonId },
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal: controller.signal,
        });
        return response.data as IMaterial;
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
                err?.response?.data?.message ?? "Не удалось добавить файл";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
