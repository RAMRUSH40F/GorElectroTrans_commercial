import { isCancel } from "axios";
import { createEffect } from "effector";

import { IPlan, PlanDto } from "models/Plan";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

export const postFx = createEffect<DepParams<PlanDto>, IPlan, ApiError>(
    async ({ depId, data, controller }) => {
        try {
            const response = await authRequestFx({
                method: "POST",
                url: `/dep_${depId}/work_plan/data`,
                data,
                signal: controller.signal,
            });
            return { ...data, id: response.data } as IPlan;
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
                    "Не удалось добавить запись";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    },
);
