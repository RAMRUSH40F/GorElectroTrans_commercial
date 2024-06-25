import { isCancel } from "axios";
import { createEffect } from "effector";

import { IEmployee } from "models/Employee";

import { authRequestFx } from "..";
import { ApiError, AuthError, FetchParams } from "../types";

export const fetchByNameFx = createEffect<
    FetchParams<null>,
    IEmployee[],
    ApiError
>(async ({ depId, size = 5, search, controller }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/students/getByName`,
            params: { limit: size, key: search || null },
            signal: controller.signal,
        });
        return response.data;
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
});
