import { createEffect } from "effector";
import { authRequestFx } from "..";
import { IAttendance } from "../../../models/Attendance";
import { isCancel } from "axios";
import { ApiError, AuthError, FetchParams, FetchResponse } from "../types";

export const fetchFx = createEffect<
    FetchParams<null>,
    FetchResponse<IAttendance[]>,
    ApiError
>(async ({ depId, page, size, search, controller }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/attendance/data`,
            params: { page, size, key: search || null },
            signal: controller.signal,
        });
        const totalAttendances = response.headers["attendance_count"];
        const totalPages = totalAttendances
            ? Math.ceil(totalAttendances / size)
            : 1;
        return { data: response.data as IAttendance[], totalPages };
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
