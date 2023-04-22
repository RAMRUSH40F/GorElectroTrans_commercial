import { IAttendanceCredentials, TAttendanceDto } from "../../models/Attendance";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    attendanceResult: TAttendanceDto;
}

export interface PutParams extends Params {
    attendanceResult: TAttendanceDto;
}

export interface DeleteParams extends Params {
    attendanceCredentials: IAttendanceCredentials;
}
