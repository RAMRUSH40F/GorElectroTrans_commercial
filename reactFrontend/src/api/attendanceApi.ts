import { createEffect } from "effector";
import { AuthError, authRequestFx } from ".";
import { IAttendance } from "../types/Attendance";

interface FetchParams {
    depId: string | null;
    page: number;
    size: number;
    search: string;
    controller: AbortController;
}

interface FetchResponse {
    attendances: IAttendance[];
    totalPages: number;
}

interface AttendanceApiError {
    message: string;
}

export const fetchAttendanceFx = createEffect<FetchParams, FetchResponse, AttendanceApiError>(
    async ({ depId, page, size, search, controller }) => {
        try {
            const response = await authRequestFx({
                method: "GET",
                url: `/dep_${depId}/attendance/data`,
                params: { page, size, key: search || null },
                signal: controller.signal,
            });
            const totalAttendances = response.headers["attendance_count"];
            const totalPages = totalAttendances ? Math.ceil(totalAttendances / size) : 1;
            return { attendances: response.data as IAttendance[], totalPages };
        } catch (error) {
            const err = error as AuthError;
            const message = err?.response?.data?.message ?? "Не удалось получить данные с сервера";
            const customError: AttendanceApiError = { message };
            throw customError;
        }
    }
);
