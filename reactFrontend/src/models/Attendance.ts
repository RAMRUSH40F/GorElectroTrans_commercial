import { ATTENDANCE_RESULT } from "../constants/attendanceResult";

export interface AttendanceId {
    lessonId: number;
    studentId: string;
}

export interface IAttendance extends AttendanceId {
    date: string;
    duration: number;
    name: string;
    subDepartment: string;
    success: ATTENDANCE_RESULT;
    teacher: string;
    topic: string;
}

export type AttendanceDto = Pick<IAttendance, "lessonId" | "studentId" | "success">;