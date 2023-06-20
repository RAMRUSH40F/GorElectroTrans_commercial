import { createEffect } from "effector";
import { authRequestFx } from "..";
import { isCancel } from "axios";
import { ApiError, AuthError, DepParams } from "../types";
import { IDepartment, TDepartmentDto } from "models/Department";

export const postFx = createEffect<
    DepParams<TDepartmentDto>,
    IDepartment,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        const response = await authRequestFx({
            method: "POST",
            url: `/dep_${depId}/subdep/data`,
            data,
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
                err?.response?.data?.message ?? "Не удалось добавить отдел";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
