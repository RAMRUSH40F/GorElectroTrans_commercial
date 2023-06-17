import { createEffect } from "effector";
import { AuthError, DepParams, authRequestFx } from "..";
import { IAttendance } from "../../../models/Attendance";
import { isCancel } from "axios";

interface ApiError {
    message: string;
    isCanceled: boolean;
}

interface FetchParams<T> extends Omit<DepParams<T>, "data"> {
    page: number;
    size: number;
    search: string;
}

interface FetchResponse {
    attendances: IAttendance[];
    totalPages: number;
}

export const fetchFx = createEffect<
    FetchParams<null>,
    FetchResponse,
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
        return { attendances: response.data as IAttendance[], totalPages };
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
