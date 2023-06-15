import { createEffect } from "effector";
import { IAttendanceCredentials } from "models/Attendance";
import { AuthError, authRequestFx } from "..";

interface ApiError {
    message: string;
}

interface Params {
    depId: string;
}

interface DeleteParams extends Params {
    attendanceCredentials: IAttendanceCredentials;
}

export const deleteAttendanceFx = createEffect<
    DeleteParams,
    IAttendanceCredentials,
    ApiError
>(async ({ depId, attendanceCredentials }) => {
    try {
        await authRequestFx({
            method: "DELETE",
            url: `/dep_${depId}/attendance/data`,
            data: attendanceCredentials,
        });
        return attendanceCredentials;
    } catch (error) {
        const err = error as AuthError;
        const message =
            err?.response?.data?.message ?? "Не удалось удалить запись";
        const customError: ApiError = { message };
        throw customError;
    }
});
