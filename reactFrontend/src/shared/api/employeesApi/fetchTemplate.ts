import { isCancel } from "axios";
import { createEffect } from "effector";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

interface ReportParams extends DepParams<null> {}

export const fetchTemplateFx = createEffect<ReportParams, Blob, ApiError>(
    async ({ depId, controller }) => {
        try {
            const response = await authRequestFx({
                method: "GET",
                url: `/dep_${depId}/students/studentAddTemplate`,
                responseType: "blob",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                signal: controller.signal,
            });
            return response.data as Blob;
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
                    err?.response?.data?.message ?? "Не удалось скачать шаблон";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    },
);
