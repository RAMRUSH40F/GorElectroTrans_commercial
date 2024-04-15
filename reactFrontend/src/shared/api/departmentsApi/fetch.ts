import { isCancel } from "axios";
import { createEffect } from "effector";

import { IDepartment } from "models/Department";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

export const fetchFx = createEffect<DepParams<null>, IDepartment[], ApiError>(
    async ({ depId, controller }) => {
        try {
            const response = await authRequestFx({
                method: "GET",
                url: `/dep_${depId}/subdep/data`,
                signal: controller.signal,
            });
            return response.data as IDepartment[];
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
                    err?.response?.data?.message ??
                    "Не удалось получить данные с сервера";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    },
);
