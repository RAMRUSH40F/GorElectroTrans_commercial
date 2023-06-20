import { createEffect } from "effector";
import { AttendanceDto } from "models/Attendance";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, DepParams } from "../types";

export const putFx = createEffect<
    DepParams<AttendanceDto>,
    AttendanceDto,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        await authRequestFx({
            method: "PUT",
            url: `/dep_${depId}/attendance/data`,
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
