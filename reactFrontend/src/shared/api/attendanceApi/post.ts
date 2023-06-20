import { createEffect } from "effector";
import { IAttendance, AttendanceDto } from "models/Attendance";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, DepParams } from "../types";

export const postFx = createEffect<
    DepParams<AttendanceDto>,
    IAttendance,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        const response = await authRequestFx({
            method: "POST",
            url: `/dep_${depId}/attendance/data`,
            data,
            signal: controller.signal,
        });
        return response.data as IAttendance;
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
                "Не удалось добавить посещаемость";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
