import { ATTENDANCE_RESULT } from "../constants/attendanceResult";

export interface IAttendanceCredentials {
    lessonId: number;
    studentId: string;
}

export interface IAttendance extends IAttendanceCredentials {
    date: string;
    duration: number;
    name: string;
    subDepartment: string;
    success: ATTENDANCE_RESULT;
    teacher: string;
    topic: string;
}

export type TAttendanceDto = Pick<IAttendance, "lessonId" | "studentId" | "success">;