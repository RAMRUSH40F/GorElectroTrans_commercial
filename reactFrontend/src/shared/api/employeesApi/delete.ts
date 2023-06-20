import { createEffect } from "effector";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, DepParams } from "../types";

export const deleteFx = createEffect<DepParams<string>, string, ApiError>(
    async ({ depId, data, controller }) => {
        try {
            await authRequestFx({
                method: "DELETE",
                url: `/dep_${depId}/students/${data}`,
                signal: controller.signal,
            });
            return data as string;
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
                    err?.response?.data?.message ?? "Не удалось удалить запись";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    }
);
