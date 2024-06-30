import { isCancel } from "axios";
import { createEffect } from "effector";

import { authRequestFx } from "..";
import { ApiError, AuthError, DateRange, DepParams } from "../types";

interface ReportResponse {
    file: Blob;
    dateRange: DateRange;
}

interface ReportParams extends DepParams<null>, DateRange {}

export const fetchPlanReportFx = createEffect<
    ReportParams,
    ReportResponse,
    ApiError
>(async ({ depId, controller, dateFrom, dateTo }) => {
    try {
        const response = await authRequestFx({
            method: "GET",
            url: `/dep_${depId}/report/stats`,
            responseType: "blob",
            headers: {
                "Content-Type": "application/octet-stream",
            },
            params: { dateFrom, dateTo },
            signal: controller.signal,
        });
        return {
            file: response.data as Blob,
            dateRange: { dateFrom, dateTo },
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
});
