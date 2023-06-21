export enum ATTENDANCE_RESULT {
    SUCCESS = 1,
    FAIL = 0,
}

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

export type AttendanceDto = Pick<
    IAttendance,
    "lessonId" | "studentId" | "success"
>;

export const ATTENDACE_RESULT_VALUE: { [key in ATTENDANCE_RESULT]: string } = {
    [ATTENDANCE_RESULT.SUCCESS]: "Зачет",
    [ATTENDANCE_RESULT.FAIL]: "Незачет",
};
