import { IAttendanceCredentials, TNewAttendance } from "../../models/Attendance";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    attendanceResult: TNewAttendance;
}

export interface PutParams extends Params {
    attendanceResult: TNewAttendance;
}

export interface DeleteParams extends Params {
    attendanceCredentials: IAttendanceCredentials;
}
