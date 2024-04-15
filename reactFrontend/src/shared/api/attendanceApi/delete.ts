import { isCancel } from "axios";
import { createEffect } from "effector";

import { AttendanceId } from "models/Attendance";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

export const deleteFx = createEffect<
    DepParams<AttendanceId>,
    AttendanceId,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        await authRequestFx({
            method: "DELETE",
            url: `/dep_${depId}/attendance/data`,
            signal: controller.signal,
            data,
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
