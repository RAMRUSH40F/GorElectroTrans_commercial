import { isCancel } from "axios";
import { createEffect } from "effector";

import { IEmployeeUploadResponse } from "models/Employee";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

export const uploadEmployeesFx = createEffect<
    DepParams<FormData>,
    IEmployeeUploadResponse,
    ApiError
>(async ({ depId, data, controller }) => {
    try {
        const response = await authRequestFx({
            method: "POST",
            url: `/dep_${depId}/students/importStudent`,
            data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal: controller.signal,
        });
        return response.data as IEmployeeUploadResponse;
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
                err?.response?.data?.message ?? "Не удалось загрузить файл";
            const customError: ApiError = { message, isCanceled: false };
            throw customError;
        }
    }
});
