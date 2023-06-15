import { createEffect } from "effector";
import { IAttendance, TAttendanceDto } from "models/Attendance";
import { AuthError, authRequestFx } from "..";

interface ApiError {
    message: string;
}

interface Params {
    depId: string;
}

interface PostParams extends Params {
    attendanceResult: TAttendanceDto;
}

export const postAttendanceFx = createEffect<PostParams, IAttendance, ApiError>(
    async ({ depId, attendanceResult }) => {
        try {
            const response = await authRequestFx({
                method: "POST",
                url: `/dep_${depId}/attendance/data`,
                data: attendanceResult,
            });
            return response.data as IAttendance;
        } catch (error) {
            const err = error as AuthError;
            const message =
                err?.response?.data?.message ??
                "Не удалось добавить посещаемость";
            const customError: ApiError = { message };
            throw customError;
        }
    }
);
