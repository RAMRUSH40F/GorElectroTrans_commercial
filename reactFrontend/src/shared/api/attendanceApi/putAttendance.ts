import { createEffect } from "effector";
import { TAttendanceDto } from "models/Attendance";
import { AuthError, authRequestFx } from "..";

interface ApiError {
    message: string;
}

interface Params {
    depId: string;
}

interface PutParams extends Params {
    attendanceResult: TAttendanceDto;
}

export const putAttendanceFx = createEffect<
    PutParams,
    TAttendanceDto,
    ApiError
>(async ({ depId, attendanceResult }) => {
    try {
        await authRequestFx({
            method: "PUT",
            url: `/dep_${depId}/attendance/data`,
            data: attendanceResult,
        });
        return attendanceResult;
    } catch (error) {
        const err = error as AuthError;
        const message =
            err?.response?.data?.message ?? "Не удалось добавить посещаемость";
        const customError: ApiError = { message };
        throw customError;
    }
});
