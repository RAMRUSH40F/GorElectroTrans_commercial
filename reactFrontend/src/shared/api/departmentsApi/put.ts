import { isCancel } from "axios";
import { createEffect } from "effector";

import { IDepartment } from "models/Department";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

export const putFx = createEffect<
    DepParams<IDepartment>,
    IDepartment,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        await authRequestFx({
            method: "PUT",
            url: `/dep_${depId}/subdep/data`,
            data,
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
                err?.response?.data?.message ??
                "Не удалось сохранить изменения";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
