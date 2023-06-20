import { createEffect } from "effector";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, DepParams } from "../types";
import { IMaterial } from "models/Plan";

export const deleteFx = createEffect<DepParams<IMaterial>, IMaterial, ApiError>(
    async ({ depId, data, controller }) => {
        try {
            await authRequestFx({
                method: "DELETE",
                url: `/dep_${depId}/content/data/${data.fileName}`,
                signal: controller.signal,
            });
            return data;
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
                    err?.response?.data?.message ?? "Не удалось удалить файл";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    }
);
