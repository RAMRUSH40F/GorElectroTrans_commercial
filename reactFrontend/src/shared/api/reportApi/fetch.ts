import { isCancel } from "axios";
import { createEffect } from "effector";

import { IReportPeriod } from "pages/PlanPage/PlanReport/PlanReportForm/model/model";

import { authRequestFx } from "..";
import { ApiError, AuthError, DepParams } from "../types";

interface ReportResponse {
    file: Blob;
    period: IReportPeriod;
}

interface ReportParams extends DepParams<null> {
    quarter: number;
    year: number;
}

export const fetchFx = createEffect<ReportParams, ReportResponse, ApiError>(
    async ({ depId, controller, quarter, year }) => {
        try {
            const response = await authRequestFx({
                method: "GET",
                url: `/dep_${depId}/report/stats`,
                responseType: "blob",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                params: { quarter, year },
                signal: controller.signal,
            });
            return {
                file: response.data as Blob,
                period: { quoter: quarter, year },
            };
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
                    err?.response?.data?.message ?? "Не удалось скачать отчет";
                const customError: ApiError = { message, isCanceled: false };
                throw customError;
            }
        }
    },
);
