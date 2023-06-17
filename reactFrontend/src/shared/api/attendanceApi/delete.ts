import { createEffect } from "effector";
import { AttendanceId } from "models/Attendance";
import { AuthError, DepParams, authRequestFx } from "..";
import { isCancel } from "axios";

interface ApiError {
    message: string;
    isCanceled: boolean;
}

export const deleteFx = createEffect<
    DepParams<AttendanceId>,
    AttendanceId,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        await authRequestFx({
            method: "DELETE",
            url: `/dep_${depId}/attendance/data1`,
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
                err?.response?.data?.message ?? "Не удалось удалить запись";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
