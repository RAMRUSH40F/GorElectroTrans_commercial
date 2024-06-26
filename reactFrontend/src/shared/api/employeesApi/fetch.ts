import { isCancel } from "axios";
import { createEffect } from "effector";

import { IEmployee } from "models/Employee";

import { authRequestFx } from "..";
import { ApiError, AuthError, FetchParams, FetchResponse } from "../types";

export const fetchFx = createEffect<
    FetchParams<null>,
    FetchResponse<IEmployee[]>,
    ApiError
>(async ({ depId, page, size, search, controller, sort }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/students/data?${sort}`,
            params: { page, size, key: search || null },
            signal: controller.signal,
        });
        const totalAttendances = response.headers["students_count"];
        const totalPages = totalAttendances
            ? Math.ceil(totalAttendances / size)
            : 1;
        return { data: response.data as IEmployee[], totalPages };
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
