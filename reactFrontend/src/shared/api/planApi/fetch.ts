import { createEffect } from "effector";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, FetchParams, FetchResponse } from "../types";
import { IPlan } from "models/Plan";

export const fetchFx = createEffect<
    FetchParams<null>,
    FetchResponse<IPlan[]>,
    ApiError
>(async ({ depId, page, size, search, controller }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/work_plan/data`,
            params: { page, size, key: search || null },
            signal: controller.signal,
        });
        const totalCount = response.headers["lessons_count"];
        const totalPages = totalCount ? Math.ceil(totalCount / size) : 1;
        return { data: response.data as IPlan[], totalPages };
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
